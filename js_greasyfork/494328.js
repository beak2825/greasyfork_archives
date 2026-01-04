// ==UserScript==
// @name         Add Contest History Link
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add Contest History Link to pages under leetcode.com
// @author       V3L0CITY
// @match        *://leetcode.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494328/Add%20Contest%20History%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/494328/Add%20Contest%20History%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add Contest History Link
    function addContestHistoryLink() {
        // Find all <a> elements on the page
        const allLinks = document.getElementsByTagName('a');

        for (let i = 0; i < allLinks.length; i++) {
            const link = allLinks[i];

            // Check if the text content of the <a> element is "Explore"
            if (link.textContent.trim() === "Contest History") {
                return;
            }
        }
        // Loop through all <a> elements
        for (let i = 0; i < allLinks.length; i++) {
            const link = allLinks[i];

            // Check if the text content of the <a> element is "Explore"
            if (link.textContent.trim() === "Explore") {
                // Find the second parent (grandparent) of the <a> element
                const bigGuy = link.parentElement.parentElement;

                if (bigGuy) {
                    // Create a new list item element
                    const listItem = document.createElement('li');
                    listItem.className = 'relative flex h-full items-center text-sm';

                    // Create a new <a> element for Contest History
                    const contestHistoryLink = document.createElement('a');
                    contestHistoryLink.className = 'relative whitespace-nowrap hover:text-text-primary dark:hover:text-text-primary flex items-center text-base leading-[22px] cursor-pointer hover:text-text-primary dark:hover:text-text-primary text-text-secondary dark:text-text-secondary';
                    contestHistoryLink.textContent = 'Contest History';

                    // Add an event listener to the Contest History link
                    contestHistoryLink.addEventListener('click', function() {
                        // Execute your script here
                        // Replace the following line with your script
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
                                '\n    query userContestRankingInfo($username: String!) {\n  userContestRankingHistory(username: $username) {\n    attended\n    trendDirection\n    problemsSolved\n    totalProblems\n    finishTimeInSeconds\n    rating\n    ranking\n    contest {\n      title\n      startTime\n    }\n  }\n}\n    ',
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
                                var newInitialLoadingDiv = document.createElement('div');
                                newInitialLoadingDiv.id = 'initial-loading';

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
                                newInitialLoadingDiv.appendChild(spinnerDiv);

                                // Append initial loading div to the document body
                                document.body.appendChild(newInitialLoadingDiv);
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
                                var participatedContestData = contestdata.filter((entry) => entry.attended == true && entry.ranking != 0)

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
                    });

                    // Append the Contest History link to the list item
                    listItem.appendChild(contestHistoryLink);

                    // Append the list item to the big guy
                    bigGuy.appendChild(listItem);

                    // Break the loop since we found the first <a> element with the text "Explore"
                    break;
                }
            }
        }
    }

    // Call the function initially
    addContestHistoryLink();

    // Create a MutationObserver instance
    const observer = new MutationObserver(addContestHistoryLink);

    // Observe changes to the document body
    observer.observe(document.body, { childList: true, subtree: true });
})();
