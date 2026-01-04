// ==UserScript==
// @name         Daily NodeSeek Board Opener
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically open a page and click a button once a day
// @author       nodeseeker
// @match        https://www.nodeseek.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487978/Daily%20NodeSeek%20Board%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/487978/Daily%20NodeSeek%20Board%20Opener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the function that will click the button
    function clickButton() {
        const button = document.querySelector('button.btn[data-v-6ef9e4cd]');
        if (button) {
            button.click();
            // Store the current time as the last click time
            localStorage.setItem('lastClickTime', new Date().getTime());
        }
    }

    // This function will check if the current page is the board page
    function isBoardPage() {
        return window.location.href.includes('/board');
    }

    // Your code here...
    const urlToOpen = 'https://www.nodeseek.com/board';
    const lastClickTime = localStorage.getItem('lastClickTime');
    const currentTime = new Date().getTime();

    // Check if a day has passed
    if (!lastClickTime || currentTime - lastClickTime > 86400000) { // 86400000 ms in a day
        // If a day has passed or it has never been clicked, and we are not already on the board page, open the page
        if (!isBoardPage()) {
            window.open(urlToOpen, '_self');
        }
    }

    // If we are on the board page, wait for it to load, then click the button
    if (isBoardPage()) {
        // Wait for the page to load
        window.addEventListener('load', function() {
            // Wait an additional 2 seconds after the page load
            setTimeout(clickButton, 2000); // 2000 milliseconds = 2 seconds
        });
    }
})();
