// ==UserScript==
// @name         Incidia
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Mod for Zombs with many feature
// @author       (vn) Incognito_guy
// @match        http://zombs.io/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435571/Incidia.user.js
// @updateURL https://update.greasyfork.org/scripts/435571/Incidia.meta.js
// ==/UserScript==
//afs 
function FixShield() {
        if (Game.currentGame.ui.playerTick.zombieShieldHealth < 85000) {
         Game.currentGame.network.sendRpc({name: "EquipItem", itemName: "ZombieShield", tier:  Game.currentGame.ui.inventory.ZombieShield.tier});
    }
}
Game.currentGame.network.addRpcHandler("DayCycle", FixShield);

//Screenshot mode
window.addEventListener("keydown", e => {
    switch (e.keyCode) {
        case 27:
            var mb = document.getElementsByClassName("hud")[0];
            if (mb.style.display === "none") {
                mb.style.display = "block";
            } else {
                mb.style.display = "none";
            }
            break;
    }
})

//zoom
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
        dimension = Math.min(1.35, dimension + 0.01);
        onWindowResize();
    } else if (e.deltaY < 0) {
        dimension = Math.max(0.1, dimension - 0.01);
        onWindowResize();
    }
}


// Name Stuff
var IntroGuide = '';

IntroGuide += "<h3>Zombs.io Nicknames</h3>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 85%;\" onclick=\"name21(21);\">Cool name</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 85%;\" onclick=\"name22(21);\">Darkness</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 85%;\" onclick=\"name23(22);\">Script writer</button>";
IntroGuide += "<br><br>";

document.getElementsByClassName('hud-intro-guide')[0].innerHTML = IntroGuide;

// NICKNAMES
window.name21 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = 'Sup';
};
window.name23 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = '(vn)Incognito_guy';
};
window.name22 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = 'ƊαrƙɳeՏՏ';
};

//Information Stuff
var hudintrocornerbottomleft = '';

hudintrocornerbottomleft += "<h3>More Information</h3>";
hudintrocornerbottomleft += "<button class=\"btn btn-purple\" style=\"width: 120%;\" onclick=\"name24(22);\">Discord Server</button> ";

document.getElementsByClassName('hud-intro-corner-bottom-left')[0].innerHTML = hudintrocornerbottomleft;

//AdBlocker
document.querySelectorAll('.ad-unit').forEach(function(a) {
  a.remove();
});
//To clean up ui
document.querySelectorAll('.ad-unit, .hud-intro-left, .hud-intro-wrapper > h2, .hud-intro-form > label, .hud-intro-stone, .hud-intro-tree, .hud-intro-corner-bottom-left, .hud-intro-corner-bottom-right').forEach(el => el.remove());
document.getElementsByClassName("hud-intro-form")[0].setAttribute("style", "width: 280px; height: 280px; margin-top: 24px; background-color: rgb(0.0, 0.0, 0.0, 0.0);");
document.getElementsByClassName("hud-intro-guide")[0].setAttribute("style", "width: 280px; height: 280px; margin-top: 8px; background-color: rgb(0.0, 0.0, 0.0, 0.0);");
document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[1].innerHTML = `<br style="height:20px;" /><Custom><b><font size="36">Zombs.io Incidia</font></b></Custom>`;
let igText = document.getElementsByTagName("font")[0];
igText.style.textTransform = "none";
document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-black hud-intro-play");
var Style1 = document.querySelectorAll('.hud-intro-name, .hud-intro-main, .hud-intro-server, .hud-intro-play');for (let i = 0; i < Style1.length; i++) {
    Style1[i].style.border = "3px solid #000000";
}

//Backround Stuff

let sm = document.querySelector("#hud-menu-settings");

sm.style.backgroundColor = " rgba(0, 0, 0, 0.72)";
sm.style.border = "5px solid black";

sm.innerHTML = `
<link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"><style>
Custom {
  letter-spacing: 10px;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-image: url('https://drive.google.com/file/d/1CDP_33FWbOCiyH-pIRixSjsDZJMZMCOf/view?usp=sharing');
  background-size: cover;
}
.hud-intro::before {
    background-image: url('https://drive.google.com/file/d/1CDP_33FWbOCiyH-pIRixSjsDZJMZMCOf/view?usp=sharing');
    background-size: cover;
}
.hud-intro-main {
    padding: 0px 25px 25px 25px;
    width: 580px;
    height: 335px;
    background-image: linear-gradient(to bottom right,  rgba(0, 0, 0, 0.0))
}
.hud-intro-name, .hud-intro-server {
  border: 3px solid #000000;
}
.btn-blue, .btn-red {
    margin-top: 3px;
    margin-left: 3px;
}
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.47);
    border-radius: 10px;
    background-color: #b2beb5;
}
::-webkit-scrollbar {
    width: 12px;
    height: 0px;
    border-radius: 10px;
    background-color: #696969;
}
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.47);
    background-color: #696969;
}
`
var hudmenusettings = `
<center><h3>Incidia</h3>
<h3>Made by (vn) Incognito_guy!</h3>
<hr />
<h3>--Zoom - Hide elements--</h3>
<hr />
<h3>Scroll your mouse to zoom</h3>
<h3>--------------------------</h3>
<h3>Show/Hide ALL menus/div's/elements on zombs.io So you can get clean screenshots/videos. To enable/disable press the ESCAPE key.</h3>

<hr />
<h3>--Sell and Upgrade--</h3>
<hr />
<button id='sellall'>Sell All</button>
<button id='sellbombs'>Sell Bombs</button>
<button id='sellarrows'>Sell Arrows</button>
<button id='sellmages'>Sell Mages</button>
<button id='selltraps'>Sell Traps</button>
<button id='selldoors'>Sell Doors</button>
<button id='sellwalls'>Sell Walls</button>
<button id='sellcannons'>Sell Cannons</button>
<button id='sellmelees'>Sell Melees</button>
<button id='sellmines'>Sell Gold Mine</button>
<button id='sellharvesters'>Sell Harvesters</button>
<button id='upgradeall'>Upgrade All</button>
<hr />
<h3>--Auto Build--</h3>
<hr />
<button onclick ="BryanSmithBase();">Bryan Smith Base</button>
<button onclick="CornerBase1();">Corner base</button>
<button onclick="XBase();">XBase</button>
<button onclick="SmallCornerBase();">Plus Base</button>
<button onclick="ScoreBase();">3 ent Base</button>
<hr />
<h3>--Join Party By Sharekey and Leave--</h3>
<hr />
<input type="text" maxlength="20" placeholder="Enter Key" id="myKey">
<button onclick="join();">Join</button>
<button onclick="leave();">Leave</button>
<button onclick="Game.currentGame.network.disconnect()">Disconnect</button>
<hr />
<h3>--Defense--</h3>
<hr />
<h3>Upgrade your shield to lv.5 or more, Zombies can't kill you anymore </h3>
<h3>--------------------------</h3>
<h3>3x3 Walls, If you place the wall fast you will make 3x walls and if you place the walls slow it will be normal.</h3>
<hr />
<button onclick="3x3Walls();">3x3 Walls</button>
<hr />
<h3>Alarms</h3>
<hr />
<h3>Are used as an alarm. When the raider creates lag bases, destroyes towers, touches stash, or when your teammates die, It will play an alarm for you. Make sure you allow pop-up</h3>
<hr />
<button class="btn-gray alarm" onclick="alarm();">Enable Tower Destroy Alarm</button>
<br>
<button class="btn-gray stashHitAlarm" onclick="stashHitAlarm();">Enable Stash Damage Alarm</button>
<br>
<button class="btn-gray disconnectAlarm" onclick="disconnectAlarm();">Enable Disconnect Alarm</button>
<br>
<button class="btn-gray deadAlarm" onclick="deadAlarm();">Enable Death Alarm</button>
<br>
<hr />
<h3>Boss wave</h3>
<hr />
<h3>Bosses are on waves 9, 17, 25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, and 121</h3>
<hr />
`;

sm.innerHTML = hudmenusettings;
sm.style.overflow = "auto";

//Background
let spaceimg = 'https://cutewallpaper.org/21/wallpaper-pc-4k/Computer-4K-Wallpapers-Top-Free-Computer-4K-Backgrounds-.jpg'
let css =
    `.hud-intro::after { background: url('${spaceimg}'); background-size: cover; opacity: 1.0; }`;
let style = document.createElement('style');
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);
css =
    `.hud-intro-footer { background: url('${spaceimg}'); background-size: cover; opacity: 1.0; }`;
style = document.createElement('style');
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);
game.network.addEnterWorldHandler(window.reduceWS2);

let isOnOrNot = false;
let stashhitalarm = false;
let deadalarm = false;
let disconnectalarm = false;
let onlyOpenOnceOnTimeout;
game.network.addRpcHandler("LocalBuilding", e => {
    for (let i in e) {
        if (e[i].dead) {
            if (e[i].type !== "Wall" && e[i].type !== "Door") {
                if (isOnOrNot) {
                    !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, window.open("https://youtu.be/xvFZjo5PgG0"), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 14000))
                }
            }
        }
    }
})

game.network.addEntityUpdateHandler((e) => {
    let gl = GetGoldStash();
    if (gl) {
        if (e.entities[gl.uid]) {
            if (e.entities[gl.uid].health !== e.entities[gl.uid].maxHealth) {
                if (stashhitalarm) {
                    !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, window.open("https://youtu.be/xvFZjo5PgG0"), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 24000))
                }
            }
        }
    }
})

game.network.addRpcHandler("Dead", () => {
    if (deadalarm) {
        !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, window.open("https://youtu.be/xvFZjo5PgG0"), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 14000))
    }
})

game.network.addCloseHandler(() => {
    if (disconnectalarm) {
        !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, window.open("https://youtu.be/xvFZjo5PgG0"), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 14000))
    }
})

alarm = () => {
    isOnOrNot = !isOnOrNot;

    document.getElementsByClassName("alarm")[0].innerText = document.getElementsByClassName("alarm")[0].innerText.replace(isOnOrNot ? "Enable" : "Disable", isOnOrNot ? "Disable" : "Enable");

    document.getElementsByClassName("alarm")[0].className = document.getElementsByClassName("alarm")[0].className.replace(isOnOrNot ? "green" : "red", isOnOrNot ? "red" : "green");

}

stashHitAlarm = () => {
    stashhitalarm = !stashhitalarm;

    document.getElementsByClassName("stashHitAlarm")[0].innerText = document.getElementsByClassName("stashHitAlarm")[0].innerText.replace(stashhitalarm ? "Enable" : "Disable", stashhitalarm ? "Disable" : "Enable");

    document.getElementsByClassName("stashHitAlarm")[0].className = document.getElementsByClassName("stashHitAlarm")[0].className.replace(stashhitalarm ? "green" : "red", stashhitalarm ? "red" : "green");

}

deadAlarm = () => {
    deadalarm = !deadalarm;

    document.getElementsByClassName("deadAlarm")[0].innerText = document.getElementsByClassName("deadAlarm")[0].innerText.replace(deadalarm ? "Enable" : "Disable", deadalarm ? "Disable" : "Enable");

    document.getElementsByClassName("deadAlarm")[0].className = document.getElementsByClassName("deadAlarm")[0].className.replace(deadalarm ? "green" : "red", deadalarm ? "red" : "green");

}

disconnectAlarm = () => {
    disconnectalarm = !disconnectalarm;

    document.getElementsByClassName("disconnectAlarm")[0].innerText = document.getElementsByClassName("disconnectAlarm")[0].innerText.replace(disconnectalarm ? "Enable" : "Disable", disconnectalarm ? "Disable" : "Enable");

    document.getElementsByClassName("disconnectAlarm")[0].className = document.getElementsByClassName("disconnectAlarm")[0].className.replace(disconnectalarm ? "green" : "red", disconnectalarm ? "red" : "green");

}

GetGoldStash = () => {
    for (let i in game.ui.buildings) {
        if (game.ui.buildings[i].type == "GoldStash") {
            return game.ui.buildings[i];
        }
    }
}
window.sellAll = () => {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model !== "GoldStash") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
}

window.sellWalls = () => {
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
    doNewSend(['ch', ['Sold Walls']])
}

window.sellBombTowers = () => {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "BombTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
}

window.sellGoldMines = () => {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "GoldMine") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
}

window.sellArrowTowers = () => {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "ArrowTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
}

window.sellSlowTraps = () => {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "SlowTrap") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
}

window.sellCannonTowers = () => {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "CannonTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
}

window.sellMageTowers = () => {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "MagicTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
}

window.sellMeleeTowers = () => {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "MeleeTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
}

window.sellHarvesters = () => {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "Harvester") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
}
window.upgradeAll = () => {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        Game.currentGame.network.sendRpc({
            name: "UpgradeBuilding",
            uid: obj.fromTick.uid
        })
    }
}
window.sellDoors = () => {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "Door") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
}
document.querySelector('#sellbombs')
    .addEventListener('click', window.sellBombTowers)
document.querySelector('#sellarrows')
    .addEventListener('click', window.sellArrowTowers)
document.querySelector('#sellcannons')
    .addEventListener('click', window.sellCannonTowers)
document.querySelector('#sellmages')
    .addEventListener('click', window.sellMageTowers)
document.querySelector('#sellall')
    .addEventListener('click', window.sellAll)
document.querySelector('#selltraps')
    .addEventListener('click', window.sellSlowTraps)
document.querySelector('#selldoors')
    .addEventListener('click', window.sellDoors)
document.querySelector('#sellmines')
    .addEventListener('click', window.sellGoldMines)
document.querySelector('#sellwalls')
    .addEventListener('click', window.sellWalls)
document.querySelector('#sellmelees')
    .addEventListener('click', window.sellMeleeTowers)
document.querySelector('#sellharvesters')
    .addEventListener('click', window.sellHarvesters)
document.querySelector('#upgradeall')
    .addEventListener('click', window.upgradeAll)
//3x3 Walls
let mousePs = {};
let shouldBuildWalls = true;

function placeWall(x, y) {
    game.network.sendRpc({name: 'MakeBuilding', x: x, y: y, type: "Wall", yaw: 0});
}

document.addEventListener('mousemove', e => {
    mousePs = {x: e.clientX, y: e.clientY};
    if (shouldBuildWalls && game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Wall") {
        var buildingSchema = game.ui.getBuildingSchema();
        var schemaData = buildingSchema.Wall;
        var mousePosition = game.ui.getMousePosition();
        var world = game.world;
        var worldPos = game.renderer.screenToWorld(mousePs.x, mousePs.y);
        var cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, {width: schemaData.gridWidth, height: schemaData.gridHeight});
        var cellSize = world.entityGrid.getCellSize();
        var cellAverages = { x: 0, y: 0 };
        for (var i in cellIndexes) {
            if (!cellIndexes[i]) {
                return false;
            }
            var cellPos = world.entityGrid.getCellCoords(cellIndexes[i]);
            var isOccupied = game.ui.components.PlacementOverlay.checkIsOccupied(cellIndexes[i], cellPos);
            cellAverages.x += cellPos.x;
            cellAverages.y += cellPos.y;
        }
        cellAverages.x = cellAverages.x/cellIndexes.length;
        cellAverages.y = cellAverages.y/cellIndexes.length;
        var gridPos = {
            x: cellAverages.x * cellSize + cellSize/2,
            y: cellAverages.y * cellSize + cellSize/2
        };
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x, gridPos.y + 48 + 48);
        placeWall(gridPos.x + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48);
        placeWall(gridPos.x, gridPos.y + 48);
        placeWall(gridPos.x + 48, gridPos.y + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y);
        placeWall(gridPos.x - 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y);
        placeWall(gridPos.x + 48, gridPos.y);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
        placeWall(gridPos.x - 48, gridPos.y - 48);
        placeWall(gridPos.x, gridPos.y - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48);
    }
})

window.join = function() {
  let partyKey = myKey.value
        Game.currentGame.network.sendRpc({
                name: "JoinPartyByShareKey",
                partyShareKey: partyKey
        })
}

window.leave = function() {
  Game.currentGame.network.sendRpc({
    name: "LeaveParty"
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
upgradeAll()
var buildings = Game.currentGame.ui.buildings
Object.keys(buildings).forEach(key => {
const building = buildings[key]
if(["BombTower" || "Wall"].indexOf(building.type) >= 0) {
delete buildings[key]
}})
}
window.PlusBase = function() {
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
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0);
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0);
           Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0);
           Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0);
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0);
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0);
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0);
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + 4000000, stashPosition.y + 4000000, "BombTower", 0)
            Auto2.PlaceBuilding(stashPosition.x + -4000000, stashPosition.y + 4000000, "BombTower", 0)

        }
    }, 0)
}
window.SmallCornerBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = EXTREME.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            Auto.PlaceBulding(stashPosition.x + 0, stashPosition.y + -96, 'Harvester', 0);
            Auto.PlaceBulding(stashPosition.x + 0, stashPosition.y + -192, 'Harvester', 0);
            Auto.PlaceBulding(stashPosition.x + 96, stashPosition.y + 0, 'Harvester', 0);
            Auto.PlaceBulding(stashPosition.x + 192, stashPosition.y + 0, 'Harvester', 0);
            Auto.PlaceBulding(stashPosition.x + -96, stashPosition.y + 0, 'Harvester', 0);
            Auto.PlaceBulding(stashPosition.x + -192, stashPosition.y + 0, 'Harvester', 0);
            Auto.PlaceBulding(stashPosition.x + 0, stashPosition.y + 96, 'Harvester', 0);
            Auto.PlaceBulding(stashPosition.x + 0, stashPosition.y + 192, 'Harvester', 0);
            Auto.PlaceBulding(stashPosition.x + -96, stashPosition.y + 240, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + -192, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + -192, stashPosition.y + 192, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + -288, stashPosition.y + 240, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + 336, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + -288, stashPosition.y + 432, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 96, stashPosition.y + 192, 'GoldMine', 0);
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + 96, 'GoldMine', 0);
            Auto.PlaceBulding(stashPosition.x + 192, stashPosition.y + -96, 'GoldMine', 0);
            Auto.PlaceBulding(stashPosition.x + 96, stashPosition.y + -144, 'GoldMine', 0);
            Auto.PlaceBulding(stashPosition.x + -96, stashPosition.y + -192, 'GoldMine', 0);
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + -96, 'GoldMine', 0);
            Auto.PlaceBulding(stashPosition.x + -192, stashPosition.y + 96, 'GoldMine', 0);
            Auto.PlaceBulding(stashPosition.x + -96, stashPosition.y + 144, 'GoldMine', 0);
            Auto.PlaceBulding(stashPosition.x + -120, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + -72, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 120, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 72, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 72, stashPosition.y + 72, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 72, stashPosition.y + -72, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -72, stashPosition.y + -72, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -72, stashPosition.y + 72, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 192, stashPosition.y + 192, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 288, stashPosition.y + 192, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 240, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 336, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 432, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 240, stashPosition.y + 384, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 192, stashPosition.y + -192, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 288, stashPosition.y + -240, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 288, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 336, stashPosition.y + -144, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + -240, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + -240, stashPosition.y + -96, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + -288, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + -240, stashPosition.y + -288, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + -240, stashPosition.y + -384, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + -288, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -384, stashPosition.y + 240, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -432, stashPosition.y + 336, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -480, stashPosition.y + 432, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -96, stashPosition.y + 336, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + 288, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + 336, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -384, stashPosition.y + 48, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -432, stashPosition.y + 144, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -480, stashPosition.y + 240, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -528, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -576, stashPosition.y + 240, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -528, stashPosition.y + 144, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -480, stashPosition.y + 48, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -192, stashPosition.y + 384, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -192, stashPosition.y + 480, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -288, stashPosition.y + 528, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -384, stashPosition.y + 432, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -96, stashPosition.y + 432, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + 384, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + 432, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + 528, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + 240, stashPosition.y + 480, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + 240, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + 432, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 528, stashPosition.y + 288, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + 192, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 240, stashPosition.y + 96, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 336, stashPosition.y + 96, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + 432, stashPosition.y + 96, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + 192, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + -48, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + -48, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 432, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + 528, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + -240, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 576, stashPosition.y + -240, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -432, stashPosition.y + -96, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -480, stashPosition.y + -192, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -528, stashPosition.y + -288, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -528, stashPosition.y + -384, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -384, stashPosition.y + -192, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + -96, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -432, stashPosition.y + -288, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -432, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -432, stashPosition.y + -480, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + -432, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -240, stashPosition.y + -576, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -240, stashPosition.y + -480, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + -480, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + -336, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + -384, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 96, stashPosition.y + -432, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 192, stashPosition.y + -480, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 288, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 192, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -408, stashPosition.y + -552, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -456, stashPosition.y + -552, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -504, stashPosition.y + -504, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -504, stashPosition.y + -456, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + -336, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + -336, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 576, stashPosition.y + -336, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + -432, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -288, stashPosition.y + -192, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -192, stashPosition.y + -192, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 96, stashPosition.y + -336, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + 96, stashPosition.y + -240, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 192, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 288, stashPosition.y + -336, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 288, stashPosition.y + -432, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -312, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -360, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -168, stashPosition.y + -264, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -120, stashPosition.y + -264, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + 456, stashPosition.y + -504, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + 552, stashPosition.y + -408, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + 648, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + 648, stashPosition.y + -264, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + 264, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + 264, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + 312, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 360, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 504, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 504, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 456, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 408, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 360, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 312, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 312, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 312, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 312, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 360, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 408, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 456, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 456, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 120, stashPosition.y + 264, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + 168, stashPosition.y + 264, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -264, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -264, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -264, stashPosition.y + 312, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -264, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -456, stashPosition.y + 504, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -408, stashPosition.y + 504, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -360, stashPosition.y + 504, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -360, stashPosition.y + 552, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -408, stashPosition.y + 552, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -360, stashPosition.y + 600, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -312, stashPosition.y + 600, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + 456, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 408, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 360, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 312, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 264, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -24, stashPosition.y + 264, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -24, stashPosition.y + 312, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -24, stashPosition.y + 360, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -24, stashPosition.y + 408, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -24, stashPosition.y + 456, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -264, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -312, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -360, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -408, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -456, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 24, stashPosition.y + -456, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 24, stashPosition.y + -408, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 24, stashPosition.y + -360, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 24, stashPosition.y + -312, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 24, stashPosition.y + -264, 'SlowTrap', 0);
            clearInterval(waitForGoldStash)
        }
    }, 100)
    }
window.ThreeEntBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = EXTREME.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            Auto.PlaceBulding(stashPosition.x + 0, stashPosition.y + -96, 'Harvester', 0);
            Auto.PlaceBulding(stashPosition.x + 0, stashPosition.y + -192, 'Harvester', 0);
            Auto.PlaceBulding(stashPosition.x + 96, stashPosition.y + 0, 'Harvester', 0);
            Auto.PlaceBulding(stashPosition.x + 192, stashPosition.y + 0, 'Harvester', 0);
            Auto.PlaceBulding(stashPosition.x + -96, stashPosition.y + 0, 'Harvester', 0);
            Auto.PlaceBulding(stashPosition.x + -192, stashPosition.y + 0, 'Harvester', 0);
            Auto.PlaceBulding(stashPosition.x + 0, stashPosition.y + 96, 'Harvester', 0);
            Auto.PlaceBulding(stashPosition.x + 0, stashPosition.y + 192, 'Harvester', 0);
            Auto.PlaceBulding(stashPosition.x + -96, stashPosition.y + 240, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + -192, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + -192, stashPosition.y + 192, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + -288, stashPosition.y + 240, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + 336, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + -288, stashPosition.y + 432, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 96, stashPosition.y + 192, 'GoldMine', 0);
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + 96, 'GoldMine', 0);
            Auto.PlaceBulding(stashPosition.x + 192, stashPosition.y + -96, 'GoldMine', 0);
            Auto.PlaceBulding(stashPosition.x + 96, stashPosition.y + -144, 'GoldMine', 0);
            Auto.PlaceBulding(stashPosition.x + -96, stashPosition.y + -192, 'GoldMine', 0);
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + -96, 'GoldMine', 0);
            Auto.PlaceBulding(stashPosition.x + -192, stashPosition.y + 96, 'GoldMine', 0);
            Auto.PlaceBulding(stashPosition.x + -96, stashPosition.y + 144, 'GoldMine', 0);
            Auto.PlaceBulding(stashPosition.x + -120, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + -72, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 120, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 72, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 72, stashPosition.y + 72, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 72, stashPosition.y + -72, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -72, stashPosition.y + -72, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -72, stashPosition.y + 72, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 192, stashPosition.y + 192, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 288, stashPosition.y + 192, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 240, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 336, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 432, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 240, stashPosition.y + 384, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 192, stashPosition.y + -192, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 288, stashPosition.y + -240, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 288, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 336, stashPosition.y + -144, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + -240, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + -240, stashPosition.y + -96, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + -288, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + -240, stashPosition.y + -288, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + -240, stashPosition.y + -384, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + -288, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -384, stashPosition.y + 240, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -432, stashPosition.y + 336, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -480, stashPosition.y + 432, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -96, stashPosition.y + 336, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + 288, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + 336, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -384, stashPosition.y + 48, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -432, stashPosition.y + 144, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -480, stashPosition.y + 240, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -528, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -576, stashPosition.y + 240, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -528, stashPosition.y + 144, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -480, stashPosition.y + 48, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -192, stashPosition.y + 384, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -192, stashPosition.y + 480, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -288, stashPosition.y + 528, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -384, stashPosition.y + 432, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -96, stashPosition.y + 432, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + 384, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + 432, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + 528, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + 240, stashPosition.y + 480, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + 240, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + 432, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 528, stashPosition.y + 288, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + 192, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 240, stashPosition.y + 96, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 336, stashPosition.y + 96, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + 432, stashPosition.y + 96, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + 192, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + -48, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + -48, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 432, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + 528, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + -240, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 576, stashPosition.y + -240, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -432, stashPosition.y + -96, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -480, stashPosition.y + -192, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -528, stashPosition.y + -288, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -528, stashPosition.y + -384, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -384, stashPosition.y + -192, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + -96, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -432, stashPosition.y + -288, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -432, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -432, stashPosition.y + -480, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + -432, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -240, stashPosition.y + -576, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -240, stashPosition.y + -480, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + -480, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + -336, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + -384, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 96, stashPosition.y + -432, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 192, stashPosition.y + -480, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 288, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBulding(stashPosition.x + 192, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + -408, stashPosition.y + -552, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -456, stashPosition.y + -552, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -504, stashPosition.y + -504, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -504, stashPosition.y + -456, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + -336, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + -336, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 576, stashPosition.y + -336, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + -432, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -288, stashPosition.y + -192, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -192, stashPosition.y + -192, 'BombTower', 0);
            Auto.PlaceBulding(stashPosition.x + 96, stashPosition.y + -336, 'CannonTower', 0);
            Auto.PlaceBulding(stashPosition.x + 96, stashPosition.y + -240, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 192, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 288, stashPosition.y + -336, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + 288, stashPosition.y + -432, 'ArrowTower', 0);
            Auto.PlaceBulding(stashPosition.x + -312, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -360, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -168, stashPosition.y + -264, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -120, stashPosition.y + -264, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + 456, stashPosition.y + -504, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + 552, stashPosition.y + -408, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + 648, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + 648, stashPosition.y + -264, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + 264, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + 264, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + 312, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 360, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 504, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 504, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 456, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 408, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 360, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 312, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 312, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 312, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 312, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 360, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 408, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 456, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 456, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBulding(stashPosition.x + 120, stashPosition.y + 264, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + 168, stashPosition.y + 264, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -264, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -264, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -264, stashPosition.y + 312, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -264, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -456, stashPosition.y + 504, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -408, stashPosition.y + 504, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -360, stashPosition.y + 504, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -360, stashPosition.y + 552, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -408, stashPosition.y + 552, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -360, stashPosition.y + 600, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + -312, stashPosition.y + 600, 'Wall', 0);
            Auto.PlaceBulding(stashPosition.x + 456, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 408, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 360, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 312, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 264, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -24, stashPosition.y + 264, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -24, stashPosition.y + 312, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -24, stashPosition.y + 360, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -24, stashPosition.y + 408, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -24, stashPosition.y + 456, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -264, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -312, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -360, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -408, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + -456, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 24, stashPosition.y + -456, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 24, stashPosition.y + -408, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 24, stashPosition.y + -360, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 24, stashPosition.y + -312, 'SlowTrap', 0);
            Auto.PlaceBulding(stashPosition.x + 24, stashPosition.y + -264, 'SlowTrap', 0);
            clearInterval(waitForGoldStash)
        }
    }, 100)
    }
window.XBase = function() {
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
    }, 150)
}
window.BryanSmithBase = function() {
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
    }, 150)
}

Auto.SSLQ1 = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 0);PlaceBuilding(stashPosition.x + -144, stashPosition.y + 144, 'GoldMine', 0);PlaceBuilding(stashPosition.x + -144, stashPosition.y + -144, 'GoldMine', 0);PlaceBuilding(stashPosition.x + 144, stashPosition.y + -144, 'GoldMine', 0);PlaceBuilding(stashPosition.x + 144, stashPosition.y + 144, 'GoldMine', 0);PlaceBuilding(stashPosition.x + 240, stashPosition.y + 240, 'GoldMine', 0);PlaceBuilding(stashPosition.x + 240, stashPosition.y + -240, 'GoldMine', 0);PlaceBuilding(stashPosition.x + -240, stashPosition.y + -240, 'GoldMine', 0);PlaceBuilding(stashPosition.x + -240, stashPosition.y + 240, 'GoldMine', 0);PlaceBuilding(stashPosition.x + 144, stashPosition.y + 240, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 240, stashPosition.y + 144, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + -144, stashPosition.y + 240, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + -240, stashPosition.y + 144, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 144, stashPosition.y + -240, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 240, stashPosition.y + -144, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + -144, stashPosition.y + -240, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + -240, stashPosition.y + -144, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + -144, stashPosition.y + 0, 'Harvester', 0);PlaceBuilding(stashPosition.x + 0, stashPosition.y + -144, 'Harvester', 0);PlaceBuilding(stashPosition.x + 240, stashPosition.y + 0, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 0, stashPosition.y + 240, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + -240, stashPosition.y + 0, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 0, stashPosition.y + -240, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 432, stashPosition.y + -144, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 432, stashPosition.y + 144, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 144, stashPosition.y + 432, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 0, stashPosition.y + 432, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -144, stashPosition.y + 432, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -432, stashPosition.y + 144, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -432, stashPosition.y + 0, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -432, stashPosition.y + -144, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -144, stashPosition.y + -432, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 0, stashPosition.y + -432, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 144, stashPosition.y + -432, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 0, stashPosition.y + -336, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + -336, stashPosition.y + 0, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 0, stashPosition.y + 336, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 336, stashPosition.y + 0, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 144, stashPosition.y + 336, 'CannonTower', 0);PlaceBuilding(stashPosition.x + 336, stashPosition.y + 144, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -336, stashPosition.y + 144, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -144, stashPosition.y + 336, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -144, stashPosition.y + -336, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -336, stashPosition.y + -144, 'CannonTower', 0);PlaceBuilding(stashPosition.x + 144, stashPosition.y + -336, 'CannonTower', 0);PlaceBuilding(stashPosition.x + 336, stashPosition.y + -144, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -120, stashPosition.y + -72, 'Door', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + -72, 'Door', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + -120, 'Door', 0);PlaceBuilding(stashPosition.x + 120, stashPosition.y + -72, 'Door', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + -120, 'Door', 0);PlaceBuilding(stashPosition.x + 120, stashPosition.y + 72, 'Door', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + 72, 'Door', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + 120, 'Door', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + 120, 'Door', 0);PlaceBuilding(stashPosition.x + -120, stashPosition.y + 72, 'Door', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + 24, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + -24, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -24, stashPosition.y + -72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 24, stashPosition.y + -72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 168, stashPosition.y + 72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + 168, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + 168, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -168, stashPosition.y + 72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -168, stashPosition.y + -72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + -168, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + -168, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 168, stashPosition.y + -72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 264, stashPosition.y + -72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 360, stashPosition.y + -72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 456, stashPosition.y + -72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 456, stashPosition.y + 72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 360, stashPosition.y + 72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 264, stashPosition.y + 72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + 264, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + 360, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + 456, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + 456, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + 360, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + 264, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -264, stashPosition.y + 72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -360, stashPosition.y + 72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -456, stashPosition.y + 72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -456, stashPosition.y + -72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -360, stashPosition.y + -72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -264, stashPosition.y + -72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + -264, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + -360, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + -456, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + -456, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + -360, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + -264, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + -72, 'Door', 0);PlaceBuilding(stashPosition.x + 0, stashPosition.y + 144, 'Harvester', 0);PlaceBuilding(stashPosition.x + -72, stashPosition.y + 72, 'Door', 0);PlaceBuilding(stashPosition.x + 24, stashPosition.y + 72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + -24, stashPosition.y + 72, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 480, stashPosition.y + -240, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 528, stashPosition.y + -336, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 384, stashPosition.y + -240, 'CannonTower', 0);PlaceBuilding(stashPosition.x + 240, stashPosition.y + -384, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 240, stashPosition.y + -480, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -240, stashPosition.y + -480, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -336, stashPosition.y + -528, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -240, stashPosition.y + -384, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -480, stashPosition.y + -240, 'CannonTower', 0);PlaceBuilding(stashPosition.x + 336, stashPosition.y + -528, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 528, stashPosition.y + 336, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 384, stashPosition.y + 240, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 480, stashPosition.y + 240, 'CannonTower', 0);PlaceBuilding(stashPosition.x + 336, stashPosition.y + 528, 'MagicTower', 0);PlaceBuilding(stashPosition.x + 240, stashPosition.y + 480, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -528, stashPosition.y + 336, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -480, stashPosition.y + 240, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -240, stashPosition.y + 384, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 240, stashPosition.y + 384, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + -384, stashPosition.y + -240, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + -528, stashPosition.y + -336, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -264, stashPosition.y + -552, 'Door', 0);PlaceBuilding(stashPosition.x + -552, stashPosition.y + -264, 'Door', 0);PlaceBuilding(stashPosition.x + 264, stashPosition.y + -552, 'Door', 0);PlaceBuilding(stashPosition.x + 552, stashPosition.y + -264, 'Door', 0);PlaceBuilding(stashPosition.x + 552, stashPosition.y + 264, 'Door', 0);PlaceBuilding(stashPosition.x + 264, stashPosition.y + 552, 'Door', 0);PlaceBuilding(stashPosition.x + -264, stashPosition.y + 552, 'Door', 0);PlaceBuilding(stashPosition.x + -552, stashPosition.y + 264, 'Door', 0);PlaceBuilding(stashPosition.x + -432, stashPosition.y + -432, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -432, stashPosition.y + -528, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -528, stashPosition.y + -432, 'CannonTower', 0);PlaceBuilding(stashPosition.x + 528, stashPosition.y + -432, 'CannonTower', 0);PlaceBuilding(stashPosition.x + 432, stashPosition.y + -432, 'CannonTower', 0);PlaceBuilding(stashPosition.x + 432, stashPosition.y + -528, 'CannonTower', 0);PlaceBuilding(stashPosition.x + 432, stashPosition.y + 432, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 528, stashPosition.y + 432, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + 432, stashPosition.y + 528, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -384, stashPosition.y + 240, 'BombTower', 0);PlaceBuilding(stashPosition.x + -336, stashPosition.y + -336, 'BombTower', 0);PlaceBuilding(stashPosition.x + -432, stashPosition.y + -336, 'BombTower', 0);PlaceBuilding(stashPosition.x + 336, stashPosition.y + -336, 'BombTower', 0);PlaceBuilding(stashPosition.x + 432, stashPosition.y + -336, 'BombTower', 0);PlaceBuilding(stashPosition.x + 432, stashPosition.y + 336, 'BombTower', 0);PlaceBuilding(stashPosition.x + 336, stashPosition.y + 336, 'BombTower', 0);PlaceBuilding(stashPosition.x + 336, stashPosition.y + 432, 'BombTower', 0);PlaceBuilding(stashPosition.x + 144, stashPosition.y + 0, 'Harvester', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + -24, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 72, stashPosition.y + 24, 'SlowTrap', 0);PlaceBuilding(stashPosition.x + 336, stashPosition.y + -432, 'BombTower', 0);PlaceBuilding(stashPosition.x + -336, stashPosition.y + -432, 'BombTower', 0);PlaceBuilding(stashPosition.x + 432, stashPosition.y + 0, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -240, stashPosition.y + 480, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -336, stashPosition.y + 528, 'MagicTower', 0);PlaceBuilding(stashPosition.x + -432, stashPosition.y + 528, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -432, stashPosition.y + 432, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -528, stashPosition.y + 432, 'ArrowTower', 0);PlaceBuilding(stashPosition.x + -336, stashPosition.y + 336, 'BombTower', 0);PlaceBuilding(stashPosition.x + -432, stashPosition.y + 336, 'CannonTower', 0);PlaceBuilding(stashPosition.x + -336, stashPosition.y + 432, 'BombTower', 0);PlaceBuilding(stashPosition.x + 504, stashPosition.y + -504, 'Door', 0);PlaceBuilding(stashPosition.x + -504, stashPosition.y + -504, 'Door', 0);PlaceBuilding(stashPosition.x + 504, stashPosition.y + 504, 'Door', 0);PlaceBuilding(stashPosition.x + -504, stashPosition.y + 504, 'Door', 0);PlaceBuilding(stashPosition.x + 312, stashPosition.y + 264, 'Wall', 0);PlaceBuilding(stashPosition.x + 312, stashPosition.y + 216, 'Wall', 0);PlaceBuilding(stashPosition.x + 264, stashPosition.y + 312, 'Wall', 0);PlaceBuilding(stashPosition.x + 216, stashPosition.y + 312, 'Wall', 0);PlaceBuilding(stashPosition.x + -264, stashPosition.y + 312, 'Wall', 0);PlaceBuilding(stashPosition.x + -216, stashPosition.y + 312, 'Wall', 0);PlaceBuilding(stashPosition.x + -312, stashPosition.y + 264, 'Wall', 0);PlaceBuilding(stashPosition.x + -312, stashPosition.y + 216, 'Wall', 0);PlaceBuilding(stashPosition.x + -312, stashPosition.y + -216, 'Wall', 0);PlaceBuilding(stashPosition.x + -312, stashPosition.y + -264, 'Wall', 0);PlaceBuilding(stashPosition.x + -264, stashPosition.y + -312, 'Wall', 0);PlaceBuilding(stashPosition.x + -216, stashPosition.y + -312, 'Wall', 0);PlaceBuilding(stashPosition.x + 216, stashPosition.y + -312, 'Wall', 0);PlaceBuilding(stashPosition.x + 264, stashPosition.y + -312, 'Wall', 0);PlaceBuilding(stashPosition.x + 312, stashPosition.y + -264, 'Wall', 0);PlaceBuilding(stashPosition.x + 312, stashPosition.y + -216, 'Wall', 0);PlaceBuilding(stashPosition.x + -360, stashPosition.y + -600, 'Wall', 0);PlaceBuilding(stashPosition.x + -408, stashPosition.y + -600, 'Wall', 0);PlaceBuilding(stashPosition.x + -456, stashPosition.y + -600, 'Wall', 0);PlaceBuilding(stashPosition.x + -600, stashPosition.y + -360, 'Wall', 0);PlaceBuilding(stashPosition.x + -600, stashPosition.y + -408, 'Wall', 0);PlaceBuilding(stashPosition.x + -600, stashPosition.y + -456, 'Wall', 0);PlaceBuilding(stashPosition.x + -552, stashPosition.y + -504, 'Door', 0);PlaceBuilding(stashPosition.x + -504, stashPosition.y + -552, 'Door', 0);PlaceBuilding(stashPosition.x + 360, stashPosition.y + -600, 'Wall', 0);PlaceBuilding(stashPosition.x + 408, stashPosition.y + -600, 'Wall', 0);PlaceBuilding(stashPosition.x + 456, stashPosition.y + -600, 'Wall', 0);PlaceBuilding(stashPosition.x + 504, stashPosition.y + -552, 'Door', 0);PlaceBuilding(stashPosition.x + 552, stashPosition.y + -504, 'Door', 0);PlaceBuilding(stashPosition.x + 600, stashPosition.y + -456, 'Wall', 0);PlaceBuilding(stashPosition.x + 600, stashPosition.y + -408, 'Wall', 0);PlaceBuilding(stashPosition.x + 600, stashPosition.y + -360, 'Wall', 0);PlaceBuilding(stashPosition.x + 600, stashPosition.y + 360, 'Wall', 0);PlaceBuilding(stashPosition.x + 600, stashPosition.y + 408, 'Wall', 0);PlaceBuilding(stashPosition.x + 600, stashPosition.y + 456, 'Wall', 0);PlaceBuilding(stashPosition.x + 552, stashPosition.y + 504, 'Door', 0);PlaceBuilding(stashPosition.x + 504, stashPosition.y + 552, 'Door', 0);PlaceBuilding(stashPosition.x + 456, stashPosition.y + 600, 'Wall', 0);PlaceBuilding(stashPosition.x + 408, stashPosition.y + 600, 'Wall', 0);PlaceBuilding(stashPosition.x + 360, stashPosition.y + 600, 'Wall', 0);PlaceBuilding(stashPosition.x + -360, stashPosition.y + 600, 'Wall', 0);PlaceBuilding(stashPosition.x + -408, stashPosition.y + 600, 'Wall', 0);PlaceBuilding(stashPosition.x + -456, stashPosition.y + 600, 'Wall', 0);PlaceBuilding(stashPosition.x + -504, stashPosition.y + 552, 'Door', 0);PlaceBuilding(stashPosition.x + -552, stashPosition.y + 504, 'Door', 0);PlaceBuilding(stashPosition.x + -600, stashPosition.y + 408, 'Wall', 0);PlaceBuilding(stashPosition.x + -600, stashPosition.y + 360, 'Wall', 0);PlaceBuilding(stashPosition.x + -600, stashPosition.y + 456, 'Wall', 0);
        }
    }, 150)
}
window.CornerBase1 = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, "Harvester", 100)
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 0, "Harvester", 100)
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 96, "Harvester", 100)
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, "Harvester", 100);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, "Harvester", 100)
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
    }, 150)
}
var e = function(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}
var HELL = 1008;
var HELL2 = 17856;
window.ScoreBase = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
           clearInterval(waitForGoldStash)
             Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 0, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 0, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 96, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 96, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 0, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 96, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 192, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 192, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 240, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 288, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 288, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 384, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 384, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 192, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 432, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 336, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 480, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 480, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 432, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 384, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 384, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 432, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 336, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 240, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 192, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 336, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 288, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 288, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 168, 'Wall', 0);
             Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 168, 'Wall', 0);
             Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 144, 'GoldMine', 0);
             Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 240, 'GoldMine', 0);
             Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 240, 'GoldMine', 0);
             Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 144, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 48, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 144, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 48, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 48, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 144, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 240, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 336, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 240, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 336, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 336, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 384, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 432, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 480, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 528, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 528, 'GoldMine', 0);
             Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 432, 'GoldMine', 0);
             Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 432, 'GoldMine', 0);
             Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -96, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -192, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -96, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -192, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -96, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -192, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -288, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -144, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -240, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -336, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -432, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -432, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -432, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -336, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -336, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -240, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -144, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -432, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -336, 'ArrowTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -528, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -528, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -528, 'MagicTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -384, 'GoldMine', 0);
             Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -144, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -240, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -144, 'CannonTower', 0);
             Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -240, 'GoldMine', 0);
             Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -24, 'SlowTrap', 0);
             Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -24, 'SlowTrap', 0);
             Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -24, 'SlowTrap', 0);
             Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -24, 'SlowTrap', 0);
             Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -24, 'SlowTrap', 0);
             Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -24, 'SlowTrap', 0);
             Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -72, 'SlowTrap', 0);
             Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -72, 'SlowTrap', 0);
             Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -72, 'SlowTrap', 0);
             Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -72, 'SlowTrap', 0);
             Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -72, 'SlowTrap', 0);
             Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -72, 'SlowTrap', 0);
             Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -72, 'SlowTrap', 0);
             Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 168, 'SlowTrap', 0);
             Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 216, 'SlowTrap', 0);
             Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 264, 'SlowTrap', 0);
             Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 312, 'SlowTrap', 0);
             Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 360, 'SlowTrap', 0);
             Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 408, 'SlowTrap', 0);
             Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 312, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 312, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 312, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 360, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 408, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 456, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 504, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 552, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 552, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 600, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 648, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 648, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 648, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 600, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -216, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -216, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -216, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -264, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -264, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -312, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -360, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -408, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -360, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -312, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -264, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -216, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -264, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -264, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -312, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -312, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -360, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -264, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -600, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -600, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -600, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -600, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -600, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -552, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -504, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -456, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -456, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -456, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -408, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -120, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -168, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -168, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -168, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -120, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -72, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 24, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 24, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 72, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 72, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 72, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 120, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 120, 'Door', 0);
             Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -48, 'Harvester', 0);
             Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 96, 'Harvester', 0);
            clearInterval(waitForGoldStash)
        }
    }, 100)
    }

Auto.dhrBase = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 0, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 0, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -96, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -96, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -192, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -192, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -288, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -192, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 0, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -288, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -288, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -384, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -288, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -384, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -96, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -96, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 0, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -192, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -288, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -384, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -384, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -384, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 0, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -96, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -192, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -288, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -384, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -480, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -576, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -480, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -480, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -480, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -480, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -480, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -576, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -576, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -576, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -576, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -576, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -576, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -480, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -384, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -288, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -192, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + 0, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + -96, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + -192, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + -288, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + -384, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + -480, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + -576, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 768, stashPosition.y + 0, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 768, stashPosition.y + -96, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 768, stashPosition.y + -192, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 768, stashPosition.y + -288, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 768, stashPosition.y + -384, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 768, stashPosition.y + -480, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 768, stashPosition.y + -576, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 864, stashPosition.y + 0, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 864, stashPosition.y + -96, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 864, stashPosition.y + -192, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 864, stashPosition.y + -288, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 864, stashPosition.y + -384, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 864, stashPosition.y + -480, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 864, stashPosition.y + -576, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -672, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -672, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -672, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + -672, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -672, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -672, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -672, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 768, stashPosition.y + -672, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -96, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 0, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + -768, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -768, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -768, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -864, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -864, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -792, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -744, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 792, stashPosition.y + -744, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -768, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -864, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -768, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -864, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -768, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -768, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -864, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -864, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -672, 'BombTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -768, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -864, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 96, 'Harvester', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 96, 'Harvester', 0);EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 96, 'Harvester', 0);EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 0, 'Harvester', 0);EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, 'Harvester', 0);
           }
    },150)
}
Auto.dhrBase2 = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 0, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 0, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 0, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 96, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 0, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 96, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 96, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 192, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 192, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 288, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 96, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 192, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 288, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 240, 'GoldMine', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 336, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 384, 'CannonTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 432, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 384, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 432, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 0, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 96, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 96, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 192, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + 192, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 288, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 288, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 384, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 360, 'Wall', 0);EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 360, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 264, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 264, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 216, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 168, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 168, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 312, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 312, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 264, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 72, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 168, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 480, 'ArrowTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 480, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 456, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 528, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 576, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 528, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 624, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 672, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 624, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 528, 'MagicTower', 0);EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 600, 'Wall', 0);EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 696, 'Door', 0);EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 240, 'Harvester', 0);EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -96, 'Harvester', 0);EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, 'Harvester', 0);EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 0, 'Harvester', 0);EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 96, 'Harvester', 0);EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, 'Harvester', 0);
        }
    },150)
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

    window.UpgradeStash = function() {
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
  if (trade.innerHTML == "Upgrade+") {
    trade.innerHTML = "Upgrade-";
  } else {
    trade.innerHTML = "Upgrade+";
  }
}
window.BryanSmithBase = function() {
  Auto.BuildBryanSmithBase()
}
window.CornerBase1 = function() {
  Auto.BuildThingBase()
}
window.PlusBase = function() {
  Auto2.GoldGenerator()
}
window.ThreeEntBase = function() {
  EXTREME.BuildMyBase()
}
window.XBase = function () {
EXTREME.BuildXBase()
}
window.SmallCornerBase = function () {
EXTREME.BuildMyBase2()
}
window.ScoreBase = function () {
Auto.BryanScoreBase()
}
window.deathrainbase = function () {
Auto.dhrBase()
}
window.bryanss = function () {
Auto.dhrBase2()
}
window.SSLQ = () => {
Auto.SSLQ1()
}

document.querySelector("a")
    .remove();
document.querySelector("You can't place buildings in occupied cells.")
    .remove();

