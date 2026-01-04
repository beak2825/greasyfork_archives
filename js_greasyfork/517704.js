// ==UserScript==
// @name         Hide Lorebook Entries on ChatGPT
// @namespace    https://chatgpt.com
// @version      2.8
// @description  Hide all lorebook entries within <these brackets> by hiding them in the DOM and cleaning up visible text efficiently, including multi-line lorebook entries.
// @author       Your Name
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517704/Hide%20Lorebook%20Entries%20on%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/517704/Hide%20Lorebook%20Entries%20on%20ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Debounce function to limit how often processElements is executed
    function debounce(func, wait) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, arguments), wait);
        };
    }

    function hideTextWithinBrackets(element) {
        // Regular expression to match text within < and > including multi-line text.
        const regex = /<[^>]*?>/gs;

        // Iterate over all child nodes
        Array.from(element.childNodes).forEach(node => {
            // Only process text nodes (not elements or other types of nodes)
            if (node.nodeType === Node.TEXT_NODE) {
                // Match all the lorebook entries
                const matches = node.textContent.match(regex);
                if (matches) {
                    const parent = node.parentNode;
                    const parts = node.textContent.split(regex);

                    parts.forEach((part, index) => {
                        if (part.trim() !== "") {
                            // Create and append visible parts as normal text nodes
                            parent.insertBefore(document.createTextNode(part), node);
                        }
                        if (index < matches.length) {
                            // Create and append hidden span for matched lorebook entry
                            const hiddenSpan = document.createElement('span');
                            hiddenSpan.style.display = 'none';
                            hiddenSpan.textContent = matches[index];
                            parent.insertBefore(hiddenSpan, node);
                        }
                    });

                    // Remove the original text node
                    parent.removeChild(node);
                }
            }
        });
    }

    function processElements() {
        // Select all elements with the specified class
        const elements = document.querySelectorAll('div.whitespace-pre-wrap');

        // Iterate over each element and hide text within brackets
        elements.forEach(element => hideTextWithinBrackets(element));
    }

    // Create a debounced version of processElements
    const debouncedProcessElements = debounce(processElements, 500);

    // Initial run to hide text on page load
    processElements();

    // Monitor for dynamic changes to the page using MutationObserver
    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0 || mutation.type === 'childList') {
                shouldProcess = true;
            }
        });
        if (shouldProcess) {
            debouncedProcessElements();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
