// ==UserScript==
// @name         İcon 5 (giriş_çıkış)
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Creating the new icon have hacks
// @author       ๖ƬƇㄨ ☣ ๖ۣۜØ₥ɆⱤ๖ۣ ☣✓™
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393629/%C4%B0con%205%20%28giri%C5%9F_%C3%A7%C4%B1k%C4%B1%C5%9F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/393629/%C4%B0con%205%20%28giri%C5%9F_%C3%A7%C4%B1k%C4%B1%C5%9F%29.meta.js
// ==/UserScript==
/*function keyDownF(e) {
  switch (e.keyCode) {
      case 219:
      leave();
      break;
      case 222:
      join();
      break;
      case 191:
      join2();
      break;
  }
}
setInterval(function () {
    if (document.querySelectorAll(".hud-chat .hud-chat-input:focus")[0]) {
        window.removeEventListener("keydown", keyDownF);
    } else {
        window.addEventListener("keydown", keyDownF);
    }
}, 0);*/
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
.hud-menu-zipp5 {
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
.hud-menu-zipp5 h3 {
display: block;
margin: 0;
line-height: 20px;
}
.hud-menu-zipp5 .hud-zipp-grid5 {
display: block;
height: 380px;
padding: 10px;
margin-top: 18px;
background: rgba(0, 0, 0, 0.2);
}
.hud-spell-icons .hud-spell-icon[data-type="Zippity5"]::before {
background-image: url("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/key_1f511.png");
}
.hud-menu-zipp5 .hud-the-tab {
position: relative;
height: 40px;
line-height: 40px;
margin: 20px;
border: 0px solid rgb(0, 0, 0, 0);
}
.hud-menu-zipp5 .hud-the-tab {
display: block;
float: left;
padding: 0 14px;
margin: 0 1px 0 0;
font-size: 14px;
background: rgba(0, 0, 0, 0.4);
color: rgba(255, 255, 255, 0.4);
transition: all 0.15s ease-in-out;
}
.hud-menu-zipp5 .hud-the-tab:hover {
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
spell.setAttribute("data-type", "Zippity5");
spell.classList.add("hud-zipp5-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);

//Menu for spell icon
let modHTML = `
<div class="hud-menu-zipp5">
<br />
<div class="hud-zipp-grid5">
</div>
</div>
`;
document.body.insertAdjacentHTML("afterbegin", modHTML);
let zipz123 = document.getElementsByClassName("hud-menu-zipp5")[0];

//Onclick
document.getElementsByClassName("hud-zipp5-icon")[0].addEventListener("click", function() {
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

  document.getElementsByClassName("hud-zipp-grid5")[0].innerHTML = `
<div style="text-align:center"><br>
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
<hr />
<h3>Leave Parties</h3>
<hr />
<button onclick="leave();">Leave</button>
<br><br>
<input type="text" maxlength="20" placeholder="share key" id="MyKey1">
  `;
setInterval(() => { let ed = MyKey1.value = Game.currentGame.ui.playerPartyShareKey }, 100)
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

window.join4 = function() {
        Game.currentGame.network.sendRpc({
                name: "JoinPartyByShareKey",
                partyShareKey: key
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

window.leave = function() {
  Game.currentGame.network.sendRpc({
    name: "LeaveParty"
  })
Object.keys(buildings).forEach(key => {
const building = buildings[key]
if(["Wall", "Door", "SlowTrap", "ArrowTower", "CannonTower", "MeleeTower", "BombTower", "MagicTower", "GoldMine", "Harvester" || "Wall"].indexOf(building.type) >= 0) {
delete buildings[key]
}})
}