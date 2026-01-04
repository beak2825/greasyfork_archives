// ==UserScript==
// @name         E-Z auto "Remember Me"
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.4
// @description  Automatically check the "Remember Me" box on the login form.
// @author       Not_Noob
// @match        https://e-z.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-z.gg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497777/E-Z%20auto%20%22Remember%20Me%22.user.js
// @updateURL https://update.greasyfork.org/scripts/497777/E-Z%20auto%20%22Remember%20Me%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check the "Remember Me" checkbox
    function checkRememberMe() {
        const rememberMeCheckbox = document.getElementById('rememberme');
        if (rememberMeCheckbox && !rememberMeCheckbox.checked) {
            rememberMeCheckbox.click();
        }
    }

    // Automatically click the login button on the home page
    if (document.location.href == 'https://e-z.gg/') {
        const loginButton = document.querySelector('button');
        if (loginButton) {
            loginButton.click();

            // Observer shit is GPT generated.
            // Use MutationObserver to detect when the page content changes after clicking the button
            const observer = new MutationObserver(() => {
                // Reload the page after changes are detected
                location.reload();
            });

            // Observe changes in the document body
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    checkRememberMe();
})();