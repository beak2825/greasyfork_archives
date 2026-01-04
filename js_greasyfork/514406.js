// ==UserScript==
// @name         Binary to Text Translator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically translates binary code to text on web pages without adding extra spaces between letters.
// @author       ChatGpt4mini
// @match        *://*/*
// @match        *http://reddit.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514406/Binary%20to%20Text%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/514406/Binary%20to%20Text%20Translator.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to convert binary string to text
    function binaryToText(binary) {
        // Remove any extra spaces and split binary into 8-bit chunks
        return binary.replace(/\s+/g, '').match(/.{1,8}/g)
                     .map(bin => String.fromCharCode(parseInt(bin, 2)))
                     .join('');
    }

    // Function to find and translate binary text
    function translateBinary() {
        const textNodes = [];

        // Function to traverse DOM and get text nodes
        function getTextNodes(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.nodeValue.trim()) {
                    textNodes.push(node);
                }
            } else {
                node.childNodes.forEach(getTextNodes);
            }
        }

        // Get all text nodes in the document
        getTextNodes(document.body);

        // Iterate through each text node and replace binary with translated text
        textNodes.forEach(node => {
            const regex = /\b(?:[01]{8}(?:\s)?)+\b/g; // Matches sequences of 8-bit binary numbers
            const originalText = node.nodeValue;
            const translatedText = originalText.replace(regex, match => binaryToText(match));

            if (originalText !== translatedText) {
                node.nodeValue = translatedText;
            }
        });
    }

    // Run the translation function
    translateBinary();

    // Observe changes in the body for dynamically added content
    const observer = new MutationObserver(translateBinary);
    observer.observe(document.body, { childList: true, subtree: true });
})();
