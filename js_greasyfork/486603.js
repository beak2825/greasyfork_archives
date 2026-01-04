// ==UserScript==
// @name         shareus.io auto-skip
// @version      1.0
// @author       Rust1667
// @description  Automatically click the buttons to skip to the target link
// @match        https://shareus.io/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shareus.io
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/486603/shareusio%20auto-skip.user.js
// @updateURL https://update.greasyfork.org/scripts/486603/shareusio%20auto-skip.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Define the button selector
    const buttonSelector = "#root > div > main > div.main-container-1 > div.main-container-2 > div:nth-child(1) > div.adunit-container > button";

    // Function to click the button
    function clickButton() {
        // Find the button element
        const button = document.querySelector(buttonSelector);
        if (button) {
            button.click();
            console.log("Button clicked!");
            //clearInterval(intervalId); // Stop attempting once clicked
        } else {
            console.log("Button not found!");
        }
    }

    // Set interval to attempt clicking every 1 second
    const intervalId = setInterval(clickButton, 1000);
})();
