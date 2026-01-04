// ==UserScript==
// @name         Moneybird - Copy start date to end date on time entry edit page
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Copy start date to end date on time entry edit page
// @website      https://greasyfork.org/en/scripts/463397-moneybird-copy-start-date-to-end-date-on-time-entry-edit-page
// @icon         https://assets2.sorryapp.com/brand_favicons/files/000/004/522/original/favicon-32.png
// @grant        none
// @author       pindab0ter
// @match        https://moneybird.com/*
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/463397/Moneybird%20-%20Copy%20start%20date%20to%20end%20date%20on%20time%20entry%20edit%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/463397/Moneybird%20-%20Copy%20start%20date%20to%20end%20date%20on%20time%20entry%20edit%20page.meta.js
// ==/UserScript==
    
(function () {
    'use strict';
    
    // Function to handle copying the start date to the end date
    function copyStartDateToEndDate() {
        const startedAtDateInput = document.getElementById('time_entry_started_at')
            ?.parentElement?.parentElement?.getElementsByClassName('date-picker__input')?.item(0);
        const endedAtDateInput = document.getElementById('time_entry_ended_at')
            ?.parentElement?.parentElement?.getElementsByClassName('date-picker__input')?.item(0);
    
        if (startedAtDateInput && endedAtDateInput?.value === "") {
            endedAtDateInput.value = startedAtDateInput.value;
        }
    }
    
    // Check if we’re on the time entry edit page
    function checkTimeEntryEditPage() {
        if (window.location.pathname.match(/time_entries\/\d+\/edit/)) {
            copyStartDateToEndDate();
        }
    }
    
    // Listen for changes using MutationObserver
    const observer = new MutationObserver(checkTimeEntryEditPage);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();