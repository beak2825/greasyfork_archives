// ==UserScript==
// @name         Torn City Chain Watch Alert
// @namespace    allyabi
// @version      1.2
// @description  Alert when chain timer drops below user-defined threshold. Adapted from Fu11y's chain watch script last updated Oct 27, 2023.
// @author       allyabi
// @match        https://www.torn.com/page.php?sid=list&type=targets
// @exclude      https://www.torn.com/preferences.php*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537696/Torn%20City%20Chain%20Watch%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/537696/Torn%20City%20Chain%20Watch%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Selectable alert thresholds in seconds
    const alertThresholds = [0, 60, 90, 120, 150, 180];

    let previousStateBelowThreshold = false;
    let alertedForCurrentThreshold = false;
    let alertThresholdInSeconds = parseInt(localStorage.getItem('tc_cw_alertThreshold'));
    if(alertThresholdInSeconds === null) alertThresholdInSeconds = alertThresholds[0];
    let mute = localStorage.getItem('tc_cw_mute') == 'false' ? false : true;

    //Create the audio tag
    let soundFile = document.createElement("audio");
    soundFile.preload = "auto";
    //Load the sound file (using a source element for expandability)
    let src = document.createElement("source");
    src.src = 'https://www.torn.com/audio/chat/Click_1.mp3';
    soundFile.appendChild(src);
    soundFile.load();
    soundFile.volume = 1.000000;

    function play() {
        if(!mute) {
            soundFile.currentTime = 0.01;
            soundFile.play();
        }
    }

    let myInterval;
    let checkInterval = null;

    function createDropdown() {
        const userlist = document.getElementById('users-list-root');
        const mydiv = document.createElement('div');
        const dropdown = document.createElement('select');
        const dropdownLabel = document.createElement('label');
        const checkbox = document.createElement('input');
        const checkboxLabel = document.createElement('label');
        const testButton = document.createElement('input');

        dropdown.id = 'chainTimerDropdown';
        alertThresholds.forEach(seconds => {
            const option = document.createElement('option');
            option.value = seconds;
            if(seconds > 0) option.textContent = `${seconds / 60} minutes`;
            else option.textContent = 'Disabled';
            dropdown.appendChild(option);
        });
        dropdown.value = alertThresholdInSeconds;
        dropdown.addEventListener('change', (e) => {
            alertThresholdInSeconds = parseInt(e.target.value);
            localStorage.setItem('tc_cw_alertThreshold', alertThresholdInSeconds);
            alertedForCurrentThreshold = false; // Reset the alert state when threshold changes
            window.clearInterval(myInterval);
            if(alertThresholdInSeconds == 0) {
                window.clearInterval(checkInterval);
                checkInterval = null;
            } else if(checkInterval === null) {
                checkInterval = setInterval(checkChainTimer, 2000);
            }
        });

        checkbox.id = 'chainTimerCheckbox';
        checkbox.type = 'checkbox';
        checkbox.checked = mute;
        checkbox.addEventListener('change', function() {
            mute = this.checked;
            localStorage.setItem('tc_cw_mute', mute);
        });

        testButton.type = 'button';
        testButton.value = 'Test Alert';
        testButton.onclick = function() {
            setTimeout(function() {alert('Test alert')}, 1000);
        };
        testButton.style.padding = '2px 5px';
        testButton.style.marginLeft = '1.2em';

        dropdownLabel.htmlFor = 'chainTimerDropdown';
        dropdownLabel.innerHTML = '<b>ChainWatch Alert Threshold: </b>';
        checkboxLabel.htmlFor = 'chainTimerCheckbox';
        checkboxLabel.innerHTML = '<b> ChainWatch Mute: </b>';
        checkboxLabel.style.marginLeft = '1em';

        mydiv.append(dropdownLabel);
        mydiv.append(dropdown);
        mydiv.append(checkboxLabel);
        mydiv.append(checkbox);
        mydiv.append(testButton);
        userlist.prepend(mydiv);
    }

    function checkChainTimer() {
        const timerElement = document.querySelector('.bar-timeleft___B9RGV');

        if (timerElement) {
            const timerText = timerElement.textContent.trim();
            const timeParts = timerText.split(':');
            const minutes = parseInt(timeParts[0], 10);
            const seconds = parseInt(timeParts[1], 10);
            const totalTimeInSeconds = (minutes * 60) + seconds;

            if (totalTimeInSeconds < alertThresholdInSeconds && totalTimeInSeconds > 0) {
                if (!alertedForCurrentThreshold) {
                    alert(`Chain timer is below ${alertThresholdInSeconds / 60} minutes!`);
                    alertedForCurrentThreshold = true;
                    myInterval = setInterval(play, 1000);
                }
                previousStateBelowThreshold = true;
            } else if (totalTimeInSeconds >= alertThresholdInSeconds) {
                previousStateBelowThreshold = false;
                alertedForCurrentThreshold = false; // Reset the alert state when timer goes back above threshold
                window.clearInterval(myInterval);
            }
        }
    }

    createDropdown();
    if(alertThresholdInSeconds != 0) {
        checkInterval = setInterval(checkChainTimer, 2000);
    }
})();
