// ==UserScript==
// @name         Remove Chat Timestamps on fishtank.live
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove timestamp
// @author       Blungs
// @match        https://*.fishtank.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fishtank.live
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/515382/Remove%20Chat%20Timestamps%20on%20fishtanklive.user.js
// @updateURL https://update.greasyfork.org/scripts/515382/Remove%20Chat%20Timestamps%20on%20fishtanklive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove timestamp elements
    function removeTimestamps() {
        const timestamps = document.querySelectorAll('.chat-message-default_timestamp__sGwZy');
        timestamps.forEach(timestamp => timestamp.remove());
    }

    // Run the function initially in case some timestamps are already present
    removeTimestamps();

    // Set up a MutationObserver to detect new timestamps added dynamically
    const observer = new MutationObserver(removeTimestamps);

    // Observe changes to the document body for dynamically added elements
    observer.observe(document.body, { childList: true, subtree: true });
})();