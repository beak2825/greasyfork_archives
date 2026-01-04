// ==UserScript==
// @name         Костюмы пельменей
// @namespace    http://tampermonkey.net/
// @version      25.13.2.0
// @description  Костюмы.
// @author       Чикипут
// @license      CC Shrike
// @match        https://catwar.net/cw3/
// @downloadURL https://update.greasyfork.org/scripts/516279/%D0%9A%D0%BE%D1%81%D1%82%D1%8E%D0%BC%D1%8B%20%D0%BF%D0%B5%D0%BB%D1%8C%D0%BC%D0%B5%D0%BD%D0%B5%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/516279/%D0%9A%D0%BE%D1%81%D1%82%D1%8E%D0%BC%D1%8B%20%D0%BF%D0%B5%D0%BB%D1%8C%D0%BC%D0%B5%D0%BD%D0%B5%D0%B9.meta.js
// ==/UserScript==
 
(function() {
    document.querySelector('head').innerHTML += `<style> 
 

    /*1283093 | Камнежуйка*/
 
div[style*="/cw3/composited/a88e9a22c75680f8.png"] {
background-image: url(http://d.zaix.ru/N6XX.png) !important; }

 /*сон*/
 
div[style*="/cw3/composited/9696ae21303bdeca.png"] {
background-image: url(http://d.zaix.ru/N6YL.png) !important; }

 
 /*-грязь*/
[style*='defects/dirt/'] {
  display: none;}

</style>`;
})();