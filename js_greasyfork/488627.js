// ==UserScript==
// @name         NJU-CAPTCHA-Hacker
// @namespace    https://github.com/geother/NJU-CAPTCHA-Hacker
// @version      1.1
// @description  A self-hosted API service for captcha recognition on the Nanjing University Unified Authentication login interface, along with a complementary browser plugin.
// @author       GeoTheR
// @match        https://authserver.nju.edu.cn/*
// @grant        GM_xmlhttpRequest
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/488627/NJU-CAPTCHA-Hacker.user.js
// @updateURL https://update.greasyfork.org/scripts/488627/NJU-CAPTCHA-Hacker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert canvas to blob
    function canvasToBlob(canvas, callback) {
        canvas.toBlob(function(blob) {
            callback(blob);
        });
    }

    // Function to send captcha image file to API and fill response
    function processCaptcha(canvas) {
        // Convert canvas to blob
        canvasToBlob(canvas, function(blob) {
            // Create FormData object
            var formData = new FormData();
            formData.append('image', blob, 'captcha.jpg');

            // Send captcha image file to API
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'http://124.222.129.163:1145/api/extract_code',
                responseType: 'json',
                data: formData,
                onload: function(response) {
                    var responseData = JSON.parse(response.responseText);
                    var captchaResponseInput = document.getElementById('captchaResponse');
                    if (captchaResponseInput) {
                        captchaResponseInput.value = responseData.code;
                    } else {
                        console.error('Captcha response input element not found');
                    }
                },
                onerror: function(error) {
                    console.error('Error occurred while sending captcha to API:', error);
                }
            });
        });
    }

    // Wait for the captcha image to load
    window.addEventListener('load', function() {
        var captchaImg = document.getElementById('captchaImg');
        if (captchaImg) {
            // Create a canvas element
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            // Set canvas dimensions to match captcha image
            canvas.width = captchaImg.width;
            canvas.height = captchaImg.height;

            // Draw captcha image onto canvas
            ctx.drawImage(captchaImg, 0, 0, captchaImg.width, captchaImg.height);

            // Process captcha image
            processCaptcha(canvas);
        } else {
            console.error('Captcha image element not found');
        }
    });
})();