// ==UserScript==
// @name         Cookie Clicker Mod Menu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a mod menu to Cookie Clicker for cheats and enhancements.
// @author       ME : )
// @match        http://orteil.dashnet.org/cookieclicker/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499610/Cookie%20Clicker%20Mod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/499610/Cookie%20Clicker%20Mod%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the game to load fully
    function waitForGame() {
        if (typeof Game !== 'undefined' && Game.ready) {
            initModMenu();
        } else {
            setTimeout(waitForGame, 1000);
        }
    }

    // Initialize the mod menu
    function initModMenu() {
        // Create a new div element for the mod menu
        const modMenu = document.createElement('div');
        modMenu.style.position = 'fixed';
        modMenu.style.top = '10px';
        modMenu.style.right = '10px';
        modMenu.style.padding = '10px';
        modMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modMenu.style.color = 'white';
        modMenu.style.zIndex = '10000';
        modMenu.style.fontFamily = 'Arial, sans-serif';
        modMenu.style.borderRadius = '5px';

        // Add title to the mod menu
        const title = document.createElement('h2');
        title.innerText = 'Cookie Clicker Mod Menu';
        title.style.marginTop = '0';
        modMenu.appendChild(title);

        // Function to create a button
        function createButton(text, onClick) {
            const button = document.createElement('button');
            button.innerText = text;
            button.style.margin = '5px';
            button.style.padding = '5px 10px';
            button.style.border = 'none';
            button.style.borderRadius = '3px';
            button.style.cursor = 'pointer';
            button.style.backgroundColor = '#444';
            button.style.color = 'white';
            button.addEventListener('click', onClick);
            modMenu.appendChild(button);
        }

        // Function to add cookies
        function addCookies(amount) {
            Game.cookies += amount;
            Game.RefreshStore();
        }

        // Function to unlock all upgrades
        function unlockAllUpgrades() {
            Game.UpgradesById.forEach(upgrade => {
                upgrade.unlock();
            });
        }

        // Function to unlock all achievements
        function unlockAllAchievements() {
            Game.AchievementsById.forEach(achievement => {
                achievement.unlock();
            });
        }

        // Function to set cookie production speed
        function setProductionSpeed(speed) {
            Game.fps = speed;
        }

        // Function to add Golden Cookies
        function addGoldenCookies(amount) {
            for (let i = 0; i < amount; i++) {
                new Game.shimmer('golden');
            }
        }

        // Add buttons to the mod menu
        createButton('Add 1 Million Cookies', () => addCookies(1000000));
        createButton('Add 1 Billion Cookies', () => addCookies(1000000000));
        createButton('Unlock All Upgrades', unlockAllUpgrades);
        createButton('Unlock All Achievements', unlockAllAchievements);
        createButton('Set Fast Production (60 FPS)', () => setProductionSpeed(60));
        createButton('Add 10 Golden Cookies', () => addGoldenCookies(10));

        // Add the mod menu to the document body
        document.body.appendChild(modMenu);
    }

    // Start the waiting process
    waitForGame();
})();