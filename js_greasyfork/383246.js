// ==UserScript==
// @name         Made For u
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  this script was made for a Lesbian this has gold gen leave party auto bow and l Key Auto Raid all in settings
// @author       Lesbian
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383246/Made%20For%20u.user.js
// @updateURL https://update.greasyfork.org/scripts/383246/Made%20For%20u.meta.js
// ==/UserScript==

const settingsHTML = `
<div style="text-align:center"><br>
  <label><span>lesbian settings</span></label>
  <button id="autoBowButton" class="btn btn-blue" style="width: 45%;">Turn Autobow On</button> &nbsp;
  <button id="leavePartyButton" class="btn btn-blue" style="width: 45%;">Leave Party</button>
  <br><br>
  <button id="KodeLlmsaBgcZ" class="btn btn-blue" style="width: 45%;">Enable gold generator</button> &nbsp;
</div>
<br>
<br>
<div class="TF" style="text-align:center">
  <button class="TFbtn">Freeze towers</button> &nbsp;
  <input type="text" class="TFkey" placeholder="Party Share Key"> &nbsp;
  <button class="TFvalidKey">Valid Key</button>
</div>`;

document.getElementsByClassName("hud-settings-grid")[0].innerHTML = settingsHTML;

var AutoBow = null;

// AUTO BOW
const buttonAutoBow = document.getElementById("autoBowButton");
buttonAutoBow.addEventListener("click", AutoBowFun);

function AutoBowFun() {
  clearInterval(AutoBow);
  if (AutoBow !== null) {
    AutoBow = null;
  } else {
    if (Game.currentGame.ui.inventory.Bow) {
      Game.currentGame.network.sendRpc({
        name: "EquipItem",
        itemName: "Bow",
        tier: Game.currentGame.ui.inventory.Bow.tier
      })
    }
    AutoBow = setInterval(function() {
      Game.currentGame.inputPacketScheduler.scheduleInput({
        space: 1
      })
      Game.currentGame.inputPacketScheduler.scheduleInput({
        space: 0
      })
    }, 0);
  }
  buttonText();
}

function buttonText() {
  if (buttonAutoBow.innerHTML == "Turn Autobow On") {
    buttonAutoBow.innerHTML = "Turn Autobow Off";
    buttonAutoBow.className = "btn btn-red";
  } else {
    buttonAutoBow.innerHTML = "Turn Autobow On";
    buttonAutoBow.className = "btn btn-blue";
  }
}

// LEAVE PARTY
const buttonLeaveParty = document.getElementById("leavePartyButton");
buttonLeaveParty.addEventListener("click", partyLeave);

function partyLeave() {
  Game.currentGame.ui.getComponent("PopupOverlay")
    .showConfirmation("Are you sure you want to leave this party?", 1e4, function() {
      Game.currentGame.network.sendRpc({
        name: "LeaveParty"
      })
    })
}

// GOLD GEN
const placeBuilding = (x, y, building, yaw) => {
    Game.currentGame.network.sendRpc({
      "name": "MakeBuilding",
      "x": x,
      "y": y,
      "type": building,
      "yaw": yaw
    })

    upgradeSlowTraps()
    sellSlowTraps()
  },
  sellSlowTraps = () => {
    const entities = Game.currentGame.world.entities
    for (const uid in entities) {
      if (!entities.hasOwnProperty(uid)) continue
      const obj = entities[uid]
      if (obj.fromTick.model == "SlowTrap") {
        Game.currentGame.network.sendRpc({
          "name": "DeleteBuilding",
          "uid": obj.fromTick.uid
        })
      }
    }
  },
  upgradeSlowTraps = () => {
    const entities = Game.currentGame.world.entities
    for (const uid in entities) {
      if (!entities.hasOwnProperty(uid)) continue
      const obj = entities[uid]
      if (obj.fromTick.model == "SlowTrap") {
        Game.currentGame.network.sendRpc({
          "name": "UpgradeBuilding",
          "uid": obj.fromTick.uid
        })
      }
    }
  },

  state = {
    "stopped": true
  },

  start = () => state.stopped = false,
  stop = () => state.stopped = true,
  button = document.querySelector("#KodeLlmsaBgcZ").addEventListener("click", e => {
    switch (e.target.innerText) {
      case "Enable gold generator":
        e.target.innerText = "Disable gold generator"
        start()
        break
      case "Disable gold generator":
        e.target.innerText = "Enable gold generator"
        stop()
        break
    }
  })

Game.currentGame.network.addRpcHandler("LocalBuilding", e => {
  if (e[0].type === "GoldStash" && !e[0].dead && e[0].tier === 1) {
    if (state.stopped) return
    placeBuilding(e[0].x + -48, e[0].y + -96, "GoldMine", 0)
    placeBuilding(e[0].x + 48, e[0].y + -96, "GoldMine", 0)
    placeBuilding(e[0].x + 96, e[0].y + 0, "GoldMine", 0)
    placeBuilding(e[0].x + -96, e[0].y + 0, "GoldMine", 0)
    placeBuilding(e[0].x + -48, e[0].y + 96, "GoldMine", 0)
    placeBuilding(e[0].x + 48, e[0].y + 96, "GoldMine", 0)
    placeBuilding(e[0].x + 192, e[0].y + 0, "GoldMine", 0)
    placeBuilding(e[0].x + -192, e[0].y + 0, "GoldMine", 0)
    placeBuilding(e[0].x + -192, e[0].y + -96, "BombTower", 0)
    placeBuilding(e[0].x + -192, e[0].y + 96, "BombTower", 0)
    placeBuilding(e[0].x + 192, e[0].y + 96, "BombTower", 0)
    placeBuilding(e[0].x + 192, e[0].y + -96, "BombTower", 0)
    placeBuilding(e[0].x + 0, e[0].y + -192, "BombTower", 0)
    placeBuilding(e[0].x + 0, e[0].y + 192, "BombTower", 0)
    placeBuilding(e[0].x + -96, e[0].y + 192, "ArrowTower", 0)
    placeBuilding(e[0].x + 96, e[0].y + 192, "ArrowTower", 0)
    placeBuilding(e[0].x + 96, e[0].y + -192, "ArrowTower", 0)
    placeBuilding(e[0].x + -96, e[0].y + -192, "ArrowTower", 0)
    placeBuilding(e[0].x + -168, e[0].y + -168, "Door", 0)
    placeBuilding(e[0].x + 168, e[0].y + -168, "Door", 0)
    placeBuilding(e[0].x + 168, e[0].y + 168, "Door", 0)
    placeBuilding(e[0].x + -168, e[0].y + 168, "Door", 0)

    const intervalId = setInterval(() => {
      if (state.stopped) return
      placeBuilding(e[0].x + -120, e[0].y + -120, "SlowTrap", 0)
      placeBuilding(e[0].x + -120, e[0].y + -72, "SlowTrap", 0)
      placeBuilding(e[0].x + 120, e[0].y + -120, "SlowTrap", 0)
      placeBuilding(e[0].x + 120, e[0].y + -72, "SlowTrap", 0)
      placeBuilding(e[0].x + -120, e[0].y + 72, "SlowTrap", 0)
      placeBuilding(e[0].x + -120, e[0].y + 120, "SlowTrap", 0)
      placeBuilding(e[0].x + 120, e[0].y + 72, "SlowTrap", 0)
      placeBuilding(e[0].x + 120, e[0].y + 120, "SlowTrap", 0)
    }, 100)
  }
})
const $ = function(className) {
  var elem = document.getElementsByClassName(className);
  if (elem.length > 1) return elem;
  return elem[0];
}

var menu = $("hud-settings-grid");
for (var i = 0; i < menu.children.length; i++) {
  var child = menu.children[i];
  child.addEventListener('click', function() {
    $("myCustomIcon").click();
  })
}

$("TFbtn").addEventListener("click", FREEZE);
var TowerFreeze = null;
var key;
$("TFvalidKey").addEventListener("click", function() {
  key = $("TFkey").value;
});

function FREEZE() {
  if ($("TFbtn").innerText == "Freeze towers") {
    $("TFbtn").innerText = "Unfreeze towers";
  } else {
    $("TFbtn").innerText = "Freeze towers";
  }
  if (TowerFreeze == null) {
    TowerFreeze = setInterval(function() {
      Game.currentGame.network.sendRpc({
        name: "JoinPartyByShareKey",
        partyShareKey: key
      });
      Game.currentGame.network.sendRpc({
        name: "LeaveParty"
      })
    }, 100);
  } else {
    clearInterval(TowerFreeze);
    TowerFreeze = null;
  }
}