// ==UserScript==
// @name         Hide Furigana
// @namespace    Mystery?
// @version      1
// @description  Hides Furigana
// @author       Mystery?
// @match        https://ils.isi-elearning.jp:14443/lms/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536364/Hide%20Furigana.user.js
// @updateURL https://update.greasyfork.org/scripts/536364/Hide%20Furigana.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.querySelector('rt')) {
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            rt {
                display: none;
            }
        `;
        document.head.appendChild(styleEl);

        const button = document.createElement('button');
        button.textContent = 'Toggle Furigana';
        button.style.position = 'fixed';
        button.style.top = '95px';
        button.style.right = '20px';
        button.style.zIndex = 9999;
        button.classList.add('btn', 'btn-info');

        document.querySelector('div#content').appendChild(button);

        button.addEventListener('click', () => {styleEl.disabled = !styleEl.disabled});
    }
})();