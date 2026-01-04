// ==UserScript==
// @name         Daily Grid Closing Times
// @namespace    https://aaiscloud.com/
// @version      2.0.1
// @description  Add closing time to daily grid
// @author       Nischal Tonthanahal
// @match        https://www.aaiscloud.com/*/calendars/dailygridcalendar.aspx
// @match        https://www.aaiscloud.com/*/Calendars/DailyGridCalendar.aspx
// @icon         https://www.aais.com/hubfs/favicon.png
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/461472/Daily%20Grid%20Closing%20Times.user.js
// @updateURL https://update.greasyfork.org/scripts/461472/Daily%20Grid%20Closing%20Times.meta.js
// ==/UserScript==

window.closing_times = {};
window.rooms_closing_at = {};
window.all_rooms_done = false;
window.room_count = 0;
window.viewSwitchObserver = new MutationObserver(removeExistingVerticalLinesIfAny);
window.pageSwitchObserver = new MutationObserver(reload);
window.pageScrollObserver = new MutationObserver(updateClosingTimes);
/**
 * A set of room names that should be ignored and marked as "Not ITS".
 */
window.ignored_room_names = new Set(["GFS LBY", "SGM LBY", "SOS B40", "KAP 160", "KAP 267", "OHE 122", "PED 205", "PED 206"])

/**
 * Updates the closing times for each room on the daily grid.
 * IMPORTANT: This function is called every time the content on the page changes eg: Due to a scroll event
 * 
 * This is necessary since the website always fetches the schedules dynamically from the server as you scroll down the page.
 * The website also destroys every schedule that is not currently in view and has to re-fetch it again every time you scroll up or down.
 * 
 * As a consequence, we cannot extract all the closing times at one go, and this function has to be called every time 
 * the calendar view changes and then extract only the currently visible room schedules.
 * We trigger functions on the changed elements using the MutationObserver() API.
 * 
 * We accumulate the changes into window.closing_times object and then keep track of whether or not we have completed
 * extraction by using the boolean flag window.all_rooms_done, which is set when the length of window.closing_times equals
 * the total number of rooms available on the page as shown by the webpage on the bottom right.
 * 
 * Once we have extracted closing times of all the rooms we need, we display the download CSV button to export it.
 */
function updateClosingTimes() {
    try {
        // Get the time header elements and extract the time information

        // Get all elements having the class sch-simple-timeheader i.e. the ones that say 06:00 AM, 07:00 AM ... 10:00 PM
        let time_header_elements = document.querySelectorAll('.sch-simple-timeheader');
        // Create an array of all these elements so that we can use the map() function to process them
        let time_headers = Array.from(time_header_elements);
        // Process each time header element using the map() function
        let times = time_headers.map(header => {
            // Get the bounding rectangle of the time header element eg: 10:00 AM
            let bound = header.getBoundingClientRect();
            // Find out the end coordinate eg: in the block 10:00 AM this would represent the horizontal line of 11:00 AM
            let end_coordinate = bound.right;
            // Find out the middle coordinate eg: in the block 10:00 AM this would represent the horizontal line of 10:30 AM
            let mid_coordinate = bound.left + (bound.right - bound.left) / 2;
            // Get the text of the element eg: "10:00 AM"
            let time_string = header.innerText;
            // Parse the text using a RegEx to find the Hour, Minute, and whether it is AM or PM
            let time_parsed = time_string.match(/(\d+):(\d+)\s+(AM|PM)/);
            let hour = time_parsed[1]; // eg: "10"
            let minute = time_parsed[2]; // eg: "00"
            let am_pm = time_parsed[3]; // eg: "AM" 
            let time = { hour, minute, am_pm } // eg: {hour:"10", minute:"00", am_pm:"AM"}
            // Store the structured `time` from above in `times` array
            // along with the middle and end coordinates that
            // represent the half-hour and end-of-hour respectively
            return { time, mid_coordinate, end_coordinate }
        })

        // If the day view is selected, draw vertical lines at the closing times
        // This is purely visual to help distinguish the event boundaries and has no other purpose
        if (document.querySelector("#button-1032").classList.contains('x-btn-pressed')) {
            drawVerticalLines(times);
        } else {
            removeExistingVerticalLinesIfAny();
        }

        // Get the room names and update the closing time for each room
        let room_name_elements = document.querySelectorAll('[data-columnid="RoomDayGridId_BuildingRoomNumberRoomName"]')
        let room_names = Array.from(room_name_elements);
        room_names.forEach(room => {
            let index = room.parentElement.parentElement.parentElement.getAttribute('data-recordindex')
            if (room.querySelector(`[data-recordindex="${index}"].closing-tag`) != null) {
                return false;
            }
            let room_name = room.innerText;
            room_name = room_name.replace(/^\s+/, '');
            room_name = room_name.replace(/\s+$/, '');
            let room_schedule_row = document.querySelector(`table[data-boundview="RoomDayGridId-timelineview"][data-recordindex="${index}"]`)
            let all_events = room_schedule_row.querySelectorAll('.sch-event');
            let last_event;
            if (all_events.length) {
                last_event = all_events[all_events.length - 1];
            } else {
                last_event = null;
            }
            let closing_time_element = document.createElement("span");
            if (window.ignored_room_names.has(room_name)) {
                closing_time_element.innerHTML = `<div data-recordindex="${index}" class="closing-tag" style="display:inline-block; color: lightgray; background-color:white; font-weight:bold; margin-right: 2px; font-family: 'sans serif'; width:60px; text-align:center">Not ITS</span></div>`;
                room.querySelector('div').insertBefore(closing_time_element, room.querySelector('span'));
                if (window.closing_times[room_name] != null) {
                    return;
                }
                window.closing_times[room_name] = 'Ignored';
                return;
            }
            if (last_event == null) {
                closing_time_element.innerHTML = `<div data-recordindex="${index}" class="closing-tag" style="display:inline-block; color: white; background-color:red; font-weight:bold; margin-right: 2px; font-family: 'sans serif'; width:60px; text-align:center">No Class</span></div>`;
                room.querySelector('div').insertBefore(closing_time_element, room.querySelector('span'));
                if (window.closing_times[room_name] != null) {
                    return;
                }
                window.closing_times[room_name] = 'No Class';
                return;
            }
            let bound = last_event.getBoundingClientRect();
            let end_coordinate = bound.right;
            let end_time;
            for (let i = 0; i < times.length; i++) {
                const cur_hour = times[i];
                const next_hour = (i < times.length - 1) ? times[i + 1] : { time: { hour: '11', minute: '00', am_pm: 'PM' } }
                if (cur_hour.end_coordinate < end_coordinate) {
                    continue;
                }
                if (cur_hour.mid_coordinate >= end_coordinate) {
                    end_time = { ...cur_hour.time };
                    end_time.minute = '30';
                    break;
                }
                end_time = next_hour.time;
                break;
            }
            let end_time_string = `${end_time.hour}:${end_time.minute} ${end_time.am_pm}`
            closing_time_element.innerHTML = `<div data-recordindex="${index}" class="closing-tag" style="display:inline-block; color: black; background-color:white; font-weight:bold; margin-right: 2px; font-family: 'sans serif'; width:60px; text-align:center">${end_time_string}</span></div>`
            room.querySelector('div').insertBefore(closing_time_element, room.querySelector('span'));

            if (window.closing_times[room_name] != null) {
                return;
            }
            window.closing_times[room_name] = end_time_string;
            if (window.rooms_closing_at[end_time_string] == null) {
                window.rooms_closing_at[end_time_string] = [];
            }
            window.rooms_closing_at[end_time_string].push(room_name);
        });
    } catch (e) {
        return;
    } finally {
        try {
            let totalRooms = document.querySelector("#tbtext-1062");
            window.room_count = parseInt(totalRooms.innerText.match(/Displaying \d+ - \d+ of (\d+)/)[1]);
        } catch (e) { }
        if (window.room_count > 0 && !window.all_rooms_done && Object.keys(window.closing_times).length == window.room_count) {
            window.all_rooms_done = true;
            printClosingTimes();
            createDownloadButton();
        }
    }
}

/**
 * Prints the closing times for all rooms to the console and creates a table.
 */
function printClosingTimes() {
    console.clear();
    let closing_times_array = Object.entries(window.rooms_closing_at);
    closing_times_array.sort((a, b) => compareTimeStrings(a[0], b[0]));
    let output = [];
    for (let pair of closing_times_array) {
        let time = pair[0];
        let rooms = pair[1];
        output.push(`${time}: ${rooms.join(', ')}`);
    }
    console.log(output.join('\n'));
    console.table(window.closing_times);
}

/**
 * Compares two time strings in the format "HH:MM AM/PM" and returns a negative value if the first time is earlier, a positive value if the first time is later, and 0 if the times are the same.
 * @param {string} time1 - The first time string.
 * @param {string} time2 - The second time string.
 * @returns {number} - The result of the comparison.
 */
function compareTimeStrings(time1, time2) {
    let [hour1, minute1, am_pm1] = time1.split(/[:\s]/);
    let [hour2, minute2, am_pm2] = time2.split(/[:\s]/);
    hour1 = Number(hour1);
    hour2 = Number(hour2);
    minute1 = Number(minute1);
    minute2 = Number(minute2);
    if (am_pm1 != am_pm2) {
        return (am_pm1 == 'AM') ? -1 : 1;
    }
    if (hour1 != hour2) {
        return hour1 - hour2;
    }
    return minute1 - minute2;
}

/**
 * Converts an object to a CSV string.
 * @param {object} obj - The object to be converted to CSV.
 * @returns {string} - The CSV string.
 */
function convertToCSV(obj) {
    var pairs = Object.entries(obj);
    var csv = '';
    for (var i = 0; i < pairs.length; i++) {
        csv += pairs[i].join(',') + (i < pairs.length - 1 ? '\n' : '');
    }
    return csv;
}

/**
 * Creates a download button for the closing times CSV file.
 */
function createDownloadButton() {
    var csv = convertToCSV(window.closing_times);
    var blob = new Blob([csv], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var button = document.createElement('a');
    button.style = "position: absolute; left: 50%;margin: 8px; padding: 5px; color: black; border-radius: 3px; background: gold; display:inline-block; font-weight:bold; font-family: 'sans serif'; text-align:center";
    button.textContent = 'Download CSV';
    button.href = url;
    button.download = 'closing_times.csv';
    button.id = "download_csv";
    document.body.append(button);
}

/**
 * Removes the download button from the page.
 */
function removeDownloadButton() {
    try {
        document.querySelector("#download_csv").remove()
    } catch { }
}

/**
 * Reloads the page and resets the necessary variables.
 */
function reload() {
    window.closing_times = {};
    window.rooms_closing_at = {};
    window.all_rooms_done = false;
    window.room_count = 0;
    removeDownloadButton();
    window.pageScrollObserver.disconnect();
    console.log("Reload");
    setTimeout(() => {
        console.log("Timer done");
        window.pageScrollObserver.observe(document.querySelector('.x-grid-scroll-body.x-scroller'), { childList: true, subtree: true });
        updateClosingTimes();
    }, 4000);
}

/**
 * Removes any existing vertical lines on the page.
 */
function removeExistingVerticalLinesIfAny() {
    const existingLines = document.querySelectorAll('.vertical-line');
    existingLines.forEach(line => line.remove());
}

/**
 * Draws vertical lines on the page to indicate the closing times for each room.
 * @param {object[]} times - An array of objects containing the time information.
 */
function drawVerticalLines(times) {
    removeExistingVerticalLinesIfAny();

    const referenceElement = document.querySelector('#RoomDayGridId-normal');
    if (!referenceElement) {
        console.error('Element with ID "RoomDayGridId-normal" not found');
        return;
    }

    const referenceRect = referenceElement.getBoundingClientRect();

    const colors = [
        'lightpink',
        'lightyellow',
        'lightcoral',
        'lightsalmon',
        'lightseagreen',
        'lightgoldenrodyellow',
    ];

    times.forEach(({ end_coordinate }, index) => {
        const line = document.createElement('div');
        line.classList.add('vertical-line');
        line.style.position = 'absolute';
        line.style.left = `${end_coordinate}px`;
        line.style.top = `${referenceRect.top}px`;
        line.style.height = `${referenceRect.height}px`;
        line.style.width = '1px';
        line.style.backgroundColor = colors[index % colors.length];
        line.style.zIndex = '1';
        document.body.appendChild(line);
    });
}

// Initialize the necessary variables and set up the event observers
window.addEventListener("load", () => {
    setTimeout(() => {
        reload()
        console.log("Timer done");
        window.viewSwitchObserver.observe(document.querySelector("#button-1032"), { childList: true, subtree: true });
        window.pageSwitchObserver.observe(document.querySelector("#tbtext-1062"), { childList: true, subtree: true });
        window.pageScrollObserver.observe(document.querySelector('.x-grid-scroll-body.x-scroller'), { childList: true, subtree: true });
        updateClosingTimes();
    }, 4000);
});