// ==UserScript==
// @name         Discord Account Generator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Generates random information for Discord account creation.
// @author       Your Name
// @match        https://discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538287/Discord%20Account%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/538287/Discord%20Account%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to generate a random username
    function generateUsername() {
        const adjectives = ['Cool', 'Awesome', 'Epic', 'Mystic', 'Quantum', 'Swift', 'Silent'];
        const nouns = ['Gamer', 'Coder', 'Artist', 'Warrior', 'Ninja', 'Dragon', 'Phoenix'];
        const number = Math.floor(Math.random() * 10000);
        return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${number}`;
    }

    // Function to generate a random email (example using disposable email service)
    function generateEmail() {
        // This is an example and might not work or be reliable.
        // Consider using a proper disposable email API if available.
        const username = Math.random().toString(36).substring(2, 15);
        return `${username}@mailinator.com`; // Example using Mailinator
    }

    // Function to generate a random password
    function generatePassword(length = 12) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let password = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    }

    // Function to fill in form fields (example - may need adjustment based on actual Discord signup form)
    function fillSignupForm() {
        const usernameField = document.querySelector('input[name="username"]'); // Find the username input field
        const emailField = document.querySelector('input[name="email"]');       // Find the email input field
        const passwordField = document.querySelector('input[name="password"]'); // Find the password input field
        // You might need to find other fields like birth date, etc.

        if (usernameField) {
            usernameField.value = generateUsername();
        }
        if (emailField) {
            emailField.value = generateEmail();
        }
        if (passwordField) {
            passwordField.value = generatePassword();
        }

        // You might need to trigger input events to make Discord recognize the changes
        // e.g., usernameField.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Add a button to trigger the form filling
    const generateButton = document.createElement('button');
    generateButton.textContent = 'Generate Account Info';
    generateButton.style.position = 'fixed';
    generateButton.style.top = '10px';
    generateButton.style.right = '10px';
    generateButton.style.zIndex = '1000';
    generateButton.addEventListener('click', fillSignupForm);

    // Add the button to the page when it's loaded
    window.addEventListener('load', () => {
        document.body.appendChild(generateButton);
    });

})();
