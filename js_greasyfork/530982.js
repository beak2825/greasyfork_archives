// ==UserScript==
// @name         Digicode click
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  S
// @author       VotreNom
// @match        https://www.dreadcast.eu/Main
// @match        https://www.dreadcast.net/Main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530982/Digicode%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/530982/Digicode%20click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let running = false;

    function getRandomDelay() {
        return Math.floor(Math.random() * (800 - 250 + 1)) + 250; // Délai entre 250 et 800 ms
    }

    async function loopActions() {
        while (running) {
            let randomButton = document.querySelector('.btnTxt[onclick*="randomDigicode"]');
            let saveButton = document.querySelector('.btnTxt[onclick*="modifDigicode"]');

            if (randomButton && saveButton) {
                randomButton.click();
                await new Promise(resolve => setTimeout(resolve, getRandomDelay()));

                saveButton.click();
                await new Promise(resolve => setTimeout(resolve, getRandomDelay()));
            } else {
                running = false; // Stopper le script si les boutons ne sont plus trouvés
            }
        }
    }

    document.addEventListener('keydown', (event) => {
        if (event.shiftKey && event.key.toLowerCase() === 'a') {
            if (!running) {
                running = true;
                loopActions();
            }
        } else if (event.shiftKey && event.key.toLowerCase() === 'x') {
            running = false;
        }
    });
})();