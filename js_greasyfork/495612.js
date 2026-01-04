// ==UserScript==
// @name         Remove Facebook app nag bar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove the "Get the best experience on the app" bar appearing at the bottom of Facebook mobile pages
// @author       nugohs
// @match        *://*.facebook.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495612/Remove%20Facebook%20app%20nag%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/495612/Remove%20Facebook%20app%20nag%20bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the specified div
    function removeDiv() {
        const div = document.querySelector('div[data-comp-id="22222"]');
        if (div) {
            div.remove();
            console.log('Removed the specified div');
        }
    }

    // Initial attempt to remove the div
    removeDiv();

    // Observe the page for changes and attempt to remove the div if it reappears
    const observer = new MutationObserver(removeDiv);
    observer.observe(document.body, { childList: true, subtree: true });
})();