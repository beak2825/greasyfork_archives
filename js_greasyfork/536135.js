// ==UserScript==
// @name         GeoGuessr Daily Challenge Click
// @namespace    https://greasyfork.org/en/users/1168708-rotski
// @version      1.0
// @description  Redirects to the Daily Challenge page when clicking the daily streak icon on the home page.
// @author       rotski
// @license      MIT
// @match        https://www.geoguessr.com/*
// @icon         https://www.geoguessr.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536135/GeoGuessr%20Daily%20Challenge%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/536135/GeoGuessr%20Daily%20Challenge%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function enableClickRedirect() {
        const target = document.querySelector('.daily-streak_root__njtkG');
        if (target && !target.dataset.listenerAdded) {
            // Redirect to Daily Challenge on click
            target.addEventListener('click', function(e) {
                e.stopPropagation();
                window.location.href = 'https://www.geoguessr.com/daily-challenges';
            });

            // Change cursor to pointer
            target.style.cursor = 'pointer';

            // Prevent duplicate listener
            target.dataset.listenerAdded = 'true';
        }
    }

    // Initial run
    enableClickRedirect();

    // Watch for dynamic loading
    const observer = new MutationObserver(enableClickRedirect);
    observer.observe(document.body, { childList: true, subtree: true });
})();
