// ==UserScript==
// @name		Florr.io Chat with other Players
// @description Simple chat application. Press [Enter] to type and send a message in the squad panel, in game, and your teammates will receive your message even if you are out of their range or dead. Useful if you want to encourage them! When someone also have this extension, you will recognize them because of their blue name. You can also click or press [Ctrl] / [Cmd] + [Enter] to talk with other chat users in a dedicated panel where you may join their squad! This application doesn't add lag to the game.
// @author		Hirosoiko
// @version		1.7
// @match		*://florr.io/*
// @run-at      document-start
// @require     https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.5.1/socket.io.js
// @grant		unsafeWindow
// @grant       GM_info
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @namespace	none
// @downloadURL https://update.greasyfork.org/scripts/450526/Florrio%20Chat%20with%20other%20Players.user.js
// @updateURL https://update.greasyfork.org/scripts/450526/Florrio%20Chat%20with%20other%20Players.meta.js
// ==/UserScript==

let socket = io("https://florrio-chat.glitch.me", {
    transports: ["websocket"]
});

if (localStorage.florrio_nickname == "") {
    localStorage.florrio_nickname = "Chat User " + Math.floor(Math.random()*(999 - 100 + 1) + 100);
}

const latency = 100;
const updateInterval = 1000;
const maxNameLength = 13;
const namesColor = "#00ffff";
const msgRectColor = "#00000080";
const msgStrokeStyle = "#000000";
const msgFillStyle = "#ffffff";
const msgFadeMs = 125;
const msgDisplayMsByChar = 500;
const flowerMsgWidth = 300;
const menuMsgWidth = 129;
const delimiterChar = "-";
const inGameMsgOffset = 20;
const inGameMsgFontSize = 20;
const proxyId = 1234567890;
const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w\-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[-a-zA-Z0-9!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]*))?)/gi;
let usualFlowerScale;
let canvas;
let inMenu = true;
let alive = false;
let aliveTO;
let name = localStorage.florrio_nickname;
let trimmedText;
let currentPlayers = [];
let pCurrentPlayers = currentPlayers;
let notPlayers = [];
let chatPlayers = [];
let updated = {};
let wave = 0;
let squad = "";
let squadTO;
let messages = {};
let hideYou = false;
let hideReady = [];
let textInput;
let usersButton;
let usersPanel;
let chatContainer;
let messageNotifier;
let chatUsersClose;
let chatInput;
let nextScroll = false;
let sendChat;
let spamInterval;
let codeY = 0;
let firstConnection = false;

GM_addStyle(`
.florrPanel {
 overflow:auto;
 position: absolute;
 width: 350px;
 right: 89px;
 bottom: 14px;
 margin-bottom: 0px;
 opacity: 1;
 transition: transform 0.075s ease, opacity 0.075s ease;
 background-color: #5A9FDB;
 border-radius: 4px;
 border: 6px solid #4980B1;
 padding: 10px;
}

.florrPanel * {
 -webkit-user-select: none;
 -moz-user-select: none;
 -ms-user-select: none;
 user-select: none;
 font-family: 'Ubuntu';
 color: white;
 outline: none;
}

.hidden {
  opacity: 0;
  transform: translateY(110%);
}

.florrTitle {
 display: inline-block;
 position: relative;
 margin: 0px;
 font-size: 21.25px;
 text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
}

.florrText {
 font-size: 14px;
 text-shadow: -0.75px 0 black, 0 0.75px black, 0.75px 0 black, 0 -0.75px black;
}

.florrClose {
 display: inline-block;
 position: relative;
 left: 187px;
 top: -6px;
 padding: 9px;
 margin-left: 30px;
 border: 3.75px solid #974544;
 background-color: #BB5555;
 border-radius: 6px;
 vertical-align: middle;
 outline: none;
}
.florrClose:active {
 background-color: #A84C4C;
}
.florrClose:hover{
 background-color: #C16665;
 cursor: pointer;
}

.c1 {
pointer-events: none;
 display: inline-block;
 position: relative;
 top: 0px;
 left: 168.5px;
 height: 19px;
 width: 3.125px;
 border-radius: 4px;
 background-color: #CCCCCC;
 transform: rotate(45deg);
 Z-index: 1;
}

.c2 {
 pointer-events: none;
 display: inline-block;
 position: relative;
 height: 19px;
 width: 3.125px;
 border-radius: 4px;
 background-color: #CCCCCC;
 transform: rotate(90deg);
 Z-index: 2;
}

.florrCheckbox {
 padding: 9px;
 margin-left: 20px;
 border: 3.75px solid #333333;
 background-color: #666666;
 transition: background-color 0.075s linear;
 border-radius: 2px;
 vertical-align: middle;
 outline: none;
}

.florrCheckbox:hover {
 cursor: pointer;
}

.florrCheckboxTrue {
 background-color: #dddddd;
}

.florrButton {
 padding: 2.75px 19px;
 background-color: #5A9FDB;
 border-radius: 4px;
 border: 3.75px solid #4980B1;
 outline: none;
}

.florrButton:active {
 background-color: #528FC4;
}

.florrButton:hover {
 background-color: #6AA8DE;
 cursor: pointer;
}

.florrInput {
 padding: 3px 3px;
 background-color: white;
 border-radius: 2px;
 border: 2.5px solid black;
 color: black;
 outline: none;
}

.florrMenuButton {
 background: #5A9FDB url(https://i.postimg.cc/WzqwygNv/pngegg.png);
 background-size: 35px;
 background-repeat: no-repeat;
 background-position: center center;
 border-radius: 4px;
 border: 3.5px solid #4980B1;
 outline: none;
}

.florrMenuButton:active {
 background-color: #528FC4;
}

.florrMenuButton:hover {
 background-color: #6AA8DE;
 cursor: pointer;
}

.florrMenuButton .florrTooltip {
 opacity: 0;
 transition: opacity 0.125s linear;
 background-color: rgba(0, 0, 0, 0.5);
 text-align: center;
 font-family: 'Ubuntu';
 color: white;
 text-shadow: -0.75px 0 black, 0 0.75px black, 0.75px 0 black, 0 -0.75px black;
 border-radius: 4px;
 padding: 6.5px 0 4px 0;
 position: absolute;
 right: 60px;
 bottom: 10px;
 height: 20px;
 width: 83px;
 z-index: 1;
 pointer-events: none;
}

.florrMenuButton:hover .florrTooltip {
  opacity: 1;
}

.interline {
 pointer-events: none;
 position: relative;
 left: 5px;
 height: 6px;
 width: 355px;
 margin-left: -8px;
 border-width: 0px;
 border-radius: 4px;
 background-color: #4980B1;
}

.sInterline {
 pointer-events: none;
 position: relative;
 left: 5px;
 height: 3.75px;
 width: 340px;
 margin-left: -5px;
 border-width: 0px;
 border-radius: 4px;
 background-color: #4980B1;
}

.container {
 margin-left: 5px;
 margin-right: 5px;
 overflow-x:hidden;
 overflow-y:auto;
 word-wrap: break-word;
 max-height:${window.innerHeight*30/100}px;
 height:auto !important;
 scroll-behavior: smooth;
}

.translucent {
 opacity: 0.5;
 transition: transform 0.075s ease, opacity 0.125s ease;
}

.translucent:hover {
 opacity: 1;
}

.florrMsgNotif {
 opacity: 1;
 transition: opacity 0.125s linear;
 background-color: rgba(0, 0, 0, 0.5);
 text-align: center;
 color: white;
 text-shadow: -0.75px 0 black, 0 0.75px black, 0.75px 0 black, 0 -0.75px black;
 border-radius: 4px 4px 0 0;
 position: absolute;
 left: 15px;
 bottom: 57.5px;
 height: 25px;
 width: 340px;
 padding-top: 5px;
 outline: none;
 z-index: 1;
}

.florrMsgNotif:hover {
 cursor: pointer;
}

.invisible {
 opacity: 0;
}

.florrLink:link {
 color: #ffff00 !important;
}

.florrLink:hover {
 pointer: cursor;
 color: #ffff00 !important;
 text-decoration: underline;
}

.florrLink:visited {
 color: #ffff00 !important;
}

.florrLink:active {
 color: #ffff00 !important;
}

.unread {
 animation: unread 1s infinite linear;
}

@keyframes unread {
 0% {
  transform: rotate(0deg) scale(100%)
 }
 12.5% {
  transform: rotate(5deg) scale(102.5%)
 }
 25% {
  transform: rotate(0deg) scale(105%)
 }
 37.5% {
  transform: rotate(-5deg) scale(107.5%)
 }
 50% {
  transform: rotate(0deg) scale(110%)
 }
 62.5% {
  transform: rotate(5deg) scale(107.5%)
 }
 75% {
  transform: rotate(0deg) scale(105%)
 }
 87.5% {
  transform: rotate(-5deg) scale(102.5%)
 }
 100% {
  transform: rotate(0deg) scale(100%)
 }
}
`);

document.addEventListener("DOMContentLoaded", function() {
    canvas = document.getElementById("canvas");
    usersButton = document.createElement("button");
    document.body.appendChild(usersButton);
    usersButton.outerHTML = `
    <button class="florrMenuButton" id="chatUsersMenuButton" style="position:absolute;padding:24px;right:16px;bottom:16px">
      <span class="florrTooltip">Chat Users</span>
    </button>
    `;
    usersButton = document.getElementById("chatUsersMenuButton");
    usersPanel = document.createElement("div");
    usersPanel.classList.add("florrPanel");
    usersPanel.classList.add("hidden");
    if (GM_getValue("demo", true)) {
        usersPanel.classList.remove("hidden");
        GM_setValue("demo", false);
    }
    usersPanel.innerHTML = `
    <p class="florrTitle" style="left:120px;">Chat Users</p>
    <button class="florrClose" id="chatUsersClose"></button>
      <div class="c1">
        <div class="c2"></div>
      </div>
      <br>
      <br>
    <button id="allowJoin" class="florrCheckbox${GM_getValue("allowJoin", false) ? " florrCheckboxTrue" : ""}"></button>
    <label for="allowJoin" class="florrText" style="margin-left:5px;">Allow players to join your squad</label>
    <div id="playerSection" style="display: none;">
      <hr class="interline">
      <p class="florrTitle" style="left: 111px;">Join a Player</p>
      <br>
      <br>
      <div class="container" id="playerContainer">
      </div>
    </div>
    <hr class="interline">
    <p class="florrTitle" style="left:116px;">Global Chat</p>
      <br>
      <br>
    <div class="container" id="chatContainer">
    </div>
    <span id="messageNotifier" class="florrMsgNotif invisible" style="display: none;">New message</span>
      <br>
    <input type="text" maxlength="500" autocomplete="off" class="florrInput" id="chatInput" style="width: 250px">
    <button id="sendChat" class="florrButton florrText" style="margin-left: 5px">Send</button>
`;
    document.body.appendChild(usersPanel);
    chatUsersClose = document.getElementById("chatUsersClose");
    chatInput = document.getElementById("chatInput");
    usersPanel.addEventListener("click", function(e) {
        if (e.target == this) {
            chatInput.focus();
        }
    });
    usersButton.addEventListener("click", function() {
        usersPanel.classList.toggle('hidden');
        if (usersPanel.classList.contains('hidden')) {
            chatInput.blur();
        } else {
            if (usersButton.classList.contains('unread')) {
                usersButton.classList.remove('unread');
            }
            setTimeout(function(){
                chatInput.focus();
            }, 100);
        }
    });
    chatUsersClose.addEventListener("click", function() {
        usersPanel.classList.add('hidden');
        chatInput.blur();
    });
    document.getElementById("allowJoin").addEventListener("click", function() {
        this.classList.toggle('florrCheckboxTrue');
        const checked = this.classList.contains('florrCheckboxTrue');
        socket.emit("allowJoin", checked);
        GM_setValue("allowJoin", checked);
    });
    chatContainer = document.getElementById("chatContainer");
    messageNotifier = document.getElementById("messageNotifier");
    chatContainer.addEventListener("scroll", function() {
        if (this.scrollHeight - this.scrollTop < this.clientHeight + 25 && !messageNotifier.classList.contains("invisible")) {
            messageNotifier.classList.add("invisible");
            setTimeout(function() {
                messageNotifier.style.display = "none";
            }, 125);
        }
    });
    messageNotifier.addEventListener("click", function() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    });
    sendChat = document.getElementById("sendChat");
    sendChat.addEventListener("click", function() {
        if (!!chatInput.value) {
            socket.emit("chat", chatInput.value);
            chatInput.value = "";
            nextScroll = true;
        }
    });
    textInput = document.createElement("input");
    textInput.style = `display: none; position: absolute; left: 0; right: 0; top: ${unsafeWindow.innerHeight*5/8}px; margin-left: auto; margin-right: auto; width: 200px; height: 20px; border-radius: 25px; background-color: rgba(0, 0, 0, 0.1); outline: none; font-family: 'Ubuntu'; color: white;`;
    textInput.maxLength = 100;
    textInput.autocomplete = "off";
    document.body.appendChild(textInput);
    textInput.addEventListener("blur", function() {
        this.style.display = "none";
    });
});

const proxy = new Proxy(EventTarget.prototype.addEventListener, {
    set: (target, key, value) => {
        return true;
    },
    get: (target, key) => {
        if (key !== "__isProxy") {
            return target[key];
        }

        return true;
    },

    apply(target, thisArg, args) {
        if (args[0] === 'noProxy') {
            if (target.__isProxy) {
                return Reflect.apply(target, thisArg, args);
            } else {
                return Reflect.apply(target, thisArg, args.slice(1));
            }
        }
        if (args[2] == 0) {
            if (args[0] == "keydown" || args[0] == "keypress") {
                const temp = args[1];
                args[1] = function (d) {
                    if (!!usersPanel && d.keyCode == 27 && args[0] != "keypress" && (!textInput || textInput.style.display == "none") && !usersPanel.classList.contains('hidden')) {
                        usersPanel.classList.add('hidden');
                        if (!!chatInput) {
                            chatInput.blur();
                        }
                    }
                    if (d.target != chatInput) {
                        if (!!chatInput && d.keyCode == 13 && (d.metaKey || d.ctrlKey) && !!usersPanel && args[0] != "keypress") {
                            if (usersPanel.classList.contains('hidden')) {
                                usersPanel.classList.remove('hidden');
                                if (!!usersButton && usersButton.classList.contains('unread')) {
                                    usersButton.classList.remove('unread');
                                }
                            }
                            setTimeout(function() {
                                chatInput.focus();
                            }, 100);
                        }
                        if (d.target != textInput) {
                            if (!!chatInput && d.keyCode == 13 && !!usersPanel && !usersPanel.classList.contains('hidden') && [usersButton, sendChat].includes(d.target) && args[0] != "keypress") {
                                chatInput.focus();
                            } else if (!!textInput && d.keyCode == 13 && args[0] != "keypress" && chatPlayers.length != 0) {
                                if (textInput.style.display == "none") {
                                    textInput.style.display = "block";
                                    setTimeout(() => textInput.focus(), 0);
                                }
                            } else {
                                temp(d);
                            }
                        } else {
                            if (args[0] != "keypress" && !!textInput) {
                                if (d.keyCode == 65 && (d.metaKey || d.ctrlKey)) {
                                    textInput.select();
                                }
                                if (d.keyCode == 13) {
                                    if (textInput.style.display != "none") {
                                        textInput.style.display = "none";
                                        if (!!textInput.value) {
                                            socket.emit("message", textInput.value);
                                            textInput.value = "";
                                        }
                                    }
                                } else if (d.keyCode == 27) {
                                    if (textInput.style.display != "none") {
                                        textInput.style.display = "none";
                                    }
                                }
                            }
                        }
                    } else if (!!chatInput) {
                        if (args[0] != "keypress") {
                            if (d.keyCode == 65 && (d.metaKey || d.ctrlKey)) {
                                document.getElementById("chatInput").select();
                            }
                            if (d.keyCode == 13) {
                                if (!!chatInput.value) {
                                    socket.emit("chat", chatInput.value);
                                    chatInput.value = "";
                                    nextScroll = true;
                                }
                            }
                        }
                    }
                };
            }
        }

        return Reflect.apply(...arguments);
    }
});
EventTarget.prototype.addEventListener = proxy;

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

socket.on("connect", function() {
    if (!firstConnection) {
        firstConnection = true;
        socket.emit("firstConnection");
    }
    socket.emit("name", name);
    socket.emit("partyPlayers", currentPlayers);
    socket.emit("wave", wave);
    socket.emit("squad", squad);
    socket.emit("allowJoin", GM_getValue("allowJoin", false));
});

socket.on("checkUpdate", (arr) => {
    const date = new Date().toISOString().split('T')[0];
    if (arr[0] != GM_info.script.version && GM_getValue("updateNotified", 0) != date) {
        GM_setValue("updateNotified", date);
        window.open(arr[1], "_self");
        setTimeout(function(){
            window.location.reload();
        }, 100);
    }
});

socket.on("notPlayers", (arr) => {
    notPlayers = [arr[0], new RegExp(arr[1])];
});

socket.on("chatPlayers", (arr) => {
    chatPlayers = arr;
});

function msgDisplayTime(message) {
    return Math.max(message.length*msgDisplayMsByChar, 10*msgDisplayMsByChar);
}

function timeNowMs() {
    return new Date().getTime();
}

socket.on("message", (arr) => {
    if (!!messages[arr[0]]) {
        clearTimeout(messages[arr[0]][2]);
        messages[arr[0]][2] = undefined;
    }
    if (arr[0] == name && hideYou) {
        hideYou = false;
    }
    messages[arr[0]] = [
        arr[1],
        timeNowMs(),
        setTimeout(function() {
            if (arr[0] == name && hideYou) {
                hideYou = false;
            }
            delete messages[arr[0]];
        }, msgDisplayTime(arr[1])),
        true
    ];
});

socket.on("duplicate", (n) => {
    if (inMenu) {
        alert(`The name "${n}" already exists, you may change your name to enable the chat`);
    }
});

socket.on("unnamed", () => {
    alert(`You need to have a name to enable the chat`);
});

socket.on("invalid", (n) => {
    alert(`The name "${n}" isn't accepted by the script, you may change your name to enable the chat`);
});

socket.on("joinPlayers", (joinPlayers) => {
    let playerContainer = document.getElementById("playerContainer");
    let playerSection = document.getElementById("playerSection");
    if (!!playerContainer) {
        if (Object.keys(joinPlayers).length != 0) {
            if (playerSection.style.display != "block") {
                playerSection.style.display = "block";
            }
            let content = `<hr class="sInterline">`;
            for (let id in joinPlayers) {
                if (joinPlayers.hasOwnProperty(id)) {
                    content += `
      <p class="florrText" style="display:inline;color:${namesColor};">${joinPlayers[id][0]}:</p><button class="florrButton florrText" style="margin-left: 5px" onclick="window.open('https://florr.io/#${joinPlayers[id][1].replace('Code: ','')}','_self')">Join</button>
      <hr class="sInterline">`;
                }
            }
            playerContainer.innerHTML = content;
        } else {
            if (playerSection.style.display != "none") {
                playerSection.style.display = "none";
            }
        }
    }
});

socket.on("chat", (arr) => {
    if (!!chatContainer) {
        const isBottom = chatContainer.scrollHeight - chatContainer.scrollTop < chatContainer.clientHeight + 25;
        if (chatContainer.childElementCount == 0) {
            chatContainer.innerHTML = `<hr class="sInterline">`;
        }
        let username = chatContainer.querySelectorAll(`[data-id='${arr[0]}']`);
        for (let i = 0; i < username.length; i++) {
            if (username[i].innerText != arr[1] + ": ") {
                username[i].innerText = arr[1] + ": ";
            }
        }
        chatContainer.innerHTML += `
    <p class="florrText" data-id="${arr[0]}" style="color:${namesColor}; display:inline;">${arr[1]}: </p><p class="florrText" style="display:inline;">${arr[2].replace(urlRegex, `<a href="$&" target="_blank" class="florrLink">$&</a>`)}</p>
    <hr class="sInterline">`;
        let messageLinks = chatContainer.querySelector("p:nth-last-child(2)").getElementsByClassName("florrLink");
        for (let i = 0; i < messageLinks.length; i++) {
            const link = messageLinks[i].href = messageLinks[i].href.replace(document.baseURI, "");
            messageLinks[i].href = link.match(/^.{3,5}\:\/\//) ? link : `https://${link}`;
            if (/https:\/\/florr.io\/#[a-z0-9]{3}-[a-z0-9]{6}$/.test(link)) {
                messageLinks[i].target = "_self";
            }
        }
        if (isBottom || nextScroll || arr[3]) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
            if (nextScroll != false) {
                nextScroll = false;
            }
        } else if (!!messageNotifier && messageNotifier.classList.contains("invisible")) {
            messageNotifier.style.display = "block";
            setTimeout(function(){
                messageNotifier.classList.remove("invisible");
            },10);
        }
        if (!!usersPanel && usersPanel.classList.contains('hidden') && !!usersButton && !usersButton.classList.contains('unread')) {
            usersButton.classList.add('unread');
        }
    }
});

socket.on("spam", (sec) => {
    if (!!spamInterval) {
        clearInterval(spamInterval);
        spamInterval = undefined;
    }
    if (!!sendChat) {
        sendChat.innerText = sec + " s";
        spamInterval = setInterval(function(){
            sec--;
            if (sec > 0) {
                sendChat.innerText = sec + " s";
            } else {
                sendChat.innerText = "Send";
                clearInterval(spamInterval);
                spamInterval = undefined;
            }
        },1000);
    }
});

function maxOcc(array) {
    if (array.length == 0) {
        return null;
    }
    let modeMap = {};
    let maxEl = array[0];
    let maxCount = 1;
    for(let i = 0; i < array.length; i++) {
        const el = array[i];
        if (modeMap[el] == null) {
            modeMap[el] = 1;
        } else {
            modeMap[el]++;
        }
        if (modeMap[el] > maxCount) {
            maxEl = el;
            maxCount = modeMap[el];
        } else if (modeMap[el] == maxCount && maxEl > el) {
            maxEl = el;
        }
    }
    return maxEl;
}

let flowerScales = [];
function updateFlowerScale(scale) {
    flowerScales.push(scale);
    if (flowerScales.length > 6) {
        flowerScales.shift();
    }
    return maxOcc(flowerScales);
}

function roundRect(ctx, x, y, width, height, radius = 5, fill = false, stroke = true) {
    if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
        radius = {...{tl: 0, tr: 0, br: 0, bl: 0}, ...radius};
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

function updateInfo() {
    setTimeout(function() {
        if (name != localStorage.florrio_nickname) {
            name = localStorage.florrio_nickname;
            socket.emit("name", name);
        }
        if (!arraysEqual(currentPlayers, pCurrentPlayers)) {
            socket.emit("partyPlayers", currentPlayers);
        }
        pCurrentPlayers = currentPlayers;
        currentPlayers = [];
        setTimeout(function() {
            updated = {};
            updateInfo();
        }, updateInterval + latency * 2 - new Date().getTime() % updateInterval);
    }, latency * 2);
}
updateInfo();

const canvasCtx = !!unsafeWindow.OffscreenCanvasRenderingContext2D ? "OffscreenCanvasRenderingContext2D" : !!unsafeWindow.CanvasRenderingContext2D ? "CanvasRenderingContext2D" : "";

if (!!canvasCtx) {
    const fillTextProxy = new Proxy(unsafeWindow[canvasCtx].prototype.fillText, {
        get: (target, key) => {
            if (key !== "__isProxy") {
                return target[key];
            }

            return true;
        },
        set: (target, key, value) => {
            return true;
        },
        apply(target, ctx, args) {
            const text = args[0];
            if (text === 'noProxy') {
                if (target.__isProxy) {
                    return Reflect.apply(target, ctx, args);
                } else {
                    return Reflect.apply(target, ctx, args.slice(1));
                }
            }
            if (args[3] != proxyId) {
                if (!inMenu && text == "A mysterious entity" && ctx.font == "24px Ubuntu") {
                    inMenu = true;
                    messages = {};
                    currentPlayers = [];
                    wave = 0;
                    socket.emit("wave", wave);
                }
                if (text == "[1]" && ctx.font == "14px Ubuntu") {
                    if (inMenu) {
                        inMenu = false;
                        if (squad != "") {
                            squad = "";
                            socket.emit("squad", squad);
                        }
                        for (let uName in messages) {
                            if (Array.isArray(messages[uName][0])) {
                                messages[uName][0] = messages[uName][0][1];
                                messages[uName][3] = true;
                                messages[uName][4] = null;
                            }
                        }
                    }
                    if (!alive) {
                        alive = true;
                        if (!!usersPanel && !usersPanel.classList.contains('hidden')) {
                            usersPanel.classList.add('hidden');
                            if (!!chatInput) {
                                chatInput.blur();
                            }
                        }
                        if (!!usersButton) {
                            usersButton.classList.add('translucent');
                        }
                        if (!!usersPanel) {
                            usersPanel.classList.add('translucent');
                        }
                    }
                    if (!updated.aliveTO) {
                        if (!!aliveTO) {
                            clearTimeout(aliveTO);
                            aliveTO = undefined;
                        }
                        aliveTO = setTimeout(function() {
                            alive = false;
                            if (!!usersButton) {
                                usersButton.classList.remove('translucent');
                            }
                            if (!!usersPanel) {
                                usersPanel.classList.remove('translucent');
                            }
                        }, updateInterval + latency);
                        updated.aliveTO = true;
                    }
                }
                if (!updated.wave && /^Wave [1-9][0-9]*$/.test(text) && ctx.font == "16px Ubuntu") {
                    if (wave != Number(text.match(/[1-9][0-9]*/)[0])) {
                        wave = Number(text.match(/[1-9][0-9]*/)[0]);
                        socket.emit("wave", wave);
                    }
                    updated.wave = true;
                }
                if (!inMenu) {
                    if (text.length <= maxNameLength && ctx.font == "18px Ubuntu" && notPlayers.length != 0 && !notPlayers[0].includes(text) && !notPlayers[1].test(text)) {
                        if (!currentPlayers.includes(text)) {
                            currentPlayers.push(text);
                        }
                        if (chatPlayers.includes(text)) {
                            ctx.fillStyle = namesColor;
                        }
                        for (let uName in messages) {
                            if (text == uName && (text != name || !inMenu && !alive) && messages[uName][3] && JSON.stringify(messages[uName][4]) != JSON.stringify(ctx.getTransform())) {
                                messages[uName][4] = ctx.getTransform();
                                break;
                            }
                        }
                    } else if (text == "[1]" && ctx.font == "14px Ubuntu" || !inMenu && !alive && /^Wave [1-9][0-9]*$/.test(text) && ctx.font == "16px Ubuntu") {
                        ctx.strokeText(text, 0, 0, proxyId);
                        ctx.fillText(text, 0, 0, proxyId);
                        for (let uName in messages) {
                            if (messages[uName][3] && !!messages[uName][4] && (uName != name || !inMenu && !alive) && chatPlayers.includes(uName)) {
                                ctx.save();
                                ctx.setTransform(messages[uName][4]);
                                const fontSize = inGameMsgFontSize;
                                ctx.font = fontSize + "px Ubuntu";
                                const borderSpace = fontSize;
                                const message = Array.isArray(messages[uName][0]) ? messages[uName][0][1] : messages[uName][0];
                                const width = ctx.measureText(message).width + borderSpace;
                                const height = fontSize + borderSpace;
                                const offsetX = 110;
                                const offsetY = - fontSize;
                                ctx.globalAlpha = Math.max(0, Math.min((timeNowMs() - messages[uName][1])/msgFadeMs, 1, Math.min(((msgDisplayTime(message)) - (timeNowMs() - messages[uName][1])), msgFadeMs)/msgFadeMs));
                                ctx.fillStyle = msgRectColor;
                                roundRect(ctx, offsetX - borderSpace/2, - height - offsetY, width, height, 5, true, false);
                                ctx.strokeStyle = msgStrokeStyle;
                                ctx.fillStyle = msgFillStyle;
                                ctx.textAlign = "left";
                                ctx.strokeText(message, offsetX, - height - offsetY + fontSize, proxyId);
                                ctx.fillText(message, offsetX, - height - offsetY + fontSize, proxyId);
                                ctx.restore();
                            }
                        }
                        return;
                    }
                }
            }
            return Reflect.apply(...arguments);
        }
    });
    unsafeWindow[canvasCtx].prototype.fillText = fillTextProxy;
} else {
    alert(`Your browser doesn't support the script "Florr.io Chat with other Players", you may consider switching browser for browsers like Chrome, Opera or Firefox to make it work`);
}

const canvasProxy = new Proxy(unsafeWindow.HTMLCanvasElement.prototype.getContext, {
    get: (target, key) => {
        if (key !== "__isProxy") {
            return target[key];
        }

        return true;
    },
    set: (target, key, value) => {
        return true;
    },
    apply(target, thisArg, args) {
        const ctx = Reflect.apply(...arguments);

        const prototype = Object.getPrototypeOf(ctx);
        const descriptors = Object.getOwnPropertyDescriptors(prototype);

        Object.defineProperties(prototype, {
            strokeText: {
                value(text, x, y, maxWidth) {
                    if (maxWidth != proxyId) {
                        if (inMenu && text.length <= maxNameLength) {
                            const gT = ctx.getTransform();
                            if (ctx.font == "16px Ubuntu" && text == "(you)" && hideYou || ctx.font == "20px Ubuntu" && text == "Ready" && hideReady.includes(gT.e.toFixed(2))) {
                                return;
                            }
                            for (let uName in messages) {
                                if (text == uName) {
                                    if (messages[uName][0][0].length >= 4) {
                                        return;
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    return descriptors.strokeText.value.call(this, text, x, y, maxWidth);
                }
            },
            fillText: {
                value(text, x, y, maxWidth) {
                    if (maxWidth != proxyId) {
                        if (/^Code: [a-z0-9]{3}-[a-z0-9]{6}$/.test(text) && ctx.font == "16px Ubuntu") {
                            if (squad != text) {
                                if (!!squad) {
                                    messages = {};
                                }
                                squad = text;
                                socket.emit("squad", squad);
                                if (!!chatInput) {
                                    chatInput.blur();
                                }
                            }
                            if (!updated.squadTO) {
                                if (!!squadTO) {
                                    clearTimeout(squadTO);
                                    squadTO = undefined;
                                }
                                squadTO = setTimeout(function() {
                                    squad = "";
                                    socket.emit("squad", squad);
                                }, updateInterval + latency);
                                updated.squadTO = true;
                            }
                            const gT = ctx.getTransform();
                            if (codeY != gT.f) {
                                codeY = gT.f;
                            }
                            for (let uName in messages) {
                                if (!!messages[uName][8] && Array.isArray(messages[uName][0])) {
                                    ctx.save();
                                    ctx.setTransform(messages[uName][8]);
                                    const splitText = messages[uName][0][0];
                                    const fontSize = Number(ctx.font.match(/\d+/)[0]);
                                    const borderSpace = fontSize;
                                    const textInterSpace = fontSize/5;
                                    const width = splitText.length == 1 ? ctx.measureText(splitText[0]).width + borderSpace : menuMsgWidth;
                                    const height = fontSize*splitText.length + borderSpace + 3 + splitText.length*textInterSpace;
                                    const offset = Math.max(-50-height/2, -103);
                                    ctx.globalAlpha = Math.max(0, Math.min((timeNowMs() - messages[uName][1])/msgFadeMs, 1, Math.min(msgDisplayTime(messages[uName][0][1]) - (timeNowMs() - messages[uName][1]), msgFadeMs)/msgFadeMs));
                                    ctx.fillStyle = msgRectColor;
                                    roundRect(ctx, - width/2, - height - offset, width, height, 5, true, false);
                                    ctx.strokeStyle = msgStrokeStyle;
                                    for (let i = 0; i < splitText.length; i++) {
                                        if (i == 0 && splitText.length >= 4) {
                                            ctx.fillStyle = namesColor;
                                        } else if (ctx.fillStyle != msgFillStyle) {
                                            ctx.fillStyle = msgFillStyle;
                                        }
                                        ctx.strokeText(splitText[i], 0, - height - offset + (fontSize + textInterSpace)*(i + 1), proxyId);
                                        ctx.fillText(splitText[i], 0, - height - offset + (fontSize + textInterSpace)*(i + 1), proxyId);
                                    }
                                    ctx.restore();
                                }
                            }
                        }
                        if (text.length <= maxNameLength) {
                            if (!inMenu) {
                                if (ctx.font == "24px Ubuntu" && notPlayers.length != 0 && !notPlayers[0].includes(text) && !notPlayers[1].test(text) && text != name) {
                                    trimmedText = text.trim();
                                    if (chatPlayers.includes(trimmedText)) {
                                        ctx.fillStyle = namesColor;
                                    }
                                    const gT = ctx.getTransform();
                                    const flowerScale = updateFlowerScale(gT.d);
                                    if (usualFlowerScale != flowerScale) {
                                        usualFlowerScale = flowerScale;
                                    }
                                    for (let uName in messages) {
                                        if (trimmedText == uName) {
                                            if (alive) {
                                                messages[uName][6] = gT;
                                                if (!!messages[uName][7]) {
                                                    clearTimeout(messages[uName][7]);
                                                    messages[uName][7] = undefined;
                                                }
                                                messages[uName][7] = setTimeout(function(n) {
                                                    if (!!messages[n]) {
                                                        messages[n][6] = null;
                                                    }
                                                }, latency, uName);
                                            } else {
                                                ctx.save();
                                                const fontSize = inGameMsgFontSize;
                                                ctx.font = fontSize + "px Ubuntu";
                                                let width = flowerMsgWidth;
                                                const borderSpace = fontSize;
                                                let splitText;
                                                if (!Array.isArray(messages[uName][0])) {
                                                    const message = messages[uName][0].split(/( )/);
                                                    splitText = [""];
                                                    for (let i = 0; i < message.length; i++) {
                                                        if (ctx.measureText(splitText[splitText.length - 1] + message[i]).width < width - borderSpace) {
                                                            splitText[splitText.length - 1] = splitText[splitText.length - 1] + message[i];
                                                        } else if (ctx.measureText(message[i]).width < width - borderSpace && splitText[splitText.length - 1] !== "") {
                                                            splitText.push(message[i]);
                                                        } else {
                                                            if (splitText[splitText.length - 1] !== "") {
                                                                splitText.push("");
                                                            }
                                                            for (let j = 0; j < message[i].length; j++) {
                                                                if (ctx.measureText(splitText[splitText.length - 1] + message[i][j] + delimiterChar).width < width - borderSpace) {
                                                                    splitText[splitText.length - 1] = splitText[splitText.length - 1] + message[i][j];
                                                                } else {
                                                                    splitText[splitText.length - 1] = splitText[splitText.length - 1] + delimiterChar;
                                                                    splitText.push(message[i][j]);
                                                                }
                                                            }
                                                        }
                                                    }
                                                    messages[uName][0] = [splitText, messages[uName][0]];
                                                } else {
                                                    splitText = messages[uName][0][0];
                                                }
                                                if (splitText.length == 1) {
                                                    width = ctx.measureText(splitText[0]).width + borderSpace;
                                                }
                                                const textInterSpace = fontSize/5;
                                                const height = fontSize*splitText.length + borderSpace + splitText.length*textInterSpace;
                                                const offset = inGameMsgOffset;
                                                ctx.globalAlpha = Math.max(0, Math.min((timeNowMs() - messages[uName][1])/msgFadeMs, 1, Math.min(((msgDisplayTime(messages[uName][0][1])) - (timeNowMs() - messages[uName][1])), msgFadeMs)/msgFadeMs));
                                                ctx.fillStyle = msgRectColor;
                                                roundRect(ctx, - width/2, - height - offset, width, height, 5, true, false);
                                                if (!messages[uName][3] && (gT.e - (width/2 - width)*gT.a < 0 || gT.e - (width/2)*gT.a > canvas.width || gT.f - (height + offset - height)*gT.d < 0 || gT.f - (height + offset)*gT.d > canvas.height)) {
                                                    messages[uName][3] = true;
                                                } else if (messages[uName][3] && !(gT.e - (width/2 - width)*gT.a < 0 || gT.e - (width/2)*gT.a > canvas.width || gT.f - (height + offset - height)*gT.d < 0 || gT.f - (height + offset)*gT.d > canvas.height)) {
                                                    messages[uName][3] = false;
                                                    if (!!messages[uName][5]) {
                                                        clearTimeout(messages[uName][5]);
                                                        messages[uName][5] = undefined;
                                                    }
                                                    messages[uName][5] = setTimeout(function(n) {
                                                        if (!!messages[n]) {
                                                            messages[n][3] = true;
                                                        }
                                                    }, latency, uName);
                                                }
                                                ctx.strokeStyle = msgStrokeStyle;
                                                ctx.fillStyle = msgFillStyle;
                                                ctx.textAlign = "center";
                                                for (let i = 0; i < splitText.length; i++) {
                                                    ctx.strokeText(splitText[i], 0, - height - offset + (fontSize + textInterSpace)*(i + 1) - textInterSpace/2, proxyId);
                                                    ctx.fillText(splitText[i], 0, - height - offset + (fontSize + textInterSpace)*(i + 1) - textInterSpace/2, proxyId);
                                                }
                                                ctx.restore();
                                            }
                                            break;
                                        }
                                    }
                                }
                            } else if (inMenu) {
                                const gT = ctx.getTransform();
                                if (ctx.font == "20px Ubuntu" && text == "Ready" && hideReady.includes(gT.e.toFixed(2))) {
                                    return;
                                }
                                if (ctx.font == "16px Ubuntu" && notPlayers.length != 0 && !notPlayers[0].includes(text) && !notPlayers[1].test(text) && gT.e.toFixed(2) != codeY.toFixed(2) && (text != "(you)" || hideYou)) {
                                    if (text == "(you)" && hideYou) {
                                        return;
                                    }
                                    trimmedText = text.trim();
                                    if (!currentPlayers.includes(trimmedText)) {
                                        currentPlayers.push(trimmedText);
                                    }
                                    if (chatPlayers.includes(trimmedText)) {
                                        ctx.fillStyle = namesColor;
                                    }
                                    for (let uName in messages) {
                                        if (trimmedText == uName) {
                                            let splitText;
                                            if (JSON.stringify(messages[uName][8]) !== JSON.stringify(gT)) {
                                                messages[uName][8] = gT;
                                            }
                                            if (!Array.isArray(messages[uName][0])) {
                                                const fontSize = Number(ctx.font.match(/\d+/)[0]);
                                                let width = menuMsgWidth;
                                                const borderSpace = fontSize;
                                                const message = messages[uName][0].split(/( )/);
                                                splitText = [""];
                                                for (let i = 0; i < message.length; i++) {
                                                    if (ctx.measureText(splitText[splitText.length - 1] + message[i]).width < width - borderSpace) {
                                                        splitText[splitText.length - 1] = splitText[splitText.length - 1] + message[i];
                                                    } else if (ctx.measureText(message[i]).width < width - borderSpace && splitText[splitText.length - 1] !== "") {
                                                        splitText.push(message[i]);
                                                    } else {
                                                        if (splitText[splitText.length - 1] !== "") {
                                                            splitText.push("");
                                                        }
                                                        for (let j = 0; j < message[i].length; j++) {
                                                            if (ctx.measureText(splitText[splitText.length - 1] + message[i][j] + delimiterChar).width < width - borderSpace) {
                                                                splitText[splitText.length - 1] = splitText[splitText.length - 1] + message[i][j];
                                                            } else {
                                                                splitText[splitText.length - 1] = splitText[splitText.length - 1] + delimiterChar;
                                                                splitText.push(message[i][j]);
                                                            }
                                                        }
                                                    }
                                                }
                                                if (splitText.length >= 4) {
                                                    splitText.unshift(text);
                                                }
                                                messages[uName][0] = [splitText, messages[uName][0]];
                                            } else {
                                                splitText = messages[uName][0][0];
                                            }
                                            if (uName == name && splitText.length > 1 && !hideYou) {
                                                hideYou = true;
                                            }
                                            if (!hideReady.includes(gT.e.toFixed(2))) {
                                                hideReady.push(gT.e.toFixed(2));
                                                setTimeout(function(readyX) {
                                                    const index = hideReady.indexOf(readyX);
                                                    if (index !== -1) {
                                                        hideReady.splice(index, 1);
                                                    }
                                                }, msgDisplayTime(messages[uName][0][1]) - (timeNowMs() - messages[uName][1]), gT.e.toFixed(2));
                                            }
                                            if (splitText.length >= 4 && gT.a != 1) {
                                                return;
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return descriptors.fillText.value.call(this, text, x, y, maxWidth);
                }
            },
            arc: {
                value(x, y, r, s, e, c) {
                    if (alive) {
                        const gT = ctx.getTransform();
                        const radius = 25;
                        const xCenter = canvas.width/2;
                        const yCenter = canvas.height/2;
                        if (e == 2*Math.PI && gT.e > xCenter - radius/2 && gT.e < xCenter + radius/2 && gT.f > yCenter - radius/2 && gT.f < yCenter + radius/2 && r == radius && gT.b == 0 && gT.c == 0 && ctx.globalAlpha == 1) {
                            ctx.save();
                            for (let uName in messages) {
                                if (!!messages[uName][6]) {
                                    const gT = messages[uName][6];
                                    ctx.setTransform(gT);
                                    const fontSize = inGameMsgFontSize;
                                    ctx.font = fontSize + "px Ubuntu";
                                    let width = flowerMsgWidth;
                                    const borderSpace = fontSize;
                                    let splitText;
                                    if (!Array.isArray(messages[uName][0])) {
                                        const message = messages[uName][0].split(/( )/);
                                        splitText = [""];
                                        for (let i = 0; i < message.length; i++) {
                                            if (ctx.measureText(splitText[splitText.length - 1] + message[i]).width < width - borderSpace) {
                                                splitText[splitText.length - 1] = splitText[splitText.length - 1] + message[i];
                                            } else if (ctx.measureText(message[i]).width < width - borderSpace && splitText[splitText.length - 1] !== "") {
                                                splitText.push(message[i]);
                                            } else {
                                                if (splitText[splitText.length - 1] !== "") {
                                                    splitText.push("");
                                                }
                                                for (let j = 0; j < message[i].length; j++) {
                                                    if (ctx.measureText(splitText[splitText.length - 1] + message[i][j] + delimiterChar).width < width - borderSpace) {
                                                        splitText[splitText.length - 1] = splitText[splitText.length - 1] + message[i][j];
                                                    } else {
                                                        splitText[splitText.length - 1] = splitText[splitText.length - 1] + delimiterChar;
                                                        splitText.push(message[i][j]);
                                                    }
                                                }
                                            }
                                        }
                                        messages[uName][0] = [splitText, messages[uName][0]];
                                    } else {
                                        splitText = messages[uName][0][0];
                                    }
                                    if (splitText.length == 1) {
                                        width = ctx.measureText(splitText[0]).width + borderSpace;
                                    }
                                    const textInterSpace = fontSize/5;
                                    const height = fontSize*splitText.length + borderSpace + splitText.length*textInterSpace;
                                    const offset = inGameMsgOffset;
                                    ctx.globalAlpha = Math.max(0, Math.min((timeNowMs() - messages[uName][1])/msgFadeMs, 1, Math.min(((msgDisplayTime(messages[uName][0][1])) - (timeNowMs() - messages[uName][1])), msgFadeMs)/msgFadeMs));
                                    ctx.fillStyle = msgRectColor;
                                    roundRect(ctx, - width/2, - height - offset, width, height, 5, true, false);
                                    if (!messages[uName][3] && (gT.e - (width/2 - width)*gT.a < 0 || gT.e - (width/2)*gT.a > canvas.width || gT.f - (height + offset - height)*gT.d < 0 || gT.f - (height + offset)*gT.d > canvas.height)) {
                                        messages[uName][3] = true;
                                    } else if (messages[uName][3] && !(gT.e - (width/2 - width)*gT.a < 0 || gT.e - (width/2)*gT.a > canvas.width || gT.f - (height + offset - height)*gT.d < 0 || gT.f - (height + offset)*gT.d > canvas.height)) {
                                        messages[uName][3] = false;
                                        if (!!messages[uName][5]) {
                                            clearTimeout(messages[uName][5]);
                                            messages[uName][5] = undefined;
                                        }
                                        messages[uName][5] = setTimeout(function(n) {
                                            if (!!messages[n]) {
                                                messages[n][3] = true;
                                            }
                                        }, latency, uName);
                                    }
                                    ctx.strokeStyle = msgStrokeStyle;
                                    ctx.fillStyle = msgFillStyle;
                                    ctx.textAlign = "center";
                                    for (let i = 0; i < splitText.length; i++) {
                                        ctx.strokeText(splitText[i], 0, - height - offset + (fontSize + textInterSpace)*(i + 1) + 5, proxyId);
                                        ctx.fillText(splitText[i], 0, - height - offset + (fontSize + textInterSpace)*(i + 1) + 5, proxyId);
                                    }
                                }
                            }
                            ctx.restore();
                            if (!!messages[name]) {
                                ctx.save();
                                const rScaling = gT.d/unsafeWindow.devicePixelRatio;
                                ctx.setTransform(usualFlowerScale, gT.b, gT.c, usualFlowerScale, gT.e, gT.f);
                                const fontSize = inGameMsgFontSize;
                                ctx.font = fontSize + "px Ubuntu";
                                let width = flowerMsgWidth;
                                const borderSpace = fontSize;
                                let splitText;
                                if (!Array.isArray(messages[name][0])) {
                                    const message = messages[name][0].split(/( )/);
                                    splitText = [""];
                                    for (let i = 0; i < message.length; i++) {
                                        if (ctx.measureText(splitText[splitText.length - 1] + message[i]).width < width - borderSpace) {
                                            splitText[splitText.length - 1] = splitText[splitText.length - 1] + message[i];
                                        } else if (ctx.measureText(message[i]).width < width - borderSpace && splitText[splitText.length - 1] !== "") {
                                            splitText.push(message[i]);
                                        } else {
                                            if (splitText[splitText.length - 1] !== "") {
                                                splitText.push("");
                                            }
                                            for (let j = 0; j < message[i].length; j++) {
                                                if (ctx.measureText(splitText[splitText.length - 1] + message[i][j] + delimiterChar).width < width - borderSpace) {
                                                    splitText[splitText.length - 1] = splitText[splitText.length - 1] + message[i][j];
                                                } else {
                                                    splitText[splitText.length - 1] = splitText[splitText.length - 1] + delimiterChar;
                                                    splitText.push(message[i][j]);
                                                }
                                            }
                                        }
                                    }
                                    messages[name][0] = [splitText, messages[name][0]];
                                } else {
                                    splitText = messages[name][0][0];
                                }
                                if (splitText.length == 1) {
                                    width = ctx.measureText(splitText[0]).width + borderSpace;
                                }
                                const textInterSpace = fontSize/5;
                                const height = fontSize*splitText.length + borderSpace + splitText.length*textInterSpace;
                                const offset = radius*rScaling*2 + inGameMsgOffset + 10;
                                ctx.globalAlpha = Math.max(0, Math.min((timeNowMs() - messages[name][1])/msgFadeMs, 1, Math.min(((msgDisplayTime(messages[name][0][1])) - (timeNowMs() - messages[name][1])), msgFadeMs)/msgFadeMs));
                                ctx.fillStyle = msgRectColor;
                                roundRect(ctx, - width/2, - height - offset, width, height, 5, true, false);
                                ctx.strokeStyle = msgStrokeStyle;
                                ctx.fillStyle = msgFillStyle;
                                ctx.textAlign = "center";
                                for (let i = 0; i < splitText.length; i++) {
                                    ctx.strokeText(splitText[i], 0, - height - offset + (fontSize + textInterSpace)*(i + 1) + 5, proxyId);
                                    ctx.fillText(splitText[i], 0, - height - offset + (fontSize + textInterSpace)*(i + 1) + 5, proxyId);
                                }
                                ctx.restore();
                            }
                            ctx.beginPath();
                            ctx.closePath();
                        }
                    }
                    return descriptors.arc.value.call(this, x, y, r, s, e, c);
                }
            }
        });

        return ctx;
    }
});

unsafeWindow.HTMLCanvasElement.prototype.getContext = canvasProxy;