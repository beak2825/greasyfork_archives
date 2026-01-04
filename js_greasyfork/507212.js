// ==UserScript==
// @name Download Audio from Clipboard
// @namespace http://tampermonkey.net/
// @version 0.1
// @description Download the audio file from the clipboard JSON data if available
// @author You
// @match https://app.myshell.ai/robot-workshop/widget*
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/507212/Download%20Audio%20from%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/507212/Download%20Audio%20from%20Clipboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const downloadedUrls = new Set(); // Хранит уже скачанные URL

    async function downloadAudioWithoutOpening(audioUrl) {
        try {
            const response = await fetch('/proxy?url=' + encodeURIComponent(audioUrl));
            const blob = await response.blob();

            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = audioUrl.split('/').pop();
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();

            URL.revokeObjectURL(url);
            downloadedUrls.add(audioUrl); // Добавляем URL в список скачанных
        } catch (error) {
            console.error('Failed to download the audio file:', error);
        }
    }

    function extractAudioUrlAndDownloadWithoutOpening(jsonData) {
        if (jsonData && jsonData.audio_url && !downloadedUrls.has(jsonData.audio_url)) {
            console.log('Initiating download of audio file...');
            downloadAudioWithoutOpening(jsonData.audio_url);
        }
    }

    document.addEventListener('click', async () => {
        try {
            const clipboardData = await navigator.clipboard.readText();
            const jsonData = JSON.parse(clipboardData);
            extractAudioUrlAndDownloadWithoutOpening(jsonData);
        } catch (error) {
            console.error('Error reading JSON data from clipboard:', error);
        }
    });
})();