// ==UserScript==
// @name         Defly.io Right Click Spammer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Press H to toggle right-click spam on defly.io
// @author       OpenAI
// @match        *://defly.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536248/Deflyio%20Right%20Click%20Spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/536248/Deflyio%20Right%20Click%20Spammer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let spamming = false;
    let spamInterval;

    function simulateRightClick() {
        const event = new MouseEvent("contextmenu", {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 2, // Right-click
            buttons: 2, // Right button
            clientX: window.innerWidth / 2,
            clientY: window.innerHeight / 2
        });
        document.dispatchEvent(event);
    }

    function startSpamming() {
        if (!spamInterval) {
            spamInterval = setInterval(simulateRightClick, 10); // Adjust speed here (ms)
        }
    }

    function stopSpamming() {
        clearInterval(spamInterval);
        spamInterval = null;
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'h' || e.key === 'H') {
            spamming = !spamming;
            if (spamming) {
                startSpamming();
                console.log("Right-click spamming started.");
            } else {
                stopSpamming();
                console.log("Right-click spamming stopped.");
            }
        }
    });
})();
