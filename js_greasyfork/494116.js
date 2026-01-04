// ==UserScript==
// @name         Hyperlink assistant CIS
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Fee Checker with additional functionalities (copy passenger ID and open link in a new page).
// @author       Created by Ahmed Esslaoui
// @author       Enhanced and updated by Mohamed Tarek
// @author       Idea of Noureddine Hassadi
// @match        https://cherdak.console3.com/*
// @icon         https://assets-global.website-files.com/643d3ad915724c257639f659/64709690d3b6b46a21ba91b0_favicon.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494116/Hyperlink%20assistant%20CIS.user.js
// @updateURL https://update.greasyfork.org/scripts/494116/Hyperlink%20assistant%20CIS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initScript() {
        if (document.getElementById('checkFeesButton')) {
            return;
        }

        function querySelectorWithValidatedFallbacks() {
            const selectors = [
                '#single-spa-application\\:\\@cherdak\\/new-order-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > div > div > dd:nth-child(17)',
                '#single-spa-application\\:\\@cherdak\\/new-order-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > div > div > dd:nth-child(13)',
                '#single-spa-application\\:\\@cherdak\\/new-order-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > div > div > dd:nth-child(11)'
            ];
            const invalidKeywords = ['cash', 'city_common_order_title_ride'];

            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    let content = element.textContent.trim();
                    if (invalidKeywords.some(keyword => content.toLowerCase().includes(keyword))) {
                        continue;
                    }
                    if (selectors.indexOf(selector) > 0 && !/^[0-9a-zA-Z-]+$/.test(content)) {
                        continue;
                    }
                    return element;
                }
            }
            return null;
        }

        const rideUUIDElement = querySelectorWithValidatedFallbacks();
        if (!rideUUIDElement) {
            console.log('Ride UUID not found or invalid.');
            return;
        }

        const driverIDSelector = '#single-spa-application\\:\\@cherdak\\/new-order-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div:nth-child(2) > div:nth-child(2) > div > div.styles__InfoWrapper-ioCrot.vJNBD > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > dd > a';
        const buttonPlacementSelector = '#single-spa-application\\:\\@cherdak\\/new-order-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div:nth-child(2) > div:nth-child(2) > div > div.styles__InfoWrapper-ioCrot.vJNBD > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > dt';

        const driverIDElement = document.querySelector(driverIDSelector);
        const buttonPlacementElement = document.querySelector(buttonPlacementSelector);

        if (driverIDElement && buttonPlacementElement) {
            const rideUUID = rideUUIDElement.textContent.trim();
            const driverID = driverIDElement.textContent.trim();

            // Create Check Fees button
            const checkFeesButton = document.createElement('button');
            checkFeesButton.id = 'checkFeesButton';
            checkFeesButton.textContent = 'Check Fees ➡';
            checkFeesButton.style = `
                padding: 10px 15px;
                height: 45px;
                border: none;
                border-radius: 5px;
                background: linear-gradient(90deg, rgba(167,233,47,1) 30%, rgba(70,252,180,1) 68%);
                color: black;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
                margin-top: 10px;
                margin-right: 10px; /* Add margin-right for spacing */
                transition: color 0.3s, box-shadow 0.3s;
            `;

            checkFeesButton.addEventListener('click', () => {
                const url = `https://cherdak.console3.com/mena/user-balance/user-balance-transaction?sourceUUID=${rideUUID}&userId=${driverID}`;
                window.open(url, '_blank').focus();
            });

            buttonPlacementElement.parentElement.insertBefore(checkFeesButton, buttonPlacementElement.nextSibling);

            // Create Copy Passenger ID icon
            const passengerIDElement = document.querySelector('.styles__Box-dwqAVh.dyuVLH .styles__UserLink-gSQWOx');
if (passengerIDElement) {
    const copyPassengerIDIcon = document.createElement('span');
    copyPassengerIDIcon.innerHTML = '&#128203;'; // Unicode for a clipboard icon
    copyPassengerIDIcon.style.cursor = 'pointer';
    copyPassengerIDIcon.title = 'Copy Passenger ID';
    copyPassengerIDIcon.style.fontSize = '24px'; // Increase icon size
    copyPassengerIDIcon.style.marginRight = '10px'; // Add margin-right for spacing
    copyPassengerIDIcon.addEventListener('click', () => {
        const passengerID = passengerIDElement.textContent.trim();
        navigator.clipboard.writeText(passengerID).then(() => {
            console.log('Passenger ID copied:', passengerID);
            localStorage.setItem('passengerID', passengerID); // Store the ID in local storage
        }).catch((error) => {
            console.error('Failed to copy Passenger ID:', error);
        });
    });

    passengerIDElement.parentElement.appendChild(copyPassengerIDIcon);
} else {
    console.log('Passenger ID element not found.');
}

            // Create Copy Driver ID icon
            const copyDriverIDIcon = document.createElement('span');
            copyDriverIDIcon.innerHTML = '&#128203;'; // Unicode for a clipboard icon
            copyDriverIDIcon.style.cursor = 'pointer';
            copyDriverIDIcon.title = 'Copy Driver ID';
            copyDriverIDIcon.style.fontSize = '24px'; // Increase icon size
            copyDriverIDIcon.style.marginRight = '10px'; // Add margin-right for spacing
            copyDriverIDIcon.addEventListener('click', () => {
                navigator.clipboard.writeText(driverID).then(() => {
                    console.log('Driver ID copied:', driverID);
                }).catch((error) => {
                    console.error('Failed to copy Driver ID:', error);
                });
            });
            driverIDElement.parentElement.appendChild(copyDriverIDIcon);

            // Create Open Link icon for Passenger
            if (passengerIDElement) {
                const openPassengerLinkIcon = document.createElement('a');
                openPassengerLinkIcon.href = `https://cherdak.console3.com/global/support-notification/notifications/create`; // URL without appending passengerID
                openPassengerLinkIcon.innerHTML = '&#128226;'; // Unicode for a push notification icon
                openPassengerLinkIcon.style.fontSize = '24px'; // Increase icon size
                openPassengerLinkIcon.style.marginRight = '10px'
                openPassengerLinkIcon.style.cursor = 'pointer';
                openPassengerLinkIcon.title = 'Passenger Push Link';
                openPassengerLinkIcon.target = '_blank'; // Open in a new tab
                openPassengerLinkIcon.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent the default behavior of opening the link
                    const passengerID = passengerIDElement.textContent.trim();
                    navigator.clipboard.writeText(passengerID).then(() => {
                        console.log('Passenger ID copied:', passengerID);
                        window.open(openPassengerLinkIcon.href, '_blank').focus(); // Open the link in a new tab after copying
                    }).catch((error) => {
                        console.error('Failed to copy Passenger ID:', error);
                    });
                });
                passengerIDElement.parentElement.appendChild(openPassengerLinkIcon);
                const lineBreak = document.createElement('hr');
                passengerIDElement.parentElement.appendChild(lineBreak);
                addPassengerPushHistoryLink(passengerIDElement.textContent.trim());
            } else {
                console.log('Passenger ID element not found.');
            }


            function addPassengerPushHistoryLink(passengerID) {
        const openPassengerHistoryLink = document.createElement('a');
        openPassengerHistoryLink.href = `https://cherdak.console3.com/global/support-notification/notifications?recipientId=${passengerID}`; // URL appending passenger ID
        openPassengerHistoryLink.innerHTML = '&#128337;'; // Unicode for a push notification icon
        openPassengerHistoryLink.style.fontSize = '24px'; // Increase icon size
        openPassengerHistoryLink.style.marginRight = '10px';
        openPassengerHistoryLink.style.cursor = 'pointer';
        openPassengerHistoryLink.title = 'Push History';
        openPassengerHistoryLink.target = '_blank'; // Open in a new tab
        openPassengerHistoryLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default behavior of opening the link
            window.open(openPassengerHistoryLink.href, '_blank').focus(); // Open the link in a new tab
        });
        const passengerIDElement = document.querySelector('.styles__Box-dwqAVh.dyuVLH .styles__UserLink-gSQWOx');
        passengerIDElement.parentElement.appendChild(openPassengerHistoryLink);
                 const lineBreak = document.createElement('hr');
                passengerIDElement.parentElement.appendChild(lineBreak);
    }

            // Create Open Link icon for Driver
            const openDriverLinkIcon = document.createElement('a');
            openDriverLinkIcon.href = `https://cherdak.console3.com/global/support-notification/notifications/create`; // URL
            openDriverLinkIcon.innerHTML = '&#128226;'; // Unicode for a push notification icon
            openDriverLinkIcon.style.fontSize = '24px'; // Increase icon size
            openDriverLinkIcon.style.marginRight = '10px'
            openDriverLinkIcon.style.cursor = 'pointer';
            openDriverLinkIcon.title = 'Driver Push Link';
            openDriverLinkIcon.target = '_blank'; // Open in a new tab
            openDriverLinkIcon.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent the default behavior of opening the link
                navigator.clipboard.writeText(driverID).then(() => {
                    console.log('Driver ID copied:', driverID);
                    window.open(openDriverLinkIcon.href, '_blank').focus(); // Open the link in a new tab after copying
                }).catch((error) => {
                    console.error('Failed to copy Driver ID:', error);
                });
            });
            driverIDElement.parentElement.appendChild(openDriverLinkIcon);
            const lineBreak = document.createElement('hr');
           driverIDElement.parentElement.appendChild(lineBreak);
            addDriverPushHistoryLink(driverID);

        } else {
            console.log('Driver ID or placement element not found.');
        }
    }
     function addDriverPushHistoryLink(driverID) {
        const openDriverHistoryLink = document.createElement('a');
        openDriverHistoryLink.href = `https://cherdak.console3.com/global/support-notification/notifications?recipientId=${driverID}`; // URL appending driver ID
        openDriverHistoryLink.innerHTML = '&#128337;'; // Unicode for a push notification icon
        openDriverHistoryLink.style.fontSize = '24px'; // Increase icon size
        openDriverHistoryLink.style.marginRight = '10px';
        openDriverHistoryLink.style.cursor = 'pointer';
        openDriverHistoryLink.title = 'Push History';
        openDriverHistoryLink.target = '_blank'; // Open in a new tab
        openDriverHistoryLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default behavior of opening the link
            window.open(openDriverHistoryLink.href, '_blank').focus(); // Open the link in a new tab
        });
        const driverIDElement = document.querySelector('#single-spa-application\\:\\@cherdak\\/new-order-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div:nth-child(2) > div:nth-child(2) > div > div.styles__InfoWrapper-ioCrot.vJNBD > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > dd > a');
        driverIDElement.parentElement.appendChild(openDriverHistoryLink);
         const lineBreak = document.createElement('hr');
           driverIDElement.parentElement.appendChild(lineBreak);
    }

  // Function to extract the user ID from the URL
function getUserIdFromUrl() {
    const url = window.location.href;
    const match = url.match(/\/users\/(\d+)/);
    return match ? match[1] : null;
}

// Function to create the support notification link
function createSupportNotificationLink(userId) {
    const supportNotificationUrl = `https://cherdak.console3.com/global/support-notification/notifications?recipientId=${userId}`;

    const popupContainer = document.createElement('div');
    popupContainer.id = 'supportNotificationPopup'; // Assign an ID to the popup container
    popupContainer.style.position = 'absolute';
    popupContainer.style.bottom = '0';
    popupContainer.style.backgroundColor = '#28a745'; // Green background color
    popupContainer.style.color = '#fff'; // White text color
    popupContainer.style.padding = '10px';
    popupContainer.style.border = '1px solid #ccc';
    popupContainer.style.borderRadius = '5px';
    popupContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    popupContainer.style.zIndex = '9999';
    popupContainer.style.width = '220px'; // Adjust the width as needed
    popupContainer.style.cursor = 'pointer';

    const link = document.createElement('a');
    link.href = supportNotificationUrl;
    link.target = '_blank'; // Open link in a new tab
    link.style.color = 'inherit'; // Inherit the text color
    link.style.textDecoration = 'none'; // Remove underline

    link.appendChild(popupContainer); // Append the popup container inside the link

    const linkText = document.createElement('span');
    linkText.textContent = 'Go to Push History'; // Text content
    popupContainer.appendChild(linkText); // Append the text inside the popup container

    // Append the link to the body
    document.body.appendChild(link);
}

// Function to check if the specified link element exists
function checkLinkExistence() {
    const linkElement = document.querySelector('[data-testid="Text-p"][color="brand-primary"][class="Box-sc-1xno7t3-0 krqUuz"]');
    if (!linkElement) {
        // If the link element doesn't exist, remove the popup container
        const popupContainer = document.getElementById('supportNotificationPopup');
        if (popupContainer) {
            popupContainer.parentNode.removeChild(popupContainer);
        }
    }
}
// Function to check for URL redirects
function checkUrlRedirect() {
    const currentUrl = window.location.href;
    const redirectPatternUsers = /\/users\/(\d+)/;
    const redirectPatternOrders = /\/orders/;

    const matchUsers = currentUrl.match(redirectPatternUsers);
    const matchOrders = currentUrl.match(redirectPatternOrders);

    if (matchUsers) {
        const userId = matchUsers[1];
        createSupportNotificationLink(userId);
    } else if (matchOrders && currentUrl.includes('/users/')) {
        const userId = getUserIdFromUrl();
        createSupportNotificationLink(userId);
    }
}



// Function to detect changes in specified elements
function detectElementChanges() {
    const targetElements = document.querySelectorAll('.styles__InfoWrapper-ioCrot'); // Select the target elements
    // Add event listeners to each target element
    targetElements.forEach(element => {
        element.addEventListener('change', () => {
            // Trigger the notification when a change is detected
            createSupportNotificationLink(getUserIdFromUrl());
        });
    });
}

// Check if the current URL starts with the desired pattern
const desiredUrlPattern = 'https://cherdak.console3.com/mena-egypt/new-order/users/';
if (window.location.href.startsWith(desiredUrlPattern)) {
    // Extract the user ID from the URL
    const userId = getUserIdFromUrl();
    if (userId) {
        createSupportNotificationLink(userId);
    }
}

// Check for URL redirects and element changes periodically
setInterval(checkUrlRedirect, 2000); // Check for redirects every 1 second
setInterval(detectElementChanges, 4000); // Check for element changes every 2 seconds
setInterval(checkLinkExistence, 2000); // Check link existence every 4 seconds


    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    initScript();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    setupMutationObserver();
function simulateMouseClick() {

    const kindRadioButtons = document.querySelectorAll('input[name="kind"]');
    const auditoryTypeRadioButtons = document.querySelectorAll('input[name="auditoryType"]');
    let isUserSelected = false;
    let isPopupSelected = false;


    kindRadioButtons.forEach(function(radioButton) {
        if (radioButton.value === 'popup' && !radioButton.checked && !isPopupSelected) {
            radioButton.click();
            isPopupSelected = true;
        }
    });


    auditoryTypeRadioButtons.forEach(function(radioButton) {
        if (radioButton.value === 'byUser' && !radioButton.checked && !isUserSelected) {
            radioButton.click();
            isUserSelected = true;
        } else if (radioButton.value === 'byCity' && radioButton.checked) {
            isUserSelected = false;
        }
    });
}


// Listen for changes in the DOM
const observer = new MutationObserver(function(mutationsList) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
            simulateMouseClick(); // Call the function to simulate a realistic mouse click
        }
    }
});

// Start observing changes in the document body
observer.observe(document.body, { childList: true, subtree: true, attributes: true });

// Initial simulation of mouse click on the "User IDs" radio button
simulateMouseClick();
    //Pasting Part of Code Companion Script
        function waitForInputField(selector, callback) {
        const checkInterval = setInterval(function() {
            const inputElement = document.querySelector(selector);
            if (inputElement) {
                clearInterval(checkInterval);
                callback(inputElement);
            }
        }, 400); // Increased interval for checking the input field
    }

    function simulateInput(inputElement, value) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        inputElement.focus();
        nativeInputValueSetter.call(inputElement, value);
        inputElement.dispatchEvent(new Event('input', {bubbles: true}));
        inputElement.dispatchEvent(new Event('change', {bubbles: true})); // Some frameworks listen for change event

        // This part attempts to trigger any final events that might signal user completion
        inputElement.blur();
        inputElement.focus();
    }

  function pasteClipboardData(inputElement) {
        function tryPaste() {
            if (!inputElement.value.trim()) {
                navigator.clipboard.readText().then(text => {
                    if (text.trim() && /\d{6,}/.test(text)) { // Check if clipboard content is a number with 6 or more digits
                        simulateInput(inputElement, text);
                    } else {
                        console.log("Clipboard content doesn't meet criteria. Not pasting.");
                    }
                }).catch(err => {
                    console.error('Clipboard access denied:', err);
                });
            }
        }

        setInterval(tryPaste, 10); // Attempt to paste every 10 milliseconds
    }

    window.addEventListener('load', function() {
        waitForInputField('input[name="audience.userIds"]', pasteClipboardData);
    });

})();