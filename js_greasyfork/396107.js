// ==UserScript==
// @name        MooMod
// @namespace    -
// @version      1
// @description  A MooMoo mod for LeGeNDaRy.
// @author       Empel
        //    MooMoo.io
// @match        *://moomoo.io/*
// @match        *sandbox.moomoo.io/*
// @match        *dev.moomoo.io/*
// @grant        none
// @icon         http://moomoo.io/img/icons/skull.png
// @require https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js


// @downloadURL https://update.greasyfork.org/scripts/396107/MooMod.user.js
// @updateURL https://update.greasyfork.org/scripts/396107/MooMod.meta.js
// ==/UserScript==

//                      Edited version of BEXTIYAR's hack.
//                         Thanks to him :3


//     MooMod Code's    \\

var MooMod_Best_Hack_
var AutoHealSpeed_2e2oAZE
var HealMax_99AZE
var ANTI_ARMANIA


document.getElementById("moomooio_728x90_home").style.display = "none";//Add Blocker Bextiyar
$("#moomooio_728x90_home").parent().css({display: "none"});

window.onbeforeunload = null;

let mouseX;
let mouseY;

let width;
let height;

setInterval(() => {
   if(clanToggle == 1) {
        doNewSend(["9", [null]]);
        doNewSend(["8", [animate(false, 5)]])
    }
    doNewSend(["testing", [6]]);
}, 200);

setInterval(() => {
    if(messageToggle == 1) {
        doNewSend(["ch", [animate(true, 5)]])
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
}

let coreURL = new URL(window.location.href);
window.sessionStorage.force = coreURL.searchParams.get("fc");

var nearestEnemy;
var nearestEnemyAngle;
var isEnemyNear;
var instaSpeed = 242;
var primary;
var autobull;
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
var aimbbot = true;
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

let healSpeed = 0;
var messageToggle = 0;
var clanToggle = 0;
let healToggle = 1;
let hatToggle = 1;

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
        nearestEnemy = enemiesNear.sort((a,b) => dist(a, myPlayer) - dist(b, myPlayer))[0];
    }

    if(nearestEnemy) {
        nearestEnemyAngle = Math.atan2(nearestEnemy[2]-myPlayer.y, nearestEnemy[1]-myPlayer.x);
        if(Math.sqrt(Math.pow((myPlayer.y-nearestEnemy[2]), 2) + Math.pow((myPlayer.x-nearestEnemy[1]), 2)) < 180) {
            isEnemyNear = true;
            if(autoaim == false && myPlayer.hat != 6 && myPlayer.hat != 6) {
                normalHat = 6;
                if(primary != 8) {
                    normalAcc = 11
                }
            };
        }
    }
    if(isEnemyNear == false && autoaim == false) {
        normalAcc = 11;
        if (myPlayer.y < 2400){
            normalHat = 15;
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
            normalHat = 31;
        } else {
	        normalHat = 12;
        }
    }
    if (!nearestEnemy) {
        nearestEnemyAngle = myPlayer.dir;
    }
    if(item == "h" && data[1] == myPlayer.id) {
        if(data[2] < 100 && data[2] > 0 && healToggle == 1) {
            setTimeout( () => {
                place(foodType, null);
            }, healSpeed);

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

function boostSpike() {
    if(boostDir == null) {
        boostDir = nearestEnemyAngle;
    }
    place(turretType, boostDir + toRad(90));
    place(spikeType, boostDir - toRad(90));
    place(millType, boostDir + toRad(180));
    place(boostType, boostDir - toRad(180));
    doNewSend(["33", [boostDir]]);
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

const healer = repeater(81, () => {place(foodType)}, 0);
const boostPlacer = repeater(86, () => {place(boostType)}, 0);
const spikePlacer = repeater(70, () => {place(spikeType)}, 0);
const millPlacer = repeater(78, () => {place(millType)}, 0);
const wallPlacer = repeater(0, () => {place(wallType)}, 0);
const turretPlacer = repeater(0, () => {place(turretType)}, 0);
const boostSpiker = repeater(71, boostSpike, 0);

document.addEventListener('keydown', (e)=>{
    spikePlacer.start(e.keyCode);
    healer.start(e.keyCode);
    boostPlacer.start(e.keyCode);
    boostSpiker.start(e.keyCode);
    millPlacer.start(e.keyCode);
    wallPlacer.start(e.keyCode);
    turretPlacer.start(e.keyCode);

    if (e.keyCode == 73 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        for (let i=0;i<5;i++){
             let angle = myPlayer.dir + toRad(i * 72);
             place(millType, angle)
        }
    }
    if (e.keyCode == 0 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        for (let i=0;i<4;i++){
             let angle = myPlayer.dir + toRad(i * 90);
             place(wallType, angle)
        }
    }
        if (e.keyCode == 0 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        for (let i=0;i<5;i++){
             let angle = myPlayer.dir + toRad(i * 90);
             place(turretType, angle)
        }
    }
    if (e.keyCode == 79 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        for (let i=0;i<4;i++){
             let angle = myPlayer.dir + toRad(i * 90);
             place(boostType, angle)
        }
    }
    if (e.keyCode == 76 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        for (let i=0;i<5;i++){
             let angle = myPlayer.dir + toRad(i * 60);
             place(spikeType, angle)
        }
    }
    if (e.keyCode == 1 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        place(turretType, myPlayer.dir + toRad(45));
        place(turretType, myPlayer.dir - toRad(45));
        place(turretType, myPlayer.dir - toRad(90));
        place(turretType, myPlayer.dir + toRad(90));
        place(turretType, myPlayer.dir + toRad(180));
        place(turretType, myPlayer.dir - toRad(180));
    }

    if (e.keyCode == 1 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        if (myPlayer.y < 2400){
            hat(15);
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
            hat(31);
        } else {
	        hat(12);
        }
        acc(11);
    }
    if (e.keyCode == 90 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        hat(40);
    }

        if (e.keyCode == 0 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        hat(53);
    }
        if (e.keyCode == 84 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        hat(6);
    }


    if(e.keyCode == 82 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        autoaim = true;
        doNewSend(["5", [primary, true]]);
        doNewSend(["13c", [0, 7, 0]]);
        doNewSend(["13c", [0, 0, 1]]);
        doNewSend(["13c", [0, 18, 1]]);
        doNewSend(["c", [1]]);
        setTimeout( () => {
            doNewSend(["13c", [0, 53, 0]]);
            doNewSend(["13c", [0, 0, 1]]);
            doNewSend(["13c", [0, 19, 1]]);
            doNewSend(["5", [secondary, true]]);
        }, instaSpeed - 150);

        setTimeout( () => {
            doNewSend(["5", [primary, true]]);
            doNewSend(["c", [0, null]]);
            doNewSend(["13c", [0, 6, 0]]);
            doNewSend(["13c", [0, 0, 1]]);
            doNewSend(["13c", [0, 21, 1]]);
            autoaim = false;
        }, instaSpeed);
    }

    if(e.keyCode == 32 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        autoaim = true;
        doNewSend(["5", [primary, true]]);
        doNewSend(["13c", [0, 7, 0]]);
        doNewSend(["13c", [0, 0, 1]]);
        doNewSend(["13c", [0, 18, 1]]);
        doNewSend(["c", [1]]);

        setTimeout( () => {
            doNewSend(["13c", [0, 6, 0]]);
            doNewSend(["13c", [0, 0, 1]]);
            doNewSend(["13c", [0, 21, 1]]);
        }, 100);

        setTimeout( () => {
            doNewSend(["c", [0, null]]);
            doNewSend(["13c", [0, 12, 0]]);
            doNewSend(["13c", [0, 0, 1]]);
            doNewSend(["13c", [0, 11, 1]]);
            autoaim = false;
        }, 200);
    }
  if(e.keyCode == 1 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        autoaim = true;
        doNewSend(["5", [primary, true]]);
        doNewSend(["13c", [0, 40, 0]]);
        doNewSend(["13c", [0, 0, 1]]);
        doNewSend(["13c", [0, 0, 1]]);
        place();
        doNewSend(["c", [1]]);

        setTimeout( () => {
            doNewSend(["13c", [0, 40, 0]]);
            doNewSend(["13c", [0, 0, 1]]);
            doNewSend(["13c", [0, 0, 1]]);
        }, 100);

        setTimeout( () => {
            doNewSend(["c", [0, null]]);
            doNewSend(["13c", [0, 12, 0]]);
            doNewSend(["13c", [0, 0, 1]]);
            doNewSend(["13c", [0, 11, 1]]);
            autoaim = false;
        }, 200);
    }


    if(e.keyCode == 0 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        messageToggle = (messageToggle + 1) % 2;
    }

    if(e.keyCode == 1 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        clanToggle = (clanToggle + 1) % 2;
    }

    if(e.keyCode == 1 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        healToggle = (healToggle + 1) % 2;
        if(healToggle == 0) {
            if(hatToggle == 0) {
                document.title = "HypaMod"
            } else {
                document.title = "HypaMod"
            }
        } else {
            if(hatToggle == 0) {
                document.title = "HypaMod"
            } else {
                document.title = "HypaMod"
            }
        }
    }

    if(e.keyCode == 188 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [4]]);
    }

    if(e.keyCode == 190 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [15]]);
    }
    if(e.keyCode == 1 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [28]]);
    }
    if(e.keyCode == 1 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [28]]);
        doNewSend(["6", [25]]);
    }
    if(e.keyCode == 1 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        hatToggle = (hatToggle + 1) % 2;
        if(healToggle == 0) {
            if(hatToggle == 0) {
                document.title = "MooMod"
            } else {
                document.title = "MooMod"
            }
        } else {
            if(hatToggle == 0) {
                document.title = "MooMod"
            } else {
                document.title = "MooMod"
            }
        }
    }
})

document.addEventListener('keyup', (e)=>{
    spikePlacer.stop(e.keyCode);
    boostPlacer.stop(e.keyCode);
    boostSpiker.stop(e.keyCode);
    millPlacer.stop(e.keyCode);
    wallPlacer.stop(e.KeyCode);
    turretPlacer.stop(e.keyCode);
    healer.stop(e.keyCode);
    if(e.keyCode == 71 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        setTimeout( () => {
            doNewSend(["33", [null]]);
            boostDir = null;
        }, 10);
    }
})


function isElementVisible(e) {
    return (e.offsetParent !== null);
}


function toRad(angle) {
    return angle * 0.01745329251;
}

function dist(a, b){
    return Math.sqrt( Math.pow((b.y-a[2]), 2) + Math.pow((b.x-a[1]), 2) );
}

function animate(space, chance) {
    let result = '';
    let characters;
    if(space) {
        characters = '     xo     ';
    } else {
        characters = '';
    }
    if(space) {
        characters = characters.padStart((30 - characters.length) / 2 + characters.length)
        characters = characters.padEnd(30);
    }
    let count = 0;
    for (let i = 0; i < characters.length; i++ ) {
       if(Math.floor(Math.random() * chance) == 0 && characters.charAt(i) != "" && count < 0 && characters.charAt(i) != "") {
           result += "";
           count++
       } else {
           result += characters.charAt(i);
       }
    }
    return result;
}

document.title = "HypaMod"

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



 // No Sell MooMod!


document.getElementById("gameName").innerHTML = "MooMod"
document.getElementById("gameName").style.color = "white";
document.getElementById("gameName").style.color2 = "red";
document.getElementById("setupCard").style.color = "red";

document.getElementById('enterGame').innerHTML = 'Join';
document.getElementById('loadingText').innerHTML = 'Loading...';
document.getElementById('nameInput').placeholder = "Name";
document.getElementById('nameInput').style.color = "black";
document.getElementById('chatBox').placeholder = "Message";
document.getElementById('diedText').innerHTML = 'You Died';
document.getElementById("followText").innerHTML = ""
document.getElementById("followText").style = "bottom: -0px;"

document.getElementById("twitterFollow").remove();
document.getElementById('errorNotification').remove();
document.getElementById("pingDisplay").remove();
document.getElementById("chatButton").remove();
document.getElementById("storeHolder").style = "height: 350px; width: 400px;";
document.getElementById("allianceHolder").style = "height: 350px; width: 450px;";
document.getElementById("scoreDisplay").style.color = "#faee9d";
document.getElementById("woodDisplay").style.color = "#8af2a1";
document.getElementById("stoneDisplay").style.color = "#a6a6a6";
document.getElementById("foodDisplay").style.color = "#ff8787";
document.getElementById("guideCard").style = "height: 9000000px; width: 300px;";
document.getElementById('youtuberOf').remove();


$("#adCard").html('<div align="left"><div class="menuHeader">HypaMod</div><div id="desktopInstructions" class="menuText"><a class="menuText" title="MooMod Fealture">Insta Kill Key R , 3X Auto Heal!  New Hat switcher!<font style="font-size: 18px;" color="red"></font>:</a><a href="" target="_blank" style="font-size:18px;padding-left:46px;"></a><br><a title="" class="menuText">Spike Key V Trap/Boost Key F Wall Key "J" All Hotkeys Placer Key "M"<font style="font-size: 18px;" color="red"></font>:</a><a href="" target="_blank" style="font-size:18px;padding-left:28px;"></a><br><a title="" class="menuText">Spikecircl L , Trapcircl O , WallCircl P<font style="font-size: 18px;" color="red"></font>:</a><a href="" target="_blank" style="font-size:18px;padding-left:13px;"></a><br><a title="" class="menuText">Turret H Windmill N<font style="font-size: 18px;" color="red"></font>:</a><a href="" target="_blank" style="font-size:18px;padding-left:34px;"></a></br><a title="" class="menuText">Turretcircl U Windmillcircl I<font style="font-size: 18px;" color="red"></font>:</a><a href="" target="_blank" style="font-size:18px;padding-left:42px;"></a></br><a title="" class="menuText">Hat-Acc-Hacking Auto Chat Key "G"  Hat-Macro  Tank Gear Z , Turret Gear C , Bull Helmet K , Soldier Helmet B<font style="font-size: 18px;" color="red"></font>:</a><a href="" target="_blank" style="font-size:18px;padding-left:60px;"></a><br><a title="" class="menuText">Auto Attack Key Space  Katana Key "," Musket Key "."<font style="font-size: 18px;" color="red"></font>:</a><a href="" target="_blank" style="font-size:18px;padding-left:14px;"></a><br><a href="" target="_blank" style="font-size:18px;padding-left:21px;"></a><br><br><br> <a title="If you buy the bull helmet, any time you swing this mod will put the bull helmet on and take it off automatically. If you put on another hat, the mod will automatically remember that hat and put it on after its done with the bull helmet. The mod will also take of the monkey tail (if its on) when you swing. ---> Imagine the combinations! Soldier +bull and plague +bull are good combos to get started with" style="font-size: 18px;color:dodgerblue;">MooMod Seating</a><br></div><hr><button class="trigger">Modifie</button><div class="modal"><div class="modal-content"><span class="close-button">&times;</span><div align="left"><a title="Its the speed of auto healing, default is 150 | Doing lower is faster, but moomoo.io game has pinocchio mode for fast healing that canceling healing..">Auto Heal Speed </a><input onchange="handleMessage();" id="autospeed" type="number" value="150" style="width:60px;"></br><a title="Its the speed of animals mod, default is 200">Insta Kill Speed </a><input onchange="anspeedupdate();" id="aspeed" type="number" value="200" style="width:60px;"></br><a title="Its the speed of free hats mod, default is 200">HotKey Speed </a><input onchange="plspeedupdate();" id="pspeed" type="number" value="200" style="width:60px;"></br><a title="Its the speed of animal caps mod, default is 200">Hat-Acc-Hacking Speed</a><input onchange="clspeedupdate();" id="caspeed" type="number" value="200" style="width:60px;"></br><a title="Its the speed of police mod, default is 250">Auto Attack Speed </a><input onchange="frspeedupdate();" id="fspeed" type="number" value="250" style="width:60px;"></div></div></div> - <button class="trigger2">Modifie 2!</button><div class="modal2"><div class="modal-content"><span class="close-button2">&times;</span>Hat-Macro Speed = <input onchange="nm0(this.value)" type="numpad" value="0" id="nm00" style="width:60px;"></br>Circle Speed = <input onchange="nm1(this.value)" type="number" value="7" id="nm11" style="width:60px;"></br>Numpad2 = <input onchange="nm2(this.value)" type="number" value="6" id="nm22" style="width:60px;"></br>Numpad3 = <input onchange="nm3(this.value)" type="number" value="20" id="nm33" style="width:60px;"></br>Numpad4 = <input onchange="nm4(this.value)" id="nm44" type="number" value="31" style="width:60px;"></br>Numpad5 = <input onchange="nm5(this.value)" id="nm55" type="number" value="10" style="width:60px;"></br>Numpad6 = <input onchange="nm6(this.value)" id="nm66" type="number" value="11" style="width:60px;"></br>Numpad7 = <input onchange="nm7(this.value)" type="number" id="nm77" value="22" style="width:60px;"></br>Numpad8 = <input onchange="nm8(this.value)" id="nm88" type="number" value="12" style="width:60px;"></br>Numpad9 = <input onchange="nm9(this.value)" type="number" id="nm99" value="9" style="width:60px;"></br><div id="storeHolder" style="width:270px;" >     <div style="font-size:20px;" class="storeItem" id="storeDisplay0"> <img class="hatPreview" src="https://i.hizliresim.com/5y9PBD.png"><span>Default : 0</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay1"> <img class="hatPreview" src="../img/hats/hat_51.png"><span>Moo Cap : 51</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay2"> <img class="hatPreview" src="../img/hats/hat_50.png"><span>Apple Cap : 50</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay3"> <img class="hatPreview" src="../img/hats/hat_28.png"><span>Moo Head : 28</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay4"> <img class="hatPreview" src="../img/hats/hat_29.png"><span>Pig Head : 29</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay5"> <img class="hatPreview" src="../img/hats/hat_30.png"><span>Fluff Head : 30</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay6"> <img class="hatPreview" src="../img/hats/hat_36.png"><span>Pandou Head : 36</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay7"> <img class="hatPreview" src="../img/hats/hat_37.png"><span>Bear Head : 37</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay8"> <img class="hatPreview" src="../img/hats/hat_38.png"><span>Monkey Head : 38</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay9"> <img class="hatPreview" src="../img/hats/hat_44.png"><span>Polar Head : 44</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay10"> <img class="hatPreview" src="../img/hats/hat_35.png"><span>Fez Hat : 35</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay11"> <img class="hatPreview" src="../img/hats/hat_42.png"><span>Enigma Hat : 42</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay12"> <img class="hatPreview" src="../img/hats/hat_43.png"><span>Blitz Hat : 43</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay13"> <img class="hatPreview" src="../img/hats/hat_49.png"><span>Bob XIII Hat : 49</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay14"> <img class="hatPreview" src="../img/hats/hat_8.png"><span>Bummle Hat : 8</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay15"> <img class="hatPreview" src="../img/hats/hat_2.png"><span>Straw Hat : 2</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay16"> <img class="hatPreview" src="../img/hats/hat_15.png"><span>Winter Cap : 15</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay17"> <img class="hatPreview" src="../img/hats/hat_5.png"><span>Cowboy Hat : 5</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay18"> <img class="hatPreview" src="../img/hats/hat_4.png"><span>Ranger Hat : 4</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay19"> <img class="hatPreview" src="../img/hats/hat_18.png"><span>Explorer Hat : 18</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay20"> <img class="hatPreview" src="../img/hats/hat_31.png"><span>Flipper Hat : 31</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay21"> <img class="hatPreview" src="../img/hats/hat_1.png"><span>Marksman Cap : 1</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay22"> <img class="hatPreview" src="../img/hats/hat_10.png"><span>Bush Gear : 10</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay23"> <img class="hatPreview" src="../img/hats/hat_48.png"><span>Halo : 48</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay24"> <img class="hatPreview" src="../img/hats/hat_6.png"><span>Soldier Helmet : 6</span> </div><div style="font-size:18px;" class="storeItem" id="storeDisplay25"> <img class="hatPreview" src="../img/hats/hat_23.png"><span>Anti Venom Gear : 23</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay26"> <img class="hatPreview" src="../img/hats/hat_13.png"><span>Medic Gear : 13</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay27"> <img class="hatPreview" src="../img/hats/hat_9.png"><span>Miners Helmet : 9</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay28"> <img class="hatPreview" src="../img/hats/hat_32.png"><span>Musketeer Hat : 32</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay29"> <img class="hatPreview" src="../img/hats/hat_7.png"><span>Bull Helmet : 7</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay30"> <img class="hatPreview" src="../img/hats/hat_22.png"><span>Emp Helmet : 22</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay31"> <img class="hatPreview" src="../img/hats/hat_12.png"><span>Booster Hat : 12</span> </div><div style="font-size:19px;" class="storeItem" id="storeDisplay32"> <img class="hatPreview" src="../img/hats/hat_26.png"><span>Barbarian Armor : 26</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay33"> <img class="hatPreview" src="../img/hats/hat_21.png"><span>Plague Mask : 21</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay34"> <img class="hatPreview" src="../img/hats/hat_46.png"><span>Bull Mask : 46</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay35"> <img class="hatPreview" src="../img/hats/hat_14_p.png"><span>Windmill Hat : 14</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay36"> <img class="hatPreview" src="../img/hats/hat_11_p.png"><span>Spike Gear : 11</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay37"> <img class="hatPreview" src="../img/hats/hat_53_p.png"><span>Turret Gear : 53</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay38"> <img class="hatPreview" src="../img/hats/hat_20.png"><span>Samurai Armor : 20</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay39"> <img class="hatPreview" src="../img/hats/hat_16.png"><span>Bushido Armor : 16</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay40"> <img class="hatPreview" src="../img/hats/hat_27.png"><span>Scavenger Gear : 27</span> </div><div style="font-size:20px;" class="storeItem" id="storeDisplay41"> <img class="hatPreview" src="../img/hats/hat_40.png"><span>Tank Gear : 40</span> </div></div></div></div><hr><div id="durum">Only Auto Heal <font color="green">ON</font></div><div id="durump">Only Insta Kill</div><div id="duruma">Only Auto Attack ON</div><div id="durumc"></div><div id="durumf">Only Hat-Acc-Hacking</div><div id="durumm">Only Pro Map <font color="green">ON</font></div><div id="durumo">Only Hat-Macro<font color="green">ON</font></div></div><hr><div align="left"> <center>   <div align="left"><center><b><a class="menuText" href="" target="_blank">MooMod Seating 2!</a></b></center><table style="border-collapse: collapse;" border="1"><tbody><tr><td style="width: 100px;"><b>Features</b></td><td style="width: 250px;"><b>About</b></td></tr><tr><td>New Auto Heal!(4X)</td><td>BEXTIYAR Will Add New(4X) Auto Heal</td></tr><tr><td>Insta Kill</td><td> BEXTIYAR Will Add New Insta!</td></tr><tr><td>Auto Attack</td><td>Auto Attack Used Bull Helmet And Blood Wings</td></tr><tr><td>Hat-Acc-Hacking</td><td>Hat-Acc-Hacking Somtimes Working.Sorry!</td></tr><tr><td>New Map</td><td>BEXTIYAR Will Uptade Map</br></td></tr><tr><td>New Hotkey</td><td>BEXTIYAR Will Uptade Hotkey(Wall,SpawnPad)</td></tr><tr><td>Aim Bot</td><td>BEXTIYAR Will Add Aim Bot!</td></tr><tr><td>Music</td><td>Music Add???</td></tr><tr><td>Katana Musket<a style="font-size:11px; color:green;"></a></td><td>BEXTIYAR Will Add Katana MUsket!</td></tr><tr><td>Heal<a style="font-size:9.5px; color:red;"></a></td><td>Apple/Cook/Pizza</td></tr></tbody></table><hr><b>Subscribe To BEXTIYAR</b><br><a href="https://www.youtube.com/channel/UChujyWNvKA2u_TkpAvvWxqA?view_as=subscriber" target="_blank">Channel Here</a>');



$('.menuCard').css({'white-space': 'normal',
                    'text-align': 'center',
                    'background-color': 'rgba(0, 0, 0, 0.74)',
                    '-moz-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    '-webkit-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    'box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    '-webkit-border-radius': '0px',
                    '-moz-border-radius': '0px',
                    'border-radius': '0px',
                    'margin': '15px',
                    'margin-top': '15px'});


$('#menuContainer').css({'black-space': 'normal'});

$('#guideCard').css({'color': ''});

$('#nativeResolution').css({'cursor': 'pointer'});

$('#serverSelect').css({'margin-bottom': '30.75px'});
$('#nameInput').css({'margin-butom': '#f7f36f'})


$('.menuLink').css({'color': '#00FFFF'});

$('.menuButton').css({'background-color': '#f7f36f'});



$('#serverSelect').css({'cursor': 'pointer',
                        'color': 'red',
                        'background-color': 'white',
                        'border': 'hidden',
                        'font-size': '20px'});

$('.menuButton').css({'border-radius': '0px',
                      '-moz-border-radius': '0px',})


$('#adCard').css({
	'max-height': '430px',
	'width': '320px',
	'overflow-y': 'scroll',
	'-webkit-overflow-scrolling': 'touch'
});

document.getElementById("linksContainer2").innerHTML = "Designed by Empel, made for LeGeNDaRy";