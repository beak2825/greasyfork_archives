
// ==UserScript==
// @name         MooMoo.io - Best AntiInsta
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This is antiinsta and not autoheal
// @author       CorruptoDev
// @match        *://*.moomoo.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @grant        none
// @run-at       document-end
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/452761/MooMooio%20-%20Best%20AntiInsta.user.js
// @updateURL https://update.greasyfork.org/scripts/452761/MooMooio%20-%20Best%20AntiInsta.meta.js
// ==/UserScript==

var antiP = false;

setInterval(()=>{
    dns([["2"],[Number.MAX_VALUE]])
    if (am) {
        place(millType),place(millType,myPlayer.dir - 1.5),place(millType,myPlayer.dir + 1.5);
    }
},1);

let am = false;

CanvasRenderingContext2D.prototype.moveTo = function(){}
CanvasRenderingContext2D.prototype.rotate = function(){}

function dns(data) {
    newSend(data);
}
setInterval(()=>{
WebSocket.prototype.close = function(){return 0};
},10);

function doHatCycle() {
    dns(["13c", [0, 11, 0]]); dns(["13c", [0, 21, 1]]); setTimeout(function () {
        dns(["13c", [0, 12, 0]]); dns(["13c", [0, 18, 1]])
    }, 10); setTimeout(function () {
        dns(["13c", [0, 55, 0]]); dns(["13c", [0, 13, 1]])
    }, 80); setTimeout(function () {
        dns(["13c", [0, 40, 0]]); dns(["13c", [0, 19, 1]])
    }, 100); setTimeout(function () {
        dns(["13c", [0, 12, 0]]); dns(["13c", [0, 21, 1]])
    }, 150); setTimeout(function () {
        dns(["13c", [0, 26, 0]]); dns(["13c", [0, 13, 1]])
    }, 200); setTimeout(function () {
        dns(["13c", [0, 12, 0]]); dns(["13c", [0, 19, 1]])
    }, 250); setTimeout(function () {
        dns(["13c", [0, 21, 0]]); dns(["13c", [0, 18, 1]])
    }, 300); setTimeout(function () {
        dns(["13c", [0, 53, 0]]); dns(["13c", [0, 21, 1]])
    }, 350)
};


let {
    primary,
    secondary,
    foodType,
    wallType,
    spikeType,
    spawned,
    millType,
    autosecondary,
    mineType,
    boostType,
    turretType,
    spawnpadType,
    baitType
} = {
    primary: null,
    secondary: null,
    foodType: null,
    wallType: null,
    spikeType: null,
    millType: null,
    mineType: null,
    boostType: null,
    turretType: null,
    spawnpadType: null,
    baitType: null
}
window.onbeforeunload = null;
var nearestEnemy;
var nearestEnemyAngle;
function newSend(a) {
    socketsender(a);
}
function doNewSend(m) {
    newSend(m);
}


let mouseX;
let mouseY;
let width;
let height;
let enemiesNear;
let isEnemyNear;
let coreURL = new URL(window['location']['href']);
window['sessionStorage']['force'] = coreURL['searchParams']['get']('fc');
var ws;
var msgpack5 = msgpack;
let myPlayer = {
    'id': null,
    'x': null,
    'y': null,
    'dir': null,
    'object': null,
    'weapon': null,
    'clan': null,
    'isLeader': null,
    'hat': null,
    'accessory': null,
    'isSkull': null
};
let enemy = {
    'id': null,
    'x': null,
    'y': null,
    'dir': null,
    'object': null,
    'weapon': null,
    'clan': null,
    'isLeader': null,
    'hat': null,
    'accessory': null,
    'isSkull': null
};
document.msgpack = msgpack;
function n(){
     this.buffer = new Uint8Array([0]);
     this.buffer.proto = new Uint8Array;
     this.type = 0;
}
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m){

if (!ws){
        document.ws = this;

        ws = this;
        socketFound(this);
    }
    this.oldSend(m);
};
function socketFound(a) {
    a['addEventListener']('message', function (b) {
        handleMessage(b);
    });
}
var healing = false;
var ah = true;
function handleMessage(a) {
    let b = msgpack5['decode'](new Uint8Array(a['data']));
    let c;
    if (b['length'] > 0x1) {
        c = [b[0x0], ...b[0x1]];
        if (c[0x1] instanceof Array) {
            c = c;
        }
    } else {
        c = b;
    }
    let d = c[0x0];
    if (!c) {
        return;
    }
    if (d == '1' && myPlayer['id'] == null) {
        myPlayer['id'] = c[0x1];
    }
    if (d == 'h' && c[0x1] == myPlayer['id']) {
                if (c[0x2] < 0x99 && c[0x2] > 0x0) {
   enemy.x+=c[0x2]
    if (c[0x2] < 75) {
        storeBuy(6);storeEquip(6);
        setTimeout(()=>{
            storeBuy(22);storeEquip(22);
        },dist(enemy) / 3.6);
    }
            
    if (!antiP && c[0x2] == 0) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 1) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 2) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 3) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 4) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 5) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 6) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 7) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 8) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 9) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 10) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 11) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 12) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 13) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 14) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 15) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 16) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 17) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 18) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 19) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 20) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 21) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 22) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 23) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 24) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 25) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 26) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 27) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 28) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 29) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 30) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 31) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 32) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 33) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 34) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 35) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 36) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 37) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 38) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 39) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 40) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 41) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 42) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 43) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 44) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 45) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 46) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 47) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 48) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 49) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 50) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 51) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 52) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 53) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 54) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 55) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 56) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 57) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 58) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 59) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 60) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 61) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 62) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 63) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 64) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 65) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 66) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 67) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 68) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 69) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 70) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 71) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 72) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 73) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 74) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 75) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 76) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 77) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 78) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 79) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    
    if (!antiP && c[0x2] == 80) {
      antiP = true;
      setTimeout(()=>{
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
      },dist(enemy) / 3.6);
    }
    setTimeout(()=>antiP = false,dist(enemy)/3.6);
    setTimeout(()=>{
        sendws(foodType);   
        sendws(foodType);
        sendws(foodType);
        sendws(foodType);
    },120);

        }


    }
        if (d == "33") {
       enemiesNear = [];
        var f = 0;

for (; f < c[1].length / 13; f++) {
            var object = c[1].slice(13 * f, 13 * f + 13);
            if (object[0] == myPlayer.id) {
                myPlayer.x = object[1];
                myPlayer.y = object[2];
                myPlayer.dir = object[3];
                myPlayer.object = object[4];
                myPlayer.weapon = object[5];
                myPlayer.clan = object[7];
                myPlayer.isLeader = object[8];
                myPlayer.hat = object[9];
                myPlayer.accessory = object[10];
                myPlayer.isSkull = object[11];
            } else if(object[7] != myPlayer.clan || object[7] === null) {
                enemiesNear.push(object);
                enemy.x = object[1];
                enemy.y= object[2];
                enemy.dir = object[3];
                enemy.object = object[4];
                enemy.weapon = object[5];
                enemy.clan = object[7];
                enemy.isLeader = object[8];
                enemy.hat = object[9];
                enemy.accessory = object[10];
                enemy.isSkull = object[11];


            }
        }
    }
    isEnemyNear = ![];
    if (enemiesNear) {
        nearestEnemy = enemiesNear.sort(function(line, i) {
            return dist(line, myPlayer) - dist(i, myPlayer);
        })[0];
    }
    if(nearestEnemy) {
       nearestEnemyAngle = Math.atan2(nearestEnemy[2]-myPlayer.y, nearestEnemy[1]-myPlayer.x);
        if(Math.sqrt(Math.pow((myPlayer.y-nearestEnemy[2]), 2) + Math.pow((myPlayer.x-nearestEnemy[1]), 2)) < 300) {
            isEnemyNear = true;
            nearestEnemyAngle = enemy.dir
            boostDir = nearestEnemyAngle;

        }
    }

    if (!nearestEnemy) {
        nearestEnemyAngle = enemyAngelds;

    }
    update();
}
var enemyAngelds;

var boostDir;
function place(p__14702) {
    var angle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Math.atan2(mouseY - height / 2, mouseX - width / 2);
    newSend(['5', [p__14702, null]]);
    newSend(['c', [1, Number.MAX_VALUE]]);
    newSend(['c', [0, Number.MAX_VALUE]]);
    newSend(['5', [myPlayer.weapon, true]]);
    newSend(['5', [p__14702, null]]);
    newSend(['c', [1, Number.MAX_VALUE]]);
    newSend(['c', [0, Number.MAX_VALUE]]);
    newSend(['5', [myPlayer.weapon, true]]);
    newSend(['5',[myPlayer.weapon,false]]);
    wep(primary)
}

function dist(a) {
    return Math.sqrt(Math.pow((myPlayer.y - a[2]), 2) + Math.pow((myPlayer.x - a[1]), 2))
}
function socketsender(a) {
    ws['send'](new Uint8Array(Array['from'](msgpack5['encode'](a))));
}

function sendws(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    socketsender(["5", [id, null]]);
    socketsender(["c", [1, angle]]);
    socketsender(["c", [0, angle]]);
    socketsender(["5", [myPlayer.weapon, true]]);
    socketsender(["5", [primary, true]]);

}
function isElementVisible(a) {
    return a['offsetParent'] !== null;


}

function update() {
     for (let a = 0x10; a < 0x13; a++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + a['toString']()))) {
            foodType = a - 0x10;
        }
    }
    var event = 0;
    for (; event < 9; event++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + event['toString']()))) {
            primary = event;
        }
    }
    var div = 9;
    for (; div < 16; div++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + div['toString']()))) {
            secondary = div;
        }
    }
    var tobj = 16;
    for (; tobj < 19; tobj++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + tobj['toString']()))) {
            foodType = tobj - 16;
        }
    }
    var props = 19;
    for (; props < 22; props++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + props['toString']()))) {
            wallType = props - 16;
        }
    }
    var e = 22;
    for (; e < 26; e++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + e['toString']()))) {
            spikeType = e - 16;
        }
    }
    var f = 26;
    for (; f < 29; f++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + f['toString']()))) {
            millType = f - 16;
        }
    }
    var g = 29;
    for (; g < 31; g++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + g['toString']()))) {
            mineType = g - 16;
        }
    }
    var h = 31;
    for (; h < 33; h++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + h['toString']()))) {
            boostType = h - 16;
        }
    }
    var intval = 33;
    for (; intval < 39; intval++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + intval['toString']())) && intval != 36) {
            turretType = intval - 16;
        }
    }
    spawnpadType = 36;
}