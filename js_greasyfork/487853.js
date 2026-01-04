// ==UserScript==
// @name        Auto-login goSupermodel
// @namespace   Violentmonkey Scripts
// @match       https://gosupermodel.com/
// @grant       none
// @version     1.0
// @author      Walamo
// @description 2/20/2024, 5:54:55 PM
// @icon        https://a4c9m5w9.stackpathcdn.com/images/favicon.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487853/Auto-login%20goSupermodel.user.js
// @updateURL https://update.greasyfork.org/scripts/487853/Auto-login%20goSupermodel.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Enter your Kirka.io username and password below
    let username = 'INSERT_USERNAME_HERE';
    let password = 'INSERT_PASSWORD_HERE';

    // Fill in the login form
    document.querySelector('input[name="username"]').value = username;
    document.querySelector('input[name="password"]').value = password;

    // Click the login button
document.querySelector('a.loginbtn span.loginbutton.xmas').click();

})();