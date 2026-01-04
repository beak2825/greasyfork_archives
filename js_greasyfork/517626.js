// ==UserScript==
// @name         Fix "Show Another Film" Position
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  Positions the "Show Another Recommendation" link on Criticker.com statically below the Top Recommendation headline.
// @author       Alsweider
// @match        https://www.criticker.com/
// @match        https://games.criticker.com/
// @icon         https://www.criticker.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517626/Fix%20%22Show%20Another%20Film%22%20Position.user.js
// @updateURL https://update.greasyfork.org/scripts/517626/Fix%20%22Show%20Another%20Film%22%20Position.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const fixLinkPosition = () => {
        const mainRecDiv = document.querySelector('.rc_toprec'); // Hauptcontainer für die Top-Empfehlung
        const header = mainRecDiv?.querySelector('h3.bold'); // Überschrift "Top Recommendation"
        const linkDiv = mainRecDiv?.querySelector('.titlerow_showanother'); // "Show Another Recommendation"-Link

        if (mainRecDiv && header && linkDiv) {
            // Link an der alten Position entfernen, falls noch vorhanden
            document.querySelectorAll('.titlerow_showanother').forEach(el => {
                if (el !== linkDiv) el.remove();
            });

            // Falls der Link noch nicht an der richtigen Stelle ist, verschieben
            if (linkDiv.parentElement !== mainRecDiv) {
                mainRecDiv.insertBefore(linkDiv, header.nextSibling);
                linkDiv.style.marginTop = '-20px'; // Abstand nach oben
                linkDiv.style.marginBottom = '0px'; // Abstand nach unten
            }
        }
    };

    // MutationObserver zur Erkennung von Änderungen auf der Seite
    const observer = new MutationObserver(() => {
        fixLinkPosition();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initiales Fixieren des Links
    window.addEventListener('load', fixLinkPosition);
})();
