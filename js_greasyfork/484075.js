// ==UserScript==
// @name         myMod 2
// @namespace    Nigger 18
// @version      5_beta
// @description  V - spike, F - trap, - H - 2 turrets, SPACE - spikeHit, R - insta, C - 4 spikes, RightMouse - tankspam, O - qadro boost/trap, ESC - menu beta, T - reverse insta, G - beta one tick boost.
// @author       Undyne the Undying (Gondon).
// @license      MIT
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @require      https://update.greasyfork.org/scripts/480301/1283571/CowJS.js
// @require      https://update.greasyfork.org/scripts/480303/1282926/MooUI.js
// @require      https://greasyfork.org/scripts/456235-moomoo-js/code/MooMoojs.js?version=1132127
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js?version=912797
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @grant        none
// @icon         https://cdn.discordapp.com/avatars/1131925981460975676/36b51f984147c8b907af0a3dcb834853.png?size=4096
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/484075/myMod%202.user.js
// @updateURL https://update.greasyfork.org/scripts/484075/myMod%202.meta.js
// ==/UserScript==
if(palcetraps === true && ned <= 320){
    place(boostType, nea)
}
let RpTraps = false;
var palcetraps = true;
let ned;
let nea;
if(!nearestEnemy){
nea = 0;
ned = 0;
}
    function calculateDistance(a, b) {
        var distance = Math.sqrt(Math.pow((b.x - a.x), 2) + Math.pow((b.y - a.y), 2));
        return distance;
    }
    function determineRotationAngle(a, b) {
        var deltaX = b.x - a.x;
        var deltaY = b.y - a.y;
        var dist1 = Math.atan2(deltaY, deltaX);
        dist1 = dist1 * (180 / Math.PI);
        dist1 += 90;
        dist1 = (dist1 + 360) % 360;
        return dist1;
    }
setInterval(() => {
    if(nearestEnemy){
   ned = calculateDistance(myPlayer, enemyInf);
   nea = determineRotationAngle(myPlayer, enemyInf);
    }
}, 200);
function getEl(id) {
    return document.getElementById(id);
}
            let mapDisplay = getEl("mapDisplay");
            let mapContext = mapDisplay.getContext("2d");
            mapDisplay.width = 300;
            mapDisplay.height = 300;
  let scale = 45;
let doinsta;
  let enemy;
  let enemyInf = { hat: null, x: null, y: null, weaponIndex: null}
var antiInsta = false;
var PREFIX = "!" || "e " || "E ";
var InstaK = false;
var smartWeaponInsta = false;
let SmartInsta = 0;
let BullAuto = false;
setInterval(() => {
    if (!smartWeaponInsta) {
        SmartInsta = 0;
    }
}, 200);
setInterval(() => {
    if (smartWeaponInsta) {
        setTimeout(() => {
            doNewSend(["G", [primary, true]]);
            if (myPlayer.weapon == 0 || myPlayer.weapon == 1 || myPlayer.weapon == 2 || myPlayer.weapon == 6 || myPlayer.weapon == 8) {
                SmartInsta = 0;
            }
            if (!InstaK && (myPlayer.weapon == 3 || myPlayer.weapon == 4)) {
                SmartInsta = 2;
            }
            if (InstaK && (myPlayer.weapon == 3 || myPlayer.weapon == 4)) {
                SmartInsta = 1;
            }
            if (myPlayer.weapon == 5) {
                SmartInsta = 1;
            }
            if (myPlayer.weapon == 7) {
                SmartInsta = 2;
            }
        }, 50);
                setTimeout(() => {
            OldIdWeapon();
        }, 100);
    }
}, speedWeaponall + 200);
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
    if (myPlayer.weapon == 9) {Speed2 = 600}
    if (myPlayer.weapon == 10) {Speed2 = 400}
    if (myPlayer.weapon == 12) {Speed2 = 700}
    if (myPlayer.weapon == 13) {Speed2 = 230}
    if (myPlayer.weapon == 15) {Speed2 = 1500}
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
setInterval( () => {
if(bht === true && tankspamming === false){
    if (ned > 320 && doinsta == false) {
    if (myPlayer.y < 2400) {
        hat(15);
    } else {
        if (myPlayer.y > 6850 && myPlayer.y < 7550) {
            hat(31);
        } else {
            hat(12);
        }
    }
  } else {
      if (ned <= 320 && doinsta == false) {
  hat(6);
   }
  }
 }
}, 200);
function time(a, b) {
            setInterval( () => { b
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
$("#mapDisplay").css({background: `url('http://i.imgur.com/Qllo1mA.png')`});
document.getElementById("enterGame").addEventListener('click', autohide);
var autohide = $("ot-sdk-btn-floating").remove();
document.getElementById('linksContainer2').remove();
document.getElementById('gameName').innerHTML = 'MyMod';
document.getElementById('loadingText').innerHTML = 'V5_BETA'
document.getElementById('diedText').innerHTML = "Wasted";
document.getElementById('diedText').style.color = "#000000";
document.getElementById("storeHolder").style = "height: 1400px; width: 500px;";
document.getElementById("promoImgHolder").remove();
document.querySelector("#pre-content-container").remove(); //ANTI AD log
$('#itemInfoHolder').css({
    'top': '0px',
    'left': '0px'
});
$("darkness").remove();
$("#youtuberOf").remove();
$("#adCard").remove();
$("#mobileInstructions").remove();
$("#downloadButtonContainer").remove();
$("#mobileDownloadButtonContainer").remove();
$(".downloadBadge").remove();
    document.getElementById('gameName').style.color = "black";
    document.getElementById('gameName').style.textShadow = 'none';
    document.getElementById('gameName').style.fontSize = "80px";
    document.getElementById('loadingText').style.color = "black";
    document.getElementById('allianceButton').style.color = "gold";
    document.getElementById('chatButton').remove();
    document.getElementById('storeButton').style.color = "gold";
    document.getElementById('setupCard').style.background = "black";
    document.getElementById('guideCard').style.background = "black";
    document.getElementById('diedText').style.color = "#219B00";
    $("#wideAdCard").remove();
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
        var shameInfo = myPlayer.hat == 45 ? "ShameTimer[" + (30 - 1) + "s]" : "Shame[" + shame + "]";
        ping.innerHTML = "Ping[" + window.pingTime + "] | " + shameInfo + " | SmartInsta: " + SmartInsta + "| Dist["+ ned +"] | Angle[" + nea + "]";
    }
}, window.pingTime ? 0 : 1e3);
var NoThing = undefined;
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
var ws;
let movementDirection
let millCount = 0;
let nearestRandomObjectX;
let nearestRandomObjectY;
let mouseX;
let mouseY;
let width = 500;
let height = 500;
var bots = [];
    var myWindow;
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
let healSpeed = 200;
var messageToggle = 0;
var nearestEnemy;
var nearestEnemyAngle;
var clanToggle = 0;
let healToggle = 2;
let hatToggle = 1;
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
        enemy = [];
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
                enemy.push(playerInfo);
            }
        }
    }
    var doActive = data[0];
       if (enemy) {
        nearestEnemy = enemy.sort((a, b) => dist(a, myPlayer) - dist(b, myPlayer))[0];
    }
   if (nearestEnemy) {
      enemyInf.weapon = nearestEnemy[5]
      enemyInf.hat = nearestEnemy[9]
      enemyInf.x = nearestEnemy[1]
      enemyInf.y = nearestEnemy[2]
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
    isEnemyNear = false;
    if (myPlayer.hat == 45 && shame) shameTime = 30000;
    if (myPlayer.hat == 45 && shame) shame = 30000;
    if (data[0] == "33") {
        gameTick++;
    }
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
        var Pg = 0;
               if(AutoQ == true && pingTime >= 500 && pingTime - Pg) {
           setTimeout( () => {
               Pg = 3
               place(foodType, null);
               place(foodType, null);
               place(foodType, null);
               OldIdWeapon()
           }, pingTime - healSpeed + pingTime - Pg);
       }
               if(AutoQ == true && pingTime <= 499 && pingTime >= 101) {
           setTimeout( () => {
               Pg = 2
               place(foodType, null);
               place(foodType, null);
               place(foodType, null);
               OldIdWeapon()
           }, pingTime - healSpeed + pingTime - Pg);
       }
       if(AutoQ == true && pingTime <= 100 && pingTime > 50) {
           setTimeout( () => {
               Pg = 1
               place(foodType, null);
               place(foodType, null);
               place(foodType, null);
               OldIdWeapon()
           }, pingTime - healSpeed + pingTime - Pg);
       }
               if(AutoQ == true && pingTime <= 50) {
           setTimeout( () => {
               Pg = 4
               place(foodType, null);
               place(foodType, null);
               place(foodType, null);
               OldIdWeapon()
           }, pingTime + Pg);
       }
                if(data[2] < 100 && data[2] >= 0 && damageTick == true && nearestEnemy){
         place(foodType)
        place(spikeType);
        doNewSend(["d",[1]]);
        doNewSend(["c", [0, 7, 0]]);
        doNewSend(["G", [primary, true]]);
        doNewSend(["d",[1]]);
        setTimeout(() => {
            doNewSend(["c", [0, 53, 0]]);
        },85);
        setTimeout(() => {
            doNewSend(["c", [0, 6, 0]]);
            doNewSend(["d",[0]]);
            place(foodType)
            OldIdWeapon()
        },170);
                }
                if(data[2] < 100 && data[2] >= 0 && afkspike == true){
        place(spikeType, myPlayer.dir + toRad(0));
        place(spikeType, myPlayer.dir - toRad(180));
        place(spikeType, myPlayer.dir + toRad(90));
        place(spikeType, myPlayer.dir - toRad(90));
                    OldIdWeapon()
                }
                if(data[2] < 100 && data[2] >= 0 && damageTrap == true){
        place(boostType, myPlayer.dir + toRad(45));
        place(boostType, myPlayer.dir - toRad(45));
        place(boostType, myPlayer.dir + toRad(135));
        place(boostType, myPlayer.dir - toRad(135));
                    OldIdWeapon()
                }
        if(data[2] < 100 && data[2] >= 0 && autoinsta == true){
    if(instaPc == true && document.activeElement.id.toLowerCase() !== 'chatbox'){
                                        doNewSend(["G", [primary, true]]);
        doNewSend(["c", [0, 7, 0]]);
                                    doNewSend(["d",[1]]);
                doNewSend(["d",[0]]);
                                setTimeout(() => {
                    doNewSend(["c", [0, 53, 0]]);
                                    place(spikeType)
            }, 133);
                                                    setTimeout(() => {
doNewSend(["c", [0, 6, 0]]);
                doNewSend(["d",[0]]);
            }, 180);
    }
            if(instaPc == false && document.activeElement.id.toLowerCase() !== 'chatbox'){// insta
                afterInsta = false
        doNewSend(["c", [0, 53, 0]]);
        doNewSend(["G", [primary, true]]);
        setTimeout(() => {
        doNewSend(["c", [0, 7, 0]]);
            doNewSend(["d",[1]]);
            doNewSend(["d",[0]]);
        },95);
        setTimeout(() => {
            place(foodType)
            doNewSend(["G", [secondary, true]]);
            doNewSend(["d",[1]]);
        },180);
                setTimeout(() => {
            doNewSend(["d",[0]]);
            doNewSend(["G", [primary, true]])
            doNewSend(["c", [0, 6, 0]]);
                    afterInsta = true
        },280);
      }
        }
        if (data[2] < 100 && data[2] >= 0 && autoheal == true) {
            let c;
                        c = 1;
        if (data[2] < 100 && data[2] >= 0) {
            if (data[2] < 100 && data[2] >= 50 && LowHeal == true) {
            c = 1;
                setTimeout(() => {
        for (let i=0;i<c;i++) { place(foodType) };
                    if(doinsta == false){
                        doNewSend(["c", [0, 6, 0]]);
                    }
                    OldIdWeapon()
                }, healSpeed - 25);
            }
                                    if (data[2] <= 31 && data[2] >= 0 && LowHeal == true) {
            c = 3;
        for (let i=0;i<c;i++) { place(foodType) };
                    if(doinsta == false){
                        doNewSend(["c", [0, 6, 0]]);
                    }
                            OldIdWeapon()
            }
                        if (data[2] < 50 && data[2] > 31 && LowHeal == true) {
            c = 2;
        for (let i=0;i<c;i++) { place(foodType) };
                    if(doinsta == false){
                        doNewSend(["c", [0, 6, 0]]);
                    }
                            OldIdWeapon()
            }
            if (data[2] < 100 && data[2] >= 50 && LowHeal == false) {
            c = 2;
                setTimeout(() => {
        for (let i=0;i<c;i++) { place(foodType) };
                    if(doinsta == false){
                        doNewSend(["c", [0, 6, 0]]);
                    }
                    OldIdWeapon()
        },125);
            }
                                    if (data[2] < 50 && data[2] >= 0 && LowHeal == false) {
            c = 3;
        for (let i=0;i<c;i++) { place(foodType) };
                    if(doinsta == false){
                        doNewSend(["c", [0, 6, 0]]);
                    }
                                        OldIdWeapon()
            }
        }
      }
                if (data[2] < 100 && nearestEnemy[9] == 21 && doinsta === false){
                doNewSend(["c", [0, 23, 0]]);
            place(foodType);
            place(foodType);
            place(foodType);
     setTimeout(() => {OldIdWeapon(); doNewSend(["c", [0, 6, 0]])}, 75)
        }
        if (data[2] < 33 && data[2] > 0 && myPlayer.hat !== 6 && antiInsta == true && doinsta === false) {//antiinsta no sold log
            doNewSend(["c", [0, 53, 0]]);
            place(foodType);
            place(foodType);
            place(foodType);
            setTimeout(() => {
                place(foodType);
            }, 170);
            setTimeout(() => {
                            doNewSend(["G", [primary, true]]);
                doNewSend(["c", [0, 7, 0]]);
                            doNewSend(["d",[1]]);
            place(foodType);
            }, 760);
            setTimeout( () => {
                doNewSend(["c", [0, 6, 0]]);
                            doNewSend(["d",[0]]);
                OldIdWeapon()
            }, 1900);
        }
        if (data[0] == "6" && data[1] == myPlayer.id && data[2].split(' ')[0] == PREFIX+"check") {
        setTimeout(() => {
            doNewSend(["G", [primary, true]]);
            if (myPlayer.weapon == 0 || myPlayer.weapon == 1 || myPlayer.weapon == 2 || myPlayer.weapon == 6 || myPlayer.weapon == 8) {
                SmartInsta = 0;
            }
            if (!InstaK && (myPlayer.weapon == 3 || myPlayer.weapon == 4)) {
                SmartInsta = 2;
            }
            if (InstaK && (myPlayer.weapon == 3 || myPlayer.weapon == 4)) {
                SmartInsta = 1;
            }
            if (myPlayer.weapon == 5) {
                SmartInsta = 1;
            }
            if (myPlayer.weapon == 7) {
                SmartInsta = 2;
            }
        }, 50);
                setTimeout(() => {
            OldIdWeapon();
                    doNewSend(["6", ["Checked: " + SmartInsta]])
        }, 100);
    }
        if (data[2] < 51 && data[2] > 40 && myPlayer.hat == 6 && antiInsta == true && doinsta === false) {//antiinsta for pol
            doNewSend(["c", [0, 22, 0]]);
            place(foodType);
                       place(foodType);
            place(foodType);
            setTimeout(() => {
                place(foodType);
                           place(foodType);
            }, 170);
            setTimeout(() => {
                            doNewSend(["G", [primary, true]]);
                doNewSend(["c", [0, 7, 0]]);
                            doNewSend(["d",[1]]);
            }, 760);
            setTimeout( () => {
                doNewSend(["c", [0, 6, 0]]);
                            doNewSend(["d",[0]]);
                OldIdWeapon()
            }, 1900);
        }
        if (AntiTi == true && data[2] < 100) {
        var oldHp = data[2]
        setTimeout(() => {
            if (oldHp != data[2] && data[2] < 70) {
                place(spikeType)
                place(foodType)
                place(foodType)
                doNewSend(["d",[1]]);
                doNewSend(["d",[0]]);
                place(foodType)
                place(foodType)
          }
            }, 30);
            setTimeout(() => {
                     oldHp = data[2]
                OldIdWeapon()
                }, 160);
        }
        if (data[2] < 56 && data[2] > 50 && myPlayer.hat == 6 && antiBull == true && doinsta === false) {//bullspam heal
            doNewSend(["d",[1]]);
                            place(foodType);
                                place(spikeType, - toRad(45));
                                place(spikeType, + toRad(45));
                            doNewSend(["c", [0, 53, 0]]);
            setTimeout(() => {
                place(foodType);
                place(foodType);
                doNewSend(["c", [0, 6, 0]]);
            doNewSend(["d",[0]]);
                OldIdWeapon()
            }, 133);
        }
        if (data[2] < 41 && data[2] > 0 && myPlayer.hat == !6 && antiInsta == true && doinsta === false) {
            setTimeout(() => {
                doNewSend(["c", [0, 6, 0]]);
                place(foodType);
                place(foodType);
            }, 133);
            place(foodType);
            place(foodType);
            place(spikeType);
            doNewSend(["d",[1]]);
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["G", [primary, true]]);
            doNewSend(["d",[0]]);
            setTimeout(() => {
                place(spikeType, + toRad(45));
                place(spikeType, - toRad(45));
                doNewSend(["d",[1]]);
                doNewSend(["c", [0, 53, 0]]);
                doNewSend(["d",[0]]);
                doNewSend(["c", [0, 11, 0]]);
            },150);
            setTimeout(() => {
            doNewSend(["c", [0, 6, 0]]);
                OldIdWeapon()
            },300);
        }
    }
    update();
};
function doNewSend(sender){
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}
  const emit = (e, a, b, c, m, r) => ws.send(Uint8Array.from([...msgpack5.encode([e, [a, b, c, m, r]])]));
  function acc(id) { emit("c", myPlayer.accessory, id, 1)}
function hat(id) {
    doNewSend(["c", [0, id, 0]]);
}
function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["G", [id, null]]);
    doNewSend(["d", [1, angle]]);
    doNewSend(["d", [0, angle]]);
                    OldIdWeapon()
}
function hit(angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["d", [1, angle]]);
    doNewSend(["d", [0, myPlayer.dir]]);
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

let automilling = false;
let automill = false;
var x,
    y;
          x = myPlayer.x;
          y = myPlayer.y;
      let angle = Math.atan2(y - myPlayer.y, x - myPlayer.x);
setInterval(()=>{
    if(automill == true && isNextToFriendlyMill == false && millCount < 300 && automilling == false){
        automilling = true;
        doNewSend(["G",[millType, null]])
        doNewSend(["d",[1, (movementDirection - 1.90)]])
        doNewSend(["G",[myPlayer.weapon, true]])
        doNewSend(["G",[millType, null]])
        doNewSend(["d",[1, (movementDirection - 3.14)]])
        doNewSend(["G",[myPlayer.weapon, true]])
        doNewSend(["G",[millType, null]])
        doNewSend(["d",[1, (movementDirection + 1.90)]])
        doNewSend(["G",[myPlayer.weapon, true]])
        doNewSend(["d", [1]]);
        doNewSend(["d", [0]]);
        automilling = false
    }
}, 100);
let autoturreting = false;
setInterval(()=>{
    if(autoTurret == true && autoturreting == false){
        autoturreting = true;
        doNewSend(["G",[turretType, null]])
        doNewSend(["d",[1, (movementDirection - 1.90)]])
        doNewSend(["G",[myPlayer.weapon, true]])
        doNewSend(["G",[turretType, null]])
        doNewSend(["d",[1, (movementDirection - 3.14)]])
        doNewSend(["G",[myPlayer.weapon, true]])
        doNewSend(["G",[turretType, null]])
        doNewSend(["d",[1, (movementDirection + 1.90)]])
        doNewSend(["G",[myPlayer.weapon, true]])
        autoturreting = false
    }
}, 100);
let tankspam = false;
let tankspamming = false;
setInterval(() => {
    if (tankspam && !tankspamming) {
        tankspamming = true;
if (SmartInsta === 2 && ned <= 320) {
    doNewSend(["c", [0, 7, 0]]);
} else {
       doNewSend(["c", [0, 40, 0]]);
}
        doNewSend(["d", [1]]);
        doNewSend(["d", [0]]);
        setTimeout(() => {
            doNewSend(["c", [0, 6, 0]]);
            speedweapon();
            tankspamming = false;
        }, Speed + 100);
    }
}, Speed + 100);
const boostPlacer = repeater(70, () => {place(boostType)}, 50);
const spikePlacer = repeater(86, () => {place(spikeType)}, 50);
const placers = [boostPlacer, spikePlacer];
let prevCount = 0;
const handleMutations = mutationsList => {
    for (const mutation of mutationsList) {
        if (mutation.target.id === "killCounter") {
            const count = parseInt(mutation.target.innerText, 10) || 0;
            if (count > prevCount) {
                doNewSend(["6", [ "GG Kills: " + count]])
                prevCount = count;
        setTimeout(() => {
            doNewSend(["6", [ "MyMod 2 v5 Beta"]])
        }, 1500);
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

    if(e.keyCode == 78 && document.activeElement.id.toLowerCase() !== 'chatbox'){// N = Automill
        automill = !automill
    }

    if(e.keyCode == 16 && document.activeElement.id.toLowerCase() !== 'chatbox'){// H = Turret/Teleporter
        doNewSend(["c", [0, 6, 0]]);
    }

    if(e.keyCode == 72 && document.activeElement.id.toLowerCase() !== 'chatbox'){// H = Turret/Teleporter
        place(turretType, myPlayer.dir + toRad(45));
        place(turretType, myPlayer.dir - toRad(45));
    }
        if(e.keyCode == 66 && document.activeElement.id.toLowerCase() !== 'chatbox'){// G = spawnpads
        place(spawnpadType, myPlayer.dir + toRad(45));
        place(spawnpadType, myPlayer.dir - toRad(45));
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
        if (e.keyCode == 81) {
            place(foodType)
            place(foodType)
            place(foodType)
            setTimeout(() => {
            place(foodType)
            place(foodType)
            place(foodType)
            },10);
    }
        if(e.keyCode == 79 && document.activeElement.id.toLowerCase() !== 'chatbox'){// spiketick
        place(boostType, myPlayer.dir + toRad(45));
        place(boostType, myPlayer.dir - toRad(45));
        place(boostType, myPlayer.dir + toRad(135));
        place(boostType, myPlayer.dir - toRad(135));
        place(boostType, myPlayer.dir + toRad(0));
        place(boostType, myPlayer.dir - toRad(180));
        place(boostType, myPlayer.dir + toRad(90));
        place(boostType, myPlayer.dir - toRad(90));
    }
    if(e.keyCode == 32 && document.activeElement.id.toLowerCase() !== 'chatbox'){// spiketick 72
         place(foodType)
        doNewSend(["d",[1]]);
        doNewSend(["c", [0, 7, 0]]);
        doNewSend(["G", [primary, true]]);
        doNewSend(["d",[1]]);
        setTimeout(() => {
            place(spikeType);
            doNewSend(["c", [0, 53, 0]]);
        },85);
        setTimeout(() => {
            doNewSend(["c", [0, 6, 0]]);
            doNewSend(["d",[0]]);
        },170);
    }
    if (AutoSh == true) {
                setTimeout(() => {
 storeBuy(0, 6, 0)
                },100);
                        setTimeout(() => {
        storeBuy(0, 7, 0)
                },200);
                        setTimeout(() => {
        storeBuy(0, 31, 0)
                },300);
                        setTimeout(() => {
        storeBuy(0, 15, 0)
                },400);
                        setTimeout(() => {
        storeBuy(0, 12, 0)
                },500);
                        setTimeout(() => {
    storeBuy(0, 53, 0)
                },600);
                setTimeout(() => {
        storeBuy(0, 19, 1)
                },700);
                setTimeout(() => {
        storeBuy(0, 11, 1)
                },800);
                setTimeout(() => {
        storeBuy(0, 40, 0)
                },900);
                setTimeout(() => {
        storeBuy(0, 11, 0)
                },1000);
                setTimeout(() => {
        storeBuy(0, 22, 0)
                },1100);
    }
        if (autoreload == true && afterInsta == true) {
            doNewSend(["G", [secondary, true]]);
            speedWeapon2()
        setTimeout(() => {
                    doNewSend(["G", [primary, true]]);
            afterInsta = false
        },Speed2 + 150);
      }
        if(e.keyCode == 89 && document.activeElement.id.toLowerCase() !== 'chatbox'){// insta
            doinsta = true
            afterInsta = false
                   doNewSend(["G", [primary, true]])
            doNewSend(["c", [0, 7, 0]]);
                        doNewSend(["d",[1]]);
         doNewSend(["d",[0]]);
    setTimeout(() => {
        doNewSend(["c", [0, 21, 0]]);
            doNewSend(["G", [secondary, true]]);
                    doNewSend(["d",[1]]);
         doNewSend(["d",[0]]);
    }, 95)
     setTimeout(() => { doNewSend(["G", [primary, true]]); doNewSend(["c", [0, 53, 0]]); place(spikeType)}, 150)
            setTimeout(() => { doNewSend(["c", [0, 6, 0]]); afterInsta = true; doinsta == false}, 225)
}
            if(e.keyCode == 71 && document.activeElement.id.toLowerCase() !== 'chatbox'){// insta
        afterInsta = false
                            doinsta = true
                place(boostType)
doNewSend(["c", [0, 53, 0]]);
            doNewSend(["G", [secondary, true]]);
                        doNewSend(["d",[1]]);
            doNewSend(["d",[0]]);
        setTimeout(() => {
            doNewSend(["G", [primary, true]])
        doNewSend(["c", [0, 7, 0]]);
            doNewSend(["d",[1]]);
            doNewSend(["d",[0]]);
             },70);
            setTimeout(() => {
            doNewSend(["d",[0]]);
            doNewSend(["c", [0, 6, 0]]);
                afterInsta = true
                doinsta = false
        },280);
    }
        if(e.keyCode == 84 && document.activeElement.id.toLowerCase() !== 'chatbox'){// insta
        afterInsta = false
                        doinsta = true
doNewSend(["c", [0, 53, 0]]);
            doNewSend(["G", [secondary, true]]);
                        doNewSend(["d",[1]]);
            doNewSend(["d",[0]]);
        setTimeout(() => {
            doNewSend(["G", [primary, true]])
        doNewSend(["c", [0, 7, 0]]);
            doNewSend(["d",[1]]);
            doNewSend(["d",[0]]);
             },80);
            setTimeout(() => {
            doNewSend(["d",[0]]);
            doNewSend(["c", [0, 6, 0]]);
                            doinsta = false
                afterInsta = true
        },280);
    }
           if(e.keyCode == 82 && instaPc == false && smartWeaponInsta == true && SmartInsta == 1 && document.activeElement.id.toLowerCase() !== 'chatbox'){// insta
                            afterInsta = false
                           doinsta = true
                           doNewSend(["G", [secondary, true]]);
        doNewSend(["c", [0, 7, 0]]);
            doNewSend(["d",[1]]);
            doNewSend(["d",[0]]);
        setTimeout(() => {
                    doNewSend(["G", [primary, true]]);
            doNewSend(["d",[1]]);
            doNewSend(["d",[0]]);
        },90);
                setTimeout(() => {
                    doNewSend(["c", [0, 53, 0]]);
            doNewSend(["G", [primary, true]])
        },180);
 setTimeout(() => {
            doNewSend(["G", [primary, true]])
            doNewSend(["c", [0, 6, 0]]);
     doNewSend(["c", [0, 6, 0]]);
                  afterInsta = true
     doinsta = false
        },295);
      }
           if(e.keyCode == 82 && instaPc == true && smartWeaponInsta == true && SmartInsta == 1 && document.activeElement.id.toLowerCase() !== 'chatbox'){// insta GG
                            afterInsta = false
                           doinsta = true
                           doNewSend(["G", [secondary, true]]);
        doNewSend(["c", [0, 7, 0]]);
            doNewSend(["d",[1]]);
            doNewSend(["d",[0]]);
        setTimeout(() => {
                    doNewSend(["G", [primary, true]]);
            doNewSend(["d",[1]]);
            doNewSend(["d",[0]]);
        },90);
                setTimeout(() => {
                    place(spikeType)
                    doNewSend(["c", [0, 53, 0]]);
            doNewSend(["G", [primary, true]])
        },180);
 setTimeout(() => {
            doNewSend(["G", [primary, true]])
            doNewSend(["c", [0, 6, 0]]);
     doNewSend(["c", [0, 6, 0]]);
                  afterInsta = true
     doinsta = false
        },295);
      }
                if(e.keyCode == 76 && document.activeElement.id.toLowerCase() !== 'chatbox'){// insta
                    place(boostType)
                    doinsta = true
  setTimeout(() => {
        afterInsta = false
doNewSend(["c", [0, 53, 0]]);
            doNewSend(["G", [secondary, true]]);
                        doNewSend(["d",[1]]);
            doNewSend(["d",[0]]);
        setTimeout(() => {
            doNewSend(["G", [primary, true]])
        doNewSend(["c", [0, 7, 0]]);
            doNewSend(["d",[1]]);
            doNewSend(["d",[0]]);
             },70);
            setTimeout(() => {
            doNewSend(["d",[0]]);
            doNewSend(["c", [0, 6, 0]]);
        },280);
        },385);
                      setTimeout(() => {
                                    place(spikeType)
                          afterInsta = true
                          doinsta = false
          },435);
               };
            if(e.keyCode == 82 && instaPc == true && document.activeElement.id.toLowerCase() !== 'chatbox'){// insta
                             afterInsta = false
                            doinsta = true
                           doNewSend(["G", [secondary, true]]);
        doNewSend(["c", [0, 7, 0]]);
            doNewSend(["d",[1]]);
            doNewSend(["d",[0]]);
        setTimeout(() => {
                    doNewSend(["G", [primary, true]]);
            doNewSend(["d",[1]]);
            doNewSend(["d",[0]]);
        },90);
                setTimeout(() => {
                                        place(spikeType)
                    doNewSend(["c", [0, 53, 0]]);
            doNewSend(["G", [primary, true]])
        },180);
 setTimeout(() => {
            doNewSend(["G", [primary, true]])
            doNewSend(["c", [0, 6, 0]]);
     doNewSend(["c", [0, 6, 0]]);
                  afterInsta = true
     doinsta == false
        },295);
      }
            if(e.keyCode == 82 && instaPc == false && document.activeElement.id.toLowerCase() !== 'chatbox'){// insta
                             afterInsta = false
                            doinsta = true
                           doNewSend(["G", [secondary, true]]);
        doNewSend(["c", [0, 7, 0]]);
            doNewSend(["d",[1]]);
            doNewSend(["d",[0]]);
        setTimeout(() => {
                    doNewSend(["G", [primary, true]]);
            doNewSend(["d",[1]]);
            doNewSend(["d",[0]]);
        },90);
                setTimeout(() => {
                    doNewSend(["c", [0, 53, 0]]);
            doNewSend(["G", [primary, true]])
        },180);
 setTimeout(() => {
            doNewSend(["G", [primary, true]])
            doNewSend(["c", [0, 6, 0]]);
                  afterInsta = true
     doinsta == false
        },295);
      }
})
document.addEventListener("mousedown", event => {
    if(event.button == 2 && document.activeElement.id.toLowerCase() !== 'chatbox'){//tankspam
        tankspam = !tankspam
    }
});
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
(function () {
    'use strict';
        var customText = document.createElement('div');
    customText.id = 'customText';
    customText.style = 'position: fixed; top: 0; left: 0; background: #5a2b67; border: 1px solid #ccc; padding: 10px; color: #fff; width: 100%; display: none;';
    customText.innerHTML = `
        <label for="textInput" style="margin-right: 10px;">Введите команду:</label>
        <input type="text" id="textInput" style="width: 300px;">
        <button id="executeButton">Выполнить</button>
        <div id="output" style="margin-top: 10px;"></div>
    `;
    document.body.appendChild(customText);
    var functionsState = {
        function1: false,
        function2: false,
        function3: false,
        function4: false,
        function5: false,
        function6: false,
        function7: false,
        function8: false,
        function9: false,
        function10: false,
        function11: false,
        function12: false,
        function13: false,
        function14: false,
        function15: false,
        function16: false,
        function17: false,
        function18: false,
                function19: false,
                function20: false,
                function21: false,
    };

    var initialState = {
        function1: true,
        function2: true,
        function3: true,
        function4: true,
        function5: false,
        function6: false,
        function7: false,
        function8: false,
        function9: false,
        function10: false,
        function11: false,
        function12: false,
        function13: false,
        function14: false,
        function15: false,
        function16: false,
        function17: false,
        function18: false,
                function19: false,
                function20: false,
                function21: false,
    };

    var customMenu = document.createElement('div');
    customMenu.id = 'customMenu';
    customMenu.style = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #5a2b67; border: 1px solid #ccc; padding: 10px; text-align: center; overflow-y: auto; max-height: 400px; width: 600px; display: none; cursor: move;';
    customMenu.innerHTML = `
        <h2 style="margin: 0; padding-bottom: 10px;">MENU</h2>
        <button class="menuButton" id="function1Button">Anti Insta</button>
        <button class="menuButton" id="function2Button">Anti Bull</button>
        <button class="menuButton" id="function3Button">Spike Insta</button>
        <button class="menuButton" id="function4Button">Auto Heal</button>
        <button class="menuButton" id="function5Button">Auto Insta</button>
        <button class="menuButton" id="function6Button">Auto Reload</button>
        <button class="menuButton" id="function7Button">Damage Tick</button>
        <button class="menuButton" id="function8Button">Damage Trap</button>
        <button class="menuButton" id="function9Button">AFK Spike</button>
        <button class="menuButton" id="function10Button">AutoTurret</button>
        <button class="menuButton" id="function11Button">Auto Biome Hat</button>
        <button class="menuButton" id="function12Button">Auto Q</button>
        <button class="menuButton" id="function13Button">Auto Shop</button>
        <button class="menuButton" id="function14Button">Anti Tick</button>
        <button class="menuButton" id="function15Button">Style</button>
        <button class="menuButton" id="function16Button">Smart Heal</button>
        <button class="menuButton" id="function17Button">SmartInstaTrue</button>
        <button class="menuButton" id="function18Button">SmartInstaType</button>
                <button class="menuButton" id="function19Button">anti trap(not work)</button>
                        <button class="menuButton" id="function20Button">place trap(not work)</button>
                                <button class="menuButton" id="function21Button">replace trap(not work)</button>
        <hr>
        <h3>Приватный чат</h3>
        <input type="text" id="privateChatInput" placeholder="Введите сообщение...">
        <input type="text" id="privateChatSender" placeholder="Имя отправителя">
        <button class="menuButton" id="setChatKey">ключ чата</button>
        <input type="text" id="privateChatKey" placeholder="Ключ чата">
        <button class="menuButton" id="sendPrivateMessage">Отправить</button>
    `;
    document.body.appendChild(customMenu);

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            toggleMenu();
        }
    });

    initializeButtons();

    function initializeButtons() {
        for (var key in initialState) {
            functionsState[key] = initialState[key];
            toggleButtonColor(key + 'Button', initialState[key]);
        }
    }

    document.getElementById('executeButton').addEventListener('click', function () {
        var inputElement = document.getElementById('textInput');
        var inputValue = inputElement.value.trim();
        var outputElement = document.getElementById('output');
        if (inputValue == 'Crash') {
            outputElement.innerHTML = 'Crashing..';
    for (var i = 0; i < 2147483647; i++) {
        doNewSend(["6", [ "1111111111111111111111111111111"]])
        console.log(i + ":Crash");
                    doNewSend(["G", [secondary, true]]);
                        doNewSend(["d",[1]]);
            doNewSend(["d",[0]]);
                    doNewSend(["c", [0, 0, 0]]);
    }
        } else if (inputValue === 'Secret') {
            outputElement.innerHTML = 'Результат команды 2';
        } else {
            outputElement.innerHTML = 'Неизвестная команда';
        }
        inputElement.value = '';
    });

 document.getElementById('function1Button').addEventListener('click', function () {
        functionsState.function1 = !functionsState.function1;
        toggleButtonColor('function1Button', functionsState.function1);
        antiInsta = !antiInsta;
    });

    document.getElementById('function2Button').addEventListener('click', function () {
        functionsState.function2 = !functionsState.function2;
        toggleButtonColor('function2Button', functionsState.function2);
        antiBull = !antiBull;
    });

    document.getElementById('function3Button').addEventListener('click', function () {
        functionsState.function3 = !functionsState.function3;
        toggleButtonColor('function3Button', functionsState.function3);
        instaPc = !instaPc;
    });

    document.getElementById('function4Button').addEventListener('click', function () {
        functionsState.function4 = !functionsState.function4;
        toggleButtonColor('function4Button', functionsState.function4);
        autoheal = !autoheal;
    });

    document.getElementById('function5Button').addEventListener('click', function () {
        functionsState.function5 = !functionsState.function5;
        toggleButtonColor('function5Button', functionsState.function5);
        autoinsta = !autoinsta;
    });

    document.getElementById('function6Button').addEventListener('click', function () {
        functionsState.function6 = !functionsState.function6;
        toggleButtonColor('function6Button', functionsState.function6);
        autoreload = !autoreload;
    });

    document.getElementById('function7Button').addEventListener('click', function () {
        functionsState.function7 = !functionsState.function7;
        toggleButtonColor('function7Button', functionsState.function7);
        damageTick = !damageTick;
    });

    document.getElementById('function8Button').addEventListener('click', function () {
        functionsState.function8 = !functionsState.function8;
        toggleButtonColor('function8Button', functionsState.function8);
        damageTrap = !damageTrap;
    });

        document.getElementById('function9Button').addEventListener('click', function () {
        functionsState.function9 = !functionsState.function9;
        toggleButtonColor('function9Button', functionsState.function9);
        afkspike = !afkspike;
    });
            document.getElementById('function10Button').addEventListener('click', function () {
        functionsState.function10 = !functionsState.function10;
        toggleButtonColor('function10Button', functionsState.function10);
        autoTurret = !autoTurret;
    });

            document.getElementById('function11Button').addEventListener('click', function () {
        functionsState.function11 = !functionsState.function11;
        toggleButtonColor('function11Button', functionsState.function11);
        bht = !bht;
    });

            document.getElementById('function12Button').addEventListener('click', function () {
        functionsState.function12 = !functionsState.function12;
        toggleButtonColor('function12Button', functionsState.function12);
        AutoQ = !AutoQ;
    });

            document.getElementById('function13Button').addEventListener('click', function () {
        functionsState.function13 = !functionsState.function13;
        toggleButtonColor('function13Button', functionsState.function13);
        AutoSh = !AutoSh;
    });

            document.getElementById('function14Button').addEventListener('click', function () {
        functionsState.function14 = !functionsState.function14;
        toggleButtonColor('function14Button', functionsState.function14);
        AntiTi = !AntiTi;
    });

            document.getElementById('function15Button').addEventListener('click', function () {
        functionsState.function15 = !functionsState.function15;
        toggleButtonColor('function15Button', functionsState.function15);
        BlockPW = !BlockPW;
    });

            document.getElementById('function16Button').addEventListener('click', function () {
        functionsState.function16 = !functionsState.function16;
        toggleButtonColor('function16Button', functionsState.function16);
        LowHeal = !LowHeal;
    });

            document.getElementById('function17Button').addEventListener('click', function () {
        functionsState.function17 = !functionsState.function17;
        toggleButtonColor('function17Button', functionsState.function17);
        InstaK = !InstaK;
    });

            document.getElementById('function18Button').addEventListener('click', function () {
        functionsState.function18 = !functionsState.function18;
        toggleButtonColor('function18Button', functionsState.function18);
        smartWeaponInsta = !smartWeaponInsta;
    });

            document.getElementById('function19Button').addEventListener('click', function () {
        functionsState.function19 = !functionsState.function19;
        toggleButtonColor('function19Button', functionsState.function19);
        antitrap = !antitrap;
    });

            document.getElementById('function20Button').addEventListener('click', function () {
        functionsState.function20 = !functionsState.function20;
        toggleButtonColor('function20Button', functionsState.function20);
        palcetraps = !palcetraps;
    });

            document.getElementById('function21Button').addEventListener('click', function () {
        functionsState.function21 = !functionsState.function21;
        toggleButtonColor('function21Button', functionsState.function21);
        RpTraps = !RpTraps;
    });

    document.getElementById('setChatKey').addEventListener('click', function () {
        setChatKey();
    });

        document.getElementById('setChatKey').addEventListener('click', function () {
        setChatKey();
    });

    function toggleMenu() {
        var menu = document.getElementById('customMenu');
                var chatMe = document.getElementById('customText');
        menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
        chatMe.style.display = (chatMe.style.display === 'none' || chatMe.style.display === '') ? 'block' : 'none';
    }

    function toggleButtonColor(buttonId, isActive) {
        var button = document.getElementById(buttonId);
        button.style.backgroundColor = isActive ? '#4CAF50' : '#FF0000';
        button.style.color = '#fff';
    }

    function setChatKey() {
        var chatKeyInput = document.getElementById('privateChatKey');
        var chatKey = chatKeyInput.value.trim();
    }

    function sendPrivateMessage() {
        var messageInput = document.getElementById('privateChatInput');
        var message = messageInput.value.trim();
        var senderInput = document.getElementById('privateChatSender');
        var sender = senderInput.value || 'Вы';
        var chatKeyInput = document.getElementById('privateChatKey');
        var chatKey = chatKeyInput.value;

        if (message !== '' && chatKey === 'Nigger666') {
            appendMessageToChat(message, sender);
            messageInput.value = '';
        }
    }

    var privateChatMessages = document.createElement('div');
    privateChatMessages.id = 'privateChatMessages';
    privateChatMessages.style = 'max-height: 200px; overflow-y: auto; margin-top: 10px;';

    customMenu.appendChild(privateChatMessages);

    function appendMessageToChat(message, sender) {
        var messageElement = document.createElement('div');
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        privateChatMessages.appendChild(messageElement);

        privateChatMessages.scrollTop = privateChatMessages.scrollHeight;
    }
})();
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