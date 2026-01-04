// ==UserScript==
// @name         Auto-Click Button Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically click the button when the timer is below 7 seconds.
// @author       Sark
// @match        https://msg.cityline.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492548/Auto-Click%20Button%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/492548/Auto-Click%20Button%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to simulate a click
    function clickButton() {
        const button = document.getElementById('btn-retry-en-1');
        if (!button.disabled) {
            button.click();
        }
    }

    // Monitor changes to the 'remainTime1' element
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const remainTimeText = mutation.addedNodes[0].textContent;
                const timeValue = parseInt(remainTimeText.replace(/[^\d]/g, ''), 10);
                if (timeValue < 7) {
                    clickButton();
                }
            }
        });
    });

    // Start observing
    const targetNode = document.getElementById('remainTime1');
    if (targetNode) {
        observer.observe(targetNode, { childList: true });
    }
})();
