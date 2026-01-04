// ==UserScript==
// @name         UBC Workday Calendar Generator
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Adds a 'Download Calendar (.ics)' button to Workday and generates ICS with proper location/description
// @match        *://*.myworkday.com/ubc*
// @author       TU
// @license      TU
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507108/UBC%20Workday%20Calendar%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/507108/UBC%20Workday%20Calendar%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const timeZone = 'America/Vancouver';

    function formatToICS(event, courseNameCal, courseTypeCal, uniqueId) {
        const crlf = '\r\n';

        function convertTime(time) {
            if (!time || typeof time !== 'string') {
                console.warn("Invalid time input:", time);
                return '000000';
            }
            const match = time.match(/(\d+):(\d+)\s*(a\.m\.|p\.m\.)/i);
            if (!match) {
                console.warn("Time parsing failed:", time);
                return '000000';
            }

            let [_, hours, minutes, period] = match;
            let hours24 = parseInt(hours, 10);
            if (isNaN(hours24)) hours24 = 0;
            if (period.toLowerCase() === 'p.m.' && hours24 !== 12) hours24 += 12;
            if (period.toLowerCase() === 'a.m.' && hours24 === 12) hours24 = 0;
            return `${hours24.toString().padStart(2, '0')}${minutes.padStart(2, '0')}00`;
        }

        if (!event || !event.startDate || !event.endDate) {
            console.error("Invalid event object:", event);
            return '';
        }

        const startTime = convertTime(event.startTime);
        const endTime = convertTime(event.endTime);
        const dtstamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const uid = `${uniqueId || 'X'}-${event.startDate}@tupreti.com`;
        const startDate = event.startDate.replace(/-/g, '');

        const dayMap = { Mon: 'MO', Tue: 'TU', Wed: 'WE', Thu: 'TH', Fri: 'FR', Sat: 'SA', Sun: 'SU' };
        let days = '';
        if (event.days) {
            days = event.days.split(' ')
                .map(day => dayMap[day] || '')
                .filter(Boolean)
                .join(',');
        }
        const frequency = days ? `FREQ=WEEKLY;BYDAY=${days}` : `FREQ=WEEKLY`;

        const until = event.endDate ? `${event.endDate.replace(/-/g, '')}T235959Z` : '';
        const recurrenceRule = until
            ? (event.alternateWeeks
                ? `${frequency};INTERVAL=2;UNTIL=${until}`
                : `${frequency};UNTIL=${until}`)
            : frequency;

        const icsEvent = `BEGIN:VEVENT${crlf}` +
                         `UID:${uid}${crlf}` +
                         `DTSTAMP:${dtstamp}${crlf}` +
                         (startDate && startTime ? `DTSTART;TZID=${timeZone}:${startDate}T${startTime}${crlf}` : '') +
                         (startDate && endTime ? `DTEND;TZID=${timeZone}:${startDate}T${endTime}${crlf}` : '') +
                         (recurrenceRule ? `RRULE:${recurrenceRule}${crlf}` : '') +
                         `SUMMARY:${courseNameCal || 'No Title'}${crlf}` +
                         `DESCRIPTION:${courseTypeCal || ''}${crlf}` +
                         `LOCATION:${event.location || 'No Location'}${crlf}` +
                         `END:VEVENT`;

        return icsEvent;
    }

    function generateICSFile(events) {
        if (!Array.isArray(events) || events.length === 0) {
            console.warn("No events passed to generateICSFile");
            return;
        }

        const crlf = '\r\n';
        const icsContent = `BEGIN:VCALENDAR${crlf}` +
                           `VERSION:2.0${crlf}` +
                           `PRODID:-//Tanish Upreti//UBC Workday Calendar Generator//EN${crlf}` +
                           `CALSCALE:GREGORIAN${crlf}` +
                           `METHOD:PUBLISH${crlf}` +
                           `X-WR-TIMEZONE:${timeZone}${crlf}` +
                           events.join(crlf) +
                           crlf + `END:VCALENDAR`;

        try {
            const blob = new Blob([icsContent], { type: 'text/calendar' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'UBC Course Schedule.ics';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to generate ICS file:", err);
        }
    }

    function processMeetingPattern(meetingPattern) {
        if (!meetingPattern || typeof meetingPattern !== 'string') {
            console.warn("Invalid meeting pattern:", meetingPattern);
            return { startDate: '', endDate: '', days: '', alternateWeeks: false, startTime: '', endTime: '', location: '' };
        }

        const parts = meetingPattern.split(" | ");
        if (parts.length < 3) {
            console.warn("Unexpected meeting pattern format:", meetingPattern);
            return { startDate: '', endDate: '', days: '', alternateWeeks: false, startTime: '', endTime: '', location: '' };
        }

        let [dateRange, daysAndWeeks, timeRange, ...locationParts] = parts;
        let location = locationParts.join(" | ") || 'No Location';

        let startDate = '', endDate = '';
        if (dateRange.includes(" - ")) {
            [startDate, endDate] = dateRange.split(" - ");
        }

        let alternateWeeks = daysAndWeeks.includes("(Alternate weeks)");
        let days = alternateWeeks ? daysAndWeeks.replace("(Alternate weeks)", "").trim() : daysAndWeeks.trim();

        let startTime = '', endTime = '';
        if (timeRange.includes(" - ")) {
            [startTime, endTime] = timeRange.split(" - ");
        }

        return { startDate, endDate, days, alternateWeeks, startTime, endTime, location };
    }

    function extractUBCO() {
        const divs = document.querySelectorAll('div[data-automation-label]');
        if (!divs.length) {
            console.info("No UBCO-style divs found.");
            return [];
        }
        const courseNames = [];
        divs.forEach(div => {
            const label = div.getAttribute('data-automation-label');
            if (label) courseNames.push(label);
        });
        return courseNames;
    }

    function extractUBCV() {
        const rows = document.querySelectorAll("table tbody tr");
        if (!rows.length) {
            console.info("No UBCV-style table rows found.");
            return [];
        }
        const patterns = [];
        rows.forEach(row => {
            const cells = row.querySelectorAll("td");
            if (cells.length < 5) return;

            const section = cells[1]?.innerText.trim();
            const meetings = cells[4]?.innerText.trim();
            const instructionalFormat = cells[2]?.innerText.trim() || '';

            if (section && meetings) {
                const sessions = meetings.split(/\n/).map(s => s.trim()).filter(Boolean);
                sessions.forEach(session => {
                    patterns.push({ course: section, instructionalFormat, session });
                });
            }
        });
        return patterns;
    }

    function extractAllCourseNamesAndGenerateICS() {
        console.log("ICS generation triggered");

        requestIdleCallback(() => {
            try {
                const pattern = /\b[A-Z]{3,4}_[OV]\s\d{3}-[A-Z0-9_]+ - .+/;
                const events = [];

                // ---------- UBCO ----------
                const courseNames = extractUBCO();
                for (let i = 0; i < courseNames.length; i++) {
                    const currentItem = courseNames[i];
                    if (pattern.test(currentItem)) {
                        const course = currentItem;
                        const instructionalFormat = courseNames[i + 1] || '';

                        let j = i + 3;
                        while (j < courseNames.length && typeof courseNames[j] === 'string' && courseNames[j].includes('|')) {
                            const parsed = processMeetingPattern(courseNames[j]);
                            const event = formatToICS(parsed, course, instructionalFormat, i);
                            if (event) events.push(event);
                            j++;
                        }
                        i = j - 1;
                    }
                }

                // ---------- UBCV ----------
                if (events.length === 0) {
                    const ubcvPatterns = extractUBCV();
                    ubcvPatterns.forEach((item, idx) => {
                        if (!item || !item.course || !pattern.test(item.course)) return;
                        const parsed = processMeetingPattern(item.session);
                        const event = formatToICS(parsed, item.course, item.instructionalFormat, idx);
                        if (event) events.push(event);
                    });
                }

                if (events.length > 0) {
                    generateICSFile(events);
                    console.log("Events generated:", events.length);
                } else {
                    console.log("No events found to generate.");
                }
            } catch (error) {
                console.error("Error while extracting course names and generating ICS:", error);
            }
        });
    }

    function addCalendarDownloadButton() {
        try {
            const selectedTab = document.querySelector('li[data-automation-id="selectedTab"]');
            if (selectedTab && selectedTab.querySelector('div[data-automation-id="tabLabel"]')?.textContent.trim() === 'Registration & Courses') {
                const popups = document.querySelectorAll('div[data-automation-id="workletPopup"]');
                popups.forEach(popup => {
                    const menuList = popup.querySelector('ul[data-automation-id="menuList"]');
                    if (menuList && !menuList.querySelector('div[data-automation-id="calendarDownloadButton"]')) {
                        console.log("Menu list detected, adding 'Download Calendar (.ics)' button.");

                        const existingListItem = menuList.querySelector('li');
                        if (existingListItem) {
                            const newListItem = existingListItem.cloneNode(true);
                            const newButtonDiv = newListItem.querySelector('div')?.cloneNode(true);
                            if (!newButtonDiv) return;

                            newListItem.replaceChild(newButtonDiv, newListItem.querySelector('div'));

                            newButtonDiv.textContent = 'Download Calendar (.ics)';
                            newButtonDiv.setAttribute('data-automation-id', 'calendarDownloadButton');
                            newButtonDiv.setAttribute('aria-label', 'Download Calendar');
                            newButtonDiv.addEventListener('click', extractAllCourseNamesAndGenerateICS);

                            menuList.appendChild(newListItem);
                        }
                    }
                });
            }
        } catch (err) {
            console.error("Error while adding calendar button:", err);
        }
    }

    const observer = new MutationObserver(() => addCalendarDownloadButton());
    observer.observe(document, { childList: true, subtree: true });

})();

(function() {
    'use strict';

    const timeZone = 'America/Vancouver';

    function formatToICS(event, courseNameCal, courseTypeCal, uniqueId) {
        const crlf = '\r\n';

        function convertTime(time) {
            const match = time.match(/(\d+):(\d+)\s*(a\.m\.|p\.m\.)/i);
            if (!match) return '';

            let [_, hours, minutes, period] = match;
            let hours24 = parseInt(hours, 10);
            if (period.toLowerCase() === 'p.m.' && hours24 !== 12) hours24 += 12;
            if (period.toLowerCase() === 'a.m.' && hours24 === 12) hours24 = 0;
            return `${hours24.toString().padStart(2, '0')}${minutes.padStart(2, '0')}00`;
        }

        const startTime = convertTime(event.startTime);
        const endTime = convertTime(event.endTime);
        const dtstamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const uid = `${uniqueId}-${event.startDate}@tupreti.com`;
        const startDate = event.startDate.replace(/-/g, '');

        const dayMap = { Mon: 'MO', Tue: 'TU', Wed: 'WE', Thu: 'TH', Fri: 'FR', Sat: 'SA', Sun: 'SU' };
        const days = event.days.split(' ').map(day => dayMap[day]).join(',');
        const frequency = `FREQ=WEEKLY;BYDAY=${days}`;
        const recurrenceRule = event.alternateWeeks
            ? `${frequency};INTERVAL=2;UNTIL=${event.endDate.replace(/-/g, '')}T235959Z`
            : `${frequency};UNTIL=${event.endDate.replace(/-/g, '')}T235959Z`;

        const icsEvent = `BEGIN:VEVENT${crlf}` +
                         `UID:${uid}${crlf}` +
                         `DTSTAMP:${dtstamp}${crlf}` +
                         `DTSTART;TZID=${timeZone}:${startDate}T${startTime}${crlf}` +
                         `DTEND;TZID=${timeZone}:${startDate}T${endTime}${crlf}` +
                         `RRULE:${recurrenceRule}${crlf}` +
                         `SUMMARY:${courseNameCal || 'No Title'}${crlf}` +
                         `DESCRIPTION:${courseTypeCal || 'Lecture'}${crlf}` +
                         `LOCATION:${event.location || 'No Location'}${crlf}` +
                         `END:VEVENT`;

        return icsEvent;
    }

    function generateICSFile(events) {
        const crlf = '\r\n';
        const icsContent = `BEGIN:VCALENDAR${crlf}` +
                           `VERSION:2.0${crlf}` +
                           `PRODID:-//Tanish Upreti//UBC Workday Calendar Generator//EN${crlf}` +
                           `CALSCALE:GREGORIAN${crlf}` +
                           `METHOD:PUBLISH${crlf}` +
                           `X-WR-TIMEZONE:${timeZone}${crlf}` +
                           events.join(crlf) +
                           crlf + `END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'UBC Course Schedule.ics';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function processMeetingPattern(meetingPattern) {
        const parts = meetingPattern.split(" | ");
        if (parts.length < 4) return {};

        const [dateRange, daysAndWeeks, timeRange] = parts;
        let locationFull = parts.slice(3).join(" | ");

        const [startDate, endDate] = dateRange.split(" - ");
        const alternateWeeks = daysAndWeeks.includes("(Alternate weeks)");
        const days = alternateWeeks ? daysAndWeeks.replace("(Alternate weeks)", "").trim() : daysAndWeeks.trim();
        const [startTime, endTime] = timeRange.split(" - ");

        return {
            startDate,
            endDate,
            days,
            alternateWeeks,
            startTime,
            endTime,
            location: locationFull
        };
    }

    function extractAllCourseNamesAndGenerateICS() {
        console.log("ICS generation triggered");

        requestIdleCallback(() => {
            try {
                const divs = document.querySelectorAll('div[data-automation-label]');
                const courseNames = [];

                divs.forEach(div => {
                    const label = div.getAttribute('data-automation-label');
                    if (label) courseNames.push(label);
                });

                console.log("Total data-automation-label divs found:", courseNames.length);

                const pattern = /\b[A-Z]{3,4}_[OV] \d{3}-[A-Z0-9]{1,4} - .+/;
                const events = [];

                for (let i = 0; i < courseNames.length; i++) {
                    const currentItem = courseNames[i];
                    console.log(`Checking courseNames[${i}]:`, currentItem);

                    if (pattern.test(currentItem)) {
                        console.log("Matched course regex:", currentItem);
                        const course = currentItem;
                        const instructionalFormat = courseNames[i + 1] || 'Lecture';
                        console.log("Instructional format:", instructionalFormat);

                        let j = i + 3;
                        while (j < courseNames.length && courseNames[j].includes('|')) {
                            const meetingPattern = courseNames[j];
                            console.log("Processing meeting pattern:", meetingPattern);

                            const parsed = processMeetingPattern(meetingPattern);
                            console.log("Parsed meeting pattern:", parsed);

                            if (parsed.startDate) {
                                const event = formatToICS(parsed, course, instructionalFormat, i);
                                events.push(event);
                            }

                            j++;
                        }

                        i = j - 1;
                    }
                }

                if (events.length > 0) {
                    console.log("Events generated:", events.length);
                    generateICSFile(events);
                } else {
                    console.log("No events found to generate. Check regex or meeting pattern format.");
                }
            } catch (error) {
                console.error("Error while extracting course names and generating ICS:", error);
            }
        });
    }

    function addCalendarDownloadButton() {
        const selectedTab = document.querySelector('li[data-automation-id="selectedTab"]');
        if (selectedTab && selectedTab.querySelector('div[data-automation-id="tabLabel"]').textContent.trim() === 'Registration & Courses') {
            const popups = document.querySelectorAll('div[data-automation-id="workletPopup"]');
            popups.forEach(popup => {
                const menuList = popup.querySelector('ul[data-automation-id="menuList"]');
                if (menuList && !menuList.querySelector('div[data-automation-id="calendarDownloadButton"]')) {
                    console.log("Menu list detected, adding 'Download Calendar (.ics)' button.");

                    const existingListItem = menuList.querySelector('li');
                    if (existingListItem) {
                        const newListItem = existingListItem.cloneNode(true);
                        const newButtonDiv = newListItem.querySelector('div').cloneNode(true);
                        newListItem.replaceChild(newButtonDiv, newListItem.querySelector('div'));

                        newButtonDiv.textContent = 'Download Calendar (.ics)';
                        newButtonDiv.setAttribute('data-automation-id', 'calendarDownloadButton');
                        newButtonDiv.setAttribute('aria-label', 'Download Calendar');
                        newButtonDiv.addEventListener('click', extractAllCourseNamesAndGenerateICS);

                        menuList.appendChild(newListItem);
                    }
                }
            });
        }
    }

    const observer = new MutationObserver(() => {
        addCalendarDownloadButton();
    });

    observer.observe(document, { childList: true, subtree: true });
})();
