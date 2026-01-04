// ==UserScript==
// @name         Lag Chat Spam
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Spam Chat with random unicode characters
// @author       Havy
// @match        http://zombs.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442225/Lag%20Chat%20Spam.user.js
// @updateURL https://update.greasyfork.org/scripts/442225/Lag%20Chat%20Spam.meta.js
// ==/UserScript==

addEventListener('keydown', e => {
    if (e.keyCode == 189) {
        chatSpamToggle()
    };
});

let availableCharacters = ""
let textLength = 70;
fetch('https://raw.githubusercontent.com/bits/UTF-8-Unicode-Test-Documents/master/UTF-8_sequence_unseparated/utf8_sequence_0-0xffff_assigned_printable_unseparated.txt')
    .then(response => response.text())
    .then(data => {
    availableCharacters = data;
});

var chatSpam = null;
function chatSpamToggle() {
    clearInterval(chatSpam);
    if (chatSpam !== null) {
        chatSpam = null;
    } else {
        chatSpam = setInterval(function() {
            let text = ""
            for (let i = 0; i < textLength; i++) text += availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
            game.network.sendRpc({
                name: "SendChatMessage",
                channel: "Local",
                message: text
            });
        },1050);
    };
};