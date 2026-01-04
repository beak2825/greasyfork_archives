// ==UserScript==
// @name         MultiBox For Cowgame
// @version      3
// @description  Unlimited bots spawn with proxies destroy ppl do copycat action of player [bypass altcha]
// @author       Ha Thu
// @namespace    hathu
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @icon         https://cheatx.ygto.com/cxteam.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541453/MultiBox%20For%20Cowgame.user.js
// @updateURL https://update.greasyfork.org/scripts/541453/MultiBox%20For%20Cowgame.meta.js
// ==/UserScript==

// Blocked Country Current By Josh : Vietnam, Frence, NetherLand, Russia, Singapore(Less if ip not get dirty), UK, USA
// if ip get dirty it will cannot spawn(actually blocked that why) list country blocked ^^^^ if ip not dirty it will enter game normal otherwise blocked
// auto bypass dont enter the game! [new method]

// command : !send [value] / for the spawn bot | !f / follow | !wood (food stone gold) / farm the resources | !aim / for aim bot to the cursor | !dc multibox / disconnect the bot and self

// I M P O R T A N T !

// READ THIS
// i am bypass it so enjoy destroy ppl
// You may use vpn to spawn bot cuz develop limit ip now
// My Discord : harryhathu._.
// again! you need to using vpn ip limit is 2 one token = 1 bots to max 1 ip = 2 bots
// using proxies for spawn


function getEl(id) {
    return document.getElementById(id);
}

(function () {
    'use strict';
    const style = document.createElement('style');
    style.innerHTML = `
        #modMenu {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 460px;
            height: 420px;
            background: #1c1c1c;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
            padding: 20px;
            color: white;
            font-family: Arial, sans-serif;
            opacity: 0;
            z-index: 10000;
            transition: opacity 0.8s ease;
            pointer-events: none;
        }

        #modMenu.show {
            opacity: 1;
            pointer-events: all;
        }

        #modMenu.hide {
            opacity: 0;
            pointer-events: none;
        }

        #modMenu .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        #modMenu .header .title {
            font-size: 22px;
            font-weight: bold;
            display: flex;
            align-items: center;
        }

        #modMenu .header .version {
            font-size: 14px;
            margin-left: 8px;
            color: #4caf50;
            opacity: 0.9;
        }

        #modMenu .search-icon {
            font-size: 24px;
            color: #999;
            cursor: pointer;
            transition: color 0.3s ease, transform 0.3s ease;
        }

        #modMenu .search-icon:hover {
            color: #4caf50;
            transform: scale(1.1);
        }

        #modMenu .search-bar {
            display: none;
            margin-top: 5px;
            background: #2c2c2c;
            border-radius: 8px;
            padding: 8px 12px;
            transition: max-height 0.3s ease, padding 0.3s ease, margin-top 0.3s ease;
            max-height: 0;
            overflow: hidden;
        }

        #modMenu .search-bar.open {
            display: block;
            max-height: 50px;
            padding: 8px 12px;
            margin-top: 5px;
        }

        #modMenu .search-bar input {
            width: 100%;
            border: none;
            background: transparent;
            color: white;
            font-size: 14px;
            outline: none;
        }

        #modMenu .tabs {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            transition: margin-top 0.3s ease;
        }

        #modMenu .tab {
            flex: 1;
            text-align: center;
            padding: 10px;
            margin: 0 5px;
            background: #333;
            border-radius: 8px;
            transition: background 0.3s ease, transform 0.2s ease;
            font-size: 14px;
            cursor: pointer;
        }

        #modMenu .tab:hover {
            background: #555;
            transform: scale(1.05);
        }

        #modMenu .tab.active {
            background: #4caf50;
            color: white;
        }

        #modMenu .content {
            height: 240px;
            overflow-y: auto;
            display: none;
            transition: opacity 0.3s ease;
        }

        #modMenu .content.active {
            display: block;
            opacity: 1;
        }

        #modMenu .content.inactive {
            opacity: 0;
        }

        .toggle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 12px 0;
            font-size: 16px;
        }

        .toggle-switch {
            position: relative;
            width: 50px;
            height: 25px;
            background: #ccc;
            border-radius: 50px;
            cursor: pointer;
            transition: background 0.3s ease;
        }

        .toggle-switch::before {
            content: '';
            position: absolute;
            width: 23px;
            height: 23px;
            background: white;
            border-radius: 50%;
            top: 1px;
            left: 1px;
            transition: transform 0.3s ease;
        }

        .toggle-switch.active {
            background: #4caf50;
        }

        .toggle-switch.active::before {
            transform: translateX(25px);
        }

        .toggle-switch input {
            display: none;
        }
    `;
    document.head.appendChild(style);
    const menu = document.createElement('div');
    menu.id = 'modMenu';
    menu.innerHTML = `
        <div class="header">
            <div class="title">
                CheatCore<span class="version">v1</span>
            </div>
            <div class="search-icon" id="searchIcon">🔍</div>
        </div>
        <div class="search-bar" id="searchBar">
            <input type="text" placeholder="Search functions..." id="functionSearch">
        </div>
        <div class="tabs">
            <div class="tab active" data-tab="bots">Bots</div>
            <div class="tab" data-tab="combat">Visuals</div>
            <div class="tab" data-tab="modules">Modules</div>
        </div>
        <div class="content active" id="content-bots">
            <div class="toggle">
                Enable Auto Spawn
                <div class="toggle-switch" data-option="autoSpawn">
                    <input type="checkbox" id="autoSpawn">
                </div>
            </div>
        </div>
        <div class="content" id="content-combat">
            <div class="toggle">
                Disable Wiggle
                <div class="toggle-switch" data-option="disableWiggle">
                    <input type="checkbox" id="disableWiggle">
                </div>
            </div>
            <div class="toggle">
                Disable Hit Animation
                <div class="toggle-switch" data-option="disableHitAnimation">
                    <input type="checkbox" id="disableHitAnimation">
                </div>
            </div>
            <div class="toggle">
            Draw Player In Near
                <div class="toggle-switch" data-option="drawplayer">
                    <input type="checkbox" id="drawplayer">
                </div>
            </div>
        </div>
        <div class="content" id="content-modules">
            <div class="toggle">
                Draw Tracers(Useless)
                <div class="toggle-switch" data-option="tracers">
                    <input type="checkbox" id="tracers">
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(menu);
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            document.querySelectorAll('.content').forEach(content => content.classList.remove('active'));
            document.getElementById(`content-${tab.dataset.tab}`).classList.add('active');
        });
    });
    document.querySelectorAll('.toggle-switch').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const checkbox = toggle.querySelector('input');
            checkbox.checked = !checkbox.checked;

            toggle.classList.toggle('active', checkbox.checked);
            const option = toggle.dataset.option;
            console.log(`${option}: ${checkbox.checked ? 'Enabled' : 'Disabled'}`);
        });
    });
    let isMenuVisible = false;
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            isMenuVisible = !isMenuVisible;
            menu.classList.toggle('show', isMenuVisible);
            menu.classList.toggle('hide', !isMenuVisible);
        }
    });
    document.getElementById('searchIcon').addEventListener('click', () => {
        const searchBar = document.getElementById('searchBar');
        const tabs = document.querySelector('.tabs');
        searchBar.classList.toggle('open');
        tabs.style.marginTop = searchBar.classList.contains('open') ? '30px' : '0px';
        if (searchBar.classList.contains('open')) {
            document.getElementById('functionSearch').focus();
        }
    });
    document.getElementById('functionSearch').addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        document.querySelectorAll('.toggle').forEach(toggle => {
            const text = toggle.textContent.toLowerCase();
            toggle.style.display = text.includes(searchTerm) ? 'flex' : 'none';
        });
    });
})();

let angles = [];
let point = {x: null, y: null, x2: null, y2: null}

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
            doNewSend(['z', [e, null]]);
            doNewSend(['F', [1, t]]);
            doNewSend(['F', [0, t]]);
            doNewSend(['z', [1]]);
        }
        let placeForAll = (e, t = dir) => {
            sendForAll(['z', [e, null]]);
            sendForAll(['F', [1, t]]);
            sendForAll(['F', [0, t]]);
            sendForAll(['z', [1]]);
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
                        doNewSend(["z", [15, 1]])
                        setTimeout(() => {
                            autoaim=false
                            doNewSend(["K", [1]])
                        }, 130)
                    }
                    if (e.keyCode == 70) {
                        if(e.repeat) return
                        sendForAll(["z", [boostType]])
                    }
                    if (e.keyCode == 86) {
                        if(e.repeat) return
                        sendForAll(["z", [spikeType]])
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
                doNewSend(['F', [1]]);
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
        //setTimeout(() => {
        //    let kk;
        //    let host = "127.0.0.1" !== location.hostname && !location.hostname.startsWith("192.168.");
        //    for (let i2 = 0; i2 < 4; i2++) {
        //        const urlBase = document.ws.url.split("token=")[0];
        //    altcha.generate().then(token => {
        //        const encoded = encodeURIComponent(token);
        //        wsType(`${urlBase}token=${encoded}`);
        //    });
        //    }
        //}, 100);
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
                        sendForAll(["z", [boostType]])
                        sendForAll(["F", [1, dir]])
                        sendForAll(["z", [boostType]])
                        sendForAll(["F", [1, dir+Math.PI/2]])
                        sendForAll(["z", [boostType]])
                        sendForAll(["F", [1, dir-Math.PI/2]])
                        sendForAll(["z", [boostType]])
                        sendForAll(["F", [1, dir+Math.PI]])
                        sendForAll(["F", [0]])
                        sendForAll(["z", [null]])
                    } else {
                        sendForAll(["z", [spikeType]])
                        sendForAll(["F", [1, dir]])
                        sendForAll(["z", [spikeType]])
                        sendForAll(["F", [1, dir+Math.PI/2]])
                        sendForAll(["z", [spikeType]])
                        sendForAll(["F", [1, dir-Math.PI/2]])
                        sendForAll(["z", [spikeType]])
                        sendForAll(["F", [1, dir+Math.PI]])
                        sendForAll(["F", [0]])
                        sendForAll(["z", [null]])
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
            doNewSend(['F', [1]]);
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
                doNewSend(['9', [nearestEnemyAngle]]);
                setTimeout(() => {
                    doNewSend(['9', []]);
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
                doNewSend(["z", [primary, 1]]);
                for (let i = 0; i < 25; i++) {
                    doNewSend(['F', [1, nearestEnemyAngle]]);
                }
                setTimeout(() => {
                    doNewSend(['c', [0, 53, 0]]);
                    doNewSend(["z", [15, 1]]);
                    doNewSend(["z", [secondary, 1]]);
                    setTimeout(() => {
                        autoaim = false;
                        doNewSend(["z", [primary, 1]]);
                        if (!empToggle) {
                            doNewSend(["c", [1, 6, 0]]);
                            doNewSend(["c", [0, 6, 0]]);
                        }
                        if (empToggle) {
                            doNewSend(["c", [1, 22, 0]]);
                            doNewSend(["c", [0, 22, 0]]);
                        }
                        doNewSend(['K', [1]]);
                        doNewSend(['F', [0]]);
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
        if (data[2].toLocaleLowerCase() == '!dc multibox' && data[1] == myPlayer.id) { // crash
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
                    const urlBase = document.ws.url.split("token=")[0];
            altcha.generate().then(token => {
                const encoded = encodeURIComponent(token);
                wsType(`${urlBase}token=${encoded}`);
            });
                }
            }
        }
        if (data[2].toLocaleLowerCase() == '!-' && data[1] == myPlayer.id) {
            setTimeout(() => {
                let kk;
                let host = "127.0.0.1" !== location.hostname && !location.hostname.startsWith("192.168.");
                for (let i2 = 0; i2 < 4; i2++) {
                    const urlBase = document.ws.url.split("token=")[0];
            altcha.generate().then(token => {
                const encoded = encodeURIComponent(token);
                wsType(`${urlBase}token=${encoded}`);
            });
                }
            }, 100);
        }
    }
    if(data[0] == "O" && data[1] == myPlayer.id) {
        if(data[2] > 0) {
            if (healToggle) {
                setTimeout(() => {
                    doNewSend(['z', [foodType, null]]);
                    doNewSend(['F', [1]]);
                    doNewSend(['F', [0]]);
                    doNewSend(['z', [null]]);
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
        if (msgpack5.decode(m)[0] !== "D" && msgpack5.decode(m)[0] !== "F" && msgpack5.decode(m)[0] !== "9" && msgpack5.decode(m)[0] !== "6" && msgpack5.decode(m)[0] !== "H" && msgpack5.decode(m)[0] !== "z" && msgpack5.decode(m)[0] !== "c" && msgpack5.decode(m)[0] !== "K") {
            this.oldSend(m);
        }
        if (msgpack5.decode(m)[0] == "F") {
            sendForAll(msgpack5.decode(m));
        }
        if (msgpack5.decode(m)[0] == "H") {
            sendForAll(msgpack5.decode(m), true);
        }
        if (msgpack5.decode(m)[0] == "z") {
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
        if (msgpack5.decode(m)[0] == "9") {
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
    console.log(e);
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
                doNewSend(['z', [e, null]]);
                doNewSend(['F', [1, t]]);
                doNewSend(['F', [0, t]]);
                doNewSend(['z', [null]]);
            }
            function storeEquip(id, index) {
                doNewSend(["c", [0, id, index]]);
            }

            function storeBuy(id, index) {
                doNewSend(["c", [1, id, index]]);
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
                            doNewSend(["z", [15, 1]])
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
                doNewSend(['z', [e, null]]);
                doNewSend(['F', [1, t]]);
                doNewSend(['F', [0, t]]);
                doNewSend(['z', [null]]);
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
                            doNewSend(["z", [ws.primary, 1]])
                        }
                        ws.autoAttackWithAim5 = [true, ws.nearestEnemyAngle]
                    } else {
                        if(ws.autoattack2 == true) {
                            ws.autoattack2 = false
                            ws.autoAttackWithAim5 = [false, null]
                            doNewSend(["F", [0]])
                        }
                    }
                    doNewSend(["9", [ws.nearestEnemyAngle]])
                }
            } else {
                if(ws.autoattack2 == true) {
                    ws.autoattack2 = false
                    ws.autoAttackWithAim5 = [false, null]
                    doNewSend(["F", [0]])
                    doNewSend(["9", [null]])
                }
            }
            if (ws.nearestEnemy && ws.nearestEnemy.length) {
            if(Math.sqrt(Math.pow((bot.y-ws.nearestEnemy[2]), 2) + Math.pow((bot.x-ws.nearestEnemy[1]), 2)) < 500) {
                    ws.isEnemyNear = true;
                    if(!ws.autoaim && bot.hat != 7 && bot.hat != 53) {
                        ws.normalHat = 6;
                        if(ws.primary != 8) {
                            ws.normalAcc = 21;
                        }
                    } else {
                         ws.isEnemyNear = false;
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
            }

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
                    doNewSend(['9', [ws.nearestEnemyAngle]]);
                    setTimeout(() => {
                        doNewSend(['9', []]);
                        doNewSend(['c', [0, 11, 1]]);
                    }, 300)
                    doNewSend(['c', [0, 0, 1]])
                    doNewSend(['c', [0, 19, 1]])
                    doNewSend(['c', [0, 7, 0]])
                    doNewSend(["z", [ws.primary, 1]]);
                    for (let i = 0; i < 25; i++) {
                        doNewSend(['F', [1, ws.nearestEnemyAngle]]);
                    }
                    setTimeout(() => {
                        doNewSend(['c', [0, 53, 0]]);
                        doNewSend(["z", [ws.secondary, 1]]);
                        setTimeout(() => {
                            ws.autoaim = false;
                            doNewSend(["z", [ws.primary, 1]]);
                            if (!empToggle) {
                                doNewSend(["c", [1, 6, 0]]);
                                doNewSend(["c", [0, 6, 0]]);
                            }
                            if (empToggle) {
                                doNewSend(["c", [1, 22, 0]]);
                                doNewSend(["c", [0, 22, 0]]);
                            }
                            doNewSend(['K', [1]]);
                            doNewSend(['F', [0]]);
                        }, 270);
                    }, 130);
                }
            }
            if ((ws.playerFollower || playerFollowerGlobal) && !followingfarm && !ws.autoattack2) {
                if (Math.sqrt(Math.pow((bot.y - pointingOnPosition.y), 2) + Math.pow((bot.x - pointingOnPosition.x), 2)) < (Object.keys(sockets).filter(e=>e!=undefined).length > 3 ? 160 : 105)) {
                    doNewSend(['9', []]);
                } else {
                    doNewSend(['9', [Math.atan2(pointingOnPosition.y - bot.y, pointingOnPosition.x - bot.x)]]);
                }
            } else if (followingfarm == true && followingtype !== null) {
                if(followingtype == "wood") {
                    let nearestWood = treeList.sort((a, b) => {return Math.sqrt(Math.pow(a.x - myPlayer.x, 2)+Math.pow(a.y - myPlayer.y, 2)) - Math.sqrt(Math.pow(b.x - myPlayer.x, 2)+Math.pow(b.y - myPlayer.y, 2))})[0]
                    if(Math.sqrt(Math.pow(nearestWood.x - bot.x, 2) + Math.pow(nearestWood.y - bot.y, 2)) < 165) {
                        doNewSend(["9", [null]])
                        ws.autoAttackWithAim4 = [true, Math.atan2(nearestWood.y - bot.y, nearestWood.x - bot.x)]
                    } else {
                        doNewSend(["9", [Math.atan2(nearestWood.y - bot.y, nearestWood.x - bot.x)]])
                    }
                } else if (followingtype == "bush") {
                    let nearestBush = bushList.sort((a, b) => {return Math.sqrt(Math.pow(a.x - myPlayer.x, 2)+Math.pow(a.y - myPlayer.y, 2)) - Math.sqrt(Math.pow(b.x - myPlayer.x, 2)+Math.pow(b.y - myPlayer.y, 2))})[0]
                    if(Math.sqrt(Math.pow(nearestBush.x - bot.x, 2) + Math.pow(nearestBush.y - bot.y, 2)) < 100) {
                        doNewSend(["9", [null]])
                        ws.autoAttackWithAim4 = [true, Math.atan2(nearestBush.y - bot.y, nearestBush.x - bot.x)]
                    } else {
                        doNewSend(["9", [Math.atan2(nearestBush.y - bot.y, nearestBush.x - bot.x)]])
                    }
                } else if (followingtype == "stone") {
                    let nearestStone = stoneList.sort((a, b) => {return Math.sqrt(Math.pow(a.x - myPlayer.x, 2)+Math.pow(a.y - myPlayer.y, 2)) - Math.sqrt(Math.pow(b.x - myPlayer.x, 2)+Math.pow(b.y - myPlayer.y, 2))})[0]
                    if(Math.sqrt(Math.pow(nearestStone.x - bot.x, 2) + Math.pow(nearestStone.y - bot.y, 2)) < 140) {
                        doNewSend(["9", [null]])
                        ws.autoAttackWithAim4 = [true, Math.atan2(nearestStone.y - bot.y, nearestStone.x - bot.x)]
                    } else {
                        doNewSend(["9", [Math.atan2(nearestStone.y - bot.y, nearestStone.x - bot.x)]])
                    }
                } else if (followingtype == "gold") {
                    let nearestGold = goldList.sort((a, b) => {return Math.sqrt(Math.pow(a.x - myPlayer.x, 2)+Math.pow(a.y - myPlayer.y, 2)) - Math.sqrt(Math.pow(b.x - myPlayer.x, 2)+Math.pow(b.y - myPlayer.y, 2))})[0]
                    if(Math.sqrt(Math.pow(nearestGold.x - bot.x, 2) + Math.pow(nearestGold.y - bot.y, 2)) < 140) {
                        doNewSend(["9", [null]])
                        ws.autoAttackWithAim4 = [true, Math.atan2(nearestGold.y - bot.y, nearestGold.x - bot.x)]
                    } else {
                        doNewSend(["9", [Math.atan2(nearestGold.y - bot.y, nearestGold.x - bot.x)]])
                    }
                }
            } else if (followingfarm == false && followingtype !== null) {
                followingtype = null
                ws.autoAttackWithAim4 = [false, null]
                doNewSend(["F", [0]])
            }
            if (ffs) {
                if (ffsps !== Math.atan2((myPlayer.y - bot.y) + mouseY - (height / 2), (myPlayer.x- bot.x) + mouseX - (width / 2))) {
                    ffsps = Math.atan2((myPlayer.y - bot.y) + mouseY - (height / 2), (myPlayer.x- bot.x) + mouseX - (width / 2));
                    if (!ws.autoaim) {
                        doNewSend(['D', [ffsps]]);
                    }
                    doNewSend(['9', [ffsps]]);
                }
            }
            /*if (ws.autoaim) {
                doNewSend(['2', [ws.nearestEnemyAngle]]);
            }*/
            if (ws.autoAttackWithAim4[0] == true && followingfarm == true) {
                attacking = true
                doNewSend(['F', [1, ws.autoAttackWithAim4[1]]]);
                doNewSend(['D', [ws.autoAttackWithAim4[1]]])
            } else if (followingfarm == false && attacking == true) {
                attacking = false
                doNewSend(["F", [0]])
            }
            if (ws.autoAttackWithAim5[0] == true && ws.attack == true) {
                attacking2 = true
                doNewSend(['F', [1, ws.autoAttackWithAim5[1]]]);
                doNewSend(['D', [ws.autoAttackWithAim5[1]]])
            } else if (ws.attack == false && attacking2 == true) {
                attacking2 = false
                doNewSend(["F", [0]])
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
                    doNewSend(["F", [0]])
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
                doNewSend(['9', []]);
            }
            if (ch[2].toLocaleLowerCase() == '!*' && ch[1] == myPlayer.id) {
                ws.playerFollower = false;
                doNewSend(['9', []]);
            }
            if (ch[2].toLocaleLowerCase() == '!+' && ch[1] == myPlayer.id) {
                ws.playerFollower = false;
                doNewSend(['9', []]);
            }
            if (ch[2].toLocaleLowerCase() == '!close' && ch[1] == myPlayer.id) {
                ws.close();
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
            if(data[2] > 0) {
                setTimeout(() => {
                    doNewSend(['z', [ws.foodType, null]]);
                    doNewSend(['F', [1]]);
                    doNewSend(['F', [0]]);
                    doNewSend(['z', [null]]);
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



(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) {
    return;
  }
  for (const s of document.querySelectorAll("link[rel=\"modulepreload\"]")) {
    n(s);
  }
  new MutationObserver(s => {
    for (const r of s) {
      if (r.type === "childList") {
        for (const o of r.addedNodes) {
          if (o.tagName === "LINK" && o.rel === "modulepreload") {
            n(o);
          }
        }
      }
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function i(s) {
    const r = {};
    if (s.integrity) {
      r.integrity = s.integrity;
    }
    if (s.referrerPolicy) {
      r.referrerPolicy = s.referrerPolicy;
    }
    if (s.crossOrigin === "use-credentials") {
      r.credentials = "include";
    } else if (s.crossOrigin === "anonymous") {
      r.credentials = "omit";
    } else {
      r.credentials = "same-origin";
    }
    return r;
  }
  function n(s) {
    if (s.ep) {
      return;
    }
    s.ep = true;
    const r = i(s);
    fetch(s.href, r);
  }
})();
var Ct = 4294967295;
function al(e, t, i) {
  var n = i / 4294967296;
  var s = i;
  e.setUint32(t, n);
  e.setUint32(t + 4, s);
}
function zo(e, t, i) {
  var n = Math.floor(i / 4294967296);
  var s = i;
  e.setUint32(t, n);
  e.setUint32(t + 4, s);
}
function Bo(e, t) {
  var i = e.getInt32(t);
  var n = e.getUint32(t + 4);
  return i * 4294967296 + n;
}
function ll(e, t) {
  var i = e.getUint32(t);
  var n = e.getUint32(t + 4);
  return i * 4294967296 + n;
}
var Vn;
var Nn;
var Un;
var Rn = (typeof process === "undefined" || ((Vn = process == null ? undefined : process.env) === null || Vn === undefined ? undefined : Vn.TEXT_ENCODING) !== "never") && typeof TextEncoder !== "undefined" && typeof TextDecoder !== "undefined";
function vr(e) {
  for (var t = e.length, i = 0, n = 0; n < t;) {
    var s = e.charCodeAt(n++);
    if (s & 4294967168) {
      if (!(s & 4294965248)) {
        i += 2;
      } else {
        if (s >= 55296 && s <= 56319 && n < t) {
          var r = e.charCodeAt(n);
          if ((r & 64512) === 56320) {
            ++n;
            s = ((s & 1023) << 10) + (r & 1023) + 65536;
          }
        }
        if (s & 4294901760) {
          i += 4;
        } else {
          i += 3;
        }
      }
    } else {
      i++;
      continue;
    }
  }
  return i;
}
function cl(e, t, i) {
  for (var n = e.length, s = i, r = 0; r < n;) {
    var o = e.charCodeAt(r++);
    if (o & 4294967168) {
      if (!(o & 4294965248)) {
        t[s++] = o >> 6 & 31 | 192;
      } else {
        if (o >= 55296 && o <= 56319 && r < n) {
          var l = e.charCodeAt(r);
          if ((l & 64512) === 56320) {
            ++r;
            o = ((o & 1023) << 10) + (l & 1023) + 65536;
          }
        }
        if (o & 4294901760) {
          t[s++] = o >> 18 & 7 | 240;
          t[s++] = o >> 12 & 63 | 128;
          t[s++] = o >> 6 & 63 | 128;
        } else {
          t[s++] = o >> 12 & 15 | 224;
          t[s++] = o >> 6 & 63 | 128;
        }
      }
    } else {
      t[s++] = o;
      continue;
    }
    t[s++] = o & 63 | 128;
  }
}
var Oi = Rn ? new TextEncoder() : undefined;
var hl = Rn ? typeof process !== "undefined" && ((Nn = process == null ? undefined : process.env) === null || Nn === undefined ? undefined : Nn.TEXT_ENCODING) !== "force" ? 200 : 0 : Ct;
function ul(e, t, i) {
  t.set(Oi.encode(e), i);
}
function fl(e, t, i) {
  Oi.encodeInto(e, t.subarray(i));
}
var dl = Oi != null && Oi.encodeInto ? fl : ul;
var pl = 4096;
function Ho(e, t, i) {
  for (var n = t, s = n + i, r = [], o = ""; n < s;) {
    var l = e[n++];
    if (!(l & 128)) {
      r.push(l);
    } else if ((l & 224) === 192) {
      var c = e[n++] & 63;
      r.push((l & 31) << 6 | c);
    } else if ((l & 240) === 224) {
      var c = e[n++] & 63;
      var a = e[n++] & 63;
      r.push((l & 31) << 12 | c << 6 | a);
    } else if ((l & 248) === 240) {
      var c = e[n++] & 63;
      var a = e[n++] & 63;
      var f = e[n++] & 63;
      var d = (l & 7) << 18 | c << 12 | a << 6 | f;
      if (d > 65535) {
        d -= 65536;
        r.push(d >>> 10 & 1023 | 55296);
        d = d & 1023 | 56320;
      }
      r.push(d);
    } else {
      r.push(l);
    }
    if (r.length >= pl) {
      o += String.fromCharCode.apply(String, r);
      r.length = 0;
    }
  }
  if (r.length > 0) {
    o += String.fromCharCode.apply(String, r);
  }
  return o;
}
var ml = Rn ? new TextDecoder() : null;
var gl = Rn ? typeof process !== "undefined" && ((Un = process == null ? undefined : process.env) === null || Un === undefined ? undefined : Un.TEXT_DECODER) !== "force" ? 200 : 0 : Ct;
function yl(e, t, i) {
  var n = e.subarray(t, t + i);
  return ml.decode(n);
}
var en = function () {
  function e(t, i) {
    this.type = t;
    this.data = i;
  }
  return e;
}();
var wl = globalThis && globalThis.__extends || function () {
  function e(t, i) {
    e = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (n, s) {
      n.__proto__ = s;
    } || function (n, s) {
      for (var r in s) {
        if (Object.prototype.hasOwnProperty.call(s, r)) {
          n[r] = s[r];
        }
      }
    };
    return e(t, i);
  }
  return function (t, i) {
    if (typeof i != "function" && i !== null) {
      throw new TypeError("Class extends value " + String(i) + " is not a constructor or null");
    }
    e(t, i);
    function n() {
      this.constructor = t;
    }
    t.prototype = i === null ? Object.create(i) : (n.prototype = i.prototype, new n());
  };
}();
var Je = function (e) {
  wl(t, e);
  function t(i) {
    var n = e.call(this, i) || this;
    var s = Object.create(t.prototype);
    Object.setPrototypeOf(n, s);
    Object.defineProperty(n, "name", {
      configurable: true,
      enumerable: false,
      value: t.name
    });
    return n;
  }
  return t;
}(Error);
var vl = -1;
var kl = 4294967295;
var xl = 17179869183;
function bl(e) {
  var t = e.sec;
  var i = e.nsec;
  if (t >= 0 && i >= 0 && t <= xl) {
    if (i === 0 && t <= kl) {
      var n = new Uint8Array(4);
      var s = new DataView(n.buffer);
      s.setUint32(0, t);
      return n;
    } else {
      var r = t / 4294967296;
      var o = t & 4294967295;
      var n = new Uint8Array(8);
      var s = new DataView(n.buffer);
      s.setUint32(0, i << 2 | r & 3);
      s.setUint32(4, o);
      return n;
    }
  } else {
    var n = new Uint8Array(12);
    var s = new DataView(n.buffer);
    s.setUint32(0, i);
    zo(s, 4, t);
    return n;
  }
}
function Sl(e) {
  var t = e.getTime();
  var i = Math.floor(t / 1000);
  var n = (t - i * 1000) * 1000000;
  var s = Math.floor(n / 1000000000);
  return {
    sec: i + s,
    nsec: n - s * 1000000000
  };
}
function Il(e) {
  if (e instanceof Date) {
    var t = Sl(e);
    return bl(t);
  } else {
    return null;
  }
}
function Tl(e) {
  var t = new DataView(e.buffer, e.byteOffset, e.byteLength);
  switch (e.byteLength) {
    case 4:
      {
        var i = t.getUint32(0);
        var n = 0;
        return {
          sec: i,
          nsec: n
        };
      }
    case 8:
      {
        var s = t.getUint32(0);
        var r = t.getUint32(4);
        var i = (s & 3) * 4294967296 + r;
        var n = s >>> 2;
        return {
          sec: i,
          nsec: n
        };
      }
    case 12:
      {
        var i = Bo(t, 4);
        var n = t.getUint32(0);
        return {
          sec: i,
          nsec: n
        };
      }
    default:
      throw new Je(`Unrecognized data size for timestamp (expected 4, 8, or 12): ${e.length}`);
  }
}
function Ml(e) {
  var t = Tl(e);
  return new Date(t.sec * 1000 + t.nsec / 1000000);
}
var El = {
  type: vl,
  encode: Il,
  decode: Ml
};
var Lo = function () {
  function e() {
    this.builtInEncoders = [];
    this.builtInDecoders = [];
    this.encoders = [];
    this.decoders = [];
    this.register(El);
  }
  e.prototype.register = function (t) {
    var i = t.type;
    var n = t.encode;
    var s = t.decode;
    if (i >= 0) {
      this.encoders[i] = n;
      this.decoders[i] = s;
    } else {
      var r = 1 + i;
      this.builtInEncoders[r] = n;
      this.builtInDecoders[r] = s;
    }
  };
  e.prototype.tryToEncode = function (t, i) {
    for (var n = 0; n < this.builtInEncoders.length; n++) {
      var s = this.builtInEncoders[n];
      if (s != null) {
        var r = s(t, i);
        if (r != null) {
          var o = -1 - n;
          return new en(o, r);
        }
      }
    }
    for (var n = 0; n < this.encoders.length; n++) {
      var s = this.encoders[n];
      if (s != null) {
        var r = s(t, i);
        if (r != null) {
          var o = n;
          return new en(o, r);
        }
      }
    }
    if (t instanceof en) {
      return t;
    } else {
      return null;
    }
  };
  e.prototype.decode = function (t, i, n) {
    var s = i < 0 ? this.builtInDecoders[-1 - i] : this.decoders[i];
    if (s) {
      return s(t, i, n);
    } else {
      return new en(i, t);
    }
  };
  e.defaultCodec = new e();
  return e;
}();
function yn(e) {
  if (e instanceof Uint8Array) {
    return e;
  } else if (ArrayBuffer.isView(e)) {
    return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
  } else if (e instanceof ArrayBuffer) {
    return new Uint8Array(e);
  } else {
    return Uint8Array.from(e);
  }
}
function Cl(e) {
  if (e instanceof ArrayBuffer) {
    return new DataView(e);
  }
  var t = yn(e);
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
var Pl = 100;
var $l = 2048;
var Rl = function () {
  function e(t, i, n, s, r, o, l, c) {
    if (t === undefined) {
      t = Lo.defaultCodec;
    }
    if (i === undefined) {
      i = undefined;
    }
    if (n === undefined) {
      n = Pl;
    }
    if (s === undefined) {
      s = $l;
    }
    if (r === undefined) {
      r = false;
    }
    if (o === undefined) {
      o = false;
    }
    if (l === undefined) {
      l = false;
    }
    if (c === undefined) {
      c = false;
    }
    this.extensionCodec = t;
    this.context = i;
    this.maxDepth = n;
    this.initialBufferSize = s;
    this.sortKeys = r;
    this.forceFloat32 = o;
    this.ignoreUndefined = l;
    this.forceIntegerToFloat = c;
    this.pos = 0;
    this.view = new DataView(new ArrayBuffer(this.initialBufferSize));
    this.bytes = new Uint8Array(this.view.buffer);
  }
  e.prototype.reinitializeState = function () {
    this.pos = 0;
  };
  e.prototype.encodeSharedRef = function (t) {
    this.reinitializeState();
    this.doEncode(t, 1);
    return this.bytes.subarray(0, this.pos);
  };
  e.prototype.encode = function (t) {
    this.reinitializeState();
    this.doEncode(t, 1);
    return this.bytes.slice(0, this.pos);
  };
  e.prototype.doEncode = function (t, i) {
    if (i > this.maxDepth) {
      throw new Error(`Too deep objects in depth ${i}`);
    }
    if (t == null) {
      this.encodeNil();
    } else if (typeof t == "boolean") {
      this.encodeBoolean(t);
    } else if (typeof t == "number") {
      this.encodeNumber(t);
    } else if (typeof t == "string") {
      this.encodeString(t);
    } else {
      this.encodeObject(t, i);
    }
  };
  e.prototype.ensureBufferSizeToWrite = function (t) {
    var i = this.pos + t;
    if (this.view.byteLength < i) {
      this.resizeBuffer(i * 2);
    }
  };
  e.prototype.resizeBuffer = function (t) {
    var i = new ArrayBuffer(t);
    var n = new Uint8Array(i);
    var s = new DataView(i);
    n.set(this.bytes);
    this.view = s;
    this.bytes = n;
  };
  e.prototype.encodeNil = function () {
    this.writeU8(192);
  };
  e.prototype.encodeBoolean = function (t) {
    if (t === false) {
      this.writeU8(194);
    } else {
      this.writeU8(195);
    }
  };
  e.prototype.encodeNumber = function (t) {
    if (Number.isSafeInteger(t) && !this.forceIntegerToFloat) {
      if (t >= 0) {
        if (t < 128) {
          this.writeU8(t);
        } else if (t < 256) {
          this.writeU8(204);
          this.writeU8(t);
        } else if (t < 65536) {
          this.writeU8(205);
          this.writeU16(t);
        } else if (t < 4294967296) {
          this.writeU8(206);
          this.writeU32(t);
        } else {
          this.writeU8(207);
          this.writeU64(t);
        }
      } else if (t >= -32) {
        this.writeU8(t + 32 | 224);
      } else if (t >= -128) {
        this.writeU8(208);
        this.writeI8(t);
      } else if (t >= -32768) {
        this.writeU8(209);
        this.writeI16(t);
      } else if (t >= -2147483648) {
        this.writeU8(210);
        this.writeI32(t);
      } else {
        this.writeU8(211);
        this.writeI64(t);
      }
    } else if (this.forceFloat32) {
      this.writeU8(202);
      this.writeF32(t);
    } else {
      this.writeU8(203);
      this.writeF64(t);
    }
  };
  e.prototype.writeStringHeader = function (t) {
    if (t < 32) {
      this.writeU8(160 + t);
    } else if (t < 256) {
      this.writeU8(217);
      this.writeU8(t);
    } else if (t < 65536) {
      this.writeU8(218);
      this.writeU16(t);
    } else if (t < 4294967296) {
      this.writeU8(219);
      this.writeU32(t);
    } else {
      throw new Error(`Too long string: ${t} bytes in UTF-8`);
    }
  };
  e.prototype.encodeString = function (t) {
    var i = 5;
    var n = t.length;
    if (n > hl) {
      var s = vr(t);
      this.ensureBufferSizeToWrite(i + s);
      this.writeStringHeader(s);
      dl(t, this.bytes, this.pos);
      this.pos += s;
    } else {
      var s = vr(t);
      this.ensureBufferSizeToWrite(i + s);
      this.writeStringHeader(s);
      cl(t, this.bytes, this.pos);
      this.pos += s;
    }
  };
  e.prototype.encodeObject = function (t, i) {
    var n = this.extensionCodec.tryToEncode(t, this.context);
    if (n != null) {
      this.encodeExtension(n);
    } else if (Array.isArray(t)) {
      this.encodeArray(t, i);
    } else if (ArrayBuffer.isView(t)) {
      this.encodeBinary(t);
    } else if (typeof t == "object") {
      this.encodeMap(t, i);
    } else {
      throw new Error(`Unrecognized object: ${Object.prototype.toString.apply(t)}`);
    }
  };
  e.prototype.encodeBinary = function (t) {
    var i = t.byteLength;
    if (i < 256) {
      this.writeU8(196);
      this.writeU8(i);
    } else if (i < 65536) {
      this.writeU8(197);
      this.writeU16(i);
    } else if (i < 4294967296) {
      this.writeU8(198);
      this.writeU32(i);
    } else {
      throw new Error(`Too large binary: ${i}`);
    }
    var n = yn(t);
    this.writeU8a(n);
  };
  e.prototype.encodeArray = function (t, i) {
    var n = t.length;
    if (n < 16) {
      this.writeU8(144 + n);
    } else if (n < 65536) {
      this.writeU8(220);
      this.writeU16(n);
    } else if (n < 4294967296) {
      this.writeU8(221);
      this.writeU32(n);
    } else {
      throw new Error(`Too large array: ${n}`);
    }
    for (var s = 0, r = t; s < r.length; s++) {
      var o = r[s];
      this.doEncode(o, i + 1);
    }
  };
  e.prototype.countWithoutUndefined = function (t, i) {
    for (var n = 0, s = 0, r = i; s < r.length; s++) {
      var o = r[s];
      if (t[o] !== undefined) {
        n++;
      }
    }
    return n;
  };
  e.prototype.encodeMap = function (t, i) {
    var n = Object.keys(t);
    if (this.sortKeys) {
      n.sort();
    }
    var s = this.ignoreUndefined ? this.countWithoutUndefined(t, n) : n.length;
    if (s < 16) {
      this.writeU8(128 + s);
    } else if (s < 65536) {
      this.writeU8(222);
      this.writeU16(s);
    } else if (s < 4294967296) {
      this.writeU8(223);
      this.writeU32(s);
    } else {
      throw new Error(`Too large map object: ${s}`);
    }
    for (var r = 0, o = n; r < o.length; r++) {
      var l = o[r];
      var c = t[l];
      if (!(this.ignoreUndefined && c === undefined)) {
        this.encodeString(l);
        this.doEncode(c, i + 1);
      }
    }
  };
  e.prototype.encodeExtension = function (t) {
    var i = t.data.length;
    if (i === 1) {
      this.writeU8(212);
    } else if (i === 2) {
      this.writeU8(213);
    } else if (i === 4) {
      this.writeU8(214);
    } else if (i === 8) {
      this.writeU8(215);
    } else if (i === 16) {
      this.writeU8(216);
    } else if (i < 256) {
      this.writeU8(199);
      this.writeU8(i);
    } else if (i < 65536) {
      this.writeU8(200);
      this.writeU16(i);
    } else if (i < 4294967296) {
      this.writeU8(201);
      this.writeU32(i);
    } else {
      throw new Error(`Too large extension object: ${i}`);
    }
    this.writeI8(t.type);
    this.writeU8a(t.data);
  };
  e.prototype.writeU8 = function (t) {
    this.ensureBufferSizeToWrite(1);
    this.view.setUint8(this.pos, t);
    this.pos++;
  };
  e.prototype.writeU8a = function (t) {
    var i = t.length;
    this.ensureBufferSizeToWrite(i);
    this.bytes.set(t, this.pos);
    this.pos += i;
  };
  e.prototype.writeI8 = function (t) {
    this.ensureBufferSizeToWrite(1);
    this.view.setInt8(this.pos, t);
    this.pos++;
  };
  e.prototype.writeU16 = function (t) {
    this.ensureBufferSizeToWrite(2);
    this.view.setUint16(this.pos, t);
    this.pos += 2;
  };
  e.prototype.writeI16 = function (t) {
    this.ensureBufferSizeToWrite(2);
    this.view.setInt16(this.pos, t);
    this.pos += 2;
  };
  e.prototype.writeU32 = function (t) {
    this.ensureBufferSizeToWrite(4);
    this.view.setUint32(this.pos, t);
    this.pos += 4;
  };
  e.prototype.writeI32 = function (t) {
    this.ensureBufferSizeToWrite(4);
    this.view.setInt32(this.pos, t);
    this.pos += 4;
  };
  e.prototype.writeF32 = function (t) {
    this.ensureBufferSizeToWrite(4);
    this.view.setFloat32(this.pos, t);
    this.pos += 4;
  };
  e.prototype.writeF64 = function (t) {
    this.ensureBufferSizeToWrite(8);
    this.view.setFloat64(this.pos, t);
    this.pos += 8;
  };
  e.prototype.writeU64 = function (t) {
    this.ensureBufferSizeToWrite(8);
    al(this.view, this.pos, t);
    this.pos += 8;
  };
  e.prototype.writeI64 = function (t) {
    this.ensureBufferSizeToWrite(8);
    zo(this.view, this.pos, t);
    this.pos += 8;
  };
  return e;
}();
function Wn(e) {
  return `${e < 0 ? "-" : ""}0x${Math.abs(e).toString(16).padStart(2, "0")}`;
}
var Al = 16;
var Dl = 16;
var Ol = function () {
  function e(t, i) {
    if (t === undefined) {
      t = Al;
    }
    if (i === undefined) {
      i = Dl;
    }
    this.maxKeyLength = t;
    this.maxLengthPerKey = i;
    this.hit = 0;
    this.miss = 0;
    this.caches = [];
    for (var n = 0; n < this.maxKeyLength; n++) {
      this.caches.push([]);
    }
  }
  e.prototype.canBeCached = function (t) {
    return t > 0 && t <= this.maxKeyLength;
  };
  e.prototype.find = function (t, i, n) {
    var s = this.caches[n - 1];
    e: for (var r = 0, o = s; r < o.length; r++) {
      for (var l = o[r], c = l.bytes, a = 0; a < n; a++) {
        if (c[a] !== t[i + a]) {
          continue e;
        }
      }
      return l.str;
    }
    return null;
  };
  e.prototype.store = function (t, i) {
    var n = this.caches[t.length - 1];
    var s = {
      bytes: t,
      str: i
    };
    if (n.length >= this.maxLengthPerKey) {
      n[Math.random() * n.length | 0] = s;
    } else {
      n.push(s);
    }
  };
  e.prototype.decode = function (t, i, n) {
    var s = this.find(t, i, n);
    if (s != null) {
      this.hit++;
      return s;
    }
    this.miss++;
    var r = Ho(t, i, n);
    var o = Uint8Array.prototype.slice.call(t, i, i + n);
    this.store(o, r);
    return r;
  };
  return e;
}();
var _l = globalThis && globalThis.__awaiter || function (e, t, i, n) {
  function s(r) {
    if (r instanceof i) {
      return r;
    } else {
      return new i(function (o) {
        o(r);
      });
    }
  }
  return new (i || (i = Promise))(function (r, o) {
    function l(f) {
      try {
        a(n.next(f));
      } catch (d) {
        o(d);
      }
    }
    function c(f) {
      try {
        a(n.throw(f));
      } catch (d) {
        o(d);
      }
    }
    function a(f) {
      if (f.done) {
        r(f.value);
      } else {
        s(f.value).then(l, c);
      }
    }
    a((n = n.apply(e, t || [])).next());
  });
};
var Xn = globalThis && globalThis.__generator || function (e, t) {
  var i = {
    label: 0,
    sent: function () {
      if (r[0] & 1) {
        throw r[1];
      }
      return r[1];
    },
    trys: [],
    ops: []
  };
  var n;
  var s;
  var r;
  var o;
  o = {
    next: l(0),
    throw: l(1),
    return: l(2)
  };
  if (typeof Symbol == "function") {
    o[Symbol.iterator] = function () {
      return this;
    };
  }
  return o;
  function l(a) {
    return function (f) {
      return c([a, f]);
    };
  }
  function c(a) {
    if (n) {
      throw new TypeError("Generator is already executing.");
    }
    for (; i;) {
      try {
        n = 1;
        if (s && (r = a[0] & 2 ? s.return : a[0] ? s.throw || ((r = s.return) && r.call(s), 0) : s.next) && !(r = r.call(s, a[1])).done) {
          return r;
        }
        s = 0;
        if (r) {
          a = [a[0] & 2, r.value];
        }
        switch (a[0]) {
          case 0:
          case 1:
            r = a;
            break;
          case 4:
            i.label++;
            return {
              value: a[1],
              done: false
            };
          case 5:
            i.label++;
            s = a[1];
            a = [0];
            continue;
          case 7:
            a = i.ops.pop();
            i.trys.pop();
            continue;
          default:
            r = i.trys;
            if (!(r = r.length > 0 && r[r.length - 1]) && (a[0] === 6 || a[0] === 2)) {
              i = 0;
              continue;
            }
            if (a[0] === 3 && (!r || a[1] > r[0] && a[1] < r[3])) {
              i.label = a[1];
              break;
            }
            if (a[0] === 6 && i.label < r[1]) {
              i.label = r[1];
              r = a;
              break;
            }
            if (r && i.label < r[2]) {
              i.label = r[2];
              i.ops.push(a);
              break;
            }
            if (r[2]) {
              i.ops.pop();
            }
            i.trys.pop();
            continue;
        }
        a = t.call(e, i);
      } catch (f) {
        a = [6, f];
        s = 0;
      } finally {
        n = r = 0;
      }
    }
    if (a[0] & 5) {
      throw a[1];
    }
    return {
      value: a[0] ? a[1] : undefined,
      done: true
    };
  }
};
var kr = globalThis && globalThis.__asyncValues || function (e) {
  if (!Symbol.asyncIterator) {
    throw new TypeError("Symbol.asyncIterator is not defined.");
  }
  var t = e[Symbol.asyncIterator];
  var i;
  if (t) {
    return t.call(e);
  } else {
    e = typeof __values == "function" ? __values(e) : e[Symbol.iterator]();
    i = {};
    n("next");
    n("throw");
    n("return");
    i[Symbol.asyncIterator] = function () {
      return this;
    };
    return i;
  }
  function n(r) {
    i[r] = e[r] && function (o) {
      return new Promise(function (l, c) {
        o = e[r](o);
        s(l, c, o.done, o.value);
      });
    };
  }
  function s(r, o, l, c) {
    Promise.resolve(c).then(function (a) {
      r({
        value: a,
        done: l
      });
    }, o);
  }
};
var ai = globalThis && globalThis.__await || function (e) {
  if (this instanceof ai) {
    this.v = e;
    return this;
  } else {
    return new ai(e);
  }
};
var zl = globalThis && globalThis.__asyncGenerator || function (e, t, i) {
  if (!Symbol.asyncIterator) {
    throw new TypeError("Symbol.asyncIterator is not defined.");
  }
  var n = i.apply(e, t || []);
  var s;
  var r = [];
  s = {};
  o("next");
  o("throw");
  o("return");
  s[Symbol.asyncIterator] = function () {
    return this;
  };
  return s;
  function o(u) {
    if (n[u]) {
      s[u] = function (p) {
        return new Promise(function (w, x) {
          if (!(r.push([u, p, w, x]) > 1)) {
            l(u, p);
          }
        });
      };
    }
  }
  function l(u, p) {
    try {
      c(n[u](p));
    } catch (w) {
      d(r[0][3], w);
    }
  }
  function c(u) {
    if (u.value instanceof ai) {
      Promise.resolve(u.value.v).then(a, f);
    } else {
      d(r[0][2], u);
    }
  }
  function a(u) {
    l("next", u);
  }
  function f(u) {
    l("throw", u);
  }
  function d(u, p) {
    u(p);
    r.shift();
    if (r.length) {
      l(r[0][0], r[0][1]);
    }
  }
};
function Bl(e) {
  var t = typeof e;
  return t === "string" || t === "number";
}
var Ii = -1;
var Ys = new DataView(new ArrayBuffer(0));
var Hl = new Uint8Array(Ys.buffer);
var Ss = function () {
  try {
    Ys.getInt8(0);
  } catch (e) {
    return e.constructor;
  }
  throw new Error("never reached");
}();
var xr = new Ss("Insufficient data");
var Ll = new Ol();
var Fl = function () {
  function e(t, i, n, s, r, o, l, c) {
    if (t === undefined) {
      t = Lo.defaultCodec;
    }
    if (i === undefined) {
      i = undefined;
    }
    if (n === undefined) {
      n = Ct;
    }
    if (s === undefined) {
      s = Ct;
    }
    if (r === undefined) {
      r = Ct;
    }
    if (o === undefined) {
      o = Ct;
    }
    if (l === undefined) {
      l = Ct;
    }
    if (c === undefined) {
      c = Ll;
    }
    this.extensionCodec = t;
    this.context = i;
    this.maxStrLength = n;
    this.maxBinLength = s;
    this.maxArrayLength = r;
    this.maxMapLength = o;
    this.maxExtLength = l;
    this.keyDecoder = c;
    this.totalPos = 0;
    this.pos = 0;
    this.view = Ys;
    this.bytes = Hl;
    this.headByte = Ii;
    this.stack = [];
  }
  e.prototype.reinitializeState = function () {
    this.totalPos = 0;
    this.headByte = Ii;
    this.stack.length = 0;
  };
  e.prototype.setBuffer = function (t) {
    this.bytes = yn(t);
    this.view = Cl(this.bytes);
    this.pos = 0;
  };
  e.prototype.appendBuffer = function (t) {
    if (this.headByte === Ii && !this.hasRemaining(1)) {
      this.setBuffer(t);
    } else {
      var i = this.bytes.subarray(this.pos);
      var n = yn(t);
      var s = new Uint8Array(i.length + n.length);
      s.set(i);
      s.set(n, i.length);
      this.setBuffer(s);
    }
  };
  e.prototype.hasRemaining = function (t) {
    return this.view.byteLength - this.pos >= t;
  };
  e.prototype.createExtraByteError = function (t) {
    var i = this;
    var n = i.view;
    var s = i.pos;
    return new RangeError(`Extra ${n.byteLength - s} of ${n.byteLength} byte(s) found at buffer[${t}]`);
  };
  e.prototype.decode = function (t) {
    this.reinitializeState();
    this.setBuffer(t);
    var i = this.doDecodeSync();
    if (this.hasRemaining(1)) {
      throw this.createExtraByteError(this.pos);
    }
    return i;
  };
  e.prototype.decodeMulti = function (t) {
    return Xn(this, function (i) {
      switch (i.label) {
        case 0:
          this.reinitializeState();
          this.setBuffer(t);
          i.label = 1;
        case 1:
          if (this.hasRemaining(1)) {
            return [4, this.doDecodeSync()];
          } else {
            return [3, 3];
          }
        case 2:
          i.sent();
          return [3, 1];
        case 3:
          return [2];
      }
    });
  };
  e.prototype.decodeAsync = function (t) {
    var i;
    var n;
    var s;
    var r;
    return _l(this, undefined, undefined, function () {
      var o;
      var l;
      var c;
      var a;
      var f;
      var d;
      var u;
      var p;
      return Xn(this, function (w) {
        switch (w.label) {
          case 0:
            o = false;
            w.label = 1;
          case 1:
            w.trys.push([1, 6, 7, 12]);
            i = kr(t);
            w.label = 2;
          case 2:
            return [4, i.next()];
          case 3:
            n = w.sent();
            if (!!n.done) {
              return [3, 5];
            }
            c = n.value;
            if (o) {
              throw this.createExtraByteError(this.totalPos);
            }
            this.appendBuffer(c);
            try {
              l = this.doDecodeSync();
              o = true;
            } catch (x) {
              if (!(x instanceof Ss)) {
                throw x;
              }
            }
            this.totalPos += this.pos;
            w.label = 4;
          case 4:
            return [3, 2];
          case 5:
            return [3, 12];
          case 6:
            a = w.sent();
            s = {
              error: a
            };
            return [3, 12];
          case 7:
            w.trys.push([7,, 10, 11]);
            if (n && !n.done && (r = i.return)) {
              return [4, r.call(i)];
            } else {
              return [3, 9];
            }
          case 8:
            w.sent();
            w.label = 9;
          case 9:
            return [3, 11];
          case 10:
            if (s) {
              throw s.error;
            }
            return [7];
          case 11:
            return [7];
          case 12:
            if (o) {
              if (this.hasRemaining(1)) {
                throw this.createExtraByteError(this.totalPos);
              }
              return [2, l];
            }
            f = this;
            d = f.headByte;
            u = f.pos;
            p = f.totalPos;
            throw new RangeError(`Insufficient data in parsing ${Wn(d)} at ${p} (${u} in the current buffer)`);
        }
      });
    });
  };
  e.prototype.decodeArrayStream = function (t) {
    return this.decodeMultiAsync(t, true);
  };
  e.prototype.decodeStream = function (t) {
    return this.decodeMultiAsync(t, false);
  };
  e.prototype.decodeMultiAsync = function (t, i) {
    return zl(this, arguments, function () {
      var s;
      var r;
      var o;
      var l;
      var c;
      var a;
      var f;
      var d;
      var u;
      return Xn(this, function (p) {
        switch (p.label) {
          case 0:
            s = i;
            r = -1;
            p.label = 1;
          case 1:
            p.trys.push([1, 13, 14, 19]);
            o = kr(t);
            p.label = 2;
          case 2:
            return [4, ai(o.next())];
          case 3:
            l = p.sent();
            if (!!l.done) {
              return [3, 12];
            }
            c = l.value;
            if (i && r === 0) {
              throw this.createExtraByteError(this.totalPos);
            }
            this.appendBuffer(c);
            if (s) {
              r = this.readArraySize();
              s = false;
              this.complete();
            }
            p.label = 4;
          case 4:
            p.trys.push([4, 9,, 10]);
            p.label = 5;
          case 5:
            return [4, ai(this.doDecodeSync())];
          case 6:
            return [4, p.sent()];
          case 7:
            p.sent();
            if (--r === 0) {
              return [3, 8];
            } else {
              return [3, 5];
            }
          case 8:
            return [3, 10];
          case 9:
            a = p.sent();
            if (!(a instanceof Ss)) {
              throw a;
            }
            return [3, 10];
          case 10:
            this.totalPos += this.pos;
            p.label = 11;
          case 11:
            return [3, 2];
          case 12:
            return [3, 19];
          case 13:
            f = p.sent();
            d = {
              error: f
            };
            return [3, 19];
          case 14:
            p.trys.push([14,, 17, 18]);
            if (l && !l.done && (u = o.return)) {
              return [4, ai(u.call(o))];
            } else {
              return [3, 16];
            }
          case 15:
            p.sent();
            p.label = 16;
          case 16:
            return [3, 18];
          case 17:
            if (d) {
              throw d.error;
            }
            return [7];
          case 18:
            return [7];
          case 19:
            return [2];
        }
      });
    });
  };
  e.prototype.doDecodeSync = function () {
    e: for (;;) {
      var t = this.readHeadByte();
      var i = undefined;
      if (t >= 224) {
        i = t - 256;
      } else if (t < 192) {
        if (t < 128) {
          i = t;
        } else if (t < 144) {
          var n = t - 128;
          if (n !== 0) {
            this.pushMapState(n);
            this.complete();
            continue e;
          } else {
            i = {};
          }
        } else if (t < 160) {
          var n = t - 144;
          if (n !== 0) {
            this.pushArrayState(n);
            this.complete();
            continue e;
          } else {
            i = [];
          }
        } else {
          var s = t - 160;
          i = this.decodeUtf8String(s, 0);
        }
      } else if (t === 192) {
        i = null;
      } else if (t === 194) {
        i = false;
      } else if (t === 195) {
        i = true;
      } else if (t === 202) {
        i = this.readF32();
      } else if (t === 203) {
        i = this.readF64();
      } else if (t === 204) {
        i = this.readU8();
      } else if (t === 205) {
        i = this.readU16();
      } else if (t === 206) {
        i = this.readU32();
      } else if (t === 207) {
        i = this.readU64();
      } else if (t === 208) {
        i = this.readI8();
      } else if (t === 209) {
        i = this.readI16();
      } else if (t === 210) {
        i = this.readI32();
      } else if (t === 211) {
        i = this.readI64();
      } else if (t === 217) {
        var s = this.lookU8();
        i = this.decodeUtf8String(s, 1);
      } else if (t === 218) {
        var s = this.lookU16();
        i = this.decodeUtf8String(s, 2);
      } else if (t === 219) {
        var s = this.lookU32();
        i = this.decodeUtf8String(s, 4);
      } else if (t === 220) {
        var n = this.readU16();
        if (n !== 0) {
          this.pushArrayState(n);
          this.complete();
          continue e;
        } else {
          i = [];
        }
      } else if (t === 221) {
        var n = this.readU32();
        if (n !== 0) {
          this.pushArrayState(n);
          this.complete();
          continue e;
        } else {
          i = [];
        }
      } else if (t === 222) {
        var n = this.readU16();
        if (n !== 0) {
          this.pushMapState(n);
          this.complete();
          continue e;
        } else {
          i = {};
        }
      } else if (t === 223) {
        var n = this.readU32();
        if (n !== 0) {
          this.pushMapState(n);
          this.complete();
          continue e;
        } else {
          i = {};
        }
      } else if (t === 196) {
        var n = this.lookU8();
        i = this.decodeBinary(n, 1);
      } else if (t === 197) {
        var n = this.lookU16();
        i = this.decodeBinary(n, 2);
      } else if (t === 198) {
        var n = this.lookU32();
        i = this.decodeBinary(n, 4);
      } else if (t === 212) {
        i = this.decodeExtension(1, 0);
      } else if (t === 213) {
        i = this.decodeExtension(2, 0);
      } else if (t === 214) {
        i = this.decodeExtension(4, 0);
      } else if (t === 215) {
        i = this.decodeExtension(8, 0);
      } else if (t === 216) {
        i = this.decodeExtension(16, 0);
      } else if (t === 199) {
        var n = this.lookU8();
        i = this.decodeExtension(n, 1);
      } else if (t === 200) {
        var n = this.lookU16();
        i = this.decodeExtension(n, 2);
      } else if (t === 201) {
        var n = this.lookU32();
        i = this.decodeExtension(n, 4);
      } else {
        throw new Je(`Unrecognized type byte: ${Wn(t)}`);
      }
      this.complete();
      for (var r = this.stack; r.length > 0;) {
        var o = r[r.length - 1];
        if (o.type === 0) {
          o.array[o.position] = i;
          o.position++;
          if (o.position === o.size) {
            r.pop();
            i = o.array;
          } else {
            continue e;
          }
        } else if (o.type === 1) {
          if (!Bl(i)) {
            throw new Je("The type of key must be string or number but " + typeof i);
          }
          if (i === "__proto__") {
            throw new Je("The key __proto__ is not allowed");
          }
          o.key = i;
          o.type = 2;
          continue e;
        } else {
          o.map[o.key] = i;
          o.readCount++;
          if (o.readCount === o.size) {
            r.pop();
            i = o.map;
          } else {
            o.key = null;
            o.type = 1;
            continue e;
          }
        }
      }
      return i;
    }
  };
  e.prototype.readHeadByte = function () {
    if (this.headByte === Ii) {
      this.headByte = this.readU8();
    }
    return this.headByte;
  };
  e.prototype.complete = function () {
    this.headByte = Ii;
  };
  e.prototype.readArraySize = function () {
    var t = this.readHeadByte();
    switch (t) {
      case 220:
        return this.readU16();
      case 221:
        return this.readU32();
      default:
        {
          if (t < 160) {
            return t - 144;
          }
          throw new Je(`Unrecognized array type byte: ${Wn(t)}`);
        }
    }
  };
  e.prototype.pushMapState = function (t) {
    if (t > this.maxMapLength) {
      throw new Je(`Max length exceeded: map length (${t}) > maxMapLengthLength (${this.maxMapLength})`);
    }
    this.stack.push({
      type: 1,
      size: t,
      key: null,
      readCount: 0,
      map: {}
    });
  };
  e.prototype.pushArrayState = function (t) {
    if (t > this.maxArrayLength) {
      throw new Je(`Max length exceeded: array length (${t}) > maxArrayLength (${this.maxArrayLength})`);
    }
    this.stack.push({
      type: 0,
      size: t,
      array: new Array(t),
      position: 0
    });
  };
  e.prototype.decodeUtf8String = function (t, i) {
    var n;
    if (t > this.maxStrLength) {
      throw new Je(`Max length exceeded: UTF-8 byte length (${t}) > maxStrLength (${this.maxStrLength})`);
    }
    if (this.bytes.byteLength < this.pos + i + t) {
      throw xr;
    }
    var s = this.pos + i;
    var r;
    if (this.stateIsMapKey() && !((n = this.keyDecoder) === null || n === undefined) && n.canBeCached(t)) {
      r = this.keyDecoder.decode(this.bytes, s, t);
    } else if (t > gl) {
      r = yl(this.bytes, s, t);
    } else {
      r = Ho(this.bytes, s, t);
    }
    this.pos += i + t;
    return r;
  };
  e.prototype.stateIsMapKey = function () {
    if (this.stack.length > 0) {
      var t = this.stack[this.stack.length - 1];
      return t.type === 1;
    }
    return false;
  };
  e.prototype.decodeBinary = function (t, i) {
    if (t > this.maxBinLength) {
      throw new Je(`Max length exceeded: bin length (${t}) > maxBinLength (${this.maxBinLength})`);
    }
    if (!this.hasRemaining(t + i)) {
      throw xr;
    }
    var n = this.pos + i;
    var s = this.bytes.subarray(n, n + t);
    this.pos += i + t;
    return s;
  };
  e.prototype.decodeExtension = function (t, i) {
    if (t > this.maxExtLength) {
      throw new Je(`Max length exceeded: ext length (${t}) > maxExtLength (${this.maxExtLength})`);
    }
    var n = this.view.getInt8(this.pos + i);
    var s = this.decodeBinary(t, i + 1);
    return this.extensionCodec.decode(s, n, this.context);
  };
  e.prototype.lookU8 = function () {
    return this.view.getUint8(this.pos);
  };
  e.prototype.lookU16 = function () {
    return this.view.getUint16(this.pos);
  };
  e.prototype.lookU32 = function () {
    return this.view.getUint32(this.pos);
  };
  e.prototype.readU8 = function () {
    var t = this.view.getUint8(this.pos);
    this.pos++;
    return t;
  };
  e.prototype.readI8 = function () {
    var t = this.view.getInt8(this.pos);
    this.pos++;
    return t;
  };
  e.prototype.readU16 = function () {
    var t = this.view.getUint16(this.pos);
    this.pos += 2;
    return t;
  };
  e.prototype.readI16 = function () {
    var t = this.view.getInt16(this.pos);
    this.pos += 2;
    return t;
  };
  e.prototype.readU32 = function () {
    var t = this.view.getUint32(this.pos);
    this.pos += 4;
    return t;
  };
  e.prototype.readI32 = function () {
    var t = this.view.getInt32(this.pos);
    this.pos += 4;
    return t;
  };
  e.prototype.readU64 = function () {
    var t = ll(this.view, this.pos);
    this.pos += 8;
    return t;
  };
  e.prototype.readI64 = function () {
    var t = Bo(this.view, this.pos);
    this.pos += 8;
    return t;
  };
  e.prototype.readF32 = function () {
    var t = this.view.getFloat32(this.pos);
    this.pos += 4;
    return t;
  };
  e.prototype.readF64 = function () {
    var t = this.view.getFloat64(this.pos);
    this.pos += 8;
    return t;
  };
  return e;
}();
var Vt = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function An(e) {
  if (e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default")) {
    return e.default;
  } else {
    return e;
  }
}
var Fo = {
  exports: {}
};
var xe = Fo.exports = {};
var Qe;
var je;
function Is() {
  throw new Error("setTimeout has not been defined");
}
function Ts() {
  throw new Error("clearTimeout has not been defined");
}
(function () {
  try {
    if (typeof setTimeout == "function") {
      Qe = setTimeout;
    } else {
      Qe = Is;
    }
  } catch {
    Qe = Is;
  }
  try {
    if (typeof clearTimeout == "function") {
      je = clearTimeout;
    } else {
      je = Ts;
    }
  } catch {
    je = Ts;
  }
})();
function Vo(e) {
  if (Qe === setTimeout) {
    return (// TOLOOK
      setTimeout(e, 0)
    );
  }
  if ((Qe === Is || !Qe) && setTimeout) {
    Qe = setTimeout;
    return (// TOLOOK
      setTimeout(e, 0)
    );
  }
  try {
    return Qe(e, 0);
  } catch {
    try {
      return Qe.call(null, e, 0);
    } catch {
      return Qe.call(this, e, 0);
    }
  }
}
function Vl(e) {
  if (je === clearTimeout) {
    return clearTimeout(e);
  }
  if ((je === Ts || !je) && clearTimeout) {
    je = clearTimeout;
    return clearTimeout(e);
  }
  try {
    return je(e);
  } catch {
    try {
      return je.call(null, e);
    } catch {
      return je.call(this, e);
    }
  }
}
var ct = [];
var li = false;
var $t;
var on = -1;
function Nl() {
  if (!(!li || !$t)) {
    li = false;
    if ($t.length) {
      ct = $t.concat(ct);
    } else {
      on = -1;
    }
    if (ct.length) {
      No();
    }
  }
}
function No() {
  if (!li) {
    var e = Vo(Nl);
    li = true;
    for (var t = ct.length; t;) {
      $t = ct;
      ct = [];
      for (; ++on < t;) {
        if ($t) {
          $t[on].run();
        }
      }
      on = -1;
      t = ct.length;
    }
    $t = null;
    li = false;
    Vl(e);
  }
}
xe.nextTick = function (e) {
  var t = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      t[i - 1] = arguments[i];
    }
  }
  ct.push(new Uo(e, t));
  if (ct.length === 1 && !li) {
    Vo(No);
  }
};
function Uo(e, t) {
  this.fun = e;
  this.array = t;
}
Uo.prototype.run = function () {
  this.fun.apply(null, this.array);
};
xe.title = "browser";
xe.browser = true;
xe.env = {};
xe.argv = [];
xe.version = "";
xe.versions = {};
function ft() {}
xe.on = ft;
xe.addListener = ft;
xe.once = ft;
xe.off = ft;
xe.removeListener = ft;
xe.removeAllListeners = ft;
xe.emit = ft;
xe.prependListener = ft;
xe.prependOnceListener = ft;
xe.listeners = function (e) {
  return [];
};
xe.binding = function (e) {
  throw new Error("process.binding is not supported");
};
xe.cwd = function () {
  return "/";
};
xe.chdir = function (e) {
  throw new Error("process.chdir is not supported");
};
xe.umask = function () {
  return 0;
};
var Ul = Fo.exports;
const Ms = An(Ul);
const Wl = 1920;
const Xl = 1080;
const ql = 9;
const Wo = Ms && Ms.argv.indexOf("--largeserver") != -1 ? 80 : 40;
const Gl = Wo + 10;
const Yl = 6;
const Kl = 3000;
const Zl = 10;
const Jl = 5;
const Ql = 50;
const jl = 4.5;
const ec = 15;
const tc = 0.9;
const ic = 3000;
const nc = 60;
const sc = 35;
const rc = 3000;
const oc = 500;
const ac = Ms && {}.IS_SANDBOX;
const lc = 100;
const cc = Math.PI / 2.6;
const hc = 10;
const uc = 0.25;
const fc = Math.PI / 2;
const dc = 35;
const pc = 0.0016;
const mc = 0.993;
const gc = 34;
const yc = ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373"];
const wc = 7;
const vc = 0.06;
const kc = ["Sid", "Steph", "Bmoe", "Romn", "Jononthecool", "Fiona", "Vince", "Nathan", "Nick", "Flappy", "Ronald", "Otis", "Pepe", "Mc Donald", "Theo", "Fabz", "Oliver", "Jeff", "Jimmy", "Helena", "Reaper", "Ben", "Alan", "Naomi", "XYZ", "Clever", "Jeremy", "Mike", "Destined", "Stallion", "Allison", "Meaty", "Sophia", "Vaja", "Joey", "Pendy", "Murdoch", "Theo", "Jared", "July", "Sonia", "Mel", "Dexter", "Quinn", "Milky"];
const xc = Math.PI / 3;
const an = [{
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
const bc = function (e) {
  const t = e.weaponXP[e.weaponIndex] || 0;
  for (let i = an.length - 1; i >= 0; --i) {
    if (t >= an[i].xp) {
      return an[i];
    }
  }
};
const Sc = ["wood", "food", "stone", "points"];
const Ic = 7;
const Tc = 9;
const Mc = 3;
const Ec = 32;
const Cc = 7;
const Pc = 724;
const $c = 114;
const Rc = 0.0011;
const Ac = 0.0001;
const Dc = 1.3;
const Oc = [150, 160, 165, 175];
const _c = [80, 85, 95];
const zc = [80, 85, 90];
const Bc = 2400;
const Hc = 0.75;
const Lc = 15;
const Ks = 14400;
const Fc = 40;
const Vc = 2200;
const Nc = 0.6;
const Uc = 1;
const Wc = 0.3;
const Xc = 0.3;
const qc = 1440000;
const Zs = 320;
const Gc = 100;
const Yc = 2;
const Kc = 3200;
const Zc = 1440;
const Jc = 0.2;
const Qc = -1;
const jc = Ks - Zs - 120;
const eh = Ks - Zs - 120;
const T = {
  maxScreenWidth: Wl,
  maxScreenHeight: Xl,
  serverUpdateRate: ql,
  maxPlayers: Wo,
  maxPlayersHard: Gl,
  collisionDepth: Yl,
  minimapRate: Kl,
  colGrid: Zl,
  clientSendRate: Jl,
  healthBarWidth: Ql,
  healthBarPad: jl,
  iconPadding: ec,
  iconPad: tc,
  deathFadeout: ic,
  crownIconScale: nc,
  crownPad: sc,
  chatCountdown: rc,
  chatCooldown: oc,
  inSandbox: ac,
  maxAge: lc,
  gatherAngle: cc,
  gatherWiggle: hc,
  hitReturnRatio: uc,
  hitAngle: fc,
  playerScale: dc,
  playerSpeed: pc,
  playerDecel: mc,
  nameY: gc,
  skinColors: yc,
  animalCount: wc,
  aiTurnRandom: vc,
  cowNames: kc,
  shieldAngle: xc,
  weaponVariants: an,
  fetchVariant: bc,
  resourceTypes: Sc,
  areaCount: Ic,
  treesPerArea: Tc,
  bushesPerArea: Mc,
  totalRocks: Ec,
  goldOres: Cc,
  riverWidth: Pc,
  riverPadding: $c,
  waterCurrent: Rc,
  waveSpeed: Ac,
  waveMax: Dc,
  treeScales: Oc,
  bushScales: _c,
  rockScales: zc,
  snowBiomeTop: Bc,
  snowSpeed: Hc,
  maxNameLength: Lc,
  mapScale: Ks,
  mapPingScale: Fc,
  mapPingTime: Vc,
  volcanoScale: Zs,
  innerVolcanoScale: Gc,
  volcanoAnimalStrength: Yc,
  volcanoAnimationDuration: Kc,
  volcanoAggressionRadius: Zc,
  volcanoAggressionPercentage: Jc,
  volcanoDamagePerSecond: Qc,
  volcanoLocationX: jc,
  volcanoLocationY: eh,
  MAX_ATTACK: Nc,
  MAX_SPAWN_DELAY: Uc,
  MAX_SPEED: Wc,
  MAX_TURN_SPEED: Xc,
  DAY_INTERVAL: qc
};
const th = new Rl();
const ih = new Fl();
const me = {
  socket: null,
  connected: false,
  socketId: -1,
  connect: function (e, t, i) {
    if (this.socket) {
      return;
    }
    const n = this;
    try {
      let s = false;
      const r = e;
      this.socket = new WebSocket(e);
      this.socket.binaryType = "arraybuffer";
      this.socket.onmessage = function (o) {
        var a = new Uint8Array(o.data);
        const l = ih.decode(a);
        const c = l[0];
        var a = l[1];
        if (c == "io-init") {
          n.socketId = a[0];
        } else {
          i[c].apply(undefined, a);
        }
      };
      this.socket.onopen = function () {
        n.connected = true;
        t();
      };
      this.socket.onclose = function (o) {
        n.connected = false;
        if (o.code == 4001) {
          t("Invalid Connection");
        } else if (!s) {
          t("disconnected");
        }
      };
      this.socket.onerror = function (o) {
        if (this.socket && this.socket.readyState != WebSocket.OPEN) {
          s = true;
          console.error("Socket error", arguments);
          t("Socket error");
        }
      };
    } catch (s) {
      console.warn("Socket connection error:", s);
      t(s);
    }
  },
  send: function (e) {
    const t = Array.prototype.slice.call(arguments, 1);
    const i = th.encode([e, t]);
    if (this.socket) {
      this.socket.send(i);
    }
  },
  socketReady: function () {
    return this.socket && this.connected;
  },
  close: function () {
    if (this.socket) {
      this.socket.close();
    }
    this.socket = null;
    this.connected = false;
  }
};
var Xo = Math.abs;
const nh = Math.sqrt;
var Xo = Math.abs;
const sh = Math.atan2;
const qn = Math.PI;
const rh = function (e, t) {
  return Math.floor(Math.random() * (t - e + 1)) + e;
};
const oh = function (e, t) {
  return Math.random() * (t - e + 1) + e;
};
const ah = function (e, t, i) {
  return e + (t - e) * i;
};
const lh = function (e, t) {
  if (e > 0) {
    e = Math.max(0, e - t);
  } else if (e < 0) {
    e = Math.min(0, e + t);
  }
  return e;
};
const ch = function (e, t, i, n) {
  return nh((i -= e) * i + (n -= t) * n);
};
const hh = function (e, t, i, n) {
  return sh(t - n, e - i);
};
const uh = function (e, t) {
  const i = Xo(t - e) % (qn * 2);
  if (i > qn) {
    return qn * 2 - i;
  } else {
    return i;
  }
};
const fh = function (e) {
  return typeof e == "number" && !isNaN(e) && isFinite(e);
};
const dh = function (e) {
  return e && typeof e == "string";
};
const ph = function (e) {
  if (e > 999) {
    return (e / 1000).toFixed(1) + "k";
  } else {
    return e;
  }
};
const mh = function (e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
};
const gh = function (e, t) {
  if (e) {
    return parseFloat(e.toFixed(t));
  } else {
    return 0;
  }
};
const yh = function (e, t) {
  return parseFloat(t.points) - parseFloat(e.points);
};
const wh = function (e, t, i, n, s, r, o, l) {
  let c = s;
  let a = o;
  if (s > o) {
    c = o;
    a = s;
  }
  if (a > i) {
    a = i;
  }
  if (c < e) {
    c = e;
  }
  if (c > a) {
    return false;
  }
  let f = r;
  let d = l;
  const u = o - s;
  if (Math.abs(u) > 1e-7) {
    const p = (l - r) / u;
    const w = r - p * s;
    f = p * c + w;
    d = p * a + w;
  }
  if (f > d) {
    const p = d;
    d = f;
    f = p;
  }
  if (d > n) {
    d = n;
  }
  if (f < t) {
    f = t;
  }
  return !(f > d);
};
const qo = function (e, t, i) {
  const n = e.getBoundingClientRect();
  const s = n.left + window.scrollX;
  const r = n.top + window.scrollY;
  const o = n.width;
  const l = n.height;
  const c = t > s && t < s + o;
  const a = i > r && i < r + l;
  return c && a;
};
const ln = function (e) {
  const t = e.changedTouches[0];
  e.screenX = t.screenX;
  e.screenY = t.screenY;
  e.clientX = t.clientX;
  e.clientY = t.clientY;
  e.pageX = t.pageX;
  e.pageY = t.pageY;
};
const Go = function (e, t) {
  const i = !t;
  let n = false;
  const s = false;
  e.addEventListener("touchstart", lt(r), s);
  e.addEventListener("touchmove", lt(o), s);
  e.addEventListener("touchend", lt(l), s);
  e.addEventListener("touchcancel", lt(l), s);
  e.addEventListener("touchleave", lt(l), s);
  function r(c) {
    ln(c);
    window.setUsingTouch(true);
    if (i) {
      c.preventDefault();
      c.stopPropagation();
    }
    if (e.onmouseover) {
      e.onmouseover(c);
    }
    n = true;
  }
  function o(c) {
    ln(c);
    window.setUsingTouch(true);
    if (i) {
      c.preventDefault();
      c.stopPropagation();
    }
    if (qo(e, c.pageX, c.pageY)) {
      if (!n) {
        if (e.onmouseover) {
          e.onmouseover(c);
        }
        n = true;
      }
    } else if (n) {
      if (e.onmouseout) {
        e.onmouseout(c);
      }
      n = false;
    }
  }
  function l(c) {
    ln(c);
    window.setUsingTouch(true);
    if (i) {
      c.preventDefault();
      c.stopPropagation();
    }
    if (n) {
      if (e.onclick) {
        e.onclick(c);
      }
      if (e.onmouseout) {
        e.onmouseout(c);
      }
      n = false;
    }
  }
};
const vh = function (e) {
  for (; e.hasChildNodes();) {
    e.removeChild(e.lastChild);
  }
};
const kh = function (e) {
  const t = document.createElement(e.tag || "div");
  function i(n, s) {
    if (e[n]) {
      t[s] = e[n];
    }
  }
  i("text", "textContent");
  i("html", "innerHTML");
  i("class", "className");
  for (const n in e) {
    switch (n) {
      case "tag":
      case "text":
      case "html":
      case "class":
      case "style":
      case "hookTouch":
      case "parent":
      case "children":
        continue;
    }
    t[n] = e[n];
  }
  if (t.onclick) {
    t.onclick = lt(t.onclick);
  }
  if (t.onmouseover) {
    t.onmouseover = lt(t.onmouseover);
  }
  if (t.onmouseout) {
    t.onmouseout = lt(t.onmouseout);
  }
  if (e.style) {
    t.style.cssText = e.style;
  }
  if (e.hookTouch) {
    Go(t);
  }
  if (e.parent) {
    e.parent.appendChild(t);
  }
  if (e.children) {
    for (let n = 0; n < e.children.length; n++) {
      t.appendChild(e.children[n]);
    }
  }
  return t;
};
const Yo = function (e) {
  if (e && typeof e.isTrusted == "boolean") {
    return e.isTrusted;
  } else {
    return true;
  }
};
const lt = function (e) {
  return function (t) {
    if (t && t instanceof Event && Yo(t)) {
      e(t);
    }
  };
};
const xh = function (e) {
  let t = "";
  const i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let n = 0; n < e; n++) {
    t += i.charAt(Math.floor(Math.random() * i.length));
  }
  return t;
};
const bh = function (e, t) {
  let i = 0;
  for (let n = 0; n < e.length; n++) {
    if (e[n] === t) {
      i++;
    }
  }
  return i;
};
const A = {
  randInt: rh,
  randFloat: oh,
  lerp: ah,
  decel: lh,
  getDistance: ch,
  getDirection: hh,
  getAngleDist: uh,
  isNumber: fh,
  isString: dh,
  kFormat: ph,
  capitalizeFirst: mh,
  fixTo: gh,
  sortByPoints: yh,
  lineInRect: wh,
  containsPoint: qo,
  mousifyTouchEvent: ln,
  hookTouchEvents: Go,
  removeAllChildren: vh,
  generateElement: kh,
  eventIsTrusted: Yo,
  checkTrusted: lt,
  randomString: xh,
  countInArray: bh
};
const Sh = function () {
  this.init = function (e, t, i, n, s, r, o) {
    this.x = e;
    this.y = t;
    this.color = o;
    this.scale = i;
    this.startScale = this.scale;
    this.maxScale = i * 1.5;
    this.scaleSpeed = 0.7;
    this.speed = n;
    this.life = s;
    this.text = r;
  };
  this.update = function (e) {
    if (this.life) {
      this.life -= e;
      this.y -= this.speed * e;
      this.scale += this.scaleSpeed * e;
      if (this.scale >= this.maxScale) {
        this.scale = this.maxScale;
        this.scaleSpeed *= -1;
      } else if (this.scale <= this.startScale) {
        this.scale = this.startScale;
        this.scaleSpeed = 0;
      }
      if (this.life <= 0) {
        this.life = 0;
      }
    }
  };
  this.render = function (e, t, i) {
    e.fillStyle = this.color;
    e.font = this.scale + "px Hammersmith One";
    e.fillText(this.text, this.x - t, this.y - i);
  };
};
const Ih = function () {
  this.texts = [];
  this.update = function (e, t, i, n) {
    t.textBaseline = "middle";
    t.textAlign = "center";
    for (let s = 0; s < this.texts.length; ++s) {
      if (this.texts[s].life) {
        this.texts[s].update(e);
        this.texts[s].render(t, i, n);
      }
    }
  };
  this.showText = function (e, t, i, n, s, r, o) {
    let l;
    for (let c = 0; c < this.texts.length; ++c) {
      if (!this.texts[c].life) {
        l = this.texts[c];
        break;
      }
    }
    if (!l) {
      l = new Sh();
      this.texts.push(l);
    }
    l.init(e, t, i, n, s, r, o);
  };
};
const Th = function (e, t) {
  let i;
  this.sounds = [];
  this.active = true;
  this.play = function (n, s, r) {
    if (!(!s || !this.active)) {
      i = this.sounds[n];
      if (!i) {
        i = new Howl({
          src: ".././sound/" + n + ".mp3"
        });
        this.sounds[n] = i;
      }
      if (!r || !i.isPlaying) {
        i.isPlaying = true;
        i.play();
        i.volume((s || 1) * e.volumeMult);
        i.loop(r);
      }
    }
  };
  this.toggleMute = function (n, s) {
    i = this.sounds[n];
    if (i) {
      i.mute(s);
    }
  };
  this.stop = function (n) {
    i = this.sounds[n];
    if (i) {
      i.stop();
      i.isPlaying = false;
    }
  };
};
const br = Math.floor;
const Sr = Math.abs;
const Ti = Math.cos;
const Mi = Math.sin;
const Mh = Math.sqrt;
function Eh(e, t, i, n, s, r) {
  this.objects = t;
  this.grids = {};
  this.updateObjects = [];
  let o;
  let l;
  const c = n.mapScale / n.colGrid;
  this.setObjectGrids = function (u) {
    const p = Math.min(n.mapScale, Math.max(0, u.x));
    const w = Math.min(n.mapScale, Math.max(0, u.y));
    for (let x = 0; x < n.colGrid; ++x) {
      o = x * c;
      for (let b = 0; b < n.colGrid; ++b) {
        l = b * c;
        if (p + u.scale >= o && p - u.scale <= o + c && w + u.scale >= l && w - u.scale <= l + c) {
          if (!this.grids[x + "_" + b]) {
            this.grids[x + "_" + b] = [];
          }
          this.grids[x + "_" + b].push(u);
          u.gridLocations.push(x + "_" + b);
        }
      }
    }
  };
  this.removeObjGrid = function (u) {
    let p;
    for (let w = 0; w < u.gridLocations.length; ++w) {
      p = this.grids[u.gridLocations[w]].indexOf(u);
      if (p >= 0) {
        this.grids[u.gridLocations[w]].splice(p, 1);
      }
    }
  };
  this.disableObj = function (u) {
    u.active = false;
    if (r) {
      if (u.owner && u.pps) {
        u.owner.pps -= u.pps;
      }
      this.removeObjGrid(u);
      const p = this.updateObjects.indexOf(u);
      if (p >= 0) {
        this.updateObjects.splice(p, 1);
      }
    }
  };
  this.hitObj = function (u, p) {
    for (let w = 0; w < s.length; ++w) {
      if (s[w].active) {
        if (u.sentTo[s[w].id]) {
          if (u.active) {
            if (s[w].canSee(u)) {
              r.send(s[w].id, "L", i.fixTo(p, 1), u.sid);
            }
          } else {
            r.send(s[w].id, "Q", u.sid);
          }
        }
        if (!u.active && u.owner == s[w]) {
          s[w].changeItemCount(u.group.id, -1);
        }
      }
    }
  };
  const a = [];
  let f;
  this.getGridArrays = function (u, p, w) {
    o = br(u / c);
    l = br(p / c);
    a.length = 0;
    try {
      if (this.grids[o + "_" + l]) {
        a.push(this.grids[o + "_" + l]);
      }
      if (u + w >= (o + 1) * c) {
        f = this.grids[o + 1 + "_" + l];
        if (f) {
          a.push(f);
        }
        if (l && p - w <= l * c) {
          f = this.grids[o + 1 + "_" + (l - 1)];
          if (f) {
            a.push(f);
          }
        } else if (p + w >= (l + 1) * c) {
          f = this.grids[o + 1 + "_" + (l + 1)];
          if (f) {
            a.push(f);
          }
        }
      }
      if (o && u - w <= o * c) {
        f = this.grids[o - 1 + "_" + l];
        if (f) {
          a.push(f);
        }
        if (l && p - w <= l * c) {
          f = this.grids[o - 1 + "_" + (l - 1)];
          if (f) {
            a.push(f);
          }
        } else if (p + w >= (l + 1) * c) {
          f = this.grids[o - 1 + "_" + (l + 1)];
          if (f) {
            a.push(f);
          }
        }
      }
      if (p + w >= (l + 1) * c) {
        f = this.grids[o + "_" + (l + 1)];
        if (f) {
          a.push(f);
        }
      }
      if (l && p - w <= l * c) {
        f = this.grids[o + "_" + (l - 1)];
        if (f) {
          a.push(f);
        }
      }
    } catch {}
    return a;
  };
  let d;
  this.add = function (u, p, w, x, b, $, v, S, R) {
    d = null;
    for (var G = 0; G < t.length; ++G) {
      if (t[G].sid == u) {
        d = t[G];
        break;
      }
    }
    if (!d) {
      for (var G = 0; G < t.length; ++G) {
        if (!t[G].active) {
          d = t[G];
          break;
        }
      }
    }
    if (!d) {
      d = new e(u);
      t.push(d);
    }
    if (S) {
      d.sid = u;
    }
    d.init(p, w, x, b, $, v, R);
    if (r) {
      this.setObjectGrids(d);
      if (d.doUpdate) {
        this.updateObjects.push(d);
      }
    }
  };
  this.disableBySid = function (u) {
    for (let p = 0; p < t.length; ++p) {
      if (t[p].sid == u) {
        this.disableObj(t[p]);
        break;
      }
    }
  };
  this.removeAllItems = function (u, p) {
    for (let w = 0; w < t.length; ++w) {
      if (t[w].active && t[w].owner && t[w].owner.sid == u) {
        this.disableObj(t[w]);
      }
    }
    if (p) {
      p.broadcast("R", u);
    }
  };
  this.fetchSpawnObj = function (u) {
    let p = null;
    for (let w = 0; w < t.length; ++w) {
      d = t[w];
      if (d.active && d.owner && d.owner.sid == u && d.spawnPoint) {
        p = [d.x, d.y];
        this.disableObj(d);
        r.broadcast("Q", d.sid);
        if (d.owner) {
          d.owner.changeItemCount(d.group.id, -1);
        }
        break;
      }
    }
    return p;
  };
  this.checkItemLocation = function (u, p, w, x, b, $, v) {
    for (let S = 0; S < t.length; ++S) {
      const R = t[S].blocker ? t[S].blocker : t[S].getScale(x, t[S].isItem);
      if (t[S].active && i.getDistance(u, p, t[S].x, t[S].y) < w + R) {
        return false;
      }
    }
    return !(!$ && b != 18 && p >= n.mapScale / 2 - n.riverWidth / 2 && p <= n.mapScale / 2 + n.riverWidth / 2);
  };
  this.addProjectile = function (u, p, w, x, b) {
    const $ = items.projectiles[b];
    let v;
    for (let S = 0; S < projectiles.length; ++S) {
      if (!projectiles[S].active) {
        v = projectiles[S];
        break;
      }
    }
    if (!v) {
      v = new Projectile(s, i);
      projectiles.push(v);
    }
    v.init(b, u, p, w, $.speed, x, $.scale);
  };
  this.checkCollision = function (u, p, w) {
    w = w || 1;
    const x = u.x - p.x;
    const b = u.y - p.y;
    let $ = u.scale + p.scale;
    if (Sr(x) <= $ || Sr(b) <= $) {
      $ = u.scale + (p.getScale ? p.getScale() : p.scale);
      let v = Mh(x * x + b * b) - $;
      if (v <= 0) {
        if (p.ignoreCollision) {
          if (p.trap && !u.noTrap && p.owner != u && !(p.owner && p.owner.team && p.owner.team == u.team)) {
            u.lockMove = true;
            p.hideFromEnemy = false;
          } else if (p.boostSpeed) {
            u.xVel += w * p.boostSpeed * (p.weightM || 1) * Ti(p.dir);
            u.yVel += w * p.boostSpeed * (p.weightM || 1) * Mi(p.dir);
          } else if (p.healCol) {
            u.healCol = p.healCol;
          } else if (p.teleport) {
            u.x = i.randInt(0, n.mapScale);
            u.y = i.randInt(0, n.mapScale);
          }
        } else {
          const S = i.getDirection(u.x, u.y, p.x, p.y);
          i.getDistance(u.x, u.y, p.x, p.y);
          if (p.isPlayer) {
            v = v * -1 / 2;
            u.x += v * Ti(S);
            u.y += v * Mi(S);
            p.x -= v * Ti(S);
            p.y -= v * Mi(S);
          } else {
            u.x = p.x + $ * Ti(S);
            u.y = p.y + $ * Mi(S);
            u.xVel *= 0.75;
            u.yVel *= 0.75;
          }
          if (p.dmg && p.owner != u && !(p.owner && p.owner.team && p.owner.team == u.team)) {
            u.changeHealth(-p.dmg, p.owner, p);
            const R = (p.weightM || 1) * 1.5;
            u.xVel += R * Ti(S);
            u.yVel += R * Mi(S);
            if (p.pDmg && !(u.skin && u.skin.poisonRes)) {
              u.dmgOverTime.dmg = p.pDmg;
              u.dmgOverTime.time = 5;
              u.dmgOverTime.doer = p.owner;
            }
            if (u.colDmg && p.health) {
              if (p.changeHealth(-u.colDmg)) {
                this.disableObj(p);
              }
              this.hitObj(p, i.getDirection(u.x, u.y, p.x, p.y));
            }
          }
        }
        if (p.zIndex > u.zIndex) {
          u.zIndex = p.zIndex;
        }
        return true;
      }
    }
    return false;
  };
}
function Ch(e, t, i, n, s, r, o, l, c) {
  this.addProjectile = function (a, f, d, u, p, w, x, b, $) {
    const v = r.projectiles[w];
    let S;
    for (let R = 0; R < t.length; ++R) {
      if (!t[R].active) {
        S = t[R];
        break;
      }
    }
    if (!S) {
      S = new e(i, n, s, r, o, l, c);
      S.sid = t.length;
      t.push(S);
    }
    S.init(w, a, f, d, p, v.dmg, u, v.scale, x);
    S.ignoreObj = b;
    S.layer = $ || v.layer;
    S.src = v.src;
    return S;
  };
}
function Ph(e, t, i, n, s, r, o, l, c) {
  this.aiTypes = [{
    id: 0,
    src: "cow_1",
    killScore: 150,
    health: 500,
    weightM: 0.8,
    speed: 0.00095,
    turnSpeed: 0.001,
    scale: 72,
    drop: ["food", 50]
  }, {
    id: 1,
    src: "pig_1",
    killScore: 200,
    health: 800,
    weightM: 0.6,
    speed: 0.00085,
    turnSpeed: 0.001,
    scale: 72,
    drop: ["food", 80]
  }, {
    id: 2,
    name: "Bull",
    src: "bull_2",
    hostile: true,
    dmg: 20,
    killScore: 1000,
    health: 1800,
    weightM: 0.5,
    speed: 0.00094,
    turnSpeed: 0.00074,
    scale: 78,
    viewRange: 800,
    chargePlayer: true,
    drop: ["food", 100]
  }, {
    id: 3,
    name: "Bully",
    src: "bull_1",
    hostile: true,
    dmg: 20,
    killScore: 2000,
    health: 2800,
    weightM: 0.45,
    speed: 0.001,
    turnSpeed: 0.0008,
    scale: 90,
    viewRange: 900,
    chargePlayer: true,
    drop: ["food", 400]
  }, {
    id: 4,
    name: "Wolf",
    src: "wolf_1",
    hostile: true,
    dmg: 8,
    killScore: 500,
    health: 300,
    weightM: 0.45,
    speed: 0.001,
    turnSpeed: 0.002,
    scale: 84,
    viewRange: 800,
    chargePlayer: true,
    drop: ["food", 200]
  }, {
    id: 5,
    name: "Quack",
    src: "chicken_1",
    dmg: 8,
    killScore: 2000,
    noTrap: true,
    health: 300,
    weightM: 0.2,
    speed: 0.0018,
    turnSpeed: 0.006,
    scale: 70,
    drop: ["food", 100]
  }, {
    id: 6,
    name: "MOOSTAFA",
    nameScale: 50,
    src: "enemy",
    hostile: true,
    dontRun: true,
    fixedSpawn: true,
    spawnDelay: 60000,
    noTrap: true,
    colDmg: 100,
    dmg: 40,
    killScore: 8000,
    health: 18000,
    weightM: 0.4,
    speed: 0.0007,
    turnSpeed: 0.01,
    scale: 80,
    spriteMlt: 1.8,
    leapForce: 0.9,
    viewRange: 1000,
    hitRange: 210,
    hitDelay: 1000,
    chargePlayer: true,
    drop: ["food", 100]
  }, {
    id: 7,
    name: "Treasure",
    hostile: true,
    nameScale: 35,
    src: "crate_1",
    fixedSpawn: true,
    spawnDelay: 120000,
    colDmg: 200,
    killScore: 5000,
    health: 20000,
    weightM: 0.1,
    speed: 0,
    turnSpeed: 0,
    scale: 70,
    spriteMlt: 1
  }, {
    id: 8,
    name: "MOOFIE",
    src: "wolf_2",
    hostile: true,
    fixedSpawn: true,
    dontRun: true,
    hitScare: 4,
    spawnDelay: 30000,
    noTrap: true,
    nameScale: 35,
    dmg: 10,
    colDmg: 100,
    killScore: 3000,
    health: 7000,
    weightM: 0.45,
    speed: 0.0015,
    turnSpeed: 0.002,
    scale: 90,
    viewRange: 800,
    chargePlayer: true,
    drop: ["food", 1000]
  }, {
    id: 9,
    name: "ðŸ’€MOOFIE",
    src: "wolf_2",
    hostile: true,
    fixedSpawn: true,
    dontRun: true,
    hitScare: 50,
    spawnDelay: 60000,
    noTrap: true,
    nameScale: 35,
    dmg: 12,
    colDmg: 100,
    killScore: 3000,
    health: 9000,
    weightM: 0.45,
    speed: 0.0015,
    turnSpeed: 0.0025,
    scale: 94,
    viewRange: 1440,
    chargePlayer: true,
    drop: ["food", 3000],
    minSpawnRange: 0.85,
    maxSpawnRange: 0.9
  }, {
    id: 10,
    name: "ðŸ’€Wolf",
    src: "wolf_1",
    hostile: true,
    fixedSpawn: true,
    dontRun: true,
    hitScare: 50,
    spawnDelay: 30000,
    dmg: 10,
    killScore: 700,
    health: 500,
    weightM: 0.45,
    speed: 0.00115,
    turnSpeed: 0.0025,
    scale: 88,
    viewRange: 1440,
    chargePlayer: true,
    drop: ["food", 400],
    minSpawnRange: 0.85,
    maxSpawnRange: 0.9
  }, {
    id: 11,
    name: "ðŸ’€Bully",
    src: "bull_1",
    hostile: true,
    fixedSpawn: true,
    dontRun: true,
    hitScare: 50,
    dmg: 20,
    killScore: 5000,
    health: 5000,
    spawnDelay: 100000,
    weightM: 0.45,
    speed: 0.00115,
    turnSpeed: 0.0025,
    scale: 94,
    viewRange: 1440,
    chargePlayer: true,
    drop: ["food", 800],
    minSpawnRange: 0.85,
    maxSpawnRange: 0.9
  }];
  this.spawn = function (a, f, d, u) {
    if (!this.aiTypes[u]) {
      console.error("missing ai type", u);
      return this.spawn(a, f, d, 0);
    }
    let p;
    for (let w = 0; w < e.length; ++w) {
      if (!e[w].active) {
        p = e[w];
        break;
      }
    }
    if (!p) {
      p = new t(e.length, s, i, n, o, r, l, c);
      e.push(p);
    }
    p.init(a, f, d, u, this.aiTypes[u]);
    return p;
  };
}
const Nt = Math.PI * 2;
const Gn = 0;
function $h(e, t, i, n, s, r, o, l) {
  this.sid = e;
  this.isAI = true;
  this.nameIndex = s.randInt(0, r.cowNames.length - 1);
  this.init = function (d, u, p, w, x) {
    this.x = d;
    this.y = u;
    this.startX = x.fixedSpawn ? d : null;
    this.startY = x.fixedSpawn ? u : null;
    this.xVel = 0;
    this.yVel = 0;
    this.zIndex = 0;
    this.dir = p;
    this.dirPlus = 0;
    this.index = w;
    this.src = x.src;
    if (x.name) {
      this.name = x.name;
    }
    if ((this.name || "").startsWith("ðŸ’€")) {
      this.isVolcanoAi = true;
    }
    this.weightM = x.weightM;
    this.speed = x.speed;
    this.killScore = x.killScore;
    this.turnSpeed = x.turnSpeed;
    this.scale = x.scale;
    this.maxHealth = x.health;
    this.leapForce = x.leapForce;
    this.health = this.maxHealth;
    this.chargePlayer = x.chargePlayer;
    this.viewRange = x.viewRange;
    this.drop = x.drop;
    this.dmg = x.dmg;
    this.hostile = x.hostile;
    this.dontRun = x.dontRun;
    this.hitRange = x.hitRange;
    this.hitDelay = x.hitDelay;
    this.hitScare = x.hitScare;
    this.spriteMlt = x.spriteMlt;
    this.nameScale = x.nameScale;
    this.colDmg = x.colDmg;
    this.noTrap = x.noTrap;
    this.spawnDelay = x.spawnDelay;
    this.minSpawnRange = x.minSpawnRange;
    this.maxSpawnRange = x.maxSpawnRange;
    this.hitWait = 0;
    this.waitCount = 1000;
    this.moveCount = 0;
    this.targetDir = 0;
    this.active = true;
    this.alive = true;
    this.runFrom = null;
    this.chargeTarget = null;
    this.dmgOverTime = {};
  };
  this.getVolcanoAggression = function () {
    const d = s.getDistance(this.x, this.y, r.volcanoLocationX, r.volcanoLocationY);
    const u = d > r.volcanoAggressionRadius ? 0 : r.volcanoAggressionRadius - d;
    return 1 + r.volcanoAggressionPercentage * (1 - u / r.volcanoAggressionRadius);
  };
  let c = 0;
  this.update = function (d) {
    if (this.active) {
      if (this.spawnCounter) {
        this.spawnCounter -= d * 1 * this.getVolcanoAggression();
        if (this.spawnCounter <= 0) {
          this.spawnCounter = 0;
          if (this.minSpawnRange || this.maxSpawnRange) {
            const V = r.mapScale * this.minSpawnRange;
            const F = r.mapScale * this.maxSpawnRange;
            this.x = s.randInt(V, F);
            this.y = s.randInt(V, F);
          } else {
            this.x = this.startX || s.randInt(0, r.mapScale);
            this.y = this.startY || s.randInt(0, r.mapScale);
          }
        }
        return;
      }
      c -= d;
      if (c <= 0) {
        if (this.dmgOverTime.dmg) {
          this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer);
          this.dmgOverTime.time -= 1;
          if (this.dmgOverTime.time <= 0) {
            this.dmgOverTime.dmg = 0;
          }
        }
        c = 1000;
      }
      let v = false;
      let S = 1;
      if (!this.zIndex && !this.lockMove && this.y >= r.mapScale / 2 - r.riverWidth / 2 && this.y <= r.mapScale / 2 + r.riverWidth / 2) {
        S = 0.33;
        this.xVel += r.waterCurrent * d;
      }
      if (this.lockMove) {
        this.xVel = 0;
        this.yVel = 0;
      } else if (this.waitCount > 0) {
        this.waitCount -= d;
        if (this.waitCount <= 0) {
          if (this.chargePlayer) {
            let V;
            let F;
            let _;
            for (var u = 0; u < i.length; ++u) {
              if (i[u].alive && !(i[u].skin && i[u].skin.bullRepel)) {
                _ = s.getDistance(this.x, this.y, i[u].x, i[u].y);
                if (_ <= this.viewRange && (!V || _ < F)) {
                  F = _;
                  V = i[u];
                }
              }
            }
            if (V) {
              this.chargeTarget = V;
              this.moveCount = s.randInt(8000, 12000);
            } else {
              this.moveCount = s.randInt(1000, 2000);
              this.targetDir = s.randFloat(-Math.PI, Math.PI);
            }
          } else {
            this.moveCount = s.randInt(4000, 10000);
            this.targetDir = s.randFloat(-Math.PI, Math.PI);
          }
        }
      } else if (this.moveCount > 0) {
        var p = this.speed * S * (1 + r.MAX_SPEED * Gn) * this.getVolcanoAggression();
        if (this.runFrom && this.runFrom.active && !(this.runFrom.isPlayer && !this.runFrom.alive)) {
          this.targetDir = s.getDirection(this.x, this.y, this.runFrom.x, this.runFrom.y);
          p *= 1.42;
        } else if (this.chargeTarget && this.chargeTarget.alive) {
          this.targetDir = s.getDirection(this.chargeTarget.x, this.chargeTarget.y, this.x, this.y);
          p *= 1.75;
          v = true;
        }
        if (this.hitWait) {
          p *= 0.3;
        }
        if (this.dir != this.targetDir) {
          this.dir %= Nt;
          const V = (this.dir - this.targetDir + Nt) % Nt;
          const F = Math.min(Math.abs(V - Nt), V, this.turnSpeed * d);
          const _ = V - Math.PI >= 0 ? 1 : -1;
          this.dir += _ * F + Nt;
        }
        this.dir %= Nt;
        this.xVel += p * d * Math.cos(this.dir);
        this.yVel += p * d * Math.sin(this.dir);
        this.moveCount -= d;
        if (this.moveCount <= 0) {
          this.runFrom = null;
          this.chargeTarget = null;
          this.waitCount = this.hostile ? 1500 : s.randInt(1500, 6000);
        }
      }
      this.zIndex = 0;
      this.lockMove = false;
      var w;
      const R = s.getDistance(0, 0, this.xVel * d, this.yVel * d);
      const G = Math.min(4, Math.max(1, Math.round(R / 40)));
      const X = 1 / G;
      for (var u = 0; u < G; ++u) {
        if (this.xVel) {
          this.x += this.xVel * d * X;
        }
        if (this.yVel) {
          this.y += this.yVel * d * X;
        }
        w = t.getGridArrays(this.x, this.y, this.scale);
        for (var x = 0; x < w.length; ++x) {
          for (let F = 0; F < w[x].length; ++F) {
            if (w[x][F].active) {
              t.checkCollision(this, w[x][F], X);
            }
          }
        }
      }
      let W = false;
      if (this.hitWait > 0 && (this.hitWait -= d, this.hitWait <= 0)) {
        W = true;
        this.hitWait = 0;
        if (this.leapForce && !s.randInt(0, 2)) {
          this.xVel += this.leapForce * Math.cos(this.dir);
          this.yVel += this.leapForce * Math.sin(this.dir);
        }
        var w = t.getGridArrays(this.x, this.y, this.hitRange);
        var b;
        var $;
        for (let F = 0; F < w.length; ++F) {
          for (var x = 0; x < w[F].length; ++x) {
            b = w[F][x];
            if (b.health) {
              $ = s.getDistance(this.x, this.y, b.x, b.y);
              if ($ < b.scale + this.hitRange) {
                if (b.changeHealth(-this.dmg * 5)) {
                  t.disableObj(b);
                }
                t.hitObj(b, s.getDirection(this.x, this.y, b.x, b.y));
              }
            }
          }
        }
        for (var x = 0; x < i.length; ++x) {
          if (i[x].canSee(this)) {
            l.send(i[x].id, "J", this.sid);
          }
        }
      }
      if (v || W) {
        var b;
        var $;
        let _;
        for (var u = 0; u < i.length; ++u) {
          b = i[u];
          if (b && b.alive) {
            $ = s.getDistance(this.x, this.y, b.x, b.y);
            if (this.hitRange) {
              if (!this.hitWait && $ <= this.hitRange + b.scale) {
                if (W) {
                  _ = s.getDirection(b.x, b.y, this.x, this.y);
                  b.changeHealth(-this.dmg * (1 + r.MAX_ATTACK * Gn) * this.getVolcanoAggression());
                  b.xVel += Math.cos(_) * 0.6;
                  b.yVel += Math.sin(_) * 0.6;
                  this.runFrom = null;
                  this.chargeTarget = null;
                  this.waitCount = 3000;
                  this.hitWait = s.randInt(0, 2) ? 0 : 600;
                } else {
                  this.hitWait = this.hitDelay;
                }
              }
            } else if ($ <= this.scale + b.scale) {
              _ = s.getDirection(b.x, b.y, this.x, this.y);
              b.changeHealth(-this.dmg * (1 + r.MAX_ATTACK * Gn) * this.getVolcanoAggression());
              b.xVel += Math.cos(_) * 0.55;
              b.yVel += Math.sin(_) * 0.55;
            }
          }
        }
      }
      if (this.xVel) {
        this.xVel *= Math.pow(r.playerDecel, d);
      }
      if (this.yVel) {
        this.yVel *= Math.pow(r.playerDecel, d);
      }
      const M = this.scale;
      if (this.x - M < 0) {
        this.x = M;
        this.xVel = 0;
      } else if (this.x + M > r.mapScale) {
        this.x = r.mapScale - M;
        this.xVel = 0;
      }
      if (this.y - M < 0) {
        this.y = M;
        this.yVel = 0;
      } else if (this.y + M > r.mapScale) {
        this.y = r.mapScale - M;
        this.yVel = 0;
      }
      if (this.isVolcanoAi) {
        if (this.chargeTarget && (s.getDistance(this.chargeTarget.x, this.chargeTarget.y, r.volcanoLocationX, r.volcanoLocationY) || 0) > r.volcanoAggressionRadius) {
          this.chargeTarget = null;
        }
        if (this.xVel) {
          if (this.x < r.volcanoLocationX - r.volcanoAggressionRadius) {
            this.x = r.volcanoLocationX - r.volcanoAggressionRadius;
            this.xVel = 0;
          } else if (this.x > r.volcanoLocationX + r.volcanoAggressionRadius) {
            this.x = r.volcanoLocationX + r.volcanoAggressionRadius;
            this.xVel = 0;
          }
        }
        if (this.yVel) {
          if (this.y < r.volcanoLocationY - r.volcanoAggressionRadius) {
            this.y = r.volcanoLocationY - r.volcanoAggressionRadius;
            this.yVel = 0;
          } else if (this.y > r.volcanoLocationY + r.volcanoAggressionRadius) {
            this.y = r.volcanoLocationY + r.volcanoAggressionRadius;
            this.yVel = 0;
          }
        }
      }
    }
  };
  this.canSee = function (d) {
    if (!d || d.skin && d.skin.invisTimer && d.noMovTimer >= d.skin.invisTimer) {
      return false;
    }
    const u = Math.abs(d.x - this.x) - d.scale;
    const p = Math.abs(d.y - this.y) - d.scale;
    return u <= r.maxScreenWidth / 2 * 1.3 && p <= r.maxScreenHeight / 2 * 1.3;
  };
  let a = 0;
  let f = 0;
  this.animate = function (d) {
    if (this.animTime > 0) {
      this.animTime -= d;
      if (this.animTime <= 0) {
        this.animTime = 0;
        this.dirPlus = 0;
        a = 0;
        f = 0;
      } else if (f == 0) {
        a += d / (this.animSpeed * r.hitReturnRatio);
        this.dirPlus = s.lerp(0, this.targetAngle, Math.min(1, a));
        if (a >= 1) {
          a = 1;
          f = 1;
        }
      } else {
        a -= d / (this.animSpeed * (1 - r.hitReturnRatio));
        this.dirPlus = s.lerp(0, this.targetAngle, Math.max(0, a));
      }
    }
  };
  this.startAnim = function () {
    this.animTime = this.animSpeed = 600;
    this.targetAngle = Math.PI * 0.8;
    a = 0;
    f = 0;
  };
  this.changeHealth = function (d, u, p) {
    if (this.active && (this.health += d, p && (this.hitScare && !s.randInt(0, this.hitScare) ? (this.runFrom = p, this.waitCount = 0, this.moveCount = 2000) : this.hostile && this.chargePlayer && p.isPlayer ? (this.chargeTarget = p, this.waitCount = 0, this.moveCount = 8000) : this.dontRun || (this.runFrom = p, this.waitCount = 0, this.moveCount = 2000)), d < 0 && this.hitRange && s.randInt(0, 1) && (this.hitWait = 500), u && u.canSee(this) && d < 0 && l.send(u.id, "8", Math.round(this.x), Math.round(this.y), Math.round(-d), 1), this.health <= 0)) {
      if (this.spawnDelay) {
        this.spawnCounter = this.spawnDelay;
        this.x = -1000000;
        this.y = -1000000;
      } else if (this.minSpawnRange || this.maxSpawnRange) {
        const w = r.mapScale * this.minSpawnRange;
        const x = r.mapScale * this.maxSpawnRange;
        this.x = s.randInt(w, x);
        this.y = s.randInt(w, x);
      } else {
        this.x = this.startX || s.randInt(0, r.mapScale);
        this.y = this.startY || s.randInt(0, r.mapScale);
      }
      this.health = this.maxHealth;
      this.runFrom = null;
      if (u && (o(u, this.killScore), this.drop)) {
        for (let w = 0; w < this.drop.length;) {
          u.addResource(r.resourceTypes.indexOf(this.drop[w]), this.drop[w + 1]);
          w += 2;
        }
      }
    }
  };
}
function Rh(e) {
  this.sid = e;
  this.init = function (t, i, n, s, r, o, l) {
    o = o || {};
    this.sentTo = {};
    this.gridLocations = [];
    this.active = true;
    this.doUpdate = o.doUpdate;
    this.x = t;
    this.y = i;
    this.dir = n;
    this.xWiggle = 0;
    this.yWiggle = 0;
    this.scale = s;
    this.type = r;
    this.id = o.id;
    this.owner = l;
    this.name = o.name;
    this.isItem = this.id != null;
    this.group = o.group;
    this.health = o.health;
    this.layer = 2;
    if (this.group != null) {
      this.layer = this.group.layer;
    } else if (this.type == 0) {
      this.layer = 3;
    } else if (this.type == 2) {
      this.layer = 0;
    } else if (this.type == 4) {
      this.layer = -1;
    }
    this.colDiv = o.colDiv || 1;
    this.blocker = o.blocker;
    this.ignoreCollision = o.ignoreCollision;
    this.dontGather = o.dontGather;
    this.hideFromEnemy = o.hideFromEnemy;
    this.friction = o.friction;
    this.projDmg = o.projDmg;
    this.dmg = o.dmg;
    this.pDmg = o.pDmg;
    this.pps = o.pps;
    this.zIndex = o.zIndex || 0;
    this.turnSpeed = o.turnSpeed;
    this.req = o.req;
    this.trap = o.trap;
    this.healCol = o.healCol;
    this.teleport = o.teleport;
    this.boostSpeed = o.boostSpeed;
    this.projectile = o.projectile;
    this.shootRange = o.shootRange;
    this.shootRate = o.shootRate;
    this.shootCount = this.shootRate;
    this.spawnPoint = o.spawnPoint;
  };
  this.changeHealth = function (t, i) {
    this.health += t;
    return this.health <= 0;
  };
  this.getScale = function (t, i) {
    t = t || 1;
    return this.scale * (this.isItem || this.type == 2 || this.type == 3 || this.type == 4 ? 1 : t * 0.6) * (i ? 1 : this.colDiv);
  };
  this.visibleToPlayer = function (t) {
    return !this.hideFromEnemy || this.owner && (this.owner == t || this.owner.team && t.team == this.owner.team);
  };
  this.update = function (t) {
    if (this.active) {
      if (this.xWiggle) {
        this.xWiggle *= Math.pow(0.99, t);
      }
      if (this.yWiggle) {
        this.yWiggle *= Math.pow(0.99, t);
      }
      //if (this.turnSpeed) {
      //  this.dir += this.turnSpeed * t;
      //}
    }
  };
}
const de = [{
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
  sandboxLimit: 299,
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
  sandboxLimit: 299,
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
  sandboxLimit: 299,
  layer: -1
}];
const Ah = [{
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
const Dh = [{
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
  shield: 0.2,
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
  projectile: 5,
  hideProjectile: true,
  spdMult: 0.6,
  speed: 1500
}];
const Zt = [{
  group: de[0],
  name: "apple",
  desc: "restores 20 health when consumed",
  req: ["food", 10],
  consume: function (e) {
    return e.changeHealth(20, e);
  },
  scale: 22,
  holdOffset: 15
}, {
  age: 3,
  group: de[0],
  name: "cookie",
  desc: "restores 40 health when consumed",
  req: ["food", 15],
  consume: function (e) {
    return e.changeHealth(40, e);
  },
  scale: 27,
  holdOffset: 15
}, {
  age: 7,
  group: de[0],
  name: "cheese",
  desc: "restores 30 health and another 50 over 5 seconds",
  req: ["food", 25],
  consume: function (e) {
    if (e.changeHealth(30, e) || e.health < 100) {
      e.dmgOverTime.dmg = -10;
      e.dmgOverTime.doer = e;
      e.dmgOverTime.time = 5;
      return true;
    } else {
      return false;
    }
  },
  scale: 27,
  holdOffset: 15
}, {
  group: de[1],
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
  group: de[1],
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
  group: de[1],
  name: "castle wall",
  desc: "provides powerful protection for your village",
  req: ["stone", 35],
  health: 1500,
  scale: 52,
  holdOffset: 20,
  placeOffset: -5
}, {
  group: de[2],
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
  group: de[2],
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
  group: de[2],
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
  group: de[2],
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
  group: de[3],
  name: "windmill",
  desc: "generates gold over time",
  req: ["wood", 50, "stone", 10],
  health: 400,
  pps: 1,
  turnSpeed: 0.0016,
  spritePadding: 25,
  iconLineMult: 12,
  scale: 45,
  holdOffset: 20,
  placeOffset: 5
}, {
  age: 5,
  pre: 1,
  group: de[3],
  name: "faster windmill",
  desc: "generates more gold over time",
  req: ["wood", 60, "stone", 20],
  health: 500,
  pps: 1.5,
  turnSpeed: 0.0025,
  spritePadding: 25,
  iconLineMult: 12,
  scale: 47,
  holdOffset: 20,
  placeOffset: 5
}, {
  age: 8,
  pre: 1,
  group: de[3],
  name: "power mill",
  desc: "generates more gold over time",
  req: ["wood", 100, "stone", 50],
  health: 800,
  pps: 2,
  turnSpeed: 0.005,
  spritePadding: 25,
  iconLineMult: 12,
  scale: 47,
  holdOffset: 20,
  placeOffset: 5
}, {
  age: 5,
  group: de[4],
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
  group: de[11],
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
  group: de[5],
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
  group: de[6],
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
  group: de[7],
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
  group: de[8],
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
  group: de[9],
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
  group: de[10],
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
  group: de[12],
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
  group: de[13],
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
for (let e = 0; e < Zt.length; ++e) {
  Zt[e].id = e;
  if (Zt[e].pre) {
    Zt[e].pre = e - Zt[e].pre;
  }
}
const L = {
  groups: de,
  projectiles: Ah,
  weapons: Dh,
  list: Zt
};
const Oh = ["ahole", "anus", "ash0le", "ash0les", "asholes", "ass", "Ass Monkey", "Assface", "assh0le", "assh0lez", "asshole", "assholes", "assholz", "asswipe", "azzhole", "bassterds", "bastard", "bastards", "bastardz", "basterds", "basterdz", "Biatch", "bitch", "bitches", "Blow Job", "boffing", "butthole", "buttwipe", "c0ck", "c0cks", "c0k", "Carpet Muncher", "cawk", "cawks", "Clit", "cnts", "cntz", "cock", "cockhead", "cock-head", "cocks", "CockSucker", "cock-sucker", "crap", "cum", "cunt", "cunts", "cuntz", "dick", "dild0", "dild0s", "dildo", "dildos", "dilld0", "dilld0s", "dominatricks", "dominatrics", "dominatrix", "dyke", "enema", "f u c k", "f u c k e r", "fag", "fag1t", "faget", "fagg1t", "faggit", "faggot", "fagg0t", "fagit", "fags", "fagz", "faig", "faigs", "fart", "flipping the bird", "fuck", "fucker", "fuckin", "fucking", "fucks", "Fudge Packer", "fuk", "Fukah", "Fuken", "fuker", "Fukin", "Fukk", "Fukkah", "Fukken", "Fukker", "Fukkin", "g00k", "God-damned", "h00r", "h0ar", "h0re", "hells", "hoar", "hoor", "hoore", "jackoff", "jap", "japs", "jerk-off", "jisim", "jiss", "jizm", "jizz", "knob", "knobs", "knobz", "kunt", "kunts", "kuntz", "Lezzian", "Lipshits", "Lipshitz", "masochist", "masokist", "massterbait", "masstrbait", "masstrbate", "masterbaiter", "masterbate", "masterbates", "Motha Fucker", "Motha Fuker", "Motha Fukkah", "Motha Fukker", "Mother Fucker", "Mother Fukah", "Mother Fuker", "Mother Fukkah", "Mother Fukker", "mother-fucker", "Mutha Fucker", "Mutha Fukah", "Mutha Fuker", "Mutha Fukkah", "Mutha Fukker", "n1gr", "nastt", "nigger;", "nigur;", "niiger;", "niigr;", "orafis", "orgasim;", "orgasm", "orgasum", "oriface", "orifice", "orifiss", "packi", "packie", "packy", "paki", "pakie", "paky", "pecker", "peeenus", "peeenusss", "peenus", "peinus", "pen1s", "penas", "penis", "penis-breath", "penus", "penuus", "Phuc", "Phuck", "Phuk", "Phuker", "Phukker", "polac", "polack", "polak", "Poonani", "pr1c", "pr1ck", "pr1k", "pusse", "pussee", "pussy", "puuke", "puuker", "qweir", "recktum", "rectum", "retard", "sadist", "scank", "schlong", "screwing", "semen", "sex", "sexy", "Sh!t", "sh1t", "sh1ter", "sh1ts", "sh1tter", "sh1tz", "shit", "shits", "shitter", "Shitty", "Shity", "shitz", "Shyt", "Shyte", "Shytty", "Shyty", "skanck", "skank", "skankee", "skankey", "skanks", "Skanky", "slag", "slut", "sluts", "Slutty", "slutz", "son-of-a-bitch", "tit", "turd", "va1jina", "vag1na", "vagiina", "vagina", "vaj1na", "vajina", "vullva", "vulva", "w0p", "wh00r", "wh0re", "whore", "xrated", "xxx", "b!+ch", "bitch", "blowjob", "clit", "arschloch", "fuck", "shit", "ass", "asshole", "b!tch", "b17ch", "b1tch", "bastard", "bi+ch", "boiolas", "buceta", "c0ck", "cawk", "chink", "cipa", "clits", "cock", "cum", "cunt", "dildo", "dirsa", "ejakulate", "fatass", "fcuk", "fuk", "fux0r", "hoer", "hore", "jism", "kawk", "l3itch", "l3i+ch", "masturbate", "masterbat*", "masterbat3", "motherfucker", "s.o.b.", "mofo", "nazi", "nigga", "nigger", "nutsack", "phuck", "pimpis", "pusse", "pussy", "scrotum", "sh!t", "shemale", "shi+", "sh!+", "slut", "smut", "teets", "tits", "boobs", "b00bs", "teez", "testical", "testicle", "titt", "w00se", "jackoff", "wank", "whoar", "whore", "*damn", "*dyke", "*fuck*", "*shit*", "@$$", "amcik", "andskota", "arse*", "assrammer", "ayir", "bi7ch", "bitch*", "bollock*", "breasts", "butt-pirate", "cabron", "cazzo", "chraa", "chuj", "Cock*", "cunt*", "d4mn", "daygo", "dego", "dick*", "dike*", "dupa", "dziwka", "ejackulate", "Ekrem*", "Ekto", "enculer", "faen", "fag*", "fanculo", "fanny", "feces", "feg", "Felcher", "ficken", "fitt*", "Flikker", "foreskin", "Fotze", "Fu(*", "fuk*", "futkretzn", "gook", "guiena", "h0r", "h4x0r", "hell", "helvete", "hoer*", "honkey", "Huevon", "hui", "injun", "jizz", "kanker*", "kike", "klootzak", "kraut", "knulle", "kuk", "kuksuger", "Kurac", "kurwa", "kusi*", "kyrpa*", "lesbo", "mamhoon", "masturbat*", "merd*", "mibun", "monkleigh", "mouliewop", "muie", "mulkku", "muschi", "nazis", "nepesaurio", "nigger*", "orospu", "paska*", "perse", "picka", "pierdol*", "pillu*", "pimmel", "piss*", "pizda", "poontsee", "poop", "porn", "p0rn", "pr0n", "preteen", "pula", "pule", "puta", "puto", "qahbeh", "queef*", "rautenberg", "schaffer", "scheiss*", "schlampe", "schmuck", "screw", "sh!t*", "sharmuta", "sharmute", "shipal", "shiz", "skribz", "skurwysyn", "sphencter", "spic", "spierdalaj", "splooge", "suka", "b00b*", "testicle*", "titt*", "twat", "vittu", "wank*", "wetback*", "wichser", "wop*", "yed", "zabourah"];
const _h = {
  words: Oh
};
var zh = {
  "4r5e": 1,
  "5h1t": 1,
  "5hit": 1,
  a55: 1,
  anal: 1,
  anus: 1,
  ar5e: 1,
  arrse: 1,
  arse: 1,
  ass: 1,
  "ass-fucker": 1,
  asses: 1,
  assfucker: 1,
  assfukka: 1,
  asshole: 1,
  assholes: 1,
  asswhole: 1,
  a_s_s: 1,
  "b!tch": 1,
  b00bs: 1,
  b17ch: 1,
  b1tch: 1,
  ballbag: 1,
  balls: 1,
  ballsack: 1,
  bastard: 1,
  beastial: 1,
  beastiality: 1,
  bellend: 1,
  bestial: 1,
  bestiality: 1,
  "bi+ch": 1,
  biatch: 1,
  bitch: 1,
  bitcher: 1,
  bitchers: 1,
  bitches: 1,
  bitchin: 1,
  bitching: 1,
  bloody: 1,
  "blow job": 1,
  blowjob: 1,
  blowjobs: 1,
  boiolas: 1,
  bollock: 1,
  bollok: 1,
  boner: 1,
  boob: 1,
  boobs: 1,
  booobs: 1,
  boooobs: 1,
  booooobs: 1,
  booooooobs: 1,
  breasts: 1,
  buceta: 1,
  bugger: 1,
  bum: 1,
  "bunny fucker": 1,
  butt: 1,
  butthole: 1,
  buttmuch: 1,
  buttplug: 1,
  c0ck: 1,
  c0cksucker: 1,
  "carpet muncher": 1,
  cawk: 1,
  chink: 1,
  cipa: 1,
  cl1t: 1,
  clit: 1,
  clitoris: 1,
  clits: 1,
  cnut: 1,
  cock: 1,
  "cock-sucker": 1,
  cockface: 1,
  cockhead: 1,
  cockmunch: 1,
  cockmuncher: 1,
  cocks: 1,
  cocksuck: 1,
  cocksucked: 1,
  cocksucker: 1,
  cocksucking: 1,
  cocksucks: 1,
  cocksuka: 1,
  cocksukka: 1,
  cok: 1,
  cokmuncher: 1,
  coksucka: 1,
  coon: 1,
  cox: 1,
  crap: 1,
  cum: 1,
  cummer: 1,
  cumming: 1,
  cums: 1,
  cumshot: 1,
  cunilingus: 1,
  cunillingus: 1,
  cunnilingus: 1,
  cunt: 1,
  cuntlick: 1,
  cuntlicker: 1,
  cuntlicking: 1,
  cunts: 1,
  cyalis: 1,
  cyberfuc: 1,
  cyberfuck: 1,
  cyberfucked: 1,
  cyberfucker: 1,
  cyberfuckers: 1,
  cyberfucking: 1,
  d1ck: 1,
  damn: 1,
  dick: 1,
  dickhead: 1,
  dildo: 1,
  dildos: 1,
  dink: 1,
  dinks: 1,
  dirsa: 1,
  dlck: 1,
  "dog-fucker": 1,
  doggin: 1,
  dogging: 1,
  donkeyribber: 1,
  doosh: 1,
  duche: 1,
  dyke: 1,
  ejaculate: 1,
  ejaculated: 1,
  ejaculates: 1,
  ejaculating: 1,
  ejaculatings: 1,
  ejaculation: 1,
  ejakulate: 1,
  "f u c k": 1,
  "f u c k e r": 1,
  f4nny: 1,
  fag: 1,
  fagging: 1,
  faggitt: 1,
  faggot: 1,
  faggs: 1,
  fagot: 1,
  fagots: 1,
  fags: 1,
  fanny: 1,
  fannyflaps: 1,
  fannyfucker: 1,
  fanyy: 1,
  fatass: 1,
  fcuk: 1,
  fcuker: 1,
  fcuking: 1,
  feck: 1,
  fecker: 1,
  felching: 1,
  fellate: 1,
  fellatio: 1,
  fingerfuck: 1,
  fingerfucked: 1,
  fingerfucker: 1,
  fingerfuckers: 1,
  fingerfucking: 1,
  fingerfucks: 1,
  fistfuck: 1,
  fistfucked: 1,
  fistfucker: 1,
  fistfuckers: 1,
  fistfucking: 1,
  fistfuckings: 1,
  fistfucks: 1,
  flange: 1,
  fook: 1,
  fooker: 1,
  fuck: 1,
  fucka: 1,
  fucked: 1,
  fucker: 1,
  fuckers: 1,
  fuckhead: 1,
  fuckheads: 1,
  fuckin: 1,
  fucking: 1,
  fuckings: 1,
  fuckingshitmotherfucker: 1,
  fuckme: 1,
  fucks: 1,
  fuckwhit: 1,
  fuckwit: 1,
  "fudge packer": 1,
  fudgepacker: 1,
  fuk: 1,
  fuker: 1,
  fukker: 1,
  fukkin: 1,
  fuks: 1,
  fukwhit: 1,
  fukwit: 1,
  fux: 1,
  fux0r: 1,
  f_u_c_k: 1,
  gangbang: 1,
  gangbanged: 1,
  gangbangs: 1,
  gaylord: 1,
  gaysex: 1,
  goatse: 1,
  God: 1,
  "god-dam": 1,
  "god-damned": 1,
  goddamn: 1,
  goddamned: 1,
  hardcoresex: 1,
  hell: 1,
  heshe: 1,
  hoar: 1,
  hoare: 1,
  hoer: 1,
  homo: 1,
  hore: 1,
  horniest: 1,
  horny: 1,
  hotsex: 1,
  "jack-off": 1,
  jackoff: 1,
  jap: 1,
  "jerk-off": 1,
  jism: 1,
  jiz: 1,
  jizm: 1,
  jizz: 1,
  kawk: 1,
  knob: 1,
  knobead: 1,
  knobed: 1,
  knobend: 1,
  knobhead: 1,
  knobjocky: 1,
  knobjokey: 1,
  kock: 1,
  kondum: 1,
  kondums: 1,
  kum: 1,
  kummer: 1,
  kumming: 1,
  kums: 1,
  kunilingus: 1,
  "l3i+ch": 1,
  l3itch: 1,
  labia: 1,
  lust: 1,
  lusting: 1,
  m0f0: 1,
  m0fo: 1,
  m45terbate: 1,
  ma5terb8: 1,
  ma5terbate: 1,
  masochist: 1,
  "master-bate": 1,
  masterb8: 1,
  "masterbat*": 1,
  masterbat3: 1,
  masterbate: 1,
  masterbation: 1,
  masterbations: 1,
  masturbate: 1,
  "mo-fo": 1,
  mof0: 1,
  mofo: 1,
  mothafuck: 1,
  mothafucka: 1,
  mothafuckas: 1,
  mothafuckaz: 1,
  mothafucked: 1,
  mothafucker: 1,
  mothafuckers: 1,
  mothafuckin: 1,
  mothafucking: 1,
  mothafuckings: 1,
  mothafucks: 1,
  "mother fucker": 1,
  motherfuck: 1,
  motherfucked: 1,
  motherfucker: 1,
  motherfuckers: 1,
  motherfuckin: 1,
  motherfucking: 1,
  motherfuckings: 1,
  motherfuckka: 1,
  motherfucks: 1,
  muff: 1,
  mutha: 1,
  muthafecker: 1,
  muthafuckker: 1,
  muther: 1,
  mutherfucker: 1,
  n1gga: 1,
  n1gger: 1,
  nazi: 1,
  nigg3r: 1,
  nigg4h: 1,
  nigga: 1,
  niggah: 1,
  niggas: 1,
  niggaz: 1,
  nigger: 1,
  niggers: 1,
  nob: 1,
  "nob jokey": 1,
  nobhead: 1,
  nobjocky: 1,
  nobjokey: 1,
  numbnuts: 1,
  nutsack: 1,
  orgasim: 1,
  orgasims: 1,
  orgasm: 1,
  orgasms: 1,
  p0rn: 1,
  pawn: 1,
  pecker: 1,
  penis: 1,
  penisfucker: 1,
  phonesex: 1,
  phuck: 1,
  phuk: 1,
  phuked: 1,
  phuking: 1,
  phukked: 1,
  phukking: 1,
  phuks: 1,
  phuq: 1,
  pigfucker: 1,
  pimpis: 1,
  piss: 1,
  pissed: 1,
  pisser: 1,
  pissers: 1,
  pisses: 1,
  pissflaps: 1,
  pissin: 1,
  pissing: 1,
  pissoff: 1,
  poop: 1,
  porn: 1,
  porno: 1,
  pornography: 1,
  pornos: 1,
  prick: 1,
  pricks: 1,
  pron: 1,
  pube: 1,
  pusse: 1,
  pussi: 1,
  pussies: 1,
  pussy: 1,
  pussys: 1,
  rectum: 1,
  retard: 1,
  rimjaw: 1,
  rimming: 1,
  "s hit": 1,
  "s.o.b.": 1,
  sadist: 1,
  schlong: 1,
  screwing: 1,
  scroat: 1,
  scrote: 1,
  scrotum: 1,
  semen: 1,
  sex: 1,
  "sh!+": 1,
  "sh!t": 1,
  sh1t: 1,
  shag: 1,
  shagger: 1,
  shaggin: 1,
  shagging: 1,
  shemale: 1,
  "shi+": 1,
  shit: 1,
  shitdick: 1,
  shite: 1,
  shited: 1,
  shitey: 1,
  shitfuck: 1,
  shitfull: 1,
  shithead: 1,
  shiting: 1,
  shitings: 1,
  shits: 1,
  shitted: 1,
  shitter: 1,
  shitters: 1,
  shitting: 1,
  shittings: 1,
  shitty: 1,
  skank: 1,
  slut: 1,
  sluts: 1,
  smegma: 1,
  smut: 1,
  snatch: 1,
  "son-of-a-bitch": 1,
  spac: 1,
  spunk: 1,
  s_h_i_t: 1,
  t1tt1e5: 1,
  t1tties: 1,
  teets: 1,
  teez: 1,
  testical: 1,
  testicle: 1,
  tit: 1,
  titfuck: 1,
  tits: 1,
  titt: 1,
  tittie5: 1,
  tittiefucker: 1,
  titties: 1,
  tittyfuck: 1,
  tittywank: 1,
  titwank: 1,
  tosser: 1,
  turd: 1,
  tw4t: 1,
  twat: 1,
  twathead: 1,
  twatty: 1,
  twunt: 1,
  twunter: 1,
  v14gra: 1,
  v1gra: 1,
  vagina: 1,
  viagra: 1,
  vulva: 1,
  w00se: 1,
  wang: 1,
  wank: 1,
  wanker: 1,
  wanky: 1,
  whoar: 1,
  whore: 1,
  willies: 1,
  willy: 1,
  xrated: 1,
  xxx: 1
};
var Hh = /\b(4r5e|5h1t|5hit|a55|anal|anus|ar5e|arrse|arse|ass|ass-fucker|asses|assfucker|assfukka|asshole|assholes|asswhole|a_s_s|b!tch|b00bs|b17ch|b1tch|ballbag|balls|ballsack|bastard|beastial|beastiality|bellend|bestial|bestiality|bi\+ch|biatch|bitch|bitcher|bitchers|bitches|bitchin|bitching|bloody|blow job|blowjob|blowjobs|boiolas|bollock|bollok|boner|boob|boobs|booobs|boooobs|booooobs|booooooobs|breasts|buceta|bugger|bum|bunny fucker|butt|butthole|buttmuch|buttplug|c0ck|c0cksucker|carpet muncher|cawk|chink|cipa|cl1t|clit|clitoris|clits|cnut|cock|cock-sucker|cockface|cockhead|cockmunch|cockmuncher|cocks|cocksuck|cocksucked|cocksucker|cocksucking|cocksucks|cocksuka|cocksukka|cok|cokmuncher|coksucka|coon|cox|crap|cum|cummer|cumming|cums|cumshot|cunilingus|cunillingus|cunnilingus|cunt|cuntlick|cuntlicker|cuntlicking|cunts|cyalis|cyberfuc|cyberfuck|cyberfucked|cyberfucker|cyberfuckers|cyberfucking|d1ck|damn|dick|dickhead|dildo|dildos|dink|dinks|dirsa|dlck|dog-fucker|doggin|dogging|donkeyribber|doosh|duche|dyke|ejaculate|ejaculated|ejaculates|ejaculating|ejaculatings|ejaculation|ejakulate|f u c k|f u c k e r|f4nny|fag|fagging|faggitt|faggot|faggs|fagot|fagots|fags|fanny|fannyflaps|fannyfucker|fanyy|fatass|fcuk|fcuker|fcuking|feck|fecker|felching|fellate|fellatio|fingerfuck|fingerfucked|fingerfucker|fingerfuckers|fingerfucking|fingerfucks|fistfuck|fistfucked|fistfucker|fistfuckers|fistfucking|fistfuckings|fistfucks|flange|fook|fooker|fuck|fucka|fucked|fucker|fuckers|fuckhead|fuckheads|fuckin|fucking|fuckings|fuckingshitmotherfucker|fuckme|fucks|fuckwhit|fuckwit|fudge packer|fudgepacker|fuk|fuker|fukker|fukkin|fuks|fukwhit|fukwit|fux|fux0r|f_u_c_k|gangbang|gangbanged|gangbangs|gaylord|gaysex|goatse|God|god-dam|god-damned|goddamn|goddamned|hardcoresex|hell|heshe|hoar|hoare|hoer|homo|hore|horniest|horny|hotsex|jack-off|jackoff|jap|jerk-off|jism|jiz|jizm|jizz|kawk|knob|knobead|knobed|knobend|knobhead|knobjocky|knobjokey|kock|kondum|kondums|kum|kummer|kumming|kums|kunilingus|l3i\+ch|l3itch|labia|lust|lusting|m0f0|m0fo|m45terbate|ma5terb8|ma5terbate|masochist|master-bate|masterb8|masterbat*|masterbat3|masterbate|masterbation|masterbations|masturbate|mo-fo|mof0|mofo|mothafuck|mothafucka|mothafuckas|mothafuckaz|mothafucked|mothafucker|mothafuckers|mothafuckin|mothafucking|mothafuckings|mothafucks|mother fucker|motherfuck|motherfucked|motherfucker|motherfuckers|motherfuckin|motherfucking|motherfuckings|motherfuckka|motherfucks|muff|mutha|muthafecker|muthafuckker|muther|mutherfucker|n1gga|n1gger|nazi|nigg3r|nigg4h|nigga|niggah|niggas|niggaz|nigger|niggers|nob|nob jokey|nobhead|nobjocky|nobjokey|numbnuts|nutsack|orgasim|orgasims|orgasm|orgasms|p0rn|pawn|pecker|penis|penisfucker|phonesex|phuck|phuk|phuked|phuking|phukked|phukking|phuks|phuq|pigfucker|pimpis|piss|pissed|pisser|pissers|pisses|pissflaps|pissin|pissing|pissoff|poop|porn|porno|pornography|pornos|prick|pricks|pron|pube|pusse|pussi|pussies|pussy|pussys|rectum|retard|rimjaw|rimming|s hit|s.o.b.|sadist|schlong|screwing|scroat|scrote|scrotum|semen|sex|sh!\+|sh!t|sh1t|shag|shagger|shaggin|shagging|shemale|shi\+|shit|shitdick|shite|shited|shitey|shitfuck|shitfull|shithead|shiting|shitings|shits|shitted|shitter|shitters|shitting|shittings|shitty|skank|slut|sluts|smegma|smut|snatch|son-of-a-bitch|spac|spunk|s_h_i_t|t1tt1e5|t1tties|teets|teez|testical|testicle|tit|titfuck|tits|titt|tittie5|tittiefucker|titties|tittyfuck|tittywank|titwank|tosser|turd|tw4t|twat|twathead|twatty|twunt|twunter|v14gra|v1gra|vagina|viagra|vulva|w00se|wang|wank|wanker|wanky|whoar|whore|willies|willy|xrated|xxx)\b/gi;
var Lh = {
  object: zh,
  array: 0,
  regex: Hh
};
const Fh = _h.words;
const Vh = Lh.array;
class Nh {
  constructor(t = {}) {
    Object.assign(this, {
      list: t.emptyList && [] || Array.prototype.concat.apply(Fh, [Vh, t.list || []]),
      exclude: t.exclude || [],
      splitRegex: t.splitRegex || /\b/,
      placeHolder: t.placeHolder || "*",
      regex: t.regex || /[^a-zA-Z0-9|\$|\@]|\^/g,
      replaceRegex: t.replaceRegex || /\w/g
    });
  }
  isProfane(t) {
    return this.list.filter(i => {
      const n = new RegExp(`\\b${i.replace(/(\W)/g, "\\$1")}\\b`, "gi");
      return !this.exclude.includes(i.toLowerCase()) && n.test(t);
    }).length > 0 || false;
  }
  replaceWord(t) {
    return t.replace(this.regex, "").replace(this.replaceRegex, this.placeHolder);
  }
  clean(t) {
    return t.split(this.splitRegex).map(i => this.isProfane(i) ? this.replaceWord(i) : i).join(this.splitRegex.exec(t)[0]);
  }
  addWords() {
    let t = Array.from(arguments);
    this.list.push(...t);
    t.map(i => i.toLowerCase()).forEach(i => {
      if (this.exclude.includes(i)) {
        this.exclude.splice(this.exclude.indexOf(i), 1);
      }
    });
  }
  removeWords() {
    this.exclude.push(...Array.from(arguments).map(t => t.toLowerCase()));
  }
}
var Uh = Nh;
const Wh = An(Uh);
const Ko = new Wh();
const Xh = ["jew", "black", "baby", "child", "white", "porn", "pedo", "trump", "clinton", "hitler", "nazi", "gay", "pride", "sex", "pleasure", "touch", "poo", "kids", "rape", "white power", "nigga", "nig nog", "doggy", "rapist", "boner", "nigger", "nigg", "finger", "nogger", "nagger", "nig", "fag", "gai", "pole", "stripper", "penis", "vagina", "pussy", "nazi", "hitler", "stalin", "burn", "chamber", "cock", "peen", "dick", "spick", "nieger", "die", "satan", "n|ig", "nlg", "cunt", "c0ck", "fag", "lick", "condom", "anal", "shit", "phile", "little", "kids", "free KR", "tiny", "sidney", "ass", "kill", ".io", "(dot)", "[dot]", "mini", "whiore", "whore", "faggot", "github", "1337", "666", "satan", "senpa", "discord", "d1scord", "mistik", ".io", "senpa.io", "sidney", "sid", "senpaio", "vries", "asa"];
Ko.addWords(...Xh);
const Ir = Math.abs;
const Ut = Math.cos;
const Wt = Math.sin;
const Tr = Math.pow;
const qh = Math.sqrt;
function Gh(e, t, i, n, s, r, o, l, c, a, f, d, u, p) {
  this.id = e;
  this.sid = t;
  this.tmpScore = 0;
  this.team = null;
  this.skinIndex = 0;
  this.tailIndex = 0;
  this.hitTime = 0;
  this.tails = {};
  for (var w = 0; w < f.length; ++w) {
    if (f[w].price <= 0) {
      this.tails[f[w].id] = 1;
    }
  }
  this.skins = {};
  for (var w = 0; w < a.length; ++w) {
    if (a[w].price <= 0) {
      this.skins[a[w].id] = 1;
    }
  }
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
  this.spawn = function (v) {
    this.active = true;
    this.alive = true;
    this.lockMove = false;
    this.lockDir = false;
    this.minimapCounter = 0;
    this.chatCountdown = 0;
    this.shameCount = 0;
    this.shameTimer = 0;
    this.sentTo = {};
    this.gathering = 0;
    this.autoGather = 0;
    this.animTime = 0;
    this.animSpeed = 0;
    this.mouseState = 0;
    this.buildIndex = -1;
    this.weaponIndex = 0;
    this.dmgOverTime = {};
    this.noMovTimer = 0;
    this.maxXP = 300;
    this.XP = 0;
    this.age = 1;
    this.kills = 0;
    this.upgrAge = 2;
    this.upgradePoints = 0;
    this.x = 0;
    this.y = 0;
    this.zIndex = 0;
    this.xVel = 0;
    this.yVel = 0;
    this.slowMult = 1;
    this.dir = 0;
    this.dirPlus = 0;
    this.targetDir = 0;
    this.targetAngle = 0;
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.scale = i.playerScale;
    this.speed = i.playerSpeed;
    this.resetMoveDir();
    this.resetResources(v);
    this.items = [0, 3, 6, 10];
    this.weapons = [0];
    this.shootCount = 0;
    this.weaponXP = [];
    this.reloads = {};
    this.timeSpentNearVolcano = 0;
  };
  this.resetMoveDir = function () {
    this.moveDir = undefined;
  };
  this.resetResources = function (v) {
    for (let S = 0; S < i.resourceTypes.length; ++S) {
      this[i.resourceTypes[S]] = v ? 100 : 0;
    }
  };
  this.addItem = function (v) {
    const S = c.list[v];
    if (S) {
      for (let R = 0; R < this.items.length; ++R) {
        if (c.list[this.items[R]].group == S.group) {
          if (this.buildIndex == this.items[R]) {
            this.buildIndex = v;
          }
          this.items[R] = v;
          return true;
        }
      }
      this.items.push(v);
      return true;
    }
    return false;
  };
  this.setUserData = function (v) {
    if (v) {
      this.name = "unknown";
      let S = v.name + "";
      S = S.slice(0, i.maxNameLength);
      S = S.replace(/[^\w:\(\)\/? -]+/gmi, " ");
      S = S.replace(/[^\x00-\x7F]/g, " ");
      S = S.trim();
      let R = false;
      const G = S.toLowerCase().replace(/\s/g, "").replace(/1/g, "i").replace(/0/g, "o").replace(/5/g, "s");
      for (const X of Ko.list) {
        if (G.indexOf(X) != -1) {
          R = true;
          break;
        }
      }
      if (S.length > 0 && !R) {
        this.name = S;
      }
      this.skinColor = 0;
      if (i.skinColors[v.skin]) {
        this.skinColor = v.skin;
      }
    }
  };
  this.getData = function () {
    return [this.id, this.sid, this.name, n.fixTo(this.x, 2), n.fixTo(this.y, 2), n.fixTo(this.dir, 3), this.health, this.maxHealth, this.scale, this.skinColor];
  };
  this.setData = function (v) {
    this.id = v[0];
    this.sid = v[1];
    this.name = v[2];
    this.x = v[3];
    this.y = v[4];
    this.dir = v[5];
    this.health = v[6];
    this.maxHealth = v[7];
    this.scale = v[8];
    this.skinColor = v[9];
  };
  let x = 0;
  this.update = function (v) {
    if (!this.alive) {
      return;
    }
    if ((n.getDistance(this.x, this.y, i.volcanoLocationX, i.volcanoLocationY) || 0) < i.volcanoAggressionRadius) {
      this.timeSpentNearVolcano += v;
      if (this.timeSpentNearVolcano >= 1000) {
        this.changeHealth(i.volcanoDamagePerSecond, null);
        d.send(this.id, "8", Math.round(this.x), Math.round(this.y), i.volcanoDamagePerSecond, -1);
        this.timeSpentNearVolcano %= 1000;
      }
    }
    if (this.shameTimer > 0) {
      this.shameTimer -= v;
      if (this.shameTimer <= 0) {
        this.shameTimer = 0;
        this.shameCount = 0;
      }
    }
    x -= v;
    if (x <= 0) {
      const _ = (this.skin && this.skin.healthRegen ? this.skin.healthRegen : 0) + (this.tail && this.tail.healthRegen ? this.tail.healthRegen : 0);
      if (_) {
        this.changeHealth(_, this);
      }
      if (this.dmgOverTime.dmg) {
        this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer);
        this.dmgOverTime.time -= 1;
        if (this.dmgOverTime.time <= 0) {
          this.dmgOverTime.dmg = 0;
        }
      }
      if (this.healCol) {
        this.changeHealth(this.healCol, this);
      }
      x = 1000;
    }
    if (!this.alive) {
      return;
    }
    if (this.slowMult < 1) {
      this.slowMult += v * 0.0008;
      if (this.slowMult > 1) {
        this.slowMult = 1;
      }
    }
    this.noMovTimer += v;
    if (this.xVel || this.yVel) {
      this.noMovTimer = 0;
    }
    if (this.lockMove) {
      this.xVel = 0;
      this.yVel = 0;
    } else {
      let _ = (this.buildIndex >= 0 ? 0.5 : 1) * (c.weapons[this.weaponIndex].spdMult || 1) * (this.skin && this.skin.spdMult || 1) * (this.tail && this.tail.spdMult || 1) * (this.y <= i.snowBiomeTop ? this.skin && this.skin.coldM ? 1 : i.snowSpeed : 1) * this.slowMult;
      if (!this.zIndex && this.y >= i.mapScale / 2 - i.riverWidth / 2 && this.y <= i.mapScale / 2 + i.riverWidth / 2) {
        if (this.skin && this.skin.watrImm) {
          _ *= 0.75;
          this.xVel += i.waterCurrent * 0.4 * v;
        } else {
          _ *= 0.33;
          this.xVel += i.waterCurrent * v;
        }
      }
      let D = this.moveDir != null ? Ut(this.moveDir) : 0;
      let z = this.moveDir != null ? Wt(this.moveDir) : 0;
      const N = qh(D * D + z * z);
      if (N != 0) {
        D /= N;
        z /= N;
      }
      if (D) {
        this.xVel += D * this.speed * _ * v;
      }
      if (z) {
        this.yVel += z * this.speed * _ * v;
      }
    }
    this.zIndex = 0;
    this.lockMove = false;
    this.healCol = 0;
    let R;
    const G = n.getDistance(0, 0, this.xVel * v, this.yVel * v);
    const X = Math.min(4, Math.max(1, Math.round(G / 40)));
    const W = 1 / X;
    let M = {};
    for (var V = 0; V < X; ++V) {
      if (this.xVel) {
        this.x += this.xVel * v * W;
      }
      if (this.yVel) {
        this.y += this.yVel * v * W;
      }
      R = r.getGridArrays(this.x, this.y, this.scale);
      for (let _ = 0; _ < R.length; ++_) {
        for (let D = 0; D < R[_].length && !(R[_][D].active && !M[R[_][D].sid] && r.checkCollision(this, R[_][D], W) && (M[R[_][D].sid] = true, !this.alive)); ++D);
        if (!this.alive) {
          break;
        }
      }
      if (!this.alive) {
        break;
      }
    }
    for (var F = o.indexOf(this), V = F + 1; V < o.length; ++V) {
      if (o[V] != this && o[V].alive) {
        r.checkCollision(this, o[V]);
      }
    }
    if (this.xVel) {
      this.xVel *= Tr(i.playerDecel, v);
      if (this.xVel <= 0.01 && this.xVel >= -0.01) {
        this.xVel = 0;
      }
    }
    if (this.yVel) {
      this.yVel *= Tr(i.playerDecel, v);
      if (this.yVel <= 0.01 && this.yVel >= -0.01) {
        this.yVel = 0;
      }
    }
    if (this.x - this.scale < 0) {
      this.x = this.scale;
    } else if (this.x + this.scale > i.mapScale) {
      this.x = i.mapScale - this.scale;
    }
    if (this.y - this.scale < 0) {
      this.y = this.scale;
    } else if (this.y + this.scale > i.mapScale) {
      this.y = i.mapScale - this.scale;
    }
    if (this.buildIndex < 0) {
      if (this.reloads[this.weaponIndex] > 0) {
        this.reloads[this.weaponIndex] -= v;
        this.gathering = this.mouseState;
      } else if (this.gathering || this.autoGather) {
        let _ = true;
        if (c.weapons[this.weaponIndex].gather != null) {
          this.gather(o);
        } else if (c.weapons[this.weaponIndex].projectile != null && this.hasRes(c.weapons[this.weaponIndex], this.skin ? this.skin.projCost : 0)) {
          this.useRes(c.weapons[this.weaponIndex], this.skin ? this.skin.projCost : 0);
          this.noMovTimer = 0;
          var F = c.weapons[this.weaponIndex].projectile;
          const z = this.scale * 2;
          const N = this.skin && this.skin.aMlt ? this.skin.aMlt : 1;
          if (c.weapons[this.weaponIndex].rec) {
            this.xVel -= c.weapons[this.weaponIndex].rec * Ut(this.dir);
            this.yVel -= c.weapons[this.weaponIndex].rec * Wt(this.dir);
          }
          s.addProjectile(this.x + z * Ut(this.dir), this.y + z * Wt(this.dir), this.dir, c.projectiles[F].range * N, c.projectiles[F].speed * N, F, this, null, this.zIndex);
        } else {
          _ = false;
        }
        this.gathering = this.mouseState;
        if (_) {
          this.reloads[this.weaponIndex] = c.weapons[this.weaponIndex].speed * (this.skin && this.skin.atkSpd || 1);
        }
      }
    }
  };
  this.addWeaponXP = function (v) {
    if (!this.weaponXP[this.weaponIndex]) {
      this.weaponXP[this.weaponIndex] = 0;
    }
    this.weaponXP[this.weaponIndex] += v;
  };
  this.earnXP = function (v) {
    if (this.age < i.maxAge) {
      this.XP += v;
      if (this.XP >= this.maxXP) {
        if (this.age < i.maxAge) {
          this.age++;
          this.XP = 0;
          this.maxXP *= 1.2;
        } else {
          this.XP = this.maxXP;
        }
        this.upgradePoints++;
        d.send(this.id, "U", this.upgradePoints, this.upgrAge);
        d.send(this.id, "T", this.XP, n.fixTo(this.maxXP, 1), this.age);
      } else {
        d.send(this.id, "T", this.XP);
      }
    }
  };
  this.changeHealth = function (v, S) {
    if (v > 0 && this.health >= this.maxHealth) {
      return false;
    }
    if (v < 0 && this.skin) {
      v *= this.skin.dmgMult || 1;
    }
    if (v < 0 && this.tail) {
      v *= this.tail.dmgMult || 1;
    }
    if (v < 0) {
      this.hitTime = Date.now();
    }
    this.health += v;
    if (this.health > this.maxHealth) {
      v -= this.health - this.maxHealth;
      this.health = this.maxHealth;
    }
    if (this.health <= 0) {
      this.kill(S);
    }
    for (let R = 0; R < o.length; ++R) {
      if (this.sentTo[o[R].id]) {
        d.send(o[R].id, "O", this.sid, this.health);
      }
    }
    if (S && S.canSee(this) && !(S == this && v < 0)) {
      d.send(S.id, "8", Math.round(this.x), Math.round(this.y), Math.round(-v), 1);
    }
    return true;
  };
  this.kill = function (v) {
    if (v && v.alive) {
      v.kills++;
      if (v.skin && v.skin.goldSteal) {
        u(v, Math.round(this.points / 2));
      } else {
        u(v, Math.round(this.age * 100 * (v.skin && v.skin.kScrM ? v.skin.kScrM : 1)));
      }
      d.send(v.id, "N", "kills", v.kills, 1);
    }
    this.alive = false;
    d.send(this.id, "P");
    p();
  };
  this.addResource = function (v, S, R) {
    if (!R && S > 0) {
      this.addWeaponXP(S);
    }
    if (v == 3) {
      u(this, S, true);
    } else {
      this[i.resourceTypes[v]] += S;
      d.send(this.id, "N", i.resourceTypes[v], this[i.resourceTypes[v]], 1);
    }
  };
  this.changeItemCount = function (v, S) {
    this.itemCounts[v] = this.itemCounts[v] || 0;
    this.itemCounts[v] += S;
    d.send(this.id, "S", v, this.itemCounts[v]);
  };
  this.buildItem = function (v) {
    const S = this.scale + v.scale + (v.placeOffset || 0);
    const R = this.x + S * Ut(this.dir);
    const G = this.y + S * Wt(this.dir);
    if (this.canBuild(v) && !(v.consume && this.skin && this.skin.noEat) && (v.consume || r.checkItemLocation(R, G, v.scale, 0.6, v.id, false, this))) {
      let X = false;
      if (v.consume) {
        if (this.hitTime) {
          const W = Date.now() - this.hitTime;
          this.hitTime = 0;
          if (W <= 120) {
            this.shameCount++;
            if (this.shameCount >= 8) {
              this.shameTimer = 30000;
              this.shameCount = 0;
            }
          } else {
            this.shameCount -= 2;
            if (this.shameCount <= 0) {
              this.shameCount = 0;
            }
          }
        }
        if (this.shameTimer <= 0) {
          X = v.consume(this);
        }
      } else {
        X = true;
        if (v.group.limit) {
          this.changeItemCount(v.group.id, 1);
        }
        if (v.pps) {
          this.pps += v.pps;
        }
        r.add(r.objects.length, R, G, this.dir, v.scale, v.type, v, false, this);
      }
      if (X) {
        this.useRes(v);
        this.buildIndex = -1;
      }
    }
  };
  this.hasRes = function (v, S) {
    for (let R = 0; R < v.req.length;) {
      if (this[v.req[R]] < Math.round(v.req[R + 1] * (S || 1))) {
        return false;
      }
      R += 2;
    }
    return true;
  };
  this.useRes = function (v, S) {
    if (!i.inSandbox) {
      for (let R = 0; R < v.req.length;) {
        this.addResource(i.resourceTypes.indexOf(v.req[R]), -Math.round(v.req[R + 1] * (S || 1)));
        R += 2;
      }
    }
  };
  this.canBuild = function (v) {
    const S = i.inSandbox ? v.group.sandboxLimit || Math.max(v.group.limit * 3, 99) : v.group.limit;
    if (S && this.itemCounts[v.group.id] >= S) {
      return false;
    } else if (i.inSandbox) {
      return true;
    } else {
      return this.hasRes(v);
    }
  };
  this.gather = function () {
    this.noMovTimer = 0;
    this.slowMult -= c.weapons[this.weaponIndex].hitSlow || 0.3;
    if (this.slowMult < 0) {
      this.slowMult = 0;
    }
    const v = i.fetchVariant(this);
    const S = v.poison;
    const R = v.val;
    const G = {};
    let X;
    let W;
    let M;
    let V;
    const F = r.getGridArrays(this.x, this.y, c.weapons[this.weaponIndex].range);
    for (let D = 0; D < F.length; ++D) {
      for (var _ = 0; _ < F[D].length; ++_) {
        M = F[D][_];
        if (M.active && !M.dontGather && !G[M.sid] && M.visibleToPlayer(this) && (X = n.getDistance(this.x, this.y, M.x, M.y) - M.scale, X <= c.weapons[this.weaponIndex].range && (W = n.getDirection(M.x, M.y, this.x, this.y), n.getAngleDist(W, this.dir) <= i.gatherAngle))) {
          G[M.sid] = 1;
          if (M.health) {
            if (M.changeHealth(-c.weapons[this.weaponIndex].dmg * R * (c.weapons[this.weaponIndex].sDmg || 1) * (this.skin && this.skin.bDmg ? this.skin.bDmg : 1), this)) {
              for (let z = 0; z < M.req.length;) {
                this.addResource(i.resourceTypes.indexOf(M.req[z]), M.req[z + 1]);
                z += 2;
              }
              r.disableObj(M);
            }
          } else {
            if (M.name === "volcano") {
              this.hitVolcano(c.weapons[this.weaponIndex].gather);
            } else {
              this.earnXP(c.weapons[this.weaponIndex].gather * 4);
              const z = c.weapons[this.weaponIndex].gather + (M.type == 3 ? 4 : 0);
              this.addResource(M.type, z);
            }
            if (this.skin && this.skin.extraGold) {
              this.addResource(3, 1);
            }
          }
          V = true;
          r.hitObj(M, W);
        }
      }
    }
    for (var _ = 0; _ < o.length + l.length; ++_) {
      M = o[_] || l[_ - o.length];
      if (M != this && M.alive && !(M.team && M.team == this.team) && (X = n.getDistance(this.x, this.y, M.x, M.y) - M.scale * 1.8, X <= c.weapons[this.weaponIndex].range && (W = n.getDirection(M.x, M.y, this.x, this.y), n.getAngleDist(W, this.dir) <= i.gatherAngle))) {
        let z = c.weapons[this.weaponIndex].steal;
        if (z && M.addResource) {
          z = Math.min(M.points || 0, z);
          this.addResource(3, z);
          M.addResource(3, -z);
        }
        let N = R;
        if (M.weaponIndex != null && c.weapons[M.weaponIndex].shield && n.getAngleDist(W + Math.PI, M.dir) <= i.shieldAngle) {
          N = c.weapons[M.weaponIndex].shield;
        }
        const Y = c.weapons[this.weaponIndex].dmg;
        const K = Y * (this.skin && this.skin.dmgMultO ? this.skin.dmgMultO : 1) * (this.tail && this.tail.dmgMultO ? this.tail.dmgMultO : 1);
        const ie = (M.weightM || 1) * 0.3 + (c.weapons[this.weaponIndex].knock || 0);
        M.xVel += ie * Ut(W);
        M.yVel += ie * Wt(W);
        if (this.skin && this.skin.healD) {
          this.changeHealth(K * N * this.skin.healD, this);
        }
        if (this.tail && this.tail.healD) {
          this.changeHealth(K * N * this.tail.healD, this);
        }
        if (M.skin && M.skin.dmg) {
          this.changeHealth(-Y * M.skin.dmg, M);
        }
        if (M.tail && M.tail.dmg) {
          this.changeHealth(-Y * M.tail.dmg, M);
        }
        if (M.dmgOverTime && this.skin && this.skin.poisonDmg && !(M.skin && M.skin.poisonRes)) {
          M.dmgOverTime.dmg = this.skin.poisonDmg;
          M.dmgOverTime.time = this.skin.poisonTime || 1;
          M.dmgOverTime.doer = this;
        }
        if (M.dmgOverTime && S && !(M.skin && M.skin.poisonRes)) {
          M.dmgOverTime.dmg = 5;
          M.dmgOverTime.time = 5;
          M.dmgOverTime.doer = this;
        }
        if (M.skin && M.skin.dmgK) {
          this.xVel -= M.skin.dmgK * Ut(W);
          this.yVel -= M.skin.dmgK * Wt(W);
        }
        M.changeHealth(-K * N, this, this);
      }
    }
    this.sendAnimation(V ? 1 : 0);
  };
  this.hitVolcano = function (v) {
    const S = 5 + Math.round(v / 3.5);
    this.addResource(2, S);
    this.addResource(3, S);
  };
  this.sendAnimation = function (v) {
    for (let S = 0; S < o.length; ++S) {
      if (this.sentTo[o[S].id] && this.canSee(o[S])) {
        d.send(o[S].id, "K", this.sid, v ? 1 : 0, this.weaponIndex);
      }
    }
  };
  let b = 0;
  let $ = 0;
  this.animate = function (v) {
    if (this.animTime > 0) {
      this.animTime -= v;
      if (this.animTime <= 0) {
        this.animTime = 0;
        this.dirPlus = 0;
        b = 0;
        $ = 0;
      } else if ($ == 0) {
        b += v / (this.animSpeed * i.hitReturnRatio);
        this.dirPlus = n.lerp(0, this.targetAngle, Math.min(1, b));
        if (b >= 1) {
          b = 1;
          $ = 1;
        }
      } else {
        b -= v / (this.animSpeed * (1 - i.hitReturnRatio));
        this.dirPlus = n.lerp(0, this.targetAngle, Math.max(0, b));
      }
    }
  };
  this.startAnim = function (v, S) {
    this.animTime = this.animSpeed = c.weapons[S].speed;
    this.targetAngle = v ? -i.hitAngle : -Math.PI;
    b = 0;
    $ = 0;
  };
  this.canSee = function (v) {
    if (!v || v.skin && v.skin.invisTimer && v.noMovTimer >= v.skin.invisTimer) {
      return false;
    }
    const S = Ir(v.x - this.x) - v.scale;
    const R = Ir(v.y - this.y) - v.scale;
    return S <= i.maxScreenWidth / 2 * 1.3 && R <= i.maxScreenHeight / 2 * 1.3;
  };
}
const Yh = [{
  id: 45,
  name: "Shame!",
  dontSell: true,
  price: 0,
  scale: 120,
  desc: "hacks are for losers"
}, {
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
  price: 1000,
  scale: 120,
  desc: "no effect"
}, {
  id: 4,
  name: "Ranger Hat",
  price: 2000,
  scale: 120,
  desc: "no effect"
}, {
  id: 18,
  name: "Explorer Hat",
  price: 2000,
  scale: 120,
  desc: "no effect"
}, {
  id: 31,
  name: "Flipper Hat",
  price: 2500,
  scale: 120,
  desc: "have more control while in water",
  watrImm: true
}, {
  id: 1,
  name: "Marksman Cap",
  price: 3000,
  scale: 120,
  desc: "increases arrow speed and range",
  aMlt: 1.3
}, {
  id: 10,
  name: "Bush Gear",
  price: 3000,
  scale: 160,
  desc: "allows you to disguise yourself as a bush"
}, {
  id: 48,
  name: "Halo",
  price: 3000,
  scale: 120,
  desc: "no effect"
}, {
  id: 6,
  name: "Soldier Helmet",
  price: 4000,
  scale: 120,
  desc: "reduces damage taken but slows movement",
  spdMult: 0.94,
  dmgMult: 0.75
}, {
  id: 23,
  name: "Anti Venom Gear",
  price: 4000,
  scale: 120,
  desc: "makes you immune to poison",
  poisonRes: 1
}, {
  id: 13,
  name: "Medic Gear",
  price: 5000,
  scale: 110,
  desc: "slowly regenerates health over time",
  healthRegen: 3
}, {
  id: 9,
  name: "Miners Helmet",
  price: 5000,
  scale: 120,
  desc: "earn 1 extra gold per resource",
  extraGold: 1
}, {
  id: 32,
  name: "Musketeer Hat",
  price: 5000,
  scale: 120,
  desc: "reduces cost of projectiles",
  projCost: 0.5
}, {
  id: 7,
  name: "Bull Helmet",
  price: 6000,
  scale: 120,
  desc: "increases damage done but drains health",
  healthRegen: -5,
  dmgMultO: 1.5,
  spdMult: 0.96
}, {
  id: 22,
  name: "Emp Helmet",
  price: 6000,
  scale: 120,
  desc: "turrets won't attack but you move slower",
  antiTurret: 1,
  spdMult: 0.7
}, {
  id: 12,
  name: "Booster Hat",
  price: 6000,
  scale: 120,
  desc: "increases your movement speed",
  spdMult: 1.16
}, {
  id: 26,
  name: "Barbarian Armor",
  price: 8000,
  scale: 120,
  desc: "knocks back enemies that attack you",
  dmgK: 0.6
}, {
  id: 21,
  name: "Plague Mask",
  price: 10000,
  scale: 120,
  desc: "melee attacks deal poison damage",
  poisonDmg: 5,
  poisonTime: 6
}, {
  id: 46,
  name: "Bull Mask",
  price: 10000,
  scale: 120,
  desc: "bulls won't target you unless you attack them",
  bullRepel: 1
}, {
  id: 14,
  name: "Windmill Hat",
  topSprite: true,
  price: 10000,
  scale: 120,
  desc: "generates points while worn",
  pps: 1.5
}, {
  id: 11,
  name: "Spike Gear",
  topSprite: true,
  price: 10000,
  scale: 120,
  desc: "deal damage to players that damage you",
  dmg: 0.45
}, {
  id: 53,
  name: "Turret Gear",
  topSprite: true,
  price: 10000,
  scale: 120,
  desc: "you become a walking turret",
  turret: {
    proj: 1,
    range: 700,
    rate: 2500
  },
  spdMult: 0.7
}, {
  id: 20,
  name: "Samurai Armor",
  price: 12000,
  scale: 120,
  desc: "increased attack speed and fire rate",
  atkSpd: 0.78
}, {
  id: 58,
  name: "Dark Knight",
  price: 12000,
  scale: 120,
  desc: "restores health when you deal damage",
  healD: 0.4
}, {
  id: 27,
  name: "Scavenger Gear",
  price: 15000,
  scale: 120,
  desc: "earn double points for each kill",
  kScrM: 2
}, {
  id: 40,
  name: "Tank Gear",
  price: 15000,
  scale: 120,
  desc: "increased damage to buildings but slower movement",
  spdMult: 0.3,
  bDmg: 3.3
}, {
  id: 52,
  name: "Thief Gear",
  price: 15000,
  scale: 120,
  desc: "steal half of a players gold when you kill them",
  goldSteal: 0.5
}, {
  id: 55,
  name: "Bloodthirster",
  price: 20000,
  scale: 120,
  desc: "Restore Health when dealing damage. And increased damage",
  healD: 0.25,
  dmgMultO: 1.2
}, {
  id: 56,
  name: "Assassin Gear",
  price: 20000,
  scale: 120,
  desc: "Go invisible when not moving. Can't eat. Increased speed",
  noEat: true,
  spdMult: 1.1,
  invisTimer: 1000
}];
const Kh = [{
  id: 12,
  name: "Snowball",
  price: 1000,
  scale: 105,
  xOff: 18,
  desc: "no effect"
}, {
  id: 9,
  name: "Tree Cape",
  price: 1000,
  scale: 90,
  desc: "no effect"
}, {
  id: 10,
  name: "Stone Cape",
  price: 1000,
  scale: 90,
  desc: "no effect"
}, {
  id: 3,
  name: "Cookie Cape",
  price: 1500,
  scale: 90,
  desc: "no effect"
}, {
  id: 8,
  name: "Cow Cape",
  price: 2000,
  scale: 90,
  desc: "no effect"
}, {
  id: 11,
  name: "Monkey Tail",
  price: 2000,
  scale: 97,
  xOff: 25,
  desc: "Super speed but reduced damage",
  spdMult: 1.35,
  dmgMultO: 0.2
}, {
  id: 17,
  name: "Apple Basket",
  price: 3000,
  scale: 80,
  xOff: 12,
  desc: "slowly regenerates health over time",
  healthRegen: 1
}, {
  id: 6,
  name: "Winter Cape",
  price: 3000,
  scale: 90,
  desc: "no effect"
}, {
  id: 4,
  name: "Skull Cape",
  price: 4000,
  scale: 90,
  desc: "no effect"
}, {
  id: 5,
  name: "Dash Cape",
  price: 5000,
  scale: 90,
  desc: "no effect"
}, {
  id: 2,
  name: "Dragon Cape",
  price: 6000,
  scale: 90,
  desc: "no effect"
}, {
  id: 1,
  name: "Super Cape",
  price: 8000,
  scale: 90,
  desc: "no effect"
}, {
  id: 7,
  name: "Troll Cape",
  price: 8000,
  scale: 90,
  desc: "no effect"
}, {
  id: 14,
  name: "Thorns",
  price: 10000,
  scale: 115,
  xOff: 20,
  desc: "no effect"
}, {
  id: 15,
  name: "Blockades",
  price: 10000,
  scale: 95,
  xOff: 15,
  desc: "no effect"
}, {
  id: 20,
  name: "Devils Tail",
  price: 10000,
  scale: 95,
  xOff: 20,
  desc: "no effect"
}, {
  id: 16,
  name: "Sawblade",
  price: 12000,
  scale: 90,
  spin: true,
  xOff: 0,
  desc: "deal damage to players that damage you",
  dmg: 0.15
}, {
  id: 13,
  name: "Angel Wings",
  price: 15000,
  scale: 138,
  xOff: 22,
  desc: "slowly regenerates health over time",
  healthRegen: 3
}, {
  id: 19,
  name: "Shadow Wings",
  price: 15000,
  scale: 138,
  xOff: 22,
  desc: "increased movement speed",
  spdMult: 1.1
}, {
  id: 18,
  name: "Blood Wings",
  price: 20000,
  scale: 178,
  xOff: 26,
  desc: "restores health when you deal damage",
  healD: 0.2
}, {
  id: 21,
  name: "Corrupt X Wings",
  price: 20000,
  scale: 178,
  xOff: 26,
  desc: "deal damage to players that damage you",
  dmg: 0.25
}];
const Zo = {
  hats: Yh,
  accessories: Kh
};
function Zh(e, t, i, n, s, r, o) {
  this.init = function (a, f, d, u, p, w, x, b, $) {
    this.active = true;
    this.indx = a;
    this.x = f;
    this.y = d;
    this.dir = u;
    this.skipMov = true;
    this.speed = p;
    this.dmg = w;
    this.scale = b;
    this.range = x;
    this.owner = $;
    if (o) {
      this.sentTo = {};
    }
  };
  const l = [];
  let c;
  this.update = function (a) {
    if (this.active) {
      let d = this.speed * a;
      let u;
      if (this.skipMov) {
        this.skipMov = false;
      } else {
        this.x += d * Math.cos(this.dir);
        this.y += d * Math.sin(this.dir);
        this.range -= d;
        if (this.range <= 0) {
          this.x += this.range * Math.cos(this.dir);
          this.y += this.range * Math.sin(this.dir);
          d = 1;
          this.range = 0;
          this.active = false;
        }
      }
      if (o) {
        for (var f = 0; f < e.length; ++f) {
          if (!this.sentTo[e[f].id] && e[f].canSee(this)) {
            this.sentTo[e[f].id] = 1;
            o.send(e[f].id, "X", r.fixTo(this.x, 1), r.fixTo(this.y, 1), r.fixTo(this.dir, 2), r.fixTo(this.range, 1), this.speed, this.indx, this.layer, this.sid);
          }
        }
        l.length = 0;
        for (var f = 0; f < e.length + t.length; ++f) {
          c = e[f] || t[f - e.length];
          if (c.alive && c != this.owner && !(this.owner.team && c.team == this.owner.team) && r.lineInRect(c.x - c.scale, c.y - c.scale, c.x + c.scale, c.y + c.scale, this.x, this.y, this.x + d * Math.cos(this.dir), this.y + d * Math.sin(this.dir))) {
            l.push(c);
          }
        }
        const p = i.getGridArrays(this.x, this.y, this.scale);
        for (let w = 0; w < p.length; ++w) {
          for (let x = 0; x < p[w].length; ++x) {
            c = p[w][x];
            u = c.getScale();
            if (c.active && this.ignoreObj != c.sid && this.layer <= c.layer && l.indexOf(c) < 0 && !c.ignoreCollision && r.lineInRect(c.x - u, c.y - u, c.x + u, c.y + u, this.x, this.y, this.x + d * Math.cos(this.dir), this.y + d * Math.sin(this.dir))) {
              l.push(c);
            }
          }
        }
        if (l.length > 0) {
          let w = null;
          let x = null;
          let b = null;
          for (var f = 0; f < l.length; ++f) {
            b = r.getDistance(this.x, this.y, l[f].x, l[f].y);
            if (x == null || b < x) {
              x = b;
              w = l[f];
            }
          }
          if (w.isPlayer || w.isAI) {
            const $ = (w.weightM || 1) * 0.3;
            w.xVel += $ * Math.cos(this.dir);
            w.yVel += $ * Math.sin(this.dir);
            if (w.weaponIndex == null || !(n.weapons[w.weaponIndex].shield && r.getAngleDist(this.dir + Math.PI, w.dir) <= s.shieldAngle)) {
              w.changeHealth(-this.dmg, this.owner, this.owner);
            }
          } else {
            if (w.projDmg && w.health && w.changeHealth(-this.dmg)) {
              i.disableObj(w);
            }
            for (var f = 0; f < e.length; ++f) {
              if (e[f].active) {
                if (w.sentTo[e[f].id]) {
                  if (w.active) {
                    if (e[f].canSee(w)) {
                      o.send(e[f].id, "L", r.fixTo(this.dir, 2), w.sid);
                    }
                  } else {
                    o.send(e[f].id, "Q", w.sid);
                  }
                }
                if (!w.active && w.owner == e[f]) {
                  e[f].changeItemCount(w.group.id, -1);
                }
              }
            }
          }
          this.active = false;
          for (var f = 0; f < e.length; ++f) {
            if (this.sentTo[e[f].id]) {
              o.send(e[f].id, "Y", this.sid, r.fixTo(x, 1));
            }
          }
        }
      }
    }
  };
}
var Jo = {
  exports: {}
};
var Qo = {
  exports: {}
};
(function () {
  var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var t = {
    rotl: function (i, n) {
      return i << n | i >>> 32 - n;
    },
    rotr: function (i, n) {
      return i << 32 - n | i >>> n;
    },
    endian: function (i) {
      if (i.constructor == Number) {
        return t.rotl(i, 8) & 16711935 | t.rotl(i, 24) & 4278255360;
      }
      for (var n = 0; n < i.length; n++) {
        i[n] = t.endian(i[n]);
      }
      return i;
    },
    randomBytes: function (i) {
      for (var n = []; i > 0; i--) {
        n.push(Math.floor(Math.random() * 256));
      }
      return n;
    },
    bytesToWords: function (i) {
      for (var n = [], s = 0, r = 0; s < i.length; s++, r += 8) {
        n[r >>> 5] |= i[s] << 24 - r % 32;
      }
      return n;
    },
    wordsToBytes: function (i) {
      for (var n = [], s = 0; s < i.length * 32; s += 8) {
        n.push(i[s >>> 5] >>> 24 - s % 32 & 255);
      }
      return n;
    },
    bytesToHex: function (i) {
      for (var n = [], s = 0; s < i.length; s++) {
        n.push((i[s] >>> 4).toString(16));
        n.push((i[s] & 15).toString(16));
      }
      return n.join("");
    },
    hexToBytes: function (i) {
      for (var n = [], s = 0; s < i.length; s += 2) {
        n.push(parseInt(i.substr(s, 2), 16));
      }
      return n;
    },
    bytesToBase64: function (i) {
      for (var n = [], s = 0; s < i.length; s += 3) {
        for (var r = i[s] << 16 | i[s + 1] << 8 | i[s + 2], o = 0; o < 4; o++) {
          if (s * 8 + o * 6 <= i.length * 8) {
            n.push(e.charAt(r >>> (3 - o) * 6 & 63));
          } else {
            n.push("=");
          }
        }
      }
      return n.join("");
    },
    base64ToBytes: function (i) {
      i = i.replace(/[^A-Z0-9+\/]/ig, "");
      for (var n = [], s = 0, r = 0; s < i.length; r = ++s % 4) {
        if (r != 0) {
          n.push((e.indexOf(i.charAt(s - 1)) & Math.pow(2, r * -2 + 8) - 1) << r * 2 | e.indexOf(i.charAt(s)) >>> 6 - r * 2);
        }
      }
      return n;
    }
  };
  Qo.exports = t;
})();
var Jh = Qo.exports;
var Es = {
  utf8: {
    stringToBytes: function (e) {
      return Es.bin.stringToBytes(unescape(encodeURIComponent(e)));
    },
    bytesToString: function (e) {
      return decodeURIComponent(escape(Es.bin.bytesToString(e)));
    }
  },
  bin: {
    stringToBytes: function (e) {
      for (var t = [], i = 0; i < e.length; i++) {
        t.push(e.charCodeAt(i) & 255);
      }
      return t;
    },
    bytesToString: function (e) {
      for (var t = [], i = 0; i < e.length; i++) {
        t.push(String.fromCharCode(e[i]));
      }
      return t.join("");
    }
  }
};
var Mr = Es;
/*!
* Determine if an object is a Buffer
*
* @author   Feross Aboukhadijeh <https://feross.org>
* @license  MIT
*/
function Qh(e) {
  return e != null && (jo(e) || jh(e) || !!e._isBuffer);
}
function jo(e) {
  return !!e.constructor && typeof e.constructor.isBuffer == "function" && e.constructor.isBuffer(e);
}
function jh(e) {
  return typeof e.readFloatLE == "function" && typeof e.slice == "function" && jo(e.slice(0, 0));
}
(function () {
  var e = Jh;
  var t = Mr.utf8;
  var i = Qh;
  var n = Mr.bin;
  function s(r, o) {
    if (r.constructor == String) {
      if (o && o.encoding === "binary") {
        r = n.stringToBytes(r);
      } else {
        r = t.stringToBytes(r);
      }
    } else if (i(r)) {
      r = Array.prototype.slice.call(r, 0);
    } else if (!Array.isArray(r) && r.constructor !== Uint8Array) {
      r = r.toString();
    }
    for (var l = e.bytesToWords(r), c = r.length * 8, a = 1732584193, f = -271733879, d = -1732584194, u = 271733878, p = 0; p < l.length; p++) {
      l[p] = (l[p] << 8 | l[p] >>> 24) & 16711935 | (l[p] << 24 | l[p] >>> 8) & 4278255360;
    }
    l[c >>> 5] |= 128 << c % 32;
    l[(c + 64 >>> 9 << 4) + 14] = c;
    for (var w = s._ff, x = s._gg, b = s._hh, $ = s._ii, p = 0; p < l.length; p += 16) {
      var v = a;
      var S = f;
      var R = d;
      var G = u;
      a = w(a, f, d, u, l[p + 0], 7, -680876936);
      u = w(u, a, f, d, l[p + 1], 12, -389564586);
      d = w(d, u, a, f, l[p + 2], 17, 606105819);
      f = w(f, d, u, a, l[p + 3], 22, -1044525330);
      a = w(a, f, d, u, l[p + 4], 7, -176418897);
      u = w(u, a, f, d, l[p + 5], 12, 1200080426);
      d = w(d, u, a, f, l[p + 6], 17, -1473231341);
      f = w(f, d, u, a, l[p + 7], 22, -45705983);
      a = w(a, f, d, u, l[p + 8], 7, 1770035416);
      u = w(u, a, f, d, l[p + 9], 12, -1958414417);
      d = w(d, u, a, f, l[p + 10], 17, -42063);
      f = w(f, d, u, a, l[p + 11], 22, -1990404162);
      a = w(a, f, d, u, l[p + 12], 7, 1804603682);
      u = w(u, a, f, d, l[p + 13], 12, -40341101);
      d = w(d, u, a, f, l[p + 14], 17, -1502002290);
      f = w(f, d, u, a, l[p + 15], 22, 1236535329);
      a = x(a, f, d, u, l[p + 1], 5, -165796510);
      u = x(u, a, f, d, l[p + 6], 9, -1069501632);
      d = x(d, u, a, f, l[p + 11], 14, 643717713);
      f = x(f, d, u, a, l[p + 0], 20, -373897302);
      a = x(a, f, d, u, l[p + 5], 5, -701558691);
      u = x(u, a, f, d, l[p + 10], 9, 38016083);
      d = x(d, u, a, f, l[p + 15], 14, -660478335);
      f = x(f, d, u, a, l[p + 4], 20, -405537848);
      a = x(a, f, d, u, l[p + 9], 5, 568446438);
      u = x(u, a, f, d, l[p + 14], 9, -1019803690);
      d = x(d, u, a, f, l[p + 3], 14, -187363961);
      f = x(f, d, u, a, l[p + 8], 20, 1163531501);
      a = x(a, f, d, u, l[p + 13], 5, -1444681467);
      u = x(u, a, f, d, l[p + 2], 9, -51403784);
      d = x(d, u, a, f, l[p + 7], 14, 1735328473);
      f = x(f, d, u, a, l[p + 12], 20, -1926607734);
      a = b(a, f, d, u, l[p + 5], 4, -378558);
      u = b(u, a, f, d, l[p + 8], 11, -2022574463);
      d = b(d, u, a, f, l[p + 11], 16, 1839030562);
      f = b(f, d, u, a, l[p + 14], 23, -35309556);
      a = b(a, f, d, u, l[p + 1], 4, -1530992060);
      u = b(u, a, f, d, l[p + 4], 11, 1272893353);
      d = b(d, u, a, f, l[p + 7], 16, -155497632);
      f = b(f, d, u, a, l[p + 10], 23, -1094730640);
      a = b(a, f, d, u, l[p + 13], 4, 681279174);
      u = b(u, a, f, d, l[p + 0], 11, -358537222);
      d = b(d, u, a, f, l[p + 3], 16, -722521979);
      f = b(f, d, u, a, l[p + 6], 23, 76029189);
      a = b(a, f, d, u, l[p + 9], 4, -640364487);
      u = b(u, a, f, d, l[p + 12], 11, -421815835);
      d = b(d, u, a, f, l[p + 15], 16, 530742520);
      f = b(f, d, u, a, l[p + 2], 23, -995338651);
      a = $(a, f, d, u, l[p + 0], 6, -198630844);
      u = $(u, a, f, d, l[p + 7], 10, 1126891415);
      d = $(d, u, a, f, l[p + 14], 15, -1416354905);
      f = $(f, d, u, a, l[p + 5], 21, -57434055);
      a = $(a, f, d, u, l[p + 12], 6, 1700485571);
      u = $(u, a, f, d, l[p + 3], 10, -1894986606);
      d = $(d, u, a, f, l[p + 10], 15, -1051523);
      f = $(f, d, u, a, l[p + 1], 21, -2054922799);
      a = $(a, f, d, u, l[p + 8], 6, 1873313359);
      u = $(u, a, f, d, l[p + 15], 10, -30611744);
      d = $(d, u, a, f, l[p + 6], 15, -1560198380);
      f = $(f, d, u, a, l[p + 13], 21, 1309151649);
      a = $(a, f, d, u, l[p + 4], 6, -145523070);
      u = $(u, a, f, d, l[p + 11], 10, -1120210379);
      d = $(d, u, a, f, l[p + 2], 15, 718787259);
      f = $(f, d, u, a, l[p + 9], 21, -343485551);
      a = a + v >>> 0;
      f = f + S >>> 0;
      d = d + R >>> 0;
      u = u + G >>> 0;
    }
    return e.endian([a, f, d, u]);
  }
  s._ff = function (r, o, l, c, a, f, d) {
    var u = r + (o & l | ~o & c) + (a >>> 0) + d;
    return (u << f | u >>> 32 - f) + o;
  };
  s._gg = function (r, o, l, c, a, f, d) {
    var u = r + (o & c | l & ~c) + (a >>> 0) + d;
    return (u << f | u >>> 32 - f) + o;
  };
  s._hh = function (r, o, l, c, a, f, d) {
    var u = r + (o ^ l ^ c) + (a >>> 0) + d;
    return (u << f | u >>> 32 - f) + o;
  };
  s._ii = function (r, o, l, c, a, f, d) {
    var u = r + (l ^ (o | ~c)) + (a >>> 0) + d;
    return (u << f | u >>> 32 - f) + o;
  };
  s._blocksize = 16;
  s._digestsize = 16;
  Jo.exports = function (r, o) {
    if (r == null) {
      throw new Error("Illegal argument " + r);
    }
    var l = e.wordsToBytes(s(r, o));
    if (o && o.asBytes) {
      return l;
    } else if (o && o.asString) {
      return n.bytesToString(l);
    } else {
      return e.bytesToHex(l);
    }
  };
})();
var eu = Jo.exports;
const tu = An(eu);
var Yn;
var Er;
function It() {
  if (Er) {
    return Yn;
  }
  Er = 1;
  function e(t, i, n, s, r, o) {
    return {
      tag: t,
      key: i,
      attrs: n,
      children: s,
      text: r,
      dom: o,
      domSize: undefined,
      state: undefined,
      events: undefined,
      instance: undefined
    };
  }
  e.normalize = function (t) {
    if (Array.isArray(t)) {
      return e("[", undefined, undefined, e.normalizeChildren(t), undefined, undefined);
    } else if (t == null || typeof t == "boolean") {
      return null;
    } else if (typeof t == "object") {
      return t;
    } else {
      return e("#", undefined, undefined, String(t), undefined, undefined);
    }
  };
  e.normalizeChildren = function (t) {
    var i = [];
    if (t.length) {
      for (var n = t[0] != null && t[0].key != null, s = 1; s < t.length; s++) {
        if ((t[s] != null && t[s].key != null) !== n) {
          throw new TypeError(n && (t[s] != null || typeof t[s] == "boolean") ? "In fragments, vnodes must either all have keys or none have keys. You may wish to consider using an explicit keyed empty fragment, m.fragment({key: ...}), instead of a hole." : "In fragments, vnodes must either all have keys or none have keys.");
        }
      }
      for (var s = 0; s < t.length; s++) {
        i[s] = e.normalize(t[s]);
      }
    }
    return i;
  };
  Yn = e;
  return Yn;
}
var iu = It();
function ea() {
  var e = arguments[this];
  var t = this + 1;
  var i;
  if (e == null) {
    e = {};
  } else if (typeof e != "object" || e.tag != null || Array.isArray(e)) {
    e = {};
    t = this;
  }
  if (arguments.length === t + 1) {
    i = arguments[t];
    if (!Array.isArray(i)) {
      i = [i];
    }
  } else {
    for (i = []; t < arguments.length;) {
      i.push(arguments[t++]);
    }
  }
  return iu("", e.key, e, i);
}
var Dn = {}.hasOwnProperty;
var nu = It();
var su = ea;
var Jt = Dn;
var ru = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g;
var ta = {};
function Cr(e) {
  for (var t in e) {
    if (Jt.call(e, t)) {
      return false;
    }
  }
  return true;
}
function ou(e) {
  for (var t, i = "div", n = [], s = {}; t = ru.exec(e);) {
    var r = t[1];
    var o = t[2];
    if (r === "" && o !== "") {
      i = o;
    } else if (r === "#") {
      s.id = o;
    } else if (r === ".") {
      n.push(o);
    } else if (t[3][0] === "[") {
      var l = t[6];
      if (l) {
        l = l.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\");
      }
      if (t[4] === "class") {
        n.push(l);
      } else {
        s[t[4]] = l === "" ? l : l || true;
      }
    }
  }
  if (n.length > 0) {
    s.className = n.join(" ");
  }
  return ta[e] = {
    tag: i,
    attrs: s
  };
}
function au(e, t) {
  var i = t.attrs;
  var n = Jt.call(i, "class");
  var s = n ? i.class : i.className;
  t.tag = e.tag;
  t.attrs = {};
  if (!Cr(e.attrs) && !Cr(i)) {
    var r = {};
    for (var o in i) {
      if (Jt.call(i, o)) {
        r[o] = i[o];
      }
    }
    i = r;
  }
  for (var o in e.attrs) {
    if (Jt.call(e.attrs, o) && o !== "className" && !Jt.call(i, o)) {
      i[o] = e.attrs[o];
    }
  }
  if (s != null || e.attrs.className != null) {
    i.className = s != null ? e.attrs.className != null ? String(e.attrs.className) + " " + String(s) : s : e.attrs.className != null ? e.attrs.className : null;
  }
  if (n) {
    i.class = null;
  }
  for (var o in i) {
    if (Jt.call(i, o) && o !== "key") {
      t.attrs = i;
      break;
    }
  }
  return t;
}
function lu(e) {
  if (e == null || typeof e != "string" && typeof e != "function" && typeof e.view != "function") {
    throw Error("The selector must be either a string or a component.");
  }
  var t = su.apply(1, arguments);
  if (typeof e == "string" && (t.children = nu.normalizeChildren(t.children), e !== "[")) {
    return au(ta[e] || ou(e), t);
  } else {
    t.tag = e;
    return t;
  }
}
var ia = lu;
var cu = It();
function hu(e) {
  if (e == null) {
    e = "";
  }
  return cu("<", undefined, undefined, e, undefined, undefined);
}
var uu = It();
var fu = ea;
function du() {
  var e = fu.apply(0, arguments);
  e.tag = "[";
  e.children = uu.normalizeChildren(e.children);
  return e;
}
var Js = ia;
Js.trust = hu;
Js.fragment = du;
var pu = Js;
var cn = {
  exports: {}
};
var Kn;
var Pr;
function na() {
  if (Pr) {
    return Kn;
  }
  Pr = 1;
  function e(t) {
    if (!(this instanceof e)) {
      throw new Error("Promise must be called with 'new'.");
    }
    if (typeof t != "function") {
      throw new TypeError("executor must be a function.");
    }
    var i = this;
    var n = [];
    var s = [];
    var r = a(n, true);
    var o = a(s, false);
    var l = i._instance = {
      resolvers: n,
      rejectors: s
    };
    var c = typeof setImmediate == "function" ? setImmediate : setTimeout;
    function a(d, u) {
      return function p(w) {
        var x;
        try {
          if (u && w != null && (typeof w == "object" || typeof w == "function") && typeof (x = w.then) == "function") {
            if (w === i) {
              throw new TypeError("Promise can't be resolved with itself.");
            }
            f(x.bind(w));
          } else {
            c(function () {
              if (!u && d.length === 0) {
                console.error("Possible unhandled promise rejection:", w);
              }
              for (var b = 0; b < d.length; b++) {
                d[b](w);
              }
              n.length = 0;
              s.length = 0;
              l.state = u;
              l.retry = function () {
                p(w);
              };
            });
          }
        } catch (b) {
          o(b);
        }
      };
    }
    function f(d) {
      var u = 0;
      function p(x) {
        return function (b) {
          if (!(u++ > 0)) {
            x(b);
          }
        };
      }
      var w = p(o);
      try {
        d(p(r), w);
      } catch (x) {
        w(x);
      }
    }
    f(t);
  }
  e.prototype.then = function (t, i) {
    var n = this;
    var s = n._instance;
    function r(a, f, d, u) {
      f.push(function (p) {
        if (typeof a != "function") {
          d(p);
        } else {
          try {
            o(a(p));
          } catch (w) {
            if (l) {
              l(w);
            }
          }
        }
      });
      if (typeof s.retry == "function" && u === s.state) {
        s.retry();
      }
    }
    var o;
    var l;
    var c = new e(function (a, f) {
      o = a;
      l = f;
    });
    r(t, s.resolvers, o, true);
    r(i, s.rejectors, l, false);
    return c;
  };
  e.prototype.catch = function (t) {
    return this.then(null, t);
  };
  e.prototype.finally = function (t) {
    return this.then(function (i) {
      return e.resolve(t()).then(function () {
        return i;
      });
    }, function (i) {
      return e.resolve(t()).then(function () {
        return e.reject(i);
      });
    });
  };
  e.resolve = function (t) {
    if (t instanceof e) {
      return t;
    } else {
      return new e(function (i) {
        i(t);
      });
    }
  };
  e.reject = function (t) {
    return new e(function (i, n) {
      n(t);
    });
  };
  e.all = function (t) {
    return new e(function (i, n) {
      var s = t.length;
      var r = 0;
      var o = [];
      if (t.length === 0) {
        i([]);
      } else {
        for (var l = 0; l < t.length; l++) {
          (function (c) {
            function a(f) {
              r++;
              o[c] = f;
              if (r === s) {
                i(o);
              }
            }
            if (t[c] != null && (typeof t[c] == "object" || typeof t[c] == "function") && typeof t[c].then == "function") {
              t[c].then(a, n);
            } else {
              a(t[c]);
            }
          })(l);
        }
      }
    });
  };
  e.race = function (t) {
    return new e(function (i, n) {
      for (var s = 0; s < t.length; s++) {
        t[s].then(i, n);
      }
    });
  };
  Kn = e;
  return Kn;
}
var Ei = na();
if (typeof window !== "undefined") {
  if (typeof window.Promise === "undefined") {
    window.Promise = Ei;
  } else if (!window.Promise.prototype.finally) {
    window.Promise.prototype.finally = Ei.prototype.finally;
  }
  cn.exports = window.Promise;
} else if (typeof Vt !== "undefined") {
  if (typeof Vt.Promise === "undefined") {
    Vt.Promise = Ei;
  } else if (!Vt.Promise.prototype.finally) {
    Vt.Promise.prototype.finally = Ei.prototype.finally;
  }
  cn.exports = Vt.Promise;
} else {
  cn.exports = Ei;
}
var sa = cn.exports;
var Zn = It();
function mu(e) {
  var t = e && e.document;
  var i;
  var n = {
    svg: "http://www.w3.org/2000/svg",
    math: "http://www.w3.org/1998/Math/MathML"
  };
  function s(m) {
    return m.attrs && m.attrs.xmlns || n[m.tag];
  }
  function r(m, h) {
    if (m.state !== h) {
      throw new Error("'vnode.state' must not be modified.");
    }
  }
  function o(m) {
    var h = m.state;
    try {
      return this.apply(h, arguments);
    } finally {
      r(m, h);
    }
  }
  function l() {
    try {
      return t.activeElement;
    } catch {
      return null;
    }
  }
  function c(m, h, g, I, E, O, q) {
    for (var Z = g; Z < I; Z++) {
      var U = h[Z];
      if (U != null) {
        a(m, U, E, q, O);
      }
    }
  }
  function a(m, h, g, I, E) {
    var O = h.tag;
    if (typeof O == "string") {
      h.state = {};
      if (h.attrs != null) {
        yi(h.attrs, h, g);
      }
      switch (O) {
        case "#":
          f(m, h, E);
          break;
        case "<":
          u(m, h, I, E);
          break;
        case "[":
          p(m, h, g, I, E);
          break;
        default:
          w(m, h, g, I, E);
      }
    } else {
      b(m, h, g, I, E);
    }
  }
  function f(m, h, g) {
    h.dom = t.createTextNode(h.children);
    N(m, h.dom, g);
  }
  var d = {
    caption: "table",
    thead: "table",
    tbody: "table",
    tfoot: "table",
    tr: "tbody",
    th: "tr",
    td: "tr",
    colgroup: "table",
    col: "colgroup"
  };
  function u(m, h, g, I) {
    var E = h.children.match(/^\s*?<(\w+)/im) || [];
    var O = t.createElement(d[E[1]] || "div");
    if (g === "http://www.w3.org/2000/svg") {
      O.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\">" + h.children + "</svg>";
      O = O.firstChild;
    } else {
      O.innerHTML = h.children;
    }
    h.dom = O.firstChild;
    h.domSize = O.childNodes.length;
    h.instance = [];
    for (var q = t.createDocumentFragment(), Z; Z = O.firstChild;) {
      h.instance.push(Z);
      q.appendChild(Z);
    }
    N(m, q, I);
  }
  function p(m, h, g, I, E) {
    var O = t.createDocumentFragment();
    if (h.children != null) {
      var q = h.children;
      c(O, q, 0, q.length, g, null, I);
    }
    h.dom = O.firstChild;
    h.domSize = O.childNodes.length;
    N(m, O, E);
  }
  function w(m, h, g, I, E) {
    var O = h.tag;
    var q = h.attrs;
    var Z = q && q.is;
    I = s(h) || I;
    var U = I ? Z ? t.createElementNS(I, O, {
      is: Z
    }) : t.createElementNS(I, O) : Z ? t.createElement(O, {
      is: Z
    }) : t.createElement(O);
    h.dom = U;
    if (q != null) {
      zt(h, q, I);
    }
    N(m, U, E);
    if (!Y(h) && h.children != null) {
      var j = h.children;
      c(U, j, 0, j.length, g, null, I);
      if (h.tag === "select" && q != null) {
        Be(h, q);
      }
    }
  }
  function x(m, h) {
    var g;
    if (typeof m.tag.view == "function") {
      m.state = Object.create(m.tag);
      g = m.state.view;
      if (g.$$reentrantLock$$ != null) {
        return;
      }
      g.$$reentrantLock$$ = true;
    } else {
      m.state = undefined;
      g = m.tag;
      if (g.$$reentrantLock$$ != null) {
        return;
      }
      g.$$reentrantLock$$ = true;
      m.state = m.tag.prototype != null && typeof m.tag.prototype.view == "function" ? new m.tag(m) : m.tag(m);
    }
    yi(m.state, m, h);
    if (m.attrs != null) {
      yi(m.attrs, m, h);
    }
    m.instance = Zn.normalize(o.call(m.state.view, m));
    if (m.instance === m) {
      throw Error("A view cannot return the vnode it received as argument");
    }
    g.$$reentrantLock$$ = null;
  }
  function b(m, h, g, I, E) {
    x(h, g);
    if (h.instance != null) {
      a(m, h.instance, g, I, E);
      h.dom = h.instance.dom;
      h.domSize = h.dom != null ? h.instance.domSize : 0;
    } else {
      h.domSize = 0;
    }
  }
  function $(m, h, g, I, E, O) {
    if (!(h === g || h == null && g == null)) {
      if (h == null || h.length === 0) {
        c(m, g, 0, g.length, I, E, O);
      } else if (g == null || g.length === 0) {
        K(m, h, 0, h.length);
      } else {
        var q = h[0] != null && h[0].key != null;
        var Z = g[0] != null && g[0].key != null;
        var U = 0;
        var j = 0;
        if (!q) {
          for (; j < h.length && h[j] == null;) {
            j++;
          }
        }
        if (!Z) {
          for (; U < g.length && g[U] == null;) {
            U++;
          }
        }
        if (q !== Z) {
          K(m, h, j, h.length);
          c(m, g, U, g.length, I, E, O);
        } else if (Z) {
          for (var Ce = h.length - 1, pe = g.length - 1, Bt, be, ue, Ie, re, ki; Ce >= j && pe >= U && (Ie = h[Ce], re = g[pe], Ie.key === re.key);) {
            if (Ie !== re) {
              v(m, Ie, re, I, E, O);
            }
            if (re.dom != null) {
              E = re.dom;
            }
            Ce--;
            pe--;
          }
          for (; Ce >= j && pe >= U && (be = h[j], ue = g[U], be.key === ue.key);) {
            j++;
            U++;
            if (be !== ue) {
              v(m, be, ue, I, _(h, j, E), O);
            }
          }
          for (; Ce >= j && pe >= U && !(U === pe || be.key !== re.key || Ie.key !== ue.key);) {
            ki = _(h, j, E);
            D(m, Ie, ki);
            if (Ie !== ue) {
              v(m, Ie, ue, I, ki, O);
            }
            if (++U <= --pe) {
              D(m, be, E);
            }
            if (be !== re) {
              v(m, be, re, I, E, O);
            }
            if (re.dom != null) {
              E = re.dom;
            }
            j++;
            Ce--;
            Ie = h[Ce];
            re = g[pe];
            be = h[j];
            ue = g[U];
          }
          for (; Ce >= j && pe >= U && Ie.key === re.key;) {
            if (Ie !== re) {
              v(m, Ie, re, I, E, O);
            }
            if (re.dom != null) {
              E = re.dom;
            }
            Ce--;
            pe--;
            Ie = h[Ce];
            re = g[pe];
          }
          if (U > pe) {
            K(m, h, j, Ce + 1);
          } else if (j > Ce) {
            c(m, g, U, pe + 1, I, E, O);
          } else {
            var Mt = E;
            var xi = pe - U + 1;
            var gt = new Array(xi);
            var Ht = 0;
            var fe = 0;
            var Lt = 2147483647;
            var nt = 0;
            var Bt;
            var Ft;
            for (fe = 0; fe < xi; fe++) {
              gt[fe] = -1;
            }
            for (fe = pe; fe >= U; fe--) {
              if (Bt == null) {
                Bt = M(h, j, Ce + 1);
              }
              re = g[fe];
              var st = Bt[re.key];
              if (st != null) {
                Lt = st < Lt ? st : -1;
                gt[fe - U] = st;
                Ie = h[st];
                h[st] = null;
                if (Ie !== re) {
                  v(m, Ie, re, I, E, O);
                }
                if (re.dom != null) {
                  E = re.dom;
                }
                nt++;
              }
            }
            E = Mt;
            if (nt !== Ce - j + 1) {
              K(m, h, j, Ce + 1);
            }
            if (nt === 0) {
              c(m, g, U, pe + 1, I, E, O);
            } else if (Lt === -1) {
              Ft = F(gt);
              Ht = Ft.length - 1;
              fe = pe;
              Ft = F(gt);
              Ht = Ft.length - 1;
              fe = pe;
              for (; fe >= U; fe--) {
                ue = g[fe];
                if (gt[fe - U] === -1) {
                  a(m, ue, I, O, E);
                } else if (Ft[Ht] === fe - U) {
                  Ht--;
                } else {
                  D(m, ue, E);
                }
                if (ue.dom != null) {
                  E = g[fe].dom;
                }
              }
            } else {
              for (fe = pe; fe >= U; fe--) {
                ue = g[fe];
                if (gt[fe - U] === -1) {
                  a(m, ue, I, O, E);
                }
                if (ue.dom != null) {
                  E = g[fe].dom;
                }
              }
            }
          }
        } else {
          var vi = h.length < g.length ? h.length : g.length;
          for (U = U < j ? U : j; U < vi; U++) {
            be = h[U];
            ue = g[U];
            if (!(be === ue || be == null && ue == null)) {
              if (be == null) {
                a(m, ue, I, O, _(h, U + 1, E));
              } else if (ue == null) {
                ie(m, be);
              } else {
                v(m, be, ue, I, _(h, U + 1, E), O);
              }
            }
          }
          if (h.length > vi) {
            K(m, h, U, h.length);
          }
          if (g.length > vi) {
            c(m, g, U, g.length, I, E, O);
          }
        }
      }
    }
  }
  function v(m, h, g, I, E, O) {
    var q = h.tag;
    var Z = g.tag;
    if (q === Z) {
      g.state = h.state;
      g.events = h.events;
      if (Ln(g, h)) {
        return;
      }
      if (typeof q == "string") {
        if (g.attrs != null) {
          wi(g.attrs, g, I);
        }
        switch (q) {
          case "#":
            S(h, g);
            break;
          case "<":
            R(m, h, g, O, E);
            break;
          case "[":
            G(m, h, g, I, E, O);
            break;
          default:
            X(h, g, I, O);
        }
      } else {
        W(m, h, g, I, E, O);
      }
    } else {
      ie(m, h);
      a(m, g, I, O, E);
    }
  }
  function S(m, h) {
    if (m.children.toString() !== h.children.toString()) {
      m.dom.nodeValue = h.children;
    }
    h.dom = m.dom;
  }
  function R(m, h, g, I, E) {
    if (h.children !== g.children) {
      ae(m, h);
      u(m, g, I, E);
    } else {
      g.dom = h.dom;
      g.domSize = h.domSize;
      g.instance = h.instance;
    }
  }
  function G(m, h, g, I, E, O) {
    $(m, h.children, g.children, I, E, O);
    var q = 0;
    var Z = g.children;
    g.dom = null;
    if (Z != null) {
      for (var U = 0; U < Z.length; U++) {
        var j = Z[U];
        if (j != null && j.dom != null) {
          if (g.dom == null) {
            g.dom = j.dom;
          }
          q += j.domSize || 1;
        }
      }
      if (q !== 1) {
        g.domSize = q;
      }
    }
  }
  function X(m, h, g, I) {
    var E = h.dom = m.dom;
    I = s(h) || I;
    if (h.tag === "textarea" && h.attrs == null) {
      h.attrs = {};
    }
    pt(h, m.attrs, h.attrs, I);
    if (!Y(h)) {
      $(E, m.children, h.children, g, null, I);
    }
  }
  function W(m, h, g, I, E, O) {
    g.instance = Zn.normalize(o.call(g.state.view, g));
    if (g.instance === g) {
      throw Error("A view cannot return the vnode it received as argument");
    }
    wi(g.state, g, I);
    if (g.attrs != null) {
      wi(g.attrs, g, I);
    }
    if (g.instance != null) {
      if (h.instance == null) {
        a(m, g.instance, I, O, E);
      } else {
        v(m, h.instance, g.instance, I, E, O);
      }
      g.dom = g.instance.dom;
      g.domSize = g.instance.domSize;
    } else if (h.instance != null) {
      ie(m, h.instance);
      g.dom = undefined;
      g.domSize = 0;
    } else {
      g.dom = h.dom;
      g.domSize = h.domSize;
    }
  }
  function M(m, h, g) {
    for (var I = Object.create(null); h < g; h++) {
      var E = m[h];
      if (E != null) {
        var O = E.key;
        if (O != null) {
          I[O] = h;
        }
      }
    }
    return I;
  }
  var V = [];
  function F(m) {
    for (var h = [0], g = 0, I = 0, E = 0, O = V.length = m.length, E = 0; E < O; E++) {
      V[E] = m[E];
    }
    for (var E = 0; E < O; ++E) {
      if (m[E] !== -1) {
        var q = h[h.length - 1];
        if (m[q] < m[E]) {
          V[E] = q;
          h.push(E);
          continue;
        }
        g = 0;
        I = h.length - 1;
        for (; g < I;) {
          var Z = (g >>> 1) + (I >>> 1) + (g & I & 1);
          if (m[h[Z]] < m[E]) {
            g = Z + 1;
          } else {
            I = Z;
          }
        }
        if (m[E] < m[h[g]]) {
          if (g > 0) {
            V[E] = h[g - 1];
          }
          h[g] = E;
        }
      }
    }
    g = h.length;
    I = h[g - 1];
    for (; g-- > 0;) {
      h[g] = I;
      I = V[I];
    }
    V.length = 0;
    return h;
  }
  function _(m, h, g) {
    for (; h < m.length; h++) {
      if (m[h] != null && m[h].dom != null) {
        return m[h].dom;
      }
    }
    return g;
  }
  function D(m, h, g) {
    var I = t.createDocumentFragment();
    z(m, I, h);
    N(m, I, g);
  }
  function z(m, h, g) {
    for (; g.dom != null && g.dom.parentNode === m;) {
      if (typeof g.tag != "string") {
        g = g.instance;
        if (g != null) {
          continue;
        }
      } else if (g.tag === "<") {
        for (var I = 0; I < g.instance.length; I++) {
          h.appendChild(g.instance[I]);
        }
      } else if (g.tag !== "[") {
        h.appendChild(g.dom);
      } else if (g.children.length === 1) {
        g = g.children[0];
        if (g != null) {
          continue;
        }
      } else {
        for (var I = 0; I < g.children.length; I++) {
          var E = g.children[I];
          if (E != null) {
            z(m, h, E);
          }
        }
      }
      break;
    }
  }
  function N(m, h, g) {
    if (g != null) {
      m.insertBefore(h, g);
    } else {
      m.appendChild(h);
    }
  }
  function Y(m) {
    if (m.attrs == null || m.attrs.contenteditable == null && m.attrs.contentEditable == null) {
      return false;
    }
    var h = m.children;
    if (h != null && h.length === 1 && h[0].tag === "<") {
      var g = h[0].children;
      if (m.dom.innerHTML !== g) {
        m.dom.innerHTML = g;
      }
    } else if (h != null && h.length !== 0) {
      throw new Error("Child node of a contenteditable must be trusted.");
    }
    return true;
  }
  function K(m, h, g, I) {
    for (var E = g; E < I; E++) {
      var O = h[E];
      if (O != null) {
        ie(m, O);
      }
    }
  }
  function ie(m, h) {
    var g = 0;
    var I = h.state;
    var E;
    var O;
    if (typeof h.tag != "string" && typeof h.state.onbeforeremove == "function") {
      var q = o.call(h.state.onbeforeremove, h);
      if (q != null && typeof q.then == "function") {
        g = 1;
        E = q;
      }
    }
    if (h.attrs && typeof h.attrs.onbeforeremove == "function") {
      var q = o.call(h.attrs.onbeforeremove, h);
      if (q != null && typeof q.then == "function") {
        g |= 2;
        O = q;
      }
    }
    r(h, I);
    if (!g) {
      Se(h);
      J(m, h);
    } else {
      if (E != null) {
        function Z() {
          if (g & 1) {
            g &= 2;
            if (!g) {
              U();
            }
          }
        }
        E.then(Z, Z);
      }
      if (O != null) {
        function Z() {
          if (g & 2) {
            g &= 1;
            if (!g) {
              U();
            }
          }
        }
        O.then(Z, Z);
      }
    }
    function U() {
      r(h, I);
      Se(h);
      J(m, h);
    }
  }
  function ae(m, h) {
    for (var g = 0; g < h.instance.length; g++) {
      m.removeChild(h.instance[g]);
    }
  }
  function J(m, h) {
    for (; h.dom != null && h.dom.parentNode === m;) {
      if (typeof h.tag != "string") {
        h = h.instance;
        if (h != null) {
          continue;
        }
      } else if (h.tag === "<") {
        ae(m, h);
      } else {
        if (h.tag !== "[" && (m.removeChild(h.dom), !Array.isArray(h.children))) {
          break;
        }
        if (h.children.length === 1) {
          h = h.children[0];
          if (h != null) {
            continue;
          }
        } else {
          for (var g = 0; g < h.children.length; g++) {
            var I = h.children[g];
            if (I != null) {
              J(m, I);
            }
          }
        }
      }
      break;
    }
  }
  function Se(m) {
    if (typeof m.tag != "string" && typeof m.state.onremove == "function") {
      o.call(m.state.onremove, m);
    }
    if (m.attrs && typeof m.attrs.onremove == "function") {
      o.call(m.attrs.onremove, m);
    }
    if (typeof m.tag != "string") {
      if (m.instance != null) {
        Se(m.instance);
      }
    } else {
      var h = m.children;
      if (Array.isArray(h)) {
        for (var g = 0; g < h.length; g++) {
          var I = h[g];
          if (I != null) {
            Se(I);
          }
        }
      }
    }
  }
  function zt(m, h, g) {
    if (m.tag === "input" && h.type != null) {
      m.dom.setAttribute("type", h.type);
    }
    var I = h != null && m.tag === "input" && h.type === "file";
    for (var E in h) {
      Ve(m, E, null, h[E], g, I);
    }
  }
  function Ve(m, h, g, I, E, O) {
    if (!(h === "key" || h === "is" || I == null || mt(h) || g === I && !ne(m, h) && typeof I != "object" || h === "type" && m.tag === "input")) {
      if (h[0] === "o" && h[1] === "n") {
        return gi(m, h, I);
      }
      if (h.slice(0, 6) === "xlink:") {
        m.dom.setAttributeNS("http://www.w3.org/1999/xlink", h.slice(6), I);
      } else if (h === "style") {
        pi(m.dom, g, I);
      } else if (Ne(m, h, E)) {
        if (h === "value") {
          if ((m.tag === "input" || m.tag === "textarea") && m.dom.value === "" + I && (O || m.dom === l()) || m.tag === "select" && g !== null && m.dom.value === "" + I || m.tag === "option" && g !== null && m.dom.value === "" + I) {
            return;
          }
          if (O && "" + I != "") {
            console.error("`value` is read-only on file inputs!");
            return;
          }
        }
        m.dom[h] = I;
      } else if (typeof I == "boolean") {
        if (I) {
          m.dom.setAttribute(h, "");
        } else {
          m.dom.removeAttribute(h);
        }
      } else {
        m.dom.setAttribute(h === "className" ? "class" : h, I);
      }
    }
  }
  function te(m, h, g, I) {
    if (!(h === "key" || h === "is" || g == null || mt(h))) {
      if (h[0] === "o" && h[1] === "n") {
        gi(m, h, undefined);
      } else if (h === "style") {
        pi(m.dom, g, null);
      } else if (Ne(m, h, I) && h !== "className" && h !== "title" && !(h === "value" && (m.tag === "option" || m.tag === "select" && m.dom.selectedIndex === -1 && m.dom === l())) && !(m.tag === "input" && h === "type")) {
        m.dom[h] = null;
      } else {
        var E = h.indexOf(":");
        if (E !== -1) {
          h = h.slice(E + 1);
        }
        if (g !== false) {
          m.dom.removeAttribute(h === "className" ? "class" : h);
        }
      }
    }
  }
  function Be(m, h) {
    if ("value" in h) {
      if (h.value === null) {
        if (m.dom.selectedIndex !== -1) {
          m.dom.value = null;
        }
      } else {
        var g = "" + h.value;
        if (m.dom.value !== g || m.dom.selectedIndex === -1) {
          m.dom.value = g;
        }
      }
    }
    if ("selectedIndex" in h) {
      Ve(m, "selectedIndex", null, h.selectedIndex, undefined);
    }
  }
  function pt(m, h, g, I) {
    if (h && h === g) {
      console.warn("Don't reuse attrs object, use new object for every redraw, this will throw in next major");
    }
    if (g != null) {
      if (m.tag === "input" && g.type != null) {
        m.dom.setAttribute("type", g.type);
      }
      var E = m.tag === "input" && g.type === "file";
      for (var O in g) {
        Ve(m, O, h && h[O], g[O], I, E);
      }
    }
    var q;
    if (h != null) {
      for (var O in h) {
        if ((q = h[O]) != null && (g == null || g[O] == null)) {
          te(m, O, q, I);
        }
      }
    }
  }
  function ne(m, h) {
    return h === "value" || h === "checked" || h === "selectedIndex" || h === "selected" && m.dom === l() || m.tag === "option" && m.dom.parentNode === t.activeElement;
  }
  function mt(m) {
    return m === "oninit" || m === "oncreate" || m === "onupdate" || m === "onremove" || m === "onbeforeremove" || m === "onbeforeupdate";
  }
  function Ne(m, h, g) {
    return g === undefined && (m.tag.indexOf("-") > -1 || m.attrs != null && m.attrs.is || h !== "href" && h !== "list" && h !== "form" && h !== "width" && h !== "height") && h in m.dom;
  }
  var it = /[A-Z]/g;
  function Ze(m) {
    return "-" + m.toLowerCase();
  }
  function se(m) {
    if (m[0] === "-" && m[1] === "-") {
      return m;
    } else if (m === "cssFloat") {
      return "float";
    } else {
      return m.replace(it, Ze);
    }
  }
  function pi(m, h, g) {
    if (h !== g) {
      if (g == null) {
        m.style.cssText = "";
      } else if (typeof g != "object") {
        m.style.cssText = g;
      } else if (h == null || typeof h != "object") {
        m.style.cssText = "";
        for (var I in g) {
          var E = g[I];
          if (E != null) {
            m.style.setProperty(se(I), String(E));
          }
        }
      } else {
        for (var I in g) {
          var E = g[I];
          if (E != null && (E = String(E)) !== String(h[I])) {
            m.style.setProperty(se(I), E);
          }
        }
        for (var I in h) {
          if (h[I] != null && g[I] == null) {
            m.style.removeProperty(se(I));
          }
        }
      }
    }
  }
  function mi() {
    this._ = i;
  }
  mi.prototype = Object.create(null);
  mi.prototype.handleEvent = function (m) {
    var h = this["on" + m.type];
    var g;
    if (typeof h == "function") {
      g = h.call(m.currentTarget, m);
    } else if (typeof h.handleEvent == "function") {
      h.handleEvent(m);
    }
    if (this._ && m.redraw !== false) {
      (0, this._)();
    }
    if (g === false) {
      m.preventDefault();
      m.stopPropagation();
    }
  };
  function gi(m, h, g) {
    if (m.events != null) {
      m.events._ = i;
      if (m.events[h] === g) {
        return;
      }
      if (g != null && (typeof g == "function" || typeof g == "object")) {
        if (m.events[h] == null) {
          m.dom.addEventListener(h.slice(2), m.events, false);
        }
        m.events[h] = g;
      } else {
        if (m.events[h] != null) {
          m.dom.removeEventListener(h.slice(2), m.events, false);
        }
        m.events[h] = undefined;
      }
    } else if (g != null && (typeof g == "function" || typeof g == "object")) {
      m.events = new mi();
      m.dom.addEventListener(h.slice(2), m.events, false);
      m.events[h] = g;
    }
  }
  function yi(m, h, g) {
    if (typeof m.oninit == "function") {
      o.call(m.oninit, h);
    }
    if (typeof m.oncreate == "function") {
      g.push(o.bind(m.oncreate, h));
    }
  }
  function wi(m, h, g) {
    if (typeof m.onupdate == "function") {
      g.push(o.bind(m.onupdate, h));
    }
  }
  function Ln(m, h) {
    do {
      if (m.attrs != null && typeof m.attrs.onbeforeupdate == "function") {
        var g = o.call(m.attrs.onbeforeupdate, m, h);
        if (g !== undefined && !g) {
          break;
        }
      }
      if (typeof m.tag != "string" && typeof m.state.onbeforeupdate == "function") {
        var g = o.call(m.state.onbeforeupdate, m, h);
        if (g !== undefined && !g) {
          break;
        }
      }
      return false;
    } while (false);
    m.dom = h.dom;
    m.domSize = h.domSize;
    m.instance = h.instance;
    m.attrs = h.attrs;
    m.children = h.children;
    m.text = h.text;
    return true;
  }
  var Tt;
  return function (m, h, g) {
    if (!m) {
      throw new TypeError("DOM element being rendered to does not exist.");
    }
    if (Tt != null && m.contains(Tt)) {
      throw new TypeError("Node is currently being rendered to and thus is locked.");
    }
    var I = i;
    var E = Tt;
    var O = [];
    var q = l();
    var Z = m.namespaceURI;
    Tt = m;
    i = typeof g == "function" ? g : undefined;
    try {
      if (m.vnodes == null) {
        m.textContent = "";
      }
      h = Zn.normalizeChildren(Array.isArray(h) ? h : [h]);
      $(m, m.vnodes, h, O, null, Z === "http://www.w3.org/1999/xhtml" ? undefined : Z);
      m.vnodes = h;
      if (q != null && l() !== q && typeof q.focus == "function") {
        q.focus();
      }
      for (var U = 0; U < O.length; U++) {
        O[U]();
      }
    } finally {
      i = I;
      Tt = E;
    }
  };
}
var ra = mu(typeof window !== "undefined" ? window : null);
var $r = It();
function gu(e, t, i) {
  var n = [];
  var s = false;
  var r = -1;
  function o() {
    for (r = 0; r < n.length; r += 2) {
      try {
        e(n[r], $r(n[r + 1]), l);
      } catch (a) {
        i.error(a);
      }
    }
    r = -1;
  }
  function l() {
    if (!s) {
      s = true;
      t(function () {
        s = false;
        o();
      });
    }
  }
  l.sync = o;
  function c(a, f) {
    if (f != null && f.view == null && typeof f != "function") {
      throw new TypeError("m.mount expects a component, not a vnode.");
    }
    var d = n.indexOf(a);
    if (d >= 0) {
      n.splice(d, 2);
      if (d <= r) {
        r -= 2;
      }
      e(a, []);
    }
    if (f != null) {
      n.push(a, f);
      e(a, $r(f), l);
    }
  }
  return {
    mount: c,
    redraw: l
  };
}
var yu = ra;
var Qs = gu(yu, typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : null, typeof console !== "undefined" ? console : null);
var Jn;
var Rr;
function oa() {
  if (!Rr) {
    Rr = 1;
    Jn = function (e) {
      if (Object.prototype.toString.call(e) !== "[object Object]") {
        return "";
      }
      var t = [];
      for (var i in e) {
        n(i, e[i]);
      }
      return t.join("&");
      function n(s, r) {
        if (Array.isArray(r)) {
          for (var o = 0; o < r.length; o++) {
            n(s + "[" + o + "]", r[o]);
          }
        } else if (Object.prototype.toString.call(r) === "[object Object]") {
          for (var o in r) {
            n(s + "[" + o + "]", r[o]);
          }
        } else {
          t.push(encodeURIComponent(s) + (r != null && r !== "" ? "=" + encodeURIComponent(r) : ""));
        }
      }
    };
  }
  return Jn;
}
var Qn;
var Ar;
function aa() {
  if (Ar) {
    return Qn;
  }
  Ar = 1;
  var e = Dn;
  Qn = Object.assign || function (t, i) {
    for (var n in i) {
      if (e.call(i, n)) {
        t[n] = i[n];
      }
    }
  };
  return Qn;
}
var jn;
var Dr;
function js() {
  if (Dr) {
    return jn;
  }
  Dr = 1;
  var e = oa();
  var t = aa();
  jn = function (i, n) {
    if (/:([^\/\.-]+)(\.{3})?:/.test(i)) {
      throw new SyntaxError("Template parameter names must be separated by either a '/', '-', or '.'.");
    }
    if (n == null) {
      return i;
    }
    var s = i.indexOf("?");
    var r = i.indexOf("#");
    var o = r < 0 ? i.length : r;
    var l = s < 0 ? o : s;
    var c = i.slice(0, l);
    var a = {};
    t(a, n);
    var f = c.replace(/:([^\/\.-]+)(\.{3})?/g, function ($, v, S) {
      delete a[v];
      if (n[v] == null) {
        return $;
      } else if (S) {
        return n[v];
      } else {
        return encodeURIComponent(String(n[v]));
      }
    });
    var d = f.indexOf("?");
    var u = f.indexOf("#");
    var p = u < 0 ? f.length : u;
    var w = d < 0 ? p : d;
    var x = f.slice(0, w);
    if (s >= 0) {
      x += i.slice(s, o);
    }
    if (d >= 0) {
      x += (s < 0 ? "?" : "&") + f.slice(d, p);
    }
    var b = e(a);
    if (b) {
      x += (s < 0 && d < 0 ? "?" : "&") + b;
    }
    if (r >= 0) {
      x += i.slice(r);
    }
    if (u >= 0) {
      x += (r < 0 ? "" : "&") + f.slice(u);
    }
    return x;
  };
  return jn;
}
var wu = js();
var Or = Dn;
function vu(e, t, i) {
  var n = 0;
  function s(l) {
    return new t(l);
  }
  s.prototype = t.prototype;
  s.__proto__ = t;
  function r(l) {
    return function (c, a) {
      if (typeof c != "string") {
        a = c;
        c = c.url;
      } else if (a == null) {
        a = {};
      }
      var f = new t(function (w, x) {
        l(wu(c, a.params), a, function (b) {
          if (typeof a.type == "function") {
            if (Array.isArray(b)) {
              for (var $ = 0; $ < b.length; $++) {
                b[$] = new a.type(b[$]);
              }
            } else {
              b = new a.type(b);
            }
          }
          w(b);
        }, x);
      });
      if (a.background === true) {
        return f;
      }
      var d = 0;
      function u() {
        if (--d === 0 && typeof i == "function") {
          i();
        }
      }
      return p(f);
      function p(w) {
        var x = w.then;
        w.constructor = s;
        w.then = function () {
          d++;
          var b = x.apply(w, arguments);
          b.then(u, function ($) {
            u();
            if (d === 0) {
              throw $;
            }
          });
          return p(b);
        };
        return w;
      }
    };
  }
  function o(l, c) {
    for (var a in l.headers) {
      if (Or.call(l.headers, a) && a.toLowerCase() === c) {
        return true;
      }
    }
    return false;
  }
  return {
    request: r(function (l, c, a, f) {
      var d = c.method != null ? c.method.toUpperCase() : "GET";
      var u = c.body;
      var p = (c.serialize == null || c.serialize === JSON.serialize) && !(u instanceof e.FormData || u instanceof e.URLSearchParams);
      var w = c.responseType || (typeof c.extract == "function" ? "" : "json");
      var x = new e.XMLHttpRequest();
      var b = false;
      var $ = false;
      var v = x;
      var S;
      var R = x.abort;
      x.abort = function () {
        b = true;
        R.call(this);
      };
      x.open(d, l, c.async !== false, typeof c.user == "string" ? c.user : undefined, typeof c.password == "string" ? c.password : undefined);
      if (p && u != null && !o(c, "content-type")) {
        x.setRequestHeader("Content-Type", "application/json; charset=utf-8");
      }
      if (typeof c.deserialize != "function" && !o(c, "accept")) {
        x.setRequestHeader("Accept", "application/json, text/*");
      }
      if (c.withCredentials) {
        x.withCredentials = c.withCredentials;
      }
      if (c.timeout) {
        x.timeout = c.timeout;
      }
      x.responseType = w;
      for (var G in c.headers) {
        if (Or.call(c.headers, G)) {
          x.setRequestHeader(G, c.headers[G]);
        }
      }
      x.onreadystatechange = function (X) {
        if (!b && X.target.readyState === 4) {
          try {
            var W = X.target.status >= 200 && X.target.status < 300 || X.target.status === 304 || /^file:\/\//i.test(l);
            var M = X.target.response;
            var V;
            if (w === "json") {
              if (!X.target.responseType && typeof c.extract != "function") {
                try {
                  M = JSON.parse(X.target.responseText);
                } catch {
                  M = null;
                }
              }
            } else if ((!w || w === "text") && M == null) {
              M = X.target.responseText;
            }
            if (typeof c.extract == "function") {
              M = c.extract(X.target, c);
              W = true;
            } else if (typeof c.deserialize == "function") {
              M = c.deserialize(M);
            }
            if (W) {
              a(M);
            } else {
              function F() {
                try {
                  V = X.target.responseText;
                } catch {
                  V = M;
                }
                var _ = new Error(V);
                _.code = X.target.status;
                _.response = M;
                f(_);
              }
              if (x.status === 0) {
                // TOLOOK
                setTimeout(function () {
                  if (!$) {
                    F();
                  }
                });
              } else {
                F();
              }
            }
          } catch (_) {
            f(_);
          }
        }
      };
      x.ontimeout = function (X) {
        $ = true;
        var W = new Error("Request timed out");
        W.code = X.target.status;
        f(W);
      };
      if (typeof c.config == "function") {
        x = c.config(x, c, l) || x;
        if (x !== v) {
          S = x.abort;
          x.abort = function () {
            b = true;
            S.call(this);
          };
        }
      }
      if (u == null) {
        x.send();
      } else if (typeof c.serialize == "function") {
        x.send(c.serialize(u));
      } else if (u instanceof e.FormData || u instanceof e.URLSearchParams) {
        x.send(u);
      } else {
        x.send(JSON.stringify(u));
      }
    }),
    jsonp: r(function (l, c, a, f) {
      var d = c.callbackName || "_mithril_" + Math.round(Math.random() * 10000000000000000) + "_" + n++;
      var u = e.document.createElement("script");
      e[d] = function (p) {
        delete e[d];
        u.parentNode.removeChild(u);
        a(p);
      };
      u.onerror = function () {
        delete e[d];
        u.parentNode.removeChild(u);
        f(new Error("JSONP request failed"));
      };
      u.src = l + (l.indexOf("?") < 0 ? "?" : "&") + encodeURIComponent(c.callbackKey || "callback") + "=" + encodeURIComponent(d);
      e.document.documentElement.appendChild(u);
    })
  };
}
var ku = sa;
var xu = Qs;
var bu = vu(typeof window !== "undefined" ? window : null, ku, xu.redraw);
var es;
var _r;
function la() {
  if (_r) {
    return es;
  }
  _r = 1;
  function e(t) {
    try {
      return decodeURIComponent(t);
    } catch {
      return t;
    }
  }
  es = function (t) {
    if (t === "" || t == null) {
      return {};
    }
    if (t.charAt(0) === "?") {
      t = t.slice(1);
    }
    for (var i = t.split("&"), n = {}, s = {}, r = 0; r < i.length; r++) {
      var o = i[r].split("=");
      var l = e(o[0]);
      var c = o.length === 2 ? e(o[1]) : "";
      if (c === "true") {
        c = true;
      } else if (c === "false") {
        c = false;
      }
      var a = l.split(/\]\[?|\[/);
      var f = s;
      if (l.indexOf("[") > -1) {
        a.pop();
      }
      for (var d = 0; d < a.length; d++) {
        var u = a[d];
        var p = a[d + 1];
        var w = p == "" || !isNaN(parseInt(p, 10));
        if (u === "") {
          var l = a.slice(0, d).join();
          if (n[l] == null) {
            n[l] = Array.isArray(f) ? f.length : 0;
          }
          u = n[l]++;
        } else if (u === "__proto__") {
          break;
        }
        if (d === a.length - 1) {
          f[u] = c;
        } else {
          var x = Object.getOwnPropertyDescriptor(f, u);
          if (x != null) {
            x = x.value;
          }
          if (x == null) {
            f[u] = x = w ? [] : {};
          }
          f = x;
        }
      }
    }
    return s;
  };
  return es;
}
var ts;
var zr;
function er() {
  if (zr) {
    return ts;
  }
  zr = 1;
  var e = la();
  ts = function (t) {
    var i = t.indexOf("?");
    var n = t.indexOf("#");
    var s = n < 0 ? t.length : n;
    var r = i < 0 ? s : i;
    var o = t.slice(0, r).replace(/\/{2,}/g, "/");
    if (o) {
      if (o[0] !== "/") {
        o = "/" + o;
      }
      if (o.length > 1 && o[o.length - 1] === "/") {
        o = o.slice(0, -1);
      }
    } else {
      o = "/";
    }
    return {
      path: o,
      params: i < 0 ? {} : e(t.slice(i + 1, s))
    };
  };
  return ts;
}
var is;
var Br;
function Su() {
  if (Br) {
    return is;
  }
  Br = 1;
  var e = er();
  is = function (t) {
    var i = e(t);
    var n = Object.keys(i.params);
    var s = [];
    var r = new RegExp("^" + i.path.replace(/:([^\/.-]+)(\.{3}|\.(?!\.)|-)?|[\\^$*+.()|\[\]{}]/g, function (o, l, c) {
      if (l == null) {
        return "\\" + o;
      } else {
        s.push({
          k: l,
          r: c === "..."
        });
        if (c === "...") {
          return "(.*)";
        } else if (c === ".") {
          return "([^/]+)\\.";
        } else {
          return "([^/]+)" + (c || "");
        }
      }
    }) + "$");
    return function (o) {
      for (var l = 0; l < n.length; l++) {
        if (i.params[n[l]] !== o.params[n[l]]) {
          return false;
        }
      }
      if (!s.length) {
        return r.test(o.path);
      }
      var c = r.exec(o.path);
      if (c == null) {
        return false;
      }
      for (var l = 0; l < s.length; l++) {
        o.params[s[l].k] = s[l].r ? c[l + 1] : decodeURIComponent(c[l + 1]);
      }
      return true;
    };
  };
  return is;
}
var ns;
var Hr;
function ca() {
  if (Hr) {
    return ns;
  }
  Hr = 1;
  var e = Dn;
  var t = new RegExp("^(?:key|oninit|oncreate|onbeforeupdate|onupdate|onbeforeremove|onremove)$");
  ns = function (i, n) {
    var s = {};
    if (n != null) {
      for (var r in i) {
        if (e.call(i, r) && !t.test(r) && n.indexOf(r) < 0) {
          s[r] = i[r];
        }
      }
    } else {
      for (var r in i) {
        if (e.call(i, r) && !t.test(r)) {
          s[r] = i[r];
        }
      }
    }
    return s;
  };
  return ns;
}
var ss;
var Lr;
function Iu() {
  if (Lr) {
    return ss;
  }
  Lr = 1;
  var e = It();
  var t = ia;
  var i = sa;
  var n = js();
  var s = er();
  var r = Su();
  var o = aa();
  var l = ca();
  var c = {};
  function a(f) {
    try {
      return decodeURIComponent(f);
    } catch {
      return f;
    }
  }
  ss = function (f, d) {
    var u = f == null ? null : typeof f.setImmediate == "function" ? f.setImmediate : f.setTimeout;
    var p = i.resolve();
    var w = false;
    var x = false;
    var b = 0;
    var $;
    var v;
    var S = c;
    var R;
    var G;
    var X;
    var W;
    var M = {
      onbeforeupdate: function () {
        b = b ? 2 : 1;
        return !(!b || c === S);
      },
      onremove: function () {
        f.removeEventListener("popstate", _, false);
        f.removeEventListener("hashchange", F, false);
      },
      view: function () {
        if (!(!b || c === S)) {
          var N = [e(R, G.key, G)];
          if (S) {
            N = S.render(N[0]);
          }
          return N;
        }
      }
    };
    var V = z.SKIP = {};
    function F() {
      w = false;
      var N = f.location.hash;
      if (z.prefix[0] !== "#") {
        N = f.location.search + N;
        if (z.prefix[0] !== "?") {
          N = f.location.pathname + N;
          if (N[0] !== "/") {
            N = "/" + N;
          }
        }
      }
      var Y = N.concat().replace(/(?:%[a-f89][a-f0-9])+/gim, a).slice(z.prefix.length);
      var K = s(Y);
      o(K.params, f.history.state);
      function ie(J) {
        console.error(J);
        D(v, null, {
          replace: true
        });
      }
      ae(0);
      function ae(J) {
        for (; J < $.length; J++) {
          if ($[J].check(K)) {
            var Se = $[J].component;
            var zt = $[J].route;
            var Ve = Se;
            var te = W = function (Be) {
              if (te === W) {
                if (Be === V) {
                  return ae(J + 1);
                }
                R = Be != null && (typeof Be.view == "function" || typeof Be == "function") ? Be : "div";
                G = K.params;
                X = Y;
                W = null;
                S = Se.render ? Se : null;
                if (b === 2) {
                  d.redraw();
                } else {
                  b = 2;
                  d.redraw.sync();
                }
              }
            };
            if (Se.view || typeof Se == "function") {
              Se = {};
              te(Ve);
            } else if (Se.onmatch) {
              p.then(function () {
                return Se.onmatch(K.params, Y, zt);
              }).then(te, Y === v ? null : ie);
            } else {
              te("div");
            }
            return;
          }
        }
        if (Y === v) {
          throw new Error("Could not resolve default route " + v + ".");
        }
        D(v, null, {
          replace: true
        });
      }
    }
    function _() {
      if (!w) {
        w = true;
        u(F);
      }
    }
    function D(N, Y, K) {
      N = n(N, Y);
      if (x) {
        _();
        var ie = K ? K.state : null;
        var ae = K ? K.title : null;
        if (K && K.replace) {
          f.history.replaceState(ie, ae, z.prefix + N);
        } else {
          f.history.pushState(ie, ae, z.prefix + N);
        }
      } else {
        f.location.href = z.prefix + N;
      }
    }
    function z(N, Y, K) {
      if (!N) {
        throw new TypeError("DOM element being rendered to does not exist.");
      }
      $ = Object.keys(K).map(function (ae) {
        if (ae[0] !== "/") {
          throw new SyntaxError("Routes must start with a '/'.");
        }
        if (/:([^\/\.-]+)(\.{3})?:/.test(ae)) {
          throw new SyntaxError("Route parameter names must be separated with either '/', '.', or '-'.");
        }
        return {
          route: ae,
          component: K[ae],
          check: r(ae)
        };
      });
      v = Y;
      if (Y != null) {
        var ie = s(Y);
        if (!$.some(function (ae) {
          return ae.check(ie);
        })) {
          throw new ReferenceError("Default route doesn't match any known routes.");
        }
      }
      if (typeof f.history.pushState == "function") {
        f.addEventListener("popstate", _, false);
      } else if (z.prefix[0] === "#") {
        f.addEventListener("hashchange", F, false);
      }
      x = true;
      d.mount(N, M);
      F();
    }
    z.set = function (N, Y, K) {
      if (W != null) {
        K = K || {};
        K.replace = true;
      }
      W = null;
      D(N, Y, K);
    };
    z.get = function () {
      return X;
    };
    z.prefix = "#!";
    z.Link = {
      view: function (N) {
        var Y = t(N.attrs.selector || "a", l(N.attrs, ["options", "params", "selector", "onclick"]), N.children);
        var K;
        var ie;
        var ae;
        if (Y.attrs.disabled = !!Y.attrs.disabled) {
          Y.attrs.href = null;
          Y.attrs["aria-disabled"] = "true";
        } else {
          K = N.attrs.options;
          ie = N.attrs.onclick;
          ae = n(Y.attrs.href, N.attrs.params);
          Y.attrs.href = z.prefix + ae;
          Y.attrs.onclick = function (J) {
            var Se;
            if (typeof ie == "function") {
              Se = ie.call(J.currentTarget, J);
            } else if (!(ie == null || typeof ie != "object")) {
              if (typeof ie.handleEvent == "function") {
                ie.handleEvent(J);
              }
            }
            if (Se !== false && !J.defaultPrevented && (J.button === 0 || J.which === 0 || J.which === 1) && (!J.currentTarget.target || J.currentTarget.target === "_self") && !J.ctrlKey && !J.metaKey && !J.shiftKey && !J.altKey) {
              J.preventDefault();
              J.redraw = false;
              z.set(ae, null, K);
            }
          };
        }
        return Y;
      }
    };
    z.param = function (N) {
      if (G && N != null) {
        return G[N];
      } else {
        return G;
      }
    };
    return z;
  };
  return ss;
}
var rs;
var Fr;
function Tu() {
  if (Fr) {
    return rs;
  }
  Fr = 1;
  var e = Qs;
  rs = Iu()(typeof window !== "undefined" ? window : null, e);
  return rs;
}
var On = pu;
var ha = bu;
var ua = Qs;
function Ae() {
  return On.apply(this, arguments);
}
Ae.m = On;
Ae.trust = On.trust;
Ae.fragment = On.fragment;
Ae.Fragment = "[";
Ae.mount = ua.mount;
Ae.route = Tu();
Ae.render = ra;
Ae.redraw = ua.redraw;
Ae.request = ha.request;
Ae.jsonp = ha.jsonp;
Ae.parseQueryString = la();
Ae.buildQueryString = oa();
Ae.parsePathname = er();
Ae.buildPathname = js();
Ae.vnode = It();
Ae.PromisePolyfill = na();
Ae.censor = ca();
var Mu = Ae;
const kt = An(Mu);
function ze(e, t, i, n, s) {
  this.debugLog = false;
  this.baseUrl = e;
  this.lobbySize = i;
  this.devPort = t;
  this.lobbySpread = n;
  this.rawIPs = !!s;
  this.server = undefined;
  this.gameIndex = undefined;
  this.callback = undefined;
  this.errorCallback = undefined;
}
ze.prototype.regionInfo = {
  0: {
    name: "Local",
    latitude: 0,
    longitude: 0
  },
  "us-east": {
    name: "Miami",
    latitude: 40.1393329,
    longitude: -75.8521818
  },
  miami: {
    name: "Miami",
    latitude: 40.1393329,
    longitude: -75.8521818
  },
  "us-west": {
    name: "Silicon Valley",
    latitude: 47.6149942,
    longitude: -122.4759879
  },
  siliconvalley: {
    name: "Silicon Valley",
    latitude: 47.6149942,
    longitude: -122.4759879
  },
  gb: {
    name: "London",
    latitude: 51.5283063,
    longitude: -0.382486
  },
  london: {
    name: "London",
    latitude: 51.5283063,
    longitude: -0.382486
  },
  "eu-west": {
    name: "Frankfurt",
    latitude: 50.1211273,
    longitude: 8.496137
  },
  frankfurt: {
    name: "Frankfurt",
    latitude: 50.1211273,
    longitude: 8.496137
  },
  au: {
    name: "Sydney",
    latitude: -33.8479715,
    longitude: 150.651084
  },
  sydney: {
    name: "Sydney",
    latitude: -33.8479715,
    longitude: 150.651084
  },
  saopaulo: {
    name: "SÃ£o Paulo",
    latitude: 23.5558,
    longitude: 46.6396
  },
  sg: {
    name: "Singapore",
    latitude: 1.3147268,
    longitude: 103.7065876
  },
  singapore: {
    name: "Singapore",
    latitude: 1.3147268,
    longitude: 103.7065876
  }
};
ze.prototype.start = function (e, t, i, n) {
  this.callback = t;
  this.errorCallback = i;
  if (n) {
    return t();
  }
  const s = this.parseServerQuery(e);
  if (s && s.length > 0) {
    this.log("Found server in query.");
    this.password = s[3];
    this.connect(s[0], s[1], s[2]);
  } else {
    this.errorCallback("Unable to find server");
  }
};
ze.prototype.parseServerQuery = function (e) {
  const t = new URLSearchParams(location.search, true);
  const i = e || t.get("server");
  if (typeof i != "string") {
    return [];
  }
  const [n, s] = i.split(":");
  return [n, s, t.get("password")];
};
ze.prototype.findServer = function (e, t) {
  var i = this.servers[e];
  for (let n = 0; n < i.length; n++) {
    const s = i[n];
    if (s.name === t) {
      return s;
    }
  }
  console.warn("Could not find server in region " + e + " with serverName " + t + ".");
};
ze.prototype.seekServer = function (e, t, i) {
  if (i == null) {
    i = "random";
  }
  if (t == null) {
    t = false;
  }
  const n = ["random"];
  const s = this.lobbySize;
  const r = this.lobbySpread;
  const o = this.servers[e].flatMap(function (u) {
    let p = 0;
    return u.games.map(function (w) {
      const x = p++;
      return {
        region: u.region,
        index: u.index * u.games.length + x,
        gameIndex: x,
        gameCount: u.games.length,
        playerCount: w.playerCount,
        playerCapacity: w.playerCapacity,
        isPrivate: w.isPrivate
      };
    });
  }).filter(function (u) {
    return !u.isPrivate;
  }).filter(function (u) {
    if (t) {
      return u.playerCount == 0 && u.gameIndex >= u.gameCount / 2;
    } else {
      return true;
    }
  }).filter(function (u) {
    if (i == "random") {
      return true;
    } else {
      return n[u.index % n.length].key == i;
    }
  }).sort(function (u, p) {
    return p.playerCount - u.playerCount;
  }).filter(function (u) {
    return u.playerCount < s;
  });
  if (t) {
    o.reverse();
  }
  if (o.length == 0) {
    this.errorCallback("No open servers.");
    return;
  }
  const l = Math.min(r, o.length);
  var f = Math.floor(Math.random() * l);
  f = Math.min(f, o.length - 1);
  const c = o[f];
  const a = c.region;
  var f = Math.floor(c.index / c.gameCount);
  const d = c.index % c.gameCount;
  this.log("Found server.");
  return [a, f, d];
};
ze.prototype.connect = function (e, t, i) {
  if (this.connected) {
    return;
  }
  const n = this.findServer(e, t);
  if (n == null) {
    this.errorCallback("Failed to find server for region " + e + " and serverName " + t);
    return;
  }
  this.log("Connecting to server", n, "with game index", i);
  if (n.playerCount >= n.playerCapacity) {
    this.errorCallback("Server is already full.");
    return;
  }
  window.history.replaceState(document.title, document.title, this.generateHref(e, t, this.password));
  this.server = n;
  this.gameIndex = i;
  this.log("Calling callback with address", this.serverAddress(n), "on port", this.serverPort(n));
  this.callback(this.serverAddress(n), this.serverPort(n), i);
  if (_i) {
    clearInterval(_i);
  }
};
ze.prototype.switchServer = function (e, t) {
  this.switchingServers = true;
  window.location = this.generateHref(e, t, null);
};
ze.prototype.generateHref = function (e, t, i) {
  let n = window.location.href.split("?")[0];
  n += "?server=" + e + ":" + t;
  if (i) {
    n += "&password=" + encodeURIComponent(i);
  }
  return n;
};
ze.prototype.serverAddress = function (e) {
  if (e.region == 0) {
    return "localhost";
  } else {
    return e.key + "." + e.region + "." + this.baseUrl;
  }
};
ze.prototype.serverPort = function (e) {
  return e.port;
};
let _i;
function Eu(e) {
  e = e.filter(s => s.playerCount !== s.playerCapacity);
  const t = Math.min(...e.map(s => s.ping || Infinity));
  const i = e.filter(s => s.ping === t);
  if (!i.length > 0) {
    return null;
  } else {
    return i.reduce((s, r) => s.playerCount > r.playerCount ? s : r);
  }
}
ze.prototype.processServers = function (e) {
  if (_i) {
    clearInterval(_i);
  }
  return new Promise(t => {
    const i = {};
    const n = c => {
      const a = i[c];
      const f = a[0];
      let d = this.serverAddress(f);
      const u = this.serverPort(f);
      if (u) {
        d += `:${u}`;
      }
      const p = `https://${d}/ping`;
      const w = new Date().getTime();
      return Promise.race([fetch(p).then(() => {
        const x = new Date().getTime() - w;
        a.forEach(b => {
          b.pings = b.pings ?? [];
          b.pings.push(x);
          if (b.pings.length > 10) {
            b.pings.shift();
          }
          b.ping = Math.floor(b.pings.reduce(($, v) => $ + v, 0) / b.pings.length);
        });
      }).catch(() => {}), new Promise(x => // TOLOOK
      setTimeout(() => x(), 100))]);
    };
    const s = async () => {
      await Promise.all(Object.keys(i).map(n));
      if (!window.blockRedraw) {
        kt.redraw();
      }
    };
    e.forEach(c => {
      i[c.region] = i[c.region] || [];
      i[c.region].push(c);
    });
    for (const c in i) {
      i[c] = i[c].sort(function (a, f) {
        return f.playerCount - a.playerCount;
      });
    }
    this.servers = i;
    let r;
    const [o, l] = this.parseServerQuery();
    e.forEach(c => {
      if (o === c.region && l === c.name) {
        c.selected = true;
        r = c;
      }
    });
    s().then(s).then(() => {
      if (r) {
        return;
      }
      let c = Eu(e);
      if (!c) {
        c = e[0];
      }
      if (c) {
        c.selected = true;
        window.history.replaceState(document.title, document.title, this.generateHref(c.region, c.name, this.password));
      }
      if (!window.blockRedraw) {
        kt.redraw();
      }
    }).then(s).catch(c => {}).finally(t);
    _i = // TOLOOK
    setInterval(s, 5000);
  });
};
ze.prototype.ipToHex = function (e) {
  return e.split(".").map(i => ("00" + parseInt(i).toString(16)).substr(-2)).join("").toLowerCase();
};
ze.prototype.hashIP = function (e) {
  return tu(this.ipToHex(e));
};
ze.prototype.log = function () {
  if (this.debugLog) {
    return console.log.apply(undefined, arguments);
  }
  if (console.verbose) {
    return console.verbose.apply(undefined, arguments);
  }
};
ze.prototype.stripRegion = function (e) {
  if (e.startsWith("vultr:")) {
    e = e.slice(6);
  } else if (e.startsWith("do:")) {
    e = e.slice(3);
  }
  return e;
};
const Cu = function (e, t) {
  return e.concat(t);
};
const Pu = function (e, t) {
  return t.map(e).reduce(Cu, []);
};
Array.prototype.flatMap = function (e) {
  return Pu(e, this);
};
const hn = (e, t) => {
  const i = t.x - e.x;
  const n = t.y - e.y;
  return Math.sqrt(i * i + n * n);
};
const $u = (e, t) => {
  const i = t.x - e.x;
  const n = t.y - e.y;
  return Au(Math.atan2(n, i));
};
const Ru = (e, t, i) => {
  const n = {
    x: 0,
    y: 0
  };
  i = Cs(i);
  n.x = e.x - t * Math.cos(i);
  n.y = e.y - t * Math.sin(i);
  return n;
};
const Cs = e => e * (Math.PI / 180);
const Au = e => e * (180 / Math.PI);
const Du = e => isNaN(e.buttons) ? e.pressure !== 0 : e.buttons !== 0;
const os = new Map();
const Vr = e => {
  if (os.has(e)) {
    clearTimeout(os.get(e));
  }
  os.set(e, // TOLOOK
  setTimeout(e, 100));
};
const wn = (e, t, i) => {
  const n = t.split(/[ ,]+/g);
  let s;
  for (let r = 0; r < n.length; r += 1) {
    s = n[r];
    if (e.addEventListener) {
      e.addEventListener(s, i, false);
    } else if (e.attachEvent) {
      e.attachEvent(s, i);
    }
  }
};
const Nr = (e, t, i) => {
  const n = t.split(/[ ,]+/g);
  let s;
  for (let r = 0; r < n.length; r += 1) {
    s = n[r];
    if (e.removeEventListener) {
      e.removeEventListener(s, i);
    } else if (e.detachEvent) {
      e.detachEvent(s, i);
    }
  }
};
const fa = e => {
  e.preventDefault();
  if (e.type.match(/^touch/)) {
    return e.changedTouches;
  } else {
    return e;
  }
};
const Ur = () => {
  const e = window.pageXOffset !== undefined ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
  const t = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  return {
    x: e,
    y: t
  };
};
const Wr = (e, t) => {
  if (t.top || t.right || t.bottom || t.left) {
    e.style.top = t.top;
    e.style.right = t.right;
    e.style.bottom = t.bottom;
    e.style.left = t.left;
  } else {
    e.style.left = t.x + "px";
    e.style.top = t.y + "px";
  }
};
const tr = (e, t, i) => {
  const n = da(e);
  for (let s in n) {
    if (n.hasOwnProperty(s)) {
      if (typeof t == "string") {
        n[s] = t + " " + i;
      } else {
        let r = "";
        for (let o = 0, l = t.length; o < l; o += 1) {
          r += t[o] + " " + i + ", ";
        }
        n[s] = r.slice(0, -2);
      }
    }
  }
  return n;
};
const Ou = (e, t) => {
  const i = da(e);
  for (let n in i) {
    if (i.hasOwnProperty(n)) {
      i[n] = t;
    }
  }
  return i;
};
const da = e => {
  const t = {
    [e]: ""
  };
  ["webkit", "Moz", "o"].forEach(function (n) {
    t[n + e.charAt(0).toUpperCase() + e.slice(1)] = "";
  });
  return t;
};
const as = (e, t) => {
  for (let i in t) {
    if (t.hasOwnProperty(i)) {
      e[i] = t[i];
    }
  }
  return e;
};
const _u = (e, t) => {
  const i = {};
  for (let n in e) {
    if (e.hasOwnProperty(n) && t.hasOwnProperty(n)) {
      i[n] = t[n];
    } else if (e.hasOwnProperty(n)) {
      i[n] = e[n];
    }
  }
  return i;
};
const Ps = (e, t) => {
  if (e.length) {
    for (let i = 0, n = e.length; i < n; i += 1) {
      t(e[i]);
    }
  } else {
    t(e);
  }
};
const zu = (e, t, i) => ({
  x: Math.min(Math.max(e.x, t.x - i), t.x + i),
  y: Math.min(Math.max(e.y, t.y - i), t.y + i)
});
var Bu = ("ontouchstart" in window);
var Hu = !!window.PointerEvent;
var Lu = !!window.MSPointerEvent;
var Ci = {
  touch: {
    start: "touchstart",
    move: "touchmove",
    end: "touchend, touchcancel"
  },
  mouse: {
    start: "mousedown",
    move: "mousemove",
    end: "mouseup"
  },
  pointer: {
    start: "pointerdown",
    move: "pointermove",
    end: "pointerup, pointercancel"
  },
  MSPointer: {
    start: "MSPointerDown",
    move: "MSPointerMove",
    end: "MSPointerUp"
  }
};
var si;
var Wi = {};
if (Hu) {
  si = Ci.pointer;
} else if (Lu) {
  si = Ci.MSPointer;
} else if (Bu) {
  si = Ci.touch;
  Wi = Ci.mouse;
} else {
  si = Ci.mouse;
}
function dt() {}
dt.prototype.on = function (e, t) {
  var i = this;
  var n = e.split(/[ ,]+/g);
  var s;
  i._handlers_ = i._handlers_ || {};
  for (var r = 0; r < n.length; r += 1) {
    s = n[r];
    i._handlers_[s] = i._handlers_[s] || [];
    i._handlers_[s].push(t);
  }
  return i;
};
dt.prototype.off = function (e, t) {
  var i = this;
  i._handlers_ = i._handlers_ || {};
  if (e === undefined) {
    i._handlers_ = {};
  } else if (t === undefined) {
    i._handlers_[e] = null;
  } else if (i._handlers_[e] && i._handlers_[e].indexOf(t) >= 0) {
    i._handlers_[e].splice(i._handlers_[e].indexOf(t), 1);
  }
  return i;
};
dt.prototype.trigger = function (e, t) {
  var i = this;
  var n = e.split(/[ ,]+/g);
  var s;
  i._handlers_ = i._handlers_ || {};
  for (var r = 0; r < n.length; r += 1) {
    s = n[r];
    if (i._handlers_[s] && i._handlers_[s].length) {
      i._handlers_[s].forEach(function (o) {
        o.call(i, {
          type: s,
          target: i
        }, t);
      });
    }
  }
};
dt.prototype.config = function (e) {
  var t = this;
  t.options = t.defaults || {};
  if (e) {
    t.options = _u(t.options, e);
  }
};
dt.prototype.bindEvt = function (e, t) {
  var i = this;
  i._domHandlers_ = i._domHandlers_ || {};
  i._domHandlers_[t] = function () {
    if (typeof i["on" + t] == "function") {
      i["on" + t].apply(i, arguments);
    } else {
      console.warn("[WARNING] : Missing \"on" + t + "\" handler.");
    }
  };
  wn(e, si[t], i._domHandlers_[t]);
  if (Wi[t]) {
    wn(e, Wi[t], i._domHandlers_[t]);
  }
  return i;
};
dt.prototype.unbindEvt = function (e, t) {
  var i = this;
  i._domHandlers_ = i._domHandlers_ || {};
  Nr(e, si[t], i._domHandlers_[t]);
  if (Wi[t]) {
    Nr(e, Wi[t], i._domHandlers_[t]);
  }
  delete i._domHandlers_[t];
  return this;
};
function Ee(e, t) {
  this.identifier = t.identifier;
  this.position = t.position;
  this.frontPosition = t.frontPosition;
  this.collection = e;
  this.defaults = {
    size: 100,
    threshold: 0.1,
    color: "white",
    fadeTime: 250,
    dataOnly: false,
    restJoystick: true,
    restOpacity: 0.5,
    mode: "dynamic",
    zone: document.body,
    lockX: false,
    lockY: false,
    shape: "circle"
  };
  this.config(t);
  if (this.options.mode === "dynamic") {
    this.options.restOpacity = 0;
  }
  this.id = Ee.id;
  Ee.id += 1;
  this.buildEl().stylize();
  this.instance = {
    el: this.ui.el,
    on: this.on.bind(this),
    off: this.off.bind(this),
    show: this.show.bind(this),
    hide: this.hide.bind(this),
    add: this.addToDom.bind(this),
    remove: this.removeFromDom.bind(this),
    destroy: this.destroy.bind(this),
    setPosition: this.setPosition.bind(this),
    resetDirection: this.resetDirection.bind(this),
    computeDirection: this.computeDirection.bind(this),
    trigger: this.trigger.bind(this),
    position: this.position,
    frontPosition: this.frontPosition,
    ui: this.ui,
    identifier: this.identifier,
    id: this.id,
    options: this.options
  };
  return this.instance;
}
Ee.prototype = new dt();
Ee.constructor = Ee;
Ee.id = 0;
Ee.prototype.buildEl = function (e) {
  this.ui = {};
  if (this.options.dataOnly) {
    return this;
  } else {
    this.ui.el = document.createElement("div");
    this.ui.back = document.createElement("div");
    this.ui.front = document.createElement("div");
    this.ui.el.className = "nipple collection_" + this.collection.id;
    this.ui.back.className = "back";
    this.ui.front.className = "front";
    this.ui.el.setAttribute("id", "nipple_" + this.collection.id + "_" + this.id);
    this.ui.el.appendChild(this.ui.back);
    this.ui.el.appendChild(this.ui.front);
    return this;
  }
};
Ee.prototype.stylize = function () {
  if (this.options.dataOnly) {
    return this;
  }
  var e = this.options.fadeTime + "ms";
  var t = Ou("borderRadius", "50%");
  var i = tr("transition", "opacity", e);
  var n = {
    el: {
      position: "absolute",
      opacity: this.options.restOpacity,
      display: "block",
      zIndex: 999
    },
    back: {
      position: "absolute",
      display: "block",
      width: this.options.size + "px",
      height: this.options.size + "px",
      marginLeft: -this.options.size / 2 + "px",
      marginTop: -this.options.size / 2 + "px",
      background: this.options.color,
      opacity: ".5"
    },
    front: {
      width: this.options.size / 2 + "px",
      height: this.options.size / 2 + "px",
      position: "absolute",
      display: "block",
      marginLeft: -this.options.size / 4 + "px",
      marginTop: -this.options.size / 4 + "px",
      background: this.options.color,
      opacity: ".5",
      transform: "translate(0px, 0px)"
    }
  };
  as(n.el, i);
  if (this.options.shape === "circle") {
    as(n.back, t);
  }
  as(n.front, t);
  this.applyStyles(n);
  return this;
};
Ee.prototype.applyStyles = function (e) {
  for (var t in this.ui) {
    if (this.ui.hasOwnProperty(t)) {
      for (var i in e[t]) {
        this.ui[t].style[i] = e[t][i];
      }
    }
  }
  return this;
};
Ee.prototype.addToDom = function () {
  if (this.options.dataOnly || document.body.contains(this.ui.el)) {
    return this;
  } else {
    this.options.zone.appendChild(this.ui.el);
    return this;
  }
};
Ee.prototype.removeFromDom = function () {
  if (this.options.dataOnly || !document.body.contains(this.ui.el)) {
    return this;
  } else {
    this.options.zone.removeChild(this.ui.el);
    return this;
  }
};
Ee.prototype.destroy = function () {
  clearTimeout(this.removeTimeout);
  clearTimeout(this.showTimeout);
  clearTimeout(this.restTimeout);
  this.trigger("destroyed", this.instance);
  this.removeFromDom();
  this.off();
};
Ee.prototype.show = function (e) {
  var t = this;
  if (!t.options.dataOnly) {
    clearTimeout(t.removeTimeout);
    clearTimeout(t.showTimeout);
    clearTimeout(t.restTimeout);
    t.addToDom();
    t.restCallback();
    // TOLOOK
    setTimeout(function () {
      t.ui.el.style.opacity = 1;
    }, 0);
    t.showTimeout = // TOLOOK
    setTimeout(function () {
      t.trigger("shown", t.instance);
      if (typeof e == "function") {
        e.call(this);
      }
    }, t.options.fadeTime);
  }
  return t;
};
Ee.prototype.hide = function (e) {
  var t = this;
  if (t.options.dataOnly) {
    return t;
  }
  t.ui.el.style.opacity = t.options.restOpacity;
  clearTimeout(t.removeTimeout);
  clearTimeout(t.showTimeout);
  clearTimeout(t.restTimeout);
  t.removeTimeout = // TOLOOK
  setTimeout(function () {
    var i = t.options.mode === "dynamic" ? "none" : "block";
    t.ui.el.style.display = i;
    if (typeof e == "function") {
      e.call(t);
    }
    t.trigger("hidden", t.instance);
  }, t.options.fadeTime);
  if (t.options.restJoystick) {
    const i = t.options.restJoystick;
    const n = {
      x: i === true || i.x !== false ? 0 : t.instance.frontPosition.x,
      y: i === true || i.y !== false ? 0 : t.instance.frontPosition.y
    };
    t.setPosition(e, n);
  }
  return t;
};
Ee.prototype.setPosition = function (e, t) {
  var i = this;
  i.frontPosition = {
    x: t.x,
    y: t.y
  };
  var n = i.options.fadeTime + "ms";
  var s = {};
  s.front = tr("transition", ["transform"], n);
  var r = {
    front: {}
  };
  r.front = {
    transform: "translate(" + i.frontPosition.x + "px," + i.frontPosition.y + "px)"
  };
  i.applyStyles(s);
  i.applyStyles(r);
  i.restTimeout = // TOLOOK
  setTimeout(function () {
    if (typeof e == "function") {
      e.call(i);
    }
    i.restCallback();
  }, i.options.fadeTime);
};
Ee.prototype.restCallback = function () {
  var e = this;
  var t = {};
  t.front = tr("transition", "none", "");
  e.applyStyles(t);
  e.trigger("rested", e.instance);
};
Ee.prototype.resetDirection = function () {
  this.direction = {
    x: false,
    y: false,
    angle: false
  };
};
Ee.prototype.computeDirection = function (e) {
  var t = e.angle.radian;
  var i = Math.PI / 4;
  var n = Math.PI / 2;
  var s;
  var r;
  var o;
  if (t > i && t < i * 3 && !e.lockX) {
    s = "up";
  } else if (t > -i && t <= i && !e.lockY) {
    s = "left";
  } else if (t > -i * 3 && t <= -i && !e.lockX) {
    s = "down";
  } else if (!e.lockY) {
    s = "right";
  }
  if (!e.lockY) {
    if (t > -n && t < n) {
      r = "left";
    } else {
      r = "right";
    }
  }
  if (!e.lockX) {
    if (t > 0) {
      o = "up";
    } else {
      o = "down";
    }
  }
  if (e.force > this.options.threshold) {
    var l = {};
    var c;
    for (c in this.direction) {
      if (this.direction.hasOwnProperty(c)) {
        l[c] = this.direction[c];
      }
    }
    var a = {};
    this.direction = {
      x: r,
      y: o,
      angle: s
    };
    e.direction = this.direction;
    for (c in l) {
      if (l[c] === this.direction[c]) {
        a[c] = true;
      }
    }
    if (a.x && a.y && a.angle) {
      return e;
    }
    if (!a.x || !a.y) {
      this.trigger("plain", e);
    }
    if (!a.x) {
      this.trigger("plain:" + r, e);
    }
    if (!a.y) {
      this.trigger("plain:" + o, e);
    }
    if (!a.angle) {
      this.trigger("dir dir:" + s, e);
    }
  } else {
    this.resetDirection();
  }
  return e;
};
function ke(e, t) {
  var i = this;
  i.nipples = [];
  i.idles = [];
  i.actives = [];
  i.ids = [];
  i.pressureIntervals = {};
  i.manager = e;
  i.id = ke.id;
  ke.id += 1;
  i.defaults = {
    zone: document.body,
    multitouch: false,
    maxNumberOfNipples: 10,
    mode: "dynamic",
    position: {
      top: 0,
      left: 0
    },
    catchDistance: 200,
    size: 100,
    threshold: 0.1,
    color: "white",
    fadeTime: 250,
    dataOnly: false,
    restJoystick: true,
    restOpacity: 0.5,
    lockX: false,
    lockY: false,
    shape: "circle",
    dynamicPage: false,
    follow: false
  };
  i.config(t);
  if (i.options.mode === "static" || i.options.mode === "semi") {
    i.options.multitouch = false;
  }
  if (!i.options.multitouch) {
    i.options.maxNumberOfNipples = 1;
  }
  const n = getComputedStyle(i.options.zone.parentElement);
  if (n && n.display === "flex") {
    i.parentIsFlex = true;
  }
  i.updateBox();
  i.prepareNipples();
  i.bindings();
  i.begin();
  return i.nipples;
}
ke.prototype = new dt();
ke.constructor = ke;
ke.id = 0;
ke.prototype.prepareNipples = function () {
  var e = this;
  var t = e.nipples;
  t.on = e.on.bind(e);
  t.off = e.off.bind(e);
  t.options = e.options;
  t.destroy = e.destroy.bind(e);
  t.ids = e.ids;
  t.id = e.id;
  t.processOnMove = e.processOnMove.bind(e);
  t.processOnEnd = e.processOnEnd.bind(e);
  t.get = function (i) {
    if (i === undefined) {
      return t[0];
    }
    for (var n = 0, s = t.length; n < s; n += 1) {
      if (t[n].identifier === i) {
        return t[n];
      }
    }
    return false;
  };
};
ke.prototype.bindings = function () {
  var e = this;
  e.bindEvt(e.options.zone, "start");
  e.options.zone.style.touchAction = "none";
  e.options.zone.style.msTouchAction = "none";
};
ke.prototype.begin = function () {
  var e = this;
  var t = e.options;
  if (t.mode === "static") {
    var i = e.createNipple(t.position, e.manager.getIdentifier());
    i.add();
    e.idles.push(i);
  }
};
ke.prototype.createNipple = function (e, t) {
  var i = this;
  var n = i.manager.scroll;
  var s = {};
  var r = i.options;
  var o = {
    x: i.parentIsFlex ? n.x : n.x + i.box.left,
    y: i.parentIsFlex ? n.y : n.y + i.box.top
  };
  if (e.x && e.y) {
    s = {
      x: e.x - o.x,
      y: e.y - o.y
    };
  } else if (e.top || e.right || e.bottom || e.left) {
    var l = document.createElement("DIV");
    l.style.display = "hidden";
    l.style.top = e.top;
    l.style.right = e.right;
    l.style.bottom = e.bottom;
    l.style.left = e.left;
    l.style.position = "absolute";
    r.zone.appendChild(l);
    var c = l.getBoundingClientRect();
    r.zone.removeChild(l);
    s = e;
    e = {
      x: c.left + n.x,
      y: c.top + n.y
    };
  }
  var a = new Ee(i, {
    color: r.color,
    size: r.size,
    threshold: r.threshold,
    fadeTime: r.fadeTime,
    dataOnly: r.dataOnly,
    restJoystick: r.restJoystick,
    restOpacity: r.restOpacity,
    mode: r.mode,
    identifier: t,
    position: e,
    zone: r.zone,
    frontPosition: {
      x: 0,
      y: 0
    },
    shape: r.shape
  });
  if (!r.dataOnly) {
    Wr(a.ui.el, s);
    Wr(a.ui.front, a.frontPosition);
  }
  i.nipples.push(a);
  i.trigger("added " + a.identifier + ":added", a);
  i.manager.trigger("added " + a.identifier + ":added", a);
  i.bindNipple(a);
  return a;
};
ke.prototype.updateBox = function () {
  var e = this;
  e.box = e.options.zone.getBoundingClientRect();
};
ke.prototype.bindNipple = function (e) {
  var t = this;
  var i;
  function n(s, r) {
    i = s.type + " " + r.id + ":" + s.type;
    t.trigger(i, r);
  }
  e.on("destroyed", t.onDestroyed.bind(t));
  e.on("shown hidden rested dir plain", n);
  e.on("dir:up dir:right dir:down dir:left", n);
  e.on("plain:up plain:right plain:down plain:left", n);
};
ke.prototype.pressureFn = function (e, t, i) {
  var n = this;
  var s = 0;
  clearInterval(n.pressureIntervals[i]);
  n.pressureIntervals[i] = // TOLOOK
  setInterval(function () {
    var r = e.force || e.pressure || e.webkitForce || 0;
    if (r !== s) {
      t.trigger("pressure", r);
      n.trigger("pressure " + t.identifier + ":pressure", r);
      s = r;
    }
  }.bind(n), 100);
};
ke.prototype.onstart = function (e) {
  var t = this;
  var i = t.options;
  var n = e;
  e = fa(e);
  t.updateBox();
  function s(r) {
    if (t.actives.length < i.maxNumberOfNipples) {
      t.processOnStart(r);
    } else if (n.type.match(/^touch/)) {
      Object.keys(t.manager.ids).forEach(function (o) {
        if (Object.values(n.touches).findIndex(function (c) {
          return c.identifier === o;
        }) < 0) {
          var l = [e[0]];
          l.identifier = o;
          t.processOnEnd(l);
        }
      });
      if (t.actives.length < i.maxNumberOfNipples) {
        t.processOnStart(r);
      }
    }
  }
  Ps(e, s);
  t.manager.bindDocument();
  return false;
};
ke.prototype.processOnStart = function (e) {
  var t = this;
  var i = t.options;
  var n;
  var s = t.manager.getIdentifier(e);
  var r = e.force || e.pressure || e.webkitForce || 0;
  var o = {
    x: e.pageX,
    y: e.pageY
  };
  var l = t.getOrCreate(s, o);
  if (l.identifier !== s) {
    t.manager.removeIdentifier(l.identifier);
  }
  l.identifier = s;
  function c(f) {
    f.trigger("start", f);
    t.trigger("start " + f.id + ":start", f);
    f.show();
    if (r > 0) {
      t.pressureFn(e, f, f.identifier);
    }
    t.processOnMove(e);
  }
  if ((n = t.idles.indexOf(l)) >= 0) {
    t.idles.splice(n, 1);
  }
  t.actives.push(l);
  t.ids.push(l.identifier);
  if (i.mode !== "semi") {
    c(l);
  } else {
    var a = hn(o, l.position);
    if (a <= i.catchDistance) {
      c(l);
    } else {
      l.destroy();
      t.processOnStart(e);
      return;
    }
  }
  return l;
};
ke.prototype.getOrCreate = function (e, t) {
  var i = this;
  var n = i.options;
  var s;
  if (/(semi|static)/.test(n.mode)) {
    s = i.idles[0];
    if (s) {
      i.idles.splice(0, 1);
      return s;
    } else if (n.mode === "semi") {
      return i.createNipple(t, e);
    } else {
      console.warn("Coudln't find the needed nipple.");
      return false;
    }
  } else {
    s = i.createNipple(t, e);
    return s;
  }
};
ke.prototype.processOnMove = function (e) {
  var t = this;
  var i = t.options;
  var n = t.manager.getIdentifier(e);
  var s = t.nipples.get(n);
  var r = t.manager.scroll;
  if (!Du(e)) {
    this.processOnEnd(e);
    return;
  }
  if (!s) {
    console.error("Found zombie joystick with ID " + n);
    t.manager.removeIdentifier(n);
    return;
  }
  if (i.dynamicPage) {
    var o = s.el.getBoundingClientRect();
    s.position = {
      x: r.x + o.left,
      y: r.y + o.top
    };
  }
  s.identifier = n;
  var l = s.options.size / 2;
  var c = {
    x: e.pageX,
    y: e.pageY
  };
  if (i.lockX) {
    c.y = s.position.y;
  }
  if (i.lockY) {
    c.x = s.position.x;
  }
  var a = hn(c, s.position);
  var f = $u(c, s.position);
  var d = Cs(f);
  var u = a / l;
  var p = {
    distance: a,
    position: c
  };
  var w;
  var x;
  if (s.options.shape === "circle") {
    w = Math.min(a, l);
    x = Ru(s.position, w, f);
  } else {
    x = zu(c, s.position, l);
    w = hn(x, s.position);
  }
  if (i.follow) {
    if (a > l) {
      let S = c.x - x.x;
      let R = c.y - x.y;
      s.position.x += S;
      s.position.y += R;
      s.el.style.top = s.position.y - (t.box.top + r.y) + "px";
      s.el.style.left = s.position.x - (t.box.left + r.x) + "px";
      a = hn(c, s.position);
    }
  } else {
    c = x;
    a = w;
  }
  var b = c.x - s.position.x;
  var $ = c.y - s.position.y;
  s.frontPosition = {
    x: b,
    y: $
  };
  if (!i.dataOnly) {
    s.ui.front.style.transform = "translate(" + b + "px," + $ + "px)";
  }
  var v = {
    identifier: s.identifier,
    position: c,
    force: u,
    pressure: e.force || e.pressure || e.webkitForce || 0,
    distance: a,
    angle: {
      radian: d,
      degree: f
    },
    vector: {
      x: b / l,
      y: -$ / l
    },
    raw: p,
    instance: s,
    lockX: i.lockX,
    lockY: i.lockY
  };
  v = s.computeDirection(v);
  v.angle = {
    radian: Cs(180 - f),
    degree: 180 - f
  };
  s.trigger("move", v);
  t.trigger("move " + s.id + ":move", v);
};
ke.prototype.processOnEnd = function (e) {
  var t = this;
  var i = t.options;
  var n = t.manager.getIdentifier(e);
  var s = t.nipples.get(n);
  var r = t.manager.removeIdentifier(s.identifier);
  if (s) {
    if (!i.dataOnly) {
      s.hide(function () {
        if (i.mode === "dynamic") {
          s.trigger("removed", s);
          t.trigger("removed " + s.id + ":removed", s);
          t.manager.trigger("removed " + s.id + ":removed", s);
          s.destroy();
        }
      });
    }
    clearInterval(t.pressureIntervals[s.identifier]);
    s.resetDirection();
    s.trigger("end", s);
    t.trigger("end " + s.id + ":end", s);
    if (t.ids.indexOf(s.identifier) >= 0) {
      t.ids.splice(t.ids.indexOf(s.identifier), 1);
    }
    if (t.actives.indexOf(s) >= 0) {
      t.actives.splice(t.actives.indexOf(s), 1);
    }
    if (/(semi|static)/.test(i.mode)) {
      t.idles.push(s);
    } else if (t.nipples.indexOf(s) >= 0) {
      t.nipples.splice(t.nipples.indexOf(s), 1);
    }
    t.manager.unbindDocument();
    if (/(semi|static)/.test(i.mode)) {
      t.manager.ids[r.id] = r.identifier;
    }
  }
};
ke.prototype.onDestroyed = function (e, t) {
  var i = this;
  if (i.nipples.indexOf(t) >= 0) {
    i.nipples.splice(i.nipples.indexOf(t), 1);
  }
  if (i.actives.indexOf(t) >= 0) {
    i.actives.splice(i.actives.indexOf(t), 1);
  }
  if (i.idles.indexOf(t) >= 0) {
    i.idles.splice(i.idles.indexOf(t), 1);
  }
  if (i.ids.indexOf(t.identifier) >= 0) {
    i.ids.splice(i.ids.indexOf(t.identifier), 1);
  }
  i.manager.removeIdentifier(t.identifier);
  i.manager.unbindDocument();
};
ke.prototype.destroy = function () {
  var e = this;
  e.unbindEvt(e.options.zone, "start");
  e.nipples.forEach(function (i) {
    i.destroy();
  });
  for (var t in e.pressureIntervals) {
    if (e.pressureIntervals.hasOwnProperty(t)) {
      clearInterval(e.pressureIntervals[t]);
    }
  }
  e.trigger("destroyed", e.nipples);
  e.manager.unbindDocument();
  e.off();
};
function Re(e) {
  var t = this;
  t.ids = {};
  t.index = 0;
  t.collections = [];
  t.scroll = Ur();
  t.config(e);
  t.prepareCollections();
  function i() {
    var s;
    t.collections.forEach(function (r) {
      r.forEach(function (o) {
        s = o.el.getBoundingClientRect();
        o.position = {
          x: t.scroll.x + s.left,
          y: t.scroll.y + s.top
        };
      });
    });
  }
  wn(window, "resize", function () {
    Vr(i);
  });
  function n() {
    t.scroll = Ur();
  }
  wn(window, "scroll", function () {
    Vr(n);
  });
  return t.collections;
}
Re.prototype = new dt();
Re.constructor = Re;
Re.prototype.prepareCollections = function () {
  var e = this;
  e.collections.create = e.create.bind(e);
  e.collections.on = e.on.bind(e);
  e.collections.off = e.off.bind(e);
  e.collections.destroy = e.destroy.bind(e);
  e.collections.get = function (t) {
    var i;
    e.collections.every(function (n) {
      i = n.get(t);
      return !i;
    });
    return i;
  };
};
Re.prototype.create = function (e) {
  return this.createCollection(e);
};
Re.prototype.createCollection = function (e) {
  var t = this;
  var i = new ke(t, e);
  t.bindCollection(i);
  t.collections.push(i);
  return i;
};
Re.prototype.bindCollection = function (e) {
  var t = this;
  var i;
  function n(s, r) {
    i = s.type + " " + r.id + ":" + s.type;
    t.trigger(i, r);
  }
  e.on("destroyed", t.onDestroyed.bind(t));
  e.on("shown hidden rested dir plain", n);
  e.on("dir:up dir:right dir:down dir:left", n);
  e.on("plain:up plain:right plain:down plain:left", n);
};
Re.prototype.bindDocument = function () {
  var e = this;
  if (!e.binded) {
    e.bindEvt(document, "move").bindEvt(document, "end");
    e.binded = true;
  }
};
Re.prototype.unbindDocument = function (e) {
  var t = this;
  if (!Object.keys(t.ids).length || e === true) {
    t.unbindEvt(document, "move").unbindEvt(document, "end");
    t.binded = false;
  }
};
Re.prototype.getIdentifier = function (e) {
  var t;
  if (e) {
    t = e.identifier === undefined ? e.pointerId : e.identifier;
    if (t === undefined) {
      t = this.latest || 0;
    }
  } else {
    t = this.index;
  }
  if (this.ids[t] === undefined) {
    this.ids[t] = this.index;
    this.index += 1;
  }
  this.latest = t;
  return this.ids[t];
};
Re.prototype.removeIdentifier = function (e) {
  var t = {};
  for (var i in this.ids) {
    if (this.ids[i] === e) {
      t.id = i;
      t.identifier = this.ids[i];
      delete this.ids[i];
      break;
    }
  }
  return t;
};
Re.prototype.onmove = function (e) {
  var t = this;
  t.onAny("move", e);
  return false;
};
Re.prototype.onend = function (e) {
  var t = this;
  t.onAny("end", e);
  return false;
};
Re.prototype.oncancel = function (e) {
  var t = this;
  t.onAny("end", e);
  return false;
};
Re.prototype.onAny = function (e, t) {
  var i = this;
  var n;
  var s = "processOn" + e.charAt(0).toUpperCase() + e.slice(1);
  t = fa(t);
  function r(l, c, a) {
    if (a.ids.indexOf(c) >= 0) {
      a[s](l);
      l._found_ = true;
    }
  }
  function o(l) {
    n = i.getIdentifier(l);
    Ps(i.collections, r.bind(null, l, n));
    if (!l._found_) {
      i.removeIdentifier(n);
    }
  }
  Ps(t, o);
  return false;
};
Re.prototype.destroy = function () {
  var e = this;
  e.unbindDocument(true);
  e.ids = {};
  e.index = 0;
  e.collections.forEach(function (t) {
    t.destroy();
  });
  e.off();
};
Re.prototype.onDestroyed = function (e, t) {
  var i = this;
  if (i.collections.indexOf(t) < 0) {
    return false;
  }
  i.collections.splice(i.collections.indexOf(t), 1);
};
const Xr = new Re();
const qr = {
  create: function (e) {
    return Xr.create(e);
  },
  factory: Xr
};
let Gr = false;
const Fu = e => {
  if (Gr) {
    return;
  }
  Gr = true;
  const t = document.getElementById("touch-controls-left");
  const i = qr.create({
    zone: t
  });
  i.on("start", e.onStartMoving);
  i.on("end", e.onStopMoving);
  i.on("move", e.onRotateMoving);
  const n = document.getElementById("touch-controls-right");
  const s = qr.create({
    zone: n
  });
  s.on("start", e.onStartAttacking);
  s.on("end", e.onStopAttacking);
  s.on("move", e.onRotateAttacking);
  t.style.display = "block";
  n.style.display = "block";
};
const Vu = {
  enable: Fu
};
var Nu = Object.defineProperty;
var Uu = (e, t, i) => t in e ? Nu(e, t, {
  enumerable: true,
  configurable: true,
  writable: true,
  value: i
}) : e[t] = i;
var Ge = (e, t, i) => Uu(e, typeof t != "symbol" ? t + "" : t, i);
const pa = "KGZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2NvbnN0IGY9bmV3IFRleHRFbmNvZGVyO2Z1bmN0aW9uIHAoZSl7cmV0dXJuWy4uLm5ldyBVaW50OEFycmF5KGUpXS5tYXAodD0+dC50b1N0cmluZygxNikucGFkU3RhcnQoMiwiMCIpKS5qb2luKCIiKX1hc3luYyBmdW5jdGlvbiB3KGUsdCxyKXtyZXR1cm4gcChhd2FpdCBjcnlwdG8uc3VidGxlLmRpZ2VzdChyLnRvVXBwZXJDYXNlKCksZi5lbmNvZGUoZSt0KSkpfWZ1bmN0aW9uIGIoZSx0LHI9IlNIQS0yNTYiLG49MWU2LHM9MCl7Y29uc3Qgbz1uZXcgQWJvcnRDb250cm9sbGVyLGE9RGF0ZS5ub3coKTtyZXR1cm57cHJvbWlzZTooYXN5bmMoKT0+e2ZvcihsZXQgYz1zO2M8PW47Yys9MSl7aWYoby5zaWduYWwuYWJvcnRlZClyZXR1cm4gbnVsbDtpZihhd2FpdCB3KHQsYyxyKT09PWUpcmV0dXJue251bWJlcjpjLHRvb2s6RGF0ZS5ub3coKS1hfX1yZXR1cm4gbnVsbH0pKCksY29udHJvbGxlcjpvfX1mdW5jdGlvbiBoKGUpe2NvbnN0IHQ9YXRvYihlKSxyPW5ldyBVaW50OEFycmF5KHQubGVuZ3RoKTtmb3IobGV0IG49MDtuPHQubGVuZ3RoO24rKylyW25dPXQuY2hhckNvZGVBdChuKTtyZXR1cm4gcn1mdW5jdGlvbiBnKGUsdD0xMil7Y29uc3Qgcj1uZXcgVWludDhBcnJheSh0KTtmb3IobGV0IG49MDtuPHQ7bisrKXJbbl09ZSUyNTYsZT1NYXRoLmZsb29yKGUvMjU2KTtyZXR1cm4gcn1hc3luYyBmdW5jdGlvbiBtKGUsdD0iIixyPTFlNixuPTApe2NvbnN0IHM9IkFFUy1HQ00iLG89bmV3IEFib3J0Q29udHJvbGxlcixhPURhdGUubm93KCksbD1hc3luYygpPT57Zm9yKGxldCB1PW47dTw9cjt1Kz0xKXtpZihvLnNpZ25hbC5hYm9ydGVkfHwhY3x8IXkpcmV0dXJuIG51bGw7dHJ5e2NvbnN0IGQ9YXdhaXQgY3J5cHRvLnN1YnRsZS5kZWNyeXB0KHtuYW1lOnMsaXY6Zyh1KX0sYyx5KTtpZihkKXJldHVybntjbGVhclRleHQ6bmV3IFRleHREZWNvZGVyKCkuZGVjb2RlKGQpLHRvb2s6RGF0ZS5ub3coKS1hfX1jYXRjaHt9fXJldHVybiBudWxsfTtsZXQgYz1udWxsLHk9bnVsbDt0cnl7eT1oKGUpO2NvbnN0IHU9YXdhaXQgY3J5cHRvLnN1YnRsZS5kaWdlc3QoIlNIQS0yNTYiLGYuZW5jb2RlKHQpKTtjPWF3YWl0IGNyeXB0by5zdWJ0bGUuaW1wb3J0S2V5KCJyYXciLHUscywhMSxbImRlY3J5cHQiXSl9Y2F0Y2h7cmV0dXJue3Byb21pc2U6UHJvbWlzZS5yZWplY3QoKSxjb250cm9sbGVyOm99fXJldHVybntwcm9taXNlOmwoKSxjb250cm9sbGVyOm99fWxldCBpO29ubWVzc2FnZT1hc3luYyBlPT57Y29uc3R7dHlwZTp0LHBheWxvYWQ6cixzdGFydDpuLG1heDpzfT1lLmRhdGE7bGV0IG89bnVsbDtpZih0PT09ImFib3J0IilpPT1udWxsfHxpLmFib3J0KCksaT12b2lkIDA7ZWxzZSBpZih0PT09IndvcmsiKXtpZigib2JmdXNjYXRlZCJpbiByKXtjb25zdHtrZXk6YSxvYmZ1c2NhdGVkOmx9PXJ8fHt9O289YXdhaXQgbShsLGEscyxuKX1lbHNle2NvbnN0e2FsZ29yaXRobTphLGNoYWxsZW5nZTpsLHNhbHQ6Y309cnx8e307bz1iKGwsYyxhLHMsbil9aT1vLmNvbnRyb2xsZXIsby5wcm9taXNlLnRoZW4oYT0+e3NlbGYucG9zdE1lc3NhZ2UoYSYmey4uLmEsd29ya2VyOiEwfSl9KX19fSkoKTsK";
const Wu = e => Uint8Array.from(atob(e), t => t.charCodeAt(0));
const Yr = typeof self !== "undefined" && self.Blob && new Blob([Wu(pa)], {
  type: "text/javascript;charset=utf-8"
});
function Xu(e) {
  let t;
  try {
    t = Yr && (self.URL || self.webkitURL).createObjectURL(Yr);
    if (!t) {
      throw "";
    }
    const i = new Worker(t, {
      name: e == null ? undefined : e.name
    });
    i.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    });
    return i;
  } catch {
    return new Worker("data:text/javascript;base64," + pa, {
      name: e == null ? undefined : e.name
    });
  } finally {
    if (t) {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }
  }
}
function vn() {}
function qu(e, t) {
  for (const i in t) {
    e[i] = t[i];
  }
  return e;
}
function ma(e) {
  return e();
}
function Kr() {
  return Object.create(null);
}
function Ji(e) {
  e.forEach(ma);
}
function ga(e) {
  return typeof e == "function";
}
function Gu(e, t) {
  if (e != e) {
    return t == t;
  } else {
    return e !== t || e && typeof e == "object" || typeof e == "function";
  }
}
function Yu(e) {
  return Object.keys(e).length === 0;
}
function Ku(e, t, i, n) {
  if (e) {
    const s = ya(e, t, i, n);
    return e[0](s);
  }
}
function ya(e, t, i, n) {
  if (e[1] && n) {
    return qu(i.ctx.slice(), e[1](n(t)));
  } else {
    return i.ctx;
  }
}
function Zu(e, t, i, n) {
  if (e[2] && n) {
    const s = e[2](n(i));
    if (t.dirty === undefined) {
      return s;
    }
    if (typeof s == "object") {
      const r = [];
      const o = Math.max(t.dirty.length, s.length);
      for (let l = 0; l < o; l += 1) {
        r[l] = t.dirty[l] | s[l];
      }
      return r;
    }
    return t.dirty | s;
  }
  return t.dirty;
}
function Ju(e, t, i, n, s, r) {
  if (s) {
    const o = ya(t, i, n, r);
    e.p(o, s);
  }
}
function Qu(e) {
  if (e.ctx.length > 32) {
    const t = [];
    const i = e.ctx.length / 32;
    for (let n = 0; n < i; n++) {
      t[n] = -1;
    }
    return t;
  }
  return -1;
}
function we(e, t) {
  e.appendChild(t);
}
function ju(e, t, i) {
  const n = ef(e);
  if (!n.getElementById(t)) {
    const s = Me("style");
    s.id = t;
    s.textContent = i;
    tf(n, s);
  }
}
function ef(e) {
  if (!e) {
    return document;
  }
  const t = e.getRootNode ? e.getRootNode() : e.ownerDocument;
  if (t && t.host) {
    return t;
  } else {
    return e.ownerDocument;
  }
}
function tf(e, t) {
  we(e.head || e, t);
  return t.sheet;
}
function He(e, t, i) {
  e.insertBefore(t, i || null);
}
function _e(e) {
  if (e.parentNode) {
    e.parentNode.removeChild(e);
  }
}
function Me(e) {
  return document.createElement(e);
}
function ht(e) {
  return document.createElementNS("http://www.w3.org/2000/svg", e);
}
function nf(e) {
  return document.createTextNode(e);
}
function rt() {
  return nf(" ");
}
function ls(e, t, i, n) {
  e.addEventListener(t, i, n);
  return () => e.removeEventListener(t, i, n);
}
function H(e, t, i) {
  if (i == null) {
    e.removeAttribute(t);
  } else if (e.getAttribute(t) !== i) {
    e.setAttribute(t, i);
  }
}
function sf(e) {
  return Array.from(e.childNodes);
}
function Zr(e, t, i) {
  e.classList.toggle(t, !!i);
}
function rf(e, t, {
  bubbles: i = false,
  cancelable: n = false
} = {}) {
  return new CustomEvent(e, {
    detail: t,
    bubbles: i,
    cancelable: n
  });
}
function of(e) {
  const t = {};
  e.childNodes.forEach(i => {
    t[i.slot || "default"] = true;
  });
  return t;
}
let Xi;
function zi(e) {
  Xi = e;
}
function ir() {
  if (!Xi) {
    throw new Error("Function called outside component initialization");
  }
  return Xi;
}
function af(e) {
  ir().$$.on_mount.push(e);
}
function lf(e) {
  ir().$$.on_destroy.push(e);
}
function cf() {
  const e = ir();
  return (t, i, {
    cancelable: n = false
  } = {}) => {
    const s = e.$$.callbacks[t];
    if (s) {
      const r = rf(t, i, {
        cancelable: n
      });
      s.slice().forEach(o => {
        o.call(e, r);
      });
      return !r.defaultPrevented;
    }
    return true;
  };
}
const Qt = [];
const kn = [];
let ci = [];
const Jr = [];
const wa = Promise.resolve();
let $s = false;
function va() {
  if (!$s) {
    $s = true;
    wa.then(ce);
  }
}
function hf() {
  va();
  return wa;
}
function Rs(e) {
  ci.push(e);
}
const cs = new Set();
let Xt = 0;
function ce() {
  if (Xt !== 0) {
    return;
  }
  const e = Xi;
  do {
    try {
      for (; Xt < Qt.length;) {
        const t = Qt[Xt];
        Xt++;
        zi(t);
        uf(t.$$);
      }
    } catch (t) {
      Qt.length = 0;
      Xt = 0;
      throw t;
    }
    zi(null);
    Qt.length = 0;
    Xt = 0;
    for (; kn.length;) {
      kn.pop()();
    }
    for (let t = 0; t < ci.length; t += 1) {
      const i = ci[t];
      if (!cs.has(i)) {
        cs.add(i);
        i();
      }
    }
    ci.length = 0;
  } while (Qt.length);
  for (; Jr.length;) {
    Jr.pop()();
  }
  $s = false;
  cs.clear();
  zi(e);
}
function uf(e) {
  if (e.fragment !== null) {
    e.update();
    Ji(e.before_update);
    const t = e.dirty;
    e.dirty = [-1];
    if (e.fragment) {
      e.fragment.p(e.ctx, t);
    }
    e.after_update.forEach(Rs);
  }
}
function ff(e) {
  const t = [];
  const i = [];
  ci.forEach(n => e.indexOf(n) === -1 ? t.push(n) : i.push(n));
  i.forEach(n => n());
  ci = t;
}
const un = new Set();
let df;
function ka(e, t) {
  if (e && e.i) {
    un.delete(e);
    e.i(t);
  }
}
function pf(e, t, i, n) {
  if (e && e.o) {
    if (un.has(e)) {
      return;
    }
    un.add(e);
    df.c.push(() => {
      un.delete(e);
    });
    e.o(t);
  }
}
function mf(e, t, i) {
  const {
    fragment: n,
    after_update: s
  } = e.$$;
  if (n) {
    n.m(t, i);
  }
  Rs(() => {
    const r = e.$$.on_mount.map(ma).filter(ga);
    if (e.$$.on_destroy) {
      e.$$.on_destroy.push(...r);
    } else {
      Ji(r);
    }
    e.$$.on_mount = [];
  });
  s.forEach(Rs);
}
function gf(e, t) {
  const i = e.$$;
  if (i.fragment !== null) {
    ff(i.after_update);
    Ji(i.on_destroy);
    if (i.fragment) {
      i.fragment.d(t);
    }
    i.on_destroy = i.fragment = null;
    i.ctx = [];
  }
}
function yf(e, t) {
  if (e.$$.dirty[0] === -1) {
    Qt.push(e);
    va();
    e.$$.dirty.fill(0);
  }
  e.$$.dirty[t / 31 | 0] |= 1 << t % 31;
}
function wf(e, t, i, n, s, r, o = null, l = [-1]) {
  const c = Xi;
  zi(e);
  const a = e.$$ = {
    fragment: null,
    ctx: [],
    props: r,
    update: vn,
    not_equal: s,
    bound: Kr(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(t.context || (c ? c.$$.context : [])),
    callbacks: Kr(),
    dirty: l,
    skip_bound: false,
    root: t.target || c.$$.root
  };
  if (o) {
    o(a.root);
  }
  let f = false;
  a.ctx = i ? i(e, t.props || {}, (d, u, ...p) => {
    const w = p.length ? p[0] : u;
    if (a.ctx && s(a.ctx[d], a.ctx[d] = w)) {
      if (!a.skip_bound && a.bound[d]) {
        a.bound[d](w);
      }
      if (f) {
        yf(e, d);
      }
    }
    return u;
  }) : [];
  a.update();
  f = true;
  Ji(a.before_update);
  a.fragment = n ? n(a.ctx) : false;
  if (t.target) {
    if (t.hydrate) {
      const d = sf(t.target);
      if (a.fragment) {
        a.fragment.l(d);
      }
      d.forEach(_e);
    } else if (a.fragment) {
      a.fragment.c();
    }
    if (t.intro) {
      ka(e.$$.fragment);
    }
    mf(e, t.target, t.anchor);
    ce();
  }
  zi(c);
}
let xa;
if (typeof HTMLElement == "function") {
  xa = class extends HTMLElement {
    constructor(e, t, i) {
      super();
      Ge(this, "$$ctor");
      Ge(this, "$$s");
      Ge(this, "$$c");
      Ge(this, "$$cn", false);
      Ge(this, "$$d", {});
      Ge(this, "$$r", false);
      Ge(this, "$$p_d", {});
      Ge(this, "$$l", {});
      Ge(this, "$$l_u", new Map());
      this.$$ctor = e;
      this.$$s = t;
      if (i) {
        this.attachShadow({
          mode: "open"
        });
      }
    }
    addEventListener(e, t, i) {
      this.$$l[e] = this.$$l[e] || [];
      this.$$l[e].push(t);
      if (this.$$c) {
        const n = this.$$c.$on(e, t);
        this.$$l_u.set(t, n);
      }
      super.addEventListener(e, t, i);
    }
    removeEventListener(e, t, i) {
      super.removeEventListener(e, t, i);
      if (this.$$c) {
        const n = this.$$l_u.get(t);
        if (n) {
          n();
          this.$$l_u.delete(t);
        }
      }
      if (this.$$l[e]) {
        const n = this.$$l[e].indexOf(t);
        if (n >= 0) {
          this.$$l[e].splice(n, 1);
        }
      }
    }
    async connectedCallback() {
      this.$$cn = true;
      if (!this.$$c) {
        let e = function (s) {
          return () => {
            let r;
            return {
              c: function () {
                r = Me("slot");
                if (s !== "default") {
                  H(r, "name", s);
                }
              },
              m: function (o, l) {
                He(o, r, l);
              },
              d: function (o) {
                if (o) {
                  _e(r);
                }
              }
            };
          };
        };
        await Promise.resolve();
        if (!this.$$cn || this.$$c) {
          return;
        }
        const t = {};
        const i = of(this);
        for (const s of this.$$s) {
          if (s in i) {
            t[s] = [e(s)];
          }
        }
        for (const s of this.attributes) {
          const r = this.$$g_p(s.name);
          if (!(r in this.$$d)) {
            this.$$d[r] = fn(r, s.value, this.$$p_d, "toProp");
          }
        }
        for (const s in this.$$p_d) {
          if (!(s in this.$$d) && this[s] !== undefined) {
            this.$$d[s] = this[s];
            delete this[s];
          }
        }
        this.$$c = new this.$$ctor({
          target: this.shadowRoot || this,
          props: {
            ...this.$$d,
            $$slots: t,
            $$scope: {
              ctx: []
            }
          }
        });
        const n = () => {
          this.$$r = true;
          for (const s in this.$$p_d) {
            this.$$d[s] = this.$$c.$$.ctx[this.$$c.$$.props[s]];
            if (this.$$p_d[s].reflect) {
              const r = fn(s, this.$$d[s], this.$$p_d, "toAttribute");
              if (r == null) {
                this.removeAttribute(this.$$p_d[s].attribute || s);
              } else {
                this.setAttribute(this.$$p_d[s].attribute || s, r);
              }
            }
          }
          this.$$r = false;
        };
        this.$$c.$$.after_update.push(n);
        n();
        for (const s in this.$$l) {
          for (const r of this.$$l[s]) {
            const o = this.$$c.$on(s, r);
            this.$$l_u.set(r, o);
          }
        }
        this.$$l = {};
      }
    }
    attributeChangedCallback(e, t, i) {
      var n;
      if (!this.$$r) {
        e = this.$$g_p(e);
        this.$$d[e] = fn(e, i, this.$$p_d, "toProp");
        if (!((n = this.$$c) == null)) {
          n.$set({
            [e]: this.$$d[e]
          });
        }
      }
    }
    disconnectedCallback() {
      this.$$cn = false;
      Promise.resolve().then(() => {
        if (!this.$$cn && this.$$c) {
          this.$$c.$destroy();
          this.$$c = undefined;
        }
      });
    }
    $$g_p(e) {
      return Object.keys(this.$$p_d).find(t => this.$$p_d[t].attribute === e || !this.$$p_d[t].attribute && t.toLowerCase() === e) || e;
    }
  };
}
function fn(e, t, i, n) {
  var s;
  const r = (s = i[e]) == null ? undefined : s.type;
  t = r === "Boolean" && typeof t != "boolean" ? t != null : t;
  if (!n || !i[e]) {
    return t;
  }
  if (n === "toAttribute") {
    switch (r) {
      case "Object":
      case "Array":
        if (t == null) {
          return null;
        } else {
          return JSON.stringify(t);
        }
      case "Boolean":
        if (t) {
          return "";
        } else {
          return null;
        }
      case "Number":
        return t ?? null;
      default:
        return t;
    }
  } else {
    switch (r) {
      case "Object":
      case "Array":
        return t && JSON.parse(t);
      case "Boolean":
        return t;
      case "Number":
        if (t != null) {
          return +t;
        } else {
          return t;
        }
      default:
        return t;
    }
  }
}
function vf(e, t, i, n, s, r) {
  let o = class extends xa {
    constructor() {
      super(e, i, s);
      this.$$p_d = t;
    }
    static get observedAttributes() {
      return Object.keys(t).map(l => (t[l].attribute || l).toLowerCase());
    }
  };
  Object.keys(t).forEach(l => {
    Object.defineProperty(o.prototype, l, {
      get() {
        if (this.$$c && l in this.$$c) {
          return this.$$c[l];
        } else {
          return this.$$d[l];
        }
      },
      set(c) {
        var a;
        c = fn(l, c, t);
        this.$$d[l] = c;
        if (!((a = this.$$c) == null)) {
          a.$set({
            [l]: c
          });
        }
      }
    });
  });
  n.forEach(l => {
    Object.defineProperty(o.prototype, l, {
      get() {
        var c;
        if ((c = this.$$c) == null) {
          return undefined;
        } else {
          return c[l];
        }
      }
    });
  });
  e.element = o;
  return o;
}
class kf {
  constructor() {
    Ge(this, "$$");
    Ge(this, "$$set");
  }
  $destroy() {
    gf(this, 1);
    this.$destroy = vn;
  }
  $on(t, i) {
    if (!ga(i)) {
      return vn;
    }
    const n = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    n.push(i);
    return () => {
      const s = n.indexOf(i);
      if (s !== -1) {
        n.splice(s, 1);
      }
    };
  }
  $set(t) {
    if (this.$$set && !Yu(t)) {
      this.$$.skip_bound = true;
      this.$$set(t);
      this.$$.skip_bound = false;
    }
  }
}
const xf = "4";
if (typeof window !== "undefined") {
  (window.__svelte || (window.__svelte = {
    v: new Set()
  })).v.add(xf);
}
const ba = new TextEncoder();
function bf(e) {
  return [...new Uint8Array(e)].map(t => t.toString(16).padStart(2, "0")).join("");
}
async function Sf(e, t = "SHA-256", i = 100000) {
  const n = Date.now().toString(16);
  if (!e) {
    e = Math.round(Math.random() * i);
  }
  const s = await Sa(n, e, t);
  return {
    algorithm: t,
    challenge: s,
    salt: n,
    signature: ""
  };
}
async function Sa(e, t, i) {
  return bf(await crypto.subtle.digest(i.toUpperCase(), ba.encode(e + t)));
}
function If(e, t, i = "SHA-256", n = 1000000, s = 0) {
  const r = new AbortController();
  const o = Date.now();
  return {
    promise: (async () => {
      for (let l = s; l <= n; l += 1) {
        if (r.signal.aborted) {
          return null;
        }
        if ((await Sa(t, l, i)) === e) {
          return {
            number: l,
            took: Date.now() - o
          };
        }
      }
      return null;
    })(),
    controller: r
  };
}
function Tf() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {}
}
function Mf(e) {
  const t = atob(e);
  const i = new Uint8Array(t.length);
  for (let n = 0; n < t.length; n++) {
    i[n] = t.charCodeAt(n);
  }
  return i;
}
function Ef(e, t = 12) {
  const i = new Uint8Array(t);
  for (let n = 0; n < t; n++) {
    i[n] = e % 256;
    e = Math.floor(e / 256);
  }
  return i;
}
async function Cf(e, t = "", i = 1000000, n = 0) {
  const s = "AES-GCM";
  const r = new AbortController();
  const o = Date.now();
  const l = async () => {
    for (let f = n; f <= i; f += 1) {
      if (r.signal.aborted || !c || !a) {
        return null;
      }
      try {
        const d = await crypto.subtle.decrypt({
          name: s,
          iv: Ef(f)
        }, c, a);
        if (d) {
          return {
            clearText: new TextDecoder().decode(d),
            took: Date.now() - o
          };
        }
      } catch {}
    }
    return null;
  };
  let c = null;
  let a = null;
  try {
    a = Mf(e);
    const f = await crypto.subtle.digest("SHA-256", ba.encode(t));
    c = await crypto.subtle.importKey("raw", f, s, false, ["decrypt"]);
  } catch {
    return {
      promise: Promise.reject(),
      controller: r
    };
  }
  return {
    promise: l(),
    controller: r
  };
}
var Q = (e => {
  e.ERROR = "error";
  e.VERIFIED = "verified";
  e.VERIFYING = "verifying";
  e.UNVERIFIED = "unverified";
  e.EXPIRED = "expired";
  return e;
})(Q || {});
function Pf(e) {
  ju(e, "svelte-ddsc3z", ".altcha.svelte-ddsc3z.svelte-ddsc3z{background:var(--altcha-color-base, transparent);border:var(--altcha-border-width, 1px) solid var(--altcha-color-border, #a0a0a0);border-radius:var(--altcha-border-radius, 3px);color:var(--altcha-color-text, currentColor);display:flex;flex-direction:column;max-width:var(--altcha-max-width, 260px);position:relative;text-align:left}.altcha.svelte-ddsc3z.svelte-ddsc3z:focus-within{border-color:var(--altcha-color-border-focus, currentColor)}.altcha[data-floating].svelte-ddsc3z.svelte-ddsc3z{background:var(--altcha-color-base, white);display:none;filter:drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.2));left:-100%;position:fixed;top:-100%;width:var(--altcha-max-width, 260px);z-index:999999}.altcha[data-floating=top].svelte-ddsc3z .altcha-anchor-arrow.svelte-ddsc3z{border-bottom-color:transparent;border-top-color:var(--altcha-color-border, #a0a0a0);bottom:-12px;top:auto}.altcha[data-floating=bottom].svelte-ddsc3z.svelte-ddsc3z:focus-within::after{border-bottom-color:var(--altcha-color-border-focus, currentColor)}.altcha[data-floating=top].svelte-ddsc3z.svelte-ddsc3z:focus-within::after{border-top-color:var(--altcha-color-border-focus, currentColor)}.altcha[data-floating].svelte-ddsc3z.svelte-ddsc3z:not([data-state=unverified]){display:block}.altcha-anchor-arrow.svelte-ddsc3z.svelte-ddsc3z{border:6px solid transparent;border-bottom-color:var(--altcha-color-border, #a0a0a0);content:\"\";height:0;left:12px;position:absolute;top:-12px;width:0}.altcha-main.svelte-ddsc3z.svelte-ddsc3z{align-items:center;display:flex;gap:0.4rem;padding:0.7rem}.altcha-label.svelte-ddsc3z.svelte-ddsc3z{flex-grow:1}.altcha-label.svelte-ddsc3z label.svelte-ddsc3z{cursor:pointer}.altcha-logo.svelte-ddsc3z.svelte-ddsc3z{color:currentColor;opacity:0.3}.altcha-logo.svelte-ddsc3z.svelte-ddsc3z:hover{opacity:1}.altcha-error.svelte-ddsc3z.svelte-ddsc3z{color:var(--altcha-color-error-text, #f23939);display:flex;font-size:0.85rem;gap:0.3rem;padding:0 0.7rem 0.7rem}.altcha-footer.svelte-ddsc3z.svelte-ddsc3z{align-items:center;background-color:var(--altcha-color-footer-bg, transparent);display:flex;font-size:0.75rem;opacity:0.4;padding:0.2rem 0.7rem;text-align:right}.altcha-footer.svelte-ddsc3z.svelte-ddsc3z:hover{opacity:1}.altcha-footer.svelte-ddsc3z>.svelte-ddsc3z:first-child{flex-grow:1}.altcha-footer.svelte-ddsc3z a{color:currentColor}.altcha-checkbox.svelte-ddsc3z.svelte-ddsc3z{display:flex;align-items:center;height:24px;width:24px}.altcha-checkbox.svelte-ddsc3z input.svelte-ddsc3z{width:18px;height:18px;margin:0}.altcha-hidden.svelte-ddsc3z.svelte-ddsc3z{display:none}.altcha-spinner.svelte-ddsc3z.svelte-ddsc3z{animation:svelte-ddsc3z-altcha-spinner 0.75s infinite linear;transform-origin:center}@keyframes svelte-ddsc3z-altcha-spinner{100%{transform:rotate(360deg)}}");
}
function Qr(e) {
  let t;
  let i;
  let n;
  return {
    c() {
      t = ht("svg");
      i = ht("path");
      n = ht("path");
      H(i, "d", "M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z");
      H(i, "fill", "currentColor");
      H(i, "opacity", ".25");
      H(n, "d", "M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z");
      H(n, "fill", "currentColor");
      H(n, "class", "altcha-spinner svelte-ddsc3z");
      H(t, "width", "24");
      H(t, "height", "24");
      H(t, "viewBox", "0 0 24 24");
      H(t, "xmlns", "http://www.w3.org/2000/svg");
    },
    m(s, r) {
      He(s, t, r);
      we(t, i);
      we(t, n);
    },
    d(s) {
      if (s) {
        _e(t);
      }
    }
  };
}
function $f(e) {
  let t;
  let i = e[11].label + "";
  let n;
  return {
    c() {
      t = Me("label");
      H(t, "for", n = e[4] + "_checkbox");
      H(t, "class", "svelte-ddsc3z");
    },
    m(s, r) {
      He(s, t, r);
      t.innerHTML = i;
    },
    p(s, r) {
      if (r[0] & 2048 && i !== (i = s[11].label + "")) {
        t.innerHTML = i;
      }
      if (r[0] & 16 && n !== (n = s[4] + "_checkbox")) {
        H(t, "for", n);
      }
    },
    d(s) {
      if (s) {
        _e(t);
      }
    }
  };
}
function Rf(e) {
  let t;
  let i = e[11].verifying + "";
  return {
    c() {
      t = Me("span");
    },
    m(n, s) {
      He(n, t, s);
      t.innerHTML = i;
    },
    p(n, s) {
      if (s[0] & 2048 && i !== (i = n[11].verifying + "")) {
        t.innerHTML = i;
      }
    },
    d(n) {
      if (n) {
        _e(t);
      }
    }
  };
}
function Af(e) {
  let t;
  let i = e[11].verified + "";
  let n;
  let s;
  return {
    c() {
      t = Me("span");
      n = rt();
      s = Me("input");
      H(s, "type", "hidden");
      H(s, "name", e[4]);
      s.value = e[6];
    },
    m(r, o) {
      He(r, t, o);
      t.innerHTML = i;
      He(r, n, o);
      He(r, s, o);
    },
    p(r, o) {
      if (o[0] & 2048 && i !== (i = r[11].verified + "")) {
        t.innerHTML = i;
      }
      if (o[0] & 16) {
        H(s, "name", r[4]);
      }
      if (o[0] & 64) {
        s.value = r[6];
      }
    },
    d(r) {
      if (r) {
        _e(t);
        _e(n);
        _e(s);
      }
    }
  };
}
function jr(e) {
  let t;
  let i;
  let n;
  let s;
  let r;
  let o;
  let l;
  return {
    c() {
      t = Me("div");
      i = Me("a");
      n = ht("svg");
      s = ht("path");
      r = ht("path");
      o = ht("path");
      H(s, "d", "M2.33955 16.4279C5.88954 20.6586 12.1971 21.2105 16.4279 17.6604C18.4699 15.947 19.6548 13.5911 19.9352 11.1365L17.9886 10.4279C17.8738 12.5624 16.909 14.6459 15.1423 16.1284C11.7577 18.9684 6.71167 18.5269 3.87164 15.1423C1.03163 11.7577 1.4731 6.71166 4.8577 3.87164C8.24231 1.03162 13.2883 1.4731 16.1284 4.8577C16.9767 5.86872 17.5322 7.02798 17.804 8.2324L19.9522 9.01429C19.7622 7.07737 19.0059 5.17558 17.6604 3.57212C14.1104 -0.658624 7.80283 -1.21043 3.57212 2.33956C-0.658625 5.88958 -1.21046 12.1971 2.33955 16.4279Z");
      H(s, "fill", "currentColor");
      H(r, "d", "M3.57212 2.33956C1.65755 3.94607 0.496389 6.11731 0.12782 8.40523L2.04639 9.13961C2.26047 7.15832 3.21057 5.25375 4.8577 3.87164C8.24231 1.03162 13.2883 1.4731 16.1284 4.8577L13.8302 6.78606L19.9633 9.13364C19.7929 7.15555 19.0335 5.20847 17.6604 3.57212C14.1104 -0.658624 7.80283 -1.21043 3.57212 2.33956Z");
      H(r, "fill", "currentColor");
      H(o, "d", "M7 10H5C5 12.7614 7.23858 15 10 15C12.7614 15 15 12.7614 15 10H13C13 11.6569 11.6569 13 10 13C8.3431 13 7 11.6569 7 10Z");
      H(o, "fill", "currentColor");
      H(n, "width", "22");
      H(n, "height", "22");
      H(n, "viewBox", "0 0 20 20");
      H(n, "fill", "none");
      H(n, "xmlns", "http://www.w3.org/2000/svg");
      H(i, "href", Ia);
      H(i, "target", "_blank");
      H(i, "class", "altcha-logo svelte-ddsc3z");
      H(i, "aria-label", l = e[11].ariaLinkLabel);
    },
    m(c, a) {
      He(c, t, a);
      we(t, i);
      we(i, n);
      we(n, s);
      we(n, r);
      we(n, o);
    },
    p(c, a) {
      if (a[0] & 2048 && l !== (l = c[11].ariaLinkLabel)) {
        H(i, "aria-label", l);
      }
    },
    d(c) {
      if (c) {
        _e(t);
      }
    }
  };
}
function eo(e) {
  let t;
  let i;
  let n;
  let s;
  function r(c, a) {
    if (c[7] === Q.EXPIRED) {
      return Of;
    } else {
      return Df;
    }
  }
  let o = r(e);
  let l = o(e);
  return {
    c() {
      t = Me("div");
      i = ht("svg");
      n = ht("path");
      s = rt();
      l.c();
      H(n, "stroke-linecap", "round");
      H(n, "stroke-linejoin", "round");
      H(n, "d", "M6 18L18 6M6 6l12 12");
      H(i, "width", "14");
      H(i, "height", "14");
      H(i, "xmlns", "http://www.w3.org/2000/svg");
      H(i, "fill", "none");
      H(i, "viewBox", "0 0 24 24");
      H(i, "stroke-width", "1.5");
      H(i, "stroke", "currentColor");
      H(t, "class", "altcha-error svelte-ddsc3z");
    },
    m(c, a) {
      He(c, t, a);
      we(t, i);
      we(i, n);
      we(t, s);
      l.m(t, null);
    },
    p(c, a) {
      if (o === (o = r(c)) && l) {
        l.p(c, a);
      } else {
        l.d(1);
        l = o(c);
        if (l) {
          l.c();
          l.m(t, null);
        }
      }
    },
    d(c) {
      if (c) {
        _e(t);
      }
      l.d();
    }
  };
}
function Df(e) {
  let t;
  let i = e[11].error + "";
  return {
    c() {
      t = Me("div");
      H(t, "title", e[5]);
    },
    m(n, s) {
      He(n, t, s);
      t.innerHTML = i;
    },
    p(n, s) {
      if (s[0] & 2048 && i !== (i = n[11].error + "")) {
        t.innerHTML = i;
      }
      if (s[0] & 32) {
        H(t, "title", n[5]);
      }
    },
    d(n) {
      if (n) {
        _e(t);
      }
    }
  };
}
function Of(e) {
  let t;
  let i = e[11].expired + "";
  return {
    c() {
      t = Me("div");
      H(t, "title", e[5]);
    },
    m(n, s) {
      He(n, t, s);
      t.innerHTML = i;
    },
    p(n, s) {
      if (s[0] & 2048 && i !== (i = n[11].expired + "")) {
        t.innerHTML = i;
      }
      if (s[0] & 32) {
        H(t, "title", n[5]);
      }
    },
    d(n) {
      if (n) {
        _e(t);
      }
    }
  };
}
function to(e) {
  let t;
  let i;
  let n = e[11].footer + "";
  return {
    c() {
      t = Me("div");
      i = Me("div");
      H(i, "class", "svelte-ddsc3z");
      H(t, "class", "altcha-footer svelte-ddsc3z");
    },
    m(s, r) {
      He(s, t, r);
      we(t, i);
      i.innerHTML = n;
    },
    p(s, r) {
      if (r[0] & 2048 && n !== (n = s[11].footer + "")) {
        i.innerHTML = n;
      }
    },
    d(s) {
      if (s) {
        _e(t);
      }
    }
  };
}
function io(e) {
  let t;
  return {
    c() {
      t = Me("div");
      H(t, "class", "altcha-anchor-arrow svelte-ddsc3z");
    },
    m(i, n) {
      He(i, t, n);
      e[48](t);
    },
    p: vn,
    d(i) {
      if (i) {
        _e(t);
      }
      e[48](null);
    }
  };
}
function _f(e) {
  let t;
  let i;
  let n;
  let s;
  let r;
  let o;
  let l;
  let c;
  let a;
  let f;
  let d;
  let u;
  let p;
  let w;
  let x;
  let b;
  let $;
  const v = e[46].default;
  const S = Ku(v, e, e[45], null);
  let R = e[7] === Q.VERIFYING && Qr();
  function G(D, z) {
    if (D[7] === Q.VERIFIED) {
      return Af;
    } else if (D[7] === Q.VERIFYING) {
      return Rf;
    } else {
      return $f;
    }
  }
  let X = G(e);
  let W = X(e);
  let M = (e[3] !== true || e[12]) && jr(e);
  let V = (e[5] || e[7] === Q.EXPIRED) && eo(e);
  let F = e[11].footer && (e[2] !== true || e[12]) && to(e);
  let _ = e[1] && io(e);
  return {
    c() {
      if (S) {
        S.c();
      }
      t = rt();
      i = Me("div");
      n = Me("div");
      if (R) {
        R.c();
      }
      s = rt();
      r = Me("div");
      o = Me("input");
      a = rt();
      f = Me("div");
      W.c();
      d = rt();
      if (M) {
        M.c();
      }
      u = rt();
      if (V) {
        V.c();
      }
      p = rt();
      if (F) {
        F.c();
      }
      w = rt();
      if (_) {
        _.c();
      }
      H(o, "type", "checkbox");
      H(o, "id", l = e[4] + "_checkbox");
      o.required = c = e[0] !== "onsubmit" && (!e[1] || e[0] !== "off");
      H(o, "class", "svelte-ddsc3z");
      H(r, "class", "altcha-checkbox svelte-ddsc3z");
      Zr(r, "altcha-hidden", e[7] === Q.VERIFYING);
      H(f, "class", "altcha-label svelte-ddsc3z");
      H(n, "class", "altcha-main svelte-ddsc3z");
      H(i, "class", "altcha svelte-ddsc3z");
      H(i, "data-state", e[7]);
      H(i, "data-floating", e[1]);
    },
    m(D, z) {
      if (S) {
        S.m(D, z);
      }
      He(D, t, z);
      He(D, i, z);
      we(i, n);
      if (R) {
        R.m(n, null);
      }
      we(n, s);
      we(n, r);
      we(r, o);
      o.checked = e[8];
      we(n, a);
      we(n, f);
      W.m(f, null);
      we(n, d);
      if (M) {
        M.m(n, null);
      }
      we(i, u);
      if (V) {
        V.m(i, null);
      }
      we(i, p);
      if (F) {
        F.m(i, null);
      }
      we(i, w);
      if (_) {
        _.m(i, null);
      }
      e[49](i);
      x = true;
      if (!b) {
        $ = [ls(o, "change", e[47]), ls(o, "change", e[13]), ls(o, "invalid", e[14])];
        b = true;
      }
    },
    p(D, z) {
      if (S && S.p && (!x || z[1] & 16384)) {
        Ju(S, v, D, D[45], x ? Zu(v, D[45], z, null) : Qu(D[45]), null);
      }
      if (D[7] === Q.VERIFYING) {
        if (!R) {
          R = Qr();
          R.c();
          R.m(n, s);
        }
      } else if (R) {
        R.d(1);
        R = null;
      }
      if (!x || z[0] & 16 && l !== (l = D[4] + "_checkbox")) {
        H(o, "id", l);
      }
      if (!x || z[0] & 3 && c !== (c = D[0] !== "onsubmit" && (!D[1] || D[0] !== "off"))) {
        o.required = c;
      }
      if (z[0] & 256) {
        o.checked = D[8];
      }
      if (!x || z[0] & 128) {
        Zr(r, "altcha-hidden", D[7] === Q.VERIFYING);
      }
      if (X === (X = G(D)) && W) {
        W.p(D, z);
      } else {
        W.d(1);
        W = X(D);
        if (W) {
          W.c();
          W.m(f, null);
        }
      }
      if (D[3] !== true || D[12]) {
        if (M) {
          M.p(D, z);
        } else {
          M = jr(D);
          M.c();
          M.m(n, null);
        }
      } else if (M) {
        M.d(1);
        M = null;
      }
      if (D[5] || D[7] === Q.EXPIRED) {
        if (V) {
          V.p(D, z);
        } else {
          V = eo(D);
          V.c();
          V.m(i, p);
        }
      } else if (V) {
        V.d(1);
        V = null;
      }
      if (D[11].footer && (D[2] !== true || D[12])) {
        if (F) {
          F.p(D, z);
        } else {
          F = to(D);
          F.c();
          F.m(i, w);
        }
      } else if (F) {
        F.d(1);
        F = null;
      }
      if (D[1]) {
        if (_) {
          _.p(D, z);
        } else {
          _ = io(D);
          _.c();
          _.m(i, null);
        }
      } else if (_) {
        _.d(1);
        _ = null;
      }
      if (!x || z[0] & 128) {
        H(i, "data-state", D[7]);
      }
      if (!x || z[0] & 2) {
        H(i, "data-floating", D[1]);
      }
    },
    i(D) {
      if (!x) {
        ka(S, D);
        x = true;
      }
    },
    o(D) {
      pf(S, D);
      x = false;
    },
    d(D) {
      if (D) {
        _e(t);
        _e(i);
      }
      if (S) {
        S.d(D);
      }
      if (R) {
        R.d();
      }
      W.d();
      if (M) {
        M.d();
      }
      if (V) {
        V.d();
      }
      if (F) {
        F.d();
      }
      if (_) {
        _.d();
      }
      e[49](null);
      b = false;
      Ji($);
    }
  };
}
const no = "Visit Altcha.org";
const Ia = "https://altcha.org/";
function so(e) {
  return JSON.parse(e);
}
function zf(e, t, i) {
  var n;
  var s;
  let r;
  let o;
  let l;
  let c;
  let {
    $$slots: a = {},
    $$scope: f
  } = t;
  let {
    auto: d = undefined
  } = t;
  let {
    blockspam: u = undefined
  } = t;
  let {
    challengeurl: p = undefined
  } = t;
  let {
    challengejson: w = undefined
  } = t;
  let {
    debug: x = false
  } = t;
  let {
    delay: b = 0
  } = t;
  let {
    expire: $ = undefined
  } = t;
  let {
    floating: v = undefined
  } = t;
  let {
    floatinganchor: S = undefined
  } = t;
  let {
    floatingoffset: R = undefined
  } = t;
  let {
    hidefooter: G = false
  } = t;
  let {
    hidelogo: X = false
  } = t;
  let {
    name: W = "altcha"
  } = t;
  let {
    maxnumber: M = 1000000
  } = t;
  let {
    mockerror: V = false
  } = t;
  let {
    obfuscated: F = undefined
  } = t;
  let {
    plugins: _ = undefined
  } = t;
  let {
    refetchonexpire: D = true
  } = t;
  let {
    spamfilter: z = false
  } = t;
  let {
    strings: N = undefined
  } = t;
  let {
    test: Y = false
  } = t;
  let {
    verifyurl: K = undefined
  } = t;
  let {
    workers: ie = Math.min(16, navigator.hardwareConcurrency || 8)
  } = t;
  let {
    workerurl: ae = undefined
  } = t;
  const J = cf();
  const Se = ["SHA-256", "SHA-384", "SHA-512"];
  const zt = (s = (n = document.documentElement.lang) == null ? undefined : n.split("-")) == null ? undefined : s[0];
  let Ve = false;
  let te;
  let Be = null;
  let pt = null;
  let ne = null;
  let mt = null;
  let Ne = null;
  let it = null;
  let Ze = [];
  let se = Q.UNVERIFIED;
  lf(() => {
    mi();
    if (ne) {
      ne.removeEventListener("submit", Z);
      ne.removeEventListener("reset", U);
      ne.removeEventListener("focusin", q);
      ne = null;
    }
    if (Ne) {
      clearTimeout(Ne);
      Ne = null;
    }
    document.removeEventListener("click", I);
    document.removeEventListener("scroll", E);
    window.removeEventListener("resize", Ce);
  });
  af(() => {
    h("mounted", "1.0.6");
    h("workers", ie);
    m();
    h("plugins", Ze.length ? Ze.map(y => y.constructor.pluginName).join(", ") : "none");
    if (Y) {
      h("using test mode");
    }
    if ($) {
      be($);
    }
    if (d !== undefined) {
      h("auto", d);
    }
    if (v !== undefined) {
      ue(v);
    }
    ne = te.closest("form");
    if (ne) {
      ne.addEventListener("submit", Z, {
        capture: true
      });
      ne.addEventListener("reset", U);
      if (d === "onfocus") {
        ne.addEventListener("focusin", q);
      }
    }
    if (d === "onload") {
      if (F) {
        Mt();
      } else {
        yt();
      }
    }
    if (r && (G || X)) {
      h("Attributes hidefooter and hidelogo ignored because usage with free API Keys requires attribution.");
    }
    requestAnimationFrame(() => {
      J("load");
    });
  });
  function pi(y, B) {
    return (JSON.stringify({
      algorithm: y.algorithm,
      challenge: y.challenge,
      number: B.number,
      salt: y.salt,
      signature: y.signature,
      test: Y ? true : undefined,
      took: B.took
    }));
  }
  function mi() {
    for (const y of Ze) {
      y.destroy();
    }
  }
  function gi() {
    if (p && D && se === Q.VERIFIED) {
      yt();
    } else {
      nt(Q.EXPIRED, c.expired);
    }
  }
  async function yi() {
    var y;
    if (V) {
      h("mocking error");
      throw new Error("Mocked error.");
    }
    if (o) {
      h("using provided json data");
      return o;
    }
    if (Y) {
      h("generating test challenge", {
        test: Y
      });
      return Sf(typeof Y != "boolean" ? +Y : undefined);
    }
    {
      if (!p && ne) {
        const le = ne.getAttribute("action");
        if (le != null && le.includes("/form/")) {
          i(15, p = le + "/altcha");
        }
      }
      if (!p) {
        throw new Error("Attribute challengeurl not set.");
      }
      h("fetching challenge from", p);
      const B = await fetch(p, {
        headers: z ? {
          "x-altcha-spam-filter": "1"
        } : {}
      });
      if (B.status !== 200) {
        throw new Error(`Server responded with ${B.status}.`);
      }
      const ee = B.headers.get("Expires");
      const ve = B.headers.get("X-Altcha-Config");
      const Le = await B.json();
      const wt = new URLSearchParams((y = Le.salt.split("?")) == null ? undefined : y[1]);
      const Pe = wt.get("expires") || wt.get("expire");
      if (Pe) {
        const le = new Date(+Pe * 1000);
        const Xe = isNaN(le.getTime()) ? 0 : le.getTime() - Date.now();
        if (Xe > 0) {
          be(Xe);
        }
      }
      if (ve) {
        try {
          const le = JSON.parse(ve);
          if (le && typeof le == "object") {
            if (le.verifyurl) {
              le.verifyurl = new URL(le.verifyurl, new URL(p)).toString();
            }
            xi(le);
          }
        } catch (le) {
          h("unable to configure from X-Altcha-Config", le);
        }
      }
      if (!$ && ee != null && ee.length) {
        const le = Date.parse(ee);
        if (le) {
          const Xe = le - Date.now();
          if (Xe > 0) {
            be(Xe);
          }
        }
      }
      return Le;
    }
  }
  function wi(y) {
    var B;
    const ee = ne == null ? undefined : ne.querySelector(typeof y == "string" ? `input[name="${y}"]` : "input[type=\"email\"]:not([data-no-spamfilter])");
    return ((B = ee == null ? undefined : ee.value) == null ? undefined : B.slice(ee.value.indexOf("@"))) || undefined;
  }
  function Ln() {
    if (z === "ipAddress") {
      return {
        blockedCountries: undefined,
        classifier: undefined,
        disableRules: undefined,
        email: false,
        expectedCountries: undefined,
        expectedLanguages: undefined,
        fields: false,
        ipAddress: undefined,
        text: undefined,
        timeZone: undefined
      };
    } else if (typeof z == "object") {
      return z;
    } else {
      return {
        blockedCountries: undefined,
        classifier: undefined,
        disableRules: undefined,
        email: undefined,
        expectedCountries: undefined,
        expectedLanguages: undefined,
        fields: undefined,
        ipAddress: undefined,
        text: undefined,
        timeZone: undefined
      };
    }
  }
  function Tt(y) {
    return [...((ne == null ? undefined : ne.querySelectorAll(y != null && y.length ? y.map(B => `input[name="${B}"]`).join(", ") : "input[type=\"text\"]:not([data-no-spamfilter]), textarea:not([data-no-spamfilter])")) || [])].reduce((B, ee) => {
      const ve = ee.name;
      const Le = ee.value;
      if (ve && Le) {
        B[ve] = /\n/.test(Le) ? Le.replace(new RegExp("(?<!\\r)\\n", "g"), `\r
`) : Le;
      }
      return B;
    }, {});
  }
  function m() {
    const y = _ !== undefined ? _.split(",") : undefined;
    for (const B of globalThis.altchaPlugins) {
      if (!y || y.includes(B.pluginName)) {
        Ze.push(new B({
          el: te,
          clarify: Mt,
          dispatch: J,
          getConfiguration: gt,
          getFloatingAnchor: Ht,
          getState: Lt,
          log: h,
          reset: nt,
          solve: re,
          setState: st,
          setFloatingAnchor: Ft,
          verify: yt
        }));
      }
    }
  }
  function h(...y) {
    if (x || y.some(B => B instanceof Error)) {
      console[y[0] instanceof Error ? "error" : "log"]("ALTCHA", `[name=${W}]`, ...y);
    }
  }
  function g() {
    if ([Q.UNVERIFIED, Q.ERROR, Q.EXPIRED].includes(se)) {
      if (z && (ne == null ? undefined : ne.reportValidity()) === false) {
        i(8, Ve = false);
      } else if (F) {
        Mt();
      } else {
        yt();
      }
    } else {
      i(8, Ve = true);
    }
  }
  function I(y) {
    const B = y.target;
    if (v && B && !te.contains(B) && (se === Q.VERIFIED || d === "off" && se === Q.UNVERIFIED)) {
      i(9, te.style.display = "none", te);
    }
  }
  function E() {
    if (v && se !== Q.UNVERIFIED) {
      pe();
    }
  }
  function O(y) {
    for (const B of Ze) {
      if (typeof B.onErrorChange == "function") {
        B.onErrorChange(mt);
      }
    }
  }
  function q(y) {
    if (se === Q.UNVERIFIED) {
      yt();
    }
  }
  function Z(y) {
    if (ne && d === "onsubmit") {
      if (se === Q.UNVERIFIED) {
        y.preventDefault();
        y.stopPropagation();
        yt().then(() => {
          if (!(ne == null)) {
            ne.requestSubmit();
          }
        });
      } else if (se !== Q.VERIFIED) {
        y.preventDefault();
        y.stopPropagation();
        if (se === Q.VERIFYING) {
          j();
        }
      }
    } else if (ne && v && d === "off" && se === Q.UNVERIFIED) {
      y.preventDefault();
      y.stopPropagation();
      i(9, te.style.display = "block", te);
      pe();
    }
  }
  function U() {
    nt();
  }
  function j() {
    if (se === Q.VERIFYING && c.waitAlert) {
      alert(c.waitAlert);
    }
  }
  function vi(y) {
    for (const B of Ze) {
      if (typeof B.onStateChange == "function") {
        B.onStateChange(se);
      }
    }
    if (v && se !== Q.UNVERIFIED) {
      requestAnimationFrame(() => {
        pe();
      });
    }
    i(8, Ve = se === Q.VERIFIED);
  }
  function Ce() {
    if (v) {
      pe();
    }
  }
  function pe(y = 20) {
    if (te) {
      if (!pt) {
        pt = (S ? document.querySelector(S) : ne == null ? undefined : ne.querySelector("input[type=\"submit\"], button[type=\"submit\"], button:not([type=\"button\"]):not([type=\"reset\"])")) || ne;
      }
      if (pt) {
        const B = parseInt(R, 10) || 12;
        const ee = pt.getBoundingClientRect();
        const ve = te.getBoundingClientRect();
        const Le = document.documentElement.clientHeight;
        const wt = document.documentElement.clientWidth;
        const Pe = v === "auto" ? ee.bottom + ve.height + B + y > Le : v === "top";
        const le = Math.max(y, Math.min(wt - y - ve.width, ee.left + ee.width / 2 - ve.width / 2));
        if (Pe) {
          i(9, te.style.top = `${ee.top - (ve.height + B)}px`, te);
        } else {
          i(9, te.style.top = `${ee.bottom + B}px`, te);
        }
        i(9, te.style.left = `${le}px`, te);
        te.setAttribute("data-floating", Pe ? "top" : "bottom");
        if (Be) {
          const Xe = Be.getBoundingClientRect();
          i(10, Be.style.left = ee.left - le + ee.width / 2 - Xe.width / 2 + "px", Be);
        }
      } else {
        h("unable to find floating anchor element");
      }
    }
  }
  async function Bt(y) {
    if (!K) {
      throw new Error("Attribute verifyurl not set.");
    }
    h("requesting server verification from", K);
    const B = {
      payload: y
    };
    if (z) {
      const {
        blockedCountries: Le,
        classifier: wt,
        disableRules: Pe,
        email: le,
        expectedLanguages: Xe,
        expectedCountries: Fn,
        fields: bi,
        ipAddress: Si,
        text: ol,
        timeZone: wr
      } = Ln();
      B.blockedCountries = Le;
      B.classifier = wt;
      B.disableRules = Pe;
      B.email = le === false ? undefined : wi(le);
      B.expectedCountries = Fn;
      B.expectedLanguages = Xe || (zt ? [zt] : undefined);
      B.fields = bi === false ? undefined : Tt(bi);
      B.ipAddress = Si === false ? undefined : Si || "auto";
      B.text = ol;
      B.timeZone = wr === false ? undefined : wr || Tf();
    }
    const ee = await fetch(K, {
      body: JSON.stringify(B),
      headers: {
        "content-type": "application/json"
      },
      method: "POST"
    });
    if (ee.status !== 200) {
      throw new Error(`Server responded with ${ee.status}.`);
    }
    const ve = await ee.json();
    if (ve != null && ve.payload) {
      i(6, it = ve.payload);
    }
    J("serververification", ve);
    if (u && ve.classification === "BAD") {
      throw new Error("SpamFilter returned negative classification.");
    }
  }
  function be(y) {
    h("expire", y);
    if (Ne) {
      clearTimeout(Ne);
      Ne = null;
    }
    if (y < 1) {
      gi();
    } else {
      Ne = // TOLOOK
      setTimeout(gi, y);
    }
  }
  function ue(y) {
    h("floating", y);
    if (v !== y) {
      i(9, te.style.left = "", te);
      i(9, te.style.top = "", te);
    }
    i(1, v = y === true || y === "" ? "auto" : y === false || y === "false" ? undefined : v);
    if (v) {
      if (!d) {
        i(0, d = "onsubmit");
      }
      document.addEventListener("scroll", E);
      document.addEventListener("click", I);
      window.addEventListener("resize", Ce);
    } else if (d === "onsubmit") {
      i(0, d = undefined);
    }
  }
  function Ie(y) {
    if (!y.algorithm) {
      throw new Error("Invalid challenge. Property algorithm is missing.");
    }
    if (y.signature === undefined) {
      throw new Error("Invalid challenge. Property signature is missing.");
    }
    if (!Se.includes(y.algorithm.toUpperCase())) {
      throw new Error(`Unknown algorithm value. Allowed values: ${Se.join(", ")}`);
    }
    if (!y.challenge || y.challenge.length < 40) {
      throw new Error("Challenge is too short. Min. 40 chars.");
    }
    if (!y.salt || y.salt.length < 10) {
      throw new Error("Salt is too short. Min. 10 chars.");
    }
  }
  async function re(y) {
    let B = null;
    if ("Worker" in window) {
      try {
        B = await ki(y, y.maxnumber);
      } catch (ee) {
        h(ee);
      }
      if ((B == null ? undefined : B.number) !== undefined || "obfuscated" in y) {
        return {
          data: y,
          solution: B
        };
      }
    }
    if ("obfuscated" in y) {
      const ee = await Cf(y.obfuscated, y.key, y.maxnumber);
      return {
        data: y,
        solution: await ee.promise
      };
    }
    return {
      data: y,
      solution: await If(y.challenge, y.salt, y.algorithm, y.maxnumber || M).promise
    };
  }
  async function ki(y, B = typeof Y == "number" ? Y : M, ee = Math.ceil(ie)) {
    const ve = [];
    ee = Math.min(16, Math.max(1, ee));
    for (let Pe = 0; Pe < ee; Pe++) {
      ve.push(altchaCreateWorker(ae));
    }
    const Le = Math.ceil(B / ee);
    const wt = await Promise.all(ve.map((Pe, le) => {
      const Xe = le * Le;
      return new Promise(Fn => {
        Pe.addEventListener("message", bi => {
          if (bi.data) {
            for (const Si of ve) {
              if (Si !== Pe) {
                Si.postMessage({
                  type: "abort"
                });
              }
            }
          }
          Fn(bi.data);
        });
        Pe.postMessage({
          payload: y,
          max: Xe + Le,
          start: Xe,
          type: "work"
        });
      });
    }));
    for (const Pe of ve) {
      Pe.terminate();
    }
    return wt.find(Pe => !!Pe) || null;
  }
  async function Mt() {
    if (!F) {
      i(7, se = Q.ERROR);
      return;
    }
    const y = Ze.find(B => B.constructor.pluginName === "obfuscation");
    if (!y || !("clarify" in y)) {
      i(7, se = Q.ERROR);
      h("Plugin `obfuscation` not found. Import `altcha/plugins/obfuscation` to load it.");
      return;
    }
    if ("clarify" in y && typeof y.clarify == "function") {
      return y.clarify();
    }
  }
  function xi(y) {
    if (y.obfuscated !== undefined) {
      i(24, F = y.obfuscated);
    }
    if (y.auto !== undefined) {
      i(0, d = y.auto);
      if (d === "onload") {
        if (F) {
          Mt();
        } else {
          yt();
        }
      }
    }
    if (y.blockspam !== undefined) {
      i(16, u = !!y.blockspam);
    }
    if (y.floatinganchor !== undefined) {
      i(20, S = y.floatinganchor);
    }
    if (y.delay !== undefined) {
      i(18, b = y.delay);
    }
    if (y.floatingoffset !== undefined) {
      i(21, R = y.floatingoffset);
    }
    if (y.floating !== undefined) {
      ue(y.floating);
    }
    if (y.expire !== undefined) {
      be(y.expire);
      i(19, $ = y.expire);
    }
    if (y.challenge) {
      Ie(y.challenge);
      o = y.challenge;
    }
    if (y.challengeurl !== undefined) {
      i(15, p = y.challengeurl);
    }
    if (y.debug !== undefined) {
      i(17, x = !!y.debug);
    }
    if (y.hidefooter !== undefined) {
      i(2, G = !!y.hidefooter);
    }
    if (y.hidelogo !== undefined) {
      i(3, X = !!y.hidelogo);
    }
    if (y.maxnumber !== undefined) {
      i(22, M = +y.maxnumber);
    }
    if (y.mockerror !== undefined) {
      i(23, V = !!y.mockerror);
    }
    if (y.name !== undefined) {
      i(4, W = y.name);
    }
    if (y.refetchonexpire !== undefined) {
      i(25, D = !!y.refetchonexpire);
    }
    if (y.spamfilter !== undefined) {
      i(26, z = typeof y.spamfilter == "object" ? y.spamfilter : !!y.spamfilter);
    }
    if (y.strings) {
      i(44, l = y.strings);
    }
    if (y.test !== undefined) {
      i(27, Y = typeof y.test == "number" ? y.test : !!y.test);
    }
    if (y.verifyurl !== undefined) {
      i(28, K = y.verifyurl);
    }
    if (y.workers !== undefined) {
      i(29, ie = +y.workers);
    }
    if (y.workerurl !== undefined) {
      i(30, ae = y.workerurl);
    }
  }
  function gt() {
    return {
      auto: d,
      blockspam: u,
      challengeurl: p,
      debug: x,
      delay: b,
      expire: $,
      floating: v,
      floatinganchor: S,
      floatingoffset: R,
      hidefooter: G,
      hidelogo: X,
      name: W,
      maxnumber: M,
      mockerror: V,
      obfuscated: F,
      refetchonexpire: D,
      spamfilter: z,
      strings: c,
      test: Y,
      verifyurl: K,
      workers: ie,
      workerurl: ae
    };
  }
  function Ht() {
    return pt;
  }
  function fe(y) {
    return Ze.find(B => B.constructor.pluginName === y);
  }
  function Lt() {
    return se;
  }
  function nt(y = Q.UNVERIFIED, B = null) {
    if (Ne) {
      clearTimeout(Ne);
      Ne = null;
    }
    i(8, Ve = false);
    i(5, mt = B);
    i(6, it = null);
    i(7, se = y);
  }
  function Ft(y) {
    pt = y;
  }
  function st(y, B = null) {
    i(7, se = y);
    i(5, mt = B);
  }
  async function yt() {
    nt(Q.VERIFYING);
    await new Promise(y => // TOLOOK
    setTimeout(y, b || 0));
    return yi().then(y => {
      Ie(y);
      h("challenge", y);
      return re(y);
    }).then(({
      data: y,
      solution: B
    }) => {
      h("solution", B);
      if ("challenge" in y && B && !("clearText" in B)) {
        if ((B == null ? undefined : B.number) !== undefined) {
          if (K) {
            return Bt(pi(y, B));
          }
          i(6, it = pi(y, B));
          h("payload", it);
        } else {
          h("Unable to find a solution. Ensure that the 'maxnumber' attribute is greater than the randomly generated number.");
          throw new Error("Unexpected result returned.");
        }
      }
    }).then(() => {
      i(7, se = Q.VERIFIED);
      h("verified");
      hf().then(() => {
        J("verified", {
          payload: it
        });
      });
    }).catch(y => {
      h(y);
      i(7, se = Q.ERROR);
      i(5, mt = y.message);
    });
  }
  function nl() {
    Ve = this.checked;
    i(8, Ve);
  }
  function sl(y) {
    kn[y ? "unshift" : "push"](() => {
      Be = y;
      i(10, Be);
    });
  }
  function rl(y) {
    kn[y ? "unshift" : "push"](() => {
      te = y;
      i(9, te);
    });
  }
  e.$$set = y => {
    if ("auto" in y) {
      i(0, d = y.auto);
    }
    if ("blockspam" in y) {
      i(16, u = y.blockspam);
    }
    if ("challengeurl" in y) {
      i(15, p = y.challengeurl);
    }
    if ("challengejson" in y) {
      i(31, w = y.challengejson);
    }
    if ("debug" in y) {
      i(17, x = y.debug);
    }
    if ("delay" in y) {
      i(18, b = y.delay);
    }
    if ("expire" in y) {
      i(19, $ = y.expire);
    }
    if ("floating" in y) {
      i(1, v = y.floating);
    }
    if ("floatinganchor" in y) {
      i(20, S = y.floatinganchor);
    }
    if ("floatingoffset" in y) {
      i(21, R = y.floatingoffset);
    }
    if ("hidefooter" in y) {
      i(2, G = y.hidefooter);
    }
    if ("hidelogo" in y) {
      i(3, X = y.hidelogo);
    }
    if ("name" in y) {
      i(4, W = y.name);
    }
    if ("maxnumber" in y) {
      i(22, M = y.maxnumber);
    }
    if ("mockerror" in y) {
      i(23, V = y.mockerror);
    }
    if ("obfuscated" in y) {
      i(24, F = y.obfuscated);
    }
    if ("plugins" in y) {
      i(32, _ = y.plugins);
    }
    if ("refetchonexpire" in y) {
      i(25, D = y.refetchonexpire);
    }
    if ("spamfilter" in y) {
      i(26, z = y.spamfilter);
    }
    if ("strings" in y) {
      i(33, N = y.strings);
    }
    if ("test" in y) {
      i(27, Y = y.test);
    }
    if ("verifyurl" in y) {
      i(28, K = y.verifyurl);
    }
    if ("workers" in y) {
      i(29, ie = y.workers);
    }
    if ("workerurl" in y) {
      i(30, ae = y.workerurl);
    }
    if ("$$scope" in y) {
      i(45, f = y.$$scope);
    }
  };
  e.$$.update = () => {
    if (e.$$.dirty[0] & 32768) {
      i(12, r = !!(p != null && p.includes(".altcha.org")) && !!(p != null && p.includes("apiKey=ckey_")));
    }
    if (e.$$.dirty[1] & 1) {
      o = w ? so(w) : undefined;
    }
    if (e.$$.dirty[1] & 4) {
      i(44, l = N ? so(N) : {});
    }
    if (e.$$.dirty[1] & 8192) {
      i(11, c = {
        ariaLinkLabel: no,
        error: "Verification failed. Try again later.",
        expired: "Verification expired. Try again.",
        footer: `Protected by <a href="${Ia}" target="_blank" aria-label="${l.ariaLinkLabel || no}">ALTCHA</a>`,
        label: "I'm not a robot",
        verified: "Verified",
        verifying: "Verifying...",
        waitAlert: "Verifying... please wait.",
        ...l
      });
    }
    if (e.$$.dirty[0] & 192) {
      J("statechange", {
        payload: it,
        state: se
      });
    }
    if (e.$$.dirty[0] & 32) {
      O();
    }
    if (e.$$.dirty[0] & 128) {
      vi();
    }
  };
  return [d, v, G, X, W, mt, it, se, Ve, te, Be, c, r, g, j, p, u, x, b, $, S, R, M, V, F, D, z, Y, K, ie, ae, w, _, N, Mt, xi, gt, Ht, fe, Lt, nt, Ft, st, yt, l, f, a, nl, sl, rl];
}
class Bf extends kf {
  constructor(t) {
    super();
    wf(this, t, zf, _f, Gu, {
      auto: 0,
      blockspam: 16,
      challengeurl: 15,
      challengejson: 31,
      debug: 17,
      delay: 18,
      expire: 19,
      floating: 1,
      floatinganchor: 20,
      floatingoffset: 21,
      hidefooter: 2,
      hidelogo: 3,
      name: 4,
      maxnumber: 22,
      mockerror: 23,
      obfuscated: 24,
      plugins: 32,
      refetchonexpire: 25,
      spamfilter: 26,
      strings: 33,
      test: 27,
      verifyurl: 28,
      workers: 29,
      workerurl: 30,
      clarify: 34,
      configure: 35,
      getConfiguration: 36,
      getFloatingAnchor: 37,
      getPlugin: 38,
      getState: 39,
      reset: 40,
      setFloatingAnchor: 41,
      setState: 42,
      verify: 43
    }, Pf, [-1, -1, -1]);
  }
  get auto() {
    return this.$$.ctx[0];
  }
  set auto(t) {
    this.$$set({
      auto: t
    });
    ce();
  }
  get blockspam() {
    return this.$$.ctx[16];
  }
  set blockspam(t) {
    this.$$set({
      blockspam: t
    });
    ce();
  }
  get challengeurl() {
    return this.$$.ctx[15];
  }
  set challengeurl(t) {
    this.$$set({
      challengeurl: t
    });
    ce();
  }
  get challengejson() {
    return this.$$.ctx[31];
  }
  set challengejson(t) {
    this.$$set({
      challengejson: t
    });
    ce();
  }
  get debug() {
    return this.$$.ctx[17];
  }
  set debug(t) {
    this.$$set({
      debug: t
    });
    ce();
  }
  get delay() {
    return this.$$.ctx[18];
  }
  set delay(t) {
    this.$$set({
      delay: t
    });
    ce();
  }
  get expire() {
    return this.$$.ctx[19];
  }
  set expire(t) {
    this.$$set({
      expire: t
    });
    ce();
  }
  get floating() {
    return this.$$.ctx[1];
  }
  set floating(t) {
    this.$$set({
      floating: t
    });
    ce();
  }
  get floatinganchor() {
    return this.$$.ctx[20];
  }
  set floatinganchor(t) {
    this.$$set({
      floatinganchor: t
    });
    ce();
  }
  get floatingoffset() {
    return this.$$.ctx[21];
  }
  set floatingoffset(t) {
    this.$$set({
      floatingoffset: t
    });
    ce();
  }
  get hidefooter() {
    return this.$$.ctx[2];
  }
  set hidefooter(t) {
    this.$$set({
      hidefooter: t
    });
    ce();
  }
  get hidelogo() {
    return this.$$.ctx[3];
  }
  set hidelogo(t) {
    this.$$set({
      hidelogo: t
    });
    ce();
  }
  get name() {
    return this.$$.ctx[4];
  }
  set name(t) {
    this.$$set({
      name: t
    });
    ce();
  }
  get maxnumber() {
    return this.$$.ctx[22];
  }
  set maxnumber(t) {
    this.$$set({
      maxnumber: t
    });
    ce();
  }
  get mockerror() {
    return this.$$.ctx[23];
  }
  set mockerror(t) {
    this.$$set({
      mockerror: t
    });
    ce();
  }
  get obfuscated() {
    return this.$$.ctx[24];
  }
  set obfuscated(t) {
    this.$$set({
      obfuscated: t
    });
    ce();
  }
  get plugins() {
    return this.$$.ctx[32];
  }
  set plugins(t) {
    this.$$set({
      plugins: t
    });
    ce();
  }
  get refetchonexpire() {
    return this.$$.ctx[25];
  }
  set refetchonexpire(t) {
    this.$$set({
      refetchonexpire: t
    });
    ce();
  }
  get spamfilter() {
    return this.$$.ctx[26];
  }
  set spamfilter(t) {
    this.$$set({
      spamfilter: t
    });
    ce();
  }
  get strings() {
    return this.$$.ctx[33];
  }
  set strings(t) {
    this.$$set({
      strings: t
    });
    ce();
  }
  get test() {
    return this.$$.ctx[27];
  }
  set test(t) {
    this.$$set({
      test: t
    });
    ce();
  }
  get verifyurl() {
    return this.$$.ctx[28];
  }
  set verifyurl(t) {
    this.$$set({
      verifyurl: t
    });
    ce();
  }
  get workers() {
    return this.$$.ctx[29];
  }
  set workers(t) {
    this.$$set({
      workers: t
    });
    ce();
  }
  get workerurl() {
    return this.$$.ctx[30];
  }
  set workerurl(t) {
    this.$$set({
      workerurl: t
    });
    ce();
  }
  get clarify() {
    return this.$$.ctx[34];
  }
  get configure() {
    return this.$$.ctx[35];
  }
  get getConfiguration() {
    return this.$$.ctx[36];
  }
  get getFloatingAnchor() {
    return this.$$.ctx[37];
  }
  get getPlugin() {
    return this.$$.ctx[38];
  }
  get getState() {
    return this.$$.ctx[39];
  }
  get reset() {
    return this.$$.ctx[40];
  }
  get setFloatingAnchor() {
    return this.$$.ctx[41];
  }
  get setState() {
    return this.$$.ctx[42];
  }
  get verify() {
    return this.$$.ctx[43];
  }
}
window.loadedScript = true;
const Hf = location.hostname !== "localhost" && location.hostname !== "127.0.0.1" && !location.hostname.startsWith("192.168.");
const Ta = location.hostname === "sandbox-dev.moomoo.io" || location.hostname === "sandbox.moomoo.io";
const Lf = location.hostname === "dev.moomoo.io" || location.hostname === "dev2.moomoo.io";
const As = new Ih();
let $i;
let dn;
let pn;
const xn = location.hostname === "localhost" || location.hostname === "127.0.0.1";
const Ff = false;
const nr = xn || Ff;
if (Ta) {
  dn = "https://api-sandbox.moomoo.io";
  pn = "moomoo.io";
} else if (Lf) {
  dn = "https://api-dev.moomoo.io";
  pn = "moomoo.io";
} else {
  dn = "https://api.moomoo.io";
  pn = "moomoo.io";
}
const Vf = !nr;
const xt = new ze(pn, 443, T.maxPlayers, 5, Vf);
xt.debugLog = false;
const Ye = {
  animationTime: 0,
  land: null,
  lava: null,
  x: T.volcanoLocationX,
  y: T.volcanoLocationY
};
function Nf() {
  let e = false;
  (function (t) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))) {
      e = true;
    }
  })(navigator.userAgent || navigator.vendor || window.opera);
  return e;
}
const Ma = Nf();
let bn = false;
let Ds = false;
class Alt {
        constructor() {
            this.code = null;
            this.core_count = Math.min(16, navigator.hardwareConcurrency || 4);
            this.token_encode = "IWZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2xldCBlPW5ldyBUZXh0RW5jb2Rlcjthc3luYyBmdW5jdGlvbiB0KHQsbixyKXt2YXIgbDtyZXR1cm4gbD1hd2FpdCBjcnlwdG8uc3VidGxlLmRpZ2VzdChyLnRvVXBwZXJDYXNlKCksZS5lbmNvZGUodCtuKSksWy4uLm5ldyBVaW50OEFycmF5KGwpXS5tYXAoZT0+ZS50b1N0cmluZygxNikucGFkU3RhcnQoMiwiMCIpKS5qb2luKCIiKX1mdW5jdGlvbiBuKGUsdD0xMil7bGV0IG49bmV3IFVpbnQ4QXJyYXkodCk7Zm9yKGxldCByPTA7cjx0O3IrKyluW3JdPWUlMjU2LGU9TWF0aC5mbG9vcihlLzI1Nik7cmV0dXJuIG59YXN5bmMgZnVuY3Rpb24gcih0LHI9IiIsbD0xZTYsbz0wKXtsZXQgYT0iQUVTLUdDTSIsYz1uZXcgQWJvcnRDb250cm9sbGVyLGk9RGF0ZS5ub3coKSx1PShhc3luYygpPT57Zm9yKGxldCBlPW87ZTw9bCYmIWMuc2lnbmFsLmFib3J0ZWQmJnMmJnc7ZSsrKXRyeXtsZXQgdD1hd2FpdCBjcnlwdG8uc3VidGxlLmRlY3J5cHQoe25hbWU6YSxpdjpuKGUpfSxzLHcpO2lmKHQpcmV0dXJue2NsZWFyVGV4dDpuZXcgVGV4dERlY29kZXIoKS5kZWNvZGUodCksdG9vazpEYXRlLm5vdygpLWl9fWNhdGNoe31yZXR1cm4gbnVsbH0pKCkscz1udWxsLHc9bnVsbDt0cnl7dz1mdW5jdGlvbiBlKHQpe2xldCBuPWF0b2IodCkscj1uZXcgVWludDhBcnJheShuLmxlbmd0aCk7Zm9yKGxldCBsPTA7bDxuLmxlbmd0aDtsKyspcltsXT1uLmNoYXJDb2RlQXQobCk7cmV0dXJuIHJ9KHQpO2xldCBmPWF3YWl0IGNyeXB0by5zdWJ0bGUuZGlnZXN0KCJTSEEtMjU2IixlLmVuY29kZShyKSk7cz1hd2FpdCBjcnlwdG8uc3VidGxlLmltcG9ydEtleSgicmF3IixmLGEsITEsWyJkZWNyeXB0Il0pfWNhdGNoe3JldHVybntwcm9taXNlOlByb21pc2UucmVqZWN0KCksY29udHJvbGxlcjpjfX1yZXR1cm57cHJvbWlzZTp1LGNvbnRyb2xsZXI6Y319bGV0IGw7b25tZXNzYWdlPWFzeW5jIGU9PntsZXR7dHlwZTpuLHBheWxvYWQ6byxzdGFydDphLG1heDpjfT1lLmRhdGEsaT1udWxsO2lmKCJhYm9ydCI9PT1uKWwmJmwuYWJvcnQoKSxsPXZvaWQgMDtlbHNlIGlmKCJ3b3JrIj09PW4pe2lmKCJvYmZ1c2NhdGVkImluIG8pe2xldHtrZXk6dSxvYmZ1c2NhdGVkOnN9PW98fHt9O2k9YXdhaXQgcihzLHUsYyxhKX1lbHNle2xldHthbGdvcml0aG06dyxjaGFsbGVuZ2U6ZixzYWx0OmR9PW98fHt9O2k9ZnVuY3Rpb24gZShuLHIsbD0iU0hBLTI1NiIsbz0xZTYsYT0wKXtsZXQgYz1uZXcgQWJvcnRDb250cm9sbGVyLGk9RGF0ZS5ub3coKSx1PShhc3luYygpPT57Zm9yKGxldCBlPWE7ZTw9byYmIWMuc2lnbmFsLmFib3J0ZWQ7ZSsrKXtsZXQgdT1hd2FpdCB0KHIsZSxsKTtpZih1PT09bilyZXR1cm57bnVtYmVyOmUsdG9vazpEYXRlLm5vdygpLWl9fXJldHVybiBudWxsfSkoKTtyZXR1cm57cHJvbWlzZTp1LGNvbnRyb2xsZXI6Y319KGYsZCx3LGMsYSl9bD1pLmNvbnRyb2xsZXIsaS5wcm9taXNlLnRoZW4oZT0+e3NlbGYucG9zdE1lc3NhZ2UoZSYmey4uLmUsd29ya2VyOiEwfSl9KX19fSgpOw=="
            this.toBytes = function (b64) {
                return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
            };
            this.workerBlob = new Blob([this.toBytes(this.token_encode)], {
                type: "text/javascript;charset=utf-8"
            });
        }

        static createPayload(Data, Date_) {
            return btoa(JSON.stringify({
                algorithm: Data.algorithm,
                challenge: Data.challenge,
                number: Date_.number,
                salt: Data.salt,
                signature: Data.signature,
                test: !!Data || undefined,
                took: Date_.took
            }));
        }

        createWorker(options) {
            try {
                let url = URL.createObjectURL(this.workerBlob);
                const worker = new Worker(url, { name: options?.name });
                worker.addEventListener("error", () => URL.revokeObjectURL(url));
                return worker;
            } catch (e) {
                return new Worker("data:text/javascript;base64," + this.token_encode, {
                    name: options?.name
                });
            }
        }

        async getChallenge() {
            const res = await fetch("https://api.moomoo.io/verify");
            return await res.json();
        }

        async getWorkerSolution(task, total, count = Math.ceil(this.core_count)) {
            let workers = [];
            count = Math.min(16, Math.max(1, count));
            for (let i = 0; i < count; i++) {
                workers.push(this.createWorker());
            }
            let chunk = Math.ceil(total / count);
            let result = await Promise.all(workers.map((worker, index) => {
                let start = index * chunk;
                return new Promise(resolve => {
                    worker.onmessage = msg => {
                        if (msg.data) {
                            workers.forEach(w => w !== worker && w.postMessage({ type: "abort" }));
                        }
                        resolve(msg.data);
                    };
                    worker.postMessage({
                        type: "work",
                        payload: task,
                        max: start + chunk,
                        start: start
                    });
                });
            }));
            workers.forEach(w => w.terminate());
            return result.find(r => !!r);
        }

        async validateChallenge(data) {
            const solution = await this.getWorkerSolution(data, data.maxnumber);
            if (solution?.number !== undefined) {
                return { challengeData: data, solution };
            }
        }

        async generate() {
            const challengeData = await this.getChallenge();
            const { solution } = await this.validateChallenge(challengeData);
            this.code = `alt:${Alt.createPayload(challengeData, solution)}`;
            //console.log("Generated Altcha token:", this.code);
            return this.code;
        }
    }
let altcha = new Alt();

let token = null;

// Generate token XD josh baka
async function generateToken() {
  token = await altcha.generate();;
  //console.log("Generated token:", token);
}
async function start() {
    await generateToken(); //check token
    hs(token); //enter the game after verify success
}
start();
/*async function ro() {
  if (!(!cr || Ds)) {
    Ds = true;
    if (Hf || nr) {
      if (token) {
        hs(token);
        alert("bypass altcha");
      } else {
        alert("Token not ready");
      }
    } else {
      if (token) {
        hs(token);
      } else {
        hs(); // fallback if no token ...
      }
    }
  }
}*/
alert("wait for it auto bypass dont enter the game!");
let Os = false;
function hs(e) {
  xt.start(In, function (t, i, n) {
    let r = "wss://" + t;
    if (xn) {
      r = "wss://localhost:3000";
    }
    if (e) {
      r += "?token=" + encodeURIComponent(e);
    }
    me.connect(r, function (o) {
      if (Os) {
        Os = false;
        return;
      }
      el();
      if (o) {
        gs(o);
      } else {
        bn = true;
        Pn();
      }
    }, {
      A: jf,
      B: gs,
      C: _d,
      D: ap,
      E: lp,
      a: fp,
      G: Vd,
      H: jd,
      I: rp,
      J: sp,
      K: Wd,
      L: ep,
      M: tp,
      N: hp,
      O: up,
      P: Bd,
      Q: Ld,
      R: Hd,
      S: cp,
      T: Ya,
      U: Ga,
      V: La,
      X: ip,
      Y: np,
      Z: mp,
      g: cd,
      1: fd,
      2: ld,
      3: hd,
      4: ud,
      5: xd,
      6: Md,
      7: yd,
      8: zd,
      9: md,
      0: pp
    });
  }, function (t) {
    console.error("Vultr error:", t);
    alert(`Error:
` + t);
    gs("disconnected");
  }, xn);
}
function sr() {
  return me.connected;
}
function Uf() {
  const t = prompt("party key", In);
  if (t) {
    window.onbeforeunload = undefined;
    window.location.href = "/?server=" + t;
  }
}
const Wf = new Th(T);
const Ea = Math.PI;
const Rt = Ea * 2;
Math.lerpAngle = function (e, t, i) {
  if (Math.abs(t - e) > Ea) {
    if (e > t) {
      t += Rt;
    } else {
      e += Rt;
    }
  }
  const s = t + (e - t) * i;
  if (s >= 0 && s <= Rt) {
    return s;
  } else {
    return s % Rt;
  }
};
CanvasRenderingContext2D.prototype.roundRect = function (e, t, i, n, s) {
  if (i < s * 2) {
    s = i / 2;
  }
  if (n < s * 2) {
    s = n / 2;
  }
  if (s < 0) {
    s = 0;
  }
  this.beginPath();
  this.moveTo(e + s, t);
  this.arcTo(e + i, t, e + i, t + n, s);
  this.arcTo(e + i, t + n, e, t + n, s);
  this.arcTo(e, t + n, e, t, s);
  this.arcTo(e, t, e + i, t, s);
  this.closePath();
  return this;
};
let rr;
if (typeof Storage !== "undefined") {
  rr = true;
}
function _n(e, t) {
  if (rr) {
    localStorage.setItem(e, t);
  }
}
function Bi(e) {
  if (rr) {
    return localStorage.getItem(e);
  } else {
    return null;
  }
}
let Sn = Bi("moofoll");
function Xf() {
  if (!Sn) {
    Sn = true;
    _n("moofoll", 1);
  }
}
let Ca;
let Et;
let jt = 1;
let Fe;
let hi;
let us;
let oo = Date.now();
var ut;
let Ke;
const Oe = [];
const oe = [];
let tt = [];
const Dt = [];
const ui = [];
const Pa = new Ch(Zh, ui, oe, Oe, $e, L, T, A);
const ao = new Ph(Oe, $h, oe, L, null, T, A);
let P;
let $a;
let k;
let qt = 1;
let fs = 0;
let Ra = 0;
let Aa = 0;
let ot;
let at;
let lo;
let or = 0;
const ge = T.maxScreenWidth;
const ye = T.maxScreenHeight;
let ei;
let ti;
let qi = false;
document.getElementById("ad-container");
const zn = document.getElementById("mainMenu");
const Hi = document.getElementById("enterGame");
const ds = document.getElementById("promoImg");
document.getElementById("partyButton");
const ps = document.getElementById("joinPartyButton");
const _s = document.getElementById("settingsButton");
const co = _s.getElementsByTagName("span")[0];
const ho = document.getElementById("allianceButton");
const uo = document.getElementById("storeButton");
const fo = document.getElementById("chatButton");
const ri = document.getElementById("gameCanvas");
const C = ri.getContext("2d");
var qf = document.getElementById("serverBrowser");
const zs = document.getElementById("nativeResolution");
const ms = document.getElementById("showPing");
document.getElementById("playMusic");
const Gi = document.getElementById("pingDisplay");
const po = document.getElementById("shutdownDisplay");
const Yi = document.getElementById("menuCardHolder");
const Li = document.getElementById("guideCard");
const fi = document.getElementById("loadingText");
const ar = document.getElementById("gameUI");
const mo = document.getElementById("actionBar");
const Gf = document.getElementById("scoreDisplay");
const Yf = document.getElementById("foodDisplay");
const Kf = document.getElementById("woodDisplay");
const Zf = document.getElementById("stoneDisplay");
const Jf = document.getElementById("killCounter");
const go = document.getElementById("leaderboardData");
const Ki = document.getElementById("nameInput");
const vt = document.getElementById("itemInfoHolder");
const yo = document.getElementById("ageText");
const wo = document.getElementById("ageBarBody");
const Gt = document.getElementById("upgradeHolder");
const tn = document.getElementById("upgradeCounter");
const We = document.getElementById("allianceMenu");
const nn = document.getElementById("allianceHolder");
const sn = document.getElementById("allianceManager");
const De = document.getElementById("mapDisplay");
const Fi = document.getElementById("diedText");
const Qf = document.getElementById("skinColorHolder");
const Te = De.getContext("2d");
De.width = 300;
De.height = 300;
const bt = document.getElementById("storeMenu");
const vo = document.getElementById("storeHolder");
const Yt = document.getElementById("noticationDisplay");
const Vi = Zo.hats;
const Ni = Zo.accessories;
var $e = new Eh(Rh, Dt, A, T);
const Zi = "#525252";
const ko = "#3d3f42";
const St = 5.5;
T.DAY_INTERVAL / 24;
T.DAY_INTERVAL / 2;
function jf(e) {
  tt = e.teams;
}
let lr = true;
var cr = false;
if (!nr || xn) {
  cr = true;
}
window.onblur = function () {
  lr = false;
};
window.onfocus = function () {
  lr = true;
  if (P && P.alive) {
    gr();
  }
};
window.captchaCallbackHook = function () {
  cr = true;
};
if (window.captchaCallbackComplete) {
  window.captchaCallbackHook();
}
window.addEventListener("keydown", function (e) {
  if (e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
});
ri.oncontextmenu = function () {
  return false;
};
["touch-controls-left", "touch-controls-right", "touch-controls-fullscreen", "storeMenu"].forEach(e => {
  if (document.getElementById(e)) {
    document.getElementById(e).oncontextmenu = function (t) {
      t.preventDefault();
    };
  }
});
function gs(e) {
  bn = false;
  me.close();
  hr(e);
}
function hr(e, t) {
  zn.style.display = "block";
  ar.style.display = "none";
  Yi.style.display = "none";
  Fi.style.display = "none";
  fi.style.display = "block";
  fi.innerHTML = e + (t ? "<a href='javascript:window.location.href=window.location.href' class='ytLink'>reload</a>" : "");
}
function ed() {
  Gi.hidden = true;
  fi.style.display = "none";
  zn.style.display = "block";
  Yi.style.display = "block";
  bd();
  id();
  Fd();
  fi.style.display = "none";
  Yi.style.display = "block";
  let e = Bi("moo_name") || "";
  if (!e.length && FRVR.profile) {
    e = FRVR.profile.name();
    if (e) {
      e += Math.floor(Math.random() * 90) + 9;
    }
  }
  Ki.value = e || "";
}
function td(e) { //double check for altcha remove
document.getElementById("altcha").remove()
    Hi.classList.remove("disabled");
}
window.addEventListener("load", () => {
  const e = document.getElementById("altcha");
    document.getElementById("altcha").remove()
    Hi.classList.remove("disabled");
    if (!(e == null)) {
        e.addEventListener("statechange", td);
    }
});
let rn = false;
function id() {
  Hi.onclick = A.checkTrusted(function () {
    if (!Hi.classList.contains("disabled")) {
      hr("Connecting...");
      if (sr()) {
        if (rn) {
          FRVR.ads.show("interstitial").catch(console.error).finally(Pn);
        } else {
          Pn();
          rn = true;
        }
      } else if (rn) {
        FRVR.ads.show("interstitial").catch(console.error).finally(ro);
      } else {
        ro();
        rn = true;
      }
    }
  });
  A.hookTouchEvents(Hi);
  if (ds) {
    ds.onclick = A.checkTrusted(function () {
      il("https://krunker.io/?play=SquidGame_KB");
    });
    A.hookTouchEvents(ds);
  }
  if (ps) {
    ps.onclick = A.checkTrusted(function () {
      // TOLOOK
      setTimeout(function () {
        Uf();
      }, 10);
    });
    A.hookTouchEvents(ps);
  }
  _s.onclick = A.checkTrusted(function () {
    Id();
  });
  A.hookTouchEvents(_s);
  ho.onclick = A.checkTrusted(function () {
    dd();
  });
  A.hookTouchEvents(ho);
  uo.onclick = A.checkTrusted(function () {
    kd();
  });
  A.hookTouchEvents(uo);
  fo.onclick = A.checkTrusted(function () {
    Va();
  });
  A.hookTouchEvents(fo);
  De.onclick = A.checkTrusted(function () {
    Xa();
  });
  A.hookTouchEvents(De);
}
let In;
const nd = {
  view: () => {
    if (!xt.servers) {
      return;
    }
    let e = 0;
    const t = Object.keys(xt.servers).map(i => {
      const n = xt.regionInfo[i].name;
      let s = 0;
      const r = xt.servers[i].map(o => {
        var u;
        s += o.playerCount;
        const l = o.selected;
        let c = n + " " + o.name + " [" + Math.min(o.playerCount, o.playerCapacity) + "/" + o.playerCapacity + "]";
        const a = o.name;
        const f = l ? "selected" : "";
        if (o.ping && ((u = o.pings) == null ? undefined : u.length) >= 2) {
          c += ` [${Math.floor(o.ping)}ms]`;
        } else if (!l) {
          c += " [?]";
        }
        let d = {
          value: i + ":" + a
        };
        if (f) {
          In = i + ":" + a;
          d.selected = true;
        }
        return kt("option", d, c);
      });
      e += s;
      return [kt("option[disabled]", `${n} - ${s} players`), r, kt("option[disabled]")];
    });
    return kt("select", {
      value: In,
      onfocus: () => {
        window.blockRedraw = true;
      },
      onblur: () => {
        window.blockRedraw = false;
      },
      onchange: od
    }, [t, kt("option[disabled]", `All Servers - ${e} players`)]);
  }
};
kt.mount(qf, nd);
var Bs;
var Hs;
if (location.hostname == "sandbox.moomoo.io") {
  Bs = "Back to MooMoo";
  Hs = "//moomoo.io/";
} else {
  Bs = "Try the sandbox";
  Hs = "//sandbox.moomoo.io/";
}
document.getElementById("altServer").innerHTML = "<a href='" + Hs + "'>" + Bs + "<i class='material-icons' style='font-size:10px;vertical-align:middle'>arrow_forward_ios</i></a>";
const sd = `${dn}/servers?v=1.26`;
const Da = async () => fetch(sd).then(e => e.json()).then(async e => xt.processServers(e)).catch(e => {
  console.error("Failed to load server data with status code:", e);
});
const rd = () => Da().then(ed).catch(e => {
  console.error("Failed to load.");
});
window.frvrSdkInitPromise.then(() => window.FRVR.bootstrapper.complete()).then(() => rd());
const od = e => {
  window.blockRedraw = false;
  if (FRVR.channelCharacteristics.allowNavigation) {
    const [t, i] = e.target.value.split(":");
    xt.switchServer(t, i);
  } else if (bn) {
    bn = false;
    Ds = false;
    Os = true;
    $n = true;
    me.close();
  }
};
document.getElementById("pre-content-container");
function ad() {
  FRVR.ads.show("interstitial", Pn);
}
window.showPreAd = ad;
function Ue(e, t, i) {
  if (P && e) {
    A.removeAllChildren(vt);
    vt.classList.add("visible");
    A.generateElement({
      id: "itemInfoName",
      text: A.capitalizeFirst(e.name),
      parent: vt
    });
    A.generateElement({
      id: "itemInfoDesc",
      text: e.desc,
      parent: vt
    });
    if (!i) {
      if (t) {
        A.generateElement({
          class: "itemInfoReq",
          text: e.type ? "secondary" : "primary",
          parent: vt
        });
      } else {
        for (let s = 0; s < e.req.length; s += 2) {
          A.generateElement({
            class: "itemInfoReq",
            html: e.req[s] + "<span class='itemInfoReqVal'> x" + e.req[s + 1] + "</span>",
            parent: vt
          });
        }
        const n = Ta ? e.group.sandboxLimit || Math.max(e.group.limit * 3, 99) : e.group.limit;
        if (e.group.limit) {
          A.generateElement({
            class: "itemInfoLmt",
            text: (P.itemCounts[e.group.id] || 0) + "/" + n,
            parent: vt
          });
        }
      }
    }
  } else {
    vt.classList.remove("visible");
  }
}
let di = [];
let ii = [];
function ld(e, t) {
  di.push({
    sid: e,
    name: t
  });
  ur();
}
function ur() {
  if (di[0]) {
    const e = di[0];
    A.removeAllChildren(Yt);
    Yt.style.display = "block";
    A.generateElement({
      class: "notificationText",
      text: e.name,
      parent: Yt
    });
    A.generateElement({
      class: "notifButton",
      html: "<i class='material-icons' style='font-size:28px;color:#cc5151;'>&#xE14C;</i>",
      parent: Yt,
      onclick: function () {
        Fs(0);
      },
      hookTouch: true
    });
    A.generateElement({
      class: "notifButton",
      html: "<i class='material-icons' style='font-size:28px;color:#8ecc51;'>&#xE876;</i>",
      parent: Yt,
      onclick: function () {
        Fs(1);
      },
      hookTouch: true
    });
  } else {
    Yt.style.display = "none";
  }
}
function cd(e) {
  tt.push(e);
  if (We.style.display == "block") {
    Qi();
  }
}
function hd(e, t) {
  if (P) {
    P.team = e;
    P.isOwner = t;
    if (We.style.display == "block") {
      Qi();
    }
  }
}
function ud(e) {
  ii = e;
  if (We.style.display == "block") {
    Qi();
  }
}
function fd(e) {
  for (let t = tt.length - 1; t >= 0; t--) {
    if (tt[t].sid == e) {
      tt.splice(t, 1);
    }
  }
  if (We.style.display == "block") {
    Qi();
  }
}
function dd() {
  gr();
  if (We.style.display != "block") {
    Qi();
  } else {
    Ls();
  }
}
function Ls() {
  if (We.style.display == "block") {
    We.style.display = "none";
  }
}
function Qi() {
  if (P && P.alive) {
    Bn();
    bt.style.display = "none";
    We.style.display = "block";
    A.removeAllChildren(nn);
    if (P.team) {
      for (var e = 0; e < ii.length; e += 2) {
        (function (t) {
          const i = A.generateElement({
            class: "allianceItem",
            style: "color:" + (ii[t] == P.sid ? "#fff" : "rgba(255,255,255,0.6)"),
            text: ii[t + 1],
            parent: nn
          });
          if (P.isOwner && ii[t] != P.sid) {
            A.generateElement({
              class: "joinAlBtn",
              text: "Kick",
              onclick: function () {
                Oa(ii[t]);
              },
              hookTouch: true,
              parent: i
            });
          }
        })(e);
      }
    } else if (tt.length) {
      for (var e = 0; e < tt.length; ++e) {
        (function (i) {
          const n = A.generateElement({
            class: "allianceItem",
            style: "color:" + (tt[i].sid == P.team ? "#fff" : "rgba(255,255,255,0.6)"),
            text: tt[i].sid,
            parent: nn
          });
          A.generateElement({
            class: "joinAlBtn",
            text: "Join",
            onclick: function () {
              _a(i);
            },
            hookTouch: true,
            parent: n
          });
        })(e);
      }
    } else {
      A.generateElement({
        class: "allianceItem",
        text: "No Tribes Yet",
        parent: nn
      });
    }
    A.removeAllChildren(sn);
    if (P.team) {
      A.generateElement({
        class: "allianceButtonM",
        style: "width: 360px",
        text: P.isOwner ? "Delete Tribe" : "Leave Tribe",
        onclick: function () {
          za();
        },
        hookTouch: true,
        parent: sn
      });
    } else {
      A.generateElement({
        tag: "input",
        type: "text",
        id: "allianceInput",
        maxLength: 7,
        placeholder: "unique name",
        onchange: t => {
          t.target.value = (t.target.value || "").slice(0, 7);
        },
        onkeypress: t => {
          if (t.key === "Enter") {
            t.preventDefault();
            Vs();
            return false;
          }
        },
        parent: sn
      });
      A.generateElement({
        tag: "div",
        class: "allianceButtonM",
        style: "width: 140px;",
        text: "Create",
        onclick: function () {
          Vs();
        },
        hookTouch: true,
        parent: sn
      });
    }
  }
}
function Fs(e) {
  me.send("P", di[0].sid, e);
  di.splice(0, 1);
  ur();
}
function Oa(e) {
  me.send("Q", e);
}
function _a(e) {
  me.send("b", tt[e].sid);
}
function Vs() {
  me.send("L", document.getElementById("allianceInput").value);
}
function za() {
  di = [];
  ur();
  me.send("N");
}
let mn;
let Ri;
let At;
const oi = [];
let Pt;
function pd() {
  this.init = function (e, t) {
    this.scale = 0;
    this.x = e;
    this.y = t;
    this.active = true;
  };
  this.update = function (e, t) {
    if (this.active) {
      this.scale += t * 0.05;
      if (this.scale >= T.mapPingScale) {
        this.active = false;
      } else {
        e.globalAlpha = 1 - Math.max(0, this.scale / T.mapPingScale);
        e.beginPath();
        e.arc(this.x / T.mapScale * De.width, this.y / T.mapScale * De.width, this.scale, 0, Math.PI * 2);
        e.stroke();
      }
    }
  };
}
function md(e, t) {
  for (let i = 0; i < oi.length; ++i) {
    if (!oi[i].active) {
      Pt = oi[i];
      break;
    }
  }
  if (!Pt) {
    Pt = new pd();
    oi.push(Pt);
  }
  Pt.init(e, t);
}
function gd() {
  if (!At) {
    At = {};
  }
  At.x = P.x;
  At.y = P.y;
}
function yd(e) {
  Ri = e;
}
function wd(e) {
  if (P && P.alive) {
    Te.clearRect(0, 0, De.width, De.height);
    Te.strokeStyle = "#fff";
    Te.lineWidth = 4;
    for (var t = 0; t < oi.length; ++t) {
      Pt = oi[t];
      Pt.update(Te, e);
    }
    Te.globalAlpha = 1;
    Te.fillStyle = "#fff";
    he(P.x / T.mapScale * De.width, P.y / T.mapScale * De.height, 7, Te, true);
    Te.fillStyle = "rgba(255,255,255,0.35)";
    if (P.team && Ri) {
      for (var t = 0; t < Ri.length;) {
        he(Ri[t] / T.mapScale * De.width, Ri[t + 1] / T.mapScale * De.height, 7, Te, true);
        t += 2;
      }
    }
    if (mn) {
      Te.fillStyle = "#fc5553";
      Te.font = "34px Hammersmith One";
      Te.textBaseline = "middle";
      Te.textAlign = "center";
      Te.fillText("x", mn.x / T.mapScale * De.width, mn.y / T.mapScale * De.height);
    }
    if (At) {
      Te.fillStyle = "#fff";
      Te.font = "34px Hammersmith One";
      Te.textBaseline = "middle";
      Te.textAlign = "center";
      Te.fillText("x", At.x / T.mapScale * De.width, At.y / T.mapScale * De.height);
    }
  }
}
let Ns = 0;
function vd(e) {
  if (Ns != e) {
    Ns = e;
    fr();
  }
}
function kd() {
  if (bt.style.display != "block") {
    bt.style.display = "block";
    We.style.display = "none";
    Bn();
    fr();
  } else {
    Us();
  }
}
function Us() {
  if (bt.style.display == "block") {
    bt.style.display = "none";
    Ue();
  }
}
function xd(e, t, i) {
  if (i) {
    if (e) {
      P.tailIndex = t;
    } else {
      P.tails[t] = 1;
    }
  } else if (e) {
    P.skinIndex = t;
  } else {
    P.skins[t] = 1;
  }
  if (bt.style.display == "block") {
    fr();
  }
}
function fr() {
  if (P) {
    A.removeAllChildren(vo);
    const e = Ns;
    const t = e ? Ni : Vi;
    for (let i = 0; i < t.length; ++i) {
      if (!t[i].dontSell) {
        (function (n) {
          const s = A.generateElement({
            id: "storeDisplay" + n,
            class: "storeItem",
            onmouseout: function () {
              Ue();
            },
            onmouseover: function () {
              Ue(t[n], false, true);
            },
            parent: vo
          });
          A.hookTouchEvents(s, true);
          A.generateElement({
            tag: "img",
            class: "hatPreview",
            src: "./img/" + (e ? "accessories/access_" : "hats/hat_") + t[n].id + (t[n].topSprite ? "_p" : "") + ".png",
            parent: s
          });
          A.generateElement({
            tag: "span",
            text: t[n].name,
            parent: s
          });
          if (e ? !P.tails[t[n].id] : !P.skins[t[n].id]) {
            A.generateElement({
              class: "joinAlBtn",
              style: "margin-top: 5px",
              text: "Buy",
              onclick: function () {
                Ba(t[n].id, e);
              },
              hookTouch: true,
              parent: s
            });
            A.generateElement({
              tag: "span",
              class: "itemPrice",
              text: t[n].price,
              parent: s
            });
          } else if ((e ? P.tailIndex : P.skinIndex) == t[n].id) {
            A.generateElement({
              class: "joinAlBtn",
              style: "margin-top: 5px",
              text: "Unequip",
              onclick: function () {
                Ws(0, e);
              },
              hookTouch: true,
              parent: s
            });
          } else {
            A.generateElement({
              class: "joinAlBtn",
              style: "margin-top: 5px",
              text: "Equip",
              onclick: function () {
                Ws(t[n].id, e);
              },
              hookTouch: true,
              parent: s
            });
          }
        })(i);
      }
    }
  }
}
function Ws(e, t) {
  me.send("c", 0, e, t);
}
function Ba(e, t) {
  me.send("c", 1, e, t);
}
function Ha() {
  bt.style.display = "none";
  We.style.display = "none";
  Bn();
}
function bd() {
  const e = Bi("native_resolution");
  ys(e ? e == "true" : typeof cordova !== "undefined");
  Et = Bi("show_ping") == "true";
  Gi.hidden = !Et || !qi;
  Bi("moo_moosic");
  // TOLOOK
  setInterval(function () {
    if (window.cordova) {
      document.getElementById("downloadButtonContainer").classList.add("cordova");
      document.getElementById("mobileDownloadButtonContainer").classList.add("cordova");
    }
  }, 1000);
  Fa();
  A.removeAllChildren(mo);
  for (var t = 0; t < L.weapons.length + L.list.length; ++t) {
    (function (i) {
      A.generateElement({
        id: "actionBarItem" + i,
        class: "actionBarItem",
        style: "display:none",
        onmouseout: function () {
          Ue();
        },
        parent: mo
      });
    })(t);
  }
  for (var t = 0; t < L.list.length + L.weapons.length; ++t) {
    (function (n) {
      const s = document.createElement("canvas");
      s.width = s.height = 66;
      const r = s.getContext("2d");
      r.translate(s.width / 2, s.height / 2);
      r.imageSmoothingEnabled = false;
      r.webkitImageSmoothingEnabled = false;
      r.mozImageSmoothingEnabled = false;
      if (L.weapons[n]) {
        r.rotate(Math.PI / 4 + Math.PI);
        var o = new Image();
        Gs[L.weapons[n].src] = o;
        o.onload = function () {
          this.isLoaded = true;
          const c = 1 / (this.height / this.width);
          const a = L.weapons[n].iPad || 1;
          r.drawImage(this, -(s.width * a * T.iconPad * c) / 2, -(s.height * a * T.iconPad) / 2, s.width * a * c * T.iconPad, s.height * a * T.iconPad);
          r.fillStyle = "rgba(0, 0, 70, 0.1)";
          r.globalCompositeOperation = "source-atop";
          r.fillRect(-s.width / 2, -s.height / 2, s.width, s.height);
          document.getElementById("actionBarItem" + n).style.backgroundImage = "url(" + s.toDataURL() + ")";
        };
        o.src = "./img/weapons/" + L.weapons[n].src + ".png";
        var l = document.getElementById("actionBarItem" + n);
        l.onmouseover = A.checkTrusted(function () {
          Ue(L.weapons[n], true);
        });
        l.onclick = A.checkTrusted(function () {
          Ui(n, true);
        });
        A.hookTouchEvents(l);
      } else {
        var o = yr(L.list[n - L.weapons.length], true);
        const a = Math.min(s.width - T.iconPadding, o.width);
        r.globalAlpha = 1;
        r.drawImage(o, -a / 2, -a / 2, a, a);
        r.fillStyle = "rgba(0, 0, 70, 0.1)";
        r.globalCompositeOperation = "source-atop";
        r.fillRect(-a / 2, -a / 2, a, a);
        document.getElementById("actionBarItem" + n).style.backgroundImage = "url(" + s.toDataURL() + ")";
        var l = document.getElementById("actionBarItem" + n);
        l.onmouseover = A.checkTrusted(function () {
          Ue(L.list[n - L.weapons.length]);
        });
        l.onclick = A.checkTrusted(function () {
          Ui(n - L.weapons.length);
        });
        A.hookTouchEvents(l);
      }
    })(t);
  }
  Ki.onchange = i => {
    i.target.value = (i.target.value || "").slice(0, 15);
  };
  Ki.onkeypress = i => {
    if (i.key === "Enter") {
      i.preventDefault();
      Hi.onclick(i);
      return false;
    }
  };
  zs.checked = Ca;
  zs.onchange = A.checkTrusted(function (i) {
    ys(i.target.checked);
  });
  ms.checked = Et;
  ms.onchange = A.checkTrusted(function (i) {
    Et = ms.checked;
    Gi.hidden = !Et;
    _n("show_ping", Et ? "true" : "false");
  });
}
function La(e, t) {
  if (e) {
    if (t) {
      P.weapons = e;
    } else {
      P.items = e;
    }
  }
  for (var i = 0; i < L.list.length; ++i) {
    const n = L.weapons.length + i;
    document.getElementById("actionBarItem" + n).style.display = P.items.indexOf(L.list[i].id) >= 0 ? "inline-block" : "none";
  }
  for (var i = 0; i < L.weapons.length; ++i) {
    document.getElementById("actionBarItem" + i).style.display = P.weapons[L.weapons[i].type] == L.weapons[i].id ? "inline-block" : "none";
  }
}
function ys(e) {
  Ca = e;
  jt = e && window.devicePixelRatio || 1;
  zs.checked = e;
  _n("native_resolution", e.toString());
  dr();
}
function Sd() {
  if (ji) {
    Li.classList.add("touch");
  } else {
    Li.classList.remove("touch");
  }
}
function Id() {
  if (Li.classList.contains("showing")) {
    Li.classList.remove("showing");
    co.innerText = "Settings";
  } else {
    Li.classList.add("showing");
    co.innerText = "Close";
  }
}
function Fa() {
  let e = "";
  for (let t = 0; t < T.skinColors.length; ++t) {
    if (t == or) {
      e += "<div class='skinColorItem activeSkin' style='background-color:" + T.skinColors[t] + "' onclick='selectSkinColor(" + t + ")'></div>";
    } else {
      e += "<div class='skinColorItem' style='background-color:" + T.skinColors[t] + "' onclick='selectSkinColor(" + t + ")'></div>";
    }
  }
  Qf.innerHTML = e;
}
function Td(e) {
  or = e;
  Fa();
}
const Ai = document.getElementById("chatBox");
const Tn = document.getElementById("chatHolder");
function Va() {
  if (ji) {
    // TOLOOK
    setTimeout(function () {
      const e = prompt("chat message");
      if (e) {
        xo(e);
      }
    }, 1);
  } else if (Tn.style.display == "block") {
    if (Ai.value) {
      xo(Ai.value);
    }
    Bn();
  } else {
    bt.style.display = "none";
    We.style.display = "none";
    Tn.style.display = "block";
    Ai.focus();
    gr();
  }
  Ai.value = "";
}
function xo(e) {
  me.send("6", e.slice(0, 30));
}
function Bn() {
  Ai.value = "";
  Tn.style.display = "none";
}
function Md(e, t) {
  const i = Hn(e);
  if (i) {
    i.chatMessage = t;
    i.chatCountdown = T.chatCountdown;
  }
}
window.addEventListener("resize", A.checkTrusted(dr));
function dr() {
  ei = window.innerWidth;
  ti = window.innerHeight;
  const e = Math.max(ei / ge, ti / ye) * jt;
  ri.width = ei * jt;
  ri.height = ti * jt;
  ri.style.width = ei + "px";
  ri.style.height = ti + "px";
  C.setTransform(e, 0, 0, e, (ei * jt - ge * e) / 2, (ti * jt - ye * e) / 2);
}
dr();
let ji;
Ot(false);
function Ot(e) {
  ji = e;
  Sd();
}
window.setUsingTouch = Ot;
let Ed = document.getElementById("leaderboardButton");
let Na = document.getElementById("leaderboard");
Ed.addEventListener("touchstart", () => {
  Na.classList.add("is-showing");
});
const pr = () => {
  Na.classList.remove("is-showing");
};
document.body.addEventListener("touchend", pr);
document.body.addEventListener("touchleave", pr);
document.body.addEventListener("touchcancel", pr);
if (!Ma) {
  let t = function (s) {
    s.preventDefault();
    s.stopPropagation();
    Ot(false);
    Ra = s.clientX;
    Aa = s.clientY;
  };
  let i = function (s) {
    Ot(false);
    if (Ke != 1) {
      Ke = 1;
      _t();
    }
  };
  let n = function (s) {
    Ot(false);
    if (Ke != 0) {
      Ke = 0;
      _t();
    }
  };
  var gp = t;
  var yp = i;
  var wp = n;
  const e = document.getElementById("touch-controls-fullscreen");
  e.style.display = "block";
  e.addEventListener("mousemove", t, false);
  e.addEventListener("mousedown", i, false);
  e.addEventListener("mouseup", n, false);
}
let Xs = false;
let Ua;
function Cd() {
  let e = 0;
  let t = 0;
  let i;
  if (ji) {
    if (!Xs) {
      return;
    }
    i = Ua;
  }
  for (const n in En) {
    const s = En[n];
    e += !!ut[n] * s[0];
    t += !!ut[n] * s[1];
  }
  if (e != 0 || t != 0) {
    i = Math.atan2(t, e);
  }
  if (i !== undefined) {
    return A.fixTo(i, 2);
  }
}
let Mn;
function mr() {
  if (P) {
    if (!P.lockDir && !ji) {
      Mn = Math.atan2(Aa - ti / 2, Ra - ei / 2);
    }
    return A.fixTo(Mn || 0, 2);
  } else {
    return 0;
  }
}
var ut = {};
var En = {
  87: [0, -1],
  38: [0, -1],
  83: [0, 1],
  40: [0, 1],
  65: [-1, 0],
  37: [-1, 0],
  68: [1, 0],
  39: [1, 0]
};
function gr() {
  ut = {};
  me.send("e");
}
function Wa() {
  return We.style.display != "block" && Tn.style.display != "block";
}
function Pd(e) {
  const t = e.which || e.keyCode || 0;
  if (t == 27) {
    Ha();
  } else if (P && P.alive && Wa()) {
    if (!ut[t]) {
      ut[t] = 1;
      if (t == 69) {
        Ad();
      } else if (t == 67) {
        gd();
      } else if (t == 88) {
        Rd();
      } else if (P.weapons[t - 49] != null) {
        Ui(P.weapons[t - 49], true);
      } else if (P.items[t - 49 - P.weapons.length] != null) {
        Ui(P.items[t - 49 - P.weapons.length]);
      } else if (t == 81) {
        Ui(P.items[0]);
      } else if (t == 82) {
        Xa();
      } else if (En[t]) {
        Cn();
      } else if (t == 32) {
        Ke = 1;
        _t();
      }
    }
  }
}
window.addEventListener("keydown", A.checkTrusted(Pd));
function $d(e) {
  if (P && P.alive) {
    const t = e.which || e.keyCode || 0;
    if (t == 13) {
      if (We.style.display === "block") {
        return;
      }
      Va();
    } else if (Wa() && ut[t]) {
      ut[t] = 0;
      if (En[t]) {
        Cn();
      } else if (t == 32) {
        Ke = 0;
        _t();
      }
    }
  }
}
window.addEventListener("keyup", A.checkTrusted($d));
function _t() {
  if (P && P.alive) {
    me.send("F", Ke, P.buildIndex >= 0 ? mr() : null);
  }
}
let ws1;
function Cn() {
  const e = Cd();
  if (ws1 == null || e == null || Math.abs(e - ws1) > 0.3) {
    me.send("9", e);
    ws1 = e;
  }
}
function Rd() {
  P.lockDir = P.lockDir ? 0 : 1;
  me.send("K", 0);
}
function Xa() {
  me.send("S", 1);
}
function Ad() {
  me.send("K", 1);
}
function Ui(e, t) {
  me.send("z", e, t);
}
function Pn() {
  Gi.hidden = !Et;
  window.onbeforeunload = function (e) {
    return "Are you sure?";
  };
  if (window.FRVR) {
    window.FRVR.tracker.levelStart("game_start");
  }
  _n("moo_name", Ki.value);
  if (!qi && sr()) {
    qi = true;
    Wf.stop("menu");
    hr("Loading...");
    me.send("M", {
      name: Ki.value,
      moofoll: Sn,
      skin: or
    });
  }
  Dd();
}
function Dd() {
  var e = document.getElementById("ot-sdk-btn-floating");
  if (e) {
    e.style.display = "none";
  }
}
function Od() {
  var e = document.getElementById("ot-sdk-btn-floating");
  if (e) {
    e.style.display = "block";
  }
}
let $n = true;
let vs = false;
function _d(e) {
  fi.style.display = "none";
  Yi.style.display = "block";
  zn.style.display = "none";
  ut = {};
  $a = e;
  Ke = 0;
  qi = true;
  if ($n) {
    $n = false;
    Dt.length = 0;
  }
  if (Ma) {
    Vu.enable({
      onStartMoving: () => {
        Us();
        Ls();
        Ot(true);
        Xs = true;
      },
      onStopMoving: () => {
        Xs = false;
        Cn();
      },
      onRotateMoving: (t, i) => {
        if (!(i.force < 0.25)) {
          Ua = -i.angle.radian;
          Cn();
          if (!vs) {
            Mn = -i.angle.radian;
          }
        }
      },
      onStartAttacking: () => {
        Us();
        Ls();
        Ot(true);
        vs = true;
        if (P.buildIndex < 0) {
          Ke = 1;
          _t();
        }
      },
      onStopAttacking: () => {
        if (P.buildIndex >= 0) {
          Ke = 1;
          _t();
        }
        Ke = 0;
        _t();
        vs = false;
      },
      onRotateAttacking: (t, i) => {
        if (!(i.force < 0.25)) {
          Mn = -i.angle.radian;
        }
      }
    });
  }
}
function zd(e, t, i, n) {
  if (n === -1) {
    As.showText(e, t, 50, 0.18, 500, i, "#ee5551");
  } else {
    As.showText(e, t, 50, 0.18, 500, Math.abs(i), i >= 0 ? "#fff" : "#8ecc51");
  }
}
let gn = 99999;
function Bd() {
  qi = false;
  Od();
  try {
    factorem.refreshAds([2], true);
  } catch {}
  ar.style.display = "none";
  Ha();
  mn = {
    x: P.x,
    y: P.y
  };
  fi.style.display = "none";
  Fi.style.display = "block";
  Fi.style.fontSize = "0px";
  gn = 0;
  // TOLOOK
  setTimeout(function () {
    Yi.style.display = "block";
    zn.style.display = "block";
    Fi.style.display = "none";
  }, T.deathFadeout);
  Da();
}
function Hd(e) {
  if (P) {
    $e.removeAllItems(e);
  }
}
function Ld(e) {
  $e.disableBySid(e);
}
function qa() {
  Gf.innerText = P.points;
  Yf.innerText = P.food;
  Kf.innerText = P.wood;
  Zf.innerText = P.stone;
  Jf.innerText = P.kills;
}
const Di = {};
const ks = ["crown", "skull"];
function Fd() {
  for (let e = 0; e < ks.length; ++e) {
    const t = new Image();
    t.onload = function () {
      this.isLoaded = true;
    };
    t.src = "./img/icons/" + ks[e] + ".png";
    Di[ks[e]] = t;
  }
}
const Kt = [];
function Ga(e, t) {
  P.upgradePoints = e;
  P.upgrAge = t;
  if (e > 0) {
    Kt.length = 0;
    A.removeAllChildren(Gt);
    for (var i = 0; i < L.weapons.length; ++i) {
      if (L.weapons[i].age == t && (L.weapons[i].pre == null || P.weapons.indexOf(L.weapons[i].pre) >= 0)) {
        var n = A.generateElement({
          id: "upgradeItem" + i,
          class: "actionBarItem",
          onmouseout: function () {
            Ue();
          },
          parent: Gt
        });
        n.style.backgroundImage = document.getElementById("actionBarItem" + i).style.backgroundImage;
        Kt.push(i);
      }
    }
    for (var i = 0; i < L.list.length; ++i) {
      if (L.list[i].age == t && (L.list[i].pre == null || P.items.indexOf(L.list[i].pre) >= 0)) {
        const r = L.weapons.length + i;
        var n = A.generateElement({
          id: "upgradeItem" + r,
          class: "actionBarItem",
          onmouseout: function () {
            Ue();
          },
          parent: Gt
        });
        n.style.backgroundImage = document.getElementById("actionBarItem" + r).style.backgroundImage;
        Kt.push(r);
      }
    }
    for (var i = 0; i < Kt.length; i++) {
      (function (r) {
        const o = document.getElementById("upgradeItem" + r);
        o.onmouseover = function () {
          if (L.weapons[r]) {
            Ue(L.weapons[r], true);
          } else {
            Ue(L.list[r - L.weapons.length]);
          }
        };
        o.onclick = A.checkTrusted(function () {
          me.send("H", r);
        });
        A.hookTouchEvents(o);
      })(Kt[i]);
    }
    if (Kt.length) {
      Gt.style.display = "block";
      tn.style.display = "block";
      tn.innerHTML = "SELECT ITEMS (" + e + ")";
    } else {
      Gt.style.display = "none";
      tn.style.display = "none";
      Ue();
    }
  } else {
    Gt.style.display = "none";
    tn.style.display = "none";
    Ue();
  }
}
function Ya(e, t, i) {
  if (e != null) {
    P.XP = e;
  }
  if (t != null) {
    P.maxXP = t;
  }
  if (i != null) {
    P.age = i;
  }
  if (i == T.maxAge) {
    yo.innerHTML = "MAX AGE";
    wo.style.width = "100%";
  } else {
    yo.innerHTML = "AGE " + P.age;
    wo.style.width = P.XP / P.maxXP * 100 + "%";
  }
}
function Vd(e) {
  A.removeAllChildren(go);
  let t = 1;
  for (let i = 0; i < e.length; i += 3) {
    (function (n) {
      A.generateElement({
        class: "leaderHolder",
        parent: go,
        children: [A.generateElement({
          class: "leaderboardItem",
          style: "color:" + (e[n] == $a ? "#fff" : "rgba(255,255,255,0.6)"),
          text: t + ". " + (e[n + 1] != "" ? e[n + 1] : "unknown")
        }), A.generateElement({
          class: "leaderScore",
          text: A.kFormat(e[n + 2]) || "0"
        })]
      });
    })(i);
    t++;
  }
}
let bo = null;
function Nd() {
  {
    if (P && (!us || hi - us >= 1000 / T.clientSendRate)) {
      us = hi;
      const a = mr();
      if (bo !== a) {
        bo = a;
        me.send("D", a);
      }
    }
    if (gn < 120) {
      gn += Fe * 0.1;
      Fi.style.fontSize = Math.min(Math.round(gn), 120) + "px";
    }
    if (P) {
      const a = A.getDistance(ot, at, P.x, P.y);
      const f = A.getDirection(P.x, P.y, ot, at);
      const d = Math.min(a * 0.01 * Fe, a);
      if (a > 0.05) {
        ot += d * Math.cos(f);
        at += d * Math.sin(f);
      } else {
        ot = P.x;
        at = P.y;
      }
    } else {
      ot = T.mapScale / 2;
      at = T.mapScale / 2;
    }
    const o = hi - 1000 / T.serverUpdateRate;
    for (var e, t = 0; t < oe.length + Oe.length; ++t) {
      k = oe[t] || Oe[t - oe.length];
      if (k && k.visible) {
        if (k.forcePos) {
          k.x = k.x2;
          k.y = k.y2;
          k.dir = k.d2;
        } else {
          const a = k.t2 - k.t1;
          const d = (o - k.t1) / a;
          const u = 170;
          k.dt += Fe;
          const p = Math.min(1.7, k.dt / u);
          var e = k.x2 - k.x1;
          k.x = k.x1 + e * p;
          e = k.y2 - k.y1;
          k.y = k.y1 + e * p;
          k.dir = Math.lerpAngle(k.d2, k.d1, Math.min(1.2, d));
        }
      }
    }
    const l = ot - ge / 2;
    const c = at - ye / 2;
    if (T.snowBiomeTop - c <= 0 && T.mapScale - T.snowBiomeTop - c >= ye) {
      C.fillStyle = "#b6db66";
      C.fillRect(0, 0, ge, ye);
    } else if (T.mapScale - T.snowBiomeTop - c <= 0) {
      C.fillStyle = "#dbc666";
      C.fillRect(0, 0, ge, ye);
    } else if (T.snowBiomeTop - c >= ye) {
      C.fillStyle = "#fff";
      C.fillRect(0, 0, ge, ye);
    } else if (T.snowBiomeTop - c >= 0) {
      C.fillStyle = "#fff";
      C.fillRect(0, 0, ge, T.snowBiomeTop - c);
      C.fillStyle = "#b6db66";
      C.fillRect(0, T.snowBiomeTop - c, ge, ye - (T.snowBiomeTop - c));
    } else {
      C.fillStyle = "#b6db66";
      C.fillRect(0, 0, ge, T.mapScale - T.snowBiomeTop - c);
      C.fillStyle = "#dbc666";
      C.fillRect(0, T.mapScale - T.snowBiomeTop - c, ge, ye - (T.mapScale - T.snowBiomeTop - c));
    }
    if (!$n) {
      qt += fs * T.waveSpeed * Fe;
      if (qt >= T.waveMax) {
        qt = T.waveMax;
        fs = -1;
      } else if (qt <= 1) {
        qt = fs = 1;
      }
      C.globalAlpha = 1;
      C.fillStyle = "#dbc666";
      To(l, c, C, T.riverPadding);
      C.fillStyle = "#91b2db";
      To(l, c, C, (qt - 1) * 250);
    }
    /*C.lineWidth = 4;
    C.strokeStyle = "#000";
    C.globalAlpha = 0.06;
    C.beginPath();
    for (var i = -ot; i < ge; i += ye / 18) {
      if (i > 0) {
        C.moveTo(i, 0);
        C.lineTo(i, ye);
      }
    }
    for (let a = -at; a < ye; a += ye / 18) {
      if (i > 0) {
        C.moveTo(0, a);
        C.lineTo(ge, a);
      }
    }
    C.stroke();
    C.globalAlpha = 1;
    C.strokeStyle = Zi;*/
    Pi(-1, l, c);
    C.globalAlpha = 1;
    C.lineWidth = St;
    So(0, l, c);
    Mo(l, c, 0);
    C.globalAlpha = 1;
    for (var t = 0; t < Oe.length; ++t) {
      k = Oe[t];
      if (k.active && k.visible) {
        k.animate(Fe);
        C.save();
        C.translate(k.x - l, k.y - c);
        C.rotate(k.dir + k.dirPlus - Math.PI / 2);
        op(k, C);
        C.restore();
      }
    }
    Pi(0, l, c);
    So(1, l, c);
    Pi(1, l, c);
    Mo(l, c, 1);
    Pi(2, l, c);
    Pi(3, l, c);
    C.fillStyle = "#000";
    C.globalAlpha = 0.09;
    if (l <= 0) {
      C.fillRect(0, 0, -l, ye);
    }
    if (T.mapScale - l <= ge) {
      var n = Math.max(0, -c);
      C.fillRect(T.mapScale - l, n, ge - (T.mapScale - l), ye - n);
    }
    if (c <= 0) {
      C.fillRect(-l, 0, ge + l, -c);
    }
    if (T.mapScale - c <= ye) {
      var s = Math.max(0, -l);
      let a = 0;
      if (T.mapScale - l <= ge) {
        a = ge - (T.mapScale - l);
      }
      C.fillRect(s, T.mapScale - c, ge - s - a, ye - (T.mapScale - c));
    }
    C.globalAlpha = 1;
    C.fillStyle = "rgba(0, 0, 70, 0.35)";
    C.fillRect(0, 0, ge, ye);
    C.strokeStyle = ko;
    for (var t = 0; t < oe.length + Oe.length; ++t) {
      k = oe[t] || Oe[t - oe.length];
      if (k.visible && (k.skinIndex != 10 || k == P || k.team && k.team == P.team)) {
        const f = (k.team ? "[" + k.team + "] " : "") + (k.name || "");
        if (f != "") {
          C.font = (k.nameScale || 30) + "px Hammersmith One";
          C.fillStyle = "#fff";
          C.textBaseline = "middle";
          C.textAlign = "center";
          C.lineWidth = k.nameScale ? 11 : 8;
          C.lineJoin = "round";
          C.strokeText(f, k.x - l, k.y - c - k.scale - T.nameY);
          C.fillText(f, k.x - l, k.y - c - k.scale - T.nameY);
          if (k.isLeader && Di.crown.isLoaded) {
            var r = T.crownIconScale;
            var s = k.x - l - r / 2 - C.measureText(f).width / 2 - T.crownPad;
            C.drawImage(Di.crown, s, k.y - c - k.scale - T.nameY - r / 2 - 5, r, r);
          }
          if (k.iconIndex == 1 && Di.skull.isLoaded) {
            var r = T.crownIconScale;
            var s = k.x - l - r / 2 + C.measureText(f).width / 2 + T.crownPad;
            C.drawImage(Di.skull, s, k.y - c - k.scale - T.nameY - r / 2 - 5, r, r);
          }
        }
        if (k.health > 0) {
          T.healthBarWidth;
          C.fillStyle = ko;
          C.roundRect(k.x - l - T.healthBarWidth - T.healthBarPad, k.y - c + k.scale + T.nameY, T.healthBarWidth * 2 + T.healthBarPad * 2, 17, 8);
          C.fill();
          C.fillStyle = k == P || k.team && k.team == P.team ? "#8ecc51" : "#cc5151";
          C.roundRect(k.x - l - T.healthBarWidth, k.y - c + k.scale + T.nameY + T.healthBarPad, T.healthBarWidth * 2 * (k.health / k.maxHealth), 17 - T.healthBarPad * 2, 7);
          C.fill();
        }
      }
    }
    As.update(Fe, C, l, c);
    for (var t = 0; t < oe.length; ++t) {
      k = oe[t];
      if (k.visible && k.chatCountdown > 0) {
        k.chatCountdown -= Fe;
        if (k.chatCountdown <= 0) {
          k.chatCountdown = 0;
        }
        C.font = "32px Hammersmith One";
        const f = C.measureText(k.chatMessage);
        C.textBaseline = "middle";
        C.textAlign = "center";
        var s = k.x - l;
        var n = k.y - k.scale - c - 90;
        const p = 47;
        const w = f.width + 17;
        C.fillStyle = "rgba(0,0,0,0.2)";
        C.roundRect(s - w / 2, n - p / 2, w, p, 6);
        C.fill();
        C.fillStyle = "#fff";
        C.fillText(k.chatMessage, s, n);
      }
    }
  }
  wd(Fe);
}
function So(e, t, i) {
  for (let n = 0; n < ui.length; ++n) {
    k = ui[n];
    if (k.active && k.layer == e) {
      k.update(Fe);
      if (k.active && Za(k.x - t, k.y - i, k.scale)) {
        C.save();
        C.translate(k.x - t, k.y - i);
        C.rotate(k.dir);
        qs(0, 0, k, C);
        C.restore();
      }
    }
  }
}
const Io = {};
function qs(e, t, i, n, s) {
  if (i.src) {
    const r = L.projectiles[i.indx].src;
    let o = Io[r];
    if (!o) {
      o = new Image();
      o.onload = function () {
        this.isLoaded = true;
      };
      o.src = "./img/weapons/" + r + ".png";
      Io[r] = o;
    }
    if (o.isLoaded) {
      n.drawImage(o, e - i.scale / 2, t - i.scale / 2, i.scale, i.scale);
    }
  } else if (i.indx == 1) {
    n.fillStyle = "#939393";
    he(e, t, i.scale, n);
  }
}
function Ud() {
  const e = ot - ge / 2;
  const t = at - ye / 2;
  Ye.animationTime += Fe;
  Ye.animationTime %= T.volcanoAnimationDuration;
  const i = T.volcanoAnimationDuration / 2;
  const n = 1.7 + Math.abs(i - Ye.animationTime) / i * 0.3;
  const s = T.innerVolcanoScale * n;
  C.drawImage(Ye.land, Ye.x - T.volcanoScale - e, Ye.y - T.volcanoScale - t, T.volcanoScale * 2, T.volcanoScale * 2);
  C.drawImage(Ye.lava, Ye.x - s - e, Ye.y - s - t, s * 2, s * 2);
}
function To(e, t, i, n) {
  const s = T.riverWidth + n;
  const r = T.mapScale / 2 - t - s / 2;
  if (r < ye && r + s > 0) {
    i.fillRect(0, r, ge, s);
  }
}
function Pi(e, t, i) {
  let n;
  let s;
  let r;
  for (let o = 0; o < Dt.length; ++o) {
    k = Dt[o];
    if (k.active) {
      s = k.x + k.xWiggle - t;
      r = k.y + k.yWiggle - i;
      if (e == 0) {
        k.update(Fe);
      }
      if (k.layer == e && Za(s, r, k.scale + (k.blocker || 0))) {
        C.globalAlpha = k.hideFromEnemy ? 0.6 : 1;
        if (k.isItem) {
          n = yr(k);
          C.save();
          C.translate(s, r);
          C.rotate(k.dir);
          C.drawImage(n, -(n.width / 2), -(n.height / 2));
          if (k.blocker) {
            C.strokeStyle = "#db6e6e";
            C.globalAlpha = 0.3;
            C.lineWidth = 6;
            he(0, 0, k.blocker, C, false, true);
          }
          C.restore();
        } else if (k.type === 4) {
          Ud();
        } else {
          n = Gd(k);
          C.drawImage(n, s - n.width / 2, r - n.height / 2);
        }
      }
    }
  }
}
function Wd(e, t, i) {
  k = Hn(e);
  if (k) {
    k.startAnim(t, i);
  }
}
function Mo(e, t, i) {
  C.globalAlpha = 1;
  for (let n = 0; n < oe.length; ++n) {
    k = oe[n];
    if (k.zIndex == i) {
      k.animate(Fe);
      if (k.visible) {
        k.skinRot += Fe * 0.002;
        lo = (k == P ? mr() : k.dir) + k.dirPlus;
        C.save();
        C.translate(k.x - e, k.y - t);
        C.rotate(lo);
        Xd(k, C);
        C.restore();
      }
    }
  }
}
function Xd(e, t) {
  t = t || C;
  t.lineWidth = St;
  t.lineJoin = "miter";
  const i = Math.PI / 4 * (L.weapons[e.weaponIndex].armS || 1);
  const n = e.buildIndex < 0 && L.weapons[e.weaponIndex].hndS || 1;
  const s = e.buildIndex < 0 && L.weapons[e.weaponIndex].hndD || 1;
  if (e.tailIndex > 0) {
    qd(e.tailIndex, t, e);
  }
  if (e.buildIndex < 0 && !L.weapons[e.weaponIndex].aboveHand) {
    Ro(L.weapons[e.weaponIndex], T.weaponVariants[e.weaponVariant].src, e.scale, 0, t);
    if (L.weapons[e.weaponIndex].projectile != null && !L.weapons[e.weaponIndex].hideProjectile) {
      qs(e.scale, 0, L.projectiles[L.weapons[e.weaponIndex].projectile], C);
    }
  }
  t.fillStyle = T.skinColors[e.skinColor];
  he(e.scale * Math.cos(i), e.scale * Math.sin(i), 14);
  he(e.scale * s * Math.cos(-i * n), e.scale * s * Math.sin(-i * n), 14);
  if (e.buildIndex < 0 && L.weapons[e.weaponIndex].aboveHand) {
    Ro(L.weapons[e.weaponIndex], T.weaponVariants[e.weaponVariant].src, e.scale, 0, t);
    if (L.weapons[e.weaponIndex].projectile != null && !L.weapons[e.weaponIndex].hideProjectile) {
      qs(e.scale, 0, L.projectiles[L.weapons[e.weaponIndex].projectile], C);
    }
  }
  if (e.buildIndex >= 0) {
    const r = yr(L.list[e.buildIndex]);
    t.drawImage(r, e.scale - L.list[e.buildIndex].holdOffset, -r.width / 2);
  }
  he(0, 0, e.scale, t);
  if (e.skinIndex > 0) {
    t.rotate(Math.PI / 2);
    Ka(e.skinIndex, t, null, e);
  }
}
const Eo = {};
const Co = {};
let et;
function Ka(e, t, i, n) {
  et = Eo[e];
  if (!et) {
    const r = new Image();
    r.onload = function () {
      this.isLoaded = true;
      this.onload = null;
    };
    r.src = "./img/hats/hat_" + e + ".png";
    Eo[e] = r;
    et = r;
  }
  let s = i || Co[e];
  if (!s) {
    for (let r = 0; r < Vi.length; ++r) {
      if (Vi[r].id == e) {
        s = Vi[r];
        break;
      }
    }
    Co[e] = s;
  }
  if (et.isLoaded) {
    t.drawImage(et, -s.scale / 2, -s.scale / 2, s.scale, s.scale);
  }
  if (!i && s.topSprite) {
    t.save();
    t.rotate(n.skinRot);
    Ka(e + "_top", t, s, n);
    t.restore();
  }
}
const Po = {};
const $o = {};
function qd(e, t, i) {
  et = Po[e];
  if (!et) {
    const s = new Image();
    s.onload = function () {
      this.isLoaded = true;
      this.onload = null;
    };
    s.src = "./img/accessories/access_" + e + ".png";
    Po[e] = s;
    et = s;
  }
  let n = $o[e];
  if (!n) {
    for (let s = 0; s < Ni.length; ++s) {
      if (Ni[s].id == e) {
        n = Ni[s];
        break;
      }
    }
    $o[e] = n;
  }
  if (et.isLoaded) {
    t.save();
    t.translate(-20 - (n.xOff || 0), 0);
    if (n.spin) {
      t.rotate(i.skinRot);
    }
    t.drawImage(et, -(n.scale / 2), -(n.scale / 2), n.scale, n.scale);
    t.restore();
  }
}
var Gs = {};
function Ro(e, t, i, n, s) {
  const r = e.src + (t || "");
  let o = Gs[r];
  if (!o) {
    o = new Image();
    o.onload = function () {
      this.isLoaded = true;
    };
    o.src = "./img/weapons/" + r + ".png";
    Gs[r] = o;
  }
  if (o.isLoaded) {
    s.drawImage(o, i + e.xOff - e.length / 2, n + e.yOff - e.width / 2, e.length, e.width);
  }
}
const Ao = {};
function Gd(e) {
  const t = e.y >= T.mapScale - T.snowBiomeTop ? 2 : e.y <= T.snowBiomeTop ? 1 : 0;
  const i = e.type + "_" + e.scale + "_" + t;
  let n = Ao[i];
  if (!n) {
    const r = document.createElement("canvas");
    r.width = r.height = e.scale * 2.1 + St;
    const o = r.getContext("2d");
    o.translate(r.width / 2, r.height / 2);
    o.rotate(A.randFloat(0, Math.PI));
    o.strokeStyle = Zi;
    o.lineWidth = St;
    if (e.type == 0) {
      let l;
      for (var s = 0; s < 2; ++s) {
        l = k.scale * (s ? 0.5 : 1);
        qe(o, k.sid % 2 === 0 ? 5 : 7, l, l * 0.7);
        o.fillStyle = t ? s ? "#fff" : "#e3f1f4" : s ? "#b4db62" : "#9ebf57";
        o.fill();
        if (!s) {
          o.stroke();
        }
      }
    } else if (e.type == 1) {
      if (t == 2) {
        o.fillStyle = "#606060";
        qe(o, 6, e.scale * 0.3, e.scale * 0.71);
        o.fill();
        o.stroke();
        o.fillStyle = "#89a54c";
        he(0, 0, e.scale * 0.55, o);
        o.fillStyle = "#a5c65b";
        he(0, 0, e.scale * 0.3, o, true);
      } else {
        Zd(o, 6, k.scale, k.scale * 0.7);
        o.fillStyle = t ? "#e3f1f4" : "#89a54c";
        o.fill();
        o.stroke();
        o.fillStyle = t ? "#6a64af" : "#c15555";
        let l;
        const c = 4;
        const a = Rt / c;
        for (var s = 0; s < c; ++s) {
          l = A.randInt(k.scale / 3.5, k.scale / 2.3);
          he(l * Math.cos(a * s), l * Math.sin(a * s), A.randInt(10, 12), o);
        }
      }
    } else if (e.type == 2 || e.type == 3) {
      o.fillStyle = e.type == 2 ? t == 2 ? "#938d77" : "#939393" : "#e0c655";
      qe(o, 3, e.scale, e.scale);
      o.fill();
      o.stroke();
      o.fillStyle = e.type == 2 ? t == 2 ? "#b2ab90" : "#bcbcbc" : "#ebdca3";
      qe(o, 3, e.scale * 0.55, e.scale * 0.65);
      o.fill();
    }
    n = r;
    Ao[i] = n;
  }
  return n;
}
function Do(e, t, i) {
  const n = e.lineWidth || 0;
  i /= 2;
  e.beginPath();
  let s = Math.PI * 2 / t;
  for (let r = 0; r < t; r++) {
    e.lineTo(i + (i - n / 2) * Math.cos(s * r), i + (i - n / 2) * Math.sin(s * r));
  }
  e.closePath();
}
function Yd() {
  const t = T.volcanoScale * 2;
  const i = document.createElement("canvas");
  i.width = t;
  i.height = t;
  const n = i.getContext("2d");
  n.strokeStyle = "#3e3e3e";
  n.lineWidth = St * 2;
  n.fillStyle = "#7f7f7f";
  Do(n, 10, t);
  n.fill();
  n.stroke();
  Ye.land = i;
  const s = document.createElement("canvas");
  const r = T.innerVolcanoScale * 2;
  s.width = r;
  s.height = r;
  const o = s.getContext("2d");
  o.strokeStyle = Zi;
  o.lineWidth = St * 1.6;
  o.fillStyle = "#f54e16";
  o.strokeStyle = "#f56f16";
  Do(o, 10, r);
  o.fill();
  o.stroke();
  Ye.lava = s;
}
Yd();
const Oo = [];
function yr(e, t) {
  let i = Oo[e.id];
  if (!i || t) {
    const c = document.createElement("canvas");
    c.width = c.height = e.scale * 2.5 + St + (L.list[e.id].spritePadding || 0);
    const a = c.getContext("2d");
    a.translate(c.width / 2, c.height / 2);
    a.rotate(t ? 0 : Math.PI / 2);
    a.strokeStyle = Zi;
    a.lineWidth = St * (t ? c.width / 81 : 1);
    if (e.name == "apple") {
      a.fillStyle = "#c15555";
      he(0, 0, e.scale, a);
      a.fillStyle = "#89a54c";
      const f = -(Math.PI / 2);
      Kd(e.scale * Math.cos(f), e.scale * Math.sin(f), 25, f + Math.PI / 2, a);
    } else if (e.name == "cookie") {
      a.fillStyle = "#cca861";
      he(0, 0, e.scale, a);
      a.fillStyle = "#937c4b";
      for (var n = 4, s = Rt / n, r, o = 0; o < n; ++o) {
        r = A.randInt(e.scale / 2.5, e.scale / 1.7);
        he(r * Math.cos(s * o), r * Math.sin(s * o), A.randInt(4, 5), a, true);
      }
    } else if (e.name == "cheese") {
      a.fillStyle = "#f4f3ac";
      he(0, 0, e.scale, a);
      a.fillStyle = "#c3c28b";
      for (var n = 4, s = Rt / n, r, o = 0; o < n; ++o) {
        r = A.randInt(e.scale / 2.5, e.scale / 1.7);
        he(r * Math.cos(s * o), r * Math.sin(s * o), A.randInt(4, 5), a, true);
      }
    } else if (e.name == "wood wall" || e.name == "stone wall" || e.name == "castle wall") {
      a.fillStyle = e.name == "castle wall" ? "#83898e" : e.name == "wood wall" ? "#a5974c" : "#939393";
      const f = e.name == "castle wall" ? 4 : 3;
      qe(a, f, e.scale * 1.1, e.scale * 1.1);
      a.fill();
      a.stroke();
      a.fillStyle = e.name == "castle wall" ? "#9da4aa" : e.name == "wood wall" ? "#c9b758" : "#bcbcbc";
      qe(a, f, e.scale * 0.65, e.scale * 0.65);
      a.fill();
    } else if (e.name == "spikes" || e.name == "greater spikes" || e.name == "poison spikes" || e.name == "spinning spikes") {
      a.fillStyle = e.name == "poison spikes" ? "#7b935d" : "#939393";
      var l = e.scale * 0.6;
      qe(a, e.name == "spikes" ? 5 : 6, e.scale, l);
      a.fill();
      a.stroke();
      a.fillStyle = "#a5974c";
      he(0, 0, l, a);
      a.fillStyle = "#c9b758";
      he(0, 0, l / 2, a, true);
    } else if (e.name == "windmill" || e.name == "faster windmill" || e.name == "power mill") {
      a.fillStyle = "#a5974c";
      he(0, 0, e.scale, a);
      a.fillStyle = "#c9b758";
      xs(0, 0, e.scale * 1.5, 29, 4, a);
      a.fillStyle = "#a5974c";
      he(0, 0, e.scale * 0.5, a);
    } else if (e.name == "mine") {
      a.fillStyle = "#939393";
      qe(a, 3, e.scale, e.scale);
      a.fill();
      a.stroke();
      a.fillStyle = "#bcbcbc";
      qe(a, 3, e.scale * 0.55, e.scale * 0.65);
      a.fill();
    } else if (e.name == "sapling") {
      for (var o = 0; o < 2; ++o) {
        var l = e.scale * (o ? 0.5 : 1);
        qe(a, 7, l, l * 0.7);
        a.fillStyle = o ? "#b4db62" : "#9ebf57";
        a.fill();
        if (!o) {
          a.stroke();
        }
      }
    } else if (e.name == "pit trap") {
      a.fillStyle = "#a5974c";
      qe(a, 3, e.scale * 1.1, e.scale * 1.1);
      a.fill();
      a.stroke();
      a.fillStyle = Zi;
      qe(a, 3, e.scale * 0.65, e.scale * 0.65);
      a.fill();
    } else if (e.name == "boost pad") {
      a.fillStyle = "#7e7f82";
      ni(0, 0, e.scale * 2, e.scale * 2, a);
      a.fill();
      a.stroke();
      a.fillStyle = "#dbd97d";
      Jd(e.scale * 1, a);
    } else if (e.name == "turret") {
      a.fillStyle = "#a5974c";
      he(0, 0, e.scale, a);
      a.fill();
      a.stroke();
      a.fillStyle = "#939393";
      const f = 50;
      ni(0, -f / 2, e.scale * 0.9, f, a);
      he(0, 0, e.scale * 0.6, a);
      a.fill();
      a.stroke();
    } else if (e.name == "platform") {
      a.fillStyle = "#cebd5f";
      const f = 4;
      const d = e.scale * 2;
      const u = d / f;
      let p = -(e.scale / 2);
      for (var o = 0; o < f; ++o) {
        ni(p - u / 2, 0, u, e.scale * 2, a);
        a.fill();
        a.stroke();
        p += d / f;
      }
    } else if (e.name == "healing pad") {
      a.fillStyle = "#7e7f82";
      ni(0, 0, e.scale * 2, e.scale * 2, a);
      a.fill();
      a.stroke();
      a.fillStyle = "#db6e6e";
      xs(0, 0, e.scale * 0.65, 20, 4, a, true);
    } else if (e.name == "spawn pad") {
      a.fillStyle = "#7e7f82";
      ni(0, 0, e.scale * 2, e.scale * 2, a);
      a.fill();
      a.stroke();
      a.fillStyle = "#71aad6";
      he(0, 0, e.scale * 0.6, a);
    } else if (e.name == "blocker") {
      a.fillStyle = "#7e7f82";
      he(0, 0, e.scale, a);
      a.fill();
      a.stroke();
      a.rotate(Math.PI / 4);
      a.fillStyle = "#db6e6e";
      xs(0, 0, e.scale * 0.65, 20, 4, a, true);
    } else if (e.name == "teleporter") {
      a.fillStyle = "#7e7f82";
      he(0, 0, e.scale, a);
      a.fill();
      a.stroke();
      a.rotate(Math.PI / 4);
      a.fillStyle = "#d76edb";
      he(0, 0, e.scale * 0.5, a, true);
    }
    i = c;
    if (!t) {
      Oo[e.id] = i;
    }
  }
  return i;
}
function Kd(e, t, i, n, s) {
  const r = e + i * Math.cos(n);
  const o = t + i * Math.sin(n);
  const l = i * 0.4;
  s.moveTo(e, t);
  s.beginPath();
  s.quadraticCurveTo((e + r) / 2 + l * Math.cos(n + Math.PI / 2), (t + o) / 2 + l * Math.sin(n + Math.PI / 2), r, o);
  s.quadraticCurveTo((e + r) / 2 - l * Math.cos(n + Math.PI / 2), (t + o) / 2 - l * Math.sin(n + Math.PI / 2), e, t);
  s.closePath();
  s.fill();
  s.stroke();
}
function he(e, t, i, n, s, r) {
  n = n || C;
  n.beginPath();
  n.arc(e, t, i, 0, Math.PI * 2);
  if (!r) {
    n.fill();
  }
  if (!s) {
    n.stroke();
  }
}
function qe(e, t, i, n) {
  let s = Math.PI / 2 * 3;
  let r;
  let o;
  const l = Math.PI / t;
  e.beginPath();
  e.moveTo(0, -i);
  for (let c = 0; c < t; c++) {
    r = Math.cos(s) * i;
    o = Math.sin(s) * i;
    e.lineTo(r, o);
    s += l;
    r = Math.cos(s) * n;
    o = Math.sin(s) * n;
    e.lineTo(r, o);
    s += l;
  }
  e.lineTo(0, -i);
  e.closePath();
}
function ni(e, t, i, n, s, r) {
  s.fillRect(e - i / 2, t - n / 2, i, n);
  if (!r) {
    s.strokeRect(e - i / 2, t - n / 2, i, n);
  }
}
function xs(e, t, i, n, s, r, o) {
  r.save();
  r.translate(e, t);
  s = Math.ceil(s / 2);
  for (let l = 0; l < s; l++) {
    ni(0, 0, i * 2, n, r, o);
    r.rotate(Math.PI / s);
  }
  r.restore();
}
function Zd(e, t, i, n) {
  let s = Math.PI / 2 * 3;
  const r = Math.PI / t;
  let o;
  e.beginPath();
  e.moveTo(0, -n);
  for (let l = 0; l < t; l++) {
    o = A.randInt(i + 0.9, i * 1.2);
    e.quadraticCurveTo(Math.cos(s + r) * o, Math.sin(s + r) * o, Math.cos(s + r * 2) * n, Math.sin(s + r * 2) * n);
    s += r * 2;
  }
  e.lineTo(0, -n);
  e.closePath();
}
function Jd(e, t) {
  t = t || C;
  const i = e * (Math.sqrt(3) / 2);
  t.beginPath();
  t.moveTo(0, -i / 2);
  t.lineTo(-e / 2, i / 2);
  t.lineTo(e / 2, i / 2);
  t.lineTo(0, -i / 2);
  t.fill();
  t.closePath();
}
function Qd() {
  const e = T.mapScale / 2;
  $e.add(0, e, e + 200, 0, T.treeScales[3], 0);
  $e.add(1, e, e - 480, 0, T.treeScales[3], 0);
  $e.add(2, e + 300, e + 450, 0, T.treeScales[3], 0);
  $e.add(3, e - 950, e - 130, 0, T.treeScales[2], 0);
  $e.add(4, e - 750, e - 400, 0, T.treeScales[3], 0);
  $e.add(5, e - 700, e + 400, 0, T.treeScales[2], 0);
  $e.add(6, e + 800, e - 200, 0, T.treeScales[3], 0);
  $e.add(7, e - 260, e + 340, 0, T.bushScales[3], 1);
  $e.add(8, e + 760, e + 310, 0, T.bushScales[3], 1);
  $e.add(9, e - 800, e + 100, 0, T.bushScales[3], 1);
  $e.add(10, e - 800, e + 300, 0, L.list[4].scale, L.list[4].id, L.list[10]);
  $e.add(11, e + 650, e - 390, 0, L.list[4].scale, L.list[4].id, L.list[10]);
  $e.add(12, e - 400, e - 450, 0, T.rockScales[2], 2);
}
function jd(e) {
  for (let t = 0; t < e.length;) {
    $e.add(e[t], e[t + 1], e[t + 2], e[t + 3], e[t + 4], e[t + 5], L.list[e[t + 6]], true, e[t + 7] >= 0 ? {
      sid: e[t + 7]
    } : null);
    t += 8;
  }
}
function ep(e, t) {
  k = Qa(t);
  if (k) {
    k.xWiggle += T.gatherWiggle * Math.cos(e);
    k.yWiggle += T.gatherWiggle * Math.sin(e);
  }
}
function tp(e, t) {
  k = Qa(e);
  if (k) {
    k.dir = t;
    k.xWiggle += T.gatherWiggle * Math.cos(t + Math.PI);
    k.yWiggle += T.gatherWiggle * Math.sin(t + Math.PI);
  }
}
function ip(e, t, i, n, s, r, o, l) {
  if (lr) {
    Pa.addProjectile(e, t, i, n, s, r, null, null, o).sid = l;
  }
}
function np(e, t) {
  for (let i = 0; i < ui.length; ++i) {
    if (ui[i].sid == e) {
      ui[i].range = t;
    }
  }
}
function sp(e) {
  k = Ja(e);
  if (k) {
    k.startAnim();
  }
}
function rp(e) {
  for (var t = 0; t < Oe.length; ++t) {
    Oe[t].forcePos = !Oe[t].visible;
    Oe[t].visible = false;
  }
  if (e) {
    const i = Date.now();
    for (var t = 0; t < e.length;) {
      k = Ja(e[t]);
      if (k) {
        k.index = e[t + 1];
        k.t1 = k.t2 === undefined ? i : k.t2;
        k.t2 = i;
        k.x1 = k.x;
        k.y1 = k.y;
        k.x2 = e[t + 2];
        k.y2 = e[t + 3];
        k.d1 = k.d2 === undefined ? e[t + 4] : k.d2;
        k.d2 = e[t + 4];
        k.health = e[t + 5];
        k.dt = 0;
        k.visible = true;
      } else {
        k = ao.spawn(e[t + 2], e[t + 3], e[t + 4], e[t + 1]);
        k.x2 = k.x;
        k.y2 = k.y;
        k.d2 = k.dir;
        k.health = e[t + 5];
        if (!ao.aiTypes[e[t + 1]].name) {
          k.name = T.cowNames[e[t + 6]];
        }
        k.forcePos = true;
        k.sid = e[t];
        k.visible = true;
      }
      t += 7;
    }
  }
}
const _o = {};
function op(e, t) {
  const i = e.index;
  let n = _o[i];
  if (!n) {
    const s = new Image();
    s.onload = function () {
      this.isLoaded = true;
      this.onload = null;
    };
    s.src = "./img/animals/" + e.src + ".png";
    n = s;
    _o[i] = n;
  }
  if (n.isLoaded) {
    const s = e.scale * 1.2 * (e.spriteMlt || 1);
    t.drawImage(n, -s, -s, s * 2, s * 2);
  }
}
function Za(e, t, i) {
  return e + i >= 0 && e - i <= ge && t + i >= 0 && t - i <= ye;
}
function ap(e, t) {
  let i = dp(e[0]);
  if (!i) {
    i = new Gh(e[0], e[1], T, A, Pa, $e, oe, Oe, L, Vi, Ni);
    oe.push(i);
  }
  i.spawn(t ? Sn : null);
  i.visible = false;
  i.x2 = undefined;
  i.y2 = undefined;
  i.setData(e);
  if (t) {
    P = i;
    ot = P.x;
    at = P.y;
    La();
    qa();
    Ya();
    Ga(0);
    ar.style.display = "block";
  }
}
function lp(e) {
  for (let t = 0; t < oe.length; t++) {
    if (oe[t].id == e) {
      oe.splice(t, 1);
      break;
    }
  }
}
function cp(e, t) {
  if (P) {
    P.itemCounts[e] = t;
  }
}
function hp(e, t, i) {
  if (P) {
    P[e] = t;
    if (i) {
      qa();
    }
  }
}
function up(e, t) {
  k = Hn(e);
  if (k) {
    k.health = t;
  }
}
function fp(e) {
  const t = Date.now();
  for (var i = 0; i < oe.length; ++i) {
    oe[i].forcePos = !oe[i].visible;
    oe[i].visible = false;
  }
  for (var i = 0; i < e.length;) {
    k = Hn(e[i]);
    if (k) {
      k.t1 = k.t2 === undefined ? t : k.t2;
      k.t2 = t;
      k.x1 = k.x;
      k.y1 = k.y;
      k.x2 = e[i + 1];
      k.y2 = e[i + 2];
      k.d1 = k.d2 === undefined ? e[i + 3] : k.d2;
      k.d2 = e[i + 3];
      k.dt = 0;
      k.buildIndex = e[i + 4];
      k.weaponIndex = e[i + 5];
      k.weaponVariant = e[i + 6];
      k.team = e[i + 7];
      k.isLeader = e[i + 8];
      k.skinIndex = e[i + 9];
      k.tailIndex = e[i + 10];
      k.iconIndex = e[i + 11];
      k.zIndex = e[i + 12];
      k.visible = true;
    }
    i += 13;
  }
}
function dp(e) {
  for (let t = 0; t < oe.length; ++t) {
    if (oe[t].id == e) {
      return oe[t];
    }
  }
  return null;
}
function Hn(e) {
  for (let t = 0; t < oe.length; ++t) {
    if (oe[t].sid == e) {
      return oe[t];
    }
  }
  return null;
}
function Ja(e) {
  for (let t = 0; t < Oe.length; ++t) {
    if (Oe[t].sid == e) {
      return Oe[t];
    }
  }
  return null;
}
function Qa(e) {
  for (let t = 0; t < Dt.length; ++t) {
    if (Dt[t].sid == e) {
      return Dt[t];
    }
  }
  return null;
}
let ja = -1;
function pp() {
  const e = Date.now() - ja;
  window.pingTime = e;
  Gi.innerText = "Ping: " + e + " ms";
}
let bs;
function el() {
  if (bs) {
    clearTimeout(bs);
  }
  if (sr()) {
    ja = Date.now();
    me.send("0");
  }
  bs = // TOLOOK
  setTimeout(el, 2500);
}
function mp(e) {
  if (e < 0) {
    return;
  }
  const t = Math.floor(e / 60);
  let i = e % 60;
  i = ("0" + i).slice(-2);
  po.innerText = "Server restarting in " + t + ":" + i;
  po.hidden = false;
}
window.requestAnimFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (e) {
    window.setTimeout(e, 1000 / 60);
  };
}();
function tl() {
  hi = Date.now();
  Fe = hi - oo;
  oo = hi;
  Nd();
  requestAnimFrame(tl);
}
Qd();
tl();
function il(e) {
  window.open(e, "_blank");
}
window.openLink = il;
window.aJoinReq = Fs;
window.follmoo = Xf;
window.kickFromClan = Oa;
window.sendJoin = _a;
window.leaveAlliance = za;
window.createAlliance = Vs;
window.storeBuy = Ba;
window.storeEquip = Ws;
window.showItemInfo = Ue;
window.selectSkinColor = Td;
window.changeStoreIndex = vd;
window.config = T;