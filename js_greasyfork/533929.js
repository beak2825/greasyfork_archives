// ==UserScript==
// @name         CGN Airport Busiest Flight Window Analyzer
// @namespace    shiftgeist
// @match        https://www.koeln-bonn-airport.de/fluggaeste/fluege/abflug-ankunft.html
// @version      20250430
// @author       shiftgeist
// @description  Analyzes flight data from Cologne Bonn Airport (CGN) to find the busiest time windows for plane spotting, based on user-specified date and time range and maximum window duration.
// @license      GNU GPLv3
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.koeln-bonn-airport.de
// @downloadURL https://update.greasyfork.org/scripts/533929/CGN%20Airport%20Busiest%20Flight%20Window%20Analyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/533929/CGN%20Airport%20Busiest%20Flight%20Window%20Analyzer.meta.js
// ==/UserScript==

const debug = window.localStorage.getItem('debug-log') === 'true';
const doc = document;
const elAttach = '#main-content-container';

let statsDisplay = null;
let timeoutCounter = 0;

const jsonEndpointUrl = 'https://www.koeln-bonn-airport.de/fluggaeste/fluege/abflug-ankunft/fsjson';

function log(...params) {
    if (debug) {
        console.debug('[Traffic]', ...params);
    }
}

function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    const hourStr = String(hours).padStart(2, '0');
    const minuteStr = String(minutes).padStart(2, '0');
    return `${hourStr}:${minuteStr}`;
}

function findBusiestWindowInRange(flightTimes, maxDurationMinutes) {
    if (!flightTimes || flightTimes.length < 2) {
        return null;
    }

    const flightMinutes = flightTimes.map(timeToMinutes).sort((a, b) => a - b);

    let bestWindow = {
        startTime: -1,
        endTime: -1,
        count: 0,
        duration: Infinity
    };

    for (let i = 0; i < flightMinutes.length; i++) {
        const currentStartTime = flightMinutes[i];

        for (let j = i + 1; j < flightMinutes.length; j++) {
            const currentEndTime = flightMinutes[j];
            const currentDuration = currentEndTime - currentStartTime;

            if (currentDuration <= maxDurationMinutes) {
                const currentCount = j - i + 1;

                if (currentCount > bestWindow.count) {
                    bestWindow.count = currentCount;
                    bestWindow.duration = currentDuration;
                    bestWindow.startTime = currentStartTime;
                    bestWindow.endTime = currentEndTime;
                } else if (currentCount === bestWindow.count) {
                    if (currentDuration < bestWindow.duration) {
                        bestWindow.duration = currentDuration;
                        bestWindow.startTime = currentStartTime;
                        bestWindow.endTime = currentEndTime;
                    }
                }
            }
             if (currentDuration > maxDurationMinutes) {
                 break;
             }
        }
    }

    if (bestWindow.count > 0) {
        return {
            window: `${minutesToTime(bestWindow.startTime)} - ${minutesToTime(bestWindow.endTime)}`,
            count: bestWindow.count,
            durationMinutes: bestWindow.duration
        };
    } else {
        return null;
    }
}

function findFlightWindows(flightTimes, maxDurationMinutes) {
    return findBusiestWindowInRange(flightTimes, maxDurationMinutes);
}

function getCurrentDateFormatted() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}.${month}.${year}`;
}

function getCurrentDateInputFormatted() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


function getCurrentTimeFormatted() {
     const now = new Date();
     const hours = String(now.getHours()).padStart(2, '0');
     const minutes = String(now.getMinutes()).padStart(2, '0');
     return `${hours}:${minutes}`;
}

function buildJsonPostData(startDate, startTime, endDate, endTime) {
    const startDateTime = new Date(`${startDate.split('.').reverse().join('-')}T${startTime}:00`);
    const endDateTime = new Date(`${endDate.split('.').reverse().join('-')}T${endTime}:00`);

    const startTimestamp = Math.floor(startDateTime.getTime() / 1000);
    const endTimestamp = Math.floor(endDateTime.getTime() / 1000);

    return `mode=A&mode=D&more=&flightsperpage=500&tolerance=&page=0&dtpSTARTDATE=${startDate}+${startTime}&START=${startTimestamp}&END=${endTimestamp}&destination=&datehelper=${startDate}+${startTime}&date=${startDate}+${startTime}`;
}

async function fetchFlightData(postData, callback) {
    log('Fetching flight data from JSON endpoint with data:', postData);

    const statsOutputDiv = doc.getElementById('stats-output');
    if (statsOutputDiv) {
        statsOutputDiv.innerHTML = 'Fetching flight data...';
        statsDisplay.style.display = 'flex';
    }

    try {
        const response = await fetch(jsonEndpointUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: postData
        });

        if (!response.ok) {
            log(`HTTP error! status: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse = await response.json();
        log('JSON response received:', jsonResponse);

        const flightTimes = [];
        if (jsonResponse && Array.isArray(jsonResponse.flights)) {
            jsonResponse.flights.forEach(flight => {
                const time = (flight.expected && flight.expected !== flight.time) ? flight.expected : flight.time;
                if (time) {
                     flightTimes.push(time.trim());
                }
            });
        }

        log('Extracted flight times:', flightTimes);
        callback(flightTimes);

    } catch (e) {
        log('Error fetching or processing JSON data:', e);
        const statsOutputDiv = doc.getElementById('stats-output');
        if (statsOutputDiv) {
             statsOutputDiv.innerHTML = `Error: ${e.message || 'Could not fetch flight data.'}`;
             statsDisplay.style.display = 'flex';
        }
    }
}

function createStats() {
    const container = doc.querySelector(elAttach);

    if (!container) {
        log('Attachment container not found:', elAttach);
        return;
    }

    if (!statsDisplay) {
        statsDisplay = doc.createElement('div');
        statsDisplay.id = 'plane-spotting-stats';
        statsDisplay.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 10000;
            font-family: sans-serif;
            font-size: 14px;
            min-width: 300px;
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;
        doc.body.appendChild(statsDisplay);

        const currentDateFormatted = getCurrentDateFormatted();
        const currentDateInputFormatted = getCurrentDateInputFormatted();
        const currentTime = getCurrentTimeFormatted();
        const endOfDayTime = '23:59';
        const defaultMaxDuration = 180; // Default max duration in minutes (3 hours)

        statsDisplay.innerHTML = `
            <div>
                <strong>Time Range:</strong>
            </div>
            <div style="display: flex; gap: 5px;">
                <label for="earliest-date">From:</label>
                <input type="date" id="earliest-date" value="${currentDateInputFormatted}">
                <input type="time" id="earliest-time" value="${currentTime}">
            </div>
            <div style="display: flex; gap: 5px;">
                 <label for="latest-date">To:</label>
                 <input type="date" id="latest-date" value="${currentDateInputFormatted}">
                 <input type="time" id="latest-time" value="${endOfDayTime}">
            </div>
             <div>
                <label for="max-duration">Max Window Duration (mins):</label>
                <input type="number" id="max-duration" value="${defaultMaxDuration}" min="1">
            </div>
            <button id="fetch-flights-button">Analyze Flights</button>
            <div id="stats-output"></div> `;

        doc.getElementById('fetch-flights-button').addEventListener('click', () => {
            const earliestDate = doc.getElementById('earliest-date').value;
            const earliestTime = doc.getElementById('earliest-time').value;
            const latestDate = doc.getElementById('latest-date').value;
            const latestTime = doc.getElementById('latest-time').value;
            const maxDuration = parseInt(doc.getElementById('max-duration').value, 10);


            if (earliestDate && earliestTime && latestDate && latestTime && !isNaN(maxDuration) && maxDuration > 0) {
                const startDateFormatted = earliestDate.split('-').reverse().join('.');
                const endDateFormatted = latestDate.split('-').reverse().join('.');

                const postData = buildJsonPostData(startDateFormatted, earliestTime, endDateFormatted, latestTime);
                fetchFlightData(postData, (flightTimes) => {
                    const busiestWindow = findFlightWindows(flightTimes, maxDuration);
                    log('Busiest window data:', busiestWindow);
                    updateStatsDisplay(busiestWindow);
                });
            } else {
                updateStatsDisplay(null);
            }
        });

         const initialPostData = buildJsonPostData(currentDateFormatted, currentTime, currentDateFormatted, endOfDayTime);
         fetchFlightData(initialPostData, (flightTimes) => {
            const busiestWindow = findFlightWindows(flightTimes, defaultMaxDuration);
            log('Initial busiest window data:', busiestWindow);
            updateStatsDisplay(busiestWindow);
         });

    } else {
         log('Stats display already exists, triggering data fetch based on current inputs.');
         const earliestDate = doc.getElementById('earliest-date').value;
         const earliestTime = doc.getElementById('earliest-time').value;
         const latestDate = doc.getElementById('latest-date').value;
         const latestTime = doc.getElementById('latest-time').value;
         const maxDuration = parseInt(doc.getElementById('max-duration').value, 10);


         if (earliestDate && earliestTime && latestDate && latestTime && !isNaN(maxDuration) && maxDuration > 0) {
             const startDateFormatted = earliestDate.split('-').reverse().join('.');
             const endDateFormatted = latestDate.split('-').reverse().join('.');

             const postData = buildJsonPostData(startDateFormatted, earliestTime, endDateFormatted, latestTime);
             fetchFlightData(postData, (flightTimes) => {
                 const busiestWindow = findFlightWindows(flightTimes, maxDuration);
                 log('Busiest window data (update):', busiestWindow);
                 updateStatsDisplay(busiestWindow);
             });
         } else {
             updateStatsDisplay(null);
         }
    }
}

function updateStatsDisplay(busiestWindow) {
    const statsOutputDiv = doc.getElementById('stats-output');
     if (statsOutputDiv) {
         if (busiestWindow) {
            statsOutputDiv.innerHTML = `
                <strong>Busiest Window:</strong> ${busiestWindow.window}<br>
                <strong>Flights:</strong> ${busiestWindow.count}<br>
                <strong>Duration:</strong> ${busiestWindow.durationMinutes} mins
            `;
         } else {
            statsOutputDiv.innerHTML = 'No suitable busy window found in the specified range.';
         }
         statsDisplay.style.display = 'flex';
     }
}

function waitForAttachElement(callback) {
    log('Waiting for attachment element...');
    const container = doc.querySelector(elAttach);

    if (container) {
        log('Attachment element found.');
        callback();
    } else {
        timeoutCounter += 1;
        const delay = 20 * (timeoutCounter / 2 + 1);
        log(`Attachment element not found, retrying in ${delay}ms. Attempt ${timeoutCounter}`);
        if (timeoutCounter < 50) {
             setTimeout(() => waitForAttachElement(callback), delay);
        } else {
             log('Max waitForAttachElement attempts reached. Could not find necessary elements.');
             if (!statsDisplay) {
                 statsDisplay = doc.createElement('div');
                 statsDisplay.style.cssText = `
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background-color: rgba(255, 99, 71, 0.8);
                    color: white;
                    padding: 10px;
                    border-radius: 5px;
                    z-index: 10000;
                    font-family: sans-serif;
                    font-size: 14px;
                 `;
                 statsDisplay.innerHTML = 'Plane Spotting script could not find the attachment element.';
                 doc.body.appendChild(statsDisplay);
             }
        }
    }
}

waitForAttachElement(createStats);
