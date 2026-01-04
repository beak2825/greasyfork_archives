// ==UserScript==
// @name         Auto Join All Giveaways
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Automatically send POST requests to join all giveaways by cycling giveaway_id from 1 to 1k(will be updated once gw number passes 1k). Display a "Running bruteGW (num)" indicator.
// @author       ashisgai
// @match        https://flip.psxgems.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496152/Auto%20Join%20All%20Giveaways.user.js
// @updateURL https://update.greasyfork.org/scripts/496152/Auto%20Join%20All%20Giveaways.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and display the "Running" indicator
    function createRunningIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'running-indicator';
        indicator.style.position = 'fixed';
        indicator.style.top = '10px';
        indicator.style.left = '10px';
        indicator.style.zIndex = '9999';
        indicator.style.padding = '5px 10px';
        indicator.style.backgroundColor = 'green';
        indicator.style.color = 'white';
        indicator.style.borderRadius = '5px';
        indicator.style.fontFamily = 'Arial, sans-serif';
        indicator.style.fontSize = '14px';
        document.body.appendChild(indicator);
        return indicator;
    }

    // Function to update the "Running" indicator
    function updateIndicator(indicator, num) {
        indicator.innerText = `Running bruteGW (${num})`;
    }

    // Function to send a POST request to join giveaway
    function tryJoinGiveaway(num) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://flip.psxgems.com/php/giveaway', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(`type=join&giveaway_id=${num}`);
    }

    // Create the "Running" indicator
    const indicator = createRunningIndicator();

    let num = 1;
    const maxNum = 1000;

    // Continuously send POST requests with num cycling from 1 to 1 million
    function run() {
        tryJoinGiveaway(num);
        updateIndicator(indicator, num);
        num = (num % maxNum) + 1; // Increment num and reset to 1 if it exceeds maxNum
        requestAnimationFrame(run); // Use requestAnimationFrame for continuous execution without delay
    }

    // Start the loop
    run();
})();
