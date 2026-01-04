// ==UserScript==
// @name         SaMmOd v0.7
// @namespace    -
// @version     0.7
// @description  a real mod with the best insta by :(sam-_-): and more cool feature ENJOY!!!
// @author       PANDAE86
// @match        *://moomoo.io/*
// @match        *://domoev.moo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://https://moomoo.io/bundle.js/*
// @match        *://https://sandbox.moomoo.io/bundle.js/*
// @icon data:image/png;base64,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
// @grant        none
// @require      https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @downloadURL https://update.greasyfork.org/scripts/500197/SaMmOd%20v07.user.js
// @updateURL https://update.greasyfork.org/scripts/500197/SaMmOd%20v07.meta.js
// ==/UserScript==



$('#menuContainer').append('THANK FOR PLAYING SaMmOd 0.7 WE WISH YOU A GOOD TRY TO THIS MOD # :(sam-_-):')
alert('▂▃▅▇█▓▒░♚click the ESC on your keyboard to open mod menu♚░▒▓█▇▅▃▂');

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
let changes = `<div id="subConfirmationElement"><a href="nextupdatein547daySORRY!">next update???</a></div>`;
$('#linksContainer2').prepend(changes);
$('#subConfirmationElement').click( () => {
    try { window.follmoo(); } catch(e){};
    localStorage["moofoll"] = "1"; localStorage["moofol"] = "1";
});
document.querySelector("#joinPartyButton").remove();
document.querySelector("#pre-content-container").remove(); //ANTI AD






// ==/UserScript==
setInterval(() => {
setTimeout( () => {
document.getElementById('chatBox').placeholder = "💬Message💬";
setTimeout( () => {
document.getElementById('chatBox').placeholder = "💬Message.💬";
setTimeout( () => {
document.getElementById('chatBox').placeholder = "💬Message..💬";
setTimeout( () => {
document.getElementById('chatBox').placeholder = "💬Message...💬";
}, 100);
}, 100);
}, 100);
}, 100);}
, 500);

setInterval(() => {
setTimeout( () => {
document.getElementById("woodDisplay").style.color = "";
setTimeout( () => {
document.getElementById("woodDisplay").style.color = "";
setTimeout( () => {
document.getElementById("woodDisplay").style.color = "";
setTimeout( () => {
document.getElementById("woodDisplay").style.color = "";
setTimeout( () => {
document.getElementById("woodDisplay").style.color = "";
setTimeout( () => {
document.getElementById("woodDisplay").style.color = "";
setTimeout( () => {
document.getElementById("woodDisplay").style.color = "";
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);}
 , 700);
setInterval(() => {
setTimeout( () => {
document.getElementById("scoreDisplay").style.color = "";
setTimeout( () => {
document.getElementById("scoreDisplay").style.color = "";
setTimeout( () => {
document.getElementById("scoreDisplay").style.color = "";
setTimeout( () => {
document.getElementById("scoreDisplay").style.color = "";
setTimeout( () => {
document.getElementById("scoreDisplay").style.color = "";
setTimeout( () => {
document.getElementById("scoreDisplay").style.color = "";
setTimeout( () => {
document.getElementById("scoreDisplay").style.color = "";
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);}
 , 700);
setInterval(() => {
setTimeout( () => {
document.getElementById("stoneDisplay").style.color = "";
setTimeout( () => {
document.getElementById("stoneDisplay").style.color = "";
setTimeout( () => {
document.getElementById("stoneDisplay").style.color = "";
setTimeout( () => {
document.getElementById("stoneDisplay").style.color = "";
setTimeout( () => {
document.getElementById("stoneDisplay").style.color = "";
setTimeout( () => {
document.getElementById("stoneDisplay").style.color = "";
setTimeout( () => {
document.getElementById("stoneDisplay").style.color = "";
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);}
 , 700);
setInterval(() => {
setTimeout( () => {
document.getElementById("foodDisplay").style.color = "";
setTimeout( () => {
document.getElementById("foodDisplay").style.color = "";
setTimeout( () => {
document.getElementById("foodDisplay").style.color = "";
setTimeout( () => {
document.getElementById("foodDisplay").style.color = "";
setTimeout( () => {
document.getElementById("foodDisplay").style.color = "";
setTimeout( () => {
document.getElementById("foodDisplay").style.color = "";
setTimeout( () => {
document.getElementById("foodDisplay").style.color = "";
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);}
 , 700);
setInterval(() => {
setTimeout( () => {
document.getElementById("killCounter").style.color = "";
setTimeout( () => {
document.getElementById("killCounter").style.color = "";
setTimeout( () => {
document.getElementById("killCounter").style.color = "";
setTimeout( () => {
document.getElementById("killCounter").style.color = "";
setTimeout( () => {
document.getElementById("killCounter").style.color = "";
setTimeout( () => {
document.getElementById("killCounter").style.color = "";
setTimeout( () => {
document.getElementById("killCounter").style.color = "";
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);}
 , 700);
document.getElementById("setupCard").style.color = "babyblue";
setInterval(() => {
setTimeout( () => {
document.getElementById("gameName").style.color = "red";
setTimeout( () => {
document.getElementById("gameName").style.color = "babyblue";
setTimeout( () => {
document.getElementById("gameName").style.color = "red";
setTimeout( () => {
document.getElementById("gameName").style.color = "babyblue";
setTimeout( () => {
document.getElementById("gameName").style.color = "red";
setTimeout( () => {
document.getElementById("gameName").style.color = "babyblue";
setTimeout( () => {
document.getElementById("gameName").style.color = "red";
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);}
 , 700);
document.getElementById("gameName").style.color = "red";
setInterval(() => {
setTimeout( () => {
document.getElementById("gameName").innerHTML = "Sammod 0.5"
setTimeout( () => {
document.getElementById("gameName").innerHTML = "s_mmod 0.5"
setTimeout( () => {
document.getElementById("gameName").innerHTML = "sa_mod 0.5"
setTimeout( () => {
document.getElementById("gameName").innerHTML = "sam_od 0.5"
setTimeout( () => {
document.getElementById("gameName").innerHTML = "samm_d 0.5"
setTimeout( () => {
document.getElementById("gameName").innerHTML = "sammo_ 0.5"
setTimeout( () => {
document.getElementById("gameName").innerHTML = "sammod _.5"
setTimeout( () => {
document.getElementById("gameName").innerHTML = "sammod 0._"
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);}
 , 800);
document.getElementById("gameName").innerHTML = "sammod 0.5"


let changes2 = `<div id="customMenuName"><h3 style="font-size: 50px;" class = "indent">New OP hack✔️</a></div>`;
$('#gameName').prepend(changes2);
$("#gameName").css({
    color: "#333",
    "text-blue": "#188bc2",
    "text-align": "center",
    "font-size": "156px",
    "margin-bottom": "-30px",
});
document.getElementById("loadingText").innerHTML = `<div id="" class="loader">`
//document.getElementById("loadingText").innerHTML = "VN Loading";
document.getElementById("diedText").innerHTML = "Skill is died✔️";
document.getElementById("diedText").style.color = "#03f03f";
setTimeout(() => {
document.getElementById("diedText").style.color = "#ff0000";
    setTimeout(() => {
document.getElementById("diedText").style.color = "#ffd300";
        setTimeout(() => {
document.getElementById("diedText").style.color = "#03f03f";
setTimeout(() => {

}, 100);
            }, 100);
        }, 100);
    }, 100);
document.title = " SaMm0dPro";
document.getElementById("leaderboard").append("☠️SaMm0d☠️");
$("#mapDisplay").css("background", "url('https://wormax.org/chrome3kafa/moomooio-background.png')");
document.getElementById("storeHolder").style = "height: 600px; width: 900px;";
document.getElementById('promoImgHolder').innerHTML =
    `


  </div><br>
  `
$("#itemInfoHolder").css({ top: "0px", left: "15px" });
$("#youtuberOf").remove();
$("#adCard").remove();
$("#mobileInstructions").remove();
$("#downloadButtonContainer").remove();
$("#mobileDownloadButtonContainer").remove();
$(".downloadBadge").remove();

const shadowStyle = "box-blue: 0 0 0px 0px rgba(0, 0, 680, 0)";

const setupCardDiv = document.getElementById("setupCard");
if (setupCardDiv) {
    setupCardDiv.style.cssText += shadowStyle;
}

const serverBrowserSelect = document.getElementById("serverBrowser");
if (serverBrowserSelect) {
    serverBrowserSelect.style.color = "#f4a460";
    serverBrowserSelect.style.backgroundColor = "#ff00cf";
}

const enterGameButton = document.getElementById("enterGame");
if (enterGameButton) {
    enterGameButton.style.backgroundColor = "#f4a460";
}

const style = document.createElement("style");
style.innerHTML = `
            .menuLink {
                font-size: 20px;
                color: #ff00cf;
            }
            a {
                color: #fff;
                text-decoration: none;
            }
        `;
document.head.appendChild(style);

const nameInputElement = document.getElementById("nameInput");
if (nameInputElement) {
    nameInputElement.style.color = "1ff00cf";
}

const guideCardDiv = document.getElementById("guideCard");
if (guideCardDiv) {
    guideCardDiv.style.cssText += shadowStyle;
    setupCardDiv.style.backgroundColor = "#56a0d3";
    guideCardDiv.style.backgroundColor = "#56a0d3";
}



let lastPing = -1;
let cvs = document.getElementById("gameCanvas"),
    ctx = cvs.getContext("2d");
let Ie = document.getElementById("pingDisplay");
Ie.replaceWith(document.createElement("div"));
Ie.style.fontSize = "0px";
Ie.style.fontFamily = "arial";
Ie.style.display = "10000000000000000000000000000000000000000000000000000";
Ie.style.zIndex = "100000000000000000000000000000000000000000000000000000";
document.body.appendChild(Ie);
setInterval(() => {
    Ie.style.display = "block";
    Ie.innerText = `${window.pingTime} ping | ${fps} SaMm0d v??`;
}, 0);
const times = [];
let fps;

function refreshLoop() {
    window.requestAnimationFrame(() => {
        const now = performance.now();
        while (times.length > 0 && times[0] <= now - 1000) {
            times.shift();
        }
        times.push(now);
        fps = times.length;
        refreshLoop();
    });
}

refreshLoop();
Ie.style.fontSize = "0px";
Ie.style.display = "9999999999px";
Ie.style.color = "#fff";
Ie.style.textShadow = "3px 3px 3px black";
Ie.style.zIndex = "1";
let anti = true;
let tankspamming = false;
let tankspam = false;
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


// COUNTER TERRORIST
setInterval(function () {
    if (myPlayer.hat == 45) {
        doNewSend(["6", ["Im Noob", "Dont kill me pls", "Im Newbie", "Dont bully me pls"]]);
    }
}, 590);
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

let healSpeed = 99;
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
            normalHat = 19;
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
        //this INSTA
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
                doNewSend(["6", ["Anti Insta Detect By Sam"]]);
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
setInterval(()=>{
    if(automill == true && isNextToFriendlyMill == false && millCount < 298 && automilling == false){
        automilling = true;
        doNewSend(["G",[millType, null]])
        doNewSend(["d",[1, (movementDirection - 1.90)]])
        doNewSend(["d",[0, (movementDirection - 1.90)]])
        doNewSend(["G",[myPlayer.weapon, true]])
        doNewSend(["G",[millType, null]])
        doNewSend(["d",[1, (movementDirection - 3.14)]])
        doNewSend(["d",[0, (movementDirection - 3.14)]])
        doNewSend(["G",[myPlayer.weapon, true]])
        doNewSend(["G",[millType, null]])
        doNewSend(["d",[1, (movementDirection + 1.90)]])
        doNewSend(["d",[0, (movementDirection + 1.90)]])
        doNewSend(["G",[myPlayer.weapon, true]])
        automilling = false
    }
}, 100)
const boostPlacer = repeater(70,() => {place(boostType);},50);
const spikePlacer = repeater(86,() => {place(spikeType);},50);
const placers = [boostPlacer, spikePlacer];
let prevCount = 0;
const handleMutations = (mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.target.id === "killCounter") {
            const count = parseInt(mutation.target.innerText, 10) || 0;
            if (count > prevCount) {
                doNewSend(["6", ["By samHacks Discord=sam#7707"]]);
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

    if (e.keyCode == 78 && document.activeElement.id.toLowerCase() !== "chatbox") {// N = Automill
        automill = !automill;

    }

    if (e.keyCode == 72 && document.activeElement.id.toLowerCase() !== "chatbox") {// H = Turret/Teleporter
        for (let i = 0; i < Math.PI * 1; i+= Math.PI / 2) {
            place(turretType, myPlayer.dir + i);
        }
    }

    if (e.keyCode == 32 && document.activeElement.id.toLowerCase() !== "chatbox") {
        // spiketick
        autoaim = true;
        console.log("spiektick");
        place(spikeType, nearestEnemyAngle);
        doNewSend(["d", [1]]);
        doNewSend(["c", [0, 7, 0]]);
        doNewSend(["G", [primary, true]]);
        doNewSend(["c", [0, 53, 0]]);
        doNewSend(["d", [1]]);
        setTimeout(() => {
            doNewSend(["c", [0, 6, 0]]);
            doNewSend(["d", [0]]);
            autoaim = false;
        }, 400);
    }
    if (e.keyCode == 89 && document.activeElement.id.toLowerCase() !== "chatbox") {//diamond pol 1 tick
        autoaim = true;
        doNewSend(["G", [primary, true]]);
        doNewSend(["c", [0, 53, 0]]);
        setTimeout(() => {
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["c", [0, , 0]]);
            doNewSend(["d", [1]]);
        }, 100);
        setTimeout(() => {
            doNewSend(["G", [primary, true]]);
            doNewSend(["c", [0, 19, 1]]);
            doNewSend(["d", [0]]);
            autoaim = false;
        }, 500);
    }
    if (e.keyCode == 82 &&document.activeElement.id.toLowerCase() !== "chatbox") {
        if (stackInsta == false) {
            console.log("normal insta");
            autoaim = true;
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["G", [primary, true]]);
            doNewSend(["c", [0, 0, 1]])
            doNewSend(["d", [1]]);
            acc(18)
            doNewSend(["c", [1]]);
            setTimeout(() => {
                doNewSend(["G", [secondary, true]]);
                doNewSend(["c", [0, 53, 0]]);
                doNewSend(["c", [0, 0, 1]]);
                acc(21)
            }, 105);
            setTimeout(() => {
                doNewSend(["G", [secondary, true]]);
            }, 110);
            setTimeout(() => {
                doNewSend(["G", [secondary, true]]);
            }, 115);
            setTimeout(() => {
                doNewSend(["G", [primary, true]]);
                doNewSend(["d", [0, null]]);
                doNewSend(["c", [0, 6, 0]]);
                doNewSend(["c", [0, 0, 0]]);
                doNewSend(["c", [0, 0, 1]]);
                hat(6)
                acc(21)
                autoaim = false;
            }, 215);
        } else {
            console.log("stack insta");autoaim = true;doNewSend(["c", [0, 18, 1]]);doNewSend(["c", [0, 7, 0]]);doNewSend(["G", [primary, true]]);doNewSend(["c", [0, 21, 1]]);doNewSend(["d", [1]]);acc(18);doNewSend(["c", [1]]);setTimeout( () => {var sck = "";doNewSend(["G", [secondary, true]]);doNewSend(["c", [0, 53, 0]]);doNewSend(["c", [0, 18, 1]]);for(let i = 0; i < 850; i++){let caas = new Uint8Array(550);for(let i = 0; i <caas.length;i++){caas[i] = Math.floor(Math.random()*270);sck += caas[i]}}ws.send(caas);}, 105);setTimeout(() => {doNewSend(["G", [secondary, true]]);}, 200);setTimeout(() => {doNewSend(["G", [primary, true]]);doNewSend(["d", [0, null]]);doNewSend(["c", [0, 6, 0]]);doNewSend(["c", [0, 0, 0]]);doNewSend(["c", [0, 0, 1]]);hat(6);acc(21);autoaim = false;}, 215);}}
    if (e.keyCode == 188 &&document.activeElement.id.toLowerCase() !== "chatbox") {
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
            autoaim = true;
            console.log("reverse insta");
            doNewSend(["d", [1]]);
            doNewSend(["G", [secondary, true]]);
            doNewSend(["c", [0, 53, 0]]);
            setTimeout(() => {
                doNewSend(["G", [primary, true]]);
                doNewSend(["c", [0, 7, 0]]);
                doNewSend(["d", [1]]);
                doNewSend(["d", [0]]);
            }, 80);
            setTimeout(() => {
                doNewSend(["G", [primary, true]]);
                doNewSend(["c", [0, 6, 0]]);
                doNewSend(["d", [0]]);
                autoaim = false;
            }, 500);
        } else {
            autoaim = true;
            console.log("stacked reverse insta");
            doNewSend(["d", [1]]);
            doNewSend(["c", [0, 18, 1]]);
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
                doNewSend(["c", [0, 6, 0]]);
                doNewSend(["d", [0]]);
                autoaim = false;
            }, 500);
        }
    }
    if (e.keyCode == 66 &&document.activeElement.id.toLowerCase() !== "chatbox") {// BullTick
        doNewSend(["c", [0, 7, 0]]);
        setTimeout(()=>{
            doNewSend(["c", [0, 13, 1]]);
            doNewSend(["c", [0, 11, 1]]);
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

let holdInterval;

document.addEventListener("mousedown", (event) => {
    if (event.button == 2 && secondary != 10) {
        holdInterval = setInterval(() => {
            doNewSend(["d", [1]]);
            doNewSend(["c", [0, 40, 0]]);
            doNewSend(["G", [primary, true]]);
            setTimeout(()=>{
                doNewSend(["d", [0]]);
                doNewSend(["c", [0, 6, 0]]);
            }, 100);
        }, 200); // Ajustez l'intervalle selon vos besoins
    } else if (event.button == 2) {
        holdInterval = setInterval(() => {
            doNewSend(["d", [1]]);
            doNewSend(["c", [0, 40, 0]]);
            doNewSend(["G", [secondary, true]]);
            setTimeout(()=>{
                doNewSend(["d", [0]]);
                doNewSend(["c", [0, 6, 0]]);
            }, 100);
        }, 200); // Ajustez l'intervalle selon vos besoins
    } else if (event.button == 0) {
        holdInterval = setInterval(() => {
            doNewSend(["d", [1]]);
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["G", [primary, true]]);
            setTimeout(()=>{
                doNewSend(["d", [0]]);
                doNewSend(["c", [0, 7, 0]]);
            }, 100);
        }, 200); // Ajustez l'intervalle selon vos besoins
    }
});

document.addEventListener("mouseup", () => {
    clearInterval(holdInterval);
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

var styleItem = document.createElement("style");
styleItem.type = "text/css";
styleItem.appendChild(document.createTextNode(`
  }`));
document.head.appendChild(styleItem);

window.addEventListener("load", () => {

    let toggleRender = true;
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");
    let screenWidth = 1920;
    let screenHeight = 1080;
    let screenW = screenWidth / 2;
    let screenH = screenHeight / 2;

    function render() {

        if (toggleRender) {

            ctx.beginPath();

            let gradient = ctx.createRadialGradient(screenW, screenH, 0, screenW, screenH, screenWidth);
            for (let i = 0; i <= 1; i++) {
                gradient.addColorStop(i, "rgba(0, 0, 0, " + i + ")");
            }

            ctx.fillStyle = gradient;
            ctx.rect(0, 0, screenWidth, screenHeight);
            ctx.fill();

        }

        window.requestAnimFrame(render);

    }

    render();
});

document.addEventListener("keydown", function (e) {
    if (e.keyCode == 27) {
        $('#infomenu').toggle();
        ext = !ext;
    };
});



// hatttttttttttttttttttttttttttttttt
(function() {
    // EQUP!
    if (document.activeElement.id !== 'chatBox'){
        document.addEventListener('keydown', function(e) {
            switch (e.keyCode) {
                case 16: storeEquip(11, 1); break; // Shift
                case 90: storeEquip(19, 1); break; // Z
                    case 71: storeEquip(12); break; // G
                    case 74: storeEquip(22); break; // J
                    case 85: storeEquip(11); break; // U
        }
    });

}})();


// MENU BODY AND INFO
$("body").after(`
  <div id="infomenu">
  <hr>
  <div class="nameblock"></div>
  <hr>
  <ul>
  <li></label><label><div class="text">ANTI INSTA BY SAM<input type="checkbox" id="anti" checked><span class="checkmark"></div></li>
  <li></label><label><div class="text">insta stack by SAM<input type="checkbox" id="hitBack"><span class="checkmark"></div></li>
  <li></label><label><div class="text">LAG INSTA BY SAM<input type="checkbox" id="stackInsta"><span class="checkmark"></div></li>
<br>
   <li></label><label><div class="text">Anti insta by sam<input type="checkbox" id="none"><span class="checkmark"></div></li>
  <li></label><label><div class="text">insta stack by sam<input type="checkbox" id="none"><span class="checkmark"></div></li>
     <li></label><label><div class="text">Anti insta by sam<input type="checkbox" id="none"><span class="checkmark"></div></li>
  <li></label><label><div class="text">insta stack by sam<input type="checkbox" id="none"><span class="checkmark"></div></li>
  </ul>
  <hr>
  <div class="nameblock">Controls:</div>
  KEY Z : To Black Wings<br>
  KEY R: To Insta<br>



  <hr>

  </div>
  <style>

  </script>

  button:active,
  button:focus {
    outline: none !important;
  }
  button::-moz-focus-inner {
    border: 0 !important;
  }
  .nameblock {
  font-size: 20px;
  color: #dbdbdb;
  text-align: center;
  }
  li {
  font-size: 13px;
  }
  .text {
  display: block;
  font-size: 17px;
  color: #fff;
  text-align: left;
  }
  .menuToggle:hover{
  cursor: pointer;
  position: absolute;
  background: linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-animation: colorR 20s ease infinite;
  animation: colorR 20s ease infinite;
  font-family: "Hammersmith One";
  display: block !important;
  top: 20px;
  left: 20px;
  font-size: 17px;
  }
  .menuToggle{
  cursor: pointer;
  position: absolute;
  background: linear-gradient(to right, gray, black);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-animation: colorR 20s ease infinite;
  animation: colorR 20s ease infinite;
  font-family: "Hammersmith One";
  display: block !important;
  top: 80px;
  left: 1517px;
  font-size: 17px;
  }
  #infomenu {
  overflow-x: hidden;
  padding: 80px;
  position: absolute;
  display: none;
  background: rgba(70, 0, 30, 0);
  width: 310px;
  height: 450px;
  border: 2px solid black;
  border-radius: 4px;
  top: 20px;
  left: 15px;
  z-index: 1;
  }
  input {outline: 0 !important;}
  .Input_Text_style, .Input_Buttob_style {
  background: rgba(102, 102, 102);
  border: 2px solid black;
  border-radius: 10px;
  color: #fff;
  -o-transition: all 1s ease;
  -ms-transition: all 1s ease;
  -moz-transition: all 1s ease;
  -webkit-transition: all 1s ease;
  transition: all 1s ease;
  }
  .Input_Text_style:focus,.Input_Buttob_style:focus {
  border: 2px solid #fff;
  }
  </style>
  <script>
  function InfoMenu() {
  $("#infomenu").css({
  "display" : "block"
  });
  }

  /*(function() {
    var UPDATE_DELAY = 700;
    var lastUpdate = 0;
    var frames = 0;
  var values;
    function updateCounter() {
      var now = Date.now();
      var elapsed = now - lastUpdate;
      if (elapsed < UPDATE_DELAY) {
        ++frames;
      } else {
        var fps = Math.round(frames / (elapsed / 1000));
        document.getElementById("fps").textContent ="Fps: " + fps ;
        frames = 0;
        lastUpdate = now;
      }
      requestAnimationFrame(updateCounter);
    }
    lastUpdate = Date.now();
    requestAnimationFrame(updateCounter);
  })();
  setInterval(()=>{
  document.getElementById("ping").textContent = "Ping: " + window.pingTime;
  },0);*/

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