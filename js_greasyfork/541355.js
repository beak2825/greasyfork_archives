// ==UserScript==
// @name            Attack screen improvements
// @namespace       http://tampermonkey.net/
// @version         1.2.5
// @description     Improvements to the Attacking screen.
// @author          Cypher-[2641265]
// @license         MIT
// @match           https://www.torn.com/loader.php?sid=attack&user2ID=*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/541355/Attack%20screen%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/541355/Attack%20screen%20improvements.meta.js
// ==/UserScript==
 
// Todo: 
//  -add refresh when leave/mug/hosp window comes up. 
//
// Implemented:
//  -On/offline status icon for defender
//  -Energy display
//  -current status for target (hosp/okay etc with timer)
 
 
(function() {
    'use strict';
 
    // API Key management
    function getAPIKey() {
        return localStorage.getItem('torn_minimal_key');
    }
 
    function setAPIKey(key) {
        localStorage.setItem('torn_minimal_key', key);
    }
 
    const SVGs = {
        Online: `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="-1.5 -1.2 14 14"><circle cx="6" cy="6" r="6" fill="#43d854" stroke="#fff" stroke-width="0"/></svg>`,
        Idle: `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="-1.5 -1.2 14 14"><circle cx="6" cy="6" r="6" fill="#f7c325" stroke="#fff" stroke-width="0"/><rect x="5" y="3" width="4" height="4" fill="#f2f2f2"/></svg>`,
        Offline: `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="-1.5 -1.2 14 14"><circle cx="6" cy="6" r="6" fill="#b3b3b3" stroke="#fff" stroke-width="0"/><rect x="3" y="5" width="6" height="2" fill="#f2f2f2"/></svg>`
    };
 
    const urlParams = new URLSearchParams(window.location.search);
    const userID = urlParams.get('user2ID');
    if (!userID) return;
 
    // Check if API key is available
    let API_KEY = getAPIKey();
    if (!API_KEY) {
        showAPIKeySetup();
        return;
    }
 
    // API Key setup interface
    function showAPIKeySetup() {
        // Create popup immediately without any DOM elements
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '10000';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';

        const dialog = document.createElement('div');
        dialog.style.backgroundColor = '#2a2a2a';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '8px';
        dialog.style.border = '1px solid #444';
        dialog.style.minWidth = '300px';
        dialog.style.textAlign = 'center';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Minimal API';
        input.style.width = '100%';
        input.style.padding = '8px';
        input.style.marginBottom = '15px';
        input.style.backgroundColor = '#1a1a1a';
        input.style.color = 'white';
        input.style.border = '1px solid #444';
        input.style.borderRadius = '4px';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.justifyContent = 'center';

        const getApiButton = document.createElement('button');
        getApiButton.textContent = 'Get API';
        getApiButton.style.padding = '8px 16px';
        getApiButton.style.backgroundColor = '#007bff';
        getApiButton.style.color = 'white';
        getApiButton.style.border = 'none';
        getApiButton.style.borderRadius = '4px';
        getApiButton.style.cursor = 'pointer';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '8px 16px';
        okButton.style.backgroundColor = '#0ea01fff';
        okButton.style.color = 'white';
        okButton.style.border = 'none';
        okButton.style.borderRadius = '4px';
        okButton.style.cursor = 'pointer';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.padding = '8px 16px';
        cancelButton.style.backgroundColor = '#6c757d';
        cancelButton.style.color = 'white';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.cursor = 'pointer';

        getApiButton.addEventListener('click', () => {
            window.open('https://www.torn.com/preferences.php#tab=api', '_blank');
        });

        okButton.addEventListener('click', () => {
            const apiKey = input.value.trim();
            if (apiKey) {
                setAPIKey(apiKey);
                API_KEY = apiKey;
                overlay.remove();
                initializeScript();
            }
        });

        cancelButton.addEventListener('click', () => {
            overlay.remove();
        });

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        });

        // Enter key submits
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                okButton.click();
            }
        });

        buttonContainer.appendChild(getApiButton);
        buttonContainer.appendChild(okButton);
        buttonContainer.appendChild(cancelButton);
        dialog.appendChild(input);
        dialog.appendChild(buttonContainer);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // Focus the input
        input.focus();
    }    // Initialize script features
    function initializeScript() {
        // Initial fetches
        fetchDefenderStatus();
        fetchAttackerEnergy();
    }
 
    // Unified refresh function for all elements
    function refreshAllData() {
        fetchDefenderStatus();
        fetchAttackerEnergy();
    }
 
    // Fetch defender status
    function fetchDefenderStatus() {
        fetch(`https://api.torn.com/user/${userID}?selections=profile&key=${API_KEY}&comment=attackpageimprovements`)
            .then(res => res.json())
            .then(data => {
                if (!data) return;
                
                // Handle online/offline status icon
                if (data.last_action && data.last_action.status) {
                    const state = data.last_action.status;
                    const svg = SVGs[state] || SVGs.Offline;
 
                    function insertIcon() {
                        const usernameElement = document.querySelector('div[class*="rose"] .user-name');
                        if (usernameElement) {
                            // Remove existing icon if present
                            const existingIcon = usernameElement.parentNode.querySelector('.torn-status-icon');
                            if (existingIcon) {
                                existingIcon.remove();
                            }
                            
                            const iconSpan = document.createElement('span');
                            iconSpan.className = 'torn-status-icon';
                            iconSpan.innerHTML = svg;
                            iconSpan.style.verticalAlign = "middle";
                            iconSpan.style.marginRight = "4px";
                            iconSpan.style.cursor = "pointer";
                            iconSpan.title = state + " - Click to refresh";
                            
                            // Add click handler to refresh defender status
                            iconSpan.addEventListener('click', () => {
                                refreshAllData();
                            });
                            
                            usernameElement.parentNode.insertBefore(iconSpan, usernameElement);
                        } else {
                            setTimeout(insertIcon, 200);
                        }
                    }
                    insertIcon();
                }
 
                // Handle health status display
                if (data.status && data.status.state) {
                    const statusState = data.status.state;
                    const statusColor = data.status.color || 'gray';
                    const statusUntil = data.status.until;
 
                    function insertHealthStatus() {
                        const usernameElement = document.querySelector('div[class*="rose"] .user-name');
                        if (usernameElement) {
                            // Remove existing health status if present
                            const existingHealthStatus = usernameElement.parentNode.querySelector('.torn-health-status');
                            if (existingHealthStatus) {
                                existingHealthStatus.remove();
                            }
                            
                            const healthContainer = document.createElement('span');
                            healthContainer.className = 'torn-health-status';
                            healthContainer.style.marginLeft = '8px';
                            healthContainer.style.fontSize = '0.85em';
                            healthContainer.style.fontWeight = 'bold';
                            healthContainer.style.cursor = 'pointer';
                            
                            // Color mapping for different states
                            const colorMap = {
                                'red': '#dc3545',
                                'orange': '#fd7e14', 
                                'yellow': '#ffc107',
                                'green': '#28a745',
                                'blue': '#007bff',
                                'gray': '#6c757d'
                            };
                            
                            healthContainer.style.color = colorMap[statusColor] || '#6c757d';
                            
                            // Add click handler for refresh
                            healthContainer.addEventListener('click', () => {
                                // Check if the display shows "Click to refresh"
                                if (healthContainer.textContent.includes("Click to refresh")) {
                                    // Timer expired, refresh whole page
                                    location.reload();
                                } else {
                                    // Timer still active, refresh all data
                                    refreshAllData();
                                }
                            });
                            
                            function updateCountdown() {
                                let displayText = statusState;
                                
                                // Add countdown timer if available
                                if (statusUntil) {
                                    const currentTime = Math.floor(Date.now() / 1000);
                                    const timeRemaining = statusUntil - currentTime;
                                    
                                    if (timeRemaining > 0) {
                                        const hours = Math.floor(timeRemaining / 3600);
                                        const minutes = Math.floor((timeRemaining % 3600) / 60);
                                        const seconds = timeRemaining % 60;
                                        
                                        if (hours > 0) {
                                            displayText += ` (${hours}h ${minutes}m)`;
                                        } else if (minutes > 0) {
                                            displayText += ` (${minutes}m ${seconds}s)`;
                                        } else {
                                            displayText += ` (${seconds}s)`;
                                        }
                                    } else {
                                        // Timer expired, show click to refresh message
                                        displayText = statusState + " - Click to refresh";
                                        healthContainer.style.textDecoration = 'underline';
                                    }
                                }
                                
                                healthContainer.textContent = displayText;
                            }
                            
                            // Initial update
                            updateCountdown();
                            
                            // Update countdown every second if there's a timer
                            if (statusUntil) {
                                setInterval(updateCountdown, 1000);
                            }
                            
                            usernameElement.parentNode.insertBefore(healthContainer, usernameElement.nextSibling);
                        } else {
                            setTimeout(insertHealthStatus, 200);
                        }
                    }
                    insertHealthStatus();
                }
            });
    }
 
    // Initial fetch
    fetchDefenderStatus();
 
    // Fetch attacker energy
    function fetchAttackerEnergy() {
        fetch(`https://api.torn.com/user/?selections=bars&key=${API_KEY}&comment=attackerEnergy&comment=attackpageimprovements`)
            .then(res => res.json())
            .then(data => {
                if (!data || !data.energy) return;
                const currentEnergy = data.energy.current;
                const maxEnergy = data.energy.maximum;
 
                function insertEnergyDisplay() {
                    const attackerUsernameElement = document.querySelector('div[class*="green"] .user-name');
                    if (attackerUsernameElement) {
                        // Remove existing energy display if present
                        const existingEnergyDisplay = attackerUsernameElement.parentNode.querySelector('.torn-energy-display');
                        if (existingEnergyDisplay) {
                            existingEnergyDisplay.remove();
                        }
                        
                        const energyContainer = document.createElement('div');
                        energyContainer.className = 'torn-energy-display';
                        energyContainer.style.display = 'inline-block';
                        energyContainer.style.marginLeft = '8px';
                        energyContainer.style.verticalAlign = 'middle';
                        energyContainer.style.cursor = 'pointer';
                        energyContainer.title = `Energy: ${currentEnergy}/${maxEnergy} - Click to refresh, Long press to change API key`;

                        // Long press functionality for API key change
                        let longPressTimer;
                        let isLongPress = false;

                        energyContainer.addEventListener('mousedown', () => {
                            isLongPress = false;
                            longPressTimer = setTimeout(() => {
                                isLongPress = true;
                                showAPIKeySetup();
                            }, 1000); // 1 second long press
                        });

                        energyContainer.addEventListener('mouseup', () => {
                            clearTimeout(longPressTimer);
                        });

                        energyContainer.addEventListener('mouseleave', () => {
                            clearTimeout(longPressTimer);
                        });

                        // Touch events for mobile
                        energyContainer.addEventListener('touchstart', (e) => {
                            e.preventDefault();
                            isLongPress = false;
                            longPressTimer = setTimeout(() => {
                                isLongPress = true;
                                showAPIKeySetup();
                            }, 1000);
                        });

                        energyContainer.addEventListener('touchend', (e) => {
                            e.preventDefault();
                            clearTimeout(longPressTimer);
                            // If it wasn't a long press, treat as regular click
                            if (!isLongPress) {
                                refreshAllData();
                            }
                        });

                        energyContainer.addEventListener('touchcancel', () => {
                            clearTimeout(longPressTimer);
                        });

                        // Regular click handler (for mouse)
                        energyContainer.addEventListener('click', (e) => {
                            // Only refresh if it wasn't a long press
                            if (!isLongPress) {
                                refreshAllData();
                            }
                        });                        // Create progress bar container
                        const progressContainer = document.createElement('div');
                        progressContainer.style.position = 'relative';
                        progressContainer.style.width = '80px';
                        progressContainer.style.height = '12px';
                        progressContainer.style.backgroundColor = '#2a2a2a';
                        progressContainer.style.borderRadius = '8px';
                        progressContainer.style.overflow = 'hidden';
                        progressContainer.style.border = '1px solid #444';
 
                        // Create progress bar fill
                        const progressBar = document.createElement('div');
                        const percentage = (currentEnergy / maxEnergy) * 100;
                        progressBar.style.width = `${percentage}%`;
                        progressBar.style.height = '100%';
                        progressBar.style.backgroundColor = '#0ea01fff';
                        progressBar.style.borderRadius = '8px';
                        progressBar.style.transition = 'width 0.3s ease';
 
                        // Create text display (overlaid on bar)
                        const textDisplay = document.createElement('span');
                        textDisplay.textContent = `${currentEnergy}/${maxEnergy}`;
                        textDisplay.style.position = 'absolute';
                        textDisplay.style.top = '50%';
                        textDisplay.style.left = '50%';
                        textDisplay.style.transform = 'translate(-50%, -50%)';
                        textDisplay.style.fontSize = '10px';
                        textDisplay.style.color = '#fff';
                        textDisplay.style.fontWeight = 'bold';
                        textDisplay.style.textShadow = '1px 1px 2px rgba(0,0,0,0.8)';
                        textDisplay.style.zIndex = '10';
 
                        progressContainer.appendChild(progressBar);
                        progressContainer.appendChild(textDisplay);
                        energyContainer.appendChild(progressContainer);
 
                        attackerUsernameElement.parentNode.insertBefore(energyContainer, attackerUsernameElement.nextSibling);
                    } else {
                        setTimeout(insertEnergyDisplay, 200);
                    }
                }
                insertEnergyDisplay();
            });
    }
 
    // Initialize script if API key is available
    if (API_KEY) {
        initializeScript();
    }
})();