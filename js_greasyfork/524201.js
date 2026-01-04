// ==UserScript==
// @name         Pastebin Paste Auto Submit with Clipboard Permission
// @namespace    fiverr.com/web_coder_nsd
// @version      1.3
// @description  Automatically paste clipboard content and submit it on dpaste Pastebin, retrying if clipboard permission is denied.
// @author       NoushadBug
// @match        https://dpaste.org/?autopaste=true
// @icon         https://dpaste.org/static/favicon.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524201/Pastebin%20Paste%20Auto%20Submit%20with%20Clipboard%20Permission.user.js
// @updateURL https://update.greasyfork.org/scripts/524201/Pastebin%20Paste%20Auto%20Submit%20with%20Clipboard%20Permission.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    async function handleClipboard() {
        try {
            // Request permission for clipboard read if not granted
            const permissionStatus = await navigator.permissions.query({ name: 'clipboard-read' });
            if (permissionStatus.state === 'denied') {
                console.warn('Clipboard read access is denied. Requesting access...');
                alert('Clipboard read access is required. Please allow it in your browser settings.');
                return; // Exit if access is denied
            }

            // Get clipboard content
            const clipboardText = await navigator.clipboard.readText();
            console.log('Clipboard content retrieved:', clipboardText);

            document.querySelector('[name="expires"]').value='2592000'

            // Find the textarea and set its value
            const textarea = document.querySelector('textarea');
            if (textarea) {
                textarea.value = clipboardText;
                console.log('Pasted clipboard content into the textarea.');
            } else {
                console.error('Textarea not found on the page.');
                return;
            }

            // Find and click the submit button
            const submitButton = document.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.click();
                console.log('Clicked the submit button.');
            } else {
                console.error('Submit button not found on the page.');
            }
        } catch (error) {
            console.error('Error handling clipboard or interacting with the page:', error);
        }
    }

    // Trigger clipboard handling once the page loads
    window.addEventListener('load', async () => {
        try {
            await handleClipboard();
        } catch (error) {
            console.error('An error occurred while attempting to process the clipboard:', error);
        }
    });
})();
