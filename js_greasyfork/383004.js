// ==UserScript==
// @name         zombs.io key codes 2
// @namespace    -
// @version      0.3
// @description  cool hotkeys... Sell Stash Key = ] Sell All Key = [ Upgrade All and Stash = C Refuel and Collect Harvest Key = X
// @author       Darkness 196
// @match        zombs.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383004/zombsio%20key%20codes%202.user.js
// @updateURL https://update.greasyfork.org/scripts/383004/zombsio%20key%20codes%202.meta.js
// ==/UserScript==

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
Settings += `<button id="bow" class="btn btn-blue" style="width: 100%; height: 50px;">Turn Autobow On</button>`;
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
    window.addEventListener("onkeydown", keyDown, true);
window.addEventListener("keydown", keyDown);

function keyDown(e) {
  switch (e.keyCode) {
    case 221:
      UpgradeStash();
      UpgradeAll();
      break;
   case 45:
      SellAll();
      break;
   case 46:
      SellStash();
      break;
      case 222:
      Refuel();
      Collect();
      break;
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