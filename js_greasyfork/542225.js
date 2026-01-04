// ==UserScript==
// @name Attack Better - modded for weapon selection
// @namespace https://github.com/0xymandias
// @version 1.8.2
// @description Move Torn "Start Fight" button on top of your weapon of choice and remove certain elements to help with load times. Edited by GFOUR to add weapon selection functionality.
// @author smokey_ [2492729] - edited by GFOUR [3498427]
// @match https://www.torn.com/loader.php?sid=attack*
// @grant none
// @license WTFPL

// @downloadURL https://update.greasyfork.org/scripts/542225/Attack%20Better%20-%20modded%20for%20weapon%20selection.user.js
// @updateURL https://update.greasyfork.org/scripts/542225/Attack%20Better%20-%20modded%20for%20weapon%20selection.meta.js
// ==/UserScript==

// Copyright © 2034 smokey_ [2492729] <relatii@sri.ro,>
// This work is free. You can redistribute it and/or modify it under the
// terms of the Do What The Fuck You Want To Public License, Version 2,
// as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.

(function () { 'use strict';

// Default setting - will be overridden by saved preference
let BUTTON_LOCATION = 'Temp';

// Load saved preference if available
if (localStorage.getItem('attackBetterWeaponChoice')) {
    BUTTON_LOCATION = localStorage.getItem('attackBetterWeaponChoice');
}

function addWeaponSelector() {
    const titleContainer = document.querySelector('.titleContainer___QrlWP');
    // Check if selector already exists to prevent duplicates
    if (!titleContainer || document.querySelector('.attack-better-selector')) return;

    const selectorContainer = document.createElement('div');
    selectorContainer.style.display = 'inline-block';
    selectorContainer.style.marginLeft = '10px';
    selectorContainer.style.fontSize = '12px';
    selectorContainer.style.verticalAlign = 'middle';
    selectorContainer.classList.add('attack-better-selector'); // Add class for identification

    const label = document.createElement('span');
    label.textContent = 'Attack Button: ';
    label.style.color = '#999';
    selectorContainer.appendChild(label);

    const selector = document.createElement('select');
    selector.style.backgroundColor = '#1a1a1a';
    selector.style.color = '#ccc';
    selector.style.border = '1px solid #444';
    selector.style.borderRadius = '3px';
    selector.style.padding = '2px 4px';
    selector.style.fontSize = '11px';

    const options = ['Primary', 'Secondary', 'Melee', 'Temp'];
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        if (opt === BUTTON_LOCATION) {
            option.selected = true;
        }
        selector.appendChild(option);
    });

    selector.addEventListener('change', function() {
        BUTTON_LOCATION = this.value;
        localStorage.setItem('attackBetterWeaponChoice', BUTTON_LOCATION);
        // Just reposition the button without removing it first
        moveStartFightButton();
    });

    selectorContainer.appendChild(selector);
    titleContainer.appendChild(selectorContainer);
}

function moveStartFightButton() {
    console.log('ATTACK BETTER - moveStartFightButton called for ' + BUTTON_LOCATION);
    let startFightButton, weaponImage, weaponWrapper;

    // Remove existing button wrapper if any
    const existingWrapper = document.querySelector('.button-wrapper');
    if (existingWrapper) {
        // Get the button before removing the wrapper
        startFightButton = existingWrapper.querySelector('.torn-btn.btn___RxE8_.silver');
        existingWrapper.remove();
    }

    // If we didn't get the button from the wrapper, try to find it in the DOM
    if (!startFightButton) {
        startFightButton = document.querySelector('.torn-btn.btn___RxE8_.silver');
    }

    // Find the target weapon elements
    if (BUTTON_LOCATION === 'Primary') {
        weaponImage = document.querySelector('.weaponImage___tUzwP img');
        weaponWrapper = document.querySelector('.weaponWrapper___h3buK');
    } else if (BUTTON_LOCATION === 'Secondary') {
        weaponImage = document.querySelector('#weapon_second .weaponImage___tUzwP img');
        weaponWrapper = document.querySelector('#weapon_second');
    } else if (BUTTON_LOCATION === 'Melee') {
        weaponImage = document.querySelector('#weapon_melee .weaponImage___tUzwP img');
        weaponWrapper = document.querySelector('#weapon_melee');
    } else if (BUTTON_LOCATION === 'Temp') {
        weaponImage = document.querySelector('#weapon_temp .weaponImage___tUzwP img');
        weaponWrapper = document.querySelector('#weapon_temp');
    }

    if (startFightButton && weaponImage && weaponWrapper) {
        console.log('ATTACK BETTER - All elements found');

        const buttonWrapper = document.createElement('div');
        buttonWrapper.classList.add('button-wrapper');
        buttonWrapper.appendChild(startFightButton);
        weaponWrapper.insertBefore(buttonWrapper, weaponImage.nextSibling);

        buttonWrapper.style.position = 'absolute';
        buttonWrapper.style.top = weaponImage.offsetTop + 'px';
        buttonWrapper.style.left = '+15px';
        startFightButton.addEventListener('click', function() {
            buttonWrapper.remove();
            console.log('ATTACK BETTER - Start fight button removed');
        });
    } else {
        console.log('ATTACK BETTER - Missing elements:', {
            startFightButton: !!startFightButton,
            weaponImage: !!weaponImage,
            weaponWrapper: !!weaponWrapper
        });
    }
}

// Wait for elements to load
let loopCount = 0;
const buttonIntervalId = setInterval(function () {
    loopCount++;
    if (loopCount > 20) { // stop the loop after 5s (20 loops * 250ms per loop = 5s)
        clearInterval(buttonIntervalId);
        console.log('ATTACK BETTER - Loop stopped');
        return;
    }

    // Add the weapon selector if title container exists and selector doesn't exist yet
    if (document.querySelector('.titleContainer___QrlWP') && !document.querySelector('.attack-better-selector')) {
        addWeaponSelector();
    }

    moveStartFightButton();
    if (document.querySelector('.button-wrapper')) { // check if the button has been moved
        clearInterval(buttonIntervalId);
        console.log('ATTACK BETTER - Start fight button moved');
    }
}, 250);

// Wait for page to load before executing this part of the script
window.addEventListener('load', function () {
    console.log('ATTACK BETTER - Page loaded');

    //
    // Element Stripping
    //

    // get the custom-bg-desktop sidebar-off element
    const sidebarElement = document.querySelector('.custom-bg-desktop.sidebar-off');

    // if the element exists, remove it from the DOM to prevent it from being downloaded or loaded
    if (sidebarElement) {
        sidebarElement.remove();
        console.log('ATTACK BETTER - background removed.');
    }
});

// Defender Model
var startTimeDefender = Date.now();
var intervalIdDefender = setInterval(function() {
    if (Date.now() - startTimeDefender > 5000) {
        clearInterval(intervalIdDefender);
        return;
    }

    var defenderModel = document.querySelectorAll("#defender > div.playerArea___oG4xu > div.playerWindow___FvmHZ > div > div.modelLayers___FdSU_.center___An_7Z > div.modelWrap___j3kfA *");

    for (const element of defenderModel) {
        element.remove();
    }
}, 100);

// Attacker Model
var startTimeAttacker = Date.now();
var intervalIdAttacker = setInterval(function() {
    if (Date.now() - startTimeAttacker > 5000) {
        clearInterval(intervalIdAttacker);
        return;
    }

    var attackerModel = document.querySelectorAll("#attacker > div.playerArea___oG4xu > div.playerWindow___FvmHZ > div.allLayers___cXY5i > div.modelLayers___FdSU_.center___An_7Z > div.modelWrap___j3kfA *");

    for (const element of attackerModel) {
        element.remove();
    }
}, 100);

})();
