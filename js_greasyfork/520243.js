// ==UserScript==
// @name         Free-Tether Auto Click on Timer End
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Automatically click the "Roll Number" button when the timer ends.
// @author       ALEN
// @icon         https://www.google.com/s2/favicons?sz=64&domain=free-tether.com
// @match        https://www.free-tether.com/free/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520243/Free-Tether%20Auto%20Click%20on%20Timer%20End.user.js
// @updateURL https://update.greasyfork.org/scripts/520243/Free-Tether%20Auto%20Click%20on%20Timer%20End.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check the timer
    const checkTimer = () => {
        const minutesElement = document.querySelector('#cislo1'); // Minutes element
        const secondsElement = document.querySelector('#cislo2'); // Seconds element

        if (minutesElement && secondsElement) {
            const minutes = parseInt(minutesElement.textContent.trim(), 10);
            const seconds = parseInt(secondsElement.textContent.trim(), 10);

            // Check if the timer is at 00:00
            if (minutes === 0 && seconds === 0) {
                console.log('Timer ended. Attempting to click the Roll Number button.');
                const rollButton = document.querySelector('.btn-lg.btn.btn-success'); // Replace with the correct selector for the Roll Number button
                if (rollButton) {
                    rollButton.click();
                    console.log('Roll Number button clicked.');
                } else {
                    console.warn('Roll Number button not found.');
                }
            }
        } else {
            console.warn('Timer elements not found.');
        }
    };

    // Check the timer every second
    setInterval(checkTimer, 3600000);
})();
