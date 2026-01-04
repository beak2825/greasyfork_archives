// ==UserScript==
// @name         Better timelogs
// @version      1.O
// @description  Auto fill in start time on new (Log time button) timelogs + End now button
// @author       Liam Verschueren
// @match        https://app.tempo.io/io/web/tempo-app/*
// @grant        none
// @namespace https://greasyfork.org/users/1490907
// @downloadURL https://update.greasyfork.org/scripts/541421/Better%20timelogs.user.js
// @updateURL https://update.greasyfork.org/scripts/541421/Better%20timelogs.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Wait-for-elements function
    const waitForElements = (selectors, callback, continuePolling = false, interval = 100) => {
        if (!Array.isArray(selectors)) {
            selectors = [selectors];
        }
        const elements = selectors.map(selector => document.querySelector(selector));
        if (elements.every(element => element !== null)) {
            callback(...elements);
            if (!continuePolling) {
                return;
            }
        }
        setTimeout(() => waitForElements(selectors, callback, continuePolling, interval), interval);
    };

    const convertDateToISO = (dateStr) => {
        // Converts "13/May/25" to "2025-05-13"
        const [day, monthStr, yearSuffix] = dateStr.split('/');
        const months = {
            Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
            Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
        };
        const month = months[monthStr];
        const year = '20' + yearSuffix;
        return `${year}-${month}-${day.padStart(2, '0')}`;
    };

    const parseDurationToMs = (str) => {
        // Converts "20m", "1h 30m" into milliseconds
        let hours = 0, minutes = 0;
        const hourMatch = str.match(/(\d+)\s*h/);
        const minuteMatch = str.match(/(\d+)\s*m/);
        if (hourMatch) hours = parseInt(hourMatch[1], 10);
        if (minuteMatch) minutes = parseInt(minuteMatch[1], 10);
        return (hours * 60 + minutes) * 60 * 1000; // return in ms
    };

    const roundTimeToNext5Min = (date) => {
        const ms = 1000 * 60 * 5;
        return new Date(Math.ceil(date.getTime() / ms) * ms);
    };

    const getTodayWithTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const today = new Date();
        today.setHours(hours, minutes, 0, 0);
        return today;
    }

    const setNativeValue = (element, value) => {
        const lastValue = element.value;
        element.value = value;

        const event = new Event('input', {bubbles: true});
        // For React 15/16 compatibility
        const tracker = element._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        element.dispatchEvent(event);
    }

    const setMarker = (id, anchor = document) => {
        const invisibleSpan = document.createElement('span');
        invisibleSpan.id = `LiamBetterTimelogs_${id}`;
        invisibleSpan.style.display = 'none';
        anchor.appendChild(invisibleSpan);
    };

    const checkMarker = (id) => {
        return Boolean(document.getElementById(`LiamBetterTimelogs_${id}`));
    };

    waitForElements('div[role="dialog"]:has(form#worklogForm)', async (worklogDialog) => {
        const dateField = document.querySelector('#startedField');
        if (!dateField) return;
        const chosen_date = convertDateToISO(dateField.value);
        const dayLane = document.querySelector(`div[id="${chosen_date}"][data-testid="styled-day"] div[data-testid="timeViewEntryWrapper"]`);

        // Actions for new worklogs
        const newWorklogElement = dayLane.querySelector(`div[id="resize-WORKLOG-clone-${chosen_date}"]`)
        if (newWorklogElement) {
            const worklogs = Array.from(dayLane.children).filter(child => child.id.includes("WORKLOG"));
            const lastWorklog = worklogs[worklogs.length - 1].querySelector('div[name="tempoWorklogCard"]');

            // Get times of last worklog
            const last_start_time = new Date(lastWorklog.getAttribute('data-date'));
            const last_start_time_str = last_start_time.toTimeString().substring(0, 5);

            const last_duration_str = lastWorklog.querySelector('span[name="tempoCardDuration"]').textContent?.trim();
            const last_duration_ms = parseDurationToMs(last_duration_str);

            const last_end_time = new Date(last_start_time.getTime() + last_duration_ms);
            const last_end_time_str = last_end_time.toTimeString().substring(0, 5);

            // Find the new worklog
            const worklogDiv = document.getElementById("WORKLOG--1");
            const dateObj = new Date(worklogDiv.getAttribute("data-date"));
            const hours = dateObj.getHours();
            const minutes = dateObj.getMinutes();

            // Fill in fields (if log item and not filled in yet)
            if (hours === 8 && minutes === 0 && !checkMarker('startTimeField')) {
                console.log("[INFO] dateField found:", chosen_date, dateField);
                console.log("[INFO] dayLane found:", dayLane);
                console.log(`[INFO] Found ${worklogs.length} WORKLOG(s)`, worklogs);
                console.log("[INFO] Last worklog element:", lastWorklog);
                console.log("[INFO] Computed start time new worklog:", `${last_start_time_str} + ${last_duration_str} = ${last_end_time_str})`);

                const startTimeField = worklogDialog.querySelector('#startTimeField');
                if (startTimeField) {
                    setNativeValue(startTimeField, last_end_time_str);
                    console.log("[INFO] startTimeField set:", last_end_time_str, startTimeField);
                    setMarker('startTimeField', worklogDialog)
                    startTimeField.focus()
                    await new Promise(resolve => setTimeout(resolve, 50));
                    startTimeField.blur()
                }
            }

            //if (!checkMarker('commentField')) {
            //    const commentField = worklogDialog.querySelector('#commentField');
            //    if (commentField) {
            //        const autoComment = '000000000000000000000000000000000000000000000000000000000';
            //        setNativeValue(commentField, autoComment);
            //        console.log("[INFO] commentField set:", autoComment, commentField);
            //        setMarker('commentField', worklogDialog)
            //    }
            //}
        }
        // Actions on existing worklogs
        if (!worklogDialog.querySelector('button[data-testid="endNow"]')) {
            const cancelBtn = worklogDialog.querySelector('button[data-testid="cancelLogTime"]')
            const endNowBtn = cancelBtn.cloneNode(true);
            endNowBtn.setAttribute('data-testid', 'endNow');
            endNowBtn.style.alignItems = 'center';
            endNowBtn.innerHTML = `End Now`;
            endNowBtn.onclick = async function () {
                const now_time_rounded = roundTimeToNext5Min(new Date());
                const now_time_str = now_time_rounded.toTimeString().substring(0, 5);

                const endTimeField = worklogDialog.querySelector('#endTimeField');
                setNativeValue(endTimeField, now_time_str);
                console.log("[INFO] endTimeField set:", now_time_str, endTimeField);

                const startTimeField = worklogDialog.querySelector('#startTimeField');
                const duration_ms = now_time_rounded - getTodayWithTime(startTimeField?.value);
                const duration_str = `${Math.round(duration_ms / 60000)}m`;
                const durationField = worklogDialog.querySelector('#durationField');
                setNativeValue(durationField, duration_str);
                console.log("[INFO] durationField set:", duration_str, durationField);

                durationField.focus()
                durationField.blur()
                await new Promise(resolve => setTimeout(resolve, 50));
                const updateBtn = worklogDialog.querySelector('button[data-testid="submitLogTime"]')
                updateBtn.click()
            };
            cancelBtn.parentNode.insertBefore(endNowBtn, cancelBtn);
        }
    }, true);

})();