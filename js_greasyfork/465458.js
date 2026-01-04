// ==UserScript==
// @name         AutoInteract - Footmundo NewTabs
// @namespace    https://www.footmundo.com/
// @version      2.2
// @description  Interage automaticamente com todos os jogadores na lista de relacionamentos no Footmundo.
// @author       Vicente Ayuso
// @match        https://www.footmundo.com/relacionamentos/*
// @grant        none
// @license      MIT
// @changelog     Agora pode interagir romance
// @downloadURL https://update.greasyfork.org/scripts/465458/AutoInteract%20-%20Footmundo%20NewTabs.user.js
// @updateURL https://update.greasyfork.org/scripts/465458/AutoInteract%20-%20Footmundo%20NewTabs.meta.js
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
  const name = $(this).closest("tr").find("td:first-child a").text();
  const value = $(this).val();
  localStorage.setItem(`tipo-de-interacao-${jogadorId}-${name}`, value);
});

$(".padrao tr").each(function () {
  const name = $(this).find("td:first-child a").text();
  const value = localStorage.getItem(`tipo-de-interacao-${jogadorId}-${name}`);
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
    const preferenciasAmigaveis = [13, 12, 11, 10, 36, 37, 38, 9, 5, 4, 3, 2, 1];



const aguardarRedirecionamentoNewTab = function(newTab) {
  return new Promise(function(resolve) {
    const verificarRedirecionamento = function() {
      const newTabUrl = newTab.location.href;
      if (newTabUrl.startsWith("https://www.footmundo.com/interagir/jogador/")) {
        resolve();
      } else {
        setTimeout(verificarRedirecionamento, 1000);
      }
    };

    verificarRedirecionamento();
  });
};

const aguardarCarregamentoNewTab = function(newTab) {
  return new Promise(function(resolve) {
    const observer = new MutationObserver(function(mutations) {
      resolve();
    });

    observer.observe(newTab.document.body, {
      childList: true,
      subtree: true,
    });

    newTab.addEventListener('load', function() {
      observer.disconnect();
      resolve();
    });
  });
};

const carregarUrl = async function(url, reuseTab) {
  return new Promise(async function(resolve, reject) {
    const target = reuseTab ? reuseTab : '_blank';
    const newTab = window.open(url, target);
    await aguardarCarregamentoNewTab(newTab);
    setTimeout(() => {
      resolve(newTab);
    }, 1000);
  });
};

const verificarTextoProibido = async function(newTab) {
  const textoProibido = "Vocês precisam estar no mesmo local para interagirem.";

  const isProibido = newTab.document.body.innerText.includes(textoProibido);
  console.log("Texto proibido encontrado:", isProibido);
  return isProibido;
};


const selecionarLigacaoAmigavel = async function(newTab) {
  try {
    for (let i = 1; i <= 3; i++) {
      await aguardarCarregamentoNewTab(newTab);
      const selectInteracao = newTab.document.querySelector("select[name='interacao_select']");
      if (!selectInteracao) {
        newTab.close();
        return;
      }

      let optionAmigavel;
      for (let j = 0; j < preferenciasAmigaveis.length; j++) {
        const value = preferenciasAmigaveis[j];
        optionAmigavel = newTab.document.querySelector("optgroup[label='Amigáveis'] option[value='" + value + "']");
        if (optionAmigavel) {
          break;
        }
      }

      if (!optionAmigavel) {
        alert("Não foi possível encontrar uma interação amigável para " + link);
        newTab.close();
        return;
      }

      selectInteracao.value = optionAmigavel.value;
      newTab.document.querySelector("input[name='interagir']").click();
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  } finally {
    newTab.close();
  }
};




    const selecionarInteracaoAmigavel = async function(newTab) {
       try{
        for (let i = 1; i <= 3; i++) {
          await aguardarCarregamentoNewTab(newTab);
          const selectInteracao = newTab.document.querySelector("select[name='select_interacao']");
          if (!selectInteracao) {
            newTab.close();
            return;
          }

          let optionAmigavel;
          for (let j = 0; j < preferenciasAmigaveis.length; j++) {
            const value = preferenciasAmigaveis[j];
            optionAmigavel = newTab.document.querySelector("optgroup[label='Amigáveis'] option[value='" + value + "']");
            if (optionAmigavel) {
              break;
            }
          }

          if (!optionAmigavel) {
            alert("Não foi possível encontrar uma interação amigável para " + link);
            newTab.close();
            return;
          }

          selectInteracao.value = optionAmigavel.value;
          newTab.document.querySelector("input[name='interagir']").click();
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
          }finally{
          newTab.close();
        }
      };

    const selecionarLigacaoAmorosa = async function(newTab) {
      try {
        for (let i = 1; i <= 3; i++) {
          await aguardarCarregamentoNewTab(newTab);
          const selectInteracao = newTab.document.querySelector("select[name='interacao_select']");
          if (!selectInteracao) {
            newTab.close();
            return;
          }

          let optionAmorosa;
          for (let j = 0; j < preferenciasAmorosas.length; j++) {
            const value = preferenciasAmorosas[j];
            optionAmorosa = newTab.document.querySelector("optgroup[label='Amorosas'] option[value='" + value + "']");
            if (optionAmorosa) {
              break;
            }
          }

          if (!optionAmorosa) {
            alert("Não foi possível encontrar uma interação amorosa para " + link);
            newTab.close();
            return;
          }

          selectInteracao.value = optionAmorosa.value;
          newTab.document.querySelector("input[name='interagir']").click();
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } finally {
        newTab.close();
      }
    };




    const selecionarInteracaoAmorosa = async function(newTab) {
       try{
        for (let i = 1; i <= 3; i++) {
          await aguardarCarregamentoNewTab(newTab);
          const selectInteracao = newTab.document.querySelector("select[name='select_interacao']");
          if (!selectInteracao) {
            newTab.close();
            return;
          }

          let optionAmorosa;
          for (let j = 0; j < preferenciasAmorosas.length; j++) {
            const value = preferenciasAmorosas[j];
            optionAmorosa = newTab.document.querySelector("optgroup[label='Amorosas'] option[value='" + value + "']");
            if (optionAmorosa) {
              break;
            }
          }

          if (!optionAmorosa) {
            alert("Não foi possível encontrar uma interação amorosa para " + link);
            newTab.close();
            return;
          }

          selectInteracao.value = optionAmorosa.value;
          newTab.document.querySelector("input[name='interagir']").click();
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
       }finally{
          newTab.close();
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
        setTimeout(iniciarInteracao, 2000);
        return;
      }

      try {
        console.log('Carregando URL:', link);
        const newTab = await carregarUrl(link);
        await aguardarRedirecionamentoNewTab(newTab);

        const isProibido = await verificarTextoProibido(newTab);

        if (isProibido) {
          if (jogadorAtual.selectedOption === "Amigáveis") {
            const newTabLigacao = await carregarUrl(jogadorAtual.ligacao);
            await selecionarLigacaoAmigavel(newTabLigacao);
          } else if (jogadorAtual.selectedOption === "Amorosas") {
            const newTabLigacao = await carregarUrl(jogadorAtual.ligacao);
            await selecionarLigacaoAmorosa(newTabLigacao);
          }
          newTab.close(); // Feche a guia quando o texto proibido for encontrado
        } else {
          if (jogadorAtual.selectedOption === "Amigáveis") {
            await selecionarInteracaoAmigavel(newTab);
          } else if (jogadorAtual.selectedOption === "Amorosas") {
            await selecionarInteracaoAmorosa(newTab); // Função para selecionar interação amorosa (precisa ser implementada)
          }
        }
      } catch (error) {
        console.log(error);
      }

      linkIndex++; // Incrementa o linkIndex apenas quando a interação for bem-sucedida
      setTimeout(iniciarInteracao, 1000);
    };



    // Adiciona um evento de clique ao botão Interagir para iniciar a interação automática
    $("#btn-ini-interacao").on("click", function() {
      $(this).attr("disabled", true);
      iniciarInteracao();
    });

})();