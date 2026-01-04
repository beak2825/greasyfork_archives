// ==UserScript==
// @name         OG Kick Advanced Tools - Chat Spammer + Rate Limit Bypass
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Advanced chat spammer for Kick.com
// @author       Robert
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @match        https://kick.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536300/OG%20Kick%20Advanced%20Tools%20-%20Chat%20Spammer%20%2B%20Rate%20Limit%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/536300/OG%20Kick%20Advanced%20Tools%20-%20Chat%20Spammer%20%2B%20Rate%20Limit%20Bypass.meta.js
// ==/UserScript==
 
(function() {
'use strict';
 
const SCRIPT_VERSION = '2.0';
const STORED_VERSION_KEY = 'kickToolsVersion';
const originalFetch = window.fetch;
let initialTokenLogged = false;
 
window.fetch = async function(...args) {
let [resource, config] = args;
let url = '';
let requestHeaders = {};
 
if (typeof resource === 'string') { url = resource; }
else if (resource instanceof Request) { url = resource.url; }
 
if (url.includes('/api/v2/channels/') && url.includes('/chatroom')) {
    const response = await originalFetch.apply(this, args);
    const clonedResponse = response.clone();
    try {
        const data = await clonedResponse.json();
        const newId = data.id;
        if (newId && newId !== chatroomId) {
            chatroomId = newId;
            const chatIdDisplay = document.getElementById('chatIdDisplay');
            if (chatIdDisplay) {
                chatIdDisplay.textContent = chatroomId;
            }
        }
    } catch (e) {
        console.error(`[Kick Tools] Failed to parse chatroom response: ${e.message}`);
    }
    return response;
}
 
if (config && config.headers) {
    if (config.headers instanceof Headers) { config.headers.forEach((v, k) => { requestHeaders[k.toLowerCase()] = v; }); }
    else { for (const k in config.headers) { requestHeaders[k.toLowerCase()] = config.headers[k]; } }
} else if (resource instanceof Request && resource.headers) {
     resource.headers.forEach((v, k) => { requestHeaders[k.toLowerCase()] = v; });
}
 
const authHeaderValue = requestHeaders['authorization'];
if (authHeaderValue && typeof authHeaderValue === 'string' && authHeaderValue.startsWith('Bearer ')) {
    const token = authHeaderValue.substring(7);
    if (token) {
        const currentStoredToken = localStorage.getItem('bearerToken');
        if (token !== currentStoredToken) {
            localStorage.setItem('bearerToken', token);
            if (typeof window.bearerTokenGlobal !== 'undefined') window.bearerTokenGlobal = token;
            if (!initialTokenLogged) {
                console.log('[Kick Tools] Bearer token detected/updated and stored.');
                initialTokenLogged = true;
            }
        }
    }
}
return originalFetch.apply(this, args);
 
 
};
 
window.bearerTokenGlobal = localStorage.getItem('bearerToken') || null;
let chatroomId = null;
let spamStatus = 'unknown';
let notificationShown = false;
const randomEmotes = [
'[emote:39286:YOUTried]', '[emote:37239:WeSmart]', '[emote:37240:WeirdChamp]', '[emote:39284:vibePlz]',
'[emote:37237:TriKool]', '[emote:39283:ToXiC]', '[emote:37236:ThisIsFine]', '[emote:37235:SUSSY]',
'[emote:28633:SenpaiWhoo]', '[emote:39282:saltyTrain]', '[emote:37248:ratJAM]', '[emote:37234:Prayge]',
'[emote:39279:PPJedi]', '[emote:39277:politeCat]', '[emote:37230:POLICE]', '[emote:37233:PogU]',
'[emote:39275:peepoShyy]', '[emote:37246:peepoRiot]', '[emote:37245:peepoDJ]', '[emote:37232:PeepoClap]',
'[emote:37231:PatrickBoo]', '[emote:28632:OuttaPocke]', '[emote:37229:OOOO]', '[emote:28631:NugTime]',
'[emote:37228:NODDERS]', '[emote:39273:MuteD]', '[emote:37244:modCheck]', '[emote:43404:mericKat]',
'[emote:37227:LULW]', '[emote:39272:LetMeIn]', '[emote:39261:kkHuh]', '[emote:55886:kickSadge]',
'[emote:37226:KEKW]', '[emote:37225:KEKLEO]', '[emote:39269:KEKByebye]', '[emote:39256:KatKiss]',
'[emote:305040:KappA]', '[emote:39268:HYPERCLAPH]', '[emote:39267:HaHaaHaHaa]', '[emote:37224:GIGACHAD]',
'[emote:37243:gachiGASM]', '[emote:39402:Flowie]', '[emote:37221:EZ]', '[emote:39265:EDMusiC]',
'[emote:39262:duckPlz]', '[emote:37220:DonoWall]', '[emote:39260:DanceDance]', '[emote:39258:coffinPls]',
'[emote:37218:Clap]', '[emote:37242:catblobDan]', '[emote:39254:CaptFail]', '[emote:37217:Bwop]',
'[emote:39251:beeBobble]', '[emote:39250:BBooomer]', '[emote:37215:AYAYA]'
];
 
function showKickNotification(text, duration = 5000) {
let container = document.getElementById('kick-toast-container');
if (!container) {
container = document.createElement('div');
container.id = 'kick-toast-container';
container.style.cssText = 'position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 10000; display: flex; flex-direction: column; align-items: center; gap: 10px; pointer-events: none;';
document.body.appendChild(container);
}
 
const toast = document.createElement('div');
toast.textContent = text;
toast.style.cssText = `
    background-color: #262626;
    color: #fff;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    font-family: 'Roobert', 'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    font-size: 14px;
    font-weight: 500;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s ease, transform 0.3s ease;
`;
 
container.appendChild(toast);
 
setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
}, 10);
 
setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.addEventListener('transitionend', () => {
        toast.remove();
        if (container.childElementCount === 0) {
            container.remove();
        }
    }, { once: true });
}, duration);
}
 
function createUI() {
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', buildActualUI);
} else {
buildActualUI();
}
}
 
function buildActualUI() {
if (document.getElementById('kick-tools-ui')) return;
window.bearerTokenGlobal = localStorage.getItem('bearerToken') || null;
 
const ui = document.createElement('div');
ui.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(30, 30, 30, 0.75);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.125);
    padding: 0;
    border-radius: 12px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    z-index: 9999;
    color: #ffffff;
    font-family: 'Segoe UI', Arial, sans-serif;
    width: 450px;
    height: 450px;
    display: flex;
    overflow: hidden;
    opacity: 0;
    transform: scale(0.95) translateY(10px);
    transition: opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;
ui.setAttribute('id', 'kick-tools-ui');
const currentTokenForUI = window.bearerTokenGlobal || '';
ui.innerHTML = `
    <div style="width: 120px; background: rgba(20, 20, 20, 0.5); padding: 15px; border-right: 1px solid rgba(255, 255, 255, 0.1); display: flex; flex-direction: column;">
        <img src="https://kick.com/img/kick-logo.svg" style="width: 80px; margin-bottom: 20px; align-self: center;" alt="Kick Logo">
        <div id="tab-buttons" style="display: flex; flex-direction: column; gap: 10px; flex-grow: 1;">
            <button data-tab="chat" style="padding: 10px; background: transparent; color: #eee; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; cursor: pointer; text-align: left; transition: background 0.3s, color 0.3s;">Chat Spammer</button>
            <button data-tab="settings" style="padding: 10px; background: transparent; color: #eee; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; cursor: pointer; text-align: left; transition: background 0.3s, color 0.3s;">Settings</button>
        </div>
        <div id="ui-watermark" style="font-size: 10px; color: #777; text-align: center; margin-top: auto; padding-bottom: 5px;">
            Created by Robert<br>
            <a href="https://t.me/kickbot_pro" target="_blank" style="color: #5a8cd7; text-decoration: none;">t.me/kickbot_pro</a>
        </div>
    </div>
    <div style="flex: 1; padding: 20px; overflow-y: auto; position: relative;">
        <button id="minimizeButton" style="position: absolute; top: 5px; right: 5px; width: 24px; height: 24px; background: transparent; color: #aaa; border: none; border-radius: 50%; cursor: pointer; font-size: 18px; line-height: 24px; text-align: center; font-weight: bold; transition: background 0.2s;">-</button>
        <div id="chat-tab" class="tab-content" style="display: none; opacity: 0; transform: translateY(10px); transition: opacity 0.3s ease, transform 0.3s ease;">
            <div style="font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #00ff00; text-shadow: 0 0 8px rgba(0, 255, 0, 0.5);">Chat Spammer</div>
            <div style="margin-bottom: 15px; display: flex; gap: 10px;">
                <input type="text" id="messageInput" placeholder="Enter your message" style="flex: 1; padding: 10px 14px; background: rgba(0, 0, 0, 0.3); color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; outline: none;">
                <input type="number" id="countInput" value="1" min="1" style="width: 60px; padding: 10px; background: rgba(0, 0, 0, 0.3); color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; outline: none;">
            </div>
            <div style="margin-bottom: 15px; display: flex; gap: 5px; flex-wrap: wrap;">
                <button id="kekwButton" title="KEKW" style="padding: 8px; background: rgba(255, 255, 255, 0.1); border: 1px solid transparent; border-radius: 8px; cursor: pointer;"><img src="https://files.kick.com/emotes/37226/fullsize" style="width: 20px; vertical-align: middle;"></button>
                <button id="patrickBooButton" title="PatrickBoo" style="padding: 8px; background: rgba(255, 255, 255, 0.1); border: 1px solid transparent; border-radius: 8px; cursor: pointer;"><img src="https://files.kick.com/emotes/37231/fullsize" style="width: 20px; vertical-align: middle;"></button>
                <button id="thisIsFineButton" title="ThisIsFine" style="padding: 8px; background: rgba(255, 255, 255, 0.1); border: 1px solid transparent; border-radius: 8px; cursor: pointer;"><img src="https://files.kick.com/emotes/37236/fullsize" style="width: 20px; vertical-align: middle;"></button>
                <button id="modCheckButton" title="modCheck" style="padding: 8px; background: rgba(255, 255, 255, 0.1); border: 1px solid transparent; border-radius: 8px; cursor: pointer;"><img src="https://files.kick.com/emotes/37244/fullsize" style="width: 20px; vertical-align: middle;"></button>
                <button id="muteDButton" title="MuteD" style="padding: 8px; background: rgba(255, 255, 255, 0.1); border: 1px solid transparent; border-radius: 8px; cursor: pointer;"><img src="https://files.kick.com/emotes/39273/fullsize" style="width: 20px; vertical-align: middle;"></button>
                <button id="weSmartButton" title="WeSmart" style="padding: 8px; background: rgba(255, 255, 255, 0.1); border: 1px solid transparent; border-radius: 8px; cursor: pointer;"><img src="https://files.kick.com/emotes/37239/fullsize" style="width: 20px; vertical-align: middle;"></button>
            </div>
            <div style="margin-bottom: 15px; display: flex; gap: 10px;">
                <button id="spamButton" style="flex: 1; padding: 10px; background: #00ff00; color: #000; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; transition: filter 0.2s;">SPAM</button>
                <button id="saveButton" style="flex: 1; padding: 10px; background: rgba(255, 255, 255, 0.1); color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; cursor: pointer; font-weight: 600;">Save</button>
            </div>
            <div style="margin-bottom: 15px;">
                <select id="savedMessages" style="width: 100%; padding: 10px 14px; background: rgba(0, 0, 0, 0.3); color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; outline: none;">
                    <option value="">Select Saved Message</option>
                </select>
            </div>
            <div style="margin-bottom: 15px; display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                <label style="font-size: 14px;">Delay (ms): <input type="number" id="delayInput" value="0" min="0" style="width: 60px; padding: 8px; background: rgba(0, 0, 0, 0.3); color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; outline: none;"></label>
                <label style="font-size: 14px;">Random Emote: <input type="checkbox" id="randomEmoteCheckbox" style="width: 16px; height: 16px; vertical-align: middle;"></label>
                <label style="font-size: 14px;">Bypass Emote Only: <input type="checkbox" id="bypassEmoteOnlyCheckbox" style="width: 16px; height: 16px; vertical-align: middle;"></label>
                <span id="spamStatus" style="margin-left: auto; font-size: 12px;"></span>
            </div>
            <div style="margin-top: 20px;">
                <span style="font-size: 12px;">Chatroom ID: <span id="chatIdDisplay">${chatroomId || 'N/A'}</span></span>
            </div>
            <div id="progress-bar-container" style="width: 100%; height: 8px; background-color: rgba(0, 0, 0, 0.3); border-radius: 4px; overflow: hidden; margin-top: 10px; border: 1px solid rgba(255, 255, 255, 0.2);">
                <div id="progress-bar-fill" style="width: 0%; height: 100%; background-color: #00ff00; transition: width 0.3s ease-in-out;"></div>
            </div>
        </div>
        <div id="settings-tab" class="tab-content" style="display: none; opacity: 0; transform: translateY(10px); transition: opacity 0.3s ease, transform 0.3s ease;">
            <div style="font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #00ff00; text-shadow: 0 0 8px rgba(0, 255, 0, 0.5);">Settings</div>
            <div style="margin-bottom: 15px;">
                <input type="text" id="tokenInput" placeholder="Enter Bearer Token (or leave for auto-detect)" value="${currentTokenForUI}" style="width: 100%; padding: 10px 14px; background: rgba(0, 0, 0, 0.3); color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; outline: none;">
            </div>
            <button id="setTokenButton" style="width: 100%; padding: 10px; background: rgba(255, 255, 255, 0.1); color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; cursor: pointer; font-weight: 600;">Set/Update Token</button>
            <p style="font-size: 12px; color: #aaa; margin-top: 10px;">Token should be auto-detected. Use 'Set Token' to manually override or if detection fails.</p>
        </div>
    </div>
`;
document.body.appendChild(ui);
 
setTimeout(() => {
    ui.style.opacity = '1';
    ui.style.transform = 'scale(1) translateY(0)';
}, 50);
 
addDragFunctionality(ui);
setupEventListeners();
populateSavedMessages();
updateSpamStatus();
setInterval(updateSpamStatus, 1500);
 
if (!notificationShown) {
    showKickNotification('KickTools v2.0 Loaded');
    notificationShown = true;
}
 
checkForUpdate();
}
 
function createMinimizedIcon() {
if (document.getElementById('minimized-icon')) return;
const icon = document.createElement('div');
icon.style.cssText = 'position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(30, 30, 30, 0.75); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.125); padding: 10px; border-radius: 50%; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4); z-index: 9999; cursor: pointer; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;';
icon.setAttribute('id', 'minimized-icon');
icon.innerHTML = '<img src="https://kick.com/img/kick-logo.svg" style="width: 30px;" title="Click to restore Kick Tools">';
document.body.appendChild(icon);
icon.addEventListener('click', () => {
const ui = document.getElementById('kick-tools-ui');
if (ui) ui.style.display = 'flex';
icon.remove();
});
}
 
function addDragFunctionality(element) {
let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
 
element.onmousedown = dragMouseDown;
 
function dragMouseDown(e) {
    if (e.target.closest('button, input, select, a')) {
        return;
    }
 
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
}
 
function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
}
 
function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
}
}
 
function updateSpamStatus() {
    spamStatus = 'able';
    const statusElement = document.getElementById('spamStatus');
    if (statusElement) {
        statusElement.textContent = 'Chat Available';
        statusElement.style.color = '#00ff00';
    }
}
 
function populateSavedMessages() {
const savedMessages = JSON.parse(localStorage.getItem('savedMessagesKickTools')) || [];
const select = document.getElementById('savedMessages');
if (!select) return;
select.innerHTML = '<option value="">Select Saved Message</option>';
savedMessages.forEach((msg, index) => {
const option = document.createElement('option');
option.value = index;
option.text = msg.substring(0, 30) + (msg.length > 30 ? '...' : '');
select.appendChild(option);
});
}
 
async function sendMessages(message, count, delay, randomEmote, bypassEmoteOnly) {
    window.bearerTokenGlobal = localStorage.getItem('bearerToken') || null;
    if (!window.bearerTokenGlobal) {
        alert('Bearer Token is missing! Ensure you are logged in and the page has fully loaded, or set the token manually in settings.');
        return;
    }
 
    if (!chatroomId) {
        alert('Chatroom ID is missing! Please ensure you are on a streamer page.');
        return;
    }
 
    const progressBarFill = document.getElementById('progress-bar-fill');
    if (progressBarFill) progressBarFill.style.width = '0%';
    let completedCount = 0;
 
    const url = `https://kick.com/api/v2/messages/send/${chatroomId}`;
    const headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": `Bearer ${window.bearerTokenGlobal}`,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.4472.124 Safari/537.36"
    };
 
    const updateProgress = () => {
        completedCount++;
        const percentage = (completedCount / count) * 100;
        if (progressBarFill) {
            progressBarFill.style.width = `${percentage}%`;
        }
    };
 
    if (delay === 0) {
        // Concurrent mode
        const promises = [];
        for (let i = 0; i < count; i++) {
            let currentMessage;
            if (randomEmote) {
                currentMessage = randomEmotes[Math.floor(Math.random() * randomEmotes.length)];
            } else if (bypassEmoteOnly && message) {
                currentMessage = `[emote:37230:POLICE] ${message} [emote:37230:POLICE]`;
            } else {
                currentMessage = message || "Robert was here!";
            }
            const data = { "content": currentMessage, "type": "message", "message_ref": String(Date.now()) };
 
            const promise = originalFetch(url, { method: 'POST', headers: headers, body: JSON.stringify(data) })
                .then(response => {
                    if (!response.ok && (response.status === 401 || response.status === 403)) {
                        localStorage.removeItem('bearerToken');
                        window.bearerTokenGlobal = null;
                        initialTokenLogged = false;
                    }
                })
                .finally(updateProgress);
 
            promises.push(promise);
        }
        await Promise.allSettled(promises);
 
    } else {
        // Sequential mode
        let lastSendInitiationTime = 0;
        for (let i = 0; i < count; i++) {
            let currentMessage;
            if (randomEmote) {
                currentMessage = randomEmotes[Math.floor(Math.random() * randomEmotes.length)];
            } else if (bypassEmoteOnly && message) {
                currentMessage = `[emote:37230:POLICE] ${message} [emote:37230:POLICE]`;
            } else {
                currentMessage = message || "Robert was here!";
            }
            const data = { "content": currentMessage, "type": "message", "message_ref": String(Date.now()) };
 
            if (i > 0) {
                const currentTime = Date.now();
                const timeSinceLastStart = currentTime - lastSendInitiationTime;
                const waitDuration = delay - timeSinceLastStart;
                if (waitDuration > 0) {
                    await new Promise(resolve => setTimeout(resolve, waitDuration));
                }
            }
 
            lastSendInitiationTime = Date.now();
            let shouldBreak = false;
            try {
                const response = await originalFetch(url, { method: 'POST', headers: headers, body: JSON.stringify(data) });
                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('bearerToken');
                        window.bearerTokenGlobal = null;
                        initialTokenLogged = false;
                    } else if (response.status === 429) {
                        shouldBreak = true;
                    }
                }
            } catch (error) {
                console.error("[Kick Tools] Sequential send network error:", error);
                shouldBreak = true;
            }
 
            updateProgress();
 
            if (shouldBreak) {
                break;
            }
        }
    }
}
 
 
function showUpdatePopup() {
localStorage.setItem(STORED_VERSION_KEY, SCRIPT_VERSION);
const backdrop = document.createElement('div');
backdrop.id = 'update-backdrop';
backdrop.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); z-index: 10001; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;';
 
const popup = document.createElement('div');
popup.style.cssText = `
    background: rgba(40, 40, 40, 0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    padding: 25px; border-radius: 12px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    border: 1px solid rgba(255, 255, 255, 0.15);
    width: 90%; max-width: 480px; color: #fff;
    font-family: 'Segoe UI', Arial, sans-serif;
    transform: scale(0.9); opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
`;
popup.innerHTML = `
    <h2 style="text-align: center; color: #00ff00; margin-top: 0; margin-bottom: 10px; font-size: 24px; text-shadow: 0 0 8px rgba(0, 255, 0, 0.5);">Installed Successfully!</h2>
    <p style="text-align: center; margin-top: 0; margin-bottom: 20px; font-size: 16px; color: #ccc;">Welcome to KickTools v${SCRIPT_VERSION}</p>
    <h3 style="color: #eee; border-bottom: 1px solid #444; padding-bottom: 5px; margin-bottom: 10px;">Features:</h3>
    <ul style="list-style-type: '✓ '; margin-left: 20px; padding-left: 10px; color: #ddd; font-size: 14px; line-height: 1.6;">
        <li>Advanced Chat Spammer.</li>
        <li>Rate-Limit Bypass.</li>
        <li>Modern glassmorphism UI.</li>
        <li>Auto Token & Chatroom ID detection.</li>
        <li>Saved messages, quick-add emotes, and a built-in logger.</li>
    </ul>
    <p style="text-align: center; margin-top: 25px; font-size: 14px;">For support and updates, join the Telegram: <a href="https://t.me/kickbot_pro" target="_blank" style="color: #5a8cd7; text-decoration: none; font-weight: bold;">@kickbot_pro</a></p>
    <button id="close-update-popup" style="width: 100%; padding: 12px; margin-top: 20px; background: #00ff00; color: #000; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 16px;">Got it!</button>
`;
 
backdrop.appendChild(popup);
document.body.appendChild(backdrop);
 
setTimeout(() => {
    backdrop.style.opacity = '1';
    popup.style.opacity = '1';
    popup.style.transform = 'scale(1)';
}, 10);
 
document.getElementById('close-update-popup').addEventListener('click', () => {
    backdrop.style.opacity = '0';
    popup.style.transform = 'scale(0.9)';
    backdrop.addEventListener('transitionend', () => backdrop.remove(), { once: true });
});
}
 
function checkForUpdate() {
const storedVersion = localStorage.getItem(STORED_VERSION_KEY);
if (storedVersion !== SCRIPT_VERSION) {
showUpdatePopup();
}
}
 
function setupEventListeners() {
const spamButton = document.getElementById('spamButton');
const messageInput = document.getElementById('messageInput');
const countInput = document.getElementById('countInput');
const tokenInput = document.getElementById('tokenInput');
const setTokenButton = document.getElementById('setTokenButton');
const saveButton = document.getElementById('saveButton');
const savedMessagesSelect = document.getElementById('savedMessages');
const delayInput = document.getElementById('delayInput');
const randomEmoteCheckbox = document.getElementById('randomEmoteCheckbox');
const bypassEmoteOnlyCheckbox = document.getElementById('bypassEmoteOnlyCheckbox');
const emoteButtons = {
kekwButton: '[emote:37226:KEKW]', patrickBooButton: '[emote:37231:PatrickBoo]',
thisIsFineButton: '[emote:37236:ThisIsFine]', modCheckButton: '[emote:37244:modCheck]',
muteDButton: '[emote:39273:MuteD]', weSmartButton: '[emote:37239:WeSmart]'
};
const minimizeButton = document.getElementById('minimizeButton');
const tabButtons = document.querySelectorAll('#tab-buttons button');
 
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.style.display = 'none';
            tab.style.opacity = '0';
            tab.style.transform = 'translateY(10px)';
        });
        const tabContent = document.getElementById(`${button.dataset.tab}-tab`);
        if (tabContent) {
            tabContent.style.display = 'block';
            setTimeout(() => {
                tabContent.style.opacity = '1';
                tabContent.style.transform = 'translateY(0)';
            }, 10);
        }
        tabButtons.forEach(btn => {
            btn.style.background = 'transparent';
            btn.style.color = '#eee';
        });
        button.style.background = 'rgba(0, 255, 0, 0.2)';
        button.style.color = '#fff';
        if (button.dataset.tab === 'settings') {
            const tokenField = document.getElementById('tokenInput');
            if (tokenField) tokenField.value = localStorage.getItem('bearerToken') || '';
        }
    });
});
 
if (tabButtons.length > 0) {
    const firstTab = document.getElementById('chat-tab');
    firstTab.style.display = 'block';
    firstTab.style.opacity = '1';
    firstTab.style.transform = 'translateY(0)';
    tabButtons[0].style.background = 'rgba(0, 255, 0, 0.2)';
    tabButtons[0].style.color = '#fff';
}
 
spamButton?.addEventListener('click', () => {
    sendMessages(messageInput.value, parseInt(countInput.value) || 1, parseInt(delayInput.value) || 0, randomEmoteCheckbox.checked, bypassEmoteOnlyCheckbox.checked);
});
setTokenButton?.addEventListener('click', () => {
    const manualToken = tokenInput.value.trim();
    if (manualToken) {
        window.bearerTokenGlobal = manualToken; localStorage.setItem('bearerToken', manualToken);
    } else {
        localStorage.removeItem('bearerToken'); window.bearerTokenGlobal = null;
    }
});
saveButton?.addEventListener('click', () => {
    const msg = messageInput.value.trim(); if (!msg) return;
    let saved = JSON.parse(localStorage.getItem('savedMessagesKickTools')) || [];
    if (!saved.includes(msg)) {
        saved.push(msg); localStorage.setItem('savedMessagesKickTools', JSON.stringify(saved));
        populateSavedMessages();
    }
});
savedMessagesSelect?.addEventListener('change', () => {
    const idx = savedMessagesSelect.value; if (idx === '') return;
    const saved = JSON.parse(localStorage.getItem('savedMessagesKickTools')) || [];
    messageInput.value = saved[idx];
});
Object.keys(emoteButtons).forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
        messageInput.value += ` ${emoteButtons[id]}`; messageInput.focus();
    });
});
minimizeButton?.addEventListener('click', () => {
    const ui = document.getElementById('kick-tools-ui');
    if (ui) ui.style.display = 'none';
    createMinimizedIcon();
});
}
 
createUI();
 
})();