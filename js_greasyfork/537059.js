// ==UserScript==
// @name         disable amazon xray
// @namespace    http://tampermonkey.net/
// @version      2025-02-25
// @description  Disable that stupid amazon xray thing.
// @author       You
// @match        https://www.amazon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537059/disable%20amazon%20xray.user.js
// @updateURL https://update.greasyfork.org/scripts/537059/disable%20amazon%20xray.meta.js
// ==/UserScript==


(function() {
    // Create a delay function using Promise
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    (async function() {
        await delay(5000); // Wait for 5 seconds
        const xrayCrap = document.querySelector('.xrayQuickView');
        if (xrayCrap) {
            xrayCrap.style.setProperty('display', 'none', 'important');
        }
    })();
})();