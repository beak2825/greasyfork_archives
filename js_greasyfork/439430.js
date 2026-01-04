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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439430/Source%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/439430/Source%20Bot.meta.js
// ==/UserScript==

// Variables.
var words = ['Good!', 'Wow!', 'Thanks!']; var random = Math.floor(Math.random() * words.length); // Random words about say on command - "/buy".
var error = "Error"; // Error bot command.
var adminarray = []; // Function ADMIN command.

// Bot client.
MPP.client.on("a", function(msg) {
    var asgr = msg.a.split(' ');
    var cmd = asgr[0];
    var input = msg.a.substring(cmd.legth).trim();

// Commands.
if (cmd == "/help") {
    MPP.chat.send("Info: /help (command), /about, /versions, /codelangauges, /check, /alfa, /info, /who.")
    MPP.chat.send("Fun: /buy, /eat, /use, /role, /!!!, /123, /abc, /mppsite.")
}
if (cmd == "/h") {
   MPP.chat.send("Info: /help (command), /about, /versions, /codelangauges, /check, /alfa, /info, /who.")
   MPP.chat.send("Fun: /buy, /eat, /use, /role, /!!!, /123, /abc, /mppsite.")
}
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin commmand.
     if (cmd == "/help") {
         MPP.chat.send("Admin commands: /name (command), /ban, /unban, /rc, /spam.")
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/h") {
         MPP.chat.send("Admin commands: /name (command), /ban, /unban, /rc, /spam.")
    }
   }
if (cmd == "/about") {
    MPP.chat.send("Bot created on JavaScript. Made by COdER. Link to the bot ---> . If you need Tampermonkey to install this bot.")
}
if (cmd == "/ab") {
    MPP.chat.send("Bot created on JavaScript. Made by COdER. Link to the bot ---> . If you need Tampermonkey to install this bot.")
}
if (cmd == "/versions") {
    MPP.chat.send("Versions: 0.1")
}
if (cmd == "/vers") {
    MPP.chat.send("Versions: 0.1")
}
if (cmd == "/codelangauges") {
    MPP.chat.send("Langauges: C# • C++ • CSS • HTML • JSON • Java • JavaScript - used • Phyton.")
}
if (cmd == "/cl") {
    MPP.chat.send("Langauges: C# • C++ • CSS • HTML • JSON • Java • JavaScript - used • Phyton.")
}
if (cmd == "/check") {
    MPP.chat.send("DataBase checked room name: " + MPP.client.desiredChannelId + " and _id's on room: " + MPP.client.ppl)
}
if (cmd == "/ch") {
    MPP.chat.send("DataBase checked room name: " + MPP.client.desiredChannelId + " • and _id's on room: " + MPP.client.ppl)
}
if (cmd == "/alfa") {
    MPP.chat.send("Lapis • Hustandant • COdER • AutoPlayer • Bro_67 • Hri7566.")
}
if (cmd == "/af") {
    MPP.chat.send("Lapis • Hustandant • COdER • AutoPlayer • Bro_67 • Hri7566.")
}
if (cmd == "/info") {
    MPP.chat.send("Hi, " + msg.p.name + "! Enter /help to list commands!")
}
if (cmd == "/if") {
    MPP.chat.send("Hi, " + msg.p.name + "! Enter /help to list commands!")
}
if (cmd == "/who") {
    MPP.chat.send("Name: " + msg.p.name + " | _id: " + msg.p.id + " | Color: " + msg.p.color)
}
if (cmd == "/!!!") {
    MPP.chat.send("!@#$%^&*()")
}
if (cmd == "/123") {
    MPP.chat.send("1 2 3 4 5 6 7 8 9 0")
}
if (cmd == "/abc") {
    MPP.chat.send("A B C D E F G H I J K L M N O P Q R S T U V W X Y Z")
}
if (cmd == "/mppsite") {
    MPP.chat.send("Check Hustandants site about MPP! Site: https://mpphust.ga/")
}
if (cmd == "/ms") {
    MPP.chat.send("Check Hustandants site about MPP! Site: https://mpphust.ga/")
}
// Admin commands.
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/name") {
        MPP.chat.send("Name commands: /changename, /changecolor, /name1, /name2.")
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/ban") {
         MPP.client.sendArray([{m: 'kickban', _id: msg.a.substring(5).trim(), ms: 600000}])
             MPP.chat.send("Banned.")
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/unban") {
        MPP.client.sendArray([{m: 'unban', _id: msg.a.substring(7).trim()}])
            MPP.chat.send("Unbanned.")
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/ub") {
        MPP.client.sendArray([{m: 'unban', _id: msg.a.substring(3).trim()}])
            MPP.chat.send("Unbanned.")
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/rc") {
var color12 = "#000000"; // This _id color.
        MPP.client.sendArray([{m: "chset", set: {
            color: color12,
            color2: color12
        }
}])
MPP.chat.send("Seted room color: #000000 (inner) • #000000 (outer).")
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/spam") {
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");
MPP.chat.send("Spam...");

    }
   }
// Name commands.
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/changename") {
        MPP.client.sendArray([{m: "userset", set: {
            name: msg.a.substring(12).trim()
        }
}])
MPP.chat.send("Your name changed to: " + msg.a.substring(12).trim())
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/cn") {
        MPP.client.sendArray([{m: "userset", set: {
            name: msg.a.substring(3).trim()
        }
}])
MPP.chat.send("Your name changed to: " + msg.a.substring(3).trim())
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/changecolor") {
        MPP.client.sendArray([{m: "userset", set: {
            color: msg.a.substring(13).trim()
        }
}])
MPP.chat.send("You color_name changed to: " + msg.a.substring(13).trim())
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/cc") {
        MPP.client.sendArray([{m: "userset", set: {
            color: msg.a.substring(3).trim()
        }
}])
MPP.chat.send("You color_name changed to: " + msg.a.substring(3).trim())
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/name1") {
        MPP.client.sendArray([{m: "userset", set: {
            name: "ADMIN BOT Source Bot. [ /info ]",
            color: "#ff5c5c"
        }
}])
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/name2") {
        MPP.client.sendArray([{m: "userset", set: {
            name: "BOT Source [ /info ]",
            color: "#5286ff"
        }
}])
    }
   }
// Buy... commands.
if (cmd == "/buy") {
    MPP.chat.send(msg.p.name + " You buyed: " + msg.a.substring(5).trim() + ". " + words[random])
}
if (cmd == "/eat") {
    MPP.chat.send(msg.p.name + " You eating: " + msg.a.substring(5).trim() + ".")
}
if (cmd == "/use") {
    MPP.chat.send(msg.p.name + " You used: " + msg.a.substring(5).trim() + "].")
}
if (cmd == "/role") {
    MPP.chat.send("Your role is: " + "[" + msg.a.substring(6).trim() + "].")
}
}) /* msg.a response END */;

/*
MPP.client.on('participant added', pp => {
    MPP.chat.send("Welcome " + pp.name + " to the " + MPP.client.desiredChannelId + "! Type '/info' to info this bot.")
}) /* added response end /*;
*/

console.log("Bot Source: Online!");