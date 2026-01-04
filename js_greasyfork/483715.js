// ==UserScript==
// @name         vn-x mod
// @namespace    none
// @version      1.2.2
// @description  love that chicken from popeyes
// @author       :death:
// @license MIT
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js?version=912797
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483715/vn-x%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/483715/vn-x%20mod.meta.js
// ==/UserScript==

document.getElementById("enterGame").addEventListener('click', autohide);
function autohide(){
    $("#ot-sdk-btn-floating").hide();
}
$("#moomooio_728x90_home").parent().css({display: "none"});
document.getElementById('gameName').innerHTML = 'vn-x mod';
document.getElementById('gameName').style.color = 'black';
document.getElementById('loadingText').innerHTML = 'vn-x mod loading'
document.getElementById('diedText').innerHTML = "lol hacker got fucked";
document.getElementById('diedText').style.color = "black";
document.title = ' vn-x mod';
document.getElementById("leaderboard").append ('vn-x mod');
document.getElementById("storeHolder").style = "height: 1150px; width: 400px;";
document.getElementById("promoImgHolder").remove();
document.getElementById('setupCard').style.background = "black";
document.getElementById('guideCard').style.background = "black";
document.getElementById("mainMenu").style.backgroundImage = "url('https://pics.craiyon.com/2023-07-30/4faf33f0ba4449ff940dc00738a1a52b.webp')";
document.querySelector("#pre-content-container").remove();
$('#itemInfoHolder').css({'top':'1050px',
                          'left':'15px'
                         });



    // Removing ads
    $("#wideAdCard").remove();
    $("#adCard").remove();
    $("#promoImgHolder").remove();

let style = document.createElement('style')
   style.appendChild(document.createTextNode(`


  #mapDisplay {
  background-image: url(data:image/png;base64,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) !important;
  background-size: contain !important;
}

  #menuCardHolder[style*="block"] {
  display: grid !important;
}

`))


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
        ping.innerHTML = "Ping: " + window.pingTime + " ms"
    }
}, window.pingTime ? 0 : 1e3);
let lastDamageTick = 0;
let HP = 100;
let gameTick = 0;
var shame = 0;
let shameTime,
    damageTimes = 0;
let friendlyMillLocs = [];
let nearestFriendlyMill;
let nearestFriendlyMillX;
let nearestFriendlyMillY;
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
setInterval(function() {
    if (myPlayer.hat == 45) {
        doNewSend(["6", ["Damn"]]);
    }
}, 100);
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

let healSpeed = 100;
var messageToggle = 0;
var clanToggle = 0;
let healToggle = 1;
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
               var onWeapon = true;
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
        if (data[2] < 100 && data[2] > 55) {//normal heal
            console.log("normal healing")
            setTimeout(() => {
                place(foodType);
                place(foodType);
                doNewSend(["c", [0, 11, 0]]);
                // doNewSend(["6", ["Heal"]]);
            }, 133);
        }
        if (data[2] < 33 && data[2] > 0 && myPlayer.hat !== 6) {//antiinsta no sold
            console.log("no soldier anti")
            doNewSend(["c", [0, 22, 0]]);
            //doNewSend(["6", ["Anti"]]);
            place(foodType);
            setTimeout(() => {
                place(foodType);
            }, 170);
            setTimeout(() => {
                doNewSend(["c", [0, 7, 0]]);
            }, 760);
            setTimeout( () => {
                doNewSend(["c", [0, 11, 0]]);
            }, 1900);
        }
        if (data[2] < 51 && data[2] > 40 && myPlayer.hat == 6) {//antiinsta for pol
            console.log("anti insta")
            doNewSend(["c", [0, 22, 0]]);
            //doNewSend(["6", ["Anti"]]);
            place(foodType);
            setTimeout(() => {
                place(foodType);
            }, 170);
            setTimeout(() => {
                doNewSend(["c", [0, 7, 0]]);
            }, 760);
            setTimeout( () => {
                doNewSend(["c", [0, 11, 0]]);
            }, 1900);
        }
        if (data[2] < 56 && data[2] > 50 && myPlayer.hat == 6) {//bullspam heal
            console.log("anti bullspam")
            setTimeout(() => {
                place(foodType);
                place(foodType);
                doNewSend(["c", [0, 11, 0]]);
                //doNewSend(["6", ["BHeal1"]]);
            }, 150);
        }
        if (data[2] < 41 && data[2] > 0 && myPlayer.hat == 11) {
            console.log("hitbacking")
            setTimeout(() => {
                place(foodType);
                place(foodType);
            }, 133);
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
            },150);
            setTimeout(() => {
                doNewSend(["c", [0, 11, 0]]);
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
        doNewSend(["G", [secondary, true]]);
        doNewSend(["d",[1]]);
        setTimeout(() => {
            doNewSend(["c", [0, 6, 0]]);
            tankspamming = false
            doNewSend(["d",[0]]);
        },200);
    }
},325);
const boostPlacer = repeater(70, () => {place(boostType)}, 50);
const spikePlacer = repeater(86, () => {place(spikeType)}, 50);
const placers = [boostPlacer, spikePlacer];
let prevCount = 0;
const handleMutations = mutationsList => {
    for (const mutation of mutationsList) {
        if (mutation.target.id === "killCounter") {
            const count = parseInt(mutation.target.innerText, 10) || 0;
            if (count > prevCount) {
                doNewSend(["6", ["LOVE THAT CHICKEN FROM POPEYES"]]);
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
    if (e.keyCode == 16) {//booster hat
        biomeHat()
    }
    if(e.keyCode == 32 && document.activeElement.id.toLowerCase() !== 'chatbox'){// spiketick
        console.log("spiketick")
        place(spikeType);
        doNewSend(["d",[1]]); //prepare to place spike
        doNewSend(["c", [0, 7, 0]]); //place
        doNewSend(["G", [primary, true]]);
        doNewSend(["d",[1]]);
        setTimeout(() => {
            doNewSend(["c", [0, 53, 0]]);
        },200);
        setTimeout(() => {
            doNewSend(["c", [0, 6, 0]]);
            doNewSend(["d",[0]]);
        },150);
    }
    if(e.keyCode == 84 && document.activeElement.id.toLowerCase() !== 'chatbox'){// insta
        console.log("katana insta")
        doNewSend(["d",[1]])
        doNewSend(["G", [secondary, true]]);
        doNewSend(["c", [0, 53, 0]]);
        setTimeout(() => {
            doNewSend(["G", [primary, true]]);
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["d",[1]]);
            doNewSend(["d",[0]]);
        },100);
        setTimeout(() => {
            doNewSend(["G", [primary, true]]);
            doNewSend(["c", [0, 6, 0]]);
            doNewSend(["d",[0]]);
        },900);
    }
})
document.addEventListener("mousedown", event => {
    if(event.button == 2 && document.activeElement.id.toLowerCase() !== 'chatbox'){// spiketick
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