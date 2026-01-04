// ==UserScript==
// @name         GeoGuessr AutoSaver
// @match        https://www.geoguessr.com/*
// @version      0.1
// @description  Autosave your GeoGuessr games in a local folder.
// @author       Jan Justi
// @website      https://github.com/janjusti/geoguessr-autosaver
// @license      GPL-3.0
// @grant        GM_xmlhttpRequest
// @require      https://unpkg.com/axios@1.6.7/dist/axios.min.js
// @namespace https://greasyfork.org/users/1502987
// @downloadURL https://update.greasyfork.org/scripts/545737/GeoGuessr%20AutoSaver.user.js
// @updateURL https://update.greasyfork.org/scripts/545737/GeoGuessr%20AutoSaver.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const DB_NAME = 'folder-access-db';
    const STORE_NAME = 'handles';
    const HANDLE_KEY = 'dirHandle';
    const GAMESERVER_BASE_URL = 'https://game-server.geoguessr.com/api';

    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);
            request.onupgradeneeded = () => {
                request.result.createObjectStore(STORE_NAME);
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async function getStoredHandle() {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.get(HANDLE_KEY);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async function storeHandle(handle) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const request = store.put(handle, HANDLE_KEY);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async function verifyPermission(handle) {
        const options = { mode: 'read' };
        if ((await handle.queryPermission(options)) === 'granted') return true;
        if ((await handle.requestPermission(options)) === 'granted') return true;
        return false;
    }

    async function isDirHandleValid(dirHandle) {
        try {
            for await (const _ of dirHandle.values()) {
                break; // we just need to confirm we can iterate
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    async function getLatestDownloadedMatch() {
        let dirHandle = await getStoredHandle();

        if (!dirHandle || !(await verifyPermission(dirHandle)) || !(await isDirHandleValid(dirHandle))) {
            try {
                dirHandle = await window.showDirectoryPicker();
                if (!(await verifyPermission(dirHandle))) {
                    alert('Permission denied.');
                    return null;
                }
                await storeHandle(dirHandle);
            } catch (err) {
                notify('Could not access configured folder. Select another folder.', 'error');
                return null;
            }
        }

        try {
            const latestFileHandle = await dirHandle.getFileHandle('latest.txt');
            const file = await latestFileHandle.getFile();
            const text = await file.text();
            const latestFileName = text.trim();
            const ldm = (latestFileName ?? 'NoJSONFileDetected').replace(/\.json$/i, '');
            return { ldm, dirHandle };
        } catch (e) {
            if (e.name === 'NotFoundError') {
                const createNew = confirm(
                    `"latest.txt" not found in the selected folder.\n\nClick OK to create a new one, or Cancel to choose another folder.`
                );

                if (createNew) {
                    try {
                        const fileHandle = await dirHandle.getFileHandle('latest.txt', { create: true });
                        const writable = await fileHandle.createWritable();
                        await writable.write('');
                        await writable.close();
                        return { ldm: 'NoJSONFileDetected', dirHandle };
                    } catch (err) {
                        alert('Failed to create latest.txt.');
                        return null;
                    }
                } else {
                    try {
                        dirHandle = await window.showDirectoryPicker();
                        if (!(await verifyPermission(dirHandle))) {
                            alert('Permission denied.');
                            return null;
                        }
                        await storeHandle(dirHandle);
                        return await getLatestDownloadedMatch(); // retry with new folder
                    } catch {
                        alert('Could not access new folder.');
                        return null;
                    }
                }
            } else {
                console.error('Unexpected error while accessing latest.txt:', e);
                alert('Unexpected error while accessing latest.txt.');
                return null;
            }
        }
    }


    function sleepRandom(min = 1000, max = 2000) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    function extractGameIds(entry, gameIds, latestDownloadedMatch) {
        const payloadJson = JSON.parse(entry.payload);
        const payloadArray = Array.isArray(payloadJson) ? payloadJson : [payloadJson];

        for (const payload of payloadArray) {
            let id, mode, timeStr;

            if (payload.gameId !== undefined) {
                id = payload.gameId;
                mode = payload.gameMode;
                timeStr = entry.time;
            } else if (payload.payload && payload.payload.gameId !== undefined) {
                id = payload.payload.gameId;
                mode = payload.payload.gameMode;
                timeStr = payload.time ?? entry.time;
            } else {
                continue;
            }

            if (id == latestDownloadedMatch) {
                return true;
            }

            gameIds.push({ id, time: timeStr, mode });
        }

        return false;
    }

    async function getGameIds(session, latestDownloadedMatch) {
        const gameIds = [];
        let paginationToken = null;
        let playerId = null;
        let fetchCount = 0;
        const maxFetches = -1; // limit for testing

        try {
            while (true) {
                fetchCount++;
                if (maxFetches > 0 && fetchCount > maxFetches) break;

                notify(`Fetching games...${paginationToken ? ` (page ${fetchCount})` : ''}`);
                const response = await session.get('https://www.geoguessr.com/api/v4/feed/private', {
                    params: { paginationToken }
                });
                const data = response.data;
                paginationToken = data.paginationToken;

                if (!playerId && data.entries.length > 0) {
                    playerId = data.entries[0].user.id;
                }

                let foundOlder = false;

                for (const entry of data.entries) {
                    try {
                        foundOlder = extractGameIds(entry, gameIds, latestDownloadedMatch);
                        if (foundOlder) break;
                    } catch (error) {
                        console.error(error);
                    }
                }

                if (!paginationToken || foundOlder) break;
                await sleepRandom();
            }
        } catch (error) {
            console.error("An error occurred while fetching game IDs:", error);
        }

        return gameIds;
    }

    async function saveGameJson(dirHandle, gameId, data) {
        const fileHandle = await dirHandle.getFileHandle(`${gameId}.json`, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(data));
        await writable.close();
    }

    async function updateLatestFile(dirHandle, newFilename) {
        const fileHandle = await dirHandle.getFileHandle('latest.txt', { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(newFilename);
        await writable.close();
    }

    function cropToMinutes(isoString) {
        return isoString.replace("T", " ").slice(0, 16);
    }

    async function downloadGameIds(gameIds, dirHandle, session) {
        gameIds.sort((a, b) => new Date(a.time) - new Date(b.time));
        const total = gameIds.length;

        for (let i = 0; i < total; i++) {
            const { id, time, mode } = gameIds[i];
            const shortId = id.split('-')[0];
            let url;

            if (mode === 'Duels' || mode === 'TeamDuels') {
                url = `${GAMESERVER_BASE_URL}/duels/${id}`;
            } else if (mode === 'BattleRoyaleDistance' || mode === 'BattleRoyaleCountries') {
                url = `${GAMESERVER_BASE_URL}/battle-royale/${id}`;
            } else {
                notify(`(${i + 1}/${total}) Unsupported mode "${mode}" for game ${shortId}`, 'alert');
                continue;
            }

            try {
                const response = await session.get(url);
                await saveGameJson(dirHandle, id, response.data);
                notify(`(${i + 1}/${total}) Saved ${shortId} (${mode}|${cropToMinutes(time)})`);
                await updateLatestFile(dirHandle, `${id}.json`);
            } catch (e) {
                const errStr = `(${i + 1}/${total}) Failed to download ${id}`;
                notify(errStr, 'error');
                console.warn(errStr, e);
            }

            if (i != total - 1) {
                await sleepRandom(1000, 3000);
            }
        }
    }

    function notify(message, type = null, duration = null) {
        const containerId = 'autosaver-notify-container';

        if (duration === null) {
            duration =
                type === 'error' ? 7000 :
            type === 'alert' ? 5000 :
            type === 'ok' ? 4000 :
            3000;
        }

        let container = document.getElementById(containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            container.style.position = 'fixed';
            container.style.bottom = '10px';
            container.style.right = '10px';
            container.style.zIndex = '9999';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '5px';
            document.body.appendChild(container);
        }

        const box = document.createElement('div');
        box.textContent = message;

        box.style.background =
            type === 'ok' ? '#4CAF50' :
        type === 'error' ? '#f44336' :
        type === 'alert' ? '#ff9800' :
        '#333';

        box.style.color = '#fff';
        box.style.padding = '8px 12px';
        box.style.borderRadius = '4px';
        box.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
        box.style.fontSize = '14px';
        container.appendChild(box);

        setTimeout(() => {
            box.remove();
        }, duration);
    }

    function onElementAppearOnceUntilGone(selector, callback) {
        let activeElement = null;
        let hasRun = false;

        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);

            if (!hasRun && el && location.pathname.includes('/multiplayer')) {
                hasRun = true;
                activeElement = el;
                callback(el);
            }

            // Reset if the element is removed
            if (hasRun && activeElement && !document.body.contains(activeElement)) {
                hasRun = false;
                activeElement = null;
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    async function init() {
        try {
            notify('Starting AutoSaver...');
            const { ldm, dirHandle } = await getLatestDownloadedMatch();
            notify(`Latest Downloaded: ${ldm.split('-')[0]}`)

            const session = axios.create({
                withCredentials: true
            });
            const gameIds = await getGameIds(session, ldm);
            notify(`${gameIds.length} game(s) to download`);

            await downloadGameIds(gameIds, dirHandle, session);
            notify('Done.', 'ok');
        } catch (e) {
            notify('AutoSaver failed to run :(', 5000, 'error');
            console.warn(e);
        }
    }

    onElementAppearOnceUntilGone('div[class*="division-header"]', (el) => {
        init();
    });

})();
