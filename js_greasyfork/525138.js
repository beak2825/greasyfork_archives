// ==UserScript==
// @name         Disable Mailto Links
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Disable all mailto links on web pages
// @include      *
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525138/Disable%20Mailto%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/525138/Disable%20Mailto%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to disable a single mailto link
    function disableMailtoLink(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
        });
        link.style.pointerEvents = 'none'; // Optional: visually indicate the link is disabled
        link.style.color = 'gray'; // Optional: change link color to show it's disabled
    }

    // Function to disable all mailto links
    function disableMailtoLinks() {
        const links = document.querySelectorAll('a[href^="mailto:"]');
        links.forEach(disableMailtoLink);
    }

    // Run the function on page load
    window.addEventListener('load', disableMailtoLinks);

    // Set up a MutationObserver to watch for new mailto links
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches('a[href^="mailto:"]')) {
                        disableMailtoLink(node);
                    }
                    // Check within the node for any new mailto links
                    node.querySelectorAll && node.querySelectorAll('a[href^="mailto:"]').forEach(disableMailtoLink);
                }
            });
        });
    });

    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();