// ==UserScript==
// @name         Infinite Craft - Multiple word spawns
// @version      1.0.2
// @namespace    http://tampermonkey.net/
// @description  The definitive toolkit. Features ad-hoc group spawning, intelligent deselection, conflict-free hotkeys, and a powerful group manager.
// @author       Google Gemini AI & ChessScholar
// @match        https://neal.fun/infinite-craft/
// @icon         https://neal.fun/favicons/infinite-craft.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543151/Infinite%20Craft%20-%20Multiple%20word%20spawns.user.js
// @updateURL https://update.greasyfork.org/scripts/543151/Infinite%20Craft%20-%20Multiple%20word%20spawns.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration & Storage Keys ---
    const SPAWN_COUNT_KEY = 'pt_spawnCount_v1';
    const SAVED_GROUPS_KEY = 'pt_elementGroups_v1';
    const DEFAULT_SPAWN_COUNT = 1;

    // --- Global State Variables ---
    let multiSelectItems = new Map();
    let currentlyEditingGroup = { name: null, items: new Map() };
    let allDiscoveredItems = [];

    // --- Storage Management & Autosaving ---
    const getSetting = async (key, defaultValue) => await GM_getValue(key, defaultValue);
    const setSetting = async (key, value) => await GM_setValue(key, value);

    async function autosaveCurrentGroup() {
        if (!currentlyEditingGroup || !currentlyEditingGroup.name) return;
        const groups = await getSetting(SAVED_GROUPS_KEY, {});
        groups[currentlyEditingGroup.name] = Array.from(currentlyEditingGroup.items.values());
        await setSetting(SAVED_GROUPS_KEY, groups);
        await updateGroupDropdown();
    }

    // --- Core Initialization ---
    function initializeAllFeatures() {
        addCustomStyles();
        createPowerToolsPanel();
        initializeQuickSpawn();
        initializeMultiSelectAndAdHocSpawning();
        initializeDeselection();
        initializeGroupManagerControls();
    }

    // --- Feature 1: Quick Spawn (Shift + Middle-click) ---
    function initializeQuickSpawn() {
        window.addEventListener('mousedown', async (event) => {
            if (event.shiftKey && event.button === 1 && !isElementInPanel(event.target)) {
                const clickedItem = event.target.closest('.item');
                if (clickedItem) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    const spawnCount = await getSetting(SPAWN_COUNT_KEY, DEFAULT_SPAWN_COUNT);
                    spawnItemsInCenter([getItemData(clickedItem)], spawnCount);
                }
            }
        }, true);
    }

    // --- Feature 2: On-the-fly Group Creation & Spawning ---
    function initializeMultiSelectAndAdHocSpawning() {
        const sidebar = document.getElementById('sidebar');
        sidebar.addEventListener('mousedown', async (event) => {
            const itemElement = event.target.closest('.item');
            if (!itemElement || isElementInPanel(itemElement)) return;

            // Case 1: Spawn the entire selected group by clicking any member.
            if (multiSelectItems.size > 0 && multiSelectItems.has(getItemData(itemElement).text) && !event.ctrlKey) {
                event.preventDefault();
                event.stopImmediatePropagation();
                const spawnCount = await getSetting(SPAWN_COUNT_KEY, DEFAULT_SPAWN_COUNT);
                const itemsToSpawn = Array.from(multiSelectItems.values()).map(item => item.data);
                spawnItemsInCenter(itemsToSpawn, spawnCount);
                return;
            }

            // Case 2: Toggle selection with pure Ctrl+Click.
            if (event.ctrlKey && !event.shiftKey && !event.altKey) {
                event.preventDefault();
                event.stopImmediatePropagation();
                toggleItemInMultiSelect(itemElement);
            }
        }, true);
    }

    function initializeDeselection() {
        window.addEventListener('mousedown', (event) => {
            if (event.ctrlKey || multiSelectItems.size === 0 || isElementInPanel(event.target)) {
                return;
            }
            const clickedItem = event.target.closest('.item');
            if (clickedItem && multiSelectItems.has(getItemData(clickedItem).text)) {
                return;
            }
            clearMultiSelect();
        }, true);
    }

    function toggleItemInMultiSelect(element) {
        const itemData = getItemData(element);
        if (multiSelectItems.has(itemData.text)) {
            multiSelectItems.get(itemData.text).element.classList.remove('pt-multi-selected-item');
            multiSelectItems.delete(itemData.text);
        } else {
            element.classList.add('pt-multi-selected-item');
            multiSelectItems.set(itemData.text, { data: itemData, element });
        }
        updateCreateButtonState();
    }

    function updateCreateButtonState() {
        const btn = document.getElementById('pt-create-group-btn');
        if (btn) btn.disabled = (multiSelectItems.size === 0);
    }

    function clearMultiSelect() {
        multiSelectItems.forEach(item => item.element.classList.remove('pt-multi-selected-item'));
        multiSelectItems.clear();
        updateCreateButtonState();
    }

    async function createNewGroupFromSelection() {
        if (multiSelectItems.size === 0) return;
        const name = prompt("Enter the name for your new group:");
        if (!name || !name.trim()) return;

        const groups = await getSetting(SAVED_GROUPS_KEY, {});
        if (groups[name.trim()] && !confirm(`A group named "${name.trim()}" already exists. Overwrite it?`)) return;

        groups[name.trim()] = Array.from(multiSelectItems.values()).map(item => item.data);
        await setSetting(SAVED_GROUPS_KEY, groups);
        await updateGroupDropdown();
        clearMultiSelect();
    }

    // --- Feature 3: The Group Manager & Spawner ---
    function initializeGroupManagerControls() {
        document.getElementById('pt-manage-groups-btn').addEventListener('click', openGroupManagerModal);
        document.getElementById('pt-create-group-btn').addEventListener('click', createNewGroupFromSelection);

        const dropdown = document.getElementById('pt-saved-groups-dropdown');
        const spawnBtn = document.getElementById('pt-spawn-group-btn');

        dropdown.addEventListener('change', () => spawnBtn.disabled = !dropdown.value);
        spawnBtn.addEventListener('click', async () => {
            const groupName = dropdown.value;
            if (!groupName) return;
            const spawnCount = await getSetting(SPAWN_COUNT_KEY, DEFAULT_SPAWN_COUNT);
            const groups = await getSetting(SAVED_GROUPS_KEY, {});
            spawnItemsInCenter(groups[groupName], spawnCount);
        });
        updateGroupDropdown();
    }

    // --- The Group Manager Modal ---
    async function openGroupManagerModal() {
        clearMultiSelect();

        const containerVue = document.querySelector(".container").__vue__;
        allDiscoveredItems = containerVue?.items ?? [];

        const overlay = document.createElement('div');
        overlay.id = 'pt-modal-overlay';
        overlay.innerHTML = `
            <div id="pt-modal-box">
                <div class="pt-modal-header">
                    <h3>Group Manager</h3>
                    <button id="pt-modal-close-btn" title="Close">X</button>
                </div>
                <div class="pt-modal-instructions">
                    Click an item in Discoveries to add. Click an item in the group to remove. Changes save automatically.
                </div>
                <div class="pt-modal-content">
                    <div class="pt-modal-panel">
                        <h4>Your Groups</h4>
                        <div class="pt-modal-controls">
                           <button id="pt-modal-new-group-btn">Create New Group</button>
                        </div>
                        <ul id="pt-modal-group-list" class="pt-item-list"></ul>
                    </div>
                    <div class="pt-modal-panel">
                        <h4 id="pt-modal-group-title">Select or Create a Group</h4>
                        <ul id="pt-modal-group-contents" class="pt-item-list"></ul>
                    </div>
                    <div class="pt-modal-panel">
                        <h4>Add Items from Discoveries</h4>
                        <input type="text" id="pt-modal-search-input" placeholder="Search all items...">
                        <ul id="pt-modal-all-items-list" class="pt-item-list"></ul>
                    </div>
                </div>
                <div class="pt-modal-footer">
                    <button id="pt-modal-delete-btn" class="pt-danger-btn" disabled>Delete Group</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);

        const closeModal = () => document.body.removeChild(overlay);
        document.getElementById('pt-modal-close-btn').addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

        document.getElementById('pt-modal-new-group-btn').addEventListener('click', async () => {
            const name = prompt("Enter the name for your new group:");
            if (name && name.trim()) {
                const groups = await getSetting(SAVED_GROUPS_KEY, {});
                if (groups[name.trim()]) {
                    alert("A group with this name already exists.");
                    return;
                }
                groups[name.trim()] = [];
                await setSetting(SAVED_GROUPS_KEY, groups);
                await renderGroupListInModal();
                resetEditState({ name: name.trim(), items: new Map() });
            }
        });

        document.getElementById('pt-modal-delete-btn').addEventListener('click', async () => {
            if (!currentlyEditingGroup.name || !confirm(`Are you sure you want to delete "${currentlyEditingGroup.name}"?`)) return;
            const groups = await getSetting(SAVED_GROUPS_KEY, {});
            delete groups[currentlyEditingGroup.name];
            await setSetting(SAVED_GROUPS_KEY, groups);
            resetEditState({ name: null, items: new Map() });
            await renderGroupListInModal();
            await updateGroupDropdown();
        });

        const searchInput = document.getElementById('pt-modal-search-input');
        searchInput.addEventListener('input', () => {
            const filter = searchInput.value.toLowerCase();
            document.querySelectorAll('#pt-modal-all-items-list li').forEach(item => {
                item.style.display = item.dataset.text.toLowerCase().includes(filter) ? 'flex' : 'none';
            });
        });

        renderAllItemsInModal();
        await renderGroupListInModal();
        resetEditState({ name: null, items: new Map() });
    }

    function resetEditState(newState) {
        currentlyEditingGroup = newState;
        const title = document.getElementById('pt-modal-group-title');
        const deleteBtn = document.getElementById('pt-modal-delete-btn');

        document.querySelectorAll('#pt-modal-group-list li').forEach(li => {
            li.classList.toggle('pt-active', li.dataset.groupName === currentlyEditingGroup.name);
        });

        if (currentlyEditingGroup.name) {
            title.textContent = `Editing: ${currentlyEditingGroup.name}`;
            deleteBtn.disabled = false;
        } else {
            title.textContent = 'Select or Create a Group';
            deleteBtn.disabled = true;
        }
        renderGroupContentsInModal();
    }

    async function renderGroupListInModal() {
        const list = document.getElementById('pt-modal-group-list');
        const groups = await getSetting(SAVED_GROUPS_KEY, {});
        list.innerHTML = '';
        Object.keys(groups).sort().forEach(name => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${name}</span>`;
            li.dataset.groupName = name;
            li.addEventListener('click', () => {
                 const itemsMap = new Map();
                 (groups[name] || []).forEach(item => itemsMap.set(item.text, item));
                 resetEditState({ name, items: itemsMap });
            });
            list.appendChild(li);
        });
    }

    function renderAllItemsInModal() {
        const list = document.getElementById('pt-modal-all-items-list');
        list.innerHTML = '';
        allDiscoveredItems.forEach(item => {
            const li = document.createElement('li');
            li.dataset.text = item.text;
            li.innerHTML = `<span>${item.emoji} ${item.text}</span>`;
            li.addEventListener('click', () => {
                if (!currentlyEditingGroup.name) {
                    alert("Please select or create a group first.");
                    return;
                }
                if (!currentlyEditingGroup.items.has(item.text)) {
                    currentlyEditingGroup.items.set(item.text, item);
                    renderGroupContentsInModal();
                    autosaveCurrentGroup();
                }
            });
            list.appendChild(li);
        });
    }

    function renderGroupContentsInModal() {
        const list = document.getElementById('pt-modal-group-contents');
        list.innerHTML = '';
        if (currentlyEditingGroup.items.size === 0) {
            list.innerHTML = `<li class="pt-empty-list">No items in this group.</li>`;
        } else {
             Array.from(currentlyEditingGroup.items.values()).sort((a,b) => a.text.localeCompare(b.text)).forEach(item => {
                const li = document.createElement('li');
                li.dataset.text = item.text;
                li.innerHTML = `<span>${item.emoji} ${item.text}</span>`;
                li.addEventListener('click', () => {
                    currentlyEditingGroup.items.delete(item.text);
                    renderGroupContentsInModal();
                    autosaveCurrentGroup();
                });
                list.appendChild(li);
            });
        }
    }

    async function updateGroupDropdown() {
        const dropdown = document.getElementById('pt-saved-groups-dropdown');
        const spawnBtn = document.getElementById('pt-spawn-group-btn');
        const groups = await getSetting(SAVED_GROUPS_KEY, {});
        const groupNames = Object.keys(groups).sort();
        const currentVal = dropdown.value;

        dropdown.innerHTML = '<option value="">-- Select a Group --</option>';
        groupNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            dropdown.appendChild(option);
        });
        dropdown.value = groupNames.includes(currentVal) ? currentVal : "";
        spawnBtn.disabled = !dropdown.value;
    }

    // --- UI Creation ---
    function createPowerToolsPanel() {
        const container = document.createElement('div');
        container.id = 'pt-container';
        container.innerHTML = `
            <div class="pt-spawner-controls">
                <select id="pt-saved-groups-dropdown"></select>
                <button id="pt-spawn-group-btn" disabled>Spawn</button>
                <input type="number" id="pt-spawn-count-input" min="1" title="Spawn Count" value="${DEFAULT_SPAWN_COUNT}">
            </div>
            <hr class="pt-divider">
            <div class="pt-controls-container">
                <button id="pt-manage-groups-btn">Manage Groups</button>
                <button id="pt-create-group-btn" disabled>Create</button>
            </div>
            <div class="pt-instructions">Ctrl+Click to select. Ctrl+Shift+Click to multi-spawn. </div>
        `;
        document.getElementById('sidebar').appendChild(container);

        getSetting(SPAWN_COUNT_KEY, DEFAULT_SPAWN_COUNT).then(count => {
            const input = document.getElementById('pt-spawn-count-input');
            input.value = count;
            input.addEventListener('change', () => setSetting(SPAWN_COUNT_KEY, parseInt(input.value, 10) || DEFAULT_SPAWN_COUNT));
        });
    }

    function addCustomStyles() {
        GM_addStyle(`
            /* Main panel styling */
            #pt-container { padding: 10px; border-top: 1px solid var(--border-color); background: var(--sidebar-bg); }
            .pt-header { font-size: 1.2em; text-align: center; font-weight: bold; margin-bottom: 10px; }
            .pt-divider { border: none; border-top: 1px solid var(--border-color); opacity: 0.5; margin: 10px 0; }
            .pt-spawner-controls { display: flex; gap: 8px; margin-bottom: 10px; }
            .pt-controls-container { display: flex; gap: 8px; }
            .pt-controls-container button, .pt-spawner-controls button { flex-shrink: 0; }
            .pt-controls-container button { flex-grow: 1; }
            #pt-saved-groups-dropdown { flex-grow: 1; }
            #pt-spawn-count-input { width: 60px; text-align: center; flex-shrink: 0; }
            #pt-spawn-group-btn:disabled, #pt-create-group-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            .pt-instructions { font-size: 0.8em; text-align: center; opacity: 0.6; margin-top: 8px; }
            .item.pt-multi-selected-item { background: linear-gradient(180deg, #6ea8ff, #428dff 80%) !important; color: white !important; border-color: #297bff !important; }

            /* --- Custom Modal Theme --- */
            #pt-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; z-index: 10000; font-family: sans-serif; }
            #pt-modal-box { background: #2c2c2c; color: #e0e0e0; border: 1px solid #555; width: 95vw; max-width: 800px; height: 80vh; border-radius: 8px; display: flex; flex-direction: column; box-shadow: 0 10px 30px #000; }
            .pt-modal-header { display: flex; justify-content: space-between; align-items: center; padding: 0 20px; border-bottom: 1px solid #444; flex-shrink: 0; }
            .pt-modal-instructions { text-align: center; padding: 8px 20px; font-size: 0.9em; background: #333; border-bottom: 1px solid #444; flex-shrink: 0; }
            #pt-modal-close-btn { background: none; border: none; font-size: 1.5em; cursor: pointer; color: #e0e0e0; opacity: 0.7; }
            #pt-modal-close-btn:hover { opacity: 1; }
            .pt-modal-content { display: flex; padding: 10px; gap: 10px; flex-grow: 1; overflow: hidden; }
            .pt-modal-panel { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #333; padding: 10px; border-radius: 5px; }
            .pt-modal-panel h4 { text-align: center; margin: 0 0 10px 0; flex-shrink: 0; }
            .pt-modal-panel input[type="text"] { margin-bottom: 10px; flex-shrink: 0; background: #444; color: #e0e0e0; border: 1px solid #666; padding: 8px; border-radius: 4px; }
            .pt-modal-controls { flex-shrink: 0; margin-bottom: 10px; }
            .pt-item-list { list-style: none; padding: 0; margin: 0; overflow-y: auto; }
            .pt-item-list li { display: flex; justify-content: space-between; align-items: center; padding: 6px; border-radius: 3px; cursor: pointer; margin-bottom: 4px; background: #444; }
            .pt-item-list li:hover { background-color: #555; }
            .pt-item-list li.pt-empty-list { justify-content: center; opacity: 0.6; cursor: default; background: none !important; }
            #pt-modal-group-list li.pt-active { background-color: #4a90e2; color: white; font-weight: bold; }
            .pt-modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 10px 20px; border-top: 1px solid #444; flex-shrink: 0; background: #333; }
            #pt-modal-box button { background-color: #555; color: #fff; border: 1px solid #666; padding: 8px 12px; border-radius: 4px; cursor: pointer; }
            #pt-modal-box button:hover { background-color: #666; }
            #pt-modal-box button:disabled { background-color: #444; color: #888; cursor: not-allowed; }
            .pt-danger-btn { background-color: #c94040 !important; }
            .pt-danger-btn:hover { background-color: #e06363 !important; }
        `);
    }

    // --- Spawning & Utility ---
    function spawnItemsInCenter(items, count = 1) {
        if (!items || items.length === 0) return;
        const createInstance = unsafeWindow.IC.createInstance;
        const sidebarWidth = document.getElementById('sidebar')?.offsetWidth ?? 300;
        const canvasCenterX = sidebarWidth + (window.innerWidth - sidebarWidth) / 2;
        const canvasCenterY = window.innerHeight / 2;
        items.forEach(itemData => {
            for (let i = 0; i < count; i++) {
                createInstance({ ...itemData, x: canvasCenterX + (Math.random()*250 - 125), y: canvasCenterY + (Math.random()*250 - 125), animate: true });
            }
        });
    }

    const getItemData = (element) => ({ text: element.getAttribute('data-item-text'), emoji: element.getAttribute('data-item-emoji'), id: element.getAttribute('data-item-id'), discovery: element.hasAttribute('data-item-discovery') });
    const isElementInPanel = (element) => element.closest('#pt-container, #pt-modal-overlay');

    // --- Script Entry Point ---
    function waitForGame() {
        const interval = setInterval(() => {
            if (document.querySelector(".container")?.__vue__?.items) {
                clearInterval(interval);
                initializeAllFeatures();
            }
        }, 200);
    }

    waitForGame();
})();