// ==UserScript==
// @name         Krunker.IO Aimbot & ESP
// @namespace    https://greasyfork.org/users/662330-zertalious
// @version      0.3.2
// @description  Aimbot locks to nearest player & ESP shows players behind walls. Press [L] to open menu. Toggle: [B]=Aimbot, [M]=ESP, [N]=ESP Lines, [K]=Wireframe.
// @author       Zertalious (fixed by K50)
// @match        *://krunker.io/*
// @match        *://browserfps.com/*
// @exclude      *://krunker.io/social*
// @exclude      *://krunker.io/editor*
// @icon         https://www.google.com/s2/favicons?domain=krunker.io
// @grant        none
// @run-at       document-start
// @require      https://unpkg.com/three@0.150.0/build/three.min.js
// @downloadURL https://update.greasyfork.org/scripts/542898/KrunkerIO%20Aimbot%20%20ESP.user.js
// @updateURL https://update.greasyfork.org/scripts/542898/KrunkerIO%20Aimbot%20%20ESP.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const THREE = window.THREE;
    delete window.THREE;

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

    let menuVisible = false;
    const gui = createGUI();
    gui.style.display = 'none'; // Start hidden

    let scene;

    const tempVector = new THREE.Vector3();
    const tempObject = new THREE.Object3D();
    tempObject.rotation.order = 'YXZ';

    const geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(5, 15, 5).translate(0, 7.5, 0));
    const material = new THREE.RawShaderMaterial({
        vertexShader: `
            attribute vec3 position;
            uniform mat4 projectionMatrix;
            uniform mat4 modelViewMatrix;
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                gl_Position.z = 1.0;
            }`,
        fragmentShader: `
            void main() {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            }`
    });

    const line = new THREE.LineSegments(new THREE.BufferGeometry(), material);
    line.frustumCulled = false;
    const linePositions = new THREE.BufferAttribute(new Float32Array(100 * 2 * 3), 3);
    line.geometry.setAttribute('position', linePositions);

    let rightMouseDown = false;

    window.addEventListener('pointerdown', e => {
        if (e.button === 2) rightMouseDown = true;
    });
    window.addEventListener('pointerup', e => {
        if (e.button === 2) rightMouseDown = false;
    });

    window.addEventListener('keyup', e => {
        if (e.code === 'KeyL') {
            menuVisible = !menuVisible;
            gui.style.display = menuVisible ? '' : 'none';
        }
        if (menuVisible && keyToSetting[e.code]) {
            toggleSetting(keyToSetting[e.code]);
        }
    });

    function toggleSetting(key) {
        settings[key] = !settings[key];
        updateGUI();
    }

    function updateGUI() {
        for (const key in settings) {
            const el = document.getElementById(`toggle-${key}`);
            if (el) {
                el.innerText = settings[key] ? 'ON' : 'OFF';
                el.style.color = settings[key] ? 'lime' : 'red';
            }
        }
    }

    function createGUI() {
        const guiEl = document.createElement('div');
        guiEl.style.position = 'fixed';
        guiEl.style.top = '10px';
        guiEl.style.right = '10px';
        guiEl.style.background = 'rgba(0, 0, 0, 0.8)';
        guiEl.style.color = '#fff';
        guiEl.style.padding = '10px';
        guiEl.style.border = '2px solid #fff';
        guiEl.style.zIndex = 99999;
        guiEl.style.fontFamily = 'monospace';
        guiEl.innerHTML = `
            <h4 style="margin:0 0 10px 0;">Krunker.IO Cheat Menu</h4>
            ${Object.keys(settings).map(key => `
                <div>
                    ${key}: <span id="toggle-${key}">${settings[key] ? 'ON' : 'OFF'}</span>
                </div>`).join('')}
            <p style="margin-top:10px;">[L]=Toggle Menu, [B/M/N/K]=Toggle Features</p>`;
        document.body.appendChild(guiEl);
        return guiEl;
    }

    function animate() {
        requestAnimationFrame(animate);
        if (!scene) findScene();
        if (!scene) return;

        const players = [];
        let myPlayer;

        for (const child of scene.children) {
            if (child.type === 'Object3D') {
                try {
                    if (child.children[0]?.children[0]?.type === 'PerspectiveCamera') {
                        myPlayer = child;
                    } else {
                        players.push(child);
                    }
                } catch {}
            } else if (child.material) {
                child.material.wireframe = settings.wireframe;
            }
        }

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

        if (!settings.aimbotEnabled || (settings.aimbotOnRightMouse && !rightMouseDown) || !targetPlayer) return;

        tempVector.setScalar(0);
        targetPlayer.children[0]?.children[0]?.localToWorld(tempVector);
        tempObject.position.copy(myPlayer.position);
        tempObject.lookAt(tempVector);
        myPlayer.children[0].rotation.x = -tempObject.rotation.x;
        myPlayer.rotation.y = tempObject.rotation.y + Math.PI;
    }

    function findScene() {
        const el = document.querySelector('#loadingBg');
        if (el && el.style.display === 'none') {
            Array.prototype.push = function () {
                try {
                    if (arguments[0]?.parent?.type === 'Scene') {
                        scene = arguments[0].parent;
                        console.log('Krunker Cheat: Scene injected!');
                        Array.prototype.push = Array.prototype.push;
                    }
                } catch {}
                return Array.prototype.push.apply(this, arguments);
            };
        }
    }

    animate();
})();
