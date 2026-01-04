// ==UserScript==
// @name         Hq5
// @icon https://i.imgur.com/gmMJbOv.png
// @namespace    k
// @version      27
// @description   Juan
// @author       papa
// @Download     ZomMod For https://greasyfork.org/en/scripts/393976-zommod-the-hack-to-zombs-io-2020
        //       MooMoo.io
// @match        *://moomoo.io/*
// @match        *sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @grant        none
// @require https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @downloadURL https://update.greasyfork.org/scripts/397927/Hq5.user.js
// @updateURL https://update.greasyfork.org/scripts/397927/Hq5.meta.js
// ==/UserScript==

document.getElementById("moomooio_728x90_home").style.display = "none";
$("#moomooio_728x90_home").parent().css({display: "none"});
window.onbeforeunload = null;

let mouseX;
let mouseY;

let width;
let height;

setInterval(() => {
    if(hatToggle == 1) {
        if(oldHat != normalHat) {
            hat(normalHat);
            console.log("Tried. - Hat")
        }
        if(oldAcc != normalAcc) {
            acc(normalAcc);
            console.log("Tried. - Acc")
        }
        oldHat = normalHat;
        oldAcc = normalAcc
    }
}, 25);

function normal() {
    hat(normalHat);
    acc(normalAcc);
}

function aim(x, y){
     var cvs = document.getElementById("gameCanvas");
     cvs.dispatchEvent(new MouseEvent("mousemove", {
         clientX: x,
         clientY: y

     }));
}
function pit1(){
    place(boostType)
}
function pike(){
    place(spikeType)}
function mill(){
    place(millType)
}
let coreURL = new URL(window.location.href);
window.sessionStorage.force = coreURL.searchParams.get("fc");

var nearestEnemy;
var nearestEnemyAngle;
var isEnemyNear;
var instaSpeed = 201;
var primary;
var secondary;
var foodType;
var wallType;
var spikeType;
var millType;
var mineType;
var boostType;
var turretType;
var spawnpadType;
var autoaim = false;
var tick = 1;
var oldHat;
var oldAcc;
var enemiesNear;
var normalHat;
var normalAcc;
var ws;
var msgpack5 = msgpack;
var boostDir;
let myPlayer = {
    id: null,
    x: null,
    y: null,
    dir: null,
    object: null,
    weapon: null,
    clan: null,
    isLeader: null,
    hat: null,
    accessory: null,
    isSkull: null
};
let healSpeed = 240;
let healToggle = 1111111111111111111111122222222222222200000000000000000200000000111111111111222000000000000000;22000000

document.msgpack = msgpack;
function n(){
     this.buffer = new Uint8Array([0]);
     this.buffer.__proto__ = new Uint8Array;
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


function socketFound(socket){
    socket.addEventListener('message', function(message){
        handleMessage(message);
    });
}

function handleMessage(m){
    let temp = msgpack5.decode(new Uint8Array(m.data));
    let data;
    if(temp.length > 1) {
        data = [temp[0], ...temp[1]];
        if (data[1] instanceof Array){
            data = data;
        }
    } else {
      data = temp;
    }
    let item = data[0];
    if(!data) {return};

    if(item === "io-init") {
            let cvs = document.getElementById("gameCanvas");
            width = cvs.clientWidth;
            height = cvs.clientHeight;
            $(window).resize(function() {
                width = cvs.clientWidth;
                height = cvs.clientHeight;
            });
            cvs.addEventListener("mousemove", e => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });
        }

    if (item == "1" && myPlayer.id == null){
        myPlayer.id = data[1];
    }

    if (item == "33") {
        enemiesNear = [];
        for(let i = 0; i < data[1].length / 13; i++) {
            let playerInfo = data[1].slice(13*i, 13*i+13);
            if(playerInfo[0] == myPlayer.id) {
                myPlayer.x = playerInfo[1];
                myPlayer.y = playerInfo[2];
                myPlayer.dir = playerInfo[3];
                myPlayer.object = playerInfo[4];
                myPlayer.weapon = playerInfo[5];
                myPlayer.clan = playerInfo[7];
                myPlayer.isLeader = playerInfo[8];
                myPlayer.hat = playerInfo[9];
                myPlayer.accessory = playerInfo[10];
                myPlayer.isSkull = playerInfo[11];
            } else if(playerInfo[7] != myPlayer.clan || playerInfo[7] === null) {
                enemiesNear.push(playerInfo);
            }
        }
    }

    isEnemyNear = false;
    if(enemiesNear) {
    }

    if(nearestEnemy) {
        nearestEnemyAngle = Math.atan2(nearestEnemy[2]-myPlayer.y, nearestEnemy[1]-myPlayer.x);
        if(Math.sqrt(Math.pow((myPlayer.y-nearestEnemy[2]), 2) + Math.pow((myPlayer.x-nearestEnemy[1]), 2)) < 300) {
            isEnemyNear = true;
            if(autoaim == false && myPlayer.hat != 1 && myPlayer.hat != 1) {
                normalHat = 1;
                if(primary != 1) {
                    normalAcc = 1
                }
            };
        }
    }
    if(isEnemyNear == false && autoaim == false) {
        normalAcc = 1;
        if (myPlayer.y < 2400){
            normalHat = 1;
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
            normalHat = 1;
        } else {
	        normalHat = 1;
        }
    }
    if (!nearestEnemy) {
        nearestEnemyAngle = myPlayer.dir;
    }
    if(item == "h" && data[1] == myPlayer.id) {
        if(data[2] = 90 && healToggle == 1) {
    place(foodType, null)
} else if(data[2] <= 80 && healToggle == 1) {
    place(foodType, null)
} else if(data[2] <= 70 && healToggle == 1) {
    place(foodType, null)
    place(foodType, null)
} else if(data[2] <= 50 && healToggle == 1) {
    place(foodType, null)
    place(foodType, null)
    place(foodType, null)
} else if(data[2] <= 30 && healToggle == 1) {
    place(foodType, null) // 70
    place(foodType, null) // 110
    place(foodType, null) // 150
    place(foodType, null) // 190
} else if(data[2] <= 20 && healToggle == 1) {
    place(foodType, null) // 60
    place(foodType, null) // 100
    place(foodType, null) // 140
} else if(data[2] <= 10 && healToggle == 1) {
    place(foodType, null) // 50
    place(foodType, null) // 90
    place(foodType, null) // 130
    place(foodType, null) // 170
} else if(data[2] >= 1 && healToggle == 1) {
    place(foodType, null) // 40
    place(foodType, null) // 82
    place(foodType, null) // 121
    place(foodType, null) // 161
    place(foodType, null)
    place(foodType, null)
}
}
    update();
}


function doNewSend(sender){
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}

function acc(id) {
    doNewSend(["13c", [0, 0, 1]]);
    doNewSend(["13c", [0, id, 1]]);
}

function hat(id) {
    doNewSend(["13c", [0, id, 0]]);
}


function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [0, angle]]);
    doNewSend(["5", [myPlayer.weapon, true]]);
}
function placeF(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [0, angle]]);
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [0, angle]]);
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [0, angle]]);
    doNewSend(["5", [myPlayer.weapon, true]]);
}

function placeAntyConw(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [0, angle]]);
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [0, angle]]);
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [0, angle]]);
    doNewSend(["5", [myPlayer.weapon, true]]);
}
function placeHealaer(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [0, angle]]);
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [0, angle]]);
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [0, angle]]);
    doNewSend(["5", [myPlayer.weapon, true]]);
}

function boostSpike() {
    if(boostDir == null) {
        boostDir = nearestEnemyAngle;
    }
    place(spikeType, boostDir + toRad(1000));
    place(spikeType, boostDir - toRad(1000));
    place(boostType, boostDir);
    doNewSend(["333", [boostDir]]);
}


var repeater = function(key, action, interval) {
    let _isKeyDown = false;
    let _intervalId = undefined;

    return {
        start(keycode) {
            if(keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
                _isKeyDown = true;
                if(_intervalId === undefined) {
                    _intervalId = setInterval(() => {
                        action();
                        if(!_isKeyDown){
                            clearInterval(_intervalId);
                            _intervalId = undefined;
                            console.log("claered");
                        }
                    }, interval);
                }
            }
        },

        stop(keycode) {
            if(keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
                _isKeyDown = false;
            }
        }
    };
}
const healer = repeater(81, () => {place(foodType)}, 27);
const spikePlacer = repeater(86, () => {pike()}, 0);
const boostPlacer = repeater(70, () => {place(boostType)}, 0);
const millPlacer = repeater(78, () => {mill()}, 0);
const turretPlacer = repeater(72, () => {place(turretType)}, 0);
const wallPlacer = repeater(52, () => {place(wallType)}, 0);
const pit = repeater(70, () => {pit()}, 0);

document.addEventListener('keydown', (e)=>{
    spikePlacer.start(e.keyCode);
    healer.start(e.keyCode);
    millPlacer.start(e.keyCode);
    boostPlacer.start(e.keyCode);
    turretPlacer.start(e.keyCode);
    wallPlacer.start(e.keyCode);
    pit.start(e.keyCode);

    if (e.keyCode == 79 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        for (let i=0;i<0;i++){
             let angle = myPlayer.dir + toRad(i * 72);
             place(millType, angle)
        }
    }
    if (e.keyCode == 80 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        for (let i=0;i<0;i++){
             let angle = myPlayer.dir + toRad(i * 90);
             place(wallType, angle)
        }
    }
    if (e.keyCode == 73 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        for (let i=0;i<0;i++){
             let angle = myPlayer.dir + toRad(i * 90);
             place(boostType, angle)
        }
    }
    if (e.keyCode == 186 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        for (let i=0;i<0;i++){
             let angle = myPlayer.dir + toRad(i * 90);
             place(spikeType, angle)
        }
    }
    if (e.keyCode == 1 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        place(turretType, myPlayer.dir + toRad(45));
        place(turretType, myPlayer.dir - toRad(45));
    }
    if(e.keyCode == 84 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [primary, true]]);
            doNewSend(["13c", [0, 7, 0]]);
            doNewSend(["13c", [0, 7, 0]]);
            doNewSend(["c", [1]]);
            doNewSend(["c", [1]]);
            doNewSend(["c", [1]]);
            doNewSend(["c", [1]]);
            setTimeout( () => {
            doNewSend(["13c", [0, 53, 0]]);
            doNewSend(["5", [secondary, true]]);
        }, instaSpeed - 131);
        setTimeout( () => {
          doNewSend(["5", [primary, true]]);
          doNewSend(["c", [0, null]]);
        }, instaSpeed);
    }

    if(e.keyCode == 79 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [4]]);
    }
    if(e.keyCode == 48 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [4]]);
    }

    if(e.keyCode == 97 && document.activeElement.id.toLowerCase() !== 'chatbox') { ///num1 katana [age 8]
        doNewSend(["6", [4]]);
    }
    if(e.keyCode == 98 && document.activeElement.id.toLowerCase() !== 'chatbox') { ///num2 musket [age 9]
        doNewSend(["6", [15]]);
    }
    if(e.keyCode == 98 && document.activeElement.id.toLowerCase() !== 'chatbox') { ///num2 crossbow [age 8]
        doNewSend(["6", [12]]);
    }
    if(e.keyCode == 105 && document.activeElement.id.toLowerCase() !== 'chatbox') { ///num9 max mill [age 8]
        doNewSend(["6", [28]]);
    }
    if(e.keyCode == 104 && document.activeElement.id.toLowerCase() !== 'chatbox') { ///num8 max wall [age 7]
        doNewSend(["6", [21]]);
    }
    if(e.keyCode == 101 && document.activeElement.id.toLowerCase() !== 'chatbox') { ///num5 spin spike [age 9]
        doNewSend(["6", [25]]);
    }
    if(e.keyCode == 102 && document.activeElement.id.toLowerCase() !== 'chatbox') { ///num6 fast crossbow [age 9]
        doNewSend(["6", [13]]);
    }
    if(e.keyCode == 99 && document.activeElement.id.toLowerCase() !== 'chatbox') { ///num3 great axe [age 8]
        doNewSend(["6", [2]]);
    }
    var hatToggle = 0;
    if(e.keyCode == 89 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        healToggle = (healToggle + 1) % 2;
        if(healToggle == 0) {
            if(hatToggle == 0) {
                document.title = "Moo Moo"
            } else {
                document.title = "Moo Moo"
            }
        } else {
            if(hatToggle == 0) {
                document.title = "Moo Moo"
            } else {
                document.title = "Moo Moo"
            }
        }
    }


    if(e.keyCode == 79 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [4]]);
    }

    if(e.keyCode == 98 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [15]]);
    }
    if(e.keyCode == 99 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [28]]);
    }
    if(e.keyCode == 105 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [28]]);
        doNewSend(["6", [25]]);
    }
    if(e.keyCode == 89 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        if(healToggle == 0) {
            if(hatToggle == 0) {
                document.title = "Moo Moo"
            } else {
                document.title = "Moo Moo"
            }
        } else {
            if(hatToggle == 0) {
                document.title = "Moo Moo"
            } else {
                document.title = "Moo Moo"
            }
        }
    }
})

document.addEventListener('keyup', (e)=>{
    spikePlacer.stop(e.keyCode);
    millPlacer.stop(e.keyCode);
    boostPlacer.stop(e.keyCode);
    turretPlacer.stop(e.keyCode);
    pit.stop(e.keyCode);
    healer.stop(e.keyCode);
    wallPlacer.stop(e.keyCode);
    if(e.keyCode == 71 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        setTimeout( () => {
            doNewSend(["33", [null]]);
            boostDir = null;
        }, 1);
    }
})


function isElementVisible(e) {
    return (e.offsetParent !== null);
}


function toRad(angle) {
    return angle * 0.01745329251;
}


document.title = "Moo Moo"

function update() {
    for (let i=0;i<9;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            primary = i;
        }
    }

    for (let i=9;i<16;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            secondary = i;
        }
    }

    for (let i=16;i<19;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            foodType = i - 16;
        }
    }

    for (let i=19;i<22;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            wallType = i - 16;
        }
    }

    for (let i=22;i<26;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            spikeType = i - 16;
        }
    }

    for (let i=26;i<29;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            millType = i - 16;
        }
    }

    for (let i=29;i<31;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            mineType = i - 16;
        }
    }

    for (let i=31;i<33;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            boostType = i - 16;
        }
    }

    for (let i=33;i<39;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString())) && i != 36){
            turretType = i - 16;
        }
    }
    spawnpadType = 36;
}
// ==UserScript==
// @name         Auto Scroll 2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*moomoo.io/*
// @match        *://*sandbox.moomoo.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var SoreHolder = document.getElementById('storeHolder');
        SoreHolder.scrollTop = 0;
document.addEventListener('keydown', function(e) {
    if( e.keyCode === 90 ){ // r
        SoreHolder.scrollTop = 1200;
        console.log("r is pressed and solieder is on");
    };
    if( e.keyCode === 67){// y
        SoreHolder.scrollTop = 2100;
        console.log("y is pressed and tank is on");
    };
    if( e.keyCode === 85){// 2
        SoreHolder.scrollTop = 1900;
        console.log("2 is pressed and samurai is on");
    };
    if( e.keyCode === 78){// v
        SoreHolder.scrollTop = 1850;
        console.log("v is pressed and turret is on");
    };
    if( e.keyCode === 66){// space
        SoreHolder.scrollTop = 1450;
        console.log("space is pressed and bull is on");
    };
        if( e.keyCode === 75){// space
        SoreHolder.scrollTop = 1000;
        console.log("r is pressed and flipper is on");
    };
        if( e.keyCode === 74){// space
        SoreHolder.scrollTop = 800;
        console.log("r is pressed and winter cap is on");
    };
            if( e.keyCode === 77){// space
        SoreHolder.scrollTop = 1650;
        console.log("m is pressed and plague is on");
    };
        if(e.keyCode === 76){ // L
        SoreHolder.scrollTop = 650;
        console.log("L is pressed and Pumpkin is on");
    };
        if(e.keyCode === 73){ // i
        SoreHolder.scrollTop = 0;
        console.log("i is pressed and Moo Cap is on");
    };
    })
})();
// ==UserScript==
// @name         Moomoo Force Server
// @namespace    Nebula
// @version      1.2.0
// @description  Allows forcing a connection to a server.
// @author       Mega_Mewthree/Lucario
// @match        *://moomoo.io/*
// @match        *://45.77.0.81/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

window.history.replaceState = () => {};
window.history.pushState = () => {};

const force = getParam("force-connect", window.location.search);
const party = getParam("server", window.location.search);
const ip = /\d+:\d+:\d+/.exec(party);
console.log(force, party, ip);
if (force !== null && party !== null && ip && ip[0]){
    window.location = window.location.origin + window.location.pathname + `?force-connect=${ip[0]}`;
}

WebSocket = class extends WebSocket {
    constructor(...args){
        if (force !== null && /\d+:\d+:\d+/.test(force)){
            const allServers = [];
            const servers = window.vultr.servers;
            let len = servers.length;
            let server;
            let games;
            let gameLen;
            while (len--) {
                server = servers[len];
                games = server.games;
                gameLen = games.length;
                while (gameLen--) {
                    allServers.push({id: `${server.region}:${server.index}:${gameLen}`, ip: server.ip, gameIndex: gameLen});
                }
            }
            const s = (function (id) {
                let len = allServers.length;
                while (len--) {
                    if (allServers[len].id === id) return allServers[len];
                }
                return false;
            })(force);
            args[0] = args[0].replace(/ip_[a-z0-9]+/, `ip_${s.ip}`).replace(/\?gameIndex=\d+/, `?gameIndex=${s.gameIndex}`);
        }
        super(...args);
    }
};

function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}