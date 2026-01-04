// ==UserScript==
// @name         Fluxus Bypasser with Auto Clipboard Copy
// @homepageURL  https://idk
// @namespace    fluxus bypass
// @version      1.9
// @description  Bypass Fluxus and automatically copy key to clipboard
// @author       rafaelkris
// @match        https://flux.li/android/external/start.php?HWID=*
// @icon         https://flux.li/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522328/Fluxus%20Bypasser%20with%20Auto%20Clipboard%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/522328/Fluxus%20Bypasser%20with%20Auto%20Clipboard%20Copy.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    var apiUrl = "https://fluxus-bypass-kkk.vercel.app/api/fluxus?link=" + encodeURIComponent(window.location.href);

    try {
        let response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        let data = await response.json();

        let key = data.key; // Ensure the key is retrieved from the correct field

        if (key) {
            try {
                await navigator.clipboard.writeText(key);
                alert('Key copied to clipboard: ' + key);
            } catch (err) {
                console.error('Failed to copy key to clipboard:', err);
                alert('Failed to copy key to clipboard. Please check if clipboard permissions are enabled.');
            }
        } else {
            console.error('Key not found in response data');
        }
    } catch (error) {
        console.error('Failed to fetch or copy key:', error);
    }
})();