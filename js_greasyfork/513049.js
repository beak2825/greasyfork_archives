// ==UserScript==
// @name         Patient selector
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Always display the Patient Selector and Dispatch boxes and automatically select an Ambulance Officer if patient count exceeds 5.
// @author       Martyblyth
// @match        https://www.missionchief.co.uk/*
// @match        https://police.missionchief.co.uk/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/513049/Patient%20selector.user.js
// @updateURL https://update.greasyfork.org/scripts/513049/Patient%20selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if we are on the correct screen
    function isCorrectScreen() {
        const url = window.location.href;

        // Check if the URL matches the mission screen or other relevant screens
        if (url.includes('/missions/') || url.includes('/incidents/')) {
            return true; // Show boxes on these pages
        }

        // Alternatively, check for the presence of specific elements that only exist on the mission screen
        const missionElement = document.querySelector('#mission_general_info');
        if (missionElement) {
            return true; // Show boxes if the mission screen element is present
        }

        return false; // Do not show boxes on other screens
    }

    // Function to create and insert the white box and green Dispatch box
    function createWhiteBox() {
        // Check if we should display the boxes on this screen
        if (!isCorrectScreen()) {
            return; // Exit if the boxes should not be shown
        }

        var style = document.createElement('style');
        style.textContent = `
            #white-box1 {
                position: absolute;
                width: 4cm;
                height: 0.8cm;
                background-color: white;
                border: 2px solid black;
                top: 0.8cm;
                left: 19.3cm;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.5cm;
                color: black;
                font-family: Arial, sans-serif;
                cursor: pointer;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            #dispatch-box {
                position: absolute;
                width: 3cm;
                height: 0.8cm;
                background-color: green;
                border: 2px solid black;
                top: 0.8cm;
                left: 23.5cm;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.5cm;
                color: white;
                font-family: Arial, sans-serif;
                cursor: pointer;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        `;
        document.head.appendChild(style);

        // Create "Patient Selector" box
        var whiteBox = document.createElement('div');
        whiteBox.id = 'white-box1';
        whiteBox.textContent = 'Patient Selector';
        document.body.appendChild(whiteBox);

        // Create "Dispatch" box
        var dispatchBox = document.createElement('div');
        dispatchBox.id = 'dispatch-box';
        dispatchBox.textContent = 'Dispatch';
        document.body.appendChild(dispatchBox);

        // Add event listener to "Patient Selector" box to trigger the search for the <span> when clicked
        whiteBox.addEventListener('click', function() {
            fetchAndTriggerClick();
        });

        // Add event listener to "Dispatch" box to trigger a click on the <span> element
        dispatchBox.addEventListener('click', function() {
            triggerDispatchClick();
        });
    }

    // Function to find the "Patient" count from the <span> element
    function findPatientCount() {
        const patientElement = document.querySelector('span.badge.badge-default');
        if (patientElement) {
            const textContent = patientElement.textContent.trim();
            const numberMatch = textContent.match(/\d+/);
            return numberMatch ? parseInt(numberMatch[0], 10) : 0;
        }
        return 0;
    }

    // Function to trigger clicks based on the patient count
    function triggerClick(number) {
        const element = document.querySelector('a[search_attribute="Ambulance x 01"]');
        if (element) {
            for (let i = 0; i < number; i++) {
                setTimeout(() => {
                    element.click();
                }, i * 100);
            }
        } else {
            console.error('Element not found.');
        }
    }

    // Function to trigger a click on the Ambulance Officer if count exceeds 5
    function triggerAmbulanceOfficerClick() {
        const ambulanceOfficer = document.querySelector('a[search_attribute="Ambulance Officer"]');
        if (ambulanceOfficer) {
            ambulanceOfficer.click();  // Simulate click on the Ambulance Officer button
            console.log('Ambulance Officer selected');
        } else {
            console.error('Ambulance Officer button not found.');
        }
    }

    // Function to trigger a click on the dispatch arrow
    function triggerDispatchClick() {
        const dispatchArrow = document.querySelector('span.glyphicon.glyphicon-arrow-right');
        if (dispatchArrow) {
            dispatchArrow.click();
            console.log('Dispatch arrow clicked');
        } else {
            console.error('Dispatch arrow not found.');
        }
    }

    // Function to fetch the patient count and trigger clicks, including selecting the Ambulance Officer if needed
    function fetchAndTriggerClick() {
        var patientCount = findPatientCount();
        if (patientCount) {
            console.log('Patient count found:', patientCount);
            triggerClick(patientCount);

            // If patient count is more than 5, trigger an extra click for the Ambulance Officer
            if (patientCount > 5) {
                triggerAmbulanceOfficerClick();
            }
        } else {
            console.error('Patient count not found.');
        }
    }

    // Function to check if the screen is correct and create the boxes
    function checkScreenAndCreateBoxes() {
        if (isCorrectScreen()) {
            createWhiteBox(); // Create the boxes if we're on the correct screen
        }
    }

    window.addEventListener('load', checkScreenAndCreateBoxes);

})();
