// ==UserScript==
// @name         MooMoo.io Bot
// @namespace    https://greasyfork.org
// @version      1.2
// @description  Bot para MooMoo.io que segue o jogador principal e pode gerar mais bots usando comandos de chat.
// @author       EmersonxD
// @license      MIT
// @match        https://moomoo.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465530/MooMooio%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/465530/MooMooio%20Bot.meta.js
// ==/UserScript==

(function() {
    const MooMoo = (function() {}) [69];
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
    const COMMAND_NAME_DISCONNECT = "disconnect";
    const COMMAND_RESPONSE_SEND = "sending 4 more bots...";
    const COMMAND_RESPONSE_DISCONNECT = "disconnecting bots...";
    const BOT_COUNT_TO_ADD = 4;
    const IP_LIMIT = 4;
    const BOT_COUNT = 3;

    let botManager = MooMoo.BotManager;
    let commandManager = MooMoo.CommandManager;
    commandManager.setPrefix(COMMAND_PREFIX);

    /**
     * Generate a bot and add it to the bot manager
     * @param {BotManager} botManager - The bot manager to add the bot to
     */
    function generateBot(botManager) {
        let bot = new MooMoo.Bot(true, {
            name: BOT_NAME,
            skin: BOT_SKIN,
            moofoll: BOT_MOOFOLL
        });

        bot.addEventListener(BOT_CONNECT_EVENT, () => {
            bot.spawn();
        });

        bot.addEventListener(BOT_PACKET_EVENT, (event) => {
            if (event.packet === "11") {
                bot.spawn();
            }
        });

        let { region, index } = MooMoo.ServerManager.extractRegionAndIndex();
        bot.join([region, index]);
        botManager.addBot(bot);

        setInterval(() => {
            if (!bot.x || !bot.y) return;
            let angle = Math.atan2(MooMoo.myPlayer.y - bot.y, MooMoo.myPlayer.x - bot.x);
            bot.sendPacket(BOT_POSITION_UPDATE_PACKET, angle);
        }, BOT_POSITION_UPDATE_INTERVAL);
    }

    // Add event listener to generate bots when a packet is received
    MooMoo.addEventListener(BOT_PACKET_EVENT, () => {
        if (MooMoo.myPlayer && botManager._bots.size < BOT_COUNT) {
            generateBot(botManager);
        }
    });

    // Register chat commands to generate and disconnect bots
    commandManager.registerCommand(COMMAND_NAME_SEND, (command, args) => {
        command.reply(COMMAND_RESPONSE_SEND);
        for (let i = 0; i < BOT_COUNT_TO_ADD; i++) {
            generateBot(botManager);
        }
    });

    commandManager.registerCommand(COMMAND_NAME_DISCONNECT, (command, args) => {
        command.reply(COMMAND_RESPONSE_DISCONNECT);
        botManager._bots.forEach(bot => {
            bot.ws.close();
        });
        botManager._bots.clear();
    });

    console.log("MooMoo.io Bot is running!");
})();