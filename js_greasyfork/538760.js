// ==UserScript==
// @name         Cookie Clicker Ultimate Cheat Menu (Fixed & Improved)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Full-featured cheat menu for Cookie Clicker with fixed cheats, draggable dark UI, toggleable, many options, and smooth controls.
// @author       Marley
// @match        https://orteil.dashnet.org/cookieclicker/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538760/Cookie%20Clicker%20Ultimate%20Cheat%20Menu%20%28Fixed%20%20Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538760/Cookie%20Clicker%20Ultimate%20Cheat%20Menu%20%28Fixed%20%20Improved%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prevent duplicates
    if (window.__ccCheatMenuLoaded) return;
    window.__ccCheatMenuLoaded = true;

    // Wait until game is ready
    function waitForGameReady(callback) {
        if (typeof Game === 'undefined' || !Game.ready) {
            setTimeout(() => waitForGameReady(callback), 1000);
        } else {
            callback();
        }
    }

    waitForGameReady(() => {
        // Main cheat state
        let cheatState = {
            autoCookies: false,
            autoBuyUpgrades: false,
            autoBuyBuildings: false,
            autoGoldenClick: false,
            autoReindeerClick: false,
            cookiesPerTick: 1000000,
            cookieMultiplier: 1,
        };

        // Create UI panel
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '50px';
        panel.style.left = '20px';
        panel.style.width = '300px';
        panel.style.background = '#121212';
        panel.style.border = '1px solid #333';
        panel.style.borderRadius = '8px';
        panel.style.color = '#eee';
        panel.style.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
        panel.style.fontSize = '13px';
        panel.style.zIndex = '99999999';
        panel.style.padding = '12px';
        panel.style.userSelect = 'none';
        panel.style.boxShadow = '0 0 10px #000';

        panel.style.cursor = 'move';

        // Title
        const title = document.createElement('div');
        title.textContent = '🍪 Cookie Clicker Cheat Menu';
        title.style.fontWeight = '700';
        title.style.fontSize = '16px';
        title.style.marginBottom = '10px';
        title.style.textAlign = 'center';
        panel.appendChild(title);

        // Helper to create toggles
        function createToggle(labelText, initialState, onChange) {
            const container = document.createElement('div');
            container.style.marginBottom = '8px';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'space-between';

            const label = document.createElement('label');
            label.textContent = labelText;
            label.style.userSelect = 'none';

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = initialState;
            input.style.cursor = 'pointer';

            input.addEventListener('change', () => onChange(input.checked));

            container.appendChild(label);
            container.appendChild(input);
            return container;
        }

        // Helper to create number inputs
        function createNumberInput(labelText, initialValue, min, max, step, onChange) {
            const container = document.createElement('div');
            container.style.marginBottom = '8px';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'space-between';

            const label = document.createElement('label');
            label.textContent = labelText;
            label.style.userSelect = 'none';

            const input = document.createElement('input');
            input.type = 'number';
            input.value = initialValue;
            input.min = min;
            input.max = max;
            input.step = step;
            input.style.width = '80px';
            input.style.cursor = 'pointer';
            input.style.background = '#222';
            input.style.border = '1px solid #444';
            input.style.color = '#eee';
            input.style.borderRadius = '4px';
            input.style.textAlign = 'right';

            input.addEventListener('change', () => {
                let val = Number(input.value);
                if (isNaN(val)) val = initialValue;
                if (val < min) val = min;
                if (val > max) val = max;
                input.value = val;
                onChange(val);
            });

            container.appendChild(label);
            container.appendChild(input);
            return container;
        }

        // Toggle functions
        function toggleAutoCookies(enabled) {
            cheatState.autoCookies = enabled;
        }
        function toggleAutoBuyUpgrades(enabled) {
            cheatState.autoBuyUpgrades = enabled;
        }
        function toggleAutoBuyBuildings(enabled) {
            cheatState.autoBuyBuildings = enabled;
        }
        function toggleAutoGoldenClick(enabled) {
            cheatState.autoGoldenClick = enabled;
        }
        function toggleAutoReindeerClick(enabled) {
            cheatState.autoReindeerClick = enabled;
        }
        function changeCookiesPerTick(value) {
            cheatState.cookiesPerTick = value;
        }
        function changeCookieMultiplier(value) {
            cheatState.cookieMultiplier = value;
        }

        // Add toggles & inputs to panel
        panel.appendChild(createToggle('Auto Add Cookies', cheatState.autoCookies, toggleAutoCookies));
        panel.appendChild(createNumberInput('Cookies per Tick', cheatState.cookiesPerTick, 1, 1e12, 1000, changeCookiesPerTick));
        panel.appendChild(createNumberInput('Cookie Multiplier', cheatState.cookieMultiplier, 1, 1000, 0.1, changeCookieMultiplier));
        panel.appendChild(createToggle('Auto Buy Upgrades', cheatState.autoBuyUpgrades, toggleAutoBuyUpgrades));
        panel.appendChild(createToggle('Auto Buy Buildings', cheatState.autoBuyBuildings, toggleAutoBuyBuildings));
        panel.appendChild(createToggle('Auto Click Golden Cookies', cheatState.autoGoldenClick, toggleAutoGoldenClick));
        panel.appendChild(createToggle('Auto Click Reindeer', cheatState.autoReindeerClick, toggleAutoReindeerClick));

        // Extra buttons for common cheats
        const btnContainer = document.createElement('div');
        btnContainer.style.marginTop = '12px';
        btnContainer.style.display = 'flex';
        btnContainer.style.flexWrap = 'wrap';
        btnContainer.style.gap = '8px';
        btnContainer.style.justifyContent = 'center';

        function createButton(text, onClick) {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.background = '#2979ff';
            btn.style.color = '#fff';
            btn.style.border = 'none';
            btn.style.borderRadius = '5px';
            btn.style.padding = '6px 10px';
            btn.style.cursor = 'pointer';
            btn.style.fontWeight = '600';
            btn.style.flex = '1 1 auto';
            btn.addEventListener('mouseenter', () => btn.style.background = '#1565c0');
            btn.addEventListener('mouseleave', () => btn.style.background = '#2979ff');
            btn.addEventListener('click', onClick);
            return btn;
        }

        btnContainer.appendChild(createButton('Add 1 Million Cookies', () => Game.Earn(1e6)));
        btnContainer.appendChild(createButton('Unlock All Upgrades', () => {
            for (let upg of Game.UpgradesById) {
                if (!upg.bought) {
                    upg.bought = 1;
                    upg.isUnlocked = true;
                    upg.win();
                }
            }
            Game.UpgradesToRebuild = 1;
        }));
        btnContainer.appendChild(createButton('Unlock All Buildings', () => {
            for (let b of Game.ObjectsById) {
                b.unlocked = 1;
                if (b.amount < 1) b.amount = 1;
            }
            Game.CalculateGains();
            Game.BuildStore();
        }));
        btnContainer.appendChild(createButton('Unlock All Achievements', () => {
            for (let a of Game.Achievements) {
                if (!a.won) a.win();
            }
        }));
        btnContainer.appendChild(createButton('Max CPS (Cookies Per Second)', () => {
            Game.cookiesPs = Number.MAX_SAFE_INTEGER;
            Game.CalculateGains();
        }));
        btnContainer.appendChild(createButton('Reset Game (No Confirmation!)', () => {
            Game.Reset();
        }));

        panel.appendChild(btnContainer);

        // Append panel to body
        document.body.appendChild(panel);

        // Make UI draggable
        let drag = {
            active: false,
            offsetX: 0,
            offsetY: 0
        };

        panel.addEventListener('mousedown', e => {
            if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'button') return;
            drag.active = true;
            drag.offsetX = e.clientX - panel.offsetLeft;
            drag.offsetY = e.clientY - panel.offsetTop;
            panel.style.transition = 'none';
        });

        document.addEventListener('mouseup', () => {
            drag.active = false;
            panel.style.transition = '';
        });

        document.addEventListener('mousemove', e => {
            if (!drag.active) return;
            let left = e.clientX - drag.offsetX;
            let top = e.clientY - drag.offsetY;
            // Clamp within viewport
            left = Math.min(Math.max(0, left), window.innerWidth - panel.offsetWidth);
            top = Math.min(Math.max(0, top), window.innerHeight - panel.offsetHeight);
            panel.style.left = left + 'px';
            panel.style.top = top + 'px';
            panel.style.bottom = 'auto';
        });

        // Main loop
        setInterval(() => {
            if (!Game || !Game.ready) return;

            if (cheatState.autoCookies) {
                Game.Earn(cheatState.cookiesPerTick * cheatState.cookieMultiplier);
            }

            if (cheatState.autoBuyUpgrades) {
                for (let upg of Game.UpgradesInStore) {
                    if (upg.canBuy()) upg.buy();
                }
            }

            if (cheatState.autoBuyBuildings) {
                for (let b of Game.ObjectsById) {
                    while (b.getPrice() <= Game.cookies) {
                        b.buy(1);
                    }
                }
            }

            if (cheatState.autoGoldenClick) {
                const golden = Game.shimmers.find(s => s.type === 'golden');
                if (golden) golden.pop();
            }

            if (cheatState.autoReindeerClick) {
                const reindeer = Game.shimmers.find(s => s.type === 'reindeer');
                if (reindeer) reindeer.pop();
            }

        }, 500);

        console.log('[Cookie Clicker Cheat Menu] Loaded! Drag the panel to move it.');
    });

})();
