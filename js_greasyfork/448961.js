// ==UserScript==
// @name         Circle Walls, Working 2022 Best Defense Script, OP Script ZOMBS.io
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Makes a circle of walls with radius 3. Super good for defending your base.
// @author       DarkResurgence
// @match        zombs.io
// @grant        Bang
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448961/Circle%20Walls%2C%20Working%202022%20Best%20Defense%20Script%2C%20OP%20Script%20ZOMBSio.user.js
// @updateURL https://update.greasyfork.org/scripts/448961/Circle%20Walls%2C%20Working%202022%20Best%20Defense%20Script%2C%20OP%20Script%20ZOMBSio.meta.js
// ==/UserScript==

function disconnectPartyMembers(member = 3) {
    // Controlers
    if (game.ui.playerPartyMembers[3] && game.ui.playerPartyMembers[0].playerUid == game.world.myUid) {
        let fnc1 = game.network.emitter._events.PACKET_RPC[15];
        let enabled = false;
        game.network.emitter._events.PACKET_RPC[15] = (data) => {
            if (enabled) {
                fnc1(data)
            }
        }
        let dcpacket1 = new Uint8Array(game.network.codec.encode(9, {name: "SetPartyMemberCanSell", uid: game.ui.playerPartyMembers[member].playerUid, canSell: 0}));
        let dcpacket2 = new Uint8Array(game.network.codec.encode(9, {name: "SetPartyMemberCanSell", uid: game.ui.playerPartyMembers[member].playerUid, canSell: 1}));
        for (let i = 0; i < 50000; i++) {
            game.network.socket.send(dcpacket1);
            game.network.socket.send(dcpacket2);
        }
        setTimeout(() => {
            enabled = true;
            game.network.socket.send([]);
        }, 15000);
    }
}

game.network.addRpcHandler("ReceiveChatMessage", e => {
   if (e.uid == game.world.myUid) {
        if (e.message.toLowerCase() == "!dis party") {
            disconnectPartyMembers()
        }
        if (e.message.toLowerCase() == "!dis") {
            game.network.socket.send([]);
        }
    }
})

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
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y);
        placeWall(gridPos.x + 48 + 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y - 48 - 48);
        placeWall(gridPos.x, gridPos.y + 48 + 48);
        placeWall(gridPos.x + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
        placeWall(gridPos.x - 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48);
        placeWall(gridPos.x - 48, gridPos.y - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48);
        placeWall(gridPos.x + 48, gridPos.y + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48);
        placeWall(gridPos.x + 48, gridPos.y);
        placeWall(gridPos.x - 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y + 48);
        placeWall(gridPos.x, gridPos.y - 48);
    }
})

let blockedNames = [];
 
window.blockPlayer = name => {
    game.ui.components.PopupOverlay.showConfirmation(`Are you sure you want to block ${name}?`, 3500, () => {
        blockedNames.push(name);
        for(let msg of Array.from(document.getElementsByClassName("hud-chat-message"))) {
            if(msg.childNodes[2].innerText === name) {
                let bl = msg.childNodes[0];
                bl.innerHTML = "Unblock";
                bl.style.color = "red";
                bl.onclick = () => {
                    window.unblockPlayer(name);
                };
            };
        };
    }, () => {});
};
 
window.unblockPlayer = name => {
    blockedNames.splice(blockedNames.indexOf(name), 1);
    for(let msg of Array.from(document.getElementsByClassName("hud-chat-message"))) {
        if(msg.childNodes[2].innerText === name) {
            let bl = msg.childNodes[0];
            bl.innerHTML = "Block";
            bl.style.color = "red";
            bl.onclick = () => {
                window.blockPlayer(name);
            };
        };
    };
};
 
const getClock = () => {
    var date = new Date();
    var d = date.getDate();
    var d1 = date.getDay();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds()
    var session = "PM";
 
    if(h == 2){
        h = 12;
    };
 
    if(h < 13) {
        session = "AM"
    };
    if(h > 12){
        session = "PM";
        h -= 12;
    };
 
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    return `${h}:${m} ${session}`;
}
 
Game.currentGame.network.emitter.removeListener("PACKET_RPC", Game.currentGame.network.emitter._events.PACKET_RPC[1]);
let onMessageReceived = (msg => {
    let a = Game.currentGame.ui.getComponent("Chat"),
        b = msg.displayName.replace(/<(?:.|\n)*?>/gm, ''),
        c = msg.message.replace(/<(?:.|\n)*?>/gm, '')
    if(blockedNames.includes(b) || window.chatDisabled) { return; };
    let d = a.ui.createElement(`<div class="hud-chat-message"><a href="javascript:void(0);" onclick="window.blockPlayer(\`${b}\`)" style="color: red;">Block</a> <strong>${b}</strong> <small> at ${getClock()}</small>: ${c}</div>`);
    a.messagesElem.appendChild(d);
    a.messagesElem.scrollTop = a.messagesElem.scrollHeight;
})
Game.currentGame.network.addRpcHandler("ReceiveChatMessage", onMessageReceived);