// ==UserScript==
// @name         </> Kurt & Java Otomatik Kurucu
// @namespace    http://tampermonkey.net/
// @version      22.2
// @description  Kurt & Java
// @author       Kurt
// @match        http://zombs.io/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/424150/%3C%3E%20Kurt%20%20Java%20Otomatik%20Kurucu.user.js
// @updateURL https://update.greasyfork.org/scripts/424150/%3C%3E%20Kurt%20%20Java%20Otomatik%20Kurucu.meta.js
// ==/UserScript==

let css2 = `
.btn:hover {
cursor: pointer;
}
.btn-blue {
background-color: #010201;
}
.btn-blue:hover .btn-blue:active {
background-color: #010201;
}
.btn:hover {
cursor: pointer;
}
.btn-red {
background-color: #360010;
}
.btn-red:hover .btn-blue:active {
background-color: #360010;
}
.btn:hover {
cursor: pointer;
}
.btn-gold {
background-color: #5a6600;
}
.btn-gold:hover .btn-blue:active {
background-color: #5a6600;
}
.btn:hover {
cursor: pointer;
}
.btn-purple {
background-color: #290033;
}
.btn-purple:hover .btn-blue:active {
background-color: #290033;
}
.btn:hover {
cursor: pointer;
}
.btn-purple {
background-color: #290033;
}
.btn-purple:hover .btn-blue:active {
background-color: #290033;
}
.btn:hover {
cursor: pointer;
}
.btn-green {
background-color: #001603;
}
.btn-green:hover .btn-blue:active {
background-color: #001603;
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
.hud-menu-zipp2 {
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
.hud-menu-zipp2 h3 {
display: block;
margin: 0;
line-height: 20px;
}
.hud-menu-zipp2 .hud-zipp-grid2 {
display: block;
height: 380px;
padding: 10px;
margin-top: 18px;
background: rgba(0, 0, 0, 0.2);
}
.hud-spell-icons .hud-spell-icon[data-type="Zippity2"]::before {
background-image: url("https://discordapp.com/assets/28a6206f93399999d1a908d5c45232ad.svg");
}
.hud-menu-zipp2 .hud-the-tab {
position: relative;
height: 40px;
line-height: 40px;
margin: 20px;
border: 0px solid rgb(0, 0, 0, 0);
}
.hud-menu-zipp2 .hud-the-tab {
display: block;
float: left;
padding: 0 14px;
margin: 0 1px 0 0;
font-size: 14px;
background: rgba(0, 0, 0, 0.4);
color: rgba(255, 255, 255, 0.4);
transition: all 0.15s ease-in-out;
}
.hud-menu-zipp2 .hud-the-tab:hover {
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
spell.setAttribute("data-type", "Zippity2");
spell.classList.add("hud-zipp2-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);

//Menu for spell icon
let modHTML = `
<div class="hud-menu-zipp2">
<br />
<div class="hud-zipp-grid2">
</div>
</div>
`;
document.body.insertAdjacentHTML("afterbegin", modHTML);
let zipz123 = document.getElementsByClassName("hud-menu-zipp2")[0];

//Onclick
document.getElementsByClassName("hud-zipp2-icon")[0].addEventListener("click", function() {
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

  document.getElementsByClassName("hud-zipp-grid2")[0].innerHTML = `
<div style="text-align:center"><br>
<hr />
<h3>• Kurt & Java Otomatik Kurucu</h3>
<hr />
<button onclick="BSB();">TC Base</button>
<button onclick="TB();">Dead Base</button>
<button onclick="XBase();">TC Base2</button>
<button onclick="SmallCornerBase();">Tosun Base</button>
<button onclick="SSLQ();">Zelta Base</button>
<button onclick="deathrainbase();">Orjinal Base</button>
<button onclick="Turan0();">Turan Base</button>
<button onclick="Tombul0();">Tombul Base</button>
<h5>NOT: Kalkan Base Ve Kapan Base Kendini Yenileyebilir.</h5>
<input type="number" value="1000" class="F" placeholder="speed" style="width: 20%;">
<button class="Fe">Hız</button>
<button id="SSL5">Kalkan Base &</button>
<br><br>
<input type="number" value="825" class="F2" placeholder="speed" style="width: 20%;">
<button class="Fe2">Hız</button>
  <button id="SSL6">Altın Jeneratör &</button> &nbsp;
<br><br>
<input type="number" value="2500" class="F0" placeholder="speed" style="width: 20%;">
<button class="Fe0">Hız</button>
  <button id="SSL0">Kapan Base &</button> &nbsp;
<br><br>
  `;
var button216 = document.getElementById("SSL6");
button216.addEventListener("click", startSSL6);
button216.addEventListener("click", stopSSL6);
var SSL6 = null;
var f2=825;
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
  if (trade.innerHTML == "Altın Jeneratör (+)") {
    trade.innerHTML = "Altın Jeneratör (-)";
  } else {
    trade.innerHTML = "Altın Jeneratör (+)";
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
upgradeBombs()
           }, 25)
  }
}

         function stopSSL8() {
  var trade = document.getElementById("SSL8");
  if (trade.innerHTML == "Altın Jeneratör (+)") {
    trade.innerHTML = "Altın Jeneratör (-)";
  } else {
    trade.innerHTML = "Altın Jeneratör (+)";
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
  if (trade.innerHTML == "Kalkan Base (+)") {
    trade.innerHTML = "Kalkan Base (-)";
  } else {
    trade.innerHTML = "Kalkan Base (+)";
  }
}

var button210 = document.getElementById("SSL0");
button210.addEventListener("click", startSSL0);
button210.addEventListener("click", stopSSL0);
var SSL0 = null;
var f0=2500;
$("Fe0").addEventListener("click", function() {
  f0 = $("F0").value;
});
function startSSL0() {
clearInterval(SSL0);
  if (SSL0 !== null) {
    SSL0 = null;
  } else {

              SSL0 = setInterval(function() {
BRYSCRBSE();
           }, f0)
  }
}

         function stopSSL0() {
  var trade = document.getElementById("SSL0");
  if (trade.innerHTML == "Kapan Base (+)") {
    trade.innerHTML = "Kapan Base (-)";
  } else {
    trade.innerHTML = "Kapan Base (+)";
  }
}
       var upgradeBombs = () => {
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
       var sellBombs = () => {
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
var buildings = Game.currentGame.ui.buildings
Object.keys(buildings).forEach(key => {
const building = buildings[key]
if(["BombTower" || "Wall"].indexOf(building.type) >= 0) {
delete buildings[key]
}})
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
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0);
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0);
           Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0);
           Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0);
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0);
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0);
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0);
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)

        }
    }, 0)
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
    }, 150)
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
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 192, "Harvester", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, "Harvester", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 0, "Harvester", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 96, "Harvester", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, "Harvester", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, "Harvester", 0)

        }
    }, 150)
}

Auto.Tombul0 = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash);
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 0, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 0, "GoldMine", 0)
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
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 192, "Harvester", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, "Harvester", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 0, "Harvester", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 96, "Harvester", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, "Harvester", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, "Harvester", 0)

        }
    }, 150)
}

Auto.Turan0 = function() {
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
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -192, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -192, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -48, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 192, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 192, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 144, 'BombTower', 0);
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
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -144, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 384, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 576, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 144, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -384, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -480, 'ArrowTower', 0);
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
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 696, 'Door', 0);
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
    }, 150)
}

Auto.Turan1 = function() {
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
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -192, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -192, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -48, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 192, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 192, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 144, 'BombTower', 0);
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
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -144, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 384, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 576, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 144, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -384, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -480, 'ArrowTower', 0);
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
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 696, 'Door', 0);
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
    }, 150)
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
    }, 150)
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
    }, 150)
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
PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 0);PlaceBuilding(stashPosition.x + -144, stashPosition.y + 144, 'GoldMine', 0);PlaceBuilding(stashPosition.x + -144, stashPosition.y + -144, 'GoldMine', 0);PlaceBuilding(stashPosition.x + 144, stashPosition.y + -144, 'GoldMine', 0);PlaceBuilding(stashPosition.x + 144, stashPosition.y + 144, 'GoldMine', 0);PlaceBuilding(stashPosition.x + 240, stashPosition.y + 240, 'GoldMine', 0);PlaceBuilding(stashPosition.x + 240, stashPosition.y + -240, 'GoldMine', 0);PlaceBuilding(stashPosition.x + -240, stashPosition.y + -240, 'GoldMine', 0);PlaceBuilding(stashPosition.x + -240, stashPosition.y + 240, 'GoldMine', 0);PlaceBuilding(stashPosition.x + 144, stashPosition.y + 240, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 240, stashPosition.y + 144, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + -144, stashPosition.y + 240, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + -240, stashPosition.y + 144, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 144, stashPosition.y + -240, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 240, stashPosition.y + -144, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + -144, stashPosition.y + -240, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + -240, stashPosition.y + -144, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + -144, stashPosition.y + 0, 'Harvester', 0);PlaceBuilding(stashPosition.x + 0, stashPosition.y + -144, 'Harvester', 0);PlaceBuilding(stashPosition.x + 240, stashPosition.y + 0, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 0, stashPosition.y + 240, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + -240, stashPosition.y + 0, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 0, stashPosition.y + -240, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 432, stashPosition.y + -144, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 432, stashPosition.y + 144, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 144, stashPosition.y + 432, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 0, stashPosition.y + 432, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -144, stashPosition.y + 432, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -432, stashPosition.y + 144, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -432, stashPosition.y + 0, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -432, stashPosition.y + -144, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -144, stashPosition.y + -432, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 0, stashPosition.y + -432, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 144, stashPosition.y + -432, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 0, stashPosition.y + -336, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + -336, stashPosition.y + 0, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 0, stashPosition.y + 336, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 336, stashPosition.y + 0, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 144, stashPosition.y + 336, 'CannonTower', 0);PlaceBuilding(stashPosition.x + 336, stashPosition.y + 144, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -336, stashPosition.y + 144, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -144, stashPosition.y + 336, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -144, stashPosition.y + -336, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -336, stashPosition.y + -144, 'CannonTower', 0);PlaceBuilding(stashPosition.x + 144, stashPosition.y + -336, 'CannonTower', 0);PlaceBuilding(stashPosition.x + 336, stashPosition.y + -144, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -120, stashPosition.y + -72, 'Door', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + -72, 'Door', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + -120, 'Door', 0);PlaceBuilding(stashPosition.x + 120, stashPosition.y + -72, 'Door', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + -120, 'Door', 0);PlaceBuilding(stashPosition.x + 120, stashPosition.y + 72, 'Door', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + 72, 'Door', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + 120, 'Door', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + 120, 'Door', 0);PlaceBuilding(stashPosition.x + -120, stashPosition.y + 72, 'Door', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + 24, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + -24, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -24, stashPosition.y + -72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 24, stashPosition.y + -72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 168, stashPosition.y + 72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + 168, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + 168, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -168, stashPosition.y + 72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -168, stashPosition.y + -72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + -168, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + -168, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 168, stashPosition.y + -72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 264, stashPosition.y + -72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 360, stashPosition.y + -72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 456, stashPosition.y + -72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 456, stashPosition.y + 72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 360, stashPosition.y + 72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 264, stashPosition.y + 72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + 264, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + 360, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + 456, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + 456, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + 360, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + 264, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -264, stashPosition.y + 72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -360, stashPosition.y + 72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -456, stashPosition.y + 72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -456, stashPosition.y + -72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -360, stashPosition.y + -72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -264, stashPosition.y + -72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + -264, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + -360, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + -456, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + -456, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + -360, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + -264, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + -72, 'Door', 0);PlaceBuilding(stashPosition.x + 0, stashPosition.y + 144, 'Harvester', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + 72, 'Door', 0);PlaceBuilding(stashPosition.x + 24, stashPosition.y + 72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -24, stashPosition.y + 72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 480, stashPosition.y + -240, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 528, stashPosition.y + -336, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 384, stashPosition.y + -240, 'CannonTower', 0);PlaceBuilding(stashPosition.x + 240, stashPosition.y + -384, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 240, stashPosition.y + -480, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -240, stashPosition.y + -480, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -336, stashPosition.y + -528, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -240, stashPosition.y + -384, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -480, stashPosition.y + -240, 'CannonTower', 0);PlaceBuilding(stashPosition.x + 336, stashPosition.y + -528, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 528, stashPosition.y + 336, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 384, stashPosition.y + 240, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 480, stashPosition.y + 240, 'CannonTower', 0);PlaceBuilding(stashPosition.x + 336, stashPosition.y + 528, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 240, stashPosition.y + 480, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -528, stashPosition.y + 336, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -480, stashPosition.y + 240, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -240, stashPosition.y + 384, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 240, stashPosition.y + 384, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + -384, stashPosition.y + -240, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + -528, stashPosition.y + -336, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -264, stashPosition.y + -552, 'Door', 0);PlaceBuilding(stashPosition.x + -552, stashPosition.y + -264, 'Door', 0);PlaceBuilding(stashPosition.x + 264, stashPosition.y + -552, 'Door', 0);PlaceBuilding(stashPosition.x + 552, stashPosition.y + -264, 'Door', 0);PlaceBuilding(stashPosition.x + 552, stashPosition.y + 264, 'Door', 0);PlaceBuilding(stashPosition.x + 264, stashPosition.y + 552, 'Door', 0);PlaceBuilding(stashPosition.x + -264, stashPosition.y + 552, 'Door', 0);PlaceBuilding(stashPosition.x + -552, stashPosition.y + 264, 'Door', 0);PlaceBuilding(stashPosition.x + -432, stashPosition.y + -432, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -432, stashPosition.y + -528, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -528, stashPosition.y + -432, 'CannonTower', 0);PlaceBuilding(stashPosition.x + 528, stashPosition.y + -432, 'CannonTower', 0);PlaceBuilding(stashPosition.x + 432, stashPosition.y + -432, 'CannonTower', 0);PlaceBuilding(stashPosition.x + 432, stashPosition.y + -528, 'CannonTower', 0);PlaceBuilding(stashPosition.x + 432, stashPosition.y + 432, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 528, stashPosition.y + 432, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 432, stashPosition.y + 528, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -384, stashPosition.y + 240, 'BombTower', 0);PlaceBuilding(stashPosition.x + -336, stashPosition.y + -336, 'BombTower', 0);PlaceBuilding(stashPosition.x + -432, stashPosition.y + -336, 'BombTower', 0);PlaceBuilding(stashPosition.x + 336, stashPosition.y + -336, 'BombTower', 0);PlaceBuilding(stashPosition.x + 432, stashPosition.y + -336, 'BombTower', 0);PlaceBuilding(stashPosition.x + 432, stashPosition.y + 336, 'BombTower', 0);PlaceBuilding(stashPosition.x + 336, stashPosition.y + 336, 'BombTower', 0);PlaceBuilding(stashPosition.x + 336, stashPosition.y + 432, 'BombTower', 0);PlaceBuilding(stashPosition.x + 144, stashPosition.y + 0, 'Harvester', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + -24, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + 24, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 336, stashPosition.y + -432, 'BombTower', 0);PlaceBuilding(stashPosition.x + -336, stashPosition.y + -432, 'BombTower', 0);PlaceBuilding(stashPosition.x + 432, stashPosition.y + 0, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -240, stashPosition.y + 480, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -336, stashPosition.y + 528, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -432, stashPosition.y + 528, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -432, stashPosition.y + 432, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -528, stashPosition.y + 432, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + -336, stashPosition.y + 336, 'BombTower', 0);PlaceBuilding(stashPosition.x + -432, stashPosition.y + 336, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -336, stashPosition.y + 432, 'BombTower', 0);PlaceBuilding(stashPosition.x + 504, stashPosition.y + -504, 'Door', 0);PlaceBuilding(stashPosition.x + -504, stashPosition.y + -504, 'Door', 0);PlaceBuilding(stashPosition.x + 504, stashPosition.y + 504, 'Door', 0);PlaceBuilding(stashPosition.x + -504, stashPosition.y + 504, 'Door', 0);PlaceBuilding(stashPosition.x + 312, stashPosition.y + 264, 'Wall', 0);PlaceBuilding(stashPosition.x + 312, stashPosition.y + 216, 'Wall', 0);PlaceBuilding(stashPosition.x + 264, stashPosition.y + 312, 'Wall', 0);PlaceBuilding(stashPosition.x + 216, stashPosition.y + 312, 'Wall', 0);PlaceBuilding(stashPosition.x + -264, stashPosition.y + 312, 'Wall', 0);PlaceBuilding(stashPosition.x + -216, stashPosition.y + 312, 'Wall', 0);PlaceBuilding(stashPosition.x + -312, stashPosition.y + 264, 'Wall', 0);PlaceBuilding(stashPosition.x + -312, stashPosition.y + 216, 'Wall', 0);PlaceBuilding(stashPosition.x + -312, stashPosition.y + -216, 'Wall', 0);PlaceBuilding(stashPosition.x + -312, stashPosition.y + -264, 'Wall', 0);PlaceBuilding(stashPosition.x + -264, stashPosition.y + -312, 'Wall', 0);PlaceBuilding(stashPosition.x + -216, stashPosition.y + -312, 'Wall', 0);PlaceBuilding(stashPosition.x + 216, stashPosition.y + -312, 'Wall', 0);PlaceBuilding(stashPosition.x + 264, stashPosition.y + -312, 'Wall', 0);PlaceBuilding(stashPosition.x + 312, stashPosition.y + -264, 'Wall', 0);PlaceBuilding(stashPosition.x + 312, stashPosition.y + -216, 'Wall', 0);PlaceBuilding(stashPosition.x + -360, stashPosition.y + -600, 'Wall', 0);PlaceBuilding(stashPosition.x + -408, stashPosition.y + -600, 'Wall', 0);PlaceBuilding(stashPosition.x + -456, stashPosition.y + -600, 'Wall', 0);PlaceBuilding(stashPosition.x + -600, stashPosition.y + -360, 'Wall', 0);PlaceBuilding(stashPosition.x + -600, stashPosition.y + -408, 'Wall', 0);PlaceBuilding(stashPosition.x + -600, stashPosition.y + -456, 'Wall', 0);PlaceBuilding(stashPosition.x + -552, stashPosition.y + -504, 'Door', 0);PlaceBuilding(stashPosition.x + -504, stashPosition.y + -552, 'Door', 0);PlaceBuilding(stashPosition.x + 360, stashPosition.y + -600, 'Wall', 0);PlaceBuilding(stashPosition.x + 408, stashPosition.y + -600, 'Wall', 0);PlaceBuilding(stashPosition.x + 456, stashPosition.y + -600, 'Wall', 0);PlaceBuilding(stashPosition.x + 504, stashPosition.y + -552, 'Door', 0);PlaceBuilding(stashPosition.x + 552, stashPosition.y + -504, 'Door', 0);PlaceBuilding(stashPosition.x + 600, stashPosition.y + -456, 'Wall', 0);PlaceBuilding(stashPosition.x + 600, stashPosition.y + -408, 'Wall', 0);PlaceBuilding(stashPosition.x + 600, stashPosition.y + -360, 'Wall', 0);PlaceBuilding(stashPosition.x + 600, stashPosition.y + 360, 'Wall', 0);PlaceBuilding(stashPosition.x + 600, stashPosition.y + 408, 'Wall', 0);PlaceBuilding(stashPosition.x + 600, stashPosition.y + 456, 'Wall', 0);PlaceBuilding(stashPosition.x + 552, stashPosition.y + 504, 'Door', 0);PlaceBuilding(stashPosition.x + 504, stashPosition.y + 552, 'Door', 0);PlaceBuilding(stashPosition.x + 456, stashPosition.y + 600, 'Wall', 0);PlaceBuilding(stashPosition.x + 408, stashPosition.y + 600, 'Wall', 0);PlaceBuilding(stashPosition.x + 360, stashPosition.y + 600, 'Wall', 0);PlaceBuilding(stashPosition.x + -360, stashPosition.y + 600, 'Wall', 0);PlaceBuilding(stashPosition.x + -408, stashPosition.y + 600, 'Wall', 0);PlaceBuilding(stashPosition.x + -456, stashPosition.y + 600, 'Wall', 0);PlaceBuilding(stashPosition.x + -504, stashPosition.y + 552, 'Door', 0);PlaceBuilding(stashPosition.x + -552, stashPosition.y + 504, 'Door', 0);PlaceBuilding(stashPosition.x + -600, stashPosition.y + 408, 'Wall', 0);PlaceBuilding(stashPosition.x + -600, stashPosition.y + 360, 'Wall', 0);PlaceBuilding(stashPosition.x + -600, stashPosition.y + 456, 'Wall', 0);
        }
    }, 150)
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
    }, 150)
}
var e = function(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}
var HELL = 1008;
var HELL2 = 17856;
Auto.BryanScoreBase = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
e(stashPosition.x + 8640-8640, stashPosition.y + 12048-12048, "GoldStash", 0)
e(stashPosition.x + 8640-8544, stashPosition.y + 12048-12048, "CannonTower", 0)
e(stashPosition.x + 8640-8448, stashPosition.y + 12048-11952, "CannonTower", 0)
e(stashPosition.x + 8640-8448, stashPosition.y + 12048-12144, "CannonTower", 0)
e(stashPosition.x + 8640-8736, stashPosition.y + 12048-12048, "CannonTower", 0)
e(stashPosition.x + 8640-8832, stashPosition.y + 12048-12144, "CannonTower", 0)
e(stashPosition.x + 8640-8832, stashPosition.y + 12048-11952, "CannonTower", 0)
e(stashPosition.x + 8640-8736, stashPosition.y + 12048-11952, "BombTower", 0)
e(stashPosition.x + 8640-8640, stashPosition.y + 12048-11952, "BombTower", 0)
e(stashPosition.x + 8640-8544, stashPosition.y + 12048-11952, "BombTower", 0)
e(stashPosition.x + 8640-8544, stashPosition.y + 12048-12144, "BombTower", 0)
e(stashPosition.x + 8640-8640, stashPosition.y + 12048-12144, "BombTower", 0)
e(stashPosition.x + 8640-8736, stashPosition.y + 12048-12144, "BombTower", 0)
e(stashPosition.x + 8640-8832, stashPosition.y + 12048-12048, "MagicTower", 0)
e(stashPosition.x + 8640-8832, stashPosition.y + 12048-12240, "MagicTower", 0)
e(stashPosition.x + 8640-8832, stashPosition.y + 12048-11856, "MagicTower", 0)
e(stashPosition.x + 8640-8448, stashPosition.y + 12048-11856, "MagicTower", 0)
e(stashPosition.x + 8640-8448, stashPosition.y + 12048-12048, "MagicTower", 0)
e(stashPosition.x + 8640-8448, stashPosition.y + 12048-12240, "MagicTower", 0)
e(stashPosition.x + 8640-8640, stashPosition.y + 12048-12240, "ArrowTower", 0)
e(stashPosition.x + 8640-8736, stashPosition.y + 12048-12240, "ArrowTower", 0)
e(stashPosition.x + 8640-8544, stashPosition.y + 12048-12240, "ArrowTower", 0)
e(stashPosition.x + 8640-8640, stashPosition.y + 12048-11856, "ArrowTower", 0)
e(stashPosition.x + 8640-8736, stashPosition.y + 12048-11856, "ArrowTower", 0)
e(stashPosition.x + 8640-8544, stashPosition.y + 12048-11856, "ArrowTower", 0)
e(stashPosition.x + 8640-8904, stashPosition.y + 12048-11832, "Door", 0)
e(stashPosition.x + 8640-8904, stashPosition.y + 12048-11880, "Door", 0)
e(stashPosition.x + 8640-8904, stashPosition.y + 12048-11928, "Door", 0)
e(stashPosition.x + 8640-8904, stashPosition.y + 12048-11976, "Door", 0)
e(stashPosition.x + 8640-8904, stashPosition.y + 12048-12024, "Door", 0)
e(stashPosition.x + 8640-8904, stashPosition.y + 12048-12072, "Door", 0)
e(stashPosition.x + 8640-8904, stashPosition.y + 12048-12120, "Door", 0)
e(stashPosition.x + 8640-8904, stashPosition.y + 12048-12168, "Door", 0)
e(stashPosition.x + 8640-8904, stashPosition.y + 12048-12216, "Door", 0)
e(stashPosition.x + 8640-8904, stashPosition.y + 12048-12264, "Door", 0)
e(stashPosition.x + 8640-8856, stashPosition.y + 12048-12312, "Door", 0)
e(stashPosition.x + 8640-8808, stashPosition.y + 12048-12312, "Door", 0)
e(stashPosition.x + 8640-8760, stashPosition.y + 12048-12312, "Door", 0)
e(stashPosition.x + 8640-8712, stashPosition.y + 12048-12312, "Door", 0)
e(stashPosition.x + 8640-8664, stashPosition.y + 12048-12312, "Door", 0)
e(stashPosition.x + 8640-8616, stashPosition.y + 12048-12312, "Door", 0)
e(stashPosition.x + 8640-8568, stashPosition.y + 12048-12312, "Door", 0)
e(stashPosition.x + 8640-8520, stashPosition.y + 12048-12312, "Door", 0)
e(stashPosition.x + 8640-8472, stashPosition.y + 12048-12312, "Door", 0)
e(stashPosition.x + 8640-8424, stashPosition.y + 12048-12312, "Door", 0)
e(stashPosition.x + 8640-8376, stashPosition.y + 12048-12264, "Door", 0)
e(stashPosition.x + 8640-8376, stashPosition.y + 12048-12216, "Door", 0)
e(stashPosition.x + 8640-8376, stashPosition.y + 12048-12168, "Door", 0)
e(stashPosition.x + 8640-8376, stashPosition.y + 12048-12120, "Door", 0)
e(stashPosition.x + 8640-8376, stashPosition.y + 12048-12072, "Door", 0)
e(stashPosition.x + 8640-8376, stashPosition.y + 12048-12024, "Door", 0)
e(stashPosition.x + 8640-8376, stashPosition.y + 12048-11976, "Door", 0)
e(stashPosition.x + 8640-8376, stashPosition.y + 12048-11928, "Door", 0)
e(stashPosition.x + 8640-8376, stashPosition.y + 12048-11880, "Door", 0)
e(stashPosition.x + 8640-8376, stashPosition.y + 12048-11832, "Door", 0)
e(stashPosition.x + 8640-8424, stashPosition.y + 12048-11784, "Door", 0)
e(stashPosition.x + 8640-8472, stashPosition.y + 12048-11784, "Door", 0)
e(stashPosition.x + 8640-8520, stashPosition.y + 12048-11784, "Door", 0)
e(stashPosition.x + 8640-8568, stashPosition.y + 12048-11784, "Door", 0)
e(stashPosition.x + 8640-8616, stashPosition.y + 12048-11784, "Door", 0)
e(stashPosition.x + 8640-8664, stashPosition.y + 12048-11784, "Door", 0)
e(stashPosition.x + 8640-8712, stashPosition.y + 12048-11784, "Door", 0)
e(stashPosition.x + 8640-8760, stashPosition.y + 12048-11784, "Door", 0)
e(stashPosition.x + 8640-8808, stashPosition.y + 12048-11784, "Door", 0)
e(stashPosition.x + 8640-8856, stashPosition.y + 12048-11784, "Door", 0)
e(stashPosition.x + 8640-8376, stashPosition.y + 12048-11784, "Wall", 0)
e(stashPosition.x + 8640-8376, stashPosition.y + 12048-11736, "Wall", 0)
e(stashPosition.x + 8640-8328, stashPosition.y + 12048-11784, "Wall", 0)
e(stashPosition.x + 8640-8328, stashPosition.y + 12048-11736, "Wall", 0)
e(stashPosition.x + 8640-8328, stashPosition.y + 12048-11832, "Wall", 0)
e(stashPosition.x + 8640-8328, stashPosition.y + 12048-11880, "Wall", 0)
e(stashPosition.x + 8640-8328, stashPosition.y + 12048-11928, "Wall", 0)
e(stashPosition.x + 8640-8328, stashPosition.y + 12048-11976, "Wall", 0)
e(stashPosition.x + 8640-8328, stashPosition.y + 12048-12024, "Wall", 0)
e(stashPosition.x + 8640-8328, stashPosition.y + 12048-12072, "Wall", 0)
e(stashPosition.x + 8640-8328, stashPosition.y + 12048-12120, "Wall", 0)
e(stashPosition.x + 8640-8328, stashPosition.y + 12048-12168, "Wall", 0)
e(stashPosition.x + 8640-8328, stashPosition.y + 12048-12216, "Wall", 0)
e(stashPosition.x + 8640-8328, stashPosition.y + 12048-12264, "Wall", 0)
e(stashPosition.x + 8640-8328, stashPosition.y + 12048-12312, "Wall", 0)
e(stashPosition.x + 8640-8328, stashPosition.y + 12048-12360, "Wall", 0)
e(stashPosition.x + 8640-8376, stashPosition.y + 12048-12360, "Wall", 0)
e(stashPosition.x + 8640-8376, stashPosition.y + 12048-12312, "Wall", 0)
e(stashPosition.x + 8640-8424, stashPosition.y + 12048-12360, "Wall", 0)
e(stashPosition.x + 8640-8472, stashPosition.y + 12048-12360, "Wall", 0)
e(stashPosition.x + 8640-8568, stashPosition.y + 12048-12360, "Wall", 0)
e(stashPosition.x + 8640-8616, stashPosition.y + 12048-12360, "Wall", 0)
e(stashPosition.x + 8640-8664, stashPosition.y + 12048-12360, "Wall", 0)
e(stashPosition.x + 8640-8712, stashPosition.y + 12048-12360, "Wall", 0)
e(stashPosition.x + 8640-8760, stashPosition.y + 12048-12360, "Wall", 0)
e(stashPosition.x + 8640-8808, stashPosition.y + 12048-12360, "Wall", 0)
e(stashPosition.x + 8640-8856, stashPosition.y + 12048-12360, "Wall", 0)
e(stashPosition.x + 8640-8520, stashPosition.y + 12048-12360, "Wall", 0)
e(stashPosition.x + 8640-8904, stashPosition.y + 12048-12360, "Wall", 0)
e(stashPosition.x + 8640-8952, stashPosition.y + 12048-12360, "Wall", 0)
e(stashPosition.x + 8640-8952, stashPosition.y + 12048-12312, "Wall", 0)
e(stashPosition.x + 8640-8904, stashPosition.y + 12048-12312, "Wall", 0)
e(stashPosition.x + 8640-8952, stashPosition.y + 12048-12264, "Wall", 0)
e(stashPosition.x + 8640-8952, stashPosition.y + 12048-12216, "Wall", 0)
e(stashPosition.x + 8640-8952, stashPosition.y + 12048-12168, "Wall", 0)
e(stashPosition.x + 8640-8952, stashPosition.y + 12048-12120, "Wall", 0)
e(stashPosition.x + 8640-8952, stashPosition.y + 12048-12072, "Wall", 0)
e(stashPosition.x + 8640-8952, stashPosition.y + 12048-12024, "Wall", 0)
e(stashPosition.x + 8640-8952, stashPosition.y + 12048-11976, "Wall", 0)
e(stashPosition.x + 8640-8952, stashPosition.y + 12048-11928, "Wall", 0)
e(stashPosition.x + 8640-8952, stashPosition.y + 12048-11736, "Wall", 0)
e(stashPosition.x + 8640-8952, stashPosition.y + 12048-11784, "Wall", 0)
e(stashPosition.x + 8640-8952, stashPosition.y + 12048-11832, "Wall", 0)
e(stashPosition.x + 8640-8952, stashPosition.y + 12048-11880, "Wall", 0)
e(stashPosition.x + 8640-8904, stashPosition.y + 12048-11736, "Wall", 0)
e(stashPosition.x + 8640-8904, stashPosition.y + 12048-11784, "Wall", 0)
e(stashPosition.x + 8640-8856, stashPosition.y + 12048-11736, "Wall", 0)
e(stashPosition.x + 8640-8808, stashPosition.y + 12048-11736, "Wall", 0)
e(stashPosition.x + 8640-8760, stashPosition.y + 12048-11736, "Wall", 0)
e(stashPosition.x + 8640-8712, stashPosition.y + 12048-11736, "Wall", 0)
e(stashPosition.x + 8640-8664, stashPosition.y + 12048-11736, "Wall", 0)
e(stashPosition.x + 8640-8616, stashPosition.y + 12048-11736, "Wall", 0)
e(stashPosition.x + 8640-8568, stashPosition.y + 12048-11736, "Wall", 0)
e(stashPosition.x + 8640-8520, stashPosition.y + 12048-11736, "Wall", 0)
e(stashPosition.x + 8640-8472, stashPosition.y + 12048-11736, "Wall", 0)
e(stashPosition.x + 8640-8424, stashPosition.y + 12048-11736, "Wall", 0)
e(stashPosition.x + 8640-8280, stashPosition.y + 12048-11688, "Wall", 0)
e(stashPosition.x + 8640-8328, stashPosition.y + 12048-11688, "Wall", 0)
e(stashPosition.x + 8640-8376, stashPosition.y + 12048-11688, "Wall", 0)
e(stashPosition.x + 8640-8424, stashPosition.y + 12048-11688, "Wall", 0)
e(stashPosition.x + 8640-8472, stashPosition.y + 12048-11688, "Wall", 0)
e(stashPosition.x + 8640-8520, stashPosition.y + 12048-11688, "Wall", 0)
e(stashPosition.x + 8640-8568, stashPosition.y + 12048-11688, "Wall", 0)
e(stashPosition.x + 8640-8616, stashPosition.y + 12048-11688, "Wall", 0)
e(stashPosition.x + 8640-8664, stashPosition.y + 12048-11688, "Wall", 0)
e(stashPosition.x + 8640-8712, stashPosition.y + 12048-11688, "Wall", 0)
e(stashPosition.x + 8640-8760, stashPosition.y + 12048-11688, "Wall", 0)
e(stashPosition.x + 8640-8808, stashPosition.y + 12048-11688, "Wall", 0)
e(stashPosition.x + 8640-8856, stashPosition.y + 12048-11688, "Wall", 0)
e(stashPosition.x + 8640-8904, stashPosition.y + 12048-11688, "Wall", 0)
e(stashPosition.x + 8640-8952, stashPosition.y + 12048-11688, "Wall", 0)
e(stashPosition.x + 8640-9000, stashPosition.y + 12048-11688, "Wall", 0)
e(stashPosition.x + 8640-9000, stashPosition.y + 12048-11736, "Wall", 0)
e(stashPosition.x + 8640-9000, stashPosition.y + 12048-11784, "Wall", 0)
e(stashPosition.x + 8640-9000, stashPosition.y + 12048-11832, "Wall", 0)
e(stashPosition.x + 8640-9000, stashPosition.y + 12048-11880, "Wall", 0)
e(stashPosition.x + 8640-9000, stashPosition.y + 12048-11928, "Wall", 0)
e(stashPosition.x + 8640-9000, stashPosition.y + 12048-11976, "Wall", 0)
e(stashPosition.x + 8640-9000, stashPosition.y + 12048-12024, "Wall", 0)
e(stashPosition.x + 8640-9000, stashPosition.y + 12048-12072, "Wall", 0)
e(stashPosition.x + 8640-9000, stashPosition.y + 12048-12120, "Wall", 0)
e(stashPosition.x + 8640-9000, stashPosition.y + 12048-12168, "Wall", 0)
e(stashPosition.x + 8640-9000, stashPosition.y + 12048-12216, "Wall", 0)
e(stashPosition.x + 8640-9000, stashPosition.y + 12048-12264, "Wall", 0)
e(stashPosition.x + 8640-9000, stashPosition.y + 12048-12360, "Wall", 0)
e(stashPosition.x + 8640-9000, stashPosition.y + 12048-12408, "Wall", 0)
e(stashPosition.x + 8640-9000, stashPosition.y + 12048-12312, "Wall", 0)
e(stashPosition.x + 8640-8952, stashPosition.y + 12048-12408, "Wall", 0)
e(stashPosition.x + 8640-8904, stashPosition.y + 12048-12408, "Wall", 0)
e(stashPosition.x + 8640-8856, stashPosition.y + 12048-12408, "Wall", 0)
e(stashPosition.x + 8640-8808, stashPosition.y + 12048-12408, "Wall", 0)
e(stashPosition.x + 8640-8760, stashPosition.y + 12048-12408, "Wall", 0)
e(stashPosition.x + 8640-8712, stashPosition.y + 12048-12408, "Wall", 0)
e(stashPosition.x + 8640-8664, stashPosition.y + 12048-12408, "Wall", 0)
e(stashPosition.x + 8640-8616, stashPosition.y + 12048-12408, "Wall", 0)
e(stashPosition.x + 8640-8568, stashPosition.y + 12048-12408, "Wall", 0)
e(stashPosition.x + 8640-8520, stashPosition.y + 12048-12408, "Wall", 0)
e(stashPosition.x + 8640-8472, stashPosition.y + 12048-12408, "Wall", 0)
e(stashPosition.x + 8640-8424, stashPosition.y + 12048-12408, "Wall", 0)
e(stashPosition.x + 8640-8376, stashPosition.y + 12048-12408, "Wall", 0)
e(stashPosition.x + 8640-8328, stashPosition.y + 12048-12408, "Wall", 0)
e(stashPosition.x + 8640-8280, stashPosition.y + 12048-12408, "Wall", 0)
e(stashPosition.x + 8640-8280, stashPosition.y + 12048-12360, "Wall", 0)
e(stashPosition.x + 8640-8280, stashPosition.y + 12048-12312, "Wall", 0)
e(stashPosition.x + 8640-8280, stashPosition.y + 12048-12216, "Wall", 0)
e(stashPosition.x + 8640-8280, stashPosition.y + 12048-12168, "Wall", 0)
e(stashPosition.x + 8640-8280, stashPosition.y + 12048-12264, "Wall", 0)
e(stashPosition.x + 8640-8280, stashPosition.y + 12048-12120, "Wall", 0)
e(stashPosition.x + 8640-8280, stashPosition.y + 12048-11976, "Wall", 0)
e(stashPosition.x + 8640-8280, stashPosition.y + 12048-11880, "Wall", 0)
e(stashPosition.x + 8640-8280, stashPosition.y + 12048-11832, "Wall", 0)
e(stashPosition.x + 8640-8280, stashPosition.y + 12048-11784, "Wall", 0)
e(stashPosition.x + 8640-8280, stashPosition.y + 12048-11736, "Wall", 0)
e(stashPosition.x + 8640-8280, stashPosition.y + 12048-11928, "Wall", 0)
e(stashPosition.x + 8640-8280, stashPosition.y + 12048-12024, "Wall", 0)
e(stashPosition.x + 8640-8280, stashPosition.y + 12048-12072, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 0, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 24, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 72, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 120, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 168, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 216, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 264, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 312, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 360, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -0, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 360, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 312, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 264, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 216, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 168, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 120, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 72, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 24, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 0, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -360, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -312, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -264, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -216, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -168, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -120, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -72, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -24, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -0, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -0, stashPosition.y + -408, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -0, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -72, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -24, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -120, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -168, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -216, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -264, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -312, "Wall", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -360, "Wall", 0)
        }
    }, 150)
}
Auto.dhrBase = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 0, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 0, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -96, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -96, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -192, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -192, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -288, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -192, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 0, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -288, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -288, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -384, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -288, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -384, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -96, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -96, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 0, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -192, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -288, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -384, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -384, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -384, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 0, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -96, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -192, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -288, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -384, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -480, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -576, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -480, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -480, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -480, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -480, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -480, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -576, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -576, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -576, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -576, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -576, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -576, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -480, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -384, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -288, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -192, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + 0, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + -96, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + -192, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + -288, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + -384, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + -480, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + -576, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 768, stashPosition.y + 0, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 768, stashPosition.y + -96, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 768, stashPosition.y + -192, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 768, stashPosition.y + -288, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 768, stashPosition.y + -384, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 768, stashPosition.y + -480, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 768, stashPosition.y + -576, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 864, stashPosition.y + 0, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 864, stashPosition.y + -96, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 864, stashPosition.y + -192, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 864, stashPosition.y + -288, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 864, stashPosition.y + -384, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 864, stashPosition.y + -480, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 864, stashPosition.y + -576, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -672, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -672, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -672, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + -672, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -672, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -672, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -672, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 768, stashPosition.y + -672, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -96, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 0, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + -768, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -768, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -768, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -864, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -864, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -792, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -744, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 792, stashPosition.y + -744, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -768, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -864, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -768, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -864, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -768, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -768, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -864, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -864, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -672, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -768, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -864, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 96, 'Harvester', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 96, 'Harvester', 0);EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 96, 'Harvester', 0);EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 0, 'Harvester', 0);EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, 'Harvester', 0);
           }
    },150)
}
Auto.dhrBase2 = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 0, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 0, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 0, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 96, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 0, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 96, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 96, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 192, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 192, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 288, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 96, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 192, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 288, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 240, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 336, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 384, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 432, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 384, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 432, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 0, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 96, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 96, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 192, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + 192, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 288, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 288, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 384, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 360, 'Wall', 0);EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 360, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 264, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 264, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 216, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 168, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 168, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 312, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 312, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 264, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 72, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 168, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 480, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 480, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 456, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 528, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 576, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 528, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 624, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 672, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 624, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 528, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 600, 'Wall', 0);EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 696, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 240, 'Harvester', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -96, 'Harvester', 0);EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, 'Harvester', 0);EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 0, 'Harvester', 0);EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 96, 'Harvester', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, 'Harvester', 0);
        }
    },150)
}
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
window.BRYSCRBSE = function () {
Auto.BryanScoreBase()
}
window.Turan0 = function () {
Auto.Turan0()
}
window.Turan0 = function () {
Auto.Tombul0()
}
window.deathrainbase = function () {
Auto.dhrBase()
}
window.bryanss = function () {
Auto.dhrBase2()
}
window.SSLQ = () => {
Auto.SSLQ1()
}

// DIV STYLE
var Style1 = document.querySelectorAll('.hud-map, .hud-resources, .hud-menu-shop, .hud-menu-party, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-party-link, .hud-party-members, .hud-party-grid, .hud-settings-grid, .hud-toolbar-item, .hud-toolbar-building, .hud-menu-icon, .hud-spell-icon, .hud-intro-form, .hud-intro-guide, .hud-intro-name, .hud-intro-server, .hud-party-tag, .hud-party-share, .hud-chat-input');
for (var i = 0; i < Style1.length; i++) {
  Style1[i].style.borderRadius = '1em'; // standard
  Style1[i].style.MozBorderRadius = '1em'; // Mozilla
  Style1[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style1[i].style.color = "#ffffff";
  Style1[i].style.border = "2px solid #080808";
}
// INPUT AND SELECT STYLE
var Style2 = document.querySelectorAll('select, input');
for (var i = 0; i < Style2.length; i++) {
  Style2[i].style.borderRadius = '1em'; // standard
  Style2[i].style.MozBorderRadius = '1em'; // Mozilla
  Style2[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style2[i].style.color = "#ffffff";
  Style2[i].style.border = "2px solid #00042e";
  Style2[i].style.backgroundColor = "#080808";
}