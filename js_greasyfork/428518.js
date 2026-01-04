// ==UserScript==
// @name         </> Apo & Java Oto Base Oto Sur
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ApoReisScripts
// @author       ApoReis
// @match        http://zombs.io/
// @match        http://yeni-tc-mod.glitch.me/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428518/%3C%3E%20Apo%20%20Java%20Oto%20Base%20Oto%20Sur.user.js
// @updateURL https://update.greasyfork.org/scripts/428518/%3C%3E%20Apo%20%20Java%20Oto%20Base%20Oto%20Sur.meta.js
// ==/UserScript==
//❗Hack %100 KS ye aittir çalan ermenidir❗\\
//❗Hack ou ve ks ler hariç hiçkimseyle paylaşılamaz❗\\
//ⓒ2017-2021 KS Team\\

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
background-image: url("https://cdn.discordapp.com/emojis/821847602516721765.png?v=1");
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
<h3>Oto Base</h3>
<button onclick="k();">Apex Base</button>
<button onclick="XBase();">X Base</button>
<button onclick="TB();">Z Base</button>
<button onclick="KS();">Eski KS Base</button>
<button onclick="Xhyper();">Xhyper Base</button>
<button onclick="Deathrain();">Deathrain Base</button>
<button onclick="OU2();">Oto Pet Base(W:712)</button>
<br><br>
<hr />
<h3>Oto Sur</h3>
<button onclick="OU3();">17x17 Wall Sur(W:280)</button>
<button onclick="OU1();">X AntiRaid W/D sur(W:224 S:80)</button>
<button onclick="OU();">Z AntiRaid W/D sur(W:308 S:210)</button>
<br><br>
<button onclick="Ou2();">17x17 Door sur(W/S:700)</button>
<button onclick="Ou1();">X AntiRaid Door sur(W/S:440)</button>
<button onclick="Ou();">Z AntiRaid Door sur(W/S:460)</button>
<br><br>
<h3>Yenilenen Oto Base & Oto Surlar</h3>
<input type="number" value="1000" class="F" placeholder="speed" style="width: 20%;">
<button class="Fe">Hızı Kaydet</button>
<button id="SSL5">AntiRaid Kapı Suru Etkinleştir</button>
<br><br>
<input type="number" value="2500" class="F0" placeholder="speed" style="width: 20%;">
<button class="Fe0">Hızı Kaydet</button>
  <button id="SSL0">Oto Pet Base Etkinleştir</button> &nbsp;
  `;



         function stopSSL8() {
  var trade = document.getElementById("SSL8");
  if (trade.innerHTML == "Altın Jeneratör Etkinleştir") {
    trade.innerHTML = "Altın Jeneratör Devre Dışı Bırak";
  } else {
    trade.innerHTML = "Altın Jeneratör Etkinleştir";
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
ou()
           }, f)
  }
}

         function stopSSL5() {
  var trade = document.getElementById("SSL5");
  if (trade.innerHTML == "AntiRaid Kapı Sur Etkinleştir") {
    trade.innerHTML = "AntiRaid Kapı Sur Devre Dışı Bırak";
  } else {
    trade.innerHTML = "AntiRaid Kapı Sur Etkinleştir";
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
ou2();
           }, f0)
  }
}

         function stopSSL0() {
  var trade = document.getElementById("SSL0");
  if (trade.innerHTML == "Oto Pet Base Etkinleştir") {
    trade.innerHTML = "Oto Pet Base Devre Dışı Bırak";
  } else {
    trade.innerHTML = "Oto Pet Base Etkinleştir";
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
EXTREME.Auto = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = EXTREME.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash);
EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -216, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -168, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 168, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 216, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 168, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -216, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -168, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 216, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -648, 'Door', 180);
        }
    }, 150)
}
EXTREME.Ouxantiraid = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = EXTREME.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash);
       EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 648, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 648, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 648, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 648, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 648, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 648, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 600, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 552, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 504, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 456, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 408, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 360, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 312, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 264, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 216, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 168, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 120, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 24, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -72, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -264, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -216, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -168, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -120, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -24, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -312, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -360, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -408, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -456, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -504, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -552, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -600, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -648, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -648, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -648, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -696, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -648, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -648, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -648, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -600, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -552, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -504, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -456, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -408, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -312, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -360, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -264, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -216, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -168, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -120, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -72, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -24, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 24, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 72, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 120, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 168, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 216, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 264, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 312, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 360, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 408, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 456, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 504, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 552, 'Door', 180);
       EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 600, 'Door', 180);

        }
    }, 150)
}
EXTREME.OUAntiRaidsurwd = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = EXTREME.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 264, 'Wall', 180);
        }
    }, 150)
}
Auto.Build17x17wall = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 792, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 744, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 696, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 648, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 600, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 552, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 504, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -504, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -552, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -600, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -648, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -696, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -744, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -792, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -792, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -744, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -696, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -648, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -600, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -552, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -504, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 504, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 552, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 600, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 648, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 696, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 744, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 792, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 840, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 840, 'Wall', 180);
        }
    }, 150)
}

Auto.OUZBASE = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -168, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -216, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -168, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -168, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 744, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 744, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 744, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 744, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 552, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 504, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 792, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 792, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 840, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 840, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 840, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 840, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 840, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 840, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 840, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 840, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 840, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 840, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 792, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 792, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 600, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 552, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 120, 'Wall', 180);
        }
    }, 150)
}
Auto.Buidotopetbase = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -456, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -408, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -360, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -312, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 24, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 72, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 120, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 168, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 216, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 264, 'Wall', 180);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 312, 'Wall', 180);
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
Auto.autopetbase = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 360, 'Wall', 180);
        }
    }, 150)
}
Auto.Build17x17door = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 792, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 744, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 216, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 168, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -168, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -216, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -744, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -792, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 792, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -792, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -744, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -216, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -168, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 168, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 216, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 744, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 792, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -648, 'Door', 180);
        }
    },150)
}
  Auto.DeathrainBase = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);
EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 144, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 96, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -96, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -192, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 192, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 96, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -96, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -144, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 192, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 240, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 288, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 240, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 336, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 432, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -192, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -288, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -336, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -432, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -120, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -72, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -72, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 72, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 120, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 72, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 72, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 336, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 384, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 480, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 48, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 240, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 336, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 432, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -624, stashPosition.y + 432, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 336, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 240, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 144, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 48, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 240, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 144, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 48, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 96, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 192, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 336, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 288, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 384, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 192, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 288, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 384, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 96, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 288, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 288, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 384, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 432, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 480, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 192, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 96, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 192, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 480, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 528, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -288, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -480, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -384, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -336, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -432, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -384, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -480, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -528, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -96, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -216, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -216, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -96, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -96, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -192, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -288, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -384, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -480, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -192, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -192, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -288, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -384, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -48, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -48, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -528, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -192, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -240, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -240, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -576, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -240, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -144, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -48, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -288, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -336, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -384, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -336, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -432, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -480, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -432, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -528, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 192, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 0, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 96, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 0, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -96, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 432, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 480, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -672, stashPosition.y + 336, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 504, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 552, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 600, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 288, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 576, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 600, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 600, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 408, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 456, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 456, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 552, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 600, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 600, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -240, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -336, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 24, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 528, stashPosition.y + -144, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -552, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -432, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -480, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -528, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -624, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -456, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -600, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -576, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -600, 'Wall', 180);
        }
        },150)
}
Auto.Ouzbaseantiraid = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 168, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 216, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 744, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 744, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 792, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 792, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 840, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 504, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 456, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 408, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 552, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 744, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 744, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 792, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 792, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 600, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 168, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 216, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -168, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 168, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -216, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -216, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -216, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -168, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -168, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -264, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -264, 'Door', 180);
        }
        },150)
}
  Auto.XhyperBase = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);
EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -48, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 48, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -192, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -192, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -48, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 48, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 192, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 192, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -288, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -288, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -288, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -288, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 288, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 288, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 144, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 240, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -144, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -240, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 384, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 432, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 384, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 432, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 336, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 384, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 336, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 384, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 480, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 528, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 576, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 480, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 528, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 576, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 576, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 576, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 144, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 240, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -144, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -240, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 240, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 144, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 48, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -48, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -144, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -240, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -336, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -240, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -336, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -384, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -432, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -384, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -432, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -384, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -384, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -480, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -480, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -480, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -528, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -576, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -480, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -528, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -576, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 336, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 240, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 144, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 528, stashPosition.y + -240, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -144, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -336, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -48, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 48, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -240, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -336, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 192, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -192, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -240, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -192, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -240, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 144, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 240, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 240, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 336, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 384, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 384, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 288, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 288, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 480, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 480, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 480, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 480, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -576, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -576, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -480, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -480, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 696, 'Wall', 180);
        }
        },150)
}
  Auto.KSBase = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);
EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -48, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 48, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 192, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 192, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -192, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -192, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -48, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 48, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -288, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -384, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -384, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -288, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -288, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -384, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -480, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -480, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -432, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -384, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -432, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -384, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -480, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -480, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -528, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -576, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -576, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -576, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -576, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -528, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -480, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 144, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 384, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 144, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 144, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 240, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 240, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 336, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -144, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -240, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -240, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -48, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 48, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -240, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -240, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 240, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 240, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 336, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 336, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -336, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 480, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 480, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 480, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 432, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 528, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 480, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 528, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 480, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -336, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 528, stashPosition.y + -240, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -144, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 48, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 336, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 192, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 192, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -360, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -312, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 24, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 648, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -168, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 384, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 384, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 288, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 288, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 240, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -48, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 48, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -144, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -240, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 576, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 576, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 576, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 384, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 432, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 480, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 576, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -288, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 144, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 240, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 288, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 288, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -72, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -120, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -384, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -480, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -696, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -48, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -192, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -192, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -120, 'Door', 180);
        }
        },150)
}
Auto.ultkbase = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);
EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 96, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 192, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -96, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -192, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 96, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 96, 'GoldMine', 180);
EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 0, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -96, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 96, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 0, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -288, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -288, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -288, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -384, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -480, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -480, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -384, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -288, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -384, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -480, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -432, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -384, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -480, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -528, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -576, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -576, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -576, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -576, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -528, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -480, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -384, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -432, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -480, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -384, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 288, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 288, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 288, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 288, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 384, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 480, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 480, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 480, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 576, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 576, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 576, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 384, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 384, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 384, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 480, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 432, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 576, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 528, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 480, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 528, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 480, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 432, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -144, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 144, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 48, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 240, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 240, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 336, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 336, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 240, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -48, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 144, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 48, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -240, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -240, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -144, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -144, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 528, stashPosition.y + -240, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -336, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 144, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 48, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -48, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -144, 'ArrowTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -48, 'BombTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 48, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 240, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 240, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 336, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 336, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 240, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 144, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -48, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -144, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -240, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -240, 'CannonTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -144, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -240, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -336, 'MagicTower', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 600, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 600, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 552, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 552, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 600, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 600, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 552, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 552, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 168, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -168, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -552, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -552, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -600, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -600, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -552, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -552, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -600, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -600, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -648, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -696, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 264, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 312, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 360, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 168, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -168, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -24, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -120, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 72, 'Door', 180);
EXTREME.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -216, 'Wall', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 336, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 336, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -336, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -336, 'Harvester', 180);
EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -168, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -168, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -168, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -168, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -216, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -168, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -24, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -72, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -120, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -168, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -216, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -216, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 216, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 168, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 168, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 168, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 168, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 168, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 216, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 216, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 168, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 120, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 72, 'SlowTrap', 180);
EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 24, 'SlowTrap', 180);
        }
    },150)
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
window.OU3 = function() {
  Auto.Build17x17wall()
}
window.OU2 = function() {
  Auto.Buidotopetbase()
}
window.ou = function() {
  EXTREME.Auto()
}
window.OU1 = function () {
EXTREME.OUAntiRaidsurwd()
}
window.Ou1 = function () {
EXTREME.Ouxantiraid()
}
window.XBase = function () {
EXTREME.BuildXBase()
}
window.ou2 = function () {
Auto.autopetbase()
}
window.Ou2 = function () {
Auto.Build17x17door()
}
window.Ou = function () {
Auto.Ouzbaseantiraid()
}
window.OU = () => {
Auto.OUZBASE()
}
window.k = () => {
Auto.ultkbase()
}
window.TB = function() {
  Auto.BuildThingBase()
}
window.KS = function() {
  Auto.KSBase()
}
window.Xhyper = function() {
  Auto.XhyperBase()
}
window.Deathrain = function() {
  Auto.DeathrainBase()
}