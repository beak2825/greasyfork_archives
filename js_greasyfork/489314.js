// ==UserScript==
// @name         Open account in CRM from ticket
// @namespace    http://your.namespace.com
// @version      1.0
// @description  Adds a button to open the customer's service ID in CRM from a ticket
// @author       Rob Clayton
// @match        https://workplace.plus.net/tickets/ticket_show.html?ticket_id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489314/Open%20account%20in%20CRM%20from%20ticket.user.js
// @updateURL https://update.greasyfork.org/scripts/489314/Open%20account%20in%20CRM%20from%20ticket.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract the service ID from the input tag
    function extractServiceID() {
        let inputElements = document.querySelectorAll('input[type="hidden"][name="service_id"]');
        if (inputElements.length > 0) {
            return inputElements[0].value;
        }
        return null;
    }

    // Function to handle opening the CRM URL with the service ID
    function openInCRM() {
        let serviceID = extractServiceID();
        if (serviceID) {
            let CRMURL = 'https://workplace.plus.net/apps/customerdetails/summary/' + serviceID;
            window.open(CRMURL, '_blank');
        } else {
            alert('Service ID not found!');
        }
    }

    // Create button
    let button = document.createElement('button');
    button.innerHTML = 'Open in CRM';
    button.style.margin = '10px auto';
    button.style.display = 'block';
    button.addEventListener('click', openInCRM);

    // Insert the button above the table
    let tableElement = document.querySelector('.cust_data');
    if (tableElement) {
        tableElement.parentNode.insertBefore(button, tableElement);
    }
})();
