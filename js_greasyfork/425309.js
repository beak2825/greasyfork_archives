// ==UserScript==
// @name         darkMod
// @namespace    -
// @version      1.0
// @description  dont share
// @author       DarK69
// @match        *://moomoo.io/*
// @match        http://dev.moomoo.io/*
// @match        *sandbox.moomoo.io/*
// @match        *abc.moomoo.io/*
// @grant        none
// @require https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @downloadURL https://update.greasyfork.org/scripts/425309/darkMod.user.js
// @updateURL https://update.greasyfork.org/scripts/425309/darkMod.meta.js
// ==/UserScript==

/*START WITH MORE RESOURCES*/
setInterval(() => window.follmoo && follmoo(), 10);
/*IF YOU REMOVE THIS THE HACK WILL BE AGAINST MOOMOO.IO TOS AS YOU WILL NEED TO ACCEPT THEM*/
/*IF YOU REMOVE THIS THE HACK WILL BE AGAINST MOOMOO.IO TOS AS YOU WILL NEED TO ACCEPT THEM*/
/*IF YOU REMOVE THIS THE HACK WILL BE AGAINST MOOMOO.IO TOS AS YOU WILL NEED TO ACCEPT THEM*/
$("#consentBlock").css({display: "none"});
/*IF YOU REMOVE THIS THE HACK WILL BE AGAINST MOOMOO.IO TOS AS YOU WILL NEED TO ACCEPT THEM*/
/*IF YOU REMOVE THIS THE HACK WILL BE AGAINST MOOMOO.IO TOS AS YOU WILL NEED TO ACCEPT THEM*/
/*IF YOU REMOVE THIS THE HACK WILL BE AGAINST MOOMOO.IO TOS AS YOU WILL NEED TO ACCEPT THEM*/
//$("#youtuberOf").css({display: "none"});

document.getElementById("moomooio_728x90_home").style.display = "none";
//$("#moomooio_728x90_home").parent().css({display: "none"});

window.onbeforeunload = null;

let mouseX;
let mouseY;

let width;
let height;

/*setInterval(() => {
    if(clanToggle == 1) {
        doNewSend(["9", [null]]);
        doNewSend(["8", [animate(false, 5)]])
    }
    doNewSend(["testing", [6]]);
}, 200);*/

setInterval(() => {
    if(messageToggle) {
        doNewSend(["ch", [spamText]])
    }
}, 200);

setInterval(() => {
    if(autoaim == true) {
        doNewSend(["2", [nearestEnemyAngle]]);
    }
}, 0);

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
    canvasContext = cvs.getContext("2d");
}

let coreURL = new URL(window.location.href);
window.sessionStorage.force = coreURL.searchParams.get("fc");
var canvas = document.getElementById("gameCanvas");
var menu = document.createElement("div");
menu.innerHTML = '<div><h1>---DarK69 Mod Menu---</h1></div>';
menu.innerHTML += '<div><h2>Health Menu</h2></div>'
menu.innerHTML += '<div><input type="checkbox" id="healEnable" style="background-color: rgba(255, 255, 255, 0.5); padding: 0;border: none;">HealEnable</input></div>';
menu.innerHTML +='<div><input id="healSpeed" style="background-color: rgba(255, 255, 255, 0.5); padding: 0;border: none;">Speed</input></div>'
menu.innerHTML += '<div><h2>Katana musket</h2></div>'
menu.innerHTML +='<div><button id="katana" style="background-color: rgba(255, 255, 255, 0.5); padding: 0;border: none;">Katana + Musket(Age 9)</button></div>'
menu.innerHTML += '<div><h2>Chat Spam</h2></div>'
menu.innerHTML += '<div><input type="checkbox" id="chatEnable" style="background-color: rgba(255, 255, 255, 0.5); padding: 0;border: none;">SpamEnable</input></div>';
/*-----------------------------------------------------------------MENU STYLE-----------------------------------------------------------------*/
menu.style = "display: none;width: 250px;height: 350px; position: absolute;text-align: left;top:10px;left:10px;background-color: rgba(0, 0, 0, 0.25);"
menu.style.overflow = "auto";
menu.style.display = "none";
document.getElementsByTagName("body")[0].appendChild(menu);
var hud = document.createElement("div");
hud.innerHTML = '<button id="menuBtn" style="width: 70px; height: 45px; bottom: 190px; right: 20px; position: fixed;background-color: rgba(0, 0, 0, 0.25); padding: 0;border: none;">Menu</button>';
document.getElementsByTagName("body")[0].appendChild(hud);
var menuBtn = document.getElementById("menuBtn");
menuBtn.addEventListener("click", function(event){
  menu.style.display = menu.style.display == "none" ? "block" : "none"
});
var menuHealth = document.getElementById("healEnable");
menuHealth.checked = true;
var menuHSpeed = document.getElementById("healSpeed");
menuHSpeed.value = 25;
var menuKatana = document.getElementById("katana");
menuKatana.addEventListener("click", function(event){
doNewSend(["6", [4]])
doNewSend(["6", [15]])
});
var menuSpam = document.getElementById("chatEnable");
var menuText = document.getElementById("spamText");
let healSpeed = 25;
var messageToggle = false;
var canvasContext;
var clanToggle = 0;
let healToggle = 1;
let hatToggle = 1;
var spamText;
var nearestEnemy;
var nearestEnemyAngle;
var isEnemyNear;
var instaSpeed = 240;
var InstaSpeed = 300;
var gameCanvas;
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
    //if(!(item === "pp" || item == "a" || item == "33" || item == "13"|| item == "mm"|| item == "t"|| item == "5"|| item == "6"|| item == "id"|| item == "8"|| item == "7")){console.log(item);console.log(data)}
    if(item === "io-init") {
        let cvs = document.getElementById("gameCanvas");
        width = cvs.clientWidth;
        height = cvs.clientHeight;
        window.onresize = function() {
            width = cvs.clientWidth;
            height = cvs.clientHeight;
        };
        cvs.addEventListener("mousemove", e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
    }

    if (item == "1" && myPlayer.id == null){
        //set player's id(for usual checks)
        myPlayer.id = data[1];
    }
    //check if player has sent a message
    if(item == "ch" && data[1] == myPlayer.id) {
        spamText = data[2];
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


    if(enemiesNear) {
        nearestEnemy = enemiesNear.sort((a,b) => dist(a, myPlayer) - dist(b, myPlayer))[0];
    }
    isEnemyNear = false;
    if(nearestEnemy) {
        nearestEnemyAngle = Math.atan2(nearestEnemy[2]-myPlayer.y, nearestEnemy[1]-myPlayer.x);
        if(dist(myPlayer,nearestEnemy) < 300) {
            isEnemyNear = true;
            if(autoaim == false && myPlayer.hat != 7 && myPlayer.hat != 53) {
                normalHat = 6;
                if(primary != 8) {
                    normalAcc = 19
                }
            };
        }
    }
    if(isEnemyNear == false && autoaim == false) {
        //water and winter cap
        if (myPlayer.y < 2400){
            normalHat = 15;
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
            //fish hat
            normalHat = 31;
        }
    }
    if (!nearestEnemy) {
        nearestEnemyAngle = myPlayer.dir;
    }
    if(item == "h" && data[1] == myPlayer.id) {
        if(data[2] < 100 && data[2] > 0 && healToggle == 1) {
            setTimeout( () => {
                let angle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Math.atan2(mouseY - height / 2, mouseX - width / 2);
                doNewSend(['5', [foodType, null]]);
                doNewSend(['c', [1, angle]]);
                doNewSend(['c', [0, angle]]);
                doNewSend(['5', [myPlayer.weapon, true]]);
            }, healSpeed);

        }
    }
    update();
}
function place(object) {
var angle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Math.atan2(mouseY - height / 2, mouseX - width / 2);
doNewSend(['5', [object, null]]);
doNewSend(['c', [1, angle]]);
doNewSend(['c', [0, angle]]);
doNewSend(['5', [myPlayer.weapon, true]]);
doNewSend(['5', [object, null]]);
doNewSend(['c', [1, angle]]);
doNewSend(['c', [0, angle]]);
doNewSend(['5', [myPlayer.weapon, true]]);
}

function doNewSend(doNewSend){
    if(ws)ws.send(new Uint8Array(Array.from(msgpack5.encode(doNewSend))));
}

function acc(id) {
    doNewSend(["13c", [0, 0, 1]]);
    doNewSend(["13c", [0, id, 1]]);
}

function hat(id) {
    doNewSend(["13c", [0, id, 0]]);
}
function dist(a,b) {
    return(Math.sqrt(Math.pow (a.x-b.x, 2) + Math.pow (a.y-b.y, 2)))
}
function update() {
    var event = 0;
    healToggle = menuHealth.checked ? 1: 0;
    healSpeed = menuHSpeed.value;
    messageToggle = menuSpam.checked;
    for (; event < 9; event++) {
        if (isElementVisible(document.getElementById('actionBarItem' + event.toString()))) {
            primary = event;
        }
    }
    var div = 9;
    for (; div < 16; div++) {
        if (isElementVisible(document.getElementById('actionBarItem' + div.toString()))) {
            secondary = div;
        }
    }
    var tobj = 16;
    for (; tobj < 19; tobj++) {
        if (isElementVisible(document.getElementById('actionBarItem' + tobj.toString()))) {
            foodType = tobj - 16;
        }
    }
    var props = 19;
    for (; props < 22; props++) {
        if (isElementVisible(document.getElementById('actionBarItem' + props.toString()))) {
            wallType = props - 16;
        }
    }
    var e = 22;
    for (; e < 26; e++) {
        if (isElementVisible(document.getElementById('actionBarItem' + e.toString()))) {
            spikeType = e - 16;
        }
    }
    var f = 26;
    for (; f < 29; f++) {
        if (isElementVisible(document.getElementById('actionBarItem' + f.toString()))) {
            millType = f - 16;
        }
    }
    var g = 29;
    for (; g < 31; g++) {
        if (isElementVisible(document.getElementById('actionBarItem' + g.toString()))) {
            mineType = g - 16;
        }
    }
    var h = 31;
    for (; h < 33; h++) {
        if (isElementVisible(document.getElementById('actionBarItem' + h.toString()))) {
            boostType = h - 16;
        }
    }
    var intval = 33;
    for (; intval < 39; intval++) {
        if (isElementVisible(document.getElementById('actionBarItem' + intval.toString())) && intval != 36) {
            turretType = intval - 16;
        }
    }
    spawnpadType = 36;
}
function isElementVisible(options) {
return options.offsetParent !== null;
}
document.addEventListener('keydown', (e)=>{

/*    if(e.keyCode == 78 && document.activeElement.id.toLowerCase() !== 'chatbox') {

        doNewSend(["6", [4]])
    }
    if(e.keyCode == 77 && document.activeElement.id.toLowerCase() !== 'chatbox') {

        doNewSend(["6", [15]])
    }*/
    if(e.keyCode == 86 && document.activeElement.id.toLowerCase() !== 'chatbox') place(spikeType, null);
    if(e.keyCode == 70 && document.activeElement.id.toLowerCase() !== 'chatbox') place(boostType, null);
    if(e.keyCode == 71 && document.activeElement.id.toLowerCase() !== 'chatbox') place(turretType, null);
});