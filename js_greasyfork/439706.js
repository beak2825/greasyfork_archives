// ==UserScript==
// @name         Bot #2
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  none
// @author       COdER
// @include      *://multiplayerpiano.com/*
// @include      *://mppclone.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439706/Bot%202.user.js
// @updateURL https://update.greasyfork.org/scripts/439706/Bot%202.meta.js
// ==/UserScript==

var admincmd = [];

MPP.client.on('participant added', pp => {
    MPP.chat.send('User ' + pp.name + ' (' + pp.id + ') ' + 'joined to the room!');
})
MPP.client.on("a", function(msg) {
    var asgr = msg.a.split(' ');
    var cmd = asgr[0];
    var input = msg.a.substring(cmd.length).trim();

if (cmd == '/help') {
    MPP.chat.send('Commands are: /help, /about, /!!!, /who, /random, /secret (ADMIN), /msg (say your msg) [your word].');
}
if (cmd == '/about') {
    MPP.chat.send('Bot made by COdER.');
}
if (cmd == '/!!!') {
    MPP.chat.send('!@#$%^&*()');
}
if (cmd == '/who') {
    MPP.chat.send('Your name is: ' + msg.p.name + ' | ID: ' + msg.p.id + ' | Color: ' + msg.p.color);
}
if (cmd == '/random') {
var words = ['Wow!', 'Lucky!', 'Bruh.', 'YES!']; var random = Math.floor(Math.random() * words.length);
MPP.chat.send('Random word: ' + words[random]);
}
if ((admincmd.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
if (cmd == '/secret') {
    MPP.chat.send('ID: 216241278645 • Login: 1g1a-222_cd');
}}
if (cmd == '/msg') {
    MPP.chat.send('Say msg: ' + msg.a.substring(5).trim());
}
})