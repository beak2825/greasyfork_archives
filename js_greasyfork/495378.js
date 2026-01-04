// ==UserScript==
// @name         Copy Song Titles on Bandcamp
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Copies the song title when clicking on the track number on Bandcamp and shows a non-intrusive pop-up notification that disappears after 2 seconds.
// @author       Fri
// @match        *://*.bandcamp.com/album/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495378/Copy%20Song%20Titles%20on%20Bandcamp.user.js
// @updateURL https://update.greasyfork.org/scripts/495378/Copy%20Song%20Titles%20on%20Bandcamp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the script is loading
    console.log('Tampermonkey script loaded.');

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        console.log(`Copying to clipboard: ${text}`);
        const tempInput = document.createElement('input');
        document.body.appendChild(tempInput);
        tempInput.value = text;
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }

    // Function to show a temporary pop-up notification
    function showPopup(message) {
        const popup = document.createElement('div');
        popup.textContent = message;
        popup.style.position = 'fixed';
        popup.style.bottom = '10px';
        popup.style.right = '10px';
        popup.style.padding = '10px';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        popup.style.color = 'white';
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '1000';
        document.body.appendChild(popup);

        setTimeout(() => {
            popup.remove();
        }, 2000); // Remove pop-up after 2 seconds
    }

    // Function to handle click on the track number
    function handleTrackNumberClick(event) {
        const trackRow = event.target.closest('tr');
        console.log('Track row:', trackRow);
        if (trackRow) {
            const titleElement = trackRow.querySelector('.track-title');
            console.log('Title element:', titleElement);
            if (titleElement) {
                const title = titleElement.textContent.trim();
                copyToClipboard(title);
                showPopup(`Song title copied: ${title}`);
            }
        }
    }

    // Wait a brief moment to ensure the DOM is fully loaded
    setTimeout(() => {
        console.log('Waiting for the DOM to fully load.');

        // Get all elements with the class 'track_number'
        const trackNumbers = document.querySelectorAll('.track_number');
        console.log('Track numbers found:', trackNumbers);

        // Add a click event listener to each element
        trackNumbers.forEach(trackNumber => {
            trackNumber.style.cursor = 'pointer'; // Change the cursor to indicate it's clickable
            trackNumber.addEventListener('click', handleTrackNumberClick);
        });

        console.log('Click listeners added to track numbers.');
    }, 2000); // Wait 2 seconds
})();
