// ==UserScript==
// @name           WP <-> CRM
// @description    Switch between WP and CRM
// @namespace      http://www.plus.net
// @version        1.2
// @include        *workplace.plus.net/customers/customerdetails/custdetails-new.html*
// @include        *workplace.plus.net/apps/customerdetails*
// @exclude        *workplace.plus.net/customers/view_all_transactions.html*
// @exclude        https://*.btwholesale.com/*
// @charset        UTF-8
// @author         Joseph Wilde (Updated by Rob Clayton)
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489643/WP%20%3C-%3E%20CRM.user.js
// @updateURL https://update.greasyfork.org/scripts/489643/WP%20%3C-%3E%20CRM.meta.js
// ==/UserScript==

// Array containing the names of viewers
var viewers = ['WP', 'CRM'];

// Variable to store the index of the current viewer
var viewer;

// Function to create the switch button
function createButton() {
    var button = document.createElement('section');
    // Set button attributes and styles
    button.id = 'C2k_CRM_Button';
    button.style.cssText = 'display: inline-block; height: 25px; line-height: 25px; padding: 4px 15px 5px; background-color: #870051; border-radius: 25px; margin: 10px; color: white; cursor: pointer; position: fixed; font-size: x-large; left: 80px; top: 60px; z-index: 1;';
    // Set button label based on the current viewer
    button.innerHTML = '<b>->' + viewers[Math.abs(viewer - 1)] + '</b>';
    // Add event listener for button click
    button.addEventListener("click", switchViewer);
    return button;
}

// Function to determine the current viewer based on URL
function checkViewer() {
    // If URL contains 'custdetails-new', return 0 (WP), else if it contains 'customerdetails', return 1 (CRM), otherwise return null
    return window.location.href.includes('custdetails-new') ? 0 : (window.location.href.includes('customerdetails') ? 1 : null);
}

// Function to construct the URL for the next viewer
function getUrl(requiredViewer) {
    var url = window.location.href;
    switch (requiredViewer) {
        case 0:
            // URL for WP view
            return "https://workplace.plus.net/customers/customerdetails/custdetails-new.html?action=show_service&service_id=" + getSid(url);
        case 1:
            // URL for CRM view
            return "https://workplace.plus.net/apps/customerdetails/summary/" + getSid(url);
    }
}

// Function to extract service ID from URL based on the current viewer
function getSid(url) {
    switch (viewer) {
        case 0:
            // Extract service ID for WP view
            return url.split("service_id=")[1].split("&")[0];
        case 1:
            // Extract service ID for CRM view
            return url.split("/").pop().split('#')[0];
    }
}

// Function to switch between viewers
function switchViewer() {
    // Determine the index of the next viewer
    var nextViewer = Math.abs(viewer - 1);
    // Redirect to the URL of the next viewer
    window.location.href = getUrl(nextViewer);
}

// Function to add the switch button to the document
function addButtonToDocument() {
    var button = createButton();
    document.body.insertBefore(button, document.body.firstChild);
}

// Initialize the current viewer
viewer = checkViewer();
// If the viewer is not null, add the switch button to the document
if (viewer !== null) {
    addButtonToDocument();
}
