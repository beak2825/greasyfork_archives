// ==UserScript==
// @name         AutoMundo
// @namespace    Vicente Ayuso
// @author       Vicente Ayuso
// @version      1.8
// @description  Automatiza algumas tarefas do footmundo
// @match        https://www.footmundo.com/*
// @match        https://www.footmundo.com/foco/jogador/*
// @match        https://www.footmundo.com/dinheiro/empresa/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462275/AutoMundo.user.js
// @updateURL https://update.greasyfork.org/scripts/462275/AutoMundo.meta.js
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
      #caixa-do-script {
      background-color: #f9f9f9;
      padding: 1em;
      margin: 1em 0;
      border: 1px solid #ddd;
      border-radius: 5px;
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
    "São Paulo": 2,
    "Lisboa": 10,
    "Londres": 11
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
    2166: 2, // São Paulo
    4191: 11, // Londres
    4094: 10, // Lisboa

  };
   // Encontra o idLocal correspondente ao idEstado
  const idLocal = Object.keys(localEstadoMap).find(key => localEstadoMap[key] === idEstado);

//-----------------ZONA DA ESTRUTURA PADRÃO HTML----------------------------




    // Adiciona o details diretamente à div com classe "cAlign"
    $(".cAlign .content .top").after(
      $("<details>", {id: "automundo"}).append(
        $("<summary>", {class: "summary-automundo"}).text("AutoMundo"),
        $("<div>", {class: "d-flex align-items-center flex-wrap justify-content-between"}).append(
          $("<span>", {id: "mudarfoco", class: "geral"}).append(
            $("<h3>", {class: "h3-automundo"}).text("Mudar foco"),
            $("<p>", {class: "p-automundo"}).append(
              $("<input>", {type: "submit", class: "btn-automundo", name: "FocoTreinar", value: "Treinar"}),
              $("<input>", {type: "submit", class: "btn-automundo", name: "FocoAprimorar", value: "Aprimorar"})
            )
          ),
          $("<span>", {id: "toCT", class: "geral"}).append(
            $("<h3>", {class: "h3-automundo"}).text("Ir ao CT"),
            $("<p>", {class: "p-automundo"}).append(
              $("<input>", {type: "submit", class: "btn-automundo", name: "IrAoCT", value: "Ir ao CT"})
            )
          ),
          $("<span>", {id: "comer", class: "geral"}).append(
            $("<h3>", {class: "h3-automundo"}).text("Jantar e Serenata"),
            $("<p>", {class: "p-automundo"}).append(
              $("<input>", {type: "submit", class: "btn-automundo", name: "Comer", value: "Ir ao Restaurante"})
            )
          ),
          $("<span>", {id: "Embaixadinhas", class: "geral"}).append(
            $("<h3>", {class: "h3-automundo"}).text("Embaixadinhas"),
            $("<p>", {class: "p-automundo"}).append(
              $("<input>", {type: "submit", class: "btn-automundo", name: "Embaixadinhas", value: "Usar Bola"})
            )
          ),
        )
      )
    );
    $("#mudarfoco h3, #toCT h3", "#comer h3", "#Embaixadinhas h3").css({
    "text-align": "center"
      });
  //Alinha os spans horizontalmente
    $("#automundo .geral").css("display", "inline-block");


    // Imprime o número extraído do link no console
    console.log(idChar);


//
//----------------------------------- ZONA DAS FUNÇÕES-------------------------------------------------------
//
//---------------------- ZONA DO BOTÃO DE IR AO TREINO-------------------------------------------------------
//
//
//
    // Adiciona um evento de clique ao botão "IrAoCT"
    $("input[name='IrAoCT']").click(function() {
        // Extrai o número do time da URL do perfil
        var idTime = $("#info_perfil a[href^='time/']").attr('href').split('/').pop();

        // Cria um iframe e carrega a página do CT
        var iframeCT = $("<iframe>", {src: "https://www.footmundo.com/time/" + idTime}).appendTo("body");
        iframeCT.on("load", function() {
            // Encontra o link "local/" na quinta coluna da tabela
            var idCT = $(this).contents().find("#info-clube tr:nth-child(5) td:nth-child(2) a[href^='local/']").attr("href").split("/").pop();

            // Armazena o idCT na página principal
            console.log("idCT:", idCT);

            // Fecha o iframe
            $(this).remove();

            // Cria um novo iframe e carrega a página para se mudar para o CT
            var iframeMudarCT = $("<iframe>", {src: "https://www.footmundo.com/move-to/local/" + idCT}).appendTo("body");
            iframeMudarCT.on("load", function() {
                // Aguarda 1 segundo antes de fechar o iframe e mostrar o alerta
                setTimeout(function() {
                    $(this).remove();
                    alert("Você foi ao CT");
                    iframeMudarCT.remove();
                    location.reload();
                }, 10);
            });
        });
    });
//
//
//
//---------------------- ZONA DO BOTÃO DE MUDAR O FOCO PARA TREINO-------------------------------------------------------
//
//
//

    // Adiciona um evento de clique para o botão "FocoTreinar"
    $('input[name="FocoTreinar"]').on('click', function() {
        // Cria um iframe e o adiciona à página
        var iframe = $("<iframe>", {src: "https://www.footmundo.com/foco/jogador/" + idChar, id: "automundo-iframe"}).appendTo("body");

                // Extrai o número do time da URL do perfil
        var idTime = $("#info_perfil a[href^='time/']").attr('href').split('/').pop();

        // Cria um iframe e carrega a página do CT
        var iframeCT = $("<iframe>", {src: "https://www.footmundo.com/time/" + idTime}).appendTo("body");
        iframeCT.on("load", function() {
            // Encontra o link "local/" na quinta coluna da tabela
            var idCT = $(this).contents().find("#info-clube tr:nth-child(5) td:nth-child(2) a[href^='local/']").attr("href").split("/").pop();

            // Armazena o idCT na página principal
            console.log("idCT:", idCT);

            // Fecha o iframe
            $(this).remove();

            // Cria um novo iframe e carrega a página para se mudar para o CT
            var iframeMudarCT = $("<iframe>", {src: "https://www.footmundo.com/move-to/local/" + idCT}).appendTo("body");
            iframeMudarCT.on("load", function() {
                // Aguarda 1 segundo antes de fechar o iframe e mostrar o alerta
                setTimeout(function() {
                    $(this).remove();
                    iframeMudarCT.remove();
                    location.reload();
                }, 10);
            });
        });

        // Função para executar as ações após o carregamento do iframe
        function afterIframeLoad() {
            // Seleciona o select com nome "foco_carreira" e muda a opção selecionada para "2"
            iframe.contents().find('select[name="foco_carreira"]').val('2');

            // Adiciona a chamada "onchange" ao select
            iframe.contents().find('select[name="foco_carreira"]').attr('onchange', 'this.form.submit();');

            // Dispara o evento "change" programaticamente
            iframe.contents().find('select[name="foco_carreira"]').trigger('change');

            // Adiciona o evento "load" novamente para aguardar a próxima página carregar
            iframe.on('load', function() {
                // Clica no botão com nome "mudar_foco"
                iframe.contents().find('input[name="mudar_foco"]').click();

                // Adiciona o evento "load" novamente para aguardar a próxima página carregar
                iframe.on('load', function() {
                    // Remove o iframe da página
                    iframe.remove();

                    // Exibe um alerta na página principal
                    alert('O foco do atleta foi trocado para Treinar');
                    location.reload();
                });
            });
        }

        // Adiciona o evento "load" ao iframe para executar a função "afterIframeLoad" quando a página carregar
        iframe.on('load', afterIframeLoad);
    });
//
//
//
//---------------------- ZONA DO BOTÃO DE MUDAR O FOCO PARA APRIMORAR-------------------------------------------------------
//
//
//

  // Adiciona um event listener para o botão FocoAprimorar
      // Criar a variável iframeModal e carregar o link
      $('input[name="FocoAprimorar"]').on('click', function() {
        // Cria um iframe e o adiciona à página
        var iframe = $("<iframe>", {src: "https://www.footmundo.com/foco/jogador/" + idChar, id: "automundo-iframe"}).appendTo("body");
        // Espera o iframe carregar
        setTimeout(function() {
          // Seleciona o select com nome "foco_carreira" e muda a opção selecionada para "1"
          iframe.contents().find('select[name="foco_carreira"]').val("1");

          // Adiciona a chamada "onchange" ao select
          iframe.contents().find('select[name="foco_carreira"]').attr('onchange', 'this.form.submit();');

          // Dispara o evento "change" programaticamente
          iframe.contents().find('select[name="foco_carreira"]').trigger('change');


          // Espera um pouco para a página mudar
          setTimeout(function() {
            // Procura pelo select com name="aprimorar_habilidade" no iframe
            var habilidadesSelect = iframe.contents().find('select[name="aprimorar_habilidade"]');

            // Copia todas as options desse select para uma variável chamada "id-habilidades"
            var idHabilidades = habilidadesSelect.html();

            // Cria um novo select com id="hab_disponiveis" e adiciona as options copiadas anteriormente
            var habDisponiveisSelect = $("<select>", {id: "hab_disponiveis", class:"select-automundo"}).html(idHabilidades);

            // Espera um pouco antes de mostrar o dialog
            setTimeout(function() {

              // Cria o dialog com o select de habilidades e o botão "Mudar-Foco"
              var dialog = $("<div>", {title: "Selecione a habilidade", class:"dialog-automundo"}).append(
              habDisponiveisSelect,
              $("<input>", {type: "submit", id: "armazena-a-habilidade", class:"btn-automundo", name: "Mudar-Foco"}).val("Escolher habilidade")
          );

              // Cria um novo parágrafo e adiciona o diálogo a ele
              var novoParagrafo = $("<p>", {class:"p-automundo"}).append(dialog);
              iframe.remove();
              // Adiciona o novo parágrafo ao span com o ID "mudarfoco"
              $("#mudarfoco").append(novoParagrafo);

              // Inicializa o dialog como um componente jQuery UI
              dialog.dialog({
                modal: true,
                draggable: false,
                resizable: false,
                width: 400,
                height: "auto",
                dialogClass: "dialog-automundo"
              })

            }, 100);
          }, 700);
        }, 700);

            });
      // Adiciona um evento para o botão "Mudar-Foco"
      $(document).on('click', 'input[name="Mudar-Foco"]', function() {
        // Cria um novo iframe com o link e o idChar
        var novoIframe = $("<iframe>", {src: "https://www.footmundo.com/foco/jogador/" + idChar, id: "automundo-iframe2"}).appendTo("body");

        // Espera o iframe carregar
        setTimeout(function() {
          // Seleciona o select com nome "foco_carreira" e muda a opção selecionada para "1"
          novoIframe.contents().find('select[name="foco_carreira"]').val("1");

          // Adiciona a chamada "onchange" ao select
          novoIframe.contents().find('select[name="foco_carreira"]').attr('onchange', 'this.form.submit();');

          // Dispara o evento "change" programaticamente
          novoIframe.contents().find('select[name="foco_carreira"]').trigger('change');

          // Espera um pouco para a página mudar
          setTimeout(function() {
            // Procura pelo select com name="aprimorar_habilidade" no iframe
            var habilidadesSelectDois = novoIframe.contents().find('select[name="aprimorar_habilidade"]');

            // Seleciona a option que estava armazenada na variável "habGuardada" do select "aprimorar_habilidade"
            var habGuardada = $('#hab_disponiveis').val();
            habilidadesSelectDois.val(habGuardada);

            // Clica no botão com nome "mudar_foco"
            novoIframe.contents().find('input[name="mudar_foco"]').click();

            // Espera um pouco para a página mudar novamente
            setTimeout(function() {
              // Remove o novo iframe da página
              novoIframe.remove();
              $('.dialog-automundo').remove();


              // Exibe um alerta com a habilidade selecionada
              alert('O foco do atleta foi trocado para Aprimorar a habilidade ');
              location.reload();
            }, 700);
          }, 700);
        }, 700);

      });

  //
//
//
//----------------------FIM ZONA DO BOTÃO DE MUDAR O FOCO PARA APRIMORAR-------------------------------------------------------
//
//
//
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
      await new Promise(resolve => setTimeout(resolve, 2000));




    // Cria o iframe com o link
    const iframeSerenata = $("<iframe>").attr("src", `https://www.footmundo.com/pedir-serenata/local/${idLocal}`);
    $("body").append(iframeSerenata);

    // Aguarda o iframe ser carregado
    await new Promise(resolve => iframeSerenata.on("load", resolve));

    // Atualiza o conteúdo do iframeComer
    const iframeContents5 = iframeSerenata.contents();
    // Clica no botão 'pedir'
    iframeContents5.find("input[type='submit'][value='Pedir serenata']").click();
    // Aguarda 1 segundo
    await new Promise(resolve => setTimeout(resolve, 2000));






  // Atualiza o conteúdo do iframeRest
  const iframeContents4 = iframeRest.contents();

  // Localiza a div com id 'alerta-1'
  const alertDiv = iframeContents4.find("#alerta-1");

  // Verifica se o texto dentro da div é "Você não está com fome."
  if (alertDiv.text().trim() === "Você não está com fome.") {
    // Exibe um alerta com a mensagem "Você ainda não pode ser comido"
    alert("Você ainda não pode ser comido");
  } else {
    // Exibe um alerta com a mensagem "Você foi comido"
    alert("Você foi Comido");
  }

  // Remove o iframe do HTML
  iframeRest.remove();
  location.reload();
});
  //
//
    // Adicionando estilo CSS para o texto
    GM_addStyle(".transparent-title { position: absolute; z-index: 4;color: black;; font-weight:none;margin-left: 5px; font-size:10px }");

    // Função para adicionar o título como texto no início da div
    function addTitleAsText() {
        $("div[title]").each(function() {
            var div = $(this);
            var title = div.attr("title");
            if (title) {
                div.css("position", "relative");
                div.prepend("<span class='transparent-title'>" + title + "</span>");
            }
        });
    }

    // Adicionar o título como texto nas divs com um atributo 'title'
    $(document).ready(function() {
        addTitleAsText();
    });

    function openEmbaixadinhas() {
      // Cria e insere o iframe
      const iframeSrc = "https://www.footmundo.com/item/68503";
      const iframe = $('<iframe>', {
        id: 'iframeEmbaixadinhas',
        src: iframeSrc,
        style: 'display:none;'
      }).appendTo('body');

      // Função para lidar com o evento 'load' do iframe
      function iframeLoadHandler() {
        const iframeContent = iframe.contents();

        // Localiza e clica no input submit com name="usar"
        const useButton = iframeContent.find('input[type="submit"][name="usar"]');
        useButton.trigger('click');

        // Aguarda 1 segundo e fecha o iframe
        setTimeout(function () {
          iframe.remove();

          // Mostra um alerta informando que as embaixadinhas foram feitas
          const result = alert('As embaixadinhas foram batidas.');

          // Recarrega a página do HTML principal ao clicar em "OK" no alerta
          if (result === undefined) {
            location.reload();
          }
        }, 1000);

        // Desvincula o evento 'load' do iframe
        iframe.off('load', iframeLoadHandler);
      }

      // Vincula a função iframeLoadHandler ao evento 'load' do iframe
      iframe.on('load', iframeLoadHandler);
    }

    // Vincula a função ao botão com name="Embaixadinhas"
    $('input[name="Embaixadinhas"]').on('click', function () {
      openEmbaixadinhas();
    });

  //-----------------------------------FUNÇÃO DO FOOTGRAM----------------------------------------------FUN




  });