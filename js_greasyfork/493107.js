// ==UserScript==
// @name         Random Button Clicker
// @namespace    https://example.com/random-button-clicker
// @version      2.0
// @description  Clicks a button at random intervals
// @license      MIT
// @match        https://example.com/*  // Replace with the URL where you want the script to run
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493107/Random%20Button%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/493107/Random%20Button%20Clicker.meta.js
// ==/UserScript==

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function doSomething() {
    var button = document.querySelector('[aria-label="Next"]');
    button.click();
}

(function loop() {
    var rand = getRandomInt(35000, 50000);
    console.log(rand);
    setTimeout(function() {
        doSomething();
        loop();
    }, rand);
}());
