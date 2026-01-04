// ==UserScript==
// @name         Button Clicker Random
// @namespace    https://greasyfork.org/mixed-button-clicker-random
// @version      7.2
// @description  Clicks a button at random intervals
// @license      MIT
// @match        https://*.*.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499982/Button%20Clicker%20Random.user.js
// @updateURL https://update.greasyfork.org/scripts/499982/Button%20Clicker%20Random.meta.js
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
    var rand = getRandomInt(34000, 42000);
    console.log(rand);
    setTimeout(function() {
        doSomething();
        loop();
    }, rand);
}());