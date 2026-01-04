// ==UserScript==
// @name         Free Roblox Premium LOGO ON PROFILE, THIS DOES NOT GIVE ACTUAL PREMIUM BENEFITS BRO
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds the premium logo on your profile, change my userid to yours in matchurl
// @author       Emree.el on Instagram 
// @match        https://www.roblox.com/users/564962235/profile
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506081/Free%20Roblox%20Premium%20LOGO%20ON%20PROFILE%2C%20THIS%20DOES%20NOT%20GIVE%20ACTUAL%20PREMIUM%20BENEFITS%20BRO.user.js
// @updateURL https://update.greasyfork.org/scripts/506081/Free%20Roblox%20Premium%20LOGO%20ON%20PROFILE%2C%20THIS%20DOES%20NOT%20GIVE%20ACTUAL%20PREMIUM%20BENEFITS%20BRO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add the custom element next to the username on the profile page
    const addElementToProfile = () => {
        // Specify the HTML content for the custom element
        const customElementHTML = '<span class="icon-premium-medium"></span>';

        // Find the username element
        const usernameElement = document.querySelector('.profile-name.text-overflow');

        if (usernameElement) {
            // Create a temporary container to parse the HTML content
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = customElementHTML;

            // Insert the custom element next to the username
            usernameElement.insertAdjacentElement('afterend', tempContainer.firstChild);
        }
    };

    // Wait for the profile page to fully load before adding the custom element
    window.addEventListener('load', addElementToProfile);
})();
