// ==UserScript==
// @name         Streaming Community - Login
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Auto Login - Detection System
// @license MIT
// @match        https://streamingcommunity.tld/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510741/Streaming%20Community%20-%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/510741/Streaming%20Community%20-%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check for specific elements and redirect if necessary
    function checkAndRedirect() {
        const ignoreButton = document.querySelector('button[type="button"]:not([class])');

        if (ignoreButton && ignoreButton.textContent.trim() === 'musta_lol') {
            // Do nothing if the 'musta_lol' button is found
            return;
        }

        const loginButton = document.querySelector('a.nav-item.btn-login[href*="/login"]');
        if (loginButton && loginButton.textContent.trim() === 'Accedi') {
            // Redirect to the login page
            window.location.href = loginButton.href;
        }
    }

    // Function to fill in the form and submit
    function autoLogin() {
        let username = document.querySelector('input#username');
        let password = document.querySelector('input#password');
        let remember = document.querySelector('main#content > div > div:nth-child(1) > form > div:nth-child(4) > div > input');
        let submit = document.querySelector('main#content > div > div:nth-child(1) > form > button');

        if (username && password && remember && submit) {
            username.value = 'd95v91h3@anonaddy.me';
            password.value = 'PN3Ufkg74TuxYrR';
            remember.checked = true;

            // Dispatch events to trigger any listeners
            username.dispatchEvent(new Event('input', { bubbles: true }));
            password.dispatchEvent(new Event('input', { bubbles: true }));

            // Submit the form
            submit.click();
        }
    }

    // Determine which function to run based on the current URL
    if (window.location.pathname === '/login') {
        // If we're on the login page, run autoLogin
        window.addEventListener('load', autoLogin);
    } else {
        // On any other page, run checkAndRedirect
        window.addEventListener('load', checkAndRedirect);
    }
})();