// ==UserScript==
// @name         Bing US Region Setter and License Acceptor with Persistent US Setting
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Keep Bing region set to US and language to English persistently
// @author       Shadow_Kurgansk
// @match        https://www.bing.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496706/Bing%20US%20Region%20Setter%20and%20License%20Acceptor%20with%20Persistent%20US%20Setting.user.js
// @updateURL https://update.greasyfork.org/scripts/496706/Bing%20US%20Region%20Setter%20and%20License%20Acceptor%20with%20Persistent%20US%20Setting.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to persistently set Bing region to US and language to English
    function setBingRegionToUS() {
        const url = new URL(window.location.href);
        const params = url.searchParams;

        // Check if the language is already set to English (US)
        if (params.get('setlang') !== 'en-us') {
            params.set('setlang', 'en-us'); // Set language to English (US)
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
            const acceptButton = document.querySelector('#bnp_btn_accept.bnp_btn_accept');
            if (acceptButton) {
                acceptButton.click();
            }
        }, 200); // Adjust the time as needed
    }

    // Execute the acceptLicenseAgreement function when the page includes 'bing.com'
    if (window.location.href.includes('bing.com')) {
        acceptLicenseAgreement();
    }

    // Set an interval to check the region and language every 3 seconds
    setInterval(setBingRegionToUS, 500);
})();
