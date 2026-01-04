// ==UserScript==
// @name         Copy Password from Ovagames
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Copy "password: ###" from ovagames pages
// @author       Starbez
// @license      MIT
// @match        https://www.ovagames.com/*.html
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/502486/Copy%20Password%20from%20Ovagames.user.js
// @updateURL https://update.greasyfork.org/scripts/502486/Copy%20Password%20from%20Ovagames.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Tampermonkey script loaded.');

    // Function to create and show a notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.innerText = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '10px';
        notification.style.right = '10px';
        notification.style.padding = '10px';
        notification.style.backgroundColor = '#28a745';
        notification.style.color = 'white';
        notification.style.fontSize = '16px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        notification.style.zIndex = '10000';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000); // Remove the notification after 3 seconds
    }

    // Function to find and copy the password
    function copyPassword() {
        console.log('Page loaded. Looking for password in #link_download...');

        // Look for the element with ID 'link_download'
        const downloadElement = document.getElementById('link_download');

        if (downloadElement) {
            console.log('#link_download element found:', downloadElement);

            // Look for the specific pattern "password: ###" within the element
            const passwordPattern = /\d{3}/i;
            const elementText = downloadElement.innerText;
            console.log('Element text content:', elementText);

            const passwordText = elementText.match(passwordPattern);
            console.log('Matched password:', passwordText);

            if (passwordText) {
                // Copy the password to the clipboard
                GM_setClipboard(passwordText[0], 'text');
                showNotification('Password copied to clipboard: ' + passwordText[0]);
            } else {
                console.log('Password not found in #link_download.');
            }
        } else {
            console.log('#link_download element not found.');
        }
    }

    // Wait for the page to load
    window.addEventListener('load', copyPassword);
})();
