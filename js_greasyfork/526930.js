// ==UserScript==
// @name         JERKMATE HACKS
// @namespace    http://tampermonkey.net/
// @version      2025-02-14
// @description  EASIEST SCRIPT
// @author       @every_ne on discord
// @match        https://jerkmate.com/jerkmate-ranked
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jerkmate.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526930/JERKMATE%20HACKS.user.js
// @updateURL https://update.greasyfork.org/scripts/526930/JERKMATE%20HACKS.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Select the div using the class name
        var targetDiv = document.querySelector('.css-d2v67y-idle-game-StyledRank.etl41dv0');

        if (targetDiv) {
            targetDiv.textContent = 'HACKS BY @every_ne on discord <3';
        }
    });
})();

function autoClickVideo() {
    const videoElement = document.querySelector('video');
    if (videoElement) {
        setInterval(() => {
            videoElement.click();
        }, 0);
    }else{

    }
}
for (let i = 0; i < 50; i++) { // change i<50 if your game is lagging just change it to something lower
    autoClickVideo();

}

