// ==UserScript==
// @name         Moomoo.io Hat Hotkeys + Custom Title 🎩
// @version      0.1
// @description  Hat shortcuts with editable menu and custom title "🎩 Hat Control"
// @match        *://*.moomoo.io/*
// @license      MIT
// @grant        none
// @namespace    https://greasyfork.org/users/805514
// @downloadURL https://update.greasyfork.org/scripts/541364/Moomooio%20Hat%20Hotkeys%20%2B%20Custom%20Title%20%F0%9F%8E%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/541364/Moomooio%20Hat%20Hotkeys%20%2B%20Custom%20Title%20%F0%9F%8E%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const keys = {};
    let config = {
        menuKey: 'b',
        binds: {
            r: { id: 7, name: "Bull Helmet" },
            g: { id: 6, name: "Soldier Helmet" },
            z: { id: 40, name: "Tank Gear" },
            t: { id: 53, name: "Turret Gear" },
            j: { id: 22, name: "Emp Helmet" },
            u: { id: 12, name: "Booster Hat" },
            y: { id: 31, name: "Flipper Hat" },
            n: { id: 15, name: "Winter Cap" }
        }
    };

    // Function to buy/equip hats
    function storeEquipOrBuy(id) {
        if (typeof storeBuy === 'function') storeBuy(id);
        setTimeout(() => {
            if (typeof storeEquip === 'function') storeEquip(id);
        }, 120);
    }

    // Check pressed keys
    function checkKeys() {
        for (let k in config.binds) {
            if (keys[k.toLowerCase()]) {
                storeEquipOrBuy(config.binds[k].id);
            }
        }
    }

    // Keyboard events
    window.addEventListener('keydown', e => {
        if (document.activeElement.tagName === 'INPUT') return; // Ignore inputs
        keys[e.key.toLowerCase()] = true;
        if (e.key.toLowerCase() === config.menuKey) toggleMenu();
        else checkKeys();
    });

    window.addEventListener('keyup', e => {
        keys[e.key.toLowerCase()] = false;
    });

    // Create configuration menu
    const menu = document.createElement('div');
    menu.id = 'hatHotkeyMenu';
    menu.style = `
        position: fixed;
        top: 10px;
        left: 10px;
        padding: 10px;
        background: #f9f9f9;
        border: 2px solid #444;
        border-radius: 10px;
        font-family: sans-serif;
        z-index: 9999;
        display: none;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
    `;

    function buildMenu() {
        menu.innerHTML = `
            <h3 style="margin-top: 0; color: #5a2d82;">🎩 Hat Control</h3>
            <div>
                <label>Menu key: <input id="menuKey" value="${config.menuKey}" size="1" maxlength="1"></label>
            </div>
            <hr>
            ${Object.entries(config.binds).map(([key, hat]) => `
                <div>
                    <label><b>${hat.name}</b> → Key:
                    <input data-hat="${hat.name}" data-id="${hat.id}" value="${key.toUpperCase()}" size="2" maxlength="1"></label>
                </div>
            `).join('')}
            <hr>
            <button id="saveHotkeys" style="cursor: pointer;">Save</button>
            <button id="resetHotkeys" style="cursor: pointer; margin-left: 5px;">Reset</button>
        `;
    }

    buildMenu();
    document.body.appendChild(menu);

    // Save configuration
    menu.addEventListener('click', e => {
        if (e.target.id === 'saveHotkeys') {
            const newBinds = {};
            const newMenuKey = document.getElementById('menuKey').value.toLowerCase();
            if (!newMenuKey) return alert("Menu key cannot be empty!");

            document.querySelectorAll('#hatHotkeyMenu input[data-hat]').forEach(inp => {
                const newKey = inp.value.toLowerCase();
                const name = inp.getAttribute('data-hat');
                const id = parseInt(inp.getAttribute('data-id'));
                if (newKey && !isNaN(id)) {
                    newBinds[newKey] = { id, name };
                }
            });

            config.menuKey = newMenuKey;
            config.binds = newBinds;
            alert('✅ Settings saved');
            buildMenu();
        }

        if (e.target.id === 'resetHotkeys') {
            if (confirm("Reset to default settings?")) {
                config = {
                    menuKey: 'b',
                    binds: {
                        r: { id: 7, name: "Bull Helmet" },
                        g: { id: 6, name: "Soldier Helmet" },
                        z: { id: 40, name: "Tank Gear" },
                        t: { id: 53, name: "Turret Gear" },
                        j: { id: 22, name: "Emp Helmet" },
                        u: { id: 12, name: "Booster Hat" },
                        y: { id: 31, name: "Flipper Hat" },
                        n: { id: 15, name: "Winter Cap" }
                    }
                };
                buildMenu();
                alert('⚙️ Settings reset');
            }
        }
    });

    // Toggle menu visibility
    function toggleMenu() {
        menu.style.display = (menu.style.display === 'none') ? 'block' : 'none';
    }

    // Change game title (#gameName)
    function changeGameTitle() {
        const gameTitle = document.getElementById('gameName');
        if (gameTitle && gameTitle.textContent !== '🎩 Hat Control') {
            gameTitle.textContent = '🎩 Hat Control';
            gameTitle.style.color = '#9c4dff'; // Optional: Change color
        }
    }

    // Observers for titles (tab, menu and game name)
    const observerConfig = { childList: true, subtree: true };
    const globalObserver = new MutationObserver(() => {
        changeGameTitle();

        // Change tab title
        if (document.title !== '🎩 Hat Control') {
            document.title = '🎩 Hat Control';
        }

        // Change main menu title (if exists)
        const mainMenuTitle = document.querySelector('#mainMenu h1');
        if (mainMenuTitle && mainMenuTitle.textContent !== '🎩 Hat Control') {
            mainMenuTitle.textContent = '🎩 Hat Control';
        }
    });

    globalObserver.observe(document.body, observerConfig);

    // Force initial change (in case Observer doesn't detect it)
    setTimeout(changeGameTitle, 1000);
})();