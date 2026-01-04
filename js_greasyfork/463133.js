// ==UserScript==
// @name         ROC auto login
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatisch inloggen bij Microsoft logins.
// @author       Ardyon
// @match        https://login.roc-nijmegen.nl/*
// @match        https://login.microsoftonline.com/login.srf
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roc-nijmegen.nl
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463133/ROC%20auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/463133/ROC%20auto%20login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const waitForElement = (cssSelector) => {
        return new Promise((resolve, reject) => {
            let attempt = 0;
            const maxAttempts = 1000;

            const interval = setInterval(() => {
                attempt += 1;
                if(attempt === maxAttempts) {
                    clearInterval(interval);
                    console.log(`Reached maximum amount of attemps: ${maxAttempts}`);
                    resolve(null);
                }

                const elem = document.querySelector(cssSelector);

                if(elem !== null) {
                    clearInterval(interval);
                    resolve(elem);
                }
            }, 50);
        });
    };

    const roc = async () => {
        const usernameInput = await waitForElement("#userNameInput");
        const passwordInput = await waitForElement("#passwordInput");
        const loginButton = await waitForElement("#submitButton");

        if(usernameInput && passwordInput) {
            loginButton.click();
        } else {
            alert("Geen email en/of wachtwoord ingevuld");
        }
    };

    const microsoft = async () => {
        const displayName = await waitForElement("#displayName");
        const loginButton = await waitForElement("#idSIButton9");

        if(displayName.title.includes("roc-nijmegen")) {
            loginButton.click();
        }
        // Ik weet niet of het een goed idee is om een alert te sturen
        // als iemand een ander email wil invoeren.
        /* else {
            alert("Geen ROC account");
        } */
    };

    if(window.location.href.includes("roc-nijmegen")) {
        roc();
    } else if(window.location.href.includes("microsoftonline")) {
        microsoft();
    }
})();