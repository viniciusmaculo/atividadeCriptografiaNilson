// Função de Transposição Colunar

function transposicaoColunar(texto, chave) {
  let colunas = chave.length; // número de colunas vai ser o tamanho da chave
  let linhas = Math.ceil(texto.length / colunas); // calculo quantas linhas preciso (arredondando pra cima)

  // Criar a matriz que vai receber os caracteres
  let matriz = [];
  let index = 0; // índice para andar pelo texto
  for (let i = 0; i < linhas; i++) {
    matriz[i] = []; // cada linha da matriz é um array
    for (let j = 0; j < colunas; j++) {
      if (index < texto.length) {
        let caractere = texto[index];
        // se o caractere for espaço, troco por "#"
        matriz[i][j] = (caractere === " ") ? "#" : caractere;
      } else {
        // se não tiver mais letras no texto, preencho com "!"
        matriz[i][j] = "!";
      }
      index++; 
    }
  }

  // organização da ordem das colunas de acordo com a chave em ordem alfabética
  let ordem = chave.split("") // separo a chave em letras
    .map((letra, i) => ({letra, i})) // salvo letra e posição original
    .sort((a, b) => a.letra.localeCompare(b.letra)); // ordeno por ordem alfabética

  // leitura da matriz coluna por coluna na ordem definida acima
  let resultado = "";
  for (let k = 0; k < ordem.length; k++) {
    let col = ordem[k].i; // pego o índice da coluna original
    for (let i = 0; i < linhas; i++) {
      resultado += matriz[i][col]; // concateno os caracteres
    }
  }
  // retorno do texto quanto da matriz e a ordem (usados nos passos)
  return {texto: resultado, matriz: matriz, ordem: ordem};
}

// Função inversa (destransposição)

function destransposicaoColunar(texto, chave) {
  let colunas = chave.length;
  let linhas = Math.ceil(texto.length / colunas);

  // mesmo processo de ordenar a chave
  let ordem = chave.split("")
    .map((letra, i) => ({letra, i}))
    .sort((a, b) => a.letra.localeCompare(b.letra));

  // criamos a matriz preenchida com ""
  let matriz = Array.from({length: linhas}, () => Array(colunas).fill(""));

  // preenchimento da matriz coluna por coluna seguindo a ordem usada antes
  let index = 0;
  for (let k = 0; k < ordem.length; k++) {
    let col = ordem[k].i;
    for (let i = 0; i < linhas; i++) {
      matriz[i][col] = texto[index];
      index++;
    }
  }

  // percorre linha por linha para recuperar o texto original
  let resultado = "";
  for (let i = 0; i < linhas; i++) {
    for (let j = 0; j < colunas; j++) {
      let caractere = matriz[i][j];
      if (caractere === "#") {
        resultado += " "; // # volta a ser espaço
      } else if (caractere !== "!") {
        resultado += caractere; // desconsidera os !
      }
    }
  }
  return resultado;
}

// Funções de Vigenère

function vigenereCriptografar(texto, chave) {
  let alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#!0123456789";
  // Regex com os caracteres válidos
  texto = texto.toUpperCase().replace(/[^A-Z0-9#!]/g, "");
  chave = chave.toUpperCase();

  let resultado = "";
  for (let i = 0; i < texto.length; i++) {
    let letraTexto = alfabeto.indexOf(texto[i]); // posição da letra no alfabeto
    let letraChave = alfabeto.indexOf(chave[i % chave.length]); // posição da letra da chave no alfabeto (com o %, a chave se repete em looping até cobrir todo o texto)
    let letraCifrada = (letraTexto + letraChave) % alfabeto.length; // posição da letra cifrada (soma e usa % para o valor “dar a volta” caso passe do final do alfabeto)
    resultado += alfabeto[letraCifrada]; // pega a letra cifrada
  }
  return resultado;
}

function vigenereDescriptografar(texto, chave) {
  let alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#!0123456789";
  texto = texto.toUpperCase().replace(/[^A-Z0-9#!]/g, "");
  chave = chave.toUpperCase();

  let resultado = "";
  for (let i = 0; i < texto.length; i++) {
    let letraTexto = alfabeto.indexOf(texto[i]);
    let letraChave = alfabeto.indexOf(chave[i % chave.length]);
    // subtrai a chave e faz o módulo para não dar número negativo
    let letraClaro = (letraTexto - letraChave + alfabeto.length) % alfabeto.length;
    resultado += alfabeto[letraClaro];
  }
  return resultado;
}

// Função para mostrar passos

function mostrarPassos(textoOriginal, matriz, ordem, textoTransposto, textoFinal, chave) {
  let container = document.getElementById("passos");
  container.innerHTML = ""; // limpar a div

  // Passo 1 Mostrar texto com "#" no lugar dos espaços
  let p1 = document.createElement("div");
  p1.className = "passo";
  p1.innerHTML = "<b>Passo 1:</b> Texto preparado (espaços viram '#')<br>" + textoOriginal.replace(/ /g, "#");
  container.appendChild(p1);

  // Passo 2 Mostrar a matriz da transposição
  let p2 = document.createElement("div");
  p2.className = "passo";
  p2.innerHTML = "<b>Passo 2:</b> Matriz da Transposição<br>";
  let tabela = document.createElement("table");

  // Cabeçalho com a chave
  let thead = document.createElement("tr");
  for (let letra of chave) {
    let th = document.createElement("th");
    th.textContent = letra;
    thead.appendChild(th);
  }
  tabela.appendChild(thead);

  // Corpo da matriz
  for (let linha of matriz) {
    let tr = document.createElement("tr");
    for (let celula of linha) {
      let td = document.createElement("td");
      td.textContent = celula;
      tr.appendChild(td);
    }
    tabela.appendChild(tr);
  }
  p2.appendChild(tabela);
  container.appendChild(p2);

  // Passo 3 - Mostrar a ordem de leitura das colunas
  let p3 = document.createElement("div");
  p3.className = "passo";
  p3.innerHTML = "<b>Passo 3:</b> Ordem de leitura das colunas<br>" +
  ordem.map((o, i) => `Coluna ${o.i+1} -> posição ${i+1}`).join("<br>");
  container.appendChild(p3);

  // Passo 4 - Texto após a transposição
  let p4 = document.createElement("div");
  p4.className = "passo";
  p4.innerHTML = "<b>Passo 4:</b> Texto após Transposição<br>" + textoTransposto;
  container.appendChild(p4);

  // Passo 5 - Texto final depois da cifra de Vigenère
  let p5 = document.createElement("div");
  p5.className = "passo";
  p5.innerHTML = "<b>Passo 5:</b> Texto final após aplicar Vigenère<br>" + textoFinal;
  container.appendChild(p5);
}


// Processo Completo de Criptografar

function criptografar() {
  let chave = document.getElementById("chave").value;
  let textoOriginal = document.getElementById("textoOriginal").value.toUpperCase();

  // 1) Transposição colunar
  let transposicao = transposicaoColunar(textoOriginal, chave.toUpperCase());

  // 2) Vigenère no resultado da transposição
  let textoFinal = vigenereCriptografar(transposicao.texto, chave);

  // Mostrar o campo de resultado
  document.getElementById("resultado").value = textoFinal;

  // Mostrar os passos na tela
  mostrarPassos(textoOriginal, transposicao.matriz, transposicao.ordem, transposicao.texto, textoFinal, chave.toUpperCase());
}

// Processo Completo de Descriptografar

function descriptografar() {
  let chave = document.getElementById("chave").value;
  let textoCifrado = document.getElementById("textoOriginal").value.toUpperCase();

  // 1) Primeiro desfaz o Vigenère
  let textoDesvigenere = vigenereDescriptografar(textoCifrado, chave);

  // 2) Depois desfaz a transposição colunar
  let textoOriginal = destransposicaoColunar(textoDesvigenere, chave);

  document.getElementById("resultado").value = textoOriginal;

  document.getElementById("passos").innerHTML = "<div class='passo'><b>Resultado:</b> Texto original recuperado -> " + textoOriginal + "</div>";
}
