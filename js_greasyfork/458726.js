// ==UserScript==
// @name         MooMoo.io gold bots
// @version      1.2.3
// @description  creates bots moving to you
// @author       Nuro
// @match        *://*.moomoo.io/*
// @require      https://greasyfork.org/scripts/456235-moomoo-js/code/MooMoojs.js?version=1159501
// @run-at       document-end
// @grant        none
// @namespace    https://greasyfork.org/users/761829
// @downloadURL https://update.greasyfork.org/scripts/458726/MooMooio%20gold%20bots.user.js
// @updateURL https://update.greasyfork.org/scripts/458726/MooMooio%20gold%20bots.meta.js
// ==/UserScript==
/*
Support us on social media (follow and leave a star)

GitHub: https://moomooforge.github.io/MooMoo.js/
Author: https://github.com/NuroC
YouTube: https://www.youtube.com/@literallynuro
Discord: https://discord.gg/NMS3YR9Q5R

*/
// https://moomooforge.github.io/MooMoo.js/
const MooMoo = (function () {})[69];

// New variables
const BOT_NAME = "Nuro";
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
const COMMAND_RESPONSE_SEND = "sending 4 more bots...";
const COMMAND_RESPONSE_DISCONNECT = "disconnecting bots...";
const BOT_COUNT_TO_ADD = 4;
const IP_LIMIT = 4;
const BOT_COUNT = IP_LIMIT - 1;


const botManager = MooMoo.BotManager;
let CommandManager = MooMoo.CommandManager;

CommandManager.setPrefix(COMMAND_PREFIX);

class Bot {
    static generateBot(botManager) {
        const bot = new botManager.Bot(true, {
            name: BOT_NAME,
            skin: BOT_SKIN,
            moofoll: BOT_MOOFOLL
        });
        bot.addEventListener(BOT_CONNECT_EVENT, server => {
            bot.spawn();
        });
        bot.addEventListener(BOT_PACKET_EVENT, packetData => {
            if (packetData.packet === "11") bot.spawn();
        });
        const { region, index } = MooMoo.ServerManager.extractRegionAndIndex();
        bot[BOT_JOIN_REGION_INDEX]([region, index]);
        botManager.addBot(bot);
        setInterval(() => {
            if (!bot.x || !bot.y) return;
            const playerAngle = Math.atan2(MooMoo.myPlayer.y - bot.y, MooMoo.myPlayer.x - bot.x);
            bot.sendPacket(BOT_POSITION_UPDATE_PACKET, playerAngle);
        }, BOT_POSITION_UPDATE_INTERVAL);
    }
}

MooMoo.addEventListener(BOT_PACKET_EVENT, () => {
    if (MooMoo.myPlayer) {
        if (botManager._bots.size < BOT_COUNT) {
            Bot.generateBot(botManager);
        }
    }
});

CommandManager.registerCommand(COMMAND_NAME_SEND, (Command, args) => {
    Command.reply(COMMAND_RESPONSE_SEND);
    for (let i = 1; i <= BOT_COUNT_TO_ADD; i++) {
        Bot.generateBot(botManager)
    }
});

CommandManager.registerCommand(COMMAND_NAME_DISCONECT, (Command, args) => {
    Command.reply(COMMAND_RESPONSE_DISCONNECT);
    botManager._bots.forEach(bot => {
        bot.ws.close();
    });
});