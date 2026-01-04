// ==UserScript==
// @name         POD Overnight Ball - Enhanced Functionality
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add functionality to POD - Enhanced with Tennis Switch and Copy Bet Button
// @author       You
// @match        https://www.pinnacleoddsdropper.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488951/POD%20Overnight%20Ball%20-%20Enhanced%20Functionality.user.js
// @updateURL https://update.greasyfork.org/scripts/488951/POD%20Overnight%20Ball%20-%20Enhanced%20Functionality.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // XPath dictionary with paths for all elements you'll interact with
    const xpaths = {
        "awayTeam": '//*[@id="__next"]/div[1]/main/div[2]/div[3]/div[2]/div[1]/div[1]/div/h2[2]',
        "homeTeam": '//*[@id="__next"]/div[1]/main/div[2]/div[3]/div[2]/div[1]/div[1]/div/h2[1]',
        "bet": '//*[@id="__next"]/div[1]/main/div[2]/div[3]/div[2]/div[1]/div[1]/div/h3',
        "oddsStatus": '//*[@id="__next"]/div[main]/div[2]/div[3]/div[2]/div[1]/div[2]/table/tbody/tr[1]/td[3]',
        "clickButton": "//*[@id='__next']/div[1]/main/div[2]/div[1]/button[1]",
    };
    
    // Create 'Market Switch' button
    // Create main control buttons with unique styling
    const triggerButton = createControlButton('Market Switch', '10px', '450px', 'orange');
    document.body.appendChild(triggerButton);

    const copyBetButton = createControlButton('Copy Bet', '10px', '630px', 'lightblue');
    document.body.appendChild(copyBetButton);
    // Market Switch button functionality

        function createControlButton(text, top, left, color) {
        let button = document.createElement('button');
        button.textContent = text;
        button.style.position = 'fixed';
        button.style.top = top;
        button.style.left = left;
        button.style.zIndex = '1000';
        button.style.width = '150px';
        button.style.padding = '10px';
        button.style.color = color;
        button.style.border = `1px solid ${color}`;
        button.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        return button;
    }

    triggerButton.addEventListener('click', function() {
    simulateKeyPress('E');

    setTimeout(() => {
        const awayTeamResult = document.evaluate(xpaths["awayTeam"], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        let awayTeamString = awayTeamResult.singleNodeValue ? awayTeamResult.singleNodeValue.textContent.trim() : '';

        // Processing the string to remove specified prefixes/suffixes
        awayTeamString = awayTeamString.replace(/^A:\s+/, '').replace(/\s+\(Games\)$/, '').replace(/\s+\(Corners\)$/, '');

        console.log('Processed Away Team String:', awayTeamString); // Log the processed away team string for verification

        const clickButtonResult = document.evaluate(xpaths["clickButton"], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        if (clickButtonResult.singleNodeValue) {
            clickButtonResult.singleNodeValue.click();
        }

        setTimeout(() => {
            const inputElement = document.querySelector('input[placeholder="Search for an event"]');
            if (inputElement) {
                simulateTyping(inputElement, awayTeamString);
            }
        }, 500);
    }, 100);
});

    // Copy Bet button functionality
    copyBetButton.addEventListener('click', () => {
    let eventData = {};

    // Extract data using XPath for the known elements
    for (let key in xpaths) {
        const result = document.evaluate(xpaths[key], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const element = result.singleNodeValue;
        if (element) {
            eventData[key] = element.textContent.trim();
        }
    }

    // Find the selected row with a cell having col-id="current.nvp"
    const selectedRows = Array.from(document.querySelectorAll('div[role="row"][aria-selected="true"]'));
    const targetRow = selectedRows.find(row => row.querySelector('div[role="gridcell"][col-id="current.nvp"]'));

    if (targetRow) {
        // Extract the odds value
        const oddsCell = targetRow.querySelector('div[role="gridcell"][col-id="current.nvp"]');
        if (oddsCell) {
            eventData.odds = oddsCell.textContent.trim();
        }
    }



        // Process the away team string to remove specified prefixes/suffixes
        eventData.awayTeam = eventData.awayTeam.replace(/^A:\s+/, '');
        eventData.awayTeam = eventData.awayTeam.replace(/^A:\s+/, '');


        let eventString = `${eventData.awayTeam} vs ${eventData.homeTeam}\n`;
        eventString += `${eventData.bet}\n`;

        // Here we exclude the "Current Pinny Odds" part as per your instruction
        if (eventData.oddsStatus === '0') {
            eventString += `Odds Status: LOCKED\n`;
        } else {
            eventString += `FV: ${eventData.odds}\n`; // This line remains as you've only specified to exclude a specific part
        }

        copyText(eventString);
    });

    // Table creation
    const table = document.createElement('table');
    table.style.backgroundColor = 'lightgrey';
    table.style.position = 'fixed';
    table.style.top = '10px';
    table.style.left = '800px'; // Adjust as necessary to position to the right of the 'Copy Bet' button
    table.style.borderRadius = '8px';
    table.style.borderCollapse = 'separate';
    table.style.borderSpacing = '10px';
    document.body.appendChild(table);

    // Table headers
    const headers = ['', 'Game', '', '    '];
    const headerRow = table.insertRow();
    headers.forEach((headerText, index) => {
        const headerCell = headerRow.insertCell();
        headerCell.textContent = headerText;
        headerCell.style.backgroundColor = index === 1 ? 'black' : 'transparent';
        headerCell.style.color = index === 1 ? 'white' : 'black';
        headerCell.style.textAlign = 'center';
    });

    // Add default rows
    for (let i = 0; i < 5; i++) {
        const row = table.insertRow();
        addRowCells(row);
    }

    // Function to add cells to a row
    function addRowCells(row) {
        // Clear column
        const clearCell = row.insertCell();
        const clearButton = createButton('X', 'red', 'white');
        clearCell.appendChild(clearButton);
        clearButton.onclick = () => row.remove();

        // Game column (editable)
        const gameCell = row.insertCell();
        const gameInput = document.createElement('input');
        gameInput.type = 'text';
        gameCell.appendChild(gameInput);

            // Monitor column (Add/Update button)
    const monitorCell = row.insertCell();
    const monitorButton = createButton('Add', 'black', 'lightblue');
    monitorCell.appendChild(monitorButton);
    monitorButton.onclick = () => {
        const awayTeamResult = document.evaluate(xpaths["awayTeam"], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        let awayTeamString = awayTeamResult.singleNodeValue ? awayTeamResult.singleNodeValue.textContent.trim() : '';
        awayTeamString = awayTeamString.replace(/^A:\s+/, '').replace(/\s+\(Games\)$/, '').replace(/\s+\(Corners\)$/, '');

        gameInput.value = awayTeamString; // Directly use awayTeamString
        monitorButton.textContent = 'Update';


    };

       const goToCell = row.insertCell();
    const goToButton = createButton('►', 'green', 'white');
    goToButton.style.width = '50px'; // Larger button
    goToCell.appendChild(goToButton);
    goToButton.onclick = () => {
        simulateKeyPress('E');
       setTimeout(() => {
           const clickButtonResult = document.evaluate(xpaths["clickButton"], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        if (clickButtonResult.singleNodeValue) {
            clickButtonResult.singleNodeValue.click();
        }
       }, 500);

        setTimeout(() => {
           const inputElement = document.querySelector('input[placeholder="Search for an event"]');
        const gameInput = row.cells[1].querySelector('input').value; // Get the game name from the input
        if (inputElement) {
            simulateTyping(inputElement, gameInput)}
        }, 1000);

        const inputElement = document.querySelector('input[placeholder="Search for an event"]');
        const gameInput = row.cells[1].querySelector('input').value; // Get the game name from the input
        if (inputElement) {
            simulateTyping(inputElement, gameInput);

           // After typing the game name, wait 2 seconds and then simulate pressing Enter
            setTimeout(() => {
    const clickTarget = document.querySelector('#kbar-listbox-item-0 > div');
    if (clickTarget) {
        clickTarget.click();
    } else {
        console.log('Search result item not found.');
    }
}, 2000);}}


    };



   // Helper function to create styled buttons
    function createButton(text, bgColor, textColor) {
        let button = document.createElement('button');
        button.textContent = text;
        button.style.backgroundColor = bgColor;
        button.style.color = textColor;
        button.style.borderRadius = '5px';
        button.style.border = 'none';
        button.style.padding = '5px 10px';
        return button;
    }

    // Implement additional functions here (e.g., simulateKeyPress, simulateTyping, copyText)
        // Simulate key press function
function simulateKeyPress(character) {
        let event = new KeyboardEvent('keydown', {'key': character});
        document.dispatchEvent(event);
    }

    function simulateTyping(element, text) {
        element.focus(); // Focus on the element to simulate typing
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        for (let i = 0; i < text.length; i++) {
            nativeInputValueSetter.call(element, text.substr(0, i+1));
            element.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

        // Function to copy text to clipboard
    function copyText(text) {
        const textarea = document.createElement('textarea');
        textarea.textContent = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }


})();