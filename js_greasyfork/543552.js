// ==UserScript==
// @name         1ink.cc Auto Skip and Captcha Submit
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically clicks Skip Ad, fills captcha, and submits on 1ink.cc
// @author       PixelHash
// @license      MIT
// @match        https://1ink.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543552/1inkcc%20Auto%20Skip%20and%20Captcha%20Submit.user.js
// @updateURL https://update.greasyfork.org/scripts/543552/1inkcc%20Auto%20Skip%20and%20Captcha%20Submit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to click the <a> containing the skip button
    function clickSkipAd() {
        const skipLink = document.querySelector('a#countingbtn');
        if (skipLink) {
            console.log('Clicking Skip Ad link...');
            skipLink.click();
        } else {
            console.log('Skip Ad link not found.');
        }
    }

    // Function to fill captcha input with 3 random numbers and click GO >>
    function fillCaptchaAndSubmit() {
        const captchaInput = document.querySelector('input[name="captcha"]');
        const submitButton = document.querySelector('input.button2[type="submit"]');

        if (captchaInput && submitButton) {
            // Generate 3 random digits
            const randomCaptcha = Math.floor(100 + Math.random() * 900); // ensures 3 digits
            captchaInput.value = randomCaptcha;
            console.log('Filled captcha with:', randomCaptcha);

            // Click GO >> after short delay to appear natural
            setTimeout(() => {
                submitButton.click();
                console.log('Submitted captcha.');
            }, 1000);
        } else {
            console.log('Captcha input or submit button not found.');
        }
    }

    // Wait for page load then run skip click
    window.addEventListener('load', () => {
        clickSkipAd();

        // Wait a few seconds for captcha page to load before filling and submitting
        setTimeout(fillCaptchaAndSubmit, 4000);
    });

})();
