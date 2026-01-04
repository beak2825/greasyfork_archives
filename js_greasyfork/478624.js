// ==UserScript==
// @name         POD - Decimal to American V3.5
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Converts decimal odds to American odds and adds copy text and search buttons.
// @author       You
// @match        https://www.pinnacleoddsdropper.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478624/POD%20-%20Decimal%20to%20American%20V35.user.js
// @updateURL https://update.greasyfork.org/scripts/478624/POD%20-%20Decimal%20to%20American%20V35.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Decimal to American odds conversion functionality
    const regexPattern = /^(?:\d{1,2}\.\d{1,3}|[0-9])$/;

    function convertOdds(decimalOdds) {
        if (decimalOdds >= 2.00) {
            return `+${Math.round((decimalOdds - 1) * 100)}`;
        } else {
            return `-${Math.round(100 / (decimalOdds - 1))}`;
        }
    }

    function processCellRows(cellRows) {
        cellRows.forEach(cellRow => {
            const nestedDivSpanOne = cellRow.querySelector('div.flex span');
            const nestedDivSpanTwo = cellRow.querySelector('div.flex span:nth-child(3)');
            if (nestedDivSpanOne) {
                const content = nestedDivSpanOne.textContent;
                if (regexPattern.test(content)) {
                    const decimalOdds = parseFloat(content);
                    const americanOdds = convertOdds(decimalOdds);
                    nestedDivSpanOne.textContent = americanOdds;
                }
            }

            if (nestedDivSpanTwo) {
                const content = nestedDivSpanTwo.textContent;
                if (regexPattern.test(content)) {
                    const decimalOdds = parseFloat(content);
                    const americanOdds = convertOdds(decimalOdds);
                    nestedDivSpanTwo.textContent = americanOdds;
                }
            }

            const content = cellRow.textContent;
            if (regexPattern.test(content)) {
                const decimalOdds = parseFloat(content);
                const americanOdds = convertOdds(decimalOdds);
                cellRow.textContent = americanOdds;
            }
        });
    }

    function processTableRows() {
        const tableRows = document.querySelectorAll('table.my-4 tbody tr');
        tableRows.forEach(row => {
            const oddsCell = row.children[1]; // Assuming the odds are in the second cell
            if (oddsCell && regexPattern.test(oddsCell.textContent)) {
                const decimalOdds = parseFloat(oddsCell.textContent);
                const americanOdds = convertOdds(decimalOdds);
                oddsCell.textContent = americanOdds;
            }
        });
    }

    // MutationObserver for dynamic content changes
    const targetSelector = 'div.ag-cell-value';
    const observer = new MutationObserver(mutationsList => {
        const cellRows = document.querySelectorAll(targetSelector);
        if (cellRows.length > 0) {
            processCellRows(cellRows);
        }

        processTableRows();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Copy Text Button functionality
    function copyText(text) {
        const textarea = document.createElement('textarea');
        textarea.textContent = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    const xpaths = {
        "homeTeam": '//*[@id="__next"]/div/main/div[2]/div[3]/div[2]/div[1]/h2[1]',
        "awayTeam": '//*[@id="__next"]/div/main/div[2]/div[3]/div[2]/div[1]/h2[2]',
        "bet": '//*[@id="__next"]/div/main/div[2]/div[3]/div[2]/div[1]/h3',
        "odds": '//*[@id="__next"]/div/main/div[2]/div[3]/div[2]/div[1]/div[2]/table/tbody/tr[1]/td[2]',
        "time": '//*[@id="__next"]/div/main/div[2]/div[3]/div[2]/div[1]/div[2]/table/tbody/tr[1]/td[1]',
        "oddsStatus": '//*[@id="__next"]/div/main/div[2]/div[3]/div[2]/div[1]/div[2]/table/tbody/tr[1]/td[3]',
        "lastLine": '//*[@id="__next"]/div/main/div[2]/div[3]/div[2]/div[1]/div[2]/table/tbody/tr[2]/td[2]',
        "lastLineTime": '//*[@id="__next"]/div/main/div[2]/div[3]/div[2]/div[1]/div[2]/table/tbody/tr[2]/td[1]'
    };

    // New 'Search' button creation and styling
    const searchButton = document.createElement('button');
    searchButton.textContent = 'Search';
    searchButton.style.position = 'fixed';
    searchButton.style.top = '10px';
    searchButton.style.left = '450px'; // Positioning Search button to the left
    searchButton.style.zIndex = '1000';
    searchButton.style.width = '150px'; // Width set to 150px
    searchButton.style.padding = '10px';
    searchButton.style.color = 'orange';
    searchButton.style.border = '1px solid orange';
    searchButton.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    document.body.appendChild(searchButton);

    // Updated 'Copy Bet' button creation and styling
    const copyBetButton = document.createElement('button');
    copyBetButton.textContent = 'Copy Bet';
    copyBetButton.style.position = 'fixed';
    copyBetButton.style.top = '10px';
    copyBetButton.style.left = '630px'; // Positioning Copy Bet button 180px to the right of Search button
    copyBetButton.style.zIndex = '1000';
    copyBetButton.style.width = '150px'; // Width set to 150px
    copyBetButton.style.padding = '10px';
    copyBetButton.style.color = 'lightblue';
    copyBetButton.style.border = '1px solid lightblue';
    copyBetButton.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    document.body.appendChild(copyBetButton);


    // 'Search' button functionality
    searchButton.addEventListener('click', function() {
        // Extract away team string using XPath
        const awayTeamResult = document.evaluate(xpaths["awayTeam"], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        let awayTeamString = awayTeamResult.singleNodeValue ? awayTeamResult.singleNodeValue.textContent.trim() : '';

        // Processing the string
        awayTeamString = awayTeamString.replace(/^A:\s+/, '').replace(/\s+\(Games\)$/, '');

        // Copy processed string to clipboard
        navigator.clipboard.writeText(awayTeamString)
            .then(() => console.log('Copied to clipboard: ' + awayTeamString))
            .catch(err => console.error('Error in copying text: ', err));
    });

    function formatTime(time) {
        let [hours, minutes] = time.split(':').map(n => parseInt(n, 10));
        let amPm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${amPm}`;
    }

    copyBetButton.addEventListener('click', () => {
    let eventData = {};

    for (let key in xpaths) {
        const result = document.evaluate(xpaths[key], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const element = result.singleNodeValue;
        if (element) {
            eventData[key] = element.textContent.trim();
        }
    }

    let eventString = `Event: ${eventData.awayTeam.replace(/^A:\s*/, '')} vs ${eventData.homeTeam.replace(/^H:\s*/, '')}\n`;
    eventString += `Bet: ${eventData.bet}\n`;

    if (eventData.oddsStatus === '0') { // Assuming '0' indicates a locked line
        eventString += `${formatTime(eventData.time)} Current Pinny Odds: LOCKED\n`;
        eventString += `(Last Line Time) "Last Line: "${eventData.lastLine}`;
    } else {
        eventString += `${formatTime(eventData.time)} Current Pinny Odds: ${eventData.odds}`;
    }

    copyText(eventString);
});

    document.body.appendChild(copyBetButton);
})();