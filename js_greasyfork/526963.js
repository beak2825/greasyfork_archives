// ==UserScript==
// @name         Cybroria Loot Log Tracker
// @namespace    https://cybroria.com
// @version      1.8
// @description  Tracks credits, farmed drops, and stat value drops using the loot log on Cybroria. Tracks each drop only once, supports commas in numbers, and maintains a fixed container width with drag-and-drop functionality. Reset button always visible.
// @author       Astralis
// @match        https://cybroria.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526963/Cybroria%20Loot%20Log%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/526963/Cybroria%20Loot%20Log%20Tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Initialize data structure
    const defaultData = {
        credits: 0,
        farmedDrops: { PowerCells: 0, Data: 0, Drugs: 0, CyberImplants: 0 },
        statDrops: {}, // Tracks different stat values and their quantities
        processedDrops: [], // Array of processed entries
    };

    // Load saved data from localStorage or initialize with default
    let trackerData = JSON.parse(localStorage.getItem('cybroriaLootTrackerData')) || defaultData;

    // Ensure all properties exist in case the saved data is incomplete
    trackerData = { ...defaultData, ...trackerData, processedDrops: trackerData.processedDrops || [] };

    // Function to save data to localStorage
    const saveData = () => {
        localStorage.setItem('cybroriaLootTrackerData', JSON.stringify(trackerData));
    };

    // Function to reset data
    const resetData = () => {
        trackerData = { ...defaultData };
        saveData();
        alert('Tracker data has been reset!');
        location.reload();
    };

    // Function to parse numbers with commas
    const parseNumber = (numStr) => parseInt(numStr.replace(/,/g, ''), 10);

    // Create a UI for displaying and resetting stats
    const createTrackerUI = () => {
        const trackerDiv = document.createElement('div');
        trackerDiv.style.position = 'fixed';
        trackerDiv.style.top = '10px';
        trackerDiv.style.right = '10px';
        trackerDiv.style.width = '300px'; // Fixed width
        trackerDiv.style.background = 'rgba(0,0,0,0.8)';
        trackerDiv.style.color = '#fff';
        trackerDiv.style.padding = '10px';
        trackerDiv.style.border = '1px solid #fff';
        trackerDiv.style.zIndex = '9999';
        trackerDiv.style.fontSize = '12px';

        // Draggable header
        const header = document.createElement('div');
        header.style.background = 'rgba(255, 255, 255, 0.2)';
        header.style.padding = '5px';
        header.style.cursor = 'move';
        header.style.fontWeight = 'bold';
        header.textContent = 'Cybroria Loot Tracker';
        trackerDiv.appendChild(header);

        // Reset button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Tracker';
        resetButton.style.display = 'block';
        resetButton.style.margin = '10px 0';
        resetButton.style.padding = '5px';
        resetButton.style.background = '#d9534f';
        resetButton.style.color = '#fff';
        resetButton.style.border = 'none';
        resetButton.style.cursor = 'pointer';
        resetButton.style.width = '100%';
        resetButton.addEventListener('click', resetData);
        trackerDiv.appendChild(resetButton);

        // Content container
        const contentDiv = document.createElement('div');
        contentDiv.id = 'trackerContent';
        trackerDiv.appendChild(contentDiv);

        document.body.appendChild(trackerDiv);

        // Make the tracker draggable
        makeDraggable(trackerDiv, header);

        updateTrackerUI(); // Initial render
    };

    // Function to update the UI dynamically
    const updateTrackerUI = () => {
        const contentDiv = document.getElementById('trackerContent');
        if (!contentDiv) return;

        let farmedDropsHTML = Object.entries(trackerData.farmedDrops)
            .map(([type, count]) => `<li>${type}: ${count}</li>`)
            .join('');

        let statDropsHTML = Object.entries(trackerData.statDrops)
            .map(([type, count]) => `<li>${type}: ${count}</li>`)
            .join('');

        contentDiv.innerHTML = `
            <p>Credits: ${trackerData.credits}</p>
            <h5>Farmed Drops:</h5>
            <ul>${farmedDropsHTML || '<li>None</li>'}</ul>
            <h5>Stat Value Drops:</h5>
            <ul>${statDropsHTML || '<li>None</li>'}</ul>
        `;
    };

    // Function to make an element draggable
    const makeDraggable = (element, handle) => {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            element.style.userSelect = 'none'; // Disable text selection while dragging
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    };

    // Function to extract loot log details
    const extractLootLogs = () => {
        const lootLog = document.querySelector('app-loot-log');
        if (!lootLog) return;

        const logEntries = lootLog.querySelectorAll('span');
        logEntries.forEach((entry) => {
            const text = entry.textContent.trim();

            // Skip already processed entries
            if (trackerData.processedDrops.includes(text)) return;

            // Mark this entry as processed
            trackerData.processedDrops.push(text);

            // Track credits
            if (text.includes('Credits')) {
                const creditsMatch = text.match(/([\d,]+) Credits/);
                if (creditsMatch) {
                    trackerData.credits += parseNumber(creditsMatch[1]);
                }
            }

            // Track farmed drops
            if (text.includes('Power Cells')) {
                const match = text.match(/([\d,]+) Power Cells/);
                if (match) {
                    trackerData.farmedDrops.PowerCells += parseNumber(match[1]);
                }
            } else if (text.includes('Data')) {
                const match = text.match(/([\d,]+) Data/);
                if (match) {
                    trackerData.farmedDrops.Data += parseNumber(match[1]);
                }
            } else if (text.includes('Drugs')) {
                const match = text.match(/([\d,]+) Drugs/);
                if (match) {
                    trackerData.farmedDrops.Drugs += parseNumber(match[1]);
                }
            } else if (text.includes('Cyber Implants')) {
                const match = text.match(/([\d,]+) Cyber Implants/);
                if (match) {
                    trackerData.farmedDrops.CyberImplants += parseNumber(match[1]);
                }
            }

            // Track stat value drops
            if (text.includes('Stat Value')) {
                const statMatch = text.match(/([\d,]+) (\w+) Stat Value/);
                if (statMatch) {
                    const statType = statMatch[2];
                    trackerData.statDrops[statType] = (trackerData.statDrops[statType] || 0) + parseNumber(statMatch[1]);
                }
            }
        });

        // Save updated data
        saveData();

        // Update UI
        updateTrackerUI();
    };

    // Run functions
    createTrackerUI();
    extractLootLogs();

    // Periodically check for updates in the loot log
    setInterval(() => {
        try {
            extractLootLogs();
        } catch (error) {
            console.error('Error in loot log extraction:', error);
        }
    }, 2000); // Adjust the interval as needed
})();
