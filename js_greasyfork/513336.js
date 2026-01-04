// ==UserScript==
// @name         Enable Printing for Restricted Pages
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enable printing for web pages that prevent printing/Abilita la stampa di pagine web bloccate
// @author       Magneto1
// @license      MIT
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/513336/Enable%20Printing%20for%20Restricted%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/513336/Enable%20Printing%20for%20Restricted%20Pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Rimuovi le regole CSS che impediscono la stampa
    GM_addStyle(`
        @media print {
            * {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
            body {
                display: block !important;
            }
        }
    `);
})();