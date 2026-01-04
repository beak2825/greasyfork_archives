// ==UserScript==
// @name         Google Drive Video Downloader - For Restricted Video Download (by AFU-IT)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This userscript can help you download the video and audio from Google Drive video that restricting you to download the video.
// @author       AFU-IT
// @match        https://drive.google.com/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/536948/Google%20Drive%20Video%20Downloader%20-%20For%20Restricted%20Video%20Download%20%28by%20AFU-IT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536948/Google%20Drive%20Video%20Downloader%20-%20For%20Restricted%20Video%20Download%20%28by%20AFU-IT%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let downloadPanel = null;
    let floatingIcon = null;
    let instructionPopup = null;
    let isPanelVisible = false;
    let isInstructionVisible = false;
    let isButtonEnabled = GM_getValue('buttonEnabled', true);

    // Register menu commands in Tampermonkey
    GM_registerMenuCommand('🔴 Disable Download Button', () => {
        GM_setValue('buttonEnabled', false);
        isButtonEnabled = false;
        hideFloatingIcon();
        alert('Download button disabled. Refresh the page to apply changes.');
    });

    GM_registerMenuCommand('🟢 Enable Download Button', () => {
        GM_setValue('buttonEnabled', true);
        isButtonEnabled = true;
        showFloatingIcon();
        alert('Download button enabled.');
    });

    // Create Apple-style CSS
    function createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Apple-style Floating Icon - 55px */
            .gdrive-floating-icon {
                position: fixed !important;
                bottom: 24px !important;
                right: 24px !important;
                z-index: 2147483647 !important;
                width: 55px !important;
                height: 55px !important;
                background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%) !important;
                border: none !important;
                border-radius: 18px !important;
                cursor: pointer !important;
                box-shadow: 0 8px 25px rgba(0, 122, 255, 0.3), 0 3px 10px rgba(0, 0, 0, 0.1) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                color: white !important;
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                backdrop-filter: blur(20px) !important;
                -webkit-backdrop-filter: blur(20px) !important;
                opacity: 0 !important;
                transform: translateY(20px) scale(0.8) !important;
                pointer-events: none !important;
            }

            .gdrive-floating-icon.visible {
                opacity: 1 !important;
                transform: translateY(0) scale(1) !important;
                pointer-events: all !important;
            }

            .gdrive-floating-icon:hover {
                background: linear-gradient(135deg, #0056CC 0%, #4A4AE8 100%) !important;
                box-shadow: 0 12px 35px rgba(0, 122, 255, 0.4), 0 6px 15px rgba(0, 0, 0, 0.15) !important;
                transform: translateY(-3px) scale(1.05) !important;
            }

            .gdrive-floating-icon:active {
                transform: translateY(-1px) scale(0.98) !important;
                transition: all 0.1s ease !important;
            }

            /* Apple-style Download Icon */
            .gdrive-download-icon {
                width: 22px !important;
                height: 22px !important;
                position: relative !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }

            .gdrive-download-icon::before {
                content: '' !important;
                position: absolute !important;
                width: 2px !important;
                height: 12px !important;
                background: white !important;
                border-radius: 1px !important;
                top: 2px !important;
            }

            .gdrive-download-icon::after {
                content: '' !important;
                position: absolute !important;
                width: 7px !important;
                height: 7px !important;
                border-right: 2px solid white !important;
                border-bottom: 2px solid white !important;
                transform: rotate(45deg) !important;
                bottom: 5px !important;
                border-radius: 0 1px 0 0 !important;
            }

            /* Popup Panel */
            .gdrive-popup-panel {
                position: fixed !important;
                bottom: 90px !important;
                right: 24px !important;
                z-index: 2147483646 !important;
                width: 400px !important;
                background: rgba(255, 255, 255, 0.95) !important;
                backdrop-filter: blur(20px) !important;
                -webkit-backdrop-filter: blur(20px) !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                border-radius: 20px !important;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1) !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                overflow: hidden !important;
                opacity: 0 !important;
                transform: translateY(30px) scale(0.9) !important;
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
                pointer-events: none !important;
            }

            .gdrive-popup-panel.visible {
                opacity: 1 !important;
                transform: translateY(0) scale(1) !important;
                pointer-events: all !important;
            }

            /* Header */
            .gdrive-panel-header {
                background: rgba(248, 249, 250, 0.8) !important;
                backdrop-filter: blur(20px) !important;
                -webkit-backdrop-filter: blur(20px) !important;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
                padding: 6x 24px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
            }

            .gdrive-panel-title {
                font-size: 17px !important;
                font-weight: 600 !important;
                color: #1d1d1f !important;
                margin: 0 !important;
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
                letter-spacing: -0.022em !important;
            }

            .gdrive-header-controls {
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
            }

            .gdrive-close-btn {
                background: rgba(120, 120, 128, 0.12) !important;
                border: none !important;
                cursor: pointer !important;
                padding: 0 !important;
                border-radius: 50% !important;
                color: #8e8e93 !important;
                font-size: 16px !important;
                transition: all 0.2s ease !important;
                width: 30px !important;
                height: 30px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-weight: 500 !important;
            }

            .gdrive-close-btn:hover {
                background: rgba(120, 120, 128, 0.2) !important;
                color: #48484a !important;
            }

            /* Content */
            .gdrive-panel-content {
                padding: 24px !important;
            }

            .gdrive-input-label {
                font-size: 15px !important;
                font-weight: 500 !important;
                color: #1d1d1f !important;
                margin-bottom: 10px !important;
                display: block !important;
                letter-spacing: -0.024em !important;
            }

            /* Instruction Text */
            .gdrive-instruction-text {
                font-size: 13px !important;
                color: #5f6368 !important;
                margin-bottom: 8px !important;
                line-height: 1.4 !important;
            }

            .gdrive-help-btn {
                background: rgba(0, 122, 255, 0.1) !important;
                border: 1px solid rgba(0, 122, 255, 0.2) !important;
                color: #007AFF !important;
                padding: 6px 12px !important;
                border-radius: 8px !important;
                font-size: 12px !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
                font-weight: 500 !important;
            }

            .gdrive-help-btn:hover {
                background: rgba(0, 122, 255, 0.15) !important;
            }

            .gdrive-help-btn.active {
                background: #007AFF !important;
                color: white !important;
            }

            .gdrive-url-input {
                width: 100% !important;
                min-height: 100px !important;
                max-height: 200px !important;
                border: 1px solid rgba(0, 0, 0, 0.1) !important;
                border-radius: 12px !important;
                padding: 16px !important;
                font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace !important;
                font-size: 13px !important;
                color: #1d1d1f !important;
                resize: vertical !important;
                margin-bottom: 16px !important;
                transition: all 0.2s ease !important;
                box-sizing: border-box !important;
                overflow-y: auto !important;
                background: rgba(255, 255, 255, 0.8) !important;
                backdrop-filter: blur(10px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
            }

            .gdrive-url-input:focus {
                outline: none !important;
                border-color: #007AFF !important;
                box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1) !important;
                background: rgba(255, 255, 255, 0.95) !important;
            }

            .gdrive-url-input::placeholder {
                color: #8e8e93 !important;
            }

            /* Detection Result */
            .gdrive-detection-result {
                margin: 16px 0 !important;
                padding: 10px !important;
                border-radius: 12px !important;
                font-size: 14px !important;
                font-weight: 500 !important;
                text-align: center !important;
                min-height: 20px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 8px !important;
                letter-spacing: -0.022em !important;
            }

            .gdrive-detection-result.video {
                background: rgba(52, 199, 89, 0.1) !important;
                color: #30d158 !important;
                border: 1px solid rgba(52, 199, 89, 0.2) !important;
            }

            .gdrive-detection-result.audio {
                background: rgba(255, 69, 58, 0.1) !important;
                color: #ff453a !important;
                border: 1px solid rgba(255, 69, 58, 0.2) !important;
            }

            .gdrive-detection-result.error {
                background: rgba(255, 149, 0, 0.1) !important;
                color: #ff9500 !important;
                border: 1px solid rgba(255, 149, 0, 0.2) !important;
            }

            .gdrive-detection-result.empty {
                background: rgba(120, 120, 128, 0.08) !important;
                color: #8e8e93 !important;
                border: 1px solid rgba(120, 120, 128, 0.12) !important;
            }

            /* Apple-style Buttons */
            .gdrive-button-group {
                display: flex !important;
                gap: 8px !important;
                margin-top: 20px !important;
            }

            .gdrive-btn {
                flex: 1 !important;
                padding: 5px 12px !important;
                border: none !important;
                border-radius: 10px !important;
                cursor: pointer !important;
                font-size: 13px !important;
                font-weight: 600 !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                transition: all 0.2s ease !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 4px !important;
                min-height: 36px !important;
                letter-spacing: -0.022em !important;
            }

            .gdrive-btn-primary {
                background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%) !important;
                color: #ffffff !important;
                box-shadow: 0 2px 8px rgba(0, 122, 255, 0.25) !important;
            }

            .gdrive-btn-primary:hover {
                background: linear-gradient(135deg, #0056CC 0%, #4A4AE8 100%) !important;
                box-shadow: 0 4px 12px rgba(0, 122, 255, 0.35) !important;
                transform: translateY(-1px) !important;
            }

            .gdrive-btn-primary:disabled {
                background: rgba(120, 120, 128, 0.12) !important;
                color: rgba(60, 60, 67, 0.3) !important;
                cursor: not-allowed !important;
                box-shadow: none !important;
                transform: none !important;
            }

            .gdrive-btn-secondary {
                background: rgba(0, 122, 255, 0.1) !important;
                color: #007AFF !important;
                border: 1px solid rgba(0, 122, 255, 0.2) !important;
            }

            .gdrive-btn-secondary:hover {
                background: rgba(0, 122, 255, 0.15) !important;
                transform: translateY(-1px) !important;
                box-shadow: 0 2px 8px rgba(0, 122, 255, 0.15) !important;
            }

            .gdrive-btn-outline {
                background: rgba(120, 120, 128, 0.08) !important;
                color: #8e8e93 !important;
                border: 1px solid rgba(120, 120, 128, 0.12) !important;
            }

            .gdrive-btn-outline:hover {
                background: rgba(120, 120, 128, 0.12) !important;
                color: #48484a !important;
                transform: translateY(-1px) !important;
            }

            /* Instruction Popup - UPDATED sizing and positioning */
            .gdrive-instruction-popup {
                position: fixed !important;
                bottom: 520px !important;
                right: 24px !important;
                z-index: 2147483650 !important;
                width: 380px !important;
                height: auto !important;
                max-height: 280px !important;
                background: rgba(255, 255, 255, 0.98) !important;
                backdrop-filter: blur(20px) !important;
                -webkit-backdrop-filter: blur(20px) !important;
                border: 1px solid rgba(0, 0, 0, 0.1) !important;
                border-radius: 20px !important;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1) !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                overflow: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
                transform: translateY(20px) scale(0.9) !important;
                transition: all 0.3s ease !important;
            }

            .gdrive-instruction-popup.visible {
                opacity: 1 !important;
                transform: translateY(0) scale(1) !important;
                pointer-events: all !important;
            }

            .gdrive-instruction-header {
                background: rgba(248, 249, 250, 0.9) !important;
                backdrop-filter: blur(20px) !important;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
                padding: 10px 20px !important;
                font-weight: 600 !important;
                font-size: 16px !important;
                color: #1d1d1f !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                letter-spacing: -0.022em !important;
            }

            .gdrive-instruction-content {
                padding: 18px 20px !important;
                font-size: 13px !important;
                color: #1d1d1f !important;
                line-height: 1.5 !important;
                background: rgba(255, 255, 255, 0.95) !important;
                max-height: 200px !important;
                overflow-y: auto !important;
            }

            .gdrive-instruction-content ol {
                margin: 0 !important;
                padding-left: 18px !important;
            }

            .gdrive-instruction-content li {
                margin-bottom: 10px !important;
                padding-left: 6px !important;
                color: #1d1d1f !important;
            }

            .gdrive-instruction-content strong {
                color: #1d1d1f !important;
                font-weight: 600 !important;
            }

            .gdrive-instruction-content code {
                background: rgba(0, 122, 255, 0.1) !important;
                color: #007AFF !important;
                padding: 2px 5px !important;
                border-radius: 4px !important;
                font-family: 'SF Mono', Monaco, monospace !important;
                font-size: 12px !important;
            }

            /* Animation */
            @keyframes apple-pulse {
                0% {
                    box-shadow: 0 8px 25px rgba(0, 122, 255, 0.3), 0 3px 10px rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(0, 122, 255, 0.7);
                }
                70% {
                    box-shadow: 0 8px 25px rgba(0, 122, 255, 0.3), 0 3px 10px rgba(0, 0, 0, 0.1), 0 0 0 15px rgba(0, 122, 255, 0);
                }
                100% {
                    box-shadow: 0 8px 25px rgba(0, 122, 255, 0.3), 0 3px 10px rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(0, 122, 255, 0);
                }
            }

            .gdrive-floating-icon.pulse {
                animation: apple-pulse 2.5s infinite !important;
            }

            /* Responsive */
            @media (max-width: 480px) {
                .gdrive-popup-panel, .gdrive-instruction-popup {
                    width: calc(100vw - 48px) !important;
                    right: 24px !important;
                }
            }

            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
                .gdrive-popup-panel, .gdrive-instruction-popup {
                    background: rgba(28, 28, 30, 0.95) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                }

                .gdrive-panel-header, .gdrive-instruction-header {
                    background: rgba(44, 44, 46, 0.8) !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
                }

                .gdrive-panel-title, .gdrive-instruction-header {
                    color: #f2f2f7 !important;
                }

                .gdrive-input-label {
                    color: #f2f2f7 !important;
                }

                .gdrive-url-input {
                    background: rgba(44, 44, 46, 0.8) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: #f2f2f7 !important;
                }

                .gdrive-url-input:focus {
                    background: rgba(44, 44, 46, 0.95) !important;
                }

                .gdrive-instruction-content {
                    background: rgba(44, 44, 46, 0.95) !important;
                    color: #f2f2f7 !important;
                }

                .gdrive-instruction-content li,
                .gdrive-instruction-content strong {
                    color: #f2f2f7 !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Show floating icon
    function showFloatingIcon() {
        if (floatingIcon && isButtonEnabled) {
            floatingIcon.classList.add('visible');
            setTimeout(() => {
                if (isButtonEnabled) {
                    floatingIcon.classList.add('pulse');
                }
            }, 1000);
        }
    }

    // Hide floating icon
    function hideFloatingIcon() {
        if (floatingIcon) {
            floatingIcon.classList.remove('visible', 'pulse');
            if (isPanelVisible) {
                closePanel();
            }
        }
    }

    // Create Apple-style floating icon
    function createFloatingIcon() {
        floatingIcon = document.createElement('button');
        floatingIcon.className = 'gdrive-floating-icon';
        floatingIcon.innerHTML = '<div class="gdrive-download-icon"></div>';
        floatingIcon.title = 'Google Drive Downloader';
        floatingIcon.onclick = togglePanel;
        document.body.appendChild(floatingIcon);

        if (isButtonEnabled) {
            showFloatingIcon();
        }
    }

    // Create instruction popup
    function createInstructionPopup() {
        instructionPopup = document.createElement('div');
        instructionPopup.className = 'gdrive-instruction-popup';
        instructionPopup.innerHTML = `
            <div class="gdrive-instruction-header">
                How to get the request URL?
                <button class="gdrive-close-btn" id="gdrive-instruction-close">×</button>
            </div>
            <div class="gdrive-instruction-content">
                <ol>
                    <li>Open <strong>Developer Tools</strong> by pressing <code>F12</code></li>
                    <li>Click on the <strong>Network</strong> tab</li>
                    <li>Play video and <strong>change quality</strong> (720p → 480p)</li>
                    <li>Copy the newest <strong>videoplayback</strong> URL from the list</li>
                </ol>
            </div>
        `;
        document.body.appendChild(instructionPopup);
    }

    // Create popup panel
    function createPopupPanel() {
        downloadPanel = document.createElement('div');
        downloadPanel.className = 'gdrive-popup-panel';
        downloadPanel.innerHTML = `
            <div class="gdrive-panel-header">
                <h3 class="gdrive-panel-title">
                    <div class="gdrive-download-icon" style="transform: scale(0.8);"></div>
                    GDrive Video & Audio Downloader
                </h3>
                <div class="gdrive-header-controls">
                    <button class="gdrive-help-btn" id="gdrive-help-btn">Instructions</button>
                    <button class="gdrive-close-btn" id="gdrive-close-btn">×</button>
                </div>
            </div>
            <div class="gdrive-panel-content">
                <label class="gdrive-input-label">Paste videoplayback URL</label>
                <div class="gdrive-instruction-text">
                    Paste to below the Google Drive video Request URL from network console to detect if it's video or audio and download it!
                </div>
                <textarea
                    class="gdrive-url-input"
                    id="gdrive-url-input"
                    placeholder="Paste your Google Drive videoplayback Request URL here...

Example:
https://rr5---sn-30a7ynl7.c.drive.google.com/videoplayback?expire=...&itag=140&mime=audio/mp4..."
                ></textarea>

                <div class="gdrive-detection-result empty" id="gdrive-detection-result">
                    <span>🔍</span>
                    <span>Paste a URL above to detect type</span>
                </div>

                <div class="gdrive-button-group">
                    <button class="gdrive-btn gdrive-btn-secondary" id="gdrive-detect-btn">
                        <span>🔍</span>
                        <span>Detect</span>
                    </button>
                    <button class="gdrive-btn gdrive-btn-primary" id="gdrive-download-btn" disabled>
                        <div class="gdrive-download-icon" style="transform: scale(0.7);"></div>
                        <span>Download</span>
                    </button>
                    <button class="gdrive-btn gdrive-btn-outline" id="gdrive-clear-btn">
                        <span>×</span>
                        <span>Clear</span>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(downloadPanel);
    }

    // UPDATED: Toggle instruction popup
    function toggleInstructionPopup() {
        const helpBtn = document.getElementById('gdrive-help-btn');

        if (isInstructionVisible) {
            // Hide instruction popup
            instructionPopup.classList.remove('visible');
            helpBtn.classList.remove('active');
            isInstructionVisible = false;
            console.log('Hiding instruction popup...');
        } else {
            // Show instruction popup
            instructionPopup.classList.add('visible');
            helpBtn.classList.add('active');
            isInstructionVisible = true;
            console.log('Showing instruction popup...');
        }
    }

    // Close instruction popup
    function closeInstructionPopup() {
        const helpBtn = document.getElementById('gdrive-help-btn');
        instructionPopup.classList.remove('visible');
        helpBtn.classList.remove('active');
        isInstructionVisible = false;
        console.log('Closing instruction popup...');
    }

    // Setup event listeners after DOM is ready
    function setupEventListeners() {
        // Main panel event listeners
        const detectBtn = document.getElementById('gdrive-detect-btn');
        const downloadBtn = document.getElementById('gdrive-download-btn');
        const clearBtn = document.getElementById('gdrive-clear-btn');
        const closeBtn = document.getElementById('gdrive-close-btn');
        const helpBtn = document.getElementById('gdrive-help-btn');
        const urlInput = document.getElementById('gdrive-url-input');

        if (detectBtn) detectBtn.onclick = detectUrlType;
        if (downloadBtn) downloadBtn.onclick = downloadUrl;
        if (clearBtn) clearBtn.onclick = clearInput;
        if (closeBtn) closeBtn.onclick = closePanel;
        if (helpBtn) {
            helpBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Help button clicked!');
                toggleInstructionPopup();
            };
        }
        if (urlInput) {
            urlInput.oninput = onInputChange;
            urlInput.addEventListener('input', autoResizeTextarea);
        }

        // Instruction popup close button
        const instructionCloseBtn = document.getElementById('gdrive-instruction-close');
        if (instructionCloseBtn) {
            instructionCloseBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Instruction close button clicked!');
                closeInstructionPopup();
            };
        }

        console.log('Event listeners setup complete');
    }

    // Auto-resize textarea based on content
    function autoResizeTextarea() {
        const textarea = document.getElementById('gdrive-url-input');
        if (!textarea) return;

        textarea.style.height = '100px';
        const scrollHeight = textarea.scrollHeight;
        const maxHeight = 200;
        const minHeight = 100;

        if (scrollHeight > minHeight) {
            textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
        }
    }

    // Toggle panel visibility
    function togglePanel() {
        isPanelVisible = !isPanelVisible;
        if (isPanelVisible) {
            downloadPanel.classList.add('visible');
            floatingIcon.classList.remove('pulse');
        } else {
            downloadPanel.classList.remove('visible');
            // Also close instruction popup when main panel closes
            if (isInstructionVisible) {
                closeInstructionPopup();
            }
        }
    }

    // Close panel
    function closePanel() {
        isPanelVisible = false;
        downloadPanel.classList.remove('visible');
        // Also close instruction popup when main panel closes
        if (isInstructionVisible) {
            closeInstructionPopup();
        }
    }

    let detectedUrl = null;
    let detectedType = null;

    // Detect URL type
    function detectUrlType() {
        const input = document.getElementById('gdrive-url-input').value.trim();
        const resultDiv = document.getElementById('gdrive-detection-result');
        const downloadBtn = document.getElementById('gdrive-download-btn');

        if (!input) {
            resultDiv.innerHTML = '<span>⚠️</span><span>Please paste a URL first</span>';
            resultDiv.className = 'gdrive-detection-result error';
            downloadBtn.disabled = true;
            return;
        }

        try {
            const url = new URL(input);
            const itag = url.searchParams.get('itag');
            const mime = url.searchParams.get('mime');
            const clen = url.searchParams.get('clen');

            if (!itag || !mime) {
                resultDiv.innerHTML = '<span>❌</span><span>Invalid Google Drive URL - missing parameters</span>';
                resultDiv.className = 'gdrive-detection-result error';
                downloadBtn.disabled = true;
                return;
            }

            const cleanUrl = cleanUrlForDownload(input);

            let type = 'unknown';
            let quality = '';
            let icon = '';

            if (mime.includes('audio/mp4')) {
                type = 'audio';
                icon = '🔊';
                if (itag === '140') quality = '128k AAC';
                else if (itag === '141') quality = '256k AAC';
                else quality = `Audio (${itag})`;
            } else if (mime.includes('video/mp4')) {
                type = 'video';
                icon = '🎥';
                if (itag === '136') quality = '720p MP4';
                else if (itag === '137') quality = '1080p MP4';
                else if (itag === '298') quality = '720p60 MP4';
                else if (itag === '299') quality = '1080p60 MP4';
                else quality = `Video (${itag})`;
            }

            if (type === 'unknown') {
                resultDiv.innerHTML = '<span>❓</span><span>Unknown file type detected</span>';
                resultDiv.className = 'gdrive-detection-result error';
                downloadBtn.disabled = true;
                return;
            }

            const sizeText = clen ? ` • ${(parseInt(clen) / 1024 / 1024).toFixed(1)} MB` : '';

            resultDiv.innerHTML = `<span>${icon}</span><span>${type.toUpperCase()} detected: ${quality}${sizeText}</span>`;
            resultDiv.className = `gdrive-detection-result ${type}`;

            detectedUrl = cleanUrl;
            detectedType = type;
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = `<div class="gdrive-download-icon" style="transform: scale(0.7);"></div><span>Download ${type.toUpperCase()}</span>`;

        } catch (error) {
            resultDiv.innerHTML = '<span>❌</span><span>Invalid URL format</span>';
            resultDiv.className = 'gdrive-detection-result error';
            downloadBtn.disabled = true;
        }
    }

    // Clean URL for download
    function cleanUrlForDownload(url) {
        try {
            const urlObj = new URL(url);
            const paramsToRemove = [
                'range', 'rn', 'rbuf', 'cpn', 'c', 'cver', 'srfvp', 'ump', 'alr'
            ];
            paramsToRemove.forEach(param => {
                urlObj.searchParams.delete(param);
            });
            return urlObj.toString();
        } catch (error) {
            return url;
        }
    }

    // Download the URL
    function downloadUrl() {
        if (!detectedUrl || !detectedType) {
            alert('Please detect the URL type first');
            return;
        }

        const a = document.createElement('a');
        a.href = detectedUrl;
        a.download = detectedType === 'video' ? 'gdrive_video.mp4' : 'gdrive_audio.m4a';
        a.target = '_blank';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        const resultDiv = document.getElementById('gdrive-detection-result');
        const originalHTML = resultDiv.innerHTML;
        const originalClass = resultDiv.className;

        resultDiv.innerHTML = '<span>✅</span><span>Download started! Check your downloads folder.</span>';
        resultDiv.className = 'gdrive-detection-result video';

        setTimeout(() => {
            resultDiv.innerHTML = originalHTML;
            resultDiv.className = originalClass;
        }, 3000);
    }

    // Clear input
    function clearInput() {
        const textarea = document.getElementById('gdrive-url-input');
        textarea.value = '';
        textarea.style.height = '100px';

        document.getElementById('gdrive-detection-result').innerHTML = '<span>🔍</span><span>Paste a URL above to detect type</span>';
        document.getElementById('gdrive-detection-result').className = 'gdrive-detection-result empty';
        document.getElementById('gdrive-download-btn').disabled = true;
        document.getElementById('gdrive-download-btn').innerHTML = '<div class="gdrive-download-icon" style="transform: scale(0.7);"></div><span>Download</span>';
        detectedUrl = null;
        detectedType = null;
    }

    // Auto-detect when input changes
    function onInputChange() {
        const input = document.getElementById('gdrive-url-input').value.trim();
        if (input && input.includes('videoplayback')) {
            setTimeout(detectUrlType, 500);
        }
    }

    // Close panels when clicking outside
    function handleOutsideClick(event) {
        if (isPanelVisible &&
            !downloadPanel.contains(event.target) &&
            !floatingIcon.contains(event.target)) {
            closePanel();
        }

        if (isInstructionVisible && instructionPopup &&
            !instructionPopup.contains(event.target) &&
            !document.getElementById('gdrive-help-btn').contains(event.target)) {
            closeInstructionPopup();
        }
    }

    // Initialize
    function initialize() {
        createStyles();
        createFloatingIcon();
        createInstructionPopup();
        createPopupPanel();

        setTimeout(setupEventListeners, 100);

        document.addEventListener('click', handleOutsideClick);

        console.log('🍎 Apple-style Drive Downloader v9 ready!');
        console.log(`Button status: ${isButtonEnabled ? 'Enabled' : 'Disabled'}`);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
