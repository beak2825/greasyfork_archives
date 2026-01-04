// ==UserScript==
// @name         Fix BaoTa Panel Bitwarden Auto-fill
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fix Bitwarden auto-fill conflict with BaoTa panel captcha by dynamically renaming input fields
// @author       You
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547681/Fix%20BaoTa%20Panel%20Bitwarden%20Auto-fill.user.js
// @updateURL https://update.greasyfork.org/scripts/547681/Fix%20BaoTa%20Panel%20Bitwarden%20Auto-fill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Record original state
    let originalName = 'code';
    let modifiedName = 'fuckcode';
    let lastState = null; // Record the last status

    // Check website logo variable
    function checkSiteIdentifiers() {
        return window.vite_public_title &&
            window.vite_public_login_token &&
            window.vite_public_encryption;
    }

    // Wait for the page to finish loading and check for modifications
    function checkAndModify() {
        // First check website identification variable
        if (!checkSiteIdentifiers()) {
            return;
        }

        // Find target div element
        const loginCodeView = document.querySelector('div.login-code-view');

        if (loginCodeView) {
            const hasHiddenClass = loginCodeView.classList.contains('!hidden');
            const codeInput = loginCodeView.querySelector('input[name="code"], input[name="fuckcode"]');

            if (codeInput) {
                // Check if the status has changed to avoid repeated operations
                if (lastState !== hasHiddenClass) {
                    if (hasHiddenClass) {
                        // Contains !hidden class, modify name attribute
                        if (codeInput.getAttribute('name') !== modifiedName) {
                            codeInput.setAttribute('name', modifiedName);
                            console.log('Captcha input box name attribute has been modified to:', modifiedName);
                        }
                    } else {
                        // Exclude !hidden class, restore name attribute
                        if (codeInput.getAttribute('name') !== originalName) {
                            codeInput.setAttribute('name', originalName);
                            console.log('Captcha input box name attribute has been restored to:', originalName);
                        }
                    }
                    lastState = hasHiddenClass;
                }
            } else {
                console.log('Captcha input box element not found');
            }
        } else {
            console.log('login-code-view element not found');
            // If the target element is not found, reset the state
            lastState = null;
        }
    }

    // Use MutationObserver to listen for login-code-view class changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                console.log('Detected class attribute change for login-code-view');
                checkAndModify();
            }
        });
    });

    // Start observing when login-code-view element exists
    function startObserving() {
        const loginCodeView = document.querySelector('div.login-code-view');
        if (loginCodeView) {
            observer.observe(loginCodeView, {
                attributes: true,
                attributeFilter: ['class']
            });
            console.log('Started observing login-code-view class changes');
        } else {
            // If element doesn't exist yet, retry after a short delay
            setTimeout(startObserving, 100);
        }
    }

    // Start observing after site identifiers are confirmed
    function delayedCheck() {
        let attempts = 0;
        const maxAttempts = 50;
        const interval = 100;

        const checkInterval = setInterval(() => {
            attempts++;

            if (checkSiteIdentifiers()) {
                clearInterval(checkInterval);
                console.log('Suspicious Baota site detected');
                checkAndModify();
                startObserving(); // Start observing after initial check
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.log('Timeout: Complete website identification variable not detected');
            }
        }, interval);
    }

    // Execute after the page has finished loading
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', delayedCheck);
    } else {
        delayedCheck();
    }
})();
