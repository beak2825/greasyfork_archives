
// ==UserScript==
// @name         MooMoo.io - Fun tool!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Goodies for you :D
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
// @downloadURL https://update.greasyfork.org/scripts/447769/MooMooio%20-%20Fun%20tool%21.user.js
// @updateURL https://update.greasyfork.org/scripts/447769/MooMooio%20-%20Fun%20tool%21.meta.js
// ==/UserScript==

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
function wep(id){
    doNewSend(["5", [id, true]]);
}
function hit() {
    doNewSend(["c", [1]]);
}
function stophit() {
    doNewSend(["c", [0, null]]);
}
function chat(sender) {
    doNewSend(["ch", [sender]]);
}
function equip(hat,acc) {
    doNewSend(["13c", [1, hat, 0]]);
    doNewSend(["13c", [1, acc, 1]]);
    doNewSend(["13c", [0, hat, 0]]);
    doNewSend(["13c", [0, acc, 1]]);
}

function aim(x, y){
    var cvs = document.getElementById("gameCanvas");
    cvs.dispatchEvent(new MouseEvent("mousemove", {
        clientX: x,
        clientY: y

    }));
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
    };
    if (d === 'io-init') {
        let e = document['getElementById']('gameCanvas');
        width = e['clientWidth'];
        height = e['clientHeight'];
        $(window)['resize'](function () {
            width = e['clientWidth'];
            height = e['clientHeight'];
        });
        e['addEventListener']('mousemove', f => {
            mouseX = f['clientX'];
            mouseY = f['clientY'];
        });
    }
    if (d == '1' && myPlayer['id'] == null) {
        myPlayer['id'] = c[0x1];
    }
    if (d == 'ch' && c[0x1] == ".a -heal") {
    
    ah = !ah
    chat("AutoHeal: " + ah);

    }
    if (d == 'h' && c[0x1] == myPlayer['id'] && ah) {
                if (c[0x2] < 0x80 && c[0x2] > 0x0 && !healing) {

            setTimeout(() => {
                sendws(foodType, null);

            }, 0x100);

        }





                if (c[0x2] < 0x70 && c[0x2] > 0x0  && !healing) {
            doHatCycle();
                    healing = true;
    setTimeout(()=>{
                sendws(foodType, null);
        healing = false;
    },80);
    sendws(foodType, null);


        }
               if (c[0x2] < 0x45 && c[0x2] > 0x0  && !healing) {
                   healing = true;
                 sendws(foodType, null);
                   healing = false;



                }
                if (c[0x2] < 0x32 && c[0x2] > 0x0  && !healing) {
                healing = true;
                sendws(foodType, null);
                            sendws(foodType, null);
 sendws(foodType, null);
                    healing = false;

        }
                if (c[0x2] < 0x16 && c[0x2] > 0x0  && !healing) {
healing = true;
                sendws(foodType, null);
                sendws(foodType, null);
                sendws(foodType, null);
                                    sendws(foodType, null);
                sendws(foodType, null);
                                    sendws(foodType, null);
                                    sendws(foodType, null);
                sendws(foodType, null);
                                    sendws(foodType, null);
                socketsender(["ch", ["!Trash insta detected!"]])
                    healing = false;

        }
        if (c[0x2] < 0x8 && c[0x2] > 0x0  && !healing) {
healing = true;
                sendws(foodType, null);
                sendws(foodType, null);
                sendws(foodType, null);
                sendws(foodType, null);
                sendws(foodType, null);
                sendws(foodType, null);
                sendws(foodType, null);
                sendws(foodType, null);
                            sendws(foodType, null);
                sendws(foodType, null);
                sendws(foodType, null);
                sendws(foodType, null);
                sendws(foodType, null);
                            sendws(foodType, null);
                sendws(foodType, null);
                sendws(foodType, null);
                sendws(foodType, null);
                sendws(foodType, null);
                            sendws(foodType, null);
                sendws(foodType, null);
                sendws(foodType, null);
                sendws(foodType, null);
                sendws(foodType, null);
                            sendws(foodType, null);
                sendws(foodType, null);
                sendws(foodType, null);
                sendws(foodType, null);
                sendws(foodType, null);
                socketsender(["ch", ["!Mega insta detected!"]])
            healing = false;

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
var el = top.document.createElement('div')
el.style = "width:40px; height:42px; border-radius:5px;background:white;opacity:40%;z-index:99999999999999; position:fixed;bottom:2%;right:15%;";
el.innerHTML="";
el.onclick = insta;
top.document.body.appendChild(el);
function insta() {
chat("LOADING STITCHES.");
    var iHat2 = 6,iAcc2 = 53,iHat1 = 7,iAcc1 = 21;
        dns(["13c", [0, 0, 1]])
    dns(["7", [!0]])
    dns(["5", [secondary, !0]])
     dns(["13c", [0, iHat2, 0]])
    dns(["13c", [0, iAcc2, 1]])
    setTimeout(function () {
     dns(["13c", [0, iHat1, 0]])
        dns(["13c", [0, iAcc1, 1]])
        var weapon = primary
            dns(["5", [primary, !0]])
                }, 60)
    dns(["5", [primary, !0]])
    dns(["13c", [0, iHat1, 0]])
    dns(["13c", [0, iAcc1, 1]])
    var weapon;
    setTimeout(function () {
    chat("RELOADING SECONDARY.");
    
    setTimeout(()=>{
    wep(secondary);
    setTimeout(()=>{
    wep(primary)
    },40);
    },50);
    
    
    setTimeout(()=>{
    dns(["13c", [0, iHat2, 0]])
    dns(["13c", [0, iAcc2, 1]])
    weapon = secondary
    dns(["5", [secondary, !0]])
        setTimeout(()=>{
        place(boostType,null);
        setTimeout(()=>{
        var angleuwu = Math.atan2(mouseY - height / 2, mouseX - width / 2);
        place(spikeType,angleuwu - ((100 * Math.PI) / 180));
        setTimeout(()=>{
        place(spikeType,angleuwu + ((100 * Math.PI) / 180));
        setTimeout(()=>{
        wep(secondary)
        setTimeout(()=>{
        wep(primary)
        hit()
        setTimeout(()=>{
        stophit();
        },30);
        },60);
       },30);
        },40);
        },60);
        
        chat("MAKING SPIKE INSTA.");
       },100);
    }, 470 / 2)
   },100);
}
var boostDir;
function place(p__14702) {
    var angle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Math.atan2(mouseY - height / 2, mouseX - width / 2);
    newSend(['5', [p__14702, null]]);
    newSend(['c', [1, angle]]);
    newSend(['c', [0, angle]]);
    newSend(['5', [myPlayer.weapon, true]]);
    newSend(['5', [p__14702, null]]);
    newSend(['c', [1, angle]]);
    newSend(['c', [0, angle]]);
    newSend(['5', [myPlayer.weapon, true]]);
    newSend(['5',[myPlayer.weapon,false]]);
    wep(primary)
}
function boostSpike() {
    if (boostDir == null) {
        boostDir = Math.atan2(mouseY - height / 2, mouseX - width / 2);
    }
    place(spikeType, boostDir + -0.785398/2);
    place(spikeType, boostDir - -0.785398/2);
    place(boostType, boostDir);
    newSend(['33', [boostDir]]);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
window.addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
    insta()
    return false;
}, false);
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










let freeHats = [51, 50, 28, 29, 30, 36, 37, 38, 44, 35, 42, 43, 49];




async function hatLoop() {

    for (var xware = 0; xware < freeHats.length; xware++) {
        storeEquip(freeHats[xware])
        await sleep(300)

    }
}
setInterval(()=>{

    //hatLoop()


},1000);


function Hat(id){
    storeBuy(id);
    storeEquip(id);
}

document.addEventListener('keydown',function(e){
    switch(e.keyCode){
        case 86:
            if (document.activeElement.id.toLowerCase() !== 'chatbox') {
                place(spikeType);
            }
            break;
        case 66:
            if (document.activeElement.id.toLowerCase() !== 'chatbox') {
                var angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)
                var deg90 = -0.785398/2
                var deg290 = 0.785398/2
                place(millType,angle);
                place(millType,angle-deg290);
                place(millType,angle+deg90);
            }
            break;
        case 71:
            if (document.activeElement.id.toLowerCase() !== 'chatbox') {
                place(spikeType,6.28319);
                place(spikeType,3.14159);
                place(spikeType,-3.14159);
            }
            break;
        case 70:
            if (document.activeElement.id.toLowerCase() !== 'chatbox') {
                place(boostType,0);
                place(boostType,6.28319);
                place(boostType,3.14159);
                place(boostType,-3.14159);
                place(boostType,1.5708);
                place(boostType,-1.5708);

            }
            break;

    }
});



document.getElementById("enterGame").addEventListener('click', autohide);
function autohide(){
$("#ot-sdk-btn-floating").hide();
}
document.getElementById("moomooio_728x90_home").style.display = "none";
$("#moomooio_728x90_home").parent().css({display: "none"});
document.getElementById("promoImgHolder").remove();
document.querySelector("#pre-content-container").remove(); //ANTI AD