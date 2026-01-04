// ==UserScript==
// @name              [Diep.io] Get Killer Rivet ID
// @namespace    http://tampermonkey.net/
// @version          1.1
// @description    Gets the Rivet UUID of the player that  killed you.
// @author            _Vap
// @match             https://diep.io/*
// @license           MIT
// @icon                https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/490315/%5BDiepio%5D%20Get%20Killer%20Rivet%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/490315/%5BDiepio%5D%20Get%20Killer%20Rivet%20ID.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const interval = setInterval(() => {
        let screen = window.ui.screen;
        if (screen !== "stats") return;
        else {
            clearInterval(interval);
            let uuid = window.input.getKillerIdentityId();
            console.log(`Killer Rivet ID: ${uuid}`);
            navigator.clipboard.writeText(uuid)
        }
    }, 250);
})();