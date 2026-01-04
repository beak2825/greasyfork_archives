// ==UserScript==
// @name         Chat2.0Recorder
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Saves chat history. For Chat 2.0.
// @author       bot_7420 [2937420]
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/488074/Chat20Recorder.user.js
// @updateURL https://update.greasyfork.org/scripts/488074/Chat20Recorder.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let db = null;

    window.onload = function () {
        initCSS();
        initControlPanel();
    };

    // Hook fetch chat
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async (...args) => {
        let [resource, config] = args;
        let response = await originalFetch(resource, config);
        if (response.url.indexOf("sendbird.com/v3/group_channels/") != -1 && response.url.indexOf("/messages?") != -1) {
            response.clone().json().then((data) => {
                if (Array.isArray(data.messages)) {
                    // console.log(data.messages);
                    dbWriteArray(data.messages);
                }
            });
        }
        return response;
    };

    // Hook chat Websocket on receive message
    const originalSend = WebSocket.prototype.send;
    window.sockets = [];
    WebSocket.prototype.send = function (...args) {
        if (window.sockets.indexOf(this) === -1 && this.url.indexOf("sendbird.com") > -1) {
            console.log("ChatRecorder: found chat2.0 websocket");
            window.sockets.push(this);
            this.addEventListener("message", function (event) {
                if (event.data.startsWith("MESG")) {
                    const messageObj = JSON.parse(event.data.substring(4));
                    handleMessage(messageObj);
                }
            });
        }
        return originalSend.call(this, ...args);
    };

    initIndexDB();

    function handleMessage(message) {
        if (!message || !message.channel_url) {
            return;
        }
        dbWrite(message);
    }

    function initIndexDB() {
        const openRequest = indexedDB.open("ScriptChat2.0RecorderDB", 2);
        openRequest.onupgradeneeded = function (e) {
            db = e.target.result;
            if (!db.objectStoreNames.contains("messageStore")) {
                console.log("ChatRecorder: initIndexDB open onupgradeneeded create store");
                const objectStore = db.createObjectStore("messageStore", { keyPath: "messageId", autoIncrement: false });
                objectStore.createIndex("targetPlayerId", "targetPlayerId", { unique: false });
            }
        };
        openRequest.onsuccess = function (e) {
            console.log("ChatRecorder: initIndexDB open onsuccess");
            db = e.target.result;
        };
        openRequest.onerror = function (e) {
            console.error("ChatRecorder: initIndexDB open onerror");
            console.dir(e);
        };
    }

    function dbWrite(message) {
        if (!db) {
            console.error("ChatRecorder: dbWrite db is null");
        }

        let msg = {};
        const targetPlayer = getTargetPlayerFromMessage(message);
        if (!targetPlayer) {
            return;
        }
        msg.targetPlayerId = targetPlayer.id;
        msg.targetPlayerName = targetPlayer.name;
        msg.senderPlayerId = message.user.guest_id;
        msg.senderPlayerName = message.user.name;
        msg.timestamp = message.ts;
        msg.messageText = message.message;
        msg.messageId = message.msg_id;
        // console.log(msg);

        const transaction = db.transaction(["messageStore"], "readwrite");
        transaction.oncomplete = (event) => { };
        transaction.onerror = (event) => {
            console.error("ChatRecorder: dbWrite transaction onerror [" + msg.targetPlayerId + " " + msg.senderName + ": " + msg.messageText + "]");
        };

        const store = transaction.objectStore("messageStore");
        const request = store.put(msg);
        request.onsuccess = (event) => { };
    }

    function dbWriteArray(messageArray) {
        if (!db) {
            console.error("ChatRecorder: dbWriteArray db is null");
        }

        const transaction = db.transaction(["messageStore"], "readwrite");
        transaction.oncomplete = (event) => { };
        transaction.onerror = (event) => {
            console.error("ChatRecorder: dbWrite transaction onerror [" + msg.targetPlayerId + " " + msg.senderName + ": " + msg.messageText + "]");
        };

        const store = transaction.objectStore("messageStore");

        for (const message of messageArray) {
            const targetPlayer = getTargetPlayerFromMessage(message);
            if (targetPlayer) {
                let msg = {};
                msg.targetPlayerId = targetPlayer.id;
                msg.targetPlayerName = targetPlayer.name;
                msg.senderPlayerId = message.user.user_id;
                msg.senderPlayerName = message.user.nickname;
                msg.timestamp = message.created_at;
                msg.messageText = message.message;
                msg.messageId = message.message_id;
                store.put(msg);
            }
        }
    }

    function dbReadByTargetPlayerId(targetPlayerId) {
        if (!db) {
            console.error("ChatRecorder: dbReadByTargetPlayerId db is null");
        }

        const transaction = db.transaction(["messageStore"], "readonly");
        transaction.oncomplete = (event) => { };
        transaction.onerror = (event) => {
            console.error("ChatRecorder: dbReadByTargetPlayerId transaction onerror [" + targetPlayerId + "]");
        };

        const store = transaction.objectStore("messageStore");
        const index = store.index("targetPlayerId");
        const keyRange = IDBKeyRange.only(targetPlayerId);

        return new Promise((resolve, reject) => {
            const resultList = [];
            index.openCursor(keyRange).onerror = (event) => {
                resolve(resultList);
            };
            index.openCursor(keyRange).onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    resultList.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(resultList);
                }
            };
        });
    }

    function dbReadAllPlayerId() {
        if (!db) {
            console.error("ChatRecorder: dbReadAllPlayerId db is null");
        }

        const transaction = db.transaction(["messageStore"], "readonly");
        transaction.oncomplete = (event) => { };
        transaction.onerror = (event) => {
            console.error("ChatRecorder: dbReadAllPlayerId transaction onerror");
        };

        const store = transaction.objectStore("messageStore");
        const index = store.index("targetPlayerId");
        const keyRange = null;

        return new Promise((resolve, reject) => {
            const resultList = [];
            index.openCursor(keyRange, "nextunique").onerror = (event) => {
                resolve(resultList);
            };
            index.openCursor(keyRange, "nextunique").onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    resultList.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(resultList);
                }
            };
        });
    }

    function getTargetPlayerFromMessage(message) {
        if (message.channel_url.startsWith("public_")) {
            return null;  // Ignore Globla, Trade, etc.
        } else if (message.channel_url.startsWith("faction-")) {
            return { id: "faction", name: "Faction" };  // Faction chat.
        }

        // Private chats.
        const selfId = getSelfIdFromSession();
        const selfName = getSelfNameFromSession();
        if (!selfId || !selfName) {
            return { id: "others", name: "Other" };
        }
        const strList = message.channel_url.split("-");
        if (strList.length !== 3) {
            return { id: "others", name: "Other" };
        }
        let target = { id: "others", name: "Other" };
        if (parseInt(strList[1]) === selfId) {
            target.id = strList[2];
            target.name = strList[2];
        } else if (parseInt(strList[2]) === selfId) {
            target.id = strList[1];
            target.name = strList[1];
        } else {
            return { id: "others", name: "Other" };
        }
        return target;
    }

    function getSelfIdFromSession() {
        let index = Object.keys(sessionStorage).findIndex((item) => item.startsWith("sidebarData"));
        if (index >= 0) {
            let sidebarData = JSON.parse(sessionStorage.getItem(sessionStorage.key(index)));
            let userID = sidebarData.user.userID;
            return userID;
        }
        return null;
    }

    function getSelfNameFromSession() {
        let index = Object.keys(sessionStorage).findIndex((item) => item.startsWith("sidebarData"));
        if (index >= 0) {
            let sidebarData = JSON.parse(sessionStorage.getItem(sessionStorage.key(index)));
            let userID = sidebarData.user.name;
            return userID;
        }
        return null;
    }

    function initCSS() {
        const isDarkmode = $("body").hasClass("dark-mode");
        GM_addStyle(`.chat-control-panel-popup {
                        position: fixed;
                        top: 10%;
                        left: 15%;
                        border-radius: 10px;
                        padding: 10px;
                        background: ${isDarkmode ? "#282828" : "#F0F0F0"};
                        z-index: 1000;
                        display: none;
                      }
    
                      .chat-control-panel-results {
                        padding: 10px;
                      }
    
                      .chat-control-player {
                        margin: 4px 4px 4px 4px !important;
                        display: inline-block !important;
                      }
    
                      .chat-control-panel-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        background: ${isDarkmode ? "#404040" : "#B0B0B0"};
                        width: 100%;
                        height: 100%;
                        opacity: 0.7;
                        z-index: 900;
                        display: none;
                      }
    
                      div#chat-player-list {
                        overflow-y: scroll;
                        height: 50px;
                      }
    
                      a.chat-history-search:hover {
                        color: #318CE7 !important;
                      }
    
                      .chat-control-panel-item {
                        display: inline-block;
                        margin: 2px 2px 2px 2px;
                      }`);
    }

    function initControlPanel() {
        const $title = $("div#top-page-links-list");
        if ($title.length === 0) {
            console.error("ChatRecorder: nowhere to put control panel button");
        }
        const $controlBtn = $(`<a id="chatHistoryControl" class="t-clear h c-pointer right last">
                                  <span class="icon-wrap svg-icon-wrap">
                                    <span class="link-icon-svg">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10.33"><defs><style>.cls-1{opacity:0.35;}.cls-2{fill:#fff;}.cls-3{fill:#777;}</style></defs><g id="Слой_2" data-name="Слой 2"><g id="icons"><g class="cls-1"><path class="cls-2" d="M10,5.67a2,2,0,0,1-4,0,1.61,1.61,0,0,1,0-.39A1.24,1.24,0,0,0,7.64,3.7a2.19,2.19,0,0,1,.36,0A2,2,0,0,1,10,5.67ZM8,1C3,1,0,5.37,0,5.37s3.22,5,8,5c5.16,0,8-5,8-5S13.14,1,8,1ZM8,9a3.34,3.34,0,1,1,3.33-3.33A3.33,3.33,0,0,1,8,9Z"></path></g><path class="cls-3" d="M10,4.67a2,2,0,0,1-4,0,1.61,1.61,0,0,1,0-.39A1.24,1.24,0,0,0,7.64,2.7a2.19,2.19,0,0,1,.36,0A2,2,0,0,1,10,4.67ZM8,0C3,0,0,4.37,0,4.37s3.22,5,8,5c5.16,0,8-5,8-5S13.14,0,8,0ZM8,8a3.34,3.34,0,1,1,3.33-3.33A3.33,3.33,0,0,1,8,8Z"></path></g></g></svg>
                                    </span>
                                  </span>
                                  <span>ChatRecorder</span>
                                </a>`);
        $title.append($controlBtn);

        const $controlPanelDiv = $(`<div id="chatControlPanel" class="chat-control-panel-popup">control</div>`);
        const $controlPanelOverlayDiv = $(`<div id="chatControlOverlayPanel" class="chat-control-panel-overlay"></div>`);
        $controlPanelDiv.html(`
        <input type="text" class="chat-control-panel-item" id="chat-target-id-input" placeholder="Player ID" size="10" />
        <button id="chat-search" class="chat-control-panel-item" style="cursor: pointer;">Search</button><br>
        <div id="chat-player-list"></div><br>
        <textarea readonly id="chat-results" cols="120" rows="30"></textarea>
        `);

        // Control panel onClick listeners
        $controlPanelDiv.find("button#chat-search").click(function () {
            const inputId = $controlPanelDiv.find("input#chat-target-id-input").val();
            dbReadByTargetPlayerId(inputId).then((result) => {
                let text = "";
                for (const message of result) {
                    const timeStr = formatDateString(new Date(message.timestamp));
                    text += timeStr + " " + message.senderPlayerName + ": " + message.messageText + "\n";
                }
                text += "Found " + result.length + " records\n";
                const $textarea = $("textarea#chat-results");
                $textarea.val(text);
                $textarea.scrollTop($textarea[0].scrollHeight);
            });
        });

        $title.append($controlPanelDiv);
        $title.append($controlPanelOverlayDiv);

        $controlBtn.click(function () {
            dbReadAllPlayerId().then((result) => {
                const $playerListDiv = $controlPanelDiv.find("div#chat-player-list");
                $playerListDiv.empty();
                let num = 0;
                for (const message of result) {
                    if (num == 8) {
                        $playerListDiv.append($(`<br>`));
                        num = -1;
                    }
                    num++;
                    let a = $(`<a class="chat-control-player">${message.targetPlayerName}</a>`);
                    a.click(() => {
                        $controlPanelDiv.find("input#chat-target-id-input").val(message.targetPlayerId);
                        $controlPanelDiv.find("button#chat-search").trigger("click");
                    });
                    $playerListDiv.append(a);
                }

                $controlPanelDiv.fadeToggle(200);
                $controlPanelOverlayDiv.fadeToggle(200);
            });
        });

        $controlPanelOverlayDiv.click(function () {
            $controlPanelDiv.fadeOut(200);
            $controlPanelOverlayDiv.fadeOut(200);
        });
    }

    function formatDateString(date) {
        const pad = (v) => {
            return v < 10 ? "0" + v : v;
        };
        let year = date.getFullYear();
        let month = pad(date.getMonth() + 1);
        let day = pad(date.getDate());
        let hour = pad(date.getHours());
        let min = pad(date.getMinutes());
        let sec = pad(date.getSeconds());
        return year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;
    }
})();
