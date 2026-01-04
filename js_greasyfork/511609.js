// ==UserScript==
// @name         SaVeGe Mod (1.2.0)
// @namespace    SaVeGeS
// @version      v1.2.0
// @description  Public mod for MooMoo.io
// @author       SaVeGe
// @match        http*://*.moomoo.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @require      https://update.greasyfork.org/scripts/423602/1005014/msgpack.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511609/SaVeGe%20Mod%20%28120%29.user.js
// @updateURL https://update.greasyfork.org/scripts/511609/SaVeGe%20Mod%20%28120%29.meta.js
// ==/UserScript==

/*
== - Mod Versions - ==
^^^^^^^^^^^^^^^^^^^^^^

1.0.0 - WS Sender & WS Receiver
1.1.0 - Auto heal & item types and enemy objects, my player objects 
1.2.0 - A lot more stuff (lazy to write down)
*/

/** VARIABLES **/
let { io, config, msgpack, jQuery: $ } = window;
let gameCanvas = document.getElementById("gameCanvas");
let mouseX, mouseY, width = innerWidth, height = innerHeight;
let moveKeys = { w: false, a: false, s: false, d: false };
let myPlayer = {
    id: null, x: null, y: null, dir: null, object: null, weapon: null, clan: null,
    isLeader: null, hat: null, accessory: null, isSkull: null, maxHealth: 100,
    currentHealth: 100, hitTime: 0, bTick: 0, inGame: false
};
let locked = false, gameTick = 0, enemy = [], ws = null, mainContext;
let players = [], nearestEnemy, enemyAngle, isEnemyNear;
let primary, secondary, foodType, wallType, spikeType, millType, mineType, boostType, spawnpadType, turretType, haveMine;
WebSocket.prototype.oldSend = WebSocket.prototype.send;

/** SEND PACKET **/
let sendPacket = (...data) => io.send(...data);

/** STORE FUNCTIONS **/
let storeBuy = (id, index) => sendPacket('c', 1, id, index);
let storeEquip = (id, index) => sendPacket('c', 0, id, index);

/** CHAT **/
let sendChat = message => sendPacket('6', message);

/** AUTO GATHER **/
let autoGather = () => sendPacket('K', 1, 1);

/** REQUEST ANIMATION FRAME **/
let requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || (callback => setTimeout(callback, 1000 / 60));

/** HANDLE MESSAGE **/
let handleMessage = (stuff) => {
    let decodedData = msgpack.decode(new Uint8Array(stuff.data));

    let data = Array.isArray(decodedData) && decodedData.length > 1 ? [decodedData[0], ...decodedData[1]] : decodedData;

    if (!data) return;

    let dataType = data[0];

    if (dataType === "io-init") setupCanvas();
    if (dataType === "C" && myPlayer.id == null) {
        myPlayer.id = data[1];
        myPlayer.inGame = true;
    }
    if (dataType == "D" && data[2]) {
        secondary = null;
        primary = 0;
        foodType = 0;
        wallType = 3;
        spikeType = 6;
        millType = 10;
        spawnpadType = 36;
    }
    if (dataType == "V") {
        if (data[2] == 1) {
            primary = data[1][0];
            secondary = data[1][1] ?? null;
        } else {
            foodType = data[1][0];
            wallType = data[1][1];
            spikeType = data[1][2];
            millType = data[1][3];
            boostType = data[1][4] ?? -1;
            haveMine = data[1][5] == 13 || data[1][4] == 14;
            if (haveMine) {
                mineType = data[1][5];
            }
            turretType = data[1][5 + (haveMine ? 1 : 0)];
        }
    }
    if (dataType == "a") updatePlayers(data);
    if (dataType === "P") myPlayer.inGame = false;
    if (dataType == "O" && data[1] == myPlayer.id) {
        let playerID = data[1];
        let health = data[2];
        updateHealth(health, playerID);
    }
};

/** UPDATE HEALTH **/
let updateHealth = (health, playerID) => {
    if (myPlayer.id == playerID) {
        let damage = 100 - myPlayer.health;
        if (damage >= 35) {
            setTimeout(() => {
                place(foodType, null);
                sendChat("SaVeGe: Damage Healing");
            }, 120);
        } else {
            setTimeout(() => {
                place(foodType, null);
                sendChat("SaVeGe: Damage Healing");
            }, 150);
        }
    }
};

/** PLACE **/
let place = (id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) => {
    if (typeof id !== "number" || id == -1) return;
    sendPacket("G", id, null);
    sendPacket("d", 1, angle);
    sendPacket("d", 0, angle);
    sendPacket("G", myPlayer.weapon, true);
}

/** UPDATE PLAYERS **/
let updatePlayers = data => {
    enemy = [];
    players = [];
    for (let i = 0; i < data[1].length / 13; i++) {
        let playerInfo = data[1].slice(13 * i, 13 * i + 13);

        players.push(playerInfo);
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
        } else if (
            playerInfo[7] != myPlayer.clan ||
            playerInfo[7] === null
        ) {
            enemy.push(playerInfo);
        }
    }

    // Some stuff xd
    if (enemy) {
        nearestEnemy = enemy.sort(
            (a, b) => dist(a, myPlayer) - dist(b, myPlayer)
        )[0];
        enemyAngle = nearestEnemy ? Math.atan2(nearestEnemy[2] - myPlayer.y, nearestEnemy[1] - myPlayer.x) : (myPlayer?.dir ?? 0)
        isEnemyNear = nearestEnemy && Math.sqrt(Math.pow(myPlayer.y - nearestEnemy[2], 2) + Math.pow(myPlayer.x - nearestEnemy[1], 2)) < 300
    }
}

/** CALCULATE DISTANCE **/
let dist = (a, b) => {
    return Math.sqrt(Math.pow(b.y - a[2], 2) + Math.pow(b.x - a[1], 2));
}

/** SETUP CANVAS **/
let setupCanvas = () => {
    width = gameCanvas.clientWidth;
    height = gameCanvas.clientHeight;
    $(window).resize(() => {
        width = gameCanvas.clientWidth;
        height = gameCanvas.clientHeight;
    });
    gameCanvas.addEventListener("mousemove", ({ clientX, clientY }) => {
        mouseX = clientX;
        mouseY = clientY;
    });
    mainContext = gameCanvas?.getContext("2d");
};

/** HIT **/
let hit = () => {
    sendPacket("d", 1, enemyAngle);
    sendPacket("d", 0);
}

/** SOCKET **/
WebSocket.prototype.send = function (stuff) {
    if (!ws) {
        document.ws = this;
        ws = this;
        socketFound(this);
    }

    if (stuff instanceof Uint8Array || stuff instanceof ArrayBuffer) {
        this.oldSend(stuff);
    } else {
        this.oldSend(new Uint8Array(msgpack.encode(stuff)));
    }
};

/** SOCKET CONNECTION **/
let socketFound = stuff => {
    stuff.addEventListener("message", handleMessage);
    gameCanvas.addEventListener("mousemove", ({ x, y }) => {
        mouseX = x;
        mouseY = y;
    });
    window.addEventListener("resize", () => {
        height = innerHeight;
        width = innerWidth;
    });
    mainContext = gameCanvas?.getContext("2d");
};

/** MOVEMENT **/
let moveEz = (key, isKeyDown) => {
    moveKeys[key] = isKeyDown;
    if ((moveKeys.w || moveKeys.a || moveKeys.s || moveKeys.d) && !locked) {
        storeEquip(50, 0);
        locked = true;
    }
    if (!moveKeys.w && !moveKeys.a && !moveKeys.s && !moveKeys.d && locked) {
        storeEquip(51, 0);
        locked = false;
    }
};

/** INSTA KILL **/
let instaKill = (...instaType) => {
    let type = instaType[0];

    switch (type) {
        case "normal":
            sendChat("SaVeGe: Normal InstaKill");
            hit();
            break;

        case "reverse":
            sendChat("SaVeGe: Reverse InstaKill");

            break;

        case "reloadBased":
            sendChat("SaVeGe: Reload Based InstaKill");

            break;

        default:
            sendChat("SaVeGe: Invalid InstaKill Type");
            break;
    }
};

/** KEY EVENTS **/
document.addEventListener('keydown', ({ key }) => {
    if (key in moveKeys) moveEz(key, true);
    if (key === "r") instaKill("normal");
});

document.addEventListener('keyup', ({ key }) => {
    if (key in moveKeys) moveEz(key, false);
});