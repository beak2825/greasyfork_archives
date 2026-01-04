// ==UserScript==
// @name         Sort Files by Size on Bunkr (GB > MB > KB)
// @namespace    miep
// @version      1.1
// @description  Automatically sort files by size on Bunkr website, prioritizing GB > MB > KB
// @author       jAstn
// @match        https://bunkr.site/*
// @match        https://bunkr.*/*
// @include      https://bunkr.*/*
// @icon         https://dash.bunkr.pk/assets/img/icon.svg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495966/Sort%20Files%20by%20Size%20on%20Bunkr%20%28GB%20%3E%20MB%20%3E%20KB%29.user.js
// @updateURL https://update.greasyfork.org/scripts/495966/Sort%20Files%20by%20Size%20on%20Bunkr%20%28GB%20%3E%20MB%20%3E%20KB%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funktion, um Dateigröße zu analysieren und in MB umzurechnen
    function parseSize(sizeText) {
        let size = 0;

        if (sizeText.includes('GB')) {
            size = parseFloat(sizeText.replace(' GB', '').replace(',', '')) * 1024; // Umrechnen in MB
        } else if (sizeText.includes('MB')) {
            size = parseFloat(sizeText.replace(' MB', '').replace(',', '')); // MB bleiben unverändert
        } else if (sizeText.includes('KB')) {
            size = parseFloat(sizeText.replace(' KB', '').replace(',', '')) / 1024; // Umrechnen in MB
        }

        return size; // Rückgabe in MB
    }

    // Funktion, um die Dateien nach Größe (GB > MB > KB) zu sortieren
    function sortFilesBySize() {
        // Finde die Tabelle mit den Dateien
        const table = document.querySelector('.grid-images');
        if (!table) return; // Wenn keine Tabelle gefunden wurde, Skript abbrechen

        // Hole alle Datei-Container
        const items = Array.from(table.querySelectorAll('.theItem'));

        // Sortiere die Dateien nach Größe
        items.sort((a, b) => {
            const sizeA = parseSize(a.querySelector('.theSize').textContent);
            const sizeB = parseSize(b.querySelector('.theSize').textContent);
            return sizeB - sizeA; // Absteigend sortieren
        });

        // Füge die sortierten Elemente wieder in die Tabelle ein
        items.forEach(item => table.appendChild(item));

        console.log('Dateien wurden erfolgreich nach GB > MB > KB sortiert.');
    }

    // Warten, bis die Seite vollständig geladen ist, und dann das Skript ausführen
    window.addEventListener('load', () => {
        sortFilesBySize();
    });
})();

// CSS
let overlayCSS = `
<style>

 :is(input,textarea,select):focus {
    --tw-ring-opacity: .0;
    --tw-ring-shadow: 0;
}

.grid-images_box-img {
    width: 100%;
    height: 220px;
}

.gap-6 {
    gap: 0.5rem;
}
    .cont {
        max-width: 1500px !important;
    }
        .lg\:\[--size\:14rem\] {
        --size: 14rem;
        width: 1850px;
    }
    .gap-4 {
    gap: 0rem;
}

img {
  image-rendering: -webkit-optimize-contrast;
}
</style>
`

let overlay = document.createElement("div");
overlay.innerHTML = overlayCSS;
document.body.appendChild(overlay);