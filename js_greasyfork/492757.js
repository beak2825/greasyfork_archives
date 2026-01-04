// ==UserScript==
// @name         Filter Appointments by Status, Source, and User for leaders
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Filter appointments on the calendar by status, source, and user and reset each other's filters when a selection is made in one dropdown. Reapply filters when data updates.
// @author       Nathan Resinger
// @match        https://*.enabledplus.com/WebForms/AppointmentCalendar.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492757/Filter%20Appointments%20by%20Status%2C%20Source%2C%20and%20User%20for%20leaders.user.js
// @updateURL https://update.greasyfork.org/scripts/492757/Filter%20Appointments%20by%20Status%2C%20Source%2C%20and%20User%20for%20leaders.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    let statusFilterDropdown;
    let sourceFilterDropdown;
    let userFilterDropdown;
    let selectedStatusFilter = '';
    let selectedSourceFilter = '';
    let selectedUserFilter = '';
 
    function createStatusFilterDropdown() {
        const targetElement = document.querySelector('#tblHeader');
 
        if (!targetElement) {
            console.error('The controls container (#tblHeader) was not found.');
            return;
        }
 
        if (!statusFilterDropdown) {
            statusFilterDropdown = document.createElement('select');
            statusFilterDropdown.id = 'statusFilterDropdown';
            statusFilterDropdown.innerHTML = `
                <option value="">Status Filter</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Demo No Sale">Demo No Sale</option>
                <option value="Not Home">Not Home</option>
                <option value="No Demo">No Demo</option>
                <option value="Sale">Sale</option>
                <option value="Same Rep Resit">Same Rep Resit</option>
                <option value="Unassigned">Unassigned</option>
                <option value="Unconfirmed">Unconfirmed</option>
            `;
 
            statusFilterDropdown.addEventListener('change', () => {
                filterAppointments();
            });
 
            targetElement.prepend(statusFilterDropdown);
        }
    }
 
    function createSourceFilterDropdown() {
        const targetElement = document.querySelector('#tblHeader');
 
        if (!targetElement) {
            console.error('The controls container (#tblHeader) was not found.');
            return;
        }
 
        if (!sourceFilterDropdown) {
            sourceFilterDropdown = document.createElement('select');
            sourceFilterDropdown.id = 'sourceFilterDropdown';
            sourceFilterDropdown.innerHTML = `
                <option value="">Source Filter</option>
                <option value="Customer/Prospect Referral">Customer/Prospect Referral</option>
                <option value="Digital Media">Digital Media</option>
                <option value="Direct Email">Direct Email</option>
                <option value="Direct Mail">Direct Mail</option>
                <option value="Event Sweepstakes">Event Sweepstakes</option>
                <option value="Events">Events</option>
                <option value="Home Show">Home Show</option>
                <option value="Lead Aggregators">Lead Aggregators</option>
                <option value="Marriage Mail">Marriage Mail</option>
                <option value="Newspaper">Newspaper</option>
                <option value="Online Scheduler User">Online Scheduler User</option>
                <option value="Organic Web - Appt Request">Organic Web - Appt Request</option>
                <option value="PPC Web">PPC Web</option>
                <option value="Proximity Marketing">Proximity Marketing</option>
                <option value="Radio">Radio</option>
                <option value="Retail">Retail</option>
                <option value="Retail Sweepstakes">Retail Sweepstakes</option>
<option value="RSVP Event">RSVP Event</option>
                <option value="Social Media">Social Media</option>
                <option value="Television">Television</option>
                <option value="All Other Sources">All Other Sources</option>
            `;
 
            sourceFilterDropdown.addEventListener('change', () => {
                filterAppointments();
            });
 
            targetElement.prepend(sourceFilterDropdown);
        }
    }
 
    function createUserFilterDropdown() {
        const targetElement = document.querySelector('#tblHeader');
 
        if (!targetElement) {
            console.error('The controls container (#tblHeader) was not found.');
            return;
        }
 
        if (!userFilterDropdown) {
            userFilterDropdown = document.createElement('select');
            userFilterDropdown.id = 'userFilterDropdown';
            userFilterDropdown.innerHTML = `
                <option value="">User Filter</option>
                <option value="Ava Southland">Ava Southland</option>
                <option value="Alexander Vasquez">Alexander Vasquez</option>
                <option value="Biggy Wuol">Biggy Wuol</option>
                <option value="Blessing Alaka">Blessing Alaka</option>
                <option value="Ciera Watson">Ciera Watson</option>
                <option value="Eugenia Kagan">Eugenia Kagan</option>
                <option value="Fardowsa Hashi">Fardowsa Hashi</option>
                <option value="James Cavitt">James Cavitt</option>
                <option value="Jaylynn Garcia">Jaylynn Garcia</option>
                <option value="Jonathan Argueta">Jonathan Argueta</option>
                <option value="Joshua Basil">Joshua Basil</option>
                <option value="Kevin Kimball">Kevin Kimball</option>
                <option value="Landon Maurer">Landon Maurer</option>
                <option value="Olina Maurer">Olina Maurer</option>
                <option value="Sarah Bright">Sarah Bright</option>
                <option value="Sharon Magalona">Sharon Magalona</option>
            `;
 
            userFilterDropdown.addEventListener('change', () => {
                filterAppointments();
            });
 
            targetElement.prepend(userFilterDropdown);
        }
    }
 
    function filterAppointments() {
        selectedStatusFilter = statusFilterDropdown.value;
        selectedSourceFilter = sourceFilterDropdown.value;
        selectedUserFilter = userFilterDropdown.value;
 
        const appointmentContainers = document.querySelectorAll('#MainContentRoot_gvSchedules > tbody > tr > td > table > tbody > tr');
 
        appointmentContainers.forEach(container => {
            const containerText = container.textContent;
            const show =
                (selectedStatusFilter === '' || (selectedStatusFilter !== 'Status Filter' && containerText.includes(selectedStatusFilter))) &&
                (selectedSourceFilter === '' || (selectedSourceFilter === 'All Other Sources' || Array.from(container.querySelectorAll('td')).some(td => td.textContent.trim() === selectedSourceFilter))) &&
                (selectedUserFilter === '' || (selectedUserFilter === 'All Else' || containerText.includes(selectedUserFilter))) &&
                !(selectedStatusFilter === 'Sale' && containerText.includes('Demo No Sale'));
 
            container.closest('tr').style.display = show ? '' : 'none';
        });
    }
 
    createStatusFilterDropdown();
    createSourceFilterDropdown();
    createUserFilterDropdown();
 
    // Reset filters when page content changes
    function resetFilters() {
        filterAppointments();
    }
 
    window.addEventListener('load', () => {
        resetFilters();
 
        // Observe changes in the page content
        const observer = new MutationObserver(resetFilters);
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
