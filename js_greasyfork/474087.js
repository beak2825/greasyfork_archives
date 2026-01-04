// ==UserScript==
// @name         Hide Instagram Feed, Stories, Reels, and Explore Page
// @namespace    https://vlahov.xyz/
// @version      1.1
// @description  This script removes the stories, feeds, reels, and explore page from Instagram, allowing you to see only the things you explicitly search for. It's supposed to help you remove some distractions from your life, while still allowing you to browse through Instagram if you actually need to see something there.
// @author       Ivan Vlahov
// @match        https://www.instagram.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474087/Hide%20Instagram%20Feed%2C%20Stories%2C%20Reels%2C%20and%20Explore%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/474087/Hide%20Instagram%20Feed%2C%20Stories%2C%20Reels%2C%20and%20Explore%20Page.meta.js
// ==/UserScript==

function removeInstagramFeedAndStories() {
    'use strict';

    console.log("Using tamper monkey script: Hide Instagram Feed and Stories");

    const hrefValuesMatch = ["https://www.instagram.com/", "https://www.instagram.com"];
    const hrefValuesStartsWith = ["https://www.instagram.com/explore", "https://www.instagram.com/reels"];

    const interval = setInterval(() => {
        // Get a reference to the 'main' element
        const mainElement = document.querySelector('main');

        const url = document.location.href;

        const match = hrefValuesMatch.includes(document.location.href);
        const startsWith = hrefValuesStartsWith.map((value) => document.location.href.startsWith(value)).some((e) => e);

        const hrefMatch = match || startsWith;

        if (hrefMatch && mainElement) {
            // Loop through the children and remove them
            while (mainElement.firstChild) {
                mainElement.removeChild(mainElement.firstChild);
            }

            // Create a new child element
            const blockedMessageElement = document.createElement('div');

            // Set the text content of the child element
            blockedMessageElement.textContent = "Feed and Stories have been blocked by a TamperMonkey script.";

            // Append the child element to the 'main' element
            mainElement.appendChild(blockedMessageElement);
        }
    }, 750);
}

removeInstagramFeedAndStories();