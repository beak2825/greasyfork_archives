// ==UserScript==
// @name         YouTube: MusicBrainz Importer
// @namespace    https://musicbrainz.org/user/chaban
// @version      2.8.0
// @description  Imports YouTube videos to MusicBrainz as a new standalone recording
// @tag          ai-created
// @author       nikki, RustyNova, chaban
// @license      MIT
// @match        *://www.youtube.com/*
// @match        *://*.musicbrainz.org/recording/create*
// @connect      googleapis.com
// @connect      musicbrainz.org
// @connect      listenbrainz.org
// @icon         https://www.google.com/s2/favicons?sz=256&domain=youtube.com
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @run-at       document-end
// @noframes
// @require https://update.greasyfork.org/scripts/552392/1689509/MusicBrainz%20API%20Module.js
// @downloadURL https://update.greasyfork.org/scripts/537116/YouTube%3A%20MusicBrainz%20Importer.user.js
// @updateURL https://update.greasyfork.org/scripts/537116/YouTube%3A%20MusicBrainz%20Importer.meta.js
// ==/UserScript==

//**************************************************************************//
// Based on the "Import videos from YouTube as release" script by RustyNova
// and the original "Import videos from YouTube as recording" script by nikki et al.
//**************************************************************************//

(function () {
    'use strict';

    /**
     * Localization module to handle translations.
     */
    const L10n = {
        _language: (document.documentElement.lang || navigator.language || navigator.userLanguage).split('-')[0],
        _strings: {
            en: {
                loading: 'Loading...',
                addRecording: 'Add Recording',
                updateLength: 'Update Length',
                onMB: 'On MB ✓',
                onMBMulti: 'On MB (Multi) ✓',
                addRecordingTitle: 'Add to MusicBrainz as recording',
                updateLengthTitle: 'The linked MusicBrainz recording is missing its length. Click to update it to {length}s.',
                linkedToRecordingTitle: 'This YouTube video is linked to MusicBrainz recording: {title}',
                linkedToMultiTitle: 'This YouTube video is linked to multiple recordings on MusicBrainz.\nClick to view URL entity page.',
                errorVideoNotFound: 'Video Not Found / YT API Error',
                errorApiRateLimit: '{apiName} Rate Limit / Server Error',
                errorApiNetwork: '{apiName} Network Error',
                errorProcessing: 'Processing Error',
                // Playlist specific strings
                createPlaylist: 'Create LB Playlist',
                syncPlaylist: 'Sync LB Playlist',
                onLB: 'On LB (Playlist) ✓',
                createPlaylistTitle: 'Create a new ListenBrainz playlist from this video\'s tracklist.',
                syncPlaylistTitle: 'This playlist is marked as [INCOMPLETE] on ListenBrainz. Click to sync with the current tracklist.',
                linkedToPlaylistTitle: 'This video is linked to a ListenBrainz playlist: {title}',
                playlistInProgress: 'Processing...',
                tokenMissing: 'Set LB Token!',
                tokenMissingTitle: 'Click to set your ListenBrainz token',
                tokenMissing: 'Set LB Token!',
                tokenMissingTitle: 'Click to set your ListenBrainz token',
                viewReport: 'View Report',
                viewReportTitle: 'View list of unmatched/unparsed tracks from the video description.',
            },
            de: {
                loading: 'Wird geladen...',
                addRecording: 'Aufnahme hinzufügen',
                updateLength: 'Länge aktualisieren',
                onMB: 'Auf MB ✓',
                onMBMulti: 'Auf MB (Multi) ✓',
                addRecordingTitle: 'Als Aufnahme zu MusicBrainz hinzufügen',
                updateLengthTitle: 'Bei der verknüpften MusicBrainz-Aufnahme fehlt die Länge. Klicken, um sie auf {length}s zu aktualisieren.',
                linkedToRecordingTitle: 'Dieses YouTube-Video ist mit der MusicBrainz-Aufnahme verknüpft: {title}',
                linkedToMultiTitle: 'Dieses YouTube-Video ist mit mehreren Aufnahmen auf MusicBrainz verknüpft.\nKlicken, um die URL-Entitätsseite anzuzeigen.',
                errorVideoNotFound: 'Video nicht gefunden / YT API-Fehler',
                errorApiRateLimit: '{apiName} Ratenlimit / Serverfehler',
                errorApiNetwork: '{apiName} Netzwerkfehler',
                errorProcessing: 'Verarbeitungsfehler',
                // Playlist specific strings
                createPlaylist: 'LB-Playlist erstellen',
                syncPlaylist: 'LB-Playlist synchronisieren',
                onLB: 'Auf LB (Playlist) ✓',
                createPlaylistTitle: 'Eine neue ListenBrainz-Playlist aus der Trackliste dieses Videos erstellen.',
                syncPlaylistTitle: 'Diese Playlist ist auf ListenBrainz als [INCOMPLETE] markiert. Klicken, um mit der aktuellen Trackliste zu synchronisieren.',
                linkedToPlaylistTitle: 'Dieses Video ist mit einer ListenBrainz-Playlist verknüpft: {title}',
                playlistInProgress: 'Verarbeite...',
                tokenMissing: 'LB-Token setzen!',
                tokenMissingTitle: 'Klicken, um Ihr ListenBrainz-Token festzulegen',
                viewReport: 'Bericht anzeigen',
                viewReportTitle: 'Liste der nicht zugeordneten und nicht verarbeiteten Titel aus der Videobeschreibung anzeigen.',
            }
        },
        getString: function (key, substitutions) {
            const langStrings = this._strings[this._language] || this._strings.en;
            let str = langStrings[key] || this._strings.en[key] || `L10N_ERROR: ${key}`;
            if (substitutions) {
                for (const subKey in substitutions) {
                    str = str.replace(`{${subKey}}`, substitutions[subKey]);
                }
            }
            return str;
        }
    };

    /**
     * Configuration object to centralize all constants and selectors.
     */
    const Config = {
        SHORT_APP_NAME: 'UserJS.YoutubeImport',
        GOOGLE_API_KEY: 'AIzaSyC5syukuFyCSoRvMr42Geu_d_1c_cRYouU',
        MUSICBRAINZ_API_ROOT: 'https://musicbrainz.org/ws/2/',
        LISTENBRAINZ_API_ROOT: 'https://api.listenbrainz.org/1/',
        TOKEN_STORAGE_KEY: 'listenbrainz_user_token',
        YOUTUBE_API_ROOT: 'https://www.googleapis.com/youtube/v3/',
        YOUTUBE_API_VIDEO_PARTS: 'snippet,id,contentDetails',

        MAX_RETRIES: 5,
        INITIAL_RETRY_DELAY_MS: 1000,
        RETRY_BACKOFF_FACTOR: 2,

        SELECTORS: {
            BUTTON_DOCK: '#top-row.ytd-watch-metadata #owner.ytd-watch-metadata',
            MUSICBRAINZ_MAIN_VIDEO_CHECKBOX: '[name="edit-recording.video"]',
            MUSICBRAINZ_EXTERNAL_LINKS_EDITOR: '#external-links-editor',
            MUSICBRAINZ_INDIVIDUAL_VIDEO_CHECKBOX: '.relationship-item input[type="checkbox"]',
        },

        CLASS_NAMES: {
            CONTAINER: 'musicbrainz-userscript-container',
            BUTTON: 'search-button',
            BUTTON_READY: 'mb-ready',
            BUTTON_ADDED: 'mb-added',
            BUTTON_ERROR: 'mb-error',
            BUTTON_INFO: 'mb-info',
            BUTTON_UPDATE: 'mb-update', // Class for the update button
            PLAYLIST_BUTTON: 'playlist-button',
            PLAYLIST_BUTTON_SYNC: 'lb-sync',
        },

        MUSICBRAINZ_FREE_STREAMING_LINK_TYPE_ID: '268',
        MUSICBRAINZ_FREE_STREAMING_RELATION_TYPE_ID: '7e41ef12-a124-4324-afdb-fdbae687a89c',
    };

    const USER_AGENT = `${Config.SHORT_APP_NAME}/${GM_info.script.version} ( ${GM_info.script.namespace} )`;

    /**
     * Manages the ListenBrainz user token.
     */
    const TokenManager = {
        _token: null,
        async init() {
            this._token = await GM.getValue(Config.TOKEN_STORAGE_KEY, null);
            GM.registerMenuCommand('Set ListenBrainz Token', () => this.getToken(true));
        },
        getTokenValue() {
            return this._token;
        },
        async getToken(forcePrompt = false) {
            if (!this._token || forcePrompt) {
                const success = await this.setToken();
                if (!success) {
                    return null;
                }
            }
            return this._token;
        },
        async setToken() {
            const token = prompt('Please enter your ListenBrainz User Token:', this._token || '');
            if (token && token.trim()) {
                this._token = token.trim();
                await GM.setValue(Config.TOKEN_STORAGE_KEY, this._token);
                alert('ListenBrainz token saved!');
                return true;
            }
            return false;
        }
    };

    /**
     * General utility functions.
     */
    const Utils = {
        /**
         * Waits for an element matching the given CSS selector to appear in the DOM.
         * @param {string} selector - The CSS selector of the element to wait for.
         * @param {number} timeout - The maximum time (in milliseconds) to wait for the element.
         * @returns {Promise<Element>} A promise that resolves with the element once found, or rejects on timeout.
         */
        waitForElement: function (selector, timeout = 15000) {
            return new Promise((resolve, reject) => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }

                let observer;
                const timer = setTimeout(() => {
                    if (observer) observer.disconnect();
                    reject(new Error(`Timeout waiting for element with selector: ${selector}`));
                }, timeout);

                observer = new MutationObserver((mutations, obs) => {
                    const targetElement = document.querySelector(selector);
                    if (targetElement) {
                        clearTimeout(timer);
                        obs.disconnect();
                        resolve(targetElement);
                    }
                });
                observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true
                });
            });
        },

        /**
         * Performs an asynchronous HTTP request using GM.xmlHttpRequest with retry logic and exponential backoff.
         * @param {Object} details - The GM.xmlHttpRequest details object (method, url, headers, data).
         * @param {string} apiName - Name of the API for logging (e.g., "YouTube API", "MusicBrainz API").
         * @param {number} [currentRetry=0] - The current retry attempt.
         * @returns {Promise<Object>} A promise that resolves with the response object or rejects on error/exhausted retries.
         */
        gmXmlHttpRequest: function (details, apiName, currentRetry = 0) {
            const headers = {
                "Referer": location.origin,
                "Origin": location.origin,
                ...(details.headers || {})
            };

            return new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: details.method || 'GET',
                    url: details.url,
                    headers: headers,
                    data: details.data || null,
                    anonymous: details.anonymous || false,
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            resolve(response);
                        } else if (response.status === 503 && currentRetry < Config.MAX_RETRIES) {
                            const delay = Config.INITIAL_RETRY_DELAY_MS * Math.pow(Config.RETRY_BACKOFF_FACTOR, currentRetry);
                            console.warn(`[${GM.info.script.name}] ${apiName} returned 503. Retrying in ${delay}ms (attempt ${currentRetry + 1}/${Config.MAX_RETRIES}).`);
                            setTimeout(() => {
                                Utils.gmXmlHttpRequest(details, apiName, currentRetry + 1)
                                    .then(resolve)
                                    .catch(reject);
                            }, delay);
                        } else {
                            if (!(response.status === 404 && apiName === 'MusicBrainz API')) {
                                console.error(`[${GM.info.script.name}] ${apiName} request failed with status ${response.status}.`);
                            }
                            const error = new Error(`Request to ${apiName} failed with status ${response.status}: ${response.responseText}`);
                            error.status = response.status;
                            error.apiName = apiName;
                            reject(error);
                        }
                    },
                    onerror: (response) => {
                        console.error(`[${GM.info.script.name}] ${apiName} network error:`, response);
                        const error = new Error(`Network error for ${apiName}: ${response.statusText}`);
                        error.status = response.status;
                        error.apiName = apiName;
                        reject(error);
                    },
                    ontimeout: () => {
                        console.error(`[${GM.info.script.name}] ${apiName} request timed out.`);
                        const error = new Error(`Request to ${apiName} timed out`);
                        error.status = 408;
                        error.apiName = apiName;
                        reject(error);
                    }
                });
            });
        },

        /**
         * Converts ISO8601 duration to milliseconds using a single regular expression.
         * Handles durations with date and time parts (e.g., P1DT12H30M5.5S).
         * https://en.wikipedia.org/wiki/ISO_8601#Durations
         * @param {string} str - The ISO8601 duration string.
         * @returns {number} The duration in milliseconds, or NaN if invalid.
         */
        ISO8601toMilliSeconds: function (str) {
            // This single regex captures the optional Day part, and the optional Time part (which must be preceded by 'T').
            // Groups: 1=Days, 2=Hours, 3=Minutes, 4=Seconds
            const regex = /^P(?:(\d*\.?\d*)D)?(?:T(?:(\d*\.?\d*)H)?(?:(\d*\.?\d*)M)?(?:(\d*\.?\d*)S)?)?$/;

            const matches = str.replace(',', '.').match(regex);

            // If the regex doesn't match, or if it matches but finds no duration components (e.g., input is "P" or "PT"), return NaN.
            if (!matches || matches.slice(1).every(part => part === undefined)) {
                return NaN;
            }

            const days = parseFloat(matches[1] || 0);
            const hours = parseFloat(matches[2] || 0);
            const minutes = parseFloat(matches[3] || 0);
            const seconds = parseFloat(matches[4] || 0);

            const totalSeconds = (days * 86400) + (hours * 3600) + (minutes * 60) + seconds;

            return totalSeconds * 1000;
        },
        /**
         * Parses a block of text for track information using multiple regex patterns.
         * @param {string} text The raw text (e.g., YouTube description).
         * @returns {{parsedTracks: Array<Object>, unparsedLines: Array<string>}}
         */
        parseTracklist: function(text) {
            if (!text) {
                return { parsedTracks: [], unparsedLines: [] };
            }
            const tracklistPatterns = [
                { // Format: StartTime - EndTime Artist - Title
                    regex: /^((?:\d+:)?\d+:\d+)\s*[-–—]\s*(?:\d+:)?\d+\s+(.+?)\s*[-–—]\s*(.+)$/,
                    map: (match) => ({ timestampStr: match[1], artist: match[2], title: match[3] })
                },
                { // Format: Timestamp - Artist - Title
                    regex: /^((?:\d+:)?\d+:\d+)\s*[-–—]\s*(.+?)\s*[-–—]\s*(.+)$/,
                    map: (match) => ({ timestampStr: match[1], artist: match[2], title: match[3] })
                },
                { // Format: Timestamp [Artist] - Title or Timestamp Artist - Title
                    regex: /^((?:\d+:)?\d+:\d+)\s+(?:\[(.+?)\]|(.+?))\s*[-–—]\s*(.+)$/,
                    map: (match) => ({ timestampStr: match[1], artist: match[2] || match[3], title: match[4] })
                },
                { // Format: Artist - Title (Timestamp)
                    regex: /^(.+?)\s*[-–—]\s*(.+?)\s+\(?((\d+:)?\d+:\d+)\)?$/,
                    map: (match) => ({ artist: match[1], title: match[2], timestampStr: match[3] })
                }
            ];

            const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
            const parsedTracks = [];
            const unparsedLines = [];

            for (const line of lines) {
                let matched = false;
                for (const pattern of tracklistPatterns) {
                    const match = line.match(pattern.regex);
                    if (match) {
                        const { timestampStr, artist, title } = pattern.map(match);
                        const timeParts = timestampStr.split(':').map(Number);
                        let timestampSeconds = 0;
                        if (timeParts.length === 2) { // MM:SS
                            timestampSeconds = timeParts[0] * 60 + timeParts[1];
                        } else if (timeParts.length === 3) { // HH:MM:SS
                            timestampSeconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
                        }

                        parsedTracks.push({
                            artist: artist.trim(),
                            title: title.trim(),
                            timestamp: timestampStr.trim(),
                            timestampSeconds,
                            originalLine: line
                        });

                        matched = true;
                        break; // Pattern matched, move to the next line
                    }
                }
                if (!matched) {
                    unparsedLines.push(line);
                }
            }
            return { parsedTracks, unparsedLines };
        },

        /**
         * Finds the Longest Common Subsequence (LCS) of two arrays.
         * @param {Array<any>} arr1
         * @param {Array<any>} arr2
         * @returns {Array<any>}
         */
        findLCS: function(arr1, arr2) {
            const m = arr1.length;
            const n = arr2.length;
            const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

            for (let i = 1; i <= m; i++) {
                for (let j = 1; j <= n; j++) {
                    if (arr1[i - 1] === arr2[j - 1]) {
                        dp[i][j] = 1 + dp[i - 1][j - 1];
                    } else {
                        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                    }
                }
            }

            // Backtrack from dp[m][n] to reconstruct the LCS
            const lcs = [];
            let i = m, j = n;
            while (i > 0 && j > 0) {
                if (arr1[i - 1] === arr2[j - 1]) {
                    lcs.unshift(arr1[i - 1]);
                    i--; j--;
                } else if (dp[i - 1][j] > dp[i][j - 1]) {
                    i--;
                } else {
                    j--;
                }
            }
            return lcs;
        },

        /**
         * Groups a sorted list of deletion indices into consecutive chunks for batching.
         * @param {number[]} indices - A list of indices to delete, sorted in descending order.
         * @returns {Array<{index: number, count: number}>} An array of chunks to delete.
         */
        groupDeletions: function(indices) {
            if (indices.length === 0) {
                return [];
            }

            const groups = [];
            let currentGroup = { index: indices[0], count: 1 };

            for (let i = 1; i < indices.length; i++) {
                if (indices[i] === currentGroup.index - 1) {
                    currentGroup.index = indices[i];
                    currentGroup.count++;
                } else {
                    groups.push(currentGroup);
                    currentGroup = { index: indices[i], count: 1 };
                }
            }
            groups.push(currentGroup);
            return groups;
        }
    };

    /**
     * Handles all interactions with the YouTube Data API.
     */
    const YouTubeAPI = {
        _videoDataCache: new Map(),

        /**
         * Fetches video data from the YouTube Data API.
         * @param {string} videoId - The YouTube video ID.
         * @returns {Promise<Object|null>} A promise that resolves with the video data, or null if not found/error.
         */
        fetchVideoData: async function (videoId) {
            if (this._videoDataCache.has(videoId)) {
                const cachedData = this._videoDataCache.get(videoId);
                console.log(`[${GM.info.script.name}] YouTube API response found in cache for video ID: ${videoId}.`);
                return cachedData !== false ? cachedData : null;
            }

            const url = new URL('videos', Config.YOUTUBE_API_ROOT);
            url.searchParams.append('part', Config.YOUTUBE_API_VIDEO_PARTS);
            url.searchParams.append('id', videoId);
            url.searchParams.append('key', Config.GOOGLE_API_KEY);

            console.log(`[${GM.info.script.name}] Calling YouTube API for video ID:`, videoId);
            try {
                const response = await Utils.gmXmlHttpRequest({
                    method: 'GET',
                    url: url.toString(),
                }, 'YouTube API');

                const parsedFullResponse = JSON.parse(response.responseText);
                if (parsedFullResponse.items && parsedFullResponse.items.length > 0) {
                    const videoData = parsedFullResponse.items[0];
                    this._videoDataCache.set(videoId, videoData);
                    return videoData;
                } else {
                    console.log(`[${GM.info.script.name}] YouTube API returned no items for video ID: ${videoId}.`);
                    this._videoDataCache.set(videoId, false);
                    return null;
                }
            } catch (error) {
                console.error(`[${GM.info.script.name}] Error fetching YouTube video data for ${videoId}:`, error);
                this._videoDataCache.set(videoId, false);
                throw error;
            }
        },
    };

    /**
     * Handles all interactions with the ListenBrainz API.
     */
    const rateLimitState = {
        isBlocked: false,
        resetTime: 0,
    };

const ListenBrainzAPI = {
        _searchCache: new Map(),
        /**
         * Generic helper for making requests to the ListenBrainz API.
         * @param {string} endpoint - The API endpoint path.
         * @param {Object} options - Configuration for the request.
         * @param {string} options.token - The user's ListenBrainz token.
         * @param {string} [options.method='GET'] - The HTTP method.
         * @param {Object|null} [options.body=null] - The JSON body for POST requests.
         * @returns {Promise<Object>} The parsed JSON response.
         */
        async apiRequest(endpoint, { token, method = 'GET', body = null }) {
            if (rateLimitState.isBlocked && Date.now() < rateLimitState.resetTime) {
                const waitMs = (rateLimitState.resetTime - Date.now()) + 100;
                console.warn(`[${GM.info.script.name}] Rate limited locally. Waiting ${Math.ceil(waitMs / 1000)}s...`);
                await new Promise(resolve => setTimeout(resolve, waitMs));
            }
            rateLimitState.isBlocked = false;
            const url = Config.LISTENBRAINZ_API_ROOT + endpoint;
            const headers = new Headers();

            // This is where the Authorization header is constructed
            if (token) headers.append('Authorization', `Token ${token}`);

            if (body) headers.append('Content-Type', 'application/json');
            try {
                const response = await Utils.gmXmlHttpRequest({
                    method,
                    url,
                    headers: Object.fromEntries(headers.entries()),
                    data: body ? JSON.stringify(body) : null,
                }, 'ListenBrainz API');
                const remaining = response.responseHeaders.match(/x-ratelimit-remaining:\s*(\d+)/i);
                const resetIn = response.responseHeaders.match(/x-ratelimit-reset-in:\s*(\d+)/i);

                if (remaining && resetIn && parseInt(remaining[1], 10) === 0) {
                    const resetInMs = parseInt(resetIn[1], 10) * 1000;
                    rateLimitState.isBlocked = true;
                    rateLimitState.resetTime = Date.now() + resetInMs;
                }

                if (response.status === 429) {
                    const retryAfter = response.responseHeaders.match(/retry-after:\s*(\d+)/i) || resetIn;
                    const retryAfterMs = parseInt(retryAfter ? retryAfter[1] : '10', 10) * 1000;
                    rateLimitState.isBlocked = true;
                    rateLimitState.resetTime = Date.now() + retryAfterMs;
                    console.warn(`[${GM.info.script.name}] 429 Rate limit exceeded. Waiting ${retryAfterMs / 1000}s before retrying...`);
                    await new Promise(resolve => setTimeout(resolve, retryAfterMs + 100));
                    return this.apiRequest(endpoint, { token, method, body });
                }

                return response.responseText ? JSON.parse(response.responseText) : {};
            } catch (error) {
                console.error(`[${GM.info.script.name}] ListenBrainz API Error:`, error);
                throw error;
            }
        },

        async searchPlaylists(query) {
            if (this._searchCache.has(query)) {
                return this._searchCache.get(query);
            }
            const token = await TokenManager.getToken();
            if (!token) throw new Error("ListenBrainz token not set.");

            const endpoint = `playlist/search?query=${encodeURIComponent(query)}&count=100`;
            const data = await this.apiRequest(endpoint, { token });
            this._searchCache.set(query, data);
            return data;
        },

        async lookupTrack(artist, title) {
            const token = await TokenManager.getToken();
            const endpoint = `metadata/lookup/?artist_name=${encodeURIComponent(artist)}&recording_name=${encodeURIComponent(title)}&metadata=false&inc=artist`;
            const data = await this.apiRequest(endpoint, { token });

            return data.recording_mbid ? { title, creator: artist, identifier: `https://musicbrainz.org/recording/${data.recording_mbid}` } : null;
        },

        async createPlaylist(token, title, annotation, tracks, isPublic) {
            const jspf = { playlist: { title, track: tracks, annotation, extension: { "https://musicbrainz.org/doc/jspf#playlist": { public: isPublic } } } };
            return this.apiRequest('playlist/create', { method: 'POST', token, body: jspf });
        },

        async fetchPlaylist(token, mbid) {
            const data = await this.apiRequest(`playlist/${mbid}`, { token });
            return data.playlist;
        },

        async addMetadataToPlaylist(token, mbid, existingPlaylist, description) {
            const jspf = {
                playlist: {
                    title: existingPlaylist.title,
                    annotation: existingPlaylist.annotation || '',
                    extension: {
                        "https://musicbrainz.org/doc/jspf#playlist": {
                            public: existingPlaylist.extension["https://musicbrainz.org/doc/jspf#playlist"].public,
                            additional_metadata: { "youtube_description": description }
                        }
                    }
                }
            };
            return this.apiRequest(`playlist/edit/${mbid}`, { method: 'POST', token, body: jspf });
        },

        async deletePlaylistItems(token, mbid, index, count) {
            if (count === 0) return;
            return this.apiRequest(`playlist/${mbid}/item/delete`, { method: 'POST', token, body: { index, count } });
        },

        async addPlaylistItemAtOffset(token, mbid, offset, tracks) {
            const jspf = { playlist: { track: tracks } };
            return this.apiRequest(`playlist/${mbid}/item/add/${offset}`, { method: 'POST', token, body: jspf });
        },

        /**
         * Edits a playlist's core metadata, including title, annotation, visibility, and description.
         * This function replaces the previous addMetadataToPlaylist.
         * @param {string} token - The user's ListenBrainz token.
         * @param {string} mbid - The MBID of the playlist to edit.
         * @param {Object} details - The metadata to update.
         * @param {string} details.title - The new title.
         * @param {string} details.annotation - The new annotation.
         * @param {boolean} details.isPublic - The public status.
         * @param {string} details.description - The full description to store in additional_metadata.
         */
        async editPlaylistMetadata(token, mbid, { title, annotation, isPublic, description }) {
            const jspf = {
                playlist: {
                    title,
                    annotation: annotation || '',
                    extension: {
                        "https://musicbrainz.org/doc/jspf#playlist": {
                            public: isPublic,
                            additional_metadata: { "youtube_description": description }
                        }
                    }
                }
            };
            return this.apiRequest(`playlist/edit/${mbid}`, { method: 'POST', token, body: jspf });
        },
    };

    /**
     * Scans the DOM for relevant elements and extracts information.
     */
    const DOMScanner = {
        /**
         * Checks if the current page is a YouTube video watch page.
         * @returns {string|null} The video ID if it's a video page, otherwise null.
         */
        getVideoId: function () {
            const videoIdMatch = location.href.match(/[?&]v=([A-Za-z0-9_-]{11})/);
            return videoIdMatch ? videoIdMatch[1] : null;
        },

        /**
         * Finds the DOM element where the import button should be appended.
         * @returns {Promise<HTMLElement|null>} A promise that resolves with the dock element, or null if not found.
         */
        getButtonAnchorElement: async function () {
            try {
                const dock = await Utils.waitForElement(Config.SELECTORS.BUTTON_DOCK);
                console.log(`[${GM.info.script.name}] Found button dock:`, dock);
                return dock;
            } catch (e) {
                console.error(`[${GM.info.script.name}] Could not find button dock element:`, e);
                return null;
            }
        },
    };

    /**
     * Manages the creation, display, and state of the MusicBrainz import button.
     */
    const RecordingButtonManager = {
        _form: null,
        _submitButton: null,
        _textElement: null,
        _containerDiv: null,

        /**
         * Initializes the button elements and their basic structure.
         */
        init: function () {
            this._containerDiv = document.createElement("div");
            this._containerDiv.setAttribute("class", `holder ${Config.CLASS_NAMES.CONTAINER}`);
            this._containerDiv.style.display = 'none';

            this._form = document.createElement("form");
            this._form.method = "get";
            this._form.action = "//musicbrainz.org/recording/create";
            this._form.acceptCharset = "UTF-8";
            this._form.target = "_blank";

            this._submitButton = document.createElement("button");
            this._submitButton.type = "submit";
            this._submitButton.title = L10n.getString('addRecordingTitle');
            this._submitButton.setAttribute("class", Config.CLASS_NAMES.BUTTON);
            this._textElement = document.createElement("span");
            this._textElement.innerText = L10n.getString('loading');

            const buttonContent = document.createElement('div');
            buttonContent.style.display = 'flex';
            buttonContent.style.alignItems = 'center';
            buttonContent.appendChild(this._textElement);
            this._submitButton.appendChild(buttonContent);

            this._form.appendChild(this._submitButton);
            this._containerDiv.appendChild(this._form);
        },

        /**
         * Resets the button state, clearing previous form fields and setting to loading.
         */
        resetState: function () {
            Array.from(this._form.querySelectorAll('input[type="hidden"]')).forEach(input => this._form.removeChild(input));
            while (this._containerDiv.firstChild) {
                this._containerDiv.removeChild(this._containerDiv.firstChild);
            }
            this._containerDiv.appendChild(this._form);

            this._textElement.innerText = L10n.getString('loading');
            this._submitButton.className = Config.CLASS_NAMES.BUTTON;
            this._submitButton.disabled = true;
            this._form.style.display = 'flex';
            this._containerDiv.style.display = 'flex';
        },

        /**
         * Appends a hidden input field to the form.
         * @param {string} name - The name attribute of the input field.
         * @param {string} value - The value attribute of the input field.
         */
        _addField: function (name, value) {
            if (!this._form) return;
            const field = document.createElement("input");
            field.type = "hidden";
            field.name = name;
            field.value = value;
            this._form.insertBefore(field, this._submitButton);
        },

        /**
         * Appends the button container to the specified dock element.
         * If dock is null, it appends to body as a fallback.
         * @param {HTMLElement|null} dockElement - The element to append the button to.
         */
        appendToDock: function (dockElement) {
            if (document.body.contains(this._containerDiv)) {
                return;
            }

            if (dockElement) {
                dockElement.appendChild(this._containerDiv);
                console.log(`[${GM.info.script.name}] Button UI appended to dock.`);
            } else {
                console.warn(`[${GM.info.script.name}] Could not find a suitable dock element. Appending to body as last resort.`);
                document.body.appendChild(this._containerDiv);
                this._containerDiv.style.position = 'fixed';
                this._containerDiv.style.top = '10px';
                this._containerDiv.style.right = '10px';
                this._containerDiv.style.zIndex = '9999';
                this._containerDiv.style.background = 'rgba(0,0,0,0.7)';
                this._containerDiv.style.padding = '5px';
                this._containerDiv.style.borderRadius = '5px';
            }
        },

        /**
         * Prepares the form with YouTube video data and displays the "Add Recording" button.
         * @param {Object} youtubeVideoData - The minimalist YouTube video data.
         * @param {string} canonicalYtUrl - The canonical YouTube URL.
         * @param {string|null} artistMbid - The MusicBrainz Artist MBID if found.
         * @param {string} videoId - The YouTube video ID.
         */
        prepareAddButton: function (youtubeVideoData, canonicalYtUrl, artistMbid, videoId) {
            const title = youtubeVideoData.snippet.title;
            const artist = youtubeVideoData.snippet.channelTitle;

            let length = 0;
            if (youtubeVideoData.contentDetails && typeof youtubeVideoData.contentDetails.duration === 'string') {
                length = Utils.ISO8601toMilliSeconds(youtubeVideoData.contentDetails.duration);
            }

            this._addField('edit-recording.name', title);
            if (artistMbid) {
                this._addField('artist', artistMbid);
                this._addField('edit-recording.artist_credit.names.0.artist.name', artist);
            } else {
                this._addField('edit-recording.artist_credit.names.0.name', artist);
            }

            if (typeof length === 'number' && !isNaN(length) && length > 0) {
                this._addField('edit-recording.length', length);
            }

            this._addField('edit-recording.video', '1');
            this._addField('edit-recording.url.0.text', canonicalYtUrl);
            this._addField('edit-recording.url.0.link_type_id', Config.MUSICBRAINZ_FREE_STREAMING_LINK_TYPE_ID);
            const scriptInfo = GM_info.script;
            const editNote = `${document.location.href}\n—\n${scriptInfo.name} (v${scriptInfo.version})`;
            this._addField('edit-recording.edit_note', editNote);

            this._textElement.innerText = L10n.getString('addRecording');
            this._submitButton.className = `${Config.CLASS_NAMES.BUTTON} ${Config.CLASS_NAMES.BUTTON_READY}`;
            this._submitButton.disabled = false;
            this._form.style.display = 'flex';

            this._submitButton.onclick = () => {
                console.log(`[${GM.info.script.name}] Import button clicked. Clearing cache for video ID: ${videoId}`);
                YouTubeMusicBrainzImporter._mbApi.invalidateCacheForUrl(canonicalYtUrl);

                if (youtubeVideoData.snippet.channelId) {
                    const youtubeChannelUrl = new URL(`https://www.youtube.com/channel/${youtubeVideoData.snippet.channelId}`).toString();
                    YouTubeMusicBrainzImporter._mbApi.invalidateCacheForUrl(youtubeChannelUrl);
                }
            };
        },

        /**
         * Displays the "On MB ✓" button, linking to the existing MusicBrainz entity.
         * If the recording has no length, it provides a button to update it.
         * @param {Array} allRelevantRecordingRelations - An array of recording relations.
         * @param {string} urlEntityId - The MusicBrainz URL entity ID.
         * @param {Object} youtubeVideoData - The minimalist YouTube video data.
         */
        displayExistingButton: function (allRelevantRecordingRelations, urlEntityId, youtubeVideoData) {
            this._form.style.display = 'none';
            const link = document.createElement('a');
            link.style.textDecoration = 'none';
            link.target = '_blank';

            const button = document.createElement('button');
            const span = document.createElement('span');
            button.appendChild(span);
            link.appendChild(button);

            if (allRelevantRecordingRelations.length === 1) {
                const existingRecordingRelation = allRelevantRecordingRelations[0];
                const recordingMBID = existingRecordingRelation.recording.id;
                const recordingTitle = existingRecordingRelation.recording.title || "View Recording";
                const hasLength = existingRecordingRelation.recording.length != null;
                const ytHasLength = youtubeVideoData && youtubeVideoData.contentDetails && youtubeVideoData.contentDetails.duration;

                // Check if the recording is missing the length and we have a length from YouTube
                if (!hasLength && ytHasLength) {
                    const lengthInMs = Utils.ISO8601toMilliSeconds(youtubeVideoData.contentDetails.duration);
                    const scriptInfo = GM_info.script;
                    const editNote = `${document.location.href}\n—\n${scriptInfo.name} (v${scriptInfo.version})`;
                    const encodedEditNote = encodeURIComponent(editNote);
                    link.href = `//musicbrainz.org/recording/${recordingMBID}/edit?edit-recording.length=${lengthInMs}&edit-recording.edit_note=${encodedEditNote}`;
                    link.title = L10n.getString('updateLengthTitle', {
                        length: Math.round(lengthInMs / 1000)
                    });
                    span.textContent = L10n.getString('updateLength');
                    button.className = `${Config.CLASS_NAMES.BUTTON} ${Config.CLASS_NAMES.BUTTON_UPDATE}`;
                    console.log(`[${GM.info.script.name}] Displaying 'Update Length' button for recording ${recordingMBID}.`);
                } else {
                    // Default behavior: link to the recording page
                    link.href = `//musicbrainz.org/recording/${recordingMBID}`;
                    link.title = L10n.getString('linkedToRecordingTitle', {
                        title: recordingTitle
                    });
                    span.textContent = L10n.getString('onMB');
                    button.className = `${Config.CLASS_NAMES.BUTTON} ${Config.CLASS_NAMES.BUTTON_ADDED}`;
                }
            } else {
                console.log(`[${GM.info.script.name}] Multiple recording relations found. Linking to URL entity page.`);
                link.href = `//musicbrainz.org/url/${urlEntityId}`;
                link.title = L10n.getString('linkedToMultiTitle');
                span.textContent = L10n.getString('onMBMulti');
                button.className = `${Config.CLASS_NAMES.BUTTON} ${Config.CLASS_NAMES.BUTTON_ADDED}`;
            }
            this._containerDiv.appendChild(link);
            console.log(`[${GM.info.script.name}] Displaying existing link button.`);
        },

        /**
         * Displays an error button with a given message.
         * @param {string} message - The error message to display.
         */
        displayError: function (message) {
            this.resetState();
            this._textElement.innerText = message;
            this._submitButton.className = `${Config.CLASS_NAMES.BUTTON} ${Config.CLASS_NAMES.BUTTON_ERROR}`;
            this._submitButton.disabled = true;
            this._containerDiv.style.display = 'flex';
        },

        /**
         * Displays an informational button with a given message.
         * @param {string} message - The info message to display.
         */
        displayInfo: function (message) {
            this.resetState();
            this._textElement.innerText = message;
            this._submitButton.className = `${Config.CLASS_NAMES.BUTTON} ${Config.CLASS_NAMES.BUTTON_INFO}`;
            this._submitButton.disabled = true;
            this._containerDiv.style.display = 'flex';
        }
    };

    /**
     * Manages the UI for the ListenBrainz playlist button.
     */
    const PlaylistButtonManager = {
        _containerDiv: null,
        _currentButton: null,

        _clearContainer: function() {
            const element = this._containerDiv;
            while (element && element.firstChild) {
                element.removeChild(element.firstChild);
            }
        },

        init: function () {
            this._containerDiv = document.createElement("div");
            this._containerDiv.setAttribute("class", `holder ${Config.CLASS_NAMES.CONTAINER}`);
            this._containerDiv.style.display = 'none';
        },

        appendToDock: function (dockElement) {
            if (document.body.contains(this._containerDiv)) {
                return;
            }
            if (dockElement) {
                dockElement.appendChild(this._containerDiv);
            }
        },

        _createButton(text, title, className, onClick) {
            const button = document.createElement("button");
            button.type = "button";
            button.title = title;
            button.className = `${Config.CLASS_NAMES.BUTTON} ${Config.CLASS_NAMES.PLAYLIST_BUTTON} ${className || ''}`;

            const span = document.createElement('span');
            span.innerText = text;
            button.appendChild(span);

            if (onClick) {
                button.addEventListener('click', onClick);
            }
            return button;
        },

        _replaceButton(newButton) {
            this._clearContainer();
            this._currentButton = newButton;
            this._containerDiv.appendChild(this._currentButton);
            this._containerDiv.style.display = 'flex';
        },

        hide: function() {
            this._containerDiv.style.display = 'none';
        },

        resetState: function () {
            this._clearContainer();
            const loadingButton = this._createButton(L10n.getString('loading'), '', '', null);
            loadingButton.disabled = true;
            this._replaceButton(loadingButton);
        },

        setStateTokenNeeded: function(onSuccessCallback) {
            const button = this._createButton(
                L10n.getString('tokenMissing'),
                L10n.getString('tokenMissingTitle'),
                Config.CLASS_NAMES.BUTTON_ERROR,
                async () => {
                    const token = await TokenManager.getToken(true);
                    if (token) {
                        onSuccessCallback();
                    }
                }
            );
            this._replaceButton(button);
        },

        setStateCreate: function (onClick) {
            const button = this._createButton(L10n.getString('createPlaylist'), L10n.getString('createPlaylistTitle'), '', onClick);
            this._replaceButton(button);
        },

        setStateSync: function (title, mbid, onClick) {
            const link = document.createElement('a');
            link.href = `//listenbrainz.org/playlist/${mbid}`;
            link.title = L10n.getString('linkedToPlaylistTitle', { title });
            link.target = '_blank';
            link.style.textDecoration = 'none';
            const buttonExists = this._createButton(L10n.getString('onLB'), L10n.getString('linkedToPlaylistTitle', { title }), Config.CLASS_NAMES.BUTTON_ADDED, null);
            link.appendChild(buttonExists);

            const syncButton = this._createButton(L10n.getString('syncPlaylist'), L10n.getString('syncPlaylistTitle'), Config.CLASS_NAMES.PLAYLIST_BUTTON_SYNC, onClick);

            this._clearContainer();
            this._containerDiv.appendChild(link);
            this._containerDiv.appendChild(syncButton);
            this._containerDiv.style.display = 'flex';
        },

        setStateExists: function (title, targetUrl) {
            const link = document.createElement('a');
            const uuidRegex = /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i;
            if (uuidRegex.test(targetUrl)) {
                link.href = `//listenbrainz.org/playlist/${targetUrl}`;
            } else {
                link.href = targetUrl.startsWith('http') ? targetUrl : `//${targetUrl}`;
            }

            link.title = L10n.getString('linkedToPlaylistTitle', { title });
            link.target = '_blank';
            link.style.textDecoration = 'none';

            const text = title === 'On LB (Multi)' ? 'On LB (Multi) ✓' : L10n.getString('onLB');
            const button = this._createButton(text, link.title, Config.CLASS_NAMES.BUTTON_ADDED, null);
            link.appendChild(button);
            this._replaceButton(link);
        },

        setStateReport: function(title, mbid, openReportCallback) {
            const link = document.createElement('a');
            link.href = `//listenbrainz.org/playlist/${mbid}`;
            link.title = L10n.getString('linkedToPlaylistTitle', { title });
            link.target = '_blank';
            link.style.textDecoration = 'none';
            const buttonExists = this._createButton(L10n.getString('onLB'), L10n.getString('linkedToPlaylistTitle', { title }), Config.CLASS_NAMES.BUTTON_ADDED, null);
            link.appendChild(buttonExists);

            const reportButton = this._createButton(L10n.getString('viewReport'), L10n.getString('viewReportTitle'), 'lb-report-button', openReportCallback);

            this._clearContainer();
            this._containerDiv.appendChild(link);
            this._containerDiv.appendChild(reportButton);
            this._containerDiv.style.display = 'flex';
        },

        setStateInProgress: function(message) {
            const button = this._createButton(message, '', '', null);
            button.disabled = true;
            this._replaceButton(button);
        },

        displayError: function(message) {
            const button = this._createButton(message, '', Config.CLASS_NAMES.BUTTON_ERROR, null);
            button.disabled = true;
            this._replaceButton(button);
        }
    };

    /**
     * High-level logic for creating and syncing ListenBrainz playlists.
     */
    const PlaylistLogic = {
        _generateReportHTML: function(notFoundTracks, unparsedLines, videoTitle) {
            let html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Playlist Import Report: ${videoTitle}</title>
            <style>body{font-family:sans-serif;padding:1em 2em;background-color:#f9f9f9;} h1,h2{border-bottom:1px solid #ccc;padding-bottom:5px;} ul{list-style:none;padding-left:0;} li{margin-bottom:0.8em;padding:0.5em;background-color:white;border:1px solid #ddd;border-radius:4px;} a{text-decoration:none;color:#007bff;font-weight:bold;margin-left:1em;}</style>
            </head><body><h1>Playlist Import Report</h1><h2>${videoTitle}</h2>`;

            if (notFoundTracks.length > 0) {
                html += '<h2>Unmatched Tracks</h2><p>These lines were parsed as tracks but could not be found on MusicBrainz.</p><ul>';
                notFoundTracks.forEach(track => {
                    const mbQuery = `artist:"${track.artist}" AND recording:"${track.title}"`;
                    const mbSearchUrl = `https://musicbrainz.org/search?query=${encodeURIComponent(mbQuery)}&type=recording&method=advanced`;
                    const googleQuery = `"${track.artist}" "${track.title}"`;
                    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(googleQuery)}&nfpr=1`;
                    html += `<li>${track.originalLine} <a href="${mbSearchUrl}" target="_blank">[Search MB]</a> <a href="${googleSearchUrl}" target="_blank">[Search Google]</a></li>`;
                });
                html += '</ul>';
            }

            if (unparsedLines.length > 0) {
                html += '<h2>Unparsed Lines</h2><p>These lines from the description did not match any track format.</p><ul>';
                unparsedLines.forEach(line => {
                    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(line)}`;
                    html += `<li>${line} <a href="${searchUrl}" target="_blank">[Search Google]</a></li>`;
                });
                html += '</ul>';
            }

            html += '</body></html>';
            return html;
        },

        async _processTracklist(description, progressCallback) {
            const { parsedTracks, unparsedLines } = Utils.parseTracklist(description);
            if (parsedTracks.length === 0) {
                return { foundTracks: [], notFoundTracks: [], unparsedLines };
            }

            parsedTracks.sort((a, b) => a.timestampSeconds - b.timestampSeconds);

            // --- Heuristic ---
            const uniqueArtists = new Set(parsedTracks.map(t => t.artist)).size;
            const uniqueTitles = new Set(parsedTracks.map(t => t.title)).size;
            const parserIsLikelySwapped = (uniqueArtists > 0 && uniqueTitles > 0 && parsedTracks.length > 3)
                                          ? (uniqueArtists > uniqueTitles)
                                          : false;

            if (parserIsLikelySwapped) {
                console.log(`[${GM.info.script.name}] Tracklist heuristic: uniqueArtists=${uniqueArtists}, uniqueTitles=${uniqueTitles}. Parser output likely swapped. Prioritizing swapped lookup.`);
            } else {
                 console.log(`[${GM.info.script.name}] Tracklist heuristic: uniqueArtists=${uniqueArtists}, uniqueTitles=${uniqueTitles}. Parser output seems correct. Prioritizing parser order lookup.`);
            }
            // --- End of heuristic ---

            let foundTracks = [];
            let potentiallyNotFound = []; // Tracks not found in the first pass

            // --- First Pass: Use the heuristic's best guess ---
            let i = 0;
            for (const track of parsedTracks) {
                if (progressCallback) progressCallback(i, parsedTracks.length, 'Pass 1'); // Indicate pass 1

                const artistGuess1 = parserIsLikelySwapped ? track.title.trim() : track.artist.trim();
                const titleGuess1 = parserIsLikelySwapped ? track.artist.trim() : track.title.trim();

                try {
                    const result = await ListenBrainzAPI.lookupTrack(artistGuess1, titleGuess1);
                    if (result) {
                        foundTracks.push(result);
                    } else {
                         // Add original track object with the heuristic's guess applied for potential second pass/reporting
                        potentiallyNotFound.push({
                            artist: artistGuess1,
                            title: titleGuess1,
                            timestamp: track.timestamp,
                            timestampSeconds: track.timestampSeconds,
                            originalLine: track.originalLine,
                            // Store the alternative guess for the second pass
                            altArtist: parserIsLikelySwapped ? track.artist.trim() : track.title.trim(),
                            altTitle: parserIsLikelySwapped ? track.title.trim() : track.artist.trim()
                        });
                    }
                } catch (error) {
                    console.error(`[${GM.info.script.name}] Error during Pass 1 lookup for track: "${artistGuess1} - ${titleGuess1}" (Original line: ${track.originalLine})`, error);
                     // Add to potentiallyNotFound on error too, using heuristic guess for report
                     potentiallyNotFound.push({
                            artist: artistGuess1,
                            title: titleGuess1,
                            timestamp: track.timestamp,
                            timestampSeconds: track.timestampSeconds,
                            originalLine: track.originalLine,
                            altArtist: parserIsLikelySwapped ? track.artist.trim() : track.title.trim(),
                            altTitle: parserIsLikelySwapped ? track.title.trim() : track.artist.trim()
                        });
                }
                i++;
            }

            // --- Second Pass (Conditional): Try swapped order only if the first pass found nothing ---
            let finalNotFoundTracks = potentiallyNotFound; // Assume all potential misses are final unless found in pass 2

            if (foundTracks.length === 0 && potentiallyNotFound.length > 0) {
                console.log(`[${GM.info.script.name}] First pass found no tracks. Starting second pass with swapped order.`);
                foundTracks = []; // Reset foundTracks for the second pass results
                finalNotFoundTracks = []; // Reset finalNotFoundTracks for the second pass results
                let j = 0;

                for (const trackInfo of potentiallyNotFound) {
                     if (progressCallback) progressCallback(j, potentiallyNotFound.length, 'Pass 2'); // Indicate pass 2

                    try {
                        // Use the alternative guess stored earlier
                        const result = await ListenBrainzAPI.lookupTrack(trackInfo.altArtist, trackInfo.altTitle);
                        if (result) {
                            foundTracks.push(result);
                        } else {
                            // Track still not found, add its *heuristic guess* to final report list
                            console.log(`[${GM.info.script.name}] Track still not found on Pass 2: "${trackInfo.artist} - ${trackInfo.title}" (Original line: ${trackInfo.originalLine})`);
                             finalNotFoundTracks.push({
                                artist: trackInfo.artist, // Report using heuristic guess
                                title: trackInfo.title,   // Report using heuristic guess
                                timestamp: trackInfo.timestamp,
                                timestampSeconds: trackInfo.timestampSeconds,
                                originalLine: trackInfo.originalLine
                            });
                        }
                    } catch (error) {
                        console.error(`[${GM.info.script.name}] Error during Pass 2 lookup for track: "${trackInfo.altArtist} - ${trackInfo.altTitle}" (Original line: ${trackInfo.originalLine})`, error);
                        // Add heuristic guess to report on error
                         finalNotFoundTracks.push({
                                artist: trackInfo.artist,
                                title: trackInfo.title,
                                timestamp: trackInfo.timestamp,
                                timestampSeconds: trackInfo.timestampSeconds,
                                originalLine: trackInfo.originalLine
                            });
                    }
                    j++;
                }
            } else if (potentiallyNotFound.length > 0){
                 // First pass found *some* tracks, so don't run second pass.
                 // Convert potentiallyNotFound (which includes altArtist/altTitle)
                 // back to the simple structure needed for the report.
                 finalNotFoundTracks = potentiallyNotFound.map(trackInfo => ({
                    artist: trackInfo.artist, // Report using heuristic guess
                    title: trackInfo.title,   // Report using heuristic guess
                    timestamp: trackInfo.timestamp,
                    timestampSeconds: trackInfo.timestampSeconds,
                    originalLine: trackInfo.originalLine
                }));
                 console.log(`[${GM.info.script.name}] First pass found ${foundTracks.length} tracks. Skipping second pass.`);
            }

            return { foundTracks, notFoundTracks: finalNotFoundTracks, unparsedLines };
        },

        async createPlaylist(ytData, canonicalYtUrl) {
            const token = await TokenManager.getToken();
            if (!token) {
                PlaylistButtonManager.setStateTokenNeeded(() => this.createPlaylist(ytData, canonicalYtUrl));
                return;
            }

            PlaylistButtonManager.setStateInProgress('Processing...');
            try {
                const { foundTracks, notFoundTracks, unparsedLines } = await this._processTracklist(ytData.snippet.description, (current, total) => {
                    PlaylistButtonManager.setStateInProgress(`Looking up: ${current}/${total}`);
                });

                if (foundTracks.length === 0) {
                    PlaylistButtonManager.displayError('No tracks found');
                    return;
                }

                let playlistTitle = ytData.snippet.title;
                if (notFoundTracks.length > 0) {
                    playlistTitle = `[INCOMPLETE] ${playlistTitle}`;
                }

                PlaylistButtonManager.setStateInProgress('Creating...');
                const createResponse = await ListenBrainzAPI.createPlaylist(token, playlistTitle, canonicalYtUrl, foundTracks, true);
                const newMbid = createResponse.playlist_mbid;

                PlaylistButtonManager.setStateInProgress('Storing metadata...');
                await ListenBrainzAPI.editPlaylistMetadata(token, newMbid, {
                    title: playlistTitle,
                    annotation: canonicalYtUrl,
                    isPublic: true,
                    description: ytData.snippet.description
                });

                if (notFoundTracks.length > 0 || unparsedLines.length > 0) {
                    const reportHtml = this._generateReportHTML(notFoundTracks, unparsedLines, ytData.snippet.title);
                    const openReport = () => {
                        const blob = new Blob([reportHtml], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        const reportWindow = window.open(url);
                        if (reportWindow) {
                            reportWindow.addEventListener('unload', () => {
                                URL.revokeObjectURL(url);
                            });
                        } else {
                            alert('Popup blocked! Please allow popups for this site to view the report.');
                        }
                    };
                    PlaylistButtonManager.setStateReport(playlistTitle, newMbid, openReport);
                } else {
                    PlaylistButtonManager.setStateExists(playlistTitle, newMbid);
                }

            } catch (error) {
                PlaylistButtonManager.displayError('Creation Failed');
                console.error("Error creating playlist:", error);
            }
        },

        async syncPlaylist(ytData, canonicalYtUrl, playlistMbid) {
            const token = await TokenManager.getToken();
            if (!token) {
                PlaylistButtonManager.setStateTokenNeeded(() => this.syncPlaylist(ytData, canonicalYtUrl, playlistMbid));
                return;
            }

            PlaylistButtonManager.setStateInProgress('Syncing...');
            try {
                // Step 1: Fetch existing playlist and process new tracklist
                PlaylistButtonManager.setStateInProgress('Fetching data...');
                const existingPlaylist = await ListenBrainzAPI.fetchPlaylist(token, playlistMbid);
                const oldTracks = existingPlaylist.track || [];
                const oldMbids = oldTracks.map(t => t.identifier[0].split('/').pop());

                const { foundTracks: newTracks, notFoundTracks, unparsedLines } = await this._processTracklist(ytData.snippet.description, (current, total) => {
                    PlaylistButtonManager.setStateInProgress(`Looking up: ${current}/${total}`);
                });
                const newMbids = newTracks.map(t => t.identifier.split('/').pop());

                // Steps 2 & 3: Calculate and perform deletions and additions
                PlaylistButtonManager.setStateInProgress('Updating tracks...');
                const lcsMbids = Utils.findLCS(oldMbids, newMbids);
                const lcsMbidsSet = new Set(lcsMbids);

                const indicesToDelete = oldMbids.map((mbid, index) => lcsMbidsSet.has(mbid) ? -1 : index).filter(index => index !== -1);
                indicesToDelete.sort((a, b) => b - a);

                const deleteGroups = Utils.groupDeletions(indicesToDelete);
                for (const group of deleteGroups) {
                    await ListenBrainzAPI.deletePlaylistItems(token, playlistMbid, group.index, group.count);
                }

                const currentServerMbids = oldMbids.filter(mbid => lcsMbidsSet.has(mbid));
                let serverIndex = 0;
                for (let i = 0; i < newMbids.length; i++) {
                    const newMbid = newMbids[i];
                    if (serverIndex < currentServerMbids.length && currentServerMbids[serverIndex] === newMbid) {
                        serverIndex++;
                    } else {
                        const chunkToAdd = [];
                        let lookaheadIndex = i;
                        while (lookaheadIndex < newMbids.length && (serverIndex >= currentServerMbids.length || currentServerMbids[serverIndex] !== newMbids[lookaheadIndex])) {
                            const trackToAdd = newTracks.find(t => t.identifier.endsWith(newMbids[lookaheadIndex]));
                            chunkToAdd.push(trackToAdd);
                            lookaheadIndex++;
                        }
                        if (chunkToAdd.length > 0) {
                            await ListenBrainzAPI.addPlaylistItemAtOffset(token, playlistMbid, i, chunkToAdd);
                            i = lookaheadIndex - 1;
                        }
                    }
                }

                // Step 4: Update Playlist Metadata on the server
                PlaylistButtonManager.setStateInProgress('Updating title...');
                let finalTitle = existingPlaylist.title;
                if (notFoundTracks.length === 0) {
                    finalTitle = existingPlaylist.title.replace(/\[INCOMPLETE\]\s*/, '');
                } else if (!existingPlaylist.title.startsWith('[INCOMPLETE]')) {
                    finalTitle = `[INCOMPLETE] ${existingPlaylist.title}`;
                }

                const isPublic = existingPlaylist.extension["https://musicbrainz.org/doc/jspf#playlist"].public;
                await ListenBrainzAPI.editPlaylistMetadata(token, playlistMbid, {
                    title: finalTitle,
                    annotation: existingPlaylist.annotation,
                    isPublic: isPublic,
                    description: ytData.snippet.description
                });

                if (notFoundTracks.length > 0 || unparsedLines.length > 0) {
                    const reportHtml = this._generateReportHTML(notFoundTracks, unparsedLines, ytData.snippet.title);
                    const openReport = () => {
                        const blob = new Blob([reportHtml], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        const reportWindow = window.open(url);
                        if (reportWindow) {
                            reportWindow.addEventListener('unload', () => {
                                URL.revokeObjectURL(url);
                            });
                        } else {
                            alert('Popup blocked! Please allow popups for this site to view the report.');
                        }
                    };
                    PlaylistButtonManager.setStateReport(finalTitle, playlistMbid, openReport);
                } else {
                    PlaylistButtonManager.setStateExists(finalTitle, playlistMbid);
                }

            } catch (error) {
                PlaylistButtonManager.displayError('Sync Failed');
                console.error("Error syncing playlist:", error);
            }
        },
    };

    /**
     * Main application logic for the userscript.
     */
    const YouTubeMusicBrainzImporter = {
        _previousUrl: '',
        _processingVideoId: null,
        _currentProcessingPromise: null,
        _navigationTimeoutId: null,
        _prefetchedDataPromise: null,
        _prefetchedVideoId: null,
        _mbApi: null,

        lookupMbUrls: async function (canonicalUrls) {
            try {
                return await this._mbApi.lookupUrl(canonicalUrls, ['recording-rels', 'artist-rels']);
            } catch (error) {
                if (error.name === 'PermanentError') {
                    console.log(`[${GM.info.script.name}] A URL was not found in MusicBrainz (404), which is expected.`);
                } else {
                    console.error(`[${GM.info.script.name}] An unexpected error occurred looking up MusicBrainz URLs:`, error);
                }
                // On error, return a map with null values for all requested URLs
                const resultsMap = new Map();
                const urls = Array.isArray(canonicalUrls) ? canonicalUrls : [canonicalUrls];
                urls.forEach(url => resultsMap.set(url, null));
                return resultsMap;
            }
        },

        _extractArtistMbid: function (channelUrlEntity) {
            if (!channelUrlEntity?.relations) return null;
            const artistRelation = channelUrlEntity.relations.find(rel => rel['target-type'] === 'artist' && rel.artist);
            return artistRelation?.artist.id || null;
        },


        /**
         * Initializes the application: injects CSS and sets up observers.
         */
        init: function () {
            this._mbApi = new MusicBrainzAPI({ user_agent: USER_AGENT });
            this._injectCSS();
            TokenManager.init(); // Initialize token manager
            RecordingButtonManager.init();
            PlaylistButtonManager.init(); // Initialize playlist button manager
            this._setupObservers();
            this._setupUrlChangeListeners();
            this._previousUrl = window.location.href;

            this.triggerUpdate(DOMScanner.getVideoId());
        },

        /**
         * Injects custom CSS rules into the document head for button styling.
         */
        _injectCSS: function () {
            const head = document.head || document.getElementsByTagName('head')[0];
            if (head) {
                const style = document.createElement('style');
                style.setAttribute('type', 'text/css');
                style.textContent = `
                    .${Config.CLASS_NAMES.CONTAINER} {
                        /* Add any container specific styles here if needed */
                    }
                    .dashbox {
                        padding-bottom: 4px;
                    }
                    .button-area {
                        display: flex;
                        padding: 5px;
                    }
                    .button-favicon {
                        height: 1.25em;
                        margin-left: 5px;
                    }
                    .holder {
                        height: 100%;
                        display: flex;
                        align-items: center;
                    }
                    .${Config.CLASS_NAMES.BUTTON} {
                        border-radius: 18px;
                        border: none;
                        padding: 0px 10px;
                        font-size: 14px;
                        height: 36px;
                        color: white;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        text-decoration: none;
                        margin: 0px 0 0 8px;
                        background-color: #f8f8f8;
                        color: #0f0f0f;
                        transition: background-color .3s;
                    }
                    .${Config.CLASS_NAMES.BUTTON}:hover {
                        background-color: #e0e0e0;
                    }
                    .${Config.CLASS_NAMES.BUTTON}[disabled] {
                        opacity: 0.7;
                        cursor: not-allowed;
                    }
                    .${Config.CLASS_NAMES.BUTTON}.${Config.CLASS_NAMES.BUTTON_READY} {
                        background-color: #BA478F;
                        color: white;
                    }
                    .${Config.CLASS_NAMES.BUTTON}.${Config.CLASS_NAMES.BUTTON_READY}:hover {
                        background-color: #a53f7c;
                    }
                    .${Config.CLASS_NAMES.BUTTON}.${Config.CLASS_NAMES.BUTTON_ADDED} {
                        background-color: #a4a4a4;
                        color: white;
                    }
                    .${Config.CLASS_NAMES.BUTTON}.${Config.CLASS_NAMES.BUTTON_ADDED}:hover {
                        background-color: #8c8c8c;
                    }
                    .${Config.CLASS_NAMES.BUTTON}.${Config.CLASS_NAMES.BUTTON_UPDATE} {
                        background-color: #3ea6ff; /* A different color to stand out */
                        color: white;
                    }
                    .${Config.CLASS_NAMES.BUTTON}.${Config.CLASS_NAMES.BUTTON_UPDATE}:hover {
                        background-color: #3593e0;
                    }
                    .${Config.CLASS_NAMES.BUTTON}.${Config.CLASS_NAMES.BUTTON_ERROR} {
                        background-color: #cc0000;
                        color: white;
                    }
                    .${Config.CLASS_NAMES.BUTTON}.${Config.CLASS_NAMES.BUTTON_INFO} {
                        background-color: #3ea6ff;
                        color: white;
                    }
                    .${Config.CLASS_NAMES.PLAYLIST_BUTTON} {
                        background-color: #eb743b;
                        color: white;
                    }
                    .${Config.CLASS_NAMES.PLAYLIST_BUTTON}:hover {
                        background-color: #d16631;
                    }
                    .${Config.CLASS_NAMES.PLAYLIST_BUTTON}.${Config.CLASS_NAMES.PLAYLIST_BUTTON_SYNC} {
                        background-color: #007bff;
                    }
                    .${Config.CLASS_NAMES.PLAYLIST_BUTTON}.${Config.CLASS_NAMES.PLAYLIST_BUTTON_SYNC}:hover {
                        background-color: #0069d9;
                    }
                    .${Config.CLASS_NAMES.PLAYLIST_BUTTON}.${Config.CLASS_NAMES.PLAYLIST_BUTTON_SYNC}:hover {
                        background-color: #0069d9;
                    }
                    .lb-report-button {
                        background-color: #ffc107 !important;
                        color: black !important;
                    }
                    .lb-report-button:hover {
                        background-color: #e0a800 !important;
                    }
                `;
                head.appendChild(style);
            }
        },

        /**
         * Sets up observers for YouTube's SPA navigation.
         */
        _setupObservers: function () {
            document.addEventListener('yt-navigate-finish', (event) => {
                console.log(`[${GM.info.script.name}] 'yt-navigate-finish' event detected.`);

                if (this._navigationTimeoutId) {
                    clearTimeout(this._navigationTimeoutId);
                    this._navigationTimeoutId = null;
                    console.log(`[${GM.info.script.name}] Cleared previous navigation timeout.`);
                }

                this._navigationTimeoutId = setTimeout(() => {
                    const currentVideoId = DOMScanner.getVideoId();
                    this.triggerUpdate(currentVideoId);
                }, 500);
            });
        },

        /**
         * Sets up event listeners for URL changes to initiate pre-fetching of data.
         */
        _setupUrlChangeListeners: function () {
            document.addEventListener('yt-navigate-start', () => {
                const currentVideoId = DOMScanner.getVideoId();
                if (currentVideoId && currentVideoId !== this._prefetchedVideoId) {
                    console.log(`[${GM.info.script.name}] 'yt-navigate-start' detected for video ID: ${currentVideoId}. Initiating pre-fetch.`);
                    this._prefetchedVideoId = currentVideoId;
                    this._prefetchedDataPromise = this._startPrefetching(currentVideoId);
                } else if (!currentVideoId && this._prefetchedVideoId) {
                    console.log(`[${GM.info.script.name}] Navigated away from video page. Clearing pre-fetch state.`);
                    this._prefetchedVideoId = null;
                    this._prefetchedDataPromise = null;
                }
            });

            window.addEventListener('popstate', () => {
                const currentVideoId = DOMScanner.getVideoId();
                if (currentVideoId && currentVideoId !== this._prefetchedVideoId) {
                    console.log(`[${GM.info.script.name}] 'popstate' detected for video ID: ${currentVideoId}. Initiating pre-fetch.`);
                    this._prefetchedVideoId = currentVideoId;
                    this._prefetchedDataPromise = this._startPrefetching(currentVideoId);
                } else if (!currentVideoId && this._prefetchedVideoId) {
                    console.log(`[${GM.info.script.name}] Navigated away from video page. Clearing pre-fetch state.`);
                    this._prefetchedVideoId = null;
                    this._prefetchedDataPromise = null;
                }
            });

            console.log(`[${GM.info.script.name}] URL change listeners (yt-navigate-start, popstate) set up.`);
        },


        /**
         * Initiates the pre-fetching of YouTube and MusicBrainz data for a given video ID.
         * @param {string} videoId - The YouTube video ID.
         * @returns {Promise<[Object|null, Map<string, Object|null>]>} A promise that resolves with an array
         * containing [youtubeVideoData, musicBrainzUrlResultsMap] or [null, null] on error.
         */
        _startPrefetching: async function (videoId) {
            try {
                const ytDataPromise = YouTubeAPI.fetchVideoData(videoId);
                const canonicalYtUrl = new URL(`https://www.youtube.com/watch?v=${videoId}`).toString();

                const ytData = await ytDataPromise;

                if (!ytData) {
                    console.warn(`[${GM.info.script.name}] YT data not available for pre-fetching ${videoId}. Skipping MB pre-fetch.`);
                    return [null, null];
                }

                const youtubeChannelUrl = ytData.snippet.channelId ? new URL(`https://www.youtube.com/channel/${ytData.snippet.channelId}`).toString() : null;
                const urlsToQuery = [canonicalYtUrl];
                if (youtubeChannelUrl) {
                    urlsToQuery.push(youtubeChannelUrl);
                }
                const mbResultsPromise = this.lookupMbUrls(urlsToQuery);

                const [finalYtData, finalMbResults] = await Promise.all([Promise.resolve(ytData), mbResultsPromise]);
                console.log(`[${GM.info.script.name}] Pre-fetching completed for video ID: ${videoId}.`);
                return [finalYtData, finalMbResults];
            } catch (error) {
                console.error(`[${GM.info.script.name}] Error during pre-fetching for video ID: ${videoId}:`, error);
                return [null, null];
            }
        },

        /**
         * Triggers the update process for a given video ID.
         * This function acts as a gatekeeper to ensure only one update runs at a time.
         * @param {string|null} videoId - The YouTube video ID to process.
         */
        triggerUpdate: function (videoId) {
            if (this._processingVideoId === videoId && this._currentProcessingPromise) {
                console.log(`[${GM.info.script.name}] Already processing video ID: ${videoId}. Skipping trigger.`);
                return;
            }

            RecordingButtonManager.resetState();
            if (!videoId) {
                RecordingButtonManager._containerDiv.style.display = 'none';
                this._processingVideoId = null;
                this._currentProcessingPromise = null;
                console.log(`[${GM.info.script.name}] Not a YouTube video page. Hiding button.`);
                return;
            }

            this._processingVideoId = videoId;
            console.log(`[${GM.info.script.name}] Triggering update for video ID: ${videoId}`);

            if (videoId === this._prefetchedVideoId && this._prefetchedDataPromise) {
                console.log(`[${GM.info.script.name}] Using pre-fetched data for video ID: ${videoId}.`);
                this._currentProcessingPromise = this._prefetchedDataPromise
                    .then(([ytData, mbResults]) => this._performUpdate(videoId, ytData, mbResults))
                    .finally(() => {
                        if (this._processingVideoId === videoId) {
                            this._processingVideoId = null;
                            this._currentProcessingPromise = null;
                            this._prefetchedDataPromise = null;
                            this._prefetchedVideoId = null;
                        }
                    });
            } else {
                console.log(`[${GM.info.script.name}] No pre-fetched data or different video. Performing full update for video ID: ${videoId}.`);
                this._currentProcessingPromise = this._performUpdate(videoId)
                    .finally(() => {
                        if (this._processingVideoId === videoId) {
                            this._processingVideoId = null;
                            this._currentProcessingPromise = null;
                        }
                    });
            }
        },

        /**
         * The actual function that performs the API calls and UI updates.
         * @param {string} videoId - The YouTube video ID to process.
         * @param {Object|null} [prefetchedYtData=null] - Optional pre-fetched YouTube video data.
         * @param {Map<string, Object|null>|null} [prefetchedMbResults=null] - Optional pre-fetched MusicBrainz URL lookup results.
         * @returns {Promise<void>} A promise that resolves when the update is complete.
         */
        _performUpdate: async function (videoId, prefetchedYtData = null, prefetchedMbResults = null) {
            const dockElement = await DOMScanner.getButtonAnchorElement();
            RecordingButtonManager.appendToDock(dockElement);
            PlaylistButtonManager.appendToDock(dockElement);

            let ytData = prefetchedYtData;
            if (!ytData) {
                try {
                    ytData = await YouTubeAPI.fetchVideoData(videoId);
                } catch (error) {
                    const apiName = error.apiName || 'API';
                    const errorMessage = error.status === 503 ?
                        L10n.getString('errorApiRateLimit', { apiName }) :
                        L10n.getString('errorApiNetwork', { apiName });
                    RecordingButtonManager.displayError(errorMessage);
                    PlaylistButtonManager.displayError(errorMessage);
                    return;
                }
            }

            if (!ytData) {
                RecordingButtonManager.displayInfo(L10n.getString('errorVideoNotFound'));
                PlaylistButtonManager.hide();
                return;
            }

            const canonicalYtUrl = new URL(`https://www.youtube.com/watch?v=${videoId}`).toString();
            const youtubeChannelUrl = ytData.snippet.channelId ? new URL(`https://www.youtube.com/channel/${ytData.snippet.channelId}`).toString() : null;

            // ===== Run Recording Importer Logic and Playlist Logic in Parallel =====
            const recordingPromise = this._handleRecordingImport(ytData, canonicalYtUrl, youtubeChannelUrl, prefetchedMbResults);
            const playlistPromise = this._handlePlaylistLogic(ytData, canonicalYtUrl);

            await Promise.all([recordingPromise, playlistPromise]);
        },

        _handleRecordingImport: async function (ytData, canonicalYtUrl, youtubeChannelUrl, prefetchedMbResults) {
            RecordingButtonManager.resetState();
            let mbResults = prefetchedMbResults;

            try {
                const urlsToQuery = [canonicalYtUrl];
                if (youtubeChannelUrl) urlsToQuery.push(youtubeChannelUrl);

                if (!mbResults) {
                    mbResults = await this.lookupMbUrls(urlsToQuery);
                }

                const mbVideoUrlEntity = mbResults.get(canonicalYtUrl);
                const artistMbid = youtubeChannelUrl ? this._extractArtistMbid(mbResults.get(youtubeChannelUrl)) : null;

                if (mbVideoUrlEntity) {
                    const allRelevantRecordingRelations = (mbVideoUrlEntity.relations || []).filter(
                        rel => rel['type-id'] === Config.MUSICBRAINZ_FREE_STREAMING_RELATION_TYPE_ID &&
                            rel['target-type'] === "recording" &&
                            rel.recording && rel.recording.id
                    );

                    if (allRelevantRecordingRelations.length > 0) {
                        RecordingButtonManager.displayExistingButton(allRelevantRecordingRelations, mbVideoUrlEntity.id, ytData);
                    } else {
                        RecordingButtonManager.prepareAddButton(ytData, canonicalYtUrl, artistMbid, ytData.id);
                    }
                } else {
                    RecordingButtonManager.prepareAddButton(ytData, canonicalYtUrl, artistMbid, ytData.id);
                }
            } catch (error) {
                console.error(`[${GM.info.script.name}] Error in recording import logic:`, error);
                const apiName = error.apiName || 'API';
                const errorMessage = error.status === 503 ? L10n.getString('errorApiRateLimit', { apiName }) : L10n.getString('errorProcessing');
                RecordingButtonManager.displayError(errorMessage);
            }
        },

        _handlePlaylistLogic: async function (ytData, canonicalYtUrl) {
            PlaylistButtonManager.resetState();

            const { parsedTracks } = Utils.parseTracklist(ytData.snippet.description);
            if (parsedTracks.length === 0) {
                PlaylistButtonManager.hide();
                return;
            }

            if (!TokenManager.getTokenValue()) {
                // Pass a function that re-runs this logic after token is set
                PlaylistButtonManager.setStateTokenNeeded(() => this._handlePlaylistLogic(ytData, canonicalYtUrl));
                return;
            }

            try {
                const searchResults = await ListenBrainzAPI.searchPlaylists(ytData.id);
                const perfectMatches = (searchResults.playlists || []).filter(p => p.playlist.annotation && p.playlist.annotation.includes(canonicalYtUrl));

                if (perfectMatches.length === 1) {
                    const playlist = perfectMatches[0].playlist;
                    const playlistMbid = playlist.identifier.split('/').pop();
                    const isINCOMPLETE = playlist.title.startsWith('[INCOMPLETE]');

                    if (isINCOMPLETE) {
                        PlaylistButtonManager.setStateSync(playlist.title, playlistMbid, () => {
                            PlaylistLogic.syncPlaylist(ytData, canonicalYtUrl, playlistMbid);
                        });
                    } else {
                        PlaylistButtonManager.setStateExists(playlist.title, playlistMbid);
                    }
                } else if (perfectMatches.length > 1) {
                    // Handle multiple matches case if necessary, for now link to search
                    const searchUrl = `https://listenbrainz.org/search/?search_type=playlist&search_term=${encodeURIComponent(canonicalYtUrl)}`;
                    PlaylistButtonManager.setStateExists('On LB (Multi)', searchUrl);
                } else {
                    PlaylistButtonManager.setStateCreate(() => {
                        PlaylistLogic.createPlaylist(ytData, canonicalYtUrl);
                    });
                }
            } catch (error) {
                console.error(`[${GM.info.script.name}] Error in playlist logic:`, error);
                const apiName = error.apiName || 'API';
                const errorMessage = error.status === 503 ? L10n.getString('errorApiRateLimit', { apiName }) : L10n.getString('errorProcessing');
                PlaylistButtonManager.displayError(errorMessage);
            }
        },
    };


    /**
     * Helper function to set the checked state of a checkbox by simulating a click.
     * @param {HTMLInputElement} checkbox - The checkbox element.
     * @param {boolean} isChecked - The desired checked state.
     */
    function setCheckboxState(checkbox, isChecked) {
        if (!checkbox || checkbox.disabled) {
            return;
        }
        if (checkbox.checked !== isChecked) {
            checkbox.click();
        }
    }

    /**
     * Handles logic specific to the MusicBrainz recording creation page.
     */
    const MusicBrainzRecordingCreatePage = {
        _mainVideoCheckbox: null,
        _externalLinksEditor: null,
        _mutationObserver: null,
        _isInternalSync: false,

        init: async function () {
            try {
                this._externalLinksEditor = await Utils.waitForElement(Config.SELECTORS.MUSICBRAINZ_EXTERNAL_LINKS_EDITOR, 10000);
                this._mainVideoCheckbox = await Utils.waitForElement(Config.SELECTORS.MUSICBRAINZ_MAIN_VIDEO_CHECKBOX, 10000);

                console.log(`[${GM.info.script.name}] Initializing for MusicBrainz recording create page.`);
                this._setupListeners();
                this._setupMutationObserver();
                this._initialSync();
            } catch (error) {
                console.log(`[${GM.info.script.name}] Not on MusicBrainz recording create page or elements not found:`, error.message);
            }
        },

        /**
         * A wrapper function to prevent event loops during checkbox synchronization.
         * It ensures the sync flag is always reset, even if an error occurs.
         * @param {Function} action - The function to execute while the guard is active.
         */
        _withSyncGuard: function (action) {
            if (this._isInternalSync) return;

            this._isInternalSync = true;
            try {
                action();
            } finally {
                this._isInternalSync = false;
            }
        },

        /**
         * Gets all 'video' checkboxes associated with external links.
         * @returns {NodeListOf<HTMLInputElement>} A NodeList of the checkbox elements.
         */
        _getIndividualVideoCheckboxes: function () {
            return this._externalLinksEditor.querySelectorAll(Config.SELECTORS.MUSICBRAINZ_INDIVIDUAL_VIDEO_CHECKBOX);
        },

        /**
         * Synchronizes the state of the main video checkbox to all individual video checkboxes.
         * @param {boolean} isChecked - The desired checked state.
         */
        _syncMainToIndividual: function (isChecked) {
            this._getIndividualVideoCheckboxes().forEach(checkbox => {
                setCheckboxState(checkbox, isChecked);
            });
        },

        /**
         * Synchronizes the state of individual video checkboxes to the main video checkbox.
         */
        _syncIndividualToMain: function () {
            const anyIndividualChecked = Array.from(this._getIndividualVideoCheckboxes()).some(checkbox => checkbox.checked);
            setCheckboxState(this._mainVideoCheckbox, anyIndividualChecked);
        },

        /**
         * Sets up event listeners for the main and existing individual video checkboxes.
         */
        _setupListeners: function () {
            this._mainVideoCheckbox.addEventListener('change', () => {
                this._withSyncGuard(() => {
                    this._syncMainToIndividual(this._mainVideoCheckbox.checked);
                    console.log(`[${GM.info.script.name}] Main video checkbox toggled by user. Synced to individual checkboxes.`);
                });
            });

            this._getIndividualVideoCheckboxes().forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    this._withSyncGuard(() => {
                        this._syncIndividualToMain();
                        console.log(`[${GM.info.script.name}] Individual video checkbox toggled by user. Synced to main checkbox.`);
                    });
                });
            });
            console.log(`[${GM.info.script.name}] Initial listeners set up.`);
        },

        /**
         * Sets up a MutationObserver to detect dynamically added external link rows and attach listeners.
         */
        _setupMutationObserver: function () {
            this._mutationObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) {
                                const relationshipItems = node.matches('.relationship-item') ? [node] : node.querySelectorAll('.relationship-item');
                                relationshipItems.forEach(item => {
                                    const checkbox = item.querySelector(Config.SELECTORS.MUSICBRAINZ_INDIVIDUAL_VIDEO_CHECKBOX);
                                    if (checkbox && !checkbox.dataset.mbSyncListenerAdded) {
                                        checkbox.addEventListener('change', () => {
                                            this._withSyncGuard(() => {
                                                this._syncIndividualToMain();
                                                console.log(`[${GM.info.script.name}] New individual video checkbox toggled. Synced to main checkbox.`);
                                            });
                                        });
                                        checkbox.dataset.mbSyncListenerAdded = 'true';
                                        console.log(`[${GM.info.script.name}] Listener attached to new individual video checkbox.`);

                                        if (this._mainVideoCheckbox && this._mainVideoCheckbox.checked) {
                                            setCheckboxState(checkbox, true);
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            });

            this._mutationObserver.observe(this._externalLinksEditor, {
                childList: true,
                subtree: true
            });
            console.log(`[${GM.info.script.name}] MutationObserver set up for external links editor.`);
        },

        /**
         * Performs an initial synchronization of checkbox states when the script loads.
         */
        _initialSync: function () {
            this._withSyncGuard(() => {
                if (this._mainVideoCheckbox.checked) {
                    this._syncMainToIndividual(true);
                    console.log(`[${GM.info.script.name}] Main video checkbox was pre-checked by URL. Synced all individual checkboxes to true.`);
                } else {
                    this._syncIndividualToMain();
                    console.log(`[${GM.info.script.name}] Main video checkbox not pre-checked by URL. Synced main checkbox based on individual links.`);
                }
            });
            console.log(`[${GM.info.script.name}] Initial sync completed.`);
        }
    };


    if (window.location.href.includes('musicbrainz.org/recording/create')) {
        MusicBrainzRecordingCreatePage.init();
    } else if (window.location.hostname.includes('youtube.com')) {
        YouTubeMusicBrainzImporter.init();
    }

})();