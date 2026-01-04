// ==UserScript==
// @name         Remove Used items in chat on fishtank.live
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove Used items in chat
// @author       Blungs
// @match        https://*.fishtank.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fishtank.live
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/515928/Remove%20Used%20items%20in%20chat%20on%20fishtanklive.user.js
// @updateURL https://update.greasyfork.org/scripts/515928/Remove%20Used%20items%20in%20chat%20on%20fishtanklive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove used items elements based on class prefix
    function removeUsedItems() {
        // Select all elements whose class name starts with 'chat-message-happening_item__mi9tp'
        const usedItems = document.querySelectorAll('[class^="chat-message-happening_item__mi9tp"]');

        usedItems.forEach(item => item.remove());
    }

    // Run the function initially to remove any items present on page load
    removeUsedItems();

    // Set up a MutationObserver to detect dynamically added elements
    const observer = new MutationObserver(removeUsedItems);

    // Observe changes to the document body for dynamically added elements
    observer.observe(document.body, { childList: true, subtree: true });
})();
