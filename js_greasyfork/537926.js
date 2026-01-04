// ==UserScript==
// @name         F-List Quote Text Remover
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes the "Quote:" text from quote boxes on F-List profiles.
// @author       You
// @match        https://www.f-list.net/c/*
// @match        https://www.f-list.net/chat/view_log.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537926/F-List%20Quote%20Text%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/537926/F-List%20Quote%20Text%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Selector for the element containing "Quote:"
    const selector = "div.QuoteHeader";

    function removeQuoteHeaderText() {
        const quoteHeaders = document.querySelectorAll(selector);
        quoteHeaders.forEach(header => {
            // Option 1: Hide the entire header element (most common and cleanest)
            header.style.display = 'none';

            // Option 2: If you only wanted to clear the text but keep the element (less likely):
            // header.textContent = '';

            // Option 3: If the text "Quote:" might be accompanied by other text
            // in the same div.QuoteHeader that you want to keep (unlikely given the name):
            // if (header.textContent.trim().toLowerCase().startsWith("quote:")) {
            //     header.innerHTML = header.innerHTML.replace(/Quote:/i, '');
            // }
        });
    }

    // Run the function when the page loads
    // Using DOMContentLoaded is often better as it fires earlier than 'load'
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeQuoteHeaderText);
    } else {
        // DOMContentLoaded has already fired
        removeQuoteHeaderText();
    }

    // F-List might load content dynamically (e.g., in chat logs or when switching tabs).
    // A MutationObserver handles elements added after the initial page load.
    const observer = new MutationObserver(function(mutations) {
        let needsUpdate = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                // Check if any added nodes are or contain the target selector
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Check if it's an element node
                        if (node.matches(selector) || node.querySelector(selector)) {
                            needsUpdate = true;
                        }
                    }
                });
            }
        });
        if (needsUpdate) {
            removeQuoteHeaderText();
        }
    });

    // Start observing the document body for added child nodes and subtree modifications
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run in case content is already there (though DOMContentLoaded should cover most static cases)
    removeQuoteHeaderText();

})();