// ==UserScript==
// @name         YouTube BPM Display
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Displays the BPM of a song on YouTube using Spotify API
// @author       Sergi0
// @match        https://www.youtube.com/*
// @grant        GM_xmlhttpRequest
// @connect      api.spotify.com
// @icon         https://www.freeiconspng.com/uploads/youtube-icon-app-logo-png-9.png
// @license      MIT
// @homepageURL  https://greasyfork.org/es/scripts/511311
// @downloadURL https://update.greasyfork.org/scripts/511311/YouTube%20BPM%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/511311/YouTube%20BPM%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Spotify API credentials
    const CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID'; // Replace with your Client ID
    const CLIENT_SECRET = 'YOUR_SPOTIFY_CLIENT_SECRET'; // Replace with your Client Secret
    let accessToken = '';
    let lastTitle = '';
    let lastUrl = '';

    // 2. Function to get Spotify access token
    function getAccessToken(callback) {
        if (CLIENT_ID.includes("YOUR_SPOTIFY") || CLIENT_SECRET.includes("YOUR_SPOTIFY")) {
            setTimeout(() => {
                displaySongInfo("Please provide your Spotify API keys to use this script.");
            }, 2000);
            return;
        }

        const authString = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'grant_type=client_credentials',
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    accessToken = data.access_token;
                    callback();
                } else {
                    setTimeout(() => {
                        displaySongInfo("Invalid Spotify API keys. Please provide valid keys.");
                    }, 2000);
                }
            }
        });
    }

    // Function to detect if full screen mode is active
    function isFullScreen() {
        return !!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
    }

    // Function to move song-info based on full-screen state
    function handleFullScreenChange() {
        let songInfoElement = document.getElementById('song_info');
        if (songInfoElement) {
            if (isFullScreen()) {
                const fullScreenContainer = document.querySelector('#player-full-bleed-container');
                if (fullScreenContainer) {
                    songInfoElement.remove();
                    fullScreenContainer.appendChild(songInfoElement);
                }
            } else {
                const playerElement = document.querySelector('#player');
                if (playerElement) {
                    songInfoElement.remove();
                    playerElement.appendChild(songInfoElement);
                }
            }
        }
    }

    // 3. Function to search track on Spotify
    function searchTrack(trackName, callback) {
        const query = encodeURIComponent(trackName);
        const apiUrl = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    if (data.tracks.items.length > 0) {
                        const track = data.tracks.items[0];
                        callback(track);
                    } else {
                        displaySongInfo("No track found.");
                    }
                } else {
                    displaySongInfo("Error in search request.");
                }
            }
        });
    }

    // 4. Function to get track features (including BPM)
    function getTrackFeatures(trackId, callback) {
        const apiUrl = `https://api.spotify.com/v1/audio-features/${trackId}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    callback(data.tempo);
                } else {
                    displaySongInfo("Error fetching track features.");
                }
            }
        });
    }

    // 5. Function to display BPM and track information
    function displaySongInfo(message) {
        let existingElement = document.getElementById('song_info');
        if (existingElement) {
            existingElement.remove();
        }

        let songInfoElement = document.createElement('div');
        songInfoElement.id = 'song_info';
        songInfoElement.style.position = 'absolute';
        songInfoElement.style.top = '10px';
        songInfoElement.style.right = '10px';
        songInfoElement.style.backgroundColor = '#ff0000';
        songInfoElement.style.color = 'white';
        songInfoElement.style.padding = '15px';
        songInfoElement.style.borderRadius = '5px';
        songInfoElement.style.fontWeight = 'bold';
        songInfoElement.style.fontSize = '20px';
        songInfoElement.style.textAlign = 'center';
        songInfoElement.innerText = message;

        const playerElement = document.querySelector('#player');
        if (playerElement) {
            playerElement.appendChild(songInfoElement);
        } else {
            console.error("Could not find the player element to add BPM.");
        }

        handleFullScreenChange();
    }

    // 6. Function to update BPM and track information
    function updateSongInfo(bpm, track) {
        let existingElement = document.getElementById('song_info');
        if (existingElement) {
            existingElement.innerText = '';
        } else {
            displaySongInfo('');
            existingElement = document.getElementById('song_info');
        }

        let bpmElement = document.createElement('div');
        bpmElement.id = 'bpm';
        bpmElement.style.fontSize = '60px';
        bpmElement.innerText = `BPM: ${bpm ? bpm.toFixed(2) : 'Not available'}`;

        let artistElement = document.createElement('div');
        artistElement.id = 'artist';
        artistElement.style.fontSize = '20px';
        artistElement.innerText = `Artist: ${track.artists[0].name}`;

        let songElement = document.createElement('div');
        songElement.id = 'song';
        songElement.style.fontSize = '20px';
        songElement.innerText = `Song: ${track.name}`;

        existingElement.appendChild(bpmElement);
        existingElement.appendChild(artistElement);
        existingElement.appendChild(songElement);
    }

    // 7. Main function
    function main() {
        const videoTitleElement = document.querySelector('#title h1');
        if (videoTitleElement) {
            const titleText = videoTitleElement.innerText.trim();
            if (titleText !== lastTitle) {
                lastTitle = titleText;
                searchTrack(titleText, function(track) {
                    if (track) {
                        getTrackFeatures(track.id, function(bpm) {
                            updateSongInfo(bpm, track);
                        });
                    } else {
                        displaySongInfo("No track found.");
                    }
                });
            }
        }
    }

    // 8. Function to wait for the video title indefinitely
    function waitForTitle() {
        const interval = setInterval(() => {
            const videoTitleElement = document.querySelector('#title h1');
            if (videoTitleElement) {
                main();
            }
        }, 1000);
    }

    // 9. Observe changes in URL and full screen mode
    function observeUrlChanges() {
        const urlObserver = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                waitForTitle();
            }
        });

        urlObserver.observe(document.body, { childList: true, subtree: true });
    }

    // 10. Observe fullscreen changes
    function observeFullScreenChanges() {
        document.addEventListener('fullscreenchange', handleFullScreenChange);
    }

    // 11. Load script
    window.addEventListener('load', () => {
        getAccessToken(function() {
            observeUrlChanges();
            observeFullScreenChanges();
            waitForTitle();
        });
    });

})();
