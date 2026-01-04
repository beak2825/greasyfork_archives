// ==UserScript==
// @name         EGW Writings - Destacar parágrafos
// @namespace    http://tampermonkey.net/
// @version      20251005
// @description  Script que permite destacar um trecho de parágrafos no site EGW Writings
// @author       André Sousa
// @match        https://egwwritings.org/read*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=egwwritings.org
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543998/EGW%20Writings%20-%20Destacar%20par%C3%A1grafos.user.js
// @updateURL https://update.greasyfork.org/scripts/543998/EGW%20Writings%20-%20Destacar%20par%C3%A1grafos.meta.js
// ==/UserScript==

let temaCSS = $("head").find("link[class=theme-link]").attr("href").split("styles/")[1].split(".css?")[0];
let destaqueBG = (temaCSS == "dm") ? "#0b121e" : ((temaCSS == "dw") ? "#ecece8" : ((temaCSS == "dk") ? "#6a6a6a" : ((temaCSS == "adm") ? "#2d2d2d" : "#ededed")));
let telacheiaBG = (temaCSS == "dm") ? "#181e29" : ((temaCSS == "dw") ? "#fafaf5" : ((temaCSS == "dk") ? "#565657" : ((temaCSS == "adm") ? "#000000" : "#ffffff")));
let relogioCO = (temaCSS == "dm") ? "#d8d8d8" : ((temaCSS == "dw") ? "#151814" : ((temaCSS == "dk") ? "#d8d8d8" : ((temaCSS == "adm") ? "#d8d8d8" : "#151814")));

if (window.location.hash.indexOf("highlight") >= 0) {
  window.location = window.location.href.replace(window.location.hash, "")
}

function exibirParagrafosDesejados() {

  $("head").append(`
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Bitcount+Grid+Single:wght@100..900&display=swap" rel="stylesheet">
    `);

  let inicio = parseFloat($("#inicio").val().replace(",", ".")); if (inicio == parseInt(inicio)) inicio = parseFloat(inicio) + 0.1;
  let fim = parseFloat($("#fim").val().replace(",", ".")); if (fim == parseInt(fim)) fim = parseFloat(fim) + 0.99;

  if (parseFloat(inicio) <= parseFloat(fim)) {
    let podeColorir = false;
    let contador = 0;
    let paragrafosLength = [];

    $("#layout-wrap .js-para.para-wrap").removeClass("paragrafo paragrafoPequeno paragrafoMedio paragrafoGrande paragrafoMaior");

    $("#layout-wrap .js-para.para-wrap:not(.header)").each(function (index) {
      $(this).css("background", "none");
      $(this).css("opacity", "0.4");

      let esteParagrafo = parseFloat($(this).find("span.refCode").text().split(" ")[1]);

      if (esteParagrafo >= inicio && esteParagrafo <= fim) {
        podeColorir = true;
        contador++;
        $(this).css("background", destaqueBG);
        $(this).css("opacity", "1");
        $("#layout-wrap .js-para.para-wrap.last-paragraph").removeClass("last-paragraph");
        $(this).addClass("paragrafo last-paragraph");
        paragrafosLength.push($(this).clone().find("sup.footnote").remove().end().text().length);
        if (contador > 0) {
          $(this).prevAll(".js-para.para-wrap.header:has(h3)").first().css("background", destaqueBG).css("opacity", "1");
          $(this).prevAll(".js-para.para-wrap.header:has(h4)").first().css("background", destaqueBG).css("opacity", "1");
          $(this).prevAll(".js-para.para-wrap.header:has(h5)").first().css("background", destaqueBG).css("opacity", "1");
        }
      }
    });
    $("#layout-wrap .js-para.para-wrap:not(.header)").each(function (index) {
      let esteParagrafo = parseFloat($(this).find("span.refCode").text().split(" ")[1]);
      let paragraphLength = $(this).clone().find("sup.footnote").remove().end().text().length;
      if (esteParagrafo > fim) { return false; }
      if (esteParagrafo >= inicio && esteParagrafo <= fim) {
        //let menorParagrafo = Math.min(...paragrafosLength);
        let menorParagrafo = Math.min(...paragrafosLength.filter(function (e) { return e != Math.min(...paragrafosLength) }));
        let maiorParagrafo = Math.max(...paragrafosLength);
        if (
          paragraphLength <= menorParagrafo + ((maiorParagrafo - menorParagrafo) / 3)
        ) {
          $(this).addClass("paragrafoPequeno");
        }
        if (
          paragraphLength > menorParagrafo + ((maiorParagrafo - menorParagrafo) / 3) &&
          paragraphLength <= menorParagrafo + (((maiorParagrafo - menorParagrafo) / 3) * 2)
        ) {
          $(this).addClass("paragrafoMedio");
        }
        if (
          paragraphLength > menorParagrafo + (((maiorParagrafo - menorParagrafo) / 3) * 2) &&
          paragraphLength <= maiorParagrafo
        ) {
          $(this).addClass("paragrafoGrande");
        }
        if (
          paragraphLength == maiorParagrafo
        ) {
          $(this).addClass("paragrafoMaior");
        }
      }
    });
    contador = 0;
  } else {
    $("#layout-wrap .js-para.para-wrap").css("background", "none").css("opacity", "1").removeClass("last-paragraph");
  }
}


function carregarCoisas() {
  $("#reader-control-panel > *").each(function (index) {
    if ((["", ""].indexOf($(this).text().trim()) < 0) && !($(this).is(".ReaderNavigationPanel_root__kWWqN"))) {
      $(this).hide();
    }
  });

  let readerFontSize = parseFloat($(".scrollbars-render-view.reader-content-wrap.books.egwwritings").css("fontSize"));
  let paragraphPaddingTop = parseFloat($(".js-para.para-wrap").css("paddingTop"));
  $("head").append(`
                <style>
                    header.header-main {
                        display: none;
                    }
                    .ReaderNavigationPanel_root__kWWqN {
                        margin-left: 0;
                        margin-right: auto;
                    }
                    .IconButton_root__ygpsp {
                        margin-right: 0;
                        margin-left: auto;
                    }
                    .telacheia #root .reader-page-wrap {
                        /*position: fixed;*/
                        /*left: 0;*/
                        /*top: 0;*/
                        /*width: 100%;*/
                        /*height: 100%;*/
                        /*z-index: 10;*/
                        background: ${telacheiaBG};
                    }
                    .telacheia #root #leftMiddleDrag,
                    .telacheia #root #rightMainDrag,
                    .telacheia #root .left-menu,
                    .telacheia #root .mainPart .topBar,
                    .telacheia #root .mainPart .cart-side-panel,
                    .telacheia #root .resizer-right-panel.shown,
                    .telacheia #root #rightMiddleDrag,
                    .telacheia #root .reader-panel-head {
                        display: none !important;
                    }
                    [class*="ReaderControlPanel_dd-3dots"] {
                        display: none;
                    }
                    .telacheia #root .mainPart .mainContent {
                        padding: 0 !important;
                        width: 100% !important;
                    }
                    .bitcount-<uniquifier> {
                      font-family: "Bitcount", system-ui;
                      font-optical-sizing: auto;
                      font-weight: <weight>;
                      font-style: normal;
                      font-variation-settings:
                        "slnt" 0,
                        "CRSV" 0.5,
                        "ELSH" 0,
                        "ELXP" 0;
                    }
                    #relogio,
                    #relogio2 {
                        /*border: 1px solid #808379;*/
                        text-align: center;
                        border-radius: 5px;
                        /*background: #a4a89b;*/
                        color: ${relogioCO};
                        pointer-events: none;
                        font-family: "Bitcount Grid Single";
                        width: 70px;
                        height: 24px;
                        font-size: 16px;
                        padding-top: 4px !important;
                        box-sizing: border-box;
                    }
                    .last-paragraph {
                        position: relative;
                    }
                    .last-paragraph::after {
                        content: '';
                        display: block;
                        position: absolute;
                        left: 0.8rem;
                        top: 0.25em;
                        width: 0.7em;
                        height: 1.6em;
                        background-image: url(https://i.imgur.com/6Ed0gmY.png);
                        background-size: contain;
                        background-repeat: no-repeat;
                        background-position-y: center;
                    }
                    .reader-arrow {
                        display: none;
                    }
                    .paragrafo::before {
                        display: block;
                        position: absolute;
                        left: 0;
                        top: ${paragraphPaddingTop};
                        content: '▶';
                        font-size: 14px;
                        color: #ff9d5b;
                        line-height: ${readerFontSize / (16 / 30) * (30 / 38)}px;
                    }
                    .paragrafoPequeno::before {
                        /*transform: scaleX(0.8) translateX(-10%);*/
                        transform: scaleX(0.9) translateX(-5%);
                    }
                    .paragrafoMedio::before {
                        transform: scaleX(0.9) translateX(-5%);
                    }
                    .paragrafoGrande::before {
                        transform: scaleX(1) translateX(0%);
                    }
                    .paragrafoMaior::before {
                        color: #f28f4c;
                    }
                </style>
            `);

  $("#reader-control-panel").prepend(`
                <div class="ReaderNavigationPanel_root__kWWqN">
                    <div class="ReaderNavigationPanel_wrap-inputs__qUVo5">
                        <div class="Input_root__T9Ljb Input_oneWord__MDa76 Input_sm__xb1Ul">
                            <input type="text" id="inicio" class="Input_input__o3nl9 ReaderNavigationPanel_input__ZWQq4" tabindex="0" value="" placeholder="Início">
                        </div>
                        <div class="Input_root__T9Ljb Input_oneWord__MDa76 Input_sm__xb1Ul">
                            <input type="text" id="fim" class="Input_input__o3nl9 ReaderNavigationPanel_input__ZWQq4" tabindex="0" value="" placeholder="Fim">
                        </div>
                        <i tabindex="0" id="limparTrecho" aria-label="Limpar trecho" role="button" class="icon-button-base IconButton_root__ygpsp" style="font-family: cursive !important;background: #0c6b8f;padding-left: 7px;padding-right: 7px;font-size: 12px;color: white;margin-left: 0;margin-right: auto;height: 28px;">X<div id="" class="Ripple_root__lmfsr Ripple_dark__KJV9U"><span class="Ripple_ripple__O6Zr1"></span></div></i>
                    </div>
                </div>
            `);
  let dataProvisoria = new Date();
  $("#reader-control-panel").append(`
                <input type="text" id="relogio" class="Input_input__o3nl9 ReaderNavigationPanel_input__ZWQq4 bitcount-300" tabindex="0" value="" placeholder="${String(dataProvisoria.getHours()).padStart(2, "0") + ":" + String(dataProvisoria.getMinutes()).padStart(2, "0")}">
                <i id="telacheia" class="icon-button-base IconButton_root__ygpsp egw-font-icon"></i>
            `);

  let rodarRelogio = setInterval(function () {
    //console.log("Rodando Relogio");
    let data = new Date();
    let hora = String(data.getHours()).padStart(2, "0");
    let minuto = String(data.getMinutes()).padStart(2, "0");
    let segundo = data.getSeconds();

    $("#relogio").val(hora + (segundo % 2 == 0 ? ":" : " ") + minuto);
  }, 1000);

  $("#telacheia").click(function () {
    if (!($("body").is(".telacheia"))) {
      abrirTelaCheia();
      $("body").addClass("telacheia");
    } else {
      fecharTelaCheia();
      $("body").removeClass("telacheia");
    }
  });

  $("#limparTrecho").click(function () {
    $("#inicio, #fim").val('');
    $("#layout-wrap .js-para.para-wrap").css("background", "none").css("opacity", "1").removeClass("last-paragraph paragrafo paragrafoPequeno paragrafoMedio paragrafoGrande paragrafoMaior");
  });

    function debounce(delay, fn) {
        var timer = null;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }

  $(".scrollbars-render-view").on("scroll", debounce(150, function () {
    exibirParagrafosDesejados();
  }));

  $("#inicio, #fim").on("keyup", debounce(150, function () {
    exibirParagrafosDesejados();
  }));
}

function abrirTelaCheia() {
  const elem = document.querySelector("#root");

  if ($(".homeSearchIcon.homeSearchTopPane").is(".iconActive")) {
    $(".homeSearchIcon.homeSearchTopPane").trigger("click");
    setTimeout(function () {
      $("#reader-control-panel > *").each(function (index) {
        if ((["", "", ""].indexOf($(this).text().trim()) < 0) && !($(this).is(".ReaderNavigationPanel_root__kWWqN, #relogio"))) {
          $(this).hide();
        }
      });
    }, 100);
  }

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}
function fecharTelaCheia() {
  document.exitFullscreen();
}

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    console.log("Saiu do modo tela cheia");
    $("body").removeClass("telacheia");
  } else {
    console.log("Entrou no modo tela cheia");
    $("body").addClass("telacheia");
  }
});

const target = document.querySelector('body');
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.attributeName === 'class') {
      if (["is-reader-page"].some(c => target.classList.contains(c)) && !document.getElementById('inicio')) {
        console.log('Classe adicionada!');
        carregarCoisas();
      }
    }
  });
});

observer.observe(target, { attributes: true });