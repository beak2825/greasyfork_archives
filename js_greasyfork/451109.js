// ==UserScript==
// @name         OwOBOTV2
// @namespace    https://greasyfork.org/
// @version      2.4
// @description  A Little Bot I Made For MPP
// @author       OwO Usaball 2.0 OwO On MPP
// @icon         https://play-lh.googleusercontent.com/wVfccAT4UUhRoIm0nTkl_8yPx3mcXyZ0amWZOXbH5QZ5bXKUZMQRxzrYrn94uI3Hug4
// @match      *://multiplayerpiano.com/*
// @match      *://mppclone.com/*
// @match      *://mpp.terrium.net/*
// @match      *://piano.ourworldofpixels.com/*
// @match      *://multiplayerpiano.net/*
// @license        MIT
// @resource OwOBOTV2 https://greasyfork.org/scripts/451109-owobotv2/code/OwOBOTV2.user.js
// @downloadURL https://update.greasyfork.org/scripts/451109/OwOBOTV2.user.js
// @updateURL https://update.greasyfork.org/scripts/451109/OwOBOTV2.meta.js
// ==/UserScript==

const DOWNLOAD_URL = SCRIPT.downloadURL;
// Variables.
var words = ['', '', '']; var random = Math.floor(Math.random() * words.length); // Random words about say on command - "/buy".
var error = "Error"; // Error bot command.
var adminarray = []; // Function ADMIN command.

// Bot client.
MPP.client.on("a", function(msg) {
    var asgr = msg.a.split(' ');
    var cmd = asgr[0];
    var input = msg.a.substring(cmd.legth).trim();

// Commands.
if (cmd == "oHelp") {
    MPP.chat.send("Here is a list of commands: !help (command), !about, !version, !codelangauges, !rank, !who.")
    MPP.chat.send("Admin Commands: !check, !mod !name, !cn, !name1, !name2 .")
    MPP.chat.send("Fun Commands: !balance, !abc, !123, !bruh, !SMM, !Rickroll, !Hug, !Kill, JapanIsHere.")
}
if (cmd == "!h") {
   MPP.chat.send("Info: !help (command), !about, !version, !codelangauges, !rank, !who.")
   MPP.chat.send("Admin Commands: !check, !mod !name.")
   MPP.chat.send("Fun Commands: !balance, !abc, !123, !hug, !, !, !.")
}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin commmand.
     if (cmd == "!mod") {
         MPP.chat.send("Your Rank Is Moderator.")
    }
    if (cmd == "!check") {
         MPP.chat.send("DataBase checked room name: " + MPP.client.desiredChannelId + " and _id's on room: " + MPP.client.ppl)
    }
   }
if (cmd == "!about") {
    MPP.chat.send("This bot was created by the discord user @cassidycodes")
}
if (cmd == "!Rickroll") {
    MPP.chat.send("/play https://bitmidi.com/uploads/79827.mid")
}
if (cmd == "!rank") {
    MPP.chat.send("Rank: Player (0)")
}
if (cmd == "!rankㅤㅤ") {
    MPP.chat.send("Rank: Administrator (4)")
}
if (cmd == "!JSㅤ") {
    MPP.chat.send("You arn't allowed to use this command")
}
if (cmd == "!rankㅤ") {
    MPP.chat.send("Rank: Owner (5)")
}
if (cmd == "!") {
    MPP.chat.send("")
}
if (cmd == "Hi") {
    MPP.chat.send("Hello @Person")
}
if (cmd == "!abc") {
    MPP.chat.send("Abcdefghijklmnopqrstuvwxyz Now I Know My Abcs So Please Stop Using This Command.")
}
if (cmd == "!") {
    MPP.chat.send("")
}
if (cmd == "!rankㅤㅤㅤ") {
    MPP.chat.send("You rank is Moderator")
}
if (cmd == "RR") {
    MPP.chat.send("NGGYU NGLUD NGRYAADY")
}
if (cmd == "!Bitchslaps") {
    MPP.chat.send("I Slapped " + msg.a.substring(5).trim() + " So Hard That They Went To Space and back 7 times")
}
if (cmd == "!GoAFK") {
    MPP.chat.send("Im Now Going Afk.")
}
if (cmd == "!123") {
    MPP.chat.send("Why in the world are you using this command don't know how to count?")
}
if (cmd == "JapanIsHere") {
    MPP.chat.send("Your Prob Asking Who Japan Is Well Japan Is My MPP Bestiee For Life")
}
if (cmd == "!bruh") {
    MPP.chat.send("BRUH ISTG😂")
}
if (cmd == "!balance") {
    MPP.chat.send("Your balance is ( Get a life and earn some cash you poor person. ) ")
}
if (cmd == "!StopAFK") {
    MPP.chat.send("Is No Longer Afk")
}
if (cmd == "!rank") {
    MPP.chat.send("")
}
// Admin commands.
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "cmd_name") {
        MPP.chat.send("Name commands: /changename, /changecolor, /name1, /name2.")
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "cmd_ban") {
         MPP.client.sendArray([{m: 'kickban', _id: msg.a.substring(5).trim(), m: 300}])
             MPP.chat.send("Banned.")
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "cmd_unban") {
        MPP.client.sendArray([{m: 'unban', _id: msg.a.substring(7).trim()}])
            MPP.chat.send("Unbanned.")
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "cmd_ub") {
        MPP.client.sendArray([{m: 'unban', _id: msg.a.substring(3).trim()}])
            MPP.chat.send("Unbanned.")
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "cmd_rc") {
var color12 = "#000000"; // This _id color.
        MPP.client.sendArray([{m: "chset", set: {
            color: color12,
            color2: color12
        }
}])
MPP.chat.send("Seted room color: #000000 (inner) • #000000 (outer).")
    }
    if (cmd == "/buttfuck") {
MPP.chat.send("You've Been Buttfucked - ~§ķýłēx~ 2022");
    }
    if (cmd == "!NotBheese") {
MPP.chat.send("!Rickroll");
    }
    if (cmd == "!name") {
        MPP.client.sendArray([{m: "userset", set: {
            name: msg.a.substring(12).trim()
        }
}])
MPP.chat.send("!cn (Change name ), !name1, !name2 " + msg.a.substring(12).trim())
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "!cn") {
        MPP.client.sendArray([{m: "userset", set: {
            name: msg.a.substring(3).trim()
        }
}])
MPP.chat.send("Your name changed to: " + msg.a.substring(3).trim())
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "!changecolor") {
        MPP.client.sendArray([{m: "userset", set: {
            color: msg.a.substring(13).trim()
        }
}])
MPP.chat.send("You color_name changed to: " + msg.a.substring(13).trim())
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "cmd_cc") {
        MPP.client.sendArray([{m: "userset", set: {
            color: msg.a.substring(3).trim()
        }
}])
MPP.chat.send("You color_name changed to: " + msg.a.substring(3).trim())
    }
    if (cmd == "!name1") {
        MPP.client.sendArray([{m: "userset", set: {
            name: "OwO UsaBall 2.0 OwO",
            color: "#FFFFFF"
        }
}])
    }
    if (cmd == "!name2") {
        MPP.client.sendArray([{m: "userset", set: {
            name: "OwOBOTV2 [ oHelp ]",
            color: "#add8e6"
        }
}])
    }
   }
// Buy... commands.
if (cmd == "!SYM") {
    MPP.chat.send(msg.p.name + " Just Summoned Their Mother On:" + msg.a.substring(5).trim() + ".")
}
if (cmd == "!hug") {
    MPP.chat.send(msg.p.name + " Hugged: " + msg.a.substring(5).trim() + ".")
}
if (cmd == "!kill") {
    MPP.chat.send(msg.p.name + " killed: " + msg.a.substring(5).trim() + ".")
}
}) /* msg.a response END */;

/*
MPP.client.on('participant added', pp => {
    MPP.chat.send("Welcome " + pp.name + " to the " + MPP.client.desiredChannelId + "! Type '/info' to info this bot.")
}) /* added response end /*;
*/

console.log("OwOBotV2 Is Now loaded!");