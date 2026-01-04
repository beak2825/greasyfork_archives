// ==UserScript==
// @name         Cacher Annonces sur Gmail
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Cache les lignes contenant 'Annonce' dans les spans sur Gmail
// @author       Gann
// @match        https://mail.google.com/*
// @grant        none
// @license MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/510233/Cacher%20Annonces%20sur%20Gmail.user.js
// @updateURL https://update.greasyfork.org/scripts/510233/Cacher%20Annonces%20sur%20Gmail.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fonction pour vérifier et cacher les rows
    function hideAnnonceRows() {
        const rows = document.querySelectorAll('tr');
        rows.forEach(row => {
            const spans = row.querySelectorAll('span');
            spans.forEach(span => {
                if (span.textContent.includes("Annonce")) {
                    row.style.display = 'none';
                }
            });
        });
    }

    // Exécute la fonction après que le DOM soit entièrement chargé
    window.addEventListener('load', hideAnnonceRows);

    // Pour Gmail, qui charge les contenus dynamiquement, on utilise une observation sur le body
    const observer = new MutationObserver(hideAnnonceRows);
    observer.observe(document.body, { childList: true, subtree: true });
})();