// ==UserScript==
// @name         Notification and Click Event on 'shows' URL
// @namespace    JohnStyleZ
// @version      1.0
// @description  Display a notification when the URL contains 'shows' and bring the browser to the front on notification click
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469383/Notification%20and%20Click%20Event%20on%20%27shows%27%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/469383/Notification%20and%20Click%20Event%20on%20%27shows%27%20URL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.includes('shows')) {
        const message = 'We are in!'; // Customize the message as per your preference

        if ('Notification' in window) {
            // Check if browser supports notifications
            if (Notification.permission === 'granted') {
                // If permission is granted, show the notification
                showNotification(message);
            } else if (Notification.permission !== 'denied') {
                // If permission is not denied, request permission and show the notification
                Notification.requestPermission().then(function(permission) {
                    if (permission === 'granted') {
                        showNotification(message);
                    }
                });
            }
        } else {
            // If browser doesn't support notifications, fallback to alert
            alert(message);
        }
    }

    function showNotification(message) {
        const notification = new Notification(message);

        notification.onclick = function() {
            // Bring the browser window to the front
            window.focus();
            this.close();
        };
    }
})();
