// ==UserScript==
// @name         WaniCalendar
// @namespace    http://nokko.me/
// @version      1.1
// @description  Adds a button to WaniKani’s Review Forecast that lets users download forecasted study times in iCal format.
// @author       nokko
// @match        https://www.wanikani.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @license      CC0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466607/WaniCalendar.user.js
// @updateURL https://update.greasyfork.org/scripts/466607/WaniCalendar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Userscripts are inherently fragile; may fail to find data so wrap this in error handler
    let forecast = null; // (data)
    let forecastElement = null;
    // Attempt to find the forecast data & element
    try {
        // Simple lookup for the element; this reference used for DOM manip, not data retrieval.
        forecastElement = document.querySelector('section.forecast')

        // Slightly more robust, but much more hacky way to find the actual forecast data:
        forecast = Array.from(
            document.querySelectorAll("section")
        )
            .map(el => el.dataset?.reactProps) // Find elements with reactProps data baked in.
            .filter(Boolean) // Filter out `undefined`
            .map(JSON.parse) // Parse each prop as JSON
            .map(data => data?.forecast) // Transform data to just the `forecast` property value or `undefined` if unset
            .filter(Boolean)[0]; // Filter out `undefined`; get the first element in the resulting array
        // Success!
        addEventDownloadButton(forecast)
        console.dir(forecast)
    } catch {
        // Fail!
        const errorMessage = "WaniCalendar failed to find ReviewForecast data!"
        console.error(errorMessage)
        addInfoSpan(errorMessage)
    }

    function addInfoSpan(content, delayMs) {
        const infoSpan = document.createElement('span')
        infoSpan.textContent = content
        const removeInfoSpan = () => infoSpan.remove()
        setTimeout(() => {
            document.querySelector('section.forecast').prepend(
                infoSpan
            );
            infoSpan.onclick = removeInfoSpan;
        }, delayMs ?? 100); // delay in case of DOM manipulation juju, 0.1s by default
    }

    // Sample data: {
    // "2023-05-18T22:00:00Z": 3,
    // "2023-05-19T02:00:00Z": 4,
    // "2023-05-19T17:00:00Z": 19
    // }

    // Convenient format!
    // Keys are date+timestamps; values just seem to be the time converted to the local timezone.
    // I wonder why they don’t just do the conversion from UTC. The preconverted time
    // is unnecessary data.
    // WaniKani technically doesn’t need to store the user’s timezone at all since JS
    // is required to use the app. Maybe it’s stored to make email reminders work?

    // Parse data; add button.
    function addEventDownloadButton(forecastData) {
        // Got data but may be invalid; have to validate
        try {
            const dates = Object.keys(forecastData)

            const parsedDates = dates.map(date => Date.parse(date))
            // Helper function; convert a Date to a calendar event record that can be passed to `createEventSection`.
            const expandDateToRecord = (date) => (
                {
                    date: date,
                    endDate: date,
                    summary: "Activity Available in WaniKani!",
                    description: "A Review or Lesson is available on WaniKani! https://wanikani.com",
                    location: "https://wanikani.com"
                }
            );

            if (parsedDates.every(date => !Number.isNaN(date))) {
                // Data is valid; construct iCal files
                const dateObjects = parsedDates.map(date => new Date(date))
                const downloadFn = () => createAndDownloadCalendarFile(
                    dateObjects.map(expandDateToRecord)
                )

                // Finally, set up the <button> and its click handler
                const downloadBtn = document.createElement('button')
                downloadBtn.id = 'wanicalendar_download_button'
                downloadBtn.textContent = 'Save Reminders as .ics File!'
                downloadBtn.onclick = downloadFn
                // Find the header text…
                const reviewHeaderElement = forecastElement.querySelector('h1')
                // Insert our button right after it!
                reviewHeaderElement.insertAdjacentElement('afterend', downloadBtn)
            } else {
                throw "Some keys in the review forecast data could not be parsed as dates."
            }
        } catch {
            // Handle errors with some level of grace:
            const errorMessage = "WaniCalendar could not process review forecast data!"
            console.error(errorMessage)
            addInfoSpan(errorMessage)
        }
    }

    // ICS/iCal code:

    function createEventSection(eventInfoRecord) {
        const {date, endDate, title, description, location, summary} = eventInfoRecord;

        //        const eventDate = new Date("2022-04-15T12:00:00Z"); // replace with your input date
        //        const eventEndDate = new Date("2022-04-15T13:00:00Z"); // replace with your input date

        //        const eventTitle = "My Event Title"; // replace with your input title
        //        const eventDescription = "My event description."; // replace with your input description
        //        const eventLocation = "My Event Location"; // replace with your input location

        // Generating multiple events; XOR the current Unix time with a random value for reasonable uniqueness in the file.
        const eventUid = Date.now().toString() ^ Math.round(Math.random() * 10000000000000);
        const eventDtStamp = formatDate(date);
        return [
            "BEGIN:VEVENT",
            `UID:${eventUid}`,
            `DTSTAMP:${eventDtStamp}`,
            `DTSTART:${formatDate(date)}`,
            `DTEND:${formatDate(endDate)}`,
            `SUMMARY:${summary}`,
            `LOCATION:${location}`,
            `DESCRIPTION:${description}`,
            "END:VEVENT",
        ];

    }

    // create calendar events; collate into file; download:
    function createAndDownloadCalendarFile(eventInfoRecords) {
        // Convert records to lines; join; flatten into a single array
        const eventLines = [].concat(eventInfoRecords.map(createEventSection)).flat();
        const calendarEvent = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//WaniCalendar//NONSGML Event//EN",
            ...eventLines,
            "END:VCALENDAR"
        ].map(foldLine).join("\r\n");

        // This seems to be the same trick that FileSaver.js uses;
        // it looks bad but I don't think there's a cleaner web API for the task
        // "download a Blob to the user's computer as a named file."
        const calendarBlob = new Blob([calendarEvent], { type: "text/calendar" });
        const calendarUrl = URL.createObjectURL(calendarBlob);
        const downloadLink = document.createElement("a");
        downloadLink.href = calendarUrl;

        // Put today’s date in the resulting filename for convenience
        const dateNow = new Date();
        const dateString = `${dateNow.getFullYear()}-${dateNow.getMonth()}-${dateNow.getDate()}`
        downloadLink.download = `wanicalendar-study-${dateString}.ics`;
        downloadLink.click();
    }

// Code from the `ics` node.js package reproduced below:

/*ISC License

Copyright 2023 adamgibbons

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.*/


    // from `ics` node.js library; fold content line according to iCal format
    function foldLine(line) {
        const parts = [];
        let length = 75;
        while (line.length > length) {
            parts.push(line.slice(0, length));
            line = line.slice(length);
            length = 74;
        }
        parts.push(line);
        return parts.join('\r\n\t');
    }

    // from `ics` node.js library; date to ics-format datetime
    function formatDate(date) {
        const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
        return [
            date.getFullYear(),
            pad(date.getMonth() + 1),
            pad(date.getDate()),
            "T",
            pad(date.getHours()),
            pad(date.getMinutes()),
            pad(date.getSeconds())
        ].join("");
    }
})();