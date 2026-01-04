// ==UserScript==
// @name         Character.AI Follower Tracker (Updated)
// @namespace    http://tampermonkey.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=character.ai
// @version      2.0
// @description  Popup to show who unfollowed you on Character.AI! (Updated for new design)
// @author       Kio + Claude + Gemini 💗
// @match        https://character.ai/*
// @match        *://character.ai/*
// @match        https://character.ai/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540260/CharacterAI%20Follower%20Tracker%20%28Updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540260/CharacterAI%20Follower%20Tracker%20%28Updated%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[CAI Tracker v2.0] Script loaded');

    // --- S T Y L E S ---
    const styleSheet = `
        @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap');

        .cai-tracker-panel, .cai-results-popup {
            position: fixed; z-index: 99999 !important;
            background: #f5f3ff; color: #6d28d9;
            border: 2px solid #ddd6fe; border-radius: 20px;
            padding: 25px; box-shadow: 0 10px 50px rgba(196, 181, 253, 0.5);
            font-family: 'Ubuntu', sans-serif;
            transition: transform 0.3s ease-in-out;
        }
        .cai-tracker-panel:hover, .cai-results-popup:hover {
             transform: translateY(-5px);
        }

        .cai-tracker-panel {
            bottom: 20px; right: 20px;
            width: 380px; text-align: center;
        }
        .cai-tracker-panel h2 {
            font-weight: 700; color: #8b5cf6;
            margin: 0 0 10px 0; font-size: 1.5rem;
        }
        .cai-tracker-panel p { font-size: 0.9rem; line-height: 1.4; color: #7c3aed; margin: 0 0 15px 0; }

        .cai-manual-button {
            background-image: linear-gradient(135deg, #e4d4f7, #d1c2f0);
            color: #5b21b6; border: none; padding: 12px 18px; width: 100%;
            border-radius: 12px; cursor: pointer; font-size: 1rem;
            font-weight: 700; transition: all 0.3s ease; margin-top: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .cai-manual-button:hover { transform: scale(1.03); background-image: linear-gradient(135deg, #d1c2f0, #c4b5fd); }
        .cai-manual-button.ready { background-image: linear-gradient(135deg, #34d399, #22c55e); color: white; }
        .cai-manual-button.capturing {
            background-image: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: white;
            animation: pulse 2s infinite;
        }
        .cai-manual-button:disabled {
            background-image: none; background-color: #e9d5ff;
            cursor: not-allowed; opacity: 0.7; color: #9ca3af;
        }

        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }

        .cai-status-text {
            margin-top: 15px; font-size: 0.9rem; font-weight: 700;
        }
        .cai-status-ok { color: #22c55e; }
        .cai-status-not-ok { color: #ef4444; }
        .cai-status-capturing { color: #f59e0b; }

        .cai-tracker-close-btn {
            position: absolute; top: 10px; right: 15px; background: none;
            border: none; color: #c4b5fd; font-size: 1.8rem; cursor: pointer;
            transition: transform 0.2s;
        }
        .cai-tracker-close-btn:hover { transform: scale(1.2); }

        .cai-tracker-toggle-btn {
            position: fixed; bottom: 20px; right: 20px; z-index: 99998 !important;
            background: linear-gradient(135deg, #e4d4f7, #d1c2f0, #c4b5fd);
            border: none; border-radius: 50%; width: 60px; height: 60px;
            cursor: pointer; font-size: 2rem; color: #5b21b6;
            box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
            transition: all 0.3s ease;
        }
        .cai-tracker-toggle-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 35px rgba(139, 92, 246, 0.6);
            background: linear-gradient(135deg, #d1c2f0, #c4b5fd, #a78bfa);
        }

        .cai-results-popup {
            top: 10%; right: 20px; max-height: 80vh; overflow-y: auto;
            width: 320px;
            background: linear-gradient(135deg, #f5f3ff, #ede9fe);
            background-size: 200% 200%;
            animation: pan-background 10s ease infinite;
        }
        @keyframes pan-background { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

        .cai-results-row { display: flex; align-items: center; margin-bottom: 8px; padding: 8px; border-radius: 10px; transition: background-color 0.2s; }
        .cai-results-row:hover { background-color: rgba(255,255,255,0.5); }
        .cai-results-row img { width: 40px; height: 40px; border-radius: 50%; margin-right: 12px; border: 2px solid #ddd6fe; }
        .cai-results-row span { color: #5b21b6; font-weight: 700; }

        .cai-toast-notification {
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            padding: 12px 25px; border-radius: 50px; font-family: 'Ubuntu', sans-serif;
            font-size: 1rem; font-weight: 700; color: white; z-index: 99999 !important;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2); opacity: 0;
            transition: opacity 0.4s ease, top 0.4s ease;
        }
        .cai-toast-notification.success { background-image: linear-gradient(to right, #34d399, #22c55e); }
        .cai-toast-notification.error { background-image: linear-gradient(to right, #f87171, #ef4444); }
        .cai-toast-notification.info { background-image: linear-gradient(to right, #60a5fa, #3b82f6); }
        .cai-toast-notification.show { top: 40px; opacity: 1; }

        .cai-debug-info {
            margin-top: 15px; padding: 10px; background: rgba(139, 92, 246, 0.1);
            border-radius: 8px; font-size: 0.75rem; color: #7c3aed;
            max-height: 100px; overflow-y: auto;
        }
    `;
    document.head.appendChild(document.createElement('style')).innerHTML = styleSheet;

    const APP_PREFIX = 'cai_tracker_v20_';
    let captureMode = null;
    let panelVisible = false;
    let isCapturing = false;
    let preparedMode = null;
    let modalObserver = null;

    // --- Toast Notification Function ---
    function showToast(message, type = 'success') {
        console.log(`[CAI Tracker] Toast: ${type} - ${message}`);
        const toast = document.createElement('div');
        toast.className = `cai-toast-notification ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // --- ENHANCED MODAL DETECTION ---
    function startModalWatcher() {
        stopModalWatcher();
        console.log('[CAI Tracker] Starting modal watcher...');

        modalObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        // Multiple detection strategies for new C.AI design
                        const isModal = 
                            node.querySelector?.('div[role="dialog"]') ||
                            node.getAttribute?.('role') === 'dialog' ||
                            node.querySelector?.('[role="dialog"]') ||
                            node.querySelector?.('div[class*="modal"]') ||
                            node.querySelector?.('div[class*="Modal"]') ||
                            node.querySelector?.('div[class*="dialog"]') ||
                            node.querySelector?.('div[class*="Dialog"]') ||
                            node.querySelector?.('div[class*="overlay"]') ||
                            node.querySelector?.('div[class*="Overlay"]') ||
                            (node.className && typeof node.className === 'string' && 
                             (node.className.includes('modal') || 
                              node.className.includes('Modal') ||
                              node.className.includes('dialog') ||
                              node.className.includes('Dialog')));

                        if (isModal) {
                            console.log('[CAI Tracker] ✅ Modal detected!', node);
                            setTimeout(() => {
                                if (preparedMode) {
                                    console.log('[CAI Tracker] Starting capture for:', preparedMode);
                                    const currentMode = preparedMode;
                                    resetPreparedMode();
                                    captureAllUsers(currentMode);
                                }
                            }, 2500);
                        }
                    }
                });
            });
        });

        modalObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('[CAI Tracker] Modal watcher active');
    }

    function stopModalWatcher() {
        if (modalObserver) {
            modalObserver.disconnect();
            modalObserver = null;
            console.log('[CAI Tracker] Modal watcher stopped');
        }
    }

    function prepareForCapture(type) {
        console.log('[CAI Tracker] Preparing for capture:', type);
        preparedMode = type;
        const btn = document.getElementById(`prepare-${type}-btn`);
        const instructionEl = document.getElementById('instruction-text');
        const instructionContent = document.getElementById('instruction-content');

        if (btn) {
            btn.classList.add('ready');
            btn.textContent = `✅ Ready! Now open your ${type} list`;
        }

        if (instructionEl && instructionContent) {
            instructionContent.textContent = `Now click on "${type}" in someone's profile to open the list. Capture will start automatically!`;
            instructionEl.style.display = 'block';
        }

        showToast(`Ready to capture ${type}! Now open the ${type} list.`, 'success');
        startModalWatcher();

        setTimeout(() => {
            if (preparedMode === type) {
                resetPreparedMode();
                showToast(`Preparation timeout. Click "Prepare" again if needed.`, 'info');
            }
        }, 60000);
    }

    function resetPreparedMode() {
        const oldMode = preparedMode;
        preparedMode = null;

        if (oldMode) {
            const btn = document.getElementById(`prepare-${oldMode}-btn`);
            if (btn) {
                btn.classList.remove('ready');
                btn.textContent = `${oldMode === 'followers' ? '1' : '2'}. Prepare for ${oldMode.charAt(0).toUpperCase() + oldMode.slice(1)}`;
            }
        }

        const instructionEl = document.getElementById('instruction-text');
        if (instructionEl) {
            instructionEl.style.display = 'none';
        }

        stopModalWatcher();
    }

    // --- ENHANCED CAPTURE LOGIC ---
    async function captureAllUsers(listType) {
        if (isCapturing) {
            showToast("Already capturing, please wait...", 'info');
            return;
        }

        console.log('[CAI Tracker] Starting capture for:', listType);
        isCapturing = true;
        const users = new Map();
        let lastCount = 0;
        let noChangeCount = 0;
        let scrollAttempts = 0;
        const maxScrollAttempts = 150;
        const maxNoChangeAttempts = 6;

        const statusBtn = document.getElementById(`prepare-${listType}-btn`);
        const statusEl = document.getElementById(`${listType}-status`);

        if (statusBtn) {
            statusBtn.classList.add('capturing');
            statusBtn.textContent = `🔄 Capturing ${listType}... 0 found`;
        }

        if (statusEl) {
            statusEl.className = 'cai-status-capturing';
            statusEl.textContent = `${listType}: Capturing... 0 found`;
        }

        try {
            // Enhanced dialog detection for new C.AI design
            await new Promise(resolve => setTimeout(resolve, 1000));

            let dialog = document.querySelector('div[role="dialog"]');
            
            if (!dialog) {
                const allDialogs = document.querySelectorAll('[role="dialog"], [class*="modal"], [class*="Modal"], [class*="dialog"], [class*="Dialog"], [class*="overlay"], [class*="Overlay"]');
                if (allDialogs.length > 0) {
                    dialog = allDialogs[allDialogs.length - 1];
                }
            }

            if (!dialog) {
                const allDivs = document.querySelectorAll('div');
                for (const div of allDivs) {
                    const style = window.getComputedStyle(div);
                    if (style.position === 'fixed' && 
                        parseInt(style.zIndex) > 1000 &&
                        div.children.length > 0) {
                        dialog = div;
                        break;
                    }
                }
            }

            if (!dialog) {
                throw new Error("No dialog found. Make sure the followers/following list is open.");
            }

            console.log('[CAI Tracker] Dialog found:', dialog);

            // Find scrollable container with improved detection
            let scrollableContainer = findScrollableContainer(dialog);

            console.log('[CAI Tracker] Scrollable container:', scrollableContainer);
            console.log('[CAI Tracker] Starting capture loop...');

            // Capture loop with auto-scrolling
            while (scrollAttempts < maxScrollAttempts && noChangeCount < maxNoChangeAttempts) {
                const currentUsers = captureUsersFromDOM(scrollableContainer);

                currentUsers.forEach(user => {
                    if (!users.has(user.username)) {
                        users.set(user.username, user);
                    }
                });

                const currentCount = users.size;
                console.log(`[CAI Tracker] Attempt ${scrollAttempts + 1}: Found ${currentCount} users (${currentUsers.length} new)`);

                if (statusBtn) {
                    statusBtn.textContent = `🔄 Capturing ${listType}... ${currentCount} found`;
                }
                if (statusEl) {
                    statusEl.textContent = `${listType}: Capturing... ${currentCount} found`;
                }

                if (currentCount === lastCount) {
                    noChangeCount++;
                } else {
                    noChangeCount = 0;
                    lastCount = currentCount;
                }

                // Enhanced scrolling
                scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
                dialog.scrollTop = dialog.scrollHeight;
                window.scrollTo(0, document.body.scrollHeight);

                await new Promise(resolve => setTimeout(resolve, 1800));

                scrollAttempts++;

                if (noChangeCount >= maxNoChangeAttempts) {
                    console.log('[CAI Tracker] No new users found, stopping.');
                    break;
                }
            }

            const finalUsers = Array.from(users.values());
            console.log(`[CAI Tracker] ✅ Capture complete: ${finalUsers.length} users`);

            if (finalUsers.length === 0) {
                throw new Error("No users found. The page structure might have changed.");
            }

            localStorage.setItem(APP_PREFIX + listType, JSON.stringify(finalUsers));
            showToast(`Success! Captured ${finalUsers.length} ${listType}.`, 'success');

            return finalUsers;

        } catch (error) {
            console.error('[CAI Tracker] ❌ Capture error:', error);
            showToast(`Error: ${error.message}`, 'error');
            return null;
        } finally {
            isCapturing = false;

            if (statusBtn) {
                statusBtn.classList.remove('capturing');
                resetPreparedMode();
            }

            updateStatus();
        }
    }

    function findScrollableContainer(dialog) {
        // Strategy 1: Look for explicit scroll containers
        const scrollContainers = dialog.querySelectorAll('[class*="scroll"], [class*="Scroll"], [style*="overflow"]');
        for (const container of scrollContainers) {
            const style = window.getComputedStyle(container);
            if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
                if (container.scrollHeight > container.clientHeight) {
                    return container;
                }
            }
        }

        // Strategy 2: Look for containers with many children
        const allContainers = dialog.querySelectorAll('div');
        let bestContainer = dialog;
        let maxChildren = 0;

        for (const container of allContainers) {
            const childCount = container.children.length;
            if (childCount > maxChildren && childCount > 5) {
                const style = window.getComputedStyle(container);
                if (style.display !== 'none') {
                    maxChildren = childCount;
                    bestContainer = container;
                }
            }
        }

        if (bestContainer !== dialog) {
            return bestContainer;
        }

        // Strategy 3: Return dialog itself
        return dialog;
    }

    function captureUsersFromDOM(container) {
        const users = new Map();
        const processedElements = new Set();

        // Enhanced selectors for new C.AI design
        const selectors = [
            'a[href*="/profile/"]',
            'a[href*="/public-profile/"]',
            'a[href*="/@"]',
            'div[class*="user"]',
            'div[class*="User"]',
            'div[class*="profile"]',
            'div[class*="Profile"]',
            'div[class*="member"]',
            'div[class*="Member"]',
            'div[class*="avatar"]',
            'div[class*="Avatar"]',
            '[data-testid*="user"]',
            '[data-testid*="profile"]',
            'li',
            'article',
            'div > div > a',
            'div > a > div'
        ];

        selectors.forEach(selector => {
            try {
                const elements = container.querySelectorAll(selector);
                elements.forEach(element => {
                    if (processedElements.has(element)) return;
                    processedElements.add(element);

                    const userData = extractUserData(element);
                    if (userData && userData.username && !users.has(userData.username)) {
                        users.set(userData.username, userData);
                    }
                });
            } catch (e) {
                console.warn('[CAI Tracker] Selector error:', selector, e);
            }
        });

        // Fallback: aggressive scan
        if (users.size < 5) {
            const allElements = container.querySelectorAll('*');
            allElements.forEach(element => {
                if (processedElements.has(element)) return;

                const userData = extractUserData(element);
                if (userData && userData.username && !users.has(userData.username)) {
                    users.set(userData.username, userData);
                    processedElements.add(element);
                }
            });
        }

        return Array.from(users.values());
    }

    function extractUserData(element) {
        let username = '';
        let avatar = '';

        // Try href first (most reliable for new design)
        const href = element.href || element.querySelector('a')?.href;
        if (href) {
            const match = href.match(/\/(profile|public-profile)\/([^/?]+)|@([^/?]+)/);
            if (match) {
                username = match[2] || match[3];
            }
        }

        // Try text extraction
        if (!username) {
            const textSelectors = [
                '[class*="text"]',
                '[class*="Text"]',
                '[class*="name"]',
                '[class*="Name"]',
                '[class*="username"]',
                '[class*="Username"]',
                'span',
                'div',
                'p',
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
            ];

            for (const selector of textSelectors) {
                const textEl = element.querySelector(selector);
                if (textEl && textEl.textContent && textEl.textContent.trim()) {
                    const text = textEl.textContent.trim();
                    if (isValidUsername(text)) {
                        username = cleanUsername(text);
                        break;
                    }
                }
            }
        }

        // If still no username, try element's own text
        if (!username && element.textContent) {
            const text = element.textContent.trim();
            if (isValidUsername(text)) {
                username = cleanUsername(text);
            }
        }

        // Extract avatar
        const img = element.querySelector('img');
        if (img && img.src && !img.src.includes('data:image')) {
            avatar = img.src;
        }

        if (username && isValidUsername(username)) {
            return {
                username: username,
                avatar: avatar || 'https://placehold.co/40x40/f5f3ff/6d28d9?text=?'
            };
        }

        return null;
    }

    function isValidUsername(text) {
        if (!text || typeof text !== 'string') return false;

        const cleaned = text.trim();

        if (cleaned.length === 0 || cleaned.length > 50) return false;

        const excludePatterns = [
            'follow', 'following', 'followers', 'message', 'block', 'report',
            'back', 'close', 'cancel', 'ok', 'yes', 'no', 'save', 'edit',
            'delete', 'remove', 'add', 'create', 'new', 'search', 'filter',
            'sort', 'view', 'show', 'hide', 'more', 'less', 'next', 'previous',
            'loading', 'error', 'success', 'warning', 'info', 'help', 'about',
            'settings', 'profile', 'account', 'logout', 'login', 'sign',
            'register', 'submit', 'send', 'receive', 'inbox', 'notifications'
        ];

        const lowerText = cleaned.toLowerCase();
        if (excludePatterns.some(pattern => lowerText.includes(pattern))) {
            return false;
        }

        if (/^\d+$/.test(cleaned) || /^\d+\s*(followers?|following|posts?|likes?)$/i.test(cleaned)) {
            return false;
        }

        if (cleaned.includes('\n')) return false;

        if (!/[a-zA-Z0-9]/.test(cleaned)) return false;

        return true;
    }

    function cleanUsername(username) {
        if (!username) return '';

        let cleaned = username.split('\n')[0].trim();
        cleaned = cleaned.replace(/^\d+\s*[.)\-]\s*/, '');
        cleaned = cleaned.replace(/\s*\(\d+\)\s*$/, '');
        cleaned = cleaned.replace(/\s+/g, ' ').trim();

        return cleaned;
    }

    // --- UI FUNCTIONS ---
    function createToggleButton() {
        const existingBtn = document.getElementById('cai-toggle-btn');
        if (existingBtn) {
            console.log('[CAI Tracker] Toggle button already exists');
            return;
        }

        console.log('[CAI Tracker] Creating toggle button...');
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'cai-toggle-btn';
        toggleBtn.className = 'cai-tracker-toggle-btn';
        toggleBtn.innerHTML = '🔍';
        toggleBtn.title = 'Toggle Follower Tracker';

        toggleBtn.addEventListener('click', function() {
            console.log('[CAI Tracker] Toggle button clicked');
            if (panelVisible) {
                hidePanel();
            } else {
                showPanel();
            }
        });

        document.body.appendChild(toggleBtn);
        console.log('[CAI Tracker] ✅ Toggle button created successfully');
        showToast('Follower Tracker loaded! Click the 🔍 button to start.', 'info');
    }

    function showPanel() {
        console.log('[CAI Tracker] Showing panel...');
        const existingPanel = document.getElementById('cai-main-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'cai-main-panel';
        panel.className = 'cai-tracker-panel';
        panel.innerHTML = `
            <button class="cai-tracker-close-btn">&times;</button>
            <h2>Follower Balance Tool</h2>
            <p><b>How to:</b> Click "Prepare" first, then open the followers/following list. The capture will start automatically when the list opens!</p>
            <button id="prepare-followers-btn" class="cai-manual-button">1. Prepare for Followers</button>
            <button id="prepare-following-btn" class="cai-manual-button">2. Prepare for Following</button>
            <div id="instruction-text" style="margin-top: 10px; font-size: 0.8rem; color: #7c3aed; display: none;">
                📋 <span id="instruction-content"></span>
            </div>
            <div id="status-container" class="cai-status-text">
                <span id="followers-status" class="cai-status-not-ok">Followers: Not captured</span><br>
                <span id="following-status" class="cai-status-not-ok">Following: Not captured</span>
            </div>
            <button id="compare-btn" class="cai-manual-button" disabled>3. Compare & Show Results</button>
        `;
        document.body.appendChild(panel);

        panel.querySelector('.cai-tracker-close-btn').addEventListener('click', hidePanel);

        document.getElementById('prepare-followers-btn').addEventListener('click', function() {
            if (isCapturing) return;
            prepareForCapture('followers');
        });

        document.getElementById('prepare-following-btn').addEventListener('click', function() {
            if (isCapturing) return;
            prepareForCapture('following');
        });

        document.getElementById('compare-btn').addEventListener('click', showResults);

        panelVisible = true;
        updateStatus();
    }

    function hidePanel() {
        console.log('[CAI Tracker] Hiding panel...');
        const panel = document.getElementById('cai-main-panel');
        if (panel) {
            panel.remove();
        }
        panelVisible = false;
        captureMode = null;
        resetPreparedMode();
    }

    function updateStatus() {
        const followers = JSON.parse(localStorage.getItem(APP_PREFIX + 'followers') || '[]');
        const following = JSON.parse(localStorage.getItem(APP_PREFIX + 'following') || '[]');
        const followersStatusEl = document.getElementById('followers-status');
        const followingStatusEl = document.getElementById('following-status');
        const compareBtn = document.getElementById('compare-btn');

        if (followersStatusEl && !followersStatusEl.className.includes('capturing')) {
            if (followers.length > 0) {
                followersStatusEl.textContent = `Followers: ${followers.length} captured`;
                followersStatusEl.className = 'cai-status-ok';
            } else {
                followersStatusEl.textContent = `Followers: Not captured`;
                followersStatusEl.className = 'cai-status-not-ok';
            }
        }

        if (followingStatusEl && !followingStatusEl.className.includes('capturing')) {
            if (following.length > 0) {
                followingStatusEl.textContent = `Following: ${following.length} captured`;
                followingStatusEl.className = 'cai-status-ok';
            } else {
                followingStatusEl.textContent = `Following: Not captured`;
                followingStatusEl.className = 'cai-status-not-ok';
            }
        }

        if (compareBtn) {
            compareBtn.disabled = !(followers.length > 0 && following.length > 0) || isCapturing;
        }
    }

    function showResults() {
        const followingList = JSON.parse(localStorage.getItem(APP_PREFIX + 'following') || "[]");
        const followersList = JSON.parse(localStorage.getItem(APP_PREFIX + 'followers') || "[]");

        if (followingList.length === 0 || followersList.length === 0) {
            showToast("Please capture both lists before comparing.", 'error');
            return;
        }

        const followerUsernames = new Set(followersList.map(u => u.username.toLowerCase()));
        const notFollowingBack = followingList.filter(u => !followerUsernames.has(u.username.toLowerCase()));

        const existing = document.querySelector('.cai-results-popup');
        if (existing) existing.remove();

        const wrapper = document.createElement("div");
        wrapper.className = 'cai-results-popup';

        let userListHTML = notFollowingBack.map(user => `
            <div class="cai-results-row">
                <img src="${user.avatar}" alt="${user.username}'s avatar" onerror="this.src='https://placehold.co/40x40/f5f3ff/6d28d9?text=?'">
                <span>${user.username}</span>
            </div>
        `).join('');

        if (notFollowingBack.length === 0) {
            userListHTML = "<p style='color: #581c87; text-align: center; padding: 20px;'>Everyone you follow follows you back!</p>";
        }

        wrapper.innerHTML = `
            <button class="cai-tracker-close-btn">&times;</button>
            <h3>Doesn't Follow Back (${notFollowingBack.length})</h3>
            <p style="font-size: 0.8rem; color: #7c3aed; margin-bottom: 15px;">
                📊 Followers: ${followersList.length} | Following: ${followingList.length}
            </p>
            ${userListHTML}
        `;

        document.body.appendChild(wrapper);
        wrapper.querySelector('.cai-tracker-close-btn').addEventListener('click', () => wrapper.remove());
    }

    function init() {
        console.log('[CAI Tracker] Initializing...');
        setTimeout(() => {
            console.log('[CAI Tracker] Creating toggle button (delayed)...');
            createToggleButton();
        }, 3000); // Increased delay for new site
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Backup observer
    const observer = new MutationObserver(() => {
        if (document.body && !document.getElementById('cai-toggle-btn')) {
            console.log('[CAI Tracker] Toggle button missing, recreating...');
            createToggleButton();
        }
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }

})();