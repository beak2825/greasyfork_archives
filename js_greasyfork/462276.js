// ==UserScript==
// @name         AutoMundo - Jantar
// @namespace    Vicente Ayuso
// @version      1.2
// @description  Automatiza algumas tarefas do footmundo
// @match        https://www.footmundo.com/*
// @match        https://www.footmundo.com/foco/jogador/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462276/AutoMundo%20-%20Jantar.user.js
// @updateURL https://update.greasyfork.org/scripts/462276/AutoMundo%20-%20Jantar.meta.js
// ==/UserScript==

$(function() {

  //-------------------ZONA DE CSS--------------------------------------------------------------
  // Adiciona o estilo em CSS
    $("<style>").text(`
      #automundo {
        background-color: #f8f9fa;
        border: 1px solid #dee2e6;
        padding: 10px;
        margin-top: 10px;
        border-radius: 5px;
      }

      .summary-automundo {
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;

      }

      .h3-automundo {
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 10px;
        margin-top: 10px;
        color: black;
        text-align: center;
      }

      .p-automundo {
        margin: 0;
      }

      .btn-automundo {
        background-color: #007bff;
        border-color: #007bff;
        color: #fff;
        font-size: 10px;
        font-weight: bold;
        padding: 6px 12px;

        border-radius: 5px;
        cursor: pointer;
        text-align: center;
      }

      .btn-automundo:hover {
        background-color: #0069d9;
        border-color: #0062cc;
        color: #fff;
      }

      .btn-automundo:focus {
        outline: none;
        box-shadow: none;
      }
      .geral {
        display: block;
        margin: 5px;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      /* Estilize o select */
      .select-automundo {
        display: block;
        width: 65%;
        height: 30px;
        padding: 0.5rem;
        font-size: 12px;
        font-weight: 400;
        line-height: 1.5;
        color: #212529;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #ced4da;
        border-radius: 0.25rem;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      }

      /* Estilize as opções do select */
      .select-automundo option {
        color: #212529;
        background-color: #fff;
        padding: 0.5rem;
      }

      /* Estilize a seta do select */
      .select-automundo:after {
        content: "";
        position: absolute;
        top: 50%;
        right: 1rem;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0.375rem 0.375rem 0 0.375rem;
        border-color: #6c757d transparent transparent transparent;
        pointer-events: none;
      }


    `).appendTo("head");





//-----------------FIM DA ZONA DE CSS----------------------------


//-----------------ZONA DE VARIAVEIS GLOBAIS----------------------------
    // Extrai o número da URL do link usando uma expressão regular
    var idChar = $("#alterafoto").attr("href").match(/\/(\d+)$/)[1];

  // Extrai o número da URL do link usando uma expressão regular
  var idChar = $("#alterafoto").attr("href").match(/\/(\d+)$/)[1];

  // Mapeamento dos nomes dos estados para seus respectivos IDs
  const estadosMap = {
    "Bahia": 7,
    "Buenos Aires": 4,
    "Ceará": 8,
    "Minas Gerais": 3,
    "Paraná": 6,
    "Pernambuco": 9,
    "Rio de Janeiro": 1,
    "Rio Grande do Sul": 5,
    "São Paulo": 2
  };

  // Extrai o nome do estado do segundo link do primeiro span dentro da div com id 'info_perfil'
  const estadoNome = $("#info_perfil span:first a:eq(1)").text();

  // Encontra o ID correspondente ao nome do estado
  const idEstado = estadosMap[estadoNome];

  // Mapeamento entre idLocal e idEstado
  const localEstadoMap = {
    1787: 6, //Paraná
    1131: 7, //Bahia
    1093: 4, //Buenos Aires
    982: 8, // Ceará
    980: 3, //  Minas Gerais
    624: 9, // Pernambuco
    988: 5, // Rio grande do sul
    429: 1, // Rio de Janeiro
    2166: 2 // São Paulo
  };
   // Encontra o idLocal correspondente ao idEstado
  const idLocal = Object.keys(localEstadoMap).find(key => localEstadoMap[key] === idEstado);

//-----------------ZONA DA ESTRUTURA PADRÃO HTML----------------------------




    // Adiciona o details diretamente à div com classe "cAlign"
    $(".cAlign .content .top").after(
      $("<details>", {id: "automundo"}).append(
        $("<summary>", {class: "summary-automundo"}).text("AutoMundo"),
        $("<div>", {class: "d-flex align-items-center flex-wrap justify-content-between"}).append(
          $("<span>", {id: "comer", class: "geral"}).append(
            $("<h3>", {class: "h3-automundo"}).text("Comer"),
            $("<p>", {class: "p-automundo"}).append(
              $("<input>", {type: "submit", class: "btn-automundo", name: "Comer", value: "Comer"})
            )
          )
        )
      )
    );
    $("#mudarfoco h3, #toCT h3", "#comer h3").css({
    "text-align": "center"
      });
  //Alinha os spans horizontalmente
    $("#automundo .geral").css("display", "inline-block");


    // Imprime o número extraído do link no console
    console.log(idChar);


//
//----------------------------------- ZONA DAS FUNÇÕES-------------------------------------------------------

//-------------------------ZONA DO BOTÃO DE COMER-------------------------------------------------------
//
    $(document).on('click', 'input[name="Comer"]', async function() {
    // Cria o iframe com o link
    const iframeComer = $("<iframe>").attr("src", `https://www.footmundo.com/move-to/local/${idLocal}`);
    $("body").append(iframeComer);

    // Aguarda o iframe ser carregado
    await new Promise(resolve => iframeComer.on("load", resolve));


    iframeComer.remove();

    // Cria o iframe com o link
    const iframeRest = $("<iframe>").attr("src", `https://www.footmundo.com/jantar/local/${idLocal}`);
    $("body").append(iframeRest);

    // Aguarda o iframe ser carregado
    await new Promise(resolve => iframeRest.on("load", resolve));

    // Atualiza o conteúdo do iframeComer
    const iframeContents3 = iframeRest.contents();
    // Marca o input radio com value '4'
      iframeContents3.find("input[type='radio'][value='4']").prop("checked", true);

      // Clica no botão 'pedir'
      iframeContents3.find("input[type='submit'][name='pedir']").click();

      // Aguarda 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Remove o iframe do HTML
      iframeRest.remove();

      // Exibe um alerta com a mensagem "Você foi comido"
      alert("Você foi comido");
    });
  //
//

  });



