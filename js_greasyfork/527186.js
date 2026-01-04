// ==UserScript==
// @name         Copy YouTube Transcript 3
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Add a button to copy YouTube transcript to clipboard. Cần thêm điều kiện chỉ add nút ở trang phát video, thêm điều kiện đợi load transcript (nếu bấm được show thì đợi load), cần thêm điều kiện thoát khỏi lặp nếu như không tìm thấy transcript
// @author       lmdw
// @match        https://www.youtube.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/527186/Copy%20YouTube%20Transcript%203.user.js
// @updateURL https://update.greasyfork.org/scripts/527186/Copy%20YouTube%20Transcript%203.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Add button to the page
    function addButton() {
        // Check if the button already exists
        if (document.querySelector('#copy-transcript-button')) return;

        // Find the container for the button (below video player)
        const videoContainer = document.querySelector('#above-the-fold #title');

        if (!videoContainer) return;

        // Create the button
        const button = document.createElement('button');
        button.id = 'copy-transcript-button';
        button.textContent = 'Copy Transcript';
        button.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--outline yt-spec-button-shape-next--call-to-action yt-spec-button-shape-next--size-m';
        button.style.marginTop = '8px'; // Add slight spacing

        // Append the button to the container
        videoContainer.parentNode.insertBefore(button, videoContainer.nextSibling);

        // Add click event to the button
        button.addEventListener('click', handleTranscriptCopy);
    }

    // Handle transcript copy process
    async function handleTranscriptCopy() {
        await clickExpandDescription();
        await clickShowTranscript();

        const transcript = getTranscript();

        if (!transcript || transcript.length === 0) {
            alert('No transcript available for this video.');
            return;
        }

        // Use GM_setClipboard to copy to clipboard
        GM_setClipboard(transcript);

        alert('Transcript copied to clipboard!');
    }

    // Click the "More" button to expand description
    async function clickExpandDescription() {
        const expandButton = document.querySelector('#expand');
        if (expandButton) {
            expandButton.click();
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait for UI to update
        }
    }

    // Click the "Show Transcript" button
    async function clickShowTranscript() {
        const showTranscriptButton = document.querySelector("#primary-button > ytd-button-renderer > yt-button-shape > button");
        if (showTranscriptButton) {
            showTranscriptButton.click();
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for transcript to load
        }
    }

    // Fetch transcript text
    function getTranscript() {
        // Find the container for transcript segments
        const transcriptContainer = document.querySelector('#segments-container');

        if (!transcriptContainer) {
            return null;
        }

        // Collect all transcript lines
        const lines = Array.from(
            transcriptContainer.querySelectorAll('.segment-text')
        );

        // Extract and join text content
        return lines.map(line => line.textContent.trim()).join('\n');
    }

    // Observe changes to the page and add button dynamically
    const observer = new MutationObserver(addButton);
    observer.observe(document.body, { childList: true, subtree: true });
})();
