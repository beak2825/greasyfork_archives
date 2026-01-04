// ==UserScript==
// @name         Alert New Image Src
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Alert the src attribute of newly created img elements.
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519276/Alert%20New%20Image%20Src.user.js
// @updateURL https://update.greasyfork.org/scripts/519276/Alert%20New%20Image%20Src.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a MutationObserver to monitor changes in the DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Check if new nodes were added
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    // Check if the added node is an img element
                    if (node.tagName === 'IMG') {
                        const src = node.src || 'No src attribute';
                        alert(`New Image Created! \nSRC: ${src}`);
                    }
                    // Handle nested elements that may contain img elements
                    if (node.querySelectorAll) {
                        const imgs = node.querySelectorAll('img');
                        imgs.forEach(img => {
                            const src = img.src || 'No src attribute';
                            alert(`New Image Created! \nSRC: ${src}`);
                        });
                    }
                });
            }
        });
    });

    // Start observing the document body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });
})();
