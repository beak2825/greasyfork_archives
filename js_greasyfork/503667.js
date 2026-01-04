// ==UserScript==
// @name         Collapse all Collages
// @namespace    empornium.is
// @version      0.1
// @description  Führt den onclick-Befehl für alle Links mit dem Text [HIDE] aus
// @author       b1100101
// @match        http*://www.empornium.is/userhistory.php*
// @match        http*://empornium.is/userhistory.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503667/Collapse%20all%20Collages.user.js
// @updateURL https://update.greasyfork.org/scripts/503667/Collapse%20all%20Collages.meta.js
// ==/UserScript==


// Funktion, um alle Links mit dem Text [HIDE] zu finden
function executeOnClickForHideLinks() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        if (link.textContent.includes('[Hide]') && link.onclick) {
            link.onclick(); // onclick-Befehl ausführen
        }
    });
}

    // Skript ausführen, wenn die Seite geladen ist
//    window.addEventListener('load', executeOnClickForHideLinks);
executeOnClickForHideLinks();
