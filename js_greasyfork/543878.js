// ==UserScript==
// @name         Auto Click NextTop
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically clicks the element with id "nextTop" every 30-40 seconds randomly on the specified webpage.
// @author       wch
// @match        http://wap.xiaoyuananquantong.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543878/Auto%20Click%20NextTop.user.js
// @updateURL https://update.greasyfork.org/scripts/543878/Auto%20Click%20NextTop.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to generate random interval between 30-40 seconds in milliseconds
    function getRandomInterval() {
        return Math.floor(Math.random() * (40 - 30 + 1) + 30) * 1000;
    }

    // Function to perform the click and schedule the next one
    function autoClick() {
        var element = document.getElementById('nextTop');
        if (element) {
            element.click();
            console.log('Clicked the nextTop element!');
        } else {
            console.log('nextTop element not found.');
        }
        // Schedule the next click
        setTimeout(autoClick, getRandomInterval());
    }

    // Start the auto-click after the page loads
    window.addEventListener('load', function() {
        autoClick();
    });
})();