// ==UserScript==
// @name         Change Pl Am w skip 
// @namespace    https://greasyfork.org/counter-and-stop-random-Am-skip
// @version      5
// @description  Change pl Am w skip
// @license      JBT
// @match        https://*.apple.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529072/Change%20Pl%20Am%20w%20skip.user.js
// @updateURL https://update.greasyfork.org/scripts/529072/Change%20Pl%20Am%20w%20skip.meta.js
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
            console.error(`Element ${selector} not found.`);
        }
        attempts++;
    }, interval);
}

function playButtonClick() {
    waitForElement('button[data-testid="click-action"]', (playButton) => {
        playButton.click();
    });
}

function stopMusic(callback) {
    waitForElement('button[data-testid="click-action"]', (button) => {
        if (button.getAttribute('aria-label') === 'Pause') {
            button.click();
            if (callback) callback();
        } else if (callback) callback();
    }, 1000, 5);
}

function switchToNextPlaylist() {
    var currentIndex = parseInt(localStorage.getItem('currentPlaylistIndex')) || 0;
    currentIndex = (currentIndex + 1) % playlists.length;
    localStorage.setItem('currentPlaylistIndex', currentIndex);
    
    stopMusic(() => {
        setTimeout(() => {
            window.location.href = playlists[currentIndex];
            setTimeout(startPlayback, 10000);
        }, 5000);
    });
}

function startPlayback() {
    waitForElement('button[data-testid="click-action"]', (playButton) => {
        playButton.click();
    }, 8000);
}

function randomSkip() {
    function attemptSkip() {
        let nextButton = document.querySelector('button[aria-label="Next"], amp-playback-controls-item-skip.next');
        if (nextButton) {
            nextButton.click();
            scheduleNextSkip();
        } else {
            setTimeout(attemptSkip, 2000);
        }
    }

    function scheduleNextSkip() {
        let randomTime = Math.floor(Math.random() * (45000 - 38000 + 1)) + 38000;
        setTimeout(attemptSkip, randomTime);
    }

    scheduleNextSkip();
}

(function loop() {
    if (counter < 10) {
        let playTime = 25 * 60 * 1000;
        let stopTime = 30 * 1000;

        setTimeout(() => {
            playButtonClick();
            counter++;
            setTimeout(() => {
                stopMusic(() => {
                    setTimeout(switchToNextPlaylist, stopTime);
                });
            }, playTime);
        }, 0);

        randomSkip();
    } else {
        localStorage.removeItem('currentPlaylistIndex');
    }
})();
