// ==UserScript==
// @name         MH - Journal Log Tracker
// @version      1.4.2
// @description  Tracks when your journal log is going to show up next and shows a button to access your last journal log
// @author       hannadDev
// @namespace    https://greasyfork.org/en/users/1238393-hannaddev
// @match        https://www.mousehuntgame.com/*
// @icon         https://www.mousehuntgame.com/images/ui/journal/themes/classic_thumb.gif
// @require      https://cdn.jsdelivr.net/npm/mh-assets@1.0.8/scripts/utils.js
// @require      https://cdn.jsdelivr.net/npm/mousehunt-utils@1.10.5/mousehunt-utils.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490675/MH%20-%20Journal%20Log%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/490675/MH%20-%20Journal%20Log%20Tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // #region Variables
    let isDebug = false;

    const localStorageKey = `mh-journal-log-tracker`;

    let storedData = {};
    //#endregion

    //#region Loading external assets
    const mainStylesheetUrl = "https://cdn.jsdelivr.net/npm/mh-assets@1.0.8/stylesheets/main.css";
    const scriptSpecificStylesheetUrl = "https://cdn.jsdelivr.net/npm/mh-assets@1.0.8/stylesheets/journal-log-tracker.css";

    hd_utils.addStyleElement(mainStylesheetUrl);
    hd_utils.addStyleElement(scriptSpecificStylesheetUrl);
    //#endregion

    //#region Initialization
    const journalContainerObserver = new MutationObserver(function (mutations) {
        if (isDebug) {
            console.log('[Journal Container Observer] Mutation');
            for (const mutation of mutations) {
                console.log({ mutation });
                console.log(mutation.target);
            }
        }

        // Only save if something was added.
        if (mutations.some(v => v.type === 'childList' && v.addedNodes.length > 0 && v.target.className !== 'journaldate')) {
            tryToScrapeJournal();
        }
    });

    const mousehuntContainerObserver = new MutationObserver(function (mutations) {
        if (isDebug) {
            console.log('[Mousehunt Container Observer] Mutation');
            for (const mutation of mutations) {
                console.log({ mutation });
                console.log(mutation.target);
            }
        }

        // Check if camp or journal pages
        const mhContainer = document.getElementById('mousehuntContainer');
        if (mhContainer && mhContainer.classList && (mhContainer.classList.contains('PageCamp') || mhContainer.classList.contains('PageJournal'))) {
            showButton();
        }
    });

    function activateJournalMutationObserver() {
        let journalContainerObserverTarget = document.querySelector(`#journalContainer[data-owner="${user.user_id}"] .content`);

        if (journalContainerObserverTarget) {
            journalContainerObserver.observe(journalContainerObserverTarget, {
                childList: true,
                subtree: true
            });
        }
    }

    function activateMousehuntContainerMutationObserver() {
        let mousehuntContainerObserverTarget = document.getElementById('mousehuntContainer');

        if (mousehuntContainerObserverTarget) {
            mousehuntContainerObserver.observe(mousehuntContainerObserverTarget, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }

    function Initialize() {
        if (isDebug) console.log(`Initializing.`);

        storedData = getStoredData();

        activateMousehuntContainerMutationObserver();
        activateJournalMutationObserver();
        showButton();

        onRequest(() => { tryToScrapeJournal(); }, 'managers/ajax/turns/activeturn.php');
    }

    Initialize();
    //#endregion

    // #region LocalStorage Methods
    function getStoredData() {
        const savedData = localStorage.getItem(localStorageKey);

        if (savedData !== null) {
            return JSON.parse(savedData);
        }

        return {
            logs: {},
            lastSavedEntryId: -1
        };
    }

    function setData(stats) {
        localStorage.setItem(localStorageKey, JSON.stringify(stats));
    }

    function deleteLog(logId) {
        delete storedData.logs[logId];
        if (Number.parseInt(storedData.lastSavedEntryId) === Number.parseInt(logId)) {
            const keys = Object.keys(storedData.logs);

            storedData.lastSavedEntryId = -1;
            if (keys.length > 0) {
                for (let k = 0; k < keys.length; k++) {
                    if (storedData.lastSavedEntryId < Number.parseInt(keys[k])) {
                        storedData.lastSavedEntryId = Number.parseInt(keys[k]);
                    }
                }
            }
        }
    }
    // #endregion

    // #region Journal Scraping Methods
    function tryToScrapeJournal() {
        if (!hd_utils.mh.isOwnJournal()) {
            return;
        }

        scrapeJournal();
    }

    function scrapeJournal() {
        const entries = document.querySelectorAll('.entry');

        let addedNewEntries = false;
        for (const entry of entries) {
            let entryId = entry.dataset.entryId

            if (!entryId) return;

            entryId = Number.parseInt(entryId);

            if (entry.className.search(/(log_summary)/) !== -1) {
                if (storedData.logs.hasOwnProperty(entryId)) {
                    if (isDebug) console.log(`Entry ${entryId} already stored`);
                }
                else {
                    if (isDebug) console.log(`New entry ${entryId}`);
                    const entryInfo = extractInfoFromEntry(entry);

                    if (entryInfo != null) {
                        storedData.logs[entryId] = entryInfo;

                        if (storedData.lastSavedEntryId < entryId) {
                            storedData.lastSavedEntryId = entryId;
                        }

                        addedNewEntries = true;
                    }
                }
            }
        }

        if (addedNewEntries) {
            setData(storedData);
            showButton();
        }
    }

    function extractInfoFromEntry(entry) {
        const entryInfo = {};

        const dateString = entry.querySelector(".journaldate").innerHTML.split("-")[0].trim().replaceAll(" ", "");
        const hoursString = dateString.split(':')[0];
        const minutesString = dateString.split(':')[1].replace("am", "").replace("pm", "");
        const timePeriodString = dateString.split(':')[1].includes('am') ? 'am' : 'pm';

        try {
            const date = new Date();
            date.setMilliseconds(0);
            date.setSeconds(0);

            date.setHours(hoursString);
            date.setMinutes(minutesString);

            if (date.getHours() !== 12 && timePeriodString === "pm") {
                date.setHours(date.getHours() + 12);
            } else if (date.getHours() === 12 && timePeriodString === "am") {
                date.setHours(date.getHours() - 12);
            }

            if (date.getTime() > Date.now()) {
                date.setDate(date.getDate() - 1);
            }

            entryInfo.Timestamp = date.getTime();
        } catch (e) {
            console.log(e);
            return null;
        }

        entryInfo.Duration = entry.querySelector(".reportSubtitle").innerHTML.replace("Last ", "");

        const tableBody = entry.querySelector(".journalbody .journaltext table tbody");
        const tdElements = tableBody.querySelectorAll(".leftSide, .rightSide");
        for (let i = 0; i < tdElements.length; ++i) {
            if (tdElements[i].innerHTML.includes("Catches:")) {
                entryInfo.Catches = Number.parseInt(tdElements[i].nextSibling.innerHTML);
            } else if (tdElements[i].innerHTML.includes("Misses:")) {
                entryInfo.Ftc = Number.parseInt(tdElements[i].nextSibling.innerHTML);
            } else if (tdElements[i].innerHTML.includes("Fail to Attract:")) {
                entryInfo.Fta = Number.parseInt(tdElements[i].nextSibling.innerHTML);
            } else if (tdElements[i].innerHTML.includes("Gained:")) {
                // Left is gold. Right is points
                if (tdElements[i].classList.contains('leftSide')) {
                    if (tdElements[i].nextSibling) {
                        entryInfo.GoldGained = Number.parseInt(tdElements[i].nextSibling.innerHTML.replaceAll(',', ''));
                    }
                } else {
                    if (tdElements[i].nextSibling) {
                        entryInfo.PointsGained = Number.parseInt(tdElements[i].nextSibling.innerHTML.replaceAll(',', ''));
                    }
                }
            } else if (tdElements[i].innerHTML.includes("Lost:")) {
                // Left is gold. Right is points
                if (tdElements[i].classList.contains('leftSide')) {
                    if (tdElements[i].nextSibling) {
                        entryInfo.GoldLost = Number.parseInt(tdElements[i].nextSibling.innerHTML.replaceAll(',', ''));
                    }
                } else {
                    if (tdElements[i].nextSibling) {
                        entryInfo.PointsLost = Number.parseInt(tdElements[i].nextSibling.innerHTML.replaceAll(',', ''));
                    }
                }
            } else if (tdElements[i].innerHTML.includes("Total:")) {
                // Left is gold. Right is points
                if (tdElements[i].classList.contains('leftSide')) {
                    if (tdElements[i].nextSibling) {
                        entryInfo.GoldTotal = Number.parseInt(tdElements[i].nextSibling.innerHTML.replaceAll(',', ''));
                    }
                } else {
                    if (tdElements[i].nextSibling) {
                        entryInfo.PointsTotal = Number.parseInt(tdElements[i].nextSibling.innerHTML.replaceAll(',', ''));
                    }
                }
            }
        }

        const link = tableBody.querySelector("a");

        entryInfo.OpenSummaryMethod = link.onclick.toString().split("onclick(event) {")[1].split("return false;")[0].trim();

        return entryInfo;
    }
    // #endregion

    // #region Export/Import Methods
    function exportData() {
        let filename = `${user.user_id}_${Date.now()}.json`;
        let contentType = "application/json;charset=utf-8;";

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            const blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(storedData)))], { type: contentType });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            const a = document.createElement('a');
            a.download = filename;
            a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(storedData));
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    function importData() {
        let input = document.createElement('input');
        input.type = 'file';
        input.onchange = _ => {
            let files = Array.from(input.files);

            if (files.length > 0 && files[0].type === "application/json") {
                let fr = new FileReader();

                fr.onload = function () {
                    const importedData = JSON.parse(this.result);
                    filterAndSaveImportedData(importedData);
                }

                fr.readAsText(files[0]);
            } else {
                console.log("Invalid file imported");
            }
        };
        input.click();
    }

    function filterAndSaveImportedData(importedData) {
        let importedLogCount = 0;
        for (const key in importedData.logs) {
            if (!storedData.logs.hasOwnProperty(key)) {
                storedData.logs[key] = importedData.logs[key];

                if (Number.parseInt(storedData.lastSavedEntryId) < Number.parseInt(key)) {
                    storedData.lastSavedEntryId = Number.parseInt(key);
                }

                importedLogCount++;
            }
        }

        console.log(`Imported ${importedLogCount} logs`);

        if (importedLogCount > 0) {
            setData(storedData);
            showLogs();
            showButton();
        }
    }
    // #endregion

    // #region UI
    function showButton() {
        if (!hd_utils.mh.isOwnJournal()) {
            return;
        }

        const olderButton = document.querySelector("#journal-log-button");
        if (olderButton) {
            olderButton.remove();
        }

        const target = document.querySelector("#journalContainer .top");
        if (target) {
            const link = document.createElement("a");
            link.id = "journal-log-button";

            link.innerText = `Next Log: ${getNextLogTimer()}`;
            link.href = "#";
            link.classList.add("hd-journal-log-button");
            link.addEventListener("click", function () {
                showLogs();
            });
            target.append(link);
        }
    }

    function showLogs(enableDeleteLogs = false) {
        document.querySelectorAll("#journal-logs-popup-div").forEach(el => el.remove());

        const journalLogsPopup = document.createElement("div");
        journalLogsPopup.id = ("journal-logs-popup-div");
        journalLogsPopup.classList.add("hd-popup");

        // Journal Logs Division
        const journalLogs = document.createElement("div");

        // Title
        const title = document.createElement("h2");
        title.innerText = `Journal Log Tracker`
        title.classList.add("hd-bold");
        journalLogs.appendChild(title);

        // Subtitle
        let nextLogDateString = "N/A";
        if (storedData.lastSavedEntryId !== undefined && storedData.logs[storedData.lastSavedEntryId] !== undefined) {
            const logDate = new Date(storedData.logs[storedData.lastSavedEntryId].Timestamp);
            do {
                logDate.setHours(logDate.getHours() + 36);
            } while (Date.now() - logDate.getTime() > 4 * (1000 * 60 * 60));

            nextLogDateString = `${logDate.toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })} - (${getNextLogTimer()})`;
        }

        const subtitle = document.createElement("h4");
        subtitle.innerText = `Next Estimated Log: ${nextLogDateString}`;
        journalLogs.appendChild(subtitle);

        journalLogs.appendChild(document.createElement("br"));

        // Table container
        const journalLogsTableContainer = document.createElement("form");
        journalLogsTableContainer.style = "max-height: 250px; overflow-y: auto;";

        // Table for journal logs
        const journalLogsTable = document.createElement("table");
        journalLogsTable.id = "journal-logs-table"
        journalLogsTable.classList.add("hd-table");

        const headings = ["#", "Date & Time", "Duration", "Catches", "FTC", "FTA", "Gold", "Points", "#"];
        const keys = ["", "Timestamp", "Duration", "Catches", "Ftc", "Fta", "GoldTotal", "PointsTotal"];

        // Create headings
        for (let i = 0; i < headings.length; ++i) {
            if (!enableDeleteLogs && i == headings.length - 1) {
                continue;
            }

            const headingElement = document.createElement("th");
            headingElement.id = `journal-logs-${headings[i].toLowerCase()}-heading`;
            headingElement.innerText = headings[i];
            headingElement.classList.add("hd-table-heading");

            journalLogsTable.appendChild(headingElement);
        }

        // Table Body
        const tableBody = document.createElement("tbody");

        const logIDs = Object.keys(storedData.logs);
        logIDs.sort((a, b) => b - a);

        let j = 0;
        for (const logId of logIDs) {
            const tableRow = document.createElement("tr");
            tableRow.id = "journal-logs-table-row-" + j

            for (let i = 0; i < headings.length; ++i) {
                if (!enableDeleteLogs && i == headings.length - 1) {
                    continue;
                }

                const tdElement = document.createElement("td");
                if (i == 0) {
                    tdElement.innerText = j + 1;
                } else if (i == 1) {
                    // Link element
                    const link = document.createElement("a");
                    link.innerText = new Date(storedData.logs[logId][keys[i]]).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                    link.href = "#";
                    link.addEventListener("click", function () {
                        document.querySelector("#journal-logs-popup-div").remove();
                        eval(storedData.logs[logId]["OpenSummaryMethod"]);
                        return false;
                    });

                    tdElement.append(link);
                } else if (i == headings.length - 1) {
                    // Delete Log element
                    const link = document.createElement("a");
                    link.innerText = "X";
                    link.href = "#";
                    link.addEventListener("click", function () {
                        deleteLog(logId);
                        showLogs(true);
                        return false;
                    });

                    tdElement.append(link);
                } else {
                    if (storedData.logs[logId][keys[i]] !== undefined) {
                        tdElement.innerText = storedData.logs[logId][keys[i]];

                        if ('GoldTotal' === keys[i] || 'PointsTotal' === keys[i]) {
                            tdElement.innerText = Number.parseInt(tdElement.innerText).toLocaleString();
                        }
                    } else {
                        tdElement.innerText = '-';
                    }
                }

                tdElement.classList.add("hd-table-td");

                tableRow.appendChild(tdElement);
            }

            tableBody.appendChild(tableRow);

            j++;
        }

        // Final append
        journalLogsTable.appendChild(tableBody)
        journalLogsTableContainer.appendChild(journalLogsTable);
        journalLogs.appendChild(journalLogsTableContainer);

        // Manual fetch link. Remove to other tab later
        journalLogs.appendChild(document.createElement("br"));
        const manualFetchLink = document.createElement("a");
        manualFetchLink.innerText = "Manual Fetch";
        manualFetchLink.href = "#";
        manualFetchLink.classList.add("hd-button");
        manualFetchLink.addEventListener("click", function () {
            tryToScrapeJournal();
            showLogs();
            return false;
        });

        journalLogs.appendChild(manualFetchLink);

        // Export link. Remove to other tab later
        journalLogs.appendChild(document.createElement("br"));
        journalLogs.appendChild(document.createElement("br"));
        const exportLink = document.createElement("a");
        exportLink.innerText = "Export";
        exportLink.href = "#";
        exportLink.classList.add("hd-button");
        exportLink.addEventListener("click", exportData);

        journalLogs.appendChild(exportLink);

        // Import link. Remove to other tab later
        const importLink = document.createElement("a");
        importLink.innerText = "Import";
        importLink.href = "#";
        importLink.classList.add("hd-button");
        importLink.addEventListener("click", importData);

        journalLogs.appendChild(importLink);

        // Toggle Log Deletion. Remove to other tab later
        journalLogs.appendChild(document.createElement("br"));
        journalLogs.appendChild(document.createElement("br"));
        if (enableDeleteLogs) {
            const confirmDeleteLogsLink = document.createElement("a");
            confirmDeleteLogsLink.innerText = "Confirm Deletion";
            confirmDeleteLogsLink.href = "#";
            confirmDeleteLogsLink.classList.add("hd-button");
            confirmDeleteLogsLink.addEventListener("click", function () {
                setData(storedData);
                showLogs(!enableDeleteLogs);
                return false;
            });

            journalLogs.appendChild(confirmDeleteLogsLink);

            const discardDeleteLogsLink = document.createElement("a");
            discardDeleteLogsLink.innerText = "Discard Deletion";
            discardDeleteLogsLink.href = "#";
            discardDeleteLogsLink.classList.add("hd-button");
            discardDeleteLogsLink.addEventListener("click", function () {
                storedData = getStoredData();
                showLogs(!enableDeleteLogs);
                return false;
            });

            journalLogs.appendChild(discardDeleteLogsLink);

        } else {
            const toggleDeleteLogsLink = document.createElement("a");
            toggleDeleteLogsLink.innerText = "Toggle Delete Logs";
            toggleDeleteLogsLink.href = "#";
            toggleDeleteLogsLink.classList.add("hd-button");
            toggleDeleteLogsLink.addEventListener("click", function () {
                showLogs(!enableDeleteLogs);
                return false;
            });

            journalLogs.appendChild(toggleDeleteLogsLink);
        }

        journalLogsPopup.appendChild(journalLogs);

        // Close button
        const closeButton = document.createElement("button");
        closeButton.id = "close-button";
        closeButton.textContent = "Close";
        closeButton.classList.add("hd-button");
        closeButton.onclick = function () {
            document.body.removeChild(journalLogsPopup);
        }

        // Append
        journalLogsPopup.appendChild(closeButton);

        // Final Append
        document.body.appendChild(journalLogsPopup);
        hd_utils.dragElement(journalLogsPopup, journalLogs);
    }
    // #endregion

    // #region Utils
    function getNextLogTimer() {
        let timerString = "N/A";
        if (storedData.lastSavedEntryId !== undefined && storedData.logs[storedData.lastSavedEntryId] !== undefined) {
            const lastLogDate = new Date(storedData.logs[storedData.lastSavedEntryId].Timestamp);

            const nextLogTimestamp = lastLogDate.setHours(lastLogDate.getHours() + 36);
            const timestampDifference = Math.abs(nextLogTimestamp - Date.now());
            let hasPassed = nextLogTimestamp < Date.now();
            let logsMissed = 0;

            let hours = Math.floor(timestampDifference / 1000 / 60 / 60);
            let minutes = Math.round((timestampDifference - (hours * 1000 * 60 * 60)) / 1000 / 60);

            if (minutes === 60) {
                minutes = 0;
                hours += 1;
            }

            timerString = "";

            if (hours > 0) {
                if (hasPassed && hours >= 8) {
                    logsMissed = Math.floor(hours / 36) + 1;
                    hours = Math.abs(hours - 36 * logsMissed);

                    if (minutes > 0) {
                        hours--;
                        minutes = 60 - minutes;
                    }
                }

                timerString = `${hours}h`;
            }

            if (minutes > 0) {
                timerString += `${hours > 0 ? " " : ""}${minutes}m`;
            }

            if (logsMissed > 0) {
                timerString = `~${timerString}`;
            }

            if (hasPassed && logsMissed === 0) {
                timerString += " ago";
            }

            if (hours == 0 && minutes == 0) {
                timerString = "Almost ready!"
            }
        }

        return timerString;
    }
    // #endregion
})();
