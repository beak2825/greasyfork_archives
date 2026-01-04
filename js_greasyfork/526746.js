// ==UserScript==
// @name         Apply ChatGPT Font Everywhere
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Changes the font on all websites to Inter (ChatGPT's font).
// @author       Your Name
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      Mit
// @downloadURL https://update.greasyfork.org/scripts/526746/Apply%20ChatGPT%20Font%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/526746/Apply%20ChatGPT%20Font%20Everywhere.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add the Inter font
    const fontStyle = document.createElement('style');
    fontStyle.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        * {
            font-family: 'Inter', sans-serif !important;
        }
    `;
    document.head.appendChild(fontStyle);
})();
