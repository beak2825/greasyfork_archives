// ==UserScript==
// @name         Cuida mis ojos PVU
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Mejora la accesibilidad de Plant vs Undedad
// @author       https://t.me.com/soyox
// @match        https://marketplace.plantvsundead.com/farm/other/*
// @icon         https://www.google.com/s2/favicons?domain=plantvsundead.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430405/Cuida%20mis%20ojos%20PVU.user.js
// @updateURL https://update.greasyfork.org/scripts/430405/Cuida%20mis%20ojos%20PVU.meta.js
// ==/UserScript==

(function() {
    'use strict';

   function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
    //estilos de numeros grandes en plantas y herramientas
    addGlobalStyle('.tool .plant-attr-number span[data-v-8db1781a] { font-size: 48px !important; } ');
    addGlobalStyle('.tool .plant-attr-number[data-v-8db1781a] { width: 80px !important;height: 80px !important; z-index: 1! important; } ');
    addGlobalStyle('.tool-available[data-v-496d4921], .usages[data-v-496d4921] { font-size: 26px!important; } ');
    
    //plantas pequeñas
    addGlobalStyle ('.plant-icon[data-v-7f3f786e] {   width: 10% !important ;  height: 10% !important  ; margin-top: 40px;} ');

    //estilo para hacer el cuervo grande
    addGlobalStyle('img.tw-absolute.crow-icon {width: 113PX !important }');
})();