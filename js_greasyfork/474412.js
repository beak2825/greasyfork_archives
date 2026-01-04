// ==UserScript==
// @name         Torn Crimes Card Skimming Extended
// @namespace    https://github.com/SOLiNARY
// @version      0.5.6
// @description  Sorts all installed card skimmers by location, time installed, score or cards skimmed. Adds card/hour stat. Remembers your choice.
// @author       Ramin Quluzade, Silmaril [2665762]
// @license      MIT License
// @match        https://www.torn.com/loader.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474412/Torn%20Crimes%20Card%20Skimming%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/474412/Torn%20Crimes%20Card%20Skimming%20Extended.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sortBy = {
        "Location": 10,
        "TimeInstalled": 20,
        "CardsSkimmed": 30,
        "Score": 40
    };
    const sortDirection = {
        "Ascending": 1,
        "Descending": -1
    }

    const viewPortWidthPx = window.innerWidth;
    const isMobileView = viewPortWidthPx <= 784;
    let currentSortBy = localStorage.getItem("silmaril-torn-crimes-card-skimming-sorting-by") ?? sortBy.Location;
    currentSortBy = parseInt(currentSortBy);
    let currentSortDirection = localStorage.getItem("silmaril-torn-crimes-card-skimming-sorting-direction") ?? sortDirection.Descending;
    currentSortDirection = parseInt(currentSortDirection);

    const targetNode = document.querySelector("div.crimes-app");
    const config = { childList: true, subtree: true };

    const observer = new MutationObserver((mutationsList, observer) => {
        const divs = document.querySelectorAll("div[class*=currentCrime___]");
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.target.className == 'crime-root cardskimming-root') {
                divs.forEach((div) => {
                    div.addEventListener("click", function (event) {
                        if (event.target.matches("div[class*=topSection___] div[class*=crimeBanner___] div[class*=crimeSliderArrowButtons___] button[class*=arrowButton___]")) {
                            observer.observe(targetNode, config);
                        }
                        if (event.target.matches("div[class*=crimeOptionGroup___]:not([class*=firstGroup___]) div.silmaril-crimes-card-skimming-sorting")) {
                            let sortName = event.target.getAttribute("data-sort-name");
                            let newSortBy = sortBy[sortName];
                            let newSortDirection = newSortBy === currentSortBy ? currentSortDirection * -1 : currentSortDirection;
                            sortChildElements(mutation.target, newSortBy, newSortDirection);
                            currentSortBy = newSortBy;
                            currentSortDirection = newSortDirection;
                            localStorage.setItem("silmaril-torn-crimes-card-skimming-sorting-by", newSortBy);
                            localStorage.setItem("silmaril-torn-crimes-card-skimming-sorting-direction", newSortDirection);
                        }
                    });
                });

                addHeader(mutation.target);
                sortChildElements(mutation.target, currentSortBy, currentSortDirection);
                observer.disconnect();
                break;
            }
        }
    });

    observer.observe(targetNode, config);

    // Function to sort child elements
    function sortChildElements(element, sortByProperty, sortDirection) {
        const parentElement = element.querySelector('[class*=crimeOptionGroup___]:not([class*=firstGroup___])');
        const childElements = Array.from(parentElement.querySelectorAll('[class*=crimeOption___]:not(.silmaril-card-skimming-header)'));
        let locationStats = {};

        // Append sorted elements back to the parent element
        childElements.forEach(element => {
            let cardsSkimmed = element.querySelector('[class*=crimeOptionSection___][class*=statusSection___] [class*=statusCards___]').textContent;
            let hoursElapsed = parseVerbalTimestamp(element.querySelector(`[class*=crimeOptionSection___]${isMobileView ? '[class*=tabletMainSection___] div[class*=timeActive___]' : '[class*=timeSection___]'}`).textContent) / 3600;
            let locationDiv = element.querySelector('[class*=crimeOptionSection___][class*=flexGrow___]');
            let location = null;

            let locationText = locationDiv.innerText;
            let newLineIdx = locationText.indexOf('\n');
            if (newLineIdx >= 0){
                location = locationText.substring(0, newLineIdx);
            } else {
                location = locationText;
            }

            if (element.querySelector('div.stats') === null) {
                if (isMobileView){
                    const statsDivNew = document.createElement('div');
                    statsDivNew.className = 'stats';
                    statsDivNew.style.fontSize = '.6rem';
                    locationDiv.appendChild(statsDivNew);
                } else {
                    const delimiter = document.createElement('div');
                    delimiter.className = 'sectionDelimiter___NpsSC';
                    const statsDivNew = document.createElement('div');
                    statsDivNew.className = 'crimeOptionSection___hslpu stats';
                    locationDiv.outerHTML += delimiter.outerHTML + statsDivNew.outerHTML;
                }
            }

            let statsDiv = element.querySelector('div.stats');
            let statsScore = (cardsSkimmed / hoursElapsed).toFixed(2);
            statsDiv.textContent = `${statsScore} card/hour`;
            element.setAttribute('data-score', parseFloat(statsScore).toFixed(2));

            // Add stats to the locationStats object
            if (!locationStats[location]) {
                locationStats[location] = {
                    totalScore: 0,
                    totalCount: 0
                };
            }

            locationStats[location].totalScore += parseFloat(statsScore);
            locationStats[location].totalCount++;
        });

        // Sort card skimmers based on the filter
        switch (sortByProperty){
            case sortBy.Location:
                childElements.sort((a, b) => {
                    const aValue = a.querySelector('[class*=crimeOptionSection___][class*=flexGrow___]').textContent;
                    const bValue = b.querySelector('[class*=crimeOptionSection___][class*=flexGrow___]').textContent;
                    return aValue.localeCompare(bValue) * sortDirection;
                });
                break;
            case sortBy.TimeInstalled:
                if (isMobileView) {
                    childElements.sort((a, b) => {
                        const aValue = parseVerbalTimestamp(a.querySelector('[class*=crimeOptionSection___][class*=tabletMainSection___] div[class*=timeActive___]').textContent);
                        const bValue = parseVerbalTimestamp(b.querySelector('[class*=crimeOptionSection___][class*=tabletMainSection___] div[class*=timeActive___]').textContent);
                        return (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) * sortDirection;
                    });
                } else {
                    childElements.sort((a, b) => {
                        const aValue = parseVerbalTimestamp(a.querySelector('[class*=crimeOptionSection___][class*=timeSection___]').textContent);
                        const bValue = parseVerbalTimestamp(b.querySelector('[class*=crimeOptionSection___][class*=timeSection___]').textContent);
                        return (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) * sortDirection;
                    });
                }
                break;
            case sortBy.Score:
                childElements.sort((a, b) => {
                    const aValue = a.getAttribute('data-score');
                    const bValue = b.getAttribute('data-score');
                    return aValue.localeCompare(bValue, undefined, {'numeric': true}) * sortDirection;
                });
                break;
            case sortBy.CardsSkimmed:
                childElements.sort((a, b) => {
                    const aValue = a.querySelector('[class*=crimeOptionSection___][class*=statusSection___] [class*=statusCards___]').textContent;
                    const bValue = b.querySelector('[class*=crimeOptionSection___][class*=statusSection___] [class*=statusCards___]').textContent;
                    return aValue.localeCompare(bValue, undefined, {'numeric': true}) * sortDirection;
                });
                break;
            default:
                console.error("[TornCrimesCardSkimmingSorting] Unexpected sort values!", sortByProperty, sortDirection);
                break;
        }

        childElements.forEach(element => {
            parentElement.appendChild(element);
        });

        let locationsDropdown = document.querySelector('div[class*=locationSelectSection___] ul');

        // Calculate the average stat score for each location and append it to dropdown option
        for (let location in locationStats) {
            const averageScore = (locationStats[location].totalScore / locationStats[location].totalCount).toFixed(2);
            let option = locationsDropdown.querySelector(`li#option-${location.replace(' ', '-')}`);
            let stats = option.querySelector('p.stats') ?? addStatsBlockToDropdownOption(option);
            stats.textContent = ` ${averageScore} c/h`;
        }

        let totalStatsDiv = document.querySelector("div[class*=currentCrime___] div[class*=titleBar___] div.total-stats") ?? addTotalStats();

        // Calculate the overall average stat score
        let overallTotalScore = 0;
        let overallTotalCount = 0;

        for (let location in locationStats) {
            overallTotalScore += locationStats[location].totalScore;
            overallTotalCount += locationStats[location].totalCount;
        }

        const overallScore = overallTotalScore.toFixed(2);
        totalStatsDiv.textContent = isMobileView ? `${overallScore} c/h - ${overallTotalCount}/20 skimmers` : `${overallScore} card/hour with ${overallTotalCount}/20 skimmers`;
    }

    function addTotalStats() {
        const statBlock = document.createElement('div');
        statBlock.className = 'total-stats';
        let crimeTitle = document.querySelector("div[class*=currentCrime___] div[class*=titleBar___] div[class*=title___]");
        crimeTitle.parentNode.insertBefore(statBlock, crimeTitle.nextSibling);
        return statBlock;
    }

    function addStatsBlockToDropdownOption(element) {
        const statBlock = document.createElement('p');
        statBlock.className = 'stats';
        element.appendChild(statBlock);
        return statBlock;
    }

    function addHeader(element) {
        const parentElement = element.querySelector('[class*=crimeOptionGroup___]:not([class*=firstGroup___])');
        let header = parentElement.querySelector('[class*=crimeOption___]').cloneNode(true);
        header.classList.add("silmaril-card-skimming-header");
        let headerDiv = header.querySelector('[class*=sections___]');
        headerDiv.style.height = "25px";
        let imageDiv = header.querySelector('[class*=crimeOptionImage___]');
        imageDiv.style = "display: flex;justify-content: center;align-items: center;flex-direction: row;height: 25px;";
        imageDiv.innerText = "Sort by";
        let nameDiv = header.querySelector('[class*=crimeOptionSection___][class*=flexGrow___]');
        nameDiv.style.cursor = "pointer";
        nameDiv.classList.add("silmaril-crimes-card-skimming-sorting");
        nameDiv.classList.add("silmaril-crimes-card-skimming-sorting-location");
        nameDiv.setAttribute("data-sort-name", "Location");
        nameDiv.innerHTML = "Location ⇧⇩";
        let scoreDiv = nameDiv.cloneNode(true);
        scoreDiv.classList.remove("silmaril-crimes-card-skimming-sorting-location");
        scoreDiv.classList.add("silmaril-crimes-card-skimming-sorting-score");
        scoreDiv.setAttribute("data-sort-name", "Score");
        scoreDiv.innerText = "Score ⇧⇩";

        let delimiter = document.createElement("div");
        delimiter.className = "sectionDelimiter___NpsSC";
        if (isMobileView) {
            nameDiv.parentNode.insertBefore(delimiter, nameDiv.nextSibling);
            let timeDiv = nameDiv.cloneNode(true);
            timeDiv.classList.remove("silmaril-crimes-card-skimming-sorting-location");
            timeDiv.classList.add("silmaril-crimes-card-skimming-sorting-time-installed");
            timeDiv.setAttribute("data-sort-name", "TimeInstalled");
            timeDiv.innerText = "Time ⇧⇩";
            delimiter.parentNode.insertBefore(timeDiv, delimiter.nextSibling);
            timeDiv.parentNode.insertBefore(delimiter, timeDiv.nextSibling);
            delimiter.parentNode.insertBefore(scoreDiv, delimiter.nextSibling);
        } else {
            let timeDiv = header.querySelector('[class*=crimeOptionSection___][class*=timeSection___]');
            timeDiv.style.cursor = "pointer";
            timeDiv.classList.add("silmaril-crimes-card-skimming-sorting");
            timeDiv.classList.add("silmaril-crimes-card-skimming-sorting-time-installed");
            timeDiv.setAttribute("data-sort-name", "TimeInstalled");
            timeDiv.innerText = "Time installed ⇧⇩";
            scoreDiv.style.justifyContent = 'space-around';
            scoreDiv.style.width = '13px';
            nameDiv.parentNode.insertBefore(delimiter, nameDiv.nextSibling);
            delimiter.parentNode.insertBefore(scoreDiv, delimiter.nextSibling);
        }

        let cardsDiv = header.querySelector('[class*=crimeOptionSection___][class*=statusSection___]');
        cardsDiv.style.cursor = "pointer";
        cardsDiv.classList.add("silmaril-crimes-card-skimming-sorting");
        cardsDiv.classList.add("silmaril-crimes-card-skimming-sorting-cards-skimmed");
        cardsDiv.setAttribute("data-sort-name", "CardsSkimmed");
        cardsDiv.innerText = isMobileView ? "Cards ⇧⇩" : "Cards skimmed ⇧⇩";

        header.querySelector(`[class*=commitButtonSection___] ${isMobileView ? '' : 'button'}`).remove();
        parentElement.appendChild(header);
    }

    function parseVerbalTimestamp(verbalTimestamp) {
        const timeUnits = {
            second: 1,
            seconds: 1,
            minute: 60,
            minutes: 60,
            hour: 3600,
            hours: 3600,
            day: 86400,
            days: 86400,
            week: 604800,
            weeks: 604800
        };

        const regex = /(\d+)\s+(\w+)/g;
        let totalSeconds = 0;

        let match;
        while ((match = regex.exec(verbalTimestamp))) {
            const [, value, unit] = match;
            if (timeUnits.hasOwnProperty(unit)) {
                totalSeconds += parseInt(value) * timeUnits[unit];
            }
        }

        return totalSeconds;
    }
})();