// ==UserScript==
// @name         AnisongDB Player
// @namespace    Racoonsaki
// @version      3.2.0
// @description  A standalone music player for AMQ, powered by the AnisongDB API.
// @author       Racoonsaki
// @match        https://animemusicquiz.com/*
// @match        https://anisongdb.com/*
// @license      MIT license
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/544713/AnisongDB%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/544713/AnisongDB%20Player.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // =================================================================================================
    // Constants & Global State
    // =================================================================================================

    const ANISONDB_API_URL = 'https://anisongdb.com/api/search_request';
    const CDN_HOSTS = ['https://eudist.animemusicquiz.com', 'https://naedist.animemusicquiz.com'];
    const PLAYER_STATE_KEY = 'amqAnisongDBPlayer_v1_gm';
    const SAVED_PLAYLISTS_KEY = 'amqAnisongDBSavedPlaylists_v1_gm';
    const ANIME_LIST_KEY = 'amqAnimeList_v1_gm';
    const SONG_DETAILS_CACHE_KEY = 'amqAnisongDBSongDetails_v2_gm';

    const playerState = {
        playlist: [],
        fullPlaylist: [],
        currentIndex: -1,
        loop: false,
        shuffleMode: false,
        playHistory: [],
        isPanelOpen: false,
        videoMode: false,
        isTheaterMode: false,
        lastVolume: 1,
        draggedIndex: -1,
        nameDisplayMode: 'EN'
    };

    let groupedSearchResults = new Map();
    let lastRawSearchResults = [];
    let processedAnimeList = [];
    let autocompleteIndex = -1;
    let isTrackChanging = false;

    const ICONS = {
        CLEAR: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
        PIP: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><rect x="15" y="3" width="7" height="5" rx="1"/><path d="M15 12v-1.5a.5.5 0 0 1 .5-.5H17"/></svg>`,
        THEATER_MODE: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></svg>`,
        PLAYER_MAIN: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
        PLAYER_HIDE: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
        SHUFFLE: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="16 16 21 16 21 21"></polyline><line x1="4" y1="4" x2="11" y2="11"></line></svg>`,
        REMOVE: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        LOOP: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2.1l4 4-4 4"/><path d="M3 12.6A9 9 0 0 1 12 3a9 9 0 0 1 8.2 6"/><path d="M7 21.9l-4-4 4-4"/><path d="M21 11.4A9 9 0 0 1 12 21a9 9 0 0 1-8.2-6"/></svg>`,
        VIDEO: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect><line x1="2" y1="12" x2="22" y2="12"></line></svg>`,
        AUDIO: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
        VOL_HIGH: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
        VOL_LOW: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
        VOL_MUTED: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`,
        SAVE: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`,
        LOAD: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
        TRASH: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
        SEARCH: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
        INFO: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
        SHARE: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>`,
        IMPORT: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
        REPLACE: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path><path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path></svg>`,
        ARROW_DOWN: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`
    };

    // =================================================================================================
    // Data & Cache Management
    // =================================================================================================

    function encodeData(data) { try { const jsonString = JSON.stringify(data); const escapedString = encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)); return btoa(escapedString); } catch (e) { console.error("Failed to encode data:", e); return null; } }
    function decodeData(encodedString) { if (!encodedString || typeof encodedString !== 'string') return null; try { const escapedString = atob(encodedString); const jsonString = decodeURIComponent(escapedString.split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')); return JSON.parse(jsonString); } catch (e) { return null; } }
    async function getCache(key) { const encodedCache = await GM_getValue(key); return decodeData(encodedCache) || {}; }
    async function setCache(key, cacheData) { const encodedCache = encodeData(cacheData); if (encodedCache) { await GM_setValue(key, encodedCache); } }
    async function getSongFromCache(annSongId) { const songCache = await getCache(SONG_DETAILS_CACHE_KEY); return songCache[annSongId]; }
    async function setSongInCache(songData) { if (!songData?.annSongId) return; const songCache = await getCache(SONG_DETAILS_CACHE_KEY); songCache[songData.annSongId] = songData; await setCache(SONG_DETAILS_CACHE_KEY, songCache); }
    async function cleanUpSongDetailsCache() {
        const activeSongIds = new Set();
        playerState.fullPlaylist.forEach(song => {
            if (song?.annSongId) activeSongIds.add(song.annSongId);
        });
        try {
            const savedPlaylists = await getCache(SAVED_PLAYLISTS_KEY);
            for (const playlistName in savedPlaylists) {
                const playlist = savedPlaylists[playlistName];
                if (Array.isArray(playlist)) {
                    playlist.forEach(song => {
                        if (song?.annSongId) activeSongIds.add(song.annSongId);
                    });
                }
            }
        } catch (e) {
            console.error("Error reading saved playlists for cache cleanup:", e);
            return;
        }
        const songDetailsCache = await getCache(SONG_DETAILS_CACHE_KEY);
        const originalCacheSize = Object.keys(songDetailsCache).length;
        if (originalCacheSize === 0) {
            return;
        }
        const newCache = {};
        for (const songId in songDetailsCache) {
            if (activeSongIds.has(parseInt(songId, 10))) {
                newCache[songId] = songDetailsCache[songId];
            }
        }
        if (Object.keys(newCache).length !== originalCacheSize) {
            await setCache(SONG_DETAILS_CACHE_KEY, newCache);
            console.log(`[AnisongDB Player] Cache cleaned. Removed ${originalCacheSize - Object.keys(newCache).length} unused entries.`);
        }
    }

    // =================================================================================================
    // Initialization & State
    // =================================================================================================

    async function initializePlayer() {
        createUI();
        attachEventListeners();
        updateAllPlayerControlsUI();
        initializeAutocomplete();
        await loadAndRenderSavedState();
        // MODIFIED: Run cache cleanup automatically after the state has been loaded.
        // This ensures cleanup happens only after the current playlist is restored, preventing incorrect deletions.
        setTimeout(cleanUpSongDetailsCache, 2000);
    }

    async function saveState() {
        const videoPlayer = document.getElementById('amq-video-player');
        if (!videoPlayer) return;
        if (playerState.fullPlaylist.length === 0) {
            await GM_deleteValue(PLAYER_STATE_KEY);
            return;
        }
        const stateToSave = {
            playlist: playerState.fullPlaylist,
            currentIndex: playerState.currentIndex,
            currentTime: videoPlayer.currentTime,
            isPlaying: !videoPlayer.paused,
            volume: videoPlayer.volume,
            isMuted: videoPlayer.muted,
            loop: playerState.loop,
            shuffleMode: playerState.shuffleMode,
            videoMode: playerState.videoMode,
            isTheaterMode: false,
            nameDisplayMode: playerState.nameDisplayMode,
        };
        const encodedState = encodeData(stateToSave);
        if (encodedState) await GM_setValue(PLAYER_STATE_KEY, encodedState);
    }

    async function loadAndRenderSavedState() {
        const encodedState = await GM_getValue(PLAYER_STATE_KEY);
        const savedState = decodeData(encodedState);
        if (!savedState) return;

        try {
            const videoPlayer = document.getElementById('amq-video-player');
            playerState.loop = savedState.loop || false;
            playerState.shuffleMode = savedState.shuffleMode || false;
            playerState.videoMode = savedState.videoMode || false;
            playerState.isTheaterMode = savedState.isTheaterMode || false;
            playerState.nameDisplayMode = savedState.nameDisplayMode || 'EN';
            videoPlayer.volume = savedState.volume ?? 1;
            videoPlayer.muted = savedState.isMuted || false;
            playerState.lastVolume = savedState.volume || 1;
            document.getElementById('amq-volume-slider').value = videoPlayer.muted ? 0 : videoPlayer.volume;

            updateAllPlayerControlsUI();

            if (!Array.isArray(savedState.playlist) || typeof savedState.currentIndex !== 'number' || savedState.playlist.length === 0) return;

            playerState.fullPlaylist = savedState.playlist;
            playerState.playlist = [...playerState.fullPlaylist];
            renderPlaylist();
            loadTrack(savedState.currentIndex, {
                startTime: savedState.currentTime || 0,
                shouldPlay: savedState.isPlaying || false
            });
        } catch (e) {
            showToast("Failed to load saved state.", 'error');
            await GM_deleteValue(PLAYER_STATE_KEY);
        }
    }

    // =================================================================================================
    // UI Creation & Styling
    // =================================================================================================

    function createUI() {
        // MODIFIED: Create and append the search panel to the body separately.
        // This ensures its backdrop-filter works correctly by not being a child of the main panel.
        const searchPanel = document.createElement('div');
        searchPanel.id = 'amq-search-results-panel';
        searchPanel.innerHTML = `
            <div class="search-results-panel-header"><h4>Search Results</h4><button id="amq-close-search-panel">×</button></div>
            <div id="amq-search-results-list"></div>
        `;
        document.body.appendChild(searchPanel);

        const panel = document.createElement('div');
        panel.id = 'amq-player-panel';
        panel.innerHTML = `
            <div id="amq-info-popover" class="hidden">
                <div class="popover-arrow"></div><div id="amq-info-popover-content"></div>
            </div>
            <div id="amq-toast-container"></div>
            <div id="amq-confirm-modal" class="amq-modal-overlay hidden">
                <div class="amq-modal-content">
                    <h4 id="amq-confirm-title">Confirm Action</h4><p id="amq-confirm-message">Are you sure?</p>
                    <div class="amq-modal-buttons"><button class="amq-modal-cancel">Cancel</button><button id="amq-modal-confirm-action">Confirm</button></div>
                </div>
            </div>
            <div id="amq-add-replace-modal" class="amq-modal-overlay hidden">
                <div class="amq-modal-content">
                    <h4 id="amq-add-replace-title">Add Songs</h4><p id="amq-add-replace-message">How would you like to add these songs?</p>
                    <div class="amq-modal-buttons"><button id="amq-modal-add">Add</button><button id="amq-modal-replace">Replace</button><button class="amq-modal-cancel">Cancel</button></div>
                </div>
            </div>
            <div id="amq-save-playlist-modal" class="amq-modal-overlay hidden">
                <div class="amq-modal-content">
                    <h4>Save Current Playlist</h4><p>Enter a name for your playlist.</p><input type="text" id="amq-save-playlist-name-input" placeholder="Playlist Name">
                    <div class="amq-modal-buttons"><button class="amq-modal-cancel">Cancel</button><button id="amq-modal-confirm-save">Save</button></div>
                </div>
            </div>

            <div class="panel-header">
                <div>
                    <h3>AnisongDB Player 🦝 </h3>
                    <small style="color: #666666; font-weight: Bold; font-style: italic; font-size: 1em; display: block; margin-top: 0px;">Let's listen to music instead of using Nen!</small>
                </div>
                <button id="amq-player-close-button" title="Hide">»</button>
            </div>
            <div class="panel-search-section">
                <div class="search-wrapper">
                    <div class="search-bar">
                        <select id="amq-search-type-selector"><option value="anime" selected>Anime</option><option value="song">Song</option><option value="artist">Artist</option></select>
                        <input type="text" id="amq-search-input" placeholder="Search..." autocomplete="off">
                        <button id="amq-manual-search-btn" title="Search">${ICONS.SEARCH}</button>
                    </div>
                    <ul id="amq-autocomplete-list" class="hidden"></ul>
                </div>
            </div>
            <div id="amq-playlist-controls" class="playlist-controls">
                <div class="playlist-buttons-left">
                    <button id="amq-playlist-save" class="control-btn" title="Save Playlist">${ICONS.SAVE}</button>
                    <button id="amq-playlist-load" class="control-btn" title="Load Playlist">${ICONS.LOAD}</button>
                    <button id="amq-import-playlist-btn" class="control-btn" title="Import Playlist from Clipboard">${ICONS.IMPORT}</button>
                    <button id="amq-share-current-playlist-btn" class="control-btn" title="Share Current Playlist">${ICONS.SHARE}</button>
                    <button id="amq-playlist-clear" class="control-btn" title="Clear Playlist">${ICONS.CLEAR}</button>
                    <button id="amq-name-display-toggle" class="control-btn name-toggle" title="Toggle Anime Name Display">EN</button>
                </div>
                <div class="playlist-filters">
                    <button class="filter-btn active" data-filter="all">All</button><button class="filter-btn" data-filter="OP">OP</button><button class="filter-btn" data-filter="ED">ED</button><button class="filter-btn" data-filter="IN">IN</button>
                </div>
            </div>
            <div id="amq-main-content-area">
                <div id="amq-player-main-display" class="panel-main-display"><div class="placeholder">Search for music to begin...</div></div>
                <div id="amq-load-playlist-panel" class="hidden"><div class="load-panel-header"><h4>Saved Playlists</h4><button id="amq-close-load-panel">×</button></div><div id="amq-saved-playlists-list"></div></div>
            </div>
            <div id="amq-player-placeholder"></div>
        `;
        document.body.appendChild(panel);

        const playerContainer = document.createElement('div');
        playerContainer.id = 'amq-player-container';
        playerContainer.innerHTML = `
            <video id="amq-video-player" playsinline></video>
            <button id="amq-theater-mode-btn" title="Theater Mode">${ICONS.THEATER_MODE}</button>
            <button id="amq-pip-btn" title="Picture-in-Picture">${ICONS.PIP}</button>
            <div id="amq-player-controls" class="panel-player-controls">
                <div class="song-info"><div id="amq-song-title">--</div><div id="amq-song-artist">--</div><div id="amq-anime-info">--</div></div>
                <div class="progress-container"><span id="amq-current-time">0:00</span><input type="range" id="amq-progress-bar" value="0" step="0.1" disabled><span id="amq-duration">0:00</span></div>
                <div class="buttons-container">
                    <div class="player-controls-group-side left">
                        <button id="amq-player-loop" title="Loop">${ICONS.LOOP}</button>
                        <button id="amq-player-shuffle" title="Random Play">${ICONS.SHUFFLE}</button>
                        <div id="amq-volume-wrapper" class="control-wrapper">
                            <button id="amq-volume-button" title="Mute/Unmute"><span class="icon-vol-high">${ICONS.VOL_HIGH}</span><span class="icon-vol-low hidden">${ICONS.VOL_LOW}</span><span class="icon-vol-muted hidden">${ICONS.VOL_MUTED}</span></button>
                            <div id="amq-volume-slider-container"><input type="range" id="amq-volume-slider" min="0" max="1" step="0.01" value="1"></div>
                        </div>
                    </div>
                    <div class="player-controls-group-main"><button id="amq-player-prev" title="Previous">«</button><button id="amq-player-play" title="Play/Pause">▶</button><button id="amq-player-next" title="Next">»</button></div>
                    <div class="player-controls-group-side right"><button id="amq-video-toggle" title="Video/Audio Mode"><span class="icon-video">${ICONS.VIDEO}</span><span class="icon-audio hidden">${ICONS.AUDIO}</span></button></div>
                </div>
            </div>
        `;
        document.getElementById('amq-player-placeholder').appendChild(playerContainer);

        const theaterContainer = document.createElement('div');
        theaterContainer.id = 'amq-theater-player-container';
        document.body.appendChild(theaterContainer);

        const toggleButton = document.createElement('button');
        toggleButton.id = 'amq-player-toggle-button';
        toggleButton.title = 'Toggle AnisongDB Player';
        toggleButton.innerHTML = ICONS.PLAYER_MAIN;
        document.body.appendChild(toggleButton);

        const style = document.createElement('style');
        style.innerHTML = `
            :root { --amq-blue: #4497ea; --amq-dark-1: #1b1b1b; --amq-dark-2: #2c2c2c; --amq-dark-3: #101010; --amq-grey: #5a5a5a; --amq-text: #d9d9d9; }
            .hidden { display: none !important; }
            #amq-player-toggle-button { position: fixed; top: 40px; right: 0; width: 48px; height: 48px; background-color: rgba(68, 151, 234, 0.85); color: white; border: none; border-radius: 24px 0 0 24px; cursor: pointer; z-index: 99998; box-shadow: -2px 2px 10px rgba(0,0,0,0.4); display: flex; justify-content: center; align-items: center; transform: translateX(34px); opacity: 0.35; transition: transform 0.3s ease, background-color 0.2s, opacity 0.3s ease; }
            #amq-player-toggle-button:hover { background-color: rgba(87, 163, 238, 1); transform: translateX(0); opacity: 1; }
            #amq-player-toggle-button svg { width: 24px; height: 24px; stroke-width: 2.5; }
            #amq-player-panel { position: fixed; top: 0; right: 0; bottom: 0; width: 450px; max-width: 90vw; background-color: rgba(27, 27, 27, 0.96); color: var(--amq-text); border-left: 1px solid var(--amq-grey); z-index: 99999; font-family: 'Source Sans Pro', sans-serif; display: flex; flex-direction: column; box-shadow: -5px 0 25px rgba(0,0,0,0.5); transform: translateX(100%); transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); }
            #amq-player-panel.open { transform: translateX(0); }
            .panel-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 15px; background-color: rgba(44, 44, 44, 0.85); flex-shrink: 0; }
            .panel-header h3 { font-weight: 600; font-size: 1.4em; color: var(--amq-text); text-shadow: 0 0 8px rgba(68, 151, 234, 0.3); margin: 0; }
            .playlist-item { display: block; border-bottom: 1px solid rgba(44, 44, 44, 0.7); transition: background-color 0.2s; }
            .item-main-container {
                display: flex;
                align-items: center;
                padding: 10px 15px;
                border-left: 3px solid transparent;
                transition: border-left 0.2s, background-color 0.2s;
                gap: 10px;
            }
            .playlist-item:hover .item-main-container { background-color: rgba(255, 255, 255, 0.05); }
            .playlist-item.playing .item-main-container { background-color: rgba(68, 151, 234, 0.15); border-left-color: var(--amq-blue); }
            .search-result-item .item-main-container { border-left: 3px solid transparent; }
            .search-result-item:hover .item-main-container { background-color: rgba(68, 151, 234, 0.1); }
            .search-result-item .item-info { flex-grow: 1; min-width: 0; cursor: default; }
            .playlist-item.dragging { opacity: 0.5; background: var(--amq-dark-3); }
            .playlist-item.drag-over { border-top: 2px solid var(--amq-blue); }
            .playlist-item .item-info, .search-result-item .item-info { flex-grow: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; cursor: pointer; }
            .playlist-item .item-info > b, .search-result-item .item-info > b { display: block; white-space: normal; word-break: break-word; font-size: 1em; font-weight: 700; color: #fff; }
            .playlist-item .item-info > small, .search-result-item .item-info > small { display: block; overflow: hidden; text-overflow: ellipsis; font-size: 0.85em; }
            .playlist-item small.anime-title-jp, .search-result-item small.anime-title-jp { color: #b5b5b5; font-style: italic; }
            .item-actions { display: flex; flex-direction: column; align-items: center; justify-content: center; margin-left: 10px; gap: 5px; }
            .item-actions button { flex-shrink: 0; background: none; border: none; color: var(--amq-grey); cursor: pointer; opacity: 0; transition: opacity 0.2s, color 0.2s, background-color 0.2s; border-radius: 50%; width: 30px; height: 30px; display: inline-flex; justify-content: center; align-items: center; }
            .item-main-container:hover .item-actions button { opacity: 1; }
            .item-actions .remove-track-btn:hover { color: #ff6961; background-color: rgba(255,255,255,0.1); }
            .item-actions .info-track-btn:hover { color: var(--amq-blue); }
            .search-result-actions, .search-result-links {
                opacity: 0;
                transition: opacity 0.2s ease-in-out;
            }
            .item-main-container:hover .search-result-actions,
            .item-main-container:hover .search-result-links {
                opacity: 1;
            }
            .search-result-actions {
                display: flex;
                flex-direction: column;
                gap: 4px;
                margin-left: auto;
            }
            .search-action-btn { background-color: transparent; border: 1px solid var(--amq-grey); color: var(--amq-text); border-radius: 50%; cursor: pointer; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s, color 0.2s, border-color 0.2s; }
            .search-action-btn svg { width: 18px; height: 18px; }
            .search-action-btn[data-action="add"] { font-size: 1.2em; font-weight: bold; }
            .search-action-btn:hover { background-color: var(--amq-blue); color: white; border-color: var(--amq-blue); }
            .search-action-btn[data-action="add"]:hover { background-color: #28a745; border-color: #28a745; }
            .search-result-links {
                display: grid;
                grid-template-columns: repeat(2, auto);
                gap: 5px 8px;
                margin-left: 10px;
            }
            .search-result-link, .search-result-link:visited { color: var(--amq-grey); text-decoration: none; font-size: 0.8em; background-color: var(--amq-dark-2); padding: 2px 6px; border-radius: 4px; transition: color 0.2s, background-color 0.2s; text-align: center; }
            .search-result-link:hover { color: white; background-color: var(--amq-blue); }
            #amq-info-popover { position: absolute; width: 340px; background-color: rgba(20, 20, 20, 0.95); border: 1px solid var(--amq-grey); border-radius: 8px; box-shadow: -5px 5px 15px rgba(0,0,0,0.5); z-index: 1000; right: 102%; transform-origin: right center; animation: popIn 0.2s ease-out; backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); }
            @keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            #amq-info-popover .popover-arrow { position: absolute; top: 20px; right: -10px; width: 0; height: 0; border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-left: 10px solid rgba(20, 20, 20, 0.95); }
            #amq-info-popover .popover-arrow::before { content: ''; position: absolute; top: -11px; left: -12px; width: 0; height: 0; border-top: 11px solid transparent; border-bottom: 11px solid transparent; border-left: 11px solid var(--amq-grey); z-index: -1; }
            #amq-info-popover-content { padding: 15px; max-height: 80vh; overflow-y: auto; }
            .details-section { margin-bottom: 15px; } .details-section:last-child { margin-bottom: 0; }
            .details-section h5 { font-size: 0.8em; color: #66ccff; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0; border-bottom: 1px solid var(--amq-grey); padding-bottom: 5px; }
            .details-grid { display: grid; grid-template-columns: 90px 1fr; gap: 5px; align-items: start; }
            .details-grid b { color: #fff; font-weight: 700; text-align: right; padding-right: 10px; opacity: 0.8; }
            .details-grid span { color: #e0e0e0; word-break: break-word; }
            .details-section ul.link-list { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 10px; }
            .details-section ul.link-list a { color: var(--amq-text); text-decoration: none; background-color: var(--amq-grey); padding: 3px 8px; border-radius: 4px; transition: background-color 0.2s; font-size: 0.9em; }
            .details-section ul.link-list a:hover { background-color: var(--amq-blue); }
            a.members-toggle { color: var(--amq-grey); text-decoration: none; font-style: italic; font-weight: normal; } a.members-toggle:hover { color: var(--amq-blue); }
            .member-cell { padding-left: 0 !important; }
            .members-container { max-height: 140px; overflow-y: auto; margin-top: 5px; padding-right: 5px; }
            .members-container.hidden { display: none; }
            .members-container ul { list-style-type: none; padding-left: 15px; margin: 0; font-style: italic; }
            .members-container li { padding: 2px 0; }
            .members-container::-webkit-scrollbar { width: 5px; }
            .members-container::-webkit-scrollbar-track { background: var(--amq-dark-2); }
            .members-container::-webkit-scrollbar-thumb { background: var(--amq-grey); border-radius: 4px; }
            .playlist-controls { display: flex; align-items: center; justify-content: space-between; padding: 8px 15px; background-color: rgba(44, 44, 44, 0.85); flex-shrink: 0; }
            .playlist-buttons-left { display: flex; gap: 5px; }
            .playlist-controls .control-btn { background: none; border: 1px solid transparent; color: var(--amq-text); width: 32px; height: 32px; border-radius: 5px; cursor: pointer; display: inline-flex; justify-content: center; align-items: center; padding: 0; }
            .playlist-controls .control-btn.name-toggle { font-weight: bold; font-size: 0.8em; }
            .playlist-controls .control-btn:hover { background-color: rgba(255, 255, 255, 0.1); } .playlist-controls .control-btn svg { width: 18px; height: 18px; }
            .playlist-filters { display: flex; border: 1px solid var(--amq-grey); border-radius: 5px; overflow: hidden; }
            .playlist-filters .filter-btn { background: none; border: none; border-left: 1px solid var(--amq-grey); color: var(--amq-text); padding: 5px 10px; cursor: pointer; font-size: 0.8em; }
            .playlist-filters .filter-btn:first-child { border-left: none; } .playlist-filters .filter-btn.active { background-color: var(--amq-blue); color: white; }
            .buttons-container { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; margin-top: 5px; }
            .player-controls-group-side { display: flex; align-items: center; gap: 5px; height: 48px; }
            .player-controls-group-side.left { justify-content: flex-start; }
            .player-controls-group-side.right { justify-content: flex-end; }
            .player-controls-group-main { display: flex; align-items: center; justify-content: center; gap: 10px; }
            .buttons-container button { display: inline-flex; justify-content: center; align-items: center; background: none; border: 1px solid transparent; color: var(--amq-text); width: 38px; height: 38px; border-radius: 50%; cursor: pointer; transition: all 0.2s; } .buttons-container button:hover { background-color: rgba(255, 255, 255, 0.1); } #amq-player-play { font-size: 1.5em; width: 48px; height: 48px; border: 1px solid var(--amq-blue) !important; } #amq-player-play:hover { background-color: rgba(68, 151, 234, 0.2); } #amq-player-prev, #amq-player-next { font-size: 1.2em; } #amq-player-loop.active, #amq-player-shuffle.active, #amq-video-toggle.active, #amq-volume-button.active, #amq-theater-mode-btn.active { color: var(--amq-blue); }
            #amq-pip-btn, #amq-theater-mode-btn { position: absolute; background-color: rgba(0,0,0,0.5); color: white; border: none; border-radius: 5px; width: 32px; height: 32px; cursor: pointer; display: none; justify-content: center; align-items: center; z-index: 10; transition: background-color 0.2s, opacity 0.2s; opacity: 0; }
            #amq-pip-btn { top: 8px; right: 8px; }
            #amq-theater-mode-btn { top: 8px; left: 8px; }
            #amq-player-container.video-mode #amq-pip-btn, #amq-player-container.video-mode #amq-theater-mode-btn { display: inline-flex; }
            #amq-player-container:hover #amq-pip-btn, #amq-player-container:hover #amq-theater-mode-btn { opacity: 1; }
            #amq-pip-btn:hover, #amq-theater-mode-btn:hover { background-color: rgba(0,0,0,0.8); }
            #amq-pip-btn svg, #amq-theater-mode-btn svg { width: 18px; height: 18px; }
            .control-wrapper { position: relative; }
            #amq-volume-slider-container { visibility: hidden; opacity: 0; position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); background-color: rgba(20, 20, 20, 0.95); padding: 15px 10px 10px 10px; margin-bottom: 5px; border-radius: 8px; box-shadow: 0 -2px 10px rgba(0,0,0,0.5); transition: opacity 0.2s ease, visibility 0.2s ease; backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); }
            .control-wrapper:hover #amq-volume-slider-container { visibility: visible; opacity: 1; }
            #amq-volume-slider { -webkit-appearance: none; appearance: none; writing-mode: vertical-lr; direction: rtl; width: 8px; height: 100px; }
            #amq-player-placeholder { margin-top: auto; }
            #amq-player-container { position: relative; flex-shrink: 0; background-color: rgba(44, 44, 44, 0.9); }
            #amq-video-player { width: 100%; height: 0; background-color: #000000e0; transition: height 0.3s ease; display: block; }
            #amq-player-container.video-mode #amq-video-player { height: 253px; }
            #amq-player-container.pip-active #amq-video-player { height: 0 !important; }
            #amq-player-close-button { background: none; border: none; font-size: 24px; color: var(--amq-text); cursor: pointer; }
            .panel-search-section { padding: 15px; position: relative; flex-shrink: 0; }
            .search-wrapper { position: relative; }
            .search-bar { display: flex; align-items: center; background: var(--amq-dark-3); border: 1px solid var(--amq-grey); border-radius: 8px; }
            #amq-search-type-selector { background-color: var(--amq-dark-2); color: var(--amq-text); border: none; border-right: 1px solid var(--amq-grey); padding: 0 30px 0 12px; height: 44px; border-radius: 8px 0 0 8px; font-size: 0.9em; cursor: pointer; -webkit-appearance: none; -moz-appearance: none; appearance: none; background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23d9d9d9' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 12px center; background-size: 1em; }
            #amq-search-input { flex-grow: 1; background: transparent; border: none; color: var(--amq-text); padding: 12px; outline: none; font-size: 1em; }
            #amq-manual-search-btn { background-color: var(--amq-blue); border: none; color: white; margin: 3px; border-radius: 6px; cursor: pointer; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; padding: 0; flex-shrink: 0; margin-right: 4px; }
            #amq-manual-search-btn:hover { background-color: #57a3ee; }
            #amq-manual-search-btn svg { width: 18px; height: 18px; }
            #amq-autocomplete-list { position: absolute; top: 100%; left: 0; right: 0; background-color: rgba(44, 44, 44, 0.95); border: 1px solid var(--amq-grey); border-top: none; list-style: none; padding: 0; margin: 0; max-height: 250px; overflow-y: auto; z-index: 100; border-radius: 0 0 5px 5px; backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); }
            #amq-autocomplete-list li { padding: 8px 12px; cursor: pointer; }
            #amq-autocomplete-list li.autocomplete-active, #amq-autocomplete-list li:hover { background-color: var(--amq-dark-3); }
            #amq-autocomplete-list li .autocomplete-highlight { color: var(--amq-blue); }
            #amq-main-content-area { flex-grow: 1; position: relative; overflow: hidden; background-color: transparent; }
            .panel-main-display { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow-y: auto; }
            .panel-main-display .placeholder { text-align: center; margin-top: 40px; color: var(--amq-grey); }
            .panel-player-controls { padding: 15px; border-top: 1px solid var(--amq-grey); }
            .song-info { text-align: center; margin-bottom: 10px; }
            #amq-song-title { font-size: 1.1em; font-weight: bold; color: white; }
            #amq-song-artist { font-size: 1em; color: #d9d9d9; }
            #amq-anime-info { font-size: 0.85em; color: #aaa; margin-top: 2px; }
            .progress-container { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 0.8em; } #amq-progress-bar { width: 100%; }
            .amq-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); }
            .amq-modal-content { background-color: rgba(44, 44, 44, 0.9); padding: 25px; border-radius: 8px; width: 90%; max-width: 400px; box-shadow: 0 5px 20px rgba(0,0,0,0.5); text-align: center; border: 1px solid rgba(90,90,90,0.5); }
            .amq-modal-content h4 { margin-top: 0; color: white; } .amq-modal-content p { color: var(--amq-text); }
            #amq-save-playlist-name-input { width: 100%; padding: 10px; margin: 15px 0; border-radius: 5px; border: 1px solid var(--amq-grey); background-color: var(--amq-dark-3); color: white; box-sizing: border-box; }
            .amq-modal-buttons { display: flex; justify-content: center; gap: 10px; margin-top: 10px; }
            .amq-modal-buttons button { padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer; }
            #amq-modal-confirm-save, #amq-modal-confirm-action, #amq-modal-replace { background-color: var(--amq-blue); color: white; }
            #amq-modal-add { background-color: #28a745; color: white; }
            .amq-modal-cancel { background-color: var(--amq-grey); color: white; }
            #amq-load-playlist-panel { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; background-color: rgba(27, 27, 27, 0.96); display: flex; flex-direction: column; backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); }
            /* MODIFIED: Changed position to fixed and right to 450px to position it next to the main panel */
            #amq-search-results-panel { position: fixed; top: 0; right: 450px; bottom: 0; width: 400px; max-width: 90vw; background-color: rgba(27, 27, 27, 0.9); color: var(--amq-text); z-index: 99997; font-family: 'Source Sans Pro', sans-serif; display: flex; flex-direction: column; box-shadow: -5px 0 25px rgba(0,0,0,0.5); opacity: 0; pointer-events: none; transform: translateX(15px); transition: opacity 0.3s ease, transform 0.3s ease; backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); }
            #amq-search-results-panel.open { opacity: 1; pointer-events: auto; transform: translateX(0); }
            .load-panel-header, .search-results-panel-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 15px; background-color: rgba(44, 44, 44, 0.85); flex-shrink: 0; }
            #amq-close-load-panel, #amq-close-search-panel { background: none; border: none; font-size: 24px; color: var(--amq-text); cursor: pointer; padding: 0 5px; }
            #amq-saved-playlists-list, #amq-search-results-list { flex-grow: 1; overflow-y: auto; }
            .saved-playlist-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; border-bottom: 1px solid rgba(44, 44, 44, 0.7); }
            .saved-playlist-item:hover { background-color: rgba(255, 255, 255, 0.05); }
            .saved-playlist-item-name { flex-grow: 1; cursor: pointer; }
            .saved-playlist-item-actions { display: flex; align-items: center; }
            .saved-playlist-item-actions button { background: none; border: none; color: var(--amq-grey); cursor: pointer; margin-left: 10px; }
            .saved-playlist-item-actions button:hover { color: white; }
            #amq-toast-container { position: absolute; bottom: 220px; right: 20px; z-index: 100001; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
            .amq-toast { padding: 10px 15px; font-size: 0.9em; color: white; border-radius: 5px; box-shadow: 0 4px 12px rgba(0,0,0,0.4); opacity: 0; transform: translateX(100%); animation: slideInToast 0.5s forwards, slideOutToast 0.5s 4.5s forwards; pointer-events: auto; background-color: rgba(68, 151, 234, 0.85); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); }
            .amq-toast.error { background-color: rgba(217, 83, 79, 0.85); }
            .amq-toast.success { background-color: rgba(92, 184, 92, 0.85); }
            @keyframes slideInToast { to { opacity: 1; transform: translateX(0); } }
            @keyframes slideOutToast { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100%); } }
            #amq-player-panel ::-webkit-scrollbar, #amq-search-results-panel ::-webkit-scrollbar { width: 8px; }
            #amq-player-panel ::-webkit-scrollbar-track, #amq-search-results-panel ::-webkit-scrollbar-track { background: var(--amq-dark-2); }
            #amq-player-panel ::-webkit-scrollbar-thumb, #amq-search-results-panel ::-webkit-scrollbar-thumb { background: var(--amq-grey); border-radius: 4px; }
            #amq-player-panel ::-webkit-scrollbar-thumb:hover, #amq-search-results-panel ::-webkit-scrollbar-thumb:hover { background: var(--amq-blue); }
            /* Theater Mode Styles */
            #amq-theater-player-container { display: none; position: fixed; top: 0; left: 0; bottom: 0; right: 450px; background-color: rgba(0,0,0,0.6); z-index: 99990; box-sizing: border-box; }
            body.amq-theater-active #amq-theater-player-container { display: flex; }
            body.amq-theater-active #amq-player-container { width: 100%; height: 100%; display: flex; flex-direction: column; min-height: 0; background-color: transparent; }
            body.amq-theater-active #amq-player-container.video-mode #amq-video-player { flex-grow: 1; height: auto !important; min-height: 0; backdrop-filter: blur(5px);}
            body.amq-theater-active #amq-player-container #amq-player-controls { flex-shrink: 0; background-color: rgba(44, 44, 44, 0.6); border-top: 1px solid rgba(90, 90, 90, 0.5);backdrop-filter: blur(5px); }
            /* --- Styles for Expandable Search Results --- */
            .expand-bar { background-color: rgba(0,0,0,0.15); border: none; width: 100%; padding: 1px 0; cursor: pointer; color: var(--amq-grey); transition: background-color 0.2s, color 0.2s; border-top: 1px solid rgba(44, 44, 44, 0.7); }
            .expand-bar:hover { background-color: rgba(255,255,255,0.1); color: var(--amq-blue); }
            .expand-bar.expanded svg { transform: rotate(180deg); }
            .expand-bar svg { width: 20px; height: 20px; transition: transform 0.2s; display: block; margin: 0 auto; }
            .song-sublist { padding: 5px 0; background-color: rgba(0,0,0,0.2); border-top: 1px solid rgba(44, 44, 44, 0.7); }
            .song-sublist-item-wrapper { display: flex; flex-direction: column; }
            .song-sublist-item { display: flex; align-items: center; padding: 6px 15px 6px 20px; border-radius: 4px; }
            .song-sublist-item:hover { background-color: rgba(255, 255, 255, 0.05); }
            .sub-item-info { flex-grow: 1; min-width: 0; }
            .sub-item-info b { font-size: 0.95em; display: block; white-space: normal; word-break: break-word; }
            .sub-item-info small { font-size: 0.9em; color: #aaa; }
            .sub-item-actions { display: flex; align-items: center; gap: 8px; margin-left: 10px; opacity: 0; transition: opacity 0.2s; }
            .song-sublist-item:hover .sub-item-actions { opacity: 1; }
            .sub-item-info-btn { background: none; border: 1px solid var(--amq-grey); color: var(--amq-grey); font-family: 'Times New Roman', serif; font-weight: bold; font-style: italic; font-size: 12px; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; flex-shrink: 0; transition: all 0.2s; }
            .sub-item-info-btn:hover, .sub-item-info-btn.active { background-color: var(--amq-blue); border-color: var(--amq-blue); color: white; }
            .sub-item-add-btn { background-color: transparent; border: 1px solid var(--amq-grey); color: var(--amq-text); border-radius: 50%; width: 28px; height: 28px; font-size: 1.1em; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
            .sub-item-add-btn:hover { background-color: #28a745; border-color: #28a745; color: white; }
            .sub-item-details-container { background-color: rgba(0,0,0,0.2); padding: 0 15px; max-height: 0; overflow: hidden; transition: max-height 0.35s ease-in-out, padding 0.35s ease-in-out; }
            .sub-item-details-container.expanded { max-height: 500px; padding: 15px; border-top: 1px solid rgba(44, 44, 44, 0.7); }
            /* --- Styles for Disabled Search Results --- */
            .search-result-item.disabled .item-main-container,
            .song-sublist-item.disabled {
                opacity: 0.5;
            }
            .search-result-item.disabled .search-result-links,
            .search-action-btn:disabled,
            .sub-item-add-btn:disabled {
                pointer-events: none;
            }
            .search-action-btn:disabled,
            .sub-item-add-btn:disabled {
                background-color: transparent !important;
                border-color: var(--amq-grey) !important;
                color: var(--amq-grey) !important;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);
    }

    // =================================================================================================
    // Event Listeners
    // =================================================================================================

    function attachEventListeners() {
        window.addEventListener('beforeunload', saveState);
        document.getElementById('amq-player-toggle-button').addEventListener('click', togglePanel);
        document.getElementById('amq-player-close-button').addEventListener('click', togglePanel);
        document.getElementById('amq-manual-search-btn').addEventListener('click', triggerSearch);

        const searchInput = document.getElementById('amq-search-input');
        searchInput.addEventListener('input', () => showAutocompleteSuggestions(searchInput.value));
        searchInput.addEventListener('focus', () => showAutocompleteSuggestions(searchInput.value));
        searchInput.addEventListener('keydown', handleAutocompleteKeyDown);

        document.addEventListener('click', (e) => {
            const suggestionsList = document.getElementById('amq-autocomplete-list');
            if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
                suggestionsList.classList.add('hidden');
            }
            const popover = document.getElementById('amq-info-popover');
            if (!popover.classList.contains('hidden') && !popover.contains(e.target) && !e.target.closest('.info-track-btn')) {
                hideInfoPopover();
            }
            if (e.target.matches('.amq-modal-cancel')) {
                e.target.closest('.amq-modal-overlay')?.classList.add('hidden');
            }
        });

        document.getElementById('amq-info-popover-content').addEventListener('click', (e) => {
            const toggle = e.target.closest('.members-toggle');
            if (toggle) {
                e.preventDefault();
                const targetId = toggle.dataset.target;
                const membersContainer = document.getElementById(targetId);
                if (membersContainer) {
                    const isHidden = membersContainer.classList.toggle('hidden');
                    const memberCount = membersContainer.querySelectorAll('li').length;
                    toggle.textContent = isHidden ? `[+${memberCount} Members]` : `[−${memberCount} Members]`;
                }
            }
        });

        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideInfoPopover(); });

        document.getElementById('amq-search-type-selector').addEventListener('change', () => showAutocompleteSuggestions(searchInput.value));

        const videoPlayer = document.getElementById('amq-video-player');
        videoPlayer.addEventListener('ended', playNextTrack);
        videoPlayer.addEventListener('timeupdate', updateProgressBar);
        videoPlayer.addEventListener('loadedmetadata', updateProgressBar);
        videoPlayer.addEventListener('play', () => { document.getElementById('amq-player-play').textContent = '❚❚'; });
        videoPlayer.addEventListener('pause', () => { document.getElementById('amq-player-play').textContent = '▶'; });
        videoPlayer.addEventListener('enterpictureinpicture', () => document.getElementById('amq-player-container').classList.add('pip-active'));
        videoPlayer.addEventListener('leavepictureinpicture', () => document.getElementById('amq-player-container').classList.remove('pip-active'));

        document.getElementById('amq-player-play').addEventListener('click', togglePlayPause);
        document.getElementById('amq-player-next').addEventListener('click', () => { if (isTrackChanging) return; isTrackChanging = true; playNextTrack(); setTimeout(() => { isTrackChanging = false; }, 500); });
        document.getElementById('amq-player-prev').addEventListener('click', () => { if (isTrackChanging) return; isTrackChanging = true; playPreviousTrack(); setTimeout(() => { isTrackChanging = false; }, 500); });
        document.getElementById('amq-player-loop').addEventListener('click', toggleLoop);
        document.getElementById('amq-player-shuffle').addEventListener('click', toggleShuffleMode);
        document.getElementById('amq-video-toggle').addEventListener('click', toggleVideoMode);
        document.getElementById('amq-theater-mode-btn').addEventListener('click', toggleTheaterMode);
        document.getElementById('amq-progress-bar').addEventListener('input', (e) => { if (!isNaN(videoPlayer.duration)) videoPlayer.currentTime = (e.target.value / 100) * videoPlayer.duration; });
        document.getElementById('amq-volume-button').addEventListener('click', toggleMute);
        document.getElementById('amq-volume-slider').addEventListener('input', (e) => { const newVolume = parseFloat(e.target.value); videoPlayer.muted = false; videoPlayer.volume = newVolume; if (newVolume > 0) playerState.lastVolume = newVolume; updateAllPlayerControlsUI(); saveState(); });
        document.getElementById('amq-playlist-clear').addEventListener('click', clearPlaylist);
        document.getElementById('amq-name-display-toggle').addEventListener('click', toggleNameDisplay);
        document.getElementById('amq-playlist-controls').addEventListener('click', (e) => { if (e.target.classList.contains('filter-btn')) filterPlaylist(e.target.dataset.filter); });

        const mainDisplay = document.getElementById('amq-player-main-display');
        mainDisplay.addEventListener('click', (e) => {
            const target = e.target;
            const removeBtn = target.closest('.remove-track-btn');
            const infoBtn = target.closest('.info-track-btn');
            const itemInfo = target.closest('.item-info');

            if (removeBtn) { hideInfoPopover(); removeTrack(parseInt(removeBtn.dataset.originalIndex)); }
            else if (infoBtn) { toggleInfoPopover(infoBtn); }
            else if (itemInfo) { playTrack(parseInt(itemInfo.closest('.playlist-item').dataset.visibleIndex)); }
        });
        mainDisplay.addEventListener('dragstart', handleDragStart);
        mainDisplay.addEventListener('dragover', handleDragOver);
        mainDisplay.addEventListener('dragleave', handleDragLeave);
        mainDisplay.addEventListener('drop', handleDrop);
        mainDisplay.addEventListener('dragend', handleDragEnd);

        document.getElementById('amq-pip-btn').addEventListener('click', togglePiP);
        document.getElementById('amq-playlist-save').addEventListener('click', showSavePlaylistModal);
        document.getElementById('amq-playlist-load').addEventListener('click', toggleLoadPlaylistPanel);
        document.getElementById('amq-share-current-playlist-btn').addEventListener('click', shareCurrentPlaylistToClipboard);
        document.getElementById('amq-import-playlist-btn').addEventListener('click', handleImportFromClipboard);
        document.getElementById('amq-close-search-panel').addEventListener('click', () => toggleSearchResultsPanel(false));
        document.getElementById('amq-modal-confirm-save').addEventListener('click', handleSavePlaylist);
        document.getElementById('amq-close-load-panel').addEventListener('click', toggleLoadPlaylistPanel);

        document.getElementById('amq-saved-playlists-list').addEventListener('click', async (e) => {
            const target = e.target;
            const name = target.closest('.saved-playlist-item')?.dataset.name;
            if (!name) return;
            if (target.closest('.delete-btn')) { showConfirm(`Are you sure you want to delete the playlist "${name}"?`, () => deletePlaylistFromStorage(name)); }
            else if (target.closest('.share-btn')) { sharePlaylistToClipboard(name); }
            else if (target.closest('.saved-playlist-item-name')) { await loadPlaylistFromStorage(name); }
        });

        document.getElementById('amq-search-results-list').addEventListener('click', (e) => {
            if (e.target.closest('.search-result-link')) {
                return; // Allow external links to work
            }

            const actionButton = e.target.closest('.search-action-btn');
            const expandBar = e.target.closest('.expand-bar');
            const subItemAddBtn = e.target.closest('.sub-item-add-btn');
            const infoBtn = e.target.closest('.sub-item-info-btn');
            const membersToggle = e.target.closest('.members-toggle');

            if (actionButton) {
                e.preventDefault();
                const resultItem = actionButton.closest('.search-result-item');
                if (!resultItem) return;

                const { type, key } = resultItem.dataset;
                const mode = actionButton.dataset.action; // 'add' or 'replace'
                let songs = [];

                if (type === 'anime') { // Covers both anime and artist search results
                    songs = groupedSearchResults.get(parseInt(key, 10)) || [];
                } else if (type === 'song') {
                    const songObject = lastRawSearchResults.find(s => s.annSongId == key);
                    if (songObject) songs = [songObject];
                }

                if (songs.length > 0) {
                    const effectiveMode = (playerState.fullPlaylist.length === 0 && mode === 'add') ? 'replace' : mode;
                    createPlaylistFromApiResults(songs, effectiveMode);
                } else {
                    showToast("Could not find any songs for this selection.", "error");
                }
            } else if (expandBar) {
                e.preventDefault();
                const resultItem = expandBar.closest('.search-result-item');
                const sublistDiv = resultItem.querySelector('.song-sublist');
                const itemKey = resultItem.dataset.key;
                if (sublistDiv && itemKey) {
                    populateAndToggleSublist(sublistDiv, itemKey, expandBar);
                }
            } else if (subItemAddBtn) {
                e.preventDefault();
                const songId = subItemAddBtn.dataset.songId;
                const songObject = lastRawSearchResults.find(s => s.annSongId == songId);
                if (songObject) {
                    createPlaylistFromApiResults([songObject], 'add');
                }
            } else if (infoBtn) {
                e.preventDefault();
                const songId = infoBtn.dataset.songId;
                const songItemWrapper = infoBtn.closest('.song-sublist-item-wrapper');
                if (songId && songItemWrapper) {
                    toggleSongInfoInSublist(songId, songItemWrapper, infoBtn);
                }
            } else if (membersToggle) {
                e.preventDefault();
                const targetId = membersToggle.dataset.target;
                const membersContainer = document.getElementById(targetId);
                if (membersContainer) {
                    const isHidden = membersContainer.classList.toggle('hidden');
                    const memberCount = membersContainer.querySelectorAll('li').length;
                    membersToggle.textContent = isHidden ? `[+${memberCount} Members]` : `[−${memberCount} Members]`;
                }
            }
        });
    }

    // =================================================================================================
    // Autocomplete Logic
    // =================================================================================================

    async function initializeAutocomplete() { const encodedList = await GM_getValue(ANIME_LIST_KEY); const decodedList = decodeData(encodedList); if (decodedList && Array.isArray(decodedList)) { processNewAnimeList(decodedList); } if (typeof Listener === 'undefined') return; new Listener("get all song names", (payload) => { if (payload?.names && Array.isArray(payload.names)) { processNewAnimeList(payload.names); const encodedList = encodeData(payload.names); if (encodedList) GM_setValue(ANIME_LIST_KEY, encodedList); } }).bindListener(); }
    function normalizeText(text) { return text.toLowerCase().replace(/[ōóòöôø]/g, 'o').replace(/[äâàáạåæā]/g, 'a').replace(/[č]/g, 'c').replace(/[éêëèæ]/g, 'e').replace(/[ñ]/g, 'n').replace(/[í]/g, 'i').replace(/[×]/g, 'x').replace(/[ß]/g, 'b'); }
    function processNewAnimeList(list) { processedAnimeList = list.map(name => ({ original: name, normalized: normalizeText(name) })); }
    function showAutocompleteSuggestions(input) { const suggestionsContainer = document.getElementById('amq-autocomplete-list'); suggestionsContainer.innerHTML = ''; autocompleteIndex = -1; const searchType = document.getElementById('amq-search-type-selector').value; if (input.length === 0 || processedAnimeList.length === 0 || searchType !== 'anime') { suggestionsContainer.classList.add('hidden'); return; } const normalizedInput = normalizeText(input); const filteredList = processedAnimeList.filter(item => item.normalized.includes(normalizedInput)).sort((a, b) => a.original.length - b.original.length).slice(0, 50); if (filteredList.length > 0) { filteredList.forEach(item => { const li = document.createElement('li'); const matchIndex = item.normalized.indexOf(normalizedInput); const matchEnd = matchIndex + normalizedInput.length; let matchStartIndex_orig = -1, matchEndIndex_orig = -1, normCounter = 0; for (let i = 0; i < item.original.length; i++) { if (normCounter === matchIndex) matchStartIndex_orig = i; const charNormLength = normalizeText(item.original[i]).length; if (normCounter < matchEnd && normCounter + charNormLength >= matchEnd) { matchEndIndex_orig = i + 1; break; } normCounter += charNormLength; } if (matchStartIndex_orig !== -1 && matchEndIndex_orig === -1) matchEndIndex_orig = item.original.length; if (matchStartIndex_orig !== -1 && matchEndIndex_orig !== -1) { li.innerHTML = `${item.original.substring(0, matchStartIndex_orig)}<span class="autocomplete-highlight">${item.original.substring(matchStartIndex_orig, matchEndIndex_orig)}</span>${item.original.substring(matchEndIndex_orig)}`; } else { li.textContent = item.original; } li.addEventListener('mousedown', e => { e.preventDefault(); const searchInput = document.getElementById('amq-search-input'); searchInput.value = item.original; suggestionsContainer.classList.add('hidden'); triggerSearch(); }); suggestionsContainer.appendChild(li); }); suggestionsContainer.classList.remove('hidden'); } else { suggestionsContainer.classList.add('hidden'); } }
    function updateAutocompleteHighlight(items) { items.forEach((item, index) => { item.classList.toggle('autocomplete-active', index === autocompleteIndex); if (index === autocompleteIndex) item.scrollIntoView({ block: 'nearest' }); }); }
    function handleAutocompleteKeyDown(e) { const suggestionsContainer = document.getElementById('amq-autocomplete-list'); if (suggestionsContainer.classList.contains('hidden')) { if (e.key === 'Enter') triggerSearch(); return; } const items = suggestionsContainer.querySelectorAll('li'); if (items.length === 0) { if (e.key === 'Enter') triggerSearch(); return; } if (e.key === 'ArrowDown') { e.preventDefault(); autocompleteIndex = (autocompleteIndex + 1) % items.length; updateAutocompleteHighlight(items); } else if (e.key === 'ArrowUp') { e.preventDefault(); autocompleteIndex = (autocompleteIndex - 1 + items.length) % items.length; updateAutocompleteHighlight(items); } else if (e.key === 'Enter') { e.preventDefault(); if (autocompleteIndex > -1 && items[autocompleteIndex]) { items[autocompleteIndex].dispatchEvent(new MouseEvent('mousedown')); } else { triggerSearch(); } suggestionsContainer.classList.add('hidden'); } else if (e.key === 'Escape') { suggestionsContainer.classList.add('hidden'); } }

    // =================================================================================================
    // API & Search Logic
    // =================================================================================================

    function triggerSearch() { const query = document.getElementById('amq-search-input').value; const type = document.getElementById('amq-search-type-selector').value; document.getElementById('amq-autocomplete-list').classList.add('hidden'); if (query.trim()) { searchAnisongDB(query, type, showSearchResultsPanel); } else { showToast("Please enter a search term.", "error"); } }
    async function searchAnisongDB(query, type, onSuccessCallback, forcePartial = false) { const normalizedQuery = normalizeText(query); const payload = { and_logic: false, ignore_duplicate: false, opening_filter: true, ending_filter: true, insert_filter: true }; const partialMatch = forcePartial; if (type === 'anime') payload.anime_search_filter = { search: normalizedQuery, partial_match: partialMatch }; else if (type === 'song') payload.song_name_search_filter = { search: normalizedQuery, partial_match: partialMatch }; else if (type === 'artist') payload.artist_search_filter = { search: normalizedQuery, partial_match: partialMatch, group_granularity: 0, max_other_artist: 99 }; try { const response = await fetch(ANISONDB_API_URL, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); const results = await response.json(); lastRawSearchResults = results; if (results?.length > 0) { const songDetailsCache = await getCache(SONG_DETAILS_CACHE_KEY); let cacheWasModified = false; results.forEach(song => { if (song?.annSongId && !songDetailsCache[song.annSongId]) { songDetailsCache[song.annSongId] = song; cacheWasModified = true; } }); if (cacheWasModified) await setCache(SONG_DETAILS_CACHE_KEY, songDetailsCache); } if (results.length === 0 && !forcePartial) { return searchAnisongDB(query, type, onSuccessCallback, true); } if (results.length === 0) { showToast("No results found.", "info"); return; } onSuccessCallback(results, type); } catch (error) { showToast(`Search failed: ${error.message}`, 'error'); console.error("AnisongDB Search Error:", error); } }

    // =================================================================================================
    // UI Display & Rendering
    // =================================================================================================

    function showContentPanel(panelIdToShow) { const panels = ['amq-player-main-display', 'amq-load-playlist-panel']; panels.forEach(id => { document.getElementById(id).classList.toggle('hidden', id !== panelIdToShow); }); }
    function showSearchResultsPanel(results, type) { displaySearchResults(results, type); toggleSearchResultsPanel(true); }

    function populateAndToggleSublist(sublistDiv, itemKey, expandBar) {
        expandBar.classList.toggle('expanded');
        sublistDiv.classList.toggle('hidden');

        // Populate only on first expansion
        if (sublistDiv.innerHTML === '') {
            const songs = groupedSearchResults.get(parseInt(itemKey, 10)) || [];
            if (songs.length > 0) {
                const fragment = document.createDocumentFragment();
                songs.forEach(song => {
                    const isPlayable = song.HQ || song.MQ || song.audio;
                    const songItemWrapper = document.createElement('div');
                    songItemWrapper.className = 'song-sublist-item-wrapper';

                    const songItem = document.createElement('div');
                    songItem.className = 'song-sublist-item';
                    if (!isPlayable) {
                        songItem.classList.add('disabled');
                    }
                    songItem.innerHTML = `
                        <div class="sub-item-info">
                            <b>${formatSongType(song.songType)} ${song.songName}${getSongExtraInfo(song)}</b>
                            <small>${song.songArtist || 'N/A'}</small>
                        </div>
                        <div class="sub-item-actions">
                            <button class="sub-item-info-btn" title="Show Info" data-song-id="${song.annSongId}">i</button>
                            <button class="sub-item-add-btn" title="Add Song" data-song-id="${song.annSongId}" ${!isPlayable ? 'disabled' : ''}>+</button>
                        </div>
                    `;
                    songItemWrapper.appendChild(songItem);
                    fragment.appendChild(songItemWrapper);
                });
                sublistDiv.appendChild(fragment);
            } else {
                sublistDiv.innerHTML = '<div class="placeholder" style="font-size: 0.9em; padding: 10px 0;">No songs found.</div>';
            }
        }
    }

    // MODIFIED: Added a helper function to create anime links to reduce code duplication.
    function createAnimeLinksHtml(linked_ids) {
        if (!linked_ids || Object.keys(linked_ids).length === 0) return '';
        const linkHtml = Object.entries(linked_ids).map(([site, id]) => {
            if (!id) return '';
            const urls = { myanimelist: 'https://myanimelist.net/anime/', anidb: 'https://anidb.net/anime/', anilist: 'https://anilist.co/anime/', kitsu: 'https://kitsu.io/anime/' };
            const shortNames = { myanimelist: 'MAL', anidb: 'ADB', anilist: 'AL', kitsu: 'KT' };
            if (!urls[site]) return ''; // Safety check for unexpected sites
            return `<a href="${urls[site]}${id}" target="_blank" rel="noopener noreferrer" class="search-result-link" title="${site}">${shortNames[site]}</a>`;
        }).join('');
        return `<div class="search-result-links">${linkHtml}</div>`;
    }

    // MODIFIED: Updated this function to include links for all search types.
    function displaySearchResults(results, type) {
        const resultsList = document.getElementById('amq-search-results-list');
        resultsList.innerHTML = '';
        groupedSearchResults.clear();
        let uniqueResults;

        const isSongPlayable = (song) => song.HQ || song.MQ || song.audio;

        // Grouping logic based on search type
        if (type === 'anime') {
            results.forEach(song => {
                const groupKey = song.annId;
                if (!groupKey) return;
                if (!groupedSearchResults.has(groupKey)) groupedSearchResults.set(groupKey, []);
                groupedSearchResults.get(groupKey).push(song);
            });
            uniqueResults = Array.from(groupedSearchResults.values(), arr => arr[0]);
        } else if (type === 'artist') {
            const animeGroups = new Map();
            results.forEach(song => {
                const groupKey = song.annId;
                if (!groupKey) return;
                if (!animeGroups.has(groupKey)) animeGroups.set(groupKey, []);
                animeGroups.get(groupKey).push(song);
            });
            animeGroups.forEach((songs, annId) => {
                groupedSearchResults.set(annId, songs);
            });
            uniqueResults = Array.from(animeGroups.values(), arr => arr[0]);
        } else { // type === 'song'
            uniqueResults = results;
        }

        // Sort songs within each group
        if (type === 'anime' || type === 'artist') {
            for (const songs of groupedSearchResults.values()) {
                sortSongs(songs);
            }
        }

        if (uniqueResults.length === 0) {
            resultsList.innerHTML = `<div class="placeholder" style="padding: 20px;">No results found.</div>`;
            return;
        }

        // Display logic
        uniqueResults.forEach(result => {
            const item = document.createElement('div');
            item.className = 'playlist-item search-result-item';
            let mainContentHtml, itemType, itemKey, itemName, expanderHtml = '', actionButtonsHtml;

            if (type === 'anime' || type === 'artist') {
                const animeSongs = groupedSearchResults.get(result.annId) || [];
                const playableSongs = animeSongs.filter(isSongPlayable);
                const isGroupPlayable = playableSongs.length > 0;
                const playableSongCount = playableSongs.length;
                let infoLine1, infoLine2;
                const linkHtml = createAnimeLinksHtml(result.linked_ids); // MODIFIED: Generate links

                if (type === 'anime') {
                    const songTypeCounts = { OP: 0, ED: 0, INS: 0 };
                    playableSongs.forEach(song => {
                        const upperType = song.songType?.toUpperCase() || '';
                        if (upperType.startsWith('OPENING')) songTypeCounts.OP++;
                        else if (upperType.startsWith('ENDING')) songTypeCounts.ED++;
                        else if (upperType.startsWith('INSERT')) songTypeCounts.INS++;
                    });
                    const songCountsParts = [];
                    if (songTypeCounts.OP > 0) songCountsParts.push(`OP ${songTypeCounts.OP}`);
                    if (songTypeCounts.ED > 0) songCountsParts.push(`ED ${songTypeCounts.ED}`);
                    if (songTypeCounts.INS > 0) songCountsParts.push(`INS ${songTypeCounts.INS}`);
                    const partsString = songCountsParts.join(' | ');

                    infoLine1 = `<small style="color: #b5b5b5;">${getAnimeInfo(result, false)}</small>`;
                    infoLine2 = `<small style="color: #aaa;">${partsString ? `${partsString} | ` : ''}Total ${playableSongCount}</small>`;

                    mainContentHtml = `<div class="item-info" style="gap: 4px;"><b>${getDisplayName(result)}</b>${infoLine1}${infoLine2}</div>${linkHtml}`;
                } else { // type === 'artist'
                    mainContentHtml = `<div class="item-info"><b>${getDisplayName(result)} ${getAnimeInfo(result, true)}</b><small>(${playableSongCount} song${playableSongCount > 1 ? 's' : ''} by ${result.songArtist})</small></div>${linkHtml}`;
                }

                itemType = 'anime';
                itemKey = result.annId;
                itemName = getDisplayName(result);
                expanderHtml = `<button class="expand-bar" title="Show/Hide Songs">${ICONS.ARROW_DOWN}</button>`;
                actionButtonsHtml = `
                    <div class="search-result-actions">
                        <button class="search-action-btn" title="Add to Playlist" data-action="add" ${!isGroupPlayable ? 'disabled' : ''}>+</button>
                        <button class="search-action-btn" title="Replace Playlist" data-action="replace" ${!isGroupPlayable ? 'disabled' : ''}>${ICONS.REPLACE}</button>
                    </div>
                `;

                item.innerHTML = `
                    <div class="item-main-container">${mainContentHtml}${actionButtonsHtml}</div>
                    ${expanderHtml}
                    <div class="song-sublist hidden"></div>
                `;

                if (!isGroupPlayable) {
                    item.classList.add('disabled');
                }

            } else { // type === 'song'
                const isPlayable = isSongPlayable(result);
                const linkHtml = createAnimeLinksHtml(result.linked_ids); // MODIFIED: Generate links
                mainContentHtml = `<div class="item-info">
                                       <b>${formatSongType(result.songType)} ${result.songName}${getSongExtraInfo(result)}</b>
                                       <small>${result.songArtist || 'N/A'}</small>
                                       <small class="anime-title-jp">${getDisplayName(result)} ${getAnimeInfo(result, true)}</small>
                                   </div>${linkHtml}`;
                itemType = 'song';
                itemKey = result.annSongId;
                itemName = result.songName;
                actionButtonsHtml = `
                    <div class="search-result-actions">
                        <button class="search-action-btn" title="Add to Playlist" data-action="add" ${!isPlayable ? 'disabled' : ''}>+</button>
                        <button class="search-action-btn" title="Replace Playlist" data-action="replace" ${!isPlayable ? 'disabled' : ''}>${ICONS.REPLACE}</button>
                    </div>
                `;

                item.innerHTML = `
                    <div class="item-main-container">${mainContentHtml}${actionButtonsHtml}</div>
                `;

                 if (!isPlayable) {
                    item.classList.add('disabled');
                }
            }

            item.dataset.type = itemType;
            item.dataset.key = itemKey;
            item.dataset.name = itemName;

            resultsList.appendChild(item);
        });
    }

    // =================================================================================================
    // Playlist Management
    // =================================================================================================

    function showAddReplaceConfirm(name, key, singleSongArray = null, isGroupedResult = false) { const getSongs = () => isGroupedResult ? groupedSearchResults.get(key) || [] : singleSongArray; if (playerState.fullPlaylist.length === 0) { const songs = getSongs(); if (songs?.length > 0) createPlaylistFromApiResults(songs, 'replace'); return; } const modal = document.getElementById('amq-add-replace-modal'); document.getElementById('amq-add-replace-title').textContent = isGroupedResult ? `Add all songs from "${name}"` : `Add song "${name}"`; modal.classList.remove('hidden'); const addBtn = document.getElementById('amq-modal-add'); const replaceBtn = document.getElementById('amq-modal-replace'); const newAddBtn = addBtn.cloneNode(true); addBtn.parentNode.replaceChild(newAddBtn, addBtn); const newReplaceBtn = replaceBtn.cloneNode(true); replaceBtn.parentNode.replaceChild(newReplaceBtn, replaceBtn); const handleAction = (mode) => { modal.classList.add('hidden'); const songs = getSongs(); if (songs) createPlaylistFromApiResults(songs, mode); }; newAddBtn.onclick = () => handleAction('add'); newReplaceBtn.onclick = () => handleAction('replace'); }
    function createPlaylistFromApiResults(apiResults, mode) {
        // Sort the incoming songs before processing
        sortSongs(apiResults);

        const songs = apiResults.filter(s => s.HQ || s.MQ || s.audio).map(song => ({
            annId: song.annId,
            annSongId: song.annSongId,
            songName: song.songName,
            songArtist: song.songArtist,
            songType: song.songType,
            animeENName: song.animeENName,
            animeJPName: song.animeJPName,
            animeAltName: song.animeAltName,
            isDub: song.isDub,
            isRebroadcast: song.isRebroadcast,
            HQ: song.HQ,
            MQ: song.MQ,
            audio: song.audio,
            animeInfo: getAnimeInfo(song, true)
        }));

        if (mode === 'add') {
            appendToPlaylist(songs);
        } else {
            loadRawPlaylist(songs);
        }
    }
    function appendToPlaylist(newSongs) { const existingSongIds = new Set(playerState.fullPlaylist.map(s => s.annSongId)); const songsToAdd = newSongs.filter(s => !existingSongIds.has(s.annSongId)); if (songsToAdd.length > 0) { playerState.fullPlaylist.push(...songsToAdd); filterPlaylist(document.querySelector('.filter-btn.active')?.dataset.filter || 'all'); saveState(); showToast(`Added ${songsToAdd.length} new song(s).`, 'success'); } else { showToast("All songs from selection already in the playlist.", "info"); } }
    function loadRawPlaylist(songsArray) { if (!songsArray?.length > 0) { showToast("No playable songs found from the results.", "error"); return; } const videoPlayer = document.getElementById('amq-video-player'); const wasPlaying = !videoPlayer.paused; videoPlayer.pause(); document.getElementById('amq-player-play').textContent = '▶'; playerState.fullPlaylist = songsArray; playerState.playlist = [...playerState.fullPlaylist]; playerState.playHistory = []; filterPlaylist('all'); loadTrack(0, { shouldPlay: wasPlaying }); showToast(`Loaded ${songsArray.length} song(s).`, "success"); }
    function renderPlaylist() {
        const mainDisplay = document.getElementById('amq-player-main-display');
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        const isDraggable = activeFilter === 'all';
        mainDisplay.innerHTML = '';
        if (playerState.playlist.length === 0) {
            mainDisplay.innerHTML = `<div class="placeholder">${activeFilter === 'all' ? 'No songs in playlist' : `No songs of type ${activeFilter.toUpperCase()}`}</div>`;
            return;
        }
        const fragment = document.createDocumentFragment();
        playerState.playlist.forEach((song, visibleIndex) => {
            const originalIndex = playerState.fullPlaylist.indexOf(song);
            const div = document.createElement('div');
            div.className = 'playlist-item';
            div.id = `playlist-track-${visibleIndex}`;
            div.dataset.originalIndex = originalIndex;
            div.dataset.visibleIndex = visibleIndex;
            div.draggable = isDraggable;
            div.innerHTML = `<div class="item-main-container">
                                <div class="item-info">
                                    <b>${formatSongType(song.songType)}&nbsp;&nbsp;${song.songName}${getSongExtraInfo(song)}</b>
                                    <small>${song.songArtist || 'Unknown Artist'}</small>
                                    <small class="anime-title-jp">${getDisplayName(song)} ${song.animeInfo}</small>
                                </div>
                                <div class="item-actions">
                                    <button class="info-track-btn" title="Info" data-original-index="${originalIndex}">${ICONS.INFO}</button>
                                    <button class="remove-track-btn" title="Remove" data-original-index="${originalIndex}">${ICONS.REMOVE}</button>
                                </div>
                             </div>`;
            fragment.appendChild(div);
        });
        mainDisplay.appendChild(fragment);
        updatePlayingTrackHighlight();
    }
    function updatePlayingTrackHighlight() { document.querySelectorAll('.playlist-item.playing').forEach(el => el.classList.remove('playing')); const currentSong = playerState.fullPlaylist[playerState.currentIndex]; const visibleIndex = currentSong ? playerState.playlist.indexOf(currentSong) : -1; if (visibleIndex > -1) { document.getElementById(`playlist-track-${visibleIndex}`)?.classList.add('playing'); } }

    // =================================================================================================
    // Player Controls
    // =================================================================================================

    function playNextTrack() {
        if (playerState.playlist.length === 0) return;
        if (playerState.shuffleMode) {
            const availableSongIds = new Set(playerState.playlist.map(s => s.annSongId));
            let unplayedSongIds = [...availableSongIds].filter(id => !playerState.playHistory.includes(id));
            if (unplayedSongIds.length === 0) {
                if (playerState.loop) { showToast("Random playlist loop: Restarting", "info"); playerState.playHistory = []; unplayedSongIds = [...availableSongIds]; }
                else { document.getElementById('amq-player-play').textContent = '▶'; saveState(); return; }
            }
            if (unplayedSongIds.length === 0) { document.getElementById('amq-player-play').textContent = '▶'; return; }
            const randomSongId = unplayedSongIds[Math.floor(Math.random() * unplayedSongIds.length)];
            const nextSong = playerState.fullPlaylist.find(s => s.annSongId === randomSongId);
            if (nextSong) { playTrack(nextSong); }
        } else {
            const currentSong = playerState.fullPlaylist[playerState.currentIndex];
            const currentVisibleIndex = currentSong ? playerState.playlist.indexOf(currentSong) : -1;
            let nextVisibleIndex = currentVisibleIndex + 1;
            if (nextVisibleIndex >= playerState.playlist.length) {
                if (playerState.loop) nextVisibleIndex = 0;
                else { document.getElementById('amq-player-play').textContent = '▶'; saveState(); return; }
            }
            if (nextVisibleIndex < 0) nextVisibleIndex = 0;
            playTrack(nextVisibleIndex);
        }
    }

    function playPreviousTrack() { if (playerState.playlist.length === 0) return; const currentSong = playerState.fullPlaylist[playerState.currentIndex]; const currentVisibleIndex = currentSong ? playerState.playlist.indexOf(currentSong) : -1; if (currentVisibleIndex === -1) return; let prevVisibleIndex = currentVisibleIndex - 1; if (prevVisibleIndex < 0) { if (playerState.loop) prevVisibleIndex = playerState.playlist.length - 1; else return; } playTrack(prevVisibleIndex); }
    function playTrack(visibleIndexOrSongObject) { let indexToPlay = -1; if (typeof visibleIndexOrSongObject === 'number') { const song = playerState.playlist[visibleIndexOrSongObject]; if (song) { indexToPlay = playerState.fullPlaylist.indexOf(song); } } else if (typeof visibleIndexOrSongObject === 'object' && visibleIndexOrSongObject !== null) { indexToPlay = playerState.fullPlaylist.indexOf(visibleIndexOrSongObject); } if (indexToPlay >= 0 && indexToPlay < playerState.fullPlaylist.length) { loadTrack(indexToPlay, { shouldPlay: true }); } else if (playerState.loop && playerState.fullPlaylist.length > 0) { loadTrack(0, { shouldPlay: true }); } else { document.getElementById('amq-player-play').textContent = '▶'; saveState(); } }
    async function loadTrack(index, { startTime = 0, shouldPlay = false } = {}) { if (index < 0 || index >= playerState.fullPlaylist.length) { if (playerState.loop && playerState.fullPlaylist.length > 0) index = (index + playerState.fullPlaylist.length) % playerState.fullPlaylist.length; else { updatePlayerDisplay(); return; } } playerState.currentIndex = index; const song = playerState.fullPlaylist[index]; if (playerState.shuffleMode && song) { const songId = song.annSongId; if (!playerState.playHistory.includes(songId)) { playerState.playHistory.push(songId); } } updatePlayerDisplay(); updatePlayingTrackHighlight(); if (song) tryLoadMedia(song, 0, { startTime, shouldPlay }); }
    function tryLoadMedia(song, cdnIndex, { startTime, shouldPlay }) { const videoPlayer = document.getElementById('amq-video-player'); const newSource = (playerState.videoMode ? (song.HQ || song.MQ) : song.audio) || song.HQ || song.MQ || song.audio; if (!newSource) { showToast(`Media not found for: ${song.songName}`, 'error'); if (shouldPlay) playNextTrack(); return; } if (cdnIndex >= CDN_HOSTS.length) { showToast(`All CDNs failed for: ${song.songName}`, 'error'); if (shouldPlay) playNextTrack(); return; } videoPlayer.onerror = () => tryLoadMedia(song, cdnIndex + 1, { startTime, shouldPlay }); videoPlayer.onloadedmetadata = () => { videoPlayer.onerror = null; videoPlayer.currentTime = startTime; updateProgressBar(); if (shouldPlay) { videoPlayer.play().catch(e => {}).finally(saveState); } else { saveState(); } }; videoPlayer.src = newSource.startsWith('http') ? newSource : `${CDN_HOSTS[cdnIndex]}/${newSource}`; }

    // =================================================================================================
    // Helper Functions
    // =================================================================================================

    function sortSongs(songs) {
        const typeOrder = { 'OPENING': 1, 'ENDING': 2, 'INSERT': 3, 'INSSONG': 3 };

        const getSongInfo = (songType) => {
            if (!songType) return { type: 99, num: 99 };
            const upperType = songType.toUpperCase();
            let typeKey = Object.keys(typeOrder).find(key => upperType.startsWith(key));
            if (!typeKey) return { type: 99, num: 99 }; // Default for unknown types

            const order = typeOrder[typeKey];
            const numMatch = songType.match(/\d+/);
            const num = numMatch ? parseInt(numMatch[0], 10) : 99; // Songs without numbers go last

            return { type: order, num: num };
        };

        return songs.sort((a, b) => {
            const aInfo = getSongInfo(a.songType);
            const bInfo = getSongInfo(b.songType);

            if (aInfo.type !== bInfo.type) {
                return aInfo.type - bInfo.type;
            }
            return aInfo.num - bInfo.num;
        });
    }

    function getAnimeInfo(song, withParentheses = true) { if (!song) return ''; const { animeType, animeVintage } = song; const type = animeType || 'Anime'; let vintage = animeVintage || ''; if (withParentheses) { const yearMatch = vintage.match(/\d{4}/); vintage = yearMatch ? yearMatch[0] : ''; } const info = `${type}${vintage ? ` · ${vintage}` : ''}`; return withParentheses ? `(${info})` : info; }
    function getDisplayName(song) { if (!song) return ''; const { nameDisplayMode } = playerState; const { animeENName, animeJPName, animeAltName } = song; return (nameDisplayMode === 'EN' && animeENName) ? animeENName : (nameDisplayMode === 'ALT' && animeAltName) ? animeAltName : (animeJPName || animeENName || ''); }
    function getSongExtraInfo(song) { if (!song) return ''; return song.isDub ? ' <small style="color: #999;">(Dub)</small>' : song.isRebroadcast ? ' <small style="color: #999;">(Rebroadcast)</small>' : ''; }
    function formatSongType(songType) { if (!songType) return '<span style="font-weight: 700;">Song</span>'; const typeMap = { 'OPENING': { abbr: 'OP', color: '#66ccff' }, 'ENDING': { abbr: 'ED', color: '#ffb366' }, 'INSERT SONG': { abbr: 'INS', color: '#ffff66' }, 'INSSONG': { abbr: 'INS', color: '#ffff66' }, 'INSERT': { abbr: 'INS', color: '#ffff66' } }; const upperType = songType.toUpperCase(); for (const key in typeMap) { if (upperType.startsWith(key)) { const { abbr, color } = typeMap[key]; const rest = songType.substring(key.length).trim(); return `<span style="color: ${color}; font-weight: 700; font-style: italic;">${abbr}${rest}</span>`; } } return `<span style="font-weight: 700;">${songType}</span>`; }

    // =================================================================================================
    // UI Toggles & Modals
    // =================================================================================================

    function updatePlayerDisplay() { const song = playerState.fullPlaylist[playerState.currentIndex]; document.getElementById('amq-song-title').innerHTML = song ? `${song.songName}${getSongExtraInfo(song)}` : '--'; document.getElementById('amq-song-artist').textContent = song?.songArtist || '--'; document.getElementById('amq-anime-info').textContent = song ? `${getDisplayName(song)} ${song.animeInfo}` : '--'; }
    function showToast(message, type = 'info') { const toastContainer = document.getElementById('amq-toast-container'); const toast = document.createElement('div'); toast.className = `amq-toast ${type}`; toast.textContent = message; toastContainer.appendChild(toast); setTimeout(() => { toast.remove(); }, 5000); }
    function showConfirm(message, onConfirm) { const modal = document.getElementById('amq-confirm-modal'); document.getElementById('amq-confirm-message').textContent = message; modal.classList.remove('hidden'); const confirmBtn = document.getElementById('amq-modal-confirm-action'); const newConfirmBtn = confirmBtn.cloneNode(true); confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn); newConfirmBtn.onclick = () => { modal.classList.add('hidden'); onConfirm(); }; }
    function toggleSearchResultsPanel(show) { const searchPanel = document.getElementById('amq-search-results-panel'); if (searchPanel) { searchPanel.classList.toggle('open', show); } }
    function togglePanel() {
        playerState.isPanelOpen = !playerState.isPanelOpen;
        if (!playerState.isPanelOpen) {
            toggleSearchResultsPanel(false);
            if (playerState.isTheaterMode) {
                toggleTheaterMode();
            }
        }
        document.getElementById('amq-player-panel').classList.toggle('open', playerState.isPanelOpen);
        const toggleButton = document.getElementById('amq-player-toggle-button');
        if (playerState.isPanelOpen) {
            toggleButton.innerHTML = ICONS.PLAYER_HIDE;
            toggleButton.title = 'Hide Player';
        } else {
            toggleButton.innerHTML = ICONS.PLAYER_MAIN;
            toggleButton.title = 'Toggle AnisongDB Player';
        }
    }
    function togglePlayPause() { const videoPlayer = document.getElementById('amq-video-player'); if (!videoPlayer.currentSrc || videoPlayer.currentSrc === window.location.href) { if (playerState.playlist.length > 0) playTrack(0); return; } if (videoPlayer.paused) videoPlayer.play().catch(e => console.error("Play failed:", e.message)); else videoPlayer.pause(); setTimeout(saveState, 100); }
    function updateProgressBar() { const videoPlayer = document.getElementById('amq-video-player'); const progressBar = document.getElementById('amq-progress-bar'); const currentTimeEl = document.getElementById('amq-current-time'); const durationEl = document.getElementById('amq-duration'); progressBar.disabled = isNaN(videoPlayer.duration); if (progressBar.disabled) return; progressBar.value = (videoPlayer.currentTime / videoPlayer.duration) * 100; const formatTime = t => `${Math.floor(t/60)}:${Math.floor(t%60).toString().padStart(2,'0')}`; currentTimeEl.textContent = formatTime(videoPlayer.currentTime); durationEl.textContent = formatTime(videoPlayer.duration); updateAllPlayerControlsUI(); }
    function toggleLoop() { playerState.loop = !playerState.loop; updateAllPlayerControlsUI(); saveState(); }
    function toggleShuffleMode() { playerState.shuffleMode = !playerState.shuffleMode; if (playerState.shuffleMode) { playerState.playHistory = []; const currentSong = playerState.fullPlaylist[playerState.currentIndex]; if (currentSong) { playerState.playHistory.push(currentSong.annSongId); } showToast("Random Play enabled.", "success"); } else { showToast("Random Play disabled.", "info"); } updateAllPlayerControlsUI(); saveState(); }
    function toggleVideoMode() {
        const videoPlayer = document.getElementById('amq-video-player');
        const { currentTime } = videoPlayer;
        const wasPlaying = !videoPlayer.paused;

        if (playerState.videoMode && playerState.isTheaterMode) {
            toggleTheaterMode();
        }

        playerState.videoMode = !playerState.videoMode;
        updateAllPlayerControlsUI();
        if (!playerState.videoMode && document.pictureInPictureElement) document.exitPictureInPicture();
        const currentSong = playerState.fullPlaylist[playerState.currentIndex];
        if (currentSong) tryLoadMedia(currentSong, 0, { startTime: currentTime, shouldPlay: wasPlaying });
        else saveState();
    }
    function toggleTheaterMode() {
        playerState.isTheaterMode = !playerState.isTheaterMode;
        document.body.classList.toggle('amq-theater-active', playerState.isTheaterMode);

        const playerContainer = document.getElementById('amq-player-container');
        const theaterContainer = document.getElementById('amq-theater-player-container');
        const placeholder = document.getElementById('amq-player-placeholder');

        if (playerState.isTheaterMode) {
            theaterContainer.appendChild(playerContainer);
        } else {
            placeholder.appendChild(playerContainer);
        }

        updateAllPlayerControlsUI();
        saveState();
    }
    function toggleMute() { const videoPlayer = document.getElementById('amq-video-player'); const volumeSlider = document.getElementById('amq-volume-slider'); videoPlayer.muted = !videoPlayer.muted; if (videoPlayer.muted) volumeSlider.value = 0; else { if (videoPlayer.volume === 0) videoPlayer.volume = playerState.lastVolume; volumeSlider.value = videoPlayer.volume; } updateAllPlayerControlsUI(); saveState(); }
    async function clearPlaylist() { showConfirm("Are you sure you want to clear the entire playlist?", async () => { const videoPlayer = document.getElementById('amq-video-player'); videoPlayer.pause(); videoPlayer.src = ''; playerState.playlist = []; playerState.fullPlaylist = []; playerState.playHistory = []; playerState.currentIndex = -1; updatePlayerDisplay(); renderPlaylist(); await saveState(); showToast("Playlist cleared.", "info"); }); }
    function removeTrack(originalIndex) { if (originalIndex < 0 || originalIndex >= playerState.fullPlaylist.length) return; const songToRemove = playerState.fullPlaylist[originalIndex]; const historyIndex = playerState.playHistory.indexOf(songToRemove.annSongId); if (historyIndex > -1) { playerState.playHistory.splice(historyIndex, 1); } const wasPlaying = originalIndex === playerState.currentIndex; let visibleIndexToPlayAfterRemove = wasPlaying ? playerState.playlist.indexOf(songToRemove) : -1; playerState.fullPlaylist.splice(originalIndex, 1); if (!wasPlaying && originalIndex < playerState.currentIndex) playerState.currentIndex--; filterPlaylist(document.querySelector('.filter-btn.active')?.dataset.filter || 'all'); if (wasPlaying) { if (playerState.playlist.length > 0) { if (visibleIndexToPlayAfterRemove >= playerState.playlist.length) visibleIndexToPlayAfterRemove = playerState.playlist.length - 1; if (visibleIndexToPlayAfterRemove < 0) visibleIndexToPlayAfterRemove = 0; playTrack(visibleIndexToPlayAfterRemove); } else { const videoPlayer = document.getElementById('amq-video-player'); videoPlayer.pause(); videoPlayer.src = ''; playerState.currentIndex = -1; updatePlayerDisplay(); updatePlayingTrackHighlight(); } } else { updatePlayingTrackHighlight(); } saveState(); showToast(`Removed: ${songToRemove.songName}`, 'info'); }
    function toggleNameDisplay() { const modes = ['EN', 'JP', 'ALT']; playerState.nameDisplayMode = modes[(modes.indexOf(playerState.nameDisplayMode) + 1) % modes.length]; updateAllPlayerControlsUI(); renderPlaylist(); updatePlayerDisplay(); if (document.getElementById('amq-search-results-panel').classList.contains('open')) { const results = Array.from(groupedSearchResults.values()).flat(); const type = document.getElementById('amq-search-type-selector').value; displaySearchResults(results, type); } saveState(); }
    function updateAllPlayerControlsUI() {
        document.getElementById('amq-player-loop').classList.toggle('active', playerState.loop);
        document.getElementById('amq-player-shuffle').classList.toggle('active', playerState.shuffleMode);
        document.getElementById('amq-theater-mode-btn').classList.toggle('active', playerState.isTheaterMode);

        document.getElementById('amq-player-container').classList.toggle('video-mode', playerState.videoMode);
        const videoButton = document.getElementById('amq-video-toggle');
        videoButton.classList.toggle('active', playerState.videoMode);
        videoButton.querySelector('.icon-video').classList.toggle('hidden', playerState.videoMode);
        videoButton.querySelector('.icon-audio').classList.toggle('hidden', !playerState.videoMode);

        const { muted, volume } = document.getElementById('amq-video-player');
        const volButton = document.getElementById('amq-volume-button');
        const icons = { high: volButton.querySelector('.icon-vol-high'), low: volButton.querySelector('.icon-vol-low'), muted: volButton.querySelector('.icon-vol-muted') };
        Object.values(icons).forEach(i => i.classList.add('hidden'));
        volButton.classList.toggle('active', !muted && volume > 0);
        const iconToShow = muted || volume === 0 ? icons.muted : (volume <= 0.5 ? icons.low : icons.high);
        if (iconToShow) iconToShow.classList.remove('hidden');

        document.getElementById('amq-name-display-toggle').textContent = playerState.nameDisplayMode;
    }
    function filterPlaylist(filter) { document.querySelectorAll('.playlist-filters .filter-btn').forEach(btn => btn.classList.remove('active')); document.querySelector(`.filter-btn[data-filter="${filter}"]`).classList.add('active'); if (filter === 'all') { playerState.playlist = [...playerState.fullPlaylist]; } else { playerState.playlist = playerState.fullPlaylist.filter(song => { const songTypeUpper = song.songType?.toUpperCase(); if (!songTypeUpper) { return false; } if (filter === 'ED') { return songTypeUpper.startsWith('ENDING'); } return songTypeUpper.startsWith(filter.toUpperCase()); }); } renderPlaylist(); }
    async function togglePiP() {
        if (playerState.isTheaterMode) {
            toggleTheaterMode();
        }
        const videoPlayer = document.getElementById('amq-video-player');
        try {
            if (videoPlayer !== document.pictureInPictureElement) await videoPlayer.requestPictureInPicture();
            else await document.exitPictureInPicture();
        } catch (error) {
            showToast("PiP Error: " + error.message, "error");
        }
    }

    // =================================================================================================
    // Drag & Drop Logic
    // =================================================================================================

    function handleDragStart(e) { const target = e.target.closest('.playlist-item'); if (!target || !target.draggable) { e.preventDefault(); return; } playerState.draggedIndex = parseInt(target.dataset.originalIndex); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', playerState.draggedIndex); setTimeout(() => target.classList.add('dragging'), 0); }
    function handleDragOver(e) { e.preventDefault(); const mainDisplay = document.getElementById('amq-player-main-display'); if (!mainDisplay.querySelector('.dragging')) return; const afterElement = getDragAfterElement(mainDisplay, e.clientY); mainDisplay.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over')); if (afterElement && afterElement !== mainDisplay.querySelector('.dragging')) afterElement.classList.add('drag-over'); }
    function getDragAfterElement(container, y) { const draggableElements = [...container.querySelectorAll('.playlist-item:not(.dragging)')]; return draggableElements.reduce((closest, child) => { const box = child.getBoundingClientRect(); const offset = y - box.top - box.height / 2; return (offset < 0 && offset > closest.offset) ? { offset, element: child } : closest; }, { offset: Number.NEGATIVE_INFINITY }).element; }
    function handleDragLeave(e) { if (!e.currentTarget.contains(e.relatedTarget)) e.currentTarget.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over')); }
    function handleDrop(e) { e.preventDefault(); if (playerState.draggedIndex === -1) return; const afterElement = getDragAfterElement(document.getElementById('amq-player-main-display'), e.clientY); const draggedItem = playerState.fullPlaylist[playerState.draggedIndex]; const currentlyPlayingSong = playerState.fullPlaylist[playerState.currentIndex]; if (!draggedItem) return; playerState.fullPlaylist.splice(playerState.draggedIndex, 1); let newIndex; if (afterElement) { const droppedOnOriginalIndex = parseInt(afterElement.dataset.originalIndex); newIndex = playerState.fullPlaylist.findIndex(song => song.annSongId === playerState.playlist[droppedOnOriginalIndex].annSongId); } else { newIndex = playerState.fullPlaylist.length; } playerState.fullPlaylist.splice(newIndex, 0, draggedItem); playerState.currentIndex = playerState.fullPlaylist.indexOf(currentlyPlayingSong); filterPlaylist(document.querySelector('.filter-btn.active').dataset.filter); saveState(); }
    function handleDragEnd() { document.querySelectorAll('.dragging, .drag-over').forEach(el => el.classList.remove('dragging', 'drag-over')); playerState.draggedIndex = -1; }

    // =================================================================================================
    // Playlist Storage & Sharing
    // =================================================================================================

    function showSavePlaylistModal() { if (playerState.fullPlaylist.length === 0) { showToast("Playlist is empty.", "error"); return; } const modal = document.getElementById('amq-save-playlist-modal'); const input = document.getElementById('amq-save-playlist-name-input'); input.value = getDisplayName(playerState.fullPlaylist[0]) || 'New Playlist'; modal.classList.remove('hidden'); input.focus(); }
    async function handleSavePlaylist() { const name = document.getElementById('amq-save-playlist-name-input').value.trim(); if (!name) { showToast("Please enter a name.", "error"); return; } try { const savedPlaylists = await getCache(SAVED_PLAYLISTS_KEY); savedPlaylists[name] = playerState.fullPlaylist; await setCache(SAVED_PLAYLISTS_KEY, savedPlaylists); document.getElementById('amq-save-playlist-modal').classList.add('hidden'); showToast(`Playlist "${name}" saved!`, "success"); } catch (e) { showToast("Error saving playlist.", "error"); } }
    async function toggleLoadPlaylistPanel() { const loadPanel = document.getElementById('amq-load-playlist-panel'); const isVisible = !loadPanel.classList.contains('hidden'); if (isVisible) showContentPanel('amq-player-main-display'); else { await renderSavedPlaylists(); showContentPanel('amq-load-playlist-panel'); } }
    async function renderSavedPlaylists() { const listContainer = document.getElementById('amq-saved-playlists-list'); listContainer.innerHTML = ''; try { const savedPlaylists = await getCache(SAVED_PLAYLISTS_KEY); const names = Object.keys(savedPlaylists); if (names.length === 0) { listContainer.innerHTML = `<div class="placeholder" style="padding: 20px;">No saved playlists.</div>`; return; } names.sort().forEach(name => { const itemCount = savedPlaylists[name]?.length || 0; const item = document.createElement('div'); item.className = 'saved-playlist-item'; item.dataset.name = name; item.innerHTML = `<div class="saved-playlist-item-name"><b>${name}</b><small style="display: block; color: #888;">${itemCount} song${itemCount !== 1 ? 's' : ''}</small></div><div class="saved-playlist-item-actions"><button class="share-btn" title="Share Playlist">${ICONS.SHARE}</button><button class="delete-btn" title="Delete Playlist">${ICONS.TRASH}</button></div>`; listContainer.appendChild(item); }); } catch (e) { showToast("Error loading playlists.", "error"); } }
    async function loadPlaylistFromStorage(name) { try { const savedPlaylists = await getCache(SAVED_PLAYLISTS_KEY); const songs = savedPlaylists[name]; if (songs && Array.isArray(songs)) { loadRawPlaylist(songs); await toggleLoadPlaylistPanel(); showToast(`Loaded playlist: ${name}`, 'success'); } } catch (e) { showToast(`Error loading playlist "${name}".`, "error"); } }
    async function deletePlaylistFromStorage(name) { try { const savedPlaylists = await getCache(SAVED_PLAYLISTS_KEY); delete savedPlaylists[name]; await setCache(SAVED_PLAYLISTS_KEY, savedPlaylists); await renderSavedPlaylists(); showToast(`Deleted playlist "${name}".`, 'info'); } catch (e) { showToast(`Error deleting playlist "${name}".`, "error"); } }
    async function sharePlaylistToClipboard(playlistName) { try { const savedPlaylists = await getCache(SAVED_PLAYLISTS_KEY); const playlist = savedPlaylists[playlistName]; if (!playlist) { showToast(`Could not find playlist: ${playlistName}`, 'error'); return; } const encodedPlaylist = encodeData(playlist); await navigator.clipboard.writeText(encodedPlaylist); showToast('Share code copied to clipboard!', 'success'); } catch (e) { showToast('Could not copy to clipboard.', 'error'); } }
    async function shareCurrentPlaylistToClipboard() { if (playerState.fullPlaylist.length === 0) { showToast("Current playlist is empty.", "error"); return; } try { const encodedPlaylist = encodeData(playerState.fullPlaylist); await navigator.clipboard.writeText(encodedPlaylist); showToast('Share code for current playlist copied!', 'success'); } catch (e) { showToast('Could not copy to clipboard.', 'error'); } }
    async function handleImportFromClipboard() { try { const code = await navigator.clipboard.readText(); if (!code) { showToast('Clipboard is empty.', 'error'); return; } const decodedPlaylist = decodeData(code); if (!Array.isArray(decodedPlaylist) || decodedPlaylist.length === 0) { showToast('No valid playlist code found in clipboard.', 'error'); return; } const modal = document.getElementById('amq-add-replace-modal'); document.getElementById('amq-add-replace-title').textContent = 'Import from Clipboard'; document.getElementById('amq-add-replace-message').textContent = `Found ${decodedPlaylist.length} song(s). How would you like to add them?`; modal.classList.remove('hidden'); const addBtn = document.getElementById('amq-modal-add'); const replaceBtn = document.getElementById('amq-modal-replace'); const newAddBtn = addBtn.cloneNode(true); addBtn.parentNode.replaceChild(newAddBtn, addBtn); const newReplaceBtn = replaceBtn.cloneNode(true); replaceBtn.parentNode.replaceChild(newReplaceBtn, replaceBtn); const handleAction = (mode) => { modal.classList.add('hidden'); if (mode === 'add') { appendToPlaylist(decodedPlaylist); } else { loadRawPlaylist(decodedPlaylist); } }; newAddBtn.onclick = () => handleAction('add'); newReplaceBtn.onclick = () => handleAction('replace'); } catch (err) { showToast('Could not read from clipboard.', 'error'); console.error('Clipboard read error:', err); } }

    // =================================================================================================
    // Song Info Display (Hybrid: Popover for Playlist, Expandable for Search)
    // =================================================================================================

    async function fetchSongDetails(annSongId) { const payload = { song_id_filter: { search: [annSongId], match_mode: 0 } }; try { const response = await fetch(ANISONDB_API_URL, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); const results = await response.json(); if (results?.length > 0) { await setSongInCache(results[0]); return results[0]; } return null; } catch (error) { console.error("Fetch Song Details Error:", error); return null; } }

    function hideInfoPopover() { const popover = document.getElementById('amq-info-popover'); if (!popover.classList.contains('hidden')) { popover.classList.add('hidden'); document.querySelector('.info-track-btn.active')?.classList.remove('active'); } }

    async function toggleInfoPopover(infoBtn) {
        const popover = document.getElementById('amq-info-popover');
        const popoverContent = document.getElementById('amq-info-popover-content');
        const popoverArrow = popover.querySelector('.popover-arrow');
        const originalIndex = parseInt(infoBtn.dataset.originalIndex);
        const currentlyActive = infoBtn.classList.contains('active');
        document.querySelectorAll('.info-track-btn.active').forEach(btn => btn.classList.remove('active'));
        if (currentlyActive) { hideInfoPopover(); return; }
        const song = playerState.fullPlaylist[originalIndex];
        if (!song) { hideInfoPopover(); return; }

        popoverContent.innerHTML = '<p style="padding: 10px; text-align: center; color: var(--amq-grey);">Loading...</p>';
        popover.style.visibility = 'hidden'; popover.classList.remove('hidden'); infoBtn.classList.add('active');

        let fullSongData = await getSongFromCache(song.annSongId);
        if (!fullSongData || !fullSongData.artists) {
            const fetchedData = await fetchSongDetails(song.annSongId);
            if (fetchedData) {
                fullSongData = fetchedData;
            }
        }

        popoverContent.innerHTML = fullSongData ? createPopoverDetailsHtml(fullSongData) : '<p style="padding: 10px; text-align: center; color: var(--amq-grey);">Details could not be fetched.</p>';

        const popoverHeight = popover.offsetHeight;
        const itemRect = infoBtn.getBoundingClientRect();
        const panelRect = document.getElementById('amq-player-panel').getBoundingClientRect();
        let topPos = itemRect.top - panelRect.top;
        if (topPos + popoverHeight > panelRect.height) topPos = itemRect.bottom - panelRect.top - popoverHeight;
        topPos = Math.max(5, Math.min(topPos, panelRect.height - popoverHeight - 5));
        popover.style.top = `${topPos}px`;
        popover.style.visibility = 'visible';
        const arrowTop = (itemRect.top + itemRect.height / 2) - panelRect.top - topPos - 10;
        popoverArrow.style.top = `${Math.max(5, Math.min(popoverHeight - 25, arrowTop))}px`;
    }

    function createPopoverDetailsHtml(fullSongData) {
        const { linked_ids = {}, artists = [], animeENName, animeJPName, animeAltName, animeVintage, animeType, songName, songType, songComposer, songArranger, songDifficulty, songLength } = fullSongData;
        const formatTime = (s) => !s || isNaN(s) ? 'N/A' : `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;

        const linkHtml = Object.entries(linked_ids).map(([site, id]) => {
            if (!id) return '';
            const urls = { myanimelist: 'https://myanimelist.net/anime/', anidb: 'https://anidb.net/anime/', anilist: 'https://anilist.co/anime/', kitsu: 'https://kitsu.io/anime/' };
            return `<li><a href="${urls[site]}${id}" target="_blank" rel="noopener noreferrer">${site.charAt(0).toUpperCase() + site.slice(1)}</a></li>`;
        }).join('');

        let artistRows = [];
        if (artists.length > 0) {
            artists.forEach((artist, index) => {
                const members = artist.members || [];
                let artistNameAndToggle = `<b>${artist.names[0]}</b>`;
                if (members.length > 0) { artistNameAndToggle += ` <a href="#" class="members-toggle" data-target="members-container-${index}">[+${members.length} Members]</a>`; }
                artistRows.push(index === 0 ? `<b>Artists:</b><span>${artistNameAndToggle}</span>` : `<b></b><span>${artistNameAndToggle}</span>`);
                if (members.length > 0) { const memberListItems = members.map(member => `<li>${member.names[0]}</li>`).join(''); artistRows.push(`<b></b><span class="member-cell"><div class="members-container hidden" id="members-container-${index}"><ul>${memberListItems}</ul></div></span>`); }
            });
        }

        const animeInfoHtml = [ animeENName ? `<b>EN:</b><span>${animeENName}</span>` : '', animeJPName ? `<b>JP:</b><span>${animeJPName}</span>` : '', animeAltName ? `<b>Alt:</b><span>${animeAltName}</span>` : '', `<b>Vintage:</b><span>${animeVintage || 'N/A'}</span>`, `<b>Type:</b><span>${animeType || 'N/A'}</span>` ].filter(Boolean).join('');
        const songInfoHtml = [ `<b>Song Title:</b><span>${songName || 'N/A'}</span>`, `<b>Type:</b><span>${songType || 'N/A'}</span>`, ...artistRows, `<b>Composer:</b><span>${songComposer || 'N/A'}</span>`, `<b>Arranger:</b><span>${songArranger || 'N/A'}</span>`, `<b>Difficulty:</b><span>${songDifficulty || 'N/A'}</span>`, `<b>Length:</b><span>${formatTime(songLength)}</span>` ].filter(Boolean).join('');

        return `<div class="details-section"><h5>Song Info</h5><div class="details-grid">${songInfoHtml}</div></div><div class="details-section"><h5>Anime Info</h5><div class="details-grid">${animeInfoHtml}</div>${linkHtml ? `<ul class="link-list" style="margin-top: 12px; border-top: 1px solid var(--amq-grey); padding-top: 12px;">${linkHtml}</ul>` : ''}</div>`;
    }

    async function toggleSongInfoInSublist(songId, wrapperElement, infoBtn) {
        const existingDetails = wrapperElement.querySelector('.sub-item-details-container');
        infoBtn.classList.toggle('active');

        if (existingDetails) {
            existingDetails.classList.remove('expanded');
            setTimeout(() => existingDetails.remove(), 350);
            return;
        }

        let fullSongData = await getSongFromCache(songId);
        if (!fullSongData || !fullSongData.artists) {
            fullSongData = await fetchSongDetails(songId);
        }

        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'sub-item-details-container';
        detailsContainer.innerHTML = fullSongData ? createSongOnlyDetailsHtml(fullSongData) : '<p style="text-align: center; color: var(--amq-grey);">Details could not be fetched.</p>';
        wrapperElement.appendChild(detailsContainer);
        setTimeout(() => detailsContainer.classList.add('expanded'), 10);
    }

    function createSongOnlyDetailsHtml(fullSongData) {
        const { artists = [], songComposer, songArranger, songDifficulty, songLength } = fullSongData;
        const formatTime = (s) => !s || isNaN(s) ? 'N/A' : `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;

        let artistRows = [];
        if (artists.length > 0) {
            artists.forEach((artist, index) => {
                const members = artist.members || [];
                let artistNameAndToggle = `<b>${artist.names[0]}</b>`;
                if (members.length > 0) { artistNameAndToggle += ` <a href="#" class="members-toggle" data-target="members-container-${fullSongData.annSongId}-${index}">[+${members.length} Members]</a>`; }
                artistRows.push(`<b>Artists:</b><span class="col-2">${artistNameAndToggle}</span>`);
                if (members.length > 0) { const memberListItems = members.map(member => `<li>${member.names[0]}</li>`).join(''); artistRows.push(`<b class="col-2"></b><span class="member-cell col-2"><div class="members-container hidden" id="members-container-${fullSongData.annSongId}-${index}"><ul>${memberListItems}</ul></div></span>`); }
            });
        }

        const songInfoHtml = [
            ...artistRows,
            `<b>Composer:</b><span>${songComposer || 'N/A'}</span>`,
            `<b>Arranger:</b><span>${songArranger || 'N/A'}</span>`,
            `<b>Difficulty:</b><span class="col-1-value">${songDifficulty || 'N/A'}</span><b class="col-2-label">Length:</b><span class="col-2-value">${formatTime(songLength)}</span>`
        ].filter(Boolean).join('');

        return `<div class="details-section" style="margin-bottom: 0;">
                    <div class="details-grid">${songInfoHtml}</div>
                </div>`;
    }

    // =================================================================================================
    // AMQ Game Ranked
    // =================================================================================================

    function initializeGameIntegration() {
        if (window.location.hostname !== 'animemusicquiz.com') {
            return;
        }

        const targetNode = document.getElementById('quizPage');
        if (!targetNode) {
            console.log("[AnisongDB Player] quizPage not found. Game integration will not run.");
            return;
        }

        const playerPanel = document.getElementById('amq-player-panel');
        const toggleButton = document.getElementById('amq-player-toggle-button');
        const videoPlayer = document.getElementById('amq-video-player');

        const disablePlayerForRanked = () => {
            console.log('[AnisongDB Player] Ranked mode detected. Disabling player.');
            if (playerPanel) playerPanel.classList.add('hidden');
            if (toggleButton) toggleButton.classList.add('hidden');
            if (videoPlayer && !videoPlayer.paused) {
                videoPlayer.pause();
            }
        };

        const enablePlayer = () => {
            console.log('[AnisongDB Player] No longer in ranked mode. Re-enabling player.');
            if (playerPanel) playerPanel.classList.remove('hidden');
            if (toggleButton) toggleButton.classList.remove('hidden');
        };

        const config = { attributes: true, attributeFilter: ['class'] };

        const callback = function(mutationsList, observer) {
            for(const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isHidden = targetNode.classList.contains('hidden');
                    const quiz = typeof unsafeWindow !== 'undefined' ? unsafeWindow.quiz : window.quiz;
                    const isRanked = quiz?.gameMode === "Ranked";

                    if (!isHidden && isRanked) {
                        disablePlayerForRanked();
                    } else {
                        enablePlayer();
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);

        setTimeout(() => {
            const isInitiallyHidden = targetNode.classList.contains('hidden');
            const quiz = typeof unsafeWindow !== 'undefined' ? unsafeWindow.quiz : window.quiz;
            const isInitiallyRanked = quiz?.gameMode === "Ranked";

            if (!isInitiallyHidden && isInitiallyRanked) {
                disablePlayerForRanked();
            }
        }, 500);

        console.log("[AnisongDB Player] MutationObserver is now watching #quizPage for game state changes.");
    }


    initializePlayer();
    initializeGameIntegration();

})();
