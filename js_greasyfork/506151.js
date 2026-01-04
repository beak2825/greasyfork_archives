// ==UserScript==
// @name         Enlarge Bot PFP on Poe.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enlarge and reshape the bot's profile picture to a rectangle on Poe.com
// @author       KS
// @match        https://poe.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506151/Enlarge%20Bot%20PFP%20on%20Poecom.user.js
// @updateURL https://update.greasyfork.org/scripts/506151/Enlarge%20Bot%20PFP%20on%20Poecom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to enlarge and reshape the bot's profile picture
    function enlargePFP() {
        // Select all bot profile pictures based on the img[src*='defaultAvatar'] attribute
        const botPFPs = document.querySelectorAll('img[src*="defaultAvatar"]');

        botPFPs.forEach(pfp => {
            // Set new dimensions and shape
            pfp.style.width = '80px';    // Width of the rectangular PFP
            pfp.style.height = '120px';  // Height of the rectangular PFP
            pfp.style.borderRadius = '10px'; // Set the border radius to make it a rectangle with rounded corners

            // Optionally, adjust the parent container if needed
            const parent = pfp.parentElement;
            if (parent) {
                parent.style.width = '80px';
                parent.style.height = '120px';
            }
        });
    }

    // Run the function once on page load
    window.addEventListener('load', enlargePFP);

    // Optionally, observe the DOM for changes (e.g., new messages) and apply the changes dynamically
    const observer = new MutationObserver(enlargePFP);
    observer.observe(document.body, { childList: true, subtree: true });

})();
