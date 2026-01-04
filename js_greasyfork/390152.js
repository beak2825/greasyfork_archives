// ==UserScript==
// @name         tower freeze, auto build, join, leave, more
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        zombs.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390152/tower%20freeze%2C%20auto%20build%2C%20join%2C%20leave%2C%20more.user.js
// @updateURL https://update.greasyfork.org/scripts/390152/tower%20freeze%2C%20auto%20build%2C%20join%2C%20leave%2C%20more.meta.js
// ==/UserScript==

function keyDownF(e) {
  switch (e.keyCode) {
      case 46:
      SellStash();
      break;
      case 45:
      SellAll();
      break;
      case 88:
      startUPP();
      stopUPP();
      break;
      case 90:
      startbow();
      stopbow();
      break;
      case 85:
      startSSL();
      stopSSL();
      break;
      case 221:
      join();
      break;
      case 219:
      leave();
      break;
      case 222:
      join2();
      break;
      case 191:
      join3();
      break;
      case 82:
      heal();
      break;
      case 220:
      FREEZE();
      break;
  }
}
setInterval(function () {
    if (document.querySelectorAll(".hud-chat .hud-chat-input:focus")[0]) {
        window.removeEventListener("keydown", keyDownF);
    } else {
        window.addEventListener("keydown", keyDownF);
    }
}, 0);

const settingsHTML = `<div style="text-align:center"><br>
<button class="btn btn-blue" style="width: 45%;" onclick="SellStash();">Sell Stash!</button>
<button class="btn btn-blue" style="width: 45%;" onclick="SellAll();">Sell All!</button>

<button class="btn btn-blue" style="width: 45%;" onclick="sellWalls();">Sell Walls!</button>

<button class="btn btn-blue" style="width: 45%;" onclick="sellDoors();">Sell Doors!</button>

<button class="btn btn-blue" style="width: 45%;" onclick="sellTraps();">Sell Traps!</button>

<button class="btn btn-blue" style="width: 45%;" onclick="sellpets();">Sell Pets!</button>

<button id="UPP" class="btn btn-red" style="width: 45%;">Enable Upgrade All</button>

<button id="AHRC" class="btn btn-red" style="width: 45%;">Enable AHRC</button>

<button id="bow" class="btn btn-red" style="width: 45%;">Enable Autobow</button>

<button id="SSL" class="btn btn-red" style="width: 45%;">Enable Accept All</button>

<button id="SSL4" class="btn btn-red" style="width: 45%;">Enable auto use timeout</button>

<button id="SSL9" class="btn btn-red" style="width: 45%;">Enable kick all</button>

<hr />
<h3>Join Parties</h3>
<hr />
<input type="text" maxlength="20" placeholder="share key" id="myKey">
<button onclick="join();">Join</button>
<br><br>
<input type="text" maxlength="20" placeholder="share key" id="myKey2">
<button onclick="join2();">Join</button>
<br><br>
<input type="text" maxlength="20" placeholder="share key" id="myKey3">
<button onclick="join3();">Join</button>
<br><br>
<input type="text" class="TFkey3" placeholder="share key">
<button class="TFvalidKey3">Valid Key</button>
<button class="TFbtn3">Enable unkickable mode</button>
<hr />
<h3>Leave Parties</h3>
<hr />
<button onclick="leave();">Leave</button>
<hr />
<h3>Auto Build</h3>
<hr />
<button onclick="BSB();">Bryan Smith Base</button>
<button onclick="TB();">Thing Base</button>
<button onclick="XBase();">X Base</button>
<button onclick="SmallCornerBase();">OP Base</button>
<button onclick="SSLQ();">- Base</button>
<br><br>
<input type="number" value="1000" class="F" placeholder="DB speed" style="width: 20%;">
<button class="Fe">save speed</button>
<button id="SSL5">Enable Defense Base</button>
<br><br>
<input type="number" value="700" class="F2" placeholder="GG speed" style="width: 20%;">
<button class="Fe2">save speed</button>
  <button id="SSL6">Enable gold generator</button> &nbsp;
<hr />
<h3>A.I.T.O</h3>
<hr />
<button class='btn btn-green start-aito'>Start AITO</button>
<button class='btn btn-green stop-aito'>Stop AITO</button>
<hr />
<h3>Tower Heal</h3>
<hr />
<input type="number" value="500" class="TFkey2" placeholder="speed" style="width: 20%">
<button class="TFvalidKey2">save speed</button>
<button class="TFbtn2">Heal towers by using X postion</button>
<br><br>
<input type="number" value="500" class="F3" placeholder="speed" style="width: 20%;">
<button class="Fe3">save speed</button>
  <button id="SSL7">Heal towers by using mouse position</button> &nbsp;
<br><br>
<input type="number" value="500" class="F4" placeholder="speed" style="width: 20%;">
<button class="Fe4">save speed</button>
  <button id="SSL3">Enable Tower Heal</button> &nbsp;
<hr />
<h3>Auto Raid</h3>
<hr />
<input type="number" value="200" class="TFe" placeholder="speed" style="width: 20%;">
<input type="text" class="TFkey" placeholder="share key">
<button class="TFvalidKey">Valid Key</button>
<button class="TFbtn">Freeze Towers</button>
</div>`

document.getElementsByClassName("hud-settings-grid")[0].innerHTML = settingsHTML;
setTimeout(() => {

},2500)
window.join = function() {
  let partyKey = myKey.value
        Game.currentGame.network.sendRpc({
                name: "JoinPartyByShareKey",
                partyShareKey: partyKey
        })
}

window.join2 = function() {
  let partyKey = myKey2.value
        Game.currentGame.network.sendRpc({
                name: "JoinPartyByShareKey",
                partyShareKey: partyKey
        })
}

window.join3 = function() {
  let partyKey = myKey3.value
        Game.currentGame.network.sendRpc({
                name: "JoinPartyByShareKey",
                partyShareKey: partyKey
        })
}



//Auto Build Script
function $(classname) {
    let element = document.getElementsByClassName(classname)
    if (element.length === 1) {
        return element[0]
    } else {
        return element
    }
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    let value = this.getItem(key);
    return value && JSON.parse(value);
}
let Auto = {}
let Auto2 = {}
let EXTREME = {}
Auto.GetGoldStash = function() {
    let entities = Game.currentGame.ui.buildings
    for (let uid in entities) {
        if (!entities.hasOwnProperty(uid)) {
            continue
        }
        let obj = entities[uid]
        if (obj.type == "GoldStash") {
            return obj
        }
    }
}
EXTREME.GetGoldStash = function() {
    let entities = Game.currentGame.ui.buildings
    for (let uid in entities) {
        if (!entities.hasOwnProperty(uid)) {
            continue
        }
        let obj = entities[uid]
        if (obj.type == "GoldStash") {
            return obj
        }
    }
}
Auto2.GetGoldStash = function() {
    let entities = Game.currentGame.ui.buildings
    for (let uid in entities) {
        if (!entities.hasOwnProperty(uid)) {
            continue
        }
        let obj = entities[uid]
        if (obj.type == "GoldStash") {
            return obj
        }
    }
}

Auto.PlaceBuilding = function(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}
Auto.PlaceBulding = function(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}
EXTREME.PlaceBuilding = function(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}
Auto2.PlaceBuilding = function(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
sellBombs()
upgradeBombs()
}
Auto2.GoldGenerator = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto2.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash);
            Auto2.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 96, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -96, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 0, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 0, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 56778, "ArrowTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 56778, "ArrowTower", 0)
        }
    }, 0)
    window.ee = function() {
        var waitForGoldStash2 = setInterval(function() {
                    clearInterval(waitForGoldStash2);
    upgradeBombs()
        }, 0)
    }
}
EXTREME.BuildMyBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = EXTREME.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash);
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 96, "BombTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -96, "BombTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 0, "BombTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 0, "BombTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 0, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 192, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 0, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 96, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 96, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 192, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 192, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -192, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -192, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 96, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 96, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -96, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -96, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 192, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 192, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -192, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -192, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 192, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 192, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -192, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -192, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 288, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 288, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -288, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -288, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 96, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 96, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -96, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -96, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 0, "BombTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -0, "BombTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 0, "BombTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -0, "BombTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 288, "BombTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -288, "BombTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -0, stashPosition.y + 288, "BombTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -288, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -0, stashPosition.y + 288, "BombTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -288, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 0, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 24, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 72, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 120, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 168, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 216, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 264, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 312, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 360, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -0, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 360, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 312, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 264, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 216, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 168, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 120, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 72, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 24, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 0, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -360, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -312, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -264, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -216, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -168, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -120, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -72, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -24, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -0, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -0, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -0, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -72, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -24, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -120, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -168, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -216, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -264, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -312, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -360, "Door", 0)
        }
    }, 0)
}
EXTREME.BuildMyBase2 = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = EXTREME.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash);
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 0, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 0, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 0, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 192, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 192, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 192, "BombTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 192, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 96, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 96, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 96, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 96, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 120, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 312, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 264, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 264, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 360, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 360, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 192, "Harvester", 100)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, "Harvester", 100)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 0, "Harvester", 100)
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 96, "Harvester", 100)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, "Harvester", 100)
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, "Harvester", 100)

        }
    }, 0)
}
EXTREME.BuildXBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = EXTREME.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + 192, 'GoldMine', 0)
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + 192, 'GoldMine', 0)
            Auto.PlaceBulding(stashPosition.x + -192, stashPosition.y + 48, 'GoldMine', 0)
            Auto.PlaceBulding(stashPosition.x + -192, stashPosition.y + -48, 'GoldMine', 0)
            Auto.PlaceBulding(stashPosition.x + 192, stashPosition.y + 48, 'GoldMine', 0)
            Auto.PlaceBulding(stashPosition.x + 192, stashPosition.y + -48, 'GoldMine', 0)
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + -192, 'GoldMine', 0)
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + -192, 'GoldMine', 0)
            Auto.PlaceBulding(stashPosition.x + -24, stashPosition.y + -120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 24, stashPosition.y + -120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 120, stashPosition.y + -24, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 120, stashPosition.y + 24, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -24, stashPosition.y + 120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 24, stashPosition.y + 120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -120, stashPosition.y + 24, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -120, stashPosition.y + -24, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + -192, 'Harvester', 0)
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + -192, 'Harvester', 0)
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + 192, 'Harvester', 0)
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + 192, 'Harvester', 0)
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + -288, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + -384, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + -480, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + -480, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + -384, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + -288, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + -576, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + -576, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 0, stashPosition.y + -672, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + -576, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -240, stashPosition.y + -528, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + -480, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + -384, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -240, stashPosition.y + -432, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + -480, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + -384, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + -288, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -264, stashPosition.y + -360, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -216, stashPosition.y + -360, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -216, stashPosition.y + -312, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -216, stashPosition.y + -264, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + -576, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + 240, stashPosition.y + -528, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + 336, stashPosition.y + -480, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + 336, stashPosition.y + -384, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + 240, stashPosition.y + -432, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + -480, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + -384, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + -288, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 264, stashPosition.y + -360, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 216, stashPosition.y + -360, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 216, stashPosition.y + -312, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -480, stashPosition.y + -336, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -528, stashPosition.y + -240, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -576, stashPosition.y + -144, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -576, stashPosition.y + -48, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -672, stashPosition.y + 0, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -432, stashPosition.y + -240, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + -240, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -480, stashPosition.y + -144, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -384, stashPosition.y + -144, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -288, stashPosition.y + -144, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + -480, stashPosition.y + -48, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + -480, stashPosition.y + 48, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + -576, stashPosition.y + 48, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + -384, stashPosition.y + -48, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + -384, stashPosition.y + 48, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + -288, stashPosition.y + 48, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + -288, stashPosition.y + -48, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + -312, stashPosition.y + 120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -312, stashPosition.y + 168, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -264, stashPosition.y + 168, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -264, stashPosition.y + 120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -264, stashPosition.y + 216, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -216, stashPosition.y + 120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -432, stashPosition.y + 240, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -384, stashPosition.y + 336, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -480, stashPosition.y + 336, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -528, stashPosition.y + 240, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -696, stashPosition.y + 72, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -648, stashPosition.y + 72, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -648, stashPosition.y + 168, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -744, stashPosition.y + -24, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -744, stashPosition.y + 24, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -696, stashPosition.y + -120, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -696, stashPosition.y + -72, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -648, stashPosition.y + -72, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -648, stashPosition.y + -120, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -648, stashPosition.y + -168, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 288, stashPosition.y + -48, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 288, stashPosition.y + -144, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + -48, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + -48, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + 48, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + 48, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + 144, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 264, stashPosition.y + 24, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 264, stashPosition.y + 72, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 312, stashPosition.y + 72, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 312, stashPosition.y + 24, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 288, stashPosition.y + 144, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + 144, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 336, stashPosition.y + 240, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 432, stashPosition.y + 240, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + 336, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + 336, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + 528, stashPosition.y + 240, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + 552, stashPosition.y + 24, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 552, stashPosition.y + 72, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 552, stashPosition.y + 120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 552, stashPosition.y + 168, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -648, stashPosition.y + 120, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -696, stashPosition.y + 120, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -576, stashPosition.y + 144, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + -480, stashPosition.y + 144, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + -384, stashPosition.y + 144, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + 240, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + 600, stashPosition.y + 120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 600, stashPosition.y + 168, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 648, stashPosition.y + 168, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 600, stashPosition.y + 216, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 600, stashPosition.y + 264, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 648, stashPosition.y + 216, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 648, stashPosition.y + 120, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 696, stashPosition.y + 120, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 696, stashPosition.y + 72, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 696, stashPosition.y + 24, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 624, stashPosition.y + 48, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 576, stashPosition.y + -48, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + 672, stashPosition.y + -48, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + 576, stashPosition.y + -144, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + 528, stashPosition.y + -240, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + -336, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + 432, stashPosition.y + -240, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + 336, stashPosition.y + -240, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + -144, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + -144, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + 288, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + 288, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + 288, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + 288, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + 384, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + 384, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + 384, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 240, stashPosition.y + 432, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + 480, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + 480, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + 480, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + 576, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + 576, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + 576, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 240, stashPosition.y + 528, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + 336, stashPosition.y + 480, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + 384, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + 480, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -240, stashPosition.y + 432, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + 576, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -240, stashPosition.y + 528, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + 480, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -168, stashPosition.y + 648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -120, stashPosition.y + 648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -72, stashPosition.y + 648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -24, stashPosition.y + 648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 24, stashPosition.y + 648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 72, stashPosition.y + 648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 120, stashPosition.y + 648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 168, stashPosition.y + 648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 120, stashPosition.y + 696, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 72, stashPosition.y + 696, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 24, stashPosition.y + 696, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -24, stashPosition.y + 696, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -72, stashPosition.y + 696, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -120, stashPosition.y + 696, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 600, stashPosition.y + -216, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 648, stashPosition.y + -216, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 648, stashPosition.y + -168, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 648, stashPosition.y + -120, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 696, stashPosition.y + -120, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 744, stashPosition.y + -72, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 744, stashPosition.y + -24, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -168, stashPosition.y + -648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -120, stashPosition.y + -648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -120, stashPosition.y + -696, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -72, stashPosition.y + -696, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -72, stashPosition.y + -648, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -24, stashPosition.y + -744, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 24, stashPosition.y + -744, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 72, stashPosition.y + -696, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 72, stashPosition.y + -648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 120, stashPosition.y + -648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 168, stashPosition.y + -648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 216, stashPosition.y + -600, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 216, stashPosition.y + -648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -216, stashPosition.y + -120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 216, stashPosition.y + 120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 216, stashPosition.y + -120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 264, stashPosition.y + -216, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 216, stashPosition.y + 264, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 216, stashPosition.y + 360, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 264, stashPosition.y + 360, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 216, stashPosition.y + 312, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -264, stashPosition.y + 360, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -216, stashPosition.y + 360, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -216, stashPosition.y + 312, 'Door', 0)
        }
    }, 0)
}
Auto.BuildBryanSmithBase = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -48, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 48, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -192, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -192, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -48, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 48, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 192, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 192, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 240, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 240, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 336, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 480, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 576, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 432, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -288, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -288, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 576, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -576, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 144, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -48, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -144, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -192, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -192, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 192, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 192, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 360, 'Door', 0);
        }
    }, 0)
}

Auto.SSLQ1 = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 0);
            Auto.PlaceBuilding(stashPosition.x + 8592-8736, stashPosition.y + 5376-5232, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 8592-8736, stashPosition.y + 5376-5520, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 8592-8448, stashPosition.y + 5376-5520, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 8592-8448, stashPosition.y + 5376-5232, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 8592-8352, stashPosition.y + 5376-5136, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 8592-8352, stashPosition.y + 5376-5616, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 8592-8832, stashPosition.y + 5376-5616, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 8592-8832, stashPosition.y + 5376-5136, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-864, stashPosition.y + HELL2-17616, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-768, stashPosition.y + HELL2-17712, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1152, stashPosition.y + HELL2-17616, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1248, stashPosition.y + HELL2-17712, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-864, stashPosition.y + HELL2-18096, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-768, stashPosition.y + HELL2-18000, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1152, stashPosition.y + HELL2-18096, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1248, stashPosition.y + HELL2-18000, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1152, stashPosition.y + HELL2-17856, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1008, stashPosition.y + HELL2-17712, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1008, stashPosition.y + HELL2-18000, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-864, stashPosition.y + HELL2-17856, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-768, stashPosition.y + HELL2-17856, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1008, stashPosition.y + HELL2-17616, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1248, stashPosition.y + HELL2-17856, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1008, stashPosition.y + HELL2-18096, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-576, stashPosition.y + HELL2-18000, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-576, stashPosition.y + HELL2-17856, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-576, stashPosition.y + HELL2-17712, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-864, stashPosition.y + HELL2-17424, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1008, stashPosition.y + HELL2-17424, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1152, stashPosition.y + HELL2-17424, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1440, stashPosition.y + HELL2-17712, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1440, stashPosition.y + HELL2-17856, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1440, stashPosition.y + HELL2-18000, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1152, stashPosition.y + HELL2-18288, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1008, stashPosition.y + HELL2-18288, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-864, stashPosition.y + HELL2-18288, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1248, stashPosition.y + HELL2-18192, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1344, stashPosition.y + HELL2-18096, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1008, stashPosition.y + HELL2-18192, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-672, stashPosition.y + HELL2-18096, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-768, stashPosition.y + HELL2-18192, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1344, stashPosition.y + HELL2-17856, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1344, stashPosition.y + HELL2-17616, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1248, stashPosition.y + HELL2-17520, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1008, stashPosition.y + HELL2-17520, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-768, stashPosition.y + HELL2-17520, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-672, stashPosition.y + HELL2-17616, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-672, stashPosition.y + HELL2-17856, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-864, stashPosition.y + HELL2-17520, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-672, stashPosition.y + HELL2-17520, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-672, stashPosition.y + HELL2-17712, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-576, stashPosition.y + HELL2-17616, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-768, stashPosition.y + HELL2-17424, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-672, stashPosition.y + HELL2-17424, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-576, stashPosition.y + HELL2-17520, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1344, stashPosition.y + HELL2-17424, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1440, stashPosition.y + HELL2-17520, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1440, stashPosition.y + HELL2-17616, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1248, stashPosition.y + HELL2-17424, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1344, stashPosition.y + HELL2-17520, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1344, stashPosition.y + HELL2-17712, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1152, stashPosition.y + HELL2-17520, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1152, stashPosition.y + HELL2-18192, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1344, stashPosition.y + HELL2-18000, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1440, stashPosition.y + HELL2-18096, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1248, stashPosition.y + HELL2-18288, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1344, stashPosition.y + HELL2-18288, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-1440, stashPosition.y + HELL2-18192, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-672, stashPosition.y + HELL2-18288, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-576, stashPosition.y + HELL2-18192, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-768, stashPosition.y + HELL2-18288, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-576, stashPosition.y + HELL2-18096, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-672, stashPosition.y + HELL2-18192, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-864, stashPosition.y + HELL2-18192, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + HELL-672, stashPosition.y + HELL2-18000, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -336, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4488, stashPosition.y + 18672-18216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4488, stashPosition.y + 18672-18264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4440, stashPosition.y + 18672-18264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4392, stashPosition.y + 18672-18312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4392, stashPosition.y + 18672-18360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4392, stashPosition.y + 18672-18408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4392, stashPosition.y + 18672-18456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4392, stashPosition.y + 18672-18504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4392, stashPosition.y + 18672-18552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4536, stashPosition.y + 18672-18168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4584, stashPosition.y + 18672-18168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4632, stashPosition.y + 18672-18168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4680, stashPosition.y + 18672-18168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4776, stashPosition.y + 18672-18168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4728, stashPosition.y + 18672-18168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4872, stashPosition.y + 18672-18168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4920, stashPosition.y + 18672-18168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5016, stashPosition.y + 18672-18168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5064, stashPosition.y + 18672-18168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5112, stashPosition.y + 18672-18168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5160, stashPosition.y + 18672-18168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5208, stashPosition.y + 18672-18168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5256, stashPosition.y + 18672-18168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5304, stashPosition.y + 18672-18216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5304, stashPosition.y + 18672-18264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5352, stashPosition.y + 18672-18264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5400, stashPosition.y + 18672-18312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5400, stashPosition.y + 18672-18360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5400, stashPosition.y + 18672-18408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5400, stashPosition.y + 18672-18456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5400, stashPosition.y + 18672-18504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5400, stashPosition.y + 18672-18552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5400, stashPosition.y + 18672-18648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5400, stashPosition.y + 18672-18696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5400, stashPosition.y + 18672-18792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5400, stashPosition.y + 18672-18840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5400, stashPosition.y + 18672-18888, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5400, stashPosition.y + 18672-18936, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5400, stashPosition.y + 18672-18984, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5400, stashPosition.y + 18672-19032, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5400, stashPosition.y + 18672-19032, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5352, stashPosition.y + 18672-19080, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5304, stashPosition.y + 18672-19080, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5304, stashPosition.y + 18672-19128, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5256, stashPosition.y + 18672-19176, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5208, stashPosition.y + 18672-19176, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5160, stashPosition.y + 18672-19176, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5112, stashPosition.y + 18672-19176, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5064, stashPosition.y + 18672-19176, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5016, stashPosition.y + 18672-19176, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4920, stashPosition.y + 18672-19176, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4872, stashPosition.y + 18672-19176, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4776, stashPosition.y + 18672-19176, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4728, stashPosition.y + 18672-19176, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4632, stashPosition.y + 18672-19176, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4680, stashPosition.y + 18672-19176, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4584, stashPosition.y + 18672-19176, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4536, stashPosition.y + 18672-19176, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4488, stashPosition.y + 18672-19128, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4488, stashPosition.y + 18672-19080, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4440, stashPosition.y + 18672-19080, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4392, stashPosition.y + 18672-19032, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4392, stashPosition.y + 18672-18984, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4392, stashPosition.y + 18672-18936, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4392, stashPosition.y + 18672-18888, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4392, stashPosition.y + 18672-18840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4392, stashPosition.y + 18672-18792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4392, stashPosition.y + 18672-18648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4392, stashPosition.y + 18672-18696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5016, stashPosition.y + 18672-18744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4968, stashPosition.y + 18672-18744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4968, stashPosition.y + 18672-18792, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4968, stashPosition.y + 18672-18792, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4776, stashPosition.y + 18672-18744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4824, stashPosition.y + 18672-18792, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4776, stashPosition.y + 18672-18600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4824, stashPosition.y + 18672-18600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4824, stashPosition.y + 18672-18552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4968, stashPosition.y + 18672-18552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5016, stashPosition.y + 18672-18600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4968, stashPosition.y + 18672-18600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4872, stashPosition.y + 18672-18600, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4920, stashPosition.y + 18672-18600, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4968, stashPosition.y + 18672-18648, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4968, stashPosition.y + 18672-18696, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4920, stashPosition.y + 18672-18744, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4872, stashPosition.y + 18672-18744, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4824, stashPosition.y + 18672-18696, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4824, stashPosition.y + 18672-18648, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4728, stashPosition.y + 18672-18600, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4824, stashPosition.y + 18672-18504, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4968, stashPosition.y + 18672-18504, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5064, stashPosition.y + 18672-18600, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5064, stashPosition.y + 18672-18744, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4968, stashPosition.y + 18672-18840, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4824, stashPosition.y + 18672-18840, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4728, stashPosition.y + 18672-18744, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4632, stashPosition.y + 18672-18744, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4536, stashPosition.y + 18672-18744, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4440, stashPosition.y + 18672-18744, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4440, stashPosition.y + 18672-18600, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4536, stashPosition.y + 18672-18600, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4632, stashPosition.y + 18672-18600, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4824, stashPosition.y + 18672-18408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4824, stashPosition.y + 18672-18312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4824, stashPosition.y + 18672-18216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4968, stashPosition.y + 18672-18216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4968, stashPosition.y + 18672-18312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4968, stashPosition.y + 18672-18408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5160, stashPosition.y + 18672-18600, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5256, stashPosition.y + 18672-18600, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5352, stashPosition.y + 18672-18600, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5352, stashPosition.y + 18672-18744, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5256, stashPosition.y + 18672-18744, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-5160, stashPosition.y + 18672-18744, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4968, stashPosition.y + 18672-18936, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4968, stashPosition.y + 18672-19032, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4968, stashPosition.y + 18672-19128, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4824, stashPosition.y + 18672-19128, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4824, stashPosition.y + 18672-19032, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 4896-4824, stashPosition.y + 18672-18936, 'SlowTrap', 0);
        }
    }, 0)
}
Auto.BuildThingBase = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, "Harvester", 100)
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 0, "Harvester", 100)
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 96, "Harvester", 100)
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, "Harvester", 100);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, "Harvester", 100)
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y, "GoldMine", 0)
            Auto.PlaceBuilding(stashPosition.x, stashPosition.y + 96, "GoldMine", 0)
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 144, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x, stashPosition.y + 192, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 240, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 96, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 192, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 336, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 192, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y, "GoldMine", 0)
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 96, "GoldMine", 0)
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 192, "GoldMine", 0)
            Auto.PlaceBuilding(stashPosition.x, stashPosition.y + 288, "GoldMine", 0)
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 336, "GoldMine", 0)
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 432, "GoldMine", 0)
            Auto.PlaceBuilding(stashPosition.x, stashPosition.y + 384, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 432, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 528, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 96, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 192, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 336, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 432, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 480, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 288, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 528, "CannonTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 624, "CannonTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 96, "CannonTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 192, "CannonTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 96, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 720, stashPosition.y + 192, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 672, stashPosition.y + 288, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x, stashPosition.y + 480, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x, stashPosition.y + 576, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 624, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 720, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 672, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 672, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 624, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 528, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 576, "BombTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 288, "BombTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 576, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 312, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 408, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 408, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 456, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 504, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 504, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 408, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 768, "CannonTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 768, stashPosition.y + 288, "CannonTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 672, stashPosition.y + 384, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 480, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 384, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 360, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 456, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 696, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 744, "Door", 0)
        }
    }, 0)
}

var HELL = 1008;
var HELL2 = 17856;
window.BSB = function() {
  Auto.BuildBryanSmithBase()
}
window.TB = function() {
  Auto.BuildThingBase()
}
window.TH = function() {
  Auto2.GoldGenerator()
}
window.MB = function() {
  EXTREME.BuildMyBase()
}
window.XBase = function () {
EXTREME.BuildXBase()
}
window.SmallCornerBase = function () {
EXTREME.BuildMyBase2()
}
window.SSLQ = () => {
Auto.SSLQ1()
}
window.leave = function() {
  Game.currentGame.network.sendRpc({
    name: "LeaveParty"
  })
}

$("TFbtn").addEventListener("click", FREEZE);
var TowerFreeze = null;
var key;
let e = 200;
$("TFvalidKey").addEventListener("click", function() {
  key = $("TFkey").value;
    e = $("TFe").value;
});

function FREEZE() {
  if ($("TFbtn").innerText == "Freeze Towers") {
    $("TFbtn").innerText = "Unfreeze Towers";
  } else {
    $("TFbtn").innerText = "Freeze Towers";
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
    }, e);
  } else {
    clearInterval(TowerFreeze);
    TowerFreeze = null;
  }
}

$("TFbtn2").addEventListener("click", FREEZE2);
var TowerFreeze2 = null;
var key2=450;
$("TFvalidKey2").addEventListener("click", function() {
  key2 = $("TFkey2").value;
});

function FREEZE2() {
  if ($("TFbtn2").innerText == "Heal towers by using X postion") {
    $("TFbtn2").innerText = "Unheal towers by using X postion";
  } else {
    $("TFbtn2").innerText = "Heal towers by using X postion";
  }
  if (TowerFreeze2 == null) {
    TowerFreeze2 = setInterval(function() {
        setTimeout(() => {
        spellHP2()
        },600)
        setTimeout(() => {
        spellHP3()
        },250)
        setTimeout(() => {
        spellHP4()
        },300)
        setTimeout(() => {
        spellHP5()
        },350)
        setTimeout(() => {
        spellHP9()
        },400)
        setTimeout(() => {
        spellHP10()
        },450)
        setTimeout(() => {
        spellHP11()
        },500)
        setTimeout(() => {
        spellHP12()
        },550)
        setTimeout(() => {
        spellHP13()
        },200)
    }, key2);
  } else {
    clearInterval(TowerFreeze2);
    TowerFreeze2 = null;
  }
}

$("TFbtn3").addEventListener("click", FREEZE3);
var TowerFreeze3 = null;
var key3;
$("TFvalidKey3").addEventListener("click", function() {
  key3 = $("TFkey3").value;
});

function FREEZE3() {
  if ($("TFbtn3").innerText == "Enable unkickable mode") {
    $("TFbtn3").innerText = "Disable unkickable mode";
  } else {
    $("TFbtn3").innerText = "Enable unkickable mode";
  }
  if (TowerFreeze3 == null) {
    TowerFreeze3 = setInterval(function() {
      Game.currentGame.network.sendRpc({
        name: "JoinPartyByShareKey",
        partyShareKey: key3
      });
    }, 50);
  } else {
    clearInterval(TowerFreeze3);
    TowerFreeze3 = null;
  }
}
window.SellStash = function() {
   //   Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to sell stash?", 1e4, function() {
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
   // })
}
window.spellHP2 = function() {
Game.currentGame.network.sendRpc({
name:"CastSpell",
spell:"HealTowersSpell",
x: Math.round(Game.currentGame.ui.playerTick.position.x + -250),
y: Math.round(Game.currentGame.ui.playerTick.position.y + -250),
tier: 1
})
}
window.spellHP3 = function() {
Game.currentGame.network.sendRpc({
name:"CastSpell",
spell:"HealTowersSpell",
x: Math.round(Game.currentGame.ui.playerTick.position.x + 250),
y: Math.round(Game.currentGame.ui.playerTick.position.y + 250),
tier: 1
})
}
window.spellHP4 = function() {
Game.currentGame.network.sendRpc({
name:"CastSpell",
spell:"HealTowersSpell",
x: Math.round(Game.currentGame.ui.playerTick.position.x + -250),
y: Math.round(Game.currentGame.ui.playerTick.position.y + 250),
tier: 1
})
}
window.spellHP5 = function() {
Game.currentGame.network.sendRpc({
name:"CastSpell",
spell:"HealTowersSpell",
x: Math.round(Game.currentGame.ui.playerTick.position.x + 250),
y: Math.round(Game.currentGame.ui.playerTick.position.y + -250),
tier: 1
})
}
window.spellHP9 = function() {
Game.currentGame.network.sendRpc({
name:"CastSpell",
spell:"HealTowersSpell",
x: Math.round(Game.currentGame.ui.playerTick.position.x + -600),
y: Math.round(Game.currentGame.ui.playerTick.position.y + -600),
tier: 1
})
}
window.spellHP10 = function() {
Game.currentGame.network.sendRpc({
name:"CastSpell",
spell:"HealTowersSpell",
x: Math.round(Game.currentGame.ui.playerTick.position.x + 600),
y: Math.round(Game.currentGame.ui.playerTick.position.y + 600),
tier: 1
})
}
window.spellHP11 = function() {
Game.currentGame.network.sendRpc({
name:"CastSpell",
spell:"HealTowersSpell",
x: Math.round(Game.currentGame.ui.playerTick.position.x + -600),
y: Math.round(Game.currentGame.ui.playerTick.position.y + 600),
tier: 1
})
}
window.spellHP12 = function() {
Game.currentGame.network.sendRpc({
name:"CastSpell",
spell:"HealTowersSpell",
x: Math.round(Game.currentGame.ui.playerTick.position.x + 600),
y: Math.round(Game.currentGame.ui.playerTick.position.y + -600),
tier: 1
})
}
window.spellHP13 = function() {
Game.currentGame.network.sendRpc({
name:"CastSpell",
spell:"HealTowersSpell",
x: Math.round(Game.currentGame.ui.playerTick.position.x),
y: Math.round(Game.currentGame.ui.playerTick.position.y),
tier: 1
})
}
   let spellHP = function() {
Game.currentGame.network.sendRpc({
name:"CastSpell",
spell:"HealTowersSpell",
x: Math.round(Game.currentGame.ui.playerTick.position.x),
y: Math.round(Game.currentGame.ui.playerTick.position.y),
tier: 1
})
}
function Accepton() {
   let confirm = document.getElementsByClassName('btn btn-green hud-confirmation-accept');
      for (var i = 0; i < confirm.length; i++) {
        var accept = confirm[i];
        accept.click();
      }
}

function aito() {
$("hud-spell-icon")[1].click()
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
window.sellDoors = function() {
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
window.sellTraps = function() {
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
window.SellAll = function() {
     // Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to sell all?", 1e4, function() {
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
    //  })
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
    window.sellpets = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "PetMiner") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
            var entities2 = Game.currentGame.world.entities;
    for (var uid2 in entities2) {
        if (!entities2.hasOwnProperty(uid2)) continue;
        var obj2 = entities2[uid2];
        if (obj2.fromTick.model == "PetCARL") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj2.fromTick.uid
            })
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
        let sellBombs = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(obj.fromTick.model == "BombTower") {
                                Game.currentGame.network.sendRpc({
                                        "name": "DeleteBuilding",
                                        "uid": obj.fromTick.uid
                                })

                        }
                }
        },

        upgradeBombs = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(obj.fromTick.model == "BombTower") {
                                Game.currentGame.network.sendRpc({
                                        "name": "UpgradeBuilding",
                                        "uid": obj.fromTick.uid
                                })
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
                }, 35);
           }
     }
          function stopUPP() {
  var trade = document.getElementById("UPP");
  if (trade.innerHTML == "Enable Upgrade All") {
    trade.innerHTML = "Disable Upgrade All";
  } else {
    trade.innerHTML = "Enable Upgrade All";
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
                  Accepton();
                }, 0);
           }
     }
          function stopSSL() {
  var trade = document.getElementById("SSL");
  if (trade.innerHTML == "Enable Accept All") {
    trade.innerHTML = "Disable Accept All";
  } else {
    trade.innerHTML = "Enable Accept All";
  }
}
//

var button212 = document.getElementById("SSL4");
button212.addEventListener("click", startSSL4);
button212.addEventListener("click", stopSSL4);
var SSL4 = null;
function startSSL4() {
clearInterval(SSL4);
  if (SSL4 !== null) {
    SSL4 = null;
  } else {

              SSL4 = setInterval(function() {
aito()
           }, 0)
  }
}

         function stopSSL4() {
  var trade = document.getElementById("SSL4");
  if (trade.innerHTML == "Enable auto use timeout") {
    trade.innerHTML = "Disable auto use timeout";
  } else {
    trade.innerHTML = "Enable auto use timeout";
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
  if (trade.innerHTML == "Enable AHRC") {
    trade.innerHTML = "Disable AHRC";
  } else {
    trade.innerHTML = "Enable AHRC";
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
  if (trade.innerHTML == "Enable Autobow") {
    trade.innerHTML = "Disable Autobow";
  } else {
    trade.innerHTML = "Enable Autobow";
  }
}

//
var button211 = document.getElementById("SSL3");
button211.addEventListener("click", startSSL3);
button211.addEventListener("click", stopSSL3);
var SSL3 = null;
var f4=500;
$("Fe4").addEventListener("click", function() {
  f4 = $("F4").value;
});
function startSSL3() {
clearInterval(SSL3);
  if (SSL3 !== null) {
    SSL3 = null;
  } else {

              SSL3 = setInterval(function() {
spellHP()
           }, f4)
  }
}

         function stopSSL3() {
  var trade = document.getElementById("SSL3");
  if (trade.innerHTML == "Enable Tower Heal") {
    trade.innerHTML = "Disable Tower Heal";
  } else {
    trade.innerHTML = "Enable Tower Heal";
  }
}
var button215 = document.getElementById("SSL5");
button215.addEventListener("click", startSSL5);
button215.addEventListener("click", stopSSL5);
var SSL5 = null;
var f=1000;
$("Fe").addEventListener("click", function() {
  f = $("F").value;
});
function startSSL5() {
clearInterval(SSL5);
  if (SSL5 !== null) {
    SSL5 = null;
  } else {

              SSL5 = setInterval(function() {
MB()
           }, f)
  }
}

         function stopSSL5() {
  var trade = document.getElementById("SSL5");
  if (trade.innerHTML == "Enable Defense Base") {
    trade.innerHTML = "Disable Defense Base";
  } else {
    trade.innerHTML = "Enable Defense Base";
  }
}
var button216 = document.getElementById("SSL6");
button216.addEventListener("click", startSSL6);
button216.addEventListener("click", stopSSL6);
var SSL6 = null;
var f2=700;
$("Fe2").addEventListener("click", function() {
  f2 = $("F2").value;
});
function startSSL6() {
clearInterval(SSL6);
  if (SSL6 !== null) {
    SSL6 = null;
  } else {

              SSL6 = setInterval(function() {
TH()

           }, f2)
  }
}

         function stopSSL6() {
  var trade = document.getElementById("SSL6");
  if (trade.innerHTML == "Enable gold generator") {
    trade.innerHTML = "Disable gold generator";
  } else {
    trade.innerHTML = "Enable gold generator";
  }
}
var button218 = document.getElementById("SSL6");
button218.addEventListener("click", startSSL8);
button218.addEventListener("click", stopSSL8);
var SSL8 = null;
function startSSL8() {
clearInterval(SSL8);
  if (SSL8 !== null) {
    SSL8 = null;
  } else {

              SSL8 = setInterval(function() {
ee()

           }, 25)
  }
}

         function stopSSL8() {
  var trade = document.getElementById("SSL8");
  if (trade.innerHTML == "Enable gold generator") {
    trade.innerHTML = "Disable gold generator";
  } else {
    trade.innerHTML = "Enable gold generator";
  }
}
var button219 = document.getElementById("SSL9");
button219.addEventListener("click", startSSL9);
button219.addEventListener("click", stopSSL9);
var SSL9 = null;
function startSSL9() {
clearInterval(SSL9);
  if (SSL9 !== null) {
    SSL9 = null;
  } else {

              SSL9 = setInterval(function() {
                                    Accepton();
document.getElementsByClassName("hud-member-kick")[1].click()
document.getElementsByClassName("hud-member-kick")[2].click()
document.getElementsByClassName("hud-member-kick")[3].click()
}, 0)
  }
}

         function stopSSL9() {
  var trade = document.getElementById("SSL9");
  if (trade.innerHTML == "Enable kick all") {
    trade.innerHTML = "Disable kick all";
  } else {
    trade.innerHTML = "Enable kick all";
  }
}
var button217 = document.getElementById("SSL7");
button217.addEventListener("click", startSSL7);
button217.addEventListener("click", stopSSL7);
var SSL7 = null;
var f3=500;
$("Fe3").addEventListener("click", function() {
  f3 = $("F3").value;
});
function startSSL7() {
clearInterval(SSL7);
  if (SSL7 !== null) {
    SSL7 = null;
  } else {

              SSL7 = setInterval(function() {
Game.currentGame.network.sendRpc({
name:"CastSpell",
spell: "HealTowersSpell",
x: Math.round(Game.currentGame.ui.playerTick.position.x + Game.currentGame.ui.mousePosition.x + -550),
y: Math.round(Game.currentGame.ui.playerTick.position.y + Game.currentGame.ui.mousePosition.y + -450),
tier: 1
})
           }, f3)
  }
}

         function stopSSL7() {
  var trade = document.getElementById("SSL7");
  if (trade.innerHTML == "Heal towers by using mouse position") {
    trade.innerHTML = "Unheal towers by using mouse position";
  } else {
    trade.innerHTML = "Heal towers by using mouse position";
  }
}
function heal() {
        Game.currentGame.network.sendRpc({
            "name": "BuyItem",
            "itemName": "HealthPotion",
            "tier": 1
        })

        Game.currentGame.network.sendRpc({
            "name": "EquipItem",
            "itemName": "HealthPotion",
            "tier": 1
        })
        Game.currentGame.network.sendRpc({
            "name": "BuyItem",
            "itemName": "PetHealthPotion",
            "tier": 1
        })

        Game.currentGame.network.sendRpc({
            "name": "EquipItem",
            "itemName": "PetHealthPotion",
            "tier": 1
        })
}
    setTimeout(function() {
        setTimeout(function() {
            if (sessionStorage.ait === "true") {
                $("btn btn-green hud-intro-play").click()
            }
            var GoldObserver;
            var gold;
            var isInWorld = setInterval(function() {
                if (Game.currentGame.world.inWorld) {
                    clearInterval(isInWorld)
                    setTimeout(function() {

                        gold = Game.currentGame.world.localPlayer.entity.fromTick.gold
                        GoldObserver = function(goldAmount, doFunction) {
                            var Observer = setInterval(function() {
                                if (Game.currentGame.world.localPlayer.entity.fromTick.gold !== gold) {
                                    gold = Game.currentGame.world.localPlayer.entity.fromTick.gold
                                }
                                if (gold > goldAmount) {
                                    doFunction()
                                    clearInterval(Observer)
                                }
                            })
                        }
                        console.log(GoldObserver)
                        if (sessionStorage.ait === "true") {
                            GoldObserver(10500, function() {
                                if (sessionStorage.ait) {
                                    $("hud-spell-icon")[1].click()
                                    sessionStorage.ait = "true"
                                    Observer.observe($("hud-ticker-bar"), {
                                        attributes: true,
                                        attributeFilter: ['style']
                                    })
                                } else {
                                    sessionStorage.setItem("ait", "false")
                                }
                            })
                        }
                        var Observer = new MutationObserver(function(mutations) {
                            mutations.forEach(function(mutation) {
                                    if ($("hud-ticker-bar").style.backgroundPosition === "-2.65417px 0px") {
                                    console.log("changed!")
                                    window.location.reload()
                                    console.error(window.sessionStorage.force);
                                }
                                if ($("hud-ticker-bar").style.backgroundPosition === "0.0541667px 0px") {
                                    console.log("changed!")
                                    window.location.reload()
                                    console.error(window.sessionStorage.force);
                                }
                                if ($("hud-ticker-bar").style.backgroundPosition === "-3.19583px 0px") {
                                    console.log("changed!")
                                    window.location.reload()
                                    console.error(window.sessionStorage.force);
                                }
                                if ($("hud-ticker-bar").style.backgroundPosition === "-7.52917px 0px") {
                                    console.log("changed!")
                                    window.location.reload()
                                    console.error(window.sessionStorage.force);
                                }
                            })
                        })
                        $("btn btn-green start-aito").addEventListener("click", function() {
                            if (sessionStorage.ait) {
                                sessionStorage.ait = "true"
                                Observer.observe($("hud-ticker-bar"), {
                                    attributes: true,
                                    attributeFilter: ['style']
                                })
                            } else {
                                sessionStorage.setItem("ait", "false")
                            }
                        })
                        $("btn btn-green stop-aito").addEventListener("click", function stop() {
                            sessionStorage.ait = "false"
                        })
                    }, 500)
                }
            }, 100)
        }, 250)
    }, 1500)