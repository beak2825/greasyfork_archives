// ==UserScript==
// @name         Zombs.io megascript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387464/Zombsio%20megascript.user.js
// @updateURL https://update.greasyfork.org/scripts/387464/Zombsio%20megascript.meta.js
// ==/UserScript==

window.addEventListener("onkeydown", keyDown, true);
window.addEventListener("keydown", keyDown);

function keyDown(e) {
  switch (e.keyCode) {
      case 49:
      SellAll();
      break;
      case 50:
      SellStash();
      break;
      case 51:
      Fill();
      break;
      case 52:
      Leave();
      break;
      case 53:
      startbow();
      stopbow();
      break;
      case 75:
      RMsg();
      R2Msg();
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
Settings += "<button class=\"btn btn-red\"style=\"width: 50%;\" onclick=\"SellStash();\">Sell Stash?</button>"; Settings += "<button class=\"btn btn-red\"style=\"width: 50%;\" onclick=\"SellAll();\">Sell All?</button>";
Settings += "<button class=\"btn btn-red\"style=\"width: 50%;\" onclick=\"UpgradeStash();\">Upgrade Stash?</button>"; Settings += "<button class=\"btn btn-red\"style=\"width: 50%;\" onclick=\"UpgradeAll();\">Upgrade All?</button>";
Settings += "<button class=\"btn btn-red\"style=\"width: 50%;\" onclick=\"Refuel();\">Refuel?</button>"; Settings += "<button class=\"btn btn-red\"style=\"width: 50%;\" onclick=\"Collect();\">Collect?</button>";
Settings += '<button class=\"btn btn-red\"style=\"width: 50%;\" onclick=\"Leave();\">Leave Party?</button>'; Settings += '<button class=\"btn btn-red\" style=\"width: 50%;\" onclick="Fill();\">Fill Server?</button>';
Settings += '<button class=\"btn btn-red\"style=\"width: 50%;\" onclick=\"Crash();\">Crash The Whole Server?</button>'; Settings += '<button class=\"btn btn-red\"style=\"width: 50%;\" onclick="Crash2();\">Disconnect?</button>';
document.getElementsByClassName("hud-settings-grid")[0].innerHTML = Settings;
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
window.Crash2 = function() { Game.currentGame.network.sendRpc({name:"SendChatMessage",channel:"Global",message:("﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽")})}
setInterval(function () {
    if (document.querySelectorAll(".hud-chat .hud-chat-input:focus")[0]) {
        window.removeEventListener("keydown", speed3);
    } else {
        window.addEventListener("keydown", speed3);
    }
}, 0);