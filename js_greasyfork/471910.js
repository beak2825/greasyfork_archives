// ==UserScript==
// @name         [BOT] Женя
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Помощник Создан для развлечений + помощи
// @author       Mr. Женя
// @include      *://mppclone.com/*
// @include      *://multiplayerpiano.com/*
// @icon         https://cdn.discordapp.com/avatars/1122459747262660740/fb59584f0945d2398a786f181fd28813.webp?size=80
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/471910/%5BBOT%5D%20%D0%96%D0%B5%D0%BD%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/471910/%5BBOT%5D%20%D0%96%D0%B5%D0%BD%D1%8F.meta.js
// ==/UserScript==   

var admins = [];

MPP.client.on("a", function(msg) {
    var asgr = msg.a.split(' ');
    var cmd = asgr[0];
    var input = msg.a.substring(cmd.length).trim();

// Commands
    if (cmd == "!помощь") {
        MPP.chat.send("Команды: !помощь, апомощь, ипомощь.")
    }
    if (cmd == "ипомощь") {
        MPP.chat.send("Информационные Команды: иid, иcolor, иname.")
    }
    if (cmd == "иid") {
        MPP.chat.send("Ваш _ID: " + msg.p.id + ".")
    }
    if (cmd == "иcolor") {
        MPP.chat.send("Ваш цвет: " + msg.p.color)
    }
    if (cmd == "иname") {
        MPP.chat.send("Ваше имя: " + msg.p.name)
    }

// Admin Commands
    if ((admins.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
        if (cmd == "апомощь") {
            MPP.chat.send("Административные Команды: апомощь, абан, аразбан.")
        }
    }
    if ((admins.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
        if (cmd == "абан") {
            MPP.chat.send("Забанен.")
            MPP.client.sendArray([{m: 'kickban', _id: msg.a.substring(5).trim(), ms:18000000}])
        }
    }
    if ((admins.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) {
        if (cmd == "аразбан") {
            MPP.chat.send("Разбанен")
            MPP.client.sendArray([{m: 'unban', _id: msg.a.substring(8).trim()}])
        }
    }
});