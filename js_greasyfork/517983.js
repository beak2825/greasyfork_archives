// ==UserScript==
// @name         Optimized Krunker.IO Aimbot & ESP
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  High-performance aimbot and ESP for Krunker this auto locks on and tracks through walls
// @author       Original by Lokiion (Loki)
// @match        *://krunker.io/*
// @match        *://browserfps.com/*
// @exclude      *://krunker.io/social*
// @exclude      *://krunker.io/editor*
// @icon         https://www.google.com/s2/favicons?domain=krunker.io
// @grant        none
// @run-at       document-start
// @require      https://unpkg.com/three@0.150.0/build/three.min.js
// @downloadURL https://update.greasyfork.org/scripts/517983/Optimized%20KrunkerIO%20Aimbot%20%20ESP.user.js
// @updateURL https://update.greasyfork.org/scripts/517983/Optimized%20KrunkerIO%20Aimbot%20%20ESP.meta.js
// ==/UserScript==

const THREE = window.THREE;
delete window.THREE;

// Settings with default values
const settings = {
    aimbotEnabled: true,
    aimbotOnRightMouse: false,
    espEnabled: true,
    espLines: true,
    wireframe: false
};

// Key bindings
const keyBindings = {
    KeyB: 'aimbotEnabled',
    KeyL: 'aimbotOnRightMouse',
    KeyM: 'espEnabled',
    KeyN: 'espLines',
    KeyK: 'wireframe'
};

// Game state
let scene = null;
let rightMouseDown = false;

// Cached objects for performance
const tempVector = new THREE.Vector3();
const tempObject = new THREE.Object3D();
tempObject.rotation.order = 'YXZ';

// ESP Materials and Geometry
const espMaterial = new THREE.LineBasicMaterial({
    color: 0xff0000,
    depthTest: false
});

const boxGeometry = new THREE.EdgesGeometry(
    new THREE.BoxGeometry(5, 15, 5).translate(0, 7.5, 0)
);

// Line for ESP
const lineGeometry = new THREE.BufferGeometry();
const linePositions = new Float32Array(100 * 2 * 3);
lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

const line = new THREE.LineSegments(lineGeometry, espMaterial);
line.frustumCulled = false;

// Scene injection
const origArrayPush = Array.prototype.push;
Array.prototype.push = function() {
    try {
        if (arguments[0] && arguments[0].parent &&
            arguments[0].parent.type === 'Scene' &&
            arguments[0].parent.name === 'Main') {
            scene = arguments[0].parent;
            Array.prototype.push = origArrayPush;
            console.log('Scene injected!');
        }
    } catch(e) {}
    return origArrayPush.apply(this, arguments);
};

// Game logic
function findPlayers() {
    if (!scene) return { players: [], myPlayer: null };

    const players = [];
    let myPlayer = null;

    for (const child of scene.children) {
        if (child.type !== 'Object3D') continue;

        try {
            const camera = child.children[0]?.children[0];
            if (camera && camera.type === 'PerspectiveCamera') {
                myPlayer = child;
            } else if (child.children[0]) {
                players.push(child);
            }
        } catch(e) {}
    }

    return { players, myPlayer };
}

function updateESP(players, myPlayer) {
    if (!myPlayer) return null;

    let targetPlayer = null;
    let minDist = Infinity;
    let counter = 0;

    tempObject.matrix.copy(myPlayer.matrix).invert();

    for (const player of players) {
        // Skip if it's our own position
        if (player.position.x === myPlayer.position.x &&
            player.position.z === myPlayer.position.z) {
            continue;
        }

        // Create ESP box if needed
        if (!player.box && settings.espEnabled) {
            const box = new THREE.LineSegments(boxGeometry, espMaterial);
            box.frustumCulled = false;
            player.add(box);
            player.box = box;
        }

        // Update ESP visibility
        if (player.box) {
            player.box.visible = settings.espEnabled;
        }

        // Update ESP lines
        if (settings.espLines && counter < linePositions.length / 6) {
            linePositions[counter * 6] = 0;
            linePositions[counter * 6 + 1] = 10;
            linePositions[counter * 6 + 2] = -5;

            tempVector.copy(player.position)
                .add(new THREE.Vector3(0, 9, 0))
                .applyMatrix4(tempObject.matrix);

            linePositions[counter * 6 + 3] = tempVector.x;
            linePositions[counter * 6 + 4] = tempVector.y;
            linePositions[counter * 6 + 5] = tempVector.z;

            counter++;
        }

        // Track closest player for aimbot
        const dist = player.position.distanceTo(myPlayer.position);
        if (dist < minDist) {
            minDist = dist;
            targetPlayer = player;
        }
    }

    // Update line visibility
    line.geometry.attributes.position.needsUpdate = true;
    line.geometry.setDrawRange(0, counter * 2);
    line.visible = settings.espLines;

    return targetPlayer;
}

function aimbot(targetPlayer, myPlayer) {
    if (!settings.aimbotEnabled || !targetPlayer || !myPlayer ||
        (settings.aimbotOnRightMouse && !rightMouseDown)) {
        return;
    }

    // Get target position
    tempVector.setScalar(0);
    targetPlayer.children[0].children[0].localToWorld(tempVector);

    // Calculate aim
    tempObject.position.copy(myPlayer.position);
    tempObject.lookAt(tempVector);

    // Apply aim
    myPlayer.children[0].rotation.x = -tempObject.rotation.x;
    myPlayer.rotation.y = tempObject.rotation.y + Math.PI;
}

// Main game loop
function gameLoop() {
    requestAnimationFrame(gameLoop);

    const { players, myPlayer } = findPlayers();
    if (!players.length || !myPlayer) return;

    const targetPlayer = updateESP(players, myPlayer);
    aimbot(targetPlayer, myPlayer);
}

// Event handlers
window.addEventListener('pointerdown', e => {
    if (e.button === 2) rightMouseDown = true;
});

window.addEventListener('pointerup', e => {
    if (e.button === 2) rightMouseDown = false;
});

window.addEventListener('keyup', e => {
    if (document.activeElement?.value !== undefined) return;

    const setting = keyBindings[e.code];
    if (setting) {
        settings[setting] = !settings[setting];
        showMessage(`${setting}: ${settings[setting] ? 'ON' : 'OFF'}`);
    }
});

// UI
function showMessage(text) {
    let msgEl = document.querySelector('.hack-message');
    if (!msgEl) {
        msgEl = document.createElement('div');
        msgEl.className = 'hack-message';
        msgEl.style.cssText = `
            position: fixed;
            left: 20px;
            bottom: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: #fff;
            padding: 10px 15px;
            font-family: monospace;
            font-size: 14px;
            border-radius: 4px;
            z-index: 999999;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(msgEl);
    }

    msgEl.textContent = text;
    msgEl.style.opacity = '1';

    clearTimeout(msgEl.fadeTimeout);
    msgEl.fadeTimeout = setTimeout(() => {
        msgEl.style.opacity = '0';
    }, 2000);
}

// Start the script
console.log('Starting Krunker hack...');
gameLoop();
