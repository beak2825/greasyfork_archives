// ==UserScript==
// @name         Torn City Chain Watcher
// @namespace    https://github.com/JadAlWazzan
// @version      0.1.2
// @description  Check Chain Timer and alert when timer falls below set time. Also toggle to dim screen at work.
// @author       Nurv[669537]
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/*
// @grant        none
// @license      Jcodes
// @downloadURL https://update.greasyfork.org/scripts/478663/Torn%20City%20Chain%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/478663/Torn%20City%20Chain%20Watcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let previousStateBelowThreshold = false;
    let alertedForCurrentThreshold = false;
    let alertThresholdInSeconds = parseInt(localStorage.getItem('alertThreshold')) || 240; // Default to 4 minutes
    let screenVisibility = localStorage.getItem('screenVisibility') || 'show'; // Default to 'show'
    let timerInterval;

    function createDropdown() {
        // Create dropdowns for alert threshold and screen visibility
        const chainTimerDropdown = document.createElement('select');
        chainTimerDropdown.id = 'chainTimerDropdown';
        [90, 120, 150, 180, 210, 240, 270].forEach(seconds => {
            const option = document.createElement('option');
            option.value = seconds;
            option.textContent = `${seconds / 60} minutes`;
            chainTimerDropdown.appendChild(option);
        });

        chainTimerDropdown.value = alertThresholdInSeconds;
        chainTimerDropdown.addEventListener('change', (e) => {
            alertThresholdInSeconds = parseInt(e.target.value);
            localStorage.setItem('alertThreshold', alertThresholdInSeconds);
            alertedForCurrentThreshold = false; // Reset the alert state when the threshold changes
        });

        const screenVisibilityDropdown = document.createElement('select');
        screenVisibilityDropdown.id = 'screenVisibilityDropdown';

        // Add options for show and hide
        const showOption = document.createElement('option');
        showOption.value = 'show';
        showOption.textContent = 'Show Screen';
        screenVisibilityDropdown.appendChild(showOption);

        const hideOption = document.createElement('option');
        hideOption.value = 'hide';
        hideOption.textContent = 'Hide Screen';
        screenVisibilityDropdown.appendChild(hideOption);

        screenVisibilityDropdown.value = screenVisibility;
        screenVisibilityDropdown.addEventListener('change', (e) => {
            screenVisibility = e.target.value;
            localStorage.setItem('screenVisibility', screenVisibility);
            toggleScreenVisibility();
        });

        // Styles for the timer box
        const timerBox = document.createElement('div');
        timerBox.id = 'timerBox';
        timerBox.style.position = 'fixed';
        timerBox.style.top = '80px'; // Adjust the top position to go under the toggles
        timerBox.style.left = '95%';
        timerBox.style.transform = 'translateX(-50%)';
        timerBox.style.backgroundColor = 'white';
        timerBox.style.color = 'black';
        timerBox.style.padding = '10px';
        timerBox.style.zIndex = '10001'; // Place the timer box above everything
        timerBox.style.display = 'none'; // Initially hide the timer box

        // Add a style for larger font size
        timerBox.style.fontSize = '20px'; // You can adjust the size as needed

        // Styles for the dropdowns
        chainTimerDropdown.style.position = 'fixed';
        chainTimerDropdown.style.top = '10px';
        chainTimerDropdown.style.right = '10px';
        chainTimerDropdown.style.zIndex = '10000'; // Ensure it's above other page content

        screenVisibilityDropdown.style.position = 'fixed';
        screenVisibilityDropdown.style.top = '40px'; // Adjust the top position to avoid overlap
        screenVisibilityDropdown.style.right = '10px';
        screenVisibilityDropdown.style.zIndex = '10000';

        // Append elements to the body
        document.body.appendChild(chainTimerDropdown);
        document.body.appendChild(screenVisibilityDropdown);
        document.body.appendChild(timerBox);

        toggleScreenVisibility();
    }

    function toggleScreenVisibility() {
    if (screenVisibility === 'hide') {
        // Clear the timer interval
        clearInterval(timerInterval);

        // Fetch the timer
        const timerElement = document.querySelector('.bar-timeleft___B9RGV');
        if (timerElement) {
            // Show the timer box
            const timerBox = document.getElementById('timerBox');
            timerBox.style.display = 'block';

            // Create a function to update the timer
            function updateTimer() {
                const timerText = timerElement.textContent.trim();
                timerBox.textContent = timerText;
            }
            // Initially update the timer
            updateTimer();
            // Update the timer every second
            timerInterval = setInterval(updateTimer, 1000);
        }

        // Apply styles to dim the screen, excluding the timer box and toggles
        const elementsToDim = document.querySelectorAll('body > *:not(#timerBox, #chainTimerDropdown, #screenVisibilityDropdown)');
        elementsToDim.forEach(element => {
            element.style.backgroundColor = 'black';
            element.style.opacity = '0';
        });

        // Make dropdowns more visible
        document.getElementById('chainTimerDropdown').style.opacity = '1';
        document.getElementById('screenVisibilityDropdown').style.opacity = '1';
    } else {
        // Clear the timer interval
        clearInterval(timerInterval);

        // Restore default styles for dimmed elements
        const elementsToDim = document.querySelectorAll('body > *:not(#timerBox, #chainTimerDropdown, #screenVisibilityDropdown)');
        elementsToDim.forEach(element => {
            element.style.backgroundColor = '';
            element.style.opacity = '1';
        })

        // Hide the timer box
        const timerBox = document.getElementById('timerBox');
        timerBox.style.display = 'none';
    }
}

    function checkChainTimer() {
        const timerElement = document.querySelector('.bar-timeleft___B9RGV');

        if (timerElement) {
            const timerText = timerElement.textContent.trim();
            const timeParts = timerText.split(':');
            const minutes = parseInt(timeParts[0], 10);
            const seconds = parseInt(timeParts[1], 10);
            const totalTimeInSeconds = (minutes * 60) + seconds;

            if (totalTimeInSeconds < alertThresholdInSeconds) {
                if (!alertedForCurrentThreshold) {
                    alert(`Chain timer is below ${alertThresholdInSeconds / 60} minutes!`);
                    alertedForCurrentThreshold = true;
                }
                flashScreenRed();
                previousStateBelowThreshold = true;
            } else if (totalTimeInSeconds >= alertThresholdInSeconds) {
                previousStateBelowThreshold = false;
                alertedForCurrentThreshold = false; // Reset the alert state when the timer goes back above the threshold
            }
        }
    }

    function flashScreenRed() {
        const flashDiv = document.createElement('div');
        flashDiv.style.position = 'fixed';
        flashDiv.style.top = '0';
        flashDiv.style.left = '0';
        flashDiv.style.width = '100vw';
        flashDiv.style.height = '100vh';
        flashDiv.style.backgroundColor = 'red';
        flashDiv.style.opacity = '0.4';
        flashDiv.style.zIndex = '10001'; // Place the flash above everything

        document.body.appendChild(flashDiv);

        setTimeout(() => {
            flashDiv.remove();
        }, 1000); // Flash for 1 second
    }

    createDropdown();
    setInterval(checkChainTimer, 2000);

    // Add an event listener to update the timer when the page loads
    document.addEventListener('DOMContentLoaded', toggleScreenVisibility);
})();