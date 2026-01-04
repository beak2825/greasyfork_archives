// ==UserScript==
// @name         EAPI EP Script
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Skript na zdroják EP
// @author       MK
// @match        eapi.enetpulse.com/event/details/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/500285/EAPI%20EP%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/500285/EAPI%20EP%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the URL contains "eapi"
    if (window.location.href.indexOf("eapi") === -1) {
        return;
    }

    // Extract JSON data from the page content
    var preTag = document.querySelector('body > pre');
    if (!preTag) {
        console.error('No <pre> tag found on the page.');
        return;
    }

    var jsonData;
    try {
        jsonData = JSON.parse(preTag.textContent);
    } catch (e) {
        console.error('Failed to parse JSON data:', e);
        return;
    }

    // Function to format the timestamp
    function formatTimestamp(ut) {
        return ut.replace('T', ' ').substring(0, 19);
    }

    // Create a container for the table
    var container = document.createElement('div');
    container.className = 'custom-table-container';

    // Create a table element
    var table = document.createElement('table');
    table.className = 'custom-table';

    // Create the table header
    var header = table.createTHead();
    var headerRow = header.insertRow(0);
    var cell1 = headerRow.insertCell(0);
    var cell2 = headerRow.insertCell(1);
    var cell3 = headerRow.insertCell(2);
    cell1.innerHTML = "<b>Minuta</b>";
    cell2.innerHTML = "<b>Incident</b>";
    cell3.innerHTML = "<b>Čas</b>";

    // Collect and sort the data
    var dataRows = [];
    var events = jsonData.event;
    for (var eventId in events) {
        if (events.hasOwnProperty(eventId)) {
            var eventParticipants = events[eventId].event_participants;
            for (var participantId in eventParticipants) {
                if (eventParticipants.hasOwnProperty(participantId)) {
                    var incidents = eventParticipants[participantId].incident;
                    for (var incidentId in incidents) {
                        if (incidents.hasOwnProperty(incidentId)) {
                            var incident = incidents[incidentId];
                            dataRows.push({
                                elapsed: parseInt(incident.elapsed),
                                incidentCode: incident.incident_code,
                                ut: formatTimestamp(incident.ut)
                            });
                        }
                    }
                    var results = eventParticipants[participantId].result;
                    for (var resultId in results) {
                        if (results.hasOwnProperty(resultId)) {
                            var result = results[resultId];
                            dataRows.push({
                                elapsed: parseInt(result.value),
                                incidentCode: result.result_code,
                                ut: formatTimestamp(result.ut)
                            });
                        }
                    }
                }
            }
        }
    }

    // Sort dataRows by the 'elapsed' field
    dataRows.sort(function(a, b) {
        return a.elapsed - b.elapsed;
    });

    // Fill the table with sorted data
    var body = table.createTBody();
    dataRows.forEach(function(rowData) {
        var row = body.insertRow();
        var elapsedCell = row.insertCell(0);
        var incidentCodeCell = row.insertCell(1);
        var utCell = row.insertCell(2);
        elapsedCell.textContent = rowData.elapsed;
        incidentCodeCell.textContent = rowData.incidentCode;
        utCell.textContent = rowData.ut;
    });

    // Append the table to the container
    container.appendChild(table);

    // Append the container to the body
    document.body.appendChild(container);

    // Add custom styles
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        .custom-table-container {
            position: fixed;
            top: 60px;
            left: 30px;
            width: auto;
            height: calc(100% - 120px);
            border: 3px solid black;
            background-color: white;
            overflow: auto;
            z-index: 999999999;
            text-align: center;
        }
        .custom-table {
            border-collapse: collapse;
        }
        .custom-table td, .custom-table th {
            border: 1px solid black;
            padding: 8px;
        }
    `;
    document.head.appendChild(style);
})();