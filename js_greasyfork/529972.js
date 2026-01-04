// ==UserScript==
// @name         Torn Faction Summaries
// @namespace    http://tampermonkey.net/
// @version      1.17
// @description  Floating summaries of faction online and status info on Torn.com, with API key input, persistent positions, settings, two main boxes with clickable statuses opening separate popups for names (independent for each faction), popups refresh with API, optional second faction tracking, chain info panel with dynamic font sizing and functional emergency hit buttons, and multi-page hiding.
// @author       Rufus
// @match        *://www.torn.com/*
// @match        *://torn.com/*
// @icon         https://www.torn.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529972/Torn%20Faction%20Summaries.user.js
// @updateURL https://update.greasyfork.org/scripts/529972/Torn%20Faction%20Summaries.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Config
    let API_KEY = localStorage.getItem('tornApiKey') || '';
    const USER_FACTION_ID = ''; // User's faction ID (leave blank if dynamic)
    const settings = JSON.parse(localStorage.getItem('factionSummarySettings')) || {
        lockPosition: true,
        trackSecondFaction: false,
        secondFactionId: '',
        showChainInfo: false,
        hideOnPages: [],
        emergencyHit1: '',
        emergencyHit2: ''
    };
    const UPDATE_INTERVAL = 30000;
    const DEFAULT_POSITIONS = {
        userOnline: { top: '10px', left: '10px' },
        userStatus: { top: '50px', left: '10px' },
        secondOnline: { top: '10px', left: '250px' },
        secondStatus: { top: '50px', left: '250px' },
        chainInfo: { top: '10px', left: '500px' },
        popupOnline: { top: '100px', left: '200px' },
        popupIdle: { top: '120px', left: '220px' },
        popupOffline: { top: '140px', left: '240px' },
        popupOkay: { top: '160px', left: '260px' },
        popupTraveling: { top: '180px', left: '280px' },
        popupAbroad: { top: '200px', left: '300px' },
        popupHospital: { top: '220px', left: '320px' },
        popupJail: { top: '240px', left: '340px' },
        popupFederal: { top: '260px', left: '360px' }
    };
    const STATUS_COLORS = {
        'Online': '#00FF00',
        'Idle': '#FFD700',
        'Offline': '#FF0000',
        'Okay': '#00FF00',
        'Traveling': '#00CCFF',
        'Abroad': '#00CCFF',
        'In Hospital': '#FF0000',
        'In Jail': '#FFFFFF',
        'Federal': '#808080'
    };
    const TIMEOUT_COLORS = {
        good: '#00FF00', // 5:00 to 3:30 (300s to 210s)
        warning: '#FFD700', // 3:30 to 2:00 (210s to 120s)
        urgent: '#FF0000' // Below 2:00 (<120s)
    };

    // Load saved positions or set defaults
    const savedPositions = {};
    for (const [key, defaultPos] of Object.entries(DEFAULT_POSITIONS)) {
        savedPositions[key] = settings.lockPosition ? (JSON.parse(localStorage.getItem(`${key}BoxPos`)) || defaultPos) : defaultPos;
    }

    // Create Main Boxes
    const userOnlineBox = document.createElement('div');
    userOnlineBox.id = 'user-online-summary-box';
    userOnlineBox.style.top = savedPositions.userOnline.top;
    userOnlineBox.style.left = savedPositions.userOnline.left;
    document.body.appendChild(userOnlineBox);

    const userStatusBox = document.createElement('div');
    userStatusBox.id = 'user-status-summary-box';
    userStatusBox.style.top = savedPositions.userStatus.top;
    userStatusBox.style.left = savedPositions.userStatus.left;
    document.body.appendChild(userStatusBox);

    const secondOnlineBox = document.createElement('div');
    secondOnlineBox.id = 'second-online-summary-box';
    secondOnlineBox.style.top = savedPositions.secondOnline.top;
    secondOnlineBox.style.left = savedPositions.secondOnline.left;
    secondOnlineBox.style.display = settings.trackSecondFaction ? 'block' : 'none';
    document.body.appendChild(secondOnlineBox);

    const secondStatusBox = document.createElement('div');
    secondStatusBox.id = 'second-status-summary-box';
    secondStatusBox.style.top = savedPositions.secondStatus.top;
    secondStatusBox.style.left = savedPositions.secondStatus.left;
    secondStatusBox.style.display = settings.trackSecondFaction ? 'block' : 'none';
    document.body.appendChild(secondStatusBox);

    const chainInfoBox = document.createElement('div');
    chainInfoBox.id = 'chain-info-box';
    chainInfoBox.style.top = savedPositions.chainInfo.top;
    chainInfoBox.style.left = savedPositions.chainInfo.left;
    chainInfoBox.style.display = settings.showChainInfo ? 'block' : 'none';
    document.body.appendChild(chainInfoBox);

    // Create Popup Boxes for User and Second Faction
    const userPopups = {};
    const secondPopups = {};
    ['Online', 'Idle', 'Offline', 'Okay', 'Traveling', 'Abroad', 'In Hospital', 'Jail', 'Federal'].forEach(status => {
        const key = `popup${status.replace('In ', '')}`;

        // User faction popups
        userPopups[status] = document.createElement('div');
        userPopups[status].id = `user-${status.toLowerCase().replace(' ', '-')}-names-popup`;
        userPopups[status].style.top = savedPositions[key].top;
        userPopups[status].style.left = savedPositions[key].left;
        userPopups[status].style.display = 'none';
        userPopups[status].dataset.faction = 'user';
        document.body.appendChild(userPopups[status]);

        // Second faction popups
        secondPopups[status] = document.createElement('div');
        secondPopups[status].id = `second-${status.toLowerCase().replace(' ', '-')}-names-popup`;
        secondPopups[status].style.top = savedPositions[key].top;
        secondPopups[status].style.left = `${parseInt(savedPositions[key].left) + 220}px`; // Offset for visibility
        secondPopups[status].style.display = 'none';
        secondPopups[status].dataset.faction = 'second';
        document.body.appendChild(secondPopups[status]);
    });

    // Create API Key Input Box
    const apiInputBox = document.createElement('div');
    apiInputBox.id = 'api-input-box';
    apiInputBox.innerHTML = `
        <div style="background: rgba(26, 26, 26, 0.9); padding: 15px; border: 1px solid #ff00ff; box-shadow: 0 0 10px #ff00ff;">
            <label style="color: #e0e0e0; font-family: 'Courier New', monospace;">Enter your Torn API Key:</label><br>
            <input type="text" id="api-key-input" style="width: 200px; padding: 5px; margin: 10px 0; background: #3a3a3a; border: 1px solid #00ffcc; color: #e0e0e0; font-family: 'Courier New', monospace;">
            <br>
            <button id="api-save-btn" style="padding: 5px 10px; background: #ff00ff; border: none; color: #e0e0e0; cursor: pointer;">Save</button>
        </div>
    `;
    apiInputBox.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10002;
        display: none;
    `;
    document.body.appendChild(apiInputBox);

    // Create Settings Button
    const settingsBtn = document.createElement('button');
    settingsBtn.id = 'settings-btn';
    settingsBtn.textContent = '⚙️';
    settingsBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #ff00ff;
        color: #e0e0e0;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
        z-index: 10001;
        font-size: 16px;
    `;
    document.body.appendChild(settingsBtn);

    // Create Settings Panel
    const settingsPanel = document.createElement('div');
    settingsPanel.id = 'settings-panel';
    settingsPanel.innerHTML = `
        <div style="background: rgba(26, 26, 26, 0.9); padding: 15px; border: 1px solid #ff00ff; box-shadow: 0 0 10px #ff00ff;">
            <h3 style="color: #e0e0e0; font-family: 'Courier New', monospace; margin: 0 0 10px;">Settings</h3>
            <label style="color: #e0e0e0; font-family: 'Courier New', monospace;">
                <input type="checkbox" id="lock-position" ${settings.lockPosition ? 'checked' : ''}> Lock Position Across Pages
            </label><br>
            <label style="color: #e0e0e0; font-family: 'Courier New', monospace;">
                <input type="checkbox" id="track-second-faction" ${settings.trackSecondFaction ? 'checked' : ''}> Track Another Faction
            </label><br>
            <div id="second-faction-id-input" style="display: ${settings.trackSecondFaction ? 'block' : 'none'}; margin-top: 10px;">
                <label style="color: #e0e0e0; font-family: 'Courier New', monospace;">Second Faction ID:</label><br>
                <input type="text" id="second-faction-id" value="${settings.secondFactionId || ''}" style="width: 100px; padding: 5px; background: #3a3a3a; border: 1px solid #00ffcc; color: #e0e0e0; font-family: 'Courier New', monospace;">
            </div>
            <label style="color: #e0e0e0; font-family: 'Courier New', monospace;">
                <input type="checkbox" id="show-chain-info" ${settings.showChainInfo ? 'checked' : ''}> Show Chain Info Panel
            </label><br>
            <div style="margin-top: 10px;">
                <label style="color: #e0e0e0; font-family: 'Courier New', monospace;">Hide on Pages (comma-separated URLs):</label><br>
                <input type="text" id="hide-on-pages" value="${Array.isArray(settings.hideOnPages) ? settings.hideOnPages.join(', ') : ''}" style="width: 200px; padding: 5px; background: #3a3a3a; border: 1px solid #00ffcc; color: #e0e0e0; font-family: 'Courier New', monospace;" placeholder="e.g., faction.php, jailview.php">
            </div>
            <div style="margin-top: 10px;">
                <label style="color: #e0e0e0; font-family: 'Courier New', monospace;">Emergency Hit 1 URL:</label><br>
                <input type="text" id="emergency-hit-1" value="${settings.emergencyHit1 || ''}" style="width: 200px; padding: 5px; background: #3a3a3a; border: 1px solid #00ffcc; color: #e0e0e0; font-family: 'Courier New', monospace;" placeholder="e.g., https://www.torn.com/loader.php?sid=attack&user2ID=12345">
            </div>
            <div style="margin-top: 10px;">
                <label style="color: #e0e0e0; font-family: 'Courier New', monospace;">Emergency Hit 2 URL:</label><br>
                <input type="text" id="emergency-hit-2" value="${settings.emergencyHit2 || ''}" style="width: 200px; padding: 5px; background: #3a3a3a; border: 1px solid #00ffcc; color: #e0e0e0; font-family: 'Courier New', monospace;" placeholder="e.g., https://www.torn.com/loader.php?sid=attack&user2ID=67890">
            </div>
            <button id="settings-save-btn" style="padding: 5px 10px; background: #ff00ff; border: none; color: #e0e0e0; cursor: pointer; margin-top: 10px;">Save</button>
            <button id="settings-close-btn" style="padding: 5px 10px; background: #666; border: none; color: #e0e0e0; cursor: pointer; margin-top: 10px; margin-left: 10px;">Close</button>
        </div>
    `;
    settingsPanel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10002;
        display: none;
    `;
    document.body.appendChild(settingsPanel);

    // Add CSS for floating boxes and popups
    const style = document.createElement('style');
    style.textContent = `
        #user-online-summary-box, #user-status-summary-box, #second-online-summary-box, #second-status-summary-box, #chain-info-box {
            position: fixed;
            background: rgba(26, 26, 26, 0.9);
            color: #e0e0e0;
            font-family: 'Courier New', monospace;
            padding: 10px;
            border: 1px solid #ff00ff;
            box-shadow: 0 0 10px #ff00ff;
            z-index: 10000;
            font-size: 14px;
            cursor: move;
            user-select: none;
            line-height: 1.5;
            width: auto;
        }
        [id^="user-"][id$="-names-popup"], [id^="second-"][id$="-names-popup"] {
            position: fixed;
            background: rgba(26, 26, 26, 0.9);
            color: #e0e0e0;
            font-family: 'Courier New', monospace;
            padding: 10px;
            border: 1px solid #ff00ff;
            box-shadow: 0 0 10px #ff00ff;
            z-index: 10003;
            cursor: move;
            max-height: 300px;
            overflow-y: auto;
            font-size: 16px;
            width: 200px;
        }
        .status-span {
            cursor: pointer;
        }
        .status-span:hover {
            text-decoration: underline;
        }
        .faction-title {
            margin-bottom: 5px;
        }
        .emergency-btn {
            margin-top: 5px;
            padding: 5px 10px;
            background: #ff00ff;
            border: none;
            color: #e0e0e0;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            display: block;
        }
    `;
    document.head.appendChild(style);

    // Make boxes draggable and save position
    function makeDraggable(element, storageKey) {
        let posX = 0, posY = 0, mouseX = 0, mouseY = 0;

        element.addEventListener('mousedown', dragMouseDown);

        function dragMouseDown(e) {
            if (e.target.className !== 'status-span' && !e.target.id.includes('close-') && e.target.className !== 'emergency-btn') {
                e.preventDefault();
                mouseX = e.clientX;
                mouseY = e.clientY;
                document.addEventListener('mouseup', closeDragElement);
                document.addEventListener('mousemove', elementDrag);
                element.style.zIndex = parseInt(element.style.zIndex || 10000) + 1;
            }
        }

        function elementDrag(e) {
            e.preventDefault();
            posX = mouseX - e.clientX;
            posY = mouseY - e.clientY;
            mouseX = e.clientX;
            mouseY = e.clientY;
            element.style.top = (element.offsetTop - posY) + "px";
            element.style.left = (element.offsetLeft - posX) + "px";
        }

        function closeDragElement() {
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('mousemove', elementDrag);
            if (settings.lockPosition) {
                localStorage.setItem(storageKey, JSON.stringify({
                    top: element.style.top,
                    left: element.style.left
                }));
            }
        }
    }

    makeDraggable(userOnlineBox, 'userOnlineBoxPos');
    makeDraggable(userStatusBox, 'userStatusBoxPos');
    makeDraggable(secondOnlineBox, 'secondOnlineBoxPos');
    makeDraggable(secondStatusBox, 'secondStatusBoxPos');
    makeDraggable(chainInfoBox, 'chainInfoBoxPos');
    Object.entries(userPopups).forEach(([status, popup]) => makeDraggable(popup, `popup${status.replace('In ', '')}BoxPos`));
    Object.entries(secondPopups).forEach(([status, popup]) => makeDraggable(popup, `secondPopup${status.replace('In ', '')}BoxPos`));

    // Settings Panel Logic
    settingsBtn.onclick = () => settingsPanel.style.display = 'block';
    document.getElementById('settings-close-btn').onclick = () => settingsPanel.style.display = 'none';
    document.getElementById('track-second-faction').onchange = (e) => {
        document.getElementById('second-faction-id-input').style.display = e.target.checked ? 'block' : 'none';
    };

    document.getElementById('settings-save-btn').onclick = () => {
        const lockPosition = document.getElementById('lock-position').checked;
        const trackSecondFaction = document.getElementById('track-second-faction').checked;
        const secondFactionId = document.getElementById('second-faction-id').value.trim();
        const showChainInfo = document.getElementById('show-chain-info').checked;
        const hideOnPagesInput = document.getElementById('hide-on-pages').value.trim();
        const hideOnPages = hideOnPagesInput ? hideOnPagesInput.split(',').map(url => url.trim()).filter(url => url) : [];
        const emergencyHit1 = document.getElementById('emergency-hit-1').value.trim();
        const emergencyHit2 = document.getElementById('emergency-hit-2').value.trim();

        settings.lockPosition = lockPosition;
        settings.trackSecondFaction = trackSecondFaction;
        settings.secondFactionId = trackSecondFaction ? secondFactionId : '';
        settings.showChainInfo = showChainInfo;
        settings.hideOnPages = hideOnPages;
        settings.emergencyHit1 = emergencyHit1;
        settings.emergencyHit2 = emergencyHit2;
        localStorage.setItem('factionSummarySettings', JSON.stringify(settings));

        if (!lockPosition) {
            ['userOnline', 'userStatus', 'secondOnline', 'secondStatus', 'chainInfo', 'popupOnline', 'popupIdle', 'popupOffline', 'popupOkay', 'popupTraveling', 'popupAbroad', 'popupHospital', 'popupJail', 'popupFederal'].forEach(key => {
                localStorage.removeItem(`${key}BoxPos`);
                const element = document.getElementById(key.includes('popup') ? `user-${key.replace('popup', '').toLowerCase()}-names-popup` : `${key}-box`);
                if (element) {
                    element.style.top = DEFAULT_POSITIONS[key].top;
                    element.style.left = DEFAULT_POSITIONS[key].left;
                }
            });
            ['Online', 'Idle', 'Offline', 'Okay', 'Traveling', 'Abroad', 'Hospital', 'Jail', 'Federal'].forEach(status => {
                localStorage.removeItem(`secondPopup${status}BoxPos`);
                const element = document.getElementById(`second-${status.toLowerCase()}-names-popup`);
                if (element) {
                    element.style.top = DEFAULT_POSITIONS[`popup${status}`].top;
                    element.style.left = `${parseInt(DEFAULT_POSITIONS[`popup${status}`].left) + 220}px`;
                }
            });
        }
        secondOnlineBox.style.display = trackSecondFaction ? 'block' : 'none';
        secondStatusBox.style.display = trackSecondFaction ? 'block' : 'none';
        chainInfoBox.style.display = showChainInfo ? 'block' : 'none';
        settingsPanel.style.display = 'none';
        updateVisibility();
        fetchFactionData();
    };

    // Online Summary Logic
    function getOnlineSummary(members, factionName) {
        const onlineCounts = { Online: 0, Idle: 0, Offline: 0 };
        const onlineNames = { Online: [], Idle: [], Offline: [] };
        for (const [id, member] of Object.entries(members || {})) {
            const status = member.last_action?.status || "Offline";
            if (status in onlineCounts) {
                onlineCounts[status]++;
                onlineNames[status].push(member.name);
            }
        }
        return `<div class="faction-title">${factionName}</div>` +
               `Online Status: <span class="status-span" style="color: ${STATUS_COLORS.Online}" data-status="Online" data-names="${onlineNames.Online.join(',')}">Online (${onlineCounts.Online})</span>, ` +
               `<span class="status-span" style="color: ${STATUS_COLORS.Idle}" data-status="Idle" data-names="${onlineNames.Idle.join(',')}">Idle (${onlineCounts.Idle})</span>, ` +
               `<span class="status-span" style="color: ${STATUS_COLORS.Offline}" data-status="Offline" data-names="${onlineNames.Offline.join(',')}">Offline (${onlineCounts.Offline})</span>`;
    }

    // Status Summary Logic
    function getStatusSummary(members, factionName) {
        const statusCounts = { Okay: 0, Traveling: 0, Abroad: 0, "In Hospital": 0, "In Jail": 0, Federal: 0 };
        const statusNames = { Okay: [], Traveling: [], Abroad: [], "In Hospital": [], "In Jail": [], Federal: [] };
        for (const [id, member] of Object.entries(members || {})) {
            const state = (member.status?.state || "Okay").toLowerCase();
            if (state.includes("hospital")) {
                statusCounts["In Hospital"]++;
                statusNames["In Hospital"].push(member.name);
            } else if (state.includes("jail")) {
                statusCounts["In Jail"]++;
                statusNames["In Jail"].push(member.name);
            } else if (state === "okay") {
                statusCounts.Okay++;
                statusNames.Okay.push(member.name);
            } else if (state === "traveling") {
                statusCounts.Traveling++;
                statusNames.Traveling.push(member.name);
            } else if (state === "abroad") {
                statusCounts.Abroad++;
                statusNames.Abroad.push(member.name);
            } else if (state === "federal") {
                statusCounts.Federal++;
                statusNames.Federal.push(member.name);
            }
        }
        return `<div class="faction-title">${factionName}</div>` +
               `Status:<br>` +
               `<span class="status-span" style="color: ${STATUS_COLORS.Okay}" data-status="Okay" data-names="${statusNames.Okay.join(',')}">Okay (${statusCounts.Okay})</span><br>` +
               `<span class="status-span" style="color: ${STATUS_COLORS.Traveling}" data-status="Traveling" data-names="${statusNames.Traveling.join(',')}">Traveling (${statusCounts.Traveling})</span><br>` +
               `<span class="status-span" style="color: ${STATUS_COLORS.Abroad}" data-status="Abroad" data-names="${statusNames.Abroad.join(',')}">Abroad (${statusCounts.Abroad})</span><br>` +
               `<span class="status-span" style="color: ${STATUS_COLORS['In Hospital']}" data-status="In Hospital" data-names="${statusNames['In Hospital'].join(',')}">In Hospital (${statusCounts["In Hospital"]})</span><br>` +
               `<span class="status-span" style="color: ${STATUS_COLORS['In Jail']}" data-status="In Jail" data-names="${statusNames['In Jail'].join(',')}">In Jail (${statusCounts["In Jail"]})</span><br>` +
               `<span class="status-span" style="color: ${STATUS_COLORS.Federal}" data-status="Federal" data-names="${statusNames.Federal.join(',')}">Federal (${statusCounts.Federal})</span>`;
    }

    // Chain Info Logic
    function getChainInfo(chainData, factionName) {
        const current = chainData.current || 0;
        const max = chainData.max || 10;
        const timeoutSeconds = chainData.timeout || 0;
        const startTimeUnix = chainData.start || 0;
        const startTime = startTimeUnix ? new Date(startTimeUnix * 1000).toLocaleString() : 'N/A';

        const minutes = Math.floor(timeoutSeconds / 60);
        const seconds = timeoutSeconds % 60;
        const timeoutDisplay = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

        let timeoutColor, timeoutFontSize;
        if (timeoutSeconds >= 210) {
            timeoutColor = TIMEOUT_COLORS.good;
            timeoutFontSize = '14px';
        } else if (timeoutSeconds >= 120) {
            timeoutColor = TIMEOUT_COLORS.warning;
            timeoutFontSize = '28px';
        } else {
            timeoutColor = TIMEOUT_COLORS.urgent;
            timeoutFontSize = '56px';
        }

        const now = Math.floor(Date.now() / 1000);
        const elapsedSeconds = startTimeUnix && current > 0 ? now - startTimeUnix : 0;
        const elapsedHours = elapsedSeconds / 3600;
        const hitsPerHour = elapsedHours > 0 ? Math.round(current / elapsedHours) : 0;

        const milestones = [10, 25, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];
        const nextMilestone = milestones.find(m => m > current) || 'Max';

        let timeToNext = 'N/A';
        if (hitsPerHour > 0 && nextMilestone !== 'Max' && timeoutSeconds > 0) {
            const hitsNeeded = nextMilestone - current;
            const hoursToNext = hitsNeeded / hitsPerHour;
            const totalMinutes = Math.round(hoursToNext * 60);
            const days = Math.floor(totalMinutes / (24 * 60));
            const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
            const minutes = totalMinutes % 60;
            timeToNext = `${days} days, ${hours} hours, ${minutes} min`;
        }

        const html = `<div class="faction-title">${factionName} Chain Info</div>` +
                     `<div>Current Chain: <span style="color: ${STATUS_COLORS.Online}">${current}</span></div>` +
                     `<div>Milestone: <span style="color: ${STATUS_COLORS.Okay}">${nextMilestone}</span></div>` +
                     `<div>Timeout: <span style="color: ${timeoutColor}; font-size: ${timeoutFontSize}">${timeoutDisplay}</span></div>` +
                     `<div>Start Time: <span style="color: ${STATUS_COLORS.Traveling}">${startTime}</span></div>` +
                     `<div>Hits/Hour: <span style="color: ${STATUS_COLORS.Abroad}">${hitsPerHour}</span></div>` +
                     `<div>Next Milestone ETA: <span style="color: ${STATUS_COLORS['In Hospital']}">${timeToNext}</span></div>`;

        chainInfoBox.innerHTML = html;

        if (settings.emergencyHit1) {
            const btn1 = document.createElement('button');
            btn1.className = 'emergency-btn';
            btn1.textContent = 'Emergency Hit 1';
            btn1.addEventListener('click', () => window.location.href = settings.emergencyHit1);
            chainInfoBox.appendChild(btn1);
        }
        if (settings.emergencyHit2) {
            const btn2 = document.createElement('button');
            btn2.className = 'emergency-btn';
            btn2.textContent = 'Emergency Hit 2';
            btn2.addEventListener('click', () => window.location.href = settings.emergencyHit2);
            chainInfoBox.appendChild(btn2);
        }

        return html;
    }

    // Show/Update Popup
    function showPopup(status, names, faction) {
        const displayStatus = status === "In hospital" ? "In Hospital" : status === "In jail" ? "In Jail" : status;
        const color = STATUS_COLORS[displayStatus] || '#e0e0e0';
        const popup = faction === 'user' ? userPopups[displayStatus] : secondPopups[displayStatus];
        const closeBtnId = `${faction}-${status.toLowerCase().replace(' ', '-')}-close-btn`;
        const nameList = names && names.trim() ? names.split(',').map(name => `<div style="color: ${color}">${name.trim()}</div>`).join('') : 'No members';
        popup.innerHTML = `<span style="color: ${color}">${displayStatus}</span>:<br>${nameList}<button id="${closeBtnId}" style="margin-top: 10px; padding: 5px; background: #ff00ff; border: none; color: #e0e0e0; cursor: pointer;">Close</button>`;
        popup.style.display = 'block';
        document.getElementById(closeBtnId).onclick = () => popup.style.display = 'none';
    }

    // Refresh Open Popups
    function refreshOpenPopups(faction, data, popupSet) {
        Object.entries(popupSet).forEach(([status, popup]) => {
            if (popup.style.display === 'block') {
                const content = status === "Online" || status === "Idle" || status === "Offline" ?
                    getOnlineSummary(data.members, data.name || (faction === 'user' ? 'Your Faction' : 'Second Faction')) :
                    getStatusSummary(data.members, data.name || (faction === 'user' ? 'Your Faction' : 'Second Faction'));
                const span = content.match(new RegExp(`data-status="${status.replace('In hospital', 'In Hospital').replace('In jail', 'In Jail')}" data-names="([^"]*)"`, 'i'));
                if (span) showPopup(status, span[1], faction);
            }
        });
    }

    // Update visibility based on current page
    function updateVisibility() {
        const currentUrl = window.location.href;
        const hideOnPages = Array.isArray(settings.hideOnPages) ? settings.hideOnPages : [];
        const shouldHide = hideOnPages.length > 0 && hideOnPages.some(page => page && currentUrl.includes(page));

        console.log('Visibility Check:', { currentUrl, hideOnPages, shouldHide });

        userOnlineBox.style.display = shouldHide ? 'none' : 'block';
        userStatusBox.style.display = shouldHide ? 'none' : 'block';
        secondOnlineBox.style.display = shouldHide ? 'none' : (settings.trackSecondFaction ? 'block' : 'none');
        secondStatusBox.style.display = shouldHide ? 'none' : (settings.trackSecondFaction ? 'block' : 'none');
        chainInfoBox.style.display = shouldHide ? 'none' : (settings.showChainInfo ? 'block' : 'none');
        settingsBtn.style.display = shouldHide ? 'none' : 'block';

        if (!API_KEY && !shouldHide) apiInputBox.style.display = 'block';
        else apiInputBox.style.display = 'none';
    }

    // Fetch Faction Data
    let latestUserData = null;
    let latestSecondData = null;

    async function fetchFactionData() {
        updateVisibility();
        const hideOnPages = Array.isArray(settings.hideOnPages) ? settings.hideOnPages : [];
        if (hideOnPages.length > 0 && hideOnPages.some(page => page && window.location.href.includes(page))) {
            console.log('Skipping fetch due to page hide:', window.location.href);
            return;
        }

        try {
            let userFactionUrl = `https://api.torn.com/faction/${USER_FACTION_ID}?selections=basic&key=${API_KEY}`;
            const userResponse = await fetch(userFactionUrl);
            if (!userResponse.ok) throw new Error(`User Faction HTTP error ${userResponse.status}`);
            const userFactionData = await userResponse.json();
            if (userFactionData.error) throw new Error(`User Faction API Error: ${userFactionData.error.error}`);

            const userFactionName = userFactionData.name || 'Your Faction';
            latestUserData = userFactionData;

            userOnlineBox.innerHTML = getOnlineSummary(userFactionData.members, userFactionName);
            userStatusBox.innerHTML = getStatusSummary(userFactionData.members, userFactionName);

            if (settings.showChainInfo) {
                let chainUrl = `https://api.torn.com/faction/${USER_FACTION_ID}?selections=chain&key=${API_KEY}`;
                const chainResponse = await fetch(chainUrl);
                if (!chainResponse.ok) throw new Error(`Chain HTTP error ${chainResponse.status}`);
                const chainData = await chainResponse.json();
                if (chainData.error) throw new Error(`Chain API Error: ${chainData.error.error}`);
                getChainInfo(chainData.chain, userFactionName);
            }

            if (settings.trackSecondFaction && settings.secondFactionId) {
                let secondFactionUrl = `https://api.torn.com/faction/${settings.secondFactionId}?selections=basic&key=${API_KEY}`;
                const secondResponse = await fetch(secondFactionUrl);
                if (!secondResponse.ok) throw new Error(`Second Faction HTTP error ${secondResponse.status}`);
                const secondFactionData = await secondResponse.json();
                if (secondFactionData.error) throw new Error(`Second Faction API Error: ${secondFactionData.error.error}`);

                const secondFactionName = secondFactionData.name || 'Second Faction';
                latestSecondData = secondFactionData;

                secondOnlineBox.innerHTML = getOnlineSummary(secondFactionData.members, secondFactionName);
                secondStatusBox.innerHTML = getStatusSummary(secondFactionData.members, secondFactionName);
            }

            document.querySelectorAll('.status-span').forEach(span => {
                span.onclick = () => {
                    const status = span.getAttribute('data-status');
                    const names = span.getAttribute('data-names');
                    const faction = span.closest('[id^="user-"]') ? 'user' : 'second';
                    showPopup(status, names, faction);
                };
            });

            if (latestUserData) refreshOpenPopups('user', latestUserData, userPopups);
            if (settings.trackSecondFaction && latestSecondData) refreshOpenPopups('second', latestSecondData, secondPopups);
        } catch (error) {
            console.error('Faction Fetch Error:', error.message);
            userOnlineBox.innerHTML = '<div class="faction-title">Error</div>Online Status: <span style="color: red">Error</span>';
            userStatusBox.innerHTML = '<div class="faction-title">Error</div>Status: <span style="color: red">Error</span>';
            if (settings.trackSecondFaction) {
                secondOnlineBox.innerHTML = '<div class="faction-title">Error</div>Online Status: <span style="color: red">Error</span>';
                secondStatusBox.innerHTML = '<div class="faction-title">Error</div>Status: <span style="color: red">Error</span>';
            }
            if (settings.showChainInfo) chainInfoBox.innerHTML = '<div class="faction-title">Error</div><span style="color: red">Error</span>';
            showApiInput();
        }
    }

    // Show API Key Input
    function showApiInput() {
        apiInputBox.style.display = 'block';
        userOnlineBox.style.display = 'none';
        userStatusBox.style.display = 'none';
        secondOnlineBox.style.display = 'none';
        secondStatusBox.style.display = 'none';
        chainInfoBox.style.display = 'none';
        settingsBtn.style.display = 'none';
    }

    // Hide API Key Input
    function hideApiInput() {
        apiInputBox.style.display = 'none';
        updateVisibility();
    }

    // Save API Key and Test
    document.getElementById('api-save-btn').addEventListener('click', async () => {
        const newApiKey = document.getElementById('api-key-input').value.trim();
        if (!newApiKey) {
            alert('Please enter a valid API key.');
            return;
        }

        API_KEY = newApiKey;
        localStorage.setItem('tornApiKey', API_KEY);
        try {
            let testUrl = `https://api.torn.com/faction/${USER_FACTION_ID}?selections=basic&key=${API_KEY}`;
            const response = await fetch(testUrl);
            const data = await response.json();
            if (data.error) throw new Error(`API Error: ${data.error.error}`);
            hideApiInput();
            fetchFactionData();
            setInterval(fetchFactionData, UPDATE_INTERVAL);
        } catch (error) {
            console.error('API Key Test Failed:', error.message);
            alert('Invalid API key: ' + error.message);
        }
    });

    // Handle navigation within Torn
    let lastUrl = window.location.href;
    new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            updateVisibility();
            fetchFactionData();
        }
    }).observe(document, { subtree: true, childList: true });

    // Initial Load Logic
    if (!API_KEY) showApiInput();
    else {
        updateVisibility();
        fetchFactionData();
        setInterval(fetchFactionData, UPDATE_INTERVAL);
    }
})();