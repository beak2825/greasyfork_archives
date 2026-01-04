// ==UserScript==
// @name         ZHNY CampusNet Auto Login
// @namespace    http://tampermonkey.net/
// @version      2024-12-16
// @description  Auto-login script for ZHNY CampusNet portal with OTP support
// @author       YourDady
// @match        https://172.16.6.1:2331/portal/
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=6.1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520872/ZHNY%20CampusNet%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/520872/ZHNY%20CampusNet%20Auto%20Login.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY_USERNAME = 'your user name'; // Key to store the username
    const FIXED_PASSWORD = 'your user pwd'; // Fixed part of the password

    // Replace with your OTP secret key
    const secretKey = 'your otp secet key';//if you cann't get it,please connect me:haijiaojin903@gmail.com

    // Base32 decoder function
    function base32Decode(input) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let bits = 0;
        let value = 0;
        let output = '';

        input = input.replace(/=+$/, ''); // Remove padding
        for (let i = 0; i < input.length; i++) {
            value = (value << 5) | alphabet.indexOf(input.charAt(i).toUpperCase());
            bits += 5;
            if (bits >= 8) {
                output += String.fromCharCode((value >> (bits - 8)) & 0xff);
                bits -= 8;
            }
        }
        return output;
    }

    // OTP generation function
    function generateOtp() {
        const timeStep = 30; // 30-second intervals
        const epoch = Math.floor(Date.now() / 1000);
        const counter = Math.floor(epoch / timeStep);

        // Decode secret key from Base32
        const key = CryptoJS.enc.Hex.parse(base32Decode(secretKey).split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(''));

        // Generate HMAC-SHA1 hash
        const counterHex = counter.toString(16).padStart(16, '0');
        const hmac = CryptoJS.HmacSHA1(CryptoJS.enc.Hex.parse(counterHex), key);

        // Truncate and calculate OTP
        const offset = hmac.words[hmac.words.length - 1] & 0xf;
        const otp = (parseInt(hmac.toString(CryptoJS.enc.Hex).substr(offset * 2, 8), 16) & 0x7fffffff) % 1000000;
        return otp.toString().padStart(6, '0');
    }

    // Main logic
    const elUsername = document.querySelector('#PtUser'); // Username input field
    const elPassword = document.querySelector('#PtPwd'); // Password input field

    if (elUsername) elUsername.setAttribute('autocomplete', 'username');
    if (elPassword) elPassword.setAttribute('autocomplete', 'current-password');

    const elSubmit = document.querySelector('button[type="submit"]') || getElementByXPath('/html/body/div/div/div[1]/form/div[2]/button');

    if (!elUsername || !elPassword || !elSubmit) {
        console.error('Required elements not found on the page.');
        return;
    }

    const savedUsername = localStorage.getItem(STORAGE_KEY_USERNAME);

    if (!savedUsername) {
        elSubmit.addEventListener('click', () => {
            const username = elUsername.value;

            if (username) {
                localStorage.setItem(STORAGE_KEY_USERNAME, username);
                console.log('Username saved locally.');
            } else {
                console.warn('Username is empty.');
            }
        });
        return;
    }

    // Combine fixed password and OTP
    const fullPassword = FIXED_PASSWORD + generateOtp();
    elUsername.value = savedUsername;
    elPassword.value = fullPassword;

    // Auto-submit the login form
    elSubmit.click();
    console.log('Auto-login attempted with fixed password and OTP.');

    // Helper function: Get element by XPath
    function getElementByXPath(xpath, context = document) {
        const result = document.evaluate(xpath, context, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue;
    }
})();
