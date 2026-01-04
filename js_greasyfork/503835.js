// ==UserScript==
// @name         Button Clicker Random
// @namespace    https://greasyfork.org/Premixed-button-clicker-random
// @version      2.0
// @description  Clicks a button at random intervalsPremi
// @license      MIT
// @match        https://*.*.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503835/Button%20Clicker%20Random.user.js
// @updateURL https://update.greasyfork.org/scripts/503835/Button%20Clicker%20Random.meta.js
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
    var rand = getRandomInt(35000, 45000);
    console.log(rand);
    setTimeout(function() {
        doSomething();
        loop();
    }, rand);
}());