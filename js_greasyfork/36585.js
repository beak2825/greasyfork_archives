// ==UserScript==
// @name         Autologin - HBO Nordic FINLAND
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically logging you in to the HBO Nordic FINLAND account.
// @author       Santeri Hetekivi
// @match        https://fi.hbonordic.com/sign-in
// @grant        none
// @license      Apache-2.0
// @copyright    2017, SanteriHetekivi (https://github.com/SanteriHetekivi)
// @downloadURL https://update.greasyfork.org/scripts/36585/Autologin%20-%20HBO%20Nordic%20FINLAND.user.js
// @updateURL https://update.greasyfork.org/scripts/36585/Autologin%20-%20HBO%20Nordic%20FINLAND.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const USERNAME = "YOUR.LOGIN@EMAIL.fi"; // Your username/email here.
  const PASSWORD = "PASSWORD"; // Your password here
  const USERNAME_ID = "email"; // id for username/email field.
  const WAIT_CHECK_MS = 500; // 0.5 s Wait time between element checks.
  const LOGIN_SLEEP_MS = 1000; // 1.0 s Time to wait before pressing login button.

  // Basic sleep function.
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function login() {
    // If username/email field is not found.
    if (document.getElementById(USERNAME_ID) === null) {
      setTimeout(login, WAIT_CHECK_MS); // Wait for set waitTime and call function again.
      return; // Execution stops to this.
    }

    // Focus on username/email field for faking type.
    document.getElementById(USERNAME_ID).focus();
    // Set username/email to field.
    document.getElementById(USERNAME_ID).value = USERNAME;

    // Find all input fields
    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
      // That has type of password.
      if (inputs[i].type.toLowerCase() == 'password') {
        // Focus on password field for faking type.
        inputs[i].focus();
        // Set password to field.
        inputs[i].value = PASSWORD;
      }
    }

    // Find all sign-in-submit-buttons.
    var buttons = document.querySelectorAll("[data-automation='sign-in-submit-button']");
    // Click all buttons to make sure.
    for (i = 0; i < buttons.length; i++) {
      // Focus on login button for faking click.
      buttons[i].focus();
      // Click the button.
      buttons[i].click();
    }
  }
  // Call to attemp login.
  login();
})();
