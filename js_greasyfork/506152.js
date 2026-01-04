// ==UserScript==
// @name         Enlarge Bot PFP on Poe.com
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enlarge and reshape the bot's profile picture to a rectangle on Poe.com
// @author       Your Name
// @match        https://poe.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506152/Enlarge%20Bot%20PFP%20on%20Poecom.user.js
// @updateURL https://update.greasyfork.org/scripts/506152/Enlarge%20Bot%20PFP%20on%20Poecom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to enlarge and reshape the bot's profile picture
    function enlargePFP() {
        // Select the bot profile picture using the img[src*='defaultAvatar'] attribute
        const botPFPs = document.querySelectorAll('img[src*="defaultAvatar"]');

        botPFPs.forEach(pfp => {
            // Set new dimensions and shape
            pfp.style.width = '80px';    // Width of the rectangular PFP
            pfp.style.height = '120px';  // Height of the rectangular PFP
            pfp.style.borderRadius = '10px'; // Make the PFP a rectangle with slightly rounded corners

            // Adjust the immediate container if necessary
            const parent = pfp.parentElement;
            if (parent) {
                parent.style.width = '80px';
                parent.style.height = '120px';
                parent.style.overflow = 'hidden'; // Ensure the image doesn't overflow the parent
            }
        });
    }

    // Run the function on DOM content loaded
    window.addEventListener('DOMContentLoaded', enlargePFP);

    // Observe for any changes in the DOM to apply the changes dynamically
    const observer = new MutationObserver(enlargePFP);
    observer.observe(document.body, { childList: true, subtree: true });

})();
