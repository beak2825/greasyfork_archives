// ==UserScript==
// @name         Auto Click "Show more" on Steam Store
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks "Show more" buttons on the Steam Store site when visible.
// @author       YourName
// @match        https://store.steampowered.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527027/Auto%20Click%20%22Show%20more%22%20on%20Steam%20Store.user.js
// @updateURL https://update.greasyfork.org/scripts/527027/Auto%20Click%20%22Show%20more%22%20on%20Steam%20Store.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to check if an element is in the viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight + 1500 || document.documentElement.clientHeight + 1500) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Function to check and click the "Show more" button
    function clickShowMore() {
        const buttons = document.querySelectorAll('button'); // Find all buttons on the page
        buttons.forEach(button => {
            if (button.innerText.trim() === "Show more" && isElementInViewport(button)) {
                console.log("Clicking 'Show more' button...");
                button.click();
            }
        });
    }

    // Run the script periodically
    setInterval(clickShowMore, 100); // Check every 1 second
})();
