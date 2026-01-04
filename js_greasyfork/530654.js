// ==UserScript==
// @name         Pret Inter Extractor (ctrl + shift + z)
// @version      1.2
// @description  Extracts interlibrary loans sorted by section and then by call number, then downloads the info as a text file when a shortcut is pressed.
// @author       Mojo Jojo
// @match        https://bgmdolly.gminvent.fr/*
// @grant        none
// @namespace https://greasyfork.org/users/1448578
// @downloadURL https://update.greasyfork.org/scripts/530654/Pret%20Inter%20Extractor%20%28ctrl%20%2B%20shift%20%2B%20z%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530654/Pret%20Inter%20Extractor%20%28ctrl%20%2B%20shift%20%2B%20z%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the shortcut key to CTRL + SHIFT + z
    const shortcutKey = "z";

    document.addEventListener("keydown", function(event) {
        if (event.key.toLowerCase() === shortcutKey && event.ctrlKey && event.shiftKey) {
            event.preventDefault(); // Prevent default browser actions
            console.log("✅ Shortcut detected! Running script...");
            extractAndDownload();
        }
    });

    function extractAndDownload() {
        const targetHeaders = [
            "Mise à disposition pour Bibliothèque publique de Robermont",
            "Mise à disposition pour Navette de la province",
            "Mise à disposition pour Séminaire"
        ];

        function normalizeText(text) {
            return text
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, " ")
                .replace(/ç/g, "c")
                .trim().toLowerCase();
        }

        let bookSections = {
            "Section jeunesse": [],
            "Section adulte": [],
            "Réserve": [],
            "Others": []
        };

        let processedBooks = new Set();
        let outputText = "";

        const allDivs = Array.from(document.querySelectorAll("div"));

        let headerDivs = allDivs.filter(div =>
            targetHeaders.some(header => normalizeText(div.innerText).includes(normalizeText(header)))
        );

        headerDivs = Array.from(new Set(headerDivs.map(div => div.innerText))).map(text =>
            allDivs.find(div => normalizeText(div.innerText) === normalizeText(text))
        );

        // outputText += `📚 Found headers: ${headerDivs.length}\n\n`;

        headerDivs.forEach(headerDiv => {
            let possibleTable = headerDiv.closest("td")?.parentElement?.nextElementSibling?.querySelector("table")
                || headerDiv.closest("tr")?.nextElementSibling?.querySelector("table")
                || headerDiv.closest("td")?.parentElement?.parentElement?.querySelector("table");

            if (!possibleTable) {
                console.warn("No table found for:", headerDiv.innerText.trim());
                return;
            }

            let rows = possibleTable.querySelectorAll("tbody > tr");

            rows.forEach(row => {
                try {
                    let columns = Array.from(row.querySelectorAll("td"));

                    if (columns.length < 3) {
                        console.warn("⚠️ Skipping row due to missing columns:", row.innerText.trim());
                        return;
                    }

                    let titleCell = columns[1];
                    let coteCell = columns[2];

                    if (titleCell && coteCell) {
                        let title = titleCell.innerText.trim();
                        let coteLines = coteCell.innerText.trim().split("\n").map(line => normalizeText(line));
                        let coteFirstRow = coteLines.length > 0 ? coteLines[0] : "⚠️⚠️";
                        let coteSecondRow = coteLines.length > 1 ? coteLines[1] : "⚠️⚠️";
                        let fullCoteInfo = coteLines.join("\n");

                        let bookKey = `${title}-${coteSecondRow}`;
                        if (processedBooks.has(bookKey)) {
                            return;
                        }
                        processedBooks.add(bookKey);

                        let section = "Others";

                        if (coteFirstRow.includes("jeunesse")) {
                            section = "Section jeunesse";
                        } else if (coteFirstRow.includes("adulte")) {
                            section = "Section adulte";
                        } else if (coteFirstRow.includes("reserve") || coteFirstRow.includes("réserve")) {
                            section = "Réserve";
                        }

                        bookSections[section].push({ title, coteSecondRow, fullCoteInfo });

                    }
                } catch (error) {
                    console.error("❌ Error processing row:", error);
                }
            });
        });

        function sortByCote(a, b) {
            return a.coteSecondRow.localeCompare(b.coteSecondRow);
        }

        for (let section in bookSections) {
            bookSections[section].sort(sortByCote);
        }

        if (bookSections["Others"].length === 0) {
            delete bookSections["Others"];
        }

        outputText += `📚 Found books: ${Object.values(bookSections).flat().length}`;

        for (let section in bookSections) {
            outputText += `\n===================== ${section} =====================\n`;

            bookSections[section].forEach(book => {
                outputText += `📖 ${book.title}\n👀 COTE: ${book.coteSecondRow.toUpperCase()}\n`;

                if (section === "Others") {
                    outputText += `📜 Full Cote Info:\n${book.fullCoteInfo}\n`;
                }

                outputText += "------------------\n";
            });
        }

        function downloadTextFile(filename, text) {
            let element = document.createElement("a");
            let file = new Blob([text], { type: "text/plain" });
            element.href = URL.createObjectURL(file);
            element.download = filename;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }

        downloadTextFile("pret_inter_sorted.txt", outputText);
    }
})();
