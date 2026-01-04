// ==UserScript==
// @name         Universal Keyboard Navigation
// @namespace    http://tampermonkey.net/
// @version      202403301
// @description  Enables Previous and Next page navigation using keyboard buttons on any site. Browse your favorite Manga, Manhwa, comic, novel sites with ease.
// @author       Chief Legend
// @match        *://*/*
// @exclude      *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=universalnavigation.com
// @license      MIT
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/489685/Universal%20Keyboard%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/489685/Universal%20Keyboard%20Navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of acceptable innerText values for previous and next pages or chapters
    const navigationTexts = {
        prev: ["Previous Chapter", "Prev Chapter", "Prev Page", "Prev"],
        next: ["Next Chapter", "Next Page", "Next"]
    };

    // Cache for the last found links to improve performance
    let lastFoundLinks = {
        prev: null,
        next: null
    };

    function findLink(textArray) {
        for (let text of textArray) {
            let lowerText = text.toLowerCase();

            // XPath to find case-insensitive match
            let xpath = `//a[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'${lowerText}')]`;

            let link = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (link) return link;
        }
        return null;
    }

    // Function to simulate click on Prev or Next link
    function navigate(direction) {
        if (lastFoundLinks[direction]) {
            // If we have cached the link, use it
            lastFoundLinks[direction].click();
            return;
        }

        // Find the link using the list of acceptable values
        let link = findLink(navigationTexts[direction]);

        // Cache the link for subsequent use
        if (link) {
            lastFoundLinks[direction] = link;
            link.click();
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