// ==UserScript==
// @name         Device Battery Status
// @namespace    http://rylogixstudios.com
// @version      1.0
// @description  Displays the device's battery percentage and changes color based on battery level at the bottom right corner of the screen.
// @author       Rylogix
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487128/Device%20Battery%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/487128/Device%20Battery%20Status.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container for displaying battery status
    var batteryContainer = document.createElement('div');
    batteryContainer.id = 'battery-status';
    batteryContainer.style.position = 'fixed';
    batteryContainer.style.bottom = '10px';
    batteryContainer.style.right = '10px';
    batteryContainer.style.color = '#ffffff';
    batteryContainer.style.fontFamily = 'Arial, sans-serif';
    batteryContainer.style.fontSize = '16px';
    batteryContainer.style.padding = '5px 10px';
    batteryContainer.style.background = 'rgba(0, 0, 0, 0.5)';
    batteryContainer.style.borderRadius = '5px';
    batteryContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    batteryContainer.style.zIndex = '9999'; // Set a high z-index to keep it in front
    document.body.appendChild(batteryContainer);

    // Function to update battery status
    function updateBatteryStatus() {
        navigator.getBattery().then(function(battery) {
            var percentage = Math.floor(battery.level * 100);
            batteryContainer.textContent = 'Battery: ' + percentage + '%';

            // Change color based on battery level
            if (percentage < 20) {
                batteryContainer.style.color = 'yellow';
            } else if (percentage < 10) {
                batteryContainer.style.color = 'red';
            } else {
                batteryContainer.style.color = '#ffffff'; // Default color
            }
        });
    }

    // Update battery status initially
    updateBatteryStatus();

    // Listen for battery status change events
    navigator.getBattery().then(function(battery) {
        battery.addEventListener('levelchange', updateBatteryStatus);
    });
})();
