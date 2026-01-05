// ==UserScript==
// @name         Ws auto-refresh Pannello Settimanale
// @namespace    wsmanager
// @version      0.1.6.1
// @description  aggiorna automaticamente il pannello prenotazioni settimanale
// @author       FL
// @match        *://*.wansport.com/manager?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28345/Ws%20auto-refresh%20Pannello%20Settimanale.user.js
// @updateURL https://update.greasyfork.org/scripts/28345/Ws%20auto-refresh%20Pannello%20Settimanale.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var interval;

    if (typeof jQuery == 'undefined') {
        console.log("jQuery is not loaded");
    } else {
        console.log("jQuery is loaded");

        interval = setInterval(function() {
            var isPannelloSettimanale = (jQuery('#isPannelloSettimanale').val() == 1);

            if (isPannelloSettimanale === true) {
                // console.log("è pannello settimanale");

                WsPrenotazioniPannelloSettimanale.aggiornaPannello();
            }
        }, 120000);
    }
})();