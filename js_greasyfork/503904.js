// ==UserScript==
// @name         Scat.Gold Doodstream Copy Button
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a button to copy the Doodstream link (first) and then the page title (after delay) on scat.gold
// @author       Your Name
// @match        *://scat.gold/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503904/ScatGold%20Doodstream%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/503904/ScatGold%20Doodstream%20Copy%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
        .copy-dood-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.3s;
        }

        .copy-dood-btn:hover {
            background-color: #45a049;
        }

        .copy-dood-btn.success {
            background-color: #45a049;
        }

        .copy-dood-btn.error {
            background-color: #f44336;
        }

        .copy-notification {
            position: fixed;
            top: 70px;
            right: 20px;
            padding: 10px 20px;
            border-radius: 5px;
            color: white;
            z-index: 9999;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .copy-notification.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // Add button
    const button = document.createElement('button');
    button.className = 'copy-dood-btn';
    button.textContent = 'Copy Doodstream';
    document.body.appendChild(button);

    // Add notification
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    document.body.appendChild(notification);

    function showNotification(message, isSuccess) {
        notification.textContent = message;
        notification.style.backgroundColor = isSuccess ? '#4CAF50' : '#f44336';
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }

    function findDoodstreamIframe() {
        const doodHeading = Array.from(document.getElementsByClassName('tabtitle')).find(heading =>
            heading.textContent.toLowerCase().includes('doodstream')
        );

        if (doodHeading) {
            let currentElement = doodHeading;
            while (currentElement && !currentElement.classList.contains('tabcontent')) {
                currentElement = currentElement.nextElementSibling;
            }

            if (currentElement) {
                return currentElement.querySelector('iframe');
            }
        }

        return document.querySelector('iframe[src*="dood"], iframe[src*="d0o0d"], iframe[src*="ds2play"]');
    }

    button.addEventListener('click', () => {
        try {
            const iframe = findDoodstreamIframe();

            if (iframe && iframe.src) {
                // Copy link immediately
                GM_setClipboard(iframe.src);
                button.classList.add('success');
                showNotification('Link copied!', true);
                setTimeout(() => button.classList.remove('success'), 1000);

                // After 1 second, overwrite with link + title
                setTimeout(() => {
                    const pageTitle = document.title;
                    GM_setClipboard(pageTitle);
                }, 1000);
            } else {
                button.classList.add('error');
                showNotification('No Doodstream link found', false);
                setTimeout(() => button.classList.remove('error'), 1000);
            }
        } catch (error) {
            button.classList.add('error');
            showNotification('An error occurred', false);
            setTimeout(() => button.classList.remove('error'), 1000);
        }
    });
})();
