// ==UserScript==
// @name         Keybinds [moomoo.io]
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  v - spike, f - trap, - h - 2 turrets, space - spikeTick, r - insta, c - 4 spike "insta", o - qadro boost/trap
// @author       lsggamez
// @license      MIT
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js?version=912797
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @grant        none
// @icon         https://cdn.discordapp.com/avatars/1131925981460975676/36b51f984147c8b907af0a3dcb834853.png?size=4096
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/483479/Keybinds%20%5Bmoomooio%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/483479/Keybinds%20%5Bmoomooio%5D.meta.js
// ==/UserScript==
var Speed = 0;
function speedweapon() {
if(myPlayer.weapon == 0){Speed = 300}
    if(myPlayer.weapon == 1){Speed = 400}
    if(myPlayer.weapon == 2){Speed = 400}
    if(myPlayer.weapon == 3){Speed = 300}
    if(myPlayer.weapon == 4){Speed = 300}
    if(myPlayer.weapon == 5){Speed = 700}
    if(myPlayer.weapon == 6){Speed = 300}
    if(myPlayer.weapon == 7){Speed = 100}
    if(myPlayer.weapon == 10){Speed = 400}
}
function speedWeaponall() {
    if (myPlayer.weapon == 0) {SpeedAll = 300}
    if (myPlayer.weapon == 1) {SpeedAll = 400}
    if (myPlayer.weapon == 2) {SpeedAll = 400}
    if (myPlayer.weapon == 3) {SpeedAll = 300}
    if (myPlayer.weapon == 4) {SpeedAll = 300}
    if (myPlayer.weapon == 5) {SpeedAll = 700}
    if (myPlayer.weapon == 6) {SpeedAll = 300}
    if (myPlayer.weapon == 7) {SpeedAll = 100}
    if (myPlayer.weapon == 8) {SpeedAll = 400}
    if (myPlayer.weapon == 9) {SpeedAll = 600}
    if (myPlayer.weapon == 10) {SpeedAll = 400}
    if (myPlayer.weapon == 12) {SpeedAll = 700}
    if (myPlayer.weapon == 13) {SpeedAll = 230}
    if (myPlayer.weapon == 14) {SpeedAll = 700}
    if (myPlayer.weapon == 15) {SpeedAll = 1500}
}
function speedWeapon3() {
    doNewSend(["G", [primary, true]])
        doNewSend(["G", [primary, true]]);
    if (myPlayer.weapon == 0) {Speed3 = 300}
    if (myPlayer.weapon == 1) {Speed3 = 400}
    if (myPlayer.weapon == 2) {Speed3 = 400}
    if (myPlayer.weapon == 3) {Speed3 = 300}
    if (myPlayer.weapon == 4) {Speed3 = 300}
    if (myPlayer.weapon == 5) {Speed3 = 700}
    if (myPlayer.weapon == 6) {Speed3 = 300}
    if (myPlayer.weapon == 7) {Speed3 = 100}
    if (myPlayer.weapon == 8) {Speed3 = 400}
}
var SpeedAll = 0;
var Speed3 = 0;
var Speed2 = 0;
var BlockPW = false;
var LowHeal = false;
function speedWeapon2() {
    doNewSend(["G", [secondary, true]])
        doNewSend(["G", [secondary, true]]);
        doNewSend(["G", [secondary, true]])
        doNewSend(["G", [secondary, true]]);
    if (myPlayer.weapon == 9) {Speed2 = 600}
    if (myPlayer.weapon == 10) {Speed2 = 400}
    if (myPlayer.weapon == 12) {Speed2 = 700}
    if (myPlayer.weapon == 13) {Speed2 = 230}
    if (myPlayer.weapon == 15) {Speed2 = 1500}
        doNewSend(["G", [secondary, true]])
        doNewSend(["G", [secondary, true]]);
        doNewSend(["G", [secondary, true]])
        doNewSend(["G", [secondary, true]]);
}
function OldIdWeapon() {
  if (
    myPlayer.weapon == 9 ||
    myPlayer.weapon == 10 ||
    myPlayer.weapon == 11 ||
    myPlayer.weapon == 12 ||
    myPlayer.weapon == 13 ||
    myPlayer.weapon == 14 ||
    myPlayer.weapon == 15
  ) {
    doNewSend(["G", [secondary, true]]);
  } else {
    doNewSend(["G", [primary, true]]);
  }
}
function storeBuy(id, index) {
                doNewSend("13c", 1, id, index);
            }
var AntiTi = false;
var AutoSh = false;
var AutoQ = false;
var bht = false;
function biomeHat() {
    if (myPlayer.y < 2400) {
        hat(15);
    } else {
        if (myPlayer.y > 6850 && myPlayer.y < 7550) {
            hat(31);
        } else {
            hat(12);
        }
    }
}
function time(a, b) {
            setTimeout( () => { b
            }, a);
}
	let weaponSpeed = [300, 400, 400, 300, 300, 700, 300, 100, 400, 600, 400, 0, 700, 230, 700, 1500]
	let weaponSrc = [
		"hammer_1",
		"axe_1",
		"great_axe_1",
		"sword_1",
		"samurai_1",
		"spear_1",
		"bat_1",
		"dagger_1",
		"stick_1",
		"bow_1",
		"great_hammer_1",
		"shield_1",
		"crossbow_1",
		"crossbow_2",
		"grab_1",
		"musket_1"
	]
var onWeapon;
document.getElementById("enterGame").addEventListener('click', autohide);
var autohide = $("ot-sdk-btn-floating").remove();
$('#itemInfoHolder').css({'top':'1050px',
                          'left':'15px'
                         });
$("darkness").remove();
$("#youtuberOf").remove();
$("#adCard").remove();
$("#mobileInstructions").remove();
$("#downloadButtonContainer").remove();
$("#mobileDownloadButtonContainer").remove();
$(".downloadBadge").remove();
let details = document.createElement("div");
details.id = "details";
document.body.prepend(details);
var ping = document.getElementById("pingDisplay");
ping.style.fontSize = "20px";
ping.style.display = "block";
ping.style.zIndex = "1";
document.body.appendChild(ping);
setInterval(function() {
    if (window.pingTime && ping) {
        ping.innerHTML = "Ping: " + window.pingTime + " ms";
    }
}, window.pingTime ? 0 : 1e3);
var pingTime = window.pingTime;
let lastDamageTick = 0;
let HP = 100;
let gameTick = 0;
var shame = 0;
let shameTime,
    damageTimes = 0;
let friendlyMillLocs = [];
let EnemyTrapLocs = [];
let nearestFriendlyMill;
let nearestFriendlyMillX;
let nearestFriendlyMillY;
let NearEnemyTrapLocs;
let nearestFriendlyMillScale;
let isNextToFriendlyMill = false;
function removeArraysWithValue(arr, valueToRemove) {
    for (let i = arr.length - 1; i >= 0; i--) {
        const innerArray = arr[i];
        if (innerArray.includes(valueToRemove)) {
            arr.splice(i, 1);
        }
    }
}
let movementDirection
let millCount = 0;
let nearestRandomObjectX;
let nearestRandomObjectY;
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
let coreURL = new URL(window.location.href);
window.sessionStorage.force = coreURL.searchParams.get("fc");
let trap_a = null;
let intrap = false;
let trapid = null;
var antitrap = false;
var isEnemyNear;
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
var autoprimary = false;
var autosecondary = false;
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
let healSpeed = 50;
var messageToggle = 0;
var nearestEnemy;
var nearestEnemyAngle;
var clanToggle = 0;
let healToggle = 2;
let hatToggle = 1;
var antiInsta = true;
var autoheal = true;
var instaPc = true;
var antiBull = true;
var autoinsta = false;
var afkspike = false;
var damageTick = false;
var autoreload = false;
var damageTrap = false;
var afterInsta = false;
var autoTurret = false;
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
    update();
    if (item == "C" && myPlayer.id == null){
        myPlayer.id = data[1];
    }
    if (item == "a") {
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
    update();
    if (item == "H") {
        for(let i = 0; i < data[1].length / 8; i++) {
            let info = data[1].slice(8*i, 8*i+8);
            if(info[6] == millType && info[7] == myPlayer.id){
                friendlyMillLocs.push(info)
            }
            if(info[7] == myPlayer.id){
                onWeapon = true;
            }
        }
    }
    update();
    if(item == "Q"){
        removeArraysWithValue(friendlyMillLocs, data[1])
    }
    update();
    if(item == "R"){
        removeArraysWithValue(friendlyMillLocs, data[1])
    }
    update();
    if(item == "S"){
        if(data[1] == 3){
            millCount = data[2];
        }
    }
    update();
    if(friendlyMillLocs){
        nearestFriendlyMill = friendlyMillLocs.sort((a,b) => dist(a, myPlayer) - dist(b, myPlayer))[0];
        if(nearestFriendlyMill){
            nearestFriendlyMillX = nearestFriendlyMill[1]
            nearestFriendlyMillY = nearestFriendlyMill[2]
            nearestFriendlyMillScale = nearestFriendlyMill[4]
        }
    }
    if(Math.sqrt(Math.pow((myPlayer.y-nearestFriendlyMillY), 2) + Math.pow((myPlayer.x-nearestFriendlyMillX), 2)) < nearestFriendlyMillScale + 100) {
        console.log(true)
        isNextToFriendlyMill = true;
    } else {
        isNextToFriendlyMill = false;
    }
    WebSocket.prototype.send = function(m){
        let xcc = new Uint8Array(m);
        this.oldSend(m);
        let realData = {};
        let realInfo = msgpack5.decode(xcc);
        if (realInfo[1] instanceof Array){
            realData.data = [realInfo[0], ...realInfo[1]]
        }
        let rd0 = realData.data[0];
        let rd1 = realData.data[1];
        let rd2 = realData.data[2]

        if(rd0 == 'a'){
            movementDirection = rd1
        }
    };

    if(item == "O" && data[1] == myPlayer.id) {
        (gameTick = 0);
        (lastDamageTick = 0);
        (shame = 0);
        (HP = 100);
        (shameTime = 0);
        if (item == "h" && data[1] == myPlayer.id) {
            let damage = HP - data[2];
            HP = data[2];
            if (damage <= 0) {
                damageTimes++;
                if (!lastDamageTick) return;
                let healTime = gameTick - lastDamageTick;
                lastDamageTick = 0;
                if (healTime <= 1) {
                    shame = shame++;
                } else {
                    shame = Math.max(0, shame - 2);
                }
            } else {
                lastDamageTick = gameTick;
            }
        }
    }
};






function doNewSend(sender){
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}
function acc(id) {
    doNewSend(["c", [0, 0, 1]]);
    doNewSend(["c", [0, id, 1]]);
}

function hat(id) {
    doNewSend(["c", [0, id, 0]]);
}
function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["G", [id, null]]);
    doNewSend(["d", [1, angle]]);
    doNewSend(["d", [0, angle]]);
    doNewSend(["G", [primary, true]]);
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


const boostPlacer = repeater(70, () => {place(boostType)}, 50);
const spikePlacer = repeater(86, () => {place(spikeType)}, 50);
const placers = [boostPlacer, spikePlacer];
let prevCount = 0;
const handleMutations = mutationsList => {
    for (const mutation of mutationsList) {
        if (mutation.target.id === "killCounter") {
            const count = parseInt(mutation.target.innerText, 10) || 0;
            if (count > prevCount) {
                doNewSend(["6", [ "ez"]])
                prevCount = count;
            }
        }
    }
};
const observer = new MutationObserver(handleMutations);
observer.observe(document, {
    subtree: true,
    childList: true
});
document.addEventListener('keydown', (e) => {
    if (["allianceinput", 'chatbox', 'nameinput','storeHolder'].includes(document.activeElement.id.toLowerCase())) return null;
    placers.forEach(t => {
        t.start(e.keyCode);
    });

    if(e.keyCode == 16 && document.activeElement.id.toLowerCase() !== 'chatbox'){// H = Turret/Teleporter
        doNewSend(["c", [0, 6, 0]]);
    }

    if(e.keyCode == 72 && document.activeElement.id.toLowerCase() !== 'chatbox'){// H = Turret/Teleporter
        place(turretType, myPlayer.dir + toRad(45));
        place(turretType, myPlayer.dir - toRad(45));
    }
    if (e.keyCode == 67) {
    doNewSend(["c", [0, 53, 0]]);
    setTimeout(() => {
    doNewSend(["c", [0, 7, 0]]);
        doNewSend(["G", [primary, true]]);
        doNewSend(["d",[1]]);
    }, 80)
            setTimeout(() => {
            doNewSend(["c", [0, 6, 0]]);
            doNewSend(["d",[0]]);
        place(spikeType, myPlayer.dir + toRad(0));
        place(spikeType, myPlayer.dir - toRad(180));
        place(spikeType, myPlayer.dir + toRad(90));
        place(spikeType, myPlayer.dir - toRad(90));
        place(spikeType, myPlayer.dir + toRad(45));
        place(spikeType, myPlayer.dir - toRad(45));
        place(spikeType, myPlayer.dir + toRad(135));
        place(spikeType, myPlayer.dir - toRad(135));
        }, 160);
    }

        if (bht == true) {
                    setTimeout(() => {
        biomeHat()
        },150);
    }

    if(e.keyCode == 79 && document.activeElement.id.toLowerCase() !== 'chatbox'){
        place(boostType, myPlayer.dir + toRad(45));
        place(boostType, myPlayer.dir - toRad(45));
        place(boostType, myPlayer.dir + toRad(135));
        place(boostType, myPlayer.dir - toRad(135));
        place(boostType, myPlayer.dir + toRad(0));
        place(boostType, myPlayer.dir - toRad(180));
        place(boostType, myPlayer.dir + toRad(90));
        place(boostType, myPlayer.dir - toRad(90));
    }
})

document.addEventListener('keyup', (e) => {
    placers.forEach(t => {
        t.stop(e.keyCode);
    });
})
function isElementVisible(e) {
    return (e.offsetParent !== null);
}

function toRad(angle) {
    return angle * 0.01745329251;
}

function dist(e, o) {
    return e && o
        ? Math.sqrt((e.x - o.x) ** 2 + (e.y - o.y) ** 2)
    : null
};
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

    for (let i=33;i<36;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            turretType = i - 16;
        }
    }

    for (let i=36;i<37;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            spawnpadType = i - 16;
        }
    }

    for (let i=37;i<39;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            turretType = i - 16;
        }
    }
}

(function() {
    const { msgpack } = window

    function AntiKick() {
        this.resetDelay = 500
        this.packetsLimit = 40

        this.ignoreTypes = [ "pp", "rmd" ]
        this.ignoreQueuePackets = [ "5", "c", "33", "2", "7", "13c" ]

        this.packetsStorage = new Map()
        this.tmpPackets = []
        this.packetsQueue = []

        this.lastSent = Date.now()

        this.onSend = function(data) {
            const binary = new Uint8Array(data)
            const parsed = msgpack.decode(binary)

            if (Date.now() - this.lastSent > this.resetDelay) {
                this.tmpPackets = []

                this.lastSent = Date.now()
            }

            if (!this.ignoreTypes.includes(parsed[0])) {
                if (this.packetsStorage.has(parsed[0])) {
                    const oldPacket = this.packetsStorage.get(parsed[0])

                    switch (parsed[0]) {
                        case "2":
                        case "33":
                            if (oldPacket[0] == parsed[1][0]) return true
                            break
                    }
                }

                if (this.tmpPackets.length > this.packetsLimit) {
                    if (!this.ignoreQueuePackets.includes(parsed[0])) {
                        this.packetsQueue.push(data)
                    }

                    return true
                }

                this.tmpPackets.push({
                    type: parsed[0],
                    data: parsed[1]
                })

                this.packetsStorage.set(parsed[0], parsed[1])
            }

            return false
        }
    }

    const antiKick = new AntiKick()

    let firstSend = false

    window.WebSocket.prototype.send = new Proxy(window.WebSocket.prototype.send, {
        apply: function(target, _this) {
            if (!firstSend) {
                _this.addEventListener("message", (event) => {
                    if (!antiKick.packetsQueue.length) return

                    const binary = new Uint8Array(event.data)
                    const parsed = msgpack.decode(binary)

                    if (parsed[0] === "33") {
                        _this.send(antiKick.packetsQueue[0])

                        antiKick.packetsQueue.shift()
                    }
                })

                firstSend = true
            }

            if (antiKick.onSend(arguments[2][0])) return

            return Reflect.apply(...arguments)
        }
    })
})()