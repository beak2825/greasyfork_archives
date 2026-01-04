// ==UserScript==
// @name         CTRL Bagarre
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Joue un son quand "Défenseurs" apparaît au début du combat
// @author       Laïn
// @match        https://www.dreadcast.eu/Main
// @match        https://www.dreadcast.net/Main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530984/CTRL%20Bagarre.user.js
// @updateURL https://update.greasyfork.org/scripts/530984/CTRL%20Bagarre.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Écoute les clics sur le document
    document.addEventListener("click", (e) => {
        // Vérifie que la touche CTRL est maintenue lors du clic
        if (e.ctrlKey) {
            const attackButton = document.getElementById("action_perso_attaque");
            // Vérifie que le bouton existe et qu'il est visible (display === "block")
            if (attackButton && window.getComputedStyle(attackButton).display === "block") {
                attackButton.click();
            }
        }
    });
})();