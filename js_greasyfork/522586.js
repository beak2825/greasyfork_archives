// ==UserScript==
// @name         MediaWiki Title Copy
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Adds a copy icon next to the title to copy it to the clipboard.
// @author       Shou Ya
// @match        https://*.wikipedia.org/wiki/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/522586/MediaWiki%20Title%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/522586/MediaWiki%20Title%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to handle clipboard copy
    function copyToClipboard(text) {
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(text);
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
        } else {
            console.error("Clipboard API not available");
            alert("Clipboard copy failed. Your browser may not support this feature.");
            return false;
        }

        showNotification();
        return true;
    }

    // Function to show notification
    function showNotification() {
        let notification = document.createElement('div');
        notification.textContent = 'Copied!';
        notification.classList.add('copy-notification');
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 1500);
    }

    // Get the title element
    const titleElement = document.querySelector('#firstHeading');

    if (!titleElement) {
        console.warn("Wikipedia title element not found.");
        return;
    }

    // SVG icon code
    const svgIcon = `
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
    </svg>
`;

    // Create the copy icon
    const copyIcon = document.createElement('span');
    copyIcon.innerHTML = svgIcon;
    copyIcon.classList.add('copy-icon');
    copyIcon.title = "Copy title to clipboard";
    titleElement.parentNode.insertBefore(copyIcon, titleElement.nextSibling);

    // Add click event listener
    copyIcon.addEventListener('click', function() {
        const titleText = titleElement.textContent.trim();
        copyToClipboard(titleText);
    });

    // Add CSS for the icon and notification
    GM_addStyle(`
        .copy-icon {
            cursor: pointer;
            margin-left: 5px;
            display: inline-flex; /* For flex alignment */
            align-items: center; /* Vertically center the SVG */
        }

        .copy-notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
        }
    `);
})();