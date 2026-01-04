// ==UserScript==
// @name         Copy SKU Texts from Tmall
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Copy SKU texts from Tmall product pages to clipboard with a floating button
// @author       max5555
// @license      MIT
// @match        https://detail.tmall.com/item.htm*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/481851/Copy%20SKU%20Texts%20from%20Tmall.user.js
// @updateURL https://update.greasyfork.org/scripts/481851/Copy%20SKU%20Texts%20from%20Tmall.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the floating button
    var floatingButton = document.createElement('button');
    floatingButton.innerText = 'Copy SKU Texts';
    floatingButton.style.position = 'fixed';
    floatingButton.style.bottom = '20px';
    floatingButton.style.right = '20px';
    floatingButton.style.padding = '10px';
    floatingButton.style.backgroundColor = '#4CAF50';
    floatingButton.style.color = 'white';
    floatingButton.style.border = 'none';
    floatingButton.style.borderRadius = '5px';
    floatingButton.style.cursor = 'pointer';
    floatingButton.style.zIndex = '1000';

    // Append the button to the body
    document.body.appendChild(floatingButton);

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

    // Function to copy SKU texts to clipboard
    floatingButton.addEventListener('click', function() {
        var skuTexts = Array.from(document.querySelectorAll('.selectSkuText'))
                            .map(element => element.innerText.trim())
                            .join(', ');
        GM_setClipboard(skuTexts);
        showNotification('SKU texts copied to clipboard!', 3000); // Notification for 3 seconds
    });
})();
