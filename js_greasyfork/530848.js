// ==UserScript==
// @name         X Spaces + mac
// @namespace    Violentmonkey Scripts
// @version      1.93
// @description  Addon for X Spaces with custom emojis, enhanced transcript including mute/unmute, hand raise/lower, mic invites, join/leave events, and speaker queuing.
// @author       x.com/blankspeaker and x.com/PrestonHenshawX
// @match        https://twitter.com/*
// @match        https://x.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/530848/X%20Spaces%20%2B%20mac.user.js
// @updateURL https://update.greasyfork.org/scripts/530848/X%20Spaces%20%2B%20mac.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const OrigWebSocket = unsafeWindow.WebSocket;
    const OrigXMLHttpRequest = unsafeWindow.XMLHttpRequest;
    let myUserId = null;
    let myParticipantIndex = null;
    let myUsername = null;
    let captionsData = [];
    let emojiReactions = [];
    let currentSpaceId = null;
    let lastSpaceId = null;
    let handRaiseDurations = [];
    const activeHandRaises = new Map();
    let dynamicUrl = '';
    let previousOccupancy = null;
    let totalParticipants = 0;

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
    ];

    const originalEmojis = ['😂', '😲', '😢', '💜', '💯', '👏', '✊', '👍', '👎', '👋'];
    const emojiMap = new Map();
    customEmojis.forEach((emoji, index) => {
        const originalEmoji = originalEmojis[index % originalEmojis.length];
        emojiMap.set(emoji, originalEmoji);
    });

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

    unsafeWindow.WebSocket = function (url, protocols) {
        console.log('WebSocket constructor called with URL:', url); // Debug log
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
                } catch (e) {
                    // Ignore parsing errors silently
                }
            }
            return originalSend.call(this, data);
        };

        let originalOnMessage = null;
        ws.onmessage = function (event) {
            console.log('WebSocket message received:', event.data); // Debug log
            if (originalOnMessage) originalOnMessage.call(this, event);
            try {
                const message = JSON.parse(event.data);

                if (message.kind === 1 && message.payload) {
                    const payload = JSON.parse(message.payload);
                    const body = payload.body ? JSON.parse(payload.body) : null;

                    if (body) {
                        const participantIndex = body.guestParticipantIndex || payload.sender?.participant_index || 'unknown';
                        let displayName = payload.sender?.display_name || body.displayName || 'Unknown';
                        let handle = payload.sender?.username || body.username || 'Unknown';
                        const timestamp = message.timestamp / 1e6 || Date.now();

                        const logSystemMessages = localStorage.getItem(STORAGE_KEYS.SHOW_SYSTEM_MESSAGES) !== 'false';

                        if (body.type === 40 && body.guestBroadcastingEvent && logSystemMessages) {
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
                                    eventText = `${displayName} (${handle}) was muted`;
                                    break;
                                case 17:
                                    eventText = `${displayName} (${handle}) was unmuted`;
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
                    const payload = JSON.parse(message.payload);
                    const body = payload.body ? JSON.parse(payload.body) : null;

                    if (body && body.occupancy !== undefined && body.total_participants !== undefined) {
                        const currentOccupancy = body.occupancy;
                        totalParticipants = body.total_participants;
                        const timestamp = Date.now();
                        const logSystemMessages = localStorage.getItem(STORAGE_KEYS.SHOW_SYSTEM_MESSAGES) !== 'false';

                        if (previousOccupancy !== null && logSystemMessages) {
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

                const payloadString = JSON.stringify(payload);
                if (payloadString.includes('dynamic_playlist.m3u8?type=live')) {
                    const urlMatch = payloadString.match(/https:\/\/prod-fastly-[^/]+?\.video\.pscp\.tv\/[^"]+?dynamic_playlist\.m3u8\?type=live/);
                    if (urlMatch) dynamicUrl = urlMatch[0];
                }

                if (payload.room_id) currentSpaceId = payload.room_id;

                const urlSpaceId = getSpaceIdFromUrl();
                if (urlSpaceId && payload.room_id !== urlSpaceId) return;
            } catch (e) {
                // Ignore parsing errors silently
            }
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

    unsafeWindow.XMLHttpRequest = function () {
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
    let queueButton = null;
    let handQueuePopup = null;
    let queueRefreshInterval = null;
    const handQueue = new Map();
    let lastSpaceState = false;
    let lastSpeaker = { username: '', handle: '' };

    const STORAGE_KEYS = {
        LAST_SPACE_ID: 'xSpacesCustomReactions_lastSpaceId',
        HAND_DURATIONS: 'xSpacesCustomReactions_handRaiseDurations',
        SHOW_EMOJIS: 'xSpacesCustomReactions_showEmojis',
        SHOW_SYSTEM_MESSAGES: 'xSpacesCustomReactions_showSystemMessages'
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
    }

    function hideOriginalEmojiButtons() {
        const originalButtons = document.querySelectorAll('.css-175oi2r.r-1awozwy.r-18u37iz.r-9aw3ui.r-1777fci.r-tuq35u > div > button');
        originalButtons.forEach(button => button.style.display = 'none');
    }

    function createEmojiPickerGrid() {
        const emojiPicker = document.querySelector('.css-175oi2r.r-1awozwy.r-18u37iz.r-9aw3ui.r-1777fci.r-tuq35u');
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
        const endedContainer = document.querySelector('div[data-testid="sheetDialog"] div.css-175oi2r.r-18u37iz.r-13qz1uu.r-1wtj0ep');
        if (endedContainer) {
            const hasEndedText = Array.from(endedContainer.querySelectorAll('span')).some(span => span.textContent.toLowerCase().includes('ended'));
            const hasCloseButton = endedContainer.querySelector('button[aria-label="Close"]');
            const hasShareButton = endedContainer.querySelector('button[aria-label="Share"]');
            if (hasEndedText && hasCloseButton && hasShareButton) return endedContainer;
        }
        return null;
    }

    function addDownloadOptionToShareDropdown(dropdown) {
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
    }

    function updateVisibilityAndPosition() {
        const reactionToggle = document.querySelector('button svg path[d="M17 12v3h-2.998v2h3v3h2v-3h3v-2h-3.001v-3H17zm-5 6.839c-3.871-2.34-6.053-4.639-7.127-6.609-1.112-2.04-1.031-3.7-.479-4.82.561-1.13 1.667-1.84 2.91-1.91 1.222-.06 2.68.51 3.892 2.16l.806 1.09.805-1.09c1.211-1.65 2.668-2.22 3.89-2.16 1.242.07 2.347.78 2.908 1.91.334.677.49 1.554.321 2.59h2.011c.153-1.283-.039-2.469-.539-3.48-.887-1.79-2.647-2.91-4.601-3.01-1.65-.09-3.367.56-4.796 2.01-1.43-1.45-3.147-2.1-4.798-2.01-1.954.1-3.714 1.22-4.601 3.01-.896 1.81-.846 4.17.514 6.67 1.353 2.48 4.003 5.12 8.382 7.67l.502.299v-2.32z"]');
        const peopleButton = document.querySelector('button svg path[d="M6.662 18H.846l.075-1.069C1.33 11.083 4.335 9 7.011 9c1.416 0 2.66.547 3.656 1.53-1.942 1.373-3.513 3.758-4.004 7.47zM7 8c1.657 0 3-1.346 3-3S8.657 2 7 2 4 3.346 4 5s1.343 3 3 3zm10.616 1.27C18.452 8.63 19 7.632 19 6.5 19 4.57 17.433 3 15.5 3S12 4.57 12 6.5c0 1.132.548 2.13 1.384 2.77.589.451 1.317.73 2.116.73s1.527-.279 2.116-.73zM8.501 19.972l-.029 1.027h14.057l-.029-1.027c-.184-6.618-3.736-8.977-7-8.977s-6.816 2.358-7 8.977z"]');
        const isInSpace = reactionToggle !== null || peopleButton !== null;
        const endedScreen = Array.from(document.querySelectorAll('.css-146c3p1.r-bcqeeo.r-1ttztb7.r-qvutc0.r-37j5jr.r-1b43r93.r-b88u0q.r-xnfwke.r-tsynxw span.css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3')).find(span => span.textContent.includes('Ended'));

        if (isInSpace && !lastSpaceState) {
            const urlSpaceId = getSpaceIdFromUrl();
            if (urlSpaceId) {
                currentSpaceId = urlSpaceId;
                if (currentSpaceId !== lastSpaceId) {
                    handQueue.clear();
                    activeHandRaises.clear();
                    captionsData = [];
                    emojiReactions = [];
                    lastSpeaker = { username: '', handle: '' };
                    previousOccupancy = null;
                    totalParticipants = 0;
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
    }

    function updateQueueButtonVisibility() {
        if (queueButton) {
            queueButton.style.display = handQueue.size > 0 ? 'block' : 'none';
            updateVisibilityAndPosition();
        }
    }

    async function formatTranscriptForDownload() {
        let transcriptText = '--- Space URLs ---\n';

        // Append Space URL
        const spaceId = getSpaceIdFromUrl();
        if (spaceId) {
            transcriptText += `Space URL: https://x.com/i/spaces/${spaceId}\n`;
        } else {
            transcriptText += 'Space URL: Not available\n';
        }

        // Append live URL
        if (dynamicUrl) {
            transcriptText += `Live URL: ${dynamicUrl}\n`;
        } else {
            transcriptText += 'Live URL: Not available\n';
        }

        // Append replay URL
        try {
            const replayUrl = await fetchReplayUrl(dynamicUrl);
            transcriptText += `Replay URL: ${replayUrl}\n`;
        } catch (e) {
            transcriptText += 'Replay URL: Failed to generate\n';
        }

        transcriptText += '-----------------\n\n';

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
                const date = new Date(item.timestamp);
                const timestampStr = date.toISOString().replace('T', ' ').substring(0, 19);
                transcriptText += `\n[${timestampStr}]\n`;
            }
            if (item.type === 'caption') {
                transcriptText += `${displayName} ${handle}\n${item.text}${displayName === 'System' ? '' : '\n'}\n`;
            } else if (item.type === 'emoji') {
                transcriptText += `${displayName} reacted with ${item.emoji}\n`;
            }
            previousSpeaker = { username: displayName, handle };
        });
        return transcriptText;
    }

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
        if (!transcriptPopup || transcriptPopup.style.display !== 'block') return;

        let queueContainer = transcriptPopup.querySelector('#queue-container');
        let searchContainer = transcriptPopup.querySelector('#search-container');
        let scrollArea = transcriptPopup.querySelector('#transcript-scrollable');
        let saveButton = transcriptPopup.querySelector('.save-button');
        let textSizeContainer = transcriptPopup.querySelector('.text-size-container');
        let systemToggleButton = transcriptPopup.querySelector('#system-toggle-button');
        let emojiToggleButton = transcriptPopup.querySelector('#emoji-toggle-button');
        let currentScrollTop = scrollArea ? scrollArea.scrollTop : 0;
        let wasAtBottom = scrollArea ? (scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight < 50) : true;

        let showEmojisInUI = localStorage.getItem(STORAGE_KEYS.SHOW_EMOJIS) !== 'false';
        let showSystemMessagesInUI = localStorage.getItem(STORAGE_KEYS.SHOW_SYSTEM_MESSAGES) !== 'false';

        if (!queueContainer || !searchContainer || !scrollArea || !saveButton || !textSizeContainer || !systemToggleButton || !emojiToggleButton) {
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
                saveButton.textContent = '💾 Saving...';
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
                if (captionWrapper) captionWrapper.style.fontSize = `${currentFontSize}px`;
                localStorage.setItem('xSpacesCustomReactions_textSize', currentFontSize);
            });

            const savedTextSize = localStorage.getItem('xSpacesCustomReactions_textSize');
            if (savedTextSize) {
                currentFontSize = parseInt(savedTextSize, 10);
                textSizeSlider.value = currentFontSize;
            }

            textSizeContainer.appendChild(systemToggleButton);
            textSizeContainer.appendChild(emojiToggleButton);
            textSizeContainer.appendChild(magnifierEmoji);
            textSizeContainer.appendChild(textSizeSlider);

            controlsContainer.appendChild(saveButton);
            controlsContainer.appendChild(textSizeContainer);

            transcriptPopup.appendChild(queueContainer);
            transcriptPopup.appendChild(searchContainer);
            transcriptPopup.appendChild(scrollArea);
            transcriptPopup.appendChild(controlsContainer);
        }

        const { captions: filteredCaptions, emojis: filteredEmojis } = filterTranscript(captionsData, emojiReactions, searchTerm);
        const uiCaptions = showSystemMessagesInUI ? filteredCaptions : filteredCaptions.filter(c => c.displayName !== 'System');
        const uiEmojis = showEmojisInUI ? filteredEmojis : [];
        const combinedData = [
            ...uiCaptions.map(item => ({ ...item, type: 'caption' })),
            ...uiEmojis.map(item => ({ ...item, type: 'emoji' }))
        ].sort((a, b) => a.timestamp - b.timestamp);

        // Find the previous speaker before the last 200 entries
        let previousSpeaker = lastSpeaker || { username: '', handle: '' };
        if (combinedData.length > 200) {
            for (let i = combinedData.length - 201; i >= 0; i--) {
                if (combinedData[i].type === 'caption') {
                    previousSpeaker = { username: combinedData[i].displayName, handle: combinedData[i].handle };
                    break;
                }
            }
        }

        // Limit to the last 200 entries
        const recentData = combinedData.slice(-200);

        // Group consecutive emojis within the 200 entries
        let emojiGroups = [];
        let currentGroup = null;
        recentData.forEach(item => {
            if (item.type === 'caption') {
                if (currentGroup) {
                    emojiGroups.push(currentGroup);
                    currentGroup = null;
                }
                emojiGroups.push(item);
            } else if (item.type === 'emoji' && showEmojisInUI) {
                if (currentGroup && currentGroup.displayName === item.displayName && currentGroup.emoji === item.emoji &&
                    Math.abs(item.timestamp - currentGroup.items[currentGroup.items.length - 1].timestamp) < 50) {
                    currentGroup.count++;
                    currentGroup.items.push(item);
                } else {
                    if (currentGroup) emojiGroups.push(currentGroup);
                    currentGroup = { displayName: item.displayName, emoji: item.emoji, count: 1, items: [item] };
                }
            }
        });
        if (currentGroup) emojiGroups.push(currentGroup);

        // Build the HTML string
        let html = '';
        if (combinedData.length > 200) {
            html += '<div style="color: #FFD700; font-size: 12px; margin-bottom: 10px;">Showing the last 200 lines. Save transcript to see the full conversation.</div>';
        }
        emojiGroups.forEach((group, i) => {
            if (group.type === 'caption') {
                let { displayName, handle, text } = group;
                if (displayName === 'Unknown' && previousSpeaker.username) {
                    displayName = previousSpeaker.username;
                    handle = previousSpeaker.handle;
                }
                html += `<span style="font-size: ${currentFontSize}px; color: #1DA1F2">${displayName}</span> ` +
                        `<span style="font-size: ${currentFontSize}px; color: #808080">${handle}</span><br>` +
                        `<span style="font-size: ${currentFontSize}px; color: ${displayName === 'System' ? '#FF4500' : '#FFFFFF'}">${text}</span>${displayName === 'System' ? '<br>' : '<br><br>'}`;
                previousSpeaker = { username: displayName, handle };
            } else if (showEmojisInUI) {
                let { displayName, emoji, count } = group;
                if (displayName === 'Unknown' && previousSpeaker.username) {
                    displayName = previousSpeaker.username;
                }
                const countText = count > 1 ? ` <span style="font-size: ${currentFontSize}px; color: #FFD700">x${count}</span>` : '';
                html += `<span style="font-size: ${currentFontSize}px; color: #FFD700">${displayName}</span> ` +
                        `<span style="font-size: ${currentFontSize}px; color: #FFFFFF">reacted with ${emoji}${countText}</span><br>`;
                previousSpeaker = { username: displayName, handle: group.items[0].handle };
            }
        });

        // Update the DOM once
        const captionWrapper = scrollArea.querySelector('#transcript-output');
        if (captionWrapper) {
            captionWrapper.innerHTML = html;
            lastSpeaker = previousSpeaker;

            // Maintain scroll position
            if (wasAtBottom && !searchTerm) scrollArea.scrollTop = scrollArea.scrollHeight;
            else scrollArea.scrollTop = currentScrollTop;

            scrollArea.onscroll = () => {
                isUserScrolledUp = scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight > 50;
            };
        }

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
            const sortedQueue = Array.from(handQueue.entries()).sort(([, a], [, b]) => a.timestamp - b.timestamp);

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
        transcriptPopup.style.width = '306px'; // Increased from 270px to 306px (270 + 36)
        transcriptPopup.style.color = 'white';
        transcriptPopup.style.fontSize = '14px';
        transcriptPopup.style.lineHeight = '1.5';
        transcriptPopup.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
        transcriptPopup.style.flexDirection = 'column';

        document.body.appendChild(queueButton);
        document.body.appendChild(transcriptButton);
        document.body.appendChild(transcriptPopup);

        loadSettings();

        const observer = new MutationObserver((mutationsList) => {
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