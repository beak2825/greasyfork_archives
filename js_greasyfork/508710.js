// ==UserScript==
// @name         Nascondi Banner AdBlock per Sole 24 Ore
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Nasconde il banner di avviso e l'overlay per il blocco degli annunci su Il Sole 24 Ore
// @author       Science
// @match        https://www.ilsole24ore.com/*
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508710/Nascondi%20Banner%20AdBlock%20per%20Sole%2024%20Ore.user.js
// @updateURL https://update.greasyfork.org/scripts/508710/Nascondi%20Banner%20AdBlock%20per%20Sole%2024%20Ore.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funzione per nascondere il modal e l'overlay
    function hideAdBlockModal() {
        var modal = document.getElementById('adblock-modal');
        var overlay = document.querySelector('.modal-backdrop');
        if (modal) {
            modal.style.display = 'none';
        }
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    // Esegui la funzione al caricamento della pagina
    window.addEventListener('load', hideAdBlockModal);

    // Esegui la funzione ogni 2 secondi per gestire il caso in cui il modal e l'overlay vengono caricati dinamicamente
    setInterval(hideAdBlockModal, 2000);
})();
