// ==UserScript==
// @name         Disable All Links
// @namespace    https://github.com/ghoulatsch
// @version      240923
// @description  Disables all links on a webpage and monitors for new links.
// @author       Perplexity AI
// @icon         https://www.iconsdb.com/icons/preview/black/shield-xxl.png
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509846/Disable%20All%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/509846/Disable%20All%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to disable a link
    function disableLink(link) {
        link.classList.add('disabled');
        link.removeAttribute('href');
        link.setAttribute('aria-disabled', 'true');
        link.style.pointerEvents = 'none';
        link.style.cursor = 'not-allowed';
    }

    // Function to disable all existing links
    function disableAllLinks() {
        document.querySelectorAll('a').forEach(link => {
            disableLink(link);
        });
    }

    // Function to observe mutations in the DOM
    function observeNewLinks() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Check if it's an element node
                        const links = node.querySelectorAll('a');
                        links.forEach(link => {
                            disableLink(link);
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initial setup
    disableAllLinks();
    observeNewLinks();
})();
