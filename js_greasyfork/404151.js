// ==UserScript==
// @name         Disqualified Status on Flagging Page
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add a column to the flaggings console, with users' disqualified status.
// @author       mako640, poem
// @include      https://data.typeracer.com/pit/admin/flagging*
// @grant        GM_xmlhttpRequest
// @connect      data.typeracer.com
// @downloadURL https://update.greasyfork.org/scripts/404151/Disqualified%20Status%20on%20Flagging%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/404151/Disqualified%20Status%20on%20Flagging%20Page.meta.js
// ==/UserScript==

'use strict';

// Remove left margin for less lateral scrolling
document.getElementsByClassName('themeContent')[0].style.marginLeft = 0;

var users_data = []; // Main function will communicate with those waiting for data from other websites using this array
const newColumnTitle = "disqualified";
const displayNameColTitle = "displayName";
const accountDataUrlBase = "https://data.typeracer.com/users?id=tr:";
const historyUrlBase = 'https://data.typeracer.com/pit/race_history?user=';
let displayNameColIndex = null;


function sleep(x) { // Wait for x ms
  return new Promise(resolve => setTimeout(resolve, x));
}

function getElementFromString(tag, string) {
    let element = document.createElement(tag);
    element.innerHTML = string;
    return element;
}

// given a user's display name, return the username
// example: "mako (mako640)" ==> "mako640"
// if it's a guest account, then return null
// note that on the flaggings page, display names always feature parenthesis around usernames, even with blank first and last names
function getUsernameFromDisplayName(displayName) {
    let usernameRegex = /.*\((.*)\)$/;
    let match = usernameRegex.exec(displayName);
    if (match != null) {
        return match[1];
    }
    return null;
}

// add the "Disqualified" table header
function insertDisqualifiedHeader(headerRow) {
    let afterColumn = headerRow.children[displayNameColIndex + 1];
    let newColumn = getElementFromString("th", newColumnTitle);
    headerRow.insertBefore(newColumn, afterColumn);
}

// insert a true/false disqualification value into a table row
function insertDisqualifiedStatus(resultRow, status) {
    let afterColumn = resultRow.children[displayNameColIndex + 1];
    let newColumn = getElementFromString("td", status);
    resultRow.insertBefore(newColumn, afterColumn);
}

function main() {
    // find the results table
    let resultsTableSelector = "table.cellTable:not(.queryTable)";
    let resultsTableList = document.querySelectorAll(resultsTableSelector);
    if (resultsTableList.length === 0) {
        return;
    }

    // find the "displayName" column
    let resultsTable = resultsTableList.item(0);
    let resultsTableRows = resultsTable.getElementsByTagName("tr");
    let resultsTableHeader = resultsTableRows.item(0);
    let resultsTableHeaderCols = resultsTableHeader.children;
    for (let i = 0; i < resultsTableHeaderCols.length; i++) {
        if (resultsTableHeaderCols.item(i).innerText === displayNameColTitle) {
            displayNameColIndex = i;
            insertDisqualifiedHeader(resultsTableHeader); //add "disqualified" label to the first row
        }
    }
    if (displayNameColIndex == null) {
        return;
    }

    // Get each username and call the function to modify their row
    for (let i = 1; i < resultsTableRows.length; i++) {
        let resultRow = resultsTableRows.item(i);
        let displayName = resultRow.children.item(displayNameColIndex).innerText;
        let username = getUsernameFromDisplayName(displayName);
        modifyResultRow(resultRow, username);
    }
}

// given a row of the table, fetch the user's disqualified status for each universe, format this data, and update the row with the formatted data
// is async
async function modifyResultRow(resultRow, username) {
    // if username is null, the user is a guest, and does not have a readable disqualified status
    if (username == null) {
        insertDisqualifiedStatus(resultRow, "N/A");
        return;
    }

    // the functions below will retrieve the user's active universes from their history page, then check the user's disqualified value for each of these universes using the data.typeracer api.
    // These various requests will be performed asynchronously so, while this function is waiting for all of them to be complete, the users_data array will contain an empty string
    // The 'while' loop below will check this value periodically until it's  replaced by the desired data once the requests are complete
    // I have no idea how to properly handle asynchronous functions. Leave me alone.
    users_data.push('');
    let key=users_data.length-1; // Reference of the variable used to communicate in users_data for this particular user (will be propagated to all functions below)

    getUserUniverseStatuses(username,key); //will eventually replace the users_data[key] variable with the desired data

    while(users_data[key]=='')
    {
        await sleep(10);
    }
    let statuses=users_data[key];

    // format the data
    let dqs = 0;
    let nondqs = 0;
    for(let k=0; k<statuses.length; k++)
    {
        let status=statuses[k];
        if(status)
            dqs++;
        else
            nondqs++;
    }
    let formatted_status = '';
    if(dqs>0)
    {
        if(nondqs>0)
            formatted_status = dqs+' true<br>'+nondqs+' false';
        else
            formatted_status='true';
    }
    else formatted_status='false';

    //insert the formatted data
    insertDisqualifiedStatus(resultRow, formatted_status);
}

// Grabs user history html (contains a list of the user's active universes)
function getUserUniverseStatuses(username, key)
{
    let user_history_url = historyUrlBase+username;
	GM_xmlhttpRequest ( {
		method: 'GET',
		url: user_history_url,
		onload: function (response) {
            return getUniverseStatusesFromHTML(username, response.responseText, key);
		}
	});
}

// Extract the universes list from the user's history page html, then for each of those check their disqualified status
function getUniverseStatusesFromHTML(username, html, key)
{
    let universes = [];
    let options = html.split('select name="universe"');
    if(options.length==1)
        universes = ["play"];
    else
    {
        options = options[1].split('\\select')[0].split('option value="');
        let i=1;
        let option;
        while(option=options[i])
        {
            i++;
            let universe=option.split('"')[0] || 'play';
            universes.push(universe);
        }
        if(html.includes('No results matching the given search criteria.'))
            universes.shift();
    }
    let universes_count = universes.length;
    let statuses = [];
    let i=0;
    let universe;
    while(universe=universes[i])
    {
        i++;
        let accountDataUrl = accountDataUrlBase + username + '&universe='+ universe;
        fetch(accountDataUrl)
        .then(response => {
            if (response.status !== 200) {
                console.log('error accessing universe',universe,'status data for user '+username);
                statuses.push('error');
                return;
            }
            response.json().then(data => {
                let isDisqualified = !!(data.tstats && data.tstats.disqualified);
                statuses.push(isDisqualified);

                if(statuses.length==universes_count) // if the disqualified data has been retrieved for each universe, replace the communication variable with the result
                {
                    users_data[key]=statuses;
                    return;
                }
            });
        })
        .catch(err => {
            console.log('error reading universe',universe,'status data for user '+username);
            statuses.push('error');
        });
    }
}

main();