// ==UserScript==
// @name         Свадьба
// @namespace    http://tampermonkey.net/
// @version      24.11.19.1
// @description  Костюмы.
// @author       Пипи
// @license      CC Shrike
// @match        https://catwar.net/cw3/
// @match        http*://*.catwar.su/*
// @downloadURL https://update.greasyfork.org/scripts/527678/%D0%A1%D0%B2%D0%B0%D0%B4%D1%8C%D0%B1%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/527678/%D0%A1%D0%B2%D0%B0%D0%B4%D1%8C%D0%B1%D0%B0.meta.js
// ==/UserScript==

(function() {
    document.querySelector('head').innerHTML += `<style>

    /*1634217 | Льстец*/

div[style*="/cw3/composited/b70c35454549d3e5.png"] {
background-image: url(https://i.ibb.co/DP4rfK0r/image.png) !important; }


    /*1634161 | Наслаждение*/

div[style*="cw3/composited/9f575736194a6892.png"] {
background-image: url(https://i.ibb.co/DswCXM4/image.png) !important; }


</style>`;
})();