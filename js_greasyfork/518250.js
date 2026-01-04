// ==UserScript==
// @name         Civitai Date Range Picker
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Civitai date range picker and update URL with selected range
// @author       You
// @match        https://*civitai.com/search/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518250/Civitai%20Date%20Range%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/518250/Civitai%20Date%20Range%20Picker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Wait until the DOM is fully loaded
    function waitForElement(selector, callback, interval = 100, timeout = 5000) {
        const startTime = Date.now();
        const timer = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(timer);
                callback(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(timer);
                console.error(`Timeout: Could not find element ${selector}`);
            }
        }, interval);
    }

    // Function to load an external script
    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        document.head.appendChild(script);
    }

    // Function to load an external stylesheet
    function loadStyle(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    // Function to get query parameters from the URL
    function getQueryParam(key) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(key);
    }

    // Function to update the query parameter in the URL and navigate
    function setQueryParam(key, value) {
        const url = new URL(window.location.href);
        url.searchParams.set(key, value);
        window.location.href = url.toString();
    }

    // Parse the `lastVersionAt` parameter to pre-fill the picker
    function parseLastVersionAt() {
        const param = getQueryParam('lastVersionAt');
        if (!param) return null;

        const [startTimestamp, endTimestamp] = param.split(':').map(Number);
        if (startTimestamp && endTimestamp) {
            return [new Date(startTimestamp), new Date(endTimestamp)];
        }
        return null;
    }

    // Initialize the date range picker
    function initializeDateRangePicker() {
        const startInput = document.querySelector('input[name="start"]');
        const endInput = document.querySelector('input[name="end"]');

        if (!startInput || !endInput) {
            console.error('Start or End input not found!');
            return;
        }

        // Hide the original date pickers
        startInput.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        endInput.parentElement.parentElement.parentElement.parentElement.style.display = 'none';

        // Create a new date range picker input
        const dateRangeInput = document.createElement('input');
        dateRangeInput.setAttribute('type', 'text');
        dateRangeInput.setAttribute('placeholder', 'Select Date Range');
        dateRangeInput.style.width = '95%';
        dateRangeInput.style.padding = '10px';
        dateRangeInput.style.margin = '10px 10px 0';
        dateRangeInput.style.border = '1px solid #ccc';
        dateRangeInput.style.borderRadius = '4px';

        // Insert the new date range picker after the hidden inputs
        startInput.parentElement.parentElement.parentElement.parentElement.parentElement.appendChild(dateRangeInput);

        // Pre-select the date range based on the URL query parameter
        const preselectedDates = parseLastVersionAt();

        // Initialize Flatpickr on the new input
        flatpickr(dateRangeInput, {
            mode: 'range',
            dateFormat: 'Y-m-d',
            defaultDate: preselectedDates, // Set the pre-selected range
            onChange: function (selectedDates) {
                if (selectedDates.length === 2) {
                    const [startDate, endDate] = selectedDates;
                    const startTimestamp = startDate.getTime(); // UNIX timestamp (ms)
                    const endTimestamp = endDate.getTime(); // UNIX timestamp (ms)
                    const newLastVersionAt = `${startTimestamp}:${endTimestamp}`;

                    // Update the URL and navigate
                    setQueryParam('lastVersionAt', newLastVersionAt);
                }
            },
        });
    }

    // Load Flatpickr library and stylesheet, then initialize when ready
    loadStyle('https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css');
    loadScript('https://cdn.jsdelivr.net/npm/flatpickr', () => {
        waitForElement('input[name="start"]', initializeDateRangePicker);
    });
})();
