
// ==UserScript==
// @name         Advanced Bypass for MegaVIP, Kmendation, and Similar Links
// @namespace    http://example.com/
// @version      1.1
// @description  Bypass shortlinks on megavip.store, kmendation.com, and similar sites automatically.
// @author       YourName
// @match        *://megavip.store/s?*
// @match        *://kmendation.com/s?*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/509320/Advanced%20Bypass%20for%20MegaVIP%2C%20Kmendation%2C%20and%20Similar%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/509320/Advanced%20Bypass%20for%20MegaVIP%2C%20Kmendation%2C%20and%20Similar%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

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

    // Function to bypass shortlinks
    function bypassShortlink() {
        const currentUrl = window.location.href;

        // If we're on the shortlink page, start the bypass process
        if (currentUrl.includes('megavip.store/s?') || currentUrl.includes('kmendation.com/s?')) {

            // Attempt to detect captcha presence
            if (document.querySelector('.g-recaptcha') || document.querySelector('#captcha')) {
                alert("Captcha detected. Please solve the captcha manually.");
                return;
            }

            // Make a background request to the same URL to retrieve page content
            GM_xmlhttpRequest({
                method: "GET",
                url: currentUrl,
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
    }

    // Inject custom styles to hide any annoying ads or popups that may interfere with bypass
    GM_addStyle(`
        .ads, .popup, .ad-banner, .overlay, .captcha-popup {
            display: none !important;
        }
    `);

    // Start the bypass process after the page loads
    window.addEventListener('load', bypassShortlink);
})();
