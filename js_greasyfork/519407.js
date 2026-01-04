// ==UserScript==
// @name         CS Successful Trade Message Generator
// @namespace    https://www.chickensmoothie.com/Forum/memberlist.php?mode=viewprofile&u=1032262
// @version      1.1
// @description  Creates a successful trade message for you to share! Needs the CS Trade Values script to function
// @author       OreozHere
// @match        https://www.chickensmoothie.com/trades/viewtrade.php?id=*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/519407/CS%20Successful%20Trade%20Message%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/519407/CS%20Successful%20Trade%20Message%20Generator.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (!document.body.textContent.includes("accepted")) return;

    const tradeLinkBox = document.querySelector("#view-trade-share-link-box");
    if (!tradeLinkBox) return;

    const tradeUrl = tradeLinkBox.value;

    const rrTable = {
        "Very rare": {
            "0.25 MA": ["2009",],
            "0.2 MA": ["2011"],
            "40-50C$": ["2013"],
            "30-40C$": ["2016"],
            "20-30C$": ["2019"],
            "16-20C$": ["2022"],
            "10-16C$": ["2024"]
        },
        "Rare": {
            "0.15 MA": ["2009"],
            "0.1 MA": ["2011"],
            "20-25C$": ["2013"],
            "15-20C$": ["2016"],
            "10-15C$": ["2019"],
            "8-10C$": ["2022"],
            "5-8C$": ["2024"]
        },
    };

    function parseTradeSide(panel) {
        const pets = panel.querySelectorAll("li.pet");
        const namedValues = [];
        const yearRarityCount = {};

        pets.forEach((pet) => {
            const dateText = pet.textContent.match(/(\d{4})-\d{2}-\d{2}/)?.[0];
            const yearText = dateText?.match(/(\d{4})/)?.[1];
            const rarityElement = pet.querySelector("img.rarity-bar");
            const rarityText = rarityElement ? rarityElement.alt.toLowerCase() : "unknown rarity";
            const valueElement = pet.querySelector(".pet-value");
            const valueText = valueElement ? valueElement.textContent.trim() : null;

            const cleanValueText = valueText?.replace("🔼" || "⏫", "").trim();

            if (rarityText.includes("common")) return;

            if (dateText && dateText.endsWith("-12-18") && cleanValueText && rarityText !== "unknown rarity") {
                const tableEntry = rrTable[rarityText.charAt(0).toUpperCase() + rarityText.slice(1)];
                if (tableEntry && tableEntry[cleanValueText]) {
                    const possibleYears = tableEntry[cleanValueText];
                    const mostRecentYear = Math.max(...possibleYears.map(year => parseInt(year, 10)));
                    const key = `${mostRecentYear} ${rarityText}`;
                    yearRarityCount[key] = (yearRarityCount[key] || 0) + 1;
                    return;
                }
            }

            if (cleanValueText && cleanValueText.includes(":") && cleanValueText.includes("MA")) {
                const convertedValue = cleanValueText.replace(/(\d+)-(\d+)\sold rares/, (_, min, max) => {
                    const minMa = (parseInt(min) / 10).toFixed(1);
                    const maxMa = (parseInt(max) / 10).toFixed(1);
                    return `${Math.round(minMa)}–${Math.round(maxMa)} ma`;
                }).replace(/(\d+)\sold rares/, (_, num) => {
                    const maValue = (num / 10).toFixed(1);
                    return `${maValue.endsWith('.0') ? maValue.slice(0, -2) : maValue} ma`;
                });
                namedValues.push(convertedValue);
            } else if (cleanValueText && cleanValueText.includes("MA")) {
                const convertedValue = cleanValueText.replace(/(\d+)\sold rares/, (_, num) => {
                    const maValue = (num).toFixed(1);
                    return `${maValue.endsWith('.0') ? maValue.slice(0, -2) : maValue} ma`;
                });
                const key = `${yearText} ${rarityText}`;
                yearRarityCount[key] = (yearRarityCount[key] || 0) + 1;
            } else {
                const key = `${yearText} ${rarityText}`;
                yearRarityCount[key] = (yearRarityCount[key] || 0) + 1;
            }
        });

        const formattedCounts = [];
        for (const [key, count] of Object.entries(yearRarityCount)) {
            const rarityWithPlural = key.replace(/ rare$/, count > 1 ? " rares" : " rare");
            formattedCounts.push(`${count} ${rarityWithPlural}`);
        }

        const chickenDollars = panel.querySelector(".chicken-dollars");
        if (chickenDollars) {
            formattedCounts.push(chickenDollars.textContent.trim());
        }

        return [...namedValues, ...formattedCounts].join(", ");
    }

    const tradePanels = document.querySelectorAll("div.section.panel.bg4");
    if (tradePanels.length < 2) return;

    const theirSide = parseTradeSide(tradePanels[0]);
    const mySide = parseTradeSide(tradePanels[1]);

    function truncateDuplicates(message) {
        const petNames = message.split(", ");
        const petCount = {};
        const result = [];

        petNames.forEach(name => {
            petCount[name] = (petCount[name] || 0) + 1;
        });

        for (const [name, count] of Object.entries(petCount)) {
            if (count > 1) {
                result.push(`${name} x${count}`);
            } else {
                result.push(name);
            }
        }

        return result.join(", ");
    }

    const tradeMessage = `[url=${tradeUrl}]${truncateDuplicates(theirSide)} [b]for[/b] ${truncateDuplicates(mySide)}[/url]`;

    const container = tradeLinkBox.parentNode;
    const newInputBox = document.createElement("input");
    newInputBox.type = "text";
    newInputBox.id = "trade-message-box";
    newInputBox.value = tradeMessage;
    newInputBox.style.marginTop = "10px";
    newInputBox.style.width = "50%";

    const copyLink = document.createElement("a");
    copyLink.href = "#";
    copyLink.style.display = "inline-block";
    copyLink.textContent = "Click to copy trade message!";
    copyLink.style.marginLeft = "10px";
    copyLink.style.marginTop = "10px";

    copyLink.addEventListener("click", (event) => {
        event.preventDefault();
        GM_setClipboard(tradeMessage);
        copyLink.textContent = "Copied to clipboard!";
    });

    const containerWrapper = document.createElement("div");
    containerWrapper.style.display = "flex";
    containerWrapper.style.alignItems = "center";
    containerWrapper.appendChild(newInputBox);
    containerWrapper.appendChild(copyLink);

    const newInputContainer = document.createElement("div");
    newInputContainer.style.marginTop = "10px";
    newInputContainer.appendChild(containerWrapper);

    container.appendChild(newInputContainer);
})();
