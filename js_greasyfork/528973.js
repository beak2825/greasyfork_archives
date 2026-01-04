// ==UserScript==
// @name         Katastry - download QoL
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Přejmenování stránky na základě parcelního čísla, vlastníků nebo spravujícího subjektu a čísla LV, s možností nastavení vlastního formátu. Více vlastníků se zkrátí podle pravidla: 1–2 = jména, víc než 2 = počet+sufix (3–4_vlastnici, 5+_vlastniku).
// @author       Teodor Tomáš
// @match        *://*/ZobrazObjekt.aspx*
// @license      GNU GPLv3
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/528973/Katastry%20-%20download%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/528973/Katastry%20-%20download%20QoL.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("Tampermonkey skript spuštěn.");

    // Výchozí formát názvu – dostupné placeholdery: {cisloLV}, {jmeno}, {parcelniCislo}
    const defaultFormat = "Informace o pozemku - LV{cisloLV} - {jmeno} - {parcelniCislo}";
    let formatString = GM_getValue("formatString", defaultFormat);

    // Registrace menu příkazu pro nastavení vlastního formátu
    GM_registerMenuCommand("Nastavit formát názvu", function() {
        const newFormat = prompt("Zadejte formát názvu stránky.\nPoužijte placeholdery: {cisloLV}, {jmeno}, {parcelniCislo}", formatString);
        if (newFormat && newFormat.trim() !== "") {
            GM_setValue("formatString", newFormat);
            formatString = newFormat;
            alert("Nový formát uložen. Změny se projeví při další aktualizaci názvu stránky.");
        }
    });

    // Funkce pro vyhledání textu a extrakci hodnoty za štítkem
    function getTextAfterLabel(labelText) {
        const labelElement = [...document.querySelectorAll('td.nazev')]
            .find(el => el.textContent.includes(labelText));
        if (labelElement) {
            const valueElement = labelElement.nextElementSibling;
            return valueElement ? valueElement.textContent.trim() : null;
        }
        return null;
    }

    // Funkce pro úpravu jména (odstranění diakritiky, mezer, teček atd.)
    function processName(name) {
        if (!name) return null;
        name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // odstranění diakritiky
        name = name.replace(" a ", "_a_"); // SJ edit
        name = name.replace("s.r.o.", "_sro");
        name = name.replace("a.s.", "_as");
        name = name.replace(/\b\w/g, char => char.toUpperCase());
        name = name.replace(/\s+/g, ""); // odstranění mezer
        name = name.replace(/\./g, ""); // odstranění teček
        name = name.replace("SJ", "SJ_"); // SJ edit
        return name;
    }

    // Funkce pro odstranění teček
    function removeDots(str) {
        return str ? str.replace(/\./g, "") : "";
    }

    // Upravená funkce pro získání vlastníků z tabulky (sekce "Vlastnické právo")
    // Ignoruje řádky, kde TD má class="partnerSJM"
    function getOwners() {
        let owners = [];
        const table = document.querySelector("table.vlastnici");
        if (!table) return null;
        const rows = table.querySelectorAll("tbody > tr");
        let ownersStarted = false;
        for (let row of rows) {
            // pokud buňka partnerSJM existuje, přeskočíme tento řádek
            if (row.querySelector("td.partnerSJM")) {
                continue;
            }
            // Hledáme řádek s hlavičkou "Vlastnické právo"
            if (row.querySelector("th")) {
                if (row.textContent.includes("Vlastnické právo")) {
                    ownersStarted = true;
                    continue;
                } else if (ownersStarted) {
                    // Když jsme již v sekci a narazíme na další hlavičku, sběr vlastníků končí
                    break;
                }
            }
            if (ownersStarted) {
                const td = row.querySelector("td");
                if (td) {
                    let name = td.textContent.split(",")[0].trim();
                    name = processName(name);
                    owners.push(name);
                }
            }
        }
        // Pokud je pouze jeden nebo dva vlastníci, vypíšeme jejich jména oddělená podtržítkem
        if (owners.length <= 2) {
            return owners.length > 0 ? owners.join("_") : null;
        } else {
            // Pokud je více než 2 vlastníků:
            // Pro 3-4 vlastníky použijeme formát: "3_vlastnici" (resp. "4_vlastnici")
            // Pro 5 a více vlastníků: "X_vlastniku"
            if (owners.length <= 4) {
                return owners.length + "_vlastnici";
            } else {
                return owners.length + "_vlastniku";
            }
        }
    }

    // Funkce pro získání subjektu spravujícího pozemek – hledá varianty:
    // "hospodař" (např. Právo hospodařit, Příslušnost hospodařit) a "správa nemovitostí" s "kraje"
    function getManagementSubject() {
        const thElements = document.querySelectorAll("table.vlastnici th");
        for (let th of thElements) {
            const lowerText = th.textContent.toLowerCase();
            if (
                lowerText.includes("hospodař") ||
                (lowerText.includes("správa nemovitostí") && lowerText.includes("kraje"))
            ) {
                const tr = th.closest("tr");
                if (tr && tr.nextElementSibling) {
                    const td = tr.nextElementSibling.querySelector("td");
                    if (td) return td.textContent.trim();
                }
            }
        }
        return null;
    }

    // Extrakce parcelního čísla a čísla LV
    let parcelniCislo = getTextAfterLabel('Parcelní číslo:');
    console.log("Parcelní číslo:", parcelniCislo);

    let cisloLV = getTextAfterLabel('Číslo LV:');
    console.log("Číslo LV:", cisloLV);

    // Získání subjektu spravujícího pozemek (např. pozemek ve správě nebo hospodaření)
    let subject = getManagementSubject();
    if (subject) {
        subject = subject.split(",")[0].trim();
        subject = processName(subject);
    }
    console.log("Subjekt správy/hospodaření:", subject);

    // Získání vlastníků – pokud není nalezen subjekt, použijeme vlastníky
    let owners = getOwners();
    console.log("Vlastníci:", owners);

    // Volba výsledného jména: pokud je definován subjekt (správa/hospodaření), použije se on, jinak vlastníci.
    let jmeno = subject ? subject : (owners ? owners : null);

    // Pokud máme všechny potřebné informace, sestavíme nový název stránky podle formátu
    if (parcelniCislo && cisloLV && jmeno) {
        parcelniCislo = removeDots(parcelniCislo);
        // Nahrazení lomítek podtržítky
        parcelniCislo = parcelniCislo.replace(/\//g, "_");
        jmeno = removeDots(jmeno);
        cisloLV = removeDots(cisloLV);

        let novyNazev = formatString;
        novyNazev = novyNazev.replace("{cisloLV}", cisloLV)
                             .replace("{jmeno}", jmeno)
                             .replace("{parcelniCislo}", parcelniCislo);
        console.log("Nový název stránky:", novyNazev);
        document.title = novyNazev;
    } else {
        console.warn("Nepodařilo se získat všechny potřebné informace. Název stránky nebude změněn.");
    }
})();
