// ==UserScript==
// @name         MH - Golem Visit Stats
// @version      2.1.1
// @description  Shows golem visit numbers without having to bell your golem or have an idle one. Also adds a small tooltip in the aura to inform you of the hours left until max aura and the number of golems / hats needed for it.
// @author       hannadDev
// @namespace    https://greasyfork.org/en/users/1238393-hannaddev
// @match        https://www.mousehuntgame.com/*
// @icon         https://www.mousehuntgame.com/images/items/stats/large/680f6a68612ca9181a90b5719b20ef78.png
// @require      https://cdn.jsdelivr.net/npm/mh-assets@1.0.3/scripts/utils.js
// @require      https://cdn.jsdelivr.net/npm/mh-assets@1.0.3/scripts/statics.js
// @require      https://cdn.jsdelivr.net/npm/mousehunt-utils@1.10.5/mousehunt-utils.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482957/MH%20-%20Golem%20Visit%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/482957/MH%20-%20Golem%20Visit%20Stats.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const stylesheetUrl = "https://cdn.jsdelivr.net/npm/mh-assets@1.0.8/stylesheets/main.css";
    const dataUrl = "https://raw.githubusercontent.com/hannadDev/mh-assets/main/data/golem-visit-stats-data.json";

    hd_utils.addStyleElement(stylesheetUrl);

    let data = {
        eventYear: "0",
        eventEndTimestamp: 0,
        shutdownPeriodTimestamp: 0
    };

    // #region Variables
    let isDebug = false;

    const localStorageKey = `mh-golem-visit-stats`;

    let storedData = {};
    // #endregion

    // #region Observers
    const observer = new MutationObserver(function (mutations) {
        if (isDebug) {
            console.log("Mutated");
            for (const mutation of mutations) {
                console.log({ mutation });
                console.log(mutation.target);
            }
        }

        // Only save if something was added.
        if (mutations.some(v => v.type === "childList" && v.addedNodes.length > 0 && v.target.className !== "journaldate")) {
            saveEntries();
        }
    });

    function activateMutationObserver() {
        let observerTarget = document.querySelector(`#journalContainer .content`);

        if (observerTarget !== null && observerTarget !== undefined) {
            observer.observe(observerTarget, {
                childList: true,
                subtree: true
            });
        }
    }

    const xhrObserver = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener("load", function () {
            if (this.responseURL === `https://www.mousehuntgame.com/managers/ajax/turns/activeturn.php`) {
                if (isDebug) {
                    console.log("Horn detected");
                }

                saveEntries();
            } else if (this.responseURL === `https://www.mousehuntgame.com/managers/ajax/pages/page.php`) {
                if (isDebug) {
                    console.log("Page load detected");
                }

                activateMutationObserver();
            }
        })
        xhrObserver.apply(this, arguments);
    }
    // #endregion

    // #region Golem Stats Methods
    function getGolemStats(year = data.eventYear) {
        cleanUpEntries();

        let golemStats = {};
        let isCached = false;

        let userQuests = null;
        if (user.quests.QuestIceFortress !== undefined) {
            userQuests = user.quests.QuestIceFortress;
        }

        if (user.quests.QuestCinnamonTreeGrove !== undefined) {
            userQuests = user.quests.QuestCinnamonTreeGrove;
        }

        if (user.quests.QuestGolemWorkshop !== undefined) {
            userQuests = user.quests.QuestGolemWorkshop;
        }

        let total = {
            Golems: 0,
            Hats: 0,
            Scarves: 0
        };

        if (year === data.eventYear && userQuests !== null) {
            for (const k1 in userQuests.destinations) {
                for (const k2 in userQuests.destinations[k1].environments) {
                    if (userQuests.destinations[k1].environments[k2].num_golem_visits !== null) {
                        golemStats[userQuests.destinations[k1].environments[k2].name] = {
                            Golems: userQuests.destinations[k1].environments[k2].num_golem_visits
                        };
                    }
                }
            }

            // Cache data if year is current year
            if (year === data.eventYear) {
                setYearStats(golemStats, data.eventYear);
            }
        } else {
            isCached = true;
            golemStats = (storedData[year] !== undefined) ? storedData[year]["stats"] ?? [] : [];
        }

        for (const k in golemStats) {
            total.Golems += golemStats[k].Golems;

            if (storedData[year] !== undefined && storedData[year]["scrapedStats"] !== undefined && storedData[year]["scrapedStats"][k] !== undefined) {
                golemStats[k].Hats = storedData[year]["scrapedStats"][k].Hats;
                golemStats[k].Scarves = storedData[year]["scrapedStats"][k].Scarves;

                total.Hats += storedData[year]["scrapedStats"][k].Hats;
                total.Scarves += storedData[year]["scrapedStats"][k].Scarves;
            } else {
                golemStats[k].Hats = 0;
                golemStats[k].Scarves = 0;
            }
        }

        if (isDebug) {
            console.log("Golem Stats:");
            console.log(golemStats);

            console.log("Total:");
            console.log(total);
        }

        if (golemStats !== "") {
            createGolemStatsPopup(golemStats, total, isCached, year);
        }
    }

    function showButton() {
        const target = document.querySelector(".mousehuntHud-gameInfo");
        if (target) {
            const link = document.createElement("a");
            link.id = "golem-stats-button";
            link.innerText = "[Golem Stats]";
            link.addEventListener("click", function () {
                getGolemStats();
            });
            target.prepend(link);
        }
    }

    function createGolemStatsPopup(golemStats, totalStats, isCached, year) {
        document.querySelectorAll("#golem-stats-popup-div").forEach(el => el.remove());

        const golemStatsPopup = document.createElement("div");
        golemStatsPopup.id = ("golem-stats-popup-div");
        golemStatsPopup.classList.add("hd-popup");

        // Golem Stats Division
        const golemStatsDiv = document.createElement("div");

        // Title
        const title = document.createElement("h2");
        title.innerText = `Golem Visit Stats - ${year}`
        title.classList.add("hd-bold");
        golemStatsDiv.appendChild(title);

        // Subtitle
        if (isCached) {
            const subtitle = document.createElement("h4");

            if (year === data.eventYear) {
                subtitle.innerText = "Visit event area for latest stats";
            } else {
                subtitle.innerText = "Showing previous year's cached data";
            }

            golemStatsDiv.appendChild(subtitle);
        }

        const spacing = document.createElement("br");
        golemStatsDiv.appendChild(spacing);

        // Table for golem stats
        const golemStatsTable = document.createElement("table");
        golemStatsTable.id = "golem-stats-table"
        golemStatsTable.classList.add("hd-table");

        const headings = ["Locations", "Golems", "Hats", "Scarves"];

        // Create headings
        for (let i = 0; i < headings.length; ++i) {
            const headingElement = document.createElement("th");
            headingElement.id = `golem-stats-${headings[i].toLowerCase()}-heading`;
            headingElement.innerText = headings[i];
            headingElement.classList.add("hd-table-heading");

            golemStatsTable.appendChild(headingElement);
        }

        // Table Body
        const tableBody = document.createElement("tbody");

        let j = 0
        for (const location in golemStats) {
            const tableRow = document.createElement("tr");
            tableRow.id = "golem-stats-table-row-" + j

            for (let i = 0; i < headings.length; ++i) {
                const tdElement = document.createElement("td");
                tdElement.innerText = i === 0 ? location : golemStats[location][headings[i]];
                tdElement.classList.add("hd-table-td");

                tableRow.appendChild(tdElement);
            }

            tableBody.appendChild(tableRow);

            j++;
        }

        // Total Stats
        const totalStatsRow = document.createElement("tr");
        totalStatsRow.id = "golem-stats-table-row-total";
        totalStatsRow.classList.add("hd-table-footer-tr");

        for (let i = 0; i < headings.length; ++i) {
            const tdElement = document.createElement("td");
            tdElement.innerText = i === 0 ? "Total" : totalStats[headings[i]];
            tdElement.classList.add("hd-table-td", "hd-bold");

            totalStatsRow.appendChild(tdElement);
        }

        tableBody.appendChild(totalStatsRow);

        // Final append
        golemStatsTable.appendChild(tableBody)
        golemStatsDiv.appendChild(golemStatsTable);
        golemStatsPopup.appendChild(golemStatsDiv);

        // Years links
        const linksDiv = document.createElement("div");
        linksDiv.classList.add("hd-m-2");
        
        const years = Object.keys(storedData);
        const indexOfFlags = years.indexOf("Flags");
        if (indexOfFlags >= 0) {
            years.splice(indexOfFlags, 1);
        }

        for (const y of years) {
            let yearLink;
            if (y === year) {
                yearLink = document.createElement("span");
            } else {
                yearLink = document.createElement("a");
                yearLink.onclick = function () {
                    getGolemStats(y);
                }
            }

            yearLink.id = `${y}-link`;
            yearLink.innerText = `${y}`;
            yearLink.classList.add("hd-m-2");
            linksDiv.appendChild(yearLink);
        }

        // Append
        golemStatsPopup.appendChild(linksDiv);

        // Close button
        const closeButton = document.createElement("button");
        closeButton.id = "close-button";
        closeButton.textContent = "Close";
        closeButton.classList.add("hd-button");
        closeButton.onclick = function () {
            document.body.removeChild(golemStatsPopup);
        }

        // Append
        golemStatsPopup.appendChild(closeButton);

        // Final Append
        document.body.appendChild(golemStatsPopup);
        hd_utils.dragElement(golemStatsPopup, golemStatsDiv);
    }
    // #endregion

    // #region LocalStorage Methods
    function getStoredData() {
        const savedData = localStorage.getItem(localStorageKey);

        if (savedData !== null) {
            return JSON.parse(savedData);
        }

        return {};
    }

    function setData(stats) {
        localStorage.setItem(localStorageKey, JSON.stringify(stats));
    }

    function setYearStats(stats, year) {
        if (storedData[year] === undefined) {
            storedData[year] = {};
        }

        storedData[year]["stats"] = stats;
        setData(storedData);
    }

    function setYearLogs(logEntries, scrapedStats, year) {
        if (storedData[year] === undefined) {
            storedData[year] = {};
        }

        storedData[year]["logEntries"] = logEntries;
        storedData[year]["scrapedStats"] = scrapedStats;
        setData(storedData);
    }
    // #endregion

    // #region Aura Methods
    function calculateAura() {
        if (document.querySelector(".MiniEventFestiveAura") != null && document.querySelector(".MiniEventFestiveAura").classList.contains("active")) {
            const festiveAuraTooltipElement = document.querySelector(".MiniEventFestiveAura .trapImageView-tooltip-trapAura");

            // #region Current Aura
            const currentAuraTextSplit = festiveAuraTooltipElement.innerText.split("expires on:");
            const currentAuraDateSplit = currentAuraTextSplit[currentAuraTextSplit.length - 1].trim().split(" ");

            if (isDebug) {
                console.log("Current Aura Date Split");
                console.log(currentAuraDateSplit);
            }

            const timeSplit = currentAuraDateSplit[4].split(":");
            let hours = timeSplit[0];
            const minutes = timeSplit[1].slice(0, timeSplit[1].length - 2);
            let period = timeSplit[1].slice(timeSplit[1].length - 2, timeSplit[1].length);

            if (period === "pm" && hours != "12") {
                hours = 12 + parseInt(hours);
            }

            const parsedDate = new Date(`${currentAuraDateSplit[2]}/${hd_statics.monthMap.get(currentAuraDateSplit[0])}/${currentAuraDateSplit[1].replace(",", "")} ${hours}:${minutes}`);

            const parsedDateTimestamp = parsedDate.getTime();

            if (isDebug) {
                console.log("Time Split:");
                console.log(timeSplit);
                console.log(`Hours= ${hours}`);
                console.log(`Minutes= ${minutes}`);
                console.log(`Time Period= ${period}`);
                console.log(`ParsedDate= ${parsedDate}`);
                console.log(`ParsedDate Timestamp= ${parsedDateTimestamp}`);
            }
            // #endregion

            // #region End Date of Aura
            let endAuraTextSplit = festiveAuraTooltipElement.innerText.split("to:")[1].split("Your")[0];
            endAuraTextSplit = endAuraTextSplit.replace("(", "");
            endAuraTextSplit = endAuraTextSplit.replace(")", "");
            let endAuraDateTextSplit = endAuraTextSplit.trim().split(" ");

            const endTimeSplit = endAuraDateTextSplit[3].split(":");
            let endHours = endTimeSplit[0];
            const endMinutes = endTimeSplit[1].slice(0, endTimeSplit[1].length - 2);
            let endPeriod = endTimeSplit[1].slice(endTimeSplit[1].length - 2, endTimeSplit[1].length);

            if (endPeriod === "pm" && endHours != "12") {
                endHours = 12 + parseInt(endHours);
            }

            const parsedEndDate = new Date(`${endAuraDateTextSplit[2]}/${hd_statics.monthMap.get(endAuraDateTextSplit[0])}/${endAuraDateTextSplit[1].replace(",", "")} ${endHours}:${endMinutes}`).getTime();

            if (isDebug) {
                console.log(`EndAuraTextSplit= ${endAuraTextSplit}`);
                console.log(`EndAuraDateTextSplit`);
                console.log(endAuraDateTextSplit);
                console.log(`ParsedEndDate= ${parsedEndDate}`);
            }
            // #endregion

            // #region Golem Stats
            const hoursDifference = (parsedEndDate - parsedDateTimestamp) / 1000 / 60 / 60;

            if (isDebug) {
                console.log(`HoursDifference= ${hoursDifference}`);
            }
            // #endregion

            // #region Max Hunts Stats
            const currentTimestamp = Date.now();

            const maxHunts = (data.eventEndTimestamp - currentTimestamp) / 1000 / 60 / 60 * 5;
            const maxShutdownHunts = (data.shutdownPeriodTimestamp - currentTimestamp) / 1000 / 60 / 60 * 5;

            if (isDebug) {
                console.log(`eventEndTimestamp= ${data.eventEndTimestamp}`);
                console.log(`shutdownPeriodTimestamp= ${data.shutdownPeriodTimestamp}`);
                console.log(`currentTimestamp= ${currentTimestamp}`);
                console.log(`maxHunts= ${maxHunts}`);
                console.log(`maxShutdownHunts= ${maxShutdownHunts}`);
            }
            // #endregion

            // #region Adding tooltip UI
            if (document.getElementById("max-aura-stats-tooltip")) {
                document.getElementById("max-aura-stats-tooltip").remove();
            }

            const maxAuraStatsDiv = document.createElement("div");
            maxAuraStatsDiv.id = "max-aura-stats-tooltip";
            maxAuraStatsDiv.appendChild(document.createElement("br"));

            if (hoursDifference > 0) {
                const hoursRemainingText = document.createTextNode(`Hours needed for max aura: ${hoursDifference.toFixed(2)}`);
                maxAuraStatsDiv.appendChild(hoursRemainingText);

                maxAuraStatsDiv.appendChild(document.createElement("br"));
                const golemsNeededText = document.createTextNode(`${Math.ceil(hoursDifference / 5)} golems in ${Math.ceil(Math.ceil(hoursDifference / 5) / 3) * 25} hunts`);
                maxAuraStatsDiv.appendChild(golemsNeededText);

                maxAuraStatsDiv.appendChild(document.createElement("br"));
                const hatsNeededText = document.createTextNode(`${Math.ceil(hoursDifference / 10)} hats in ${Math.ceil(Math.ceil(hoursDifference / 10) / 3) * 25} hunts`);
                maxAuraStatsDiv.appendChild(hatsNeededText);

                if (maxHunts > 0 || maxShutdownHunts > 0) {
                    maxAuraStatsDiv.appendChild(document.createElement("br"));
                }

                if (maxShutdownHunts > 0) {
                    maxAuraStatsDiv.appendChild(document.createElement("br"));
                    const maxShutdownHuntsText = document.createTextNode(`Larry gets ${Math.floor(maxShutdownHunts)} hunts until shutdown.`);
                    maxAuraStatsDiv.appendChild(maxShutdownHuntsText);
                }

                if (maxHunts > 0) {
                    maxAuraStatsDiv.appendChild(document.createElement("br"));
                    const maxHuntsText = document.createTextNode(`Until GWH ends, Larry gets ${Math.floor(maxHunts)} hunts, can you?`);
                    maxAuraStatsDiv.appendChild(maxHuntsText);
                }
            }
            else {
                const maxAuraText = document.createTextNode("Max aura time reached 🐋 Time to shore🎉");
                maxAuraStatsDiv.appendChild(maxAuraText);
            }

            festiveAuraTooltipElement.appendChild(maxAuraStatsDiv);
            // #endregion
        }
    }
    // #endregion

    // #region Journal Scraping Methods
    function saveEntries() {
        const ownJournal = document.querySelector(`#journalEntries${user.user_id}`);

        if (!ownJournal) {
            if (isDebug) {
                console.log(`Other hunters' profile detected`);
            }

            return;
        }

        const entries = document.querySelectorAll(".entry");

        let savedEntries = {};
        if (storedData[data.eventYear] != undefined && storedData[data.eventYear]["logEntries"] != undefined) {
            savedEntries = storedData[data.eventYear]["logEntries"];
        }

        let savedScrapedStats = {};
        if (storedData[data.eventYear] != undefined && storedData[data.eventYear]["scrapedStats"] != undefined) {
            savedScrapedStats = storedData[data.eventYear]["scrapedStats"];
        }

        let addedNewEntries = false;
        for (const entry of entries) {
            const entryId = entry.dataset.entryId

            if (!entryId) return;

            if (savedEntries[entryId]) {
                if (isDebug) console.log(`Entry ${entryId} already stored`);
            }
            else {
                if (isDebug) console.log(`Stored new entry ${entryId}`);

                if (entry.className.search(/(sendGolem)/) !== -1) {
                    let entryInfo = extractInfoFromEntry(entry);
                    savedEntries[entry.dataset.entryId] = entryInfo;

                    if (savedScrapedStats[entryInfo.LocationName] !== undefined) {
                        if (entryInfo.Hat) savedScrapedStats[entryInfo.LocationName].Hats++;
                        if (entryInfo.Scarf) savedScrapedStats[entryInfo.LocationName].Scarves++;
                    } else {
                        savedScrapedStats[entryInfo.LocationName] = {
                            Hats: entryInfo.Hat ? 1 : 0,
                            Scarves: entryInfo.Scarf ? 1 : 0
                        }
                    }

                    addedNewEntries = true;
                }
            }
        }

        if (addedNewEntries) {
            setYearLogs(savedEntries, savedScrapedStats, data.eventYear);
        }
    }

    function cleanUpEntries() {
        if (!storedData.Flags) {
            storedData.Flags = [];
        }

        if (storedData.CleanedUpEntries20241211) {

            storedData.Flags.push("CleanedUpEntries20241211");
            delete storedData.CleanedUpEntries20241211;
            return;
        }

        if (storedData.Flags.includes("CleanedUpEntries20241211")) {
            return;
        }

        let savedEntries = {};
        if (storedData["2024"] != undefined && storedData["2024"]["logEntries"] != undefined) {
            savedEntries = storedData["2024"]["logEntries"];
        }

        for (const entryId in savedEntries) {
            if (savedEntries[entryId].LocationName.indexOf("the ") === 0) {
                savedEntries[entryId].LocationName = savedEntries[entryId].LocationName.replace("the ", "");
            }
        }

        let savedScrapedStats = {};
        if (storedData["2024"] != undefined && storedData["2024"]["scrapedStats"] != undefined) {
            savedScrapedStats = storedData["2024"]["scrapedStats"];
        }

        for (const locationName in savedScrapedStats) {
            if (locationName.indexOf("the ") === 0) {
                const trimmedLocationName = locationName.replace("the ", "");

                if (!savedScrapedStats[trimmedLocationName]) {
                    savedScrapedStats[trimmedLocationName] = { "Hats": 0, "Scarves": 0 };
                }

                savedScrapedStats[trimmedLocationName]["Hats"] += savedScrapedStats[locationName]["Hats"];
                savedScrapedStats[trimmedLocationName]["Scarves"] += savedScrapedStats[locationName]["Scarves"];
                delete savedScrapedStats[locationName];
            }
        }

        storedData.Flags.push("CleanedUpEntries20241211");
        setYearLogs(savedEntries, savedScrapedStats, data.eventYear);
    }

    function extractInfoFromEntry(entry) {
        const info = {
            LocationName: "",
            Hat: false,
            Scarf: false
        };

        const journalText = entry.querySelector(".journaltext").innerText;
        info.Hat = journalText.includes("Hat");
        info.Scarf = journalText.includes("Scarf");

        const split1 = journalText.split("It lumbered towards ");
        if (split1[1] === undefined) return null;

        split1[1] = split1[1].replace("the ", "");

        const split2 = split1[1].split(" and will be back");
        info.LocationName = split2[0];

        return info;
    }
    // #endregion

    function Initialize() {
        if (isDebug) console.log(`Initializing.`);

        storedData = getStoredData();

        showButton();
        calculateAura();
        activateMutationObserver();

        // #region Listeners
        onPageChange({
            change: () => { calculateAura(); }
        });

        onRequest(() => {
            calculateAura();
        }, "managers/ajax/turns/activeturn.php");
        //#endregion
    }

    hd_utils.readJson(dataUrl, (obj) => {
        data = obj;
        Initialize();
    });
})();