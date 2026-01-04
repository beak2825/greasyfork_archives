// ==UserScript==
// @name         Auto Roll FreeBitco.in
// @namespace    http://freebitco.in/
// @version      1.0
// @description  Automatiza el giro en FreeBitco.in cada vez que esté disponible.
// @author       Gabo
// @license      MIT
// @match        https://freebitco.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527975/Auto%20Roll%20FreeBitcoin.user.js
// @updateURL https://update.greasyfork.org/scripts/527975/Auto%20Roll%20FreeBitcoin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function autoRoll() {
        let rollButton = document.getElementById('free_play_form_button');
        
        if (rollButton && !rollButton.disabled) {
            console.log("🎲 Girando automáticamente...");
            rollButton.click();
        } else {
            console.log("⏳ Aún no puedes girar. Esperando...");
        }

        // Revisar cada 10 segundos si el botón está disponible
        setTimeout(autoRoll, 10000);
    }

    // Espera 3 segundos antes de empezar para evitar detección
    setTimeout(autoRoll, 3000);
})();
