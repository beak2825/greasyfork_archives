// ==UserScript==
// @name         MooMoo.io SLASHER Bots
// @version      1.1
// @description  SLASHER bots
// @author       | API by SLASHER moomo.io | Main work by Raf | Link: https://discord.gg/SB3DP6pp
// @match        *://*.moomoo.io/*
// @require       https://greasyfork.org/scripts/456235-moomoo-js/code/MooMoojs.js?version=1144167
// @run-at       document-end
// @icon https://moomoo.io/img/favicon.png?v=1
// @grant        none
// @namespace https://greasyfork.org/users/
// @downloadURL https://update.greasyfork.org/scripts/462997/MooMooio%20SLASHER%20Bots.user.js
// @updateURL https://update.greasyfork.org/scripts/462997/MooMooio%20SLASHER%20Bots.meta.js
// ==/UserScript==
/*
Support us on social media (follow and leave a star)

Discord: https://discord.gg/SB3DP6pp
// @license MIT
Features:

Bots can:

heal
upgrade
attack
Join a clan
Leave a clan
Disconnect
Follow a set coordinate or your player.


*/
// https://moomooforge.github.io/MooMoo.js/
const MooMoo = (function () {})[69];
function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const item = arr[randomIndex];
    return item;
}
var chosenBotItem
// New variables
var botTarget = true
var botTargetX
var botTargetY
var Combat = false
var attackPlayer = false
var TargetTeam
var ConnectedBots = 0

const botNames = ["EVIL","BLACK","BIG","UGLY","UR","MY","EZ","XXX","HARD","DIFFERENT","WORRIED","MAD","SUCKing","CUTE!!","TOUCH","CRAZY","SOFT","HOT","SMALL","HARD","ANGRY","HALLAL","POOR","RICH","SAUVAGE","GERMAN","JERK OFF","FCK","LONG","GRINGE","DUMP","BLOODY","FROZEN","ACID"]
const botLastNames = ["Slasher","SLASHer"]
const botColors = [6]

const BOT_NAME = "Slasher bot";
const BOT_SKIN = 1;
const BOT_MOOFOLL = true;
const BOT_CONNECT_EVENT = "connected";
const BOT_PACKET_EVENT = "packet";
const BOT_JOIN_REGION_INDEX = "join";
const BOT_POSITION_UPDATE_INTERVAL = 100;
const BOT_POSITION_UPDATE_PACKET = "33";
const COMMAND_PREFIX = "/";
const COMMAND_NAME_SEND = "send";
const COMMAND_NAME_DISCONECT = "disconnect";
const COMMAND_NAME_POS = "pos";
const COMMAND_NAME_CHOOSE = "choose";
const COMMAND_NAME_TOGGLE = "toggle";
const COMMAND_NAME_ATTACK = "attack";
const COMMAND_NAME_JOIN = "join";
const COMMAND_NAME_LEAVE = "leave";
const COMMAND_NAME_PLAYER_COMBAT = "combat";
const COMMAND_NAME_PLAYER_DEFEND = "defend";
const COMMAND_RESPONSE_SEND = "bots are comig heh...";
const COMMAND_RESPONSE_DISCONNECT = "bye bye bots...";
const BOT_COUNT_TO_ADD = 4;
const IP_LIMIT = 4;
const BOT_COUNT = IP_LIMIT - 1;


const botManager = MooMoo.BotManager;
let CommandManager = MooMoo.CommandManager;
let activePlayerManager = MooMoo.ActivePlayerManager;
let players = activePlayerManager.players;

CommandManager.setPrefix(COMMAND_PREFIX);

class Bot {
    static generateBot(botManager) {
        const chosenbotName = getRandomItem(botNames)
        const chosenbotLname = getRandomItem(botLastNames)
        const chosenbotColor = getRandomItem(botColors)
        const bot = new botManager.Bot(true, {
            name: chosenbotName + " " + chosenbotLname,
            skin: chosenbotColor,
            moofoll: BOT_MOOFOLL
        });
        bot.addEventListener(BOT_CONNECT_EVENT, server => {
            bot.spawn();
            bot.ws.addEventListener("message", ({ data }) => {
                const packet = MooMoo.msgpack.decode(new Uint8Array(data))
                let packetID = packet[0]
                let [type, [...args]] = packet;
                if (type == "io-init") {
                    bot.weapons = [0];
                    bot.mats = [0, 3, 6, 10];
                    bot.secondary = null;
                    bot.primary = 0;
                    bot.foodType = 0;
                    bot.wallType = 3;
                    bot.spikeType = 6;
                    bot.millType = 10;
                    bot.boostType = null;
                    bot.mineType = null;
                    bot.turretType = null;
                    bot.spawnpadType = null;
                }
                if (type == "17") {
                    if (args[2]) {
                        bot.weapons = args[1];
                        bot.primary = args[1][0];
                        bot.secondary = args[1][1] || null;
                    } else {
                        bot.mats = args[1];
                        for (let i = 0; i < args[1].length; i++) {
                            for (let i2 = 0; i2 < 3; i2++) {
                                if (i2 == args[1][i]) {
                                    bot.foodType = args[1][i];
                                }
                            }
                            for (let i2 = 3; i2 < 6; i2++) {
                                if (i2 == args[1][i]) {
                                    bot.wallType = args[1][i];
                                }
                            }
                            for (let i2 = 6; i2 < 10; i2++) {
                                if (i2 == args[1][i]) {
                                    bot.spikeType = args[1][i];
                                }
                            }
                            for (let i2 = 10; i2 < 13; i2++) {
                                if (i2 ==args[1][i]) {
                                    bot.millType = args[1][i];
                                }
                            }
                            for (let i2 = 13; i2 < 15; i2++) {
                                if (i2 == args[1][i]) {
                                    bot.mineType = args[1][i];
                                }
                            }
                            for (let i2 = 15; i2 < 17; i2++) {
                                if (i2 == args[1][i]) {
                                    bot.boostType = args[1][i];
                                }
                            }
                            for (let i2 = 17; i2 < 23; i2++) {
                                if (i2 == args[1][i] && i2 !== 20) {
                                    bot.turretType = args[1][i];
                                }
                                if (i2 == args[1][i] && i2 == 20) {
                                    bot.spawnpadType = args[1][i];
                                }
                            }
                        }
                    }
                }
                if (type == "1" && bot.sid == undefined) {
                    bot.sid = args[0];
                }
                if (type == "ch") {
                    let [sid, message] = args;
                    if (message.toLowerCase() == "bad" || message.toLowerCase() == "trash" || message.toLowerCase() == "loser" || message.toLowerCase() == "hacks" || message.toLowerCase() == "imagine hacking" || message.toLowerCase() == "so bad" || message.toLowerCase() == "ez"){
                        const possibleMessages = ["L + ratio + stay mad", "Ok and?", "Deal with it kid" , "Didn't ask; Don't care", "Keep crying", "Skill issue lol", "Nobody cares", "Code your own nerd", "Mad cuz Bad", "Insults won't stop us", "Yeah whatvever, hacking's fun"]
                        const result = getRandomItem(possibleMessages)
                        bot.sendPacket("ch", result)
                    }
                    if (message.toLowerCase() == "how" || message.toLowerCase() == "what mod" || message.toLowerCase() == "what script" || message.toLowerCase() == "share" || message.toLowerCase() == "what hack" || message.toLowerCase() == "what mod?"){
                        const possibleMessages = ["Hacks", "my own Bots mod", " SLASHER creat " , "Edit on worthless bots mod", "Beggars be like:", "try again later"]
                        const result = getRandomItem(possibleMessages)
                        bot.sendPacket("ch", result)
                    }
                    if (message.toLowerCase() == "lmao" || message.toLowerCase() == "wtf" || message.toLowerCase() == "lmfao" || message.toLowerCase() == "tf" || message.toLowerCase() == "omg" || message.toLowerCase() == "how tf" || message.toLowerCase() == "omfg" || message.toLowerCase() == "wth"){
                        const possibleMessages = ["Get used to it", "SLASHER bots are on top!", "We're unforgetable" , "Potato mod bots but worse:", "Welcome to heaven", "SLASHER bots in town...", "MooMoo.io in Ohio be like:", "Imagine not hacking it's fun", "MooMoo: 2B2T of .io games"]
                        const result = getRandomItem(possibleMessages)
                        bot.sendPacket("ch", result)
                    }
                }
                if (type == "16") {
                    bot.xp = args[0];
                    bot.age = args[1];
                    let [xp, age] = args;
                    if (bot.age === 2) {
                        if (chosenBotItem == "sword") {
                            bot.sendPacket("6", 3)
                        }
                        if (chosenBotItem == "polearm") {
                            bot.sendPacket("6", 5)
                        }
                        if (chosenBotItem == "bat") {
                            bot.sendPacket("6", 6)
                        }
                        if (chosenBotItem == "dagger") {
                            bot.sendPacket("6", 7)
                        }
                        if (chosenBotItem == "stick") {
                            bot.sendPacket("6", 8)
                        }
                        if (chosenBotItem == "axe") {
                            bot.sendPacket("6", 1)
                        }
                    }
                    if (bot.age === 3) {
                        bot.sendPacket("6", 20)
                    }
                    if (bot.age === 4) {
                        bot.sendPacket("6", 31)
                    }
                    if (bot.age === 5) {
                        bot.sendPacket("6", 23)
                    }
                    if (bot.age === 6) {
                        bot.sendPacket("6", 11)
                    }
                }
                if (type == "h") {
                    let [sid, health] = args;
                    if (bot.sid === sid && health < 100 && health > 0) {
                        if (Combat == true) {
                            let myPlayer = MooMoo.myPlayer;
                            setTimeout(()=> {
                                bot.sendPacket("5", 0, false)
                                bot.sendPacket("c", 1, myPlayer.dir)
                                bot.sendPacket("c", 0, myPlayer.dir)
                                bot.sendPacket("5", 0, true)
                            }, 100)
                        } else if(bot.sid === sid && health > 0) {
                            bot.spawn();
                        }
                    }
                }
            })
        })
        bot.addEventListener(BOT_PACKET_EVENT, packetargs => {
            if (packetargs.packet === "11") bot.spawn();
        });
        const { region, index } = MooMoo.ServerManager.extractRegionAndIndex();
        bot[BOT_JOIN_REGION_INDEX]([region, index]);
        botManager.addBot(bot);
        // If the the botTarget variable is true, bots will move to player
        setInterval(() => {
            if (!bot.x || !bot.y) return;
            if (botTarget == false && attackPlayer == false) {
                let myPlayer = MooMoo.myPlayer
                const playerAngle = Math.atan2(botTargetY - bot.y, botTargetX - bot.x);
                let playerBotD = MooMoo.UTILS.getDistanceBetweenTwoPoints(botTargetX, botTargetY, bot.x, bot.y);
                if (playerBotD > 200) {
                    setTimeout(() => {
                        bot.sendPacket(BOT_POSITION_UPDATE_PACKET, playerAngle);
                        bot.sendPacket("2" , playerAngle)
                    }, 50)
                } else {
                    setTimeout(() => {
                        bot.sendPacket("33", null)
                    }, 50)
                }
                if (Combat == true) {
                    setTimeout(() => {
                        bot.sendPacket("c", 1, playerAngle)
                    }, 100)
                }
                if (Combat == false) {
                    setTimeout(() => {
                        bot.sendPacket("c", 0, playerAngle)
                    }, 100)
                }
            }
        }, BOT_POSITION_UPDATE_INTERVAL);
        setInterval(() => {
            if (botTarget == true && attackPlayer == false) {
                const playerAngle = Math.atan2(MooMoo.myPlayer.y - bot.y, MooMoo.myPlayer.x - bot.x);
                let playerBotD = MooMoo.UTILS.getDistanceBetweenTwoPoints(MooMoo.myPlayer.x, MooMoo.myPlayer.y, bot.x, bot.y);
                if (playerBotD > 200) {
                    setTimeout(() => {
                        bot.sendPacket(BOT_POSITION_UPDATE_PACKET, playerAngle);
                        bot.sendPacket("2" ,playerAngle)
                    }, 50)
                } else {
                    setTimeout(() => {
                        bot.sendPacket("33", null)
                    }, 50)
                }
                if (Combat == true) {
                    setTimeout(() => {
                        bot.sendPacket("c", 1, playerAngle)
                    }, 100)
                }
                if (Combat == false) {
                    setTimeout(() => {
                        bot.sendPacket("c", 0, playerAngle)
                    }, 100)
                }
            }
        }, BOT_POSITION_UPDATE_INTERVAL);
        setInterval(() => {
            if (botTarget == true && attackPlayer == true) {
                let nearestEnemy = activePlayerManager.getClosestEnemy();
                const playerAngle = Math.atan2(nearestEnemy.y - bot.y, nearestEnemy.x - bot.x)
                setTimeout(() => {
                    bot.sendPacket(BOT_POSITION_UPDATE_PACKET, playerAngle);
                    bot.sendPacket("2" ,playerAngle)
                }, 50)
                if (Combat == true) {
                    setTimeout(() => {
                        bot.sendPacket("c", 1, playerAngle)
                    }, 100)
                }
                if (Combat == false) {
                    setTimeout(() => {
                        bot.sendPacket("c", 0, playerAngle)
                    }, 100)
                }
            }
        }, BOT_POSITION_UPDATE_INTERVAL);
        setInterval(() => {
            if (botTarget == true && attackPlayer == true) {
                let nearestEnemy = activePlayerManager.getClosestEnemy();
                const playerAngle = Math.atan2(nearestEnemy.y - bot.y, nearestEnemy.x - bot.x)
                setTimeout(() => {
                    bot.sendPacket(BOT_POSITION_UPDATE_PACKET, playerAngle);
                    bot.sendPacket("2" ,playerAngle)
                }, 50)
                if (Combat == true) {
                    setTimeout(() => {
                        bot.sendPacket("c", 1, playerAngle)
                    }, 100)
                }
                if (Combat == false) {
                    setTimeout(() => {
                        bot.sendPacket("c", 0, playerAngle)
                    }, 100)
                }
            }
        }, BOT_POSITION_UPDATE_INTERVAL);
    }
}

MooMoo.addEventListener(BOT_PACKET_EVENT, () => {
    if (MooMoo.myPlayer) {
        if (botManager._bots.size < BOT_COUNT) {
            Bot.generateBot(botManager);
            ConnectedBots += 1
        }
    }
});

CommandManager.registerCommand(COMMAND_NAME_SEND, (Command, args) => {
    Command.reply(COMMAND_RESPONSE_SEND);
    for (let i = 1; i <= BOT_COUNT_TO_ADD; i++) {
        Bot.generateBot(botManager)
        ConnectedBots += 1
    }
});
CommandManager.registerCommand(COMMAND_NAME_POS, (Command, args) => {
    // Sets the arguments to the bot's target x and y coords.
    botTargetX = args[0];
    botTargetY = args[1];
    Command.reply("Bot_Target_Coords: " + (botTargetX) + ", " + (botTargetY))
})
CommandManager.registerCommand(COMMAND_NAME_CHOOSE, (Command, args) => {
    chosenBotItem = args[0]
    Command.reply("Bots_Choose: " + (chosenBotItem))
})
CommandManager.registerCommand(COMMAND_NAME_JOIN, (Command, args) => {
    let Name = args[0];
    TargetTeam = Name
    botManager._bots.forEach(bot => {
        bot.sendPacket("10", (Name))
    });
    Command.reply("Bots Joining: " + (Name))
})
CommandManager.registerCommand(COMMAND_NAME_LEAVE, (Command, args) => {
    botManager._bots.forEach(bot => {
        bot.sendPacket("9")
    });
    Command.reply("Bots leaving clan...")
})
CommandManager.registerCommand(COMMAND_NAME_TOGGLE, (Command, args) => {
    if (botTarget == true) {
        botTarget = false
    } else {
        botTarget = true
    }
    Command.reply("Follow_Player: " + (botTarget) )
})
CommandManager.registerCommand(COMMAND_NAME_PLAYER_COMBAT, (Command, args) => {
    if (Combat == true) {
        Combat = false
    } else{
        Combat = true
    }
    Command.reply("Bot_in_combat: " + (Combat) )
})
CommandManager.registerCommand(COMMAND_NAME_ATTACK, (Command, args) => {
    if (attackPlayer == true) {
        attackPlayer = false
    } else {
        attackPlayer = true
    }
    Command.reply("Attack_Near_Player: " + (attackPlayer) )
})
CommandManager.registerCommand(COMMAND_NAME_DISCONECT, (Command, args) => {
    Command.reply(COMMAND_RESPONSE_DISCONNECT);
    botManager._bots.forEach(bot => {
        bot.ws.close();
        ConnectedBots = 0
    });
});
const setStylesS = element2 => {
    const styles2 = {
        position: "absolute",
        top: "330px",
        left: "10px",
        color: "red",
        fontFamily: "serif",
        fontSize: "20px"
    };

    Object.entries(styles2).forEach(([key, value]) => {
        element2.style[key] = value;
    });
};

const GeneralStuff2 = () => {
    const gameInfoElement2 = document.createElement("div");
    setStylesS(gameInfoElement2);
    gameInfoElement2.id = "playerPosition2";
    document.body.appendChild(gameInfoElement2);
    const Updater = () => {
        document.getElementById("playerPosition2").innerText = `Commands:
        /send, /disconnect, /toggle, /attack, /leave
                /pos (X, Y), /join (ClanName)
        -------------------------------------------------------
        BotInfo:
        Bot Target Coords: ${(botTargetX)}, ${(botTargetY)} ~ '/pos'
        Follow_Player: ${(botTarget)} ~ '/toggle'
        Toggle_Combat: ${(Combat)} ~ '/combat'
        Team_to_join: ${(TargetTeam)} ~ '/join'
        Attack_Nearest_Enemy: ${(attackPlayer)} ~ 'ArrowDown'
        ConnectedBots: ${(ConnectedBots)}`
    };

    setInterval(Updater, 100);
};
// Code to listen for key press:

GeneralStuff2();
document.addEventListener('keydown', function(e) {
    if (e.keyCode == 38 && document.activeElement.id.toLowerCase() !== 'chatbox') { // "UpArrow" to toggle menu
        if (document.getElementById('playerPosition2').hidden == true) {
            document.getElementById('playerPosition2').hidden = false
        } else {
            document.getElementById('playerPosition2').hidden = true
        }
    }
    if (e.keyCode == 40 && document.activeElement.id.toLowerCase() !== 'chatbox') { // "DownArrow" to toggle bot fight mode
        if (attackPlayer == true) {
            attackPlayer = false
            botManager._bots.forEach(bot => {
                bot.sendPacket("ch", "YES SIR ///.../// RETREAT!")
            });
        } else {
            attackPlayer = true
            botManager._bots.forEach(bot => {
                bot.sendPacket("ch", "Welcome to HEAVEN!")
            });
        }
        let myPlayer = MooMoo.myPlayer
        MooMoo.sendPacket("ch", "Attack_Near_Player: " + (attackPlayer) )
    }
});