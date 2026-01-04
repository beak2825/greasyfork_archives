// ==UserScript==
// @name         DrrrkariHelperTools 広告
// @namespace    http://tampermonkey.net/
// @version      0.24
// @description  ヘルパーツール
// @author       Zel9278 (https://c30.life)
// @match        *://drrrkari.com/room*
// @icon         https://www.google.com/s2/favicons?domain=drrrkari.com
// @grant        none
// @require      https://unpkg.com/axios/dist/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/522567/DrrrkariHelperTools%20%E5%BA%83%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/522567/DrrrkariHelperTools%20%E5%BA%83%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        roomKeeperInterval: 1, // 初期値を3分に設定
        messages: [
            "複数のＯＳにファイル共有 https://x.gd/WfzLU",
            "WingetUI https://x.gd/q6dBF",
            "AIプログラムエディターCURSORはエディター内でコードのエラーをリアルタイムで検出し、修正案を提示します。エラーの原因を特定しやすく、デバッグ時間を短縮します。https://www.cursor.com/",
            "貴方も、Wazeナビアプリの道路を追加しませんか？ Wazeエディター https://www.waze.com/ja/editor",
            "ファン付き人間工学に基づいたホールマウス https://amzn.to/3Zc0x5p",
            "Wazeナビアプリ https://www.waze.com/ul?acvp=6a9b2f03-a90a-4b63-9615-6122f6236ef5",
            "WazeLiveMap https://www.waze.com/ja/live-map/directions",
            "WazeEvent予告 https://www.waze.com/ja/events"
        ]
    };

    var playingTime = 0;
    var parsedCookies = {};
    var roomKeeperTimer;

    function initialize() {
        loadCookies();
        setupHelperTools();
        initializePlayingTime();
        initializeRoomKeeper();
        initializeChatTools();
    }

    function loadCookies() {
        document.cookie.split('; ').forEach(cookieString => {
            const cookie = cookieString.split("=");
            parsedCookies[cookie[0]] = cookie[1];
        });
        console.log(`Your cookie is ${parsedCookies["durarara-like-chat1"]}`);
    }

    function setupHelperTools() {
        const menu = document.querySelector(".menu");
        const messageBoxInner = document.querySelector(".message_box_inner");

        const drrrHelperTools = document.createElement("li");
        const childTools = document.createElement("u");
        const childToolsHTML = document.createElement("span");

        childTools.innerText = "cm";
        drrrHelperTools.setAttribute("class", "drrrHelperTools");
        childTools.setAttribute("class", "helperTools");

        childToolsHTML.style.display = "none";
        childToolsHTML.style.margin = "0";
        childToolsHTML.style.padding = "0";

        childToolsHTML.innerHTML = `\
          <span>durarara-like-chat1: </span><span class="dlc">${parsedCookies["durarara-like-chat1"]}</span><br/>\
          <span>playing: </span><span class="playing">idk</span><br/>\
          <input type="checkbox" class="roomkeeper" name="roomkeeper" checked><label for="roomkeeper">RoomKeeper</label>\
        `;

        childTools.onclick = () => {
            childToolsHTML.style.display = (childToolsHTML.style.display === "none") ? "block" : "none";
            if (childToolsHTML.style.display === "block") {
                createToolbar(childToolsHTML);
            } else {
                const toolbar = document.getElementById("drrrkari-toolbar");
                if (toolbar) {
                    toolbar.style.display = "none";
                }
            }
        };

        messageBoxInner.appendChild(childToolsHTML);
        drrrHelperTools.appendChild(childTools);
        menu.insertBefore(drrrHelperTools, menu.firstChild);
    }

    function initializePlayingTime() {
        setInterval(() => {
            document.querySelector(".playing").innerText = timestampToDate((playingTime++) * 1024);
        }, 1000);
    }

    function initializeRoomKeeper() {
        const roomKeeper = document.querySelector(".roomkeeper");
        let latestStr = "";

        if (roomKeeperTimer) {
            clearInterval(roomKeeperTimer);
        }

        roomKeeperTimer = setInterval(() => {
            if (!roomKeeper.checked) return;

            const availableMessages = config.messages.filter(message => message !== latestStr);
            const rndStr = availableMessages[Math.floor(Math.random() * availableMessages.length)];
            latestStr = rndStr;
            sendChat(rndStr);
        }, config.roomKeeperInterval * 60 * 1000);
    }

    function initializeChatTools() {
        const playing = document.querySelector(".playing");
        playing.onclick = handlePlayingClick;

        const dlc = document.querySelector(".dlc");
        dlc.onclick = handleDlcClick;
    }

    function handlePlayingClick(e) {
        sendChat(e.target.innerText);
        showTemporaryMessage(e.target, "[Sended!]", "sended");
    }

    function handleDlcClick(e) {
        copyToClipboard(e.target.innerText);
        showTemporaryMessage(e.target, "[Copied!]", "copied");
    }

    function showTemporaryMessage(target, messageText, className) {
        const message = document.createElement("span");
        message.innerText = messageText;
        message.setAttribute("class", className);

        if (!document.querySelector(`.${className}`)) {
            target.appendChild(message);
            setTimeout(() => target.removeChild(message), 2000);
        }
    }

    function copyToClipboard(text) {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.parentElement.removeChild(ta);
    }

    function timestampToDate(unixTimestamp) {
        let totalSeconds = unixTimestamp / 1000;
        const days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);

        return `${days}日${hours}時間${minutes}分${seconds}秒`;
    }

    function sendChat(text) {
        if (!text.trim()) return;

        const input = document.querySelector("#message .inputarea textarea");
        const submit = document.querySelector("#message .submit input");

        input.value = text;
        submit.click();
        console.log("send: ", text);
    }

    function createToolbar(parentElement) {
        const existingToolbar = document.getElementById("drrrkari-toolbar");
        if (existingToolbar) {
            existingToolbar.style.display = "block";
            return;
        }

        const toolbar = document.createElement("div");
        toolbar.id = "drrrkari-toolbar";
        toolbar.style.display = "block";
        toolbar.style.marginTop = "10px";
        toolbar.style.backgroundColor = "#333";
        toolbar.style.padding = "10px";
        toolbar.style.borderRadius = "5px";

        const intervalLabel = document.createElement("label");
        intervalLabel.textContent = "RoomKeeper間隔 (分): ";
        intervalLabel.style.marginRight = "10px";

        const intervalInput = document.createElement("select");
        [1, 2, 3, 4, 5].forEach(value => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            intervalInput.appendChild(option);
        });
        intervalInput.value = config.roomKeeperInterval;

        const saveButton = document.createElement("button");
        saveButton.textContent = "変更を保存";
        saveButton.style.marginLeft = "10px";
        saveButton.style.backgroundColor = "#4CAF50";
        saveButton.style.color = "#fff";
        saveButton.style.border = "none";
        saveButton.style.padding = "5px 10px";

        const feedbackMessage = document.createElement("span");
        feedbackMessage.style.marginLeft = "10px";
        feedbackMessage.style.color = "white";
        feedbackMessage.style.display = "none";

        saveButton.onclick = () => {
            config.roomKeeperInterval = parseInt(intervalInput.value, 10);
            initializeRoomKeeper();
            feedbackMessage.style.display = "inline";
            feedbackMessage.innerText = "間隔が変更されました。";
            setTimeout(() => feedbackMessage.style.display = "none", 2000);
        };

        toolbar.appendChild(intervalLabel);
        toolbar.appendChild(intervalInput);
        toolbar.appendChild(saveButton);
        toolbar.appendChild(feedbackMessage);

        parentElement.appendChild(toolbar);
    }

    initialize();
})();
