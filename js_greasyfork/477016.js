// ==UserScript==
// @name         Help Bot
// @namespace    https://greasyfork.org/
// @version      0.1
// @description  Help MPP bot.
// @author       ʄɛռɨx
// @include      *://multiplayerpiano.net/*
// @include      *://mppclone.com/*
// @icon         http://imageshack.com/a/img923/4396/i1Wmrm.png
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/477016/Help%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/477016/Help%20Bot.meta.js
// ==/UserScript==
var adminarray = [];
MPP.client.on("a", function(msg) {
    var asgr = msg.a.split(' ');
    var cmd = asgr[0];if (cmd == "/help") {
    MPP.chat.send("Commands are: /help /name /id /color.")
}
if (cmd == "/name") {
    MPP.chat.send("Your name is: " + msg.p.name)
}
if (cmd == "/color") {
    MPP.chat.send("Your color is: " + msg.p.color);
}
if (cmd == "/id") {
    MPP.chat.send("Your id is: " + msg.p.id)
}}
                     )