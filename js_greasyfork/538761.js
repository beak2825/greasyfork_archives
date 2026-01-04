// ==UserScript==
// @name         Cookie Clicker Ultimate Cheat Menu (Dark UI)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Full-featured cheat menu for Cookie Clicker: infinite cookies, unlocks, auto-click, idle baking & more!
// @author       Marley
// @match        https://orteil.dashnet.org/cookieclicker/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538761/Cookie%20Clicker%20Ultimate%20Cheat%20Menu%20%28Dark%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538761/Cookie%20Clicker%20Ultimate%20Cheat%20Menu%20%28Dark%20UI%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const waitForGame = setInterval(() => {
        if (typeof Game !== 'undefined' && Game.ready) {
            clearInterval(waitForGame);
            initCheatMenu();
        }
    }, 500);

    function initCheatMenu() {
        // === CORE CHEATS ===
        const cheats = {
            infiniteCookies: false,
            autoClick: false,
            autoGolden: false,
            idleBaking: false,
        };

        let cheatInterval;

        function startCheatLoop() {
            if (cheatInterval) clearInterval(cheatInterval);
            cheatInterval = setInterval(() => {
                if (cheats.infiniteCookies) Game.cookies = 1e+300;
                if (cheats.autoClick) Game.ClickCookie();
                if (cheats.autoGolden) {
                    for (let i in Game.shimmers) {
                        if (Game.shimmers[i].type === "golden") Game.shimmers[i].pop();
                    }
                }
                if (cheats.idleBaking) Game.lastActivity = Date.now();
            }, 13);
        }

        startCheatLoop();

        // === HELPER FUNCTIONS ===
        function unlockAll() {
            for (let i in Game.UpgradesById) Game.UpgradesById[i].unlock();
            for (let i in Game.ObjectsById) Game.ObjectsById[i].unlock();
            for (let i in Game.AchievementsById) Game.AchievementsById[i].unlock();
        }

        function buyEverything() {
            for (let i in Game.ObjectsById) {
                Game.ObjectsById[i].buy(100);
            }
            for (let i in Game.UpgradesInStore) {
                Game.UpgradesInStore[i].buy();
            }
        }

        // === UI CREATION ===
        const menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.top = '80px';
        menu.style.right = '20px';
        menu.style.zIndex = '99999';
        menu.style.background = '#111';
        menu.style.color = '#eee';
        menu.style.border = '2px solid #333';
        menu.style.borderRadius = '10px';
        menu.style.padding = '12px';
        menu.style.fontFamily = 'monospace';
        menu.style.fontSize = '14px';
        menu.style.width = '200px';
        menu.style.boxShadow = '0 0 12px rgba(0,0,0,0.6)';

        menu.innerHTML = `
            <h3 style="margin-top: 0; font-size: 16px; text-align: center;">🍪 Cheat Menu</h3>
            <label><input type="checkbox" id="infiniteCookies"> Infinite Cookies</label><br>
            <label><input type="checkbox" id="autoClick"> Auto Click</label><br>
            <label><input type="checkbox" id="autoGolden"> Auto Golden Cookies</label><br>
            <label><input type="checkbox" id="idleBaking"> Idle Baking</label><br>
            <hr>
            <button id="unlockAll" style="width: 100%; margin-bottom: 4px;">Unlock All</button>
            <button id="buyAll" style="width: 100%; margin-bottom: 4px;">Buy Everything</button>
            <button id="saveCheats" style="width: 100%; margin-bottom: 4px;">💾 Save Preset</button>
            <button id="loadCheats" style="width: 100%;">📂 Load Preset</button>
        `;

        document.body.appendChild(menu);

        // === BIND EVENTS ===
        const bind = (id, key) => {
            document.getElementById(id).addEventListener('change', e => {
                cheats[key] = e.target.checked;
                startCheatLoop();
            });
        };

        bind("infiniteCookies", "infiniteCookies");
        bind("autoClick", "autoClick");
        bind("autoGolden", "autoGolden");
        bind("idleBaking", "idleBaking");

        document.getElementById('unlockAll').addEventListener('click', unlockAll);
        document.getElementById('buyAll').addEventListener('click', buyEverything);

        // === SAVE/LOAD PRESETS ===
        document.getElementById('saveCheats').addEventListener('click', () => {
            localStorage.setItem('cookieCheats', JSON.stringify(cheats));
            alert("Preset saved!");
        });

        document.getElementById('loadCheats').addEventListener('click', () => {
            const saved = JSON.parse(localStorage.getItem('cookieCheats') || '{}');
            for (let key in saved) {
                cheats[key] = saved[key];
                const checkbox = document.getElementById(key);
                if (checkbox) checkbox.checked = saved[key];
            }
            startCheatLoop();
            alert("Preset loaded!");
        });

        console.log('%c[Ultimate Cookie Clicker Cheats Enabled]', 'color: #00ff88; font-weight: bold;');
    }
})();
