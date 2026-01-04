// ==UserScript==
// @name         Block ivelt Login and Auto Logout
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Block Ivelt login during specific hours and automatically log out on weekdays
// @author       יעקב פריינד
// @match        *://www.ivelt.com/forum/*
// @match        *://ivelt.com/forum/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503447/Block%20ivelt%20Login%20and%20Auto%20Logout.user.js
// @updateURL https://update.greasyfork.org/scripts/503447/Block%20ivelt%20Login%20and%20Auto%20Logout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the hours for Monday to Thursday
    const weekdayStartHour = 9;  // 9 AM
    const weekdayEndHour = 18;   // 6 PM

    // Set the hours for Friday
    const fridayStartHour = 9;   // 9 AM
    const fridayEndHour = 13;    // 1 PM

    // Get the current day of the week and hour
    const currentDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const currentHour = new Date().getHours();

    // Function to check if the current time is within the blocked hours
    const isBlockedTime = () => {
        if (currentDay >= 1 && currentDay <= 4) {
            // Monday to Thursday: 9 AM - 6 PM
            return currentHour >= weekdayStartHour && currentHour < weekdayEndHour;
        } else if (currentDay === 5) {
            // Friday: 9 AM - 1 PM
            return currentHour >= fridayStartHour && currentHour < fridayEndHour;
        }
        return false;
    };

    // Check if the current time is within the blocked hours
    if (isBlockedTime()) {
        // Find the login form on the page
        const loginForm = document.querySelector('form[action*="login"]');

        if (loginForm) {
            // Disable the form elements
            loginForm.querySelectorAll('input, button').forEach(element => {
                element.disabled = true;
            });

            // Display a message to the user
            const message = document.createElement('div');
            message.textContent = 'Login is disabled during this time period. Please try again later.';
            message.style.color = 'red';
            message.style.fontWeight = 'bold';
            loginForm.prepend(message);
        }

        // Auto logout if already logged in
        const logoutLink = document.querySelector('a[href*="logout"]');
        if (logoutLink) {
            window.location.href = logoutLink.href;
        }
    }
})();
