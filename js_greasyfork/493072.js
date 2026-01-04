// ==UserScript==
// @name         Acellus Auto Sign-In
// @namespace    https://greasyfork.org/en/users/1291009
// @grant        none
// @version      3.4.3
// @description  Automatically signs in to Acellus
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acellus.com
// @match        https://signin.acellus.com/sign-in/student
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493072/Acellus%20Auto%20Sign-In.user.js
// @updateURL https://update.greasyfork.org/scripts/493072/Acellus%20Auto%20Sign-In.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Register a menu command to clear login data
    GM_registerMenuCommand('Clear Acellus Login Data', clearLoginData);

    function clearLoginData() {
        localStorage.removeItem('acellusUsername');
        localStorage.removeItem('acellusPassword');
        alert('Acellus login data cleared.');
        location.reload(); // Reload the page after clearing the data
    }

    // Check if credentials already exist in localStorage
    let username = localStorage.getItem('acellusUsername');
    let password = localStorage.getItem('acellusPassword');

    // If credentials are not stored, prompt user to input them with a GUI
    if (!username || !password) {
        showLoginGUI();
    }

    function showLoginGUI() {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '20%';
        modal.style.right = '0';
        modal.style.transform = 'translateY(-50%)';
        modal.style.backgroundColor = '#e6f7ff';
        modal.style.border = '2px solid #007bff';
        modal.style.borderRadius = '8px 0 0 8px';
        modal.style.padding = '20px';
        modal.style.zIndex = '10000';
        modal.style.boxShadow = '-5px 0 10px rgba(0,0,0,0.5)';
        modal.style.fontFamily = 'Arial, sans-serif';
        modal.style.color = '#333';
        modal.style.width = '300px';
        modal.style.display = 'flex';
        modal.style.flexDirection = 'column';
        modal.style.alignItems = 'center';

        const title = document.createElement('h2');
        title.textContent = 'Auto Login Setup';
        title.style.color = '#007bff';
        title.style.marginBottom = '15px';
        title.style.textAlign = 'center';
        modal.appendChild(title);

        const userLabel = document.createElement('label');
        userLabel.textContent = 'Acellus ID:';
        userLabel.style.alignSelf = 'flex-start';
        userLabel.style.marginBottom = '5px';
        modal.appendChild(userLabel);

        const userInput = document.createElement('input');
        userInput.type = 'text';
        userInput.style.width = '100%';
        userInput.style.padding = '8px';
        userInput.style.marginBottom = '15px';
        userInput.style.border = '1px solid #ccc';
        userInput.style.borderRadius = '4px';
        modal.appendChild(userInput);

        const passLabel = document.createElement('label');
        passLabel.textContent = 'Password:';
        passLabel.style.alignSelf = 'flex-start';
        passLabel.style.marginBottom = '5px';
        modal.appendChild(passLabel);

        const passInput = document.createElement('input');
        passInput.type = 'password';
        passInput.style.width = '100%';
        passInput.style.padding = '8px';
        passInput.style.marginBottom = '15px';
        passInput.style.border = '1px solid #ccc';
        passInput.style.borderRadius = '4px';
        modal.appendChild(passInput);

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.style.backgroundColor = '#007bff';
        submitButton.style.color = '#fff';
        submitButton.style.padding = '10px 15px';
        submitButton.style.border = 'none';
        submitButton.style.borderRadius = '4px';
        submitButton.style.cursor = 'pointer';
        submitButton.style.width = '100%';
        submitButton.style.marginBottom = '10px';
        modal.appendChild(submitButton);

        document.body.appendChild(modal);

        // Submit button event listener
        submitButton.addEventListener('click', () => {
            const enteredUsername = userInput.value;
            const enteredPassword = passInput.value;

            if (enteredUsername && enteredPassword) {
                confirmCredentials(enteredUsername, enteredPassword, modal);
            } else {
                alert('Please enter both Acellus ID and password.');
            }
        });
    }

    function confirmCredentials(username, password, modal) {
        const confirmModal = document.createElement('div');
        confirmModal.style.position = 'fixed';
        confirmModal.style.top = '20%';
        confirmModal.style.right = '0';
        confirmModal.style.transform = 'translateY(-50%)';
        confirmModal.style.backgroundColor = '#e6f7ff';
        confirmModal.style.border = '2px solid #007bff';
        confirmModal.style.borderRadius = '8px 0 0 8px';
        confirmModal.style.padding = '20px';
        confirmModal.style.zIndex = '10001';
        confirmModal.style.boxShadow = '-5px 0 10px rgba(0,0,0,0.5)';
        confirmModal.style.fontFamily = 'Arial, sans-serif';
        confirmModal.style.color = '#333';
        confirmModal.style.width = '300px';
        confirmModal.style.textAlign = 'center';

        const confirmationText = document.createElement('p');
        confirmationText.textContent = `Are you sure you want to save these credentials?\nAcellus ID: ${username}`;
        confirmationText.style.marginBottom = '15px';
        confirmModal.appendChild(confirmationText);

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Yes, Save';
        confirmButton.style.backgroundColor = '#007bff';
        confirmButton.style.color = '#fff';
        confirmButton.style.padding = '10px 15px';
        confirmButton.style.border = 'none';
        confirmButton.style.borderRadius = '4px';
        confirmButton.style.cursor = 'pointer';
        confirmButton.style.marginRight = '10px';
        confirmModal.appendChild(confirmButton);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'No, Edit';
        cancelButton.style.backgroundColor = '#f0ad4e';
        cancelButton.style.color = '#fff';
        cancelButton.style.padding = '10px 15px';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.cursor = 'pointer';
        confirmModal.appendChild(cancelButton);

        document.body.appendChild(confirmModal);

        confirmButton.addEventListener('click', () => {
            // Store credentials in localStorage
            localStorage.setItem('acellusUsername', username);
            localStorage.setItem('acellusPassword', password);
            // Set a flag in localStorage to show the toast notification after page reload
            localStorage.setItem('showLoginToast', 'true');

            // Reload the page after saving credentials
            location.reload();
        });

        cancelButton.addEventListener('click', () => {
            document.body.removeChild(confirmModal);
        });
    }

    // Function to create a toast notification
    function createToastNotification(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.padding = '15px';
        toast.style.backgroundColor = '#007bff';
        toast.style.color = '#fff';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0px 4px 8px rgba(0,0,0,0.3)';
        toast.style.fontFamily = 'Arial, sans-serif';
        toast.style.zIndex = '10000';
        document.body.appendChild(toast);

        // Remove the toast after 5 seconds
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 5000);
    }

    // Check if a toast notification should be shown
    if (localStorage.getItem('showLoginToast') === 'true') {
        createToastNotification('🚨 Acellus login successful!');
        localStorage.removeItem('showLoginToast'); // Clear the flag after showing the notification
    }

    // Auto sign-in logic using MutationObserver to monitor dynamic content
    const clickableSelectors = ['button', 'input[type=submit]', 'a', 'span', 'div'];
    const buttonTexts = ['Sign In', 'Log In', 'Login', 'Submit', 'Enter'];
    const easySignInUrl = 'https://signin.acellus.com/sign-in/easy';
    const avoidButtonText = 'Set Up Student Easy Sign In';

    if (window.location.href.startsWith('https://signin.acellus.com/sign-in/student') &&
        window.location.href !== easySignInUrl) {

        const observer = new MutationObserver((mutationsList, observer) => {
            const form = document.querySelector('form[action^="/sign-in/student"]');
            if (form) {
                const usernameInput = form.querySelector('input[name=username]');
                const passwordInput = form.querySelector('input[name=password]');

                if (usernameInput && passwordInput) {
                    // Automatically fill in stored credentials
                    usernameInput.value = username;
                    passwordInput.value = password;

                    let clickCount = 0;

                    // Click function for targeting form buttons
                    function clickElements() {
                        // Delay before each click to slow down the process
                        setTimeout(() => {
                            if (clickCount < 5) {
                                clickableSelectors.forEach(selector => {
                                    const elements = form.querySelectorAll(selector);

                                    elements.forEach(element => {
                                        if (isElementClickable(element)) {
                                            const elementText = (element.textContent || '').trim();

                                            if (buttonTexts.some(text => elementText.includes(text)) && elementText !== avoidButtonText) {
                                                element.click();
                                                clickCount++;
                                            }
                                        }
                                    });
                                });
                            } else {
                                clearInterval(clickInterval);
                            }
                        }, 500); // Introduce a 500ms delay before each click
                    }

                    // Click every 3 seconds, up to 5 times
                    const clickInterval = setInterval(clickElements, 3000);

                    // Stop interval after the form submits
                    form.addEventListener('submit', () => {
                        clearInterval(clickInterval);
                    });

                    // Initial click on page load with delay to prevent rapid-fire clicks
                    setTimeout(clickElements, 1000); // Delay the initial click by 1 second
                }
            }
        });

        // Observe changes in the body to detect dynamically loaded content
        observer.observe(document.body, { childList: true, subtree: true });

        function isElementClickable(el) {
            return el && (
                el.tagName === 'BUTTON' ||
                el.tagName === 'A' ||
                (el.tagName === 'SPAN' && el.hasAttribute('role')) ||
                (el.tagName === 'DIV' && el.hasAttribute('role'))
            );
        }
    }
})();
