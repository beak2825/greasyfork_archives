// ==UserScript==
// @name         NewBouncer
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
// @downloadURL https://update.greasyfork.org/scripts/451847/NewBouncer.user.js
// @updateURL https://update.greasyfork.org/scripts/451847/NewBouncer.meta.js
// ==/UserScript==
//local vars mmmmk
var prefix = "//" //prefix of the bot mmmmk
var botName = "NewBouncer" //Name of the bot mmmmk
var botnameintial = `${botName} (${prefix}help)` //The finished name, Prefix and bot name combined mmmmk
var botColor = "#0084ff" //HEX CODE mmmmk
Admins = [
  'bbf47ebb5351a8c1d23a3756', // bheese
  'f7d438a6dd514f5c1b857687', // shade
  'a41651bf8a46bafc5548dad6', // lapis
  '081c0c7405bdce8bb5344ab2', // mero
  'ead940199c7d9717e5149919', // intel
  '36e7db48d8100a1d408b3352', // cyx
  'cd74db50676ed31005b79e7d', // my beloved
  'ba8bfeaa3e4e46eb79d8891d', // lesbian
  '7a4430c23e74a21c46df576e', // inkfelL
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
      return 'â–º ' + eval(code);
    } catch (error) {
      return 'â–º âŒ ' + error + ''
    }
  }
  if (new String(code) == "[object Object]" || new String(code) == "[object JSON]") {
    try {
      return 'â–º ' + JSON.stringify(eval(code));
    } catch (error) {
      return 'â–º âŒ ' + error + ' '
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
  var isCustom = (Custom.indexOf(msg.p._id) !== -1);
  var args = msg.a.split(" ");
  var args2 = msg.a.split("");
  var cmd = args[0].toLowerCase();
  var cmd2 = args2[0].toLowerCase();
  args = args.slice(1);
  var sendChat = function(msg) {
    MPP.chat.send(msg)
  };
  var botsname = "NewBouncer" 
  var name = msg.p.name;
  var element = ["Hello.", `I'm ${botsname}, and you are ${name}`, "I'm good. How about you?", "Maybe.", "Sure.", "I guess so.", "and?", "Ok.", "Nice.", "Thanks.", "No.", `${msg.a.substring(7).trim()}? Ok.`, `${msg.a.substring(7).trim()}? Nice!`, `${msg.a.substring(7).trim()}? Fine.`,  `${msg.a.substring(7).trim()}? I guess not.`, `${msg.a.substring(7).trim()}? Sure.`, "I think so.", "I dont really know about that.", "My favorite song? Checkpoints by Nitro Fun & Hyper Potions.", "Nice try.", "Don't.", "Yes.", "Why?"];
  var randomresponse = element[Math.floor(Math.random() * element.length)];
  var cfolders = "(hidden)";
  const string = msg.a.substring(9).trim()
  const result = reverseString(string);
  const number = msg.a.substring(12).trim()
  function makeid(length) {
    var result = '';
    var characters = ['abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()[]{}~`Â´|/?;:><-_+=Ã§ÃªÃ©Ã¨ÃˆÃ‰ÃŠÃ¡ÃÃ Ã€Ã£ÃƒÃ¢Ã‚Ã«Ã‹Ã¤Ã„ÃºÃ¹Ã™ÃšÃ¼Ãœ'];
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
  const codelangs = [
    "APL",
    "C",
    "C#",
    "C++",
    "Python",
    "pygame",
    "Brainfuck",
    "CSS",
    "JavaScript",
    "Ruby",
    "Node.JS",
    "JSON",
    "Asterisk",
    "Clojure",
    "ClojureScript",
    "Java",
    "Embedded JavaScript",
    "Embedded Ruby",
    "Modelica",
    "PowerShell",
    "Q",
    "R",
    "D",
    "F#",
    "Z#",
    "TypeScript",
    "TypeScript-JSX"
  ]
  var rct = codelangs[Math.floor(Math.random() * codelangs.length)]
  var commands = ["help", "crownholderid", "systeminfo", "follow", "roominfo", "rules", "codetype", "discord"];
  var admincmds = ["//js, //sayraw, //kickban, //unban, //givecrown"];
  var noperms = "âŽ You don't have permission to use this command.";
  var perms = "âœ… You have permission to use this command.";
  if (cmd === "//js") {
    if (isAdmins) {
      var input = msg.a.split(" ").slice(1).join(" ");
      if (!input) {
        return sendChat(run(input))
      }
      sendChat(run(input))
    } else {
      sendChat(`âŽ You don't have permission to use this command.`)
    }
  }
  if (cmd === ">") {
    if (isAdmins) {
      var input = msg.a.split(" ").slice(1).join(" ");
      if (!input) {
        return sendChat(run(input))
      }
      sendChat(run(input))
    } else {
      sendChat(`âŽ You don't have permission to use this command.`)
    }
  }
  if (cmd === "//sayraw") {
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
   if (cmd === "//stringtest") {
    if (isAdmins) {
     	sendChat(perms)
        sendChat(makeid(10))
  } else {
    sendChat(noperms + " Also, this command generates 10 characters.")
  }
}
	if (cmd === "//reverse" | cmd === "//esrever") {
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
if (cmd === "//kickban") {
	if (isAdmins) {
		if (args.length == 0) {
	sendChat("Usage: //kickban (id) | Duration of kickban is 5 hours.");
} else {
		MPP.client.sendArray([{m: 'kickban', ms: 18000000, _id: `${msg.a.substring(9).trim()}`}]);
		sendChat("");
	}
		} else {
			sendChat("âŽ You don't have permission to use this command.")
  }
}
if (cmd === "//unban") {
if (isAdmins) {
if (args.length == 0) {
	sendChat("Usage: //unban (id) | Unbans people. Huh.");
} else {
		MPP.client.sendArray([{m: 'unban', ms: 18000000, _id: `${msg.a.substring(7).trim()}`}]);
		sendChat("Unbanned.");
	}
		} else {
			sendChat("âŽ You don't have permission to use this command.")
  }
}
       if (cmd == "//givecrown") {
					if (isAdmins) {
            if (args.length == 0) {
              sendChat("Usage: //givecrown (id)");
            } else {
            MPP.client.sendArray([{m: 'chown', id: msg.a.substring(11).trim()}])
            MPP.chat.send("Done.");
            }
        } else {
         sendChat("âŽ You don't have permission to use this command.")
       }
    }
  if (cmd === "//color") {
    var input = msg.a.split(" ").slice(1).join(" ");
      if (args.length == 0) {
        sendChat(`${msg.p.color}`)
      } else {
        var targetfrommsg = MPP.client.findParticipantByName[input]; {
      sendChat(`[${targetfrommsg._id}] ${targetfrommsg.name}'s color is ${targetfrommsg.color}`)
    }
  }
}
  if (cmd === "//id") {
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
  if (cmd === "//crownholderid") {
    sendChat(`${MPP.client.channel.crown.participantId}`);
  }
  if (cmd === "//codetype") {
    sendChat(`${rct}`);
  }
  if (cmd === "//roominfo") {
    sendChat(`Room Info | Room Name: ${MPP.client.channel._id} | Room User Limit: ${MPP.client.channel.settings.limit} | BG Colors: 1. ${MPP.client.channel.settings.color} 2. ${MPP.client.channel.settings.color2} | Chat is Enabled: ${MPP.client.channel.settings.chat} | Room is visible: ${MPP.client.channel.settings.visible} | Crown Holder _ID: ${MPP.client.channel.crown.participantId}`);
  }
  if (cmd === "//discord") {
    if (args.length == 0) {
      sendChat("Usage: //discord");
    } else {
      sendChat('https://discord.gg/EvdhTZxN');
    }
  }
  if (cmd === "//rules") {
  if (args.length == 0) {
      sendChat("Usage: rules");
    } else {
      sendChat('Dont Be Rude, Dont be racist / homophobic, NSFW is fine, Just dont make people uncomfortable, [looking at you, misty.], Be the bigger person, dont fight with people, Dont claim your the owner, Dont Impersonate,');
    }
  }
  if (cmd === "//help") {
    var cmds = "//" + commands[0];
    for (i = 1; i < commands.length; i++) {
      cmds += ", //" + commands[i];
    }
    sendChat("Normal commands are: " + cmds);
    sendChat("Admin commands are: " + admincmds);
  }
});
MPP.chat.send(`${botName} is Online! âœ…`);