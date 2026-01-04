// ==UserScript==
// @name         Подсветка правильных ответов на тесты obrazovaka.ru
// @namespace    aaaaaaaaaa
// @version      1.0
// @description  Выделяет правильные ответы.
// @author       funH4xx0r
// @match        *://obrazovaka.ru/test/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415901/%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D1%8C%D0%BD%D1%8B%D1%85%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%20%D0%BD%D0%B0%20%D1%82%D0%B5%D1%81%D1%82%D1%8B%20obrazovakaru.user.js
// @updateURL https://update.greasyfork.org/scripts/415901/%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D1%8C%D0%BD%D1%8B%D1%85%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%20%D0%BD%D0%B0%20%D1%82%D0%B5%D1%81%D1%82%D1%8B%20obrazovakaru.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.head.innerHTML+='<style>[data-correct="1"]+label{color:#000!important;outline-width:2px!important;outline-color:#00ff00!important;outline-style:dashed!important;outline-offset:3px!important;padding-left:3px!important;font-style:italic}</style>'
    // gg ez
})();