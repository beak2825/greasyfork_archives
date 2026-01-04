// ==UserScript==
// @name         Tank Upgrades
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Use with wasm hook!
// @author       8_no
// @match        https://diep.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454037/Tank%20Upgrades.user.js
// @updateURL https://update.greasyfork.org/scripts/454037/Tank%20Upgrades.meta.js
// ==/UserScript==
//tank ids
function magicNum(build) {
  for (var i = 0, seed = 1, res = 0, timer = 0; i < 40; i++) {
   let nibble = parseInt(build[i], 16);
   res ^= ((nibble << ((seed & 1) << 2)) << (timer << 3));
   timer = (timer + 1) & 3;
   seed ^= !timer;
  };

  return res >>> 0; // unsigned
}
let t = {
    tank: 0,
    twin: 1,
    triplet:2,
    tripleshot: 3,
    quad: 4,
    octo: 5,
    sniper: 6,
    machine: 7,
    flank: 8,
    triangle: 9,
    destroyer: 10,
    overseer: 11,
    overlord: 12,
    twinflank: 13,
    penta: 14,
    assasin: 15,
    arenacloser: 16,
    necro: 17,
    tripletwin: 18,
    hunter: 19,
    gunner: 20,
    stalker: 21,
    Ranger: 22,
    booster: 23,
    fighter: 24,
    hybrid: 25,
    manager: 26,
    mothership: 27,
    predator: 28,
    sprayer: 29,
    predatorx: "", // Deleted : Probably Predator X
    trapper: 31,
    gunnertrapper: 32,
    overtrapper: 33,
    megatrapper: 34,
    tritrapper: 35,
    smasher: 36,
    megasmasher: "", // Deleted : Probably Mega Smasher
    landmine: 38,
    autogunner: 39,
    auto5: 40,
    auto3: 41,
    spreadshot: 42,
    streamliner: 43,
    autotrapper: 44,
    dominator3: "Dominator", // Destroyer
    dominator1: "Dominator", // Gunner
    dominator2: "Dominator", // Trapper
    battleship: 48,
    anni: 49,
    autosmasher: 50,
    Spike: 51,
    fac: 52,
    ball: "", // Nameless and the "initial tank" value. Looks like the Ball tank
    skimmer: 54,
    rocketeer: 55,

    length: 56
};
var mnumber = magicNum('a43f408a71c2d8d0ed162aaa4f8bdacf37957b748') % 54;
var tank = ( t.tank ^ mnumber) <<1
var twin = ( t.twin ^ mnumber) <<1
var triplet = ( t.triplet ^ mnumber) <<1
var tripleshot = ( t.tripleshot ^ mnumber) <<1
var quad = ( t.quad ^ mnumber) <<1
var octo = ( t.octo ^ mnumber) <<1
var sniper= ( t.sniper ^ mnumber) <<1
var machine= ( t.machine ^ mnumber) <<1
var flank= ( t.flank ^ mnumber) <<1
var triangle= ( t.triangle ^ mnumber) <<1
var destroyer= ( t.destroyer ^ mnumber) <<1
var overseer= ( t.overseer ^ mnumber) <<1
var overlord= ( t.overlord ^ mnumber) <<1
var twinflank= ( t.twinflank ^ mnumber) <<1
var penta= ( t.penta ^ mnumber) <<1
var assasin= ( t.assasin ^ mnumber) <<1
var necro= ( t.necro ^ mnumber) <<1
var tripletwin= ( t.tripletwin ^ mnumber) <<1
var hunter= ( t.hunter ^ mnumber) <<1
var gunner= ( t.gunner ^ mnumber) <<1
var stalker= ( t.stalker ^ mnumber) <<1
var Ranger= ( t.Ranger ^ mnumber) <<1
var booster= ( t.booster ^ mnumber) <<1
var fighter= ( t.fighter ^ mnumber) <<1
var hybrid= ( t.hybrid ^ mnumber) <<1
var manager= ( t.manager ^ mnumber) <<1
var predator= ( t.predator ^ mnumber) <<1
var sprayer= ( t.sprayer ^ mnumber) <<1
var trapper= ( t.trapper ^ mnumber) <<1
var tritrapper= ( t.tritrapper ^ mnumber) <<1
var megatrapper= ( t.megatrapper ^ mnumber) <<1
var gunnertrapper= ( t.gunnertrapper ^ mnumber) <<1
var overtrapper= ( t.overtrapper ^ mnumber) <<1
var smasher= ( t.smasher ^ mnumber) <<1
var landmine= ( t.landmine ^ mnumber) <<1
var autogunner= ( t.autogunner ^ mnumber) <<1
var auto5= ( t.auto5 ^ mnumber) <<1
var auto3= ( t.auto3 ^ mnumber) <<1
var spreadshot= ( t.spreadshot ^ mnumber) <<1
var streamliner= ( t.streamliner ^ mnumber) <<1
var autotrapper= ( t.autotrapper ^ mnumber) <<1
var battleship= ( t.battleship ^ mnumber) <<1
var anni= ( t.anni ^ mnumber) <<1
var autosmasher= ( t.autosmasher ^ mnumber) <<1
var Spike= ( t.Spike ^ mnumber) <<1
var fac= ( t.fac ^ mnumber) <<1
var skimmer= ( t.skimmer ^ mnumber) <<1
var rocketeer= ( t.rocketeer ^ mnumber) <<1
//code
var died = true;
//script1
var locked = true;
var upgradeRanger = false;
var upgradeOctoGL = false;
var upgradeOctoSSP = false;
var upgradeSpreadGL = false;
var upgradeSpreadSSP = false;
var upgradePredator = false;
var upgradeFighter = false;
//script2
var locked2 = true;
var upgradeTriplet = false;
var upgradeOverlord = false;
var upgradeFactory = false;
var upgradeAuto5 = false;
var upgradePenta = false;
var upgradeAutoGunner = false;
var upgradeStreamLiner = false;

document.addEventListener("keydown", (kc) => {
             if (kc.keyCode === 106) {
                 locked = !locked
             }
                if(!locked) {
                    locked2 = true;
                    upgradeTriplet =false;
                    upgradeOverlord = false;
                    upgradeFactory = false;
                    upgradeAuto5 = false;
                    upgradePenta = false;
                    upgradeAutoGunner = false;
                    upgradeStreamLiner = false;
                  if (kc.keyCode === 82) {
                  upgradeRanger = !upgradeRanger
                  upgradeOctoGL = false;
                  upgradeOctoSSP = false;
                  upgradeSpreadGL = false;
                  upgradeSpreadSSP = false;
                  upgradePredator = false;
                  upgradeFighter = false;
                  }
                  if (kc.keyCode === 79) {
                  upgradeOctoGL = !upgradeOctoGL
                  upgradeRanger = false;
                  upgradeOctoSSP = false;
                  upgradeSpreadGL = false;
                  upgradeSpreadSSP = false;
                  upgradePredator = false;
                  upgradeFighter = false;
                  }
                    if (kc.keyCode === 80) {
                  upgradeOctoSSP = !upgradeOctoSSP
                   upgradeOctoGL = false;
                  upgradeRanger = false;
                  upgradeSpreadGL = false;
                  upgradeSpreadSSP = false;
                  upgradePredator = false;
                  upgradeFighter = false;
                  }
                    if (kc.keyCode === 81) {
                  upgradeSpreadGL = !upgradeSpreadGL
                  upgradeOctoGL = false;
                  upgradeOctoSSP = false;
                  upgradeRanger = false;
                  upgradeSpreadSSP = false;
                  upgradePredator = false;
                  upgradeFighter = false;
                  }
                    if (kc.keyCode === 84) {
                  upgradeSpreadSSP = !upgradeSpreadSSP
                  upgradeOctoGL = false;
                  upgradeOctoSSP = false;
                  upgradeSpreadGL = false;
                  upgradeRanger = false;
                  upgradePredator = false;
                  upgradeFighter = false;
                  }
                    if (kc.keyCode === 71) {
                  upgradePredator = !upgradePredator
                  upgradeOctoGL = false;
                  upgradeOctoSSP = false;
                  upgradeSpreadGL = false;
                  upgradeSpreadSSP = false;
                  upgradeRanger = false;
                  upgradeFighter = false;
                  }
                    if (kc.keyCode === 70) {
                  upgradeFighter = !upgradeFighter
                   upgradeOctoGL = false;
                  upgradeOctoSSP = false;
                  upgradeSpreadGL = false;
                  upgradeSpreadSSP = false;
                  upgradePredator = false;
                  upgradeRanger = false;
                  }
                }
                if (kc.keyCode === 109) {
                 locked2 = !locked2
                }
                 if(!locked2) {
                     locked = true;
                 upgradeRanger = false;
                 upgradeOctoGL = false;
                 upgradeOctoSSP = false;
                 upgradeSpreadGL = false;
                 upgradeSpreadSSP = false;
                 upgradePredator = false;
                 upgradeFighter = false;
                     if (kc.keyCode === 82) {
                     upgradeTriplet = !upgradeTriplet
upgradeOverlord = false;
upgradeFactory = false;
upgradeAuto5 = false;
upgradePenta = false;
upgradeAutoGunner = false;
upgradeStreamLiner = false;
                     }
                     if (kc.keyCode === 79) {
                     upgradeOverlord = !upgradeOverlord
upgradeTriplet = false;
upgradeFactory = false;
upgradeAuto5 = false;
upgradePenta = false;
upgradeAutoGunner = false;
upgradeStreamLiner = false;
                     }
                     if (kc.keyCode === 80) {
                     upgradeFactory = !upgradeFactory
upgradeTriplet = false;
upgradeOverlord = false;
upgradeAuto5 = false;
upgradePenta = false;
upgradeAutoGunner = false;
upgradeStreamLiner = false;
                     }
                     if (kc.keyCode === 81) {
                     upgradeAuto5 = !upgradeAuto5
upgradeTriplet = false;
upgradeOverlord = false;
upgradeFactory = false;
upgradePenta = false;
upgradeAutoGunner = false;
upgradeStreamLiner = false;
                     }
                     if (kc.keyCode === 84) {
                     upgradePenta = !upgradePenta
upgradeTriplet = false;
upgradeOverlord = false;
upgradeFactory = false;
upgradeAuto5 = false;
upgradeAutoGunner = false;
upgradeStreamLiner = false;
                     }
                     if (kc.keyCode === 71) {
                     upgradeAutoGunner = !upgradeAutoGunner
upgradeTriplet = false;
upgradeOverlord = false;
upgradeFactory = false;
upgradeAuto5 = false;
upgradePenta = false;
upgradeStreamLiner = false;
                     }
                     if (kc.keyCode === 70) {
                     upgradeStreamLiner = !upgradeStreamLiner
upgradeTriplet = false;
upgradeOverlord = false;
upgradeFactory = false;
upgradeAuto5 = false;
upgradePenta = false;
upgradeAutoGunner = false;
                     }
                 }
});

function s2() {
    if(input.should_prevent_unload()) {
        if (died) {
//alive
            if (!locked || !locked2) {
            died=false;
            input.keyDown(69);input.keyUp(69);
            }

              };
         }else{
//dead
             if (!locked || !locked2) {
                  died=true;
             input.execute("game_spawn Enter_Your_Name");
                 }
         }
}

function uupgradeRanger() {
    if(upgradeRanger) {
    Hook.send([4, sniper]);
    Hook.send([4, assasin]);
    Hook.send([4, Ranger]);
    input.execute('game_stats_build 565656565656567777777444448888888');
    }
}


function uupgradeOctoGL() {
    if(upgradeOctoGL){
    Hook.send([4, twin]);
    Hook.send([4, quad]);
    Hook.send([4, octo]);
    input.execute('game_stats_build 565656565656567777777444448888888');
    }
}

function uupgradeOctoSSP() {
    if(upgradeOctoSSP){
    Hook.send([4, twin]);
    Hook.send([4, quad]);
    Hook.send([4, octo]);
    input.execute('game_stats_build 565656565656567777777888888822333');
    }
}

function uupgradeSpreadGL() {
    if(upgradeSpreadGL){
    Hook.send([4, twin]);
    Hook.send([4, tripleshot]);
    Hook.send([4, spreadshot]);
    input.execute('game_stats_build 565656565656567777777444448888888');
    }
}

function uupgradeSpreadSSP() {
    if(upgradeSpreadSSP){
    Hook.send([4, twin]);
    Hook.send([4, tripleshot]);
    Hook.send([4, spreadshot]);
    input.execute('game_stats_build 565656565656567777777888888822333');
    }
}

function uupgradePredator() {
    if(upgradePredator){
    Hook.send([4, sniper]);
    Hook.send([4, hunter]);
    Hook.send([4, predator]);
    input.execute('game_stats_build 565656565656567777777444448888888');
    }
}

function uupgradeFighter() {
    if(upgradeFighter){
    Hook.send([4, flank]);
    Hook.send([4, triangle]);
    Hook.send([4, fighter]);
    input.execute('game_stats_build 565656565656567777777888888822333');
    }
}

//script2
function uupgradeTriplet() {
    if(upgradeTriplet){
    Hook.send([4, twin]);
    Hook.send([4, tripleshot]);
    Hook.send([4, triplet]);
    input.execute('game_stats_build 565656565656567777777444448888888');
    }
}

function uupgradeOverlord() {
    if(upgradeOverlord){
    Hook.send([4, sniper]);
    Hook.send([4, overseer]);
    Hook.send([4, overlord]);
    input.execute('game_stats_build 565656565656564444444888888877233');
    }
}

function uupgradeFactory() {
    if(upgradeFactory){
    Hook.send([4, sniper]);
    Hook.send([4, overseer]);
    Hook.send([4, fac]);
    input.execute('game_stats_build 565656565656564444444888888877723');
    }
}

function uupgradeAuto5() {
    if(upgradeAuto5){
    Hook.send([4, flank]);
    Hook.send([4, auto3]);
    Hook.send([4, auto5]);
    input.execute('game_stats_build 565656565656567777777444444488888');
    }
}

function uupgradePenta() {
    if(upgradePenta){
    Hook.send([4, twin]);
    Hook.send([4, tripleshot]);
    Hook.send([4, penta]);
    input.execute('game_stats_build 565656565656567777777444448888888');
    }
}

function uupgradeAutoGunner() {
    if(upgradeAutoGunner){
    Hook.send([4, machine]);
    Hook.send([4, gunner]);
    Hook.send([4, autogunner]);
    input.execute('game_stats_build 565656565656567777777444444888888');
    }
}

function uupgradeStreamliner() {
    if(upgradeStreamLiner){
    Hook.send([4, machine]);
    Hook.send([4, gunner]);
    Hook.send([4, streamliner]);
    input.execute('game_stats_build 565656565656567777777444444888888');
    }
}
//interval
//script1
setInterval(uupgradeRanger, 500);
setInterval(uupgradeOctoGL, 500);
setInterval(uupgradeOctoSSP, 500);
setInterval(uupgradeSpreadGL, 500);
setInterval(uupgradeSpreadSSP, 500);
setInterval(uupgradePredator, 500);
setInterval(uupgradeFighter, 500);
setInterval(s2, 500);
//script2
setInterval(uupgradeTriplet, 500);
setInterval(uupgradeOverlord, 500);
setInterval(uupgradeFactory, 500);
setInterval(uupgradeAuto5, 500);
setInterval(uupgradePenta, 500);
setInterval(uupgradeAutoGunner, 500);
setInterval(uupgradeStreamliner, 500);

//gui
const ctx = canvas.getContext("2d");
setTimeout(() => {
    let gui = () => {
        ctx.beginPath();
        ctx.rect(15, 110, 360, 40);
        ctx.strokeStyle = "firebrick";
        ctx.stroke();

        ctx.rect(15, 110, 360, 40);
        ctx.fillStyle = "darkred";
        ctx.fill();

        ctx.fillStyle = "gold";
        ctx.lineWidth = 7;
        ctx.font = 2 + "em Ubuntu";
        ctx.fillText(`Tank Upgrades by 8_no`, 20, 140);
//script1
ctx.beginPath();
ctx.lineWidth = "6";
ctx.fillStyle = "darkgray";
ctx.rect(5, 160, 270, 180);
ctx.fill();

ctx.beginPath();
ctx.lineWidth = "6";
if(locked){
ctx.strokeStyle = "darkred";
}else{
ctx.strokeStyle = "darkgreen";
}
ctx.rect(5, 160, 270, 180);
ctx.stroke();
        ctx.fillStyle = "magenta";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "purple";
        ctx.strokeText(`[*]:script1 enabled?:`, 10, 180);
        ctx.fillText(`[*]:script1 enabled?:`, 10, 180);

        if(locked){
        ctx.fillStyle = "red";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`disabled`, 200, 180);
        ctx.fillText(`disabled`, 200, 180);
        }else{
        ctx.fillStyle = "lime";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`enabled`, 200, 180);
        ctx.fillText(`enabled`, 200, 180);
        }

        ctx.fillStyle = "pink";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "purple";
        ctx.strokeText(`[R]:Ranger:`, 10, 200);
        ctx.fillText(`[R]:Ranger:`, 10, 200);

        if(!upgradeRanger){
        ctx.fillStyle = "red";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`disabled`, 200, 200);
        ctx.fillText(`disabled`, 200, 200);
        }else{
        ctx.fillStyle = "lime";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`enabled`, 200, 200);
        ctx.fillText(`enabled`, 200, 200);
        }

        ctx.fillStyle = "pink";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "purple";
        ctx.strokeText(`[O]:OctoGL:`, 10, 220);
        ctx.fillText(`[O]:OctoGL:`, 10, 220);

        if(!upgradeOctoGL){
        ctx.fillStyle = "red";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`disabled`, 200, 220);
        ctx.fillText(`disabled`, 200, 220);
        }else{
        ctx.fillStyle = "lime";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`enabled`, 200, 220);
        ctx.fillText(`enabled`, 200, 220);
        }

        ctx.fillStyle = "pink";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "purple";
        ctx.strokeText(`[P]:OctoSSP: `, 10, 240);
        ctx.fillText(`[P]:OctoSSP: `, 10, 240);

        if(!upgradeOctoSSP){
        ctx.fillStyle = "red";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`disabled`, 200, 240);
        ctx.fillText(`disabled`, 200, 240);
        }else{
        ctx.fillStyle = "lime";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`enabled`, 200, 240);
        ctx.fillText(`enabled`, 200, 240);
        }

        ctx.fillStyle = "pink";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "purple";
        ctx.strokeText(`[Q]:SpreadGL:`, 10, 260);
        ctx.fillText(`[Q]:SpreadGL:`, 10, 260);

        if(!upgradeSpreadGL){
        ctx.fillStyle = "red";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`disabled`, 200, 260);
        ctx.fillText(`disabled`, 200, 260);
        }else{
        ctx.fillStyle = "lime";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`enabled`, 200, 260);
        ctx.fillText(`enabled`, 200, 260);
        }

        ctx.fillStyle = "pink";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "purple";
        ctx.strokeText(`[T]:SpreadSSP:`, 10, 280);
        ctx.fillText(`[T]:SpreadSSP:`, 10, 280);

        if(!upgradeSpreadSSP){
        ctx.fillStyle = "red";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`disabled`, 200, 280);
        ctx.fillText(`disabled`, 200, 280);
        }else{
        ctx.fillStyle = "lime";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`enabled`, 200, 280);
        ctx.fillText(`enabled`, 200, 280);
        }

        ctx.fillStyle = "pink";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "purple";
        ctx.strokeText(`[G]:Predator:`, 10, 300);
        ctx.fillText(`[G]:Predator:`, 10, 300);

        if(!upgradePredator){
        ctx.fillStyle = "red";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`disabled`, 200, 300);
        ctx.fillText(`disabled`, 200, 300);
        }else{
        ctx.fillStyle = "lime";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`enabled`, 200, 300);
        ctx.fillText(`enabled`, 200, 300);
        }

        ctx.fillStyle = "pink";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "purple";
        ctx.strokeText(`[F]:Fighter:`, 10, 320);
        ctx.fillText(`[F]:Fighter:`, 10, 320);

        if(!upgradeFighter){
        ctx.fillStyle = "red";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`disabled`, 200, 320);
        ctx.fillText(`disabled`, 200, 320);
        }else{
        ctx.fillStyle = "lime";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`enabled`, 200, 320);
        ctx.fillText(`enabled`, 200, 320);
        }
//script2
ctx.beginPath();
ctx.lineWidth = "6";
ctx.fillStyle = "darkgray";
ctx.rect(295, 160, 280, 180);
ctx.fill();

ctx.beginPath();
ctx.lineWidth = "6";
if(locked2){
ctx.strokeStyle = "darkred";
}else{
ctx.strokeStyle = "darkgreen";
}
ctx.rect(295, 160, 280, 180);
ctx.stroke();
        ctx.fillStyle = "blue";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "dodgerblue";
        ctx.strokeText(`[-]:script2 enabled?:`, 300, 180);
        ctx.fillText(`[-]:script2 enabled?:`, 300, 180);

        if(locked2){
        ctx.fillStyle = "red";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`disabled`, 500, 180);
        ctx.fillText(`disabled`, 500, 180);
        }else{
        ctx.fillStyle = "lime";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`enabled`, 500, 180);
        ctx.fillText(`enabled`, 500, 180);
        }

        ctx.fillStyle = "skyblue";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "dodgerblue";
        ctx.strokeText(`[R]:Triplet:`, 300, 200);
        ctx.fillText(`[R]:Triplet:`, 300, 200);

        if(!upgradeTriplet){
        ctx.fillStyle = "red";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`disabled`, 500, 200);
        ctx.fillText(`disabled`, 500, 200);
        }else{
        ctx.fillStyle = "lime";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`enabled`, 500, 200);
        ctx.fillText(`enabled`, 500, 200);
        }

        ctx.fillStyle = "skyblue";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "dodgerblue";
        ctx.strokeText(`[O]:Overlord:`, 300, 220);
        ctx.fillText(`[O]:Overlord:`, 300, 220);

        if(!upgradeOverlord){
        ctx.fillStyle = "red";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`disabled`, 500, 220);
        ctx.fillText(`disabled`, 500, 220);
        }else{
        ctx.fillStyle = "lime";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`enabled`, 500, 220);
        ctx.fillText(`enabled`, 500, 220);
        }

        ctx.fillStyle = "skyblue";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "dodgerblue";
        ctx.strokeText(`[P]:Factory: `, 300, 240);
        ctx.fillText(`[P]:Factory: `, 300, 240);

        if(!upgradeFactory){
        ctx.fillStyle = "red";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`disabled`, 500, 240);
        ctx.fillText(`disabled`, 500, 240);
        }else{
        ctx.fillStyle = "lime";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`enabled`, 500, 240);
        ctx.fillText(`enabled`, 500, 240);
        }

        ctx.fillStyle = "skyblue";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "dodgerblue";
        ctx.strokeText(`[Q]:Auto5:`, 300, 260);
        ctx.fillText(`[Q]:Auto5:`, 300, 260);

        if(!upgradeAuto5){
        ctx.fillStyle = "red";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`disabled`, 500, 260);
        ctx.fillText(`disabled`, 500, 260);
        }else{
        ctx.fillStyle = "lime";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`enabled`, 500, 260);
        ctx.fillText(`enabled`, 500, 260);
        }

        ctx.fillStyle = "skyblue";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "dodgerblue";
        ctx.strokeText(`[T]:Penta:`, 300, 280);
        ctx.fillText(`[T]:Penta:`, 300, 280);

        if(!upgradePenta){
        ctx.fillStyle = "red";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`disabled`, 500, 280);
        ctx.fillText(`disabled`, 500, 280);
        }else{
        ctx.fillStyle = "lime";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`enabled`, 500, 280);
        ctx.fillText(`enabled`, 500, 280);
        }

        ctx.fillStyle = "skyblue";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "dodgerblue";
        ctx.strokeText(`[G]:AutoGunner:`, 300, 300);
        ctx.fillText(`[G]:AutoGunner:`, 300, 300);

        if(!upgradeAutoGunner){
        ctx.fillStyle = "red";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`disabled`, 500, 300);
        ctx.fillText(`disabled`, 500, 300);
        }else{
        ctx.fillStyle = "lime";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`enabled`, 500, 300);
        ctx.fillText(`enabled`, 500, 300);
        }

        ctx.fillStyle = "skyblue";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "dodgerblue";
        ctx.strokeText(`[F]:Streamliner:`, 300, 320);
        ctx.fillText(`[F]:Streamliner:`, 300, 320);

        if(!upgradeStreamLiner){
        ctx.fillStyle = "red";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`disabled`, 500, 320);
        ctx.fillText(`disabled`, 500, 320);
        }else{
        ctx.fillStyle = "lime";
        ctx.lineWidth = 5;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`enabled`, 500, 320);
        ctx.fillText(`enabled`, 500, 320);
        }
        window.requestAnimationFrame(gui);
    }
    gui();
    setTimeout(() => {
        gui();
    },5000);
}, 1000);