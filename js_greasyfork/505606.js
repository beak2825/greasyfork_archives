// ==UserScript==
// @name         Convert Binary to Text on Facebook Posts
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Convert binary text to readable text on Facebook posts.
// @match        https://www.facebook.com/*/posts/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/505606/Convert%20Binary%20to%20Text%20on%20Facebook%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/505606/Convert%20Binary%20to%20Text%20on%20Facebook%20Posts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the text content is binary
    function isBinaryString(str) {
        return /^[01\s]+$/.test(str);
    }

    // Convert binary string to text
    function binaryToText(binaryStr) {
        let text = '';
        binaryStr = binaryStr.replace(/\s+/g, ''); // Remove any whitespace
        for (let i = 0; i < binaryStr.length; i += 8) {
            let byte = binaryStr.slice(i, i + 8);
            text += String.fromCharCode(parseInt(byte, 2));
        }
        return text;
    }

    // Process and convert binary text nodes
    function processTextNodes(rootNode) {
        const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            let textContent = node.textContent.trim();
            if (textContent.length > 0 && isBinaryString(textContent)) {
                node.textContent = binaryToText(textContent);
            }
        }
    }

    // Function to process the whole page
    function processPage() {
        processTextNodes(document.body);
    }

    // Run the processPage function every second
    const intervalId = setInterval(() => {
        processPage();
    }, 1000);

    // Clear the interval when the page is unloaded
    window.addEventListener('beforeunload', () => {
        clearInterval(intervalId);
    });

    // Initial processing
    processPage();
})();
