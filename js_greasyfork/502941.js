// ==UserScript==
// @name         learningBOX Login Redirect
// @namespace    http://tampermonkey.net/
// @license      Unlicense
// @version      1.3
// @description  Directly log in to learningBOX, bypassing the Supported devices page, in case your device is not supported.
// @match        https://lms.learningbox.online/?action=login
// @match        https://lms.learningbox.online/index.php?action=login
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/502941/learningBOX%20Login%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/502941/learningBOX%20Login%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define constants for URLs and selectors
    const LOGIN_URL = 'https://lms.learningbox.online/?action=login';
    const DASHBOARD_URL = 'https://lms.learningbox.online/user/dashboard';
    const SELECTORS = {
        loginForm: 'form',
        username: '#user-name',
        password: '#password',
        bid: 'input[name="bid"]'
    };

    // Function to get form values
    const getFormValues = () => ({
        username: document.querySelector(SELECTORS.username).value,
        password: document.querySelector(SELECTORS.password).value,
        bid: document.querySelector(SELECTORS.bid).value
    });

    // Function to prepare form data
    const prepareFormData = ({ username, password, bid }) => {
        const formData = new URLSearchParams();
        formData.append('bid', bid);
        formData.append('userName', username);
        formData.append('password', password);
        return formData.toString();
    };

    // Function to handle login response
    const handleLoginResponse = (response) => {
        console.log('Login request completed');
        if (response.finalUrl.includes('loginCheckInfo') || response.responseText.includes('loginCheckInfo')) {
            console.log('Login successful, redirecting to dashboard');
            window.location.href = DASHBOARD_URL;
        } else {
            console.log('Login failed, staying on login page');
            alert('Login failed. Please check your credentials and try again.');
        }
    };

    // Function to send login request
    const sendLoginRequest = (formData) => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: LOGIN_URL,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': LOGIN_URL,
                'Origin': 'https://lms.learningbox.online',
                'Cookie': document.cookie
            },
            data: formData,
            onload: handleLoginResponse,
            onerror: (error) => {
                console.log('Error during login request:', error);
                alert('An error occurred during login. Please try again.');
            }
        });
    };

    // Main function to intercept the login form submission
    const interceptLogin = () => {
        const loginForm = document.querySelector(SELECTORS.loginForm);
        if (!loginForm) {
            console.log('Login form not found');
            return;
        }

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Login form submission intercepted');
            const formValues = getFormValues();
            const formData = prepareFormData(formValues);
            sendLoginRequest(formData);
        });
    };

    // Call the main function
    interceptLogin();
})();