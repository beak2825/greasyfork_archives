// ==UserScript==
// @name         Copy Image Link from Tmall
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Copy image link from Tmall product pages
// @author       max5555
// @license      MIT
// @match        https://detail.tmall.com/item.htm*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/481679/Copy%20Image%20Link%20from%20Tmall.user.js
// @updateURL https://update.greasyfork.org/scripts/481679/Copy%20Image%20Link%20from%20Tmall.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and show the notification
    function showNotification(message) {
        var notification = document.createElement('div');
        notification.innerText = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '80px';
        notification.style.left = '20px';
        notification.style.backgroundColor = 'lightgreen';
        notification.style.padding = '10px';
        notification.style.zIndex = '1000';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 1000); // Auto-hide after 1 second
    }

    // Function to copy image link
    function copyImageLink() {
        var image = document.querySelector('.descV8-singleImage img');
        if (image && image.dataset.src) {
            GM_setClipboard(image.dataset.src);
            showNotification('Image link copied!');
        } else {
            showNotification('Image not found!');
        }
    }

    // Create and place the button
    var button = document.createElement('button');
    button.innerText = 'Copy Image Link';
    button.style.position = 'fixed';
    button.style.bottom = '40px';
    button.style.left = '20px';
    button.style.padding = '5px';
    button.style.background = 'rgba(0, 0, 0, 0.7)';
    button.style.color = 'white';
    button.style.zIndex = '10000';
    button.onclick = copyImageLink;
    document.body.appendChild(button);
})();
