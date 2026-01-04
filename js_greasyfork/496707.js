// ==UserScript==
// @name         Google US Region Setter and License Acceptor with Persistent US Setting
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Keep Google region set to US and language to English persistently
// @author       Shadow_Kurgansk
// @match        https://www.google.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496707/Google%20US%20Region%20Setter%20and%20License%20Acceptor%20with%20Persistent%20US%20Setting.user.js
// @updateURL https://update.greasyfork.org/scripts/496707/Google%20US%20Region%20Setter%20and%20License%20Acceptor%20with%20Persistent%20US%20Setting.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to persistently set Google region to US and language to English
    function setGoogleRegionToUS() {
        const url = new URL(window.location.href);
        const params = url.searchParams;

        // Check if the language is already set to English and the region to US
        if (params.get('hl') !== 'en' || params.get('gl') !== 'us') {
            params.set('hl', 'en'); // Set language to English
            params.set('gl', 'us'); // Set region to US
            // If the URL has changed, reload the page with the new parameters
            if (window.location.href !== url.href) {
                window.location.href = url.href;
            }
        }
    }

    // Function to accept the license agreement with a delay
    function acceptLicenseAgreement() {
        // Wait for 200 milliseconds (0.2 seconds) before trying to click the button
        setTimeout(function() {
            const acceptButton = document.querySelector('#L2AGLb.tHlp8d');
            if (acceptButton) {
                acceptButton.click();
            }
        }, 200); // Adjust the time as needed
    }

    // Execute the acceptLicenseAgreement function when the page includes 'google.com'
    if (window.location.href.includes('google.com')) {
        acceptLicenseAgreement();
    }

    // Set an interval to check the region and language every 3 seconds
    setInterval(setGoogleRegionToUS, 500);
})();
