// ==UserScript==
// @name         Source Bot
// @namespace    https://greasyfork.org/
// @version      0.1
// @description  MINI Bot to MPP
// @author       COdER#3389
// @icon         https://mpphust.ga/assets/icon%20(48).png
// @include      *://multiplayerpiano.com/*
// @include      *://mppclone.com/*
// @include      *://mpp.terrium.net/*
// @include      *://piano.ourworldofpixels.com/*
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/444228/Source%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/444228/Source%20Bot.meta.js
// ==/UserScript==

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
if (cmd == "!connect") {
    MPP.chat.send("Bot connect✅! Here is a list of commands: !help (command), !about, !version, !codelangauges, !rank, !who.")
    MPP.chat.send("Admin Commands: !check, !mod !name, !cn, !name1, !name2 .")
    MPP.chat.send("Fun Commands: !balance, !abc, !123, !bruh, !JS.")
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
    MPP.chat.send("This bot was created by me.")
}
if (cmd == "!JS") {
    MPP.chat.send("You arn't allowed to use this commnad.")
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
if (cmd == "!") {
    MPP.chat.send("")
}
if (cmd == "!abc") {
    MPP.chat.send("Do you really need the know the abc's at this point? What a baby.")
}
if (cmd == "!") {
    MPP.chat.send("")
}
if (cmd == "!rankㅤㅤㅤ") {
    MPP.chat.send("You rank is Moderator")
}
if (cmd == "!") {
    MPP.chat.send("")
}
if (cmd == "!") {
    MPP.chat.send("" + msg.p.name + " .")
}
if (cmd == "!lol") {
    MPP.chat.send("If you used this command I bet someone is laughing right now.")
}
if (cmd == "!123") {
    MPP.chat.send("Why in the world are you using this command don't know how to count?")
}
if (cmd == "!balance") {
    MPP.chat.send("Your balance is ( Get a life and earn some cash you poor person. ) ")
}
if (cmd == "!") {
    MPP.chat.send("")
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
         MPP.client.sendArray([{m: 'kickban', _id: msg.a.substring(5).trim(), ms: 600000}])
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
    if (cmd == "!bruh") {
MPP.chat.send("bruh");
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
            name: " ArticFox@JS [ *AM* ]",
            color: "#C2E0F9"
        }
}])
    }
    if (cmd == "!name2") {
        MPP.client.sendArray([{m: "userset", set: {
            name: "~§ķýłēx~",
            color: "#0a73c7"
        }
}])
    }
   }
// Buy... commands.
if (cmd == "!") {
    MPP.chat.send(msg.p.name + " you gave a hug to: " + msg.a.substring(5).trim() + ". " + words[random])
}
if (cmd == "!") {
    MPP.chat.send(msg.p.name + " kissed: " + msg.a.substring(5).trim() + ".")
}
if (cmd == "!.") {
    MPP.chat.send(msg.p.name + " you killed: " + msg.a.substring(5).trim() + "].")
}
if (cmd == "!.") {
     MPP.chat.send(msg.p.name + " fucked the shit out of " + msg.a.substring(5).trim() + "they died")
}
}) /* msg.a response END */;

/*
MPP.client.on('participant added', pp => {
    MPP.chat.send("Welcome " + pp.name + " to the " + MPP.client.desiredChannelId + "! Type '/info' to info this bot.")
}) /* added response end /*;
*/

console.log("Bot Source: Online!");