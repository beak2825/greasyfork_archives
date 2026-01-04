// ==UserScript==
// @name         Spacemojis hands (Fixed)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Replace Twitter Spaces reaction emojis with custom ones (Fix for 😲, ✌️, and 🙉 in all payloads)
// @author       x.com/blankspeaker
// @match        https://twitter.com/*
// @match        https://x.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524682/Spacemojis%20hands%20%28Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/524682/Spacemojis%20hands%20%28Fixed%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

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

    // Improved WebSocket override with robust initialization
    const OrigWebSocket = window.WebSocket;
    window.WebSocket = function (url, protocols) {
        const ws = new OrigWebSocket(url, protocols);

        ws.addEventListener('open', () => console.log('WebSocket opened:', url));

        const originalSend = ws.send;
        ws.send = function (data) {
            try {
                const parsedData = JSON.parse(data);

                // Process top-level `body`
                if (parsedData.body) {
                    parsedData.body = replaceEmojiInString(parsedData.body);
                }

                // Process nested `payload`
                if (parsedData.payload) {
                    try {
                        const nestedPayload = JSON.parse(parsedData.payload);

                        if (nestedPayload.body) {
                            nestedPayload.body = replaceEmojiInString(nestedPayload.body);
                            parsedData.payload = JSON.stringify(nestedPayload);
                        }
                    } catch (e) {
                        console.warn('Failed to parse nested payload:', e);
                    }
                }

                data = JSON.stringify(parsedData); // Re-stringify updated top-level object
            } catch (e) {
                console.warn('Error processing WebSocket data:', e);
            }

            return originalSend.call(this, data);
        };

        return ws;
    };

    // Function to replace emojis in the message body
    function replaceEmojiInString(body) {
        return body.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, (match) => {
            const emojiCode = match.codePointAt(0).toString(16);
            const replacement = emojiMap[emojiCode];
            return replacement ? String.fromCodePoint(parseInt(replacement, 16)) : match;
        });
    }

    // Replace visual emojis in the emoji picker
    function replaceEmojiPickerSVGs() {
        const emojiPickerSVGs = document.querySelectorAll('img[src*="/emoji/v2/svg/"]');
        emojiPickerSVGs.forEach(svg => {
            const currentSrc = svg.src;
            const currentCode = currentSrc.match(/\/svg\/(.+)\.svg/)?.[1];
            if (currentCode && emojiMap[currentCode]) {
                svg.src = currentSrc.replace(currentCode, emojiMap[currentCode]);
            }
        });
    }

    // Improved MutationObserver timing and retries
    function observeEmojiPicker() {
        const observer = new MutationObserver(() => {
            replaceEmojiPickerSVGs();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Fallback for slow-loading pages
        let retryCount = 0;
        const retryInterval = setInterval(() => {
            if (++retryCount > 10) {
                clearInterval(retryInterval);
            } else {
                replaceEmojiPickerSVGs();
            }
        }, 500);
    }

    // Initialization
    function init() {
        observeEmojiPicker();

        // Retry initialization to handle delayed content loads
        setTimeout(() => {
            replaceEmojiPickerSVGs();
        }, 1000);

        window.addEventListener('beforeunload', () => {
            window.WebSocket = OrigWebSocket; // Restore original WebSocket
        });
    }

    // Ensure script starts at the right time
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
