// ==UserScript==
// @name         master file of Random Button Clicker
// @namespace    https://greasyfork.org/master-file-random-button-clicker
// @version      3.0
// @description  Clicks a button at random intervals
// @license      MIT
// @match        https://*.*.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/
// @updateURL https://update.greasyfork.org/
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