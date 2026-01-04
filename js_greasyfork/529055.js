// ==UserScript==
// @name         Change Pl Am with skip
// @namespace    https://greasyfork.org/counter-and-stop-random-Am-button-clicker
// @version      4
// @description  Change pl Am with skip
// @license      JBT
// @match        https://*.apple.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529055/Change%20Pl%20Am%20with%20skip.user.js
// @updateURL https://update.greasyfork.org/scripts/529055/Change%20Pl%20Am%20with%20skip.meta.js
// ==/UserScript==

var counter = 0; 

var playlists = [
    'https://music.apple.com/sg/playlist/jimin-who-13/pl.u-pMylEbRtKob8ZW',
    'https://music.apple.com/sg/playlist/who-jimin/pl.u-leyl0YPIM2yV9qW',
    'https://music.apple.com/sg/playlist/jimin-who-who/pl.u-gxblkL4sbKYllbZ',
    'https://music.apple.com/sg/playlist/jimin-who/pl.u-xlyNEdXtoVK05Em',
];

function waitForElement(selector, callback, interval = 1000, retries = 15) {
    let attempts = 0;
    const check = setInterval(() => {
        let element = document.querySelector(selector);
        if (element) {
            clearInterval(check);
            callback(element);
        } else if (attempts >= retries) {
            clearInterval(check);
            console.error(`Element ${selector} not found after ${retries} retries.`);
        }
        attempts++;
    }, interval);
}

function playButtonClick() {
    waitForElement('button[data-testid="click-action"]', (playButton) => {
        playButton.click();
        console.log("Play button clicked. Autoplay started.");
    });
}

function stopMusic() {
    var stopButton = document.querySelector('button[aria-label="Pause"]');
    if (stopButton) {
        stopButton.click();
        console.log("Music stopped.");
    } else {
        console.log("Stop button not found.");
    }
}

function switchToNextPlaylist() {
    var currentIndex = parseInt(localStorage.getItem('currentPlaylistIndex') || 0);
    currentIndex = (currentIndex + 1) % playlists.length;
    localStorage.setItem('currentPlaylistIndex', currentIndex);
    
    var nextPlaylistUrl = playlists[currentIndex];
    console.log("Switching to playlist: " + nextPlaylistUrl);
    setTimeout(() => {
        window.location.href = nextPlaylistUrl;
    }, 5000);
}

function startPlayback() {
    setTimeout(() => {
        console.log("Waiting for page to load...");
        playButtonClick();
    }, 8000);
}

function randomSkip() {
    function attemptSkip() {
        let nextButton = document.querySelector('button[aria-label="Next"], amp-playback-controls-item-skip.next');
        if (nextButton) {
            nextButton.click();
            console.log("Randomly skipped track.");
            scheduleNextSkip(); // Schedule the next skip after a successful skip
        } else {
            console.log("Next button not found. Retrying in 2s...");
            setTimeout(attemptSkip, 2000); // Retry after 2 seconds
        }
    }
    function scheduleNextSkip() {
        let minSkipTime = 38000;
        let maxSkipTime = 45000;
        let randomTime = Math.floor(Math.random() * (maxSkipTime - minSkipTime + 1)) + minSkipTime;
        setTimeout(attemptSkip, randomTime);
    }
    scheduleNextSkip(); // Start the skipping process
}

(function loop() {
    if (counter < 10) {
        let playTime = 25 * 60 * 1000;
        let stopTime = 30 * 1000;

        console.log("Playing for 25 minutes...");

        setTimeout(() => {
            playButtonClick();
            counter++;

            setTimeout(() => {
                console.log("Stopping for 30 seconds...");
                stopMusic();

                setTimeout(() => {
                    switchToNextPlaylist();

                    setTimeout(() => {
                        startPlayback();
                    }, 1000);

                }, stopTime);

            }, playTime);

        }, 0);

        randomSkip(); // Start random skipping

    } else {
        console.log("Finished 10 cycles.");
        localStorage.removeItem('currentPlaylistIndex');
    }
})();
