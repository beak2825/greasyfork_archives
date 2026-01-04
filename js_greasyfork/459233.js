// ==UserScript==
// @name         BO FAT Auto Login
// @description  Login automatically to Backoffice on local and Fat env
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @author       You
// @match        htt*://*.shub.us/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=storehub.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459233/BO%20FAT%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/459233/BO%20FAT%20Auto%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function autoLoginOnBO1(username, password) {
        window.document.getElementById('email').value = username;
        window.document.getElementById('password').value = password;
        window.document.getElementById('remember').checked = true;
        window.document.querySelector("button[data-test-id='Login.proceed']").click();
    }

    function autoLoginOnBO2(username, password) {
        const eventForUsername = new Event('change', { bubbles: true });
        const eventForPassword = new Event('change', { bubbles: true });
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;

        const userNameInput = window.document.querySelector('input[name="username"]');
        const passwordInput = window.document.querySelector('input[name="password"]');
        nativeInputValueSetter.call(userNameInput, username);
        userNameInput.dispatchEvent(eventForUsername);
        // Pending React rendered
        setTimeout(function() {
            nativeInputValueSetter.call(passwordInput, password);
            passwordInput.dispatchEvent(eventForPassword);

            window.document.querySelector("button[type='submit']").click();
        }, 0)

    }

    function isOnBO2LoginPage() {
        const formContainer = window.document.getElementsByClassName('dev-index__form-container').item(0);
        if(!formContainer) {
            return false;
        }

        return formContainer.textContent.includes("Sign in to SBO (dev only)Sign in");
    }

    function isOnBO1LoginPage() {
        return location.pathname.startsWith("/login");
    }

    function isLoginFormMounted() {
        const BO2FormContainer = window.document.getElementsByClassName('dev-index__form-container').item(0);
        const BO1FormContainer = window.document.getElementsByClassName('signup-form').item(0);

        return !!BO1FormContainer || !!BO2FormContainer;
    }

    function autoLogin() {
        // wait react render successfully
        const intervalId = setInterval(() => {
            if(!isLoginFormMounted()) {
                return;
            }
            console.log("Start BO FAT Auto Login");
            clearInterval(intervalId);
            const business = window.location.hostname.split(".").shift();
            const username = `huaicheng.liu+${business}@storehub.com`;
            const password = "test123";
            if(isOnBO2LoginPage()) {
                autoLoginOnBO2(username, password)
            } else if(isOnBO1LoginPage()) {
                autoLoginOnBO1(username, password);
            }

        }, 2000);
    }

    if (document.readyState === 'loading') {
        // Loading hasn't finished yet
        document.addEventListener('DOMContentLoaded', autoLogin);
    } else {
        // `DOMContentLoaded` has already fired
        autoLogin();
    }
})();