// ==UserScript==
// @name         POPBot
// @namespace    https://greasyfork.org/
// @version      0.5
// @description  Mini MPP bot.
// @author       xXCOdERXx - #3389
// @include      *://multiplayerpiano.com/*
// @include      *://mppclone.com/*
// @icon         http://imageshack.com/a/img923/4396/i1Wmrm.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469371/POPBot.user.js
// @updateURL https://update.greasyfork.org/scripts/469371/POPBot.meta.js
// ==/UserScript==
var adminarray = [];
MPP.client.on("a", function(msg) {
    var asgr = msg.a.split(' ');
    var cmd = asgr[0];
    var input = msg.a.substring(cmd.length).trim();

if (cmd == "0pop") {
    MPP.chat.send("POP Comand: 0pop 0POPgame 0POP 0POPPOPPOP")
}
if (cmd == "0POPgame") {
    MPP.chat.send("https://scratch.mit.edu/projects/868993161/ POP game")
}
if (cmd == "0POPPOPPOP") {
    MPP.chat.send("popopopopopopopopopopopopopopopopopopopopopopopopopopopopopopopop")
}

                     }) /*msg.a. response end*/