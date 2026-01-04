// ==UserScript==
// @name         Criticker Watchlist Exporter
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @description  Exports the entries of a Criticker watchlist to CSV.
// @author       Alsweider
// @match        https://www.criticker.com/films/?collection=*
// @match        https://games.criticker.com/games/?collection=*
// @icon         https://www.criticker.com/favicon.ico
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521339/Criticker%20Watchlist%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/521339/Criticker%20Watchlist%20Exporter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Variablen
    let collectionId = new URLSearchParams(window.location.search).get("collection");
    let allEntries = [];
    let totalPages = 1; // Wird später dynamisch gesetzt

    // Funktion zum Extrahieren der Einträge aus der HTML-Seite
    function extractEntriesFromDocument(doc) {
        let entries = [];
        doc.querySelectorAll(".fl_name").forEach(div => {
            let titleElement = div.querySelector("[id^='fl_titlelist_link_']");
            let scoreElement = div.parentElement.querySelector(".pti");
            if (titleElement) {
                let fullText = titleElement.innerText.trim();
                let match = fullText.match(/^(.*) \((\d{4})\)$/); // Extrahiert Titel und Jahr
                if (match) {
                    let title = match[1];
                    let year = match[2];
                    let score = scoreElement ? scoreElement.innerText.trim() : ""; // Probable Score extrahieren
                    entries.push({ title, year, score });
                }
            }
        });
        return entries;
    }

    // Funktion zum Abrufen der Inhalte einer Seite
    function fetchPage(pageNumber) {
        return new Promise((resolve, reject) => {
            let baseUrl = window.location.href.includes("games") ? "https://games.criticker.com/games/" : "https://www.criticker.com/films/";
            let pageUrl = `${baseUrl}?collection=${collectionId}&p=${pageNumber}`;
            console.log(`Lade Seite ${pageNumber}: ${pageUrl}`);

            fetch(pageUrl)
                .then(response => response.text())
                .then(html => {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(html, "text/html");

                    // Einträge extrahieren
                    let entries = extractEntriesFromDocument(doc);
                    resolve(entries);

                    // Gesamtseitenzahl prüfen (falls noch nicht gesetzt)
                    if (pageNumber === 1) {
                        let paginationLinks = doc.querySelectorAll(".pagination a");
                        if (paginationLinks.length > 0) {
                            totalPages = Math.max(...Array.from(paginationLinks).map(link => {
                                let match = link.href.match(/&p=(\d+)/);
                                return match ? parseInt(match[1]) : 1;
                            }));
                            console.log(`Gesamtseiten: ${totalPages}`);
                        }
                    }
                })
                .catch(error => {
                    console.error(`Fehler beim Abrufen von Seite ${pageNumber}:`, error);
                    reject(error);
                });
        });
    }

    // Funktion zum Verarbeiten aller Seiten
    async function fetchAllPages() {
        for (let i = 1; i <= totalPages; i++) {
            let entries = await fetchPage(i);
            allEntries = allEntries.concat(entries);
        }
        createCSV(allEntries);
    }

    // Funktion zum Erstellen der CSV-Datei
    function createCSV(entries) {
        let csvContent = "Title,Year,Probable Score\n";
        entries.forEach(entry => {
            csvContent += `"${entry.title}","${entry.year}","${entry.score}"\n`;
        });

        // CSV-Datei zum Download bereitstellen
        let blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "criticker_watchlist.csv";
        a.click();
        URL.revokeObjectURL(url);
        console.log("CSV erfolgreich erstellt!");
    }

    // Funktion zum Hinzufügen des Buttons zur Sidebar
    function addButtonToSidebar() {
        const sidebar = document.querySelector(".fl_sidebar");
        if (sidebar) {
            const button = document.createElement("a");
            button.href = "#";
            button.id = "exportWatchlistButton";
            button.classList.add("button");
            button.textContent = "Export to CSV";
            button.style.display = "block";
            button.style.padding = "10px";
            button.style.marginTop = "20px";
            button.style.textAlign = "center";
            button.style.backgroundColor = "#4CAF50";
            button.style.color = "white";
            button.style.borderRadius = "5px";
            button.style.textDecoration = "none";

            // Button in die Sidebar einfügen
            sidebar.appendChild(button);

            // Event Listener hinzufügen
            button.addEventListener("click", function (e) {
                e.preventDefault();
                console.log("Starte die Extraktion aller Seiten...");
                fetchAllPages().then(() => {
                    console.log("Extraktion abgeschlossen!");
                });
            });
        }
    }

    // Funktion aufrufen, um den Button hinzuzufügen
    window.addEventListener("load", addButtonToSidebar);

})();
