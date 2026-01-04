// ==UserScript==
// @name         Link Opener
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Öffnet Links im Browser und ermöglicht Whitelisting
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530901/Link%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/530901/Link%20Opener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Whitelist für bestimmte Links
    var whitelist = [
        'https://example.com', // Beispiel-URL für Whitelisting
        'https://google.com',  // Beispiel-URL für Whitelisting
        // Fügen Sie hier weitere URLs hinzu, die Sie in der App öffnen möchten
    ];

    // Funktion, um Links zu modifizieren
    function modifyLinks() {
        // Alle Links auf der Seite finden
        var links = document.querySelectorAll('a');

        // Jeden Link durchgehen
        links.forEach(function(link) {
            // Prüfen, ob der Link in der Whitelist ist
            if (whitelist.includes(link.href)) {
                // Link bleibt unverändert, falls er in der Whitelist ist
                return;
            }

            // Prüfen, ob der Link eine App öffnen würde
            if (link.href.startsWith('https://') || link.href.startsWith('http://')) {
                // Den Link so ändern, dass er im Browser geöffnet wird
                link.target = '_self';
                // Optional: Den Link auf eine bestimmte Weise umleiten
                // link.href = link.href + '?browser=true';
            }
        });
    }

    // Funktion ausführen, wenn die Seite geladen ist
    document.addEventListener('DOMContentLoaded', function() {
        modifyLinks();
    });

    // Optional: Beim Klicken auf einen Link prüfen
    document.addEventListener('click', function(event) {
        if (event.target.tagName === 'A') {
            // Prüfen, ob der Link in der Whitelist ist
            if (whitelist.includes(event.target.href)) {
                return;
            }
            event.preventDefault();
            window.location.href = event.target.href;
        }
    });
})();
