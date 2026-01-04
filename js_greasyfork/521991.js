// ==UserScript==
// @name         Monospace Font for Brave Search
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Apply font style to Brave Search
// @author       You
// @match        https://search.brave.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521991/Monospace%20Font%20for%20Brave%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/521991/Monospace%20Font%20for%20Brave%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the font style
    const fontStyle = 'monospace';

    // Apply the font style to the entire document
    const style = document.createElement('style');
    style.textContent = `
        html, p, * {
            font-family: ${fontStyle} !important;
        }
    `;
    document.head.appendChild(style);
})();
