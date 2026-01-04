// ==UserScript==
// @name         Multibox [NEW] 1.8.0 MooMoo
// @namespace    -
// @version      1
// @description  !send [number] to get bots [If need more we recommend use vpn and do send command] / !join [name] join clan / !leave leave clan
// @author       Ha Thu
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @icon         https://cdn.discordapp.com/attachments/759868693840003072/762661498178109450/lightcg.jpg
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @downloadURL https://update.greasyfork.org/scripts/512317/Multibox%20%5BNEW%5D%20180%20MooMoo.user.js
// @updateURL https://update.greasyfork.org/scripts/512317/Multibox%20%5BNEW%5D%20180%20MooMoo.meta.js
// ==/UserScript==

let healToggle = true;
let hatToggle = false;
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
let sockets = {};
let bots = {};
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
let cursor = false;

let weapons = [{
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
    spdMult: .85,
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
    spdMult: .8,
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
    knock: .2,
    spdMult: .82,
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
    knock: .7,
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
    iPad: .8,
    length: 110,
    width: 110,
    xOff: 18,
    yOff: 0,
    dmg: 20,
    knock: .1,
    range: 65,
    gather: 1,
    hitSlow: .1,
    spdMult: 1.13,
    speed: 100
}]

let hats = [{
    id: 51,
    name: "Moo Cap",
    price: 0,
    scale: 120,
    desc: "coolest mooer around"
}, {
    id: 50,
    name: "Apple Cap",
    price: 0,
    scale: 120,
    desc: "apple farms remembers"
}, {
    id: 28,
    name: "Moo Head",
    price: 0,
    scale: 120,
    desc: "no effect"
}, {
    id: 29,
    name: "Pig Head",
    price: 0,
    scale: 120,
    desc: "no effect"
}, {
    id: 30,
    name: "Fluff Head",
    price: 0,
    scale: 120,
    desc: "no effect"
}, {
    id: 36,
    name: "Pandou Head",
    price: 0,
    scale: 120,
    desc: "no effect"
}, {
    id: 37,
    name: "Bear Head",
    price: 0,
    scale: 120,
    desc: "no effect"
}, {
    id: 38,
    name: "Monkey Head",
    price: 0,
    scale: 120,
    desc: "no effect"
}, {
    id: 44,
    name: "Polar Head",
    price: 0,
    scale: 120,
    desc: "no effect"
}, {
    id: 35,
    name: "Fez Hat",
    price: 0,
    scale: 120,
    desc: "no effect"
}, {
    id: 42,
    name: "Enigma Hat",
    price: 0,
    scale: 120,
    desc: "join the enigma army"
}, {
    id: 43,
    name: "Blitz Hat",
    price: 0,
    scale: 120,
    desc: "hey everybody i'm blitz"
}, {
    id: 49,
    name: "Bob XIII Hat",
    price: 0,
    scale: 120,
    desc: "like and subscribe"
}, {
    id: 57,
    name: "Pumpkin",
    price: 50,
    scale: 120,
    desc: "Spooooky"
}, {
    id: 8,
    name: "Bummle Hat",
    price: 100,
    scale: 120,
    desc: "no effect"
}, {
    id: 2,
    name: "Straw Hat",
    price: 500,
    scale: 120,
    desc: "no effect"
}, {
    id: 15,
    name: "Winter Cap",
    price: 600,
    scale: 120,
    desc: "allows you to move at normal speed in snow",
    coldM: 1
}, {
    id: 5,
    name: "Cowboy Hat",
    price: 1e3,
    scale: 120,
    desc: "no effect"
}, {
    id: 4,
    name: "Ranger Hat",
    price: 2e3,
    scale: 120,
    desc: "no effect"
}, {
    id: 18,
    name: "Explorer Hat",
    price: 2e3,
    scale: 120,
    desc: "no effect"
}, {
    id: 31,
    name: "Flipper Hat",
    price: 2500,
    scale: 120,
    desc: "have more control while in water",
    watrImm: !0
}, {
    id: 1,
    name: "Marksman Cap",
    price: 3e3,
    scale: 120,
    desc: "increases arrow speed and range",
    aMlt: 1.3
}, {
    id: 10,
    name: "Bush Gear",
    price: 3e3,
    scale: 160,
    desc: "allows you to disguise yourself as a bush"
}, {
    id: 48,
    name: "Halo",
    price: 3e3,
    scale: 120,
    desc: "no effect"
}, {
    id: 6,
    name: "Soldier Helmet",
    price: 4e3,
    scale: 120,
    desc: "reduces damage taken but slows movement",
    spdMult: .94,
    dmgMult: .75
}, {
    id: 23,
    name: "Anti Venom Gear",
    price: 4e3,
    scale: 120,
    desc: "makes you immune to poison",
    poisonRes: 1
}, {
    id: 13,
    name: "Medic Gear",
    price: 5e3,
    scale: 110,
    desc: "slowly regenerates health over time",
    healthRegen: 3
}, {
    id: 9,
    name: "Miners Helmet",
    price: 5e3,
    scale: 120,
    desc: "earn 1 extra gold per resource",
    extraGold: 1
}, {
    id: 32,
    name: "Musketeer Hat",
    price: 5e3,
    scale: 120,
    desc: "reduces cost of projectiles",
    projCost: .5
}, {
    id: 7,
    name: "Bull Helmet",
    price: 6e3,
    scale: 120,
    desc: "increases damage done but drains health",
    healthRegen: -5,
    dmgMultO: 1.5,
    spdMult: .96
}, {
    id: 22,
    name: "Emp Helmet",
    price: 6e3,
    scale: 120,
    desc: "turrets won't attack but you move slower",
    antiTurret: 1,
    spdMult: .7
}, {
    id: 12,
    name: "Booster Hat",
    price: 6e3,
    scale: 120,
    desc: "increases your movement speed",
    spdMult: 1.16
}, {
    id: 26,
    name: "Barbarian Armor",
    price: 8e3,
    scale: 120,
    desc: "knocks back enemies that attack you",
    dmgK: .6
}, {
    id: 21,
    name: "Plague Mask",
    price: 1e4,
    scale: 120,
    desc: "melee attacks deal poison damage",
    poisonDmg: 5,
    poisonTime: 6
}, {
    id: 46,
    name: "Bull Mask",
    price: 1e4,
    scale: 120,
    desc: "bulls won't target you unless you attack them",
    bullRepel: 1
}, {
    id: 14,
    name: "Windmill Hat",
    topSprite: !0,
    price: 1e4,
    scale: 120,
    desc: "generates points while worn",
    pps: 1.5
}, {
    id: 11,
    name: "Spike Gear",
    topSprite: !0,
    price: 1e4,
    scale: 120,
    desc: "deal damage to players that damage you",
    dmg: .45
}, {
    id: 53,
    name: "Turret Gear",
    topSprite: !0,
    price: 1e4,
    scale: 120,
    desc: "you become a walking turret",
    turret: {
        proj: 1,
        range: 700,
        rate: 2500
    },
    spdMult: .7
}, {
    id: 20,
    name: "Samurai Armor",
    price: 12e3,
    scale: 120,
    desc: "increased attack speed and fire rate",
    atkSpd: .78
}, {
    id: 58,
    name: "Dark Knight",
    price: 12e3,
    scale: 120,
    desc: "restores health when you deal damage",
    healD: .4
}, {
    id: 27,
    name: "Scavenger Gear",
    price: 15e3,
    scale: 120,
    desc: "earn double points for each kill",
    kScrM: 2
}, {
    id: 40,
    name: "Tank Gear",
    price: 15e3,
    scale: 120,
    desc: "increased damage to buildings but slower movement",
    spdMult: .3,
    bDmg: 3.3
}, {
    id: 52,
    name: "Thief Gear",
    price: 15e3,
    scale: 120,
    desc: "steal half of a players gold when you kill them",
    goldSteal: .5
}, {
    id: 55,
    name: "Bloodthirster",
    price: 2e4,
    scale: 120,
    desc: "Restore Health when dealing damage. And increased damage",
    healD: .25,
    dmgMultO: 1.2
}, {
    id: 56,
    name: "Assassin Gear",
    price: 2e4,
    scale: 120,
    desc: "Go invisible when not moving. Can't eat. Increased speed",
    noEat: !0,
    spdMult: 1.1,
    invisTimer: 1e3
}]

let msgpack5 = window.msgpack; //msgpack hahah
document.msgpack = msgpack5;

let autoAttack;
let freeze;
function dist(a, b){
    return Math.sqrt( Math.pow((b.y-a[2]), 2) + Math.pow((b.x-a[1]), 2) );
}
function acc(id) {
    doNewSend(["c", [1, id, 1]]);
    doNewSend(["c", [0, 0, 1]]);
    doNewSend(["c", [0, id, 1]]);
}

function hat(id) {
    doNewSend(["c", [1, id, 0]]);
    doNewSend(["c", [0, id, 0]]);
}
let treeList = [], bushList = [], stoneList = [], goldList = [], followingfarm = false, followingtype = null, LED = Date.now(), playerss = []
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
        const touchscreen = document.getElementById('touch-controls-fullscreen');
        let cvs = document.getElementById("gameCanvas");
        //setTimeout(() => { if (document.getElementById("mainMenu")) { document.getElementById("mainMenu").remove(); } }, 5000);
        let width = touchscreen.clientWidth;
        let height = touchscreen.clientHeight;
        $(window).resize(function() {
            width = touchscreen.clientWidth;
            height = touchscreen.clientHeight;
        });
        let place = (e, t = dir) => {
            doNewSend(['G', [e, null]]);
            doNewSend(['d', [1, t]]);
            doNewSend(['d', [0, t]]);
            doNewSend(['G', [null]]);
        }
        let placeForAll = (e, t = dir) => {
            sendForAll(['G', [e, null]]);
            sendForAll(['d', [1, t]]);
            sendForAll(['d', [0, t]]);
            sendForAll(['G', [null]]);
        }
        touchscreen.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dir = Math.atan2(event.clientY - height / 2, event.clientX - width / 2)
            if (!autoaim && Date.now() - LED > 63) {
                LED = Date.now()
                if(followingfarm == true) {
                    doNewSend(['D', [dir]]);
                } else {
                    if(autoattack == true) {
                        for (let i in sockets) {
                            if(sockets[i].attack2 == false) {
                                sockets[i].oldSend(new Uint8Array(Array.from(msgpack5.encode(e))));
                            }
                        }
                    } else {
                        if(cursor == true) {
                            doNewSend(["D", [dir]])
                            for(let i in bots) {
                                sockets[i].oldSend(new Uint8Array(Array.from(msgpack5.encode(["D", [Math.atan2((myPlayer.y - bots[i].y) + mouseY - (height / 2), (myPlayer.x - bots[i].x) + mouseX - (width / 2))]]))))
                            }
                        } else {
                            sendForAll(["D", [dir]])
                        }
                    }
                }
            }
        })
        document.key22 = 1;
        document.addEventListener('keydown', e => {
            if (document.key22 !== e.keyCode) {
                document.key22 = e.keyCode;
                if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea" && !document.getElementById('chatHolder').offsetParent) {
                    if (e.keyCode == 82) {
                        if(e.repeat) return
                        autoaim=true;
                        doNewSend(["D", [cursor?(Math.atan2(mouseY - height / 2, mouseX - width / 2)):nearestEnemyAngle]])
                        doNewSend(["K", [1]])
                        doNewSend(["G", [15, 1]])
                        setTimeout(() => {
                            autoaim=false
                            doNewSend(["K", [1]])
                        }, 130)
                    }
                    if (e.keyCode == 70) {
                        if(e.repeat) return
                        sendForAll(["G", [boostType]])
                    }
                    if (e.keyCode == 86) {
                        if(e.repeat) return
                        sendForAll(["G", [spikeType]])
                    }
                    /*if (e.keyCode == 89) {
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
                    }*/
                    if (e.keyCode == 80) {
                        pointer = !pointer;
                    }
                    /*if (e.keyCode == 84) {
                        autoaim = true;
                        doNewSend(["13c", [1, 6, 0]]);
                        doNewSend(["13c", [1, 7, 0]]);
                        doNewSend(["13c", [1, 53, 0]]);
                        autoAttackWithAim3 = true;
                        doNewSend(['c', [1]])
                        doNewSend(["H", [5]]);
                        doNewSend(["H", [17]]);
                        doNewSend(["H", [31]]);
                        doNewSend(["H", [23]]);
                        doNewSend(["H", [9]]);
                        doNewSend(["H", [18]]);
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
                        sendForAll(["H", [8]]);
                        sendForAll(["H", [3]]);
                        sendForAll(["H", [5]]);
                    }
                    if(e.keyCode == 39) {
                        sendForAll(["H", [8]]);
                        sendForAll(["H", [4]]);
                        sendForAll(["H", [5]]);
                        sendForAll(["H", [10]]);
                        sendForAll(["H", [28]]);
                        sendForAll(["H", [10]]);
                    }
                    if(e.keyCode == 16) {
                        sendForAll(["13c", [0, 0, 0]]);
                        sendForAll(["13c", [0, 0, 1]]);
                    }
                    if (e.keyCode == 38) {
                        sendForAll(["H", [5]]);
                        sendForAll(["H", [17]]);
                        sendForAll(["H", [31]]);
                        sendForAll(["H", [23]]);
                        sendForAll(["H", [13]]);
                        sendForAll(["H", [18]]);
                        sendForAll(["H", [28]]);
                    }
                    if (e.keyCode == 120) {
                        sendForAll(["H", [4]]);
                        sendForAll(["H", [15]]);
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
                        sendForAll(["H", [28]]);
                    }
                    if (e.keyCode == 115) {
                        sendForAll(["H", [4]]);
                        sendForAll(["H", [25]]);
                    }*/
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
                doNewSend(['D', [nearestEnemyAngle]]);
            }
            if (autoAttackWithAim3) {
                doNewSend(['d', [1]]);
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
        }, 100)
        primary = 0;
        foodType = 0;
        wallType = 3;
        spikeType = 6;
        millType = 10;
        myPlayer.weapon = 0;
        doNewSend(['M', [{name: localStorage.moo_name, moofoll: "1", skin: 4}]]);
        setTimeout(() => {
            document.gr = grecaptcha;
            let kk;
            let host = "127.0.0.1" !== location.hostname && !location.hostname.startsWith("192.168.");
            for (let i2 = 0; i2 < 4; i2++) {
                true && (kk = !0, host ? document.gr.execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", { action: "homepage" }).then((function(e) {
                    wsType(`${document.ws.url.split("?")[0]}?token=re:${encodeURIComponent(e)}`);
                })) : null);
            }
        }, 100);
    }
    if (item == "C" && !myPlayer.id) {
        myPlayer.id = data[1];
    }
    if (item == "D") {
        playerss.push({
            sid: data[1][1],
            name: data[1][2]
        })
    }
    if (item == "E") {
        let t = playerss.findIndex(e=>e.sid==data[1])
        if(t !== undefined) {
            playerss.splice(t, 1)
        }
    }
    if (item == "H") {
        for(let i = 0; i < data[1].length/8; i++) {
            let objectData = data[1].slice(8*i, 8*i+8)
            if(objectData[6] == null) {
                if(objectData[5] == 0) {
                    treeList.push({
                        x: objectData[1],
                        y: objectData[2]
                    })
                } else if (objectData[5] == 1) {
                    bushList.push({
                        x: objectData[1],
                        y: objectData[2]
                    })
                } else if (objectData[5] == 2) {
                    stoneList.push({
                        x: objectData[1],
                        y: objectData[2]
                    })
                } else if (objectData[5] == 3) {
                    goldList.push({
                        x: objectData[1],
                        y: objectData[2]
                    })
                }
            }
        }
    }
    if (item == "N") {
        if(data[1] == "kills") {
            sendForAll(["6", ["gg - Get Deleted"]], true)
        }
    }
    if (item == "P") {
        primary = 0;
        foodType = 0;
        wallType = 3;
        spikeType = 6;
        millType = 10;
        if (!autoAttack && !freeze) {
            doNewSend(['M', [{name: localStorage.moo_name, moofoll: "1", skin: 4}]]);
        } else {
            JustDied = true;
        }
        let e = setInterval(() => {
            if(document.getElementById('mainMenu').style.display == "block") {
                clearInterval(e)
                document.getElementById('mainMenu').style.display = "none"
            }
        })
    }
    if (JustDied) {
        if (!autoAttack && !freeze) {
            JustDied = false;
            doNewSend(['M', [{name: localStorage.moo_name, moofoll: "1", skin: 4}]]);
        }
    }
    if (item == "X") {
        //console.log(data)
    }
    if (item == "a") {
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
            let U = players[playerInfo[0]]
            if(U && (U.clan !== myPlayer.clan && myPlayer.clan !== null || myPlayer.clan == null)) {
                if(Math.sqrt(Math.pow(U.x - playerInfo[1], 2)+Math.pow(U.y - playerInfo[2], 2)) >= 70 && (Math.abs(Math.atan2(playerInfo[2] - U.y, playerInfo[1] - U.x) - Math.atan2(playerInfo[2] - myPlayer.y, playerInfo[1] - myPlayer.x)) % (2 * Math.PI)) < Math.PI/4) {
                    let dir = Math.atan2(playerInfo[2] - myPlayer.y, playerInfo[1] - myPlayer.x)
                    if(boostType) {
                        sendForAll(["G", [boostType]])
                        sendForAll(["d", [1, dir]])
                        sendForAll(["G", [boostType]])
                        sendForAll(["d", [1, dir+Math.PI/2]])
                        sendForAll(["G", [boostType]])
                        sendForAll(["d", [1, dir-Math.PI/2]])
                        sendForAll(["G", [boostType]])
                        sendForAll(["d", [1, dir+Math.PI]])
                        sendForAll(["d", [0]])
                        sendForAll(["G", [null]])
                    } else {
                        sendForAll(["G", [spikeType]])
                        sendForAll(["d", [1, dir]])
                        sendForAll(["G", [spikeType]])
                        sendForAll(["d", [1, dir+Math.PI/2]])
                        sendForAll(["G", [spikeType]])
                        sendForAll(["d", [1, dir-Math.PI/2]])
                        sendForAll(["G", [spikeType]])
                        sendForAll(["d", [1, dir+Math.PI]])
                        sendForAll(["d", [0]])
                        sendForAll(["G", [null]])
                    }
                }
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
        /*if (autoaim) {
            doNewSend(['2', [nearestEnemyAngle]]);
        }*/
        if (autoAttackWithAim3) {
            doNewSend(['d', [1]]);
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
                doNewSend(['a', [nearestEnemyAngle]]);
                setTimeout(() => {
                    doNewSend(['a', []]);
                    doNewSend(['c', [0, 11, 1]]);
                }, 300)
                doNewSend(['K', [1]]);
                if (myPlayer.weapon == 0) {
                    doNewSend(["H", [5]]);
                    doNewSend(["H", [17]]);
                    doNewSend(["H", [31]]);
                    doNewSend(["H", [23]]);
                    doNewSend(["H", [10]]);
                    doNewSend(["H", [18]]);
                    doNewSend(["H", [28]]);
                }
                doNewSend(["H", [15]]);
                doNewSend(['c', [0, 0, 1]])
                doNewSend(['c', [0, 19, 1]])
                doNewSend(['c', [0, 7, 0]])
                doNewSend(["G", [primary, 1]]);
                for (let i = 0; i < 25; i++) {
                    doNewSend(['d', [1, nearestEnemyAngle]]);
                }
                setTimeout(() => {
                    doNewSend(['c', [0, 53, 0]]);
                    doNewSend(["G", [15, 1]]);
                    doNewSend(["G", [secondary, 1]]);
                    setTimeout(() => {
                        autoaim = false;
                        doNewSend(["G", [primary, 1]]);
                        if (!empToggle) {
                            doNewSend(["c", [1, 6, 0]]);
                            doNewSend(["c", [0, 6, 0]]);
                        }
                        if (empToggle) {
                            doNewSend(["c", [1, 22, 0]]);
                            doNewSend(["c", [0, 22, 0]]);
                        }
                        doNewSend(['K', [1]]);
                        doNewSend(['d', [0]]);
                    }, 270);
                }, 130);
            }
        }
        if (pointer) {
            pointingOnPosition = {x: myPlayer.x, y: myPlayer.y};
        }
    }
    if (item == "V") {
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
    //player receive
    if (item == "6") {
        if (data[2].toLocaleLowerCase() == '!dc multibox') { // crash
            crashing = true;
        }
        if (data[2].toLocaleLowerCase() == '!come' && data[1] == myPlayer.id) {
            playerFollowerGlobal = true;
        }
        if (data[2].toLocaleLowerCase() == '!stop' && data[1] == myPlayer.id) {
            playerFollowerGlobal = false;
        }
        if (data[2].toLocaleLowerCase() == '!go' && data[1] == myPlayer.id) { //lazy to do mouse move
            ffs = true;
        }
        if (data[2].toLocaleLowerCase() == '!stopp' && data[1] == myPlayer.id) {
            ffs = false;
        }
        if (data[2].toLowerCase() == "!aim" && data[1] == myPlayer.id) { // aim to cursor
            cursor = !cursor
        }
        if (data[2].toLowerCase() == "!f" && data[1] == myPlayer.id) { // follow
            playerFollowerGlobal = true
            followingfarm = false
            ffs = false
            for (let i in sockets) {
                sockets[i].attack = false
            }
            autoattack = false
        }
        if (data[2].toLowerCase().startsWith("!let") && data[1] == myPlayer.id) { // come
            let pl = playerss.find(e=>e.name.toLowerCase().startsWith(data[2].slice(5).toLowerCase()))
            friend.push(pl.sid)
        }
        if (data[2].toLowerCase() == "!rlet" && data[1] == myPlayer.id) {
            friend = []
        }
        if (data[2].toLowerCase().includes("!send") && data[1] == myPlayer.id) { // send bot
            if(!isNaN(data[2].slice(6))) {
                for (let i2 = 0; i2 < data[2].slice(6); i2++) {
                    grecaptcha.execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", { action: "homepage" }).then((function(e) {
                        wsType(`${document.ws.url.split("?")[0]}?token=re:${encodeURIComponent(e)}`);
                    }))
                }
            }
        }
        if (data[2].toLocaleLowerCase() == '!-' && data[1] == myPlayer.id) {
            setTimeout(() => {
                let kk;
                let host = "127.0.0.1" !== location.hostname && !location.hostname.startsWith("192.168.");
                for (let i2 = 0; i2 < 4; i2++) {
                    true && (kk = !0, host ? document.gr.execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", { action: "homepage" }).then((function(e) {
                        wsType(`${document.ws.url.split("?")[0]}?token=re:${encodeURIComponent(e)}`);
                    })) : null);
                }
            }, 100);
        }
    }
    if(data[0] == "O" && data[1] == myPlayer.id) {
        if(data[2] < 90 && data[2] > 0) {
            if (healToggle) {
                setTimeout(() => {
                    doNewSend(['G', [foodType, null]]);
                    doNewSend(['d', [1]]);
                    doNewSend(['d', [0]]);
                    doNewSend(['G', [null]]);
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
let commandList = ["!wood", "!food", "!stone", "!gold", "~age", "~wood", "~food", "~stone", "~gold", "!attack on", "!attack off"]
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m) {
    if (!ws) {
        ws = this;
        document.ws = this;
        this.addEventListener('message', e => { handleMessage(e); });
        this.addEventListener('close', () => { closed = true; });
    }
    if (!closed) {
        if (msgpack5.decode(m)[0] !== "D" && msgpack5.decode(m)[0] !== "d" && msgpack5.decode(m)[0] !== "a" && msgpack5.decode(m)[0] !== "6" && msgpack5.decode(m)[0] !== "H" && msgpack5.decode(m)[0] !== "G" && msgpack5.decode(m)[0] !== "c" && msgpack5.decode(m)[0] !== "K") {
            this.oldSend(m);
        }
        if (msgpack5.decode(m)[0] == "d") {
            sendForAll(msgpack5.decode(m));
        }
        if (msgpack5.decode(m)[0] == "H") {
            sendForAll(msgpack5.decode(m), true);
        }
        if (msgpack5.decode(m)[0] == "G") {
            sendForAll(msgpack5.decode(m));
        }
        if (msgpack5.decode(m)[0] == "K") {
            if (msgpack5.decode(m)[1][0] == 1) {
                autoAttack = !autoAttack;
            }
            if (msgpack5.decode(m)[1][0] == 0) {
                freeze = !freeze;
            }
            sendForAll(msgpack5.decode(m), true);
        }
        if (msgpack5.decode(m)[0] == "6") {
            try {
                this.oldSend(m);
                if (msgpack5.decode(m)[1][0].toLocaleLowerCase() !== '!f' && msgpack5.decode(m)[1][0].toLocaleLowerCase() !== '!fs' && msgpack5.decode(m)[1][0].toLocaleLowerCase().split(" ")[0] !== '!join' && msgpack5.decode(m)[1][0].toLocaleLowerCase().split(" ")[0] !== '!leave' && msgpack5.decode(m)[1][0].toLocaleLowerCase().split(" ")[0] !== '!bye' && !commandList.includes(msgpack5.decode(m)[1][0].toLocaleLowerCase()) && !(msgpack5.decode(m)[1][0].toLocaleLowerCase().startsWith("!let") || msgpack5.decode(m)[1][0].toLocaleLowerCase().startsWith("!rlet"))) {
                    for (let i in sockets) {
                        sockets[i].oldSend(m);
                    }
                }
            } catch (err) {}
        }
        if (msgpack5.decode(m)[0] == "c") {
            sendForAll(msgpack5.decode(m), true);
        }
        if (msgpack5.decode(m)[0] == "a") {
            this.oldSend(m);
            for (let i in sockets) {
                if (!sockets[i].playerFollower && !playerFollowerGlobal && !ffs) {
                    sockets[i].oldSend(m);
                }
            }
        }
    }
}
let sendForAll = (e, count) => {
    doNewSend(e);
    try {
        if(Object.keys(sockets).filter(e=>e!=undefined).length > 0 && (!count?followingfarm == false:true)) {
            for (let i in sockets) {
                sockets[i].oldSend(new Uint8Array(Array.from(msgpack5.encode(e))));
            }
        }
    } catch (err) {

    }
};

let friend = []
let autoattack = false

function wsType(e) {
    let ws = new WebSocket(e);
    //console.log(e);
    ws.playerFollower = true;
    ws.autoAttackWithAim3;
    ws.autoAttackWithAim4 = [false, null];
    ws.autoAttackWithAim5 = [false, null]
    ws.attack = false
    ws.autoattack2 = false
    let bot = {}, age = 1;
    let attacking = false, attacking2 = false
    ws.binaryType = "arraybuffer";
    let doNewSend = (e) => {
        ws.connected && (ws.oldSend(new Uint8Array(Array.from(msgpack5.encode(e)))));
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
            ws.connected = !0
            let place = (e, t = dir) => {
                doNewSend(['G', [e, null]]);
                doNewSend(['d', [1, t]]);
                doNewSend(['d', [0, t]]);
                doNewSend(['G', [null]]);
            }
            ws.key23 = null;
            document.addEventListener('keydown', e => {
                if (ws.key23 !== e.keyCode && ws.connected) {
                    ws.key23 = e.keyCode;
                    if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea" && !document.getElementById('chatHolder').offsetParent) {
                        if (e.keyCode == 82) {
                            if(e.repeat) return
                            ws.autoaim = true
                            doNewSend(["D", [cursor?(Math.atan2((myPlayer.y - bot.y) + mouseY - (height / 2), (myPlayer.x - bot.x) + mouseX - (width / 2))):ws.nearestEnemyAngle]])
                            doNewSend(["K", [1]])
                            doNewSend(["G", [15, 1]])
                            setTimeout(() => {
                                ws.autoaim = false
                                doNewSend(["K", [1]])
                            }, 130)
                        }
                        /*if (e.keyCode == 84) {
                            ws.autoaim = true;
                            doNewSend(["13c", [1, 6, 0]]);
                            doNewSend(["13c", [1, 7, 0]]);
                            doNewSend(["13c", [1, 53, 0]]);
                            doNewSend(["13c", [1, 21, 0]]);
                            ws.autoAttackWithAim3 = true;
                            doNewSend(['c', [1]])
                            doNewSend(["H", [5]]);
                            doNewSend(["H", [17]]);
                            doNewSend(["H", [31]]);
                            doNewSend(["H", [23]]);
                            doNewSend(["H", [9]]);
                            doNewSend(["H", [18]]);
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
                        }*/
                        /*if (e.keyCode == 45) {
doNewSend(['ch', ['Autoinsta:true']]);
                            doNewSend(["13c", [1, 6, 0]]);
                            doNewSend(["13c", [1, 7, 0]]);
                            doNewSend(["13c", [1, 53, 0]]);
                            ws.autoInsta = true;
                        }
                        if (e.keyCode == 46) {
doNewSend(['ch', ['Autoinsta:false']]);
                            ws.autoInsta = false;
                        }*/
                    }
                }
            })
            document.addEventListener('keyup', e => {
                ws.key23 = null;
            })
            //setInterval(() => {

                /*if (healer) {
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
                }*/
            //}, 100)
            ws.primary = 0;
            ws.foodType = 0;
            ws.wallType = 3;
            ws.spikeType = 6;
            ws.millType = 10;
            doNewSend(['M', [{name: localStorage.moo_name, moofoll: "lol", skin: 4}]]);
        }
        let place2 = (e, t = dir) => {
                doNewSend(['G', [e, null]]);
                doNewSend(['d', [1, t]]);
                doNewSend(['d', [0, t]]);
                doNewSend(['G', [null]]);
            }
        if (item == "C" && !bot.id) {
            bot.id = data[1];
            if (sockets) {
                sockets[data[1]] = ws;
                bots[data[1]] = bot;
            }
        }
        if (item == "P") {
            ws.primary = 0;
            ws.foodType = 0;
            ws.wallType = 3;
            ws.spikeType = 6;
            ws.millType = 10;
            age = 1;
            if (!autoAttack && !freeze) {
                doNewSend(['M', [{name: localStorage.moo_name, moofoll: "acool", skin: 4}]]);
            } else {
                ws.JustDied = true;
            }
        }
        if (ws.JustDied) {
            if (!autoAttack && !freeze) {
                ws.JustDied = false;
                doNewSend(['M', [{name: localStorage.moo_name, moofoll: "u GaY", skin: 4}]]);
            }
        }
        if (item == "a") {
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
            bots[bot.id] = bot
            //place2(ws.millType, null);
            if(ws.enemiesNear) {
                ws.nearestEnemy = ws.enemiesNear.sort((a,b) => dist(a, bot) - dist(b, bot))[0];
            }
            if(ws.nearestEnemy) {
                ws.nearestEnemyAngle = Math.atan2(ws.nearestEnemy[2]-bot.y, ws.nearestEnemy[1]-bot.x);
                if(ws.attack == true) {
                    if(Math.sqrt(Math.pow(ws.nearestEnemy[1] - bot.x, 2)+Math.pow(ws.nearestEnemy[2] - bot.y, 2)) <= 240) {
                        ws.autoattack2 = true
                        if(bot.weapon !== ws.primary) {
                            bot.weapon = ws.primary
                            doNewSend(["G", [ws.primary, 1]])
                        }
                        ws.autoAttackWithAim5 = [true, ws.nearestEnemyAngle]
                    } else {
                        if(ws.autoattack2 == true) {
                            ws.autoattack2 = false
                            ws.autoAttackWithAim5 = [false, null]
                            doNewSend(["d", [0]])
                        }
                    }
                    doNewSend(["a", [ws.nearestEnemyAngle]])
                }
            } else {
                if(ws.autoattack2 == true) {
                    ws.autoattack2 = false
                    ws.autoAttackWithAim5 = [false, null]
                    doNewSend(["d", [0]])
                    doNewSend(["a", [null]])
                }
            }
            /*if(Math.sqrt(Math.pow((bot.y-ws.nearestEnemy[2]), 2) + Math.pow((bot.x-ws.nearestEnemy[1]), 2)) < 500) {
                    ws.isEnemyNear = true;
                    if(!ws.autoaim && bot.hat != 7 && bot.hat != 53) {
                        ws.normalHat = 6;
                        if(ws.primary != 8) {
                            ws.normalAcc = 21;
                        }
                    };
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
            }*/

            if(hatToggle) {
                if(ws.oldHat != ws.normalHat) {
                    doNewSend(['c', [1, ws.normalHat, 0]]);
                    doNewSend(['c', [0, ws.normalHat, 0]]);
                }
                if(ws.oldAcc != ws.normalAcc) {
                    doNewSend(['c', [1, ws.normalAcc, 1]]);
                    doNewSend(['c', [0, ws.normalAcc, 1]]);
                }
                ws.oldHat = ws.normalHat;
                ws.oldAcc = ws.normalAcc;
            }
            if (ws.nearestEnemy && ws.autoInsta) {
                if (Math.sqrt(Math.pow((bot.y-ws.nearestEnemy[2]), 2) + Math.pow((bot.x-ws.nearestEnemy[1]), 2)) < 215) {
                    ws.autoInsta = false;
                    ws.autoaim = true;
                    doNewSend(['a', [ws.nearestEnemyAngle]]);
                    setTimeout(() => {
                        doNewSend(['a', []]);
                        doNewSend(['c', [0, 11, 1]]);
                    }, 300)
                    doNewSend(['c', [0, 0, 1]])
                    doNewSend(['c', [0, 19, 1]])
                    doNewSend(['c', [0, 7, 0]])
                    doNewSend(["G", [ws.primary, 1]]);
                    for (let i = 0; i < 25; i++) {
                        doNewSend(['d', [1, ws.nearestEnemyAngle]]);
                    }
                    setTimeout(() => {
                        doNewSend(['c', [0, 53, 0]]);
                        doNewSend(["G", [ws.secondary, 1]]);
                        setTimeout(() => {
                            ws.autoaim = false;
                            doNewSend(["G", [ws.primary, 1]]);
                            if (!empToggle) {
                                doNewSend(["c", [1, 6, 0]]);
                                doNewSend(["c", [0, 6, 0]]);
                            }
                            if (empToggle) {
                                doNewSend(["c", [1, 22, 0]]);
                                doNewSend(["c", [0, 22, 0]]);
                            }
                            doNewSend(['K', [1]]);
                            doNewSend(['d', [0]]);
                        }, 270);
                    }, 130);
                }
            }
            if ((ws.playerFollower || playerFollowerGlobal) && !followingfarm && !ws.autoattack2) {
                if (Math.sqrt(Math.pow((bot.y - pointingOnPosition.y), 2) + Math.pow((bot.x - pointingOnPosition.x), 2)) < (Object.keys(sockets).filter(e=>e!=undefined).length > 3 ? 160 : 105)) {
                    doNewSend(['a', []]);
                } else {
                    doNewSend(['a', [Math.atan2(pointingOnPosition.y - bot.y, pointingOnPosition.x - bot.x)]]);
                }
            } else if (followingfarm == true && followingtype !== null) {
                if(followingtype == "wood") {
                    let nearestWood = treeList.sort((a, b) => {return Math.sqrt(Math.pow(a.x - myPlayer.x, 2)+Math.pow(a.y - myPlayer.y, 2)) - Math.sqrt(Math.pow(b.x - myPlayer.x, 2)+Math.pow(b.y - myPlayer.y, 2))})[0]
                    if(Math.sqrt(Math.pow(nearestWood.x - bot.x, 2) + Math.pow(nearestWood.y - bot.y, 2)) < 165) {
                        doNewSend(["a", [null]])
                        ws.autoAttackWithAim4 = [true, Math.atan2(nearestWood.y - bot.y, nearestWood.x - bot.x)]
                    } else {
                        doNewSend(["a", [Math.atan2(nearestWood.y - bot.y, nearestWood.x - bot.x)]])
                    }
                } else if (followingtype == "bush") {
                    let nearestBush = bushList.sort((a, b) => {return Math.sqrt(Math.pow(a.x - myPlayer.x, 2)+Math.pow(a.y - myPlayer.y, 2)) - Math.sqrt(Math.pow(b.x - myPlayer.x, 2)+Math.pow(b.y - myPlayer.y, 2))})[0]
                    if(Math.sqrt(Math.pow(nearestBush.x - bot.x, 2) + Math.pow(nearestBush.y - bot.y, 2)) < 100) {
                        doNewSend(["a", [null]])
                        ws.autoAttackWithAim4 = [true, Math.atan2(nearestBush.y - bot.y, nearestBush.x - bot.x)]
                    } else {
                        doNewSend(["a", [Math.atan2(nearestBush.y - bot.y, nearestBush.x - bot.x)]])
                    }
                } else if (followingtype == "stone") {
                    let nearestStone = stoneList.sort((a, b) => {return Math.sqrt(Math.pow(a.x - myPlayer.x, 2)+Math.pow(a.y - myPlayer.y, 2)) - Math.sqrt(Math.pow(b.x - myPlayer.x, 2)+Math.pow(b.y - myPlayer.y, 2))})[0]
                    if(Math.sqrt(Math.pow(nearestStone.x - bot.x, 2) + Math.pow(nearestStone.y - bot.y, 2)) < 140) {
                        doNewSend(["a", [null]])
                        ws.autoAttackWithAim4 = [true, Math.atan2(nearestStone.y - bot.y, nearestStone.x - bot.x)]
                    } else {
                        doNewSend(["a", [Math.atan2(nearestStone.y - bot.y, nearestStone.x - bot.x)]])
                    }
                } else if (followingtype == "gold") {
                    let nearestGold = goldList.sort((a, b) => {return Math.sqrt(Math.pow(a.x - myPlayer.x, 2)+Math.pow(a.y - myPlayer.y, 2)) - Math.sqrt(Math.pow(b.x - myPlayer.x, 2)+Math.pow(b.y - myPlayer.y, 2))})[0]
                    if(Math.sqrt(Math.pow(nearestGold.x - bot.x, 2) + Math.pow(nearestGold.y - bot.y, 2)) < 140) {
                        doNewSend(["a", [null]])
                        ws.autoAttackWithAim4 = [true, Math.atan2(nearestGold.y - bot.y, nearestGold.x - bot.x)]
                    } else {
                        doNewSend(["a", [Math.atan2(nearestGold.y - bot.y, nearestGold.x - bot.x)]])
                    }
                }
            } else if (followingfarm == false && followingtype !== null) {
                followingtype = null
                ws.autoAttackWithAim4 = [false, null]
                doNewSend(["d", [0]])
            }
            if (ffs) {
                if (ffsps !== Math.atan2((myPlayer.y - bot.y) + mouseY - (height / 2), (myPlayer.x- bot.x) + mouseX - (width / 2))) {
                    ffsps = Math.atan2((myPlayer.y - bot.y) + mouseY - (height / 2), (myPlayer.x- bot.x) + mouseX - (width / 2));
                    if (!ws.autoaim) {
                        doNewSend(['D', [ffsps]]);
                    }
                    doNewSend(['a', [ffsps]]);
                }
            }
            /*if (ws.autoaim) {
                doNewSend(['2', [ws.nearestEnemyAngle]]);
            }*/
            if (ws.autoAttackWithAim4[0] == true && followingfarm == true) {
                attacking = true
                doNewSend(['d', [1, ws.autoAttackWithAim4[1]]]);
                doNewSend(['D', [ws.autoAttackWithAim4[1]]])
            } else if (followingfarm == false && attacking == true) {
                attacking = false
                doNewSend(["d", [0]])
            }
            if (ws.autoAttackWithAim5[0] == true && ws.attack == true) {
                attacking2 = true
                doNewSend(['d', [1, ws.autoAttackWithAim5[1]]]);
                doNewSend(['D', [ws.autoAttackWithAim5[1]]])
            } else if (ws.attack == false && attacking2 == true) {
                attacking2 = false
                doNewSend(["d", [0]])
            }
        }
        if (item == "N") {
            if(data[1] == "kills") {
                sendForAll(["6", ["gg - Get Deleted"]], true)
            }
            bot && (bot[data[1]] = data[2])
        }
        if (item == "6") {
            if(data[1] == myPlayer.id || friend.includes(data[1])) {
                if(data[2].toLowerCase() == "~age") {
                    doNewSend(["6", [age.toString()]])
                }
                if (data[2].toLowerCase() == "!wood") {
                    followingfarm = true
                    followingtype = "wood"
                }
                if (data[2].toLowerCase() == "!food") {
                    followingfarm = true
                    followingtype = "bush"
                }
                if (data[2].toLowerCase() == "!stone") {
                    followingfarm = true
                    followingtype = "stone"
                }
                if (data[2].toLowerCase() == "!gold") {
                    followingfarm = true
                    followingtype = "gold"
                }
                if (data[2].toLowerCase() == "~wood") {
                    doNewSend(["6", [bot.wood?bot.wood.toString():"100"]])
                }
                if (data[2].toLowerCase() == "~food") {
                    doNewSend(["6", [bot.food?bot.food.toString():"100"]])
                }
                if (data[2].toLowerCase() == "~stone") {
                    doNewSend(["6", [bot.stone?bot.stone.toString():"100"]])
                }
                if (data[2].toLowerCase() == "~gold") {
                    doNewSend(["6", [bot.points?bot.points.toString():"100"]])
                }
                if (data[2].toLowerCase() == "!attack on") {
                    ws.attack = true
                    autoattack = true
                } else if (data[2].toLowerCase() == "!attack off") {
                    ws.attack = false
                    ws.autoAttackWithAim4 = [false, null]
                    doNewSend(["d", [0]])
                    autoattack = false
                }
                if (data[2].toLowerCase().startsWith("!b")) {
                    let hat = hats.find(e=>e.name.toLowerCase().startsWith(data[2].slice(3)))
                    if(hat !== undefined) {
                        if(bot.points >= hat.price) {
                            doNewSend(["c", [1, hat.id, 0]])
                            doNewSend(["6", ["Bought" + hat.name]])
                        } else {
                            doNewSend(["6", ["Not Enough Gold"]])
                        }
                    } else {
                        doNewSend(["6", ["Hat Is Undefined"]])
                    }
                }
            }


        }
        if (item == "T") {
            null != data[3] && (age = data[3])
        }
        if (item == "V") {
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
        if (item == "6") {
            let ch = data;
            if (ch[2].toLocaleLowerCase() == '!"' && ch[1] == myPlayer.id) {
                ws.playerFollower = true;
                doNewSend(['a', []]);
            }
            if (ch[2].toLocaleLowerCase() == '!*' && ch[1] == myPlayer.id) {
                ws.playerFollower = false;
                doNewSend(['a', []]);
            }
            if (ch[2].toLocaleLowerCase() == '!+' && ch[1] == myPlayer.id) {
                ws.playerFollower = false;
                doNewSend(['a', []]);
            }
            if ((ch[2].toLocaleLowerCase()).split(' ')[0] == '!join' && ch[1] == myPlayer.id) {
                doNewSend(['b', [ch[2].toLocaleLowerCase().split(' ')[1]]]);
            }
            if ((ch[2].toLocaleLowerCase()).split(' ')[0] == '!leave' && ch[1] == myPlayer.id) {
                doNewSend(['N', [null]]);
            }
        }
        if (item == "g") {
            if (data[1].owner == myPlayer.id) {
                setTimeout(() => {
                    doNewSend(['b', [data[1].sid]]);
                }, 100);
            }
        }
        if(data[0] == "O" && data[1] == bot.id) {
            if(data[2] < 90 && data[2] > 0) {
                setTimeout(() => {
                    doNewSend(['G', [ws.foodType, null]]);
                    doNewSend(['d', [1]]);
                    doNewSend(['d', [0]]);
                    doNewSend(['G', [null]]);
                }, 100)
            }
        }
    }
    ws.onmessage = (e) => {
        msgFnc(e);
    }
    ws.onclose = () => {
        delete sockets[bot.id]
        delete bots[bot.id]
        ws.connected = !1
    }
}