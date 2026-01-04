// ==UserScript==
// @name         Auto Play Specific Spotify Playlist
// @namespace    http://tampermonkey.net/
// @version      1.
// @description  Automatically play a specific playlist when Spotify website is opened
// @license      MIT
// @author       Jimbootie
// @match        https://open.spotify.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520257/Auto%20Play%20Specific%20Spotify%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/520257/Auto%20Play%20Specific%20Spotify%20Playlist.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const playlistId = '4hXKVluMRDtKm2nQeoYLpT'; // Your Playlist ID
    const playlistUrl = `https://open.spotify.com/playlist/${playlistId}`;

    // Redirect to the playlist URL if not already on that page
    if (!window.location.href.includes(playlistUrl)) {
        window.location.href = playlistUrl;
        return;
    }

    // Wait for the page to load
    window.addEventListener('load', () => {
        console.log('Playlist page loaded.')
        
    });
})();
