// ==UserScript==
// @name         Sorting videos on YouTube
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Sorting videos on YouTube using the floating button
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463927/Sorting%20videos%20on%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/463927/Sorting%20videos%20on%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Создаем плавающую кнопку
    const button = document.createElement('button');
    button.innerHTML = 'Reverse';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = 1000;
    button.style.padding = '10px 15px';
    button.style.fontSize = '14px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    // Функция для переключения стилей
    function toggleStyles() {
        const styleElement = document.getElementById('reverse-styles');
        if (styleElement) {
            styleElement.remove();
        } else {
            const style = document.createElement('style');
            style.id = 'reverse-styles';
            style.innerHTML = `
                #contents.ytd-rich-grid-renderer {
                    width: 100%;
                    padding-top: 24px;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: flex-start;
                    flex-direction: column-reverse;
                }
                #contents {
                    flex-direction: row-reverse;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Добавляем обработчик событий клика на кнопку
    button.addEventListener('click', toggleStyles);
})();