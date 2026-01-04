// ==UserScript==
// @name         FMP Nation Player Data Downloader
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Allows users to download player data on Football Manager Project (FMP).
// @author       Base version by Rocky
// @match        https://footballmanagerproject.com/NationalTeam/NtPlayers?id=*
// @match        https://footballmanagerproject.com/NationalTeam/NtPlayers
// @match        https://www.footballmanagerproject.com/NationalTeam/NtPlayers?id=*
// @match        https://www.footballmanagerproject.com/NationalTeam/NtPlayers
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529209/FMP%20Nation%20Player%20Data%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/529209/FMP%20Nation%20Player%20Data%20Downloader.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // Main entrypoint ----------------------------------------------------------------------------------------

    createAndAppendDownloadButton();
})();

// UI Functionality ---------------------------------------------------------------------------------------

function createAndAppendDownloadButton() {
    const ul = getUl();
    if (!ul) return;

    const li = createDownloadLi();
    ul.appendChild(li);
}

function getUl() {
    const ul = document.getElementById('head_info');
    if (!ul) {
        console.error('UL with id "head_info" not found');
    }
    return ul;
}

function createDownloadLi() {
    const li = document.createElement('div');

    const button = document.createElement('button');
    button.innerText = 'Download';
    button.classList.add('nav-link');
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';

    button.addEventListener('click', downloadPlayersData);

    li.appendChild(button);
    return li;
}

// Download Functionality ---------------------------------------------------------------------------------

// const fileType = "JSON";  // comment the next line and uncomment this line to generate a JSON file
const fileType = "CSV";

function downloadPlayersData() {
    if (fileType !== "JSON" && fileType !== "CSV") {
        console.error("Invalid fileType. Please use 'JSON' or 'CSV'.");
        return;
    }

    const fileName = buildFileName();
    const goalkeepers = team.gkList;
    const outfielders = team.plList;

    if (fileType === "JSON") {
        downloadFile(serializePlayersToJSON(goalkeepers,outfielders), "application/json", `${fileName}_players.json`);
    }

    if (fileType === "CSV") {
        if (hasItems(outfielders)) {
            downloadFile(serializePlayersToCSV(outfielders), "text/csv", `${fileName}_outfielders.csv`);
        }
        if (hasItems(goalkeepers)) {
            downloadFile(serializePlayersToCSV(goalkeepers), "text/csv", `${fileName}_goalkeepers.csv`);
        }
    }
}

function buildFileName() {
    const teamName = document.getElementById('head_teamname').textContent;
    const season = document.getElementById('season-num').textContent;
    const week = document.getElementById('week-num').textContent;
    return `${teamName}_${season}_${week}`;
}

function serializePlayersToJSON(gkList,plList) {
    const combinedList = gkList.concat(plList);
    return JSON.stringify(combinedList, null, 2);
}

function serializePlayersToCSV(players) {
    const flattenedData = Object.entries(players).map(([playerID, playerData]) => {
        const flatPlayerData = flattenObject(playerData);
        return { ...flatPlayerData };
    });

    const sanitizedData = flattenedData.map(row => {
        const newRow = {};
        for (let key in row) {
            if (!isBlacklistedKey(key)) {
                newRow[key] = row[key];
            }
        }
        return newRow;
    });

    const headers = [...Object.keys(sanitizedData[0])];

    const csvRows = [
        headers.join(','),
        ...sanitizedData.map(row => headers.map(header => row[header] ?? '').join(','))
    ];

    return csvRows.join('\n');
}

// Utility Functions --------------------------------------------------------------------------------------

/**
 * Checks if the given object has any enumerable properties.
 *
 * @param {Object} obj - The object to check.
 * @returns {boolean} True if the object has one or more properties, false otherwise.
 */
function hasItems(obj) {
    return Object.keys(obj).length > 0;
}

/**
 * Recursively flattens a nested object into a single level object.
 * The keys of the resulting object are created by joining nested keys with an underscore.
 *
 * @param {Object} obj - The object to be flattened.
 * @param {string} [parentKey=''] - The parent key, used during recursion to build nested keys (optional).
 * @param {Object} [res={}] - The result object that accumulates the flattened properties (optional).
 * @returns {Object} A new object where all nested keys have been flattened to a single level.
 *
 * Example:
 * Input: { a: { b: { c: 1 } } }
 * Output: { 'a_b_c': 1 }
*/
function flattenObject(obj, parentKey = '', res = {}) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const propName = key;
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                flattenObject(obj[key], propName, res);
            } else {
                res[propName] = obj[key];
            }
        }
    }
    return res;
}

/**
 * Checks if the given key is in the list of blacklisted CSV headers.
 *
 * @param {string} key - The key to check.
 * @returns {boolean} `true` if the key contains a blacklisted header; otherwise, `false`.
 *
 * Example:
 * Input: 'note_description'
 * Output: true
 *
 * Input: 'comment'
 * Output: false
 */
function isBlacklistedKey(key) {
    const blacklistedCsvHeaders = [
        "acad",
        "colors",
        "lastTmChng",
        "note",
        "skin",
        "nationCode",
        "banned",
        "injuried",
        "infoTransfer",
        "retired",
        "skills"
    ];
    return blacklistedCsvHeaders.some(blacklisted => key.includes(blacklisted));
}

/**
 * Checks if the given key is in the list of blacklisted CSV headers.
 *
 * @param {string} key - The key to check.
 * @returns {boolean} `true` if the key contains a blacklisted header; otherwise, `false`.
 *
 * Example:
 * Input: 'note_description'
 * Output: true
 *
 * Input: 'comment'
 * Output: false
 */
function isBlacklistedKey(key) {
    const blacklistedCsvHeaders = [
        "acad",
        "colors",
        "lastTmChng",
        "note",
        "skin",
        "teamID",
        "nationCode",
        "banned",
        "injuried",
        "infoTransfer",
        "retired",
        "skills"
    ];
    return blacklistedCsvHeaders.some(blacklisted => key.includes(blacklisted));
}

/**
 * Creates and downloads a file in the browser.
 *
 * This function generates a file from the provided data and triggers a download with the specified file name and MIME type.
 *
 * @param {string|ArrayBuffer|Blob} data - The content to be included in the file. Can be a string, an ArrayBuffer, or a Blob.
 * @param {string} mimeType - The MIME type of the file, e.g., 'text/plain', 'application/pdf'.
 * @param {string} fileName - The name to give the downloaded file, including the file extension.
 *
 * Example:
 * Input: 'Hello, world!', 'text/plain', 'example.txt'
 * Output: Downloads a text file named 'example.txt' with the content 'Hello, world!'
 *
 * Example:
 * Input: pdfData, 'application/pdf', 'document.pdf'
 * Output: Downloads a PDF file named 'document.pdf' with the content from the pdfData variable.
 */
function downloadFile(data, mimeType, fileName) {
    const blob = new Blob([data], { type: mimeType });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}