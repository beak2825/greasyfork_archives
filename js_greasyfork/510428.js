// ==UserScript==
// @name         Spotify Text Selector and Context Menu
// @namespace    http://tampermonkey.net/
// @version      2024-09-27
// @description  Позволяет выделять и копировать текст на странице Spotify и разблокирует контекстное меню / Allows selecting and copying text on Spotify pages and unlocks the context menu
// @author       BALCETUL, z1zod
// @match        https://*.spotify.com/*
// @icon         https://www.spotify.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510428/Spotify%20Text%20Selector%20and%20Context%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/510428/Spotify%20Text%20Selector%20and%20Context%20Menu.meta.js
// ==/UserScript==

/*
Copyright (c) 2024 z1zod, BALCETUL

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        ::selection {
            background: rgba(0, 255, 0, 0.5);
            color: black;
        }

        .encore-text, .rEN7ncpaUeSGL9z0NGQR {
            user-select: text !important;
        }

        .rEN7ncpaUeSGL9z0NGQR {
            cursor: text;
        }
    `;
    document.head.appendChild(style);

    document.addEventListener('dragstart', function(event) {
        if (event.target.closest('.encore-text-headline-large, .rEN7ncpaUeSGL9z0NGQR')) {
            event.preventDefault();
        }
    });

    function copySelectedText() {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            navigator.clipboard.writeText(selectedText).then(() => {
                console.log('Текст скопирован:', selectedText);
                alert('Текст скопирован в буфер обмена!');
            }).catch(err => {
                console.error('Ошибка копирования текста:', err);
                alert('Ошибка копирования текста.');
            });
        } else {
            alert('Нет выделенного текста для копирования.');
        }
    }

    document.addEventListener('contextmenu', function(event) {
        event.stopPropagation();
    }, true);

    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'c') {
            copySelectedText();
        }
    });

    document.addEventListener('mouseup', function() {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            console.log('Выделенный текст:', selectedText);
        }
    });
})();
