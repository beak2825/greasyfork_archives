// ==UserScript==
// @name         4 bots damian
// @namespace    -
// @version      1.5
// @description  For more info about 4x multibox go my channel https://youtube.com/CyRuler
// @author        Discord : CyRuler#3691
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @icon         https://cdn.discordapp.com/attachments/759868693840003072/762661498178109450/lightcg.jpg
// @require https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @downloadURL https://update.greasyfork.org/scripts/457491/4%20bots%20damian.user.js
// @updateURL https://update.greasyfork.org/scripts/457491/4%20bots%20damian.meta.js
// ==/UserScript==

let healToggle = true;
let hatToggle = true;
let empToggle = false;

let ws;
let cvs;
let width;
let height;
let mouseX;
let mouseY;
let dir;

let primary;
let secondary;
let foodType;
let wallType;
let spikeType;
let millType;
let mineType;
let boostType;
let turretType;
let spawnpadType;

let healer;
let spiker;
let trapper;
let miller;
let crashing;
let playerFollowerGlobal;
let ffs;
let ffsps;
sockets = {};
let closed;
let myPlayer = {};
let pointer = true;
let pointingOnPosition = {};
let enemiesNear;
let players = {};
let isEnemyNear;
let nearestEnemy;
let nearestEnemyAngle;
let autoaim = false;
let autoAttackWithAim3 = false;
let autoInsta;
let JustDied;
let normalHat;
let normalAcc;
let oldHat;
let oldAcc;

let msgpack5 = msgpack;
document.msgpack = msgpack;

let autoAttack;
let freeze;
function dist(a, b){
    return Math.sqrt( Math.pow((b.y-a[2]), 2) + Math.pow((b.x-a[1]), 2) );
}
function acc(id) {
    doNewSend(["13c", [1, id, 1]]);
    doNewSend(["13c", [0, 0, 1]]);
    doNewSend(["13c", [0, id, 1]]);
}

function hat(id) {
    doNewSend(["13c", [1, id, 0]]);
    doNewSend(["13c", [0, id, 0]]);
}
let handleMessage = function(e) {
    let temp = msgpack5.decode(new Uint8Array(e.data));
    let data = null;
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
    if (item == "io-init") {
        cvs = document.getElementById("gameCanvas");
        setTimeout(() => { if (document.getElementById("mainMenu")) { document.getElementById("mainMenu").remove(); } }, 5000);
        width = cvs.clientWidth;
        height = cvs.clientHeight;
        $(window).resize(function() {
            width = cvs.clientWidth;
            height = cvs.clientHeight;
        });
        let place = (e, t = dir) => {
            doNewSend(['5', [e, null]]);
            doNewSend(['c', [1, t]]);
            doNewSend(['c', [0, t]]);
            doNewSend(['5', [null]]);
        }
        let placeForAll = (e, t = dir) => {
            sendForAll(['5', [e, null]]);
            sendForAll(['c', [1, t]]);
            sendForAll(['c', [0, t]]);
            sendForAll(['5', [null]]);
        }
        cvs.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dir = Math.atan2(event.clientY - height / 2, event.clientX - width / 2);
            if (!autoaim) {
                sendForAll(['2', [dir]]);
            }
        })
        document.key22 = 1;
        document.addEventListener('keydown', e => {
            if (document.key22 !== e.keyCode) {
                document.key22 = e.keyCode;
                if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea" && !document.getElementById('chatHolder').offsetParent) {
                    if (e.keyCode == 81) {
                        healer = true;
                    }
                    if (e.keyCode == 86) {
                        spiker = true;
                    }
                    if (e.keyCode == 70) {
                        trapper = true;
                    }
                    if (e.keyCode == 54) {
                        miller = true;
                    }
                    if (e.keyCode == 0) {
                        healToggle = !healToggle;
                    }
                    if (e.keyCode == 39) {
                        hatToggle = !hatToggle;
                    }
                    if (e.keyCode == 40) {
                        empToggle = !empToggle;
                    }
                    if (e.keyCode == 80) {
                        pointer = !pointer;
                    }
                    if (e.keyCode == 84) {
                        autoaim = true;
                        doNewSend(["13c", [1, 6, 0]]);
                        doNewSend(["13c", [1, 7, 0]]);
                        doNewSend(["13c", [1, 53, 0]]);
                        autoAttackWithAim3 = true;
                        doNewSend(['c', [1]])
                        doNewSend(["6", [5]]);
                        doNewSend(["6", [17]]);
                        doNewSend(["6", [31]]);
                        doNewSend(["6", [23]]);
                        doNewSend(["6", [9]]);
                        doNewSend(["6", [18]]);
                        doNewSend(['5', [9, true]]);
                        doNewSend(["13c", [0, 53, 0]]);
                        setTimeout(() => {
                            doNewSend(['6', [12]]);
                        }, 130);
                        setTimeout(() => {
                            doNewSend(['6', [15]])
                            doNewSend(['5', [secondary, true]]);
                            setTimeout(() => {
                                sendForAll(['5', [primary, true]])
                                if (!empToggle) {
                                    doNewSend(["13c", [1, 6, 0]]);
                                    doNewSend(["13c", [0, 6, 0]]);
                                }
                                if (empToggle) {
                                    doNewSend(["13c", [1, 22, 0]]);
                                    doNewSend(["13c", [0, 22, 0]]);
                                }
                                autoaim = false;
                                autoAttackWithAim3 = false;
                                doNewSend(['c', [0]])
                                doNewSend(["2", [dir]]);
                            }, 270);
                        }, 210);
                    }
                    if (e.keyCode == 0) {
                        for (let i=0;i<180;i++) {
                            let angle = toRad(i*2);
                            place(boostType, angle);
                        }
                    }
                    if (e.keyCode == 0) {
                        for (let i=0;i<4;i++) {
                            let angle = toRad(i * 90);
                            place(spikeType, angle);
                        }
                    }
                    if (e.keyCode == 77) {
                        if (myPlayer.y < 2400) {
                            doNewSend(["13c", [1, 15, 0]]);
                            doNewSend(["13c", [0, 15, 0]]);
                        } else if (myPlayer.y > 6850 && myPlayer.y < 7550) {
                            doNewSend(["13c", [1, 31, 0]]);
                            doNewSend(["13c", [0, 31, 0]]);
                        } else {
                            doNewSend(["13c", [1, 12, 0]]);
                            doNewSend(["13c", [0, 12, 0]]);
                        }
                        doNewSend(["13c", [1, 0, 1]]);
                        doNewSend(["13c", [0, 0, 1]]);
                    }
                    if (e.keyCode == 37) {
                        sendForAll(["6", [8]]);
                        sendForAll(["6", [3]]);
                        sendForAll(["6", [5]]);
                    }
                    if(e.keyCode == 39) {
                        sendForAll(["6", [8]]);
                        sendForAll(["6", [4]]);
                        sendForAll(["6", [5]]);
                        sendForAll(["6", [10]]);
                        sendForAll(["6", [28]]);
                        sendForAll(["6", [10]]);
                    }
                    if(e.keyCode == 16) {
                        sendForAll(["13c", [0, 0, 0]]);
                        sendForAll(["13c", [0, 0, 1]]);
                    }
                    if (e.keyCode == 38) {
                        sendForAll(["6", [5]]);
                        sendForAll(["6", [17]]);
                        sendForAll(["6", [31]]);
                        sendForAll(["6", [23]]);
                        sendForAll(["6", [13]]);
                        sendForAll(["6", [18]]);
                        sendForAll(["6", [28]]);
                    }
                    if (e.keyCode == 120) {
                        sendForAll(["6", [4]]);
                        sendForAll(["6", [15]]);
                    }
                    if (e.keyCode == 90) {
                        sendForAll(["13c", [0, 0, 1]]);
                        sendForAll(["13c", [1, 40, 0]]);
                        sendForAll(["13c", [0, 40, 0]]);
                    }
                    if (e.keyCode == 32) {
                        if (!empToggle) {
                        sendForAll(["13c", [0, 0, 1]]);
                            sendForAll(["13c", [1, 6, 0]]);
                            sendForAll(["13c", [0, 6, 0]]);
                        }
                        if (empToggle) {
                            sendForAll(["13c", [1, 22, 0]]);
                            sendForAll(["13c", [0, 22, 0]]);
                        }
                    }
                    if (e.keyCode == 66) {
                        sendForAll(["13c", [0, 0, 1]]);
                        sendForAll(["13c", [1, 7, 0]]);
                        sendForAll(["13c", [0, 7, 0]]);
                    }
                    if (e.keyCode == 45) {
                        doNewSend(["13c", [1, 6, 0]]);
                        doNewSend(["13c", [1, 7, 0]]);
                        doNewSend(["13c", [1, 53, 0]]);
                        autoInsta = true;
                    }
                    if (e.keyCode == 46) {
                        autoInsta = false;
                    }
                    if (e.keyCode == 85) {
                        sendForAll(["13c", [1, 20, 0]]);
                        sendForAll(["13c", [0, 20, 0]]);
                    }
                    if (e.keyCode == 114) {
                        sendForAll(["6", [28]]);
                    }
                    if (e.keyCode == 115) {
                        sendForAll(["6", [4]]);
                        sendForAll(["6", [25]]);
                    }
                }
            }
        })
        document.addEventListener('keyup', e => {
            document.key22 = null;
            if (e.keyCode == 81) {
                healer = false;
            }
            if (e.keyCode == 86) {
                spiker = false;
            }
            if (e.keyCode == 70) {
                trapper = false;
            }
            if (e.keyCode == 54) {
                miller = false;
            }
        })
        setInterval(() => {
            if (autoaim) {
                doNewSend(['2', [nearestEnemyAngle]]);
            }
            if (autoAttackWithAim3) {
                doNewSend(['c', [1]]);
            }
            if (crashing && !closed) {
                for (let e = 0; e < 1000; e++) {
                    let result = new Uint8Array(Math.round(Math.random() * 18));for (let i = 0; i < result.length; i++) {if (i == 0) {result[i] = Math.round(Math.random() * 256);} else {if (i == 1) {result[i] = Math.round(Math.random() * 256);} else {if (i == 2) {result[i] = Math.round(Math.random() * 128);} else {if (i == 3) {result[i] = Math.round(Math.random() * 85);} else {if (i == 4) {result[i] = Math.round(Math.random() * 64);} else {if (i == 5) {result[i] = Math.round(Math.random() * 51);} else {if (i == 6) {result[i] = Math.round(Math.random() * 42);} else {if (i == 7) {result[i] = Math.round(Math.random() * 36);} else {if (i == 8) {result[i] = Math.round(Math.random() * 32);} else {if (i == 9) {result[i] = Math.round(Math.random() * 28);} else {if (i == 10) {result[i] = Math.round(Math.random() * 25);} else {if (i == 11) {result[i] = Math.round(Math.random() * 23);} else {if (i == 12) {result[i] = Math.round(Math.random() * 21);} else {if (i == 13) {result[i] = Math.round(Math.random() * 19);} else {if (i == 14) {result[i] = Math.round(Math.random() * 18);} else {if (i == 15) {result[i] = Math.round(Math.random() * 17);} else {if (i == 16) {result[i] = Math.round(Math.random() * 16);} else {if (i == 17) {result[i] = Math.round(Math.random() * 15);}}}}}}}}}}}}}}}}}}}ws.oldSend(result);
                }
            }
            if (healer) {
                place(foodType, null);
            }
            if (spiker) {
                place(spikeType, null);
            }
            if (trapper) {
                place(boostType, null);
            }
            if (miller) {
                place(millType, null);
            }
        })
        primary = 0;
        foodType = 0;
        wallType = 3;
        spikeType = 6;
        millType = 10;
        myPlayer.weapon = 0;
        doNewSend(['sp', [{name: localStorage.moo_name, moofoll: "1", skin: 1}]]);
        setTimeout(() => {
            document.gr = grecaptcha;
            let kk;
            let host = "127.0.0.1" !== location.hostname && !location.hostname.startsWith("192.168.");
            for (let i2 = 0; i2 < 4; i2++) {
                true && (kk = !0, host ? document.gr.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", { action: "homepage" }).then((function(e) {
                    wsType(`${document.ws.url.split("&")[0]}&token=${encodeURIComponent(e)}`);
                })) : null);
            }
        }, 100);
    }
    if (item == "1" && !myPlayer.id) {
        myPlayer.id = data[1];
    }
    if (item == "11") {
        primary = 0;
        foodType = 0;
        wallType = 3;
        spikeType = 6;
        millType = 10;
        if (!autoAttack && !freeze) {
            doNewSend(['sp', [{name: localStorage.moo_name, moofoll: "1", skin: 1}]]);
        } else {
            JustDied = true;
        }
    }
    if (JustDied) {
        if (!autoAttack && !freeze) {
            JustDied = false;
            doNewSend(['sp', [{name: localStorage.moo_name, moofoll: "1", skin: 1}]]);
        }
    }
    if (item == "33") {
        enemiesNear = [];
        players = {};
        for(let i = 0; i < data[1].length / 13; i++) {
            let playerInfo = data[1].slice(13*i, 13*i+13);
            if(playerInfo[0] == myPlayer.id) {
                myPlayer.x = playerInfo[1];
                myPlayer.y = playerInfo[2];
                myPlayer.dir = playerInfo[3];
                myPlayer.object = playerInfo[4];
                myPlayer.clan = playerInfo[7];
                myPlayer.isLeader = playerInfo[8];
                myPlayer.hat = playerInfo[9];
                myPlayer.accessory = playerInfo[10];
                myPlayer.isSkull = playerInfo[11];
            } else if(playerInfo[7] !== myPlayer.clan || playerInfo[7] === null) {
                enemiesNear.push(playerInfo);
            }
            players[playerInfo[0]] = {
                id: playerInfo[0],
                x: playerInfo[1],
                y: playerInfo[2],
                dir: playerInfo[3],
                object: playerInfo[4],
                weapon: playerInfo[5],
                clan: playerInfo[7],
                isLeader: playerInfo[8],
                hat: playerInfo[9],
                accessory: playerInfo[10],
                isSkull: playerInfo[11]
            };
        }
    }
    isEnemyNear = false;
    if(enemiesNear) {
        nearestEnemy = enemiesNear.sort((a,b) => dist(a, myPlayer) - dist(b, myPlayer))[0];
    }
    if(nearestEnemy) {
        nearestEnemyAngle = Math.atan2(nearestEnemy[2]-myPlayer.y, nearestEnemy[1]-myPlayer.x);
        if(Math.sqrt(Math.pow((myPlayer.y-nearestEnemy[2]), 2) + Math.pow((myPlayer.x-nearestEnemy[1]), 2)) < 500) {
            isEnemyNear = true;
            if(autoaim == false && myPlayer.hat != 7 && myPlayer.hat != 53) {
                normalHat = 6;
                if(primary != 8) {
                    normalAcc = 19;
                }
            };
        }
    }
    if(isEnemyNear == false && autoaim == false) {
        normalAcc = 0;
        if (myPlayer.y < 2400){
            normalHat = 15;
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
            normalHat = 31;
        } else {
            normalHat = 12;
        }
    }
    if(hatToggle) {
        if(oldHat != normalHat) {
            hat(normalHat);
        }
        if(oldAcc != normalAcc) {
            acc(normalAcc);
        }
        oldHat = normalHat;
        oldAcc = normalAcc
    }
    if (nearestEnemy && autoInsta) {
        if (Math.sqrt(Math.pow((myPlayer.y-nearestEnemy[2]), 2) + Math.pow((myPlayer.x-nearestEnemy[1]), 2)) < 215) {
            autoInsta = false;
            autoaim = true;
            doNewSend(['33', [nearestEnemyAngle]]);
            setTimeout(() => {
                doNewSend(['33', []]);
                doNewSend(['13c', [0, 11, 1]]);
            }, 300)
            doNewSend(['7', [1]]);
            if (myPlayer.weapon == 0) {
                doNewSend(["6", [5]]);
                doNewSend(["6", [17]]);
                doNewSend(["6", [31]]);
                doNewSend(["6", [23]]);
                doNewSend(["6", [10]]);
                doNewSend(["6", [18]]);
                doNewSend(["6", [28]]);
            }
            doNewSend(["6", [15]]);
            doNewSend(['13c', [0, 0, 1]])
            doNewSend(['13c', [0, 19, 1]])
            doNewSend(['13c', [0, 7, 0]])
            doNewSend(["5", [primary, 1]]);
            for (let i = 0; i < 25; i++) {
                doNewSend(['c', [1, nearestEnemyAngle]]);
            }
            setTimeout(() => {
                doNewSend(['13c', [0, 53, 0]]);
                doNewSend(["5", [15, 1]]);
                doNewSend(["5", [secondary, 1]]);
                setTimeout(() => {
                    autoaim = false;
                    doNewSend(["5", [primary, 1]]);
                    if (!empToggle) {
                        doNewSend(["13c", [1, 6, 0]]);
                        doNewSend(["13c", [0, 6, 0]]);
                    }
                    if (empToggle) {
                        doNewSend(["13c", [1, 22, 0]]);
                        doNewSend(["13c", [0, 22, 0]]);
                    }
                    doNewSend(['7', [1]]);
                    doNewSend(['c', [0]]);
                }, 270);
            }, 130);
        }
    }
    if (pointer) {
        pointingOnPosition = {x: myPlayer.x, y: myPlayer.y};
    }
    if (item == "17") {
        if (data[2]) {
            primary = data[1][0];
            secondary = data[1][1] || null;
        } else {
            for (let i = 0; i < data[1].length; i++) {
                for (let i2 = 0; i2 < 3; i2++) {
                    if (i2 == data[1][i]) {
                        foodType = data[1][i];
                    }
                }
                for (let i2 = 3; i2 < 6; i2++) {
                    if (i2 == data[1][i]) {
                        wallType = data[1][i];
                    }
                }
                for (let i2 = 6; i2 < 10; i2++) {
                    if (i2 == data[1][i]) {
                        spikeType = data[1][i];
                    }
                }
                for (let i2 = 10; i2 < 13; i2++) {
                    if (i2 == data[1][i]) {
                        millType = data[1][i];
                    }
                }
                for (let i2 = 13; i2 < 15; i2++) {
                    if (i2 == data[1][i]) {
                        mineType = data[1][i];
                    }
                }
                for (let i2 = 15; i2 < 17; i2++) {
                    if (i2 == data[1][i]) {
                        boostType = data[1][i];
                    }
                }
                for (let i2 = 17; i2 < 23; i2++) {
                    if (i2 == data[1][i] && i2 !== 20) {
                        turretType = data[1][i];
                    }
                }
                spawnpadType = 20;
            }
        }
    }
    if (item == "ch") {
        if ((data[2].toLocaleLowerCase()).split(' ')[0] == '!crash' && data[1] == myPlayer.id) {
            crashing = true;
        }
        if (data[2].toLocaleLowerCase() == '!come' && data[1] == myPlayer.id) {
            playerFollowerGlobal = true;
        }
        if (data[2].toLocaleLowerCase() == '!stop' && data[1] == myPlayer.id) {
            playerFollowerGlobal = false;
        }
        if (data[2].toLocaleLowerCase() == '!mousetrack' && data[1] == myPlayer.id) {
            ffs = true;
        }
        if (data[2].toLocaleLowerCase() == '!stopp' && data[1] == myPlayer.id) {
            ffs = false;
        }
        if (data[2].toLocaleLowerCase() == '!-' && data[1] == myPlayer.id) {
            setTimeout(() => {
                let kk;
                let host = "127.0.0.1" !== location.hostname && !location.hostname.startsWith("192.168.");
                for (let i2 = 0; i2 < 4; i2++) {
                    true && (kk = !0, host ? document.gr.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", { action: "homepage" }).then((function(e) {
                        wsType(`${document.ws.url.split("&")[0]}&token=${encodeURIComponent(e)}`);
                    })) : null);
                }
            }, 100);
        }
    }
    if(data[0] == "h" && data[1] == myPlayer.id) {
        if(data[2] < 90 && data[2] > 0) {
            if (healToggle) {
                setTimeout(() => {
                    doNewSend(['5', [foodType, null]]);
                    doNewSend(['c', [1]]);
                    doNewSend(['c', [0]]);
                    doNewSend(['5', [null]]);
                }, 100);
            }
        }
    }
}
function toRad(angle) {
    return angle * (Math.PI / 180);
}
let doNewSend = (e) => {
    ws.oldSend(new Uint8Array(Array.from(msgpack5.encode(e))));
}
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m) {
    if (!ws) {
        ws = this;
        document.ws = this;
        this.addEventListener('message', e => { handleMessage(e); });
        this.addEventListener('close', () => { closed = true; });
    }
    if (!closed) {
        if (msgpack5.decode(m)[0] !== "2" && msgpack5.decode(m)[0] !== "c" && msgpack5.decode(m)[0] !== "33" && msgpack5.decode(m)[0] !== "ch" && msgpack5.decode(m)[0] !== "6" && msgpack5.decode(m)[0] !== "5" && msgpack5.decode(m)[0] !== "13c" && msgpack5.decode(m)[0] !== "7") {
            this.oldSend(m);
        }
        if (msgpack5.decode(m)[0] == "c") {
            sendForAll(msgpack5.decode(m));
        }
        if (msgpack5.decode(m)[0] == "6") {
            sendForAll(msgpack5.decode(m));
        }
        if (msgpack5.decode(m)[0] == "5") {
            sendForAll(msgpack5.decode(m));
        }
        if (msgpack5.decode(m)[0] == "7") {
            if (msgpack5.decode(m)[1][0] == 1) {
                autoAttack = !autoAttack;
            }
            if (msgpack5.decode(m)[1][0] == 0) {
                freeze = !freeze;
            }
            sendForAll(msgpack5.decode(m));
        }
        if (msgpack5.decode(m)[0] == "ch") {
            this.oldSend(m);
            if (msgpack5.decode(m)[1][0].toLocaleLowerCase() !== '!f' && msgpack5.decode(m)[1][0].toLocaleLowerCase() !== '!fs' && msgpack5.decode(m)[1][0].toLocaleLowerCase().split(" ")[0] !== '!join' && msgpack5.decode(m)[1][0].toLocaleLowerCase().split(" ")[0] !== '!leave' && msgpack5.decode(m)[1][0].toLocaleLowerCase().split(" ")[0] !== '!crash') {
                for (let i in sockets) {
                    sockets[i].oldSend(m);
                }
            }
        }
        if (msgpack5.decode(m)[0] == "13c") {
            sendForAll(msgpack5.decode(m));
        }
        if (msgpack5.decode(m)[0] == "33") {
            this.oldSend(m);
            for (let i in sockets) {
                if (!sockets[i].playerFollower && !playerFollowerGlobal && !ffs) {
                    sockets[i].oldSend(m);
                }
            }
        }
    }
}
let sendForAll = (e) => {
    doNewSend(e);
    for (let i in sockets) {
        sockets[i].oldSend(new Uint8Array(Array.from(msgpack5.encode(e))));
    }
};

function wsType(e) {
    let ws = new WebSocket(e);
    ws.playerFollower = true;
    ws.autoAttackWithAim3;
    let bot = {};
    ws.binaryType = "arraybuffer";
    let doNewSend = (e) => {
        ws.oldSend(new Uint8Array(Array.from(msgpack5.encode(e))));
    }
    let msgFnc = (e) => {
        let temp = msgpack5.decode(new Uint8Array(e.data));
        let data = null;
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
        if (item == "io-init") {
            let place = (e, t = dir) => {
                doNewSend(['5', [e, null]]);
                doNewSend(['c', [1, t]]);
                doNewSend(['c', [0, t]]);
                doNewSend(['5', [null]]);
            }
            ws.key23 = null;
            document.addEventListener('keydown', e => {
                if (ws.key23 !== e.keyCode) {
                    ws.key23 = e.keyCode;
                    if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea" && !document.getElementById('chatHolder').offsetParent) {
                        if (e.keyCode == 84) {
                            ws.autoaim = true;
                            doNewSend(["13c", [1, 6, 0]]);
                            doNewSend(["13c", [1, 7, 0]]);
                            doNewSend(["13c", [1, 53, 0]]);
                            doNewSend(["13c", [1, 21, 0]]);
                            ws.autoAttackWithAim3 = true;
                            doNewSend(['c', [1]])
                            doNewSend(["6", [5]]);
                            doNewSend(["6", [17]]);
                            doNewSend(["6", [31]]);
                            doNewSend(["6", [23]]);
                            doNewSend(["6", [9]]);
                            doNewSend(["6", [18]]);
                            doNewSend(['5', [9, true]]);
                            doNewSend(["13c", [0, 53, 0]]);
                            setTimeout(() => {
                                doNewSend(['6', [12]]);
                            }, 130);
                            setTimeout(() => {
                                doNewSend(['6', [15]])
                                doNewSend(['5', [secondary, true]]);
                                setTimeout(() => {
                                    sendForAll(['5', [primary, true]])
                                    if (!empToggle) {
                                        doNewSend(["13c", [1, 6, 0]]);
                                        doNewSend(["13c", [0, 6, 0]]);
                                    }
                                    if (empToggle) {
                                        doNewSend(["13c", [1, 22, 0]]);
                                        doNewSend(["13c", [0, 22, 0]]);
                                    }
                                    ws.autoaim = false;
                                    ws.autoAttackWithAim3 = false;
                                    doNewSend(['c', [0]])
                                    doNewSend(["2", [dir]]);
                                }, 300);
                            }, 210);
                        }
                        if (e.keyCode == 79) {
                            for (let i=0;i<180;i++) {
                                let angle = toRad(i*2);
                                place(boostType, angle);
                            }
                        }
                        if (e.keyCode == 76) {
                            for (let i=0;i<4;i++) {
                                let angle = toRad(i * 90);
                                place(spikeType, angle);
                            }
                        }
                        if (e.keyCode == 77) {
                            if (bot.y < 2400) {
                                doNewSend(["13c", [1, 15, 0]]);
                                doNewSend(["13c", [0, 15, 0]]);
                            } else if (bot.y > 6850 && bot.y < 7550) {
                                doNewSend(["13c", [1, 31, 0]]);
                                doNewSend(["13c", [0, 31, 0]]);
                            } else {
                                doNewSend(["13c", [1, 12, 0]]);
                                doNewSend(["13c", [0, 12, 0]]);
                            }
                            doNewSend(["13c", [1, 11, 1]]);
                            doNewSend(["13c", [0, 11, 1]]);
                        }
                        if (e.keyCode == 45) {
doNewSend(['ch', ['Autoinsta:true']]);
                            doNewSend(["13c", [1, 6, 0]]);
                            doNewSend(["13c", [1, 7, 0]]);
                            doNewSend(["13c", [1, 53, 0]]);
                            ws.autoInsta = true;
                        }
                        if (e.keyCode == 46) {
doNewSend(['ch', ['Autoinsta:false']]);
                            ws.autoInsta = false;
                        }
                    }
                }
            })
            document.addEventListener('keyup', e => {
                ws.key23 = null;
            })
            setInterval(() => {
                if (ws.autoaim) {
                    doNewSend(['2', [ws.nearestEnemyAngle]]);
                }
                if (ws.autoAttackWithAim3) {
                    doNewSend(['c', [1]]);
                }
                if (healer) {
                    place(ws.foodType, null);
                }
                if (spiker) {
                    place(ws.spikeType, null);
                }
                if (trapper) {
                    place(ws.boostType, null);
                }
                if (miller) {
                     place(ws.millType, null);
                }
            })
            ws.primary = 0;
            ws.foodType = 0;
            ws.wallType = 3;
            ws.spikeType = 6;
            ws.millType = 10;
            doNewSend(['sp', [{name: localStorage.moo_name, moofoll: "Ur dad Has Small PeePee", skin: 1}]]);
        }
        if (item == "1" && !bot.id) {
            bot.id = data[1];
            if (sockets) {
                sockets[data[1]] = ws;
            }
        }
        if (item == "11") {
            ws.primary = 0;
            ws.foodType = 0;
            ws.wallType = 3;
            ws.spikeType = 6;
            ws.millType = 10;
            if (!autoAttack && !freeze) {
                doNewSend(['sp', [{name: localStorage.moo_name, moofoll: "acool", skin: 4}]]);
            } else {
                ws.JustDied = true;
            }
        }
        if (ws.JustDied) {
            if (!autoAttack && !freeze) {
                ws.JustDied = false;
                doNewSend(['sp', [{name: localStorage.moo_name, moofoll: "u GaY", skin: 3}]]);
            }
        }
        if (item == "33") {
            ws.enemiesNear = [];
            ws.players = {};
            for(let i = 0; i < data[1].length / 13; i++) {
                let playerInfo = data[1].slice(13*i, 13*i+13);
                if(playerInfo[0] == bot.id) {
                    bot.x = playerInfo[1];
                    bot.y = playerInfo[2];
                    bot.dir = playerInfo[3];
                    bot.object = playerInfo[4];
                    bot.weapon = playerInfo[5];
                    bot.clan = playerInfo[7];
                    bot.isLeader = playerInfo[8];
                    bot.hat = playerInfo[9];
                    bot.accessory = playerInfo[10];
                    bot.isSkull = playerInfo[11];
                } else if(playerInfo[7] !== bot.clan || playerInfo[7] === null) {
                    ws.enemiesNear.push(playerInfo);
                }
                ws.players[playerInfo[0]] = {
                    id: playerInfo[0],
                    x: playerInfo[1],
                    y: playerInfo[2],
                    dir: playerInfo[3],
                    object: playerInfo[4],
                    weapon: playerInfo[5],
                    clan: playerInfo[7],
                    isLeader: playerInfo[8],
                    hat: playerInfo[9],
                    accessory: playerInfo[10],
                    isSkull: playerInfo[11]
                };
            }
        }
        ws.isEnemyNear = false;
        if(ws.enemiesNear) {
            ws.nearestEnemy = ws.enemiesNear.sort((a,b) => dist(a, bot) - dist(b, bot))[0];
        }
        if(ws.nearestEnemy) {
            ws.nearestEnemyAngle = Math.atan2(ws.nearestEnemy[2]-bot.y, ws.nearestEnemy[1]-bot.x);
            if(Math.sqrt(Math.pow((bot.y-ws.nearestEnemy[2]), 2) + Math.pow((bot.x-ws.nearestEnemy[1]), 2)) < 500) {
                ws.isEnemyNear = true;
                if(!ws.autoaim && bot.hat != 7 && bot.hat != 53) {
                    ws.normalHat = 6;
                    if(ws.primary != 8) {
                        ws.normalAcc = 21;
                    }
                };
            }
        }
        if(!ws.isEnemyNear && !ws.autoaim) {
            ws.normalAcc = 11;
            if (bot.y < 2400){
                ws.normalHat = 15;
            } else if (bot.y > 6850 && bot.y < 7550){
                ws.normalHat = 31;
            } else {
                ws.normalHat = 12;
            }
        }
        if(hatToggle) {
            if(ws.oldHat != ws.normalHat) {
                doNewSend(['13c', [1, ws.normalHat, 0]]);
                doNewSend(['13c', [0, ws.normalHat, 0]]);
            }
            if(ws.oldAcc != ws.normalAcc) {
                doNewSend(['13c', [1, ws.normalAcc, 1]]);
                doNewSend(['13c', [0, ws.normalAcc, 1]]);
            }
            ws.oldHat = ws.normalHat;
            ws.oldAcc = ws.normalAcc;
        }
        if (ws.nearestEnemy && ws.autoInsta) {
            if (Math.sqrt(Math.pow((bot.y-ws.nearestEnemy[2]), 2) + Math.pow((bot.x-ws.nearestEnemy[1]), 2)) < 215) {
                ws.autoInsta = false;
                ws.autoaim = true;
                doNewSend(['33', [ws.nearestEnemyAngle]]);
                setTimeout(() => {
                    doNewSend(['33', []]);
                    doNewSend(['13c', [0, 11, 1]]);
                }, 300)
                doNewSend(['13c', [0, 0, 1]])
                doNewSend(['13c', [0, 19, 1]])
                doNewSend(['13c', [0, 7, 0]])
                doNewSend(["5", [ws.primary, 1]]);
                for (let i = 0; i < 25; i++) {
                    doNewSend(['c', [1, ws.nearestEnemyAngle]]);
                }
                setTimeout(() => {
                    doNewSend(['13c', [0, 53, 0]]);
                    doNewSend(["5", [ws.secondary, 1]]);
                    setTimeout(() => {
                        ws.autoaim = false;
                        doNewSend(["5", [ws.primary, 1]]);
                        if (!empToggle) {
                            doNewSend(["13c", [1, 6, 0]]);
                            doNewSend(["13c", [0, 6, 0]]);
                        }
                        if (empToggle) {
                            doNewSend(["13c", [1, 22, 0]]);
                            doNewSend(["13c", [0, 22, 0]]);
                        }
                        doNewSend(['7', [1]]);
                        doNewSend(['c', [0]]);
                    }, 270);
                }, 130);
            }
        }
        if (item == "17") {
            if (data[2]) {
                ws.primary = data[1][0];
                ws.secondary = data[1][1] || null;
            } else {
                for (let i = 0; i < data[1].length; i++) {
                    for (let i2 = 0; i2 < 3; i2++) {
                        if (i2 == data[1][i]) {
                            ws.foodType = data[1][i];
                        }
                    }
                    for (let i2 = 3; i2 < 6; i2++) {
                        if (i2 == data[1][i]) {
                            ws.wallType = data[1][i];
                        }
                    }
                    for (let i2 = 6; i2 < 10; i2++) {
                        if (i2 == data[1][i]) {
                            ws.spikeType = data[1][i];
                        }
                    }
                    for (let i2 = 10; i2 < 13; i2++) {
                        if (i2 == data[1][i]) {
                            ws.millType = data[1][i];
                        }
                    }
                    for (let i2 = 13; i2 < 15; i2++) {
                        if (i2 == data[1][i]) {
                            ws.mineType = data[1][i];
                        }
                    }
                    for (let i2 = 15; i2 < 17; i2++) {
                        if (i2 == data[1][i]) {
                            ws.boostType = data[1][i];
                        }
                    }
                    for (let i2 = 17; i2 < 23; i2++) {
                        if (i2 == data[1][i] && i2 !== 20) {
                            ws.turretType = data[1][i];
                        }
                    }
                    ws.spawnpadType = 20;
                }
            }
        }
        if (item == "ch") {
            let ch = data;
            if (ch[2].toLocaleLowerCase() == '!"' && ch[1] == myPlayer.id) {
                ws.playerFollower = true;
                doNewSend(['33', []]);
            }
            if (ch[2].toLocaleLowerCase() == '!*' && ch[1] == myPlayer.id) {
                ws.playerFollower = false;
                doNewSend(['33', []]);
            }
            if (ch[2].toLocaleLowerCase() == '!+' && ch[1] == myPlayer.id) {
                ws.playerFollower = false;
                doNewSend(['33', []]);
            }
            if ((ch[2].toLocaleLowerCase()).split(' ')[0] == '!join' && ch[1] == myPlayer.id) {
                doNewSend(['10', [ch[2].toLocaleLowerCase().split(' ')[1]]]);
            }
            if ((ch[2].toLocaleLowerCase()).split(' ')[0] == '!leave' && ch[1] == myPlayer.id) {
                doNewSend(['9', [null]]);
            }
        }
        if (item == "ac") {
            if (data[1].owner == myPlayer.id) {
                setTimeout(() => {
                    doNewSend(['10', [data[1].sid]]);
                }, 100);
            }
        }
        if (ws.playerFollower || playerFollowerGlobal) {
            if (Math.sqrt(Math.pow((bot.y - pointingOnPosition.y), 2) + Math.pow((bot.x - pointingOnPosition.x), 2)) < 105) {
                doNewSend(['33', []]);
            } else {
                doNewSend(['33', [Math.atan2(pointingOnPosition.y - bot.y, pointingOnPosition.x - bot.x)]]);
            }
        }
        if (ffs) {
            if (ffsps !== Math.atan2((myPlayer.y - bot.y) + mouseY - (height / 2), (myPlayer.x- bot.x) + mouseX - (width / 2))) {
                ffsps = Math.atan2((myPlayer.y - bot.y) + mouseY - (height / 2), (myPlayer.x- bot.x) + mouseX - (width / 2));
                if (!ws.autoaim) {
                    doNewSend(['2', [ffsps]]);
                }
                doNewSend(['33', [ffsps]]);
            }
        }
        if(data[0] == "h" && data[1] == bot.id) {
            if(data[2] < 90 && data[2] > 0) {
                setTimeout(() => {
                    doNewSend(['5', [ws.foodType, null]]);
                    doNewSend(['c', [1]]);
                    doNewSend(['c', [0]]);
                    doNewSend(['5', [null]]);
                }, 100)
            }
        }
    }
    ws.onmessage = (e) => {
        msgFnc(e);
    }
}