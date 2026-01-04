// ==UserScript==
// @name         MatterBot
// @namespace    https://greasyfork.org/
// @version      0.3
// @description  Это большой, функциональный чат-бот для MPP
// @author       ʄɛռɨx
// @include      *://multiplayerpiano.com/*
// @include      *://mppclone.com/*
// @include      *://mpp.hyye.tk/*
// @icon         http://imageshack.com/a/img923/4396/i1Wmrm.png
// @grant        none
// @license      GPL

// @downloadURL https://update.greasyfork.org/scripts/476927/MatterBot.user.js
// @updateURL https://update.greasyfork.org/scripts/476927/MatterBot.meta.js
// ==/UserScript==
var adminarray = [];
MPP.client.on("a", function(msg) {
    var asgr = msg.a.split(' ');
    var cmd = asgr[0];
    var input = msg.a.substring(cmd.length).trim();

if (cmd == "/help") {
    MPP.chat.send("Commands are: /help /info /qu /name /id /color /hi /bye /matter.")
}
if (cmd == "/info") {
    MPP.chat.send("More detailed - https://t.me/+an_k4NesPBk3OGFi")
}
if (cmd == "/qu") {
    MPP.chat.send("In the Telegram - https://t.me/@coffeezxc")
}
if (cmd == "/name") {
    MPP.chat.send("Your name is: " + msg.p.name)
}
if (cmd == "/id") {
    MPP.chat.send("Your id is: " + msg.p.id)
}
if (cmd == "/color") {
    MPP.chat.send("Your color is: " + msg.p.color)
}
if (cmd == "/hi") {
    MPP.chat.send("You're a f*ggot, " + msg.p.name + "!")
}
if (cmd == "/bye") {
    MPP.chat.send("fuck you, " + msg.p.name + " :)")
}
if (cmd == "/matter") {
    MPP.chat.send("Matter is a crypipasta invented by the creator of this bot. You can learn more through the bot!")
}
}
                     ) /*msg.a. response end*/

//вы ОБЯЗАНЫ сделать разделение бота на три скрипта
//это 2 скрипт

// ==UserScript==
// @name         MatterBot
// @namespace    https://greasyfork.org/
// @version      0.3
// @description  Это большой, функциональный чат-бот для MPP
// @author       ʄɛռɨx
// @include      *://multiplayerpiano.com/*
// @include      *://mppclone.com/*
// @include      *://mpp.hyye.tk/*
// @icon         http://imageshack.com/a/img923/4396/i1Wmrm.png
// @grant        none
// @license      GPL

// ==/UserScript==
var adminarray = [];
MPP.client.on("a", function(msg) {
    var asgr = msg.a.split(' ');
    var cmd = asgr[0];
    var input = msg.a.substring(cmd.length).trim();

if (cmd == "/help") {
    MPP.chat.send("By topic: /end /yt /gt /d.")
}
if (cmd == "/end") {
    MPP.chat.send("February 1, 2029")
}
if (cmd == "/yt") {
    MPP.chat.send("https://youtube.com/@0fenix")
}
if (cmd == "/gt") {
    MPP.chat.send("https://github.com/NoneFeLiX")
}
if (cmd == "/d") {
    MPP.chat.send("https://discord.gg/eY8cE5Y7")
}}
                     ) /*msg.a. response end*/


//а это последний 3 скрипт, бот просто шикарный, этот бот лучший

// ==UserScript==
// @name         MatterBot
// @namespace    https://greasyfork.org/
// @version      0.3
// @description  Это большой, функциональный чат-бот для MPP
// @author       ʄɛռɨx
// @include      *://multiplayerpiano.com/*
// @include      *://mppclone.com/*
// @include      *://mpp.hyye.tk/*
// @icon         http://imageshack.com/a/img923/4396/i1Wmrm.png
// @grant        none
// @license      GPL

// ==/UserScript==
var adminarray = [];
MPP.client.on("a", function(msg) {
    var asgr = msg.a.split(' ');
    var cmd = asgr[0];
    var input = msg.a.substring(cmd.length).trim();

if (cmd == "/help") {
    MPP.chat.send("Owner commands: /rc1 /rc2 /rc3 /rc4 /rc5 /ban /unban.")
}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
if (cmd == "/rc1") {
const RC1 = "#ffffff";
const RC2 = "#000000";

MPP.client.sendArray([{m: "chset", set: {color: RC1, color2: RC2}}])
    MPP.chat.send("Set colors - INNER: #FFFFFF (white) • OUTER: #000000 (black).")
}}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
if (cmd == "/rc2") {
const RC12 = "#1ae40c";
const RC22 = "#000000";

MPP.client.sendArray([{m: "chset", set: {color: RC12, color2: RC22}}])
    MPP.chat.send("Set colors - INNER: #1AE40C (green) • OUTER: #000000 (black).")
}}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
if (cmd == "/rc3") {
const RC13 = "#204fd9";
const RC23 = "#000000";

MPP.client.sendArray([{m: "chset", set: {color: RC13, color2: RC23}}])
    MPP.chat.send("Set colors - INNER: #204FD9 (blue) • OUTER: #000000 (black).")
}}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
if (cmd == "/rc4") {
const RC14 = "#d92020";
const RC24 = "#000000";

MPP.client.sendArray([{m: "chset", set: {color: RC14, color2: RC24}}])
    MPP.chat.send("Set colors - INNER: #D92020 (red) • OUTER: #000000 (black).")
}}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
if (cmd == "/rc5") {
const RC15 = "#d99620";
const RC25 = "#000000";

MPP.client.sendArray([{m: "chset", set: {color: RC15, color2: RC25}}])
    MPP.chat.send("Set colors - INNER: #D99620 (blue) • OUTER: #000000 (black).")
}}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
if (cmd == "/ban") {
MPP.client.sendArray([{m: 'kickban', _id: msg.a.substring(5).trim(), ms: 600000}])
    MPP.chat.send("✔️ Banned.")
}}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
if (cmd == "/unban") {
MPP.client.sendArray([{m: 'unban', _id: msg.a.substring(7).trim()}])
    MPP.chat.send("✔️ Unbanned.")
}}
                     }) /*msg.a. response end*/

