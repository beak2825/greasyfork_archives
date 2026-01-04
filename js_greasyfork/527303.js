// ==UserScript==
// @name         Auto Complete Deck
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Autocomplete Deck
// @author       nabe
// @match        https://cards.ucalgary.ca/card/*
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527303/Auto%20Complete%20Deck.user.js
// @updateURL https://update.greasyfork.org/scripts/527303/Auto%20Complete%20Deck.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const stateKey = 'scriptState';
    let scriptRunning = false; // Prevent rapid execution

    function waitForElement(selector, callback, timeout = 5000) {
        const startTime = Date.now();
        const checkExist = setInterval(function() {
            let button = document.querySelector(selector);
            if (button) {
                clearInterval(checkExist);
                callback(button);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(checkExist);
                console.log('Timeout waiting for: ' + selector);
            }
        }, 500);
    }

    function clickButton(selector) {
        waitForElement(selector, function(button) {
            button.click();
            console.log('Clicked button: ' + selector);
        });
    }

    function performActions() {
        if (scriptRunning) return; // Prevent multiple executions
        scriptRunning = true;

        console.log("Script started...");

        clickButton('div.submit > button');

        setTimeout(function() {
            clickButton('div.actions span.review-buttons a.save');

            setTimeout(function() {
                clickButton('#next');
                scriptRunning = false; // Allow script to run again after clicking Next
            }, 100); // Small delay before clicking Next

        }, 100); // Delay before clicking I got this
    }

    window.onload = function() {
        performActions();
    };

    // Observer for dynamically loaded content
    const observer = new MutationObserver(function(mutations, observer) {
        if (!scriptRunning && document.querySelector('div.submit > button')) {
            performActions();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
