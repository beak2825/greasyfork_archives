// ==UserScript==
// @name         AllowRightClick&Pasta&copy&cut&drag&drop&selectstart
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Enable Right Click, Paste, Copy, Cut, Drag, Drop, and Text Selection
// @author       MegaBOuSsOl
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/429968/AllowRightClickPastacopycutdragdropselectstart.user.js
// @updateURL https://update.greasyfork.org/scripts/429968/AllowRightClickPastacopycutdragdropselectstart.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Activer le menu contextuel
    document.oncontextmenu = null;

    // Fonction générique pour autoriser les événements
    function allowEvent(event) {
        event.stopPropagation(); // Empêche la propagation de l'événement
        return true;
    }

    // Liste des événements à autoriser
    const events = [
        'paste',   // Autoriser le collage
        'copy',    // Autoriser la copie
        'cut',     // Autoriser le couper
        'drag',    // Autoriser le glisser
        'drop',    // Autoriser le déposer
        'selectstart' // Autoriser la sélection de texte
    ];

    // Ajouter des écouteurs pour chaque événement
    events.forEach(eventType => {
        document.addEventListener(eventType, allowEvent, true);
    });

    console.log('Right Click, Paste, Copy, Cut, Drag, Drop, and Text Selection enabled!');
})();