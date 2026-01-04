// ==UserScript==
// @name         RebeLM00D
// @namespace    RebeLM00D
// @version      2
// @description  made with rebelhands
// @author       @gekihoss
// @license MIT
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js?version=912797
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @require      https://greasyfork.org/scripts/456235-moomoo-js/code/MooMoojs.js?version=1144167
// @require 	 https://greasyfork.org/scripts/478839-moomoo-io-packet-code/code/MooMooio%20Packet%20Code.js?version=1274028
// @grant        none
// @icon         https://cdn.discordapp.com/avatars/1131925981460975676/36b51f984147c8b907af0a3dcb834853.png?size=4096
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/483489/RebeLM00D.user.js
// @updateURL https://update.greasyfork.org/scripts/483489/RebeLM00D.meta.js
// ==/UserScript==
var onWeapon;
document.getElementById("enterGame").addEventListener('click', autohide);
function autohide(){
    $("#ot-sdk-btn-floating").hide();
}
$("#moomooio_728x90_home").parent().css({display: "none"});
document.getElementById('linksContainer2').innerHTML = ' none ' ;
document.getElementById('gameName').innerHTML = 'RebeLM00D';
document.getElementById('loadingText').innerHTML = 'Wait or im gonna fuck ur mother'
document.getElementById('diedText').innerHTML = "U DIED, REMIND REBEL HE NEVER LOSE!";
document.getElementById('diedText').style.color = "#ffffff";
document.title = 'All those people sucks';
document.getElementById("leaderboard").append ('All those people sucks');
$("#mapDisplay").css({background: `url('https://i.pinimg.com/originals/97/57/67/975767e67adc18ad53d5a1a687cb6421.gif')`});
document.getElementById("storeHolder").style = "height: 1200px; width: 450px;";
document.getElementById("promoImgHolder").remove();
document.querySelector("#pre-content-container").remove(); //ANTI AD
$('#itemInfoHolder').css({'top':'1050px',
                          'left':'15px'
                         });
$("#youtuberOf").remove();
$("#adCard").remove();
$("#mobileInstructions").remove();
$("#downloadButtonContainer").remove();
$("#mobileDownloadButtonContainer").remove();
$(".downloadBadge").remove();
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
let EnemyTrapLocsX;
let EnemyTrapLocsY;
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
var clanToggle = 0;
let healToggle = 2;
let hatToggle = 1;
var antiInsta = true;
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
function biomeHat() {
    if (myPlayer.y < 2400) {
        hat(6);
    } else {
        if (myPlayer.y > 6850 && myPlayer.y < 7550) {
            hat(6);
        } else {
            hat(6);
        }
    }
    //acc(11);
}
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
        //isNextToFriendlyMill = false;
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
            if (damage <= -1) {
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
        if (data[2] < 100 && data[2] >= 0) {
            let c;
            if (data[2] < 99 && data[2] > 78) { c = 1;
            for (let i=0;i<c;i++) { place(foodType) };
                     doNewSend(["c", [0, 22, 0]]);
             setTimeout(() => {
                doNewSend(["c", [0, 6, 0]]);
            }, 200);
            }
        if (data[2] < 78 && data[2] > 60) { c = 2;
        for (let i=0;i<c;i++) { place(foodType) };
                doNewSend(["c", [0, 6, 0]]);
        }
        if (data[2] < 60 && data[2] > 30) { c = 3;
        for (let i=0;i<c;i++) { place(foodType) };
                doNewSend(["c", [0, 6, 0]]);
        }
        if (data[2] < 30 && data[2] > 0){ c = 4;
        for (let i=0;i<c;i++) { place(foodType) };
                doNewSend(["c", [0, 6, 0]]);
             place(spikeType);
        }
        }
        if (data[2] < 33 && data[2] > 0 && myPlayer.hat !== 6) {//antiinsta no sold
            doNewSend(["c", [0, 22, 0]]);
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
            }, 1900);
        }
        if (data[2] < 51 && data[2] > 40 && myPlayer.hat == 6) {//antiinsta for pol
            doNewSend(["c", [0, 22, 0]]);
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
            }, 1900);
        }
        if (data[2] < 56 && data[2] > 50 && myPlayer.hat == 6) {//bullspam heal
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
            }, 133);
        }
        if (data[2] < 41 && data[2] > 0 && myPlayer.hat == !6) {
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
            doNewSend(["d",[1]]);
            setTimeout(() => {
                place(spikeType, + toRad(45));
                doNewSend(["d",[1]]);
                place(spikeType, - toRad(45));
                doNewSend(["d",[1]]);
                doNewSend(["c", [0, 53, 0]]);
                doNewSend(["d",[0]]);
                doNewSend(["c", [0, 11, 0]]);
            },150);
            setTimeout(() => {
            doNewSend(["c", [0, 6, 0]]);
            },300);
        }
    }
    update();
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
        automilling = false
    }
}, 100);
let tankspam = false;
let tankspamming = false;
setInterval(()=>{
    if(tankspam == true && tankspamming == false){
        tankspamming = true;
        doNewSend(["c", [0, 40, 0]]);
        doNewSend(["d",[1]]);
        setTimeout(() => {
        doNewSend(["c", [0, 6, 0]]);
            tankspamming = false
            doNewSend(["d",[0]]);
        },100);
    }
},200);
const boostPlacer = repeater(70, () => {place(boostType)}, 50);
const spikePlacer = repeater(86, () => {place(spikeType)}, 50);
const placers = [boostPlacer, spikePlacer];
let prevCount = 0;
const handleMutations = mutationsList => {
    for (const mutation of mutationsList) {
        if (mutation.target.id === "killCounter") {
            const count = parseInt(mutation.target.innerText, 10) || 0;
            if (count > prevCount) {
                doNewSend(["6", [ "GG Kills = " + count]])
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
 
    if(e.keyCode == 78 && document.activeElement.id.toLowerCase() !== 'chatbox'){// N = Automill
        automill = !automill
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
        place(spikeType, myPlayer.dir + toRad(45));
        place(spikeType, myPlayer.dir - toRad(45));
        place(spikeType, myPlayer.dir + toRad(135));
        place(spikeType, myPlayer.dir - toRad(135));
        }, 160);
    }
    if (e.keyCode == 16) {//booster hat
        biomeHat()
    }
        if (e.keyCode == 81) {
            place(foodType)
            place(foodType)
            place(foodType)
    }
        if(e.keyCode == 79 && document.activeElement.id.toLowerCase() !== 'chatbox'){// spiketick
        place(boostType, myPlayer.dir + toRad(45));
        place(boostType, myPlayer.dir - toRad(45));
        place(boostType, myPlayer.dir + toRad(135));
        place(boostType, myPlayer.dir - toRad(135));
    }
    if(e.keyCode == 32 && document.activeElement.id.toLowerCase() !== 'chatbox'){// spiketick
                    place(foodType)
        place(spikeType);
        doNewSend(["d",[1]]);
        doNewSend(["c", [0, 7, 0]]);
        doNewSend(["G", [primary, true]]);
        doNewSend(["d",[1]]);
        setTimeout(() => {
            doNewSend(["c", [0, 53, 0]]);
        },75);
        setTimeout(() => {
            doNewSend(["c", [0, 6, 0]]);
            doNewSend(["d",[0]]);
            place(foodType)
        },150);
    }
    if(e.keyCode == 82 && document.activeElement.id.toLowerCase() !== 'chatbox'){// insta
        doNewSend(["c", [0, 53, 0]]);
        doNewSend(["G", [primary, true]]);
        setTimeout(() => {
        doNewSend(["c", [0, 7, 0]]);
            doNewSend(["d",[1]]);
            doNewSend(["d",[0]]);
        },85);
        setTimeout(() => {
            place(foodType)
            doNewSend(["G", [secondary, true]]);
            doNewSend(["d",[1]]);
        },170);
                setTimeout(() => {
            doNewSend(["d",[0]]);
            doNewSend(["G", [primary, true]])
            doNewSend(["c", [0, 6, 0]]);
        },280);
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
    /*if (e.keyCode == 71) {
        setTimeout(() => {
            doNewSend(["33", [null]]);
            boostDir = null;
        }, 10);
    }*/
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
    'use strict';
alert("Project Anti Clown by RebeL is running!");
alert("GF-HF");
    document.title = "RebeLM00D";
    document.head.innerHTML += `<style>`;
 
    this(author > 1); {
var author; document.getElementById("Blitz Utility");
var authorURL; document.getElementById("bit.ly/this-greasyfork");
 
 
    if (author === (4)) {
addScript => document.getElementById("Downloaded Scripts");
scriptHeader = document.getElementById("add" > 30);
    }
 
    }
 
if(event === clown) {
    var input; document.getElementById("id;clown");
    var clown; document.getElementById("id;tag");
    const unequip = true;
}
 if(event === clown.Tag) {
     var level1; document.getElementById('id;tag' > 1);
     var level2; document.getElementById('id;tag' > 2);
     var level3; document.getElementById('id;tag' > 3);
     var level4; document.getElementById('id;tag' > 4);
     var level5; document.getElementById('id;tag' > 5);
     var level6; document.getElementById('id;tag' > 6);
     var level7; document.getElementById('id;tag' > clown.true);
   const unequip = true;
 }
clown.id = (1); {
var id; document.getElementById('moo' > clown.M );
var tag; document.getElementById('html' > clown.num);
}
 
var num; document.getElementById('id;tag' > Math.floor(1 ^ 7)); {
 if(keyCode === 191) {
     var socket; document.getElementById('id;tag' > 'disabled' );
 }
}(1 > client);
 
})();