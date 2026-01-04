// ==UserScript==
// @name         Newgrounds Open Audio and Copy URL
// @namespace    http://tampermonkey.net/
// @version      2025-08-25
// @description  Opens audio link from og:audio meta tag and copies to clipboard
// @author       YouTubeDrawaria
// @match        https://www.newgrounds.com/audio/listen/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=newgrounds.com
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547178/Newgrounds%20Open%20Audio%20and%20Copy%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/547178/Newgrounds%20Open%20Audio%20and%20Copy%20URL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the document to be fully loaded
    window.addEventListener('load', function() {
        const audioUrl = document.querySelector('meta[property="og:audio"]').getAttribute('content');

        if (audioUrl) {
            const button = document.createElement('button');
            button.textContent = 'Open Audio and Copy URL';
            button.style.position = 'fixed';
            button.style.bottom = '10px';
            button.style.left = '10px';
            button.style.zIndex = '10000';
            button.style.padding = '10px';
            button.style.backgroundColor = '#f0f0f0';
            button.style.border = '1px solid #ccc';
            button.style.cursor = 'pointer';

            button.addEventListener('click', async () => {
                // Open in new window
                window.open(audioUrl, '_blank');

                // Copy to clipboard using Tampermonkey's GM_setClipboard
                if (typeof GM_setClipboard !== 'undefined') {
                    GM_setClipboard(audioUrl);
                    console.log('Audio URL copied to clipboard using GM_setClipboard:', audioUrl);
                } else {
                    // Fallback for standard clipboard API if GM_setClipboard is not available
                    try {
                        await navigator.clipboard.writeText(audioUrl);
                        console.log('Audio URL copied to clipboard using navigator.clipboard:', audioUrl);
                    } catch (err) {
                        console.error('Failed to copy audio URL:', err);
                    }
                }
            });

            document.body.appendChild(button);
        } else {
            console.error('Could not find the audio URL in the meta tag.');
        }
    });
})();
