// ==UserScript==
// @name         olx-hide-promoted
// @namespace    none
// @version      1.0
// @description  hide promoted (paid) listings
// @match        https://*olx.*/
// @match        https://*.olx.*/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/540962/olx-hide-promoted.user.js
// @updateURL https://update.greasyfork.org/scripts/540962/olx-hide-promoted.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KEYWORD = 'ТОП' // change depending on language

    function hideTopAds() {
        document.querySelectorAll('.css-s3yjnp').forEach(topTag => {
            if (topTag.textContent.trim() === KEYWORD) {
                const adContainer = topTag.closest('.css-1r93q13');
                if (adContainer) {
                    adContainer.style.display = 'none';
                }
            }
        });
    }

    // Run once on page load
    hideTopAds();

    // Optional: Keep checking for dynamically loaded ads (e.g., infinite scroll)
    const observer = new MutationObserver(hideTopAds);
    observer.observe(document.body, { childList: true, subtree: true });
})();
