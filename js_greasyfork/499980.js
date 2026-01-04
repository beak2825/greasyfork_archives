// ==UserScript==
// @name         Button Clicker AM Random
// @namespace    https://greasyfork.org/new-button-clicker-Am-Random
// @version      7.2
// @description  Clicks a button at random intervals
// @license      MIT
// @match        https://*.apple.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499980/Button%20Clicker%20AM%20Random.user.js
// @updateURL https://update.greasyfork.org/scripts/499980/Button%20Clicker%20AM%20Random.meta.js
// ==/UserScript==

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function doSomething() {
    // Find the "Next" button using its class
    var nextButton = document.querySelector('amp-playback-controls-item-skip.next');
    if (nextButton) {
        nextButton.click();
    } else {
        console.log("Next button not found.");
    }
}

(function loop() {
    var rand = getRandomInt(34000, 42000);
    console.log(rand);
    setTimeout(function() {
        doSomething();
        loop();
    }, rand);
})();