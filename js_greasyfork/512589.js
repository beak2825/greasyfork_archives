// ==UserScript==
// @name         Fetch Data on economy Indonesia
// @namespace    http://tampermonkey.net/
// @version      2024-10-14
// @description  try to fetch data from server and export to csv and txt
// @author       You
// @match        https://www.erepublik.com/en/country/economy/Indonesia
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erepublik.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512589/Fetch%20Data%20on%20economy%20Indonesia.user.js
// @updateURL https://update.greasyfork.org/scripts/512589/Fetch%20Data%20on%20economy%20Indonesia.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function main() {
    const idsToProcess = [9572744, 1270713, 1302356, 1193912, 8932610, 8481051, 9560528, 4668724, 9692275, 658472, 1734112, 6354964, 6345315, 5811374, 9437944, 3470197, 2093474, 2784602, 426292];
    let results = [];

    // Loop through each ID and fetch the data with a 3-second delay between requests
    for (const id of idsToProcess) {
        const url = `https://www.erepublik.com/en/main/citizen-profile-json-personal/${id}`;
        const data = await fetchData(url);

        // Capture the timestamp of when the data was fetched
        const fetchTimestamp = new Date();
        const localTime = formatDate(fetchTimestamp);

        // Extract relevant data
        if (data) {
            const extractedData = {
                id: data.citizen.id,
                name: data.citizen.name,
                avatar: data.citizen.avatar,
                level: data.citizen.level,
		muRank: data.military.militaryUnit.militaryRank,
                mu: data.military.militaryUnit.name,
                muCountry: data.military.militaryUnit.country_id,
                groundRank: data.military.militaryData.name,
                aircraftRank: data.military.militaryData.aircraft.name,
                truePatriot: formatCurrency(data.military.truePatriot.damage), // Formatting True Patriot Damage
                tpCZ: data.military.truePatriot.citizenship_id,
                tpCurrent: data.military.truePatriot.currentLevel,
                tpNext: data.military.truePatriot.nextLevel,
                fetchTime: localTime // Add the formatted timestamp
            };

            results.push(extractedData);
        }

        // Add a 3-second delay before proceeding to the next ID
        await delay(3000);
    }

    // Convert the results to CSV and TXT formats
    const csvContent = generateCSV(results);
    const txtContent = generateTXT(results);

    // Trigger the downloads
    downloadCSV(csvContent, 'citizen_data.csv');
    downloadTXT(txtContent, 'citizen_data.txt');
}

// Fetch function to get the data from the API
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Failed to fetch data from ${url}: ${error.message}`);
        return null; // Return null so the loop can continue even if a request fails
    }
}

// Delay function to pause execution for a given number of milliseconds
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to format date to dd/mm/yyyy hh:mm:ss
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

// Function to format numbers with dot separator (Indonesian currency format)
function formatCurrency(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Function to generate CSV content from the data array
function generateCSV(dataArray) {
    const headers = [
        'ID', 'Name', 'Avatar', 'Level', 'MU Rank', 'MU', 'MU Country', 'Ground Rank', 'Aircraft Rank', 'True Patriot Damage', 'TP Citizenship', 'TP Current Level', 'TP Next Level', 'Fetch Timestamp'
    ];

    const rows = dataArray.map(item => [
        item.id,
        item.name,
        item.avatar,
        item.level,
	item.muRank,
        item.mu,
        item.muCountry,
        item.groundRank,
        item.aircraftRank,
        item.truePatriot,
        item.tpCZ,
        item.tpCurrent,
        item.tpNext,
        item.fetchTime
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.join(',') + '\n';
    });

    return csv;
}

// Function to generate TXT content from the data array
function generateTXT(dataArray) {
    return dataArray.map(item => {
        return `[BERHASIL DITAMBAHKAN]\n\nID : ${item.id}\nName: ${item.name}\nLevel: ${item.level}\nMU: ${item.muRank} of ${item.mu}\nGround Rank: ${item.groundRank}\nAircraft Rank: ${item.aircraftRank}\nTrue Patriot Damage: ${item.truePatriot}\nFetch Timestamp: ${item.fetchTime}\n`;
    }).join('\n');
}

// Function to trigger the download of a CSV file
function downloadCSV(csvContent, fileName) {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to trigger the download of a TXT file
function downloadTXT(txtContent, fileName) {
    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Run the main function
main();
})();