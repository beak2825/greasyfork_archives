// ==UserScript==
// @name         Telegram Chat Manager - Deleted Annoying Joined Chat (by AFU IT)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-delete contact joined Telegram chats.
// @author       AFU IT
// @telegram     https://t.me/afuituserscript
// @match        https://web.telegram.org/k*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538384/Telegram%20Chat%20Manager%20-%20Deleted%20Annoying%20Joined%20Chat%20%28by%20AFU%20IT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538384/Telegram%20Chat%20Manager%20-%20Deleted%20Annoying%20Joined%20Chat%20%28by%20AFU%20IT%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false;
    let shouldStop = false;
    let isExpanded = false;
    let autoDeleteEnabled = true;

    // Wait for page to load
    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                obs.disconnect();
                callback(element);
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    // Navigate to Telegram's notification settings automatically
    function openTelegramNotificationSettings() {
        logStatus('🔧 Opening Telegram notification settings...');

        // Step 1: Click hamburger menu
        const menuButton = document.querySelector('.btn-icon.rp.btn-menu-toggle') ||
                          document.querySelector('.sidebar-header .btn-icon') ||
                          document.querySelector('[data-testid="hamburger-menu"]');

        if (menuButton) {
            menuButton.click();
            logStatus('📱 Opened main menu');

            setTimeout(() => {
                // Step 2: Click Settings
                const settingsButton = Array.from(document.querySelectorAll('.btn-menu-item .i18n')).find(el =>
                    el.textContent.includes('Settings')
                ) || Array.from(document.querySelectorAll('.btn-menu-item-text')).find(el =>
                    el.textContent.includes('Settings')
                );

                if (settingsButton) {
                    settingsButton.closest('.btn-menu-item').click();
                    logStatus('⚙️ Opened Settings');

                    setTimeout(() => {
                        // Step 3: Click Notifications and Sounds
                        const notificationsButton = Array.from(document.querySelectorAll('.row-title .i18n')).find(el =>
                            el.textContent.includes('Notifications and Sounds') || el.textContent.includes('Notifications')
                        );

                        if (notificationsButton) {
                            notificationsButton.closest('.row').click();
                            logStatus('🔔 Opened Notifications settings');
                        } else {
                            logStatus('❌ Could not find Notifications option');
                        }
                    }, 800);
                } else {
                    logStatus('❌ Could not find Settings option');
                }
            }, 500);
        } else {
            logStatus('❌ Could not find menu button');
        }
    }

    function logStatus(message) {
        const statusLog = document.getElementById('status-log');
        if (statusLog) {
            const timestamp = new Date().toLocaleTimeString();
            statusLog.innerHTML += `<div style="margin-bottom: 2px; opacity: 0.9;">[${timestamp}] ${message}</div>`;
            statusLog.scrollTop = statusLog.scrollHeight;
        }
        console.log(message);
    }

    // Create compact round control panel
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'telegram-manager-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        panel.innerHTML = `
            <!-- Round Toggle Button -->
            <div id="round-toggle" style="
                width: 56px;
                height: 56px;
                background: linear-gradient(135deg, #ff4757, #ff3742);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 16px rgba(255, 71, 87, 0.4);
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 255, 255, 0.2);
                position: relative;
            ">
                <span style="font-size: 24px;">🧹</span>
                <div id="status-indicator" style="
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    width: 16px;
                    height: 16px;
                    background: #2ed573;
                    border-radius: 50%;
                    border: 2px solid white;
                    transition: all 0.3s ease;
                "></div>
            </div>

            <!-- Overlay Panel -->
            <div id="overlay-panel" style="
                position: absolute;
                top: 0;
                right: 0;
                background: rgba(30, 30, 30, 0.85);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 20px;
                border-radius: 16px;
                min-width: 320px;
                transform: scale(0) translateX(20px);
                transform-origin: top right;
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                opacity: 0;
                pointer-events: none;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
                display: flex;
                flex-direction: column;
                height: auto;
            ">
                <!-- Header -->
                <div style="font-weight: 600; margin-bottom: 16px; color: #ffffff; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                    <span>🧹</span>
                    <span>Chat Cleaner</span>
                    <div id="close-overlay" style="
                        margin-left: auto;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.1);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        font-size: 14px;
                        transition: background 0.2s ease;
                    ">×</div>
                </div>

                <!-- Main Buttons -->
                <button id="delete-joined-chats" class="tg-button tg-button-danger" style="width: 100%; margin-bottom: 12px;">
                    <span class="tg-button-icon">🗑️</span>
                    <span>Clean "Joined" Chats</span>
                </button>

                <button id="stop-process" class="tg-button tg-button-warning" style="width: 100%; display: none; margin-bottom: 12px;">
                    <span class="tg-button-icon">⏹️</span>
                    <span>Stop Process</span>
                </button>

                <div id="status-log" style="
                    font-size: 11px;
                    max-height: 120px;
                    overflow-y: auto;
                    background: rgba(0, 0, 0, 0.3);
                    padding: 10px;
                    border-radius: 8px;
                    color: #cccccc;
                    line-height: 1.4;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    margin-bottom: 16px;
                ">
                    Ready to clean chats silently...
                </div>

                <!-- Bottom Settings Button -->
                <div id="bottom-container" style="
                    margin-top: auto;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 16px;
                ">
                    <!-- Settings Button -->
                    <button id="open-settings-btn" style="
                        background: rgba(139, 92, 246, 0.2);
                        border: 1px solid #8b5cf6;
                        color: #8b5cf6;
                        padding: 12px;
                        border-radius: 8px;
                        font-size: 13px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        width: 100%;
                        font-weight: 500;
                    ">
                        ⚙️ Open Telegram Settings
                    </button>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .tg-button {
                background: #0088cc;
                color: white;
                border: none;
                border-radius: 8px;
                padding: 10px 14px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                transition: all 0.2s ease;
                font-family: inherit;
                position: relative;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            }

            .tg-button:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
            }

            .tg-button:active {
                transform: translateY(0);
            }

            .tg-button-danger {
                background: linear-gradient(135deg, #ff4757, #ff3742);
            }

            .tg-button-danger:hover {
                background: linear-gradient(135deg, #ff3742, #ff2f3a);
                box-shadow: 0 4px 16px rgba(255, 71, 87, 0.4);
            }

            .tg-button-danger:disabled {
                background: #666;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }

            .tg-button-warning {
                background: linear-gradient(135deg, #ffa502, #ff9500);
            }

            .tg-button-warning:hover {
                background: linear-gradient(135deg, #ff9500, #ff8c00);
                box-shadow: 0 4px 16px rgba(255, 165, 2, 0.4);
            }

            .tg-button-icon {
                font-size: 14px;
            }

            #round-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(255, 71, 87, 0.6);
            }

            #round-toggle:active {
                transform: scale(0.95);
            }

            #close-overlay:hover {
                background: rgba(255, 255, 255, 0.2) !important;
            }

            #open-settings-btn:hover {
                background: rgba(139, 92, 246, 0.3) !important;
                transform: translateY(-1px);
            }

            #status-log::-webkit-scrollbar {
                width: 4px;
            }

            #status-log::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
            }

            #status-log::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 2px;
            }

            /* Hide all UI elements during silent operation */
            .silent-mode .btn-menu.contextmenu,
            .silent-mode .popup-delete-chat,
            .silent-mode .popup {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(panel);

        // Add event listeners for toggle functionality
        setupToggleListeners();

        return panel;
    }

    function setupToggleListeners() {
        const roundToggle = document.getElementById('round-toggle');
        const overlayPanel = document.getElementById('overlay-panel');
        const closeOverlay = document.getElementById('close-overlay');
        const openSettingsBtn = document.getElementById('open-settings-btn');

        roundToggle.addEventListener('click', toggleOverlay);
        closeOverlay.addEventListener('click', hideOverlay);
        openSettingsBtn.addEventListener('click', openTelegramNotificationSettings);

        // Close overlay when clicking outside
        document.addEventListener('click', (e) => {
            if (isExpanded && !document.getElementById('telegram-manager-panel').contains(e.target)) {
                hideOverlay();
            }
        });
    }

    function toggleOverlay() {
        if (isExpanded) {
            hideOverlay();
        } else {
            showOverlay();
        }
    }

    function showOverlay() {
        const overlayPanel = document.getElementById('overlay-panel');
        const roundToggle = document.getElementById('round-toggle');

        isExpanded = true;
        overlayPanel.style.transform = 'scale(1) translateX(0)';
        overlayPanel.style.opacity = '1';
        overlayPanel.style.pointerEvents = 'auto';

        roundToggle.style.opacity = '0.3';
    }

    function hideOverlay() {
        const overlayPanel = document.getElementById('overlay-panel');
        const roundToggle = document.getElementById('round-toggle');

        isExpanded = false;
        overlayPanel.style.transform = 'scale(0) translateX(20px)';
        overlayPanel.style.opacity = '0';
        overlayPanel.style.pointerEvents = 'none';

        roundToggle.style.opacity = '1';
    }

    // Hide all UI elements (context menus, popups, etc.)
    function hideAllUIElements() {
        const contextMenus = document.querySelectorAll('.btn-menu.contextmenu, .contextmenu');
        contextMenus.forEach(menu => {
            menu.style.display = 'none';
            menu.style.visibility = 'hidden';
            menu.style.opacity = '0';
            menu.style.pointerEvents = 'none';
        });

        const popups = document.querySelectorAll('.popup-delete-chat, .popup');
        popups.forEach(popup => {
            popup.style.display = 'none';
            popup.style.visibility = 'hidden';
            popup.style.opacity = '0';
            popup.style.pointerEvents = 'none';
        });
    }

    // Monitor and hide all UI elements immediately
    function startSilentUIHandler() {
        document.body.classList.add('silent-mode');

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.classList && (node.classList.contains('btn-menu') || node.classList.contains('contextmenu'))) {
                            hideUIElement(node);
                            handleContextMenuSilently(node);
                        }
                        else if (node.classList && node.classList.contains('popup-delete-chat')) {
                            hideUIElement(node);
                            handlePopupSilently(node);
                        }
                        else if (node.querySelector) {
                            const contextMenu = node.querySelector('.btn-menu.contextmenu, .contextmenu');
                            if (contextMenu) {
                                hideUIElement(contextMenu);
                                handleContextMenuSilently(contextMenu);
                            }

                            const popup = node.querySelector('.popup-delete-chat');
                            if (popup) {
                                hideUIElement(popup);
                                handlePopupSilently(popup);
                            }
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setInterval(() => {
            hideAllUIElements();

            const contextMenu = document.querySelector('.btn-menu.contextmenu.active');
            if (contextMenu) {
                handleContextMenuSilently(contextMenu);
            }

            const popup = document.querySelector('.popup-delete-chat.active');
            if (popup) {
                handlePopupSilently(popup);
            }
        }, 50);
    }

    function hideUIElement(element) {
        if (element && element.style) {
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.style.opacity = '0';
            element.style.pointerEvents = 'none';
            element.style.zIndex = '-9999';
        }
    }

    function handleContextMenuSilently(contextMenu) {
        if (!contextMenu) return;

        hideUIElement(contextMenu);

        setTimeout(() => {
            const deleteOption = contextMenu.querySelector('.btn-menu-item.danger');
            if (deleteOption) {
                deleteOption.click();
                logStatus('🔇 Context menu handled silently');
            }
        }, 10);
    }

    function handlePopupSilently(popup) {
        if (!popup) return;

        hideUIElement(popup);

        setTimeout(() => {
            const checkbox = popup.querySelector('.checkbox-field-input');
            if (checkbox && !checkbox.checked) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            }

            const deleteButton = popup.querySelector('.popup-button.btn.danger');
            if (deleteButton) {
                deleteButton.click();
                logStatus('✅ Chat deleted silently');
            }
        }, 10);
    }

    // Enhanced silent delete function
    async function silentDeleteChat(chatElement) {
        return new Promise((resolve) => {
            const peerId = chatElement.dataset.peerId;

            if (window.appImManager && window.appImManager.deleteDialog) {
                try {
                    window.appImManager.deleteDialog(peerId, true, true);
                    logStatus(`🔇 API deleted chat ${peerId}`);
                    resolve(true);
                    return;
                } catch (e) {
                    // Fallback to UI method
                }
            }

            const rect = chatElement.getBoundingClientRect();

            chatElement.dispatchEvent(new MouseEvent('contextmenu', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2
            }));

            setTimeout(() => resolve(true), 200);
        });
    }

    // Main deletion function
    async function deleteJoinedTelegramChats() {
        if (isRunning) {
            logStatus('⚠️ Process already running');
            return;
        }

        isRunning = true;
        shouldStop = false;

        const deleteBtn = document.getElementById('delete-joined-chats');
        const stopBtn = document.getElementById('stop-process');
        const roundToggle = document.getElementById('round-toggle');

        deleteBtn.style.display = 'none';
        stopBtn.style.display = 'block';

        // Change round button to indicate running state
        roundToggle.innerHTML = '<span style="font-size: 24px;">⚡</span>';
        roundToggle.style.background = 'linear-gradient(135deg, #ffa502, #ff9500)';

        startSilentUIHandler();

        const chatItems = document.querySelectorAll('.chatlist-chat');
        let deletedCount = 0;
        let foundCount = 0;

        logStatus(`🔍 Scanning ${chatItems.length} chats for "joined Telegram" messages...`);

        for (let i = 0; i < chatItems.length && !shouldStop; i++) {
            const chat = chatItems[i];
            const joinedSpans = chat.querySelectorAll('span.i18n');
            let hasJoinedMessage = false;

            joinedSpans.forEach(span => {
                if (span.textContent.includes('joined Telegram')) {
                    hasJoinedMessage = true;
                    const peerName = span.querySelector('.peer-title')?.textContent || 'Unknown';
                    logStatus(`📱 Found: ${peerName} joined Telegram`);
                }
            });

            if (hasJoinedMessage && !shouldStop) {
                foundCount++;
                logStatus(`🗑️ Silently deleting chat ${foundCount}...`);

                const success = await silentDeleteChat(chat);
                if (success) {
                    deletedCount++;
                }

                await new Promise(resolve => setTimeout(resolve, 150));
            }
        }

        // Reset UI
        isRunning = false;
        document.body.classList.remove('silent-mode');
        deleteBtn.style.display = 'block';
        stopBtn.style.display = 'none';

        // Reset round button
        roundToggle.innerHTML = '<span style="font-size: 24px;">🧹</span>';
        roundToggle.style.background = 'linear-gradient(135deg, #ff4757, #ff3742)';

        if (shouldStop) {
            logStatus(`⏹️ Process stopped by user. Deleted ${deletedCount} of ${foundCount} found chats`);
        } else {
            logStatus(`✅ Process complete! Found ${foundCount} "joined Telegram" chats, successfully deleted ${deletedCount}`);
        }
    }

    function stopProcess() {
        shouldStop = true;
        document.body.classList.remove('silent-mode');
        logStatus('🛑 Stopping process...');
    }

    // Initialize the script
    function init() {
        waitForElement('.chatlist-container, #column-left', () => {
            const panel = createControlPanel();

            document.getElementById('delete-joined-chats').addEventListener('click', deleteJoinedTelegramChats);
            document.getElementById('stop-process').addEventListener('click', stopProcess);

            logStatus('🚀 Simplified Chat Cleaner loaded');
            logStatus('⚙️ Use "Open Telegram Settings" to access notifications');
        });
    }

    // Start the script
    init();
})();
