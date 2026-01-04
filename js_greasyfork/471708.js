// ==UserScript==
// @name         Kirka Auto Login
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically logs in to Kirka.io
// @author       MintyFs1
// @match        https://kirka.io/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471708/Kirka%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/471708/Kirka%20Auto%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Enter your Kirka.io username and password below
    let username = 'your_username_here';
    let password = 'your_password_here';

    // Fill in the login form
    document.querySelector('input[name="username"]').value = username;
    document.querySelector('input[name="password"]').value = password;

    // Click the login button
    document.querySelector('button[type="submit"]').click();
})();