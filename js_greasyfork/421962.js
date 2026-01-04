// ==UserScript==
// @name         deathrain mod LTE (Glass edition)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto build bases in zombs.io
// @author       deathrain
// @match        http://zombs.io/
// @grant        egg
// @downloadURL https://update.greasyfork.org/scripts/421962/deathrain%20mod%20LTE%20%28Glass%20edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/421962/deathrain%20mod%20LTE%20%28Glass%20edition%29.meta.js
// ==/UserScript==

let css = `
::-webkit-scrollbar {
width: 0;
}
.btn-greenn {
background-color: transparent;
color: #56f00e;
font-size: 17px;
height: 45px;
border: 4px solid #56f00e;
border-radius: 2px;
margin-bottom: 2.5px;
margin-top: 2.5px;
margin-right: 2.5px;
margin-left: 2.5px;
outline: none;
opacity: 0.8;
}
.btn-greenn:hover {
background-color: transparent;
color: #51ff00;
font-size: 17px;
height: 45px;
border: 4px solid #51ff00;
border-radius: 2px;
margin-bottom: 2.5px;
margin-top: 2.5px;
margin-right: 2.5px;
margin-left: 2.5px;
outline: none;
opacity: 1;
}
.btn-redd {
background-color: transparent;
color: #ed0909;
font-size: 17px;
height: 45px;
border: 4px solid #ed0909;
border-radius: 2px;
margin-bottom: 2.5px;
margin-top: 2.5px;
margin-right: 2.5px;
margin-left: 2.5px;
outline: none;
opacity: 0.8;
}
.btn-redd:hover {
background-color: transparent;
color: #ff0000;
font-size: 17px;
height: 45px;
border: 4px solid #ff0000;
border-radius: 2px;
margin-bottom: 2.5px;
margin-top: 2.5px;
margin-right: 2.5px;
margin-left: 2.5px;
outline: none;
opacity: 1;
}
.btn-bluee {
background-color: transparent;
color: #05e0f5;
font-size: 16px;
height: 45px;
border: 4px solid #05e0f5;
border-radius: 2px;
margin-bottom: 2.5px;
margin-top: 2.5px;
margin-right: 2.5px;
margin-left: 2.5px;
outline: none;
opacity: 0.8;
}
.btn-bluee:hover {
background-color: transparent;
color: #00eaff;
font-size: 16px;
height: 45px;
border: 4px solid #00eaff;
border-radius: 2px;
margin-bottom: 2.5px;
margin-top: 2.5px;
margin-right: 2.5px;
margin-left: 2.5px;
outline: none;
opacity: 1;
}

.btn-greennn {
background-color: transparent;
color: #56f00e;
font-size: 17px;
height: 50px;
width: 234.03px;
border: 4px solid #56f00e;
border-radius: 2px;
margin-top: 8px;
outline: none;
opacity: 0.8;
}
.btn-greennn:hover {
background-color: transparent;
color: #51ff00;
font-size: 17px;
height: 50px;
width: 234.03px;
border: 4px solid #51ff00;
border-radius: 2px;
margin-top: 8px;
outline: none;
opacity: 1;
}
.btn-blueee {
background-color: transparent;
color: #05e0f5;
font-size: 16px;
height: 50px;
width: 234.03px;
border: 4px solid #05e0f5;
border-radius: 2px;
margin-top: 8px;
outline: none;
opacity: 0.8;
}
.btn-blueee:hover {
background-color: transparent;
color: #00eaff;
font-size: 16px;
height: 50px;
width: 234.03px;
border: 4px solid #00eaff;
border-radius: 2px;
margin-top: 8px;
outline: none;
opacity: 1;
}
`;

let styles = document.createElement("style");
styles.appendChild(document.createTextNode(css));
document.head.appendChild(styles);
styles.type = "text/css";

let Settings = ''
Settings += `
<center>
<hr />
<font size="+1"><b><u>Autobuilder</u><b/>
<hr />
<button class="btn btn-greenn" style="width: 100%;" onclick="PlusBase();">+ Base</button>
<button class="btn btn-greenn" style="width: 100%;" onclick="CornerBase();">Corner Base</button>
<button class="btn btn-greenn" style="width: 100%;" onclick="ThreeEntBase();">3 Ent Base</button>
<button class="btn btn-greenn" style="width: 100%;" onclick="ScoreBase();">50m Score Base</button>
<button class="btn btn-greenn" style="width: 100%;" onclick="UpdatedPlus();">Updated + Base</button>
<hr />
<font size="+1"><b><u>Main</u><b/>
<hr />
<button class="btn btn-redd" style="width: 12%; height: 12%; margin-right: 0px; margin-left: 0px;" onclick="SellTowerByType('Wall');">1</button>
<button class="btn btn-redd" style="width: 12%; height: 12%; margin-right: 0px; margin-left: 0px;" onclick="SellTowerByType('Door');">2</button>
<button class="btn btn-redd" style="width: 12%; height: 12%; margin-right: 0px; margin-left: 0px;" onclick="SellTowerByType('SlowTrap');">3</button>
<button class="btn btn-greenn" style="margin-left: 20%; width: 39%; height: 12%;" id="AHRC">Enable AHRC</button>
<br>
<button class="btn btn-redd" style="width: 12%; height: 12%; margin-right: 0px; margin-left: 0px;" onclick="SellTowerByType('ArrowTower');">4</button>
<button class="btn btn-redd" style="width: 12%; height: 12%; margin-right: 0px; margin-left: 0px;" onclick="SellTowerByType('CannonTower');">5</button>
<button class="btn btn-redd" style="width: 12%; height: 12%; margin-right: 0px; margin-left: 0px;" onclick="SellTowerByType('MeleeTower');">6</button>
<button class="btn btn-greenn" style="margin-left: 20%; width: 39%; height: 12%;" onclick="upgradeall();">Upgrade All</button>
<br>
<button class="btn btn-redd" style="width: 12%; height: 12%; margin-right: 0px; margin-left: 0px;" onclick="SellTowerByType('BombTower');">7</button>
<button class="btn btn-redd" style="width: 12%; height: 12%; margin-right: 0px; margin-left: 0px;" onclick="SellTowerByType('MagicTower');">8</button>
<button class="btn btn-redd" style="width: 12%; height: 12%; margin-right: 0px; margin-left: 0px;" onclick="SellTowerByType('GoldMine');"">9</button>
<button class="btn btn-redd" style="margin-left: 20%; width: 39%; height: 12%;" onclick="sellall();">Sell All</button>
<br>
<button class="btn btn-redd" style="width: 12%; height: 12%; margin-right: 0px; margin-left: 13%;" onclick="SellTowerByType('Harvester');">0</button>
<button class="btn btn-redd" style="margin-left: 32.5%; width: 39%; height: 12%;" id="SellPet">Sell Pet</button>
<hr>
<button class="btn btn-redd" id="blockName" style="width: 28.5%;">Block</button>
<input type="text" class="btn btn-bluee" id="nameToBlock" style="width: 38%;" maxlength=35 placeholder="Player Name">
<button class="btn btn-greenn" id="unblockName"; style="width: 28.5%;">Unblock</button>
<button class="btn btn-greenn" id="hideBlocked" style="width: 28.5%;">Hide Names</button>
<button class="btn btn-greenn" style="width: 38%;" id="chatFilter" filter="all">All</button>
<button class="btn btn-greenn" id="showBlocked" style="width: 28.5%;">Show Names</button>
<div style="margin-top: 1%;" id="blockNamesList"></div>
<hr />
<center/>
`
document.getElementsByClassName("hud-settings-grid")[0].innerHTML = Settings;
document.getElementsByClassName("hud-intro-corner-bottom-right")[0].remove();
document.getElementsByClassName("hud-intro-corner-bottom-left")[0].remove();
document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 49);
document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);
document.getElementsByClassName("hud-intro-footer")[0].innerHTML = `<h3><font color="white"><font size="+1">Made by deathrain</font></font>`;
document.getElementsByClassName("hud-intro-youtuber")[0].innerHTML = `<h3>Featured YouTuber:</h3><a href="https://www.youtube.com/channel/UC4Wl5kskE-fXku2pynDEjXQ" target="_blank">deathrain</a>`;
document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[3].innerHTML = "<h3>deathrain Mod LTE</h3>";
document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[1].textContent = "ZOMBS.IO";
document.getElementsByClassName("hud-menu-party")[0].setAttribute("style", "width: 610px; height: 465px;");
document.getElementsByClassName("hud-intro-left")[0].setAttribute("style", "width: 280px; height: 300px;");
document.getElementsByClassName("hud-intro-guide")[0].setAttribute("style", "width: 280px; height: 300px;");
document.getElementsByClassName("hud-intro-form")[0].setAttribute("style", "width: 280px; height: 300px;");
document.getElementsByClassName("hud-intro-footer")[0].setAttribute("style", "background-color: rgb(0, 0, 0, 0.4);");
document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-greennn");
document.getElementsByClassName("hud-intro-name")[0].setAttribute("class", "btn btn-blueee");
document.getElementsByClassName("hud-intro-server")[0].setAttribute("class", "btn btn-blueee")



var entities = Game.currentGame.world.entities;

var Style1 = document.querySelectorAll('.hud-map, .hud-resources, .hud-menu, .hud-menu-icon, .hud-intro-left, .hud-party-visibility, .hud-intro-footer, .hud-menu-shop, .hud-menu-party, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-party-link, .hud-party-members, .hud-party-grid, .hud-settings-grid, .hud-toolbar-item, .hud-toolbar-building, .hud-menu-icon, .hud-spell-icon, .hud-intro-form, .hud-intro-guide, .hud-intro-name, .hud-intro-server, .hud-party-tag, .hud-party-share, .hud-chat-input');
for (let i = 0; i < Style1.length; i++) {
    Style1[i].style.borderRadius = '2px'; // standard
    Style1[i].style.MozBorderRadius = '2px'; // Mozilla
    Style1[i].style.WebkitBorderRadius = '2px'; // WebKitww
    Style1[i].style.border = "3px solid #56f00e";
    Style1[i].style.outline = "none";
}

document.getElementsByClassName("hud-intro-left")[0].innerHTML = `
<center><h3><center><font size="+1"><font color="white"><u>Name Saver</u></font></font></h3>
<button class="btn btn-greenn" style="width: 98%;" onclick="document.getElementsByClassName('btn btn-blueee')[0].value = 'Custom 1';">Custom 1</button>
<button class="btn btn-greenn" style="width: 98%;" onclick="document.getElementsByClassName('btn btn-blueee')[0].value = 'Custom 2';">Custom 2</button>
<button class="btn btn-greenn" style="width: 98%;" onclick="document.getElementsByClassName('btn btn-blueee')[0].value = '   ‍   ';">Invisible</button>
<button class="btn btn-greenn" style="width: 98%;" onclick="document.getElementsByClassName('btn btn-blueee')[0].value = '﷽﷽﷽﷽﷽﷽﷽﷽﷽';">﷽</button></center>`;

let Party = `
<button class="btn btn-greenn" style="width: 160px; margin-top: 3px; margin-left: -2.5px;" onclick="PartyJoin();">Join</button>
<input type="text" maxlength="20" placeholder="Party Key Here . . ." id="partyKey" style="width: 240px; height: 45px; margin-top: 3px; margin-right: 12px; margin-left: 12px;" class="btn btn-bluee">
<button class="btn btn-redd" style="width: 120px; margin-top: 3px;" onclick="Game.currentGame.network.sendRpc({name: 'LeaveParty'});">Leave</button>`
let div = document.createElement('div');
div.className = 'partydiv';
div.style = 'text-align:center';
document.getElementsByClassName('hud-party-actions')[0].appendChild(div);
document.getElementsByClassName("partydiv")[0].innerHTML += Party;

window.partyJoin = function() {
    Game.currentGame.network.sendRpc({
        name: "JoinPartyByShareKey",
        partyShareKey: document.getElementById("partyKey").value
    })
}

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

window.sellall = function() {
    for(var uid in entities) {
        if(!entities.hasOwnProperty(uid)) continue
        var obj = entities[uid]
        if(["MeleeTower", "MagicTower", "CannonTower", "BombTower", "ArrowTower", "Door", "GoldMine", "Wall", "Harvester", "SlowTrap" || "Wall"].indexOf(obj.fromTick.model) >= 0) {
            Game.currentGame.network.sendRpc({name: "DeleteBuilding", uid: obj.fromTick.uid})
        }
    }
}

window.upgradeall = function() {
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model !== "GoldStash") {
            Game.currentGame.network.sendRpc({name: "UpgradeBuilding", uid: obj.fromTick.uid});
        }
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

var BtnAHRC = document.getElementById("AHRC");
BtnAHRC.addEventListener("click", startAHRC);
BtnAHRC.addEventListener("click", stopAHRC);
var AHRC = null;
function startAHRC() {
    clearInterval(AHRC);
    if (AHRC !== null) {
        AHRC = null;
    } else {
        AHRC = setInterval(function() {
            for (var uid in entities) {
                if (!entities.hasOwnProperty(uid)) continue;
                var obj = entities[uid];
                if (obj.fromTick.model == "Harvester") {
                    let e = Game.currentGame.world.getEntityByUid(obj.fromTick.uid).getTargetTick();
                    let i = Math.floor(e.depositMax);
                    Game.currentGame.network.sendRpc({name: "AddDepositToHarvester", uid: obj.fromTick.uid, deposit: i = 500});
                    Game.currentGame.network.sendRpc({name: "CollectHarvester", uid: obj.fromTick.uid});
                }
            }
        }, 80);
    }
}
function stopAHRC() {
    var trade = document.getElementById("AHRC");
    if (trade.innerHTML == "Enable AHRC") {
        trade.innerHTML = "Disable AHRC";
        trade.className = "btn btn-redd";
    } else {
        trade.innerHTML = "Enable AHRC";
        trade.className = "btn btn-greenn";
    }
}

const getIdE = ID => {
    return document.getElementById(ID);
}
const getElement = ELEMENT => {
    return document.getElementsByClassName(ELEMENT);
}
if (localStorage.getItem("blockedNames") == null) {
    localStorage.setItem("blockedNames", "[]");
}
let filterButton = getIdE("chatFilter");
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
            filterButton.setAttribute("class", "btn btn-greenn");
            filterButton.textContent = "All";
            break;
        case "party":
            filterButton.setAttribute("class", "btn btn-bluee");
            filterButton.textContent = "Party";
            break;
        case "none":
            filterButton.setAttribute("class", "btn btn-redd");
            filterButton.textContent = "None";
            break;
    }
}

getIdE("blockName").onclick = () => {
    let blocked = JSON.parse(localStorage.getItem("blockedNames"));
    if (blocked.includes(getIdE("nameToBlock").value)) return;
    blocked.push(getIdE("nameToBlock").value);
    localStorage.setItem("blockedNames", JSON.stringify(blocked));
}

getIdE("unblockName").onclick = () => {
    let blocked = JSON.parse(localStorage.getItem("blockedNames"));
    if (blocked.indexOf(getIdE("nameToBlock").value) == -1) return;
    blocked.splice(blocked.indexOf(getIdE("nameToBlock").value), 1);
    localStorage.setItem("blockedNames", JSON.stringify(blocked));
}

getIdE("showBlocked").onclick = () => {
    let blocked = JSON.parse(localStorage.getItem("blockedNames"));
    let str = "<h3>";
    str += blocked.join(", ");
    str += "</h3>";
    getIdE("blockNamesList").innerHTML = str;
}

getIdE("hideBlocked").onclick = () => {
    getIdE("blockNamesList").innerHTML = "";
}

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