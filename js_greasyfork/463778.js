// ==UserScript==
// @name         Remove "For you" and "Popular" from Youtube Channel Videos tab
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Remove "For you" and "Popular" from Youtube Channel Videos tab .
// @author       TheLegendaryBusman
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463778/Remove%20%22For%20you%22%20and%20%22Popular%22%20from%20Youtube%20Channel%20Videos%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/463778/Remove%20%22For%20you%22%20and%20%22Popular%22%20from%20Youtube%20Channel%20Videos%20tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for 1 second after page load
    setTimeout(function() {

        // Find the target element
        const targetElement = document.querySelector('ytd-two-column-browse-results-renderer.grid-6-columns > div:nth-child(1) > ytd-rich-grid-renderer:nth-child(1) > div:nth-child(1) > ytd-feed-filter-chip-bar-renderer:nth-child(1) > div:nth-child(1) > div:nth-child(3) > iron-selector:nth-child(1)');

        // If the element has three children, click the first one and hide the last one
        if (targetElement && targetElement.children.length === 3) {
            const firstChild = targetElement.children[0];
            const lastChild = targetElement.children[2];

            firstChild.click();
            lastChild.style.display = 'none';
        }

    }, 1000); // Wait for 1 second after page load
})();