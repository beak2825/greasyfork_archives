// ==UserScript==
// @name         Psy Script
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Permanently deletes the “Leave Faction” button on Torn faction pages
// @match        https://www.torn.com/factions.php?step=your*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540965/Psy%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/540965/Psy%20Script.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function secretPsyButton() {
        // select by id or class
        const btns = document.querySelectorAll('a.quit-job, #quit-job');
        btns.forEach(btn => btn.remove());
    }

    // initial removal
    secretPsyButton();

    // in case the button is injected later, watch for new nodes
    const obs = new MutationObserver(secretPsyButton);
    obs.observe(document.body, { childList: true, subtree: true });
})();
