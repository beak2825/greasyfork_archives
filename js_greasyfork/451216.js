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
// @downloadURL https://update.greasyfork.org/scripts/451216/Source%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/451216/Source%20Bot.meta.js
// ==/UserScript==

// Variables.
var words = ['Good!', 'Wow!', 'Thanks!'];
var random = Math.floor(Math.random() * words.length); // Random words about say on command - "/buy".
var error = "Error"; // Error bot command.
var adminarray = [
  'b9bd146cf7cb47848940c03f',
  '8d7c14ca2d3e35fcbe07b407'
]; // Function ADMIN command.

var Admins = [
  'b9bd146cf7cb47848940c03f',
  '8d7c14ca2d3e35fcbe07b407'
]; // The version of adminarray for /js.

// JS get result function.
function run(code) {
  if (new String(code) == "[object Object]" == false && new String(code) == "[object JSON]" == false) {
    try {
      return '► ' + eval(code);
    } catch (error) {
      return '❌ ' + error + ''
    }
  }
  if (new String(code) == "[object Object]" || new String(code) == "[object JSON]") {
    try {
      return '► ' + JSON.stringify(eval(code));
    } catch (error) {
      return '❌ ' + error + ' '
    }
  }
}

// Bot client.
MPP.client.on("a", function(msg) {
    var asgr = msg.a.split(' ');
    var cmd = asgr[0];
    var sendChat = function(){ MPP.chat.send(msg); }
    var input = msg.a.substring(cmd.length).trim();
    var isAdmins = (Admins.indexOf(msg.p._id) !== -1);

// Commands.
if (cmd == "/help") {
    MPP.chat.send("Info: /help (command), /about, /versions, /codelanguages, /check, /alfa, /info, /who.")
    MPP.chat.send("Fun: /buy, /eat, /use, /role, /pp, /à¶ž, /123, /mppsites.")
}
if (cmd == "/h") {
   MPP.chat.send("Info: /help (command), /about, /versions, /codelanguages, /check, /alfa, /info, /who.")
   MPP.chat.send("Fun: /buy, /eat, /use, /role, /pp, /à¶ž, /abc, /mppsites.")
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
    MPP.chat.send("Bot created on JavaScript. Made by COdEr, / Bheese.")
}
if (cmd == "/ab") {
    MPP.chat.send("Bot created on JavaScript. Made by COdER, / Bheese."
);    MPP.chat.send("Versions: 0.7")
}
if (cmd == "/vers") {
    MPP.chat.send("Versions: 0.7")
}
if (cmd === "/js") {
  if (isAdmins) {
    var input2 = msg.a.split(" ").slice(1).join(" ");
    if (!input2) {
      return sendChat(run(input))
    }
      sendChat(run(input))
    } else {
      sendChat(`❎ You don't have permission to use this command.`);
    }
  }
if (cmd == "/codelanguages") {
    MPP.chat.send("Langauges: C# â€¢ C++ â€¢ CSS â€¢ HTML â€¢ JSON â€¢ Java â€¢ JavaScript - used â€¢ Python.");
}
if (cmd == "/cl") {
    MPP.chat.send("Langauges: C# â€¢ C++ â€¢ CSS â€¢ HTML â€¢ JSON â€¢ Java â€¢ JavaScript - used â€¢ Python.");
}
if (cmd === "/roominfo") {
  sendChat(`Room Info | Room Name: ${MPP.client.channel._id} | Room User Limit: ${MPP.client.channel.settings.limit} | BG Colors: 1. ${MPP.client.channel.settings.color} 2. ${MPP.client.channel.settings.color2} | Chat is Enabled: ${MPP.client.channel.settings.chat} | Room is visible: ${MPP.client.channel.settings.visible} | Crown Holder _ID: ${MPP.client.channel.crown.participantId}`);
}
if (cmd === "/room") {
     sendChat(`${MPP.client.channel.settings.limit}/${MPP.client.channel.count} ${MPP.client.channel._id}`)
}
if (cmd == "/check") {
    MPP.chat.send("DataBase checked room name: " + MPP.client.desiredChannelId + " and _id's on room: " + MPP.client.ppl)
}
if (cmd == "/ch") {
    MPP.chat.send("DataBase checked room name: " + MPP.client.desiredChannelId + " â€¢ and _id's on room: " + MPP.client.ppl)
}
if (cmd == "/alfa") {
    MPP.chat.send("Lapis â€¢ Hustandant â€¢ COdER â€¢ AutoPlayer â€¢ Bro_67 â€¢ Hri7566.")
}
if (cmd == "/af") {
    MPP.chat.send("Lapis â€¢ Hustandant â€¢ COdER â€¢ AutoPlayer â€¢ Bro_67 â€¢ Hri7566.")
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
if (cmd == "/pp") {
    MPP.chat.send("pp");
}
if (cmd == "/à¶ž") {
    MPP.chat.send("à¶ž");
}
if (cmd == "/123") {
    MPP.chat.send("is stinky");
}
if (cmd == "/mppsites") {
    MPP.chat.send("https://mppclone.com/, https://www.multiplayerpiano.org/, https://multiplayerpiano.com/ https://piano.ourworldofpixels.com https://mpp.hri7566.info/");
}
if (cmd == "/ms") {
    MPP.chat.send("Check Hustandants site about MPP! Site: https://mpphust.ga/");
}
// Admin commands.
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/name") {
        MPP.chat.send("Name commands: /changename, /changecolor, /name1, /name2.");
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/ban") {
         MPP.client.sendArray([{m: 'kickban', _id: msg.a.substring(5).trim(), ms: 600000}]);
             MPP.chat.send("Banned.");
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/unban") {
        MPP.client.sendArray([{m: 'unban', _id: msg.a.substring(7).trim()}]);
            MPP.chat.send("Unbanned.");
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/ub") {
        MPP.client.sendArray([{m: 'unban', _id: msg.a.substring(3).trim()}]);
            MPP.chat.send("Unbanned.");
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/rc") {
var color12 = "#000000"; // This _id color.
        MPP.client.sendArray([{m: "chset", set: {
            color: color12,
            color2: color12
        }
}]);
MPP.chat.send("Set inner room color to #000000 and outer room color to #000000.");
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
}]);
MPP.chat.send("Your name changed to: " + msg.a.substring(12).trim());
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/cn") {
        MPP.client.sendArray([{m: "userset", set: {
            name: msg.a.substring(3).trim()
        }
}]);
MPP.chat.send("Your name changed to: " + msg.a.substring(3).trim());
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/changecolor") {
        MPP.client.sendArray([{m: "userset", set: {
            color: msg.a.substring(13).trim()
        }
}]);
MPP.chat.send("You color_name changed to: " + msg.a.substring(13).trim());
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/cc") {
        MPP.client.sendArray([{m: "userset", set: {
            color: msg.a.substring(3).trim()
        }
}])
MPP.chat.send("You color_name changed to: " + msg.a.substring(3).trim());
    }
   }

if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/name1") {
        MPP.client.sendArray([{m: "userset", set: {
            name: "BheeseMPP [NSG]",
            color: "#ff5c5c"
        }
}]);
    }
   }
if ((adminarray.indexOf(msg.p._id) > - 1) || (msg.p._id == MPP.client.getOwnParticipant()._id)) { // Admin command.
    if (cmd == "/name2") {
        MPP.client.sendArray([{m: "userset", set: {
            name: "BheeseBot [NSG]",
            color: "#5286ff"
        }
}]);
    }
   }
// Buy... commands.
if (cmd == "/buy") {
    MPP.chat.send(msg.p.name + " bought: " + msg.a.substring(5).trim() + ". " + words[random]);
}
if (cmd == "/eat") {
    MPP.chat.send(msg.p.name + " ate " + msg.a.substring(5).trim() + ".");
}
if (cmd == "/use") {
    MPP.chat.send(msg.p.name + " used " + msg.a.substring(5).trim() + "].");
}
if (cmd == "/role") {
    MPP.chat.send("Your role was changed, It's " + msg.a.substring(6).trim() + " right?");
}
}); /* msg.a response END */

/*
MPP.client.on('participant added', pp => {
    MPP.chat.send("Welcome " + pp.name + " to the " + MPP.client.desiredChannelId + "! Type '/info' to info this bot.")
}) /* added response end /*;
*/

console.log("Bot Source: Online!");