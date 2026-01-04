// ==UserScript==
// @name         Copy URL
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Copy a site's URL with a floating icon and a native context menu shortcut.
// @author       Earth1283
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536699/Copy%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/536699/Copy%20URL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Style that floating window
    GM_addStyle(`
        /* Floating Clipboard Icon */
        #url-clipboard-icon {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 48px; /* Small size */
            height: 48px;
            background-color: #3498db; /* Blue background */
            color: #ffffff; /* White text/icon */
            border-radius: 50%; /* Circular shape */
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Inter', sans-serif; /* Modern font */
            font-size: 24px; /* Icon size */
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow */
            transition: background-color 0.3s ease, transform 0.1s ease; /* Smooth transitions */
            z-index: 9999; /* Ensure it's on top */
            user-select: none; /* Prevent text selection */
        }

        #url-clipboard-icon:hover {
            transform: scale(1.05); /* Slight scale on hover */
        }

        #url-clipboard-icon.copied {
            background-color: #2ecc71; /* Green background when copied */
        }

        /* Basic clipboard icon using a common unicode character */
        #url-clipboard-icon::before {
            content: '📋'; /* Clipboard emoji */
            display: block;
            line-height: 1; /* Adjust line height for vertical centering */
        }

        /* Checkmark icon using a common unicode character */
        #url-clipboard-icon.copied::before {
            content: '✅'; /* Checkmark emoji */
        }

        /* Confirmation Balloon Message */
        #clipboard-balloon {
            position: fixed;
            bottom: 80px; /* Position above the icon */
            right: 20px;
            background-color: #333; /* Dark background for the balloon */
            color: #ffffff; /* White text */
            padding: 8px 12px;
            border-radius: 8px; /* Rounded corners for the balloon */
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            opacity: 0; /* Start hidden */
            visibility: hidden; /* Start hidden */
            transition: opacity 0.3s ease, visibility 0.3s ease; /* Smooth fade in/out */
            z-index: 9998; /* Below the icon but above page content */
            white-space: nowrap; /* Prevent text wrapping */
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        #clipboard-balloon.show {
            opacity: 1; /* Fade in */
            visibility: visible; /* Make visible */
        }
    `);

    // --- DOM Element Creation ---

    // Floating Clipboard Icon
    const clipboardIcon = document.createElement('div');
    clipboardIcon.id = 'url-clipboard-icon';
    document.body.appendChild(clipboardIcon);

    // Confirmation Balloon Message
    const clipboardBalloon = document.createElement('div');
    clipboardBalloon.id = 'clipboard-balloon';
    document.body.appendChild(clipboardBalloon);

    // --- Helper Functions ---

    /**
     * Copies the current URL to the clipboard and shows visual feedback.
     */
    function copyCurrentUrl() {
        const url = window.location.href;

        // Create a temporary textarea to copy the URL
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = url;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                // Animate the floating icon to show success
                clipboardIcon.classList.add('copied');

                // Show the balloon message
                clipboardBalloon.textContent = '✅ Copied!';
                clipboardBalloon.classList.add('show');

                // Revert icon after 1.5 seconds
                setTimeout(() => {
                    clipboardIcon.classList.remove('copied');
                }, 1500);

                // Hide balloon after 1.5 seconds
                setTimeout(() => {
                    clipboardBalloon.classList.remove('show');
                }, 1500);
            } else {
                console.error('Failed to copy URL using document.execCommand.');
            }
        } catch (err) {
            console.error('Error copying URL:', err);
        } finally {
            // Clean up the temporary textarea
            document.body.removeChild(tempTextArea);
        }
    }

    // --- Event Listeners ---

    // Floating icon click listener
    clipboardIcon.addEventListener('click', copyCurrentUrl);

    // Register a menu command for the native browser context menu
    // The 'GM_registerMenuCommand' function is provided by Tampermonkey/Greasemonkey.
    // Not sure of any other compatibility
    // It adds an item to the browser's native context menu when the script is active.
    // The first argument is the text that will appear in the context menu.
    GM_registerMenuCommand('📋 Copy Current URL', copyCurrentUrl);

})();
