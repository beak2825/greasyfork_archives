// ==UserScript==
// @name         YouTube Music Auto Looper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically clicks twice on the loop button, making it loop automatically... lol
// @author       Emree.el on Instagram :)
// @match        https://music.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495740/YouTube%20Music%20Auto%20Looper.user.js
// @updateURL https://update.greasyfork.org/scripts/495740/YouTube%20Music%20Auto%20Looper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to find and click on the repeat button
    function clickRepeatButton() {
        const repeatButton = document.querySelector('tp-yt-paper-icon-button.repeat');
        if (repeatButton && repeatButton.getAttribute('title') === 'Repeat off') {
            // Click twice on the repeat button
            repeatButton.click();
            setTimeout(() => repeatButton.click(), 500);
        }
    }

    // Function to check for changes in the repeat button periodically
    function checkRepeatButton() {
        setInterval(clickRepeatButton, 1000);
    }

    // Start checking for the repeat button
    checkRepeatButton();
})();
