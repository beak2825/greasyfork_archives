// ==UserScript==
// @name         ChatGPT Bulk Deleter ✨
// @namespace    http://tampermonkey.net/
// @version      5.1.0
// @description  The ultimate tool for deleting ChatGPT conversations. Features a premium UI with enhanced shadows, icons, and a selection cursor. No pop-ups.
// @author       @SavitarStorm @Tano (Deluxe Edition by Gemini)
// @match        https://chatgpt.com/*
// @connect      chatgpt.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540396/ChatGPT%20Bulk%20Deleter%20%E2%9C%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/540396/ChatGPT%20Bulk%20Deleter%20%E2%9C%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Deluxe Animations & Styles ---
    GM_addStyle(`
        /* Keyframe animation for a flickering fire effect */
        @keyframes flickerAnimation {
            0%, 100% { transform: scale(1) rotate(-2deg); text-shadow: 0 0 5px #ffae42, 0 0 1px #fff; }
            25% { transform: scale(1.1) rotate(2deg); text-shadow: 0 0 10px #ff7b00, 0 0 3px #fff; }
            50% { transform: scale(0.95) rotate(-3deg); text-shadow: 0 0 15px #ff4800, 0 0 5px #fff; }
            75% { transform: scale(1.05) rotate(3deg); text-shadow: 0 0 10px #ff7b00, 0 0 3px #fff; }
        }

        /* Animation for controls appearing */
        @keyframes slideInFade {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Main container for our controls */
        .bulk-delete-controls {
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 100%;
            border-bottom: 1px solid var(--token-border-light);
        }

        /* Base style for all buttons with enhanced shadows */
        .bulk-delete-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            width: 100%;
            padding: 10px 12px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: white;
            transition: all 0.2s ease-in-out;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.25), 0 2px 4px -2px rgba(0, 0, 0, 0.25);
        }
        .bulk-delete-btn:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3);
            transform: translateY(-2px);
        }
        .bulk-delete-btn:active {
            transform: translateY(0);
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
        }

        /* Main toggle button with gradient */
        #toggle-select-btn {
            background: linear-gradient(45deg, #6d28d9, #4f46e5);
        }

        /* "Cancel" state for the toggle button */
        #toggle-select-btn.selection-active {
            background: linear-gradient(45deg, #b91c1c, #dc2626);
        }

        /* Delete button styling */
        #delete-selected-btn {
            background: linear-gradient(45deg, #dc2626, #ef4444);
        }
        #delete-selected-btn:disabled {
            background: #6b7280;
            cursor: not-allowed;
            transform: none;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }

        /* Action buttons (Select/Deselect All) */
        .action-btn {
            background-color: var(--token-main-surface-secondary);
            color: var(--text-primary);
            border: 1px solid var(--token-border-light);
        }

        /* Fire emoji styling */
        #delete-selected-btn .fire-emoji {
            display: none; /* Hidden by default */
            font-size: 18px;
        }
        #delete-selected-btn.deleting .fire-emoji {
            display: inline-block; /* Shown only during deletion */
            animation: flickerAnimation 0.8s ease-in-out infinite;
        }

        /* Container for hidden elements */
        .bulk-actions-container {
            display: none;
            animation: slideInFade 0.3s ease-out;
        }

        /* Row for "Select All" / "Deselect All" buttons */
        .bulk-actions-row { display: flex; gap: 8px; margin-top: 8px; }
        .bulk-actions-row > .bulk-delete-btn { flex-grow: 1; }

        /* Enhanced style for the filter input field */
        #filter-input-wrapper {
            position: relative;
            margin-top: 8px;
        }
        #filter-input {
            width: 100%;
            padding: 8px 10px 8px 34px; /* Left padding for icon */
            border-radius: 6px;
            border: 2px solid var(--token-border-light);
            background-color: var(--token-main-surface-primary);
            color: var(--text-primary);
            box-sizing: border-box;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        #filter-input:focus, #filter-input:hover {
            border-color: var(--brand-purple);
            box-shadow: 0 0 5px rgba(110, 86, 248, 0.3);
            outline: none;
        }
        /* Search icon inside filter input */
        #filter-input-wrapper::before {
            content: '';
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 16px;
            height: 16px;
            background-color: var(--text-secondary);
            mask-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>');
            mask-size: contain;
            mask-repeat: no-repeat;
        }

        /* Styling for chat items during selection and deletion */
        .chat-selectable {
            cursor: crosshair !important; /* The "plus" cursor for selection */
            transition: transform 0.2s ease, opacity 0.3s ease;
        }
        a.chat-selected {
            background-color: rgba(76, 80, 211, 0.25) !important;
            outline: 2px solid var(--brand-purple) !important;
            border-radius: 8px;
        }
        a.chat-delete-error {
             outline: 2px solid var(--text-danger) !important;
        }
        .chat-deleting {
            transform: translateX(-20px) scale(0.95);
            opacity: 0;
        }

        /* Icons for buttons */
        .btn-icon {
            width: 16px; height: 16px;
            background-color: currentColor;
            mask-size: contain;
            mask-repeat: no-repeat;
            mask-position: center;
        }
        .icon-select { mask-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>'); }
        .icon-cancel { mask-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'); }
        .icon-select-all { mask-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v2M8 4H6a2 2 0 0 0-2 2v2"/><path d="M12 4h.01"/><path d="M12 20h.01"/><path d="M4 12v.01"/><path d="M20 12v.01"/><path d="M16 20h2a2 2 0 0 0 2-2v-2M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M4 8v.01"/><path d="M20 8v.01"/><rect x="8" y="8" width="8" height="8"/></svg>'); }
        .icon-deselect-all { mask-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 5.5-5 5M15.5 10.5l-5 5"/><path d="M16 4h2a2 2 0 0 1 2 2v2"/><path d="M8 4H6a2 2 0 0 0-2 2v2"/><path d="M12 4h.01"/><path d="M12 20h.01"/><path d="M4 12v.01"/><path d="M20 12v.01"/><path d="M16 20h2a2 2 0 0 0 2-2v-2"/><path d="M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M4 8v.01"/><path d="M20 8v.01"/></svg>'); }
        .icon-trash { mask-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>'); }
    `);

    let selectionMode = false;
    const selectedChats = new Set();
    let authToken = null;

    // --- Authorization Token Fetcher ---
    async function getAuthToken() {
        if (authToken) return authToken;
        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://chatgpt.com/api/auth/session",
                    onload: resolve,
                    onerror: reject
                });
            });
            const data = JSON.parse(response.responseText);
            if (data && data.accessToken) {
                authToken = data.accessToken;
                return authToken;
            }
            throw new Error("accessToken not found in session response.");
        } catch (error) {
            console.error("Bulk Deleter: Could not retrieve authorization token.", error);
            GM_notification({ title: 'Authentication Error', text: 'Could not get auth token. Please reload the page.' });
            return null;
        }
    }

    // --- UI Initialization ---
    function initialize() {
        const headerDiv = document.querySelector('#sidebar-header');
        if (!headerDiv || document.getElementById('toggle-select-btn')) return;

        const targetContainer = headerDiv.parentElement;
        if (!targetContainer) return;

        getAuthToken(); // Pre-fetch the token

        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'bulk-delete-controls';

        // --- Create Buttons with Icons ---
        const createButton = (id, text, iconClass) => {
            const button = document.createElement('button');
            button.id = id;
            button.className = 'bulk-delete-btn';
            const icon = document.createElement('span');
            icon.className = `btn-icon ${iconClass}`;
            const textSpan = document.createElement('span');
            textSpan.textContent = text;
            button.append(icon, textSpan);
            return button;
        };

        const toggleBtn = createButton('toggle-select-btn', 'Select Chats', 'icon-select');
        toggleBtn.onclick = toggleSelectionMode;

        // Hidden container for secondary controls
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'bulk-actions-container';

        const filterWrapper = document.createElement('div');
        filterWrapper.id = 'filter-input-wrapper';
        const filterInput = document.createElement('input');
        filterInput.id = 'filter-input';
        filterInput.type = 'text';
        filterInput.placeholder = 'Filter by keyword...';
        filterInput.oninput = filterAndSelectChats;
        filterWrapper.appendChild(filterInput);

        const actionsRow = document.createElement('div');
        actionsRow.className = 'bulk-actions-row';

        const selectAllBtn = createButton('', 'Select All', 'icon-select-all');
        selectAllBtn.classList.add('action-btn');
        selectAllBtn.onclick = selectAllChats;

        const deselectAllBtn = createButton('', 'Deselect All', 'icon-deselect-all');
        deselectAllBtn.classList.add('action-btn');
        deselectAllBtn.onclick = deselectAllChats;

        actionsRow.append(selectAllBtn, deselectAllBtn);

        const deleteBtn = createButton('delete-selected-btn', 'Delete Selected (0)', 'icon-trash');
        deleteBtn.style.marginTop = '8px';
        const fireEmoji = document.createElement('span');
        fireEmoji.className = 'fire-emoji';
        fireEmoji.textContent = '🔥';
        deleteBtn.insertBefore(fireEmoji, deleteBtn.children[1]); // Insert fire before text
        deleteBtn.onclick = deleteSelectedChats;

        actionsContainer.append(filterWrapper, actionsRow, deleteBtn);

        controlsContainer.append(toggleBtn, actionsContainer);
        targetContainer.appendChild(controlsContainer);
    }

    // --- Toggle Selection Mode ---
    function toggleSelectionMode() {
        selectionMode = !selectionMode;
        const toggleBtn = document.getElementById('toggle-select-btn');
        const icon = toggleBtn.querySelector('.btn-icon');
        const text = toggleBtn.querySelector('span:last-child');
        const actionsContainer = document.querySelector('.bulk-actions-container');
        const chatItems = document.querySelectorAll('div#history a[href^="/c/"], div[role="presentation"] nav a[href^="/c/"]');

        if (selectionMode) {
            text.textContent = 'Cancel Selection';
            icon.className = 'btn-icon icon-cancel';
            toggleBtn.classList.add('selection-active');
            actionsContainer.style.display = 'block';
            chatItems.forEach(chat => {
                chat.classList.add('chat-selectable');
                chat.addEventListener('click', handleChatClick, true);
            });
        } else {
            text.textContent = 'Select Chats';
            icon.className = 'btn-icon icon-select';
            toggleBtn.classList.remove('selection-active');
            actionsContainer.style.display = 'none';
            document.getElementById('filter-input').value = '';
            chatItems.forEach(chat => {
                chat.classList.remove('chat-selectable', 'chat-selected', 'chat-delete-error');
                chat.removeEventListener('click', handleChatClick, true);
            });
            selectedChats.clear();
            updateDeleteButton();
        }
    }

    // --- Handle Chat Item Click ---
    function handleChatClick(event) {
        event.preventDefault();
        event.stopPropagation();
        const chatElement = event.currentTarget;
        if (selectedChats.has(chatElement)) {
            selectedChats.delete(chatElement);
            chatElement.classList.remove('chat-selected');
        } else {
            selectedChats.add(chatElement);
            chatElement.classList.add('chat-selected');
        }
        updateDeleteButton();
    }

    // --- Update Delete Button State and Text ---
    function updateDeleteButton(text = null) {
        const deleteBtn = document.getElementById('delete-selected-btn');
        if (deleteBtn) {
            const deleteBtnText = deleteBtn.querySelector('span:last-child');
            deleteBtnText.textContent = text ? text : `Delete Selected (${selectedChats.size})`;
            deleteBtn.disabled = selectedChats.size === 0;
        }
    }

    // --- Bulk Selection & Filter Functions ---
    const selectAllChats = () => {
        document.querySelectorAll('div#history a[href^="/c/"]:not(.chat-selected), div[role="presentation"] nav a[href^="/c/"]:not(.chat-selected)')
            .forEach(chat => {
                selectedChats.add(chat);
                chat.classList.add('chat-selected');
            });
        updateDeleteButton();
    };
    const deselectAllChats = () => {
        selectedChats.forEach(chat => chat.classList.remove('chat-selected'));
        selectedChats.clear();
        updateDeleteButton();
    };
    const filterAndSelectChats = (event) => {
        const query = event.target.value.toLowerCase().trim();
        deselectAllChats();
        if (query.length < 2) return;
        document.querySelectorAll('div#history a[href^="/c/"], div[role="presentation"] nav a[href^="/c/"]')
            .forEach(chat => {
                if (chat.textContent.toLowerCase().includes(query)) {
                    selectedChats.add(chat);
                    chat.classList.add('chat-selected');
                }
            });
        updateDeleteButton();
    };

    // --- Main Deletion Logic ---
    async function deleteSelectedChats() {
        if (selectedChats.size === 0) return;
        const token = await getAuthToken();
        if (!token) return;

        const chatsToDelete = Array.from(selectedChats);
        let successCount = 0, errorCount = 0;
        const deleteBtn = document.getElementById('delete-selected-btn');
        const toggleBtn = document.getElementById('toggle-select-btn');

        deleteBtn.disabled = true;
        toggleBtn.disabled = true;
        deleteBtn.classList.add('deleting');

        for (let i = 0; i < chatsToDelete.length; i++) {
            const chatElement = chatsToDelete[i];
            const conversationId = chatElement.getAttribute('href').split('/').pop();
            updateDeleteButton(`Deleting (${i + 1}/${chatsToDelete.length})...`);

            try {
                await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "PATCH",
                        url: `https://chatgpt.com/backend-api/conversation/${conversationId}`,
                        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                        data: JSON.stringify({ is_visible: false }),
                        onload: (res) => (res.status >= 200 && res.status < 300) ? resolve(res) : reject(new Error(`Status: ${res.status}`)),
                        onerror: reject
                    });
                });
                chatElement.classList.add('chat-deleting');
                setTimeout(() => chatElement.remove(), 400); // Wait for animation
                successCount++;
            } catch (error) {
                console.error(`Bulk Deleter: Failed to delete chat ${conversationId}.`, error);
                chatElement.classList.add('chat-delete-error');
                errorCount++;
            }
        }

        GM_notification({
            title: 'Deletion Complete',
            text: `Successfully deleted: ${successCount}. Failed: ${errorCount}.` + (errorCount > 0 ? "\nFailed chats are marked in red." : ""),
            timeout: 7000
        });

        deleteBtn.classList.remove('deleting');
        toggleBtn.disabled = false;
        toggleSelectionMode(); // Reset the UI
    }

    // --- Mutation Observer ---
    const observer = new MutationObserver(() => {
        if (document.querySelector('#sidebar-header') && !document.getElementById('toggle-select-btn')) {
            initialize();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();