// ==UserScript==
// @name         Add "Find on Spotify" Button to LINE Music Charts
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a button to find the song on Spotify on the LINE Music website.
// @match        https://music.line.me/*
// @author       Forkinthe.net
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496058/Add%20%22Find%20on%20Spotify%22%20Button%20to%20LINE%20Music%20Charts.user.js
// @updateURL https://update.greasyfork.org/scripts/496058/Add%20%22Find%20on%20Spotify%22%20Button%20to%20LINE%20Music%20Charts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createSpotifyButton(songTitle, artistName) {
        let btn = document.createElement('button');
        btn.innerText = 'Find on Spotify';
        btn.style.marginLeft = '10px';
        btn.style.backgroundColor = '#00c55e';
        btn.style.border = '1px solid #00c55e';
        btn.style.color = '#fff';
        btn.style.display = 'inline-block';
        btn.style.borderRadius = '4px';
        btn.style.fontSize = '15px';
        btn.style.lineHeight = '20px';
        btn.style.verticalAlign = 'top';
        btn.style.textAlign = 'center';
        btn.style.cursor = 'pointer';
        btn.onclick = function() {
            let query = encodeURIComponent(`${songTitle} ${artistName}`);
            window.open(`https://open.spotify.com/search/${query}`, '_blank');
        };
        return btn;
    }

    function addSpotifyButtons() {
        let tracklist = document.querySelector('.tracklist');
        if (!tracklist) {
            console.log('Tracklist not found.');
            return;
        }

        let rows = tracklist.getElementsByTagName('tr');
        console.log(`Found ${rows.length} rows.`);
        for (let row of rows) {
            // Remove existing Spotify button cells
            let existingButtonCell = row.querySelector('.spotify-button-cell');
            if (existingButtonCell) {
                existingButtonCell.remove();
            }

            let songCell = row.querySelector('.song');
            let artistCell = row.querySelector('.artist');

            if (songCell && artistCell) {
                let songLink = songCell.querySelector('a.link_text');
                let songTitle = songLink ? songLink.title.trim() : null;
                let artistName = artistCell.title.trim();

                if (songTitle && artistName) {
                    console.log(`Adding button for: ${songTitle} by ${artistName}`);

                    let spotifyButton = createSpotifyButton(songTitle, artistName);
                    spotifyButton.classList.add('spotify-button');

                    // Create a new td element for the button
                    let spotifyTd = document.createElement('td');
                    spotifyTd.classList.add('spotify-button-cell');
                    spotifyTd.appendChild(spotifyButton);

                    // Append the new td element to the row
                    row.appendChild(spotifyTd);
                } else {
                    console.log('Song title or artist name not found in row:', row);
                }
            } else {
                console.log('Song or artist cell not found in row:', row);
            }
        }
    }

    // Debounce function to limit how often addSpotifyButtons is called
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const debouncedAddSpotifyButtons = debounce(addSpotifyButtons, 500);

    let observer;

    function initMutationObserver() {
        const tracklist = document.querySelector('.tracklist');
        if (tracklist) {
            console.log('Tracklist found.');
            debouncedAddSpotifyButtons();

            // Disconnect previous observer if it exists
            if (observer) {
                observer.disconnect();
            }

            // Create a new observer to detect changes in the tracklist
            observer = new MutationObserver((mutations) => {
                let relevantMutation = mutations.some(mutation =>
                    Array.from(mutation.addedNodes).some(node => node.nodeType === 1 && node.matches('tr')) ||
                    Array.from(mutation.removedNodes).some(node => node.nodeType === 1 && node.matches('tr'))
                );
                if (relevantMutation) {
                    console.log('Tracklist changed.');
                    debouncedAddSpotifyButtons();
                }
            });

            // Start observing the tracklist for changes
            observer.observe(tracklist, { childList: true });
        } else {
            console.log('Waiting for tracklist...');
            setTimeout(initMutationObserver, 500);
        }
    }

    // Function to monitor navigation changes
    function monitorNavigation() {
        let currentPath = window.location.pathname;
        setInterval(() => {
            if (window.location.pathname !== currentPath) {
                currentPath = window.location.pathname;
                console.log('Navigation detected. Re-initializing observer.');
                initMutationObserver();
            }
        }, 1000);
    }

    // Run the initMutationObserver function after the page is fully loaded
    window.addEventListener('load', () => {
        console.log('Page loaded.');
        initMutationObserver();
        monitorNavigation();
    });
})();