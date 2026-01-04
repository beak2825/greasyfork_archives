// ==UserScript==
// @name         Captcha Solver for NitroType/NitroMath
// @namespace    https://singdev.wixsite.com/sing-developments
// @version      0.1
// @description  Finds and solves captchas if botting and solves them.
// @author       You
// @match        https://nitrotype.com/*
// @match        https://nitromath.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/480484/Captcha%20Solver%20for%20NitroTypeNitroMath.user.js
// @updateURL https://update.greasyfork.org/scripts/480484/Captcha%20Solver%20for%20NitroTypeNitroMath.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your CaptchaAI API key
    const captchaApiKey = '96004159c29dec0535a846099332d4d2';

    // Function to find and solve captcha
    function solveCaptcha() {
        // Replace the following with your actual logic to find the captcha element
        const captchaElement = document.getElementById('captcha'); // Replace 'captcha' with the actual ID or selector

        if (captchaElement) {
            // Replace the following with your actual logic to extract captcha data
            const captchaData = captchaElement.getAttribute('data-captcha'); // Replace 'data-captcha' with the actual attribute

            // Make a request to CaptchaAI API
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://ocr.captchaai.com/in.php',
                data: `key=${captchaApiKey}&captchaData=${captchaData}`, // Adjust parameters as needed
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                onload: function(response) {
                    // Handle the API response and extract the captcha solution
                    const captchaSolution = '...'; // Extract from the response

                    // Replace the following with your actual logic to fill in the captcha
                    captchaElement.value = captchaSolution;

                    // After solving the captcha, you might want to submit the form or perform other actions
                    // Replace the following with your actual logic
                    const formElement = captchaElement.closest('form');
                    if (formElement) {
                        formElement.submit();
                    }
                },
            });
        } else {
            console.log('Captcha element not found.');
        }
    }

    // Trigger the captcha-solving function
    solveCaptcha();

})();
