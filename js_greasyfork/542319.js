// ==UserScript==
// @name        Remove 'Open app' bar
// @namespace   Violentmonkey Scripts
// @match       *://*.facebook.com/*
// @grant       none
// @version     1.3
// @author      -
// @description 7/11/2025, 11:02:20 AM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542319/Remove%20%27Open%20app%27%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/542319/Remove%20%27Open%20app%27%20bar.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function removeRobotoV2() {
        // Step 1: Get first element with the class (assumes they share the same style)
        const first = document.querySelector('.native-text');
        if (first) {
            // Step 2: Get computed font-family and remove Roboto-V2
            const computedFonts = getComputedStyle(first).fontFamily.split(',').map(f => f.trim());
            const newFonts = computedFonts.filter(f => f.replace(/["']/g, '') !== 'Roboto-V2');

            // Step 3: Create a new style rule to override globally
            const style = document.createElement('style');
            style.textContent = `
                .native-text {
                    font-family: ${newFonts.join(', ')} !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function zap() {
        document.querySelector('#screen-root > div > div.m.fixed-container.bottom')?.remove();
    }

    function fixAll() {
        zap();
    }
    removeRobotoV2();
    fixAll();

    const observer = new MutationObserver(() => fixAll());
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    ['pushState', 'replaceState'].forEach(fn => {
        const orig = history[fn];
        history[fn] = function (...args) {
            const ret = orig.apply(this, args);
            Promise.resolve().then(fixAll);
            return ret;
        };
    });

})();