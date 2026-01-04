// ==UserScript==
// @name         Hide Specific YouTube Channels
// @namespace    Pain
// @version      1.0
// @author       Pain
// @description  Hides/blocks/blacklists specific YouTube channel elements on the homepage
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505880/Hide%20Specific%20YouTube%20Channels.user.js
// @updateURL https://update.greasyfork.org/scripts/505880/Hide%20Specific%20YouTube%20Channels.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide unwanted elements
    function hideElements() {
        // Select elements based on their titles or other attributes
        const channelsToHide = [
            // Enter channel names here
            "channelToHide 1",
            "channelToHide 2",
        ];

        // Loop through each channel name and hide corresponding elements
        channelsToHide.forEach(channelName => {
            // Create a selector to find elements with the title attribute containing the channel name
            const selector = `ytd-rich-item-renderer #avatar-link[title*="${channelName}"]`;
            const elements = document.querySelectorAll(selector);

            // Hide each element found
            elements.forEach(element => {
                element.closest('ytd-rich-item-renderer').style.display = 'none';
            });
        });
    }

    // Initial call to hide elements
    hideElements();

    // Mutation observer to handle dynamic content loading
    const observer = new MutationObserver(hideElements);
    observer.observe(document.body, { childList: true, subtree: true });
})();
