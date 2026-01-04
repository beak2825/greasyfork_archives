// ==UserScript==
// @name         White Mod (MD EXLUSIVE)
// @namespace    none
// @version      EXCLUSIVE
// @description  hack mod
// @author       guyq
// @license      MIT
// @icon
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @require      https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543389/White%20Mod%20%28MD%20EXLUSIVE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543389/White%20Mod%20%28MD%20EXLUSIVE%29.meta.js
// ==/UserScript==
let whereverifybutton = document.querySelector("#altcha_checkbox")
function clicktheverify() {
    if (whereverifybutton) {
        whereverifybutton.click()
    }
}

setInterval(clicktheverify, 10);

const PACKET_MAP = {
    // wont have all old packets, since they conflict with some of the new ones, add them yourself if you want to unpatch mods that are that old.
    "33": "9",
    // "7": "K",
    "ch": "6",
    "pp": "0",
    "13c": "c",

    // most recent packet changes
    "f": "9",
    "a": "9",
    "d": "F",
    "G": "z"
}

let originalSend = WebSocket.prototype.send;

WebSocket.prototype.send = new Proxy(originalSend, {
    apply: ((target, websocket, argsList) => {
        let decoded = msgpack.decode(new Uint8Array(argsList[0]));

        if (PACKET_MAP.hasOwnProperty(decoded[0])) {
            decoded[0] = PACKET_MAP[decoded[0]];
        }

        return target.apply(websocket, [msgpack.encode(decoded)]);
    })
});
setInterval(() => window.follmoo && follmoo(), 10);

if(location.hostname == "sandbox.moomoo.io") {
    document.getElementById("foodDisplay").style.display = "none";
    document.getElementById("woodDisplay").style.display = "none";
    document.getElementById("stoneDisplay").style.display = "none";
}

document.getElementById("enterGame").addEventListener("click", autohide);
function autohide() {
    $("#ot-sdk-btn-floating").hide();
}
document.getElementById("linksContainer2").innerHTML = " ";
let changes = `<div id="subConfirmationElement"><a href="https://discord.gg/BVx8EWfBny">Join Discord!</a></div>`;
$('#linksContainer2').prepend(changes);
$('#subConfirmationElement').click( () => {
    try { window.follmoo(); } catch(e){};
    localStorage["moofoll"] = "1"; localStorage["moofol"] = "1";
});
document.querySelector("#joinPartyButton").remove();
document.querySelector("#pre-content-container").remove(); //ANTI AD
document.getElementById("gameName").innerHTML = "By DarrkYT";
setTimeout( () => {
    document.getElementById("gameName").innerHTML = "⚪ ~White Mod~ ⚪";
}, 1000);
setTimeout( () => {
    document.getElementById("gameName").innerHTML = "___________________";
}, 300);
setTimeout( () => {
    document.getElementById("gameName").innerHTML = "By DarrkYT";
}, 100);
setTimeout( () => {
    document.getElementById("gameName").innerHTML = "⚪ ~White Mod~ ⚪";
}, 300);
document.getElementById("gameName").innerHTML = "___________________";
document.getElementById('gameName').style.font = '20px';
let changes2 = `<div id="customMenuName"><h3 style="font-size: 50px;" class = "indent">By omen</a></div>`;
$('#gameName').prepend(changes2);
document.getElementById("loadingText").innerHTML = `<div id="LOADING" class="loader">`
document.getElementById("diedText").innerHTML = "You Lost?";
setTimeout(() => {
    document.getElementById("diedText").innerHTML = "Go Win!";
}, 100);
document.getElementById("diedText").innerHTML = "You Lost?";
setTimeout(() => {
    document.getElementById("diedText").innerHTML = "Go Win!";
}, 100);
document.getElementById("diedText").innerHTML = "You Lost?";
setTimeout(() => {
    document.getElementById("diedText").innerHTML = "Go Win!";
}, 100);
document.getElementById("diedText").innerHTML = "You Lost?";
setTimeout(() => {
    document.getElementById("diedText").innerHTML = "Go Win!";
}, 100);
document.getElementById("diedText").style.color = "#ffffff";
document.title = "Works!";
document.getElementById("leaderboard").append("By GUYQ");
document.getElementById("storeHolder").style = "height: 1150px; width: 400px;";
document.getElementById('promoImgHolder').innerHTML =
    `
  `
$("#itemInfoHolder").css({ top: "0px", left: "15px" });
$("#youtuberOf").remove();
$("#adCard").remove();
$("#mobileInstructions").remove();
$("#downloadButtonContainer").remove();
$("#mobileDownloadButtonContainer").remove();
$(".downloadBadge").remove();

const shadowStyle = "box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.4)";

const setupCardDiv = document.getElementById("setupCard");
if (setupCardDiv) {
    setupCardDiv.style.cssText += shadowStyle;
}

const serverBrowserSelect = document.getElementById("serverBrowser");
if (serverBrowserSelect) {
    serverBrowserSelect.style.color = "#333";
    serverBrowserSelect.style.backgroundColor = "#e5e3e4";
}

const enterGameButton = document.getElementById("enterGame");
if (enterGameButton) {
    enterGameButton.style.backgroundColor = "#333";
}

const style = document.createElement("style");
style.innerHTML = `
            .menuLink {
                font-size: 20px;
                color: #333;
            }
            a {
                color: #333;
                text-decoration: none;
            }
        `;
document.head.appendChild(style);

const nameInputElement = document.getElementById("nameInput");
if (nameInputElement) {
    nameInputElement.style.color = "#333";
}

const guideCardDiv = document.getElementById("guideCard");
if (guideCardDiv) {
    guideCardDiv.style.cssText += shadowStyle;
    setupCardDiv.style.backgroundColor = "#181818";
    guideCardDiv.style.backgroundColor = "#181818";
}

let anti = true;
let hitBack = false;
let stackInsta = false;
let lastDamageTick = 0;
let HP = 100;
let gameTick = 0;
var shame = 0;
let shameTime,
    damageTimes = 0;
let mouseX;
let mouseY;

let width;
let height;
//autoaim1
setInterval(() => {
    if (autoaim == true) {
        doNewSend(["D", [nearestEnemyAngle]]);
    }
}, 10);

setInterval(() => {
    if (hatToggle == 1) {
        if (oldHat != normalHat) {
            hat(normalHat);
            console.log("Tried. - Hat")
        }
        if (oldAcc != normalAcc) {
            acc(normalAcc);
            console.log("Tried. - Acc")
        }
        oldHat = normalHat;
        oldAcc = normalAcc
    }
}, 25);

setInterval(function () {
    if (myPlayer.hat == 45) {
        doNewSend(["6", ["plez no kil :c"]]);
    }
}, 1980);// messages send ever 2000ms but this is incase of packet mashes

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

var packet
var nearestEnemy;
var nearestEnemyAngle;
var oppositeEnemyAngle;
var enemyRan;
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
    isSkull: null,
};

let healSpeed = 100;
var messageToggle = 0;
var clanToggle = 0;
let healToggle = 1;
let hatToggle = 1;
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

function biomeHat() {
    if (myPlayer.y < 2400) {
        hat(20);
    } else {
        if (myPlayer.y > 6850 && myPlayer.y < 7550) {
            hat(20);
        } else {
            hat(20);
        }
    }
}
var animateyorn = false;

setInterval(() => {
    if(messageToggle == 1) {
        doNewSend(["6", [animate(true, 5)]])
    }
}, 200);

function animate(space, chance) {
    let result = '';
    let characters;
    if(space) {
        characters = '|White~Mod~Pro|';
    } else {
        characters = 'Zpace';
    }
    if(space) {
        characters = characters.padStart((30 - characters.length) / 2 + characters.length)
        characters = characters.padEnd(30);
    }
    let count = 0;
    for (let i = 0; i < characters.length; i++ ) {
        if(Math.floor(Math.random() * chance) == 1 && characters.charAt(i) != "-" && count < 2 && characters.charAt(i) != " ") {
            result += "_";
            count++
        } else {
            result += characters.charAt(i);
        }
    }
    return result;
}
document.addEventListener('keydown', (e)=>{
    if(e.keyCode == 38 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        messageToggle = (messageToggle + 1) % 2;
    }
})
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

    if (item == "C" && myPlayer.id == null) {
        myPlayer.id = data[1];
    }

    if (item == "a") {
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
    /*if(item == "P"){
      setTimeout(() => {
          doNewSend(["M", [{name: "vn-" + "",moofoll: 1,skin: "#cc5151"}]]);
      }, 200);
      }*/

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
    if (enemiesNear) {
        nearestEnemy = enemiesNear.sort((a, b) => dist(a, myPlayer) - dist(b, myPlayer))[0];
    }

    if (nearestEnemy) {
        nearestEnemyAngle = Math.atan2(nearestEnemy[2] - myPlayer.y, nearestEnemy[1] - myPlayer.x);
        oppositeEnemyAngle = Math.atan2(nearestEnemy[2] + myPlayer.y, nearestEnemy[1] + myPlayer.x);
        enemyRan = Math.sqrt(Math.pow((myPlayer.y - nearestEnemy[2]), 2) + Math.pow((myPlayer.x - nearestEnemy[1]), 2));
        if (Math.sqrt(Math.pow((myPlayer.y - nearestEnemy[2]), 2) + Math.pow((myPlayer.x - nearestEnemy[1]), 2)) < 285) {
            isEnemyNear = true;
            if (autoaim == false && myPlayer.hat != 7 && myPlayer.hat != 53) {
                normalHat = 6;
                if (primary != 8) {
                    normalAcc = 21
                }
            };
        }
    }
    if (isEnemyNear == false && autoaim == false) {
        if (myPlayer.y < 2400) {
            normalHat = 15;
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550) {
            normalHat = 31;
        } else {
            normalHat = 12;

        }
    }
    if(isEnemyNear == true && nearestEnemy[5] == 4 && nearestEnemy[9] == 7 && hitBack == true && myPlayer.hat != 7 && myPlayer.hat != 53 && myPlayer.hat != 22 && myPlayer.hat != 11){
        doNewSend(["c", [0, 11, 0]]);
        setTimeout(()=>{
            doNewSend(["c", [0, 21, 1]]);
        },60);
    }
    if (!nearestEnemy) {
        nearestEnemyAngle = myPlayer.dir;
    }

    if (item == "X") {
        //this is Sync detector(beta)
        if (data[5] == 3.6) {
            let dir_1 = (dir) => Math.atan2(Math.sin(dir), Math.cos(dir));
            let a1 = dir_1(
                (Math.atan2(data[2] - myPlayer.y, data[1] - myPlayer.x) +
                 Math.PI +
                 Math.PI) %
                (Math.PI * 2)
            );
            let a2 = dir_1((dir_1(data[3]) + Math.PI) % (Math.PI * 2));
            let a3 = a1 - a2;
            if (0.36 > a3 && -0.36 < a3) {
                //doNewSend(["6", ["Sync Detect Test"]]);
                doNewSend(["D",[Math.atan2(data[2] - myPlayer.y, data[1] - myPlayer.x)],]);
                if (data[2] < 80 && data[2] > 0) {
                    doNewSend(["c", [0, 6, 0]]);
                    place(foodType);
                    place(foodType);
                }
            }
        }
    }
    if (myPlayer.hat == 45 && shame) shameTime = 30000;
    if (myPlayer.hat == 45 && shame) shame = 30000;
    if (data[0] == "a") {
        gameTick++;
    }
    if (item == "O" && data[1] == myPlayer.id) {
        gameTick = 0;
        lastDamageTick = 0;
        shame = 0;
        HP = 100;
        shameTime = 0;
        if (item == "O" && data[1] == myPlayer.id) {
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
        if (data[2] < 100 && data[2] > 0 && healToggle == true) {
            //normal heal
            console.log("normal healing");
            setTimeout(() => {
                place(foodType);
                place(foodType);
                doNewSend(["c", [0, 6, 0]]);
                // doNewSend(["6", ["Heal"]]);
            }, 115);
        }
        if (data[2] < 48 && data[2] > 0 && anti == true && (nearestEnemy[5] == 5 || nearestEnemy[5] == 3)) {
            healToggle = false;
            //antiinsta no sold for pol
            console.log("no soldier anti - polearm");
            doNewSend(["c", [0, 22, 0]]);
            //doNewSend(["6", ["Anti"]]);
            place(foodType);
            setTimeout(() => {
                place(foodType);
                doNewSend(["c", [0, 6, 0]]);
                healToggle = true;
            }, 200);
            setTimeout(() => {
                doNewSend(["c", [0, 7, 0]]);
            }, 700);
            setTimeout(() => {
                doNewSend(["c", [0, 6, 0]]);
            }, 1900);
        }
        if (data[2] < 62 && data[2] > 41 && anti == true && (nearestEnemy[5] == 5 || nearestEnemy[5] == 3)) {
            healToggle = false;
            //antiinsta for pol
            console.log("anti insta - polearm");
            doNewSend(["c", [0, 22, 0]]);
            //doNewSend(["6", ["Anti"]]);
            place(foodType);
            setTimeout(() => {
                place(foodType);
                doNewSend(["c", [0, 6, 0]]);
                healToggle = true;
            }, 200);
            setTimeout(() => {
                doNewSend(["c", [0, 7, 0]]);
            }, 700);
            setTimeout(() => {
                doNewSend(["c", [0, 6, 0]]);
            }, 1900);
        }
        if (data[2] < 56 && data[2] > 50) {
            healToggle = false;
            //bullspam heal
            console.log("anti bullspam");
            setTimeout(() => {
                place(foodType);
                place(foodType);
                doNewSend(["c", [0, 6, 0]]);
                //doNewSend(["6", ["BHeal1"]]);
                healToggle = true;
            }, 140);
        }
        if (data[2] < 41 && data[2] > 0 && hitBack == true && nearestEnemy[5] == 4) {
            console.log("hitbacking");
            healToggle = false;
            autoaim = true;
            setTimeout(() => {
                place(foodType);
                place(foodType);
            }, 133);
            place(spikeType, nearestEnemyAngle);
            doNewSend(["d", [1]]);
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["G", [primary, true]]);
            setTimeout(() => {
                doNewSend(["c", [0, 53, 0]]);
                doNewSend(["d", [0]]);
                healToggle = true;
            }, 150);
            setTimeout(() => {
                doNewSend(["c", [0, 11, 0]]);
                autoaim = false;
            }, 300);
        }
    }
    update();
}

function doNewSend(sender) {
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}

function acc(id) {
    doNewSend(["c", [0, 0, 1]]);
    doNewSend(["c", [0, id, 1]]);
}

function hat(id) {
    doNewSend(["c", [0, id, 0]]);
}

function placeO(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["G", [myPlayer.weapon, true]]);
    doNewSend(["G", [id, null]]);
    doNewSend(["d", [1, angle]]);
    doNewSend(["d", [0, angle]]);
    doNewSend(["G", [myPlayer.weapon, true]]);
}

function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["G", [id, null]]);
    doNewSend(["d", [1, angle]]);
    doNewSend(["d", [0, angle]]);
    doNewSend(["G", [myPlayer.weapon, true]]);
}

var repeater = function(key, action, interval, bu) {
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
                            console.log("claered");
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
let friendlyMillLocs = [];
let nearestFriendlyMill;
let nearestFriendlyMillX;
let nearestFriendlyMillY;
let nearestFriendlyMillScale;
let isNextToFriendlyMill = false;
let automilling = false
let automill = false
function toRad(deg) {
    return deg * (Math.PI / 180);
}

function placeBehind(id, angleOffsetDeg) {
    const angle = myPlayer.dir + Math.PI + toRad(angleOffsetDeg);
    doNewSend(["G", [id, null]]);
    doNewSend(["d", [1, angle]]);
}

setInterval(() => {
    if (automill && !isNextToFriendlyMill && millCount < 298 && !automilling) {
        doNewSend(["6", ["Frozen mills"]]);
        automilling = true;
        placeBehind(millType, 90);
        placeBehind(millType, -90);
        placeBehind(millType, -180);
        doNewSend(["G", [myPlayer.weapon, true]]);

        automilling = false;
    }
}, 40);




let loopInterval = null;

let hatLoop = () => {
    hat(51);
    setTimeout(() => { hat(50); }, 400);
    setTimeout(() => { hat(28); }, 600);
    setTimeout(() => { hat(29); }, 800);
    setTimeout(() => { hat(30); }, 1000);
    setTimeout(() => { hat(36); }, 1200);
    setTimeout(() => { hat(37); }, 1400);
    setTimeout(() => { hat(38); }, 1600);
    setTimeout(() => { hat(44); }, 1800);
    setTimeout(() => { hat(35); }, 2000);
    setTimeout(() => { hat(42); }, 2200);
    setTimeout(() => { hat(43); }, 2400);
    setTimeout(() => { hat(49); }, 2600);
};

document.addEventListener("keydown", function (e) {
    if (e.keyCode === 79 && document.activeElement.id.toLowerCase() !== "chatbox") {
        if (loopInterval === null) {
            hatLoop();
            loopInterval = setInterval(hatLoop, 2800);
        } else {
            clearInterval(loopInterval);
            loopInterval = null;
        }
    }
});

const boostPlacer = repeater(70,() => {place(boostType);
                                      }, 50);
const spikePlacer = repeater(86,() => {place(spikeType);
                                      }, 50);
const placers = [boostPlacer, spikePlacer];
let prevCount = 0;
// killchat
const handleMutations = (mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.target.id === "killCounter") {
            const count = parseInt(mutation.target.innerText, 10) || 0;
            if (count > prevCount) {
                doNewSend(["6", ["!~ WhiTE MoD ~!"]]);
                prevCount = count;
            }
        }
    }
};


const observer = new MutationObserver(handleMutations);
observer.observe(document, {
    subtree: true,
    childList: true,
});

document.addEventListener('keydown', (e) => {
    if (["allianceinput", "chatbox", "nameinput", "storeHolder"].includes(document.activeElement.id.toLowerCase()))
        return null;
    placers.forEach((t) => {
        t.start(e.keyCode);
    });

    document.addEventListener("keydown", function(e) {
        if (e.code == "KeyZ" && document.activeElement.id.toLowerCase() !== "chatbox") {
            automill = !automill;
        }
    });

    if (e.code === "KeyH" && document.activeElement.id.toLowerCase() !== "chatbox") {
        const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
        for (let angle of angles) {
            place(turretType, myPlayer.dir + angle);
        }
    }

    /* if (e.keyCode == 16) {
    biomeHat();
  }*/
    if (e.keyCode == 32 && document.activeElement.id.toLowerCase() !== "chatbox") { // 32 is space
        // spiketick
        autoaim = true;
        place(spikeType, nearestEnemyAngle);
        doNewSend(["d", [1]]);
        doNewSend(["c", [0, 7, 0]]);
        doNewSend(["G", [primary, true]]);
        doNewSend(["d", [1]]);
        setTimeout(() => {
            doNewSend(["c", [0, 6, 0]]);
            doNewSend(["d", [0]]);
            autoaim = false;
        }, 400);
    }
    if (e.keyCode == 89 && document.activeElement.id.toLowerCase() !== "chatbox") {//diamond pol 1 tick one tick
        autoaim = true;
        // PACKET G = select weapon
        // PACKET C = equiping hat stuff
        doNewSend(["G", [primary, true]]);
        doNewSend(["c", [0, 53, 0]]);
        setTimeout(() => {
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["d", [1]]);
        }, 90);
        setTimeout(() => {
            acc(18)
            doNewSend(["G", [primary, true]]);
            doNewSend(["c", [0, 6, 0]]);
            doNewSend(["d", [0]]);
            autoaim = false;
        }, 500);
    }
    if(e.keyCode == 82 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", ["|~| You Are NOOB |~|"]]);
        var instaSpeed = 200;
        autoaim = true;
        doNewSend(["z", [primary, true]]);
        doNewSend(["c", [0, 7, 0]]);
        doNewSend(["c", [0, 0, 1]]);
        doNewSend(["c", [0, 19, 1]]);
        doNewSend(["F", [1]]);
        setTimeout( () => {
            doNewSend(["c", [0, 53, 0]]);
            doNewSend(["z", [secondary, true]]);
        }, instaSpeed - 130);

        setTimeout( () => {
            doNewSend(["z", [primary, true]]);
            doNewSend(["F", [0, null]]);
            doNewSend(["c", [0, 6, 0]]);
            autoaim = false;
        }, instaSpeed);
    }
    document.addEventListener('keydown', (e) => {
        const isChatBoxActive = document.activeElement.id.toLowerCase() === 'chatbox';
        if (isChatBoxActive) return;

        switch (e.keyCode) {
            case 82: // R
                setTimeout(() => {
                    doNewSend(["6", ["  -|- White Mod OP -|-  "]]);
                    autoprimary = false;
                }, 3500);

                setTimeout(() => {
                    doNewSend(["6", ["~|ReaLoaDeD|~"]]);
                    doNewSend(["z", [primary, true]]);
                    autosecondary = false;
                    autoprimary = true;
                }, 2700);

                setTimeout(() => {
                    doNewSend(["z", [secondary, true]]);
                    autosecondary = true;
                }, 300);
                break;
        }
    });

    if (e.keyCode == 71 &&document.activeElement.id.toLowerCase() !== "chatbox") {
        console.log("boost tick");
        autoaim = true;
        setTimeout(()=>{
            doNewSend(["d", [1]]);
            doNewSend(["G", [secondary, true]]);
        },99);
        setTimeout(()=>{
            doNewSend(["c", [0, 53, 0]]);
            place(boostType);
        },50);
        setTimeout(() => {
            doNewSend(["G", [primary, true]]);
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["d", [1]]);
            doNewSend(["d", [0]]);
        }, 175);
        setTimeout(() => {
            doNewSend(["G", [primary, true]]);
            doNewSend(["c", [0, 6, 0]]);
            doNewSend(["d", [0]]);
            autoaim = false;
        }, 500);
    }
    if (e.keyCode == 84 && document.activeElement.id.toLowerCase() !== "chatbox") {
        if(stackInsta == false){
            // insta
            hat(20);
            autoaim = true;
            console.log("Works.");
            doNewSend(["d", [1]]);
            doNewSend(["G", [secondary, true]]);
            doNewSend(["c", [0, 53, 0]]);
            setTimeout(() => {
                var sck = "";
                doNewSend(["G", [primary, true]]);
                doNewSend(["c", [0, 7, 0]]);
                doNewSend(["d", [1]]);
                doNewSend(["d", [0]]);
                for(let i = 0; i < 850; i++){
                    let caas = new Uint8Array(550);
                    for(let i = 0; i <caas.length;i++){
                        caas[i] = Math.floor(Math.random()*270);
                        sck += caas[i]
                    }
                }
                ws.send(caas);
            }, 80);
            setTimeout(() => {
                doNewSend(["G", [primary, true]]);
                doNewSend(["c", [0, 20, 0]]);
                doNewSend(["d", [0]]);
                autoaim = false;
            }, 500);
        }
    }
    if (e.keyCode == 66 &&document.activeElement.id.toLowerCase() !== "chatbox") {//manual bulltick
        doNewSend(["c", [0, 7, 0]]);
        setTimeout(()=>{
            doNewSend(["c", [0, 13, 1]]);
        },60);
    }
})

document.addEventListener('keyup', (e) => {
    if (["allianceinput", "chatbox", "nameinput", "storeHolder"].includes(document.activeElement.id.toLowerCase()))
        return null;
    placers.forEach((t) => {
        t.stop(e.keyCode);
    })
})

document.addEventListener("mousedown", (event) => {
    if (event.button == 2 && secondary != 10) {
        doNewSend(["d", [1]]);
        doNewSend(["c", [0, 40, 0]]);
        doNewSend(["G", [primary, true]]);
        setTimeout(()=>{
            doNewSend(["d", [0]]);
            doNewSend(["c", [0, 20, 0]]);
        },400);
    } else if (event.button == 2) {
        doNewSend(["d", [1]]);
        doNewSend(["6", ["Tank..."]]);
        doNewSend(["c", [0, 40, 0]]);
        doNewSend(["G", [secondary, true]]);
        setTimeout(()=>{
            doNewSend(["d", [0]]);
            doNewSend(["c", [0, 20, 0]]);
        },400);
    }
});

document.addEventListener("mousedown", (event) => {
    if (event.button == 0) {
        doNewSend(["d", [1]]);
        doNewSend(["c", [0, 7, 0]]);
        doNewSend(["G", [primary, true]]);
        setTimeout(()=>{
            doNewSend(["d", [0]]);
            doNewSend(["c", [0, 20, 0]]);
        },100);
    }
});

function isElementVisible(e) {
    return (e.offsetParent !== null);
}
function dist(a, b) {
    return Math.sqrt(Math.pow((b.y - a[2]), 2) + Math.pow((b.x - a[1]), 2));
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

document.addEventListener("keydown", function (e) {
    if (e.keyCode == 27) {
        $('#infomenu').toggle();
        ext = !ext;
    };
});

// Menu
$("body").append(`
  <div id="infomenu">
    <hr>
    <div class="nameblock">EXCLUSIVE</div>
    <hr>
    <ul>
      <li>
        <label>
          <span class="text">AntiInsta</span>
          <input type="checkbox" id="anti" checked>
        </label>
      </li>
      <li>
        <label>
          <span class="text">HitBack</span>
          <input type="checkbox" id="hitBack">
        </label>
      </li>
    </ul>
  </div>

  <script>
    function InfoMenu() {
      document.getElementById("infomenu").style.display = "block";
    }
  </script>
`);


var antii = document.querySelector("#anti")
antii.addEventListener('change', function() {
    if (this.checked) {
        anti = true;
    } else {
        anti = false;
    }
});
var hitBackk = document.querySelector("#hitBack")
hitBackk.addEventListener('change', function() {
    if (this.checked) {
        hitBack = true;
    } else {
        hitBack = false;
    }
});
var stackInstaa = document.querySelector("#stackInsta")
stackInstaa.addEventListener('change', function() {
    if (this.checked) {
        stackInsta = true;
    } else {
        stackInsta = false;
    }
});