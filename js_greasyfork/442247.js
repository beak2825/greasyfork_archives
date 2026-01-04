// ==UserScript==
// @name         bot666
// @namespace    https://greasyfork.org/
// @version      0.2
// @description  MINI Bot to MPP
// @author       deorema33- doomka
// @icon         https://mpphust.ga/assets/icon%20(48).png
// @include      *://multiplayerpiano.com/*
// @include      *://mppclone.com/*
// @include      *://mpp.terrium.net/*
// @include*://piano.ourworldofpixels.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442247/bot666.user.js
// @updateURL https://update.greasyfork.org/scripts/442247/bot666.meta.js
// ==/UserScript==


if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/name1") {
        MPP.client.sendArray([{m: "userset", set: {
            name: "ADMIN BOT 666 Bot. [ /info ]",
            color: "#ff5c5c"
        }
}])
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/BSoD") {
        MPP.client.sendArray([{m: "userset", set: {
            name: "BSoD",
            color: "#0033ff"
        }
}])
    }
   }
// Buy... commands.
if (cmd == "/666") {
    MPP.chat.send(msg.p.name + " 666: " + msg.a.substring(5).trim() + ". " + words[random])
}
if (cmd == "/kill") {
    MPP.chat.send(msg.p.name + " death: " + msg.a.substring(5).trim() + ".")
}
if (cmd == "/000") {
    MPP.ban.send(msg.p.name + " banned: " + msg.a.substring(5).trim() + ".")
}
if (cmd == "/say") {
    MPP.chat.send("say: " + "[" + msg.a.substring(6).trim() + "].")
}