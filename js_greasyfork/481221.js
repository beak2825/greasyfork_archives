// ==UserScript==
// @name         Automatic Button Click
// @author       Rahatul Ghazi | ChatGPT
// @description  Closes the "Adblocker Enabled" notification for you.
// @version 1.0
// @license MIT
// @match        https://intro-hd.net/*
// @grant        none
// @namespace https://greasyfork.org/users/1226730
// @downloadURL https://update.greasyfork.org/scripts/481221/Automatic%20Button%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/481221/Automatic%20Button%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let buttonClicked = false;

    function clickButton() {
        if (buttonClicked) {
            return; // Stop checking if the button has been clicked
        }

        let button = document.querySelector('.mdpDeblocker-close');
        if (button) {
            button.click();
            buttonClicked = true; // Set the flag to true after clicking
        } else {
            setTimeout(clickButton, 1000); // Check again in 1 second
        }
    }

    // Wait for the page to load fully
    window.addEventListener('load', function() {
        clickButton(); // Start checking for the button
    });
})();
