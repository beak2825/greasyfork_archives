// ==UserScript==
// @name         Base Saver - zombs.io
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  just base saver
// @author       skittle-troller
// @match        http://zombs.io/
// @icon         https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/220/right-pointing-magnifying-glass_1f50e.png
// @grant        none
// @require      https://greasyfork.org/scripts/47911-font-awesome-all-js/code/Font-awesome%20AllJs.js?version=275337
// @downloadURL https://update.greasyfork.org/scripts/438788/Base%20Saver%20-%20zombsio.user.js
// @updateURL https://update.greasyfork.org/scripts/438788/Base%20Saver%20-%20zombsio.meta.js
// ==/UserScript==

let css2 = `
.btn:hover {
cursor: pointer;
}
.btn-blue {
background-color: #144b7a;
}
.btn-blue:hover .btn-blue:active {
background-color: #4fa7ee;
}
.box {
display: block;
width: 100%;
height: 50px;
line-height: 34px;
padding: 8px 14px;
margin: 0 0 10px;
background: #eee;
border: 0;
font-size: 14px;
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
border-radius: 4px;
}
.codeIn, .joinOut {
height: 50px;
}
.hud-menu-zipp3 {
display: none;
position: fixed;
top: 48%;
left: 50%;
width: 600px;
height: 470px;
margin: -270px 0 0 -300px;
padding: 20px;
background: rgba(0, 0, 0, 0.6);
color: #eee;
border-radius: 4px;
z-index: 15;
}
.hud-menu-zipp3 h3 {
display: block;
margin: 0;
line-height: 20px;
}
.hud-menu-zipp3 .hud-zipp-grid3 {
display: block;
height: 380px;
padding: 10px;
margin-top: 18px;
background: rgba(0, 0, 0, 0.2);
}
.hud-spell-icons .hud-spell-icon[data-type="Zippity3"]::before {
background-image: url("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/220/right-pointing-magnifying-glass_1f50e.png");
}
.hud-menu-zipp3 .hud-the-tab {
position: relative;
height: 40px;
line-height: 40px;
margin: 20px;
border: 0px solid rgb(0, 0, 0, 0);
}
.hud-menu-zipp3 .hud-the-tab {
display: block;
float: left;
padding: 0 14px;
margin: 0 1px 0 0;
font-size: 14px;
background: rgba(0, 0, 0, 0.4);
color: rgba(255, 255, 255, 0.4);
transition: all 0.15s ease-in-out;
}
.hud-menu-zipp3 .hud-the-tab:hover {
background: rgba(0, 0, 0, 0.2);
color: #eee;
cursor: pointer;
}
`;

let styles = document.createElement("style");
styles.appendChild(document.createTextNode(css2));
document.head.appendChild(styles);

// class changing
document.getElementsByClassName("hud-intro-form")[0].style.height = "300px";
document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-blue hud-intro-play");

// spell icon
let spell = document.createElement("div");
spell.classList.add("hud-spell-icon");
spell.setAttribute("data-type", "Zippity3");
spell.classList.add("hud-zipp3-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);

//Menu for spell icon
let modHTML = `
<div class="hud-menu-zipp3">
<br />
<div class="hud-zipp-grid3">
</div>
</div>
`;
document.body.insertAdjacentHTML("afterbegin", modHTML);
let zipz123 = document.getElementsByClassName("hud-menu-zipp3")[0];

//Onclick
document.getElementsByClassName("hud-zipp3-icon")[0].addEventListener("click", function() {
  if(zipz123.style.display == "none") {
    zipz123.style.display = "block";
    for(var i = 0; i < menus.length; i++) {
      menus[i].style.display = "none";
    }
  } else {
        zipz123.style.display = "none";
  };
});

let _menu = document.getElementsByClassName("hud-menu-icon");
let _spell = document.getElementsByClassName("hud-spell-icon");
let allIcon = [
        _menu[0],
        _menu[1],
        _menu[2],
  _spell[0],
  _spell[1]
];

allIcon.forEach(function(elem) {
        elem.addEventListener("click", function() {
                if(zipz123.style.display == "block") {
                        zipz123.style.display = "none";
                };
        });
});

// key to open and close
function modm() {
        if(zipz123.style.display == "none") {
    zipz123.style.display = "block";
    for(var i = 0; i < menus.length; i++) {
      menus[i].style.display = "none";
    }
  } else {
        zipz123.style.display = "none";
  };
};

  document.getElementsByClassName("hud-zipp-grid3")[0].innerHTML = `
<div style="text-align:center"><br>
<hr />
<h3>Base Saver <br>
<hr />
WARNING: If you place more than 225 building, it wont be saved/recorded.</h3>
<hr />
<button onclick="RecordBase();">Record Base!</button>
<button onclick="buildRecordedBase();">Build Recorded Base!</button>
<button onclick="DeleteRecordedbase();">Delete Recorded Base!</button>
<br><br>
<button onclick="saveBase();">Save Towers!</button>
<button onclick="saveTowers();">Build Saved Towers!</button>
<br><br>
<input type="number" value="275" class="SaveSpeed" placeholder="speed" style="width: 20%">
<button class="SaveSpeedbtn">save speed</button>
<button id="SSL31">Enable Auto Build Saved Towers!</button>
<br><br>
<input type="number" value="275" class="SaveSpeed2" placeholder="speed" style="width: 20%">
<button class="SaveSpeedbtn2">save speed</button>
<button id="SSL32">Enable Upgrade All!</button>
<button id="SSL33">Enable Auto Sell All!</button>
  `;
var button231 = document.getElementById("SSL31");
button231.addEventListener("click", startSSL31);
button231.addEventListener("click", stopSSL31);
var SSL31 = null;
var saveSpeed=275;
$("SaveSpeedbtn").addEventListener("click", function() {
  saveSpeed = $("SaveSpeed").value;
});

function startSSL31() {
clearInterval(SSL31);
  if (SSL31 !== null) {
    SSL31 = null;
  } else {

              SSL31 = setInterval(function() {
                 saveTowers()
           }, saveSpeed)
  }
}

         function stopSSL31() {
  var trade = document.getElementById("SSL31");
  if (trade.innerHTML == "Enable Auto Build Saved Towers!") {
    trade.innerHTML = "Disable Auto Build Saved Towers!";
  } else {
    trade.innerHTML = "Enable Auto Build Saved Towers!";
  }
}
var button233 = document.getElementById("SSL33");
button233.addEventListener("click", startSSL33);
button233.addEventListener("click", stopSSL33);
var SSL33 = null;
function startSSL33() {
clearInterval(SSL33);
  if (SSL33 !== null) {
    SSL33 = null;
  } else {

              SSL33 = setInterval(function() {
                 GoldGeneratorr()
           }, saveSpeed2)
  }
}
         function stopSSL33() {
  var trade = document.getElementById("SSL33");
  if (trade.innerHTML == "Enable Auto Sell All!") {
    trade.innerHTML = "Disable Auto Sell All!";
  } else {
    trade.innerHTML = "Enable Auto Sell All!";
  }
}
var button232 = document.getElementById("SSL32");
button232.addEventListener("click", startSSL32);
button232.addEventListener("click", stopSSL32);
var SSL32 = null;
var saveSpeed2=275;
$("SaveSpeedbtn2").addEventListener("click", function() {
  saveSpeed2 = $("SaveSpeed2").value;
});

function startSSL32() {
clearInterval(SSL32);
  if (SSL32 !== null) {
    SSL32 = null;
  } else {

              SSL32 = setInterval(function() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
if(["Door", "SlowTrap", "ArrowTower", "CannonTower", "MeleeTower", "BombTower", "MagicTower", "GoldMine", "Harvester", "Wall"].indexOf(obj.fromTick.model) >= 0) {
                Game.currentGame.network.sendRpc({
                    name: "UpgradeBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
}, 275)
  }
}

         function stopSSL32() {
  var trade = document.getElementById("SSL32");
  if (trade.innerHTML == "Enable Upgrade All!") {
    trade.innerHTML = "Disable Upgrade All!";
  } else {
    trade.innerHTML = "Enable Upgrade All!";
  }
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

var sSsS = function(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
SellAll()
Object.keys(buildings).forEach(key => {
const building = buildings[key]
if(["Wall", "Door", "SlowTrap", "ArrowTower", "CannonTower", "MeleeTower", "BombTower", "MagicTower", "GoldMine", "Harvester" || "Wall"].indexOf(building.type) >= 0) {
delete buildings[key]
}})
}

window.GoldGeneratorr = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash);
            sSsS(stashPosition.x + 100000000000000000000, stashPosition.y + 100000000000000000000000000, "ArrowTower", 0)
            sSsS(stashPosition.x + 20000000000000000000000000, stashPosition.y + 200000000000000000000000, "ArrowTower", 0)
            sSsS(stashPosition.x + 100000000000000000000, stashPosition.y + 100000000000000000000000000, "ArrowTower", 0)
            sSsS(stashPosition.x + 20000000000000000000000000, stashPosition.y + 200000000000000000000000, "ArrowTower", 0)
            sSsS(stashPosition.x + 100000000000000000000, stashPosition.y + 100000000000000000000000000, "ArrowTower", 0)
            sSsS(stashPosition.x + 20000000000000000000000000, stashPosition.y + 200000000000000000000000, "ArrowTower", 0)
           sSsS(stashPosition.x + 20000000000000000000000000, stashPosition.y + 200000000000000000000000, "ArrowTower", 0)
            sSsS(stashPosition.x + 100000000000000000000, stashPosition.y + 100000000000000000000000000, "ArrowTower", 0)
            sSsS(stashPosition.x + 20000000000000000000000000, stashPosition.y + 200000000000000000000000, "ArrowTower", 0)
        }
    }, 0)
}

window.saveTowers = function() {
    var stash = GetGoldStash();
    if (stash == undefined) {
        return
    }
    var stashPosition = {
        x: stash.x,
        y: stash.y
    }
    var buildings = Game.currentGame.ui.buildings;
    for (var uid in buildings) {
        if (!buildings.hasOwnProperty(uid)) {
            continue
        }

        var obj = buildings[uid]
        var x = Game.currentGame.world.entities[obj.uid].fromTick.position.x - stashPosition.x
        var y = Game.currentGame.world.entities[obj.uid].fromTick.position.y - stashPosition.y
        var building = Game.currentGame.world.entities[obj.uid].fromTick.model
        var yaw = Game.currentGame.world.entities[obj.uid].fromTick.yaw
       for (let s of slowTraps) placeBuilding(stashPosition.x+s.x - stashPosition.x, stashPosition.y + s.y-stashPosition.y, s.type, 0);
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
Object.keys(buildings).forEach(key => {
const building = buildings[key]
if(["GoldStash" || "Wall"].indexOf(building.type) >= 0) {
delete buildings[key]
}})
// })
}

let slowTraps = []
const buildings = Game.currentGame.ui.buildings
const saveSlowTraps = () => {
slowTraps = []
Object.keys(buildings).forEach(key => {
const building = buildings[key]
if(["Wall", "Door", "SlowTrap", "ArrowTower", "CannonTower", "MeleeTower", "BombTower", "MagicTower", "GoldMine", "Harvester" || "Wall"].indexOf(building.type) >= 0) {
slowTraps.push(building)
}})},
placeBuilding = function(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}

let GoldStashh = []
const buildings2 = Game.currentGame.ui.buildings
const saveSlowTraps2 = () => {
GoldStashh = []
Object.keys(buildings2).forEach(key => {
const building = buildings2[key]
if(["GoldStash" || "Wall"].indexOf(building.type) >= 0) {
GoldStashh.push(building)
}})}

window.sellBombs = function() {
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
Object.keys(buildings).forEach(key => {
const building = buildings[key]
if(["BombTower" || "Wall"].indexOf(building.type) >= 0) {
delete buildings[key]
}})
}

window.SellAll = function() {
let ss4 = setInterval ( () => {
clearInterval(ss4)
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
Object.keys(buildings).forEach(key => {
const building = buildings[key]
if(["Wall", "Door", "SlowTrap", "ArrowTower", "CannonTower", "MeleeTower", "BombTower", "MagicTower", "GoldMine", "Harvester" || "Wall"].indexOf(building.type) >= 0) {
delete buildings[key]
}})
}, 100)
// })
    }

window.UpgradeAll = function() {
let ss2 = setInterval (() => {
clearInterval(ss2)
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
}, 100)
    }

    window.UpgradeStash = function() {
let ss3 = setInterval (() => {
clearInterval(ss3)
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
}, 100)
    }
window.saveBase = () => {
saveSlowTraps()
}
window.saveStash = () => {
saveSlowTraps2()
}

window.RecordBase = function(baseName) {
Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to record base? If you record it 2 times the first recorded base will be unrecorded.", 1e4, function() {
    var base = ""
    var stash = GetGoldStash();
    if (stash == undefined) {
        return
    }
    var stashPosition = {
        x: stash.x,
        y: stash.y
    }
    var buildings = Game.currentGame.ui.buildings;
    for (var uid in buildings) {
        if (!buildings.hasOwnProperty(uid)) {
            continue
        }

        var obj = buildings[uid]
        var x = Game.currentGame.world.entities[obj.uid].fromTick.position.x - stashPosition.x
        var y = Game.currentGame.world.entities[obj.uid].fromTick.position.y - stashPosition.y
        var building = Game.currentGame.world.entities[obj.uid].fromTick.model
        var yaw = Game.currentGame.world.entities[obj.uid].fromTick.yaw
        base += "PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + building + "', " + yaw + ");"
    }
    localStorage.setItem(baseName, base)
})
}
GetGoldStash = function() {
    var entities = Game.currentGame.ui.buildings
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) {
            continue
        }
        var obj = entities[uid]
        if (obj.type == "GoldStash") {
            return obj
        }
    }
}
PlaceBuilding = function(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}
window.buildRecordedBase = function(myBaseName) {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            stash = GetGoldStash();
            if (stash == undefined) return
            stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            var basecode = localStorage.getItem(myBaseName)
            basecode = new Function(basecode)
            return basecode()
        }
    }, 275)
}
window.DeleteRecordedbase = function(mybasename) {
Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete recorded base?", 1e4, function() {
    if (localStorage.getItem(mybasename)) {
        localStorage.removeItem(mybasename)
    }
})
}