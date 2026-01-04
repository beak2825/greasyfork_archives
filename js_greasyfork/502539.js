// ==UserScript==
// @name         Mission Finder (NEW)
// @namespace    http://tampermonkey.net/
// @version      5.5
// @description  Mission finder script with retry logic for loading vehicles and retrying unit selection if the loading bar is visible. Includes dispatch box functionality, patient selection, and color change. Only runs on mission dispatch pages.
// @author       Martyblyth
// @match        https://www.missionchief.co.uk/*
// @match        https://police.missionchief.co.uk/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/502539/Mission%20Finder%20%28NEW%29.user.js
// @updateURL https://update.greasyfork.org/scripts/502539/Mission%20Finder%20%28NEW%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to detect if we are on a mission dispatch page
    function isMissionPage() {
        // Check if the page contains elements unique to the mission dispatch popup (modal)
        return document.querySelector('.vm--modal iframe') || document.querySelector('#mission_general_info');
    }

    // Prevent double initialization by checking if the script has already run
    if (window.missionFinderInitialized) return;
    window.missionFinderInitialized = true;

    // Cross-reference list for item name replacements
    const crossReference = {
        // FIRE
        "Pumps": "Fire Engine R/PUMP x 1",
        "Pump": "Fire Engine R/PUMP x 1",
        "Aerial Appliance": "Fire Engine CARP",
        "Aerial Appliances": "Fire Engine CARP",
        "Breathing Apparatus Support Unit": "OSU",
        "Breathing Apparatus Support Units": "OSU",
        "HazMat Unit or CBRN Vehicle": "OSU",
        "HazMat Units or CBRN Vehicles": "OSU",
        "Welfare Vehicle": "OSU",
        "Welfare Vehicles": "OSU",
        "ICCU or Ambulance Control Unit": "ICCU/ACU",
        "ICCU or Ambulance Control Units": "ICCU/ACU",
        "ICCUs or Ambulance Control Units": "ICCU/ACU",
        "Fire Officers": "Fire Officer",
        "Fire Officer": "Fire Officer",
        "Rescue Support Unit or Rescue Pump": "Fire Engine R/PUMP x 1",
        "Rescue Support Units or Rescue Pumps": "Fire Engine R/PUMP x 1",
        "Fire Engines or Rescue Support Vehicles": "Fire Engine R/PUMP x 1",
        "Fire Engines, Rescue Support Vehicles or Aerial Appliance Trucks": "Fire Engine R/PUMP x 1",
        "Foam Unit": "RP CAFS",
        "Foam Units": "RP CAFS",
        "Water Carrier" : "Water Carrier",
        "Water Carriers": "Water Carrier",
        // POLICE
        "Police Cars": "Police Car",
        "Traffic Car": "Police ATC",
        "Traffic Cars": "Police ATC",
        "Dog Support Unit (DSU)": "Police DSU",
        "Dog Support Units (DSUs)": "Police DSU",
        "Police Cars or Armed Response Vehicles (ARVs)": "Police ATC",
        "Mounted Units": "Mounted Unit",
        "Police Helicopters or Drones": "Police Helicopter",
        // AMBULANCE
        "Ambulance": "Ambulance x 01",
        "Ambulances": "Ambulance x 01",
        "Primary Response Vehicle": "PRV",
        "Primary Response Vehicles": "PRV",
        "Secondary Response Vehicle": "SRV",
        "Secondary Response Vehicles": "SRV",
        "Operational Team Leader": "OTL",
        "Operational Team Leaders": "OTL",
        "Mass Casualty Equipment": "Mass Casualty Equipment",
        "ATV Carrier": "ATV Carrier",
        "RRV or Specialist Paramedic RRV": "Specialist Paramedic RRV",
        "Community Midwifes": "Community Midwife",
        "Community Midwife": "Community Midwife",
        // SAR
        "CRV": "CRV",
        "CRVs": "CRV",
        "Inland Rescue Boat (Trailer)": "Boat Trailer",
        "Coastguard Rescue Helicopter": "CG Rescue Helicopter (Large)",
        "Coastguard Rescue Helicopters": "CG Rescue Helicopter (Large)",
        "ILBs or ALBs": "ALB",
        "ILBs": "ILB",
        "Control Vans": "Control Van",
        "Control Van": "Control Van",
        "Operational Support Van": "Operational Support Van",
        "Operational Support Vans": "Operational Support Van",
        "Flood Rescue Unit": "Flood Rescue Unit (Trailer)",
        "4x4 Vehicles": "SAR 4x4",
        "4x4 Vehicle": "SAR 4x4",
        "Hovercraft (trailer)": "Hovercraft (trailer)",
        "Coastguard Mud Rescue Units": "CG Mud Rescue Unit",
        "Coastguard Mud Rescue Unit": "CG Mud Rescue Unit",
        "Mud Decontamination Unit": "Mud Decontamination Unit",
        "Mud Decontamination Units": "Mud Decontamination Unit",
        // AIRFIELD
        "Airfield Operations Vehicle": "Airfield Operations Vehicle",
        "Airfield Operations Vehicles": "Airfield Operations Vehicle",
        "Aerial Appliance Trucks or Rescue Stairs": "Rescue Stairs",
        "Fire Engines or RIVs": "RIV",
        "Major Foam Tenders": "Major Foam Tender",
        "RIVs or Major Foam Tenders": "Major Foam Tender",
        "Fire Engines, RIVs or Major Foam Tenders": "Major Foam Tender",
        "Fire Engines or Major Foam Tenders": "Major Foam Tender",
        "Airfield Operations Supervisors": "Airfield Operations Supervisors",
        "Airfield Firefighting Command Vehicle": "Airfield FF Command Vehicle",
        "ICCU or Ambulance Control Units or Airfield Firefighting Command Vehicles": "Airfield FF Command Vehicle",
        "Fire Officers or Airfield Firefighting Command Vehicles": "Fire Officer",
    };

    // Only initialize if we are on a mission page
    if (!isMissionPage()) {
        console.log('Not on a mission page, exiting script.');
        return;
    }

    // Create a unified control panel that is movable
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'control-panel';

        // Get the saved position for the panel from localStorage
        const savedLeft = localStorage.getItem('panel-left') || '20px';
        const savedTop = localStorage.getItem('panel-top') || '20px';

        panel.style.position = 'fixed';
        panel.style.left = savedLeft;
        panel.style.top = savedTop;
        panel.style.padding = '10px';
        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        panel.style.color = 'white';
        panel.style.fontSize = '14px';
        panel.style.zIndex = '9999';
        panel.style.border = '2px solid white';
        panel.style.borderRadius = '8px';
        panel.style.width = '300px';
        panel.style.cursor = 'move';
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        panel.style.gap = '10px';

        // Create the drag handle (panel title)
        const dragHandle = document.createElement('div');
        dragHandle.textContent = 'Mission Control';
        dragHandle.style.fontSize = '16px';
        dragHandle.style.fontWeight = 'bold';
        dragHandle.style.textAlign = 'center';
        dragHandle.style.backgroundColor = '#555';
        dragHandle.style.padding = '5px';
        dragHandle.style.cursor = 'move';
        panel.appendChild(dragHandle);

        // Create the status box for status updates
        const statusBox = document.createElement('div');
        statusBox.id = 'status-box';
        statusBox.textContent = 'Ready to start...';
        statusBox.style.backgroundColor = '#444';
        statusBox.style.padding = '8px';
        statusBox.style.borderRadius = '5px';
        panel.appendChild(statusBox);

        // Create Unit Finder button
        const unitFinderBtn = document.createElement('button');
        unitFinderBtn.textContent = 'Unit Finder';
        unitFinderBtn.style.padding = '8px';
        unitFinderBtn.style.backgroundColor = 'orange';
        unitFinderBtn.style.border = 'none';
        unitFinderBtn.style.color = 'black';
        unitFinderBtn.style.borderRadius = '5px';
        unitFinderBtn.style.cursor = 'pointer';
        unitFinderBtn.addEventListener('click', function() {
            updateStatusBox('Unit Finder clicked');
            handleCombinedLogic();
        });
        panel.appendChild(unitFinderBtn);

        // Create Dispatch button
        const dispatchBtn = document.createElement('button');
        dispatchBtn.id = 'dispatch-box';
        dispatchBtn.textContent = 'Dispatch';
        dispatchBtn.style.padding = '8px';
        dispatchBtn.style.backgroundColor = 'grey';
        dispatchBtn.style.border = 'none';
        dispatchBtn.style.color = 'white';
        dispatchBtn.style.borderRadius = '5px';
        dispatchBtn.style.cursor = 'pointer';
        dispatchBtn.addEventListener('click', function() {
            triggerDispatchClick();
        });
        panel.appendChild(dispatchBtn);

        document.body.appendChild(panel);

        // Make the panel draggable
        makePanelDraggable(panel, dragHandle);
    }

    // Function to make the panel draggable
    function makePanelDraggable(panel, dragHandle) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        dragHandle.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = parseInt(window.getComputedStyle(panel).left, 10);
            initialTop = parseInt(window.getComputedStyle(panel).top, 10);

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                panel.style.left = `${initialLeft + dx}px`;
                panel.style.top = `${initialTop + dy}px`;
            }
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            // Save the new position in localStorage
            localStorage.setItem('panel-left', panel.style.left);
            localStorage.setItem('panel-top', panel.style.top);
        }
    }

    // Update the status box
    function updateStatusBox(message) {
        const statusBox = document.getElementById('status-box');
        if (statusBox) {
            statusBox.textContent = message;
        }
    }

    // Change dispatch box color based on status
    function changeDispatchBoxColor(isComplete) {
        const dispatchBox = document.getElementById('dispatch-box');
        if (dispatchBox) {
            if (isComplete) {
                dispatchBox.style.backgroundColor = 'green';
                updateStatusBox('Units ready for dispatch.');
            } else {
                dispatchBox.style.backgroundColor = 'grey';
            }
        }
    }

    // Handle patient selection
    function handlePatientSelector() {
        updateStatusBox('Handling patient selection...');
        const patientCount = findPatientCount();
        if (patientCount > 0) {
            triggerAmbulanceClick(patientCount);
            triggerAmbulanceOfficerClick();
        }
    }

    function findPatientCount() {
        const patientElement = Array.from(document.querySelectorAll('span.badge')).find(span => {
            return span.textContent.toLowerCase().includes("patient");
        });
        if (patientElement) {
            const textContent = patientElement.textContent.trim();
            const numberMatch = textContent.match(/\d+/);
            return numberMatch ? parseInt(numberMatch[0], 10) : 0;
        }
        return 0;
    }

    function triggerAmbulanceOfficerClick() {
        const ambulanceOfficer = document.querySelector('a[search_attribute="Ambulance Officer"]');
        if (ambulanceOfficer) {
            ambulanceOfficer.click();
        }
    }

    function triggerAmbulanceClick(number) {
        const element = document.querySelector('a[search_attribute="Ambulance x 01"]');
        if (element) {
            for (let i = 0; i < number; i++) {
                setTimeout(() => {
                    element.click();
                }, i * 100);
            }
        }
    }

    // Handle vehicles and retry logic
    function processVehicles(vehicleList) {
        const listItems = vehicleList.querySelectorAll('li.class-x');
        let missingUnits = [];

        updateStatusBox('Processing vehicle list...');

        listItems.forEach(item => {
            let unitText = [...item.childNodes]
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent.trim())[0];

            if (!unitText) return;

            let requiredAmount = item.getAttribute('data-amount');
            if (!requiredAmount) return;

            let replacedItemText = crossReference[unitText] || unitText;
            const anchorElement = document.querySelector(`a[search_attribute="${replacedItemText}"]`);

            if (anchorElement) {
                for (let i = 0; i < parseInt(requiredAmount); i++) {
                    anchorElement.click();
                    console.log(`Clicked on: ${replacedItemText} (${i + 1}/${requiredAmount})`);
                }
            } else {
                missingUnits.push(unitText);
            }
        });

        if (missingUnits.length > 0) {
            retryMissingUnits(missingUnits);
        } else {
            changeDispatchBoxColor(true);  // All units assigned, turn dispatch box green
        }
    }

    function retryMissingUnits(missingUnits) {
        updateStatusBox('Retrying missing units...');

        const loadingBar = document.querySelector('a.btn-warning.missing_vehicles_load');
        if (loadingBar) {
            loadingBar.click();
            console.log('Clicked the loading bar for missing units');

            let intervalId = setInterval(() => {
                if (!isLoadingBarVisible()) {
                    clearInterval(intervalId);
                    updateStatusBox('Loading bar completed, retrying missing units...');

                    missingUnits.forEach(unit => {
                        let replacedItemText = crossReference[unit] || unit;
                        const anchorElement = document.querySelector(`a[search_attribute="${replacedItemText}"]`);
                        if (anchorElement) {
                            anchorElement.click();
                            console.log(`Retried and clicked unit: ${unit}`);
                        }
                    });

                    setTimeout(() => {
                        const finalMissingUnits = missingUnits.filter(unit => {
                            const anchorElement = document.querySelector(`a[search_attribute="${crossReference[unit] || unit}"]`);
                            return !anchorElement;
                        });

                        if (finalMissingUnits.length === 0) {
                            changeDispatchBoxColor(true);  // All units assigned, turn dispatch box green
                        } else {
                            alert(`Final missing units:\n\n${finalMissingUnits.join('\n')}`);
                        }
                    }, 1000);
                }
            }, 1000);
        } else {
            alert(`Missing units:\n\n${missingUnits.join('\n')}`);
        }
    }

    function isLoadingBarVisible() {
        const loadingBar = document.querySelector('a.missing_vehicles_load');
        return loadingBar && getComputedStyle(loadingBar).display !== 'none';
    }

    // Combined logic for both patients and vehicles
    function handleCombinedLogic() {
        updateStatusBox('Started combined logic...');
        handlePatientSelector();
        const vehicleHeadings = document.querySelectorAll('h4');
        let vehicleList;

        for (let heading of vehicleHeadings) {
            if (heading.textContent.trim() === 'Vehicles') {
                let nextElem = heading.nextElementSibling;
                while (nextElem && nextElem.tagName !== 'UL') {
                    nextElem = nextElem.nextElementSibling;
                }
                if (nextElem && nextElem.tagName === 'UL') {
                    vehicleList = nextElem;
                    break;
                }
            }
        }

        if (vehicleList) {
            updateStatusBox("Vehicle list found. Processing...");
            processVehicles(vehicleList);
        } else {
            updateStatusBox("No vehicle list found.");
        }
    }

    function triggerDispatchClick() {
        const dispatchArrow = document.querySelector('span.glyphicon.glyphicon-arrow-right');
        if (dispatchArrow) {
            dispatchArrow.click();
            updateStatusBox('Dispatch arrow clicked');
        } else {
            console.error('Dispatch arrow not found.');
        }
    }

    function initialize() {
        createControlPanel();
        clickVehicleDisplayBarImmediately();
    }

    function clickVehicleDisplayBarImmediately() {
        const vehicleDisplayBar = document.querySelector('a.btn-warning.missing_vehicles_load');
        if (vehicleDisplayBar) {
            vehicleDisplayBar.click();
            updateStatusBox("Clicked the 'Vehicle Display Limited' bar immediately.");
        } else {
            updateStatusBox("No vehicle display bar found.");
        }
    }

    window.addEventListener('load', initialize);

})();