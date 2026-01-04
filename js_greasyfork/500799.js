// ==UserScript==
// @name         Keyboard Simulator Script
// @namespace    https://greasyfork.org/en/users/1291009
// @version      0.3
// @license      MIT
// @description  Simulate keyboard key presses based on user-defined main and sub keys.
// @match        https://www.neopets.com/altador/colosseum/ctp.phtml?game_id=1399&o_team=0&p_team=19
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/500799/Keyboard%20Simulator%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/500799/Keyboard%20Simulator%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let keyChains = [];

    function triggerChain(event) {
        const key = event.key.toLowerCase();  // Convert pressed key to lowercase
        const chain = keyChains.find(chain => chain.mainKey === key);  // Find matching mainKey
        if (chain) {
            const subKey = chain.subKey;  // Retrieve subKey
            simulateKeyPress(subKey);  // Trigger simulated key press
        }
    }

    function simulateKeyPress(key) {
        // Simulate key press by dispatching keydown and keyup events
        const keydownEvent = new KeyboardEvent('keydown', { key: key });
        const keyupEvent = new KeyboardEvent('keyup', { key: key });

        document.dispatchEvent(keydownEvent);  // Dispatch keydown event
        document.dispatchEvent(keyupEvent);    // Dispatch keyup event
    }

    function addChain() {
        const mainKey = prompt('Enter main key (e.g., A, B, 1, 2):').toLowerCase();  // Convert to lowercase for consistency
        const subKey = prompt('Enter sub key (e.g., X, Y, 3, 4):').toLowerCase();  // Convert to lowercase for consistency

        keyChains.push({
            mainKey: mainKey,
            subKey: subKey
        });

        // Update menu command for adding chain
        GM_registerMenuCommand('Add Key Chain', addChain);

        // Save key chains to storage
        GM_setValue('keyChains', keyChains);
    }

    // Initialize script
    keyChains = GM_getValue('keyChains', []);
    GM_registerMenuCommand('Add Key Chain', addChain);

    // Listen for keydown events to trigger chains
    window.addEventListener('keydown', triggerChain);

})();
