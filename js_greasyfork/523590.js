// ==UserScript==
// @name         WeChat Article URL Copier
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Simplify WeChat article URL and copy it to the clipboard with a notification
// @author       You
// @match        https://mp.weixin.qq.com/s*
// @grant        GM_setClipboard
// @license GNU 

// @downloadURL https://update.greasyfork.org/scripts/523590/WeChat%20Article%20URL%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/523590/WeChat%20Article%20URL%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the "Copy URL" button
    const button = document.createElement('button');
    button.innerText = 'Copy URL';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '10000';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // Button hover effect
    button.onmouseover = () => {
        button.style.backgroundColor = '#0056b3';
    };
    button.onmouseout = () => {
        button.style.backgroundColor = '#007bff';
    };

    // Create notification function
    const createNotification = (message) => {
        const notification = document.createElement('div');
        notification.innerText = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '10px';
        notification.style.right = '10px';
        notification.style.padding = '10px 15px';
        notification.style.backgroundColor = '#28a745';
        notification.style.color = '#fff';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        notification.style.zIndex = '10001';
        notification.style.fontSize = '14px';
        document.body.appendChild(notification);

        // Automatically remove the notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    };

    // Button click logic
    button.onclick = () => {
        const url = new URL(window.location.href); // Get the current URL
        const params = url.searchParams; // Extract URL parameters

        // Retrieve necessary parameters
        const biz = params.get('__biz');
        const mid = params.get('mid');
        const idx = params.get('idx');
        const sn = params.get('sn');

        if (biz && mid && idx && sn) {
            const simplifiedURL = `https://mp.weixin.qq.com/s?__biz=${biz}&mid=${mid}&idx=${idx}&sn=${sn}`;
            GM_setClipboard(simplifiedURL); // Copy the simplified URL to the clipboard
            createNotification(`URL copied: ${simplifiedURL}`);
        } else {
            createNotification('Unable to simplify the URL. Required parameters are missing.');
        }
    };

    // Append the button to the page
    document.body.appendChild(button);
})();
