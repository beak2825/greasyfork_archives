// ==UserScript==
// @name         Drednot.io Economy Client (Queued)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Process ! cmd using server just trust bro :)
// @match        https://drednot.io/*
// @grant        GM_xmlhttpRequest
// @connect      onrender.com
// @downloadURL https://update.greasyfork.org/scripts/540382/Drednotio%20Economy%20Client%20%28Queued%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540382/Drednotio%20Economy%20Client%20%28Queued%29.meta.js
// ==/UserScript==
// discord invite link : https://discord.gg/SvZe9ytB
(function() {
    'use strict';

     console.log("Script started! :D")
    const BOT_SERVER_URL = 'https://drednot-eco-bot.onrender.com/command'; //dont change this too
    const API_KEY = 'drednot123'; //dosnt do much but dont remove or script will break
    const MESSAGE_DELAY = 1000; //change if u want idc
//* nvm dont change anything in script, if its working then its working yk*//

    const ZWSP = '\u200B';
    const chatBox = document.getElementById("chat");
    const chatInp = document.getElementById("chat-input");
    const chatBtn = document.getElementById("chat-send");


    let messageQueue = [];
    let isProcessingQueue = false;

    function sendChat(mess) {
        if (chatBox?.classList.contains('closed')) chatBtn?.click();
        if (chatInp) chatInp.value = mess;
        chatBtn?.click();
    }

    function queueReply(message) {
        if (Array.isArray(message)) {

            message.forEach(line => messageQueue.push(ZWSP + line));
        } else {

            messageQueue.push(ZWSP + message);
        }
        if (!isProcessingQueue) {
            processQueue();
        }
    }

    function processQueue() {
        if (messageQueue.length === 0) {
            isProcessingQueue = false;
            return;
        }
        isProcessingQueue = true;
        const nextMessage = messageQueue.shift();
        sendChat(nextMessage);
        setTimeout(processQueue, MESSAGE_DELAY);
    }

    function processRemoteCommand(command, username, args) {
        GM_xmlhttpRequest({
            method: "POST",
            url: BOT_SERVER_URL,
            headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
            data: JSON.stringify({ command, username, args }),
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.reply) {
                            queueReply(data.reply);
                        }
                    } catch (e) { console.error("[EcoClient] Error parsing server response:", e); }
                } else {
                    console.error(`[EcoClient] Server error: ${response.status}`, response.responseText);
                    queueReply(`Error: Bot server returned an error (${response.status}).`);
                }
            },
            onerror: function(response) {
                console.error("[EcoClient] Connection error:", response);
                queueReply("Error: Could not connect to the bot server.");
            }
        });
    }

    function monitorChat() {
        if (!chatBox) { setTimeout(monitorChat, 2000); return; }
        console.log("[EcoClient] Chat monitor started.");
        const chatContent = document.getElementById("chat-content");
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.tagName === "P") {
                        const bdiElement = node.querySelector("bdi");
                        if (bdiElement) {
                            const pText = node.textContent || "";
                            if (pText.startsWith(ZWSP)) return; // Ignore bot's own messages

                            const colonIdx = pText.indexOf(':');
                            if (colonIdx !== -1) {
                                let msgTxt = pText.substring(colonIdx + 1).trim();
                                if (msgTxt.startsWith('!')) {
                                    let username = bdiElement.innerText.replace(/\u200B/g, '').trim();
                                    const parts = msgTxt.slice(1).trim().split(/ +/);
                                    const command = parts.shift().toLowerCase();
                                    const args = parts;
                                    const allCommands = ["verify", "bal", "balance", "work","pay", "gather", "inv", "inventory", "recipes", "craft", "daily", "flip", "n", "next","crateshop","cs","co", "p", "back","slots", "market","smelt", "m", "ms", "marketsell","timer", "timers", "mb", "marketbuy", "mc", "marketcancel", "lb", "leaderboard"];
                                    if (allCommands.includes(command)) {
                                        processRemoteCommand(command, username, args);
                                    }
                                }
                            }
                        }
                    }
                });
            });
        });
        observer.observe(chatContent, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', monitorChat); }
    else { monitorChat(); }
})();
