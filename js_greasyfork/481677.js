// ==UserScript==
// @name         Copy Image SRC from Taobao
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Copy image source from Taobao product pages
// @author       max5555
// @license      MIT
// @match        https://item.taobao.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/481677/Copy%20Image%20SRC%20from%20Taobao.user.js
// @updateURL https://update.greasyfork.org/scripts/481677/Copy%20Image%20SRC%20from%20Taobao.meta.js
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
        setTimeout(() => notification.remove(), 3000); // Auto-hide after 3 seconds
    }

    // Function to copy image SRC
    function copyImageSrc() {
        var image = document.querySelector('.ks-imagezoom-wrap img');
        if (image && image.src) {
            GM_setClipboard(image.src);
            showNotification('Image source copied!');
        } else {
            showNotification('Image not found!');
        }
    }

    // Create and place the button
    var button = document.createElement('button');
    button.innerText = 'Copy Image Src';
    button.style.position = 'fixed';
    button.style.bottom = '40px'; // Modified position
    button.style.left = '20px';   // Modified position
    button.style.padding = '5px';
    button.style.background = 'rgba(0, 0, 0, 0.7)';
    button.style.color = 'white';
    button.style.zIndex = '10000';
    button.onclick = copyImageSrc;
    document.body.appendChild(button);
})();
