// ==UserScript==
// @name         Cryzen.io King
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Free ad-rewards, player ESP, anti recoil
// @author       You
// @match        https://cryzen.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryzen.io
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505150/Cryzenio%20King.user.js
// @updateURL https://update.greasyfork.org/scripts/505150/Cryzenio%20King.meta.js
// ==/UserScript==

const { log, debug, warn, error } = console;

const _assign = Object.assign;
const _create = Object.create;
const _defineProperty = Object.defineProperty;
const _parse = JSON.parse;

Object.create = function create() {
    if (!arguments[0]) return {};
    return _create.apply(this, arguments);
};

Object.defineProperty = function defineProperty() {
    const ret = _defineProperty.apply(this, arguments);
    if (arguments[1] === 'player') {
        setTimeout(() => {
            if (Object.getOwnPropertyNames(arguments[0]).includes('gameWorld')) window.hooked = ret;
        }, 1000);
    }
    return ret;
};

Object.defineProperty(Object.prototype, 'player', {
    get() {
        return this.__player;
    },
    set(v) {
        this.__player = v;
    }
});

let cheatInterval;
function cheatingIsFun() {
    if (cheatInterval) {
        clearInterval(cheatInterval);
        cheatInterval = null;
        return;
    }

    cheatInterval = setInterval(() => {
        if (!window.hooked?.gameWorld) return;

        // Player ESP
        try {
            for (const key in window.hooked.gameWorld.server.players) {
                const plr = window.hooked.gameWorld.server.players[key];
                if (!plr || !Array.isArray(plr?.model?.children)) continue;
                const { isEnemy } = plr;
                plr.model.children.forEach(parent => {
                    if (!Array.isArray(parent.children)) return;
                    parent.children.forEach(child => {
                        if (!child.material || child.type !== 'SkinnedMesh') return;
                        child.material.depthTest = (isEnemy) ? false : true;
                        child.material.transparent = (isEnemy) ? true : false;
                    });
                });
            }
        } catch (e) { console.error(e); }

        // CORRECT_POSITION removal
        try {
            let correctPos = Object.entries(window.hooked.gameWorld.server.msgsListeners).find(x => x[1].toString().includes('correct p'));
            if (correctPos) {
                delete window.hooked.gameWorld.server.msgsListeners[correctPos[0]];
                window.hooked.gameWorld.server.addMsgListener(correctPos[0], () => { });
            }
        } catch { }

        try {
            //const physicsSystem = window.hooked.gameWorld.systemsManager.activeExecuteSystems.find(x => x.playerPhysicsSystem);
            if (window?.hooked?.gameWorld?.player?.settings) {
                Object.defineProperty(window.hooked.gameWorld.player.settings, 'aimAssist', {
                    get() { return true; },
                    set() { },
                });
            }
        } catch { }

        hookPokiSDK();
    }, 100);
}

setTimeout(() => {
    cheatingIsFun();
}, 5000);

/* No Spread */
const _random = Math.random;
_defineProperty(Math, 'random', {
    set(value) {
        _random = value;
    },
    get() {
        try {
            throw new Error();
        } catch (error) {
            const stack = error.stack;
            if (stack.includes('shoot')) {
                return _ => .5;
            }
        }
        return _random;
    }
});

/* Removed for desync issues lol
function tp(x = 0, y = 0, z = 0, relative = true) {
    try {
        const physicsSystem = window.hooked.gameWorld.systemsManager.activeExecuteSystems.find(x => x.playerPhysicsSystem);
        const localPos = window.hooked.gameWorld.threeScene.camera.position;
        if (physicsSystem) {
            if (relative) {
                const A = new localPos.constructor(localPos.x + x, localPos.y + y, localPos.z + z);
            } else {
                const A = new localPos.constructor(x, y, z);
            }
            physicsSystem.playerPhysicsSystem.updatePlayerPosAndRot(A, false);
        } else {
            if (relative) {
                window.hooked.gameWorld.player.position.set(x, y + window.hooked.gameWorld.player.physics.height / 2, z)
            } else {
                window.hooked.gameWorld.player.position.x += x;
                window.hooked.gameWorld.player.position.y += y;
                window.hooked.gameWorld.player.position.z += z;
            }
        }
    } catch (e) {
        console.error(e);
    }
}

// Keystokes Stuff
function allowBinds() {
    if (!document) return false;
    return (
        document?.pointerLockElement &&
        document?.activeElement?.tagName !== 'INPUT'
    );
}

const pressedKeys = {
    allowBackquote: true,
    allowPeriod: true,
    allowComma: true
};

function unlockKey(code) {
    pressedKeys[`allow${code}`] = true;
}

window.addEventListener('keydown', (event) => {
    pressedKeys[event.code] = true;
});

// Event listener for when a key is released
window.addEventListener('keyup', (event) => {
    pressedKeys[event.code] = false;
});

function keybindsLoop() {
    if (allowBinds()) {
        if (pressedKeys['Space']) {
            if (window?.hooked?.gameWorld) {
                tp(0, 2, 0);
            }
        }
    }
    requestAnimationFrame(keybindsLoop);
}
*/

// Ad stuff
function hookPokiSDK() {
    if (!window?.PokiSDK) return console.warn('PokiSDK not defined');
    if (window.PokiSDK.hooked) return;

    try {
        function resolveTrue() { return Promise.resolve(true); }
        Object.defineProperties(window.PokiSDK, {
            'rewardedBreak': {
                get() {
                    return resolveTrue.bind(this);
                },
                set() { },
            },
            'commercialBreak': {
                get() {
                    return resolveTrue.bind(this);
                },
                set() { },
            },
            'hooked': {
                get() {
                    return true;
                },
                set() { },
            },
        });
    } catch {
        console.error('PokiSDK hook failed');
    }
};