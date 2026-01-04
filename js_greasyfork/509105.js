// ==UserScript==
// @name         Survev.io UI mod v2
// @namespace    http://tampermonkey.net/
// @version      2024-08-31
// @description  QoL features for Survev.io
// @author       Blubbled
// @match        https://survev.io/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509105/Survevio%20UI%20mod%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/509105/Survevio%20UI%20mod%20v2.meta.js
// ==/UserScript==


(function() {

    var lastCalledTime;
    var fps;
    var frameTimes = [];
    var maxFrames = 100;
    var uncappedFPS = false;
    var uiElementsEnabled = true;
    var fpsCounterEnabled = true;

    function requestAnimFrame() {
        if (!lastCalledTime) {
            lastCalledTime = Date.now();
            fps = 0;
            return;
        }

        var currentTime = Date.now();
        var delta = (currentTime - lastCalledTime) / 1000;
        lastCalledTime = currentTime;

        frameTimes.push(delta);

        if (frameTimes.length > maxFrames) {
            frameTimes.shift();
        }

        var totalTime = frameTimes.reduce((sum, time) => sum + time, 0);
        fps = (frameTimes.length / totalTime).toFixed(0);
    }

    function createFPSCounter() {
        var fpsCounter = document.createElement('div');
        fpsCounter.id = 'fps-counter';
        fpsCounter.style.position = 'fixed';
        fpsCounter.style.left = '10px';
        fpsCounter.style.top = '130px';
        fpsCounter.style.color = 'white';
        fpsCounter.style.fontSize = '20px';
        fpsCounter.style.fontWeight = 'bold';
        fpsCounter.style.zIndex = '1000';
        fpsCounter.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        fpsCounter.style.padding = '5px';
        fpsCounter.style.borderRadius = '5px';
        document.body.appendChild(fpsCounter);

        var lastUpdate = Date.now();

        function updateFPSCounter() {
            requestAnimFrame();
            var now = Date.now();
            if (now - lastUpdate >= 1000) {
                fpsCounter.textContent = `FPS: ${fps}`;
                lastUpdate = now;
            }

            requestAnimationFrame(updateFPSCounter);
        }

        updateFPSCounter();
    }

    createFPSCounter();


    function toggleFPSCounter(enabled) {
        var fpsCounter = document.getElementById('fps-counter');
        if (enabled) {
            fpsCounter.style.display = 'block';
        } else {
            fpsCounter.style.display = 'none';
        }
    }


    var settingsButton = document.createElement('button');
    settingsButton.id = 'settings-button';
    settingsButton.textContent = 'Mod Settings';
    settingsButton.style.position = 'fixed';
    settingsButton.style.left = '10px';
    settingsButton.style.top = '50%';
    settingsButton.style.transform = 'translateY(-50%)';
    settingsButton.style.padding = '10px';
    settingsButton.style.fontSize = '18px';
    settingsButton.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    settingsButton.style.color = 'white';
    settingsButton.style.zIndex = '1000';
    settingsButton.style.display = 'none';
    document.body.appendChild(settingsButton);


    var settingsTab = document.createElement('div');
    settingsTab.id = 'settings-tab';
    settingsTab.style.position = 'fixed';
    settingsTab.style.left = '200px';
    settingsTab.style.top = '50%';
    settingsTab.style.width = '300px';
    settingsTab.style.height = '200px';
    settingsTab.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    settingsTab.style.color = 'white';
    settingsTab.style.padding = '20px';
    settingsTab.style.borderRadius = '10px';
    settingsTab.style.display = 'none';
    settingsTab.innerHTML = '<h2>Mod Settings (a little buggy, re-enable uncapped FPS to update cursor info)</h2>';
    document.body.appendChild(settingsTab);

    var fpsCheckbox = document.createElement('input');
    fpsCheckbox.type = 'checkbox';
    fpsCheckbox.id = 'uncapped-fps-checkbox';
    var fpsLabel = document.createElement('label');
    fpsLabel.setAttribute('for', 'uncapped-fps-checkbox');
    fpsLabel.textContent = 'Enable Uncapped FPS';
    settingsTab.appendChild(fpsCheckbox);
    settingsTab.appendChild(fpsLabel);
    settingsTab.appendChild(document.createElement('br'));


    var fpsCounterCheckbox = document.createElement('input');
    fpsCounterCheckbox.type = 'checkbox';
    fpsCounterCheckbox.id = 'fps-counter-checkbox';
    var fpsCounterLabel = document.createElement('label');
    fpsCounterLabel.setAttribute('for', 'fps-counter-checkbox');
    fpsCounterLabel.textContent = 'Show FPS Counter';
    settingsTab.appendChild(fpsCounterCheckbox);
    settingsTab.appendChild(fpsCounterLabel);
    settingsTab.appendChild(document.createElement('br'));


    var uiCheckbox = document.createElement('input');
    uiCheckbox.type = 'checkbox';
    uiCheckbox.id = 'ui-elements-checkbox';
    var uiLabel = document.createElement('label');
    uiLabel.setAttribute('for', 'ui-elements-checkbox');
    uiLabel.textContent = 'Enable Cursor Info';
    settingsTab.appendChild(uiCheckbox);
    settingsTab.appendChild(uiLabel);

    function toggleUncappedFPS(enabled) {
        if (enabled) {
            window.requestAnimationFrame = function(callback) {
                return setTimeout(callback, 1);
            };
        } else {
            window.requestAnimationFrame = function(callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
        }
    }


    function toggleUIElementDisplay(enabled) {
        if (enabled) {
            console.log("UI Elements Enabled");
            document.body.classList.remove('ui-hidden');
        } else {
            console.log("UI Elements Disabled");
            document.body.classList.add('ui-hidden');
        }
    }


    var style = document.createElement('style');
    style.innerHTML = `
        .ui-hidden .your-ui-element-class {
            display: none;
        }
    `;
    document.head.appendChild(style);


    function updateSettingsButtonVisibility() {
        var equippedWeapon = document.querySelector('.ui-weapon-switch[style*="background-color: rgba(0, 0, 0, 0.4)"], .ui-weapon-switch[style*="opacity: 1"]');
        if (!equippedWeapon) {
            settingsButton.style.display = 'block';
        } else {
            settingsButton.style.display = 'none';
            settingsTab.style.display = 'none';
        }
    }


    setInterval(updateSettingsButtonVisibility, 100);


    settingsButton.addEventListener('click', function() {
        if (settingsTab.style.display === 'none') {
            settingsTab.style.display = 'block';
        } else {
            settingsTab.style.display = 'none';
        }
    });


    function loadSettings() {
        var uncappedFPSSetting = localStorage.getItem('uncappedFPS') === 'true';
        var uiElementsSetting = localStorage.getItem('uiElementsEnabled') === 'true';
        var fpsCounterSetting = localStorage.getItem('fpsCounterEnabled') === 'true';

        fpsCheckbox.checked = uncappedFPSSetting;
        uiCheckbox.checked = uiElementsSetting;
        fpsCounterCheckbox.checked = fpsCounterSetting;

        toggleUncappedFPS(uncappedFPSSetting);
        toggleUIElementDisplay(uiElementsSetting);
        toggleFPSCounter(fpsCounterSetting);
    }

    function saveSettings() {
        var uncappedFPSSetting = fpsCheckbox.checked;
        var uiElementsSetting = uiCheckbox.checked;
        var fpsCounterSetting = fpsCounterCheckbox.checked;

        localStorage.setItem('uncappedFPS', uncappedFPSSetting);
        localStorage.setItem('uiElementsEnabled', uiElementsSetting);
        localStorage.setItem('fpsCounterEnabled', fpsCounterSetting);

        toggleUncappedFPS(uncappedFPSSetting);
        toggleUIElementDisplay(uiElementsSetting);
        toggleFPSCounter(fpsCounterSetting);
    }

    loadSettings();


    fpsCheckbox.addEventListener('change', saveSettings);
    uiCheckbox.addEventListener('change', saveSettings);
    fpsCounterCheckbox.addEventListener('change', saveSettings);






    function periodicallyShowKillCounter() {
        showKillCounter();
        setTimeout(periodicallyShowKillCounter, 100);
    }

    function showKillCounter() {
        var killCounter = document.getElementById('ui-kill-counter-wrapper');
        if (killCounter) {
            killCounter.style.display = 'block';
            killCounter.style.position = 'fixed';
            killCounter.style.left = '5px';
            killCounter.style.top = '-25px';
            killCounter.style.color = 'white';
            killCounter.style.fontSize = '20px';
            killCounter.style.fontWeight = 'bold';
            killCounter.style.zIndex = '1000';
            killCounter.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            killCounter.style.padding = '5px';
            killCounter.style.borderRadius = '5px';

            var counterText = killCounter.querySelector('.counter-text');
            if (counterText) {
                counterText.style.minWidth = '30px';
            }
        }
    }

    function calculateAverageBoostWidth() {
        var counterLengths = [98.5, 98.5, 147.75, 49.25];
        var boostCounters = document.querySelectorAll('#ui-boost-counter .ui-bar-inner');
        var totalWidth = 0;

        boostCounters.forEach(function(counter, index) {
            var widthPercentage = parseFloat(counter.style.width);
            var unitLength = counterLengths[index];
            totalWidth += (widthPercentage / 100) * unitLength;
        });

        var totalUnitLength = counterLengths.reduce((a, b) => a + b, 0);
        var averageWidthPercentage = (totalWidth / totalUnitLength) * 100;

        return averageWidthPercentage.toFixed(2) + "%";
    }

    function toggleUIElementDisplay(enabled) {
        if (enabled) {

            var healthBarWidthCopy = document.createElement('span');
            healthBarWidthCopy.id = 'health-bar-width-copy';
            healthBarWidthCopy.classList.add('unselectable');
            healthBarWidthCopy.style.position = 'fixed';
            healthBarWidthCopy.style.fontSize = '25px';
            healthBarWidthCopy.style.fontWeight = 'bold';
            healthBarWidthCopy.style.display = 'none';

            var ammoCountCopy = document.createElement('span');
            ammoCountCopy.id = 'ammo-count-copy';
            ammoCountCopy.classList.add('unselectable');
            ammoCountCopy.style.position = 'fixed';
            ammoCountCopy.style.fontSize = '25px';
            ammoCountCopy.style.fontWeight = 'bold';
            ammoCountCopy.style.display = 'none';

            var weaponNameCopy = document.createElement('span');
            weaponNameCopy.id = 'weapon-name-copy';
            weaponNameCopy.classList.add('unselectable');
            weaponNameCopy.style.position = 'fixed';
            weaponNameCopy.style.fontSize = '20px';
            weaponNameCopy.style.fontWeight = 'bold';
            weaponNameCopy.style.display = 'none';

            var boostWidthCopy = document.createElement('span');
            boostWidthCopy.id = 'boost-width-copy';
            boostWidthCopy.classList.add('unselectable');
            boostWidthCopy.style.position = 'fixed';
            boostWidthCopy.style.fontSize = '20px';
            boostWidthCopy.style.fontWeight = 'bold';
            boostWidthCopy.style.color = 'orange';
            boostWidthCopy.style.display = 'none';

            function updateHealthBarWidthCopy() {
                var healthBar = document.getElementById('ui-health-actual');
                if (healthBar && healthBar.offsetWidth > 0 && healthBar.offsetHeight > 0) {
                    var healthBarWidth = Math.round(parseFloat(healthBar.style.width));
                    var healthBarColor = healthBar.style.backgroundColor;

                    healthBarWidthCopy.textContent = healthBarWidth + "%";
                    healthBarWidthCopy.style.color = healthBarColor;
                    healthBarWidthCopy.style.display = 'block';
                } else {
                    healthBarWidthCopy.style.display = 'none';
                }
            }

            function updateAmmoCountCopy() {
                var ammoCountElement = document.getElementById('ui-current-clip');

                if (ammoCountElement && window.getComputedStyle(ammoCountElement).display !== 'none' && parseFloat(window.getComputedStyle(ammoCountElement).opacity) > 0) {
                    var ammoCount = ammoCountElement.textContent;
                    ammoCountCopy.textContent = ammoCount;
                    ammoCountCopy.style.color = ammoCountElement.style.color;
                    ammoCountCopy.style.display = 'block';
                } else {
                    ammoCountCopy.style.display = 'none';
                }
            }

            function updateWeaponNameCopy() {
                var equippedWeapon = document.querySelector('.ui-weapon-switch[style*="background-color: rgba(0, 0, 0, 0.4)"], .ui-weapon-switch[style*="opacity: 1"]');
                if (equippedWeapon) {
                    var weaponName = equippedWeapon.querySelector('.ui-weapon-name').textContent;
                    weaponNameCopy.textContent = weaponName;
                    weaponNameCopy.style.color = 'white';
                    weaponNameCopy.style.display = 'block';
                } else {
                    weaponNameCopy.style.display = 'none';
                }
            }

            function updateBoostWidthCopy() {
                var boostElement = document.getElementById('ui-boost-counter');
                if (boostElement && window.getComputedStyle(boostElement).display !== 'none' && parseFloat(window.getComputedStyle(boostElement).opacity) > 0) {
                    var averageBoostWidth = calculateAverageBoostWidth();
                    boostWidthCopy.textContent = averageBoostWidth;
                    boostWidthCopy.style.display = 'block';
                } else {
                    boostWidthCopy.style.display = 'none';
                }
            }

            function followCursor(event) {
                healthBarWidthCopy.style.left = `${event.clientX - 70}px`;
                healthBarWidthCopy.style.top = `${event.clientY + 25}px`;

                ammoCountCopy.style.left = `${event.clientX + 40}px`;
                ammoCountCopy.style.top = `${event.clientY + 25}px`;

                weaponNameCopy.style.left = `${event.clientX + 40}px`;
                weaponNameCopy.style.top = `${event.clientY + 50}px`;

                boostWidthCopy.style.left = `${event.clientX - 70}px`;
                boostWidthCopy.style.top = `${event.clientY + 50}px`;
            }

            document.addEventListener('mousemove', followCursor);

            healthBarWidthCopy.style.webkitTouchCallout = 'none'; /* iOS Safari */
            healthBarWidthCopy.style.webkitUserSelect = 'none'; /* Safari */
            healthBarWidthCopy.style.userSelect = 'none'; /* Standard syntax */

            ammoCountCopy.style.webkitTouchCallout = 'none'; /* iOS Safari */
            ammoCountCopy.style.webkitUserSelect = 'none'; /* Safari */
            ammoCountCopy.style.userSelect = 'none'; /* Standard syntax */

            weaponNameCopy.style.webkitTouchCallout = 'none'; /* iOS Safari */
            weaponNameCopy.style.webkitUserSelect = 'none'; /* Safari */
            weaponNameCopy.style.userSelect = 'none'; /* Standard syntax */

            boostWidthCopy.style.webkitTouchCallout = 'none'; /* iOS Safari */
            boostWidthCopy.style.webkitUserSelect = 'none'; /* Safari */
            boostWidthCopy.style.userSelect = 'none'; /* Standard syntax */

            document.body.appendChild(healthBarWidthCopy);
            document.body.appendChild(ammoCountCopy);
            document.body.appendChild(weaponNameCopy);
            document.body.appendChild(boostWidthCopy);

            updateHealthBarWidthCopy();
            updateAmmoCountCopy();
            updateWeaponNameCopy();
            updateBoostWidthCopy();

            var healthObserver = new MutationObserver(updateHealthBarWidthCopy);
            var healthTargetNode = document.getElementById('ui-health-actual');
            if (healthTargetNode) {
                healthObserver.observe(healthTargetNode, { attributes: true, attributeFilter: ['style', 'class'] });
            }
            if (healthTargetNode && healthTargetNode.parentElement) {
                healthObserver.observe(healthTargetNode.parentElement, { attributes: true, attributeFilter: ['style', 'class'] });
            }

            var ammoObserver = new MutationObserver(updateAmmoCountCopy);
            var ammoTargetNode = document.getElementById('ui-current-clip');
            if (ammoTargetNode) {
                ammoObserver.observe(ammoTargetNode, { attributes: true, childList: true, subtree: true });
            }

            var weaponObserver = new MutationObserver(updateWeaponNameCopy);
            var weaponTargetNodes = document.querySelectorAll('.ui-weapon-switch');
            weaponTargetNodes.forEach(function(node) {
                weaponObserver.observe(node, { attributes: true, attributeFilter: ['style', 'class'] });
            });

            var boostObserver = new MutationObserver(updateBoostWidthCopy);
            var boostTargetNodes = document.querySelectorAll('#ui-boost-counter .ui-bar-inner');
            boostTargetNodes.forEach(function(node) {
                boostObserver.observe(node, { attributes: true, attributeFilter: ['style', 'class'] });
            });

        } else {
            var healthBarWidthCopy = document.getElementById('health-bar-width-copy');
            if (healthBarWidthCopy) {
                healthBarWidthCopy.parentNode.removeChild(healthBarWidthCopy);
            }

            var ammoCountCopy = document.getElementById('ammo-count-copy');
            if (ammoCountCopy) {
                ammoCountCopy.parentNode.removeChild(ammoCountCopy);
            }

            var weaponNameCopy = document.getElementById('weapon-name-copy');
            if (weaponNameCopy) {
                weaponNameCopy.parentNode.removeChild(weaponNameCopy);
            }

            var boostWidthCopy = document.getElementById('boost-width-copy');
            if (boostWidthCopy) {
                boostWidthCopy.parentNode.removeChild(boostWidthCopy);
            }
        }
    }

    toggleUIElementDisplay(true);
    showKillCounter();
    periodicallyShowKillCounter();
})();
