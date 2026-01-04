// ==UserScript==
// @name         Torn - Alert for shoplifting uniques
// @namespace    http://www.countlesscircles.com
// @version      2025.4
// @description  Watches for shoplifting uniques and makes LOUD NOISE when found.
// @author       Tokuki
// @license      GNU GPLv3
// @match        https://www.torn.com/page.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541134/Torn%20-%20Alert%20for%20shoplifting%20uniques.user.js
// @updateURL https://update.greasyfork.org/scripts/541134/Torn%20-%20Alert%20for%20shoplifting%20uniques.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const found = [];

    const audio = new Audio('https://files.catbox.moe/opm43i.mp3');
    audio.volume = 0.5;

    let storeElements = undefined;
    let audioTimeout = undefined;

    setInterval(() => {
        storeElements = document.querySelectorAll('.shoplifting-root .virtualList___noLef .virtual-item');
        if (storeElements.length === 0) {
            // The Shoplifting element isn't found - not the right page.
            return;
        }

        for (const [key, storeElement] of storeElements.entries()) {
            const uniqueContainer = storeElement.querySelector('[class^="uniqueStars"]');

            if (uniqueContainer.innerHTML) { // Unique found for this store!
                if (!found[key]) { // Check if we've already alerted the user of this instance.
                    // Logging it in the console, so I can see if I missed any while away.
                    console.log('Found a unique!');

                    // Stop and reset any existing audio playing
                    clearTimeout(audioTimeout);
                    audio.pause();
                    audio.currentTime = 0;

                    // SCREAM
                    audio.play();

                    // Mark that we found it, and already played the audio for this one.
                    found[key] = true;

                    // Stop the audio after a set time, because the audio file is long and annoying.
                    audioTimeout = setTimeout(() => {
                        audio.pause();
                    }, 4000);
                }
            } else { // No unique found for this store
                // Reset the found status, so that if a Unique went away, it can be re-triggered.
                found[key] = false;
            }
        }
    }, 1000);
})();