// ==UserScript==
// @name         Blubbled's UI Mod v1.3
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds some QoL features, such as always showing kill count, green health bar, etc
// @author       Blubbled
// @match        https://suroi.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493884/Blubbled%27s%20UI%20Mod%20v13.user.js
// @updateURL https://update.greasyfork.org/scripts/493884/Blubbled%27s%20UI%20Mod%20v13.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function periodicallyShowKillCounter() {
        showKillCounter();
        setTimeout(periodicallyShowKillCounter, 200);
    }

    function showKillCounter() {
        var killCounter = document.getElementById('kill-counter');
        if (killCounter) {
            killCounter.style.display = 'flex';
            killCounter.style.alignItems = 'center';
            var skullIcon = killCounter.querySelector('img');
            if (skullIcon) {
                skullIcon.style.marginRight = '5px';
            }
            var counterText = killCounter.querySelector('.counter-text');
            if (counterText) {
                counterText.style.minWidth = '30px';
            }
        }
    }

    function addAdditionalUI() {
        var additionalText = document.createElement('h1');
        additionalText.textContent = "Technical UI pack by Blubbled ";
        var joinLink = document.createElement('a');
        joinLink.textContent = "[JOIN ZESK]";
        joinLink.href = "https://discord.gg/msNbP9Nt2r";
        joinLink.style.color = 'blue';
        joinLink.style.textDecoration = 'underline';
        joinLink.style.marginLeft = '5px';
        additionalText.appendChild(joinLink);
        additionalText.style.position = 'fixed';
        additionalText.style.top = '10px';
        additionalText.style.right = '10px';
        additionalText.style.color = '#ffffff';
        additionalText.style.zIndex = '9999';
        additionalText.style.display = 'none';
        document.body.appendChild(additionalText);

        var masterVolumeSlider = document.getElementById('slider-master-volume');
        var sfxVolumeSlider = document.getElementById('slider-sfx-volume');
        var musicVolumeSlider = document.getElementById('slider-music-volume');
        var uiScaleSlider = document.getElementById('slider-ui-scale');
        var minimapTransparencySlider = document.getElementById('slider-minimap-transparency');
        var bigMapTransparencySlider = document.getElementById('slider-big-map-transparency');

        if (masterVolumeSlider && sfxVolumeSlider && musicVolumeSlider && uiScaleSlider && minimapTransparencySlider && bigMapTransparencySlider) {
            masterVolumeSlider.step = 0.01;
            sfxVolumeSlider.step = 0.01;
            musicVolumeSlider.step = 0.01;
            uiScaleSlider.step = 0.01;
            minimapTransparencySlider.step = 0.01;
            bigMapTransparencySlider.step = 0.01;
        }
    }

    function replaceWithHeader() {
        var customHeader = document.createElement('h1');
        customHeader.textContent = "Technical UI pack by Blubbled ";
        var joinLink = document.createElement('a');
        joinLink.textContent = "[JOIN ZESK]";
        joinLink.href = "https://discord.gg/msNbP9Nt2r";
        joinLink.style.color = 'blue';
        joinLink.style.textDecoration = 'underline';
        joinLink.style.marginLeft = '5px'; // Adjust spacing as needed
        customHeader.appendChild(joinLink);
        customHeader.style.position = 'fixed';
        customHeader.style.top = '10px';
        customHeader.style.right = '10px';
        customHeader.style.color = '#ffffff';
        customHeader.style.zIndex = '9999';
        var elementToReplace = document.querySelector('a[href="./changelog/"][target="_blank"][rel="noopener noreferrer"]');
        if (elementToReplace) {
            elementToReplace.parentNode.replaceChild(customHeader, elementToReplace);
        }
    }

    function updateHealthBarColor() {
        var healthBar = document.getElementById('health-bar');
        var healthPercentage = document.getElementById('health-bar-percentage');
        var percentage = parseInt(healthPercentage.textContent);

        var colorPicker = document.getElementById('health-bar-color');
        var selectedColor = colorPicker.value;

        var degradationColorPicker = document.getElementById('health-bar-degradation-color');
        var degradationColor = degradationColorPicker.value;

        var redValue = Math.round((100 - percentage) * 2.55);
        var blendFactor = percentage / 100;
        var finalRed = Math.round((1 - blendFactor) * parseInt(degradationColor.substr(1, 2), 16) + blendFactor * parseInt(selectedColor.substr(1, 2), 16));
        var finalGreen = Math.round((1 - blendFactor) * parseInt(degradationColor.substr(3, 2), 16) + blendFactor * parseInt(selectedColor.substr(3, 2), 16));
        var finalBlue = Math.round((1 - blendFactor) * parseInt(degradationColor.substr(5, 2), 16) + blendFactor * parseInt(selectedColor.substr(5, 2), 16));
        var updatedColor = 'rgb(' + finalRed + ',' + finalGreen + ',' + finalBlue + ')';
        healthBar.style.backgroundColor = updatedColor;
    }
    function saveSettings() {
        var healthBarColor = document.getElementById('health-bar-color').value;
        var healthBarDegradationColor = document.getElementById('health-bar-degradation-color').value;
        localStorage.setItem('healthBarColor', healthBarColor);
        localStorage.setItem('healthBarDegradationColor', healthBarDegradationColor);
    }

    // Function to load settings from localStorage
    function loadSettings() {
        var healthBarColor = localStorage.getItem('healthBarColor');
        var healthBarDegradationColor = localStorage.getItem('healthBarDegradationColor');
        if (healthBarColor) {
            document.getElementById('health-bar-color').value = healthBarColor;
        }
        if (healthBarDegradationColor) {
            document.getElementById('health-bar-degradation-color').value = healthBarDegradationColor;
        }
    }


    var settingsTabsContainer = document.getElementById('settings-tabs-container');
    var modSettingsTabButton = document.createElement('button');
    modSettingsTabButton.className = 'tab';
    modSettingsTabButton.id = 'tab-mod-settings';
    modSettingsTabButton.innerHTML = '<i class="fa-solid fa-gear"></i>Mod Settings';
    settingsTabsContainer.querySelector('#settings-tab-bar').appendChild(modSettingsTabButton);

    var modSettingsTabContent = document.createElement('div');
    modSettingsTabContent.className = 'tab-content';
    modSettingsTabContent.id = 'tab-mod-settings-content';
    modSettingsTabContent.style.display = 'none';

    var modSettingsContent = document.createElement('div');

    var healthBarColorSetting = document.createElement('div');
    healthBarColorSetting.className = 'modal-item';
    healthBarColorSetting.style.marginBottom = '25px';
    healthBarColorSetting.innerHTML = `
<label>
    <span class="setting-title">Health bar color</span>
    <input type="color" id="health-bar-color" value="#FFFFFF"> <!-- Default color: white -->
</label>
`;
    modSettingsContent.appendChild(healthBarColorSetting);

    var healthBarDegradationColorSetting = document.createElement('div');
    healthBarDegradationColorSetting.className = 'modal-item';
    healthBarDegradationColorSetting.style.marginBottom = '10px';
    healthBarDegradationColorSetting.innerHTML = `
<label>
    <span class="setting-title">Health bar degradation color</span>
    <input type="color" id="health-bar-degradation-color" value="#FF0000"> <!-- Default color: red -->
</label>`;
    modSettingsContent.appendChild(healthBarDegradationColorSetting);

    modSettingsTabContent.appendChild(modSettingsContent);
    settingsTabsContainer.querySelector('#settings-tabs').appendChild(modSettingsTabContent);



    var healthBarSettings = document.querySelectorAll('#health-bar-color, #health-bar-degradation-color');
    healthBarSettings.forEach(function(setting) {
        setting.addEventListener('input', function() {
            updateHealthBarColor();
            saveSettings();
        });
    });

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


    var uncappedFPSEnabled = localStorage.getItem('uncappedFPSEnabled') === 'true';
    toggleUncappedFPS(uncappedFPSEnabled);


    function updateUncappedFPSSetting(enabled) {
        localStorage.setItem('uncappedFPSEnabled', enabled);
        toggleUncappedFPS(enabled);
    }


    function createUncappedFPSSetting() {
        var uncappedFPSSetting = document.createElement('div');
        uncappedFPSSetting.className = 'modal-item checkbox-setting';
        uncappedFPSSetting.style.marginBottom = '10px';
        uncappedFPSSetting.innerHTML = `
            <label>
                <span class="setting-title" style="margin-right: 10px;">Uncapped FPS</span>
                <input type="checkbox" id="toggle-uncapped-fps" ${uncappedFPSEnabled ? 'checked' : ''} style="margin-left: auto; margin-right: -40px; ">
            </label>
        `;
        uncappedFPSSetting.querySelector('#toggle-uncapped-fps').addEventListener('change', function() {
            updateUncappedFPSSetting(this.checked);
        });
        return uncappedFPSSetting;
    }


    modSettingsContent.appendChild(createUncappedFPSSetting());

    var graphicsSettingsTabContent = document.getElementById('tab-graphics-content');
    graphicsSettingsTabContent.appendChild(createUncappedFPSSetting());


    showKillCounter();
    addAdditionalUI();
    updateHealthBarColor();
    loadSettings();
    createUncappedFPSSetting()
    var healthPercentage = document.getElementById('health-bar-percentage');
    healthPercentage.addEventListener('DOMSubtreeModified', updateHealthBarColor);

    periodicallyShowKillCounter();
    document.addEventListener('DOMContentLoaded', addAdditionalUI);
    window.addEventListener('popstate', showKillCounter);
    replaceWithHeader();
})();
