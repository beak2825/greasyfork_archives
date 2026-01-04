// ==UserScript==
// @name         Auto Click Collect Your Reward Button on OurCoinCash Faucet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Klickt automatisch auf den "Collect Your Reward"-Button auf https://ourcoincash.xyz/faucet
// @author       Du
// @match        https://ourcoincash.xyz/faucet
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526570/Auto%20Click%20Collect%20Your%20Reward%20Button%20on%20OurCoinCash%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/526570/Auto%20Click%20Collect%20Your%20Reward%20Button%20on%20OurCoinCash%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funktion, um den Button zu finden und zu klicken
    function clickCollectRewardButton() {
        // Suche den Button durch seinen Textinhalt
        const button = Array.from(document.querySelectorAll('button')).find(el => el.textContent.trim().toLowerCase() === 'collect your reward');

        // Wenn der Button gefunden wird, klicke darauf
        if (button) {
            console.log("Button 'Collect Your Reward' gefunden und wird geklickt.");
            button.click();
        }
    }

    // Versuche, den Button sofort zu finden und zu klicken
    clickCollectRewardButton();

    // Füge einen MutationObserver hinzu, um auf spätere Änderungen der Seite zu reagieren
    const observer = new MutationObserver(() => {
        clickCollectRewardButton();
    });

    // Beobachte Änderungen im DOM, um auf den Button zu reagieren, wenn er hinzugefügt wird
    observer.observe(document.body, { childList: true, subtree: true });
})();