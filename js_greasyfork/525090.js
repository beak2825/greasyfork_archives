// ==UserScript==
// @name         Enable Scrollbar
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Abilita lo scroll e rimuove elementi indesiderati su Skuola.net
// @author       Flejta
// @match        https://www.skuola.net/*
// @match        https://ricerca.skuola.net/*
// @match        https://forum.skuola.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525090/Enable%20Scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/525090/Enable%20Scrollbar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funzione principale per le modifiche
    function applyChanges() {
        // Abilita lo scrolling
        document.body.style.overflow = 'auto';

        // Rimuove cookie interceptor
        const cookieInterceptor = document.getElementById('cookie-click-interceptor');
        if(cookieInterceptor) cookieInterceptor.remove();

        // Rimuove i video player
        document.querySelectorAll('video.vjs-tech[role="application"]').forEach(player => player.remove());
    }

    // MutationObserver per rilevare modifiche al DOM
    const observer = new MutationObserver((mutations) => {
        applyChanges();
    });

    // Avvia l'osservazione del body e dei suoi discendenti
    window.addEventListener('load', () => {
        applyChanges(); // Esegui immediatamente al load
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
    });

    // Controllo aggiuntivo ogni 500ms per sicurezza
    setInterval(applyChanges, 500);

    // Forza il reapply dello stile ogni secondo (contro eventuali override)
    setInterval(() => {
        document.body.style.overflow = 'auto';
    }, 1000);

})();