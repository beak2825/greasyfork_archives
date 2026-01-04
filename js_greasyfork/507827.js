// ==UserScript==
// @name        Verbands-Lehrgangswächter
// @namespace   lukas2013.leitstellenspiel.de
// @version     2024.09.09_10
// @license     BSD-3-Clause
// @author      lukas2013
// @description Zeigt eine Liste aller verfügbaren Lehrgänge an und zeigt an, wie viele Lehrgänge hierzu offen sind.
// @match       https://www.leitstellenspiel.de/schoolings*
// @match       https://polizei.leitstellenspiel.de/schoolings*
// @icon        https://www.leitstellenspiel.de/favicon.ico
// @run-at      document-idle
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/507827/Verbands-Lehrgangsw%C3%A4chter.user.js
// @updateURL https://update.greasyfork.org/scripts/507827/Verbands-Lehrgangsw%C3%A4chter.meta.js
// ==/UserScript==

(function () {
    const predefinedSchoolings = [
        // Feuerwehr
        "Feuerwehr - GW-Messtechnik Lehrgang",
        "Feuerwehr - GW-Gefahrgut Lehrgang",
        "Feuerwehr - Höhenrettung Lehrgang",
        "Feuerwehr - ELW 2 Lehrgang",
        "Feuerwehr - Wechsellader Lehrgang",
        "Feuerwehr - Dekon-P Lehrgang",
        "Feuerwehr - Feuerwehrkran Lehrgang",
        "Feuerwehr - GW-Wasserrettung Lehrgang",
        "Feuerwehr - GW-Taucher Lehrgang",
        "Feuerwehr - Notarzt-Ausbildung",
        "Feuerwehr - Flugfeldlöschfahrzeug-Ausbildung",
        "Feuerwehr - Rettungstreppen-Ausbildung",
        "Feuerwehr - Werkfeuerwehr-Ausbildung",
        "Feuerwehr - Intensivpflege",
        "Feuerwehr - NEA200 Fortbildung",
        "Feuerwehr - Drohnen-Schulung",
        "Feuerwehr - Feuerwehr-Verpflegungseinheit",
        "Feuerwehr - Verpflegungshelfer",
        // Polizei
        "Polizei - Zugführer (leBefKw)",
        "Polizei - Hundertschaftsführer (FüKW)",
        "Polizei - Polizeihubschrauber",
        "Polizei - Wasserwerfer",
        "Polizei - SEK",
        "Polizei - MEK",
        "Polizei - Hundeführer (Schutzhund)",
        "Polizei - Motorradstaffel",
        "Polizei - Brandbekämpfung",
        "Polizei - Kriminalpolizei",
        "Polizei - Dienstgruppenleitung",
        "Polizei - Reiterstaffel",
        "Polizei - Windenoperator",
        // Rettungsdienst
        "Rettungsdienst - Notarzt-Ausbildung",
        "Rettungsdienst - LNA-Ausbildung",
        "Rettungsdienst - OrgL-Ausbildung",
        "Rettungsdienst - SEG - Einsatzleitung",
        "Rettungsdienst - SEG - GW-San",
        "Rettungsdienst - GW-Wasserrettung Lehrgang",
        "Rettungsdienst - GW-Taucher Lehrgang",
        "Rettungsdienst - Rettungshundeführer",
        "Rettungsdienst - Intensivpflege",
        "Rettungsdienst - Drohnenoperator",
        "Rettungsdienst - Betreuungsdienst",
        "Rettungsdienst - Verpflegungshelfer",
        "Rettungsdienst - Höhenretter",
        "Rettungsdienst - Windenoperator",
        "Rettungsdienst - Einsatzleiter Bergrettung",
        // THW
        "THW - Zugtrupp",
        "THW - Fachgruppe Räumen",
        "THW - Fachgruppe Wassergefahren",
        "THW - Fachgruppe Bergungstaucher",
        "THW - Fachgruppe Rettungshundeführer",
        "THW - Fachgruppe Wasserschaden/Pumpen",
        "THW - Fachgruppe Schwere Bergung",
        "THW - Fachgruppe Elektroversorgung",
        "THW - Trupp Unbemannte Luftfahrtsysteme",
        "THW - Fachzug Führung und Kommunikation"
    ];

    function logDebug(message, data) {
        console.log("[DEBUG] " + message, data);
    }

    function getSchoolingsFromTable() {
        const schoolings = {};
        const table = document.getElementById("schooling_opened_table");

        if (table) {
            const rows = table.querySelectorAll("tbody tr");

            rows.forEach(row => {
                const nameCell = row.querySelector("td:nth-child(1) a");
                const availableCell = row.querySelector("td:nth-child(2)");

                if (nameCell && availableCell) {
                    const name = nameCell.textContent.trim();
                    const available = parseInt(availableCell.textContent.trim(), 10);

                    // Wenn der Lehrgang schon existiert, füge die Anzahl verfügbarer Plätze hinzu
                    if (!schoolings[name]) {
                        schoolings[name] = { count: 0, totalAvailable: 0 };
                    }
                    schoolings[name].count += 1;
                    schoolings[name].totalAvailable += available;

                    logDebug("Lehrgang gefunden: ", { name, available });
                }
            });
        } else {
            logDebug("Tabelle nicht gefunden", null);
        }

        logDebug("Parsed Schoolings", schoolings);
        return schoolings;
    }

    function createTable(schoolings) {
        logDebug("Erstelle Tabelle mit folgenden Lehrgängen: ", schoolings);
        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";

        // Kopfzeile erstellen
        const header = table.createTHead();
        const headerRow = header.insertRow();
        const nameHeader = document.createElement("th");
        nameHeader.innerText = "Lehrgang";
        nameHeader.style.border = "1px solid black";
        nameHeader.style.padding = "2px";
        const availableHeader = document.createElement("th");
        availableHeader.innerText = "Offene Lehrgänge (Verfügbare Plätze)";
        availableHeader.style.border = "1px solid black";
        availableHeader.style.padding = "2px";
        headerRow.appendChild(nameHeader);
        headerRow.appendChild(availableHeader);

        // Tabellenkörper erstellen und Daten hinzufügen
        const tbody = table.createTBody();

        // Kombiniere die dynamisch gefundenen und vordefinierten Lehrgänge, ohne doppelte Einträge
        const allSchoolings = { ...schoolings };
        predefinedSchoolings.forEach(schooling => {
            if (!allSchoolings[schooling]) {
                allSchoolings[schooling] = { count: 0, totalAvailable: 0 };
            }
        });

        // Sortiere die kombinierten Lehrgänge alphabetisch
        const sortedSchoolings = Object.keys(allSchoolings).sort();

        // Iteriere über alle kombinierten Lehrgänge und füge diese hinzu
        sortedSchoolings.forEach(schooling => {
            const row = tbody.insertRow();
            const nameCell = row.insertCell();
            nameCell.innerText = schooling;
            nameCell.style.border = "1px solid black";
            nameCell.style.padding = "2px";

            const availableCell = row.insertCell();
            const { count, totalAvailable } = allSchoolings[schooling];
            availableCell.innerHTML = `${count} (${totalAvailable})`;
            availableCell.style.border = "1px solid black";
            availableCell.style.padding = "2px";

            // Wenn der Lehrgang keine offenen Lehrgänge hat, färbe die Zeile gelb und mache die Zahl fett
            if (count === 0 && totalAvailable === 0) {
                row.style.backgroundColor = "lightyellow";
                availableCell.innerHTML = `<strong>${count} (${totalAvailable})</strong>`;
                logDebug(`Lehrgang "${schooling}" hat keine offenen Lehrgänge und wird gelb eingefärbt.`, null);
            } else if (count < 4) {
                row.style.backgroundColor = "#ddd199";
                logDebug(`Lehrgang "${schooling}" hat weniger als 4 offene Lehrgänge und wird in #ddd199 eingefärbt.`, null);
            } else if (!predefinedSchoolings.includes(schooling)) {
                row.style.backgroundColor = "red";
                logDebug(`Lehrgang "${schooling}" ist nicht in den vordefinierten Lehrgängen enthalten und wird rot eingefärbt.`, null);
            }
        });

        return table;
    }

    function addStats() {
        logDebug("Starte das Hinzufügen der Statistiken...", null);
        const statsDiv = document.createElement("div");
        statsDiv.id = "schooling-stats";

        // Holen der Daten aus der Tabelle
        const schoolings = getSchoolingsFromTable();

        // Erstellen der Tabelle mit den Lehrgangsinformationen
        const table = createTable(schoolings);
        statsDiv.appendChild(table);

        const clearDiv = document.querySelector("div.clear");
        if (clearDiv) {
            // Tabelle nach dem "clear"-Div einfügen
            clearDiv.parentNode.insertBefore(statsDiv, clearDiv.nextSibling);
            logDebug("Statistik nach dem clear-Element eingefügt.", statsDiv);
        } else {
            logDebug("clear-Element nicht gefunden", null);
            const container = document.getElementById("iframe-inside-container");
            if (container) {
                container.insertBefore(statsDiv, container.firstChild);
                logDebug("Statistik wurde dem Container hinzugefügt.", statsDiv);
            } else {
                logDebug("Container nicht gefunden", null);
            }
        }
    }

    function main() {
        logDebug("Skript gestartet", null);
        addStats();
    }

    main();
})();