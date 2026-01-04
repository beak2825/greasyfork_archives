// ==UserScript==
// @name         Instagram Square Posts Fix
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Forces Instagram posts to be perfectly square in the grid layout.
// @author       Drewby123
// @match        *://www.instagram.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/529101/Instagram%20Square%20Posts%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/529101/Instagram%20Square%20Posts%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function forceSquarePosts() {
        document.querySelectorAll('div._aagu div._aagv').forEach(el => {
            el.style.paddingBottom = '100%'; // Force square
        });
    }

    // Apply the fix on page load and when scrolling (dynamic content)
    const observer = new MutationObserver(forceSquarePosts);
    observer.observe(document.body, { childList: true, subtree: true });

    // Also run immediately
    forceSquarePosts();
})();
