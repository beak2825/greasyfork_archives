// ==UserScript==
// @name         Smartschool Autologin (ONLY WORKS IF LOGIN WITH GOOGLE IS ENABLED)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @icon         https://static1.smart-school.net/smsc/svg/favicon/favicon.svg
// @description  Automatically log in using Google SSO (if enabled) if no username or password is entered. Stops if a manual login is attempted.
// @author       .lo5r on discord
// @match        https://*.smartschool.be/login*
// @match        https://*.smartschool.be/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513039/Smartschool%20Autologin%20%28ONLY%20WORKS%20IF%20LOGIN%20WITH%20GOOGLE%20IS%20ENABLED%29.user.js
// @updateURL https://update.greasyfork.org/scripts/513039/Smartschool%20Autologin%20%28ONLY%20WORKS%20IF%20LOGIN%20WITH%20GOOGLE%20IS%20ENABLED%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const logout = localStorage.getItem('loggedOut') === 'true';

    // check if baseurl is already stored in localStorage, if not, store it.
    let baseURL = localStorage.getItem('smartschoolBaseURL');
    if (!baseURL) {
        baseURL = `https://${window.location.hostname}`;
        localStorage.setItem('smartschoolBaseURL', baseURL);
    }

    // gandle auto-login for the Smartschool login page
    if (window.location.href.startsWith(`${baseURL}/login`) && !logout) {
        window.location.href = `${baseURL}/login/sso/init/google`;
    }

    if (window.location.href.startsWith(`${baseURL}/login`)) {
        if (!logout) {
            const usrname = document.querySelector('#login_form__username');
            const pswd = document.querySelector('#login_form__password');

            // google sso login handling
            if (usrname && pswd && usrname.value === '' && pswd.value === '') {
                window.location.href = `${baseURL}/login/sso/init/google`;
            }
        } else {
            localStorage.setItem('loggedOut', 'false');
        }
    }

    // Handle Smartschool stuff (when logged in)
    if (window.location.href === `${baseURL}/`) {
        const logoutButton = document.querySelector('a[href*="/logout"]');
        if (logoutButton) {
            logoutButton.addEventListener('click', function() {
                localStorage.setItem('loggedOut', 'true');
            });
        }
    }

    // Aanmelden button stuff when fields are empty
    const loginButton = document.querySelector('button.smscButton.blue[type="submit"]');
    if (loginButton) {
        loginButton.addEventListener('click', function(event) {
            const usrname2 = document.querySelector('#login_form__username');
            const pswd2 = document.querySelector('#login_form__password');
            if (usrname2 && pswd2 && usrname2.value === '' && pswd2.value === '') {
                event.preventDefault(); // Prevent form submission
                window.location.href = `${baseURL}/login/sso/init/google`;
            }
        });
    }

    // prevent auto-login on reload
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function() {
            const usrname = document.querySelector('#login_form__username');
            const pswd = document.querySelector('#login_form__password');
            if (usrname && pswd && (usrname.value !== '' || pswd.value !== '')) {
                localStorage.setItem('loggedOut', 'true'); // Prevent auto-login on next reload
            }
        });
    }

})();
