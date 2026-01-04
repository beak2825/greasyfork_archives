// ==UserScript==
// @name         Filter Enabled+ Calendar for Leaders
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Filter appointments on the calendar by status, source, and user. Reapply filters when data updates.
// @author       Your worst nightmare
// @match        https://*.enabledplus.com/WebForms/AppointmentCalendar.aspx
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483984/Filter%20Enabled%2B%20Calendar%20for%20Leaders.user.js
// @updateURL https://update.greasyfork.org/scripts/483984/Filter%20Enabled%2B%20Calendar%20for%20Leaders.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function hideUnassignedAppointments() {
        const appointmentContainers = document.querySelectorAll('#MainContentRoot_gvSchedules > tbody > tr > td > table > tbody > tr');
        appointmentContainers.forEach(container => {
            if (container.textContent.includes('Unassigned')) {
                container.closest('tr').style.display = 'none';
            }
        });
    }

    // Hide appointments with the word "Unassigned"
    hideUnassignedAppointments();

    // Observe changes in the page content and reapply filter
    const observer = new MutationObserver(hideUnassignedAppointments);
    observer.observe(document.body, { childList: true, subtree: true });
})();
