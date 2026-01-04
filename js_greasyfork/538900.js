// ==UserScript==
// @name         Bloxd.io Mod Menu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a mod menu with flight mode and other features to Bloxd.io
// @author       Dinzzx Hub
// @match        https://bloxd.io/*
// @icon         https://bloxd.io/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538900/Bloxdio%20Mod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/538900/Bloxdio%20Mod%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for game to load
    setTimeout(createModMenu, 3000);

    function createModMenu() {
        // Create mod menu UI
        const menu = document.createElement('div');
        menu.id = 'bloxd-mod-menu';
        menu.style.position = 'fixed';
        menu.style.top = '20px';
        menu.style.left = '20px';
        menu.style.backgroundColor = 'rgba(0,0,0,0.7)';
        menu.style.color = 'white';
        menu.style.padding = '10px';
        menu.style.borderRadius = '5px';
        menu.style.zIndex = '9999';
        menu.style.fontFamily = 'Arial, sans-serif';
        menu.style.minWidth = '200px';

        // Title
        const title = document.createElement('h3');
        title.textContent = 'Bloxd.io Mod Menu';
        title.style.marginTop = '0';
        title.style.marginBottom = '10px';
        title.style.textAlign = 'center';
        menu.appendChild(title);

        // Flight Mode Toggle
        const flightToggle = createToggle('Flight Mode', false, (enabled) => {
            if (enabled) {
                enableFlight();
            } else {
                disableFlight();
            }
        });
        menu.appendChild(flightToggle);

        // Speed Hack
        const speedControl = createSlider('Speed Multiplier', 1, 5, 1, 0.5, (value) => {
            setSpeedMultiplier(value);
        });
        menu.appendChild(speedControl);

        // No Clip Toggle
        const noClipToggle = createToggle('No Clip', false, (enabled) => {
            setNoClip(enabled);
        });
        menu.appendChild(noClipToggle);

        // Add menu to document
        document.body.appendChild(menu);

        // Make menu draggable
        makeDraggable(menu, title);
    }

    function createToggle(label, defaultState, callback) {
        const container = document.createElement('div');
        container.style.marginBottom = '8px';
        container.style.display = 'flex';
        container.style.justifyContent = 'space-between';
        container.style.alignItems = 'center';

        const labelElement = document.createElement('span');
        labelElement.textContent = label;
        container.appendChild(labelElement);

        const toggle = document.createElement('input');
        toggle.type = 'checkbox';
        toggle.checked = defaultState;
        toggle.addEventListener('change', () => {
            callback(toggle.checked);
        });

        container.appendChild(toggle);
        return container;
    }

    function createSlider(label, min, max, value, step, callback) {
        const container = document.createElement('div');
        container.style.marginBottom = '8px';

        const labelElement = document.createElement('div');
        labelElement.textContent = `${label}: ${value}`;
        container.appendChild(labelElement);

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.value = value;
        slider.step = step;
        slider.style.width = '100%';

        slider.addEventListener('input', () => {
            labelElement.textContent = `${label}: ${slider.value}`;
            callback(parseFloat(slider.value));
        });

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

    // Mod functions
    function enableFlight() {
        // Implementation depends on game structure
        console.log('Flight enabled');
        // Example: game.player.flying = true;
    }

    function disableFlight() {
        console.log('Flight disabled');
        // Example: game.player.flying = false;
    }

    function setSpeedMultiplier(value) {
        console.log(`Speed set to ${value}x`);
        // Example: game.player.speedMultiplier = value;
    }

    function setNoClip(enabled) {
        console.log(`No Clip ${enabled ? 'enabled' : 'disabled'}`);
        // Example: game.player.noClip = enabled;
    }
})();