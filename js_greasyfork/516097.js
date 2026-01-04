// ==UserScript==
// @name         Костюмы
// @namespace    http://tampermonkey.net/
// @version      24.11.1.2
// @description  Костюмы.
// @author       Чикипут
// @license      CC Shrike
// @match        https://catwar.net/cw3/
// @downloadURL https://update.greasyfork.org/scripts/516097/%D0%9A%D0%BE%D1%81%D1%82%D1%8E%D0%BC%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/516097/%D0%9A%D0%BE%D1%81%D1%82%D1%8E%D0%BC%D1%8B.meta.js
// ==/UserScript==
 
(function() {
    document.querySelector('head').innerHTML += `<style> 
 
    /*1273069 | Пустые Трепыхания*/
 
div[style*="cw3/composited/615b64c748c25f88.png"] {
background-image: url(https://i.ibb.co/DrTvHGC/146-20240917212554.png) !important; }
 
 
    /*1499777 | Порождение Зверя*/
 
div[style*="cw3/composited/846b40d52f4b430d.png"] {
background-image: url(https://i.ibb.co/8KbzJzW/IMG-20240810-184253-312.png) !important; }
 
 
    /*1597646 | Сорокопут*/
 
/*Статик*/
div[style*="cw3/composited/2a2b3757d9f60579.png"] {
background-image: url(https://i.yapx.ru/YCc8M.png) !important; }
 
/*Сон*/
div[style*="cw3/composited/0cbcb28fac9445f0.png"] {
background-image: url(https://i.yapx.ru/YCc8K.png) !important; }
 
/*Питьё*/
div[style*="cw3/composited/27381eabe66e3db7.png"] {
background-image: url(https://i.yapx.ru/YCc8L.png) !important; }
 
    /*1283093 | Трусиха-Барсучиха*/
 
div[style*="/cw3/composited/a88e9a22c75680f8.png"] {
background-image: url(http://d.zaix.ru/JCDg.png) !important; }
 
 
    /*1036932 | Солнцелиз*/
 
div[style*="/cw3/composited/03f65108a9ff138c.png"] {
background-image: url(http://d.zaix.ru/IIb2.png) !important; }
 
div[style*="/cw3/composited/e807fdd8f24c0149.png"] {
background-image: url(http://d.zaix.ru/IIb3.png) !important; }
 
 
    /*1577631 | Исчезнувшее Солнце*/
 
/*Статик*/
div[style*="/cw3/composited/0a338c5e27583ad5.png"] {
background-image: url(https://d.zaix.ru/IYRo.png) !important; }
 
/*Питьё*/
div[style*="/cw3/composited/18e714a5f408bd15.png"] {
background-image: url(http://d.zaix.ru/IYRq.png) !important; }
 
/*Сон*/
div[style*="/cw3/composited/2e7a22af515cdf0b.png"] {
background-image: url(https://d.zaix.ru/IYRp.png) !important; }
 
</style>`;
})();