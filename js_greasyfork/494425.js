// ==UserScript==
// @name         Counter and Stop Random AM Button Clicker
// @namespace    https://greasyfork.org/counter-and-stop-random-Am-button-clicker
// @version      1.0
// @description  Clicks a button at random intervals for 350 times and stop
// @license      MIT
// @match        https://*.apple.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494425/Counter%20and%20Stop%20Random%20AM%20Button%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/494425/Counter%20and%20Stop%20Random%20AM%20Button%20Clicker.meta.js
// ==/UserScript==

var counter = 0; // Initialize a counter variable

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function doSomething() {
    // Find the "Next" button using its class
    var nextButton = document.querySelector('amp-playback-controls-item-skip.next');
    if (nextButton) { nextButton.click(); } else { console.log("Next button not found."); } }

function stopMusic() {
    var stopButton = document.querySelector('amp-playback-controls-play.playback-controls-play');
    if (stopButton) { stopButton.click(); } else { console.log("Stop button not found."); } }

(function loop() {
    if (counter < 350) { // Check if the counter is less than 350
        var rand = getRandomInt(35000, 45000);
        console.log(rand);
        setTimeout(function() { doSomething();
            counter++; // Increment the counter
            loop(); }, rand); } else {
        // After clicking the button 350 times, stop the music
        setTimeout(function() {
            stopMusic();
        }, 2000); // Delay before clicking stop button (adjust as needed)
    }
})();