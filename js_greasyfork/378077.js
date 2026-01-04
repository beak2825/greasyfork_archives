// ==UserScript==
// @name         Discord encryption
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Encrypt and decrypt messages on Discord on the fly.
// @author       Undead Mockingbird
// @match        https://discordapp.com/channels/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378077/Discord%20encryption.user.js
// @updateURL https://update.greasyfork.org/scripts/378077/Discord%20encryption.meta.js
// ==/UserScript==

// CONFIG: Insert your password here.
var password = "adfaldskfjlkadsf";
/////////////////////////////////////

// Replace any messages we manage to decrypt.
function decryptDiscordMessages(password) {
    setTimeout(function(){decryptDiscordMessages(password)}, 10);
    var nodes = document.getElementsByClassName('markup-2BOw-j');
    for (var i = nodes.length; i--;) {
        if (nodes[i].__decrypted != undefined) continue;
        nodes[i].__decrypted = true;

        var text = nodes[i].innerText;
        if (text.endsWith('(edited)')) {
            text = text.slice(0, -'(edited)'.length);
        }
        var decrypted = CryptoJS.AES.decrypt(text, password);
        if (decrypted == "") continue;
        try {
            var message = decrypted.toString(CryptoJS.enc.Utf8);
            if (message == "") continue;
            nodes[i].innerHTML = '<div style="color:red">' + message + '</div>';
        } catch (error) {}
    }
}
decryptDiscordMessages(password);

function registerMessageHook() {
    setTimeout(registerMessageHook, 50);
    var targetNode = document.getElementsByClassName('textArea-2Spzkt')[0];
    if (targetNode == undefined) return;

    targetNode.onkeydown = function(e){
        var message = targetNode.value;
        if (message.endsWith('/') && e.keyCode == 191) {
            message = message.slice(0, -1);
            console.log(message);
            var cypher = CryptoJS.AES.encrypt(message, password);
            targetNode.value = cypher;
        }
    };
}
registerMessageHook();
