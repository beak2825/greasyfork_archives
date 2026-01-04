// ==UserScript==
// @name         Reddit - Collapse Sidebar Menus By Default
// @namespace    http://tampermonkey.net/
// @version      2025.07.18.2
// @description  Finds sidebar menus with an 'open' attribute and removes it to collapse them on load.
// @author       Prompted by Polyphrog, written by Gemini 2.5 Pro
// @match        https://www.reddit.com/*
// @grant        none
// @run-at       document-start
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/542948/Reddit%20-%20Collapse%20Sidebar%20Menus%20By%20Default.user.js
// @updateURL https://update.greasyfork.org/scripts/542948/Reddit%20-%20Collapse%20Sidebar%20Menus%20By%20Default.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Finds and removes the 'open' attribute from the <details> element,
     * which is the true mechanism controlling the accordion menu.
     * @param {HTMLElement} node - The HTML node to scan for open menus.
     */
    const closeExpandedMenus = (node) => {
        // The key is the <details> element having the 'open' attribute.
        // We find all of them within the node that was just added to the page.
        const openDetails = node.querySelectorAll('details[open]');

        if (openDetails.length > 0) {
            openDetails.forEach(detailsElement => {
                // By removing the 'open' attribute, the browser will automatically
                // collapse the <details> element and update aria-expanded for us.
                // This is the definitive way to close it.
                console.log('Found open <details> element, closing it.');
                detailsElement.removeAttribute('open');

                // We can also remove the 'open' attribute from the parent just in case,
                // though modifying the <details> tag is the most critical part.
                const parentHelper = detailsElement.closest('faceplate-expandable-section-helper');
                if (parentHelper?.hasAttribute('open')) {
                    parentHelper.removeAttribute('open');
                }
            });
        }
    };

    // We still need a MutationObserver because Reddit loads these elements dynamically.
    // This part of the logic remains essential.
    const observer = new MutationObserver((mutationsList, obs) => {
        for (const mutation of mutationsList) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    // Ensure we are only checking HTML elements.
                    if (node.nodeType === 1) {
                        // Check the node itself if it's an open details element
                        if (node.tagName === 'DETAILS' && node.hasAttribute('open')) {
                           closeExpandedMenus(node.parentElement);
                        }
                        // Also check inside the new node for any open details elements
                        closeExpandedMenus(node);
                    }
                });
            }
        }
    });

    // Start observing the page for changes as soon as the body exists.
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();