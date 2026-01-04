// ==UserScript==
// @name         Cookie Clicker Mod Menu
// @version      1.0
// @description  Adds a mod menu to Cookie Clicker for additional features.
// @author       John1632
// @license      MIT
// @include      https://orteil.dashnet.org/cookieclicker/
// @grant        none
// @namespace https://greasyfork.org/users/1082028
// @downloadURL https://update.greasyfork.org/scripts/466708/Cookie%20Clicker%20Mod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/466708/Cookie%20Clicker%20Mod%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var multipliers = [2, 5, 10, 20, 50, 100, 500, 1000];
    var additionalMultipliers = [100, 500, 1000, 5000, 10000, 50000];

    var modMenu = document.createElement('div');
    modMenu.style.position = 'fixed';
    modMenu.style.bottom = '20px';
    modMenu.style.left = '20px';
    modMenu.style.padding = '10px';
    modMenu.style.background = '#333';
    modMenu.style.border = '1px solid #fff';
    modMenu.style.color = '#fff';
    modMenu.style.zIndex = '9999';

    var bigBox;

    var feature1Button = document.createElement('button');
    feature1Button.textContent = 'Open';
    feature1Button.style.background = '#555';
    feature1Button.style.color = '#fff';
    feature1Button.addEventListener('click', function() {
        if (bigBox) {
            return;
        }
        bigBox = document.createElement('div');
        bigBox.style.position = 'fixed';
        bigBox.style.top = '50%';
        bigBox.style.left = '50%';
        bigBox.style.transform = 'translate(-50%, -50%)';
        bigBox.style.width = '400px';
        bigBox.style.height = '200px';
        bigBox.style.background = '#222';
        bigBox.style.border = '1px solid #fff';
        bigBox.style.zIndex = '9999';

        var title = document.createElement('div');
        title.textContent = 'Cookie Clicker Mod Menu';
        title.style.fontFamily = 'Segoe UI Semibold';
        title.style.fontSize = '16px';
        title.style.textAlign = 'center';
        title.style.marginTop = '20px';
        title.style.color = '#fff';
        bigBox.appendChild(title);

        var buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.flexWrap = 'wrap';
        buttonsContainer.style.marginTop = '10px';
        buttonsContainer.style.marginLeft = '10px';

        for (var i = 0; i < multipliers.length; i++) {
            var multiplierButton = document.createElement('button');
            multiplierButton.textContent = multipliers[i] + 'x';
            multiplierButton.style.background = '#555';
            multiplierButton.style.color = '#fff';
            multiplierButton.style.marginRight = '10px';
            multiplierButton.addEventListener('click', createClickHandler(multipliers[i]));
            buttonsContainer.appendChild(multiplierButton);
        }

        bigBox.appendChild(buttonsContainer);

        var additionalButtonsContainer = document.createElement('div');
        additionalButtonsContainer.style.display = 'flex';
        additionalButtonsContainer.style.flexWrap = 'wrap';
        additionalButtonsContainer.style.marginTop = '10px';
        additionalButtonsContainer.style.marginLeft = '10px';

        for (var j = 0; j < additionalMultipliers.length; j++) {
            var additionalMultiplierButton = document.createElement('button');
            additionalMultiplierButton.textContent = '+' + additionalMultipliers[j].toLocaleString();
            additionalMultiplierButton.style.background = '#555';
            additionalMultiplierButton.style.color = '#fff';
            additionalMultiplierButton.style.marginRight = '10px';
            additionalMultiplierButton.addEventListener('click', createAdditionClickHandler(additionalMultipliers[j]));
            additionalButtonsContainer.appendChild(additionalMultiplierButton);
        }

        bigBox.appendChild(additionalButtonsContainer);

        var additionalButtons = [
            { label: 'All Upgrades', action: function() { Game.SetAllUpgrades(1); } },
            { label: 'All Achievements', action: function() { Game.SetAllAchievs(1); } },
            { label: 'Max Specials', action: function() { Game.MaxSpecials(); } }
        ];

        var extraButtonsContainer = document.createElement('div');
        extraButtonsContainer.style.display = 'flex';
        extraButtonsContainer.style.flexWrap = 'wrap';
        extraButtonsContainer.style.marginTop = '10px';
        extraButtonsContainer.style.marginLeft = '10px';

        for (var k = 0; k < additionalButtons.length; k++) {
            var additionalButton = document.createElement('button');
            additionalButton.textContent = additionalButtons[k].label;
            additionalButton.style.background = '#555';
            additionalButton.style.color = '#fff';
            additionalButton.style.marginRight = '10px';
            additionalButton.addEventListener('click', additionalButtons[k].action);
            extraButtonsContainer.appendChild(additionalButton);
        }

        bigBox.appendChild(extraButtonsContainer);

        var resetButton = document.createElement('button');
        resetButton.textContent = 'RESET GAME';
        resetButton.style.background = '#f00';
        resetButton.style.color = '#fff';
        resetButton.style.position = 'absolute';
        resetButton.style.bottom = '10px';
        resetButton.style.left = '50%';
        resetButton.style.transform = 'translateX(-50%)';
        resetButton.addEventListener('click', function() {
            var confirmation = confirm('Are you sure you want to reset the game?');
            if (confirmation) {
                Game.SesameReset();
            }
        });
        bigBox.appendChild(resetButton);

        document.body.appendChild(bigBox);
    });
    modMenu.appendChild(feature1Button);

    var feature2Button = document.createElement('button');
    feature2Button.textContent = 'Close';
    feature2Button.style.background = '#555';
    feature2Button.style.color = '#fff';
    feature2Button.style.marginLeft = '10px';
    feature2Button.addEventListener('click', function() {
        if (!bigBox) {
            return;
        }
        document.body.removeChild(bigBox);
        bigBox = null;
    });
    modMenu.appendChild(feature2Button);

    var autoClickerButton = document.createElement('button');
    autoClickerButton.textContent = 'Auto-Click: OFF';
    autoClickerButton.style.background = '#555';
    autoClickerButton.style.color = '#fff';
    autoClickerButton.style.marginLeft = '10px';
    autoClickerButton.addEventListener('click', function() {
        if (autoClickerButton.textContent === 'Auto-Click: OFF') {
            startAutoClicker();
        } else {
            stopAutoClicker();
        }
    });
    modMenu.appendChild(autoClickerButton);

    document.body.appendChild(modMenu);

    function createClickHandler(multiplier) {
        return function() {
            var cookies = Game.cookies;
            var newAmount = cookies * multiplier;
            Game.cookies = newAmount;
        };
    }

    function createAdditionClickHandler(value) {
        return function() {
            Game.cookies += value;
        };
    }

    var autoClickerIntervalId;

    function startAutoClicker() {
        autoClickerIntervalId = setInterval(function() {
            Game.ClickCookie();
        }, 100);
        autoClickerButton.textContent = 'Auto-Click: ON';
    }

    function stopAutoClicker() {
        clearInterval(autoClickerIntervalId);
        autoClickerIntervalId = null;
        autoClickerButton.textContent = 'Auto-Click: OFF';
    }
})();

