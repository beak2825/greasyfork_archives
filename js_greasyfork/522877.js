// ==UserScript==
// @name         干油管短视频 Remove YouTube Shorts, Related Sections, and Other Unwanted Elements
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically removes Shorts, related sections, and other unwanted elements on YouTube
// @author       MJJ
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522877/%E5%B9%B2%E6%B2%B9%E7%AE%A1%E7%9F%AD%E8%A7%86%E9%A2%91%20Remove%20YouTube%20Shorts%2C%20Related%20Sections%2C%20and%20Other%20Unwanted%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/522877/%E5%B9%B2%E6%B2%B9%E7%AE%A1%E7%9F%AD%E8%A7%86%E9%A2%91%20Remove%20YouTube%20Shorts%2C%20Related%20Sections%2C%20and%20Other%20Unwanted%20Elements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove Shorts elements and other unwanted sections
    const removeElements = () => {
        // Remove the Shorts link in the sidebar
        const shortsLinks = document.querySelectorAll('a.yt-simple-endpoint[title="Shorts"]');
        shortsLinks.forEach(element => element.remove());

        // Remove any sections with id="dismissible" that contain Shorts
        const dismissibleElements = document.querySelectorAll('div#dismissible');
        dismissibleElements.forEach(element => {
            if (element.innerHTML.includes('Shorts')) {
                element.remove();
            }
        });

        // Remove <ytd-rich-section-renderer class="style-scope ytd-rich-grid-renderer">
        const richSectionElements = document.querySelectorAll('ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer');
        richSectionElements.forEach(element => element.remove());

        // Remove <ytd-reel-shelf-renderer class="style-scope ytd-item-section-renderer" modern-typography="">
        const reelShelfElements = document.querySelectorAll('ytd-reel-shelf-renderer.style-scope.ytd-item-section-renderer[modern-typography]');
        reelShelfElements.forEach(element => element.remove());
    };

    // Observe the page for dynamic changes
    const observer = new MutationObserver(() => {
        removeElements();
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial cleanup
    removeElements();
})();
