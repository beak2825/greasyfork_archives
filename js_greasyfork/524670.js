// ==UserScript==
// @name         Spacemojis 🔥✌️😠😃😍🙌🎶💸🤔
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace Twitter Spaces reaction emojis
// @author       x.com/blankspeaker
// @match        https://twitter.com/*
// @match        https://x.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524670/Spacemojis%20%F0%9F%94%A5%E2%9C%8C%EF%B8%8F%F0%9F%98%A0%F0%9F%98%83%F0%9F%98%8D%F0%9F%99%8C%F0%9F%8E%B6%F0%9F%92%B8%F0%9F%A4%94.user.js
// @updateURL https://update.greasyfork.org/scripts/524670/Spacemojis%20%F0%9F%94%A5%E2%9C%8C%EF%B8%8F%F0%9F%98%A0%F0%9F%98%83%F0%9F%98%8D%F0%9F%99%8C%F0%9F%8E%B6%F0%9F%92%B8%F0%9F%A4%94.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('REACTION SCRIPT LOADED');

    // Updated emoji map
    const emojiMap = {
        '1f602': '1f525',    // 😂 -> 🔥
        '1f62e': '270c-fe0f', // 😮 -> ✌️ (with variation selector)
        '1f625': '1f649',    // 😥 -> 🙉
        '1f49c': '1f620',    // 💜 -> 😠
        '1f4af': '1f603',    // 💯 -> 😃
        '1f44f': '1f60d',    // 👏 -> 😍
        '270a': '1f64c',     // ✊ -> 🙌
        '1f44d': '1f3b6',    // 👍 -> 🎶
        '1f44e': '1f4b8',    // 👎 -> 💸
        '1f44b': '1f914',    // 👋 -> 🤔
        '1f632': '270c-fe0f' // 😲 -> ✌️
    };

    // Monitor WebSocket messages
    const OrigWebSocket = window.WebSocket;
    window.WebSocket = function (url, protocols) {
        console.log('NEW WEBSOCKET:', url);
        const ws = new OrigWebSocket(url, protocols);

        const originalSend = ws.send;
        ws.send = function (data) {
            console.log('WEBSOCKET SEND (Original Data):', data);

            try {
                const parsedData = JSON.parse(data);

                // Process top-level `body`
                if (parsedData.body) {
                    parsedData.body = replaceEmojiInString(parsedData.body);
                    console.log('UPDATED PAYLOAD BODY (Top-level):', parsedData);
                }

                // Process nested `payload`
                if (parsedData.payload) {
                    try {
                        const nestedPayload = JSON.parse(parsedData.payload);

                        if (nestedPayload.body) {
                            nestedPayload.body = replaceEmojiInString(nestedPayload.body);
                            console.log('UPDATED NESTED PAYLOAD BODY:', nestedPayload);

                            // Reassign updated nested payload to parsedData
                            parsedData.payload = JSON.stringify(nestedPayload);
                        }
                    } catch (e) {
                        console.error('Failed to parse nested payload:', e);
                    }
                }

                data = JSON.stringify(parsedData); // Re-stringify updated top-level object
            } catch (e) {
                console.error('Failed to parse WebSocket message:', e);
            }

            return originalSend.call(this, data);
        };

        ws.addEventListener('message', function (event) {
            console.log('WEBSOCKET RECEIVE:', event.data);
        });

        return ws;
    };

    // Function to replace emojis in the message body
    function replaceEmojiInString(body) {
        return body.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, (match) => {
            const emojiCode = match.codePointAt(0).toString(16);
            const replacement = emojiMap[emojiCode];
            if (replacement) {
                console.log('Original Emoji:', match, 'Code:', emojiCode, 'Replacement:', replacement);
                return String.fromCodePoint(parseInt(replacement, 16));
            } else {
                console.warn('No replacement found for Emoji:', match, 'Code:', emojiCode);
                return match; // Fallback to original emoji if no replacement exists
            }
        });
    }

    // Replace visual emojis in the emoji picker
    function replaceEmojiPickerSVGs() {
        console.log('CHECKING FOR EMOJIS IN PICKER');
        const emojiPickerSVGs = document.querySelectorAll('img[src*="/emoji/v2/svg/"]');
        console.log('FOUND EMOJIS IN PICKER:', emojiPickerSVGs.length);

        emojiPickerSVGs.forEach(svg => {
            const currentSrc = svg.src;
            const currentCode = currentSrc.match(/\/svg\/(.+)\.svg/)?.[1];
            if (currentCode && emojiMap[currentCode]) {
                const newSrc = currentSrc.replace(currentCode, emojiMap[currentCode]);
                console.log('REPLACING IN PICKER:', currentSrc, 'WITH:', newSrc);
                svg.src = newSrc;
            }
        });
    }

    // Initialize emoji picker replacement
    function observeEmojiPicker() {
        const observer = new MutationObserver(() => {
            replaceEmojiPickerSVGs();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initialization
    function init() {
        console.log('SCRIPT INITIALIZING');
        observeEmojiPicker();

        setTimeout(() => {
            console.log('RUNNING INITIAL REPLACEMENT IN PICKER');
            replaceEmojiPickerSVGs();
        }, 1000);

        window.addEventListener('beforeunload', () => {
            console.log('CLEANING UP');
            window.WebSocket = OrigWebSocket; // Restore original WebSocket
        });
    }

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
