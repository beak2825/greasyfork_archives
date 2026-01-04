// ==UserScript==
// @name         </> Kurt & Java Giriş, Çıkış
// @namespace    http://tampermonkey.net/
// @version      17.5
// @description  Kurt & Java
// @author       Kurt
// @match        http://zombs.io/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/424125/%3C%3E%20Kurt%20%20Java%20Giri%C5%9F%2C%20%C3%87%C4%B1k%C4%B1%C5%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/424125/%3C%3E%20Kurt%20%20Java%20Giri%C5%9F%2C%20%C3%87%C4%B1k%C4%B1%C5%9F.meta.js
// ==/UserScript==
function keyDownF(e) {
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
}, 0);
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
background-image: url("https://cdn.discordapp.com/emojis/819848600032509992.png?v=1");
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
<h3>• Kurt & Java Klana Katıl</h3>
<hr />
<button class="d">•</button>
<button class="d">•</button>
<button class="d">•</button>
<br><br>
<input type="text" maxlength="20" placeholder="Anaktar I" id="myKey">
<button onclick="join();">Katıl</button>
<input type="text" maxlength="20" placeholder="Anaktar II" id="myKey2">
<button onclick="join2();">Katıl</button>
<input type="text" maxlength="20" placeholder="Anaktar III" id="myKey3">
<button onclick="join3();">Katıl</button>
<input type="text" maxlength="20" placeholder="Anaktar IV" id="myKey2">
<button onclick="join5();">Katıl</button>
<input type="text" maxlength="20" placeholder="Anaktar V" id="myKey3">
<button onclick="join6();">Katıl</button>
<input type="text" maxlength="20" placeholder="Anaktar VI" id="myKey3">
<button onclick="join7();">Katıl</button>
<hr />
<h3>• Kurt & Java Klandan Ayrıl</h3>
<hr />
<button onclick="leave();">Ayrıl</button>
<input type="text" maxlength="20" placeholder="Anaktar" id="MyKey1">
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

window.join5 = function() {
  let partyKey = myKey3.value
        Game.currentGame.network.sendRpc({
                name: "JoinPartyByShareKey",
                partyShareKey: partyKey
        })
}

window.join6 = function() {
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

window.leave = function() {
  Game.currentGame.network.sendRpc({
    name: "LeaveParty"
  })
}
    // Açmak Ve Kapatmak İçin Anahtar
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

// Stil
var Style1 = document.querySelectorAll('.hud-map, .hud-resources, .hud-menu-shop, .hud-menu-party, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-party-link, .hud-party-members, .hud-party-grid, .hud-settings-grid, .hud-toolbar-item, .hud-toolbar-building, .hud-menu-icon, .hud-spell-icon, .hud-intro-form, .hud-intro-guide, .hud-intro-name, .hud-intro-server, .hud-party-tag, .hud-party-share, .hud-chat-input');
for (var i = 0; i < Style1.length; i++) {
  Style1[i].style.borderRadius = '1em'; // standard
  Style1[i].style.MozBorderRadius = '1em'; // Mozilla
  Style1[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style1[i].style.color = "#ffffff";
  Style1[i].style.border = "2px solid #080808";
}
// Giriş Ve Seç Stili
var Style2 = document.querySelectorAll('select, input');
for (var i = 0; i < Style2.length; i++) {
  Style2[i].style.borderRadius = '1em'; // standard
  Style2[i].style.MozBorderRadius = '1em'; // Mozilla
  Style2[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style2[i].style.color = "#ffffff";
  Style2[i].style.border = "2px solid #00042e";
  Style2[i].style.backgroundColor = "#080808";
}