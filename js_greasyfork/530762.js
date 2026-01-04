// ==UserScript==
// @name         MyDealz Profilseite Kommentar-Hover-Popup
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Zeigt vollständigen Kommentartext in einem Popup beim Hover über Links auf MyDealz Profilseiten
// @author       MD928835
// @license      MIT
// @match        https://www.mydealz.de/profile/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530762/MyDealz%20Profilseite%20Kommentar-Hover-Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/530762/MyDealz%20Profilseite%20Kommentar-Hover-Popup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Style für das Popup
    const popupStyle = `
        position: absolute;
        background-color: white;
        border: 1px solid #ccc;
        padding: 8px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
        border-radius: 6px;
        z-index: 9999;
        display: none;
        max-width: 600px;
        word-wrap: break-word;
        overflow: auto;
    `;

    // Popup erstellen
    const popup = document.createElement('div');
    popup.style = popupStyle;
    document.body.appendChild(popup);

    // Event-Handler für Hover-Effekte
    document.addEventListener('mouseover', function(event) {
        const target = event.target.closest('a'); // Sicherstellen, dass es ein Link ist
        if (target && target.querySelector('.lineClamp--all-3')) {
            popup.textContent = target.querySelector('.lineClamp--all-3').textContent.trim();
            const rect = target.getBoundingClientRect();
            popup.style.left = `${window.pageXOffset + rect.left}px`;
            popup.style.top = `${window.pageYOffset + rect.bottom + 5}px`; // Leichter Abstand unter dem Link
            popup.style.display = 'block';
        }
    });

    document.addEventListener('mouseout', function(event) {
        const target = event.target.closest('a');
        if (target && target.querySelector('.lineClamp--all-3')) {
            popup.style.display = 'none';
        }
    });
})();
