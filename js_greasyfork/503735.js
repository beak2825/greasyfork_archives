// ==UserScript==
// @name         autoclaim bestchange.com
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Automatically fills the address textbox with input address, then clicks claim button after it waits for captcha completion.
// @author       Me
// @match        https://www.bestchange.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503735/autoclaim%20bestchangecom.user.js
// @updateURL https://update.greasyfork.org/scripts/503735/autoclaim%20bestchangecom.meta.js
// ==/UserScript==
var uraddress = 'URBTCADDRESSHERE';

(function() {
    'use strict';

    // Wait for the DOM to be fully loaded
    window.addEventListener('load', function() {
        // Locate the textbox by its id
        setTimeout(1000);
        var textbox = document.getElementById('bonus_purse');
        if (textbox) {
            textbox.value = uraddress;
            console.log('Textbox found and text inserted:', textbox);
        } else {
            console.log('No textbox found with id "bonus_purse".');
        }
    }, false);

                waitForCaptcha(function() {
                console.log("Captcha has been resolved!");
// Locate the button by its id
        var button = document.getElementById('bonus_button');
        if (button) {
            button.click(); // Click the button
            console.log('Button found and clicked:', button);
        } else {
            console.log('No button found with id "bonus_button".');
        }
    }, false);


    function checkCaptchaResolved() {
        // Get the hCaptcha response textarea
        let hCaptchaResponse = document.querySelector('textarea[id^="h-captcha-response-"]');

        // If the textarea contains any value, hCaptcha is likely resolved
        if (hCaptchaResponse && hCaptchaResponse.value.trim() !== "") {
            return true; // Return true if resolved
        } else {
            return false; // Return false if not resolved
        }
    }

    function waitForCaptcha(callback) {
        let captchaCheckInterval = setInterval(function() {
            if (checkCaptchaResolved()) {
                clearInterval(captchaCheckInterval);
                callback();
            }
        }, 1000); // Check every 1 second
    }

})();