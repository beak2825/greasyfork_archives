// ==UserScript==
// @name         Drag link to Copy
// @namespace    Violentmonkey Scripts
// @version      0.6
// @description  Copy link information based on drag direction
// @match        http://*/*
// @match        https://*/*
// @grant        GM_setClipboard
// @author       ngtuan.vn28@gmail.com
// @license      MIT
// @icon         https://cdn-icons-png.freepik.com/512/96/96958.png
// @downloadURL https://update.greasyfork.org/scripts/501187/Drag%20link%20to%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/501187/Drag%20link%20to%20Copy.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let startX, startY, isDragging = false;
    let selectedLink = null;
    let notificationTimeout;

    document.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        startY = e.clientY;
        isDragging = true;
        let element = e.target;
        while (element && element !== document.body) {
            if (element.tagName.toLowerCase() === 'a') {
                selectedLink = element;
                break;
            }
            element = element.parentNode;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging || !selectedLink) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // Only perform actions if drag distance is at least 20px
        if (Math.abs(deltaX) > 60 || Math.abs(deltaY) > 60) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal movement
                if (deltaX > 0) {
                    copyAsClickableLink(selectedLink);
                } else {
                    copyAsHtmlLink(selectedLink);
                }
            } else {
                // Vertical movement
                if (deltaY > 0) {
                    copyUrl(selectedLink);
                } else {
                    copyLinkText(selectedLink);
                }
            }
            isDragging = false; // Stop dragging once action is performed
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        selectedLink = null;
    });

    function copyAsClickableLink(link) {
        const linkText = link.textContent.trim();
        const url = link.href;

        // Create a URL with clickable text
        const clickableLink = `<a href="${url}">${linkText}</a>`;

        // Set the clipboard content as the formatted clickable link
        GM_setClipboard(clickableLink, 'text/html');
        showNotification('Copied as clickable link');
    }

    function copyAsHtmlLink(link) {
        const linkText = link.textContent.trim();
        const url = link.href;
        const htmlLink = `<a href="${url}">${linkText}</a>`;
        copyToClipboard(htmlLink);
        showNotification('Copied as HTML link');
    }

    function copyUrl(link) {
        copyToClipboard(link.href);
        showNotification('Copied URL');
    }

    function copyLinkText(link) {
        copyToClipboard(link.textContent.trim());
        showNotification('Copied link text');
    }

    function copyToClipboard(text, type = 'text/plain') {
        GM_setClipboard(text, type);
        console.log('Text copied to clipboard');
    }

    function showNotification(message) {
        clearTimeout(notificationTimeout);
        let notification = document.getElementById('drag-copy-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'drag-copy-notification';
            notification.style.cssText = `
                position: fixed;
                top: 40px;
                right: 10px;
                background-color: #1E90FF ;
                color: white;
                padding: 7px 12px 7px 12px;
                border-radius: 5px;
                z-index: 9999;
                font-family: Arial, sans-serif;
            `;
            document.body.appendChild(notification);
        }
        notification.textContent = message;
        notification.style.display = 'block';
        notificationTimeout = setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
    }
})();
