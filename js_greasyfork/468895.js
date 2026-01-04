// ==UserScript==
// @name            Zive.cz - auto close banner window
// @name:sk         Zive.cz - automaticky zavrie reklamný baner
// @name:cs         Zive.cz - automaticky zavře reklamny baner
// @namespace       https://greasyfork.org/users/1103427-sperhak
// @homepageURL     https://greasyfork.org/sk/scripts/468895
// @supportURL      https://greasyfork.org/sk/scripts/468895/feedback
// @version         1.0
// @description     For automatic closing banner window
// @description:sk  Pre automatické zavretie reklamného baneru
// @description:cs  Pro automatické zavřetí reklamního baneru
// @author          Sperhak
// @match           *://*.zive.cz/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/468895/Zivecz%20-%20auto%20close%20banner%20window.user.js
// @updateURL https://update.greasyfork.org/scripts/468895/Zivecz%20-%20auto%20close%20banner%20window.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funkcia na simuláciu kliknutia na tlačidlo Zatvoriť
    function simulateCloseButtonClick() {
        const closeButtons = document.querySelectorAll('a[title="Zatím zavřít"]');
        if (closeButtons.length > 0) {
            closeButtons.forEach(button => {
                button.removeAttribute("disabled");
                button.click();
            });
        }
    }

    // Počká na zobrazenie adblocker modálneho okna a simuluje kliknutie na tlačidlo Zatvoriť
    function waitForModal() {
        const modal = document.querySelector('a[title="Zatím zavřít"]');
        if (modal) {
            simulateCloseButtonClick();
        } else {
            setTimeout(waitForModal, 50);
        }
    }

    // Spustí skript
    waitForModal();
})();