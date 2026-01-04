// ==UserScript==
// @name         Moomoo.io Zombs Mod
// @namespace    https://greasyfork.org/en/scripts/435707-moomoo-io-zombs-mod
// @version      2.2.1
// @description  Zombs's Mod Updated! AUTO HEAL, QUAD SPIKE, MESSAGE HOTKEY, FAST PLACE AND MORE! (NEW DISCORD SERVER)
// @author       Zombs
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @grant        none
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js

// @downloadURL https://update.greasyfork.org/scripts/435707/Moomooio%20Zombs%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/435707/Moomooio%20Zombs%20Mod.meta.js
// ==/UserScript==

/* Style */

document.getElementById('gameName').innerHTML = '<span style="color:orange">Zombs Mod</span>';
document.getElementById("mapDisplay").style.background = "orange";
document.querySelector("#pre-content-container").remove();
document.getElementById("promoImgHolder").remove();
document.getElementById('youtuberOf').innerHTML = '<a href="https://discord.gg/Bm29xS4qHM" style="color:red">Join disord server</a>';
// document.getElementById('featuredYoutuber').remove();
document.querySelector('#linksContainer2').remove();
document.getElementById('partyButton').remove();
document.getElementById('joinPartyButton').remove();
document.getElementById('diedText').innerHTML = 'Time for revenge!';
$("#consentBlock").css({display: "none"});
$("#adCard").css({display: "none"});

/* End Style */
let customMsg = "Zombs Mod"; // Default (You can change it)
let autoMill = false;
let millInt;
let antiClowHeal = false;
 
document.getElementById("moomooio_728x90_home").style.display = "none";
$("#moomooio_728x90_home").parent().css({
    display: "none"
});
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
window.onbeforeunload = null;
 
let mouseX;
let mouseY;
let enemyX;
let enemyY;
let euse = true;
let width;
let height;
let killcount;
let autopit = false;
 
function normal() {
    hat(normalHat);
    acc(normalAcc);
}
 
function aim(x, y) {
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
var instaMessage;
var instaSpeed = 230;
var instaSpeedd = 5;
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
var woodLeft;
var stoneLeft;
var foodLeft;
var kills;
var gold;
var myStatus;
 
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
 
let healSpeed = 150000;
var healSpeedd = 100000000;
var messageToggle = 1;
var clanToggle = 0;
let healToggle = 1;
let hatToggle = 1;
let hitToggle = 0;
let hitTToggle = 0;
const players = {};
let currentID = null;
 
document.msgpack = msgpack;
 
function n() {
    this.buffer = new Uint8Array([0]);
    this.buffer.__proto__ = new Uint8Array;
    this.type = 0;
}
 
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m) {
    if (!ws) {
        document.ws = this;
        ws = this;
        socketFound(this);
    }
    this.oldSend(m);
};
 
function socketFound(socket) {
    socket.addEventListener('message', function(message) {
        handleMessage(message);
    });
}
 
function handleMessage(m) {
    let temp = msgpack5.decode(new Uint8Array(m.data));
    let data;
    if (temp.length > 1) {
        data = [temp[0], ...temp[1]];
        if (data[1] instanceof Array) {
            data = data;
        }
    } else {
        data = temp;
    }
    let item = data[0];
    if (!data) {
        return
    };
    if (item === "io-init") {
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
    if (item == "1" && myPlayer.id == null) {
        myPlayer.id = data[1];
    }
    if (item == "33") {
        enemiesNear = [];
        for (let i = 0; i < data[1].length / 13; i++) {
            let playerInfo = data[1].slice(13 * i, 13 * i + 13);
            if (playerInfo[0] == myPlayer.id) {
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
            } else if (playerInfo[7] != myPlayer.clan || playerInfo[7] === null) {
                enemiesNear.push(playerInfo);
                enemyX = playerInfo[1];
                enemyY = playerInfo[2];
            }
        }
    }
    isEnemyNear = false;
    if (enemiesNear) {
        nearestEnemy = enemiesNear.sort((a, b) => dist(a, myPlayer) - dist(b, myPlayer))[0];
    }
    if (nearestEnemy) {
        nearestEnemyAngle = Math.atan2(nearestEnemy[2] - myPlayer.y, nearestEnemy[1] - myPlayer.x);
        if (Math.sqrt(Math.pow((myPlayer.y - nearestEnemy[2]), 2) + Math.pow((myPlayer.x - nearestEnemy[1]), 2)) < 300) {
            isEnemyNear = true;
            if (autoaim == false && myPlayer.hat != 7 && myPlayer.hat != 53) {
                if (autopit == true) {
                    for (let i = 0; i < 4; i++) {
                        let angle = myPlayer.dir + toRad(i * 90);
                        place(boostType, angle)
                    };
                    autopit = false
                    setTimeout(function() {
                        autopit = true
                    }, 3000);
                }
                normalHat = 6;
                if (primary != 8) {
                    normalAcc = 19
                }
            };
        }
    }
    if (isEnemyNear == false && autoaim == false) {
        normalAcc = 11;
        if (myPlayer.y < 2400) {
            normalHat = 15;
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550) {
            normalHat = 31;
        } else {
            normalHat = 12;
        }
    }
    if (!nearestEnemy) {
        nearestEnemyAngle = myPlayer.dir;
    }
    if (item == "ch" && data[1] !== myPlayer.id && triggers.includes(data[2])) {
        var response = responses[triggers.indexOf(data[2])]
        doNewSend(["ch", [response]]);
    }
    if (item == "h" && data[1] == myPlayer.id) {
        if (data[2] < 100 && data[2] > 0 && healToggle == 1) {
            if (data[2] < 31) {
                setTimeout(function() {
                    place(foodType)
                    place(foodType)
                }, 30);
            }
            if (data[2] < 100) {
                setTimeout(function() {
                    place(foodType)
                }, 85);
            }
        }
    }
 
    if(item == "h" && data[1] == myPlayer.id) {
        if(data[2] <= 30 && antiClowHeal === true) {
            place(foodType);
            place(foodType);
            place(foodType);
            place(foodType);
        }
      }
    update();
}
 
var triggers = [];
var responses = [];
var gotoenemy = 1
 
if (gotoenemy % 2 == 0) {
    var nearestenemy = nearestEnemyAngle
}
 
function doNewSend(sender) {
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
 
var repeater = function(key, action, interval) {
    let _isKeyDown = false;
    let _intervalId = undefined;
    return {
        start(keycode) {
            if (keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
                _isKeyDown = true;
                if (_intervalId === undefined) {
                    _intervalId = setInterval(() => {
                        action();
                        if (!_isKeyDown) {
                            clearInterval(_intervalId);
                            _intervalId = undefined;
                            console.log("cleared");
                        }
                    }, interval);
                }
            }
        },
        stop(keycode) {
            if (keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
                _isKeyDown = false;
            }
        }
    };
}

const spike = repeater(86, () => {place(spikeType)}, 0);
const boostSpike = repeater(71, () => {
    if (boostDir == null) {
        boostDir = nearestEnemyAngle;
    }
    place(spikeType, boostDir + toRad(90));
    place(spikeType, boostDir - toRad(90));
    place(boostType, boostDir);
    doNewSend(["33", [boostDir]]);
}, 0);
 
document.addEventListener('keydown', (e) => {
    if (document.activeElement.id.toLocaleLowerCase() !== 'chatbox' && document.activeElement.id.toLocaleLowerCase() !== 'mainMenu') {
        spike.start(e.keyCode);
        boostSpike.start(e.keyCode);

        switch (e.key) {
            case 'm':
                doNewSend(["ch", [`Pos: ${myPlayer.x}, ${myPlayer.y}`]]);
            case 't':
                if (healToggle === true) {
                    healToggle = false;
                    doNewSend(["ch", ["~[AutoHeal {Off}]~"]]);
                } else {
                    healToggle = true;
 
                    doNewSend(["ch", ["~[AutoHeal {On}]~"]]);
                }
                break;
            case 'n':
                place(foodType);
                place(foodType);
                place(foodType);
                place(foodType);
                doNewSend(["ch", ["~[Quad healed]~"]]);
                break;
            case 'b':
                place(spikeType, toRad(0));
                place(spikeType, toRad(90));
                place(spikeType, toRad(180));
                place(spikeType, toRad(270));
                doNewSend(["ch", ["~[Spikes 360 no scope]~"]]);
                break;
            case 'Shift':
                storeEquip(0);
                break;
            case 'l':
                place()
                break;
            case 'p':
                doNewSend(["ch", [customMsg]]);
                break;
            case 'o':
                customMsg = prompt("Choose a new custom message");
                break;
            case 'i':
                place(millType, toRad(0));
                place(millType, toRad(90));
                place(millType, toRad(180));
                place(millType, toRad(270));
                doNewSend(["ch", ["~[Mills 360 no scope]~"]]);
                break;
            case 'u':
                place(boostType, toRad(0));
                place(boostType, toRad(90));
                place(boostType, toRad(180));
                place(boostType, toRad(270));
                break;
            case 'y':
                if (autoMill === true) {
                    autoMill = false;
                    doNewSend(["ch", ["~[AutoMill {Off}]~"]]);
                    clearInterval(millInt);
                } else {
                    autoMill = true;
 
                    doNewSend(["ch", ["~[AutoMill {On}]~"]]);
                    millInt = setInterval(() => { place(millType) }, 50);
                }
                break;
            case 'r':
                let oldHat = myPlayer.hat;
                let oldWeapon = myPlayer.weapon;
                acc(0); // Unequip monkey tail
                hat(7); // Bull helmet
                doNewSend(["5", [secondary, true]]);
                doNewSend(["c", [1]]);
 
                setTimeout(() => {
                    doNewSend(["5", [primary, true]]);
                    doNewSend(["c", [1]]);
                    doNewSend(["5", [oldWeapon, true]]);
                    hat(53); // Turret gear
                    setTimeout(() => {
                        hat(oldHat);
                    }, 500);
                }, 100);
                break;      
        }
    }
});
 
document.addEventListener('keyup', (e) => {
    spike.stop(e.keyCode);
    boostSpike.stop(e.keyCode);
});
 
function isElementVisible(e) {
    return (e.offsetParent !== null);
}
 
function toRad(angle) {
    return angle * 0.01745329251;
}
 
function dist(a, b) {
    return Math.sqrt(Math.pow((b.y - a[2]), 2) + Math.pow((b.x - a[1]), 2));
}
 
document.title = "Zombs Mod";
 
try {
    document.getElementById("moomooio_728x90_home").style.display = "none";
    $("moomooio728x90_home").parent().css({
        display: "none"
    });
} catch (e) {
    console.log("There was an error removing the ads.");
}
 
function update() {
    for (let i = 0; i < 9; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            primary = i;
        }
    }
    for (let i = 9; i < 16; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            secondary = i;
        }
    }
    for (let i = 16; i < 19; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            foodType = i - 16;
        }
    }
    for (let i = 19; i < 22; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            wallType = i - 16;
        }
    }
    for (let i = 22; i < 26; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            spikeType = i - 16;
        }
    }
    for (let i = 26; i < 29; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            millType = i - 16;
        }
    }
    for (let i = 29; i < 31; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            mineType = i - 16;
        }
    }
    for (let i = 31; i < 33; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            boostType = i - 16;
        }
    }
    for (let i = 33; i < 39; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString())) && i != 36) {
            turretType = i - 16;
        }
    }
    spawnpadType = 36;
}

window.dns = function(sender) {
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}
 
// Old code
 
/*
//OP Hat Macro v1.3
var DiscLink = `<span id="DIS"><span>Press F4 to join</span><br><span>discord Server</span><br><span>/(You will leave the game)/</span>`;
var int;
var isSpecToggled = false;
function BuyAll(){
int = 0;
var val = setInterval(function(){
int++;
Hat(int);
if(int === 100){
clearInterval(val);
}
}, 10);
 
}
document.getElementById("promoImg").remove();
document.querySelectorAll('#pre-content-container').forEach(function(a) {
            a.remove();
        });
function Hat(id){
    storeBuy(id);
    storeEquip(id);
}
window.addEventListener('keydown', function(e) {
switch(e.keyCode){
case 82:
Hat(6);
break;
case 84:
Hat(7);
break;
case 89:
Hat(40);
break;
case 85:
Hat(12);
break;
case 71:
Hat(53);
break;
case 16:
Hat(0);
break;
case 77:
BuyAll();
break;
case 119:
spec();
break;
case 115:
location.href='https://discord.gg/877QrZUXCM';
break;
 }
});
setInterval(() => window.follmoo && follmoo(), 10);
function spec() {
 if(isSpecToggled == false) {
  $("#gameUI").hide();
  $("#menuContainer").hide();
  isSpecToggled = !isSpecToggled;
 } else if(isSpecToggled == true){
    $("#gameUI").show();
    $("#menuContainer").show();
    isSpecToggled = !isSpecToggled;
 }
}
 
 
$("#topInfoHolder").append(DiscLink);
document.getElementById("enterGame").style.color = "#F0F8FF";
*/