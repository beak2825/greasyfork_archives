// ==UserScript==
// @name         Chat to Discord
// @namespace    http://tampermonkey.net/
// @version      2025-12-28
// @description  Bot for sending clan chat, raffles, and Clan Wars notifications to Discord. Also handles various commands send from clan chat.
// @author       JK_3
// @match        https://www.warzone.com/MultiPlayer?ChatRoom=1
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/517812/Chat%20to%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/517812/Chat%20to%20Discord.meta.js
// ==/UserScript==

// configure the jshint on https://greasyfork.org to prevent false positives
// jshint esversion: 11

(function() {
    'use strict';

// ----------- settings ---------------------------------------------------------------------------------------------------------------------------------------
    const HarmonySettings = {
        commands: ["whenLunch", "Texx", "WarTog"],
        commandMappings: {
            "blameTexx" : "Texx",
            "blameNarnia" : "blameJK",
            "blameAslan" : "blameJK",
            "blamePB2000" : "blameJK",
            "blamePB" : "blameJK",
            "blamePB_2000" : "blameJK",
            "SunTog": "WarTog",
            "TogTzu": "WarTog",
            "forgiveNarnia" : "forgiveJK",
            "forgiveAslan" : "forgiveJK",
            "forgivePB2000" : "forgiveJK",
            "forgivePB" : "forgiveJK",
            "forgivePB_2000" : "forgiveJK",
        },
        discordInvite: "https://discord.gg/2k7tKPFxjy",
    };

    const SettingsPerAccount = {
        "JK_3": {
            chatId: 349,
            rafflePingRole: "896488332752732200",
            memberRole: "429235159934697482",
            clanWarsPingRoles: {
                0: "866427958565404702",
                4: "866428583664287764",
                8: "866428699335196704",
                12: "866428782305869844",
                16: "866428885344190525",
                20: "866428992663453717"
            },
            clanWarsWebhook:"https://discord.com/api/webhooks/1002004325196894269/IXsUe4DrMKfGlqI3fts4J8F1nBWO5F9VamwRa9I98nVQlX4bo4uBNXD3Q78XulqbEjWP",
            chatWebhook: "https://discord.com/api/webhooks/972193878411198555/kRKtewZq7rWvtbKKPOyRRaLvg7wOcUvpv5-x3ibr2WQautBIL5rZASLHv0SLlrLhKb-9",
            doPostChatToDiscord: true,
            doPostRaffleToDiscord: true,
            doPostClanWarsToDiscord: true,
            doPostClanWarsToChat: true,
            doPostClanWarsEndOfSeason: true,
            doPostRafflesToChat: true,
            doHandleCommands: true,
            commands: ["whenSleep", "taco", "coffee", "box", "pizza", "beer", "wine"],
            commandMappings: {
                "whenWhenCommandCommand" : "whenWhenCommandCommand",
                "whenWhenHatterCommand" : "whenWhenHatterCommand",
                "WarTog": "WarTog",
                "llama": "llama",
                "lama": "llama",
                "alpaca": "llama",
                "strawberry": "strawberry",
                "strawberries": "strawberry",
                "goat": "goat",
                "whenNap": "whenSleep",
                "cofffee": "coffee",
                "cofee": "coffee",
                "coffeee": "coffee",
                "coffe": "coffee",
            },
            discordInvite: "https://discord.gg/zSKg9tbZNx",
            commandTimeout: {
                seconds: 300,
                maxActions: 5
            },
        },
        "Narnia": {
            chatId: 366,
            chatWebhook: "https://discordapp.com/api/webhooks/1203379670331166730/8h4yCuGM_VlXrxMShXPL2SMxSFscf65ZaA9HIW5ZinTrYaiadSFZXX5Gs8aWaRiVy9tV",
            doPostChatToDiscord: true,
            doPostRaffleToDiscord: false,
            doPostClanWarsToDiscord: false,
            doPostClanWarsToChat: false,
            doPostClanWarsEndOfSeason: false,
            doPostRafflesToChat: false,
            doHandleCommands: true,
            commands: HarmonySettings.commands,
            commandMappings: HarmonySettings.commandMappings,
            discordInvite: HarmonySettings.discordInvite,
            commandTimeout: HarmonySettings.commandTimeout,
        },
        "PB_2000": {
            chatId: 842,
            rafflePingRole: "1203385365340225596",
            memberRole: "844611567899377684",
            clanWarsPingRoles: {
                0: "929950159037693953",
                4: "1203410234387730482",
                8: "1203410283737907271",
                12: "1203410333197271040",
                16: "1203410414990401616",
                20: "1203410459114348544"
            },
            clanWarsWebhook:"https://discordapp.com/api/webhooks/1203379817420955648/imdn6GfDR1M3f-hbx1v8eMYIi2ORw-yFsCqYmoXPq1SrAn3zvKAgegvIlDREWkapYnBP",
            chatWebhook: "https://discord.com/api/webhooks/1307790674481119302/fSp52iS1alry_ca_YNw4tODuC6TXVMWhp4Kk8MBBEpvg1zTmI0tAr-uyIPYdb-1lVZqv",
            doPostChatToDiscord: true,
            doPostRaffleToDiscord: true,
            doPostClanWarsToDiscord: true,
            doPostClanWarsToChat: true,
            doPostClanWarsEndOfSeason: true,
            doPostRafflesToChat: false,
            doHandleCommands: true,
            commands: HarmonySettings.commands,
            commandMappings: HarmonySettings.commandMappings,
            discordInvite: HarmonySettings.discordInvite,
            commandTimeout: HarmonySettings.commandTimeout,
        },
        "Aslan": {
            chatId: -94,
            chatWebhook: "https://discord.com/api/webhooks/1325157509329326121/qv0EAC4Hv9ec2n79gCtw8m7SNe8YKisjIS4uD5dbEaNwriZrh0feoAW7dFhbkkrCU-hx",
            doPostChatToDiscord: true,
            doPostRaffleToDiscord: false,
            doPostClanWarsToDiscord: false,
            doPostClanWarsToChat: false,
            doPostClanWarsEndOfSeason: false,
            doPostRafflesToChat: false,
            doHandleCommands: true,
            commands: HarmonySettings.commands,
            commandMappings: HarmonySettings.commandMappings,
            discordInvite: HarmonySettings.discordInvite,
            commandTimeout: HarmonySettings.commandTimeout,
        },
        "Tom #2": {
            chatId: 572,
            rafflePingRole: "ADD ME",
            memberRole: "ADD ME",
            clanWarsPingRoles: {
                0: "ADD ME",
                4: "ADD ME",
                8: "ADD ME",
                12: "ADD ME",
                16: "ADD ME",
                20: "ADD ME"
            },
            chatWebhook: "https://discord.com/api/webhooks/1350955939687043183/ApNesggbXu2ioab2v2li7gDatcx9TNgqvHQb7Ov3BYTUn7omGldY1QnP-NWM3D5bsoiy",
            clanWarsWebhook: "ADD ME",
            doPostChatToDiscord: true,
            doPostRaffleToDiscord: false,
            doPostClanWarsToDiscord: false,
            doPostClanWarsToChat: false,
            doPostClanWarsEndOfSeason: false,
            doPostRafflesToChat: false,
            doHandleCommands: true,
            commands: [],
            commandMappings: {
                "blameNaN": "blameJK",
                "blameTom": "blameJK",
                "blameTom2": "blameJK",
                "blameTom#2": "blameJK",
            },
            discordInvite: "https://discord.gg/eWVWmq4BMq",
        },
        "Player1": { // For testing only
            chatId: -99,
            rafflePingRole: "ADD ME",
            memberRole: "ADD ME",
            clanWarsPingRoles: {
                0: "ADD ME",
                4: "ADD ME",
                8: "ADD ME",
                12: "ADD ME",
                16: "ADD ME",
                20: "ADD ME"
            },
            chatWebhook: "ADD ME",
            clanWarsWebhook: "ADD ME",
            doPostChatToDiscord: false,
            doPostRaffleToDiscord: false,
            doPostClanWarsToDiscord: false,
            doPostClanWarsToChat: false,
            doPostClanWarsEndOfSeason: false,
            doPostRafflesToChat: false,
            doHandleCommands: true,
            commands: ["whenSleep", "taco", "coffee", "box", "pizza", "beer", "wine"],
            commandMappings: {
                "whenWhenHatterCommand" : "whenWhenHatterCommand",
                "WarTog": "WarTog",
                "llama": "llama",
                "lama": "llama",
                "alpaca": "llama",
                "strawberry": "strawberry",
                "strawberries": "strawberry",
                "goat": "goat",
                "whenNap": "whenSleep",
                "cofffee": "coffee",
                "cofee": "coffee",
                "coffeee": "coffee",
                "coffe": "coffee",
                "SunTog": "WarTog",
                "TogTzu": "WarTog",
                "Texx": "Texx",
                "blameTexx": "Texx",
                "whenLunch": "whenLunch",
                "forgiveNarnia" : "forgiveJK",
                "forgiveAslan" : "forgiveJK",
                "forgivePB2000" : "forgiveJK",
                "forgivePB" : "forgiveJK",
                "forgivePB_2000" : "forgiveJK",
            },
            commandTimeout: {
                seconds: 120,
                maxActions: 5
            },
        }
    };

    const DefaultSettings = {
        doPostChatToDiscord: false,
        doPostRaffleToDiscord: false,
        doPostClanWarsToDiscord: false,
        doPostClanWarsEndOfSeason: false,
        doPostClanWarsToChat: true,
        doPostRafflesToChat: false,
        doHandleCommands: false,
        commands: [],
        commandMappings: {},
    };

    const TemplateAbbreviationsMap = {
        "Small Earth 1v1 Auto Dist": "SE Auto Dist",
        "Small Earth 1 wasteland" : "SE 1 Wasteland",
        "Small Earth Commander and Bomb Card" : "SE ComBomb",
        "MME Commanders LD No Cards" : "MME Com LD",
        "Multi-Attack MME Light Fog LD" : "MA MME LF LD",
    };

    const DefaultCommands = ["help", "whenCw", "lastSlot", "whenRaffle", "blameJK", "joke", "SunTzu", "Wikipedia"];
    const DefaultCommandMappings = { // "hidden" commands, if the key is triggered as command, it uses the value instead
        "nextRaffle": "whenRaffle",
        "lastRaffle": "whenRaffle",
        "wheRaffle": "whenRaffle",
        "raffleWhen": "whenRaffle",
        "whenWaffle": "whenRaffle",
        "nextWaffle": "whenRaffle",
        "lastWaffle": "whenRaffle",
        "waffleWhen": "whenWaffle",
        "whenWafaffle": "whenRaffle",
        "nextWafaffle": "whenRaffle",
        "lastWafaffle": "whenRaffle",
        "wafaffleWhen": "whenRaffle",
        "nextRaf": "whenRaffle",
        "nextWaf": "whenRaffle",
        "whenRaf": "whenRaffle",
        "whenWaf": "whenRaffle",
        "nextCw": "whenCw",
        "nextCwSlot": "whenCw",
        "nextSlot": "whenCw",
        "whenClanWar": "whenCw",
        "nextClanWar": "whenCw",
        "whenClanWarSlot": "whenCw",
        "whenClanWarsSlot": "whenCw",
        "nextClanWarSlot": "whenCw",
        "nextClanWarsSlot": "whenCw",
        "clanWarTime": "whenCw",
        "clanWarsTime": "whenCw",
        "clanWarSlotTime": "whenCw",
        "clanWarsSlotTime": "whenCw",
        "lastCw": "lastSlot",
        "lastCwSlot": "lastSlot",
        "lastClanWar": "lastSlot",
        "previousClanWar": "lastSlot",
        "lastClanWarSlot": "lastSlot",
        "lastClanWarsSlot": "lastSlot",
        "previousClanWarSlot": "lastSlot",
        "previousClanWarsSlot": "lastSlot",
        "previousSlot": "lastSlot",
        "dadjoke": "joke",
        "command": "help",
        "wiki": "Wikipedia",
        "blameFizzer": "blameFizzer",
        "__uptime": "uptime",
        "blame": "blameJK",
        "blameJ": "blameJK",
        "blameJK3": "blameJK",
        "blameJK_3": "blameJK",
        "__stats": "analytics",
        "Ferengi": "Ferengi",
        "__runAsCode": "runAsCode",
        "forgiveJK": "forgiveJK",
        "forgive": "forgiveJK",
        "forgiveJ": "forgiveJK",
        "forgiveJK_3": "forgiveJK",
        "panic": "panic",
    };
    const MaxCWTimeSlotNameRetries = 30;
    const MaxChatIdleTimeMinutes = 35;
    const MaxClanChatIdleTimeMinutes = 90;
    const RebootCheckTimeSeconds = 15;
    const PingTimeSeconds = 120;
    const MaxPageLoadingTimeSeconds = 30;
    const BotMessageIndicator = "•••";
    const CommandPrefix = "!";
    const ClanChatMessageSendTimeMS = 500;
    const DefaultPlayerName = "Warzone System";
    const HoursBetweenClanWarsSlots = 4;
    const GlobalChatId = 0;
    const MaximumMessageLength = 254;
    const DiscordMessageSendTimeMS = 750;
    const DiscordLoggingWebhook = "https://discord.com/api/webhooks/1452335198363717716/GK6hZBaNKd0yrR-Sn9HS_ExIrudfwBB7nuQTJ_d88-uZm3p5TFz5pwgerKcVO2SYM4pp";
    const BotAdminRole = "1452337030095704289";
    const DaysOfLoggingToKeep = 25;

// ------------ Global variables ------------------------------------------------------------------------------------------------------------------------------
    var previousClanUser;
    var previousClanMessage;
    var previousGlobalUser;
    var previousGlobalMessage;
    var lastClanChatMessageTime;
    var lastMessageInAnyChatTime;
    var settings;
    var currentlyLoggedInUser;
    var startupDateTime;
    var messageToIgnore = "";
    var commands = [];
    var hiddenCommands = {};
    var lowercaseCommands = [];
    var chatMessageBuffer = [];
    var commandUsagePerPlayer = {};
    var activeCommandTimeoutWarningPerPlayer = {};
    var discordMessageBuffer = [];
    const ChatObserverConfig = { attributes: true, childList: true, subtree: true };
    const SecondsToMs = 1000;
    const MinutesToMs = 60 * SecondsToMs;
    const HoursToMs = 60 * MinutesToMs;
    const DaysToMs = 24 * HoursToMs;
    const LastRaffleTimeKey = "StorageKey_LastRaffleTime";
    const CurrentClanWarsSlotUrlKey = "StorageKey_CurrentClanWarsSlotUrl";
    const LastClanWarsSlotUrlKey = "StorageKey_LastClanWarsSlotUrl";
    const CommandAnalyticsKey = "StorageKey_CommandAnalytics";
    const CommandAnalyticsTotalKey = "!_TotalKey_CommandAnalytics"; // Starts with ! so it comes first as sorting
    const ScriptStorageVersionNumberKey = "StorageKey_VersionNumber";
    const WhenCommandCommand = "whenwhencommandcommand";
    const LocalStorageLoggingKey = "LocalStorageKey_LoggedMessages";

// ------------ Logging functions -----------------------------------------------------------------------------------------------------------------------------
    class LogMessage {
        constructor(level, message, dateTime = undefined) {
            this.dateTime = dateTime ?? new Date();
            this.level = level;
            this.message = message;
        }

        static fromData(data) {
            return new LogMessage(data.level, data.message, new Date(data.dateTime));
        }

        get data() {
            return {
                dateTime: this.dateTime,
                level: this.level,
                message: this.message
            };
        }

        get displayText() {
            return `${LogMessage.#formatDate(this.dateTime)} [${this.level}] ${this.message}`;
        }

        print() {
            switch (this.level) {
                case Logger.LogLevelDebug: return console.debug(this.displayText);
                case Logger.LogLevelInfo: return console.info(this.displayText);
                case Logger.LogLevelWarning: return console.warn(this.displayText);
                case Logger.LogLevelError: return console.error(this.displayText);
                default: return console.error("UNKNOWN LEVEL", this.level, ":", this.displayText);
            }
        }

        static #formatDate(dateTime) {
            let year = dateTime.getFullYear();
            let month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
            let day = dateTime.getDate().toString().padStart(2, "0");
            let hour = dateTime.getHours().toString().padStart(2, "0");
            let minute = dateTime.getMinutes().toString().padStart(2, "0");
            let second = dateTime.getSeconds().toString().padStart(2, "0");
            let millisecond = (dateTime.valueOf() % SecondsToMs).toFixed().padStart(3, "0");
            return `${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond}`;
        }
    }

    class Logger {
        static get LogLevelDebug() { return "DEBUG"; }
        static get LogLevelInfo() { return "INFO"; }
        static get LogLevelWarning() { return "WARNING"; }
        static get LogLevelError() { return "ERROR"; }

        static debug(message) {
            console.debug(message);
            let logMessage = new LogMessage(Logger.LogLevelDebug, message);
            this.#storeLogToInLocalStorage(logMessage);
        }

        static info(message) {
            console.info(message);
            let logMessage = new LogMessage(Logger.LogLevelInfo, message);
            this.#storeLogToInLocalStorage(logMessage);
            this.#sendLogToDiscord(logMessage);
        }

        static warn(message) {
            console.warn(message);
            let logMessage = new LogMessage(Logger.LogLevelWarning, message);
            this.#storeLogToInLocalStorage(logMessage);
            this.#sendLogToDiscord(logMessage);
        }

        static error(message) {
            console.error(message);
            let logMessage = new LogMessage(Logger.LogLevelError, message);
            this.#storeLogToInLocalStorage(logMessage);
            this.#sendLogToDiscord(logMessage, true);
        }

        static #sendLogToDiscord(logMessage, pingBotAdmin = false) {
            let postData = {
                username: "Ctd Bot: " + currentlyLoggedInUser,
                content: pingBotAdmin ? `<@&${BotAdminRole}> ${logMessage.displayText}` : logMessage.displayText,
                allowed_mentions: {roles: [BotAdminRole]}
            };

            fetch(DiscordLoggingWebhook, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData),
                keepalive: true,
            }).then(res => {if (!res.ok) console.error(res); });
        }

        static #storeLogToInLocalStorage(logMessage) {
            let storageData = JSON.parse(localStorage.getItem(LocalStorageLoggingKey) ?? "[]");
            storageData.push(logMessage.data);
            localStorage.setItem(LocalStorageLoggingKey, JSON.stringify(storageData));
        }

        static getLogsFromLocalStorage() {
            let storageData = JSON.parse(localStorage.getItem(LocalStorageLoggingKey) ?? "[]");
            return storageData.map(LogMessage.fromData);
        }


        // Note to self: cannot use 'this' in exported functions
        static printLogs() {
            Logger.getLogsFromLocalStorage().forEach(l => l.print());
        }

        static deleteOldLogs(daysToKeep = DaysOfLoggingToKeep) {
            let oldLogTreshold = daysToKeep * DaysToMs;
            let now = Date.now();
            let originalLogs = Logger.getLogsFromLocalStorage();
            let filteredLogs = originalLogs.filter(l => now - l.dateTime < oldLogTreshold);
            localStorage.setItem(LocalStorageLoggingKey, JSON.stringify(filteredLogs));
            let countDeletedLogs = originalLogs.length - filteredLogs.length;
            Logger.debug(`deleted ${countDeletedLogs}/${originalLogs.length}`);
        }
    }

    // Use unsafeWindow to make it available in the regular browser console
    unsafeWindow.getLogsFromLocalStorage = Logger.getLogsFromLocalStorage;
    unsafeWindow.printLogs = Logger.printLogs;
    unsafeWindow.deleteOldLogs = Logger.deleteOldLogs;

// ------------ Helper functions ------------------------------------------------------------------------------------------------------------------------------
    function getTabIndex(chatId) {
        return Array.from(document.getElementById("ujs_TabsContainer")?.children)
            .map(tabElement => tabElement.id.replace("_TabPlaceholder", "")) // id is either ujs_TabPlaceholder_TabData_{id} or ujs_TabData_{id}
            .map(tabId => parseInt(tabId.slice(12)))
            .indexOf(chatId);
    }

    function getChatContainerById(chatId) {
        let index = getTabIndex(chatId);
        let elementId = index == 0 ? "ujs_ChatContainer" : `ujs_ChatContainer_${index + 1}`;
        return document.getElementById(elementId);
    }

    function getViewportById(chatId) {
        let index = getTabIndex(chatId);
        let elementId = index == 0 ? "ujs_Viewport" : `ujs_Viewport_${index + 1}`;
        return document.getElementById(elementId);
    }

    function getChatTextInputById(chatId) {
        let index = getTabIndex(chatId);
        let elementId = index == 0 ? "ujs_SendChatText_input" : `ujs_SendChatText_${index + 1}_input`;
        return document.getElementById(elementId);
    }

    function getChatSendButtonById(chatId) {
        let index = getTabIndex(chatId);
        let elementId = index == 0 ? "ujs_SendChatButton_btn" : `ujs_SendChatButton_${index + 1}_btn`;
        return document.getElementById(elementId);
    }

    function getTabButtonById(chatId) {
        return document.getElementById(`ujs_TabData_${chatId}_btn`);
    }

    function reloadBrowserPage() {
        document.location.reload();
    }

// -------------- Send to Chat --------------------------------------------------------------------------------------------------------------------------------
    function sendChat(messageText, withPrefix = true, dontProcessMessage = false){
        let maxLength = withPrefix ? MaximumMessageLength - 2 * (BotMessageIndicator.length + 1) : MaximumMessageLength;
        let botMessage = messageText.trim();

        if (botMessage.length > maxLength) {
            Logger.debug(`Message "${botMessage}" is too long (length ${botMessage.length}, max ${maxLength})`);
            botMessage = botMessage.slice(0, maxLength - 3) + "...";
        }

        if (withPrefix) {
            botMessage = `${BotMessageIndicator} ${botMessage} ${BotMessageIndicator}`;
        }

        let messageObject = {
            message : botMessage,
            dontProcess : dontProcessMessage
        };
        chatMessageBuffer.push(messageObject);
    }

    function sendMessageInChatroom(chatId, message){
        getChatTextInputById(chatId).value = message;
        getChatSendButtonById(chatId)?.click();
    }

    function processChatBuffer() {
        if (chatMessageBuffer.length > 0) {
            let inputText = getChatTextInputById(settings.chatId).value;
            if (inputText) return; // still sending something, try again later

            let next = chatMessageBuffer.shift();
            if (next) {
                messageToIgnore = next.dontProcess ? next.message : "";
                sendMessageInChatroom(settings.chatId, next.message);
            }
        }
    }

// -------------- Send to Discord -----------------------------------------------------------------------------------------------------------------------------
    function postToDiscord(webhookUrl, data){
        if (!webhookUrl || !data) {
            Logger.warn(`PostToDiscord url = ${webhookUrl}\n data = ${data}`);
            return;
        }

        let messageObject = {
            url: webhookUrl,
            data: data
        };
        discordMessageBuffer.push(messageObject);
    }

    async function processDiscordBuffer() {
        if (discordMessageBuffer.length > 0) {
            let next = discordMessageBuffer.shift();
            if (next) {
                await fetch(next.url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(next.data),
                    keepalive: true,
                }).then(res => {if (!res.ok) Logger.warn(res); });
            }
        }
    }

// ----------------- CW slot functions ------------------------------------------------------------------------------------------------------------------------
    function handleCWslot(link, templates, timeString) {
        if (!settings.doPostClanWarsToChat && !settings.doPostClanWarsToDiscord) {
            return;
        }

        let templateListString = "";
        let templateListStringAbr = "";

        templates.forEach(val => {
            templateListString += `• ${val}\n`;
            let templateName = TemplateAbbreviationsMap[val];
            if (!templateName) templateName = val;
            templateListStringAbr += `• ${templateName}\n`;
        });

        let hours = new Date().getUTCHours();
        if (hours % HoursBetweenClanWarsSlots != 0) {
            hours = (hours + 1) % 24;
        }
        let slotNumber = hours / HoursBetweenClanWarsSlots + 1;
        let slotString = `timeslot #${slotNumber} of 6`;

        if (settings.doPostClanWarsToChat) {
            sendChat(`CW ${slotString}:\n${link}\n\nTemplates:\n${templateListStringAbr}`, false);
        }

        if (settings.doPostClanWarsToDiscord) {
            let roleID = settings.clanWarsPingRoles[hours];

            let data = {
                username: "Clan Wars bot",
                content: "<@&"+roleID+">",
                embeds: [{
                    title: `Clan Wars ${slotString} is now open!`,
                    timestamp: timeString,
                    description: `[__**Join this slot**__](${link})`,
                    fields:[{
                            name: "Templates",
                            value: templateListStringAbr
                        }],
                    footer:{
                        text:"Powered by The Last Alliance"
                    }
                }],
                allowed_mentions: {roles: [roleID]}
            };
            postToDiscord(settings.clanWarsWebhook, data);
        }
    }

    function handleEndOfClanWarsSeason(message) {
        let rank = message.slice(15, -17);
        let announcement = `# The Clan Wars Season is over!\n:checkered_flag: We finished ${rank}!\n<@&${settings.memberRole}>\n:rotating_light: Next season starts immediately!`;

        let data = {
            content: announcement,
            username: "Clan Wars System Announcement",
            allowed_mentions: {roles: [settings.memberRole]}
        };
        postToDiscord(settings.clanWarsWebhook, data);
    }

    function getNextClanWarsSlotTime() {
        let fourHoursInMs = 4 * HoursToMs;
        let now = Date.now();
        return now + fourHoursInMs - (now % fourHoursInMs);
    }

// ---------------- Command reply storage ---------------------------------------------------------------------------------------------------------------------
    const SunTzuQuotes = {
        1: "He will win who knows when to fight and when not to fight.",
        2: "In the midst of chaos, there is also opportunity.",
        3: "Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.",
        4: "The greatest victory is that which requires no battle.",
        5: "Quickness is the essence of the war.",
        6: "Even the finest sword plunged into salt water will eventually rust.",
        7: "The art of war is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected.",
        8: "There is no instance of a nation benefiting from prolonged warfare.",
        9: "Who wishes to fight must first count the cost.",
        10: "You have to believe in yourself.",
        11: "Build your opponent a golden bridge to retreat across.",
        12: "One may know how to conquer without being able to do it.",
        13: "What the ancients called a clever fighter is one who not only wins, but excels in winning with ease.",
        14: "The wise warrior avoids the battle.",
        15: "The whole secret lies in confusing the enemy, so that he cannot fathom our real intent.",
        16: "One mark of a great soldier is that he fight on his own terms or fights not at all.",
        17: "If the mind is willing, the flesh could go on and on without many things.",
        18: "He who is prudent and lies in wait for an enemy who is not, will be victorious.",
        19: "Anger may in time change to gladness; vexation may be succeeded by content. But a kingdom that has once been destroyed can never come again into being; nor can the dead ever be brought back to life.",
        20: "There are roads which must not be followed, armies which must not be attacked, towns which must not be besieged, positions which must not be contested, commands of the sovereign which must not be obeyed.",
        21: "Attack is the secret of defense; defense is the planning of an attack.",
        22: "Great results can be achieved with small forces.",
        23: "Opportunities multiply as they are seized.",
        24: "If quick, I survive. If not quick, I am lost. This is death.",
        25: "To secure ourselves against defeat lies in our own hands, but the opportunity of defeating the enemy is provided by the enemy himself.",
        26: "Bravery without forethought, causes a man to fight blindly and desperately like a mad bull. Such an opponent, must not be encountered with brute force, but may be lured into an ambush and slain.",
        27: "Wheels of justice grind slow but grind fine.",
        28: "Never venture, never win!",
        29: "It is easy to love your friend, but sometimes the hardest lesson to learn is to love your enemy.",
        30: "Be where your enemy is not.",
        31: "Who does not know the evils of war cannot appreciate its benefits.",
        32: "In battle, there are not more than two methods of attack--the direct and the indirect; yet these two in combination give rise to an endless series of maneuvers.",
        33: "Plan for what it is difficult while it is easy, do what is great while it is small.",
        34: "The opportunity of defeating the enemy is provided by the enemy himself.",
        35: "Foreknowledge cannot be gotten from ghosts and spirits, cannot be had by analogy, cannot be found out by calculation. It must be obtained from people, people who know the conditions of the enemy.",
        36: "If you fight with all your might, there is a chance of life; whereas death is certain if you cling to your corner.",
        37: "Do not swallow bait offered by the enemy. Do not interfere with an army that is returning home.",
        38: "When the outlook is bright, bring it before their eyes; but tell them nothing when the situation is gloomy.",
        39: "The worst calamities that befall an army arise from hesitation.",
        40: "If there is disturbance in the camp, the general's authority is weak.",
        41: "Hence that general is skillful in attack whose opponent does not know what to defend; and he is skillful in defense whose opponent does not know what to attack.",
        42: "Those skilled at making the enemy move do so by creating a situation to which he must conform; they entice him with something he is certain to take, and with lures of ostensible profit they await him in strength.",
        43: "Energy may be likened to the bending of a crossbow; decision, to the releasing of a trigger.",
        44: "When your army has crossed the border, you should burn your boats and bridges, in order to make it clear to everybody that you have no hankering after home.",
        45: "Ponder and deliberate before you make a move.",
        46: "Rewards for good service should not be deferred a single day.",
        47: "Begin by seizing something which your opponent holds dear; then he will be amenable to your will.",
        48: "If words of command are not clear and distinct, if orders are not thoroughly understood, then the general is to blame. But, if orders are clear and the soldiers nevertheless disobey, then it is the fault of their officers.",
        49: "If his forces are united, separate them.",
        50: "Move not unless you see an advantage; use not your troops unless there is something to be gained; fight not unless the position is critical.",
        51: "The general who advances without coveting fame and retreats without fearing disgrace, whose only thought is to protect his country and do good service for his sovereign, is the jewel of the kingdom.",
        52: "It is only the enlightened ruler and the wise general who will use the highest intelligence of the army for the purposes of spying, and thereby they achieve great results.",
        53: "Convince your enemy that he will gain very little by attacking you; this will diminish his enthusiasm.",
        54: "To fight and conquer in all our battles is not supreme excellence; supreme excellence consists in breaking the enemy's resistance without fighting.",
        55: "Let your plans be dark and impenetrable as night, and when you move, fall like a thunderbolt.",
        56: "To know your enemy, you must become your enemy.",
        57: "Treat your men as you would your own beloved sons. And they will follow you into the deepest valley.",
        58: "When the enemy is relaxed, make them toil. When full, starve them. When settled, make them move.",
        59: "So in war, the way is to avoid what is strong, and strike at what is weak.",
        60: "To win one hundred victories in one hundred battles is not the acme of skill. To subdue the enemy without fighting is the acme of skill.",
        61: "Be extremely subtle even to the point of formlessness. Be extremely mysterious even to the point of soundlessness. Thereby you can be the director of the opponent's fate.",
        62: "Thus the expert in battle moves the enemy, and is not moved by him.",
        63: "Water shapes its course according to the nature of the ground over which it flows; the soldier works out his victory in relation to the foe whom he is facing.",
        64: "The supreme art of war is to subdue the enemy without fighting.",
        65: "Appear weak when you are strong, and strong when you are weak.",
        66: "When one treats people with benevolence, justice, and righteousness, and reposes confidence in them, the army will be united in mind and all will be happy to serve their leaders."
    };

    const WarTogQuotes = {
        1: "He will win who knows when to fight and when to lunch.  Or she.",
        2: [
            "In the midwest of chaos, there is always fudge.",
            "In the midst of chaos, there is also opportunity for snacks.  Especially popcorn!"
        ],
        3: "Pigtorious Warriors snack first, then win, then go to lunch.",
        4: "The greatest victory is that which comes with a free dessert.  (Cake, if it is your birthday.)",
        5: [
            "Quickness is the essence of getting your share of the pizza.",
            "Thickness is the edginess of the pizza."
        ],
        6: "Even the finest brownies are improved with salted caramel.",
        7: "The art of WarTog is of vital importance to the Clan. It is a matter of lunch and dinner, a road either to the pantry or to the porch.  Hence it is a subject of inquiry which can on no account be neglected or underfed.",
        8: "There is no instance of a nation benefiting from a footlong hotdog.  They are not dogs, and they are not delicious.  I bet they're not even 12 inches.",
        9: [
            "Who wishes to eat must later count the cost.  And leave a good tip if they wish to eat again tomorrow.",
            "Who wishes to eat must first count the calories.  Unless you are WarTog, then please ignore.",
            "Who wishes to count must first learn the numbers."
        ],
        10: "You have to believe in your chef.",
        11: "Build your opponent a chocolate gazebo, if you want them to stay for dessert.",
        12: "One may know how to cook.  The other may know how to eat.",
        13: [
            "What the ancients called a clever diner is one who not only eat tastes all but saves room for dessert.",
            "What the ancients called a clever diner is one who not only dines, but takes home some leftovers in his cheek pouches.",
            "What the ancients called a clever eater is one who not only wines, but also dines."
        ],
        14: [
            "The wise WarTog pours the batter.",
            "The wise diner avoids the fillers."
        ],
        15: "The whole secret lies in confusing Texx, so that he cannot fathom the full extent to which you have raided the refrigerator.",
        16: [
            "One mark of a great soldier is that he eat on his own terms or eats not at all.",
            "One mark of a great muncher is that he munch on his own terms.  Or he munch on someone else's terms.  When dessert is on the line, it is no time to argue.",
            "One mark of a great diner is that he tip 20% or tips not at all."
        ],
        17: [
            "If the mind is willing, all flesh can go with many sides.",
            "If the mind is willing, the mouth can go on and on about many things."
        ],
        18: "He who is prudent and waits for the roast chicken to be ready will not eat raw chicken.",
        19: "Hunger may in time change to sadness, starvation may be succeeded by constipation.  But a kingdom that has not fed its togs can never again have plump happy togs; nor can skinny togs ever stop complaining about your cooking.",
        20: "There are hard candies which must not be swallowed, meals which must not be munched, buffets where you should only fill your plate one time and not go back for seconds.  But I have not found any yet.  ;8)",
        21: "The foxhole is the secret of defense; crouching down in your foxhole ready to pounce is the secret of attack.  Installing a popcorn machine in your foxhole so you have something to eat while you lurk is the secret of a snack.",
        22: "Great results can be achieved with small between-meal snacks.",
        23: "When Togs are seized, their Opportunities decrease.",
        24: "If hungry, I eat.  If not hungry, I am already dead.",
        26: "Bravery without forethought, causes a tog to fight blindly and desperately like a mad pig.  Such an opponent, must not be encountered with brute force, but may be lured into a bake shop for muffins, and then a nap.",
        27: "Wheels of coffee grind fast, but grind very loudly.",
        29: "It is easy to love your friend's cooking.  But sometimes the hardest lesson to learn is to love helping them wash the dishes afterward.",
        30: "Eat what your enemy has left.",
        31: "Who does not know the evils of pineapple pizza cannot appreciate the benefits of spitting it back out.",
        32: [
            "In snacking, there are only two methods of snack-munching: directly, and things that spill into your mouth by accident.  Both are delicious.",
            "At breakfast, there are not more than two kinds of orange juice--pulp-free and original recipe; yet these two in combination give rise to every possible mixture for your morning mimosa."
        ],
        33: "Snack for what is difficult with something cheesy.  Snack for what is great with something chocolate.",
        34: "The opportunity of pre-eating the enemy's banquet is provided by the enemy's drunken kitchen staff.  Bring vodka.",
        36: "If you munch with all your might, there is a chance of you will not save room for dessert; whereas dessert is certain, if you hide in the cookie jar.",
        37: [
            "WarTog have to respectfully disagree with stupid Sun Tzu on the topic of swallowing.\nBait is the best part of interfering wit an enemy.  :::drools:::",
            "Unless the bait is cookies. Then you should welcome them home and ask if they brought you any presents.",
        ],
        38: "When the cookies are good, demand more cookies.  When the cookies are bad, eat them anyway (maybe they will make more cookies!)",
        39: [
            "The worst calamities that befall a buffet arise from very small plates.  And also from hesitation.",
            "The worst calamities that befall an army arise from hasn't-ate-yet."
        ],
        40: [
            "If there is a disturbance in the Force, it wasn't WarTog's fault.  That planet was already disintegrated when I got here.",
            "If there is a disturbance in the belly, the general's digestion is weak."
        ],
        41: "Hence that general is skillful in defense who greases himself up before battle; and he is skillful in offensiveness who wears no pants into battle.",
        43: "Energy may be likened to the blending of a smoothie; deliciousness, to the releasing of its fruit flavors.",
        44: [
            "When your armies has crossed the border, have sandwiches ready for all!",
            "When your army has crossed the border you should burn the pizza, in order to make clear to everybody that you have no hankering for home-cooked meals.  (Then later, you should sneak back in and eat the pizza anyway.  It's still good.)"
        ],
        45: "Paprika and deviled eggs before you plan a potluck.",
        46: "Rewards for good service should be covered in chocolate frosting.  Rewards for great service should have sprinkles.",
        47: "Begin by seizing your opponent's cookie jar; then he will be amenable to your will; tell him \"no\", they are your cookies now.",
        48: "If orders are not thoroughly understood, then the waiter is to blame.  But if orders are clear and the wrong food is served nevertheless, you should eat it anyway.  You don't want to send it back and risk having the kitchen spit in your food.",
        49: [
            "If his forks are in the dishwasher, make a sandwich and eat with your hoofs.",
            "If his forces are united, offer them a choice of chicken, shrimp or vegetarian lasagna."
        ],
        50: "Move not unless you see an appetizer; use not your hoofs unless there is something to be gobbled up; fight not unless the puffed pastry is available for dessert.",
        52: "It is only the dog chef and the wise tog who will use the finest kitchenware for the purposes of frying, and thereby they achieve great french fries.",
        53: [
            "Convince your enemy that he will gain a little weight by eating snack foods: this will diminish his appetite, and he will let you have the rest.",
            "Convince your enemy that he will gain weight by devouring you.  This will diminish his appetite."
        ],
        55: "Let your chocolate be dark and impenetrable as night, and when you munch, fart like a thunderbolt.",
        56: [
            "To know your enemy, you must raid his Refrigerator.  Therein lies the Truth.",
            "To know your enemy, you must breakfast with your enemy.  If they do not pick up the check...  Well, now you know why they are your enemy."
        ],
        57: "Treat your men as you would your own beloved Togs.  And they will follow you into the deepest valley.\n(Because Togs are not afraid of valleys, they are afraid of mountains.  To get a Tog up a mountain, you will need snacks.)",
        58: "When the enemy is relaxed, make them a sandwich.  When full, make yourself a sandwich.  War is hard work.  Somebody should have a sandwich.",
        60: "To dine in one hundred Michelin restaurants is not the acme of skill.  To get a chef’s off menu tasting for free is the acme of skill.",
        61: "Be extremely subtle, even when helping yourself to seconds.  Be extremely sneaky, even to the point of crawling under the table.  Thereby, you can be the devourer of your opponent's lunch.",
        62: "Thus the expert in the buffet line moves past the enemy, and does not wait for him to get seconds.",
      //  63: "Wine changes as the meal progresses; the eater makes their way through the buffet for optimal dishes.", // meh
        64: "The supreme art of war is to subdue the enemy without spilling",
        65: "Appear hungry when you are starving, and hungry when you just ate.  Somebody will feed you.",
        83: "When your enemy is not the problem, blame your enemy.  Now they have a PR problem.",
    };

    const FerengiQuotes = {
        0: "What the Nagus wants, we acquire.",
        1: "Once you have their money... you never give it back.",
        2: "Money is everything.",
        3: "Never spend more for an acquisition than you have to.",
        4: "Sedition and treason are always profitable.",
        5: "Always exaggerate your estimates.",
        6: "Never allow family law stand in the way of opportunity.",
        7: "Keep your ears open.",
        8: "Small print leads to large risk.",
        9: "Opportunity plus instinct equals profit.",
        10: "Greed is eternal.",
        13: "Anything worth doing is worth doing for money.",
        14: "Sometimes the quickest way to find profits is to let them find you.",
        15: "Dead men close no deals.",
        16: "A deal is a deal... until a better one comes along.",
        17: "A contract is a contract is a contract... but only between Ferengi",
        18: "A Ferengi without profit is no Ferengi at all.",
        19: "Satisfaction is not guaranteed.",
        20: "He who dives under the table today lives to profit tomorrow.",
        21: "Never place friendship above profit.",
        22: "A wise man can hear profit in the wind.",
        23: "Nothing is more important than your health... except for your money.",
        27: "There's nothing more dangerous than an honest businessman.",
        29: "What's in it for me?",
        30: '"Confidentiality equals profit."',
        31: "Never make fun of a Ferengi's mother. Insult something he cares about instead.",
        33: "It never hurts to suck up to the boss.",
        34: "War is good for business.",
        35: "Peace is good for business.",
        37: "The early investor reaps the most interest.",
        39: "Don't tell customers more than they need to know.",
        40: "She can touch your lobes but never your latinum.",
        41: "Profit is its own reward.",
        43: "Feed your greed, but not enough to choke it.",
        44: "Never confuse wisdom with luck.",
        45: "Expand or die.",
        47: "Don't trust a man wearing a better suit than your own.",
        48: "The bigger the smile, the sharper the knife.",
        52: "Never ask when you can take.",
        53: "Never trust anybody taller than you.",
        54: 'Rate divided by time equals profit. (Also known as "The Velocity of Wealth.")',
        55: "Take joy from profit, and profit from joy.",
        57: "Good customers are as rare as latinum—treasure them.",
        58: "There is no substitute for success.",
        59: "Free advice is seldom cheap.",
        60: "Keep your lies consistent.",
        62: "The riskier the road, the greater the profit.",
        63: "Work is the best therapy-at least for your employees.",
        65: "Win or lose, there's always Hupyrian beetle snuff",
        66: "Someone's always got bigger ears.",
        68: "Risk doesn't always equal reward.",
        69: "Ferengi are not responsible for the stupidity of other races.",
        74: "Knowledge equals profit.",
        75: "Home is where the heart is... but the stars are made of latinum.",
        76: "Every once in a while, declare peace. It confuses the hell out of your enemies.",
        77: "If you break it, I'll charge you for it!",
        79: "Beware of the Vulcan greed for knowledge.",
        82: "The flimsier the product, the higher the price.",
        85: "Never let the competition know what you're thinking.",
        87: "Learn the customer's weaknesses, so that you can better take advantage of him.",
        88: "Vengeance will cost you everything.",
        89: "[It is] better to lose some profit and live than lose all profit and die.",
        91: "Your boss is only worth what he pays you.",
        92: "There are many paths to profit.",
        94: "Females and finances don't mix.",
        95: "Expand or die.",
        97: "Enough... is never enough.",
        98: "If you can't take it with you, don't go.",
        99: "Trust is the biggest liability of all.",
        100: "When it's good for business, tell the truth.",
        101: "Profit trumps emotion.",
        102: "Nature decays, but latinum lasts forever.",
        103: "Sleep can interfere with opportunity.",
        104: "Faith moves mountains... of inventory.",
        106: "There is no honor in poverty.",
        108: "A woman wearing clothes is like a man without any profits.",
        109: "Dignity and an empty sack is worth the sack.",
        110: "Exploitation begins at home.",
        111: "Treat people in your debt like family... exploit them.",
        112: "Never have sex with the boss' sister.",
        113: "Always have sex with the boss.",
        117: "You can't free a fish from water.",
        121: "Everything is for sale, even friendship.",
        122: "Never Sleep with the bosses sister",
        123: "Even a blind man can recognize the glow of Latinum.",
        125: "You can't make a deal if you're dead.",
        135: "Listen to secrets, but never repeat them.",
        139: "Wives serve, brothers inherit.",
        141: "Only fools pay retail.",
        144: "There's nothing wrong with charity... as long as it winds up in your pocket.",
        147: "People love the bartender.",
        151: "Even when you're a customer, sell yourself.",
        153: "Sell the sizzle, not the steak.",
        162: "Even in the worst of times someone turns a profit.",
        168: "Whisper your way to success.",
        177: "Know your enemies... but do business with them always.",
        181: "Not even dishonesty can tarnish the shine of profit.",
        183: "When life hands you ungaberries, make detergent.",
        184: "A Ferengi waits to bid until his opponents have exhausted themselves.",
        188: "Not even dishonesty can tarnish the shine of profit.",
        189: "Let others keep their reputation. You keep their money.",
        190: "Hear all, trust nothing.",
        192: "Never cheat a Klingon... unless you're sure you can get away with it.",
        193: "It's never too late to fire the staff.",
        194: "It's always good business to know about new customers before they walk in your door.",
        199: "Location, location, location.",
        200: "A Ferengi chooses no side but his own.",
        202: "The justification for profit is profit.",
        203: "New customers are like razor-toothed gree worms. They can be succulent, but sometimes they bite back.",
        207: "A Tribble Always Means Customer Satisfaction",
        208: "Sometimes, the only thing more dangerous than a question is an answer.",
        211: "Employees are the rungs on the ladder of success. Don't hesitate to step on them.",
        212: "A good lie is easier to believe than the truth.",
        214: "Never begin a (business) negotiation on an empty stomach.",
        216: "Never gamble with a telepath.",
        217: "You can't free a fish from water.",
        218: "Sometimes what you get free costs entirely too much.",
        219: "Possession is eleven-tenths of the law!",
        223: "Beware the man who doesn't take time for Oo-mox.",
        227: "If that's what's written, then that's what's written.",
        229: "Latinum lasts longer than lust.",
        235: "Duck; death is tall.",
        236: "You can't buy fate.",
        239: "Never be afraid to mislabel a product.",
        240: "Time, like latinum, is a highly limited commodity.",
        242: "More is good... all is better.",
        243: "Always leave yourself an out.",
        248: "The definition of insanity is trying the same failed scheme & expecting different results",
        255: "A wife is luxury... a smart accountant a neccessity.",
        257: "When the messenger comes to appropriate your profits, kill the messenger.",
        261: "A wealthy man can afford anything except a conscience.",
        263: "Never allow doubt to tarnish your lust for latinum.",
        266: "When in doubt, lie.",
        267: "If you believe it, they believe it.",
        272: "Always inspect the merchandise before making a deal.",
        280: "If it ain't broke, don't fix it.",
        284: "Deep down, everyone's a Ferengi.",
        285: "No good deed ever goes unpunished.",
        286: "When Morn leaves, it's all over.",
        287: "Always get somebody else to do the lifting.",
        288: "Never get into anything that you can't get out of.",
        289: "A man is only worth the sum of his possessions.",
        290: "An angry man is an enemy, and a satisfied man is an ally.",
        291: "The less employees know about the cash flow, the smaller the share they can demand.",
        292: "Only a fool passes up a business opportunity.",
        293: "The more time they take deciding, the more money they will spend.",
        294: "A bargain usually isn't.",
        299: "Whenever you exploit someone, it never hurts to thank them...That way it's easier to exploit them the next time.",
        431: "When the shooting starts, let the mercenaries handle it!"
    };

    // Print out missing Wartog quotes, in its own closure so nowhere else can accidently use this
    {
        let missingWartogQuotes = Object.keys(SunTzuQuotes).filter(x => !WarTogQuotes.hasOwnProperty(x));
        console.log(`Missing ${missingWartogQuotes.length} Wartog quotes:\n${missingWartogQuotes.map(q => `[${q}] ${SunTzuQuotes[q]}`).join("\n")}`);
    }

// --------------- Command handlers ---------------------------------------------------------------------------------------------------------------------------
    function dateTimeToTimeString(dateTime) {
        let hours = dateTime.getUTCHours().toString().padStart(2,'0');
        let minutes = dateTime.getUTCMinutes().toString().padStart(2,'0');
        let seconds = dateTime.getUTCSeconds().toString().padStart(2,'0');
        let returnValue = hours + ":" + minutes + ":" + seconds;
        return returnValue.includes(NaN) ? "unknown" : returnValue;
    }

    function updateAnalytics(command, user, duration) {
        let analytics = GM_getValue(CommandAnalyticsKey, {commands: {}, users: {}});

        let commandData = analytics.commands[command] ?? {count: 0, totalTime: 0};
        commandData.count++;
        commandData.totalTime += duration;
        analytics.commands[command] = commandData;

        let totalData = analytics.commands[CommandAnalyticsTotalKey] ?? {count: 0, totalTime: 0};
        totalData.count++;
        totalData.totalTime += duration;
        analytics.commands[CommandAnalyticsTotalKey] = totalData;

        let userData = analytics.users[user] ?? {count: 0, totalTime: 0};
        userData.count++;
        userData.totalTime += duration;
        analytics.users[user] = userData;

        GM_setValue(CommandAnalyticsKey, analytics);
    }

    function checkCommandTimeout(triggeredBy) {
        let timeoutTimeSeconds = Math.round((settings.commandTimeout?.seconds ?? -1));
        let timeoutMaxActions = settings.commandTimeout?.maxActions ?? -1;

        if (timeoutMaxActions <= 0 || timeoutTimeSeconds <= 0 || triggeredBy == currentlyLoggedInUser) {
            return false;
        }

        let commandCount = commandUsagePerPlayer[triggeredBy] ?? 0;
        commandUsagePerPlayer[triggeredBy] = ++commandCount;
        setTimeout(() => commandUsagePerPlayer[triggeredBy]--, timeoutTimeSeconds * SecondsToMs);

        return (commandCount > timeoutMaxActions);
    }

    function executeCommand(command, args, triggeredBy, withCommandTimeout = true) {
        if (withCommandTimeout) {
            if (checkCommandTimeout(triggeredBy)) {
                let hasSeenTimeoutWarning = activeCommandTimeoutWarningPerPlayer[triggeredBy] ?? false;
                if (!hasSeenTimeoutWarning) {
                    let timeoutTimeSeconds = Math.round((settings.commandTimeout?.seconds ?? -1));
                    let timeoutMaxActions = settings.commandTimeout?.maxActions ?? -1;
                    sendChat(`@${triggeredBy}: Command "${command}" cannot be executed: max command usage reached. Max ${timeoutMaxActions} commands / ${timeoutTimeSeconds} seconds`);
                    activeCommandTimeoutWarningPerPlayer[triggeredBy] = true;
                }
                return;
            } else {
                activeCommandTimeoutWarningPerPlayer[triggeredBy] = false;
            }
        }

        let startTime = Date.now();
        let random = Math.random();

        // Helper function -- Note: keep in inner scope, else `random` doesn't work anymore
        function sendChatRandomlyRepeated(text, maxNumberOfRepetitions) {
            let stringLenght = Math.round(random * maxNumberOfRepetitions) * text.length;
            sendChat(text.padStart(stringLenght, text));
        }

        switch (command) {
            // --- Default commands ---
            case "help":
            {
                let commandString = commands.map(cmd => CommandPrefix + cmd).join("\n");
                let message = `${BotMessageIndicator} Available commands ${BotMessageIndicator}\n${commandString}`;
                sendChat(message, false);
                break;
            }
            case "whencw":
            {
                let slotTime = getNextClanWarsSlotTime();
                let nextSlotNumber = Math.round(new Date(slotTime).getUTCHours() / 4) + 1;
                let timeUntilSlot = new Date(slotTime - Date.now());
                let messageText = "";

                if (timeUntilSlot > 230 * MinutesToMs) {
                    // clan slot is currently open, so link to active slot rather than next slot
                    let link = GM_getValue(CurrentClanWarsSlotUrlKey) ?? "link unavailable";
                    let currentSlotNumber = nextSlotNumber == 1 ? 6 : nextSlotNumber - 1;
                    messageText = `Timeslot #${currentSlotNumber} of 6 is currently open: ${link}`;
                } else {
                    messageText = `Timeslot #${nextSlotNumber} of 6 starts in ${dateTimeToTimeString(timeUntilSlot)}`;
                }

                sendChat(messageText);
                break;
            }
            case "whenraffle":
            {
                let timeSinceLastRaffle = Date.now() - GM_getValue(LastRaffleTimeKey, NaN) - MinutesToMs; // 1 minute offset to get time since end of raffle
                let timeToNextRaffle = new Date(120 * MinutesToMs - timeSinceLastRaffle);
                let raffleStartText = timeSinceLastRaffle >= 10 * MinutesToMs ? "now" : dateTimeToTimeString(new Date(10 * MinutesToMs - timeSinceLastRaffle));
                let message = `Next raffle between ${raffleStartText} and ${dateTimeToTimeString(timeToNextRaffle)} from now`;
                sendChat(message);
                break;
            }
            case "lastslot":
            {
                let link = GM_getValue(LastClanWarsSlotUrlKey) ?? "link unavailable";
                sendChat(`Last timeslot: ${link}`);
                break;
            }
            case "blamejk":
            {
                const Chances = {
                    "Z": 0.66,
                    "mr_fancy_pants": 0.33,
                };

                let chance = Chances[triggeredBy] ?? 0.1;
                if (random < chance) {
                    let blameName = triggeredBy.replace(" ", "");
                    sendChat(`#blame${blameName}`, false);
                } else {
                    sendChat("#blameJK", false);
                }
                break;
            }
            case "joke":
            {
                let argsHasChuck = args.some(a => a.toLowerCase().includes("chuck"));
                if (argsHasChuck) {
                    const url = "https://api.chucknorris.io/jokes/random?category=animal,career,celebrity,dev,fashion,food,history,money,movie,music,science,sport,travel";
                    fetch(url, {mode: "cors"})
                    .then(rep => {
                        if (!rep.ok) {
                            throw new Error(`Loading joke from ${url} failed; status ${rep.status}: ${rep.statusText}`);
                        }
                        return rep.json();
                    })
                    .then(data => sendChat(data.value))
                    .catch(error => {
                        Logger.error(error);
                        sendChat("Unable to load joke");
                    });
                } else if (random < 0.33) {
                    const headerObj = {
                        "User-Agent": "Chat To Discord script: https://www.warzone.com/Profile?p=31105111944",
                        "Accept": "text/plain",
                    };
                    const url = "https://icanhazdadjoke.com/";
                    fetch(url, {headers: headerObj, mode: "cors"})
                        .then(rep => {
                            if (!rep.ok) {
                                throw new Error(`Loading joke from ${url} failed; status ${rep.status}: ${rep.statusText}`);
                            }
                            return rep.text();
                        })
                        .then(text => sendChat(text))
                        .catch(error => {
                            Logger.error(error);
                            sendChat("Unable to load joke");
                        });
                } else {
                    const url = "https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Pun,Spooky,Christmas?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&format=txt";
                    fetch(url, {mode: "cors"})
                    .then(rep => {
                        if (!rep.ok) {
                            throw new Error(`Loading joke from ${url} failed; status ${rep.status}: ${rep.statusText}`);
                        }
                        return rep.text();
                    })
                    .then(text => sendChat(text))
                    .catch(error => {
                        Logger.error(error);
                        sendChat("Unable to load joke");
                    });
                }
                break;
            }
            case "suntzu":
            {
                let quoteNumber = parseInt(args[0]);
                if (!SunTzuQuotes.hasOwnProperty(quoteNumber)) {
                    let quotesAvailable = Object.keys(SunTzuQuotes);
                    quoteNumber = quotesAvailable[Math.floor(random * quotesAvailable.length)];
                }
                sendChat(`${quoteNumber}: ${SunTzuQuotes[quoteNumber]}`);
                break;
            }
            case "wikipedia":
            {
                if (args.length < 1) {
                    sendChat("Please provide a search term when using this command, or enjoy a random page: https://en.wikipedia.org/wiki/Special:Random");
                } else {
                    let searchTerm = args.map(encodeURI).join("%20");
                    fetch(`https://api.wikimedia.org/core/v1/wikipedia/en/search/title?q=${searchTerm}&limit=2`)
                        .then(rep => {
                            if (!rep.ok) {
                                throw new Error(`Searching Wikipedia for ${searchTerm} failed; status ${rep.status}: ${rep.statusText}`);
                            }
                            return rep.json();
                        })
                        .then(data => {
                            let pages = data?.pages;
                            if (pages && pages.length) {
                                let messageParts = pages.map(page => {
                                    let pageText = `${BotMessageIndicator} ${page.title} ${BotMessageIndicator}\n`;
                                    if (page.description) {
                                        pageText += (page.description + "\n");
                                    }
                                    pageText += `https://en.wikipedia.org/?curid=${page.id}`;
                                    return pageText;
                                });
                                sendChat(messageParts.join("\n\n"), false);
                            } else {
                                // Wiki page not found, provide search
                                let title = `${BotMessageIndicator} Article "${args.join(" ")}" not found ${BotMessageIndicator}`;
                                let searchUrl = `https://en.wikipedia.org/w/index.php?search=${searchTerm}`;
                                sendChat(`${title}\n${searchUrl}`, false);
                            }
                        });
                }
                break;
            }
            case "blamefizzer":
            {
                sendChat("#blameFizzer", false);
                break;
            }
            case "discord":
            {
                if (settings.discordInvite) {
                    sendChat(settings.discordInvite);
                }
                break;
            }
            case "ferengi":
            {
                let ruleNumber = parseInt(args[0]);
                if (!FerengiQuotes.hasOwnProperty(ruleNumber)) {
                    let rulesAvailable = Object.keys(FerengiQuotes);
                    ruleNumber = rulesAvailable[Math.round(random * rulesAvailable.length)];
                }

                sendChat(`${ruleNumber}: ${FerengiQuotes[ruleNumber]}`);
                break;
            }
            case "forgivejk":
            {
                sendChat("#forgiveJK", false);
                break;
            }
            case "panic":
            {
                sendChatRandomlyRepeated("🚨", 7);
                break;
            }

            // --- Admin commands ---
            case "uptime":
            {
                let uptimeMs = Date.now() - startupDateTime;
                let uptimeDays = Math.floor(uptimeMs / DaysToMs);
                let startString = startupDateTime.toString().slice(0, 33); // cuts of the name of the timezone
                let uptimeString = `${uptimeDays} day(s) ` + dateTimeToTimeString(new Date(uptimeMs - uptimeDays * DaysToMs));
                sendChat(`Started ${startString}\nUptime ${uptimeString}`);
                break;
            }
            case "analytics":
            {
                const CommandParamUsers = ["user", "users", "player", "players"];
                const CommandParamCommands = ["command", "commands"];
                const CommandParamCooldown = ["cooldown", "timeout", "cooldowns", "timeouts"];

                let analytics = GM_getValue(CommandAnalyticsKey, {users: {}, commands: {}});

                if (CommandParamUsers.includes(args[0])) {
                    let searchTerm = args.slice(1).join(" ").toLowerCase() ?? "";
                    let userData = Object.entries(analytics.users)
                        .filter(kv => kv[0].toLowerCase().includes(searchTerm))
                        .sort((a, b) => b[1].count - a[1].count);

                    let userText = "";
                    for (let [name, data] of userData) {
                        let averageDuration = Math.round(data.totalTime / data.count);
                        let durationText = (averageDuration > 0) ? ` (${averageDuration} ms)` : "";
                        userText += `${name}: ${data.count}${durationText}\n`;
                    }

                    if (!userText) {
                        userText = `No user's found for "${searchTerm}"`;
                    }

                    let headerText = `${BotMessageIndicator} Command usage for user(s) ${BotMessageIndicator}`;
                    sendChat(`${headerText}\n${userText}`, false);
                } else if (CommandParamCommands.includes(args[0])) {
                    let searchTerms = args.slice(1).filter(Boolean).map(a => a.toLowerCase()); // remove empty (from accidental double space in user input)
                    let commandData = Object.entries(analytics.commands)
                        .filter(kv => {
                            let key = kv[0].toLowerCase();
                            return searchTerms.some(st => key.includes(st));
                        })
                        .sort((a, b) => b[1].count - a[1].count);

                    let commandText = "";
                    for (let [command, data] of commandData) {
                        let displayName = (command == CommandAnalyticsTotalKey) ? "TOTAL" : command;
                        let averageDuration = Math.round(data.totalTime / data.count);
                        let durationText = (averageDuration > 0) ? ` (${averageDuration} ms)` : "";
                        commandText += `${displayName}: ${data.count}${durationText}\n`;
                    }

                    if (!commandText) {
                        commandText = `No commands found for "${searchTerms.join(" ").toLowerCase()}"`;
                    }

                    let headerText = `${BotMessageIndicator} Command usage for command(s) ${BotMessageIndicator}`;
                    sendChat(`${headerText}\n${commandText}`, false);
                } else if (CommandParamCooldown.includes(args[0])) {
                    let timeoutTimeSeconds = Math.round((settings.commandTimeout?.seconds ?? -1));
                    let timeoutMaxActions = settings.commandTimeout?.maxActions ?? -1;
                    let headerText = `${BotMessageIndicator} Command cooldown for user(s) ${BotMessageIndicator}`;
                    if (timeoutMaxActions <= 0 || timeoutTimeSeconds <= 0) {
                        sendChat(`${headerText}\nNot configured for this instance`, false);
                    } else {
                        let limitText = `Max ${timeoutMaxActions} commands / ${timeoutTimeSeconds} seconds.`;

                        let cooldownData = Object.entries(commandUsagePerPlayer).filter(kv => kv[1] > 0);
                        let cooldownDataText = `Active actions for ${cooldownData.length} users:\n`;
                        cooldownDataText += cooldownData.map(kv => `${kv[0]}: ${kv[1]}`).join("\n");

                        if (cooldownData.length == 0) {
                            cooldownDataText += "No players with active actions";
                        }

                        sendChat(`${headerText}\n${limitText}\n${cooldownDataText}`, false);
                    }
                } else {
                    let commandData = Object.entries(analytics.commands).sort((a, b) => b[1].count - a[1].count);

                    let commandText = "";
                    for (let [command, data] of commandData) {
                        let displayName = (command == CommandAnalyticsTotalKey) ? "TOTAL" : command;
                        let averageDuration = Math.round(data.totalTime / data.count);
                        let durationText = (averageDuration > 0) ? ` (${averageDuration} ms)` : "";
                        commandText += `${displayName}: ${data.count}${durationText}\n`;
                    }

                    if (!commandText) {
                        commandText = "No data found";
                    }

                    let headerText = `${BotMessageIndicator} Command usage ${BotMessageIndicator}`;
                    sendChat(`${headerText}\n${commandText}`, false);
                }
                break;
            }
            case "runascode":
            {
                if (triggeredBy != currentlyLoggedInUser) return;

                let commandString = args.join(" ");
                try {
                    Logger.debug(`Executing:\n${commandString}`);
                    let returnValue = eval(commandString);
                    Logger.debug(returnValue);

                    if (returnValue === Object(returnValue)) // check if we get an object back
                    {
                        returnValue = JSON.stringify(returnValue);
                    }
                    sendChat(`Result: ${returnValue}`);
                } catch (exception) {
                    Logger.error(exception);
                    sendChat(`Error: ${exception}`);
                }
                break;
            }

            // --- JK_3 specific ---
            case "whensleep":
            {
                if (random < 0.15) {
                    sendChat("Never!");
                } else if (random < 0.75) {
                    sendChat("Soon™");
                } else {
                    sendChat("Sleep starts between now and anytime going forward, unless you're Doppelganger or Hatter; if you are, the answer is never!!!");
                }
                break;
            }
            case "taco":
            {
                if (random < 0.2) {
                    sendChat("Sorry, we're all out of tacos");
                } else {
                    let icon = triggeredBy == "Morg'th N H'Throg" ? "🧁" : "🌮";
                    sendChatRandomlyRepeated(icon, 5);
                }
                break;
            }
            case "box":
            {
                let alwaysCat = args.length >= 3 && args[2] == "cat";
                let alwaysDog = !alwaysCat && args.length >= 4 && args[3] == "dog";

                if (random < 0.03 || alwaysDog) {
                    // ┌  ─   ─  ┐
                    //   DOG 🐶
                    // └  ─   ─  ┘
                    sendChat("┌  ─   ─  ┐\n  DOG 🐶\n└  ─   ─  ┘", false);
                }
                else if (random < 0.15 || alwaysCat) {
                    // ┌  ─  ─  ┐
                    //   CAT 🐈
                    // └  ─  ─  ┘
                    sendChat("┌  ─  ─  ┐\n  CAT 🐈\n└  ─  ─  ┘", false);
                } else {
                    // ┌  ─  ┐
                    //   BOX
                    // └  ─  ┘
                    sendChat("┌  ─  ┐\n  BOX\n└  ─  ┘",false);
                    //sendChat("╔╗\n╚╝", false);
                }
                break;
            }
            case "coffee":
            {
                if (triggeredBy.includes("DANGER") && random < 0.33) {
                    sendChat("⚠️🚨 Watch out for the falling rocks! 🪖🪨");
                }
                else if (random < 0.1) {
                    sendChat("It's the nectar of the gods!");
                } else {
                    let regex = /^tea\p{P}?$/imu;
                    let cupIcon = args.some(arg => arg.match(regex)) ? "🍵" : "☕";
                    sendChatRandomlyRepeated(cupIcon, 4);
                }
                break;
            }
            case "pizza":
            {
                if (random < 0.05) {
                    sendChat("🍍 Pineapple does belong on pizza! 🍕");
                } else if (random < 0.25) {
                    sendChat("What toppings would you like?");
                } else {
                    sendChatRandomlyRepeated("🍕", 4);
                }
                break;
            }
            case "beer":
            {
                if (random < 0.4) {
                    sendChat("Cheers! 🍻");
                } else {
                    sendChatRandomlyRepeated("🍺", 5);
                }
                break;
            }
            case "wine":
            {
                if (random < 0.33) {
                    sendChat("It's party time! 🍾");
                } else {
                    sendChatRandomlyRepeated("🍷", 4);
                }
                break;
            }
            case "whenwhencommandcommand":
            {
                if (random < 0.25) {
                    sendChat("Never!");
                } else if (random < 0.50) {
                    sendChat("Have you ever considered that the command maybe doesn't want to be found?");
                } else if (random < 0.75) {
                    sendChat("Yesterday...");
                } else {
                    sendChat("Soon™");
                }
                break;
            }
            case "whenwhenhattercommand":
            {
                if (random < 0.25) {
                    sendChat("Error 418: Hatter can never be found");
                } else if (random < 0.50) {
                    sendChat("Really? What do you expect me to do now?");
                } else if (random < 0.75) {
                    sendChat("Whenever you pay JK enough");
                } else {
                    sendChat("Once JK wakes up (which is never, because JK never sleeps)");
                }
                break;
            }
            case "goat":
            {
                if (random < 0.33) {
                    sendChat("Baaaaaa!");
                } else {
                    sendChatRandomlyRepeated("🐐", 6);
                }
                break;
            }
            case "llama":
            {
                if (random < 0.11) {
                    sendChat("Mmm-mmm-mmm");
                } else if (random < 0.22) {
                    sendChat("EEEEE-yah!");
                } else if (random < 0.33) {
                    sendChat("ggggrllggh");
                } else {
                    sendChatRandomlyRepeated("🦙", 6);
                }
                break;
            }
            case "strawberry":
            {
                if (random < 0.33) {
                    sendChat("Its not actually a berry!");
                } else {
                    sendChatRandomlyRepeated("🍓", 5);
                }
                break;
            }

            // -- Narnia specific ---
            case "whenlunch":
            {
                if (random < 0.25) {
                    sendChat("Soon™");
                } else if (random < 0.6) {
                    sendChat("Always!");
                } else if (random < 0.9) {
                    sendChat(`${triggeredBy}'s lunch is served`);
                } else {
                    sendChat(`${triggeredBy} gets no lunch today!`);
                }
                break;
            }
            case "texx":
            {
                if (random < 0.2) {
                    sendChat("I AM TEXX!!!!!!");
                } else if (random < 0.4) {
                    sendChat("#blameTexx", false);
                } else if (random < 0.6) {
                    sendChat(`I AM ${triggeredBy.toUpperCase()}!!!!!!`);
                } else if (random < 0.8) {
                    sendChat("It's Texxing time!");
                } else if (triggeredBy == "Texx") {
                    sendChat("Who the hell do you think you are kiddo?");
                } else {
                    sendChat(`${triggeredBy} is probably better than Texx anyways`);
                }
                break;
            }
            case "wartog":
            {
                let quoteNumber = parseInt(args[0]);
                if (!WarTogQuotes.hasOwnProperty(quoteNumber)) {
                    let quotesAvailable = Object.keys(WarTogQuotes);
                    quoteNumber = quotesAvailable[Math.floor(random * quotesAvailable.length)];
                }

                let quote = WarTogQuotes[quoteNumber];
                if (Array.isArray(quote)) {
                    let index = parseInt(args[1]) - 1;
                    if (!isFinite(index) || index < 0 || index >= quote.length) {
                        index = Math.floor(Math.random() * quote.length);
                    }
                    quote = quote[index];
                }

                sendChat(`^oo^\n${quoteNumber}: ${quote}`);
                break;
            }

            // --- Error handling ---
            default:
            {
                let mappedCommand = Object.entries(hiddenCommands).find(c => c[0].toLowerCase() == command)?.at(1);
                if (mappedCommand) {
                    executeCommand(mappedCommand.toLowerCase(), args, triggeredBy, false);
                    return; // early return to prevent double counting in analytics
                } else {
                    Logger.error("Unknown command:", command);
                }
            }
        }

        let commandProcessingTime = Date.now() - startTime;
        updateAnalytics(command, triggeredBy, commandProcessingTime);
    }



// --------------- Chat checkers ------------------------------------------------------------------------------------------------------------------------------
    function globalChatChecker(mutationsList, GlobalChatObserver) {
        const GlobalChatMessages = getChatContainerById(GlobalChatId)?.children;
        if (!GlobalChatMessages) return; // Chat isn't loaded yet, try again later

        const LastGlobalChatMessage = GlobalChatMessages[GlobalChatMessages.length - 1];
        let user = LastGlobalChatMessage.children[0].children[1].children[0].innerText;
        let message = LastGlobalChatMessage.children[1].children[1].children[0].innerText;
        let systemMessage = LastGlobalChatMessage.children[1].children[1].children[0].style.fontWeight == 'bold';
        var handle, intervalID;

        if (user != previousGlobalUser || message != previousGlobalMessage){
            lastMessageInAnyChatTime = Date.now();
            previousGlobalUser = user;
            previousGlobalMessage = message;

            // --- raffle checker ---
            if (systemMessage && user == "RaffleBot" && message.includes("(you must have chatted in the last hour)")){
                let raffleLine = message.split('!', 1) + '!';
                GM_setValue(LastRaffleTimeKey, Date.now());

                if (settings.doPostRaffleToDiscord) {
                    let data = {
                        content: `<@&${settings.rafflePingRole}> ${raffleLine}`,
                        username: "RaffleBot",
                        allowed_mentions: {roles: [settings.rafflePingRole]}
                    };
                    postToDiscord(settings.chatWebhook, data);
                }

                if (settings.doPostRafflesToChat) {
                    sendChat(raffleLine, true, true);
                }
            }

            // clan wars checker
            if (systemMessage && message.includes("Clan War timeslot is now available!")) {
                let timeString = new Date().toISOString();
                let link = LastGlobalChatMessage.children[1].children[2].children[1].href;
                GM_setValue(CurrentClanWarsSlotUrlKey, link);
                setTimeout(() => {
                    GM_setValue(LastClanWarsSlotUrlKey, link);
                    GM_setValue(CurrentClanWarsSlotUrlKey, null);
                } , 10 * MinutesToMs);

                if (!(settings.doPostClanWarsToDiscord || settings.doPostClanWarsToChat)) {
                    return; // don't bother opening the timeslot if it's not allowed to post the result anywhere
                }

                var cutoffCounter = 0;

                handle = window.open(link, "_blank");
                function getcurrentCwTemplates() {
                    try {
                        let templateLabelElements = handle.document.querySelectorAll("[id^=ujs_TemplateNameLabel][id$=_tmp]");

                        if (templateLabelElements.length > 0) {
                            clearInterval(intervalID);
                            handle.close();
                            let clanWarsTemplates = Array.from(templateLabelElements).map(elem => elem.innerText);
                            handleCWslot(link, clanWarsTemplates, timeString);
                        }
                    } catch(err) {
                        Logger.debug(err);
                        cutoffCounter += 1;
                        if (cutoffCounter >= MaxCWTimeSlotNameRetries) {
                            clearInterval(intervalID);
                            handleCWslot(link, ["Error: Templates not available"], timeString);
                        }
                    }
                }
                intervalID = setInterval(getcurrentCwTemplates, 500);
            }
        }
    }

    function clanChatChecker(mutationsList, ClanChatObserver){
        const ChatMessages = getChatContainerById(settings.chatId)?.children;
        if (!ChatMessages) return; // Chat isn't loaded yet, try again later

        const LastChatMessage = ChatMessages[ChatMessages.length - 1];
        let user = LastChatMessage.children[0].children[1].children[0].innerText;
        let message = LastChatMessage.children[1].children[1].children[0].innerText;

        if (user != previousClanUser || message != previousClanMessage) {
            if (message == messageToIgnore) {
                messageToIgnore = "";
                return;
            }

            let sysMsg = LastChatMessage.children[1].children[1].children[0].style.fontWeight == 'bold';
            let link = LastChatMessage.children[1].children[2].children[1].href;
            if (link.endsWith("#")){
                link = undefined;
            }

            const now = Date.now();
            previousClanUser = user;
            previousClanMessage = message;
            lastClanChatMessageTime = now;
            lastMessageInAnyChatTime = now;

            if (sysMsg && user == "Player Name") { // override player name if the name shown on WZ is blank
                user = DefaultPlayerName;
            }

            if (sysMsg && message.startsWith("Earned rank of ") && message.endsWith(" in the clan war!")) {
                if (settings.doPostClanWarsEndOfSeason) {
                    handleEndOfClanWarsSeason(message);
                }
            }

            if (settings.doPostChatToDiscord) {
                if (sysMsg && link) {
                    message += `\n**[[ View ]](<${link}>)**`;
                }

                let data = {
                    content: message,
                    username: user,
                    allowed_mentions: {parse: ["roles","users"]}
                };
                postToDiscord(settings.chatWebhook, data);
            }

            if (settings.doHandleCommands && !sysMsg && !link && message.startsWith(CommandPrefix)) {
                let args = message.slice(1).split(/\s/);
                let command = args[0].toLowerCase();
                let commandArguments = args.slice(1);
                if (lowercaseCommands.includes(command)) {
                    executeCommand(command, commandArguments, user);
                }
                else {
                    // extract anyting from the first argument that is text, except the last 's' (if it exists, to catch plurals), starting '!' and any trailing punctuation
                    let cleanCommand = command.match(/^!*(\w+?)s?\p{P}?$/iu)?.at(1)?.toLowerCase();
                    if (!cleanCommand) {
                        return;
                    }

                    if (lowercaseCommands.includes(cleanCommand)) {
                        executeCommand(cleanCommand, commandArguments, user);
                    } else if (lowercaseCommands.includes(WhenCommandCommand) && cleanCommand.match(/^when\w+command$/i)) {
                        executeCommand(WhenCommandCommand, commandArguments, user);
                    }
                }
            }
        }
    }

// -------------- Initialize the checkers ---------------------------------------------------------------------------------------------------------------------
    function initAndStart(){
        const RetryTimeoutID = setTimeout(() => {
            Logger.error(`Page not loaded after ${MaxPageLoadingTimeSeconds}, forcing reload`);
            clearInterval(InitChatIntervalID);
            reloadBrowserPage();
        }, MaxPageLoadingTimeSeconds * 1000);

        const InitChatIntervalID = setInterval(function(){
            let chatButton = getTabButtonById(settings.chatId);
            if (chatButton){
                clearInterval(InitChatIntervalID);
                chatButton.click();
                const ChatScroller = getViewportById(settings.chatId);
                ChatScroller.scrollTop = ChatScroller.scrollHeight - ChatScroller.clientHeight + 1;
                getTabButtonById(GlobalChatId).click();
                clearTimeout(RetryTimeoutID);
                const GlobalChat = getChatContainerById(GlobalChatId);
                const StartObserver = new MutationObserver(startFeatures);
                StartObserver.observe(GlobalChat, ChatObserverConfig);
            }
        }, 100);
    }

    function startFeatures(mutationsList, StartObserver) {
        getTabButtonById(settings.chatId).click();
        this.disconnect();
        start();
    }

    function start() {
        startupDateTime = new Date();

        UpdateStorageAfterUpdate();

        // Todo make const ?
        commands = DefaultCommands.concat(settings.commands);
        if (settings.discordInvite) {
            commands.push("Discord");
        }
        hiddenCommands = Object.assign(DefaultCommandMappings, settings.commandMappings);
        let lowercaseHiddenCommands = Object.keys(hiddenCommands).map(c => c.toLowerCase());
        lowercaseCommands = commands.map(c => c.toLowerCase()).concat(lowercaseHiddenCommands);

        const GlobalChat = getChatContainerById(GlobalChatId);
        const Chat = getChatContainerById(settings.chatId);

        try {
            previousGlobalUser = GlobalChat.children[GlobalChat.children.length-1].children[0].children[1].children[0].innerText;
            previousGlobalMessage = GlobalChat.children[GlobalChat.children.length-1].children[1].children[1].children[0].innerText;
            previousClanUser = Chat.children[Chat.children.length-1].children[0].children[1].children[0].innerText;
            previousClanMessage = Chat.children[Chat.children.length-1].children[1].children[1].children[0].innerText;
        } catch (exception) {
            Logger.error(exception);
            reloadBrowserPage();
        }

        const GlobalChatObserver = new MutationObserver(globalChatChecker);
        const ClanChatObserver = new MutationObserver(clanChatChecker);

        GlobalChatObserver.observe(GlobalChat, ChatObserverConfig);
        ClanChatObserver.observe(Chat, ChatObserverConfig);
        Logger.info('"Clan Chat to Discord" is running');
    }

    function UpdateStorageAfterUpdate() {
        // Applies updates to the any of the values or keys in the script's storage
        // Note : makes use of fall-through behaviour, do not add break to cases!

        let currentVersion = GM_getValue(ScriptStorageVersionNumberKey, 0);
        Logger.debug(`Current storage version: ${currentVersion}`);
        switch (currentVersion) {
            case 0:
            {
                // Move statistics from the "goats" and "tacos" commands to "goat" and "taco" due to an internal command rename
                let analytics = GM_getValue(CommandAnalyticsKey, null);
                if (!analytics) {
                    return;
                }

                const oldGoatCommandName = "goats";
                const newGoatCommandName = "goat";
                const oldTacoCommandName = "tacos";
                const newTacoCommandName = "taco";

                let oldGoatValue = analytics.commands[oldGoatCommandName];
                if (oldGoatValue) {
                    let newGoatValue = analytics.commands[newGoatCommandName] ?? {count: 0, totalTime: 0};
                    newGoatValue.count += oldGoatValue.count;
                    newGoatValue.totalTime += oldGoatValue.totalTime;
                    analytics.commands[newGoatCommandName] = newGoatValue;
                    delete analytics.commands[oldGoatCommandName];
                }

                let oldTacoValue = analytics.commands[oldTacoCommandName];
                if (oldTacoValue) {
                    let newTacoValue = analytics.commands[newTacoCommandName] ?? {count: 0, totalTime: 0};
                    newTacoValue.count += oldTacoValue.count;
                    newTacoValue.totalTime += newTacoValue.totalTime;
                    analytics.commands[newTacoCommandName] = newTacoValue;
                    delete analytics.commands[oldTacoCommandName];
                }

                GM_setValue(CommandAnalyticsKey, analytics);
                GM_setValue(ScriptStorageVersionNumberKey, 1);
            }
        }
    }

// -------------- Auto refresh system -------------------------------------------------------------------------------------------------------------------------
    function checkReboot() {
        let now = Date.now();
        let pageProbablyFrozen = now - lastMessageInAnyChatTime > MaxChatIdleTimeMinutes * MinutesToMs; // no message send in any chat for 35 minutes → assume WZ froze up
        let raffleCheck = now - GM_getValue(LastRaffleTimeKey, NaN) < 10 * MinutesToMs; // less than 10 minutes since last raffle
        let clanChatCheck = lastClanChatMessageTime === undefined || (now - lastClanChatMessageTime > MaxClanChatIdleTimeMinutes * MinutesToMs); // more than X minutes since last clan chat message
        let clanWarsCheck = now - getNextClanWarsSlotTime() < 235 * MinutesToMs; // more than 5 minutes to go until the next CW slot
        let unsendMessagesCheck = chatMessageBuffer.length == 0 && discordMessageBuffer.length == 0; // there are still messages in the buffers to be handled

        if (pageProbablyFrozen || raffleCheck && clanChatCheck && clanWarsCheck && unsendMessagesCheck) {
            Logger.warn(`Rebooting to ensure freshness (${pageProbablyFrozen ? "frozen" : "dead chat"})`);
            reloadBrowserPage();
        } else {
            setTimeout(checkReboot, RebootCheckTimeSeconds * 1000);
        }
    }

    function checkPing() {
        // fetch smallest file possible, if it failes, reload the page
        fetch("https://warzonecdn.com/Images/GameInfoIcons/OverriddenBonuses.png", {keepalive: true})
            .catch(e => {
                Logger.error("Ping failed: reloading page");
                reloadBrowserPage();
            });
    }

// -------------------- MAIN - --------------------------------------------------------------------------------------------------------------------------------
    unsafeWindow.scriptEval = (code) => eval(code); // expose an eval function that runs inside the TamperMonkey sandbox

    currentlyLoggedInUser = document.getElementById("AccountDropDown").innerText.trim();
    settings = SettingsPerAccount[currentlyLoggedInUser] || DefaultSettings;

    setInterval(processChatBuffer, ClanChatMessageSendTimeMS);
    setInterval(processDiscordBuffer, DiscordMessageSendTimeMS);

    initAndStart();

    setInterval(checkPing, PingTimeSeconds * 1000);

    if (RebootCheckTimeSeconds && RebootCheckTimeSeconds > 1) {
        setTimeout(checkReboot, MaxChatIdleTimeMinutes * MinutesToMs);
    }

    setInterval(Logger.deleteOldLogs, 8 * HoursToMs);
})();
