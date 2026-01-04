// ==UserScript==
// @name         Auto Decode and Redirect Ankama Links
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically decode Ankama's hexadecimal URL links and redirect immediately.
// @match        *://go.ankama.com/es/check*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513994/Auto%20Decode%20and%20Redirect%20Ankama%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/513994/Auto%20Decode%20and%20Redirect%20Ankama%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extract the 's' parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const hexString = params.get('s');

    if (hexString) {
        try {
            // Decode hex to JSON
            const decodedString = decodeURIComponent(hexString.match(/.{1,2}/g).map(byte => String.fromCharCode(parseInt(byte, 16))).join(''));
            const jsonData = JSON.parse(decodedString);

            // Redirect if 'url' field exists
            if (jsonData.url) {
                window.location.href = jsonData.url;
            }
        } catch (e) {
            console.error("Failed to decode or redirect:", e);
        }
    }
})();
