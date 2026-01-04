// ==UserScript==
// @name         Text Outline for jaomix.ru
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Добавляет обводку к тексту внутри элементов с классом .entry.
// @author       шизик x chatgpt
// @match        *://jaomix.ru/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522041/Text%20Outline%20for%20jaomixru.user.js
// @updateURL https://update.greasyfork.org/scripts/522041/Text%20Outline%20for%20jaomixru.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Создаем стиль для обводки текста
    const style = document.createElement('style');
    style.textContent = `
        .outlined-text {
            color: white; /* Цвет текста */
            font-size: 48px; /* Размер шрифта */
            text-shadow:
                -2px -2px 0 black,
                 2px -2px 0 black,
                -2px  2px 0 black,
                 2px  2px 0 black; /* Обводка черного цвета */
        }
    `;
    document.head.appendChild(style);

    // Находим все элементы <p> внутри .entry и добавляем класс
    const entries = document.querySelectorAll('.entry p');
    entries.forEach(entry => {
        entry.classList.add('outlined-text'); // Добавляем класс для обводки
    });
})();
