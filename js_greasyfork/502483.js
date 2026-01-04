// ==UserScript==
// @name         Auto Click "Mark As Found"
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Toggle between automatically clicking the "Mark as Found" and "Mark as Not Found" button on the Genshin Unofficial Map.
// @author       koiyakiya
// @license MIT
// @match        https://genshin-impact-map.appsample.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502483/Auto%20Click%20%22Mark%20As%20Found%22.user.js
// @updateURL https://update.greasyfork.org/scripts/502483/Auto%20Click%20%22Mark%20As%20Found%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let mode = 'mark'; // Default mode is 'mark'

    // Create a toggle button
    const toggleButton = document.createElement('button');
    toggleButton.innerText = 'Switch to Unmark';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '10px';
    toggleButton.style.left = '50%';
    toggleButton.style.transform = 'translateX(-50%)';
    toggleButton.style.padding = '10px 20px';
    toggleButton.style.fontSize = '14px';
    toggleButton.style.backgroundColor = '#f44336';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.zIndex = '1000';
    document.body.appendChild(toggleButton);

    toggleButton.addEventListener('click', () => {
        if (mode === 'mark') {
            mode = 'unmark';
            toggleButton.innerText = 'Switch to Mark';
            toggleButton.style.backgroundColor = '#4CAF50';
        } else {
            mode = 'mark';
            toggleButton.innerText = 'Switch to Unmark';
            toggleButton.style.backgroundColor = '#f44336';
        }
    });

    // Function to click the "Mark As Found" button
    function clickMarkAsFoundButton() {
        let button = document.querySelector("button.btn.btn-sm.btn-success.mt-2");
        if (button) {
            button.click();
        }
    }

    // Function to click the "Mark As Not Found" button
    function clickMarkAsNotFoundButton() {
        let button = document.querySelector("a[href='#'][onclick^='window._markAsNotFound']");
        if (button) {
            button.click();
        }
    }

    // Set up a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                if (mode === 'mark') {
                    clickMarkAsFoundButton();
                } else {
                    clickMarkAsNotFoundButton();
                }
            }
        });
    });

    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();
