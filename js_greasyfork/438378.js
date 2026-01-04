// ==UserScript==
// @name         SC!VENOM's Hack
// @namespace    Join Discord https://discord.gg/C2X66pv55N
// @version      1
// @description  Join our discord server https://discord.gg/C2X66pv55N go to gear button to get options
// @author       SC!VENOM
// @match        http://zombs.io/
// @icon         http://clipart-library.com/img1/1308508.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438378/SC%21VENOM%27s%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/438378/SC%21VENOM%27s%20Hack.meta.js
// ==/UserScript==
// ==section list==
document.getElementsByClassName("hud-top-center")[0].innerHTML = `
<button class="btn-purple" style="border-radius: 0em; color: rgb(0, 0, 0); border: 2px solid rgb(8, 8, 8);" onclick='Game.currentGame.network.sendRpc({name: "BuyItem", itemName: "Pickaxe", tier: ws.inventory.Pickaxe.tier+1});'><img src="http://zombs.io/asset/image/ui/inventory/inventory-pickaxe-t7.svg"</button>
<button class="btn-purple" style="border-radius: 0em; color: rgb(0, 0, 0); border: 2px solid rgb(8, 8, 8);" onclick='Game.currentGame.network.sendRpc({name: "BuyItem", itemName: "Spear", tier: Game.currentGame.ui.inventory.Spear.tier+1});'><img src="http://zombs.io/asset/image/ui/inventory/inventory-spear-t7.svg"</button>
<button class="btn-purple" style="border-radius: 0em; color: rgb(0, 0, 0); border: 2px solid rgb(8, 8, 8);" onclick='Game.currentGame.network.sendRpc({name: "BuyItem", itemName: "Bow", tier: Game.currentGame.ui.inventory.Bow.tier+1});'><img src="http://zombs.io/asset/image/ui/inventory/inventory-bow-t7.svg"</button>
<button class="btn-purple" style="border-radius: 0em; color: rgb(0, 0, 0); border: 2px solid rgb(8, 8, 8);" onclick='Game.currentGame.network.sendRpc({name: "BuyItem", itemName: "Bomb", tier: Game.currentGame.ui.inventory.Bomb.tier+1});'><img src="http://zombs.io/asset/image/ui/inventory/inventory-bomb-t7.svg"</button>
<button class="btn-purple" style="border-radius: 0em; color: rgb(0, 0, 0); border: 2px solid rgb(8, 8, 8);" onclick='Game.currentGame.network.sendRpc({name: "BuyItem", itemName: "ZombieShield", tier: Game.currentGame.ui.inventory.ZombieShield.tier+1});'><img src="http://zombs.io/asset/image/ui/inventory/inventory-shield-t7.svg"</button>
<button class="btn-purple" style="border-radius: 0em; color: rgb(0, 0, 0); border: 2px solid rgb(8, 8, 8);" onclick='Game.currentGame.network.sendRpc({name: "BuyItem", itemName: "PetCARL", tier: Game.currentGame.ui.inventory.ZombieShield.tier+1});'><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-carl-t8.svg"</button>
<button class="btn-purple" style="border-radius: 0em; color: rgb(0, 0, 0); border: 2px solid rgb(8, 8, 8);" onclick='Game.currentGame.network.sendRpc({name: "BuyItem", itemName: "PetMiner", tier: Game.currentGame.ui.inventory.ZombieShield.tier+1});'><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-miner-t8.svg"</button>
`
//Main CSS
document.getElementsByClassName("hud-intro-form")[0].style.height = "300px";
document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-purple hud-intro-play");
document.querySelectorAll('.ad-unit,.hud-intro-stone, .hud-intro-tree, .hud-intro-corner-bottom-left, .hud-intro-corner-bottom-right').forEach(el => el.remove());
document.getElementsByClassName("hud-intro-left")[0].innerHTML = `
<center><h3>your PERSONAL BEST</h3>
<h3>• WAVE •</h3>
<button class="btn btn-purple" style="width: 80%;" onclick="nothing();"> 1 - </button>
<button class="btn btn-purple" style="width: 80%;" onclick="nothing();"> 2 - </button>
<button class="btn btn-purple" style="width: 80%;" onclick="nothing();"> 3 - </button>
<h3>• SCORE •</h3>
<button class="btn btn-purple" style="width: 80%;" onclick="nothing();"> 1 - </button>
<button class="btn btn-purple" style="width: 80%;" onclick="nothing();"> 2 - </button>
<button class="btn btn-purple" style="width: 80%;" onclick="nothing();"> 3 - </button>
`;
(function() {
    'use strict';
         document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[1].innerHTML = `<br style="height:20px;" /><Custom><b><font size="36">WELCOME BACK name</font></b></Custom>`;
            var css = '.hud-intro::before{background: url(\'https://cdn.discordapp.com/attachments/843462086147047467/888977164488278107/61581c49c524ab9b97476ad6271da897db942c1b_hq.gif\');background-size:cover; z-index: 0; .hud-menu-icons .hud-menu-icon::before{filter: drop-shadow(2px 2px 0px #1d8dee) drop-shadow(-2px 2px 0px #1d8dee) drop-shadow(2px -2px 0px #1d8dee) drop-shadow(-2px -2px 0px #1d8dee)} .hud-intro-main{padding-left: 110px} .hud-debug{color: black !important; text-shadow: 0px 0px 5px #fff} .hud-intro-footer{color: #fff !important; font-size: 20px !important} .hud-intro-footer a {color:#fff !important} .hud-intro h2{font-size: 20px !important; color:rgb(25 45 59) !important} .hud-intro h1{text-shadow: 0px 0px 5px #fff; font-size: 50px !important} .hud-intro h1 small::after{content: " "} .hud-intro h1 small {color: rgb(104 179 237) !important; text-shadow: 4px 4px rgb(25 44 56) } .hud-intro-corner-top-left{color: #eee} .ad-unit-medrec-respawn{display: none !important} .hud-settings-grid{margin:0 !important} .hud-menu-shop h3{font-size: 23px !important; text-shadow: 1px 1px 15px #fff } .hud-menu-party h3{text-shadow: 1px 1px 15px #fff } .hud-menu-settings h3{text-shadow: 1px 1px 15px #fff}  .hud-menu-shop .hud-shop-grid .hud-shop-item strong{text-shadow: 1px 1px 15px #fff} .hud-shop-grid{width: 880px} .ad-unit-medrec-shop{display:none} .hud-menu{background: url(\'https://cdnb.artstation.com/p/assets/images/images/005/778/331/original/herimamitiana-randriamasinoro-starfall-by-rkuma-dazyigr.gif?1493712254\'); opacity:0.85; background-size: cover} .ad-unit-leaderboard{display: none !important}  .hud-respawn-corner-bottom-left{display: none !important} ::-webkit-scrollbar {width: 10px} ::-webkit-scrollbar-thumb {background-image: linear-gradient(to bottom, #5239d0, #3e4dd8, #285ddd, #0f6bdf, #0078e0, #0087e5, #0095e8, #00a2ea, #00b5ec, #00c5df, #00d3c6, #0edda4); box-shadow: 0px 0px 3px #fff; border-radius: 20px;} .hud-intro .hud-intro-guide{width: 400px !important; padding: 0px !important} #myKey {border-radius: 20px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) } .btn-green{ background-color:#1d8dee !important};';
            var style = document.createElement('style');
            style.appendChild(document.createTextNode(css));

            const entirePop = document.getElementsByClassName("hud-intro-wrapper")[0].children[1];
            const request = new XMLHttpRequest();
            request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
                    let data = JSON.parse(request.responseText);
                    entirePop.innerHTML = `CURRENT NUMBER OF PEOPLE: ${data.players} / ${(data.players / data.capacity * 100).toFixed(2)}%`;
                    let servers = ["US East", "US West", "Europe", "Asia", "Australia", "South America"];
                    for (let i in servers) {
            game.ui.components.Intro.serverElem.children[i].setAttribute("label", `${servers[i]}: Population: ${data.regions[servers[i]].players}`);
        }
    }
            };
            request.open("GET", "http://zombs.io/capacity", true);
            request.send();

            document.head.appendChild(style);
            })();


// REMOVE ADS
document.querySelectorAll('.ad-unit').forEach(function(a) {
 a.remove();
  });

// NEW DIV IN PARTY TAB
function partydiv() {
  var newNode = document.createElement('div');
  newNode.className = 'tagzspam';
  newNode.style = 'text-align:center';
  document.getElementsByClassName('hud-party-actions')[0].appendChild(newNode);
  }

partydiv();

// DIV STYLE
var Style1 = document.querySelectorAll('.hud-map, .hud-resources, .hud-menu-shop, .hud-menu-party, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-party-link, .hud-party-members, .hud-party-grid, .hud-settings-grid, .hud-toolbar-item, .hud-toolbar-building, .hud-menu-icon, .hud-spell-icon, .hud-intro-form, .hud-intro-guide, .hud-intro-name, .hud-intro-server, .hud-party-tag, .hud-party-share, .hud-chat-input');
for (var i = 0; i < Style1.length; i++) {
Style1[i].style.borderRadius = '1em'; // standard
Style1[i].style.MozBorderRadius = '1em'; // Mozilla
Style1[i].style.WebkitBorderRadius = '1em'; // WebKitww
Style1[i].style.color = "	#800080";
Style1[i].style.border = "2px solid 	#800080";
}
// INPUT AND SELECT STYLE
var Style2 = document.querySelectorAll('select, input');
for (var i = 0; i < Style2.length; i++) {
Style2[i].style.borderRadius = '1em'; // standard
Style2[i].style.MozBorderRadius = '1em'; // Mozilla
Style2[i].style.WebkitBorderRadius = '1em'; // WebKitww
Style2[i].style.color = "#7e00fc";
Style2[i].style.border = "2px solid #400080";
Style2[i].style.backgroundColor = "#400080";
}
const settingsHTML = `<div style="text-align:center"><br>
<hr />
<h3>• Advanced Settings •</h3>
<hr />
<h3>• SELL OPTIONS •</h3>
<hr />
<button class="btn btn-purple" style="width: 30%;" onclick="SellAll();"> Sell Base Items </button>
<button class="btn btn-purple" style="width: 30%;" onclick="sellWalls();"> Sell Walls </button>
<button class="btn btn-purple" style="width: 30%;" onclick="sellDoors();"> Sell Doors </button>
<button class="btn btn-purple" style="width: 30%;" onclick="sellTraps();"> Sell Traps </button>
<button class="btn btn-purple" style="width: 30%;" onclick="sellpets();"> Sell Pet </button>
<button class="btn btn-purple" style="width: 30%;" onclick="sellArrows();"> Sell Arrows </button>
<button class="btn btn-purple" style="width: 30%;" onclick="sellBombs();"> Sell Bombs </button>
<button class="btn btn-purple" style="width: 30%;" onclick="sellMages();"> Sell Mages </button>
<button class="btn btn-purple" style="width: 30%;" onclick="sellCannons();"> Sell Cannons </button>
<button class="btn btn-purple" style="width: 30%;" onclick="sellHarvesters();"> Sell Harvesters </button>
<button class="btn btn-purple" style="width: 30%;" onclick="sellMelees);"> Sell Melees </button>
<button class="btn btn-purple" style="width: 30%;" onclick="sellGoldMines();"> Sell Gold Mines </button>
<hr />
<h3>• AUTO OPTIONS•</h3>
<hr />
<button id="UPP" class="btn btn-purple" style="width: 45%;"> Auto Upgrade Off</button>
<button id="AHRC" class="btn btn-purple" style="width: 45%;"> Enable Auto Farm Off</button>
<button id="bow" class="btn btn-purple" style="width: 45%;"> Auto Bow Off</button>
<button id="SSL" class="btn btn-purple" style="width: 45%;"> Auto Accept Party Request Off</button>
<hr />
<h3>• SHARE KEY AND LEAVE PARTY •</h3>
<hr />
<input class="btn btn-purple" type="text" maxlength="20" placeholder="Party Key" id="myKey">
<button class="btn btn-purple" style="width: 45%;" onclick="join();">Join</button>
<br><br>
<button class="btn btn-purple" style="width: 45%;" onclick="leave();">Leave Party</button>
<hr />
<h3>• AUTO BASE BUILDER •</h3>
<hr />
<button class="btn btn-purple" style="width: 45%;" onclick="ARTY1();"> ARTEMIS X BASE 1</button>
<button class="btn btn-purple" style="width: 45%;" onclick="MB();"> 15K WAVE RECORD BASE</button>
<button class="btn btn-purple" style="width: 45%;" onclick="XBase();">BRYAN SMITH X BASE</button>
<button class="btn btn-purple" style="width: 45%;" onclick="SmallCornerBase();">SIRR0MS X BASE</button>
<button class="btn btn-purple" style="width: 45%;" onclick="th();">ARTEMIS X BASE 2</button>
<hr />
<center><h2>Chat filter</h2><hr/>\n<button class="btn btn-purple" style="width: 99%;" id="chatFilter" filter="all">All</button>\n<input type="text" class="btn" id="nameToBlock" style="width: 99%; margin-top: 1%;" maxlength=35 placeholder="Name of person you want to block/unblock"></input>\n<button class="btn btn-purple" id="blockName" style="width: 45%; margin-top: 1%;">Block</button><button class="btn btn-purple" id="unblockName" style="margin-top: 1%; margin-left: 1%; width: 45%;">Unblock</button>\n<button class="btn btn-purple" id="showBlocked" style="width:99%; margin-top: 1%;">Show Blocked Names</button></center>\n<div style="margin-top: 1%;" id="blockNamesList"></div>
<hr />
<h3>• TOOLS •</h3>
<hr />
<button class="btn btn-purple" style="width: 45%;" id="clearchatbtn">Clear Chat</button>
<button  id=\"opt\" class=\"btn btn-purple\" style=\"width: 45%;\">OPEN NEW PARTY TAB</button>
<button id=\"lbb\" class=\"btn btn-purple\" style=\"width: 45%;\">HIDE LEADERBORED</button>
<button id=\"lbh\" class=\"btn btn-purple\" style=\"width: 45%;\">HIDE LEFT BOTTOM</button>
<button id=\"rbh\" class=\"btn btn-purple\" style=\"width: 45%;\">HIDE RIGHT BOTTOM</button>
            `;
            // STYLE CODES
function stylecodes() {
  var ael = document.querySelectorAll('input');
   for (var i2 = 0; i2 < ael.length; i2++) {
       ael[i2].addEventListener("keydown", keyDown, false);
}
document.getElementById('hud-menu-party').style.width = "610px";
document.getElementById('hud-menu-party').style.height = "550px";
document.getElementsByClassName('hud-intro-form')[0].style.width = "325px";
document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 49);
document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);
document.getElementsByClassName("hud-intro-corner-bottom-right")[0].remove();
document.getElementsByClassName("hud-intro-corner-bottom-left")[0].remove();
document.getElementsByClassName("hud-day-night-overlay")[0].remove();
document.getElementsByClassName("hud-party-joining")[0].remove();
document.getElementsByClassName("hud-respawn-share")[0].remove();
document.getElementsByClassName("hud-intro-footer")[0].remove();
document.getElementsByClassName("hud-intro-left")[0].remove();
document.getElementsByClassName("hud-intro-guide")[0].setAttribute("style", "width: 280px; height: 300px;");
document.getElementsByClassName("hud-intro-form")[0].setAttribute("style", "width: 280px; height: 300px;");
document.getElementsByClassName("hud-intro-footer")[0].setAttribute("style", "background-color: rgb(0, 0, 0, 0.4);");
document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-greennn");
document.getElementsByClassName("hud-intro-name")[0].setAttribute("class", "btn btn-blueee");
document.getElementsByClassName("hud-intro-server")[0].setAttribute("class", "btn btn-blueee")
}


// INTRO STYLE CODES INNERHTML
var IntroGuide = '';
IntroGuide += "<hr />"
IntroGuide += "<center><h3>NAME LIST</h3>";
IntroGuide += "<hr />"
IntroGuide += "<center><h3>your NAMES</h3>";
IntroGuide += "<button class=\"btn btn-purple\" style=\"width: 100%;\" onclick=\"name1();\"> </button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-purple\" style=\"width: 100%;\" onclick=\"name2();\"> </button>";
IntroGuide += "<br><br>";
IntroGuide += "<hr />"
IntroGuide += "<center><h3>CLAN NAME</h3>";
IntroGuide += "<button class=\"btn btn-purple\" style=\"width: 100%;\" onclick=\"name3();\"> </button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-purple\" style=\"width: 100%;\" onclick=\"name4();\"> </button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-purple\" style=\"width: 100%;\" onclick=\"name5();\"> </button>";
IntroGuide += "<br><br>";
IntroGuide += "<hr />"
IntroGuide += "<center><h3>PRIVATE NAMES</h3>";
IntroGuide += "<button class=\"btn btn-purple\" style=\"width: 100%;\" onclick=\"name6();\"> </button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-purple\" style=\"width: 100%;\" onclick=\"name7();\"> </button>";
IntroGuide += "<br><br>";
IntroGuide += "<hr />"
IntroGuide += "<center><h3>CUSTOM NAMES</h3>";
IntroGuide += "<button class=\"btn btn-purple\" style=\"width: 100%;\" onclick=\"name8();\"> </button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-purple\" style=\"width: 100%;\" onclick=\"name9();\"> </button>";
IntroGuide += "<br><br>";
IntroGuide += "<hr />"
window.name0 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = '‍‍‍‍‍‍‍';
};
document.getElementsByClassName('hud-intro-guide')[0].innerHTML = IntroGuide;

// LONG NINKNAMES
window.name1 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = ' ';
};
window.name2 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = ' ';
};
window.name3 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = ' ';
};
window.name4 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = ' ';
};
window.name5 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = ' ';
};
window.name6 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = ' ';
};
window.name7 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = '‍‍‍‍‍‍‍ ';
};
window.name8 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = '‍‍‍‍‍‍‍ ';
};
window.name9 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = ' ';
};
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
function FixShield() {
        if (Game.currentGame.ui.playerTick.zombieShieldHealth < 85000000000000000000000) {
         Game.currentGame.network.sendRpc({name: "EquipItem", itemName: "ZombieShield", tier:  Game.currentGame.ui.inventory.ZombieShield.tier});
    }
}
Game.currentGame.network.addRpcHandler("DayCycle", FixShield);
let dimension = 1;

const onWindowResize = () => {
    const renderer = Game.currentGame.renderer;
    let canvasWidth = window.innerWidth * window.devicePixelRatio;
    let canvasHeight = window.innerHeight * window.devicePixelRatio;
    let ratio = Math.max(canvasWidth / (1920 * dimension), canvasHeight / (1080 * dimension));
    renderer.scale = ratio;
    renderer.entities.setScale(ratio);
    renderer.ui.setScale(ratio);
    renderer.renderer.resize(canvasWidth, canvasHeight);
    renderer.viewport.width = renderer.renderer.width / renderer.scale + 4 * renderer.viewportPadding;
    renderer.viewport.height = renderer.renderer.height / renderer.scale + 4 * renderer.viewportPadding;
}
onWindowResize();
window.onresize = onWindowResize;
window.onwheel = e => {
    if (e.deltaY > 0) {
        dimension += 0.02;
    } else if (e.deltaY < 0) {
        dimension -= 0.02;
    }
    onWindowResize();
}

window.zoom = val => {
    dimension = val;
    upd();
};

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(result){
        var r= parseInt(result[1], 16);
        var g= parseInt(result[2], 16);
        var b= parseInt(result[3], 16);
        return [r, g, b];
    }
    return null;
};

addEventListener('keydown', function(e){ // when key is pressed
    if(e.key == "-"){ // If the key being held down is '-'
Game.currentGame.network.sendRpc({ name: "BuyItem", itemName: "Crossbow", tier: 1}); // Buys item
Game.currentGame.network.sendRpc({ name: "EquipItem", itemName: "Crossbow", tier: 1}); // Holds item
console.log('invisable') // debuggin stuff
    }
}) // :D

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
let Auto3 = {}
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
Auto3.GetGoldStash = function() {
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

// DIV STYLE
var Style1 = document.querySelectorAll('.hud-map, .hud-resources, .hud-menu-shop, .hud-menu-party, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-party-link, .hud-party-members, .hud-party-grid, .hud-settings-grid, .hud-toolbar-item, .hud-toolbar-building, .hud-menu-icon, .hud-spell-icon, .hud-intro-form, .hud-intro-guide, .hud-intro-name, .hud-intro-server, .hud-party-tag, .hud-party-share, .hud-chat-input');
for (var i = 0; i < Style1.length; i++) {
  Style1[i].style.borderRadius = '1em'; // standard
  Style1[i].style.MozBorderRadius = '1em'; // Mozilla
  Style1[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style1[i].style.color = "#7e00fc";
  Style1[i].style.border = "2px solid #400080";
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
            clearInterval(waitForGoldStash)
Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -288, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -288, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -144, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 144, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 144, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 48, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 144, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 240, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 240, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 144, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 480, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 480, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 480, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 576, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 576, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 576, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 288, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -48, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 48, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 384, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 384, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 384, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 288, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 288, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 288, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 144, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -144, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -288, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -384, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -480, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -480, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -384, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -288, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 144, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 384, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -48, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 144, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 240, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 240, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 336, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 480, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 432, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 432, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 336, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -144, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -48, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 48, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -144, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + -240, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -336, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 240, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 336, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 528, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 480, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 576, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 528, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 480, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 336, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 240, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 48, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -144, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -240, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -336, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -144, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 144, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -144, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -240, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -240, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -240, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -240, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -480, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -144, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -480, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -576, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -384, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -384, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -432, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -384, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -432, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -384, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -576, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -576, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -528, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -480, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -576, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -528, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -480, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -408, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 408, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -408, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 408, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 96, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 96, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -192, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 96, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 192, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -96, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 96, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 0, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 0, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -24, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -72, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -120, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 24, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 72, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 120, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 336, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 336, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 264, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 264, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -264, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -264, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 24, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -24, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -96, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -336, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -336, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, 'GoldMine', 0);
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
            clearInterval(waitForGoldStash)
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -72, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -72, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -72, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -72, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -120, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -120, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -120, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -264, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -24, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -72, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -72, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -120, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -120, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 24, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 72, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 120, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 120, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 120, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 120, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 120, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 264, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -144, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -240, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -192, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -288, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -384, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -240, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 144, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 144, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 144, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 288, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 240, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 192, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 384, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 432, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 48, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 48, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 192, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 480, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 576, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 48, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -624, stashPosition.y + 48, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 144, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 144, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 240, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 240, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 288, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 336, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 240, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 240, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 288, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 384, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -336, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -480, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -576, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -48, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -48, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + -144, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -144, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 48, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 144, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 528, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -336, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -48, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -48, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -672, stashPosition.y + -48, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -144, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -144, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -144, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -240, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -240, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -336, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -288, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -384, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -432, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -480, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -528, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -432, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -432, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -384, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -432, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -240, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -144, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -144, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -240, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -240, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -528, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -480, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -432, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -240, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -336, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -336, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -336, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -360, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -360, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 336, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 192, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -624, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -576, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -480, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -528, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -336, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -240, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -624, stashPosition.y + -144, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -624, stashPosition.y + 144, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 240, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 336, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 624, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 576, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 528, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 480, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 432, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 336, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 336, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 432, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 384, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 480, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 360, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 432, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 480, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 144, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 240, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 336, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 264, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 120, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 120, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 72, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 72, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 72, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 360, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 408, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 456, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 504, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 504, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 600, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -600, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -504, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -600, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -456, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -408, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -408, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 408, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 408, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 408, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 408, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 456, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 456, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 408, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 408, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -408, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -408, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -24, 'Wall', 0);
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
Auto.ARTEMISXBASE = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 0);
Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -48, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 48, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 240, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 240, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 48, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -48, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -240, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -240, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -336, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -432, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -336, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -432, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -480, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 336, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 336, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 432, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 432, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 528, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 384, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 480, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 288, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 144, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -48, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 48, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 144, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 144, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 240, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 528, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 624, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 624, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 528, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 144, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 144, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 144, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 240, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 240, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 48, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + -48, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -144, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -288, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -288, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 288, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 432, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 384, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 480, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 432, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 240, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 336, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 336, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -144, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -144, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -240, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -240, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -336, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -384, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -432, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -384, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -480, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -432, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -144, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -144, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -144, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -240, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -336, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -240, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -144, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -240, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -336, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -480, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -480, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -336, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + -240, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 240, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 336, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 144, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 240, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 336, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 480, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 528, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 576, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 576, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 480, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -408, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 408, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 600, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 600, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 408, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -408, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 408, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -408, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 408, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 432, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 192, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -192, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -192, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 192, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 432, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 360, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 264, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 264, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 360, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -264, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -360, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -264, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -360, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -408, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -144, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 144, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 624, stashPosition.y + -48, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 48, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -528, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -528, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -528, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -528, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -576, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -576, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -600, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -600, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -624, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -624, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 696, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 744, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -624, stashPosition.y + 48, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -624, stashPosition.y + -48, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -432, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -408, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -456, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 456, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 408, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -456, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -408, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 456, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 408, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 552, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 504, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 504, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 552, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -504, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -552, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -504, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -552, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -408, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -456, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -504, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -456, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -456, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -408, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -360, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -504, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -408, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -360, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -360, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 456, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 456, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 456, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 408, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 360, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 504, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 504, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 408, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 360, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 360, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + -312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + -264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + -216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + -168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + -120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + -72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + -24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -552, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -600, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -552, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -600, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -600, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -600, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -456, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -504, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -456, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -456, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -408, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -360, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -504, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -360, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -408, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -360, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 504, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 504, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 456, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 456, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 456, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 408, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 360, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 408, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 360, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 360, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 552, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 600, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 552, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 600, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 600, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 600, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 744, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 792, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 840, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -432, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 72, 'Wall', 0);


        }
    }, 0)
}

Auto3.BuildThingBase = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto3.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
        }
    }, 0)
}
EXTREME.Buildgoldhack = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = EXTREME.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 0, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 96, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 0, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -96, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 96, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 192, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 144, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 240, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 288, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 240, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 144, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -144, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -240, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -288, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -240, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -144, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 0, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -96, 'GoldMine', 0);
Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 0, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -96, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 96, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 0, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -96, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 0, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 96, 'BombTower', 0);
Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -336, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -384, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -336, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -480, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -576, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 0, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 0, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -96, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 96, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 672, stashPosition.y + 0, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 0, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 0, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -672, stashPosition.y + 0, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -96, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 96, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 288, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 336, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 384, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 480, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 576, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -288, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -288, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 336, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 288, 'ArrowTower', 0);
Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 192, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 192, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 96, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 288, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 384, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 432, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 432, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 384, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 192, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 288, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 192, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -96, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -192, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -192, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -288, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 96, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -384, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -432, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -432, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -384, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -192, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -192, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -288, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + -96, 'CannonTower', 0);
Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -528, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -480, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -432, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -288, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + -192, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 624, stashPosition.y + -96, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 96, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 192, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 288, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 432, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 480, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 528, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 480, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 432, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 528, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 288, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 192, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -624, stashPosition.y + 96, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -624, stashPosition.y + -96, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -192, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -288, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -432, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -480, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -528, 'MagicTower', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -504, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -600, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -600, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -504, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 504, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 600, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 600, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 504, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -456, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -456, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 24, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 72, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 120, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 168, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 216, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 264, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 312, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 360, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 456, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 648, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 600, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 552, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 504, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 456, 'Door', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 600, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 600, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -360, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 360, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -600, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -696, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + -24, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + -72, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -552, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -600, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -648, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -360, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 264, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 312, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 360, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 384, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 384, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -384, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -384, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -360, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -360, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -264, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -120, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -72, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 360, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 360, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 264, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 120, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 72, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -72, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -120, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -264, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -360, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -360, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 72, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 120, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 168, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 216, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 264, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 312, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 360, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 168, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -216, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 120, 'Wall', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 120, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 72, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 72, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -72, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -72, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -120, 'SlowTrap', 0);
Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -48, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 48, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -48, 'Harvester', 0);
Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 48, 'Harvester', 0);
       }
    }, 0)
}
window.ARTY1 = function() {
  Auto.ARTEMISXBASE()
}
window.TB = function() {
  Auto3.BuildThingBase()
}
window.TH = function() {
  EXTREME.Buildgoldhack()
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

window.Refuel = function() {
    var entities = Game.currentGame.world.entities
    for (let uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        let obj = entities[uid];
        Game.currentGame.network.sendRpc({
            name: "CollectHarvester",
            uid: obj.fromTick.uid
        });
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 1) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.07
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 2) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.11
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 3) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.17
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 4) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.22
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 5) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.25
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 6) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.28
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 7) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.42
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 8) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.65
            });
        }
    }
}
// leave party function
window.leave = function() {
  Game.currentGame.network.sendRpc({
    name: "LeaveParty"
  })
}

//sell functions
window.sellArrows = function() {
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
}
window.sellMages = function() {
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
window.sellCannons = function() {
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
window.sellMelees = function() {
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
window.sellHarvesters = function() {
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
window.sellGoldmines = function() {
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

//Upgrade funtions
window.upgradeArrows = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "ArrowTower") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}
window.upgradeBombs = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "BombTower") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}
window.upgradeMages = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "MagicTower") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}
window.upgradeCannons = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "CannonTower") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}
window.upgradeMelees = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "meleetower") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}
window.upgradeHarvesters = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "Harvester") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}
window.upgradeGoldmines = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "GoldMine") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}
window.upgradeWalls = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "Wall") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}
window.upgradeDoors = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "Door") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}
window.upgradeTraps = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "SlowTrap") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
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
  if (trade.innerHTML == " Auto Upgrade On") {
    trade.innerHTML = " Auto Upgrade Off";
  } else {
    trade.innerHTML = " Auto Upgrade On";
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
  if (trade.innerHTML == " Auto Accept Party Invites On") {
    trade.innerHTML = " Auto Accept Party Invites Off";
  } else {
    trade.innerHTML = " Auto Accept Party Invites On";
  }
}
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
  if (trade.innerHTML == " Enable Auto Farm On") {
    trade.innerHTML = " Disable Auto Farm Off";
  } else {
    trade.innerHTML = " Enable Auto Farm On";
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
  if (trade.innerHTML == " Auto Bow On") {
    trade.innerHTML = " Auto Bow Off";
  } else {
    trade.innerHTML = " Auto Bow On";
  }
}
//Clear Chat Mod
document.querySelector('#clearchatbtn').addEventListener('click', clearChat)

function clearChat() {
document.querySelector('.hud-chat-messages').innerHTML = ""
                console.clear()
}
// OPEN A PARTY TAB
var button7 = document.getElementById("opt");
button7.addEventListener("click", partytab);

function partytab() {
  var url = document.getElementsByClassName('hud-party-share')[0].value;
  window.open(url);
}
// HIDE & SHOW LEADERBOARD
var button4 = document.getElementById("lbb");
button4.addEventListener("click", leaderboard);

function leaderboard() {
  var change2 = document.getElementById("lbb");
  var x = document.getElementById("hud-leaderboard");
  if (x.style.display === "none" && change2.innerHTML == "SHOW LEADERBORED") {
    x.style.display = "block";
    change2.innerHTML = "HIDE LEADERBORED";
  } else {
    x.style.display = "none";
   change2.innerHTML = "SHOW LEADERBORED";
  }
}

// HIDE & SHOW LEFT BOTTOM HUD
var button5 = document.getElementById("lbh");
button5.addEventListener("click", leftbhud);

function leftbhud() {
  var change3 = document.getElementById("lbh");
  var mb = document.getElementsByClassName("hud-bottom-left")[0];
  if (mb.style.display === "none") {
    mb.style.display = "block";
    change3.innerHTML = "HIDE LEFT BOTTOM";
  } else {
    mb.style.display = "none";
   change3.innerHTML = "SHOW LEFT BOTTOM";
  }
}

// HIDE & SHOW RIGHT BOTTOM HUD
var button6 = document.getElementById("rbh");
button6.addEventListener("click", rightbhud);

function rightbhud() {
  var change4 = document.getElementById("rbh");
  var mb = document.getElementsByClassName("hud-bottom-right")[0];
  if (mb.style.display === "none") {
    mb.style.display = "block";
    change4.innerHTML = "HIDE RIGHT BOTTOM";
  } else {
    mb.style.display = "none";
   change4.innerHTML = "SHOW RIGHT BOTTOM";
  }
}
game.renderer.ground.setVisible(false);

game.network.addEntityUpdateHandler(() => {
    if(document.getElementsByClassName('hud-popup-hint')[0]){
        document.getElementsByClassName('hud-popup-hint')[0].remove();
    }
})
//Block Players Mod
const getId = ID => {
    return document.getElementById(ID);
}

const getElement = ELEMENT => {
    return document.getElementsByClassName(ELEMENT);
}
if (localStorage.getItem("blockedNames") == null) {
    localStorage.setItem("blockedNames", "[]");
}

let filterButton = getId("chatFilter");
filterButton.onclick = () => {
    let f = filterButton.getAttribute("filter");
    let newF = "all";
    if (f == "all") {
        newF = "party";
    } else if (f == "party") {
        newF = "none";
    } else if (f == "none") {
        newF = "all";
    }
    filterButton.setAttribute("filter", newF);
    switch (newF) {
        case "all":
            filterButton.setAttribute("class", "btn btn-purple");
            filterButton.textContent = "All";
            break;
        case "party":
            filterButton.setAttribute("class", "btn btn-purple");
            filterButton.textContent = "Party";
            break;
        case "none":
            filterButton.setAttribute("class", "btn btn-purple");
            filterButton.textContent = "None";
            break;
    }
}

let blockButton = getId("blockName");
blockButton.onclick = () => {
    let blocked = JSON.parse(localStorage.getItem("blockedNames"));
    let nameToBlock = getId("nameToBlock").value;
    if (blocked.includes(nameToBlock)) return;
    blocked.push(nameToBlock);
    localStorage.setItem("blockedNames", JSON.stringify(blocked));
}

let unblockButton = getId("unblockName");
unblockButton.onclick = () => {
    let blocked = JSON.parse(localStorage.getItem("blockedNames"));
    let nameToUnblock = getId("nameToBlock").value;
    if (blocked.indexOf(nameToUnblock) == -1) return;
    blocked.splice(blocked.indexOf(nameToUnblock), 1);
    localStorage.setItem("blockedNames", JSON.stringify(blocked));
}

let showBlockedButton = getId("showBlocked");
showBlockedButton.onclick = () => {
    let blocked = JSON.parse(localStorage.getItem("blockedNames"));
    let str = "<h3>";
    str += blocked.join(", ");
    str += "</h3>";
    getId("blockNamesList").innerHTML = str;
}

Game.currentGame.network.emitter.removeListener("PACKET_RPC", Game.currentGame.network.emitter._events.PACKET_RPC[1]);
let onMessageReceived = (msg => {
    let filter = filterButton.getAttribute("filter");
    switch (filter) {
        case "party":
            {
                let party = Game.currentGame.ui.playerPartyMembers;
                let uids = [];
                for (let member of party) {
                    uids.push(member.playerUid);
                }
                if (!uids.includes(msg.uid)) return;
            }
            break;
        case "none":
            return;
            break;
    }
    let blockedNames = JSON.parse(localStorage.getItem("blockedNames"));
    let a = Game.currentGame.ui.getComponent("Chat"),
        b = msg.displayName.replace(/<(?:.|\n)*?>/gm, ''),
        c = msg.message.replace(/<(?:.|\n)*?>/gm, ''),
        d = a.ui.createElement(`<div class="hud-chat-message"><strong>${b}</strong>: ${c}</div>`);
    if (blockedNames.includes(b)) return;
    a.messagesElem.appendChild(d);
    a.messagesElem.scrollTop = a.messagesElem.scrollHeight;
})
Game.currentGame.network.addRpcHandler("ReceiveChatMessage", onMessageReceived);
