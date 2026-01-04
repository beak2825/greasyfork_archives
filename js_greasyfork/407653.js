// ==UserScript==
// @name         обход таймера на скачивание гс на greatbot.ru
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  обходит таймер скрывая таймер и показывая ссылку на скачивание; прячет кнопки доната
// @author       funH4xx0r
// @match        *greatbot.ru/b-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407653/%D0%BE%D0%B1%D1%85%D0%BE%D0%B4%20%D1%82%D0%B0%D0%B9%D0%BC%D0%B5%D1%80%D0%B0%20%D0%BD%D0%B0%20%D1%81%D0%BA%D0%B0%D1%87%D0%B8%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%B3%D1%81%20%D0%BD%D0%B0%20greatbotru.user.js
// @updateURL https://update.greasyfork.org/scripts/407653/%D0%BE%D0%B1%D1%85%D0%BE%D0%B4%20%D1%82%D0%B0%D0%B9%D0%BC%D0%B5%D1%80%D0%B0%20%D0%BD%D0%B0%20%D1%81%D0%BA%D0%B0%D1%87%D0%B8%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%B3%D1%81%20%D0%BD%D0%B0%20greatbotru.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("ssilkamp3taimer").setAttribute("style","display: none;")
    document.getElementById("knopki").setAttribute("style","display: none;")
    document.getElementById("ssilkamp3posle").setAttribute("style","display: block;")
    document.getElementById("ssilkamp3").setAttribute("style","display: block;")
    // Your code here...
})();
