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
// @downloadURL https://update.greasyfork.org/scripts/451905/bot666.user.js
// @updateURL https://update.greasyfork.org/scripts/451905/bot666.meta.js
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
    if (cmd == "/secret") {
        MPP.chat.send("inkfell")
        }
   }
// Buy... commands.
if (cmd == "/pp") {
    MPP.chat.send("pp")
}
if (cmd == "/buttfuck") {
    MPP.chat.send("you just got buttfucked, neerdddd-")
}
if (cmd == "/banana") {
    MPP.chat.send("banana")
}
if (cmd == "/discord") 
    MPP.chat.send("https://discord.gg/VZHNwDdc")
