// ==UserScript==
// @name         Chatgpt login button clicker
// @namespace    chatgpt-login-clicker
// @version      1
// @description  Refreshes the Chatgpt page until the login button appears, then clicks the button to log in automatically
// @match        https://chat.openai.com/auth/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461882/Chatgpt%20login%20button%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/461882/Chatgpt%20login%20button%20clicker.meta.js
// ==/UserScript==

// Set the maximum number of refresh attempts
var maxRefreshAttempts = 10;

// Set the minimum and maximum time intervals between refreshes in milliseconds
var minRefreshInterval = 500;
var maxRefreshInterval = 1500;

// Track the number of refresh attempts
var refreshAttempts = 0;

// Define a function to refresh the page
var refreshPage = function() {
    location.reload();
};

// Define a function to check for the login button
var checkForLoginButton = function() {
    var loginButtons = document.querySelectorAll('.btn.relative.btn-primary');
    var loginButton = Array.from(loginButtons).find(btn => btn.innerHTML.includes('Log in'));
    if (loginButton) {
        // Login button is visible, click it and stop refreshing
        loginButton.click();
        clearInterval(refreshIntervalId);
        console.log('Login button is visible, stopping refresh');
    } else {
        refreshAttempts++;
        if (refreshAttempts >= maxRefreshAttempts) {
            // Maximum refresh attempts reached, stop refreshing
            clearInterval(refreshIntervalId);
            console.log('Maximum refresh attempts reached, stopping refresh');
        } else {
            console.log('Login button not visible, refreshing page');
            var refreshInterval = Math.floor(Math.random() * (maxRefreshInterval - minRefreshInterval + 1) + minRefreshInterval);
            setTimeout(refreshPage, refreshInterval);
        }
    }
};

// Start the page refresh loop and store the interval ID in a variable
var refreshIntervalId = setInterval(checkForLoginButton, minRefreshInterval);

console.log('Chtgpt login clicker script loaded');