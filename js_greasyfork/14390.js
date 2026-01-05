// ==UserScript==
// @name        Energy to Next Gym 
// @namespace   RGiskard.energyToNextGym
// @author      RGiskard [1953860]
// @maintained  RGiskard [1953860]
// @description Calculates the energy needed before the player unlocks the next gym, accurate to discrete percentage values
// @include     *.torn.com/gym.php*
// @version     1.0.0
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/14390/Energy%20to%20Next%20Gym.user.js
// @updateURL https://update.greasyfork.org/scripts/14390/Energy%20to%20Next%20Gym.meta.js
// ==/UserScript==

'use strict';

this.$ = this.jQuery = jQuery.noConflict(true);

var $gymDisplayPanel = $('#gym_content_right');

setObserver();

/**
 * Use an observer to determine when the relevant portions of the page have loaded completely.
 */
function setObserver() {
    try {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    showEnergyToNextGym();
                }
            });
        });

        // start listening for changes
        var observerTarget = $gymDisplayPanel[0];
        var observerConfig = { attributes: false, childList: true, characterData: false };
        observer.observe(observerTarget, observerConfig);
    } catch (err) {
        console.log(err);
    }
}



/**
 * Calculates and displays the energy needed to move up to the next gym
 * at the given percentage completion of the current gym.
 */
function showEnergyToNextGym() {
    // Note: there is a core-progress-title class div in each of the four gym types, but they're all the same, so the first will do.
    var $nextGymName = $gymDisplayPanel.find('div.core-progress-title')[0].textContent.match(/Progress to unlocking (.+)\.\.\./)[1];    
    var $totalEnergyToNextGym = getTotalEnergyRequiredForNextGym($nextGymName);
    
    var $percentComplete = 0;
    var $percentCompleteDiv = $gymDisplayPanel.find('div.bar-green-wrap-d');
    if ($percentCompleteDiv) {
        $percentComplete = parseFloat($percentCompleteDiv[0].title);
    }
    
    var $remainingEnergyToNextGym = $totalEnergyToNextGym - ($totalEnergyToNextGym * $percentComplete / 100);
    if ($remainingEnergyToNextGym < 0) {
        // Error case.
        $remainingEnergyToNextGym = 'unknown';
    } else {
        // Don't do this earlier so we can still see the error case.
        $remainingEnergyToNextGym = Math.round($remainingEnergyToNextGym);
    }

    // Add the remaining energy to the bottom of each ui-tabs-panel class div.
    var $gymInfoPanels = $('div.ui-tabs-panel');
    for (var $i = 0; $i < $gymInfoPanels.size(); $i++) {
        var $energyToNextGymDiv = document.createElement('div');
        $energyToNextGymDiv.className = 'core-progress-title m-top10 t-white';
        $energyToNextGymDiv.textContent = 'Approx energy to next gym: ' + $remainingEnergyToNextGym;
        $gymInfoPanels[$i].children[1].appendChild($energyToNextGymDiv)
    }
}

/**
 * Gets the total energy required (from 0%) to advance from the gym prior to the passed
 * gym. Since the current gym is not necessarily reliably available, this is and is
 * an acceptable substitute.
 * @param {string} $nextGymName the name of the next gym
 * @returns the amount of energy necessary to advance to the gym name, -1 if unknown
 */
function getTotalEnergyRequiredForNextGym($nextGymName) {
    if ("Average Joes".toUpperCase() == $nextGymName.toUpperCase()) {
        return 200;
    } else if ("Woody's Workout".toUpperCase() == $nextGymName.toUpperCase()) {
        return 500;
    } else if ("Beach Bods".toUpperCase() == $nextGymName.toUpperCase()) {
        return 1000;
    } else if ("Silver Gym".toUpperCase() == $nextGymName.toUpperCase()) {
        return 2000;
    } else if ("Pour Femme".toUpperCase() == $nextGymName.toUpperCase()) {
        return 2750;
    } else if ("Davies Den".toUpperCase() == $nextGymName.toUpperCase()) {
        return 3000;
    } else if ("Global Gym".toUpperCase() == $nextGymName.toUpperCase()) {
        return 3500;
    } else if ("Knuckle Heads".toUpperCase() == $nextGymName.toUpperCase()) {
        return 4000;
    } else if ("Pioneer Fitness".toUpperCase() == $nextGymName.toUpperCase()) {
        return 6000;
    } else if ("Anabolic Anomalies".toUpperCase() == $nextGymName.toUpperCase()) {
        return 7000;
    } else if ("Core".toUpperCase() == $nextGymName.toUpperCase()) {
        return 8000;
    } else if ("Racing Fitness".toUpperCase() == $nextGymName.toUpperCase()) {
        return 11000;
    } else if ("Complete Cardio".toUpperCase() == $nextGymName.toUpperCase()) {
        return 12420;
    } else if ("Legs, Bums and Tums".toUpperCase() == $nextGymName.toUpperCase()) {
        return 18000;
    } else if ("Deep Burn".toUpperCase() == $nextGymName.toUpperCase()) {
        return 18100;
    } else if ("Apollo Gym".toUpperCase() == $nextGymName.toUpperCase()) {
        return 24140;
    } else if ("Gun Shop".toUpperCase() == $nextGymName.toUpperCase()) {
        return 31260;
    } else if ("Force Training".toUpperCase() == $nextGymName.toUpperCase()) {
        return 36610;
    } else if ("Cha Cha's".toUpperCase() == $nextGymName.toUpperCase()) {
        return 46640;
    } else if ("Atlas".toUpperCase() == $nextGymName.toUpperCase()) {
        return 56520;
    } else if ("Last Round".toUpperCase() == $nextGymName.toUpperCase()) {
        return 67775;
    } else if ("The Edge".toUpperCase() == $nextGymName.toUpperCase()) {
        return 84535;
    } else if ("George's".toUpperCase() == $nextGymName.toUpperCase()) {
        return 106305;
    }
    return -1;
}
