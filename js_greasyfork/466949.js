// ==UserScript==
// @name         Auto Login Moodle NMIT
// @version      2.3
// @description  Auto fill MUST be on, otherwise ggs
// @match        https://ecampus.nmit.ac.nz/*
// @match        https://adfs.nmit.ac.nz/*
// @license MIT
// @grant none
// @namespace https://greasyfork.org/en/users/1083698
// @downloadURL https://update.greasyfork.org/scripts/466949/Auto%20Login%20Moodle%20NMIT.user.js
// @updateURL https://update.greasyfork.org/scripts/466949/Auto%20Login%20Moodle%20NMIT.meta.js
// ==/UserScript==

(function() { // eslint-disable-line no-extra-parens
    'use strict';

    if (window.location.href.includes("https://adfs.nmit.ac.nz/")) {
        console.log("Auto-filling login form...");

        window.addEventListener('load', () => {
            console.log("Page loaded, handling focus...");

            // Simulate real mouse click at current cursor position
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: window.innerWidth / 2, // Click in middle of window
                clientY: window.innerHeight / 2
            });
            document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)?.dispatchEvent(clickEvent);

            const userNameInput = document.getElementById('userNameInput');
            if (userNameInput) {
                userNameInput.removeAttribute('autofocus');
                userNameInput.blur();
            }
        });

        const checkInputs = setInterval(() => {
            const passInput = document.getElementById("passwordInput");
            console.log("Checking for password input...");

            if (passInput && passInput.value) {
                passInput.dispatchEvent(new Event('input', { bubbles: true }));
                passInput.dispatchEvent(new Event('change', { bubbles: true }));

                if (document.activeElement !== passInput) {
                    console.log("Password input found and filled. Clicking sign in button...");
                    clearInterval(checkInputs);
                    clickSignInButton();
                }
            }
        }, 500);
    } else if (window.location.href.includes("https://ecampus.nmit.ac.nz/")) {
        var loginSpan = document.querySelector('span.login');
        if (loginSpan) {
            window.location.href = 'https://ecampus.nmit.ac.nz/moodle/login/index.php';
        }
    }
})();

function clickSignInButton() {
    var signInButton = document.getElementById('submitButton');
    signInButton.click();
}