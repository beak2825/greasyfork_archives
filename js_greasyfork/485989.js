// ==UserScript==
// @name         Fake Robux
// @namespace    http://tampermonkey.net/
// @version      2024-01-29
// @description  Changes the navbar Robux amount to a desired amount
// @author       Devappl
// @match        *://www.roblox.com/*
// @match        *://roblox.com/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Robux_2019_Logo_gold.svg/1883px-Robux_2019_Logo_gold.svg.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485989/Fake%20Robux.user.js
// @updateURL https://update.greasyfork.org/scripts/485989/Fake%20Robux.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the desired number
    var desiredNumber = 1000; // Change this to your desired number

    // Function to change the value of the element with id "nav-robux-amount"
    function changeRobuxAmount() {
        var robuxAmountElement = document.getElementById('nav-robux-amount');
        if (robuxAmountElement) {
            robuxAmountElement.textContent = desiredNumber;
        }
    }

    // Call the function to change the Robux amount when the page is loaded
    changeRobuxAmount();

    // Use a MutationObserver to detect changes in the DOM and trigger the script
    var observer = new MutationObserver(function(mutations) {
        changeRobuxAmount();
    });

    // Configure the observer to watch for changes in the subtree of the body
    var observerConfig = { childList: true, subtree: true };

    // Start observing the DOM
    observer.observe(document.body, observerConfig);
})();
