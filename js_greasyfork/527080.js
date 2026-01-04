// ==UserScript==
// @name         Kirka.io Comma's
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Format numbers with commas as thousand separators
// @author       Life.css 
// @license      life.css - https://github.com/LifeCss
// @match        https://snipers.io/
// @match        https://kirka.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=snipers.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527080/Kirkaio%20Comma%27s.user.js
// @updateURL https://update.greasyfork.org/scripts/527080/Kirkaio%20Comma%27s.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to format numbers with commas
    function formatNumberWithCommas(number) {
        // Convert the number to a string
        let numStr = number.toString();

        // Use regex to add commas as thousand separators
        return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Function to find and format all numbers in the DOM
    function formatAllNumbers() {
        // Get all text nodes in the document
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;

        // Loop through all text nodes
        while (node = walker.nextNode()) {
            const text = node.nodeValue;

            // Use regex to find numbers in the text
            const formattedText = text.replace(/\b\d{4,}\b/g, (match) => {
                return formatNumberWithCommas(match);
            });

            // Update the text node if changes were made
            if (formattedText !== text) {
                node.nodeValue = formattedText;
            }
        }
    }

    // Run the formatter when the page loads
    window.addEventListener('load', formatAllNumbers);

    // Optional: Run the formatter periodically to handle dynamically loaded content
    setInterval(formatAllNumbers, 1000); // Check every second
})();