// ==UserScript==
// @name         Leitstellenspiel - Bestimmte Erweiterungen 1.10
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Fügt einen Button hinzu, um bestimmte Erweiterungslinks nacheinander zu klicken
// @author       Brecheimer
// @match        https://www.leitstellenspiel.de/buildings/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502117/Leitstellenspiel%20-%20Bestimmte%20Erweiterungen%20110.user.js
// @updateURL https://update.greasyfork.org/scripts/502117/Leitstellenspiel%20-%20Bestimmte%20Erweiterungen%20110.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // IDs der Erweiterungen, die nacheinander geklickt werden sollen
    const targetCredits = [13, 12, 11, 10];
    const clickDelay = 100; // Wartezeit zwischen Klicks in Millisekunden (3 Sekunden)
    const csrfToken = document.querySelector('meta[name=csrf-token]')?.content;

    if (!csrfToken) {
        return;
    }

    // Funktion, um alle Ziel-Erweiterungslinks zu finden
    function findTargetExtensionLinks() {
        // Selektiere alle Links, die das Muster "/extension/credits/" enthalten
        return Array.from(document.querySelectorAll('#ausbauten a[href*="/extension/credits/"]')).filter(link => {
            // Überprüfe, ob der Link das Muster "/extension/credits/" enthält
            // und ob die Credits im href in der Liste der Ziel-Credits enthalten sind
            return targetCredits.some(credit => link.href.includes(`credits/${credit}?`));
        });
    }

    // Funktion, um Links nacheinander zu klicken
    async function clickLinksSequentially(links, index = 0) {
        if (typeof links[index] === 'undefined') {
            alert('Alle Ziel-Links wurden angeklickt.');
            return;
        }

        await buyExtension(links[index])
        // Warten, bis die Seite geladen ist oder eine kurze Verzögerung einfügen, bevor den nächsten Link klicken
        await new Promise(r => setTimeout(r, clickDelay));
        await clickLinksSequentially(links, index + 1)
    }

    // Funktion, um den Klick-Prozess zu starten
    async function startClickProcess() {
        const links = findTargetExtensionLinks();
        if (links.length > 0) {
            await clickLinksSequentially(links);
            window.location.reload();
        } else {
            alert('Keine passenden Erweiterungslinks gefunden. Stelle sicher, dass du auf der richtigen Seite bist.');
        }
    }

    async function buyExtension(link) {
        const formData = new FormData();
        formData.append('authenticity_token', csrfToken);

        try {
            const response = await fetch(link, {
                method: 'POST',
                body: new URLSearchParams(formData).toString()
            });

            if (!response.ok) {
                alert('Erweiterung konnte nicht gekauft werden.');
            }
        } catch (e) {
            alert('Erweiterung konnte nicht gekauft werden.');
        }
    }

    // Erstelle den neuen Button
    var newButton = document.createElement('button');
    newButton.innerText = 'Bestimmte Erweiterungen nacheinander kaufen';
    newButton.style.position = 'fixed';
    newButton.style.top = '10px';
    newButton.style.right = '10px';
    newButton.style.zIndex = '1000';
    newButton.style.backgroundColor = '#4CAF50';
    newButton.style.color = 'white';
    newButton.style.padding = '10px 20px';
    newButton.style.border = 'none';
    newButton.style.borderRadius = '5px';
    newButton.style.cursor = 'pointer';

    // Füge die Klick-Funktion hinzu
    newButton.addEventListener('click', startClickProcess);

    // Füge den neuen Button zum Dokument hinzu
    document.body.appendChild(newButton);
})();
