// @license Bar Piglanski

// ==UserScript==
// @name         Auto sign into work clock
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto sign in for the work clock at the end of the month.
// @author       Your Name
// @match        *://app.meckano.co.il/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476752/Auto%20sign%20into%20work%20clock.user.js
// @updateURL https://update.greasyfork.org/scripts/476752/Auto%20sign%20into%20work%20clock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Auto fill clock Script is running...");

    function fillCLock() {
        setTimeout(() => performAction(), 2500);

        function performAction() {
            // Additional check for the URL fragment - check weather it's specifficly the prkject page
            if (!/#projectReport\//.test(window.location.hash)) {
                return;
            }

            // Display confirmation dialog
            let userConfirmation = window.confirm("Do you want to auto fill the working hours across all month?");

            if (!userConfirmation) return;

            // Ask the user for dates not to update
            let excludedDatesInput = window.prompt("Please enter the dates (day of month) you do not wish to update, separated by commas (e.g., 2,15,23):");
            let excludedDates = [];
            if (excludedDatesInput !== null && excludedDatesInput.trim() !== "") excludedDates = excludedDatesInput.split(',').map(str => str.trim());

            // Select all buttons with the class "insert-row"
            let buttons = document.querySelectorAll("a.insert-row");

            // Iterate through each button
            buttons.forEach(button => {
                // Check if the next sibling span contains a specific string
                let siblingSpan = button.nextElementSibling;
                if(siblingSpan && siblingSpan.tagName === "SPAN" && !excludedDates.some(date => siblingSpan.textContent.includes(date)) && !siblingSpan.textContent.includes("ו") && !siblingSpan.textContent.includes("ש")) {
                    // Click the button if the condition is satisfied
                    button.click();

                    setTimeout(() => {
                        let checkinInputs = document.querySelectorAll(".checkin");
                        checkinInputs.forEach(input => {
                            //alert();
                            input.value = '1000';
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                        });

                        let checkoutInputs = document.querySelectorAll(".checkout");
                        checkoutInputs.forEach(input => {
                            input.value = '1900';
                            // If you want to trigger an input event after changing the value
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                        });

                        setTimeout(() => {
                            // Confirm button click for each day
                            let confirmButtons = document.querySelectorAll(".trv-inline-confirm");
                            // Click each button
                            confirmButtons.forEach(button => {
                                button.click();
                            });
                        }, 1200);
                    }, 700);
                }
            });
        }
    }

    fillCLock();
})();