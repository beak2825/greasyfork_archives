// ==UserScript==
// @name         Sloop.io Heal Spam on Mouse Hold
// @namespace    https://greasyfork.org/users/yourname
// @version      1.0
// @description  Spam heal key while holding mouse button in Sloop.io
// @author       Copilot pro
// @license      MIT
// @match        *://sloop.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545143/Sloopio%20Heal%20Spam%20on%20Mouse%20Hold.user.js
// @updateURL https://update.greasyfork.org/scripts/545143/Sloopio%20Heal%20Spam%20on%20Mouse%20Hold.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const healKey = 'H';     // Change this to your actual heal key
    const spamRate = 100;    // Time between each heal press (in ms)

    let spammer = null;

    // Start spamming when mouse is held down
    document.addEventListener('mousedown', () => {
        if (!spammer) {
            spammer = setInterval(() => {
                document.dispatchEvent(new KeyboardEvent('keydown', {key: healKey}));
                console.log('[Sloop Hack] Heal key pressed');
            }, spamRate);
        }
    });

    // Stop spamming when mouse is released
    document.addEventListener('mouseup', () => {
        if (spammer) {
            clearInterval(spammer);
            spammer = null;
            console.log('[Sloop Hack] Heal spam stopped');
        }
    });
})();