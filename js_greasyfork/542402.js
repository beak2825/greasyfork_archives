// ==UserScript==
// @name         Poxel.io Custom Crosshair + Smart Macro + Anti-Lag + Real FPS GUI
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Draggable GUI with custom crosshair, real FPS counter, smart auto macro, and anti-lag for Poxel.io — press M to toggle the mod menu visibility
// @author       You
// @match        *://poxel.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542402/Poxelio%20Custom%20Crosshair%20%2B%20Smart%20Macro%20%2B%20Anti-Lag%20%2B%20Real%20FPS%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/542402/Poxelio%20Custom%20Crosshair%20%2B%20Smart%20Macro%20%2B%20Anti-Lag%20%2B%20Real%20FPS%20GUI.meta.js
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
    menu.style.maxWidth = '240px';
    menu.style.cursor = 'move';
    menu.innerHTML = `<b>🔧 Poxel Mod Menu</b><br><br>`;
    document.body.appendChild(menu);

    // Toggle menu visibility with M key
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'm') {
            menu.style.display = (menu.style.display === 'none') ? 'block' : 'none';
        }
    });

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

    // ========== CUSTOM CROSSHAIR ==========
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

    // ========== SMART MACRO ==========
    let macroActive = false;
    let macroInterval = null;
    addToggle("⚡ Smart Macro Spray", (on) => {
        macroActive = on;
        if (on) {
            macroInterval = setInterval(() => {
                const enemies = document.querySelectorAll('.enemy, .player:not(.me)');
                if (enemies.length > 0) {
                    window.dispatchEvent(new MouseEvent('mousedown'));
                    window.dispatchEvent(new MouseEvent('mouseup'));
                }
            }, 100);
        } else {
            clearInterval(macroInterval);
        }
    });

    // ========== ANTI-LAG ==========
    const removeLagElements = () => {
        const selectors = ['#adContainer', '.adsbygoogle', 'iframe', 'script[src*="analytics"]'];
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => el.remove());
        });
    };

    addToggle("🚀 Anti-Lag Boost", (on) => {
        if (on) {
            removeLagElements();
            setTimeout(removeLagElements, 3000);
        }
    });

    // ========== REAL FPS DISPLAY ==========
    const fpsDisplay = document.createElement('div');
    Object.assign(fpsDisplay.style, {
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        padding: '5px 10px',
        background: 'rgba(0,0,0,0.7)',
        color: 'lime',
        fontFamily: 'monospace',
        fontSize: '13px',
        zIndex: '9999',
        display: 'none'
    });
    document.body.appendChild(fpsDisplay);

    let lastFrame = performance.now();
    let frameCount = 0;
    function trackFPS() {
        const now = performance.now();
        frameCount++;
        if (now - lastFrame >= 1000) {
            fpsDisplay.textContent = `FPS: ${frameCount}`;
            frameCount = 0;
            lastFrame = now;
        }
        requestAnimationFrame(trackFPS);
    }
    trackFPS();

    addToggle("📈 Real FPS", (on) => {
        fpsDisplay.style.display = on ? 'block' : 'none';
    });
})();