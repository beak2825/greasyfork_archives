// ==UserScript==
// @name         DrainGang
// @namespace    http://tampermonkey.net/
// @description  We am human
// @version      1.0
// @author       Psykos
// @match        https://tanktrouble.com/*
// @grant        none
// @license      MIT
// @require      https://update.greasyfork.org/scripts/482092/1309109/TankTrouble%20Development%20Library.js
// @downloadURL https://update.greasyfork.org/scripts/531452/DrainGang.user.js
// @updateURL https://update.greasyfork.org/scripts/531452/DrainGang.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Configuration
    const SPEED_CONFIG = {
        baseSpeed: 3,
        boostMultiplier: 2,
        minSpeed: 1,
        maxSpeed: 10
    };
    
    // Tank object
    const tank = {
        x: 300,
        y: 200,
        angle: 0,
        size: 20,
        baseSpeed: SPEED_CONFIG.baseSpeed,
        boostMultiplier: SPEED_CONFIG.boostMultiplier,
        isBoostActive: false
    };
    
    // Input handling
    const keys = {};
    window.addEventListener('keydown', e => keys[e.key] = true);
    window.addEventListener('keyup', e => keys[e.key] = false);
    
    // Functions
    function getCurrentSpeed() {
        return tank.baseSpeed * (tank.isBoostActive ? tank.boostMultiplier : 1);
    }
    
    function toggleBoost() {
        tank.isBoostActive = !tank.isBoostActive;
        const boostStatus = document.getElementById('boostStatus');
        if (boostStatus) {
            boostStatus.textContent = `Boost: ${tank.isBoostActive ? 'ON' : 'OFF'}`;
        }
    }
    
    function adjustBaseSpeed(amount) {
        tank.baseSpeed = Math.max(
            SPEED_CONFIG.minSpeed,
            Math.min(SPEED_CONFIG.maxSpeed, tank.baseSpeed + amount)
        );
        const speedValue = document.getElementById('speedValue');
        if (speedValue) {
            speedValue.textContent = tank.baseSpeed;
        }
    }
    
    function update() {
        const currentSpeed = getCurrentSpeed();
        
        // Movement
        if (keys['w'] || keys['W']) tank.y -= currentSpeed;
        if (keys['s'] || keys['S']) tank.y += currentSpeed;
        if (keys['a'] || keys['A']) tank.x -= currentSpeed;
        if (keys['d'] || keys['D']) tank.x += currentSpeed;
        
        // Additional game logic here
    }
    
    // Create UI
    function createUI() {
        const uiContainer = document.createElement('div');
        uiContainer.className = 'draingang-controls';
        uiContainer.style.position = 'absolute';
        uiContainer.style.top = '10px';
        uiContainer.style.left = '10px';
        uiContainer.style.zIndex = '9999';
        uiContainer.style.padding = '10px';
        uiContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        uiContainer.style.color = 'white';
        uiContainer.style.fontFamily = 'Arial, sans-serif';
        
        // Speed slider
        const speedLabel = document.createElement('label');
        speedLabel.textContent = 'Base Speed: ';
        
        const speedSlider = document.createElement('input');
        speedSlider.type = 'range';
        speedSlider.id = 'baseSpeed';
        speedSlider.min = SPEED_CONFIG.minSpeed;
        speedSlider.max = SPEED_CONFIG.maxSpeed;
        speedSlider.value = tank.baseSpeed;
        speedSlider.addEventListener('input', (e) => {
            tank.baseSpeed = parseInt(e.target.value);
            document.getElementById('speedValue').textContent = tank.baseSpeed;
        });
        
        const speedValue = document.createElement('span');
        speedValue.id = 'speedValue';
        speedValue.textContent = tank.baseSpeed;
        
        // Boost button
        const boostButton = document.createElement('button');
        boostButton.textContent = 'Toggle Speed Boost';
        boostButton.onclick = toggleBoost;
        boostButton.style.marginLeft = '10px';
        
        const boostStatus = document.createElement('span');
        boostStatus.id = 'boostStatus';
        boostStatus.textContent = `Boost: ${tank.isBoostActive ? 'ON' : 'OFF'}`;
        boostStatus.style.marginLeft = '10px';
        
        // Append elements
        speedLabel.appendChild(speedSlider);
        speedLabel.appendChild(document.createTextNode(' '));
        speedLabel.appendChild(speedValue);
        
        uiContainer.appendChild(speedLabel);
        uiContainer.appendChild(boostButton);
        uiContainer.appendChild(boostStatus);
        
        document.body.appendChild(uiContainer);
    }
    
    // Initialize
    function init() {
        createUI();
        // Set up game loop for updating
        setInterval(update, 1000/60);
    }
    
    // Wait for page to load
    window.addEventListener('load', init);
})();