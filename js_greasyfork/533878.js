// ==UserScript==
// @name         Google Docs Change Outline Arabic Font
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Changes outline arabic font to Tajawal
// @match        https://docs.google.com/document/*
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533878/Google%20Docs%20Change%20Outline%20Arabic%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/533878/Google%20Docs%20Change%20Outline%20Arabic%20Font.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1) Load Tajawal
    GM_addStyle(`
        @import url("https://fonts.googleapis.com/css?family=Tajawal&display=swap");
    `);  // :contentReference[oaicite:0]{index=0}

    // 2) Font + size bump for anything Arabic
    function applyArabicFont(el) {
        if (/[\u0600-\u06FF]/.test(el.textContent)) {
            el.style.fontFamily = '"Tajawal", sans-serif';
            const cs = window.getComputedStyle(el);
            const size = parseFloat(cs.fontSize) || 0;
            el.style.fontSize = (size + 0) + 'px';
        }
    }

    // 3) Restyle all headings, tab-labels, and the header text
    function restyleAll() {
        document.querySelectorAll(
            '.outlines-widget-chaptered .navigation-item-content,' +
            '.outlines-widget-chaptered .chapter-label-content,' +
            '.kix-outlines-widget-header-text-chaptered'
        ).forEach(applyArabicFont);
    }
    restyleAll();

    // 4) Observe for newly inserted outline items or tabs
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const n of m.addedNodes) {
                if (!(n instanceof Element)) continue;
                if (n.matches(
                    '.navigation-item-content,' +
                    '.chapter-label-content,' +
                    '.kix-outlines-widget-header-text-chaptered'
                )) {
                    applyArabicFont(n);
                }
                n.querySelectorAll &&
                    n.querySelectorAll('.navigation-item-content, .chapter-label-content')
                     .forEach(applyArabicFont);
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
