// ==UserScript==
// @name         Zombs.io ( SELL STASH + SELL ALL + AUTO UPGRADE ALL + AUTO HARVEST RESOURCE COLLECT + AUTO BOW )
// @namespace    -
// @version      0.62
// @description  ( Sell Stash Key } ) ( Sell All Key " ) ( Auto Upgrade All and Stash X ) ( Auto Harvest Resource Collect Key C ) and ( AUTO BOW KEY Z )
// @author       L O L O L and someone unknown...
// @match        zombs.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383328/Zombsio%20%28%20SELL%20STASH%20%2B%20SELL%20ALL%20%2B%20AUTO%20UPGRADE%20ALL%20%2B%20AUTO%20HARVEST%20RESOURCE%20COLLECT%20%2B%20AUTO%20BOW%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/383328/Zombsio%20%28%20SELL%20STASH%20%2B%20SELL%20ALL%20%2B%20AUTO%20UPGRADE%20ALL%20%2B%20AUTO%20HARVEST%20RESOURCE%20COLLECT%20%2B%20AUTO%20BOW%20%29.meta.js
// ==/UserScript==

window.addEventListener("onkeydown", keyDown, true);
window.addEventListener("keydown", keyDown);

function keyDown(e) {
  switch (e.keyCode) {
      case 222:
      SellAll();
      break;
      case 221:
      SellStash();
      break;
      case 90:
      startbow();
      stopbow();
      break;
  }
}
setInterval(function () {
    if (document.querySelectorAll(".hud-chat .hud-chat-input:focus")[0]) {
        window.removeEventListener("keydown", keyDown);
    } else {
        window.addEventListener("keydown", keyDown);
    }
}, 0);
window.SellStash = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "GoldStash") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}
var Settings = '';
Settings += "<button class=\"btn btn-green\"style=\"width: 100%;\" onclick=\"SellStash();\">Sell Stash?</button>";
Settings += "<button class=\"btn btn-green\"style=\"width: 100%;\" onclick=\"SellAll();\">Sell All?</button>";
Settings += "<button class=\"btn btn-green\"style=\"width: 100%;\" onclick=\"UpgradeStash();\">Upgrade Stash?</button>";
Settings += "<button class=\"btn btn-green\"style=\"width: 100%;\" onclick=\"UpgradeAll();\">Upgrade All?</button>";
Settings += "<button class=\"btn btn-green\"style=\"width: 100%;\" onclick=\"Refuel();\">Refuel?</button>";
Settings += "<button class=\"btn btn-green\"style=\"width: 100%;\" onclick=\"Collect();\">Collect?</button>";
Settings += '<button id="bow" class="btn btn-blue" style="width: 100%; height: 50px;">Turn Autobow On</button>';
document.getElementsByClassName("hud-settings-grid")[0].innerHTML = Settings;
//AutoBow
var button25 = document.getElementById("bow");
button25.addEventListener("click", startbow);
button25.addEventListener("click", stopbow);
var bow = null;
function startbow() {
clearInterval(bow);
  if (bow !== null) {
    bow = null;
  } else {
          if(Game.currentGame.ui.inventory.Bow) {
              Game.currentGame.network.sendRpc({
                        name: "EquipItem",
                        itemName: "Bow",
                        tier: Game.currentGame.ui.inventory.Bow.tier
                  })
              bow = setInterval(function() {
                  Game.currentGame.inputPacketScheduler.scheduleInput({
                            space: 1
                            })
                  Game.currentGame.inputPacketScheduler.scheduleInput({
                            space: 0
                            })
                  Game.currentGame.inputPacketScheduler.scheduleInput({
                            space: 0
                            })
                }, 0);
           }
     }
}
          function stopbow() {
  var trade = document.getElementById("bow");
  if (trade.innerHTML == "Turn Autobow On") {
    trade.innerHTML = "Turn Autobow Off";
  } else {
    trade.innerHTML = "Turn Autobow On";
  }
}

window.SellAll = function() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model !== "GoldStash") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    }

window.UpgradeAll = function() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model !== "GoldStash") {
                Game.currentGame.network.sendRpc({
                    name: "UpgradeBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    }

    window.UpgradeStash = function() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model == "GoldStash") {
                Game.currentGame.network.sendRpc({
                    name: "UpgradeBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    }

window.Refuel = function() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model == "Harvester") {
                let e = Game.currentGame.world.getEntityByUid(obj.fromTick.uid).getTargetTick();
                let i = Math.floor(e.depositMax);
                Game.currentGame.network.sendRpc({
                    name: "AddDepositToHarvester",
                    uid: obj.fromTick.uid,
                    deposit: i
                });
            }
        }
    }

    window.Collect = function() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model == "Harvester") {
                Game.currentGame.network.sendRpc({
                    name: "CollectHarvester",
                    uid: obj.fromTick.uid
                });
            }
        }
    }
    var timer = null;

function speed(e) {
    switch (e.keyCode) {
        case 67:
            if (timer == null) {
                timer = setInterval(function () {
                    Refuel();
                    Collect();
                }, -999);
            } else {
                clearInterval(timer);
                timer = null;
            }
            break;
    }
}
            var timer2 = null;

function speed2(e) {
    switch (e.keyCode) {
        case 88:
            if (timer2 == null) {
                timer2 = setInterval(function () {
                    UpgradeAll();
                    UpgradeStash();
                }, 1);
            } else {
                clearInterval(timer2);
                timer2 = null;
            }
           break;
    }
}
setInterval(function () {
    if (document.querySelectorAll(".hud-chat .hud-chat-input:focus")[0]) {
        window.removeEventListener("keydown", speed2);
    } else {
        window.addEventListener("keydown", speed2);
    }
}, 0);

var timer3 = null;

function speed3(e) {
    switch (e.keyCode) {
        case 67:
            if (timer3 == null) {
                timer3 = setInterval(function () {
                    Refuel();
                    Collect();
                }, 1000);
            } else {
                clearInterval(timer3);
                timer3 = null;
            }
            break;
    }
}
setInterval(function () {
    if (document.querySelectorAll(".hud-chat .hud-chat-input:focus")[0]) {
        window.removeEventListener("keydown", speed3);
    } else {
        window.addEventListener("keydown", speed3);
    }
}, 0);