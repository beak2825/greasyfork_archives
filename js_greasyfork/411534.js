// ==UserScript==
// @name         Quant (Bot)
// @namespace    https://greasyfork.org/users/592063
// @icon         https://icons.duckduckgo.com/ip2/www.qwant.com.ico
// @version      0.1.7
// @description  Script que añade funciones a Quant (Oculta Qoz y elimina los avisos sobrantes).
// @author       wuniversales
// @include      https://www.qwant.com/*
// @include      https://qwant.com/*
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/411534/Quant%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/411534/Quant%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Ocultar_cartel_de_Resultados_Ordenados_Por_Relevancia: {
            type: 'checkbox',
            default: true
        },
        Ocultar_pie_de_pagina_completo: {
            type: 'checkbox',
            default: false
        },
    }
});

var ocultarcartelROPR=cfg.get('Ocultar_cartel_de_Resultados_Ordenados_Por_Relevancia');
var ocultarpiedepagina=cfg.get('Ocultar_pie_de_pagina_completo');

(function() {
    'use strict';
    async function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css.replace(/;/g, ' !important;');
        head.appendChild(style);
    }
    if(ocultarcartelROPR){
        addGlobalStyle("div[class=result_column__about]{display:none;}");
    }
    if(ocultarpiedepagina){
        addGlobalStyle("footer > nav{display:none;}");
    }
})();