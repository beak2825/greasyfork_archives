// ==UserScript==
// @name         Take me straight to tracking!
// @namespace    Violentmonkey Scripts
// @author       Kayleigh
// @version      3.0
// @license      MIT
// @description  I hate Informed Delivery so much why are you making me sign in to see my packages! (Redirect from USPS Informed Delivery to USPS Tracking)
// @match        https://reg.usps.com/entreg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=usps.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504447/Take%20me%20straight%20to%20tracking%21.user.js
// @updateURL https://update.greasyfork.org/scripts/504447/Take%20me%20straight%20to%20tracking%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get URL parameter value
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    // Check if the current URL matches the pattern for sign-in nag
    if (window.location.href.startsWith('https://reg.usps.com/entreg/LoginAction_input')) {
        // Get the appURL parameter
        var appURL = getParameterByName('appURL');
        
        if (appURL) {
            // Decode the appURL
            var decodedAppURL = decodeURIComponent(appURL);
            
            // Extract the tracking number from the decoded appURL
            var trackingNumberMatch = decodedAppURL.match(/selectedTrckNum=(\d+)/);
            
            // trackingNumberMatch[1] is the capture group from the regex, just the digits (\d+)
            if (trackingNumberMatch && trackingNumberMatch[1]) {
                var trackingNumber = trackingNumberMatch[1];
                
                // Construct the new URL
                var newUrl = 'https://tools.usps.com/go/TrackConfirmAction?tLabels=' + trackingNumber + 
                             '&utm_content=tracking-number&utm_campaign=trackingnotify';
                
                // Redirect to the new URL
                window.location.href = newUrl;
            }
        }
    }
})();