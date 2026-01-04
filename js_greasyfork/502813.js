// ==UserScript==
// @name         Geoguessr Tag
// @description  Provides a tag function that sends a message that is only visible to other scripts.
// @version      1.0.0
// @author       victheturtle#5159
// @license      MIT
// @namespace    https://greasyfork.org/users/967692-victheturtle
// ==/UserScript==

const prefix = "chat:InGame:TextMessages:";

let messageSocket = null;
let accessToken = null;
let lobbyId = null;

const originalSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(...args) {
    try {
        const json = JSON.parse(...args);
        if (json.topic?.startsWith(prefix)) {
            accessToken = json.accessToken || accessToken;
            messageSocket = this;
            lobbyId = json.topic.split(":")[3];
        }
    } catch(e) { }
    return originalSend.call(this, ...args);
};

function tag(string) {
    if (!messageSocket || !accessToken || !lobbyId) return false;
    messageSocket.send(JSON.stringify({code: 'ChatMessage', topic: `${prefix}${lobbyId}:green`, payload: string, accessToken}));
    return true;
}