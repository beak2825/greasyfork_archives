// ==UserScript==
// @name         BlueSky Handle Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the ".bsky.social" part from handles visually while preserving functionality
// @author       mopolo
// @match        https://*.bsky.app/*
// @match        https://*.bsky.dev/*
// @match        https://bsky.app/*
// @match        https://bsky.dev/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534659/BlueSky%20Handle%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/534659/BlueSky%20Handle%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to process text nodes
    function processTextNode(node) {
        // Skip processing for nodes inside style or script tags
        if (node.parentNode && (node.parentNode.nodeName === 'STYLE' || node.parentNode.nodeName === 'SCRIPT')) {
            return;
        }

        const originalText = node.nodeValue;
        // Match both .bsky.social and other potential domains like .bsky.dev
        const newText = originalText
            .replace(/(@[\w-]+)\.bsky\.social/g, '$1\u00A0')
            .replace(/(@[\w-]+)\.bsky\.dev/g, '$1\u00A0')
            .replace(/(@[\w-]+)\.bsky\.app/g, '$1\u00A0');
        if (originalText !== newText) {
            node.nodeValue = newText;
        }
    }

    // Process all existing text nodes
    function processExistingNodes() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        textNodes.forEach(processTextNode);
    }

    // Set up a mutation observer to process any new nodes
    function observeDOMChanges() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                // Process added nodes
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const addedNode = mutation.addedNodes[i];
                        // Process text nodes directly
                        if (addedNode.nodeType === Node.TEXT_NODE) {
                            processTextNode(addedNode);
                        }
                        // Process text nodes within the added node
                        if (addedNode.nodeType === Node.ELEMENT_NODE) {
                            const walker = document.createTreeWalker(addedNode, NodeFilter.SHOW_TEXT, null, false);
                            let textNode;
                            while (textNode = walker.nextNode()) {
                                processTextNode(textNode);
                            }
                        }
                    }
                }
                // Process character data changes
                if (mutation.type === 'characterData') {
                    processTextNode(mutation.target);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // Run our functions when the page is loaded
    function init() {
        console.log('BlueSky Handle Cleaner: Script started');
        // Initial processing might need to wait for dynamic content to load
        processExistingNodes();
        // Set up observer to catch new content
        observeDOMChanges();
        // Run additional passes to catch any dynamically loaded content
        setTimeout(processExistingNodes, 1500);
        setTimeout(processExistingNodes, 3000);
    }

    // Ensure script runs regardless of how the page is loaded
    if (document.readyState === 'complete') {
        // Page is already loaded
        init();
    } else {
        // Wait for page to load
        window.addEventListener('load', init);
        // Also try with DOMContentLoaded as backup
        window.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, 500);
        });
    }
})();