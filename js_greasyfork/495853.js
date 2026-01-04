// ==UserScript==
// @name         De-Kick Dot Network
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Block all elements with kick.com on IP2.network
// @author       Tammer
// @match        https://ip2.network/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495853/De-Kick%20Dot%20Network.user.js
// @updateURL https://update.greasyfork.org/scripts/495853/De-Kick%20Dot%20Network.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove parent elements of links with href containing kick.com
    function removeKickParentElements() {
        // Select all anchor tags with kick.com in href
        const links = document.querySelectorAll('a[href*="kick.com"]');
        links.forEach(link => {
            // Find the parent .channel element and remove it
            let parent = link.closest('.channel');
            if (parent) {
                parent.remove();
            }
        });
    }

    // Run the function initially
    removeKickParentElements();

    // Set up a mutation observer to watch for new elements being added
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                removeKickParentElements(); // Check new elements
            }
        });
    });

    // Configure the observer to watch the entire document
    observer.observe(document.body, { childList: true, subtree: true });

})();
