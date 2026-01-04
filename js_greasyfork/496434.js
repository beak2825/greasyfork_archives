// ==UserScript==
// @name         SSO UI, EMAS2, SCELE, and SIAK-NG AutoLogin
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  This userscript is made to automatically login to UI websites using your account credentials. Set your username and password in the script before using it.
// @author       absolutepraya
// @match        https://scele.cs.ui.ac.id/
// @match        https://scele.cs.ui.ac.id/login/index.php
// @match        https://emas2.ui.ac.id/login/index.php
// @match        https://academic.ui.ac.id/main/Authentication/
// @match        https://sso.ui.ac.id/cas/login*
// @icon         https://i.ibb.co.com/m8vqKV2/favicon-32x32.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496434/SSO%20UI%2C%20EMAS2%2C%20SCELE%2C%20and%20SIAK-NG%20AutoLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/496434/SSO%20UI%2C%20EMAS2%2C%20SCELE%2C%20and%20SIAK-NG%20AutoLogin.meta.js
// ==/UserScript==

(function() {

    // replace ___username___ and ___password___ with your own username and password
    var username = "___username___";
    var password = "___password___";

    // declare variables
    var inputName, inputPassword, submitButton;

    // insert username and password
    if (window.location.href === "https://academic.ui.ac.id/main/Authentication/") {
        inputName = document.getElementsByName("u")[0];
        inputPassword = document.getElementsByName("p")[0];
    } else if (window.location.href.startsWith("https://sso.ui.ac.id/cas/login")) {
        inputName = document.getElementById("username");
        inputPassword = document.getElementById("password");
    } else {
        inputName = document.getElementsByName("username")[0];
        if (inputName) {
        } else {
            return;
        }
        inputPassword = document.getElementsByName("password")[0];
    }
    inputName.value = username;
    inputPassword.value = password;

    // click the login button
    submitButton = document.querySelector("[type='submit']");
    submitButton.click();

})();