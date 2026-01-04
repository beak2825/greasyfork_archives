// ==UserScript==
// @name         Blubbled's UI Mod v2
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Adds some QoL features, such as always showing kill count, green health bar, etc
// @author       Blubbled
// @match        https://suroi.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494172/Blubbled%27s%20UI%20Mod%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/494172/Blubbled%27s%20UI%20Mod%20v2.meta.js
// ==/UserScript==



(function() {

    'use strict';

    function periodicallyShowKillCounter() {
        showKillCounter();
        setTimeout(periodicallyShowKillCounter, 100);
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
    var actionTimer;
    var countdownElement;

    function startActionTimer() {
        var countdownValue = 4;
        countdownElement = document.createElement('div');
        countdownElement.id = 'action-countdown';
        countdownElement.textContent = countdownValue;
        countdownElement.style.position = 'fixed';
        countdownElement.style.top = '50%';
        countdownElement.style.left = '50%';
        countdownElement.style.transform = 'translate(-50%, -170%)';
        countdownElement.style.fontSize = '24px';
        countdownElement.style.fontWeight = 'bold';
        countdownElement.style.color = 'white';
        countdownElement.style.zIndex = '9999'; 
        document.body.appendChild(countdownElement);

        actionTimer = setInterval(function() {
            countdownValue -= 0.1;
            countdownElement.textContent = countdownValue.toFixed(1);
            if (countdownValue <= 0) {
                clearInterval(actionTimer);
                actionTimer = null;

                countdownElement.parentNode.removeChild(countdownElement);
            }
        }, 100);
    }




    //function handleMouseDown(event) {
    //    console.log('Mouse down event detected');
//
//        if (event.button === 0){
 //           var weaponSlot = document.getElementById('weapon-slot-4');
  //          if (weaponSlot.classList.contains('active')) {
   //             console.log('Starting action timer');
  //              startActionTimer();
   //         }
    //    }
   // }


   // function handleMouseUp(event) {
   //     console.log('Mouse up event detected');

    //    if (event.button === 0) {

    //        if (actionTimer) {
    //            console.log('Clearing action timer');
    //            clearInterval(actionTimer);
    //            actionTimer = null;

     //           if (countdownElement) {
     //               countdownElement.parentNode.removeChild(countdownElement);
     //               countdownElement = null;
     //           }
     //   }
  //  }

  //  window.addEventListener('mousedown', handleMouseDown);
    //window.addEventListener('mouseup', handleMouseUp);


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
        joinLink.style.marginLeft = '5px';
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




    modSettingsTabContent.appendChild(modSettingsContent);
    settingsTabsContainer.querySelector('#settings-tabs').appendChild(modSettingsTabContent);



//player info
    function togglePlayerInfo(enabled) {
        if (enabled) {
            var healthBarPercentageCopy = document.createElement('span');
            healthBarPercentageCopy.id = 'health-bar-percentage-copy';
            healthBarPercentageCopy.classList.add('unselectable');
            healthBarPercentageCopy.style.position = 'fixed';
            healthBarPercentageCopy.style.top = '50%';
            healthBarPercentageCopy.style.left = '46.2%';
            healthBarPercentageCopy.style.transform = 'translate(-50%, -50%)';
            healthBarPercentageCopy.style.fontSize = '20px';
            healthBarPercentageCopy.style.fontWeight = 'bold';

            function updateHealthBarPercentageCopy() {
                var healthBarPercentageValue = document.getElementById('health-bar-percentage').textContent;
                var healthBarColor = document.getElementById('health-bar').style.backgroundColor;

                healthBarPercentageCopy.textContent = healthBarPercentageValue + "➕";
                healthBarPercentageCopy.style.color = healthBarColor;
            }

            healthBarPercentageCopy.style.webkitTouchCallout = 'none'; /* iOS Safari */
            healthBarPercentageCopy.style.webkitUserSelect = 'none'; /* Safari */
            healthBarPercentageCopy.style.userSelect = 'none'; /* Standard syntax */

            updateHealthBarPercentageCopy();
            document.body.appendChild(healthBarPercentageCopy);

            var observer1 = new MutationObserver(updateHealthBarPercentageCopy);
            var targetNode1 = document.getElementById('health-bar-percentage');
            observer1.observe(targetNode1, { childList: true, subtree: true });

            var adrenalineBarPercentageCopy = document.createElement('span');
            adrenalineBarPercentageCopy.id = 'adrenaline-bar-percentage-copy';
            adrenalineBarPercentageCopy.classList.add('unselectable');
            adrenalineBarPercentageCopy.style.position = 'fixed';
            adrenalineBarPercentageCopy.style.top = '50%';
            adrenalineBarPercentageCopy.style.right = '46.2%';
            adrenalineBarPercentageCopy.style.transform = 'translate(50%, -50%)';
            adrenalineBarPercentageCopy.style.fontSize = '20px';
            adrenalineBarPercentageCopy.style.fontWeight = 'bold';

            function updateAdrenalineBarPercentageCopy() {
                var adrenalineBarPercentageValue = document.getElementById('adrenaline-bar-percentage').textContent;
                var adrenalineBarColor = document.getElementById('adrenaline-bar').style.backgroundColor;

                adrenalineBarPercentageCopy.textContent = adrenalineBarPercentageValue + "⚡";
                adrenalineBarPercentageCopy.style.color = adrenalineBarColor;
            }

            adrenalineBarPercentageCopy.style.webkitTouchCallout = 'none'; /* iOS Safari */
            adrenalineBarPercentageCopy.style.webkitUserSelect = 'none'; /* Safari */
            adrenalineBarPercentageCopy.style.userSelect = 'none'; /* Standard syntax */

            updateAdrenalineBarPercentageCopy();
            document.body.appendChild(adrenalineBarPercentageCopy);

            var observer2 = new MutationObserver(updateAdrenalineBarPercentageCopy);
            var targetNode2 = document.getElementById('adrenaline-bar-percentage');
            observer2.observe(targetNode2, { childList: true, subtree: true });
        } else {
          
            var healthBarPercentageCopy = document.getElementById('health-bar-percentage-copy');
            if (healthBarPercentageCopy) {
                healthBarPercentageCopy.parentNode.removeChild(healthBarPercentageCopy);
            }

            var adrenalineBarPercentageCopy = document.getElementById('adrenaline-bar-percentage-copy');
            if (adrenalineBarPercentageCopy) {
                adrenalineBarPercentageCopy.parentNode.removeChild(adrenalineBarPercentageCopy);
            }
        }
    }


    
    function createTextDistanceSlider() {
        var slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '-100'; 
        slider.max = '100';
        slider.value = '0'; 
        slider.id = 'textDistanceSlider';
        slider.style.position = 'fixed';
        slider.style.top = '26.2%'; 
        slider.style.left = 'auto'; 
        slider.style.right = '28.5%'; 
        slider.style.transform = 'translate(50%, -50%)';
        slider.style.width = '180px';
      
        slider.addEventListener('input', function() {
            var distance = this.value;
         
            var healthBarPercentageCopy = document.getElementById('health-bar-percentage-copy');
            var adrenalineBarPercentageCopy = document.getElementById('adrenaline-bar-percentage-copy');
            if (healthBarPercentageCopy && adrenalineBarPercentageCopy) {
                healthBarPercentageCopy.style.left = (46.2 + parseInt(distance)) + '%';
                adrenalineBarPercentageCopy.style.right = (46.2 + parseInt(distance)) + '%';
            }
        });

        return slider;
    }

    var modSettingsContent = document.getElementById('tab-mod-settings-content');
    if (modSettingsContent) {
        var slider = createTextDistanceSlider();
        modSettingsContent.appendChild(slider);
    }


//text colors
    function createToggleCustomTextColorSetting() {
        var toggleSetting = document.createElement('div');
        toggleSetting.className = 'modal-item';
        toggleSetting.style.marginBottom = '10px';
        toggleSetting.innerHTML = `
            <input type="checkbox" id="toggle-custom-text-color" ${localStorage.getItem('customTextColorEnabled') === 'true' ? 'checked' : ''}>
            <label for="text-color-picker" style="font-weight: bold; margin-left: 0px;">Text Color</label>
            <input type="color" id="text-color-picker" value="${localStorage.getItem('textColor') || '#ffffff'}" style="margin-left: -100px;">

        `;
        toggleSetting.querySelector('#toggle-custom-text-color').addEventListener('change', function() {
            updateCustomTextColorSetting(this.checked);
        });
        toggleSetting.querySelector('#text-color-picker').addEventListener('input', function() {
            updateTextColorSetting(this.value);
        });
        return toggleSetting;
    }

    function updateCustomTextColorSetting(enabled) {
        localStorage.setItem('customTextColorEnabled', enabled);
        if (enabled) {
            applyCustomTextColor();
        } else {
            disableCustomTextColor();
        }
    }

    function applyCustomTextColor() {
        var customTextColor = localStorage.getItem('textColor') || '#ffffff';
        applyTextColor(customTextColor);
    }

    function disableCustomTextColor() {
        var countElements = document.querySelectorAll('.item-count, #fps-counter, #coordinates-hud, #ping-counter');
        countElements.forEach(function(element) {
            element.style.color = ''; 
        });
    }

    function updateTextColorSetting(color) {
        localStorage.setItem('textColor', color);
        if (localStorage.getItem('customTextColorEnabled') === 'true') {
            applyCustomTextColor();
        }
    }

    function applyTextColor(color) {
        var countElements = document.querySelectorAll('.item-count');
        countElements.forEach(function(element) {
            element.style.color = color;
        });

        var fpsElement = document.getElementById('fps-counter');
        var coordsElement = document.getElementById('coordinates-hud');
        var pingElement = document.getElementById('ping-counter');

        if (fpsElement) {
            fpsElement.style.color = color;
        }

        if (coordsElement) {
            coordsElement.style.color = color;
        }

        if (pingElement) {
            pingElement.style.color = color;
        }
    }

    modSettingsContent.appendChild(createToggleCustomTextColorSetting());
    if (localStorage.getItem('customTextColorEnabled') === 'true') {
        applyCustomTextColor();
    }


    var playerInfoEnabled = localStorage.getItem('playerInfoEnabled') === 'true';
 
    togglePlayerInfo(playerInfoEnabled);

 
    function updatePlayerInfoSetting(enabled) {
        localStorage.setItem('playerInfoEnabled', enabled);
     
        togglePlayerInfo(enabled);
    }


    function createPlayerInfoSetting() {
        var playerInfoSetting = document.createElement('div');
        playerInfoSetting.className = 'modal-item checkbox-setting';
        playerInfoSetting.style.marginBottom = '10px';
        playerInfoSetting.innerHTML = `
        <label>
            <span class="setting-title" style="margin-right: 10px;">Info on Player</span>
            <input type="checkbox" id="toggle-player-info" ${playerInfoEnabled ? 'checked' : ''} style="margin-left: auto; margin-right: -0px; ">
        </label>
    `;
        playerInfoSetting.querySelector('#toggle-player-info').addEventListener('change', function() {
            updatePlayerInfoSetting(this.checked);
        });
        return playerInfoSetting;
    }

    modSettingsContent.appendChild(createPlayerInfoSetting());

//uncap fps
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
                <input type="checkbox" id="toggle-uncapped-fps" ${uncappedFPSEnabled ? 'checked' : ''} style="margin-left: auto; margin-right: -0px; ">
            </label>
        `;
        uncappedFPSSetting.querySelector('#toggle-uncapped-fps').addEventListener('change', function() {
            updateUncappedFPSSetting(this.checked);
        });
        return uncappedFPSSetting;
    }

    var gunSwitchDelayMap = {
        "AK-47": 400,
        "ARX-160": 400,
        "AUG": 400,
        "ACR": 400,
        "M3K": 700,
        "Model 37": 900,
        "HP18": 400,
        "Flues": 250,
        "Vepr-12": 650,
        "Mosin-Nagant": 900,
        "Tango 51": 900,
        "CZ-600": 600,
        "Barrett M95": 900,
        "M1895": 250,
        "G19": 250,
        "Radio": 250,
        "CZ-75A": 250,
        "SAF-200": 300,
        "M16A4": 400,
        "Micro Uzi": 300,
        "Vector": 300,
        "PP-19": 300,
        "MP40": 300,
        "MCX Spear": 400,
        "Lewis Gun": 400,
        "Stoner 63": 400,
        "MG5": 400,
        "Negev": 400,
        "MG36": 400,
        "M1 Garand": 400,
        "VSS": 400,
        "SR-25": 400,
        "Mini-14": 400,
        "Model 89": 400,
        "USAS-12": 400,
        "G17 (scoped)": 250,
        "Death Ray": 500,
        "Destroyer Of Worlds": 100
    };



    function startCountdownAbovePlayer(countdownValue) {
        var countdownElement = document.createElement('div');
        countdownElement.id = 'weapon-switch-countdown';
        countdownElement.textContent = countdownValue.toFixed(1);
        countdownElement.style.position = 'fixed';
        countdownElement.style.top = '45%';
        countdownElement.style.left = '50%';
        countdownElement.style.transform = 'translate(-50%, -170%)';
        countdownElement.style.fontSize = '24px';
        countdownElement.style.fontWeight = 'bold';
        countdownElement.style.color = 'white';
        countdownElement.style.zIndex = '9999';
        document.body.appendChild(countdownElement);

        var countdownTimer = setInterval(function() {
            countdownValue -= 0.1;
            countdownElement.textContent = countdownValue.toFixed(1);
            if (countdownValue <= 0) {
                clearInterval(countdownTimer);
                countdownElement.parentNode.removeChild(countdownElement);
            }
        }, 100);
    }

    var countdownActive1 = false;
    var countdownActive2 = false;
    var countdownInterval1;
    var countdownInterval2;
    var lastDetectionTimestamp = 0;

    function detectActiveWeaponAndStartCountdown() {

        var currentTimestamp = Date.now();

        if (currentTimestamp - lastDetectionTimestamp < 10) {
            return;
        }

        lastDetectionTimestamp = currentTimestamp;

        var weaponSlot1 = document.getElementById('weapon-slot-1');
        var weaponSlot2 = document.getElementById('weapon-slot-2');

        if (weaponSlot1 && weaponSlot1.classList.contains('active')) {
            var itemNameElement = weaponSlot1.querySelector('.item-name');
            if (itemNameElement) {
                var itemName = itemNameElement.textContent.trim();
                var switchDelay = gunSwitchDelayMap[itemName];
                if (switchDelay !== undefined) {
                    if (!countdownActive1) {
                        var countdownValue = switchDelay / 1000;
                        startCountdownAbovePlayer(countdownValue);
                        countdownActive1 = true;
                    } else {
                    }
                } else {
                }
            } else {
            }
        } else {
            countdownActive1 = false;
            clearInterval(countdownInterval1);
        }

        if (weaponSlot2 && weaponSlot2.classList.contains('active')) {
            var itemNameElement = weaponSlot2.querySelector('.item-name');
            if (itemNameElement) {
                var itemName = itemNameElement.textContent.trim();
                var switchDelay = gunSwitchDelayMap[itemName];
                if (switchDelay !== undefined) {
                    if (!countdownActive2) {
                        var countdownValue = switchDelay / 1000;
                        startCountdownAbovePlayer(countdownValue);
                        countdownActive2 = true;
                    } else {
                    }
                } else {
                }
            } else {
            }
        } else {
            countdownActive2 = false;
            clearInterval(countdownInterval2);
        }
    }

    setInterval(detectActiveWeaponAndStartCountdown, 1);

    function toggleSwitchDelay(enabled) {
        if (enabled) {
            document.addEventListener('click', detectActiveWeaponAndStartCountdown);
        } else {

            document.removeEventListener('click', detectActiveWeaponAndStartCountdown);
            var existingCountdownElement = document.getElementById('weapon-switch-countdown');
            if (existingCountdownElement) {
                existingCountdownElement.parentNode.removeChild(existingCountdownElement);
            }
        }
    }

    var switchDelayEnabled = localStorage.getItem('switchDelayEnabled') === 'true';


    toggleSwitchDelay(switchDelayEnabled);


    function updateSwitchDelaySetting(enabled) {
        localStorage.setItem('switchDelayEnabled', enabled);
        toggleSwitchDelay(enabled);
    }


    function createSwitchDelaySetting() {
        var switchDelaySetting = document.createElement('div');
        switchDelaySetting.className = 'modal-item checkbox-setting';
        switchDelaySetting.style.marginBottom = '10px';
        switchDelaySetting.innerHTML = `
    <label>
        <span class="setting-title" style="margin-right: 10px;">Enable switchDelay</span>
        <input type="checkbox" id="toggle-switch-delay" ${switchDelayEnabled ? 'checked' : ''} style="margin-left: auto; margin-right: -0px; ">
    </label>
`;
        switchDelaySetting.querySelector('#toggle-switch-delay').addEventListener('change', function() {
            updateSwitchDelaySetting(this.checked);
        });
        return switchDelaySetting;
    }

    var modSettingsContent = document.getElementById('tab-mod-settings-content');
    if (modSettingsContent) {
        modSettingsContent.appendChild(createSwitchDelaySetting());
    }



    modSettingsContent.appendChild(createUncappedFPSSetting());

    showKillCounter();
    addAdditionalUI();

    createUncappedFPSSetting()





    periodicallyShowKillCounter();
    document.addEventListener('DOMContentLoaded', addAdditionalUI);
    window.addEventListener('popstate', showKillCounter);
    replaceWithHeader();
})();