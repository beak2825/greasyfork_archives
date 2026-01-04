// ==UserScript==
// @name         YouTube Transcript Copier
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Copy YouTube video transcripts with timestamps
// @author       You
// @match        https://www.youtube.com/watch*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483035/YouTube%20Transcript%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/483035/YouTube%20Transcript%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Tampermonkey script loaded: YouTube Transcript Copier'); // Log when the script is loaded

    // Function to create and insert the Copy Transcript button
    function insertCopyButton() {
        // Locate the "Show transcript" button
        const transcriptButtonSelector = '#primary-button > ytd-button-renderer > yt-button-shape > button';
        const showTranscriptButton = document.querySelector(transcriptButtonSelector);

        // Log whether the "Show transcript" button was found
        if (showTranscriptButton) {
            console.log('Found "Show transcript" button:', showTranscriptButton);
        } else {
            console.log('Could not find "Show transcript" button.');
            return; // Exit if the button is not found
        }

        // Create the Copy Transcript button
        const copyButton = document.createElement('button');
        copyButton.innerText = 'Copy Transcript';
        copyButton.id = 'copy-transcript-button';
        copyButton.style = 'margin-left: 8px;'; // Example style, you can customize it
        console.log('Copy Transcript button created:', copyButton); // Log the creation of the button

        // Insert the button next to the "Show transcript" button
        showTranscriptButton.parentNode.insertBefore(copyButton, showTranscriptButton.nextSibling);
        console.log('Copy Transcript button inserted into the page.'); // Log the insertion of the button

        // Add click event listener to the Copy Transcript button
        copyButton.addEventListener('click', function() {
            console.log('Copy Transcript button clicked.'); // Log the button click event
        
            // Click the "Show transcript" button to ensure transcript is visible
            showTranscriptButton.click();
            console.log('Show transcript button clicked programmatically.'); // Log the simulated click on the Show transcript button
        
            // Wait for the transcript to be visible
            const checkTranscriptVisible = setInterval(function() {
                // Select the transcript panel using the 'target-id' attribute
                const transcriptPanel = document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]');
        
                if (transcriptPanel && transcriptPanel.innerText.trim() !== '') {
                    clearInterval(checkTranscriptVisible);
                    console.log('Transcript panel found and loaded:', transcriptPanel); // Log the visibility and loading of the transcript panel
        
                    // Copy the transcript text to clipboard
                    GM_setClipboard(transcriptPanel.innerText, 'text');
                    console.log('Transcript copied to clipboard.'); // Log the copying of the transcript to the clipboard
        
                    // Show notification
                    alert('Transcript copied to clipboard!');
                } else {
                    console.log('Waiting for transcript panel to load...'); // Log the waiting for the transcript panel to load
                }
            }, 500);
        }); 
    }

    // Insert the Copy Transcript button when the page is loaded and ready
    window.addEventListener('load', function() {
        console.log('Page loaded. Attempting to insert Copy Transcript button...'); // Log the page load event
        insertCopyButton();
    });
})();
