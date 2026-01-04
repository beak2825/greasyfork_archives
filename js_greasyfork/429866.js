// ==UserScript==
// @name         </> Kurt Mod - 7x7 Duvar
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  !duvardizilim
// @icon         https://cdn.discordapp.com/emojis/853002908924510240.gif?v=1
// @author       Kurt
// @match        *://zombs.io/*
// @match        http://tc-mod-js.glitch.me/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/429866/%3C%3E%20Kurt%20Mod%20-%207x7%20Duvar.user.js
// @updateURL https://update.greasyfork.org/scripts/429866/%3C%3E%20Kurt%20Mod%20-%207x7%20Duvar.meta.js
// ==/UserScript==

function disconnectPartyMembers(member = 1) {
    // Lider Olduğunuzdan Ve Onları Yönlendirecek Parti Üyelerine Sahip Olduğunuzdan Emin Olun.
    if (game.ui.playerPartyMembers[1] && game.ui.playerPartyMembers[0].playerUid == game.world.myUid) {
        let fnc1 = game.network.emitter._events.PACKET_RPC[15];
        let enabled = false;
        game.network.emitter._events.PACKET_RPC[15] = (data) => {
            if (enabled) {
                fnc1(data)
            }
        }
        let dcpacket1 = new Uint8Array(game.network.codec.encode(9, {name: "SetPartyMemberCanSell", uid: game.ui.playerPartyMembers[member].playerUid, canSell: 1}));
        let dcpacket2 = new Uint8Array(game.network.codec.encode(9, {name: "SetPartyMemberCanSell", uid: game.ui.playerPartyMembers[member].playerUid, canSell: 0}));
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
        if (e.message.toLowerCase() == "!alanyoket") {
            disconnectPartyMembers()
        }
        if (e.message.toLowerCase() == "!kendiniyoket") {
            game.network.socket.send([]);
        }
    }
})

// Her Hangi Bir Base de 49 lu Duvar Koyabilirsiniz Odununuzun Olması Yeterli
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
    //1 layer
    placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48 + 48)
    placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48 + 48);
    placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48);
    placeWall(gridPos.x, gridPos.y + 48 + 48 + 48);
    placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48 + 48);
    placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48 + 48);
    //2 layer
    placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48);
    placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
    placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
    placeWall(gridPos.x, gridPos.y + 48 + 48);
    placeWall(gridPos.x + 48, gridPos.y + 48 + 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48);
    placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48);
    //3 layer
    placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48);
    placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
    placeWall(gridPos.x - 48, gridPos.y + 48);
    placeWall(gridPos.x, gridPos.y);
    placeWall(gridPos.x + 48, gridPos.y + 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y + 48);
    placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48);
    //4 layer
    placeWall(gridPos.x - 48 - 48 - 48, gridPos.y);
    placeWall(gridPos.x - 48 - 48, gridPos.y);
    placeWall(gridPos.x - 48, gridPos.y);
    placeWall(gridPos.x, gridPos.y);
    placeWall(gridPos.x + 48, gridPos.y);
    placeWall(gridPos.x + 48 + 48, gridPos.y);
    placeWall(gridPos.x + 48 + 48 + 48, gridPos.y);
    //5 layer
    placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48);
    placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
    placeWall(gridPos.x - 48, gridPos.y - 48);
    placeWall(gridPos.x, gridPos.y - 48);
    placeWall(gridPos.x + 48, gridPos.y - 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y - 48);
    placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48);
    //6 layer
    placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48);
    placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48);
    placeWall(gridPos.x - 48, gridPos.y - 48 - 48);
    placeWall(gridPos.x, gridPos.y - 48 - 48);
    placeWall(gridPos.x + 48, gridPos.y - 48 - 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48);
    placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48);
    //7 layer
    placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48 - 48);
    placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48 - 48);
    placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48);
    placeWall(gridPos.x, gridPos.y - 48 - 48 - 48);
    placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48 - 48);
    placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48 - 48);
    }
})