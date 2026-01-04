// ==UserScript==
// @name         Blubbled's UI Mod v1
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Adds some QoL features, such as always showing kill count, green health bar, etc
// @author       Blubbled
// @match        https://suroi.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493873/Blubbled%27s%20UI%20Mod%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/493873/Blubbled%27s%20UI%20Mod%20v1.meta.js
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

        var redValue = Math.round(255 - (percentage * 2.55));
        var greenValue = Math.round(percentage * 2.55);


        healthBar.style.backgroundColor = 'rgb(' + redValue + ',' + greenValue + ',0)';
    }


    showKillCounter();
    addAdditionalUI();
    updateHealthBarColor();


    var healthPercentage = document.getElementById('health-bar-percentage');
    healthPercentage.addEventListener('DOMSubtreeModified', updateHealthBarColor);


    periodicallyShowKillCounter();

    document.addEventListener('DOMContentLoaded', addAdditionalUI);


    window.addEventListener('popstate', showKillCounter);

    replaceWithHeader();
})();