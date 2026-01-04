// ==UserScript==
// @name         X Spaces +
// @namespace    Violentmonkey Scripts
// @version      2.09
// @description  Addon for X Spaces with custom emojis, enhanced transcript, speaker queuing, recording toggle, and robust auto-download of transcript and logs when space ends
// @author       x.com/blankspeaker and x.com/PrestonHenshawX
// @match        https://twitter.com/*
// @match        https://x.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530560/X%20Spaces%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/530560/X%20Spaces%20%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('Script loaded'); // Temporary: Remove after confirming load

    const OrigWebSocket = window.WebSocket;
    const OrigXMLHttpRequest = window.XMLHttpRequest;
    let myUserId = null;
    let myParticipantIndex = null;
    let myUsername = null;
    let captionsData = [];
    let emojiReactions = [];
    let currentSpaceId = null;
    let lastSpaceId = null;
    let handRaiseDurations = [];
    const activeHandRaises = new Map();
    const handQueue = new Map();
    let dynamicUrl = '';
    let previousOccupancy = null;
    let totalParticipants = 0;
    let capturedCookie = null;
    let hasDownloaded = false;
    let spaceInitialized = false;
    let lastSpaceState = false;
    let lastSpeaker = { username: '', handle: '' };
    let occupancyHistory = [];

    let selectedCustomEmoji = null;

    const customEmojis = [
        '😂', '😲', '😢', '✌️', '💯',
        '👏', '✊', '👍', '👎', '👋',
        '😍', '😃', '😠', '🤔', '😷',
        '🔥', '🎯', '✨', '🥇', '✋',
        '🙌', '🙏', '🎶', '🎙', '🙉',
        '🪐', '🎨', '🎮', '🏛️', '💸',
        '🌲', '🐞', '❤️', '🧡', '💛',
        '💚', '💙', '💜', '🖤', '🤎',
        '💄', '🏠', '💡', '💢', '💻',
        '🖥️', '📺', '🎚️', '🎛️', '📡',
        '🔋', '🗒️', '📰', '📌', '💠',
        '🍽️', '🎟️', '🧳', '⌚', '👟',
        '💼', '🤐'
    ];

    const originalEmojis = ['😂', '😲', '😢', '💜', '💯', '👏', '✊', '👍', '👎', '👋'];
    const emojiMap = new Map();
    customEmojis.forEach((emoji, index) => {
        const originalEmoji = originalEmojis[index % originalEmojis.length];
        emojiMap.set(emoji, originalEmoji);
    });

    // Rate-limiting for XMLHttpRequest and fetch
    const rateLimit = {
        tokens: 10,
        maxTokens: 10,
        refillRate: 1, // Tokens per second
        lastRefill: Date.now(),
        refill: function() {
            const now = Date.now();
            const elapsed = (now - this.lastRefill) / 1000;
            this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
            this.lastRefill = now;
        },
        acquire: function() {
            this.refill();
            if (this.tokens >= 1) {
                this.tokens -= 1;
                return true;
            }
            return false;
        }
    };

    async function fetchReplayUrl(dynUrl) {
        try {
            if (!dynUrl || !dynUrl.includes('/dynamic_playlist.m3u8?type=live')) {
                return 'Invalid Dynamic URL';
            }
            const masterUrl = dynUrl.replace('/dynamic_playlist.m3u8?type=live', '/master_playlist.m3u8');
            if (!rateLimit.acquire()) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            const response = await fetch(masterUrl);
            const text = await response.text();
            const playlistMatch = text.match(/playlist_\d+\.m3u8/);
            if (playlistMatch) {
                return dynUrl.replace('dynamic_playlist.m3u8', playlistMatch[0]).replace('type=live', 'type=replay');
            }
            return 'No playlist found';
        } catch (error) {
            const converterUrl = `data:text/html;charset=utf-8,${encodeURIComponent(`
                <!DOCTYPE html>
                <html>
                <body>
                    <textarea id="input" rows="4" cols="50">${dynUrl}</textarea><br>
                    <button onclick="convert()">Generate Replay URL</button><br>
                    <textarea id="result" rows="4" cols="50" readonly></textarea><br>
                    <button onclick="navigator.clipboard.writeText(document.getElementById('result').value)">Copy</button>
                    <script>
                        async function convert() {
                            const corsProxy = "https://cors.viddastrage.workers.dev/corsproxy/?apiurl=";
                            const dynUrl = document.getElementById('input').value;
                            const masterUrl = dynUrl.replace('/dynamic_playlist.m3u8?type=live', '/master_playlist.m3u8');
                            try {
                                const response = await fetch(corsProxy + masterUrl);
                                const text = await response.text();
                                const playlistMatch = text.match(/playlist_\\d+\\.m3u8/);
                                if (playlistMatch) {
                                    const replayUrl = dynUrl.replace('dynamic_playlist.m3u8', playlistMatch[0]).replace('type=live', 'type=replay');
                                    document.getElementById('result').value = replayUrl;
                                } else {
                                    document.getElementById('result').value = 'No playlist found';
                                }
                            } catch (e) {
                                document.getElementById('result').value = 'Error: ' + e.message;
                            }
                        }
                    </script>
                </body>
                </html>
            `)}`;
            return converterUrl;
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    function getSpaceIdFromUrl() {
        const urlMatch = window.location.pathname.match(/\/i\/spaces\/([^/]+)/);
        return urlMatch ? urlMatch[1] : null;
    }

    window.WebSocket = function (url, protocols) {
        const ws = new OrigWebSocket(url, protocols);
        const originalSend = ws.send;

        ws.send = function (data) {
            if (typeof data === 'string') {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.payload && typeof parsed.payload === 'string') {
                        const payloadParsed = JSON.parse(parsed.payload);
                        if (payloadParsed.body) {
                            const bodyParsed = JSON.parse(payloadParsed.body);
                            if (parsed.sender && parsed.sender.user_id) {
                                myUserId = myUserId || parsed.sender.user_id;
                                myParticipantIndex = myParticipantIndex || payloadParsed.participant_index;
                                myUsername = myUsername || payloadParsed.sender?.username || bodyParsed.username || 'You';
                            }
                            if (bodyParsed.type === 2 && selectedCustomEmoji) {
                                bodyParsed.body = selectedCustomEmoji;
                                payloadParsed.body = JSON.stringify(bodyParsed);
                                parsed.payload = JSON.stringify(payloadParsed);
                                data = JSON.stringify(parsed);
                                const captureEmojis = localStorage.getItem(STORAGE_KEYS.SHOW_EMOJIS) !== 'false';
                                if (captureEmojis) {
                                    const emojiReaction = {
                                        displayName: myUsername || 'You',
                                        handle: `@${myUsername || 'You'}`,
                                        emoji: selectedCustomEmoji,
                                        timestamp: Date.now(),
                                        uniqueId: `${Date.now()}-${myUsername || 'You'}-${selectedCustomEmoji}-${Date.now()}`
                                    };
                                    emojiReactions.push(emojiReaction);
                                    if (transcriptPopup && transcriptPopup.style.display === 'block') {
                                        debouncedUpdateTranscriptPopup();
                                    }
                                }
                            }
                        }
                    }
                } catch (e) {}
            }
            return originalSend.call(this, data);
        };

        let originalOnMessage = null;
        ws.onmessage = function (event) {
            if (originalOnMessage) originalOnMessage.call(this, event);
            try {
                const message = JSON.parse(event.data);
                let payload;

                if (message.kind === 1 && message.payload) {
                    payload = JSON.parse(message.payload);
                    const body = payload.body ? JSON.parse(payload.body) : null;

                    if (body) {
                        const participantIndex = body.guestParticipantIndex || payload.sender?.participant_index || 'unknown';
                        let displayName = payload.sender?.display_name || body.displayName || 'Unknown';
                        let handle = payload.sender?.username || body.username || 'Unknown';
                        const timestamp = message.timestamp / 1e6 || Date.now();

                        const logSystemMessages = localStorage.getItem(STORAGE_KEYS.SHOW_SYSTEM_MESSAGES) !== 'false';

                        if (body.type === 40 && body.guestBroadcastingEvent) {
                            let eventText = '';
                            switch (body.guestBroadcastingEvent) {
                                case 4:
                                    eventText = `${displayName} (${handle}) dropped the mic`;
                                    break;
                                case 5:
                                    eventText = `${displayName} (${handle}) invited you to grab a mic`;
                                    break;
                                case 9:
                                    eventText = `${displayName} (${handle}) grabbed a mic`;
                                    break;
                                case 10:
                                    eventText = `${displayName} (${handle}) had their mic removed by host`;
                                    break;
                                case 16:
                                    eventText = `${displayName} (${handle}) muted`;
                                    break;
                                case 17:
                                    eventText = `${displayName} (${handle}) unmuted`;
                                    break;
                                case 18:
                                    eventText = `${displayName} (${handle}) muted all participants`;
                                    break;
                                case 19:
                                    eventText = `${displayName} (${handle}) unmuted all participants`;
                                    break;
                                case 20:
                                    eventText = `${displayName} (${handle}) invited a new cohost`;
                                    break;
                                case 21:
                                    eventText = `${displayName} (${handle}) removed a cohost`;
                                    break;
                                case 22:
                                    eventText = `${displayName} (${handle}) became a cohost`;
                                    break;
                                case 23:
                                    eventText = `${displayName} (${handle}) raised their hand`;
                                    handQueue.set(participantIndex, { displayName, timestamp });
                                    activeHandRaises.set(participantIndex, timestamp);
                                    updateQueueButtonVisibility();
                                    break;
                                case 24:
                                    eventText = `${displayName} (${handle}) lowered their hand`;
                                    const startTime = activeHandRaises.get(participantIndex);
                                    if (startTime) {
                                        const duration = (timestamp - startTime) / 1000;
                                        const sortedQueue = Array.from(handQueue.entries())
                                            .sort(([, a], [, b]) => a.timestamp - b.timestamp);
                                        if (sortedQueue.length > 0 && sortedQueue[0][0] === participantIndex && duration >= 60) {
                                            handRaiseDurations.push(duration);
                                            if (handRaiseDurations.length > 50) handRaiseDurations.shift();
                                        }
                                        handQueue.delete(participantIndex);
                                        activeHandRaises.delete(participantIndex);
                                        updateQueueButtonVisibility();
                                    }
                                    break;
                                default:
                                    eventText = `${displayName} (${handle}) triggered event ${body.guestBroadcastingEvent}`;
                            }
                            if (eventText && logSystemMessages && body.guestBroadcastingEvent !== 23 && body.guestBroadcastingEvent !== 24) {
                                const systemEvent = {
                                    displayName: 'System',
                                    handle: '',
                                    text: eventText,
                                    timestamp,
                                    uniqueId: `${timestamp}-event-${body.guestBroadcastingEvent}-${handle}`
                                };
                                captionsData.push(systemEvent);
                                if (transcriptPopup && transcriptPopup.style.display === 'block') {
                                    updateTranscriptPopup();
                                }
                            }
                        }

                        if (body.type === 45 && body.body) {
                            const caption = {
                                displayName,
                                handle: `@${handle}`,
                                text: body.body,
                                timestamp,
                                uniqueId: `${timestamp}-${displayName}-${handle}-${body.body}`
                            };
                            const isDuplicate = captionsData.some(c => c.uniqueId === caption.uniqueId);
                            const lastCaption = captionsData[captionsData.length - 1];
                            const isDifferentText = !lastCaption || lastCaption.text !== caption.text;
                            if (!isDuplicate && isDifferentText) {
                                if (activeHandRaises.has(participantIndex) && logSystemMessages) {
                                    const startTime = activeHandRaises.get(participantIndex);
                                    const duration = (timestamp - startTime) / 1000;
                                    const sortedQueue = Array.from(handQueue.entries())
                                        .sort(([, a], [, b]) => a.timestamp - b.timestamp);
                                    if (sortedQueue.length > 0 && sortedQueue[0][0] === participantIndex && duration >= 60) {
                                        handRaiseDurations.push(duration);
                                        if (handRaiseDurations.length > 50) handRaiseDurations.shift();
                                    }
                                    const handLowerEvent = {
                                        displayName: 'System',
                                        handle: '',
                                        text: `${displayName} (${handle}) lowered their hand (started speaking)`,
                                        timestamp,
                                        uniqueId: `${timestamp}-handlower-speaking-${participantIndex}`
                                    };
                                    captionsData.push(handLowerEvent);
                                    handQueue.delete(participantIndex);
                                    activeHandRaises.delete(participantIndex);
                                    updateQueueButtonVisibility();
                                }
                                captionsData.push(caption);
                                if (transcriptPopup && transcriptPopup.style.display === 'block') {
                                    updateTranscriptPopup();
                                }
                            }
                        }

                        if (body.type === 2 && body.body) {
                            const captureEmojis = localStorage.getItem(STORAGE_KEYS.SHOW_EMOJIS) !== 'false';
                            if (captureEmojis) {
                                const emojiReaction = {
                                    displayName,
                                    handle: `@${handle}`,
                                    emoji: body.body,
                                    timestamp,
                                    uniqueId: `${timestamp}-${displayName}-${body.body}-${Date.now()}`
                                };
                                const isDuplicate = emojiReactions.some(e =>
                                    e.uniqueId === emojiReaction.uniqueId ||
                                    (e.displayName === emojiReaction.displayName &&
                                     e.emoji === emojiReaction.emoji &&
                                     Math.abs(e.timestamp - emojiReaction.timestamp) < 50)
                                );
                                if (!isDuplicate) {
                                    emojiReactions.push(emojiReaction);
                                    if (transcriptPopup && transcriptPopup.style.display === 'block') {
                                        debouncedUpdateTranscriptPopup();
                                    }
                                }
                            }
                        }
                    }
                }

                if (message.kind === 2 && message.payload) {
                    payload = JSON.parse(message.payload);
                    const body = payload.body ? JSON.parse(payload.body) : null;

                    if (body && body.occupancy !== undefined && body.total_participants !== undefined) {
                        const currentOccupancy = body.occupancy;
                        totalParticipants = body.total_participants;
                        const timestamp = Date.now();
                        const logSystemMessages = localStorage.getItem(STORAGE_KEYS.SHOW_SYSTEM_MESSAGES) !== 'false';

                        occupancyHistory.push({
                            timestamp,
                            occupancy: currentOccupancy,
                            total: totalParticipants,
                            emojiCount: emojiReactions.length
                        });

                        if (previousOccupancy === null) {
                            if (logSystemMessages) {
                                const eventText = `Initial occupancy - Current ${currentOccupancy} - Total ${totalParticipants}`;
                                const occupancyEvent = {
                                    displayName: 'System',
                                    handle: '',
                                    text: eventText,
                                    timestamp,
                                    uniqueId: `${timestamp}-initial-occupancy`
                                };
                                captionsData.push(occupancyEvent);
                                if (transcriptPopup && transcriptPopup.style.display === 'block') {
                                    updateTranscriptPopup();
                                }
                            }
                        } else if (logSystemMessages) {
                            let eventText;
                            if (currentOccupancy > previousOccupancy) {
                                eventText = `A new user joined - Current ${currentOccupancy} - Total ${totalParticipants}`;
                            } else if (currentOccupancy < previousOccupancy) {
                                eventText = `A user left - Current ${currentOccupancy} - Total ${totalParticipants}`;
                            }
                            if (eventText) {
                                const occupancyEvent = {
                                    displayName: 'System',
                                    handle: '',
                                    text: eventText,
                                    timestamp,
                                    uniqueId: `${timestamp}-occupancy-${currentOccupancy}`
                                };
                                captionsData.push(occupancyEvent);
                                if (transcriptPopup && transcriptPopup.style.display === 'block') {
                                    updateTranscriptPopup();
                                }
                            }
                        }
                        previousOccupancy = currentOccupancy;
                    }
                }

                if (payload) {
                    if (payload.room_id) {
                        currentSpaceId = payload.room_id;
                    }

                    const payloadString = JSON.stringify(payload);
                    if (payloadString.includes('dynamic_playlist.m3u8?type=live')) {
                        const urlMatch = payloadString.match(/https:\/\/prod-fastly-[^/]+?\.video\.pscp\.tv\/[^"]+?dynamic_playlist\.m3u8\?type=live/);
                        if (urlMatch) dynamicUrl = urlMatch[0];
                    }

                    const urlSpaceId = getSpaceIdFromUrl();
                    if (urlSpaceId && payload.room_id !== urlSpaceId) return;
                }
            } catch (e) {}
        };

        Object.defineProperty(ws, 'onmessage', {
            set: function (callback) {
                originalOnMessage = callback;
            },
            get: function () {
                return ws.onmessage;
            }
        });

        return ws;
    };

    window.XMLHttpRequest = function () {
        const xhr = new OrigXMLHttpRequest();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;

        xhr.open = function (method, url, async, user, password) {
            if (typeof url === 'string' && url.includes('dynamic_playlist.m3u8?type=live')) {
                dynamicUrl = url;
            }
            xhr._method = method;
            xhr._url = url;
            return originalOpen.apply(this, arguments);
        };

        xhr.send = function (data) {
            if (xhr._method === 'POST') {
                try {
                    let payload = null;
                    if (data && typeof data === 'string') {
                        if (data.startsWith('debug=') || data.startsWith('sub_topics') || data.startsWith('category=')) {
                            payload = data;
                        } else {
                            payload = JSON.parse(data);
                        }
                    }

                    if (payload) {
                        const cookieEndpoints = [
                            'https://proxsee.pscp.tv/api/v2/createBroadcast',
                            'https://proxsee.pscp.tv/api/v2/accessChat',
                            'https://proxsee.pscp.tv/api/v2/startWatching',
                            'https://proxsee.pscp.tv/api/v2/turnServers',
                            'https://proxsee.pscp.tv/api/v2/pingWatching',
                            'https://guest.pscp.tv/api/v1/audiospace/join'
                        ];

                        if (cookieEndpoints.some(endpoint => xhr._url.startsWith(endpoint)) && payload.cookie) {
                            capturedCookie = payload.cookie;
                        }

                        if (payload.broadcast_id &&
                            (xhr._url.includes('https://proxsee.pscp.tv/api/v2/') ||
                             xhr._url.includes('https://guest.pscp.tv/api/v1/audiospace/'))) {
                            currentSpaceId = payload.broadcast_id;
                        }
                    }
                } catch (e) {}
            }
            if (rateLimit.acquire()) {
                return originalSend.apply(this, arguments);
            } else {
                setTimeout(() => originalSend.apply(this, arguments), 1000);
            }
        };

        return xhr;
    };

    const OriginalFetch = window.fetch;
    window.fetch = function (resource, init = {}) {
        const url = typeof resource === 'string' ? resource : resource.url;
        const method = init.method || 'GET';

        if (method === 'POST' && init.body) {
            try {
                let payload = null;
                if (typeof init.body === 'string') {
                    if (init.body.startsWith('debug=') || init.body.startsWith('sub_topics') || init.body.startsWith('category=')) {
                        payload = init.body;
                    } else {
                        payload = JSON.parse(init.body);
                    }
                }

                if (payload) {
                    const cookieEndpoints = [
                        'https://proxsee.pscp.tv/api/v2/createBroadcast',
                        'https://proxsee.pscp.tv/api/v2/accessChat',
                        'https://proxsee.pscp.tv/api/v2/startWatching',
                        'https://proxsee.pscp.tv/api/v2/turnServers',
                        'https://proxsee.pscp.tv/api/v2/pingWatching',
                        'https://guest.pscp.tv/api/v1/audiospace/join'
                    ];

                    if (cookieEndpoints.some(endpoint => url.startsWith(endpoint)) && payload.cookie) {
                        capturedCookie = payload.cookie;
                    }

                    if (payload.broadcast_id &&
                        (url.includes('https://proxsee.pscp.tv/api/v2/') ||
                         url.includes('https://guest.pscp.tv/api/v1/audiospace/'))) {
                        currentSpaceId = payload.broadcast_id;
                    }
                }
            } catch (e) {}
        }
        if (rateLimit.acquire()) {
            return OriginalFetch.apply(this, arguments);
        } else {
            return new Promise(resolve => setTimeout(() => resolve(OriginalFetch.apply(this, arguments)), 1000));
        }
    };

    let transcriptPopup = null;
    let transcriptButton = null;
    let queueButton = null;
    let handQueuePopup = null;
    let queueRefreshInterval = null;

    const STORAGE_KEYS = {
        LAST_SPACE_ID: 'xSpacesCustomReactions_lastSpaceId',
        HAND_DURATIONS: 'xSpacesCustomReactions_handRaiseDurations',
        SHOW_EMOJIS: 'xSpacesCustomReactions_showEmojis',
        SHOW_SYSTEM_MESSAGES: 'xSpacesCustomReactions_showSystemMessages',
        REPLAY_ENABLED: 'xSpacesCustomReactions_replayEnabled'
    };

    const debouncedUpdateTranscriptPopup = debounce(updateTranscriptPopup, 2000);

    function saveSettings() {
        localStorage.setItem(STORAGE_KEYS.LAST_SPACE_ID, currentSpaceId || '');
        localStorage.setItem(STORAGE_KEYS.HAND_DURATIONS, JSON.stringify(handRaiseDurations));
    }

    function loadSettings() {
        lastSpaceId = localStorage.getItem(STORAGE_KEYS.LAST_SPACE_ID) || null;
        const savedDurations = localStorage.getItem(STORAGE_KEYS.HAND_DURATIONS);
        if (savedDurations) handRaiseDurations = JSON.parse(savedDurations);
        if (localStorage.getItem(STORAGE_KEYS.SHOW_EMOJIS) === null) {
            localStorage.setItem(STORAGE_KEYS.SHOW_EMOJIS, 'false');
        }
        if (localStorage.getItem(STORAGE_KEYS.SHOW_SYSTEM_MESSAGES) === null) {
            localStorage.setItem(STORAGE_KEYS.SHOW_SYSTEM_MESSAGES, 'false');
        }
    }

    function hideOriginalEmojiButtons() {
        const originalButtons = document.querySelectorAll('div[class*="r-1awozwy"][class*="r-18u37iz"][class*="r-9aw3ui"] > div > button');
        originalButtons.forEach(button => button.style.display = 'none');
    }

    function createEmojiPickerGrid() {
        const emojiPicker = document.querySelector('div[class*="r-1awozwy"][class*="r-18u37iz"][class*="r-9aw3ui"]');
        if (!emojiPicker || emojiPicker.querySelector('.emoji-grid-container')) return;

        hideOriginalEmojiButtons();

        const gridContainer = document.createElement('div');
        gridContainer.className = 'emoji-grid-container';
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = 'repeat(5, 1fr)';
        gridContainer.style.gap = '10px';
        gridContainer.style.padding = '10px';

        const fragment = document.createDocumentFragment();

        customEmojis.forEach(emoji => {
            const emojiButton = document.createElement('button');
            emojiButton.setAttribute('aria-label', `React with ${emoji}`);
            emojiButton.setAttribute('role', 'button');
            emojiButton.className = 'css-175oi2r r-1awozwy r-z2wwpe r-6koalj r-18u37iz r-1w6e6rj r-a2tzq0 r-tuq35u r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l';
            emojiButton.type = 'button';
            emojiButton.style.margin = '5px';

            const emojiDiv = document.createElement('div');
            emojiDiv.dir = 'ltr';
            emojiDiv.className = 'css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-1blvdjr r-vrz42v r-16dba41';
            emojiDiv.style.color = 'rgb(231, 233, 234)';

            const emojiImg = document.createElement('img');
            emojiImg.alt = emoji;
            emojiImg.draggable = 'false';
            emojiImg.src = `https://abs-0.twimg.com/emoji/v2/svg/${emoji.codePointAt(0).toString(16)}.svg`;
            emojiImg.title = emoji;
            emojiImg.className = 'r-4qtqp9 r-dflpy8 r-k4bwe5 r-1kpi4qh r-pp5qcn r-h9hxbl';

            emojiDiv.appendChild(emojiImg);
            emojiButton.appendChild(emojiDiv);

            emojiButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                selectedCustomEmoji = emoji;

                const originalEmoji = emojiMap.get(emoji);
                if (originalEmoji) {
                    const originalButton = Array.from(document.querySelectorAll('button[aria-label^="React with"]'))
                        .find(button => button.querySelector('img')?.alt === originalEmoji);
                    if (originalButton) originalButton.click();
                }
            });

            fragment.appendChild(emojiButton);
        });

        const linksDiv = document.createElement('div');
        linksDiv.style.gridColumn = '1 / -1';
        linksDiv.style.textAlign = 'center';
        linksDiv.style.fontSize = '12px';
        linksDiv.style.color = 'rgba(231, 233, 234, 0.8)';
        linksDiv.style.marginTop = '10px';
        linksDiv.style.display = 'flex';
        linksDiv.style.justifyContent = 'center';
        linksDiv.style.gap = '15px';

        const aboutLink = document.createElement('a');
        aboutLink.href = 'https://greasyfork.org/en/scripts/530560-x-spaces';
        aboutLink.textContent = 'About';
        aboutLink.style.color = 'inherit';
        aboutLink.style.textDecoration = 'none';
        aboutLink.target = '_blank';
        linksDiv.appendChild(aboutLink);

        const dynamicLink = document.createElement('a');
        dynamicLink.href = '#';
        dynamicLink.textContent = dynamicUrl ? 'Dynamic (Click to Copy)' : 'Dynamic (N/A)';
        dynamicLink.style.color = 'inherit';
        dynamicLink.style.textDecoration = 'none';
        dynamicLink.style.cursor = 'pointer';
        dynamicLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (dynamicUrl) {
                navigator.clipboard.writeText(dynamicUrl).then(() => {
                    dynamicLink.textContent = 'Dynamic (Copied!)';
                    setTimeout(() => dynamicLink.textContent = 'Dynamic (Click to Copy)', 2000);
                }).catch(() => {
                    dynamicLink.textContent = 'Dynamic (Copy Failed)';
                    setTimeout(() => dynamicLink.textContent = 'Dynamic (Click to Copy)', 2000);
                });
            }
        });
        linksDiv.appendChild(dynamicLink);

        const replayLink = document.createElement('a');
        replayLink.href = '#';
        replayLink.textContent = 'Replay (Click to Copy)';
        replayLink.style.color = 'inherit';
        replayLink.style.textDecoration = 'none';
        replayLink.style.cursor = 'pointer';
        replayLink.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!dynamicUrl) {
                replayLink.textContent = 'Replay (No Dynamic URL)';
                setTimeout(() => replayLink.textContent = 'Replay (Click to Copy)', 2000);
                return;
            }
            replayLink.textContent = 'Generating...';
            const newReplayUrl = await fetchReplayUrl(dynamicUrl);
            if (newReplayUrl.startsWith('http')) {
                navigator.clipboard.writeText(newReplayUrl).then(() => {
                    replayLink.textContent = 'Replay (Copied!)';
                    setTimeout(() => replayLink.textContent = 'Replay (Click to Copy)', 2000);
                }).catch(() => {
                    replayLink.textContent = 'Replay (Copy Failed)';
                    setTimeout(() => replayLink.textContent = 'Replay (Click to Copy)', 2000);
                });
            } else if (newReplayUrl.startsWith('data:text/html')) {
                replayLink.textContent = 'Replay (Open Converter)';
                replayLink.href = newReplayUrl;
                replayLink.target = '_blank';
                setTimeout(() => {
                    replayLink.textContent = 'Replay (Click to Copy)';
                    replayLink.href = '#';
                    replayLink.target = '';
                }, 5000);
            } else {
                replayLink.textContent = `Replay (${newReplayUrl})`;
                setTimeout(() => replayLink.textContent = 'Replay (Click to Copy)', 2000);
            }
        });
        linksDiv.appendChild(replayLink);

        const updateDynamicLink = () => {
            dynamicLink.textContent = dynamicUrl ? 'Dynamic (Click to Copy)' : 'Dynamic (N/A)';
        };
        setInterval(updateDynamicLink, 1000);

        fragment.appendChild(linksDiv);
        gridContainer.appendChild(fragment);
        emojiPicker.appendChild(gridContainer);
    }

    function detectEndedUI() {
        try {
            const endedContainer = document.querySelector('div[data-testid="sheetDialog"] div[class*="r-18u37iz"][class*="r-13qz1uu"]');
            if (endedContainer) {
                const hasEndedText = Array.from(endedContainer.querySelectorAll('span')).some(span => span.textContent.toLowerCase().includes('ended'));
                const hasCloseButton = endedContainer.querySelector('button[aria-label="Close"]');
                const hasShareButton = endedContainer.querySelector('button[aria-label="Share"]');
                if (hasEndedText && hasCloseButton && hasShareButton) {
                    currentSpaceId = null;
                    triggerAutoDownload();
                    return endedContainer;
                }
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    async function triggerAutoDownload() {
        try {
            if (hasDownloaded || (captionsData.length === 0 && emojiReactions.length === 0)) {
                return;
            }

            hasDownloaded = true;
            const transcripts = await formatTranscriptForDownload();

            if (transcripts.transcription.content) {
                const transcriptionBlob = new Blob([transcripts.transcription.content], { type: 'text/plain' });
                const transcriptionUrl = URL.createObjectURL(transcriptionBlob);
                const transcriptionLink = document.createElement('a');
                transcriptionLink.href = transcriptionUrl;
                transcriptionLink.download = transcripts.transcription.filename;
                document.body.appendChild(transcriptionLink);
                transcriptionLink.click();
                document.body.removeChild(transcriptionLink);
                URL.revokeObjectURL(transcriptionUrl);
            }

            const showEmojisInUI = localStorage.getItem(STORAGE_KEYS.SHOW_EMOJIS) !== 'false';
            const showSystemMessagesInUI = localStorage.getItem(STORAGE_KEYS.SHOW_SYSTEM_MESSAGES) !== 'false';

            if ((showEmojisInUI || showSystemMessagesInUI) && transcripts.system.content) {
                await new Promise(resolve => setTimeout(resolve, 5000));
                const systemBlob = new Blob([transcripts.system.content], { type: 'text/plain' });
                const systemUrl = URL.createObjectURL(systemBlob);
                const systemLink = document.createElement('a');
                systemLink.href = systemUrl;
                systemLink.download = transcripts.system.filename;
                document.body.appendChild(systemLink);
                systemLink.click();
                document.body.removeChild(systemLink);
                URL.revokeObjectURL(systemUrl);
            }
        } catch (e) {}
    }

    function addDownloadOptionToShareDropdown(dropdown) {
        try {
            if (dropdown.querySelector('#download-transcript-share') && dropdown.querySelector('#copy-replay-url-share')) return;

            const menuItems = dropdown.querySelectorAll('div[role="menuitem"]');
            const itemCount = Array.from(menuItems).filter(item => item.id !== 'download-transcript-share' && item.id !== 'copy-replay-url-share').length;
            if (itemCount !== 4) return;

            const downloadItem = document.createElement('div');
            downloadItem.id = 'download-transcript-share';
            downloadItem.setAttribute('role', 'menuitem');
            downloadItem.setAttribute('tabindex', '0');
            downloadItem.className = 'css-175oi2r r-1loqt21 r-18u37iz r-1mmae3n r-3pj75a r-13qz1uu r-o7ynqc r-6416eg r-1ny4l3l';
            downloadItem.style.transition = 'background-color 0.2s ease';

            const downloadIconContainer = document.createElement('div');
            downloadIconContainer.className = 'css-175oi2r r-1777fci r-faml9v';

            const downloadIcon = document.createElement('svg');
            downloadIcon.viewBox = '0 0 24 24';
            downloadIcon.setAttribute('aria-hidden', 'true');
            downloadIcon.className = 'r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-1q142lx';
            downloadIcon.innerHTML = '<g><path d="M19 3H5c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm-2 16H7v-6h10v6zm2-8H5V5h14v6z"/></g>';
            downloadIconContainer.appendChild(downloadIcon);

            const downloadTextContainer = document.createElement('div');
            downloadTextContainer.className = 'css-175oi2r r-16y2uox r-1wbh5a2';

            const downloadText = document.createElement('div');
            downloadText.dir = 'ltr';
            downloadText.className = 'css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-b88u0q';
            downloadText.style.color = 'rgb(231, 233, 234)';
            downloadText.innerHTML = '<span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">Download Transcript</span>';
            downloadTextContainer.appendChild(downloadText);

            downloadItem.appendChild(downloadIconContainer);
            downloadItem.appendChild(downloadTextContainer);

            const downloadStyle = document.createElement('style');
            downloadStyle.textContent = '#download-transcript-share:hover { background-color: rgba(231, 233, 234, 0.1); }';
            downloadItem.appendChild(downloadStyle);

            downloadItem.addEventListener('click', async (e) => {
                e.preventDefault();
                const transcripts = await formatTranscriptForDownload();

                if (transcripts.transcription.content) {
                    const transcriptionBlob = new Blob([transcripts.transcription.content], { type: 'text/plain' });
                    const transcriptionUrl = URL.createObjectURL(transcriptionBlob);
                    const transcriptionLink = document.createElement('a');
                    transcriptionLink.href = transcriptionUrl;
                    transcriptionLink.download = transcripts.transcription.filename;
                    document.body.appendChild(transcriptionLink);
                    transcriptionLink.click();
                    document.body.removeChild(transcriptionLink);
                    URL.revokeObjectURL(transcriptionUrl);
                }

                const showEmojisInUI = localStorage.getItem(STORAGE_KEYS.SHOW_EMOJIS) !== 'false';
                const showSystemMessagesInUI = localStorage.getItem(STORAGE_KEYS.SHOW_SYSTEM_MESSAGES) !== 'false';

                if (showEmojisInUI || showSystemMessagesInUI) {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    if (transcripts.system.content) {
                        const systemBlob = new Blob([transcripts.system.content], { type: 'text/plain' });
                        const systemUrl = URL.createObjectURL(systemBlob);
                        const systemLink = document.createElement('a');
                        systemLink.href = systemUrl;
                        systemLink.download = transcripts.system.filename;
                        document.body.appendChild(systemLink);
                        systemLink.click();
                        document.body.removeChild(systemLink);
                        URL.revokeObjectURL(systemUrl);
                    }
                }

                dropdown.style.display = 'none';
            });

            const replayItem = document.createElement('div');
            replayItem.id = 'copy-replay-url-share';
            replayItem.setAttribute('role', 'menuitem');
            replayItem.setAttribute('tabindex', '0');
            replayItem.className = 'css-175oi2r r-1loqt21 r-18u37iz r-1mmae3n r-3pj75a r-13qz1uu r-o7ynqc r-6416eg r-1ny4l3l';
            replayItem.style.transition = 'background-color 0.2s ease';

            const replayIconContainer = document.createElement('div');
            replayIconContainer.className = 'css-175oi2r r-1777fci r-faml9v';

            const replayIcon = document.createElement('svg');
            replayIcon.viewBox = '0 0 24 24';
            replayIcon.setAttribute('aria-hidden', 'true');
            replayIcon.className = 'r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-1q142lx';
            replayIcon.innerHTML = '<g><path d="M12 3.75c-4.55 0-8.25 3.69-8.25 8.25 0 1.92.66 3.68 1.75 5.08L4.3 19.2l2.16-1.19c1.4 1.09 3.16 1.74 5.04 1.74 4.56 0 8.25-3.69 8.25-8.25S16.56 3.75 12 3.75zm1 11.24h-2v-2h2v2zm0-3.5h-2v-4h2v4z"/></g>';
            replayIconContainer.appendChild(replayIcon);

            const replayTextContainer = document.createElement('div');
            replayTextContainer.className = 'css-175oi2r r-16y2uox r-1wbh5a2';

            const replayText = document.createElement('div');
            replayText.dir = 'ltr';
            replayText.className = 'css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-b88u0q';
            replayText.style.color = 'rgb(231, 233, 234)';
            replayText.innerHTML = '<span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">Copy Replay URL</span>';
            replayTextContainer.appendChild(replayText);

            replayItem.appendChild(replayIconContainer);
            replayItem.appendChild(replayTextContainer);

            const replayStyle = document.createElement('style');
            replayStyle.textContent = '#copy-replay-url-share:hover { background-color: rgba(231, 233, 234, 0.1); }';
            replayItem.appendChild(replayStyle);

            replayItem.addEventListener('click', async (e) => {
                e.preventDefault();
                if (!dynamicUrl) {
                    replayText.innerHTML = '<span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">No Dynamic URL</span>';
                    setTimeout(() => replayText.innerHTML = '<span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">Copy Replay URL</span>', 2000);
                    dropdown.style.display = 'none';
                    return;
                }
                replayText.innerHTML = '<span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">Generating...</span>';
                const newReplayUrl = await fetchReplayUrl(dynamicUrl);
                if (newReplayUrl.startsWith('http')) {
                    navigator.clipboard.writeText(newReplayUrl).then(() => {
                        replayText.innerHTML = '<span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">Copied!</span>';
                        setTimeout(() => replayText.innerHTML = '<span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">Copy Replay URL</span>', 2000);
                    }).catch(() => {
                        replayText.innerHTML = '<span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">Copy Failed</span>';
                        setTimeout(() => replayText.innerHTML = '<span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">Copy Replay URL</span>', 2000);
                    });
                } else if (newReplayUrl.startsWith('data:text/html')) {
                    replayText.innerHTML = '<span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">Open Converter</span>';
                    window.open(newReplayUrl, '_blank');
                    setTimeout(() => replayText.innerHTML = '<span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">Copy Replay URL</span>', 5000);
                } else {
                    replayText.innerHTML = `<span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">${newReplayUrl}</span>`;
                    setTimeout(() => replayText.innerHTML = '<span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">Copy Replay URL</span>', 2000);
                }
                dropdown.style.display = 'none';
            });

            const shareViaItem = dropdown.querySelector('div[data-testid="share-by-tweet"]');
            if (shareViaItem) {
                dropdown.insertBefore(downloadItem, shareViaItem.nextSibling);
                dropdown.insertBefore(replayItem, downloadItem.nextSibling);
            } else {
                dropdown.appendChild(downloadItem);
                dropdown.appendChild(replayItem);
            }
        } catch (e) {}
    }

    function updateVisibilityAndPosition() {
        try {
            const reactionToggle = document.querySelector('button svg path[d*="M17 12v3h-2.998v2h3v3h2v-3h3v-2h-3.001v-3H17"]');
            const peopleButton = document.querySelector('button svg path[d*="M6.662 18H.846l.075-1.069"]');
            const isInSpace = reactionToggle !== null || peopleButton !== null;
            const endedScreen = document.querySelector('div[data-testid="sheetDialog"] span[class*="r-bcqeeo"][class*="r-1ttztb7"]')?.textContent.includes('Ended') || false;

            if (isInSpace && !lastSpaceState) {
                spaceInitialized = true;
                const urlSpaceId = getSpaceIdFromUrl();
                if (urlSpaceId && !currentSpaceId) {
                    currentSpaceId = urlSpaceId;
                    if (currentSpaceId !== lastSpaceId) {
                        handQueue.clear();
                        activeHandRaises.clear();
                        captionsData = [];
                        emojiReactions = [];
                        occupancyHistory = [];
                        lastSpeaker = { username: '', handle: '' };
                        previousOccupancy = null;
                        totalParticipants = 0;
                        hasDownloaded = false;
                        if (transcriptPopup) {
                            const captionWrapper = transcriptPopup.querySelector('#transcript-output');
                            if (captionWrapper) captionWrapper.innerHTML = '';
                        }
                    } else {
                        handQueue.clear();
                        activeHandRaises.clear();
                        if (transcriptPopup && transcriptPopup.style.display === 'block') updateTranscriptPopup();
                    }
                    lastSpaceId = currentSpaceId;
                    saveSettings();
                }
            } else if (!isInSpace && lastSpaceState && !endedScreen) {
                currentSpaceId = null;
                hasDownloaded = false;
                saveSettings();
                activeHandRaises.clear();
            }

            if (isInSpace && peopleButton) {
                const peopleBtn = peopleButton.closest('button');
                if (peopleBtn) {
                    const rect = peopleBtn.getBoundingClientRect();
                    const baseTop = rect.top - 10;
                    transcriptButton.style.position = 'fixed';
                    transcriptButton.style.left = `${rect.left - 46}px`;
                    transcriptButton.style.top = `${queueButton && queueButton.style.display !== 'none' ? baseTop + 40 : rect.top}px`;
                    transcriptButton.style.display = 'block';

                    if (queueButton) {
                        queueButton.style.position = 'fixed';
                        queueButton.style.left = `${rect.left - 46}px`;
                        queueButton.style.top = `${baseTop}px`;
                        queueButton.style.display = handQueue.size > 0 ? 'block' : 'none';
                    }

                    if (handQueuePopup) {
                        handQueuePopup.style.right = transcriptPopup.style.right;
                        handQueuePopup.style.bottom = transcriptPopup.style.bottom;
                    }
                }
                if (reactionToggle) createEmojiPickerGrid();
            } else {
                transcriptButton.style.display = 'none';
                if (queueButton) queueButton.style.display = 'none';
                if (handQueuePopup) handQueuePopup.style.display = 'none';
                transcriptPopup.style.display = 'none';
                if (queueRefreshInterval) {
                    clearInterval(queueRefreshInterval);
                    queueRefreshInterval = null;
                }
            }

            const endedContainer = detectEndedUI();
            if (endedContainer && lastSpaceState) {
                currentSpaceId = null;
                hasDownloaded = false;
                saveSettings();
                activeHandRaises.clear();
                transcriptButton.style.display = 'none';
                if (queueButton) queueButton.style.display = 'none';
                if (handQueuePopup) handQueuePopup.style.display = 'none';
                transcriptPopup.style.display = 'none';
                if (queueRefreshInterval) {
                    clearInterval(queueRefreshInterval);
                    queueRefreshInterval = null;
                }
            }

            lastSpaceState = isInSpace;
        } catch (e) {}
    }

    function updateQueueButtonVisibility() {
        try {
            if (queueButton) {
                queueButton.style.display = handQueue.size > 0 ? 'block' : 'none';
                updateVisibilityAndPosition();
            }
        } catch (e) {}
    }

    async function formatTranscriptForDownload() {
        try {
            const spaceId = getSpaceIdFromUrl();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const baseHeader = '--- Space URLs ---\n' +
                (spaceId ? `Space URL: https://x.com/i/spaces/${spaceId}\n` : 'Space URL: Not available\n') +
                (dynamicUrl ? `Live URL: ${dynamicUrl}\n` : 'Live URL: Not available\n');

            let replayUrl = 'Replay URL: Not available\n';
            try {
                const generatedReplayUrl = await fetchReplayUrl(dynamicUrl);
                replayUrl = `Replay URL: ${generatedReplayUrl}\n`;
            } catch (e) {
                replayUrl = 'Replay URL: Failed to generate\n';
            }

            const header = `${baseHeader}${replayUrl}-----------------\n\n`;

            const combinedData = [
                ...captionsData.map(item => ({ ...item, type: 'caption' })),
                ...emojiReactions.map(item => ({ ...item, type: 'emoji' }))
            ].sort((a, b) => a.timestamp - b.timestamp);

            let transcriptionText = header;
            let previousSpeakerTrans = { username: '', handle: '' };
            const transcriptions = combinedData.filter(item => item.type === 'caption' && item.displayName !== 'System');

            transcriptions.forEach((item, i) => {
                let { displayName, handle } = item;
                if (displayName === 'Unknown' && previousSpeakerTrans.username) {
                    displayName = previousSpeakerTrans.username;
                    handle = previousSpeakerTrans.handle;
                }
                if (i > 0 && previousSpeakerTrans.username !== displayName) {
                    const date = new Date(item.timestamp);
                    const timestampStr = date.toISOString().replace('T', ' ').substring(0, 19);
                    transcriptionText += `\n[${timestampStr}]\n`;
                }
                transcriptionText += `${displayName} ${handle}\n${item.text}\n\n`;
                previousSpeakerTrans = { username: displayName, handle };
            });

            let systemText = header;
            let previousSpeakerSys = { username: '', handle: '' };
            const systemAndReactions = combinedData.filter(item => item.type === 'emoji' || (item.type === 'caption' && item.displayName === 'System'));

            systemAndReactions.forEach((item, i) => {
                let { displayName, handle } = item;
                if (displayName === 'Unknown' && previousSpeakerSys.username) {
                    displayName = previousSpeakerSys.username;
                    handle = previousSpeakerSys.handle;
                }
                if (i > 0 && previousSpeakerSys.username !== displayName && item.type === 'caption') {
                    const date = new Date(item.timestamp);
                    const timestampStr = date.toISOString().replace('T', ' ').substring(0, 19);
                    systemText += `\n[${timestampStr}]\n`;
                }
                if (item.type === 'caption') {
                    systemText += `${displayName} ${handle}\n${item.text}\n\n`;
                } else if (item.type === 'emoji') {
                    systemText += `${displayName} reacted with ${item.emoji}\n`;
                }
                previousSpeakerSys = { username: displayName, handle };
            });

            return {
                transcription: { content: transcriptionText, filename: `transcriptions_${timestamp}.txt` },
                system: { content: systemText, filename: `system_reactions_${timestamp}.txt` }
            };
        } catch (e) {
            return { transcription: { content: '', filename: '' }, system: { content: '', filename: '' } };
        }
    }

    let isUserScrolledUp = false;
    let currentFontSize = 14;
    let searchTerm = '';

    function filterTranscript(captions, emojis, term) {
        try {
            if (!term) return { captions, emojis };
            const filteredCaptions = captions.filter(caption =>
                caption.text.toLowerCase().includes(term.toLowerCase()) ||
                caption.displayName.toLowerCase().includes(term.toLowerCase()) ||
                caption.handle.toLowerCase().includes(term.toLowerCase())
            );
            const filteredEmojis = emojis.filter(emoji =>
                emoji.emoji.toLowerCase().includes(term.toLowerCase()) ||
                emoji.displayName.toLowerCase().includes(term.toLowerCase()) ||
                emoji.handle.toLowerCase().includes(term.toLowerCase())
            );
            return { captions: filteredCaptions, emojis: filteredEmojis };
        } catch (e) {
            return { captions: [], emojis: [] };
        }
    }

    async function toggleRecording(isEnabled) {
        try {
            if (!capturedCookie || !currentSpaceId) return false;

            // Capture the current Space title
            let spaceTitle = '';
            const spaceTitleContainer = document.querySelector('div[data-testid="tweetText"]');
            if (spaceTitleContainer) {
                const titleSpans = spaceTitleContainer.querySelectorAll('span.css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3');
                spaceTitle = Array.from(titleSpans)
                    .map(span => span.textContent)
                    .join(' ')
                    .trim();
            }

            const payload = {
                topics: [],
                is_space_available_for_clipping: false,
                cookie: capturedCookie,
                is_space_available_for_replay: isEnabled,
                locale: "en",
                replay_start_time: 0,
                no_incognito: false,
                replay_edited_title: spaceTitle,
                replay_thumbnail_time_code: 0,
                broadcast_id: currentSpaceId
            };

            if (!rateLimit.acquire()) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            const response = await fetch('https://proxsee.pscp.tv/api/v2/replayBroadcastEdit?build=com.atebits.Tweetie210.86', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    function groupEmojiReactions(reactions) {
        try {
            const grouped = {};
            reactions.forEach(({ displayName, handle, emoji }) => {
                const key = `${displayName}|${handle}`;
                if (!grouped[key]) {
                    grouped[key] = { displayName, handle, emojis: {} };
                }
                grouped[key].emojis[emoji] = (grouped[key].emojis[emoji] || 0) + 1;
            });

            return Object.values(grouped).map(({ displayName, handle, emojis }) => {
                const emojiString = Object.entries(emojis)
                    .map(([emoji, count]) => count > 1 ? `${emoji}x${count}` : emoji)
                    .join('');
                return { displayName, handle, emojiString };
            });
        } catch (e) {
            return [];
        }
    }

    function showGraph() {
        let isMobile = window.innerWidth < 600;
        const graphPopup = document.createElement('div');
        graphPopup.style.position = 'fixed';
        graphPopup.style.top = '50%';
        graphPopup.style.left = '50%';
        graphPopup.style.transform = 'translate(-50%, -50%)';
        graphPopup.style.backgroundColor = 'rgba(21, 32, 43, 0.95)';
        graphPopup.style.borderRadius = '10px';
        graphPopup.style.padding = '10px';
        graphPopup.style.zIndex = '10004';
        graphPopup.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
        graphPopup.style.width = isMobile ? '90%' : '800px';
        graphPopup.style.maxHeight = '90vh';
        graphPopup.style.overflowY = 'auto';
        graphPopup.style.color = 'white';
        graphPopup.style.fontSize = '14px';

        const closeGraphButton = document.createElement('button');
        closeGraphButton.textContent = 'X';
        closeGraphButton.style.position = 'absolute';
        closeGraphButton.style.top = '5px';
        closeGraphButton.style.right = '5px';
        closeGraphButton.style.background = 'none';
        closeGraphButton.style.border = 'none';
        closeGraphButton.style.color = 'white';
        closeGraphButton.style.fontSize = '14px';
        closeGraphButton.style.cursor = 'pointer';
        closeGraphButton.style.padding = '0';
        closeGraphButton.style.width = '20px';
        closeGraphButton.style.height = '20px';
        closeGraphButton.style.lineHeight = '20px';
        closeGraphButton.style.textAlign = 'center';
        closeGraphButton.addEventListener('mouseover', () => closeGraphButton.style.color = 'red');
        closeGraphButton.addEventListener('mouseout', () => closeGraphButton.style.color = 'white');
        closeGraphButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (updateInterval) clearInterval(updateInterval);
            document.body.removeChild(graphPopup);
        });
        graphPopup.appendChild(closeGraphButton);

        const tabs = ['Current Participants', 'Total Listeners', 'Emojis Sent', 'Emojis per User', 'Words per Speaker'];
        let currentTab = tabs[0];

        const tabContainer = document.createElement('div');
        tabContainer.style.display = 'flex';
        tabContainer.style.justifyContent = 'space-around';
        tabContainer.style.marginBottom = '10px';
        tabContainer.style.borderBottom = '1px solid rgba(255, 255, 255, 0.3)';

        tabs.forEach(tabName => {
            const tabButton = document.createElement('button');
            tabButton.textContent = tabName;
            tabButton.style.background = 'none';
            tabButton.style.border = 'none';
            tabButton.style.color = 'white';
            tabButton.style.cursor = 'pointer';
            tabButton.style.padding = '5px 10px';
            tabButton.style.borderBottom = tabName === currentTab ? '2px solid white' : 'none';
            tabButton.addEventListener('click', () => {
                currentTab = tabName;
                tabs.forEach(t => {
                    const btn = tabContainer.querySelector(`button[textContent="${t}"]`);
                    if (btn) btn.style.borderBottom = t === currentTab ? '2px solid white' : 'none';
                });
                drawGraph(currentTab);
            });
            tabContainer.appendChild(tabButton);
        });
        graphPopup.appendChild(tabContainer);

        const canvas = document.createElement('canvas');
        canvas.id = 'graphCanvas';
        canvas.width = isMobile ? window.innerWidth - 40 : 780;
        canvas.height = isMobile ? window.innerHeight / 2 : 600;
        canvas.style.border = '1px solid #ccc';
        canvas.style.borderRadius = '5px';
        graphPopup.appendChild(canvas);

        const tooltip = document.createElement('div');
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = 'white';
        tooltip.style.color = 'black';
        tooltip.style.padding = '5px';
        tooltip.style.border = '1px solid black';
        tooltip.style.display = 'none';
        tooltip.style.borderRadius = '5px';
        graphPopup.appendChild(tooltip);

        document.body.appendChild(graphPopup);

        const ctx = canvas.getContext('2d');
        let updateInterval;

        const pastelColors = ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFB3', '#BAE1FF', '#D4BAFF', '#FFBAE1', '#BAFFFF', '#B3FFBA', '#BAFFDF'];

        const drawLineGraph = (tabName) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let graphData = [];
            captionsData.forEach(item => {
                if (item.displayName === 'System' && (item.text.includes('Initial occupancy') || item.text.includes('user joined') || item.text.includes('user left'))) {
                    const match = item.text.match(/Current (\d+) - Total (\d+)/);
                    if (match) {
                        const occupancy = parseInt(match[1]);
                        const total = parseInt(match[2]);
                        const emojiCount = emojiReactions.filter(e => e.timestamp <= item.timestamp).length;
                        graphData.push({
                            timestamp: item.timestamp,
                            occupancy,
                            total,
                            emojiCount
                        });
                    }
                }
            });
            graphData.sort((a, b) => a.timestamp - b.timestamp);

            if (graphData.length < 2) {
                ctx.fillStyle = 'white';
                ctx.font = '16px Arial';
                ctx.fillText('Insufficient data to display graph.', 10, 50);
                return;
            }
            const minTime = graphData[0].timestamp;
            const maxTime = graphData[graphData.length - 1].timestamp;
            let plotData = graphData.map(d => ({timestamp: d.timestamp, value: d.occupancy}));
            let lineColor = '#ffff00'; // yellow
            let yLabel = 'Current Participants';

            if (tabName === 'Total Listeners') {
                plotData = graphData.map(d => ({timestamp: d.timestamp, value: d.total}));
                lineColor = 'green';
                yLabel = 'Total Listeners';
            } else if (tabName === 'Emojis Sent') {
                plotData = [];
                let prevCount = 0;
                for (let i = 0; i < graphData.length; i++) {
                    const delta = graphData[i].emojiCount - prevCount;
                    plotData.push({timestamp: graphData[i].timestamp, value: delta});
                    prevCount = graphData[i].emojiCount;
                }
                lineColor = 'red';
                yLabel = 'Emojis Sent';
            }

            const dataValues = plotData.map(d => d.value);
            let originalMinY = Math.min(...dataValues);
            let originalMaxY = Math.max(...dataValues);
            let minY = originalMinY;
            let maxY = originalMaxY;
            let yRange = maxY - minY;

            if (tabName === 'Current Participants' || tabName === 'Total Listeners') {
                minY = 0;
                yRange = maxY - minY;
                maxY += yRange * 0.1;
            } else {
                minY -= yRange * 0.1;
                maxY += yRange * 0.1;
            }

            if (minY === maxY) {
                minY -= 1;
                maxY += 1;
            }

            const bottom = canvas.height - 80; // Adjusted for mobile

            // Draw axes
            ctx.strokeStyle = '#ccc';
            ctx.beginPath();
            ctx.moveTo(50, 10);
            ctx.lineTo(50, bottom);
            ctx.lineTo(canvas.width - 10, bottom);
            ctx.stroke();

            // Y axis ticks and labels
            const yTicks = 11;
            const yStep = (maxY - minY) / 10;
            for (let i = 0; i < yTicks; i++) {
                const yVal = minY + i * yStep;
                const yPos = bottom - ((yVal - minY) / (maxY - minY) * (bottom - 10));
                ctx.beginPath();
                ctx.moveTo(45, yPos);
                ctx.lineTo(50, yPos);
                ctx.stroke();
                ctx.fillStyle = 'white';
                ctx.font = '12px Arial';
                ctx.textAlign = 'right';
                ctx.fillText(Math.round(yVal), 45, yPos + 4);
            }

            // X axis ticks and labels
            const xTicks = 25;
            const xStep = (maxTime - minTime) / (xTicks - 1);
            for (let i = 0; i < xTicks; i++) {
                const xTime = minTime + i * xStep;
                const xPos = (xTime - minTime) / (maxTime - minTime) * (canvas.width - 60) + 50;
                ctx.beginPath();
                ctx.moveTo(xPos, bottom);
                ctx.lineTo(xPos, bottom + 5);
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillStyle = 'white';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    const date = new Date(xTime);
                    const timeStr = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});
                    ctx.fillText(timeStr, xPos, bottom + 20);
                }
            }

            // Labels
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Time in Space', canvas.width / 2, bottom + 70);

            ctx.save();
            ctx.translate(10, bottom / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.textAlign = 'center';
            ctx.fillText(yLabel, 0, 0);
            ctx.restore();

            // Legend
            ctx.fillText(tabName, canvas.width - 180, 20);
            ctx.strokeStyle = lineColor;
            ctx.beginPath();
            ctx.moveTo(canvas.width - 200, 15);
            ctx.lineTo(canvas.width - 190, 15);
            ctx.stroke();

            // Draw line
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            for (let i = 0; i < plotData.length; i++) {
                const x = (plotData[i].timestamp - minTime) / (maxTime - minTime) * (canvas.width - 60) + 50;
                const y = bottom - ((plotData[i].value - minY) / (maxY - minY) * (bottom - 10));
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        };

        const drawBarGraph = (tabName) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let barData = [];
            let yLabel = '';
            if (tabName === 'Emojis per User') {
                let emojiCounts = {};
                emojiReactions.forEach(reaction => {
                    const key = reaction.displayName;
                    if (key !== 'Unknown') {
                        emojiCounts[key] = (emojiCounts[key] || 0) + 1;
                    }
                });
                barData = Object.entries(emojiCounts).map(([user, count]) => ({user, count}));
                barData.sort((a, b) => b.count - a.count);
                barData = barData.slice(0, 10);
                yLabel = 'Emojis Sent';
            } else if (tabName === 'Words per Speaker') {
                let wordCounts = {};
                captionsData.forEach(caption => {
                    if (caption.displayName !== 'System' && caption.displayName !== 'Unknown') {
                        const key = caption.displayName;
                        const words = caption.text.split(/\s+/).filter(w => w.length > 0).length;
                        wordCounts[key] = (wordCounts[key] || 0) + words;
                    }
                });
                barData = Object.entries(wordCounts).map(([user, count]) => ({user, count}));
                barData.sort((a, b) => b.count - a.count);
                barData = barData.slice(0, 10);
                yLabel = 'Words Spoken';
            }

            if (barData.length === 0) {
                ctx.fillStyle = 'white';
                ctx.font = '16px Arial';
                ctx.fillText('No data available.', 10, 50);
                return;
            }

            const maxY = Math.max(...barData.map(d => d.count)) * 1.1 || 1;
            const bottom = canvas.height - 80;

            // Draw axes
            ctx.strokeStyle = '#ccc';
            ctx.beginPath();
            ctx.moveTo(50, 10);
            ctx.lineTo(50, bottom);
            ctx.lineTo(canvas.width - 10, bottom);
            ctx.stroke();

            // Y axis ticks and labels
            const yTicks = 11;
            const yStep = maxY / 10;
            for (let i = 0; i < yTicks; i++) {
                const yVal = i * yStep;
                const yPos = bottom - (yVal / maxY * (bottom - 10));
                ctx.beginPath();
                ctx.moveTo(45, yPos);
                ctx.lineTo(50, yPos);
                ctx.stroke();
                ctx.fillStyle = 'white';
                ctx.font = '12px Arial';
                ctx.textAlign = 'right';
                ctx.fillText(Math.round(yVal), 45, yPos + 4);
            }

            // Draw bars with rounded corners and outline
            const barWidth = (canvas.width - 60) / barData.length / 2;
            barData.forEach((d, i) => {
                const xPos = i * ((canvas.width - 60) / barData.length) + 50 + ((canvas.width - 60) / barData.length) / 4;
                const height = (d.count / maxY) * (bottom - 10);
                const yPos = bottom - height;
                const radius = 5;

                // Draw rounded rectangle
                ctx.beginPath();
                ctx.moveTo(xPos + radius, yPos);
                ctx.lineTo(xPos + barWidth - radius, yPos);
                ctx.arc(xPos + barWidth - radius, yPos + radius, radius, -Math.PI / 2, 0);
                ctx.lineTo(xPos + barWidth, yPos + height - radius);
                ctx.arc(xPos + barWidth - radius, yPos + height - radius, radius, 0, Math.PI / 2);
                ctx.lineTo(xPos + radius, yPos + height);
                ctx.arc(xPos + radius, yPos + height - radius, radius, Math.PI / 2, Math.PI);
                ctx.lineTo(xPos, yPos + radius);
                ctx.arc(xPos + radius, yPos + radius, radius, Math.PI, 3 * Math.PI / 2);
                ctx.closePath();

                ctx.fillStyle = pastelColors[i % pastelColors.length].replace('#', '#99') ; // Darker pastel by reducing lightness
                ctx.fill();

                ctx.strokeStyle = pastelColors[i % pastelColors.length];
                ctx.lineWidth = 2;
                ctx.stroke();

                // Value inside bar
                ctx.fillStyle = 'black';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(d.count, xPos + barWidth / 2, yPos + height - 10);
            });

            // X axis labels horizontal staggered
            barData.forEach((d, i) => {
                const xPos = i * ((canvas.width - 60) / barData.length) + 50 + ((canvas.width - 60) / barData.length) / 2;
                ctx.fillStyle = 'white';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                const yOffset = i % 2 === 0 ? bottom + 15 : bottom + 30;
                ctx.fillText(d.user, xPos, yOffset);
            });

            // Labels
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Users', canvas.width / 2, bottom + 50);

            ctx.save();
            ctx.translate(10, bottom / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.textAlign = 'center';
            ctx.fillText(yLabel, 0, 0);
            ctx.restore();
        };

        const drawGraph = (tabName) => {
            if (['Emojis per User', 'Words per Speaker'].includes(tabName)) {
                drawBarGraph(tabName);
            } else {
                drawLineGraph(tabName);
            }
        };

        drawGraph(currentTab);
        updateInterval = setInterval(() => drawGraph(currentTab), 30000);

        canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            if (['Emojis per User', 'Words per Speaker'].includes(currentTab)) {
                let barData = [];
                if (currentTab === 'Emojis per User') {
                    let emojiCounts = {};
                    emojiReactions.forEach(reaction => {
                        const key = reaction.displayName;
                        if (key !== 'Unknown') {
                            emojiCounts[key] = (emojiCounts[key] || 0) + 1;
                        }
                    });
                    barData = Object.entries(emojiCounts).map(([user, count]) => ({user, count}));
                    barData.sort((a, b) => b.count - a.count);
                    barData = barData.slice(0, 10);
                } else if (currentTab === 'Words per Speaker') {
                    let wordCounts = {};
                    captionsData.forEach(caption => {
                        if (caption.displayName !== 'System' && caption.displayName !== 'Unknown') {
                            const key = caption.displayName;
                            const words = caption.text.split(/\s+/).filter(w => w.length > 0).length;
                            wordCounts[key] = (wordCounts[key] || 0) + words;
                        }
                    });
                    barData = Object.entries(wordCounts).map(([user, count]) => ({user, count}));
                    barData.sort((a, b) => b.count - a.count);
                    barData = barData.slice(0, 10);
                }

                const barWidth = (canvas.width - 60) / barData.length / 2;
                for (let i = 0; i < barData.length; i++) {
                    const xPos = i * ((canvas.width - 60) / barData.length) + 50 + ((canvas.width - 60) / barData.length) / 4;
                    if (clickX >= xPos && clickX <= xPos + barWidth) {
                        tooltip.textContent = `${barData[i].user}: ${barData[i].count}`;
                        tooltip.style.left = `${clickX + 10}px`;
                        tooltip.style.top = `${clickY + 10}px`;
                        tooltip.style.display = 'block';
                        setTimeout(() => tooltip.style.display = 'none', 3000);
                        break;
                    }
                }
            } else {
                // Line graph click logic
                let recomputedGraphData = [];
                captionsData.forEach(item => {
                    if (item.displayName === 'System' && (item.text.includes('Initial occupancy') || item.text.includes('user joined') || item.text.includes('user left'))) {
                        const match = item.text.match(/Current (\d+) - Total (\d+)/);
                        if (match) {
                            const occupancy = parseInt(match[1]);
                            const total = parseInt(match[2]);
                            const emojiCount = emojiReactions.filter(e => e.timestamp <= item.timestamp).length;
                            recomputedGraphData.push({
                                timestamp: item.timestamp,
                                occupancy,
                                total,
                                emojiCount
                            });
                        }
                    }
                });
                recomputedGraphData.sort((a, b) => a.timestamp - b.timestamp);

                if (recomputedGraphData.length < 2) return;

                const minTime = recomputedGraphData[0].timestamp;
                const maxTime = recomputedGraphData[recomputedGraphData.length - 1].timestamp;

                let plotData = recomputedGraphData.map(d => ({timestamp: d.timestamp, value: d.occupancy}));
                if (currentTab === 'Total Listeners') {
                    plotData = recomputedGraphData.map(d => ({timestamp: d.timestamp, value: d.total}));
                } else if (currentTab === 'Emojis Sent') {
                    plotData = [];
                    let prevCount = 0;
                    for (let i = 0; i < recomputedGraphData.length; i++) {
                        const delta = recomputedGraphData[i].emojiCount - prevCount;
                        plotData.push({timestamp: recomputedGraphData[i].timestamp, value: delta});
                        prevCount = recomputedGraphData[i].emojiCount;
                    }
                }

                // Find closest point
                let closest = plotData[0];
                let minDist = Infinity;
                for (let d of plotData) {
                    const dataX = (d.timestamp - minTime) / (maxTime - minTime) * (canvas.width - 60) + 50;
                    const dist = Math.abs(dataX - clickX);
                    if (dist < minDist) {
                        minDist = dist;
                        closest = d;
                    }
                }

                const value = closest.value;
                const date = new Date(closest.timestamp).toLocaleString();

                tooltip.textContent = `Value: ${value}\nTime: ${date}`;
                tooltip.style.left = `${clickX + 10}px`;
                tooltip.style.top = `${clickY + 10}px`;
                tooltip.style.display = 'block';

                setTimeout(() => tooltip.style.display = 'none', 3000);
            }
        });
    }

    function updateTranscriptPopup() {
        try {
            if (!transcriptPopup || transcriptPopup.style.display !== 'block') return;

            let queueContainer = transcriptPopup.querySelector('#queue-container');
            let searchContainer = transcriptPopup.querySelector('#search-container');
            let scrollArea = transcriptPopup.querySelector('#transcript-scrollable');
            let systemArea = transcriptPopup.querySelector('#system-messages');
            let saveButton = transcriptPopup.querySelector('.save-button');
            let textSizeContainer = transcriptPopup.querySelector('.text-size-container');
            let systemToggleButton = transcriptPopup.querySelector('#system-toggle-button');
            let emojiToggleButton = transcriptPopup.querySelector('#emoji-toggle-button');
            let replayToggleButton = transcriptPopup.querySelector('#replay-toggle-button');
            let graphButton = transcriptPopup.querySelector('#graph-button');
            let currentScrollTop = scrollArea ? scrollArea.scrollTop : 0;
            let wasAtBottom = scrollArea ? (scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight < 50) : true;

            let showEmojisInUI = localStorage.getItem(STORAGE_KEYS.SHOW_EMOJIS) !== 'false';
            let showSystemMessagesInUI = localStorage.getItem(STORAGE_KEYS.SHOW_SYSTEM_MESSAGES) !== 'false';
            let isReplayEnabled = localStorage.getItem(STORAGE_KEYS.REPLAY_ENABLED) !== 'false';

            if (!queueContainer || !searchContainer || !scrollArea || !systemArea || !saveButton || !textSizeContainer || !systemToggleButton || !emojiToggleButton || !replayToggleButton || !graphButton) {
                transcriptPopup.innerHTML = '';

                queueContainer = document.createElement('div');
                queueContainer.id = 'queue-container';
                queueContainer.style.marginBottom = '10px';
                transcriptPopup.appendChild(queueContainer);

                searchContainer = document.createElement('div');
                searchContainer.id = 'search-container';
                searchContainer.style.display = 'none';
                searchContainer.style.marginBottom = '5px';

                const searchInput = document.createElement('input');
                searchInput.type = 'text';
                searchInput.placeholder = 'Search transcript...';
                searchInput.style.width = '87%';
                searchInput.style.padding = '5px';
                searchInput.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                searchInput.style.border = 'none';
                searchInput.style.borderRadius = '5px';
                searchInput.style.color = 'white';
                searchInput.style.fontSize = '14px';
                searchInput.addEventListener('input', (e) => {
                    searchTerm = e.target.value.trim();
                    updateTranscriptPopup();
                });

                searchContainer.appendChild(searchInput);
                transcriptPopup.appendChild(searchContainer);

                scrollArea = document.createElement('div');
                scrollArea.id = 'transcript-scrollable';
                scrollArea.style.flex = '1';
                scrollArea.style.overflowY = 'auto';
                scrollArea.style.maxHeight = '250px';
                scrollArea.style.marginBottom = '5px';

                const captionWrapper = document.createElement('div');
                captionWrapper.id = 'transcript-output';
                captionWrapper.style.color = '#e7e9ea';
                captionWrapper.style.fontFamily = 'Arial, sans-serif';
                captionWrapper.style.whiteSpace = 'pre-wrap';
                captionWrapper.style.fontSize = `${currentFontSize}px`;
                scrollArea.appendChild(captionWrapper);
                transcriptPopup.appendChild(scrollArea);

                systemArea = document.createElement('div');
                systemArea.id = 'system-messages';
                systemArea.style.height = '4em';
                systemArea.style.overflowY = 'auto';
                systemArea.style.borderTop = '1px solid rgba(255, 255, 255, 0.3)';
                systemArea.style.paddingTop = '5px';
                systemArea.style.marginBottom = '5px';
                systemArea.style.display = showSystemMessagesInUI ? 'block' : 'none';

                const systemWrapper = document.createElement('div');
                systemWrapper.id = 'system-output';
                systemWrapper.style.color = '#e7e9ea';
                systemWrapper.style.fontFamily = 'Arial, sans-serif';
                systemWrapper.style.whiteSpace = 'pre-wrap';
                systemWrapper.style.fontSize = `${currentFontSize}px`;
                systemArea.appendChild(systemWrapper);
                transcriptPopup.appendChild(systemArea);

                const controlsContainer = document.createElement('div');
                controlsContainer.style.display = 'flex';
                controlsContainer.style.alignItems = 'center';
                controlsContainer.style.justifyContent = 'space-between';
                controlsContainer.style.padding = '5px 0';
                controlsContainer.style.borderTop = '1px solid rgba(255, 255, 255, 0.3)';

                saveButton = document.createElement('div');
                saveButton.className = 'save-button';
                saveButton.textContent = '💾 Save Transcript';
                saveButton.style.color = '#1DA1F2';
                saveButton.style.fontSize = '14px';
                saveButton.style.cursor = 'pointer';
                saveButton.addEventListener('click', async () => {
                    saveButton.textContent = '💾 Saving...';
                    const transcripts = await formatTranscriptForDownload();

                    if (transcripts.transcription.content) {
                        const transcriptionBlob = new Blob([transcripts.transcription.content], { type: 'text/plain' });
                        const transcriptionUrl = URL.createObjectURL(transcriptionBlob);
                        const transcriptionLink = document.createElement('a');
                        transcriptionLink.href = transcriptionUrl;
                        transcriptionLink.download = transcripts.transcription.filename;
                        document.body.appendChild(transcriptionLink);
                        transcriptionLink.click();
                        document.body.removeChild(transcriptionLink);
                        URL.revokeObjectURL(transcriptionUrl);
                    }

                    const showEmojisInUI = localStorage.getItem(STORAGE_KEYS.SHOW_EMOJIS) !== 'false';
                    const showSystemMessagesInUI = localStorage.getItem(STORAGE_KEYS.SHOW_SYSTEM_MESSAGES) !== 'false';

                    if (showEmojisInUI || showSystemMessagesInUI) {
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        if (transcripts.system.content) {
                            const systemBlob = new Blob([transcripts.system.content], { type: 'text/plain' });
                            const systemUrl = URL.createObjectURL(systemBlob);
                            const systemLink = document.createElement('a');
                            systemLink.href = systemUrl;
                            systemLink.download = transcripts.system.filename;
                            document.body.appendChild(systemLink);
                            systemLink.click();
                            document.body.removeChild(systemLink);
                            URL.revokeObjectURL(systemUrl);
                        }
                    }

                    saveButton.textContent = '💾 Save Transcript';
                });
                saveButton.addEventListener('mouseover', () => saveButton.style.color = '#FF9800');
                saveButton.addEventListener('mouseout', () => saveButton.style.color = '#1DA1F2');

                textSizeContainer = document.createElement('div');
                textSizeContainer.className = 'text-size-container';
                textSizeContainer.style.display = 'flex';
                textSizeContainer.style.alignItems = 'center';

                systemToggleButton = document.createElement('span');
                systemToggleButton.id = 'system-toggle-button';
                systemToggleButton.style.position = 'relative';
                systemToggleButton.style.fontSize = '14px';
                systemToggleButton.style.cursor = 'pointer';
                systemToggleButton.style.marginRight = '5px';
                systemToggleButton.style.width = '14px';
                systemToggleButton.style.height = '14px';
                systemToggleButton.style.display = 'inline-flex';
                systemToggleButton.style.alignItems = 'center';
                systemToggleButton.style.justifyContent = 'center';
                systemToggleButton.title = 'Toggle System Messages in UI';
                systemToggleButton.innerHTML = '📢';

                const systemNotAllowedOverlay = document.createElement('span');
                systemNotAllowedOverlay.style.position = 'absolute';
                systemNotAllowedOverlay.style.width = '14px';
                systemNotAllowedOverlay.style.height = '14px';
                systemNotAllowedOverlay.style.border = '2px solid red';
                systemNotAllowedOverlay.style.borderRadius = '50%';
                systemNotAllowedOverlay.style.transform = 'rotate(45deg)';
                systemNotAllowedOverlay.style.background = 'transparent';
                systemNotAllowedOverlay.style.display = showSystemMessagesInUI ? 'none' : 'block';

                const systemSlash = document.createElement('span');
                systemSlash.style.position = 'absolute';
                systemSlash.style.width = '2px';
                systemSlash.style.height = '18px';
                systemSlash.style.background = 'red';
                systemSlash.style.transform = 'rotate(-45deg)';
                systemSlash.style.top = '-2px';
                systemSlash.style.left = '6px';
                systemNotAllowedOverlay.appendChild(systemSlash);

                systemToggleButton.appendChild(systemNotAllowedOverlay);

                systemToggleButton.addEventListener('click', () => {
                    showSystemMessagesInUI = !showSystemMessagesInUI;
                    systemNotAllowedOverlay.style.display = showSystemMessagesInUI ? 'none' : 'block';
                    localStorage.setItem(STORAGE_KEYS.SHOW_SYSTEM_MESSAGES, showSystemMessagesInUI);
                    systemArea.style.display = showSystemMessagesInUI ? 'block' : 'none';
                    updateTranscriptPopup();
                });

                emojiToggleButton = document.createElement('span');
                emojiToggleButton.id = 'emoji-toggle-button';
                emojiToggleButton.style.position = 'relative';
                emojiToggleButton.style.fontSize = '14px';
                emojiToggleButton.style.cursor = 'pointer';
                emojiToggleButton.style.marginRight = '5px';
                emojiToggleButton.style.width = '14px';
                emojiToggleButton.style.height = '14px';
                emojiToggleButton.style.display = 'inline-flex';
                emojiToggleButton.style.alignItems = 'center';
                emojiToggleButton.style.justifyContent = 'center';
                emojiToggleButton.title = 'Toggle Emoji Reactions in UI';
                emojiToggleButton.innerHTML = '🙂';

                const emojiNotAllowedOverlay = document.createElement('span');
                emojiNotAllowedOverlay.style.position = 'absolute';
                emojiNotAllowedOverlay.style.width = '14px';
                emojiNotAllowedOverlay.style.height = '14px';
                emojiNotAllowedOverlay.style.border = '2px solid red';
                emojiNotAllowedOverlay.style.borderRadius = '50%';
                emojiNotAllowedOverlay.style.transform = 'rotate(45deg)';
                emojiNotAllowedOverlay.style.background = 'transparent';
                emojiNotAllowedOverlay.style.display = showEmojisInUI ? 'none' : 'block';

                const emojiSlash = document.createElement('span');
                emojiSlash.style.position = 'absolute';
                emojiSlash.style.width = '2px';
                emojiSlash.style.height = '18px';
                emojiSlash.style.background = 'red';
                emojiSlash.style.transform = 'rotate(-45deg)';
                emojiSlash.style.top = '-2px';
                emojiSlash.style.left = '6px';
                emojiNotAllowedOverlay.appendChild(emojiSlash);

                emojiToggleButton.appendChild(emojiNotAllowedOverlay);

                emojiToggleButton.addEventListener('click', () => {
                    showEmojisInUI = !showEmojisInUI;
                    emojiNotAllowedOverlay.style.display = showEmojisInUI ? 'none' : 'block';
                    localStorage.setItem(STORAGE_KEYS.SHOW_EMOJIS, showEmojisInUI);
                    updateTranscriptPopup();
                });

                replayToggleButton = document.createElement('span');
                replayToggleButton.id = 'replay-toggle-button';
                replayToggleButton.style.position = 'relative';
                replayToggleButton.style.fontSize = '14px';
                replayToggleButton.style.cursor = 'pointer';
                replayToggleButton.style.marginRight = '5px';
                replayToggleButton.style.width = '14px';
                replayToggleButton.style.height = '14px';
                replayToggleButton.style.display = 'inline-flex';
                replayToggleButton.style.alignItems = 'center';
                replayToggleButton.style.justifyContent = 'center';
                replayToggleButton.title = 'Toggle Recording Availability';
                replayToggleButton.innerHTML = '📼';

                const replayNotAllowedOverlay = document.createElement('span');
                replayNotAllowedOverlay.style.position = 'absolute';
                replayNotAllowedOverlay.style.width = '14px';
                replayNotAllowedOverlay.style.height = '14px';
                replayNotAllowedOverlay.style.border = '2px solid red';
                replayNotAllowedOverlay.style.borderRadius = '50%';
                replayNotAllowedOverlay.style.transform = 'rotate(45deg)';
                replayNotAllowedOverlay.style.background = 'transparent';
                replayNotAllowedOverlay.style.display = isReplayEnabled ? 'none' : 'block';

                const replaySlash = document.createElement('span');
                replaySlash.style.position = 'absolute';
                replaySlash.style.width = '2px';
                replaySlash.style.height = '18px';
                replaySlash.style.background = 'red';
                replaySlash.style.transform = 'rotate(-45deg)';
                replaySlash.style.top = '-2px';
                replaySlash.style.left = '6px';
                replayNotAllowedOverlay.appendChild(replaySlash);

                replayToggleButton.appendChild(replayNotAllowedOverlay);

                replayToggleButton.addEventListener('click', async () => {
                    isReplayEnabled = !isReplayEnabled;
                    replayNotAllowedOverlay.style.display = isReplayEnabled ? 'none' : 'block';
                    localStorage.setItem(STORAGE_KEYS.REPLAY_ENABLED, isReplayEnabled);

                    const success = await toggleRecording(isReplayEnabled);
                    if (!success) {
                        isReplayEnabled = !isReplayEnabled;
                        replayNotAllowedOverlay.style.display = isReplayEnabled ? 'none' : 'block';
                        localStorage.setItem(STORAGE_KEYS.REPLAY_ENABLED, isReplayEnabled);
                    }

                    updateTranscriptPopup();
                });

                graphButton = document.createElement('span');
                graphButton.id = 'graph-button';
                graphButton.style.fontSize = '14px';
                graphButton.style.cursor = 'pointer';
                graphButton.style.marginRight = '5px';
                graphButton.style.width = '14px';
                graphButton.style.height = '14px';
                graphButton.style.display = 'inline-flex';
                graphButton.style.alignItems = 'center';
                graphButton.style.justifyContent = 'center';
                graphButton.title = 'View Stats Graph';
                graphButton.innerHTML = '📈';

                graphButton.addEventListener('click', showGraph);

                const magnifierEmoji = document.createElement('span');
                magnifierEmoji.textContent = '🔍';
                magnifierEmoji.style.marginRight = '5px';
                magnifierEmoji.style.fontSize = '14px';
                magnifierEmoji.style.cursor = 'pointer';
                magnifierEmoji.title = 'Search transcript';
                magnifierEmoji.addEventListener('click', () => {
                    searchContainer.style.display = searchContainer.style.display === 'none' ? 'block' : 'none';
                    if (searchContainer.style.display === 'block') searchInput.focus();
                    else {
                        searchTerm = '';
                        searchInput.value = '';
                        updateTranscriptPopup();
                    }
                });

                const textSizeSlider = document.createElement('input');
                textSizeSlider.type = 'range';
                textSizeSlider.min = '12';
                textSizeSlider.max = '18';
                textSizeSlider.value = currentFontSize;
                textSizeSlider.style.width = '50px';
                textSizeSlider.style.cursor = 'pointer';
                textSizeSlider.title = 'Adjust transcript text size';
                textSizeSlider.addEventListener('input', () => {
                    currentFontSize = parseInt(textSizeSlider.value, 10);
                    const captionWrapper = transcriptPopup.querySelector('#transcript-output');
                    const systemWrapper = transcriptPopup.querySelector('#system-output');
                    if (captionWrapper) captionWrapper.style.fontSize = `${currentFontSize}px`;
                    if (systemWrapper) systemWrapper.style.fontSize = `${currentFontSize}px`;
                    localStorage.setItem('xSpacesCustomReactions_textSize', currentFontSize);
                });

                const savedTextSize = localStorage.getItem('xSpacesCustomReactions_textSize');
                if (savedTextSize) {
                    currentFontSize = parseInt(savedTextSize, 10);
                    textSizeSlider.value = currentFontSize;
                }

                textSizeContainer.appendChild(systemToggleButton);
                textSizeContainer.appendChild(emojiToggleButton);
                textSizeContainer.appendChild(replayToggleButton);
                textSizeContainer.appendChild(graphButton);
                textSizeContainer.appendChild(magnifierEmoji);
                textSizeContainer.appendChild(textSizeSlider);

                controlsContainer.appendChild(saveButton);
                controlsContainer.appendChild(textSizeContainer);

                transcriptPopup.appendChild(controlsContainer);
            }

            if (systemArea) systemArea.style.display = showSystemMessagesInUI ? 'block' : 'none';

            const { captions: filteredCaptions, emojis: filteredEmojis } = filterTranscript(captionsData, emojiReactions, searchTerm);
            const uiCaptions = filteredCaptions.filter(c => c.displayName !== 'System');
            const uiSystemMessages = showSystemMessagesInUI ? filteredCaptions.filter(c => c.displayName === 'System') : [];
            const uiEmojis = showEmojisInUI ? filteredEmojis : [];

            const transcriptionData = [
                ...uiCaptions.map(item => ({ ...item, type: 'caption' })),
                ...uiEmojis.map(item => ({ ...item, type: 'emoji' }))
            ].sort((a, b) => a.timestamp - b.timestamp);

            const systemData = uiSystemMessages.map(item => ({ ...item, type: 'caption' }))
                .sort((a, b) => a.timestamp - b.timestamp);

            const hasTranscriptions = uiCaptions.length > 0;

            if (!hasTranscriptions && !searchTerm) {
                const captionWrapper = scrollArea.querySelector('#transcript-output');
                if (captionWrapper) {
                    captionWrapper.innerHTML = `<div style="color: #FFD700; font-size: ${currentFontSize}px; margin-bottom: 10px;">Transcription not started. To start, turn closed captions on and off momentarily from the ... menu.</div>`;
                }
                const systemWrapper = systemArea.querySelector('#system-output');
                if (systemWrapper) systemWrapper.innerHTML = '';
                return;
            }

            let transcriptionHtml = '';
            if (transcriptionData.length > 200) {
                transcriptionHtml += '<div style="color: #FFD700; font-size: 12px; margin-bottom: 10px;">Showing the last 200 lines. Save transcript to see the full conversation.</div>';
            }

            let lastSpeakerDisplayed = '';
            const recentTranscriptionData = transcriptionData.slice(-200);
            let currentReactions = [];
            let lastCaptionTimestamp = 0;

            recentTranscriptionData.forEach((item, index) => {
                if (item.type === 'caption') {
                    let { displayName, handle, text, timestamp } = item;
                    if (displayName === 'Unknown' && lastSpeaker.username) {
                        displayName = lastSpeaker.username;
                        handle = lastSpeaker.handle;
                    }

                    if (currentReactions.length > 0 && showEmojisInUI) {
                        const groupedReactions = groupEmojiReactions(currentReactions);
                        groupedReactions.forEach(({ displayName: rDisplayName, handle: rHandle, emojiString }) => {
                            transcriptionHtml += `<span style="font-size: ${currentFontSize}px; color: #FFD700">${rDisplayName}</span> ` +
                                                 `<span style="font-size: ${currentFontSize}px; color: #FFFFFF">reacted with ${emojiString}</span><br>`;
                        });
                        currentReactions = [];
                    }

                    if (lastSpeakerDisplayed && lastSpeakerDisplayed !== displayName) {
                        transcriptionHtml += '<br>';
                    }
                    transcriptionHtml += `<span style="font-size: ${currentFontSize}px; color: #1DA1F2">${displayName} ${handle}</span> ` +
                                         `<span style="font-size: ${currentFontSize}px; color: #FFFFFF">${text}</span><br>`;
                    lastSpeaker = { username: displayName, handle };
                    lastSpeakerDisplayed = displayName;
                    lastCaptionTimestamp = timestamp;
                } else if (item.type === 'emoji' && showEmojisInUI) {
                    let { displayName, handle, emoji } = item;
                    if (displayName === 'Unknown' && lastSpeaker.username) {
                        displayName = lastSpeaker.username;
                        handle = lastSpeaker.handle;
                    }
                    currentReactions.push({ displayName, handle, emoji });
                    lastSpeaker = { username: displayName, handle };
                }

                if (index === recentTranscriptionData.length - 1 && currentReactions.length > 0 && showEmojisInUI) {
                    const groupedReactions = groupEmojiReactions(currentReactions);
                    groupedReactions.forEach(({ displayName: rDisplayName, handle: rHandle, emojiString }) => {
                        transcriptionHtml += `<span style="font-size: ${currentFontSize}px; color: #FFD700">${rDisplayName}</span> ` +
                                             `<span style="font-size: ${currentFontSize}px; color: #FFFFFF">reacted with ${emojiString}</span><br>`;
                    });
                }
            });

            let systemHtml = '';
            systemData.slice(-10).forEach((item) => {
                let { text } = item;
                systemHtml += `<span style="font-size: ${currentFontSize}px; color: #FF4500">${text}</span><br>`;
            });

            const captionWrapper = scrollArea.querySelector('#transcript-output');
            if (captionWrapper) {
                captionWrapper.innerHTML = transcriptionHtml;
                if (wasAtBottom && !searchTerm) scrollArea.scrollTop = scrollArea.scrollHeight;
                else scrollArea.scrollTop = currentScrollTop;
                scrollArea.onscroll = () => {
                    isUserScrolledUp = scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight > 50;
                };
            }

            const systemWrapper = systemArea.querySelector('#system-output');
            if (systemWrapper) {
                systemWrapper.innerHTML = systemHtml;
                systemArea.scrollTop = systemArea.scrollHeight;
            }

            if (handQueuePopup && handQueuePopup.style.display === 'block') {
                updateHandQueueContent(handQueuePopup.querySelector('#hand-queue-content'));
            }
        } catch (e) {}
    }

    function updateHandQueueContent(queueContent) {
        try {
            if (!queueContent) return;
            queueContent.innerHTML = '<strong>Speaking Queue</strong><br>';
            if (handQueue.size === 0) {
                queueContent.innerHTML += 'No hands raised.<br>';
            } else {
                const now = Date.now();
                const sortedQueue = Array.from(handQueue.entries()).sort(([, a], [, b]) => a.timestamp - b.timestamp);

                const queueList = document.createElement('div');
                queueList.style.display = 'flex';
                queueList.style.flexDirection = 'column';
                queueList.style.gap = '8px';

                const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

                sortedQueue.forEach(([participantIndex, { displayName, timestamp }], index) => {
                    const entry = document.createElement('div');
                    entry.style.display = 'flex';
                    entry.style.justifyContent = 'space-between';
                    entry.style.alignItems = 'center';

                    const text = document.createElement('span');
                    const timeUp = Math.floor((now - timestamp) / 1000);
                    let timeStr;
                    if (timeUp >= 3600) {
                        const hours = Math.floor(timeUp / 3600);
                        const minutes = Math.floor((timeUp % 3600) / 60);
                        const seconds = timeUp % 60;
                        timeStr = `${hours}h ${minutes}m ${seconds}s`;
                    } else {
                        const minutes = Math.floor(timeUp / 60);
                        const seconds = timeUp % 60;
                        timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
                    }

                    const positionEmoji = index < 10 ? numberEmojis[index] : '';
                    text.textContent = `${positionEmoji} ${displayName}: ${timeStr}`;

                    const removeButton = document.createElement('button');
                    removeButton.textContent = '❌';
                    removeButton.style.background = 'none';
                    removeButton.style.border = 'none';
                    removeButton.style.color = 'white';
                    removeButton.style.fontSize = '14px';
                    removeButton.style.cursor = 'pointer';
                    removeButton.style.padding = '0';
                    removeButton.style.width = '20px';
                    removeButton.style.height = '20px';
                    removeButton.style.lineHeight = '20px';
                    removeButton.style.textAlign = 'center';
                    removeButton.title = `Remove ${displayName} from queue`;
                    removeButton.addEventListener('mouseover', () => removeButton.style.color = 'red');
                    removeButton.addEventListener('mouseout', () => removeButton.style.color = 'white');
                    removeButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        handQueue.delete(participantIndex);
                        activeHandRaises.delete(participantIndex);
                        updateQueueButtonVisibility();
                        updateHandQueueContent(queueContent);
                    });

                    entry.appendChild(text);
                    entry.appendChild(removeButton);
                    queueList.appendChild(entry);
                });

                queueContent.appendChild(queueList);
            }

            if (handRaiseDurations.length > 0) {
                const averageContainer = document.createElement('div');
                averageContainer.style.color = 'red';
                averageContainer.style.fontSize = '12px';
                averageContainer.style.marginTop = '10px';
                averageContainer.style.textAlign = 'right';

                const averageSeconds = handRaiseDurations.reduce((a, b) => a + b, 0) / handRaiseDurations.length;
                let avgStr;
                if (averageSeconds >= 3600) {
                    const hours = Math.floor(averageSeconds / 3600);
                    const minutes = Math.floor((averageSeconds % 3600) / 60);
                    const seconds = Math.floor(averageSeconds % 60);
                    avgStr = `${hours}h ${minutes}m ${seconds}s`;
                } else {
                    const minutes = Math.floor(averageSeconds / 60);
                    const seconds = Math.floor(averageSeconds % 60);
                    avgStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
                }
                averageContainer.textContent = `Average Wait: ${avgStr}`;

                queueContent.appendChild(averageContainer);
            }
        } catch (e) {}
    }

    function init() {
        try {
            transcriptButton = document.createElement('button');
            transcriptButton.textContent = '📜';
            transcriptButton.style.zIndex = '10001';
            transcriptButton.style.fontSize = '18px';
            transcriptButton.style.padding = '0';
            transcriptButton.style.backgroundColor = 'transparent';
            transcriptButton.style.border = '0.3px solid #40648085';
            transcriptButton.style.borderRadius = '50%';
            transcriptButton.style.width = '36px';
            transcriptButton.style.height = '36px';
            transcriptButton.style.cursor = 'pointer';
            transcriptButton.style.display = 'none';
            transcriptButton.style.lineHeight = '32px';
            transcriptButton.style.textAlign = 'center';
            transcriptButton.style.position = 'fixed';
            transcriptButton.style.color = 'white';
            transcriptButton.style.filter = 'grayscale(100%) brightness(200%)';
            transcriptButton.title = 'Transcript';

            transcriptButton.addEventListener('mouseover', () => transcriptButton.style.backgroundColor = '#595b5b40');
            transcriptButton.addEventListener('mouseout', () => transcriptButton.style.backgroundColor = 'transparent');
            transcriptButton.addEventListener('click', () => {
                const isVisible = transcriptPopup.style.display === 'block';
                transcriptPopup.style.display = isVisible ? 'none' : 'block';
                if (!isVisible) updateTranscriptPopup();
            });

            queueButton = document.createElement('button');
            queueButton.textContent = '✋';
            queueButton.style.zIndex = '10001';
            queueButton.style.fontSize = '18px';
            queueButton.style.padding = '0';
            queueButton.style.backgroundColor = 'transparent';
            queueButton.style.border = '0.3px solid #40648085';
            queueButton.style.borderRadius = '50%';
            queueButton.style.width = '36px';
            queueButton.style.height = '36px';
            queueButton.style.cursor = 'pointer';
            queueButton.style.display = 'none';
            queueButton.style.lineHeight = '32px';
            queueButton.style.textAlign = 'center';
            queueButton.style.position = 'fixed';
            queueButton.style.color = 'white';
            queueButton.style.filter = 'grayscale(100%) brightness(200%)';
            queueButton.title = 'View Speaking Queue';

            queueButton.addEventListener('mouseover', () => queueButton.style.backgroundColor = '#595b5b40');
            queueButton.addEventListener('mouseout', () => queueButton.style.backgroundColor = 'transparent');
            queueButton.addEventListener('click', () => {
                if (!handQueuePopup) {
                    handQueuePopup = document.createElement('div');
                    handQueuePopup.id = 'hand-queue-popup';
                    handQueuePopup.style.position = 'fixed';
                    handQueuePopup.style.backgroundColor = 'rgba(21, 32, 43, 0.8)';
                    handQueuePopup.style.borderRadius = '10px';
                    handQueuePopup.style.padding = '10px';
                    handQueuePopup.style.zIndex = '10003';
                    handQueuePopup.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
                    handQueuePopup.style.width = '200px';
                    handQueuePopup.style.maxHeight = '200px';
                    handQueuePopup.style.overflowY = 'auto';
                    handQueuePopup.style.color = 'white';
                    handQueuePopup.style.fontSize = '14px';
                    handQueuePopup.style.display = 'none';

                    const closeHandButton = document.createElement('button');
                    closeHandButton.textContent = 'X';
                    closeHandButton.style.position = 'sticky';
                    closeHandButton.style.top = '5px';
                    closeHandButton.style.right = '5px';
                    closeHandButton.style.float = 'right';
                    closeHandButton.style.background = 'none';
                    closeHandButton.style.border = 'none';
                    closeHandButton.style.color = 'white';
                    closeHandButton.style.fontSize = '14px';
                    closeHandButton.style.cursor = 'pointer';
                    closeHandButton.style.padding = '0';
                    closeHandButton.style.width = '20px';
                    closeHandButton.style.height = '20px';
                    closeHandButton.style.lineHeight = '20px';
                    closeHandButton.style.textAlign = 'center';
                    closeHandButton.addEventListener('mouseover', () => closeHandButton.style.color = 'red');
                    closeHandButton.addEventListener('mouseout', () => closeHandButton.style.color = 'white');
                    closeHandButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        handQueuePopup.style.display = 'none';
                    });

                    const queueContent = document.createElement('div');
                    queueContent.id = 'hand-queue-content';
                    queueContent.style.paddingTop = '10px';

                    handQueuePopup.appendChild(closeHandButton);
                    handQueuePopup.appendChild(queueContent);
                    document.body.appendChild(handQueuePopup);
                }

                handQueuePopup.style.display = handQueuePopup.style.display === 'block' ? 'none' : 'block';
                if (handQueuePopup.style.display === 'block') {
                    updateHandQueueContent(handQueuePopup.querySelector('#hand-queue-content'));
                    if (queueRefreshInterval) clearInterval(queueRefreshInterval);
                    queueRefreshInterval = setInterval(() => updateHandQueueContent(handQueuePopup.querySelector('#hand-queue-content')), 1000);
                } else if (queueRefreshInterval) {
                    clearInterval(queueRefreshInterval);
                    queueRefreshInterval = null;
                }
                updateVisibilityAndPosition();
            });

            transcriptPopup = document.createElement('div');
            transcriptPopup.style.position = 'fixed';
            transcriptPopup.style.bottom = '150px';
            transcriptPopup.style.right = '20px';
            transcriptPopup.style.backgroundColor = 'rgba(21, 32, 43, 0.9)';
            transcriptPopup.style.borderRadius = '10px';
            transcriptPopup.style.padding = '10px';
            transcriptPopup.style.zIndex = '10002';
            transcriptPopup.style.maxHeight = '400px';
            transcriptPopup.style.display = 'none';
            transcriptPopup.style.width = '306px';
            transcriptPopup.style.color = 'white';
            transcriptPopup.style.fontSize = '14px';
            transcriptPopup.style.lineHeight = '1.5';
            transcriptPopup.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
            transcriptPopup.style.display = 'flex';
            transcriptPopup.style.flexDirection = 'column';

            document.body.appendChild(queueButton);
            document.body.appendChild(transcriptButton);
            document.body.appendChild(transcriptPopup);

            loadSettings();

            function setupTitleObserver() {
                try {
                    const titleElement = document.querySelector('head > title');
                    if (titleElement) {
                        const titleObserver = new MutationObserver(() => {
                            if (document.title.toLowerCase().includes('this space has ended') && (captionsData.length > 0 || emojiReactions.length > 0)) {
                                currentSpaceId = null;
                                triggerAutoDownload();
                            }
                        });
                        titleObserver.observe(titleElement, { childList: true, characterData: true, subtree: true });
                    } else {
                        setTimeout(setupTitleObserver, 500);
                    }
                } catch (e) {}
            }
            setupTitleObserver();

            setInterval(() => {
                try {
                    if (document.title.toLowerCase().includes('this space has ended') && !hasDownloaded && (captionsData.length > 0 || emojiReactions.length > 0)) {
                        currentSpaceId = null;
                        triggerAutoDownload();
                    }
                } catch (e) {}
            }, 2000);

            const observer = new MutationObserver((mutationsList) => {
                try {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            updateVisibilityAndPosition();
                            const dropdown = document.querySelector('div[data-testid="Dropdown"]');
                            if (dropdown && dropdown.closest('[role="menu"]') && (captionsData.length > 0 || emojiReactions.length > 0)) {
                                addDownloadOptionToShareDropdown(dropdown);
                            }
                            const audioElements = document.querySelectorAll('audio');
                            audioElements.forEach(audio => {
                                if (audio.src && audio.src.includes('dynamic_playlist.m3u8?type=live')) dynamicUrl = audio.src;
                            });
                        }
                    }
                } catch (e) {}
            });

            observer.observe(document.body, { childList: true, subtree: true });
            updateVisibilityAndPosition();
            setInterval(updateVisibilityAndPosition, 2000);

            setInterval(() => {
                try {
                    const reactionToggle = document.querySelector('button svg path[d*="M17 12v3h-2.998v2h3v3h2v-3h3v-2h-3.001v-3H17"]');
                    const peopleButton = document.querySelector('button svg path[d*="M6.662 18H.846l.075-1.069"]');
                    const isInSpace = reactionToggle !== null || peopleButton !== null;
                    if (!hasDownloaded && (captionsData.length > 0 || emojiReactions.length > 0) && !isInSpace) {
                        triggerAutoDownload();
                    }
                } catch (e) {}
            }, 10000);
        } catch (e) {}
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
        });
    } else {
        init();
    }
})();