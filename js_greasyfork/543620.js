// ==UserScript==
// @name         AWS Region Changer
// @namespace    https://greasyfork.org/users/77886
// @version      0.1
// @description  Automatically change AWS region to us-east-1 if the URL has region=us-east-2 in query params or hostname. Can be set instead via https://us-east-1.console.aws.amazon.com/settings/localization/edit?region=us-east-1
// @author       muchtall
// @match        https://console.aws.amazon.com/*
// @match        https://*.console.aws.amazon.com/*
// @license      GNU GPL-3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543620/AWS%20Region%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/543620/AWS%20Region%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = new URL(window.location.href);
    const hostnameParts = url.hostname.split('.');

    // Check if it's an AWS session URL (e.g., ends with .console.aws.amazon.com)
    if (hostnameParts.length >= 5 &&
        hostnameParts[hostnameParts.length - 4] === 'console' &&
        hostnameParts[hostnameParts.length - 3] === 'aws' &&
        hostnameParts[hostnameParts.length - 2] === 'amazon' &&
        hostnameParts[hostnameParts.length - 1] === 'com') {

        const potentialRegionIndex = hostnameParts.length - 5;  // Index of the region (e.g., before 'console')
        if (potentialRegionIndex >= 0) {
            const region = hostnameParts[potentialRegionIndex];
            if (region === 'us-east-2') {
                // Replace the region in the hostname
                hostnameParts[potentialRegionIndex] = 'us-east-1';
                const newHostname = hostnameParts.join('.');
                url.hostname = newHostname;  // Update the hostname
                window.location.href = url.href;  // Redirect to the new URL
                return;  // Exit after redirect
            }
        }
    }

    // If not a session URL or region not us-east-2, check query parameters
    const urlParams = new URLSearchParams(url.search);
    if (urlParams.get('region') === 'us-east-2') {
        urlParams.set('region', 'us-east-1');
        url.search = urlParams.toString();  // Update the query string
        window.location.href = url.href;  // Redirect to the new URL
    }
})();