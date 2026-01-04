// ==UserScript==
// @name         Keep Microsoft Teams Active
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Keeps your Microsoft Teams status active
// @author       DrDavidReed
// @match        https://teams.microsoft.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530675/Keep%20Microsoft%20Teams%20Active.user.js
// @updateURL https://update.greasyfork.org/scripts/530675/Keep%20Microsoft%20Teams%20Active.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Teams Auto Active Script is running...");

    // Config: how often to trigger activity (in milliseconds)
    const intervalTime = 60000; // 60 seconds

    function simulateActivity() {
        const event = new MouseEvent("mousemove", {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: 0,
            clientY: 0
        });

        document.dispatchEvent(event);
        console.log("Dispatched mousemove event to stay active.");

        // Optional: You can also focus and blur the window to fake activity
        window.dispatchEvent(new Event('focus'));
        window.dispatchEvent(new Event('blur'));
        console.log("Triggered focus/blur to simulate presence.");
    }

    // Run the simulateActivity function at intervals
    setInterval(simulateActivity, intervalTime);

})();