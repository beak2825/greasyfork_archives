// ==UserScript==
// @name         Arc'teryx Auto Form Filler with Editable Address
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Sequentially fill in form fields (email, names, address, city, state, postal code, phone) on arcteryx.com, and fill the holder name in the payment form with the generated first and last name
// @author       You
// @match        https://*.arcteryx.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510026/Arc%27teryx%20Auto%20Form%20Filler%20with%20Editable%20Address.user.js
// @updateURL https://update.greasyfork.org/scripts/510026/Arc%27teryx%20Auto%20Form%20Filler%20with%20Editable%20Address.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Address details for easy modification
    const address1 = "15 Linwood Ave";
    const city = "Salem";
    const region = "NH";  // State code
    const postalCode = "03079";

    let firstName = "";
    let lastName = "";

    // List of common first names and last names
    const firstNames = ["John", "Michael", "Sarah", "Jessica", "David", "Emily", "Matthew", "Ashley", "James", "Amanda"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];

    // Function to generate a random first name and last name
    function getRandomFirstName() {
        return firstNames[Math.floor(Math.random() * firstNames.length)];
    }

    function getRandomLastName() {
        return lastNames[Math.floor(Math.random() * lastNames.length)];
    }

    // Function to generate a random email address
    function generateRandomEmail() {
        let chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let email = '';
        for (let i = 0; i < 8; i++) {
            email += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return email + '@blueothotel.com';
    }

    // Function to generate a random 10-digit phone number starting with "313"
    function generateRandomPhoneNumber() {
        let phone = '313';
        for (let i = 0; i < 7; i++) {
            phone += Math.floor(Math.random() * 10);
        }
        return phone;
    }

    // Function to simulate proper user input
    function simulateInput(input, value) {
        if (input) {
            // Set the value of the input field
            let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(input, value);

            // Dispatch events to simulate real user input
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.click(); // Simulate a click on the input to mimic user interaction

            console.log(input.name + " field filled with: " + value);
        }
    }

    // Sequentially fill each form field
    async function fillFormSequentially() {
        // Get the input fields
        let emailInput = document.querySelector('input#sp-email');
        let firstNameInput = document.querySelector('input#first-name-input');
        let lastNameInput = document.querySelector('input#last-name-input');
        let addressInput = document.querySelector('input#address1-input');
        let cityInput = document.querySelector('input#city-input');
        let stateSelect = document.querySelector('select#region-selector');
        let postalCodeInput = document.querySelector('input#postalCode');
        let phoneInput = document.querySelector('input#phone');
        let submitButton = document.querySelector('button[type="submit"] span');

        // 1. Fill the email field
        if (emailInput && emailInput.value === '') {
            simulateInput(emailInput, generateRandomEmail());
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 0.5 second before the next step
        }

        // 2. Fill the first name field
        if (firstNameInput && firstNameInput.value === '') {
            firstName = getRandomFirstName(); // Save first name
            simulateInput(firstNameInput, firstName);
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 0.5 second
        }

        // 3. Fill the last name field
        if (lastNameInput && lastNameInput.value === '') {
            lastName = getRandomLastName(); // Save last name
            simulateInput(lastNameInput, lastName);
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 0.5 second
        }

        // 4. Fill the address field
        if (addressInput && addressInput.value === '') {
            simulateInput(addressInput, address1);
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 0.5 second
        }

        // 5. Fill the city field
        if (cityInput && cityInput.value === '') {
            simulateInput(cityInput, city);
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 0.5 second
        }

        // 6. Select the state (New Hampshire)
        if (stateSelect && stateSelect.value === '') {
            stateSelect.value = region; // Use the saved state code
            stateSelect.dispatchEvent(new Event('change', { bubbles: true }));
            stateSelect.click();
            console.log("State selected: " + region);
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 0.5 second
        }

        // 7. Fill the postal code field
        if (postalCodeInput && postalCodeInput.value === '') {
            simulateInput(postalCodeInput, postalCode);
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 0.5 second
        }

        // 8. Fill the phone number field
        if (phoneInput && phoneInput.value === '') {
            simulateInput(phoneInput, generateRandomPhoneNumber());
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 0.5 second
        }

        // 9. Click the submit button if available
        if (submitButton && submitButton.textContent.includes("继续")) {
            submitButton.click();
            console.log("Submit button clicked.");
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 0.5 second
        }

        // 10. Click the label for "信用卡或借记卡"
        let paymentLabel = document.querySelector('label.sc-BKyRU.iqaKZA');
        if (paymentLabel) {
            paymentLabel.click();
            console.log("Payment method label clicked.");
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 0.5 second
        }

        // 11. Fill the holder name in the payment section with the saved first and last name
        let holderNameInput = document.querySelector('input[name="holderName"]');
        if (holderNameInput) {
            let fullName = firstName + " " + lastName; // Combine first name and last name
            simulateInput(holderNameInput, fullName);
            console.log("Holder name filled with: " + fullName);
        }
    }

    // MutationObserver to observe changes in the DOM
    let observer = new MutationObserver(function(mutations) {
        fillFormSequentially();
    });

    // Observe the entire document for changes to detect dynamic content
    observer.observe(document.body, { childList: true, subtree: true });

    // Run the function after a short delay to allow dynamic content to load
    setTimeout(fillFormSequentially, 3000);
})();
