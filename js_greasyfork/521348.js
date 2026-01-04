// ==UserScript==
// @name         Hide Enclosed Text in Angle Brackets
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Move text enclosed in < > into hidden spans
// @author       YourName
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521348/Hide%20Enclosed%20Text%20in%20Angle%20Brackets.user.js
// @updateURL https://update.greasyfork.org/scripts/521348/Hide%20Enclosed%20Text%20in%20Angle%20Brackets.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to hide text within angle brackets
    function hideBracketText(node) {
        const regex = /<([^>]+)>/g;

        // Ensure the node is a text node
        if (node.nodeType === Node.TEXT_NODE) {
            const parent = node.parentNode;

            // Exclude nodes inside the prompt textarea, any textdoc-message element with dynamic id, section.w-full, and #codemirror
            if (parent.closest && (
                parent.closest('div#prompt-textarea.ProseMirror') ||
                parent.closest('.overflow-y-auto') ||
                parent.closest('[id^="textdoc-message-"]') ||
                parent.closest('section.w-full') ||
                parent.closest('#codemirror')
            )) {
                console.log('Excluded element:', parent);
                return;  // Exclude the entire element and its descendants
            }

            const matches = [...node.nodeValue.matchAll(regex)];
            if (matches.length > 0) {
                let lastIndex = 0;
                matches.forEach(match => {
                    const before = document.createTextNode(node.nodeValue.slice(lastIndex, match.index));
                    const hiddenSpan = document.createElement('span');
                    hiddenSpan.style.display = 'none'; // Hide the text
                    hiddenSpan.textContent = match[0]; // Include the full match (e.g., <text>)
                    parent.insertBefore(before, node);
                    parent.insertBefore(hiddenSpan, node);
                    lastIndex = match.index + match[0].length;
                });
                const after = document.createTextNode(node.nodeValue.slice(lastIndex));
                parent.insertBefore(after, node);
                parent.removeChild(node);
            }
        }
    }

    // Process only visible and editable elements
    function processVisibleTextNodes() {
        document.querySelectorAll('*:not(script):not(style)').forEach(node => {
            if (node.childNodes && node.offsetParent !== null) { // Ensures visibility
                node.childNodes.forEach(child => {
                    if (!child.parentNode.closest('div#prompt-textarea.ProseMirror') &&
                        !child.parentNode.closest('[id^="textdoc-message-"]') &&
                        !child.parentNode.closest('.overflow-y-auto') &&
                        !child.parentNode.closest('section.w-full') &&
                        !child.parentNode.closest('#codemirror')) {
                        hideBracketText(child);
                    }
                });
            }
        });
    }

    // Run the function initially and observe DOM for changes
    processVisibleTextNodes();

    // Observe DOM changes to dynamically apply the script
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(addedNode => {
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    if (!addedNode.closest('div#prompt-textarea.ProseMirror') &&
                        !addedNode.closest('[id^="textdoc-message-"]') &&
                        !addedNode.closest('.overflow-y-auto') &&
                        !addedNode.closest('section.w-full') &&
                        !addedNode.closest('#codemirror')) {
                        processVisibleTextNodes();
                    }
                } else if (addedNode.nodeType === Node.TEXT_NODE) {
                    if (!addedNode.parentNode.closest('div#prompt-textarea.ProseMirror') &&
                        !addedNode.parentNode.closest('[id^="textdoc-message-"]') &&
                        !addedNode.parentNode.closest('.overflow-y-auto') &&
                        !addedNode.parentNode.closest('section.w-full') &&
                        !addedNode.parentNode.closest('#codemirror')) {
                        hideBracketText(addedNode);
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
