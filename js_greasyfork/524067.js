// ==UserScript==
// @name         Neopets Autofill & Auto-Login
// @namespace    https://www.neopets.com/
// @version      1.1.1
// @description  Automatically fills login information & logs into Neopets
// @author       ShiroMaō Studios
// @match        *://www.neopets.com/*
// @run-at       document-end
// @license      MIT

/* Changelog:
v1.1.1 - Added async/await handling, improved form submission reliability, enhanced debug logging
v1.1.0 - Updated selectors for new login page structure, added NeoPass tab handling
v1.0.3 - Added support for both classic and modern layouts
v1.0.2 - Refined form detection and submission timing
v1.0.1 - Added error page detection and redirect handling
v1.0.0 - Initial release
*/
// @downloadURL https://update.greasyfork.org/scripts/524067/Neopets%20Autofill%20%20Auto-Login.user.js
// @updateURL https://update.greasyfork.org/scripts/524067/Neopets%20Autofill%20%20Auto-Login.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Credentials
    const USERNAME = 'YOUR_USERNAME';
    const PASSWORD = 'YOUR_PASSWORD';
    
    // Helper function to log debug messages
    const debug = (message) => {
        console.log(`[Neopets Login] ${message}`);
    };
    
    // Check if we're on the login page
    const isLoginPage = () => {
        return window.location.pathname.includes('login') || 
               document.querySelector('form#login') !== null;
    };
    
    // Check if we're on an error page
    const isErrorPage = () => {
        return !!document.querySelector('div.errorOuter');
    };
    
    // Ensure classic login is selected
    const ensureClassicLogin = () => {
        const neoPassTab = document.getElementById('neopass-login');
        const classicButton = document.getElementById('classic-method-login');
        
        if (neoPassTab && neoPassTab.style.display !== 'none') {
            debug('Switching to classic login');
            classicButton?.click();
            return new Promise(resolve => setTimeout(resolve, 500));
        }
        return Promise.resolve();
    };
    
    // Fill the login form
    const fillLoginForm = () => {
        const usernameField = document.querySelector('input#loginUsername');
        const passwordField = document.querySelector('input#loginPassword');
        const destinationField = document.querySelector('input#loginDestination');
        
        if (usernameField && passwordField) {
            debug('Filling login form');
            usernameField.value = USERNAME;
            passwordField.value = PASSWORD;
            
            if (destinationField) {
                destinationField.value = '/home/';
            }
            return true;
        }
        return false;
    };
    
    // Submit the login form
    const submitLoginForm = () => {
        const loginButton = document.querySelector('button#loginButton');
        if (loginButton) {
            debug('Submitting form');
            // Trigger both click and form submission for maximum compatibility
            loginButton.click();
            
            // Also trigger the form's submit event
            const form = document.querySelector('form#login');
            if (form) {
                const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                form.dispatchEvent(submitEvent);
            }
            return true;
        }
        return false;
    };
    
    // Main login handler
    const handleLogin = async () => {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds total with 100ms intervals
        
        const tryLogin = async () => {
            debug('Attempt ' + (attempts + 1));
            
            // First ensure we're on classic login
            await ensureClassicLogin();
            
            // Try to fill and submit the form
            if (fillLoginForm() && submitLoginForm()) {
                debug('Login successful');
                return true;
            }
            
            attempts++;
            if (attempts >= maxAttempts) {
                debug('Max attempts reached - login failed');
                return false;
            }
            
            // Wait 100ms before next attempt
            await new Promise(resolve => setTimeout(resolve, 100));
            return tryLogin();
        };
        
        return tryLogin();
    };
    
    // Main execution
    const init = async () => {
        if (isErrorPage()) {
            debug('Error page detected, redirecting to login');
            window.location.href = 'https://www.neopets.com/login/';
            return;
        }
        
        if (isLoginPage()) {
            debug('Login page detected');
            // Wait for page to be fully loaded
            await new Promise(resolve => setTimeout(resolve, 1000));
            await handleLogin();
        }
    };
    
    // Start the script
    init();
})();