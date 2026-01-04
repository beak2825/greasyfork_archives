// ==UserScript==
// @name         Live RPH
// @namespace    http://tampermonkey.net/
// @version      1
// @description Calculate your RPH in toolbelt on a day to day basis rather than month to month.
// @author       Tyler Kimbell
// @match        https://www.bctoolbelt.com/users/*
// @license MIT
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/488376/Live%20RPH.user.js
// @updateURL https://update.greasyfork.org/scripts/488376/Live%20RPH.meta.js
// ==/UserScript==
// empty objects for data storage:
let content = [];
let todayData = [];
let pastData = [];
let prevShiftData = [];
let prevShiftDataSorted = [];
let monthShiftData = [];
let monthShiftDataSorted = [];
let monthTime = 0;
let monthResponses = 0;
let eventData = [];
let userEvents = [];
let userData = [];

//'start = ' section of request url
const currentDate = new Date();
const startTimestamp = getMidnightTimestamp(currentDate);
//'end = ' section of request url
const nextDay = new Date(currentDate);
nextDay.setDate(currentDate.getDate() + 1);
const endTimestamp = getMidnightTimestamp(nextDay) - 1;
//const requestUrl = `https://www.bctoolbelt.com/users/2714/timeline.json?start=${startTimestamp}&end=${endTimestamp}.999&interval=undefined`;
//Uncomment and replace with specific request url for a specific date. Be sure to comment out previous line if doing this.
//const requestUrl = 'https://www.bctoolbelt.com/users/{id}/timeline.json?start=1704780000&end=1704866399.999&interval=undefined';

async function fetchData(url, location) {
    const response = await fetch(url).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then((data) => {
        switch(location) {
            case 'now':
                todayData = data.data;
                break;
            case 'event':
                eventData = data.event_data;
                break;
            case 'user':
                userData = data.break_queue.user;
                break;
            default:
                pastData = data.data;
        }
    }).catch((error) => {
        console.error('Error fetching data:', error.message);
    });
}

async function fetchNow() {
    const endpointUrl = `https://www.bctoolbelt.com/users/${user.id}/timeline.json?start=${startTimestamp}&end=${endTimestamp}.999&interval=undefined&request_agent=live_rph`;

    await fetchData(endpointUrl, 'now').then(() => {
        // Data for timestamp
        const nowTimestamp = new Date();
        const nowDate = nowTimestamp.toLocaleDateString();
        const nowTime = nowTimestamp.toLocaleTimeString();
        // Filter elements with name: 'Chat'
        const chatElements = todayData.filter((element) => element.name === 'Chat');
        // Filter elements with name: 'On Call'
        const onCallElements = todayData.filter((element) => element.name === 'On Call');
        // Filter elements with name: 'Not Ready - Meeting'
        const notReadyMeetingElements = todayData.filter((element) => element.name === 'Not Ready - Meeting');
        // Filter elements with name: 'Not Ready - Break'
        const notReadyBreakElements = todayData.filter((element) => element.name === 'Not Ready - Break');
        // Filter elements with name: 'Not Ready - Away'
        const notReadyAwayElements = todayData.filter((element) => element.name === 'Not Ready - Away');
        // Filter elements with name: 'Not Ready - Training'
        const notReadyTrainingElements = todayData.filter((element) => element.name === 'Not Ready - Training');
        // Filter elements with name: 'Not Ready - Project'
        const notReadyProjectElements = todayData.filter((element) => element.name === 'Not Ready - Project');
        // Filter elements with name: 'Not Ready - Outbound'
        const notReadyOutboundElements = todayData.filter((element) => element.name === 'Not Ready - Outbound');
        // Filter elements with name: 'Not Ready - Chat'
        const notReadyChatElements = todayData.filter((element) => element.name === 'Not Ready - Chat');
        // Filter elements with name: 'Ready'
        const readyElements = todayData.filter((element) => element.name === 'Ready');
        // Filter elements with name: 'Ringing'
        const ringingElements = todayData.filter((element) => element.name === 'Ringing');
        // Filter elements with name: 'After Call Work'
        const afterCallWorkElements = todayData.filter((element) => element.name === 'After Call Work');
        // Filter elements with name: 'Case Reply'
        const caseReplyElements = todayData.filter((element) => element.name === 'Case Reply');
        // Calculate total duration for 'Chat' elements
        let totalDurationInSecondsChat = calculateTotalDuration(chatElements);
        // Calculate total duration for 'On Call' elements
        let totalDurationInSecondsOnCall = calculateTotalDuration(onCallElements);
        // Calculate total duration for 'Not Ready - Meeting' elements
        let totalDurationInSecondsNotReadyMeeting = calculateTotalDuration(notReadyMeetingElements);
        // Calculate total duration for 'Not Ready - Break' elements
        let totalDurationInSecondsNotReadyBreak = calculateTotalDuration(notReadyBreakElements);
        // Calculate total duration for 'Not Ready - Away' elements
        let totalDurationInSecondsNotReadyAway = calculateTotalDuration(notReadyAwayElements);
        // Calculate total duration for 'Not Ready - Training' elements
        let totalDurationInSecondsNotReadyTraining = calculateTotalDuration(notReadyTrainingElements);
        // Calculate total duration for 'Not Ready - Project' elements
        let totalDurationInSecondsNotReadyProject = calculateTotalDuration(notReadyProjectElements);
        // Calculate total duration for 'Not Ready - Outbound' elements
        let totalDurationInSecondsNotReadyOutbound = calculateTotalDuration(notReadyOutboundElements);
        // Calculate total duration for 'Not Ready - Chat' elements
        let totalDurationInSecondsNotReadyChat = calculateTotalDuration(notReadyChatElements);
        // Calculate total duration for 'Ready' elements
        let totalDurationInSecondsReady = calculateTotalDuration(readyElements);
        // Calculate total duration for 'Ringing' elements
        let totalDurationInSecondsRinging = calculateTotalDuration(ringingElements);
        // Calculate total duration for 'After Call Work' elements
        let totalDurationInSecondsAfterCallWork = calculateTotalDuration(afterCallWorkElements);
        // Calculate the combined total active duration for all elements except 'Case Reply'
        let totalTimeNotCountedInSeconds =
            totalDurationInSecondsOnCall +
            totalDurationInSecondsChat +
            totalDurationInSecondsNotReadyMeeting +
            totalDurationInSecondsNotReadyBreak +
            totalDurationInSecondsNotReadyAway +
            totalDurationInSecondsNotReadyTraining +
            totalDurationInSecondsNotReadyProject +
            totalDurationInSecondsNotReadyOutbound +
            totalDurationInSecondsRinging +
            totalDurationInSecondsAfterCallWork;
        // Calculate the total time logged in by adding the duration of every element in the data array
        let totalTimeLoggedInInSeconds =
            totalDurationInSecondsOnCall +
            totalDurationInSecondsNotReadyMeeting +
            totalDurationInSecondsNotReadyBreak +
            totalDurationInSecondsNotReadyAway +
            totalDurationInSecondsNotReadyTraining +
            totalDurationInSecondsNotReadyProject +
            totalDurationInSecondsNotReadyOutbound +
            totalDurationInSecondsNotReadyChat +
            totalDurationInSecondsReady +
            totalDurationInSecondsRinging +
            totalDurationInSecondsAfterCallWork;
        // Calculate the remaining time for RPH
        const remainingRPHInSeconds = totalTimeLoggedInInSeconds - totalTimeNotCountedInSeconds;
        //Adjusted by %10
        const remainingRPHAdjustTen = Math.round(remainingRPHInSeconds - remainingRPHInSeconds*.1);
        const remainingRPHInHours = remainingRPHAdjustTen / 3600;
        // Calculate RPH
        const rph = caseReplyElements.length / remainingRPHInHours;

        // Map data to content object
        content[0] = {"name": "heading", "value": `${nowDate} @ ${nowTime}`};
        content[1] = {"name": "Total Time Logged in", "value": formatTime(totalTimeLoggedInInSeconds)};
        content[2] = {"name": "Time in Ready", "value": `${formatTime(remainingRPHAdjustTen)} (%10 buffer inc.)`};
        content[3] = {"name": "Time on Calls", "value": formatTime(totalDurationInSecondsOnCall)};
        content[4] = {"name": "Time on Chats", "value": formatTime(totalDurationInSecondsChat)};
        content[5] = {"name": "Away", "value": formatTime(totalDurationInSecondsNotReadyAway)};
        content[6] = {"name": "Break", "value": formatTime(totalDurationInSecondsNotReadyBreak)};
        content[7] = {"name": "Case Replies", "value": caseReplyElements.length};
        content[9] = {"name": "Today's RPH", "value": rph.toFixed(2)};
    });
}

async function fetchPrevious(depth, location) {
    // const prevDate = new Date("Sun May 05 2024 10:46:15 GMT-0500 (Central Daylight Time)"); // for testing
    const prevDate = new Date(currentDate);

    for(let n=1;n<depth;n++) {
        // Go back a day in iteration
        // prevDate.setDate(prevDate.getDate() - n); // for testing
        prevDate.setDate(currentDate.getDate() - n);

        // Get the day after the current iteration
        const prevEndDate = new Date(prevDate);
        prevEndDate.setDate(prevDate.getDate() + 1);

        let prevStartTimestamp = getMidnightTimestamp(prevDate);
        let prevEndTimestamp = getMidnightTimestamp(prevEndDate) - 1;

        // Store value for last shift date
        let prevShiftDate = new Date(prevDate);
        prevShiftDate.setDate(prevDate.getDate());

        // Set endpoint to fetch data from
        let prevEndpointUrl = `https://www.bctoolbelt.com/users/${user.id}/timeline.json?start=${prevStartTimestamp}&end=${prevEndTimestamp}.999&interval=undefined&request_agent=live_rph`;

        await fetchData(prevEndpointUrl, 'prev').then(() => {
            // Filter elements with name: 'Chat'
            const chatElements = pastData.filter((element) => element.name === 'Chat');
            // Filter elements with name: 'On Call'
            const onCallElements = pastData.filter((element) => element.name === 'On Call');
            // Filter elements with name: 'Not Ready - Meeting'
            const notReadyMeetingElements = pastData.filter((element) => element.name === 'Not Ready - Meeting');
            // Filter elements with name: 'Not Ready - Break'
            const notReadyBreakElements = pastData.filter((element) => element.name === 'Not Ready - Break');
            // Filter elements with name: 'Not Ready - Away'
            const notReadyAwayElements = pastData.filter((element) => element.name === 'Not Ready - Away');
            // Filter elements with name: 'Not Ready - Training'
            const notReadyTrainingElements = pastData.filter((element) => element.name === 'Not Ready - Training');
            // Filter elements with name: 'Not Ready - Project'
            const notReadyProjectElements = pastData.filter((element) => element.name === 'Not Ready - Project');
            // Filter elements with name: 'Not Ready - Outbound'
            const notReadyOutboundElements = pastData.filter((element) => element.name === 'Not Ready - Outbound');
            // Filter elements with name: 'Not Ready - Chat'
            const notReadyChatElements = pastData.filter((element) => element.name === 'Not Ready - Chat');
            // Filter elements with name: 'Ready'
            const readyElements = pastData.filter((element) => element.name === 'Ready');
            // Filter elements with name: 'Ringing'
            const ringingElements = pastData.filter((element) => element.name === 'Ringing');
            // Filter elements with name: 'After Call Work'
            const afterCallWorkElements = pastData.filter((element) => element.name === 'After Call Work');
            // Filter elements with name: 'Case Reply'
            const caseReplyElements = pastData.filter((element) => element.name === 'Case Reply');
            // Calculate total duration for 'Chat' elements
            let totalDurationInSecondsChat = calculateTotalDuration(chatElements);
            // Calculate total duration for 'On Call' elements
            let totalDurationInSecondsOnCall = calculateTotalDuration(onCallElements);
            // Calculate total duration for 'Not Ready - Meeting' elements
            let totalDurationInSecondsNotReadyMeeting = calculateTotalDuration(notReadyMeetingElements);
            // Calculate total duration for 'Not Ready - Break' elements
            let totalDurationInSecondsNotReadyBreak = calculateTotalDuration(notReadyBreakElements);
            // Calculate total duration for 'Not Ready - Away' elements
            let totalDurationInSecondsNotReadyAway = calculateTotalDuration(notReadyAwayElements);
            // Calculate total duration for 'Not Ready - Training' elements
            let totalDurationInSecondsNotReadyTraining = calculateTotalDuration(notReadyTrainingElements);
            // Calculate total duration for 'Not Ready - Project' elements
            let totalDurationInSecondsNotReadyProject = calculateTotalDuration(notReadyProjectElements);
            // Calculate total duration for 'Not Ready - Outbound' elements
            let totalDurationInSecondsNotReadyOutbound = calculateTotalDuration(notReadyOutboundElements);
            // Calculate total duration for 'Not Ready - Chat' elements
            let totalDurationInSecondsNotReadyChat = calculateTotalDuration(notReadyChatElements);
            // Calculate total duration for 'Ready' elements
            let totalDurationInSecondsReady = calculateTotalDuration(readyElements);
            // Calculate total duration for 'Ringing' elements
            let totalDurationInSecondsRinging = calculateTotalDuration(ringingElements);
            // Calculate total duration for 'After Call Work' elements
            let totalDurationInSecondsAfterCallWork = calculateTotalDuration(afterCallWorkElements);
            // Calculate the combined total active duration for all elements except 'Case Reply'
            let totalTimeNotCountedInSeconds =
                totalDurationInSecondsOnCall +
                totalDurationInSecondsChat +
                totalDurationInSecondsNotReadyMeeting +
                totalDurationInSecondsNotReadyBreak +
                totalDurationInSecondsNotReadyAway +
                totalDurationInSecondsNotReadyTraining +
                totalDurationInSecondsNotReadyProject +
                totalDurationInSecondsNotReadyOutbound +
                totalDurationInSecondsRinging +
                totalDurationInSecondsAfterCallWork;
            // Calculate the total time logged in by adding the duration of every element in the data array
            let totalTimeLoggedInInSeconds =
                totalDurationInSecondsOnCall +
                totalDurationInSecondsNotReadyMeeting +
                totalDurationInSecondsNotReadyBreak +
                totalDurationInSecondsNotReadyAway +
                totalDurationInSecondsNotReadyTraining +
                totalDurationInSecondsNotReadyProject +
                totalDurationInSecondsNotReadyOutbound +
                totalDurationInSecondsNotReadyChat +
                totalDurationInSecondsReady +
                totalDurationInSecondsRinging +
                totalDurationInSecondsAfterCallWork;
            // Calculate the remaining time for RPH
            const remainingRPHInSeconds = totalTimeLoggedInInSeconds - totalTimeNotCountedInSeconds;
            //Adjusted by %10
            const remainingRPHAdjustTen = Math.round(remainingRPHInSeconds - remainingRPHInSeconds*.1);
            const remainingRPHInHours = remainingRPHAdjustTen / 3600;
            // Calculate RPH
            const rph = caseReplyElements.length / remainingRPHInHours;

            // If the response is a valid number, add it to the prevShiftData object
            if(!isNaN(rph.toFixed(2))){
                if(location == 'week'){
                    prevShiftData.push({
                        "name": "Last Shift's RPH",
                        "value": `${rph.toFixed(2)} on ${prevShiftDate.toLocaleDateString()}`,
                        "date": prevStartTimestamp // allows sorting of items in object
                    });
                } else {
                    // if(prevShiftDate.getUTCMonth() == prevDate.getUTCMonth()){ // for testing
                    if(prevShiftDate.getUTCMonth() == currentDate.getUTCMonth()){
                        monthShiftData.push({
                            "name": prevShiftDate.toLocaleDateString(),
                            "value": rph.toFixed(2),
                            "date": prevStartTimestamp // allows sorting of items in object
                        });
                        monthTime += remainingRPHInHours;
                        monthResponses += caseReplyElements.length;
                    }
                }
            }
        });
    }
}

async function fetchEventData(){
    const timelineStart = currentDate.toISOString();
    const timelineEnd = nextDay.toISOString();

    const endpointUrl = `${window.location.href}.json?callback=schedule_new&timeline_start=${timelineStart}&timeline_end=${timelineEnd}&request_agent=live_rph`;
    await fetchData(endpointUrl, 'event').then(()=>{
        eventData.forEach((event) => {
            if(event.title && event.resourceId == "0-channels"){
                userEvents.push(event);
            }
        });
    });
}

// Console Style Formatting
let fontSize = "font-size: 14px";
let padding = "padding: 3px 6px";
let nameColor = "color: #eee";
let textColor = "color: hsla(175.844, 97.4684%, 46.4706%, 1)";
let warnColor = "color: hsla(13, 91.3%, 55.1%, 1)";

let sharedStyle = [
    fontSize,
    padding
];

let groupStyle = [
    ...sharedStyle,
    "color: #333",
    "background-color: #eee"
].join(" ;");

let nameStyle = [
    ...sharedStyle,
    nameColor,
    "padding-right: 0px"
].join(" ;");

let valueStyle = [
    ...sharedStyle,
    textColor
].join(" ;");

let warnStyle = [
    ...sharedStyle,
    warnColor
].join(" ;");

// Helper functions need to be globally available
// Time stamp logic used in request url.
function getMidnightTimestamp(date) {
    date.setHours(0, 0, 0, 0); // Set the time to midnight (00:00:00.000)
    return Math.floor(date.getTime() / 1000); // Convert to seconds
}
// Function to calculate total duration in seconds for given elements
function calculateTotalDuration(elements) {
    return elements.reduce((totalSeconds, element) => {
        const durationParts = element.duration.split(':');
        const minutes = parseInt(durationParts[0]);
        const seconds = parseInt(durationParts[1]);
        return totalSeconds + minutes * 60 + seconds;
    }, 0);
}
// Function to format time in HH:mm:ss format
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${padWithZero(hours)}:${padWithZero(minutes)}:${padWithZero(remainingSeconds)}`;
}
// Function to pad single-digit numbers with leading zero
function padWithZero(number) {
    return number.toString().padStart(2, '0');
}
// Function to log fetched data to console
function logContent(content){
    // Loop through content object and log each property's value
    content.forEach(function(property) {
        switch(property.name) {
            case 'heading':
                console.group(`%cRPH Report ${property.value}`, groupStyle);
                break;
            case 'monthData':
                console.table(property.value);
                break;
            case 'Assigned Channel':
                break;
            case 'Current Channel':
                if(
                    !(content[10].value === content[11].value)
                    && !(content[11].value === 'Training')
                    && !(content[11].value === 'Meeting')
                    && !(content[11].value === 'Project')
                ){
                    console.log(`%c${property.name}:%c${property.value}`, nameStyle, warnStyle);
                    console.log(`%cPlease ensure you are in the assigned channel:%c${content[10].value}`, warnStyle, `${textColor};${fontSize};`);
                } else {
                    console.log(`%c${property.name}:%c${property.value}`, nameStyle, valueStyle);
                }
                break;
            default:
                console.log(`%c${property.name}:%c${property.value}`, nameStyle, valueStyle);
        }
    });
    console.groupEnd('RPH Report');
}

function calculateRPH() {
    fetchEventData().then(()=>{
        const endpointUrl = `${window.location.href}.json?callback=time&request_agent=live_rph`;
        fetchData(endpointUrl, 'user').then(() => {
            userEvents.forEach((event) => {
                let now = Date.now();
                let eventStart = Date.parse(event.start);
                let eventEnd = Date.parse(event.end);
                let currentChannel = "";

                if(now >= eventStart && now <= eventEnd) {
                    content[10] = {"name": "Assigned Channel", "value": `${event.title}`};
                    content[11] = {"name": "", "value": ""}; // clear value with each refresh
                    switch(userData.state) {
                        case 'Not Ready':
                            currentChannel = userData.reason_code;
                            break;
                        default:
                            switch(userData.reason_code) {
                                case null:
                                    currentChannel = "Phone";
                                    break;
                                default:
                                    currentChannel = userData.reason_code;
                            }
                    }
                    content[11] = {"name":"Current Channel", "value": currentChannel};
                }
            });
        });
    });
    fetchNow().then(() => {
        if(!content[8]) {
            fetchPrevious(8, 'week').then(() => {
                // Sort last shift data by date
                prevShiftDataSorted = prevShiftData.sort(function(a,b){
                    return new Date(b.date) - new Date(a.date);
                });
                // Set last shift data in content object
                content[8] = prevShiftDataSorted[0];
            }).then(() => {
                // Clear the console
                console.clear();
                // Log fetched data
                logContent(content);
            });
        } else {
            // Clear the console
            console.clear();
            // Log fetched data
            logContent(content);
        }
    });
}
calculateRPH();

const intervalInMinutes = 1;
setInterval(calculateRPH, intervalInMinutes * 60 * 1000);

// Constant for referencing months by name
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Function to log Month RPH data to the console
function logMonth(month, year) {
    let thisContent = [];
    let monthShiftDataTransformed = monthShiftDataSorted.reduce((acc, {name, ...x}) => { acc[name] = x; return acc}, {}); // convert to an object with custom index
    thisContent[0] = {"name": "heading", "value": `${monthNames[month]} ${year}`};
    thisContent[1] = {"name": "monthData", "value": monthShiftDataTransformed};
    thisContent[2] = {"name": "Time in Ready (Month Total)", "value": `${monthTime.toFixed(2)} hours (%10 buffer inc.)`};
    thisContent[3] = {"name": "Case Replies (Month Total)", "value": monthResponses};
    thisContent[4] = {"name": "Current Month RPH", "value": (monthResponses / monthTime).toFixed(2)};
    logContent(thisContent);
}

// Function to get Month RPH data
async function fetchMonth() {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // If the month RPH data doesn't already exist, fetch it
    if(!monthShiftDataSorted.length){
        console.log(`%cYour RPH report for the month of ${monthNames[currentMonth]} is currently generating. This can take some time to complete.`, valueStyle);
        await fetchPrevious(32, 'month').then(() => {
            monthShiftDataSorted = monthShiftData.sort(function(a,b){
                return new Date(a.date) - new Date(b.date);
            });
        }).then(() => {
            monthShiftDataSorted.each((data) => {
                delete data.date; // remove timestamp from table output
            });
            logMonth(currentMonth, currentYear);
        });
    // If the month RPH data exists, skip fetch and log to console
    } else {
        logMonth(currentMonth, currentYear);
    }
}

// Make function available in console. Requires "@grant unsafe window" comment
if(!unsafeWindow.fetchMonth) {
    unsafeWindow.fetchMonth = fetchMonth;
}
