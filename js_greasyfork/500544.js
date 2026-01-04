// ==UserScript==
// @name         Copy URL Alt+C - hotkey
// @name:en      Copy URL Alt+C - hotkey
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Когда вы нажимаете Alt+C, копируется ссылка на эту страницу.
// @description:en  When you press Alt+C, the link to this page is copied.
// @author       asburkov (inko inko)
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500544/Copy%20URL%20Alt%2BC%20-%20hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/500544/Copy%20URL%20Alt%2BC%20-%20hotkey.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для копирования текста в буфер обмена
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    // Событие для нажатия кнопок
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.code === 'KeyC') {
            const url = window.location.href;
            copyToClipboard(url);
            alert('[URL]: ' + url);
        }
    });
})();
