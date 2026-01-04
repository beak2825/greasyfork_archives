// ==UserScript==
// @name         Nhentai.net Auto Login
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Automatically fills in the login credentials on nhentai.net and clicks the sign in button on the home page.
// @author       longkidkoolstar
// @icon         https://th.bing.com/th/id/R.801ed06597579fe568cdc29b3830d5e8?rik=ZyxLZr%2fyc04MHg&pid=ImgRaw&r=0
// @match        https://nhentai.net/*
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469935/Nhentainet%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/469935/Nhentainet%20Auto%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const email = GM.getValue('email');
    const password = GM.getValue('password');

    // Login page
    if (window.location.href.includes('/login/?next=/')) {
        if (!email || !password) {
            GM.setValue('email', prompt('Please enter your email:'));
            GM.setValue('password', prompt('Please enter your password:'));
        }
        document.getElementById('id_username_or_email').value = email;
        document.getElementById('id_password').value = password;
        const errorMessage = document.querySelector('#errors');
        if (!errorMessage || !errorMessage.textContent.includes('You need to solve the CAPTCHA.')) {
            document.querySelector('button[type="submit"]').click();
        } else {
            console.log('CAPTCHA detected. Cannot auto-login.');
        }
    }
})();