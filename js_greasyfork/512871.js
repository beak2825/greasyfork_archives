// ==UserScript==
// @name         Pixiv Artwork Opener (Tampermonkey)
// @namespace    https://github.com/Koishi0425/chrome-extension-Pixiv-Artwork-Opener
// @version      1.2
// @description  自动读取剪切板打开Pixiv作品。/ Prompt user to open Pixiv artwork from clipboard.
// @author       Glamorgan
// @match        https://www.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512871/Pixiv%20Artwork%20Opener%20%28Tampermonkey%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512871/Pixiv%20Artwork%20Opener%20%28Tampermonkey%29.meta.js
// ==/UserScript==

let clipboardChecked = false;

(async function() {
    'use strict';

    // 检查是否已经读取过剪贴板
    if (clipboardChecked) return;

    clipboardChecked = true;

    // Function to get clipboard content with error notification
    async function getClipboardText() {
        try {
            const text = await navigator.clipboard.readText();
            return text;
        } catch (err) {
            GM_notification({
                title: "Pixiv Artwork Opener",
                text: "Failed to read clipboard contents.",
                timeout: 4000,
                onclick: () => { window.focus(); }
            });
            console.error('Failed to read clipboard contents: ', err);
            return null;
        }
    }

    // Function to validate if the text is 8 or 9 digit number or a valid Pixiv URL
    function isValidPixivId(text) {
        const idRegex = /^\d{8,9}$/;
        const urlRegex = /pixiv\.net\/artworks\/(\d{8,9})/;
        if (idRegex.test(text)) {
            return text;
        } else if (urlRegex.test(text)) {
            return text.match(urlRegex)[1];
        }
        return null;
    }

    // Function to create a custom confirmation dialog
    function showConfirmationDialog(artworkId, callback) {
        // Create overlay
        const overlay = document.createElement('div');
        const overlayStyles = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.5s;
        `;
        overlay.style.cssText = overlayStyles;

        // Create dialog box
        const dialog = document.createElement('div');
        const dialogStyles = `
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            width: 300px;
            color: black;
        `;
        dialog.style.cssText = dialogStyles;

        // Add content to the dialog
        dialog.innerHTML = `
            <h3 style="margin-bottom: 10px; color: black;">Pixiv Artwork Detected</h3>
            <p style="margin-bottom: 20px; color: black;">We found an Artwork ID: <strong>${artworkId}</strong>. Would you like to open it?</p>
            <button id="confirm-btn" style="padding: 5px 10px; margin-right: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px;">Yes</button>
            <button id="cancel-btn" style="padding: 5px 10px; background-color: #f44336; color: white; border: none; border-radius: 4px;">No</button>
        `;

        // Append the dialog to the overlay
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Add event listeners to the buttons
        document.getElementById('confirm-btn').addEventListener('click', function() {
            callback(true);
            overlay.style.animation = "fadeOut 0.5s";
            setTimeout(() => document.body.removeChild(overlay), 500);
        });

        document.getElementById('cancel-btn').addEventListener('click', function() {
            callback(false);
            overlay.style.animation = "fadeOut 0.5s";
            setTimeout(() => document.body.removeChild(overlay), 500);
        });
    }

    // Function to check if URL contains specific parameter
    function hasUrlParameter(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.has(param);
    }

    // Main logic to prevent duplicate detection using URL parameters
    if (!hasUrlParameter('from_clipboard')) {
        setTimeout(async () => {
            const text = await getClipboardText();
            const pixivId = isValidPixivId(text);
            if (pixivId) {
                // Show custom dialog
                showConfirmationDialog(pixivId, function(confirmed) {
                    if (confirmed) {
                        // Append a parameter to avoid future clipboard detection
                        const pixivUrl = `https://www.pixiv.net/artworks/${pixivId}?from_clipboard=true`;
                        window.location.href = pixivUrl;
                    }
                });
            }
        }, 500);
    }
})();

// CSS for fade-in and fade-out animations
GM_addStyle(`
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`);
