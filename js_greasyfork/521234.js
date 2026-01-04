// ==UserScript==
// @name         Spotify Track Link Saver
// @namespace https://greasyfork.org/en/scripts/521234-spotify-track-link-saver
// @version      1.0.1
// @description  Saves the links of tracks from playlists and liked songs on Spotify.
// @author
// @match        https://open.spotify.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521234/Spotify%20Track%20Link%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/521234/Spotify%20Track%20Link%20Saver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let capturing = false;  // To track whether capturing is active or not

    // Create a container to display the buttons and the counter
    const createLinkContainer = () => {
        const container = document.createElement('div');
        container.id = 'spotify-link-container';
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.right = '10px';
        container.style.backgroundColor = '#2c2c2c';
        container.style.color = 'white';
        container.style.border = '1px solid #444';
        container.style.padding = '10px';
        container.style.zIndex = '10000';
        container.style.maxHeight = '200px';
        container.style.overflowY = 'auto';
        container.style.borderRadius = '8px';

        const title = document.createElement('div');
        title.textContent = 'Captured Links:';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '5px';

        const counter = document.createElement('div');
        counter.id = 'link-counter';
        counter.textContent = 'Total: 0';
        counter.style.marginBottom = '10px';

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save Links';
        saveButton.style.marginBottom = '10px';
        saveButton.style.backgroundColor = '#444';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.padding = '5px 10px';
        saveButton.style.borderRadius = '5px';
        saveButton.onclick = saveLinksToFile;
        saveButton.style.display = 'none';

        const startButton = document.createElement('button');
        startButton.textContent = capturing ? 'Save' : 'Start Capturing';
        startButton.style.marginBottom = '10px';
        startButton.style.backgroundColor = '#444';
        startButton.style.color = 'white';
        startButton.style.border = 'none';
        startButton.style.padding = '5px 10px';
        startButton.style.borderRadius = '5px';
        startButton.onclick = toggleCapture;

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';
        resetButton.style.backgroundColor = '#b33';
        resetButton.style.color = 'white';
        resetButton.style.border = 'none';
        resetButton.style.padding = '5px 10px';
        resetButton.style.borderRadius = '5px';
        resetButton.onclick = resetLinks;

        container.appendChild(title);
        container.appendChild(counter);
        container.appendChild(saveButton);
        container.appendChild(startButton);
        container.appendChild(resetButton);

        document.body.appendChild(container);

        window.startButton = startButton;
        window.saveButton = saveButton;
    };

    // Saves the links to a text file
    const saveLinksToFile = () => {
        const blob = new Blob([Array.from(capturedLinks).join('\n')], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'spotify_links.txt';
        link.click();
    };

    // Updates the link counter
    const updateLinkCounter = () => {
        const counter = document.getElementById('link-counter');
        if (counter) {
            counter.textContent = `Total: ${capturedLinks.size}`;
        }
    };

    // Observes changes on the page to capture links
    const observePage = () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0 && capturing) {
                    const links = getRelevantLinks();
                    links.forEach(link => {
                        const href = link.href;
                        if (!capturedLinks.has(href)) {
                            capturedLinks.add(href);
                            updateLinkCounter();
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // Resets the captured links and updates the UI
    const resetLinks = () => {
        capturedLinks.clear(); // Clears all links from the Set
        updateLinkCounter(); // Updates the counter to reflect the reset
        capturing = false; // Stops capturing
        window.startButton.textContent = 'Start Capturing'; // Reset button text
        window.startButton.style.display = 'block'; // Ensure start button is visible
        window.saveButton.style.display = 'none'; // Hide the save button
    };

    // Set of captured links to avoid duplicates
    const capturedLinks = new Set();

    // Toggles the capturing state
    const toggleCapture = () => {
        capturing = !capturing;
        const startButton = window.startButton;
        const saveButton = window.saveButton;
        if (capturing) {
            startButton.style.display = 'none'; // Hide the start button
            saveButton.style.display = 'block'; // Show the save button
            saveButton.textContent = 'Save';
            observePage(); // Start observing the page when capturing is active
        } else {
            startButton.textContent = 'Start Capturing'; // Revert button text to 'Start Capturing'
            saveButton.style.display = 'none'; // Hide the save button
            startButton.style.display = 'block'; // Show the start button again
        }
    };

    // Returns links relevant to the current page
    const getRelevantLinks = () => {
        const url = window.location.pathname;
        let links = [];

        if (url.startsWith('/playlist/')) {
            // Filter tracks only from the playlist, excluding recommendations
            const playlistContainer = document.querySelector('[data-testid="playlist-tracklist"]');
            if (playlistContainer) {
                links = playlistContainer.querySelectorAll('a[href*="/track/"]');
            }
        } else if (url.startsWith('/album/') || url.startsWith('/collection/tracks')) {

            links = document.querySelectorAll('a[href*="/track/"]');
        }

        return links;
    };

    // Initializes the container and sets up the initial button state
    createLinkContainer();
})();
