// ==UserScript==
// @name         Auto Complete Deck to Anki
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Click submit, refresh, simulate Ctrl+Shift+Y, and click Next Card repeatedly until stopped
// @author       nabe
// @match        https://cards.ucalgary.ca/card/*
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500780/Auto%20Complete%20Deck%20to%20Anki.user.js
// @updateURL https://update.greasyfork.org/scripts/500780/Auto%20Complete%20Deck%20to%20Anki.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const stateKey = 'scriptState';
    const initialState = 'nextCard'; // Set your initial state value here
    let timeoutId = null; // Global variable to store the timeout ID

    // Function to click a button by its selector
    function clickButton(selector) {
        var button = document.querySelector(selector);
        if (button) {
            button.click();
            console.log('Clicked button: ' + selector);
        } else {
            console.log('Button not found: ' + selector);
        }
    }

    // Main function to perform the actions
    function performActions() {
        // Click the Submit button
        clickButton('div.submit > button'); // Adjust the selector if necessary

        // Store state before refreshing
        localStorage.setItem(stateKey, 'refreshing');

        // Refresh the page after a delay
        timeoutId = setTimeout(function() {
            location.reload();
        }, 2000); // 2000 milliseconds = 2 seconds delay before refreshing
    }

    // Function to continue actions after refresh
    function continueActions() {
        timeoutId = setTimeout(function() {

            // Click the I got this button
            clickButton('div.actions span.review-buttons a.save');

            // Simulate Ctrl+Shift+Y key press
            var ctrlShiftYEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Y',
                code: 'KeyY',
                keyCode: 89,
                charCode: 89,
                shiftKey: true,
                ctrlKey: true
            });
            document.dispatchEvent(ctrlShiftYEvent);

            // Click the "Next Card" button
            clickButton('#next');

            // Store state before next cycle
            localStorage.setItem(stateKey, 'nextCard');

            // Refresh the page after a delay
            timeoutId = setTimeout(function() {
                location.reload();
            }, 2000); // 2000 milliseconds = 2 seconds delay before refreshing
        }, 2000); // 2000 milliseconds = 2 seconds delay after load
    }

    // Function to start the script
    function startScript() {
        localStorage.setItem(stateKey, initialState);
        performActions();
    }

    // Function to stop the script
    function stopScript() {
        localStorage.removeItem(stateKey);
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        alert('Script stopped and state cleared.');
    }

    // Register start and stop buttons in the Tampermonkey menu
    GM_registerMenuCommand('Start Script', startScript);
    GM_registerMenuCommand('Stop Script', stopScript);

    // Check state and continue actions if necessary
    if (localStorage.getItem(stateKey) === 'refreshing') {
        continueActions();
    } else if (localStorage.getItem(stateKey) === 'nextCard') {
        performActions();
    }
})();
