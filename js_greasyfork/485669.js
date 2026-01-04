// ==UserScript==
// @name         UoM Blackboard: Auto login
// @namespace    http://tampermonkey.net/
// @version      20240125.00.00
// @description  An optional accompanying script for https://github.com/adil192/BlackboardTheme, which automatically clicks the login button if your username and password are saved in the browser.
// @author       adil192
// @match        https://login.manchester.ac.uk/cas/login*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manchester.ac.uk
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/485669/UoM%20Blackboard%3A%20Auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/485669/UoM%20Blackboard%3A%20Auto%20login.meta.js
// ==/UserScript==

// @ts-check

(function () {
    'use strict';

    console.log("UoM Blackboard: Auto login");

    /** The username input. @type {HTMLInputElement | null} */
    const username = document.querySelector("input#username");
    /** The password input. @type {HTMLInputElement | null} */
    const password = document.querySelector("input#password");
    /** The submit button. @type {HTMLInputElement | null} */
    const submit = document.querySelector("input[type=submit]");

    if (!username || !password || !submit) {
        console.log("UoM Blackboard: Auto login: Could not find username, password or submit button.");
        return;
    }

    if (username.value && password.value) {
        console.log("UoM Blackboard: Auto login: Username and password are already filled in, submitting form.");
        submit.click();
    }
})();
