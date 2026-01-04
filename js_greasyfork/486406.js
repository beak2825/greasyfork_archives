// ==UserScript==
// @name         YouTube / Spotify Playlists Converter
// @version      7.3
// @description  Convert your music playlists between YouTube & Spotify with a single click.
// @author       bobsaget1990
// @match        https://www.youtube.com/*
// @match        https://music.youtube.com/*
// @match        https://open.spotify.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @connect      spotify.com
// @connect      youtube.com
// @connect      accounts.google.com
// @icon64       https://i.imgur.com/zjGIQn4.png
// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @license      GNU GPLv3
// @namespace https://greasyfork.org/users/1254768
// @downloadURL https://update.greasyfork.org/scripts/486406/YouTube%20%20Spotify%20Playlists%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/486406/YouTube%20%20Spotify%20Playlists%20Converter.meta.js
// ==/UserScript==
(async () => {
    // UI FUNCTIONS:
    function createUI(operations) {
        function createSpanElements(textContent) {
            const spanElements = [];
            for (let i = 0; i < textContent.length; i++) {
                const span = document.createElement("span");
                span.textContent = textContent[i];
                span.classList.add(`op-${i}`);
                spanElements.push(span);
            }
            return spanElements;
        }

        function createButton(className, textContent, clickHandler) {
            const button = document.createElement('button');
            button.classList.add(className);
            button.textContent = textContent;
            button.onclick = clickHandler;
            return button;
        }

        function reloadPage() {
            location.reload();
        }

        // Remove existing UI
        const existingUI = document.querySelector('div.floating-div');
        if (existingUI) existingUI.remove();

        const floatingDiv = document.createElement('div');
        floatingDiv.classList.add('floating-div');

        const centerDiv = document.createElement('div');
        centerDiv.classList.add('center-div');

        const cancelButton = createButton('cancel-button', 'Cancel', reloadPage);
        const closeButton = createButton('close-button', '×', reloadPage); // Unicode character for the close symbol

        // Add UI to the page
        document.body.appendChild(floatingDiv);
        floatingDiv.appendChild(centerDiv);
        floatingDiv.appendChild(cancelButton);
        floatingDiv.appendChild(closeButton);
        floatingDiv.style.display = 'flex';

        // Add operations
        const spanElements = createSpanElements(operations);
        centerDiv.append(...spanElements);

        // CSS
        const css = `
        .floating-div {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9999;
          width: 400px;
          height: auto;
          display: none;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          border-radius: 10px;
          box-shadow: 0 0 0 1px #3a3a3a;
          background-color: #0f0f0f;
          line-height: 50px;
        }

        .center-div span {
          display: block;
          height: 30px;
          margin: 10px;
          font-family: 'Roboto', sans-serif;
          font-size: 14px;
          color: white;
          opacity: 0.3;
        }

        .cancel-button {
          width: auto;
          height: 30px;
          padding-left: 25px;
          padding-right: 25px;
          margin-top: 20px;
          margin-bottom: 20px;
          background-color: white;
          color: #0f0f0f;
          border-radius: 50px;
          border: unset;
          font-family: 'Roboto', sans-serif;
          font-size: 16px;
        }

        .cancel-button:hover {
          box-shadow: inset 0px 0px 0 2000px rgba(0,0,0,0.25);
        }

        .cancel-button:active {
          box-shadow: inset 0px 0px 0 2000px rgba(0,0,0,0.5);
        }

        .close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            background-color: #393939;
            color: #7e7e7e;
            border: unset;
            font-family: math;
            font-size: 17px;
            text-align: center;
        }

        .close-button:hover {
          box-shadow: inset 0px 0px 0 2000px rgba(255,255,255,0.05);
        }

        .close-button:active {
          box-shadow: inset 0px 0px 0 2000px rgba(255,255,255,0.1);
        }`;

        // Add the CSS to the page
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        return {
            floatingDiv: floatingDiv,
            centerDiv: centerDiv,
            cancelButton: cancelButton,
            closeButton: closeButton
        };
    }

    // Fix 'TrustedHTML' assignment exception, ref: https://greasyfork.org/en/discussions/development/220765-this-document-requires-trustedhtml-assignment
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
            window.trustedTypes.createPolicy('default', {
                createHTML: (string, sink) => string
            });
        } catch (error) {
            console.error(error);
        }
    }

    function closeConfirmation(event) {
        event.preventDefault();
        event.returnValue = null;
        return null;
    }

    function CustomError(obj) {
        this.response = obj.response;
        this.message = obj.message;
        this.details = obj.details;
        this.url = obj.url;
        this.popUp = obj.popUp;
    }
    CustomError.prototype = Error.prototype;

    function errorHandler(error) {
        // Add parentheses if details is not empty
        const errorDetails = error.details ? `(${error.details})` : '';
        if (error.popUp) {
            alert(`⛔ ${error.message} ${errorDetails}`);
        }
    }


    // GLOBALS:
    let address = window.location.href;
    const subdomain = address.slice(8).split('.')[0];
    const playlistIdRegEx = {
        YouTube: /list=([^&]*)/,
        Spotify: { playlist: /playlist\/(.{22})/, saved: /collection\/tracks/ }
    };

    function addressChecker(address) {
        const isYouTube = address.includes('www.youtube.com');
        const isYouTubeMusic = address.includes('music.youtube.com');
        const isSpotify = address.includes('open.spotify.com');

        const isYouTubePlaylist = (isYouTube || isYouTubeMusic) && playlistIdRegEx.YouTube.test(address);

        const isSpotifyPlaylist = isSpotify && Object.values(playlistIdRegEx.Spotify).some(regex => regex.test(address));
        return {
            isYouTube,
            isYouTubeMusic,
            isYouTubePlaylist,
            isSpotify,
            isSpotifyPlaylist
        };
    }

    let page = addressChecker(address);

    function stringCleanup(input, options) {
        const defaultOptions = [
            'removeSymbol',
            'removeDiacritics',
            'toLowerCase',
            'removeBrackets',
            'removeUnwantedChars',
            'removeAllParentheses'
        ];
        // Use default options if none are passed
        options = options ? options : defaultOptions;
        const operations = {
            removeSymbol: inputString => inputString.replace(/・.+?(?=$|-)/,' '),
            removeDiacritics: inputString => inputString.normalize("NFKD").replace(/[\u0300-\u036f]/g, ''),
            toLowerCase: inputString => inputString.toLowerCase(),
            removeQuotes: inputString => inputString.replace(/"/g, ""),
            removeBrackets: inputString => inputString.replace(/(?:\[|【).+?(?:\]|】)/g, ''),
            removeAllParentheses: inputString => inputString.replace(/\([^)]+\)/g, ''),
            // Removes parentheses and its content if the content includes a space character, otherwise, just removes the parentheses
            removeParentheses: inputString => inputString.replace(/\(([^)]+)\)/g, (match, contents) => contents.includes(' ') ? '' : contents),
            removeDashes: inputString => inputString.replace(/(?<=\s)-(?=\s)/g, ''),
            removeUnwantedChars: inputString => inputString.replace(/[^\p{L}0-9\s&\(\)]+/ug, ''),
            removeUnwantedWords: inputString => {
                const unwantedWords = ['ft\\.?', 'feat\\.?', 'official'];
                const modifiedString = unwantedWords.reduce((str, pattern) => {
                    const regex = new RegExp('\\b' + pattern + '(?!\w)', 'gi');
                    return str.replace(regex, ' ');
                }, inputString);
                return modifiedString;
            }
        };

        if (typeof input === 'string') {
            return cleanup(input, options);
        } else if (Array.isArray(input)) {
            return input.map(inputString => cleanup(inputString, options));
        } else {
            console.error('Invalid input type. Expected string or array of strings.');
        }

        function cleanup(inputString, options) {
            try {
                for (const option of options) {
                    if (operations[option]) {
                        inputString = operations[option](inputString);
                    }
                }

                inputString = inputString.replace(/ {2,}/g, " ").trim(); // Remove extra spaces and trim

                return inputString;
            } catch (error) {
                console.error(error);
            }
        }
    }

    function compareArrays(arr1, arr2) {
        for (let item1 of arr1) {
            for (let item2 of arr2) {
                if (item1 === item2) return true;
            }
        }
        return false;
    }

    const ENDPOINTS = {
        YOUTUBE: {
            GET_USER_ID: 'https://www.youtube.com/account',
            GET_PLAYLIST_CONTENT: `https://${subdomain}.youtube.com/youtubei/v1/browse`,
            MUSIC_SEARCH: 'https://music.youtube.com/youtubei/v1/search?key=&prettyPrint=false',
            CREATE_PLAYLIST: 'https://www.youtube.com/youtubei/v1/playlist/create?key=&prettyPrint=false'
        },
        SPOTIFY: {
            GET_USER_ID: 'https://api.spotify.com/v1/me',
            GET_AUTH_TOKEN: generateSpotifyAccessTokenUrl,
            SEARCH: 'https://api.spotify.com/v1/search',
            SEARCH_PROPRIETARY: 'https://api-partner.spotify.com/pathfinder/v1/query',
            GET_CONTENT: {
                PLAYLIST: 'https://api.spotify.com/v1/playlists/id/tracks',
                SAVED: 'https://api-partner.spotify.com/pathfinder/v2/query',
            },
            CREATE_PLAYLIST: 'https://api.spotify.com/v1/users/userId/playlists',
            ADD_PLAYLIST: 'https://api.spotify.com/v1/playlists/playlistId/tracks',
            GET_LIKED_TRACKS: 'https://api.spotify.com/v1/me/tracks'
        }
    };
    const userAgent = navigator.userAgent + ',gzip(gfe)';
    const ytClient = {
        "userAgent": userAgent,
        "clientName": "WEB",
        "clientVersion": GM_getValue('YT_CLIENT_VERSION','2.20240123.06.00')
    };
    const ytmClient = {
        "userAgent": userAgent,
        "clientName": "WEB_REMIX",
        "clientVersion": GM_getValue('YTM_CLIENT_VERSION','1.20240205.00.00')
    };
    const goodSpotifyStatuses = [200, 201];

    // Update YouTube client versions
    if (page.isYouTube || page.isYouTubeMusic) {
        const clientVersion = yt.config_.INNERTUBE_CLIENT_VERSION;
        const clientPrefix = page.isYouTube ? 'YT' : 'YTM';
        GM_setValue(`${clientPrefix}_CLIENT_VERSION`, clientVersion);
        console.log(`${clientPrefix}_CLIENT_VERSION:\n${clientVersion}`);
    }

    let SPOTIFY_AUTH_TOKEN, SPOTIFY_USER_ID;
    const ytHashName = 'YT_SAPISIDHASH';
    const ytmHashName = 'YTM_SAPISIDHASH';
    let YT_SAPISIDHASH = await GM_getValue(ytHashName);
    let YTM_SAPISIDHASH = await GM_getValue(ytmHashName);
    let ytTokenFragment = '#get_yt_token';

    const SAPISIDHASH_OPS = {
        UPDATE: async () => {
            async function getSAPISIDHASH(origin) {
                function sha1(str) {
                    return window.crypto.subtle.digest("SHA-1", new TextEncoder("utf-8").encode(str)).then(buf => {
                        return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join('');
                    });
                }
                const TIMESTAMP_MS = Date.now();
                const digest = await sha1(`${TIMESTAMP_MS} ${document.cookie.split('SAPISID=')[1].split('; ')[0]} ${origin}`);
                return `${TIMESTAMP_MS}_${digest}`;
            }
            if (page.isYouTube || page.isYouTubeMusic) {
                try {
                    await GM_setValue(ytHashName, await getSAPISIDHASH('https://www.youtube.com'));
                    await GM_setValue(ytmHashName, await getSAPISIDHASH('https://music.youtube.com'));
                    YT_SAPISIDHASH = await GM_getValue(ytHashName);
                    YTM_SAPISIDHASH = await GM_getValue(ytmHashName);
                    if (address.includes(ytTokenFragment) && YT_SAPISIDHASH && YTM_SAPISIDHASH && await GM_getValue('closeTab')) window.close();
                } catch (error) {
                    console.error(error);
                }
            }
        },

        FETCH: async () => {
            await GM_setValue('closeTab', true);
            const ytTab = await GM_openInTab(`http://www.youtube.com/${ytTokenFragment}`, { active: false });
            // Create a new Promise that resolves when the tab is closed
            await new Promise(resolve => {
                ytTab.onclose = async () => {
                    YT_SAPISIDHASH = await GM_getValue(ytHashName);
                    YTM_SAPISIDHASH = await GM_getValue(ytmHashName);
                    await GM_setValue('closeTab', false);
                    resolve();
                };
            });
        },

        VALIDATE: (SAPISIDHASH) => {
            if (SAPISIDHASH == undefined) return false;
            const timestamp = SAPISIDHASH.split('_')[0];
            const currentTime = Date.now();
            const limit = 3600000 * 12; // 3600000 (One hour in milliseconds)
            const hasNotExpired = currentTime - timestamp < limit;
            return hasNotExpired;
        }
    };

    SAPISIDHASH_OPS.UPDATE();

    // MENU SETUP:
    let MENU_COMMAND_ID, menuTitle, source, target;
    const callback = () => {
        page = addressChecker(window.location.href);

        source = page.isYouTubePlaylist ? 'YouTube' : page.isSpotifyPlaylist ? 'Spotify' : source;
        target = page.isYouTubePlaylist ? 'Spotify' : page.isSpotifyPlaylist ? 'YouTube' : target;

        if (page.isYouTubePlaylist || page.isSpotifyPlaylist) {
            if (MENU_COMMAND_ID) return; // If command already registered
            menuTitle = `🔄 ${source} to ${target} 🔄`;
            MENU_COMMAND_ID = GM_registerMenuCommand(menuTitle, () => { convertPlaylist(source, target); });
        } else {
            MENU_COMMAND_ID = GM_unregisterMenuCommand(MENU_COMMAND_ID);
        }
    };
    callback();

    // Register/unregister menu functions on address change
    const observer = new MutationObserver(() => {
        if (location.href !== address) { // If address changes
            address = location.href;
            callback();
        }
    });
    observer.observe(document, {subtree: true, childList: true});


    // Cache functions
    function checkCache(cacheObj) {
        // Get cache values
        const CACHED_TRACKS = GM_getValue('CACHED_TRACKS', []);
        const CACHED_NOT_FOUND = GM_getValue('CACHED_NOT_FOUND', []);
        const CACHE_ID = GM_getValue('CACHE_ID', {});

        const CACHED_INDEX = CACHED_TRACKS.length + CACHED_NOT_FOUND.length;

        const cacheConditions = CACHED_INDEX > 3 &&
              CACHE_ID.PLAYLIST_ID === cacheObj.playlistId &&
              CACHE_ID.PLAYLIST_CONTENT === JSON.stringify(cacheObj.playlistContent);

        // If cache conditions are met, return cached data
        if (cacheConditions) {
            return {
                tracks: CACHED_TRACKS,
                index: CACHED_INDEX
            };
        }

        // If no matching cache is detected, set cache for current conversion
        GM_setValue('CACHE_ID', {
            PLAYLIST_ID: cacheObj.playlistId,
            PLAYLIST_CONTENT: JSON.stringify(cacheObj.playlistContent)
        });

        return null;
    }
    function clearCache() {
        GM_setValue('CACHED_TRACKS', []);
        GM_setValue('CACHED_NOT_FOUND', []);
    }



    let UI, ytUserId, operations;
    let opIndex = 0;
    async function convertPlaylist(source, target) {
        try {
            // Get the title of the playlist
            let playlistTitle = await getPlaylistTitle(source);
            console.log(`${source} Playlist Title:`, playlistTitle);

            // User confirmation
            if (!confirm(`Convert "${playlistTitle}" to ${target}?`)) return;

            // Add close tab confirmation
            window.addEventListener("beforeunload", closeConfirmation);
            // Unregister the menu command
            MENU_COMMAND_ID = GM_unregisterMenuCommand(MENU_COMMAND_ID);

            // Set the operations variables
            let playlistContent, playlistId, totalTracks, newPlaylistId;
            let trackIds = [];
            let notFound = [];
            operations = [
                {
                    name: `Getting YouTube & Spotify tokens`,
                    op: async () => {
                        // Get YouTube & Spotify tokens (required for both)
                        const spotifyTokens = await getSpotifyTokens();
                        SPOTIFY_USER_ID = spotifyTokens.usernameId;
                        SPOTIFY_AUTH_TOKEN = spotifyTokens.accessToken;

                        if (!SAPISIDHASH_OPS.VALIDATE(YT_SAPISIDHASH)) source == 'Spotify' ? await SAPISIDHASH_OPS.FETCH() : await SAPISIDHASH_OPS.UPDATE();
                    }
                },
                {
                    name: `Getting ${source} playlist songs`,
                    op: async () => {
                        // Playlist ID
                        playlistId = getPlaylistId(source);
                        console.log(`${source} Playlist ID:`, playlistId);
                        // User ID (Needed for YouTube multiple accounts)
                        ytUserId = await getYtUserId();
                        console.log('YouTube User ID:', ytUserId);
                        // Playlist content
                        playlistContent = await getPlaylistContent(source, playlistId);
                        totalTracks = playlistContent.length;
                        UI.centerDiv.querySelector(`.op-${opIndex}`).textContent = `${operations[opIndex].name} (${totalTracks})`;
                        if (totalTracks == 0) {
                            throw new CustomError({
                                response: '',
                                message: 'Could not get playlist info: The playlist is empty!',
                                details: '', url: '', popUp: true
                            });
                        }
                        console.log(`${source} Playlist Content:`, playlistContent);
                    }
                },
                {
                    name: `Converting songs to ${target}`,
                    op: async () => {
                        let index = 0;
                        let notFoundString = '';

                        // Cache setup
                        const cache = checkCache({
                            playlistId: playlistId,
                            playlistContent: playlistContent
                        });

                        if (cache !== null) {
                            if(confirm(`💾 ${cache.tracks.length} Saved songs detected, continue from there?`)) {
                                trackIds = cache.tracks;
                                index = cache.index;
                                playlistContent = playlistContent.slice(index);
                                UI.centerDiv.querySelector(`.op-${opIndex}`).textContent += ` (${index}/${totalTracks})`;
                            } else {
                                // Clear cache if user clicks 'Cancel'
                                clearCache();
                            }
                        }

                        for (let [_, sourceTrackData] of playlistContent.entries()) {
                            const sourceTitle = sourceTrackData?.title || 'Unknown Title';

                            try {
                                const targetTrackData = sourceTrackData
                                ? (target === 'Spotify' ? await findOnSpotify(sourceTrackData) : await findOnYouTube(sourceTrackData))
                                : null;

                                if (targetTrackData) {
                                    trackIds.push(targetTrackData.trackId);
                                    console.log(`✅ ${target} Track ID:`, targetTrackData.trackId);
                                    GM_setValue('CACHED_TRACKS', trackIds);
                                } else {
                                    notFound.push({ track: sourceTitle, reason: 'Not found in search results' });
                                    console.warn(`NOT FOUND ON ${target.toUpperCase()}:`, sourceTitle);
                                    GM_setValue('CACHED_NOT_FOUND', notFound);
                                }
                            } catch (trackError) {
                                console.error(`❌ ERROR converting track "${sourceTitle}":`, trackError);

                                notFound.push({
                                    track: sourceTitle,
                                    reason: trackError.message || 'Unknown Script Error'
                                });
                            }

                            index++;
                            notFoundString = notFound.length > 0 ? `(${notFound.length} not found)` : '';
                            UI.centerDiv.querySelector(`.op-${opIndex}`).textContent = `${operations[opIndex].name} (${index}/${totalTracks}) ${notFoundString}`;
                        }
                        console.log(`${target} Tracks Found:`, trackIds);
                    }
                },
                {
                    name: `Adding playlist to ${target}`,
                    op: async () => {
                        // Create the playlist
                        newPlaylistId = await createPlaylist(playlistTitle, trackIds, target);
                        console.log(`${target} Playlist Created:`, newPlaylistId);
                    }
                }
            ];

            // Create the UI
            UI = createUI(operations.map(op => op.name));

            for (const operation of operations) {
                UI.centerDiv.querySelector(`.op-${opIndex}`).style.opacity = 1;

                await operation.op();

                let doneEmoji = '✅';
                if (notFound.length && operation.name.includes('Converting songs')) {
                    console.warn(`NOT FOUND ON ${target.toUpperCase()}:`, notFound);
                    doneEmoji = '🟨';
                }
                UI.centerDiv.querySelector(`.op-${opIndex}`).textContent += ` ${doneEmoji}`;

                opIndex++;
            }

            // Update cancel & close buttons
            UI.cancelButton.onclick = () => {
                const url = target == 'Spotify' ? `https://open.${target.toLowerCase()}.com/playlist/${newPlaylistId}` : `https://www.${target.toLowerCase()}.com/playlist?list=${newPlaylistId}`;
                window.open(url);
            };
            UI.closeButton.onclick = () => {
                UI.floatingDiv.remove();
            };
            UI.cancelButton.style.backgroundColor = target == 'Spotify' ? '#1ed55f' : '#ff0000'; // Button background: Green, Red
            if (target == 'YouTube') UI.cancelButton.style.color = '#ffffff'; // Make text white
            UI.cancelButton.textContent = `Open in ${target}!`;

            // Re-register the menu command
            MENU_COMMAND_ID = GM_registerMenuCommand(menuTitle, () => { convertPlaylist(source, target); });
            // Remove close tab confirmation
            window.removeEventListener("beforeunload", closeConfirmation);
            clearCache();
            // Alert not found songs
            if (notFound.length) {
                // Extract only the 'track' name for the alert
                const notFoundList = notFound.map(item => item.track).join('\n• ');
                alert(`⚠️ Song(s) that could not be found on ${target}:\n• ${notFoundList}`);
            }
            opIndex = 0;
        } catch (error) {
            console.error('🔄🔄🔄', error);
            errorHandler(error);
        }
    }


    // CONVERSION HELPER FUNCTIONS:

    async function generateSpotifyAccessTokenUrl() { // reference: https://github.com/KRTirtho/spotube/issues/2494#issuecomment-2728511342

        // reference: https://github.com/misiektoja/spotify_monitor/blob/main/debug/spotify_monitor_totp_test.py
        const SECRET_CIPHER_DICT = {
            "60": [79, 109, 69, 123, 90, 65, 46, 74, 94, 34, 58, 48, 70, 71, 92, 85, 122, 63, 91, 64, 87, 87],
            "57": [109, 53, 64, 116, 54, 117, 88, 62, 34, 74, 65, 60, 119, 110, 63, 83, 44, 126, 86, 48, 70, 33, 46, 115],
            "54": [91, 105, 81, 121, 126, 110, 35, 77, 54, 104, 53, 41, 83, 32, 77, 107, 102, 126, 99],
            "51": [33, 64, 46, 116, 102, 118, 55, 121, 46, 94, 43, 53, 81, 69, 53, 93, 32, 102, 50, 88, 126, 34, 53, 62, 75, 90, 74, 55, 121, 72, 65]
        };

        // Pick latest secret version
        const latestVersion = Math.max(...Object.keys(SECRET_CIPHER_DICT).map(Number));
        const secretCipherBytes = SECRET_CIPHER_DICT[latestVersion.toString()];

        // Secret generation from cipher bytes
        const transformedBytes = secretCipherBytes.map((e, t) => e ^ ((t % 33) + 9));

        // Process secret into the final key for HMAC
        const hmacKeyString = transformedBytes.join("");
        const hmacKeyBytes = new TextEncoder().encode(hmacKeyString);

        // Get server time, reference: https://github.com/misiektoja/spotify_monitor/blob/main/spotify_monitor.py
        const serverTimeResponse = await GM.xmlHttpRequest({
            method: 'HEAD',
            url: 'https://open.spotify.com/',
            timeout: 5000,
        });
        const dateHeader = serverTimeResponse.responseHeaders.match(/^Date:\s*(.+)$/im)?.[1];
        if (!dateHeader) {
            throw new Error("Could not fetch server time: 'Date' header missing from response.");
        }
        const serverTime = Math.floor(new Date(dateHeader).getTime() / 1000);

        // Generate TOTP
        const period = 30;
        const counter = Math.floor(serverTime / period);

        // Create counter buffer (8-byte big-endian)
        const counterBuffer = new ArrayBuffer(8);
        const counterView = new DataView(counterBuffer);
        counterView.setUint32(0, Math.floor(counter / 2 ** 32)); // High 32 bits
        counterView.setUint32(4, counter & 0xFFFFFFFF); // Low 32 bits

        // Create HMAC using SubtleCrypto API
        const cryptoKey = await window.crypto.subtle.importKey(
            'raw',
            hmacKeyBytes, {
                name: 'HMAC',
                hash: 'SHA-1'
            },
            false,
            ['sign']
        );

        const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, counterBuffer);

        // Get offset and truncated hash (dynamic truncation)
        const hash = new Uint8Array(signature);
        const offset = hash[hash.length - 1] & 0x0f;
        const binary =
              ((hash[offset] & 0x7f) << 24) |
              ((hash[offset + 1] & 0xff) << 16) |
              ((hash[offset + 2] & 0xff) << 8) |
              (hash[offset + 3] & 0xff);

        // Calculate OTP
        const digits = 6;
        const otp = (binary % Math.pow(10, digits)).toString().padStart(digits, '0');

        // Construct the URL parameters. 'transport' is the primary reason, 'init' is a fallback.
        const urlParams = {
            reason: 'transport',
            productType: 'web-player',
            totp: otp,
            totpServer: otp,
            totpVer: latestVersion.toString(),
        };

        return `https://open.spotify.com/api/token?${new URLSearchParams(urlParams)}`;
    }

    async function getSpotifyTokens() {
        const getAccessToken = async () => {
            const tokenResponse = await GM.xmlHttpRequest({
                method: 'GET',
                url: await ENDPOINTS.SPOTIFY.GET_AUTH_TOKEN(),
            });

            if (tokenResponse.status !== 200) {
                throw new CustomError({
                    response: tokenResponse,
                    message: 'Could not get Spotify token: Make sure you are signed in to Spotify and try again..',
                    details: `Unexpected status code: ${tokenResponse.status}`,
                    url: tokenResponse.finalUrl,
                    popUp: true
                });
            }

            const accessToken = JSON.parse(tokenResponse.responseText).accessToken;

            return accessToken;
        };

        const accessToken = await getAccessToken();

        // Get the username ID
        const usernameResponse = await GM.xmlHttpRequest({
            method: 'GET',
            url: ENDPOINTS.SPOTIFY.GET_USER_ID,
            headers: {'Authorization': `Bearer ${accessToken}`}
        });

        if (!goodSpotifyStatuses.includes(usernameResponse.status)) {
            throw new CustomError({
                response: usernameResponse,
                message: 'Could not get Spotify User ID: Make sure you are signed in to Spotify and try again..',
                details: `Unexpected status code: ${usernameResponse.status}`,
                url: usernameResponse.finalUrl,
                popUp: true
            });
        }

        const usernameId = JSON.parse(usernameResponse.responseText).id;
        return {
            usernameId: usernameId,
            accessToken: accessToken
        };
    }

    async function getPlaylistTitle(source) {
        // YouTube
        function getYtPlaylistTitle() {
            const staticPlaylistSelectors = ['.metadata-wrapper yt-formatted-string', '#contents .title', '[id^="page-header"] [class*="header-title"]'];
            const playingPlaylistSelectors = ['#header-description a[href*="playlist?list="]', '#tab-renderer .subtitle'];

            const selectors = address.includes('watch?v=') ? playingPlaylistSelectors : staticPlaylistSelectors;

            // Find the first matching element and return its text
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) return element.innerText;
            }
            // If title element is undefined
            return 'YouTube Playlist';
        }

        // Spotify
        function getSpotifyPlaylistTitle() {
            const element = document.querySelector('[data-testid="entityTitle"]');
            if (element) return element.innerText;
            // If title element is undefined
            return 'Spotify Playlist';
        }

        return source == 'Spotify' ? getSpotifyPlaylistTitle() : getYtPlaylistTitle();
    }

    function getPlaylistId(source) {
        // YouTube
        if (source == 'YouTube') {
            const match = address.match(playlistIdRegEx.YouTube);
            return match ? match[1] : null;
        }

        // Spotify
        const spotifyCategories = Object.entries(playlistIdRegEx.Spotify);
        for (const [category, regex] of spotifyCategories) {
            const match = address.match(regex);
            if (match) return { [category]: match[1] || category };
        }
    }

    async function getYtUserId() {
        const response = await GM.xmlHttpRequest({
            method: "GET",
            url: ENDPOINTS.YOUTUBE.GET_USER_ID,
        });

        if (response.finalUrl !== ENDPOINTS.YOUTUBE.GET_USER_ID) {
            const finalUrlHostname = new URL(response.finalUrl).hostname;
            throw new CustomError({
                response: response,
                message: 'Could not get YouTube User ID: Make sure you are signed in to YouTube and try again..',
                details: `Unexpected final URL: ${finalUrlHostname}`,
                url: response.finalUrl,
                popUp: true
            });
        }

        const userIdMatch = response.responseText.match(/myaccount\.google\.com\/u\/(\d)/);

        // Return the user ID if found, or 0 otherwise
        return userIdMatch ? userIdMatch[1] : 0;
    }

    async function getPlaylistContent(source, playlistId) {
        // Youtube
        async function getYtPlaylistContent(playlistId) {
            const requestUrl = ENDPOINTS.YOUTUBE.GET_PLAYLIST_CONTENT;
            const authorization = page.isYouTube ? `SAPISIDHASH ${YT_SAPISIDHASH}` : `SAPISIDHASH ${YTM_SAPISIDHASH}`;
            const headers = {
                "accept": "*/*",
                "authorization": authorization,
                "x-goog-authuser": ytUserId,
            };
            const context = {
                "client": ytmClient
            };

            let tracksData = [];
            playlistId = 'VL' + playlistId;

            let continuation;
            let requestParams = {
                requestUrl,
                headers,
                context,
                playlistId,
                continuation: null
            };

            async function fetchListedItems({requestUrl, headers, context, playlistId, continuation}) {
                const url = continuation ? `${requestUrl}?ctoken=${continuation}&continuation=${continuation}&type=next&prettyPrint=false` : `${requestUrl}?key=&prettyPrint=false`;
                const body = JSON.stringify({
                    "context": context,
                    "browseId": playlistId
                });

                return await fetch(url, {
                    method: "POST",
                    headers: headers,
                    body: body
                });
            }

            const response = await fetchListedItems(requestParams);
            if (!response.ok) {
                throw new CustomError({
                    response: response,
                    message: 'Could not get YouTube playlist info..',
                    details: `Bad response: ${response.status}`,
                    url: response.finalUrl,
                    popUp: true
                });
            }

            const responseJson = await response.json();

            let parsedResponse = parseYtResponse(responseJson);

            let index = parsedResponse.items.length;
            document.querySelector(`.op-${opIndex}`).textContent = `${operations[opIndex].name} (${index})`;

            continuation = parsedResponse.continuation;

            tracksData.push(...parsedResponse.items);

            while (continuation) {
                requestParams.continuation = continuation;

                const continuationResponse = await fetchListedItems(requestParams);
                if (!continuationResponse.ok) {
                    throw new CustomError({
                        response: continuationResponse,
                        message: 'Could not get YouTube playlist info..',
                        details: `Bad continuation response: ${continuationResponse.status}`,
                        url: continuationResponse.finalUrl,
                        popUp: true
                    });
                }

                const continuationResponseJson = await continuationResponse.json();
                parsedResponse = parseYtResponse(continuationResponseJson);

                index += parsedResponse.items.length;
                document.querySelector(`.op-${opIndex}`).textContent = `${operations[opIndex].name} (${index})`;

                continuation = parsedResponse.continuation;

                tracksData.push(...parsedResponse.items);
            }
            return tracksData;
        }

        // Spotify
        async function getSpotifyPlaylistContent(playlistId) {
            const [category, id] = Object.entries(playlistId)[0];
            const limit = category === 'playlist' ? 100 : 25;
            const tracksData = [];
            let offset = 0;

            const getSavedPlaylistContent = async (url, offset) => {
                const body = {
                    variables: { offset, limit },
                    operationName: "fetchLibraryTracks",
                    extensions: {
                        persistedQuery: {
                            version: 1,
                            sha256Hash: "087278b20b743578a6262c2b0b4bcd20d879c503cc359a2285baf083ef944240"
                        }
                    }
                };

                const response = await GM.xmlHttpRequest({
                    method: "POST",
                    url,
                    headers: {
                        "authorization": `Bearer ${SPOTIFY_AUTH_TOKEN}`,
                        "content-type": "application/json;charset=UTF-8"
                    },
                    data: JSON.stringify(body),
                });

                const data = JSON.parse(response.responseText);
                const container = data.data?.me?.library?.tracks;
                const items = container?.items || [];
                const total = container?.totalCount || 0;

                for (const item of items) {
                    const track = item.track;
                    const artists = track.data?.albumOfTrack?.artists?.items?.map(a => a.profile?.name) || [];
                    const title = track.data?.albumOfTrack?.name;
                    tracksData.push({
                        trackId: track._uri,
                        title: title,
                        artists: artists
                    });
                }

                return total;
            };

            const getPlaylistContent = async (url) => {
                const response = await GM.xmlHttpRequest({
                    method: "GET",
                    url: url,
                    headers: {
                        'Authorization': `Bearer ${SPOTIFY_AUTH_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!goodSpotifyStatuses.includes(response.status)) {
                    throw new CustomError({
                        response,
                        message: 'Could not get Spotify playlist info..',
                        details: `Error getting Spotify playlist content: ${response.status}`,
                        url,
                        popUp: true
                    });
                }

                const responseJson = JSON.parse(response.responseText);
                const items = responseJson.items;

                for (const item of items) {
                    const track = item.track;
                    const artists = track.artists ? track.artists.map(a => a.name) : [];
                    tracksData.push({
                        trackId: track.uri,
                        title: track.name,
                        artists: artists
                    });
                }

                return responseJson.next;
            };

            const requestUrl = category === 'playlist'
            ? ENDPOINTS.SPOTIFY.GET_CONTENT.PLAYLIST.replace('id', id)
            : ENDPOINTS.SPOTIFY.GET_CONTENT.SAVED;

            if (category === 'saved') {
                let total = Infinity;

                while (offset < total) {
                    total = await getSavedPlaylistContent(requestUrl, offset);
                    offset += limit;
                }
            } else {
                let next = `${requestUrl}?offset=0&limit=${limit}`;

                while (next) {
                    next = await getPlaylistContent(next);
                }
            }

            return tracksData;
        }

        return source == 'Spotify' ? getSpotifyPlaylistContent(playlistId) : getYtPlaylistContent(playlistId);
    }

    function parseYtResponse(responseJson) {
        let contents, continuations;

        function findNestedKeyValue(obj, key) {
            if (key in obj) return obj[key];
            for (let k in obj) {
                if (obj[k] && typeof obj[k] === 'object') {
                    const found = findNestedKeyValue(obj[k], key);
                    if (found !== undefined) return found;
                }
            }
            return undefined;
        }

        const responseType = {
            playlist: findNestedKeyValue(responseJson, 'musicPlaylistShelfRenderer'),
            continuation: findNestedKeyValue(responseJson, 'appendContinuationItemsAction'),
            search: findNestedKeyValue(responseJson, 'musicShelfRenderer')
        };

        if (responseType.playlist) {
            contents = responseType.playlist.contents;
            continuations = findNestedKeyValue(contents, 'continuationItemRenderer');
            if (continuations) continuations = continuations.continuationEndpoint?.continuationCommand?.token;

        } else if (responseType.continuation) {
            contents = findNestedKeyValue(responseType.continuation, 'continuationItems');
            continuations = findNestedKeyValue(contents, 'continuationItemRenderer');
            if (continuations) continuations = continuations.continuationEndpoint?.continuationCommand?.token;

        } else if (responseType.search) {
            contents = responseType.search.contents;
            if (!contents) return { items: null };
            continuations = null;
        }

        if (!contents) {
            throw new CustomError({
                response: '',
                message: 'Error accessing YouTube response JSON values',
                details: '',
                url: '',
                popUp: false
            });
        }

        const items = contents.map(item => {
            try {
                const flexColumns = item.musicResponsiveListItemRenderer?.flexColumns;
                const column0 = flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer;
                const column1 = flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer;
                const textRuns = column0?.text?.runs[0];
                const endpoint = textRuns?.navigationEndpoint?.watchEndpoint;
                const configs = endpoint?.watchEndpointMusicSupportedConfigs?.watchEndpointMusicConfig;

                const trackId = endpoint?.videoId;
                let mvType = configs?.musicVideoType;
                if (mvType) mvType = mvType.replace('MUSIC_VIDEO_TYPE_','');
                const title = textRuns?.text;
                const artistRuns = column1?.text?.runs;
                const artists = [];
                for (let artist of artistRuns) {
                    if (artist.text == ' • ') break;
                    if (artist.text != ' & ' && artist.text != ', ') artists.push(artist.text);
                }
                return {
                    trackId: trackId,
                    title: title,
                    artists: artists,
                    mvType: mvType
                };
            } catch (error) {
                console.error(error);
            }
        });

        return {items: items, continuation: continuations};
    }

    async function createPlaylist(playlistTitle, trackIds, target) {
        // Youtube
        async function createYtPlaylist(playlistTitle, trackIds) {
            const headers = {
                "authorization": `SAPISIDHASH ${YT_SAPISIDHASH}`,
                "x-goog-authuser": ytUserId,
                "x-origin": "https://www.youtube.com"
            };

            const data = JSON.stringify({
                "context": {
                    "client": ytClient
                },
                "title": playlistTitle,
                "videoIds": trackIds
            });

            const response = await GM.xmlHttpRequest({
                method: "POST",
                url: ENDPOINTS.YOUTUBE.CREATE_PLAYLIST,
                headers: headers,
                data: data
            });

            if (response.status !== 200) {
                throw new CustomError({
                    response: response,
                    message: 'Could not create YouTube playlist..',
                    details: `Unexpected status code: ${response.status}`,
                    url: response.finalUrl,
                    popUp: true
                });
            }

            const responseJson = JSON.parse(response.responseText);
            return responseJson.playlistId;
        }

        // Spotify
        async function createSpotifyPlaylist(playlistTitle) {
            const requestUrl = ENDPOINTS.SPOTIFY.CREATE_PLAYLIST.replace('userId', SPOTIFY_USER_ID);

            const createPlaylist = async (title) => {
                const playlistData = JSON.stringify({
                    name: title,
                    description: '',
                    public: false,
                });

                const response = await GM.xmlHttpRequest({
                    method: "POST",
                    url: requestUrl,
                    headers: {
                        'Authorization': `Bearer ${SPOTIFY_AUTH_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    data: playlistData
                });

                if (!goodSpotifyStatuses.includes(response.status)) {
                    throw new CustomError({
                        response: response,
                        message: 'Could not create Spotify playlist..',
                        details: `Unexpected status code: ${response.status}`,
                        url: ENDPOINTS.SPOTIFY.CREATE_PLAYLIST,
                        popUp: true
                    });
                }

                const responseJson = JSON.parse(response.responseText);
                return responseJson.uri.replace('spotify:playlist:', '');
            };

            const playlistId = await createPlaylist(playlistTitle);
            return playlistId;
        }
        async function addToSpotifyPlaylist(playlistId, trackIds) {
            const requestUrl = ENDPOINTS.SPOTIFY.ADD_PLAYLIST.replace('playlistId', playlistId);

            const addTracksToPlaylist = async (tracks) => {
                const trackData = JSON.stringify({ uris: tracks });

                const response = await GM.xmlHttpRequest({
                    method: "POST",
                    url: requestUrl,
                    headers: {
                        'Authorization': `Bearer ${SPOTIFY_AUTH_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    data: trackData
                });

                if (!goodSpotifyStatuses.includes(response.status)) {
                    throw new CustomError({
                        response: response,
                        message: 'Could not add songs to Spotify playlist..',
                        details: `Unexpected status code: ${response.status}`,
                        url: ENDPOINTS.SPOTIFY.ADD_PLAYLIST,
                        popUp: true
                    });
                }

                return JSON.parse(response.responseText);
            };

            // Keep adding tracks until the array is empty
            while (trackIds.length) {
                const tracks = trackIds.splice(0, 100); // Get the first 100 tracks
                await addTracksToPlaylist(tracks);
            }
        }

        if (target == 'Spotify') {
            const spotifyPLaylistId = await createSpotifyPlaylist(playlistTitle);
            await addToSpotifyPlaylist(spotifyPLaylistId, trackIds);
            return spotifyPLaylistId;
        } else if (target == 'YouTube') {
            const ytPLaylistId = await createYtPlaylist(playlistTitle, trackIds);
            return ytPLaylistId;
        }
    }

    async function searchYtMusic(queryObj) {
        const { query, songsOnly } = queryObj;
        const params = songsOnly ? 'EgWKAQIIAWoKEAMQBBAKEBEQEA%3D%3D' : 'EgWKAQIQAWoQEBAQERADEAQQCRAKEAUQFQ%3D%3D'; // Songs only id, Videos only id
        const response = await GM.xmlHttpRequest({
            method: "POST",
            url: ENDPOINTS.YOUTUBE.MUSIC_SEARCH,
            headers: {
                "content-type": "application/json",
            },
            data: JSON.stringify({
                "context": {
                    "client": ytmClient
                },
                "query": query,
                "params": params
            })
        });
        if (response.status !== 200) {
            throw new CustomError({
                response: response,
                message: '',
                details: `Error getting YouTube Music track data: ${response.status}`,
                url: response.finalUrl,
                popUp: false
            });
        }

        const responseJson = JSON.parse(response.responseText);
        const parsedResponse = parseYtResponse(responseJson);
        const searchResults = parsedResponse.items;

        return searchResults ? searchResults[0]: null;
    }

    async function findOnSpotify(trackData) {
        async function searchSpotify(queryObj) {
            let { query, topResultOnly } = queryObj;
            const topResultQuery = `${query.title} ${query.artists}`;

            // Define the functions to search Spotify
            async function topResultRequest(topResultQuery) {
                const variables = JSON.stringify({
                    "searchTerm": topResultQuery,
                    "offset": 0,
                    "limit": 10,
                    "numberOfTopResults": 10,
                    "includeAudiobooks": true,
                    "includeArtistHasConcertsField": false
                });
                const extensions = JSON.stringify({
                    "persistedQuery": {
                        "version": 1,
                        "sha256Hash": "c8e90ff103ace95ecde0bcb4ba97a56d21c6f48427f87e7cc9a958ddbf46edd8"
                    }
                });

                return await GM.xmlHttpRequest({
                    method: "GET",
                    url: `${ENDPOINTS.SPOTIFY.SEARCH_PROPRIETARY}?operationName=searchDesktop&variables=${encodeURIComponent(variables)}&extensions=${encodeURIComponent(extensions)}`,
                    headers: {
                        "accept": "application/json",
                        "authorization": `Bearer ${SPOTIFY_AUTH_TOKEN}`
                    },
                    data: null
                });
            }
            async function apiSearchRequest(title, artists) {
                return await GM.xmlHttpRequest({
                    method: "GET",
                    url: `${ENDPOINTS.SPOTIFY.SEARCH}?q=track:"${title}" artist:"${artists}"&type=track&offset=0&limit=1`,
                    headers: {
                        'Authorization': `Bearer ${SPOTIFY_AUTH_TOKEN}`,
                    }
                });
            }

            const response = topResultOnly ? await topResultRequest(topResultQuery) : await apiSearchRequest(query.title, query.artists);

            if (!goodSpotifyStatuses.includes(response.status)) {
                console.error(new CustomError({
                    response: response,
                    message: '',
                    details: `Error searching Spotify: ${response.status}`,
                    url: response.finalUrl,
                    popUp: false
                }));
                return null;
            }

            const responseJson = JSON.parse(response.responseText);
            const searchItems = topResultOnly ? responseJson.data.searchV2.topResultsV2.itemsV2 : responseJson.tracks.items;

            if (searchItems.length === 0) {
                return null;
            }


            if (topResultOnly) {
                const trackType = searchItems[0].item.data.__typename;
                if (trackType !== "Track") return null;

                const trackId = searchItems[0].item.data.uri;
                const title = searchItems[0].item.data.name;
                const artistsData = searchItems[0].item.data.artists.items;
                const artists = artistsData.map(artist => artist.profile.name);

                return {trackId: trackId, title: title, artists: artists};
            } else {
                const apiResults = searchItems.map(result => {
                    const trackId = result.uri;
                    const title = result.name;
                    const artistsData = result.artists;
                    const artists = artistsData.map(artist => artist.name);
                    return {trackId: trackId, title: title, artists: artists};
                });
                return apiResults ? apiResults[0]: null;
            }
        }

        // Handling UGC YouTube songs
        if (trackData.mvType === 'UGC') {
            trackData.artists = [''];
            const ytmSearchResult = await searchYtMusic({query: trackData.title, songsOnly: true});
            if (ytmSearchResult) {
                const cleanTitle = stringCleanup(trackData.title);
                const cleanArtists = stringCleanup(ytmSearchResult.artists);
                trackData = cleanTitle.includes(cleanArtists?.[0]) ? ytmSearchResult : trackData;
            }
        }

        const modifiedTrackData = {
            title: stringCleanup(trackData.title, ['removeDiacritics', 'removeBrackets', 'removeQuotes', 'removeParentheses', 'removeDashes', 'removeUnwantedWords']),
            artists: stringCleanup(trackData.artists.join(' '), ['removeUnwantedWords'])
        };

        let spotifySearchResult;
        let queries = [
            {query: modifiedTrackData, topResultOnly: true},
            {query: trackData, topResultOnly: true},
            {query: trackData, topResultOnly: false}
        ];

        for (let query of queries) {
            spotifySearchResult = await searchSpotify(query);
            if (spotifySearchResult) break;
        }

        return spotifySearchResult || null;
    }

    async function findOnYouTube(trackData) {
        const ytmQuery = `${trackData.title} ${trackData.artists[0]}`;

        let ytmSearchResult = await searchYtMusic({query: ytmQuery, songsOnly: true});

        if (ytmSearchResult) {
            // Compare artists
            const cleanArtists1 = stringCleanup([trackData?.artists[0]]);
            const cleanArtists2 = stringCleanup(ytmSearchResult?.artists);
            const artistsMatch = compareArrays(cleanArtists1, cleanArtists2);

            // If YouTube Music songs only result is found and artists match
            if (ytmSearchResult && artistsMatch) {
                return ytmSearchResult;
            }
        }

        // Try video only search if songs only search fails
        ytmSearchResult = await searchYtMusic({query: ytmQuery, songsOnly: false});
        return ytmSearchResult || null;
    }
})();