// ==UserScript==
// @name         Raider mod
// @namespace    http://tampermonkey.net/
// @version      1
// @description  spread and finish zombs
// @author       Apex
// @match        *://zombs.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405382/Raider%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/405382/Raider%20mod.meta.js
// ==/UserScript==
const getElement = ELEMENT => {
    return document.getElementsByClassName(ELEMENT);
}
const getId = ID => {
    return document.getElementById(ID);
}

let entities = Game.currentGame.world.entities;
let styles = document.createTextNode(`
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
`);
let css = document.createElement("style");
css.type = "text/css";
css.appendChild(styles);
document.body.appendChild(css);

getElement("hud-intro-youtuber")[0].innerHTML = `
<div id=\"leaderboard\" class=\"leaderboard\">\n
<div class=\"leaderboard-player is-header\">\n
<span class=\"pplayer-rank\">Rank</span>\n
<span class=\"pplayer-name\">Name</span>\n
<span class=\"pplayer-score\">Score</span>\n
<span class=\"pplayer-wave\">Wave</span>\n
</div>\n
<div class=\"leaderboard-players\"></div>\n
</div>
`;
let grabLb = document.createElement("BUTTON");
grabLb.className = "btn btn-green";
grabLb.id = "grabLb";
grabLb.style = "width: 100%; height: 50px; margin-top: 3%;";
grabLb.innerHTML = "Grab Leaderboard";
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
        hudserver.options[i].text = hudserver.options[i].text.replace("US East", "US (E)") + "; Pop: " + Math.round(Game.currentGame.ui.options.servers[hudserver.options[i].value].population / 3.1);
    }
    if (hudserver.options[i].text.includes("US West")) {
        hudserver.options[i].text = hudserver.options[i].text.replace("US West", "US (W)") + "; Pop: " + Math.round(Game.currentGame.ui.options.servers[hudserver.options[i].value].population / 3.1);
    }
    if (hudserver.options[i].text.includes("Europe")) {
        hudserver.options[i].text = hudserver.options[i].text.replace("Europe", "Eu") + "; Pop: " + Math.round(Game.currentGame.ui.options.servers[hudserver.options[i].value].population / 3.1);
    }
    if (hudserver.options[i].text.includes("Asia")) {
        hudserver.options[i].text = hudserver.options[i].text.replace("Asia", "Asia") + "; Pop: " + Math.round(Game.currentGame.ui.options.servers[hudserver.options[i].value].population / 3.1);
    }
    if (hudserver.options[i].text.includes("Australia")) {
        hudserver.options[i].text = hudserver.options[i].text.replace("Australia", "Aus") + "; Pop: " + Math.round(Game.currentGame.ui.options.servers[hudserver.options[i].value].population / 3.1);
    }
    if (hudserver.options[i].text.includes("South America")) {
        hudserver.options[i].text = hudserver.options[i].text.replace("South America", "SA") + "; Pop: " + Math.round(Game.currentGame.ui.options.servers[hudserver.options[i].value].population / 3.1);
    }
}
getElement("hud-settings-grid")[0].innerHTML += "<button class=\"btn btn-green\" id=\"XKeyAR\">X Key On</button>\n<button class=\"btn btn-green\" id=\"Bf\">Base Finder On</button>";
let XKeyOn = false;
getId("XKeyAR").onclick = () => {
    if (XKeyOn) {
        XKeyOn = false;
        getId("XKeyAR").setAttribute("class", "btn btn-green");
        getId("XKeyAR").textContent = "X Key On"
    } else {
        XKeyOn = true;
        getId("XKeyAR").setAttribute("class", "btn btn-red");
        getId("XKeyAR").textContent = "X Key Off"
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
let TT2Int;
getId("Bf").onmouseup = e => {
    if (TT2Int == undefined) {
        getId("Bf").setAttribute("class", "btn btn-red");
        getId("Bf").textContent = "Base Finder Off"
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
        getId("Bf").setAttribute("class", "btn btn-green");
        getId("Bf").textContent = "Base Finder On";
    }
}