// ==UserScript==
// @name         Battery Notifier for chrome on google/bing
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Notify when battery reaches low
// @author       Grok
// @match        https://www.bing.com/*
// @match        https://www.google.com/*
// @match        *://*.microsoft.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529797/Battery%20Notifier%20for%20chrome%20on%20googlebing.user.js
// @updateURL https://update.greasyfork.org/scripts/529797/Battery%20Notifier%20for%20chrome%20on%20googlebing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if Battery API is supported
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            // Initial check
            checkBatteryLevel(battery.level);

            // Listen for battery level changes
            battery.addEventListener('levelchange', function() {
                checkBatteryLevel(battery.level);
            });
        });
    } else {
        console.log('Battery Status API not supported');
        return;
    }

    function checkBatteryLevel(level) {
        // Convert level to percentage
        const percentage = Math.round(level * 100);

        // Check if battery is at or below percent
        if (percentage <= 35) {
            // Create notification
            showNotification(percentage);
        }
    }

    function showNotification(percentage) {
        // Check if Notification API is supported
        if ('Notification' in window) {
            // Request permission if not already granted
            if (Notification.permission !== 'granted') {
                Notification.requestPermission();
            }

            if (Notification.permission === 'granted') {
                new Notification('Battery Warning', {
                    body: `Arey azaamu, battery ${percentage}%! maatrame undi, please charging pettu rarey!!`,
                    icon: 'https://cdn-icons-png.flaticon.com/512/3103/3103446.png'
                });
            }
        }
    }

    // Check battery every 5 minutes as a fallback
    setInterval(function() {
        navigator.getBattery().then(function(battery) {
            checkBatteryLevel(battery.level);
        });
    }, 300000);
})();
