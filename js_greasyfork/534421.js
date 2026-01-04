// ==UserScript==
// @name         Auto Appointments TLSContact
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically book an appointment on TLSContact website
// @author       infovissa
// @match        https://fr.tlscontact.com/appointment/ma/maTNG2fr/16794952*
// @match       https://i2-auth.visas-fr.tlscontact.com/auth/realms/atlas/protocol/openid-connect/auth*
// @match        https://fr.tlscontact.com/visa/ma/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534421/Auto%20Appointments%20TLSContact.user.js
// @updateURL https://update.greasyfork.org/scripts/534421/Auto%20Appointments%20TLSContact.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Utility function to simulate clicking a button
    function clickButton(selector) {
        const button = document.querySelector(selector);
        if (button) {
            console.log("Clicking button: ", selector);
            button.click();
        } else {
            console.log("Button not found: ", selector);
        }
    }

    // Wait for page to load dynamic content (such as time slots)
    function waitForElement(selector, callback, interval = 500, timeout = 10000) {
        const startTime = Date.now();

        const checkExist = setInterval(function() {
            const element = document.querySelector(selector);
            if (element) {
                console.log("Element found: ", selector);
                clearInterval(checkExist);
                callback(element);
            } else if (Date.now() - startTime > timeout) {
                console.log("Timeout waiting for element: ", selector);
                clearInterval(checkExist);
            }
        }, interval);
    }

    // Automatically click the next available time slot
    function clickAvailableSlot() {
        const availableSlots = document.querySelectorAll('.tls-time-unit.-available');
        if (availableSlots.length > 0) {
            console.log("Clicking available slot: ", availableSlots[0].innerText);
            availableSlots[0].click(); // Click the first available slot
        } else {
            console.log("No available slots found.");
        }
    }

    // Main function to execute the steps
    function bookAppointment() {
        // Wait for the page to load the month navigation buttons
        waitForElement('button[name="test"]', function() {
            console.log("Navigating to next month...");
            clickButton('button[name="test"]'); // This simulates clicking the right arrow to navigate months
        });

        // Wait for the available slots to load and then click the first one
        waitForElement('.tls-time-unit.-available', function() {
            clickAvailableSlot();
        });

        // Wait for the confirm button to appear and click it
        waitForElement('button[data-tls-value="confirm"]', function() {
            console.log("Confirming the appointment...");
            clickButton('button[data-tls-value="confirm"]');
        });
    }

    // Run the appointment booking process
    setTimeout(bookAppointment, 3000); // Delay to ensure page is fully loaded

})();