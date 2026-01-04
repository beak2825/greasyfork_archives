// ==UserScript==
// @name         Remove Google Gemini AI from google search results
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Google Gemini AI Remover
// @author       SomeRandomGamer
// @match        https://www.google.com/search*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534154/Remove%20Google%20Gemini%20AI%20from%20google%20search%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/534154/Remove%20Google%20Gemini%20AI%20from%20google%20search%20results.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const targetSelector = 'div.bzXtMb.M8OgIe.dRpWwb';

    function removeTargetedDivs() {
        document.querySelectorAll(targetSelector).forEach(el => {
            el.remove(); // Delete the entire node/subtree
            console.log('[AI Blocker] Removed:', el);
        });
    }

    // Initial execution
    removeTargetedDivs();

    // Watch for dynamically added AI panels
    const observer = new MutationObserver(() => {
        removeTargetedDivs();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
