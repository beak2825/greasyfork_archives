// ==UserScript==
// @name         Rozhodčí + popis zápasu + Soupiska + Střelci a karty
// @namespace    http://tampermonkey.net/
// @version      2025-02-21
// @description  Scrappování pro hanspu
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539976/Rozhod%C4%8D%C3%AD%20%2B%20popis%20z%C3%A1pasu%20%2B%20Soupiska%20%2B%20St%C5%99elci%20a%20karty.user.js
// @updateURL https://update.greasyfork.org/scripts/539976/Rozhod%C4%8D%C3%AD%20%2B%20popis%20z%C3%A1pasu%20%2B%20Soupiska%20%2B%20St%C5%99elci%20a%20karty.meta.js
// ==/UserScript==

let containerElements = document.querySelectorAll('.container');

// Prochází všechny nalezené elementy
containerElements.forEach(container => {
    // Zkontroluje, jestli obsahuje text 'Detaily utkání'
    if (container.textContent.includes('Detaily utkání')) {
        console.log('Nalezený container obsahující "Detaily utkání":');
        console.log(container); // Vypíše celý container do konzole

        // Najde všechny tabulky s třídou 'component__table has-wrapper' v tomto containeru
        let tablesWrapper = container.querySelectorAll('table.component__table.has-wrapper');

        // Zkontroluje, jestli existuje alespoň jedna tabulka
        if (tablesWrapper.length > 0) {
            // Zpracuje první tabulku
            processTable(tablesWrapper[0], 'První');
        } else {
            console.log('První tabulka s třídou "component__table has-wrapper" nebyla nalezena.');
        }

        // Zpracuje třetí tabulku (pokud existuje)
        if (tablesWrapper.length > 2) {
            processTable(tablesWrapper[2], 'Třetí');
        } else {
            console.log('Třetí tabulka s třídou "component__table has-wrapper" nebyla nalezena.');
        }
    }
});

// Funkce pro zpracování tabulky
function processTable(table, tablePosition) {
    console.log(`${tablePosition} nalezená tabulka s třídou "component__table has-wrapper":`);
    console.log(table); // Vypíše tabulku do konzole

    // Hledá první tabulku s třídou 'component__table is-inside has-smaller-text' *pouze* uvnitř tabulky
    let smallerTable = table.querySelector('table.component__table.is-inside.has-smaller-text');

    // Zkontroluje, jestli byla nalezena nějaká tabulka s touto třídou
    if (smallerTable) {
        console.log(`První nalezená tabulka s třídou "component__table is-inside has-smaller-text" v ${tablePosition} tabulce:`);
        console.log(smallerTable); // Vypíše tabulku

        // Najde všechny řádky v této tabulce
        let rows = smallerTable.querySelectorAll('tr');

        // Prochází řádky a zpracovává góly a hráče
        rows.forEach((row, index) => {
            console.log(`\n--- Řádek ${index + 1} ---`);

            let cells = row.querySelectorAll('td, th');

            // Ověříme, že máme dostatek buněk ve řádku
            if (cells.length > 1) {
                let homeTeamPlayers = cells[0].innerHTML.trim();
                let awayTeamPlayers = cells[2].innerHTML.trim();

                // Přidáme označení pro nejlepšího hráče a kapitána v domácím týmu
                homeTeamPlayers = markSpecialPlayers(homeTeamPlayers);
                awayTeamPlayers = markSpecialPlayers(awayTeamPlayers);

                console.log('Domácí tým:', homeTeamPlayers);
                console.log('Hostující tým:', awayTeamPlayers);
            } else {
                console.log('Řádek nemá dostatek buněk, aby byl zpracován správně.');
            }
        });
    } else {
        console.log(`Tabulka s třídou "component__table is-inside has-smaller-text" v ${tablePosition} tabulce nebyla nalezena.`);
    }

    // Pokračování zpracování druhé tabulky uvnitř této tabulky
    let secondTables = table.querySelectorAll('table.component__table.is-inside.has-smaller-text');

    if (secondTables.length > 1) {
        let secondTable = secondTables[1]; // Získáme druhou tabulku s požadovanou třídou
        console.log(`Druhá tabulka s class="component__table is-inside has-smaller-text" v rámci ${tablePosition} tabulky:`);
        console.log(secondTable); // Vypíše druhou tabulku s požadovanou třídou

        // Najdeme všechny řádky v této tabulce
        let rows = secondTable.querySelectorAll('tr');

        // Zpracujeme první řádek (Záhlaví)
        let headerRow = rows[0];
        let headers = headerRow.querySelectorAll('th');
        // Vynecháme vypsání záhlaví, protože už ho nebudeme potřebovat

        // Zpracujeme druhý řádek (Data)
        let dataRow = rows[1];
        let dataCells = dataRow.querySelectorAll('td');

        // Extrahujeme góly a karty pro domácí a hosty
        let homeGoals = dataCells[0].textContent.trim();
        let homeCards = dataCells[1].textContent.trim();
        let separator = dataCells[2]; // Tento je prázdný
        let awayGoals = dataCells[3].textContent.trim();
        let awayCards = dataCells[4].textContent.trim();

        // Vynecháme nepotřebné karty a góly
        console.log("\nDomácí tým:");
        console.log("Góly:", homeGoals);
        console.log("Karty:", homeCards);

        console.log("\nHostující tým:");
        console.log("Góly:", awayGoals);
        console.log("Karty:", awayCards);
    } else {
        console.log(`Druhá tabulka s class="component__table is-inside has-smaller-text" v rámci ${tablePosition} tabulky nebyla nalezena.`);
    }

    // Získání popisu zápasu a rozhodčího pro tuto tabulku
    let rows = table.querySelectorAll('tr');
    if (rows.length > 3) {
        let fourthRow = rows[3]; // Čtvrtý řádek (index 3)
        console.log("\n--- Čtvrtý řádek ---");
        console.log(fourthRow); // Vypíše čtvrtý řádek

        // Vybere všechny <tr> v rámci čtvrtého řádku
        let nestedRows = fourthRow.querySelectorAll('tr');

        if (nestedRows.length === 2) {
            let firstTr = nestedRows[0]; // První <tr>
            let secondTr = nestedRows[1]; // Druhý <tr>

            // Získání dat z prvního <tr>
            let headers = firstTr.querySelectorAll('th');
            let descriptionHeader = headers[0].textContent.trim(); // Popis zápasu
            let refereeHeader = headers[1].textContent.trim(); // Rozhodčí

            // Získání dat z druhého <tr>
            let dataCells = secondTr.querySelectorAll('td');
            let matchDescription = dataCells[0].textContent.trim(); // Popis zápasu
            let referee = dataCells[1].textContent.trim(); // Rozhodčí

            console.log('Popis zápasu:', matchDescription);
            console.log('Rozhodčí:', referee);
        } else {
            console.log('Čtvrtý řádek neobsahuje přesně dva vnořené tr.');
        }
    } else {
        console.log('Tabulka nemá čtvrtý řádek.');
    }
}

// Funkce pro označení nejlepších hráčů a kapitánů
function markSpecialPlayers(playersHtml) {
    // Používáme regulární výraz pro nahrazení označení "Hráč utkání" a "Kapitán"
    playersHtml = playersHtml.replace(/<span class="is-best">([^<]+)<\/span>/g, '$1 [Hráč utkání]');
    playersHtml = playersHtml.replace(/<span class="is-captain">([^<]+)<\/span>/g, '$1 [Kapitán]');

    return playersHtml;
}