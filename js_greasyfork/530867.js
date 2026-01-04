// ==UserScript==
// @name         ChatGPT Image Upload Enabler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Attempt to enable image uploads on ChatGPT without Plus.
// @author       YourName
// @match        https://chatgpt.com/*
// @icon         https://chatgpt.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530867/ChatGPT%20Image%20Upload%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/530867/ChatGPT%20Image%20Upload%20Enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function enableImageUpload() {
        const chatInputArea = document.querySelector('textarea');
        if (!chatInputArea) return;

        // Create an image upload button
        const uploadButton = document.createElement('input');
        uploadButton.type = 'file';
        uploadButton.accept = 'image/*';
        uploadButton.style.margin = '10px';

        uploadButton.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                alert(`Selected image: ${file.name}`);

                // Placeholder action - real uploads require API access
                console.log('Image selected:', file);
            }
        });

        // Insert the upload button before the input area
        chatInputArea.parentNode.insertBefore(uploadButton, chatInputArea);
    }

    // Observe page for dynamic changes
    const observer = new MutationObserver(() => {
        if (!document.querySelector('input[type="file"]')) {
            enableImageUpload();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    enableImageUpload();
})();
