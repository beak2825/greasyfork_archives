// ==UserScript==
// @name         X to vxtwitter URL Copier with Hotkey
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Copies URL and replaces x.com with vxtwitter.com when hotkey is pressed
// @author       rkk1995
// @match        https://x.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500646/X%20to%20vxtwitter%20URL%20Copier%20with%20Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/500646/X%20to%20vxtwitter%20URL%20Copier%20with%20Hotkey.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to copy modified URL to clipboard
    async function copyModifiedURL() {
        // Parse the current URL
        let url = new URL(window.location.href);

        // Check if the host is x.com and replace it with vxtwitter.com
        if (url.host === 'x.com') {
            url.host = 'vxtwitter.com';
            let modifiedURL = url.href;

            await navigator.clipboard.writeText(modifiedURL);
        }
    }

    // Add a keydown event listener to the document
    document.addEventListener('keydown', (event) => {
        // Check if the hotkey (Ctrl+C) is pressed
        if (event.ctrlKey && event.code === 'KeyC') {
            copyModifiedURL();
        }
    });
})();