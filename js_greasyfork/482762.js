// ==UserScript==
// @name         Tmall Page URL and Title Copier with Enhanced UI
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Adds a stylish button to copy the H1 text and cleaned URL to the clipboard with auto-hide notification.
// @author       max5555
// @license      MIT
// @match        https://detail.tmall.com/item.htm*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/482762/Tmall%20Page%20URL%20and%20Title%20Copier%20with%20Enhanced%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/482762/Tmall%20Page%20URL%20and%20Title%20Copier%20with%20Enhanced%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the floating button with enhanced style
    var floatingButton = document.createElement('button');
    floatingButton.innerText = 'Copy H1 & URL';
    floatingButton.style.position = 'fixed';
    floatingButton.style.bottom = '60px';
    floatingButton.style.right = '20px';
    floatingButton.style.padding = '10px';
    floatingButton.style.backgroundColor = '#4CAF50';
    floatingButton.style.color = 'white';
    floatingButton.style.border = 'none';
    floatingButton.style.borderRadius = '5px';
    floatingButton.style.cursor = 'pointer';
    floatingButton.style.zIndex = '1000';
    document.body.appendChild(floatingButton);

    // Function to clean the URL and return the essential part
    function cleanURL(url) {
        const urlObj = new URL(url);
        return urlObj.origin + urlObj.pathname + '?id=' + urlObj.searchParams.get('id');
    }

    // Function to create and auto-hide notification
    function showNotification(message, duration) {
        var notification = document.createElement('div');
        notification.innerText = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '50px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1001';
        document.body.appendChild(notification);

        setTimeout(function() {
            notification.remove();
        }, duration);
    }

    // Event listener for the button
    floatingButton.addEventListener('click', function() {
        const h1Text = document.querySelector('h1').innerText;
        const cleanedURL = cleanURL(window.location.href);
        const textToCopy = h1Text + ' ' + cleanedURL;
        GM_setClipboard(textToCopy);
        showNotification('H1 text and URL copied to clipboard!', 3000); // Notification for 3 seconds
    });
})();
