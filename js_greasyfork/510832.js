// ==UserScript==
// @name        Discord Catbox Uploader
// @namespace   https://tampermonkey.net/
// @version     1.6
// @description adds a button to upload files to catbox.moe, output gets copied to your clipboard
// @author      OasisVee
// @match       https://*.discord.com/*
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_log
// @connect     catbox.moe
// @icon        https://www.google.com/s2/favicons?sz=64&domain=catbox.moe
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/510832/Discord%20Catbox%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/510832/Discord%20Catbox%20Uploader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STYLES = `
        .catbox-tooltip {
            position: absolute;
            background-color: #202225;
            color: #dcddde;
            padding: 8px 12px;
            border-radius: 5px;
            font-size: 14px;
            font-weight: 500;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.1s ease-in-out;
            z-index: 9999;
            top: -30px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            white-space: nowrap;
            border: 1px solid #36393F;
        }
        .catbox-tooltip::before {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            border: 8px solid transparent;
            border-top-color: #202225;
            bottom: -16px;
            left: 50%;
            transform: translateX(-50%);
        }
        #catbox-settings {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #36393f;
            padding: 20px;
            border-radius: 5px;
            z-index: 10000;
            display: none;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        #catbox-settings input {
            width: 100%;
            margin-bottom: 10px;
            padding: 8px;
            background-color: #40444b;
            border: none;
            color: #dcddde;
            border-radius: 3px;
        }
        #catbox-settings button {
            background-color: #5865f2;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 3px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        #catbox-settings button:hover {
            background-color: #4752c4;
        }
        #debug-console {
            position: fixed;
            top: 25%;
            right: 10px;
            width: 300px;
            max-height: 200px;
            overflow-y: auto;
            background-color: rgba(0, 0, 0, 0.8);
            color: #ffffff;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            z-index: 9999;
            display: none;
        }
        .debug-entry {
            margin-bottom: 5px;
            border-bottom: 1px solid #333;
            padding-bottom: 5px;
        }
    `;

    const CAT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12,8L10.67,8.09C9.81,7.07 7.4,4.5 5,4.5C5,4.5 3.03,7.46 4.96,11.41C4.41,12.24 4.07,12.67 4,13.66L2.07,18.37L2.06,18.39C1.61,19.31 2.08,20.68 3,21.13L3.09,21.17C3.42,21.31 3.77,21.35 4.09,21.3C4.39,21.33 4.7,21.27 4.95,21.13L5.36,20.94C6.35,20.44 6.69,20.18 7.12,20.03C7.88,19.83 8.88,19.9 10.01,19.9H14C15.15,19.9 16.15,19.83 16.91,20.03C17.34,20.18 17.66,20.44 18.65,20.94L19.06,21.13C19.3,21.27 19.61,21.33 19.91,21.3C20.23,21.35 20.58,21.31 20.91,21.17L21,21.13C21.92,20.68 22.39,19.31 21.94,18.39L21.93,18.37L20,13.66C19.93,12.67 19.59,12.24 19.04,11.41C20.97,7.46 19,4.5 19,4.5C16.6,4.5 14.19,7.07 13.33,8.09L12,8M9,11A1,1 0 0,1 10,12A1,1 0 0,1 9,13A1,1 0 0,1 8,12A1,1 0 0,1 9,11M15,11A1,1 0 0,1 16,12A1,1 0 0,1 15,13A1,1 0 0,1 14,12A1,1 0 0,1 15,11M11,14H13L12.3,15.39C12.5,16.03 13.06,16.5 13.75,16.5A1.5,1.5 0 0,0 15.25,15H15.75A2,2 0 0,1 13.75,17C13,17 12.35,16.59 12,16V16H12C11.65,16.59 11,17 10.25,17A2,2 0 0,1 8.25,15H8.75A1.5,1.5 0 0,0 10.25,16.5C10.94,16.5 11.5,16.03 11.7,15.39L11,14Z"/></svg>`;

    // Update the selectors to make them more reliable
    const BUTTON_CONTAINER_SELECTOR = 'div[class*="buttonContainer"]';
    const UPLOAD_BUTTON_SELECTOR = 'button[class*="attachButton"]';
    const NOTIFICATION_DURATION = 3000;
    const FADE_DURATION = 300;
    const DEBUG_MODE = true; // Set to true to enable debug console

    class CatboxUploader {
        constructor() {
            this.setupDebugConsole();
            this.debugLog('CatboxUploader initialized');
            this.setupElements();
            this.setupEventListeners();
            this.init();
        }

        setupDebugConsole() {
            if (!DEBUG_MODE) return;

            this.debugConsole = document.createElement('div');
            this.debugConsole.id = 'debug-console';
            this.debugConsole.style.display = 'none'; // Start hidden by default
            document.body.appendChild(this.debugConsole);

            // Add toggle shortcut (Alt+D)
            document.addEventListener('keydown', (e) => {
                if (e.altKey && e.key === 'd') {
                    this.debugConsole.style.display = this.debugConsole.style.display === 'none' ? 'block' : 'none';
                }
            });
        }

        debugLog(message, type = 'info') {
            console.log(`[Catbox] ${message}`);
            if (DEBUG_MODE) {
                const entry = document.createElement('div');
                entry.className = 'debug-entry';
                entry.style.color = type === 'error' ? '#ff6b6b' : type === 'success' ? '#51cf66' : '#74c0fc';
                entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
                this.debugConsole.appendChild(entry);
                this.debugConsole.scrollTop = this.debugConsole.scrollHeight;

                // Remove this line to prevent auto-showing the console on every log
                // this.debugConsole.style.display = 'block';
            }
        }
        setupElements() {
            this.debugLog('Setting up elements');
            this.fileInput = document.createElement('input');
            this.fileInput.type = 'file';
            this.fileInput.accept = 'image/*,video/*,audio/*,application/*';
            document.body.appendChild(this.fileInput);
            this.fileInput.style.display = 'none';

            this.tooltipElement = document.createElement('div');
            this.tooltipElement.className = 'catbox-tooltip';

            this.notificationElement = document.createElement('div');
            this.notificationElement.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                padding: 10px 20px;
                border-radius: 5px;
                color: white;
                font-weight: bold;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
            `;

            this.createCatboxButton();
        }

        createCatboxButton() {
            this.debugLog('Creating Catbox button template');
            this.catboxButtonTemplate = document.createElement('button');
            this.catboxButtonTemplate.id = 'catbox-upload-btn';
            this.catboxButtonTemplate.innerHTML = CAT_SVG;
            this.catboxButtonTemplate.setAttribute('data-tooltip', 'Upload to Catbox');
        }

        setupEventListeners() {
            this.debugLog('Setting up event listeners');
            this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
            document.addEventListener('click', this.handleOutsideClick.bind(this));
        }

        handleFileSelect(event) {
            const file = event.target.files[0];
            if (file) {
                this.debugLog(`File selected: ${file.name} (${file.size} bytes, ${file.type})`);
                this.uploadFile(file);
            } else {
                this.debugLog('No file selected', 'error');
            }
        }

        handleOutsideClick(event) {
            const settingsDiv = document.getElementById('catbox-settings');
            if (settingsDiv && !settingsDiv.contains(event.target) &&
                event.target.id !== 'catbox-upload-btn' &&
                !event.target.closest('#catbox-upload-btn')) {
                settingsDiv.remove();
            }
        }

        addCatboxButton() {
            // Find the container of buttons first
            const buttonContainer = document.querySelector(BUTTON_CONTAINER_SELECTOR);
            const uploadButton = document.querySelector(UPLOAD_BUTTON_SELECTOR);

            if (buttonContainer && uploadButton && !document.getElementById('catbox-upload-btn')) {
                this.debugLog('Found button container and upload button');
                const catboxButton = this.catboxButtonTemplate.cloneNode(true);
                catboxButton.className = uploadButton.className;
                this.styleCatboxButton(catboxButton);
                this.attachButtonEventListeners(catboxButton);

                // Insert directly into the button container, right after the upload button
                try {
                    buttonContainer.insertBefore(catboxButton, uploadButton.nextSibling);
                    this.debugLog('Catbox button added successfully');

                    // Fix the spacing to match Discord's UI
                    catboxButton.style.marginLeft = '2px';
                    return true;
                } catch (e) {
                    this.debugLog(`Error adding button: ${e.message}`, 'error');
                    return false;
                }
            }
            return false;
        }

        styleCatboxButton(button) {
            button.style.cssText = `
                vertical-align: top;
                padding: 0px 8px;
                height: 44px;
                line-height: 0px;
                position: relative;
                color: white;
                opacity: 0.8;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                transition: opacity 0.2s;
                margin: 0;
                top: 0;
                transform: none;
                background: transparent;
                border: none;
                cursor: pointer;
            `;
            button.addEventListener('mouseenter', () => button.style.opacity = '1');
            button.addEventListener('mouseleave', () => button.style.opacity = '0.8');
        }

        attachButtonEventListeners(button) {
            button.addEventListener('click', this.handleCatboxUpload.bind(this));
            button.addEventListener('mouseenter', this.showTooltip.bind(this));
            button.addEventListener('mouseleave', this.hideTooltip.bind(this));
            button.addEventListener('contextmenu', this.toggleSettings.bind(this));
        }

        handleCatboxUpload(event) {
            event.preventDefault();
            event.stopPropagation();
            this.debugLog('Catbox upload button clicked');

            // Need to remove and re-add the input to avoid issues
            if (this.fileInput.parentNode) {
                document.body.removeChild(this.fileInput);
            }

            this.fileInput = document.createElement('input');
            this.fileInput.type = 'file';
            this.fileInput.accept = 'image/*,video/*,audio/*,application/*';
            this.fileInput.style.display = 'none';
            this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
            document.body.appendChild(this.fileInput);

            // Trigger file selection
            this.fileInput.click();
        }

        uploadFile(file) {
            this.debugLog(`Attempting to upload file: ${file.name}`);
            this.showNotification('Uploading to Catbox.moe...', 'info');

            const formData = new FormData();
            formData.append('reqtype', 'fileupload');
            formData.append('fileToUpload', file);

            const userHash = GM_getValue('catboxUserHash', '');
            if (userHash) {
                this.debugLog('Using saved user hash');
                formData.append('userhash', userHash);
            } else {
                this.debugLog('No user hash found');
            }

            try {
                this.debugLog('Sending request to Catbox API...');
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://catbox.moe/user/api.php',
                    data: formData,
                    headers: {
                        'User-Agent': 'Discord-Catbox-Uploader/1.6'
                    },
                    onload: (response) => {
                        this.debugLog(`Response received: Status ${response.status}`);
                        this.handleUploadResponse(response);
                    },
                    onerror: (error) => {
                        this.debugLog(`Upload error: ${error}`, 'error');
                        this.showNotification('Error uploading to Catbox.moe. Please try again.', 'error');
                    },
                    onprogress: (progress) => {
                        if (progress.lengthComputable) {
                            const percentComplete = Math.round((progress.loaded / progress.total) * 100);
                            this.debugLog(`Upload progress: ${percentComplete}%`);
                        }
                    }
                });
            } catch (e) {
                this.debugLog(`Exception during upload: ${e.message}`, 'error');
                this.showNotification('Error uploading to Catbox.moe. Please try again.', 'error');
            }
        }

        handleUploadResponse(response) {
            this.debugLog(`Response text: ${response.responseText}`);

            if (response.status === 200 && response.responseText) {
                // Validate that the response is a URL
                if (response.responseText.startsWith('https://')) {
                    GM_setClipboard(response.responseText);
                    this.debugLog('File uploaded successfully, URL copied to clipboard', 'success');
                    this.showNotification('File uploaded and link copied to clipboard!', 'success');
                } else {
                    this.debugLog(`Invalid response, not a URL: ${response.responseText}`, 'error');
                    this.showNotification('Error: Received invalid response from Catbox.', 'error');
                }
            } else {
                this.debugLog('Upload failed: Bad response status or empty response', 'error');
                this.showNotification('Error uploading to Catbox.moe. Please try again.', 'error');
            }
        }

        showTooltip(event) {
            const button = event.currentTarget;
            this.tooltipElement.textContent = button.getAttribute('data-tooltip');
            document.body.appendChild(this.tooltipElement);

            const buttonRect = button.getBoundingClientRect();
            const tooltipRect = this.tooltipElement.getBoundingClientRect();

            this.tooltipElement.style.left = `${buttonRect.left + (buttonRect.width / 2) - (tooltipRect.width / 2)}px`;
            this.tooltipElement.style.top = `${buttonRect.top - tooltipRect.height - 15}px`;

            requestAnimationFrame(() => this.tooltipElement.style.opacity = '1');
        }

        hideTooltip() {
            this.tooltipElement.style.opacity = '0';
            setTimeout(() => {
                if (this.tooltipElement.parentNode) {
                    this.tooltipElement.parentNode.removeChild(this.tooltipElement);
                }
            }, 100);
        }

        showNotification(message, type) {
            this.debugLog(`Notification: ${message}`, type);
            this.notificationElement.textContent = message;
            this.notificationElement.style.backgroundColor =
                type === 'error' ? '#ff4444' :
            type === 'info' ? '#0099cc' : '#00C851';

            if (this.notificationElement.parentNode) {
                document.body.removeChild(this.notificationElement);
            }

            document.body.appendChild(this.notificationElement);

            requestAnimationFrame(() => {
                this.notificationElement.style.opacity = '1';
                setTimeout(() => {
                    this.notificationElement.style.opacity = '0';
                    setTimeout(() => {
                        if (this.notificationElement.parentNode) {
                            document.body.removeChild(this.notificationElement);
                        }
                    }, FADE_DURATION);
                }, NOTIFICATION_DURATION);
            });
        }

        toggleSettings(event) {
            event.preventDefault();
            this.debugLog('Settings dialog requested');

            const existingSettings = document.getElementById('catbox-settings');
            if (existingSettings) {
                existingSettings.remove();
                return;
            }

            const settingsDiv = document.createElement('div');
            settingsDiv.id = 'catbox-settings';
            settingsDiv.innerHTML = `
                <h3 style="color: #dcddde; margin-top: 0; margin-bottom: 10px;">Catbox Settings</h3>
                <p style="color: #b9bbbe; margin-bottom: 15px; font-size: 13px;">Enter your Catbox user hash to associate uploads with your account</p>
                <input type="text" id="catbox-user-hash" placeholder="Enter Catbox User Hash">
                <button id="save-catbox-settings">Save</button>
                <button id="test-catbox-connection" style="margin-top: 10px; background-color: #5d5d5d;">Test Connection</button>
            `;

            document.body.appendChild(settingsDiv);

            const userHashInput = document.getElementById('catbox-user-hash');
            userHashInput.value = GM_getValue('catboxUserHash', '');

            document.getElementById('save-catbox-settings').addEventListener('click', () => {
                const userHash = userHashInput.value.trim();
                GM_setValue('catboxUserHash', userHash);
                settingsDiv.remove();
                this.debugLog(`User hash saved: ${userHash ? '(hash saved)' : '(empty)'}`);
                this.showNotification('Catbox settings saved!', 'success');
            });

            document.getElementById('test-catbox-connection').addEventListener('click', () => {
                this.testCatboxConnection();
            });

            settingsDiv.style.display = 'block';
        }

        testCatboxConnection() {
            this.debugLog('Testing connection to Catbox.moe');
            this.showNotification('Testing connection to Catbox.moe...', 'info');

            // Use a test file upload to check the connection
            const formData = new FormData();
            formData.append('reqtype', 'fileupload');

            // Create a tiny test file
            const blob = new Blob(['test'], { type: 'text/plain' });
            const testFile = new File([blob], 'connection_test.txt', { type: 'text/plain' });
            formData.append('fileToUpload', testFile);

            const userHash = GM_getValue('catboxUserHash', '');
            if (userHash) {
                formData.append('userhash', userHash);
            }

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://catbox.moe/user/api.php',
                data: formData,
                headers: {
                    'User-Agent': 'Discord-Catbox-Uploader/1.6'
                },
                onload: (response) => {
                    this.debugLog(`Test connection response: Status ${response.status}, Response: ${response.responseText}`);
                    if (response.status >= 200 && response.status < 300 && response.responseText.startsWith('https://')) {
                        this.showNotification('Connection to Catbox.moe successful!', 'success');
                    } else {
                        this.showNotification(`Connection test failed with status ${response.status}`, 'error');
                    }
                },
                onerror: (error) => {
                    this.debugLog(`Test connection error: ${error}`, 'error');
                    this.showNotification('Connection to Catbox.moe failed!', 'error');
                }
            });
        }

        init() {
            this.debugLog('Initializing script');
            GM_addStyle(STYLES);

            const observer = new MutationObserver((mutations) => {
                if (mutations.some(mutation => mutation.addedNodes.length > 0)) {
                    if (!document.getElementById('catbox-upload-btn')) {
                        this.addCatboxButton();
                    }
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
            this.addCatboxButton();
            this.debugLog('Init complete');
        }
    }

    // Initialize the uploader
    new CatboxUploader();
})();