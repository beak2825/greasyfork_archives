// ==UserScript==
// @name         Negger Mod v3
// @namespace    http://tampermonkey.net/
// @version      v3.1.9
// @description  L
// @author       2k09__
// @match        https://moomoo.io/
// @match        https://dev.moomoo.io/
// @match        https://sandbox.moomoo.io/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494189/Negger%20Mod%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/494189/Negger%20Mod%20v3.meta.js
// ==/UserScript==
document.title = "Negger Mod";
document.getElementById("gameName").innerHTML = "Negger Mod";
document.getElementById("gameName").style.color = 'blue';
document.getElementById("deadText").innerHTML = "Shhhhh";
document.getElementById("deadText").style.color = 'blue';
document.getElementById("loadingText").innerHTML = "Reload Game...";
document.getElementById("loadingText").style.color = 'black';
document.getElementById("leaderboard").innerHTML = "Negger Mod By 2k09__";
document.getElementById("leaderboard").style.color = 'black';
$("#moomooio_728x90_home").parent().css({display: "none"});

const MooMoo = (function(){})[69];

let ws;
let msgpack5 = window.msgpack;
const emit = (event, a, b, c, m, r) => ws.send(Uint8Array.from([...msgpack5.encode([event, [a, b, c, m, r]])]));
    const place = (event, l) => {
        emit("G", event, false);
        emit("d", 1, l);
        emit("d", 0, l);
        emit("G", myPlayer.weaponIndex, true);
    };
    const hit = function (ang) {
        emit("d", 1, ang);
        emit("d", 0, ang);
        emit("G", myPlayer.weaponIndex, true);
    };

var enemy = {
    id: null,
    x: null,
    y: null,
    dir: null,
    object: null,
    weapon: null,
    clan: null,
    isLeader: null,
    hat: null,
    accesory: null,
    isSkull: null,
    sid: null,
    buildIndex: null,
    weaponIndex: null,
    weaponVariant: null,
    team: null,
    skinIndex: null,
    tailIndex: null,
    iconIndex: null
};

var myPlayer = {
    id: null,
    x: null,
    y: null,
    dir: null,
    object: null,
    weapon: null,
    clan: null,
    isLeader: null,
    hat: null,
    accesory: null,
    isSkull: null,
    sid: null,
    buildIndex: null,
    weaponIndex: null,
    weaponVariant: null,
    team: null,
    skinIndex: null,
    tailIndex: null,
    iconIndex: null
};

let food = food.myPlayer.inventory.food;
let boostPad = boostPad.myPlayer.inventory.boostPad;
let spike = spike.myPlayer.inventory.spike;
let windmill = spike.myPlayer.inventory.windmill;
let wall = wall.myPlayer.inventory.wall;
let trap = trap.myPlayer.inventory.trap;
let turret = turret.myPlayer.inventory.turret;
let spawnpad = spawnpad.myPlayer.inventory.spawnpad;
let teleporter = teleporter.myPlayer.inventory.teleporter;

var accesory = {
    Unequip: 0,
    Snowball: 12,
    TreeCape: 9,
    StoneCape: 10,
    CookieCape: 3,
    CowCape: 8,
    MonkeyTail: 11,
    AppleBasket: 17,
    WinterCape: 6,
    SkullCape: 4,
    DashCape: 5,
    DragonCape: 2,
    SuperCape: 1,
    TrollCape: 7,
    Thorns: 14,
    Blockades: 15,
    DevilsTail: 20,
    Sawblade: 16,
    AngelWings: 13,
    ShadowWings: 19,
    BloodWings: 18,
    CorruptXWings: 21
};

var hat = {
    Unequip: 0,
    MooCap: 51,
    AppleCap: 50,
    MooHead: 28,
    PigHead: 29,
    FluffHead: 30,
    PandouHead: 36,
    BearHead: 37,
    MonkeyHead: 38,
    PolarHead: 44,
    FezHat: 35,
    EnigmaHat: 42,
    BlitzHat: 43,
    BobXIIIHat: 49,
    Pumpkin: 57,
    BummleHat: 8,
    StrawHat: 2,
    WinterCap: 15,
    CowboyHat: 5,
    RangerHat: 4,
    ExplorerHat: 18,
    FlipperHat: 31,
    MarksmanCap: 1,
    BushGear: 10,
    Halo: 48,
    SoldierHelmet: 6,
    AntiVenomGear: 23,
    MedicGear: 13,
    MinersHelmet: 9,
    MusketeerHat: 32,
    BullHelmet: 7,
    EmpHelmet: 22,
    BoosterHat: 12,
    BarbarianArmor: 26,
    PlagueMask: 21,
    BullMask: 46,
    WindmillHat: 14,
    SpikeGear: 11,
    TurretGear: 53,
    SamuraiArmor: 20,
    DarkKnight: 58,
    ScavengerGear: 27,
    TankGear: 40,
    ThiefGear: 52,
    Bloodthirster: 55,
    AssassinGear: 56
   };
    function buyAndEquipHat(name) {
        var target = hat.name;
        storeBuy(target);
        storeEquip(target);
    };
    function buyAndEquipAccesory(name) {
        var target2 = accesory.name;
        storeBuy(target2);
        storeEquip(target2);
    };


      let {
         secondary: o,
      } = MooMoo.myPlayer.inventory,
      h = MooMoo.ActivePlayerManage.getClosestTrapAngle(), {
          hammer: p,
      } = MooMoo.myPlayer.inventory,
          j = MooMoo.ActivePlayerManager.getClosestRunAnge(), {
              hammer: s,
          } = MooMoo.myPlayer.inventory,
         t = MooMoo.ActivePlayerManager.getClosestEnemyAngle(), {
            primary: a,
             repeatcrossbow: l,
             } = MooMoo.myPlayer.inventory,
             k = MooMoo.ActivePlayerManager.getClosestRiverAngle(), {
                 hammer: n,
             } = MooMoo.myPlayer.inventory
function Insta() {
    Insta.myPlayer.hit(t);
    Insta.myPlayer.buyHat(12);
    Insta.myPlayer.equipHat(12);
    Insta.myPlayer.buyAccesory(11);
    Insta.myPlayer.equipAccesory(11);
    Insta.sendPacket("5", a, true);
    setTimeout(() => {
    Insta.myPlayer.hit(t);
    Insta.myPlayer.buyHat(7);
    Insta.myPlayer.equipHat(7);
    Insta.myPlayer.buyAccesory(13);
    Insta.myPlayer.equipAccesory(13);
    Insta.sendPacket("5", a, true);
    }, 100);
    setTimeout(() => {
    Insta.myPlayer.hit(t);
    Insta.myPlayer.buyHat(53);
    Insta.myPlayer.equipHat(53);
    Insta.myPlayer.buyAccesory(21);
    Insta.myPlayer.equipAccesory(21);
    Insta.sendPacket("5", o, true);
    }, 200);
    Insta.addEventListener('keydown', function(event) {
        if (event.keyCode === 82) {
            Insta
        };
    });
};

function OneTick() {
    OneTick.myPlayer.hit(t);
    OneTick.myPlayer.buyHat(12);
    OneTick.myPlayer.equipHat(12);
    OneTick.myPlayer.buyAccesory(11);
    OneTick.myPlayer.equipAccesory(11);
    OneTick.sendPacket("5", o, l, true);
    setTimeout(() => {
    OneTick.myPlayer.hit(t);
    OneTick.myPlayer.buyHat(53);
    OneTick.myPlayer.equipHat(53);
    OneTick.myPlayer.buyAccesory(21);
    OneTick.myPlayer.equipAccesory(21);
    OneTick.myPlayer.place(boostPad.hit in enemy);
    OneTick.sendPacket("5", o, l, true);
    }, 100);
    setTimeout(() => {
    OneTick.myPlayer.hit(t);
    OneTick.myPlayer.buyHat(7);
    OneTick.myPlayer.equipHat(7);
    OneTick.myPlayer.buyAccesory(18);
    OneTick.myPlayer.equipAccesory(18);
    OneTick.sendPacket("5", a, true);
    }, 200);
    OneTick.addEventListener('keydown', function(event) {
        if (event.keyCode === 190) {
            OneTick
        };
    });
};
function ReverseInsta() {
    ReverseInsta.myPlayer.hit(t);
    ReverseInsta.myPlayer.buyHat(12);
    ReverseInsta.myPlayer.equipHat(12);
    ReverseInsta.myPlayer.buyAccesory(11);
    ReverseInsta.myPlayer.EquipAccesory(11);
    ReverseInsta.sendPacket("5", a, true);
    setTimeout(() => {
    ReverseInsta.myPlayer.hit(t);
    ReverseInsta.myPlayer.buyHat(53);
    ReverseInsta.myPlayer.equipHat(53);
    ReverseInsta.myPlayer.buyAccesory(21);
    ReverseInsta.myPlayer.EquipAccesory(21);
    ReverseInsta.sendPacket("5", o, true);
    }, 100);
    setTimeout(() => {
    ReverseInsta.myPlayer.hit(t);
    ReverseInsta.myPlayer.buyHat(7);
    ReverseInsta.myPlayer.equipHat(7);
    ReverseInsta.myPlayer.buyAccesory(13);
    ReverseInsta.myPlayer.equipAccesory(13);
    ReverseInsta.sendPacket("5", a, true);
    }, 200);
    ReverseInsta.addEventListener('keydown', function(event) {
        if (event.keyCode === 71) {
            ReverseInsta
        };
    });
};
function Insta2Spike() {
    Insta2Spike.myPlayer.hit(t);
    Insta2Spike.myPlayer.buyHat(6);
    Insta2Spike.myPlayer.equipHat(6);
    Insta2Spike.myPlayer.buyAccesory(21);
    Insta2Spike.myPlayer.EquipAccesory(21);
    Insta2Spike.sendPacket("5", a, true);
    setTimeout(() => {
    Insta2Spike.myPlayer.hit(t);
    Insta2Spike.myPlayer.buyHat(7);
    Insta2Spike.myPlayer.equipHat(7);
    Insta2Spike.myPlayer.buyAccesory(18);
    Insta2Spike.myPlayer.EquipAccesory(18);
    Insta2Spike.myPlayer.place(spike.hit + spike.hit in enemy);
    Insta2Spike.sendPacket("5", a, true);
    }, 100);
    setTimeout(() => {
    Insta2Spike.myPlayer.hit(t);
    Insta2Spike.myPlayer.buyHat(53);
    Insta2Spike.myPlayer.equipHat(53);
    Insta2Spike.myPlayer.buyAccesory(21);
    Insta2Spike.myPlayer.EquipAccesory(21);
    Insta2Spike.sendPacket("5", a, true);
    }, 200);
    Insta2Spike.addEventListener('keydown', function(event) {
        if (event.keyCode === 89) {
            Insta2Spike
        };
    });
};
function Speed() {
    Speed.myPlayer.buyHat(7);
    Speed.myPlayer.equipHat(7);
    Speed.myPlayer.buyAccesory(13);
    Speed.myPlayer.equipAccesory(13);
    Speed.sendPacket("5", a, true);
    setTimeout(() => {
    Speed.myPlayer.buyHat(12);
    Speed.myPlayer.equipHat(12);
    Speed.myPlayer.buyAccesory(11);
    Speed.myPlayer.equipAccesory(11);
    Speed.sendPacket("5", a, l, true);
    }, 100);
    Speed.addEventListener('keydown', function(event) {
        if (event.keyCode === 16) {
            Speed
        };
    });
};
function Break() {
    Break.myPlayer.hit(h);
    Break.myPlayer.equipHat(50);
    Break.myPlayer.buyAccesory(11);
    Break.myPlayer.equipAccesory(11);
    Break.myPlayer.place.hit(trap + trap in hit.trapEnemy);
    Break.sendPacket("5", a, l, true);
    setTimeout(() => {
    Break.myPlayer.hit(h);
    Break.myPlayer.buyHat(53)
    Break.myPlayer.equipHat(53);
    Break.myPlayer.buyAccesory(14);
    Break.myPlayer.equipAccesory(14);
    Break.sendPacket("5", a, l, true);
    }, 100);
    Break.addEventListener('keydown', function(event) {
        if (event.keyCode === 92) {
            Break
        };
    });
};
function Atack() {
    Atack.myPlayer.hit(t)
    Atack.myPlayer.buyHat(6);
    Atack.myPlayer.equipHat(6);
    Atack.myPlayer.buyAccesory(21);
    Atack.myPlayer.equipAccesory(21);
    Atack.sendPacket("5", a, true);
    setTimeout(() => {
    Atack.myPlayer.hit(t)
    Atack.myPlayer.buyHat(7);
    Atack.myPlayer.equipHat(7);
    Atack.myPlayer.buyAccesory(13);
    Atack.myPlayer.equipAccesory(13);
    Atack.sendPacket("5", a, true);
    }, 100);
    Atack.addEventListener('keydown', function(event) {
        if (Atack.keyCode === 91) {
            Atack
        };
    });
};
function FlipperMode() {
    FlipperMode.myPlayer.hit(k);
    FlipperMode.myPlayer.buyHat(12);
    FlipperMode.myPlayer.equipHat(12);
    FlipperMode.myPlayer.buyAccesory(11);
    FlipperMode.myPlayer.equipAccesory(11);
    FlipperMode.sendPacket("5", a, l, true);
    setTimeout(() => {
    FlipperMode.myPlayer.hit(k);
    FlipperMode.myPlayer.buyHat(31);
    FlipperMode.myPlayer.equipHat(31);
    FlipperMode.myPlayer.buyAccesory(11);
    FlipperMode.myPlayer.equipAccesory(11);
    FlipperMode.sendPacket("5", a, n, true);
    }, 100);
    FlipperMode.addEventListener('keydown', function(event) {
        if (event.keyCode === 189 || event.keyCode === 191 || event.keyCode === 220) {
            FlipperMode
        };
    });
};

var AutoHeal = true;
AutoHeal.addEventListener("updatehealth", (data) => {
    let sid = data[0]
    let health = data[1]

    if (AutoHeal.myPlayer.sid === sid && health < 100) {

        if(health < 100 && health > 79) {
        setTimeout(() => {
        AutoHeal.myPlayer.place(food);
        AutoHeal.myPlayer.place(food);
        }, 90);
        } else if(health < 80 && health > 59) {
            buyAndEquipHat(6);
            buyAndEquipAccesory(21);
            setTimeout(() => {
                AutoHeal.myPlayer.place(food);
                AutoHeal.myPlayer.place(food);
                AutoHeal.myPlayer.place(food);
            }, 90);
        } else if(health < 60 && health > 39) {
            buyAndEquipHat(7);
            buyAndEquipAccesory(13);
            AutoHeal.myPlayer.place(food);
            AutoHeal.myPlayer.place(food);
            AutoHeal.myPlayer.place(food);
        } else if(health < 40 && health > 0) {
            buyAndEquipHat(7);
            buyAndEquipAccesory(13);
            AutoHeal.myPlayer.place(food);
            AutoHeal.myPlayer.place(food);
            AutoHeal.myPlayer.place(food);
        };
    };
});
if (document.activeElement.id !== 'chatBox'){
        document.addEventListener('keydown', function(e) {
            switch (e.keyCode) {
                case 78: place('windmill'); break;
                case 86: place('spike'); break;
                case 70: place('trap'); break;
                case 70: place('boostPad'); break;
                case 72: place('turret'); break;
                case 72: place('teleporter'); break;
                case 85: place('spawnpad'); break;
                case 79: place('wall'); break;
            }
        });
};