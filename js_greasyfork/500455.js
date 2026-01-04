// ==UserScript==
// @name         IWRPG - Skilling - Add more info to estiamtes
// @namespace    http://tampermonkey.net/
// @version      2024-07-12
// @description  Adding level up and materials left timers 
// @author       Grotok
// @match        https://ironwoodrpg.com/*
// @icon         https://ironwoodrpg.com/assets/items/raw-bass.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500455/IWRPG%20-%20Skilling%20-%20Add%20more%20info%20to%20estiamtes.user.js
// @updateURL https://update.greasyfork.org/scripts/500455/IWRPG%20-%20Skilling%20-%20Add%20more%20info%20to%20estiamtes.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Function to add new rows
function addNewRow() {
    // Check if there's a button with the text "Estimates"
    var estimatesButton = Array.from(document.querySelectorAll('.tabs .tab')).find(button => button.textContent.trim() === 'Estimates');

    if (!estimatesButton) {
        console.error('Estimates button not found');
        return;
    }

    // Find the 'Actions' row
    var actionsRow = Array.from(document.querySelectorAll('.card .row')).find(row => row.querySelector('.name').textContent.trim() === 'Actions');

    if (!actionsRow) {
        console.error('Actions row not found');
        return;
    }

    // Get the dynamic attribute name from the 'Actions' row
    var dynamicAttr = Array.from(actionsRow.attributes).find(attr => attr.name.startsWith('_ngcontent')).name;

    // Create a new div element for the new row
    var newRow = document.createElement('div');
    newRow.setAttribute(dynamicAttr, '');
    newRow.className = 'row ng-star-inserted level-up'; // Add the level-up class

    // Create the 'name' div
    var nameDiv = document.createElement('div');
    nameDiv.setAttribute(dynamicAttr, '');
    nameDiv.className = 'name';
    nameDiv.textContent = 'Level up';

    // Create the 'value' div
    var valueDiv = document.createElement('div');
    valueDiv.setAttribute(dynamicAttr, '');
    valueDiv.className = 'value';
    valueDiv.textContent = 'Calculating...';  // Placeholder text

    // Append the 'name' and 'value' divs to the new row
    newRow.appendChild(nameDiv);
    newRow.appendChild(valueDiv);

    // Insert the new row after the 'Actions' row
    actionsRow.parentNode.insertBefore(newRow, actionsRow.nextSibling);

    // Call the function to calculate the XP difference and update the value every 5 seconds
    setInterval(() => updateXPDifference(dynamicAttr), 5000);
}

// Function to calculate XP difference and update the "Level up" row
function updateXPDifference(dynamicAttr) {
    // Find the 'skill' element
    var skillElement = document.querySelector('.skill');

    if (!skillElement) {
        console.error('Skill element not found');
        return;
    }

    // Extract the XP values
    var xpText = skillElement.querySelector('.exp').textContent.trim();
    var xpValues = xpText.split(' / ');
    var xpA = parseInt(xpValues[0].replace(',', ''));
    var xpB = parseInt(xpValues[1].replace(',', ''));

    // Calculate the difference
    var xpDifference = xpB - xpA;

    // Find the XP Gained per hour value
    var xpGainedText = Array.from(document.querySelectorAll('.card .row')).find(row => row.querySelector('.name').textContent.trim() === 'XP Gained').querySelector('.value').textContent.trim();
    var xpGainedPerHour = parseInt(xpGainedText.split(' ')[0].replace(',', ''));

    // Calculate the time to level up (in hours) based on XP difference and XP gained per hour
    var hoursToLevelUp = xpDifference / xpGainedPerHour;

    // Convert hours to seconds
    var secondsToLevelUp = hoursToLevelUp * 3600;

    // Convert remaining time to hours, minutes, and seconds format
    var formattedTime = formatTime(secondsToLevelUp);

    // Update the "Level up" row's value
    var levelUpValueDiv = document.querySelector(`.level-up .value[${dynamicAttr}]`);
    if (levelUpValueDiv) {
        levelUpValueDiv.textContent = formattedTime;
    } else {
        console.error('Level up row not found');
    }

    // Update the materials consumption rows
    updateMaterials(dynamicAttr);
}

// Function to update materials consumption rows
function updateMaterials(dynamicAttr) {
    // Find the active-link element and extract the timer value
    var activeLinkElement = document.querySelector('.active-link');
    if (!activeLinkElement) {
        console.error('Active link element not found');
        return;
    }

    var timerText = activeLinkElement.querySelector('.interval span').textContent.trim();
    var timerValue = parseFloat(timerText.replace('s', ''));

    // Calculate the actions per hour based on the timer value
    var actionsPerHour = 3600 / timerValue;

    // Find all cards and select the one with the header name 'Materials'
    var cards = document.querySelectorAll('.card');
    var materialsCard = Array.from(cards).find(card => card.querySelector('.header .name').textContent.trim() === 'Materials');

    if (!materialsCard) {
        console.error('Materials card not found');
        return;
    }

    // Extract all material rows
    var materialRows = materialsCard.querySelectorAll('.row.ng-star-inserted');

    // Track existing materials
    var existingMaterials = new Set();

    // Iterate over each material row and calculate the remaining time
    materialRows.forEach(materialRow => {
        var materialName = materialRow.querySelector('.name').textContent.trim();
        var materialValueText = materialRow.querySelector('.value').textContent.trim();
        var materialValues = materialValueText.split(' / ');
        var materialX = parseInt(materialValues[0].replace(',', ''));
        var materialY = parseInt(materialValues[1].replace(',', ''));

        // Calculate the remaining amount
        var remainingAmount = materialX / materialY;

        // Calculate the time until the material runs out (in seconds)
        var timeUntilOutOfMaterial = remainingAmount / actionsPerHour * 3600;

        // Convert remaining time to hours, minutes, and seconds format
        var formattedMaterialTime = formatTime(timeUntilOutOfMaterial);

        existingMaterials.add(materialName);

        // Check if the material row already exists
        var existingMaterialRow = document.querySelector(`.material-time[data-material="${materialName}"]`);

        if (existingMaterialRow) {
            // Update the existing material row's value
            var materialValueDiv = existingMaterialRow.querySelector('.value');
            materialValueDiv.textContent = formattedMaterialTime;
        } else {
            // Create a new div element for the material row
            var newMaterialRow = document.createElement('div');
            newMaterialRow.setAttribute(dynamicAttr, '');
            newMaterialRow.className = 'row ng-star-inserted material-time'; // Add the material-time class
            newMaterialRow.setAttribute('data-material', materialName); // Add a data attribute for the material name

            // Create the 'name' div
            var materialNameDiv = document.createElement('div');
            materialNameDiv.setAttribute(dynamicAttr, '');
            materialNameDiv.className = 'name';
            materialNameDiv.textContent = `${materialName} remaining`;

            // Create the 'value' div
            var materialValueDiv = document.createElement('div');
            materialValueDiv.setAttribute(dynamicAttr, '');
            materialValueDiv.className = 'value';
            materialValueDiv.textContent = formattedMaterialTime;

            // Append the 'name' and 'value' divs to the new material row
            newMaterialRow.appendChild(materialNameDiv);
            newMaterialRow.appendChild(materialValueDiv);

            // Insert the new material row under the "Level up" row
            var levelUpRow = document.querySelector('.level-up');
            if (levelUpRow && levelUpRow.parentNode) {
                levelUpRow.parentNode.insertBefore(newMaterialRow, levelUpRow.nextSibling);
            }
        }
    });

    // Remove material rows that no longer exist
    var materialTimeRows = document.querySelectorAll('.material-time');
    materialTimeRows.forEach(row => {
        var materialName = row.getAttribute('data-material');
        if (!existingMaterials.has(materialName)) {
            row.parentNode.removeChild(row);
        }
    });
}

// Helper function to format time in hours, minutes, and seconds
function formatTime(seconds) {
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
}

// Function to ensure rows are present and add them if missing
function ensureRowsExist() {
    var levelUpRow = document.querySelector('.level-up');
    if (!levelUpRow) {
        addNewRow();
    } else {
        var dynamicAttr = Array.from(levelUpRow.attributes).find(attr => attr.name.startsWith('_ngcontent')).name;
        updateXPDifference(dynamicAttr);
    }
}

// Call the function to add the new row after a 2-second delay
setTimeout(addNewRow, 2000);

// Set an interval to ensure rows are present every few seconds
setInterval(ensureRowsExist, 5000);




})();