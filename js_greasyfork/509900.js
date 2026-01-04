// ==UserScript==
// @name         Add Verified Badge and Rainbow Username
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a verified badge to your own Roblox profile and makes your username rainbow-colored
// @author       TristanCantCode0
// @match        https://www.roblox.com/users/1820154165/profile
// @icon         https://tr.rbxcdn.com/74be19d6f6ca1037438def3e2d65d061/420/420/Hat/Webp
// @grant        none
// @license 
// @downloadURL https://update.greasyfork.org/scripts/509900/Add%20Verified%20Badge%20and%20Rainbow%20Username.user.js
// @updateURL https://update.greasyfork.org/scripts/509900/Add%20Verified%20Badge%20and%20Rainbow%20Username.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // URL of the custom verified badge (red badge)
    const verifiedBadgeUrl = 'https://tr.rbxcdn.com/74be19d6f6ca1037438def3e2d65d061/420/420/Hat/Webp';
    
    // Add the verified badge next to your username
    function addVerifiedBadge() {
        // Get the username element on the profile
        const usernameElement = document.querySelector('.header-title h2');

        if (usernameElement) {
            // Create a new img element for the verified badge
            const badge = document.createElement('img');
            badge.src = verifiedBadgeUrl;
            badge.alt = 'Verified Badge';
            badge.style.width = '20px';  // Set size of badge
            badge.style.height = '20px';
            badge.style.marginLeft = '10px';  // Space between username and badge

            // Append the badge to your username
            usernameElement.appendChild(badge);
        }
    }

    // Make the username rainbow-colored (animated or static)
    function makeUsernameRainbow() {
        const usernameElement = document.querySelector('.header-title h2');

        if (usernameElement) {
            // Static rainbow (for simplicity, you can adjust this for an animated effect)
            usernameElement.style.background = 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)';
            usernameElement.style.webkitBackgroundClip = 'text';
            usernameElement.style.webkitTextFillColor = 'transparent';
            usernameElement.style.fontWeight = 'bold';  // Make it stand out more
        }
    }

    // Function to initialize the changes when the page loads
    function init() {
        addVerifiedBadge();
        makeUsernameRainbow();
    }

    // Run the init function when the page fully loads
    window.addEventListener('load', init);

})();
