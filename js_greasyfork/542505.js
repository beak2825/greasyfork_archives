// ==UserScript==
// @name         Triangulet Chat Integration
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Adds a chat feature to Triangulet
// @author       fsscooter
// @match        *://tri.pengpowers.xyz/*
// @match        *://coplic.com/*
// @icon         https://tri.pengpowers.xyz/media/misc/favicon.png
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/542505/Triangulet%20Chat%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/542505/Triangulet%20Chat%20Integration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addChatTab() {
        const sidebar = document.querySelector('.styles__sidebar___1XqWi-camelCase');
        if (!sidebar || sidebar.dataset.chatTabAdded) return;

        const existingTab = document.querySelector('.styles__pageButton___1wFuu-camelCase');
        if (!existingTab) return;

        const newTab = existingTab.cloneNode(true);
        newTab.href = "/stats?chat=true";
        newTab.querySelector('.styles__pageIcon___3OSy9-camelCase').className =
            "styles__pageIcon___3OSy9-camelCase fas fa-comments";
        newTab.querySelector('.styles__pageText___1eo7q-camelCase').textContent = "Chat";

        const bottomRow = document.querySelector('.styles__bottomRow___3OozA-camelCase');
        if (bottomRow) {
            sidebar.insertBefore(newTab, bottomRow);
            sidebar.dataset.chatTabAdded = "true";
        }
    }

    if (window.location.href.includes("/stats?chat=true")) {
        transformToChat();
    }

    addChatTab();
    const observer = new MutationObserver(addChatTab);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function transformToChat() {
        const profileBody = document.querySelector('.arts__profileBody___eNPbH-camelCase');
        if (profileBody) profileBody.style.display = "none";

        const topRightRow = document.querySelector('.styles__topRightRow___dQvxc-camelCase');
        if (topRightRow) {
            topRightRow.insertAdjacentHTML('afterbegin', `
                <div class="styles__profileContainer___CSuIE-camelCase" role="button" tabindex="0">
                    <div class="styles__profileRow___cJa4E-camelCase">
                        <div style="position: relative" class="styles__blookContainer___36LK2-camelCase styles__profileBlook___37mfP-camelCase">
                            <img src="https://i.ibb.co/r2gYyjdJ/output-onlinepngtools-3.png" id="status" draggable="false" class="styles__blook___1R6So-camelCase">
                        </div>
                        <span style="color: #ffffff" id="usersnamedrop">0 Users Online</span>
                    </div>
                    <i class="fas fa-angle-down styles__profileDropdownIcon___3iLIX-camelCase" aria-hidden="true"></i>
                    <div class="styles__profileDropdownMenu___2jUAA-camelCase" id="online-users-dropdown" style="max-height: 300px; overflow-y: auto;"></div>
                </div>
            `);
        }

        const style = document.createElement('style');
        style.textContent = `
            #chat-container {
                height: 502px;
                width: 80%;
                max-width: 1114px;
                overflow-y: auto;
                padding: 10px;
                margin-bottom: 10px;
                background-color: rgba(0, 0, 0, 0);
                margin-left: 220px;
            }

            .chat-message {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                color: #fff;
            }

            .styles__infoContainer___2uI-S-camelCase {
                display: flex;
                align-items: center;
                gap: 10px;
                width: 1000px;
                padding: 12px;
                position: fixed;
                bottom: 0;
                left: 25%;
                transform: translateX(-10%);
            }

            .styles__infoContainer___2uI-S-camelCase i {
                color: #fff;
                font-size: 20px;
                cursor: pointer;
                flex-shrink: 0;
                margin-bottom: -35px;
                transform: translateX(-2445%);
            }

            #user-input {
                width: 95%;
                padding: 5px;
                font-size: 16px;
                font-family: 'Nunito', sans-serif;
                background: rgba(0, 0, 0, 0.5);
                color: #fff;
                border: none;
                outline: none;
                border-radius: 5px;
                display: inline-block;
                transform: translateX(1%);
            }

            #typing-indicator {
                margin: -5px 0 10px 220px;
                padding-left: 20px;
                font-style: italic;
                color: #ffff;
                font-size: 14px;
            }

            #new-message {
                display: none;
                margin: -12px 0 10px 220px;
                padding-left: 400px;
                font-weight: bold;
                color: #fff;
                font-size: 18px;
                cursor: pointer;
            }

            .profile-link {
                text-decoration: none;
                color: inherit;
            }
        `;
        document.head.appendChild(style);

        const chatHTML = `
            <div id="chat-container"></div>
            <div id="typing-indicator"></div>
            <div id="new-message"></div>
            <div class="styles__infoContainer___2uI-S-camelCase">
                <i class="fas fa-upload" style="cursor: pointer;" onclick="document.getElementById('fileInput').click();"></i>
                <input type="file" id="fileInput" accept="image/*,video/*,audio/*" style="display: none;">
                <input type="text" id="user-input" placeholder="Type a message..."/>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatHTML);

        initializeChat();
    }

    function initializeChat() {
        const firebaseScript = document.createElement('script');
        firebaseScript.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js';

        firebaseScript.onload = () => {
            const firebaseDatabaseScript = document.createElement('script');
            firebaseDatabaseScript.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js';

            firebaseDatabaseScript.onload = () => {
                const firebaseConfig = {
                    apiKey: "AIzaSyDV9tQXgzqxUayhvc384tTLOwy0QOEZVcU",
                    authDomain: "chat-e6c93.firebaseapp.com",
                    databaseURL: "https://chat-e6c93-default-rtdb.firebaseio.com",
                    projectId: "chat-e6c93",
                    storageBucket: "chat-e6c93.appspot.com",
                    messagingSenderId: "131547791719",
                    appId: "1:131547791719:web:2f567033f028810345afc2",
                    measurementId: "G-VY49LNJJLG"
                };

                const app = firebase.initializeApp(firebaseConfig);
                const db = firebase.database();
                const chatRef = db.ref('triangulet1/');
                const typingRef = db.ref('triangulet_typing/');
                const onlineRef = db.ref('triangulet_online/');

                const PAGE_SIZE = 20;
                let earliestTimestamp = null;
                let loadingOlderMessages = false;
                let loadedMessages = new Set();
                let firstLoadDone = false;

                const token = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('tokenraw='))
                    ?.split('=')[1];

                let currentUser = "User";
                let currentUserPfp = "https://i.ibb.co/5GBHSTB/Triangulet-Game-Logo.png";
                let currentUserId = "";

                fetch('/data/user', {
                    headers: {
                        'Authorization': decodeURIComponent(token)
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.username) {
                        currentUser = data.username;
                        if (data.pfp) {
                            currentUserPfp = data.pfp;
                        }
                        currentUserId = data.id;
                        initializeChatComponents();
                    } else {
                        console.error("Username not found in response");
                        initializeChatComponents();
                    }
                })
                .catch(err => {
                    console.error("Error fetching username:", err);
                    initializeChatComponents();
                });

                function initializeChatComponents() {
                    const userKey = currentUser.replace(/\W+/g, "_");
                    const userStatusRef = onlineRef.child(userKey);

                    userStatusRef.set({
                        username: currentUser,
                        userId: currentUserId,
                        timestamp: firebase.database.ServerValue.TIMESTAMP
                    });

                    const onlineStatusInterval = setInterval(() => {
                        userStatusRef.update({
                            timestamp: firebase.database.ServerValue.TIMESTAMP
                        });
                    }, 1000);

                    userStatusRef.onDisconnect().remove();

                    const chatContainer = document.getElementById("chat-container");
                    const userInput = document.getElementById("user-input");
                    const typingIndicator = document.getElementById("typing-indicator");
                    const newMessageBanner = document.getElementById("new-message");
                    const usersNameDrop = document.getElementById("usersnamedrop");
                    const usersDropdown = document.getElementById("online-users-dropdown");

                    function updateUserListDisplay(userList) {
                        usersDropdown.innerHTML = "";

                        userList.forEach(user => {
                            const safeUser = escapeHtml(user.username);
                            const safeUserId = escapeHtml(user.userId || '');
                            const displayName = safeUser.length > 15 ?
                                escapeHtml(safeUser.slice(0, 15)) + "..." :
                                safeUser;

                            const item = document.createElement("a");
                            item.className = "styles__profileDropdownOption___ljZXD-camelCase profile-link";
                            item.href = `https://tri.pengpowers.xyz/stats?id=${safeUserId}`;
                            item.style.color = "#ffffff";
                            item.innerHTML = `
                                <i class="fas fa-user styles__profileDropdownOptionIcon___15VKX-camelCase" style="color: #ffffff;"></i>
                                <span title="${safeUser}">${displayName}</span>
                            `;
                            usersDropdown.appendChild(item);
                        });

                        usersNameDrop.textContent = `${userList.length} User${userList.length !== 1 ? 's' : ''} Online`;
                        usersDropdown.style.maxHeight = userList.length > 15 ? "300px" : "unset";
                        usersDropdown.style.overflowY = userList.length > 15 ? "auto" : "unset";
                    }

                    onlineRef.on('value', (snapshot) => {
                        const data = snapshot.val() || {};
                        const users = Object.values(data)
                            .filter(entry => entry.username)
                            .sort((a, b) => a.username.localeCompare(b.username));
                        updateUserListDisplay(users);
                    });

                                       function sanitizeHtml(html) {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML
        .replace(/javascript:/gi, '')
        .replace(/on\w+="[^"]*"/gi, '');
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

                    function formatTimestamp(timestamp) {
                        const date = new Date(timestamp);
                        const now = new Date();
                        const options = { hour: 'numeric', minute: '2-digit', hour12: true };

                        if (date.toDateString() === now.toDateString()) {
                            return date.toLocaleTimeString(undefined, options);
                        }
                        return date.toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            ...options
                        });
                    }

                    function renderMessage(text) {
                        const blockedDomains = [
                            "iplogger","wl.gl","ed.tc","bc.ax","maper.info","2no.co","yip.su",
                            "iplis.ru","ezstat.ru","iplog.co","iplogger.cn","grabify","hd.gd",
                            "onbit.pro","snifferip.com","unl.one","urlto.me","location.cyou",
                            "mymap.icu","mymap.quest","map-s.online","crypto-o.click","cryp-o.online",
                            "account.beauty","photospace.life","photovault.store","imagehub.fun",
                            "sharevault.cloud","xtube.chat","screensnaps.top","photovault.pics",
                            "foot.wiki","gamergirl.pro","picshost.pics","pichost.pics","imghost.pics",
                            "screenshare.pics","myprivate.pics","shrekis.life","screenshot.best",
                            "gamingfun.me","stopify.co"
                        ];

                        function isBlockedUrl(url) {
                            try {
                                const lowered = url.toLowerCase();
                                return blockedDomains.some(domain => lowered.includes(domain));
                            } catch {
                                return false;
                            }
                        }

                        const trimmedText = text.trim();
                        const cleanText = sanitizeHtml(trimmedText);

                        if (cleanText.startsWith("data:")) {
                            const mime = cleanText.slice(5, cleanText.indexOf(";"));
                            if (mime.startsWith("image/")) {
                                return `<img src="${sanitizeHtml(cleanText)}" style="max-width: 300px; max-height: 300px; border-radius: 6px;">`;
                            } else if (mime.startsWith("video/")) {
                                return `<video controls style="max-width: 300px; max-height: 300px;">
                                            <source src="${sanitizeHtml(cleanText)}" type="${sanitizeHtml(mime)}">
                                            Your browser does not support the video tag.
                                        </video>`;
                            } else if (mime.startsWith("audio/")) {
                                return `<audio controls>
                                            <source src="${sanitizeHtml(cleanText)}" type="${sanitizeHtml(mime)}">
                                            Your browser does not support the audio tag.
                                        </audio>`;
                            }
                        }

                        const urlRegex = /^https?:\/\/[^\s]+$/i;
                        const imageUrlPattern = /(https?:\/\/.*\.(?:jpeg|jpg|gif|png|svg|webp|tiff|eps|bmp|avif|xcf|ico))/i;
                        const videoUrlPattern = /(https?:\/\/.*\.(?:avi|mov|mp4|ogg|wmv|mkv|mpg|flv|avchd|mpeg4|m2ts|webm))/i;
                        const audioUrlPattern = /(https?:\/\/.*\.(?:mp3|wav|aac|pcm|m4a|m4p|opus|flac|dsd|gsm|wma|ogg))/i;

                        if (urlRegex.test(cleanText)) {
                            if (isBlockedUrl(cleanText)) {
                                return escapeHtml(cleanText);
                            }

                            if (imageUrlPattern.test(cleanText)) {
                                return `<img src="${sanitizeHtml(cleanText)}" style="max-width: 300px; max-height: 300px; border-radius: 6px;">`;
                            } else if (videoUrlPattern.test(cleanText)) {
                                return `<video controls style="max-width: 300px; max-height: 300px;">
                                            <source src="${sanitizeHtml(cleanText)}">
                                            Your browser does not support the video tag.
                                        </video>`;
                            } else if (audioUrlPattern.test(cleanText)) {
                                return `<audio controls>
                                            <source src="${sanitizeHtml(cleanText)}">
                                            Your browser does not support the audio tag.
                                        </audio>`;
                            } else {
                                return `<a href="${escapeHtml(cleanText)}" target="_blank" rel="noopener noreferrer">${escapeHtml(cleanText)}</a>`;
                            }
                        }

                        return escapeHtml(cleanText);
                    }

                    function appendMessage(sender, text, timestamp, pfp, userId, prepend = false) {
                        const safeSender = escapeHtml(sender.length > 15 ? sender.slice(0, 15) + "..." : sender);
                        const safeUserId = escapeHtml(userId || '');
                        const mentionRegex = /@(\w{1,30})/g;
                        const pingSound = new Audio("https://cdn.glitch.global/a6695a81-c90d-4020-ae20-474929cf2986/Blacket%20Reply%20SFX%20(mp3cut.net)%20(1).mp3?v=1749595919054");
                        let containsMention = false;

                        const processedText = escapeHtml(text).replace(mentionRegex, (_, m) => {
                            const safe = escapeHtml(m);
                            if (safe.toLowerCase() === currentUser.toLowerCase() || safe.toLowerCase() === "everyone") {
                                containsMention = true;
                            }
                            return `<span style="color: blue; font-weight: bold;">@${safe}</span>`;
                        });

                        if (containsMention) {
                            pingSound.play().catch(() => {});
                        }

                        const safePfp = pfp ? sanitizeHtml(pfp) : 'https://i.ibb.co/5GBHSTB/Triangulet-Game-Logo.png';
                        const msgStyle = containsMention ?
                            "background-color: yellow; padding: 5px; border-radius: 4px; color: black;" :
                            "color: white;";

                        const formattedTime = formatTimestamp(timestamp);
                        const html = `
                            <div class="chat-message" style="display: flex; align-items: flex-start; margin-bottom: 15px; gap: 10px;">
                                <a href="https://tri.pengpowers.xyz/stats?id=${safeUserId}" class="profile-link">
                                    <img src="${safePfp}" alt="User Icon" style="width: 50px; height: 50px; border-radius: 0;">
                                </a>
                                <div>
                                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                                        <a href="https://tri.pengpowers.xyz/stats?id=${safeUserId}" class="profile-link">
                                            <strong style="font-size: 1.2em; color: white;">${safeSender}</strong>
                                        </a>
                                        <span style="font-size: 0.85em; color: white;">${formattedTime}</span>
                                    </div>
                                    <span style="font-size: 1em; word-break: break-word; ${msgStyle}">
                                        ${renderMessage(processedText)}
                                    </span>
                                </div>
                            </div>`;

                        if (prepend) {
                            const prevScroll = chatContainer.scrollHeight;
                            chatContainer.insertAdjacentHTML('afterbegin', html);
                            const diff = chatContainer.scrollHeight - prevScroll;
                            chatContainer.scrollTop += diff;
                        } else {
                            chatContainer.insertAdjacentHTML('beforeend', html);
                            if (isNearBottom()) {
                                chatContainer.scrollTop = chatContainer.scrollHeight;
                                newMessageBanner.style.display = "none";
                            } else {
                                newMessageBanner.textContent = "New messages";
                                newMessageBanner.style.display = "block";
                            }
                        }
                    }

                    function isNearBottom() {
                        return Math.abs(chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight) < 100;
                    }

                    async function loadMessages(initial = false) {
                        if (loadingOlderMessages) return;
                        loadingOlderMessages = true;

                        let queryRef;
                        if (initial) {
                            queryRef = chatRef.orderByChild("timestamp").limitToLast(PAGE_SIZE);
                        } else if (earliestTimestamp) {
                            queryRef = chatRef.orderByChild("timestamp").endAt(earliestTimestamp).limitToLast(PAGE_SIZE + 1);
                        } else {
                            loadingOlderMessages = false;
                            return;
                        }

                        try {
                            const snapshot = await queryRef.once('value');
                            const data = snapshot.val();
                            if (!data) return;

                            let messages = Object.entries(data).map(([id, msg]) => ({ id, ...msg }));
                            messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                            if (!initial) messages.pop();

                            for (const msg of messages) {
                                if (!loadedMessages.has(msg.id)) {
                                    appendMessage(
                                        msg.username || "User",
                                        msg.text,
                                        msg.timestamp,
                                        msg.pfp,
                                        msg.userId,
                                        !initial
                                    );
                                    loadedMessages.add(msg.id);
                                    if (!earliestTimestamp || new Date(msg.timestamp) < new Date(earliestTimestamp)) {
                                        earliestTimestamp = msg.timestamp;
                                    }
                                }
                            }

                            if (initial) {
                                setTimeout(() => {
                                    chatContainer.scrollTop = chatContainer.scrollHeight;
                                }, 0);
                                firstLoadDone = true;
                            }
                        } finally {
                            loadingOlderMessages = false;
                        }
                    }

                    chatRef.on('child_added', (snapshot) => {
                        const msg = snapshot.val();
                        const id = snapshot.key;
                        if (!loadedMessages.has(id) && firstLoadDone) {
                            appendMessage(
                                msg.username || "User",
                                msg.text,
                                msg.timestamp,
                                msg.pfp,
                                msg.userId
                            );
                            loadedMessages.add(id);
                        }
                    });

                    chatContainer.addEventListener("scroll", () => {
                        if (chatContainer.scrollTop < 100 && !loadingOlderMessages) {
                            loadMessages(false);
                        }
                        if (isNearBottom()) {
                            newMessageBanner.style.display = "none";
                        }
                    });

                    newMessageBanner.addEventListener("click", () => {
                        chatContainer.scrollTop = chatContainer.scrollHeight;
                        newMessageBanner.style.display = "none";
                    });

                    let typingTimeout;
                    userInput.addEventListener("input", () => {
                        typingRef.child(userKey).set({
                            username: currentUser,
                            timestamp: firebase.database.ServerValue.TIMESTAMP
                        });
                        clearTimeout(typingTimeout);
                        typingTimeout = setTimeout(() => {
                            typingRef.child(userKey).remove();
                        }, 3000);
                    });

                    typingRef.on('value', (snapshot) => {
                        const data = snapshot.val() || {};
                        const typers = Object.values(data)
                            .filter(entry => entry.username && entry.username.toLowerCase() !== currentUser.toLowerCase())
                            .map(entry => escapeHtml(entry.username));

                        if (typers.length === 0) {
                            typingIndicator.textContent = "";
                        } else if (typers.length === 1) {
                            typingIndicator.textContent = `${typers[0]} is typing...`;
                        } else {
                            const displayed = typers.slice(0, 2).join(", ");
                            const remaining = typers.length - 2;
                            typingIndicator.textContent = remaining > 0 ?
                                `${displayed}, and ${remaining} more are typing...` :
                                `${displayed} are typing...`;
                        }
                    });

                    userInput.addEventListener("keypress", (e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    });

                    async function sendMessage() {
                        const text = userInput.value.trim();
                        if (!text) return;

                        try {
                            await chatRef.push({
                                text,
                                username: currentUser,
                                pfp: currentUserPfp,
                                userId: currentUserId,
                                timestamp: firebase.database.ServerValue.TIMESTAMP
                            });
                            userInput.value = '';
                            typingRef.child(userKey).remove();
                        } catch (err) {
                            console.error("Error sending message:", err);
                        }
                    }

                    const fileInput = document.getElementById("fileInput");
                    fileInput.addEventListener("change", (event) => {
                        const file = event.target.files[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const base64 = e.target.result;
                            chatRef.push({
                                text: base64,
                                username: currentUser,
                                pfp: currentUserPfp,
                                userId: currentUserId,
                                timestamp: firebase.database.ServerValue.TIMESTAMP
                            });
                        };
                        reader.readAsDataURL(file);
                    });

                    loadMessages(true);
                }
            };

            document.head.appendChild(firebaseDatabaseScript);
        };

        document.head.appendChild(firebaseScript);
    }
})();
