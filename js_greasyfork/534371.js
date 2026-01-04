// ==UserScript==
// @name         Jira Ticket Creator for Cherdak working
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Add a floating button to create Jira tickets from Cherdak console
// @author       Ahmed Esslaouibribri
// @match        https://cherdak.console3.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @connect      indriver.atlassian.net
// @connect      slack.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/534371/Jira%20Ticket%20Creator%20for%20Cherdak%20working.user.js
// @updateURL https://update.greasyfork.org/scripts/534371/Jira%20Ticket%20Creator%20for%20Cherdak%20working.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cross-compatible xmlHttpRequest function that works in both TamperMonkey and ViolentMonkey
    const performRequest = function(details) {
        // Add credentials and origin handling
        const enhancedDetails = {
            ...details,
            anonymous: true,  // Don't send cookies or auth headers
            fetch: false,    // Don't use fetch API
        };
        
        // Add CORS headers
        enhancedDetails.headers = {
            ...enhancedDetails.headers,
            'x-requested-with': 'XMLHttpRequest'
        };
        
        // Use the appropriate request method
        if (typeof GM_xmlhttpRequest !== 'undefined') {
            return GM_xmlhttpRequest(enhancedDetails);
        } else if (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest !== 'undefined') {
            return GM.xmlHttpRequest(enhancedDetails);
        } else {
            console.error('Neither GM_xmlhttpRequest nor GM.xmlHttpRequest is available');
            if (enhancedDetails.onerror) {
                enhancedDetails.onerror({ error: 'XHR API not available' });
            }
        }
    };

    // Configuration
    const SLACK_ENABLED = true;
    const SLACK_BOT_TOKEN = 'xoxb-4709085058-8796693582834-bTympgtrfgksnrmKRUQ9NNuF';
    const SLACK_CHANNEL_ID = 'C07JV03PCD8';

    // CSS for the floating button and modal
    const styles = `
        .jira-create-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #0052CC;
            color: white;
            padding: 12px 16px;
            border-radius: 50px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 10px rgba(0, 82, 204, 0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            font-weight: 500;
            font-size: 14px;
            letter-spacing: 0.3px;
            display: flex;
            align-items: center;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .jira-create-btn:hover {
            background-color: #0065ff;
            box-shadow: 0 6px 14px rgba(0, 82, 204, 0.4);
            transform: translateY(-2px);
        }

        .jira-create-btn:active {
            transform: translateY(0);
            box-shadow: 0 3px 8px rgba(0, 82, 204, 0.3);
        }

        .jira-create-btn-icon {
            margin-right: 8px;
        }

        .jira-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 10000;
            font-family: Arial, sans-serif;
        }

        .jira-modal-content {
            position: relative;
            background-color: white;
            margin: 5% auto;
            padding: 20px;
            width: 70%;
            max-width: 800px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-height: 80vh;
            overflow-y: auto;
        }

        .jira-close {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #505f79;
            transition: color 0.3s ease;
        }

        .jira-close:hover {
            color: #172B4D;
        }

        .jira-field {
            margin-bottom: 15px;
        }

        .jira-field label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #172B4D;
        }

        .jira-field input, .jira-field textarea, .jira-field select {
            width: 100%;
            padding: 8px 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            transition: border-color 0.3s ease;
        }

        .jira-field input:focus, .jira-field textarea:focus, .jira-field select:focus {
            border-color: #0052CC;
            outline: none;
            box-shadow: 0 0 0 2px rgba(0, 82, 204, 0.2);
        }

        .jira-field textarea {
            height: 100px;
            resize: vertical;
        }

        .jira-field select {
            background-color: white;
            cursor: pointer;
        }

        .jira-radio-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
            margin-top: 5px;
        }

        .jira-radio-group label {
            font-weight: normal;
            cursor: pointer;
            display: flex;
            align-items: center;
        }

        .jira-radio-group input[type="radio"] {
            width: auto;
            margin-right: 6px;
            cursor: pointer;
        }

        .jira-buttons {
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .jira-btn {
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            border: none;
            font-size: 14px;
            transition: background-color 0.3s ease;
        }

        .jira-btn-cancel {
            background-color: #f4f5f7;
            color: #172B4D;
        }

        .jira-btn-cancel:hover {
            background-color: #e6e6e6;
        }

        .jira-btn-submit {
            background-color: #0052CC;
            color: white;
        }

        .jira-btn-submit:hover {
            background-color: #0043A4;
        }

        .jira-btn-submit.loading {
            position: relative;
            color: transparent;
            pointer-events: none;
        }

        .jira-btn-submit.loading::after {
            content: "";
            position: absolute;
            width: 16px;
            height: 16px;
            top: 50%;
            left: 50%;
            margin-top: -8px;
            margin-left: -8px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.5);
            border-top-color: white;
            animation: button-loading-spinner 0.8s linear infinite;
        }

        .jira-btn-submit.disabled {
            background-color: #97a0af;
            cursor: not-allowed;
            pointer-events: none;
        }

        @keyframes button-loading-spinner {
            from {
                transform: rotate(0turn);
            }
            to {
                transform: rotate(1turn);
            }
        }

        .jira-response {
            margin-top: 15px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #f9f9f9;
            max-height: 200px;
            overflow-y: auto;
            font-family: monospace;
            white-space: pre-wrap;
            display: none;
        }

        .jira-response-success {
            border-color: #4CAF50;
            background-color: #E8F5E9;
        }

        .jira-response-error {
            border-color: #F44336;
            background-color: #FFEBEE;
        }
    `;


    // Create style element when head is available
    function addStyles() {
        if (document.head) {
            const styleEl = document.createElement('style');
            styleEl.innerHTML = styles;
            
            // Try to find a CSP nonce for style
            const scripts = document.querySelectorAll('script[nonce]');
            if (scripts.length > 0 && scripts[0].nonce) {
                styleEl.setAttribute('nonce', scripts[0].nonce);
            }
            
            document.head.appendChild(styleEl);
        } else {
            // If head isn't available yet, try again shortly
            setTimeout(addStyles, 10);
        }
    }
    
    addStyles();


    const createButton = document.createElement('div');
    createButton.className = 'jira-create-btn';
    createButton.innerHTML = `
        <i class="jira-create-btn-icon" style="font-size: 16px; margin-right: 8px;">&#43;</i>
        Create a Jira ticket
    `;
    document.body.appendChild(createButton);


    const modal = document.createElement('div');
    modal.className = 'jira-modal';
    modal.innerHTML = `
        <div class="jira-modal-content">
            <span class="jira-close">&times;</span>
            <h2>Create Jira Ticket</h2>
            <div id="jira-fields">
                <div class="jira-field">
                    <label for="jira-summary">Summary:</label>
                    <input type="text" id="jira-summary" placeholder="Ticket summary..." value="Refund Ticket">
                </div>
                <div class="jira-field">
                    <label for="jira-component">Component:</label>
                    <select id="jira-component">
                        <option value="12791">Cashless refund</option>
                        <option value="12790">Dirty Salon</option>
                        <option value="12792">Passenger did not show up</option>
                        <option value="12789" selected>Passenger didn't pay</option>
                    </select>
                </div>
                <div class="jira-field">
                    <label for="jira-order-link">Order Link:</label>
                    <input type="text" id="jira-order-link" readonly>
                </div>
                <div class="jira-field">
                    <label for="jira-chat-link">Chat Link: <span style="color: #DE350B;">*</span></label>
                    <input type="text" id="jira-chat-link" placeholder="Paste chat link here...">
                </div>
                <div class="jira-field">
                    <label for="jira-driver-id">Driver ID:</label>
                    <input type="text" id="jira-driver-id" readonly>
                </div>
                <div class="jira-field">
                    <label for="jira-passenger-id">Passenger ID:</label>
                    <input type="text" id="jira-passenger-id" readonly>
                </div>
                <div class="jira-field">
                    <label for="jira-amount">Amount:</label>
                    <input type="text" id="jira-amount" readonly>
                </div>
                <div class="jira-field">
                    <label for="jira-region">Region: <span style="color: #DE350B;">*</span></label>
                    <select id="jira-region">
                        <option value="">NOT DEFINED</option>
                        <option value="105">CIS Region</option>
                        <option value="102">AFRICA</option>
                        <option value="91044">APAC</option>
                        <option value="103">AMER</option>
                        <option value="104">ASIA</option>
                        <option value="106">EU</option>
                        <option value="2943">LATAM ANDEAN</option>
                        <option value="2945">LATAM CARIBBEAN</option>
                        <option value="2948">LATAM CENTRAL</option>
                        <option value="2944">LATAM CONO SUR</option>
                        <option value="2942">LATAM BRAZIL</option>
                        <option value="15505">MENA</option>
                        <option value="2946">LATAM MEXICO</option>
                        <option value="15490">MALAYSIA</option>
                        <option value="4977">VIETNAM</option>
                        <option value="4842">INDONESIA</option>
                        <option value="15539">HONG KONG</option>
                        <option value="15587">NEW ZEALAND</option>
                        <option value="223">SOUTH AFRICA</option>
                        <option value="217">KENYA</option>
                    </select>
                </div>
                <div class="jira-field" id="jira-country-field" style="display: none;">
                    <label for="jira-country">Country: <span style="color: #DE350B;">*</span></label>
                    <select id="jira-country">
                        <option value="">NOT DEFINED</option>
                        <option value="4841">Armenia</option>
                        <option value="15479">Azerbaijan</option>
                        <option value="4840">Belarus</option>
                        <option value="194">Georgia</option>
                        <option value="4842">Kazakhstan</option>
                        <option value="4843">Kyrgyzstan</option>
                        <option value="15575">Moldova</option>
                        <option value="15577">Mongolia</option>
                        <option value="30200">Russia</option>
                        <option value="4844">Tajikistan</option>
                        <option value="15636">Turkmenistan</option>
                        <option value="15646">Ukraine</option>
                        <option value="4845">Uzbekistan</option>
                    </select>
                </div>
                <div class="jira-field" id="jira-latam-country-field" style="display: none;">
                    <label for="jira-latam-country">Country: <span style="color: #DE350B;">*</span></label>
                    <select id="jira-latam-country">
                        <option value="">NOT DEFINED</option>
                        <option value="15466">Anguilla</option>
                        <option value="15467">Antigua and Barbuda</option>
                        <option value="231">Argentina</option>
                        <option value="15471">Aruba</option>
                        <option value="15474">Bahamas</option>
                        <option value="232">Barbados</option>
                        <option value="233">Belize</option>
                        <option value="15483">Bermuda</option>
                        <option value="234">Bolivia</option>
                        <option value="15486">Bonaire, Sint Eustatius and Saba</option>
                        <option value="15488">British Virgin Islands</option>
                        <option value="15498">Cayman Islands</option>
                        <option value="235">Chile</option>
                        <option value="236">Colombia</option>
                        <option value="237">Costa Rica</option>
                        <option value="15506">Cuba</option>
                        <option value="238">Curaçao</option>
                        <option value="95212">Dominica</option>
                        <option value="239">Dominican Republic</option>
                        <option value="240">Ecuador</option>
                        <option value="241">El Salvador</option>
                        <option value="15521">Falkland Islands</option>
                        <option value="15524">French Guiana</option>
                        <option value="15532">Grenada</option>
                        <option value="15533">Guadeloupe</option>
                        <option value="242">Guatemala</option>
                        <option value="243">Guyana</option>
                        <option value="244">Honduras</option>
                        <option value="245">Jamaica</option>
                        <option value="15569">Martinique</option>
                        <option value="246">Mexico</option>
                        <option value="15578">Montserrat</option>
                        <option value="247">Nicaragua</option>
                        <option value="248">Panama</option>
                        <option value="249">Paraguay</option>
                        <option value="250">Peru</option>
                        <option value="15603">Puerto Rico</option>
                        <option value="251">République d'Haïti</option>
                        <option value="15610">Saint Barthélemy</option>
                        <option value="15612">Saint Kitts and Nevis</option>
                        <option value="252">Saint Lucia</option>
                        <option value="15621">Sint Maarten</option>
                        <option value="253">Suriname</option>
                        <option value="254">Trinidad and Tobago</option>
                        <option value="15647">Turks and Caicos Islands</option>
                        <option value="5177">Uruguay</option>
                        <option value="15658">Venezuela</option>
                    </select>
                </div>
                <div class="jira-field">
                    <label for="jira-description">Description:</label>
                    <textarea id="jira-description"></textarea>
                </div>
                <div class="jira-field">
                    <label for="jira-reporter">Reporter:</label>
                    <select id="jira-reporter">
                        <option value="637b84825fce844d6068120b">Ahmed Esslaoui (Default)</option>
                        <option value="63940b7f9341d1f1360ac2ae">Nuraiym</option>
                        <option value="640f10980152b5f4f9ef8812">Yesset</option>
                        <option value="63fc9ba22847866310fdb4fa">Amanzhan</option>
                        <option value="642a4f8c96822e1821fe302b">Tleukhan</option>
                        <option value="63940cb877acd224b3439b3f">Ramazan</option>
                        <option value="63ff3e8d4307e46ad1444a4a">Galymzhan</option>
                    </select>
                </div>
                <div class="jira-field" id="jira-permission-field" style="display: none;">
                    <label>Permission to pass contact:</label>
                    <div class="jira-radio-group">
                        <label>
                            <input type="radio" name="jira-permission" value="20292" checked> Yes
                        </label>
                        <label>
                            <input type="radio" name="jira-permission" value="20293"> No
                        </label>
                    </div>
                </div>
            </div>
            <div class="jira-buttons">
                <button class="jira-btn jira-btn-cancel" id="jira-cancel">Cancel</button>
                <button class="jira-btn jira-btn-submit" id="jira-submit">Create Ticket</button>
            </div>
            <div class="jira-response" id="jira-response"></div>
        </div>
    `;
    document.body.appendChild(modal);

    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function extractData() {
        let data = {
            orderUuid: '',
            orderLink: '',
            driverId: '',
            passengerId: '',
            amount: ''
        };

        try {

            const orderUuidElement = document.querySelector('#single-spa-application\\:\\@cherdak\\/new-order-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div.styles__Box-dwqAVh.cTOkbR > div > p');
            if (orderUuidElement) {
                data.orderUuid = orderUuidElement.textContent.trim();
                data.orderLink = `https://cherdak.console3.com/cis/new-order/orders/${data.orderUuid}`;
            }


            const driverIdElement = document.querySelector('#single-spa-application\\:\\@cherdak\\/new-order-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div:nth-child(2) > div:nth-child(2) > div > div.styles__InfoWrapper-ioCrot.vJNBD > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > dd > a.styles__UserLink-gSQWOx.kSgELQ');
            if (driverIdElement) {
                data.driverId = driverIdElement.textContent.trim();
            }

            const passengerIdElement = document.querySelector('#single-spa-application\\:\\@cherdak\\/new-order-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div:nth-child(2) > div:nth-child(2) > div > div.styles__InfoWrapper-ioCrot.vJNBD > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(1) > dd > a.styles__UserLink-gSQWOx.kSgELQ');
            if (passengerIdElement) {
                data.passengerId = passengerIdElement.textContent.trim();
            }

            const amountElement = document.querySelector('#single-spa-application\\:\\@cherdak\\/new-order-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div:nth-child(2) > div:nth-child(1) > div > div.styles__InfoWrapper-ioCrot.vJNAW > div > div');
            if (amountElement) {
                const amountText = amountElement.textContent.trim();
                const amountMatch = amountText.match(/[\d.]+/);
                if (amountMatch) {
                    data.amount = amountMatch[0];
                } else {
                    data.amount = amountText;
                }
            }
        } catch (error) {
            console.error('Error extracting data:', error);
        }

        return data;
    }

    function populateModal() {
        const data = extractData();

        document.getElementById('jira-order-link').value = data.orderLink;
        document.getElementById('jira-driver-id').value = data.driverId;
        document.getElementById('jira-passenger-id').value = data.passengerId;
        document.getElementById('jira-amount').value = data.amount;

        const descriptionEl = document.getElementById('jira-description');
        if (data.orderLink && !descriptionEl.value.includes(data.orderLink)) {
            descriptionEl.value = `Order Link: ${data.orderLink}\n\n${descriptionEl.value}`;
        }
    }

    function createJiraTicket() {
        // Get the submit button and add loading state
        const submitButton = document.getElementById('jira-submit');
        submitButton.classList.add('loading');

        const summary = document.getElementById('jira-summary').value;
        const orderLink = document.getElementById('jira-order-link').value;
        let chatLink = document.getElementById('jira-chat-link').value;
        const driverId = document.getElementById('jira-driver-id').value;
        const passengerId = document.getElementById('jira-passenger-id').value;
        const amount = document.getElementById('jira-amount').value;
        const description = document.getElementById('jira-description').value;

        // Process chat link - if it's just an ID, form a proper URL
        if (chatLink && !chatLink.startsWith('http')) {
            // Check if it's just an interaction ID without a URL
            // Support both standard UUID format and the custom format like 01968206-d4f5-73ac-b039-77d49bb806aa
            if (!chatLink.includes('support-frontend.console3.com')) {
                chatLink = `https://support-frontend.console3.com/chat_request/${chatLink.trim()}`;
            }
        }

        const componentSelect = document.getElementById('jira-component');
        let componentId = "12791";
        let componentName = "Cashless refund";

        if (componentSelect) {
            componentId = componentSelect.value;
            componentName = componentSelect.options[componentSelect.selectedIndex].text;
        }

        const regionSelect = document.getElementById('jira-region');
        let regionId = "";

        if (regionSelect) {
            regionId = regionSelect.value;
        }

        let countryIds = [];
        if (regionId === '105') {
            const countrySelect = document.getElementById('jira-country');
            if (countrySelect && countrySelect.value) {
                countryIds.push({
                    "id": "42434225-f455-45fb-9f85-cf50e3ee251d:" + countrySelect.value,
                    "objectId": countrySelect.value,
                    "workspaceId": "42434225-f455-45fb-9f85-cf50e3ee251d"
                });
            }
        } else if (['2943', '2945', '2948', '2944', '2942', '2946'].includes(regionId)) {
            const latamCountrySelect = document.getElementById('jira-latam-country');
            if (latamCountrySelect && latamCountrySelect.value) {
                countryIds.push({
                    "id": "42434225-f455-45fb-9f85-cf50e3ee251d:" + latamCountrySelect.value,
                    "objectId": latamCountrySelect.value,
                    "workspaceId": "42434225-f455-45fb-9f85-cf50e3ee251d"
                });
            }
        }

        const selectedPermissionInput = document.querySelector('input[name="jira-permission"]:checked');
        let permissionId = "20292";

        if (selectedPermissionInput) {
            permissionId = selectedPermissionInput.value;
        }

        // Get the reporter ID
        const reporterId = document.getElementById('jira-reporter').value;

        if (!summary) {
            alert('Please enter a summary for the ticket');
            return;
        }

        if (!chatLink) {
            alert('Please enter a chat link for the ticket');
            return;
        }

        if (!regionId) {
            alert('Please select a region for the ticket');
            return;
        }

        if (regionId === '105') {
            const countrySelect = document.getElementById('jira-country');
            if (!countrySelect || !countrySelect.value) {
                alert('Please select a country for the ticket');
                return;
            }
        } else if (['2943', '2945', '2948', '2944', '2942', '2946'].includes(regionId)) { // LATAM regions
            const latamCountrySelect = document.getElementById('jira-latam-country');
            if (!latamCountrySelect || !latamCountrySelect.value) {
                alert('Please select a country for the ticket');
                return;
            }
        }

        const jiraDescription = {
            "version": 1,
            "type": "doc",
            "content": [
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Order Link: " + orderLink
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Chat Link: " + chatLink
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": description.replace(/Order Link:.*?(?:\r?\n|$)/g, '')
                        }
                    ]
                }
            ]
        };

        const randomToken = Math.random().toString();

        const jiraData = {
            "fields": {
                "project": {
                    "id": "11776"
                },
                "issuetype": {
                    "id": "10062"
                },
                "summary": summary,
                "components": [
                    {
                        "id": componentId,
                        "name": componentName
                    }
                ],
                "customfield_13985": orderLink,
                "customfield_12080": driverId,
                "customfield_12081": passengerId,
                "customfield_10126": parseFloat(amount) || 0,
                "customfield_13937": permissionId === "20292"
                    ? { "id": "20292", "value": "Yes" }
                    : { "id": "20293", "value": "No" },
                "customfield_12163": regionId ? [
                    {
                        "id": "42434225-f455-45fb-9f85-cf50e3ee251d:" + regionId,
                        "objectId": regionId,
                        "workspaceId": "42434225-f455-45fb-9f85-cf50e3ee251d"
                    }
                ] : [],
                "customfield_12164": countryIds,
                "customfield_12165": [],
                "description": jiraDescription,
                "customfield_12740": getTodayDate(),
                "reporter": {
                    "id": reporterId
                },
                "priority": {
                    "id": "10000",
                    "name": "Normal",
                    "iconUrl": "https://indriver.atlassian.net/rest/api/2/universal_avatar/view/type/priority/avatar/11756?size=medium"
                }
            },
            "update": {},
            "externalToken": randomToken
        };

        performRequest({
            method: "POST",
            url: "https://indriver.atlassian.net/rest/api/3/issue?updateHistory=true&applyDefaultValues=false",
            headers: {
                "accept": "application/json,text/javascript,*/*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json",
                "origin": "https://indriver.atlassian.net",
                "priority": "u=1, i",
                "referer": "https://indriver.atlassian.net/jira/software/c/projects/GCS/boards/2145",
                "x-atlassian-capability": "COMPANY_MANAGED_BOARD--other"
            },
            data: JSON.stringify(jiraData),
            onload: function(response) {
                const responseDiv = document.getElementById('jira-response');
                responseDiv.style.display = 'block';

                // Get the submit button to update its state
                const submitButton = document.getElementById('jira-submit');
                // Remove loading state
                submitButton.classList.remove('loading');

                try {
                    // Check if the response looks like HTML instead of JSON
                    if (response.responseText.trim().startsWith('<') || 
                        response.responseText.includes('<!DOCTYPE') || 
                        response.responseText.includes('<html')) {
                        
                        console.error('Received HTML response instead of JSON', response);
                        responseDiv.classList.add('jira-response-error');
                        responseDiv.classList.remove('jira-response-success');
                        
                        // Show a more user-friendly error with some response details for debugging
                        responseDiv.innerHTML = `
                            <strong>❌ Error: Received HTML response instead of JSON</strong>
                            <br><br>
                            <strong>Status:</strong> ${response.status} ${response.statusText || ''}
                            <br><br>
                            <strong>Likely causes:</strong>
                            <ul>
                                <li>Authentication error or session timeout</li>
                                <li>Network or proxy issues</li>
                                <li>Server-side error or redirect</li>
                            </ul>
                            <br>
                            <strong>Response preview:</strong><br>
                            <pre>${response.responseText.substring(0, 100)}...</pre>
                        `;
                        
                        alert('Error: Server returned HTML instead of JSON. This may indicate authentication issues.');
                        return;
                    }
                    
                    const responseData = JSON.parse(response.responseText);

                    if (response.status >= 200 && response.status < 300) {
                        responseDiv.classList.add('jira-response-success');
                        responseDiv.classList.remove('jira-response-error');

                        // Disable the button after successful submission
                        submitButton.classList.add('disabled');

                        const ticketKey = responseData.key || 'Unknown';
                        const ticketLink = `https://indriver.atlassian.net/browse/${ticketKey}`;

                        responseDiv.innerHTML = `
                            <strong>✅ JIRA ticket created successfully!</strong>
                            <br><br>
                            <strong>Ticket Key:</strong> ${ticketKey}
                            <br>
                            <strong>Ticket URL:</strong> <a href="${ticketLink}" target="_blank">${ticketLink}</a>
                        `;

                        alert('JIRA ticket created successfully! Ticket key: ' + ticketKey);

                        sendSlackNotification(
                            ticketKey,
                            ticketLink,
                            orderLink,
                            chatLink,
                            driverId,
                            passengerId
                        );
                    } else {
                        responseDiv.classList.add('jira-response-error');
                        responseDiv.classList.remove('jira-response-success');

                        responseDiv.innerHTML = `
                            <strong>❌ Error creating JIRA ticket</strong>
                            <br><br>
                            <strong>Status:</strong> ${response.status} ${response.statusText}
                        `;

                        alert('Error creating JIRA ticket: ' + response.statusText);
                    }
                } catch (e) {
                    responseDiv.classList.add('jira-response-error');
                    responseDiv.classList.remove('jira-response-success');
                    responseDiv.innerHTML = `
                        <strong>❌ Error parsing response</strong>
                        <br><br>
                        <strong>Status:</strong> ${response.status} ${response.statusText}
                    `;

                    alert('Error parsing JIRA response: ' + e.message);
                }
            },
            onerror: function(response) {
                const responseDiv = document.getElementById('jira-response');
                responseDiv.style.display = 'block';
                responseDiv.classList.add('jira-response-error');
                responseDiv.classList.remove('jira-response-success');

                // Remove loading state from button on error
                const submitButton = document.getElementById('jira-submit');
                submitButton.classList.remove('loading');

                responseDiv.innerHTML = `
                    <strong>❌ Network Error</strong>
                    <br><br>
                    <strong>Error:</strong> ${response.error || 'Unknown error'}
                    <br><br>
                    <strong>Status:</strong> ${response.status} ${response.statusText || ''}
                `;

                alert('Error creating JIRA ticket: ' + (response.error || 'Network error'));
            }
        });
    }

    function sendSlackNotification(ticketKey, ticketLink, orderLink, chatLink, driverId, passengerId) {
        if (!SLACK_ENABLED) {
            console.log('Slack notifications are disabled. Set SLACK_ENABLED to true after adding your tokens.');
            return;
        }

        const message = {
            channel: SLACK_CHANNEL_ID,
            text: "New JIRA ticket created",
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "🎫 New JIRA Ticket Created",
                        emoji: true
                    }
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*Ticket:* <${ticketLink}|${ticketKey}>`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Order:* <${orderLink}|Order Link>`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Chat Link:* <${chatLink}|Chat Link>`
                        }
                    ]
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*Driver ID:* ${driverId || 'N/A'}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Passenger ID:* ${passengerId || 'N/A'}`
                        }
                    ]
                },
                {
                    type: "divider"
                }
            ]
        };

        performRequest({
            method: "POST",
            url: "https://slack.com/api/chat.postMessage",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SLACK_BOT_TOKEN}`
            },
            data: JSON.stringify(message),
            onload: function(response) {
                try {
                    // Check if the response looks like HTML instead of JSON
                    if (response.responseText.trim().startsWith('<') || 
                        response.responseText.includes('<!DOCTYPE') || 
                        response.responseText.includes('<html')) {
                        
                        console.error('Received HTML response from Slack instead of JSON', response);
                        return;
                    }
                    
                    const responseData = JSON.parse(response.responseText);
                    if (responseData.ok) {
                        console.log("Slack notification sent successfully");
                    } else {
                        console.error("Failed to send Slack notification:", responseData.error);
                    }
                } catch (e) {
                    console.error("Error processing Slack response:", e);
                }
            },
            onerror: function(error) {
                console.error("Error sending Slack notification:", error);
            }
        });
    }

    function openModal() {
        modal.style.display = 'block';
        const responseDiv = document.getElementById('jira-response');
        responseDiv.style.display = 'none';
        responseDiv.innerHTML = '';
        responseDiv.classList.remove('jira-response-success', 'jira-response-error');

        populateModal();

        const componentSelect = document.getElementById('jira-component');
        const permissionField = document.getElementById('jira-permission-field');

        if (componentSelect.value === '12789') { // Passenger didn't pay
            permissionField.style.display = 'block';
        } else {
            permissionField.style.display = 'none';
        }
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    createButton.addEventListener('click', openModal);

    document.getElementById('jira-component').addEventListener('change', function() {
        const permissionField = document.getElementById('jira-permission-field');

        if (this.value === '12789') { // Passenger didn't pay
            permissionField.style.display = 'block';
        } else {
            permissionField.style.display = 'none';
        }
    });

    document.getElementById('jira-region').addEventListener('change', function() {
        const countryField = document.getElementById('jira-country-field');
        const latamCountryField = document.getElementById('jira-latam-country-field');

        countryField.style.display = 'none';
        latamCountryField.style.display = 'none';
        countryField.style.display = 'none';
        latamCountryField.style.display = 'none';

        if (this.value === '105') { // CIS Region
            countryField.style.display = 'block';
        } else if (['2943', '2945', '2948', '2944', '2942', '2946'].includes(this.value)) { // LATAM regions
            latamCountryField.style.display = 'block';
        }
    });

    document.querySelector('.jira-close').addEventListener('click', closeModal);
    document.getElementById('jira-cancel').addEventListener('click', closeModal);
    document.getElementById('jira-submit').addEventListener('click', createJiraTicket);

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            closeModal();
        }
    });

    console.log('Jira Ticket Creator script loaded');
})();