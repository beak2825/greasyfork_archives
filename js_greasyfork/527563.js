// ==UserScript==
// @name         КостюмЫ
// @namespace    http://tampermonkey.net/
// @version      24.11.19.1
// @description  Костюмы.
// @author       Пипи
// @license      CC Shrike
// @match        http*://*.catwar.net/*
// @match        http*://*.catwar.su/*
// @downloadURL https://update.greasyfork.org/scripts/527563/%D0%9A%D0%BE%D1%81%D1%82%D1%8E%D0%BC%D0%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/527563/%D0%9A%D0%BE%D1%81%D1%82%D1%8E%D0%BC%D0%AB.meta.js
// ==/UserScript==

(function() {
    document.querySelector('head').innerHTML += `<style>

    /*1634217 | Льстивоглаз*/

div[style*="/cw3/composited/b70c35454549d3e5.png"] {
background-image: url(https://d.zaix.ru/Lr9j.png) !important; }


    /*1634161 | Сладкоухая*/

div[style*="cw3/composited/9f575736194a6892.png"] {
background-image: url(https://i.ibb.co/C3cNtNd9/image.png) !important; }


</style>`;
})();