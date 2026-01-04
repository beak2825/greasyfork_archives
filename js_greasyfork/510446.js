// ==UserScript==
// @name Download Audio from Clipboard
// @namespace http://tampermonkey.net/
// @version 0.2
// @description Download the audio file from the clipboard JSON data if available
// @author You
// @match https://app.myshell.ai/robot-workshop/widget*
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/510446/Download%20Audio%20from%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/510446/Download%20Audio%20from%20Clipboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('URL copied to clipboard:', text);
            })
            .catch((error) => {
                console.error('Error copying URL to clipboard:', error);
            });
    }

    document.addEventListener('click', async () => {
        try {
            const clipboardData = await navigator.clipboard.readText();
            const jsonData = JSON.parse(clipboardData);
            let urlToCopy = '';

            if (jsonData) {
                if (jsonData.audio_url) {
                    urlToCopy = jsonData.audio_url;
                } else if (jsonData.url) {
                    urlToCopy = jsonData.url;
                }

                if (urlToCopy) {
                    copyToClipboard(urlToCopy);
                } else {
                    console.error('No audio_url or url found in the JSON data.');
                }
            } else {
                console.error('Invalid JSON data in clipboard.');
            }
        } catch (error) {
            console.error('Error reading JSON data from clipboard:', error);
        }
    });
})();