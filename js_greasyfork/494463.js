// ==UserScript==
// @name         Master File Random AM Button Clicker
// @namespace    https://greasyfork.org/master-file-random-Am-button-clicker
// @version      3.0
// @description  Clicks a button at random intervals
// @license      MIT
// @match        https://*.apple.com/*
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
    // Find the "Next" button using its class
    var nextButton = document.querySelector('amp-playback-controls-item-skip.next');
    if (nextButton) {
        nextButton.click();
    } else {
        console.log("Next button not found.");
    }
}

(function loop() {
    var rand = getRandomInt(35000, 45000);
    console.log(rand);
    setTimeout(function() {
        doSomething();
        loop();
    }, rand);
})();