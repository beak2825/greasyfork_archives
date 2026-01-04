// ==UserScript==
// @name         Solo Leveling Keyboard Navigation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enables keyboard navigation for Solo Leveling manhwa reader.
// @author       Chief Legend
// @match        https://www.solo-leveling-manhwa.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488910/Solo%20Leveling%20Keyboard%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/488910/Solo%20Leveling%20Keyboard%20Navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to simulate click on Prev or Next link
    function navigate(direction) {
        // Use XPath to find the Prev and Next links by their text content
        var prevLink = document.evaluate("//a[contains(text(),'Prev')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        var nextLink = document.evaluate("//a[contains(text(),'Next')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        // Simulate click on the appropriate link
        if (direction === 'prev' && prevLink) {
            prevLink.click();
        } else if (direction === 'next' && nextLink) {
            nextLink.click();
        }
    }

    // Add keydown event listener to the document
    document.addEventListener('keydown', function(event) {
        // Check if the left arrow key (ArrowLeft) or right arrow key (ArrowRight) was pressed
        if (event.key === 'ArrowLeft') {
            navigate('prev');
        } else if (event.key === 'ArrowRight') {
            navigate('next');
        }
    });
})();