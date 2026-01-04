// ==UserScript==
// @name         Roblox FriendList Follow Scraper (PH Theme With Remes Hot Updates)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  the best in the west
// @author       p_dh
// @match        https://www.roblox.com/users/friends
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      roblox.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526718/Roblox%20FriendList%20Follow%20Scraper%20%28PH%20Theme%20With%20Remes%20Hot%20Updates%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526718/Roblox%20FriendList%20Follow%20Scraper%20%28PH%20Theme%20With%20Remes%20Hot%20Updates%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FOLLOWERS_API = 'https://friends.roblox.com/v1/users/%userId%/followers/count';
    const USERNAME_API = 'https://users.roblox.com/v1/users/%userId%';
    const PROCESSING_DELAY = 200;
    const BATCH_SIZE = 5;
    let isProcessing = false;
    let isPaused = false;
    let currentPage = 1;
    let totalPages = 0;
    let totalUsers = 0;
    let validUsers = [];
    let startTime = null;
    let checksPerSecond = 0;
    let checksCount = 0;

    function createUI() {
        const overlay = document.createElement('div');
        overlay.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #000;
            color: #ff9900;
            padding: 15px;
            border-radius: 8px;
            z-index: 99999;
            box-shadow: 0 4px 6px rgba(255, 153, 0, 0.3);
            font-family: 'Arial', sans-serif;
            width: 320px;
            cursor: move;
            border: 2px solid #ff9900;
        `;
        overlay.innerHTML = `
            <div style="position: relative;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/60/Logo_.svg" alt="Failed To Load The Sigma Logo" width="200">
                    <h3 style="margin:0; font-size:18px; color: white; text-transform: uppercase;">Freaky Scraper 🍑</h3>
                </div>
                <div class="progress-container" style="background:#333; height:4px; border-radius:2px; margin-top:10px;">
                    <div class="progress-bar" style="height:100%; background:#ff9900; width:0; transition:width 0.3s"></div>
                </div>
                <div class="status" style="margin-top:10px; font-size:14px; color:#ddd;">Status: Ready to Go 😏</div>
                <div class="results" style="margin-top:10px; max-height:200px; overflow-y:auto; font-size:14px; color:white;"></div>
                <div class="timer" style="margin-top:10px; font-size:12px; color:#ff9900;">Time Elapsed: 0s</div>
                <div class="checks-per-second" style="margin-top:5px; font-size:12px; color:#ff9900;">Requests/Sec: 0</div>
                <button id="pauseButton" style="margin-top:10px; padding:8px 15px; background:#ffcc00; color:#000; font-size:14px; border:none; border-radius:4px; cursor:pointer; display:none;">⏸ Pause</button>
                <button id="exportButton" style="margin-top:10px; padding:8px 15px; background:#ff9900; color:#000; font-size:14px; border:none; border-radius:4px; cursor:pointer; display:none;">📥 Export Results</button>
                <div style="margin-top:10px; font-size:12px; color:#ff9900; text-align:center;">Made for my baddie Reme by p_dh 😘🔥</div>
                <button id="closeButton" style="position: absolute; top: -10px; right: -10px; background: #ff4444; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center;">X</button>
            </div>
        `;
        document.body.appendChild(overlay);

        const closeButton = overlay.querySelector('#closeButton');
        closeButton.addEventListener('click', () => {
            overlay.remove();
        });

        let isDragging = false;
        let offsetX, offsetY;
        overlay.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - overlay.getBoundingClientRect().left;
            offsetY = e.clientY - overlay.getBoundingClientRect().top;
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                overlay.style.left = `${e.clientX - offsetX}px`;
                overlay.style.top = `${e.clientY - offsetY}px`;
            }
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        return overlay;
    }

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

    function exportResults() {
        const sortedUsers = validUsers.sort((a, b) => b.followers - a.followers);
        const content = sortedUsers.map(user => `${user.username} (${user.followers})`).join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        GM_download({
            url: url,
            name: 'valid_users.txt',
            saveAs: true,
            onload: () => URL.revokeObjectURL(url),
            onerror: (e) => console.error('Download failed:', e)
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

        const overlay = createUI();
        const progressBar = overlay.querySelector('.progress-bar');
        const statusContainer = overlay.querySelector('.status');
        const resultsContainer = overlay.querySelector('.results');
        const timerContainer = overlay.querySelector('.timer');
        const checksPerSecondContainer = overlay.querySelector('.checks-per-second');
        const pauseButton = overlay.querySelector('#pauseButton');
        const exportButton = overlay.querySelector('#exportButton');

        pauseButton.style.display = 'inline-block';
        exportButton.style.display = 'none';

        startTime = Date.now();
        const timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            timerContainer.textContent = `Time Elapsed: ${formatTimeElapsed(elapsed)}`;
        }, 1000);

        const checksInterval = setInterval(() => {
            checksPerSecond = checksCount;
            checksCount = 0;
            checksPerSecondContainer.textContent = `Requests/Sec: ${checksPerSecond}`;
        }, 1000);

        pauseButton.addEventListener('click', () => {
            isPaused = !isPaused;
            pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
            exportButton.style.display = isPaused ? 'inline-block' : 'none';
            exportButton.textContent = 'Download Current Results';
        });

        exportButton.addEventListener('click', exportResults);

        try {
            while (true) {
                if (isPaused) {
                    await new Promise(r => setTimeout(r, 100));
                    continue;
                }

                const requests = Array.from(document.querySelectorAll('.list-item.avatar-card:not(.disabled)'));
                totalUsers = requests.length;

                for (let i = 0; i < totalUsers; i += BATCH_SIZE) {
                    if (isPaused) break;

                    const batch = requests.slice(i, i + BATCH_SIZE);
                    const batchPromises = batch.map(async (request, index) => {
                        const profileLink = request.querySelector('.avatar-card-link')?.href;
                        if (!profileLink || profileLink.includes('/banned-users/')) return;

                        const userIdMatch = profileLink.match(/\/users\/(\d+)\//);
                        if (!userIdMatch) return;

                        const userId = userIdMatch[1];
                        const [username, followers] = await Promise.all([
                            fetchUsername(userId),
                            fetchFollowerCount(userId)
                        ]);

                        checksCount++;
                        statusContainer.textContent = `Checking: ${username} (${i + index + 1}/${totalUsers})`;

                        if (followers > 1000) {
                            validUsers.push({ username, followers });
                            resultsContainer.innerHTML += `<div>${username} (${followers})</div>`;
                        }

                        progressBar.style.width = `${((i + index + 1) / totalUsers) * 100}%`;
                    });

                    await Promise.all(batchPromises);
                    await new Promise(r => setTimeout(r, PROCESSING_DELAY));
                }

                const nextButton = document.querySelector('.btn-generic-right-sm');
                if (!nextButton || nextButton.disabled) {
                    break;
                }

                nextButton.click();
                currentPage++;
                await waitForPageLoad();
            }
        } catch (error) {
            statusContainer.innerHTML = `<span style="color:#ff4444">Error: ${error.message}</span>`;
        } finally {
            clearInterval(timerInterval);
            clearInterval(checksInterval);
            isProcessing = false;
            isPaused = false;
            pauseButton.style.display = 'none';
            exportButton.style.display = 'inline-block';
            exportButton.textContent = 'Export Results';
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

    const startButton = document.createElement('button');
    startButton.textContent = 'Start Scraping 🍑';
    startButton.style = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        background: #ff9900;
        color: #000;
        font-weight: bold;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        z-index: 99999;
    `;
    startButton.addEventListener('click', processRequests);
    document.body.appendChild(startButton);
})();