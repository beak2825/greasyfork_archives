// ==UserScript==
// @name         Counter Random YT Button Clicker
// @namespace    https://greasyfork.org/counter-random-YT-button-clicker
// @version      2.1
// @description  Clicks a YT button at random intervals for 120 times
// @license      MIT
// @match        https://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494121/Counter%20Random%20YT%20Button%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/494121/Counter%20Random%20YT%20Button%20Clicker.meta.js
// ==/UserScript==

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function doSomething() {
    var button = document.querySelector('a.ytp-next-button.ytp-button');
    button.click();
}

var counter = 0;

function loop() {
    if (counter >= 120) {
        return; // Exit the loop when counter reaches 120
    }
    
    var rand = getRandomInt(35000, 45000);
    console.log(rand);
    setTimeout(function() {
        doSomething();
        counter++; // Increment counter after clicking
        loop(); // Call loop function recursively
    }, rand);
}

loop(); // Start the loop
