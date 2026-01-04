// ==UserScript==
// @name         Prolific Simple Alert
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Plays a Bell sound if £1 or $1 or higher is detected on the page
// @author       MarkusRight
// @match        https://app.prolific.com/studies
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497812/Prolific%20Simple%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/497812/Prolific%20Simple%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const Sound = new Audio('https://dl.sndup.net/rbd4h/notify.mp3'); // Replace with a valid URL to bell sound
    Sound.loop = true;

    let isMuted = false;

    // Create and style mute button
    const muteButton = document.createElement('button');
    muteButton.innerText = 'Mute';
    muteButton.style.position = 'fixed';
    muteButton.style.top = '10px';
    muteButton.style.right = '10px';
    muteButton.style.zIndex = '1000';
    muteButton.style.backgroundColor = 'red';
    muteButton.style.color = 'white';
    muteButton.style.border = 'none';
    muteButton.style.padding = '10px';
    muteButton.style.cursor = 'pointer';

    document.body.appendChild(muteButton);

    muteButton.addEventListener('click', () => {
        isMuted = !isMuted;
        if (isMuted) {
            Sound.pause();
            muteButton.innerText = 'Unmute';
        } else {
            Sound.play();
            muteButton.innerText = 'Mute';
        }
    });

    function checkValues() {
        const elements = document.querySelectorAll('span.amount[data-testid="study-tag-reward"]');
        let playSound = false;

        elements.forEach(element => {
            const text = element.textContent.trim();
            const value = parseFloat(text.replace(/[^0-9.]/g, ''));

            if ((text.includes('£') || text.includes('$')) && value >= 1) {
                playSound = true;
            }
        });

        if (playSound && !isMuted) {
            Sound.play();
        } else {
            Sound.pause();
        }
    }

    setInterval(checkValues, 1000);
})();
