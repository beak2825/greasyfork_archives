// ==UserScript==
// @name         </> Kurt & Java Üs Kaydedici, Altın Jeneratör Ve Değer Verici
// @namespace    http://tampermonkey.net/
// @version      22.2
// @description  Kurt & Java
// @author       Kurt
// @match        http://zombs.io/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/424152/%3C%3E%20Kurt%20%20Java%20%C3%9Cs%20Kaydedici%2C%20Alt%C4%B1n%20Jenerat%C3%B6r%20Ve%20De%C4%9Fer%20Verici.user.js
// @updateURL https://update.greasyfork.org/scripts/424152/%3C%3E%20Kurt%20%20Java%20%C3%9Cs%20Kaydedici%2C%20Alt%C4%B1n%20Jenerat%C3%B6r%20Ve%20De%C4%9Fer%20Verici.meta.js
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
.hud-menu-zipp16 {
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
.hud-menu-zipp16 h3 {
display: block;
margin: 0;
line-height: 20px;
}
.hud-menu-zipp16 .hud-zipp-grid16 {
display: block;
height: 380px;
padding: 10px;
margin-top: 18px;
background: rgba(0, 0, 0, 0.2);
}
.hud-spell-icons .hud-spell-icon[data-type="Zippity16"]::before {
background-image: url("https://cdn.discordapp.com/emojis/819841412009820170.png?v=1");
}
.hud-menu-zipp16 .hud-the-tab {
position: relative;
height: 40px;
line-height: 40px;
margin: 20px;
border: 0px solid rgb(0, 0, 0, 0);
}
.hud-menu-zipp16 .hud-the-tab {
display: block;
float: left;
padding: 0 14px;
margin: 0 1px 0 0;
font-size: 14px;
background: rgba(0, 0, 0, 0.4);
color: rgba(255, 255, 255, 0.4);
transition: all 0.15s ease-in-out;
}
.hud-menu-zipp16 .hud-the-tab:hover {
background: rgba(0, 0, 0, 0.2);
color: #eee;
cursor: pointer;
}
`;

let styles = document.createElement("style");
styles.appendChild(document.createTextNode(css2));
document.head.appendChild(styles);

document.getElementsByClassName("hud-intro-form")[0].style.height = "300px";
document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-blue hud-intro-play");

let spell = document.createElement("div");
spell.classList.add("hud-spell-icon");
spell.setAttribute("data-type", "Zippity16");
spell.classList.add("hud-zipp16-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);

let modHTML = `
<div class="hud-menu-zipp16">
<br />
<div class="hud-zipp-grid16">
</div>
</div>
`;
document.body.insertAdjacentHTML("afterbegin", modHTML);
let zipz123 = document.getElementsByClassName("hud-menu-zipp16")[0];

document.getElementsByClassName("hud-zipp16-icon")[0].addEventListener("click", function() {
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

  document.getElementsByClassName("hud-zipp-grid16")[0].innerHTML = `
<div style="text-align:center"><br>
<hr />
<h3>• Kurt Java Üs Kaydedici Ve Altın Jeneratör<br>
<hr />
<button onclick="RecordBase();">Kayıt Oluştur</button>
<button onclick="buildRecordedBase();">Kayıt Kur</button>
<button onclick="DeleteRecordedbase();">Kayıt Sil</button>
<br><br>
<button onclick="saveBase();">Üs Kayıt</button>
<button onclick="saveTowers();">Silah Denetim</button>
<br><br>
<input type="number" value="275" class="SaveSpeed" placeholder="speed" style="width: 20%">
<button class="SaveSpeedbtn">Hız</button>
<button id="SSL31">Üs Kurucu &</button>
<br>
<input type="number" value="275" class="SaveSpeed2" placeholder="speed" style="width: 20%">
<button class="SaveSpeedbtn2">Hız</button>
<button id="SSL32">Yükselt &</button>
<button id="SSL33">Kaldır &</button>
<hr />
<h3>• Kurt Java Değer Arttırıcı<br>
<hr />
<input type="number" value="500" class="SaveSpeed3" placeholder="speed" style="width: 20%">
<button class="SaveSpeedbtn3">Değer</button>
<br><br>
<button id="boz1">Büyücü Arttır &</button>
<button id="boz5">Okcu Arttır &</button>
<button id="boz6">Bombacı Arttır &</button>
<button id="boz7">Topçu Arttır &</button>
<br>
<button id="boz2">Duvar Arttır &</button>
<button id="boz3">Kapı Arttır &</button>
<button id="boz4">Tuzak Arttır &</button>
<button id="boz8">Toplayıcı Arttır &</button>
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
  if (trade.innerHTML == "Üs Kurucu (+)") {
    trade.innerHTML = "Üs Kurucu (-)";
  } else {
    trade.innerHTML = "Üs Kurucu (+)";
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
  if (trade.innerHTML == "Kaldır (+)") {
    trade.innerHTML = "Kaldır (-)";
  } else {
    trade.innerHTML = "Kaldır (+)";
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
  if (trade.innerHTML == "Yükselt (+)") {
    trade.innerHTML = "Yükselt (-)";
  } else {
    trade.innerHTML = "Yükselt (+)";
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
        }
    }, 0)
}

window.saveTowers = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
           var stash = GetGoldStash();
            if (stash == undefined) return
           var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
for (let s of slowTraps) placeBuilding(s.x, s.y, s.type, 0);
        }
    }, 150)
}
window.saveTowers2 = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
           var stash = GetGoldStash();
            if (stash == undefined) return
           var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
for (let s2 of GoldStashh) placeBuilding(s2.x, s2.y, s2.type, 0);
        }
    }, 150)
}

window.SellStash = function() {
   //   Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Üs Satmak İstediğinizden Emin misiniz?", 1e4, function() {
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
     // Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Hepsini Satmak İstediğinizden Emin misiniz?", 1e4, function() {
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
Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Üssü Kaydetmek İstediğinizden Emin misiniz? Eğer 2 Kez Kaydederseniz, İlk Kaydedilen Baz Kayıt Edilmeyecektir.", 1e4, function() {
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
        base += "PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + Game.currentGame.world.entities[obj.uid].fromTick.model + "', " + Game.currentGame.world.entities[obj.uid].fromTick.yaw + ");"
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
Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Kayıtlı Üssü Silmek İstediğinizden Emin misiniz?", 1e4, function() {
    if (localStorage.getItem(mybasename)) {
        localStorage.removeItem(mybasename)
    }
})
}

var css = '.hud-zipp-grid16 { background: url(\'http://www.yenislayt.com/upload/9081659655.jpg\') }';
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));

var Style1 = document.querySelectorAll('.hud-map, .hud-resources, .hud-menu-shop, .hud-menu-party, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-party-link, .hud-party-members, .hud-party-grid, .hud-settings-grid, .hud-toolbar-item, .hud-toolbar-building, .hud-menu-icon, .hud-spell-icon, .hud-intro-form, .hud-intro-guide, .hud-intro-name, .hud-intro-server, .hud-party-tag, .hud-party-share, .hud-chat-input');
for (var i = 0; i < Style1.length; i++) {
  Style1[i].style.borderRadius = '1em'; // standard
  Style1[i].style.MozBorderRadius = '1em'; // Mozilla
  Style1[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style1[i].style.color = "#ffffff";
  Style1[i].style.border = "2px solid #080808";
}
var Style2 = document.querySelectorAll('select, input');
for (var i = 0; i < Style2.length; i++) {
  Style2[i].style.borderRadius = '1em'; // standard
  Style2[i].style.MozBorderRadius = '1em'; // Mozilla
  Style2[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style2[i].style.color = "#ffffff";
  Style2[i].style.border = "2px solid #00042e";
  Style2[i].style.backgroundColor = "#080808";
}
document.getElementsByClassName("boz1")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "MagicTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                gold:"500000",
                wood: "500000",
                stone: "500000",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})
    document.getElementsByClassName("boz2")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "Wall") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                gold:"500000",
                wood: "500000",
                stone: "500000",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("boz3")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "Door") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                gold:"500000",
                wood: "500000",
                stone: "500000",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("boz4")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "SlowTrap") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                gold:"500000",
                wood: "500000",
                stone: "500000",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("boz5")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "ArrowTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                gold:"500000",
                wood: "500000",
                stone: "500000",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})


document.getElementsByClassName("boz6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "BombTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                gold:"500000",
                wood: "500000",
                stone: "500000",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})
    document.getElementsByClassName("boz7")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "CannonTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                gold:"500000",
                wood: "500000",
                stone: "500000",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})
        document.getElementsByClassName("boz8")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "Harvester") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                gold:"500000",
                wood: "500000",
                stone: "500000",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})