// ==UserScript==
// @name         Roblox FriendList Follow Scraper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  looks for people with 1k+ followers who sent you a friend request
// @author       p_dh
// @match        https://www.roblox.com/users/friends
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      roblox.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526729/Roblox%20FriendList%20Follow%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/526729/Roblox%20FriendList%20Follow%20Scraper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FOLLOWERS_API = 'https://friends.roblox.com/v1/users/%userId%/followers/count';
    const USERNAME_API = 'https://users.roblox.com/v1/users/%userId%';
    const PROCESSING_DELAY = 5;
    const BATCH_SIZE = 5;
    let isProcessing = false;
    let currentPage = 1;
    const validUsers = [];
    let startTime = null;

    async function fetchUsername(userId) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: USERNAME_API.replace('%userId%', userId),
                headers: { 'Accept': 'application/json' },
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data.name || `User${userId}`);
                    } catch {
                        resolve(`User${userId}`);
                    }
                },
                onerror: () => resolve(`User${userId}`)
            });
        });
    }

    async function fetchFollowerCount(userId) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: FOLLOWERS_API.replace('%userId%', userId),
                headers: { 'Accept': 'application/json' },
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data.count || 0);
                    } catch {
                        resolve(0);
                    }
                },
                onerror: () => resolve(0)
            });
        });
    }

    function createStatusOverlay() {
        const overlay = document.createElement('div');
        overlay.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1a1a1a;
            color: #fff;
            padding: 15px;
            border-radius: 8px;
            z-index: 99999;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            font-family: Arial, sans-serif;
            display: none;
        `;
        overlay.innerHTML = `
            <h3 style="margin:0 0 10px 0; font-size:16px;">🔍 Checking Followers...</h3>
            <div class="progress-container" style="background:#333; height:4px; border-radius:2px;">
                <div class="progress-bar" style="height:100%; background:#00a8fc; width:0; transition:width 0.3s"></div>
            </div>
            <div class="current-user" style="margin-top:10px; font-size:14px;">Checking: <span id="currentUser">-</span></div>
            <div class="results" style="margin-top:10px;"></div>
            <div class="timer" style="margin-top:10px; font-size:12px; color:#888;">Time Elapsed: 0s</div>
            <button id="exportButton" style="margin-top:10px; padding:5px 10px; background:#00a8fc; color:#fff; border:none; border-radius:4px; cursor:pointer; display:none;">Export Results as TXT</button>
            <div style="margin-top:10px; font-size:12px; color:#888; text-align:center;">made for my cutie pie reme by p_dh 🤤❤</div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    function exportResults() {
        const sortedUsers = validUsers.sort((a, b) => b.followers - a.followers); // Sort high to low
        const content = sortedUsers.map(user => `${user.username} (${user.followers})`).join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        GM_download({
            url: url,
            name: 'valid_users.txt',
            saveAs: true,
            onload: () => URL.revokeObjectURL(url)
        });
    }

    function formatTimeElapsed(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}m ${secs}s`;
    }

    async function processRequests() {
        if (isProcessing) return;
        isProcessing = true;

        const overlay = createStatusOverlay();
        overlay.style.display = 'block';
        const progressBar = overlay.querySelector('.progress-bar');
        const resultsContainer = overlay.querySelector('.results');
        const timerContainer = overlay.querySelector('.timer');
        const exportButton = overlay.querySelector('#exportButton');
        const currentUserElement = overlay.querySelector('#currentUser');

        startTime = Date.now();
        const timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            timerContainer.textContent = `Time Elapsed: ${formatTimeElapsed(elapsed)}`;
        }, 1000);

        try {
            while (true) {
                const requests = Array.from(document.querySelectorAll('.list-item.avatar-card:not(.disabled)'));
                const total = requests.length;
                let processed = 0;

                for (let i = 0; i < total; i += BATCH_SIZE) {
                    const batch = requests.slice(i, i + BATCH_SIZE);
                    const batchPromises = batch.map(async (request) => {
                        const profileLink = request.querySelector('.avatar-card-link')?.href;

                        if (!profileLink || profileLink.includes('/banned-users/')) {
                            processed++;
                            return;
                        }

                        const userIdMatch = profileLink.match(/\/users\/(\d+)\//);
                        if (!userIdMatch) {
                            processed++;
                            return;
                        }

                        const userId = userIdMatch[1];

                        currentUserElement.textContent = `User${userId}`; // Display current user being checked

                        const [username, followers] = await Promise.all([
                            fetchUsername(userId),
                            fetchFollowerCount(userId)
                        ]);

                        currentUserElement.textContent = username; // Update to show the actual username

                        if (followers > 1000) {
                            validUsers.push({ username, followers });
                            resultsContainer.innerHTML += `<li>${username} (${followers})</li>`; // Append to the list in real-time
                        }

                        processed++;
                        progressBar.style.width = `${(processed / total) * 100}%`;
                    });

                    await Promise.all(batchPromises);
                    await new Promise(r => setTimeout(r, PROCESSING_DELAY));
                }

                const nextButton = document.querySelector('.btn-generic-right-sm:not(:disabled)');
                if (!nextButton) break;

                nextButton.click();
                currentPage++;
                await waitForPageLoad();
            }

            progressBar.style.backgroundColor = '#00c851';
            exportButton.style.display = 'block';
            exportButton.addEventListener('click', exportResults);

        } catch (error) {
            resultsContainer.innerHTML = `<span style="color:#ff4444">Error: ${error.message}</span>`;
        } finally {
            clearInterval(timerInterval);
            isProcessing = false;
        }
    }

    function waitForPageLoad() {
        return new Promise((resolve) => {
            const observer = new MutationObserver((mutations, obs) => {
                const requests = document.querySelectorAll('.list-item.avatar-card');
                if (requests.length > 0) {
                    obs.disconnect();
                    resolve();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F' && e.ctrlKey && e.shiftKey) {
            processRequests();
        }
    });
})();