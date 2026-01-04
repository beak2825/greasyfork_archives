// ==UserScript==
// @name        Krunker Cheating Software 0.8.0
// @name:de Krunker Cheating Software 0.8.0
// @namespace    http://tampermonkey.net/
// @version      0.8.0
// @description  Enhanced Krunker Cheat Script (v0.8.0) with AimBot, AimAssist, ESP, High Jump, FPS Boost, Speed Boost, Auto Shoot, Auto Jump and Recoil Compensation
// @description:de Gratis Krunker Cheating Software; Mod Menu; ESP, AimBot, Recoil Comp und viel mehr. Erlebe Krunker.io wie nie zuvor mit diesem leistungsstarken Mod-Menü! Aktiviere Aimbot für perfektes automatisches Zielen, nutze ESP (Wallhack), um Gegner durch Wände zu sehen, verbessere dein Gameplay mit Aim-Assist, springe höher als je zuvor mit High Jump und eliminiere den Rückstoß deiner Waffen dank Recoil-Kompensation. Hol dir den ultimativen Vorteil und dominiere jede Runde mit Leichtigkeit!
// @match        krunker.io/*
// @match        browserfps.com/*
// @exclude      *://krunker.io/social*
// @exclude      *://krunker.io/editor*
// @icon         https://www.google.com/s2/favicons?domain=krunker.io
// @grant        none
// @run-at       document-end
// @require      https://unpkg.com/three@0.150.0/build/three.min.js
// @downloadURL https://update.greasyfork.org/scripts/520948/Krunker%20Cheating%20Software%20080.user.js
// @updateURL https://update.greasyfork.org/scripts/520948/Krunker%20Cheating%20Software%20080.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /************* CSS Styles *************/
    const style = document.createElement('style');
    style.innerHTML = `
    .msg {
        position: absolute;
        left: 10px;
        bottom: 10px;
        color:#fff;
        background: rgba(0, 0, 0, 0.6);
        font-weight: bolder;
        padding: 15px;
        animation: msg 0.5s forwards, msg 0.5s reverse forwards 3s;
        z-index: 999999;
        pointer-events: none;
        font-family: Arial, sans-serif;
    }
    @keyframes msg {
        from {transform: translate(-120%, 0);}
        to {transform: none;}
    }
    .zui {
        position: fixed;
        right: 10px;
        top: 10px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        font-family: Arial, sans-serif;
        font-size: 14px;
        color:#fff;
        width: 250px;
        user-select: none;
        border-radius: 8px;
        overflow: hidden;
        background: linear-gradient(135deg, #333, #222);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        border: 1px solid #000;
        color:#fff;
    }
    .zui-header {
        background: linear-gradient(135deg, #333, #222);
        padding: 10px;
        font-weight: bold;
        font-size: 16px;
        text-align: center;
        position: relative;
        cursor: pointer;
        color:#fff;
    }
    .zui-item {
        padding: 10px 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(0, 0, 0);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        transition: background 0.3s;
        cursor: pointer;
        color:#fff;
    }
    .zui-item:last-child {
        border-bottom: none;
    }
    .zui-item:hover {
        color: rgba(5, 5, 5);
    }
    .zui-item.text {
        justify-content: center;
        cursor: unset;
        text-align: center;
        background: none;
        border-bottom: none;
        color:#fff;
    }
    .zui-item-value {
        font-weight: bold;
        color:#fff;
    }
    .zui-content {
        color:#fff;
        display: block;
    }
    `;
    document.head.appendChild(style);

    /************* Common Variables and Functions *************/

    const COOKIE_NAME = "krunker_access_auth";
    const COOKIE_VALID_DAYS = 7;

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        const cookieName = name + "=";
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(cookieName) === 0) {
                return c.substring(cookieName.length, c.length);
            }
        }
        return "";
    }

    function checkAccess() {
        const storedValue = getCookie(COOKIE_NAME);
        if (storedValue) {
            const storedTime = parseInt(storedValue, 10);
            const elapsedTime = Date.now() - storedTime;
            if (elapsedTime < COOKIE_VALID_DAYS * 24 * 60 * 60 * 1000) {
                return true;
            }
        }
        setCookie(COOKIE_NAME, Date.now().toString(), COOKIE_VALID_DAYS);
        return false;
    }

    if (!checkAccess()) {
        console.log("Access denied. Please redownload the script.");
        return;
    }

    console.log("KCS v0.8.0 is loaded.");

    const THREE = window.THREE;
    delete window.THREE;

    // Settings
    const settings = {
        aimbotEnabled: false,
        espEnabled: true,
        espLines: false,
        aimAssistEnabled: false,
        recoilCompEnabled: true,
        highJumpEnabled: false
    };

    const addOnSettings = {
        'FPS Boost': false,
        'Speed Boost': false,
        'Auto Shoot': false,
        'Auto Jump': false,
        'Krunker Hardcore Mode': false
    };

    const keyToSetting = {
        KeyB: 'aimbotEnabled',
        KeyM: 'espEnabled',
        KeyN: 'espLines',
        KeyV: 'aimAssistEnabled',
        KeyL: 'highJumpEnabled',
    };

    let scene;
    let myPlayer;

    const x = {
        window: window,
        document: document,
        querySelector: document.querySelector.bind(document),
        consoleLog: console.log,
        ReflectApply: Reflect.apply,
        ArrayPrototype: Array.prototype,
        ArrayPush: Array.prototype.push,
        ObjectPrototype: Object.prototype,
        clearInterval: window.clearInterval,
        setTimeout: window.setTimeout,
        indexOf: String.prototype.indexOf,
        requestAnimationFrame: window.requestAnimationFrame
    };

    x.consoleLog('Waiting to inject...');

    const proxied = function (object) {
        try {
            if (typeof object === 'object' &&
                typeof object.parent === 'object' &&
                object.parent.type === 'Scene' &&
                object.parent.name === 'Main') {
                x.consoleLog('Found Scene!');
                scene = object.parent;
                x.ArrayPrototype.push = x.ArrayPush;
            }
        } catch (error) {}
        return x.ArrayPush.apply(this, arguments);
    };

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
        }
        `,
        fragmentShader: `
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
        `
    });

    const line = new THREE.LineSegments(new THREE.BufferGeometry(), material);
    line.frustumCulled = false;
    const linePositions = new THREE.BufferAttribute(new Float32Array(100 * 2 * 3), 3);
    line.geometry.setAttribute('position', linePositions);

    let injectTimer = null;

    function showMsg(message, bool) {
        let msgDiv = document.querySelector('.msg');
        if (!msgDiv) {
            msgDiv = document.createElement('div');
            msgDiv.className = 'msg';
            document.body.appendChild(msgDiv);
        }
        msgDiv.innerText = message;
        msgDiv.style.background = bool ? 'rgba(0, 128, 0, 0.6)' : 'rgba(128, 0, 0, 0.6)';
        msgDiv.style.display = 'block';
        setTimeout(() => {
            msgDiv.style.display = 'none';
        }, 3000);
    }

    function aimAtTarget(myPlayer, targetPlayer, factor) {
        tempVector.setScalar(0);
        if (targetPlayer && targetPlayer.children && targetPlayer.children[0] && targetPlayer.children[0].children && targetPlayer.children[0].children[0]) {
            targetPlayer.children[0].children[0].localToWorld(tempVector);
        } else {
            tempVector.copy(targetPlayer.position);
        }

        tempObject.position.copy(myPlayer.position);
        tempObject.lookAt(tempVector);

        myPlayer.children[0].rotation.x += factor * (-tempObject.rotation.x - myPlayer.children[0].rotation.x);
        myPlayer.rotation.y += factor * ((tempObject.rotation.y + Math.PI) - myPlayer.rotation.y);
    }

    function aimAssist(myPlayer, targetPlayer) {
        const maxDistance = 600;
        const baseVector = new THREE.Vector3();

        if (targetPlayer && targetPlayer.children && targetPlayer.children[0] && targetPlayer.children[0].children && targetPlayer.children[0].children[0]) {
            targetPlayer.children[0].children[0].localToWorld(baseVector);
        } else {
            baseVector.copy(targetPlayer.position);
        }

        const dist = baseVector.distanceTo(myPlayer.position);
        if (dist > maxDistance) {
            return;
        }

        aimAtTarget(myPlayer, targetPlayer, 1.0);
    }

    let shooting = false;
    let stableRotationX = 0;
    let noRecoilInterval = null;
    function startNoRecoilLoop() {
        if (noRecoilInterval) return;
        noRecoilInterval = setInterval(() => {
            if (!myPlayer || !shooting || !settings.recoilCompEnabled) return;
            myPlayer.children[0].rotation.x = stableRotationX;
        }, 10);
    }

    function stopNoRecoilLoop() {
        if (noRecoilInterval) {
            clearInterval(noRecoilInterval);
            noRecoilInterval = null;
        }
    }

    window.addEventListener('pointerdown', function(event) {
        if (!myPlayer) return;
        if (event.button === 0) {
            shooting = true;
            stableRotationX = myPlayer.children[0].rotation.x;
            if (settings.recoilCompEnabled) {
                startNoRecoilLoop();
            }
        }
    });

    window.addEventListener('pointerup', function(event) {
        if (event.button === 0) {
            shooting = false;
            stopNoRecoilLoop();
        }
    });

    // High Jump
    function doHighJump() {
        if (!myPlayer) return;
        myPlayer.position.y += 10;
        console.log("High jump performed");
    }

    // Auto Shoot
    const raycaster = new THREE.Raycaster();
    const shootInterval = 200;
    let autoShootLoop = null;

    function startAutoShootLoop() {
        if (autoShootLoop) return;
        autoShootLoop = setInterval(() => {
            if (!myPlayer || !addOnSettings['Auto Shoot']) return;
            // Only shoot if Aimbot or AimAssist is active
            if (!settings.aimbotEnabled && !settings.aimAssistEnabled) return;

            const target = findClosestVisibleEnemy(100);
            if (target) {
                simulateShoot();
            }
        }, shootInterval);
    }

    function stopAutoShootLoop() {
        if (autoShootLoop) {
            clearInterval(autoShootLoop);
            autoShootLoop = null;
        }
    }

    function findClosestVisibleEnemy(maxDist) {
        if (!scene || !myPlayer) return null;
        const enemies = [];
        for (let i = 0; i < scene.children.length; i++) {
            const c = scene.children[i];
            if (c !== myPlayer && c.type === 'Object3D') {
                try {
                    if (!c.children[0].children[0].type === 'PerspectiveCamera') {
                        enemies.push(c);
                    }
                } catch {}
            }
        }

        let closest = null;
        let closestDist = Infinity;

        for (const e of enemies) {
            const dist = e.position.distanceTo(myPlayer.position);
            if (dist <= maxDist && dist < closestDist) {
                if (hasLineOfSight(myPlayer, e)) {
                    closestDist = dist;
                    closest = e;
                }
            }
        }
        return closest;
    }

    function hasLineOfSight(myPlayer, target) {
        raycaster.set(myPlayer.position.clone().add(new THREE.Vector3(0,10,0)),
                      target.position.clone().sub(myPlayer.position).normalize());
        const intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length > 0) {
            for (const inter of intersects) {
                if (inter.object && (target === inter.object || target.children.includes(inter.object) || target.children[0].children.includes(inter.object))) {
                    return true;
                }
                if (inter.distance < target.position.distanceTo(myPlayer.position)) {
                    return false;
                }
            }
        }
        return false;
    }

    function simulateShoot() {
        const event = new MouseEvent('pointerdown', {button:0});
        window.dispatchEvent(event);
        setTimeout(() => {
            const eventUp = new MouseEvent('pointerup', {button:0});
            window.dispatchEvent(eventUp);
        }, 50);
    }

    // Auto Jump
    let autoJumpInterval = null;
    function startAutoJump() {
        if (autoJumpInterval) return;
        autoJumpInterval = setInterval(() => {
            if (!myPlayer || !addOnSettings['Auto Jump']) return;
            const event = new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true });
            window.dispatchEvent(event);
            myPlayer.position.y += 2;
        }, 2500);
    }

    function stopAutoJump() {
        if (autoJumpInterval) {
            clearInterval(autoJumpInterval);
            autoJumpInterval = null;
        }
    }

    // FPS Boost
    let fpsBoostActive = false;
    function enableFPSBoost(){
        console.log("FPS Boost enabled");
        fpsBoostActive = true;
        if (scene && scene.fog) {
            scene.fog = null;
        }
        let canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.style.width = (canvas.clientWidth / 2) + "px";
            canvas.style.height = (canvas.clientHeight / 2) + "px";
        }
    }

    function disableFPSBoost(){
        console.log("FPS Boost disabled");
        fpsBoostActive = false;
        let canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.style.width = "";
            canvas.style.height = "";
        }
    }

    // Speed Boost
    let originalSpeed = null;
    function enableSpeedBoost(){
        console.log("Speed Boost enabled");
        if (!myPlayer) return;
        if (!originalSpeed && typeof myPlayer.speed !== 'undefined') {
            originalSpeed = myPlayer.speed;
            myPlayer.speed = myPlayer.speed * 2;
        } else if (myPlayer.controls && typeof myPlayer.controls.moveSpeed !== 'undefined') {
            if (!originalSpeed) originalSpeed = myPlayer.controls.moveSpeed;
            myPlayer.controls.moveSpeed = originalSpeed * 2;
        }
    }

    function disableSpeedBoost(){
        console.log("Speed Boost disabled");
        if (!myPlayer) return;
        if (originalSpeed !== null) {
            if (typeof myPlayer.speed !== 'undefined') {
                myPlayer.speed = originalSpeed;
            } else if (myPlayer.controls && typeof myPlayer.controls.moveSpeed !== 'undefined') {
                myPlayer.controls.moveSpeed = originalSpeed;
            }
            originalSpeed = null;
        }
    }

    function enableAutoShoot(){
        console.log("Auto Shoot enabled");
        startAutoShootLoop();
    }

    function disableAutoShoot(){
        console.log("Auto Shoot disabled");
        stopAutoShootLoop();
    }

    function enableAutoJump(){
        console.log("Auto Jump enabled");
        startAutoJump();
    }

    function disableAutoJump(){
        console.log("Auto Jump disabled");
        stopAutoJump();
    }

    function enablekrunkerhardcore(){
        console.log("Krunker Hardcore Mode enabled");
        if (scene) {
            scene.fog = new THREE.Fog(0x000000, 10, 50);
        }
    }

    function disablekrunkerhardcore(){
        console.log("Krunker Hardcore Mode disabled");
        if (scene) {
            scene.fog = null;
        }
    }

    function animate() {
        x.requestAnimationFrame.call(x.window, animate);

        if (!scene && !injectTimer) {
            const el = x.querySelector('#loadingBg');
            if (el && el.style.display === 'none') {
                x.consoleLog('Inject timer started!');
                injectTimer = x.setTimeout.call(x.window, () => {
                    x.consoleLog('Injected!');
                    x.ArrayPrototype.push = proxied;
                    if (scene && !scene.getObjectByName('espLine')) {
                        line.name = 'espLine';
                        scene.add(line);
                    }
                }, 2000);
            }
        }

        if (!scene) return;

        const players = [];
        myPlayer = null;

        for (let i = 0; i < scene.children.length; i++) {
            const child = scene.children[i];
            if (child.type === 'Object3D') {
                try {
                    if (child.children[0].children[0].type === 'PerspectiveCamera') {
                        myPlayer = child;
                    } else {
                        players.push(child);
                    }
                } catch (err) {}
            }
        }

        if (!myPlayer) {
            x.consoleLog('No player found.');
            x.ArrayPrototype.push = proxied;
            return;
        }

        let counter = 0;
        let targetPlayer;
        let minDistance = Infinity;
        const maxAimbotDistance = 255;

        tempObject.matrix.copy(myPlayer.matrix).invert();

        for (let i = 0; i < players.length; i++) {
            const player = players[i];

            if (!player.box) {
                const box = new THREE.LineSegments(geometry, material);
                box.frustumCulled = false;
                player.add(box);
                player.box = box;
            }

            if (player.position.x === myPlayer.position.x && player.position.z === myPlayer.position.z) {
                player.box.visible = false;
                if (line.parent !== player) {
                    player.add(line);
                }
                continue;
            }

            if (settings.espLines) {
                linePositions.setXYZ(counter++, 0, 10, -5);

                tempVector.copy(player.position);
                tempVector.y += 9;
                tempVector.applyMatrix4(tempObject.matrix);

                linePositions.setXYZ(
                    counter++,
                    tempVector.x,
                    tempVector.y,
                    tempVector.z
                );
            }

            player.box.visible = settings.espEnabled;

            const distance = player.position.distanceTo(myPlayer.position);
            if (distance < minDistance && distance <= maxAimbotDistance) {
                targetPlayer = player;
                minDistance = distance;
            }
        }

        if (settings.espLines) {
            linePositions.needsUpdate = true;
            line.geometry.setDrawRange(0, counter);
            line.visible = true;
        } else {
            line.visible = false;
        }

        if (!targetPlayer) return;

        if (settings.aimbotEnabled) {
            aimAtTarget(myPlayer, targetPlayer, 1.0);
        } else if (settings.aimAssistEnabled && !settings.aimbotEnabled) {
            aimAssist(myPlayer, targetPlayer);
        }
    }

    window.addEventListener('keydown', function(event) {
        if (event.code === 'Space' && myPlayer) {
            if (settings.highJumpEnabled) {
                doHighJump();
            }
        }
    });

    function fromHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.children[0];
    }

    function createGUI() {
        const guiEl = fromHtml(`
        <div class="zui">
            <div class="zui-header">
                Krunker Cheating Software v.0.8.0
                <span class="zui-item-value">+</span>
            </div>
            <div class="zui-content">
                <div class="zui-section normal-settings-section">
                    <div class="zui-item" data-setting="aimbotEnabled">
                        <span>Aimbot</span>
                        <span class="zui-item-value">OFF</span>
                    </div>
                    <div class="zui-item" data-setting="espEnabled">
                        <span>ESP</span>
                        <span class="zui-item-value">OFF</span>
                    </div>
                    <div class="zui-item" data-setting="espLines">
                        <span>ESP Lines</span>
                        <span class="zui-item-value">OFF</span>
                    </div>
                    <div class="zui-item" data-setting="aimAssistEnabled">
                        <span>Aim Assist</span>
                        <span class="zui-item-value">OFF</span>
                    </div>
                    <div class="zui-item" data-setting="recoilCompEnabled">
                        <span>Recoil Compensation</span>
                        <span class="zui-item-value">OFF</span>
                    </div>
                    <div class="zui-item" data-setting="highJumpEnabled">
                        <span>High Jump</span>
                        <span class="zui-item-value">OFF</span>
                    </div>
                    <div class="zui-item toggle-more-settings">
                        <span>More Settings</span>
                        <span class="zui-item-value">â</span>
                    </div>
                </div>
                <div class="zui-section add-on-settings-section" style="display:none;">
                    <strong>Add-On Settings</strong>
                    <div class="zui-item" data-addon-setting="FPS Boost">
                        <span>FPS Boost</span>
                        <span class="zui-item-value">OFF</span>
                    </div>
                    <div class="zui-item" data-addon-setting="Speed Boost">
                        <span>Speed Boost</span>
                        <span class="zui-item-value">OFF</span>
                    </div>
                    <div class="zui-item" data-addon-setting="Auto Shoot">
                        <span>Auto Shoot</span>
                        <span class="zui-item-value">OFF</span>
                    </div>
                    <div class="zui-item" data-addon-setting="Auto Jump">
                        <span>Auto Jump</span>
                        <span class="zui-item-value">OFF</span>
                    </div>
                    <div class="zui-item" data-addon-setting="Krunker Hardcore Mode">
                        <span>Krunker Hardcore Mode</span>
                        <span class="zui-item-value">OFF</span>
                    </div>
                    <div class="zui-item toggle-back-settings">
                        <span>Back</span>
                        <span class="zui-item-value">â¬ï¸</span>
                    </div>
                </div>
                <div class="zui-item text">
                    <span>Dev: wi1lliott8411</span>
                </div>
            </div>
        </div>
        `);

        const toggleMoreSettingsBtn = guiEl.querySelector('.toggle-more-settings');
        const toggleBackSettingsBtn = guiEl.querySelector('.toggle-back-settings');

        toggleMoreSettingsBtn.addEventListener('click', function() {
            const normalSection = guiEl.querySelector('.normal-settings-section');
            const addOnSection = guiEl.querySelector('.add-on-settings-section');
            normalSection.style.display = 'none';
            addOnSection.style.display = 'block';
        });

        toggleBackSettingsBtn.addEventListener('click', function() {
            const normalSection = guiEl.querySelector('.normal-settings-section');
            const addOnSection = guiEl.querySelector('.add-on-settings-section');
            normalSection.style.display = 'block';
            addOnSection.style.display = 'none';
        });

        const normalToggleItems = guiEl.querySelectorAll('.normal-settings-section .zui-item[data-setting]');
        normalToggleItems.forEach(item => {
            const settingKey = item.getAttribute('data-setting');
            const valueEl = item.querySelector('.zui-item-value');
            updateSettingDisplay(settingKey, settings[settingKey], valueEl);

            item.addEventListener('click', function() {
                settings[settingKey] = !settings[settingKey];
                updateSettingDisplay(settingKey, settings[settingKey], valueEl);
                showMsg(`${fromCamel(settingKey)} ${settings[settingKey] ? 'enabled' : 'disabled'}`, settings[settingKey]);
                applyImmediateEffects(settingKey, settings[settingKey]);
            });
        });

        const addOnToggleItems = guiEl.querySelectorAll('.add-on-settings-section .zui-item[data-addon-setting]');
        addOnToggleItems.forEach(item => {
            const settingName = item.getAttribute('data-addon-setting');
            const valueEl = item.querySelector('.zui-item-value');
            updateAddOnSettingDisplay(settingName, addOnSettings[settingName], valueEl);

            item.addEventListener('click', function() {
                addOnSettings[settingName] = !addOnSettings[settingName];
                updateAddOnSettingDisplay(settingName, addOnSettings[settingName], valueEl);
                showMsg(`${settingName} ${addOnSettings[settingName] ? 'enabled' : 'disabled'}`, addOnSettings[settingName]);
                applyImmediateAddOnEffects(settingName, addOnSettings[settingName]);
            });
        });

        return guiEl;
    }

    function updateSettingDisplay(settingKey, isActive, valueEl) {
        valueEl.innerText = isActive ? 'ON' : 'OFF';
        valueEl.style.color = isActive ? '#0f0' : '#f00';
    }

    function updateAddOnSettingDisplay(settingName, isActive, valueEl) {
        valueEl.innerText = isActive ? 'ON' : 'OFF';
        valueEl.style.color = isActive ? '#0f0' : '#f00';
    }

    function applyImmediateEffects(settingKey, value) {
        console.log(`Setting ${settingKey} turned ${value ? 'ON' : 'OFF'}`);

        switch(settingKey) {
            case 'aimbotEnabled':
                if(value) { enableAimbot(); } else { disableAimbot(); }
                break;
            case 'espEnabled':
                if(value) { enableESP(); } else { disableESP(); }
                break;
            case 'espLines':
                if(value) { enableESPLines(); } else { disableESPLines(); }
                break;
            case 'aimAssistEnabled':
                if(value) { enableAimAssist(); } else { disableAimAssist(); }
                break;
            case 'recoilCompEnabled':
                if(value) { enableRecoilCompensation(); } else { disableRecoilCompensation(); }
                break;
            case 'highJumpEnabled':
                if(value) { enableHighJump(); } else { disableHighJump(); }
                break;
            default:
                console.log(`No action for setting: ${settingKey}`);
        }
    }

    function applyImmediateAddOnEffects(settingName, value) {
        console.log(`Add-On setting ${settingName} turned ${value ? 'ON' : 'OFF'}`);

        switch(settingName) {
            case 'FPS Boost':
                if(value) { enableFPSBoost(); } else { disableFPSBoost(); }
                break;
            case 'Speed Boost':
                if(value) { enableSpeedBoost(); } else { disableSpeedBoost(); }
                break;
            case 'Auto Shoot':
                if(value) { enableAutoShoot(); } else { disableAutoShoot(); }
                break;
            case 'Auto Jump':
                if(value) { enableAutoJump(); } else { disableAutoJump(); }
                break;
            case 'Krunker Hardcore Mode':
                if(value) { enablekrunkerhardcore(); } else { disablekrunkerhardcore(); }
                break;
            default:
                console.log(`No action for Add-On setting: ${settingName}`);
        }
    }

    function fromCamel(text) {
        const result = text.replace(/([A-Z])/g, ' $1');
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    // Dummy functions
    function enableAimbot(){console.log("Aimbot enabled");}
    function disableAimbot(){console.log("Aimbot disabled");}
    function enableESP(){console.log("ESP enabled");}
    function disableESP(){console.log("ESP disabled");}
    function enableESPLines(){console.log("ESP Lines enabled");}
    function disableESPLines(){console.log("ESP Lines disabled");}
    function enableAimAssist(){console.log("Aim Assist enabled");}
    function disableAimAssist(){console.log("Aim Assist disabled");}
    function enableRecoilCompensation(){console.log("Recoil Compensation enabled");}
    function disableRecoilCompensation(){console.log("Recoil Compensation disabled");}
    function enableHighJump(){console.log("High Jump enabled");}
    function disableHighJump(){console.log("High Jump disabled");}

    window.addEventListener('keyup', function (event) {
        if (document.activeElement && document.activeElement.value !== undefined) return;
        if (keyToSetting[event.code]) {
            toggleSetting(keyToSetting[event.code]);
        }
    });

    function toggleSetting(key) {
        settings[key] = !settings[key];
        showMsg(`${fromCamel(key)} ${settings[key] ? 'enabled' : 'disabled'}`, settings[key]);
        const item = document.querySelector(`.normal-settings-section .zui-item[data-setting="${key}"]`);
        if(item) {
            const valueEl = item.querySelector('.zui-item-value');
            updateSettingDisplay(key, settings[key], valueEl);
        }
        applyImmediateEffects(key, settings[key]);
    }

    function appendGUI() {
        const gui = createGUI();
        document.body.appendChild(gui);
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', appendGUI);
    } else {
        appendGUI();
    }

    animate();

})();
