// ==UserScript==
// @name         Cryzen enemy nickname display
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Shows some additional visual legal info in cryzen
// @author       StickySkull
// @match        https://cryzen.io/*
// @icon         https://media.discordapp.net/attachments/921558341791129671/1173312514885423114/image.png
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/479634/Cryzen%20enemy%20nickname%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/479634/Cryzen%20enemy%20nickname%20display.meta.js
// ==/UserScript==

let THREE;
fetch('https://unpkg.com/three@0.160.0/build/three.min.js', {}).then(response => response.text()).then(library => {
    const threeStorage = {};
    Function("globalThis", library)(threeStorage);
    THREE = threeStorage.THREE;
});

function addNickname(player, model, color, depthTest) {
    model.updateMatrixWorld(!0);
    if (model.getObjectByName("nameSprite")) {
        return;
    }
    const G = drawNickname(100, player.name, color, depthTest, player.level);
    const w = G.sprite;
    w.name = "nameSprite";
    const e = model.getObjectByName("mixamorigSpine");
    e.add(w);
    let y = new THREE.Vector3().setFromMatrixScale(e.matrixWorld);
    if (y.x == 1 || y.y == 1 || y.z == 1) {
        y.set(.008680473178757366, .008680473620956343, .008680473620871293)
    }

    w.scale.x *= 1 / y.x;
    w.scale.y *= 1 / y.y;
    w.scale.z *= 1 / y.z;
    G.sprite.position.y = (1.8 + .2) * (1 / y.y / 2) - G.scale * .025 * (1 / y.y / 2);
}

function drawNickname(fontSize, name, color="#FFFFFF", depthTest=true, level=1) {
    // name = name + ' ' + level;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = "500 " + fontSize + 'px "Sofia Sans Semi Condensed"';
    let i = 10;
    const o = context.measureText(name).width;
    const a = fontSize / 30;
    const G = fontSize * 1.2;
    const w = 6 + i;
    const e = 30;
    canvas.width = o + w + e;
    canvas.height = G;
    context.font = "500 " + fontSize + 'px "Sofia Sans Semi Condensed"';
    context.fillStyle = color;
    context.fillText(name, w, fontSize - a);
    const textTexture = new THREE.Texture(canvas);
    textTexture.needsUpdate = !0;
    textTexture.encoding = 3001;
    textTexture.minFilter = 1003;
    textTexture.magFilter = 1003;
    const spriteMaterial = new THREE.SpriteMaterial({
        map: textTexture,
        depthTest: depthTest,
        transparent: !1,
        alphaTest: .1
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.renderOrder = 1003;
    const Y = (name.length - 7) * .1;
    sprite.scale.set(1 + Y, 1 + Y, 1).multiplyScalar(.7);
    sprite.scale.y *= canvas.height / canvas.width;
    canvas.remove();
    return {
        scale: Y,
        sprite: sprite
    }
}

const defineProperty = Object.defineProperty;
defineProperty(window.Object.prototype, "systemsManager", {});
window.Object.defineProperty = new Proxy(defineProperty, {
    apply(target, thisArg, args) {
        if (args[1] == 'systemsManager') {
            let systemsManager;
            args[2] = {
                set(value) {
                    init(systemsManager = value);
                },
                get() {
                    return systemsManager;
                }
            }
        }
        return Reflect.apply(...arguments);
    }
});

function init(systemManager) {
    systemManager.activeExecuteSystems.push(new EnemyUsernameSystem(systemManager));
}

class EnemyUsernameSystem {
    constructor(systemManager) {
        this.priority = 9900;
        this.systemManager = systemManager;
    }

    execute() {
        const gameWorldSystem = this.systemManager.activeExecuteSystems.find(instance => instance.gameWorld && instance.gameWorld.server);
        if (!gameWorldSystem) {
            return;
        }
        const gameWorld = gameWorldSystem.gameWorld;
        const players = gameWorld.server.players;
        for (const index in players) {
            const player = players[index];
            if (!player.model) {
                continue;
            }
            addNickname(player, player.model, "#FF5555", true);
        }
    }
}