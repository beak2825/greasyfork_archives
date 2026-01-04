// ==UserScript==
// @name        Farm RPG Mining Progress Display
// @namespace   http://tampermonkey.net/
// @version     4.4
// @description Displays the progress value from the mining bar, while collecting data in the background and graphing it.
// @author      ClientCoin
// @match       http://farmrpg.com/*
// @match       https://farmrpg.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @license     MIT
// @icon        https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @downloadURL https://update.greasyfork.org/scripts/546285/Farm%20RPG%20Mining%20Progress%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/546285/Farm%20RPG%20Mining%20Progress%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Mining Progress Display Initiated');

    // --- CONFIGURATION ---
    const isDebugMode = false; // Set this to true to see debug logs
    const debugLog = (...args) => {
        if (isDebugMode) {
            console.log('Tampermonkey script:', ...args);
        }
    };
    // The number of most recent data points to plot on the graph.
    const pointsToPlot = 25;
    // A scaling factor for font sizes on the graph (e.g., 1.0 = normal size, 0.8 = 20% smaller)
    const fontScaleFactor = 1.2;
    // --- END CONFIGURATION ---

    // A unique key for storing data in GM_storage
    const STORAGE_KEY = 'farmrpg_mining_data';

    // ===========================================
    // SECTION 1: DATA COLLECTION LOGIC
    // - This section ONLY handles data storage.
    // - It does NOT modify the UI.
    // ===========================================
    let dataRetryCount = 0;
    const MAX_DATA_RETRIES = 5;

    // Function to get the current mining location name from the DOM
    function getMiningLocation() {
        debugLog('2. DATA: Executing getMiningLocation function...');

        const allCenterSlidingDivs = document.querySelectorAll('.center.sliding');
        debugLog(`2. DATA: - Found ${allCenterSlidingDivs.length} elements with class ".center.sliding"`);

        for (const div of allCenterSlidingDivs) {
            // Find the 'info' icon element inside the current div.
            const infoIcon = div.querySelector('a i.f7-icons');

            // This is the most reliable way to identify the mining location header.
            if (infoIcon) {
                const fullText = div.textContent;
                // The location name is the part of the string before the 'info' text.
                const locationText = fullText.substring(0, fullText.indexOf('info')).trim();
                debugLog(`2. DATA: - Found a match! Location element has 'info' icon. Location: ${locationText}`);
                return locationText;
            }
        }

        debugLog('2. DATA: - No matching element found. Returning null.');
        return null;
    }

    function getCurrentFloor() {
        const floorLabel = document.querySelector('.col-30 strong');
        const floorMatch = floorLabel.textContent.match(/(\d{1,3}(?:,\d{3})*)/);
        const currentFloor = floorMatch ? parseInt(floorMatch[1].replace(/,/g, ''), 10) : null;
        debugLog("Current Floor is: " + currentFloor);
        return currentFloor;
    }

    // Function to reset all stored data for the current mining location
    async function resetMiningData(locationName) {
        if (!locationName) {
            console.warn('Tampermonkey script: Cannot reset data, location name is not defined.');
            return;
        }

        // Confirmation prompt to prevent accidental data loss
        // Using a simple custom modal for better UX than alert/confirm
        const userConfirmed = await new Promise(resolve => {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: white; padding: 20px; border: 1px solid #ccc; border-radius: 8px;
                z-index: 10000; box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            `;
            modal.innerHTML = `
                <p>Are you sure you want to delete all mining data for ${locationName}?</p>
                <button id="confirm-yes">Yes</button>
                <button id="confirm-no">No</button>
            `;
            document.body.appendChild(modal);

            document.getElementById('confirm-yes').onclick = () => {
                modal.remove();
                resolve(true);
            };
            document.getElementById('confirm-no').onclick = () => {
                modal.remove();
                resolve(false);
            };
        });

        if (userConfirmed) {
            try {
                let miningData = await GM_getValue(STORAGE_KEY, {});
                delete miningData[locationName];
                await GM_setValue(STORAGE_KEY, miningData);
                console.log(`Tampermonkey script: Successfully deleted all mining data for ${locationName}.`);

                // Reload the page to refresh the display
                window.location.reload();
            } catch (error) {
                console.error('Tampermonkey script: Error resetting data:', error);
            }
        }
    }

    async function collectAndStoreMiningData() {
        const progressBar = document.getElementById('mpb');
        const floorElement = document.querySelector('.col-30 strong span');
        const locationName = getMiningLocation();
        debugLog('Starting collectAndStoreMiningData...');
        debugLog('Location Name:', locationName);
        debugLog('Progress Bar Found:', !!progressBar);
        debugLog('Floor Element Found:', !!floorElement);

        if (!progressBar || !floorElement || !locationName) {
            if (dataRetryCount < MAX_DATA_RETRIES) {
                dataRetryCount++;
                setTimeout(collectAndStoreMiningData, 50);
            } else {
                dataRetryCount = 0;
            }
            return;
        }

        dataRetryCount = 0;
        const currentFloor = getCurrentFloor();
        const currentProgress = parseFloat(progressBar.getAttribute('data-progress'));

        try {
            let miningData = await GM_getValue(STORAGE_KEY, {});
            debugLog('Data retrieved from storage (before update):', miningData);

            // Store the data in the new nested format: location > floor > progress
            miningData[locationName] = miningData[locationName] || {};
            miningData[locationName][currentFloor] = {
                progress: currentProgress
            };

            await GM_setValue(STORAGE_KEY, miningData);
            debugLog('Data saved to storage (after update):', miningData);

        } catch (error) {
            console.error('Tampermonkey script: Error during data collection:', error);
        }
    }

    // ===========================================
    // SECTION 2: DISPLAY LOGIC (v1.1)
    // ===========================================
    function getRecentProgressPerFloor(locationData) {
        debugLog('1. DISPLAY: Calculating progress rate...');
        const ALPHA = 0.2;
        const MAD_THRESHOLD = 2.5;
        const MAD_MINIMUM_PERCENTAGE_OF_MEDIAN = 0.1;
        const allFloors = Object.keys(locationData).map(Number).sort((a, b) => a - b);
        const recentFloors = allFloors.slice(Math.max(0, allFloors.length - 100));

        if (recentFloors.length < 2) {
            debugLog('1. DISPLAY: Not enough data points to calculate a rate. (Need at least 2 floors)');
            return null;
        }

        let progressRates = [];
        for (let i = 1; i < recentFloors.length; i++) {
            const previousFloor = recentFloors[i - 1];
            const floorsGained = recentFloors[i] - previousFloor;

            if (floorsGained > 0) {
                const progressChange = locationData[recentFloors[i]].progress - locationData[previousFloor].progress;
                if (progressChange > 0) {
                    progressRates.push(progressChange / floorsGained);
                }
            }
        }
        debugLog('1. DISPLAY: Original progress rates:', progressRates.map(rate => rate.toFixed(4)));

        if (progressRates.length < 3) {
            debugLog('1. DISPLAY: Not enough data points for statistical filtering. (Need at least 3)');
            return null;
        }

        // --- Outlier detection using MAD ---
        const sortedRates = [...progressRates].sort((a, b) => a - b);
        const median = sortedRates.length % 2 === 0
            ? (sortedRates[sortedRates.length / 2 - 1] + sortedRates[sortedRates.length / 2]) / 2
            : sortedRates[Math.floor(sortedRates.length / 2)];

        const deviations = sortedRates.map(rate => Math.abs(rate - median));
        deviations.sort((a, b) => a - b);
        let mad = deviations.length % 2 === 0
            ? (deviations[deviations.length / 2 - 1] + deviations[deviations.length / 2]) / 2
            : deviations[Math.floor(deviations.length / 2)];
        if (mad < 0.01) {mad = median * MAD_MINIMUM_PERCENTAGE_OF_MEDIAN};

        const filteredRates = progressRates.filter(rate => Math.abs(rate - median) <= MAD_THRESHOLD * mad);

        const rejectedRates = progressRates.filter(rate => !filteredRates.includes(rate));
        debugLog(`1. DISPLAY: Median: ${median.toFixed(4)}, MAD: ${mad.toFixed(4)}`);
        debugLog(`1. DISPLAY: Filtering data points within ${MAD_THRESHOLD}x MAD from median.`);
        debugLog('1. DISPLAY: Rejected rates (outliers):', rejectedRates.map(rate => rate.toFixed(4)));

        if (filteredRates.length === 0) {
            debugLog('1. DISPLAY: No valid data points remain after filtering.');
            return null;
        }

        let weightedAverage = filteredRates[0];
        for (let i = 1; i < filteredRates.length; i++) {
            weightedAverage = (ALPHA * filteredRates[i]) + ((1 - ALPHA) * weightedAverage);
        }
        debugLog(`1. DISPLAY: Final calculated weighted average: ${weightedAverage.toFixed(4)}`);
        return weightedAverage;
    }


    async function updateMiningDisplay() {
        debugLog('Starting updateMiningDisplay...');
        const progressBar = document.getElementById('mpb');
        const floorElement = document.querySelector('.col-30 strong span');
        const locationName = getMiningLocation();
        debugLog('Location Name:', locationName);
        debugLog('Progress Bar Found:', !!progressBar);
        debugLog('Floor Element Found:', !!floorElement);

        if (!progressBar || !floorElement || !locationName) {
            return;
        }

        const floorLabel = document.querySelector('.col-30 strong');

        const currentFloor = getCurrentFloor();
        if (isNaN(currentFloor)) {
            debugLog('1. DISPLAY: Floor number is not a valid number. Exiting.');
            return;
        }

        if (floorLabel) {
            const textNode = Array.from(floorLabel.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim() === 'Floor');
            if (textNode) {
                textNode.remove();
            }
            const brElement = floorLabel.querySelector('br');
            if (brElement) {
                brElement.remove();
            }
            if (!floorLabel.querySelector('#floor-label')) {
                const labelSpan = document.createElement('span');
                labelSpan.id = 'floor-label';
                labelSpan.textContent = 'Floor: ';
                labelSpan.style.cssText = `font-size: 17px; font-weight: bold;`;
                floorLabel.prepend(labelSpan);
                const floorNumberSpan = floorLabel.querySelector('span:not(#floor-label)');
                if(floorNumberSpan) floorNumberSpan.style.fontSize = '17px';
            }
        }

        const currentProgress = parseFloat(progressBar.getAttribute('data-progress'));

        let miningData = await GM_getValue(STORAGE_KEY, {});
        debugLog('Data retrieved for display:', miningData);
        const locationData = miningData[locationName] || {};

        let floorsToGoText = 'Data gathering...';
        let targetFloorText = 'Complete 4 Floors to Start';
        let lastKnownProgress = 0;

        const allFloors = Object.keys(locationData).map(Number).sort((a, b) => b - a);
        if (allFloors.length > 0) {
            const lastFloorNumber = allFloors[0];
            lastKnownProgress = locationData[lastFloorNumber]?.progress || 0;
        }
        debugLog('Stored location data:', miningData);
        if (currentProgress < lastKnownProgress) {
            miningData[locationName] = {};
            await GM_setValue(STORAGE_KEY, miningData);
        }

        const progressRate = getRecentProgressPerFloor(locationData, currentFloor);

        if (progressRate && progressRate > 0) {
            const progressRemaining = 100 - currentProgress;
            const estimatedFloorsToGo = progressRemaining / progressRate;

            floorsToGoText = `Est. Floors: ${Math.round(estimatedFloorsToGo)}`;
            targetFloorText = `Target Floor: ${Math.round(currentFloor + estimatedFloorsToGo)}`;
        }

        // Function to create or update the display elements
        const createOrUpdateDisplay = (progressValue) => {
            var floorContainer = document.querySelector('.col-30');
            floorContainer.innerHTML = floorContainer.innerHTML.replace(/<br>\s*<br>/g, '<br>');

            if (floorContainer) {
                let progressDisplay = document.getElementById('farmrpg-progress-display');
                let estimateDisplay = document.getElementById('farmrpg-estimate-display');
                let targetFloorDisplay = document.getElementById('farmrpg-target-floor-display');
                let resetButton = document.getElementById('farmrpg-reset-button');

                // --- Create/Update Progress, Estimate, and Target Displays ---
                if (!progressDisplay) {
                    progressDisplay = document.createElement('div');
                    progressDisplay.id = 'farmrpg-progress-display';
                    floorContainer.insertBefore(progressDisplay, floorContainer.querySelector('strong'));
                    progressDisplay.style.cssText = `font-weight: bold !important; color: lightgreen !important; font-size: 14px !important; margin-bottom: 5px !important; text-shadow: 0 0 5px rgba(144, 238, 144, 0.5) !important;`;
                }
                const formattedProgress = parseFloat(progressValue).toFixed(2);
                progressDisplay.textContent = `Progress: ${formattedProgress}%`;

                if (!estimateDisplay) {
                    estimateDisplay = document.createElement('div');
                    estimateDisplay.id = 'farmrpg-estimate-display';
                    floorContainer.insertBefore(estimateDisplay, floorContainer.querySelector('strong').nextSibling);
                    estimateDisplay.style.cssText = `font-weight: bold !important; color: #add8e6 !important; font-size: 12px !important; margin-top: 5px !important;`;
                }
                estimateDisplay.textContent = floorsToGoText;

                if (!targetFloorDisplay) {
                    targetFloorDisplay = document.createElement('div');
                    targetFloorDisplay.id = 'farmrpg-target-floor-display';
                    floorContainer.insertBefore(targetFloorDisplay, estimateDisplay.nextSibling);
                    targetFloorDisplay.style.cssText = `font-weight: bold !important; color: #ffcc00 !important; font-size: 12px !important; margin-top: 5px !important;`;
                }
                targetFloorDisplay.textContent = targetFloorText;

                // --- Create/Update Reset Button ---
                if (!resetButton) {
                    resetButton = document.createElement('a');
                    resetButton.id = 'farmrpg-reset-button';
                    resetButton.className = 'button btnpurple';
                    resetButton.style.cssText = `font-size: 11px; height: 20px; line-height: 18px; width: 100px; margin: 10px auto 0 auto; display: block;`;
                    resetButton.textContent = 'Reset Data';
                    resetButton.onclick = () => resetMiningData(locationName);
                    floorContainer.insertBefore(resetButton, targetFloorDisplay.nextSibling);//.replace(/<br><br>/g, '<br>');

                }

                // --- Call the graph function ---
                createAndPlaceGraph(locationData);
            }
        };

        createOrUpdateDisplay(currentProgress);
    }

    // ===========================================
    // SECTION 3: GRAPH LOGIC (UPDATED FOR CANVAS)
    // ===========================================
    let retryCount = 0;
    const MAX_RETRIES = 10;

    /**
     * Creates and places the graph in the correct position with a retry mechanism.
     * @param {object} locationData - The data object for the current mining location.
     */
    function createAndPlaceGraph(locationData) {
        debugLog('Starting createAndPlaceGraph...');

        // Use a more specific selector to find the correct row
        const parentRow = document.querySelector('.page[data-page="mining"] .row');
        if (!parentRow) {
            console.error('Tampermonkey script: Could not find the correct parent .row element. Retrying...');
            if (retryCount < MAX_RETRIES) {
                retryCount++;
                setTimeout(() => createAndPlaceGraph(locationData), 200);
            }
            return;
        }

        const leftCol = parentRow.querySelector('.col-30:first-of-type');
        const centerCol = parentRow.querySelector('.col-40');
        const rightCol = parentRow.querySelector('.col-30:last-of-type');

        if (!leftCol || !centerCol || !rightCol) {
            console.error('Tampermonkey script: Could not find one of the required columns for re-positioning. Retrying...');
            if (retryCount < MAX_RETRIES) {
                retryCount++;
                setTimeout(() => createAndPlaceGraph(locationData), 200);
            }
            return;
        }

        // Reset retry count on success
        retryCount = 0;

        // --- Step 1: Move content from rightCol to leftCol ---
        var rightColContent = rightCol.innerHTML.replace('<span style=\u0022font-size: 12px\u0022>Items Left</span>','').replace('<span style=\u0022font-size: 12px\u0022>Attempts Left</span>','').replace('<span style=\u0022font-size: 18px\u0022 id=\u0022attempts','Attempts Left: <span style=\u0022font-size: 12px\u0022 id=\u0022attempts').replace('<span style=\u0022font-size: 18px\u0022 id=\u0022items','Items Left: <span style=\u0022font-size: 12px\u0022 id=\u0022items').replace(/<br><br>/g, '<br>').replace('</strong><br>','</strong>');

        //<span style="font-size: 12px"></span>
//<span style="font-size: 18px" id="items">3</span>
//<span style="font-size: 18px" id="attempts">22</span>

        const newContentDiv = document.createElement('div');
        newContentDiv.innerHTML = rightColContent;
        leftCol.appendChild(newContentDiv);
        debugLog('Moved content from right column to left column.');

        // --- Step 2: Remove the original rightCol ---
        parentRow.removeChild(rightCol);
        debugLog('Removed the original right column.');

        // --- Step 3: Resize the centerCol ---
        centerCol.className = 'col-20';
        debugLog('Resized center column to col-20.');

        // --- Step 4: Create a new col-50 for the graph ---
        let graphCol = document.getElementById('farmrpg-graph-col');
        if (!graphCol) {
            graphCol = document.createElement('div');
            graphCol.id = 'farmrpg-graph-col';
            graphCol.className = 'col-50';
            parentRow.insertBefore(graphCol, centerCol.nextSibling);
            debugLog('Created a new col-50 for the graph.');
        }

        // --- Step 5: Place the graph inside the new col-50 ---
        let graphContainer = document.getElementById('farmrpg-graph-container');
        if (!graphContainer) {
            graphContainer = document.createElement('div');
            graphContainer.id = 'farmrpg-graph-container';
            graphContainer.style.cssText = `
                margin-top: 20px;
                text-align: center;
            `;
            graphCol.appendChild(graphContainer);
            debugLog('Placed the graph container in the new col-50.');
        }

        let graphCanvas = document.getElementById('farmrpg-progress-graph');
        let messageDiv = document.getElementById('farmrpg-graph-message');

        // Prepare data for the graph and filter out non-numeric keys
        let floors = Object.keys(locationData)
                           .filter(key => !isNaN(Number(key))) // Filter out non-numeric keys
                           .map(Number)
                           .sort((a, b) => a - b);
        debugLog('Floors array from data (filtered):', floors);
        debugLog('Number of floors:', floors.length);

        // --- Filter to only the last X points ---
        floors = floors.slice(Math.max(0, floors.length - pointsToPlot));
        debugLog(`Filtered to last ${pointsToPlot} floors:`, floors);

        // If there are less than two data points, show a message instead of a graph
        if (floors.length < 2) {
            if (messageDiv) messageDiv.remove();
            if (graphCanvas) graphCanvas.remove();

            messageDiv = document.createElement('div');
            messageDiv.id = 'farmrpg-graph-message';
            messageDiv.textContent = 'Mine more to see your progress graph!';
            graphContainer.appendChild(messageDiv);

            return;
        }

        // If there's enough data, ensure the graph canvas exists
        if (!graphCanvas) {
            graphCanvas = document.createElement('canvas');
            graphCanvas.id = 'farmrpg-progress-graph';
            graphCanvas.width = graphCol.clientWidth;
            graphCanvas.height = 200;
            graphCanvas.style.cssText = `
                background-color: rgba(0, 0, 0, 0.4);
                border-radius: 8px;
            `;
            graphContainer.appendChild(graphCanvas);
        }
        if (messageDiv) messageDiv.remove();

        // Get the canvas context
        const ctx = graphCanvas.getContext('2d');

        // Clear the canvas for redrawing
        ctx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);

        // Define drawing area and scaling
        const padding = 20;
        const xOffset = 30; // Space for Y-axis labels
        const graphWidth = graphCanvas.width - padding * 2 - xOffset;
        const graphHeight = graphCanvas.height - padding * 2;

        // Find min/max values for scaling
        const minFloor = floors[0];
        const maxFloor = floors[floors.length - 1];

        // Calculate dynamic min and max progress values
        const lastProgressValues = floors.map(floor => locationData[floor]?.progress).filter(p => p !== undefined);
        const minRawProgress = Math.min(...lastProgressValues);
        const maxRawProgress = Math.max(...lastProgressValues);

        // Add a 5% buffer to the min and max values for better visualization
        const progressRange = maxRawProgress - minRawProgress;
        const paddedMinProgress = Math.max(0, minRawProgress - progressRange * 0.05);
        const paddedMaxProgress = Math.min(100, maxRawProgress + progressRange * 0.05);

        debugLog(`minFloor: ${minFloor}, maxFloor: ${maxFloor}, floorRange: ${maxFloor - minFloor}`);
        debugLog(`minProgress: ${paddedMinProgress.toFixed(2)}, maxProgress: ${paddedMaxProgress.toFixed(2)}`);

        // Draw the graph title
        ctx.fillStyle = '#fff';
        ctx.font = `${16 * fontScaleFactor}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('Mining Progress Over Time', graphCanvas.width / 2, padding / 2 + 10);

        // Draw axes and labels
        ctx.strokeStyle = '#ddd';
        ctx.fillStyle = '#ddd';
        ctx.lineWidth = 1;

        // Y-axis
        ctx.beginPath();
        ctx.moveTo(padding + xOffset, padding);
        ctx.lineTo(padding + xOffset, graphHeight + padding);
        ctx.stroke();

        // X-axis
        ctx.beginPath();
        ctx.moveTo(padding + xOffset, graphHeight + padding);
        ctx.lineTo(graphWidth + padding + xOffset, graphHeight + padding);
        ctx.stroke();

        // Label Y-axis
        ctx.textAlign = 'right';
        ctx.font = `${12 * fontScaleFactor}px Arial`;
        ctx.fillText(paddedMaxProgress.toFixed(1) + '%', padding + xOffset - 5, padding + 5);
        ctx.fillText(paddedMinProgress.toFixed(1) + '%', padding + xOffset - 5, graphHeight + padding - 5);

        // Label X-axis (with min/max floor numbers)
        ctx.font = `${12 * fontScaleFactor}px Arial`;
        ctx.textAlign = 'left';
        ctx.fillText(minFloor, padding + xOffset, graphHeight + padding + 15);
        ctx.textAlign = 'right';
        ctx.fillText(maxFloor, graphWidth + padding + xOffset, graphHeight + padding + 15);

        // --- Plot the line ---
        ctx.strokeStyle = '#ffcc00';
        ctx.lineWidth = 2;
        ctx.beginPath();

        floors.forEach((floor, index) => {
            const dataPoint = locationData[floor];
            if (!dataPoint) return;
            const progress = dataPoint.progress;

            let x;
            const floorRange = maxFloor - minFloor;
            if (floorRange <= 1) {
                x = padding + xOffset + (index / (floors.length - 1)) * graphWidth;
            } else {
                x = padding + xOffset + ((floor - minFloor) / floorRange) * graphWidth;
            }
            const y = graphHeight + padding - ((progress - paddedMinProgress) / (paddedMaxProgress - paddedMinProgress)) * graphHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // --- Plot the points on top of the line ---
        floors.forEach((floor, index) => {
            const dataPoint = locationData[floor];
            if (!dataPoint) return;
            const progress = dataPoint.progress;

            let x;
            const floorRange = maxFloor - minFloor;
            if (floorRange <= 1) {
                x = padding + xOffset + (index / (floors.length - 1)) * graphWidth;
            } else {
                x = padding + xOffset + ((floor - minFloor) / floorRange) * graphWidth;
            }
            const y = graphHeight + padding - ((progress - paddedMinProgress) / (paddedMaxProgress - paddedMinProgress)) * graphHeight;

            ctx.fillStyle = '#ffcc00';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }


    // ===========================================
    // SECTION 4: ACTIVATION
    // - This section activates both functions.
    // ===========================================
    updateMiningDisplay();
    collectAndStoreMiningData();

    const targetNode = document.querySelector("#fireworks");
    if (targetNode) {
        const navObserver = new MutationObserver((mutationsList) => {
            if (mutationsList.some(m => m.attributeName === 'data-page')) {
                debugLog('3. ACTIVATION: Navigation detected via data-page attribute change.');
                updateMiningDisplay();
                collectAndStoreMiningData();
            }
        });
        navObserver.observe(targetNode, { attributes: true });
        debugLog('3. ACTIVATION: Navigation observer set up.');
    }
})();
