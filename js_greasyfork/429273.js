// ==UserScript==
// @name         PAWS - Faction Chat Reader
// @namespace    https://www.tornpaws.uk/
// @version      1.4
// @description  Read faction chat and post to discord
// @author       lonerider543
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/429273/PAWS%20-%20Faction%20Chat%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/429273/PAWS%20-%20Faction%20Chat%20Reader.meta.js
// ==/UserScript==

var secret = $('script[secret]').attr("secret")
var uid = $('script[uid]').attr("uid")
var domain = $('script[domain]').attr("domain")
var socket = new WebSocket(`wss://${domain}/chat/ws?uid=${uid}&secret=${secret}`);

socket.onmessage = function(event) {
    let msg_data = JSON.parse(event.data).data[0];
    if (msg_data.roomId.startsWith("Faction")) {
        let req_data = {
            "id": msg_data.messageId,
            "room": msg_data.roomId,
            "author": msg_data.senderName,
            "author_id": msg_data.senderId,
            "message": msg_data.messageText,
            "timestamp": msg_data.time
        }

        GM.xmlHttpRequest({
            method: "POST",
            url: "https://www.tornpaws.uk/chat/",
            data: JSON.stringify(req_data)
        });
    }
}

socket.onclose = function(event) {
    console.log("PAWS Faction Chat - Connection closed.");
}