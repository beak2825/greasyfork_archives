// ==UserScript==
// @name         Shazam YouTube Search Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add YouTube search buttons to Shazam tracks
// @author       anar4732
// @match        https://www.shazam.com/tr/myshazam*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522441/Shazam%20YouTube%20Search%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/522441/Shazam%20YouTube%20Search%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create YouTube search URL
    function createYouTubeSearchURL(track, artist) {
        const searchQuery = encodeURIComponent(`${track} ${artist}`);
        return `https://www.youtube.com/results?search_query=${searchQuery}`;
    }

    // Function to create YouTube button
    function createYouTubeButton(track, artist) {
        const button = document.createElement('button');
        button.innerHTML = '▶ YouTube';
        button.style.cssText = `
            background-color: #FF0000;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            margin-left: 10px;
            cursor: pointer;
            font-size: 12px;
        `;

        button.addEventListener('click', (e) => {
            // Stop the event from bubbling up and triggering Shazam's click handler
            e.preventDefault();
            e.stopPropagation();

            // Open YouTube in a new tab
            window.open(createYouTubeSearchURL(track, artist), '_blank');

            // Return false to ensure the event is completely stopped
            return false;
        });

        return button;
    }

    // Function to add buttons to existing containers
    function addYouTubeButtons() {
        const containers = document.querySelectorAll('.titleArtistContainer');

        containers.forEach(container => {
            // Check if button already exists
            if (container.querySelector('.youtube-search-btn')) return;

            // Get track and artist information
            const titleElement = container.querySelector('.title a');
            const artistElement = container.querySelector('.artist a');

            if (titleElement && artistElement) {
                const track = titleElement.textContent.trim();
                const artist = artistElement.textContent.trim();

                const youtubeButton = createYouTubeButton(track, artist);
                youtubeButton.className = 'youtube-search-btn';

                // Add button to container
                container.appendChild(youtubeButton);
            }
        });
    }

    // Initial addition of buttons
    addYouTubeButtons();

    // Create an observer to watch for new tracks being added
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                addYouTubeButtons();
            }
        });
    });

    // Start observing the document for added nodes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();