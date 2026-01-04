// ==UserScript==
// @name         Simplify Fighting Raptors
// @version      1.0.20
// @description  Farm RPG Beautify Fighting Raptors
// @author       ClientCoin
// @match        http*://*farmrpg.com/index.php
// @match        http*://*farmrpg.com/
// @match        http*://*alpha.farmrpg.com/
// @match        http*://*alpha.farmrpg.com/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        none
// @namespace    welcometothejunglewehavefunand541games
// @downloadURL https://update.greasyfork.org/scripts/529041/Simplify%20Fighting%20Raptors.user.js
// @updateURL https://update.greasyfork.org/scripts/529041/Simplify%20Fighting%20Raptors.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = false; // Set to false to disable debug outputs

    function logDebug(message, data = null) {
        if (DEBUG) {
            console.log(`[Reorder Raptors] ${message}`, data);
        }
    }

    function parseNumber(value) {
        return parseInt(value.replace(/,/g, ''), 10) || 0;
    }

    function reorderRaptors() {



        if (!window.location.href.includes('pen')) {
            logDebug(`❌ No valid pen raptor container found.`);
            return;
        }

        logDebug("✔ URL contains 'pen'. Proceeding...");

        let contentBlocks = document.querySelectorAll('[data-page="pen"].page-on-center .card .card-content-inner');
        let targetContainer = null;

        contentBlocks.forEach(container => {
            let raptorRows = container.querySelectorAll('.row.no-gutter');
            if (raptorRows.length > 0) {
                targetContainer = container;
                logDebug(`✔ Found correct '.card-content-inner' with ${raptorRows.length} raptor rows.`);
            }
        });

        if (!targetContainer) {
            logDebug("❌ No valid '.card-content-inner' containing raptors found. Exiting.");
            return;
        }

        let raptorRows = targetContainer.querySelectorAll('.row.no-gutter');
        if (!raptorRows.length) {
            logDebug("❌ No raptor rows found! Exiting.");
            return;
        }
        logDebug(`🔍 Found ${raptorRows.length} raptor rows.`);

        let raptors = [];
        let totalClaws = 0;
        raptorRows.forEach(row => {
            let raptorElements = Array.from(row.querySelectorAll('.col-auto'));
            raptorElements.forEach(raptor => {
                let nameElem = raptor.querySelector('strong');
                let nameText = nameElem ? nameElem.outerHTML.trim() : "Unknown";
                let linkElem = raptor.querySelector('a');
                let linkHref = linkElem ? linkElem.href : "#";

                let levelMatch = raptor.innerHTML.match(/Level ([\d,]+)/);
                let overallMatch = raptor.innerHTML.match(/OVERALL #([\d,]+)/);
                let leagueMatch = raptor.innerHTML.match(/LEAGUE #([\d,]+)/);
                let powerMatch = raptor.innerHTML.match(/([\d,]+) Power/);
                let fightingMatch = raptor.innerHTML.match(/Not Fighting|Overall/);
                let exhausted = raptor.innerHTML.includes("Exhausted");
                let recovering = raptor.innerHTML.includes("Recovering");

                let fighting = fightingMatch ? fightingMatch[0] : "";
                let level = levelMatch ? `Level ${levelMatch[1]}` : "";
                let claws = Math.round(powerMatch[1].replace(/,/g,'')/25);
                totalClaws += claws;

                // Change Level to "EXHAUSTED" if fighting & exhausted
                if (leagueMatch && exhausted) {
                    level = `<span style="color:#FFFF00">EXHAUSTED</span>`; // Yellow
                }

                // Change Level to "RECOVERING" if fighting & recovering
                if (leagueMatch && recovering) {
                    level = `<span style="color:#FFA500">RECOVERING</span>`; // Orange
                }

                let overall = overallMatch ? `<span style="color:teal">Overall #${overallMatch[1]}</span>` : "";
                let league = leagueMatch ? `<span style="color:teal">League #${leagueMatch[1]}</span>` : "";
                let power = powerMatch ? `${powerMatch[1].toLocaleString().padStart(5, '\u00A0')} Power - ${claws.toLocaleString().padStart(3, '\u00A0')} Claws` : "";

                let imageElem = raptor.querySelector('a img');
                let imageSrc = imageElem ? imageElem.src : "";

                raptors.push({
                    element: raptor,
                    nameText,
                    nameLink: linkHref,
                    level,
                    overall,
                    league,
                    power,
                    fighting,
                    exhausted,
                    recovering,
                    imageSrc
                });
            });
        });

        if (raptors.length === 0) {
            logDebug("❌ No raptors extracted! Exiting.");
            return;
        }

        logDebug("✔ Extracted raptor data:", raptors);

        raptorRows.forEach(row => row.remove());
        logDebug("🗑 Removed existing raptor rows.");

   // **Create Power Summary Row**
    let summaryRow = document.createElement('div');
    summaryRow.classList.add('row', 'no-gutter');
    summaryRow.style.marginBottom = '10px';
    summaryRow.style.fontFamily = 'monospace';

    let summaryCol = document.createElement('div');
    summaryCol.classList.add('col-auto');
    summaryCol.style.fontWeight = 'bold';
    summaryCol.style.textAlign = 'center';
    summaryCol.style.width = '100%';
    summaryCol.innerHTML = `⚡ Total Claws: <span style="color:goldenrod">${totalClaws.toLocaleString()}</span>`;

    summaryRow.appendChild(summaryCol);
    targetContainer.prepend(summaryRow); // Insert at the top


        let collapsibleContainer = document.createElement("div");
        collapsibleContainer.style.display = "none"; // Initially hidden

        let toggleButton = document.createElement("button");
        toggleButton.innerText = "Show More Raptors ▼";
        toggleButton.style.display = "block";
        toggleButton.style.margin = "10px auto";
        toggleButton.style.textAlign = "center";
        toggleButton.style.cursor = "pointer";
        toggleButton.onclick = function () {
            if (collapsibleContainer.style.display === "none") {
                collapsibleContainer.style.display = "block";
                toggleButton.innerText = "Hide Raptors ▲";
            } else {
                collapsibleContainer.style.display = "none";
                toggleButton.innerText = "Show More Raptors ▼";
            }
        };

        raptors.forEach(raptor => {
            let row = document.createElement("div");
            row.classList.add("row", "no-gutter");
            row.style.marginBottom = "0";
            row.style.fontFamily = "monospace";

            function createColumn(content, width, alignment = "left") {
                let col = document.createElement("div");
                col.classList.add("col-auto");
                col.style.lineHeight = "16px";
                col.style.padding = "0px 10px";
                col.style.whiteSpace = "nowrap";
                col.style.fontFamily = "monospace";
                col.style.width = `${width}%`;
                col.style.textAlign = alignment;
                col.innerHTML = content;
                return col;
            }

            // ** Column Widths in % **
            let colImage = createColumn("", 5);
            if (raptor.imageSrc) {
                let imgElem = document.createElement('img');
                imgElem.src = raptor.imageSrc;
                imgElem.style.width = '1rem';
                imgElem.style.height = '1rem';

                let imgLink = document.createElement('a');
                imgLink.href = raptor.nameLink;
                imgLink.appendChild(imgElem);

                colImage.appendChild(imgLink);
            }

            let colName = createColumn(
                `<strong><a href="${raptor.nameLink}" style="text-decoration: none; color: inherit;">${raptor.nameText}</a></strong>`,
                20,
                "center"
            );
            let colLevel = createColumn(raptor.level, 15);
            let colPower = createColumn(raptor.power, 15, "right");

            let colOverall = null;
            let colLeague = null;
            let colStatus = null;

            if (raptor.fighting === "Not Fighting") {
                colStatus = createColumn(`<span>Not Fighting</span>`, 45, "center");
            } else {
                colOverall = createColumn(`${raptor.overall}`, 25, "right");
                colLeague = createColumn(`${raptor.league}`, 20, "left");
            }

            row.appendChild(colImage);
            row.appendChild(colName);
            row.appendChild(colLevel);
            row.appendChild(colPower);

            if (colOverall && colLeague) {
                row.appendChild(colOverall);
                row.appendChild(colLeague);
            } else {
                row.appendChild(colStatus);
            }

            if (raptor.fighting === "Not Fighting") {
                collapsibleContainer.appendChild(row); // Hidden by default
            } else {
                targetContainer.appendChild(row); // Visible by default
            }
        });

        if (collapsibleContainer.children.length > 0) {
            targetContainer.appendChild(toggleButton);
            targetContainer.appendChild(collapsibleContainer);
        }

        console.log("Raptor Pen Beautified ✅");



    }



    $(document).ready(() => {
        const target = document.querySelector("#fireworks");

        const observer = new MutationObserver((mutations) => {
            if (mutations.some(mutation => mutation.attributeName === "data-page")) {
                waitForRaptors();
            }
        });

        const config = {
            attributes: true,
            childList: true,
            subtree: true
        };

        observer.observe(target, config);

        function waitForRaptors() {
            logDebug("🔍 Waiting for raptor elements to be available...");
            const checkExist = setInterval(() => {
                let contentBlock = document.querySelector('[data-page="pen"].page-on-center .card .card-content-inner');

                // Ensure we run this only once per detected raptor set
                if (contentBlock && !contentBlock.dataset.processed) {
                    clearInterval(checkExist);  // Stop checking once found
                    contentBlock.dataset.processed = "true"; // Mark as processed
                    logDebug("✅ Raptors detected, running reorderRaptors...");
                    reorderRaptors();
                }
            }, 100); // Check every 100ms
        }

        waitForRaptors(); // Initial check in case it's already loaded

        // Observer to detect new dynamic changes (e.g., AJAX updates)
        const dynamicObserver = new MutationObserver((mutations) => {
            let contentBlock = document.querySelector('[data-page="pen"].page-on-center .card .card-content-inner');

            if (contentBlock && !contentBlock.dataset.processed) {
                logDebug("🔄 New raptors detected via DOM change, re-running reorderRaptors...");
                reorderRaptors();
                contentBlock.dataset.processed = "true";
            }
        });

        dynamicObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    });



})();



