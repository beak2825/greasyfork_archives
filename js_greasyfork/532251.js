// ==UserScript==
// @name         YouTube Timestamp Manager
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Full-featured timestamp manager with video tracking, inline editing, seeking, and sharp UI.
// @author       Tanuki
// @match        *://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/8fa11322/img/favicon_144x144.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532251/YouTube%20Timestamp%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/532251/YouTube%20Timestamp%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const DB_NAME = 'TanStampsDB';
    const DB_VERSION = 1;
    const STORE_NAME = 'timestamps';
    const NOTE_PLACEHOLDER = '[No note]'; // Placeholder text for empty notes

    let currentVideoId = null;
    let manager = null;
    let noteInput = null;
    let uiContainer = null;
    let progressMarkers = [];
    let currentTooltip = null;
    let updateMarkers = null;
    let timeUpdateInterval = null;

    // --- CSS Injection ---
    const style = document.createElement('style');
    style.textContent = `
        .tanuki-ui-container {
          display: inline-flex;
          align-items: center;
          margin-left: 8px;
        }
        .tanuki-timestamp {
          cursor: pointer;
          color: #fff;
          font-family: Arial, sans-serif;
          font-size: 14px;
          line-height: 24px;
          margin: 0 4px;
          user-select: none;
        }
        .tanuki-button {
          background: #333;
          color: #fff;
          border: 1px solid #555;
          padding: 4px 8px;
          border-radius: 0;
          cursor: pointer;
          font-size: 12px;
          transition: background 0.2s, border-color 0.2s;
          margin: 0 2px;
          user-select: none;
        }
        .tanuki-button:hover {
          background: #444;
          border-color: #777;
        }
        .tanuki-button:active {
          background: #222;
        }
        .tanuki-progress-marker {
          position: absolute;
          height: 100%;
          width: 3px;
          background: #3ea6ff;
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
          z-index: 999;
          pointer-events: auto;
          transform: translateX(-1.5px);
          cursor: pointer;
          border-radius: 0;
        }
        .tanuki-tooltip {
          position: fixed;
          background: rgba(0, 0, 0, 0.9);
          color: #fff;
          padding: 8px 12px;
          border-radius: 0;
          font-size: 12px;
          white-space: nowrap;
          z-index: 10000;
          pointer-events: none;
          transform: translate(-50%, -100%);
          margin-top: -4px;
        }
        .tanuki-note-input {
          position: fixed;
          background: rgba(30, 30, 30, 0.95);
          color: #fff;
          padding: 20px;
          border-radius: 0;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
          border: 1px solid #555;
        }
        .tanuki-note-input input {
          padding: 8px 10px;
          margin-bottom: 12px;
          border: 1px solid #666;
          border-radius: 0;
          width: 220px;
          background: #222;
          color: #fff;
          font-size: 14px;
        }
        .tanuki-note-input input:focus {
          outline: none;
          border-color: #3ea6ff;
        }
        .tanuki-note-input button {
          background: #007bff;
          border: none;
          border-radius: 0;
          padding: 8px 16px;
          cursor: pointer;
          color: #fff;
          font-weight: bold;
          transition: background 0.2s;
        }
        .tanuki-note-input button:hover {
          background: #0056b3;
        }
        .tanuki-manager {
          position: fixed;
          background: rgba(25, 25, 25, 0.97);
          color: #eee;
          padding: 15px 20px 20px 20px;
          border-radius: 0;
          z-index: 99999;
          width: 540px;
          height: 380px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
          border: 1px solid #444;
          display: flex;
          flex-direction: column;
        }
        .tanuki-manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #555;
          flex-shrink: 0;
        }
        .tanuki-manager h3 {
          margin: 0;
          padding: 0;
          border-bottom: none;
          color: #fff;
          font-size: 18px;
          text-align: left;
          flex-grow: 1;
          line-height: 1.2;
        }
        .tanuki-manager button.close-btn {
          background: #666;
          border: 1px solid #888;
          color: #fff;
          font-size: 18px;
          font-weight: bold;
          line-height: 1;
          padding: 3px 7px;
          border-radius: 0;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          position: static;
          margin-left: 10px;
          flex-shrink: 0;
        }
        .tanuki-manager button.close-btn:hover {
          background: #777;
          transform: scale(1.1);
        }
        .tanuki-manager-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-grow: 1;
          overflow-y: auto;
          margin-bottom: 15px;
        }
        .tanuki-timestamp-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #3a3a3a;
          padding: 10px 12px;
          border-radius: 0;
          transition: background 0.15s;
          font-size: 15px;
        }
        .tanuki-timestamp-item:hover {
          background: #4a4a4a;
        }
        .tanuki-timestamp-item span:first-child {
          margin-right: 12px;
          cursor: pointer;
          min-width: 70px;
          text-align: right;
          font-weight: bold;
          color: #3ea6ff;
          user-select: none;
        }
        .tanuki-timestamp-item span:nth-child(2) {
          flex: 1;
          margin-right: 12px;
          cursor: pointer;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #ddd;
          user-select: none;
        }
        .tanuki-timestamp-item .tanuki-note-placeholder {
          color: #999;
          font-style: italic;
        }
        .tanuki-timestamp-item input {
          padding: 6px 8px;
          border: 1px solid #666;
          border-radius: 0;
          background: #222;
          color: #fff;
          font-size: 15px;
          font-family: inherit;
          box-sizing: border-box;
        }
        .tanuki-timestamp-item input:focus {
          outline: none;
          border-color: #3ea6ff;
        }
        .tanuki-timestamp-item input.time-input {
          width: 80px;
          text-align: right;
          font-weight: bold;
          color: #3ea6ff;
        }
        .tanuki-timestamp-item input.note-input {
          flex: 1;
          margin-right: 12px;
        }
        .tanuki-timestamp-item button {
          background: #555;
          border: 1px solid #777;
          padding: 4px 8px;
          border-radius: 0;
          cursor: pointer;
          color: #fff;
          margin-left: 6px;
          font-size: 16px;
          line-height: 1;
          transition: background 0.2s, border-color 0.2s;
        }
        .tanuki-timestamp-item button:hover {
          background: #666;
          border-color: #888;
        }
        .tanuki-timestamp-item button.delete-btn {
          background: #d9534f;
          border-color: #d43f3a;
        }
        .tanuki-timestamp-item button.delete-btn:hover {
          background: #c9302c;
          border-color: #ac2925;
        }
        .tanuki-timestamp-item button.go-btn {
          background: #5cb85c;
          border-color: #4cae4c;
        }
        .tanuki-timestamp-item button.go-btn:hover {
          background: #449d44;
          border-color: #398439;
        }
        .tanuki-manager-footer {
          display: flex;
          justify-content: flex-end;
          flex-shrink: 0;
          padding-top: 10px;
          border-top: 1px solid #555;
        }
        .tanuki-manager button.delete-all-btn {
          background: #c9302c;
          border: 1px solid #ac2925;
          color: #fff;
          padding: 6px 12px;
          border-radius: 0;
          cursor: pointer;
          font-size: 13px;
          font-weight: bold;
          transition: background 0.2s, border-color 0.2s;
        }
        .tanuki-manager button.delete-all-btn:hover {
          background: #ac2925;
          border-color: #761c19;
        }
        .tanuki-manager button.delete-all-btn:disabled {
          background: #777;
          border-color: #999;
          color: #ccc;
          cursor: not-allowed;
        }
        .tanuki-empty-msg {
          color: #999;
          text-align: center;
          padding: 20px;
          font-style: italic;
          font-size: 14px;
        }
        .tanuki-notification {
          position: fixed;
          background: rgba(20, 20, 20, 0.9);
          color: #fff;
          padding: 12px 20px;
          border-radius: 0;
          font-size: 14px;
          transition: opacity 0.4s ease-out, transform 0.4s ease-out;
          z-index: 100001;
          pointer-events: none;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
          border: 1px solid #444;
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.9);
        }
        .tanuki-notification.show {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        .tanuki-confirmation {
          position: fixed;
          background: rgba(30, 30, 30, 0.95);
          color: #eee;
          padding: 25px;
          border-radius: 0;
          z-index: 100000;
          min-width: 320px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
          border: 1px solid #555;
        }
        .tanuki-confirmation div.tanuki-confirmation-message {
          margin-bottom: 18px;
          font-size: 15px;
          line-height: 1.4;
        }
        .tanuki-confirmation button {
          border: none;
          padding: 10px 20px;
          border-radius: 0;
          cursor: pointer;
          color: #fff;
          font-weight: bold;
          font-size: 14px;
          transition: background 0.2s, transform 0.1s;
          margin: 0 5px;
        }
        .tanuki-confirmation button:hover {
          transform: translateY(-1px);
        }
        .tanuki-confirmation button:active {
          transform: translateY(0px);
        }
        .tanuki-confirmation button.confirm-btn {
          background: #d9534f;
        }
        .tanuki-confirmation button.confirm-btn:hover {
          background: #c9302c;
        }
        .tanuki-confirmation button.cancel-btn {
          background: #555;
        }
        .tanuki-confirmation button.cancel-btn:hover {
          background: #666;
        }
    `;
    document.head.appendChild(style);

    // --- Database Functions ---
    async function openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: ['videoId', 'time'] });
                }
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            request.onerror = (event) => {
                console.error(`Tanuki Timestamp DB Error: ${event.target.error}`);
                reject(`Database error: ${event.target.error}`);
            };
        });
    }

    async function getTimestamps(videoId) {
        try {
            const db = await openDatabase();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.getAll();
                request.onsuccess = (event) => {
                    resolve(event.target.result
                        .filter(t => t.videoId === videoId)
                        .sort((a, b) => a.time - b.time));
                };
                request.onerror = (event) => {
                    console.error(`Tanuki Timestamp DB Get Error: ${event.target.error}`);
                    reject(event.target.error);
                };
            });
        } catch (error) {
            console.error('Tanuki Timestamp Error loading timestamps:', error);
            return [];
        }
    }

    async function saveTimestamp(videoId, time, note) {
        try {
            const db = await openDatabase();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.put({ videoId, time, note });
                request.onsuccess = () => {
                    resolve();
                };
                request.onerror = (event) => {
                    console.error(`Tanuki Timestamp DB Save Error: ${event.target.error}`);
                    reject(event.target.error);
                };
            });
        } catch (error) {
            console.error('Tanuki Timestamp Error saving timestamp:', error);
        }
    }

    async function deleteTimestamp(videoId, time) {
        try {
            const db = await openDatabase();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.delete([videoId, time]);
                request.onsuccess = () => {
                    resolve();
                };
                request.onerror = (event) => {
                    console.error(`Tanuki Timestamp DB Delete Error: ${event.target.error}`);
                    reject(event.target.error);
                };
            });
        } catch (error) {
            console.error('Tanuki Timestamp Error deleting timestamp:', error);
        }
    }

    // --- Utility Functions ---
    function getCurrentVideoId() {
        const currentUrl = window.location;
        const urlParams = new URLSearchParams(currentUrl.search);
        const videoIdFromParam = urlParams.get('v');
        if (videoIdFromParam && videoIdFromParam.length > 0) {
            return videoIdFromParam;
        }

        const pathname = currentUrl.pathname;
        const pathParts = pathname.split('/').filter(part => part !== '');
        if (pathParts.length === 2) {
            const potentialId = pathParts[1];
            const recognizedPathTypes = ['live', 'embed', 'shorts'];
            if (recognizedPathTypes.includes(pathParts[0]) && potentialId.length > 0) {
                return potentialId;
            }
        }
        return null;
    }

    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return [h, m, s].map(n => n.toString().padStart(2, '0')).join(':');
    }

    function parseTime(timeString) {
        const parts = timeString.split(':').map(Number);
        if (parts.some(isNaN) || parts.length < 2 || parts.length > 3) {
            return null;
        }
        while (parts.length < 3) {
            parts.unshift(0);
        }
        const [h, m, s] = parts;
        if (h < 0 || m < 0 || m > 59 || s < 0 || s > 59) {
            return null;
        }
        return h * 3600 + m * 60 + s;
    }

    function isLiveStream() {
        const timeDisplay = document.querySelector('.ytp-time-display');
        return timeDisplay && (timeDisplay.classList.contains('ytp-live') || timeDisplay.classList.contains('ytp-live-badge'));
    }

    // --- UI Notification & Confirmation ---
    function showNotification(message) {
        const existingToast = document.querySelector('.tanuki-notification');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'tanuki-notification';
        toast.textContent = message;
        document.body.appendChild(toast);

        const video = document.querySelector('video');
        if (video) {
             const videoRect = video.getBoundingClientRect();
             toast.style.left = `${videoRect.left + videoRect.width / 2}px`;
             toast.style.top = `${videoRect.top + 50}px`;
             toast.style.transform = 'translateX(-50%) scale(0.9)';
        } else {
            toast.style.left = '50%';
            toast.style.top = '10%';
            toast.style.transform = 'translateX(-50%) scale(0.9)';
        }

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = toast.style.transform.replace('scale(1)', 'scale(0.9)');
            setTimeout(() => {
                if (toast.parentNode) {
                   toast.remove();
                }
            }, 400);
        }, 2500);
    }

    function showConfirmation(message) {
        return new Promise(resolve => {
            const existingModal = document.querySelector('.tanuki-confirmation');
            if (existingModal) {
                existingModal.remove();
            }

            const modal = document.createElement('div');
            modal.className = 'tanuki-confirmation';
            modal.addEventListener('click', e => e.stopPropagation());

            const video = document.querySelector('video');
            if (video) {
                const videoRect = video.getBoundingClientRect();
                modal.style.left = `${videoRect.left + videoRect.width / 2}px`;
                modal.style.top = `${videoRect.top + videoRect.height / 2}px`;
                modal.style.transform = 'translate(-50%, -50%)';
            } else {
                modal.style.position = 'fixed';
                modal.style.top = '50%';
                modal.style.left = '50%';
                modal.style.transform = 'translate(-50%, -50%)';
            }

            const messageEl = document.createElement('div');
            messageEl.textContent = message;
            messageEl.className = 'tanuki-confirmation-message';

            const buttonContainer = document.createElement('div');

            const confirmBtn = document.createElement('button');
            confirmBtn.textContent = 'Confirm';
            confirmBtn.className = 'confirm-btn';
            confirmBtn.addEventListener('click', () => {
                resolve(true);
                cleanup();
            });

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.className = 'cancel-btn';
            cancelBtn.addEventListener('click', () => {
                resolve(false);
                cleanup();
            });

            buttonContainer.append(confirmBtn, cancelBtn);
            modal.append(messageEl, buttonContainer);
            document.body.appendChild(modal);

            let timeoutId = null;

            const cleanup = () => {
                if (modal.parentNode) {
                    document.body.removeChild(modal);
                }
                document.removeEventListener('click', outsideClickForConfirm, true);
                document.removeEventListener('keydown', keyHandlerForConfirm);
                clearTimeout(timeoutId);
            };

            const outsideClickForConfirm = (e) => {
                if (!modal.contains(e.target)) {
                    resolve(false);
                    cleanup();
                }
            };

             const keyHandlerForConfirm = (e) => {
                if (e.key === 'Escape') {
                    resolve(false);
                    cleanup();
                }
            };

            timeoutId = setTimeout(() => {
                document.addEventListener('click', outsideClickForConfirm, true);
                document.addEventListener('keydown', keyHandlerForConfirm);
                confirmBtn.focus();
            }, 0);
        });
    }

    // --- UI Cleanup ---
    function cleanupUI() {
        if (manager) {
            closeManager();
        }
        if (noteInput && noteInput.parentNode) {
            noteInput.remove();
            noteInput = null;
        }
        if (uiContainer && uiContainer.parentNode) {
            uiContainer.remove();
            uiContainer = null;
        }
        removeProgressMarkers();
        if (currentTooltip && currentTooltip.parentNode) {
            currentTooltip.remove();
            currentTooltip = null;
        }
        const video = document.querySelector('video');
        if (updateMarkers && video) {
            video.removeEventListener('timeupdate', updateMarkers);
            updateMarkers = null;
        }
        if (timeUpdateInterval) {
            clearInterval(timeUpdateInterval);
            timeUpdateInterval = null;
        }
    }

    // --- Progress Bar Markers ---
    function removeProgressMarkers() {
        progressMarkers.forEach((marker) => {
            if (marker && marker.parentNode) {
                 marker.remove();
            }
        });
        progressMarkers = [];
    }

    function updateMarker(oldTime, newTime, newNote) {
        const marker = progressMarkers.find(m => parseInt(m.dataset.time) === oldTime);
        if (!marker) {
            return;
        }

        marker.dataset.time = newTime;
        marker.dataset.note = newNote || '';
        marker.title = formatTime(newTime) + (newNote ? ` - ${newNote}` : '');

        const video = document.querySelector('video');
        const progressBar = document.querySelector('.ytp-progress-bar');
        if (!video || !progressBar) {
            return;
        }

        const isLive = isLiveStream();
        const duration = isLive ? video.currentTime : video.duration;
        if (!duration || isNaN(duration) || duration <= 0) {
            return;
        }

        const position = Math.min(100, Math.max(0, (newTime / duration) * 100));
        marker.style.left = `${position}%`;
    }

    function removeMarker(time) {
         const index = progressMarkers.findIndex(m => parseInt(m.dataset.time) === time);
         if (index !== -1) {
             const markerToRemove = progressMarkers[index];
             if (markerToRemove && markerToRemove.parentNode) {
                 markerToRemove.remove();
             }
             progressMarkers.splice(index, 1);
         }
    }

    async function createProgressMarkers() {
        removeProgressMarkers();
        const video = document.querySelector('video');
        const progressBar = document.querySelector('.ytp-progress-bar');
        if (!video || !progressBar || !currentVideoId) {
            return;
        }

        const timestamps = await getTimestamps(currentVideoId);
        const isLive = isLiveStream();
        const duration = isLive ? video.currentTime : video.duration;
        if (!duration || isNaN(duration) || duration <= 0) {
            return;
        }

        timestamps.forEach(ts => {
            addProgressMarker(ts, duration);
        });
    }

    function addProgressMarker(ts, videoDuration = null) {
        const progressBar = document.querySelector('.ytp-progress-bar');
        if (!progressBar) {
            return;
        }

        let duration = videoDuration;
        if (duration === null) {
             const video = document.querySelector('video');
             if (!video) {
                 return;
             }
             const isLive = isLiveStream();
             duration = isLive ? video.currentTime : video.duration;
        }

        if (!duration || isNaN(duration) || duration <= 0) {
            return;
        }

        const existingMarkerIndex = progressMarkers.findIndex(m => parseInt(m.dataset.time) === ts.time);
        if (existingMarkerIndex !== -1) {
            const existingMarker = progressMarkers[existingMarkerIndex];
            existingMarker.dataset.note = ts.note || '';
            existingMarker.title = formatTime(ts.time) + (ts.note ? ` - ${ts.note}` : '');
            const position = Math.min(100, Math.max(0, (ts.time / duration) * 100));
            existingMarker.style.left = `${position}%`;
            return;
        }

        const marker = document.createElement('div');
        marker.className = 'tanuki-progress-marker';
        const position = Math.min(100, Math.max(0, (ts.time / duration) * 100));
        marker.style.left = `${position}%`;
        marker.dataset.time = ts.time;
        marker.dataset.note = ts.note || '';
        marker.title = formatTime(ts.time) + (ts.note ? ` - ${ts.note}` : '');
        marker.addEventListener('mouseenter', showMarkerTooltip);
        marker.addEventListener('mouseleave', hideMarkerTooltip);
        marker.addEventListener('click', (e) => {
             e.stopPropagation();
             const video = document.querySelector('video');
             if (video) {
                 video.currentTime = ts.time;
             }
        });
        progressBar.appendChild(marker);
        progressMarkers.push(marker);
    }

    function showMarkerTooltip(e) {
        if (currentTooltip) {
            currentTooltip.remove();
        }

        const marker = e.target;
        const note = marker.dataset.note;
        const time = parseInt(marker.dataset.time);
        const formattedTime = formatTime(time);
        const tooltipText = note ? `${formattedTime} - ${note}` : formattedTime;

        currentTooltip = document.createElement('div');
        currentTooltip.className = 'tanuki-tooltip';
        currentTooltip.textContent = tooltipText;

        const rect = marker.getBoundingClientRect();
        currentTooltip.style.left = `${rect.left + rect.width / 2}px`;
        currentTooltip.style.top = `${rect.top}px`;

        document.body.appendChild(currentTooltip);
    }

    function hideMarkerTooltip() {
        if (currentTooltip) {
            currentTooltip.remove();
            currentTooltip = null;
        }
    }

    // --- Main UI Setup ---
    function setupUI() {
        if (uiContainer) {
            return;
        }

        const controls = document.querySelector('.ytp-left-controls');
        const video = document.querySelector('video');
        if (!controls || !video || !video.duration || video.duration <= 0) {
            return;
        }

        uiContainer = document.createElement('span');
        uiContainer.className = 'tanuki-ui-container';

        const timestampEl = document.createElement('span');
        timestampEl.className = 'tanuki-timestamp';
        timestampEl.textContent = formatTime(video.currentTime); // Initial time
        timestampEl.title = 'Click to copy current time';
        timestampEl.addEventListener('click', async () => {
            const video = document.querySelector('video');
            if (video) {
                const time = Math.floor(video.currentTime);
                try {
                    await navigator.clipboard.writeText(formatTime(time));
                    showNotification('Current timestamp copied!');
                } catch (error) {
                    showNotification('Copy failed');
                    console.error("Tanuki Timestamp Copy Error:", error);
                }
            }
        });

        const createButton = (label, title, handler) => {
            const btn = document.createElement('button');
            btn.className = 'tanuki-button';
            btn.textContent = label;
            btn.title = title;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                handler();
            });
            return btn;
        };

        const addButton = createButton('+', 'Add timestamp at current time', async () => {
            const video = document.querySelector('video');
            if (video && currentVideoId) {
                const time = Math.floor(video.currentTime);
                showNoteInput(video, time);
            }
        });

        const removeButton = createButton('-', 'Remove nearest timestamp', async () => {
            const video = document.querySelector('video');
            if (video && currentVideoId) {
                const currentTime = Math.floor(video.currentTime);
                const timestamps = await getTimestamps(currentVideoId);
                if (!timestamps.length) {
                    showNotification('No timestamps to remove');
                    return;
                }
                const closest = timestamps.reduce((prev, curr) =>
                    Math.abs(curr.time - currentTime) < Math.abs(prev.time - currentTime) ? curr : prev
                );

                const confirmed = await showConfirmation(`Delete timestamp at ${formatTime(closest.time)}?`);
                if (confirmed) {
                    await deleteTimestamp(currentVideoId, closest.time);
                    removeMarker(closest.time);
                    if (manager) {
                        const itemToRemove = manager.querySelector(`.tanuki-timestamp-item[data-time="${closest.time}"]`);
                        if (itemToRemove) {
                            itemToRemove.remove();
                        }
                        checkManagerEmpty();
                    }
                    showNotification(`Removed ${formatTime(closest.time)}`);
                }
            }
        });

        const copyButton = createButton('C', 'Copy all timestamps', async () => {
            if (!currentVideoId) {
                return;
            }
            const timestamps = await getTimestamps(currentVideoId);
            if (!timestamps.length) {
                showNotification('No timestamps to copy');
                return;
            }
            const formatted = timestamps
                .map(t => `${formatTime(t.time)}${t.note ? ` ${t.note}` : ''}`)
                .join('\n');
            try {
                await navigator.clipboard.writeText(formatted);
                showNotification('Copied all timestamps!');
            } catch (error) {
                showNotification('Copy failed');
                console.error("Tanuki Timestamp Copy All Error:", error);
            }
        });

        const manageButton = createButton('M', 'Manage timestamps', () => {
            showManager();
        });

        uiContainer.appendChild(timestampEl);
        uiContainer.appendChild(addButton);
        uiContainer.appendChild(removeButton);
        uiContainer.appendChild(copyButton);
        uiContainer.appendChild(manageButton);

        // Append to the end of left controls (generally safer for compatibility)
        if (controls && uiContainer) {
           controls.appendChild(uiContainer);
        }

        // Update timestamp display periodically
        if (timeUpdateInterval) {
            clearInterval(timeUpdateInterval); // Clear previous if any
        }
        timeUpdateInterval = setInterval(() => {
            const video = document.querySelector('video');
            const currentTsEl = uiContainer?.querySelector('.tanuki-timestamp');
            if (video && currentTsEl) {
                 currentTsEl.textContent = formatTime(video.currentTime);
            } else if (!currentTsEl && timeUpdateInterval) {
                clearInterval(timeUpdateInterval);
                timeUpdateInterval = null;
            }
        }, 1000);

        createProgressMarkers();

        // Handle live stream marker updates
        if (isLiveStream() && video) {
            updateMarkers = () => {
                const video = document.querySelector('video'); // Re-select video in case element changed
                if (!video) {
                   return;
                }
                const currentTime = video.currentTime;
                if (!currentTime || currentTime <= 0) {
                    return;
                }
                progressMarkers.forEach(marker => {
                    const time = parseInt(marker.dataset.time);
                    if (time <= currentTime) {
                        const position = Math.min(100, Math.max(0, (time / currentTime) * 100));
                        marker.style.left = `${position}%`;
                    } else {
                        marker.style.left = '100%';
                    }
                });
            };
            video.addEventListener('timeupdate', updateMarkers);
        }
    }

    // --- Note Input Popup ---
    function showNoteInput(video, time, initialNote = '') {
        if (noteInput) {
            return;
        }

        noteInput = document.createElement('div');
        noteInput.className = 'tanuki-note-input';
        noteInput.addEventListener('click', e => e.stopPropagation());

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter note (optional)';
        input.value = initialNote;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';

        noteInput.append(input, saveBtn);
        document.body.appendChild(noteInput);

        const videoRect = video.getBoundingClientRect();
        noteInput.style.left = `${videoRect.left + videoRect.width / 2}px`;
        noteInput.style.top = `${videoRect.top + videoRect.height / 2}px`;
        noteInput.style.transform = 'translate(-50%, -50%)';

        setTimeout(() => {
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
        }, 50);

        let timeoutId = null;

        const cleanup = () => {
            if (noteInput && noteInput.parentNode) {
                noteInput.remove();
            }
            noteInput = null;
            document.removeEventListener('click', outsideClick, true);
            document.removeEventListener('keydown', handleEscape);
            clearTimeout(timeoutId);
        };

        const saveHandler = async () => {
            const note = input.value.trim();
            const ts = { videoId: currentVideoId, time, note };

             if (!initialNote) {
                const existingTimestamps = await getTimestamps(currentVideoId);
                if (existingTimestamps.some(t => t.time === time)) {
                    const confirmed = await showConfirmation(`Timestamp at ${formatTime(time)} already exists. Overwrite note?`);
                    if (!confirmed) {
                         cleanup();
                         return;
                    }
                }
             }

            await saveTimestamp(currentVideoId, time, note);
            addProgressMarker(ts);

            if (manager) {
                const list = manager.querySelector('.tanuki-manager-list');
                const existingItem = list?.querySelector(`.tanuki-timestamp-item[data-time="${time}"]`);
                if (existingItem) {
                    updateTimestampItem(existingItem, ts);
                } else if (list) {
                    const newItem = createTimestampItem(ts);
                    const timestamps = await getTimestamps(currentVideoId);
                    let inserted = false;
                    const items = list.querySelectorAll('.tanuki-timestamp-item');
                    for (let i = 0; i < items.length; i++) {
                        const itemTime = parseInt(items[i].dataset.time);
                        if (time < itemTime) {
                            list.insertBefore(newItem, items[i]);
                            inserted = true;
                            break;
                        }
                    }
                    if (!inserted) {
                        list.appendChild(newItem);
                    }
                    checkManagerEmpty(false);
                }
            }
            cleanup();
            showNotification(`Saved ${formatTime(time)}${note ? ` - "${note}"` : ''}`);
        };

        const outsideClick = (e) => {
            if (noteInput && !noteInput.contains(e.target)) {
                cleanup();
            }
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                cleanup();
            }
        };

        saveBtn.addEventListener('click', (e) => {
             e.stopPropagation();
             saveHandler();
        });
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveHandler();
            }
        });

         timeoutId = setTimeout(() => {
            document.addEventListener('click', outsideClick, true);
            document.addEventListener('keydown', handleEscape);
        }, 0);
    }

    // --- Timestamp Manager Popup ---
    async function showManager() {
        if (!currentVideoId || manager) {
            return;
        }

        manager = document.createElement('div');
        manager.className = 'tanuki-manager';
        manager.addEventListener('click', e => e.stopPropagation());

        const header = document.createElement('div');
        header.className = 'tanuki-manager-header';

        const title = document.createElement('h3');
        title.textContent = 'Timestamp Manager';

        const closeButton = document.createElement('button');
        closeButton.textContent = '✕';
        closeButton.title = 'Close Manager (Esc)';
        closeButton.className = 'close-btn';
        closeButton.addEventListener('click', closeManager);

        header.append(title, closeButton);
        manager.appendChild(header);

        const list = document.createElement('div');
        list.className = 'tanuki-manager-list';
        manager.appendChild(list);

        const footer = document.createElement('div');
        footer.className = 'tanuki-manager-footer';

        const deleteAllBtn = document.createElement('button');
        deleteAllBtn.textContent = 'Delete All Timestamps';
        deleteAllBtn.title = 'Delete all timestamps for this video';
        deleteAllBtn.className = 'delete-all-btn';
        deleteAllBtn.addEventListener('click', handleDeleteAll);
        footer.appendChild(deleteAllBtn);
        manager.appendChild(footer);

        const timestamps = await getTimestamps(currentVideoId);
        if (!timestamps.length) {
            checkManagerEmpty(true, list);
            deleteAllBtn.disabled = true;
        } else {
            timestamps.forEach(ts => {
                const item = createTimestampItem(ts);
                list.appendChild(item);
            });
             deleteAllBtn.disabled = false;
        }

        positionManager();
        document.body.appendChild(manager);

        setTimeout(() => {
            document.addEventListener('keydown', managerKeydownHandler);
            document.addEventListener('click', managerOutsideClickHandler, true);
        }, 0);
    }

    // --- Manager Helper Functions ---

    function closeManager() {
         if (manager) {
            if (manager.parentNode) {
                manager.remove();
            }
            manager = null;
            document.removeEventListener('keydown', managerKeydownHandler);
            document.removeEventListener('click', managerOutsideClickHandler, true);
         }
    }

    function managerKeydownHandler(e) {
        if (e.key === 'Escape') {
            const activeElement = document.activeElement;
            const isInputFocused = manager && manager.contains(activeElement) && activeElement.tagName === 'INPUT';
            if (!isInputFocused) {
                 closeManager();
            } else {
                 activeElement.blur();
            }
        }
    }

    function managerOutsideClickHandler(e) {
        const isInsideConfirmation = !!e.target.closest('.tanuki-confirmation');
        const isManageButton = !!e.target.closest('.tanuki-button[title="Manage timestamps"]');
        if (manager && !manager.contains(e.target) && !isManageButton && !isInsideConfirmation) {
            closeManager();
        }
    }

    function positionManager() {
        if (!manager) {
            return;
        }
        const video = document.querySelector('video');
        if (video) {
            const videoRect = video.getBoundingClientRect();
            const managerWidth = 540;
            const managerHeight = 380;
            let left = videoRect.left + (videoRect.width - managerWidth) / 2;
            let top = videoRect.top + (videoRect.height - managerHeight) / 2;

            left = Math.max(10, Math.min(window.innerWidth - managerWidth - 10, left));
            top = Math.max(10, Math.min(window.innerHeight - managerHeight - 10, top));

            manager.style.left = `${left}px`;
            manager.style.top = `${top}px`;
            manager.style.transform = '';
        } else {
            manager.style.position = 'fixed';
            manager.style.top = '50%';
            manager.style.left = '50%';
            manager.style.transform = 'translate(-50%, -50%)';
        }
    }

    function checkManagerEmpty(forceShow = null, list = null) {
        if (!manager && !list) {
            return;
        }

        const theList = list || manager?.querySelector('.tanuki-manager-list');
        const deleteAllBtn = manager?.querySelector('.delete-all-btn');

        if (!theList) {
             return;
        }

        const emptyMsgClass = 'tanuki-empty-msg';
        let emptyMsg = theList.querySelector(`.${emptyMsgClass}`);
        const hasItems = !!theList.querySelector('.tanuki-timestamp-item');

        if (forceShow === true || (forceShow === null && !hasItems)) {
            if (!emptyMsg) {
                emptyMsg = document.createElement('div');
                emptyMsg.className = emptyMsgClass;
                emptyMsg.textContent = 'No timestamps created for this video yet.';
                theList.prepend(emptyMsg);
            }
             if (deleteAllBtn) {
                 deleteAllBtn.disabled = true;
             }
        } else if (forceShow === false || (forceShow === null && hasItems)) {
            if (emptyMsg) {
                emptyMsg.remove();
            }
             if (deleteAllBtn) {
                 deleteAllBtn.disabled = false;
             }
        }
    }

    async function handleDeleteAll() {
        if (!currentVideoId || !manager) {
            return;
        }

        const listElement = manager.querySelector('.tanuki-manager-list');
        const deleteAllButton = manager.querySelector('.delete-all-btn');
        if (!listElement) {
            console.error("Tanuki Timestamp: Manager list element not found in handleDeleteAll.");
            return;
        }

        const timestamps = await getTimestamps(currentVideoId);
        if (timestamps.length === 0) {
            showNotification("No timestamps to delete.");
            return;
        }

        const confirmed = await showConfirmation(`Are you sure you want to delete all ${timestamps.length} timestamps for this video? This cannot be undone.`);

        if (!manager || !manager.contains(listElement)) {
             return; // Manager closed or list is stale after confirmation
        }

        if (confirmed) {
            try {
                const deletePromises = timestamps.map(ts => deleteTimestamp(currentVideoId, ts.time));
                await Promise.all(deletePromises);

                while (listElement.firstChild) {
                    listElement.removeChild(listElement.firstChild);
                }

                removeProgressMarkers();
                checkManagerEmpty(true, listElement);
                showNotification("All timestamps deleted successfully.");

            } catch (error) {
                console.error("Tanuki Timestamp: Error deleting all timestamps:", error);
                showNotification("Error occurred while deleting timestamps.");
                if (deleteAllButton) {
                     deleteAllButton.disabled = timestamps.length === 0;
                }
            }
        }
    }

    // --- Manager Timestamp Item Creation & Editing ---
    function createTimestampItem(ts) {
        const item = document.createElement('div');
        item.className = 'tanuki-timestamp-item';
        item.dataset.time = ts.time;

        const timeEl = document.createElement('span');
        timeEl.textContent = formatTime(ts.time);
        timeEl.title = 'Double-click to edit time';

        const noteEl = document.createElement('span');
        if (ts.note) {
            noteEl.textContent = ts.note;
        } else {
            noteEl.textContent = NOTE_PLACEHOLDER;
            noteEl.classList.add('tanuki-note-placeholder');
        }
        noteEl.title = 'Double-click to edit note';

        const goBtn = document.createElement('button');
        goBtn.textContent = '▶';
        goBtn.title = 'Go to timestamp';
        goBtn.className = 'go-btn';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✕';
        deleteBtn.title = 'Delete timestamp';
        deleteBtn.className = 'delete-btn';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.append(goBtn, deleteBtn);

        item.append(timeEl, noteEl, buttonContainer);

        goBtn.addEventListener('click', () => {
            const video = document.querySelector('video');
            if (video) {
                video.currentTime = ts.time;
            }
        });

        deleteBtn.addEventListener('click', async () => {
            const currentItemTime = parseInt(item.dataset.time);
            const confirmed = await showConfirmation(`Delete timestamp at ${formatTime(currentItemTime)}?`);
            if (confirmed) {
                await deleteTimestamp(currentVideoId, currentItemTime);
                removeMarker(currentItemTime);
                item.remove();
                checkManagerEmpty();
            }
        });

        const makeEditable = (element, inputClass, originalValue, saveCallback, validationCallback = null) => {
             if (element.parentNode && element.parentNode.querySelector('input')) {
                 return;
             }

             const input = document.createElement('input');
             input.type = 'text';
             input.className = inputClass;
             input.value = originalValue;

             const originalElement = element;
             originalElement.replaceWith(input);
             input.focus();
             input.select();

             let isSaving = false;

             const saveChanges = async () => {
                 if (!input.parentNode) {
                      return false;
                 }
                 if (isSaving) {
                     return false;
                 }
                 isSaving = true;

                 const newValue = input.value.trim();

                 if (validationCallback && !(await validationCallback(newValue))) {
                     input.replaceWith(originalElement);
                     isSaving = false;
                     return false;
                 }

                 const originalTimeSeconds = (inputClass === 'time-input') ? parseTime(originalElement.textContent) : null;
                 const hasChanged = (inputClass === 'time-input')
                    ? parseTime(newValue) !== originalTimeSeconds
                    : newValue !== (ts.note || '');

                 if (hasChanged) {
                    try {
                        await saveCallback(newValue, input, originalElement);
                    } catch (error) {
                         console.error("Tanuki Timestamp: Error during save callback:", error);
                         if (input.parentNode) {
                             input.replaceWith(originalElement);
                         }
                    }
                 } else {
                     if (input.parentNode) {
                         input.replaceWith(originalElement);
                     }
                 }
                 isSaving = false;
                 return true;
             };

             const handleBlur = async (e) => {
                 const relatedTarget = e.relatedTarget;
                 if (!relatedTarget || !item.contains(relatedTarget) || !['BUTTON', 'INPUT', 'A'].includes(relatedTarget.tagName)) {
                    await saveChanges();
                 }
             };

             input.addEventListener('blur', (e) => setTimeout(() => handleBlur(e), 150));

             input.addEventListener('keydown', async (e) => {
                 if (e.key === 'Enter') {
                     e.preventDefault();
                     await saveChanges();
                 } else if (e.key === 'Escape') {
                     e.preventDefault();
                     if (input.parentNode) {
                        input.replaceWith(originalElement);
                     }
                 }
             });
         };

        timeEl.addEventListener('dblclick', () => {
            makeEditable(timeEl, 'time-input', timeEl.textContent,
                async (newTimeString, inputElement, originalDisplayElement) => {
                    const newTime = parseTime(newTimeString);
                    const oldTime = ts.time;

                    await deleteTimestamp(currentVideoId, oldTime);
                    await saveTimestamp(currentVideoId, newTime, ts.note);

                    ts.time = newTime;
                    item.dataset.time = newTime;
                    originalDisplayElement.textContent = formatTime(newTime);
                    if (inputElement.parentNode) {
                        inputElement.replaceWith(originalDisplayElement);
                    }
                    updateMarker(oldTime, newTime, ts.note);

                    const list = manager?.querySelector('.tanuki-manager-list');
                    if(list) {
                        const items = Array.from(list.querySelectorAll('.tanuki-timestamp-item'));
                        items.sort((a, b) => parseInt(a.dataset.time) - parseInt(b.dataset.time));
                        items.forEach(sortedItem => list.appendChild(sortedItem));
                    }
                    showNotification(`Time updated to ${formatTime(newTime)}`);
                },
                async (newTimeString) => {
                    const newTime = parseTime(newTimeString);
                    if (newTime === null || newTime < 0) {
                        showNotification('Invalid time format (HH:MM:SS)');
                        return false;
                    }
                    if (newTime !== ts.time) {
                        const existingTimestamps = await getTimestamps(currentVideoId);
                        if (existingTimestamps.some(t => t.time === newTime)) {
                            showNotification(`Timestamp at ${formatTime(newTime)} already exists.`);
                            return false;
                        }
                    }
                    return true;
                }
            );
        });

        noteEl.addEventListener('dblclick', () => {
            makeEditable(noteEl, 'note-input', ts.note || '',
                async (newNote, inputElement, originalDisplayElement) => {
                    await saveTimestamp(currentVideoId, ts.time, newNote);

                    ts.note = newNote;
                    if (newNote) {
                        originalDisplayElement.textContent = newNote;
                        originalDisplayElement.classList.remove('tanuki-note-placeholder');
                    } else {
                        originalDisplayElement.textContent = NOTE_PLACEHOLDER;
                        originalDisplayElement.classList.add('tanuki-note-placeholder');
                    }
                    if (inputElement.parentNode) {
                        inputElement.replaceWith(originalDisplayElement);
                    }
                    updateMarker(ts.time, ts.time, newNote);
                    showNotification(`Note updated for ${formatTime(ts.time)}`);
                }
            );
        });

        return item;
    }

    function updateTimestampItem(itemElement, ts) {
        if (!itemElement) {
            return;
        }

        const timeEl = itemElement.querySelector('span:first-child');
        const noteEl = itemElement.querySelector('span:nth-child(2)');

        if (timeEl) {
            timeEl.textContent = formatTime(ts.time);
        }
        if (noteEl) {
             if (ts.note) {
                noteEl.textContent = ts.note;
                noteEl.classList.remove('tanuki-note-placeholder');
            } else {
                noteEl.textContent = NOTE_PLACEHOLDER;
                noteEl.classList.add('tanuki-note-placeholder');
            }
        }
        itemElement.dataset.time = ts.time;
    }

    // --- Initialization and Video Change Detection ---
    let initInterval = setInterval(() => {
        const videoId = getCurrentVideoId();
        const videoPlayer = document.querySelector('video');
        const controlsExist = !!document.querySelector('.ytp-left-controls');

        if (videoId && videoPlayer && videoPlayer.readyState >= 1 && controlsExist) {
            if (videoId !== currentVideoId) {
                cleanupUI();
                currentVideoId = videoId;
                setTimeout(setupUI, 500);
            } else if (!uiContainer && currentVideoId === videoId) {
                 cleanupUI();
                 setTimeout(setupUI, 500);
            }
        } else if (currentVideoId && (!videoId || !videoPlayer || !controlsExist)) {
            cleanupUI();
            currentVideoId = null;
        }
    }, 1000);

})();