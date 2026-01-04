// ==UserScript==
// @name         Attack Better - modified
// @namespace    https://github.com/0xymandias
// @version      1.7.1
// @description  Move Torn "Start Fight" button on top of your weapon of choice and remove certain elements to help with load times. Modified to add leave, mug, hosp button moving. Original by smokey
// @author       smokey_ [2492729]
// @match        https://www.torn.com/loader.php?*
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/537307/Attack%20Better%20-%20modified.user.js
// @updateURL https://update.greasyfork.org/scripts/537307/Attack%20Better%20-%20modified.meta.js
// ==/UserScript==

// Copyright © 2034 smokey_ [2492729] <relatii@sri.ro,>
// This work is free. You can redistribute it and/or modify it under the
// terms of the Do What The Fuck You Want To Public License, Version 2,
// as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.

(function () {
    'use strict';

    const BUTTON_LOCATION = 'Primary'; // Change this value to 'Temp' to move the button to the Temp (HEG, Tear, Smoke) or Primary to move it ontop of the Primary Weapon element or Secondary or Melee
    const FINISH_TYPE = 'Leave' // Change this value to 'Leave', 'Mug' or 'Hospitalize'

    function moveEndFightButton() {
        console.log('ATTACK BETTER - moveEndFightButton called');
        let endFightButton, weaponImage, weaponWrapper;

        if (BUTTON_LOCATION === 'Primary') {
            weaponImage = document.querySelector('.weaponImage___tUzwP img'); // equipped weapon image
            weaponWrapper = document.querySelector('.weaponWrapper___h3buK'); // common parent element

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

        if (FINISH_TYPE == 'Leave') {
            endFightButton = document.querySelector('.dialogButtons___nX4Bz button:nth-of-type(1)');

        } else if (FINISH_TYPE == 'Mug') {
            endFightButton = document.querySelector('.dialogButtons___nX4Bz button:nth-of-type(2)');

        } else if (FINISH_TYPE == 'Hospitalize') {
            endFightButton = document.querySelector('.dialogButtons___nX4Bz button:nth-of-type(3)');

        }

        console.log('ATTACK BETTER - endFightButton')

        if (endFightButton) {
            console.log('end button found');
            const endFightButtonWrapper = document.createElement('div');
            endFightButtonWrapper.classList.add('end-wrapper');
            endFightButtonWrapper.appendChild(endFightButton);
            weaponWrapper.insertBefore(endFightButtonWrapper, weaponImage.nextSibling);
            console.log('ATTACK BETTER - endFightButtonWrapper', endFightButtonWrapper);
            
            endFightButtonWrapper.style.position = 'absolute';
            endFightButtonWrapper.style.top = weaponImage.offsetTop + 'px';
            endFightButtonWrapper.style.left = '+15px';
            endFightButtonWrapper.addEventListener('click', function() {
                endFightButtonWrapper.remove();
                console.log('ATTACK BETTER - End fight button removed');
            });
        }
        return endFightButton;
    }
    function moveStartFightButton() {
        console.log('ATTACK BETTER - moveStartFightButton called');
        let startFightButton, weaponImage, weaponWrapper;

        if (BUTTON_LOCATION === 'Primary') {
            startFightButton = document.querySelector('.torn-btn.btn___RxE8_.silver'); // start fight button
            weaponImage = document.querySelector('.weaponImage___tUzwP img'); // equipped weapon image
            weaponWrapper = document.querySelector('.weaponWrapper___h3buK'); // common parent element

        } else if (BUTTON_LOCATION === 'Secondary') {
            startFightButton = document.querySelector('.torn-btn.btn___RxE8_.silver');
            weaponImage = document.querySelector('#weapon_second .weaponImage___tUzwP img');
            weaponWrapper = document.querySelector('#weapon_second');

        } else if (BUTTON_LOCATION === 'Melee') {
            startFightButton = document.querySelector('.torn-btn.btn___RxE8_.silver');
            weaponImage = document.querySelector('#weapon_melee .weaponImage___tUzwP img');
            weaponWrapper = document.querySelector('#weapon_melee');
            
        } else if (BUTTON_LOCATION === 'Temp') {
            startFightButton = document.querySelector('.torn-btn.btn___RxE8_.silver');
            weaponImage = document.querySelector('#weapon_temp .weaponImage___tUzwP img');
            weaponWrapper = document.querySelector('#weapon_temp');    
        }

        console.log('ATTACK BETTER - startFightButton', startFightButton);
        console.log('ATTACK BETTER - weaponImage', weaponImage);
        console.log('ATTACK BETTER - weaponWrapper', weaponWrapper);

        if (startFightButton && weaponImage && weaponWrapper) {
            console.log('all elements found');
            const buttonWrapper = document.createElement('div'); // create new div element
            buttonWrapper.classList.add('button-wrapper');
            buttonWrapper.appendChild(startFightButton); // append start fight button to new div element
            weaponWrapper.insertBefore(buttonWrapper, weaponImage.nextSibling); // insert new div element after equipped weapon image
            console.log('ATTACK BETTER - buttonWrapper', buttonWrapper);

            // Position the button wrapper over the weapon image
            buttonWrapper.style.position = 'absolute';
            buttonWrapper.style.top = weaponImage.offsetTop + 'px';
            buttonWrapper.style.left = '+15px'; // set left position to move it to the left
            startFightButton.addEventListener('click', function() {
                buttonWrapper.remove();
                console.log('ATTACK BETTER - Start fight button removed');
            });
        }
    }

    let loopCount = 0;
    const buttonIntervalId = setInterval(function () {
        loopCount++;
        if (loopCount > 5) { // stop the loop after 5s (20 loops * 250ms per loop = 5s)
            clearInterval(buttonIntervalId);
            console.log('ATTACK BETTER - Loop stopped');
            return;
        }
        moveStartFightButton();
        if (document.querySelector('.button-wrapper')) { // check if the button has been moved
            clearInterval(buttonIntervalId);
            console.log('ATTACK BETTER - Start fight button moved');
        }
    }, 250);

    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('.end-wrapper')) {
            console.log('ATTACK BETTER - End fight button found via observer');
            obs.disconnect(); // stop observing
        } else {
            moveEndFightButton();
        }
    });

observer.observe(document.body, { childList: true, subtree: true });
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
    })

    // Defender Model
    var startTimeDefender = Date.now();
    var intervalIdDefender = setInterval(function() {
        if (Date.now() - startTimeDefender > 5000) {
            clearInterval(intervalIdDefender);
            return;
        }

        var defenderModel = document.querySelectorAll("#defender > div.playerArea___oG4xu > div.playerWindow___FvmHZ > div > div.modelLayers___FdSU_.center___An_7Z > div.modelWrap___j3kfA *");

        for (const element of defenderModel) {
            console.log(`ATTACK BETTER - Removing element: ${element.tagName}`);
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
            console.log(`ATTACK BETTER - Removing element: ${element.tagName}`);
            element.remove();
        }
    }, 100);
})();