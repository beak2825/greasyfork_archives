// ==UserScript==
// @name         Real Time RPH Calculator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description Calculate your RPH in toolbelt on a day to day basis rather than month to month.
// @author       Tyler Kimbell
// @match        https://www.bctoolbelt.com/users/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487882/Real%20Time%20RPH%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/487882/Real%20Time%20RPH%20Calculator.meta.js
// ==/UserScript==

//Time stamp logic used in request url.
function getMidnightTimestamp(date) {
    date.setHours(0, 0, 0, 0); // Set the time to midnight (00:00:00.000)
    return Math.floor(date.getTime() / 1000); // Convert to seconds
}

//'start = ' section of request url
const currentDate = new Date();
const startTimestamp = getMidnightTimestamp(currentDate);

//'end = ' section of request url
const nextDay = new Date(currentDate);
nextDay.setDate(currentDate.getDate() + 1);
const endTimestamp = getMidnightTimestamp(nextDay) - 1;

function calculateRPH() {
    //Get ID
    fetch(/check_session/)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((data) => {
        const userID = data.user_id;
        return fetch(`https://www.bctoolbelt.com/users/${userID}/timeline.json?start=${startTimestamp}&end=${endTimestamp}.999&interval=undefined`);
    })
    .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            //Grouping up the elements in the Data array by name.
            .then((data) => {
                const dataArray = data.data; // Extracting the 'data' array from the response
                const chat = dataArray.filter((element) => element.name === 'Chat');
                const onCall = dataArray.filter((element) => element.name === 'On Call');
                const NRMeeting = dataArray.filter((element) => element.name === 'Not Ready - Meeting');
                const NRBreak = dataArray.filter((element) => element.name === 'Not Ready - Break');
                const NRAway = dataArray.filter((element) => element.name === 'Not Ready - Away');
                const NRTraining = dataArray.filter((element) => element.name === 'Not Ready - Training');
                const NRProject = dataArray.filter((element) => element.name === 'Not Ready - Project');
                const NROutbound = dataArray.filter((element) => element.name === 'Not Ready - Outbound');
                const NRChat = dataArray.filter((element) => element.name === 'Not Ready - Chat');
                const ready = dataArray.filter((element) => element.name === 'Ready');
                const ringing = dataArray.filter((element) => element.name === 'Ringing');
                const ACW = dataArray.filter((element) => element.name === 'After Call Work');
                const caseReply = dataArray.filter((element) => element.name === 'Case Reply');
                //Caluclating duration in seconds for each group.
                let durationChat = totalDuration(chat);
                let durationOnCall = totalDuration(onCall);
                let durationNRMeeting = totalDuration(NRMeeting);
                let durationNRBreak = totalDuration(NRBreak);
                let durationNRAway = totalDuration(NRAway);
                let durationNRTraining = totalDuration(NRTraining);
                let durationNRProject = totalDuration(NRProject);
                let durationNROutbound = totalDuration(NROutbound);
                let durationNRChat = totalDuration(NRChat);
                let durationReady = totalDuration(ready);
                let durationRinging = totalDuration(ringing);
                let durationAfterCallWork = totalDuration(ACW);
                // Calculate the combined total active duration in seconds for all elements except 'Case Reply'
                let activeTime =
                    durationOnCall +
                    durationChat +
                    durationNRMeeting +
                    durationNRBreak +
                    durationNRAway +
                    durationNRTraining +
                    durationNRProject +
                    durationNROutbound +
                    durationRinging +
                    durationAfterCallWork;
                // Calculate the total time logged in in Seconds by adding the duration of every element in the data array
                let loggedInTotal =
                    durationOnCall +
                    durationNRMeeting +
                    durationNRBreak +
                    durationNRAway +
                    durationNRTraining +
                    durationNRProject +
                    durationNROutbound +
                    durationNRChat +
                    durationReady +
                    durationRinging +
                    durationAfterCallWork;
                // Calculate incative time in seconds. When you are 'incactive' you should be working on cases.
                const inactiveTime = loggedInTotal - activeTime;
                //Adjusted by %10 as there is a buffer for rph calculation.
                const inactiveTimeAdjusted = Math.round(inactiveTime - inactiveTime*.1);
                //convert to hourly
                const inactiveTimeHourly = inactiveTimeAdjusted / 3600;
                // Calculate RPH
                const rph = caseReply.length / inactiveTimeHourly;
                // Clear console
                console.clear();
                // Output the results
                console.log(`Total Time Logged in: ${formatTime(loggedInTotal)}`);
                console.log(`Time in Ready (%10 buffer inc.): ${formatTime(inactiveTimeAdjusted)}`);
                console.log(`Time on Calls: ${formatTime(durationOnCall)}`);
                console.log(`Time on Chats: ${formatTime(durationChat)}`);
                console.log(`Away: ${formatTime(durationNRAway)}`);
                console.log(`Break: ${formatTime(durationNRBreak)}`);
                console.log(`Case Replies: ${caseReply.length}`);
                console.log(`RPH: ${rph.toFixed(2)}`);
            })
    .catch(error => {
        console.error('Error:', error);
    });
    // Function to calculate total duration in seconds for given elements
    function totalDuration(elements) {
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
}

calculateRPH();
const intervalInMinutes = 1;
setInterval(calculateRPH, intervalInMinutes * 60 * 1000);