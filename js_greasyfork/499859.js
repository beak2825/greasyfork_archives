// ==UserScript==
// @name         Advanced Agma
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @author       Big watermelon (credits: Nersai, Vintrex)
// @description  clickable chat links, discord in game chat (/discord ... hi), remove specific animations, remove food completely (toggle mouse), advanced user stats (agma.io/stats.php), increase number of stackable animations
// @match        https://agma.io
// @match        https://discord.com/*
// @license      GPL-3.0-or-later
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAAC9FBMVEUAAAC9vb29vb29vb29vb29vb29vb29vb29vb29vb29vb29vb29vb29vb0VZcATXrgNR6ENR6EVZcAVZcAVZcAVZcARVrEOSaMNR6ENR6ENR6ENR6EVZcAVZcAVY74QUq0NR6ENR6EVZcATXrgOS6UNR6ENR6G9vb0RVK+9vb0VZcANR6ESWrQNR6EVZcAUX7oPTacNR6EVZcAQUKu0tLSrq6uwsLAVZcC5ubmenp5+fn51dXV6enqQkJCTp74qcMCnp6ezuL1Uhr8NR6GVlZWioqKJor4ga8CMjIyosr01dr+Dg4PGxsbJycnDw8NfjL/c3Nzu7u7o6Oh+nL7MzMzr6+vi4uKerb7W1tZKgb91dXV1dXXS0tLl5eXAwMBpkb8PT6l1dXV1dXWZmZmJiYl1dXV1dXV1dXV1dXV1dXV1dXXZ2dk/e791dXV1dXVvcniusbdbaoAUSp4YTqOGmLTf398SWLJIYYhEbKqytruHh4cRV7IUYbzPz88VZcCRoLZae60uXaanrroVZcA5ZagjVqWcp7hwibFPc6wWaMMad9MbftoYcc0Xa8YdhOAhlvMTXLZ7kbMgkO0VZcAcgd0NR6EVZcAXbsofjekaetYdh+N1dXUeiuYgk/AZdNBlgq+ZmZm9vb2apbcNR6Gosr2yt70ha8Cbq751l77/wQf/wQf/wQdTfo//wQf/wQf/wQfFqjVQfJL/wQf/wQe2pEEycamKk2Qka7Tith5egobwuxN7jW//wQf/wQdtiHuZmVinn0zTsCpBdp0PTqgSWbQjabOHhlbwuRErVo6kk0FKZnvDoy5FY33/wQccT5d3fF6GhFT/wQf/wQcQUasOSaMOSqQOSaMOSqQPTacvX6goWaVpaWmPj4+bm5usrKxhYWFhYWFnZ2eEhISgoKBhYWFtbW23t7d4eHhhYWFhYWGysrJhYWFhYWFycnJhYWFhYWGGhoZnZ2dhYWGpqalhYWGMjIx6enphYWFhYWFhYWFhYWFhYWFiRaieAAAA/HRSTlMAMIC/3//Pn2AQr0DvjzBAQBAQcM//////v49QQO///++fj///32BQ/3CvIP+AgP//zyD/////UP//////////////MP/////////////////////////////fv///////nzAgr89AYI/vIP//EK////////////////+v//9g/////5////////////////////+//3Df/////4D//////yBQr4Dv3+9wEFCA74/v////MN///////////3C///////+PUP/////////PYP///59AMM+P769Q/8+v////QP////+/////IJ//EO//YHDv71Dfj+/vzzDfgK9Air+ZAAAYg0lEQVR4AezBtQHDMAAAsMRM/79bmkprJks6AAAAAAAAAAC41hliyi+ltn6wlR5S/jDmwTZ6yL/iPNjDXPmvOzt3oeTGDkQBtAMdRq8VK2R2mDkxhJk83jAzMzMv/PWCrDGM3LJf0ZO2+vzCvSW1BjQX7ObNX7AQvMcmI2UaPQrE+uJCiEUJuXjJUmA+m460OZOgs2XLhZJMSSnTmQUw8XD+dANiWdGQy8sxhRXAPM6fNmclGObFRYvkKul/BTh/2gyI6FsulMgiIAs+DwOcP201tIqtEYZkSiqL14L3OH/TdGP6M6xLSGU9eI7ztzdggyBs3CSVzbwIeJ8//UBgS1yQklulkuZh0Nf8t23fvoNswOTJMybtXC5sFsm6zEJgzps5Ddvs2r2nOKZU3oakyl5htU7yNuBr/vtKxVB5F1L2HxBWuYRU0geBeZX/oWKL0mEkHTkqbDYmeBDwMP9dx4pa90Xg+ImeGiC5AR7lf7IYdTI6CZw6ffr0GVTOTuwGcP5KqfU8cKYaKLXqKRzTb90GctLrBnD+ZgPOnQ8aLoxX4KJ1G1jncwM4f7MBZ3T+2iVE3H9ZWKzyswGc/5WrV0sdGnAtaHf9BiLeFBa3pObRaZDzv30HAO7eKzbtQ+VSEFE71WUQSIaDYHotOIVNmkrkf/8B1D0shvYgUYDgvBoEjvYwCG5eCA5hk+YQ+T+ChjuPi3WHwhkg6NyA/Sd6GAMy4D7O//FDaPHkflHZjtrTwFC7Md6AZ4K0yaNBkPO/A22evyiOefkKQxcCw3Ucd0BQNnozBnD+959A1KNi8fWbt+9Qu/E+MFxCtB4GPkhtMTiN87/6HEwPP8oxnz6jVg0Mp3Bcv6Dc4k3A5fzxS3j6gw5iX6Xy9h09B1xAewO+SS29EJhz+ZeN8b/9u//cJinbFoHvQdRpVCpHyQ+EtCXAXM3/IXTwY3lLfm9/Gm8EtPeokA8Eknmp8Rzo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
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/499859/Advanced%20Agma.user.js
// @updateURL https://update.greasyfork.org/scripts/499859/Advanced%20Agma.meta.js
// ==/UserScript==

/*
FIXIT: token isnt always grabbed
FIXIT: GM_ functions don't seem to work always so maybe use localStorage
       but that's kinda risky so maybe hash it with some values inside the script
TODO: message too long to fit in chat => wrap arround (well maybe not worth it)
*/

(function() {
    "use strict";

    if (unsafeWindow.top !== unsafeWindow.self)
        return;

    const settings = Object.assign({
        removeFood: true,
        removeAnimations: [3, 6, 7, 8, 11],
        maxStackableAnimations: 3,
        chatSize: 15,
        chatMaxRows: 12,
        discordChat: false,
        discordSavedChannels: [],
        discordPresence: false
    }, GM_getValue("settings", {}));

    const discordToken = GM_getValue("discordToken", null);
    if (settings.discordChat && unsafeWindow.location.href.startsWith("https://discord.com")) {
        if (!discordToken) {
            GM_setValue("discordToken", JSON.parse(unsafeWindow.localStorage.token));
            unsafeWindow.alert("Discord Chat for agma.io has updated your token !");
        }
        return;
    }
    const numberFormat = Intl.NumberFormat("fr-FR");
    const userprofiles = unsafeWindow.localStorage.userprofiles ? JSON.parse(unsafeWindow.localStorage.userprofiles) : {};
    if (settings.discordChat && !discordToken) {
        unsafeWindow.alert("Discord Chat can not work since you didnt log in into your browser with discord.\nIf you want to use the discord chat feature wait for an alert saying that your token has been saved.\n\nhttps://discord.com");
        settings.discordChat = false;
    }

    const discordPresence = {
        status: "online",
        since: 0,
        activities: [{
            name: "Agma.io",
            type: 0,
            url: "https://agma.io",
            details: "Playing Agma.io",
            timestamps: {
                start: Date.now()
            }
        }],
        afk: false
    };

    const animations = {
        1:  { name: "Recombine", style: "border-color: #337ab7; background-image: url('./img/store/recombine-min.png'); padding-left: 30px; padding-left: 30px;" },
        2:  { name: "Cell Select", style: "border-color: #fe3f3f;" },
        3:  { name: "Spin", style: "border-color: #b3b3b3;" },
        4:  { name: "360 Shot", style: "border-color: #337ab7; background-image: url('./img/push_lo.png'); padding-left: 30px;" },
        5:  { name: "Level Up", style: "border-color: #fe3f3f;" },
        6:  { name: "Flip Spin", style: "border-color: #b3b3b3;" },
        7:  { name: "Flip", style: "border-color: #b3b3b3;" },
        8:  { name: "Shake", style: "border-color: #b3b3b3;" },
        9:  { name: "Explosion", style: "border-color: #f0ad4e; background-image: url('./emotes/1f4a5.png'); padding-left: 30px;" },
        10: { name: "1st Medal", style: "border-color: #f0ad4e;" },
        11: { name: "Jump", style: "border-color: #b3b3b3;" },
        12: { name: "Wacky", style: "border-color: #f0ad4e; background-image: url('./emotes/1f61c.png'); padding-left: 30px;" },
        13: { name: "White cell for 1 frame", style: "border-color: #fe3f3f;" },
        14: { name: "Freeze", style: "border-color: #337ab7; background-image: url('./img/inv_freeze2.png'); padding-left: 30px;" },
        15: { name: "Speed", style: "border-color: #337ab7; background-image: url('./img/store/speed-min.png'); padding-left: 30px;" },
        16: { name: "Idk", style: "border-color: #fe3f3f;" }, // weird nothing
        17: { name: "Upgrade", style: "border-color: #fe3f3f;" },
        18: { name: "Snowball", style: "border-color: #fe3f3f;" },
        20: { name: "Anti freeze", style: "border-color: #337ab7; background-image: url('./skins/objects/20.png'); padding-left: 30px;" },
        21: { name: "Anti recombine", style: "border-color: #337ab7; background-image: url('./skins/objects/21.png'); padding-left: 30px;" },
        23: { name: "Shield", style: "border-color: #337ab7; background-image: url('img/inv_shield5.png'); color: rgba(82, 152, 203, 0.6); padding-left: 30px;" },
        24: { name: "Shield", style: "border-color: #337ab7; background-image: url('img/inv_shield5.png'); color: rgba(84, 211, 77, 0.6); padding-left: 30px;" },
        25: { name: "Shield", style: "border-color: #337ab7; background-image: url('img/inv_shield5.png'); color: rgba(243, 46, 46, 0.6); padding-left: 30px;" },
        26: { name: "Shield", style: "border-color: #337ab7; background-image: url('img/inv_shield5.png'); color: rgba(127, 59, 227, 0.6); padding-left: 30px;" },
        30: { name: "Wave", style: "border-color: #f0ad4e; background-image: url('./emotes/1f44b.png'); padding-left: 30px;" },
        31: { name: "Head Explosion", style: "border-color: #f0ad4e; background-image: url('./emotes/1f61cd.png'); padding-left: 30px;" },
        32: { name: "Hearts Face", style: "border-color: #f0ad4e; background-image: url('./emotes/1f60d.png'); padding-left: 30px;" },
        41: { name: "Angry Pumpkin", style: "border-color: #f0ad4e; background-image: url('./emotes/angry_emote3.png'); padding-left: 30px;" },
        42: { name: "Scared Pumpkin", style: "border-color: #f0ad4e; background-image: url('./emotes/scared_emote.png'); padding-left: 30px;" },
        43: { name: "Yawn Pumpkin", style: "border-color: #f0ad4e; background-image: url('./emotes/yawn_emote.png'); padding-left: 30px;" },
        44: { name: "Throwup", style: "border-color: #f0ad4e; background-image: url('./emotes/throwup.png'); padding-left: 30px;" },
        45: { name: "Hot face", style: "border-color: #f0ad4e; background-image: url('./emotes/hotface.png'); padding-left: 30px;" },
        46: { name: "Tears Joy", style: "border-color: #f0ad4e; background-image: url('./emotes/tearsjoy.png'); padding-left: 30px;" },
        47: { name: "No No", style: "border-color: #f0ad4e; background-image: url('./emotes/nonu.png'); padding-left: 30px;" },
        48: { name: "Clap", style: "border-color: #f0ad4e;" },
        49: { name: "Crying", style: "border-color: #f0ad4e;" },
        50: { name: "Devil Smile", style: "border-color: #f0ad4e;" },
        51: { name: "Eatman", style: "border-color: #f0ad4e;" },
        52: { name: "Trophy", style: "border-color: #f0ad4e;" },
        53: { name: "Hearts", style: "border-color: #f0ad4e;" }
    };
    const animationsIds = [
        1, 4, 14, 15, 20, 21, 23, 24, 25, 26, // Powers
        3, 6, 7, 8, 11, // Annoying
        9, 10, 12, 30, 31, 32, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, // Emotes
        2, 5, 13, 16, 17, 18 // System
    ];

    const discordIcon = new Image();
    discordIcon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAPCAMAAADTRh9nAAAAS1BMVEVHcExYZfJYZfJYZfJYZfJYZfJYZfJYZfJYZfJYZfJYZfJYZfJYZfJYZfJYZfJYZfJYZfJYZfJYZfJYZfJYZfJYZfJYZfJYZfJYZfLaTvQiAAAAGHRSTlMAGTDyq+e2/N/4CMgjf1vXSTaJZ5HSEHVuv+kNAAAAqElEQVQY02VQSRLDMAgjXvGSxGvC/19acNpDphwQyIA0BgDYDoN7Virv1hwbrFApEGm0FjVRSEq4aOgVJjJZwpsM5X9wjVYrhX/6BbbCLuiOxiK6HU66HQQsK/IVA5BlzwFyPtncIBps+eQWQYtgj2rym4pdrARYt3WSBcKkl9wivf/ZeSpwDDgc6hA0usEb3sHVp6eUt1pK3XIiP/sln3TPBt9o82YnH6drET/OdjF6AAAAAElFTkSuQmCC";
    const urlRegex = /https?:\/\/[^\s]+/g;
    const invisibleChar = "᠋";
    const wordsToReplace = ["https", "www", ".gg", ".com", ".io", ".net", ".biz", "miracle", "palestine"].map(word => [
        new RegExp(`\\b(${word})\\b`, "gi"),
        word[0] + invisibleChar + word.slice(1)
    ]);

    var discordUsername;
    var discordUserContext = null;

    var discordWebSocket;
    var discordHeartbeatInterval;
    var discordReconnectRetryCount = 0;
    const discordGatewayUrl = "wss://gateway.discord.gg/?v=9&encoding=json";
    const sentMessagesIds = [];
    const originalSend = WebSocket.prototype.send;
    const sendWebsocketDiscordMessage = (op, d) => originalSend.call(discordWebSocket, JSON.stringify({ op, d }));

    var chtTabs;
    var currentTab = '';
    var localChatMessages;
    var cellProtoOverwritten = false;
    let messageCacheKeys, messageKeys, animationKeys, cellMethods, cellKeys, defaultMessage = {};

    function initDiscordWebSocket() {
        discordWebSocket = new WebSocket(discordGatewayUrl);
        discordWebSocket.onopen = () => console.debug("[🔵] Connected");
        discordWebSocket.onmessage = handleMessage;
        discordWebSocket.onclose = () => {
            console.debug("[🔵] Disconnected");
            clearInterval(discordHeartbeatInterval);
            if (++discordReconnectRetryCount < 5) {
                initDiscordWebSocket();
            }
        };
    }
    function createDiscordChatMessage(message) {
        if (!message.channel_id || ![0, 19, 1, 2, 3, 6].includes(message.type) || sentMessagesIds.includes(message.id)) {
            return;
        }
        const channel = settings.discordSavedChannels.find(channel => channel.id == message.channel_id);
        if (!channel) {
            return;
        }
        sentMessagesIds.push(message.id);
        console.debug("[🔵] New message:", message);
        const tab = chtTabs.querySelector(`div[data-username="discord-${channel.id}"]`);
        if (!tab) {
            newDiscordTab(channel.name, channel.id);
        } else if (!tab.classList.contains('selected')) {
            tab.classList.add('blink');
            setTimeout(() => tab.classList.remove('blink'), 2000);
        }
        const author = message.author.global_name || message.author.username;
        switch (message.type) {
            case 0:  // DEFAULT
            case 19: // REPLY
                var content = message.content || '';
                message.mentions.forEach(mention => content = content.replaceAll(
                    `<@${mention.id}>`,
                    mention.global_name || mention.username
                ));
                if (message.attachments.length) {
                    content += ` +${message.attachments.length} files`;
                }
                localChatMessages.push({
                    ...defaultMessage,
                    [messageKeys[0]]: true,
                    get [messageKeys[1]]() {
                        discordUserContext = this.discordAuthor;
                        return -1;
                    },
                    [messageKeys[5]]: author,
                    [messageKeys[6]]: "discord-" + channel.id,
                    [messageKeys[7]]: discordUsername == message.author.username ? "#313338" : "#5662E9",
                    [messageKeys[8]]: content,
                    [messageKeys[16]]: Date.now(),
                    _cache: null,
                    get [messageKeys[17]]() {
                        return this._cache;
                    },
                    set [messageKeys[17]](value) {
                        value[messageCacheKeys[2]] = [ 14 ];
                        return this._cache = value;
                    },
                    discordAuthor: message.author
                });
                break;
            case 1: // RECIPIENT_ADD
            case 2: // RECIPIENT_REMOVE
                const member = message.mentions[0];
                localChatMessages.push({
                    ...defaultMessage,
                    [messageKeys[6]]: "discord-" + channel.id,
                    [messageKeys[7]]: message.type == 1 ? "#00FF00" : "#FF0000",
                    [messageKeys[8]]: `${message.type == 1 ? "➡️" : "⬅️"} ${member.global_name || member.username} ${message.type == 1 ? "joined" : "left"} the group`,
                    [messageKeys[16]]: Date.now(),
                    _cache: null,
                    get [messageKeys[17]]() {
                        return this._cache;
                    },
                    set [messageKeys[17]](value) {
                        value[messageCacheKeys[2]] = [ 14 ];
                        Object.defineProperties(value, {
                            [messageCacheKeys[1]]: { get: () => this[messageKeys[8]] },
                            [messageCacheKeys[8]]: { get: () => this[messageKeys[7]] }
                        });
                        return this._cache = value;
                    }
                });
                break;
            case 3: // CALL
                localChatMessages.push({
                    ...defaultMessage,
                    [messageKeys[6]]: "discord-" + channel.id,
                    [messageKeys[8]]: "#00FF00",
                    [messageKeys[8]]: author + " started a call",
                    [messageKeys[16]]: Date.now(),
                    _cache: null,
                    get [messageKeys[17]]() {
                        return this._cache;
                    },
                    set [messageKeys[17]](value) {
                        value[messageCacheKeys[2]] = [ 14 ];
                        Object.defineProperties(value, {
                            [messageCacheKeys[1]]: { get: () => this[messageKeys[8]] },
                            [messageCacheKeys[8]]: { get: () => this[messageKeys[7]] }
                        });
                        return this._cache = value;
                    }
                });
                break;
            case 6: // CHANNEL_PINNED_MESSAGE
                // message_reference: { message_id: "1259902171630145651", channel_id: "853556382417420298" }
                localChatMessages.push({
                    ...defaultMessage,
                    [messageKeys[6]]: "discord-" + channel.id,
                    [messageKeys[7]]: "#00FF00",
                    [messageKeys[8]]: author + " pinned a message",
                    [messageKeys[16]]: Date.now(),
                    _cache: null,
                    get [messageKeys[17]]() {
                        return this._cache;
                    },
                    set [messageKeys[17]](value) {
                        value[messageCacheKeys[2]] = [ 14 ];
                        Object.defineProperties(value, {
                            [messageCacheKeys[1]]: { get: () => this[messageKeys[8]] },
                            [messageCacheKeys[8]]: { get: () => this[messageKeys[7]] }
                        });
                        return this._cache = value;
                    }
                });
                break;
        }
    }
    function handleMessage(message) {
        const { op, t, d } = JSON.parse(message.data);
        switch (op) {
            case 10: // Hello
                console.debug("[🔵] Connection accepted");
                discordHeartbeatInterval = setInterval(() => sendWebsocketDiscordMessage(1, null), d.heartbeat_interval);
                sendWebsocketDiscordMessage(2, {
                    token: discordToken,
                    capabilities: 30717,
                    properties: {}
                });
                settings.discordPresence && setTimeout(() => sendWebsocketDiscordMessage(3, discordPresence), 2000);
                break;
            case 0: // Dispatch
                switch (t) {
                    case "MESSAGE_CREATE":
                        createDiscordChatMessage(d);
                        break;
                    case "READY":
                        discordUsername = d.user?.username || discordUsername;
                        console.debug("[🔵] Logged as", discordUsername);
                        break;
                    // default:
                    //     console.debug("[🔵] Unhandled message type:", t);
                }
                break;
            case 1: // HEARTBEAT
                sendWebsocketDiscordMessage(1, null);
                break;
            case 11: // HEARTBEAT_ACK
                break;
            default:
                console.debug("[🔵] Unhandled opcode type:", op);
        }
    }
    function findUrlToOpen(event) {
        const x = event.clientX - event.target.offsetLeft,
              y = event.clientY - event.target.offsetTop;
        for (const message of localChatMessages)
            if (message[messageKeys[17]] && message[messageKeys[17]].urls)
                for (const { url, rect } of message[messageKeys[17]].urls)
                    if (x >= rect.x0 && y >= rect.y0 && x <= rect.x1 && y <= rect.y1)
                        unsafeWindow.open(url, '_blank');
    }
    function timeFormat(s) {
        const h = Math.floor(s / 3600);
        const m = Math.floor(s % 3600 / 60);
        return (h ? h + 'h ' : '') + (m ? m + 'm ' : '') + Math.floor(s % 3600 % 60) + 's';
    }
    function getTable(payload) {
        if (payload == null)
            return "<table style=\"width: 100%; text-align: left;\"><tr><td>Player not registered</td><tr><td>You need to play at least 1 game of batle royale to be registered on <a href=\"https://agma.io/stats.php\" target=\"_blank\">Agma Stats</a></td></tr></table>";
        return (
            "<table style=\"width: 100%; text-align: left;\"><tr><td>Players Consumed: </td><td>"
            + numberFormat.format(payload.players_consumed)
            + "</td></tr><tr><td>Death Count: </td><td>"
            + numberFormat.format(payload.death_count)
            + "</td></tr><tr><td>K/D: </td><td>"
            + (payload.players_consumed / payload.death_count).toFixed(2)
            + "</td></tr><tr><td>Splits count: </td><td>"
            + numberFormat.format(payload.splits_count)
            + "</td></tr><tr><td>Total time alive: </td><td>"
            + timeFormat(payload.total_time_alive)
            + "</td></tr><tr><td>Splits per seconds: </td><td>"
            + (payload.splits_count / payload.total_time_alive).toFixed(2)
            + "</td></tr></table>"
        );
    }

    let flag = false
    const originalMax = unsafeWindow.Math.max;
    unsafeWindow.Math.max = function(...args) {
        flag = false;
        if (args.length == 2) {
            if (args[1] == 8) {
                args[0] = settings.chatSize;
            } else if (args[1] == 3) {
                flag = true;
            }
        }
        return originalMax(...args);
    };
    const originalMin = unsafeWindow.Math.min;
    unsafeWindow.Math.min = function(...args) {
        if (flag && !(flag = false) && args.length == 2 && args[0] == 12)
            return settings.chatMaxRows;
        return originalMin(...args);
    };
    const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
    unsafeWindow.CanvasRenderingContext2D.prototype.drawImage = function() {
        if (arguments[0] instanceof Image && arguments[0].src.startsWith("https://agma.io/img/chaticons") && arguments[1] == 280) {
            arguments[0] = discordIcon;
            arguments[1] = 0;
            arguments[6] += 3;
        }
        return originalDrawImage.apply(this, arguments);
    }
    const originalReplace = unsafeWindow.String.prototype.replace;
    unsafeWindow.String.prototype.replace = function(pattern, replacement) {
        return originalReplace.call(this, pattern, replacement instanceof Function && pattern instanceof RegExp && pattern.source.startsWith(":rolling") ? (match, offset) => match == ":/" && this?.[offset + 1] == '/' ? match : replacement(match, offset) : replacement);
    }
    const originalPush = unsafeWindow.Array.prototype.push;
    unsafeWindow.Array.prototype.push = function(elem) {
        if (elem?.goldMember !== undefined && elem?.time !== undefined) { // not very consistent but whatever
            if (!messageKeys) {
                messageKeys = Object.getOwnPropertyNames(elem);
                defaultMessage = {
                    [messageKeys[0]]: false,
                    [messageKeys[1]]: 0,
                    [messageKeys[2]]: 0,
                    [messageKeys[3]]: 0,
                    [messageKeys[4]]: 0,
                    [messageKeys[5]]: '',

                    [messageKeys[9]]: 2,
                    [messageKeys[10]]: 0,
                    [messageKeys[11]]: 0,
                    [messageKeys[12]]: 0,
                    [messageKeys[13]]: 0,
                    [messageKeys[14]]: 0,
                    [messageKeys[15]]: 0,
                };
            }
            if (localChatMessages != this)
                unsafeWindow.localChatMessages = localChatMessages = this;
            if ((elem[messageKeys[8]] = elem[messageKeys[8]].replaceAll(invisibleChar, "")).includes("https://")) {
                Object.defineProperty(elem, messageKeys[17], {
                    get: function() {
                        return this._cache;
                    },
                    set: function(cache) {
                        if (!messageCacheKeys)
                            messageCacheKeys = Object.getOwnPropertyNames(cache);
                        if (elem._cache !== undefined) {
                            cache[messageCacheKeys[3]] = [ 14 ];
                            // see if this breaks calls and stuff but shouldnt
                        }
                        Object.defineProperty(cache, messageCacheKeys[15], {
                            get: function() {
                                return this._ctx;
                            },
                            set: function(ctx) {
                                ctx.fillText = function(text, x, y) {
                                    if (this.fillStyle != "#f5f6ce" && this.fillStyle != "#444444") {
                                        return CanvasRenderingContext2D.prototype.fillText.call(this, text, x, y);
                                    }
                                    // ngl I asked chatgpt cuz Im lazy (and I edited some stuff)
                                    let match;
                                    let lastIndex = 0;
                                    let currentX = x;
                                    cache.urls = [];
                                    while ((match = urlRegex.exec(text)) != null) {
                                        const url = match[0];
                                        const urlStart = match.index;
                                        const urlEnd = urlStart + url.length;

                                        const preText = text.slice(lastIndex, urlStart);
                                        if (preText) {
                                            CanvasRenderingContext2D.prototype.fillText.call(this, preText, currentX, y);
                                            currentX += ctx.measureText(preText).width;
                                        }
                                        ctx.save();
                                        ctx.fillStyle = "#1E90FF";
                                        CanvasRenderingContext2D.prototype.fillText.call(this, url, currentX, y);

                                        const urlWidth = ctx.measureText(url).width;
                                        const textSize = parseInt(ctx.font.match(/\d+/), 10);
                                        const underlineY = y + 2;

                                        ctx.beginPath();
                                        ctx.moveTo(currentX, underlineY);
                                        ctx.lineTo(currentX + urlWidth, underlineY);
                                        ctx.strokeStyle = '#1E90FF';
                                        ctx.lineWidth = 1;
                                        ctx.stroke();
                                        ctx.restore();
                                        cache.urls.push({
                                            url,
                                            rect: {
                                                x0: currentX,
                                                yd0: y - textSize,
                                                x1: currentX + urlWidth,
                                                yd1: y
                                            }
                                        });
                                        currentX += urlWidth;
                                        lastIndex = urlEnd;
                                    }
                                    const remainingText = text.slice(lastIndex);
                                    if (remainingText) {
                                        CanvasRenderingContext2D.prototype.fillText.call(this, remainingText, currentX, y);
                                    }
                                }
                                return this._ctx = ctx;
                            },
                            configurable: true
                        });
                        return this._cache = cache;
                    },
                    configurable: true
                });
            }
        } else if (elem?.ch !== undefined && elem?.x0 !== undefined) {
            elem.ch[messageKeys[17]]?.urls?.forEach(urlObject => {
                urlObject.rect.y0 = urlObject.rect.yd0 + elem.y0;
                urlObject.rect.y1 = urlObject.rect.yd1 + elem.y0;
            });
        } else if (elem?.namePart !== undefined && elem?.clanPart !== undefined) { // not very consistent but whatever
            if (!cellProtoOverwritten) {
                cellMethods = Object.getOwnPropertyNames(elem.constructor.prototype);
                cellKeys = Object.getOwnPropertyNames(elem);
                if (settings.removeAnimations.length)
                    elem.constructor.prototype[cellMethods[8]] = function(animation) {
                        if (!animationKeys)
                            animationKeys = Object.getOwnPropertyNames(animation);
                        if (1 == this[cellKeys[46]] || settings.removeAnimations.includes(animation[animationKeys[0]])) return;
                        animation = { ...animation };
                        if (this[cellKeys[42]]) {
                            for (let i = 0; i < this[cellKeys[42]].length; i++) {
                                if (this[cellKeys[42]][i][animationKeys[2]] > animation[animationKeys[2]]) {
                                    this[cellKeys[42]].splice(i, 0, animation);
                                    if (this[cellKeys[42]].length > settings.maxStackableAnimations) {
                                        this[cellKeys[42]].splice(this[cellKeys[42]].length - 2, 1);
                                    }
                                    return;
                                }
                            }
                            if (this[cellKeys[42]].length < settings.maxStackableAnimations) {
                                originalPush.call(this[cellKeys[42]], animation);
                            } else {
                                this[cellKeys[42]][this[cellKeys[42]].length - 1] = animation;
                            }
                        } else {
                            this[cellKeys[42]] = [animation];
                        }
                    }
                cellProtoOverwritten = true;
            }
            if (settings.removeFood && elem[cellKeys[47]]) // elem[cellKeys[46]] === 1
                return 0;
        }
        return originalPush.apply(this, arguments);
    }

    unsafeWindow.setAnimation = (id, value) => settings.removeAnimations[settings.removeAnimations.includes(id) ? 'remove' : 'push'](id);
    unsafeWindow.setCustomChatSize = value => settings.chatSize = parseInt(value);
    unsafeWindow.setCustomChatMaxRows = value => settings.chatMaxRows = parseInt(value);
    unsafeWindow.setMaxStackableAnimations = value => settings.maxStackableAnimations = parseInt(value);
    unsafeWindow.setRemoveFood = value => settings.removeFood = value;
    unsafeWindow.setDiscordChat = value => {
        if (settings.discordChat = value) {
            !discordWebSocket && initDiscordWebSocket();
        } else if (discordWebSocket != null) {
            discordWebSocket.close();
            discordWebSocket = null;
        }
    };
    unsafeWindow.setDiscordPresenceChat = value => settings.discordPresence = value;
    unsafeWindow.newDiscordTab = (name, channel) => chtTabs && (chtTabs.innerHTML += `<div data-category="2" data-username="discord-${channel}" data-insert data-tooltip="Discord chat: ${name}" class="chat-tab semi-selected">${name}</div>`);
    /*
    // could make your own messages show up faster but too annoying so no
    createDiscordChatMessage({
        id: null,
        channel_id: channel,
        type: 0,
        author: discordUser,
        content
    });
    */
    unsafeWindow.sendDiscordMessage = (channel, content) => settings.discordChat && discordUsername && fetch(`https://discord.com/api/v9/channels/${channel}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': discordToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content,
            tts: false
        })
    })
        .then(async response => createDiscordChatMessage(await response.json()))
        .catch(error => console.error('[🔵] Error while trying to send a message:', error));

    var loaded = false;
    unsafeWindow.addEventListener("load", () => {
        if (loaded || typeof swal == "undefined") return;
        loaded = true;
        const chtCanvas = document.getElementById("chtCanvas");
        chtCanvas.addEventListener("dblclick", findUrlToOpen);
        chtCanvas.addEventListener("click", event => event.ctrlKey && findUrlToOpen(event));
        document.getElementById("chtbox").addEventListener("keydown", function(event) {
            if (event.keyCode == 13) {
                if (!currentTab && this.value.startsWith("/discord ")) {
                    const args = this.value.slice(9).split(' ');
                    const channelName = args.shift();
                    this.value = args.join(' ').trim();
                    const channel = settings.discordSavedChannels.find(channel => channel.name == channelName);
                    if (channel && !chtTabs.querySelector(`div[data-username="discord-${channel.id}"]`)) {
                        newDiscordTab(channelName, channel.id);
                    }
                    if (this.value) {
                        sendDiscordMessage(channel.id, this.value);
                        this.value = '';
                    }
                } else if (currentTab.startsWith("discord-")) {
                    if (this.value = this.value.trim()) {
                        sendDiscordMessage(currentTab.slice(8), this.value);
                        this.value = '';
                    }
                } else {
                    for (const [reg, rep] of wordsToReplace) {
                        this.value = this.value.replaceAll(reg, rep);
                    }
                }
            }
        });
        // Script devs so annoying can't even use that for settings pages
        // typeof GM_info == "undefined" ? Date.now() : GM_info?.script?.position + 3;
        const settingPageId = Math.random() * 10e17;
        chtTabs = document.getElementById("chtTabs");
        chtTabs.addEventListener("click", () => setTimeout(() => currentTab = chtTabs.querySelector("div.chat-tab.selected").dataset.username, 1));
        $('#settingTab2').after(`<button id="settingTab${settingPageId}" class="setting-tablink" onclick="openSettingPage(${settingPageId});">Advanced</button>`);
        $('#settingPage3').after(`
            <div id="settingPage${settingPageId}" class="setting-tabcontent">
                <div class="col-md-10 col-md-offset-1 stng" style="padding-left:20px;padding-right:10px;max-height:550px;overflow-y:auto;overflow-x:hidden;margin:0;width:calc(100% - 5px);">
                    <span style="margin:0;" class="hotkey-paragraph"> Animations</span>
                    <div class="row stng-row" style="font-size:14px;">
                        <div style="width:100%;padding:4px;">
                            <div style="display:flex;flex-wrap:wrap;padding:0px;width:100%;">
                                ${animationsIds.map(id => `<div style="${animations[id].style}" onclick="setAnimation(${id}, !this.classList.toggle('disabled'));" class="emote${settings.removeAnimations.includes(id) ? " disabled" : ''}">${animations[id].name}</div>`).join('')}
                            </div>
                        </div>
                    </div>
                    <span style="margin:0;" class="hotkey-paragraph"> Other</span>
                    <div class="row stng-row" style="font-size:14px;">
                        <label>
                            <input type="number" min="1" value="${settings.chatSize}" onchange="setCustomChatSize(this.value);">
                            <span> Custom Chat Size *</span>
                        </label>
                        <br>
                        <label>
                            <input type="number" min="1" value="${settings.chatMaxRows}" onchange="setCustomChatMaxRows(this.value);">
                            <span> Custom Chat Max Rows *</span>
                        </label>
                        <br>
                        <label>
                            <input type="number" min="0" value="${settings.maxStackableAnimations}" onchange="setMaxStackableAnimations(this.value);">
                            <span> Stackable Animations *</span>
                        </label>
                        <br>
                        <label>
                            <input type="checkbox" onchange="setRemoveFood(this.checked);" ${settings.removeFood ? " checked" : ''}>
                            <span> Remove Food *</span>
                        </label>
                    </div>
                    <span style="margin:0;" class="hotkey-paragraph"> Discord</span>
                    <div class="row stng-row" style="font-size:14px;">
                        <label>
                            <input type="checkbox" onchange="setDiscordChat(this.checked);" ${settings.discordChat ? " checked" : ''}>
                            <span> Discord Chat *</span>
                        </label>
                        <br>
                        <label>
                            <input type="checkbox" onchange="setDiscordPresenceChat(this.checked);" ${settings.discordPresence ? " checked" : ''}>
                            <span> Discord Agma.io Presence *</span>
                        </label>
                        <br>
                        <label>
                            <span> Discord Saved Channels *</span>
                            <textarea id="discordSavedChannels" style="resize: vertical; min-height: 100px; width: 100%;" placeholder="agma.io,942193976063197214\nname,channelId">${settings.discordSavedChannels.map(channel => channel.name + ',' + channel.id).join('\n')}</textarea>
                        </label>
                    </div>
                </div>
            </div>
        `);
        const discordSavedChannelsTextarea = document.getElementById("discordSavedChannels");
        discordSavedChannelsTextarea.addEventListener("blur", function(event) {
            settings.discordSavedChannels = [];
            for (const line of this.value.split('\n')) {
                let [name, id] = line.split(',');
                name = name?.trim();
                id = id?.trim();
                if (name && id) {
                    settings.discordSavedChannels.push({ name, id });
                } else {
                    swal('Invalid channels', 'Please ensure each line has exactly one comma separating the key and value.', 'error');
                    break;
                }
            }
        });
        discordSavedChannelsTextarea.addEventListener("keydown", function(event) {
            event.stopPropagation();
        });
        const style = document.createElement("style");
        style.innerHTML = `
            #settingPage${settingPageId}#settingPage${settingPageId} input[type="number"]::-webkit-outer-spin-button,
            #settingPage${settingPageId} input[type="number"]::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            #settingPage${settingPageId} input[type="number"] {
                -moz-appearance: textfield;
            }
            #settingPage${settingPageId} input[type="number"] {
                max-width: 30px;
            }
            div.chat-tab[data-username^="discord-"] {
                background: #4954c5;
            }
            #settingPage${settingPageId} > div::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            #settingPage${settingPageId} > div::-webkit-scrollbar-track {
                background: #282934;
                border-radius: 10px;
            }
            #settingPage${settingPageId} > div::-webkit-scrollbar-thumb {
                background-color: #df8500;
                border-radius: 10px;
                border: 2px solid #282934;
            }
            #settingPage${settingPageId} div.emote {
                min-width: 30px;
                height: 30px;
                padding: 3px;
                border-radius: 5px;
                border-width: 1px;
                border-style: solid;
                margin: 4px;
                background-size: contain;
                background-repeat: no-repeat;
                cursor: pointer;
                text-overflow: ellipsis;
            }
            #settingPage${settingPageId} div.emote.disabled {
                text-decoration: line-through;
                text-decoration-thickness: 3px;
                text-decoration-color: red;
            }
        `;
        document.body.appendChild(style);

        const originalFind = $.prototype.find;
        unsafeWindow.$.prototype.find = function() {
            const res = originalFind.apply(this, arguments);
            if (
                discordUserContext
                && this.selector == "#contextMenu"
                && arguments?.[0] == "li.enabled.hover"
                && res?.length
            ) {
                if (res[0].id == "contextUserProfile") {
                    swal({
                        title: `<img src="https://cdn.discordapp.com/avatars/${discordUserContext.id}/${discordUserContext.avatar}" width="128" height="128" style="border-radius:50%;"><br><br><span>${discordUserContext.global_name || discordUserContext.username}</span><br><span style="font-size:12px;">${discordUserContext.username}</span>`,
                        html: true
                    });
                    return [];
                } else if (res[0].id == "contextDiscordMention") {
                    document.getElementById("chtbox").value += `<@${discordUserContext.id}> `;
                    return [];
                }
            }
            return res;
        }
        const originalAddClass = $.prototype.addClass;
        unsafeWindow.$.prototype.addClass = function() {
            if (discordUserContext && this.selector == "#contextMute") {
                $("#contextDiscordMention").show();
                originalAddClass.call($("#contextUserProfile"), "enabled");
                $("#contextPlayerSkin").css({ 'background-image': `url(https://cdn.discordapp.com/avatars/${discordUserContext.id}/${discordUserContext.avatar})` });
                $("#contextPartyLeave").hide();
                $("#contextPartyMessage").hide();
                $("#contextModerate").hide();
                $("#contextPartyInvite").hide();
                $("#contextFriendAdd").hide();
                $("#contextPrivateMessage").hide();
                $("#contextSpectate").hide();
                $("#contextPickpocket").hide();
                $("#contextMute").hide();
                return this;
            }
            return originalAddClass.apply(this, arguments);
        }
        const originalHide = $.prototype.hide;
        unsafeWindow.$.prototype.hide = function() {
            if (discordUserContext && this.selector == "#contextMenu") {
                $("#contextDiscordMention").hide();
                $("#contextPartyLeave").show();
                $("#contextPartyMessage").show();
                $("#contextModerate").show();
                $("#contextPartyInvite").show();
                $("#contextFriendAdd").show();
                $("#contextPrivateMessage").show();
                $("#contextSpectate").show();
                $("#contextPickpocket").show();
                $("#contextMute").show();
                discordUserContext = null;
            }
            return originalHide.apply(this, arguments);
        }
        $("#contextUserProfile").after('<li id="contextDiscordMention" class="contextmenu-item enabled" style="display: none;"><div class="fa fa-at fa-2x context-icon"></div><p>Mention</p></li>');

        let waitingResponse = false;
        const originalSwal = unsafeWindow.swal;
        unsafeWindow.swal = function() {
            if (
                !discordUserContext
                && typeof arguments[0] == "object"
                && "title" in arguments[0]
                && arguments[0].title.startsWith("<img src=\"")
            ) {
                if (waitingResponse) {
                    return;
                }
                const username = arguments[0].title.match(/>([^>]+)<\/span>/)?.[1];
                if (!username) {
                    return originalSwal.apply(this, arguments);
                }
                if (Date.now() - userprofiles[username]?.at < 86400000) {
                    arguments[0].text += getTable(userprofiles[username].data);
                } else {
                    waitingResponse = true;
                    $.getJSON("https://agma.io/royale_stats.php?user=" + username, payload => {
                        userprofiles[username] = { at: Date.now(), data: payload };
                        arguments[0].text += getTable(payload);
                        waitingResponse = false;
                        originalSwal.apply(this, arguments);
                    }).fail(() => {
                        userprofiles[username] = { at: Date.now(), data: null };
                        arguments[0].text += getTable(null);
                        waitingResponse = false;
                        originalSwal.apply(this, arguments);
                    }).always(() => {
                        waitingResponse = false;
                    });
                    return;
                }
            }
            return originalSwal.apply(this, arguments);
        }
        unsafeWindow.swal.close = originalSwal.close;
    });
    unsafeWindow.addEventListener("beforeunload", () => {
        discordWebSocket && discordWebSocket.close();
        GM_setValue("settings", settings);
        unsafeWindow.localStorage.userprofiles = JSON.stringify(userprofiles);
    });
    settings.discordChat && initDiscordWebSocket();
    console.log(`%cAdvanced Agma - ${GM_info?.script?.version} Loaded`, "font-weight: bold; font-size: 20pt; color: black;");
})();