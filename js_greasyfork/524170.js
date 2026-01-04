// ==UserScript==
// @name         8mb.video Custom MB Bypass
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Enables the custom MB option on 8mb.video by modifying the data-disabled attribute.
// @author       Your Name
// @match        https://8mb.video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524170/8mbvideo%20Custom%20MB%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/524170/8mbvideo%20Custom%20MB%20Bypass.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Track whether the custom MB option has been enabled
    let isEnabled = false;

    function enableCustomMBOption() {
        const size101 = document.querySelector('#size101');
        const customsize = document.querySelector('#customsize');

        if (size101 && customsize && !isEnabled) {
            // Set the data-disabled attribute to false for both elements
            size101.setAttribute('data-disabled', 'false');
            customsize.setAttribute('data-disabled', 'false');

            // Remove the disabled property if it exists
            size101.disabled = false;
            customsize.disabled = false;

            console.log('Custom MB option enabled!');
            isEnabled = true; // Mark as enabled to prevent repeated actions
        }
    }

    // Observe the DOM for changes
    const observer = new MutationObserver(() => {
        enableCustomMBOption();
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial attempt to enable the custom MB option
    enableCustomMBOption();
})();