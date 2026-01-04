// ==UserScript==
// @name         Ninja's last mod for a month
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        zombs.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389597/Ninja%27s%20last%20mod%20for%20a%20month.user.js
// @updateURL https://update.greasyfork.org/scripts/389597/Ninja%27s%20last%20mod%20for%20a%20month.meta.js
// ==/UserScript==

//Background Changer
var Introleft = '';
Introleft += "<h3> Background Intro Changer!</h3>";
Introleft += "<input class='input' type='text'></input>";
Introleft += "&nbsp;";
Introleft += "<button class=\"btn btn-apply\" style=\"width: 24%;\">Apply</button>";

document.getElementsByClassName('hud-intro-left')[0].innerHTML = Introleft;

let element = document.getElementsByClassName('btn btn-apply')[0];
  element.addEventListener("click", function(e) {
           let value = document.getElementsByClassName('input')[0].value;
           let css = '<style type="text/css">.hud-intro::after { background: url('+ value +'); background-size: cover; }</style>';
   console.log("new background!")
           document.body.insertAdjacentHTML("beforeend", css);
});

var timer = null;

function speed(e) {
    switch (e.keyCode) {
        case 89:
            if (timer == null) {
                timer = setInterval(function () {
                    document.getElementsByClassName("btn btn-green hud-intro-play")[0].click();
                }, -999);
            } else {
                clearInterval(timer);
                timer = null;
            }
            break;
    }
}
setInterval(function () {
    if (document.querySelectorAll(".hud-chat .hud-chat-input:focus")[0]) {
        window.removeEventListener("keydown", speed);
    } else {
        window.addEventListener("keydown", speed);
    }
}, 0);

// DIV STYLE
var Style1 = document.querySelectorAll('.hud-map, .hud-resources, .hud-menu-shop, .hud-menu-party, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-party-link, .hud-party-members, .hud-party-grid, .hud-settings-grid, .hud-toolbar-item, .hud-toolbar-building, .hud-menu-icon, .hud-spell-icon, .hud-intro-form, .hud-intro-guide, .hud-intro-name, .hud-intro-server, .hud-party-tag, .hud-party-share, .hud-chat-input');
for (var i = 0; i < Style1.length; i++) {
  Style1[i].style.borderRadius = '1em'; // standard
  Style1[i].style.MozBorderRadius = '1em'; // Mozilla
  Style1[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style1[i].style.color = "#2DD480";
  Style1[i].style.border = "2px solid #2DD480";
}

// INPUT AND SELECT STYLE
var Style2 = document.querySelectorAll('select, input');
for (var i = 0; i < Style2.length; i++) {
  Style2[i].style.borderRadius = '1em'; // standard
  Style2[i].style.MozBorderRadius = '1em'; // Mozilla
  Style2[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style2[i].style.color = "#2DD480";
  Style2[i].style.border = "2px solid #2DD480";
  Style2[i].style.backgroundColor = "#FFFFFF";
}

//Custom Enter Game Message
document.getElementsByClassName("hud-top-center")[0].innerHTML = "";
        Game.currentGame.ui.getComponent("Chat").onMessageReceived({
        displayName: "NINJA [BOT]",
        message: "Succesfully Enabled Ninja's Mod!"
    })

//Random Stuff
document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[1].innerHTML = "<h1>Ninja's Mod</h1>";
document.getElementsByClassName('hud-intro-corner-top-left')[0].innerHTML = "<h2>By: ✘N̷i̷n̷j̷a̷</h2>";
document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[3].innerHTML = "<h2>Upgrade. Rebl. Destroy.</h2>";
document.getElementsByClassName("hud-top-center")[0].innerHTML = `<input type="text" placeholder="Send feedback!" maxlength="50"> &nbsp;
  <button onclick="Submit()" class="btn btn-gold">Submit</button>`;
  window.Submit = function() {
    document.getElementsByClassName("hud-top-center")[0].innerHTML = "";
          Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "Thank you for your response!"
        })
  }
document.getElementsByClassName('hud-intro-footer')[0].remove();
document.getElementsByClassName("hud-party-joining")[0].remove();
document.getElementsByClassName("hud-day-night-overlay")[0].remove();
document.getElementsByClassName("hud-respawn-share")[0].remove();
document.querySelectorAll('.ad-unit').forEach(function(a) {
	a.remove();
});
document.getElementById('hud-menu-party').style.width = "650px";
document.getElementById('hud-menu-party').style.height = "460px";
document.getElementsByClassName('hud-intro-form')[0].style.width = "325px";
document.getElementsByClassName('hud-intro-form')[0].style.height = "235px";
document.getElementsByClassName("hud-intro-corner-bottom-right")[0].remove();
document.getElementsByClassName("hud-intro-corner-bottom-left")[0].remove();
document.getElementsByClassName("hud-intro-name")[0].setAttribute("maxlength", 29);
document.getElementsByClassName("hud-party-tag")[0].setAttribute("maxlength", 25);
document.getElementsByClassName("hud-intro-play")[0].className = "btn btn-Y hud-intro-play";
document.getElementsByClassName("hud-respawn-btn")[0].className = "btn btn-Y";

// INTRO STYLE CODES INNERHTML
var IntroGuide = '';
IntroGuide += "<center><span>Ninja's Mod</span>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<center><h3>Name Short Cut!</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '✘N̷i̷n̷j̷a̷';\">✘N̷i̷n̷j̷a̷</button>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<center><h3>No Name ;D</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '​';\">No Name</button>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<center><h3>Zombs.io Server Short Cuts!</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592411';\">Europe 1 My Dude ;D</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8593912';\">Australia 1 My Dude ;D</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8617900';\">West 1 (sometimes work)</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618013';\">East 1 (sometimes work)</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564836';\">Go Through Barrier Server ;D</button>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<center><h3>Zombs.io long nicknames</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '✘N̷i̷n̷j̷a̷ is Savage xD';\">Long Name 1</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'Would_You_Like_To_Eat_Toast';\">Long Name 2</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'Ninja,Ninja,Ninja,Ninja';\">Long Name 3</button>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<center><h3>Zombs.io border color</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 90%;\" id=\"cbc1\">BORDER COLOR</button>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";

document.getElementsByClassName('hud-intro-guide')[0].innerHTML = IntroGuide;

                // Tower freeze
        function keyDown(e) {
  switch (e.keyCode) {
      case 88:
      startUPP();
      stopUPP();
      break;
      case 45:
      SellAll();
      break;
      case 46:
      SellStash();
      break;
      case 82:
      heal();
      break;
      case 90:
      startbow();
      stopbow();
      break;
      case 219:
          leave();
          break;
      case 221:
          join();
          break;
      case 222:
          join2();
          break;
      case 191:
          join3();
          break;
      case 85:
          startSSL();
          stopSSL();
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

let Settings = ''
Settings += `
<button id=\"rwp\" class=\"btn btn-green\" style=\"width: 49%;\">Speed</button>

<button class="btn btn-green" style="width: 49%;" onclick="AutoHeal();">Auto Heal</button>

<hr />

<center><h3>Sell towers</h3>

<hr />

<button class="btn btn-blue" style="width: 49%;" onclick="SellStash();">Sell Stash!</button>

<button class="btn btn-blue" style="width: 49%;" onclick="sellWalls();">Sell Walls!</button>

<button class="btn btn-blue" style="width: 49%;" onclick="sellDoors();">Sell Doors!</button>

<button class="btn btn-blue" style="width: 49%;" onclick="sellslowtrap();">Sell Slow Traps!</button>

<button class="btn btn-blue" style="width: 49%;" onclick="sellArrow();">Sell Arrow Towers!</button>

<button class="btn btn-blue" style="width: 49%;" onclick="sellCannon();">Sell Cannon Towers!</button>

<button class="btn btn-blue" style="width: 49%;" onclick="sellMelee();">Sell Melee Towers!</button>

<button class="btn btn-blue" style="width: 49%;" onclick="sellBomb();">Sell Bomb Towers!</button>

<button class="btn btn-blue" style="width: 49%;" onclick="sellMage();">Sell Mage Towers!</button>

<button class="btn btn-blue" style="width: 49%;" onclick="sellMines();">Sell Gold Mines!</button>

<button class="btn btn-red" style="width: 100%;" onclick="SellAll();">Sell All!</button>

<hr />

<h3>Crazy stuff</h3>

<hr />

<button class="btn btn-purple" style="width: 49%;" onclick="Fill();">Fill Server!</button>

<button class=\"btn btn-purple\" style=\"width: 49%;\" onclick=\"ServerDisconnect();\">Disconect server</button>

<button class=\"btn btn-purple\"style=\"width: 100%;\" onclick=\"ClearChat();\">Clear chat</button>

<hr />

<h3>Chat Art</h3>

<hr />

<button class="btn btn-gold" style="width: 49%;" onclick="ChatArt1();">Chat Art #1</button>

<button class="btn btn-gold" style="width: 49%;" onclick="ChatArt2();">Chat Art #2</button>

<button class="btn btn-gold" style="width: 49%;" onclick="ChatArt3();">Chat Art #3</button>

<button class="btn btn-gold" style="width: 49%;" onclick="ChatArt4();">Chat Art #4</button>

<button class="btn btn-gold" style="width: 49%;" onclick="ChatArt5();">( ͡° ͜ʖ ͡°)</button>

<button class="btn btn-gold" style="width: 49%;" onclick="ChatArt6();">ʕ •ᴥ•ʔ</button>

<button class="btn btn-gold" style="width: 100%;" onclick="ChatArt7();">Chat Art BIG</button>

<hr />

<button id="UPP" class="btn btn-red" style="width: 30%; height: 40px;">Enable Upgrade All</button>

<button id="AHRC" class="btn btn-red" style="width: 30%; height: 40px;">Enable AHRC</button>

<button id="bow" class="btn btn-red" style="width: 30%; height: 40px;">Enable Autobow</button>

<button id="SSL" class="btn btn-red" style="width: 30%; height: 40px;">Enable Accept All</button>

<button id="SSL4" class="btn btn-red" style="width: 30%; height: 40px;">Enable aito</button>

<button id="SSL3" class="btn btn-red" style="width: 30%; height:40px;">Enable Tower Heal</button>

<hr />`

document.getElementsByClassName("hud-settings-grid")[0].innerHTML = Settings;

//Custom Message Maker
Settings += `
<hr />
<h3>Custom Message Builder</h3>
<hr />
<input type="search" placeholder="Name" maxlength="16" id="myName">
<input type="search" placeholder="Message" maxlength="140" id="myMessage">
<button onclick="customMessage();">Submit</button>
`

document.getElementsByClassName('hud-settings-grid')[0].innerHTML = Settings

window.customMessage = function() {
let name = myName.value
let message = myMessage.value
Game.currentGame.ui.getComponent('Chat').onMessageReceived({
        displayName: name,
        message: message
})
}

//Global Message Sender
Settings += `
<hr />
<h3>Global message</h3>
<hr />
<input type="search" placeholder="Message" maxlength="140" id="myGlobalMessage">
<button onclick="globalMessage();">Submit</button>
`

document.getElementsByClassName('hud-settings-grid')[0].innerHTML = Settings

window.globalMessage = function() {
  let globalMessage = myGlobalMessage.value
  Game.currentGame.network.sendRpc({
    name: "SendChatMessage",
    channel: "Global",
    message: globalMessage
  })
}

//Change Title
Settings += `
<hr />
<h3>Change Title</h3>
<hr />
<input type="text" placeholder="Name" maxlength="16" id="myTitle">
<button onclick="change();">Alteration</button>
`

document.getElementsByClassName('hud-settings-grid')[0].innerHTML = Settings

window.change = function() {
  let title = myTitle.value
  document.title = title
}

//Custom Menu Maker
Settings += `
<hr />
<h3>Custom Menu Maker</h3>
<hr />
<input type="text" id="myMenuTitle" placeholder="Title">
<input type="text" id="myMenuMain" placeholder="Link">
<button onclick="myMenuMake();">Do</button>
`

document.getElementsByClassName('hud-settings-grid')[0].innerHTML = Settings

window.myMenuMake = function() {
let html = myMenuMain.value
let myTitle = myMenuTitle.value
;(function() {
    for (let i = 0; i < arguments.length; i++) {
        let script = document.createElement("script")
        script.src = arguments[i]
        document.body.appendChild(script)
    }
})("https://cdn.jsdelivr.net/gh/demostanis/ultimate-mod@latest/menu-maker-min.js")
let myMenu = new menu()
myMenu.show()
myMenu.setTitle(myTitle)
myMenu.addHTML(html)
}

//Custom Popup Maker
Settings += `
<hr />
<h3>Special Pop-up Maker</h3>
<hr />
<input type="search" maxlength="50" placeholder="Pop-up" id="myPopup">
<button onclick="customPopup();">Submit</button>
`

document.getElementsByClassName('hud-settings-grid')[0].innerHTML = Settings

window.customPopup = function() {
let popupMsg = myPopup.value
let popup = Game.currentGame.ui.getComponent("PopupOverlay")
popup.showHint(popupMsg)
}

//Join Party
Settings += `
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
`

document.getElementsByClassName('hud-settings-grid')[0].innerHTML = Settings

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
Settings += `
<hr />
<h3>Tower Heal</h3>
<hr />
<input type="text" maxlength="50" placeholder="x" id="x">
<input type="text" maxlength="50" placeholder="y" id="y">
<button onclick="ss();">heal towers</button>
<button onclick="se();">unheal towers</button>

`
window.ss = function() {
  let X = x.value
  let Y = y.value
 let i = setInterval(() => {
Game.currentGame.network.sendRpc({
name:"CastSpell",
spell:"HealTowersSpell",
x: Math.round(X),
y: Math.round(Y),
tier: 1
})
 }, 2000)
 window.se = function() {
clearInterval(i);
 }
}
//Auto Build
Settings += `
<hr />
<h3>Auto Build</h3>
<hr />
<button onclick="BSB();">Bryan Smith Base</button>
<button onclick="TB();">Thing Base</button>
<button onclick="MB();">Defense Base</button>
<button onclick="XBase();">X Base</button>
<button onclick="TH();">Enable gold generator</button>
<button onclick="D1();">Disable gold generator</button>
<br><br>
`

document.getElementsByClassName('hud-settings-grid')[0].innerHTML = Settings

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
        }
    },700)
    var waitForGoldStash2 = setInterval(function() {
    upgradeBombs()
        },25)
    window.D1 = function() {
clearInterval(waitForGoldStash);
clearInterval(waitForGoldStash2);
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
    }, 100)
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
    }, 100)
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
    }, 100)
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
    }, 100)
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



//Leave Parties
Settings += `
<hr />
<h3>Leave Parties</h3>
<hr />
<button onclick="leave();">Leave</button>
`

document.getElementsByClassName('hud-settings-grid')[0].innerHTML = Settings

window.leave = function() {
  Game.currentGame.network.sendRpc({
    name: "LeaveParty"
  })
}

//Auto Raid
Settings += `
<hr />
<h3>Auto Raid</h3>
<hr />
<input type="text" class="TFkey" placeholder="share key">
<input type="text" maxlength="4" placeholder="speed" id="e">
<button class="TFvalidKey">Valid Key</button>
<button class="TFbtn">Freeze Towers</button>
`

document.getElementsByClassName('hud-settings-grid')[0].innerHTML = Settings

$("TFbtn").addEventListener("click", FREEZE);
var TowerFreeze = null;
var key;
var speed;
$("TFvalidKey").addEventListener("click", function() {
  key = $("TFkey").value;
speed = e.value;
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
    }, speed);
  } else {
    clearInterval(TowerFreeze);
    TowerFreeze = null;
  }
}

// SPEED RUN WITH PET
var button9 = document.getElementById("rwp");
button9.addEventListener("click", speedrun);
button9.addEventListener("click", speedrun2);

var petrun = null;

function speedrun() {
  clearInterval(petrun);
  if (petrun !== null) {
    petrun = null;
  } else {
    petrun = setInterval(function() {
      equip = document.getElementsByClassName('hud-shop-actions-equip');
      for (var i = 0; i < equip.length; i++) {
        var pets = equip[i];
        pets.click();
      }
    }, 0); // SPEED FOR RUN
  }
}

function speedrun2() {
  var change5 = document.getElementById("rwp");
  if (change5.innerHTML == "Speed") {
    change5.innerHTML = "Speed";
  } else {
    change5.innerHTML = "Speed";
  }
}

          window.AutoHeal = function() {
            (function() {
              heal = document.getElementsByClassName('hud-shop-item')[10];
              petHeal = document.getElementsByClassName('hud-shop-item')[11];
              useHeal = document.getElementsByClassName('hud-toolbar-item')[4];
              usePetHeal = document.getElementsByClassName('hud-toolbar-item')[5];
              healthBar = document.getElementsByClassName('hud-health-bar-inner')[0];
              up = new Event('mouseup');
              healLevel = 70;

              HEAL = function() {
                heal.attributes.class.value = 'hud-shop-item';
                petHeal.attributes.class.value = 'hud-shop-item';
                useHeal.dispatchEvent(up);
                usePetHeal.dispatchEvent(up);
                heal.click();
                petHeal.click();
              };

              script = function(e) {
                if (e.keyCode == 72) {
                  HEAL();
                }
              };
              document.addEventListener('keydown', function(e) {
                script(e);
              });
              observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutationRecord) {
                  if (parseInt(mutations[0].target.style.width) < healLevel) {
                    HEAL();
                  }
                });
              });
              observer.observe(healthBar, {
                attributes: true,
                attributeFilter: ['style']
              });
            })();
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

window.sellslowtrap = function() {
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

window.sellArrow = function() {
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

window.sellCannon = function() {
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

window.sellMelee = function() {
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

window.sellBomb = function() {
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

window.sellMage = function() {
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

window.sellMines = function() {
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

window.ChatArt1 = function() {
          Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "─▄▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▄"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "█░░░█░░░░░░░░░░▄▄░██░█"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "█░▀▀█▀▀░▄▀░▄▀░░▀▀░▄▄░█"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "█░░░▀░░░▄▄▄▄▄░░██░▀▀░█"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "─▀▄▄▄▄▄▀─────▀▄▄▄▄▄▄▀"
        })
}
window.ChatArt2 = function() {
        	Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "█░░╦─╦╔╗╦─╔╗╔╗╔╦╗╔╗░░█"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "█░░║║║╠─║─║─║║║║║╠─░░█"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "█░░╚╩╝╚╝╚╝╚╝╚╝╩─╩╚╝░░█"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█"
        })
}
window.ChatArt3 = function() {
        	Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "┌┐░░┌───┬┐░░░"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "││░░│┌─┐││░░░"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "││░░││░│││░░░"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "││░┌┤│░│││░┌┐"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "│└─┘│└─┘│└─┘│"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "└───┴───┴───┘"
        })
}
window.ChatArt4 = function() {
          Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "║░█░█░║░█░█░█░║░█░█░║"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "║░█░█░║░█░█░█░║░█░█░║"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "║░║░║░║░║░║░║░║░║░║░║"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "╚═╩═╩═╩═╩═╩═╩═╩═╩═╩═╝"
        })
}

window.ChatArt7 = function() {
          Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "░░░░█░░░░▒▒▒▒▒▒▒▒▒▒▒▒░░▀▀▄"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "░░░█░░░▒▒▒▒▒▒░░░░░░░░▒▒▒░░█"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "░░█░░░░░░▄██▀▄▄░░░░░▄▄▄░░░█"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "░▀▒▄▄▄▒░█▀▀▀▀▄▄█░░░██▄▄█░░░█"
        })
          Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "█▒█▒▄░▀▄▄▄▀░░░░░░░░█░░░▒▒▒▒▒█"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "█▒█░█▀▄▄░░░░░█▀░░░░▀▄░░▄▀▀▀▄▒█"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "░█▀▄░█▄░█▀▄▄░▀░▀▀░▄▄▀░░░░█░░█"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "░░█░░▀▄▀█▄▄░█▀▀▀▄▄▄▄▀▀█▀██░█"
        })
               Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "░░░█░░██░░▀█▄▄▄█▄▄█▄████░█"
        })
          Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "░░░░█░░░▀▀▄░█░░░█░███████░█"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "░░░░░▀▄░░░▀▀▄▄▄█▄█▄█▄█▄▀░░█"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "░░░░░░░▀▄▄░▒▒▒▒░░░░░░░░░░█"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "░░░░░░░░░░▀▀▄▄░▒▒▒▒▒▒▒▒▒▒░█"
        })
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "░░░░░░░░░░░░░░▀▄▄▄▄▄░░░░░█"
        })
}

window.ChatSpam = function() {
          Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "<Spam Enabled! 3sec"
        })
}

window.ChatArt5 = function() {
          Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "( ͡° ͜ʖ ͡°)"
        })
}

window.ChatArt6 = function() {
          Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "NINJA [BOT]",
            message: "ʕ •ᴥ•ʔ"
        })
}

//server fill
window.Fill = function() {
setInterval(function() {
    document.getElementsByClassName("hud-intro-play")[0].click();
}, 0);
}

//server closer
window.ServerDisconnect = function() {
  Game.currentGame.network.sendRpc({
    name: "SendChatMessage",
    channel: "Global",
    message: "fuckkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk"
  })
}

//clear chat
window.ClearChat = function() {
  var Chat = ''
  Chat += ''

  document.getElementsByClassName('hud-chat-messages')[0].innerHTML = Chat;
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
                }, 20);
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
  if (trade.innerHTML == "Enable aito") {
    trade.innerHTML = "Disable aito";
  } else {
    trade.innerHTML = "Enable aito";
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
function startSSL3() {
clearInterval(SSL3);
  if (SSL3 !== null) {
    SSL3 = null;
  } else {

              SSL3 = setInterval(function() {
spellHP()
           },0)
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

//gold gen
Game.currentGame.network.addEnterWorldHandler(() => {
const placeBuilding = (x, y, building, yaw) => {
        Game.currentGame.network.sendRpc({
                name: "MakeBuilding",
                x: x,
                y: y,
                type: building,
                yaw: yaw
        })
             upgradeSlowTraps()
        sellSlowTraps()
    upgradeBombs()
    sellBombs()
},
        sellBombs = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(obj.fromTick.model == "GoldMine") {
                                Game.currentGame.network.sendRpc({
                                        "name": "DeleteBuilding",
                                        "uid": obj.fromTick.uid
                                })

                        }
                }
        },
      sellSlowTraps = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(obj.fromTick.model == "GoldMine") {
                                Game.currentGame.network.sendRpc({
                                        "name": "DeleteBuilding",
                                        "uid": obj.fromTick.uid
                                })
                        }
                }
        },

        upgradeStash = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(obj.fromTick.model == "GoldStash") {
                                Game.currentGame.network.sendRpc({
                                        "name": "UpgradeBuilding",
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
                        if(obj.fromTick.model == "GoldMine") {
                                Game.currentGame.network.sendRpc({
                                        "name": "UpgradeBuilding",
                                        "uid": obj.fromTick.uid
                                })
                        }
                }
        },
        upgradeSlowTraps = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(obj.fromTick.model == "GoldMine") {
                                Game.currentGame.network.sendRpc({
                                        "name": "UpgradeBuilding",
                                        "uid": obj.fromTick.uid
                                })
                        }
                }
        },
      SellAll = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(["MeleeTower", "MagicTower", "CannonTower", "BombTower", "ArrowTower", "Door", "GoldMine", "Wall", "Harvester", "SlowTrap" || "Wall"].indexOf(obj.fromTick.model) >= 0) {
                                Game.currentGame.network.sendRpc({
                                        "name": "DeleteBuilding",
                                        "uid": obj.fromTick.uid
                                })
                        }
                }
        },
        upgradeGoldMines = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(obj.fromTick.model == "GoldMine") {
                                Game.currentGame.network.sendRpc({
                                        "name": "UpgradeBuilding",
                                        "uid": obj.fromTick.uid
                                })
                        }
                }
        },
        upgradeBase = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(["MeleeTower", "MagicTower", "CannonTower", "BombTower", "ArrowTower", "Door", "PetCARL", "PetMiner" || "Wall"].indexOf(obj.fromTick.model) >= 0) {
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
        grid = document.querySelector(".hud-chat-messages")

grid.innerHTML += `<button class="KodeLlmsaBgcZ">Gold Mine Aktif -</button>`

Array.prototype.slice.call(grid.childNodes)
        .find(c => c.classList && c.classList.value == "KodeLlmsaBgcZ")
                .addEventListener("click", e => {
        switch(e.target.innerText) {
                case "Gold Mine Aktif -":
                        e.target.innerText = "Gold Mine Aktif +"
                        start()
                        break
                case "Gold Mine Aktif +":
                        e.target.innerText = "Gold Mine Aktif -"
                        stop()
                        break
        }
})

Game.currentGame.network.addRpcHandler("LocalBuilding", e => {
        if(e[0].type === "GoldStash" && !e[0].dead && e[0].tier === 1) {
                if(state.stopped) return
                placeBuilding(e[0].x + -48, e[0].y + -1000000000, "GoldMine", 0)
                placeBuilding(e[0].x + 48, e[0].y + -1000000000, "GoldMine", 0)
                placeBuilding(e[0].x + 96, e[0].y + 1000000000, "GoldMine", 0)
                placeBuilding(e[0].x + -96, e[0].y + 1000000000, "GoldMine", 0)
                placeBuilding(e[0].x + -48, e[0].y + 1000000000, "GoldMine", 0)
                            placeBuilding(e[0].x + -48, e[0].y + 1000000000, "GoldMine", 0)
                placeBuilding(e[0].x + -48, e[0].y + 1000000000, "GoldMine", 0)
                placeBuilding(e[0].x + -48, e[0].y + 1000000000, "GoldMine", 0)
                placeBuilding(e[0].x + -48, e[0].y + 1000000000, "GoldMine", 0)
                placeBuilding(e[0].x + -48, e[0].y + 1000000000, "GoldMine", 0)
                placeBuilding(e[0].x + -48, e[0].y + 1000000000, "GoldMine", 0)
                placeBuilding(e[0].x + -48, e[0].y + 1000000000, "GoldMine", 0)
                placeBuilding(e[0].x + -48, e[0].y + 1000000000, "GoldMine", 0)
                placeBuilding(e[0].x + -48, e[0].y + 1000000000, "GoldMine", 0)
                placeBuilding(e[0].x + -48, e[0].y + 1000000000, "GoldMine", 0)
                placeBuilding(e[0].x + 48, e[0].y + 1000000000, "GoldMine", 0)
                placeBuilding(e[0].x + 192, e[0].y + 1000000000, "GoldMine", 0)
                placeBuilding(e[0].x + -192, e[0].y + 1000000000, "GoldMine", 0)
                    placeBuilding(e[0].x + -96, e[0].y + 1000000000, "ArrowTower", 0)
                                placeBuilding(e[0].x + -96, e[0].y + 1000000000, "ArrowTower", 0)
                                placeBuilding(e[0].x + -96, e[0].y + 1000000000, "ArrowTower", 0)
                                placeBuilding(e[0].x + -96, e[0].y + 1000000000, "ArrowTower", 0)
                placeBuilding(e[0].x + 96, e[0].y + 1000000000, "ArrowTower", 0)
                placeBuilding(e[0].x + 96, e[0].y + -1000000000, "ArrowTower", 0)
                placeBuilding(e[0].x + -96, e[0].y + -1000000000, "ArrowTower", 0)
                            placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + 168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + 168, e[0].y + 1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + 1000000000, "Door", 0)
                const intervalId = setInterval(() => {
                        if(state.stopped) return
                placeBuilding(e[0].x + -192, e[0].y + -1000000000, "BombTower", 0)
                placeBuilding(e[0].x + -192, e[0].y + 1000000000, "BombTower", 0)
                placeBuilding(e[0].x + -192, e[0].y + 1000000000, "BombTower", 0)
                placeBuilding(e[0].x + -192, e[0].y + 1000000000, "BombTower", 0)
                placeBuilding(e[0].x + -192, e[0].y + 1000000000, "BombTower", 0)
                placeBuilding(e[0].x + -192, e[0].y + 1000000000, "BombTower", 0)
                placeBuilding(e[0].x + -192, e[0].y + 1000000000, "BombTower", 0)
                placeBuilding(e[0].x + -192, e[0].y + 1000000000, "BombTower", 0)
                                    placeBuilding(e[0].x + 192, e[0].y + -1000000000, "CannonTower", 0)
                                    placeBuilding(e[0].x + 192, e[0].y + -1000000000, "ArrowTower", 0)
                                    placeBuilding(e[0].x + 192, e[0].y + -1000000000, "ArrowTower", 0)
                                    placeBuilding(e[0].x + 192, e[0].y + -1000000000, "ArrowTower", 0)
                                    placeBuilding(e[0].x + 192, e[0].y + -1000000000, "ArrowTower", 0)
                                    placeBuilding(e[0].x + 192, e[0].y + -1000000000, "ArrowTower", 0)
                                    placeBuilding(e[0].x + 192, e[0].y + -1000000000, "ArrowTower", 0)
                                    placeBuilding(e[0].x + 192, e[0].y + -1000000000, "ArrowTower", 0)
                                    placeBuilding(e[0].x + 192, e[0].y + -1000000000, "ArrowTower", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
 placeBuilding(e[0].x + -192, e[0].y + -96, "GoldMine", 0)
                placeBuilding(e[0].x + -192, e[0].y + 96, "GoldMine", 50)
                placeBuilding(e[0].x + 192, e[0].y + 96, "GoldMine", 100)
                placeBuilding(e[0].x + 192, e[0].y + -96, "GoldMine", 150)
                placeBuilding(e[0].x + 0, e[0].y + -192, "GoldMine", 200)
                placeBuilding(e[0].x + 0, e[0].y + 192, "GoldMine", 250)
                }, 800)
const intervalIdr = setInterval(() => {
                        if(state.stopped) return
                  upgradeBombs()
                }, 27)
                Game.currentGame.network.addEntityUpdateHandler(e => {
                        if(state.stopped) return
                        const myUid = Game.currentGame.world.myUid
                        if(e.entities[myUid].gold >= 5200 && e.entities[myUid].gold <= 10199) {
                                upgradeStash()
                                upgradeGoldMines()

                                setTimeout(upgradeBase, 5000)
                        } else if(e.entities[myUid].gold >= 10200 && e.entities[myUid].gold <= 16199) {
                                upgradeStash()
                                upgradeGoldMines()

                                setTimeout(upgradeBase, 3000)
                        } else if(e.entities[myUid].gold >= 16200 && e.entities[myUid].gold <= 20199) {
                                upgradeStash()
                                upgradeGoldMines()

                                setTimeout(upgradeBase, 1000)
                        } else if(e.entities[myUid].gold >= 20200 && e.entities[myUid].gold <= 32199) {
                                upgradeStash()
                                upgradeGoldMines()

                                setTimeout(upgradeBase, 500)
                        } else if(e.entities[myUid].gold >= 32200 && e.entities[myUid].gold <= 100199) {
                                upgradeStash()
                                upgradeGoldMines()

                                upgradeBase()
                        } else if(e.entities[myUid].gold >= 100200 && e.entities[myUid].gold <= 400199) {
                                upgradeStash()
                                upgradeGoldMines()

                                upgradeBase()
                        } else if(e.entities[myUid].gold >= 400200 && e.entities[myUid].gold <= 1000000) {
                                upgradeStash()
                                upgradeGoldMines()

                                upgradeBase()
                        } else if(e.entities[myUid].gold >= 1000000 && e.entities[myUid].gold <= 100000000) {
                                upgradeStash()
                                upgradeGoldMines()

                                upgradeBase()
                        }
                 })
           }
     })
})