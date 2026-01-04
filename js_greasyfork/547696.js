// ==UserScript==
// @name         RedeCanaisTV Cleaner
// @namespace    https://github.com/hpuglia/
// @version      4.0
// @author       Henrique Puglia
// @description  Script customizado para limpar anúncios, domínios e elementos indesejados no site RedeCanaisTV.
// @match         https://*redecanaistv.*/*
// @match         https://redecanaistv.ee/*
// @icon         https://redecanaistv.ee/favicon.ico
// @supportURL   https://github.com/hpuglia/redecanais-cleaner/issues
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547696/RedeCanaisTV%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/547696/RedeCanaisTV%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function showLog(msg) { console.log("[Tampermonkey]", msg); }

    // Cria overlay de carregamento
    function createLoadingOverlay() {
        const overlay = document.createElement("div");
        overlay.id = "tamper-loading-overlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.background = "rgba(0,0,0,0.85)";
        overlay.style.backdropFilter = "blur(10px)";
        overlay.style.zIndex = "9999999";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";

        // GIF
        const img = document.createElement("img");
        img.src = "https://fixasaur.com/wp-content/uploads/2025/01/broom.gif";
        img.style.width = "150px";
        img.style.height = "150px";
        img.style.marginBottom = "20px";
        overlay.appendChild(img);

        // Texto animado
        const text = document.createElement("div");
        text.textContent = "Limpando site...";
        text.style.color = "#00ffff";
        text.style.fontSize = "36px";
        text.style.fontWeight = "700";
        text.style.textTransform = "uppercase";
        text.style.textShadow = "0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff";
        text.style.animation = "tamper-pulse 1.5s infinite alternate";
        overlay.appendChild(text);

        // Animação CSS
        const style = document.createElement("style");
        style.textContent = `
@keyframes tamper-pulse {
    0% { text-shadow: 0 0 5px #0ff, 0 0 10px #0ff, 0 0 15px #0ff; }
    50% { text-shadow: 0 0 15px #0ff, 0 0 25px #0ff, 0 0 35px #0ff; }
    100% { text-shadow: 0 0 5px #0ff, 0 0 10px #0ff, 0 0 15px #0ff; }
}`;
        overlay.appendChild(style);

        document.documentElement.appendChild(overlay);
    }

    function removeLoadingOverlay() {
        const overlay = document.getElementById("tamper-loading-overlay");
        if (overlay) overlay.remove();
    }

    function removeElement(selector) {
        document.querySelectorAll(selector).forEach(el => el.remove());
        showLog("Removido: " + selector);
    }

    function cleanBodyClass() {
        if (document.body) {
            document.body.className = "";
            showLog("Classe do body limpa");
        }
    }

    function removeBodyScripts() {
        document.querySelectorAll("body script").forEach(scr => scr.remove());
        showLog("Scripts do body removidos");
    }

    function removeHeadScripts() {
        document.querySelectorAll("head script").forEach(scr => {
            if (!scr.src.includes("player3/query.js")) scr.remove();
        });
        showLog("Scripts do head tratados");
    }

    function removeBodyStyle() {
        const bodyStyle = document.querySelector("body section div style");
        if (bodyStyle) {
            bodyStyle.remove();
            showLog("Style do body removido");
        }
    }

    function replaceHeadStyle() {
        const headStyle = document.querySelector("head style");
        if (headStyle) headStyle.remove();

        const style = document.createElement("style");
        style.textContent = `
body {
    background: #000;
    line-height: 0;
}
#player-container { border-radius: 10px; margin-top: 70px; overflow: hidden; }
.full-container { border-radius: 10px; overflow: hidden; }
#player { height: 550px; }
#player iframe { width: 100%; height: 100%; }
#options-player { background-color: #0006ff94; }
#options-player .options { display: inline-block; margin: 5px 2.5px; cursor: pointer; font-weight: 700; font-size: 14px; background-color: rgba(0,0,0,.4); height:40px; line-height:40px; padding:0 10px; color:#fff; text-decoration:none;}
#options-player .options.active { background-color: rgba(0,0,0,.8);}
.search-channel input { height: 60px; font-size: 20px; background-color: #000; color: #fff; border: 1px solid #000; border-radius: 10px; outline: none; }
.list-channels { height:491px; }
.channel a { display:flex; align-items:center; background-color:#111; border-bottom:#333 solid 1px; cursor:pointer; text-decoration:none;}
.channel a:hover { background-color:#181818; }
.channel a.active { background-color:#333;}
.channel span { line-height:1.5;}
.channel a.active span { display:block !important;}
.channel .number { flex:1; font-size:25px; font-weight:700; line-height:80px; color:#fff; padding:0 5px; }
.channel img { max-width:100%; }
.channel .logo { flex:3; max-width:150px; }
.logo-others img { min-width:70px; max-width:110px; width:100%; }
.logo-others:nth-child(1) img { min-width:72px;}
.channel .name { flex:3; color:#fff; text-align:center; display:flex; justify-content:center; width:100%; flex-direction:column; align-items:center;}
@media (max-width:767px){#header .logo img{ min-width:70px !important; max-width:150px;width:100%;}.logo-others img{width:72px;}}
@media screen and (max-width:990px){#player{height:380px;}.list-channels{height:350px;}}
        `;
        document.head.appendChild(style);
        showLog("Style do head substituído");
    }

    function removeElements() {
        removeElement("div.unlockr-overlay");
        removeElement("section.alert");
        removeElement("center");
        removeElement("footer");
        removeElement("#header");
        document.querySelectorAll(".aviso-parceria").forEach(el => el.remove());
    }

    function unlockDevTools() {
        try {
            if (window.disableDevtool) window.disableDevtool.ondevtoolopen = null;
            document.onkeydown = null;
            document.onkeypress = null;
            document.onkeyup = null;
            window.onkeydown = null;
            window.onkeypress = null;
            window.onkeyup = null;
            document.oncontextmenu = null;
            const observer = new MutationObserver(() => {
                document.onkeydown = null;
                document.onkeypress = null;
                document.onkeyup = null;
                document.oncontextmenu = null;
            });
            observer.observe(document.documentElement, { childList:true, subtree:true });
            showLog("DevTools desbloqueado e clique direito liberado");
        } catch(e) {
            console.error("Erro ao liberar DevTools:", e);
        }
    }

    // Cria o overlay imediatamente para cobrir a página antes do conteúdo carregar
    createLoadingOverlay();

    // Executa a limpeza após um pequeno atraso para dar tempo de todos os elementos carregarem
    setTimeout(() => {
        cleanBodyClass();
        removeElements();
        removeBodyScripts();
        removeHeadScripts();
        removeBodyStyle();
        replaceHeadStyle();
        unlockDevTools();
        removeLoadingOverlay();
        showLog("Limpeza avançada e overlay removido");
    }, 500); // 500ms é um bom tempo para a maioria dos sites

})();