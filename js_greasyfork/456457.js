// ==UserScript==
// @name         Label Notifier
// @namespace    LabelMonitor
// @version      1.0
// @description  Sends a notification when a <label> element has a value of 0
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456457/Label%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/456457/Label%20Notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select all label elements on the page
    const labels = document.querySelectorAll("label");

    // Iterate over each label
    labels.forEach(label => {
        // Check if the label has a value of 0
        if (label.value === 0) {
            // Send a notification to the user's device with the URL of the webpage
            sendNotification(`The label "${label.innerText}" has a value of 0 on ${window.location.href}`);
        }
    });

    // Function to send a notification to the user's device
    function sendNotification(message) {
        if (window.Notification && Notification.permission === "granted") {
            new Notification(message);
        }
    }
})();
