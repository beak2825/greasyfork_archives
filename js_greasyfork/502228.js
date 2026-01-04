// ==UserScript==
// @name         Captcha Solver addon for Bodega Bot
// @namespace    Captcha Solver addon for Bodega Bot
// @version      1.0
// @description  Solves checkbox captcha on Tinychat page load, may or may not work.
// @author       Bort
// @match        https://tinychat.com/room/thebodega
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502228/Captcha%20Solver%20addon%20for%20Bodega%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/502228/Captcha%20Solver%20addon%20for%20Bodega%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to solve the captcha
    const solveCaptcha = async () => {
        // Wait for the captcha element to be present
        const observer = new MutationObserver((mutations, obs) => {
            const captchaContainer = document.getElementById('captcha-content-element');
            if (captchaContainer) {
                console.log('Captcha container detected, attempting to solve...');
                
                // Find the captcha iframe inside the container
                const captchaIframe = captchaContainer.querySelector('iframe[src*="recaptcha"]');
                if (captchaIframe) {
                    console.log('Captcha iframe found');
                    
                    // Wait for the iframe to load its content
                    const iframeDocument = captchaIframe.contentDocument || captchaIframe.contentWindow.document;
                    iframeDocument.addEventListener('DOMContentLoaded', async () => {
                        // Find and click the checkbox
                        const captchaCheckbox = iframeDocument.querySelector('.recaptcha-checkbox-border');
                        if (captchaCheckbox) {
                            console.log('Captcha checkbox found, clicking...');
                            captchaCheckbox.click();
                            
                            // Wait for some time to let the captcha solve (adjust the timeout as needed)
                            await new Promise(resolve => setTimeout(resolve, 10000)); // 10 seconds
                            
                            console.log('Captcha should be solved by now, proceeding...');
                            
                            // Example: Check if the captcha was successfully solved
                            const isCaptchaSolved = document.querySelector('.g-recaptcha-response') !== null;
                            if (isCaptchaSolved) {
                                console.log('Captcha solved successfully!');
                            } else {
                                console.log('Failed to solve captcha.');
                            }
                        } else {
                            console.log('Captcha checkbox not found.');
                        }
                    });
                } else {
                    console.log('Captcha iframe not found.');
                }

                obs.disconnect();
            }
        });

        observer.observe(document, { childList: true, subtree: true });
    };

    // Run the solveCaptcha function when the page loads
    window.addEventListener('load', solveCaptcha);
})();
