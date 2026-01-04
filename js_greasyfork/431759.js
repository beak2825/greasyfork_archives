// ==UserScript==
// @name         9x9 Wall
// @namespace    http://tampermonkey.net/
// @version      12.2
// @description  BASILI TUTARAK KOYUNCA ÇALIŞIR Fazla wood kasmak gereklidir
// @author       TC Kurt .)
// @match        zombs.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431759/9x9%20Wall.user.js
// @updateURL https://update.greasyfork.org/scripts/431759/9x9%20Wall.meta.js
// ==/UserScript==



//9x9 Wall
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
            y: cellAverages.y * cellSize + cellSize/2,
        };
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x, gridPos.y + 48 + 48 + 48);
       placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x, gridPos.y + 48 + 48)
        placeWall(gridPos.x + 48, gridPos.y + 48 + 48)
        placeWall(gridPos.x + 48 +48, gridPos.y + 48 + 48)
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48);
        placeWall(gridPos.x, gridPos.y + 48);
        placeWall(gridPos.x + 48, gridPos.y + 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48)
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y);
        placeWall(gridPos.x - 48 - 48, gridPos.y);
        placeWall(gridPos.x - 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y);
        placeWall(gridPos.x + 48, gridPos.y);
        placeWall(gridPos.x + 48 + 48, gridPos.y )
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
        placeWall(gridPos.x - 48, gridPos.y - 48);
        placeWall(gridPos.x, gridPos.y - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48)
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48)
        placeWall(gridPos.x - 48, gridPos.y - 48 - 48)
        placeWall(gridPos.x, gridPos.y - 48 - 48)
        placeWall(gridPos.x + 48, gridPos.y - 48 - 48)
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48)
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x, gridPos.y - 48 - 48 - 48 - 48);
       placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48);

    }
})