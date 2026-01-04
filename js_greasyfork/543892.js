// ==UserScript==
// @name         MZ - GB Message Sender
// @namespace    douglaskampl
// @version      1.0
// @description  Sends a guestbook message to multiple users
// @author       Douglas
// @match        https://www.managerzone.com/?p=guestbook
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543892/MZ%20-%20GB%20Message%20Sender.user.js
// @updateURL https://update.greasyfork.org/scripts/543892/MZ%20-%20GB%20Message%20Sender.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SCRIPT_ID = 'GB_Message_Sender';

    const Logger = {
        log: (message) => console.log(`[${SCRIPT_ID}] ${message}`),
        info: (message) => console.info(`[${SCRIPT_ID}] INFO: ${message}`),
        warn: (message) => console.warn(`[${SCRIPT_ID}] WARNING: ${message}`),
        error: (message, errorObject) => console.error(`[${SCRIPT_ID}] ERROR: ${message}`, errorObject || ''),
        groupStart: (label) => console.groupCollapsed(`[${SCRIPT_ID}] ${label}`),
        groupEnd: () => console.groupEnd(),
    };

    const BRAZIL_LEAGUE_IDS_RANGE = { start: 26187, end: 26307 };
    const BRAZIL_CUP_IDS_1 = [32066, 32070, 32075, 32076, 32078, 32080];
    const BRAZIL_CUP_ID_2 = 31762;
    const CUP_DIVISIONS = [4, 5];

    GM_addStyle(`
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@700,900&display=swap');

        :root {
            --gbs-font-main: 'Satoshi', sans-serif;
            --gbs-bg: #111111;
            --gbs-bg-light: #1A1A1A;
            --gbs-accent: #0047FF;
            --gbs-accent-hover: #003AD4;
            --gbs-text-primary: #EAEAEA;
            --gbs-text-secondary: #AAAAAA;
            --gbs-border: #2A2A2A;
            --gbs-success: #00C49A;
            --gbs-error: #FF3B30;
            --gbs-info: #FFA500;
        }

        .bbcode {
            display: flex;
            align-items: flex-start;
            gap: 15px;
        }
        .markItUpContainer {
            flex-grow: 1;
        }
        #gbs-launcher {
            flex-shrink: 0;
            padding: 2px 15px;
            background: var(--gbs-bg-light);
            color: var(--gbs-text-primary);
            border: 1px solid var(--gbs-border);
            border-top: 3px solid var(--gbs-accent);
            border-radius: 6px;
            font-family: var(--gbs-font-main);
            font-weight: 700;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        #gbs-launcher:hover {
            transform: translateY(-2px);
            background: var(--gbs-accent);
            border-color: var(--gbs-accent);
            box-shadow: 0 6px 20px rgba(0, 71, 255, 0.3);
        }
        #gbs-modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0; top: 0;
            width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            font-family: var(--gbs-font-main);
            opacity: 0;
            transition: opacity 0.4s ease;
        }
        #gbs-modal.show {
            opacity: 1;
        }
        .gbs-modal-content {
            position: relative;
            background: var(--gbs-bg);
            color: var(--gbs-text-primary);
            margin: 10% auto;
            padding: 25px 30px;
            border: 1px solid var(--gbs-border);
            width: 90%;
            max-width: 650px;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            opacity: 0;
            transform: scale(0.98);
            transition: all 0.4s ease;
            overflow: hidden;
        }
        #gbs-modal.show .gbs-modal-content {
            opacity: 1;
            transform: scale(1);
        }
        .gbs-progress-bar {
            position: absolute;
            top: 0; left: 0;
            height: 2px;
            width: 0%;
            background: var(--gbs-accent);
            transition: width 0.5s ease;
            box-shadow: 0 0 10px var(--gbs-accent);
        }
        .gbs-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--gbs-border);
        }
        .gbs-modal-title {
            font-weight: 900;
            font-size: 24px;
            margin: 0;
        }
        .gbs-close-btn {
            color: var(--gbs-text-secondary);
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            transition: color 0.2s ease, transform 0.2s ease;
        }
        .gbs-close-btn:hover {
            color: var(--gbs-accent);
            transform: rotate(90deg);
        }
        .gbs-form-group { margin-bottom: 20px; }
        .gbs-form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 700;
            color: var(--gbs-text-secondary);
        }
        .gbs-form-group input, .gbs-form-group textarea {
            width: 100%;
            padding: 12px;
            background-color: var(--gbs-bg-light);
            color: var(--gbs-text-primary);
            border: 1px solid var(--gbs-border);
            border-radius: 6px;
            box-sizing: border-box;
            transition: all 0.3s ease;
            font-family: var(--gbs-font-main);
        }
        .gbs-form-group input:focus, .gbs-form-group textarea:focus {
            outline: none;
            border-color: var(--gbs-accent);
            box-shadow: 0 0 8px rgba(0, 71, 255, 0.5);
        }
        .gbs-form-group textarea { height: 120px; resize: vertical; }
        .gbs-toggle-container {
            display: flex;
            margin-bottom: 20px;
            background-color: var(--gbs-bg-light);
            border-radius: 8px;
            padding: 5px;
            width: 100%;
        }
        .gbs-toggle-option {
            flex: 1;
            padding: 10px;
            text-align: center;
            cursor: pointer;
            border-radius: 6px;
            transition: all 0.3s ease;
            color: var(--gbs-text-secondary);
            font-weight: 700;
            position: relative;
        }
        .gbs-toggle-option.active {
            background-color: var(--gbs-accent);
            color: var(--gbs-text-primary);
            box-shadow: 0 2px 10px rgba(0, 71, 255, 0.3);
        }
        .gbs-input-container { display: none; }
        .gbs-input-container.active { display: block; animation: gbs-fadeIn 0.5s ease; }
        .gbs-send-button {
            width: 100%;
            font-family: var(--gbs-font-main);
            background: var(--gbs-accent);
            color: var(--gbs-text-primary);
            padding: 14px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 700;
            font-size: 16px;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
        }
        .gbs-send-button:hover:not(:disabled) {
            background: var(--gbs-accent-hover);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 71, 255, 0.3);
        }
        .gbs-send-button:disabled {
            background: #222;
            color: #666;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        .gbs-status-area {
            margin-top: 20px;
            padding: 5px;
            border: 1px solid var(--gbs-border);
            border-radius: 6px;
            max-height: 180px;
            overflow-y: auto;
            display: none;
            background-color: #0A0A0A;
        }
        .gbs-status-area.show { display: block; }
        .gbs-status-message {
            margin: 8px;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            animation: gbs-slideIn 0.4s ease forwards;
        }
        .gbs-status-success { color: #EAEAEA; background-color: rgba(0, 196, 154, 0.15); border-left: 3px solid var(--gbs-success); }
        .gbs-status-error { color: #EAEAEA; background-color: rgba(255, 59, 48, 0.15); border-left: 3px solid var(--gbs-error); }
        .gbs-status-info { color: #EAEAEA; background-color: rgba(255, 165, 0, 0.15); border-left: 3px solid var(--gbs-info); }
        .gbs-footer {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid var(--gbs-border);
            text-align: right;
            color: #666;
            font-size: 12px;
        }
        #gbs-notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10001;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .gbs-notification {
            padding: 15px 20px;
            background: var(--gbs-bg-light);
            color: var(--gbs-text-primary);
            border-left: 4px solid var(--gbs-error);
            border-radius: 6px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.4);
            animation: gbs-slideInRight 0.4s ease, gbs-fadeOut 0.4s ease 4.6s forwards;
            opacity: 0;
        }
        @keyframes gbs-slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gbs-fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes gbs-slideInRight { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        @keyframes gbs-fadeOut { to { opacity: 0; transform: scale(0.9); } }
    `);

    function getStarted() {
        Logger.log('Script loaded. Initializing.');
        // The new target container is 'disclaimerContent'.
        const targetContainer = document.getElementById('disclaimerContent');

        if (!targetContainer) {
            // Updated error message to reflect the new target.
            Logger.error('Could not find the target #disclaimerContent container. Script will not run.');
            return;
        }

        // Create the launcher button.
        const launcher = document.createElement('div');
        launcher.id = 'gbs-launcher';
        launcher.textContent = 'GB Message Sender';

        // Create a wrapper to control positioning, making it float right like the existing button.
        const launcherWrapper = document.createElement('div');
        launcherWrapper.style.float = 'right';
        launcherWrapper.style.marginLeft = '10px'; // Adds a small space between the buttons.
        launcherWrapper.appendChild(launcher);

        // Prepend the new launcher wrapper to the target container.
        // This places it before the existing floated-right elements.
        targetContainer.prepend(launcherWrapper);
        Logger.log('Sender launcher injected into disclaimerContent.');

        const modalHTML = `
        <div id="gbs-modal">
            <div class="gbs-modal-content">
                <div class="gbs-progress-bar" id="gbsProgressBar"></div>
                <div class="gbs-modal-header">
                    <h2 class="gbs-modal-title">Guestbook Message Sender</h2>
                    <span class="gbs-close-btn">×</span>
                </div>
                <div class="gbs-form-group">
                    <label for="gbsMessageText">Message</label>
                    <textarea id="gbsMessageText" placeholder="Your message goes here..."></textarea>
                </div>
                <div class="gbs-toggle-container">
                    <div class="gbs-toggle-option active" data-target="gbs-users-input">Users</div>
                    <div class="gbs-toggle-option" data-target="gbs-federation-input">Federation</div>
                    <div class="gbs-toggle-option" data-target="gbs-brazil-input">BR Users</div>
                </div>
                <div class="gbs-input-container active" id="gbs-users-input">
                    <div class="gbs-form-group">
                        <label for="gbsUsersInput">Usernames (comma separated)</label>
                        <input type="text" id="gbsUsersInput" placeholder="user1, user2, user3">
                    </div>
                </div>
                <div class="gbs-input-container" id="gbs-federation-input">
                    <div class="gbs-form-group">
                        <label for="gbsFederationId">Federation ID</label>
                        <input type="text" id="gbsFederationId" placeholder="Enter federation ID (e.g. 63)">
                    </div>
                </div>
                <div class="gbs-input-container" id="gbs-brazil-input">
                   <p style="color: var(--gbs-text-secondary); font-size: 14px; text-align: center; margin: 20px 0;">This option will send a message to active Brazilian users.</p>
                </div>
                <button id="gbsSendButton" class="gbs-send-button">Send Messages</button>
                <div id="gbsStatusArea" class="gbs-status-area">
                    <div id="gbsStatusMessages"></div>
                </div>
                <div class="gbs-footer">
                    <span>requested by gordola</span>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const notificationContainer = document.createElement('div');
        notificationContainer.id = 'gbs-notification-container';
        document.body.appendChild(notificationContainer);

        const modal = document.getElementById('gbs-modal');
        const closeBtn = document.querySelector('.gbs-close-btn');
        const toggleOptions = document.querySelectorAll('.gbs-toggle-option');
        const sendButton = document.getElementById('gbsSendButton');

        launcher.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
            setTimeout(() => modal.classList.add('show'), 10);
        });

        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => { modal.style.display = 'none'; }, 400);
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });

        toggleOptions.forEach(option => {
            option.addEventListener('click', function() {
                toggleOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                const targetId = this.getAttribute('data-target');
                document.querySelectorAll('.gbs-input-container').forEach(container => container.classList.remove('active'));
                document.getElementById(targetId).classList.add('active');
            });
        });

        sendButton.addEventListener('click', handleSendProcess);
    }

    function showNotification(message) {
        const container = document.getElementById('gbs-notification-container');
        const notification = document.createElement('div');
        notification.className = 'gbs-notification';
        notification.textContent = message;
        container.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    async function handleSendProcess() {
        Logger.groupStart('Message sending process initiated.');
        const message = document.getElementById('gbsMessageText').value.trim();
        if (!message) {
            showNotification('Please enter a message.');
            Logger.warn('Send attempt failed: message text was empty.');
            Logger.groupEnd();
            return;
        }

        const sendButton = document.getElementById('gbsSendButton');
        const statusArea = document.getElementById('gbsStatusArea');
        const statusMessages = document.getElementById('gbsStatusMessages');
        const progressBar = document.getElementById('gbsProgressBar');
        statusArea.classList.add('show');
        statusMessages.innerHTML = '';
        updateProgressBar(progressBar, 0);

        const activeMode = document.querySelector('.gbs-toggle-option.active').getAttribute('data-target');
        Logger.info(`Operating in mode: ${activeMode}`);

        sendButton.disabled = true;
        try {
            switch (activeMode) {
                case 'gbs-users-input':
                    await handleManualUsers(message, progressBar);
                    break;
                case 'gbs-federation-input':
                    await handleFederationUsers(message, progressBar);
                    break;
                case 'gbs-brazil-input':
                    await handleBrazilianUsers(message, progressBar);
                    break;
            }
        } catch (error) {
            addStatus(`A critical error occurred: ${error.message}`, 'gbs-status-error');
            Logger.error('A critical, unhandled error occurred in the main process.', error);
        } finally {
            sendButton.disabled = false;
            Logger.log('Message sending process finished.');
            Logger.groupEnd();
        }
    }

    async function handleManualUsers(message, progressBar) {
        Logger.groupStart('Handling manual user input.');
        const usersText = document.getElementById('gbsUsersInput').value.trim();
        if (!usersText) {
            showNotification('Please enter at least one username.');
            Logger.groupEnd();
            return;
        }
        const usernames = usersText.split(',').map(u => u.trim()).filter(Boolean);
        if (usernames.length === 0) {
            showNotification('Please enter valid usernames.');
            Logger.groupEnd();
            return;
        }
        addStatus(`Found ${usernames.length} users. Resolving IDs...`, 'gbs-status-info');
        const users = await getUserObjectsFromUsernames(usernames, progressBar);
        await sendMessagesToUsers(users, message, progressBar);
        Logger.groupEnd();
    }

    async function handleFederationUsers(message, progressBar) {
        Logger.groupStart('Handling federation users.');
        const federationId = document.getElementById('gbsFederationId').value.trim();
        if (!federationId || !/^\d+$/.test(federationId)) {
            showNotification('Please enter a valid, numeric federation ID.');
            Logger.groupEnd();
            return;
        }
        addStatus(`Fetching members for federation ID: ${federationId}...`, 'gbs-status-info');
        const usernames = await getFederationMembers(federationId);
        if (usernames.length === 0) {
            addStatus('No users found in federation.', 'gbs-status-error');
            Logger.groupEnd();
            return;
        }
        addStatus(`Found ${usernames.length} members. Resolving IDs...`, 'gbs-status-info');
        const users = await getUserObjectsFromUsernames(usernames, progressBar);
        await sendMessagesToUsers(users, message, progressBar);
        Logger.groupEnd();
    }

    async function handleBrazilianUsers(message, progressBar) {
        Logger.groupStart('Handling active Brazilian users.');
        addStatus('Phase 1: Collecting Team IDs...', 'gbs-status-info');
        const teamIds = new Set();
        const leagueFetches = [];
        for (let lid = BRAZIL_LEAGUE_IDS_RANGE.start; lid <= BRAZIL_LEAGUE_IDS_RANGE.end; lid++) {
            leagueFetches.push(fetchTeamIdsFromLeague(lid));
        }
        const cupFetches = [];
        for (const cid of BRAZIL_CUP_IDS_1) {
            for (const div of CUP_DIVISIONS) { cupFetches.push(fetchTeamIdsFromCup(cid, div, 0)); }
        }
        for (const offset of [0, 20, 40]) { cupFetches.push(fetchTeamIdsFromCup(BRAZIL_CUP_ID_2, 4, offset)); }
        for (const offset of [0, 20]) { cupFetches.push(fetchTeamIdsFromCup(BRAZIL_CUP_ID_2, 5, offset)); }
        const allFetches = [...leagueFetches, ...cupFetches];
        let completedFetches = 0;
        const fetchPromises = allFetches.map(p => p.then(newTeamIds => {
            newTeamIds.forEach(id => teamIds.add(id));
            completedFetches++;
            updateProgressBar(progressBar, (completedFetches / allFetches.length) * 50);
        }));
        await Promise.all(fetchPromises);
        addStatus(`Collected ${teamIds.size} unique team IDs.`, 'gbs-status-success');

        addStatus('Phase 2: Converting Team IDs to User IDs...', 'gbs-status-info');
        const userIds = new Set();
        const teamIdArray = Array.from(teamIds);
        let processedTeams = 0;
        for (const teamId of teamIdArray) {
            const userId = await getUserIdByTeamId(teamId);
            if (userId) { userIds.add(userId); }
            processedTeams++;
            updateProgressBar(progressBar, 50 + (processedTeams / teamIdArray.length) * 25);
        }
        addStatus(`Found ${userIds.size} unique active users.`, 'gbs-status-success');

        addStatus('Phase 3: Sending messages...', 'gbs-status-info');
        const users = Array.from(userIds).map(id => ({ id: id, name: `User ID ${id}` }));
        await sendMessagesToUsers(users, message, progressBar, 75);
        Logger.groupEnd();
    }

    async function getUserObjectsFromUsernames(usernames, progressBar) {
        Logger.groupStart('Resolving usernames to user objects.');
        const users = [];
        let processedCount = 0;
        const promises = usernames.map(username => getUserIdByUsername(username).then(userId => {
            if (userId) {
                users.push({ id: userId, name: username });
                addStatus(`Resolved: ${username} -> ${userId}`, 'gbs-status-info');
            } else {
                addStatus(`Could not find User ID for ${username}`, 'gbs-status-error');
            }
            processedCount++;
            updateProgressBar(progressBar, (processedCount / usernames.length) * 50);
        }));
        await Promise.all(promises);
        Logger.info(`Resolved ${users.length} users from ${usernames.length} usernames.`);
        Logger.groupEnd();
        return users;
    }

    async function sendMessagesToUsers(users, message, progressBar, baseProgress = 50) {
        Logger.groupStart(`Sending messages to ${users.length} users.`);
        let processedMessages = 0;
        const totalMessages = users.length;
        if (totalMessages === 0) {
            addStatus('No valid users to send messages to.', 'gbs-status-error');
            updateProgressBar(progressBar, 100);
            Logger.groupEnd();
            return;
        }

        const progressMultiplier = (100 - baseProgress);

        addStatus(`Starting to send ${totalMessages} messages...`, 'gbs-status-info');
        for (const user of users) {
            try {
                await sendMessage(user.id, message);
                addStatus(`Message sent to ${user.name}`, 'gbs-status-success');
                Logger.info(`Successfully sent message to ${user.name}`);
            } catch (error) {
                addStatus(`Error sending to ${user.name}: ${error.message}`, 'gbs-status-error');
                Logger.error(`Failed to send message to ${user.name} (ID: ${user.id})`, error);
            }
            processedMessages++;
            const progress = baseProgress + (processedMessages / totalMessages) * progressMultiplier;
            updateProgressBar(progressBar, progress);
            if (processedMessages < totalMessages) {
                await new Promise(resolve => setTimeout(resolve, 6000));
            }
        }
        addStatus('All messages have been processed!', 'gbs-status-success');
        updateProgressBar(progressBar, 100);
        Logger.groupEnd();
    }

    async function fetchTeamIdsFromLeague(leagueId) {
        try {
            const response = await fetch(`https://www.managerzone.com/xml/team_league.php?sport_id=1&league_id=${leagueId}`);
            const xmlText = await response.text();
            return Array.from(xmlText.matchAll(/<Team[^>]*teamId="(\d+)"[^>]*>/g)).map(match => match[1]);
        } catch (error) {
            Logger.error(`Failed to fetch team IDs from league ${leagueId}.`, error);
            return [];
        }
    }

    async function fetchTeamIdsFromCup(cupId, division, offset) {
        try {
            const response = await fetch(`https://www.managerzone.com/?p=cups&sub=find_participants&cid=${cupId}&div=${division}&offset=${offset}`, { method: 'POST' });
            const htmlText = await response.text();
            return Array.from(htmlText.matchAll(/tid=(\d+)/g)).map(match => match[1]);
        } catch (error) {
            Logger.error(`Failed to fetch team IDs from cup ${cupId}.`, error);
            return [];
        }
    }

    function extractUsernames(html) {
        const container = document.createElement('div');
        container.innerHTML = html;
        const userLinks = container.querySelectorAll('a[href*="p=profile&uid="]');
        return Array.from(userLinks).map(link => link.textContent.trim());
    }

    async function getFederationMembers(federationId) {
        const allUsernames = new Set();
        let offset = 0;
        let hasMorePages = true;
        while (hasMorePages) {
            try {
                const url = `https://www.managerzone.com/ajax.php?p=federations&sub=federation_members&fid=${federationId}&offset=${offset}&sport=soccer`;
                const response = await fetch(url);
                const data = await response.json();
                if (!data || !data[0] || !data[0].length) {
                    hasMorePages = false;
                    continue;
                }
                const newUsers = extractUsernames(data[0]);
                if (newUsers.length === 0) {
                    hasMorePages = false;
                    continue;
                }
                newUsers.forEach(user => allUsernames.add(user));
                hasMorePages = data[1] && data[1].includes(`offset=${offset + 10}`);
                offset += 10;
                if (hasMorePages) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (error) {
                Logger.error(`Failed while fetching members at offset ${offset}.`, error);
                hasMorePages = false;
            }
        }
        return Array.from(allUsernames);
    }

    function addStatus(message, className) {
        const statusMessages = document.getElementById('gbsStatusMessages');
        const messageElement = document.createElement('div');
        messageElement.className = `gbs-status-message ${className}`;
        messageElement.textContent = message;
        statusMessages.appendChild(messageElement);
        statusMessages.scrollTop = statusMessages.scrollHeight;
    }

    function updateProgressBar(progressBar, percentage) {
        progressBar.style.width = `${Math.min(100, percentage)}%`;
    }

    async function getUserIdByUsername(username) {
        try {
            const response = await fetch(`https://www.managerzone.com/xml/manager_data.php?sport_id=1&username=${encodeURIComponent(username)}`);
            const text = await response.text();
            const match = text.match(/<UserData[^>]*userId="(\d+)"/);
            return match ? match[1] : null;
        } catch (error) {
            Logger.error(`Network error for username: ${username}`, error);
            return null;
        }
    }

    async function getUserIdByTeamId(teamId) {
        try {
            const response = await fetch(`https://www.managerzone.com/xml/manager_data.php?sport_id=1&team_id=${teamId}`);
            const text = await response.text();
            const match = text.match(/<UserData[^>]*userId="(\d+)"/);
            return match ? match[1] : null;
        } catch (error) {
            Logger.error(`Network error for team ID: ${teamId}`, error);
            return null;
        }
    }

    async function sendMessage(userId, message) {
        const response = await fetch(`https://www.managerzone.com/ajax.php?p=messageBoard&sub=write&template=1&ident_id=${userId}&sport=soccer`, {
            method: 'POST',
            body: new URLSearchParams({ 'msg': message }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        return true;
    }

    window.addEventListener('load', getStarted);
})();