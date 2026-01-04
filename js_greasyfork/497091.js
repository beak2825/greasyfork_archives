// ==UserScript==
// @name         Cloudflare Rate Limit Refresher
// @version      1.01
// @description  Refreshes the CloudFlare rate limit page until you get to your destination
// @match        *://*/*
// @license      MIT
// @namespace    cloudflareratelimitrefresher
// @downloadURL https://update.greasyfork.org/scripts/497091/Cloudflare%20Rate%20Limit%20Refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/497091/Cloudflare%20Rate%20Limit%20Refresher.meta.js
// ==/UserScript==

checkForErrorAndRefresh();

function checkForErrorAndRefresh() {
    var errorElement = document.getElementById('cf-error-details');

    if (errorElement) {
        console.log('Error detected, refreshing page...');
        window.location.reload();
    } else {
        console.log('No error detected.');
    }
}