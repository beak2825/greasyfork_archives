// ==UserScript==
// @name         Krunker.IO Aimbot + ESP (Menu on L)
// @namespace    https://greasyfork.org/users/662330-zertalious
// @version      0.4.0
// @description  Aimbot & ESP with toggleable menu (press L). Works on Krunker.io and browserfps.com.
// @author       Zertalious (fixed by K50)
// @match        *://krunker.io/*
// @match        *://browserfps.com/*
// @exclude      *://krunker.io/social*
// @exclude      *://krunker.io/editor*
// @icon         https://www.google.com/s2/favicons?domain=krunker.io
// @grant        none
// @run-at       document-idle
// @require      https://unpkg.com/three@0.150.0/build/three.min.js
// @downloadURL https://update.greasyfork.org/scripts/542899/KrunkerIO%20Aimbot%20%2B%20ESP%20%28Menu%20on%20L%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542899/KrunkerIO%20Aimbot%20%2B%20ESP%20%28Menu%20on%20L%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let scene, myPlayer;
    let rightMouseDown = false;
    let menuVisible = false;

    const settings = {
        aimbotEnabled: true,
        aimbotOnRightMouse: false,
        espEnabled: true,
        espLines: true,
        wireframe: false
    };

    const keyToSetting = {
        KeyB: 'aimbotEnabled',
        KeyM: 'espEnabled',
        KeyN: 'espLines',
        KeyK: 'wireframe'
    };

    const gui = createMenu();
    gui.style.display = 'none'; // Start hidden

    window.addEventListener('keyup', e => {
        if (e.code === 'KeyL') {
            menuVisible = !menuVisible;
            gui.style.display = menuVisible ? '' : 'none';
        }
        if (menuVisible && keyToSetting[e.code]) {
            toggleSetting(keyToSetting[e.code]);
        }
    });

    window.addEventListener('pointerdown', e => {
        if (e.button === 2) rightMouseDown = true;
    });
    window.addEventListener('pointerup', e => {
        if (e.button === 2) rightMouseDown = false;
    });

    function toggleSetting(key) {
        settings[key] = !settings[key];
        updateMenu();
    }

    function updateMenu() {
        for (const key in settings) {
            const el = document.getElementById(`toggle-${key}`);
            if (el) {
                el.innerText = settings[key] ? 'ON' : 'OFF';
                el.style.color = settings[key] ? 'lime' : 'red';
            }
        }
    }

    function createMenu() {
        const menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.top = '10px';
        menu.style.right = '10px';
        menu.style.background = 'rgba(0, 0, 0, 0.8)';
        menu.style.color = '#fff';
        menu.style.padding = '10px';
        menu.style.border = '2px solid #fff';
        menu.style.zIndex = 99999;
        menu.style.fontFamily = 'monospace';
        menu.innerHTML = `
            <h4 style="margin:0 0 10px 0;">Krunker.IO Cheats</h4>
            ${Object.keys(settings).map(key => `
                <div>
                    ${key}: <span id="toggle-${key}">${settings[key] ? 'ON' : 'OFF'}</span>
                </div>`).join('')}
            <p style="margin-top:10px;">[L]=Menu [B/M/N/K]=Toggle Cheats</p>`;
        document.body.appendChild(menu);
        return menu;
    }

    const tempVector = new THREE.Vector3();
    const tempObject = new THREE.Object3D();
    tempObject.rotation.order = 'YXZ';

    const geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(5, 15, 5).translate(0, 7.5, 0));
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const wireframeMaterial = new THREE.MeshBasicMaterial({ wireframe: true });

    const line = new THREE.LineSegments(new THREE.BufferGeometry(), material);
    line.frustumCulled = false;
    const linePositions = new THREE.BufferAttribute(new Float32Array(100 * 2 * 3), 3);
    line.geometry.setAttribute('position', linePositions);

    function gameLoop() {
        requestAnimationFrame(gameLoop);
        if (!scene) findScene();
        if (!scene) return;

        const players = [];
        scene.traverse(obj => {
            if (obj.type === 'Object3D' && obj.children.length > 0) {
                try {
                    if (obj.children[0].children[0]?.type === 'PerspectiveCamera') {
                        myPlayer = obj;
                    } else {
                        players.push(obj);
                    }
                } catch {}
            }
        });

        if (!myPlayer) return;

        let counter = 0;
        let targetPlayer;
        let minDistance = Infinity;

        tempObject.matrix.copy(myPlayer.matrix).invert();

        for (const player of players) {
            if (!player.box) {
                const box = new THREE.LineSegments(geometry, material);
                box.frustumCulled = false;
                player.add(box);
                player.box = box;
            }

            player.box.visible = settings.espEnabled;
            player.children.forEach(child => {
                if (child.material) {
                    child.material.wireframe = settings.wireframe;
                }
            });

            if (player.position.equals(myPlayer.position)) continue;

            linePositions.setXYZ(counter++, 0, 10, -5);
            tempVector.copy(player.position).y += 9;
            tempVector.applyMatrix4(tempObject.matrix);
            linePositions.setXYZ(counter++, tempVector.x, tempVector.y, tempVector.z);

            const distance = player.position.distanceTo(myPlayer.position);
            if (distance < minDistance) {
                targetPlayer = player;
                minDistance = distance;
            }
        }

        linePositions.needsUpdate = true;
        line.geometry.setDrawRange(0, counter);
        line.visible = settings.espLines;

        if (settings.aimbotEnabled && (!settings.aimbotOnRightMouse || rightMouseDown) && targetPlayer) {
            tempVector.setScalar(0);
            targetPlayer.children[0]?.children[0]?.localToWorld(tempVector);
            tempObject.position.copy(myPlayer.position);
            tempObject.lookAt(tempVector);
            myPlayer.children[0].rotation.x = -tempObject.rotation.x;
            myPlayer.rotation.y = tempObject.rotation.y + Math.PI;
        }
    }

    function findScene() {
        const gameObjects = Object.values(window).filter(obj =>
            obj && typeof obj === 'object' && obj.isScene
        );
        if (gameObjects.length > 0) {
            scene = gameObjects[0];
            console.log('Krunker Cheat: Scene hooked!');
        }
    }

    gameLoop();
})();
