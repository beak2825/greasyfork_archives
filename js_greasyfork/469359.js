// ==UserScript==
// @name         Bot
// @namespace    https://greasyfork.org/
// @version      0.6
// @description  Mini MPP bot.
// @author       xXCOdERXx - #3389
// @include      *://multiplayerpiano.com/*
// @include      *://mppclone.com/*
// @icon         http://imageshack.com/a/img923/4396/i1Wmrm.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469359/Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/469359/Bot.meta.js
// ==/UserScript==
var adminarray = [];
MPP.client.on("a", function(msg) {
    var asgr = msg.a.split(' ');
    var cmd = asgr[0];
    var input = msg.a.substring(cmd.length).trim();

if (cmd == "/Помощь") {
    MPP.chat.send("(цк Цвет Комнаты) Команды: /Помощь /Создатель /Да /Нет /Имя /ИД /Цвет /Привет /Пока | Команды Цвета Комнаты: /цк1 /цк2 /цк3 /цк4 /цк5 ")
}
if (cmd == "/Создатель") {
    MPP.chat.send("Создатель Поп кэт")
}
if (cmd == "/Да") {
    MPP.chat.send("Нет")
}
if (cmd == "/Нет") {
    MPP.chat.send("Да")
}
if (cmd == "/Имя") {
    MPP.chat.send("Твоё имя " + msg.p.name)
}
if (cmd == "/ИД") {
    MPP.chat.send("Твой ИД " + msg.p.id)
}
if (cmd == "/Цвет") {
    MPP.chat.send("Твой Цвет " + msg.p.color)
}
if (cmd == "/Привет") {
    MPP.chat.send("ПРИВЕТИКИ " + msg.p.name + "!")
}
if (cmd == "/Пока") {
    MPP.chat.send("Пока:( " + msg.p.name + " :(")
}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
if (cmd == "/цк1") {
const RC1 = "#ffffff";
const RC2 = "#000000";

MPP.client.sendArray([{m: "chset", set: {color: RC1, color2: RC2}}])
    MPP.chat.send("Set colors - INNER: #FFFFFF (white) • OUTER: #000000 (black).")
}}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
if (cmd == "/цк2") {
const RC12 = "#1ae40c";
const RC22 = "#000000";

MPP.client.sendArray([{m: "chset", set: {color: RC12, color2: RC22}}])
    MPP.chat.send("Set colors - INNER: #1AE40C (green) • OUTER: #000000 (black).")
}}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
if (cmd == "/цк3") {
const RC13 = "#204fd9";
const RC23 = "#000000";

MPP.client.sendArray([{m: "chset", set: {color: RC13, color2: RC23}}])
    MPP.chat.send("Set colors - INNER: #204FD9 (blue) • OUTER: #000000 (black).")
}}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
if (cmd == "/цк4") {
const RC14 = "#d92020";
const RC24 = "#000000";

MPP.client.sendArray([{m: "chset", set: {color: RC14, color2: RC24}}])
    MPP.chat.send("Set colors - INNER: #D92020 (red) • OUTER: #000000 (black).")
}}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
if (cmd == "/цк5") {
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