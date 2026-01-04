// ==UserScript==
// @name         Hide City Link in Torn
// @namespace    torn_hide_city
// @version      1.1
// @license      MIT
// @description  Hides the city text and icon, including search autocomplete, on all Torn pages.
// @author       yoyoYossarian
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525384/Hide%20City%20Link%20in%20Torn.user.js
// @updateURL https://update.greasyfork.org/scripts/525384/Hide%20City%20Link%20in%20Torn.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function hideCityElements() {
        // Hide main city link in the UI
        const cityLink = document.querySelector('a[href="city.php"]');
        if (cityLink) {
            cityLink.style.display = 'none';
        }

        // Hide city link in autocomplete search results
        const observer = new MutationObserver(() => {
            document.querySelectorAll('a[href="city.php"]').forEach(link => {
                link.style.display = 'none';
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Wait for the page to load before hiding elements
    window.addEventListener('load', hideCityElements);
})();
