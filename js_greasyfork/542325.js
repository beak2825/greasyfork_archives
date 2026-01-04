// ==UserScript==
// @name         Poxel.io menu broken script gone wrong
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Draggable GUI with custom crosshair and more i dont give a crap and more for Poxel.io
// @author       You
// @match        *://poxel.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542325/Poxelio%20menu%20broken%20script%20gone%20wrong.user.js
// @updateURL https://update.greasyfork.org/scripts/542325/Poxelio%20menu%20broken%20script%20gone%20wrong.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========== CREATE MOD MENU ==========
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '100px';
    menu.style.left = '20px';
    menu.style.padding = '10px';
    menu.style.background = 'rgba(0,0,0,0.85)';
    menu.style.color = 'white';
    menu.style.fontFamily = 'sans-serif';
    menu.style.zIndex = '99999';
    menu.style.borderRadius = '10px';
    menu.style.fontSize = '14px';
    menu.style.maxWidth = '220px';
    menu.style.cursor = 'move';
    menu.innerHTML = `<b>🎮 Poxel Mod Menu</b><br><br>`;
    document.body.appendChild(menu);

    // Drag logic
    let isDragging = false, offsetX = 0, offsetY = 0;
    menu.addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
    });
    document.addEventListener('mousemove', e => {
        if (isDragging) {
            menu.style.left = (e.clientX - offsetX) + 'px';
            menu.style.top = (e.clientY - offsetY) + 'px';
        }
    });
    document.addEventListener('mouseup', () => isDragging = false);

    // ========== UTILITY: ADD TOGGLE ==========
    function addToggle(name, callback) {
        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.marginBottom = '6px';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.style.marginRight = '6px';
        input.addEventListener('change', () => callback(input.checked));
        label.appendChild(input);
        label.appendChild(document.createTextNode(name));
        menu.appendChild(label);
    }

    // ========== CROSSHAIR SELECTOR ==========
    const crosshair = document.createElement('div');
    crosshair.style.position = 'fixed';
    crosshair.style.top = '50%';
    crosshair.style.left = '50%';
    crosshair.style.transform = 'translate(-50%, -50%)';
    crosshair.style.zIndex = '9999';
    crosshair.style.pointerEvents = 'none';
    crosshair.style.display = 'none';
    document.body.appendChild(crosshair);

    const crosshairs = {
        Dot: '8px solid red',
        Cross: '1px solid lime',
        X: '2px dashed white',
        Circle: '2px solid yellow',
    };

    const select = document.createElement('select');
    for (const name in crosshairs) {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    }
    menu.appendChild(document.createTextNode("Crosshair Style: "));
    menu.appendChild(select);

    addToggle("🎯 Show Crosshair", (on) => {
        crosshair.style.display = on ? 'block' : 'none';
    });

    select.addEventListener('change', () => {
        const style = crosshairs[select.value];
        crosshair.style.width = '12px';
        crosshair.style.height = '12px';
        crosshair.style.border = style;
        crosshair.style.borderRadius = select.value === 'Circle' ? '50%' : '0';
    });
    select.dispatchEvent(new Event('change'));

    // ========== KILL COUNTER ==========
    let killCount = 0;
    const killDisplay = document.createElement('div');
    killDisplay.style.position = 'fixed';
    killDisplay.style.top = '10px';
    killDisplay.style.right = '10px';
    killDisplay.style.background = 'rgba(0,0,0,0.6)';
    killDisplay.style.color = 'white';
    killDisplay.style.padding = '5px 10px';
    killDisplay.style.fontFamily = 'monospace';
    killDisplay.style.zIndex = '9999';
    killDisplay.textContent = 'Kills: 0';
    document.body.appendChild(killDisplay);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            if (m.addedNodes.length && m.addedNodes[0].textContent.includes('You killed')) {
                killCount++;
                killDisplay.textContent = `Kills: ${killCount}`;
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // ========== AIM TRAINER (Moving Dot) ==========
    const aimDot = document.createElement('div');
    Object.assign(aimDot.style, {
        position: 'fixed', width: '14px', height: '14px', background: 'lime',
        borderRadius: '50%', zIndex: '9999', display: 'none'
    });
    document.body.appendChild(aimDot);

    let trainerInterval;
    addToggle("🎯 Aim Trainer Dot", (on) => {
        if (on) {
            aimDot.style.display = 'block';
            trainerInterval = setInterval(() => {
                aimDot.style.top = Math.random() * 90 + '%';
                aimDot.style.left = Math.random() * 90 + '%';
            }, 800);
        } else {
            clearInterval(trainerInterval);
            aimDot.style.display = 'none';
        }
    });
})();