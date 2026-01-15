// ==UserScript==
// @name         SLITHER.IO - DAMNBRUH.COM STANDALONE CHAT MOD (NOW TALK WITH OTHER GAMERS!)
// @namespace    http://tampermonkey.net/
// @version      16.2 - Universal + Slither Support
// @description  Adds the 143X community chat with profiles, a working GIF search, admin tools, profanity filter, and Discord integration. Works on Slither.io, DamnBruh.com, and any website.
// @author       dxxthly & waynesg

// Slither.io
// @match        http://slither.io/
// @match        https://slither.io/
// @match        http://slither.com/io
// @match        https://slither.com/io

// DamnBruh
// @match        https://www.damnbruh.com
// @match        https://www.damnbruh.com/*
// @match        http://www.damnbruh.com/*

// Any website
// @match        *://*/*

 // @grant        none
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUNcRl2Rh40pZLhgffYGFDRLbYJ4qfMNwddQ&s
// @downloadURL https://update.greasyfork.org/scripts/542999/SLITHERIO%20-%20DAMNBRUHCOM%20STANDALONE%20CHAT%20MOD%20%28NOW%20TALK%20WITH%20OTHER%20GAMERS%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542999/SLITHERIO%20-%20DAMNBRUHCOM%20STANDALONE%20CHAT%20MOD%20%28NOW%20TALK%20WITH%20OTHER%20GAMERS%21%29.meta.js
// ==/UserScript==




(function() {
    'use strict';

    // --- GUARDIAN STYLESHEET ---
    (function createGuardianStylesheet() {
        const guardianStyle = document.createElement('style');
        guardianStyle.id = 'mod-guardian-styles';
        guardianStyle.textContent = `html, body { filter: none !important; transform: none !important; }`;
        (document.head || document.documentElement).appendChild(guardianStyle);
        console.log('Guardian Stylesheet is active.');
    })();

    let hasInitialized = false;

    // --- Initialization Checker ---
    const initChecker = setInterval(() => {
        if (document.getElementById('login') && !hasInitialized) {
            hasInitialized = true;
            clearInterval(initChecker);
            main();
        }
    }, 100);

    const systemAccounts = ["system", "discord_bot", "system_badge"];

    // =================================================================================
    // MAIN SCRIPT FUNCTION
    // =================================================================================
    function main() {
        // --- CONFIGURATION ---
        const config = {
            chatMaxMessages: 75,
            // --- Using GIPHY API from the slither.js file ---
            giphyApiKey: 'xWBhUx8jBtCxxjPHvtUzHLZlPGYBUTFq', // Public GIPHY key
            firebaseConfig: {
                apiKey: "AIzaSyCtTloqGNdhmI3Xt0ta11vF0MQJHiKpO7Q",
                authDomain: "chatforslither.firebaseapp.com",
                databaseURL: "https://chatforslither-default-rtdb.firebaseio.com",
                projectId: "chatforslither",
                storageBucket: "chatforslither.appspot.com",
                messagingSenderId: "1045559625491",
                appId: "1:1045559625491:web:79eb8200eb87edac00bce6"
            },
            adminList: [],
            devList: [
                { uid: "CiOpgh1RLBg3l5oXn0SAho66Po93" }, { uid: "PZA5qgKWsPTXc278pyx7NwROf313" },
                { uid: "P75eMwh756Rb6h1W6iqQfHN2Dm92" }, { uid: "tC1VW4WkXEOfK7rCpwGvFcv7MJo1" },
                { uid: "hTinUwrewTYNcXujW1hUaXrScGW2" }
            ],
            vipMembers: [{ uid: "crcOY9hoRrfayStCxMVm7Zdx2W92", name: "stevao" }, { uid: "DhGhICAZwkRa7wuMsyquM9a5uO92", name: "LUANBLAYNER" }]
        };

        // --- STYLES (CSS INJECTION) ---
        const style = document.createElement('style');
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
            :root { --chat-accent-color: #00E676; --chat-accent-color-dark: #00C853; --chat-bg-color: rgba(22, 24, 30, 0.75); --chat-header-bg: rgba(0, 0, 0, 0.2); --chat-text-color: #E0E0E0; --chat-text-color-muted: #9E9E9E; --chat-border-color: rgba(0, 230, 118, 0.3); --chat-shadow-color: rgba(0, 0, 0, 0.5); --font-main: 'Inter', sans-serif; }
            @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            #chat-container { position: fixed; left: 20px; top: 100px; width: 380px; height: 450px; z-index: 9999; display: flex; flex-direction: column; background: var(--chat-bg-color); backdrop-filter: blur(12px) saturate(180%); -webkit-backdrop-filter: blur(12px) saturate(180%); border: 1px solid var(--chat-border-color); border-radius: 12px; box-shadow: 0 8px 32px 0 var(--chat-shadow-color); overflow: hidden; user-select: none; resize: both; min-width: 320px; min-height: 250px; font-family: var(--font-main); animation: fadeIn 0.3s ease-out; }
            #chat-header { display: flex; align-items: center; background: var(--chat-header-bg); cursor: move; border-bottom: 1px solid var(--chat-border-color); }
            .chat-tab { flex: 1; padding: 12px 15px; text-align: center; cursor: pointer; font-weight: 500; color: var(--chat-text-color-muted); transition: all 0.25s ease; border-bottom: 3px solid transparent; }
            #chat-tab-main { color: var(--chat-text-color); border-bottom-color: var(--chat-accent-color); background: rgba(0, 230, 118, 0.1); }
            #chat-settings-btn, #chat-hide-btn { background: none; border: none; color: var(--chat-text-color-muted); font-size: 20px; padding: 0 15px; cursor: pointer; transition: all 0.25s ease; }
            #chat-settings-btn:hover, #chat-hide-btn:hover { color: var(--chat-accent-color); transform: scale(1.1); }
            #chat-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
            #chat-body, #online-users { flex: 1; padding: 10px 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; scrollbar-width: thin; scrollbar-color: var(--chat-accent-color) transparent; }
            #online-users { display: none; } #chat-body p:first-child { color: var(--chat-text-color-muted); text-align: center; margin-top: 10px; }
            #chat-input-container { display: flex; align-items: center; border-top: 1px solid var(--chat-border-color); padding: 5px; background: rgba(0, 0, 0, 0.2); }
            #chat-input { flex-grow: 1; padding: 12px 15px; border: none; background: transparent; color: var(--chat-text-color); outline: none; font-size: 14px; transition: all 0.25s ease; }
            #chat-input::placeholder { color: var(--chat-text-color-muted); } #chat-input:focus { box-shadow: 0 0 15px rgba(0, 230, 118, 0.2) inset; border-radius: 6px; }
            #gif-btn { background: none; border: none; color: var(--chat-text-color-muted); cursor: pointer; font-size: 16px; padding: 0 10px; font-weight: bold; transition: all 0.25s ease; }
            #gif-btn:hover { color: var(--chat-accent-color); transform: scale(1.1); }
            .chat-modal-overlay, #gif-modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 10001; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); align-items: center; justify-content: center; animation: fadeIn 0.2s ease-out; }
            .chat-modal-content { background: var(--chat-bg-color); backdrop-filter: blur(15px) saturate(180%); -webkit-backdrop-filter: blur(15px) saturate(180%); border-radius: 12px; padding: 25px 30px; width: 420px; display: flex; flex-direction: column; gap: 20px; border: 1px solid var(--chat-border-color); box-shadow: 0 8px 32px 0 var(--chat-shadow-color); }
            .chat-modal-content h2 { margin: 0 0 10px 0; color: var(--chat-accent-color); text-align: center; font-weight: 700; }
            .settings-field { display: flex; flex-direction: column; gap: 8px; } .settings-field label { color: var(--chat-text-color-muted); font-size: 0.9em; font-weight: 500; }
            .settings-field input[type="text"] { width: 100%; box-sizing: border-box; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--chat-text-color); font-size: 1em; transition: all 0.25s ease; }
            .settings-field input[type="text"]:focus { border-color: var(--chat-accent-color); box-shadow: 0 0 10px rgba(0, 230, 118, 0.3); }
            .color-input-wrapper { display: flex; align-items: center; gap: 10px; padding: 5px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; }
            .color-input-wrapper input[type="color"] { width: 35px; height: 35px; border: none; background: none; cursor: pointer; border-radius: 4px; }
            .modal-buttons { display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px; }
            .modal-btn { padding: 10px 22px; border: none; border-radius: 6px; font-size: 0.95em; font-weight: 500; cursor: pointer; transition: all 0.25s ease; }
            #settings-save-btn, .admin-edit-save-btn { background: var(--chat-accent-color); color: #000; }
            #settings-save-btn:hover, .admin-edit-save-btn:hover { background: var(--chat-accent-color-dark); transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0, 230, 118, 0.3); }
            #settings-cancel-btn, .admin-edit-cancel-btn { background: rgba(255,255,255,0.15); color: var(--chat-text-color); }
            #settings-cancel-btn:hover, .admin-edit-cancel-btn:hover { background: rgba(255,255,255,0.25); }
            .profile-popup { position: fixed; z-index: 10002; display: flex; flex-direction: column; align-items: center; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 320px; background: var(--chat-bg-color); backdrop-filter: blur(15px) saturate(180%); color: var(--chat-text-color); border-radius: 16px; border: 1px solid var(--chat-border-color); box-shadow: 0 8px 40px rgba(0,0,0,0.5); padding: 30px; animation: fadeIn 0.2s ease-out; text-align: center; }
            .profile-popup .avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 4px solid var(--chat-accent-color); margin-bottom: 20px; box-shadow: 0 0 20px rgba(0, 230, 118, 0.4); }
            .profile-popup .close-btn { position: absolute; top: 15px; right: 15px; background: none; border: none; color: var(--chat-text-color-muted); font-size: 1.8em; cursor: pointer; transition: all 0.25s ease; }
            .profile-popup .close-btn:hover { color: #fff; transform: rotate(90deg); }
            .profile-popup h3 { margin: 0; font-size: 1.4em; font-weight: 700; word-break: break-all; }
            .profile-popup p { color: #bbb; font-style: italic; margin: 8px 0 18px 0; word-break: break-word; }
            .profile-popup .admin-actions button { background: #673AB7; color: white; margin-top: 10px; }
            #gif-modal-content { background: #1c1c1e; width: 400px; height: 500px; display: flex; flex-direction: column; border-radius: 10px; border: 1px solid #444; overflow: hidden; }
            #gif-search-header { display: flex; padding: 10px; border-bottom: 1px solid #444; }
            #gif-search-input { flex-grow: 1; padding: 10px; background: #2c2c2e; border: 1px solid #555; border-radius: 5px; color: #fff; outline: none; }
            #gif-results { flex-grow: 1; overflow-y: auto; padding: 10px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
            #gif-results img { width: 100%; border-radius: 5px; cursor: pointer; transition: transform 0.2s ease; background: #2c2c2e; }
            #gif-results img:hover { transform: scale(1.05); }
            ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: var(--chat-border-color); border-radius: 4px; } ::-webkit-scrollbar-thumb:hover { background: var(--chat-accent-color); }
        `;
        document.head.appendChild(style);

        // --- HELPER FUNCTIONS ---
        const escapeHTML = (str) => { const p = document.createElement('p'); p.appendChild(document.createTextNode(str)); return p.innerHTML; };
        const isDev = (uid) => config.devList.some(dev => dev.uid === uid);
        const isAdmin = (uid) => config.adminList.some(admin => admin.uid === uid);
        const isVip = (uid, name) => config.vipMembers.some(vip => vip.uid === uid && vip.name.toLowerCase() === (name || '').toLowerCase());
        const rainbowTextStyle = (name) => name.split('').map((char, i) => `<span style="color:${["#ef3550","#f48fb1","#7e57c2","#2196f3","#26c6da","#43a047","#eeff41","#f9a825","#ff5722"][i % 9]}; font-weight: bold;">${char}</span>`).join('');
        const vipGlowStyle = (name, color) => `<span style="color:#fff;font-weight:bold;text-shadow:0 0 5px #fff, 0 0 10px ${color}, 0 0 15px ${color};">${name}</span>`;
        const containsProfanity = (text) => {
            if (!text) return false;
            const pattern = /\bn\s*i\s*g\s*g\s*([e3a@])\s*r\b|\bn\s*i\s*g\s*g\s*a\b/gi;
            const normalizedText = text.replace(/[1!]/g, 'i').replace(/[3€]/g, 'e').replace(/@/g, 'a').replace(/[4]/g, 'a').replace(/[9]/g, 'g');
            return pattern.test(normalizedText);
        };

        // --- UI & MODAL CREATION ---
        const chatContainer = document.createElement('div'); chatContainer.id = 'chat-container';
        chatContainer.innerHTML = `
            <div id="chat-header"> <div id="chat-tab-main" class="chat-tab">143X Chat</div> <div id="chat-tab-users" class="chat-tab">Online Users</div> <button id="chat-settings-btn" title="Settings">⚙️</button> <button id="chat-hide-btn" title="Hide Chat">×</button> </div>
            <div id="chat-area"> <div id="chat-body"><p>Initializing...</p></div> <div id="online-users"></div> <div id="chat-input-container"><input id="chat-input" type="text" placeholder="Connecting..." disabled><button id="gif-btn" title="Send a GIF">GIF</button></div> </div>`;
        document.body.appendChild(chatContainer);
        makeDraggable(chatContainer, document.getElementById('chat-header'));
        const settingsModal = document.createElement('div'); settingsModal.id = 'settings-modal-overlay'; settingsModal.className = 'chat-modal-overlay';
        settingsModal.innerHTML = `
            <div id="settings-modal" class="chat-modal-content">
                <h2>Chat & Profile Settings</h2>
                <div class="settings-field"><label>Nickname</label><input type="text" id="settings-nickname" maxlength="20"></div>
                <div class="settings-field"><label>Chat Name Color</label><div class="color-input-wrapper"><input type="color" id="settings-name-color"></div></div>
                <div class="settings-field"><label>Profile Avatar URL</label><input type="text" id="settings-avatar"></div>
                <div class="settings-field"><label>Profile Motto</label><input type="text" id="settings-motto" maxlength="60"></div>
                <div class="modal-buttons"><button id="settings-cancel-btn" class="modal-btn">Cancel</button><button id="settings-save-btn" class="modal-btn">Save</button></div>
            </div>`;
        document.body.appendChild(settingsModal);
        const gifModal = document.createElement('div'); gifModal.id = 'gif-modal-overlay';
        gifModal.innerHTML = `<div id="gif-modal-content"><div id="gif-search-header"><input type="text" id="gif-search-input" placeholder="Search GIPHY GIFs..."></div><div id="gif-results"></div></div>`;
        document.body.appendChild(gifModal);

        // --- FIREBASE & CHAT LOGIC ---
        function loadFirebaseAndInit() {
            const script1 = document.createElement('script'); script1.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js';
            script1.onload = () => { const script2 = document.createElement('script'); script2.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js';
                script2.onload = () => { const script3 = document.createElement('script'); script3.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js';
                    script3.onload = () => initializeChat(window.firebase); document.head.appendChild(script3); }; document.head.appendChild(script2); }; document.head.appendChild(script1);
        }

        function initializeChat(firebase) {
            if (!firebase.apps.length) firebase.initializeApp(config.firebaseConfig);
            const auth = firebase.auth(); const db = firebase.database();
            auth.signInAnonymously().catch(err => console.error("Firebase Sign-In Error:", err));
            auth.onAuthStateChanged(user => {
                if (user) {
                    const chatInput = document.getElementById('chat-input'); chatInput.disabled = false; chatInput.placeholder = 'Type and press Enter...'; document.getElementById('chat-body').innerHTML = '';
                    let nickname = localStorage.getItem("slitherChatNickname");
                    if (!nickname || containsProfanity(nickname)) {
                        nickname = prompt("Welcome! Please enter a nickname:", "Player") || "Anon";
                        while(containsProfanity(nickname)) {
                           nickname = prompt("That nickname is not allowed. Please choose another:", "Player") || "Anon";
                        }
                        localStorage.setItem("slitherChatNickname", nickname);
                    }
                    const userRef = db.ref("onlineUsers/" + user.uid);
                    userRef.onDisconnect().remove();
                    const localData = { name: nickname, chatNameColor: localStorage.getItem("slitherChatNameColor") || "#FFD700", profileAvatar: localStorage.getItem("slitherChatAvatar") || "", profileMotto: localStorage.getItem("slitherChatMotto") || "" };
                    userRef.update({ ...localData, uid: user.uid, lastActive: firebase.database.ServerValue.TIMESTAMP });
                    setInterval(() => userRef.update({ lastActive: Date.now() }), 45000);
                    listenForOnlineUsers(db);
                    setupEventListeners(db, user);
                }
            });
            let chatMessagesArray = [];
            let latestTimeLoaded = 0;
            const chatBody = document.getElementById('chat-body');

            db.ref("slitherChat").orderByChild("time").limitToLast(config.chatMaxMessages).once("value", (snapshot) => {
                if (!snapshot.exists()) return;
                snapshot.forEach(child => { chatMessagesArray.push({ key: child.key, ...child.val() }); });
                chatMessagesArray.sort((a, b) => a.time - b.time);
                if (chatMessagesArray.length > 0) { latestTimeLoaded = chatMessagesArray[chatMessagesArray.length - 1].time; }
                if (chatBody) { chatBody.innerHTML = ''; for (const msg of chatMessagesArray) { renderChatMessage(msg, chatBody, auth.currentUser?.uid); } chatBody.scrollTop = chatBody.scrollHeight; }
                db.ref("slitherChat").orderByChild("time").startAt(latestTimeLoaded + 1).on("child_added", (newSnapshot) => {
                    const newMsg = { key: newSnapshot.key, ...newSnapshot.val() };
                    if (chatMessagesArray.some(m => m.key === newMsg.key)) return;
                    chatMessagesArray.push(newMsg);
                    if (chatMessagesArray.length > config.chatMaxMessages) chatMessagesArray.shift();
                    if (chatBody) { while (chatBody.children.length >= config.chatMaxMessages) { chatBody.removeChild(chatBody.firstChild); } renderChatMessage(newMsg, chatBody, auth.currentUser?.uid, true); }
                });
            });
        }

        function renderChatMessage(msg, chatBodyElement, currentUid, shouldScroll = false) {
            if (!msg || !msg.uid) return;
            const isValidHexColor = (color) => /^#([0-9a-fA-F]{3}){1,2}$/.test(color);
            let userColor = (msg.chatNameColor && isValidHexColor(msg.chatNameColor)) ? msg.chatNameColor : '#FFD700';
            const isSystemMessage = systemAccounts.includes(msg.uid);
            const isDiscordBot = msg.uid === 'discord_bot';
            const displayName = escapeHTML(msg.name || 'Anon');
            let nameHtml; let roleTagHTML = '';

            if (isDiscordBot) {
                nameHtml = `<span style="color:${userColor};font-weight:bold;">${displayName}</span>`;
                roleTagHTML = ` <span style="background: #7289DA; color: #fff; padding: 2px 7px; border-radius: 4px; font-size: 0.8em; font-weight: 700; vertical-align:middle;">DISCORD</span>`;
            } else if (isAdmin(msg.uid)) {
                nameHtml = `<span class="chat-username" data-uid="${msg.uid}" style="cursor:pointer;">${rainbowTextStyle(displayName)}</span>`;
                roleTagHTML = ` <span style="background: #F44336; color: #fff; padding: 2px 7px; border-radius: 4px; font-size: 0.8em; font-weight: 700; vertical-align:middle;">ADMIN</span>`;
            } else if (isDev(msg.uid)) {
                nameHtml = `<span class="chat-username" data-uid="${msg.uid}" style="cursor:pointer;">${rainbowTextStyle(displayName)}</span>`;
                roleTagHTML = ` <span style="background: #E91E63; color: #fff; padding: 2px 7px; border-radius: 4px; font-size: 0.8em; font-weight: 700; vertical-align:middle;">DEV</span>`;
            } else if (isVip(msg.uid, msg.name)) {
                nameHtml = `<span class="chat-username" data-uid="${msg.uid}" style="cursor:pointer;">${vipGlowStyle(displayName, userColor)}</span>`;
                roleTagHTML = ` <span style="background: #9C27B0; color: #fff; padding: 2px 7px; border-radius: 4px; font-size: 0.8em; font-weight: 700; vertical-align:middle;">VIP</span>`;
            } else if (isSystemMessage) {
                nameHtml = `<span style="color:${userColor};font-weight:bold;">System</span>`;
                roleTagHTML = ` <span style="background: #e74c3c; color: #fff; padding: 2px 7px; border-radius: 4px; font-size: 0.8em; font-weight: 700; vertical-align:middle;">SYSTEM</span>`;
            } else {
                nameHtml = `<span class="chat-username" data-uid="${msg.uid}" style="color:${userColor};font-weight:bold;cursor:pointer;">${displayName}</span>`;
            }

            let finalMessage = '';
            const imageRegex = /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif|webp))/i;
            const imageMatch = msg.text.match(imageRegex);
            if (imageMatch) {
                const textPart = escapeHTML(msg.text.replace(imageRegex, '').trim());
                finalMessage = `${textPart}<br><a href="${imageMatch[0]}" target="_blank"><img src="${imageMatch[0]}" style="max-width:90%; border-radius:6px; margin-top:5px; cursor:pointer;"></a>`;
            } else if (isSystemMessage || isDev(msg.uid) || isAdmin(msg.uid)) {
                finalMessage = msg.text;
            } else {
                finalMessage = escapeHTML(msg.text);
            }

            const el = document.createElement('div');
            const borderColor = (msg.uid === currentUid) ? 'var(--chat-accent-color)' : 'rgba(255,255,255,0.1)';
            const bgColor = (msg.uid === currentUid) ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255,255,255,0.04)';
            el.style.cssText = `margin-bottom: 2px; word-break: break-word; background: ${bgColor}; padding: 8px 12px; border-radius: 6px; color: var(--chat-text-color); font-family: inherit; font-size: 14px; line-height: 1.5; border-left: 3px solid ${borderColor};`;
            const timestamp = new Date(msg.time).toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' });
            el.innerHTML = `<span style="color:var(--chat-text-color-muted); font-size:0.9em; margin-right:8px;">${timestamp}</span> <b>${nameHtml}${roleTagHTML}:</b> ${finalMessage}`;
            chatBodyElement.appendChild(el);
            if (shouldScroll || chatBodyElement.scrollTop >= chatBodyElement.scrollHeight - chatBodyElement.clientHeight - 150) {
                chatBodyElement.scrollTop = chatBodyElement.scrollHeight;
            }
        }

        function listenForOnlineUsers(db) {
            const onlineUsersRef = db.ref("onlineUsers"); const onlineUsersDiv = document.getElementById('online-users'); const onlineUsersTab = document.getElementById('chat-tab-users');
            const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
            onlineUsersRef.orderByChild('lastActive').startAt(tenMinutesAgo).on('value', (snapshot) => {
                if (!onlineUsersDiv) return; onlineUsersDiv.innerHTML = ''; let userCount = 0;
                if (snapshot.exists()) {
                    snapshot.forEach(childSnapshot => {
                        const user = childSnapshot.val(); if (!user || !user.name) return; userCount++;
                        const userEl = document.createElement('div');
                        userEl.style.cssText = `padding: 8px 5px; cursor: pointer; border-radius: 4px; display:flex; align-items:center; transition: background 0.2s ease;`;
                        userEl.className = 'chat-username'; userEl.dataset.uid = user.uid;
                        userEl.onmouseover = () => { userEl.style.background = 'rgba(255,255,255,0.1)'; }; userEl.onmouseout = () => { userEl.style.background = 'transparent'; };
                        const userColor = (user.chatNameColor && /^#([0-9a-fA-F]{3}){1,2}$/.test(user.chatNameColor)) ? user.chatNameColor : '#FFFFFF';
                        let nameHtml;
                        if (isAdmin(user.uid) || isDev(user.uid)) { nameHtml = rainbowTextStyle(escapeHTML(user.name));
                        } else if (isVip(user.uid, user.name)) { nameHtml = vipGlowStyle(escapeHTML(user.name), userColor);
                        } else { nameHtml = `<span style="color:${userColor};">${escapeHTML(user.name)}</span>`; }
                        userEl.innerHTML = nameHtml; onlineUsersDiv.appendChild(userEl);
                    });
                }
                onlineUsersTab.textContent = `Online Users (${userCount})`;
            });
        }

        async function showUserProfile(db, uid, currentUser) {
            if (document.querySelector('.profile-popup')) return;
            try {
                const userSnapshot = await db.ref(`onlineUsers/${uid}`).once('value');
                if (!userSnapshot.exists()) { console.log("User not found or offline."); return; }
                const userData = userSnapshot.val();
                const popup = document.createElement('div'); popup.className = 'profile-popup';
                const defaultAvatar = 'https://i.imgur.com/M6NYjjO.jpeg';
                const avatarUrl = (userData.profileAvatar || '').trim() || defaultAvatar;
                const isCurrentUserAdminOrDev = isAdmin(currentUser.uid) || isDev(currentUser.uid);
                const adminActionsHTML = isCurrentUserAdminOrDev && currentUser.uid !== uid ? `<div class="admin-actions"><button id="admin-edit-btn" class="modal-btn">Edit Profile</button></div>` : '';
                popup.innerHTML = `<button class="close-btn">×</button><img src="${escapeHTML(avatarUrl)}" class="avatar" onerror="this.src='${defaultAvatar}'"><h3 style="margin: 0; color: ${escapeHTML(userData.chatNameColor || '#fff')};">${escapeHTML(userData.name || 'Anonymous')}</h3><p>"${escapeHTML(userData.profileMotto || 'No motto.')}"</p>${adminActionsHTML}`;
                document.body.appendChild(popup);
                popup.querySelector('.close-btn').addEventListener('click', () => popup.remove());
                if (isCurrentUserAdminOrDev && currentUser.uid !== uid) {
                    popup.querySelector('#admin-edit-btn').addEventListener('click', () => { popup.remove(); showAdminEditModal(db, uid, userData); });
                }
            } catch (error) { console.error("Error fetching user profile:", error); }
        }

        function showAdminEditModal(db, targetUid, userData) {
            if (document.getElementById('admin-edit-modal-overlay')) return;
            const editModal = document.createElement('div');
            editModal.id = 'admin-edit-modal-overlay'; editModal.className = 'chat-modal-overlay'; editModal.style.display = 'flex';
            editModal.innerHTML = `
                <div class="chat-modal-content">
                    <h2>Editing: ${escapeHTML(userData.name)}</h2>
                    <div class="settings-field"><label>Nickname</label><input type="text" id="admin-edit-nickname" value="${escapeHTML(userData.name || '')}"></div>
                    <div class="settings-field"><label>Avatar URL</label><input type="text" id="admin-edit-avatar" value="${escapeHTML(userData.profileAvatar || '')}"></div>
                    <div class="settings-field"><label>Motto</label><input type="text" id="admin-edit-motto" value="${escapeHTML(userData.profileMotto || '')}"></div>
                    <div class="modal-buttons"><button class="modal-btn admin-edit-cancel-btn">Cancel</button><button class="modal-btn admin-edit-save-btn">Save</button></div>
                </div>`;
            document.body.appendChild(editModal);
            editModal.querySelector('.admin-edit-cancel-btn').addEventListener('click', () => editModal.remove());
            editModal.querySelector('.admin-edit-save-btn').addEventListener('click', () => {
                const newName = document.getElementById('admin-edit-nickname').value; const newAvatar = document.getElementById('admin-edit-avatar').value; const newMotto = document.getElementById('admin-edit-motto').value;
                if (containsProfanity(newName) || containsProfanity(newMotto)) { alert("Update contains blocked words."); return; }
                db.ref(`onlineUsers/${targetUid}`).update({ name: newName, profileAvatar: newAvatar, profileMotto: newMotto });
                editModal.remove();
            });
        }

        // --- GIPHY GIF FUNCTIONS (from slither.js) ---
        async function openGifPicker() {
            const gifPicker = document.getElementById('gif-modal-overlay');
            const resultsContainer = document.getElementById('gif-results');
            if (!gifPicker || !resultsContainer) return;

            gifPicker.style.display = 'flex';
            resultsContainer.innerHTML = '<div style="color:#888; text-align:center; grid-column: 1 / -1;">Loading trending GIFs...</div>';

            try {
                const response = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${config.giphyApiKey}&limit=20&rating=pg-13`);
                const json = await response.json();
                displayGifs(json.data);
            } catch (error) {
                resultsContainer.innerHTML = '<div style="color:#f77; text-align:center; grid-column: 1 / -1;">Could not load GIFs.</div>';
                console.error("Giphy Trending Error:", error);
            }
        }

        async function searchGifs() {
            const searchInput = document.getElementById('gif-search-input');
            const resultsContainer = document.getElementById('gif-results');
            const query = searchInput.value.trim();

            if (!query) {
                openGifPicker(); // Show trending if search is empty
                return;
            }
            resultsContainer.innerHTML = `<div style="color:#888; text-align:center; grid-column: 1 / -1;">Searching for "${escapeHTML(query)}"...</div>`;

            try {
                const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${config.giphyApiKey}&q=${encodeURIComponent(query)}&limit=30&rating=pg-13`);
                const json = await response.json();
                displayGifs(json.data);
            } catch (error) {
                resultsContainer.innerHTML = '<div style="color:#f77; text-align:center; grid-column: 1 / -1;">Search failed.</div>';
                console.error("Giphy Search Error:", error);
            }
        }

        function displayGifs(gifData) {
            const resultsContainer = document.getElementById('gif-results');
            resultsContainer.innerHTML = '';

            if (!gifData || gifData.length === 0) {
                resultsContainer.innerHTML = '<div style="color:#888; text-align:center; grid-column: 1 / -1;">No results found.</div>';
                return;
            }

            gifData.forEach(gif => {
                const img = document.createElement('img');
                img.src = gif.images.fixed_height_small.url;
                img.dataset.originalurl = gif.images.original.url;
                img.alt = gif.title;
                resultsContainer.appendChild(img);
            });
        }


        function setupEventListeners(db, user) {
            const { uid } = user;
            const chatTabMain = document.getElementById('chat-tab-main'); const chatTabUsers = document.getElementById('chat-tab-users'); const chatBody = document.getElementById('chat-body'); const onlineUsers = document.getElementById('online-users');
            chatTabMain.addEventListener('click', () => { chatBody.style.display = 'flex'; onlineUsers.style.display = 'none'; chatTabMain.style.background='rgba(0, 230, 118, 0.1)'; chatTabMain.style.color='var(--chat-text-color)'; chatTabMain.style.borderBottomColor='var(--chat-accent-color)'; chatTabUsers.style.background='transparent'; chatTabUsers.style.color='var(--chat-text-color-muted)'; chatTabUsers.style.borderBottomColor='transparent'; });
            chatTabUsers.addEventListener('click', () => { chatBody.style.display = 'none'; onlineUsers.style.display = 'flex'; chatTabUsers.style.background='rgba(0, 230, 118, 0.1)'; chatTabUsers.style.color='var(--chat-text-color)'; chatTabUsers.style.borderBottomColor='var(--chat-accent-color)'; chatTabMain.style.background='transparent'; chatTabMain.style.color='var(--chat-text-color-muted)'; chatTabMain.style.borderBottomColor='transparent'; });
            document.getElementById('chat-input').addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.stopPropagation();
                    const text = e.target.value.trim();
                    if(containsProfanity(text)) { alert("Your message contains blocked words."); return; }
                    if (text) { const name = localStorage.getItem("slitherChatNickname"); const color = localStorage.getItem("slitherChatNameColor") || "#FFD700"; db.ref("slitherChat").push({ uid, name, text, time: firebase.database.ServerValue.TIMESTAMP, chatNameColor: color }); db.ref("discordBridge").push({ uid, name, text, time: firebase.database.ServerValue.TIMESTAMP }); e.target.value = ''; }
                }
            });
            const settingsOverlay = document.getElementById('settings-modal-overlay');
            document.getElementById('chat-settings-btn').addEventListener('click', () => { document.getElementById('settings-nickname').value = localStorage.getItem("slitherChatNickname") || ''; document.getElementById('settings-name-color').value = localStorage.getItem("slitherChatNameColor") || '#FFD700'; document.getElementById('settings-avatar').value = localStorage.getItem("slitherChatAvatar") || ''; document.getElementById('settings-motto').value = localStorage.getItem("slitherChatMotto") || ''; settingsOverlay.style.display = 'flex'; });
            document.getElementById('settings-cancel-btn').addEventListener('click', () => settingsOverlay.style.display = 'none');
            document.getElementById('settings-save-btn').addEventListener('click', () => {
                const nickname = document.getElementById('settings-nickname').value.trim().slice(0, 20) || 'Anon';
                const motto = document.getElementById('settings-motto').value.trim();
                if(containsProfanity(nickname) || containsProfanity(motto)) { alert("Your nickname or motto contains blocked words."); return; }
                const newData = { name: nickname, chatNameColor: document.getElementById('settings-name-color').value, profileAvatar: document.getElementById('settings-avatar').value.trim(), profileMotto: motto };
                localStorage.setItem("slitherChatNickname", newData.name); localStorage.setItem("slitherChatNameColor", newData.chatNameColor); localStorage.setItem("slitherChatAvatar", newData.profileAvatar); localStorage.setItem("slitherChatMotto", newData.profileMotto); db.ref("onlineUsers/" + uid).update(newData); settingsOverlay.style.display = 'none';
            });
            document.getElementById('chat-hide-btn').addEventListener('click', () => document.getElementById('chat-container').style.display = 'none');
            document.body.addEventListener('click', e => { if (e.target.closest('.chat-username')) showUserProfile(db, e.target.closest('.chat-username').dataset.uid, user); });

            // --- CORRECTED GIF Event Listeners ---
            const gifOverlay = document.getElementById('gif-modal-overlay');
            document.getElementById('gif-btn').addEventListener('click', () => { openGifPicker(); });
            gifOverlay.addEventListener('click', (e) => { if (e.target.id === 'gif-modal-overlay') gifOverlay.style.display = 'none'; });
            document.getElementById('gif-search-input').addEventListener('keydown', e => {
                if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); searchGifs(); }
            });
            document.getElementById('gif-results').addEventListener('click', e => {
                if (e.target.tagName === 'IMG') {
                    const gifUrl = e.target.dataset.originalurl;
                    const name = localStorage.getItem("slitherChatNickname");
                    const color = localStorage.getItem("slitherChatNameColor") || "#FFD700";
                    db.ref("slitherChat").push({ uid, name, text: gifUrl, time: firebase.database.ServerValue.TIMESTAMP, chatNameColor: color });
                    db.ref("discordBridge").push({ uid, name, text: gifUrl, time: firebase.database.ServerValue.TIMESTAMP });
                    gifOverlay.style.display = 'none';
                }
            });
        }

        // --- UTILITY ---
        function makeDraggable(el, handle) { let p1=0, p2=0, p3=0, p4=0; handle.onmousedown = (e) => { e.preventDefault(); p3 = e.clientX; p4 = e.clientY; document.onmouseup = () => {document.onmouseup=null; document.onmousemove=null;}; document.onmousemove = (e) => { e.preventDefault(); p1=p3-e.clientX; p2=p4-e.clientY; p3=e.clientX; p4=e.clientY; el.style.top=(el.offsetTop-p2)+"px"; el.style.left=(el.offsetLeft-p1)+"px"; }; }; }

        // --- RUN ---
        loadFirebaseAndInit();
    }
})();