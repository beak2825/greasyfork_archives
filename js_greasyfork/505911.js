// ==UserScript==
// @name         Classified
// @namespace    none
// @version      1
// @description  Impossible to outplace
// @author       𝓛._.𝓻𝓮 (Watersheep)
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @icon         https://i.pinimg.com/originals/f8/7a/d3/f87ad32360e70eaf0b8f7ae9b5ed2b67.gif
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/505911/Classified.user.js
// @updateURL https://update.greasyfork.org/scripts/505911/Classified.meta.js
// ==/UserScript==

let config = window.config;

function normal() {
    hat(normalHat)
    acc(normalAcc)
}

function aim(x, y) {
    var cvs = document.getElementById("gameCanvas")
    cvs.dispatchEvent(new MouseEvent("mousemove", {
        clientX: x,
        clientY: y
    }))
}

let coreURL = new URL(window.location.href)
window.sessionStorage.force = coreURL.searchParams.get("fc")

if (window.sessionStorage.force != "false" && window.sessionStorage.force && window.sessionStorage.force.toString() != "null") {
    document.getElementsByClassName("menuHeader")[0].innerHTML = `Servers <span style="color: red">Force (${window.sessionStorage.force})</span>`
}

class ForceSocket extends WebSocket {
    constructor(...args) {
        if (window.sessionStorage.force != "false" && window.sessionStorage.force && window.sessionStorage.force.toString() != "null") {
            let server = window.sessionStorage.force
            let sip = ""
            for (let gameServer of window.vultr.servers) {
                if (`${gameServer.region}:${gameServer.index}:0` == server) {
                    sip = gameServer.ip
                }
            }
            args[0] = `wss://ip_${sip}.moomoo.io:8008/?gameIndex=0`
            delete window.sessionStorage.force
        }
        super(...args)
    }
}

setInterval(() => {
    if(autoaim == true) {
        doNewSend(["2", [nearestEnemyAngle]]);
    }
}, 0);
setInterval(() => {
    if(spin) {
        aim(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
    }
}, 0);

var spin = false;
var nearestEnemy;
var nearestEnemyAngle;
var autoaim = false;
var isEnemyNear;
var instaSpeed = 0;
var primary;
var secondary;
var foodType;
var wallType;
var spikeType;
var millType;
var mineType;
var trapType;
var boostType;
var turretType;
var spawnpadType;
var tick = 0;
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
    oldX: null,
    oldY: null,
    dt: 0,
    dir: null,
    object: null,
    weapon: null,
    clan: null,
    isLeader: null,
    hat: null,
    accessory: null,
    isSkull: null,
    sTime: 0,
    sCount: 0,
    health: 100
};

let healSpeed = 0;
var messagecrash = 0;
var clanToggle = 0;
var clanCrash = 0;
var clanfake = 0;
var messagefake = 0;
let healToggle = 0;
let hatToggle = 0;
let SoreHolder = document.getElementById('storeHolder');
let width;
let height;
let mouseX;
let mouseY;
let heal = false;
let onetick = false;
let oneticking = false;
let lessmove = undefined;
let instaing = false;
let mySkins = {};
let myTails = {};
let camX = null;
let camY = null;
let myXY = {
    x: undefined,
    y: undefined
}

document.msgpack = msgpack;

function n() {
    this.buffer = new Uint8Array([0]);
    this.buffer.__proto__ = new Uint8Array;
    this.type = 0;
};

let packet = 0;
let firstPacket = false;
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (m) {
    if (!ws) {
        document.ws = this;
        ws = this;
        socketFound(this);
    }
    if (ws == this) {
        if (!firstPacket) {
            firstPacket = true;
            setTimeout(() => {
                packet = 0;
                firstPacket = false;
            }, 1000);
        }
        packet++;
    }
    this.oldSend(m);
};

let delta;
let now;
let lastUpdate = Date.now();

let types = {
    util: {
        getDist: function (tmp1, tmp2, type1, type2) {
            let tmpXY1 = {
                x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 && tmp1.x2,
                y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 && tmp1.y2
            }
            let tmpXY2 = {
                x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 && tmp2.x2,
                y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 && tmp2.y2
            }
            return Math.sqrt((tmpXY2.x -= tmpXY1.x) * tmpXY2.x + (tmpXY2.y -= tmpXY1.y) * tmpXY2.y);
        },
        getDirect: function (tmp1, tmp2, type1, type2) {
            let tmpXY1 = {
                x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 && tmp1.x2,
                y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 && tmp1.y2
            }
            let tmpXY2 = {
                x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 && tmp2.x2,
                y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 && tmp2.y2
            }
            return Math.atan2(tmpXY1.y - tmpXY2.y, tmpXY1.x - tmpXY2.x);
        },
    }
}

let gameCanvas = document.getElementById("gameCanvas");
let mainContext = gameCanvas.getContext("2d");
let myName = "unknown";

function shameCounter() {
    if (myPlayer.id) {
        let tmpXY = {
            x: camX,
            y: camY
        };
        let tmpDist = types.util.getDist(tmpXY, myXY, 0, 0);
        let tmpDir = types.util.getDirect(myXY, tmpXY, 0, 0);
        let camSpd = Math.min(tmpDist * 0.01 * delta, tmpDist);
        if (tmpDist > 0.05) {
            camX += camSpd * Math.cos(tmpDir);
            camY += camSpd * Math.sin(tmpDir);
        } else {
            camX = myXY.x;
            camY = myXY.y;
        }
        let rate = 170;
        myPlayer.dt += delta;
        let tmpRate = Math.min(1.7, myPlayer.dt / rate);
        let tmpDiff = (myPlayer.x - myPlayer.oldX);
        myXY.x = myPlayer.oldX + (tmpDiff * tmpRate);
        tmpDiff = (myPlayer.y - myPlayer.oldY);
        myXY.y = myPlayer.oldY + (tmpDiff * tmpRate);
        let xOffset = camX - (1920 / 2);
        let yOffset = camY - (1080 / 2);
        mainContext.font = "30px Hammersmith One";
        mainContext.fillStyle = "#fff";
        mainContext.textBaseline = "middle";
        mainContext.textAlign = "center";
        mainContext.lineWidth = 8;
        mainContext.lineJoin = "round";
        var tmpText = (myPlayer.clan ? "[" + myPlayer.clan + "] " : "") + (myName || "");
        var tmpS = 60;
        var tmpX = myXY.x - xOffset - (tmpS / 2) + (mainContext.measureText(tmpText).width / 2) + 35 + (myPlayer.isSkull == 1 ? 90 : 30);
        mainContext.strokeText(myPlayer.sCount, tmpX, (myXY.y - yOffset - 35) - 34);
        mainContext.fillText(myPlayer.sCount, tmpX, (myXY.y - yOffset - 35) - 34);
    } else {
        camX = 14400 / 2;
        camY = 14400 / 2;
    }
}

let mStatus = document.createElement("div");
mStatus.id = "status";
mStatus.style.position = "absolute";
mStatus.style.color = "#fff";
mStatus.style.font = "15px Hammersmith One";
mStatus.style.top = "40px";
mStatus.style.left = "40px";
mStatus.style.display = "block";
mStatus.textAlign = "right";
document.body.appendChild(mStatus);

function doUpdate() {
    now = Date.now();
    delta = now - lastUpdate;
    lastUpdate = now;
    shameCounter();
    window.requestAnimationFrame(doUpdate);
    mStatus.innerHTML = `
    Packet: ${packet}</br>
    `;
}
doUpdate();


function socketFound(socket) {
    socket.addEventListener('message', function (message) {
        handleMessage(message);
    });
}

function dist(a, b) {
    return Math.hypot(a[2] - b.y, a[1] - b.x);
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
        $(window).resize(function () {
            width = cvs.clientWidth;
            height = cvs.clientHeight;
        });
        cvs.addEventListener("mousemove", e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
    }

    if (item == "A" && myPlayer.id == null) {
        myPlayer.id = data[1];
    }

    if (item == "B") {
        if (data[2]) {
            myName = data[1][2];
            myPlayer.health = 100;
            myPlayer.sCount = 0;
            myPlayer.sTime = 0;
            update();
        }
    }
if(data == "6") {
    console.warn(data);
}
    if(data == "K") {
        console.error(data);
        let sid = data[0]
        let findObj = findObjectBySid(sid);
        try {
            let objAim = UTILS.getDirect(findObj, tmpXY(player));
            let objDst = UTILS.getDist(findObj, tmpXY(player));
            let tmpCount = -1;
            for (let i = -Math.PI/(Math.PI); i <= Math.PI/(Math.PI); i+= Math.PI/(Math.PI)) {
                tmpCount++
                if (tmpCount == 1 && objDst <= 200) {
                    place(spikeType, objAim);
                } else {
                    checkPlace(2, objAim+i);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }


    if (item == "O" && data[1] == myPlayer.id) {
        if (75 < data[2] < 100) {
            setTimeout(() => {
                place(foodType);
            }, 90);
        }
    }

    if (item == "O" && data[1] == myPlayer.id) {
        if (data[2] < 75) {
            macros.q = true
            place(foodType);
            place(foodType);
        } else {
            macros.q = false
        }
    }

    function findPlayerBySID(sid) {
    for (var i = 0; i < players.length; ++i) {
        if (players[i].sid == sid) {
            return players[i];
        }
    } return null;
}
console.log(data);
    // UPDATE HEALTH:
    if (item == "O" && data[1] == myPlayer.id) {
        let tmpObj = findPlayerBySID(sid);
        if (tmpObj) {
                let tmpHealth = tmpObj.health;
                tmpObj.health = value;
                if (tmpHealth < tmpObj.health) {
                    if (tmpObj.hitTime) {
                        let timeSinceHit = Date.now() - tmpObj.hitTime;
                        tmpObj.hitTime = 0;
                        let tmpShame = tmpObj.shameCount;
                        if (timeSinceHit <= 120) {
                            tmpObj.shameCount = Math.min(8, tmpObj.shameCount + 1);
                        } else {
                            tmpObj.shameCount = Math.max(0, tmpObj.shameCount - 2);
                        }
                        if (tmpObj !== player) {
                            if (tmpObj.dangerShame < tmpObj.shameCount) {
                                tmpObj.dangerShame = tmpObj.shameCount;
                            }
                        }
                    }
                } else if (tmpHealth > tmpObj.health) {
                    let a = 0;
                    let antiInsta = false;
                    let checkAnti;
                    tmpObj.hitTime = Date.now();
                    if (tmpObj === player) {
                        if (!getEl("tickbase").checked) {
                            let pingHeal = function() {
                                return Math.max(0, 250 - window.pingTime);
                            };
                            if (true) {
                                if (near.length) {
                                    if(tmpObj != player) {
                                        if (
                                            (tmpObj.reloads[tmpObj.primaryIndex] != 0 && tmpObj.skinIndex == 7) ||
                                            (tmpObj.reloads[tmpObj.secondaryIndex] != 0 && tmpObj.skinIndex == 53)
                                        ) {
                                            checkAnti = true;
                                        }
                                        if (checkAnti) {
                                            io.send("ch", "anti insta test");
                                            antiInsta = true;
                                        }
                                        if(antiInsta) {
                                            console.log("anti instad");
                                            io.send("ch", "anti insta test");
                                            if(value>40){
                                                place(0, getAttackDir());
                                            }else{
                                                place(0, getAttackDir());
                                                place(0, getAttackDir());
                                            }
                                        }
                                        console.warn(player.reloads[player.primaryIndex]);
                                        if(Math.abs(value)>25) {
                                            if(tmpObj.reloads[tmpObj.primaryIndex] != 0) a=0;
                                            if(tmpObj.reloads[tmpObj.secondaryIndex] != 0) a=1;
                                            if(a=0) {
                                                io.send("ch", "beta anti insta");

                                                place(0, getAttackDir());
                                                place(0, getAttackDir());
                                            } else if (a=1) {
                                                //io.send("ch", "test");

                                                setTimeout(() => {
                                                    place(0, getAttackDir());
                                                }, 86);
                                                setTimeout(() => {
                                                    place(0, getAttackDir());
                                                }, 86);
                                            }
                                        } else {
                                            if(tmpObj.reloads[tmpObj.primaryIndex] != 0) a=0;
                                            if(tmpObj.reloads[tmpObj.secondaryIndex] != 0) a=1;
                                            if(a=0) {
                                                //io.send("ch", "beta anti insta");

                                                place(0, getAttackDir());
                                                place(0, getAttackDir());
                                            } else if (a=1) {
                                                //io.send("ch", "test");

                                                setTimeout(() => {
                                                    place(0, getAttackDir());
                                                }, 86);
                                                setTimeout(() => {
                                                    place(0, getAttackDir());
                                                }, 86);
                                            }
                                        }
                                    }
                                    value >= 20
                                    if (tmpObj.skinIndex = 53 && tmpObj.isAI != true) {
                                        if(tmpObj.reloads[tmpObj.primaryIndex] != 0) a=0;
                                        if(tmpObj.reloads[tmpObj.secondaryIndex] != 0) a=1;
                                        if(a=0) {
                                            //io.send("ch", "beta anti insta");

                                            place(0, getAttackDir());
                                            place(0, getAttackDir());
                                        } else if (a=1) {
                                            io.send("ch", "test");

                                            setTimeout(() => {
                                                place(0, getAttackDir());
                                            }, 86);
                                            setTimeout(() => {
                                                place(0, getAttackDir());
                                            }, 86);
                                        }
                                    } else {
                                        if(tmpObj.reloads[tmpObj.primaryIndex] != 0) a=0;
                                        if(tmpObj.reloads[tmpObj.secondaryIndex] != 0) a=1;
                                        if(a=0) {
                                            //io.send("ch", "beta anti insta");

                                            place(0, getAttackDir());
                                            place(0, getAttackDir());
                                        } else if (a=1) {
                                            io.send("ch", "test");

                                            setTimeout(() => {
                                                place(0, getAttackDir());
                                            }, 86);
                                            setTimeout(() => {
                                                place(0, getAttackDir());
                                            }, 86);
                                        }
                                    }
                                    player.skinIndex == 11 && (value >= 30);
                                    buyEquip(11, 0);
                                } else {
                                    if(tmpObj.reloads[tmpObj.primaryIndex] != 0) a=0;
                                    if(tmpObj.reloads[tmpObj.secondaryIndex] != 0) a=1;
                                    if(a=0) {
                                        //io.send("ch", "beta anti insta");
                                        place(0, getAttackDir());
                                        place(0, getAttackDir());
                                    } else if (a=1) {
                                        if (
                                            (tmpObj.reloads[tmpObj.primaryIndex] != 0 && tmpObj.skinIndex == 7) ||
                                            (tmpObj.reloads[tmpObj.secondaryIndex] != 0 && tmpObj.skinIndex == 53)
                                        ) {
                                            checkAnti = true;
                                        }
                                        if (checkAnti) {
                                            io.send("ch", "anti insta test");
                                            antiInsta = true;
                                        }
                                        if(antiInsta) {
                                            console.log("anti instad");
                                            io.send("ch", "anti insta test");
                                            if(value>40){
                                                place(0, getAttackDir());
                                            }else{
                                                place(0, getAttackDir());
                                                place(0, getAttackDir());
                                            }
                                        }
                                        //io.send("ch", "test");
                                        setTimeout(() => {
                                            place(0, getAttackDir());
                                        }, 86);
                                        setTimeout(() => {
                                            place(0, getAttackDir());
                                        }, 86);
                                    }
                                }
                            }
                        } else {

                            let damage = tmpHealth - tmpObj.health;
                            let pingHeal = function() {
                                return Math.max(0, 140 - window.pingTime);
                            };
                            let normal = 50;
                            if (near.nears.length) {
                                for (let i = 0; i < near.nears.length; i++) {
                                    let nearEnemy = near.enemy;
                                    if (damage >= (tmpObj.skinIndex == 6 ? 30 : 10) && ((nearEnemy.secondaryIndex === undefined || nearEnemy.primaryIndex === undefined) ? true : (nearEnemy.reloads[nearEnemy.primaryIndex] === 0 && nearEnemy.reloads[nearEnemy.secondaryIndex] === 0))) {
                                        if (tmpObj.shameCount < 3) {
                                            for (let i = 0; i < applCxC(damage); i++) {
                                                setTimeout(() => {
                                                    if(Math.abs(value)>40) {
                                                        place(0, getAttackDir());
                                                        place(0, getAttackDir());
                                                    } else {
                                                        place(0, getAttackDir());
                                                    }
                                                }, config.tickRate / 2);
                                            }
                                        } else {
                                            for (let i = 0; i < applCxC(damage); i++) {
                                                setTimeout(() => {
                                                    if(Math.abs(value)>40) {
                                                        place(0, getAttackDir());
                                                        place(0, getAttackDir());
                                                    } else {
                                                        place(0, getAttackDir());
                                                    }
                                                }, config.tickRate);
                                            }
                                        }
                                    } else {
                                        for (let i = 0; i < applCxC(damage); i++) {
                                            setTimeout(() => {
                                                if(Math.abs(value)>40) {
                                                    place(0, getAttackDir());
                                                    place(0, getAttackDir());
                                                } else {
                                                    place(0, getAttackDir());
                                                }
                                            }, config.tickRate * 1.5);
                                        }
                                    }
                                }
                            } else {
                                for (let i = 0; i < applCxC(damage); i++) {
                                    setTimeout(() => {
                                        if(Math.abs(value)>40) {
                                            place(0, getAttackDir());
                                            place(0, getAttackDir());
                                        } else {
                                            place(0, getAttackDir());
                                        }
                                    }, config.tickRate / 2);
                                }
                            }
                        }
                    } else {
                        if (tmpObj === near.enemy) {
                            let damage = tmpHealth - tmpObj.health;
                            if (damage > 5) {
                                if (autos.insta.count > 0) {
                                    autos.insta.count--;
                                    setTimeout(() => {
                                        if (autos.insta.count <= 0) {
                                            autos.insta.todo = true;
                                        }
                                    }, config.tickRate / 2);
                                }
                            }
                        }
                    }
                }
            }
        }

    if (item == "a") {
        enemiesNear = [];
        for (let i = 0; i < data[1].length / 13; i++) {
            let playerInfo = data[1].slice(13 * i, 13 * i + 13);
            if (playerInfo[0] == myPlayer.id) {
                myPlayer.oldX = myXY.x;
                myPlayer.oldY = myXY.y;
                myPlayer.dt = 0;
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
                if (myPlayer.hat == 45) {
                    myPlayer.sCount = 0;
                }
            } else if (playerInfo[7] != myPlayer.clan || playerInfo[7] === null) {
                enemiesNear.push(playerInfo);
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
                if (autoaim == false && oneticking == false && myPlayer.hat != 7 && myPlayer.hat != 53) {
                    normalHat = 12;
                    if (primary != 8) {
                        normalAcc = 21
                    }
                };
            }
        }
        if (onetick && enemiesNear.length) {
            let distance = dist(nearestEnemy, myPlayer);
            let biomehat = function () {
                if (myPlayer.accessory != 11) {
                    acc(11);
                }
                if (myPlayer.y < 2400) {
                    if (myPlayer.hat != 15) {
                        hat(15);
                    }
                } else if (myPlayer.y > 6850 && myPlayer.y < 7550) {
                    if (myPlayer.hat != 31) {
                        hat(31);
                    }
                } else {
                    if (myPlayer.hat != 12) {
                        hat(12);
                    }
                }
            };
            oneticking = true;
            if (distance > 231 && distance < 234) {
                if (lessmove != undefined) {
                    lessmove = undefined;
                    doNewSend(["33", [lessmove]]);
                }
                biomehat();
                if (nearestEnemy[9] != 22 && nearestEnemy[9] != 6) {
                    sendTick();
                }
            } else {
                if (distance <= 231) {
                    if (lessmove != nearestEnemyAngle + Math.PI) {
                        lessmove = nearestEnemyAngle + Math.PI;
                        doNewSend(["33", [lessmove]]);
                    }
                } else if (distance >= 234) {
                    if (lessmove != nearestEnemyAngle) {
                        lessmove = nearestEnemyAngle;
                        doNewSend(["33", [lessmove]]);
                    }
                }

                if (distance > 215 && distance < 250) {
                    if (myPlayer.hat != 40) {
                        hat(40);
                        acc(0);
                    }
                } else {
                    if (myPlayer.hat != 12) {
                        hat(12);
                    }
                }
            }
        } else {
            oneticking = false;
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
        if (doInsta) {
            doInsta = false;
            if (!instaing) {
                doNewSend(["13c", [0, 0, 1]]);
                doNewSend(["5", [primary, true]]);
                autoaim = true
                doNewSend(["7", [1]]);
                if (!mySkins[7]) {
                    doNewSend(["13c", [1, 7, 0]]);
                }
                if (myPlayer.hat != 7) {
                    doNewSend(["13c", [0, 7, 0]]);
                }
                if (myPlayer.accessory != 0) {
                    doNewSend(["13c", [0, 0, 1]]);
                }
                setTimeout(() => {
                    if (myPlayer.accessory != 0) {
                        doNewSend(["13c", [0, 0, 1]]);
                    }
                    if (!mySkins[53]) {
                        doNewSend(["13c", [1, 53, 0]]);
                    }
                    if (myPlayer.hat != 53) {
                        doNewSend(["13c", [0, 53, 0]]);
                    }
                    doNewSend(["5", [secondary, true]]);
                    autoaim = false
                    setTimeout(() => {
                        doNewSend(["7", [1]]);
                        doNewSend(["5", [primary, true]]);
                    }, 82);
                }, 82);
            }
        }
    }

    if (item == "h" && data[1] == myPlayer.id) {
        let dmg = myPlayer.health - data[2];
        if ((myPlayer.health - data[2]) < 0) {
            if (myPlayer.sTime) {
                let timeHit = Date.now() - myPlayer.sTime;
                myPlayer.sTime = 0;
                if (timeHit <= 120) {
                    myPlayer.sCount++;
                } else {
                    myPlayer.sCount = Math.max(0, myPlayer.sCount - 2);
                }
            }
        } else {
            myPlayer.sTime = Date.now();
        }
        myPlayer.health = data[2];
    }
    if (item == "V") {
        update();
    }
    if (item == "us") {
        if (data[3]) {
            if (!data[1])
                myTails[data[2]] = 1;
            else
                myPlayer.accessory = data[2];
        } else {
            if (!data[1])
                mySkins[data[2]] = 1;
            else
                myPlayer.hat = data[2];
        }
    }
}

let macros = {
    q: false,
    f: false,
    v: false,
    n: false,
    g: false,
    '9': false
}

setInterval(() => {
    macros.v && place(spikeType);
}, 35);

setInterval(() => {
    macros.f && place(boostType);
    macros.n && place(millType);
    macros.g && place(turretType);
    macros.q && place(foodType);
    macros['9'] && place(spawnpadType);
}, 86);

function doNewSend(sender) {
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}

function acc(id) {
    doNewSend(["13c", [0, id, 1]]);
}

function hat(id) {
    doNewSend(["13c", [0, id, 0]]);
}

function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["5", [myPlayer.weapon, true]]);
}

function plac(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["5", [myPlayer.weapon, true]]);
}

function placing(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["5", [myPlayer.weapon, true]]);
}

let doInsta = false;
let keyss = {};
document.addEventListener('keydown', (e) => {
    if (!keyss[e.keyCode]) {
        keyss[e.keyCode] = 1;
        if (document.activeElement.id.toLowerCase() !== "chatbox") {
            macros[e.key] = true;
            const wallPlacer = false;
            if (e.keyCode == 82) {
                doInsta = false;
            }

            if (e.keyCode == 84) {
                onetick = !onetick;
                acc(0);
            }

            if (e.keyCode == 0) {
                for (let i = 0; i < 5; i++) {
                    let angle = myPlayer.dir + toRad(i * 72);
                    place(millType, angle)
                }
            }
            if (e.keyCode == 0) {
                for (let i = 0; i < 4; i++) {
                    let angle = myPlayer.dir + toRad(i * 90);
                    place(wallType, angle)
                }
            }

            if (e.keyCode == 0) {
                for (let i = 0; i < 4; i++) {
                    let angle = myPlayer.dir + toRad(i * 90);
                    place(boostType, angle)
                }
            }

            if (e.keyCode == 89) {
                hat(20)
            }

            if (e.keyCode == 72) {
                hat(53)
            }

            if (e.keyCode == 66) {
                hat(7)
                acc(21)
            }

            if (e.keyCode == 16) {
                hat(6)
                acc(11)
            }

            if (e.keyCode == 76) {
                hat(31)
            }

            if (e.keyCode == 90) {
                hat(40)
                acc(21)
            }

            if (e.keyCode == 67) {
                if (spin == false) {
                    spin = true;
                } else {
                    spin = false;
                }
            }
        }
    }
})

document.addEventListener('keyup', (e) => {
    if (keyss[e.keyCode]) {
        keyss[e.keyCode] = 0;
        macros[e.key] = false;
        if (document.activeElement.id.toLowerCase() !== "chatbox") {

            if (e.keyCode == 123123) {
                setTimeout(() => {
                    doNewSend(["33", [null]]);
                    boostDir = null;
                }, 10);
            }
            if (e.keyCode == 123123) {
                setTimeout(() => {
                    doNewSend(["33"]);
                }, 1);
            }
            if (e.keyCode == 219) {
                setTimeout(() => {
                    doNewSend(["33"]);
                }, 1);
            }
            if (e.keyCode == 123213) {
                setTimeout(() => {
                    doNewSend(["33"]);
                }, 1);
            }
            if (e.keyCode == 1232131231231231231232131503123121213215021213) {
                setTimeout(() => {
                    doNewSend(["33", [null]]);
                    boostDir = null;
                }, 10);
            }
        }
    }
})
//yes shared by zynq
function isElementVisible(e) {
    return (e.offsetParent !== null);
}

function toRad(angle) {
    return angle * 0.01745329251;
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

    for (let i = 33; i < 36; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            turretType = i - 16;
        }
    }

    for (let i = 36; i < 37; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            spawnpadType = i - 16;
        }
    }

    for (let i = 37; i < 39; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            turretType = i - 16;
        }
    }
}
window.onload = function () {
    document.getElementById("diedText").innerHTML = "YOU DIED";
    document.getElementById("diedText").style.color = "#FFFFFF";
    document.getElementById("gameName").innerHTML = "MOOMOO.IO";
    document.getElementById("gameName").style.color = "#FFFFFF";
}
