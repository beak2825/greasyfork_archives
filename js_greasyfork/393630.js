// ==UserScript==
// @name         Icon-6 (Tower Freeze)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393630/Icon-6%20%28Tower%20Freeze%29.user.js
// @updateURL https://update.greasyfork.org/scripts/393630/Icon-6%20%28Tower%20Freeze%29.meta.js
// ==/UserScript==
/*function keyDownF(e) {
  switch (e.keyCode) {
      case 221:
      join4();
      break;
      case 187:
      document.getElementsByClassName("TFvalidKey")[0].click();
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
.hud-menu-zipp6 {
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
.hud-menu-zipp6 h3 {
display: block;
margin: 0;
line-height: 20px;
}
.hud-menu-zipp6 .hud-zipp-grid6 {
display: block;
height: 380px;
padding: 10px;
margin-top: 18px;
background: rgba(0, 0, 0, 0.2);
}
.hud-spell-icons .hud-spell-icon[data-type="Zippity6"]::before {
background-image: url("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/232/crossed-swords_2694.png");
}
.hud-menu-zipp6 .hud-the-tab {
position: relative;
height: 40px;
line-height: 40px;
margin: 20px;
border: 0px solid rgb(0, 0, 0, 0);
}
.hud-menu-zipp6 .hud-the-tab {
display: block;
float: left;
padding: 0 14px;
margin: 0 1px 0 0;
font-size: 14px;
background: rgba(0, 0, 0, 0.4);
color: rgba(255, 255, 255, 0.4);
transition: all 0.15s ease-in-out;
}
.hud-menu-zipp6 .hud-the-tab:hover {
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
spell.setAttribute("data-type", "Zippity6");
spell.classList.add("hud-zipp6-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);

//Menu for spell icon
let modHTML = `
<div class="hud-menu-zipp6">
<br />
<div class="hud-zipp-grid6">
</div>
</div>
`;
document.body.insertAdjacentHTML("afterbegin", modHTML);
let zipz123 = document.getElementsByClassName("hud-menu-zipp6")[0];

//Onclick
document.getElementsByClassName("hud-zipp6-icon")[0].addEventListener("click", function() {
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

  document.getElementsByClassName("hud-zipp-grid6")[0].innerHTML = `
<div style="text-align:center"><br>
<hr />
<h3>Auto Raid</h3>
<hr />
<button class="TFvalidKey">Valid Key</button>
<input type="text" class="TFe" placeholder="ValidKey=NewShareKey">
<button class="TFbtn">Freeze Towers</button>
<button onclick="join4();">Join...</button>
<br><br>
<button class="TFbtn3">Enable UnKicked From Party!</button>
  `;
$("TFbtn").addEventListener("click", FREEZE);
let TowerFreeze = null;
sds = 175;
let key;
let e2;
$("TFvalidKey").addEventListener("click", function() {
  key = Game.currentGame.ui.playerPartyShareKey
    e2 = $("TFe").value = Game.currentGame.ui.playerPartyShareKey
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
    }, sds);
  } else {
    clearInterval(TowerFreeze);
    TowerFreeze = null;
  }
}


$("TFbtn3").addEventListener("click", FREEZE3);
var TowerFreeze3 = null;
function FREEZE3() {
  if ($("TFbtn3").innerText == "Enable UnKicked From Party!") {
    $("TFbtn3").innerText = "Disable UnKicked From Party!";
  } else {
    $("TFbtn3").innerText = "Enable UnKicked From Party!";
  }
  if (TowerFreeze3 == null) {
    TowerFreeze3 = setInterval(function() {
      Game.currentGame.network.sendRpc({
        name: "JoinPartyByShareKey",
        partyShareKey: key
      });
    }, 25);
  } else {
    clearInterval(TowerFreeze3);
    TowerFreeze3 = null;
  }
}
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

function $(classname) {
    let element = document.getElementsByClassName(classname)
    if (element.length === 1) {
        return element[0]
    } else {
        return element
    }
}