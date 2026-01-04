// ==UserScript==
// @name         Flower Set Tracker
// @namespace    https://yournamespace.com
// @version      0.1
// @description  Calculate total flowers collected and create UI instantly in dark mode
// @author       Your Name
// @match        https://www.torn.com/travelagency.php
// @grant        GM_xmlhttpRequest
// @license Zer0Sake
// @downloadURL https://update.greasyfork.org/scripts/497218/Flower%20Set%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/497218/Flower%20Set%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Flower IDs, their respective names, and origins
    const flowers = [
        { ID: 282, name: "African Violet", origin: "South Africa" },
        { ID: 385, name: "Tribulus Omanense", origin: "Dubai" },
        { ID: 276, name: "Peony", origin: "China" },
        { ID: 277, name: "Cherry Blossom", origin: "Japan" },
        { ID: 272, name: "Edelweiss", origin: "Switzerland" },
        { ID: 271, name: "Ceibo Flower", origin: "Argentina" },
        { ID: 267, name: "Heather", origin: "United Kingdom" },
        { ID: 264, name: "Orchid", origin: "Hawaii" },
        { ID: 263, name: "Crocus", origin: "Canada" },
        { ID: 617, name: "Banana Orchid", origin: "Cayman Islands" },
        { ID: 260, name: "Dahlia", origin: "Mexico" }
    ];

    // Function to fetch user display case data
    async function fetchDisplayCase() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://api.torn.com/user/APIHERE",
                onload: function(response) {
                    const displayData = JSON.parse(response.responseText);
                    if (displayData && displayData.display) {
                        resolve(displayData.display);
                    } else {
                        reject("Display case data not found.");
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // Remaining code for createUI function...
    function createUI(flowersData, desiredSets, uiPosition, pinned) {
        const uiContainer = document.createElement("div");
        uiContainer.id = "flowerUI";
        uiContainer.style.position = pinned ? "absolute" : "fixed";
        uiContainer.style.top = uiPosition.y + "px";
        uiContainer.style.left = uiPosition.x + "px";
        uiContainer.style.transform = "translate(-50%, -50%)";
        uiContainer.style.background = "#333"; // Dark background color
        uiContainer.style.color = "#fff"; // Light text color
        uiContainer.style.padding = "10px";
        uiContainer.style.border = "1px solid #ccc";
        uiContainer.style.borderRadius = "5px";
        uiContainer.style.zIndex = "9999";
        uiContainer.style.cursor = pinned ? "default" : "move";

        let sortedFlowersData = flowersData.sort((a, b) => {
            return flowers.findIndex(flower => flower.ID === a.ID) - flowers.findIndex(flower => flower.ID === b.ID);
        });

        let flowerHTML = '<h2 style="color: #fff;">Flower Set Tracker</h2>'; // Light title color
        flowerHTML += '<table style="width: 100%; border-collapse: collapse;">';
        flowerHTML += '<thead><tr>';
        flowerHTML += '<th style="border: 1px solid #fff; padding: 8px; color: #fff;">Origin</th>';
        flowerHTML += '<th style="border: 1px solid #fff; padding: 8px; color: #fff;">Flower</th>';
        flowerHTML += '<th style="border: 1px solid #fff; padding: 8px; color: #fff;">Quantity</th>';
        flowerHTML += '<th style="border: 1px solid #fff; padding: 8px; color: #fff;">Missing</th>'; // Added missing column
        flowerHTML += '</tr></thead>';
        flowerHTML += '<tbody>';
        sortedFlowersData.forEach(flower => {
            const name = flower.name;
            const origin = flowers.find(item => item.ID === flower.ID)?.origin || 'Unknown Origin';
            flowerHTML += `<tr>`;
            flowerHTML += `<td style="border: 1px solid #fff; padding: 8px; color: #fff;">${origin}</td>`;
            flowerHTML += `<td style="border: 1px solid #fff; padding: 8px; color: #fff;">${name}</td>`;
            flowerHTML += `<td style="border: 1px solid #fff; padding: 8px; color: #fff;">${flower.quantity}</td>`;
            flowerHTML += `<td id="missing_${flower.ID}" style="border: 1px solid #fff; padding: 8px; color: #fff;" data-flower-id="${flower.ID}">${calculateMissingAmount(flower.quantity, desiredSets)}</td>`; // Added missing amount calculation
            flowerHTML += `</tr>`;
        });
        flowerHTML += '</tbody></table>';

        // Input field for desired number of sets
        flowerHTML += `<label for="sets" style="color: #fff;">Desired Sets:</label>`;
        flowerHTML += `<input type="number" id="sets" name="sets" value="${desiredSets}" min="0" step="1" style="margin-left: 5px; width: 50px; padding: 5px; border-radius: 3px; background-color: #555; color: #fff; border: 1px solid #ccc;">`;

        // Save button
        flowerHTML += `<button id="saveBtn" style="margin-top: 10px; padding: 5px 10px; border: none; border-radius: 3px; background-color: #4CAF50; color: #fff; cursor: pointer;">Save</button>`;

        // Pin button
        const pinBtnText = pinned ? "Unpin" : "Pin";
        flowerHTML += `<button id="pinBtn" style="position: absolute; top: 5px; right: 5px; padding: 3px 6px; border: none; border-radius: 3px; background-color: #4CAF50; color: #fff; cursor: pointer;">${pinBtnText}</button>`;

        uiContainer.innerHTML = flowerHTML;
        document.body.appendChild(uiContainer);

        // Make the UI draggable
        let isDragging = false;
        let offsetX, offsetY;

        uiContainer.addEventListener('mousedown', function(e) {
            if (!pinned) {
                isDragging = true;
                offsetX = e.clientX - parseInt(uiContainer.style.left);
                offsetY = e.clientY - parseInt(uiContainer.style.top);
            }
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const newX = e.clientX - offsetX;
                const newY = e.clientY - offsetY;

                uiContainer.style.left = `${newX}px`;
                uiContainer.style.top = `${newY}px`;
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;

            // Save the new position when dragging ends
            const newPosition = { x: parseInt(uiContainer.style.left), y: parseInt(uiContainer.style.top) };
            localStorage.setItem('uiPosition', JSON.stringify(newPosition));
        });

        // Event listener for input change
        const setsInput = document.getElementById('sets');
        if (setsInput) {
            setsInput.addEventListener('input', function() {
                const desiredSets = parseInt(setsInput.value);
                updateMissingAmounts(flowersData, desiredSets);
            });
        }

        // Event listener for save button
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                const setsInput = document.getElementById('sets');
                if (setsInput) {
                    const desiredSets = parseInt(setsInput.value);
                    localStorage.setItem('desiredSets', desiredSets);
                }
            });
        }

        // Event listener for pin button
        const pinBtn = document.getElementById('pinBtn');
        if (pinBtn) {
            pinBtn.addEventListener('click', function() {
                const pinnedPosition = { x: parseInt(uiContainer.style.left), y: parseInt(uiContainer.style.top) };
                if (pinned) {
                    // Unpin the UI
                    localStorage.removeItem("pinnedPosition");
                    uiContainer.style.position = "fixed";
                    uiContainer.style.cursor = "move";
                    pinBtn.textContent = "Pin";
                } else {
                    // Pin the UI
                    localStorage.setItem("pinnedPosition", JSON.stringify(pinnedPosition));
                    uiContainer.style.position = "absolute";
                    uiContainer.style.cursor = "default";
                    pinBtn.textContent = "Unpin";
                }
            });
        }
    }

    // Remaining code for calculateMissingAmount function...
    function calculateMissingAmount(currentQuantity, desiredSets) {
        const requiredQuantity = desiredSets;
        const missingQuantity = requiredQuantity - currentQuantity;
        return missingQuantity >= 0 ? missingQuantity : '0'; // Return '0' if not missing
    }

    // Remaining code for updateMissingAmounts function...
    function updateMissingAmounts(flowersData, desiredSets) {
        flowersData.forEach(flower => {
            const missingAmountCell = document.querySelector(`#missing_${flower.ID}`);
            if (missingAmountCell) {
                missingAmountCell.textContent = calculateMissingAmount(flower.quantity, desiredSets);
            }
        });
    }

    // Remaining code for calculateFlowersAndCreateUI function...
    async function calculateFlowersAndCreateUI() {
        try {
            const displayData = await fetchDisplayCase();
            const pinnedPosition = JSON.parse(localStorage.getItem("pinnedPosition"));
            let uiPosition;
            if (pinnedPosition) {
                uiPosition = pinnedPosition;
            } else {
                uiPosition = JSON.parse(localStorage.getItem('uiPosition')) || { x: 50, y: 50 }; // Default position if not saved
            }
            const desiredSets = parseInt(localStorage.getItem('desiredSets')) || 0; // Default desired sets if not saved
            const pinned = !!pinnedPosition;
            createUI(displayData, desiredSets, uiPosition, pinned);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // Execute calculation on page load
    calculateFlowersAndCreateUI();

})();
