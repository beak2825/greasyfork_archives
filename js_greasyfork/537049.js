// ==UserScript==
// @name Enhanced RSROC Events Calendar
// @namespace http://tampermonkey.net/
// @version 0.8
// @description : Extract event details and display them on the calendar page
// @author Cheng Hsien Tsou
// @match https://www.rsroc.org.tw/action/*
// @match https://www.rsroc.org.tw/action/actions_onlinedetail.asp*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537049/Enhanced%20RSROC%20Events%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/537049/Enhanced%20RSROC%20Events%20Calendar.meta.js
// ==/UserScript==

/*
這個script使用來擷取RSROC網站上的活動資訊，
並將教育積分時數顯示在活動頁面上。
產生google calendar的連結，
並在滑鼠懸停時顯示活動內容和聯絡資訊的tooltip。
*/


// Immediately-invoked function expression (IIFE) to encapsulate the script
(function() {
    'use strict';

    /**
     * Helper function to extract text content from a table cell based on its header.
     * @param {Document} doc - The DOM document to query (can be `document` for current page or a parsed HTML document).
     * @param {string} headerText - The text content of the `<th>` element to match.
     * @param {string} selector - CSS selector for the table rows to search within.
     * @param {boolean} isHtml - If true, returns innerHTML; otherwise, returns innerText.
     * @returns {string} The trimmed text content of the corresponding `<td>` or an empty string if not found.
     */
    function getTableCellText(doc, headerText, selector = '.articleContent table tr', isHtml = false) {
        const rows = doc.querySelectorAll(selector);
        for (const row of rows) {
            const th = row.querySelector('th');
            // Check if the header text includes the target headerText
            if (th && th.innerText.includes(headerText)) {
                const td = row.querySelector('td');
                if (td) {
                    return isHtml ? td.innerHTML.trim() : td.innerText.trim();
                }
            }
        }
        return '';
    }

    /**
     * Extracts event details from a given Document object.
     * This function consolidates the logic for fetching details from both the current page
     * and asynchronously fetched event pages.
     * @param {Document} doc - The DOM document to extract details from.
     * @returns {object} An object containing extracted event details.
     */
    function extractEventDetailsFromDocument(doc) {
        const tableData = new Map();
        const rows = doc.querySelectorAll('.articleContent table tr');
        for (const row of rows) {
            const th = row.querySelector('th');
            const td = row.querySelector('td');
            if (th && td) {
                tableData.set(th.innerText.trim(), td);
            }
        }

        const getDetail = (headerText, isHtml = false) => {
            for (const [key, value] of tableData.entries()) {
                if (key.includes(headerText)) {
                    return isHtml ? value.innerHTML.trim() : value.innerText.trim();
                }
            }
            return '';
        };

        let educationPoints = getDetail('教育積點');
        // Remove specific redundant text from education points
        if (educationPoints) {
            educationPoints = educationPoints.replace('放射診斷科專科醫師', '').trim();
        }

        const recognizedHours = getDetail('認定時數');
        const eventDateTime = getDetail('活動日期');
        const eventLocation = getDetail('活動地點');
        // Get event content (can be HTML)
        let eventContent = getDetail('活動內容', true);
        // Get event description (can be HTML)
        const eventDescription = getDetail('活動說明', true);
        const contactInfo = getDetail('聯絡資訊');
        const eventOrganizer = getDetail('主辦單位'); // Extract organizer explicitly

        // Combine event content and description if both exist and are different
        // This addresses the user's request to merge "活動說明" with "活動內容".
        if (eventContent && eventDescription && eventContent !== eventDescription) {
            eventContent = `${eventContent}<br><br>${eventDescription}`;
        } else if (!eventContent && eventDescription) {
            // If only description exists, use it as content
            eventContent = eventDescription;
        }

        let eventTitle = '';
        const caption = doc.querySelector('.tableContent caption');
        if (caption) {
            eventTitle = caption.innerText.trim();
        } else {
            // Fallback for event title if caption is not found, use the extracted organizer
            eventTitle = eventOrganizer;
        }
        // Default title if no title is found
        if (!eventTitle) {
            eventTitle = 'Event';
        }

        // Remove patterns like (digits) from the event title
        eventTitle = eventTitle.replace(/\(\d+\)/g, '').trim();

        return { educationPoints, recognizedHours, eventDateTime, eventLocation, eventTitle, eventContent, contactInfo, eventOrganizer };
    }

    /**
     * Fetches event details from a given URL by making an asynchronous request.
     * @param {string} url - The URL of the event page.
     * @returns {Promise<object>} A promise that resolves to an object containing event details.
     */
    async function fetchEventDetails(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return extractEventDetailsFromDocument(doc);
        } catch (error) {
            console.error('Error fetching event details:', error);
            // Return default values in case of an error
            return {
                educationPoints: 'N/A',
                recognizedHours: 'N/A',
                eventDateTime: '',
                eventLocation: '',
                eventTitle: 'Event',
                eventContent: '',
                contactInfo: ''
            };
        }
    }

    /**
     * Formats a date and time string into the Google Calendar URL format.
     * Expected format: YYYY/MM/DD　星期X　HH:MM ~ HH:MM
     * Google Calendar format: YYYYMMDDTHHMMSS/YYYYMMDDTHHMMSS
     * @param {string} dateTimeString - The date and time string to format.
     * @returns {string|null} The formatted date string or null if the format doesn't match.
     */
    function formatGoogleCalendarDate(dateTimeString) {
        const parts = dateTimeString.match(/(\d{4})\/(\d{2})\/(\d{2}).*?(\d{2}):(\d{2})\s*~*\s*(\d{0,2})*:*(\d{0,2})/);
        if (!parts) return null;

        const year = parts[1];
        const month = parts[2];
        const day = parts[3];
        const startHour = parts[4];
        const startMinute = parts[5];
        const endHour = parts[6] || startHour; // Assume same hour if end hour is missing
        const endMinute = parts[7] || startMinute; // Assume same minute if end minute is missing

        const start = `${year}${month}${day}T${startHour}${startMinute}00`;
        const end = `${year}${month}${day}T${endHour}${endMinute}00`;

        return `${start}/${end}`;
    }

    /**
     * Generates a Google Calendar URL based on event details.
     * @param {object} details - An object containing event details.
     * @param {string} originalUrl - The original URL of the event page.
     * @returns {string|null} The Google Calendar URL or null if date formatting fails.
     */
    function generateGoogleCalendarUrl(details, originalUrl) {
        const googleCalendarDate = formatGoogleCalendarDate(details.eventDateTime);
        if (!googleCalendarDate) return null;

        // Construct the details string for the Google Calendar event
        const calendarDetails =
            `時間: ${details.eventDateTime}\n` +
            `地點: ${details.eventLocation}\n` +
            `主辦單位: ${details.eventOrganizer || 'N/A'}\n` + // Added organizer field
            `教育積點: ${details.educationPoints}\n` +
            `認定時數: ${details.recognizedHours}\n` +
            `活動內容: ${details.eventContent}\n\n` + // This now includes merged content/description
            `聯絡資訊: ${details.contactInfo}\n\n` +
            `原始連結: ${originalUrl}`;

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(details.eventTitle)}&dates=${googleCalendarDate}&details=${encodeURIComponent(calendarDetails)}&location=${encodeURIComponent(details.eventLocation)}`;
    }

    /**
     * Adds a Google Calendar link to the event detail page.
     * This function runs when the user is on a specific event detail page.
     */
    function addGoogleCalendarLinkToDetailPage() {
        // Extract details from the current document
        const details = extractEventDetailsFromDocument(document);
        const tableContent = document.querySelector('.tableContent'); // Get the table containing the caption

        if (tableContent && details.eventDateTime) {
            const googleCalendarLinkHref = generateGoogleCalendarUrl(details, window.location.href);
            if (googleCalendarLinkHref) {
                const googleCalendarLink = document.createElement('a');
                googleCalendarLink.href = googleCalendarLinkHref;
                googleCalendarLink.target = '_blank';
                googleCalendarLink.innerText = '📅 加入 Google 日曆'; // Button text
                // Apply styling for the link
                googleCalendarLink.style.display = 'block';
                googleCalendarLink.style.marginTop = '10px';
                googleCalendarLink.style.padding = '8px 12px';
                googleCalendarLink.style.backgroundColor = '#4285F4';
                googleCalendarLink.style.color = 'white';
                googleCalendarLink.style.textDecoration = 'none';
                googleCalendarLink.style.borderRadius = '4px';
                googleCalendarLink.style.width = 'fit-content';
                googleCalendarLink.style.fontWeight = 'bold';

                // Insert the link after the table containing the caption
                tableContent.parentNode.insertBefore(googleCalendarLink, tableContent.nextSibling);
            }
        }
    }

    /**
     * Main function to add event details and Google Calendar links to the calendar listing page.
     * This function runs when the user is on the main calendar listing page.
     */
    async function addEventDetailsToCalendarPage() {
        const eventLinks = document.querySelectorAll('.eventLink');

        // Create a single tooltip element to be reused
        const tooltip = document.createElement('div');
        tooltip.style.cssText = `
            position: absolute;
            background-color: #fff;
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 1000;
            display: none;
            font-size: 0.9em;
            color: #333;
            max-width: 300px;
            word-wrap: break-word;
            pointer-events: none; /* Allows clicks to pass through to elements behind the tooltip */
        `;
        document.body.appendChild(tooltip);

        // Iterate over each event link on the page
        for (const link of eventLinks) {
            const url = link.href;
            const eventDiv = link.querySelector('div.event');

            // Clean the visible text of the eventDiv by removing patterns like (digits)
            if (eventDiv) {
                eventDiv.innerText = eventDiv.innerText.replace(/\(\d+\)/g, '').trim();
            }

            // Fetch detailed information for each event
            const details = await fetchEventDetails(url);

            // Store fetched details as dataset attributes on the eventDiv for easy access during hover
            eventDiv.dataset.eventContent = details.eventContent;
            eventDiv.dataset.contactInfo = details.contactInfo;
            eventDiv.dataset.eventTitle = details.eventTitle;
            eventDiv.dataset.eventDateTime = details.eventDateTime;
            eventDiv.dataset.eventLocation = details.eventLocation;
            eventDiv.dataset.educationPoints = details.educationPoints;
            eventDiv.dataset.recognizedHours = details.recognizedHours;
            eventDiv.dataset.eventOrganizer = details.eventOrganizer; // Store organizer

            // Display education points and recognized hours if available
            if (details.educationPoints !== 'N/A' || details.recognizedHours !== 'N/A' || details.eventDateTime) {
                const moreInfoDiv = document.createElement('div');
                moreInfoDiv.classList.add('moreinfo');
                moreInfoDiv.style.fontSize = '0.8em';
                moreInfoDiv.style.color = 'gray';
                moreInfoDiv.innerHTML = `${details.educationPoints}<br/>時數: ${details.recognizedHours}`;

                // Add Google Calendar icon link if event date/time is available
                if (details.eventDateTime) {
                    const googleCalendarLinkHref = generateGoogleCalendarUrl(details, url);
                    if (googleCalendarLinkHref) {
                        const googleCalendarLink = document.createElement('a');
                        googleCalendarLink.href = googleCalendarLinkHref;
                        googleCalendarLink.target = '_blank';
                        googleCalendarLink.innerText = '📅'; // Calendar icon
                        googleCalendarLink.style.marginLeft = '5px';
                        moreInfoDiv.appendChild(googleCalendarLink);
                    }
                }

                eventDiv.appendChild(moreInfoDiv);
            }

            // Add hover event listeners to show/hide the tooltip
            eventDiv.addEventListener('mouseover', (event) => {
                // Retrieve details from dataset attributes
                let content = eventDiv.dataset.eventContent || '無活動內容';
                // Replace HTML break tags and non-breaking spaces with newlines for tooltip readability
                content = content.replace(/<br\s*\/?>/g, '\n').replace(/&nbsp;/g, ' ');
                const contact = eventDiv.dataset.contactInfo || '無聯絡資訊';
                const dateTime = eventDiv.dataset.eventDateTime || '無活動時間';
                const location = eventDiv.dataset.eventLocation || '無活動地點';

                // Populate tooltip with event details
                tooltip.innerHTML =
                    `<strong>時間:</strong><br>${dateTime}<br><br>` +
                    `<strong>地點:</strong><br>${location}<br><br>` +
                    `<strong>主辦單位:</strong><br>${eventDiv.dataset.eventOrganizer || 'N/A'}<br><br>` + // Added organizer to tooltip
                    `<strong>教育積點:</strong><br>${eventDiv.dataset.educationPoints || '無教育積點'}<br><br>` +
                    `<strong>認定時數:</strong><br>${eventDiv.dataset.recognizedHours || '無認定時數'}<br><br>` +
                    `<strong>活動內容:</strong><br>${content}<br><br>` + // This now includes merged content/description
                    `<strong>聯絡資訊:</strong><br>${contact}`;

                // Position the tooltip relative to the hovered element
                const rect = event.target.getBoundingClientRect();
                tooltip.style.left = `${rect.left + window.scrollX}px`;
                tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
                tooltip.style.display = 'block'; // Show the tooltip
            });

            eventDiv.addEventListener('mouseout', () => {
                tooltip.style.display = 'none'; // Hide the tooltip
            });
        }
    }

    // Run the appropriate function based on the current page URL
    window.addEventListener('load', () => {
        if (window.location.href.startsWith('https://www.rsroc.org.tw/action/actions_onlinedetail.asp')) {
            addGoogleCalendarLinkToDetailPage();
        } else if (window.location.href.startsWith('https://www.rsroc.org.tw/action/')) {
            addEventDetailsToCalendarPage();
        }
    });

})();
