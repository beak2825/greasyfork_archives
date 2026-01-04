// ==UserScript==
// @name         Survev UI Mod v5
// @namespace    http://tampermonkey.net/
// @version      2024-08-31
// @description  QoL features for Survev.io (works with expandedwater, untested)
// @author       Blubbled
// @match        https://survev.io/*
// @match        https://expandedwater.online/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510653/Survev%20UI%20Mod%20v5.user.js
// @updateURL https://update.greasyfork.org/scripts/510653/Survev%20UI%20Mod%20v5.meta.js
// ==/UserScript==



(function() {

    var lastCalledTime;
    var fps;
    var frameTimes = [];
    var maxFrames = 100;
    var uncappedFPS = false;
    var uiElementsEnabled = true;
    var fpsCounterEnabled = true;
    var currentCountdown = null;
    var healthBarSettingsCreated = false;
    var switchDelayEnabled = localStorage.getItem('switchDelayEnabled') === 'true';
    var customColor = localStorage.getItem('customColor') || '#ffffff';
    var colorToggleState = localStorage.getItem('colorToggle') === 'true';

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
        fpsCounter.style.color = customColor;
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

    function resetTextColors() {
        var fpsCounter = document.getElementById('fps-counter');
        var ammoCount = document.getElementById('ui-current-clip');
        var healCounts = document.querySelectorAll('.ui-loot-count');

        if (fpsCounter) fpsCounter.style.color = '';
        if (ammoCount) ammoCount.style.color = '';
        healCounts.forEach(function(healCount) {
            healCount.style.color = '';
        });
    }

    function updateTextColor(newColor) {
        if (!colorToggleState) {
            resetTextColors();
            return;
        }

        customColor = newColor;
        localStorage.setItem('customColor', newColor);

        var fpsCounter = document.getElementById('fps-counter');
        var ammoCount = document.getElementById('ui-current-clip');
        var healCounts = document.querySelectorAll('.ui-loot-count');

        if (fpsCounter) fpsCounter.style.color = newColor;
        if (ammoCount) ammoCount.style.color = newColor;
        healCounts.forEach(function(healCount) {
            healCount.style.color = newColor;
        });
    }

    function applyInitialTextColor() {
        if (!colorToggleState) {
            return;
        }

        var ammoCount = document.getElementById('ui-current-clip');
        var healCounts = document.querySelectorAll('.ui-loot-count');

        if (ammoCount) ammoCount.style.color = customColor;
        healCounts.forEach(function(healCount) {
            healCount.style.color = customColor;
        });
    }

    function applyColorOnGameUI() {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    applyInitialTextColor();
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    var uiTopLeft = document.getElementById('ui-top-left');
    if (uiTopLeft) {
        uiTopLeft.style.position = 'relative';
        uiTopLeft.style.left = '100px';
    }

    document.addEventListener("DOMContentLoaded", function() {
        if (colorToggleState) {
            applyInitialTextColor();
        }

        applyColorOnGameUI();
    });

    function createSwitchDelayToggle(settingsTab) {
        var switchDelayLabel = document.createElement('label');
        switchDelayLabel.textContent = 'Show Switch Delay';
        settingsTab.appendChild(switchDelayLabel);

        var switchDelayCheckbox = document.createElement('input');
        switchDelayCheckbox.type = 'checkbox';
        switchDelayCheckbox.id = 'switch-delay-checkbox';
        switchDelayCheckbox.checked = switchDelayEnabled;
        settingsTab.appendChild(switchDelayCheckbox);
        settingsTab.appendChild(document.createElement('br'));

        switchDelayCheckbox.addEventListener('change', function() {
            switchDelayEnabled = switchDelayCheckbox.checked;
            localStorage.setItem('switchDelayEnabled', switchDelayEnabled);
        });
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
    settingsTab.style.height = '400px';
    settingsTab.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    settingsTab.style.color = 'white';
    settingsTab.style.padding = '20px';
    settingsTab.style.borderRadius = '10px';
    settingsTab.style.display = 'none';
    settingsTab.innerHTML = '<h2>Mod Settings (buggy, reenable uncapped FPS a few times if cursor info doesnt update)</h2>';
    document.body.appendChild(settingsTab);

    var fpsSettingWrapper = document.createElement('div');
    fpsSettingWrapper.style.textAlign = 'left';

    var fpsLabel = document.createElement('label');
    fpsLabel.textContent = 'Enable Uncapped FPS';
    fpsLabel.setAttribute('for', 'uncapped-fps-checkbox');

    var fpsCheckbox = document.createElement('input');
    fpsCheckbox.type = 'checkbox';
    fpsCheckbox.id = 'uncapped-fps-checkbox';

    fpsSettingWrapper.appendChild(fpsLabel);
    fpsSettingWrapper.appendChild(fpsCheckbox);

    settingsTab.appendChild(fpsSettingWrapper);

    var uiSettingWrapper = document.createElement('div');
    uiSettingWrapper.style.textAlign = 'left';

    var uiLabel = document.createElement('label');
    uiLabel.textContent = 'Show Cursor Info';
    uiLabel.setAttribute('for', 'ui-elements-checkbox');

    var uiCheckbox = document.createElement('input');
    uiCheckbox.type = 'checkbox';
    uiCheckbox.id = 'ui-elements-checkbox';

    uiSettingWrapper.appendChild(uiLabel);
    uiSettingWrapper.appendChild(uiCheckbox);

    settingsTab.appendChild(uiSettingWrapper);

    var fpsCounterWrapper = document.createElement('div');
    fpsCounterWrapper.style.textAlign = 'left';

    var fpsCounterLabel = document.createElement('label');
    fpsCounterLabel.textContent = 'Show FPS Counter';
    fpsCounterLabel.setAttribute('for', 'fps-counter-checkbox');

    var fpsCounterCheckbox = document.createElement('input');
    fpsCounterCheckbox.type = 'checkbox';
    fpsCounterCheckbox.id = 'fps-counter-checkbox';

    fpsCounterWrapper.appendChild(fpsCounterLabel);
    fpsCounterWrapper.appendChild(fpsCounterCheckbox);

    settingsTab.appendChild(fpsCounterWrapper);

    createSwitchDelayToggle(settingsTab);
    settingsTab.appendChild(document.createElement('br'));

    function toggleUncappedFPS(enabled) {
        if (enabled) {
            window.requestAnimationFrame = function(callback) {
                return setTimeout(callback, 1);
            };
        } else {
            window.requestAnimationFrame = function(callback) {
                return setTimeout(callback, 1000 / 60);
            };
        }
    }



    var colorToggleLabel = document.createElement('label');
    colorToggleLabel.textContent = 'Enable Custom Text Color';
    settingsTab.appendChild(colorToggleLabel);

    var colorToggleCheckbox = document.createElement('input');
    colorToggleCheckbox.type = 'checkbox';
    colorToggleCheckbox.id = 'color-toggle-checkbox';
    colorToggleCheckbox.checked = colorToggleState;
    settingsTab.appendChild(colorToggleCheckbox);
    settingsTab.appendChild(document.createElement('br'));

    var colorPickerLabel = document.createElement('label');
    colorPickerLabel.textContent = 'Select Text Color';
    settingsTab.appendChild(colorPickerLabel);

    var colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = customColor;
    colorPicker.disabled = !colorToggleState;
    settingsTab.appendChild(colorPicker);
    settingsTab.appendChild(document.createElement('br'));

    colorToggleCheckbox.addEventListener('change', function() {
    colorToggleState = colorToggleCheckbox.checked;
        colorPicker.disabled = !colorToggleState;
        if (colorToggleState) {
            updateTextColor(colorPicker.value);
        } else {
            resetTextColors();
        }
        localStorage.setItem('colorToggle', colorToggleState);
    });
    colorPicker.addEventListener('input', function() {
        if (colorToggleState) {
            updateTextColor(colorPicker.value);
        }
    });

    function updateSettingsButtonVisibility() {
        var loadingOverlay = document.querySelector('.play-loading-outer');

        if (loadingOverlay && window.getComputedStyle(loadingOverlay).opacity === '0') {
            settingsButton.style.display = 'block';
        } else {
            settingsButton.style.display = 'none';
            settingsTab.style.display = 'none';
        }

        if (!healthBarSettingsCreated) {
            createHealthBarSettingsUI(settingsTab);
            healthBarSettingsCreated = true;
        }

        if (healthBarColorToggleState) {
            observeHealthBar();
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

        if (colorToggleState) {
            updateTextColor(customColor);
        }
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

    var healthBarColor = localStorage.getItem('healthBarColor') || '#00ff00';
    var healthBarDegradationColor = localStorage.getItem('healthBarDegradationColor') || '#ff0000';
    var healthBarColorToggleState = localStorage.getItem('healthBarColorToggle') === 'true';

    function interpolateColor(color1, color2, factor) {
        var result = color1.slice(1).match(/.{2}/g).map((hex, i) => {
            return Math.round(parseInt(hex, 16) * (1 - factor) + parseInt(color2.slice(1).match(/.{2}/g)[i], 16) * factor).toString(16).padStart(2, '0');
        });
        return `#${result.join('')}`;
    }


    function updateHealthBarColor(percentage) {
        if (!healthBarColorToggleState) return;
        var interpolatedColor = interpolateColor(healthBarColor, healthBarDegradationColor, 1 - percentage);
        var healthBar = document.getElementById('ui-health-actual');
        if (healthBar) {
            healthBar.style.backgroundColor = interpolatedColor;
        }
    }

    function observeHealthBar() {
        var healthBar = document.getElementById('ui-health-actual');
        if (!healthBar) return;

        var observer = new MutationObserver(function() {
            var width = parseFloat(healthBar.style.width);
            var percentage = width / 100;
            updateHealthBarColor(percentage);
        });

        observer.observe(healthBar, { attributes: true, attributeFilter: ['style'] });
    }


    function createHealthBarSettingsUI(settingsTab) {

        var healthBarColorToggleLabel = document.createElement('label');
        settingsTab.appendChild(document.createElement('br'));
        healthBarColorToggleLabel.textContent = 'Enable Custom Health Bar Color';
        settingsTab.appendChild(healthBarColorToggleLabel);

        var healthBarColorToggleCheckbox = document.createElement('input');
        healthBarColorToggleCheckbox.type = 'checkbox';
        healthBarColorToggleCheckbox.id = 'health-bar-color-toggle-checkbox';
        healthBarColorToggleCheckbox.checked = healthBarColorToggleState;
        settingsTab.appendChild(healthBarColorToggleCheckbox);
        settingsTab.appendChild(document.createElement('br'));


        var healthBarColorLabel = document.createElement('label');
        healthBarColorLabel.textContent = 'Health Bar Color:';
        settingsTab.appendChild(healthBarColorLabel);

        var healthBarColorPicker = document.createElement('input');
        healthBarColorPicker.type = 'color';
        healthBarColorPicker.value = healthBarColor;
        healthBarColorPicker.disabled = !healthBarColorToggleState;
        settingsTab.appendChild(healthBarColorPicker);
        settingsTab.appendChild(document.createElement('br'));


        var healthBarDegradationColorLabel = document.createElement('label');
        healthBarDegradationColorLabel.textContent = 'Health Bar Degradation Color:';
        settingsTab.appendChild(healthBarDegradationColorLabel);

        var healthBarDegradationColorPicker = document.createElement('input');
        healthBarDegradationColorPicker.type = 'color';
        healthBarDegradationColorPicker.value = healthBarDegradationColor;
        healthBarDegradationColorPicker.disabled = !healthBarColorToggleState;
        settingsTab.appendChild(healthBarDegradationColorPicker);
        settingsTab.appendChild(document.createElement('br'));


        healthBarColorToggleCheckbox.addEventListener('change', function() {
            healthBarColorToggleState = healthBarColorToggleCheckbox.checked;
            localStorage.setItem('healthBarColorToggle', healthBarColorToggleState);
            healthBarColorPicker.disabled = !healthBarColorToggleState;
            healthBarDegradationColorPicker.disabled = !healthBarColorToggleState;

            if (healthBarColorToggleState) {
                observeHealthBar();
            }
        });

        healthBarColorPicker.addEventListener('input', function() {
            healthBarColor = healthBarColorPicker.value;
            localStorage.setItem('healthBarColor', healthBarColor);
        });

        healthBarDegradationColorPicker.addEventListener('input', function() {
            healthBarDegradationColor = healthBarDegradationColorPicker.value;
            localStorage.setItem('healthBarDegradationColor', healthBarDegradationColor);
        });
    }
    var gunSwitchDelayMap = {
        "AWM-S": 1000,
        "BLR 81": 1000,
        "Model 94": 1000,
        "Mosin-Nagant": 1000,
        "SV-98": 1000,
        "Scout Elite": 1000,

        "Hawk 12G": 900,
        "Heart Cannon": 900,
        "M1100": 900,
        "M134": 900,
        "M79": 900,
        "M870": 900,
        "Potato Cannon": 900,

        "AK-47": 750,
        "AN-94": 750,
        "BAR M1918": 750,
        "CZ-3A1": 750,
        "DP-28": 750,
        "FAMAS": 750,
        "Groza": 750,
        "Groza-S": 750,
        "L86A2": 750,
        "M1 Garand": 750,
        "M1014": 750,
        "M1A1": 750,
        "M249": 750,
        "M39 EMR": 750,
        "M416": 750,
        "M4A1-S": 750,
        "MAC-10": 750,
        "MP5": 750,
        "Mk 12 SPR": 750,
        "Mk45G": 750,
        "PKM": 750,
        "PKP Pecheneg": 750,
        "QBB-97": 750,
        "SCAR-H": 750,
        "SCAR-SSR": 750,
        "SPAS-12": 750,
        "SVD-63": 750,
        "Saiga-12": 750,
        "Spud Gun": 750,
        "UMP9": 750,
        "USAS-12": 750,
        "VSS": 750,
        "Vector": 750,

        "Bugle": 300,
        "DEagle 50": 300,
        "Dual DEagle 50": 300,
        "Dual Flare Gun": 300,
        "Dual OT-38": 300,
        "Dual OTs-38": 300,
        "Dual P30L": 300,
        "Dual Peacemaker": 300,
        "Flare Gun": 300,
        "MP220": 300,
        "OT-38": 300,
        "OTs-38": 300,
        "Peacemaker": 300,
        "Rainbow Blaster": 300,

        "Dual G18C": 250,
        "Dual M1911": 250,
        "Dual M9": 250,
        "Dual M93R": 250,
        "G18C": 250,
        "M1911": 250,
        "M9": 250,
        "M9 Cursed": 250,
        "M93R": 250,
        "P30L": 250
    };


    var currentCountdown = null;

    function createSwitchDelayText() {
        var delayText = document.createElement('div');
        delayText.id = 'switch-delay-text';
        delayText.style.position = 'fixed';
        delayText.style.color = 'red';
        delayText.style.fontSize = '25px';
        delayText.style.fontWeight = 'bold';
        delayText.style.zIndex = '1000';
        delayText.style.left = '50%';
        delayText.style.transform = 'translateX(-50%)';
        delayText.style.top = '40%';
        document.body.appendChild(delayText);
        return delayText;
    }


    function showSwitchDelay(gunName, delayMs) {
        if (!switchDelayEnabled) return;

        if (currentCountdown) {
            clearInterval(currentCountdown);
        }

        if (!gunSwitchDelayMap[gunName]) {
            return;
        }

        var delayInSeconds = (delayMs / 1000).toFixed(2);
        var delayText = document.getElementById('switch-delay-text') || createSwitchDelayText();

        delayText.textContent = `${delayInSeconds}s`;
        delayText.style.display = 'block';

        currentCountdown = setInterval(function() {
            delayInSeconds -= 0.01;
            delayText.textContent = `${delayInSeconds.toFixed(2)}s`;

            if (delayInSeconds <= 0) {
                clearInterval(currentCountdown);
                delayText.style.display = 'none';
                currentCountdown = null;
            }
        }, 10);
    }


    function detectWeaponSwitch() {
        var previousWeapon = null;

        setInterval(function() {
            var equippedWeapon = document.querySelector('.ui-weapon-switch[style*="background-color: rgba(0, 0, 0, 0.4)"], .ui-weapon-switch[style*="opacity: 1"]');
            if (equippedWeapon) {
                var weaponName = equippedWeapon.querySelector('.ui-weapon-name').textContent.trim();
                if (weaponName !== previousWeapon) {
                    previousWeapon = weaponName;

                    var delayMs = gunSwitchDelayMap[weaponName];
                    if (delayMs) {
                        showSwitchDelay(weaponName, delayMs);
                    }
                }
            }
        }, 100);
    }

    detectWeaponSwitch();


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