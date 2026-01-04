// ==UserScript==
// @name         Anime player hide
// @namespace    dphdm
// @version      1.0.3
// @description  Toggle video control bar visibility on number 1 key press
// @author       dphdmn
// @match        https://jut.su/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jut.su
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530469/Anime%20player%20hide.user.js
// @updateURL https://update.greasyfork.org/scripts/530469/Anime%20player%20hide.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isHidden = false;

    // Function to toggle control bar visibility
    const toggleControlBar = () => {
        const controlBar = document.querySelector('.vjs-control-bar');
        if (controlBar) {
            controlBar.style.setProperty('transition', 'visibility 0.1s, opacity 0.1s', 'important');
            controlBar.style.opacity = isHidden ? '0' : '1';
            controlBar.style.visibility = isHidden ? 'hidden' : 'visible';
        }
    };

    // Function to wait for an element to be present in the DOM
    const waitForElement = (selector, callback, timeout = 10000, interval = 100) => {
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(checkInterval);
                callback(element);
            } else if (Date.now() - startTime >= timeout) {
                clearInterval(checkInterval);
                console.log(`Element "${selector}" not found after ${timeout}ms`);
            }
        }, interval);
    };

    // Wait for the control bar element to load
    waitForElement('.vjs-control-bar', () => {
        // Add number 1 key event listener
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Digit1') {
                event.preventDefault();
                isHidden = !isHidden;
                toggleControlBar();
            }
        });
    });
})();