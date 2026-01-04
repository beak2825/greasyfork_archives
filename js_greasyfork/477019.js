// ==UserScript==
// @name         FenixBot
// @namespace    https://greasyfork.org/
// @version      2.11
// @description  MPP bot.
// @author       ʄɛռɨx
// @include      *://multiplayerpiano.org/*
// @include      *://www.multiplayerpiano.org/*
// @include      *://mppclone.com/*
// @icon         http://imageshack.com/a/img923/4396/i1Wmrm.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477019/FenixBot.user.js
// @updateURL https://update.greasyfork.org/scripts/477019/FenixBot.meta.js
// ==/UserScript==
var adminarray = [];
MPP.client.on("a", function(msg) {
    var asgr = msg.a.split(' ');
    var cmd = asgr[0];
    var input = msg.a.substring(cmd.length).trim();

if (cmd == "#help") {
    MPP.chat.send("(rc - roomcolor) Commands are: `#help`, `#about`, `#yes`, `#no`, `#name`, `#id`, `#color`, `#hi`, `#bye.`");
    MPP.chat.send("Bot owner commands: `#rc1`, `#rc2`, `#rc3`, `#rc4`, `#rc5`, `#ban`, `#unban`.");
}
if (cmd == "#about") {
    MPP.chat.send("Made by Brokirilz /help HELPED xXCOdERXx - #3389.")
}
if (cmd == "#yes") {
    MPP.chat.send("no")
}
if (cmd == "#no") {
    MPP.cha.send("yes")
}
if (cmd == "#name") {
    MPP.chat.send("Your name is: " + msg.p.name)
}
if (cmd == "#id") {
    MPP.chat.send("Your id is: " + msg.p.id)
}
if (cmd == "#color") {
    MPP.chat.send("Your color is: " + msg.p.color)
}
if (cmd == "#hi") {
    MPP.chat.send("Hi, " + msg.p.name + "!")
}
if (cmd == "#bye") {
    MPP.chat.send("Bye, " + msg.p.name + " :(")
}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
if (cmd == "#rc1") {
const RC1 = "#ffffff";
const RC2 = "#000000";

MPP.client.sendArray([{m: "chset", set: {color: RC1, color2: RC2}}])
    MPP.chat.send("Set colors - INNER: #FFFFFF (white) • OUTER: #000000 (black).")
}}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
if (cmd == "#rc2") {
const RC12 = "#1ae40c";
const RC22 = "#000000";

MPP.client.sendArray([{m: "chset", set: {color: RC12, color2: RC22}}])
    MPP.chat.send("Set colors - INNER: #1AE40C (green) • OUTER: #000000 (black).")
}}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
if (cmd == "#rc3") {
const RC13 = "#204fd9";
const RC23 = "#000000";

MPP.client.sendArray([{m: "chset", set: {color: RC13, color2: RC23}}])
    MPP.chat.send("Set colors - INNER: #204FD9 (blue) • OUTER: #000000 (black).")
}}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
if (cmd == "#rc4") {
const RC14 = "#d92020";
const RC24 = "#000000";

MPP.client.sendArray([{m: "chset", set: {color: RC14, color2: RC24}}])
    MPP.chat.send("Set colors - INNER: #D92020 (red) • OUTER: #000000 (black).")
}}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
if (cmd == "#rc5") {
const RC15 = "#d99620";
const RC25 = "#000000";

MPP.client.sendArray([{m: "chset", set: {color: RC15, color2: RC25}}])
    MPP.chat.send("Set colors - INNER: #D99620 (blue) • OUTER: #000000 (black).")
}}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
if (cmd == "#ban") {
MPP.client.sendArray([{m: 'kickban', _id: msg.a.substring(5).trim(), ms: 600000}])
    MPP.chat.send("✔️ Banned.")
}}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
if (cmd == "#unban") {
MPP.client.sendArray([{m: 'unban', _id: msg.a.substring(7).trim()}])
    MPP.chat.send("✔️ Unbanned.")
}}
                     }) /*msg.a. response end*/