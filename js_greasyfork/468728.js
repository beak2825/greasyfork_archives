// ==UserScript==
// @name         SpecBouncer
// @namespace    https://greasyfork.org/
// @version      v3.17
// @description  MINI Bot to MPP
// @author       SpecSeeker
// @icon         https://mpphust.ga/assets/icon%20(48).png
// @include      *://multiplayerpiano.com/*
// @include      *://mppclone.com/*
// @include      *://mpp.terrium.net/*
// @include      *://piano.ourworldofpixels.com/*
// @grant        none
// @licence SpecSeeker
// @downloadURL https://update.greasyfork.org/scripts/468728/SpecBouncer.user.js
// @updateURL https://update.greasyfork.org/scripts/468728/SpecBouncer.meta.js
// ==/UserScript==
//local vars mmmmk
var prefix = "sp" //prefix of the bot mmmmk
var botName = "SpecSeeker#1444" //Name of the bot mmmmk
var botnameintial = `${botName} (${prefix}help)` //The finished name, Prefix and bot name combined mmmmk
var botColor = "#e1e1e1" //HEX CODE mmmmk
var botversion = "v3.17" //HEX CODE mmmmk
Admins = [
  '16c11a31bea1d46170549751', // SpecSeeker (Owner)
  ' ' // NOTHING
]
Spectators = [
  '16c11a31bea1d46170549751', // SpecSeeker (Owner)
  ' ' // NOTHING
]
MPP.client.sendArray([{
  m: "userset",
  set: {
    name: botnameintial,
    color: botColor
  }
}]);
function run(code) {
  if (new String(code) == "[object Object]" == false && new String(code) == "[object JSON]" == false) {
    try {
      return '► ' + eval(code);
    } catch (error) {
      return '► ❌ ' + error + ''
    }
  }
  if (new String(code) == "[object Object]" || new String(code) == "[object JSON]") {
    try {
      return '► ' + JSON.stringify(eval(code));
    } catch (error) {
      return '► ❌ ' + error + ' '
    }
  }
}

var follow = "server"
MPP.client.on('m', m => {
  if (m.id == follow) {
    MPP.client.sendArray([{
      m: "m",
      "x": m.x,
      "y": m.y
    }]);
  }
})

var idgetter = "server"
// program to reverse a string

function reverseString(str) {

    // empty string
    let newString = "";
    for (let i = str.length - 1; i >= 0; i--) {
        newString += str[i];
    }
    return newString;
}

MPP.client.on("a", function(msg) {
  //MSG vars
  var isAdmins = (Admins.indexOf(msg.p._id) !== -1);
  var isSpectators = (Spectators.indexOf(msg.p._id) !== -1);
  var args = msg.a.split(" ");
  var args2 = msg.a.split("");
  var cmd = args[0].toLowerCase();
  var cmd2 = args2[0].toLowerCase();
  args = args.slice(1);
  var sendChat = function(msg) {
    MPP.chat.send(msg)
  };
  var botsname = "SpecSeeker#1444"
  var botsversion = "v3.17"
  var name = msg.p.name;
  var version = msg.p.version;
  var element = ["Hello.", `I'm ${botsname} with ${botsversion}, and you are ${name}`, "I'm good. How about you?", "Maybe.", "Sure.", "I guess so.", "and?", "Ok.", "Nice.", "Thanks.", "No.", `${msg.a.substring(7).trim()}? Ok.`, `${msg.a.substring(7).trim()}? Nice!`, `${msg.a.substring(7).trim()}? Fine.`,  `${msg.a.substring(7).trim()}? I guess not.`, `${msg.a.substring(7).trim()}? Sure.`, "I think so.", "I dont really know about that.", "My favorite song? Checkpoints by Nitro Fun & Hyper Potions.", "Nice try.", "Don't.", "Yes.", "Why?"];
  var randomresponse = element[Math.floor(Math.random() * element.length)];
  var cfolders = "(hidden)";
  const string = msg.a.substring(9).trim()
  const result = reverseString(string);
  const number = msg.a.substring(12).trim()
  function makeid(length) {
    var result = '';
    var characters = ['abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()[]{}~`´|/?;:><-_+=çêéèÈÉÊáÁàÀãÃâÂëËäÄúùÙÚüÜ'];
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
  const codelangs = [
    "Hello!",
    "How are you?",
    "I'm great!",
    "Let's friend?",
    "This great!",
    "Let's go to home?",
    "Let's go to bed?",
    "(This my great friend...)",
  ]
  var rct = codelangs[Math.floor(Math.random() * codelangs.length)]
  var commands = ["help", "crownholderid", "systeminfo", "follow", "roominfo", "rules", "codetype - SpecBouncer"];
  var admincmds = ["spjs, spsayraw, spkickban, spunban,spgivecrown"];
  var secretcmds = ["spstringtest, spreverse, spcolor, spid, spskull, spthonk, spesrever - Owner by SpecSeeker"];
  var spectatorcmds = ["wspectator, wunectator"];
  var noperms = "❎ You don't have permission to use this command.";
  var perms = "✅ You have permission to use this command.";
  if (cmd === "spjs") {
    if (isAdmins) {
      var input = msg.a.split(" ").slice(1).join(" ");
      if (!input) {
        return sendChat(run(input))
      }
      sendChat(run(input))
    } else {
      sendChat(`❎ You don't have permission to use this command.`)
    }
  }
  if (cmd === "spsayraw") {
      if (isAdmins) {
		 if (args.length == 0) {
        sendChat("No text specified.");
    } else {
			sendChat(msg.a.substring(8).trim())
    }
  } else {
      sendChat(noperms);
	}
}
   if (cmd === "spstringtest") {
    if (isAdmins) {
     	sendChat(perms)
        sendChat(makeid(10))
  } else {
    sendChat(noperms + " Also, this command generates 10 characters.")
  }
}
	if (cmd === "spreverse" | cmd === "spesrever") {
  if (isAdmins) {
  	if (args.length == 0) {
    sendChat("No text to reverse. | Usage: //reverse (text) | .eciN .esreveR");
  } else {
    sendChat(`${result}`)
    }
  } else {
     if (args.length == 0) {
    sendChat("No text to reverse. | Usage: //reverse (text) | .eciN .esreveR");
  } else {
    sendChat(`Reversed String: ${result}`)
  		}	
	}
}
	if (cmd === "wspectator") {
  if (isSpectators) {
  	if (args.length == 0) {
    sendChat("Spectator has enabled.");
  } else {
  		}
	}
}
	if (cmd === "wunspectator") {
  if (isSpectators) {
  	if (args.length == 0) {
    sendChat("Spectator has turn offed.");
  } else {
  		}
	}
}
if (cmd === "spkickban") {
	if (isAdmins) {
		if (args.length == 0) {
	sendChat("Usage: //kickban (id) | Duration of kickban is 5 hours.");
} else {
		MPP.client.sendArray([{m: 'kickban', ms: 18000000, _id: `${msg.a.substring(9).trim()}`}]);
		sendChat("");
	}
		} else {
			sendChat("❎ You don't have permission to use this command.")
  }
}
if (cmd === "spunban") {
if (isAdmins) {
if (args.length == 0) {
	sendChat("Usage: spunban (id) | Unbans people. Huh.");
} else {
		MPP.client.sendArray([{m: 'unban', ms: 18000000, _id: `${msg.a.substring(7).trim()}`}]);
		sendChat("Unbanned.");
	}
		} else {
			sendChat("❎ You don't have permission to use this command.")
  }
}
       if (cmd == "spgivecrown") {
					if (isAdmins) {
            if (args.length == 0) {
              sendChat("Usage: spgivecrown (id)");
            } else {
            MPP.client.sendArray([{m: 'chown', id: msg.a.substring(11).trim()}])
            MPP.chat.send("Done.");
            }
        } else {
         sendChat("❎ You don't have permission to use this command.")
       }
    }
  if (cmd === "spcolor") {
    var input = msg.a.split(" ").slice(1).join(" ");
      if (args.length == 0) {
        sendChat(`${msg.p.color}`)
      } else {
        var targetfrommsg = MPP.client.findParticipantByName[input]; {
      sendChat(`[${targetfrommsg._id}] ${targetfrommsg.name}'s color is ${targetfrommsg.color}`)
    }
  }
}
  if (cmd === "spid") {
        sendChat(`${msg.p._id}`)
}
  if (cmd === `${prefix}follow`) {
    var input = msg.a.split(" ").slice(1).join(" ");
      sendChat(`Following: [${msg.p._id}] ${msg.p.name}`);
      follow = msg.p._id;
      return;
    var target = MPP.client.ppl[input] | MPP.client.findParticipantByName(input); {
      if (!target) {
        return sendChat(`User not found or the user is not in this room.`);
      }
      follow = target._id
      sendChat(`Following: [${target._id}] ${target.name}`)
    }
  }
  if (cmd === "spcrownholderid") {
    sendChat(`${MPP.client.channel.crown.participantId}`);
  }
  if (cmd === "spcodetype") {
    sendChat(`${rct}`);
  }
  if (cmd === "sproominfo") {
    sendChat(`Room Info | Room Name: ${MPP.client.channel._id} | Room User Limit: ${MPP.client.channel.settings.limit} | BG Colors: 1. ${MPP.client.channel.settings.color} 2. ${MPP.client.channel.settings.color2} | Chat is Enabled: ${MPP.client.channel.settings.chat} | Room is visible: ${MPP.client.channel.settings.visible} | Crown Holder _ID: ${MPP.client.channel.crown.participantId}`);
  }
  if (cmd === "spskull") {
    if (args.length == 0) {
      sendChat("Usage: spskull (msg)");
    } else {
      sendChat(name + ": " + msg.a.substring(7).trim() + " 💀");
    }
  }
  if (cmd === "spthonk") {
    if (args.length == 0) {
      sendChat("Usage: spthonk (msg)");
    } else {
      sendChat(name + ": " + msg.a.substring(7).trim() + " 🤔");
    }
  }
  if (cmd === "sphelp") {
    var cmds = "sp" + commands[0];
    for (i = 1; i < commands.length; i++) {
      cmds += ", sp" + commands[i];
    }
    sendChat("Normal commands are: " + cmds);
    sendChat("Admin commands are: " + admincmds);
    sendChat("Secret commands are: " + secretcmds);
    sendChat("Spectator commands are: " + spectatorcmds);
  }
});
MPP.chat.send(`${botName} with ${botversion} is Spectating! ✅`);
