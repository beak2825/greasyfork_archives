// ==UserScript==
// @name         Bot-Alex 3
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  mini bot MPP
// @author       Alex-Bot
// @match        *https://multiplayerpiano.net/?c*
// @match        *https://mpp.hyye.xyz/?c*
// @license      MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479463/Bot-Alex%203.user.js
// @updateURL https://update.greasyfork.org/scripts/479463/Bot-Alex%203.meta.js
// ==/UserScript==

MPP.client.on('a', function(msg) {
    let cmd = msg.a;

    if (cmd == ',help') {
        MPP.chat.send('Commands: ,help - ,about - ,myColor - ,myId')
        MPP.chat.send('Fun: ,UwU - ,OwO - ,123 - ,random')
    }
    if (cmd == ',myColor') {
        MPP.chat.send(msg.p.color + 'Your color')
    }
    if (cmd == ',myId') {
        MPP.chat.send(msg.p.name + 'Your ID')
    }
    if (cmd == ',random') {
        var words = ['BRUH =) ' , 'New year!' , 'XTO YA?']; var random = Math.floor(Math.random() * words.length)
        MPP.chat.send('' + words[random]);
    }
    if (cmd == ',UwU') {
        MPP.chat.send('OwO')
    }
    if (cmd == ',OwO') {
        MPP.chat.send('UwU')
    }
    if (cmd == ',123') {
        MPP.chat.send('456')
    }
    if (cmd == ',about') {
        MPP.chat.send('Data: 10.11.2023')
        MPP.chat.send('About: Bot-Alex')
}
})