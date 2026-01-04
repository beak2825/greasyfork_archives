// ==UserScript==
// @name         Kavita Ebook Style Enforcer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Keeps ebook font size, layout, margins, and line-height on kavita.partsdetour.com
// @match        https://kavita.partsdetour.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533068/Kavita%20Ebook%20Style%20Enforcer.user.js
// @updateURL https://update.greasyfork.org/scripts/533068/Kavita%20Ebook%20Style%20Enforcer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .book-content {
            column-width: 196px !important;
            font-size: 120% !important;
            margin-left: 10vw !important;
            margin-right: 10vw !important;
            max-height: 634px !important;
        }

        .reading-section {
            width: 100% !important;
            opacity: 1 !important;
        }

        section[epub\\:type="chapter"] {
            line-height: 120% !important;
        }
    `);

    const enforceLayoutClasses = () => {
        document.querySelectorAll('.book-content').forEach(el => {
            el.classList.remove('column-layout-2');
            el.classList.add('column-layout-1');
        });
        document.querySelectorAll('.reading-section').forEach(el => {
            el.classList.remove('column-layout-2');
            el.classList.add('column-layout-1');
        });
    };

    const observer = new MutationObserver(enforceLayoutClasses);
    observer.observe(document.body, { childList: true, subtree: true });

    enforceLayoutClasses();
})();