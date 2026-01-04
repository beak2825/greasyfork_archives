// ==UserScript==
// @name         King Mod v2 ( My Version Mod )
// @namespace    http://tampermonkey.net/
// @version      v2.8.19.3
// @description  Ok
// @author       2k09__
// @match        https://moomoo.io/
// @match        https://dev.moomoo.io/
// @match        https://sandbox.moomoo.io/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494264/King%20Mod%20v2%20%28%20My%20Version%20Mod%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/494264/King%20Mod%20v2%20%28%20My%20Version%20Mod%20%29.meta.js
// ==/UserScript==
 alert(`Macro Hat, AutoHeal, MacroPlace. Go?`);
document.title = "King Mod v2";
document.getElementById("gameName").innerHTML = "King Mod v2";
document.getElementById("deadText").innerHTML = "Me Are King !!";
document.getElementById("leaderboard").innerHTML = "King Mod v2";
document.getElementById("loadingText").innerHTML = "Reload...";
$("#moomooio_728x90_home").parent().css({display: "none"});
let AutoHeal = true;
let ws;
let msgpack5 = window.msgpack;
let food = food.myPlayer.inventory.food;
let boostPad = boostPad.myPlayer.inventory.boostPad;
let spike = spike.myPlayer.inventory.spike;
let windmill = spike.myPlayer.inventory.windmill;
let wall = wall.myPlayer.inventory.wall;
let trap = trap.myPlayer.inventory.trap;
let turret = turret.myPlayer.inventory.turret;
let spawnpad = spawnpad.myPlayer.inventory.spawnpad;
let teleporter = teleporter.myPlayer.inventory.teleporter;
const MooMoo = (function(){})[69];
const emit = (event, a, b, c, m, r) => ws.send(Uint8Array.from([...msgpack5.encode([event, [a, b, c, m, r]])]));

    const place = (event, l) => {
        emit("G", event, false);
        emit("d", 1, l);
        emit("d", 0, l);
        emit("G", myPlayer.weaponIndex, true);
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
AutoHeal.addEventListener("updatehealth", (data) => {
    let sid = data[0]
    let health = data[1]

    if (AutoHeal.myPlayer.sid === sid && health < 100) {

        if(health < 100 && health > 79) {
        setTimeout(() => {
        buyAndEquipHat(11)
        buyAndEquipAccesory(13)
        AutoHeal.myPlayer.place(food);
        }, 90);
        } else if(health < 80 && health > 59) {
            buyAndEquipHat(7);
            buyAndEquipAccesory(17);
            setTimeout(() => {
                AutoHeal.myPlayer.place(food);
                AutoHeal.myPlayer.place(food);
            }, 90);
        } else if(health < 60 && health > 39) {
            buyAndEquipHat(11);
            buyAndEquipAccesory(21);
            AutoHeal.myPlayer.place(food);
            AutoHeal.myPlayer.place(food);
        } else if(health < 40 && health > 0) {
            buyAndEquipHat(6);
            buyAndEquipAccesory(13);
            AutoHeal.myPlayer.place(food);
            AutoHeal.myPlayer.place(food);
            AutoHeal.myPlayer.place(food);
        };
    };
});
let prevCount = 0;
const attachWebSocketListener = e => {
  e.addEventListener("message", hookWS);
};
const hookWS = e => {
  // You can add actions related to WebSocket messages here
};
const sendPacket = e => {
  if (ws) {
    ws.send(msgpack5.encode(e));
  };
};
const chat = e => {
  sendPacket(["6", [e]]);
};
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (e) {
  if (!ws) {
    [document.ws, ws] = [this, this];
    attachWebSocketListener(this);
  };
  this.oldSend(e);
};
const handleMutations = mutationsList => {
  for (const mutation of mutationsList) {
    if (mutation.target.id === "killCounter") {
      const count = parseInt(mutation.target.innerText, 10) || 0;
      if (count > prevCount) {
          setTimeout(() => {
              chat("King Mod: +1 kill");
          }, 90);
          setTimeout(() => {
              chat("King Mod v2");
          }, 90);
          setTimeout(() => {
              chat("King Mod By 2k09__");
          }, 90);
        prevCount = count;
      };
    };
  };
};
if (document.activeElement.id !== 'chatBox'){
        document.addEventListener('keydown', function(e) {
            switch (e.keyCode) {
               // Place
                    case 78: place('windmill'); break;
                    case 86: place('spike'); break;
                    case 70: place('trap'); break;
                    case 70: place('boostPad'); break;
                    case 72: place('turret'); break;
                    case 72: place('teleporter'); break;
                    case 85: place('spawnpad'); break;
                    case 79: place('wall'); break;
               // Hat
                    case 16: buyAndEquipHat('Unequip'); break;
                    case 82: buyAndEquipHat('BullHelmet'); break;
                    case 90: buyAndEquipHat('TankGear'); break;
                    case 71: buyAndEquipHat('SoldierHelmet'); break;
                    case 66: buyAndEquipHat('BoosterHat'); break;
                    case 89: buyAndEquipHat('FlipperHat'); break;
                    case 77: buyAndEquipHat('WinterCap'); break;
                    case 74: buyAndEquipHat('EmpHelmet'); break;
                    case 84: buyAndEquipHat('TurretGear'); break;
                    case 88: buyAndEquipHat('ThiefGear'); break;
                    case 76: buyAndEquipHat('BarbarianArmor'); break;
                    case 75: buyAndEquipHat('SamuraiArmor'); break;
                    case 73: buyAndEquipHat('AssassinGear'); break;
               // Accesory
                    case 16: buyAndEquipAccesory('Unequip'); break;
                    case 82: buyAndEquipAccesory('BloodWings'); break;
                    case 90 && 88 && 75: buyAndEquipAccesory('ShadowWings'); break;
                    case 71 && 66 && 77 && 89 && 74 && 73: buyAndEquipAccesory('MonkeyTail'); break;
                    case 84: buyAndEquipAccesory('CorruptXWings'); break;
                    case 76: buyAndEquipAccesory('AngelWings'); break;
            };
        });
    };
