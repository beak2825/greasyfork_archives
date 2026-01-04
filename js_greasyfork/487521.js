// ==UserScript==
// @name         Keep Teams Available
// @namespace    facelook.hk
// @version      1.0
// @description  Keep status always availabile instead of away in MS Teams.
// @author       FacelookHK
// @match        https://teams.microsoft.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487521/Keep%20Teams%20Available.user.js
// @updateURL https://update.greasyfork.org/scripts/487521/Keep%20Teams%20Available.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to simulate key press
    function simulateKeyPress(key) {
        var event = new KeyboardEvent('keydown', {
            key: key,
            code: `Key${key.toUpperCase()}`,
            bubbles: true,
            cancelable: true
        });
        document.activeElement.dispatchEvent(event);
    }

    // Send a key press every 1 min
    setInterval(function() {
        simulateKeyPress('F13');
    }, 1 * 60 * 1000);
})();