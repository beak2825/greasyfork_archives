// ==UserScript==
// @name         TW CZ auto farmer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  TW auto farmer
// @author       LZ
// @match        https://*/game.php?*screen=am_farm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=divokekmeny.cz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489095/TW%20CZ%20auto%20farmer.user.js
// @updateURL https://update.greasyfork.org/scripts/489095/TW%20CZ%20auto%20farmer.meta.js
// ==/UserScript==

(function() {
    if(!document.URL.includes('screen=am_farm')) {
        return;
    }

    function simulateKeyPress(character) {
        var event = new KeyboardEvent('keydown', {
            key: character,
            keyCode: character.charCodeAt(0),
            which: character.charCodeAt(0),
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            metaKey: false,
            bubbles: true
        });

        // Dispatch the event on the document body
        document.body.dispatchEvent(event);
    }

    function notEnoughTroops() {
        const element = document.querySelector('.autoHideBox.error p');

        if (element && (element.textContent.trim() === "Nedostačující počet jednotek" || element.textContent.trim() === "That button is not selectable. Skipping row...")) {
            return true;
        } else {
            return false;
        }
    }

    const RELOAD_INTERVAL_IN_MINUTES = 15;
    const ATTACK_SEMD_IN_MS = 500;

    setTimeout(() => {
        console.log('Reloading page...');
        location.reload();
    }, RELOAD_INTERVAL_IN_MINUTES * 60 * 1030);

    console.log('Starting script execution...');
    // Load the external script
    $.getScript('https://scripts.ibragonza.nl/enhancer/enhancer.js')
        .done(() => {
        console.log('Script loaded successfully.');
        setTimeout(() => {
            const clickInterval = setInterval(() => {
                if (notEnoughTroops()) {
                    clearInterval(clickInterval);
                }
                simulateKeyPress('A');
            }, ATTACK_SEMD_IN_MS);
        }, 5000);
    })
        .fail(() => {
        console.error('Failed to load the script.');
    });
})();