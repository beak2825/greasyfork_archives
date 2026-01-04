// ==UserScript==
// @name         Roblox Mass Unfriend with Recovery (Fixed v3.1)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Unfriend all Roblox friends with option to recover – Updated to use Roblox Friends API
// @license      MIT
// @author       TheBestChillieDog
// @match        https://www.roblox.com/users/*/friends*
// @match        https://www.roblox.com/my/account#!/friends
// @match        https://www.roblox.com/users/friends
// @match        https://www.roblox.com/home/friends*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      roblox.com
// @connect      friends.roblox.com
// @connect      users.roblox.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/538439/Roblox%20Mass%20Unfriend%20with%20Recovery%20%28Fixed%20v31%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538439/Roblox%20Mass%20Unfriend%20with%20Recovery%20%28Fixed%20v31%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //
    // ─── CONFIGURATION ────────────────────────────────────────────────────────────
    //

    const DELAY_BETWEEN_REQUESTS = 1500;       // 1.5s delay between each unfriend/friend request
    const BACKUP_KEY             = 'roblox_friends_backup_v3';
    const MAX_RETRIES            = 5;          // for API calls
    const LOAD_WAIT_TIME         = 1000;       // (not actually used any more for DOM scanning)

    GM_addStyle(`
        .unfriend-controls {
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            color: #fff;
            position: relative;
            z-index: 10000;
        }
        .unfriend-controls h3 {
            margin-top: 0;
            color: #fff;
            border-bottom: 1px solid #444;
            padding-bottom: 10px;
        }
        .unfriend-btn, .recover-btn, .scan-btn, .debug-btn {
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
        }
        .unfriend-btn {
            background-color: #e74c3c;
            padding: 12px 20px;
            margin-right: 12px;
            margin-bottom: 10px;
            font-size: 14px;
        }
        .unfriend-btn:hover:not(:disabled) {
            background-color: #c0392b;
            transform: translateY(-2px);
        }
        .unfriend-btn:disabled {
            background-color: #666;
            cursor: not-allowed;
            transform: none;
        }
        .recover-btn {
            background-color: #2ecc71;
            padding: 12px 20px;
            margin-bottom: 10px;
            font-size: 14px;
        }
        .recover-btn:hover:not(:disabled) {
            background-color: #27ae60;
            transform: translateY(-2px);
        }
        .recover-btn:disabled {
            background-color: #666;
            cursor: not-allowed;
            transform: none;
        }
        .scan-btn {
            background-color: #f39c12;
            padding: 10px 16px;
            font-size: 12px;
            margin-right: 10px;
        }
        .scan-btn:hover:not(:disabled) {
            background-color: #d35400;
            transform: translateY(-1px);
        }
        .scan-btn:disabled {
            background-color: #666;
            cursor: not-allowed;
            transform: none;
        }
        .debug-btn {
            background-color: #3498db;
            padding: 8px 16px;
            font-size: 12px;
            margin-left: 10px;
        }
        .debug-btn:hover:not(:disabled) {
            background-color: #2980b9;
            transform: translateY(-1px);
        }
        .debug-btn:disabled {
            background-color: #666;
            cursor: not-allowed;
            transform: none;
        }
        .progress-container {
            margin-top: 20px;
            display: none;
            background: #333;
            padding: 15px;
            border-radius: 4px;
        }
        .progress-bar {
            height: 20px;
            background: linear-gradient(90deg, #3498db, #2ecc71);
            border-radius: 4px;
            width: 0%;
            transition: width 0.5s;
            margin-bottom: 10px;
        }
        .status-text {
            margin-top: 5px;
            font-size: 14px;
            color: #bbb;
        }
        .friend-selection {
            max-height: 400px;
            overflow-y: auto;
            border: 1px solid #444;
            padding: 15px;
            margin-top: 20px;
            display: none;
            background: #333;
            border-radius: 4px;
        }
        .friend-selection h4 {
            margin-top: 0;
            color: #fff;
        }
        .friend-item {
            display: flex;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #444;
        }
        .friend-item:last-child {
            border-bottom: none;
        }
        .friend-checkbox {
            margin-right: 15px;
            transform: scale(1.2);
        }
        .friend-username {
            flex-grow: 1;
            color: #fff;
        }
        .select-all-container {
            margin-bottom: 15px;
        }
        .warning-message {
            color: #e74c3c;
            font-weight: bold;
            margin: 15px 0;
        }
        .debug-info {
            background: #1a1a1a;
            border: 1px solid #333;
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
            color: #ccc;
            max-height: 300px;
            overflow-y: auto;
            display: none;
            white-space: pre-wrap;
        }
    `);

    //
    // ─── GLOBAL UI SETUP ─────────────────────────────────────────────────────────────
    //

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'unfriend-controls';
    controlsDiv.innerHTML = `
        <h3>
            Roblox Mass Unfriend Tool 
            <button class="scan-btn" id="scanBtn">Scan Friends</button>
            <button class="debug-btn" id="debugBtn">Debug Info</button>
        </h3>
        <div class="warning-message">
            ⚠️ WARNING: This will permanently remove friends. A backup will be saved for recovery.
        </div>
        <button class="unfriend-btn" id="unfriendAllBtn">Unfriend All Friends</button>
        <button class="recover-btn" id="recoverFriendsBtn">Recover Friends</button>
        <div class="debug-info" id="debugInfo"></div>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar" id="progressBar"></div>
            <div class="status-text" id="statusText"></div>
        </div>
        <div class="friend-selection" id="friendSelection">
            <h4>Select Friends to Recover</h4>
            <div class="select-all-container">
                <input type="checkbox" id="selectAllFriends" checked>
                <label for="selectAllFriends">Select All Friends</label>
            </div>
            <div id="friendsList"></div>
            <button class="recover-btn" id="confirmRecoverBtn" style="margin-top: 15px;">Confirm Recovery</button>
        </div>
    `;

    // Try to insert control panel into a likely container
    function insertControlPanel() {
        const containers = [
            document.querySelector('main'),
            document.querySelector('.content'),
            document.querySelector('.container-main'),
            document.querySelector('#content'),
            document.querySelector('.page-content'),
            document.querySelector('body')
        ].filter(el => el !== null);

        if (containers.length > 0) {
            containers[0].insertBefore(controlsDiv, containers[0].firstChild);
            return true;
        }
        return false;
    }

    let insertAttempts = 0;
    const insertInterval = setInterval(() => {
        if (insertControlPanel() || insertAttempts++ > 15) {
            clearInterval(insertInterval);
        }
    }, 500);

    function getUIElements() {
        return {
            unfriendAllBtn: document.getElementById('unfriendAllBtn'),
            recoverFriendsBtn: document.getElementById('recoverFriendsBtn'),
            progressContainer: document.getElementById('progressContainer'),
            progressBar: document.getElementById('progressBar'),
            statusText: document.getElementById('statusText'),
            friendSelection: document.getElementById('friendSelection'),
            friendsList: document.getElementById('friendsList'),
            confirmRecoverBtn: document.getElementById('confirmRecoverBtn'),
            selectAllCheckbox: document.getElementById('selectAllFriends'),
            debugBtn: document.getElementById('debugBtn'),
            debugInfo: document.getElementById('debugInfo'),
            scanBtn: document.getElementById('scanBtn')
        };
    }

    //
    // ─── DEBUG INFO ───────────────────────────────────────────────────────────────────
    //

    function showDebugInfo() {
        const ui = getUIElements();
        const debugInfo = ui.debugInfo;
        if (!debugInfo) return;

        const isVisible = debugInfo.style.display !== 'block';
        debugInfo.style.display = isVisible ? 'block' : 'none';

        if (isVisible) {
            let debugText = 'DOM Analysis:\n\n';

            const friendSelectors = [
                'a[href*="/users/"]',
                '*[class*="friend"]',
                '*[data-testid*="friend"]',
                '.avatar',
                '*[class*="list"]'
            ];

            friendSelectors.forEach(selector => {
                try {
                    const elements = document.querySelectorAll(selector);
                    debugText += `${selector}: ${elements.length} elements\n`;
                    if (elements.length > 0 && elements.length < 5) {
                        Array.from(elements).forEach((el, i) => {
                            debugText += `  [${i+1}] ${el.tagName} class="${el.className}" href="${el.href || 'N/A'}"\n`;
                            debugText += `     text: "${el.textContent.trim().slice(0, 50)}"\n`;
                        });
                    }
                    debugText += '\n';
                } catch (e) {
                    debugText += `${selector}: ERROR: ${e.message}\n\n`;
                }
            });

            debugText += `\nPage Info:\n`;
            debugText += `URL: ${window.location.href}\n`;
            debugText += `Title: ${document.title}\n`;
            debugText += `Friends in backup: ${getBackupCount()}\n`;

            debugInfo.textContent = debugText;
        }
    }

    //
    // ─── BACKUP UTILITIES ─────────────────────────────────────────────────────────────────
    //

    function getBackupCount() {
        try {
            const backup = GM_getValue(BACKUP_KEY);
            return backup ? JSON.parse(backup).length : 0;
        } catch {
            return 0;
        }
    }

    //
    // ─── ROBLOX API UTILITIES ──────────────────────────────────────────────────────────────
    //

    // 1) Get the authenticated user’s ID by calling /users/authenticated
    async function getCurrentUserId() {
        let retries = 0;
        while (retries < MAX_RETRIES) {
            try {
                const resp = await fetch('https://users.roblox.com/v1/users/authenticated', {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Accept': 'application/json' }
                });
                if (!resp.ok) throw new Error(`Status ${resp.status}`);
                const data = await resp.json();
                if (data && data.id) return data.id.toString();
                throw new Error('No ID in response');
            } catch (e) {
                retries++;
                console.warn(`getCurrentUserId attempt ${retries} failed: ${e.message}`);
                await new Promise(res => setTimeout(res, 1000));
            }
        }
        throw new Error('Failed to get current user ID after retries');
    }

    // 2) Use Roblox Friends API to fetch ALL friends (paginated)
    async function getAllFriends() {
        showNotification('Fetching full friend list...');
        try {
            const userId = await getCurrentUserId();
            let allFriends = [];
            let cursor = '';
            do {
                const url = new URL(`https://friends.roblox.com/v1/users/${userId}/friends`);
                url.searchParams.set('limit', '100');
                if (cursor) url.searchParams.set('cursor', cursor);

                const resp = await fetch(url.toString(), {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Accept': 'application/json' }
                });
                if (!resp.ok) throw new Error(`Status ${resp.status}`);
                const data = await resp.json();
                if (Array.isArray(data.data)) {
                    data.data.forEach(f => {
                        // f is {id: <number>, name: <string>, ...}
                        allFriends.push({
                            userId: f.id.toString(),
                            username: f.name
                        });
                    });
                }
                cursor = data.nextPageCursor || '';
            } while (cursor);

            showNotification(`Detected ${allFriends.length} friends.`);
            return allFriends;
        } catch (err) {
            console.error('Error in getAllFriends():', err);
            showNotification('Failed to load friend list. Are you on a Roblox page while signed in?', true);
            return [];
        }
    }

    // 3) Get a fresh CSRF token by making a dummy POST request (Roblox standard)
    async function getCsrfToken() {
        try {
            const response = await fetch('https://friends.roblox.com/v1/users/1/request-friendship', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({})
            });
            const csrfToken = response.headers.get('x-csrf-token');
            if (!csrfToken) throw new Error('No X-CSRF-TOKEN in headers');
            return csrfToken;
        } catch (error) {
            console.error('Error getting CSRF token:', error);
            showNotification('Could not obtain CSRF token. Refresh the page and try again.', true);
            throw error;
        }
    }

    // 4) Unfriend a user via API
    async function unfriendUser(userId, username, csrfToken) {
        try {
            const resp = await fetch(`https://friends.roblox.com/v1/users/${userId}/unfriend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                credentials: 'include'
            });
            if (resp.ok) {
                console.log(`✓ Unfriended ${username} (ID: ${userId})`);
                return true;
            } else {
                const errText = await resp.text();
                console.error(`✗ Failed to unfriend ${username}: ${resp.status} – ${errText}`);
                return false;
            }
        } catch (e) {
            console.error(`✗ Error unfriending ${username}:`, e);
            return false;
        }
    }

    // 5) Send a friend request via API
    async function friendUser(userId, username, csrfToken) {
        try {
            const resp = await fetch(`https://friends.roblox.com/v1/users/${userId}/request-friendship`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify({ friendshipOriginSourceType: 1 })
            });
            if (resp.ok) {
                console.log(`✓ Friend request sent to ${username} (ID: ${userId})`);
                return true;
            } else {
                const errText = await resp.text();
                console.error(`✗ Failed to send friend request to ${username}: ${resp.status} – ${errText}`);
                return false;
            }
        } catch (e) {
            console.error(`✗ Error sending request to ${username}:`, e);
            return false;
        }
    }

    //
    // ─── NOTIFICATION ───────────────────────────────────────────────────────────────────
    //

    function showNotification(message, isError = false) {
        console.log(`${isError ? 'ERROR' : 'INFO'}: ${message}`);
        if (typeof GM_notification !== 'undefined') {
            GM_notification({
                text: message,
                title: 'Roblox Unfriend Tool',
                highlight: isError
            });
        } else {
            alert(message);
        }
    }

    //
    // ─── MASS UNFRIEND ───────────────────────────────────────────────────────────────────
    //

    async function unfriendAll() {
        const ui = getUIElements();
        if (!ui.unfriendAllBtn) return;

        const confirmMsg = 
            '⚠️ WARNING: This will unfriend ALL your friends!\n\n' +
            'A backup will be saved so you can recover them later.\n\n' +
            'Are you absolutely sure you want to continue?';
        if (!confirm(confirmMsg)) {
            return;
        }

        // 1) Fetch every friend via API:
        const friends = await getAllFriends();
        if (friends.length === 0) {
            return;
        }

        // 2) Save a backup (array of {username, userId})
        GM_setValue(BACKUP_KEY, JSON.stringify(friends));
        console.log(`Backup saved: ${friends.length} entries.`);

        try {
            ui.unfriendAllBtn.disabled    = true;
            ui.recoverFriendsBtn.disabled = true;
            ui.progressContainer.style.display = 'block';
            ui.statusText.textContent = 'Preparing to unfriend…';

            const csrfToken = await getCsrfToken();
            let successCount = 0;
            let failedCount  = 0;

            for (let i = 0; i < friends.length; i++) {
                const { userId, username } = friends[i];
                const pct = Math.round(((i + 1) / friends.length) * 100);
                ui.progressBar.style.width = `${pct}%`;
                ui.statusText.textContent = `Unfriending ${username} (${i+1}/${friends.length})…`;

                const ok = await unfriendUser(userId, username, csrfToken);
                if (ok) {
                    successCount++;
                } else {
                    failedCount++;
                }

                await new Promise(res => setTimeout(res, DELAY_BETWEEN_REQUESTS));
            }

            ui.progressBar.style.width = '100%';
            ui.statusText.textContent =
                `✅ Completed! Unfriended ${successCount}/${friends.length} friends. ` +
                `${failedCount} failed.`;
            showNotification(
                `Process completed! Unfriended ${successCount} out of ${friends.length} friends.`
            );

        } catch (err) {
            console.error('Error during mass unfriend:', err);
            ui.statusText.textContent = 'Error occurred. See console.';
            showNotification('Error during mass unfriend. Check console.', true);
        } finally {
            ui.unfriendAllBtn.disabled    = false;
            ui.recoverFriendsBtn.disabled = false;
        }
    }

    //
    // ─── RECOVER FRIENDS ─────────────────────────────────────────────────────────────────
    //

    async function showRecoverySelection() {
        const ui = getUIElements();
        if (!ui.friendSelection) return;

        const backupRaw = GM_getValue(BACKUP_KEY);
        if (!backupRaw) {
            showNotification('No backup found. Run “Unfriend All” first.', true);
            return;
        }

        let friends;
        try {
            friends = JSON.parse(backupRaw);
        } catch {
            showNotification('Could not parse backup data.', true);
            return;
        }
        if (!Array.isArray(friends) || friends.length === 0) {
            showNotification('Backup is empty.', true);
            return;
        }

        ui.friendsList.innerHTML = '';
        friends.forEach(f => {
            const item = document.createElement('div');
            item.className = 'friend-item';
            item.innerHTML = `
                <input type="checkbox" class="friend-checkbox" id="friend-${f.userId}" checked>
                <label class="friend-username" for="friend-${f.userId}">${f.username}</label>
            `;
            ui.friendsList.appendChild(item);
        });

        ui.selectAllCheckbox.checked = true;
        ui.friendSelection.style.display = 'block';
        showNotification(`Loaded ${friends.length} friends from backup.`);
    }

    async function recoverSelectedFriends() {
        const ui = getUIElements();
        if (!ui.friendsList) return;

        const checkedBoxes = ui.friendsList.querySelectorAll('.friend-checkbox:checked');
        if (checkedBoxes.length === 0) {
            showNotification('No friends selected for recovery.', true);
            return;
        }
        if (!confirm(`Send friend requests to ${checkedBoxes.length} selected friends?`)) {
            return;
        }

        let backup;
        try {
            backup = JSON.parse(GM_getValue(BACKUP_KEY));
        } catch {
            showNotification('Backup data is corrupted.', true);
            return;
        }

        const selectedIds = Array.from(checkedBoxes).map(cb => cb.id.replace('friend-', ''));
        const toRecover = backup.filter(f => selectedIds.includes(f.userId));

        try {
            ui.confirmRecoverBtn.disabled = true;
            ui.progressContainer.style.display = 'block';
            ui.statusText.textContent = 'Preparing recovery…';

            const csrfToken = await getCsrfToken();
            let successCount = 0;
            let failedCount  = 0;

            for (let i = 0; i < toRecover.length; i++) {
                const { userId, username } = toRecover[i];
                const pct = Math.round(((i + 1) / toRecover.length) * 100);
                ui.progressBar.style.width = `${pct}%`;
                ui.statusText.textContent = `Sending request to ${username} (${i+1}/${toRecover.length})…`;

                const ok = await friendUser(userId, username, csrfToken);
                if (ok) {
                    successCount++;
                } else {
                    failedCount++;
                }
                await new Promise(res => setTimeout(res, DELAY_BETWEEN_REQUESTS));
            }

            ui.progressBar.style.width = '100%';
            ui.statusText.textContent =
                `✅ Recovery done: sent ${successCount}/${toRecover.length} requests. ` +
                `${failedCount} failed.`;
            showNotification(
                `Recovery finished! Sent ${successCount} out of ${toRecover.length} requests.`
            );

            ui.friendSelection.style.display = 'none';
        } catch (err) {
            console.error('Error during friend recovery:', err);
            ui.statusText.textContent = 'Error during recovery. See console.';
            showNotification('Error during friend recovery. Check console.', true);
        } finally {
            ui.confirmRecoverBtn.disabled = false;
        }
    }

    //
    // ─── OPTIONAL “SCAN FRIENDS” ─────────────────────────────────────────────────────────
    //

    // This now simply calls getAllFriends() to check count and notify.
    async function scanFriends() {
        const ui = getUIElements();
        if (ui.scanBtn) ui.scanBtn.disabled = true;
        showNotification('Scanning for friends via API…');
        const friends = await getAllFriends();
        if (ui.scanBtn) ui.scanBtn.disabled = false;
        if (friends.length > 0) {
            showNotification(`Scan complete: found ${friends.length} friends.`);
        }
    }

    //
    // ─── EVENT BINDING ON LOAD ───────────────────────────────────────────────────────────
    //

    setTimeout(() => {
        const ui = getUIElements();

        if (ui.unfriendAllBtn) {
            ui.unfriendAllBtn.addEventListener('click', unfriendAll);
        }
        if (ui.recoverFriendsBtn) {
            ui.recoverFriendsBtn.addEventListener('click', showRecoverySelection);
        }
        if (ui.confirmRecoverBtn) {
            ui.confirmRecoverBtn.addEventListener('click', recoverSelectedFriends);
        }
        if (ui.debugBtn) {
            ui.debugBtn.addEventListener('click', showDebugInfo);
        }
        if (ui.scanBtn) {
            ui.scanBtn.addEventListener('click', scanFriends);
        }

        if (ui.selectAllCheckbox) {
            ui.selectAllCheckbox.addEventListener('change', function() {
                const allBoxes = ui.friendsList.querySelectorAll('.friend-checkbox');
                allBoxes.forEach(cb => cb.checked = this.checked);
            });
        }

        console.log('✅ Roblox Mass Unfriend Tool v3.1 loaded.');
        showNotification('Roblox Mass Unfriend Tool loaded! Click “Scan Friends” to test.');
    }, 1500);

})();