// ==UserScript==
// @name         Lu.ma Add to Calendar Button (Fixed Year)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds an "Add to Calendar" button below section 1 on Lu.ma event pages with correct year handling
// @author
// @match        https://lu.ma/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lu.ma
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511401/Luma%20Add%20to%20Calendar%20Button%20%28Fixed%20Year%29.user.js
// @updateURL https://update.greasyfork.org/scripts/511401/Luma%20Add%20to%20Calendar%20Button%20%28Fixed%20Year%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCalendarButton() {
        // Check if the button is already added
        if (document.querySelector('#add-to-calendar-button')) {
            return;
        }

        // Locate Section 1 for both layouts
        var section1 = document.querySelector('.top-card') || document.querySelector('.top-wrapper');

        if (!section1) {
            console.log('Section 1 not found.');
            return;
        }

        // Extract event details
        var eventTitle = '';
        var eventStart = '';
        var eventEnd = '';
        var eventLocation = '';
        var eventDescription = '';

        // Get event title
        var titleElement = section1.querySelector('h1.title');
        eventTitle = titleElement ? titleElement.textContent.trim() : '';

        // Get date and time
        var dateTimeRow = null;
        var iconRows = section1.querySelectorAll('.icon-row');
        if (iconRows.length >= 1) {
            dateTimeRow = iconRows[0];
        }

        if (dateTimeRow) {
            var dateTextElement = dateTimeRow.querySelector('.title');
            var dateText = dateTextElement ? dateTextElement.textContent.trim() : '';

            var timeTextElement = dateTimeRow.querySelector('.desc');
            var timeText = timeTextElement ? timeTextElement.textContent.trim() : '';

            // Parse date and time using improved function
            var dateObj = parseDateTime(dateText, timeText);
            if (dateObj) {
                eventStart = dateObj.start;
                eventEnd = dateObj.end;
            }
        }

        // Get event location
        eventLocation = getEventLocation();

        // Get event description
        eventDescription = getEventDescription();

        // Now, create the "Add to calendar" button and add it below section1
        insertCalendarButton();

        // Functions
        function parseDateTime(dateText, timeText) {
            // Improved parsing with regular expressions
            // Example dateText: 'Thursday, October 3'
            // Example timeText: '8:30 AM - 8:00 PM'

            // Extract month and day using regex
            var dateRegex = /([A-Za-z]+)\s+(\d{1,2})/;
            var dateMatch = dateText.match(dateRegex);
            if (!dateMatch) {
                console.log('Date parsing failed.');
                return null;
            }

            var month = dateMatch[1];
            var day = parseInt(dateMatch[2], 10);

            // Extract times using regex
            var timeRegex = /(\d{1,2}:\d{2}\s?[APMapm]{2})\s*-\s*(\d{1,2}:\d{2}\s?[APMapm]{2})/;
            var timeMatch = timeText.match(timeRegex);
            if (!timeMatch) {
                console.log('Time parsing failed.');
                return null;
            }

            var startTimeStr = timeMatch[1].toUpperCase();
            var endTimeStr = timeMatch[2].toUpperCase();

            // Get the current year
            var currentYear = new Date().getFullYear();

            // Construct start and end Date objects
            var startDate = new Date(`${month} ${day}, ${currentYear} ${startTimeStr}`);
            var endDate = new Date(`${month} ${day}, ${currentYear} ${endTimeStr}`);

            // Handle cases where the event ends on the next day
            if (endDate < startDate) {
                endDate.setDate(endDate.getDate() + 1);
            }

            // Check if Date objects are valid
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                console.log('Invalid Date objects:', startDate, endDate);
                return null;
            }

            // Format as YYYYMMDDTHHmmSSZ using toISOString()
            var startISO = formatDateToICS(startDate);
            var endISO = formatDateToICS(endDate);

            return {
                start: startISO,
                end: endISO
            };
        }

        function formatDateToICS(date) {
            // Format date to YYYYMMDDTHHmmSSZ using toISOString()
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        }

        function padZero(num) {
            return num < 10 ? '0' + num : num;
        }

        function getEventLocation() {
            // Try to get full address from Location content-card
            var address = getFullAddress();
            if (address) {
                return address;
            } else {
                // Try to get location from section1
                var iconRows = section1.querySelectorAll('.icon-row');
                if (iconRows.length >= 2) {
                    var locationRow = iconRows[1];
                    var locationTitleElement = locationRow.querySelector('.title');
                    var locationTitle = locationTitleElement ? locationTitleElement.textContent.trim() : '';
                    var locationDescElement = locationRow.querySelector('.desc');
                    var locationDesc = locationDescElement ? locationDescElement.textContent.trim() : '';
                    if (locationTitle && locationTitle !== 'Register to See Address') {
                        return locationTitle + ', ' + locationDesc;
                    } else {
                        return locationDesc;
                    }
                }
            }
            return '';
        }

        function getFullAddress() {
            var contentCards = document.querySelectorAll('.content-card');
            for (var i = 0; i < contentCards.length; i++) {
                var card = contentCards[i];
                var titleLabel = card.querySelector('.title-label, .title-label.text-tinted.fs-sm');
                if (titleLabel && titleLabel.textContent.trim() === 'Location') {
                    // We have found the Location card
                    // Now extract the address
                    var addressElement = card.querySelector('.cursor-copy .text-tinted.fs-sm') || card.querySelector('.cursor-copy .text-tinted.fs-sm.mt-1');
                    var address = addressElement ? addressElement.textContent.trim() : '';
                    if (address) {
                        return address;
                    } else {
                        // Sometimes the location is hidden
                        var descElement = card.querySelector('.text-tinted.fs-sm.mt-1');
                        address = descElement ? descElement.textContent.trim() : '';
                        if (address) {
                            return address;
                        }
                    }
                }
            }
            return '';
        }

        function getEventDescription() {
            var contentCards = document.querySelectorAll('.content-card');
            for (var i = 0; i < contentCards.length; i++) {
                var card = contentCards[i];
                var titleLabel = card.querySelector('.title-label, .title-label.text-tinted.fs-sm');
                if (titleLabel && titleLabel.textContent.trim() === 'About Event') {
                    // Found About Event card
                    var descriptionElement = card.querySelector('.mirror-content');
                    if (descriptionElement) {
                        return descriptionElement.innerText.trim();
                    }
                }
            }
            return '';
        }

        function insertCalendarButton() {
            // Create the button
            var button = document.createElement('button');
            button.textContent = 'Add to Calendar';
            button.style.marginTop = '10px';
            button.className = 'btn luma-button flex-center small light solid variant-color-light full-width no-icon';
            button.id = 'add-to-calendar-button';

            // Build the Google Calendar URL
            var calendarUrl = buildGoogleCalendarUrl();

            // Set up click event
            button.addEventListener('click', function() {
                window.open(calendarUrl, '_blank');
            });

            // Insert the button below section1
            var parent = section1.parentNode;
            if (parent.classList.contains('top-wrapper') || parent.classList.contains('top-card')) {
                parent.insertBefore(button, section1.nextSibling);
            } else {
                section1.appendChild(button);
            }
        }

        function buildGoogleCalendarUrl() {
            var baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
            var url = baseUrl;

            if (eventTitle) {
                url += '&text=' + encodeURIComponent(eventTitle);
            }
            if (eventStart && eventEnd) {
                url += '&dates=' + eventStart + '/' + eventEnd;
            }
            if (eventLocation) {
                url += '&location=' + encodeURIComponent(eventLocation);
            }
            if (eventDescription) {
                url += '&details=' + encodeURIComponent(eventDescription);
            }
            return url;
        }

    }

    // Use MutationObserver to detect when the page has loaded the content
    var observer = new MutationObserver(function(mutations, observerInstance) {
        var section1 = document.querySelector('.top-card') || document.querySelector('.top-wrapper');
        if (section1) {
            addCalendarButton();
            observerInstance.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
