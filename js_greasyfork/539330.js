// ==UserScript==
// @name         Letras.mus em tela cheia
// @namespace    http://tampermonkey.net/
// @version      20250731
// @description  Deixar letra do site em tela cheia, sem incômodos.
// @author       André Felipe de Sousa
// @match        https://www.letras.mus.br/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mus.br
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539330/Letrasmus%20em%20tela%20cheia.user.js
// @updateURL https://update.greasyfork.org/scripts/539330/Letrasmus%20em%20tela%20cheia.meta.js
// ==/UserScript==

$(document).ready(function(){
    let larguraTela = $("body").innerWidth() * 0.9;
    console.log("Largura da tela: " + larguraTela)
    let numeroParagrafos = $(".lyric-original p").length;
    setTimeout(function() {
        $(".fc-dialog-container").remove();
    }, 1500);
    $("head").append(`
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Lavishly+Yours&family=Neonderthaw&family=Quicksand:wght@300..700&display=swap" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/tesseract.js@4.0.2/dist/tesseract.min.js"></script>
    `);


    $("body").prepend(`
    <style>
    body .lyric-original {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    body .lyric-original > p {
        display: inline-block;
    }
    body .lyric-original > p .contador {
        display: none;
    }
    </style>
    `);
    let cssParagrafos = '';
    $(".lyric-original p").each(function(index) {
        console.log("##### Parágrafo " + index + "#####");
        let larguraParagrafo = $(this).width();
        console.log("Largura parágrafo: " + larguraParagrafo);
        let tamanhoZoom = Math.min(7, Math.floor((larguraTela / larguraParagrafo) * 10) / 10);
        console.log("Tamanho zoom: " + tamanhoZoom);
        cssParagrafos += `
        body.fullscreen .lyric-original p:nth-child(${index+2}) {
            zoom: ${tamanhoZoom};
        }
        body.fullscreen .lyric-original p:nth-child(${index+2}) .contador {
            zoom: ${1 / tamanhoZoom};
        }`;
        if(tamanhoZoom >= 5) {
            cssParagrafos += `body.fullscreen .lyric-original p:nth-child(${index+2}) { line-height: 1.3; }`
        }
        $(this).prepend(`<span class="contador">${index+1}/${numeroParagrafos}</span>`);
    });
    $("body").prepend(`
<style>
.fc-dialog-container {
  visibility: hidden;
  pointer-events: none;
}
.lavishly-yours-regular {
  font-family: "Lavishly Yours", cursive;
  font-weight: 400;
  font-style: normal;
}
.neonderthaw-regular {
  font-family: "Neonderthaw", cursive;
  font-weight: 400;
  font-style: normal;
}
.quicksand-300 {
  font-family: "Quicksand", sans-serif;
  font-optical-sizing: auto;
  font-weight: 300;
  font-style: normal;
}

body.fullscreen {
    overflow: hidden;
}
body.fullscreen .lyric-original {
    /*position: fixed;*/
    background: white;
    z-index: 999;
    /*width: 100vw;*/
    /*height: 100vh;*/
    /*top: 0;*/
    /*left: 0;*/
    /* font-size: 1vw; */
    overflow-y: scroll;
    padding: 0 5vw 200px;
    box-sizing: border-box;
}
.lyric-original > *:not(p, h1, #telacheia) {
    display: none !important;
}
body:not(.fullscreen) .lyric-original p.textStyle-primary,
body:not(.fullscreen) .lyric-original h1.textStyle-primary {
    display: none;
}
body.fullscreen .lyric-original h1.textStyle-primary {
    color: #ed4800;
    font-weight: normal;
    border-bottom: 1px solid;
    text-align: center;
    width: 100%;
    justify-content: center;
    padding-bottom: 0;
    font-size: 6vw;
    margin-bottom: 5vh;
    position: relative;
    gap: 10vw;
}
body.fullscreen .lyric-original > p {
    /*position: relative;*/
    color: black;
}
body.fullscreen .lyric-original > p .contador {
    display: block;
    position: absolute;
    /*top: 0;*/
    /*right: 100%;*/
    left: 0;
    width: 5vw;
    text-align: center;
    padding-right: 10px;
    padding-top: 23px;
    /* zoom: 0.3; */
}
#telacheia {
    display: block;
    font-size: 40px;
    line-height: 40px;
    padding: 11px 0;
    width: 61px;
    height: 61px;
    background: #343434;
    color: white;
    position: fixed;
    right: 4vw;
    bottom: 5vh;
    border-radius: 50%;
    box-sizing: border-box;
    text-align: center;
    cursor: pointer;
    user-select: none;
    z-index: 1001;
}
body.fullscreen .lyric-original:after {
    content: 'Fim';
    display: block;
    margin-top: 10vh;
    margin-bottom: 20vh;
    color: #ed4800;
    font-family: "Lavishly Yours", cursive;
    font-weight: 400;
    font-style: normal;
    font-size: 6vw;
    padding: 0 4vw;
    border-top: 1px solid;
    border-bottom: 1px solid;
    width: 90%;
}
#js-vr-player {
    display: none;
}
.numeroHino {
    position: absolute;
    left: 0;
    color: #2b2b2b;
    zoom: 0.5;
}
${ cssParagrafos }
</style>
    `);
    $(".lyric-original").append(`
        <div id="telacheia">⛶</div>
    `);

    $(".lyric-original").prepend(`
        <h1 class="textStyle-primary neonderthaw-regular"><img src="https://i.imgur.com/kxPV14x.png" style="width:12vw;position:absolute;right:0;"><span class="numeroHino quicksand-300"></span>${$("#js-lyric-content h1").text()}</h1>
    `);
    setTimeout(function() {
        console.log("##### Adicionando número #####");
        let numeroHino = $(".player-videos-list.ps li:first-child").text().match(/\d+/g);
        console.log(numeroHino);
        if(numeroHino?.length > 0) { $(".numeroHino").text(numeroHino[0]); }
        else {
            let imagem = document.querySelector(".player-media-thumb iframe").contentWindow.document.querySelector("img").getAttribute("src");
            $(".numeroHino").append(`<img class="player-media-thumb" width="100%" height="100%" alt="" src="${imagem}" style="position:absolute;filter:invert(1) contrast(1.4) grayscale(1);clip-path:inset(16.5% 78.7% 73.8% 9%);left:-7.3vw;top:-11vw;scale:1;width:68vw;">`);
        }
    }, 5000);

    $("#telacheia").on('click', function(){
        if(!($("body").is(".fullscreen"))) {
            abrirTelaCheia();
        } else {
            fecharTelaCheia();
        }
    });
    $(document).keyup(function(e) {
      if (e.key === "Escape" || e.keyCode === 27) {
        $("body").removeClass('fullscreen');
      }
    });

    function abrirTelaCheia() {
      const elem = document.querySelector("body .lyric-original");

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
            $("body").removeClass("fullscreen");
        } else {
            console.log("Entrou no modo tela cheia");
            $("body").addClass("fullscreen");
        }
    });
});