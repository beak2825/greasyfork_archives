// ==UserScript==
// @name         Canadian100 client
// @namespace    http://tampermonkey.net/
// @version      4.6
// @description  A client with more effeciency 
// @author       Canadian100, idc1234
// @match        *://survev.io/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/532476/Canadian100%20client.user.js
// @updateURL https://update.greasyfork.org/scripts/532476/Canadian100%20client.meta.js
// ==/UserScript==

(function() {

    let isDragging = false, offsetX, offsetY;
    let aimbotCheckboxRef, spinbotCheckboxRef, meleeLockCheckboxRef;
    let allowDrag = true;

    const gui = document.createElement('div');
    gui.style.position = 'fixed';
    gui.style.top = '100px';
    gui.style.left = '100px';
    gui.style.width = '400px';
    gui.style.backgroundColor = 'black';
    gui.style.border = '2px solid red';
    gui.style.zIndex = 9999;
    gui.style.fontFamily = 'Arial, sans-serif';
    gui.style.display = 'block';
    gui.style.color = 'white';
    gui.style.userSelect = 'none';
    gui.style.padding = '10px';

    const titleBar = document.createElement('div');
    titleBar.textContent = 'canadian100 client';
    titleBar.style.color = 'red';
    titleBar.style.fontWeight = 'bold';
    titleBar.style.marginBottom = '8px';
    titleBar.style.cursor = 'move';
    gui.appendChild(titleBar);

    const dragToggle = document.createElement('input');
    dragToggle.type = 'checkbox';
    dragToggle.checked = true;
    dragToggle.style.marginLeft = '10px';
    dragToggle.addEventListener('change', () => {
        allowDrag = dragToggle.checked;
    });
    titleBar.appendChild(dragToggle);

    const footer = document.createElement('div');
    footer.textContent = 'by Canadian100, version 4.7';
    footer.style.marginTop = '10px';
    footer.style.fontSize = '12px';
    footer.style.color = 'white';

    const tabList = document.createElement('div');
    tabList.style.marginBottom = '10px';
    gui.appendChild(tabList);

    const tabContent = document.createElement('div');
    gui.appendChild(tabContent);

    const tabNames = ['Main', 'Visuals', 'Extra', 'Help'];
    const tabButtons = {};

    tabNames.forEach(name => {
        const btn = document.createElement('button');
        btn.textContent = name;
        btn.style.marginRight = '5px';
        btn.style.padding = '5px';
        btn.style.backgroundColor = '#222';
        btn.style.color = 'white';
        btn.style.border = '1px solid red';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = 'bold';
        tabList.appendChild(btn);
        tabButtons[name] = btn;

        btn.addEventListener('click', () => {
            switchTab(name);
        });
    });

    function createSetting(title, checkboxRefHolder, parent = tabContent) {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.justifyContent = 'space-between';
        row.style.border = '1px solid red';
        row.style.padding = '6px';
        row.style.marginBottom = '5px';

        const label = document.createElement('span');
        label.textContent = title;
        row.appendChild(label);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginLeft = '10px';
        row.appendChild(checkbox);

        checkbox.addEventListener('change', () => {
            checkbox.style.accentColor = checkbox.checked ? 'green' : '';
        });

        if (checkboxRefHolder) {
            checkboxRefHolder.checkbox = checkbox;
        }

        parent.appendChild(row);
        return checkbox;
    }

    function createSubBox(title, parent = tabContent) {
        const container = document.createElement('div');
        container.style.border = '1px solid red';
        container.style.padding = '5px';
        container.style.marginBottom = '8px';

        const label = document.createElement('div');
        label.textContent = title;
        label.style.marginBottom = '5px';
        label.style.fontWeight = 'bold';
        label.style.color = 'white';
        container.appendChild(label);

        parent.appendChild(container);
        return container;
    }

    function loadMainTab() {
        tabContent.innerHTML = '';


        aimbotCheckboxRef = {};
        const aimbotCheckbox = createSetting('Aimbot', aimbotCheckboxRef);
        const aimbotBox = createSubBox('Aimbot Settings');
        createSetting('Target Knocked', null, aimbotBox);
        createSetting('Sticky Target', null, aimbotBox);


        meleeLockCheckboxRef = {};
        const meleeCheckbox = createSetting('Melee Lock', meleeLockCheckboxRef);
        const meleeBox = createSubBox('Melee Lock Settings');
        createSetting('Auto Equipe', null, meleeBox);


        spinbotCheckboxRef = {};
        const spinCheckbox = createSetting('Spin Bot', spinbotCheckboxRef);
        const spinBox = createSubBox('Spinbot Settings');
        createSetting('Realistic', null, spinBox);

        const speedRow = document.createElement('div');
        speedRow.style.display = 'flex';
        speedRow.style.justifyContent = 'space-between';
        speedRow.style.alignItems = 'center';
        speedRow.style.marginTop = '5px';

        const speedLabel = document.createElement('span');
        speedLabel.textContent = 'Speed';
        const speedSlider = document.createElement('input');
        speedSlider.type = 'range';
        speedSlider.min = '1';
        speedSlider.max = '100';
        speedSlider.value = '50';
        speedSlider.style.width = '60%';

        speedRow.appendChild(speedLabel);
        speedRow.appendChild(speedSlider);
        spinBox.appendChild(speedRow);


        createSetting('Auto Switch');
        const autoSwitchBox = createSubBox('Auto Switch Settings');
        createSetting('Use One Gun', null, autoSwitchBox);

        createSetting('Use One Gun');

        gui.appendChild(footer);
    }

    document.body.appendChild(gui);

    document.addEventListener('keydown', e => {
        if (e.code === 'ShiftRight') {
            gui.style.display = gui.style.display === 'none' ? 'block' : 'none';
        }

        if (e.code === 'KeyP' && aimbotCheckboxRef?.checkbox) {
            aimbotCheckboxRef.checkbox.checked = !aimbotCheckboxRef.checkbox.checked;
            aimbotCheckboxRef.checkbox.dispatchEvent(new Event('change'));
        }

        if (e.code === 'KeyH' && spinbotCheckboxRef?.checkbox) {
            spinbotCheckboxRef.checkbox.checked = !spinbotCheckboxRef.checkbox.checked;
            spinbotCheckboxRef.checkbox.dispatchEvent(new Event('change'));
        }

        if (e.code === 'KeyO' && meleeLockCheckboxRef?.checkbox) {
            meleeLockCheckboxRef.checkbox.checked = !meleeLockCheckboxRef.checkbox.checked;
            meleeLockCheckboxRef.checkbox.dispatchEvent(new Event('change'));
        }
    });

    titleBar.addEventListener('mousedown', e => {
        if (!allowDrag) return;
        isDragging = true;
        offsetX = e.clientX - gui.offsetLeft;
        offsetY = e.clientY - gui.offsetTop;
    });
    document.addEventListener('mousemove', e => {
        if (isDragging) {
            gui.style.left = `${e.clientX - offsetX}px`;
            gui.style.top = `${e.clientY - offsetY}px`;
        }
    });
    document.addEventListener('mouseup', () => isDragging = false);


    function switchTab(name) {
        tabContent.innerHTML = '';
        Object.values(tabButtons).forEach(btn => btn.style.backgroundColor = '#222');
        tabButtons[name].style.backgroundColor = '#444';

        if (name === 'Main') loadMainTab();
        if (name === 'Visuals') loadVisualsTab();
        if (name === 'Extra') loadExtraTab();
        if (name === 'Help') loadHelpTab();
    }

    switchTab('Help');
    function loadVisualsTab() {
        tabContent.innerHTML = '';


        const xrayCheckbox = createSetting('X-ray');
        const xrayBox = createSubBox('X-ray Settings');
        createSetting('Remove Ceilings', null, xrayBox);
        createSetting('Smoke Settings', null, xrayBox);

        const smokeOpacityRow = document.createElement('div');
        smokeOpacityRow.style.display = 'flex';
        smokeOpacityRow.style.justifyContent = 'space-between';
        smokeOpacityRow.style.alignItems = 'center';

        const smokeLabel = document.createElement('span');
        smokeLabel.textContent = 'Smoke Opacity';
        const smokeSlider = document.createElement('input');
        smokeSlider.type = 'range';
        smokeSlider.min = '0';
        smokeSlider.max = '100';
        smokeSlider.value = '50';
        smokeSlider.style.width = '60%';

        smokeOpacityRow.appendChild(smokeLabel);
        smokeOpacityRow.appendChild(smokeSlider);
        xrayBox.appendChild(smokeOpacityRow);

        const treeOpacityRow = document.createElement('div');
        treeOpacityRow.style.display = 'flex';
        treeOpacityRow.style.justifyContent = 'space-between';
        treeOpacityRow.style.alignItems = 'center';

        const treeLabel = document.createElement('span');
        treeLabel.textContent = 'Tree Opacity';
        const treeSlider = document.createElement('input');
        treeSlider.type = 'range';
        treeSlider.min = '0';
        treeSlider.max = '100';
        treeSlider.value = '50';
        treeSlider.style.width = '60%';

        treeOpacityRow.appendChild(treeLabel);
        treeOpacityRow.appendChild(treeSlider);
        xrayBox.appendChild(treeOpacityRow);


        createSetting('Layer Hack');


        const espCheckbox = createSetting('ESP Hack');
        const espBox = createSubBox('ESP Options');
        createSetting('Visual Nametags', null, espBox);
        createSetting('Players', null, espBox);

        const grenadeTitle = document.createElement('div');
        grenadeTitle.textContent = 'Grenades';
        grenadeTitle.style.fontWeight = 'bold';
        grenadeTitle.style.marginTop = '8px';
        espBox.appendChild(grenadeTitle);
        createSetting('Explosions', null, espBox);
        createSetting('Trajectory', null, espBox);

        const flashTitle = document.createElement('div');
        flashTitle.textContent = 'Flash Light';
        flashTitle.style.fontWeight = 'bold';
        flashTitle.style.marginTop = '8px';
        espBox.appendChild(flashTitle);
        createSetting('Own', null, espBox);
        createSetting('Others', null, espBox);
    }

    function loadExtraTab() {
        tabContent.innerHTML = '';

        const mapCheckbox = createSetting('Map Highlights');
        const mapBox = createSubBox('Map Highlights');

        createSetting('Smaller Trees', null, mapBox);
        createSetting('Auto Loot', null, mapBox);

        const mobileMovement = createSetting('Mobile Movement', null, mapBox);
        const smoothRow = document.createElement('div');
        smoothRow.style.display = 'flex';
        smoothRow.style.justifyContent = 'space-between';
        smoothRow.style.alignItems = 'center';

        const smoothLabel = document.createElement('span');
        smoothLabel.textContent = 'Smooth';
        const smoothSlider = document.createElement('input');
        smoothSlider.type = 'range';
        smoothSlider.min = '0';
        smoothSlider.max = '100';
        smoothSlider.value = '50';
        smoothSlider.style.width = '60%';

        smoothRow.appendChild(smoothLabel);
        smoothRow.appendChild(smoothSlider);
        mapBox.appendChild(smoothRow);
    }

    function loadHelpTab() {
        tabContent.innerHTML = '';

        const infoTitle = document.createElement('div');
        infoTitle.textContent = 'Information about Client';
        infoTitle.style.fontWeight = 'bold';
        tabContent.appendChild(infoTitle);

        const infoBox = document.createElement('div');
        infoBox.textContent = "'Right Shift' to open and close menu. Press it anytime to open/close.";
        infoBox.style.border = '1px solid red';
        infoBox.style.padding = '6px';
        infoBox.style.marginBottom = '10px';
        tabContent.appendChild(infoBox);

        const keysTitle = document.createElement('div');
        keysTitle.textContent = 'Keybinds';
        keysTitle.style.fontWeight = 'bold';
        tabContent.appendChild(keysTitle);

        const keysBox = document.createElement('div');
        keysBox.innerHTML = "Press keybinds to toggle features at any time → <b>P</b> = Aimbot, <b>H</b> = Spinbot, <b>O</b> = Melee Lock, <b>J</b> = Weapons search";
        keysBox.style.border = '1px solid red';
        keysBox.style.padding = '6px';
        keysBox.style.marginBottom = '10px';
        tabContent.appendChild(keysBox);

        const qTitle = document.createElement('div');
        qTitle.textContent = 'Questions';
        qTitle.style.fontWeight = 'bold';
        tabContent.appendChild(qTitle);

        const qBox = document.createElement('div');
        qBox.innerHTML = "DM Canadian100 on Discord at <b>canadian100.0</b> for info on the hack or any questions.";
        qBox.style.border = '1px solid red';
        qBox.style.padding = '6px';
        qBox.style.marginBottom = '10px';
        tabContent.appendChild(qBox);

        const cTitle = document.createElement('div');
        cTitle.textContent = 'Credits';
        cTitle.style.fontWeight = 'bold';
        tabContent.appendChild(cTitle);

        const cBox = document.createElement('div');
        cBox.innerHTML = "Canadian100 - developer, founder and designer<br>1234idc - developer and designer";
        cBox.style.border = '1px solid red';
        cBox.style.padding = '6px';
        cBox.style.marginBottom = '10px';
        tabContent.appendChild(cBox);
    }
function aimbot() {
    let aimbotActive = false;
    let aimbotCheckbox = document.getElementById('aimbotCheckbox');
    let targetKnockedCheckbox = document.getElementById('targetKnockedCheckbox');
    let stickyTargetCheckbox = document.getElementById('stickyTargetCheckbox');

    let playerPosition = { x: 100, y: 100 };
    let visibleEnemies = [
        { position: { x: 150, y: 150 }, velocity: { x: 1, y: 1 }, knocked: false },
        { position: { x: 200, y: 200 }, velocity: { x: -1, y: -1 }, knocked: false }
    ];

    let currentTarget = null;

    document.addEventListener('keydown', function(event) {
        if (event.key === 'p') {
            aimbotActive = !aimbotActive;
        }
    });

    if (aimbotActive || (aimbotCheckbox?.checked && aimbotActive)) {
        let closestEnemy = null;
        let closestDistance = Infinity;

        for (let enemy of visibleEnemies) {
            const predictedPosition = predictEnemyPosition(enemy);
            const distance = calculateDistance(playerPosition, predictedPosition);

            if (
                distance < closestDistance &&
                (targetKnockedCheckbox?.checked || !enemy.knocked) &&
                (!stickyTargetCheckbox?.checked || currentTarget !== enemy)
            ) {
                closestEnemy = enemy;
                closestDistance = distance;
            }
        }

        if (closestEnemy) {
            currentTarget = closestEnemy;
            const targetPosition = predictEnemyPosition(closestEnemy);
            renderRedDot(targetPosition);
            if (shouldShootAt(targetPosition)) {
                aimAt(targetPosition);
                shoot();
            }
        }
    }

    function predictEnemyPosition(enemy) {
        const predictedX = enemy.position.x + enemy.velocity.x * predictionFactor;
        const predictedY = enemy.position.y + enemy.velocity.y * predictionFactor;
        return { x: predictedX, y: predictedY };
    }

    function calculateDistance(playerPos, targetPos) {
        return Math.sqrt(Math.pow(playerPos.x - targetPos.x, 2) + Math.pow(playerPos.y - targetPos.y, 2));
    }

    function calculateAimAngle(playerPos, targetPos) {
        const dx = targetPos.x - playerPos.x;
        const dy = targetPos.y - playerPos.y;
        return Math.atan2(dy, dx) * (180 / Math.PI);
    }

    function aimAt(targetPosition) {
        const aimAngle = calculateAimAngle(playerPosition, targetPosition);
        movePlayerAim(aimAngle);
    }

    function renderRedDot(targetPosition) {
        drawCircle(targetPosition.x, targetPosition.y, 3, 'red');
    }

    function shouldShootAt(targetPosition) {
        return true;
    }

    function shoot() {
        console.log('Shooting at target!');
    }

    function drawCircle(x, y, radius, color) {
        console.log(`Drawing a ${color} dot at (${x}, ${y}) with radius ${radius}`);
    }

    function movePlayerAim(angle) {
        console.log(`Aiming at angle: ${angle}°`);
    }
}
    function meleeLock() {
    let meleeLockActive = false;
    let autoEquipActive = false;
    let playerPosition = { x: 100, y: 100 };
    let visibleEnemies = [
        { position: { x: 150, y: 150 }, velocity: { x: 1, y: 1 }, knocked: false },
        { position: { x: 200, y: 200 }, velocity: { x: -1, y: -1 }, knocked: false }
    ];

    let autoEquipCheckbox = document.getElementById('autoEquipCheckbox');
    let meleeLockCheckbox = document.getElementById('meleeLockCheckbox');
    let meleeLockSettingsCheckbox = document.getElementById('meleeLockSettingsCheckbox');

    document.addEventListener('keydown', function(event) {
        if (event.key === 'o') {
            meleeLockActive = !meleeLockActive;
        }
    });

    if (meleeLockActive && meleeLockCheckbox.checked) {
        let closestEnemy = findClosestMeleeTarget();
        if (closestEnemy) {
            const distance = calculateDistance(playerPosition, closestEnemy.position);
            if (distance <= 25) {
                movePlayerTowards(closestEnemy.position);
                aimAt(closestEnemy.position);
                shoot();
                if (meleeLockSettingsCheckbox?.checked && autoEquipCheckbox?.checked) {
                    switchToMeleeWeapon();
                }
            }
        }
    }

    function findClosestMeleeTarget() {
        let closestMeleeTarget = null;
        let closestMeleeDistance = 25;

        for (let enemy of visibleEnemies) {
            const distance = calculateDistance(playerPosition, enemy.position);
            if (distance <= closestMeleeDistance && !enemy.knocked) {
                closestMeleeTarget = enemy;
                closestMeleeDistance = distance;
            }
        }
        return closestMeleeTarget;
    }

    function switchToMeleeWeapon() {
        console.log('Switching to melee weapon (Slot 3)!');
    }

    function calculateDistance(playerPos, targetPos) {
        return Math.sqrt(Math.pow(playerPos.x - targetPos.x, 2) + Math.pow(playerPos.y - targetPos.y, 2));
    }

    function movePlayerTowards(targetPosition) {
        const dx = targetPosition.x - playerPosition.x;
        const dy = targetPosition.y - playerPosition.y;
        const angle = Math.atan2(dy, dx);
        playerPosition.x += Math.cos(angle) * 5;
        playerPosition.y += Math.sin(angle) * 5;
    }

    function aimAt(targetPosition) {
        const dx = targetPosition.x - playerPosition.x;
        const dy = targetPosition.y - playerPosition.y;
        const angle = Math.atan2(dy, dx);
    }

    function shoot() {
        console.log('Shooting at target!');
    }
}
function Flash_Light() {
    const ctx = document.getElementById('gameCanvas').getContext('2d');
    const player = getLocalPlayer();
    const enemies = getVisibleEnemies();
    if (!player || !ctx) return;

    const weapon = player.weapon;
    if (!weapon) return;

    const spreadAngle = weapon.spread || 0.1;
    const range = weapon.range || 1000;
    const origin = { x: player.x, y: player.y };
    const angle = player.direction;

    function drawSpreadArc(origin, angle, spread, distance) {
        ctx.save();
        ctx.translate(origin.x, origin.y);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, distance, -spread / 2, spread / 2);
        ctx.closePath();

        ctx.fillStyle = 'rgba(200, 150, 255, 0.2)';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'white';
        ctx.stroke();

        ctx.restore();
    }

    drawSpreadArc(origin, angle, spreadAngle, range);

    for (const enemy of enemies) {
        const enemyWeapon = enemy.weapon;
        const enemySpread = enemyWeapon?.spread || 0.1;
        const enemyRange = enemyWeapon?.range || 1000;
        const enemyOrigin = { x: enemy.x, y: enemy.y };
        const enemyAngle = enemy.direction;

        drawSpreadArc(enemyOrigin, enemyAngle, enemySpread, enemyRange);
    }
}
function equipMelee() {
    const meleeKeyEvent = new KeyboardEvent('keydown', {
        key: '3',
        code: 'Digit3',
        keyCode: 51,
        which: 51,
        bubbles: true
    });
    document.dispatchEvent(meleeKeyEvent);
}
function startAutoLoot() {
    setInterval(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyF' }));
        document.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyF' }));
    }, 50);
}

startAutoLoot();
function shrinkTrees() {
    const treeList = window?.game?.objects || [];
    for (const obj of treeList) {
        if (obj?.type === 'tree' || obj?.id?.includes('tree')) {
            obj.scale = 0.3; // Shrink size to 30%
            if (obj.width) obj.width *= 0.3;
            if (obj.height) obj.height *= 0.3;
        }
    }
}

setInterval(shrinkTrees, 500);
function enableMobileMovement() {
    const canvas = document.querySelector('canvas');

    if (!canvas) {
        console.warn('Canvas not found for mobile movement setup.');
        return;
    }

    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;


        window.dispatchEvent(new MouseEvent('mousemove', {
            clientX: event.clientX,
            clientY: event.clientY,
            bubbles: true
        }));

    });

    console.log('Mobile movement enabled.');
}
function highlightImportantObjectsPink() {
    const objects = window?.game?.objects || [];

    for (const obj of objects) {
        if (!obj || !obj.id) continue;

        const id = obj.id.toLowerCase();

        const isBunker = id.includes('bunker');
        const isBuildingWithBunker = id.includes('building') && id.includes('bunker');
        const isCrate = id.includes('crate');
        const isGold = id.includes('gold');

        if (isBunker || isBuildingWithBunker || isCrate || isGold) {
            // Apply pink tint
            if (typeof obj.tint !== 'undefined') {
                obj.tint = 0xFF69B4;
            }


            if (obj.scale) {
                obj.scale = 1.5;
            } else {
                obj.scale = { x: 1.5, y: 1.5 };
            }
        }
    }
}

setInterval(highlightImportantObjectsPink, 100);
function highlightGrenadeAndMirvTrajectory() {
    const objects = window?.game?.objects || [];

    for (const obj of objects) {
        if (!obj || !obj.id) continue;

        const id = obj.id.toLowerCase();

        const isGrenade = id.includes('grenade');
        const isMirv = id.includes('mirv');

        if (isGrenade || isMirv) {
            const explosionRadius = obj.explosionRadius || 50;
            const x = obj.x;
            const y = obj.y;

            const explosionCircle = new PIXI.Graphics();
            explosionCircle.lineStyle(2, 0xFF0000, 1);
            explosionCircle.beginFill(0xFF0000, 0.2);
            explosionCircle.drawCircle(x, y, explosionRadius);
            explosionCircle.endFill();
            window.game.stage.addChild(explosionCircle);

            const trajectoryPath = new PIXI.Graphics();
            trajectoryPath.lineStyle(2, 0x00FF00, 1);

            const gravity = 0.2;
            let initialX = x;
            let initialY = y;
            let time = 0;

            trajectoryPath.moveTo(initialX, initialY);
            while (time < 50) {
                const newX = initialX + (time * 3);
                const newY = initialY - (time * 3) + (gravity * Math.pow(time, 2));

                trajectoryPath.lineTo(newX, newY);
                time++;
            }

            window.game.stage.addChild(trajectoryPath);
        }
    }
}

setInterval(highlightGrenadeAndMirvTrajectory, 100);
function showPlayerNameTags() {
    const players = window?.game?.players || [];

    players.forEach(player => {
        if (!player || !player.id || !player.name) return;

        const playerX = player.x;
        const playerY = player.y;

        const nameTag = new PIXI.Text(player.name, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x0000FF,
            align: 'center'
        });

        nameTag.anchor.set(0.5);
        nameTag.position.set(playerX, playerY - 20);
        window.game.stage.addChild(nameTag);
    });
}

setInterval(showPlayerNameTags, 100);
function switchWeaponOnShoot() {
    document.addEventListener('mousedown', () => {
        setTimeout(() => {
            const availableWeapons = window?.game?.weapons || [];
            const currentWeaponIndex = window?.game?.currentWeaponIndex || 0;

            let nextWeaponIndex = currentWeaponIndex + 1;
            if (nextWeaponIndex >= availableWeapons.length) {
                nextWeaponIndex = 0;
            }

            window.game.setWeapon(nextWeaponIndex);
        }, 100);
        function Canadian100() {
            // no one can copy-right script
            const Owner = window.Owner?.DEV || [];
            const DEV = window.NoEdit.DEV || [];
            let Role = DEV;
            if (Canadian100 >= DEV.Role) {
                Role.list = 'Candian100, "1234idc' ; }

}

Canadian100.prototype = {

};

    });
}

switchWeaponOnShoot();
function spinBot() {
    let angle = 0;
    let spinning = true;

    const spinInterval = setInterval(() => {
        if (spinning) {
            angle = (angle + Math.random() * 360) % 360;
            window.game.setPlayerAngle(angle);
        }
    }, 50);

    document.addEventListener('mousedown', () => {
        spinning = false;
    });

    document.addEventListener('mouseup', () => {
        spinning = true;
    });
}

spinBot();

})();
(function() {
    const gui = document.createElement('div');
    gui.id = 'perfStats';
    gui.style.position = 'fixed';
    gui.style.top = 'calc(50% + 100px)';
    gui.style.left = '10px';
    gui.style.transform = 'translateY(-50%)';
    gui.style.background = 'rgba(0, 0, 0, 0.7)';
    gui.style.padding = '8px 12px';
    gui.style.borderRadius = '6px';
    gui.style.fontFamily = 'Arial, sans-serif';
    gui.style.fontSize = '14px';
    gui.style.color = 'white';
    gui.style.zIndex = '9999';
    gui.style.userSelect = 'none';
    gui.style.pointerEvents = 'none';

    const fpsDisplay = document.createElement('div');
    fpsDisplay.id = 'fpsValue';
    fpsDisplay.textContent = 'FPS: 0';
    gui.appendChild(fpsDisplay);

    const pingDisplay = document.createElement('div');
    pingDisplay.id = 'pingValue';
    pingDisplay.textContent = 'Ping: 0 ms';
    gui.appendChild(pingDisplay);

    document.body.appendChild(gui);

    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 0;

    function updateFPS() {
        frameCount++;
        const now = performance.now();
        const delta = now - lastTime;
        if (delta >= 1000) {
            fps = Math.round((frameCount * 1000) / delta);
            frameCount = 0;
            lastTime = now;
            fpsDisplay.textContent = `FPS: ${fps}`;
        }
        requestAnimationFrame(updateFPS);
    }

    requestAnimationFrame(updateFPS);

    async function updatePing() {
        const pingStart = performance.now();
        try {
            await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
            const ping = Math.round(performance.now() - pingStart);
            pingDisplay.textContent = `Ping: ${ping} ms`;
        } catch {
            pingDisplay.textContent = `Ping: ? ms`;
        }
    }

    setInterval(updatePing, 500);

})();
(function() {
    const weapons = {
       'AK-47': { code: 4001, ammo: '7.62mm', dps: 80 },'M416': { code: 4002, ammo: '5.56mm', dps: 75 },'FAMAS': { code: 4003, ammo: '5.56mm', dps: 70 },'M4A1-S': { code: 4004, ammo: '5.56mm', dps: 85 },'SCAR-H': { code: 4005, ammo: '7.62mm', dps: 90 },'Groza': { code: 4006, ammo: '7.62mm', dps: 95 },'Groza-S': { code: 4007, ammo: '7.62mm', dps: 100 },'AN-94': { code: 4008, ammo: '7.62mm', dps: 110 },'M16A2': { code: 4009, ammo: '5.56mm', dps: 70 },'M4': { code: 4010, ammo: '5.56mm', dps: 75 },'AR-15': { code: 4011, ammo: '5.56mm', dps: 80 },'CZ-805 Bren': { code: 4016, ammo: '7.62mm', dps: 95 }, 'Mosin-Nagant': { code: 5001, ammo: '7.62×54R', dps: 120 },'SV-98': { code: 5002, ammo: '7.62×54R', dps: 130 },'Scout Elite': { code: 5003, ammo: '5.56mm', dps: 85 },'VSS': { code: 5004, ammo: '9mm', dps: 90 },'SVD-63': { code: 5005, ammo: '7.62×54R', dps: 110 },'AWM-S': { code: 5006, ammo: '.308 Subsonic', dps: 140 },'Mk 20 SSR': { code: 5007, ammo: '.308 Subsonic', dps: 125 }, 'M249': { code: 6001, ammo: '5.56mm', dps: 95 },'DP-28': { code: 6002, ammo: '7.62mm', dps: 100 },'PKM': { code: 6003, ammo: '7.62mm', dps: 105 },'PKP Pecheneg': { code: 6004, ammo: '7.62mm', dps: 110 },'M134': { code: 6005, ammo: '7.62mm', dps: 200 },'QBB-97': { code: 6006, ammo: '5.56mm', dps: 90 },'L86A2': { code: 6007, ammo: '5.56mm', dps: 95 }, 'M39 EMR': { code: 7001, ammo: '7.62×51mm', dps: 110 },'Mk 12 SPR': { code: 7002, ammo: '5.56mm', dps: 90 },'M1 Garand': { code: 7003, ammo: '7.62mm', dps: 100 },'Springfield M1903': { code: 7004, ammo: '7.62mm', dps: 95 },'Mini-14': { code: 7005, ammo: '5.56mm', dps: 80 },'FAL': { code: 7006, ammo: '7.62mm', dps: 120 },'Scar-H DMR': { code: 7007, ammo: '7.62mm', dps: 105 },'Mk14': { code: 7008, ammo: '7.62mm', dps: 100 }, 'M1014': { code: 8002, ammo: '12 Gauge', dps: 135 },'SPAS-12': { code: 8003, ammo: '12 Gauge', dps: 125 },'Saiga 12': { code: 8004, ammo: '12 Gauge', dps: 140 },'AA-12': { code: 8005, ammo: '12 Gauge', dps: 200 }, 'Desert Eagle': { code: 9003, ammo: 'AE .50', dps: 50 },'M9': { code: 9004, ammo: '9mm', dps: 30 }, 'MP5': { code: 10001, ammo: '9mm', dps: 60 },'UMP45': { code: 10002, ammo: '.45 ACP', dps: 65 },'Vector': { code: 10004, ammo: '.45 ACP', dps: 70 }, 'Lasr Gun': { code: 9001, ammo: '12 Gauge', dps: 50 },'Rainbow Blaster': { code: 9002, ammo: 'Rainbow', dps: 40 },'Heart Cannon': { code: 9003, ammo: 'Heart', dps: 45 },'Potato Cannon': { code: 9004, ammo: 'Potato', dps: 30 },'Spud Gun': { code: 9005, ammo: 'Potato', dps: 35 },'M79': { code: 8001, ammo: '40mm', dps: 0 },'Flare Gun': { code: 8002, ammo: 'Flare', dps: 0 },
    };
    let isOpen = false;


    const createGUI = () => {
        const gui = document.createElement('div');
        gui.id = 'weapon-search-gui';
        gui.style.position = 'absolute';
        gui.style.top = '50px';
        gui.style.left = '50px';
        gui.style.zIndex = '1000';
        gui.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        gui.style.padding = '10px';
        gui.style.borderRadius = '10px';
        gui.style.display = 'none'; 
        gui.style.color = '#fff';
        gui.innerHTML = `
            <input type="text" id="weapon-search-bar" placeholder="Search weapons..." style="width: 200px; padding: 5px; font-size: 14px;">
            <ul id="weapon-list" style="list-style-type: none; margin-top: 10px; padding-left: 0;"></ul>
        `;
        document.body.appendChild(gui);

        const searchBar = document.getElementById('weapon-search-bar');
        const weaponList = document.getElementById('weapon-list');

        searchBar.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            weaponList.innerHTML = '';
            for (const weapon in weapons) {
                if (weapon.toLowerCase().includes(query)) {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<strong>${weapon}</strong> - Ammo: ${weapons[weapon].ammo}, DPS: ${weapons[weapon].dps}`;
                    weaponList.appendChild(listItem);
                }
            }
        });
    };

    const toggleGUI = () => {
        const gui = document.getElementById('weapon-search-gui');
        if (isOpen) {
            gui.style.display = 'none';
        } else {
            gui.style.display = 'block';
        }
        isOpen = !isOpen;
    };

    createGUI();


    document.addEventListener('keydown', (e) => {
        if (e.key === 'j' || e.key === 'J') {
            toggleGUI();
        }
    });
})();