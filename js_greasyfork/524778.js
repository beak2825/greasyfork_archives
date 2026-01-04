// ==UserScript==
// @name         X Spaces + Combined (Transcript A + Emoji B)
// @namespace    Violentmonkey Scripts
// @version      1.9.38
// @description  Addon for X Spaces with custom emojis (Script B) and enhanced transcript (Script A). Supports toggling emoji visibility with 'showemojis'/'hideemojis' and flood mode with 'showflood'/'hideflood'. Includes speaker timer that resets for each speaker but resumes previous duration if they return within 15 seconds or is the most recent speaker. Moves transcript download, URL copying, and recording toggle to a settings dropdown.
// @author       x.com/blankspeaker and x.com/PrestonHenshawX (combined by Grok)
// @match        https://twitter.com/*
// @match        https://x.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524778/X%20Spaces%20%2B%20Combined%20%28Transcript%20A%20%2B%20Emoji%20B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/524778/X%20Spaces%20%2B%20Combined%20%28Transcript%20A%20%2B%20Emoji%20B%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const OrigWebSocket = window.WebSocket;
    const OrigXMLHttpRequest = window.XMLHttpRequest;
    const OriginalFetch = window.fetch;
    let myUserId = null;
    let captionsData = [];
    let emojiReactions = [];
    let currentSpaceId = null;
    let lastSpaceId = null;
    let handRaiseDurations = [];
    const activeHandRaises = new Map();
    const websocketMap = new Map();
    let dynamicUrl = '';
    let allowNewConnection = false;
    let selectedCustomEmoji = null;
    let currentFloodEmoji = null;
    let floodMode = false;
    let floodInterval = null;
    let durationSlider = null;
    let intervalSlider = null;
    let floodFeaturesVisible = false;
    let lastSpeaker = { username: '', handle: '' };
    let showEmojis = false;
    let timerInterval = null;
    let capturedCookie = null;
    let speakerTimer = 0;
    let speakerTimerInterval = null;
    const speakerHistory = new Map();
    let isReplayEnabled = false;
    const speakerSegments = [];

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
        '💼'
    ];

    const heartEmojis = ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤎'];
    const originalEmojis = ['😂', '😲', '😢', '💜', '💯', '👏', '✊', '👍', '👎', '👋'];
    const filteredCustomEmojis = customEmojis.filter(emoji => !originalEmojis.includes(emoji) && !heartEmojis.includes(emoji));

    const emojiMap = new Map();
    customEmojis.forEach((emoji, index) => {
        const originalEmoji = originalEmojis[index % originalEmojis.length];
        emojiMap.set(emoji, originalEmoji);
    });
    heartEmojis.forEach((emoji, index) => {
        const originalEmoji = originalEmojis[index % originalEmojis.length];
        emojiMap.set(emoji, originalEmoji);
    });

    async function fetchReplayUrl(dynUrl) {
        if (!dynUrl || !dynUrl.includes('/dynamic_playlist.m3u8?type=live')) return 'Invalid Dynamic URL';
        const masterUrl = dynUrl.replace('/dynamic_playlist.m3u8?type=live', '/master_playlist.m3u8');
        try {
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

    function updateTranscriptPopupImmediate() {
        updateTranscriptPopup();
    }

    window.WebSocket = function (url, protocols) {
        const ws = new OrigWebSocket(url, protocols);
        const originalSend = ws.send;
        let roomId = null;

        ws.send = function (data) {
            if (typeof data === 'string') {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.payload && typeof parsed.payload === 'string') {
                        try {
                            const payloadParsed = JSON.parse(parsed.payload);
                            if (payloadParsed.body && (selectedCustomEmoji || currentFloodEmoji)) {
                                const emojiToSend = currentFloodEmoji || selectedCustomEmoji;
                                const bodyParsed = JSON.parse(payloadParsed.body);
                                if (bodyParsed.type === 2) {
                                    bodyParsed.body = emojiToSend;
                                    payloadParsed.body = JSON.stringify(bodyParsed);
                                    parsed.payload = JSON.stringify(payloadParsed);
                                    data = JSON.stringify(parsed);
                                    if (parsed.sender?.user_id) myUserId = parsed.sender.user_id;
                                    const myDisplayName = parsed.sender?.display_name || 'Unknown';
                                    const myUsername = parsed.sender?.username || 'Unknown';
                                    const emojiReaction = {
                                        displayName: myDisplayName,
                                        handle: `@${myUsername}`,
                                        emoji: emojiToSend,
                                        timestamp: Date.now(),
                                        uniqueId: `${Date.now()}-${myUsername}-${emojiToSend}-${Date.now()}`
                                    };
                                    const isDuplicate = emojiReactions.some(e =>
                                        e.uniqueId === emojiReaction.uniqueId ||
                                        (e.displayName === emojiReaction.displayName &&
                                         e.emoji === emojiReaction.emoji &&
                                         Math.abs(e.timestamp - emojiReaction.timestamp) < 50)
                                    );
                                    if (!isDuplicate) {
                                        emojiReactions.push(emojiReaction);
                                        if (emojiReactions.length > 50) emojiReactions.shift();
                                        if (transcriptPopup?.style.display === 'block') {
                                            const captionsTab = transcriptPopup.querySelector('#captions-tab');
                                            if (captionsTab?.style.display === 'block') {
                                                updateTranscriptPopupImmediate();
                                            }
                                        }
                                    }
                                }
                            }
                        } catch (e) {}
                    }
                } catch (e) {}
                return originalSend.call(this, data);
            }
            return originalSend.call(this, data);
        };

        let originalOnMessage = null;
        ws.onmessage = function (event) {
            if (originalOnMessage) originalOnMessage.call(this, event);
            try {
                const message = JSON.parse(event.data);
                if (message.kind !== 1 || !message.payload) return;

                const payload = JSON.parse(message.payload);
                const body = payload.body ? JSON.parse(payload.body) : null;
                const payloadString = JSON.stringify(payload);

                if (payload.room && !roomId) {
                    roomId = payload.room;
                    if (!websocketMap.has(roomId)) websocketMap.set(roomId, new Set());
                    websocketMap.get(roomId).add(ws);
                }

                if (allowNewConnection && roomId) {
                    currentSpaceId = roomId;
                    if (roomId !== lastSpaceId) {
                        captionsData = [];
                        emojiReactions = [];
                        handRaiseDurations = [];
                        activeHandRaises.clear();
                        handQueue.clear();
                        lastSpeaker = { username: '', handle: '' };
                        lastRenderedCaptionCount = 0;
                        speakerTimer = 0;
                        speakerSegments.length = 0;
                        localStorage.removeItem(STORAGE_KEYS.SPEAKER_DURATIONS);
                        if (speakerTimerInterval) {
                            clearInterval(speakerTimerInterval);
                            speakerTimerInterval = null;
                        }
                        if (transcriptPopup) {
                            const captionWrapper = transcriptPopup.querySelector('#transcript-output');
                            if (captionWrapper) captionWrapper.innerHTML = '';
                        }
                    }
                    allowNewConnection = false;
                    lastSpaceId = currentSpaceId;
                    saveSettings();
                }

                if (roomId && roomId !== currentSpaceId) return;

                if (payloadString.includes('dynamic_playlist.m3u8?type=live')) {
                    const urlMatch = payloadString.match(/https:\/\/prod-fastly-[^/]+?\.video\.pscp\.tv\/[^"]+?dynamic_playlist\.m3u8\?type=live/);
                    if (urlMatch) dynamicUrl = urlMatch[0];
                }

                const participantIndex = body?.guestParticipantIndex || payload.sender?.participant_index || 'unknown';
                const displayName = payload.sender?.display_name || body?.displayName || 'Unknown';
                const handle = payload.sender?.username || body?.username || 'Unknown';
                const timestamp = message.timestamp / 1e6 || Date.now();

                if (body?.type === 40 && body?.guestBroadcastingEvent) {
                    let eventText = '';
                    const hostDisplayName = payload.sender?.display_name || 'Unknown';
                    const hostHandle = payload.sender?.username ? `@${payload.sender.username}` : 'Unknown';
                    const isHostDifferent = payload.sender?.username !== body?.guestUsername && payload.sender?.username !== undefined;

                    switch (body.guestBroadcastingEvent) {
                        case 1:
                            eventText = `${displayName} requested to speak`;
                            break;
                        case 2:
                            eventText = `${displayName} canceled their request to speak`;
                            break;
                        case 4:
                            eventText = `${displayName} (@${handle}) is no longer a speaker`;
                            break;
                        case 9:
                            eventText = `${displayName} (@${handle}) is now a speaker`;
                            break;
                        case 10:
                            if (isHostDifferent) {
                                eventText = `host: ${hostDisplayName} removed ${displayName} (@${handle}) as a speaker`;
                            } else if (!body.isHostMessage && payload.sender?.username === body?.guestUsername) {
                                eventText = `${displayName} (@${handle}) has been removed from speaker`;
                            }
                            break;
                        case 17:
                            // Handle unmute as hand lowering, no transcript message
                            if (activeHandRaises.has(participantIndex)) {
                                const startTime = activeHandRaises.get(participantIndex);
                                const duration = (timestamp - startTime) / 1000;
                                const sortedQueue = Array.from(handQueue.entries())
                                    .sort(([, a], [, b]) => a.timestamp - b.timestamp);
                                if (sortedQueue.length > 0 && sortedQueue[0][0] === participantIndex && duration >= 60) {
                                    handRaiseDurations.push(duration);
                                    if (handRaiseDurations.length > 50) handRaiseDurations.shift();
                                    saveSettings();
                                }
                                handQueue.delete(participantIndex);
                                activeHandRaises.delete(participantIndex);
                                if (transcriptPopup?.style.display === 'block') {
                                    const queueTab = transcriptPopup.querySelector('#queue-tab');
                                    if (queueTab?.style.display === 'block') {
                                        updateHandQueueContent(queueTab.querySelector('#hand-queue-content'));
                                    }
                                }
                            }
                            break;
                        case 18:
                            eventText = `host: ${displayName} muted all participants`;
                            break;
                        case 19:
                            eventText = `host: ${displayName} unmuted all participants`;
                            break;
                        case 20:
                            eventText = `${displayName} invited a new cohost`;
                            break;
                        case 21:
                            eventText = `${displayName} removed a cohost`;
                            break;
                        case 22:
                            eventText = `${displayName} became a cohost`;
                            break;
                        case 23:
                            // Do not set eventText to avoid transcript message
                            handQueue.set(participantIndex, { displayName, timestamp });
                            activeHandRaises.set(participantIndex, timestamp);
                            if (transcriptPopup?.style.display === 'block') {
                                const queueTab = transcriptPopup.querySelector('#queue-tab');
                                if (queueTab?.style.display === 'block') {
                                    updateHandQueueContent(queueTab.querySelector('#hand-queue-content'));
                                }
                            }
                            break;
                        case 24:
                            // Do not set eventText to avoid transcript message
                            if (activeHandRaises.has(participantIndex)) {
                                const startTime = activeHandRaises.get(participantIndex);
                                const duration = (timestamp - startTime) / 1000;
                                const sortedQueue = Array.from(handQueue.entries())
                                    .sort(([, a], [, b]) => a.timestamp - b.timestamp);
                                if (sortedQueue.length > 0 && sortedQueue[0][0] === participantIndex && duration >= 60) {
                                    handRaiseDurations.push(duration);
                                    if (handRaiseDurations.length > 50) handRaiseDurations.shift();
                                    saveSettings();
                                }
                                handQueue.delete(participantIndex);
                                activeHandRaises.delete(participantIndex);
                                if (transcriptPopup?.style.display === 'block') {
                                    const queueTab = transcriptPopup.querySelector('#queue-tab');
                                    if (queueTab?.style.display === 'block') {
                                        updateHandQueueContent(queueTab.querySelector('#hand-queue-content'));
                                    }
                                }
                            }
                            break;
                    }

                    if (eventText) {
                        const systemEvent = {
                            displayName: 'System',
                            handle: '',
                            text: eventText,
                            timestamp,
                            uniqueId: `${timestamp}-system-${body.guestBroadcastingEvent}-${handle}`
                        };

                        const isDuplicate = captionsData.some(existing =>
                            existing.displayName === systemEvent.displayName &&
                            existing.text === systemEvent.text &&
                            Math.abs(existing.timestamp - systemEvent.timestamp) < 1000
                        );

                        if (!isDuplicate) {
                            captionsData.push(systemEvent);
                            if (transcriptPopup?.style.display === 'block') {
                                const captionsTab = transcriptPopup.querySelector('#captions-tab');
                                if (captionsTab?.style.display === 'block') {
                                    updateTranscriptPopupImmediate();
                                }
                            }
                        }
                    }
                }

                if (body?.type === 45 && body?.body) {
                    const caption = {
                        displayName,
                        handle: `@${handle}`,
                        text: body.body,
                        timestamp,
                        uniqueId: `${timestamp}-${displayName}-${handle}-${body.body}`,
                        room: roomId
                    };
                    const isDuplicate = captionsData.some(c => c.uniqueId === caption.uniqueId);
                    const lastCaption = captionsData[captionsData.length - 1];
                    const isDifferentText = !lastCaption || lastCaption.text !== caption.text;
                    if (!isDuplicate && isDifferentText) {
                        if (activeHandRaises.has(participantIndex)) {
                            const startTime = activeHandRaises.get(participantIndex);
                            const duration = (timestamp - startTime) / 1000;
                            const sortedQueue = Array.from(handQueue.entries())
                                .sort(([, a], [, b]) => a.timestamp - b.timestamp);
                            if (sortedQueue.length > 0 && sortedQueue[0][0] === participantIndex && duration >= 60) {
                                handRaiseDurations.push(duration);
                                if (handRaiseDurations.length > 50) handRaiseDurations.shift();
                                saveSettings();
                                const handLowerEvent = {
                                    displayName: 'System',
                                    handle: '',
                                    text: `${displayName} (@${handle}) lowered their hand (started speaking)`,
                                    timestamp,
                                    uniqueId: `${timestamp}-handlower-speaking-${participantIndex}`
                                };
                                captionsData.push(handLowerEvent);
                            }
                            handQueue.delete(participantIndex);
                            activeHandRaises.delete(participantIndex);
                            if (transcriptPopup?.style.display === 'block') {
                                const queueTab = transcriptPopup.querySelector('#queue-tab');
                                if (queueTab?.style.display === 'block') {
                                    updateHandQueueContent(queueTab.querySelector('#hand-queue-content'));
                                }
                            }
                        }
                        captionsData.push(caption);

                        if (displayName !== 'System') {
                            const currentSpeakerKey = `${displayName}-${handle}`;
                            const now = Date.now();
                            const previousSpeakerKey = lastSpeaker.username && lastSpeaker.handle ? `${lastSpeaker.username}-${lastSpeaker.handle}` : null;

                            let speakerDurations = JSON.parse(localStorage.getItem(STORAGE_KEYS.SPEAKER_DURATIONS) || '{}');

                            for (const key in speakerDurations) {
                                if (now - speakerDurations[key].lastActive > 30000) {
                                    delete speakerDurations[key];
                                }
                            }

                            const newSegment = {
                                displayName,
                                handle,
                                startTime: now,
                                endTime: now,
                                duration: 0
                            };
                            speakerSegments.push(newSegment);

                            let initialTimerValue = 0;
                            const lastSegment = speakerSegments[speakerSegments.length - 2];
                            const isRecentSpeaker = speakerDurations[currentSpeakerKey] && (now - speakerDurations[currentSpeakerKey].lastActive <= 8000);
                            const isMostRecentSpeaker = lastSegment && lastSegment.displayName === displayName && lastSegment.handle === `@${handle}`;

                            if (isRecentSpeaker || isMostRecentSpeaker) {
                                initialTimerValue = speakerDurations[currentSpeakerKey]?.duration || 0;
                            }

                            speakerTimer = initialTimerValue;
                            lastSpeaker = { username: displayName, handle: `@${handle}` };
                            if (speakerTimerInterval) {
                                clearInterval(speakerTimerInterval);
                            }
                            speakerTimerInterval = setInterval(() => {
                                speakerTimer++;
                                speakerDurations[currentSpeakerKey] = {
                                    displayName,
                                    handle: `@${handle}`,
                                    duration: speakerTimer,
                                    lastActive: Date.now()
                                };
                                localStorage.setItem(STORAGE_KEYS.SPEAKER_DURATIONS, JSON.stringify(speakerDurations));
                                updateTitleBar();
                            }, 1000);

                            speakerDurations[currentSpeakerKey] = {
                                displayName,
                                handle: `@${handle}`,
                                duration: speakerTimer,
                                lastActive: now
                            };
                            localStorage.setItem(STORAGE_KEYS.SPEAKER_DURATIONS, JSON.stringify(speakerDurations));

                            while (speakerSegments.length > 0 && now - speakerSegments[0].startTime > 60000) {
                                speakerSegments.shift();
                            }

                            speakerHistory.set(currentSpeakerKey, now);
                        }

                        if (transcriptPopup?.style.display === 'block') {
                            updateTitleBar();
                            const captionsTab = transcriptPopup.querySelector('#captions-tab');
                            if (captionsTab?.style.display === 'block') updateTranscriptPopupImmediate();
                        }
                    }
                }

                if (body?.type === 2 && body.body) {
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
                        if (emojiReactions.length > 50) emojiReactions.shift();
                        if (transcriptPopup?.style.display === 'block') {
                            const captionsTab = transcriptPopup.querySelector('#captions-tab');
                            if (captionsTab?.style.display === 'block') updateTranscriptPopupImmediate();
                        }
                    }
                }
            } catch (e) {}
        };

        Object.defineProperty(ws, 'onmessage', {
            set: function (callback) { originalOnMessage = callback; },
            get: function () { return ws.onmessage; }
        });

        ws.onclose = function () {
            if (roomId && websocketMap.has(roomId)) {
                websocketMap.get(roomId).delete(ws);
                if (websocketMap.get(roomId).size === 0) websocketMap.delete(roomId);
            }
        };

        ws.onerror = function (error) {};

        return ws;
    };

    window.XMLHttpRequest = function () {
        const xhr = new OrigXMLHttpRequest();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;

        xhr.open = function (method, url, async, user, password) {
            if (typeof url === 'string' && url.includes('dynamic_playlist.m3u8?type=live')) dynamicUrl = url;
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
            return originalSend.apply(this, arguments);
        };

        return xhr;
    };

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
        return OriginalFetch.apply(this, arguments);
    };

    let transcriptPopup = null;
    let settingsDropdown = null;
    let transcriptButton = null;
    let settingsButton = null;
    let queueRefreshInterval = null;
    const handQueue = new Map();
    let lastSpaceState = false;

    const STORAGE_KEYS = {
        LAST_SPACE_ID: 'xSpacesCustomReactions_lastSpaceId',
        HAND_DURATIONS: 'xSpacesCustomReactions_handRaiseDurations',
        TEXT_SIZE: 'xSpacesCustomReactions_textSize',
        FLOOD_SETTINGS: 'xSpacesCustomReactions_floodSettings',
        SHOW_EMOJIS: 'xSpacesCustomReactions_showEmojis',
        FLOOD_VISIBLE: 'xSpacesCustomReactions_floodVisible',
        REPLAY_ENABLED: 'xSpacesCustomReactions_replayEnabled',
        SPEAKER_DURATIONS: 'xSpacesCustomReactions_speakerDurations'
    };

    function saveSettings() {
        localStorage.setItem(STORAGE_KEYS.LAST_SPACE_ID, currentSpaceId || '');
        localStorage.setItem(STORAGE_KEYS.HAND_DURATIONS, JSON.stringify(handRaiseDurations));
        localStorage.setItem(STORAGE_KEYS.SHOW_EMOJIS, JSON.stringify(showEmojis));
        localStorage.setItem(STORAGE_KEYS.FLOOD_VISIBLE, JSON.stringify(floodFeaturesVisible));
        localStorage.setItem(STORAGE_KEYS.REPLAY_ENABLED, JSON.stringify(isReplayEnabled));
        const floodSettings = {
            duration: durationSlider ? durationSlider.value : '1',
            interval: intervalSlider ? intervalSlider.value : '4',
            floodMode: floodMode
        };
        localStorage.setItem(STORAGE_KEYS.FLOOD_SETTINGS, JSON.stringify(floodSettings));
    }

    function loadSettings() {
        lastSpaceId = localStorage.getItem(STORAGE_KEYS.LAST_SPACE_ID) || null;
        const savedDurations = localStorage.getItem(STORAGE_KEYS.HAND_DURATIONS);
        if (savedDurations) handRaiseDurations = JSON.parse(savedDurations);
        const savedShowEmojis = localStorage.getItem(STORAGE_KEYS.SHOW_EMOJIS);
        showEmojis = savedShowEmojis ? JSON.parse(savedShowEmojis) : false;
        const savedFloodVisible = localStorage.getItem(STORAGE_KEYS.FLOOD_VISIBLE);
        floodFeaturesVisible = savedFloodVisible ? JSON.parse(savedFloodVisible) : false;
        const savedReplayEnabled = localStorage.getItem(STORAGE_KEYS.REPLAY_ENABLED);
        isReplayEnabled = savedReplayEnabled ? JSON.parse(savedReplayEnabled) : false;
        const savedFloodSettings = localStorage.getItem(STORAGE_KEYS.FLOOD_SETTINGS);
        if (savedFloodSettings) {
            const settings = JSON.parse(savedFloodSettings);
            if (durationSlider) durationSlider.value = settings.duration || '1';
            if (intervalSlider) intervalSlider.value = settings.interval || '4';
            floodMode = settings.floodMode || false;
        }
    }

    function hideOriginalEmojiButtons() {
        const originalButtons = document.querySelectorAll('.css-175oi2r.r-1awozwy.r-18u37iz.r-9aw3ui.r-1777fci.r-tuq35u > div > button');
        originalButtons.forEach(button => {
            button.style.display = 'none';
        });
    }

    function createEmojiPickerGrid() {
        const emojiPicker = document.querySelector('.css-175oi2r.r-1awozwy.r-18u37iz.r-9aw3ui.r-1777fci.r-tuq35u');
        if (!emojiPicker || emojiPicker.querySelector('.emoji-grid-container')) return;

        hideOriginalEmojiButtons();

        const customPickerWrapper = document.createElement('div');
        customPickerWrapper.style.display = 'block';
        customPickerWrapper.style.width = '100%';

        const gridContainer = document.createElement('div');
        gridContainer.className = 'emoji-grid-container';
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = 'repeat(5, 1fr)';
        gridContainer.style.gap = '10px';
        gridContainer.style.padding = '10px';

        const fragment = document.createDocumentFragment();

        customEmojis.forEach((emoji) => {
            const emojiButton = document.createElement('button');
            emojiButton.setAttribute('aria-label', `React with ${emoji}`);
            emojiButton.className = 'css-175oi2r r-1awozwy r-z2wwpe r-6koalj r-18u37iz r-1w6e6rj r-a2tzq0 r-tuq35u r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l';
            emojiButton.type = 'button';
            emojiButton.style.margin = '5px';

            const emojiDiv = document.createElement('div');
            emojiDiv.dir = 'ltr';
            emojiDiv.className = 'css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-1blvdjr r-vrz42v r-16dba41';
            emojiDiv.style.color = 'rgb(231, 233, 234)';
            const emojiImg = document.createElement('img');
            emojiImg.alt = emoji;
            emojiImg.draggable = false;
            emojiImg.src = `https://abs-0.twimg.com/emoji/v2/svg/${emoji.codePointAt(0).toString(16)}.svg`;
            emojiImg.title = emoji;
            emojiImg.className = 'r-4qtqp9 r-dflpy8 r-k4bwe5 r-1kpi4qh r-pp5qcn r-h9hxbl';
            emojiDiv.appendChild(emojiImg);
            emojiButton.appendChild(emojiDiv);

            emojiButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const originalEmoji = emojiMap.get(emoji);
                if (floodMode && floodFeaturesVisible) {
                    if (floodInterval && selectedCustomEmoji === emoji) stopFlood();
                    else {
                        selectedCustomEmoji = emoji;
                        startFlood(emoji, originalEmoji, false, false);
                    }
                } else {
                    selectedCustomEmoji = emoji;
                    currentFloodEmoji = null;
                    if (originalEmoji) sendEmoji(originalEmoji);
                }
            });

            fragment.appendChild(emojiButton);
        });

        const separator = document.createElement('div');
        separator.style.gridColumn = '1 / -1';
        separator.style.height = '1px';
        separator.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        separator.style.margin = '5px 0';
        separator.style.display = floodFeaturesVisible ? 'block' : 'none';
        separator.className = 'flood-separator';

        const floodContainer = document.createElement('div');
        floodContainer.style.gridColumn = '1 / -1';
        floodContainer.style.display = floodFeaturesVisible ? 'flex' : 'none';
        floodContainer.style.alignItems = 'center';
        floodContainer.style.gap = '10px';
        floodContainer.style.paddingTop = '5px';
        floodContainer.className = 'flood-container';

        const heartFloodButton = document.createElement('button');
        heartFloodButton.setAttribute('aria-label', 'Heart Flood');
        heartFloodButton.className = 'css-175oi2r r-1awozwy r-z2wwpe r-6koalj r-18u37iz r-1w6e6rj r-a2tzq0 r-tuq35u r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l';
        heartFloodButton.type = 'button';
        heartFloodButton.style.margin = '0';
        const heartDiv = document.createElement('div');
        heartDiv.dir = 'ltr';
        heartDiv.className = 'css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-1blvdjr r-vrz42v r-16dba41';
        heartDiv.style.color = 'rgb(231, 233, 234)';
        const heartImg = document.createElement('img');
        heartImg.alt = '💕';
        heartImg.draggable = false;
        heartImg.src = 'https://abs-0.twimg.com/emoji/v2/svg/1f495.svg';
        heartImg.title = 'Heart Flood';
        heartImg.className = 'r-4qtqp9 r-dflpy8 r-k4bwe5 r-1kpi4qh r-pp5qcn r-h9hxbl';
        heartDiv.appendChild(heartImg);
        heartFloodButton.appendChild(heartDiv);
        heartFloodButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (floodInterval && selectedCustomEmoji === 'heartFlood') stopFlood();
            else {
                floodMode = true;
                selectedCustomEmoji = 'heartFlood';
                startFlood(null, null, true, false);
                updateFloodToggleAppearance();
            }
        });

        const allEmojiFloodButton = document.createElement('button');
        allEmojiFloodButton.setAttribute('aria-label', 'All Emoji Flood');
        allEmojiFloodButton.className = 'css-175oi2r r-1awozwy r-z2wwpe r-6koalj r-18u37iz r-1w6e6rj r-a2tzq0 r-tuq35u r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l';
        allEmojiFloodButton.type = 'button';
        allEmojiFloodButton.style.margin = '0';
        const allEmojiDiv = document.createElement('div');
        allEmojiDiv.dir = 'ltr';
        allEmojiDiv.className = 'css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-1blvdjr r-vrz42v r-16dba41';
        allEmojiDiv.style.color = 'rgb(231, 233, 234)';
        const allEmojiImg = document.createElement('img');
        allEmojiImg.alt = '🎆';
        allEmojiImg.draggable = false;
        allEmojiImg.src = 'https://abs-0.twimg.com/emoji/v2/svg/1f386.svg';
        allEmojiImg.title = 'All Emoji Flood';
        allEmojiImg.className = 'r-4qtqp9 r-dflpy8 r-k4bwe5 r-1kpi4qh r-pp5qcn r-h9hxbl';
        allEmojiDiv.appendChild(allEmojiImg);
        allEmojiFloodButton.appendChild(allEmojiDiv);
        allEmojiFloodButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (floodInterval && selectedCustomEmoji === 'allEmojiFlood') stopFlood();
            else {
                floodMode = true;
                selectedCustomEmoji = 'allEmojiFlood';
                startFlood(null, null, false, true);
                updateFloodToggleAppearance();
            }
        });

        floodContainer.appendChild(heartFloodButton);
        floodContainer.appendChild(allEmojiFloodButton);
        fragment.appendChild(separator);
        fragment.appendChild(floodContainer);

        gridContainer.appendChild(fragment);
        customPickerWrapper.appendChild(gridContainer);

        const controlsContainer = document.createElement('div');
        controlsContainer.style.display = floodFeaturesVisible ? 'flex' : 'none';
        controlsContainer.style.alignItems = 'center';
        controlsContainer.style.gap = '10px';
        controlsContainer.style.padding = '5px 10px';
        controlsContainer.style.borderTop = '1px solid rgba(255, 255, 255, 0.3)';
        controlsContainer.style.width = '100%';
        controlsContainer.style.boxSizing = 'border-box';
        controlsContainer.className = 'flood-controls';

        const floodToggle = document.createElement('button');
        floodToggle.textContent = '⚡';
        floodToggle.style.fontSize = '16px';
        floodToggle.style.background = 'none';
        floodToggle.style.border = 'none';
        floodToggle.style.cursor = 'pointer';
        floodToggle.style.color = floodMode ? 'rgb(231, 233, 234)' : 'rgba(231, 233, 234, 0.5)';
        floodToggle.title = 'Toggle Flood Mode';
        floodToggle.addEventListener('click', () => {
            floodMode = !floodMode;
            if (!floodMode && floodInterval) stopFlood();
            updateFloodToggleAppearance();
            saveSettings();
        });
        controlsContainer.appendChild(floodToggle);

        const durationContainer = document.createElement('div');
        durationContainer.style.display = 'flex';
        durationContainer.style.flexDirection = 'column';
        const durationLabel = document.createElement('div');
        durationLabel.style.fontSize = '10px';
        durationLabel.style.color = 'rgba(231, 233, 234, 0.8)';
        durationContainer.appendChild(durationLabel);
        durationSlider = document.createElement('input');
        durationSlider.type = 'range';
        durationSlider.min = '0';
        durationSlider.max = '5';
        durationSlider.style.width = '80px';
        durationSlider.addEventListener('input', () => {
            const durationOptions = ['∞', '5s', '10s', '20s', '30s', '60s'];
            durationLabel.textContent = `Duration: ${durationOptions[durationSlider.value]}`;
            saveSettings();
        });
        durationContainer.appendChild(durationSlider);

        const intervalContainer = document.createElement('div');
        intervalContainer.style.display = 'flex';
        intervalContainer.style.flexDirection = 'column';
        const intervalLabel = document.createElement('div');
        intervalLabel.style.fontSize = '10px';
        intervalLabel.style.color = 'rgba(231, 233, 234, 0.8)';
        intervalContainer.appendChild(intervalLabel);
        intervalSlider = document.createElement('input');
        intervalSlider.type = 'range';
        intervalSlider.min = '0';
        intervalSlider.max = '7';
        intervalSlider.style.width = '80px';
        intervalSlider.addEventListener('input', () => {
            const intervalOptions = ['1ms', '100ms', '200ms', '500ms', '1s', '2s', '3s', '5s'];
            intervalLabel.textContent = `Interval: ${intervalOptions[intervalSlider.value]}`;
            saveSettings();
        });
        intervalContainer.appendChild(intervalSlider);

        controlsContainer.appendChild(durationContainer);
        controlsContainer.appendChild(intervalContainer);
        customPickerWrapper.appendChild(controlsContainer);

        emojiPicker.appendChild(customPickerWrapper);

        loadSettings();
        const durationOptions = ['∞', '5s', '10s', '20s', '30s', '60s'];
        const intervalOptions = ['1ms', '100ms', '200ms', '500ms', '1s', '2s', '3s', '5s'];
        durationLabel.textContent = `Duration: ${durationOptions[durationSlider.value]}`;
        intervalLabel.textContent = `Interval: ${intervalOptions[intervalSlider.value]}`;
        updateFloodToggleAppearance();
    }

    function updateFloodToggleAppearance() {
        const floodToggle = document.querySelector('button[title="Toggle Flood Mode"]');
        if (floodToggle) floodToggle.style.color = floodMode ? 'rgb(231, 233, 234)' : 'rgba(231, 233, 234, 0.5)';
    }

    function updateFloodOverlayPosition() {
        const overlay = document.getElementById('flood-overlay');
        if (!overlay) return;

        if (floodInterval && transcriptButton && transcriptButton.style.display !== 'none') {
            overlay.style.display = 'block';
            const rect = transcriptButton.getBoundingClientRect();
            overlay.style.left = `${rect.right + window.scrollX + 68}px`;
            overlay.style.top = `${rect.top + window.scrollY + (rect.height / 2) - (overlay.offsetHeight / 2)}px`;
        } else {
            overlay.style.display = 'none';
        }
    }

    function startFlood(emoji, originalEmoji, isHeartFlood = false, isAllFlood = false) {
        if (floodInterval) stopFlood();

        const intervalOptions = [1, 100, 200, 500, 1000, 2000, 3000, 5000];
        const durationOptions = [0, 5000, 10000, 20000, 30000, 60000];
        const adjustedDurationOptions = durationOptions.map(d => d > 0 ? d - 500 : d);

        const intervalValue = intervalOptions[parseInt(intervalSlider.value, 10)];
        const duration = adjustedDurationOptions[parseInt(durationSlider.value, 10)];

        let index = 0;
        const sendNextEmoji = () => {
            if (isHeartFlood) {
                currentFloodEmoji = heartEmojis[index % heartEmojis.length];
                sendEmoji(emojiMap.get(currentFloodEmoji));
            } else if (isAllFlood) {
                currentFloodEmoji = filteredCustomEmojis[index % filteredCustomEmojis.length];
                sendEmoji(emojiMap.get(currentFloodEmoji));
            } else {
                currentFloodEmoji = emoji;
                sendEmoji(originalEmoji);
            }
            index++;
        };

        sendNextEmoji();
        floodInterval = setInterval(sendNextEmoji, intervalValue);
        updateFloodOverlayPosition();

        if (duration > 0) setTimeout(() => stopFlood(), duration);
    }

    function stopFlood() {
        if (floodInterval) {
            clearInterval(floodInterval);
            floodInterval = null;
        }
        selectedCustomEmoji = null;
        currentFloodEmoji = null;
        updateFloodOverlayPosition();
        updateFloodToggleAppearance();
    }

    function sendEmoji(originalEmoji) {
        const originalPicker = document.querySelector('.css-175oi2r.r-1awozwy.r-18u37iz.r-9aw3ui.r-1777fci.r-tuq35u');
        if (!originalPicker) {
            const reactionToggle = document.querySelector('button svg path[d="M17 12v3h-2.998v2h3v3h2v-3h3v-2h-3.001v-3H17zm-5 6.839c-3.871-2.34-6.053-4.639-7.127-6.609-1.112-2.04-1.031-3.7-.479-4.82.561-1.13 1.667-1.84 2.91-1.91 1.222-.06 2.68.51 3.892 2.16l.806 1.09.805-1.09c1.211-1.65 2.668-2.22 3.89-2.16 1.242.07 2.347.78 2.908 1.91.334.677.49 1.554.321 2.59h2.011c.153-1.283-.039-2.469-.539-3.48-.887-1.79-2.647-2.91-4.601-3.01-1.65-.09-3.367.56-4.796 2.01-1.43-1.45-3.147-2.1-4.798-2.01-1.954.1-3.714 1.22-4.601 3.01-.896 1.81-.846 4.17.514 6.67 1.353 2.48 4.003 5.12 8.382 7.67l.502.299v-2.32z"]');
            if (reactionToggle) {
                const toggleButton = reactionToggle.closest('button');
                if (toggleButton) {
                    toggleButton.click();
                    setTimeout(() => {
                        const picker = document.querySelector('.css-175oi2r.r-1awozwy.r-18u37iz.r-9aw3ui.r-1777fci.r-tuq35u');
                        if (picker && originalEmoji) {
                            const originalButton = Array.from(picker.querySelectorAll('button[aria-label^="React with"]'))
                                .find(button => button.querySelector('img')?.alt === originalEmoji);
                            if (originalButton) originalButton.click();
                        }
                    }, 200);
                }
            }
        } else if (originalEmoji) {
            const originalButton = Array.from(originalPicker.querySelectorAll('button[aria-label^="React with"]'))
                .find(button => button.querySelector('img')?.alt === originalEmoji);
            if (originalButton) originalButton.click();
        }
    }

    function isButtonOverlapping(left, top) {
        const elements = document.elementsFromPoint(left + 18, top + 18); // Center of the 36x36 button
        return elements.some(el => el.tagName === 'BUTTON' && el !== transcriptButton && el !== settingsButton);
    }

    function updateVisibilityAndPosition() {
        const reactionToggle = document.querySelector('button svg path[d="M17 12v3h-2.998v2h3v3h2v-3h3v-2h-3.001v-3H17zm-5 6.839c-3.871-2.34-6.053-4.639-7.127-6.609-1.112-2.04-1.031-3.7-.479-4.82.561-1.13 1.667-1.84 2.91-1.91 1.222-.06 2.68.51 3.892 2.16l.806 1.09.805-1.09c1.211-1.65 2.668-2.22 3.89-2.16 1.242.07 2.347.78 2.908 1.91.334.677.49 1.554.321 2.59h2.011c.153-1.283-.039-2.469-.539-3.48-.887-1.79-2.647-2.91-4.601-3.01-1.65-.09-3.367.56-4.796 2.01-1.43-1.45-3.147-2.1-4.798-2.01-1.954.1-3.714 1.22-4.601 3.01-.896 1.81-.846 4.17.514 6.67 1.353 2.48 4.003 5.12 8.382 7.67l.502.299v-2.32z"]');
        const peopleButton = document.querySelector('button svg path[d="M6.662 18H.846l.075-1.069C1.33 11.083 4.335 9 7.011 9c1.416 0 2.66.547 3.656 1.53-1.942 1.373-3.513 3.758-4.004 7.47zM7 8c1.657 0 3-1.346 3-3S8.657 2 7 2 4 3.346 4 5s1.343 3 3 3zm10.616 1.27C18.452 8.63 19 7.632 19 6.5 19 4.57 17.433 3 15.5 3S12 4.57 12 6.5c0 1.132.548 2.13 1.384 2.77.589.451 1.317.73 2.116.73s1.527-.279 2.116-.73zM8.501 19.972l-.029 1.027h14.057l-.029-1.027c-.184-6.618-3.736-8.977-7-8.977s-6.816 2.358-7 8.977z"]');
        const shareButton = document.querySelector('button[aria-label="Share"] svg path[d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"]');
        const endScreenShareIcon = document.querySelector('svg path[d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"]');
        const isInSpace = reactionToggle !== null || peopleButton !== null;
        const isEndScreen = !isInSpace && endScreenShareIcon !== null;

        if (isInSpace && !lastSpaceState) {
            if (currentSpaceId !== lastSpaceId) {
                for (const [oldRoomId, wsSet] of websocketMap) {
                    if (oldRoomId !== currentSpaceId) {
                        wsSet.forEach(ws => ws.close());
                        websocketMap.delete(oldRoomId);
                    }
                }
                handQueue.clear();
                activeHandRaises.clear();
                if (transcriptPopup?.style.display === 'block') updateTranscriptPopupImmediate();
            }
        } else if (!isInSpace && lastSpaceState && !isEndScreen) {
            saveSettings();
            activeHandRaises.clear();
            if (speakerTimerInterval) {
                clearInterval(speakerTimerInterval);
                speakerTimerInterval = null;
                speakerTimer = 0;
            }
            speakerHistory.clear();
        }

        if (isInSpace || isEndScreen) {
            if (peopleButton) {
                const peopleBtn = peopleButton.closest('button');
                if (peopleBtn) {
                    const rect = peopleBtn.getBoundingClientRect();
                    transcriptButton.style.position = 'fixed';
                    transcriptButton.style.left = `${rect.left - 52}px`;
                    transcriptButton.style.top = `${rect.top}px`;
                    transcriptButton.style.display = 'block';
                }
            } else {
                transcriptButton.style.display = 'none';
            }

            if (shareButton || endScreenShareIcon) {
                const targetElement = shareButton ? shareButton.closest('button') : endScreenShareIcon.closest('div');
                if (targetElement) {
                    const rect = targetElement.getBoundingClientRect();
                    let offsetLeft = rect.left - 40; // Default 40px to the left
                    const buttonTop = rect.top;

                    // Check for overlap at the default position
                    if (isButtonOverlapping(offsetLeft, buttonTop)) {
                        offsetLeft -= 32; // Move an additional 32px left (total 72px)
                    }

                    settingsButton.style.position = 'fixed';
                    settingsButton.style.left = `${offsetLeft}px`;
                    settingsButton.style.top = `${buttonTop}px`;
                    settingsButton.style.display = 'block';
                }
            } else {
                settingsButton.style.display = 'none';
            }

            if (reactionToggle) {
                const reactionButton = reactionToggle.closest('button');
                if (reactionButton) reactionButton.style.opacity = '100';
                createEmojiPickerGrid();
            }
        } else {
            transcriptButton.style.display = 'none';
            settingsButton.style.display = 'none';
            if (transcriptPopup) transcriptPopup.style.display = 'none';
            if (settingsDropdown) settingsDropdown.style.display = 'none';
            if (queueRefreshInterval) {
                clearInterval(queueRefreshInterval);
                queueRefreshInterval = null;
            }
            if (floodInterval) stopFlood();
        }

        lastSpaceState = isInSpace;
    }

    function formatTranscriptForDownload() {
        let transcriptText = '';
        let previousSpeaker = { username: '', handle: '' };
        const captionData = captionsData.sort((a, b) => a.timestamp - b.timestamp);

        captionData.forEach((item, i) => {
            let { displayName, handle } = item;
            if (displayName === 'Unknown' && previousSpeaker.username) {
                displayName = previousSpeaker.username;
                handle = previousSpeaker.handle;
            }
            if (i > 0 && previousSpeaker.username !== displayName) {
                transcriptText += '\n----------------------------------------\n';
            }
            transcriptText += `${displayName} ${handle}\n${item.text}\n\n`;
            previousSpeaker = { username: displayName, handle };
        });
        return transcriptText;
    }

    let lastRenderedCaptionCount = 0;
    let isUserScrolledUp = false;
    let currentFontSize = 14;
    let searchTerm = '';

    function filterTranscript(captions, emojis, term) {
        if (!term) return { captions, emojis: showEmojis ? emojis : [] };
        const lowerTerm = term.toLowerCase();
        return {
            captions: captions.filter(caption =>
                caption.text.toLowerCase().includes(lowerTerm) ||
                caption.displayName.toLowerCase().includes(lowerTerm) ||
                caption.handle.toLowerCase().includes(lowerTerm)
            ),
            emojis: showEmojis ? emojis.filter(emoji =>
                emoji.emoji.toLowerCase().includes(lowerTerm) ||
                emoji.displayName.toLowerCase().includes(lowerTerm) ||
                emoji.handle.toLowerCase().includes(lowerTerm)
            ) : []
        };
    }

    async function toggleRecording(isEnabled) {
        if (!capturedCookie || !currentSpaceId) return false;

        const payload = {
            topics: [],
            is_space_available_for_clipping: false,
            cookie: capturedCookie,
            is_space_available_for_replay: isEnabled,
            locale: "en",
            replay_start_time: 0,
            no_incognito: false,
            replay_edited_title: "",
            replay_thumbnail_time_code: 0,
            broadcast_id: currentSpaceId
        };

        try {
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

    function updateTitleBar() {
        if (!transcriptPopup || transcriptPopup.style.display !== 'block') return;

        const titleBar = transcriptPopup.querySelector('#transcript-title-bar');
        if (!titleBar) return;

        const spaceTitleContainer = document.querySelector('div[data-testid="tweetText"]');
        let spaceTitle = 'Untitled Space';
        if (spaceTitleContainer) {
            const titleSpans = spaceTitleContainer.querySelectorAll('span.css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3');
            spaceTitle = Array.from(titleSpans)
                .map(span => span.textContent)
                .join(' ')
                .trim();
        }
        const currentSpeaker = lastSpeaker.username || 'No Speaker';

        let timerText = '0s';
        if (speakerTimer >= 3600) {
            const hours = Math.floor(speakerTimer / 3600);
            const minutes = Math.floor((speakerTimer % 3600) / 60);
            const seconds = speakerTimer % 60;
            timerText = `${hours}h ${minutes}m ${seconds}s`;
        } else if (speakerTimer >= 60) {
            const minutes = Math.floor(speakerTimer / 60);
            const seconds = speakerTimer % 60;
            timerText = `${minutes}m ${seconds}s`;
        } else {
            timerText = `${speakerTimer}s`;
        }

        const titleText = titleBar.querySelector('#transcript-title-text');
        const speakerText = titleBar.querySelector('#transcript-speaker-text');
        const timerDisplay = titleBar.querySelector('#transcript-timer-display');

        if (titleText) {
            titleText.textContent = spaceTitle;
        }

        if (speakerText && !timerDisplay) {
            const speakerTextWrapper = speakerText.parentElement;
            speakerText.textContent = currentSpeaker;

            const timerSpan = document.createElement('span');
            timerSpan.id = 'transcript-timer-display';
            timerSpan.style.fontSize = '14px';
            timerSpan.style.color = '#00FF00';
            timerSpan.style.marginLeft = '10px';
            timerSpan.textContent = timerText;
            speakerTextWrapper.appendChild(timerSpan);
        } else if (timerDisplay) {
            speakerText.textContent = currentSpeaker;
            timerDisplay.textContent = timerText;
        }

        const titleBarHeight = titleBar.offsetHeight;
        const baseHeight = 470;
        const controlsHeight = transcriptPopup.querySelector('.controls-container')?.offsetHeight || 40;
        const newMaxHeight = baseHeight + Math.max(0, titleBarHeight - 60);
        transcriptPopup.style.maxHeight = `${newMaxHeight}px`;
        const scrollArea = transcriptPopup.querySelector('#transcript-scrollable');
        if (scrollArea) scrollArea.style.maxHeight = `${newMaxHeight - titleBarHeight - controlsHeight - 20}px`;
    }

    const debouncedUpdateTranscriptPopup = debounce(updateTranscriptPopup, 2000);

    function updateTranscriptPopup() {
        if (!transcriptPopup) return;

        let titleBar = transcriptPopup.querySelector('#transcript-title-bar');
        let scrollArea = transcriptPopup.querySelector('#transcript-scrollable');
        let captionsTab = transcriptPopup.querySelector('#captions-tab');
        let queueTab = transcriptPopup.querySelector('#queue-tab');

        if (!titleBar || !scrollArea || !captionsTab || !queueTab) {
            transcriptPopup.innerHTML = '';

            titleBar = document.createElement('div');
            titleBar.id = 'transcript-title-bar';
            titleBar.style.position = 'sticky';
            titleBar.style.top = '0';
            titleBar.style.backgroundColor = 'rgba(#000000)';
            titleBar.style.padding = '5px 10px';
            titleBar.style.zIndex = '10';
            titleBar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.3)';
            titleBar.style.display = 'flex';
            titleBar.style.flexDirection = 'column';
            titleBar.style.alignItems = 'flex-start';
            titleBar.style.color = '#e7e9ea';

            const titleText = document.createElement('span');
            titleText.id = 'transcript-title-text';
            titleText.style.fontSize = '18px';
            titleText.style.cursor = 'pointer';
            titleText.style.color = '#1DA1F2';
            titleText.style.wordWrap = 'break-word';
            titleText.style.overflowWrap = 'break-word';
            titleText.style.maxWidth = '230px';
            titleText.style.lineHeight = '1.2';
            titleText.title = 'Click to download transcript';
            titleText.addEventListener('mouseover', () => {
                titleText.style.color = '#FF9800';
            });
            titleText.addEventListener('mouseout', () => {
                titleText.style.color = '#1DA1F2';
            });
            titleText.addEventListener('click', () => {
                const transcriptContent = formatTranscriptForDownload();
                const blob = new Blob([transcriptContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `transcript_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
            titleBar.appendChild(titleText);

            const speakerContainer = document.createElement('div');
            speakerContainer.style.display = 'flex';
            speakerContainer.style.alignItems = 'center';
            speakerContainer.style.justifyContent = 'space-between';
            speakerContainer.style.width = '100%';

            const speakerTextWrapper = document.createElement('div');
            speakerTextWrapper.style.display = 'flex';
            speakerTextWrapper.style.alignItems = 'center';
            speakerTextWrapper.style.gap = '5px';

            const waveform = document.createElement('div');
            waveform.className = 'waveform';
            waveform.style.display = 'flex';
            waveform.style.gap = '3px';
            waveform.style.height = '14px';
            waveform.style.alignItems = 'flex-end';
            waveform.innerHTML = `
                <span class="wave-bar" style="width: 4px; height: 6px; background: #1DA1F2; border-radius: 2px;"></span>
                <span class="wave-bar" style="width: 4px; height: 8px; background: #1DA1F2; border-radius: 2px;"></span>
                <span class="wave-bar" style="width: 4px; height: 10px; background: #1DA1F2; border-radius: 2px;"></span>
                <span class="wave-bar" style="width: 4px; height: 8px; background: #1DA1F2; border-radius: 2px;"></span>
                <span class="wave-bar" style="width: 4px; height: 6px; background: #1DA1F2; border-radius: 2px;"></span>
            `;
            speakerTextWrapper.appendChild(waveform);

            const speakerText = document.createElement('span');
            speakerText.id = 'transcript-speaker-text';
            speakerText.style.fontSize = '14px';
            speakerText.style.color = '#ff0000';
            speakerTextWrapper.appendChild(speakerText);

            speakerContainer.appendChild(speakerTextWrapper);

            const tabToggle = document.createElement('span');
            tabToggle.style.fontSize = '14px';
            tabToggle.style.cursor = 'pointer';
            speakerContainer.appendChild(tabToggle);

            titleBar.appendChild(speakerContainer);
            transcriptPopup.appendChild(titleBar);

            scrollArea = document.createElement('div');
            scrollArea.id = 'transcript-scrollable';
            scrollArea.style.flex = '1';
            scrollArea.style.overflowY = 'auto';
            scrollArea.style.maxHeight = '300px';

            captionsTab = document.createElement('div');
            captionsTab.id = 'captions-tab';
            captionsTab.style.display = 'block';
            captionsTab.style.color = '#e7e9ea';
            captionsTab.style.fontFamily = 'Arial, sans-serif';
            captionsTab.style.whiteSpace = 'pre-wrap';
            captionsTab.style.fontSize = `${currentFontSize}px`;

            const captionWrapper = document.createElement('div');
            captionWrapper.id = 'transcript-output';
            captionsTab.appendChild(captionWrapper);

            queueTab = document.createElement('div');
            queueTab.id = 'queue-tab';
            queueTab.style.display = 'none';
            queueTab.style.color = '#e7e9ea';
            queueTab.style.fontFamily = 'Arial, sans-serif';
            queueTab.style.whiteSpace = 'pre-wrap';
            queueTab.style.fontSize = `${currentFontSize}px`;

            const queueContent = document.createElement('div');
            queueContent.id = 'hand-queue-content';
            queueTab.appendChild(queueContent);

            scrollArea.appendChild(captionsTab);
            scrollArea.appendChild(queueTab);
            transcriptPopup.appendChild(scrollArea);

            const controlsContainer = document.createElement('div');
            controlsContainer.className = 'controls-container';
            controlsContainer.style.display = 'flex';
            controlsContainer.style.alignItems = 'center';
            controlsContainer.style.justifyContent = 'flex-end';
            controlsContainer.style.padding = '5px 0';
            controlsContainer.style.borderTop = '1px solid rgba(255, 255, 255, 0.3)';

            const searchContainer = document.createElement('div');
            searchContainer.id = 'search-container';
            searchContainer.style.display = 'none';
            searchContainer.style.marginRight = '5px';

            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Search transcript...';
            searchInput.style.width = '170px';
            searchInput.style.padding = '5px';
            searchInput.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            searchInput.style.border = 'none';
            searchInput.style.borderRadius = '5px';
            searchInput.style.color = 'white';
            searchInput.style.fontSize = '14px';
            searchInput.value = searchTerm;
            searchInput.addEventListener('input', (e) => {
                const inputValue = e.target.value.trim().toLowerCase();
                if (inputValue === 'showemojis') {
                    showEmojis = true;
                    searchTerm = '';
                    searchInput.value = '';
                    saveSettings();
                    updateTranscriptPopupImmediate();
                } else if (inputValue === 'hideemojis') {
                    showEmojis = false;
                    searchTerm = '';
                    searchInput.value = '';
                    saveSettings();
                    updateTranscriptPopupImmediate();
                } else if (inputValue === 'showflood') {
                    floodFeaturesVisible = true;
                    searchTerm = '';
                    searchInput.value = '';
                    saveSettings();
                    const separator = document.querySelector('.flood-separator');
                    const floodContainer = document.querySelector('.flood-container');
                    const controlsContainer = document.querySelector('.flood-controls');
                    if (separator) separator.style.display = 'block';
                    if (floodContainer) floodContainer.style.display = 'flex';
                    if (controlsContainer) controlsContainer.style.display = 'flex';
                    updateTranscriptPopupImmediate();
                } else if (inputValue === 'hideflood') {
                    floodFeaturesVisible = false;
                    searchTerm = '';
                    searchInput.value = '';
                    saveSettings();
                    const separator = document.querySelector('.flood-separator');
                    const floodContainer = document.querySelector('.flood-container');
                    const controlsContainer = document.querySelector('.flood-controls');
                    if (separator) separator.style.display = 'none';
                    if (floodContainer) floodContainer.style.display = 'none';
                    if (controlsContainer) controlsContainer.style.display = 'none';
                    if (floodInterval) stopFlood();
                    updateTranscriptPopupImmediate();
                } else {
                    searchTerm = e.target.value.trim();
                    updateTranscriptPopupImmediate();
                }
                lastRenderedCaptionCount = 0;
            });

            searchContainer.appendChild(searchInput);

            const spacer = document.createElement('div');
            spacer.style.flex = '1';

            const textSizeContainer = document.createElement('div');
            textSizeContainer.className = 'text-size-container';
            textSizeContainer.style.display = 'flex';
            textSizeContainer.style.alignItems = 'center';

            const magnifierEmoji = document.createElement('span');
            magnifierEmoji.textContent = '🔍';
            magnifierEmoji.style.marginRight = '5px';
            magnifierEmoji.style.fontSize = '14px';
            magnifierEmoji.style.cursor = 'pointer';
            magnifierEmoji.title = 'Search transcript';
            magnifierEmoji.addEventListener('click', () => {
                const wasVisible = searchContainer.style.display === 'block';
                searchContainer.style.display = wasVisible ? 'none' : 'block';
                if (!wasVisible) searchInput.focus();
                else {
                    searchTerm = '';
                    searchInput.value = '';
                    lastRenderedCaptionCount = 0;
                    updateTranscriptPopupImmediate();
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
                const queueContent = transcriptPopup.querySelector('#hand-queue-content');
                if (captionWrapper) {
                    captionWrapper.style.fontSize = `${currentFontSize}px`;
                    captionWrapper.querySelectorAll('span').forEach(span => {
                        span.style.fontSize = `${currentFontSize}px`;
                    });
                }
                if (queueContent) {
                    queueContent.style.fontSize = `${currentFontSize}px`;
                    queueContent.querySelectorAll('span').forEach(span => {
                        span.style.fontSize = `${currentFontSize}px`;
                    });
                }
                localStorage.setItem(STORAGE_KEYS.TEXT_SIZE, currentFontSize);
            });

            const savedTextSize = localStorage.getItem(STORAGE_KEYS.TEXT_SIZE);
            if (savedTextSize) {
                currentFontSize = parseInt(savedTextSize, 10);
                textSizeSlider.value = currentFontSize;
                const captionWrapper = transcriptPopup.querySelector('#transcript-output');
                if (captionWrapper) captionWrapper.style.fontSize = `${currentFontSize}px`;
            }

            textSizeContainer.appendChild(magnifierEmoji);
            textSizeContainer.appendChild(textSizeSlider);

            controlsContainer.appendChild(searchContainer);
            controlsContainer.appendChild(spacer);
            controlsContainer.appendChild(textSizeContainer);

            transcriptPopup.appendChild(controlsContainer);
            lastRenderedCaptionCount = 0;

            const updateTabToggle = () => {
                if (captionsTab.style.display === 'block') {
                    tabToggle.textContent = '✋';
                    tabToggle.title = 'View Speaking Queue';
                    tabToggle.onclick = () => {
                        captionsTab.style.display = 'none';
                        queueTab.style.display = 'block';
                        updateHandQueueContent(queueTab.querySelector('#hand-queue-content'));
                        if (queueRefreshInterval) clearInterval(queueRefreshInterval);
                        queueRefreshInterval = setInterval(() => updateHandQueueContent(queueTab.querySelector('#hand-queue-content')), 1000);
                        updateTabToggle();
                    };
                } else {
                    tabToggle.textContent = '📝';
                    tabToggle.title = 'View Captions';
                    tabToggle.onclick = () => {
                        captionsTab.style.display = 'block';
                        queueTab.style.display = 'none';
                        if (queueRefreshInterval) {
                            clearInterval(queueRefreshInterval);
                            queueRefreshInterval = null;
                        }
                        updateTranscriptPopupImmediate();
                        if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight;
                        updateTabToggle();
                    };
                }
            };
            updateTabToggle();

            updateTitleBar();
        }

        const captionWrapper = captionsTab.querySelector('#transcript-output');
        const queueContent = queueTab.querySelector('#hand-queue-content');

        if (captionsTab.style.display === 'block') {
            const { captions: filteredCaptions, emojis: filteredEmojis } = filterTranscript(captionsData, emojiReactions, searchTerm);
            const totalItems = filteredCaptions.length + filteredEmojis.length;

            if (captionWrapper) {
                captionWrapper.innerHTML = '';
                let previousSpeaker = lastSpeaker;

                const combinedData = [
                    ...filteredCaptions.map(item => ({ ...item, type: 'caption' })),
                    ...filteredEmojis.map(item => ({ ...item, type: 'emoji' }))
                ].sort((a, b) => a.timestamp - b.timestamp);

                let emojiGroups = [];
                let currentGroup = null;

                const dataToRender = searchTerm ? combinedData : combinedData.slice(-300);

                dataToRender.forEach((item) => {
                    if (item.type === 'caption') {
                        if (currentGroup) {
                            emojiGroups.push(currentGroup);
                            currentGroup = null;
                        }
                        emojiGroups.push(item);
                    } else if (item.type === 'emoji') {
                        if (!currentGroup) {
                            currentGroup = { displayName: item.displayName, emoji: item.emoji, count: 1, items: [item] };
                        } else if (currentGroup.displayName === item.displayName &&
                               currentGroup.emoji === item.emoji &&
                               Math.abs(item.timestamp - currentGroup.items[currentGroup.items.length - 1].timestamp) < 5000) {
                        currentGroup.count++;
                        currentGroup.items.push(item);
                    } else {
                        emojiGroups.push(currentGroup);
                        currentGroup = { displayName: item.displayName, emoji: item.emoji, count: 1, items: [item] };
                    }
                }
            });
            if (currentGroup) emojiGroups.push(currentGroup);

            emojiGroups.forEach((group, i) => {
                if (group.type === 'caption') {
                    let { displayName, handle, text } = group;
                    if (displayName === 'Unknown' && previousSpeaker.username) {
                        displayName = previousSpeaker.username;
                        handle = previousSpeaker.handle;
                    }
                    if (i > 0 && previousSpeaker.username !== displayName) {
                        captionWrapper.insertAdjacentHTML('beforeend', '<div style="border-top: 1px solid rgba(255, 255, 255, 0.3); margin: 5px 0;"></div>');
                    }
                    captionWrapper.insertAdjacentHTML('beforeend',
                        `<span style="font-size: ${currentFontSize}px; color: ${displayName === 'System' ? '#00FF00' : '#1DA1F2'}">${displayName}</span> ` +
                        `<span style="font-size: ${currentFontSize}px; color: #808080">${handle}</span><br>` +
                        `<span style="font-size: ${currentFontSize}px; color: #FFFFFF">${text}</span><br><br>`
                    );
                    previousSpeaker = { username: displayName, handle };
                } else if (showEmojis) {
                    let { displayName, emoji, count } = group;
                    if (displayName === 'Unknown' && previousSpeaker.username) {
                        displayName = previousSpeaker.username;
                    }
                    const countText = count > 1 ? ` <span style="font-size: ${currentFontSize}px; color: #FFD700">x${count}</span>` : '';
                    captionWrapper.insertAdjacentHTML('beforeend',
                        `<span style="font-size: ${currentFontSize}px; color: #FFD700">${displayName}</span> ` +
                        `<span style="font-size: ${currentFontSize}px; color: #FFFFFF">reacted with ${emoji}${countText}</span><br>`
                    );
                    previousSpeaker = { username: displayName, handle: group.items[0].handle };
                }
            });

            lastSpeaker = previousSpeaker;
            lastRenderedCaptionCount = totalItems;

            if (scrollArea && !isUserScrolledUp && !searchTerm) scrollArea.scrollTop = scrollArea.scrollHeight;
        }

        if (scrollArea) {
            scrollArea.onscroll = () => {
                isUserScrolledUp = scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight > 50;
            };
        }
    } else if (queueTab.style.display === 'block') {
        updateHandQueueContent(queueContent);
    }

    updateTitleBar();
}

function updateHandQueueContent(queueContent) {
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

        sortedQueue.forEach(([, { displayName, timestamp }], index) => {
            const entry = document.createElement('div');
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

            entry.appendChild(text);
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
}

function setupSettingsDropdown() {
    if (!settingsDropdown || settingsDropdown.querySelector('#download-transcript-share')) return;

    settingsDropdown.innerHTML = '';
    settingsDropdown.style.display = 'flex';
    settingsDropdown.style.flexDirection = 'column';
    settingsDropdown.style.gap = '5px';

    // Download Transcript Item
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
    downloadText.innerHTML = '<span style="font-size: 16px; margin-right: 8px;">⌘</span><span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">Download Transcript</span>';
    downloadTextContainer.appendChild(downloadText);
    downloadItem.appendChild(downloadIconContainer);
    downloadItem.appendChild(downloadTextContainer);
    const downloadStyle = document.createElement('style');
    downloadStyle.textContent = `#download-transcript-share:hover { background-color: rgba(231, 233, 234, 0.1); }`;
    downloadItem.appendChild(downloadStyle);
    downloadItem.addEventListener('click', (e) => {
        e.preventDefault();
        const transcriptContent = formatTranscriptForDownload();
        const blob = new Blob([transcriptContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transcript_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        settingsDropdown.style.display = 'none';
    });

    // Copy Replay URL Item
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
    replayIcon.innerHTML = '<g><path d="M12 3.75c-4.55 0-8.25 3.69-8.25 8.25 0 1.92.66 3.52 1.687 4.885l-1.987 1.987h5.5v-5.5l1.886 1.886C11.17 14.96 11.5 13.76 11.5 12.5c0-2.76 2.24-5 5-5V3.75c-2.49 0-4.77.96-6.5 2.535C8.27 4.71 5.99 3.75 3.75 3.75v3.5c2.24 0 4.25.96 5.688 2.465z"/></g>';
    replayIconContainer.appendChild(replayIcon);
    const replayTextContainer = document.createElement('div');
    replayTextContainer.className = 'css-175oi2r r-16y2uox r-1wbh5a2';
    const replayText = document.createElement('div');
    replayText.dir = 'ltr';
    replayText.className = 'css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-b88u0q';
    replayText.style.color = 'rgb(231, 233, 234)';
    replayText.innerHTML = '<span style="font-size: 16px; margin-right: 8px;">⌫</span><span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">Copy Replay URL</span>';
    replayTextContainer.appendChild(replayText);
    replayItem.appendChild(replayIconContainer);
    replayItem.appendChild(replayTextContainer);
    const replayStyle = document.createElement('style');
    replayStyle.textContent = `#copy-replay-url-share:hover { background-color: rgba(231, 233, 234, 0.1); }`;
    replayItem.appendChild(replayStyle);
    replayItem.addEventListener('click', async (e) => {
        e.preventDefault();
        if (dynamicUrl) {
            const newReplayUrl = await fetchReplayUrl(dynamicUrl);
            if (newReplayUrl.startsWith('http')) navigator.clipboard.writeText(newReplayUrl);
        }
        settingsDropdown.style.display = 'none';
    });

    // Copy Live URL Item
    const liveItem = document.createElement('div');
    liveItem.id = 'copy-live-url-share';
    liveItem.setAttribute('role', 'menuitem');
    liveItem.setAttribute('tabindex', '0');
    liveItem.className = 'css-175oi2r r-1loqt21 r-18u37iz r-1mmae3n r-3pj75a r-13qz1uu r-o7ynqc r-6416eg r-1ny4l3l';
    liveItem.style.transition = 'background-color 0.2s ease';
    const liveIconContainer = document.createElement('div');
    liveIconContainer.className = 'css-175oi2r r-1777fci r-faml9v';
    const liveIcon = document.createElement('svg');
    liveIcon.viewBox = '0 0 24 24';
    liveIcon.setAttribute('aria-hidden', 'true');
    liveIcon.className = 'r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-1q142lx';
    liveIcon.innerHTML = '<g><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></g>';
    liveIconContainer.appendChild(liveIcon);
    const liveTextContainer = document.createElement('div');
    liveTextContainer.className = 'css-175oi2r r-16y2uox r-1wbh5a2';
    const liveText = document.createElement('div');
    liveText.dir = 'ltr';
    liveText.className = 'css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-b88u0q';
    liveText.style.color = 'rgb(231, 233, 234)';
    liveText.innerHTML = '<span style="font-size: 16px; margin-right: 8px;">⌦</span><span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">Copy Live URL</span>';
    liveTextContainer.appendChild(liveText);
    liveItem.appendChild(liveIconContainer);
    liveItem.appendChild(liveTextContainer);
    const liveStyle = document.createElement('style');
    liveStyle.textContent = `#copy-live-url-share:hover { background-color: rgba(231, 233, 234, 0.1); }`;
    liveItem.appendChild(liveStyle);
    liveItem.addEventListener('click', (e) => {
        e.preventDefault();
        if (dynamicUrl) navigator.clipboard.writeText(dynamicUrl);
        settingsDropdown.style.display = 'none';
    });

    // Record Space Toggle Item
    const recordItem = document.createElement('div');
    recordItem.id = 'record-space-toggle';
    recordItem.setAttribute('role', 'menuitem');
    recordItem.setAttribute('tabindex', '0');
    recordItem.className = 'css-175oi2r r-1loqt21 r-18u37iz r-1mmae3n r-3pj75a r-13qz1uu r-o7ynqc r-6416eg r-1ny4l3l';
    recordItem.style.transition = 'background-color 0.2s ease';
    const recordIconContainer = document.createElement('div');
    recordIconContainer.className = 'css-175oi2r r-1777fci r-faml9v';
    const recordIcon = document.createElement('svg');
    recordIcon.viewBox = '0 0 24 24';
    recordIcon.setAttribute('aria-hidden', 'true');
    recordIcon.className = 'r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-1q142lx';
    recordIcon.innerHTML = '<g><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm0-4h-2V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z"/></g>';
    recordIconContainer.appendChild(recordIcon);
    const recordTextContainer = document.createElement('div');
    recordTextContainer.className = 'css-175oi2r r-16y2uox r-1wbh5a2';
    const recordText = document.createElement('div');
    recordText.dir = 'ltr';
    recordText.className = 'css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-b88u0q';
    recordText.style.color = 'rgb(231, 233, 234)';
    recordText.innerHTML = `<span style="font-size: 16px; margin-right: 8px;">${isReplayEnabled ? '▣' : '𝕏'}</span><span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">${isReplayEnabled ? 'Stop Recording Space' : 'Record Space'}</span>`;
    recordTextContainer.appendChild(recordText);
    recordItem.appendChild(recordIconContainer);
    recordItem.appendChild(recordTextContainer);
    const recordStyle = document.createElement('style');
    recordStyle.textContent = `#record-space-toggle:hover { background-color: rgba(231, 233, 234, 0.1); }`;
    recordItem.appendChild(recordStyle);
    recordItem.addEventListener('click', async (e) => {
        e.preventDefault();
        const newState = !isReplayEnabled;
        const success = await toggleRecording(newState);
        if (success) {
            isReplayEnabled = newState;
            recordText.innerHTML = `<span style="font-size: 16px; margin-right: 8px;">${isReplayEnabled ? '▣' : '𝕏'}</span><span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">${isReplayEnabled ? 'Stop Recording Space' : 'Record Space'}</span>`;
            localStorage.setItem(STORAGE_KEYS.REPLAY_ENABLED, isReplayEnabled);
        }
        settingsDropdown.style.display = 'none';
    });

    settingsDropdown.appendChild(downloadItem);
    settingsDropdown.appendChild(replayItem);
    settingsDropdown.appendChild(liveItem);
    settingsDropdown.appendChild(recordItem);
}

function init() {
    // Original transcript button
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

    // Settings button (gear icon)
    settingsButton = document.createElement('button');
    settingsButton.textContent = '⚙';
    settingsButton.style.zIndex = '10001';
    settingsButton.style.fontSize = '26px';
    settingsButton.style.padding = '0';
    settingsButton.style.backgroundColor = 'transparent';
    settingsButton.style.border = 'none';
    settingsButton.style.borderRadius = '50%';
    settingsButton.style.width = '36px';
    settingsButton.style.height = '36px';
    settingsButton.style.cursor = 'pointer';
    settingsButton.style.display = 'none';
    settingsButton.style.lineHeight = '32px';
    settingsButton.style.textAlign = 'center';
    settingsButton.style.position = 'fixed';
    settingsButton.style.color = 'white';
    settingsButton.style.filter = 'grayscale(100%) brightness(200%)';
    settingsButton.title = 'Settings';

    transcriptButton.addEventListener('mouseover', () => {
        transcriptButton.style.backgroundColor = '#595b5b40';
    });
    transcriptButton.addEventListener('mouseout', () => {
        transcriptButton.style.backgroundColor = 'transparent';
    });
    transcriptButton.addEventListener('click', () => {
        const isVisible = transcriptPopup.style.display === 'block';
        transcriptPopup.style.display = isVisible ? 'none' : 'block';
        settingsDropdown.style.display = 'none'; // Close settings dropdown if open
        if (!isVisible) {
            updateTranscriptPopupImmediate();
            if (!timerInterval) {
                timerInterval = setInterval(() => {
                    if (transcriptPopup?.style.display === 'block') {
                        const queueTab = transcriptPopup.querySelector('#queue-tab');
                        if (queueTab?.style.display === 'block') {
                            updateHandQueueContent(queueTab.querySelector('#hand-queue-content'));
                        }
                    }
                }, 1000);
            }
        } else if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    });

    settingsButton.addEventListener('mouseover', () => {
        settingsButton.style.backgroundColor = '#595b5b40';
    });
    settingsButton.addEventListener('mouseout', () => {
        settingsButton.style.backgroundColor = 'transparent';
    });
    settingsButton.addEventListener('click', () => {
        const isVisible = settingsDropdown.style.display === 'block';
        settingsDropdown.style.display = isVisible ? 'none' : 'block';
        transcriptPopup.style.display = 'none'; // Close transcript popup if open
        if (settingsDropdown.style.display === 'block') {
            setupSettingsDropdown();
            const rect = settingsButton.getBoundingClientRect();
            settingsDropdown.style.left = `${rect.left + window.scrollX - 100}px`;
            settingsDropdown.style.top = `${rect.bottom + window.scrollY}px`;
        }
    });

    transcriptPopup = document.createElement('div');
    transcriptPopup.style.position = 'fixed';
    transcriptPopup.style.bottom = '150px';
    transcriptPopup.style.right = '20px';
    transcriptPopup.style.backgroundColor = '#000000';
    transcriptPopup.style.borderRadius = '10px';
    transcriptPopup.style.padding = '10px';
    transcriptPopup.style.zIndex = '10002';
    transcriptPopup.style.maxHeight = '470px';
    transcriptPopup.style.display = 'none';
    transcriptPopup.style.width = '340px';
    transcriptPopup.style.color = 'white';
    transcriptPopup.style.fontSize = '14px';
    transcriptPopup.style.lineHeight = '1.5';
    transcriptPopup.style.boxShadow = '0 0 5px 2px rgba(255, 255, 255, 0.2), 0 2px 10px rgba(0, 0, 0, 0.5)';
    transcriptPopup.style.flexDirection = 'column';

    settingsDropdown = document.createElement('div');
    settingsDropdown.style.position = 'fixed';
    settingsDropdown.style.backgroundColor = '#000000';
    settingsDropdown.style.borderRadius = '10px';
    settingsDropdown.style.padding = '10px';
    settingsDropdown.style.zIndex = '10002';
    settingsDropdown.style.width = '230px';
    settingsDropdown.style.height = '180px';
    settingsDropdown.style.display = 'none';
    settingsDropdown.style.color = 'white';
    settingsDropdown.style.fontSize = '14px';
    settingsDropdown.style.lineHeight = '1.5';
    settingsDropdown.style.boxShadow = '0 0 5px 2px rgba(255, 255, 255, 0.2), 0 2px 10px rgba(0, 0, 0, 0.5)';
    settingsDropdown.style.flexDirection = 'column';

    document.body.appendChild(transcriptButton);
    document.body.appendChild(settingsButton);
    document.body.appendChild(transcriptPopup);
    document.body.appendChild(settingsDropdown);

    const floodOverlay = document.createElement('div');
    floodOverlay.id = 'flood-overlay';
    floodOverlay.style.position = 'fixed';
    floodOverlay.style.width = '36px';
    floodOverlay.style.height = '36px';
    floodOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
    floodOverlay.style.borderRadius = '50%';
    floodOverlay.style.zIndex = '99999';
    floodOverlay.style.cursor = 'pointer';
    floodOverlay.style.display = 'none';
    floodOverlay.addEventListener('click', () => {
        floodMode = false;
        stopFlood();
        saveSettings();
    });
    document.body.appendChild(floodOverlay);

    const style = document.createElement('style');
    style.textContent = `
        .waveform .wave-bar {
            transform-origin: bottom;
            animation: waveMove 1.2s infinite ease-in-out;
        }
        .waveform .wave-bar:nth-child(1) { animation-delay: 0s; animation-duration: 1.1s; }
        .waveform .wave-bar:nth-child(2) { animation-delay: 0.2s; animation-duration: 1.3s; }
        .waveform .wave-bar:nth-child(3) { animation-delay: 0.4s; animation-duration: 1.0s; }
        .waveform .wave-bar:nth-child(4) { animation-delay: 0.6s; animation-duration: 1.2s; }
        .waveform .wave-bar:nth-child(5) { animation-delay: 0.8s; animation-duration: 1.4s; }
        @keyframes waveMove {
            0% { transform: scaleY(0.4); }
            25% { transform: scaleY(1.2); }
            50% { transform: scaleY(0.8); }
            75% { transform: scaleY(1.0); }
            100% { transform: scaleY(0.4); }
        }
    `;
    document.head.appendChild(style);

    speakerTimer = 0;
    speakerHistory.clear();
    loadSettings();

    setInterval(updateFloodOverlayPosition, 500);

    const handleStartListeningClick = () => {
        for (const [roomId, wsSet] of websocketMap) {
            wsSet.forEach(ws => ws.close());
        }
        websocketMap.clear();
        allowNewConnection = true;
    };

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                updateVisibilityAndPosition();

                const startListeningButton = document.querySelector('div.css-175oi2r.r-1pi2tsx.r-1777fci.r-cxgwc0[style*="background-image: linear-gradient(61.63deg, rgb(45, 66, 255) -15.05%, rgb(156, 99, 250) 104.96%)"]');
                if (startListeningButton && !startListeningButton.dataset.listenerAdded) {
                    startListeningButton.addEventListener('click', handleStartListeningClick);
                    startListeningButton.dataset.listenerAdded = 'true';
                }

                const audioElements = document.querySelectorAll('audio');
                for (const audio of audioElements) {
                    if (audio.src?.includes('dynamic_playlist.m3u8?type=live')) {
                        dynamicUrl = audio.src;
                    }
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    updateVisibilityAndPosition();
    setInterval(updateVisibilityAndPosition, 2000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
})();