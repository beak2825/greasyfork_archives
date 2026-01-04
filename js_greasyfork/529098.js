// ==UserScript==
// @name         FMP Player Data Downloader-FIX
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Allows users to download player data on Football Manager Project (FMP).
// @author       Rocky
// @match        https://footballmanagerproject.com/Team/Players?id=*
// @match        https://footballmanagerproject.com/Team/Players
// @match        https://www.footballmanagerproject.com/Team/Players?id=*
// @match        https://www.footballmanagerproject.com/Team/Players
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529098/FMP%20Player%20Data%20Downloader-FIX.user.js
// @updateURL https://update.greasyfork.org/scripts/529098/FMP%20Player%20Data%20Downloader-FIX.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Main entrypoint ----------------------------------------------------------------------------------------

  window.customCode = function () {
   if (!window.players || !hasItems(window.players)) {
      console.error('Players data not found. Early exit.');
      return;
}
   createAndAppendDownloadButton();
  };

  // UI Functionality ---------------------------------------------------------------------------------------

function createAndAppendDownloadButton() {
  const ul = getProdTabsUl();
  if (!ul) return;

  const li = createDownloadLi();
  ul.appendChild(li);
}

function getProdTabsUl() {
  const ul = document.getElementById('prodTabs');
  if (!ul) {
    console.error('UL with id "prodTabs" not found');
  }
  return ul;
}

function createDownloadLi() {
  const li = document.createElement('li');
  li.classList.add('nav-item');

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

  const teamId = Object.keys(teams);
  for (let ID in teams){
        const fileName = buildFileName(teams[ID]);
        const goalkeepers = teams[ID].gkList;
        const outfielders = teams[ID].plList;

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
}

function buildFileName(team) {
  const teamName = team.name;
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
    "teamID",
    "teamName",
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

})();