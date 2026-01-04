

// ==UserScript==
// @name         </> Apo & Java Raid Mod
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Kaos Team
// @author       ApoReis
// @match        zombs.io
// @match        http://yeni-tc-mod.glitch.me/

// @grant        Kaos Team
// @downloadURL https://update.greasyfork.org/scripts/428519/%3C%3E%20Apo%20%20Java%20Raid%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/428519/%3C%3E%20Apo%20%20Java%20Raid%20Mod.meta.js
// ==/UserScript==

(() => {
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
      case 82:
      heal();
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
.hud-menu-zipp {
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
.hud-menu-zipp h3 {
display: block;
margin: 0;
line-height: 20px;
}
.hud-menu-zipp .hud-zipp-grid {
display: block;
height: 380px;
padding: 10px;
margin-top: 18px;
background: rgba(0, 0, 0, 0.2);
}
.hud-spell-icons .hud-spell-icon[data-type="Zippity"]::before {
background-image: url("https://cdn.discordapp.com/emojis/822554677706096641.png?v=1");
}
.hud-menu-zipp .hud-the-tab {
position: relative;
height: 40px;
line-height: 40px;
margin: 20px;
border: 0px solid rgb(0, 0, 0, 0);
}
.hud-menu-zipp .hud-the-tab {
display: block;
float: left;
padding: 0 14px;
margin: 0 1px 0 0;
font-size: 14px;
background: rgba(0, 0, 0, 0.4);
color: rgba(255, 255, 255, 0.4);
transition: all 0.15s ease-in-out;
}
.hud-menu-zipp .hud-the-tab:hover {
background: rgba(0, 0, 0, 0.2);
color: #eee;
cursor: pointer;
}
::-webkit-scrollbar {
width: 0;
}
.leaderboard {
position: relative;
display: block;
width: 280px;
color: #eee;
font-family: 'Hammersmith One', sans-serif;
text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
pointer-events: none;
z-index: 10;
}

.leaderboard .leaderboard-player {
position: relative;
display: block;
margin: 0 0 8px;
padding: 0 90px 0 40px;
height: 20px;
line-height: 20px;
font-size: 13px;
font-family: 'Open Sans', sans-serif;
}

.leaderboard .leaderboard-player:last-child {
margin-bottom: 0;
}

.leaderboard .leaderboard-player.is-header * {
color: rgba(255, 255, 255, 0.6) !important;
}

.leaderboard .leaderboard-player .pplayer-rank {
position: absolute;
top: 0;
bottom: 0;
left: 0;
color: rgba(255, 255, 255, 0.6);
}

.leaderboard .leaderboard-player .pplayer-name {
display: block;
height: 20px;
line-height: 20px;
}

.leaderboard .leaderboard-player .pplayer-score {
position: absolute;
top: 0;
bottom: 0;
right: 50px;
color: rgba(255, 255, 255, 1);
}

.leaderboard .leaderboard-player .pplayer-wave {
position: absolute;
top: 0;
bottom: 0;
right: 0;
color: rgba(255, 255, 255, 0.7);
}

.leaderboard .hud-leaderboard-player.is-active {
color: rgba(216, 191, 73, 1);
}

.leaderboard .leaderboard-player.is-active .pplayer-score {
color: rgba(216, 191, 73, 1);
}

.leaderboard .leaderboard-player.is-active .pplayer-wave {
color: rgba(216, 191, 73, 0.7);
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
spell.setAttribute("data-type", "Zippity");
spell.classList.add("hud-zipp-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);

//Menu for spell icon
let modHTML = `
<div class="hud-menu-zipp">
<br />
<div class="hud-zipp-grid">
</div>
</div>
`;
document.body.insertAdjacentHTML("afterbegin", modHTML);
let zipz123 = document.getElementsByClassName("hud-menu-zipp")[0];

//Onclick
document.getElementsByClassName("hud-zipp-icon")[0].addEventListener("click", function() {
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
const getElement = ELEMENT => {
    return document.getElementsByClassName(ELEMENT);
}
const getId = ID => {
    return document.getElementById(ID);
}

let entities = Game.currentGame.world.entities;

let css = document.createElement("style");
css.type = "text/css";
css.appendChild(styles);
document.body.appendChild(css);

getElement("hud-intro-youtuber")[0].innerHTML = `
<div id=\"leaderboard\" class=\"leaderboard\">\n
<div class=\"leaderboard-player is-header\">\n
<span class=\"pplayer-rank\">Sıra</span>\n
<span class=\"pplayer-name\">İsim</span>\n
<span class=\"pplayer-score\">Puan</span>\n
<span class=\"pplayer-wave\">Dalga</span>\n
</div>\n
<div class=\"leaderboard-players\"></div>\n
</div>
`;
let grabLb = document.createElement("BUTTON");
grabLb.className = "btn btn-blue";
grabLb.id = "grabLb";
grabLb.style = "width: 100%; height: 50px; margin-top: 3%;";
grabLb.innerHTML = "Liderler Panosu";
getElement("hud-intro-form")[0].insertBefore(grabLb, getElement("hud-intro-error")[0]);
let playerElems = [],
    playerRankElems = [],
    playerNameElems = [],
    playerScoreElems = [],
    playerWaveElems = [],
    playerNames = {},
    leaderboardData = [],
    playersElem = document.querySelector('.leaderboard-players');
const updateLeaderboard = response => {
    var game = Game.currentGame;
    for (let i = 0; i < response.length; i++) {
        var player = response[i];
        let this_ = Game.currentGame.ui.components.Leaderboard;

        if (!(i in playerElems)) {
            playerElems[i] = this_.ui.createElement("<div class=\"leaderboard-player\"></div>");
            playerRankElems[i] = this_.ui.createElement("<span class=\"pplayer-rank\">-</span>");
            playerNameElems[i] = this_.ui.createElement("<strong class=\"pplayer-name\">-</strong>");
            playerScoreElems[i] = this_.ui.createElement("<span class=\"pplayer-score\">-</span>");
            playerWaveElems[i] = this_.ui.createElement("<span class=\"pplayer-wave\">-</span>");
            playerElems[i].appendChild(playerRankElems[i]);
            playerElems[i].appendChild(playerNameElems[i]);
            playerElems[i].appendChild(playerScoreElems[i]);
            playerElems[i].appendChild(playerWaveElems[i]);
            playersElem.appendChild(playerElems[i]);
        }
        playerElems[i].style.display = 'block';
        playerRankElems[i].innerText = '#' + (player.rank + 1);
        playerNameElems[i].innerText = player.name;
        playerScoreElems[i].innerText = player.score.toLocaleString();
        playerWaveElems[i].innerHTML = player.wave === 0 ? '<small>&mdash;</small>' : player.wave.toLocaleString();
    }
    if (response.length < playerElems.length) {
        for (var i = response.length - 1; i < playerElems.length; i++) {
            playerElems[i].style.display = 'none';
        }
    }
}
getId("grabLb").onclick = () => {
    let thiss = getElement("hud-intro-server")[0].value,
        thisServer = Game.currentGame.options.servers[thiss],
        ws = new WebSocket(`ws://${thisServer.hostname}:${thisServer.port}`);
    ws.binaryType = "arraybuffer";
    ws.onopen = () => {
        ws.network = new Game.currentGame.networkType();
        ws.send(ws.network.codec.encode(4, {
            displayName: getElement("hud-intro-name")[0].value
        }))
        ws.onmessage = msg => {
            let data = ws.network.codec.decode(msg.data);
            if (data.name == "Leaderboard") {
                updateLeaderboard(data.response);
                ws.close();
            }
        }
    }
}
let hudserver = getElement("hud-intro-server")[0];
for (let i = 0; i < hudserver.length; i++) {
    if (hudserver.options[i].text.includes("US East")) {
        hudserver.options[i].text = hudserver.options[i].text.replace("US East", "US (E)") + "; Kişi: " + Math.round(Game.currentGame.ui.options.servers[hudserver.options[i].value].population / 3.1);
    }
    if (hudserver.options[i].text.includes("US West")) {
        hudserver.options[i].text = hudserver.options[i].text.replace("US West", "US (W)") + "; Kişi: " + Math.round(Game.currentGame.ui.options.servers[hudserver.options[i].value].population / 3.1);
    }
    if (hudserver.options[i].text.includes("Europe")) {
        hudserver.options[i].text = hudserver.options[i].text.replace("Europe", "Eu") + "; Kişi: " + Math.round(Game.currentGame.ui.options.servers[hudserver.options[i].value].population / 3.1);
    }
    if (hudserver.options[i].text.includes("Asia")) {
        hudserver.options[i].text = hudserver.options[i].text.replace("Asia", "Asia") + "; Kişi: " + Math.round(Game.currentGame.ui.options.servers[hudserver.options[i].value].population / 3.1);
    }
    if (hudserver.options[i].text.includes("Australia")) {
        hudserver.options[i].text = hudserver.options[i].text.replace("Australia", "Aus") + "; Kişi: " + Math.round(Game.currentGame.ui.options.servers[hudserver.options[i].value].population / 3.1);
    }
    if (hudserver.options[i].text.includes("South America")) {
        hudserver.options[i].text = hudserver.options[i].text.replace("South America", "SA") + "; Kişi: " + Math.round(Game.currentGame.ui.options.servers[hudserver.options[i].value].population / 3.1);
    }
}
getElement("hud-zipp-grid")[0].innerHTML += `
<div style="text-align:center"><br>
<hr />
<h3>Raid Mod</h3>
<hr />
<button class=\"btn btn-gold\"style=\" ;width: 45%;\"  id=\"XKeyAR\">Raid &</button>
<button class=\"btn btn-gold\"style=\" ;width: 45%;\" id=\"Bf\">Raid Base &</button>
<button class=\"btn btn-gold\"style=\" ;width: 45%;\" id=\"Sd\">Auto Sword &</button>
<button class=\"btn btn-gold\"style=\" ;width: 45%;\" id=\"Ey\">Upgrade Sword &</button>
<input type="text" maxlength="20" placeholder="" id="myKey1">
<input type="text" maxlength="20" placeholder="" id="myKey2">
`
let XKeyOn = false;
getId("XKeyAR").onclick = () => {
    if (XKeyOn) {
        XKeyOn = false;
        getId("XKeyAR").setAttribute("class", "btn btn-red");
        getId("XKeyAR").textContent = "Raid Mod &Kapalı"
    } else {
        XKeyOn = true;
        getId("XKeyAR").setAttribute("class", "btn btn-blue");
        getId("XKeyAR").textContent = "Raid Mod &Açık"
    }
}

let SdOn = false;
getId("Sd").onclick = () => {
    if (SdOn) {
        SdOn = false;
        getId("Sd").setAttribute("class", "btn btn-red");
        getId("Sd").textContent = "Auto sword &Kapalı"
    } else {
        SdOn = true;
        getId("Sd").setAttribute("class", "btn btn-blue");
        getId("Sd").textContent = "Auto Sword &Açık"
    }
}

let EyOn = false;
getId("Ey").onclick = () => {
    if (EyOn) {
        EyOn = false;
        getId("Ey").setAttribute("class", "btn btn-red");
        getId("Ey").textContent = "Upgrade Sword &Kapalı"
    } else {
        EyOn = true;
        getId("Ey").setAttribute("class", "btn btn-blue");
        getId("Ey").textContent = "Upgrade Sword &Açık"
    }
}

Game.currentGame.ui._events.playerTickUpdate.push(({ health, maxHealth }) => {
    if ((health < (maxHealth / 4 * 3)) && health > 0) {
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
    }
    if (XKeyOn) {
        if (Game.currentGame.ui.playerTick.dead == 1) {
            document.getElementsByClassName("hud-respawn-btn")[0].click();
        }
        if (Game.currentGame.ui.playerTick.weaponName !== "Spear") {
            Game.currentGame.network.sendRpc({
                name: "BuyItem",
                itemName: "Spear",
                tier: 1
            })
            Game.currentGame.network.sendRpc({
                name: "EquipItem",
                itemName: "Spear",
                tier: 1
            })
        }
    }
})
        if (SdOn) {
        if (Game.currentGame.ui.playerTick.dead == 1) {
            document.getElementsByClassName("hud-respawn-btn")[2].click();
        }
        if (Game.currentGame.ui.playerTick.weaponName !== "Bomb") {
            Game.currentGame.network.sendRpc({
                name: "BuyItem",
                itemName: "Bomb",
                tier: 1
            })
            Game.currentGame.network.sendRpc({
                name: "EquipItem",
                itemName: "Bomb",
                tier: 1
            })
        }
};
let TT2Int;
getId("Bf").onmouseup = e => {
    if (TT2Int == undefined) {
        getId("Bf").setAttribute("class", "btn btn-blue");
        getId("Bf").textContent = "Analizli Base Kurucu &Açık"
        TT2Int = setInterval(() => {
            for (let i in entities) {
                if (entities[i].fromTick.model == "GoldStash") {
                    Game.currentGame.network.sendRpc({
                        name: "DeleteBuilding",
                        uid: entities[i].uid
                    })
                }
            }
            document.getElementsByClassName("hud-respawn-btn")[0].click();
            document.getElementsByClassName("hud-respawn-btn")[1].click();
            var mousePosition = Game.currentGame.ui.getMousePosition();
            var world = Game.currentGame.world;
            var worldPos = Game.currentGame.renderer.screenToWorld(mousePosition.x, mousePosition.y);
            var cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, { width: 2, height: 2 });
            var cellSize = world.entityGrid.getCellSize();
            var cellAverages = { x: 0, y: 0 };
            for (var i in cellIndexes) {
                if (!cellIndexes[i]) {
                    return false;
                }
                var cellPos = world.entityGrid.getCellCoords(cellIndexes[i]);
                var isOccupied = Game.currentGame.ui.components.PlacementOverlay.checkIsOccupied(cellIndexes[i], cellPos);
                cellAverages.x += cellPos.x;
                cellAverages.y += cellPos.y;
            }
            cellAverages.x = cellAverages.x / cellIndexes.length;
            cellAverages.y = cellAverages.y / cellIndexes.length;
            var gridPos = {
                x: cellAverages.x * cellSize + cellSize / 2,
                y: cellAverages.y * cellSize + cellSize / 2
            };
            var makeRpc = {
                name: 'MakeBuilding',
                x: gridPos.x,
                y: gridPos.y,
                type: "GoldStash",
                yaw: 0
            };
            Game.currentGame.network.sendRpc(makeRpc);
        }, 0);
    } else {
        clearInterval(TT2Int);
        TT2Int = undefined;
        getId("Bf").setAttribute("class", "btn btn-red");
        getId("Bf").textContent = "Analizli Base Kurucu &Kapalı";
    }
}
}
)();

