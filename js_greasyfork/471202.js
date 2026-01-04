// ==UserScript==
// @name        🎃WRX Client🎃 2v
// @version     2.4
// @description WRX Client (EN) (Visual interface) Hat Hotkeys (look at the code for hotkeys) and animated hats Num Lock 2 and Num Lock 8 Good luck! (RU) (Визуал интерфейс) шапки панель (чтобы узнать горячие клавиши посмотрите в коде) и анимированные шапки Num Lock 2 and Num Lock 8 Удачи!
// @author      Warw1x
// @match       *://moomoo.io/*
// @match       *://sandbox.moomoo.io/*
// @icon        https://moomoo.io/img/favicon.png?v=1
// @require     https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @license     MIT
// @grant       none
// @namespace https://greasyfork.org/users/1083173
// @downloadURL https://update.greasyfork.org/scripts/471202/%F0%9F%8E%83WRX%20Client%F0%9F%8E%83%202v.user.js
// @updateURL https://update.greasyfork.org/scripts/471202/%F0%9F%8E%83WRX%20Client%F0%9F%8E%83%202v.meta.js
// ==/UserScript==

function websocket(ws, actions) {
    window.WEBSOCKET = ws;
    ws.addEventListener("message", (message) => {
        let data = window.msgpack.decode(message.data);
        if(actions[data[0]]) {
            actions[data[0]].apply(null, data[1]);
        }
    });
}
var weapons = [{
    id: 0,
    type: 0,
    name: "tool hammer",
    desc: "tool for gathering all resources",
    src: "hammer_1",
    length: 140,
    width: 140,
    xOff: -3,
    yOff: 18,
    dmg: 25,
    range: 65,
    gather: 1,
    speed: 300
}, {
    id: 1,
    type: 0,
    age: 2,
    name: "hand axe",
    desc: "gathers resources at a higher rate",
    src: "axe_1",
    length: 140,
    width: 140,
    xOff: 3,
    yOff: 24,
    dmg: 30,
    spdMult: 1,
    range: 70,
    gather: 2,
    speed: 400
}, {
    id: 2,
    type: 0,
    age: 8,
    pre: 1,
    name: "great axe",
    desc: "deal more damage and gather more resources",
    src: "great_axe_1",
    length: 140,
    width: 140,
    xOff: -8,
    yOff: 25,
    dmg: 35,
    spdMult: 1,
    range: 75,
    gather: 4,
    speed: 400
}, {
    id: 3,
    type: 0,
    age: 2,
    name: "short sword",
    desc: "increased attack power but slower move speed",
    src: "sword_1",
    iPad: 1.3,
    length: 130,
    width: 210,
    xOff: -8,
    yOff: 46,
    dmg: 35,
    spdMult: 0.85,
    range: 110,
    gather: 1,
    speed: 300
}, {
    id: 4,
    type: 0,
    age: 8,
    pre: 3,
    name: "katana",
    desc: "greater range and damage",
    src: "samurai_1",
    iPad: 1.3,
    length: 130,
    width: 210,
    xOff: -8,
    yOff: 59,
    dmg: 40,
    spdMult: 0.8,
    range: 118,
    gather: 1,
    speed: 300
}, {
    id: 5,
    type: 0,
    age: 2,
    name: "polearm",
    desc: "long range melee weapon",
    src: "spear_1",
    iPad: 1.3,
    length: 130,
    width: 210,
    xOff: -8,
    yOff: 53,
    dmg: 45,
    knock: 0.2,
    spdMult: 0.82,
    range: 142,
    gather: 1,
    speed: 700
}, {
    id: 6,
    type: 0,
    age: 2,
    name: "bat",
    desc: "fast long range melee weapon",
    src: "bat_1",
    iPad: 1.3,
    length: 110,
    width: 180,
    xOff: -8,
    yOff: 53,
    dmg: 20,
    knock: 0.7,
    range: 110,
    gather: 1,
    speed: 300
}, {
    id: 7,
    type: 0,
    age: 2,
    name: "daggers",
    desc: "really fast short range weapon",
    src: "dagger_1",
    iPad: 0.8,
    length: 110,
    width: 110,
    xOff: 18,
    yOff: 0,
    dmg: 20,
    knock: 0.1,
    range: 65,
    gather: 1,
    hitSlow: 0.1,
    spdMult: 1.13,
    speed: 100
}, {
    id: 8,
    type: 0,
    age: 2,
    name: "stick",
    desc: "great for gathering but very weak",
    src: "stick_1",
    length: 140,
    width: 140,
    xOff: 3,
    yOff: 24,
    dmg: 1,
    spdMult: 1,
    range: 70,
    gather: 7,
    speed: 400
}, {
    id: 9,
    type: 1,
    age: 6,
    name: "hunting bow",
    desc: "bow used for ranged combat and hunting",
    src: "bow_1",
    req: ["wood", 4],
    length: 120,
    width: 120,
    xOff: -6,
    yOff: 0,
    dmg: 20,
    projectile: 0,
    spdMult: 0.75,
    speed: 600
}, {
    id: 10,
    type: 1,
    age: 6,
    name: "great hammer",
    desc: "hammer used for destroying structures",
    src: "great_hammer_1",
    length: 140,
    width: 140,
    xOff: -9,
    yOff: 25,
    dmg: 10,
    spdMult: 0.88,
    range: 75,
    sDmg: 7.5,
    gather: 1,
    speed: 400
}, {
    id: 11,
    type: 1,
    age: 6,
    name: "wooden shield",
    desc: "blocks projectiles and reduces melee damage",
    src: "shield_1",
    length: 120,
    width: 120,
    dmg: 0,
    shield: 0.2,
    speed: 1,
    xOff: 6,
    yOff: 0,
    spdMult: 0.7
}, {
    id: 12,
    type: 1,
    age: 8,
    pre: 9,
    name: "crossbow",
    desc: "deals more damage and has greater range",
    src: "crossbow_1",
    req: ["wood", 5],
    aboveHand: true,
    armS: 0.75,
    length: 120,
    width: 120,
    xOff: -4,
    yOff: 0,
    dmg: 35,
    projectile: 2,
    spdMult: 0.7,
    speed: 700
}, {
    id: 13,
    type: 1,
    age: 9,
    pre: 12,
    name: "repeater crossbow",
    desc: "high firerate crossbow with reduced damage",
    src: "crossbow_2",
    req: ["wood", 10],
    aboveHand: true,
    armS: 0.75,
    length: 120,
    width: 120,
    xOff: -4,
    yOff: 0,
    dmg: 30,
    projectile: 3,
    spdMult: 0.7,
    speed: 230
}, {
    id: 14,
    type: 1,
    age: 6,
    name: "mc grabby",
    desc: "steals resources from enemies",
    src: "grab_1",
    length: 130,
    width: 210,
    xOff: -8,
    yOff: 53,
    dmg: 0,
    steal: 250,
    knock: 0.2,
    spdMult: 1.05,
    range: 125,
    gather: 0,
    speed: 700
}, {
    id: 15,
    type: 1,
    age: 9,
    pre: 12,
    name: "musket",
    desc: "slow firerate but high damage and range",
    src: "musket_1",
    req: ["stone", 10],
    aboveHand: true,
    rec: 0.35,
    armS: 0.6,
    hndS: 0.3,
    hndD: 1.6,
    length: 205,
    width: 205,
    xOff: 25,
    yOff: 0,
    dmg: 50,
    projectile: 5,
    hideProjectile: true,
    spdMult: 0.6,
    speed: 1500
}];
var client = null;
class Player {
    constructor(id, sid) {
        this.id = id;
        this.sid = sid;
        this.tmpScore = 0;
        this.team = null;
        this.skinIndex = 0;
        this.tailIndex = 0;
        this.hitTime = 0;
        this.tails = {};
        this.skins = {};
        this.points = 0;
        this.dt = 0;
        this.hidden = false;
        this.itemCounts = {};
        this.isPlayer = true;
        this.pps = 0;
        this.moveDir = undefined;
        this.skinRot = 0;
        this.lastPing = 0;
        this.iconIndex = 0;
        this.skinColor = 0;
        this.spawn = function() {
            this.active = true;
            this.alive = true;
            this.lockMove = false;
            this.lockDir = false;
            this.minimapCounter = 0;
            this.chatCountdown = 0;
            this.shameCount = 0;
            this.shameTimer = 0;
            this.buildIndex = -1;
            this.weaponIndex = 0;
            this.maxXP = 300;
            this.XP = 0;
            this.age = 1;
            this.kills = 0;
            this.upgrAge = 2;
            this.upgradePoints = 0;
            this.zIndex = 0;
            this.slowMult = 1;
            this.dir = 0;
            this.maxHealth = 100;
            this.health = this.maxHealth;
            this.scale = 35;
            this.speed = 0.0016;
            this.items = [0, 3, 6, 10];
            this.weapons = [0];
            this.secondary = {
                reload: 1,
                id: 15,
                dmg: 50
            };
            this.primary = {
                reload: 1,
                dmg: 25,
                id: 0,
            };
            this.turret = 1;
        };
    }
}
var tick = 0;
var weaponVariants = [{
    id: 0,
    src: "",
    xp: 0,
    val: 1
}, {
    id: 1,
    src: "_g",
    xp: 3000,
    val: 1.1
}, {
    id: 2,
    src: "_d",
    xp: 7000,
    val: 1.18
}, {
    id: 3,
    src: "_r",
    poison: true,
    xp: 12000,
    val: 1.18
}];
function send(type) {
    var data = Array.prototype.slice.call(arguments, 1);
    var binary = window.msgpack.encode([type, data]);
    window.WEBSOCKET.send(binary);
}
var mySid = null;
var players = [], player = {};
function heal(damage) {
    let heal = player.items[0] == 0 ? 20 : player.items[0] == 1 ? 40 : 30;
    let amount = damage / heal;
    for(let i = 0; i < amount; i++) {
        if(player.skinIndex != 45) {
            send("5", player.items[0]);
            send("c", 1);
            send("c", 0);
            send("5", player.weaponIndex, true);
        }
    }
}
function findPlayer(sid) {
    for(let i = 0; i < players.length; i++) {
        if(players[i].sid == sid) {
            return players[i];
        }
    }
    return null;
}
var healingToggle = 1;
function healing(damage) {
    if(damage >= 40 && healingToggle === 1) {
        healingToggle = 0;
        heal(damage);
        setTimeout(() => {
            healingToggle = 1;
        }, 200);
    }else {
        setTimeout(() => {
            heal(damage);
        }, 120);
    }
}
var enemies = {
    all: [],
    nearest: [],
    canHit: [],
    angle: function() {
        return Math.atan2(this.nearest.y2 - player.y2, this.nearest.x2 - player.x2);
    }
};
function dist(a, b) {
    return Math.hypot(a.y2 - b.y2, a.x2 - b.x2);
}
var groups = [{
    id: 0,
    name: "food",
    layer: 0
}, {
    id: 1,
    name: "walls",
    place: true,
    limit: 30,
    layer: 0
}, {
    id: 2,
    name: "spikes",
    place: true,
    limit: 15,
    layer: 0
}, {
    id: 3,
    name: "mill",
    place: true,
    limit: 7,
    layer: 1
}, {
    id: 4,
    name: "mine",
    place: true,
    limit: 1,
    layer: 0
}, {
    id: 5,
    name: "trap",
    place: true,
    limit: 6,
    layer: -1
}, {
    id: 6,
    name: "booster",
    place: true,
    limit: 12,
    layer: -1
}, {
    id: 7,
    name: "turret",
    place: true,
    limit: 2,
    layer: 1
}, {
    id: 8,
    name: "watchtower",
    place: true,
    limit: 12,
    layer: 1
}, {
    id: 9,
    name: "buff",
    place: true,
    limit: 4,
    layer: -1
}, {
    id: 10,
    name: "spawn",
    place: true,
    limit: 1,
    layer: -1
}, {
    id: 11,
    name: "sapling",
    place: true,
    limit: 2,
    layer: 0
}, {
    id: 12,
    name: "blocker",
    place: true,
    limit: 3,
    layer: -1
}, {
    id: 13,
    name: "teleporter",
    place: true,
    limit: 2,
    layer: -1
}];
var list = [{
    group: groups[0],
    name: "apple",
    desc: "restores 20 health when consumed",
    req: ["food", 10],
    consume: function(doer) {
        return doer.changeHealth(20, doer);
    },
    scale: 22,
    holdOffset: 15
}, {
    age: 3,
    group: groups[0],
    name: "cookie",
    desc: "restores 40 health when consumed",
    req: ["food", 15],
    consume: function(doer) {
        return doer.changeHealth(40, doer);
    },
    scale: 27,
    holdOffset: 15
}, {
    age: 7,
    group: groups[0],
    name: "cheese",
    desc: "restores 30 health and another 50 over 5 seconds",
    req: ["food", 25],
    consume: function(doer) {
        if(doer.changeHealth(30, doer) || doer.health < 100) {
            doer.dmgOverTime.dmg = -10;
            doer.dmgOverTime.doer = doer;
            doer.dmgOverTime.time = 5;
            return true;
        }
        return false;
    },
    scale: 27,
    holdOffset: 15
}, {
    group: groups[1],
    name: "wood wall",
    desc: "provides protection for your village",
    req: ["wood", 10],
    projDmg: true,
    health: 380,
    scale: 50,
    holdOffset: 20,
    placeOffset: -5
}, {
    age: 3,
    group: groups[1],
    name: "stone wall",
    desc: "provides improved protection for your village",
    req: ["stone", 25],
    health: 900,
    scale: 50,
    holdOffset: 20,
    placeOffset: -5
}, {
    age: 7,
    pre: 1,
    group: groups[1],
    name: "castle wall",
    desc: "provides powerful protection for your village",
    req: ["stone", 35],
    health: 1500,
    scale: 52,
    holdOffset: 20,
    placeOffset: -5
}, {
    group: groups[2],
    name: "spikes",
    desc: "damages enemies when they touch them",
    req: ["wood", 20, "stone", 5],
    health: 400,
    dmg: 20,
    scale: 49,
    spritePadding: -23,
    holdOffset: 8,
    placeOffset: -5
}, {
    age: 5,
    group: groups[2],
    name: "greater spikes",
    desc: "damages enemies when they touch them",
    req: ["wood", 30, "stone", 10],
    health: 500,
    dmg: 35,
    scale: 52,
    spritePadding: -23,
    holdOffset: 8,
    placeOffset: -5
}, {
    age: 9,
    pre: 1,
    group: groups[2],
    name: "poison spikes",
    desc: "poisons enemies when they touch them",
    req: ["wood", 35, "stone", 15],
    health: 600,
    dmg: 30,
    pDmg: 5,
    scale: 52,
    spritePadding: -23,
    holdOffset: 8,
    placeOffset: -5
}, {
    age: 9,
    pre: 2,
    group: groups[2],
    name: "spinning spikes",
    desc: "damages enemies when they touch them",
    req: ["wood", 30, "stone", 20],
    health: 500,
    dmg: 45,
    turnSpeed: 0.003,
    scale: 52,
    spritePadding: -23,
    holdOffset: 8,
    placeOffset: -5
}, {
    group: groups[3],
    name: "windmill",
    desc: "generates gold over time",
    req: ["wood", 50, "stone", 10],
    health: 400,
    pps: 1,
    turnSpeed: 0,
    spritePadding: 25,
    iconLineMult: 12,
    scale: 45,
    holdOffset: 20,
    placeOffset: 5
}, {
    age: 5,
    pre: 1,
    group: groups[3],
    name: "faster windmill",
    desc: "generates more gold over time",
    req: ["wood", 60, "stone", 20],
    health: 500,
    pps: 1.5,
    turnSpeed: 0,
    spritePadding: 25,
    iconLineMult: 12,
    scale: 47,
    holdOffset: 20,
    placeOffset: 5
}, {
    age: 8,
    pre: 1,
    group: groups[3],
    name: "power mill",
    desc: "generates more gold over time",
    req: ["wood", 100, "stone", 50],
    health: 800,
    pps: 2,
    turnSpeed: 0,
    spritePadding: 25,
    iconLineMult: 12,
    scale: 47,
    holdOffset: 20,
    placeOffset: 5
}, {
    age: 5,
    group: groups[4],
    type: 2,
    name: "mine",
    desc: "allows you to mine stone",
    req: ["wood", 20, "stone", 100],
    iconLineMult: 12,
    scale: 65,
    holdOffset: 20,
    placeOffset: 0
}, {
    age: 5,
    group: groups[11],
    type: 0,
    name: "sapling",
    desc: "allows you to farm wood",
    req: ["wood", 150],
    iconLineMult: 12,
    colDiv: 0.5,
    scale: 110,
    holdOffset: 50,
    placeOffset: -15
}, {
    age: 4,
    group: groups[5],
    name: "pit trap",
    desc: "pit that traps enemies if they walk over it",
    req: ["wood", 30, "stone", 30],
    trap: true,
    ignoreCollision: true,
    hideFromEnemy: true,
    health: 500,
    colDiv: 0.2,
    scale: 50,
    holdOffset: 20,
    placeOffset: -5
}, {
    age: 4,
    group: groups[6],
    name: "boost pad",
    desc: "provides boost when stepped on",
    req: ["stone", 20, "wood", 5],
    ignoreCollision: true,
    boostSpeed: 1.5,
    health: 150,
    colDiv: 0.7,
    scale: 45,
    holdOffset: 20,
    placeOffset: -5
}, {
    age: 7,
    group: groups[7],
    doUpdate: true,
    name: "turret",
    desc: "defensive structure that shoots at enemies",
    req: ["wood", 200, "stone", 150],
    health: 800,
    projectile: 1,
    shootRange: 700,
    shootRate: 2200,
    scale: 43,
    holdOffset: 20,
    placeOffset: -5
}, {
    age: 7,
    group: groups[8],
    name: "platform",
    desc: "platform to shoot over walls and cross over water",
    req: ["wood", 20],
    ignoreCollision: true,
    zIndex: 1,
    health: 300,
    scale: 43,
    holdOffset: 20,
    placeOffset: -5
}, {
    age: 7,
    group: groups[9],
    name: "healing pad",
    desc: "standing on it will slowly heal you",
    req: ["wood", 30, "food", 10],
    ignoreCollision: true,
    healCol: 15,
    health: 400,
    colDiv: 0.7,
    scale: 45,
    holdOffset: 20,
    placeOffset: -5
}, {
    age: 9,
    group: groups[10],
    name: "spawn pad",
    desc: "you will spawn here when you die but it will dissapear",
    req: ["wood", 100, "stone", 100],
    health: 400,
    ignoreCollision: true,
    spawnPoint: true,
    scale: 45,
    holdOffset: 20,
    placeOffset: -5
}, {
    age: 7,
    group: groups[12],
    name: "blocker",
    desc: "blocks building in radius",
    req: ["wood", 30, "stone", 25],
    ignoreCollision: true,
    blocker: 300,
    health: 400,
    colDiv: 0.7,
    scale: 45,
    holdOffset: 20,
    placeOffset: -5
}, {
    age: 7,
    group: groups[13],
    name: "teleporter",
    desc: "teleports you to a random point on the map",
    req: ["wood", 60, "stone", 60],
    ignoreCollision: true,
    teleport: true,
    health: 200,
    colDiv: 0.7,
    scale: 45,
    holdOffset: 20,
    placeOffset: -5
}];
var projectiles = [{
    indx: 0,
    layer: 0,
    src: "arrow_1",
    dmg: 25,
    speed: 1.6,
    scale: 103,
    range: 1000
}, {
    indx: 1,
    layer: 1,
    dmg: 25,
    scale: 20
}, {
    indx: 0,
    layer: 0,
    src: "arrow_1",
    dmg: 35,
    speed: 2.5,
    scale: 103,
    range: 1200
}, {
    indx: 0,
    layer: 0,
    src: "arrow_1",
    dmg: 30,
    speed: 2,
    scale: 103,
    range: 1200
}, {
    indx: 1,
    layer: 1,
    dmg: 16,
    scale: 20
}, {
    indx: 0,
    layer: 0,
    src: "bullet_1",
    dmg: 50,
    speed: 3.6,
    scale: 160,
    range: 1400
}];
function secondaryDmg(id) {
    if(!weapons[id].projectile) return 0;
    if(!projectiles[weapons[id].projectile].dmg) return 0;
    return projectiles[weapons[id].projectile].dmg;
};
let statusMenu = document.createElement("div");
statusMenu.id = "statusMenu";
statusMenu.style = `
position: absolute;
color: white;
text-align: left;
font-size: 15px;
height: 326px;
top: 30px;
left: 20px;
`;
document.getElementById("gameUI").appendChild(statusMenu);
var keysPressed = Array(100).fill(0);
var mills = {
    x: 0,
    y: 0,
    isOn: false,
};
var autoaim = false;
setInterval(() => {
    if(autoaim == true) {
        send("2", enemies.angle());
    }
}, 1000/120);
var lastSkin = 0;
var lastTail = 0;
document.addEventListener("keydown", (e) => {
    keysPressed[e.keyCode] = 1;
    if(e.keyCode == 78) {
        mills.isOn = !mills.isOn;
    }
    if(e.keyCode == 82 && player.primary.reload == 1 && player.secondary.reload == 1) {//simple instakill
        lastSkin = player.skinIndex;
        lastTail = player.tailIndex;
        autoaim = true;
        send("5", player.weapons[0], true);
        send("13c", 0, 7, 0);
        send("13c", 0, 0, 1);
        send("7", 1);
        setTimeout(() => {
            send("13c", 0, 53, 0);
            send("5", player.weapons[1], true);
            setTimeout(() => {
                autoaim = false;
                send("7", 1);
                send("5", player.weapons[0], true);
                send("13c", 0, lastSkin, 0);
                send("13c", 0, lastTail, 1);
            }, 250);
        }, 100);
    }
});
document.addEventListener("keyup", (e) => {
    keysPressed[e.keyCode] = 0;
});
var moveDir = null;
function equip(id, index) {
    if(!index) {
        if(player.skinIndex == 45) return;
        if(player.skinIndex != id && player.skins[id] && id > 0) {
            send("13c", 0, id, 0);
        }
    }else {
        if(player.tailIndex != id && player.tails[id] && id > 0) {
            send("13c", 0, id, 1);
        }else if(player.tailIndex != 0 && player.tailIndex != id) {
            send("13c", 0, 0, 1);
        }
    }
}
function place(REAL_AE_MOD, ME_LOVE_CHICKEN_WINGS_PLS_SEND_SOME_ME_POOR) {
    send("5", REAL_AE_MOD);
    send("c", 1, ME_LOVE_CHICKEN_WINGS_PLS_SEND_SOME_ME_POOR);
    send("c", 0, ME_LOVE_CHICKEN_WINGS_PLS_SEND_SOME_ME_POOR);
    send("5", player.weaponIndex, true);
}
var buildings = [];
class Building {
    constructor(sid, x, y, dir, scale, type, data = {}, setSID, owner) {
        this.sentTo = {};
		this.gridLocations = [];
		this.active = true;
		this.doUpdate = data.doUpdate;
		this.x = x;
		this.y = y;
		this.dir = dir;
		this.xWiggle = 0;
		this.yWiggle = 0;
		this.scale = scale;
		this.type = type;
		this.id = data.id;
		this.owner = owner;
		this.name = data.name;
		this.isItem = (this.id!=undefined);
		this.group = data.group;
		this.health = data.health;
		this.layer = 2;
		if (this.group != undefined) {
			this.layer = this.group.layer;
		} else if (this.type == 0) {
			this.layer = 3;
		} else if (this.type == 2) {
			this.layer = 0;
		} else if (this.type == 4) {
			this.layer = -1;
		}
		this.colDiv = data.colDiv||1;
		this.blocker = data.blocker;
		this.ignoreCollision = data.ignoreCollision;
		this.dontGather = data.dontGather;
		this.hideFromEnemy = data.hideFromEnemy;
		this.friction = data.friction;
		this.projDmg = data.projDmg;
		this.dmg = data.dmg;
		this.pDmg = data.pDmg;
		this.pps = data.pps;
		this.zIndex = data.zIndex||0;
		this.turnSpeed = data.turnSpeed;
		this.req = data.req;
		this.trap = data.trap;
		this.healCol = data.healCol;
		this.teleport = data.teleport;
		this.boostSpeed = data.boostSpeed;
		this.projectile = data.projectile;
		this.shootRange = data.shootRange;
		this.shootRate = data.shootRate;
		this.shootCount = this.shootRate;
		this.spawnPoint = data.spawnPoint;
    }
}
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (m) {
    if (!client) {
        client = new websocket(this, {
            "1": function(sid) {
                mySid = sid;
                player.sid = sid;
            },
            "11": function() {
                player.isAlive = false;
            },
            "6": function(data) {
                for (var i = 0; i < data.length;) {
                    buildings.push(new Building(
                        data[i],
                        data[i + 1],
                        data[i + 2],
                        data[i + 3],
                        data[i + 4],
                        data[i + 5],
                        list[data[i + 6]],
                        true,
                        (data[i + 7] >= 0 ? {
                            sid:data[i + 7]
                        } : null),
                    ));
                    i+=8;
                }
            },
            "4": function(bob_the_mail_man) {
                for(let i = 0; i < players.length; i++) {
                    if(players[i].id == bob_the_mail_man) {
                        players.splice(i, 1);
                    }
                }
            },
            "2": function(data, you) {
                let tmpPlayer = findPlayer(data[0]);
                if(!tmpPlayer) {
                    tmpPlayer = new Player(data[0], data[1]);
                    players.push(tmpPlayer);
                }
                tmpPlayer.spawn(you ? 1 : null);
                tmpPlayer.visible = false;
                tmpPlayer.x2 = undefined;
                tmpPlayer.y2 = undefined;
                tmpPlayer.id = data[0];
                tmpPlayer.sid = data[1];
                tmpPlayer.name = data[2];
                tmpPlayer.x = data[3];
                tmpPlayer.y = data[4];
                tmpPlayer.dir = data[5];
                tmpPlayer.health = data[6];
                tmpPlayer.maxHealth = data[7];
                tmpPlayer.scale = data[8];
                tmpPlayer.skinColor = data[9];
                if(you) {
                    player = tmpPlayer;
                    player.isAlive = true;
                }
            },
            "17": function(data, wpn) {
                if (data) {
                    if (wpn) {
                        player.weapons = data;
                    }else {
                        player.items = data;
                    }
                }
            },
            "18": function(x, y, dir, range, speed, indx, layer, sid) {
                let bulletPos = {
                    x: x - Math.cos(dir) * 70,
                    y: y - Math.sin(dir) * 70
                };
                let object = null;
                let isTurret = false;
                for(let i = 0; i < players.length; i++) {
                    let _ = players[i];
                    if(_.visible) {
                        if(speed == 1.5 && Math.hypot(_.y2 - y, _.x2 - x) <= 35) {
                            object = _;
                            isTurret = true;
                        }else if(_.secondary.id && (weapons[_.secondary.id].projectile !== undefined || weapons[_.secondary.id].projectile !== null) && Math.hypot(_.y2 - bulletPos.y, _.x2 - bulletPos.x) <= 35) {
                            object = _;
                        }
                    }
                }
                if(object) {
                    if(isTurret) {
                        object.turret = -0.0444;
                    }else {
                        object.secondary.reload = -111/weapons[object.secondary.id].speed;
                    }
                }
            },
            "us": function(type, id, index) {
                if (index) {
                    if (!type) {
                        player.tails[id] = 1;
                    }else {
                        player.tailIndex = id;
                    }
                } else {
                    if (!type) {
                        player.skins[id] = 1;
                    }else {
                        player.skinIndex = id;
                    }
                }
            },
            "7": function(sid, didHit, index) {
                let Player = findPlayer(sid);
                if(Player) {
                    if(index < 9) {
                        setTimeout(() => {
                            Player.primary.reload = 0;
                        });
                    }else {
                        setTimeout(() => {
                            Player.seconday.reload = 0;
                        });
                    }
                }
            },
            "16": function(points, AGE_AHHAHAHA) {
                let tmpList = [];
                document.getElementById("upgradeHolder").innerHTML = "";
                for (var i = 0; i < weapons.length; ++i) {
                    if (weapons[i].age == AGE_AHHAHAHA && (weapons[i].pre == undefined || player.weapons.indexOf(weapons[i].pre) >= 0)) {
                        let element = document.createElement("div");
                        element.id = "upgradeItem"+i;
                        element.classList.add("actionBarItem");
                        element.style.backgroundImage = document.getElementById("actionBarItem" + i).style.backgroundImage;
                        document.getElementById("upgradeHolder").append(element);
                        tmpList.push({
                            id: "upgradeItem"+i,
                            hi: i
                        });
                    }
                }
                for (var i = 0; i < list.length; ++i) {
                    if (list[i].age == AGE_AHHAHAHA) {
                        let element = document.createElement("div");
                        element.id = "upgradeItem"+(i+16);
                        element.classList.add("actionBarItem");
                        element.style.backgroundImage = document.getElementById("actionBarItem" + (i+16)).style.backgroundImage;
                        document.getElementById("upgradeHolder").append(element);
                        tmpList.push({
                            id: "upgradeItem"+(i+16),
                            hi: (i+16)
                        });
                    }
                }
                for(let i = 0; i < tmpList.length; i++) {
                    document.getElementById(tmpList[i].id).onclick = function() {
                        send("6", tmpList[i].hi);
                    }
                }
            },
            "33": function(data) {
                tick++;
                enemies.all = [];
                for (let i = 0; i < players.length; ++i) {
                    players[i].visible = false;
                }
                for (let i = 0; i < data.length;) {
                    let Player = findPlayer(data[i]);
                    if (Player) {
                        Player.x2 = data[i + 1];
                        Player.y2 = data[i + 2];
                        Player.d2 = data[i + 3];
                        Player.buildIndex = data[i + 4];
                        Player.weaponIndex = data[i + 5];
                        Player.weaponVariant = data[i + 6];
                        Player.team = data[i + 7];
                        Player.isLeader = data[i + 8];
                        Player.skinIndex = data[i + 9];
                        Player.tailIndex = data[i + 10];
                        Player.iconIndex = data[i + 11];
                        Player.zIndex = data[i + 12];
                        Player.visible = true;
                        if(Player.buildIndex == -1) {
                            if(Player.weaponIndex < 9) {
                                if(Player.primary.id == Player.weaponIndex) {
                                    Player.primary.dmg = weapons[Player.primary.id].dmg * weaponVariants[Player.weaponVariant].val;
                                    Player.primary.reload = Math.min(Player.primary.reload + 111/weapons[Player.primary.id].speed, 1);
                                }else {
                                    Player.primary.id = Player.weaponIndex;
                                    if(Player.primary.id == 4) {
                                        Player.secondary.id = 9;
                                        Player.secondary.dmg = 20;
                                    }else {
                                        Player.secondary.id = 15;
                                        Player.secondary.dmg = 50;
                                    }
                                }
                            }else {
                                if(Player.secondary.id == Player.weaponIndex) {
                                    if(Player.weaponIndex == 10) {
                                        Player.secondary.dmg = weapons[Player.weaponIndex].dmg * weaponVariants[Player.weaponVariant].val;
                                    }else {
                                        Player.secondary.dmg = secondaryDmg(Player.weaponIndex);
                                    }
                                    Player.secondary.reload = Math.min(Player.secondary.reload + 111/weapons[Player.secondary.id].speed, 1);
                                }else {
                                    Player.secondary.id = Player.weaponIndex;
                                }
                            }
                        }
                        Player.turret = Math.min(Player.turret + 111/2500, 1);
                        if((!player.team && Player.sid != player.sid) || (player.team && player.team != Player.team)) {
                            enemies.all.push(Player);
                        }
                    }
                    i+=13;
                }
                if (keysPressed[87] || keysPressed[65] || keysPressed[83] || keysPressed[68]) {
                    let dx = (keysPressed[68]) - (keysPressed[65]);
                    let dy = (keysPressed[83]) - (keysPressed[87]);
                    moveDir = Math.atan2(dy, dx);
                }else {
                    moveDir = null;
                }
                if(Math.hypot(mills.y - player.y2, mills.x - player.x2) > 99) {
                    if(mills.isOn && moveDir !== null) {
                        place(player.items[3], moveDir + Math.PI);
                        place(player.items[3], moveDir - 1.20427718 + Math.PI);
                        place(player.items[3], moveDir + 1.20427718 + Math.PI);
                    }
                    mills.x = player.x2;
                    mills.y = player.y2;
                }
                if(enemies.all.length) {
                    enemies.all = enemies.all.sort((a, b) => dist(a, player) - dist(b, player));
                    enemies.nearest = enemies.all[0];
                }
                statusMenu.innerHTML = `
                {WRX Client}<br>
                Enemies: ${enemies.all.length}<br>
                Auto Mills: ${mills.isOn}
                `;
            },
            "h": function(sid, value) {
                let Player = findPlayer(sid);
                if(mySid == sid) {
                    let damage = value - Player.health;
                    if(damage < 0) {
                        damage = Math.abs(damage);
                        healing(damage);
                    }
                }
                Player.health = value;
            }
        });
    }
    this.oldSend(m);
};

(function() {

	'use strict';
    var myVar;
    var myVar2;
	var police = true;
	var ID_MooHead = 28;
    var ID_EMPTY = 0;
	var ID_PigHead = 29;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 104 || e.keyCode == 100) {
			e.preventDefault();
			if (police) {
            storeEquip(ID_MooHead);
            myVar = setTimeout(function(){ h1(); }, 500);
			} else {
            clearTimeout(myVar);
            clearTimeout(myVar2);
            storeEquip(ID_EMPTY);
			}
			police = !police;
		}
	});

    function h1() {
    storeEquip(ID_MooHead);
    clearTimeout(myVar);
    myVar2 = setTimeout(function(){ h2(); }, 500);
    }
    function h2() {
    storeEquip(ID_PigHead);
    clearTimeout(myVar2);
    myVar = setTimeout(function(){ h1(); }, 500);
    }
})();

(function() {

	'use strict';
    var myVar;
    var myVar2;
	var police = true;
	var ID_BummleHat = 8;
    var ID_EMPTY = 0;
	var ID_WinterCap = 15;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 102 || e.keyCode == 98) {
			e.preventDefault();
			if (police) {
            storeEquip(ID_BummleHat);
            myVar = setTimeout(function(){ h1(); }, 500);
			} else {
            clearTimeout(myVar);
            clearTimeout(myVar2);
            storeEquip(ID_EMPTY);
			}
			police = !police;
		}
	});

    function h1() {
    storeEquip(ID_WinterCap);
    clearTimeout(myVar);
    myVar2 = setTimeout(function(){ h2(); }, 500);
    }
    function h2() {
    storeEquip(ID_BummleHat);
    clearTimeout(myVar2);
    myVar = setTimeout(function(){ h1(); }, 500);
    }
})();

setInterval(changeHue, 10);
document.getElementById("gameName").innerHTML = "🎃WRX Client🎃"
document.getElementById("leaderboard").append('WRX Client🎃');
document.getElementById('enterGame').style.color = "White"
document.getElementById('enterGame').innerHTML = "🎃Hello World!🎃"
document.getElementById('loadingText').innerHTML = "🎃Loading🎃"
document.getElementById('loadingText').style.color = "orange"
document.getElementById('diedText').innerHTML = "🎃Good luck next time🎃"

document.getElementById("gameName").style.color = "orange"
document.getElementById("leaderboard").style.color = "orange"
document.getElementById("allianceButton").style.color = "yellow";
document.getElementById("chatButton").style.color = "yellow";
document.getElementById("storeButton").style.color = "yellow";
document.getElementById("gameName").style.color = "orange"
document.getElementById('diedText').style.color = "orange";
document.getElementById('adCard').remove();
document.getElementById('errorNotification').remove();
document.getElementById("promoImg").remove();
document.getElementById("setupCard").style.color = "Black"
document.getElementById("ageText").style.color = "orange"

document.getElementById("mapDisplay").style.borderRadius = "Black";
document.getElementById("mapDisplay").style.borderRadius = "Black";
document.getElementById("woodDisplay").style.color = "green";
document.getElementById("stoneDisplay").style.color = "Black";
document.getElementById("killCounter").style.color = "white";
document.getElementById("foodDisplay").style.color = "red";
document.getElementById("scoreDisplay").style.color = "yellow";
document.getElementById("mapDisplay").style.backgroundColor = "rgba(0, 0, 0, 0.6)";
document.getElementById('ageBar').style.backgroundColor = 'rgba(0, 0, 0, 0.6)'
document.title = '  Modification by MrMeow ';
$("#mapDisplay").css({background: `url('https://ksw2-center.glitch.me/users/fzb/map.png?z=${performance.now()}&u=a')`});
    function changeHue() {
        hue += Math.random() * 3;
    }
    setInterval(changeHue, 20);
    setInterval(() => {
        setTimeout(() => {
            document.getElementById("chatBox").placeholder = "WRX Client";
            setTimeout(() => {
                document.getElementById("chatBox").placeholder = "WRX Client.";
                setTimeout(() => {
                    document.getElementById("chatBox").placeholder = "WRX Client..";
                    setTimeout(() => {
                        document.getElementById("chatBox").placeholder = "WRX Client...";
                    }, 200);
                }, 200);
            }, 200);
        }, 200);
    }, 1000);
let gconfig = {
    pressedKey: null,
    keys: {
        wintercap : ']',
        flipperhat : '[',
        emphelmet : 'u',
        turretgear : 'y',
        monkeyhead : '/',
        pandouhead : '.',
        bearhead : ',',
        bullHelmet : 't',
        soldier : 'c',
        booster : 'g',
        tankgear : 'b'
    },
    ids: {
        wintercap: 15,
        flippethat: 31,
        emphelmet: 22,
        turretgear: 53,
        monkeyhead: 38,
        pandouhead: 36,
        bearhead: 37,
        bullhelmet: 7,
        soldier: 6,
        booster: 12,
        tankgear: 40
    },
    document: document,
    functions: {
        injectKeys: function(keycode) {
            gconfig.pressedKey = keycode.key
            gconfig.functions.getKeys(gconfig.pressedKey)
        },
        getKeys: function(arg) {
            switch(arg) {
                case gconfig.keys.bullHelmet: {
                    gconfig.functions.equipHat(gconfig.ids.bullhelmet);
                }
                    break;
                case gconfig.keys.soldier: {
                    gconfig.functions.equipHat(gconfig.ids.soldier);
                }
                    break;
                case gconfig.keys.booster: {
                    gconfig.functions.equipHat(gconfig.ids.booster);
                }
                break;
                case gconfig.keys.turret: {
                    gconfig.functions.equipHat(gconfig.ids.turret);
                }
                    break;
                case gconfig.keys.tankgear: {
                    gconfig.functions.equipHat(gconfig.ids.tankgear);
                }
                    break;
                case gconfig.keys.pandouhead: {
                    gconfig.functions.equipHat(gconfig.ids.pandouhead);
                }
                    break;
                case gconfig.keys.bearhead: {
                    gconfig.functions.equipHat(gconfig.ids.bearhead);
                }
                    break;
                case gconfig.keys.monkeyhead: {
                    gconfig.functions.equipHat(gconfig.ids.monkeyhead);
                }
                    break;
                case gconfig.keys.turetgear: {
                    gconfig.functions.equipHat(gconfig.ids.turretgear);
                }
                    break;
                case gconfig.keys.emphelmet: {
                    gconfig.functions.equipHat(gconfig.ids.emphelmet);
                }
                    break;
                case gconfig.keys.flipperhat: {
                    gconfig.functions.equipHat(gconfig.ids.flippethat);
                }
                    break;
                case gconfig.keys.wintercap: {
                    gconfig.functions.equipHat(gconfig.ids.wintercap);
                }
                    break;


            }
        },
        equipHat: function(argsNum) {
            console.log(argsNum)
            gconfig.window.storeEquip(argsNum)
        }
    },
    window: window
};

document.addEventListener('keydown', e => {
    gconfig.functions.injectKeys(e)
})
var fadingspeed = 100 // lower = faster, higher = slower
var d = 0;

function e(e, n = d) {
    document.getElementById(e).style["background-color"] = "hsl(" + n + ", 100%, 50%)";
}

setInterval(function() {
    (function(e, n) {
        e(n);
    })(e, "ageBarBody"), d++;
}, fadingspeed);
(function() {
    "use strict";

    const log = console.log;
    function createHook(target, prop, callback) {
        const symbol = Symbol(prop);
        Object.defineProperty(target, prop, {
            get() {
                return this[symbol];
            },
            set(value) {
                callback(this, symbol, value);
            },
            configurable: true
        })
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function reload() {
        await sleep(1500);
        window.onbeforeunload = null;
        location.reload();
    }

    // Handles errors such as "Server is full", "Failed to find server index" etc
    createHook(Object.prototype, "errorCallback", function(that, symbol, value) {
        that[symbol] = value;

        if (typeof value !== "function") return;
        that[symbol] = new Proxy(value, {
            apply(target, _this, args) {
                window.alert = function(){}
                reload();
                return target.apply(_this, args);
            }
        })
    })

    // Handle WebSocket close and error events
    function handleWebsocket(method) {
        const set = Object.getOwnPropertyDescriptor(WebSocket.prototype, method).set;
        Object.defineProperty(WebSocket.prototype, method, {
            set(callback) {
                return set.call(this, new Proxy(callback, {
                    apply(target, _this, args) {
                        reload();
                        return target.apply(_this, args);
                    }
                }))
            }
        })
    }
    handleWebsocket("onclose");
    handleWebsocket("onerror");

})();

(function() {
    "use strict";

    const log = console.log;
    function createHook(target, prop, callback) {
        const symbol = Symbol(prop);
        Object.defineProperty(target, prop, {
            get() {
                return this[symbol];
            },
            set(value) {
                callback(this, symbol, value);
            },
            configurable: true
        })
    }

    createHook(Object.prototype, "maxPlayers", function(that, symbol, value) {
        delete Object.prototype.maxPlayers;
        that.maxPlayers = value + 10;
    })

})();
;(async () => {
	unsafeWindow.reloadTimer = true

	let weaponSpeed = [
		300, 400, 400, 300, 300, 700, 300, 100, 400, 600, 400, 0, 700, 230, 700, 1500
	]
	let weaponSrc = [
		"hammer_1",
		"axe_1",
		"great_axe_1",
		"sword_1",
		"samurai_1",
		"spear_1",
		"bat_1",
		"dagger_1",
		"stick_1",
		"bow_1",
		"great_hammer_1",
		"shield_1",
		"crossbow_1",
		"crossbow_2",
		"grab_1",
		"musket_1"
	]
	var myPlayer,
		mySID,
		inGame = false,
		reloads = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	var now, delta, lastUpdate
	const reloadTimer1 = document.createElement("div")
	reloadTimer1.id = "reloadTimer1"
	reloadTimer1.className = "resourceDisplay"
	reloadTimer1.innerText = "0"

	const reloadTimer2 = document.createElement("div")
	reloadTimer2.id = "reloadTimer2"
	reloadTimer2.className = "resourceDisplay"
	reloadTimer2.innerText = "-"

	await new Promise(async (resolve) => {
		let { send } = WebSocket.prototype

		WebSocket.prototype.send = function (...x) {
			send.apply(this, x)
			this.send = send
			this.addEventListener("message", (e) => {
				if (!e.origin.includes("moomoo.io")) return
				const [packet, data] = msgpack.decode(new Uint8Array(e.data))
				switch (packet) {
					case "1":
						inGame = true
						mySID = data[0]
						break
					case "11":
						inGame = false
						reloads = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
						break
					case "7":
						if (data[0] == mySID) reloads[data[2]] = weaponSpeed[data[2]]
						break
					case "18":
						if ([1000, 1200, 1400].includes(data[3])) {
							let projectileID
							switch (data[5]) {
								case 0:
									projectileID = 9
									break
								case 2:
									projectileID = 12
									break
								case 3:
									projectileID = 13
									break
								case 5:
									projectileID = 15
									break
								default:
									projectileID = null
							}
							let x = data[0] - Math.cos(data[2]) * 35
							let y = data[1] - Math.sin(data[2]) * 35
							if (Math.sqrt((x -= myPlayer.x) * x + (y -= myPlayer.y) * y) <= 70)
								reloads[projectileID] = weaponSpeed[projectileID]
						}
						break
				}
			})
			resolve(this)
		}
	})

	function updateReload() {
		now = Date.now()
		delta = now - lastUpdate
		lastUpdate = now
		if (inGame && myPlayer) {
			if (myPlayer.buildIndex == -1) {
				reloads[myPlayer.weaponIndex] = Math.max(
					0,
					reloads[myPlayer.weaponIndex] - delta
				)
			}
			if (myPlayer.weapons[0] != null) {
				reloadTimer1.style.backgroundImage = `url(../img/weapons/${
					weaponSrc[myPlayer.weapons[0]]
				}.png)`
				reloadTimer1.innerText = reloads[myPlayer.weapons[0]]
			}
			if (myPlayer.weapons[1] != null) {
				reloadTimer2.style.backgroundImage = `url(../img/weapons/${
					weaponSrc[myPlayer.weapons[1]]
				}.png)`
				reloadTimer2.style.backgroundColor = "rgba(0, 0, 0, 0.25)"
				reloadTimer2.innerText = reloads[myPlayer.weapons[1]]
			} else {
				reloadTimer2.style.backgroundImage = null
				reloadTimer2.style.backgroundColor = null
				reloadTimer2.innerText = "-"
			}
		}
		unsafeWindow.requestAnimationFrame(updateReload)
	}
	lastUpdate = Date.now()
	unsafeWindow.requestAnimationFrame(updateReload)

	function waitForElm(selector) {
		return new Promise((resolve) => {
			if (document.querySelector(selector)) {
				return resolve(document.querySelector(selector))
			}

			const observer = new MutationObserver((mutations) => {
				if (document.querySelector(selector)) {
					resolve(document.querySelector(selector))
					observer.disconnect()
				}
			})

			observer.observe(document.body, {
				childList: true,
				subtree: true
			})
		})
	}

	const symbol = Symbol("minimapCounter")
	Object.defineProperty(Object.prototype, "minimapCounter", {
		get() {
			return this[symbol]
		},
		set(value) {
			this[symbol] = value
			if (this.isPlayer === true && this.sid === mySID) {
				myPlayer = this
			}
		},
		configurable: true
	})

	waitForElm("#topInfoHolder").then((topInfoHolder) => {
		const style = document.createElement("style")
		style.innerHTML = `
        #reloadTimer1 {
            right: 0px;
            margin-top: 65px;
            color: #fff;
            font-size: 28px;
            background-color: rgba(0, 0, 0, 0.25);
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
        }

        #reloadTimer2 {
            right: 0px;
            margin-top: 120px;
            color: #fff;
            font-size: 28px;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
        }
        `
		document.head.appendChild(style)

		topInfoHolder.appendChild(reloadTimer1)
		topInfoHolder.appendChild(reloadTimer2)
	})
})()

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

    let keys = {};
    addEventListener("keydown", function(event) {
        if (!keys[event.keyCode]) {
            keys[event.keyCode] = true;
            if (event.keyCode == 80) {
                toggleRender = !toggleRender;
            }
        }
    });
    window.addEventListener("keyup", function(event) {
        if (keys[event.keyCode]) {
            keys[event.keyCode] = false
        }
    });
});