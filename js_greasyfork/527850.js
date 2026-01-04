// ==UserScript==
// @name         YouTube Advanced Downloader
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Advanced YouTube video downloader with quality selection and progress tracking
// @author       Anassk
// @match        https://www.youtube.com/*
// @match        https://www.youtube.com/watch?v=*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527850/YouTube%20Advanced%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/527850/YouTube%20Advanced%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration with storage
    let API_KEY = GM_getValue('API_KEY', 'Your API Key');
    let API_BASE = GM_getValue('API_BASE', 'Your API Base URL');

    // Define qualities
    const QUALITIES = [
        { label: 'Audio Only (M4A)', value: 'audio' },
        { label: '144p', value: '144p' },
        { label: '240p', value: '240p' },
        { label: '360p', value: '360p' },
        { label: '480p', value: '480p' },
        { label: '720p', value: '720p' },
        { label: '1080p', value: '1080p' },
        { label: 'Highest Quality', value: 'highest' }
    ];

    // Configuration UI
    function showConfig() {
        // Create dialog styles if not exists
        let style = document.getElementById('yt-dl-config-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'yt-dl-config-style';
            style.textContent = `
                .yt-dl-config-dialog {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #1a1a1a;
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    z-index: 10000;
                    width: 400px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    border: 1px solid #333;
                }
                .yt-dl-config-dialog h2 {
                    margin: 0 0 15px 0;
                    font-size: 18px;
                    color: #fff;
                }
                .yt-dl-config-dialog .input-group {
                    margin-bottom: 15px;
                }
                .yt-dl-config-dialog label {
                    display: block;
                    margin-bottom: 5px;
                    color: #aaa;
                }
                .yt-dl-config-dialog input {
                    width: 100%;
                    padding: 8px;
                    background: #333;
                    color: white;
                    border: 1px solid #444;
                    border-radius: 4px;
                    margin-bottom: 10px;
                }
                .yt-dl-config-dialog .buttons {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }
                .yt-dl-config-dialog button {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .yt-dl-config-dialog .save-btn {
                    background: #2196F3;
                    color: white;
                }
                .yt-dl-config-dialog .cancel-btn {
                    background: #666;
                    color: white;
                }
                .yt-dl-config-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.7);
                    z-index: 9999;
                }
            `;
            document.head.appendChild(style);
        }

        // Create dialog
        const overlay = document.createElement('div');
        overlay.className = 'yt-dl-config-overlay';
        
        const dialog = document.createElement('div');
        dialog.className = 'yt-dl-config-dialog';
        dialog.innerHTML = `
            <h2>⚙️ Configure YouTube Downloader</h2>
            <div class="input-group">
                <label for="api-key">API Key:</label>
                <input type="password" id="api-key" value="${API_KEY}" placeholder="Enter your API key">
                <label for="api-base">API Base URL:</label>
                <input type="text" id="api-base" value="${API_BASE}" placeholder="Enter your API base URL">
            </div>
            <div class="buttons">
                <button class="cancel-btn">Cancel</button>
                <button class="save-btn">Save</button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Handle buttons
        dialog.querySelector('.save-btn').addEventListener('click', () => {
            const newApiKey = dialog.querySelector('#api-key').value.trim();
            const newApiBase = dialog.querySelector('#api-base').value.trim();

            if (newApiKey && newApiBase) {
                GM_setValue('API_KEY', newApiKey);
                GM_setValue('API_BASE', newApiBase);
                API_KEY = newApiKey;
                API_BASE = newApiBase;
                showNotification('Configuration saved successfully! ✅');
                document.body.removeChild(overlay);
            } else {
                showNotification('Please fill in all fields! ⚠️');
            }
        });

        dialog.querySelector('.cancel-btn').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
    }

    // Notification helper
    function showNotification(text, timeout = 3000) {
        GM_notification({
            text: text,
            title: 'YouTube Downloader',
            timeout: timeout
        });
    }

    // Configuration check
    function checkConfig() {
        if (API_KEY === 'Your API Key' || API_BASE === 'Your API Base URL') {
            showNotification('Please configure the downloader first! Click the Tampermonkey icon and select "⚙️ Configure"');
            setTimeout(showConfig, 1000);
            return false;
        }
        return true;
    }

    // Create and show download dialog
    function showDialog() {
        if (!checkConfig()) return;

        // Create dialog styles
        const style = document.createElement('style');
        style.textContent = `
            .yt-dl-dialog {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #1a1a1a;
                color: white;
                padding: 20px;
                border-radius: 8px;
                z-index: 10000;
                min-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border: 1px solid #333;
            }
            .yt-dl-dialog h2 {
                margin: 0 0 15px 0;
                font-size: 18px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .yt-dl-dialog select {
                width: 100%;
                padding: 8px;
                margin-bottom: 15px;
                background: #333;
                color: white;
                border: 1px solid #444;
                border-radius: 4px;
            }
            .yt-dl-dialog .buttons {
                display: flex;
                justify-content: space-between;
                gap: 10px;
            }
            .yt-dl-dialog button {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
            }
            .yt-dl-dialog .download-btn {
                background: #2196F3;
                color: white;
            }
            .yt-dl-dialog .link-btn {
                background: #4CAF50;
                color: white;
            }
            .yt-dl-dialog .cancel-btn {
                background: #666;
                color: white;
            }
            .yt-dl-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.7);
                z-index: 9999;
            }
            #download-progress {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #1a1a1a;
                color: white;
                padding: 15px;
                border-radius: 8px;
                z-index: 10001;
                min-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: none;
            }
            #download-progress .progress-bar {
                height: 5px;
                background: #333;
                border-radius: 3px;
                margin: 10px 0;
                overflow: hidden;
            }
            #download-progress .progress-bar-fill {
                height: 100%;
                background: #2196F3;
                width: 0%;
                transition: width 0.3s ease;
            }
        `;
        document.head.appendChild(style);

        // Create dialog
        const overlay = document.createElement('div');
        overlay.className = 'yt-dl-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'yt-dl-dialog';
        dialog.innerHTML = `
            <h2>📥 Download Video</h2>
            <select id="quality-select">
                ${QUALITIES.map(q => `<option value="${q.value}">${q.label}</option>`).join('')}
            </select>
            <div class="buttons">
                <button class="download-btn">💾 Download</button>
                <button class="link-btn">🔗 Get Link</button>
                <button class="cancel-btn">❌ Cancel</button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Handle buttons
        dialog.querySelector('.download-btn').addEventListener('click', () => {
            const quality = dialog.querySelector('#quality-select').value;
            document.body.removeChild(overlay);
            streamDownload(quality);
        });

        dialog.querySelector('.link-btn').addEventListener('click', () => {
            const quality = dialog.querySelector('#quality-select').value;
            document.body.removeChild(overlay);
            quickLink(quality);
        });

        dialog.querySelector('.cancel-btn').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
    }

    // Progress UI functions
    function showProgress(text, progress = null) {
        let container = document.getElementById('download-progress');
        if (!container) {
            container = document.createElement('div');
            container.id = 'download-progress';
            container.innerHTML = `
                <div class="status"></div>
                <div class="progress-bar">
                    <div class="progress-bar-fill"></div>
                </div>
            `;
            document.body.appendChild(container);
        }
        container.style.display = 'block';
        container.querySelector('.status').textContent = text;
        if (progress !== null) {
            container.querySelector('.progress-bar-fill').style.width = `${progress}%`;
        }
    }

    function hideProgress() {
        const container = document.getElementById('download-progress');
        if (container) {
            container.style.display = 'none';
        }
    }

    // Download functions
    async function streamDownload(quality) {
        if (!checkConfig()) return;

        const videoId = new URLSearchParams(window.location.search).get('v');
        if (!videoId) {
            showNotification('No video found! ❌');
            return;
        }

        try {
            showProgress('Starting download...', 0);
            const url = `${API_BASE}/api/stream/${videoId}?quality=${quality}`;
            const title = document.title.replace(' - YouTube', '').trim();
            const ext = quality === 'audio' ? 'm4a' : 'mp4';

            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    responseType: 'blob',
                    headers: { 'X-API-Key': API_KEY },
                    onprogress: (progress) => {
                        if (progress.lengthComputable) {
                            const percent = (progress.loaded / progress.total * 100).toFixed(1);
                            showProgress(`Downloading: ${percent}%`, percent);
                        }
                    },
                    onload: resolve,
                    onerror: reject
                });
            });

            const blob = new Blob([response.response]);
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `${title}.${ext}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);

            showProgress('Download complete! ✅', 100);
            setTimeout(hideProgress, 3000);
        } catch (error) {
            console.error('Download error:', error);
            showProgress('Download failed! ❌');
            showNotification('Download failed! Check console for details.');
            setTimeout(hideProgress, 3000);
        }
    }

    async function quickLink(quality) {
        if (!checkConfig()) return;

        const videoId = new URLSearchParams(window.location.search).get('v');
        if (!videoId) {
            showNotification('No video found! ❌');
            return;
        }

        try {
            showProgress('Getting download link...');
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${API_BASE}/api/download/${videoId}?quality=${quality}`,
                    headers: { 'X-API-Key': API_KEY },
                    onload: (response) => {
                        if (response.status === 200) {
                            resolve(JSON.parse(response.responseText));
                        } else {
                            reject(new Error(response.statusText));
                        }
                    },
                    onerror: reject
                });
            });

            window.open(response.download_url, '_blank');
            showProgress('Link opened in new tab! ✅');
            setTimeout(hideProgress, 2000);
        } catch (error) {
            console.error('Error:', error);
            showProgress('Failed to get link! ❌');
            showNotification('Failed to get download link! Check console for details.');
            setTimeout(hideProgress, 3000);
        }
    }

    // Add context menu button to video thumbnails
    function addContextMenuToThumbnails() {
        const thumbnails = document.querySelectorAll('a#thumbnail');
        thumbnails.forEach(thumbnail => {
            if (!thumbnail.dataset.dlEnabled) {
                thumbnail.addEventListener('contextmenu', (e) => {
                    const videoId = thumbnail.href?.match(/[?&]v=([^&]+)/)?.[1];
                    if (videoId) {
                        e.preventDefault();
                        const rect = thumbnail.getBoundingClientRect();
                        showContextMenu(videoId, rect.left, rect.top);
                    }
                });
                thumbnail.dataset.dlEnabled = 'true';
            }
        });
    }

    // Context menu for thumbnails
    function showContextMenu(videoId, x, y) {
        const menu = document.createElement('div');
        menu.className = 'yt-dl-context-menu';
        menu.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 4px;
            padding: 5px 0;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;

        menu.innerHTML = `
            <div style="padding: 8px 12px; color: #fff; font-size: 14px; cursor: pointer; hover: background-color: #333;">
                📥 Download Video
            </div>
        `;

        document.body.appendChild(menu);

        // Handle click
        menu.addEventListener('click', () => {
            window.location.href = `https://www.youtube.com/watch?v=${videoId}`;
            setTimeout(showDialog, 1000);
        });

        // Remove menu on click outside
        function removeMenu(e) {
            if (!menu.contains(e.target)) {
                document.body.removeChild(menu);
                document.removeEventListener('click', removeMenu);
            }
        }
        setTimeout(() => document.addEventListener('click', removeMenu), 0);
    }

    // YouTube spa navigation handler
    function handleSpaNavigation() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    addContextMenuToThumbnails();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize
    function init() {
        // Add initial context menus
        addContextMenuToThumbnails();
        
        // Handle SPA navigation
        handleSpaNavigation();
        
        // Add configuration command
        GM_registerMenuCommand('⚙️ Configure', showConfig);
        
        // Add download command
        GM_registerMenuCommand('📥 Download Video', showDialog);
    }

    // Start the script
    init();
})();