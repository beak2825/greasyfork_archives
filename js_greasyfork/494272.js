// ==UserScript==
// @name         Leetcode contest table
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  Get a better understanding of how you have performed across different contests, by getting a tabular view
// @author       Prakash
// @match        https://leetcode.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @grant        none
// @license      GNU GPLv3 
// @downloadURL https://update.greasyfork.org/scripts/494272/Leetcode%20contest%20table.user.js
// @updateURL https://update.greasyfork.org/scripts/494272/Leetcode%20contest%20table.meta.js
// ==/UserScript==

async function getUserName() {
    // Query for getting the user name
    const submissionDetailsQuery = {
        query:
        '\n    query globalData {\n  userStatus {\n    username\n  }\n}\n    ',
        operationName: 'globalData',
    };
    const options = {
        method: 'POST',
        headers: {
            cookie: document.cookie, // required to authorize the API request
            'content-type': 'application/json',
        },
        body: JSON.stringify(submissionDetailsQuery),
    };
    const username = await fetch('https://leetcode.com/graphql/', options)
    .then(res => res.json())
    .then(res => res.data.userStatus.username);

    return username;
}

async function getContestInfo(theusername) {
    // Query for getting the contest stats
    const submissionDetailsQuery = {
        query:
        '\n    query userContestRankingInfo($username: String!) {\n  userContestRanking(username: $username) {\n    attendedContestsCount\n    rating\n    globalRanking\n    totalParticipants\n    topPercentage\n    badge {\n      name\n    }\n  }\n  userContestRankingHistory(username: $username) {\n    attended\n    trendDirection\n    problemsSolved\n    totalProblems\n    finishTimeInSeconds\n    rating\n    ranking\n    contest {\n      title\n      startTime\n    }\n  }\n}\n    ',
        variables: { username: theusername },
        operationName: 'userContestRankingInfo',
    };
    const options = {
        method: 'POST',
        headers: {
            cookie: document.cookie, // required to authorize the API request
            'content-type': 'application/json',
        },
        body: JSON.stringify(submissionDetailsQuery),
    };
    const data = await fetch('https://leetcode.com/graphql/', options)
    .then(res => res.json())
    .then(res => res.data.userContestRankingHistory);

    return data
}

// Apply alternating row background colors
function alternatingRowBackground(table) {
    var rows = table.querySelectorAll('tr');
    for (var i = 0; i < rows.length; i++) {
        rows[i].classList.remove('even', 'odd');
        rows[i].classList.add(i % 2 === 0 ? 'even' : 'odd');
    }
}

// Function to create table
function createTable(data) {
    var table = document.createElement('table');
    table.id = 'leetCodeContestTable';
    table.classList.add('styled-table'); // Add a class for styling

    // Create table headers
    var headers = ['StartTime', 'Title', 'Ranking', 'Rating', 'ProblemsSolved', 'FinishTimeInSeconds'];
    var headerRow = document.createElement('tr');
    headerRow.innerHTML += '<th class="hidden">TimeSpan</th>';
    headers.forEach(function(header, index) {
        var th = document.createElement('th');
        th.textContent = header;
        th.dataset.sortable = true;
        th.dataset.columnIndex = index;
        th.addEventListener('click', function() {
            sortTable(table, index);
        });
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Populate table rows
    data.forEach(function(entry, index) {
        var row = document.createElement('tr');
        row.innerHTML += '<td class="hidden">' + entry.contest.startTime + '</td>';
        row.innerHTML += '<td>' + new Date(entry.contest.startTime * 1000).toLocaleString() + '</td>';
        row.innerHTML += '<td>' + entry.contest.title + '</td>';
        row.innerHTML += '<td>' + entry.ranking + '</td>';
        row.innerHTML += '<td>' + entry.rating + '</td>';
        row.innerHTML += '<td>' + entry.problemsSolved + '</td>';
        row.innerHTML += '<td>' + entry.finishTimeInSeconds + '</td>';

        table.appendChild(row);
    });

    alternatingRowBackground(table);

    // Add this table to top of page
    var navbarContainer = document.getElementById('navbar-container');
    navbarContainer.insertAdjacentElement('afterend', table);
}

// Function to sort table
function sortTable(table, columnIndex) {
    var rows = Array.from(table.rows).slice(1); // Exclude header row
    var isAscending = !table.querySelector('th[data-column-index="' + columnIndex + '"]').classList.contains('asc');
    rows.sort(function(row1, row2) {
        var value1 = row1.cells[columnIndex+1].textContent;
        var value2 = row2.cells[columnIndex+1].textContent;
        if (columnIndex === 0) {
            value1 = row1.cells[columnIndex].textContent;
            value2 = row2.cells[columnIndex].textContent;
        } else {
            value1 = parseFloat(value1) || value1;
            value2 = parseFloat(value2) || value2;
        }
        return (isAscending ? 1 : -1) * (value1 > value2 ? 1 : -1);
    });

    // Reorder rows in table
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    rows.forEach(function(row) {
        table.appendChild(row);
    });

    // Remove sorting indicator from all headers
    table.querySelectorAll('th[data-sortable]').forEach(function(header) {
        header.classList.remove('asc', 'desc');
    });

    // Add sorting indicator to the clicked header
    table.querySelector('th[data-column-index="' + columnIndex + '"]').classList.toggle(isAscending ? 'asc' : 'desc', true);
    // Apply alternating background to rows
    alternatingRowBackground(table);
}

// Inject CSS styles into the document head
function addTableCSS(){
    document.head.innerHTML += `
    <style id='leetcodeContestTableStyle'>
      .styled-table {
      border-collapse: collapse;
      width: 100%;
      }

      .styled-table th, .styled-table td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #ddd;
      position: relative;
      }

      .styled-table th::after {
      content: '';
      position: absolute;
      top: 50%;
      right: 8px;
      transform: translateY(-50%);
      font-size: 12px;
      }

      .styled-table th.asc::after {
      content: '↑';
      }

      .styled-table th.desc::after {
      content: '↓';
      }

      .styled-table th {
      background-color: #f2f2f2;
      cursor: pointer;
      }

      .styled-table tr.even {
      background-color: #f9f9f9;
      }

      .styled-table tr.odd {
      background-color: #ffffff;
      }

      .hidden {
      display: none;
      }
    </style>
    `;
  }

function addSpinnerCSS(){
    document.head.innerHTML += `
    <style id="initial-loading-style">
      #initial-loading {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        transition: opacity .6s;
        z-index: 1;
      }

      #initial-loading[data-is-hide="true"] {
        opacity: 0;
        pointer-events: none;
      }

      #initial-loading .spinner {
        display: flex;
      }

      #initial-loading .bounce {
        width: 18px;
        height: 18px;
        margin: 0 3px;
        background-color: #999999;
        border-radius: 100%;
        display: inline-block;
        -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
        animation: sk-bouncedelay 1.4s infinite ease-in-out both;
      }

      #initial-loading .bounce:nth-child(1) {
        -webkit-animation-delay: -0.32s;
        animation-delay: -0.32s;
      }

      #initial-loading .bounce:nth-child(2) {
        -webkit-animation-delay: -0.16s;
        animation-delay: -0.16s;
      }

      @-webkit-keyframes sk-bouncedelay {

        0%,
        80%,
        100% {
          -webkit-transform: scale(0);
          transform: scale(0);
        }

        40% {
          -webkit-transform: scale(1.0);
          transform: scale(1.0);
        }
      }

      @keyframes sk-bouncedelay {

        0%,
        80%,
        100% {
          -webkit-transform: scale(0);
          transform: scale(0);
        }

        40% {
          -webkit-transform: scale(1.0);
          transform: scale(1.0);
        }
      }
    </style>
  `;
  }

function toggleSpinner(startSpinner){
    var initialLoadingDiv = document.getElementById('initial-loading');
    var initialLoadingStyle = document.getElementById('initial-loading-style');

    if (initialLoadingDiv && !startSpinner) {
        initialLoadingDiv.parentNode.removeChild(initialLoadingDiv);
        if (initialLoadingStyle) initialLoadingStyle.parentNode.removeChild(initialLoadingStyle);
    }
    else if(!initialLoadingDiv && startSpinner){
        // Create initial loading div
        var initialLoadingDiv1 = document.createElement('div');
        initialLoadingDiv1.id = 'initial-loading';

        // Create spinner div
        var spinnerDiv = document.createElement('div');
        spinnerDiv.className = 'spinner';

        // Create bounce divs inside spinner div
        for (var i = 0; i < 3; i++) {
            var bounceDiv = document.createElement('div');
            bounceDiv.className = 'bounce';
            spinnerDiv.appendChild(bounceDiv);
        }

        // Append spinner div to initial loading div
        initialLoadingDiv1.appendChild(spinnerDiv);

        // Append initial loading div to the document body
        document.body.appendChild(initialLoadingDiv1);
        addSpinnerCSS();
    }
}

function removeOldTable(){
    var oldTable = document.getElementById("leetCodeContestTable");
    var styleElement = document.getElementById("leetcodeContestTableStyle");
    if (oldTable){
        oldTable.parentNode.removeChild(oldTable);
        if (styleElement) styleElement.parentNode.removeChild(styleElement);
        return true;
    }
    return false;
}

async function execute(){
    // remove existing table if it exists
    if(removeOldTable()) return;

    toggleSpinner(true);
    try {
        // fetch contest details
        var theusername = await getUserName();
        var contestdata = await getContestInfo(theusername);
        var participatedContestData = contestdata.filter((entry) => entry.attended == true && entry.ranking != 0);

        // Create and append table to the document body
        addTableCSS();
        createTable(participatedContestData);
    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        toggleSpinner(false);
    }
}

execute();