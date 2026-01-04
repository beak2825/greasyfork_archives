// ==UserScript==
// @name         Remove Clutter on Roblox
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove any div with id btr-blogfeed-container or btr-blogfeed (Blog Section), and the "Get Premium" button on the Roblox home page
// @author       Mysmic
// @match        https://www.roblox.com/home
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522972/Remove%20Clutter%20on%20Roblox.user.js
// @updateURL https://update.greasyfork.org/scripts/522972/Remove%20Clutter%20on%20Roblox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the blog feed divs and the "Get Premium" button
    function removeElements() {
        const blogFeedContainer = document.getElementById('btr-blogfeed-container');
        const blogFeed = document.getElementById('btr-blogfeed');
        const premiumButton = document.getElementById('upgrade-now-button');

        if (blogFeedContainer) {
            blogFeedContainer.remove();
        }

        if (blogFeed) {
            blogFeed.remove();
        }

        if (premiumButton) {
            premiumButton.remove();
        }
    }

    // Run the function when the page loads
    window.addEventListener('load', removeElements);
})();
