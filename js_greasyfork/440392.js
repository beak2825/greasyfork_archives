// ==UserScript==
// @name         Bot #3
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  MPP Bot
// @author       COdER#3390
// @include      *://multiplayerpiano.com/*
// @include      *://mppclone.com/*
// @include      *://multiplayerpiano.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440392/Bot%203.user.js
// @updateURL https://update.greasyfork.org/scripts/440392/Bot%203.meta.js
// ==/UserScript==

const SCRIPT = GM_info.script;
const NAME = SCRIPT.name;
const VERSION = SCRIPT.version;
const AUTHOR = SCRIPT.author;
const pm = NAME + ' (' + VERSION + '): ';

function console() {
    console.log(pm + 'Online!');
}

function mppChatSend(str) {
    MPP.chat.send(str);
}

console();

MPP.client.on('a', function(msg) {
    let cmd = msg.a;

if (cmd == '!help') {
    mppChatSend('Commands are: !help • !about • !room • !ez • !wow.');
}
if (cmd == '!about') {
    mppChatSend('Made by ' + AUTHOR);
}
if (cmd == '!room') {
    mppChatSend('Name: ' + MPP.client.desiredChannelId);
}
if (cmd == '!ez') {
    mppChatSend('EZ!');
}
if (cmd == '!wow') {
    mppChatSend('WOW GOOD!');
};
});