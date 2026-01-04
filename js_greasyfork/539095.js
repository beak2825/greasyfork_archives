// ==UserScript==
// @name         Kirka.io Chams/Wallhacks GUI (2025) **WORKING**
// @author       Emulation
// @match        *://kirka.io/*
// @version      1.3
// @description  Toggleable working wallhack (chams) GUI for Kirka.io by Emulation
// @run-at       document-start
// @namespace    EmuChams
// @license      Emulation
// @downloadURL https://update.greasyfork.org/scripts/539095/Kirkaio%20ChamsWallhacks%20GUI%20%282025%29%20%2A%2AWORKING%2A%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/539095/Kirkaio%20ChamsWallhacks%20GUI%20%282025%29%20%2A%2AWORKING%2A%2A.meta.js
// ==/UserScript==

(function () {
    let enabled = true;
    const modifiedMaterials = new WeakSet();

    // Patch material colors for chams ON/OFF
    const patchMaterial = (material) => {
        if (!material || !material.map || !material.map.image) return;
        const isTarget = material.map.image.width === 64 && material.map.image.height === 64;
        if (!isTarget) return;

        if (enabled && !modifiedMaterials.has(material)) {
            for (let key in material) {
                if (material[key] === 3) {
                    material[key] = 1;
                    modifiedMaterials.add(material);
                }
            }
        } else if (!enabled && modifiedMaterials.has(material)) {
            for (let key in material) {
                if (material[key] === 1) {
                    material[key] = 3;
                }
            }
            modifiedMaterials.delete(material);
        }
    };

    // Hook Array.isArray to intercept material use
    const proxyHandler = {
        apply(target, thisArg, args) {
            patchMaterial(args[0]);
            return Reflect.apply(target, thisArg, args);
        }
    };
    const originalIsArray = Array.isArray;
    Array.isArray = new Proxy(originalIsArray, proxyHandler);

    // Force material patching on any new materials dynamically
    const observeMaterials = () => {
        const interval = setInterval(() => {
            if (window.THREE) {
                const walk = (obj) => {
                    if (!obj || typeof obj !== "object") return;
                    if (obj.material) {
                        const mat = obj.material;
                        if (Array.isArray(mat)) mat.forEach(patchMaterial);
                        else patchMaterial(mat);
                    }
                    for (const key in obj) {
                        if (obj.hasOwnProperty(key)) walk(obj[key]);
                    }
                };
                walk(window);
                clearInterval(interval);
            }
        }, 1000);
    };

    // GUI creation function
    function createGUI() {
        const gui = document.createElement('div');
        gui.innerHTML = `
            <div id="emu-chams-gui" style="
                position: fixed;
                top: 120px;
                left: 120px;
                background: rgba(30, 30, 30, 0.9);
                border: 1px solid #00f0ff;
                border-radius: 12px;
                padding: 15px;
                width: 220px;
                font-family: 'Segoe UI', sans-serif;
                color: #fff;
                z-index: 9999;
                box-shadow: 0 0 15px rgba(0, 240, 255, 0.6);
                user-select: none;
                cursor: grab;
            ">
                <div style="margin-bottom: 10px; font-size: 17px; font-weight: bold;">
                    🎯 Emu's Chams
                </div>
                <div>Status: <span id="chams-status" style="color:#00ff90;">ON</span></div>
                <button id="toggle-chams" style="
                    margin-top: 10px;
                    width: 100%;
                    background: #00f0ff;
                    color: #000;
                    font-weight: bold;
                    border: none;
                    padding: 8px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background 0.3s ease;
                ">Toggle Chams</button>
                <div style="margin-top: 10px; font-size: 12px; text-align: right;">By <b>Emulation</b></div>
            </div>
        `;
        document.body.appendChild(gui);

        const guiBox = document.getElementById('emu-chams-gui');
        const toggleBtn = document.getElementById('toggle-chams');
        const statusText = document.getElementById('chams-status');

        toggleBtn.onclick = () => {
            enabled = !enabled;
            statusText.textContent = enabled ? 'ON' : 'OFF';
            statusText.style.color = enabled ? '#00ff90' : '#ff4f4f';
            toggleBtn.style.background = enabled ? '#00f0ff' : '#ff4f4f';

            // Reapply patches to materials immediately after toggle
            observeMaterials();
        };

        // Draggable GUI logic
        let isDragging = false, offsetX = 0, offsetY = 0;

        guiBox.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - guiBox.getBoundingClientRect().left;
            offsetY = e.clientY - guiBox.getBoundingClientRect().top;
            guiBox.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                guiBox.style.left = `${e.clientX - offsetX}px`;
                guiBox.style.top = `${e.clientY - offsetY}px`;
            }
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            guiBox.style.cursor = 'grab';
        });
    }

    // Wait for DOM to be ready then create GUI
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createGUI);
    } else {
        createGUI();
    }

    // Initial call to start watching materials
    observeMaterials();

})();
