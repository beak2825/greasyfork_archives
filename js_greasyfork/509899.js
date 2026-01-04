// ==UserScript==
// @name         Replace Roblox Verified Badge with Red Badge
// @namespace    http://your-namespace-here.com  // Change to your own unique namespace if you have one
// @version      1.0
// @description  Replaces the default blue verified badge on Roblox profiles with a custom red badge
// @author       YourNameHere  // Change to your name or username
// @match        https://www.roblox.com/users/*
// @icon         https://tr.rbxcdn.com/74be19d6f6ca1037438def3e2d65d061/420/420/Hat/Webp
// @grant        none
// @license      MIT  // You can specify a license here, or remove this line if you don't want to.
// @downloadURL https://update.greasyfork.org/scripts/509899/Replace%20Roblox%20Verified%20Badge%20with%20Red%20Badge.user.js
// @updateURL https://update.greasyfork.org/scripts/509899/Replace%20Roblox%20Verified%20Badge%20with%20Red%20Badge.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL of the new red verified badge image
    const redBadgeUrl = 'https://tr.rbxcdn.com/74be19d6f6ca1037438def3e2d65d061/420/420/Hat/Webp';  // This is the image URL of the red badge.

    // Function to replace the blue verified badge
    function replaceBadge() {
        // Find the blue verified badge on the page
        const badgeElement = document.querySelector('img[src*="verified"]');  // Adjust the 'src' if necessary to match the exact blue badge image URL or identifier

        if (badgeElement) {
            // Replace the blue badge with the red one
            badgeElement.src = redBadgeUrl;
        }
    }

    // Observe changes in the DOM to catch when badges load
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            replaceBadge();
        });
    });

    // Observe the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Run the replacement function initially
    replaceBadge();

})();
