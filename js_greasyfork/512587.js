// ==UserScript==
// @name         YouTube transcript for Tana with Timestamps
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Copy YouTube video transcripts with timestamps formatted for Tana
// @author       Santi Younger
// @match        https://www.youtube.com/watch*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512587/YouTube%20transcript%20for%20Tana%20with%20Timestamps.user.js
// @updateURL https://update.greasyfork.org/scripts/512587/YouTube%20transcript%20for%20Tana%20with%20Timestamps.meta.js
// ==/UserScript==

/* 
   Attribution:
   This script is based on the original "YouTube Transcript Copier" by Time Eternity, 
   which is licensed under the MIT License.
   Modifications have been made to include Tana-specific formatting, fixes and additional features.

   Licensed under the MIT License:

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in
   all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   THE SOFTWARE.
*/

(function() {
    'use strict';

    console.log('Tampermonkey script loaded: YouTube transcript for Tana with Timestamps'); // Log when the script is loaded

    // Function to create and insert the Copy Transcript button
    function insertCopyButton() {
        const transcriptButtonSelector = '#primary-button > ytd-button-renderer > yt-button-shape > button';
        const showTranscriptButton = document.querySelector(transcriptButtonSelector);

        if (showTranscriptButton) {
            console.log('Found "Show transcript" button:', showTranscriptButton);
        } else {
            console.log('Could not find "Show transcript" button.');
            return; // Exit if the button is not found
        }

        const copyButton = document.createElement('button');
        copyButton.innerText = 'Copy Transcript';
        copyButton.id = 'copy-transcript-button';
        copyButton.style = 'margin-left: 8px;';
        console.log('Copy Transcript button created:', copyButton);

        showTranscriptButton.parentNode.insertBefore(copyButton, showTranscriptButton.nextSibling);
        console.log('Copy Transcript button inserted into the page.');

        copyButton.addEventListener('click', copyTranscript);
    }

    // Function to handle the transcript copying process
    function copyTranscript() {
        console.log('Copy Transcript button clicked.');

        const showTranscriptButton = document.querySelector('#primary-button > ytd-button-renderer > yt-button-shape > button');
        showTranscriptButton.click();
        console.log('Show transcript button clicked programmatically.');

        const checkTranscriptVisible = setInterval(function() {
            const transcriptPanel = document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]');

            if (transcriptPanel && transcriptPanel.innerText.trim() !== '') {
                clearInterval(checkTranscriptVisible);
                console.log('Transcript panel found and loaded:', transcriptPanel);

                // Process and format the transcript
                const videoId = new URL(window.location.href).searchParams.get('v');
                const baseVideoUrl = `https://youtu.be/${videoId}?t=`;

              const formattedTranscript = '%%tana%%\n' + transcriptPanel.innerText.split('\n').map((line, index, lines) => {
                  const timestampMatch = line.match(/(\d{1,2}:\d{2}:\d{2}|\d{1,2}:\d{2})/);
                  if (timestampMatch && lines[index + 1]) {
                      const timestamp = timestampMatch[1];
                      const timeInSeconds = parseTimestamp(timestamp);
                      return `- [${timestamp}](${baseVideoUrl}${timeInSeconds}) - ${lines[index + 1]}`;
                  }
              }).filter(Boolean).join('\n').trim();


                GM_setClipboard(formattedTranscript, 'text');
                console.log('Transcript copied to clipboard in Tana Paste format.');
                alert('Transcript copied to clipboard in Tana Paste format!');
            } else {
                console.log('Waiting for transcript panel to load...');
            }
        }, 500);
    }

    // Updated function to parse timestamp to seconds, accounting for hours
    function parseTimestamp(timestamp) {
        const parts = timestamp.split(':').map(Number);
        if (parts.length === 3) {
            // If the timestamp includes hours (e.g., 1:05:32)
            const [hours, minutes, seconds] = parts;
            return hours * 3600 + minutes * 60 + seconds;
        } else if (parts.length === 2) {
            // If the timestamp includes only minutes and seconds (e.g., 05:32)
            const [minutes, seconds] = parts;
            return minutes * 60 + seconds;
        }
        return 0; // Default return in case the format is unexpected
    }

    window.addEventListener('keydown', function(event) {
        if (event.shiftKey && event.key === 'A') {
            console.log('Shift+A keyboard shortcut triggered.');
            copyTranscript();
        }
    });

    window.addEventListener('load', function() {
        console.log('Page loaded. Attempting to insert Copy Transcript button...');
        insertCopyButton();
    });
})();
