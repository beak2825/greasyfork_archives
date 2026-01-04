// ==UserScript==
// @name         Shoptet "Zvetseni fontu mnozstvi produktu"
// @namespace    mailto:azuzula.cz@gmail.com
// @version      0.33
// @description  Na stránce s kompletací objednávky zvětší čísla množství produktů a podbarví pole, když je víc než 1ks
// @author       Zuzana Nyiri
// @match        */admin/objednavky-detail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420582/Shoptet%20%22Zvetseni%20fontu%20mnozstvi%20produktu%22.user.js
// @updateURL https://update.greasyfork.org/scripts/420582/Shoptet%20%22Zvetseni%20fontu%20mnozstvi%20produktu%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Najdeme tabulku podle ID
    var table = document.getElementById("orderCompletionTable");
    if (!table) {
        return; // Pokud tabulka neexistuje, nic neděláme
    }

    // Projdeme všechny řádky v těle tabulky (tbody)
    var rows = table.querySelectorAll("tbody tr");
    rows.forEach(function(row) {
        // Zkusíme najít buňku s atributem data-testid="cellCompletionItemAmount"
        var quantityCell = row.querySelector("[data-testid='cellCompletionItemAmount']");
        if (!quantityCell) {
            return;
        }

        var quantityText = quantityCell.innerText.trim();
        var quantity = parseInt(quantityText, 10);

        // Zvýrazníme, pokud je počet větší než 1
        if (quantity > 1) {
            quantityCell.style.backgroundColor = "greenyellow";
        }

        // A nastavíme, aby byl font vždy velký a tučný
        quantityCell.style.fontSize = "large";
        quantityCell.style.fontWeight = "bold";
    });
})();