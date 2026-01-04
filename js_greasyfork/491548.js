// ==UserScript==
// @name         Bilibili Live Auto Like
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically like Bilibili live streams with random 0.05-0.1 second intervals
// @author       Your Name
// @match        https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491548/Bilibili%20Live%20Auto%20Like.user.js
// @updateURL https://update.greasyfork.org/scripts/491548/Bilibili%20Live%20Auto%20Like.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the user is on a Bilibili live stream page
    if (window.location.href.indexOf("live.bilibili.com") === -1) {
        return;
    }

    // Define the like button selector
    const likeButtonSelector = ".like-btn";

    // Define the function to click the like button
    function clickLikeButton() {
        const likeButton = document.querySelector(likeButtonSelector);
        if (likeButton) {
            likeButton.click();
            console.log("Liked!");
        } else {
            console.log("Like button not found.");
        }
    }

    // Define the function to automatically like the stream
    function autoLike() {
        // Click the like button immediately
        clickLikeButton();

        // Set an interval to click the like button every 0.05-0.1 seconds
        setInterval(() => {
            clickLikeButton();
        }, Math.floor(Math.random() * 50) + 50);
    }

    // Start the auto like function
    autoLike();

    // Display a warning message
    console.log("WARNING: Automatic liking may result in account suspension. Use at your own risk.");

    // Additional notes:
    // 1. This script automatically likes Bilibili live streams with random intervals between 0.05 and 0.1 seconds.
    // 2. Please be aware that automatic liking may result in account suspension.
    // 3. Use this script at your own risk.
})();