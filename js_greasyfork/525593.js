// ==UserScript==
// @name         X Spaces Plus
// @namespace    Violentmonkey Scripts
// @version      1.83
// @description  Addon for X Spaces with custom emojis, better transcript, replay, speaker queuing, flood mode, skin tone support, persistent picker settings, and live URL copying in Share dropdown.
// @author       x.com/blankspeaker and x.com/PrestonHenshawX
// @match        https://twitter.com/*
// @match        https://x.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525593/X%20Spaces%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/525593/X%20Spaces%20Plus.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const OrigWebSocket = window.WebSocket;
    const OrigXMLHttpRequest = window.XMLHttpRequest;
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
    let stayOpen = true;
    let floodInterval = null;
    let timerInterval = null;
    let dynamicEmojis = false; // Default to off
    let enableDragToReposition = true;
    let currentSkinTone = 0;
    let customFloodBaseEmojis = [];
    let allEmojisFlood = [];

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

    const originalEmojis = ['😂', '😲', '😢', '💜', '💯', '👏', '✊', '👍', '👎', '👋'];
    const emojiMap = new Map();
    customEmojis.forEach((emoji, index) => {
        const originalEmoji = originalEmojis[index % originalEmojis.length];
        emojiMap.set(emoji, originalEmoji);
    });

    const skinToneEmojis = {
        '✌️': ['✌️', '✌🏻', '✌🏼', '✌🏽', '✌🏾', '✌🏿'],
        '👏': ['👏', '👏🏻', '👏🏼', '👏🏽', '👏🏾', '👏🏿'],
        '✊': ['✊', '✊🏻', '✊🏼', '✊🏽', '✊🏾', '✊🏿'],
        '👍': ['👍', '👍🏻', '👍🏼', '👍🏽', '👍🏾', '👍🏿'],
        '👎': ['👎', '👎🏻', '👎🏼', '👎🏽', '👎🏾', '👎🏿'],
        '👋': ['👋', '👋🏻', '👋🏼', '👋🏽', '👋🏾', '👋🏿'],
        '✋': ['✋', '✋🏻', '✋🏼', '✋🏽', '✋🏾', '✋🏿'],
        '🙌': ['🙌', '🙌🏻', '🙌🏼', '🙌🏽', '🙌🏾', '🙌🏿'],
        '🙏': ['🙏', '🙏🏻', '🙏🏼', '🙏🏽', '🙏🏾', '🙏🏿']
    };

    const heartEmojis = ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤎'];
    const excludedEmojis = ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤎',
                           '😂', '😲', '😢', '💯',
                           '👏', '👏🏻', '👏🏼', '👏🏽', '👏🏾', '👏🏿',
                           '✊', '✊🏻', '✊🏼', '✊🏽', '✊🏾', '✊🏿',
                           '👍', '👍🏻', '👍🏼', '👍🏽', '👍🏾', '👍🏿',
                           '👎', '👎🏻', '👎🏼', '👎🏽', '👎🏾', '👎🏿',
                           '👋', '👋🏻', '👋🏼', '👋🏽', '👋🏾', '👋🏿'];

    let customPicker = null;
    let toggleButton = null;
    let settingsPopup = null;
    let settingsContainer = null;
    let timerDisplay = null;
    let durationSlider = null;
    let intervalSlider = null;
    let quickFloodSlider = null;
    let settingsButton = null;
    let heartButton = null;
    let allButton = null;
    let customButton = null;
    let heartCycleInterval = null;
    let allCycleInterval = null;
    let customCycleInterval = null;
    let autoFloodEnabled = false;
    let skinToneSlider = null;
    let floodModeText = null;
    let draggedButton = null;
    let touchStartTime = 0;
    let touchMoved = false;

    async function fetchReplayUrl(dynUrl) {
        if (!dynUrl || !dynUrl.includes('/dynamic_playlist.m3u8?type=live')) {
            return 'Invalid Dynamic URL';
        }
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

    function getSpaceIdFromUrl() {
        const urlMatch = window.location.pathname.match(/\/i\/spaces\/([^/]+)/);
        return urlMatch ? urlMatch[1] : null;
    }

    function getBaseEmoji(emoji) {
        for (const base in skinToneEmojis) {
            if (skinToneEmojis[base].includes(emoji)) return base;
        }
        return emoji;
    }

    function updateAllEmojisFlood() {
        allEmojisFlood = customEmojis.map(emoji => {
            const baseEmoji = getBaseEmoji(emoji);
            return skinToneEmojis[baseEmoji] ? skinToneEmojis[baseEmoji][currentSkinTone] : emoji;
        }).filter(emoji => !excludedEmojis.includes(emoji));
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
                                const baseEmoji = getBaseEmoji(emojiToSend);
                                const modifiedEmoji = skinToneEmojis[baseEmoji] ? skinToneEmojis[baseEmoji][currentSkinTone] : emojiToSend;
                                const bodyParsed = JSON.parse(payloadParsed.body);
                                if (bodyParsed.type === 2) {
                                    bodyParsed.body = modifiedEmoji;
                                    payloadParsed.body = JSON.stringify(bodyParsed);
                                    parsed.payload = JSON.stringify(payloadParsed);
                                    data = JSON.stringify(parsed);
                                    if (parsed.sender && parsed.sender.user_id) {
                                        myUserId = parsed.sender.user_id;
                                    }
                                }
                            }
                        } catch (e) {}
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
                if (message.kind !== 1 || !message.payload) return;

                const payload = JSON.parse(message.payload);
                const body = payload.body ? JSON.parse(payload.body) : null;
                const payloadString = JSON.stringify(payload);

                if (payload.room && !roomId) {
                    roomId = payload.room;
                    if (!websocketMap.has(roomId)) {
                        websocketMap.set(roomId, new Set());
                    }
                    websocketMap.get(roomId).add(ws);
                }

                if (allowNewConnection && roomId) {
                    currentSpaceId = roomId;
                    if (roomId !== lastSpaceId) {
                        captionsData = [];
                        emojiReactions = [];
                        lastSpeaker = { username: '', handle: '' };
                        lastRenderedCaptionCount = 0;
                        if (transcriptPopup) {
                            const captionWrapper = transcriptPopup.querySelector('#transcript-output');
                            if (captionWrapper) captionWrapper.innerHTML = '';
                        }
                    }
                    allowNewConnection = false;
                    lastSpaceId = currentSpaceId;
                    saveSettings();
                }

                if (roomId && roomId !== currentSpaceId) {
                    return;
                }

                if (payloadString.includes('dynamic_playlist.m3u8?type=live')) {
                    const urlMatch = payloadString.match(/https:\/\/prod-fastly-[^/]+?\.video\.pscp\.tv\/[^"]+?dynamic_playlist\.m3u8\?type=live/);
                    if (urlMatch) dynamicUrl = urlMatch[0];
                }

                const participantIndex = body?.guestParticipantIndex || payload.sender?.participant_index || 'unknown';
                const displayName = payload.sender?.display_name || body?.displayName || 'Unknown';
                const handle = payload.sender?.username || body?.username || 'Unknown';
                const timestamp = message.timestamp / 1e6 || Date.now();

                if ((body?.emoji === '✋' || (body?.body && body.body.includes('✋'))) && body?.type !== 2) {
                    handQueue.set(participantIndex, { displayName, timestamp });
                    activeHandRaises.set(participantIndex, timestamp);
                } else if (body?.type === 40 && body?.emoji === '') {
                    if (handQueue.has(participantIndex) && activeHandRaises.has(participantIndex)) {
                        const startTime = activeHandRaises.get(participantIndex);
                        const duration = (timestamp - startTime) / 1000;
                        const sortedQueue = Array.from(handQueue.entries())
                            .sort(([, a], [, b]) => a.timestamp - b.timestamp);
                        if (sortedQueue.length > 0 && sortedQueue[0][0] === participantIndex && duration >= 60) {
                            handRaiseDurations.push(duration);
                            if (handRaiseDurations.length > 50) {
                                handRaiseDurations.shift();
                            }
                        }
                        handQueue.delete(participantIndex);
                        activeHandRaises.delete(participantIndex);
                    }
                } else if (body?.type === 45 && body.body && handQueue.has(participantIndex)) {
                    const startTime = activeHandRaises.get(participantIndex);
                    if (startTime) {
                        const duration = (timestamp - startTime) / 1000;
                        const sortedQueue = Array.from(handQueue.entries())
                            .sort(([, a], [, b]) => a.timestamp - b.timestamp);
                        if (sortedQueue.length > 0 && sortedQueue[0][0] === participantIndex && duration >= 60) {
                            handRaiseDurations.push(duration);
                            if (handRaiseDurations.length > 50) {
                                handRaiseDurations.shift();
                            }
                        }
                        handQueue.delete(participantIndex);
                        activeHandRaises.delete(participantIndex);
                    }
                }

                if (body?.type === 45 && body.body) {
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
                        captionsData.push(caption);
                        if (transcriptPopup && transcriptPopup.style.display === 'block') {
                            updateTranscriptPopup();
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
                        if (transcriptPopup && transcriptPopup.style.display === 'block') {
                            debouncedUpdateTranscriptPopup();
                        }
                    }
                }

                if (transcriptPopup && transcriptPopup.style.display === 'block') debouncedUpdateTranscriptPopup();
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

        ws.onclose = function () {
            if (roomId && websocketMap.has(roomId)) {
                websocketMap.get(roomId).delete(ws);
                if (websocketMap.get(roomId).size === 0) {
                    websocketMap.delete(roomId);
                }
            }
        };

        ws.onerror = function (error) {};

        return ws;
    };

    window.XMLHttpRequest = function () {
        const xhr = new OrigXMLHttpRequest();
        const originalOpen = xhr.open;

        xhr.open = function (method, url, async, user, password) {
            if (typeof url === 'string' && url.includes('dynamic_playlist.m3u8?type=live')) {
                dynamicUrl = url;
            }
            return originalOpen.apply(this, arguments);
        };

        return xhr;
    };

    let transcriptPopup = null;
    let transcriptButton = null;
    let queueRefreshInterval = null;
    const handQueue = new Map();
    let lastSpaceState = false;
    let lastSpeaker = { username: '', handle: '' };

    const STORAGE_KEYS = {
        LAST_SPACE_ID: 'xSpacesCustomReactions_lastSpaceId',
        HAND_DURATIONS: 'xSpacesCustomReactions_handRaiseDurations',
        SHOW_EMOJIS: 'xSpacesCustomReactions_showEmojis',
        SETTINGS: 'xSpacesCustomReactions_settings',
        EMOJI_ORDER: 'xSpacesCustomReactions_emojiOrder'
    };

    const debouncedUpdateTranscriptPopup = debounce(updateTranscriptPopup, 2000);

    function saveSettings() {
        const settings = {
            stayOpen: stayOpen,
            dynamicEmojis: dynamicEmojis,
            enableDragToReposition: enableDragToReposition,
            currentSkinTone: currentSkinTone,
            duration: durationSlider ? durationSlider.value : '10',
            interval: intervalSlider ? intervalSlider.value : '1',
            customFloodBaseEmojis: customFloodBaseEmojis
        };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        localStorage.setItem(STORAGE_KEYS.LAST_SPACE_ID, currentSpaceId || '');
        localStorage.setItem(STORAGE_KEYS.HAND_DURATIONS, JSON.stringify(handRaiseDurations));
    }

    function loadSettings() {
        const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            stayOpen = settings.stayOpen !== undefined ? settings.stayOpen : true;
            dynamicEmojis = settings.dynamicEmojis || false; // Will load saved value or default to false
            enableDragToReposition = settings.enableDragToReposition !== undefined ? settings.enableDragToReposition : true;
            currentSkinTone = settings.currentSkinTone || 0;
            customFloodBaseEmojis = settings.customFloodBaseEmojis || [];
            if (durationSlider) durationSlider.value = settings.duration || '10';
            if (intervalSlider) intervalSlider.value = settings.interval || '1';
            if (skinToneSlider) {
                skinToneSlider.value = currentSkinTone;
                skinToneSlider.dispatchEvent(new Event('input'));
            }
            updateAllEmojisFlood();
            updateCustomFloodCheckboxes();
        } else {
            currentSkinTone = 0;
            updateAllEmojisFlood();
        }
        lastSpaceId = localStorage.getItem(STORAGE_KEYS.LAST_SPACE_ID) || null;
        const savedDurations = localStorage.getItem(STORAGE_KEYS.HAND_DURATIONS);
        if (savedDurations) {
            handRaiseDurations = JSON.parse(savedDurations);
        }
    }

    function saveEmojiOrder() {
        const buttons = customPicker ? customPicker.querySelectorAll('.emoji-button') : [];
        const emojiOrder = Array.from(buttons).map(button => button.textContent);
        localStorage.setItem(STORAGE_KEYS.EMOJI_ORDER, JSON.stringify(emojiOrder));
    }

    function loadEmojiOrder() {
        const savedOrder = localStorage.getItem(STORAGE_KEYS.EMOJI_ORDER);
        if (savedOrder && customPicker) {
            const emojiOrder = JSON.parse(savedOrder);
            const buttons = customPicker.querySelectorAll('.emoji-button');
            buttons.forEach((button, index) => {
                if (emojiOrder[index]) {
                    button.textContent = emojiOrder[index];
                    button.title = `React with ${emojiOrder[index]}`;
                }
            });
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
        if (!emojiPicker) return;

        if (emojiPicker.querySelector('.emoji-grid-container')) return;

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

                const baseEmoji = getBaseEmoji(emoji);
                const modifiedEmoji = skinToneEmojis[baseEmoji] ? skinToneEmojis[baseEmoji][currentSkinTone] : emoji;
                selectedCustomEmoji = modifiedEmoji;

                const originalEmoji = emojiMap.get(emoji);
                if (originalEmoji) {
                    const originalButton = Array.from(document.querySelectorAll('button[aria-label^="React with"]'))
                        .find(button => button.querySelector('img')?.alt === originalEmoji);
                    if (originalButton) {
                        originalButton.click();
                    }
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
                    setTimeout(() => {
                        dynamicLink.textContent = 'Dynamic (Click to Copy)';
                    }, 2000);
                }).catch(err => {
                    dynamicLink.textContent = 'Dynamic (Copy Failed)';
                    setTimeout(() => {
                        dynamicLink.textContent = 'Dynamic (Click to Copy)';
                    }, 2000);
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
                setTimeout(() => {
                    replayLink.textContent = 'Replay (Click to Copy)';
                }, 2000);
                return;
            }
            replayLink.textContent = 'Generating...';
            const newReplayUrl = await fetchReplayUrl(dynamicUrl);
            if (newReplayUrl.startsWith('http')) {
                navigator.clipboard.writeText(newReplayUrl).then(() => {
                    replayLink.textContent = 'Replay (Copied!)';
                    setTimeout(() => {
                        replayLink.textContent = 'Replay (Click to Copy)';
                    }, 2000);
                }).catch(err => {
                    replayLink.textContent = 'Replay (Copy Failed)';
                    setTimeout(() => {
                        replayLink.textContent = 'Replay (Click to Copy)';
                    }, 2000);
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
                setTimeout(() => {
                    replayLink.textContent = 'Replay (Click to Copy)';
                }, 2000);
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

    function createCustomEmojiPicker() {
        if (customPicker) return;

        customPicker = document.createElement('div');
        customPicker.style.position = 'fixed';
        customPicker.style.bottom = '100px';
        customPicker.style.right = '20px';
        customPicker.style.backgroundColor = 'rgba(21, 32, 43, 0.8)';
        customPicker.style.borderRadius = '10px';
        customPicker.style.padding = '10px';
        customPicker.style.paddingBottom = '35px';
        customPicker.style.zIndex = '10000';
        customPicker.style.maxHeight = '400px';
        customPicker.style.overflowY = 'hidden';
        customPicker.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
        customPicker.style.transition = 'bottom 0.2s ease';
        customPicker.style.width = '270px';

        const emojiWrapper = document.createElement('div');
        emojiWrapper.style.display = 'grid';
        emojiWrapper.style.gridTemplateColumns = 'repeat(5, 40px)';
        const emojiRows = Math.ceil((customEmojis.length + 3) / 5);
        emojiWrapper.style.gridTemplateRows = `repeat(${emojiRows + 1}, auto)`;
        emojiWrapper.style.gap = '10px';
        emojiWrapper.style.maxHeight = 'calc(400px - 35px)';
        emojiWrapper.style.overflowY = 'auto';
        emojiWrapper.style.webkitOverflowScrolling = 'touch';

        const fragment = document.createDocumentFragment();

        customEmojis.forEach((emoji) => {
            const emojiButton = document.createElement('button');
            emojiButton.textContent = emoji;
            emojiButton.style.fontSize = '24px';
            emojiButton.style.background = 'none';
            emojiButton.style.border = 'none';
            emojiButton.style.cursor = 'pointer';
            emojiButton.style.padding = '5px';
            emojiButton.style.margin = '2px';
            emojiButton.style.touchAction = 'none';
            emojiButton.title = `React with ${emoji}`;
            emojiButton.draggable = true;
            emojiButton.classList.add('emoji-button');

            let touchTimeout;
            emojiButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const baseEmoji = getBaseEmoji(e.currentTarget.textContent);
                const currentEmoji = skinToneEmojis[baseEmoji] ? skinToneEmojis[baseEmoji][currentSkinTone] : baseEmoji;
                const originalEmoji = emojiMap.get(emoji);
                if (floodMode) {
                    if (floodInterval && selectedCustomEmoji === currentEmoji) {
                        stopFlood();
                    } else {
                        selectedCustomEmoji = currentEmoji;
                        startFlood(currentEmoji, originalEmoji, false, false, false);
                    }
                } else {
                    selectedCustomEmoji = currentEmoji;
                    currentFloodEmoji = currentEmoji;
                    sendEmoji(originalEmoji);
                }
                if (!stayOpen) {
                    customPicker.style.display = 'none';
                    customPicker.style.bottom = '100px';
                    if (settingsPopup) settingsPopup.style.display = 'none';
                    settingsContainer.style.display = 'none';
                }
            });

            emojiButton.addEventListener('dragstart', (e) => {
                if (!enableDragToReposition) return;
                draggedButton = e.currentTarget;
                e.currentTarget.style.opacity = '0.5';
            });

            emojiButton.addEventListener('dragover', (e) => {
                if (!enableDragToReposition) return;
                e.preventDefault();
            });

            emojiButton.addEventListener('drop', (e) => {
                if (!enableDragToReposition) return;
                e.preventDefault();
                handleDrop(e.currentTarget);
                saveEmojiOrder();
            });

            emojiButton.addEventListener('dragend', () => {
                if (!enableDragToReposition) return;
                if (draggedButton) draggedButton.style.opacity = '1';
                draggedButton = null;
            });

            emojiButton.addEventListener('touchstart', (e) => {
                if (!enableDragToReposition) return;
                e.preventDefault();
                touchStartTime = Date.now();
                touchMoved = false;
                draggedButton = e.currentTarget;
                draggedButton.style.opacity = '0.5';
                touchTimeout = setTimeout(() => {
                    touchMoved = true;
                }, 200);
            }, { passive: false });

            emojiButton.addEventListener('touchmove', (e) => {
                if (!enableDragToReposition || !draggedButton) return;
                e.preventDefault();
                touchMoved = true;
            }, { passive: false });

            emojiButton.addEventListener('touchend', (e) => {
                if (!enableDragToReposition || !draggedButton) return;
                e.preventDefault();
                clearTimeout(touchTimeout);
                const touchDuration = Date.now() - touchStartTime;
                if (touchDuration < 200 && !touchMoved) {
                    emojiButton.click();
                } else if (touchMoved) {
                    const touch = e.changedTouches[0];
                    const target = document.elementFromPoint(touch.clientX, touch.clientY);
                    if (target && target.classList.contains('emoji-button')) {
                        handleDrop(target);
                        saveEmojiOrder();
                    }
                }
                if (draggedButton) draggedButton.style.opacity = '1';
                draggedButton = null;
            }, { passive: false });

            fragment.appendChild(emojiButton);
        });

        function handleDrop(target) {
            if (draggedButton && draggedButton !== target &&
                draggedButton.classList.contains('emoji-button') &&
                target.classList.contains('emoji-button')) {
                const draggedText = draggedButton.textContent;
                draggedButton.textContent = target.textContent;
                target.textContent = draggedText;
                draggedButton.title = `React with ${draggedButton.textContent}`;
                target.title = `React with ${target.textContent}`;
            }
        }

        const separator = document.createElement('div');
        separator.style.gridColumn = '1 / -1';
        separator.style.height = '1px';
        separator.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        separator.style.margin = '5px 0';
        fragment.appendChild(separator);

        heartButton = document.createElement('button');
        heartButton.textContent = '💕'; // Default non-dynamic emoji
        heartButton.style.fontSize = '24px';
        heartButton.style.background = 'none';
        heartButton.style.border = 'none';
        heartButton.style.cursor = 'pointer';
        heartButton.style.padding = '5px';
        heartButton.style.margin = '2px';
        heartButton.title = 'Heart Flood';
        heartButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!floodMode) {
                floodMode = true;
                autoFloodEnabled = true;
                quickFloodSlider.value = '1';
                updateFloodModeUI();
            }
            if (floodInterval && selectedCustomEmoji === 'heartFlood') {
                stopFlood();
            } else {
                selectedCustomEmoji = 'heartFlood';
                startFlood('heartFlood', null, true, false, false);
            }
            if (!stayOpen) {
                customPicker.style.display = 'none';
                customPicker.style.bottom = '100px';
                if (settingsPopup) settingsPopup.style.display = 'none';
                settingsContainer.style.display = 'none';
            }
        });
        fragment.appendChild(heartButton);

        allButton = document.createElement('button');
        allButton.textContent = '🎆'; // Default non-dynamic emoji
        allButton.style.fontSize = '24px';
        allButton.style.background = 'none';
        allButton.style.border = 'none';
        allButton.style.cursor = 'pointer';
        allButton.style.padding = '5px';
        allButton.style.margin = '2px';
        allButton.title = 'Unique Emojis Flood';
        allButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!floodMode) {
                floodMode = true;
                autoFloodEnabled = true;
                quickFloodSlider.value = '1';
                updateFloodModeUI();
            }
            if (floodInterval && selectedCustomEmoji === 'allFlood') {
                stopFlood();
            } else {
                selectedCustomEmoji = 'allFlood';
                startFlood('allFlood', null, false, true, false);
            }
            if (!stayOpen) {
                customPicker.style.display = 'none';
                customPicker.style.bottom = '100px';
                if (settingsPopup) settingsPopup.style.display = 'none';
                settingsContainer.style.display = 'none';
            }
        });
        fragment.appendChild(allButton);

        customButton = document.createElement('button');
        customButton.textContent = '🎲'; // Default non-dynamic emoji
        customButton.style.fontSize = '24px';
        customButton.style.background = 'none';
        customButton.style.border = 'none';
        customButton.style.cursor = 'pointer';
        customButton.style.padding = '5px';
        customButton.style.margin = '2px';
        customButton.title = 'Custom Flood';
        customButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (customFloodBaseEmojis.length === 0) {
                timerDisplay.style.display = 'block';
                timerDisplay.textContent = 'Select Emojis In Settings';
                timerDisplay.style.color = 'white';
                floodModeText.style.display = 'none';
                setTimeout(() => {
                    timerDisplay.style.display = 'none';
                    timerDisplay.textContent = '';
                    updateFloodModeUI();
                }, 3000);
                return;
            }
            if (!floodMode) {
                floodMode = true;
                autoFloodEnabled = true;
                quickFloodSlider.value = '1';
                updateFloodModeUI();
            }
            if (floodInterval && selectedCustomEmoji === 'customFlood') {
                stopFlood();
            } else {
                selectedCustomEmoji = 'customFlood';
                startFlood('customFlood', null, false, false, true);
            }
            if (!stayOpen) {
                customPicker.style.display = 'none';
                customPicker.style.bottom = '100px';
                if (settingsPopup) settingsPopup.style.display = 'none';
                settingsContainer.style.display = 'none';
            }
        });
        fragment.appendChild(customButton);

        toggleButton = document.createElement('button');
        toggleButton.textContent = '';
        toggleButton.style.zIndex = '10001';
        toggleButton.style.fontSize = '24px';
        toggleButton.style.padding = '0';
        toggleButton.style.backgroundColor = 'transparent';
        toggleButton.style.color = 'white';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '50%';
        toggleButton.style.width = '35px';
        toggleButton.style.height = '35px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.display = 'none';
        toggleButton.style.lineHeight = '35px';
        toggleButton.style.textAlign = 'center';

        toggleButton.addEventListener('mouseover', () => {
            toggleButton.style.backgroundColor = '#595b5b40';
        });

        toggleButton.addEventListener('mouseout', () => {
            toggleButton.style.backgroundColor = 'transparent';
        });

        floodModeText = document.createElement('span');
        floodModeText.style.position = 'absolute';
        floodModeText.style.bottom = '5px';
        floodModeText.style.left = '10px';
        floodModeText.style.color = '#ff0000';
        floodModeText.style.fontSize = '12px';
        floodModeText.style.fontWeight = 'bold';
        floodModeText.style.display = 'none';
        floodModeText.textContent = 'FLOOD MODE: ON';

        settingsContainer = document.createElement('div');
        settingsContainer.style.position = 'fixed';
        settingsContainer.style.bottom = '60px';
        settingsContainer.style.right = '20px';
        settingsContainer.style.display = 'flex';
        settingsContainer.style.alignItems = 'center';
        settingsContainer.style.gap = '10px';
        settingsContainer.style.zIndex = '10001';

        timerDisplay = document.createElement('span');
        timerDisplay.style.color = 'white';
        timerDisplay.style.fontSize = '14px';
        timerDisplay.style.cursor = 'pointer';
        timerDisplay.style.padding = '5px';
        timerDisplay.style.display = 'none';
        timerDisplay.addEventListener('mouseover', () => {
            timerDisplay.style.opacity = '0.7';
        });
        timerDisplay.addEventListener('mouseout', () => {
            timerDisplay.style.opacity = '1';
        });
        timerDisplay.addEventListener('click', (e) => {
            e.stopPropagation();
            stopFlood();
        });

        quickFloodSlider = document.createElement('input');
        quickFloodSlider.type = 'range';
        quickFloodSlider.min = '0';
        quickFloodSlider.max = '1';
        quickFloodSlider.step = '1';
        quickFloodSlider.value = '0';
        quickFloodSlider.style.width = '40px';
        quickFloodSlider.style.cursor = 'pointer';
        quickFloodSlider.title = 'Slide to toggle Flood Mode';
        quickFloodSlider.addEventListener('input', () => {
            floodMode = quickFloodSlider.value === '1';
            autoFloodEnabled = false;
            if (!floodMode && floodInterval) {
                stopFlood();
            }
            updateFloodModeUI();
        });

        settingsButton = document.createElement('button');
        settingsButton.textContent = 'Settings';
        settingsButton.style.backgroundColor = '#1DA1F2';
        settingsButton.style.color = 'white';
        settingsButton.style.border = 'none';
        settingsButton.style.borderRadius = '5px';
        settingsButton.style.padding = '5px 10px';
        settingsButton.style.cursor = 'pointer';
        settingsButton.style.fontSize = '14px';
        settingsButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = settingsPopup.style.display === 'block';
            settingsPopup.style.display = isVisible ? 'none' : 'block';
        });

        settingsContainer.appendChild(timerDisplay);
        settingsContainer.appendChild(quickFloodSlider);
        settingsContainer.appendChild(settingsButton);

        document.body.appendChild(toggleButton);
        document.body.appendChild(customPicker);
        document.body.appendChild(settingsContainer);
        emojiWrapper.appendChild(fragment);
        customPicker.appendChild(emojiWrapper);
        customPicker.appendChild(floodModeText);
        customPicker.style.display = 'none';

        createSettingsPopup();
        loadSettings();
        loadEmojiOrder();
        updateEmojiSkinTones();

        toggleButton.addEventListener('click', () => {
            closeOtherPopups('emoji');
            const isVisible = customPicker.style.display === 'grid';
            customPicker.style.display = isVisible ? 'none' : 'grid';
            customPicker.style.bottom = isVisible ? '100px' : '150px';
            if (settingsPopup) settingsPopup.style.display = 'none';
            if (isVisible) {
                stopButtonCycles();
            } else {
                startButtonCycles();
            }
        });

        const updateSettingsButtonPosition = () => {
            const pickerVisible = customPicker.style.display === 'grid';
            settingsContainer.style.bottom = pickerVisible ? '150px' : '60px';
            settingsContainer.style.display = pickerVisible ? 'flex' : 'none';
        };

        toggleButton.addEventListener('click', updateSettingsButtonPosition);
        setInterval(updateSettingsButtonPosition, 2000);
        updateSettingsButtonPosition();
    }

    function updateFloodModeUI() {
        if (timerDisplay.style.display !== 'block' || timerDisplay.textContent === '') {
            floodModeText.style.display = floodMode ? 'block' : 'none';
        }
    }

    function updateEmojiSkinTones() {
        if (customPicker) {
            const buttons = customPicker.querySelectorAll('.emoji-button');
            buttons.forEach(button => {
                const baseEmoji = getBaseEmoji(button.textContent);
                if (skinToneEmojis[baseEmoji]) {
                    const newEmoji = skinToneEmojis[baseEmoji][currentSkinTone];
                    button.textContent = newEmoji;
                    button.title = `React with ${newEmoji}`;
                }
            });
        }
        updateAllEmojisFlood();
        updateCustomFloodCheckboxes();
    }

    function createSettingsPopup() {
        settingsPopup = document.createElement('div');
        settingsPopup.style.position = 'fixed';
        settingsPopup.style.bottom = '160px';
        settingsPopup.style.right = '20px';
        settingsPopup.style.backgroundColor = 'rgba(21, 32, 43, 0.8)';
        settingsPopup.style.borderRadius = '10px';
        settingsPopup.style.padding = '10px';
        settingsPopup.style.zIndex = '10001';
        settingsPopup.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
        settingsPopup.style.display = 'none';
        settingsPopup.style.width = '250px'; // Widened slightly from 200px to fit 3 emojis per line
        settingsPopup.style.maxHeight = '300px'; // Shorter than emoji picker (400px)
        settingsPopup.style.overflowY = 'auto';

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.position = 'sticky';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        closeButton.style.float = 'right';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.color = 'white';
        closeButton.style.fontSize = '14px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '0';
        closeButton.style.width = '20px';
        closeButton.style.height = '20px';
        closeButton.style.lineHeight = '20px';
        closeButton.style.textAlign = 'center';
        closeButton.addEventListener('mouseover', () => {
            closeButton.style.color = 'red';
        });
        closeButton.addEventListener('mouseout', () => {
            closeButton.style.color = 'white';
        });
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsPopup.style.display = 'none';
        });

        const settingsInner = document.createElement('div');
        settingsInner.style.display = 'flex';
        settingsInner.style.flexDirection = 'column';
        settingsInner.style.gap = '10px';
        settingsInner.style.paddingTop = '10px';

        const floodSettingsToggle = document.createElement('div');
        floodSettingsToggle.style.cursor = 'pointer';
        floodSettingsToggle.style.color = 'white';
        floodSettingsToggle.style.fontSize = '19px';
        floodSettingsToggle.textContent = '> Flood Settings';

        const displaySettingsToggle = document.createElement('div');
        displaySettingsToggle.style.cursor = 'pointer';
        displaySettingsToggle.style.color = 'white';
        displaySettingsToggle.style.fontSize = '19px';
        displaySettingsToggle.textContent = '> Display Settings';

        function updateActiveSubheading(activeToggle) {
            if (activeToggle === floodSettingsToggle) {
                floodSettingsToggle.style.fontWeight = 'bold';
                floodSettingsToggle.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                displaySettingsToggle.style.fontWeight = 'normal';
                displaySettingsToggle.style.backgroundColor = 'transparent';
                durationContainer.style.display = 'flex';
                intervalContainer.style.display = 'flex';
                customFloodContainer.style.display = 'flex';
                skinToneContainer.style.display = 'none';
                dynamicEmojisToggle.style.display = 'none';
                stayOpenToggle.style.display = 'none';
                dragToRepositionToggle.style.display = 'none';
            } else if (activeToggle === displaySettingsToggle) {
                displaySettingsToggle.style.fontWeight = 'bold';
                displaySettingsToggle.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                floodSettingsToggle.style.fontWeight = 'normal';
                floodSettingsToggle.style.backgroundColor = 'transparent';
                durationContainer.style.display = 'none';
                intervalContainer.style.display = 'none';
                customFloodContainer.style.display = 'none';
                skinToneContainer.style.display = 'flex';
                dynamicEmojisToggle.style.display = 'flex';
                stayOpenToggle.style.display = 'flex';
                dragToRepositionToggle.style.display = 'flex';
            }
        }

        floodSettingsToggle.addEventListener('click', () => {
            updateActiveSubheading(floodSettingsToggle);
        });

        displaySettingsToggle.addEventListener('click', () => {
            updateActiveSubheading(displaySettingsToggle);
        });

        const stayOpenToggle = document.createElement('label');
        stayOpenToggle.style.display = 'none';
        stayOpenToggle.style.alignItems = 'center';

        const stayOpenCheckbox = document.createElement('input');
        stayOpenCheckbox.type = 'checkbox';
        stayOpenCheckbox.checked = stayOpen;
        stayOpenCheckbox.style.marginRight = '5px';
        stayOpenCheckbox.addEventListener('change', () => {
            stayOpen = stayOpenCheckbox.checked;
            saveSettings();
        });

        const stayOpenText = document.createElement('span');
        stayOpenText.textContent = 'Stay Open';
        stayOpenText.style.color = 'white';
        stayOpenText.style.fontSize = '14px';

        stayOpenToggle.appendChild(stayOpenCheckbox);
        stayOpenToggle.appendChild(stayOpenText);

        const skinToneContainer = document.createElement('div');
        skinToneContainer.style.display = 'none';
        skinToneContainer.style.flexDirection = 'column';
        skinToneContainer.style.gap = '5px';

        const skinToneLabel = document.createElement('span');
        skinToneLabel.style.color = 'white';
        skinToneLabel.style.fontSize = '14px';

        skinToneSlider = document.createElement('input');
        skinToneSlider.type = 'range';
        skinToneSlider.min = '0';
        skinToneSlider.max = '5';
        skinToneSlider.value = currentSkinTone;
        skinToneSlider.style.width = '100%';
        skinToneSlider.addEventListener('input', () => {
            currentSkinTone = parseInt(skinToneSlider.value, 10);
            const tones = ['Default', 'Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark'];
            skinToneLabel.textContent = `Skin Tone: ${tones[currentSkinTone]}`;
            updateEmojiSkinTones();
            saveSettings();
        });

        skinToneLabel.textContent = `Skin Tone: ${['Default', 'Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark'][currentSkinTone]}`;
        skinToneContainer.appendChild(skinToneLabel);
        skinToneContainer.appendChild(skinToneSlider);

        const dynamicEmojisToggle = document.createElement('label');
        dynamicEmojisToggle.style.display = 'none';
        dynamicEmojisToggle.style.alignItems = 'center';

        const dynamicEmojisCheckbox = document.createElement('input');
        dynamicEmojisCheckbox.type = 'checkbox';
        dynamicEmojisCheckbox.checked = dynamicEmojis;
        dynamicEmojisCheckbox.style.marginRight = '5px';
        dynamicEmojisCheckbox.addEventListener('change', () => {
            dynamicEmojis = dynamicEmojisCheckbox.checked;
            saveSettings();
            if (heartCycleInterval) clearInterval(heartCycleInterval);
            if (allCycleInterval) clearInterval(allCycleInterval);
            if (customCycleInterval) clearInterval(customCycleInterval);
            heartCycleInterval = null;
            allCycleInterval = null;
            customCycleInterval = null;
            if (dynamicEmojis && customPicker.style.display === 'grid') {
                startButtonCycles();
            } else {
                stopButtonCycles();
                heartButton.textContent = '💕';
                allButton.textContent = '🎆';
                customButton.textContent = '🎲';
            }
        });

        const dynamicEmojisText = document.createElement('span');
        dynamicEmojisText.textContent = 'Dynamic Emojis';
        dynamicEmojisText.style.color = 'white';
        dynamicEmojisText.style.fontSize = '14px';

        dynamicEmojisToggle.appendChild(dynamicEmojisCheckbox);
        dynamicEmojisToggle.appendChild(dynamicEmojisText);

        const dragToRepositionToggle = document.createElement('label');
        dragToRepositionToggle.style.display = 'none';
        dragToRepositionToggle.style.alignItems = 'center';

        const dragToRepositionCheckbox = document.createElement('input');
        dragToRepositionCheckbox.type = 'checkbox';
        dragToRepositionCheckbox.checked = enableDragToReposition;
        dragToRepositionCheckbox.style.marginRight = '5px';
        dragToRepositionCheckbox.addEventListener('change', () => {
            enableDragToReposition = dragToRepositionCheckbox.checked;
            saveSettings();
        });

        const dragToRepositionText = document.createElement('span');
        dragToRepositionText.textContent = 'Drag to Reposition';
        dragToRepositionText.style.color = 'white';
        dragToRepositionText.style.fontSize = '14px';

        dragToRepositionToggle.appendChild(dragToRepositionCheckbox);
        dragToRepositionToggle.appendChild(dragToRepositionText);

        const durationContainer = document.createElement('div');
        durationContainer.style.display = 'flex';
        durationContainer.style.flexDirection = 'column';
        durationContainer.style.gap = '5px';

        const durationLabel = document.createElement('span');
        durationLabel.style.color = 'white';
        durationLabel.style.fontSize = '14px';

        durationSlider = document.createElement('input');
        durationSlider.type = 'range';
        durationSlider.min = '0';
        durationSlider.max = '30';
        durationSlider.value = '10';
        durationSlider.style.width = '100%';
        durationSlider.addEventListener('input', () => {
            const value = parseInt(durationSlider.value, 10);
            durationLabel.textContent = `Flood Duration: ${value === 0 ? 'Infinite' : value + 's'}`;
            saveSettings();
        });

        durationLabel.textContent = `Flood Duration: ${durationSlider.value === '0' ? 'Infinite' : durationSlider.value + 's'}`;
        durationContainer.appendChild(durationLabel);
        durationContainer.appendChild(durationSlider);

        const intervalContainer = document.createElement('div');
        intervalContainer.style.display = 'flex';
        intervalContainer.style.flexDirection = 'column';
        intervalContainer.style.gap = '5px';

        const intervalLabel = document.createElement('span');
        intervalLabel.style.color = 'white';
        intervalLabel.style.fontSize = '14px';

        intervalSlider = document.createElement('input');
        intervalSlider.type = 'range';
        intervalSlider.min = '0';
        intervalSlider.max = '12';
        intervalSlider.value = '1';
        intervalSlider.style.width = '100%';
        intervalSlider.addEventListener('input', () => {
            const value = parseInt(intervalSlider.value, 10);
            let intervalText;
            if (value === 0) intervalText = '0.1s';
            else if (value <= 10) intervalText = `${value / 10}s`;
            else if (value === 11) intervalText = '1.5s';
            else intervalText = '2s';
            intervalLabel.textContent = `Flood Interval: ${intervalText}`;
            saveSettings();
        });

        intervalLabel.textContent = `Flood Interval: ${parseInt(intervalSlider.value, 10) / 10}s`;
        intervalContainer.appendChild(intervalLabel);
        intervalContainer.appendChild(intervalSlider);

        const customFloodContainer = document.createElement('div');
        customFloodContainer.style.display = 'flex';
        customFloodContainer.style.flexDirection = 'column';
        customFloodContainer.style.gap = '5px';

        const customFloodLabel = document.createElement('span');
        customFloodLabel.textContent = 'Custom Flood Emojis:';
        customFloodLabel.style.color = 'white';
        customFloodLabel.style.fontSize = '14px';

        const emojiList = document.createElement('div');
        emojiList.style.display = 'grid';
        emojiList.style.gridTemplateColumns = 'repeat(3, 1fr)';
        emojiList.style.gap = '5px';

        customEmojis.forEach((emoji) => {
            const label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.style.marginRight = '5px';
            checkbox.addEventListener('change', () => {
                const baseEmoji = getBaseEmoji(emoji);
                if (checkbox.checked) {
                    if (!customFloodBaseEmojis.includes(baseEmoji)) {
                        customFloodBaseEmojis.push(baseEmoji);
                    }
                } else {
                    customFloodBaseEmojis = customFloodBaseEmojis.filter(e => e !== baseEmoji);
                }
                saveSettings();
            });

            const text = document.createElement('span');
            text.textContent = emoji;
            text.style.color = 'white';
            text.style.fontSize = '14px';

            label.appendChild(checkbox);
            label.appendChild(text);
            emojiList.appendChild(label);
        });

        customFloodContainer.appendChild(customFloodLabel);
        customFloodContainer.appendChild(emojiList);

        settingsInner.appendChild(floodSettingsToggle);
        settingsInner.appendChild(displaySettingsToggle);
        settingsInner.appendChild(durationContainer);
        settingsInner.appendChild(intervalContainer);
        settingsInner.appendChild(customFloodContainer);
        settingsInner.appendChild(skinToneContainer);
        settingsInner.appendChild(dynamicEmojisToggle);
        settingsInner.appendChild(stayOpenToggle);
        settingsInner.appendChild(dragToRepositionToggle);

        settingsPopup.appendChild(closeButton);
        settingsPopup.appendChild(settingsInner);
        document.body.appendChild(settingsPopup);

        updateActiveSubheading(floodSettingsToggle);
    }

    function updateCustomFloodCheckboxes() {
        if (!settingsPopup) return;
        const customFloodContainer = settingsPopup.querySelector('div > div:nth-child(5)');
        if (!customFloodContainer) return;
        const emojiList = customFloodContainer.querySelector('div');
        if (!emojiList) return;

        const labels = emojiList.querySelectorAll('label');
        labels.forEach((label, index) => {
            const checkbox = label.querySelector('input');
            const text = label.querySelector('span');
            const baseEmoji = customEmojis[index];
            const newEmoji = skinToneEmojis[baseEmoji] ? skinToneEmojis[baseEmoji][currentSkinTone] : baseEmoji;
            text.textContent = newEmoji;
            checkbox.checked = customFloodBaseEmojis.includes(baseEmoji);
        });
    }

    function startButtonCycles() {
        if (heartButton) {
            if (heartCycleInterval) clearInterval(heartCycleInterval);
            if (dynamicEmojis) {
                let heartIndex = 0;
                heartCycleInterval = setInterval(() => {
                    heartButton.textContent = heartEmojis[heartIndex];
                    heartIndex = (heartIndex + 1) % heartEmojis.length;
                }, 500);
            } else {
                heartButton.textContent = '💕';
            }
        }

        if (allButton) {
            if (allCycleInterval) clearInterval(allCycleInterval);
            if (dynamicEmojis) {
                let allIndex = 0;
                allCycleInterval = setInterval(() => {
                    allButton.textContent = allEmojisFlood[allIndex % allEmojisFlood.length];
                    allIndex = (allIndex + 1);
                }, 500);
            } else {
                allButton.textContent = '🎆';
            }
        }

        if (customButton) {
            if (customCycleInterval) clearInterval(customCycleInterval);
            if (dynamicEmojis) {
                let customIndex = 0;
                customCycleInterval = setInterval(() => {
                    const customFloodEmojis = customFloodBaseEmojis.map(base =>
                        skinToneEmojis[base] ? skinToneEmojis[base][currentSkinTone] : base
                    );
                    if (customFloodEmojis.length > 0) {
                        customButton.textContent = customFloodEmojis[customIndex];
                        customIndex = (customIndex + 1) % customFloodEmojis.length;
                    } else {
                        customButton.textContent = customIndex % 2 === 0 ? '❓' : '❔';
                        customIndex++;
                    }
                }, 500);
            } else {
                customButton.textContent = '🎲';
            }
        }
    }

    function stopButtonCycles() {
        if (heartCycleInterval) {
            clearInterval(heartCycleInterval);
            heartCycleInterval = null;
            if (heartButton) heartButton.textContent = '💕';
        }
        if (allCycleInterval) {
            clearInterval(allCycleInterval);
            allCycleInterval = null;
            if (allButton) allButton.textContent = '🎆';
        }
        if (customCycleInterval) {
            clearInterval(customCycleInterval);
            customCycleInterval = null;
            if (customButton) customButton.textContent = '🎲';
        }
    }

    function startFlood(emoji, originalEmoji, isHeartFlood = false, isAllFlood = false, isCustomFlood = false) {
        if (floodInterval) stopFlood();

        quickFloodSlider.style.display = 'none';
        timerDisplay.style.display = 'block';

        const sliderValue = parseInt(intervalSlider.value, 10);
        let interval;
        if (sliderValue === 0) {
            interval = 1;
        } else if (sliderValue <= 10) {
            interval = sliderValue * 100;
        } else if (sliderValue === 11) {
            interval = 1500;
        } else {
            interval = 2000;
        }
        const duration = parseInt(durationSlider.value, 10) * 1000;

        if (isNaN(interval) || interval < 1) return;

        let index = 0;
        floodInterval = setInterval(() => {
            let emojiToSend;
            if (isHeartFlood) {
                emojiToSend = heartEmojis[index % heartEmojis.length];
            } else if (isAllFlood) {
                emojiToSend = allEmojisFlood[index % allEmojisFlood.length];
            } else if (isCustomFlood) {
                if (customFloodBaseEmojis.length === 0) return;
                const baseEmoji = customFloodBaseEmojis[index % customFloodBaseEmojis.length];
                emojiToSend = skinToneEmojis[baseEmoji] ? skinToneEmojis[baseEmoji][currentSkinTone] : baseEmoji;
            } else {
                const baseEmoji = getBaseEmoji(emoji);
                emojiToSend = skinToneEmojis[baseEmoji] ? skinToneEmojis[baseEmoji][currentSkinTone] : emoji;
            }
            const mappedEmoji = emojiMap.get(getBaseEmoji(emojiToSend)) || originalEmoji;
            currentFloodEmoji = emojiToSend;
            sendEmoji(mappedEmoji);
            index++;
        }, interval);

        if (duration > 0) {
            let remainingSeconds = Math.ceil(duration / 1000);
            timerDisplay.textContent = `${remainingSeconds}s`;
            timerDisplay.style.color = 'white';
            timerInterval = setInterval(() => {
                remainingSeconds--;
                if (remainingSeconds >= 0) {
                    timerDisplay.textContent = `${remainingSeconds}s`;
                } else {
                    stopFlood();
                }
            }, 1000);

            setTimeout(() => {
                stopFlood();
            }, duration);
        } else {
            timerDisplay.textContent = 'STOP';
            timerDisplay.style.color = '#ff0000';
        }
    }

    function stopFlood() {
        if (floodInterval) {
            clearInterval(floodInterval);
            floodInterval = null;
        }
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        selectedCustomEmoji = null;
        currentFloodEmoji = null;
        timerDisplay.textContent = '';
        timerDisplay.style.display = 'none';
        quickFloodSlider.style.display = 'block';
        if (customPicker && customPicker.style.display === 'none') {
            stopButtonCycles();
        }
        if (autoFloodEnabled) {
            floodMode = false;
            autoFloodEnabled = false;
            quickFloodSlider.value = '0';
            updateFloodModeUI();
        }
    }

    function sendEmoji(originalEmoji) {
        let originalPicker = document.querySelector('.css-175oi2r.r-1awozwy.r-18u37iz.r-9aw3ui.r-1777fci.r-tuq35u');
        if (!originalPicker) {
            const reactionToggle = document.querySelector('button svg path[d="M17 12v3h-2.998v2h3v3h2v-3h3v-2h-3.001v-3H17zm-5 6.839c-3.871-2.34-6.053-4.639-7.127-6.609-1.112-2.04-1.031-3.7-.479-4.82.561-1.13 1.667-1.84 2.91-1.91 1.222-.06 2.68.51 3.892 2.16l.806 1.09.805-1.09c1.211-1.65 2.668-2.22 3.89-2.16 1.242.07 2.347.78 2.908 1.91.334.677.49 1.554.321 2.59h2.011c.153-1.283-.039-2.469-.539-3.48-.887-1.79-2.647-2.91-4.601-3.01-1.65-.09-3.367.56-4.796 2.01-1.43-1.45-3.147-2.1-4.798-2.01-1.954.1-3.714 1.22-4.601 3.01-.896 1.81-.846 4.17.514 6.67 1.353 2.48 4.003 5.12 8.382 7.67l.502.299v-2.32z"]');
            if (reactionToggle) {
                const toggleButton = reactionToggle.closest('button');
                if (toggleButton) {
                    toggleButton.click();
                    setTimeout(() => {
                        originalPicker = document.querySelector('.css-175oi2r.r-1awozwy.r-18u37iz.r-9aw3ui.r-1777fci.r-tuq35u');
                        sendReaction(originalPicker, originalEmoji);
                    }, 200);
                }
            }
        } else {
            sendReaction(originalPicker, originalEmoji);
        }
    }

    function sendReaction(picker, originalEmoji) {
        if (picker) {
            const originalButtons = picker.querySelectorAll('button[aria-label^="React with"]');
            originalButtons.forEach(button => {
                button.style.display = 'none';
                button.style.pointerEvents = 'none';
            });

            const originalButton = Array.from(originalButtons)
                .find(button => button.querySelector('img')?.alt === originalEmoji);
            if (originalButton) {
                originalButton.click();
                setTimeout(() => {
                    originalButtons.forEach(button => {
                        button.style.display = '';
                        button.style.pointerEvents = '';
                    });
                }, 500);
            }
        }
    }

    function detectEndedUI() {
        const endedContainer = document.querySelector(
            'div[data-testid="sheetDialog"] div.css-175oi2r.r-18u37iz.r-13qz1uu.r-1wtj0ep'
        );
        if (endedContainer) {
            const hasEndedText = Array.from(endedContainer.querySelectorAll('span')).some(
                span => span.textContent.toLowerCase().includes('ended')
            );
            const hasCloseButton = endedContainer.querySelector('button[aria-label="Close"]');
            const hasShareButton = endedContainer.querySelector('button[aria-label="Share"]');
            if (hasEndedText && hasCloseButton && hasShareButton) {
                return endedContainer;
            }
        }
        return null;
    }

    function addDownloadOptionToShareDropdown(dropdown) {
        if (dropdown.querySelector('#download-transcript-share') &&
            dropdown.querySelector('#copy-replay-url-share') &&
            dropdown.querySelector('#copy-live-url-share')) return;

        const menuItems = dropdown.querySelectorAll('div[role="menuitem"]');
        const itemCount = Array.from(menuItems).filter(item =>
            item.id !== 'download-transcript-share' &&
            item.id !== 'copy-replay-url-share' &&
            item.id !== 'copy-live-url-share').length;

        if (itemCount !== 4) return;

        const hasPostThisOrInvite = Array.from(menuItems).some(item =>
            item.textContent.toLowerCase().includes('post this') ||
            item.textContent.toLowerCase().includes('invite via dm'));
        if (!hasPostThisOrInvite) return;

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
        downloadStyle.textContent = `
            #download-transcript-share:hover {
                background-color: rgba(231, 233, 234, 0.1);
            }
        `;
        downloadItem.appendChild(downloadStyle);

        downloadItem.addEventListener('click', async (e) => {
            e.preventDefault();
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
        replayIcon.innerHTML = '<g><path d="M12 3.75c-4.55 0-8.25 3.69-8.25 8.25 0 1.92.66 3.52 1.687 4.885l-1.987 1.987h5.5v-5.5l1.886 1.886C11.17 14.96 11.5 13.76 11.5 12.5c0-2.76 2.24-5 5-5V3.75c-2.49 0-4.77.96-6.5 2.535C8.27 4.71 5.99 3.75 3.75 3.75v3.5c2.24 0 4.25.96 5.688 2.465z"/></g>';
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
        replayStyle.textContent = `
            #copy-replay-url-share:hover {
                background-color: rgba(231, 233, 234, 0.1);
            }
        `;
        replayItem.appendChild(replayStyle);

        replayItem.addEventListener('click', async (e) => {
            e.preventDefault();
            if (dynamicUrl) {
                const newReplayUrl = await fetchReplayUrl(dynamicUrl);
                if (newReplayUrl.startsWith('http')) {
                    navigator.clipboard.writeText(newReplayUrl).catch(err => {});
                }
            }
            dropdown.style.display = 'none';
        });

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
        liveText.innerHTML = '<span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">Copy Live URL</span>';
        liveTextContainer.appendChild(liveText);

        liveItem.appendChild(liveIconContainer);
        liveItem.appendChild(liveTextContainer);

        const liveStyle = document.createElement('style');
        liveStyle.textContent = `
            #copy-live-url-share:hover {
                background-color: rgba(231, 233, 234, 0.1);
            }
        `;
        liveItem.appendChild(liveStyle);

        liveItem.addEventListener('click', (e) => {
            e.preventDefault();
            if (dynamicUrl) {
                navigator.clipboard.writeText(dynamicUrl).catch(err => {});
            }
            dropdown.style.display = 'none';
        });

        const shareViaItem = dropdown.querySelector('div[data-testid="share-by-tweet"]');
        if (shareViaItem) {
            dropdown.insertBefore(downloadItem, shareViaItem.nextSibling);
            dropdown.insertBefore(replayItem, downloadItem.nextSibling);
            dropdown.insertBefore(liveItem, replayItem.nextSibling);
        } else {
            dropdown.appendChild(downloadItem);
            dropdown.appendChild(replayItem);
            dropdown.appendChild(liveItem);
        }
    }

    function closeOtherPopups(activePopup) {
        if (activePopup !== 'transcript' && transcriptPopup.style.display === 'block') {
            transcriptPopup.style.display = 'none';
        }
        if (activePopup !== 'emoji' && customPicker.style.display === 'grid') {
            customPicker.style.display = 'none';
            customPicker.style.bottom = '100px';
            stopButtonCycles();
            settingsContainer.style.display = 'none';
            if (settingsPopup) settingsPopup.style.display = 'none';
        }
    }

    function updateVisibilityAndPosition() {
        const reactionToggle = document.querySelector('button svg path[d="M17 12v3h-2.998v2h3v3h2v-3h3v-2h-3.001v-3H17zm-5 6.839c-3.871-2.34-6.053-4.639-7.127-6.609-1.112-2.04-1.031-3.7-.479-4.82.561-1.13 1.667-1.84 2.91-1.91 1.222-.06 2.68.51 3.892 2.16l.806 1.09.805-1.09c1.211-1.65 2.668-2.22 3.89-2.16 1.242.07 2.347.78 2.908 1.91.334.677.49 1.554.321 2.59h2.011c.153-1.283-.039-2.469-.539-3.48-.887-1.79-2.647-2.91-4.601-3.01-1.65-.09-3.367.56-4.796 2.01-1.43-1.45-3.147-2.1-4.798-2.01-1.954.1-3.714 1.22-4.601 3.01-.896 1.81-.846 4.17.514 6.67 1.353 2.48 4.003 5.12 8.382 7.67l.502.299v-2.32z"]');
        const peopleButton = document.querySelector('button svg path[d="M6.662 18H.846l.075-1.069C1.33 11.083 4.335 9 7.011 9c1.416 0 2.66.547 3.656 1.53-1.942 1.373-3.513 3.758-4.004 7.47zM7 8c1.657 0 3-1.346 3-3S8.657 2 7 2 4 3.346 4 5s1.343 3 3 3zm10.616 1.27C18.452 8.63 19 7.632 19 6.5 19 4.57 17.433 3 15.5 3S12 4.57 12 6.5c0 1.132.548 2.13 1.384 2.77.589.451 1.317.73 2.116.73s1.527-.279 2.116-.73zM8.501 19.972l-.029 1.027h14.057l-.029-1.027c-.184-6.618-3.736-8.977-7-8.977s-6.816 2.358-7 8.977z"]');
        const isInSpace = reactionToggle !== null || peopleButton !== null;
        const endedScreen = Array.from(document.querySelectorAll('.css-146c3p1.r-bcqeeo.r-1ttztb7.r-qvutc0.r-37j5jr.r-1b43r93.r-b88u0q.r-xnfwke.r-tsynxw span.css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3')).find(span => span.textContent.includes('Ended'));

        if (isInSpace && !lastSpaceState) {
            if (currentSpaceId !== lastSpaceId) {
                for (const [oldRoomId, wsSet] of websocketMap) {
                    if (oldRoomId !== currentSpaceId) {
                        wsSet.forEach(ws => {
                            ws.close();
                        });
                        websocketMap.delete(oldRoomId);
                    }
                }
                lastSpaceId = currentSpaceId;
                saveSettings();
            }
            handQueue.clear();
            activeHandRaises.clear();
            if (transcriptPopup && transcriptPopup.style.display === 'block') {
                updateTranscriptPopup();
            }
        } else if (!isInSpace && lastSpaceState && !endedScreen) {
            saveSettings();
            activeHandRaises.clear();
        }

        if (isInSpace) {
            if (peopleButton) {
                const peopleBtn = peopleButton.closest('button');
                if (peopleBtn) {
                    const rect = peopleBtn.getBoundingClientRect();
                    transcriptButton.style.position = 'fixed';
                    transcriptButton.style.left = `${rect.left - 52}px`;
                    transcriptButton.style.top = `${rect.top}px`;
                    transcriptButton.style.display = 'block';
                }
            }
            if (reactionToggle) {
                const reactionButton = reactionToggle.closest('button');
                if (reactionButton) {
                    const rect = reactionButton.getBoundingClientRect();
                    toggleButton.style.position = 'fixed';
                    toggleButton.style.left = `${rect.left}px`;
                    toggleButton.style.top = `${rect.top}px`;
                    toggleButton.style.display = 'block';
                    reactionButton.style.opacity = '100';
                    reactionButton.style.pointerEvents = 'none';
                }
                createEmojiPickerGrid();
            }
        } else {
            toggleButton.style.display = 'none';
            transcriptButton.style.display = 'none';
            customPicker.style.display = 'none';
            transcriptPopup.style.display = 'none';
            if (queueRefreshInterval) {
                clearInterval(queueRefreshInterval);
                queueRefreshInterval = null;
            }
            if (settingsPopup) settingsPopup.style.display = 'none';
            if (floodInterval) stopFlood();
        }

        const endedContainer = detectEndedUI();
        if (endedContainer && lastSpaceState) {
            toggleButton.style.display = 'none';
            transcriptButton.style.display = 'none';
            customPicker.style.display = 'none';
            transcriptPopup.style.display = 'none';
            if (queueRefreshInterval) {
                clearInterval(queueRefreshInterval);
                queueRefreshInterval = null;
            }
            if (settingsPopup) settingsPopup.style.display = 'none';
            if (floodInterval) stopFlood();

            const shareButton = endedContainer.querySelector('button[aria-label="Share"]');
            if (shareButton && (captionsData.length > 0 || emojiReactions.length > 0) && !shareButton.dataset.listenerAdded) {
                shareButton.addEventListener('click', () => {
                    setTimeout(() => {
                        const dropdown = document.querySelector('div[data-testid="Dropdown"]');
                        if (dropdown) {
                            addDownloadOptionToShareDropdown(dropdown);
                        }
                    }, 100);
                });
                shareButton.dataset.listenerAdded = 'true';
            }
        }

        lastSpaceState = isInSpace;
    }

    async function formatTranscriptForDownload() {
        let transcriptText = '';

        // Add Live URL
        transcriptText += `Live URL: ${dynamicUrl || 'Not available'}\n`;

        // Generate and add Replay URL
        let replayUrl = 'Not available';
        if (dynamicUrl) {
            try {
                replayUrl = await fetchReplayUrl(dynamicUrl);
                if (!replayUrl.startsWith('http')) {
                    replayUrl = `Could not generate replay URL: ${replayUrl}`;
                }
            } catch (error) {
                replayUrl = `Error generating replay URL: ${error.message}`;
            }
        }
        transcriptText += `Replay URL: ${replayUrl}\n\n`;

        // Existing transcript formatting logic
        let previousSpeaker = { username: '', handle: '' };
        const combinedData = [
            ...captionsData.map(item => ({ ...item, type: 'caption' })),
            ...emojiReactions.map(item => ({ ...item, type: 'emoji' }))
        ].sort((a, b) => a.timestamp - b.timestamp);

        combinedData.forEach((item, i) => {
            let { displayName, handle } = item;
            if (displayName === 'Unknown' && previousSpeaker.username) {
                displayName = previousSpeaker.username;
                handle = previousSpeaker.handle;
            }
            if (i > 0 && previousSpeaker.username !== displayName && item.type === 'caption') {
                transcriptText += '\n----------------------------------------\n';
            }
            if (item.type === 'caption') {
                transcriptText += `${displayName} ${handle}\n${item.text}\n\n`;
            } else if (item.type === 'emoji') {
                transcriptText += `${displayName} reacted with ${item.emoji}\n`;
            }
            previousSpeaker = { username: displayName, handle };
        });

        return transcriptText;
    }

    let lastRenderedCaptionCount = 0;
    let isUserScrolledUp = false;
    let currentFontSize = 14;
    let searchTerm = '';

    function filterTranscript(captions, emojis, term) {
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
    }

    function updateTranscriptPopup() {
        if (!transcriptPopup) return;

        let queueContainer = transcriptPopup.querySelector('#queue-container');
        let searchContainer = transcriptPopup.querySelector('#search-container');
        let scrollArea = transcriptPopup.querySelector('#transcript-scrollable');
        let saveButton = transcriptPopup.querySelector('.save-button');
        let textSizeContainer = transcriptPopup.querySelector('.text-size-container');
        let handQueuePopup = transcriptPopup.querySelector('#hand-queue-popup');
        let emojiToggleButton = transcriptPopup.querySelector('#emoji-toggle-button');
        let currentScrollTop = scrollArea ? scrollArea.scrollTop : 0;
        let wasAtBottom = scrollArea ? (scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight < 50) : true;

        let showEmojis = localStorage.getItem(STORAGE_KEYS.SHOW_EMOJIS) === 'true' ? true : false;

        if (!queueContainer || !searchContainer || !scrollArea || !saveButton || !textSizeContainer || !emojiToggleButton) {
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
            scrollArea.style.maxHeight = '300px';

            const captionWrapper = document.createElement('div');
            captionWrapper.id = 'transcript-output';
            captionWrapper.style.color = '#e7e9ea';
            captionWrapper.style.fontFamily = 'Arial, sans-serif';
            captionWrapper.style.whiteSpace = 'pre-wrap';
            captionWrapper.style.fontSize = `${currentFontSize}px`;
            scrollArea.appendChild(captionWrapper);

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
            saveButton.addEventListener('mouseover', () => {
                saveButton.style.color = '#FF9800';
            });
            saveButton.addEventListener('mouseout', () => {
                saveButton.style.color = '#1DA1F2';
            });

            textSizeContainer = document.createElement('div');
            textSizeContainer.className = 'text-size-container';
            textSizeContainer.style.display = 'flex';
            textSizeContainer.style.alignItems = 'center';

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
            emojiToggleButton.title = 'Toggle Emoji Notifications';
            emojiToggleButton.innerHTML = '🙂';

            const notAllowedOverlay = document.createElement('span');
            notAllowedOverlay.style.position = 'absolute';
            notAllowedOverlay.style.width = '14px';
            notAllowedOverlay.style.height = '14px';
            notAllowedOverlay.style.border = '2px solid red';
            notAllowedOverlay.style.borderRadius = '50%';
            notAllowedOverlay.style.transform = 'rotate(45deg)';
            notAllowedOverlay.style.background = 'transparent';
            notAllowedOverlay.style.display = showEmojis ? 'none' : 'block';

            const slash = document.createElement('span');
            slash.style.position = 'absolute';
            slash.style.width = '2px';
            slash.style.height = '18px';
            slash.style.background = 'red';
            slash.style.transform = 'rotate(-45deg)';
            slash.style.top = '-2px';
            slash.style.left = '6px';
            notAllowedOverlay.appendChild(slash);

            emojiToggleButton.appendChild(notAllowedOverlay);

            emojiToggleButton.addEventListener('click', () => {
                showEmojis = !showEmojis;
                notAllowedOverlay.style.display = showEmojis ? 'none' : 'block';
                localStorage.setItem(STORAGE_KEYS.SHOW_EMOJIS, showEmojis);
                updateTranscriptPopup();
            });

            const handEmoji = document.createElement('span');
            handEmoji.textContent = '✋';
            handEmoji.style.marginRight = '5px';
            handEmoji.style.fontSize = '14px';
            handEmoji.style.cursor = 'pointer';
            handEmoji.title = 'View Speaking Queue';
            handEmoji.addEventListener('click', () => {
                if (!handQueuePopup) {
                    handQueuePopup = document.createElement('div');
                    handQueuePopup.id = 'hand-queue-popup';
                    handQueuePopup.style.position = 'absolute';
                    handQueuePopup.style.bottom = '45px';
                    handQueuePopup.style.right = '0';
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
                    closeHandButton.addEventListener('mouseover', () => {
                        closeHandButton.style.color = 'red';
                    });
                    closeHandButton.addEventListener('mouseout', () => {
                        closeHandButton.style.color = 'white';
                    });
                    closeHandButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        handQueuePopup.style.display = 'none';
                    });

                    const queueContent = document.createElement('div');
                    queueContent.id = 'hand-queue-content';
                    queueContent.style.paddingTop = '10px';

                    handQueuePopup.appendChild(closeHandButton);
                    handQueuePopup.appendChild(queueContent);
                    transcriptPopup.appendChild(handQueuePopup);
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
            });

            const magnifierEmoji = document.createElement('span');
            magnifierEmoji.textContent = '🔍';
            magnifierEmoji.style.marginRight = '5px';
            magnifierEmoji.style.fontSize = '14px';
            magnifierEmoji.style.cursor = 'pointer';
            magnifierEmoji.title = 'Search transcript';
            magnifierEmoji.addEventListener('click', () => {
                searchContainer.style.display = searchContainer.style.display === 'none' ? 'block' : 'none';
                if (searchContainer.style.display === 'block') {
                    searchInput.focus();
                } else {
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
                if (captionWrapper) {
                    captionWrapper.style.fontSize = `${currentFontSize}px`;
                    const allSpans = captionWrapper.querySelectorAll('span');
                    allSpans.forEach(span => {
                        span.style.fontSize = `${currentFontSize}px`;
                    });
                }
                localStorage.setItem('xSpacesCustomReactions_textSize', currentFontSize);
            });

            const savedTextSize = localStorage.getItem('xSpacesCustomReactions_textSize');
            if (savedTextSize) {
                currentFontSize = parseInt(savedTextSize, 10);
                textSizeSlider.value = currentFontSize;
                captionWrapper.style.fontSize = `${currentFontSize}px`;
            }

            textSizeContainer.appendChild(emojiToggleButton);
            textSizeContainer.appendChild(handEmoji);
            textSizeContainer.appendChild(magnifierEmoji);
            textSizeContainer.appendChild(textSizeSlider);

            controlsContainer.appendChild(saveButton);
            controlsContainer.appendChild(textSizeContainer);

            transcriptPopup.appendChild(queueContainer);
            transcriptPopup.appendChild(searchContainer);
            transcriptPopup.appendChild(scrollArea);
            transcriptPopup.appendChild(controlsContainer);
            lastRenderedCaptionCount = 0;
        }

        const { captions: filteredCaptions, emojis: filteredEmojis } = filterTranscript(captionsData, emojiReactions, searchTerm);
        const totalItems = filteredCaptions.length + (showEmojis ? filteredEmojis.length : 0);

        const captionWrapper = scrollArea.querySelector('#transcript-output');
        if (captionWrapper) {
            captionWrapper.innerHTML = '';
            let previousSpeaker = lastSpeaker;

            const combinedData = [
                ...filteredCaptions.map(item => ({ ...item, type: 'caption' })),
                ...(showEmojis ? filteredEmojis.map(item => ({ ...item, type: 'emoji' })) : [])
            ].sort((a, b) => a.timestamp - b.timestamp);

            let emojiGroups = [];
            let currentGroup = null;

            combinedData.forEach((item) => {
                if (item.type === 'caption') {
                    if (currentGroup) {
                        emojiGroups.push(currentGroup);
                        currentGroup = null;
                    }
                    emojiGroups.push(item);
                } else if (item.type === 'emoji' && showEmojis) {
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
                        `<span style="font-size: ${currentFontSize}px; color: #1DA1F2">${displayName}</span> ` +
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
        }

        if (wasAtBottom && !searchTerm) {
            scrollArea.scrollTop = scrollArea.scrollHeight;
        } else {
            scrollArea.scrollTop = currentScrollTop;
        }

        scrollArea.onscroll = () => {
            isUserScrolledUp = scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight > 50;
        };

        if (handQueuePopup && handQueuePopup.style.display === 'block') {
            updateHandQueueContent(handQueuePopup.querySelector('#hand-queue-content'));
        }
    }

    function updateHandQueueContent(queueContent) {
        if (!queueContent) return;
        queueContent.innerHTML = '<strong>Speaking Queue</strong><br>';
        if (handQueue.size === 0) {
            queueContent.innerHTML += 'No hands raised.<br>';
        } else {
            const now = Date.now();
            const sortedQueue = Array.from(handQueue.entries())
                .sort(([, a], [, b]) => a.timestamp - b.timestamp);

            const queueList = document.createElement('div');
            queueList.style.display = 'flex';
            queueList.style.flexDirection = 'column';
            queueList.style.gap = '8px';

            const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

            sortedQueue.forEach(([, { displayName, timestamp }], index) => {
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

                const entry = document.createElement('div');
                entry.style.display = 'flex';
                entry.style.alignItems = 'center';
                entry.style.justifyContent = 'space-between';

                const text = document.createElement('span');
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

    function init() {
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
            closeOtherPopups('transcript');
            const isVisible = transcriptPopup.style.display === 'block';
            transcriptPopup.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) updateTranscriptPopup();
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
        transcriptPopup.style.width = '270px';
        transcriptPopup.style.color = 'white';
        transcriptPopup.style.fontSize = '14px';
        transcriptPopup.style.lineHeight = '1.5';
        transcriptPopup.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
        transcriptPopup.style.flexDirection = 'column';

        document.body.appendChild(transcriptButton);
        document.body.appendChild(transcriptPopup);
        createCustomEmojiPicker();

        loadSettings();

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    updateVisibilityAndPosition();

                    const startListeningButton = document.querySelector('div.css-175oi2r.r-1pi2tsx.r-1777fci.r-cxgwc0[style*="background-image: linear-gradient(61.63deg, rgb(45, 66, 255) -15.05%, rgb(156, 99, 250) 104.96%)"]');
                    if (startListeningButton && !startListeningButton.dataset.listenerAdded) {
                        startListeningButton.addEventListener('click', () => {
                            for (const [roomId, wsSet] of websocketMap) {
                                wsSet.forEach(ws => {
                                    ws.close();
                                });
                            }
                            websocketMap.clear();
                            allowNewConnection = true;
                        });
                        startListeningButton.dataset.listenerAdded = 'true';
                    }

                    const dropdown = document.querySelector('div[data-testid="Dropdown"]');
                    if (dropdown && dropdown.closest('[role="menu"]') && (captionsData.length > 0 || emojiReactions.length > 0)) {
                        addDownloadOptionToShareDropdown(dropdown);
                    }

                    const audioElements = document.querySelectorAll('audio');
                    audioElements.forEach(audio => {
                        if (audio.src && audio.src.includes('dynamic_playlist.m3u8?type=live')) {
                            dynamicUrl = audio.src;
                        }
                    });
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

