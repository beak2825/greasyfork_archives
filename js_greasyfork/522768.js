// ==UserScript==
// @name         Hunter Stumblechat Script
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  Automatic Moderation
// @author       m_n
// @match        https://stumblechat.com/room/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stumblechat.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522768/Hunter%20Stumblechat%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/522768/Hunter%20Stumblechat%20Script.meta.js
// ==/UserScript==
let webSocket;
(function() {
    'use strict';
    let selfHandleSet = false; 
    let selfHandle; 
    const handleUserMap = {}; 
    const yourHandle = "myHandle"; 
    function parseWebSocketMessage(message) {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.stumble === "join") {
            const { handle, username } = parsedMessage;
            if (!selfHandleSet) {
                selfHandle = handle;
                handleUserMap[handle] = "self"; 
                selfHandleSet = true;
            } else {
                handleUserMap[handle] = username;
            }
            const joinMessage = `${username} joined the chat.`;
            displayWebSocketMessage(joinMessage);
        } else if (parsedMessage.stumble === "quit") {
            const handle = parsedMessage.handle;
            const username = handleUserMap[handle];
            if (username) {
                delete handleUserMap[handle];
                const quitMessage = `${username} left the chat.`;
                displayWebSocketMessage(quitMessage);
            }
        } else if (parsedMessage.stumble === "msg") {
        }
    }
let webSocketURL; 
function setupWebSocketListener() {
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        webSocket = new originalWebSocket(url, protocols); 
        console.log('WebSocket URL:', webSocketURL);
        const ws = new originalWebSocket(url, protocols);
        webSocket.addEventListener('message', event => {
            handleWebSocketMessage(event.data);
        });
        return webSocket;
    };
}
function isUserBanned(username) {
    const storedAllowList = localStorage.getItem("bans");
    const allowList = storedAllowList ? JSON.parse(storedAllowList) : [];
    console.log("Allow List:", allowList);
    const usernameLower = username.toLowerCase();
    const isAllowed = allowList.some(user => user.toLowerCase() === usernameLower);
    console.log(`Checking allow status for user ${username}. Allowed: ${isAllowed}`);
    if (!isAllowed) {
        const handle = Object.keys(handleUserMap).find(key => handleUserMap[key] === username);
        if (handle) {
            webSocket.send(JSON.stringify({
                "stumble": "ban",
                "handle": handle
            }));
        } else {
            console.error('Username not found');
        }
    }
    return isAllowed;
}
const originalWebSocket = window.WebSocket;
window.WebSocket = function(url, protocols) {
    const ws = new originalWebSocket(url, protocols);
    ws.addEventListener('message', event => {
        const parsedMessage = JSON.parse(event.data);
        if (parsedMessage.stumble === "joined") {
            const selfHandle = parsedMessage.self.handle;
            const userList = parsedMessage.userlist;
            if (userList && userList.length > 0) {
                userList.forEach(user => {
                    const isSelf = user.handle === selfHandle;
                    if (isSelf) {
                        handleUserMap[user.handle] = user.username || user.nick;
                        console.log('Detected self for white dot. Applying!')
                    } else {
                        updateUserListAndMapOnJoin(user);
                    }
                });
            }
        } else if (parsedMessage.stumble === "join") {
            const { handle, username } = parsedMessage;
            if (handle !== yourHandle) {
                handleUserMap[handle] = username;
                console.log(`Detected join: Handle - ${handle}, Username - ${username}`);
                isUserBanned(username);
            }
        } else if (parsedMessage.stumble === "quit") {
            const handle = parsedMessage.handle;
            const username = handleUserMap[handle];
            if (username) {
                delete handleUserMap[handle];
                console.log('User departed');
            }
        } else if (parsedMessage.stumble === "msg") {
            const { handle, text } = parsedMessage;
            const username = handleUserMap[handle] || handle;
            displayWebSocketMessage(event.data);
        }
        if (parsedMessage.stumble === "system") {
            const systemMessage = parsedMessage.message;
            if (systemMessage.startsWith('"Client Version:')) {
                console.log("System message detected");
            }
        }
    });
    return ws;
};
    function createUserListDiv() {
        const userListDiv = document.createElement("div");
        userListDiv.id = "userList";
        userListDiv.style.position = "absolute"; 
        userListDiv.style.top = "100px"; 
        userListDiv.style.left = "10px"; 
        userListDiv.style.height = "calc(100% - 100px)"; 
        userListDiv.style.overflowY = "auto";
        userListDiv.style.color = "#ffffff";
        userListDiv.style.padding = "10px";
        userListDiv.style.zIndex = "2"; 
        userListDiv.style.display = "none"; 
        return userListDiv;
    }
function updateHandleUserMap(fileContent) {
    const lines = fileContent.split('\n');
    lines.forEach(line => {
        const userData = line.trim().split(' '); 
        if (userData.length === 2) {
            const username = userData[0].trim();
            const handle = userData[1].trim();
            if (!handleUserMap.hasOwnProperty(handle)) {
                handleUserMap[handle] = username;
            }
        }
    });
}
function updateUserListDisplay() {
    const userList = document.getElementById("userList");
    if (userList) {
        userList.innerHTML = ""; 
        for (const handle in handleUserMap) {
            const username = handleUserMap[handle];
            const listItem = document.createElement("li");
            listItem.textContent = `${username} (${handle})`;
            userList.appendChild(listItem);
        }
    }
}
function getOwnHandle() {
    return "123456"; 
 }
function handleWebSocketMessage(message) {
    const parsedMessage = JSON.parse(message);
    const ownHandle = getOwnHandle(); 
    if (parsedMessage.stumble === "msg" && ownHandle === parsedMessage.handle) {
        const text = parsedMessage.text;
        if (text.startsWith("#ban")) {
            const handleToBan = text.replace("#ban", "").trim();
            if (handleToBan !== "") {
                if (handleUserMap.hasOwnProperty(handleToBan)) {
                    handleUserMap[handleToBan] += " B";
                    updateUserListDisplay();
                } else {
                    alert("Handle not found!");
                }
            } else {
                alert("Invalid handle!");
            }
        }
    }
}
setupWebSocketListener();
updateUserListDisplay();
function displayWebSocketMessage(message) {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.stumble === "join") {
        const { handle, username } = parsedMessage;
        handleUserMap[handle] = username;
    } else if (parsedMessage.stumble === "msg") {
        const { handle, text } = parsedMessage;
        const username = handleUserMap[handle] || handle;
        const webSocketMessagesDiv = document.getElementById("webSocketMessages");
        if (webSocketMessagesDiv) {
            webSocketMessagesDiv.textContent += `${username}: ${text}\n`;
            webSocketMessagesDiv.scrollTop = webSocketMessagesDiv.scrollHeight;
        }
        if (text === "#join") {
            console.log("join");
        } else if (text === "#icon") {
            console.log("icon");
        } else if (text === "#tokes") {
            console.log("tokes");
            TokesSendEnter();
        } else if (text.startsWith("#ai ")) {
            console.log("ai");
            const word = text.substring(4);
            console.log("Word after '#ai':", word);
        }
    } else if (parsedMessage.stumble === "joined") {
        const userList = parsedMessage.userlist;
        if (userList && userList.length > 0) {
            userList.forEach(user => {
                const username = user.username || user.nick;
                handleUserMap[user.handle] = username;
            });
        }
    } else if (parsedMessage.stumble === "quit") {
        const handle = parsedMessage.handle;
        const username = handleUserMap[handle];
        if (username) {
            delete handleUserMap[handle];
            console.log('line 323 user departed')
        }
    }
}
function createWebSocketMessagesDiv() {
    const div = document.createElement("div");
    div.id = "webSocketMessages";
    div.style.position = "relative";
    div.style.height = "25%";
    div.style.paddingLeft = "2px";
    div.style.visibility = "visible"; 
    div.style.willChange = "transform";
    div.style.boxSizing = "border-box";
    div.style.overflowX = "hidden";
    div.style.overflowY = "auto";
    div.style.color = "#ffffff"; 
    div.style.padding = "10px"; 
    div.style.zIndex = "2"; 
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.justifyContent = "flex-end";
    div.style.fontSize = "18px";
    div.style.whiteSpace = "pre-wrap"; 
    div.style.wordWrap = "break-word"; 
    const chatPositionDiv = document.getElementById("chat-position");
    if (chatPositionDiv) {
        chatPositionDiv.appendChild(div);
    } else {
        document.body.appendChild(div);
    }
}
createWebSocketMessagesDiv();
function toggleWebSocketMessagesDiv() {
    const webSocketMessagesDiv = document.getElementById("webSocketMessages");
    const chatContentDiv = document.getElementById("chat-content");
    if (webSocketMessagesDiv && chatContentDiv) {
        const webSocketMessagesDisplayStyle = webSocketMessagesDiv.style.display;
        if (webSocketMessagesDisplayStyle === "none") {
            webSocketMessagesDiv.style.display = "block";
            chatContentDiv.style.display = "none";
        } else {
            webSocketMessagesDiv.style.display = "none";
            chatContentDiv.style.display = "block";
        }
    }
}
toggleWebSocketMessagesDiv()
const toggleMessagesButton = document.createElement("button");
toggleMessagesButton.textContent = "M";
toggleMessagesButton.style.position = "fixed";
toggleMessagesButton.style.right = "0px";
toggleMessagesButton.style.bottom = "0px";
toggleMessagesButton.addEventListener("click", toggleWebSocketMessagesDiv);
document.body.appendChild(toggleMessagesButton);
function applyFontSize(fontSize) {
    const webSocketMessagesDiv = document.getElementById("webSocketMessages");
    if (webSocketMessagesDiv) {
        webSocketMessagesDiv.style.fontSize = `${fontSize}px`;
    }
}
function TokesSendEnter() {
    const textArea = document.getElementById("textarea");
    textArea.value += 'Tokes in 20 seconds\n';
    const event = new KeyboardEvent('keypress', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true
    });
    textArea.dispatchEvent(event);
    setTimeout(function() {
        textArea.value += 'tokes started\n'; 
        textArea.dispatchEvent(event);
    }, 20000); 
}
function createInputBox() {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type your message...';
    input.style.position = 'fixed'; 
    input.style.bottom = '50px'; 
    input.style.left = '10px'; 
    input.style.zIndex = '9999'; 
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const msg = input.value.trim();
            if (msg.startsWith('/kick')) {
                const username = msg.substring(6).trim(); 
                const handle = Object.keys(handleUserMap).find(key => handleUserMap[key] === username);
                if (handle) {
                    webSocket.send(JSON.stringify({
                        "stumble": "kick",
                        "handle": handle
                    }));
                } else {
                    console.error('Username not found');
                }
                input.value = "";
            }
            else if (msg.startsWith('/ban')) {
                const username = msg.substring(5).trim(); 
                const handle = Object.keys(handleUserMap).find(key => handleUserMap[key] === username);
                if (handle) {
                    webSocket.send(JSON.stringify({
                        "stumble": "ban",
                        "handle": handle
                    }));
                } else {
                    console.error('Username not found');
                }
                input.value = "";
            }
            else {
                sendMessage();
            }
        }
    });
    return input;
}
const input = createInputBox();
document.body.appendChild(input);
function ban(username) {
    if (webSocket !== undefined) {
        webSocket.send(JSON.stringify({
            "stumble": "ban",
            "username": username
        }));
    } else {
        console.error('WebSocket connection not established');
    }
}
function sendMessage() {
    const msg = input.value.trim();
    if (webSocket !== undefined && msg !== "") { 
        webSocket.send(JSON.stringify({
            "stumble": "msg",
            "text": msg
        }));
        input.value = "";
    }
}
function createBanListDiv(banList) {
    const banListDiv = document.createElement("div");
    banListDiv.id = "banList";
    banListDiv.style.position = "absolute"; 
    banListDiv.style.top = "100px"; 
    banListDiv.style.left = "10px"; 
    banListDiv.style.height = "calc(100% - 100px)"; 
    banListDiv.style.overflowY = "auto";
    banListDiv.style.color = "#ffffff";
    banListDiv.style.padding = "10px";
    banListDiv.style.zIndex = "2"; 
    banListDiv.style.display = "none"; 
    const list = document.createElement("ul");
    banList.forEach(ban => {
        const listItem = document.createElement("li");
        listItem.textContent = ban;
        list.appendChild(listItem);
    });
    banListDiv.appendChild(list);
    const toggleButton = document.createElement("button");
    toggleButton.textContent = "B";
    toggleButton.style.position = "fixed";
    toggleButton.style.bottom = "0px";
    toggleButton.style.left = "0px";
    toggleButton.style.zIndex = "9999";
    toggleButton.addEventListener("click", toggleBanList);
    document.body.appendChild(toggleButton);
    const importButton = document.createElement("button");
    importButton.textContent = "L";
    importButton.addEventListener("click", () => {
        fileInput.click();
    });
    banListDiv.appendChild(importButton);
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".txt";
    fileInput.style.display = "none";
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const importedBans = e.target.result.split("\n");
            banList.splice(0, banList.length, ...importedBans);
            refreshBanList(banList);
        };
        reader.readAsText(file);
    });
    banListDiv.appendChild(fileInput);
    const saveButton = document.createElement("button");
    saveButton.textContent = "S";
    saveButton.addEventListener("click", () => {
        const text = banList.join("\n");
        saveBansToFile(text, "bans.txt");
    });
    banListDiv.appendChild(saveButton);
    return banListDiv;
}
function refreshBanList(banList) {
    const list = document.getElementById("banList").querySelector("ul");
    list.innerHTML = ""; 
    banList.forEach(ban => {
        const listItem = document.createElement("li");
        listItem.textContent = ban;
        list.appendChild(listItem);
    });
    localStorage.setItem("bans", banList.join("\n"));
}
function saveBansToFile(text, fileName) {
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
const storedBans = localStorage.getItem("bans");
const banList = storedBans ? storedBans.split("\n") : [];
const banListDiv = createBanListDiv(banList);
document.body.appendChild(banListDiv);
function toggleBanList() {
    const banListDiv = document.getElementById("banList");
    if (banListDiv.style.display === "none") {
        banListDiv.style.display = "block";
    } else {
        banListDiv.style.display = "none";
    }
}
document.body.appendChild(toggleButton);
})();