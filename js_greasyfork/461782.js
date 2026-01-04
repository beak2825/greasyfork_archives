// ==UserScript==
// @name         AutoInteract - Footmundo
// @namespace    https://www.footmundo.com/
// @version      1.8
// @description  Interage automaticamente com todos os jogadores na lista de relacionamentos no Footmundo.
// @author       Vicente Ayuso
// @match        https://www.footmundo.com/relacionamentos/*
// @grant        none
// @license      MIT
// @changelog     Agora pode interagir romance
// @downloadURL https://update.greasyfork.org/scripts/461782/AutoInteract%20-%20Footmundo.user.js
// @updateURL https://update.greasyfork.org/scripts/461782/AutoInteract%20-%20Footmundo.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // Adiciona uma nova div com class='bloc' imediatamente abaixo de uma outra div ja existente na pagina que possui class="titulo-pagina"
    const divTitulo = $(".titulo-pagina");
    const divNova = $("<div>");
    divTitulo.after(divNova);

    // Adiciona um id='caixa-do-script' dentro da nova div com class='bloc'
    const divScript = $("<div>").attr("id", "caixa-do-script");
    divNova.append(divScript);

    // Adiciona um botão do tipo submit com class="btn_padrao" dentro da div 'caixa-do-script'
    const btnInteragir = $("<button>").text("Interagir").addClass("btn-padrao").attr("id", "btn-ini-interacao");
    const pActionButton = $("<p>").attr("id", "actionbutton").append(btnInteragir);
    const h2Titulo = $("<h2>").text("Interação automática").attr("id", "h2interact");
    const h3popup = $("<h3>").text("OS POPUPS DEVEM ESTAR LIBERADOS PARA QUE O SCRIPT FUNCIONE").attr("id", "h3interact");
    const pTexto = $("<p>").text("Clique em interagir para começar a interagir").attr("id", "paragrafo-texto").css("text-align", "center");
    divScript.append(h2Titulo, pTexto, pActionButton, h3popup);

    // Muda a cor do cabeçalho h2 para preto
    h2Titulo.css("color", "black");
    h3popup.css("color", "red");
    // Adiciona o CSS fornecido
    const css = `
    #caixa-do-script {
      background-color: #f9f9f9;
      padding: 1em;
      margin: 1em 0;
      border: 1px solid #ddd;
      border-radius: 5px;
    }

    #btn-ini-interacao {
      background-color: #007bff;
      color: #fff;
      border: none;
      padding: 0.5em 1em;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    #btn-ini-interacao:hover {
      background-color: #0069d9;
    }

    #actionbutton {
      text-align: center;
      margin: 1em 0;
    }

    #h2interact {
      font-size: 1.5em;
      margin-top: 0;
      text-align: center;
    }

    #h3interact {
      font-size: 1.2em;
      margin: 1em 0;
      color: #dc3545;
      text-align: center;
    }
    .iframe-estilizado {
      width: 100%;
      height: 500px;
      display: none;
      margin: 0 auto;
      text-align: center;
      border: 1px solid #ddd;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }



    `;
const jogadorId = window.location.href.split("/").pop();
function addSelectColumn(row, isHeader) {
  const td = $("<td>");

  if (isHeader) {
    const button = $("<input>").attr({
      type: "button",
      class: "btn_padrao",
      name: "salvar_interacao",
      value: "Salvar",
    });

    button.on("click", function () {
      location.reload();
    });

    td.append(button);
  } else {
    const select = $("<select>").addClass("tipo-de-interacao");
    const options = ["Amigáveis", "Amorosas", "Ignorar"];

    for (const optionText of options) {
      const option = $("<option>").text(optionText).val(optionText);
      select.append(option);
    }

    td.append(select);
  }

  row.append(td);
}

$(".padrao tr").each(function (index) {
  const isHeader = index === 0;
  addSelectColumn($(this), isHeader);
});

$("body").on("change", ".tipo-de-interacao", function () {
  const index = $(this).closest("tr").index();
  const value = $(this).val();
  localStorage.setItem(`tipo-de-interacao-${jogadorId}-${index}`, value);
});

$(".padrao tr").each(function (index) {
  const value = localStorage.getItem(`tipo-de-interacao-${jogadorId}-${index}`);
  if (value) {
    $(this).find(".tipo-de-interacao").val(value);
  }
});
let pausar = false;
// Lista todos os links que possuem id="link_padrao"
const listaJogadores = [];
$(".padrao tr").each(function(index) {
    // Ignora a primeira linha (cabeçalho)
    if (index === 0) {
        return;
    }

    const firstTd = $(this).find("td:first-child");
    const linkNome = firstTd.find("a");

    if (linkNome.length > 0) {
        const href = linkNome.attr("href");
        const id = href.split("/").pop();
        const nome = linkNome.text();
        const ligacao = `https://www.footmundo.com/ligar/jogador/${id}`;
        const interacao = `https://www.footmundo.com/ir/interagir/jogador/${id}`;

        // Obtém a opção selecionada do <select> na linha atual
        const selectedOption = $(this).find(".tipo-de-interacao").val();

        listaJogadores.push({ nome, id, ligacao, interacao, selectedOption });
    }
});

console.log(listaJogadores);




const style = $("<style>").text(css);
$("head").append(style);



    let linkIndex = 0;

    // Lista de preferência das values disponíveis para interação amigável
    const preferenciasAmorosas = [24, 25, 26, 17, 22, 21, 50, 15, 18, 19, 20, 41];
    const preferenciasAmigaveis = [13, 12, 11, 10, 36, 9, 5, 4, 3, 2, 1];

    // Cria a div do iframe
    const divIframe = document.createElement("div");
    divIframe.id = "iframe";
    document.getElementById("caixa-do-script").appendChild(divIframe);

    // Cria o elemento iframe
    const iframe = document.createElement("iframe");
    iframe.setAttribute("class", "iframe-estilizado"); // adiciona uma classe para aplicar estilos CSS
    iframe.style.overflow = "hidden"; // Adicionado estilo para ocultar a scrollbar do iframe
    iframe.style.width = "100%";
    iframe.style.height = "500px";
    iframe.style.display = "none";
    iframe.style.margin = "0 auto";
    iframe.style.textAlign = "center";
    divIframe.appendChild(iframe);
    const btnIniInteracao = document.getElementById("btn-ini-interacao");
    btnIniInteracao.addEventListener("click", function() {
      iframe.style.display = "block";
    });


    const aguardarRedirecionamentoIframe = function() {
      return new Promise(function(resolve) {
        const verificarRedirecionamento = function() {
          const iframeUrl = iframe.contentWindow.location.href;
          if (iframeUrl.startsWith("https://www.footmundo.com/interagir/jogador/")) {
            resolve();
          } else {
            setTimeout(verificarRedirecionamento, 100);
          }
        };

        verificarRedirecionamento();
      });
    };
    const aguardarCarregamentoIframe = function() {
      return new Promise(function(resolve) {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const observer = new MutationObserver(function(mutations) {
          resolve();
        });

        observer.observe(iframeDoc.body, {
          childList: true,
          subtree: true,
        });

        iframe.onload = function() {
          observer.disconnect();
          resolve();
        };
      });
    };

    const carregarUrl = async function(url) {
      return new Promise(async function(resolve, reject) {
        iframe.src = url;
        await aguardarCarregamentoIframe();
        setTimeout(() => {
          resolve();
        }, 750);
      });
    };

    const verificarTextoProibido = async function() {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const textoProibido = "Vocês precisam estar no mesmo local para interagirem.";

      const isProibido = iframeDoc.body.innerText.includes(textoProibido);
      console.log("Texto proibido encontrado:", isProibido);
      return isProibido;
    };

    // Função para selecionar a interação amigável baseada na lista de preferências
    const selecionarInteracaoAmigavel = async function() {
      for (let i = 1; i <= 3; i++) {
        await aguardarCarregamentoIframe();
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        const selectInteracao = iframeDoc.querySelector("select[name='interacao']");
        if (!selectInteracao) {
          iframe.contentWindow.close();
          return;
        }

        let optionAmigavel;
        for (let j = 0; j < preferenciasAmigaveis.length; j++) {
          const value = preferenciasAmigaveis[j];
          optionAmigavel = iframeDoc.querySelector("optgroup[label='Amigáveis'] option[value='" + value + "']");
          if (optionAmigavel) {
            break;
          }
        }

        if (!optionAmigavel) {
          alert("Não foi possível encontrar uma interação amigável para " + link);
          iframe.contentWindow.close();
          return;
        }

        selectInteracao.value = optionAmigavel.value;
        iframeDoc.querySelector("input[name='interagir']").click();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    };
    const selecionarInteracaoAmorosa = async function() {
      for (let i = 1; i <= 3; i++) {
        await aguardarCarregamentoIframe();
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        const selectInteracao = iframeDoc.querySelector("select[name='interacao']");
        if (!selectInteracao) {
          iframe.contentWindow.close();
          return;
        }

        let optionAmorosa;
        for (let j = 0; j < preferenciasAmorosas.length; j++) {
          const value = preferenciasAmorosas[j];
          optionAmorosa = iframeDoc.querySelector("optgroup[label='Amorosas'] option[value='" + value + "']");
          if (optionAmorosa) {
            break;
          }
        }

        if (!optionAmorosa) {
          alert("Não foi possível encontrar uma interação amorosa para " + link);
          iframe.contentWindow.close();
          return;
        }

        selectInteracao.value = optionAmorosa.value;
        iframeDoc.querySelector("input[name='interagir']").click();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    };






    const iniciarInteracao = async function() {
      // Verificar se todos os links foram abertos
      if (linkIndex >= listaJogadores.length) {
        return;
      }

      const jogadorAtual = listaJogadores[linkIndex];
      const link = jogadorAtual.interacao;

      // Verificar a opção selecionada para o jogador atual
      if (jogadorAtual.selectedOption === "Ignorar") {
        console.log("Ignorando:", jogadorAtual.nome);
        linkIndex++;
        setTimeout(iniciarInteracao, 1000);
        return;
      }

      try {
        console.log('Carregando URL:', link);
        await carregarUrl(link);
        await aguardarRedirecionamentoIframe();

        const isProibido = await verificarTextoProibido();

        if (isProibido & jogadorAtual.selectedOption === "Amigáveis") {
          await carregarUrl(jogadorAtual.ligacao);
          await selecionarInteracaoAmigavel(); // Chame a função selecionarInteracaoAmigavel após o redirecionamento para a página de ligação
        }
        else if (isProibido & jogadorAtual.selectedOption === "Amorosas" ){
           await carregarUrl(jogadorAtual.ligacao);
           await selecionarInteracaoAmorosa();
        }
        else {
          if (jogadorAtual.selectedOption === "Amigáveis") {
            await selecionarInteracaoAmigavel();
          } else if (jogadorAtual.selectedOption === "Amorosas") {
            await selecionarInteracaoAmorosa(); // Função para selecionar interação amorosa (precisa ser implementada)
          }
        }
      } catch (error) {
        console.log(error);
      }

      linkIndex++; // Incrementa o linkIndex apenas quando a interação for bem-sucedida
      setTimeout(iniciarInteracao, 500);
    };



    // Adiciona um evento de clique ao botão Interagir para iniciar a interação automática
    $("#btn-ini-interacao").on("click", function() {
      $(this).attr("disabled", true);
      iniciarInteracao();
    });

})();
