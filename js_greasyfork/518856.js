// ==UserScript==
// @name         Anilist Remove Hearts for Selected Users
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Removes the heart icon for activities by selected users on the Anilist homepage only.
// @author       DimitrovN
// @match        https://anilist.co/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518856/Anilist%20Remove%20Hearts%20for%20Selected%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/518856/Anilist%20Remove%20Hearts%20for%20Selected%20Users.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Array of usernames whose heart icons should be removed
    const targetUsernames = ['YourUsername', 'User2', 'User3']; // Add or remove names here

    // Function to clean up modifications (reset state)
    function resetModifications() {
        document.querySelectorAll('.activity-entry').forEach(entry => {
            const userNameElement = entry.querySelector('.name');
            if (userNameElement && targetUsernames.includes(userNameElement.textContent.trim())) {
                // Restore any previously removed heart icons
                if (!entry.querySelector('svg[data-icon="heart"]')) {
                    const likeIconContainer = entry.querySelector('.like-icon-container'); // Adjust this selector if necessary
                    if (likeIconContainer) {
                        const svgHeart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        svgHeart.setAttribute("data-icon", "heart");
                        svgHeart.setAttribute("fill", "currentColor");
                        svgHeart.setAttribute("class", "svg-inline--fa fa-heart fa-w-16 fa-sm");
                        likeIconContainer.appendChild(svgHeart);
                    }
                }
            }
        });
    }

    // Function to remove heart icons on the homepage
    function removeHeartIcons() {
        document.querySelectorAll('.activity-entry').forEach(entry => {
            const userNameElement = entry.querySelector('.name');
            if (userNameElement && targetUsernames.includes(userNameElement.textContent.trim())) {
                const heartIcon = entry.querySelector('svg[data-icon="heart"]');
                if (heartIcon) {
                    heartIcon.remove();
                }
            }
        });
    }

    // Observer to handle dynamic changes on the homepage
    const observer = new MutationObserver(() => {
        if (window.location.pathname === '/home') {
            removeHeartIcons();
        } else {
            resetModifications();
        }
    });

    // Start observing changes in the document
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup observer when navigating away from the homepage
    window.addEventListener('popstate', () => {
        if (window.location.pathname !== '/home') {
            resetModifications();
        }
    });
})();
