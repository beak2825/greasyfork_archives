// ==UserScript==
// @name         Zombs.io (Sell Stash) (Sell All) ++ Fixes
// @namespace    -
// @version      3
// @description  Go to settings and you'll find the keys and bottoms...
// @author       You
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388037/Zombsio%20%28Sell%20Stash%29%20%28Sell%20All%29%20%2B%2B%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/388037/Zombsio%20%28Sell%20Stash%29%20%28Sell%20All%29%20%2B%2B%20Fixes.meta.js
// ==/UserScript==


function keyDown(e) {
  switch (e.keyCode) {
      case 88:
      startUPP();
      stopUPP();
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
window.Leaveon = function() {
    Game.currentGame.network.sendRpc({ "name": "LeaveParty" })
}
function Accepton() {
   let confirm = document.getElementsByClassName('btn btn-green hud-confirmation-accept');
      for (var i = 0; i < confirm.length; i++) {
        var accept = confirm[i];
        accept.click();
      }
}
function OpenPartyon() {
document.getElementsByClassName("hud-party-visibility is-private")[0].click();
}
function ClosePartyon() {
    let spam2 = document.getElementsByClassName('hud-popup-message hud-popup-confirmation is-visible');
      for (var i = 0; i < spam2.length; i++) {
        var spampartys2 = spam2[i];
        spampartys2.click();
      }
}
function SpamPartyson() {
let spam = document.getElementsByClassName('hud-party-link');
      for (var i = 0; i < spam.length; i++) {
        var spampartys = spam[i];
        spampartys.click();
      }
}
window.sellWalls = function() {
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

var Settings = '';
Settings += '<button class="btn btn-blue" style="width: 50%;" onclick="SellStash();">Sell Stash!</button>';
Settings += "<br><br>"
Settings += '<button class="btn btn-blue" style="width: 50%;" onclick="sellWalls();">Sell Walls!</button>';
Settings += "<br><br>"
Settings += '<button class="btn btn-blue" style="width: 50%;" onclick="Leaveon();">Leave Party!</button>';
Settings += '<button id="SSL" class="btn btn-red" style="width: 50%; height: 50px;">Turn SELL ALL On</button>';
Settings += '<button id="UPP" class="btn btn-red" style="width: 50%; height: 50px;">Turn UPGRADE ALL On</button>';
Settings += '<button id="AHRC" class="btn btn-red" style="width: 50%; height: 50px;">Turn AHRC On</button>';
Settings += '<button id="bow" class="btn btn-red" style="width: 50%; height: 50px;">Turn Autobow On</button>';
Settings += '<button id="Lve" class="btn btn-red" style="width: 50%; height: 50px;">Enable L Key</button>';
Settings += '<button id="Spm" class="btn btn-red" style="width: 50%; height: 50px;">Enable Alt Spam</button>';
// SETTINGS FEATURES INNERHTML
Settings += "<label>";
Settings += "<span>zombs.io script features</span>";
Settings += "<ul class=\"hud-settings-controls\">";
Settings += "<li>( SELL ALL KEY ' )</li>";
Settings += "<li>( UPGRADE EVERYTHING KEY X )</li>";
Settings += "<li>( AHRC KEY C )</li>";
Settings += "<li>( AUTO BOW KEY Z )</li>";
Settings += "</ul></label></div>";

document.getElementsByClassName("hud-settings-grid")[0].innerHTML = Settings;
var button100 = document.getElementById("Lve");
button100.addEventListener("click", startLeave);
button100.addEventListener("click", stopLeave);
var Leave = null;
function startLeave() {
clearInterval(Leave);
  if (Leave !== null) {
    Leave = null;
  } else {

              Leave = setInterval(function() {
                  Leaveon()
                  Accepton()
                  OpenPartyon()
              },1)
  }
    }




          function stopLeave() {
  var trade = document.getElementById("Lve");
  if (trade.innerHTML == "Enable L Key") {
    trade.innerHTML = "Disable L Key";
  } else {
    trade.innerHTML = "Enable L Key";
  }
}
//
var button15 = document.getElementById("Spm");
button15.addEventListener("click", startspam2);
button15.addEventListener("click", stopspam2);
var spam2 = null;
function startspam2() {
clearInterval(spam2);
  if (spam2 !== null) {
    spam2 = null;
  } else {

              spam2 = setInterval(() => {
                  SpamPartyson()
                  Accepton()
                    ClosePartyon()

}, 80)

           }
     }

          function stopspam2() {
  var trade = document.getElementById("Spm");
  if (trade.innerHTML == "Enable Alt Spam") {
    trade.innerHTML = "Disable Alt Spam";
  } else {
    trade.innerHTML = "Enable Alt Spam";
  }
}
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

//
var button22 = document.getElementById("AHRC");
button22.addEventListener("click", startAHRC);
button22.addEventListener("click", stopAHRC);
var AHRC = null;
function startAHRC() {
clearInterval(AHRC);
  if (AHRC !== null) {
    AHRC = null;
  } else {

              AHRC = setInterval(function() {
                  Collect();
                  Refuel();
                }, 1000);
           }
     }
          function stopAHRC() {
  var trade = document.getElementById("AHRC");
  if (trade.innerHTML == "Turn AHRC On") {
    trade.innerHTML = "Turn AHRC Off";
  } else {
    trade.innerHTML = "Turn AHRC On";
  }
}
//
var button21 = document.getElementById("UPP");
button21.addEventListener("click", startUPP);
button21.addEventListener("click", stopUPP);
var UPP = null;
function startUPP() {
clearInterval(UPP);
  if (UPP !== null) {
    UPP = null;
  } else {

              UPP = setInterval(function() {
                  UpgradeAll();
                  UpgradeStash();
                }, 25);
           }
     }
          function stopUPP() {
  var trade = document.getElementById("UPP");
  if (trade.innerHTML == "Turn UPGRADE ALL On") {
    trade.innerHTML = "Turn UPGRADE ALL Off";
  } else {
    trade.innerHTML = "Turn UPGRADE ALL On";
  }
}
//
var button20 = document.getElementById("SSL");
button20.addEventListener("click", startSSL);
button20.addEventListener("click", stopSSL);
var SSL = null;
function startSSL() {
clearInterval(SSL);
  if (SSL !== null) {
    SSL = null;
  } else {

              SSL = setInterval(function() {
                  SellAll();
                }, 25);
           }
     }
          function stopSSL() {
  var trade = document.getElementById("SSL");
  if (trade.innerHTML == "Turn SELL ALL On") {
    trade.innerHTML = "Turn SELL ALL Off";
  } else {
    trade.innerHTML = "Turn SELL ALL On";
  }
}
//
var button19 = document.getElementById("SS");
button19.addEventListener("click", startSS);
button19.addEventListener("click", stopSS);
var SS = null;
function startSS() {
clearInterval(SS);
  if (SS !== null) {
    SS = null;
  } else {

              SS = setInterval(function() {
                  Accepton();
                }, 0);
           }
     }
          function stopSS() {
  var trade = document.getElementById("SS");
  if (trade.innerHTML == "Turn SELL STASH On") {
    trade.innerHTML = "Turn SELL STASH Off";
  } else {
    trade.innerHTML = "Turn SELL STASH On";
  }
}