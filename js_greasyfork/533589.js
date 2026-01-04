// ==UserScript==
// @name         Mahgoub.com Out of Stock Filter
// @namespace    http://tampermonkey.net/
// @version      2025-04-22
// @description  Removes all out of stock items on mahgoub.com
// @author       SwanKnight
// @match        https://www.mahgoub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mahgoub.com
// @grant        none
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/533589/Mahgoubcom%20Out%20of%20Stock%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/533589/Mahgoubcom%20Out%20of%20Stock%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Processes a given root node to find each matching product DIV.
     * If a matching product is found (i.e. it has a child DIV with class "red"),
     * its parent is removed from the DOM.
     *
     * @param {HTMLElement|Document} root
     */
    function processNode(root) {
        // Find all DIVs with class "product" within the root element.
        const productDivs = root.querySelectorAll('div.product');
        productDivs.forEach(product => {
            // Check if the product contains a descendant DIV with class "red".
            if (product.querySelector('div.red')) {
                // Retrieve the parent element of the product DIV.
                const parentDiv = product.parentElement;
                if (parentDiv) {
                    parentDiv.remove();
                }
            }
        });
    }

    // Run the initial processing when the DOM is fully loaded.
    window.addEventListener('load', () => {
        processNode(document);

        // Create a MutationObserver to watch for nodes being added to the body.
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                // Process each added node if it is an element.
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Process the newly added node and its subtree.
                        processNode(node);
                    }
                });
            });
        });

        // Begin observing the document body for alterations.
        observer.observe(document.body, {
            childList: true, // Look for added or removed nodes.
            subtree: true // Observe the entire subtree.
        });
    });
})();