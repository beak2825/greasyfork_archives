// ==UserScript==
// @name         𝕏Spaces Pro
// @namespace    Violentmonkey Scripts
// @version      2.531
// @description  Addon for X Spaces with custom emojis, enhanced transcript, and listener tracker
// @author       x.com/blankspeaker and x.com/PrestonHenshawX
// @match        https://twitter.com/*
// @match        https://x.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535073/%F0%9D%95%8FSpaces%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/535073/%F0%9D%95%8FSpaces%20Pro.meta.js
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
    let averageWaitTime = 0;
    let lastAverageUpdate = 0;
    const activeHandRaises = new Map();
    const previousHandRaises = new Map();
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
    let hasDownloaded = false;
    let spaceTitle = 'Untitled Space';
    const userIdToParticipantIndex = new Map();
    let showSettings = false;
    let currentSkinTone = 0;
    const thumbsUpVariants = ['👍', '👍🏻', '👍🏼', '👍🏽', '👍🏾', '👍🏿'];
    const thumbsDownVariants = ['👎', '👎🏻', '👎🏼', '👎🏽', '👎🏾', '👎🏿'];
    let thumbsUpReactions = [];
    let thumbsDownReactions = [];
    let showPoll = false;
    let showListenerTracker = false;
    let previousOccupancy = null;
    let totalParticipants = 0;
    let listenerHistory = [];

    const defaultCustomEmojis = [
        '😂', '😲', '😢', '✌️', '💯',
        '👏', '✊', '👍', '👎', '👋',
        '😍', '😃', '😠', '🤔', '😷',
        '🤐', '🔥', '🎯', '✨', '🥇',
        '🙌', '🙏', '✋', '🎶', '🎙',
        '🪐', '🎨', '🎮', '🏛️', '💸',
        '🌲', '🐞', '❤️', '🧡', '💛',
        '💚', '💙', '💜', '🖤', '🤎',
        '💄', '🙉', '🏠', '💡', '💢',
        '🖥️', '📺', '💻', '🎚️', '🎛️',
        '🔋', '🗒️', '📰', '📌', '📡',
        '🍽️', '🎟️', '🧳', '⌚', '👟',
        '💼', '💠'
    ];

    let customEmojis = [...defaultCustomEmojis];

    const heartEmojis = ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤎'];
    const originalEmojis = ['😂', '😲', '😢', '💜', '💯', '👏', '✊', '👍', '👎', '👋'];
    const skinToneEmojis = {
        '✌️': ['✌️', '✌🏻', '✌🏼', '✌🏽', '✌🏾', '✌🏿'],
        '👏': ['👏', '👏🏻', '👏🏼', '👏🏽', '👏🏾', '👏🏿'],
        '✊': ['✊', '✊🏻', '✊🏼', '✊🏽', '✊🏾', '✊🏿'],
        '👍': ['👍', '👍🏻', '👍🏼', '👍🏽', '👍🏾', '👍🏿'],
        '👎': ['👎', '👎🏻', '👎🏼', '👎🏽', '👎🏾', '👎🏿'],
        '👋': ['👋', '👋🏻', '👋🏼', '👋🏽', '👋🏾', '👋🏿'],
        '✋': ['✋', '✋🏻', '✋🏼', '✋🏽', '✋🏾', '✋🏿']
    };
    const filteredCustomEmojis = customEmojis.filter(emoji => !originalEmojis.includes(emoji) && !heartEmojis.includes(emoji));

    const emojiMap = new Map();
    function updateEmojiMap() {
        emojiMap.clear();
        customEmojis.forEach((emoji, index) => {
            const baseEmoji = Object.keys(skinToneEmojis).find(key => skinToneEmojis[key].includes(emoji)) || emoji;
            const originalEmoji = originalEmojis[index % originalEmojis.length];
            emojiMap.set(emoji, originalEmoji);
        });
        heartEmojis.forEach((emoji, index) => {
            const originalEmoji = originalEmojis[index % originalEmojis.length];
            emojiMap.set(emoji, originalEmoji);
        });
    }

    function getEmojiUnicode(emoji) {
        const codePoints = Array.from(emoji).map(char => char.codePointAt(0).toString(16));
        return codePoints.join('-');
    }

    function updateCustomEmojisWithSkinTone() {
        customEmojis = customEmojis.map(emoji => {
            const baseEmoji = Object.keys(skinToneEmojis).find(key => skinToneEmojis[key].includes(emoji)) || emoji;
            return skinToneEmojis[baseEmoji] ? skinToneEmojis[baseEmoji][currentSkinTone] : emoji;
        });
        updateEmojiMap();
    }

    async function fetchReplayUrl(dynUrl) {
        if (!dynUrl || !dynUrl.includes('/dynamic_playlist.m3u8?type=live')) {
            console.log('fetchReplayUrl: Invalid or missing dynamic URL:', dynUrl);
            return 'Not available';
        }

        const masterUrl = dynUrl.replace('/dynamic_playlist.m3u8?type=live', '/master_playlist.m3u8');
        console.log('fetchReplayUrl: Attempting to fetch master URL:', masterUrl);

        try {
            // First attempt with CORS mode
            const response = await fetch(masterUrl, { mode: 'cors' });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const text = await response.text();
            const playlistMatch = text.match(/playlist_\d+\.m3u8/);
            if (playlistMatch) {
                const replayUrl = dynUrl.replace('dynamic_playlist.m3u8', playlistMatch[0]).replace('type=live', 'type=replay');
                console.log('fetchReplayUrl: Successfully generated replay URL:', replayUrl);
                return replayUrl;
            }
            console.log('fetchReplayUrl: No playlist found in master URL response');
        } catch (error) {
            console.error('fetchReplayUrl: Direct fetch failed:', error.message);
            // Attempt with CORS proxy
            const corsProxy = 'https://cors.viddastrage.workers.dev/corsproxy/?apiurl=';
            try {
                const response = await fetch(corsProxy + encodeURIComponent(masterUrl));
                if (!response.ok) {
                    throw new Error(`CORS proxy fetch failed! Status: ${response.status}`);
                }
                const text = await response.text();
                const playlistMatch = text.match(/playlist_\d+\.m3u8/);
                if (playlistMatch) {
                    const replayUrl = dynUrl.replace('dynamic_playlist.m3u8', playlistMatch[0]).replace('type=live', 'type=replay');
                    console.log('fetchReplayUrl: Successfully generated replay URL via proxy:', replayUrl);
                    return replayUrl;
                }
                console.log('fetchReplayUrl: No playlist found in CORS proxy response');
            } catch (proxyError) {
                console.error('fetchReplayUrl: CORS proxy fetch failed:', proxyError.message);
                // Fallback: Construct a replay URL assuming a standard playlist name
                const fallbackReplayUrl = dynUrl.replace('dynamic_playlist.m3u8', 'playlist_0.m3u8').replace('type=live', 'type=replay');
                console.log('fetchReplayUrl: Using fallback replay URL:', fallbackReplayUrl);
                return fallbackReplayUrl;
            }
        }
        return 'Not available';
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

    function detectEndedUI() {
        try {
            const endedContainer = document.querySelector('div[data-testid="sheetDialog"] div[class*="r-18u37iz"][class*="r-13qz1uu"]');
            if (endedContainer) {
                const hasEndedText = Array.from(endedContainer.querySelectorAll('span')).some(span => span.textContent.toLowerCase().includes('ended'));
                const hasCloseButton = endedContainer.querySelector('button[aria-label="Close"]');
                const hasShareButton = endedContainer.querySelector('button[aria-label="Share"]');
                if (hasEndedText && hasCloseButton && hasShareButton) {
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
            const transcriptContent = await formatTranscriptForDownload();
            const blob = new Blob([transcriptContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `transcript_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {}
    }

    function captureSpaceTitle() {
        const spaceTitleContainer = document.querySelector('div[dir="auto"][data-testid="tweetText"].css-146c3p1.r-bcqeeo.r-1ttztb7.r-qvutc0.r-37j5jr.r-adyw6z.r-135wba7.r-1vr29t4.r-bnwqim.r-13awgt0');
        if (spaceTitleContainer) {
            const titleElements = spaceTitleContainer.querySelectorAll('span.css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3, button.css-1jxf684.r-bcqeeo.r-qvutc0.r-poiln3.r-fdjqy7, img[alt]');
            const newTitle = Array.from(titleElements)
                .map(el => {
                    if (el.tagName === 'IMG' && el.alt) {
                        return el.alt;
                    }
                    return el.textContent;
                })
                .join('')
                .trim();
            if (newTitle) {
                spaceTitle = newTitle;
            }
        }
    }

    async function toggleRecording(isEnabled) {
        if (!capturedCookie || !currentSpaceId) return false;

        captureSpaceTitle();

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

        try {
            const response = await fetch('https://proxsee.pscp.tv/api/v2/replayBroadcastEdit?build=com.atebits.Tweetie210.86', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                if (response.status === 403) {
                    const recordToggle = document.querySelector('#record-toggle-circle');
                    if (recordToggle) {
                        recordToggle.style.backgroundColor = 'grey';
                        recordToggle.style.animation = 'none';
                        recordToggle.title = 'Recording toggle failed: Permission denied';
                    }
                    const systemMessage = {
                        displayName: 'System',
                        handle: '',
                        text: 'Only hosts and cohosts can use this feature',
                        timestamp: Date.now(),
                        uniqueId: `system-${Date.now()}-recording-forbidden`
                    };
                    captionsData.push(systemMessage);
                    if (transcriptPopup?.style.display === 'block') {
                        const captionsTab = transcriptPopup.querySelector('#captions-tab');
                        if (captionsTab?.style.display === 'block') {
                            updateTranscriptPopupImmediate();
                        }
                    }
                    return false;
                }
                throw new Error('Network response was not ok');
            }
            return true;
        } catch (error) {
            if (error.message.includes('403')) {
                const recordToggle = document.querySelector('#record-toggle-circle');
                if (recordToggle) {
                    recordToggle.style.backgroundColor = 'grey';
                    recordToggle.style.animation = 'none';
                    recordToggle.title = 'Recording toggle failed: Permission denied';
                }
                const systemMessage = {
                    displayName: 'System',
                    handle: '',
                    text: 'Only hosts and cohosts can use this feature',
                    timestamp: Date.now(),
                    uniqueId: `system-${Date.now()}-recording-forbidden`
                };
                captionsData.push(systemMessage);
                if (transcriptPopup?.style.display === 'block') {
                    const captionsTab = transcriptPopup.querySelector('#captions-tab');
                    if (captionsTab?.style.display === 'block') {
                        updateTranscriptPopupImmediate();
                    }
                }
            }
            return false;
        }
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
                                        if (thumbsUpVariants.includes(emojiToSend)) {
                                            thumbsUpReactions.push({ timestamp: Date.now() });
                                        } else if (thumbsDownVariants.includes(emojiToSend)) {
                                            thumbsDownReactions.push({ timestamp: Date.now() });
                                        }
                                        if (transcriptPopup?.style.display === 'block') {
                                            const captionsTab = transcriptPopup.querySelector('#captions-tab');
                                            if (captionsTab?.style.display === 'block') {
                                                updateTranscriptPopupImmediate();
                                                updateVoteCounts();
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
                if (message.kind === 1 && message.payload) {
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
                            averageWaitTime = 0;
                            lastAverageUpdate = 0;
                            activeHandRaises.clear();
                            previousHandRaises.clear();
                            handQueue.clear();
                            userIdToParticipantIndex.clear();
                            lastSpeaker = { username: '', handle: '' };
                            lastRenderedCaptionCount = 0;
                            speakerTimer = 0;
                            speakerSegments.length = 0;
                            localStorage.removeItem(STORAGE_KEYS.SPEAKER_DURATIONS);
                            hasDownloaded = false;
                            isReplayEnabled = false;
                            spaceTitle = 'Untitled Space';
                            thumbsUpReactions = [];
                            thumbsDownReactions = [];
                            previousOccupancy = null;
                            listenerHistory = [];
                            if (speakerTimerInterval) {
                                clearInterval(speakerTimerInterval);
                                speakerTimerInterval = null;
                            }
                            const initialAttribution = {
                                displayName: 'System',
                                handle: '',
                                text: '⚠️ 𝕏spaces+ Created by @blankspeaker and @PrestonHenshawX\n\n⚠️ Type !commands in the search bar to see more features',
                                timestamp: Date.now(),
                                uniqueId: `system-attribution-initial-${Date.now()}`
                            };
                            captionsData.push(initialAttribution);
                            if (transcriptPopup) {
                                const captionWrapper = transcriptPopup.querySelector('#transcript-output');
                                if (captionWrapper) captionWrapper.innerHTML = '';
                                captureSpaceTitle();
                                updateTitleBar();
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
                    const userId = payload.sender?.user_id || 'unknown';
                    const displayName = payload.sender?.display_name || body?.displayName || 'Unknown';
                    const handle = payload.sender?.username || body?.username || 'Unknown';
                    const timestamp = message.timestamp / 1e6 || Date.now();

                    function calculateAverageWaitTime() {
                        const now = Date.now();
                        const sortedQueue = Array.from(handQueue.entries()).sort(([, a], [, b]) => a.timestamp - b.timestamp);
                        const waitTimes = [...handRaiseDurations];
                        if (sortedQueue.length > 0) {
                            const topQueueTime = (now - sortedQueue[0][1].timestamp) / 1000;
                            waitTimes.push(topQueueTime);
                        }
                        averageWaitTime = waitTimes.length > 0 ? waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length : 0;
                        lastAverageUpdate = now;
                    }

                    function removeHandFromQueue(participantIdx, eventText) {
                        if (activeHandRaises.has(participantIdx)) {
                            const startTime = activeHandRaises.get(participantIdx);
                            const duration = (timestamp - startTime) / 1000;
                            const sortedQueue = Array.from(handQueue.entries())
                                .sort(([, a], [, b]) => a.timestamp - b.timestamp);
                            if (sortedQueue.length > 0 && sortedQueue[0][0] === participantIdx && duration >= 60) {
                                handRaiseDurations.push(duration);
                                calculateAverageWaitTime();
                                if (handRaiseDurations.length > 50) handRaiseDurations.shift();
                                saveSettings();
                            }
                            previousHandRaises.set(participantIdx, {
                                endTime: timestamp,
                                duration: duration * 1000
                            });
                            setTimeout(() => {
                                previousHandRaises.delete(participantIdx);
                            }, 60000);
                            handQueue.delete(participantIdx);
                            activeHandRaises.delete(participantIdx);
                            if (transcriptPopup?.style.display === 'block') {
                                const queueTab = transcriptPopup.querySelector('#queue-tab');
                                if (queueTab?.style.display === 'block') {
                                    updateHandQueueContent(queueTab.querySelector('#hand-queue-content'));
                                }
                            }
                        }
                    }

                    function insertAttributionIfNeeded() {
                        if (captionsData.length > 0 && (captionsData.length + emojiReactions.length) % 40 === 0) {
                            const attributionMessage = {
                                displayName: 'System',
                                handle: '',
                                text: '⚠️ 𝕏spaces+ Created by @blankspeaker and @PrestonHenshawX\n\n⚠️ Type !commands in the search bar to see more features',
                                timestamp: Date.now(),
                                uniqueId: `system-attribution-${Date.now()}-${captionsData.length + emojiReactions.length}`
                            };
                            captionsData.push(attributionMessage);
                        }
                    }

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
                                removeHandFromQueue(participantIndex, eventText);
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
                                removeHandFromQueue(participantIndex, eventText);
                                break;
                            case 15:
                                eventText = `${displayName} (@${handle}) was removed from the Space`;
                                removeHandFromQueue(participantIndex, eventText);
                                break;
                            case 17:
                                removeHandFromQueue(participantIndex, null);
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
                                let adjustedTimestamp = timestamp;
                                if (previousHandRaises.has(participantIndex)) {
                                    const prev = previousHandRaises.get(participantIndex);
                                    const timeSinceLast = timestamp - prev.endTime;
                                    if (timeSinceLast <= 60000) {
                                        adjustedTimestamp = timestamp - prev.duration;
                                    }
                                }
                                handQueue.set(participantIndex, { displayName, handle: `@${handle}`, timestamp: adjustedTimestamp });
                                activeHandRaises.set(participantIndex, adjustedTimestamp);
                                userIdToParticipantIndex.set(userId, participantIndex);
                                if (transcriptPopup?.style.display === 'block') {
                                    const queueTab = document.querySelector('#queue-tab');
                                    if (queueTab?.style.display === 'block') {
                                        updateHandQueueContent(queueTab.querySelector('#hand-queue-content'));
                                    }
                                }
                                break;
                            case 24:
                                removeHandFromQueue(participantIndex, null);
                                break;
                        }

                        if (eventText && body.guestBroadcastingEvent !== 4 && body.guestBroadcastingEvent !== 10 && body.guestBroadcastingEvent !== 15) {
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
                                insertAttributionIfNeeded();
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
                            removeHandFromQueue(participantIndex, null);
                            captionsData.push(caption);
                            insertAttributionIfNeeded();

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
                            if (thumbsUpVariants.includes(body.body)) {
                                thumbsUpReactions.push({ timestamp: timestamp });
                            } else if (thumbsDownVariants.includes(body.body)) {
                                thumbsDownReactions.push({ timestamp: timestamp });
                            }
                            insertAttributionIfNeeded();
                            if (transcriptPopup?.style.display === 'block') {
                                const captionsTab = transcriptPopup.querySelector('#captions-tab');
                                if (captionsTab?.style.display === 'block') {
                                    updateTranscriptPopupImmediate();
                                    updateVoteCounts();
                                }
                            }
                        }
                    }

                    const now = Date.now();
                    if (now - lastAverageUpdate >= 60000 && (handRaiseDurations.length > 0 || handQueue.size > 0)) {
                        calculateAverageWaitTime();
                        if (transcriptPopup?.style.display === 'block') {
                            const queueTab = transcriptPopup.querySelector('#queue-tab');
                            if (queueTab?.style.display === 'block') {
                                updateHandQueueContent(queueTab.querySelector('#hand-queue-content'));
                            }
                        }
                    }
                } else if (message.kind === 2 && message.payload) {
                    const payload = JSON.parse(message.payload);
                    const body = payload.body ? JSON.parse(payload.body) : null;
                    if (payload.kind === 4 && body?.room === currentSpaceId) {
                        const userId = payload.sender?.user_id;
                        if (userId && userIdToParticipantIndex.has(userId)) {
                            const participantIndex = userIdToParticipantIndex.get(userId);
                            removeHandFromQueue(participantIndex, null);
                            userIdToParticipantIndex.delete(userId);
                        }
                    }
                    if (body && body.occupancy !== undefined && body.total_participants !== undefined) {
                        const currentOccupancy = body.occupancy;
                        totalParticipants = body.total_participants;
                        previousOccupancy = currentOccupancy;
                        const now = Date.now();
                        listenerHistory.push({ timestamp: now, occupancy: currentOccupancy });
                        if (listenerHistory.length > 100) listenerHistory.shift();
                        if (transcriptPopup?.style.display === 'block') {
                            const captionsTab = transcriptPopup.querySelector('#captions-tab');
                            if (captionsTab?.style.display === 'block') {
                                updateGraph();
                            }
                        }
                    }
                }
            } catch (e) {
                console.error('WebSocket message processing error:', e);
            }
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

        if (url.includes('https://x.com/i/api/1.1/keyregistry/register')) {
            return OriginalFetch.call(this, resource, init);
        }

        if (url.includes('analytics.twitter.com')) {
            init.mode = 'no-cors';
        }

        const fetchPromise = OriginalFetch.call(this, resource, init);

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

        return fetchPromise.catch(error => {
            if (error.message.includes('403') &&
                (url.includes('https://x.com/i/api') || url.includes('https://proxsee.pscp.tv/api'))) {
                return Promise.resolve({ ok: false, status: 403 });
            }
            throw error;
        });
    };

    let transcriptPopup = null;
    let transcriptButton = null;
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
        SPEAKER_DURATIONS: 'xSpacesCustomReactions_speakerDurations',
        CUSTOM_EMOJI_ORDER: 'xSpacesCustomReactions_customEmojiOrder',
        SKIN_TONE: 'xSpacesCustomReactions_skinTone',
        SHOW_LISTENER_TRACKER: 'xSpacesCustomReactions_showListenerTracker'
    };

    function saveSettings() {
        localStorage.setItem(STORAGE_KEYS.LAST_SPACE_ID, currentSpaceId || '');
        localStorage.setItem(STORAGE_KEYS.SHOW_EMOJIS, JSON.stringify(showEmojis));
        localStorage.setItem(STORAGE_KEYS.FLOOD_VISIBLE, JSON.stringify(floodFeaturesVisible));
        localStorage.setItem(STORAGE_KEYS.REPLAY_ENABLED, JSON.stringify(isReplayEnabled));
        localStorage.setItem(STORAGE_KEYS.CUSTOM_EMOJI_ORDER, JSON.stringify(customEmojis));
        localStorage.setItem(STORAGE_KEYS.SKIN_TONE, JSON.stringify(currentSkinTone));
        localStorage.setItem(STORAGE_KEYS.SHOW_LISTENER_TRACKER, JSON.stringify(showListenerTracker));
        const floodSettings = {
            duration: durationSlider ? durationSlider.value : '1',
            interval: intervalSlider ? intervalSlider.value : '4',
            floodMode: floodMode
        };
        localStorage.setItem(STORAGE_KEYS.FLOOD_SETTINGS, JSON.stringify(floodSettings));
    }

    function loadSettings() {
        lastSpaceId = localStorage.getItem(STORAGE_KEYS.LAST_SPACE_ID) || null;
        const savedShowEmojis = localStorage.getItem(STORAGE_KEYS.SHOW_EMOJIS);
        showEmojis = savedShowEmojis ? JSON.parse(savedShowEmojis) : false;
        const savedFloodVisible = localStorage.getItem(STORAGE_KEYS.FLOOD_VISIBLE);
        floodFeaturesVisible = savedFloodVisible ? JSON.parse(savedFloodVisible) : false;
        const savedReplayEnabled = localStorage.getItem(STORAGE_KEYS.REPLAY_ENABLED);
        isReplayEnabled = savedReplayEnabled ? JSON.parse(savedReplayEnabled) : false;
        const savedCustomEmojiOrder = localStorage.getItem(STORAGE_KEYS.CUSTOM_EMOJI_ORDER);
        if (savedCustomEmojiOrder) {
            const loadedEmojis = JSON.parse(savedCustomEmojiOrder);
            if (loadedEmojis.length === defaultCustomEmojis.length && loadedEmojis.every(e =>
                defaultCustomEmojis.includes(e) || Object.values(skinToneEmojis).flat().includes(e))) {
                customEmojis = loadedEmojis;
            }
        }
        const savedSkinTone = localStorage.getItem(STORAGE_KEYS.SKIN_TONE);
        currentSkinTone = savedSkinTone ? JSON.parse(savedSkinTone) : 0;
        const savedShowListenerTracker = localStorage.getItem(STORAGE_KEYS.SHOW_LISTENER_TRACKER);
        showListenerTracker = savedShowListenerTracker ? JSON.parse(savedShowListenerTracker) : false;
        const savedFloodSettings = localStorage.getItem(STORAGE_KEYS.FLOOD_SETTINGS);
        if (savedFloodSettings) {
            const settings = JSON.parse(savedFloodSettings);
            if (durationSlider) durationSlider.value = settings.duration || '1';
            if (intervalSlider) intervalSlider.value = settings.interval || '4';
            floodMode = settings.floodMode || false;
        }
        updateCustomEmojisWithSkinTone();
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

        let emojiButtons = [];

        function renderEmojiGrid() {
            gridContainer.innerHTML = '';
            emojiButtons = [];
            const fragment = document.createDocumentFragment();

            customEmojis.forEach((emoji) => {
                const emojiButton = document.createElement('button');
                emojiButton.setAttribute('aria-label', `React with ${emoji}`);
                emojiButton.className = 'css-175oi2r r-1awozwy r-z2wwpe r-6koalj r-18u37iz r-1w6e6rj r-a2tzq0 r-tuq35u r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l';
                emojiButton.type = 'button';
                emojiButton.style.margin = '5px';
                emojiButton.dataset.emoji = emoji;

                const emojiDiv = document.createElement('div');
                emojiDiv.dir = 'ltr';
                emojiDiv.className = 'css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-1blvdjr r-vrz42v r-16dba41';
                emojiDiv.style.color = 'rgb(231, 233, 234)';
                const emojiImg = document.createElement('img');
                emojiImg.alt = emoji;
                emojiImg.draggable = false;
                emojiImg.src = `https://abs-0.twimg.com/emoji/v2/svg/${getEmojiUnicode(emoji)}.svg?v=${currentSkinTone}`;
                emojiImg.title = emoji;
                emojiImg.className = 'r-4qtqp9 r-dflpy8 r-k4bwe5 r-1kpi4qh r-pp5qcn r-h9hxbl';
                emojiImg.onerror = () => {
                    emojiDiv.innerHTML = emoji;
                };
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

                emojiButtons.push(emojiButton);
                fragment.appendChild(emojiButton);
            });

            gridContainer.appendChild(fragment);
        }

        function updateAffectedEmojis() {
            const handIndicator = document.querySelector('.skin-tone-indicator');
            if (handIndicator) {
                handIndicator.textContent = skinToneEmojis['✋'][currentSkinTone];
            }

            emojiButtons.forEach((button, index) => {
                const emoji = customEmojis[index];
                const baseEmoji = Object.keys(skinToneEmojis).find(key => skinToneEmojis[key].includes(emoji));
                if (baseEmoji) {
                    button.dataset.emoji = emoji;
                    button.setAttribute('aria-label', `React with ${emoji}`);
                    const img = button.querySelector('img');
                    const div = button.querySelector('div');
                    if (img && div) {
                        img.alt = emoji;
                        img.title = emoji;
                        img.src = `https://abs-0.twimg.com/emoji/v2/svg/${getEmojiUnicode(emoji)}.svg?v=${currentSkinTone}`;
                        img.onerror = () => {
                            div.innerHTML = emoji;
                        };
                    }
                }
            });
        }

        renderEmojiGrid();

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
        gridContainer.appendChild(separator);
        gridContainer.appendChild(floodContainer);

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

        const settingsSeparator = document.createElement('div');
        settingsSeparator.style.gridColumn = '1 / -1';
        settingsSeparator.style.height = '1px';
        settingsSeparator.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        settingsSeparator.style.margin = '5px 0';
        settingsSeparator.style.display = showSettings ? 'block' : 'none';
        settingsSeparator.className = 'settings-separator';

        const settingsContainer = document.createElement('div');
        settingsContainer.style.gridColumn = '1 / -1';
        settingsContainer.style.display = showSettings ? 'flex' : 'none';
        settingsContainer.style.alignItems = 'center';
        settingsContainer.style.gap = '10px';
        settingsContainer.style.padding = '5px 10px';
        settingsContainer.style.flexDirection = 'column';
        settingsContainer.className = 'settings-container';

        const skinToneContainer = document.createElement('div');
        skinToneContainer.style.display = 'flex';
        skinToneContainer.style.flexDirection = 'column';
        skinToneContainer.style.width = '100%';
        const skinToneLabel = document.createElement('div');
        skinToneLabel.style.fontSize = '10px';
        skinToneLabel.style.color = 'rgba(231, 233, 234, 0.8)';
        skinToneLabel.textContent = `Skin Tone: ${['Default', 'Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark'][currentSkinTone]}`;
        skinToneContainer.appendChild(skinToneLabel);

        const skinToneWrapper = document.createElement('div');
        skinToneWrapper.style.display = 'flex';
        skinToneWrapper.style.alignItems = 'center';
        skinToneWrapper.style.gap = '5px';
        skinToneWrapper.style.width = '100%';

        const handIndicator = document.createElement('span');
        handIndicator.className = 'skin-tone-indicator';
        handIndicator.textContent = skinToneEmojis['✋'][currentSkinTone];
        handIndicator.style.fontSize = '16px';
        handIndicator.style.cursor = 'default';
        skinToneWrapper.appendChild(handIndicator);

        const skinToneSlider = document.createElement('input');
        skinToneSlider.type = 'range';
        skinToneSlider.min = '0';
        skinToneSlider.max = '5';
        skinToneSlider.value = currentSkinTone;
        skinToneSlider.style.width = '40%';
        skinToneSlider.addEventListener('input', () => {
            currentSkinTone = parseInt(skinToneSlider.value, 10);
            skinToneLabel.textContent = `Skin Tone: ${['Default', 'Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark'][currentSkinTone]}`;
            updateCustomEmojisWithSkinTone();
            saveSettings();
            updateAffectedEmojis();
        });
        skinToneWrapper.appendChild(skinToneSlider);

        skinToneContainer.appendChild(skinToneWrapper);
        settingsContainer.appendChild(skinToneContainer);

        customPickerWrapper.appendChild(settingsSeparator);
        customPickerWrapper.appendChild(settingsContainer);

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

        requestAnimationFrame(() => {
            if (floodInterval) {
                overlay.style.display = 'block';
                const transcriptBtn = transcriptButton && transcriptButton.style.display !== 'none' ? transcriptButton : null;
                const emojiPicker = document.querySelector('.css-175oi2r.r-1awozwy.r-18u37iz.r-9aw3ui.r-1777fci.r-tuq35u');

                if (transcriptBtn) {
                    const rect = transcriptBtn.getBoundingClientRect();
                    overlay.style.left = `${rect.right + window.scrollX + 68}px`;
                    overlay.style.top = `${rect.top + window.scrollY + (rect.height / 2) - (overlay.offsetHeight / 2)}px`;
                } else if (emojiPicker) {
                    const rect = emojiPicker.getBoundingClientRect();
                    overlay.style.left = `${rect.right + window.scrollX + 10}px`;
                    overlay.style.top = `${rect.top + window.scrollY + (rect.height / 2) - (overlay.offsetHeight / 2)}px`;
                } else {
                    overlay.style.left = `${window.innerWidth - 46}px`;
                    overlay.style.top = `${window.innerHeight - 46}px`;
                }
            } else {
                overlay.style.display = 'none';
            }
        });
    }

    function startFlood(emoji, originalEmoji, isHeartFlood = false, isAllFlood = false) {
        if (floodInterval) stopFlood();

        const intervalOptions = [1, 100, 200, 500, 1000, 2000, 3000, 5000];
        const durationOptions = [0, 5000, 10000, 20000, 30000, 60000];

        const intervalValue = intervalOptions[parseInt(intervalSlider.value, 10)];
        const duration = durationOptions[parseInt(durationSlider.value, 10)];

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
        setTimeout(updateFloodOverlayPosition, 100);

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
        const elements = document.elementsFromPoint(left + 18, top + 18);
        return elements.some(el => el.tagName === 'BUTTON' && el !== transcriptButton);
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
                previousHandRaises.clear();
                userIdToParticipantIndex.clear();
                thumbsUpReactions = [];
                thumbsDownReactions = [];
                previousOccupancy = null;
                listenerHistory = [];
                if (transcriptPopup?.style.display === 'block') updateTranscriptPopupImmediate();
                captureSpaceTitle();
                updateTitleBar();
            }
        } else if (!isInSpace && lastSpaceState && !isEndScreen) {
            saveSettings();
            activeHandRaises.clear();
            previousHandRaises.clear();
            userIdToParticipantIndex.clear();
            thumbsUpReactions = [];
            thumbsDownReactions = [];
            if (speakerTimerInterval) {
                clearInterval(speakerTimerInterval);
                speakerTimerInterval = null;
                speakerTimer = 0;
            }
            speakerHistory.clear();
            if (!hasDownloaded && (captionsData.length > 0 || emojiReactions.length > 0)) {
                triggerAutoDownload();
            }
        }

        const endedContainer = detectEndedUI();
        if (endedContainer && lastSpaceState) {
            currentSpaceId = null;
            hasDownloaded = false;
            saveSettings();
            activeHandRaises.clear();
            previousHandRaises.clear();
            userIdToParticipantIndex.clear();
            thumbsUpReactions = [];
            thumbsDownReactions = [];
            transcriptButton.style.display = 'none';
            if (transcriptPopup) transcriptPopup.style.display = 'none';
            if (queueRefreshInterval) {
                clearInterval(queueRefreshInterval);
                queueRefreshInterval = null;
            }
            if (floodInterval) stopFlood();
            triggerAutoDownload();
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

            if (reactionToggle) {
                const reactionButton = reactionToggle.closest('button');
                if (reactionButton) reactionButton.style.opacity = '100';
                createEmojiPickerGrid();
            }
        } else {
            transcriptButton.style.display = 'none';
            if (transcriptPopup) transcriptPopup.style.display = 'none';
            if (queueRefreshInterval) {
                clearInterval(queueRefreshInterval);
                queueRefreshInterval = null;
            }
            if (floodInterval) stopFlood();
        }

        lastSpaceState = isInSpace;
    }

    async function formatTranscriptForDownload() {
        let transcriptText = '';
        let previousSpeaker = { username: '', handle: '' };
        const captionData = captionsData
            .filter(item => item.displayName !== 'System')
            .sort((a, b) => a.timestamp - b.timestamp);

        captureSpaceTitle();

        const spaceUrl = currentSpaceId ? `https://x.com/i/spaces/${currentSpaceId}` : 'Not available';

        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0];

        const liveUrl = dynamicUrl || 'Not available';
        const replayUrl = await fetchReplayUrl(dynamicUrl);

        const header = `--- Space Information ---\n` +
                       `Space Title: ${spaceTitle}\n` +
                       `Space URL: ${spaceUrl}\n` +
                       `Date: ${date}\n` +
                       `Time: ${time}\n` +
                       `\n` +
                       `\n` +
                       `--- Listen To Recording ---\n` +
                       `Live URL: ${liveUrl}\n` +
                       `\n` +
                       `Replay URL: ${replayUrl}\n` +
                       `\n` +
                       `\n` +
                       `--- Instructions ---\n` +
                       `To listen to the replay of an ended unrecorded Space, copy the Replay URL and paste it into VLC ( https://www.videolan.org/vlc/) as a network stream to play it back, or an m3u8 downloader to save it to disk\n` +
                       `Do the same with the Live URL, to listen to a space without showing up as an anonymous listener\n` +
                       `-----------------\n\n`;

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

        return header + transcriptText;
    }

    let lastRenderedCaptionCount = 0;
    let isUserScrolledUp = false;
    let currentFontSize = 14;
    let searchTerm = '';

    function updateVoteCounts() {
        const thumbsUpDisplay = document.querySelector('#thumbs-up-display');
        const thumbsDownDisplay = document.querySelector('#thumbs-down-display');

        if (thumbsUpDisplay) {
            thumbsUpDisplay.textContent = `👍:${thumbsUpReactions.length}`;
        }
        if (thumbsDownDisplay) {
            thumbsDownDisplay.textContent = `👎:${thumbsDownReactions.length}`;
        }
    }

    function pruneOldReactions() {
        const now = Date.now();
        const twoMinutesAgo = now - 120000;
        thumbsUpReactions = thumbsUpReactions.filter(reaction => reaction.timestamp >= twoMinutesAgo);
        thumbsDownReactions = thumbsDownReactions.filter(reaction => reaction.timestamp >= twoMinutesAgo);
        updateVoteCounts();
    }

    function filterTranscript(captions, emojis, term) {
        if (!term) return {
            captions,
            emojis: showEmojis ? emojis : []
        };
        const lowerTerm = term.toLowerCase();
        return {
            captions: captions.filter(caption =>
                caption.text.toLowerCase().includes(lowerTerm) ||
                caption.displayName.toLowerCase().includes(lowerTerm) ||
                (caption.handle && caption.handle.toLowerCase().includes(lowerTerm))
            ),
            emojis: showEmojis ? emojis.filter(emoji =>
                emoji.emoji.toLowerCase().includes(lowerTerm) ||
                emoji.displayName.toLowerCase().includes(lowerTerm) ||
                (emoji.handle && emoji.handle.toLowerCase().includes(lowerTerm))
            ) : []
        };
    }

    function updateGraph() {
        const graphContainer = document.querySelector('#worm-graph');
        if (!graphContainer) return;

        let canvas = graphContainer.querySelector('canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 30;
            graphContainer.appendChild(canvas);
        }

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        canvas.title = `Current listeners: ${previousOccupancy || 'N/A'} / Total participants: ${totalParticipants || 'N/A'}`;

        if (listenerHistory.length < 2) return;

        const points = listenerHistory.slice(-50);
        let minOcc = Math.min(...points.map(p => p.occupancy));
        let maxOcc = Math.max(...points.map(p => p.occupancy));
        let range = maxOcc - minOcc + 1e-6;
        minOcc -= range * 0.1;
        maxOcc += range * 0.1;
        range = maxOcc - minOcc;

        const w = canvas.width;
        const h = canvas.height;
        const paddingLeft = 5;
        const paddingRight = 15;
        const paddingY = 10;
        const effectiveW = w - paddingLeft - paddingRight;
        const effectiveH = h - 2 * paddingY;

        let prevX = paddingLeft;
        let prevY = paddingY + effectiveH - ((points[0].occupancy - minOcc) / range * effectiveH);
        ctx.lineWidth = 2;

        const segmentWidth = effectiveW / 49;

        for (let i = 1; i < points.length; i++) {
            const x = paddingLeft + i * segmentWidth;
            const y = paddingY + effectiveH - ((points[i].occupancy - minOcc) / range * effectiveH);
            const delta = points[i].occupancy - points[i-1].occupancy;
            ctx.strokeStyle = delta > 0 ? 'green' : delta < 0 ? 'red' : 'yellow';

            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(x, y);
            ctx.stroke();

            prevX = x;
            prevY = y;
        }
    }

    function updateTitleBar() {
        if (!transcriptPopup || transcriptPopup.style.display !== 'block') return;

        const titleBar = transcriptPopup.querySelector('#transcript-title-bar');
        if (!titleBar) return;

        captureSpaceTitle();
        const titleText = titleBar.querySelector('#transcript-title-text');
        if (titleText) {
            titleText.textContent = spaceTitle;
            titleText.style.fontFamily = 'TwitterChirp, Arial, sans-serif';
            titleText.style.fontSize = '18px';
            titleText.style.lineHeight = '1.2';
            titleText.style.color = '#1DA1F2';
            titleText.style.wordWrap = 'break-word';
            titleText.style.overflowWrap = 'break-word';
            titleText.style.maxWidth = '300px';
            titleText.style.display = 'inline-block';
            titleText.style.verticalAlign = 'middle';
            titleText.style.position = 'relative';
            titleText.style.paddingLeft = '0';
            titleText.className = 'space-title-text';
        }

        const titleTextWrapper = titleBar.querySelector('#transcript-title-text')?.parentElement;
        if (titleTextWrapper) {
            titleTextWrapper.style.display = 'inline-block';
            titleTextWrapper.style.maxWidth = 'calc(100% - 18px)';
            titleTextWrapper.style.wordWrap = 'break-word';
            titleTextWrapper.style.overflowWrap = 'break-word';
            titleTextWrapper.style.marginLeft = '-18px';
        }

        const recordWrapper = titleBar.querySelector('.record-wrapper');
        if (recordWrapper) {
            recordWrapper.style.zIndex = '12';
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

        const speakerText = titleBar.querySelector('#transcript-speaker-text');
        const timerDisplay = titleBar.querySelector('#transcript-timer-display');
        const recordToggle = titleBar.querySelector('#record-toggle-circle');

        if (speakerText && !timerDisplay) {
            const speakerTextWrapper = speakerText.parentElement;
            speakerText.textContent = currentSpeaker;
            speakerText.style.color = '#FFFF00';
            speakerText.style.whiteSpace = 'normal';
            speakerText.style.wordWrap = 'break-word';
            speakerText.style.overflowWrap = 'break-word';

            const timerSpan = document.createElement('span');
            timerSpan.id = 'transcript-timer-display';
            timerSpan.style.fontSize = '14px';
            timerSpan.style.color = '#00FF00';
            timerSpan.style.marginLeft = '10px';
            timerSpan.textContent = timerText;
            speakerTextWrapper.appendChild(timerSpan);

            speakerTextWrapper.style.display = 'flex';
            speakerTextWrapper.style.alignItems = 'flex-start';
            speakerTextWrapper.style.flexWrap = 'wrap';
            speakerTextWrapper.style.gap = '5px';

            if (!recordToggle) {
                const recordCircle = document.createElement('div');
                recordCircle.id = 'record-toggle-circle';
                recordCircle.style.width = '10px';
                recordCircle.style.height = '10px';
                recordCircle.style.borderRadius = '50%';
                recordCircle.style.backgroundColor = isReplayEnabled ? 'red' : 'white';
                recordCircle.style.border = '3px solid grey';
                recordCircle.style.cursor = 'pointer';
                recordCircle.style.marginRight = '5px';
                recordCircle.style.animation = isReplayEnabled ? 'pulse 1.5s infinite ease-in-out' : 'none';
                recordCircle.style.display = 'inline-block';
                recordCircle.style.verticalAlign = 'middle';
                recordCircle.title = isReplayEnabled ? 'Stop Recording Space' : 'Record Space';
                recordCircle.addEventListener('click', async () => {
                    const newState = !isReplayEnabled;
                    const success = await toggleRecording(newState);
                    if (success) {
                        isReplayEnabled = newState;
                        recordCircle.style.backgroundColor = isReplayEnabled ? 'red' : 'white';
                        recordCircle.style.animation = isReplayEnabled ? 'pulse 1.5s infinite ease-in-out' : 'none';
                        recordCircle.title = isReplayEnabled ? 'Stop Recording Space' : 'Record Space';
                        localStorage.setItem(STORAGE_KEYS.REPLAY_ENABLED, isReplayEnabled);
                    }
                });
                const titleContainer = titleText.closest('.title-container');
                const recordWrapper = titleContainer.querySelector('.record-wrapper');
                if (recordWrapper) {
                    recordWrapper.appendChild(recordCircle);
                }
            }
        } else if (timerDisplay) {
            speakerText.textContent = currentSpeaker;
            speakerText.style.color = '#FFFF00';
            speakerText.style.whiteSpace = 'normal';
            speakerText.style.wordWrap = 'break-word';
            speakerText.style.overflowWrap = 'break-word';
            timerDisplay.textContent = timerText;
            if (recordToggle) {
                recordToggle.style.backgroundColor = isReplayEnabled ? 'red' : 'white';
                recordToggle.style.animation = isReplayEnabled ? 'pulse 1.5s infinite ease-in-out' : 'none';
                recordToggle.title = isReplayEnabled ? 'Stop Recording Space' : 'Record Space';
            }
            const speakerTextWrapper = speakerText.parentElement;
            speakerTextWrapper.style.display = 'flex';
            speakerTextWrapper.style.alignItems = 'flex-start';
            speakerTextWrapper.style.flexWrap = 'wrap';
            speakerTextWrapper.style.gap = '5px';
        }

        const titleBarHeight = titleBar.offsetHeight;
        const controlsHeight = transcriptPopup.querySelector('.controls-container')?.offsetHeight || 40;
        const scrollArea = transcriptPopup.querySelector('#transcript-scrollable');
        if (scrollArea) {
            scrollArea.style.height = `${470 - titleBarHeight - controlsHeight - 20}px`;
        }
    }

    const debouncedUpdateTranscriptPopup = debounce(updateTranscriptPopup, 2000);

    function updateTranscriptPopup() {
        if (!transcriptPopup) return;

        let titleBar = transcriptPopup.querySelector('#transcript-title-bar');
        let scrollArea = transcriptPopup.querySelector('#transcript-scrollable');
        let captionsTab = transcriptPopup.querySelector('#captions-tab');
        let queueTab = transcriptPopup.querySelector('#queue-tab');
        let controlsContainer = transcriptPopup.querySelector('.controls-container');

        if (!titleBar || !scrollArea || !captionsTab || !queueTab || !controlsContainer) {
            transcriptPopup.innerHTML = '';

            titleBar = document.createElement('div');
            titleBar.id = 'transcript-title-bar';
            titleBar.style.position = 'sticky';
            titleBar.style.top = '0';
            titleBar.style.backgroundColor = '#000000';
            titleBar.style.padding = '5px 10px';
            titleBar.style.zIndex = '10';
            titleBar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.3)';
            titleBar.style.display = 'flex';
            titleBar.style.flexDirection = 'column';
            titleBar.style.alignItems = 'flex-start';
            titleBar.style.color = '#e7e9ea';

            const titleContainer = document.createElement('div');
            titleContainer.className = 'title-container';
            titleContainer.style.display = 'flex';
            titleContainer.style.alignItems = 'flex-start';
            titleContainer.style.flexWrap = 'wrap';
            titleContainer.style.width = '100%';

            const recordWrapper = document.createElement('div');
            recordWrapper.className = 'record-wrapper';
            recordWrapper.style.width = '18px';
            recordWrapper.style.height = '18px';
            recordWrapper.style.display = 'inline-block';
            recordWrapper.style.flexShrink = '0';
            recordWrapper.style.zIndex = '12';

            const titleTextWrapper = document.createElement('div');
            titleTextWrapper.style.display = 'inline-block';
            titleTextWrapper.style.maxWidth = 'calc(100% - 18px)';
            titleTextWrapper.style.wordWrap = 'break-word';
            titleTextWrapper.style.overflowWrap = 'break-word';
            titleTextWrapper.style.marginLeft = '-18px';

            const titleText = document.createElement('span');
            titleText.id = 'transcript-title-text';
            titleText.style.fontFamily = 'TwitterChirp, Arial, sans-serif';
            titleText.style.fontSize = '18px';
            titleText.style.cursor = 'pointer';
            titleText.style.color = '#1DA1F2';
            titleText.style.wordWrap = 'break-word';
            titleText.style.overflowWrap = 'break-word';
            titleText.style.lineHeight = '1.2';
            titleText.style.display = 'inline-block';
            titleText.style.verticalAlign = 'middle';
            titleText.title = 'Click to download transcript';
            titleText.addEventListener('click', async () => {
                const transcriptContent = await formatTranscriptForDownload();
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
            titleTextWrapper.appendChild(titleText);

            titleContainer.appendChild(recordWrapper);
            titleContainer.appendChild(titleTextWrapper);
            titleBar.appendChild(titleContainer);

            const speakerContainer = document.createElement('div');
            speakerContainer.style.display = 'flex';
            speakerContainer.style.alignItems = 'center';
            speakerContainer.style.justifyContent = 'space-between';
            speakerContainer.style.width = '100%';

            const speakerTextWrapper = document.createElement('div');
            speakerTextWrapper.style.display = 'flex';
            speakerTextWrapper.style.alignItems = 'flex-start';
            speakerTextWrapper.style.flexWrap = 'wrap';
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
            speakerText.style.color = '#FFFF00';
            speakerText.style.whiteSpace = 'normal';
            speakerText.style.wordWrap = 'break-word';
            speakerText.style.overflowWrap = 'break-word';
            speakerTextWrapper.appendChild(speakerText);

            speakerContainer.appendChild(speakerTextWrapper);
            titleBar.appendChild(speakerContainer);
            transcriptPopup.appendChild(titleBar);

            scrollArea = document.createElement('div');
            scrollArea.id = 'transcript-scrollable';
            scrollArea.style.flex = '1';
            scrollArea.style.overflowY = 'auto';

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

            controlsContainer = document.createElement('div');
            controlsContainer.className = 'controls-container';
            controlsContainer.style.display = 'flex';
            controlsContainer.style.alignItems = 'center';
            controlsContainer.style.padding = '5px 0';
            controlsContainer.style.borderTop = '1px solid rgba(255, 255, 255, 0.3)';
            controlsContainer.style.height = '30px';

            const searchContainer = document.createElement('div');
            searchContainer.id = 'search-container';
            searchContainer.style.display = 'block';
            searchContainer.style.marginRight = '5px';
            searchContainer.style.marginTop = '3px';
            searchContainer.style.width = '150px';
            searchContainer.style.height = '24px';

            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Search transcript..';
            searchInput.style.width = '140px';
            searchInput.style.padding = '5px';
            searchInput.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            searchInput.style.border = 'none';
            searchInput.style.borderRadius = '5px';
            searchInput.style.color = 'white';
            searchInput.style.fontSize = '14px';
            searchInput.value = searchTerm;
            searchInput.className = 'transcript-search-input';
            searchInput.addEventListener('input', (e) => {
                const inputValue = e.target.value.trim().toLowerCase();
                if (inputValue === '!emojis') {
                    showEmojis = true;
                    searchTerm = '';
                    searchInput.value = '';
                    saveSettings();
                    updateTranscriptPopupImmediate();
                } else if (inputValue === '!hideemojis') {
                    showEmojis = false;
                    searchTerm = '';
                    searchInput.value = '';
                    saveSettings();
                    updateTranscriptPopupImmediate();
                } else if (inputValue === '!flood') {
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
                } else if (inputValue === '!hideflood') {
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
                } else if (inputValue === '!settings') {
                    showSettings = true;
                    searchTerm = '';
                    searchInput.value = '';
                    saveSettings();
                    const settingsSeparator = document.querySelector('.settings-separator');
                    const settingsContainer = document.querySelector('.settings-container');
                    if (settingsSeparator) settingsSeparator.style.display = 'block';
                    if (settingsContainer) settingsContainer.style.display = 'flex';
                    updateTranscriptPopupImmediate();
                } else if (inputValue === '!hidesettings') {
                    showSettings = false;
                    searchTerm = '';
                    searchInput.value = '';
                    saveSettings();
                    const settingsSeparator = document.querySelector('.settings-separator');
                    const settingsContainer = document.querySelector('.settings-container');
                    if (settingsSeparator) settingsSeparator.style.display = 'none';
                    if (settingsContainer) settingsContainer.style.display = 'none';
                    updateTranscriptPopupImmediate();
                } else if (inputValue === '!poll') {
                    showPoll = true;
                    showListenerTracker = false;
                    searchTerm = '';
                    searchInput.value = '';
                    saveSettings();
                    updateTranscriptPopupImmediate();
                } else if (inputValue === '!hidepoll') {
                    showPoll = false;
                    searchTerm = '';
                    searchInput.value = '';
                    saveSettings();
                    updateTranscriptPopupImmediate();
                } else if (inputValue === '!bottracker') {
                    showListenerTracker = true;
                    showPoll = false;
                    searchTerm = '';
                    searchInput.value = '';
                    saveSettings();
                    updateTranscriptPopupImmediate();
                } else if (inputValue === '!bottracker') {
                    showListenerTracker = false;
                    searchTerm = '';
                    searchInput.value = '';
                    saveSettings();
                    updateTranscriptPopupImmediate();
                } else if (inputValue === '!commands') {
                    searchTerm = '';
                    searchInput.value = '';
                    const commandListMessage = {
                        displayName: 'System',
                        handle: '',
                        text: 'Available Commands:\n' +
                              '- !emojis: Show emoji reactions in the transcript\n' +
                              '- !hideemojis: Hide emoji reactions in the transcript\n' +
'\n' +
                              '- !settings: Show settings in the emoji picker\n' +
                              '- !hidesettings: Hide settings in the emoji picker\n' +
'\n' +
                              '- !poll: Show thumbs up/down vote counts\n' +
                              '- !hidepoll: Hide thumbs up/down vote counts\n' +
'\n' +
                              '- !bottracker: Show listener tracker graph\n' +
                              '- !hidebottracker: Hide listener tracker graph\n' +
'\n' +
                              '- !commands: List all available commands\n',
                        timestamp: Date.now(),
                        uniqueId: `system-cmd-${Date.now()}`
                    };
                    captionsData.push(commandListMessage);
                    updateTranscriptPopupImmediate();
                } else if (inputValue === '!admincommands') {
                    searchTerm = '';
                    searchInput.value = '';
                    const commandListMessage = {
                        displayName: 'System',
                        handle: '',
                        text: 'Available Commands:\n' +
                              '- !emojis: Show emoji reactions in the transcript\n' +
                              '- !hideemojis: Hide emoji reactions in the transcript\n' +
                        '\n' +
                              '- !flood: Show flood features in the emoji picker\n' +
                              '- !hideflood: Hide flood features in the emoji picker\n' +
                        '\n' +
                              '- !settings: Show settings in the emoji picker\n' +
                              '- !hidesettings: Hide settings in the emoji picker\n' +
                        '\n' +
                              '- !poll: Show thumbs up/down vote counts\n' +
                              '- !hidepoll: Hide thumbs up/down vote counts\n' +
                        '\n' +
                              '- !bottracker: Show listener tracker graph\n' +
                              '- !hidebottracker: Hide listener tracker graph\n' +
                        '\n' +
                              '- !commands: List all available commands\n' +
                              '- !admincommands: List all available commands (+ Admin commands)',
                        timestamp: Date.now(),
                        uniqueId: `system-admincmd-${Date.now()}`
                    };
                    captionsData.push(commandListMessage);
                    updateTranscriptPopupImmediate();
                } else {
                    searchTerm = e.target.value.trim();
                    updateTranscriptPopupImmediate();
                }
                lastRenderedCaptionCount = 0;
            });

            searchContainer.appendChild(searchInput);

            const graphContainer = document.createElement('div');
            graphContainer.id = 'worm-graph';
            graphContainer.style.marginLeft = '0px';
            graphContainer.style.width = '100px';
            graphContainer.style.height = '30px';
            graphContainer.style.display = showListenerTracker ? 'block' : 'none';

            const voteContainer = document.createElement('div');
            voteContainer.id = 'vote-container';
            voteContainer.style.display = showPoll ? 'flex' : 'none';
            voteContainer.style.alignItems = 'center';
            voteContainer.style.gap = '10px';
            voteContainer.style.marginRight = '5px';
            voteContainer.style.marginTop = '8px';

            const thumbsUpDisplay = document.createElement('span');
            thumbsUpDisplay.id = 'thumbs-up-display';
            thumbsUpDisplay.style.color = '#00FF00';
            thumbsUpDisplay.style.fontSize = '14px';
            thumbsUpDisplay.textContent = `👍:${thumbsUpReactions.length}`;
            voteContainer.appendChild(thumbsUpDisplay);

            const thumbsDownDisplay = document.createElement('span');
            thumbsDownDisplay.id = 'thumbs-down-display';
            thumbsDownDisplay.style.color = '#FF0000';
            thumbsDownDisplay.style.fontSize = '14px';
            thumbsDownDisplay.textContent = `👎:${thumbsDownReactions.length}`;
            voteContainer.appendChild(thumbsDownDisplay);

            const averageWaitContainer = document.createElement('div');
            averageWaitContainer.id = 'average-wait-container';
            averageWaitContainer.style.display = 'none';
            averageWaitContainer.style.marginRight = '5px';
            averageWaitContainer.style.marginTop = '3px';
            averageWaitContainer.style.width = '200px';
            averageWaitContainer.style.height = '24px';
            averageWaitContainer.style.color = 'red';
            averageWaitContainer.style.fontSize = '14px';
            averageWaitContainer.style.lineHeight = '24px';
            averageWaitContainer.style.textAlign = 'left';

            const style = document.createElement('style');
            style.textContent = `
                .transcript-search-input::placeholder {
                    opacity: 0.4;
                }
                .controls-container {
                    box-sizing: border-box;
                }
                .username-link:hover {
                    color: #0a8cd7 !important;
                    text-decoration: underline;
                }
                #transcript-title-text:hover {
                    color: #0a8cd7 !important;
                }
                .space-title-text {
                    display: inline-block;
                    position: relative;
                    z-index: 10;
                }
                .space-title-text::before {
                    content: '';
                    display: inline-block;
                    width: 18px;
                    height: 0;
                }
            `;
            document.head.appendChild(style);

            const spacer = document.createElement('div');
            spacer.style.flex = '1';

            const controlsRight = document.createElement('div');
            controlsRight.style.display = 'flex';
            controlsRight.style.alignItems = 'center';
            controlsRight.style.gap = '5px';

            const tabToggle = document.createElement('span');
            tabToggle.style.fontSize = '18px';
            tabToggle.style.cursor = 'pointer';
            tabToggle.style.marginTop = '10px';

            const textSizeContainer = document.createElement('div');
            textSizeContainer.className = 'text-size-container';
            textSizeContainer.style.display = 'flex';
            textSizeContainer.style.alignItems = 'center';

            const textSizeSlider = document.createElement('input');
            textSizeSlider.type = 'range';
            textSizeSlider.min = '12';
            textSizeSlider.max = '18';
            textSizeSlider.value = currentFontSize;
            textSizeSlider.style.width = '50px';
            textSizeSlider.style.cursor = 'pointer';
            textSizeSlider.style.marginTop = '10px';
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

            textSizeContainer.appendChild(tabToggle);
            textSizeContainer.appendChild(textSizeSlider);

            controlsRight.appendChild(tabToggle);
            controlsRight.appendChild(textSizeContainer);

            controlsContainer.appendChild(searchContainer);
            controlsContainer.appendChild(graphContainer);
            controlsContainer.appendChild(voteContainer);
            controlsContainer.appendChild(averageWaitContainer);
            controlsContainer.appendChild(spacer);
            controlsContainer.appendChild(controlsRight);

            transcriptPopup.appendChild(controlsContainer);
            lastRenderedCaptionCount = 0;

            const updateTabToggle = () => {
                if (captionsTab.style.display === 'block') {
                    tabToggle.textContent = '✋';
                    tabToggle.title = 'View Speaking Queue';
                    tabToggle.onclick = () => {
                        captionsTab.style.display = 'none';
                        queueTab.style.display = 'block';
                        searchContainer.style.display = 'none';
                        voteContainer.style.display = 'none';
                        graphContainer.style.display = 'none';
                        averageWaitContainer.style.display = 'block';
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
                        searchContainer.style.display = 'block';
                        voteContainer.style.display = showPoll ? 'flex' : 'none';
                        graphContainer.style.display = showListenerTracker ? 'block' : 'none';
                        averageWaitContainer.style.display = 'none';
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
        const searchContainer = controlsContainer.querySelector('#search-container');
        const graphContainer = controlsContainer.querySelector('#worm-graph');
        const averageWaitContainer = controlsContainer.querySelector('#average-wait-container');

        if (captionsTab.style.display === 'block') {
            searchContainer.style.display = 'block';
            controlsContainer.querySelector('#vote-container').style.display = showPoll ? 'flex' : 'none';
            graphContainer.style.display = showListenerTracker ? 'block' : 'none';
            averageWaitContainer.style.display = 'none';
            const { captions: filteredCaptions, emojis: filteredEmojis } = filterTranscript(captionsData, emojiReactions, searchTerm);
            const totalItems = filteredCaptions.length + filteredEmojis.length;

            if (captionWrapper) {
                captionWrapper.innerHTML = '';
                let previousSpeaker = lastSpeaker;
                let lastRenderedSpeaker = null;

                const combinedData = [
                    ...filteredCaptions.map(item => ({ ...item, type: 'caption' })),
                    ...filteredEmojis.map(item => ({ ...item, type: 'emoji' }))
                ].sort((a, b) => a.timestamp - b.timestamp);

                const dataToRender = searchTerm ? combinedData : combinedData.slice(-100);

                // Group emojis by user and emoji to count occurrences
                const emojiCounts = new Map();
                dataToRender.forEach(item => {
                    if (item.type === 'emoji') {
                        const key = `${item.displayName}-${item.handle}-${item.emoji}`;
                        if (!emojiCounts.has(key)) {
                            emojiCounts.set(key, {
                                displayName: item.displayName,
                                handle: item.handle,
                                emoji: item.emoji,
                                count: 0,
                                timestamp: item.timestamp,
                                uniqueIds: new Set()
                            });
                        }
                        const group = emojiCounts.get(key);
                        if (!group.uniqueIds.has(item.uniqueId)) {
                            group.count++;
                            group.uniqueIds.add(item.uniqueId);
                            group.timestamp = item.timestamp; // Update to latest timestamp
                        }
                    }
                });

                const emojiGroups = Array.from(emojiCounts.values()).map(group => ({
                    type: 'emoji',
                    displayName: group.displayName,
                    handle: group.handle,
                    emoji: group.emoji,
                    count: group.count,
                    timestamp: group.timestamp
                }));

                const renderData = [
                    ...dataToRender.filter(item => item.type === 'caption'),
                    ...emojiGroups
                ].sort((a, b) => a.timestamp - b.timestamp);

                renderData.forEach((item, i) => {
                    if (item.type === 'caption') {
                        let { displayName, handle, text } = item;
                        if (displayName === 'Unknown' && previousSpeaker.username) {
                            displayName = previousSpeaker.username;
                            handle = previousSpeaker.handle;
                        }
                        if (i > 0 && lastRenderedSpeaker !== displayName) {
                            captionWrapper.insertAdjacentHTML('beforeend', '<div style="border-top: 1px solid rgba(255, 255, 255, 0.3); margin: 5px 0;"></div>');
                        }
                        const nameElement = displayName === 'System' ?
                            `<span style="font-size: ${currentFontSize}px; color: #00FF00">${displayName}</span>` :
                            `<a href="https://spacesdashboard.com/u/${handle.slice(1)}" target="_blank" rel="noopener noreferrer" class="username-link" style="font-size: ${currentFontSize}px; color: #1DA1F2; text-decoration: none;">${displayName}</a>`;
                        let textWithLinks = text;
                        if (displayName === 'System') {
                            if (text.includes('𝕏spaces+ Created by')) {
                                textWithLinks = text.replace('@blankspeaker', `<a href="https://x.com/blankspeaker" target="_blank" rel="noopener noreferrer" class="username-link" style="font-size: ${currentFontSize}px; color: #1DA1F2; text-decoration: none;">@blankspeaker</a>`)
                                            .replace('@PrestonHenshawX', `<a href="https://x.com/PrestonHenshawX" target="_blank" rel="noopener noreferrer" class="username-link" style="font-size: ${currentFontSize}px; color: #1DA1F2; text-decoration: none;">@PrestonHenshawX</a>`);
                            }
                        } else {
                            textWithLinks = text.replace(/@(\w+)/g, (match, username) =>
                                `<a href="https://spacesdashboard.com/u/${username}" target="_blank" rel="noopener noreferrer" class="username-link" style="font-size: ${currentFontSize}px; color: #1DA1F2; text-decoration: none;">@${username}</a>`
                            );
                        }
                        captionWrapper.insertAdjacentHTML('beforeend',
                            `${nameElement} ` +
                            `<span style="font-size: ${currentFontSize}px; color: #808080">${handle}</span><br>` +
                            `<span style="font-size: ${currentFontSize}px; color: #FFFFFF">${textWithLinks}</span><br><br>`
                        );
                        lastRenderedSpeaker = displayName;
                        if (displayName !== 'System') {
                            previousSpeaker = { username: displayName, handle };
                            lastSpeaker = { username: displayName, handle };
                        }
                    } else if (showEmojis && item.type === 'emoji') {
                        let { displayName, handle, emoji, count } = item;
                        if (displayName === 'Unknown' && previousSpeaker.username) {
                            displayName = previousSpeaker.username;
                            handle = previousSpeaker.handle;
                        }
                        if (i > 0 && lastRenderedSpeaker !== displayName) {
                            captionWrapper.insertAdjacentHTML('beforeend', '<div style="border-top: 1px solid rgba(255, 255, 255, 0.3); margin: 5px 0;"></div>');
                        }
                        const nameElement = `<span style="font-size: ${currentFontSize}px; color: #FFD700">${displayName}</span>`;
                        const countText = count > 1 ? ` <span style="font-size: ${currentFontSize}px; color: #FFD700">x${count}</span>` : '';
                        captionWrapper.insertAdjacentHTML('beforeend',
                            `${nameElement} ` +
                            `<span style="font-size: ${currentFontSize}px; color: #FFFFFF">reacted with ${emoji}${countText}</span><br>`
                        );
                        lastRenderedSpeaker = displayName;
                        previousSpeaker = { username: displayName, handle };
                    }
                });

                lastSpeaker = lastSpeaker; // Explicitly retain lastSpeaker
                lastRenderedCaptionCount = totalItems;

                if (scrollArea && !isUserScrolledUp && !searchTerm) scrollArea.scrollTop = scrollArea.scrollHeight;
            }

            if (scrollArea) {
                scrollArea.onscroll = () => {
                    isUserScrolledUp = scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight > 50;
                };
            }
        } else if (queueTab.style.display === 'block') {
            searchContainer.style.display = 'none';
            controlsContainer.querySelector('#vote-container').style.display = 'none';
            graphContainer.style.display = 'none';
            averageWaitContainer.style.display = 'block';
            updateHandQueueContent(queueContent);
        }

        updateTitleBar();
        updateVoteCounts();
        updateGraph();
    }

    function updateHandQueueContent(queueContent) {
        if (!queueContent) return;

        queueContent.innerHTML = `<strong style="font-size: ${currentFontSize + 3}px;">Speaking Queue</strong><br>`;
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

            sortedQueue.forEach(([, { displayName, handle, timestamp }], index) => {
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
                const nameElement = (displayName !== 'System' && handle && handle !== '@Unknown') ?
                    `<a href="https://spacesdashboard.com/u/${handle.slice(1)}" target="_blank" rel="noopener noreferrer" class="username-link" style="font-size: ${currentFontSize + 3}px; color: #e7e9ea; text-decoration: none;">${displayName}</a>` :
                    `<span style="font-size: ${currentFontSize + 3}px; color: #e7e9ea">${displayName}</span>`;
                text.innerHTML = `${positionEmoji} ${nameElement}: ${timeStr}`;

                entry.appendChild(text);
                queueList.appendChild(entry);
            });

            queueContent.appendChild(queueList);
        }

        const averageWaitContainer = transcriptPopup.querySelector('#average-wait-container');
        if (averageWaitContainer && (handRaiseDurations.length > 0 || handQueue.size > 0)) {
            let avgStr;
            if (averageWaitTime >= 3600) {
                const hours = Math.floor(averageWaitTime / 3600);
                const minutes = Math.floor((averageWaitTime % 3600) / 60);
                const seconds = Math.floor(averageWaitTime % 60);
                avgStr = `${hours}h ${minutes}m ${seconds}s`;
            } else {
                const minutes = Math.floor(averageWaitTime / 60);
                const seconds = Math.floor(averageWaitTime % 60);
                avgStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
            }
            averageWaitContainer.textContent = `Average Wait: ${avgStr}`;
        } else if (averageWaitContainer) {
            averageWaitContainer.textContent = '';
        }
    }

    function checkRecordingState() {
        const recButton = document.querySelector('button[aria-label="Recording active"]');
        const newState = !!recButton;
        if (newState !== isReplayEnabled) {
            isReplayEnabled = newState;
            localStorage.setItem(STORAGE_KEYS.REPLAY_ENABLED, isReplayEnabled);
            const recordToggle = document.querySelector('#record-toggle-circle');
            if (recordToggle) {
                recordToggle.style.backgroundColor = isReplayEnabled ? 'red' : 'white';
                recordToggle.style.animation = isReplayEnabled ? 'pulse 1.5s infinite ease-in-out' : 'none';
                recordToggle.title = isReplayEnabled ? 'Stop Recording Space' : 'Record Space';
            }
        }
    }

    function init() {
        captureSpaceTitle();

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

        transcriptButton.addEventListener('mouseover', () => {
            transcriptButton.style.backgroundColor = '#595b5b40';
        });
        transcriptButton.addEventListener('mouseout', () => {
            transcriptButton.style.backgroundColor = 'transparent';
        });
        transcriptButton.addEventListener('click', () => {
            const isVisible = transcriptPopup.style.display === 'block';
            transcriptPopup.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) {
                updateTranscriptPopupImmediate();
                if (!timerInterval) {
                    let lastTimerTime = Date.now();
                    timerInterval = requestAnimationFrame(function updateTimer() {
                        const now = Date.now();
                        if (now - lastTimerTime >= 1000 && transcriptPopup?.style.display === 'block') {
                            const queueTab = transcriptPopup.querySelector('#queue-tab');
                            if (queueTab?.style.display === 'block') {
                                updateHandQueueContent(queueTab.querySelector('#hand-queue-content'));
                            }
                            const captionsTab = transcriptPopup.querySelector('#captions-tab');
                            if (captionsTab?.style.display === 'block' && previousOccupancy !== null) {
                                listenerHistory.push({ timestamp: now, occupancy: previousOccupancy });
                                if (listenerHistory.length > 100) listenerHistory.shift();
                                updateGraph();
                            }
                            lastTimerTime = now;
                        }
                        timerInterval = requestAnimationFrame(updateTimer);
                    });
                }
            } else if (timerInterval) {
                cancelAnimationFrame(timerInterval);
                timerInterval = null;
            }
        });

        document.addEventListener('click', (event) => {
            if (transcriptPopup.style.display === 'block' &&
                !transcriptPopup.contains(event.target) &&
                !transcriptButton.contains(event.target)) {
                transcriptPopup.style.display = 'none';
                if (timerInterval) {
                    cancelAnimationFrame(timerInterval);
                    timerInterval = null;
                }
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
        transcriptPopup.style.height = '470px';
        transcriptPopup.style.display = 'none';
        transcriptPopup.style.width = '340px';
        transcriptPopup.style.color = 'white';
        transcriptPopup.style.fontSize = '14px';
        transcriptPopup.style.lineHeight = '1.5';
        transcriptPopup.style.boxShadow = '0 0 5px 2px rgba(255, 255, 255, 0.2), 0 2px 10px rgba(0, 0, 0, 0.5)';
        transcriptPopup.style.flexDirection = 'column';
        transcriptPopup.style.display = 'flex';

        document.body.appendChild(transcriptButton);
        document.body.appendChild(transcriptPopup);

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
        floodOverlay.setAttribute('aria-label', 'Stop emoji flood');
        floodOverlay.title = 'Stop emoji flood';
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
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.3); }
                100% { transform: scale(1); }
            }
            .username-link:hover {
                color: #0a8cd7 !important;
                text-decoration: underline;
            }
            #transcript-title-text:hover {
                color: #0a8cd7 !important;
            }
            .space-title-text {
                display: inline-block;
                position: relative;
                z-index: 10;
            }
            .space-title-text::before {
                content: '';
                display: inline-block;
                width: 18px;
                height: 0;
            }
        `;
        document.head.appendChild(style);

        speakerTimer = 0;
        speakerHistory.clear();
        loadSettings();

        setInterval(pruneOldReactions, 15000);

        const setupFloodOverlayObserver = () => {
            const observer = new ResizeObserver(() => {
                if (floodInterval) updateFloodOverlayPosition();
            });
            if (transcriptButton) observer.observe(transcriptButton);
            const emojiPicker = document.querySelector('.css-175oi2r.r-1awozwy.r-18u37iz.r-9aw3ui.r-1777fci.r-tuq35u');
            if (emojiPicker) observer.observe(emojiPicker);
            document.addEventListener('scroll', () => {
                if (floodInterval) updateFloodOverlayPosition();
            }, { passive: true });
        };

        const handleStartListeningClick = () => {
            for (const [roomId, wsSet] of websocketMap) {
                wsSet.forEach(ws => ws.close());
            }
            websocketMap.clear();
            allowNewConnection = true;

            checkRecordingState();
        };

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

                const spaceTitleContainer = document.querySelector('div[dir="auto"][data-testid="tweetText"].css-146c3p1.r-bcqeeo.r-1ttztb7.r-qvutc0.r-37j5jr.r-adyw6z.r-135wba7.r-1vr29t4.r-bnwqim.r-13awgt0');
                if (spaceTitleContainer) {
                    const titleObserver = new MutationObserver(() => {
                        captureSpaceTitle();
                        updateTitleBar();
                    });
                    titleObserver.observe(spaceTitleContainer, { childList: true, characterData: true, subtree: true });
                } else {
                    setTimeout(setupTitleObserver, 500);
                }
            } catch (e) {}
        }
        setupTitleObserver();

        const setupRecordingObserver = () => {
            const parentContainer = document.querySelector('div.css-175oi2r.r-18u37iz.r-1yvhe1m.r-5oul0u.r-7ce9ev');
            if (parentContainer) {
                const observer = new MutationObserver(() => {
                    checkRecordingState();
                });
                observer.observe(parentContainer, { childList: true, subtree: true });
            } else {
                setTimeout(setupRecordingObserver, 500);
            }
        };
        setupRecordingObserver();

        setInterval(checkRecordingState, 5000);

        setInterval(() => {
            try {
                if (document.title.toLowerCase().includes('this space has ended') && !hasDownloaded && (captionsData.length > 0 || emojiReactions.length > 0)) {
                    currentSpaceId = null;
                    triggerAutoDownload();
                }
            } catch (e) {}
        }, 10000);

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

                    const emojiPicker = document.querySelector('.css-175oi2r.r-1awozwy.r-18u37iz.r-9aw3ui.r-1777fci.r-tuq35u');
                    if (emojiPicker && floodInterval) updateFloodOverlayPosition();
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        setupFloodOverlayObserver();
        updateVisibilityAndPosition();
        setInterval(updateVisibilityAndPosition, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();