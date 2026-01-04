// ==UserScript==
// @name         Авто-тесты obrazovaka.ru
// @namespace    *://obrazovaka.ru/test/*
// @version      1.1
// @description  Автоматическое решение тестов, в которых надо выбирать правильно ответ
// @author       FurnyGo
// @license      MIT
// @match        *://obrazovaka.ru/test/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=obrazovaka.ru
// @grant        window.focus
// @downloadURL https://update.greasyfork.org/scripts/458692/%D0%90%D0%B2%D1%82%D0%BE-%D1%82%D0%B5%D1%81%D1%82%D1%8B%20obrazovakaru.user.js
// @updateURL https://update.greasyfork.org/scripts/458692/%D0%90%D0%B2%D1%82%D0%BE-%D1%82%D0%B5%D1%81%D1%82%D1%8B%20obrazovakaru.meta.js
// ==/UserScript==

(function() {
    var aboba = document.querySelectorAll('[data-correct="1"]')
    for (i=0;i<aboba.length;i++){
        aboba[i].click();
    }
    var aboba2 = document.querySelectorAll('button[class="button checkAnswer btn"]')
    for (i=0;i<aboba2.length;i++){
        aboba2[i].click();
        if (document.querySelector('[style="display: inline-block;"]')){
            document.querySelector('[style="display: inline-block;"]').click();
        }
    }
window.history.go(-1) // Удалите если хотите видеть свои результаты
})();