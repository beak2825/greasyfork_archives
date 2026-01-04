// ==UserScript==
// @name         Cookie Clicker Extended Cheat Menu
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Extended cheat menu with multiple hacks and smooth animations for Cookie Clicker
// @author      JULX
// @match        https://orteil.dashnet.org/cookieclicker/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528165/Cookie%20Clicker%20Extended%20Cheat%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/528165/Cookie%20Clicker%20Extended%20Cheat%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a cheat menu and inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .cheat-menu {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.6);
            color: white;
            font-family: 'Arial', sans-serif;
            transition: transform 0.4s ease-in-out, opacity 0.3s ease;
            z-index: 1000;
        }
        .cheat-menu:hover {
            transform: scale(1.1);
        }
        .cheat-menu h1 {
            margin: 0;
            font-size: 26px;
            color: #ffcc00;
            text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.8);
        }
        .cheat-button {
            background-color: #ffcc00;
            color: #333;
            border: none;
            padding: 12px 25px;
            margin: 10px 0;
            border-radius: 8px;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
            transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
        }
        .cheat-button:hover {
            background-color: #ff9900;
            transform: scale(1.05);
            box-shadow: 0px 6px 20px rgba(255, 153, 0, 0.6);
        }
        .cheat-button:active {
            transform: scale(0.98);
        }
        .cheat-menu .section {
            margin-bottom: 15px;
            border-bottom: 2px solid #ffcc00;
            padding-bottom: 15px;
        }
        .tooltip {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px;
            border-radius: 5px;
            font-size: 14px;
            display: none;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease-in-out;
        }
        .cheat-button:hover + .tooltip {
            display: block;
            opacity: 1;
        }
        .tooltip-arrow {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%) rotate(45deg);
            width: 10px;
            height: 10px;
            background-color: rgba(0, 0, 0, 0.7);
        }
    `;
    document.head.appendChild(style);

    // Create the enhanced cheat menu
    const menu = document.createElement('div');
    menu.classList.add('cheat-menu');
    menu.innerHTML = `
        <h1>Cookie Clicker Hacks</h1>
        <div class="section">
            <button class="cheat-button" id="add-cookies">Add 1 Million Cookies</button>
            <div class="tooltip" id="tooltip-add-cookies">Click to add cookies</div>
            <button class="cheat-button" id="unlock-achievements">Unlock All Achievements</button>
            <div class="tooltip" id="tooltip-unlock-achievements">Click to unlock achievements</div>
            <button class="cheat-button" id="boost-buildings">Boost All Buildings</button>
            <div class="tooltip" id="tooltip-boost-buildings">Boost all building amounts</div>
            <button class="cheat-button" id="boost-cursors">Boost All Cursors</button>
            <div class="tooltip" id="tooltip-boost-cursors">Boost all cursors' quantities</div>
            <button class="cheat-button" id="add-permanent-upgrades">Add Permanent Upgrades</button>
            <div class="tooltip" id="tooltip-add-permanent-upgrades">Click to add permanent upgrades</div>
            <button class="cheat-button" id="max-upgrades">Max All Upgrades</button>
            <div class="tooltip" id="tooltip-max-upgrades">Max out all upgrades instantly</div>
            <button class="cheat-button" id="super-cookies">Super Cookie Boost</button>
            <div class="tooltip" id="tooltip-super-cookies">Supercharge cookies!</div>
        </div>
        <div class="section">
            <button class="cheat-button" id="instant-build">Instant Building Purchase</button>
            <div class="tooltip" id="tooltip-instant-build">Instantly buy any building</div>
            <button class="cheat-button" id="reset-progress">Reset Game Progress</button>
            <div class="tooltip" id="tooltip-reset-progress">Reset the game progress</div>
            <button class="cheat-button" id="auto-clicker">Enable Auto-Clicker</button>
            <div class="tooltip" id="tooltip-auto-clicker">Automatically click the cookie</div>
            <button class="cheat-button" id="reset-all">Reset All Progress (Hard Reset)</button>
            <div class="tooltip" id="tooltip-reset-all">Reset everything back to default values</div>
            <button class="cheat-button" id="save-progress">Save Current Progress</button>
            <div class="tooltip" id="tooltip-save-progress">Save your progress for later use</div>
            <button class="cheat-button" id="load-progress">Load Saved Progress</button>
            <div class="tooltip" id="tooltip-load-progress">Load previously saved progress</div>
        </div>
    `;
    document.body.appendChild(menu);

    // Helper function to simulate user-like behavior with random delays
    function simulateAction(action, minDelay, maxDelay) {
        const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        return new Promise(resolve => {
            setTimeout(() => {
                action();
                resolve();
            }, delay);
        });
    }

    // Helper function to update cookie display
    const updateCookieDisplay = () => {
        if (Game.cookies === undefined || isNaN(Game.cookies)) return;
        Game.cookies = new Game.cookies.constructor(Game.cookies);
        Game.cookies.set(Game.cookies.toNumber());
        Game.UpdateCookieDisplay();
    };

    // Cheat functionalities (natural and stealthy actions)
    const addCookiesBtn = document.getElementById('add-cookies');
    const unlockAchievementsBtn = document.getElementById('unlock-achievements');
    const boostBuildingsBtn = document.getElementById('boost-buildings');
    const boostCursorsBtn = document.getElementById('boost-cursors');
    const addPermanentUpgradesBtn = document.getElementById('add-permanent-upgrades');
    const maxUpgradesBtn = document.getElementById('max-upgrades');
    const superCookiesBtn = document.getElementById('super-cookies');
    const instantBuildBtn = document.getElementById('instant-build');
    const resetProgressBtn = document.getElementById('reset-progress');
    const autoClickerBtn = document.getElementById('auto-clicker');
    const resetAllBtn = document.getElementById('reset-all');
    const saveProgressBtn = document.getElementById('save-progress');
    const loadProgressBtn = document.getElementById('load-progress');

    // Add 1 million cookies with natural delay
    addCookiesBtn.addEventListener('click', function() {
        simulateAction(() => {
            Game.cookies = new Game.cookies.constructor(Game.cookies + 1000000);
            updateCookieDisplay();
        }, 500, 1500);
    });

    // Unlock all achievements with delay
    unlockAchievementsBtn.addEventListener('click', function() {
        simulateAction(() => {
            for (let i = 0; i < Game.Achievements.length; i++) {
                if (!Game.Achievements[i].won) {
                    Game.Achievements[i].unlock();
                }
            }
        }, 1000, 3000);
    });

    // Boost all buildings with delay
    boostBuildingsBtn.addEventListener('click', function() {
        simulateAction(() => {
            Game.ObjectsById.forEach(function(building) {
                building.amount = building.amount + 100;
                building.draw();
            });
            Game.UpdateMenu();
        }, 1000, 2000);
    });

    // Boost all cursors with delay
    boostCursorsBtn.addEventListener('click', function() {
        simulateAction(() => {
            Game.ObjectsById[0].amount = Game.ObjectsById[0].amount + 100;
            Game.ObjectsById[0].draw();
            Game.UpdateMenu();
        }, 500, 1500);
    });

    // Add permanent upgrades with delay
    addPermanentUpgradesBtn.addEventListener('click', function() {
        simulateAction(() => {
            Game.Upgrades.forEach(function(upgrade) {
                if (!upgrade.unlocked) {
                    upgrade.unlock();
                }
                upgrade.purchase();
            });
        }, 1500, 3000);
    });

    // Maximize all upgrades with delay
    maxUpgradesBtn.addEventListener('click', function() {
        simulateAction(() => {
            Game.Upgrades.forEach(function(upgrade) {
                if (!upgrade.unlocked) {
                    upgrade.unlock();
                }
                upgrade.purchase();
            });
        }, 1500, 3000);
    });

    // Super cookies boost with delay
    superCookiesBtn.addEventListener('click', function() {
        simulateAction(() => {
            Game.cookies = Game.cookies * 10;
            updateCookieDisplay();
        }, 1000, 2000);
    });

    // Instant building purchase with delay
    instantBuildBtn.addEventListener('click', function() {
        simulateAction(() => {
            Game.ObjectsById.forEach(function(building) {
                building.buy();
            });
            Game.UpdateMenu();
        }, 500, 1500);
    });

    // Reset progress
    resetProgressBtn.addEventListener('click', function() {
        if (confirm("Are you sure you want to reset the game progress?")) {
            Game.Reset(true);
        }
    });

    // Enable Auto-Clicker
    let autoClickerInterval;
    autoClickerBtn.addEventListener('click', function() {
        if (autoClickerInterval) {
            clearInterval(autoClickerInterval);
            autoClickerInterval = null;
            autoClickerBtn.innerHTML = "Enable Auto-Clicker";
        } else {
            autoClickerInterval = setInterval(function() {
                Game.ClickCookie();
            }, Math.floor(Math.random() * (100 - 50 + 1)) + 50); // Random interval for clicks
            autoClickerBtn.innerHTML = "Disable Auto-Clicker";
        }
    });

    // Reset all progress (hard reset)
    resetAllBtn.addEventListener('click', function() {
        if (confirm("This will completely reset your progress. Are you sure?")) {
            Game.Reset(true);
            location.reload();
        }
    });

    // Save progress
    saveProgressBtn.addEventListener('click', function() {
        localStorage.setItem('cookieClickerProgress', JSON.stringify(Game.toString()));
    });

    // Load saved progress
    loadProgressBtn.addEventListener('click', function() {
        let savedProgress = JSON.parse(localStorage.getItem('cookieClickerProgress'));
        if (savedProgress) {
            Game.Load(savedProgress);
        }
    });
})();
