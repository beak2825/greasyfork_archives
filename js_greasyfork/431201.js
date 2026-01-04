// ==UserScript==
// @name            deathrain mod LTE **blue**
// @namespace       http://tampermonkey.net/
// @version         2.3
// @description     A large variety of entry level scripts with a couple more advanced ones.
// @author          deathrain
// @match           http://zombs.io/
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/431201/deathrain%20mod%20LTE%20%2A%2Ablue%2A%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/431201/deathrain%20mod%20LTE%20%2A%2Ablue%2A%2A.meta.js
// ==/UserScript==
document.getElementsByClassName("hud-settings-grid")[0].innerHTML =`
<hr><center><font size="+1"><b><u>Auto Builder</u></b></font></center><hr>
<button class="btn btn-aqua" style="width: 48.5%; height: 45px;" onclick="PlusBase();">Old + Base</button>
<button class="btn btn-aqua" style="width: 48.5%; height: 45px;" onclick="CornerBase();">Corner Base</button>
<button class="btn btn-aqua" style="width: 48.5%; height: 45px;" onclick="ThreeEntBase();">3 Ent Base</button>
<button class="btn btn-aqua" style="width: 48.5%; height: 45px;" onclick="ScoreBase();">50m Score Base</button>
<button class="btn btn-aqua" style="width: 48.5%; height: 45px;" onclick="UpdatedPlus();">New + Base</button>
<button class="btn btn-aqua" style="width: 48.5%; height: 45px;" onclick="TwoEnt();">ill add this later, lol</button>
<hr><center><font size="+1"><b><u>Main</u></b></font></center><hr>
<button class="btn btn-aqua" title="Sell Walls" style="width: 12%; height: 45px; margin-right: 0px; margin-left: 0px;" onclick="window.SellTowerByType('Wall');">1</button>
<button class="btn btn-aqua" title="Sell Doors" style="width: 12%; height: 45px; margin-right: 0px; margin-left: 0px;" onclick="SellTowerByType('Door');">2</button>
<button class="btn btn-aqua" title="Sell SlowTraps" style="width: 12%; height: 45px; margin-right: 0px; margin-left: 0px;" onclick="SellTowerByType('SlowTrap');">3</button>
<button class="btn btn-aqua" style="margin-left: 20%; width: 39%; height: 45px;" id="AHRCX">Enable AHRC</button>
<br>
<button class="btn btn-aqua" title="Sell ArrowTowers" style="width: 12%; height: 45px; margin-right: 0px; margin-left: 0px;" onclick="SellTowerByType('ArrowTower');">4</button>
<button class="btn btn-aqua" title="Sell CannonTowers" style="width: 12%; height: 45px; margin-right: 0px; margin-left: 0px;" onclick="SellTowerByType('CannonTower');">5</button>
<button class="btn btn-aqua" title="Sell MeleeTowers" style="width: 12%; height: 45px; margin-right: 0px; margin-left: 0px;" onclick="SellTowerByType('MeleeTower');">6</button>
<button class="btn btn-aqua" style="margin-left: 20%; width: 39%; height: 45px;" onclick="UpgradeSellAll('UpgradeBuilding');">Upgrade All</button>
<br>
<button class="btn btn-aqua" title="Sell BombTowers" style="width: 12%; height: 45px; margin-right: 0px; margin-left: 0px;" onclick="SellTowerByType('BombTower');">7</button>
<button class="btn btn-aqua" title="Sell MageTowers" style="width: 12%; height: 45px; margin-right: 0px; margin-left: 0px;" onclick="SellTowerByType('MagicTower');">8</button>
<button class="btn btn-aqua" title="Sell GoldMines" style="width: 12%; height: 45px; margin-right: 0px; margin-left: 0px;" onclick="SellTowerByType('GoldMine');">9</button>
<button class="btn btn-aqua" style="margin-left: 20%; width: 39%; height: 45px;" onclick="UpgradeSellAll('DeleteBuilding');">Sell All</button>
<br>
<button class="btn btn-aqua" title="Sell Harvesters" style="width: 12%; height: 45px; margin-right: 0px; margin-left: 13%;" onclick="SellTowerByType('Harvester');">0</button>
<button class="btn btn-aqua" style="margin-left: 32.5%; width: 39%; height: 45px;" id="SellPet">Sell Pet</button>
<hr><center><font size="+1"><b><u>Chat Filter</u></b></font></center><hr>
<button class="btn btn-aqua" id="blockName" style="width: 28.5%; height: 45px;">Block</button>
<input type="text" class="btn pink_input" id="nameToBlock" style="outline: none; width: 38%; height: 45px; maxlength=35; margin-right: 3px;" placeholder="Name to Block/Unblock">
<button class="btn btn-aqua" id="unblockName" style="width: 28.5%; height: 45px;">Unblock</button>
<button class="btn btn-aqua" id="hideBlocked" style="width: 28.5%; height: 45px;">Hide Names</button>
<button class="btn btn-aqua" style="width: 38%; height: 45px;" id="chatFilter" filter="all">All</button>
<button class="btn btn-aqua" id="showBlocked" style="width: 28.5%; height: 45px;">Show Names</button>
<div style="margin-top: 1%;" id="blockNamesList"></div>`

document.getElementsByClassName("hud-intro-form")[0].setAttribute("style", "margin-bottom: 12.75px; width: auto; height: auto; padding: 25px;");
document.getElementsByClassName("hud-menu-party")[0].setAttribute("style", "width: 610px; height: 465px;");
document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 49);
document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);
document.getElementsByClassName("hud-intro-play")[0].classList.add("btn-aqua");
document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[1].innerHTML = `<h1>ZOMBS.IO<h1>`;
document.getElementsByClassName("hud-intro-footer")[0].innerHTML = `<h3><font size="36">deathrain LTE</font></h3>`;
document.getElementsByClassName("hud-intro-youtuber")[0].innerHTML = `<h3>Featured YouTuber:</h3><a href="https://www.youtube.com/channel/UC4Wl5kskE-fXku2pynDEjXQ" target="_blank">deathrain</a>`;
document.querySelectorAll('.ad-unit, .hud-intro-left, .hud-intro-guide, .hud-intro-form > label, .hud-intro-stone, .hud-intro-tree, .hud-intro-corner-bottom-left, .hud-intro-corner-bottom-right').forEach(el => el.remove());

let change = document.createElement("BUTTON");
change.className = "btn btn-aqua";
change.id = "change";
change.style = "width: 100%; height: 50px; margin-top: 3%;";
change.innerHTML = "Changelog";
document.getElementsByClassName("hud-intro-form")[0].insertBefore(change, document.getElementsByClassName("hud-intro-error")[0]);
document.getElementById("change").onclick = () => {
    window.open('https://zombs-info.glitch.me/changelog.html');
}

var entities = Game.currentGame.world.entities;
var Style2 = document.querySelectorAll('.hud-map, .hud-party-link, .hud-menu-party, .hud-resources, .hud-menu, .hud-menu-icon, .hud-intro-left, .hud-menu-shop, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-settings-grid, .hud-party-grid, .hud-party-members, .hud-toolbar-item, .hud-toolbar-building, .hud-menu-icon, .hud-spell-icon, .hud-intro-form, .hud-intro-guide, .hud-intro-name, .hud-intro-server, .hud-chat-input');
for (let i = 0; i < Style2.length; i++) {
    Style2[i].style.borderRadius = '5px'; // standard
    Style2[i].style.MozBorderRadius = '5px'; // Mozilla
    Style2[i].style.WebkitBorderRadius = '5px'; // WebKitww
    Style2[i].style.border = "3px solid #10deb4";
    Style2[i].style.outline = "none";
}

let style = document.createTextNode(`
.hud-intro::before {
    background-image: url('https://purposefulrenegade.files.wordpress.com/2019/06/billy-williams-262740-unsplash.jpg');
    background-size: cover;
}
.hud-menu-shop {
    width: 625px;
    height: 465px;
    margin: -270px 0 0 -312.5px;
    padding: 20px;
}
::-webkit-scrollbar-track {
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	border-radius: 5px;
	background-color: #aeebdf;
}
::-webkit-scrollbar {
	width: 12px;
    height: 0px;
    border-radius: 5px;
	background-color: #aeebdf;
}
::-webkit-scrollbar-thumb {
	border-radius: 5px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background: linear-gradient(to bottom right, #00f0bf, #009174 80%);
}
.btn-aqua {
    background: linear-gradient(to top right, #00f0bf, #009174 80%);
    color: white;
    border-radius: 5px;
    margin: 0px 2.5px 5px 0px;
    font-size: 18px;
    outline: none;
    text-shadow: 1px 1px 1px #black;
}
.btn-aqua:hover {
    background: linear-gradient(to top right, #00f0bf, #009174 100%);
}`);
let styles = document.createElement("style");
styles.type = "text/css";
styles.appendChild(style);
document.body.appendChild(styles);

const request = new XMLHttpRequest();
request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[3].innerHTML = `People in game: ${JSON.parse(request.responseText).players}/${JSON.parse(request.responseText).capacity} [${(JSON.parse(request.responseText).players / JSON.parse(request.responseText).capacity * 100).toFixed(2)}%]`;
    }
};
request.open("GET", "http://zombs.io/capacity", true);
request.send();

document.getElementsByClassName("hud-party-actions")[0].insertAdjacentHTML("afterend", `
<div class="partydiv" style="text-align: center">
  <button class="btn btn-aqua" style="width: 28.3%; margin-top: 3px; margin-right: 3%;" onclick="Game.currentGame.network.sendRpc({name: 'LeaveParty'});">Leave</button>
  <input type="text" maxlength="20" placeholder="Party Key Here . . ." id="myKey" style="outline: none; width: 42.5%; height: 40px; margin-top: 3px; margin-right: 3%;" class="btn pink_input">
  <button class="btn btn-aqua" style="width: 21%; margin-top: 3px;" onclick="Game.currentGame.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: myKey.value});">Join</button>
</div>`);

window.addEventListener("keydown", e => {
    switch (e.keyCode) {
        case 187:
            Game.currentGame.network.sendRpc({name: "BuyItem", itemName: "Crossbow", tier: 1});
            Game.currentGame.network.sendRpc({name: "EquipItem", itemName: "Crossbow", tier: 1});
            break;
        case 27:
            if (document.getElementsByClassName("hud")[0].style.display === "none") {
                document.getElementsByClassName("hud")[0].style.display = "block";
            } else {
                document.getElementsByClassName("hud")[0].style.display = "none";
            }
            break;
    }
})

window.SellTowerByType = function(tower) {
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == tower) {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}

document.getElementById("SellPet").onclick = () => {
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (entities[uid].fromTick.model == "PetCARL" || entities[uid].fromTick.model == "PetMiner") {
            Game.currentGame.network.sendRpc({name: "DeleteBuilding", uid: obj.fromTick.uid})
        }
    }
}

window.UpgradeSellAll = function(UpgradeSellAll) {
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model !== "GoldStash") {
            Game.currentGame.network.sendRpc({name: UpgradeSellAll, uid: obj.fromTick.uid});
        }
    }
}

var AHRC = document.getElementById("AHRCX");
AHRC.addEventListener("click", startAHRC);
AHRC.addEventListener("click", stopAHRC);
var AHRCX = null;
function startAHRC() {
    clearInterval(AHRCX);
    if (AHRCX !== null) {
        AHRCX = null;
    } else {
        AHRCX = setInterval(function() {
            for(var uid in entities) {
                var obj = entities[uid];
                if(obj.fromTick.model == "Harvester") {
                    Game.currentGame.network.sendRpc({
                        name: "AddDepositToHarvester",
                        uid: obj.fromTick.uid,
                        deposit: 500
                    });
                    Game.currentGame.network.sendRpc({
                        name: "CollectHarvester",
                        uid: obj.fromTick.uid
                    });
                }
            }
        }, 20);
    }
}
function stopAHRC() {
    var trade = document.getElementById("AHRCX");
    if (trade.innerHTML == "Enable AHRC") {
        trade.innerHTML = "Disable AHRC";
        trade.className = "btn btn-aqua";
    } else {
        trade.innerHTML = "Enable AHRC";
        trade.className = "btn btn-aqua";
    }
}

Game.currentGame.ui._events.playerPetTickUpdate.push(({health, maxHealth}) => {
    if ((health < (maxHealth/2)) && (health > 0)) {
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
})

Game.currentGame.ui._events.playerTickUpdate.push(({health, maxHealth}) => {
    if ((health < (maxHealth/2)) && (health > 0)) {
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
})

function DayCycleFunctions() {
    if (Game.currentGame.ui.playerPetTick && Game.currentGame.ui.playerPetTick.tier < 8) {
        for (let i = 0; i < document.getElementsByClassName("hud-shop-actions-evolve").length; i++) {
            document.getElementsByClassName("hud-shop-actions-evolve")[i].click();
        }
    }
    if(Game.currentGame.ui.inventory.ZombieShield) {
        if (Game.currentGame.ui.playerTick.zombieShieldHealth < 85000) {
            Game.currentGame.network.sendRpc({name: "EquipItem", itemName: "ZombieShield", tier:  Game.currentGame.ui.inventory.ZombieShield.tier});
        }
    }
}
Game.currentGame.network.addRpcHandler("DayCycle", DayCycleFunctions);

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
    renderer.viewport.width = renderer.renderer.width / renderer.scale + 2 * renderer.viewportPadding;
    renderer.viewport.height = renderer.renderer.height / renderer.scale + 2 * renderer.viewportPadding;
}

onWindowResize();
window.onresize = onWindowResize;
window.onwheel = e => {
    if (e.deltaY > 0) {
        dimension = Math.min(1.35, dimension + 0.1);
        onWindowResize();
    } else if (e.deltaY < 0) {
        dimension = Math.max(0.1, dimension - 0.1);
        onWindowResize();
    }
}

if (localStorage.getItem("blockedNames") == null) {
    localStorage.setItem("blockedNames", "[]");
}
let filterButton = document.getElementById("chatFilter");
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
            filterButton.setAttribute("class", "btn btn-aqua");
            filterButton.textContent = "All";
            break;
        case "party":
            filterButton.setAttribute("class", "btn btn-aqua");
            filterButton.textContent = "Party";
            break;
        case "none":
            filterButton.setAttribute("class", "btn btn-aqua");
            filterButton.textContent = "None";
            break;
    }
}

let blocked = JSON.parse(localStorage.getItem("blockedNames"));
document.getElementById("blockName").onclick = () => {
    if (blocked.includes(document.getElementById("nameToBlock").value)) return;
    blocked.push(document.getElementById("nameToBlock").value);
    localStorage.setItem("blockedNames", JSON.stringify(blocked));
}

document.getElementById("unblockName").onclick = () => {
    if (blocked.indexOf(document.getElementById("nameToBlock").value) == -1) return;
    blocked.splice(blocked.indexOf(document.getElementById("nameToBlock").value), 1);
    localStorage.setItem("blockedNames", JSON.stringify(blocked));
}

document.getElementById("showBlocked").onclick = () => {
    document.getElementById("blockNamesList").innerHTML = `<h3> ${blocked.join(", ")} </h3>`;
}

document.getElementById("hideBlocked").onclick = () => {
    document.getElementById("blockNamesList").innerHTML = "";
}

Game.currentGame.network.emitter.removeListener("PACKET_RPC", Game.currentGame.network.emitter._events.PACKET_RPC[1]);
let onMessageReceived = (msg => {
    switch (filterButton.getAttribute("filter")) {
        case "party": {
            let uids = [];
            for (let member of Game.currentGame.ui.playerPartyMembers) {
                uids.push(member.playerUid);
            }
            if (!uids.includes(msg.uid)) return;
        }
            break;
        case "none":
            return;
            break;
    }
    let a = Game.currentGame.ui.getComponent("Chat"),
        b = msg.displayName.replace(/<(?:.|\n)*?>/gm, ''),
        c = msg.message.replace(/<(?:.|\n)*?>/gm, ''),
        d = a.ui.createElement(`<div class="hud-chat-message"><strong>${b}</strong>: ${c}</div>`);
    if (JSON.parse(localStorage.getItem("blockedNames")).includes(b)) return;
    a.messagesElem.appendChild(d);
    a.messagesElem.scrollTop = a.messagesElem.scrollHeight;
})
Game.currentGame.network.addRpcHandler("ReceiveChatMessage", onMessageReceived);

function getGoldStash() {
    var entities = Game.currentGame.world.entities
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue
        var obj = entities[uid]
        if (obj.fromTick.model == "GoldStash") {
            return obj
        }
    }
}

function deathrain(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}

window.PlusBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = getGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.fromTick.position.x,
                y: stash.fromTick.position.y
            }
            clearInterval(waitForGoldStash)
            deathrain(stashPosition.x + 0, stashPosition.y + -96, 'Harvester', 0);
            deathrain(stashPosition.x + 0, stashPosition.y + -192, 'Harvester', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 0, 'Harvester', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 0, 'Harvester', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 0, 'Harvester', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 0, 'Harvester', 0);
            deathrain(stashPosition.x + 0, stashPosition.y + 96, 'Harvester', 0);
            deathrain(stashPosition.x + 0, stashPosition.y + 192, 'Harvester', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 240, 'BombTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 240, 'BombTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + 336, 'BombTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 432, 'BombTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 192, 'GoldMine', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 96, 'GoldMine', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -96, 'GoldMine', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -144, 'GoldMine', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + -192, 'GoldMine', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -96, 'GoldMine', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 96, 'GoldMine', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 144, 'GoldMine', 0);
            deathrain(stashPosition.x + -120, stashPosition.y + 72, 'Door', 0);
            deathrain(stashPosition.x + -72, stashPosition.y + -120, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + -72, 'Door', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + 120, 'Door', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + 72, 'SlowTrap', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -72, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -72, stashPosition.y + 72, 'SlowTrap', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 384, 'BombTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -192, 'BombTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -240, 'BombTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -48, 'BombTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + -144, 'BombTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -240, 'BombTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -96, 'BombTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -288, 'BombTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -288, 'BombTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -384, 'BombTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 48, 'ArrowTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + 144, 'ArrowTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 240, 'ArrowTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 432, 'ArrowTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 288, 'ArrowTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 48, 'CannonTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + 144, 'CannonTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 240, 'CannonTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + 336, 'MagicTower', 0);
            deathrain(stashPosition.x + -576, stashPosition.y + 240, 'MagicTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + 144, 'MagicTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 48, 'MagicTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 384, 'CannonTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 480, 'CannonTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 528, 'CannonTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 432, 'CannonTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 432, 'MagicTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 384, 'MagicTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 480, 'MagicTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 432, 'CannonTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 528, 'CannonTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 480, 'CannonTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 576, 'MagicTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 432, 'MagicTower', 0);
            deathrain(stashPosition.x + 528, stashPosition.y + 288, 'CannonTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 192, 'ArrowTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 96, 'ArrowTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + 96, 'CannonTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + 96, 'MagicTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 192, 'MagicTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -48, 'ArrowTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -48, 'MagicTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + -144, 'CannonTower', 0);
            deathrain(stashPosition.x + 528, stashPosition.y + -144, 'CannonTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -240, 'ArrowTower', 0);
            deathrain(stashPosition.x + 576, stashPosition.y + -240, 'MagicTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -96, 'MagicTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + -192, 'MagicTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + -288, 'MagicTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + -384, 'MagicTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + -192, 'CannonTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -96, 'CannonTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -288, 'CannonTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -384, 'CannonTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -480, 'ArrowTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -432, 'ArrowTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -576, 'CannonTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -480, 'CannonTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -480, 'MagicTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -336, 'ArrowTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -384, 'ArrowTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -432, 'MagicTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -480, 'MagicTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -384, 'CannonTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + -552, 'Wall', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + -552, 'Wall', 0);
            deathrain(stashPosition.x + -504, stashPosition.y + -504, 'Wall', 0);
            deathrain(stashPosition.x + -504, stashPosition.y + -456, 'Wall', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -336, 'BombTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -336, 'BombTower', 0);
            deathrain(stashPosition.x + 576, stashPosition.y + -336, 'ArrowTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -432, 'ArrowTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -288, 'ArrowTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + -192, 'ArrowTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + -192, 'BombTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -336, 'CannonTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -240, 'ArrowTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -288, 'ArrowTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -336, 'ArrowTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -432, 'ArrowTower', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + -360, 'Wall', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + -360, 'Wall', 0);
            deathrain(stashPosition.x + -168, stashPosition.y + -264, 'Wall', 0);
            deathrain(stashPosition.x + -120, stashPosition.y + -264, 'Wall', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + -504, 'Wall', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -408, 'Wall', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + -312, 'Wall', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + -264, 'Wall', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + -168, 'Wall', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + -120, 'Wall', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + 264, 'Wall', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + 264, 'Wall', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 120, 'Wall', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 168, 'Wall', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 312, 'Wall', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 360, 'Wall', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 504, 'Wall', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 504, 'Wall', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 504, 'Wall', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 552, 'Wall', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 552, 'Wall', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 600, 'Wall', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 600, 'Wall', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 264, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 312, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 360, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 408, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 456, 'SlowTrap', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -456, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -408, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -360, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -312, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -264, 'SlowTrap', 0);
            clearInterval(waitForGoldStash)
        }
    }, 100)
    }

window.CornerBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = getGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.fromTick.position.x,
                y: stash.fromTick.position.y
            }
            clearInterval(waitForGoldStash)
            deathrain(stashPosition.x + 0, stashPosition.y + 96, 'BombTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 96, 'BombTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 0, 'BombTower', 0);
            deathrain(stashPosition.x + 0, stashPosition.y + 192, 'ArrowTower', 0);
            deathrain(stashPosition.x + 0, stashPosition.y + 288, 'ArrowTower', 0);
            deathrain(stashPosition.x + 0, stashPosition.y + 384, 'ArrowTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 240, 'ArrowTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 432, 'ArrowTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 0, 'ArrowTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 0, 'ArrowTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 0, 'ArrowTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 96, 'ArrowTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + 96, 'ArrowTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + 96, 'ArrowTower', 0);
            deathrain(stashPosition.x + 0, stashPosition.y + 480, 'CannonTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 0, 'CannonTower', 0);
            deathrain(stashPosition.x + 528, stashPosition.y + 96, 'CannonTower', 0);
            deathrain(stashPosition.x + 576, stashPosition.y + 192, 'CannonTower', 0);
            deathrain(stashPosition.x + 672, stashPosition.y + 192, 'CannonTower', 0);
            deathrain(stashPosition.x + 768, stashPosition.y + 192, 'CannonTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 576, 'CannonTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 672, 'CannonTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 528, 'CannonTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 768, 'CannonTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 720, 'CannonTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 528, 'CannonTower', 0);
            deathrain(stashPosition.x + 720, stashPosition.y + 288, 'CannonTower', 0);
            deathrain(stashPosition.x + 528, stashPosition.y + 288, 'CannonTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 624, 'ArrowTower', 0);
            deathrain(stashPosition.x + 624, stashPosition.y + 288, 'ArrowTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 480, 'CannonTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 384, 'CannonTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 480, 'CannonTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 576, 'CannonTower', 0);
            deathrain(stashPosition.x + 576, stashPosition.y + 384, 'CannonTower', 0);
            deathrain(stashPosition.x + 576, stashPosition.y + 480, 'CannonTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 576, 'CannonTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 672, 'MagicTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 672, 'MagicTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 768, 'MagicTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 816, 'MagicTower', 0);
            deathrain(stashPosition.x + 672, stashPosition.y + 480, 'MagicTower', 0);
            deathrain(stashPosition.x + 672, stashPosition.y + 384, 'MagicTower', 0);
            deathrain(stashPosition.x + 768, stashPosition.y + 384, 'MagicTower', 0);
            deathrain(stashPosition.x + 816, stashPosition.y + 288, 'MagicTower', 0);
            deathrain(stashPosition.x + 576, stashPosition.y + 0, 'MagicTower', 0);
            deathrain(stashPosition.x + 624, stashPosition.y + 96, 'MagicTower', 0);
            deathrain(stashPosition.x + 672, stashPosition.y + 0, 'MagicTower', 0);
            deathrain(stashPosition.x + 720, stashPosition.y + 96, 'MagicTower', 0);
            deathrain(stashPosition.x + 0, stashPosition.y + 576, 'MagicTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 624, 'MagicTower', 0);
            deathrain(stashPosition.x + 0, stashPosition.y + 672, 'MagicTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 720, 'MagicTower', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + 792, 'SlowTrap', 0);
            deathrain(stashPosition.x + 792, stashPosition.y + 120, 'SlowTrap', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + 648, 'Door', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 480, 'BombTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 384, 'BombTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 192, 'GoldMine', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 288, 'GoldMine', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 384, 'GoldMine', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 192, 'GoldMine', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 192, 'GoldMine', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 288, 'GoldMine', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 288, 'GoldMine', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 384, 'GoldMine', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + 456, 'Wall', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 456, 'Wall', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 312, 'Wall', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 264, 'Wall', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + 72, 'Wall', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + 168, 'Wall', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + 168, 'Wall', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + 120, 'Wall', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 96, 'Harvester', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 0, 'Harvester', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + -96, 'Harvester', 0);
            deathrain(stashPosition.x + 0, stashPosition.y + -96, 'Harvester', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -96, 'Harvester', 0);
            clearInterval(waitForGoldStash)
        }
    }, 100)
    }

window.ThreeEntBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = getGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.fromTick.position.x,
                y: stash.fromTick.position.y
            }
            clearInterval(waitForGoldStash)
            deathrain(stashPosition.x + -96, stashPosition.y + 0, 'CannonTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 0, 'CannonTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + 96, 'CannonTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + 96, 'CannonTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 0, 'MagicTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + 96, 'MagicTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 192, 'CannonTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 192, 'ArrowTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 240, 'ArrowTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 288, 'ArrowTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 288, 'ArrowTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 384, 'ArrowTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 384, 'ArrowTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 192, 'ArrowTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 432, 'MagicTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 336, 'MagicTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 480, 'MagicTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 480, 'MagicTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 432, 'MagicTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 384, 'MagicTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 384, 'MagicTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 432, 'MagicTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 240, 'ArrowTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 192, 'ArrowTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 336, 'CannonTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 288, 'CannonTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 288, 'CannonTower', 0);
            deathrain(stashPosition.x + -168, stashPosition.y + 168, 'Wall', 0);
            deathrain(stashPosition.x + -216, stashPosition.y + 168, 'Wall', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 144, 'GoldMine', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 240, 'GoldMine', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + 240, 'GoldMine', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 144, 'ArrowTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 48, 'ArrowTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + 144, 'CannonTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 48, 'CannonTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 48, 'MagicTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + 144, 'MagicTower', 0);
            deathrain(stashPosition.x + 528, stashPosition.y + 240, 'MagicTower', 0);
            deathrain(stashPosition.x + 576, stashPosition.y + 336, 'MagicTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + 240, 'ArrowTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 384, 'ArrowTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 432, 'ArrowTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 480, 'MagicTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 528, 'MagicTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 528, 'GoldMine', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 432, 'GoldMine', 0);
            deathrain(stashPosition.x + 576, stashPosition.y + 432, 'GoldMine', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -96, 'ArrowTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + -192, 'ArrowTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -96, 'CannonTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + -192, 'CannonTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -96, 'MagicTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + -192, 'MagicTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -288, 'ArrowTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + -144, 'MagicTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -240, 'CannonTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + -336, 'CannonTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + 0, stashPosition.y + -336, 'CannonTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + -336, 'CannonTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -240, 'CannonTower', 0);
            deathrain(stashPosition.x + 0, stashPosition.y + -144, 'ArrowTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -336, 'ArrowTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -384, 'GoldMine', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + -144, 'CannonTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -240, 'CannonTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + -144, 'CannonTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + -240, 'GoldMine', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -72, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -120, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -168, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -216, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 168, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 216, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 264, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 312, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 360, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 408, 'SlowTrap', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 312, 'Door', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + 312, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + 312, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 648, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 648, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 648, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 696, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 216, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 264, 'Door', 0);
            deathrain(stashPosition.x + -504, stashPosition.y + 264, 'Door', 0);
            deathrain(stashPosition.x + -552, stashPosition.y + 312, 'Door', 0);
            deathrain(stashPosition.x + -552, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + -552, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + -552, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + -216, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -504, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + -312, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + -360, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + -408, 'Door', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + -360, 'Door', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + -312, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + -312, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -312, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -360, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + -600, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + -600, 'Door', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + -600, 'Door', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -600, 'Door', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + -600, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + -552, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + -504, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + -456, 'Door', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + -456, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + -456, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -408, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + -120, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + -168, 'Door', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + -168, 'Door', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + -168, 'Door', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + -120, 'Door', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -72, 'Door', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + 24, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + 24, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + 72, 'Door', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + 72, 'Door', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + 72, 'Door', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + 120, 'Door', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + 120, 'Door', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -48, 'Harvester', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + 96, 'Harvester', 0);
            clearInterval(waitForGoldStash)
        }
    }, 100)
    }

window.ScoreBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = getGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.fromTick.position.x,
                y: stash.fromTick.position.y
            }
            clearInterval(waitForGoldStash)
            deathrain(stashPosition.x + -96, stashPosition.y + 48, 'ArrowTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 144, 'ArrowTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 48, 'ArrowTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 144, 'ArrowTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 96, 'BombTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 144, 'BombTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 240, 'BombTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 96, 'BombTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 144, 'BombTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 240, 'BombTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 384, 'BombTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 336, 'BombTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 432, 'BombTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 480, 'BombTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 384, 'BombTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 336, 'BombTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 240, 'BombTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 480, 'BombTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 432, 'BombTower', 0);
            deathrain(stashPosition.x + 576, stashPosition.y + 384, 'BombTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 240, 'BombTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 240, 'BombTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 336, 'CannonTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 288, 'CannonTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 336, 'CannonTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 384, 'CannonTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 432, 'CannonTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 288, 'CannonTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 336, 'CannonTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 336, 'CannonTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 384, 'CannonTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 432, 'CannonTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 240, 'CannonTower', 0);
            deathrain(stashPosition.x + -576, stashPosition.y + 480, 'CannonTower', 0);
            deathrain(stashPosition.x + -576, stashPosition.y + 384, 'CannonTower', 0);
            deathrain(stashPosition.x + -576, stashPosition.y + 288, 'CannonTower', 0);
            deathrain(stashPosition.x + -576, stashPosition.y + 192, 'CannonTower', 0);
            deathrain(stashPosition.x + -672, stashPosition.y + 240, 'CannonTower', 0);
            deathrain(stashPosition.x + -672, stashPosition.y + 336, 'CannonTower', 0);
            deathrain(stashPosition.x + -672, stashPosition.y + 432, 'CannonTower', 0);
            deathrain(stashPosition.x + -672, stashPosition.y + 528, 'CannonTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 144, 'CannonTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 96, 'CannonTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 144, 'CannonTower', 0);
            deathrain(stashPosition.x + 576, stashPosition.y + 192, 'CannonTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 96, 'ArrowTower', 0);
            deathrain(stashPosition.x + 576, stashPosition.y + 288, 'MagicTower', 0);
            deathrain(stashPosition.x + 672, stashPosition.y + 240, 'MagicTower', 0);
            deathrain(stashPosition.x + 672, stashPosition.y + 336, 'MagicTower', 0);
            deathrain(stashPosition.x + 672, stashPosition.y + 432, 'CannonTower', 0);
            deathrain(stashPosition.x + 576, stashPosition.y + 480, 'MagicTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 528, 'MagicTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 576, 'MagicTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 528, 'MagicTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 480, 'MagicTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 432, 'MagicTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 432, 'MagicTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 480, 'MagicTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 528, 'MagicTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 576, 'MagicTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 624, 'MagicTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 528, 'ArrowTower', 0);
            deathrain(stashPosition.x + -576, stashPosition.y + 576, 'MagicTower', 0);
            deathrain(stashPosition.x + -768, stashPosition.y + 288, 'MagicTower', 0);
            deathrain(stashPosition.x + -768, stashPosition.y + 384, 'MagicTower', 0);
            deathrain(stashPosition.x + -744, stashPosition.y + 456, 'Wall', 0);
            deathrain(stashPosition.x + -744, stashPosition.y + 504, 'Wall', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + 504, 'Wall', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + 552, 'Wall', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 600, 'Wall', 0);
            deathrain(stashPosition.x + 744, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 744, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 744, stashPosition.y + 312, 'Door', 0);
            deathrain(stashPosition.x + 744, stashPosition.y + 264, 'Door', 0);
            deathrain(stashPosition.x + -216, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 648, 'Door', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 696, 'Door', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 744, 'Door', 0);
            deathrain(stashPosition.x + -648, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + -600, stashPosition.y + 648, 'Door', 0);
            deathrain(stashPosition.x + -552, stashPosition.y + 696, 'Door', 0);
            deathrain(stashPosition.x + -504, stashPosition.y + 744, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 744, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 696, 'Door', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 696, 'Door', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 648, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 648, 'Door', 0);
            deathrain(stashPosition.x + -504, stashPosition.y + 696, 'Door', 0);
            deathrain(stashPosition.x + -552, stashPosition.y + 648, 'Door', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + 456, 'Wall', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + 408, 'Wall', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 456, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 408, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 360, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 312, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 264, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 216, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 168, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 120, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 72, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + 72, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + 120, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + 168, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + 216, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + 264, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + 312, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + 360, 'SlowTrap', 0);
            deathrain(stashPosition.x + -72, stashPosition.y + 504, 'SlowTrap', 0);
            deathrain(stashPosition.x + -120, stashPosition.y + 504, 'SlowTrap', 0);
            deathrain(stashPosition.x + -120, stashPosition.y + 552, 'SlowTrap', 0);
            deathrain(stashPosition.x + -168, stashPosition.y + 552, 'SlowTrap', 0);
            deathrain(stashPosition.x + -168, stashPosition.y + 600, 'SlowTrap', 0);
            deathrain(stashPosition.x + -216, stashPosition.y + 600, 'SlowTrap', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 744, 'SlowTrap', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 648, 'SlowTrap', 0);
            deathrain(stashPosition.x + -216, stashPosition.y + 648, 'SlowTrap', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 696, 'SlowTrap', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 696, 'SlowTrap', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + -48, 'Harvester', 0);
            deathrain(stashPosition.x + 0, stashPosition.y + -96, 'Harvester', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -48, 'Harvester', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + -144, 'Harvester', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -144, 'Harvester', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 0, 'Harvester', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + 0, 'Harvester', 0);
            clearInterval(waitForGoldStash)
        }
    }, 100)
    }

window.UpdatedPlus = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = getGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.fromTick.position.x,
                y: stash.fromTick.position.y
            }
            clearInterval(waitForGoldStash)
            deathrain(stashPosition.x + -144, stashPosition.y + -96, 'GoldMine', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + -192, 'GoldMine', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -96, 'GoldMine', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 192, 'GoldMine', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 144, 'GoldMine', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 96, 'GoldMine', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -144, 'GoldMine', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 96, 'GoldMine', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -48, 'ArrowTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -48, 'ArrowTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + -144, 'ArrowTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -288, 'ArrowTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 288, 'ArrowTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 384, 'ArrowTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -96, 'ArrowTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + -192, 'ArrowTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 48, 'ArrowTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 240, 'ArrowTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + 432, 'ArrowTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + 96, 'CannonTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 192, 'CannonTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 432, 'CannonTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 480, 'ArrowTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + 288, 'ArrowTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 384, 'ArrowTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -288, 'ArrowTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -336, 'CannonTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -384, 'CannonTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -384, 'CannonTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -480, 'CannonTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -528, 'CannonTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -336, 'CannonTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -384, 'CannonTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -528, 'CannonTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -576, 'CannonTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -336, 'CannonTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 48, 'CannonTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + 144, 'CannonTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + 144, 'CannonTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 240, 'CannonTower', 0);
            deathrain(stashPosition.x + -576, stashPosition.y + 336, 'CannonTower', 0);
            deathrain(stashPosition.x + -624, stashPosition.y + 432, 'CannonTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -96, 'CannonTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + -192, 'CannonTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -288, 'ArrowTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + -288, 'ArrowTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -384, 'ArrowTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -432, 'ArrowTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -480, 'ArrowTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -48, 'MagicTower', 0);
            deathrain(stashPosition.x + 528, stashPosition.y + -144, 'MagicTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + 96, 'MagicTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 192, 'MagicTower', 0);
            deathrain(stashPosition.x + 528, stashPosition.y + 288, 'MagicTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 480, 'MagicTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 432, 'MagicTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 480, 'MagicTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 528, 'MagicTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 576, 'MagicTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 480, 'ArrowTower', 0);
            deathrain(stashPosition.x + 576, stashPosition.y + -336, 'ArrowTower', 0);
            deathrain(stashPosition.x + -672, stashPosition.y + 336, 'MagicTower', 0);
            deathrain(stashPosition.x + -576, stashPosition.y + 240, 'MagicTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + 144, 'MagicTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 48, 'MagicTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -96, 'MagicTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + -192, 'MagicTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + -384, 'MagicTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -480, 'MagicTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -576, 'MagicTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -432, 'MagicTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -480, 'MagicTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -624, 'MagicTower', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + 648, 'Wall', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 648, 'Wall', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 600, 'Wall', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 600, 'Wall', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 552, 'Wall', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + 360, 'Wall', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + 360, 'Wall', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + 312, 'Wall', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + 408, 'Wall', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + 456, 'Wall', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -648, stashPosition.y + 264, 'Wall', 0);
            deathrain(stashPosition.x + -744, stashPosition.y + 360, 'Wall', 0);
            deathrain(stashPosition.x + -696, stashPosition.y + 408, 'Wall', 0);
            deathrain(stashPosition.x + -600, stashPosition.y + 504, 'Wall', 0);
            deathrain(stashPosition.x + -504, stashPosition.y + 552, 'Wall', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 600, 'Wall', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -504, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -552, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + -216, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 648, 'Door', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 648, 'Door', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + -600, stashPosition.y + -312, 'Wall', 0);
            deathrain(stashPosition.x + -600, stashPosition.y + -360, 'Wall', 0);
            deathrain(stashPosition.x + -504, stashPosition.y + -456, 'Wall', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + -552, 'Wall', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -288, 'BombTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -288, 'BombTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + -192, 'BombTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -480, 'BombTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -336, 'BombTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -240, 'BombTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -192, 'BombTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -240, 'BombTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -384, 'BombTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 240, 'BombTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 240, 'BombTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 336, 'BombTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 336, 'BombTower', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 168, 'Wall', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 120, 'Wall', 0);
            deathrain(stashPosition.x + -168, stashPosition.y + -264, 'Wall', 0);
            deathrain(stashPosition.x + -120, stashPosition.y + -264, 'Wall', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + -360, 'Wall', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + -360, 'Wall', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 96, 'BombTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 384, 'BombTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -144, 'BombTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + 384, 'BombTower', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + 360, 'Wall', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + 360, 'Wall', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -120, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -168, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + -312, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + -312, 'Door', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + -312, 'Door', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + -360, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + -600, 'Wall', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + -696, 'Wall', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + -648, 'Wall', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + -648, 'Wall', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -600, 'Wall', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -552, 'Wall', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + -504, 'Door', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + -456, 'Door', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + -408, 'Door', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + -408, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -408, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -456, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -504, 'Door', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + -456, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 264, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 312, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 360, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 408, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 456, 'SlowTrap', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -456, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -360, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -312, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -264, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -408, 'SlowTrap', 0);
            deathrain(stashPosition.x + -72, stashPosition.y + 72, 'SlowTrap', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + 72, 'SlowTrap', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -72, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -72, stashPosition.y + -120, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + -72, 'Door', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + 120, 'Door', 0);
            deathrain(stashPosition.x + -120, stashPosition.y + 72, 'Door', 0);
            clearInterval(waitForGoldStash)
        }
    }, 100)
    }

window.TwoEnt = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = getGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.fromTick.position.x,
                y: stash.fromTick.position.y
            }
            clearInterval(waitForGoldStash)

            clearInterval(waitForGoldStash)
        }
    }, 100)
    }