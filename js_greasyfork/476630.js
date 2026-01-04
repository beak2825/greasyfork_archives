// ==UserScript==
// @name         Zelenka.guru Задом наперёд
// @namespace    https://greasyfork.org/ru/users/1187197-molihan
// @namespace    https://greasyfork.org/ru/users/1142494-llimonix
// @version      0.2
// @description  Some useful utilities for Lolzteam
// @description:ru  Полезные улучшения для Lolzteam
// @author       Molihan&llimonix
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476630/Zelenkaguru%20%D0%97%D0%B0%D0%B4%D0%BE%D0%BC%20%D0%BD%D0%B0%D0%BF%D0%B5%D1%80%D1%91%D0%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/476630/Zelenkaguru%20%D0%97%D0%B0%D0%B4%D0%BE%D0%BC%20%D0%BD%D0%B0%D0%BF%D0%B5%D1%80%D1%91%D0%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const LZTBdiv = document.querySelector('div.fr-element.fr-view.fr-element-scroll-visible');
    // Функция для оборачивания текста в теги [B][/B] и центрирования
    function wrapTextInBoldAndCenter(message) {
        LZTBdiv.focus();
        LZTBdiv.innerHTML = `<div style="font-weight: bold;">${message}</div>`;
    }

    LZTBdiv.addEventListener("keypress", function(event) {
        const LZTBtext = document.querySelector('div.fr-element.fr-view.fr-element-scroll-visible').textContent;
        wrapTextInBoldAndCenter(LZTBtext)
    });
})();