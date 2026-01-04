// ==UserScript==
// @name         Prime Video – Overlays & störende Elemente entfernen
// @version      1.0
// @description  Entfernt dauerhaft bestimmte störende Elemente auf Prime Video
// @match        *://*.amazon.de/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1490992
// @downloadURL https://update.greasyfork.org/scripts/541452/Prime%20Video%20%E2%80%93%20Overlays%20%20st%C3%B6rende%20Elemente%20entfernen.user.js
// @updateURL https://update.greasyfork.org/scripts/541452/Prime%20Video%20%E2%80%93%20Overlays%20%20st%C3%B6rende%20Elemente%20entfernen.meta.js
// ==/UserScript==

(function() {
    'use strict';

const selektoren = [
    '.widgetGroupView.vertical.f1hoalfx', //Xray Liste
    '.fkpovp9.f8hspre.hide', // dunkler Hintergrund
    '.collapsibleXrayVodHeader', //Xray Schild
    '.atvwebplayersdk-hideabletopbuttons-container', //Knopfe Oben auser "Playerschließen"
];


    function removeElements() {
        selektoren.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.remove();
                console.log(`Entfernt: ${sel}`);
            });
        });
    }

    // Initial ausführen
    removeElements();

    // Beobachtet DOM-Änderungen (z. B. bei neu geladenem Inhalt)
    const observer = new MutationObserver(() => {
        removeElements();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
