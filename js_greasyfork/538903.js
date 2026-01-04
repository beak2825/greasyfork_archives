// ==UserScript==
// @name         Bloxd.io Advanced Mod Menu By Dinnzx
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds Aimbot, ESP and other cheats to Bloxd.io
// @author       Dindra
// @match        https://bloxd.io/*
// @icon         https://bloxd.io/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538903/Bloxdio%20Advanced%20Mod%20Menu%20By%20Dinnzx.user.js
// @updateURL https://update.greasyfork.org/scripts/538903/Bloxdio%20Advanced%20Mod%20Menu%20By%20Dinnzx.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const config = {
        aimbot: {
            enabled: false,
            fov: 60,
            smoothness: 5,
            bone: 'head' // head/body
        },
        esp: {
            enabled: false,
            box: true,
            name: true,
            health: true,
            distance: true,
            maxDistance: 500
        },
        misc: {
            fly: false,
            speed: 1.0,
            noClip: false
        }
    };

    // Wait for game to load
    let gameLoaded = false;
    const checkInterval = setInterval(() => {
        if (typeof window.GAME !== 'undefined') {
            gameLoaded = true;
            clearInterval(checkInterval);
            initModMenu();
        }
    }, 1000);

    function initModMenu() {
        // Create mod menu UI
        const menu = document.createElement('div');
        menu.id = 'bloxd-advanced-mod-menu';
        Object.assign(menu.style, {
            position: 'fixed',
            top: '20px',
            left: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '15px',
            borderRadius: '5px',
            zIndex: '99999',
            fontFamily: 'Arial, sans-serif',
            minWidth: '250px',
            border: '1px solid #444',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
        });

        // Title and close button
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '10px';

        const title = document.createElement('h3');
        title.textContent = 'Bloxd.io Mod Menu';
        title.style.margin = '0';
        title.style.cursor = 'move';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.color = 'white';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = () => menu.style.display = 'none';

        header.appendChild(title);
        header.appendChild(closeBtn);
        menu.appendChild(header);

        // Create tabs
        const tabs = ['Aimbot', 'ESP', 'Misc'];
        const tabContainer = document.createElement('div');
        tabContainer.style.display = 'flex';
        tabContainer.style.marginBottom = '10px';

        const contentContainer = document.createElement('div');
        contentContainer.id = 'mod-menu-content';

        tabs.forEach(tabName => {
            const tab = document.createElement('button');
            tab.textContent = tabName;
            tab.style.flex = '1';
            tab.style.padding = '5px';
            tab.style.border = 'none';
            tab.style.background = '#333';
            tab.style.color = 'white';
            tab.style.cursor = 'pointer';
            tab.onclick = () => showTab(tabName.toLowerCase());
            tabContainer.appendChild(tab);
        });

        menu.appendChild(tabContainer);
        menu.appendChild(contentContainer);

        // Create tab contents
        createAimbotTab();
        createESPTab();
        createMiscTab();

        // Add menu to document
        document.body.appendChild(menu);

        // Make menu draggable
        makeDraggable(menu, title);

        // Show first tab by default
        showTab('aimbot');

        // Start cheat loops
        startCheatLoops();
    }

    function createAimbotTab() {
        const container = document.createElement('div');
        container.id = 'aimbot-tab';
        container.style.display = 'none';

        container.appendChild(createToggle('Enable Aimbot', config.aimbot.enabled, (val) => {
            config.aimbot.enabled = val;
        }));

        container.appendChild(createSlider('Aimbot FOV', 10, 180, config.aimbot.fov, 5, (val) => {
            config.aimbot.fov = val;
        }));

        container.appendChild(createSlider('Smoothness', 1, 20, config.aimbot.smoothness, 1, (val) => {
            config.aimbot.smoothness = val;
        }));

        // Bone selection
        const boneContainer = document.createElement('div');
        boneContainer.style.marginBottom = '10px';
        boneContainer.style.display = 'flex';
        boneContainer.style.alignItems = 'center';
        boneContainer.style.justifyContent = 'space-between';

        const boneLabel = document.createElement('span');
        boneLabel.textContent = 'Aim Bone:';

        const boneSelect = document.createElement('select');
        ['head', 'body'].forEach(bone => {
            const option = document.createElement('option');
            option.value = bone;
            option.textContent = bone;
            if (bone === config.aimbot.bone) option.selected = true;
            boneSelect.appendChild(option);
        });

        boneSelect.onchange = () => config.aimbot.bone = boneSelect.value;

        boneContainer.appendChild(boneLabel);
        boneContainer.appendChild(boneSelect);
        container.appendChild(boneContainer);

        document.getElementById('mod-menu-content').appendChild(container);
    }

    function createESPTab() {
        const container = document.createElement('div');
        container.id = 'esp-tab';
        container.style.display = 'none';

        container.appendChild(createToggle('Enable ESP', config.esp.enabled, (val) => {
            config.esp.enabled = val;
            if (!val) clearESP();
        }));

        container.appendChild(createToggle('Box ESP', config.esp.box, (val) => {
            config.esp.box = val;
        }));

        container.appendChild(createToggle('Show Names', config.esp.name, (val) => {
            config.esp.name = val;
        }));

        container.appendChild(createToggle('Show Health', config.esp.health, (val) => {
            config.esp.health = val;
        }));

        container.appendChild(createToggle('Show Distance', config.esp.distance, (val) => {
            config.esp.distance = val;
        }));

        container.appendChild(createSlider('Max Distance', 50, 1000, config.esp.maxDistance, 50, (val) => {
            config.esp.maxDistance = val;
        }));

        document.getElementById('mod-menu-content').appendChild(container);
    }

    function createMiscTab() {
        const container = document.createElement('div');
        container.id = 'misc-tab';
        container.style.display = 'none';

        container.appendChild(createToggle('Fly Hack', config.misc.fly, (val) => {
            config.misc.fly = val;
            if (val) enableFly();
            else disableFly();
        }));

        container.appendChild(createSlider('Speed Multiplier', 0.1, 5, config.misc.speed, 0.1, (val) => {
            config.misc.speed = val;
            setSpeed(val);
        }));

        container.appendChild(createToggle('No Clip', config.misc.noClip, (val) => {
            config.misc.noClip = val;
            setNoClip(val);
        }));

        document.getElementById('mod-menu-content').appendChild(container);
    }

    function showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('#mod-menu-content > div').forEach(tab => {
            tab.style.display = 'none';
        });

        // Show selected tab
        document.getElementById(`${tabName}-tab`).style.display = 'block';
    }

    function createToggle(label, defaultState, callback) {
        const container = document.createElement('div');
        container.style.marginBottom = '10px';
        container.style.display = 'flex';
        container.style.justifyContent = 'space-between';
        container.style.alignItems = 'center';

        const labelElement = document.createElement('span');
        labelElement.textContent = label;

        const toggle = document.createElement('input');
        toggle.type = 'checkbox';
        toggle.checked = defaultState;
        toggle.style.cursor = 'pointer';
        toggle.addEventListener('change', () => callback(toggle.checked));

        container.appendChild(labelElement);
        container.appendChild(toggle);
        return container;
    }

    function createSlider(label, min, max, value, step, callback) {
        const container = document.createElement('div');
        container.style.marginBottom = '15px';

        const labelElement = document.createElement('div');
        labelElement.textContent = `${label}: ${value}`;
        labelElement.style.marginBottom = '5px';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.value = value;
        slider.step = step;
        slider.style.width = '100%';
        slider.style.cursor = 'pointer';

        slider.addEventListener('input', () => {
            labelElement.textContent = `${label}: ${slider.value}`;
            callback(parseFloat(slider.value));
        });

        container.appendChild(labelElement);
        container.appendChild(slider);
        return container;
    }

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Cheat functions
    function startCheatLoops() {
        // ESP rendering loop
        setInterval(() => {
            if (config.esp.enabled) {
                renderESP();
            }
        }, 100);

        // Aimbot loop
        setInterval(() => {
            if (config.aimbot.enabled) {
                runAimbot();
            }
        }, 50);
    }

    function runAimbot() {
        // This needs to be implemented based on the game's structure
        // Pseudocode:
        /*
        const players = getEnemyPlayers();
        const localPlayer = getLocalPlayer();
        const fovRad = config.aimbot.fov * (Math.PI / 180);
        
        let closestPlayer = null;
        let closestAngle = fovRad;
        
        players.forEach(player => {
            if (player.health <= 0) return;
            
            const angle = calculateAngleToPlayer(localPlayer, player, config.aimbot.bone);
            if (angle < closestAngle) {
                closestAngle = angle;
                closestPlayer = player;
            }
        });
        
        if (closestPlayer) {
            const targetAngle = calculateTargetAngle(localPlayer, closestPlayer, config.aimbot.bone);
            smoothAim(localPlayer, targetAngle, config.aimbot.smoothness);
        }
        */
    }

    function renderESP() {
        clearESP();
        
        // This needs to be implemented based on the game's structure
        // Pseudocode:
        /*
        const players = getEnemyPlayers();
        const localPlayer = getLocalPlayer();
        
        players.forEach(player => {
            if (player.health <= 0) return;
            
            const distance = calculateDistance(localPlayer, player);
            if (distance > config.esp.maxDistance) return;
            
            const screenPos = worldToScreen(player.position);
            if (!screenPos) return;
            
            // Draw box
            if (config.esp.box) {
                drawBox(screenPos, player.width, player.height, player.health);
            }
            
            // Draw info
            let infoText = '';
            if (config.esp.name) infoText += player.name + '\n';
            if (config.esp.health) infoText += `HP: ${player.health}\n`;
            if (config.esp.distance) infoText += `${distance.toFixed(1)}m`;
            
            if (infoText) {
                drawText(screenPos.x, screenPos.y - 20, infoText);
            }
        });
        */
    }

    function clearESP() {
        // Remove all ESP elements from the screen
        const espElements = document.querySelectorAll('.esp-element');
        espElements.forEach(el => el.remove());
    }

    function enableFly() {
        // Implement based on game structure
        // Example: window.GAME.player.flying = true;
    }

    function disableFly() {
        // Implement based on game structure
        // Example: window.GAME.player.flying = false;
    }

    function setSpeed(value) {
        // Implement based on game structure
        // Example: window.GAME.player.speedMultiplier = value;
    }

    function setNoClip(enabled) {
        // Implement based on game structure
        // Example: window.GAME.player.noClip = enabled;
    }

    // Helper function to create ESP elements
    function createESPElement(type, className, styles = {}) {
        const element = document.createElement('div');
        element.className = `esp-element esp-${type} ${className}`;
        Object.assign(element.style, {
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: '99998'
        }, styles);
        document.body.appendChild(element);
        return element;
    }
})();