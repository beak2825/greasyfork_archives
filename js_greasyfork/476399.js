// ==UserScript==
// @name         osu! QuickPaste Image to BBCode
// @namespace    https://osu.ppy.sh/users/24332734
// @version      1.0
// @description  Automatically pastes BBCode image links in any textarea on osu! website when you use Ctrl V and an image is in the clipboard.
// @author       Behrauder
// @match        https://osu.ppy.sh/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476399/osu%21%20QuickPaste%20Image%20to%20BBCode.user.js
// @updateURL https://update.greasyfork.org/scripts/476399/osu%21%20QuickPaste%20Image%20to%20BBCode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = 'YOUR_API_KEY_HERE'; // Put your imgbb API key here

    // Listen to the "paste" event on the document
    document.addEventListener('paste', async function(e) {
        const clipboardData = e.clipboardData || window.clipboardData;
        const items = clipboardData.items;

        for (const item of items) {
            if (item.type.startsWith('image')) {
                const blob = item.getAsFile();
                const formData = new FormData();
                formData.append('image', blob);
                formData.append('key', API_KEY);
                formData.append('expiration', 0); // Never expire

                // Upload the image
                const response = await fetch('https://api.imgbb.com/1/upload', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                if (data.success) {
                    const bbcodeFull = `[img]${data.data.url}[/img]`;
                    insertTextAtCursor(bbcodeFull);
                } else {
                    console.error('Upload failed:', data.status_txt);
                }
                break; // Exit the loop after the first image item
            }
        }
    });

    // Function to insert text at the cursor position in a textarea
    function insertTextAtCursor(text) {
        const textarea = document.activeElement;
        if (textarea.tagName === 'TEXTAREA') {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            const value = textarea.value;
            textarea.value = value.substring(0, start) + text + value.substring(end);

            textarea.selectionStart = textarea.selectionEnd = start + text.length;
        }
    }
})();
