// ==UserScript==
// @name         Live Výsledky FIDAF
// @namespace    https://gameday.fidaf.org/
// @version      1.2
// @description  Získává a zobrazuje live výsledky z gameday.fidaf.org jako přehlednou tabulku
// @author       Michal
// @match        https://gameday.fidaf.org/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528887/Live%20V%C3%BDsledky%20FIDAF.user.js
// @updateURL https://update.greasyfork.org/scripts/528887/Live%20V%C3%BDsledky%20FIDAF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function generateUniqueId(home, away) {
        return `game_${home.replace(/\s+/g, '_')}_vs_${away.replace(/\s+/g, '_')}`;
    }

    function createCustomTable() {
        setTimeout(() => { // Zpoždění o 3 sekundy
            console.log("🏈 [Tampermonkey] Načítám tabulku výsledků pro všechny zápasy 1° Div...");

            // Najdeme všechny sekce s 1° Div
            const mainLeagueSections = [...document.querySelectorAll('.week')]
                .filter(week => week.textContent.includes("1° Div"));

            if (mainLeagueSections.length === 0) {
                console.warn("⚠️ Žádná sekce 1° Div nebyla nalezena!");
                return;
            }

            let tableContainer = document.getElementById("tableContainer");
            if (!tableContainer) {
                tableContainer = document.createElement("div");
                tableContainer.setAttribute("id", "tableContainer");
                tableContainer.style.position = "fixed";
                tableContainer.style.top = "100px";
                tableContainer.style.right = "20px";
                tableContainer.style.width = "500px";
                tableContainer.style.maxHeight = "500px";
                tableContainer.style.overflowY = "auto";
                tableContainer.style.backgroundColor = "rgba(10, 10, 10, 0.95)";
                tableContainer.style.padding = "15px";
                tableContainer.style.borderRadius = "12px";
                tableContainer.style.boxShadow = "0px 0px 15px rgba(0, 0, 0, 0.8)";
                tableContainer.style.zIndex = "9999";
                tableContainer.style.color = "#fff";
                tableContainer.style.fontFamily = "Arial, sans-serif";
                document.body.appendChild(tableContainer);
            }

            tableContainer.innerHTML = `
                <h2 id="dragHandle" style='text-align:center; color:#f1c40f; margin: 0 0 10px; cursor: grab;'>🏈 Live Výsledky 1° Div</h2>
                <table id="customGameTable" style="
                    width: 100%;
                    border-collapse: collapse;
                    background-color: #222;
                    border-radius: 8px;
                    overflow: hidden;
                    font-size: 16px;">
                    <thead style="background-color: #444; color: #f1c40f;">
                        <tr>
                            <th style="padding: 12px; text-align: center;">Domácí</th>
                            <th style="padding: 12px; text-align: center;">Hostující</th>
                            <th style="padding: 12px; text-align: center;">Skóre</th>
                            <th style="padding: 12px; text-align: center;">Status</th>
                        </tr>
                    </thead>
                    <tbody id="gameTableBody"></tbody>
                </table>
            `;

            let tbody = document.getElementById("gameTableBody");
            tbody.innerHTML = ""; // Vyčistíme starou tabulku

            // Projdeme všechny sekce 1° Div a z nich získáme zápasy
            mainLeagueSections.forEach((section) => {
                const gameBlocks = section.querySelectorAll(".block");

                gameBlocks.forEach((block, index) => {
                    const teamNames = block.querySelectorAll(".item-container .item");
                    const scoreLabels = block.querySelectorAll("span[id*='_Label']");
                    const statusLabel = block.querySelector("div.t span");

                    if (teamNames.length >= 2 && scoreLabels.length >= 2 && statusLabel) {
                        const homeTeam = teamNames[0].textContent.trim();
                        const awayTeam = teamNames[1].textContent.trim();
                        const homeScore = scoreLabels[0].textContent.trim();
                        const awayScore = scoreLabels[2].textContent.trim();
                        const matchStatus = statusLabel.textContent.trim();

                        const uniqueId = generateUniqueId(homeTeam, awayTeam);

                        let newRow = document.createElement("tr");
                        newRow.setAttribute("data-game-id", uniqueId);
                        newRow.style.borderBottom = "2px solid #555";
                        newRow.style.textAlign = "center";
                        newRow.style.fontSize = "16px";
                        newRow.style.transition = "background-color 0.3s";
                        newRow.style.backgroundColor = index % 2 === 0 ? "#333" : "#2a2a2a";
                        newRow.style.height = "40px";

                        newRow.onmouseover = () => newRow.style.backgroundColor = "#555";
                        newRow.onmouseout = () => newRow.style.backgroundColor = index % 2 === 0 ? "#333" : "#2a2a2a";

                        ["home", "away", "score", "status"].forEach((field, i) => {
                            let td = document.createElement("td");
                            td.id = `gameTableBody_row${index}_${field}`;
                            td.style.padding = "12px";
                            td.style.border = "1px solid #555";
                            td.style.fontSize = "16px";
                            td.style.fontWeight = "bold";

                            if (field === "home") td.textContent = homeTeam;
                            if (field === "away") td.textContent = awayTeam;
                            if (field === "score") {
                                td.textContent = `${homeScore} - ${awayScore}`;
                                td.style.color = "#f1c40f";
                                td.style.fontSize = "18px";
                            }
                            if (field === "status") {
                                td.textContent = matchStatus;
                                td.style.color = matchStatus === "LIVE" ? "red" : "#f1c40f";
                                td.style.fontSize = "18px";
                                td.style.textTransform = "uppercase";
                            }

                            newRow.appendChild(td);
                        });

                        tbody.appendChild(newRow);
                    }
                });
            });

            // Oprava přetahování tabulky
            let dragHandle = document.getElementById("dragHandle");
            let isDragging = false, startX, startY, initialX, initialY;
            dragHandle.addEventListener("mousedown", (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                initialX = tableContainer.offsetLeft;
                initialY = tableContainer.offsetTop;
            });
            document.addEventListener("mousemove", (e) => {
                if (isDragging) {
                    let newX = initialX + (e.clientX - startX);
                    let newY = initialY + (e.clientY - startY);
                    tableContainer.style.right = "";
                    tableContainer.style.left = newX + "px";
                    tableContainer.style.top = newY + "px";
                }
            });
            document.addEventListener("mouseup", () => { isDragging = false; });

        }, 3000);
    }

    createCustomTable();
    setInterval(createCustomTable, 30000);

})();