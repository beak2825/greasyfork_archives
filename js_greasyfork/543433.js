// ==UserScript==
// @name         Drednot.io Inventory/motd Menu
// @namespace    https://drednot.io/
// @version      2.1
// @description  Inventory UI scale & transparency with ALT menu, draggable, and custom Team MOTD toggle (now with saved settings)
// @match        https://*.drednot.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543433/Drednotio%20Inventorymotd%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/543433/Drednotio%20Inventorymotd%20Menu.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MENU_ID = 'inventoryMenuCustom';
    const MOTD_ID = 'motd';
    let menuVisible = false;

    // Load settings
    let scale = parseFloat(localStorage.getItem('inventoryScale')) || 0.6;
    let opacity = parseFloat(localStorage.getItem('inventoryOpacity')) || 1.0;
    let motdVisible = localStorage.getItem('motdVisible') === 'true';

    function saveSettings() {
        localStorage.setItem('inventoryScale', scale);
        localStorage.setItem('inventoryOpacity', opacity);
        localStorage.setItem('motdVisible', motdVisible);
    }

    function applyInventoryStyle() {
        const inventory = document.getElementById('item-ui');
        if (inventory) {
            inventory.style.transform = `scale(${scale})`;
            inventory.style.opacity = `${opacity}`;
            inventory.style.transformOrigin = "center center";
            inventory.style.marginBottom = "20px";
            inventory.style.marginLeft = "20px";
            inventory.style.display = "block";
        }
    }

    function toggleMotdCustom() {
        const motd = document.getElementById(MOTD_ID);
        if (motd) {
            motdVisible = !motdVisible;
            motd.style.display = motdVisible ? 'block' : 'none';
            saveSettings();
        }
    }

    function createMenu() {
        if (document.getElementById(MENU_ID)) return;

        const menu = document.createElement('div');
        menu.id = MENU_ID;
        menu.style.position = 'fixed';
        menu.style.top = '10px';
        menu.style.left = '60%';
        menu.style.transform = 'translateX(-50%)';
        menu.style.backgroundColor = 'rgba(30, 30, 30, 0.95)';
        menu.style.border = '1px solid #888';
        menu.style.padding = '12px';
        menu.style.borderRadius = '8px';
        menu.style.zIndex = '99999';
        menu.style.display = 'none';
        menu.style.color = 'white';
        menu.style.fontFamily = 'sans-serif';
        menu.style.fontSize = '14px';
        menu.style.width = '280px';
        menu.style.textAlign = 'center';
        menu.style.cursor = 'move';

        // Drag logic
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        menu.addEventListener('mousedown', (e) => {
            if (['INPUT', 'BUTTON'].includes(e.target.tagName)) return;
            isDragging = true;
            offsetX = e.clientX - menu.getBoundingClientRect().left;
            offsetY = e.clientY - menu.getBoundingClientRect().top;
            menu.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                menu.style.left = `${e.clientX - offsetX}px`;
                menu.style.top = `${e.clientY - offsetY}px`;
                menu.style.transform = 'none';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            menu.style.cursor = 'move';
        });

        // Title
        const title = document.createElement('div');
        title.innerHTML = `<strong>Inventory Controls</strong><br><em>(Press ALT to toggle)</em>`;
        title.style.marginBottom = '10px';

        // Inventory Size
        const scaleLabel = document.createElement('div');
        scaleLabel.textContent = `Inventory Size: ${Math.round(scale * 100)}%`;

        const scaleSlider = document.createElement('input');
        scaleSlider.type = 'range';
        scaleSlider.min = '30';
        scaleSlider.max = '100';
        scaleSlider.value = Math.round(scale * 100);
        scaleSlider.style.width = '100%';
        scaleSlider.oninput = () => {
            scale = scaleSlider.value / 100;
            scaleLabel.textContent = `Inventory Size: ${scaleSlider.value}%`;
            applyInventoryStyle();
            saveSettings();
        };

        // Inventory Opacity
        const opacityLabel = document.createElement('div');
        opacityLabel.textContent = `Inventory Transparency: ${Math.round(opacity * 100)}%`;

        const opacitySlider = document.createElement('input');
        opacitySlider.type = 'range';
        opacitySlider.min = '0';
        opacitySlider.max = '100';
        opacitySlider.value = Math.round(opacity * 100);
        opacitySlider.style.width = '100%';
        opacitySlider.oninput = () => {
            opacity = opacitySlider.value / 100;
            opacityLabel.textContent = `Inventory Transparency: ${opacitySlider.value}%`;
            applyInventoryStyle();
            saveSettings();
        };

        // MOTD toggle button
        const motdBtn = document.createElement('button');
        motdBtn.textContent = 'Toggle Team MOTD';
        motdBtn.style.marginTop = '10px';
        motdBtn.style.width = '100%';
        motdBtn.style.padding = '6px';
        motdBtn.style.background = '#444';
        motdBtn.style.color = 'white';
        motdBtn.style.border = '1px solid #666';
        motdBtn.style.borderRadius = '5px';
        motdBtn.style.cursor = 'pointer';
        motdBtn.onclick = toggleMotdCustom;

        // Assemble menu
        menu.appendChild(title);
        menu.appendChild(scaleLabel);
        menu.appendChild(scaleSlider);
        menu.appendChild(document.createElement('hr'));
        menu.appendChild(opacityLabel);
        menu.appendChild(opacitySlider);
        menu.appendChild(document.createElement('hr'));
        menu.appendChild(motdBtn);

        document.body.appendChild(menu);
    }

    // ALT toggles the menu
    document.addEventListener('keydown', (e) => {
        if (e.key === "Alt" && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
            const menu = document.getElementById(MENU_ID);
            if (menu) {
                menuVisible = !menuVisible;
                menu.style.display = menuVisible ? 'block' : 'none';
            }
        }
    });

    // Periodic refresh
    setInterval(() => {
        const inventory = document.getElementById('item-ui');
        const motd = document.getElementById(MOTD_ID);
        if (inventory) applyInventoryStyle();
        if (motd) motd.style.display = motdVisible ? 'block' : 'none';
        createMenu();
    }, 1000);
})();