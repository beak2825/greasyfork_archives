// ==UserScript==
// @name         Filtruj ID zamówień i EAN (Poprawione zapisywanie EAN)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Pobieranie ID zamówień i EAN z SellAsist bez ucinania EAN
// @author       Dawid
// @match        https://premiumtechpanel.sellasist.pl/*
// @grant        none
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/523924/Filtruj%20ID%20zam%C3%B3wie%C5%84%20i%20EAN%20%28Poprawione%20zapisywanie%20EAN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523924/Filtruj%20ID%20zam%C3%B3wie%C5%84%20i%20EAN%20%28Poprawione%20zapisywanie%20EAN%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const tableBody = document.querySelector('table tbody');
    if (!tableBody) {
        console.log('Sekcja tbody nie została znaleziona!');
        return;
    }
    const rows = tableBody.querySelectorAll('tr');
    const result = [];
    rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 1) {
            const idData = cells[1].innerText.trim();
            const idMatch = idData.match(/id:\s*(\d+)/i);
            const orderId = idMatch ? idMatch[1] : null;
            const productData = cells[2].innerText.trim();
            const eanMatches = productData.match(/\b\d{8,13}\b/g);
            const ean = eanMatches ? eanMatches.map(e => `"${e}"`).join('; ') : null;
            console.log(`Wiersz ${index}: ID=${orderId}, EAN=${ean}`);
            if (orderId && ean) {
                result.push({ orderId, ean });
            }
        }
    });
    if (result.length === 0) {
        console.log('Nie znaleziono żadnych danych!');
        alert('Nie znaleziono danych do zapisania. Sprawdź strukturę tabeli.');
        return;
    }
    const csvContent = "data:text/csv;charset=utf-8,"
        + "ID zamówienia,EAN\n"
        + result.map(e => `${e.orderId},${e.ean}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "zamowienia_i_eany.csv");
    document.body.appendChild(link);
    link.click();
    console.log('Plik został wygenerowany.');
})();
