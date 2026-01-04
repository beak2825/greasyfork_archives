// ==UserScript==
// @name         Fake Gold Bot Troll
// @namespace    -
// @version      1.0
// @description  Pretend to be a gold bot! This script adds a button to spawn as a fake gold bot.
// @author       i30cps
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @require https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js?version=912797
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447788/Fake%20Gold%20Bot%20Troll.user.js
// @updateURL https://update.greasyfork.org/scripts/447788/Fake%20Gold%20Bot%20Troll.meta.js
// ==/UserScript==

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