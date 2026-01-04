// ==UserScript==
// @name         My Script
// @namespace    myscript
// @version      1.0
// @description  Prompt for user info and copy to clipboard
// @match        https://indriver.lightning.force.com/*
// @match        https://podval.console3.com/*
// @connect      indriver.lightning.force.com
// @connect      podval.console3.com
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/464040/My%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/464040/My%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the dialog container element
    var dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.zIndex = '10000';
    dialog.style.background = 'white';
    dialog.style.border = '1px solid black';
    dialog.style.padding = '20px';
    dialog.style.display = 'none'; // hide the dialog by default

    // Create the draggable button element
var dragButton = document.createElement('button');
dragButton.textContent = 'Drag me';
dragButton.style.position = 'absolute';
dragButton.style.top = '0';
dragButton.style.right = '0';
dragButton.style.padding = '2px 4px'; // Adjust padding for a smaller button
dragButton.style.fontSize = '10px'; // Adjust font size for a smaller button
dragButton.style.background = 'lightgray';
dialog.appendChild(dragButton);


    // Add event listeners to make the dialog draggable
    var isDragging = false;
    var offset = {x: 0, y: 0};
    var handleDragStart = function(e) {
        isDragging = true;
        offset.x = e.clientX - dialog.offsetLeft;
        offset.y = e.clientY - dialog.offsetTop;
    };
    var handleDragEnd = function(e) {
        isDragging = false;
    };
    var handleDrag = function(e) {
        if (isDragging) {
            dialog.style.top = (e.clientY - offset.y) + 'px';
            dialog.style.left = (e.clientX - offset.x) + 'px';
        }
    };
    document.addEventListener('mousemove', handleDrag);
    dragButton.addEventListener('mousedown', handleDragStart);
    dragButton.addEventListener('mouseup', handleDragEnd);

    // Create the name input element
    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Incident type :';
    nameInput.style.display = 'block';
    nameInput.style.marginBottom = '10px';
    dialog.appendChild(nameInput);

    // Create the email input element
    var emailInput = document.createElement('input');
    emailInput.type = 'text:';
    emailInput.placeholder = 'The channel';
    emailInput.style.display = 'block';
    emailInput.style.marginBottom = '10px';
    dialog.appendChild(emailInput);

    // Create the phone input element
    var phoneInput = document.createElement('input');
    phoneInput.type = 'tel';
    phoneInput.placeholder = 'Date and time of the incident';
    phoneInput.style.display = 'block';
    phoneInput.style.marginBottom = '10px';
    dialog.appendChild(phoneInput);

    // Create the city input element
var cityInput = document.createElement('input');
cityInput.type = 'text';
cityInput.placeholder = 'City';
cityInput.style.display = 'block';
cityInput.style.marginBottom = '10px';
dialog.appendChild(cityInput);

// Create the driver ID input element
var driverIdInput = document.createElement('input');
driverIdInput.type = 'text';
driverIdInput.placeholder = 'Driver ID';
driverIdInput.style.display = 'block';
driverIdInput.style.marginBottom = '10px';
dialog.appendChild(driverIdInput);

// Create the passenger ID input element
var passengerIdInput = document.createElement('input');
passengerIdInput.type = 'text';
passengerIdInput.placeholder = 'Passenger ID';
passengerIdInput.style.display = 'block';
passengerIdInput.style.marginBottom = '10px';
dialog.appendChild(passengerIdInput);

// Create the order link input element
var orderLinkInput = document.createElement('input');
orderLinkInput.type = 'text';
orderLinkInput.placeholder = 'Order link';
orderLinkInput.style.display = 'block';
orderLinkInput.style.marginBottom = '10px';
dialog.appendChild(orderLinkInput);

// Create the appeal link input element
var appealLinkInput = document.createElement('input');
appealLinkInput.type = 'text';
appealLinkInput.placeholder = 'Appeal link';
appealLinkInput.style.display = 'block';
appealLinkInput.style.marginBottom = '10px';
dialog.appendChild(appealLinkInput);

// Create the detailed explanation textarea element
var detailedExplanationTextarea = document.createElement('textarea');
detailedExplanationTextarea.placeholder = 'Detailed explanation';
detailedExplanationTextarea.style.display = 'block';
detailedExplanationTextarea.style.marginBottom = '10px';
detailedExplanationTextarea.style.width = '100%';
    dialog.appendChild(detailedExplanationTextarea);

    // Create the Actions taken input element
var actionsTaken = document.createElement('input');
actionsTaken.type = 'text';
actionsTaken.placeholder = 'Actions taken';
actionsTaken.style.display = 'block';
actionsTaken.style.marginBottom = '10px';
dialog.appendChild(actionsTaken);

   // Add a function to save input values using GM_setValue
function saveToLocalStorage() {
    GM_setValue('Incident type', nameInput.value);
    GM_setValue('The channel', emailInput.value);
    GM_setValue('Date and time of the incident', phoneInput.value);
    GM_setValue('city', cityInput.value);
    GM_setValue('driverId', driverIdInput.value);
    GM_setValue('passengerId', passengerIdInput.value);
    GM_setValue('orderLink', orderLinkInput.value);
    GM_setValue('appealLink', appealLinkInput.value);
    GM_setValue('detailedExplanation', detailedExplanationTextarea.value);
    GM_setValue('actionsTakeninput', actionsTaken.value);
}

// Add a function to load input values using GM_getValue
function loadFromLocalStorage() {
    nameInput.value = GM_getValue('Incident type') || '';
    emailInput.value = GM_getValue('The channel') || '';
    phoneInput.value = GM_getValue('Date and time of the incident') || '';
    cityInput.value = GM_getValue('city') || '';
    driverIdInput.value = GM_getValue('driverId') || '';
    passengerIdInput.value = GM_getValue('passengerId') || '';
    orderLinkInput.value = GM_getValue('orderLink') || '';
    appealLinkInput.value = GM_getValue('appealLink') || '';
    detailedExplanationTextarea.value = GM_getValue('detailedExplanation') || '';
   actionsTaken.value = GM_getValue('actionsTakeninput') || '';
}

// Add event listeners to save the input values when they are changed
nameInput.addEventListener('input', saveToLocalStorage);
emailInput.addEventListener('input', saveToLocalStorage);
phoneInput.addEventListener('input', saveToLocalStorage);
cityInput.addEventListener('input', saveToLocalStorage);
driverIdInput.addEventListener('input', saveToLocalStorage);
passengerIdInput.addEventListener('input', saveToLocalStorage);
orderLinkInput.addEventListener('input', saveToLocalStorage);
appealLinkInput.addEventListener('input', saveToLocalStorage);
detailedExplanationTextarea.addEventListener('input', saveToLocalStorage);
actionsTaken.addEventListener('input', saveToLocalStorage);

// Load the input values from localStorage when the script loads
loadFromLocalStorage();

    // Create the copy button
    var copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.style.marginTop = '10px';
    copyButton.addEventListener('click', function() {
        var output = 'Report\n' + '\nIncident type: ' + nameInput.value + '\n-----------------' + '\nThe channel through which it was reported: ' + emailInput.value + '\nDate and time of the incident: ' + phoneInput.value + '\nCity: ' + cityInput.value + '\n-----------------' + '\nDriver ID: ' + driverIdInput.value + '\nPassenger ID: ' + passengerIdInput.value + '\n-----------------' + '\nOrder link: ' + orderLinkInput.value + '\nAppeal link: ' + appealLinkInput.value + '\n-----------------' + '\nDetailed explanation: ' + detailedExplanationTextarea.value + '\nActions Taken: ' + actionsTaken.value + '\n-----------------' ;
                GM_setClipboard(output);
        alert('Copied to clipboard!');
    });
    dialog.appendChild(copyButton);

    // Create the clear button
var clearButton = document.createElement('button');
clearButton.textContent = 'Clear';
clearButton.style.marginTop = '10px';
clearButton.addEventListener('click', function() {
    // Reset the input values
    nameInput.value = '';
    emailInput.value = '';
    phoneInput.value = '';
    cityInput.value = '';
    driverIdInput.value = '';
    passengerIdInput.value = '';
    orderLinkInput.value = '';
    appealLinkInput.value = '';
    detailedExplanationTextarea.value = '';
    actionsTaken.value = '';

    // Save the cleared values to sync across websites
    saveToLocalStorage();
});
dialog.appendChild(clearButton);

// Create the refresh button
var refreshButton = document.createElement('button');
refreshButton.textContent = 'Refresh';
refreshButton.style.marginTop = '10px';
refreshButton.style.marginLeft = '10px';
refreshButton.addEventListener('click', function() {
    // Refresh the dialog content by loading the values from storage
    loadFromLocalStorage();
});
dialog.appendChild(refreshButton);


    // Append the dialog to the body
    document.body.appendChild(dialog);

    // Create the toggle button
    var toggleButton = document.createElement('button');
    toggleButton.textContent = 'Report';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '20px';
    toggleButton.style.right = '20px';
    toggleButton.style.zIndex = '9999';
    toggleButton.addEventListener('click', function() {
        if (dialog.style.display === 'none') {
            dialog.style.display = 'block';
        } else {
            dialog.style.display = 'none';
        }
    });
    document.body.appendChild(toggleButton);
})();

