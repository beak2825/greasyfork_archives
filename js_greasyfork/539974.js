// ==UserScript==
// @name         Střelci
// @namespace    http://tampermonkey.net/
// @version      2025-02-21
// @description  Střelecký skript
// @author       You
// @match        https://cs.wikipedia.org/wiki/Japonsk%C3%BD_c%C3%ADsa%C5%99
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539974/St%C5%99elci.user.js
// @updateURL https://update.greasyfork.org/scripts/539974/St%C5%99elci.meta.js
// ==/UserScript==

// Funkce pro extrakci gólů a karet z tabulek obsahujících text "Góly"
function getGoalsAndCardsFromTables() {
    // Najdi všechny tabulky s požadovanou třídou
    let tables = document.querySelectorAll('.component__table.is-inside.has-smaller-text');

    let matchData = [];

    tables.forEach(table => {
        // Zkontroluj, zda tabulka obsahuje text "Góly"
        let headerCells = table.querySelectorAll('th');
        let containsGoals = Array.from(headerCells).some(cell => cell.innerText.includes('Góly'));

        // Pokud tabulka obsahuje text "Góly"
        if (containsGoals) {
            // Získání všech řádků tabulky
            let rows = table.querySelectorAll('tbody > tr');

            rows.forEach(row => {
                // Hledání textu v konkrétních sloupcích pro góly
                let goalColumnAway = row.querySelector('td:nth-child(4)');  // Sloupec pro góly hostujícího týmu
                let goalColumnHome = row.querySelector('td:nth-child(1)');  // Sloupec pro góly domácího týmu

                // Extrakce karet (pokud jsou)
                let cardColumnAway = row.querySelector('td:nth-child(5)');  // Sloupec pro karty hostujícího týmu
                let cardColumnHome = row.querySelector('td:nth-child(2)');  // Sloupec pro karty domácího týmu

                // Inicializace karet pro týmy
                let homeCards = [];
                let awayCards = [];

                // Pokud byly nějaké karty u hostujícího týmu
                if (cardColumnAway) {
                    let cardsAway = cardColumnAway.querySelectorAll('.component__table-card');
                    cardsAway.forEach(card => awayCards.push(card.innerText.trim()));
                }

                // Pokud byly nějaké karty u domácího týmu
                if (cardColumnHome) {
                    let cardsHome = cardColumnHome.querySelectorAll('.component__table-card');
                    cardsHome.forEach(card => homeCards.push(card.innerText.trim()));
                }

                // Pokud byly nějaké góly u hostujícího týmu
                if (goalColumnAway && goalColumnAway.innerText.trim()) {
                    matchData.push({
                        team: 'Away',
                        goals: goalColumnAway.innerText.trim(),
                        cards: awayCards
                    });
                }

                // Pokud byly nějaké góly u domácího týmu
                if (goalColumnHome && goalColumnHome.innerText.trim()) {
                    matchData.push({
                        team: 'Home',
                        goals: goalColumnHome.innerText.trim(),
                        cards: homeCards
                    });
                }
            });
        }
    });

    return matchData;
}

// Zavolání funkce a vypsání výsledku
let matchDetails = getGoalsAndCardsFromTables();
console.log(matchDetails);
