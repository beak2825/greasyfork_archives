// ==UserScript==
// @name         Tidal Last.fm Scrobble Tracker
// @namespace    tidal_lastfm_scrobble_tracker
// @version      16
// @description  Show your Last.fm scrobbles next to each track in Tidal
// @match        https://listen.tidal.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484940/Tidal%20Lastfm%20Scrobble%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/484940/Tidal%20Lastfm%20Scrobble%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastFmApiKey = GM_getValue('lastFmApiKey', '371319cf7884f13ab8c2b93cbed670de');
    let lastFmUsername = GM_getValue('lastFmUsername', '');
    let playCountCache = {};
    let currentUrl = window.location.href;
    let currentPlayingTrackId = -1;
    let lastBlurTime = Date.now();
    let domObserver = new MutationObserver(handleMutations);

    function askForUsername() {
        lastFmUsername = prompt('Please enter your Last.fm username for Tidal Last.fm Enhancer.\nThis username will be remembered for future use:', lastFmUsername) || lastFmUsername;
        GM_setValue('lastFmUsername', lastFmUsername);
    }

    GM_registerMenuCommand('Last.fm Username', () => {
        askForUsername()
    });

    GM_registerMenuCommand('Last.fm API Key', () => {
        lastFmApiKey = prompt('Please enter your Last.fm API key, or keep the default:', lastFmApiKey) || lastFmApiKey;
        GM_setValue('lastFmApiKey', newApiKey);
    });

    // If the page was not open for 5 minutes, force refetch stats, maybe user scrobbled something
    function handleVisibilityChange() {
        if (!document.hidden && (Date.now() - lastBlurTime) > 300000) { // 5 minutes
            resetAndRedraw();
        } else {
            lastBlurTime = Date.now();
        }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

    function startObserving() {
        domObserver.observe(document.querySelector('body'), { childList: true, subtree: true });
    }

    function stopObserving() {
        domObserver.disconnect();
    }

    // Clear cache, fetch everything again and redraw. Call when we think that something changed.
    function resetAndRedraw() {
        playCountCache = {};
        drawPlayCounts();
        lastBlurTime = Date.now();
    }

    function processLastFmResponse(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json().then(data => {
            if (data && data.track && typeof data.track.userplaycount !== 'undefined') {
                return data.track.userplaycount;
            } else {
                throw new Error('Invalid response format or missing userplaycount');
            }
        });
    }

    function getCacheKey(artistName, trackName) {
        return `artist:${encodeURIComponent(artistName)},track:${encodeURIComponent(trackName)}`;
    }

    function delayedFetchPlayCount(artistName, trackName, forceFetch, delay) {
        setTimeout(() => {
            getCachedPlayCount(artistName, trackName, forceFetch); // Force fetch
        }, delay);
    }

    function getCachedPlayCount(artistName, trackName, forceFetch) {
        const cacheKey = getCacheKey(artistName, trackName);

        if (forceFetch || !playCountCache.hasOwnProperty(cacheKey)) {
            playCountCache[cacheKey] = -1; // Indicate that the value is being fetched

            const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${lastFmApiKey}&artist=${encodeURIComponent(artistName)}&track=${encodeURIComponent(trackName)}&username=${lastFmUsername}&autocorrect=0&format=json`;

            fetch(url).then(processLastFmResponse).then(playCount => {
                // GM_log(`getCachedPlayCount: ${url} -> ${playCount}`);
                playCountCache[cacheKey] = playCount;
                drawPlayCounts(); // Update the UI with the new value
            }).catch(error => {
                console.error('Error fetching play count from Last.fm: ', error);
                delete playCountCache[cacheKey];
                delayedFetchPlayCount(artistName, trackName, /*forceFetch*/ false, 5000);
            });
        }

        return playCountCache[cacheKey];
    }

    // Get currently played track ID from the footer
    function getNowPlayingTrackId() {
        const trackInfoElement = document.querySelector('[data-test="left-column-footer-player"]');
        const nowPlayingTrackId = trackInfoElement && trackInfoElement.hasAttribute('data-track--content-id')
                                  ? trackInfoElement.getAttribute('data-track--content-id')
                                  : -1;
        return nowPlayingTrackId;
    }

    // We redraw everything on url change, or on currently played track change
    function manageCache() {
        if (currentUrl !== window.location.href) {
            resetAndRedraw();
            currentUrl = window.location.href;
        }

        // In the footer, where current played track is, it's hard to find actual track name
        // Because some tracks have version and it displayed there, for example "Spectra (Live)"
        const nowPlayingTrackId = getNowPlayingTrackId();
        // GM_log(`Now playing track ID: ${nowPlayingTrackId}`);

        if (nowPlayingTrackId !== currentPlayingTrackId) {
            if (currentPlayingTrackId !== -1) {
                // GM_log(`Track changed, refreshing play count after delay.`);
                setTimeout(() => {
                    resetAndRedraw();
                }, 3000); // Last.fm updates stats only after a second or two
            }
            currentPlayingTrackId = nowPlayingTrackId;
        }
    }

    // Html element with play count to be inserted into the DOM
    function createPlayCountElement(artistName, trackName) {
        const container = document.createElement('a');
        container.className = 'play-count-container';
        container.href = `https://www.last.fm/user/${lastFmUsername}/library/music/${encodeURIComponent(artistName)}/_/${encodeURIComponent(trackName)}`;
        container.target = '_blank'; // Open in a new tab

        // Flex container for consistent sizing
        const flexElement = document.createElement('div');
        flexElement.style.display = 'flex';
        flexElement.style.justifyContent = 'center';
        flexElement.style.alignItems = 'center';
        flexElement.style.width = '1em'; // Set fixed width to 1em
        flexElement.style.height = '100%';
        flexElement.style.marginLeft = '4px'; // Add 4px left margin

        // Add text content
        const textElement = document.createElement('span');
        flexElement.appendChild(textElement);

        container.appendChild(flexElement);
        return container;
    }

    function createOrGetPlayCountElement(track, artistName, trackName) {
        let playCountElement = track.querySelector('.play-count-container');
        if (playCountElement) {
            return playCountElement;
        }

        playCountElement = createPlayCountElement(artistName, trackName);
        const favoriteButton = track.querySelector('[data-test="add-to-favorites-button"]');
        if (favoriteButton) {
            favoriteButton.parentNode.insertBefore(playCountElement, favoriteButton);

            // Make cell around favorite button big enough to accomodate play count
            const flexContainer = favoriteButton.closest('div[role="cell"]');
            if (flexContainer) {
                flexContainer.style.flex = '0 0 130px';
            }
        }
        return playCountElement;
    }

    function getArtistAndTrackNames(track) {
        const trackNameElement = track.querySelector('[data-test="table-cell-title"]');
        const artistNameElements = track.querySelectorAll('[data-test="track-row-artist"] a');

        // childNodes[0] to ignore something like that: Spectra <span>(Live)</span>
        const trackName = trackNameElement ? trackNameElement.childNodes[0].textContent.trim() : '';
        const artistName = artistNameElements.length > 0 ? Array.from(artistNameElements).map(el => el.textContent.trim()).join(', ') : '';

        return { artistName, trackName };
    }

    function drawPlayCounts() {
        stopObserving(); // to not trigger mutation observer with our changes

        // GM_log('drawPlayCounts');
        document.querySelectorAll('[data-track-id]').forEach(track => {
            const { artistName, trackName } = getArtistAndTrackNames(track);
            const playCountElement = createOrGetPlayCountElement(track, artistName, trackName);
            const playCount = getCachedPlayCount(artistName, trackName, /*forceFetch*/ false);

            const textElement = playCountElement.querySelector('span');
            textElement.textContent = playCount === -1 ? '?' : (playCount > 0 ? playCount.toString() : '\u00A0\u00A0');
        });

        startObserving();
    }

    function handleMutations(mutations) {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                manageCache();
                drawPlayCounts();
            }
        });
    }

    if (!lastFmUsername) { // Displaying annoying prompt on the first load
        askForUsername();
    }

    manageCache(); // To init some cache-related globals
    drawPlayCounts(); // Starts domObserver inside
})();
