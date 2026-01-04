// ==UserScript==
// @name         Dynamic and Static Text Replacer for voxiom.io
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Replace specified text on voxiom.io, including static and dynamic content
// @author       You
// @match        https://voxiom.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536546/Dynamic%20and%20Static%20Text%20Replacer%20for%20voxiomio.user.js
// @updateURL https://update.greasyfork.org/scripts/536546/Dynamic%20and%20Static%20Text%20Replacer%20for%20voxiomio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the text to search for and replace with
    const searchterm = 'yourName';
    const replaceterm = 'customName';

    // Function to escape special characters in the search term for use in RegExp
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Function to replace text in a given node
    function replaceTextInNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            // Skip script and style tags to avoid breaking the page
            if (node.parentNode && node.parentNode.tagName !== 'SCRIPT' && node.parentNode.tagName !== 'STYLE') {
                node.nodeValue = node.nodeValue.replace(new RegExp(escapeRegExp(searchterm), 'g'), replaceterm);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Handle input elements
            if (node.tagName === 'INPUT' && ['text', 'search', 'password', 'email', 'url'].includes(node.type)) {
                node.value = node.value.replace(new RegExp(escapeRegExp(searchterm), 'g'), replaceterm);
            }
            // Recurse into child nodes
            node.childNodes.forEach(replaceTextInNode);
        }
    }

    // Function to perform replacement on the entire document
    function replaceAllText() {
        replaceTextInNode(document.body);
    }

    // Run initial replacement after a short delay to ensure DOM is fully loaded
    setTimeout(replaceAllText, 1000);

    // Set up MutationObserver to handle dynamic content
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                replaceTextInNode(node);
            });
        });
    });

    // Configure observer to watch for changes in the entire document
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();