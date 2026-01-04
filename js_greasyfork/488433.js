// ==UserScript==
// @name         Kapiland ProdZeiten
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Zeigt bei Produktionsgebäuden den Fertigstellungstermin, statt der Dauer an
// @author       jockel09
// @match        http://*.kapilands.eu/main.php?page=gebs*
// @icon         https://www.google.com/s2/favicons?domain=kapiland.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488433/Kapiland%20ProdZeiten.user.js
// @updateURL https://update.greasyfork.org/scripts/488433/Kapiland%20ProdZeiten.meta.js
// ==/UserScript==

function berechneUndAktualisiereZeit() {
  const zeilen = document.querySelectorAll('tr');
  zeilen.forEach(function(zeile) {
    const ersteTd = zeile.querySelector('td:first-child');
    if (ersteTd && /[0-9]{6,}/.test(ersteTd.textContent) && ersteTd.textContent.includes(':')) {
      const letzteTd = zeile.querySelector('td:last-child');
      const linkElement = letzteTd.querySelector('a');
      if (linkElement) {
        const dauerText = linkElement.textContent;
        const teile = dauerText.split(":");
        if (teile.length === 3) {
          const stunden = parseInt(teile[0], 10);
          const minuten = parseInt(teile[1], 10);
          const sekunden = parseInt(teile[2], 10);

          const jetzt = new Date();
          const fertigstellungsdatum = new Date(jetzt.getTime() + stunden*3600000 + minuten*60000 + sekunden*1000);

          const heute = new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate());
          const morgen = new Date(heute.getTime() + 86400000);
          const uebermorgen = new Date(morgen.getTime() + 86400000);

          if (fertigstellungsdatum >= heute && fertigstellungsdatum < morgen) {
            const stunde = fertigstellungsdatum.getHours().toString().padStart(2, "0");
            const minute = fertigstellungsdatum.getMinutes().toString().padStart(2, "0");
            linkElement.textContent = `heute, ${stunde}:${minute} Uhr`;
          } else if (fertigstellungsdatum >= morgen && fertigstellungsdatum < uebermorgen) {
            const stunde = fertigstellungsdatum.getHours().toString().padStart(2, "0");
            const minute = fertigstellungsdatum.getMinutes().toString().padStart(2, "0");
            linkElement.textContent = `morgen, ${stunde}:${minute} Uhr`;
          } else {
            const tag = fertigstellungsdatum.getDate().toString().padStart(2, "0");
            const monat = (fertigstellungsdatum.getMonth() + 1).toString().padStart(2, "0");
            const jahr = fertigstellungsdatum.getFullYear();
            const stunde = fertigstellungsdatum.getHours().toString().padStart(2, "0");
            const minute = fertigstellungsdatum.getMinutes().toString().padStart(2, "0");
            linkElement.textContent = `${tag}.${monat}.${jahr} ${stunde}:${minute} Uhr`;
          }
        }
      }
    }
  });
}

berechneUndAktualisiereZeit();