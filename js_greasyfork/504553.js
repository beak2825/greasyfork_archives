// ==UserScript==
// @name         Hide Facebook News Feed
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Hide specific Facebook elements and handle dynamic content
// @author       Jackson Peters and ChatGPT
// @match        *://www.facebook.com/*
// @grant        none
// @run-at       document-end
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/504553/Hide%20Facebook%20News%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/504553/Hide%20Facebook%20News%20Feed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideElements() {
        if (window.location.hostname !== 'www.facebook.com') return; // Only apply on facebook.com
        const elements = document.querySelectorAll('.x1w9j1nh.x1mtsufr.xqmdsaz.x1xfsgkm.x1iplk16.x1q0g3np.xozqiw3.x1qjc9v5.xl56j7k.xeuugli.xs83m0k.x1iyjqo2.x78zum5.x1ja2u2z.x1n2onr6.x9f619');
        elements.forEach(el => el.style.display = 'none');
    }

    function init() {
        hideElements();

        // Set up a MutationObserver to hide elements added dynamically
        const observer = new MutationObserver(() => hideElements());
        observer.observe(document.body, { childList: true, subtree: true });

        // Handle page navigation within Facebook
        window.addEventListener('popstate', hideElements);

        const originalPushState = history.pushState;
        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            hideElements();
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            hideElements();
        };
    }

    // Initialize after the page loads
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
