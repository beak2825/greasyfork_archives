// ==UserScript==
// @name         MangaFox FanFox Keyboard Navigation
// @namespace    http://tampermonkey.net/
// @version      2024-03-03
// @description  Enables Previous and Next chapter navigation using keyboard buttons
// @author       Chief Legend
// @match        https://fanfox.net/manga/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fanfox.net
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488911/MangaFox%20FanFox%20Keyboard%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/488911/MangaFox%20FanFox%20Keyboard%20Navigation.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to simulate click on Prev or Next link
    function navigate(direction) {
        // Use XPath to find the Prev and Next links by their text content
        var prevLink = document.evaluate("//a[contains(text(),'Pre chapter')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        var nextLink = document.evaluate("//a[contains(text(),'Next Chapter')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

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
