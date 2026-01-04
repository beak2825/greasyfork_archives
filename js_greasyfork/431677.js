// ==UserScript==
// @name         La Stampa/Repubblica Adblock Modal Remover
// @name:it      La Stampa/Repubblica Elimina Messaggio Adblock
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove the adblock modal on lastampa.it and repubblica.it
// @description:it  Elimina il messaggio modale che impedisce l'uso dei siti di La Stampa (lastampa.it) e Repubblica (repubblica.it) in caso di presenza di adblocker
// @author       CAFxX
// @match        https://*.lastampa.it/*
// @match        https://*.repubblica.it/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431677/La%20StampaRepubblica%20Adblock%20Modal%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/431677/La%20StampaRepubblica%20Adblock%20Modal%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const log = (...args) => console.log("gedi-adblock-modal-remover:", ...args);
    log("starting");

    let attempts = 0;
    const mangle = () => {
        document.querySelector("body").style.overflow = "";
        const overlay = document.querySelector("div.fc-ab-root");
        if (overlay != null) {
            overlay.style.setProperty("display", "none", "important");
            log("overlay hidden");
        } else if (attempts < 200) {
            attempts++;
            setTimeout(mangle, 250);
            log("overlay not found: retrying");
        } else {
            log("overlay not found");
        }
    };

    mangle();
})();