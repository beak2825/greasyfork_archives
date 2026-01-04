// ==UserScript==
// @name         Remove Google Ads by Query ID
// @version      1.0
// @description  Remove any Google ads from the page with a data-google-query-id attribute
// @author       Alex Bove
// @match        *://*/*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/en/users/691704
// @downloadURL https://update.greasyfork.org/scripts/502820/Remove%20Google%20Ads%20by%20Query%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/502820/Remove%20Google%20Ads%20by%20Query%20ID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove ad containers
    function removeAds() {
        const adContainers = document.querySelectorAll('div[data-google-query-id]');
        adContainers.forEach(adContainer => {
            adContainer.remove();
            console.log(`Removed ad container with data-google-query-id: ${adContainer.getAttribute('data-google-query-id')}`);
        });
    }

    // Run the function to remove ads
    removeAds();

    // Optionally, observe for changes and remove newly added ads
    const observer = new MutationObserver(() => {
        removeAds();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
