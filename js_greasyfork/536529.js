// ==UserScript==
// @name         Hide Live Players Count - GeoGuessr
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide the live players count element on GeoGuessr
// @author       Rotski
// @match        https://www.geoguessr.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536529/Hide%20Live%20Players%20Count%20-%20GeoGuessr.user.js
// @updateURL https://update.greasyfork.org/scripts/536529/Hide%20Live%20Players%20Count%20-%20GeoGuessr.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load and observe changes
    const hideElement = () => {
        const el = document.querySelector('.live-players-count_container__RFvCF');
        if (el) {
            el.style.display = 'none';
        }
    };

    // Initial attempt
    hideElement();

    // In case it's dynamically loaded later
    const observer = new MutationObserver(() => hideElement());
    observer.observe(document.body, { childList: true, subtree: true });
})();
