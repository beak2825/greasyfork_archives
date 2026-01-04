// ==UserScript==
// @name         Copy Lyrics Button
// @namespace    Violentmonkey Scripts
// @version      1.3
// @description  Adds a button to copy lyrics with one click on lyrics.lyricfind.com
// @author       low_mist
// @match        https://lyrics.lyricfind.com/lyrics/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505891/Copy%20Lyrics%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/505891/Copy%20Lyrics%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to copy lyrics
    function copyLyrics() {
        // Find all divs with the data-testid attribute equal to 'lyrics.lyricLine'
        const lyricsDivs = document.querySelectorAll('div[data-testid="lyrics.lyricLine"]');

        // Extract and join the lyrics text
        let lyrics = Array.from(lyricsDivs).map(div => div.innerText).join('\n');

        // Replace multiple newlines with a single newline
        lyrics = lyrics.replace(/\n\s*\n/g, '\n\n');

        // Copy the lyrics to the clipboard
        navigator.clipboard.writeText(lyrics).then(() => {
            showNotification('Lyrics copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy lyrics: ', err);
        });
    }

    // Function to show a small fading notification
    function showNotification(message) {
        // Create a notification div
        const notification = document.createElement('div');
        notification.innerText = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.backgroundColor = '#28a745';
        notification.style.color = '#ffffff';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        notification.style.zIndex = 1000;
        notification.style.opacity = 1;
        notification.style.transition = 'opacity 1s ease-out';

        // Append notification to the body
        document.body.appendChild(notification);

        // Fade out and remove notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = 0;
            setTimeout(() => {
                notification.remove();
            }, 1000);
        }, 2000);
    }

    // Create a new button element
    const button = document.createElement('button');
    button.innerText = 'Copy Lyrics';
    button.style.position = 'fixed';
    button.style.bottom = '10px'; // Position at the bottom
    button.style.right = '10px'; // Position at the right
    button.style.zIndex = 1000;
    button.style.padding = '10px';
    button.style.backgroundColor = '#007BFF';
    button.style.color = '#FFFFFF';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // Add event listener to the button
    button.addEventListener('click', copyLyrics);

    // Append the button to the body
    document.body.appendChild(button);
})();
