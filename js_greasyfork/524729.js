// ==UserScript==
// @name         Bilkent Auto Login
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Auto login for the first step of 2FA in Bilkent SRS
// @author       You
// @match        https://stars.bilkent.edu.tr/accounts/login
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.tr
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524729/Bilkent%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/524729/Bilkent%20Auto%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById("LoginForm_password").type = "password";
    document.getElementById("login-form").autocomplete = "on";

}) ();