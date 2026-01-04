// ==UserScript==
// @name         Zombs.io (Sell Stash + Sell All + Party Share Key + Title Changer + More)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       lolol
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389513/Zombsio%20%28Sell%20Stash%20%2B%20Sell%20All%20%2B%20Party%20Share%20Key%20%2B%20Title%20Changer%20%2B%20More%29.user.js
// @updateURL https://update.greasyfork.org/scripts/389513/Zombsio%20%28Sell%20Stash%20%2B%20Sell%20All%20%2B%20Party%20Share%20Key%20%2B%20Title%20Changer%20%2B%20More%29.meta.js
// ==/UserScript==
var Settings = '';
Settings += "<button class=\"btn btn-blue\"style=\"width: 33%;\" onclick=\"SellStash();\">Sell Stash?</button>"; Settings += "<button class=\"btn btn-blue\"style=\"width: 33%;\" onclick=\"SellAll();\">Sell All?</button>"; Settings += "<button class=\"btn btn-blue\"style=\"width: 33%;\" onclick=\"UpgradeStash();\">Upgrade Stash?</button>";
Settings += "<button class=\"btn btn-blue\"style=\"width: 33%;\" onclick=\"UpgradeAll();\">Upgrade All?</button>"; Settings += "<button class=\"btn btn-blue\"style=\"width: 33%;\" onclick=\"Refuel();\">Refuel?</button>"; Settings += "<button class=\"btn btn-blue\"style=\"width: 33%;\" onclick=\"Collect();\">Collect?</button>";
Settings += '<button class=\"btn btn-blue\"style=\"width: 33%;\" onclick=\"Leave();\">Leave Party?</button>'; Settings += '<button class=\"btn btn-blue\" style=\"width: 33%;\" onclick="Fill();\">Fill Server?</button>'; Settings += '<button class=\"btn btn-blue\"style=\"width: 33%;\" onclick=\"Crash();\">Crash The Server?</button>';
Settings += '<button class=\"btn btn-blue\"style=\"width: 33%;\" onclick=\"Disconnect();\">Disconnect?</button>'; Settings += '<button class=\"btn btn-blue\"style=\"width: 33%;\" onclick=\"SellWalls();\">Sell Walls?</button>'; Settings += '<button class=\"btn btn-blue\"style=\"width: 33%;\" onclick=\"SellDoors();\">Sell Doors?</button>';
Settings += '<button class=\"btn btn-blue\"style=\"width: 33%;\" onclick=\"SellSlowTraps();\">Sell Slow Traps?</button>'; Settings += '<button class=\"btn btn-blue\"style=\"width: 33%;\" onclick=\"SellArrows();\">Sell Arrows?</button>'; Settings += '<button class=\"btn btn-blue\"style=\"width: 33%;\" onclick=\"SellCannons();\">Sell Cannons?</button>';
Settings += '<button class=\"btn btn-blue\"style=\"width: 33%;\" onclick=\"SellMelees();\">Sell Melees?</button>'; Settings += '<button class=\"btn btn-blue\"style=\"width: 33%;\" onclick=\"SellBombs();\">Sell Bombs?</button>'; Settings += '<button class=\"btn btn-blue\"style=\"width: 33%;\" onclick=\"SellMages();\">Sell Mages?</button>';
Settings += '<button class=\"btn btn-blue\"style=\"width: 33%;\" onclick=\"SellGoldMines();\">Sell Gold Mines?</button>'; Settings += '<button class=\"btn btn-blue\"style=\"width: 33%;\" onclick=\"SellHarvesters();\">Sell Harvesters?</button>';
Settings += `<button id="bow" class="btn btn-blue" style="width: 33%; height: 40px;">Enable Autobow</button>`

document.getElementsByClassName('hud-settings-grid')[0].innerHTML = Settings
Settings += `
<input type="text" maxlength="20" placeholder="share key" id="myKey">
<button onclick="join();">Join</button>
<input type="text" placeholder="name" maxlength="16" id="myTitle">
<button onclick="change();">Change</button>
`
window.change = function() {
  let title = myTitle.value
  document.title = title
}
document.getElementsByClassName('hud-settings-grid')[0].innerHTML = Settings
window.join = function() {
  let partyKey = myKey.value
        Game.currentGame.network.sendRpc({
                name: "JoinPartyByShareKey",
                partyShareKey: partyKey
        })
}
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
  if (trade.innerHTML == "Enable Autobow") {
    trade.innerHTML = "Disable Autobow";
  } else {
    trade.innerHTML = "Enable Autobow";
  }
}
window.SellWalls = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "Wall") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}
window.SellDoors = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "Door") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}
window.SellSlowTraps = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "SlowTrap") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}
window.SellArrows = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "ArrowTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}
window.SellCannons = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "CannonTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}
window.SellBombs = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "BombTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}
window.SellMages = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "MagicTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}
window.SellMelees = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "MeleeTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}
window.SellGoldMines = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "GoldMine") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}
window.SellHarvesters = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "Harvester") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}

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
window.Fill = function() {
setInterval(function() {
    document.getElementsByClassName("hud-intro-play")[0].click();
}, 0);
}
window.Leave = function() {
Game.currentGame.network.sendRpc({ "name": "LeaveParty" })
}
    var timer = null;

function speed(e) {
    switch (e.keyCode) {
        case 54:
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
        case 55:
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
        case 56:
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
window.Crash = function() { Game.currentGame.network.sendRpc({name:"SendChatMessage",channel:"Global",message:("fuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuck")})}
window.Disconnect = function() { Game.currentGame.network.sendRpc({name:"SendChatMessage",channel:"Global",message:("﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽")})}
setInterval(function () {
    if (document.querySelectorAll(".hud-chat .hud-chat-input:focus")[0]) {
        window.removeEventListener("keydown", speed3);
    } else {
        window.addEventListener("keydown", speed3);
    }
}, 0);