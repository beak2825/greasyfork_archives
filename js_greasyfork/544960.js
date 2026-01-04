// ==UserScript==
// @name         Gemini Conversation Folders
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds folders with a settings menu to the Google Gemini sidebar to organize conversations.
// @author       T. Berkeley Goodloe
// @match        https://gemini.google.com/app*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/544960/Gemini%20Conversation%20Folders.user.js
// @updateURL https://update.greasyfork.org/scripts/544960/Gemini%20Conversation%20Folders.meta.js
// ==/UserScript==

// -----------------------------------------------------------------------------
// Script: Gemini Conversation Folders
// Author: T. Berkeley Goodloe
// Created: 2025-08-07
// Version: 1.0
// Contact: accent-royal-snout@duck.com
// Description: Sidebar folders for Google Gemini conversations.
//              Adds an inline “Folders ＋ ⚙︎” header.
//
//              ⚙︎ gear menu actions:
//              • Copy Debug Code  → copies a JSON snapshot to the clipboard containing:
//                   – storedFolders (array of folder objects)
//                   – storedConversationFolders (map of conversation‑id → folder‑id)
//                   – domFolders (ids currently in each folder element)
//                   – domOrphans (ids still loose in the main list)
//              • Reset Folder Data  → deletes Tampermonkey keys “gemini_folders” &
//                   “gemini_convo_folders” and reloads the page, returning you to a
//                   fresh empty state.
// -----------------------------------------------------------------------------

(function() {
    'use strict';

    // --- SELECTORS ---
    const CHAT_ITEM_SELECTOR = 'div[data-test-id="conversation"]';
    const CHAT_CONTAINER_SELECTOR = '.conversation-items-container';
    const CHAT_LIST_CONTAINER_SELECTOR = 'conversations-list .conversations-container';
    const INJECTION_POINT_SELECTOR = 'div.chat-history-list';

    // --- STYLES ---
    GM_addStyle(`
    #folder-ui-container { padding: 0 8px; }
    #folder-container { padding-bottom: 8px; border-bottom: 1px solid var(--surface-3); }
    .folder { margin-bottom: 5px; border-radius: 8px; overflow: hidden; }
    .folder-header { display: flex; align-items: center; padding: 10px; cursor: pointer; background-color: var(--surface-2); position: relative; }
    .folder-header:hover { background-color: var(--surface-3); }
    .folder-color-indicator { width: 8px; height: 20px; border-radius: 4px; margin-right: 10px; flex-shrink: 0; }
    .folder-name { flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'Roboto', Arial, sans-serif !important; }
    .folder-controls { display: flex; align-items: center; margin-left: 5px; }
    .folder-toggle-icon { transition: transform 0.2s; }
    .folder.closed .folder-toggle-icon { transform: rotate(-90deg); }
    .folder-options-btn { background: none; border: none; color: inherit; cursor: pointer; padding: 2px 4px; border-radius: 4px; margin-left: 4px; font-size: 1.2em; line-height: 1; }
    .folder-options-btn:hover { background-color: rgba(255,255,255,0.1); }
    .folder-content { max-height: 500px; overflow-y: auto; transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out; background-color: var(--surface-1); }
    .folder.closed .folder-content { max-height: 0; padding-top: 0; padding-bottom: 0; }
    #add-folder-btn { width: 100%; margin: 8px 0; padding: 10px; border: none; background-color: var(--primary-surface); color: var(--on-primary-surface); border-radius: 8px; cursor: pointer; font-weight: 500; }
    #add-folder-btn:hover { opacity: 0.9; }
    .sortable-ghost { opacity: 0.4; background: var(--primary-surface-hover); }
    .conversation-items-container { cursor: grab; }
    .folder-context-menu { position: absolute; z-index: 10000; background-color: #333333; border: 1px solid var(--surface-4); border-radius: 8px; padding: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); display: none; }
    .folder-context-menu-item { padding: 8px 12px; cursor: pointer; border-radius: 4px; white-space: nowrap; font-family: 'Roboto', Arial, sans-serif !important; color: #FFFFFF; }
    .folder-context-menu-item:hover { background-color: var(--surface-4); }
    .folder-context-menu-item.delete { color: #DB4437; }

    /* ---- Color-picker ---- */
    .color-picker-dialog .color-swatch {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid transparent;
        position: relative;          /* for the ring ::after */
    }
    .color-picker-dialog .color-swatch:hover {
        border: 2px solid var(--on-primary-surface);
    }
    .color-picker-dialog .color-swatch.selected {
        border: 2px solid transparent;               /* remove hover border */
    }
    .color-picker-dialog .color-swatch.selected::after {
        content: "";
        position: absolute;
        inset: 0;
        border: 3px solid #fff;                      /* ring color / thickness */
        border-radius: 50%;
        box-sizing: border-box;
        pointer-events: none;
    }
        /* ─── Header row ─────────────────── */
    #folders-header{
        display:flex;align-items:center;margin:8px 0 12px;
        font-family:'Roboto', Arial, sans-serif;
    }
    .fh-title   { font-weight:600; }
    .fh-spacer  { flex:1; }
    #fh-add,#fh-gear{
        background:none;border:none;color:inherit;
        font-size:18px;cursor:pointer;margin-left:6px;
        width:28px;height:28px;display:flex;align-items:center;justify-content:center;
        border-radius:4px;
    }
    #fh-add:hover,#fh-gear:hover{ background:rgba(255,255,255,.1); }

    /* ─── Gear pop-over ───────────────── */
    #folder-tools-pop{
        position:absolute;z-index:9999;
        background:#333;border:1px solid var(--surface-4);
        border-radius:8px;padding:6px;box-shadow:0 4px 10px rgba(0,0,0,.3);
    }
    #folder-tools-pop .tools-item{
        display:block;width:100%;text-align:left;
        background:none;border:none;color:#fff;
        padding:8px 14px;cursor:pointer;border-radius:6px;
        font-family:'Roboto', Arial, sans-serif;font-size:14px;
    }
    #folder-tools-pop .tools-item:hover{
        background:var(--surface-4);
    }

    #reset-data-btn { position: fixed; bottom: 15px; right: 15px; z-index: 9999; background-color: #DB4437; color: white; border: none; border-radius: 8px; padding: 10px 15px; font-family: 'Roboto', Arial, sans-serif; font-size: 14px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.3); }
    .custom-dialog-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(34, 34, 34, 0.75); z-index: 20000; display: flex; align-items: center; justify-content: center; }
    .custom-dialog-box { background-color: #333333; padding: 25px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); text-align: center; max-width: 400px; border: 1px solid var(--surface-4); }
    .custom-dialog-box p, .custom-dialog-box h2 { margin: 0 0 20px; font-family: 'Roboto', Arial, sans-serif; color: #FFFFFF; }
    .custom-dialog-btn { border: none; border-radius: 8px; padding: 10px 20px; cursor: pointer; font-weight: 500; margin: 0 10px; }
    .dialog-btn-confirm { background-color: #8ab4f8; color: #202124; }
    .dialog-btn-delete { background-color: #DB4437; color: white; }
    .dialog-btn-cancel { background-color: var(--surface-4); color: var(--on-surface); }
    .custom-dialog-input { width: 100%; box-sizing: border-box; padding: 10px; border-radius: 8px; border: 1px solid var(--surface-4); background-color: var(--surface-1); color: var(--on-surface); font-size: 16px; margin-bottom: 20px; }
    .color-picker-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 20px; }
`);

    // --- STATE MANAGEMENT ---
    let folders = [];
    let conversationFolders = {};
    let chatItemCache = new Map();
    const FOLDER_COLORS = ['#370000', '#0D3800', '#001B38', '#383200', '#380031', '#7DAC89', '#7A82AF', '#AC7D98', '#7AA7AF', '#9CA881'];

    async function loadData() {
        folders = await GM_getValue('gemini_folders', []);
        conversationFolders = await GM_getValue('gemini_convo_folders', {});
    }

    async function saveData() {
        await GM_setValue('gemini_folders', folders);
        await GM_setValue('gemini_convo_folders', conversationFolders);
    }

    // ─── UNIQUE-ID DETECTION ─────────────────────────────────────────
    function getIdentifierFromElement(el) {
        if (!el) return null;

        // If we were handed the container, drill down once to the conversation div
        if (el.matches('.conversation-items-container')) {
            el = el.querySelector('[data-test-id="conversation"]') || el;
        }

        /* 1. New URL-style id ( /conversation/<id> )  */
        const anchor = el.closest('a');
        if (anchor) {
            const href = anchor.getAttribute('href') || '';
            const m = href.match(/\/conversation\/([A-Za-z0-9_-]+)/);
            if (m) return m[1];
        }

        /* 2. jslog metadata ( c_<id> )  */
        const jslog = el.getAttribute('jslog') || '';
        let m = jslog.match(/"c_([A-Za-z0-9_-]+)"/); // within quotes
        if (!m) m = jslog.match(/c_([A-Za-z0-9_-]+)/); // bare
        if (m) return m[1];

        /* 3. Fallback to visible title text (last resort) */
        const t = el.querySelector('.conversation-title');
        if (t) return `title:${t.textContent.trim()}`;

        /* 4. Couldn’t identify – log once per element */
        console.warn('[Gemini Folders] Could not find ID for element:', el);
        return null;
    }

    // --- UI RENDERING ---
    function renderFolders() {
        const container = document.getElementById('folder-container');
        if (!container) return;
        while (container.firstChild) container.removeChild(container.firstChild);

        folders.forEach(folder => {
            const folderEl = document.createElement('div');
            folderEl.className = 'folder';
            folderEl.dataset.folderId = folder.id;
            if (folder.isClosed) folderEl.classList.add('closed');

            const headerEl = document.createElement('div');
            headerEl.className = 'folder-header';
            headerEl.addEventListener('click', (e) => {
                if (!e.target.closest('.folder-options-btn')) toggleFolder(folder.id);
            });

            const colorIndicator = document.createElement('div');
            colorIndicator.className = 'folder-color-indicator';
            colorIndicator.style.backgroundColor = folder.color;

            const nameEl = document.createElement('span');
            nameEl.className = 'folder-name';
            nameEl.textContent = folder.name;

            const controlsEl = document.createElement('div');
            controlsEl.className = 'folder-controls';

            const toggleIcon = document.createElement('span');
            toggleIcon.className = 'folder-toggle-icon';
            toggleIcon.textContent = '▼';

            const optionsBtn = document.createElement('button');
            optionsBtn.className = 'folder-options-btn';
            optionsBtn.textContent = '⋮';
            optionsBtn.addEventListener('click', (e) => showContextMenu(e, folder.id));

            controlsEl.appendChild(toggleIcon);
            controlsEl.appendChild(optionsBtn);
            headerEl.appendChild(colorIndicator);
            headerEl.appendChild(nameEl);
            headerEl.appendChild(controlsEl);

            const contentEl = document.createElement('div');
            contentEl.className = 'folder-content';

            folderEl.appendChild(headerEl);
            folderEl.appendChild(contentEl);
            container.appendChild(folderEl);
        });

        organizeConversations();
        setupDragAndDrop();
    }

    // --- FIXED FUNCTION: This is where the magic happens ---
    function organizeConversations() {
        const chatListContainer = document.querySelector(CHAT_LIST_CONTAINER_SELECTOR);
        if (!chatListContainer) return;

        const folderIds = new Set(folders.map(f => f.id));
        let dataWasCorrected = false;

        // Only move orphaned chats back to main (not ALL chats!)
        document.querySelectorAll('.folder-content ' + CHAT_CONTAINER_SELECTOR).forEach(item => {
            const convoEl = item.querySelector(CHAT_ITEM_SELECTOR);
            const identifier = getIdentifierFromElement(convoEl);

            // Only move if chat shouldn't be in any folder
            if (!identifier || !conversationFolders[identifier] || !folderIds.has(conversationFolders[identifier])) {
                chatListContainer.appendChild(item);
            }
        });

        // Process chats in main container and assign to folders
        Array.from(chatListContainer.children).forEach(itemToMove => {
            const convoEl = itemToMove.querySelector(CHAT_ITEM_SELECTOR);
            const identifier = getIdentifierFromElement(convoEl);
            if (!identifier) return;

            let folderId = conversationFolders[identifier];

            // Clean up references to deleted folders
            if (folderId && !folderIds.has(folderId)) {
                delete conversationFolders[identifier];
                folderId = null;
                dataWasCorrected = true;
            }

            // Move to appropriate folder
            if (folderId) {
                const folderContent = document.querySelector(`.folder[data-folder-id="${folderId}"] .folder-content`);
                if (folderContent && !folderContent.contains(itemToMove)) {
                    folderContent.appendChild(itemToMove);
                }
            }
        });

        if (dataWasCorrected) saveData();
    }

    // --- FOLDER ACTIONS ---
    function createNewFolder() {
        showCustomPromptDialog("Enter New Folder Name", "", "Create", (name) => {
            if (name) {
                const newFolder = { id: `folder_${Date.now()}`, name, color: '#808080', isClosed: false };
                folders.push(newFolder);
                saveData().then(renderFolders);
            }
        });
    }
    // === patch-only: updates an existing folder header in place ===
    function updateFolderHeader(folderId) {
        const folder = folders.find(f => f.id === folderId);
        const folderEl = document.querySelector(`.folder[data-folder-id="${folderId}"]`);
        if (!folder || !folderEl) return;

        folderEl.querySelector('.folder-name').textContent = folder.name;
        folderEl.querySelector('.folder-color-indicator').style.backgroundColor = folder.color;
    }
    function renameFolder(folderId) {
        const folder = folders.find(f => f.id === folderId);
        if (!folder) return;

        showCustomPromptDialog("Rename Folder", folder.name, "Save", (newName) => {
            if (newName && newName !== folder.name) {
                folder.name = newName;
                saveData().then(() => updateFolderHeader(folderId));
            }
        });
    }

    async function deleteFolder(folderId) {
        Object.keys(conversationFolders).forEach(id => {
            if (conversationFolders[id] === folderId) delete conversationFolders[id];
        });
        folders = folders.filter(f => f.id !== folderId);
        await saveData();
        renderFolders();
    }

    function toggleFolder(folderId) {
        const folder = folders.find(f => f.id === folderId);
        if (folder) {
            folder.isClosed = !folder.isClosed;
            const folderEl = document.querySelector(`.folder[data-folder-id="${folderId}"]`);
            if (folderEl) folderEl.classList.toggle('closed');
            saveData();
        }
    }

    // --- CONTEXT MENU & DIALOGS ---
    function showContextMenu(event, folderId) {
        event.preventDefault();
        event.stopPropagation();
        closeContextMenu();

        const btn = event.currentTarget;
        const rect = btn.getBoundingClientRect();

        const menu = document.createElement('div');
        menu.className = 'folder-context-menu';
        menu.id = 'folder-context-menu-active';

        const items = {
            'Rename': () => renameFolder(folderId),
            'Change Color': () => showColorPickerDialog(folderId),
            'Delete Folder': () => showConfirmationDialog("Are you sure you want to delete this folder?", () => deleteFolder(folderId), "Delete", "dialog-btn-delete")
        };

        for (const [text, action] of Object.entries(items)) {
            const itemEl = document.createElement('div');
            itemEl.className = 'folder-context-menu-item';
            if (text === 'Delete Folder') itemEl.classList.add('delete');
            itemEl.textContent = text;
            itemEl.onclick = (e) => {
                e.stopPropagation();
                closeContextMenu();
                action(e);
            };
            menu.appendChild(itemEl);
        }

        document.body.appendChild(menu);
        menu.style.display = 'block';
        menu.style.top = `${rect.bottom + window.scrollY}px`;
        menu.style.left = `${rect.right + window.scrollX - menu.offsetWidth}px`;

        setTimeout(() => document.addEventListener('click', closeContextMenu, { once: true }), 0);
    }

    function closeContextMenu() {
        const menu = document.getElementById('folder-context-menu-active');
        if (menu) menu.remove();
    }

    function showColorPickerDialog(folderId) {
        const folder = folders.find(f => f.id === folderId);
        if (!folder) return;

        const overlay = document.createElement('div');
        overlay.className = 'custom-dialog-overlay';
        const dialogBox = document.createElement('div');
        dialogBox.className = 'custom-dialog-box color-picker-dialog';
        const titleH2 = document.createElement('h2');
        titleH2.textContent = 'Change Folder Color';
        const grid = document.createElement('div');
        grid.className = 'color-picker-grid';

        let selectedColor = folder.color;

        FOLDER_COLORS.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            if (color.toLowerCase() === selectedColor.toLowerCase()) swatch.classList.add('selected');
            swatch.style.backgroundColor = color;
            swatch.onclick = () => {
                selectedColor = color;
                hexInput.value = color;
                grid.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
                swatch.classList.add('selected');
            };
            grid.appendChild(swatch);
        });

        const hexInput = document.createElement('input');
        hexInput.className = 'custom-dialog-input';
        hexInput.type = 'text';
        hexInput.placeholder = 'Or enter a hex value, e.g. #C0FFEE';
        hexInput.value = selectedColor;

        const btnYes = document.createElement('button');
        btnYes.className = 'custom-dialog-btn dialog-btn-confirm';
        btnYes.textContent = 'Save';
        const btnNo = document.createElement('button');
        btnNo.className = 'custom-dialog-btn dialog-btn-cancel';
        btnNo.textContent = 'Cancel';

        dialogBox.appendChild(titleH2);
        dialogBox.appendChild(grid);
        dialogBox.appendChild(hexInput);
        dialogBox.appendChild(btnYes);
        dialogBox.appendChild(btnNo);
        overlay.appendChild(dialogBox);
        document.body.appendChild(overlay);

        btnYes.onclick = () => {
            const newColor = hexInput.value.trim();
            if (/^#[0-9A-F]{6}$/i.test(newColor)) {
                folder.color = newColor;
                saveData().then(() => updateFolderHeader(folderId));
                overlay.remove();
            } else {
                hexInput.style.border = "1px solid red";
                hexInput.value = "Invalid Hex Code";
                setTimeout(() => {
                    hexInput.style.border = "";
                    hexInput.value = selectedColor;
                }, 2000);
            }
        };
        btnNo.onclick = () => { overlay.remove(); };
    }

    function showConfirmationDialog(message, onConfirm, confirmText = "Confirm", confirmClass = "dialog-btn-confirm") {
        const overlay = document.createElement('div');
        overlay.className = 'custom-dialog-overlay';
        const dialogBox = document.createElement('div');
        dialogBox.className = 'custom-dialog-box';
        const messageP = document.createElement('p');
        messageP.textContent = message;
        const btnYes = document.createElement('button');
        btnYes.className = `custom-dialog-btn ${confirmClass}`;
        btnYes.textContent = confirmText;
        const btnNo = document.createElement('button');
        btnNo.className = 'custom-dialog-btn dialog-btn-cancel';
        btnNo.textContent = 'Cancel';
        dialogBox.appendChild(messageP);
        dialogBox.appendChild(btnYes);
        dialogBox.appendChild(btnNo);
        overlay.appendChild(dialogBox);
        document.body.appendChild(overlay);
        btnYes.onclick = () => { onConfirm(); overlay.remove(); };
        btnNo.onclick = () => { overlay.remove(); };
    }

    function showCustomPromptDialog(title, defaultValue, confirmText, onConfirm) {
        const overlay = document.createElement('div');
        overlay.className = 'custom-dialog-overlay';
        const dialogBox = document.createElement('div');
        dialogBox.className = 'custom-dialog-box';
        const titleH2 = document.createElement('h2');
        titleH2.textContent = title;
        const input = document.createElement('input');
        input.className = 'custom-dialog-input';
        input.type = 'text';
        input.value = defaultValue;
        const btnYes = document.createElement('button');
        btnYes.className = 'custom-dialog-btn dialog-btn-confirm';
        btnYes.textContent = confirmText;
        const btnNo = document.createElement('button');
        btnNo.className = 'custom-dialog-btn dialog-btn-cancel';
        btnNo.textContent = 'Cancel';
        dialogBox.appendChild(titleH2);
        dialogBox.appendChild(input);
        dialogBox.appendChild(btnYes);
        dialogBox.appendChild(btnNo);
        overlay.appendChild(dialogBox);
        document.body.appendChild(overlay);
        input.focus();
        input.select();
        btnYes.onclick = () => { onConfirm(input.value); overlay.remove(); };
        btnNo.onclick = () => { overlay.remove(); };
        input.onkeydown = (e) => { if (e.key === 'Enter') btnYes.click(); };
    }

    // --- DRAG AND DROP ---
    function setupDragAndDrop() {
        const chatListContainer = document.querySelector(CHAT_LIST_CONTAINER_SELECTOR);
        if (!chatListContainer) return;

        new Sortable(chatListContainer, {
            group: 'shared',
            animation: 150,
            onEnd: function() {
                rebuildAndSaveState();
            },
        });

        document.querySelectorAll('.folder-content').forEach(folderContentEl => {
            new Sortable(folderContentEl, {
                group: 'shared',
                animation: 150,
                onEnd: function() {
                    rebuildAndSaveState();
                },
            });
        });
    }

    function rebuildAndSaveState() {
        const newConversationFolders = {};
        document.querySelectorAll('.folder').forEach(folderEl => {
            const folderId = folderEl.dataset.folderId;
            folderEl.querySelectorAll(CHAT_CONTAINER_SELECTOR).forEach(item => {
                const id = getIdentifierFromElement(item.querySelector(CHAT_ITEM_SELECTOR));
                if (id) {
                    newConversationFolders[id] = folderId;
                }
            });
        });
        conversationFolders = newConversationFolders;
        saveData();
    }

    // --- INITIALIZATION ---
    function initialize() {
        const injectionPoint = document.querySelector(INJECTION_POINT_SELECTOR);
        if (!injectionPoint) return false;

        if (chatItemCache.size === 0) {
            const chats = document.querySelectorAll(CHAT_CONTAINER_SELECTOR);
            if (chats.length > 0) {
                chats.forEach(chat => {
                    const id = getIdentifierFromElement(chat.querySelector(CHAT_ITEM_SELECTOR));
                    if (id) chatItemCache.set(id, chat);
                });
            }
        }

        if (document.getElementById('folder-ui-container')) {
            organizeConversations();
            return true;
        }

        const uiContainer = document.createElement('div');
        uiContainer.id = 'folder-ui-container';
        const addButton = document.createElement('button');
        addButton.id = 'add-folder-btn';
        addButton.textContent = '＋ New Folder';
        addButton.onclick = createNewFolder;
        const folderContainer = document.createElement('div');
        folderContainer.id = 'folder-container';
        uiContainer.appendChild(addButton);
        uiContainer.appendChild(folderContainer);
        injectionPoint.prepend(uiContainer);
        renderFolders();
        return true;
    }

    // --- MAIN EXECUTION ---
    loadData().then(() => {
        const initInterval = setInterval(() => {
            if (initialize()) {
                clearInterval(initInterval);
            }
        }, 500);
    });

    // --- OPTIONAL RESET BUTTON ---
    function addResetButton() {
        if (document.getElementById('reset-data-btn')) return;
        const resetButton = document.createElement('button');
        resetButton.id = 'reset-data-btn';
        resetButton.textContent = 'Reset Folder Data';
        resetButton.onclick = () => {
            showConfirmationDialog('Are you sure you want to delete all folder data? This cannot be undone.', () => {
                GM_deleteValue('gemini_folders');
                GM_deleteValue('gemini_convo_folders');
                location.reload();
            }, 'Reset', 'dialog-btn-delete');
        };
        document.body.appendChild(resetButton);
    }
    addResetButton();
    // --- END OPTIONAL RESET BUTTON ---
/******************************************************************
 *  DEBUG INSTRUMENTATION – add right above the final “})();”
 ******************************************************************/

// ---- Clipboard helper (works in all modern browsers) ----------
async function copyTextToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        console.info('[Gemini Folder Debug] Copied to clipboard');
    } catch (err) {
        console.warn('[Gemini Folder Debug] Clipboard write failed:', err);
    }
}

// ---- Collect full runtime + DOM state -------------------------
function collectDebugState() {
    const stateSnapshot = {
        storedFolders: folders,                       // what’s in memory
        storedConversationFolders: conversationFolders,
        domFolders: {},                               // what’s actually in the DOM
        domOrphans: []                                // chats not in any folder
    };

    // Map DOM placements
    document.querySelectorAll('.folder').forEach(folderEl => {
        const folderId = folderEl.dataset.folderId;
        stateSnapshot.domFolders[folderId] = [];
        folderEl.querySelectorAll('div[data-test-id="conversation"]').forEach(chatEl => {
            const id = getIdentifierFromElement(chatEl);
            if (id) stateSnapshot.domFolders[folderId].push(id);
        });
    });

    // Chats still living in the main container
    const mainContainer = document.querySelector(CHAT_LIST_CONTAINER_SELECTOR);
    if (mainContainer) {
        mainContainer.querySelectorAll('div[data-test-id="conversation"]').forEach(chatEl => {
            const id = getIdentifierFromElement(chatEl);
            if (id) stateSnapshot.domOrphans.push(id);
        });
    }

    return stateSnapshot;
}

// ---- Add floating button to UI --------------------------------
function addDebugButton() {
    if (document.getElementById('gemini-folder-debug-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'gemini-folder-debug-btn';
    btn.textContent = '🩺 Copy Debug Info';
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '15px',
        left:  '15px',
        zIndex:  10000,
        padding: '8px 12px',
        fontSize: '13px',
        background: '#d32f2f',
        color: '#fff',
        border: '2px solid #fff',
        borderRadius: '6px',
        cursor: 'pointer'
    });

    btn.onclick = async () => {
        const snapshot = collectDebugState();
        const json = JSON.stringify(snapshot, null, 2);
        console.log('%c[Gemini Folder Debug] Snapshot below:', 'color:#d32f2f;font-weight:bold;');
        console.log(json);
        await copyTextToClipboard(json);
        btn.textContent = '✅ Copied!';
        setTimeout(() => { btn.textContent = '🩺 Copy Debug Info'; }, 2000);
    };

    document.body.appendChild(btn);
}

// run once UI is present
const debugInitInterval = setInterval(() => {
    if (document.querySelector(INJECTION_POINT_SELECTOR)) {
        addDebugButton();
        clearInterval(debugInitInterval);
    }
}, 600);

/******************************************************************
 *  END DEBUG INSTRUMENTATION
 ******************************************************************/
    /******************************************************************
 *  Header row (Folders  ＋  ⚙︎) – added without disturbing core  *
 ******************************************************************/

(function addHeaderOnce () {
  // Wait until the original UI container exists
  const check = setInterval(() => {
    const ui  = document.querySelector('#folder-ui-container');
    const add = ui?.querySelector('button, input[value="+ New Folder"]'); // old add-folder button
    if (!ui || !add) return;

    clearInterval(check);

    /* Hide the old UI bits ------------------------------------ */
    add.style.display = 'none';                    // old “+ New Folder” button
    document.querySelectorAll('.debug-btn, .reset-btn')
            .forEach(btn => btn.style.display = 'none'); // bottom red buttons

    /* Build header row --------------------------------------- */
    const header = document.createElement('div');
    header.id = 'folders-header-inline';
    header.style.cssText = 'display:flex;align-items:center;margin:8px 0 12px;font-family:Roboto,Arial,sans-serif;';

    const title = Object.assign(document.createElement('span'), { textContent: 'Folders', style: 'font-weight:600;' });
    const spacer = Object.assign(document.createElement('span'), { style: 'flex:1;' });

    const btnCSS = 'background:none;border:none;font-size:18px;cursor:pointer;width:28px;height:28px;border-radius:4px;display:flex;align-items:center;justify-content:center;';
    const plus  = Object.assign(document.createElement('button'), { textContent:'＋', title:'New Folder', style:btnCSS });
    const gear  = Object.assign(document.createElement('button'), { textContent:'⚙︎', title:'Tools',      style:btnCSS });

    /* Re-use the existing functions already in the page */
    plus.onclick = () => add.click();                 // create-folder dialog
    gear.onclick = showToolsPop;                      // small pop-over

    header.append(title, spacer, plus, gear);
    ui.prepend(header);

    /* ---------- tiny pop-over ---------- */
    function showToolsPop (e) {
      e.stopPropagation();
      const old = document.getElementById('folder-tools-pop-inline');
      if (old) return old.remove();

      const pop = document.createElement('div');
      pop.id = 'folder-tools-pop-inline';
      pop.style.cssText = 'position:absolute;z-index:10000;background:#333;color:#fff;border:1px solid #555;border-radius:8px;padding:6px;font:14px Roboto,Arial;';
      const { bottom, right } = e.currentTarget.getBoundingClientRect();
      pop.style.top  = `${bottom + window.scrollY}px`;
      pop.style.left = `${right  + window.scrollX - 150}px`;
      pop.style.minWidth = '150px';

      const item = (txt, fn) => {
        const b = Object.assign(document.createElement('button'), { textContent:txt });
        b.style.cssText = 'display:block;width:100%;background:none;border:none;color:#fff;padding:8px 14px;text-align:left;border-radius:6px;cursor:pointer;';
        b.onmouseover = () => b.style.background = '#555';
        b.onmouseout  = () => b.style.background = '';
        b.onclick = fn;
        pop.appendChild(b);
      };

      item('Copy Debug Code', async () => {
        if (window.collectDebugState && navigator.clipboard)
          await navigator.clipboard.writeText(JSON.stringify(window.collectDebugState(), null, 2));
        pop.remove();
      });

      item('Reset Folder Data', () => {
        if (confirm('Delete all folder data?')) {
          GM_deleteValue('gemini_folders');
          GM_deleteValue('gemini_convo_folders');
          location.reload();
        }
      });

      document.body.appendChild(pop);
      setTimeout(() => document.addEventListener('click', () => pop.remove(), { once:true }), 0);
    }
  }, 300);
})();

})();