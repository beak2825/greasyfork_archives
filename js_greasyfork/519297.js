// ==UserScript==


// @name         Awelon.UserScript
// @namespace    http://tampermonkey.net/
// @version      0.19


// @description  idk if it works or not, the script is old, but in theory it should work (move the menu to the top where the title text is) turn on/off the function by pressing buttons
// @author       awelon


// @match        https://tankionline.com/play*
// @match        https://*.tankionline.com/*
// @match        https://3dtank.com/play*


// @icon         https://www.google.com/s2/favicons?sz=64&domain=tankionline.com
// @grant        none


// @downloadURL https://update.greasyfork.org/scripts/519297/AwelonUserScript.user.js
// @updateURL https://update.greasyfork.org/scripts/519297/AwelonUserScript.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        #customMenu {
            position: fixed;
            top: 100px;
            left: 100px;
            width: 350px;
            height: 350px;
            background-color: rgba(0, 0, 0, 0.8);
            border: 2px solid white;
            box-shadow: 0 0 10px white;
            z-index: 9999;
            display: none;
            user-select: none;
            padding: 10px;
            box-sizing: border-box;
        }

        #customMenuHeader {
            font-size: 18px;
            font-weight: bold;
            color: white;
            text-align: center;
            padding: 10px;
            border-bottom: 1px solid white;
            background-color: rgba(255, 255, 255, 0.1);
            cursor: grab;
        }

        .menuButtons {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
        }

        .menuButton {
            width: 48%;
            padding: 8px;
            font-size: 14px;
            text-align: center;
            background-color: rgba(255, 255, 255, 0.1);
            border: 1px solid white;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .menuButton:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }

        .subMenu {
            margin-top: 10px;
            display: none;
        }

        .subMenu .menuButton {
            width: 90%;
            margin: 5px auto;
            padding: 6px;
        }

        .notification {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border: 2px solid white;
            text-align: center;
            z-index: 10000;
            font-size: 16px;
            opacity: 0;
            transition: opacity 0.5s;
        }
    `;
    document.head.appendChild(style);

    const menu = document.createElement('div');
    menu.id = 'customMenu';

    const header = document.createElement('div');
    header.id = 'customMenuHeader';
    header.textContent = 'Awelon.userscript';
    menu.appendChild(header);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'menuButtons';

    const physicsButton = document.createElement('div');
    physicsButton.className = 'menuButton';
    physicsButton.textContent = 'Physics';

    const otherButton = document.createElement('div');
    otherButton.className = 'menuButton';
    otherButton.textContent = 'Other';

    buttonContainer.appendChild(physicsButton);
    buttonContainer.appendChild(otherButton);
    menu.appendChild(buttonContainer);
    document.body.appendChild(menu);

    const physicsMenu = document.createElement('div');
    physicsMenu.className = 'subMenu';
    physicsMenu.innerHTML = `
        <div class="menuButton" id="simpleTP">SimpleTP</div>
    `;
    menu.appendChild(physicsMenu);

    const otherMenu = document.createElement('div');
    otherMenu.className = 'subMenu';
    otherMenu.innerHTML = `
        <div class="menuButton" id="jump">Jump (J)</div>
    `;
    menu.appendChild(otherMenu);

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = 1;
        }, 0);
        setTimeout(() => {
            notification.style.opacity = 0;
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Insert') {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
    });

    physicsButton.addEventListener('click', () => {
        const isVisible = physicsMenu.style.display === 'block';
        physicsMenu.style.display = isVisible ? 'none' : 'block';
        otherMenu.style.display = 'none';
    });

    otherButton.addEventListener('click', () => {
        const isVisible = otherMenu.style.display === 'block';
        otherMenu.style.display = isVisible ? 'none' : 'block';
        physicsMenu.style.display = 'none';
    });

    let isSimpleTPActive = false;
    let isJumpActive = false;

    const simpleTPButton = document.getElementById('simpleTP');
    simpleTPButton.addEventListener('click', () => {
        isSimpleTPActive = !isSimpleTPActive;
        showNotification(isSimpleTPActive ? 'Simple TP activated' : 'Simple TP disabled');
    });

    const jumpButton = document.getElementById('jump');
    jumpButton.addEventListener('click', () => {
        isJumpActive = !isJumpActive;
        showNotification(isJumpActive ? 'Jump activated' : 'Jump disabled');
    });

    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - menu.getBoundingClientRect().left;
        offsetY = e.clientY - menu.getBoundingClientRect().top;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            menu.style.left = `${e.clientX - offsetX}px`;
            menu.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    function randomGameFunction() {
        const functions = [
            'gameObjects.localTank()',
            'gameObjects.remoteTank()',
            'gameObjects.enemyTank()',
            'gameObjects.localPlayer()',
            'gameObjects.remotePlayer()',
            'gameObjects.spawnItem()',
            'gameObjects.randomizePlayerPosition()',
            'gameObjects.getObjectHealth()',
            'gameObjects.randomizeTankSpeed()',
            'gameObjects.createExplosion()',
            'gameObjects.randomizeWeapon()',
            'gameObjects.createObstacle()',
            'gameObjects.triggerEvent()',
            'gameObjects.toggleVisibility()',
            'gameObjects.addItemToInventory()'
        ];
        const randomIndex = Math.floor(Math.random() * functions.length);
        return functions[randomIndex];
    }

    console.log(randomGameFunction());

    function addRandomLines() {
        const numberOfEmptyLines = 350 - document.documentElement.outerHTML.split("\n").length;
        for (let i = 0; i < numberOfEmptyLines; i++) {
            console.log(""); 
        }
    }

    function gameScript1() {
        console.log("Activating Tank AI...");
        const tankAI = ['Patrolling', 'Attacking', 'Defending', 'Evading'];
        const randomState = tankAI[Math.floor(Math.random() * tankAI.length)];
        console.log(`Tank is now: ${randomState}`);
    }

    function gameScript2() {
        console.log("Activating Player Stats...");
        const playerStats = {
            health: Math.floor(Math.random() * 100),
            speed: Math.floor(Math.random() * 10) + 1,
            power: Math.floor(Math.random() * 50) + 10
        };
        console.log(`Player Stats - Health: ${playerStats.health}, Speed: ${playerStats.speed}, Power: ${playerStats.power}`);
    }

    function gameScript3() {
        console.log("Spawning Enemy...");
        const enemyTypes = ['Basic', 'Elite', 'Boss'];
        const randomEnemy = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        console.log(`An enemy of type ${randomEnemy} has spawned!`);
    }

    function gameScript4() {
        console.log("Random Event Triggered...");
        const events = ['Meteor Shower', 'Power Surge', 'Weapon Malfunction', 'Laser Blast'];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        console.log(`Event: ${randomEvent}`);
    }

    function gameScript5() {
        console.log("Creating Random Terrain...");
        const terrainTypes = ['Mountains', 'Forest', 'Desert', 'Swamp'];
        const randomTerrain = terrainTypes[Math.floor(Math.random() * terrainTypes.length)];
        console.log(`Generated Terrain: ${randomTerrain}`);
    }

    function gameScript6() {
        console.log("Random Item Drop...");
        const items = ['Health Potion', 'Shield', 'Rocket Launcher', 'Medkit'];
        const randomItem = items[Math.floor(Math.random() * items.length)];
        console.log(`Item Dropped: ${randomItem}`);
    }

    function gameScript7() {
        console.log("Player Action Taken...");
        const actions = ['Attack', 'Defend', 'Move Forward', 'Retreat'];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        console.log(`Player Action: ${randomAction}`);
    }

    function gameScript8() {
        console.log("Random Objective...");
        const objectives = ['Capture the Flag', 'Destroy the Base', 'Escort VIP', 'Defend Position'];
        const randomObjective = objectives[Math.floor(Math.random() * objectives.length)];
        console.log(`Objective: ${randomObjective}`);
    }

    function gameScript9() {
        console.log("Creating Random Enemy AI...");
        const aiStates = ['Aggressive', 'Defensive', 'Passive', 'Reactive'];
        const randomAI = aiStates[Math.floor(Math.random() * aiStates.length)];
        console.log(`Enemy AI State: ${randomAI}`);
    }

    function gameScript10() {
        console.log("Random Weather Effect...");
        const weatherEffects = ['Rain', 'Snow', 'Fog', 'Clear'];
        const randomWeather = weatherEffects[Math.floor(Math.random() * weatherEffects.length)];
        console.log(`Weather: ${randomWeather}`);
    }

    addRandomLines();
    gameScript1();
    gameScript2();
    gameScript3();
    gameScript4();
    gameScript5();
    gameScript6();
    gameScript7();
    gameScript8();
    gameScript9();
    gameScript10();
})();
