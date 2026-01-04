// ==UserScript==
// @name         APM Control Panel
// @namespace    http://tampermonkey.net/
// @version      0.9996
// @description  Control panel for APM automations
// @author       handsen@amazon.com
// @match        https://us1.eam.hxgnsmartcloud.com/*
// @icon         https://www.vhv.rs/dpng/d/78-788435_control-panel-icon-vector-hd-png-download.png
// @license      MIT
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/544031/APM%20Control%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/544031/APM%20Control%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("APM Control Panel loaded");
    const slackWO = 'https://hooks.slack.com/triggers/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'
    const slackHERMES = 'https://hooks.slack.com/triggers/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'
        const defaultSettings = {
        login: '',
        slackFollowUp: true,
        coachWO: true,
        channel: 'C099QA3NW67'
    };
    const CONFIG = {
        statusIndex: 4,
        typeIndex: 5,
        minCommentLength: 160,
        minLOTOcomment: 6,
        minLaborPercentage: 80,
        maxLaborPercentage: 100,
        throttling: 150,
        LOTOneedDescription: "Does this task require LOTO to one or more energy sources?",
        LOTOPICdescription: "Are photos of applied LOTO devices uploaded to this check (comment if not)?",
        commentsShallNotInclude: ["visual only", "only visual"]
    };

    let controlPanel = null;
    let settingsPanel = null;
    let isVisible = false;
    let isSettingsVisible = false;
    let observer = null;
    let statusInterceptor = null;
    let lastWO = null;
    let visitedLOTO = false;
    let visitedHOURS = false;
    let goodLOTO = false;
    let goodHOURS = false;
    let AlreadyCompleted = false;
    let flagFirstStatus = false;
    let captureLoginFlag = false;
    let OriginalWOowner = 178948200000;
    let INDEXS = {
        statusIndex: 4,
        typeIndex: 5,
        commentColumnIndex: 27,
        totalEstLaborColumnIndex: 28,
        totalBookedLaborColumnIndex: 29,
    };
    function getUserID(){
        const userObj = document.querySelector('.x-toolbar-text');
        if(!userObj) return null;
        const fullString = userObj.textContent
        const regex = /\(([^@]+)@/;
        const match = fullString.match(regex);
        if(!match || !match[1]) return null;
        const username = match[1].toLowerCase()
        return username
    }
    function findStatusInput(){
        const selectors = [
            'input[name="workorderstatus"]',
            '#uxcombobox-3926-inputEl'
        ];
        for (let selector of selectors) {
            const element = document.querySelector(selector);
            if (element) return element;
        }
        return null;
    };
    function findWOID(){
    const Code = document.querySelector('.recordcode')
    if(!Code) return;
    const codeval = Code.textContent
    if(codeval !== lastWO){
        lastWO = codeval;
        visitedLOTO = false;
        visitedHOURS = false;
        goodLOTO = false;
        goodHOURS = true;
        AlreadyCompleted = false;
        flagFirstStatus = true;
        OriginalWOowner = 178948200000;
    };
    };
    function defineIndex(){
        INDEXS.statusIndex = -1;
        INDEXS.typeIndex = -1;
        INDEXS.commentColumnIndex = -1;
        INDEXS.totalEstLaborColumnIndex = -1;
        INDEXS.totalBookedLaborColumnIndex = -1;
        const headers = document.querySelectorAll('.x-column-header');
        let i = 0;
        headers.forEach(header => {
            const headerPart = header.querySelector('.x-column-header-text');
            const Name = headerPart ? headerPart.textContent.trim() : '';
            switch(Name){
                case "Type":
                    INDEXS.typeIndex = i;
                    break;
                case "Status":
                    INDEXS.statusIndex = i;
                    break;
                case "Closing Comments":
                    INDEXS.commentColumnIndex = i;
                    break;
                case "Total Booked Labor":
                    INDEXS.totalBookedLaborColumnIndex = i;
                    break;
                case "Total Est. Labor":
                    INDEXS.totalEstLaborColumnIndex = i;
                    break;
            }
            i++;
        })
        if( INDEXS.statusIndex === -1 || INDEXS.typeIndex === -1 || INDEXS.commentColumnIndex === -1 || INDEXS.totalEstLaborColumnIndex === -1 || INDEXS.totalBookedLaborColumnIndex === -1){
            return false;
        }
        return true;
    }
    function containsPhrases(text, phrases) {
        if (!text || !phrases || phrases.length === 0) return false;

        // Create regex pattern from the phrases array
        // Escape special regex characters and join with OR operator
        const escapedPhrases = phrases.map(phrase =>
        phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
              .replace(/\s+/g, '\\s+') // Allow multiple spaces
         );

    const pattern = new RegExp(`\\b(?:${escapedPhrases.join('|')})\\b`, 'i');

    return pattern.test(text);
    }
    function getCellText(row, columnIndex) {
        const cells = row.querySelectorAll('td');
        if (cells[columnIndex]) {
            const innerDiv = cells[columnIndex].querySelector('.x-grid-cell-inner');
            return innerDiv ? innerDiv.textContent.trim() : '';
        }
        return '';
    }
    function getCellNumericValue(row, columnIndex) {
        const text = getCellText(row, columnIndex);
        const numericValue = parseFloat(text.replace(/[^\d.-]/g, ''));
        return isNaN(numericValue) ? 0 : numericValue;
    }
    function getDetailValue(targetString){
        const targetOptions = document.querySelectorAll('.x-form-item-label');
        let target = null;
        targetOptions.forEach(label => {
            const labelContent = label.textContent.trim();
            if(labelContent === targetString){
                target = label;
            }
        });
        if(!target) return null;
        const Parent = target.parentNode
        if(!Parent) return null;
        const form = Parent.querySelector('.x-form-text');
        return form.value;
    }
    function goodHours(){
        const typeInput = document.querySelector('input[name="workordertype"]');
        const type = typeInput ? typeInput.value : null;
        if(!type) return true;
        if(type !== "Preventive maintenance" && type !== "Condition Monitoring"){
            return true;
        };
        const targetOptions = document.querySelectorAll('.x-form-item-label');
        let targetHours = null;
        let targetEst = null;
        targetOptions.forEach(label => {
            const labelContent = label.textContent.trim();
            if(labelContent === 'Total Est. Labor:'){
                targetEst = label;
            } else if(labelContent === 'Total Booked Labor:'){
                targetHours = label;
            }
        });
        if(!targetHours || !targetEst) return false;
        const ParentHours = targetHours.parentNode;
        const formHours = ParentHours.querySelector('.x-form-text');
        const hours = formHours.value;
        const ParentEst = targetEst.parentNode;
        const formEst = ParentEst.querySelector('.x-form-text');
        const est = formEst.value;
        if(isNaN(est)) return false;
        const precentile = hours/est*100;
        if(!(precentile < CONFIG.minLaborPrecentage || precentile > CONFIG.maxLaborPrecentage)) return false;
        return true;
    }

    function validateRow(row) {
        // Get comment text
        //console.log(getCellText(row, CONFIG.typeIndex))
        const status = getCellText(row, INDEXS.statusIndex)
        if(status !== "Completed") return false;
        const type = getCellText(row, INDEXS.typeIndex)
        if(type !== "Preventive maintenance" && type !== "System Check" && type !== "Condition Monitoring"){
            return false;
        }
        const comment = getCellText(row, INDEXS.commentColumnIndex);
        // Get labor values
        const totalEstLabor = getCellNumericValue(row, INDEXS.totalEstLaborColumnIndex);
        const totalBookedLabor = getCellNumericValue(row, INDEXS.totalBookedLaborColumnIndex);
        // Check comment criteria
        let hasInvalidComment = !comment || comment === ' ' || comment.length < CONFIG.minCommentLength;
        if(!hasInvalidComment){
            hasInvalidComment = containsPhrases(comment, CONFIG.commentsShallNotInclude)
        }
        // Check labor percentage criteria
        let hasInvalidLaborRatio = false;
        if (totalEstLabor > 0) {
            const laborPercentage = (totalBookedLabor / totalEstLabor) * 100;
            hasInvalidLaborRatio = laborPercentage < CONFIG.minLaborPercentage || laborPercentage > CONFIG.maxLaborPercentage;
        }
        return hasInvalidComment || hasInvalidLaborRatio;
    }
    function invalidComment(row){
        const comment = getCellText(row, INDEXS.commentColumnIndex);
        // Get labor values
        const totalEstLabor = getCellNumericValue(row, INDEXS.totalEstLaborColumnIndex);
        const totalBookedLabor = getCellNumericValue(row, INDEXS.totalBookedLaborColumnIndex);
        // Check comment criteria
        let hasInvalidComment = !comment || comment === ' ' || comment.length < CONFIG.minCommentLength;
        if(!hasInvalidComment){
            hasInvalidComment = containsPhrases(comment, CONFIG.commentsShallNotInclude)
        }
        return hasInvalidComment
    }
    function invalidLabor(row){
        const totalEstLabor = getCellNumericValue(row, INDEXS.totalEstLaborColumnIndex);
        const totalBookedLabor = getCellNumericValue(row, INDEXS.totalBookedLaborColumnIndex);
        let hasInvalidLaborRatio = false;
        if (totalEstLabor > 0) {
            const laborPercentage = (totalBookedLabor / totalEstLabor) * 100;
            hasInvalidLaborRatio = laborPercentage < CONFIG.minLaborPercentage || laborPercentage > CONFIG.maxLaborPercentage;
        }
        return hasInvalidLaborRatio;
    };
    function checkDateRows(){
    //first find to see what columns if any have important dates
    let daterow = -1;
    let statusrow = -1;
    const headers = document.querySelectorAll('.x-column-header');
    let i = 0;
    headers.forEach(header => {
        const headerPart = header.querySelector('.x-column-header-text');
        const Name = headerPart ? headerPart.textContent.trim() : '';
        if(Name === "Sched. End Date"){
            daterow = i;
        } else if(Name === "Status"){
            statusrow = i;
        }
        i++;
    });

    //validate rows
    if(daterow === -1) return;
    if(statusrow === -1) return;

    const tableRows = document.querySelectorAll('.x-grid-row');
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

    tableRows.forEach(row => {
        const status = getCellText(row, statusrow);
        const dateinfo = getCellText(row, daterow);

        if(status === "Completed" || status === "Canceled") return;
        if(!dateinfo || dateinfo.trim() === '') return;

        // Parse the date (format: 7/28/25)
        const dateParts = dateinfo.trim().split('/');
        if(dateParts.length !== 3) return;

        const month = parseInt(dateParts[0]) - 1; // Month is 0-indexed in JavaScript
        const day = parseInt(dateParts[1]);
        let year = parseInt(dateParts[2]);

        // Handle 2-digit year (assuming 25 means 2025)
        if(year < 100) {
            year += 2000;
        }
        const scheduleDate = new Date(year, month, day);
        scheduleDate.setHours(0, 0, 0, 0);
        const firstCell = row.querySelector('td');
        if (!firstCell) return;
        // Remove existing date indicators
        const existingDateIndicator = firstCell.querySelector('.date-indicator');
        if (existingDateIndicator) {
            existingDateIndicator.remove();
        }
        let emoji = '';
        let title = '';
        if (scheduleDate.getTime() === today.getTime()) {
            // Same day
            emoji = '🔜';
            title = 'Due Today';
        } else if (scheduleDate < today) {
            // Past due date
            emoji = '⏰';
            title = 'Past Due';
        }
        if (emoji) {
            const indicator = document.createElement('div');
            indicator.className = 'date-indicator';
            indicator.style.cssText = `
                position: absolute;
                bottom: 2px;
                left: 2px;
                font-size: 12px;
                z-index: 1000;
                line-height: 1;
            `;
            indicator.textContent = emoji;
            indicator.title = title;
            firstCell.style.position = 'relative';
            firstCell.appendChild(indicator);
        }
    });
}
    function highlightInvalidRows() {
        // Find all table rows with the specified class
        const tableRows = document.querySelectorAll('.x-grid-row');

        tableRows.forEach(row => {
            if (validateRow(row)) {
                // Highlight the entire row in red
                const allclass = row.parentNode.parentNode.classList;
                if(allclass.contains("x-grid-item-selected")){
                row.style.backgroundColor = '#ff8888';
                row.style.border = '2px solid #ff0000';
                }else if(allclass.contains("x-grid-item-over")){
                row.style.backgroundColor = '#dd9999';
                row.style.border = '2px solid #ff0000';
                }else{
                row.style.backgroundColor = '#ffcccc';
                row.style.border = '2px solid #ff0000';
                }
                const firstCell = row.querySelector('td');
                if (firstCell && !firstCell.querySelector('.validation-indicator')) {
                    if(invalidComment(row)){
                    const indicator = document.createElement('div');
                    indicator.className = 'validation-indicator';
                    indicator.style.cssText = `
                        position: absolute;
                        top: 2px;
                        right: 2px;
                        width: 10px;
                        height: 10px;
                        background-color: red;
                        border-radius: 50%;
                        z-index: 1000;
                    `;
                    indicator.title = 'Check Comment';
                    firstCell.style.position = 'relative';
                    firstCell.appendChild(indicator);
                    }
                    if(invalidLabor(row)){
                    const indicator = document.createElement('div');
                    indicator.className = 'validation-indicator';
                    indicator.style.cssText = `
                        position: absolute;
                        top: 14px;
                        right: 2px;
                        width: 10px;
                        height: 10px;
                        background-color: purple;
                        border-radius: 50%;
                        z-index: 1000;
                    `;
                    indicator.title = 'Check Labor';
                    firstCell.style.position = 'relative';
                    firstCell.appendChild(indicator);
                    }
                }
            } else {
                // Remove highlighting if row becomes valid
                row.style.backgroundColor = '';
                row.style.border = '';
                const indicator = row.querySelector('.validation-indicator');
                if (indicator) {
                    indicator.remove();
                }
            }
        });
    }

    function canSetCompleted(){
        // Get by the name attribute
        const typeInput = document.querySelector('input[name="workordertype"]');
        const type = typeInput ? typeInput.value : null;
        if(!type) return true;
        if(type !== "Preventive maintenance" && type !== "Condition Monitoring"){
            return true;
        };
        const closingCommentsTextarea = document.querySelector('textarea[name="udfnote01"]');
        const closingCommentsValue = closingCommentsTextarea ? closingCommentsTextarea.value : null;
        if(!closingCommentsValue) return false;
        if(closingCommentsValue.length < CONFIG.minCommentLength) return false;
        if(containsPhrases(closingCommentsValue, CONFIG.commentsShallNotInclude)) return false;
        return true;
    }
    function resetStatusValue(statusInput) {
        if (observer) {
                observer.disconnect();
                observer = null;
        }
        const prev = statusInput.getAttribute('data-previous-value')
        if(prev === "Completed"){
           statusInput.value = 'Open'
        }else{
           statusInput.value = statusInput.getAttribute('data-previous-value') || 'Open';
         }
    }
    function setupInterceptors() {
        const title = document.querySelector('.pagetitle')
        if(!title || title.textContent !== 'Work Order') return;
        const statusInput = findStatusInput();
        if(AlreadyCompleted) return;
        if (statusInput) {
            if(statusInput.value === "Completed"){
                if(flagFirstStatus){
                    AlreadyCompleted = true;
                    flagFirstStatus = false;
                    return;
                }
                if(!visitedLOTO){
                resetStatusValue(statusInput);
                showNotification('❌ Please visit LOTO checks before completing🔒')
                }
                else if(!goodLOTO){
                resetStatusValue(statusInput);
                showNotification('❌ Please correct LOTO fields before completing🔒')
                }else if(!canSetCompleted()){
                resetStatusValue(statusInput);
                showNotification('❌ Please improve your notes section before completing 📝')
                }else if(!goodHours()){
                resetStatusValue(statusInput);
                showNotification('❌ Please improve your Booked Hours before Completing ⌛')
                }
            }
            if(statusInput.value.trim() !== "") flagFirstStatus = false;
            // Store initial value
            statusInput.setAttribute('data-previous-value', statusInput.value);
        };
    }
    function findLOTOPhotoRow() {
        const targetDescription = CONFIG.LOTOPICdescription;
        const tableRows = document.querySelectorAll('.x-grid-row');
        let ret = null
        tableRows.forEach((row, index) => {
            const cell = getCellText(row, 4);
            if (cell === targetDescription) {
                // Get the parent row
                visitedLOTO = true;
                ret = row
            };
        });

        return ret;
    };
    function findLOTOEnergyRow() {
        const targetDescription = CONFIG.LOTOneedDescription;
        const tableRows = document.querySelectorAll('.x-grid-row');
        let ret = null
        tableRows.forEach((row, index) => {
            const cell = getCellText(row, 4);
            if (cell === targetDescription) {
                ret = row
            };
        });

        return ret;
    };
    function checkLOTO(){
        const row = findLOTOPhotoRow();
        const rowt = findLOTOEnergyRow();
        if(!rowt) return false;
        if(row){
            const yesCheckbox = row.querySelector('input[id*="uxrowcheckbox"][id*="inputEl"]:first-of-type');
            const yes = yesCheckbox ? yesCheckbox.checked : false;
            const firstYesCheckbox = rowt.querySelector('input[id*="uxrowcheckbox"][id*="inputEl"]:first-of-type');
            const yest = firstYesCheckbox ? firstYesCheckbox.checked : false;
            if(yes){
                const documentCount = getCellNumericValue(row,9);
                if(documentCount < 1){
                    return true;
                };
                if(!yest) return true;
            }else{
                const commentField = row.querySelector('input[id*="textfield"][id*="inputEl"]');
                const comment = commentField ? commentField.value : '';
                if(comment.length < CONFIG.minLOTOcomment) return true;
                if(containsPhrases(comment,CONFIG.commentsShallNotInclude)){
                    return true;
                }
                if(yest) return true;
            };
            goodLOTO = true;
        }
        return false;
    };
    function LOTOAuditDefense(){
        const LOTOS = checkLOTO();
        if(LOTOS){
            showNotification('🔒Check your LOTO');
            goodLOTO = false;
        }
    };
    function BookingHoursTab(){
    const tab = document.querySelector('.x-tab-active');
    if(tab){
    const inner = tab.querySelector('.x-tab-inner');
        if(inner){
        if(inner.textContent === "Book Labor"){
            visitedHOURS = true;
        }
        }
    };
    }
    let settings = defaultSettings;
    function sendSlackMessage(to,message, from) {
        const payload = {
            to: `${to}@amazon.com`,
            message: message,
            channel: settings.channel,
            from: `${from}@amazon.com`
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: slackWO,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(payload),
            onload: function(response) {
                showNotification("💬 Message sent to slack")
                console.log('Slack message sent successfully:', response.responseText);
            },
            onerror: function(error) {
                showNotification("⚠️ Error, message wasn't sent to slack");
                console.error('Error sending Slack message:', error);
            }
        });
    }
    function hermesSlackMessage(message, from) {
        const payload = {
            message: message,
            channel: settings.channel,
            from: from
        };
        console.log(payload);

        GM_xmlhttpRequest({
            method: 'POST',
            url: slackHERMES,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(payload),
            onload: function(response) {
                showNotification("💬 Message sent to slack")
                console.log('Slack message sent successfully:', response.responseText);
            },
            onerror: function(error) {
                showNotification("⚠️ Error, message wasn't sent to slack");
                console.error('Error sending Slack message:', error);
            }
        });
    }

    // Load settings from storage
    function loadSettings() {
        const settings = {};
        settings.login = GM_getValue('apm_login', defaultSettings.login);
        settings.slackFollowUp = GM_getValue('apm_slackFollowUp', defaultSettings.slackFollowUp);
        settings.coachWO = GM_getValue('apm_coachWO', defaultSettings.coachWO);
        settings.channel = GM_getValue('apm_channel', defaultSettings.channel);
        if(settings.login.trim() === ''){
            showNotification("🚀 Welcome to the APM Control Panel! The page will refresh shortly");
        }
        return settings;
    }

    // Save settings to storage
    function saveSettings(settings) {
        GM_setValue('apm_slackFollowUp', settings.slackFollowUp);
        GM_setValue('apm_coachWO', settings.coachWO);
        GM_setValue('apm_channel', settings.channel);
        console.log('Settings saved:', settings); // Debug log
    }

    // Create settings panel
    function createSettingsPanel() {
        if (settingsPanel) {
            // Remove existing panel to recreate with fresh settings
            settingsPanel.remove();
            settingsPanel = null;
        }

        settings = loadSettings();
        console.log('Loading settings:', settings); // Debug log

        // Settings panel container
        settingsPanel = document.createElement('div');
        settingsPanel.id = 'apm-settings-panel';
        settingsPanel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 10px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        z-index: 10003;
        font-family: Arial, sans-serif;
        color: white;
        display: none;
    `;

        // Settings header
        const header = document.createElement('div');
        header.style.cssText = `
        background: rgba(0,0,0,0.2);
        padding: 15px;
        border-radius: 10px 10px 0 0;
        font-weight: bold;
        text-align: center;
        font-size: 18px;
        cursor: move;
        position: relative;
    `;
        header.textContent = '⚙️ Settings';

        // Settings content
        const content = document.createElement('div');
        content.style.cssText = `
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    `;

        // Channel Input
        const channelGroup = document.createElement('div');
        channelGroup.innerHTML = `
        <label style="display: block; margin-bottom: 8px; font-weight: bold;">Channel:</label>
        <input type="text" id="apm-channel-input" value="${settings.channel}" style="width: 100%;
            padding: 10px;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            box-sizing: border-box;">
    `;

        // Slack follow up toggle
        const slackGroup = document.createElement('div');
        slackGroup.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;

        const slackToggleContainer = document.createElement('label');
        slackToggleContainer.style.cssText = `
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
    `;

        const slackCheckbox = document.createElement('input');
        slackCheckbox.type = 'checkbox';
        slackCheckbox.id = 'apm-slack-toggle';
        slackCheckbox.checked = settings.slackFollowUp;
        slackCheckbox.style.cssText = 'opacity: 0; width: 0; height: 0;';

        const slackSlider = document.createElement('span');
        slackSlider.className = 'toggle-slider';
        slackSlider.style.cssText = `
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: ${settings.slackFollowUp ? '#2196F3' : '#ccc'};
        transition: .4s;
        border-radius: 34px;
    `;

        const slackCircle = document.createElement('span');
        slackCircle.className = 'toggle-circle';
        slackCircle.style.cssText = `
        position: absolute;
        content: '';
        height: 26px;
        width: 26px;
        left: ${settings.slackFollowUp ? '30px' : '4px'};
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    `;

        slackSlider.appendChild(slackCircle);
        slackToggleContainer.appendChild(slackCheckbox);
        slackToggleContainer.appendChild(slackSlider);

        const slackLabel = document.createElement('label');
        slackLabel.style.fontWeight = 'bold';
        slackLabel.textContent = 'Slack Follow Up:';

        slackGroup.appendChild(slackLabel);
        slackGroup.appendChild(slackToggleContainer);

        // Flag bad WO toggle
        const flagGroup = document.createElement('div');
        flagGroup.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;

        const flagToggleContainer = document.createElement('label');
        flagToggleContainer.style.cssText = `
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
    `;

        const flagCheckbox = document.createElement('input');
        flagCheckbox.type = 'checkbox';
        flagCheckbox.id = 'apm-flag-toggle';
        flagCheckbox.checked = settings.coachWO;
        flagCheckbox.style.cssText = 'opacity: 0; width: 0; height: 0;';

        const flagSlider = document.createElement('span');
        flagSlider.className = 'toggle-slider';
        flagSlider.style.cssText = `
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: ${settings.coachWO ? '#2196F3' : '#ccc'};
        transition: .4s;
        border-radius: 34px;
    `;

        const flagCircle = document.createElement('span');
        flagCircle.className = 'toggle-circle';
        flagCircle.style.cssText = `
        position: absolute;
        content: '';
        height: 26px;
        width: 26px;
        left: ${settings.coachWO ? '30px' : '4px'};
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    `;

        flagSlider.appendChild(flagCircle);
        flagToggleContainer.appendChild(flagCheckbox);
        flagToggleContainer.appendChild(flagSlider);

        const flagLabel = document.createElement('label');
        flagLabel.style.fontWeight = 'bold';
        flagLabel.textContent = 'Coach Work Orders:';

        flagGroup.appendChild(flagLabel);
        flagGroup.appendChild(flagToggleContainer);

        // Button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
        display: flex;
        justify-content: center;
        margin-top: 20px;
    `;

        // Save button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.cssText = `
        padding: 12px 30px;
        border: none;
        border-radius: 5px;
        background-color: #4CAF50;
        color: white;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 16px;
    `;
        saveButton.addEventListener('mouseenter', () => {
            saveButton.style.backgroundColor = '#45a049';
        });
        saveButton.addEventListener('mouseleave', () => {
            saveButton.style.backgroundColor = '#4CAF50';
        });
        saveButton.addEventListener('click', () => {
            const newSettings = {
                slackFollowUp: document.getElementById('apm-slack-toggle').checked,
                coachWO: document.getElementById('apm-flag-toggle').checked,
                channel: document.getElementById('apm-channel-input').value
            }
            saveSettings(newSettings);
            settings = newSettings;
            showNotification('⚙️ Settings saved successfully!');
            toggleSettingsPanel();
        });

        // Assemble settings panel
        buttonContainer.appendChild(saveButton);
        content.appendChild(channelGroup);
        content.appendChild(slackGroup);
        content.appendChild(flagGroup);
        content.appendChild(buttonContainer);
        settingsPanel.appendChild(header);
        settingsPanel.appendChild(content);
        document.body.appendChild(settingsPanel);

        // Add toggle functionality after elements are added to DOM
        setTimeout(() => {
            // Slack toggle functionality
            const slackToggle = slackSlider;
            const slackInput = slackCheckbox;
            const slackToggleCircle = slackCircle;

            slackToggle.addEventListener('click', (e) => {
                e.preventDefault();
                slackInput.checked = !slackInput.checked;
                updateToggleAppearance(slackToggle, slackToggleCircle, slackInput.checked);
            });

            // Flag toggle functionality
            const flagToggle = flagSlider;
            const flagInput = flagCheckbox;
            const flagToggleCircle = flagCircle;

            flagToggle.addEventListener('click', (e) => {
                e.preventDefault();
                flagInput.checked = !flagInput.checked;
                updateToggleAppearance(flagToggle, flagToggleCircle, flagInput.checked);
                if(flagInput.checked){
                    //observer = createObserver();
                }else{
                    //observer.disconnect();
                    //observer = null;
                }
            });
        }, 100);

        // Make settings panel draggable
        makeDraggable(settingsPanel, header);
    }

// Update toggle appearance
function updateToggleAppearance(slider, circle, isChecked) {
    slider.style.backgroundColor = isChecked ? '#2196F3' : '#ccc';
    circle.style.left = isChecked ? '30px' : '4px';
}

function toggleSettingsPanel() {
    if (!settingsPanel) createSettingsPanel();

    isSettingsVisible = !isSettingsVisible;
    settingsPanel.style.display = isSettingsVisible ? 'block' : 'none';
}
    function getFieldName() {
        const fieldInput = document.querySelector('input[name="fieldname"]');
        return fieldInput ? fieldInput.value.trim() : null;
    }

    // Function to get the new value
    function getNewValue() {
        const valueInput = document.querySelector('input[name="filtervalue"]');
        return valueInput ? valueInput.value.trim() : null;
    }
        //get Selected Work Orders
 function getSelectedWorkOrders() {
    // Find all selected grid items
    //define headers
    let idIndex = -1;
    let descriptionIndex = -1;
    const headers = document.querySelectorAll('.x-column-header');
    let i = 0;
    headers.forEach(header =>{
       const headerPart = header.querySelector('.x-column-header-text');
       const Name = headerPart ? headerPart.textContent.trim() : '';
       switch(Name){
           case "Work Order":
               idIndex = i;
           break;
           case "Description":
               descriptionIndex = i;
           break;
       }
        i++;
    })
    const workOrders = [];
    if(idIndex === -1 || descriptionIndex === -1) return workOrders;
    const selectedItems = document.querySelectorAll('.x-grid-item.x-grid-item-selected');
    selectedItems.forEach(row => {
        const workOrder = getCellText(row, idIndex)
        const description = getCellText(row, descriptionIndex)
        if (workOrder && description) {
                workOrders.push({
                    workOrderNumber: workOrder,
                    description: description
                });
        }
    });
    return workOrders;
    }

    // Function to click all "Yes" checkboxes
    function clickAllYesCheckboxes() {
        const yesCheckboxes = document.querySelectorAll('input[type="checkbox"]');
        let checkedCount = 0;

        yesCheckboxes.forEach(checkbox => {
            const label = document.querySelector(`label[for="${checkbox.id}"]`);
            if (label && (label.textContent.includes('Yes:') || label.textContent.includes('Completed') || label.textContent.includes('Good'))) {
                if (!checkbox.checked) {
                    checkbox.click();
                    checkedCount++;
                }
            }
        });
        return checkedCount;
    }

    // Function to click all "No" checkboxes
    function clickAllNoCheckboxes() {
        const noCheckboxes = document.querySelectorAll('input[type="checkbox"]');
        let checkedCount = 0;

        noCheckboxes.forEach(checkbox => {
            const label = document.querySelector(`label[for="${checkbox.id}"]`);
            if (label && (label.textContent.includes('No:') || label.textContent.includes('Incomplete') || label.textContent.includes('Poor'))) {
                if (!checkbox.checked) {
                    checkbox.click();
                    checkedCount++;
                }
            }
        });
        return checkedCount;
    }

    // Function to uncheck all checkboxes
    function uncheckAllCheckboxes() {
        const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
        let uncheckedCount = 0;

        allCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const label = document.querySelector(`label[for="${checkbox.id}"]`);
                if(label && label.textContent.includes("Show Filter Row:")) return;
                checkbox.click();
                uncheckedCount++;
            }
        });
        return uncheckedCount;
    }
    function createControlPanel() {
        if (controlPanel) return; // Don't create multiple panels

        // Main panel container
        controlPanel = document.createElement('div');
        controlPanel.id = 'apm-control-panel';
        controlPanel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 280px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            color: white;
            display: none;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            background: rgba(0,0,0,0.2);
            padding: 15px 50px 15px 15px;
            border-radius: 10px 10px 0 0;
            font-weight: bold;
            text-align: center;
            font-size: 16px;
            cursor: move;
            position: relative;
        `;
        header.textContent = '🔧 APM Control Panel';

        // Settings button in header
        const settingsButton = document.createElement('button');
        settingsButton.textContent = '⚙️';
        settingsButton.title = 'Settings';
        settingsButton.style.cssText = `
            position: absolute;
            right: 35px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            padding: 8px;
            border-radius: 3px;
            transition: background-color 0.3s ease;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        settingsButton.addEventListener('mouseenter', () => {
            settingsButton.style.backgroundColor = 'rgba(255,255,255,0.2)';
        });
        settingsButton.addEventListener('mouseleave', () => {
            settingsButton.style.backgroundColor = 'transparent';
        });
        settingsButton.addEventListener('click', toggleSettingsPanel);

        // Close button
        const closeButton = document.createElement('button');
        closeButton.textContent = '✖';
        closeButton.style.cssText = `
            position: absolute;
            top: 50%;
            right: 8px;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            padding: 8px;
            border-radius: 3px;
            transition: background-color 0.3s ease;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.backgroundColor = 'rgba(255,255,255,0.2)';
        });
        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.backgroundColor = 'transparent';
        });
        closeButton.addEventListener('click', togglePanel);

        // Add buttons to header
        header.appendChild(settingsButton);
        header.appendChild(closeButton);

        // Button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        // Button style template
        const buttonStyle = `
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            font-size: 14px;
        `;

        // Create buttons
        const buttons = [
            {
                text: '✅ Check All YES',
                color: '#4CAF50',
                hoverColor: '#45a049',
                action: () => {
                    const count = clickAllYesCheckboxes();
                    showNotification(`✅ Checked ${count} YES checkboxes`);
                }
            },
            {
                text: '❌ Check All NO',
                color: '#f44336',
                hoverColor: '#da190b',
                action: () => {
                    const count = clickAllNoCheckboxes();
                    showNotification(`❌ Checked ${count} NO checkboxes`);
                }
            },
            {
                text: '🔄 Clear All',
                color: '#FF9800',
                hoverColor: '#e68900',
                action: () => {
                    const count = uncheckAllCheckboxes();
                    showNotification(`🔄 Cleared ${count} checkboxes`);
                }
            },
            {
                text: '🔍 Scan WOs',
                color: '#9C27B0',
                hoverColor: '#7B1FA2',
                action: () => {
                    const result = defineIndex();
                    if(!result){
                        showNotification('⚙️ Scan could not be run');
                        return;
                    }
                    highlightInvalidRows();
                }
            },
            {
                text: '🐶 Deliver',
                color: '#2196F3',
                hoverColor: '#1976D2',
                action: () => {
                    const workOrders = getSelectedWorkOrders();
                    let message = '';
                    if (workOrders.length > 0) {
                        message = `${workOrders.length} work order(s):\n`;
                        message += workOrders.map(wo => `• ${wo.workOrderNumber}: ${wo.description}`).join('\n');
                        hermesSlackMessage(message, settings.login);
                    } else {
                        const Code = document.querySelector('.recordcode')
                        if(!Code){
                                  showNotification('⚠️ Error: Nothing selected');
                                 }
                        else{
                        const codeval = Code.textContent
                        const title = document.querySelector('.pagetitle')
                        if(!title) return showNotification('⚠️ Error: No valid page title');
                        message = `${title.textContent}: \n`
                        message += `${codeval}`
                        hermesSlackMessage(message, settings.login);
                        }
                    }
                }
            }
        ];

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.style.cssText = buttonStyle + `background-color: ${btn.color}; color: white;`;

            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = btn.hoverColor;
                button.style.transform = 'translateY(-2px)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = btn.color;
                button.style.transform = 'translateY(0)';
            });

            button.addEventListener('click', btn.action);
            buttonContainer.appendChild(button);
        });

        // Assemble panel
        controlPanel.appendChild(header);
        controlPanel.appendChild(buttonContainer);
        document.body.appendChild(controlPanel);

        // Make panel draggable
        makeDraggable(controlPanel, header);
    }

    // Create toggle button
    function createToggleButton() {
        const existingTool = document.getElementById("APMControlTool");
        if(existingTool) return console.log("Tool was previously generated");
        const toggleButton = document.createElement('button');
        toggleButton.textContent = '🔧';
        toggleButton.title = 'APM Control Panel';
        toggleButton.id = 'APMControlTool';
        toggleButton.style.cssText = `
            position: fixed;
            bottom: 70px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 10001;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;

        toggleButton.addEventListener('mouseenter', () => {
            toggleButton.style.transform = 'scale(1.1)';
        });

        toggleButton.addEventListener('mouseleave', () => {
            toggleButton.style.transform = 'scale(1)';
        });

        toggleButton.addEventListener('click', togglePanel);
        document.body.appendChild(toggleButton);
    }

    // Toggle panel visibility
    function togglePanel() {
        if (!controlPanel) createControlPanel();

        isVisible = !isVisible;
        controlPanel.style.display = isVisible ? 'block' : 'none';
    }

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = 'temp-notification';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            z-index: 10002;
            font-family: Arial, sans-serif;
            font-size: 16px;
        `;

        document.body.appendChild(notification);
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 2000);
    }

    // Make element draggable
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.addEventListener('mousedown', dragMouseDown);

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.addEventListener('mouseup', closeDragElement);
            document.addEventListener('mousemove', elementDrag);
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('mousemove', elementDrag);
        }
    }
     function pickSearchWO(){
         if(!flagFirstStatus) return;
        const headers = document.querySelector('.x-column-header');
         if(!headers) return;
        const table = document.querySelectorAll('.x-grid-row');
        if(!table|| table.length === 0) return;
        if(table.length > 1) return;
        const input = document.querySelector('input[tabindex="10620"]');
        if(!input) return;
        const inputVal = input.value;
         if(inputVal !== "Work Order") return;
     try {
        table[0].dispatchEvent(new MouseEvent('dblclick', {
            bubbles: true,
            cancelable: true,
        }));
    } catch (error) {
        console.log('Click failed:', error);
    }
        showNotification('🔍 Navigating to work order');

    }
    function assignLogin(){
        if(captureLoginFlag) return;
        const login = getUserID()
        console.log(login)
        if(!login) return;
        if(login === settings.login){
            captureLoginFlag = true;
            return
        };
        GM_setValue('apm_login', login)
        showNotification("🔄Captured login refreshing page")
        setTimeout(() => {
            window.location.replace("https://us1.eam.hxgnsmartcloud.com/web/base/logindisp?tenant=AMAZONRMENA_PRD");
        }, 1500);
    }
    function getFirstAssign(){
        if(OriginalWOowner != 178948200000) return;
        const assignedToField = document.querySelector('input[name="assignedto"]');
        if(!assignedToField) return;
        OriginalWOowner = "capturing"
        setTimeout(() => {
                    OriginalWOowner = assignedToField.value.trim().toUpperCase();
        }, CONFIG.throttling);

    }
    function createObserver(){
        let debounceTimeout;

        const observer = new MutationObserver((mutations) => {

            const hasNotificationMutation = mutations.some(mutation => {
            if (mutation.type === 'childList') {
                return Array.from(mutation.addedNodes)
                    .concat(Array.from(mutation.removedNodes))
                    .some(node => node.classList?.contains('temp-notification'));
            }
            return false;
            });

            if (hasNotificationMutation) return; // Skip if notification-related
            // Clear the previous timeout
            clearTimeout(debounceTimeout);

            debounceTimeout = setTimeout(() => {
                assignLogin();
                findWOID();
                getFirstAssign();
                if(settings.coachWO){ 
                setupInterceptors();
                LOTOAuditDefense();
                BookingHoursTab();
                checkDateRows();
                pickSearchWO();
                const result = defineIndex();
                if(result){
                    highlightInvalidRows();
                    //showNotification('⚙️ Scan could not be run');
                    return;
                }
                }
            }, CONFIG.throttling);
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style', 'value', 'checked']
        });
    }
let slackMessageTimeout = null;
function FormIntercepted(form) {
    //console.log("🎯 FORM INTERCEPTED!", form);
    const field = getFieldName();
    const newVal = getNewValue();
        if(field === "Assigned To"){
          if(!settings.slackFollowUp) return;
          const workOrders = getSelectedWorkOrders();
         let message = '';
         if (workOrders.length > 0) {
             message = `${workOrders.length} work order(s) assigned:\n`;
             message += workOrders.map(wo => `• ${wo.workOrderNumber}: ${wo.description}`).join('\n');
         } else {
             message = 'No work orders selected';
         }
         if (slackMessageTimeout) {
            clearTimeout(slackMessageTimeout);
        }
        slackMessageTimeout = setTimeout(() => {
            sendSlackMessage(newVal, message, settings.login.toUpperCase());
        }, 1000);
        }
    return Promise.resolve();
}
let informSlackMessageTimeout = null;
function informWOuser(User){
    const message = `${lastWO}`
         if (informSlackMessageTimeout) {
            clearTimeout(informSlackMessageTimeout);
        }
        informSlackMessageTimeout = setTimeout(() => {
            sendSlackMessage(User, message, settings.login.toUpperCase());
        }, 1000);
}


function createFormIntercept() {
    const originalXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(data) {
        const method = this._method || 'GET';
        const url = this._url || '';
        if (method === 'POST') {
             if (url.includes('BSUPLV.submit')) {
                console.log("🚨 RELEVANT POST REQUEST INTERCEPTED");
                FormIntercepted({ method, url, data });
            }else if((url.includes('fieldvalidate') || url.includes('LOVPOP') )&& data && data.includes('LOV_TAGNAME=assignedto')){
              if(!settings.slackFollowUp) return;
                const personMatch = data.match(/filtervalue=([^&]+)/);
                const personCode = personMatch ? decodeURIComponent(personMatch[1]) : 'Unknown';
                if(!personCode || personCode === 'Unknown') return;
                if(OriginalWOowner === personCode.toUpperCase()) return;
                informWOuser(personCode);
            }
            else {
                //console.log("📝 Ignored POST request to:", url);
                //console.log(method);
                //console.log(data);
            }
        }
        return originalXHRSend.apply(this, arguments);
    };
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._method = method;
        this._url = url;
        return originalXHROpen.apply(this, [method, url, ...args]);
    };
}
    function searchBar(){
    if (window.top !== window.self || document.getElementById('searchBarContainer')) {
        return;
    }

    // Create a container for the search bar
    const searchContainer = document.createElement('div');
    searchContainer.id = 'searchBarContainer';
    searchContainer.style.cssText = `
        position: fixed;
        top: 0;
        right: 100px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 8px;
        z-index: 1000;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        border-radius: 0 0 10px 10px;
        font-family: Arial, sans-serif;
        display: flex;
        align-items: center;
        gap: 10px;
    `;

    // Create the input field
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Enter APM work order...';
    inputField.style.cssText = `
        padding: 8px 12px;
        width: 300px;
        border: none;
        border-radius: 5px;
        font-size: 14px;
        font-weight: bolder;
        box-sizing: border-box;
        background-color: white;
        color: black;
        transition: all 0.3s ease;
        height: 36px;
    `;

    // Add focus effects to input
    inputField.addEventListener('focus', () => {
        inputField.style.boxShadow = '0 0 0 2px rgba(255,255,255,0.5)';
    });

    inputField.addEventListener('blur', () => {
        inputField.style.boxShadow = 'none';
    });

    // Create the button
    const searchButton = document.createElement('button');
    searchButton.textContent = '🔍';
    searchButton.title = 'Search Work Order';
    searchButton.style.cssText = `
        padding: 6px 10px;
        background: rgba(255,255,255,0.2);
        color: white;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
        font-size: 16px;
        width: 36px;
        height: 36px;
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    // Add hover effects to button
    searchButton.addEventListener('mouseenter', () => {
        searchButton.style.background = 'rgba(255,255,255,0.3)';
        searchButton.style.borderColor = 'rgba(255,255,255,0.5)';
        searchButton.style.transform = 'translateY(-1px)';
        searchButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    });

    searchButton.addEventListener('mouseleave', () => {
        searchButton.style.background = 'rgba(255,255,255,0.2)';
        searchButton.style.borderColor = 'rgba(255,255,255,0.3)';
        searchButton.style.transform = 'translateY(0)';
        searchButton.style.boxShadow = 'none';
    });

    // Add Enter key support
    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            searchButton.click();
        }
    });

    // Append the input field and button to the container
    searchContainer.appendChild(inputField);
    searchContainer.appendChild(searchButton);

    // Append the container to the body
    document.body.appendChild(searchContainer);

    // Add click event listener to the button
    searchButton.addEventListener('click', () => {
        const inputValue = inputField.value.trim();
        const maxLength = 11;
        const baseUrl = "https://us1.eam.hxgnsmartcloud.com/web/base/logindisp?tenant=AMAZONRMENA_PRD&FROMEMAIL=YES&SYSTEM_FUNCTION_NAME=WSJOBS&USER_FUNCTION_NAME=WSJOBS&workordernum=";
        if (/^\d{1,11}$/.test(inputValue)) {
            // Add loading state
            searchButton.style.background = 'rgba(255,193,7,0.8)';
            searchButton.textContent = '⏳';
            searchButton.disabled = true;
            window.location.href = baseUrl + inputValue;
        } else {
            showNotification('❌ Please enter a valid number up to 11 digits');

            // Add error shake animation
            inputField.style.animation = 'shake 0.5s ease-in-out';

            setTimeout(() => {
                inputField.style.animation = '';
            }, 500);
        }
    });

    // Add CSS for shake animation
    if (!document.getElementById('searchbar-styles')) {
        const style = document.createElement('style');
        style.id = 'searchbar-styles';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
}
    function cleanupParentInitializations() {
        if (window === window.top) {
            console.log("APM: In top window - no parent cleanup needed");
            return;
        }

        console.log("APM: In child frame - attempting to cleanup parent initializations");

        try {
            // Try to remove button from parent window
            const parentButton = window.parent.document.getElementById("APMControlTool");
            if (parentButton) {
                parentButton.remove();
                console.log("✅ APM: Removed button from parent window");
            } else {
                console.log("APM: No button found in parent window");
            }

            // Try to remove button from top window (if different from parent)
            if (window.parent !== window.top) {
                const topButton = window.top.document.getElementById("APMControlTool");
                if (topButton) {
                    topButton.remove();
                    console.log("✅ APM: Removed button from top window");
                }
            }

            // Set a flag in parent windows to prevent re-initialization
            window.parent.APM_DISABLED_BY_CHILD = true;
            if (window.parent !== window.top) {
                window.top.APM_DISABLED_BY_CHILD = true;
            }

        } catch (error) {
            console.log("APM: Cannot access parent window (cross-origin):", error.message);
        }
    }

    // Initialize when page is ready
    function initialize() {
        if (document.body) {
            if(window.APMControlInitialized) return;
            window.APMControlInitialized = true;
            createToggleButton();
            createFormIntercept();
            if(!observer){
                observer = createObserver();
            }
            console.log("APM Control Panel initialized");
            settings = loadSettings();
            cleanupParentInitializations();
            searchBar();
        } else {
            setTimeout(initialize, 500);
        }
    }

    initialize();
})();