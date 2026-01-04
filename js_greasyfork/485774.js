// ==UserScript==
// @name        Biome hat Alpha 0.2v
// @namespace   Violentmonkey Scripts
// @match       *://sandbox.moomoo.io/*
// @match       *://moomoo.io/*
// @grant        none
// @version      0.2
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @require      https://unpkg.com/guify@0.12.0/lib/guify.min.js
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/msgpack-lite/0.1.26/msgpack.min.js
// @require 	   https://greasyfork.org/scripts/478839-moomoo-io-packet-code/code/MooMooio%20Packet%20Code.js?version=1274028
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @author      Zexus
// @license     MIT
// @description Biome hat Alpha
// @downloadURL https://update.greasyfork.org/scripts/485774/Biome%20hat%20Alpha%2002v.user.js
// @updateURL https://update.greasyfork.org/scripts/485774/Biome%20hat%20Alpha%2002v.meta.js
// ==/UserScript==

let ws;
let x = 0;
let y = 0;
let msgpack5 = window.msgpack;
let scale = 45;
let placeOffset = 5;

let myPlayer = {
    sid: null,
    hp: null,
    x: null,
    y: null,
    dir: null,
    buildIndex: null,
    weaponIndex: null,
    weaponVariant: null,
    team: null,
    isLeader: null,
    skinIndex: null,
    tailIndex: null,
    iconIndex: null
};

let enemy = [];
let nearestEnemy = null;
let enemyInf = { hat: null, x: null, y: null, weaponIndex: null }

document.msgpack = window.msgpack;

WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (e) {
    ws || (document.ws = this, ws = this, document.ws.addEventListener("message", hookWS));
    this.oldSend(e);
};

function dist(a, b){
    return Math.sqrt( Math.pow((b.y-a[2]), 2) + Math.pow((b.x-a[1]), 2) );
}

let join = message => Array.isArray(message) ? [...message] : [...message];

let hookWS = ms => {
    let tmpData = msgpack5.decode(new Uint8Array(ms.data));
    let data;
    if(tmpData.length > 1) {
        data = [tmpData[0], ...tmpData[1]];
        if (data[1] instanceof Array){
            data = data
        }
    } else {
        data = tmpData
    }
    let item = data[0];
    if(!data) {return};

    if (item == "C" && myPlayer.sid == null){
        myPlayer.sid = data[1];
    }

    if (item == "a") {
        enemy = [];
        for(let i = 0; i < data[1].length / 13; i++) {
            let inf = data[1].slice(13*i, 13*i+13);
            if(inf[0] == myPlayer.sid) {
                myPlayer.x = inf[1];
                myPlayer.y = inf[2];
                myPlayer.dir = inf[3];
                myPlayer.buildIndex = inf[4];
                myPlayer.weaponIndex = inf[5];
                myPlayer.weaponVariant = inf[6];
                myPlayer.team = inf[7];
                myPlayer.isLeader = inf[8];
                myPlayer.skinIndex = inf[9];
                myPlayer.tailIndex = inf[10];
                myPlayer.iconIndex = inf[11];
            } else if(inf[7] != myPlayer.team || inf[7] === null) {
                enemy.push(inf);
            }
        }
    }
};

setInterval(function() {
    if (myPlayer.y > 6850 && myPlayer.y < 7550) {
        storeEquip(31);
    }
}, 130);

setInterval(function() {
    if (myPlayer.y < 2400) {
       storeEquip(15);
    }
}, 200);