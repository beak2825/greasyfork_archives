// ==UserScript==
// @name         Remove Facebook "Suggested for You" and "Reels"
// @namespace    -
// @version      1.1
// @description  Dynamically removes "Removed suggested for You" and "Removed reels" elements on Facebook
// @author       jamescasipong
// @match        https://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518146/Remove%20Facebook%20%22Suggested%20for%20You%22%20and%20%22Reels%22.user.js
// @updateURL https://update.greasyfork.org/scripts/518146/Remove%20Facebook%20%22Suggested%20for%20You%22%20and%20%22Reels%22.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to remove elements based on text content
    function removeElementsByText(textArray) {
        textArray.forEach((text) => {
            const elements = Array.from(document.querySelectorAll('div'))
                .filter(el => el.textContent.trim().toLowerCase().includes(text.toLowerCase()));
            elements.forEach(element => element.remove());
        });
    }

    // Initialize MutationObserver
    const observer = new MutationObserver(() => {
        removeElementsByText([
            "removed suggested for you",
            "removed reels"
        ]);
    });

    // Start observing the body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Initial cleanup on page load
    removeElementsByText([
        "removed suggested for you",
        "removed reels"
    ]);
})();
