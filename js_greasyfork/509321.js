
// ==UserScript==
// @name         Advanced Bypass with Captcha-Solving for MegaVIP and Similar Sites
// @namespace    http://example.com/
// @version      1.3
// @description  Bypass surveys and shortlinks on megavip.store, kmendation.com, and similar sites automatically. Includes captcha-solving integration.
// @author       YourName
// @match        *://megavip.store/s?*
// @match        *://kmendation.com/s?*
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        window.onurlchange
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/509321/Advanced%20Bypass%20with%20Captcha-Solving%20for%20MegaVIP%20and%20Similar%20Sites.user.js
// @updateURL https://update.greasyfork.org/scripts/509321/Advanced%20Bypass%20with%20Captcha-Solving%20for%20MegaVIP%20and%20Similar%20Sites.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // API key for the captcha-solving service (nocaptchaai.com)
    const CAPTCHA_API_KEY = 'dairydamn11-0261fb6c-8d3a-b3c9-6557-2510e9840466';

    // Utility function to wait for an element to appear on the page
    function waitForElement(selector, callback) {
        const observer = new MutationObserver(function(mutations, observer) {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Function to solve captchas automatically using an external service
    function solveCaptcha(captchaSelector) {
        const captchaElement = document.querySelector(captchaSelector);
        if (captchaElement) {
            const siteKey = captchaElement.getAttribute('data-sitekey');
            if (siteKey) {
                console.log('Solving captcha using external service...');
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `https://api.nocaptchaai.com/solve`,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify({
                        sitekey: siteKey,
                        url: window.location.href,
                        apikey: CAPTCHA_API_KEY
                    }),
                    onload: function(response) {
                        const result = JSON.parse(response.responseText);
                        if (result.success && result.token) {
                            console.log('Captcha solved, submitting response...');
                            // Insert the solved captcha response
                            document.querySelector('textarea[name="g-recaptcha-response"]').value = result.token;
                            // Trigger form submission or appropriate action
                            document.querySelector('form').submit();
                        } else {
                            console.error('Captcha solving failed:', result);
                        }
                    }
                });
            } else {
                console.error('Captcha sitekey not found.');
            }
        }
    }

    // Function to mimic survey completion
    function simulateSurveyCompletion() {
        console.log("Simulating survey completion...");

        // Fake a network request to simulate the completion of a survey
        GM_xmlhttpRequest({
            method: "POST",
            url: window.location.href, // Fake the current URL or API that expects a survey completion
            data: JSON.stringify({
                survey_complete: true,
                user_id: "fake_user_id"
            }),
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                console.log("Fake survey completion request sent.");
                if (response.status === 200) {
                    // Automatically bypass if the survey simulation succeeds
                    proceedToFinalLink();
                } else {
                    console.error("Survey simulation failed. Response:", response);
                }
            }
        });
    }

    // Function to proceed to the final link after bypassing the survey
    function proceedToFinalLink() {
        console.log("Proceeding to final link...");

        // Make a background request to the same URL to retrieve page content
        GM_xmlhttpRequest({
            method: "GET",
            url: window.location.href,
            onload: function(response) {
                // Extract the final redirect URL from the page content using a regex search
                const match = response.responseText.match(/window\.location\.href\s*=\s*"(https?:\/\/[^"]+)"/);

                // If a valid URL is found, automatically redirect to it
                if (match && match[1]) {
                    window.location.href = match[1]; // Redirect to the real link
                } else {
                    // Fallback for dynamic button clicks
                    console.log("Redirect URL not found in HTML. Waiting for possible dynamic content...");

                    // Wait for any download button or link
                    waitForElement('a[href*="download"], .download-button', function(element) {
                        element.click();
                    });
                }
            }
        });
    }

    // Listen for URL changes if the site redirects after clicking the initial link
    if (typeof window.onurlchange === 'function') {
        window.addEventListener('urlchange', function() {
            simulateSurveyCompletion();
        });
    }

    // Inject custom styles to hide any annoying ads or popups that may interfere with bypass
    GM_addStyle(`
        .ads, .popup, .ad-banner, .overlay, .captcha-popup {
            display: none !important;
        }
    `);

    // Start the bypass process after the page loads
    window.addEventListener('load', function() {
        // Check for captcha elements and solve them if present
        if (document.querySelector('.g-recaptcha')) {
            solveCaptcha('.g-recaptcha');
        } else {
            simulateSurveyCompletion();
        }
    });
})();
