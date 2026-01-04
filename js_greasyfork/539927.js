// ==UserScript==
// @name         Div centerer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Force center the main content of all websites to remove horizontal scrollbars
// @author       Saumil
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539927/Div%20centerer.user.js
// @updateURL https://update.greasyfork.org/scripts/539927/Div%20centerer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        body {
            margin-left: auto !important;
            margin-right: auto !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
        }
        html {
            overflow-x: hidden !important;
        }
    `);

    const fixWideElements = () => {
        document.querySelectorAll('body > *').forEach(el => {
            if (el.offsetWidth > window.innerWidth) {
                el.style.maxWidth = '100%';
                el.style.marginLeft = 'auto';
                el.style.marginRight = 'auto';
                el.style.boxSizing = 'border-box';
            }
        });
    };

    fixWideElements();
    window.addEventListener('resize', fixWideElements);
    setTimeout(fixWideElements, 1000);
})();
