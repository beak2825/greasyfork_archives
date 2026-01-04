// ==UserScript==
// @name         CRM to Notion Integration
// @namespace    crm-notion-integration
// @version      2.4
// @description  Add CRM tickets to Notion database via Google Apps Script proxy
// @author       You
// @match        https://expert-portal.com/*
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546784/CRM%20to%20Notion%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/546784/CRM%20to%20Notion%20Integration.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your DEPLOYED Google Apps Script Web App URL - UPDATE THIS WITH YOUR ACTUAL GAS URL
    // It typically looks like: https://script.google.com/macros/s/<YOUR_SCRIPT_ID>/exec
    const PROXY_API_URL = 'https://script.google.com/macros/s/AKfycbwhOn6VKov6_mfH8bpv7ymyprLoAep88Im1C-XBoN5dmRvmkOngWL4qiNxvGUOKkALH/exec'; // <-- UPDATE THIS

    // Request types - your specific categories
    const REQUEST_TYPES = [
        'Legal danger',
        'Account or card deletion',
        'Minor user (only for non-Ukrainian experts)',
        'Very angry user (only for non-Ukrainian experts)',
        'Sensitive'
    ];

    // --- New: Helper function to wait for an element ---
    function waitForElement(selector, timeout = 10000, interval = 500) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const check = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                } else {
                    setTimeout(check, interval);
                }
            };
            check();
        });
    }

    // --- Updated: Function to create and position the Notion integration button ---
    function createNotionButton() {
        console.log("CRM Notion Integration: Attempting to create Notion button...");

        // Remove existing button if it exists to prevent duplicates
        const existingButton = document.getElementById('notion-report-button');
        if (existingButton) {
            console.log("CRM Notion Integration: Removing existing button");
            existingButton.remove();
        }

        const button = document.createElement('button');
        button.textContent = '📋 Report ticket';
        button.id = 'notion-report-button';
        button.style.cssText = `
            background: #2196F3;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            box-shadow: 0 2px 4px rgba(33, 150, 243, 0.2);
            z-index: 10000;
            white-space: nowrap;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            height: 32px;
            transition: all 0.2s ease;
            margin: 0 5px; /* Add some margin for spacing */
        `;

        // Enhanced hover effects
        button.addEventListener('mouseenter', () => {
            button.style.background = '#1976D2';
            button.style.transform = 'translateY(-1px)';
            button.style.boxShadow = '0 4px 8px rgba(33, 150, 243, 0.3)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = '#2196F3';
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 2px 4px rgba(33, 150, 243, 0.2)';
        });

        button.addEventListener('click', openNotionDialog);

        // --- Updated: Simplified and targeted positioning logic ---
        function positionButton() {
            try {
                console.log("CRM Notion Integration: Trying to position button dynamically...");
                // Strategy: Target the specific container div based on the observed HTML structure
                // This targets the div containing the Customer Info header and action buttons
                const targetContainerSelector = 'div.css-146c5nk'; // Based on the provided HTML snippet
                let targetContainer = document.querySelector(targetContainerSelector);

                if (!targetContainer) {
                    // Fallback 1: Look for the Customer Info header itself and its parent
                    const customerInfoHeader = Array.from(document.querySelectorAll('h2'))
                        .find(h => h.textContent && h.textContent.trim() === 'Customer Info');
                    if (customerInfoHeader) {
                        targetContainer = customerInfoHeader.closest('div'); // Get the parent div
                    }
                }

                if (!targetContainer) {
                    // Fallback 2: Look for a div containing the Zendesk button text
                    const zendeskTextElement = Array.from(document.querySelectorAll('*'))
                        .find(el => el.textContent?.trim() === 'Export to Zendesk');
                    if (zendeskTextElement) {
                        targetContainer = zendeskTextElement.closest('div.css-146c5nk') || zendeskTextElement.parentElement;
                    }
                }

                if (targetContainer) {
                    console.log("CRM Notion Integration: Found target container, appending button.");
                    // Append the button to the end of the container's children
                    targetContainer.appendChild(button);
                    return true; // Success
                } else {
                    console.log("CRM Notion Integration: Could not find a suitable dynamic container.");
                    return false; // Failure
                }
            } catch (error) {
                console.error("CRM Notion Integration: Error in dynamic positioning logic:", error);
                return false; // Failure
            }
        }

        function applyFallbackPosition() {
    console.log("CRM Notion Integration: Applying smart fallback positioning...");

    // First try to find a button with "Report" text (case-insensitive)
    const reportButton = Array.from(document.querySelectorAll('button, a, span'))
        .find(el => {
            const text = el.textContent || '';
            return text.trim().toLowerCase().includes('report');
        });

    if (reportButton) {
        console.log("CRM Notion Integration: Found 'Report' button, positioning Notion button to its left.");

        // Get the parent container of the reference button
        const container = reportButton.parentElement;

        // Create a spacer element for consistent spacing
        const spacer = document.createElement('span');
        spacer.style.margin = '0 5px';
        spacer.style.display = 'inline-block';

        // Insert the Notion button and spacer before the reference button
        container.insertBefore(spacer, reportButton);
        container.insertBefore(button, spacer);

        // Ensure proper inline display
        button.style.display = 'inline-flex';

        console.log('CRM Notion Integration: ✅ Button added to the left of "Report" button.');
    }
    // Fallback to Zendesk button if no Report button found
    else {
        const zendeskButton = Array.from(document.querySelectorAll('button, a'))
            .find(el => {
                const text = el.textContent || '';
                return text.trim().toLowerCase().includes('zendesk');
            });

        if (zendeskButton) {
            console.log("CRM Notion Integration: Found 'Zendesk' button as secondary reference.");

            const container = zendeskButton.parentElement;
            const spacer = document.createElement('span');
            spacer.style.margin = '0 5px';
            spacer.style.display = 'inline-block';

            container.insertBefore(spacer, zendeskButton);
            container.insertBefore(button, spacer);

            button.style.display = 'inline-flex';

            console.log('CRM Notion Integration: ✅ Button added to the left of "Zendesk" button.');
        }
        // Final fallback: fixed positioning
        else {
            console.log("CRM Notion Integration: Could not find reference buttons. Using fixed positioning fallback.");
            button.style.position = 'fixed';
            button.style.top = '150px';
            button.style.right = '20px';
            button.style.zIndex = '10000';
            document.body.appendChild(button);
            console.log('CRM Notion Integration: 🔄 Button added using fallback fixed positioning.');
        }
    }
}

        // Try positioning with multiple attempts and delays
        let attempts = 0;
        const maxAttempts = 8; // Try for 8 * 1.5s = 12 seconds
        const attemptInterval = 1500; // 1.5 seconds

        const tryPositioning = () => {
            attempts++;
            console.log(`CRM Notion Integration: Positioning attempt ${attempts}/${maxAttempts}`);
            if (positionButton()) {
                console.log("CRM Notion Integration: ✅ Button successfully positioned dynamically.");
            } else if (attempts < maxAttempts) {
                console.log(`CRM Notion Integration: Attempt ${attempts} failed, retrying in ${attemptInterval}ms...`);
                setTimeout(tryPositioning, attemptInterval);
            } else {
                console.log("CRM Notion Integration: All dynamic positioning attempts failed. Using fallback.");
                applyFallbackPosition();
            }
        };

        // Start the positioning attempts after a short delay to allow page elements to load
        setTimeout(tryPositioning, 2000);
    }

    // Function to get current page URL
    function getCurrentTicketUrl() {
        return window.location.href;
    }

    // Function to create and show the dialog
    function openNotionDialog() {
        const ticketUrl = getCurrentTicketUrl();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10001;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // Create dialog
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;

        dialog.innerHTML = `
            <h2 style="margin-top: 0; color: #333;">Report Ticket to Notion Database</h2>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Link to a ticket:</label>
                <input type="text" id="ticketLink" value="${ticketUrl}" readonly
                       style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f5f5f5;">
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Type of request:</label>
                <select id="requestType" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="">Select type...</option>
                    ${REQUEST_TYPES.map(type => `<option value="${type}">${type}</option>`).join('')}
                </select>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Details:</label>
                <textarea id="ticketDetails" rows="4"
                          style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;"
                          placeholder="Essential context (e.g., type of sensitive information, timestamps)..."></textarea>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="isConfirmed" style="margin-right: 8px;">
                    <span style="font-weight: bold;">Confirmed?</span>
                    <span style="font-size: 12px; color: #666; margin-left: 8px;">(only for account or card deletion requests)</span>
                </label>
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="cancelBtn" style="padding: 10px 20px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">
                    Cancel
                </button>
                <button id="submitBtn" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Report to Notion
                </button>
            </div>

            <div id="status" style="margin-top: 15px; padding: 10px; border-radius: 4px; display: none;"></div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Event listeners
        document.getElementById('cancelBtn').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        document.getElementById('submitBtn').addEventListener('click', submitToNotion);

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }

    // --- Updated: Function to submit data to Notion via Google Apps Script proxy ---
    function submitToNotion() {
        const ticketLink = document.getElementById('ticketLink').value;
        const requestType = document.getElementById('requestType').value;
        const details = document.getElementById('ticketDetails').value;
        const isConfirmed = document.getElementById('isConfirmed').checked;
        const statusDiv = document.getElementById('status');

        // Validation
        if (!requestType) {
            statusDiv.style.display = 'block';
            statusDiv.style.background = '#fff3cd';
            statusDiv.style.color = '#856404';
            statusDiv.textContent = '⚠️ Please select a type of request';
            return;
        }

        // Show loading status
        statusDiv.style.display = 'block';
        statusDiv.style.background = '#e3f2fd';
        statusDiv.style.color = '#1976d2';
        statusDiv.textContent = 'Adding to Notion...';

        // Prepare payload for Google Apps Script proxy
        const payload = {
            ticketLink,
            requestType,
            details,
            isConfirmed
        };

        console.log('CRM Notion Integration: Sending payload to GAS proxy:', JSON.stringify(payload, null, 2));

        // --- Updated: Make API request to Google Apps Script Web App ---
        GM_xmlhttpRequest({
            method: 'POST',
            url: PROXY_API_URL,
            headers: {
                'Content-Type': 'application/json',
                // 'Cache-Control': 'no-cache' // Sometimes helpful
            },
            data: JSON.stringify(payload), // Ensure data is a string
            onload: function (response) {
                console.log('CRM Notion Integration: GAS API Response:', response.status, response.responseText);
                let responseJson;
                try {
                    // Parse the JSON response from GAS
                    responseJson = JSON.parse(response.responseText);
                } catch (e) {
                    console.error("CRM Notion Integration: Failed to parse response JSON from GAS", e);
                    // Handle case where GAS might return an error page (HTML) instead of JSON
                    responseJson = {
                        success: false,
                        message: `Invalid response from proxy (Status: ${response.status}). Check GAS logs.`
                    };
                }

                if (response.status === 200 && responseJson.success === true) {
                    statusDiv.style.background = '#e8f5e8';
                    statusDiv.style.color = '#2e7d32';
                    statusDiv.textContent = '✅ Successfully added to Notion database!';
                    setTimeout(() => {
                        // Use a more robust way to find and remove the overlay
                        const overlays = document.querySelectorAll('[style*="rgba(0,0,0,0.5)"]');
                        overlays.forEach(overlay => {
                            if (overlay.parentNode) {
                                overlay.parentNode.removeChild(overlay);
                            }
                        });
                    }, 2000);
                } else {
                    statusDiv.style.background = '#ffebee';
                    statusDiv.style.color = '#c62828';
                    // Prioritize the message from the parsed JSON, fallback to status text or generic message
                    const errorMessage = responseJson.message ||
                                         response.statusText ||
                                         `Error ${response.status}: ${response.responseText.substring(0, 100)}...`;
                    statusDiv.textContent = `❌ Error: ${errorMessage}`;
                    console.error('CRM Notion Integration: GAS API Error Details:', responseJson, response.responseText);
                }
            },
            onerror: function (error) {
                statusDiv.style.background = '#ffebee';
                statusDiv.style.color = '#c62828';
                statusDiv.textContent = '❌ Network error occurred (CORS or connectivity).';
                console.error('CRM Notion Integration: Network Error (GM_xmlhttpRequest):', error);
                // Suggest checking @connect permissions and GAS deployment access settings
                console.warn('CRM Notion Integration: Please ensure @connect permissions are set correctly in the script header and the GAS Web App is deployed to "Anyone".');
            },
            ontimeout: function() {
                 statusDiv.style.background = '#ffebee';
                 statusDiv.style.color = '#c62828';
                 statusDiv.textContent = '❌ Request timed out.';
                 console.error('CRM Notion Integration: Request to GAS timed out.');
            }
        });
    }

    // Initialize the script when page loads
    function init() {
        console.log("CRM Notion Integration script initializing...");
        // Wait for page to be interactive
        if (document.readyState === 'loading') {
            console.log("CRM Notion Integration: Document still loading, waiting for DOMContentLoaded...");
            document.addEventListener('DOMContentLoaded', () => {
                console.log("CRM Notion Integration: DOMContentLoaded fired, creating button shortly...");
                setTimeout(createNotionButton, 1500); // Give a bit more time after DOM loads
            });
        } else {
            console.log("CRM Notion Integration: Document already loaded, creating button shortly...");
            setTimeout(createNotionButton, 1500);
        }
    }

    init();
})();