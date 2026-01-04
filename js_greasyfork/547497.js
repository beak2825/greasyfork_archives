// ==UserScript==
// @name         RYM Display Track Ratings - Chrome
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Displays average Track ratings and info directly on rateyourmusic album or any other release pages.
// @author       garden
// @match        https://rateyourmusic.com/release/*
// @icon         https://e.snmc.io/2.5/img/sonemic.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/547497/RYM%20Display%20Track%20Ratings%20-%20Chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/547497/RYM%20Display%20Track%20Ratings%20-%20Chrome.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants
    const CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // Cache expiration time in milliseconds (7 days)
    const DEBUG_MODE = true; // Enable debug mode for logging
    const DEFAULT_DELAY = 500; // Default delay between requests in milliseconds

    const { getValue: gmGetValue, setValue: gmSetValue } = createGMStorageHelpers();

    // Variables to manage state
    let loadClickCount = 0; // Count of how many times "Load Track Ratings" has been clicked
    let trackDataCache = {}; // Cache populated during initialization
    let originalTrackOrder = {}; // Store original track order for sorting
    let currentSortState = 'original'; // 'original' or 'rating'
    let ratingsLoaded = false; // Track if ratings have been loaded

    // Fetch the global state of the "Toggle Genre/Rankings" button
    let genreRankingsVisible = true;

    // Fetch auto-load setting (default to true for new installations)
    let autoLoadEnabled = true;

    // Logging function for debug messages
    const log = (message) => {
        if (DEBUG_MODE) {
            console.log('[RYM Track Ratings]', message);
        }
    };

    function createGMStorageHelpers() {
        const gmObject = typeof GM !== 'undefined' ? GM : {};
        const hasLegacyGet = typeof GM_getValue === 'function';
        const hasLegacySet = typeof GM_setValue === 'function';
        const hasModernGet = typeof gmObject.getValue === 'function';
        const hasModernSet = typeof gmObject.setValue === 'function';

        async function getValue(key, defaultValue) {
            try {
                if (hasLegacyGet) {
                    return Promise.resolve(GM_getValue(key, defaultValue));
                }
                if (hasModernGet) {
                    const value = await gmObject.getValue(key);
                    return value !== undefined ? value : defaultValue;
                }
                if (typeof localStorage !== 'undefined') {
                    const raw = localStorage.getItem(key);
                    if (raw === null) {
                        return defaultValue;
                    }
                    try {
                        return JSON.parse(raw);
                    } catch (error) {
                        console.warn('[RYM Track Ratings] Failed to parse stored value for', key, error);
                        return raw;
                    }
                }
            } catch (error) {
                console.error('[RYM Track Ratings] Error retrieving value for', key, error);
            }
            return defaultValue;
        }

        async function setValue(key, value) {
            try {
                if (hasLegacySet) {
                    return Promise.resolve(GM_setValue(key, value));
                }
                if (hasModernSet) {
                    return gmObject.setValue(key, value);
                }
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(key, JSON.stringify(value));
                }
            } catch (error) {
                console.error('[RYM Track Ratings] Error storing value for', key, error);
            }
        }

        return { getValue, setValue };
    }

    // Show error notifications
    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.textContent = `Error: ${message}`;
        errorElement.style.color = 'red';
        errorElement.style.position = 'fixed';
        errorElement.style.top = '10px';
        errorElement.style.right = '10px';
        errorElement.style.backgroundColor = 'white';
        errorElement.style.padding = '5px';
        document.body.appendChild(errorElement);
        setTimeout(() => errorElement.remove(), 5000);
    }

    // Get album color from color_bar element
    function getAlbumColor() {
        const colorBar = document.querySelector('.color_bar');
        if (colorBar) {
            const style = colorBar.getAttribute('style');
            if (style) {
                // Extract color from style like "xborder:1px #83bbeb solid;"
                const match = style.match(/#([0-9a-fA-F]{6})/);
                if (match) {
                    return match[0];
                }
            }
        }
        return '#cba6f7'; // Fallback to original color
    }

    // Create a lighter/darker shade of a color
    function adjustColor(color, amount) {
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + amount));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
        const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
        return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    }

    const themeColorCache = new Map();

    // Read a CSS variable from the active theme with a fallback value
    function getThemeColor(variableName, fallback) {
        if (themeColorCache.has(variableName)) {
            return themeColorCache.get(variableName);
        }

        try {
            const computed = getComputedStyle(document.documentElement);
            const value = computed.getPropertyValue(variableName).trim();
            if (value) {
                themeColorCache.set(variableName, value);
                return value;
            }
        } catch (error) {
            log(`Failed to read CSS variable ${variableName}: ${error}`);
        }

        themeColorCache.set(variableName, fallback);
        return fallback;
    }

    // Create a button with specified text and click handler
    function createButton(text, onClick, className = '') {
        const albumColor = getAlbumColor();
        const hoverColor = adjustColor(albumColor, 40); // Lighter shade for hover
        
        const button = document.createElement('button');
        button.textContent = text;
        if (className) button.className = className;
        button.style.cssText = `
            padding: 3px;
            border: 0;
            border-radius: 2px;
            background: ${albumColor};
            cursor: pointer;
            font-size: 10px;
            color: white;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        `;
        button.addEventListener('mouseover', () => button.style.backgroundColor = hoverColor);
        button.addEventListener('mouseout', () => button.style.backgroundColor = albumColor);
        button.addEventListener('click', onClick);
        return button;
    }

    // Create buttons dynamically
    function createButtons(buttonsData) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 10px;
        `;

        buttonsData.forEach(({ text, onClick, className }) => {
            const button = createButton(text, onClick, className);
            buttonContainer.appendChild(button);
        });

        return buttonContainer;
    }

    // Create settings button with cogwheel icon
    function createSettingsButton() {
        const button = createButton('⚙', showSettingsModal, 'settings-button');
        button.title = 'Settings';
        button.setAttribute('aria-label', 'Settings');
        button.style.display = 'inline-flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.minWidth = '26px';
        button.style.padding = '3px';
        button.style.fontSize = '12px';
        button.style.lineHeight = '12px';
        return button;
    }

    // Show settings modal
    function showSettingsModal() {
        log('Settings button clicked');

        // Create modal backdrop
        const backdrop = document.createElement('div');
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Create modal content
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 8px;
            min-width: 300px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;

        const albumColor = getAlbumColor();
        
        modal.innerHTML = `
            <h3 style="margin-top: 0; color: #1a1a1a;">RYM Track Ratings Settings</h3>
            <label style="display: block; margin: 15px 0; cursor: pointer; color: #1a1a1a;">
                <input type="checkbox" id="autoLoadCheckbox" ${autoLoadEnabled ? 'checked' : ''} style="margin-right: 8px;">
                Auto-load track ratings on page load
            </label>
            <div style="margin: 20px 0; padding-top: 20px; border-top: 1px solid #e5e5e5;">
                <button id="clearCacheBtn" style="width: 100%; padding: 10px; border: 1px solid #dc2626; background: white; color: #dc2626; border-radius: 4px; cursor: pointer; font-weight: 500;">
                    Clear Cache
                </button>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #666;">Removes all cached track data</p>
            </div>
            <div style="margin-top: 20px; text-align: right;">
                <button id="cancelBtn" style="margin-right: 10px; padding: 8px 16px; border: 1px solid #999; background: white; color: #333; border-radius: 4px; cursor: pointer;">Cancel</button>
                <button id="saveBtn" style="padding: 8px 16px; border: 0; background: ${albumColor}; color: white; border-radius: 4px; cursor: pointer;">Save</button>
            </div>
        `;

        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);

        // Handle clear cache button
        modal.querySelector('#clearCacheBtn').addEventListener('click', async () => {
            await clearCache();
            document.body.removeChild(backdrop);
        });

        // Handle save button
        modal.querySelector('#saveBtn').addEventListener('click', async () => {
            const checkbox = modal.querySelector('#autoLoadCheckbox');
            autoLoadEnabled = checkbox.checked;
            await gmSetValue('autoLoadEnabled', autoLoadEnabled);
            log(`Auto-load setting saved: ${autoLoadEnabled}`);
            document.body.removeChild(backdrop);

            // Show confirmation
            const confirmElement = document.createElement('div');
            confirmElement.textContent = 'Settings saved!';
            confirmElement.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: #4ade80;
                color: white;
                padding: 10px;
                border-radius: 4px;
                z-index: 9999;
            `;
            document.body.appendChild(confirmElement);
            setTimeout(() => confirmElement.remove(), 3000);
        });

        // Handle cancel button and backdrop click
        const closeModal = () => document.body.removeChild(backdrop);
        modal.querySelector('#cancelBtn').addEventListener('click', closeModal);
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal();
        });
    }

    // Insert control buttons for loading track ratings and genres/rankings
    function insertButtons() {
        const trackContainers = [
            document.getElementById('tracks'),
            document.getElementById('tracks_mobile')
        ];

        trackContainers.forEach((tracksContainer) => {
            if (!tracksContainer) {
                log('Tracks container not found');
                return;
            }

            const buttonContainer = createButtons([
                { text: 'Load Track Ratings', onClick: toggleTrackRatings },
                { text: 'Toggle Genre/Rankings', onClick: toggleGenreRankings },
                { text: 'Sort by Rating', onClick: toggleSortOrder, className: 'sort-button' }
            ]);

            // Add settings button separately
            const settingsButton = createSettingsButton();
            buttonContainer.appendChild(settingsButton);

            tracksContainer.parentNode.insertBefore(buttonContainer, tracksContainer);
            log('Buttons inserted successfully');
        });
    }

    // Parse the rating and count from the track's HTML
    function parseTrackRating(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const ratingElement = doc.querySelector('.page_section_main_info_music_rating_value_rating');
        const countElement = doc.querySelector('.page_section_main_info_music_rating_value_number');
        if (!ratingElement || !countElement) {
            log('Failed to find rating or count elements in HTML');
            return null;
        }

        const rating = ratingElement.textContent.trim().match(/\d+\.\d+/)?.[0];
        const count = countElement.textContent.trim().match(/[\d,]+/)?.[0];
        const isBold = ratingElement.querySelector('img[alt="rating bolded"]') !== null;

        return { rating, count, isBold };
    }

    // Parse genre and rankings from the track's HTML
    function parseTrackInfo(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const genreElement = doc.querySelector('.page_song_header_info_genre_item_primary .genre');
        const genre = genreElement ? genreElement.outerHTML : null;

        const rankingElements = doc.querySelectorAll('.page_song_header_info_rest .comma_separated');
        const rankings = Array.from(rankingElements).map(el => el.outerHTML).join('<br>');

        return { genre, rankings };
    }

    // Create HTML for displaying the track rating
    function createRatingHTML(rating, count, isBold) {
        const starClass = isBold ? 'metadata-star-bold' : 'metadata-star';
        return `
            <span data-tiptip="${rating} from ${count} ratings" class="has_tip page_release_section_tracks_songs_song_stats significant">
                <span class="page_release_section_tracks_track_stats_scores" style="display:inline-flex;align-items:center;gap:6px;">
                    <span class="page_release_section_tracks_track_stats_score_star" style="display:inline-flex;align-items:center;gap:4px;">
                        <img alt="${isBold ? 'bold star' : 'star'}" class="${starClass}">
                        <span class="page_release_section_tracks_track_stats_rating" style="display:inline-flex;align-items:center;">${rating}</span>
                    </span>
                    <span aria-hidden="true" style="color:#64748b;">|</span>
                    <span class="page_release_section_tracks_track_stats_count" style="display:inline-flex;align-items:center;">${count}</span>
                </span>
            </span>
        `;
    }

    // Remove existing ratings from track elements
    function removeExistingRatings() {
        const existingRatings = document.querySelectorAll('.page_release_section_tracks_songs_song_stats');
        existingRatings.forEach(rating => {
            log('Removing existing rating element');
            rating.remove();
        });
    }

    // Insert track rating HTML into the track element
    function insertTrackRating(trackElement, rating, count, isBold) {
        // First remove any existing ratings in this track
        const existingRatings = trackElement.querySelectorAll('.page_release_section_tracks_songs_song_stats');
        existingRatings.forEach(rating => rating.remove());

        const tracklistLine = trackElement.querySelector('.tracklist_line');
        const trackNumber = trackElement.querySelector('.tracklist_num');
        if (tracklistLine && trackNumber) {
            const ratingElement = document.createElement('span');
            ratingElement.innerHTML = createRatingHTML(rating, count, isBold);
            tracklistLine.insertBefore(ratingElement, trackNumber);
            log('Successfully inserted rating for track');
        }
    }

    // Insert genre and rankings HTML into the track element
    function insertTrackInfo(trackElement, genre, rankings) {
        const tracklistLine = trackElement.querySelector('.tracklist_line');
        if (!tracklistLine || (!genre && !rankings)) {
            return;
        }

        const existingInfo = trackElement.querySelectorAll('.track-extra-info');
        existingInfo.forEach((el) => el.remove());

        const albumColor = getAlbumColor();
        const borderColor = adjustColor(albumColor, -20);
        const labelTextColor = getThemeColor('--text-secondary', adjustColor(albumColor, -60));
        const infoTextColor = getThemeColor('--text-primary', '#1f2937');

        const infoContainer = document.createElement('div');
        infoContainer.classList.add('track-extra-info');
        infoContainer.style.cssText = `
            margin-top: 4px;
            padding: 8px 10px;
            border-left: 2px solid ${borderColor};
            background: rgba(15, 23, 42, 0.03);
            display: grid;
            gap: 6px;
            font-size: 11px;
            color: ${infoTextColor};
        `;
        infoContainer.style.display = genreRankingsVisible ? 'grid' : 'none';

        const makeSection = (labelText, html) => {
            const section = document.createElement('span');
            section.style.cssText = `
                display: grid;
                gap: 2px;
            `;

            const label = document.createElement('span');
            label.textContent = `${labelText}:`;
            label.style.cssText = `
                font-weight: 600;
                text-transform: uppercase;
                font-size: 10px;
                letter-spacing: 0.04em;
                color: ${labelTextColor};
                opacity: 0.85;
            `;

            const content = document.createElement('span');
            content.innerHTML = html;
            content.style.cssText = `
                display: inline;
                line-height: 1.4;
            `;

            section.appendChild(label);
            section.appendChild(content);
            return section;
        };

        if (genre) {
            const genreWrapper = makeSection('Genres', genre);
            genreWrapper.classList.add('genre-info');
            infoContainer.appendChild(genreWrapper);
        }

        if (rankings) {
            const rankingWrapper = makeSection('Rankings', rankings);
            rankingWrapper.classList.add('ranking-info');
            infoContainer.appendChild(rankingWrapper);
        }

        if (infoContainer.childNodes.length > 0) {
            tracklistLine.appendChild(infoContainer);
        }
    }

    // Process the track data by fetching ratings and genre/rankings
    async function processTrackData(trackElement, index) {
        const songLink = trackElement.querySelector('a.song');
        if (!songLink) {
            log(`No song link found for track ${index + 1}`);
            return;
        }

        const trackName = songLink.textContent.trim();
        // Use the track URL as part of the cache key to ensure uniqueness across different artists/albums
        const trackUrl = songLink.href;
        const cacheKey = `rym_track_data_${trackUrl}`;
        const cachedData = trackDataCache[cacheKey];

        if (cachedData) {
            log(`Using cached data for "${trackName}"`);
            insertTrackRating(trackElement, cachedData.rating, cachedData.count, cachedData.isBold);
            insertTrackInfo(trackElement, cachedData.genre, cachedData.rankings);
            return;
        }

        try {
            log(`Fetching data for track: "${trackName}"`);

            log(`Making request to: ${songLink.href}`);
            const response = await fetch(songLink.href, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Cache-Control': 'no-cache'
                },
                mode: 'cors'
            });

            log(`Response status: ${response.status}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseText = await response.text();
            log(`Response received for: ${trackName}`);

            const trackRating = parseTrackRating(responseText);
            const trackInfo = parseTrackInfo(responseText);

            if (!trackRating || !trackInfo) {
                log(`Failed to fetch data for "${trackName}"`);
                return;
            }

            trackDataCache[cacheKey] = { ...trackRating, ...trackInfo, timestamp: Date.now() };
            await gmSetValue('trackDataCache', trackDataCache);
            insertTrackRating(trackElement, trackRating.rating, trackRating.count, trackRating.isBold);
            insertTrackInfo(trackElement, trackInfo.genre, trackInfo.rankings);
        } catch (error) {
            showError(`Failed to fetch data for "${trackName}". Please try again later.`);
            console.error(`Error processing "${trackName}":`, error);
        }

        await new Promise(resolve => setTimeout(resolve, DEFAULT_DELAY));
    }

    // Process all tracks on the current page
    async function processAllTracks() {
        // Remove any existing ratings first
        removeExistingRatings();

        const trackContainers = [
            document.getElementById('tracks'),
            document.getElementById('tracks_mobile')
        ];

        for (const tracksContainer of trackContainers) {
            if (!tracksContainer) {
                log('Could not find tracks container');
                return;
            }

            const tracks = tracksContainer.querySelectorAll('li.track');
            log(`Found ${tracks.length} tracks`);

            for (let i = 0; i < tracks.length; i++) {
                await processTrackData(tracks[i], i);
            }
        }

        ratingsLoaded = true;
        log('All ratings loaded, marking ratingsLoaded as true');
    }

    // Toggle the track ratings visibility and load/unload the data
    function toggleTrackRatings() {
        if (loadClickCount % 2 === 0) {
            log('Loading track ratings');
            processAllTracks();
        } else {
            log('Unloading track ratings');
            clearTrackRatings();
        }
        loadClickCount++;
    }

    // Clear the track ratings and additional data from the page
    function clearTrackRatings() {
        const ratingElements = document.querySelectorAll('.page_release_section_tracks_track_stats_scores');
        ratingElements.forEach(el => el.remove());

        const extraInfoContainers = document.querySelectorAll('.track-extra-info');
        extraInfoContainers.forEach(el => el.remove());

        const genreInfoElements = document.querySelectorAll('.genre-info');
        genreInfoElements.forEach(el => el.remove());

        const rankingInfoElements = document.querySelectorAll('.ranking-info');
        rankingInfoElements.forEach(el => el.remove());

        // Reset sorting state
        if (currentSortState === 'rating') {
            // Reset to original state without triggering the toggle
            currentSortState = 'original';
            updateSortButton('Sort by Rating');
        }
        ratingsLoaded = false;
        originalTrackOrder = {};
        currentSortState = 'original';

        log('Cleared track ratings and additional info, reset sorting state');
    }

    // Toggle visibility of genre/rankings
    async function toggleGenreRankings() {
        log('Toggle Genre/Rankings button clicked');
        genreRankingsVisible = !genreRankingsVisible;
        log(`genreRankingsVisible set to: ${genreRankingsVisible}`);
        await gmSetValue('genreRankingsVisible', genreRankingsVisible); // Save state globally

        // Hide or show genre/rankings based on the state
        const extraInfoContainers = document.querySelectorAll('.track-extra-info');
        if (extraInfoContainers.length > 0) {
            extraInfoContainers.forEach(el => {
                el.style.display = genreRankingsVisible ? 'grid' : 'none';
            });
            log(`Toggled ${extraInfoContainers.length} extra info containers`);
        } else {
            const genreInfoElements = document.querySelectorAll('.genre-info');
            const rankingInfoElements = document.querySelectorAll('.ranking-info');
            log(`Found ${genreInfoElements.length} genre elements and ${rankingInfoElements.length} ranking elements`);

            genreInfoElements.forEach(el => el.style.display = genreRankingsVisible ? 'block' : 'none');
            rankingInfoElements.forEach(el => el.style.display = genreRankingsVisible ? 'block' : 'none');
        }
        log(genreRankingsVisible ? 'Genres and rankings visible' : 'Genres and rankings hidden');
    }

    // Toggle between sorting by rating and track number
    function toggleSortOrder() {
        log(`Toggle sort clicked. Current state: ${currentSortState}`);
        
        if (!ratingsLoaded) {
            showError('Please load track ratings first');
            return;
        }

        const trackContainers = [
            document.getElementById('tracks'),
            document.getElementById('tracks_mobile')
        ];

        // Determine new state first
        const newState = currentSortState === 'original' ? 'rating' : 'original';
        log(`Switching from ${currentSortState} to ${newState}`);

        trackContainers.forEach((tracksContainer) => {
            if (!tracksContainer) return;
            
            if (newState === 'rating') {
                // Sort by rating
                const tracks = Array.from(tracksContainer.querySelectorAll('li.track'));
                if (tracks.length === 0) return;

                // Store original track elements if not already stored
                if (!originalTrackOrder.tracks) {
                    originalTrackOrder = {
                        container: tracksContainer,
                        tracks: tracks.map((track, index) => ({
                            element: track.cloneNode(true),
                            index: index
                        }))
                    };
                    log(`Stored ${originalTrackOrder.tracks.length} original tracks`);
                }

                // Sort by rating (highest first)
                const trackData = tracks.map(track => {
                    const ratingEl = track.querySelector('.page_release_section_tracks_track_stats_rating');
                    const rating = ratingEl ? parseFloat(ratingEl.textContent.trim()) : 0;
                    return { element: track, rating };
                });

                trackData.sort((a, b) => b.rating - a.rating);

                // Clear and reorder DOM elements
                tracks.forEach(track => track.remove());
                trackData.forEach(item => {
                    tracksContainer.appendChild(item.element);
                });

                log('Tracks sorted by rating');
            } else {
                // Restore original order (sort by track number)
                if (originalTrackOrder && originalTrackOrder.tracks) {
                    // Remove current tracks
                    const currentTracks = tracksContainer.querySelectorAll('li.track');
                    currentTracks.forEach(track => track.remove());
                    
                    // Restore original tracks in order
                    originalTrackOrder.tracks
                        .sort((a, b) => a.index - b.index)
                        .forEach(item => {
                            const clonedTrack = item.element.cloneNode(true);
                            tracksContainer.appendChild(clonedTrack);
                        });
                    
                    // Re-apply ratings that were loaded
                    const tracks = tracksContainer.querySelectorAll('li.track');
                    tracks.forEach(async (track) => {
                        const songLink = track.querySelector('a.song');
                        if (songLink) {
                            const trackUrl = songLink.href;
                            const cacheKey = `rym_track_data_${trackUrl}`;
                            const cachedData = trackDataCache[cacheKey];
                            
                            if (cachedData) {
                                insertTrackRating(track, cachedData.rating, cachedData.count, cachedData.isBold);
                                insertTrackInfo(track, cachedData.genre, cachedData.rankings);
                            }
                        }
                    });

                    log('Tracks restored to original order');
                }
            }
        });

        // Update state and button after processing all containers
        currentSortState = newState;
        updateSortButton(newState === 'rating' ? 'Sort by Track' : 'Sort by Rating');
        log(`State updated to: ${currentSortState}`);
    }

    // Update sort button text
    function updateSortButton(newText) {
        const sortButtons = document.querySelectorAll('.sort-button');
        log(`Found ${sortButtons.length} sort buttons to update to "${newText}"`);
        sortButtons.forEach(button => {
            button.textContent = newText;
            log(`Updated button text to: ${newText}`);
        });
    }

    // Clear cached data
    async function clearCache() {
        log('Clear Cache button clicked');
        trackDataCache = {};
        await gmSetValue('trackDataCache', trackDataCache);
        log('Cache cleared');

        // Show confirmation to user
        const confirmElement = document.createElement('div');
        confirmElement.textContent = 'Cache cleared successfully!';
        confirmElement.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #4ade80;
            color: white;
            padding: 10px;
            border-radius: 4px;
            z-index: 9999;
        `;
        document.body.appendChild(confirmElement);
        setTimeout(() => confirmElement.remove(), 3000);
    }

    // Get the cache data from GM storage or initialize it
    async function getCache() {
        const cachedData = await gmGetValue('trackDataCache', {});
        let parsedData = cachedData;
        if (typeof parsedData === 'string') {
            try {
                parsedData = JSON.parse(parsedData);
            } catch (error) {
                console.warn('[RYM Track Ratings] Could not parse cached data string', error);
                parsedData = {};
            }
        } else if (!parsedData || typeof parsedData !== 'object') {
            parsedData = {};
        }
        const now = Date.now();

        // Delete expired cache entries
        Object.keys(parsedData).forEach(key => {
            const entry = parsedData[key];
            if (now - entry.timestamp > CACHE_EXPIRATION) {
                delete parsedData[key];
            }
        });

        return parsedData;
    }

    async function init() {
        log('Script starting...');
        log('Current URL:', window.location.href);

        trackDataCache = await getCache();
        genreRankingsVisible = await gmGetValue('genreRankingsVisible', true);
        autoLoadEnabled = await gmGetValue('autoLoadEnabled', true);

        insertButtons();

        if (autoLoadEnabled) {
            log('Auto-load is enabled, loading track ratings...');
            setTimeout(() => {
                processAllTracks();
                loadClickCount++; // Update click count to reflect loaded state
            }, 1000); // Small delay to ensure page is fully loaded
        }
    }

    init().catch(error => {
        console.error('[RYM Track Ratings] Failed to initialize script', error);
    });
})();
