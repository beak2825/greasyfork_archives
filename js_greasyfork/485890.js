// ==UserScript==
// @name         Tidal Last.fm Scrobbles and Likes
// @namespace    tidal_lastfm_scrobbles_and_likes
// @version      60
// @description  Tighter integration between Tidal and Last.fm
// @match        https://listen.tidal.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.0/spark-md5.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485890/Tidal%20Lastfm%20Scrobbles%20and%20Likes.user.js
// @updateURL https://update.greasyfork.org/scripts/485890/Tidal%20Lastfm%20Scrobbles%20and%20Likes.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastFmApiKey = GM_getValue('lastFmApiKey', '371319cf7884f13ab8c2b93cbed670de');
    let lastFmApiSecret = GM_getValue('lastFmApiSecret', '0486033e3a77c3260fea6c4d70ce1f91');
    let lastFmApiSessionKey = GM_getValue('lastFmApiSessionKey', '');
    let lastFmUsername = GM_getValue('lastFmUsername', '');
    let playCountCache = {};
    let currentUrl = window.location.href;
    let currentPlayingTrackId = -1;
    let lastBlurTime = Date.now();
    let domObserver = new MutationObserver(handleMutations);

    GM_registerMenuCommand('Last.fm API Key', () => {
        lastFmApiKey = prompt('Please enter your Last.fm API key, or keep the default:', lastFmApiKey) || lastFmApiKey;
        GM_setValue('lastFmApiKey', lastFmApiKey);
    });

    GM_registerMenuCommand('Last.fm API Secret', () => {
        lastFmApiSecret = prompt('Please enter your Last.fm API secret, or keep the default:', lastFmApiSecret) || lastFmApiSecret;
        GM_setValue('lastFmApiSecret', lastFmApiSecret);
    });

    GM_registerMenuCommand('Last.fm Logout', () => {
        GM_setValue('lastFmApiSessionKey', '');
    });

    // If the page was not open for 5 minutes, force refetch stats, maybe user scrobbled something
    function handleVisibilityChange() {
        if (!document.hidden && (Date.now() - lastBlurTime) > 300000) { // 5 minutes
            // GM_log('Page was hidden for more than 5 minutes, force refetch stats');
            resetAndRedraw();
        } else {
            lastBlurTime = Date.now();
        }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

    function startObserving() {
        domObserver.observe(document.querySelector('body'), { childList: true, subtree: true, attributes: true });
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
                return {
                    playCount: data.track.userplaycount,
                    loved: data.track.userloved
                };
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
        // GM_log(`forceFetch: ${forceFetch}, hasCache: ${!playCountCache.hasOwnProperty(cacheKey)}`);
        if (forceFetch || !playCountCache.hasOwnProperty(cacheKey)) {
            playCountCache[cacheKey] = {
                playCount: -1,
                loved: -1
            };

            const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${lastFmApiKey}&artist=${encodeURIComponent(artistName)}&track=${encodeURIComponent(trackName)}&username=${lastFmUsername}&autocorrect=0&format=json`;

            fetch(url).then(processLastFmResponse).then(result => {
                // GM_log(`${artistName} - ${trackName}  ${url} -> ${result.playCount}, ${result.loved}`);

                playCountCache[cacheKey] = result;
                drawPlayCounts(); // Update the UI with the new value
            }).catch(error => {
                console.error('Error fetching play count from Last.fm: ', error);
                GM_log(`Error fetching play count from Last.fm: ${error}`);
                delete playCountCache[cacheKey];
                delayedFetchPlayCount(artistName, trackName, /*forceFetch*/ false, 5000);
            });
        }

        return playCountCache[cacheKey];
    }

    // Unlove logic is implemented, but not used for simplicity
    async function setLastFmLoveStatus(trackName, artistName, shouldLove) {
        const cacheKey = getCacheKey(artistName, trackName);
        // Fetching play count should happen before that function. Otherwise weird race conditions can happen.
        if (!playCountCache.hasOwnProperty(cacheKey) || playCountCache[cacheKey].loved == -1 || playCountCache[cacheKey].loved == shouldLove) {
            return;
        }
        playCountCache[cacheKey].loved = -1;
        // GM_log(`Toggling Last.fm love status for ${artistName} - ${trackName} to ${shouldLove ? 'love' : 'unlove'}`);

        // Determine the method based on whether we are loving or unloving the track
        const method = shouldLove ? 'track.love' : 'track.unlove';

        // Prepare the parameters for the API call
        const params = {
            api_key: lastFmApiKey,
            method: method,
            track: trackName,
            artist: artistName,
            sk: lastFmApiSessionKey // The session key you've previously obtained
        };

        // Generate the API signature
        const apiSig = generateApiSignature(params, lastFmApiSecret); // Assuming you have a function to generate the signature

        // Add the api_sig and format to the parameters
        params.api_sig = apiSig;
        params.format = 'json';

        // Make the API call to love/unlove the track
        const url = 'https://ws.audioscrobbler.com/2.0/';
        const formData = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            formData.append(key, value);
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            GM_log(`Last.fm ${method} request: ${JSON.stringify(data)}`);

            if (data.error) {
                throw new Error(`Error in Last.fm ${method} request: ${data.message}`);
            }
            playCountCache[cacheKey].loved = shouldLove;
            drawPlayCounts();
        } catch (error) {
            GM_log(`Error in Last.fm ${method} request: ${error}`);
            delete playCountCache[cacheKey];
            delayedFetchPlayCount(artistName, trackName, /*forceFetch*/ false, 1000);
            console.error('Last.fm request failed:', error);
        }
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
            // GM_log(`URL changed, resetting cache and redrawing.`);
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
                    // GM_log(`Track changed, refreshing play count.`);
                    resetAndRedraw();
                }, 3000); // Last.fm updates stats only after a second or two
            }
            currentPlayingTrackId = nowPlayingTrackId;
        }
    }

    function getTrackLink(artistName, trackName) {
        return `https://www.last.fm/user/${lastFmUsername}/library/music/${encodeURIComponent(artistName)}/_/${encodeURIComponent(trackName)}`;
    }

    // Html element with play count to be inserted into the DOM
    function createPlayCountElement(artistName, trackName) {
        const container = document.createElement('a');
        container.className = 'play-count-container';
        // container.href can change, when a tracks move in the list, so we set it in drawPlayCounts()
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

        const isOnFavoritesPage = window.location.href === 'https://listen.tidal.com/my-collection/tracks';

        document.querySelectorAll('[data-track-id]').forEach(track => {
            const favoriteButton = track.querySelector('[data-test="add-to-favorites-button"]');
            if (!favoriteButton) {
                return;
            }

            const { artistName, trackName } = getArtistAndTrackNames(track);
            const playCountElement = createOrGetPlayCountElement(track, artistName, trackName);
            const { playCount, loved } = getCachedPlayCount(artistName, trackName, /*forceFetch*/ false);

            playCountElement.href = getTrackLink(artistName, trackName);
            const textElement = playCountElement.querySelector('span');
            textElement.textContent = playCount === -1 ? '?' : (playCount > 0 ? playCount.toString() : '\u00A0\u00A0');

            if (loved == 1) {
                favoriteButton.classList.add('make-it-red');
            } else if (loved == 0) {
                favoriteButton.classList.remove('make-it-red');
            }

            const favorited = favoriteButton.getAttribute('aria-checked') === 'true';
            if (favorited) {
                // We don't unlove Last.fm tracks ever for simplicity
                setLastFmLoveStatus(trackName, artistName, favorited);
            }
        });

        startObserving();
    }

    function handleMutations(mutations) {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                manageCache();
                drawPlayCounts();
            }
            // When we like/unlike a track, the mutation above isn't triggered, but this one is
            if (mutation.type === 'attributes' && mutation.attributeName === 'aria-checked') {
                drawPlayCounts();
            }
        });
    }

    // Function to fetch the session key
    async function fetchSessionKey(apiKey, secret, token) {
        const params = {
            api_key: apiKey,
            method: 'auth.getSession',
            token: token // The token received from the callback URL
        };

        const apiSig = await generateApiSignature(params, secret);
        params.api_sig = apiSig;

        const url = 'https://ws.audioscrobbler.com/2.0/';
        const formData = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            formData.append(key, value);
        }
        formData.append('format', 'json'); // Specify the response format

        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.error) {
            throw new Error(`Error fetching session key: ${data.error}, message: ${data.message}`);
        }

        lastFmApiSessionKey = data.session.key;
        GM_setValue('lastFmApiSessionKey', lastFmApiSessionKey);

        lastFmUsername = data.session.name;
        GM_setValue('lastFmUsername', lastFmUsername);
    }

    function generateApiSignature(params, secret) {
        const orderedParams = {};
        Object.keys(params).sort().forEach(function (key) {
            orderedParams[key] = params[key];
        });

        let concatenatedParams = '';
        for (let key in orderedParams) {
            concatenatedParams += key + orderedParams[key];
        }

        concatenatedParams += secret;

        return md5(concatenatedParams);
    }

    function md5(message) {
        return SparkMD5.hash(message);
    }

    function authenticateWithLastFm() {
        const callbackUrl = encodeURIComponent(window.location.href.split('#')[0]); // Remove any existing hash
        const authUrl = `http://www.last.fm/api/auth/?api_key=${lastFmApiKey}&cb=${callbackUrl}`;
        window.location.href = authUrl;
    }

    // Function to check for a token in the URL parameters and remove it
    function checkForToken() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            window.history.pushState({}, document.title, window.location.pathname + window.location.hash);

            fetchSessionKey(lastFmApiKey, lastFmApiSecret, token)
                .then(() => {
                    startTrackingMutations();
                })
                .catch(error => {
                    GM_log(`Error fetching session key: ${error}`);
                    authenticateWithLastFm();
                });

            return true;
        }
        return false;
    }

    function startTrackingMutations() {
        manageCache();
        drawPlayCounts();
    }

    const style = document.createElement('style');
    style.textContent = `
        .make-it-red svg {
            color: #f88 !important;
        }
    `;
    document.head.appendChild(style);

    if (lastFmApiSessionKey) {
        // GM_log(`Last.fm session key: ${lastFmApiSessionKey}`);
        startTrackingMutations();
    } else if (!checkForToken()) {
        GM_log('Last.fm session key not found, authenticating...');
        authenticateWithLastFm();
    }

})();
