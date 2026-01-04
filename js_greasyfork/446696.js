// ==UserScript==
// @name         Auto Rebuilder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hi
// @author       You
// @match        zombs.io
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446696/Auto%20Rebuilder.user.js
// @updateURL https://update.greasyfork.org/scripts/446696/Auto%20Rebuilder.meta.js
// ==/UserScript==

/*** REBUILDER ***/

const getIsBuilding = (entity) => {
    return [
        "MeleeTower",
        "BombTower",
        "ArrowTower",
        "CannonTower",
        "Harvester",
        "Wall",
        "Door",
        "SlowTrap",
        "MagicTower",
        "GoldMine"
    ].includes(entity.model);
};

if(!window.baseSave) {
    window.baseSave = "[]";
};

const getGoldStash = () => {
    let entities = game.ui.buildings;
    for (let uid in entities) {
        if (!entities.hasOwnProperty(uid)) {
            continue
        };
        let obj = entities[uid];
        if (obj.type == "GoldStash") {
            return obj;
        };
    };
};

window.saveBase = () => {
    let stash = getGoldStash();
    if (stash == undefined) return;
    let stashPosition = {
        x: stash.x,
        y: stash.y
    };
    let parsedSavedStorage = [];
    for(let i in game.world.entities) {
        let entity = game.world.entities[i];
        if(getIsBuilding(entity.fromTick)) {
            parsedSavedStorage.push({
                buildingType: entity.fromTick.model,
                stashOffsetX: stash.x - entity.targetTick.position.x,
                stashOffsetY: stash.y - entity.targetTick.position.y
            });
        };
    };
    window.baseSave = JSON.stringify(parsedSavedStorage);
};

window.buildBase = () => {
    let stash = getGoldStash();
    if (stash == undefined) return;
    let stashPosition = {
        x: stash.x,
        y: stash.y
    };
    let parsedSavedStorage = window.baseSave;
    if(parsedSavedStorage) {
        parsedSavedStorage = JSON.parse(window.baseSave);
        for(let i of parsedSavedStorage) {
            game.network.sendRpc2({
                name: "MakeBuilding",
                type: i.buildingType,
                x: Math.round(parseInt(stash.x) - i.stashOffsetX),
                y: Math.round(parseInt(stash.y) - i.stashOffsetY),
                yaw: 0
            });
        };
    };
};

window.toggleRebuilder = () => {
    let parsedSavedStorage = window.baseSave;
    if(parsedSavedStorage) {
        parsedSavedStorage = JSON.parse(window.baseSave);
        if(!window.rebuilderInterval) {
            window.saveBase();
            window.rebuilderInterval = setInterval(() => {
                window.buildBase();
                for(let i in game.world.entities) {
                    let entity = game.world.entities[i];
                    if(getIsBuilding(entity.fromTick)) {
                        game.network.sendRpc2({ name: "UpgradeBuilding", uid: parseInt(i) });
                    };
                };
            }, 333);
        } else {
            window.rebuilderInterval = clearInterval(window.rebuilderInterval);
        };
    } else {
        new Noty({
            type: "error",
            layout: "topRight",
            text: "You do not have a base saved.",
            timeout: 2000
        });
    };
};

game.ui.components.PopupOverlay.showHint2 = game.ui.components.PopupOverlay.showHint;
game.ui.components.PopupOverlay.showHint = (a, b) => {
    if(a.includes("can't") && window.getRebuilderToggle()) { return; };
    game.ui.components.PopupOverlay.showHint2(a, b);
};

window.getRebuilderToggle = () => !!window.rebuilderInterval;

/*

let attemptedTowers = [];
let successfulAttemptedTowers = [];
let atids = [];
let rebuiltData = [];
let toggle;
let rebuildData = [];
let rebuiltTowers = [];
let waitRebuildData = [];

let antiAnnoyingAutobuildBreakerKasap = {};
let deadbuildings = {};

setInterval(() => {
    for (let i in deadbuildings) {
        game.network.sendRpc({name: "MakeBuilding", x: deadbuildings[i].x, y: deadbuildings[i].y, type: deadbuildings[i].type, yaw: 0});
    }
}, 350)
game.network.addRpcHandler("LocalBuilding", (data) => {
    if(!toggle) { return; };
    for(let e of data) {
        if (antiAnnoyingAutobuildBreakerKasap[e.uid]) {
            return;
        }
        if (e.dead && !antiAnnoyingAutobuildBreakerKasap[e.uid]) {
            antiAnnoyingAutobuildBreakerKasap[e.uid] = 1;
            setTimeout(() => {
                delete antiAnnoyingAutobuildBreakerKasap[e.uid];
            }, 500)
        }
        if (!e.dead) {
            if (deadbuildings[`${e.x} - ${e.y} - ${e.tier}`]) {
                delete deadbuildings[`${e.x} - ${e.y} - ${e.tier}`];
            }
        }
        if(!!e.dead) {
            deadbuildings[`${e.x} - ${e.y} - ${e.tier}`] = e;
            rebuildData.push(`${e.x} - ${e.y} - ${e.tier}`);
            let snb = e;
            snb.name = "MakeBuilding";
            snb.yaw = e.yaw || 0;
            game.network.sendRpc(snb);
            setTimeout(() => {
                if(!rebuiltData.includes(`${e.x} - ${e.y} - ${e.tier} - ${e.yaw || 0} - ${e.type}`)) {
                    let id = Math.floor(Math.random() * 999999).toString(25);
                    console.log(`rb set atid ${id}`);
                    window[`attempts${id}`] = setInterval(() => {
                        let comb = `${e.x} - ${e.y} - ${e.tier} - ${e.type}`;
                        if(successfulAttemptedTowers.includes(comb)) {
                            setTimeout(() => {
                                for(let i = 1; i < e.tier; i++) {
                                    game.network.sendRpc({ name: "UpgradeBuilding", uid: e.uid });
                                };
                                rebuiltTowers.push(`${e.x} - ${e.y} - ${e.tier} - ${e.yaw} - ${e.type} - ${e.uid}`);
                                rebuiltData.push(`${e.x} - ${e.y} - ${e.tier} - ${e.yaw} - ${e.type}`);
                            }, game.world.replicator.msPerTick);
                            console.log(`rb clear atid ${id}`);
                            clearInterval(window[`attempts${id}`]);
                        };
                    }, game.world.replicator.msPerTick);
                };
            }, game.world.replicator.msPerTick * 3);
            continue;
        };
        if(!rebuildData.includes(`${e.x} - ${e.y} - ${e.tier}`)) { continue; };
        let args = rebuildData[rebuildData.indexOf(`${e.x} - ${e.y} - ${e.tier}`)].split(" - ").map(i => parseInt(i));
        if(!e.dead) {
            if(attemptedTowers.includes(`${e.x} - ${e.y} - ${args[2]} - ${e.type}`)) {
                successfulAttemptedTowers.push(`${e.x} - ${e.y} - ${args[2]} - ${e.type}`);
                setTimeout(() => {
                    for(let i = 1; i < args[2]; i++) {
                        game.network.sendRpc({ name: "UpgradeBuilding", uid: e.uid });
                    };
                    rebuiltTowers.push(`${e.x} - ${e.y} - ${args[2]} - ${e.yaw} - ${e.type} - ${e.uid}`);
                    rebuiltData.push(`${e.x} - ${e.y} - ${args[2]} - ${e.yaw} - ${e.type}`);
                }, game.world.replicator.msPerTick);
            };
            if(e.x == args[0] && e.y == args[1]) {
                setTimeout(() => {
                    if(game.world.entities[e.uid]) {
                        for(let i = 1; i < args[2]; i++) {
                            game.network.sendRpc({ name: "UpgradeBuilding", uid: e.uid });
                        };
                        rebuiltTowers.push(`${e.x} - ${e.y} - ${args[2]} - ${e.yaw} - ${e.type} - ${e.uid}`);
                        rebuiltData.push(`${e.x} - ${e.y} - ${args[2]} - ${e.yaw} - ${e.type}`);
                    };
                }, game.world.replicator.msPerTick);
            };
        };
    };
});
*/
