// ==UserScript==
// @name         MC5 Chat Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Beautifies and organizes the MC5 chat API display with auto-refresh and multi-server support
// @author       Falcon
// @match        http://eur-fedex-fsg005.gameloft.com:54212/v1/chat/channels/mc5_global.en?game=1875&memberid=5c40a468-c037-11ee-8805-b8ca3a60b598&language=en
// @icon         https://cdn2.iconfinder.com/data/icons/picons-basic-2/57/basic2-004_comment_chat-512.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/529831/MC5%20Chat%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/529831/MC5%20Chat%20Enhancer.meta.js
// ==/UserScript==


(function () {
    "use strict";

    GM_addStyle(`
        body {
            background-color: #121212 !important;
            color: #ffffff !important;
            font-family: Arial, sans-serif;
            font-size: 14px;
            padding: 20px;
            margin: 0;
        }

        #chat-container {
            max-width: 600px;
            margin: auto;
            background: #1e1e1e;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
            overflow-y: auto;
            max-height: 80vh;
        }

        .chat-message {
            padding: 10px;
            border-bottom: 1px solid #444;
        }

        .chat-message:last-child {
            border-bottom: none;
        }

        .nickname {
            font-weight: bold;
            color: #ffcc00;
            display: block;
            margin-bottom: 3px;
        }

        .message {
            color: #ffffff;
            padding: 5px 10px;
            background: #2d2d2d;
            border-radius: 5px;
            display: inline-block;
            max-width: 90%;
        }

        .timestamp {
            font-size: 12px;
            color: #888;
            display: block;
            margin-top: 3px;
        }

        #refresh-status {
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.8);
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
        }
    `);

    // Create chat container
    document.body.innerHTML = `
        <div id="chat-container"></div>
        <div id="refresh-status">Refreshing...</div>
    `;

    const chatContainer = document.getElementById("chat-container");
    const refreshStatus = document.getElementById("refresh-status");

    let seenMessages = new Set();
    let refreshInterval = 5000;
    let backoffFactor = 1;

    function fetchChat() {
        refreshStatus.textContent = "Refreshing...";

        fetch(window.location.href)
            .then((response) => response.text())
            .then((rawText) => {
                const messages = rawText
                    .split("\n")
                    .map((line) => {
                        try {
                            return JSON.parse(line);
                        } catch (e) {
                            return null;
                        }
                    })
                    .filter((msg) => msg && msg.type === "message" && !seenMessages.has(msg.id));

                if (messages.length === 0) return;

                const fragment = document.createDocumentFragment();

                messages.forEach((msg) => {
                    seenMessages.add(msg.id);

                    const messageDiv = document.createElement("div");
                    messageDiv.classList.add("chat-message");

                    messageDiv.innerHTML = `
                        <span class="nickname">${msg._senderName}</span>
                        <span class="message">${msg.msg}</span>
                        <span class="timestamp">${new Date(parseInt(msg._senderTimestamp) * 1000).toLocaleString()}</span>
                    `;

                    fragment.appendChild(messageDiv);
                });

                chatContainer.appendChild(fragment);

                // Smooth scrolling
                chatContainer.scrollTo({
                    top: chatContainer.scrollHeight,
                    behavior: "smooth",
                });

                // Reset backoff on success
                backoffFactor = 1;
                refreshInterval = 5000;
            })
            .catch((error) => {
                console.error("Error fetching chat:", error);

                // Exponential backoff on failure
                backoffFactor = Math.min(backoffFactor * 2, 60);
                refreshInterval = backoffFactor * 1000;
            })
            .finally(() => {
                refreshStatus.textContent = `Next refresh in ${refreshInterval / 1000}s`;
            });
    }

    // Initial load
    fetchChat();

    // Auto-refresh with adaptive timing
    setInterval(fetchChat, refreshInterval);
})();
