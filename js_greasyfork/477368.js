// ==UserScript==
// @name         YouTube Clean Up
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A Script to clean up YouTube interface. Homepage is only search and video page is only video.
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477368/YouTube%20Clean%20Up.user.js
// @updateURL https://update.greasyfork.org/scripts/477368/YouTube%20Clean%20Up.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        // Check if on landing page
        if (window.location.pathname === '/') {
            // Remove elements except search bar using CSS selectors
            Array.from(document.querySelectorAll(
                'ytd-browse:not(:first-child), ytd-rich-item-renderer, ytd-shelf-renderer'
            )).forEach(el => el.remove());
        } else {
            // Hide Comments Section
            const commentsSection = document.getElementById('comments');
            if(commentsSection) {
                commentsSection.style.display = 'none';
            }

            // Hide Recommended Videos
            const secondarySection = document.getElementById('secondary');
            if(secondarySection) {
                secondarySection.style.display = 'none';
            }
       }
    }, 100);
})();
