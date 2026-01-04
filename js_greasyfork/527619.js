// ==UserScript==
// @name         KTW1 Gate Assigner
// @namespace    tampermonkey.net/
// @version      2.2
// @description  Add buttons to assign gates for VRIDs in Sesame
// @author       @nowaratn
// @match        https://trans-logistics-eu.amazon.com/yms/sesameGateConsole*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/527619/KTW1%20Gate%20Assigner.user.js
// @updateURL https://update.greasyfork.org/scripts/527619/KTW1%20Gate%20Assigner.meta.js
// ==/UserScript==

(function() {
    'use strict';


    let refreshInterval;
    let statusWindow;

    // Create and add status window
    function createStatusWindow() {
        statusWindow = document.createElement('div');
        statusWindow.id = 'gateAssignerStatus';
        statusWindow.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #232F3E;
            color: white;
            padding: 10px;
            border-radius: 4px;
            z-index: 9999;
            font-size: 12px;
            width: 200px;
        `;
        document.body.appendChild(statusWindow);
        updateStatus('Idle');
    }

    // Update status window
    function updateStatus(message) {
        if (statusWindow) {
            const timestamp = new Date().toLocaleTimeString();
            statusWindow.innerHTML = `
                <strong>Gate Assigner Status:</strong><br>
                ${message}<br>
                <small>Last update: ${timestamp}</small>
            `;
        }
    }

    // Toggle auto-refresh
    function toggleAutoRefresh(button) {
        if (refreshInterval) {
            clearInterval(refreshInterval);
            refreshInterval = null;
            button.textContent = 'Start Auto-Assign';
            button.style.backgroundColor = '#232F3E';
            updateStatus('Auto-assign stopped');
        } else {
            assignGate(); // Run immediately
            refreshInterval = setInterval(assignGate, 5 * 60 * 1000); // Run every 5 minutes
            button.textContent = 'Stop Auto-Assign';
            button.style.backgroundColor = '#c41e3a';
            updateStatus('Auto-assign running (5min interval)');
        }
    }

    async function assignGate() {

        updateStatus('assignGate in progress.');
        const login = document.getElementsByClassName('a-color-link a-text-bold')[0].innerText.trim();

        // Get accountId and customerId from page scripts
        const scripts = document.getElementsByTagName('script');
        let accountId = '';
        let customerId = '';
        let sesameToken = '';

        for (let script of scripts) {
            const scriptContent = script.textContent;
            if (scriptContent.includes('activeAccountId')) {
                accountId = scriptContent.match(/activeAccountId":".*?"([A-Z0-9]+)"/)[1];
            }
            if (scriptContent.includes('customerId')) {
                customerId = scriptContent.match(/customerId":".*?"([A-Z0-9]+)"/)[1];
            }
            if (scriptContent.includes('sesameSessionToken')) {
                sesameToken = scriptContent.match(/sesameSessionToken":".*?"(eyJ[^"]+)"/)[1];
                console.log(sesameToken);
            }
        }

        // Funkcja pomocnicza do sprawdzania aktualnej zmiany
        function getCurrentShift() {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const currentTime = hours * 100 + minutes; // format HHMM

            if (currentTime >= 700 && currentTime < 1730) {
                return 'DS'; // Day Shift
            } else if (currentTime >= 1830 || currentTime < 500) {
                return 'NS'; // Night Shift
            } else {
                return 'BETWEEN'; // Między zmianami
            }
        }

        // Funkcja do obliczania endTime
        function calculateEndTime() {
            const now = new Date();
            const shift = getCurrentShift();
            const endTime = new Date(now);

            if (shift === 'DS') {
                endTime.setHours(17, 30, 0, 0);
                if (now.getHours() >= 17 && now.getMinutes() >= 30) {
                    endTime.setDate(endTime.getDate() + 1);
                }
            } else if (shift === 'NS') {
                endTime.setHours(5, 0, 0, 0);
                if (now.getHours() < 5) {
                    endTime.setDate(endTime.getDate());
                } else {
                    endTime.setDate(endTime.getDate() + 1);
                }
            } else {
                // Jeśli między zmianami, ustaw na koniec następnej zmiany
                if (now.getHours() >= 17) {
                    endTime.setHours(5, 0, 0, 0);
                    endTime.setDate(endTime.getDate() + 1);
                } else {
                    endTime.setHours(17, 30, 0, 0);
                }
            }

            return Math.floor(endTime.getTime() / 1000);
        }

        // Główny payload
        const listLoadsPayload = {
            "buildingCode": "KTW1",
            "yardId": "amzn1.ydlr.yard.EU.36b58cd1-692a-e221-c759-c90b7d32f280",
            "startTime": Math.floor(Date.now() / 1000),
            "endTime": calculateEndTime(),
            "context": {
                "requester": "GEM",
                "login": login,
                "accountId": accountId,
                "customerId": customerId
            }
        };

        console.log(JSON.stringify(listLoadsPayload));

        const gateMappings = {
            // TSO/CRITS
            'TSO': {
                'KTW1->NUE1': ['DD138', 'DD139', 'DD137'],
                'KTW1->BRE4': ['DD138', 'DD139', 'DD137'],
                'KTW1->POZ2': ['DD138', 'DD139', 'DD137'],
                'KTW1->DUS4': ['DD138', 'DD139', 'DD137'],
                'KTW1->RSWR': ['DD138', 'DD139', 'DD137'],
                'KTW1->RKTW': ['DD138', 'DD139', 'DD137'],
                'KTW1->FRA7': ['DD138', 'DD139', 'DD137'],

                'KTW1->KTW3': ['DD138', 'DD139', 'DD137'],
                'KTW1->BRQ2': ['DD138', 'DD139', 'DD137'],
                'KTW1->CGN1': ['DD138', 'DD139', 'DD137'],
                'KTW1->FRA3': ['DD138', 'DD139', 'DD137'],
                'KTW1->DTM8': ['DD138', 'DD139', 'DD137'],
                'KTW1->XAR1': ['DD138', 'DD139', 'DD137'],
                'KTW1->XNLA': ['DD138', 'DD139', 'DD137'],
                'KTW1->WRO2': ['DD138', 'DD139', 'DD137'],
                'KTW1->PRG2': ['DD138', 'DD139', 'DD137'],
                'KTW1->SGDN->SNYN->XAR1': ['DD138', 'DD139', 'DD137'],
            },

            // WD
            'WD': {
                'KTW1->CC-DPDD-GUDENS14-DE-H2': ['DD132', 'DD133', 'DD134'],
                'KTW1->CC-D016-DPDD-ASCHAF16-DE-H2': ['DD132', 'DD133', 'DD134'],
                'KTW1->CC-DPDD-DUISB147-DE-H2': ['DD132', 'DD133', 'DD134'],
                'KTW1->CC-DPDD-NUERN190-DE-H2': ['DD132', 'DD133', 'DD134'],
                'KTW1->CC-DHLX-OZAROWIC-PL-H1': ['DD134', 'DD133', 'DD132'],
                'KTW1->CC-UPS-KATOWICE-PL-H1': ['DD134', 'DD133', 'DD132'],
                'KTW1->LH-KZ41-DHPL-ZABRZE-PL-H1': ['DD134', 'DD133', 'DD132'],
                'KTW1->CC-KN-LEIPZIG-DE-VR': ['DD140', 'DD141', 'DD143'],
                'KTW1->CC-KN-KATOWICE-PL-VR': ['DD140', 'DD141', 'DD143'],
                'KTW1->CC-UPS-KATOWICE-PL-VR': ['DD140', 'DD141', 'DD143'],
                'KTW1->CC-DHLF-TYCHY-PL-VR': ['DD140', 'DD141', 'DD143'],
                'KTW1->LH-HAJ8': ['DD143', 'DD144', 'DD145'],
                'KTW1->LH-MHG9': ['DD143', 'DD144', 'DD145'],
                'KTW1->AIR-KTW3-LEJA-LEBL': ['DD143', 'DD144', 'DD145'],
                'KTW1->LH-IP97-INPO-PIOTRKOW-PL-H1': ['DD144', 'DD145', 'DD143'],
                'KTW1->LH-KZ41-DHPL-ZABRZE-PL-H2': ['DD145', 'DD144', 'DD134'],
                'KTW1->LH-LIN8': ['DD161', 'DD162', 'DD160'],
                'KTW1->LH-DTM9': ['DD146', 'DD145', 'DD144'],
                'KTW1->LH-NUE9': ['DD146', 'DD145', 'DD144'],
                'KTW1->AMZL-DVI1-ND': ['DD146', 'DD145', 'DD144'],
                'KTW1->LH-DTM8': ['DD146', 'DD145', 'DD144'],
                'KTW1->LH-BER8': ['DD145', 'DD144', 'DD146'],
                'KTW1->LH-PRG9': ['DD158', 'DD159', 'DD160'],
                'KTW1->CC-ATPO-HAGENBRU-AT-H1': ['DD159', 'DD160', 'DD161'],
                'KTW1->AMZL-DBE3-ND': ['DD160', 'DD161', 'DD159'],
                'KTW1->CC-ATPO-KALSDORF-AT-H2-ND': ['DD161', 'DD162', 'DD160'],
                'KTW1->LH-HEKE-HRMS-KETZIN-DE-H1': ['DD162', 'DD163', 'DD161'],
                'KTW1->LH-LEJ7': ['DD162', 'DD163', 'DD161'],
                'KTW1->CC-JLI-WROCLAW-PL-VR': ['DD140', 'DD141', 'DD143'],
                'KTW1->CC-ATPO-WIEN-AT-H2-ND': ['DD163', 'DD164', 'DD162'],
                'KTW1->CC-ATPO-ALLHAMIN-AT-H2-ND': ['DD164', 'DD163', 'DD162'],
                'KTW1->CC-MIGL-PECICE-PL-VR': ['DD140', 'DD141', 'DD143'],
                'KTW1->CC-DE04-DEPO-RADEFELD-DE-H1': ['DD134', 'DD133', 'DD164'],
                'KTW1->LEJ7': ['DD161', 'DD162', 'DD160'],
                'KTW1->LH-HHN9': ['DD162', 'DD163', 'DD161'],
                'KTW1->AMZL-DSY1-ND': ['DD160', 'DD159', 'DD161'],
                'KTW1->AMZL-DBB1-ND': ['DD146', 'DD145', 'DD144'],
                'KTW1->LH-HAJX': ['DD161', 'DD160', 'DD159'],
                'KTW1->AMZL-DSY2-ND': ['DD160', 'DD161', 'DD159'],
                'KTW1->LH-BLQ8': ['DD143', 'DD141', 'DD140'],
                'KTW1->RAIL-LH-RKTW-DTM9': ['DD143', 'DD144', 'DD141'],
                'KTW1->RAIL-LH-RKTW-DTM8': ['DD141', 'DD140', 'DD143'],
                'KTW1->LH-FCO9': ['DD146', 'DD145', 'DD144'],
                'KTW1->CC-DE08-DEPO-REINSDOR-DE-H1': ['DD162', 'DD161', 'DD163'],
                'KTW1->LH-MUC7': ['DD143', 'DD144', 'DD141'],
                'KTW1->CC-DP08-DP-NEUMARK-DE-H2': ['DD158', 'DD159', 'DD160'],
                'KTW1->CC-DP17-DP-NEUSTREL-DE-H2': ['DD159', 'DD158', 'DD160'],
                'KTW1->LH-MHG7': ['DD159', 'DD160', 'DD158']
            }
        };

        const shipperAccountMappings = {
            'ATSWarehouseTransfers': 'TSO',
            'ATSOutbound': 'WD',
            'ATSWarehouseTransfersIntermodal': 'TSO',
            'OutboundCarrierManagedLinehaulTheyPay': 'WD',
            'OutboundVendorReturns': 'WD'
        };

        try {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://sesamegateservice-eu-ext.amazon.com/listLoadsWithInYardDestinationMetadata',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8',
                    'x-amz-yardtech-sesame-sessionToken': sesameToken
                },
                data: JSON.stringify(listLoadsPayload),
                onload: async function(loadResponse) {
                    updateStatus('Loaded data.');
                    const loadData = JSON.parse(loadResponse.responseText);
                    console.log(loadData);

                    for (const load of loadData.loadsWithInYardDestinationMetadata) {
                        const vrid = load.load.identifiers.find(id => id.type === 'VR_ID')?.identifier;

                        if (!vrid) continue;

                        // Determine which gate set to use based on ShipperAccount
                        let gateSet = 'WD'; // default

                        if (load.load.shipperAccounts.includes('OutboundVendorReturns')) {
                            gateSet = 'WD';
                        }
                        else if (load.load.shipperAccounts.includes('ATSOutbound')) {
                            gateSet = 'WD';
                        }
                        else if (load.load.shipperAccounts.includes('ATSWarehouseTransfersIntermodal')) {
                            gateSet = 'TSO';
                        }
                        else if (load.load.shipperAccounts.includes('ATSWarehouseTransfers')) {
                            gateSet = 'TSO';
                        }
                        else if (load.load.shipperAccounts.includes('OutboundCarrierManagedLinehaulTheyPay')) {
                            gateSet = 'WD';
                        }
                        else if (load.load.shipperAccounts.includes('OutboundVendorReturns')) {
                            gateSet = 'WD';
                        }



                        // Check if gates are already assigned
                        if (load.destination && load.destinationList) {
                            const existingGatesCount = load.destinationList.length;
                            if (existingGatesCount >= 3) {
                                console.log(`Skipping VRID ${vrid} - already has ${existingGatesCount} gates assigned`);
                                continue;
                            }
                        }

                        updateStatus('Sprawdzono VRIDy.');
                        const routes = load.load.routes;
                        for (const route of routes) {
                            const gates = gateMappings[gateSet]?.[route];
                            if (gates) {
                                // Rest of the gate assignment logic remains the same
                                const loadPlan = load.load.plan.identifier;
                                const destinationList = gates.map(gate => ({
                                    identifier: gate,
                                    label: gate,
                                    positionType: "PROCESSING"
                                }));

                                const assignGatePayload = {
                                    "buildingCode": "KTW1",
                                    "loadIdentifiers": [{
                                        "identifier": vrid,
                                        "type": "VR_ID"
                                    }],
                                    "plan": {
                                        "identifier": loadPlan,
                                        "isa": null,
                                        "status": null
                                    },
                                    "destination": {
                                        "identifier": gates[0],
                                        "label": gates[0],
                                        "positionType": "PROCESSING"
                                    },
                                    "destinationList": destinationList,
                                    "context": {
                                        "requester": "GEM",
                                        "login": login,
                                        "accountId": accountId,
                                        "customerId": customerId
                                    }
                                };

                                console.log(loadPlan);
                                console.log(JSON.stringify(assignGatePayload));

                                GM_xmlhttpRequest({
                                    method: 'POST',
                                    url: 'https://sesamegateservice-eu-ext.amazon.com/updateInYardDestinationAssignmentForLoad',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'x-amz-yardtech-sesame-sessionToken': sesameToken
                                    },
                                    data: JSON.stringify(assignGatePayload),
                                    onload: function(assignResponse) {
                                        if (assignResponse.status === 200) {
                                            console.log(`Successfully assigned gates ${gates.join(', ')} to VRID ${vrid} for route ${route}`);
                                        } else {
                                            console.error(`Failed to assign gates for VRID ${vrid} and route ${route}`);
                                        }
                                    },
                                    onerror: function(error) {
                                        console.error('Error in gate assignment request:', error);
                                    }
                                });
                            }
                        }
                    }

                    updateStatus('Done, teraz czekam.');
                },
                onerror: function(error) {
                    updateStatus('Error in load data request');
                    console.error('Error in load data request:', error);
                }
            });

            updateStatus('Wszystko przypisane.');
        } catch (error) {
            updateStatus('Error assigning gates');
            console.error('Error assigning gates:', error);
        }
    }


    // Modified addMainButton function
    function addMainButton() {
        const header = document.querySelector('.css-1cg3fpa');
        if (header && !document.getElementById('assignAllGates')) {
            const mainButton = document.createElement('button');
            mainButton.id = 'assignAllGates';
            mainButton.textContent = 'Start Auto-Assign';
            mainButton.style.cssText = `
                margin: 10px;
                padding: 10px 20px;
                background-color: #232F3E;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            `;
            mainButton.onclick = () => toggleAutoRefresh(mainButton);
            header.parentNode.insertBefore(mainButton, header.nextSibling);

            // Create status window if it doesn't exist
            if (!document.getElementById('gateAssignerStatus')) {
                createStatusWindow();
            }
        }
    }

    // Run initially and set up observer for dynamic content
    addMainButton();
    const observer = new MutationObserver(() => {
        addMainButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup on page unload
    window.addEventListener('unload', () => {
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }
    });

})();










