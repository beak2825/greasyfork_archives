// ==UserScript==
// @name         riproduzione automatica permanente figuccio
// @description  disattiva permanentemente riproduzione video successivo 2023
// @namespace    https://greasyfork.org/users/237458
// @version      0.1
// @author       figuccio
// @match        https://*.youtube.com/*
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/460656/riproduzione%20automatica%20permanente%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/460656/riproduzione%20automatica%20permanente%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
//riproduzione automatica disattivata  2023
    function riproduzioneautomatica () {
        let autoplayButton = document.getElementsByClassName('ytp-autonav-toggle-button')[0];
        let autoplayEnabled = autoplayButton && autoplayButton.getAttribute('aria-checked') === 'true';
        if (autoplayEnabled) {
            console.log("proverà ora a disattivare la riproduzione automatica.");
            autoplayButton.click();
             }
}

    riproduzioneautomatica();

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
        riproduzioneautomatica();
        });
    });

    observer.observe(document, { childList: true, subtree: true });
})();
