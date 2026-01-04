// ==UserScript==
// @name         building overlay for zombs.io
// @namespace    http://tampermonkey.net/
// @version      7.27 (wysi edition)
// @description  overlays base encoded using apex's base saving system
// @author       r word the sequel
// @match        http://zombs.io/
// @icon         -
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446340/building%20overlay%20for%20zombsio.user.js
// @updateURL https://update.greasyfork.org/scripts/446340/building%20overlay%20for%20zombsio.meta.js
// ==/UserScript==

let goldStash,
    towerCodes = ["Wall", "Door", "SlowTrap", "ArrowTower", "CannonTower", "MeleeTower", "BombTower", "MagicTower", "GoldMine", "Harvester"];

Game.currentGame.network.addRpcHandler("LocalBuilding", buildings => {
    goldStash = Object.values(Game.currentGame.ui.buildings).find(building => building.type == "GoldStash");
});

game.ui.components.PlacementOverlay.showOverlay = function (design) {
    this.buildingId && this.cancelPlacing();
    this.overlayEntities && (this.overlayEntities.length > 0 && this.overlayEntities.map(e => game.renderer.ui.removeAttachment(e)));
    this.overlayEntities = [];
    this.overlayDesign = design;
    this.isShowingOverlay = true;
    game.renderer.follow(game.world.entities[goldStash.uid]);
    setTimeout(() => {
        const towers = design.split(";"),
              schema = this.ui.getBuildingSchema();

        for (let towerStr of towers) {
            const [type, xWorld, yWorld, yaw] = towerStr.split(",");

            if (type === "") continue;
            // if (tower.length < 4) return;

            const buildingType = schema[towerCodes[parseInt(type)]],
                  placeholderEntity = Game.currentGame.assetManager.loadModel(buildingType.modelName, {}),
                  { x, y } = game.renderer.worldToUi(goldStash.x - parseInt(xWorld), goldStash.y - parseInt(yWorld));
            placeholderEntity.setAlpha(0.5);
            placeholderEntity.setRotation(parseInt(yaw));
            placeholderEntity.setPosition(x, y);

            Game.currentGame.renderer.ui.addAttachment(placeholderEntity);
            this.overlayEntities.push(placeholderEntity);
        }
    }, 100)
}

game.ui.components.PlacementOverlay.hideOverlay = function() {
    for (let entity of this.overlayEntities) game.renderer.ui.removeAttachment(entity);
    game.renderer.follow(game.world.entities[game.world.myUid]);
    this.isShowingOverlay = false;
    this.overlayDesign = null;
}

game.ui.components.PlacementOverlay.onResize = function() {
    this.isShowingOverlay && game.ui.components.PlacementOverlay.showOverlay(this.overlayDesign);
}

// maintaining maximum compatibility working with other scripts
window.onresize && (window.oldOnResize = window.onresize);
window.zoom && (window.oldZoom = window.zoom);
window.onresize = (e) => {
    window.oldOnResize && window.oldOnResize(e);
    game.ui.components.PlacementOverlay.onResize();
}
window.zoom = (e) => {
    window.oldZoom && window.oldZoom(e);
    game.ui.components.PlacementOverlay.onResize();
}