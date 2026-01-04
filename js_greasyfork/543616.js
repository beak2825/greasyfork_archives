// ==UserScript==
// @name        Middle dot word truncator
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.1
// @author      kirinyaga
// @description Truncate words containing '·' at the middle dot
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/543616/Middle%20dot%20word%20truncator.user.js
// @updateURL https://update.greasyfork.org/scripts/543616/Middle%20dot%20word%20truncator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to process text nodes
    function processTextNode(node) {
        const text = node.nodeValue;

        // Split text into words while preserving whitespace
        const words = text.split(/(\s+)/);

        // Process each word
        const processedWords = words.map(word => {
            // Skip whitespace-only segments
            if (/^\s+$/.test(word)) return word;

            // Check if word contains middle dot
            if (word.includes('·')) {
                // Split at first middle dot and take the part before it
                return word.split('·')[0];
            }
            return word;
        });

        // Reconstruct the text
        const newText = processedWords.join('');

        // Only update if changed
        if (newText !== text) {
            node.nodeValue = newText;
        }
    }

    function scanTextNodes() {
        // Create a TreeWalker to traverse all text nodes
        const treeWalker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // Skip text nodes in script, style, and textarea elements
                    if (node.parentNode.nodeName === 'SCRIPT' ||
                        node.parentNode.nodeName === 'STYLE' ||
                        node.parentNode.nodeName === 'TEXTAREA') {
                        return NodeFilter.FILTER_SKIP;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        // Process each text node
        const textNodes = [];
        while (treeWalker.nextNode()) {
            textNodes.push(treeWalker.currentNode);
        }

        // Process nodes in reverse to avoid issues with DOM modification
        for (let i = textNodes.length - 1; i >= 0; i--) {
            processTextNode(textNodes[i]);
        }
    }

    setTimeout(scanTextNodes,3000);
})();
