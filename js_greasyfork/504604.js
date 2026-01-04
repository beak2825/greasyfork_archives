// ==UserScript==
// @name         Neopets Comma Adder
// @version      0.2
// @description  Format numbers with commas in Auction House and Food Club
// @match        *://*.neopets.com/pirates/foodclub.phtml*
// @match        *://*.neopets.com/genie.phtml*
// @match        *://*.neopets.com/auctions.phtml
// @match        *://*.neopets.com/auctions.phtml?auction_counter=*
// @icon         https://images.neopets.com/new_shopkeepers/t_1900.gif
// @author       Posterboy
// @namespace    https://greasyfork.org/users/1277376
// @downloadURL https://update.greasyfork.org/scripts/504604/Neopets%20Comma%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/504604/Neopets%20Comma%20Adder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to format numbers with commas
    function formatNumberWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Function to recursively format numbers in the text nodes
    function formatTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const textContent = node.textContent;
            const formattedText = textContent.replace(/(\d+)(?:\.(\d+))?/g, (match, integerPart, decimalPart) => {
                const formattedIntegerPart = formatNumberWithCommas(integerPart);
                return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
            });
            if (formattedText !== textContent) {
                node.textContent = formattedText;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            node.childNodes.forEach(child => formatTextNodes(child));
        }
    }

    // Function to format numbers on the page
    function formatNumbersOnPage() {
        formatTextNodes(document.body);
    }

    // Run the formatting function after the page loads
    window.addEventListener('load', formatNumbersOnPage);

    // Optionally, observe for DOM changes and format numbers in dynamically added content
    const observer = new MutationObserver(() => {
        formatNumbersOnPage();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
