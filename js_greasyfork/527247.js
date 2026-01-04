// ==UserScript==
// @name         AAC chat logger
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @copyright    2025, Asriel (https://greasyfork.org/de/users/1375984-asriel-aac)
// @license      MIT
// @description  Fügt die möglichkeit zum runterladen von chatlogs als txt hinzu
// @author       Asriel
// @icon         https://cdn.iconscout.com/icon/premium/png-512-thumb/chat-history-1-751627.png
// @supportURL   https://greasyfork.org/de/scripts/527247-aac-chat-logger/feedback
// @include      /^https?:\/\/(www\.)?anime\.academy\/chat/
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/527247/AAC%20chat%20logger.user.js
// @updateURL https://update.greasyfork.org/scripts/527247/AAC%20chat%20logger.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const CHAT_LOG_STORAGE_KEY = "aac_chat_logs";
    const MAX_LOG_SIZE = 500;

    function saveChatMessage(room, user, message) {
        if (!message || message.trim() === "") return;

        let chatLogs = JSON.parse(localStorage.getItem(CHAT_LOG_STORAGE_KEY)) || {};

        if (!chatLogs[room]) {
            chatLogs[room] = [];
        }

        chatLogs[room].push({
            timestamp: Date.now(),
            user: user,
            message: message
        });

        if (chatLogs[room].length > MAX_LOG_SIZE) {
            chatLogs[room].shift(); // Remove oldest messages
        }

        localStorage.setItem(CHAT_LOG_STORAGE_KEY, JSON.stringify(chatLogs));
        console.log(`[Chat Logger] Stored message: ${user}: ${message}`);
    }

function exportChatLogs() {
    let chatLogs = JSON.parse(localStorage.getItem(CHAT_LOG_STORAGE_KEY)) || {};

    if (Object.keys(chatLogs).length === 0) {
        alert("No chat logs available.");
        console.warn("[Chat Logger] No logs found.");
        return;
    }

    let logText = "";

    for (let room in chatLogs) {
        logText += `Room: ${room}\n====================\n`;
        logText += chatLogs[room].map(log => `[${new Date(log.timestamp).toLocaleString()}] ${log.user}: ${log.message}`).join("\n") + "\n\n";
    }

    // 📜 Generate Timestamped Filename
    let now = new Date();
    let formattedTime = now.toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0];
    let fileName = `ChatLogs_${formattedTime}.txt`;

    // 📂 Create Downloadable Text File
    let blob = new Blob([logText], { type: "text/plain" });
    let link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log(`[Chat Logger] Chat logs downloaded as: ${fileName}`);
}


function createDownloadButton() {
    setTimeout(() => {
        let existingButton = document.getElementById("downloadChatLogsBtn");
        if (existingButton) return;

        let chatControls = document.querySelector(".controller"); // Find chat controls bar
        if (!chatControls) {
            console.warn("[Chat Logger] Could not find .controller div!");
            return;
        }

        let button = document.createElement("span");
        button.id = "downloadChatLogsBtn";
        button.innerText = "💾 Logs";  // Compact text + icon
        button.style.padding = "5px 10px";
        button.style.fontSize = "12px";
        button.style.background = "#4CAF50";  // Green color like "Clear Chat"
        button.style.color = "#fff";
        button.style.borderRadius = "4px";
        button.style.cursor = "pointer";
        button.style.display = "inline-block"; // Aligns with other controls
        button.style.marginLeft = "15px";  // Spacing from "Clear Chat"
        button.style.opacity = "0.85";

        button.addEventListener("mouseenter", () => {
            button.style.opacity = "1"; // Highlight on hover
        });

        button.addEventListener("mouseleave", () => {
            button.style.opacity = "0.85"; // Restore opacity
        });

        button.addEventListener("click", exportChatLogs);
        chatControls.appendChild(button); // Add next to "Clear Chat"

        console.log("[Chat Logger] Button added inside chat controls.");
    }, 2000);
}



    function listenForChatMessages() {
        if (!window.socket) {
            console.error("[Chat Logger] No socket connection found! Retrying...");
            setTimeout(listenForChatMessages, 1000); // Retry every second
            return;
        }

        console.log("[Chat Logger] Attaching listener for chat messages...");

        window.socket.on('updateChatLines', (data) => {
            console.log("[Chat Logger] Received chat message event:", data);

            if (!data || !data.chatLine) {
                console.warn("[Chat Logger] Empty or undefined message received.");
                return;
            }

            const currentRoom = window.location.href.split('=')[1];
            saveChatMessage(currentRoom, data.user, data.chatLine);
        });
    }

    function initializeSocket() {
        if (!window.socket) {
            console.warn("[Chat Logger] No `window.socket` found. Attempting to hook into chat system...");

            io.Socket.prototype.o_emit = io.Socket.prototype.o_emit || io.Socket.prototype.emit;
            io.Socket.prototype.emit = function (eventName, ...args) {
                if (!window.socket) {
                    window.socket = this;
                    window.dispatchEvent(new Event('globalSocketReady'));
                }
                return this.o_emit(eventName, ...args);
            };
        }

        let attempt = 0;
        let checkInterval = setInterval(() => {
            attempt++;

            if (window.socket) {
                console.log("[Chat Logger] Socket found, starting logger...");
                clearInterval(checkInterval);
                listenForChatMessages();
                createDownloadButton();
                return;
            }

            // Alternative method: Try finding the socket manually
            let ioSockets = Object.values(io.sockets || {});
            if (ioSockets.length > 0) {
                window.socket = ioSockets[0]; // Use the first detected socket
                console.log("[Chat Logger] Found socket manually!", window.socket);
                clearInterval(checkInterval);
                listenForChatMessages();
                createDownloadButton();
                return;
            }

            console.log(`[Chat Logger] Waiting for socket... (Attempt ${attempt})`);

            if (attempt > 20) { // Stop checking after 20 seconds
                clearInterval(checkInterval);
                console.error("[Chat Logger] Failed to detect socket.");
            }
        }, 1000);
    }

    function initChatLogger() {
        console.log("[Chat Logger] Initializing...");
        initializeSocket();
    }

    initChatLogger();
})();





