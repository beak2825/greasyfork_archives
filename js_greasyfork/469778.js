// ==UserScript==
// @name ⚡Electric Mod⚡
// @author ElectricSherbert
// @version 1.0
// @description Electric Mod For MooMoo.io / Features: GUI Changes, cps counter(dosent work), gold bots (u can also spawn as a fake one if u want to lol), 100+ res, and thats all for this version
// @match *://moomoo.io/*
// @match *://sandbox.moomoo.io/*
// @match *://dev.moomoo.io/*
// @icon  https://moomoo.io/img/favicon.png?v=1
// @namespace https://greasyfork.org/users/1007003
// @downloadURL https://update.greasyfork.org/scripts/469778/%E2%9A%A1Electric%20Mod%E2%9A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/469778/%E2%9A%A1Electric%20Mod%E2%9A%A1.meta.js
// ==/UserScript==
alert("Electric Mod Made By ElectricSherbert")

document.title = "Electric Mod By ElectricSherbert"

document.getElementById('enterGame').innerHTML = 'Strike People...';
document.getElementById('loadingText').innerHTML = 'Striking the lighting...';
document.getElementById('nameInput').placeholder = "Strike your name here";
document.getElementById('chatBox').placeholder = "ayo";
document.getElementById('diedText').innerHTML = 'You Got Electrified';
document.getElementById('diedText').style.color = "#b3d5e0";

document.getElementById("storeHolder").style = "height: 1500px; width: 450px;"

document.getElementById('adCard').remove();
document.getElementById('errorNotification').remove();
document.getElementById("enterGame").style.color="#b3d5e0";
document.getElementById("leaderboard").style.color = "#b3d5e0";
document.getElementById("gameName").style.color = "#b3d5e0";
document.getElementById("setupCard").style.color = "#b3d5e0";
document.getElementById("gameName").innerHTML = "⚡Electric Mod⚡"
document.getElementById("promoImg").remove();
document.getElementById("scoreDisplay").style.color = "#b3d5e0";
document.getElementById("woodDisplay").style.color = "#b3d5e0";
document.getElementById("stoneDisplay").style.color = "#b3d5e0";
document.getElementById("killCounter").style.color = "#b3d5e0";
document.getElementById("foodDisplay").style.color = "#b3d5e0";
document.getElementById("ageText").style.color = "#b3d5e0";
document.getElementById("allianceButton").style.color = "#b3d5e0";
document.getElementById("chatButton").style.color = "#b3d5e0";
document.getElementById("storeButton").style.color = "#b3d5e0";
document.getElementById("enterGame").style.color="#b3d5e0";

setInterval(() => window.follmoo && follmoo(), 10);

var cps = 0;
var CpsMenu = document.createElement("div");
CpsMenu.style.padding = "5px";
CpsMenu.id = "CpsDiv";
CpsMenu.style.font = "40px Arial";
CpsMenu.style.display = "block";
CpsMenu.style.position = "fixed";
CpsMenu.style.top = "3%";
CpsMenu.style.left = "0%";
CpsMenu.textContent = "Cps: ";
document.body.appendChild(CpsMenu);
setInterval(()=>{
    CpsMenu.textContent = "Cps: "+cps;
}, 5);

const BOT_NAME = "Electric Bot";
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

function isFuncNative(f) {
    return (
        !!f &&
        (typeof f).toLowerCase() == "function" &&
        (f === Function.prototype ||
         /^\s*function\s*(\b[a-z$_][a-z0-9$_]*\b)*\s*\((|([a-z$_][a-z0-9$_]*)(\s*,[a-z$_][a-z0-9$_]*)*)\)\s*{\s*\[native code\]\s*}\s*$/i.test(
            String(f)
        ))
    );
}

var ws;
document.msgpack = msgpack;

var wsFinder = setInterval(() => {
    if (isFuncNative(WebSocket.prototype.send)) {
        WebSocket.prototype.os = WebSocket.prototype.send;
        WebSocket.prototype.send = function(m) {
            if (!ws) {
                ws = this;
                document.ws = this;
                this.addEventListener('message', function (um) {
                    handleMessage(um);
                });
                if (ws) clearInterval(wsFinder);
            }
            this.os(m);
        }
    } else {
        ws = document.ws;
        ws.addEventListener('message', function (um) {
            handleMessage(um);
        });
        if (ws) clearInterval(wsFinder);
    }
}, 500);

function doNewSend(message) {
    ws.send(new Uint8Array(Array.from(msgpack.encode(message))));
}

function handleMessage(msg) {
    let temp = msgpack.decode(new Uint8Array(msg.data));
    /* process the packet */
    let data;
    if(temp.length > 1) {
        data = [temp[0], ...temp[1]];
    } else {
        data = temp;
    }
    let item = data[0];
    if(!data) {return};
    /* process end */
    if (item == '11') { // death packet
        isGoldBot = false;
    }
    else if (item == '33') {
        if (isGoldBot) doNewSend(['8', [decorate('supermd')]]);
    }
}

document.querySelector('#enterGame').addEventListener('click', (e) => {autoCh = false;})

var goldBotBtn = document.createElement('button');
goldBotBtn.setAttribute('class', 'menuButton');
var goldBotInnerText = document.createElement('span');
goldBotInnerText.innerText = "Spawn as a fake gold bot";
goldBotBtn.appendChild(goldBotInnerText);
document.getElementById('setupCard').appendChild(document.createElement('br'))
document.getElementById('setupCard').appendChild(goldBotBtn);

goldBotBtn.onclick = (e) => {
    doNewSend(['sp', [{name: 'gold bots', moofoll: 1, skin: '__proto__'}]]);
    if (!localStorage.notFirstTimeGoldBot) {
        localStorage.notFirstTimeGoldBot = '1';
        alert("Press K to enable/disable gold bot autochat! (this message won't appear anymore, don't worry)"); // info
    }
    isGoldBot = true;
    doNewSend(['8', [decorate('supermd')]])
    autoCh = true;
}

var isGoldBot = false;
var autoCh = false;
// sorry supermd devs, i have to steal your genrand
function decorate(m) {
    let result = m.split("");
    result = result.map(e => {return Math.random() > 0.7 ? (
        Math.random() > 0.5 ? "_" : "-"
    ) : e });
    return result.join(""); // dont hunt me down pls i have a family
}

setInterval(() => {
    if (autoCh) doNewSend(['ch', [decorate('i am super pro')]]);
}, 1000)

if (!localStorage.toggleFakeGoldBotKey) {
    localStorage.toggleFakeGoldBotKey = 'KeyK'; // don't change this on the script, go to the moomoo tab and type localStorage.toggleFakeGoldBotKey = '<enter your key here>';
}

document.addEventListener('keydown', (e) => {
    if (document.activeElement == document.body) {
        if (isGoldBot && (e.code == localStorage.toggleFakeGoldBotKey)) {
            autoCh = !autoCh;
        }
    }
});

