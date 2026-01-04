// ==UserScript==
// @name         NHentai Search Enhancer
// @namespace    http://tampermonkey.net/
// @version      3.6.17
// @description  Enhanced NHentai search with artist field, fixed auto-harvest with correct namespaces and clean names, tag type support, tabbed UI, bulk edit in search tab with tooltips, clear search, library import/export/remove/reset with removable tag chips, tooltips, help documentation, and multi-tab/window support with toggleable tag synchronization.
// @author       FunkyJustin
// @match        https://nhentai.net/*
// @exclude      https://nhentai.net/g/*/*/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530303/NHentai%20Search%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/530303/NHentai%20Search%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Storage Keys and Defaults
    const GLOBAL_STORAGE_KEY = 'nhentai_search_enhancer_global_state';
    const GLOBAL_LOCK_KEY = 'nhentai_search_enhancer_global_lock';
    const LOCAL_STORAGE_KEY = 'nhentai_search_enhancer_local_state';
    const SYNCED_STORAGE_KEY = 'nhentai_search_enhancer_synced_state';
    const defaultGlobalState = {
        library: [
            { type: 'tag', name: 'doujinshi' },
            { type: 'tag', name: 'mature' },
            { type: 'tag', name: 'romance' },
            { type: 'tag', name: 'yaoi' },
            { type: 'tag', name: 'action' },
            { type: 'tag', name: 'comedy' },
            { type: 'tag', name: 'schoolgirl' },
            { type: 'tag', name: 'tentacles' },
            { type: 'tag', name: 'yuri' },
            { type: 'tag', name: 'bondage' },
            { type: 'tag', name: 'big breasts' },
            { type: 'tag', name: 'glasses' },
            { type: 'tag', name: 'netorare' },
            { type: 'tag', name: 'vanilla' },
            { type: 'tag', name: 'monster girl' }
        ],
        autoHarvest: true,
        defaultTagType: 'tag',
        syncTags: false,
        position: null
    };

    function loadGlobalState() {
        try {
            const saved = JSON.parse(localStorage.getItem(GLOBAL_STORAGE_KEY));
            if (!saved) return structuredClone(defaultGlobalState);
            return {
                library: Array.isArray(saved.library) ? saved.library : [...defaultGlobalState.library],
                autoHarvest: saved.autoHarvest !== undefined ? saved.autoHarvest : true,
                defaultTagType: saved.defaultTagType || 'tag',
                syncTags: saved.syncTags !== undefined ? saved.syncTags : false,
                position: saved.position || null
            };
        } catch(e) {
            console.error('Error loading global state:', e);
            return structuredClone(defaultGlobalState);
        }
    }

    function saveGlobalState() {
        try {
            const lock = localStorage.getItem(GLOBAL_LOCK_KEY);
            if (lock && Date.now() - parseInt(lock) < 5000) {
                setTimeout(saveGlobalState, 100);
                return;
            }
            localStorage.setItem(GLOBAL_LOCK_KEY, Date.now().toString());
            localStorage.setItem(GLOBAL_STORAGE_KEY, JSON.stringify(globalState));
            localStorage.removeItem(GLOBAL_LOCK_KEY);
        } catch(e) {
            console.error('Error saving global state:', e);
        }
    }

    let globalState = loadGlobalState();

    // Load and manage local state
    const defaultLocalState = {
        included: [],
        excluded: [],
        language: 'english',
        lastSearchTime: 0
    };

    function loadLocalState() {
        try {
            if (globalState.syncTags) {
                const savedSynced = JSON.parse(localStorage.getItem(SYNCED_STORAGE_KEY));
                return savedSynced || structuredClone(defaultLocalState);
            } else {
                const savedLocal = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_KEY));
                return savedLocal || structuredClone(defaultLocalState);
            }
        } catch(e) {
            console.error('Error loading local state:', e);
            return structuredClone(defaultLocalState);
        }
    }

    function saveLocalState() {
        try {
            if (globalState.syncTags) {
                const existingSynced = JSON.parse(localStorage.getItem(SYNCED_STORAGE_KEY)) || defaultLocalState;
                if (localState.lastSearchTime >= existingSynced.lastSearchTime) {
                    localStorage.setItem(SYNCED_STORAGE_KEY, JSON.stringify(localState));
                }
            } else {
                sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localState));
            }
        } catch(e) {
            console.error('Error saving local state:', e);
        }
    }

    let localState = loadLocalState();

    window.addEventListener('storage', (event) => {
        if (event.key === GLOBAL_STORAGE_KEY && event.newValue) {
            try {
                const newState = JSON.parse(event.newValue);
                const currentLibrary = globalState.library;
                const newLibrary = newState.library || [];
                const combinedLibrary = [...new Set([...currentLibrary, ...newLibrary]
                    .map(item => `${item.type}:${item.name}`))]
                    .map(str => {
                        const [type, ...nameParts] = str.split(':');
                        return { type, name: nameParts.join(':') };
                    });
                globalState.library = combinedLibrary;
                globalState.syncTags = newState.syncTags !== undefined ? newState.syncTags : globalState.syncTags;
                saveGlobalState();
                if (currentTab === 'search') {
                    refreshTagChips();
                } else if (currentTab === 'library') {
                    renderLibraryContent();
                } else if (currentTab === 'settings') {
                    renderSettingsContent();
                }
            } catch(e) {
                console.error('Error syncing global state:', e);
            }
        } else if (event.key === SYNCED_STORAGE_KEY && event.newValue && globalState.syncTags) {
            try {
                const newSyncedState = JSON.parse(event.newValue);
                if (newSyncedState.lastSearchTime > localState.lastSearchTime) {
                    localState = newSyncedState;
                    if (currentTab === 'search') {
                        searchContent.innerHTML = '';
                        renderSearchContent();
                    }
                }
            } catch(e) {
                console.error('Error syncing local state:', e);
            }
        }
    });

    function styleButton(btn) {
        btn.style.border = '1px solid #666';
        btn.style.borderRadius = '4px';
        btn.style.backgroundColor = '#4a4a4a';
        btn.style.color = '#eee';
        btn.style.padding = '4px 8px';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'background-color 0.2s, color 0.2s';
        btn.addEventListener('mouseenter', () => btn.style.backgroundColor = '#5a5a5a');
        btn.addEventListener('mouseleave', () => btn.style.backgroundColor = '#4a4a4a');
        btn.addEventListener('mousedown', () => btn.style.backgroundColor = '#6a6a6a');
        btn.addEventListener('mouseup', () => btn.style.backgroundColor = '#5a5a5a');
    }

    function fuzzyMatch(query, tag) {
        let q = query.toLowerCase();
        let t = tag.toLowerCase();
        let i = 0, j = 0;
        let matchIndices = [];
        while (i < q.length && j < t.length) {
            if (q[i] === t[j]) {
                matchIndices.push(j);
                i++;
            }
            j++;
        }
        return i === q.length ? matchIndices : null;
    }

    function createTooltipIcon(tooltipText) {
        const icon = document.createElement('span');
        icon.textContent = 'ℹ';
        icon.style.marginLeft = '5px';
        icon.style.color = '#aaa';
        icon.style.cursor = 'pointer';
        icon.style.fontSize = '12px';
        icon.style.display = 'inline-flex';
        icon.style.alignItems = 'center';
        icon.style.justifyContent = 'center';
        icon.style.width = '16px';
        icon.style.height = '16px';
        icon.style.border = '1px solid #aaa';
        icon.style.borderRadius = '50%';

        const tooltip = document.createElement('div');
        tooltip.innerHTML = tooltipText;
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = '#555';
        tooltip.style.color = '#eee';
        tooltip.style.padding = '10px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '12px';
        tooltip.style.zIndex = '10003';
        tooltip.style.maxWidth = '300px';
        tooltip.style.textAlign = 'left';
        tooltip.style.wordWrap = 'break-word';
        tooltip.style.boxShadow = '0 2px 4px rgba(0,0,0,0.5)';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.2s';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.top = '100%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';

        document.body.appendChild(tooltip);

        icon.addEventListener('mouseenter', () => {
            const iconRect = icon.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            const spaceBelow = window.innerHeight - iconRect.bottom;
            const spaceAbove = iconRect.top;
            const spaceRight = window.innerWidth - iconRect.right;
            const spaceLeft = iconRect.left;

            if (spaceBelow < tooltipRect.height && spaceAbove > tooltipRect.height) {
                tooltip.style.top = (iconRect.top - tooltipRect.height - 5) + 'px';
                tooltip.style.bottom = 'auto';
            } else {
                tooltip.style.top = (iconRect.bottom + 5) + 'px';
                tooltip.style.bottom = 'auto';
            }

            if (spaceRight < tooltipRect.width && spaceLeft > tooltipRect.width) {
                tooltip.style.left = (iconRect.left - tooltipRect.width - 5) + 'px';
                tooltip.style.right = 'auto';
                tooltip.style.transform = 'none';
            } else if (spaceLeft < tooltipRect.width && spaceRight > tooltipRect.width) {
                tooltip.style.left = (iconRect.right + 5) + 'px';
                tooltip.style.right = 'auto';
                tooltip.style.transform = 'none';
            } else {
                tooltip.style.left = (iconRect.left + iconRect.width / 2) + 'px';
                tooltip.style.right = 'auto';
                tooltip.style.transform = 'translateX(-50%)';
            }

            tooltip.style.opacity = '1';
        });

        icon.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });

        icon.addEventListener('click', (e) => e.stopPropagation());

        return icon;
    }

    function createTagChip(item, container, isExcluded = false, updatePreviewCallback) {
        const chip = document.createElement('div');
        chip.style.display = 'inline-flex';
        chip.style.alignItems = 'center';
        chip.style.backgroundColor = '#555';
        chip.style.border = '1px solid #666';
        chip.style.borderRadius = '4px';
        chip.style.padding = '2px 6px';
        chip.style.margin = '4px';
        chip.style.color = '#fff';
        chip.style.fontSize = '12px';
        chip.style.zIndex = '11000';
        chip.style.position = 'relative';
        chip.addEventListener('mouseenter', () => chip.style.backgroundColor = '#666');
        chip.addEventListener('mouseleave', () => chip.style.backgroundColor = '#555');

        const text = document.createElement('span');
        text.textContent = `${item.type === 'language' ? '' : item.type + ':'}${item.name}`;
        text.style.marginRight = '6px';
        chip.appendChild(text);

        const removeBtn = document.createElement('span');
        removeBtn.textContent = '×';
        removeBtn.style.color = '#ff4444';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.padding = '0 4px';
        removeBtn.style.fontWeight = 'bold';
        removeBtn.style.zIndex = '11001';
        removeBtn.style.pointerEvents = 'auto';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log(`Removing tag: ${item.type}:${item.name}`);
            const array = isExcluded ? localState.excluded : localState.included;
            const index = array.findIndex(i => i.type === item.type && i.name === item.name);
            if (index !== -1) {
                array.splice(index, 1);
                container.removeChild(chip);
                updateTagCount(isExcluded ? excludeLabel : includeLabel, array.length);
                saveLocalState();
                updatePreviewCallback();
            } else {
                console.error('Tag not found in array:', item);
            }
        });
        chip.appendChild(removeBtn);

        container.appendChild(chip);
        return chip;
    }

    const container = document.createElement('div');
    container.style.position = 'fixed';
    if (globalState.position) {
        container.style.left = globalState.position.left;
        container.style.top = globalState.position.top;
        container.style.right = 'auto';
    } else {
        container.style.top = '10px';
        container.style.right = '10px';
    }
    container.style.width = '340px';
    container.style.minWidth = '250px';
    container.style.minHeight = '200px';
    container.style.backgroundColor = '#333';
    container.style.padding = '0';
    container.style.border = '1px solid #666';
    container.style.borderRadius = '6px';
    container.style.zIndex = '10000';
    container.style.fontSize = '14px';
    container.style.color = '#eee';
    container.style.boxShadow = '0 4px 8px rgba(0,0,0,0.6)';
    container.style.userSelect = 'none';
    container.style.overflow = 'hidden';

    const header = document.createElement('div');
    header.style.backgroundColor = '#444';
    header.style.padding = '10px';
    header.style.cursor = 'move';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.borderBottom = '1px solid #666';

    const title = document.createElement('span');
    title.textContent = 'NHentai Search Enhancer';
    title.style.fontWeight = 'bold';
    header.appendChild(title);

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '–';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.border = 'none';
    toggleBtn.style.background = 'transparent';
    toggleBtn.style.fontSize = '16px';
    toggleBtn.style.lineHeight = '16px';
    toggleBtn.style.padding = '0 5px';
    toggleBtn.style.color = '#eee';
    header.appendChild(toggleBtn);

    container.appendChild(header);
    document.body.appendChild(container);

    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    header.addEventListener('mousedown', function(e) {
        if (e.target !== toggleBtn) {
            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
        }
    });

    function drag(e) {
        if (!isDragging) return;
        container.style.left = (e.clientX - offsetX) + 'px';
        container.style.top = (e.clientY - offsetY) + 'px';
        container.style.right = 'auto';
    }

    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        globalState.position = { left: container.style.left, top: container.style.top };
        saveGlobalState();
    }

    const content = document.createElement('div');
    content.style.padding = '15px';
    container.appendChild(content);

    const tabButtons = document.createElement('div');
    tabButtons.style.display = 'flex';
    tabButtons.style.justifyContent = 'space-around';
    tabButtons.style.marginBottom = '15px';

    const searchTabBtn = document.createElement('button');
    searchTabBtn.textContent = 'Search';
    searchTabBtn.style.flex = '1';
    styleButton(searchTabBtn);

    const libraryTabBtn = document.createElement('button');
    libraryTabBtn.textContent = 'Library';
    libraryTabBtn.style.flex = '1';
    styleButton(libraryTabBtn);

    const settingsTabBtn = document.createElement('button');
    settingsTabBtn.textContent = 'Settings';
    settingsTabBtn.style.flex = '1';
    styleButton(settingsTabBtn);

    tabButtons.appendChild(searchTabBtn);
    tabButtons.appendChild(libraryTabBtn);
    tabButtons.appendChild(settingsTabBtn);
    content.appendChild(tabButtons);

    const searchContent = document.createElement('div');
    const libraryContent = document.createElement('div');
    const settingsContent = document.createElement('div');

    content.appendChild(searchContent);
    content.appendChild(libraryContent);
    content.appendChild(settingsContent);

    let currentTab = 'search';
    let includeLabel, excludeLabel;
    let includeTagContainer, excludeTagContainer;
    let previewElement;

    function setActiveTab(tab) {
        currentTab = tab;
        searchContent.style.display = 'none';
        libraryContent.style.display = 'none';
        settingsContent.style.display = 'none';
        searchTabBtn.style.backgroundColor = '#4a4a4a';
        libraryTabBtn.style.backgroundColor = '#4a4a4a';
        settingsTabBtn.style.backgroundColor = '#4a4a4a';

        if (tab === 'search') {
            searchContent.style.display = 'block';
            searchTabBtn.style.backgroundColor = '#6a6a6a';
            if (!searchContent.children.length) renderSearchContent();
        } else if (tab === 'library') {
            libraryContent.style.display = 'block';
            libraryTabBtn.style.backgroundColor = '#6a6a6a';
            if (!libraryContent.children.length) renderLibraryContent();
        } else if (tab === 'settings') {
            settingsContent.style.display = 'block';
            settingsTabBtn.style.backgroundColor = '#6a6a6a';
            if (!settingsContent.children.length) renderSettingsContent();
        }
    }

    searchTabBtn.addEventListener('click', () => setActiveTab('search'));
    libraryTabBtn.addEventListener('click', () => setActiveTab('library'));
    settingsTabBtn.addEventListener('click', () => setActiveTab('settings'));
    setActiveTab('search');

    const resizer = document.createElement('div');
    resizer.style.width = '10px';
    resizer.style.height = '10px';
    resizer.style.background = 'transparent';
    resizer.style.position = 'absolute';
    resizer.style.right = '0';
    resizer.style.bottom = '0';
    resizer.style.cursor = 'se-resize';
    container.appendChild(resizer);

    let isResizing = false;
    resizer.addEventListener('mousedown', function(e) {
        isResizing = true;
        e.stopPropagation();
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    });

    function resize(e) {
        if (!isResizing) return;
        const newWidth = e.clientX - container.getBoundingClientRect().left;
        const newHeight = e.clientY - container.getBoundingClientRect().top;
        if (newWidth > 250) container.style.width = newWidth + 'px';
        if (newHeight > 150) container.style.height = newHeight + 'px';
    }

    function stopResize() {
        isResizing = false;
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }

    let isMinimized = false;
    const originalMinHeight = container.style.minHeight || '200px';
    toggleBtn.addEventListener('click', function() {
        isMinimized = !isMinimized;
        if (isMinimized) {
            content.style.display = 'none';
            resizer.style.display = 'none';
            container.style.minHeight = '0';
            container.style.height = header.offsetHeight + 'px';
            toggleBtn.textContent = '+';
        } else {
            content.style.display = 'block';
            resizer.style.display = 'block';
            container.style.minHeight = originalMinHeight;
            container.style.height = '';
            toggleBtn.textContent = '–';
        }
    });

    function updateTagCount(label, count) {
        label.textContent = label.textContent.replace(/\(\d+\)/, '') + (count > 0 ? ` (${count})` : '');
    }

    function updatePreview() {
        if (!previewElement) return;
        let queryParts = [];
        localState.included.forEach(item => queryParts.push(`${item.type}:"${item.name}"`));
        localState.excluded.forEach(item => queryParts.push(`-${item.type}:"${item.name}"`));
        if (localState.language !== 'none') queryParts.push(`language:"${localState.language}"`);
        previewElement.textContent = 'Preview: ' + (queryParts.length > 0 ? queryParts.join(' ') : 'No search criteria set');
    }

    function createAutoSuggestField(labelText, container, isExcluded = false) {
        const wrapper = document.createElement('div');
        wrapper.style.marginBottom = '15px';
        wrapper.style.position = 'relative';

        const labelWrapper = document.createElement('div');
        labelWrapper.style.display = 'flex';
        labelWrapper.style.alignItems = 'center';
        labelWrapper.style.justifyContent = 'space-between';
        labelWrapper.style.marginBottom = '5px';

        const labelWithTooltip = document.createElement('div');
        labelWithTooltip.style.display = 'flex';
        labelWithTooltip.style.alignItems = 'center';

        const label = document.createElement('label');
        label.textContent = labelText + (isExcluded ? localState.excluded.length > 0 ? ` (${localState.excluded.length})` : '' : localState.included.length > 0 ? ` (${localState.included.length})` : '');
        label.style.display = 'block';
        labelWithTooltip.appendChild(label);

        const tooltipText = isExcluded
            ? `<strong>Exclude Tags Tooltip</strong><br>
               • Adds tags to exclude from your search query.<br>
               • Tags in the library are suggested as you type.<br>
               • To search tags not yet added in the library, type the tag in the exclude tags search field and select its tag type from the dropdown menu to the left before pressing enter.<br>
               • Example: Type 'netorare' to exclude 'tag:netorare'.`
            : `<strong>Include Tags Tooltip</strong><br>
               • Adds tags to include in your search query.<br>
               • Tags in the library are suggested as you type.<br>
               • To search tags not yet added in the library, type the tag in the include tags search field and select its tag type from the dropdown menu to the left before pressing enter.<br>
               • Example: Type 'yuri' to include 'tag:yuri'.`;
        labelWithTooltip.appendChild(createTooltipIcon(tooltipText));
        labelWrapper.appendChild(labelWithTooltip);

        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear';
        clearBtn.style.fontSize = '12px';
        clearBtn.style.padding = '2px 6px';
        styleButton(clearBtn);
        clearBtn.addEventListener('click', () => {
            const array = isExcluded ? localState.excluded : localState.included;
            array.length = 0;
            const tagContainer = isExcluded ? excludeTagContainer : includeTagContainer;
            tagContainer.innerHTML = '';
            updateTagCount(label, 0);
            saveLocalState();
            updatePreview();
        });
        labelWrapper.appendChild(clearBtn);

        wrapper.appendChild(labelWrapper);

        if (isExcluded) excludeLabel = label;
        else includeLabel = label;

        const tagTypeRow = document.createElement('div');
        tagTypeRow.style.display = 'flex';
        tagTypeRow.style.gap = '5px';

        const tagTypeSelect = document.createElement('select');
        tagTypeSelect.style.width = '100px';
        tagTypeSelect.style.padding = '4px';
        tagTypeSelect.style.border = '1px solid #666';
        tagTypeSelect.style.borderRadius = '4px';
        tagTypeSelect.style.backgroundColor = '#444';
        tagTypeSelect.style.color = '#eee';
        tagTypeSelect.value = globalState.defaultTagType;

        ['tag', 'artist', 'parody', 'group', 'category', 'character', 'language'].forEach(type => {
            const opt = document.createElement('option');
            opt.value = type;
            opt.textContent = type;
            tagTypeSelect.appendChild(opt);
        });
        tagTypeRow.appendChild(tagTypeSelect);

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Search or add a ${labelText.toLowerCase().replace('tags', 'tag').replace('exclude', 'tag to exclude')}...`;
        input.style.flex = '1';
        input.style.padding = '4px';
        input.style.border = '1px solid #666';
        input.style.borderRadius = '4px';
        input.style.backgroundColor = '#444';
        input.style.color = '#eee';
        tagTypeRow.appendChild(input);

        wrapper.appendChild(tagTypeRow);

        const tagContainer = document.createElement('div');
        tagContainer.style.display = 'flex';
        tagContainer.style.flexWrap = 'wrap';
        tagContainer.style.marginTop = '5px';
        tagContainer.style.position = 'relative';
        tagContainer.style.zIndex = '11000';
        wrapper.appendChild(tagContainer);

        if (isExcluded) excludeTagContainer = tagContainer;
        else includeTagContainer = tagContainer;

        const suggestBox = document.createElement('div');
        suggestBox.style.position = 'absolute';
        suggestBox.style.top = '100%';
        suggestBox.style.left = '0';
        suggestBox.style.width = '100%';
        suggestBox.style.backgroundColor = '#444';
        suggestBox.style.border = '1px solid #666';
        suggestBox.style.borderTop = 'none';
        suggestBox.style.display = 'none';
        suggestBox.style.maxHeight = '100px';
        suggestBox.style.overflowY = 'auto';
        suggestBox.style.zIndex = '9999';
        wrapper.appendChild(suggestBox);

        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                suggestBox.style.display = 'none';
                input.value = '';
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                e.preventDefault();
                const val = input.value.trim();
                let item;
                const matchedItem = globalState.library.find(i => i.name.toLowerCase() === val.toLowerCase());
                if (matchedItem) {
                    item = { type: matchedItem.type, name: matchedItem.name };
                } else {
                    item = { type: tagTypeSelect.value, name: val };
                }
                const array = isExcluded ? localState.excluded : localState.included;
                if (!array.some(i => i.type === item.type && i.name === item.name)) {
                    array.push(item);
                    createTagChip(item, tagContainer, isExcluded, updatePreview);
                    updateTagCount(label, array.length);
                    saveLocalState();
                    updatePreview();
                }
                suggestBox.style.display = 'none';
                input.value = '';
            }
        });

        input.addEventListener('input', function() {
            const query = input.value.trim().toLowerCase();
            if (!query) {
                suggestBox.innerHTML = '';
                suggestBox.style.display = 'none';
                return;
            }
            const filtered = globalState.library.filter(item => {
                const matchIndices = fuzzyMatch(query, item.name);
                return matchIndices !== null;
            });
            if (filtered.length === 0) {
                suggestBox.innerHTML = '';
                suggestBox.style.display = 'none';
                return;
            }
            suggestBox.innerHTML = '';
            filtered.forEach(item => {
                const tag = item.name;
                const matchIndices = fuzzyMatch(query, tag);
                const itemElem = document.createElement('div');
                itemElem.style.padding = '5px';
                itemElem.style.borderBottom = '1px solid #666';
                itemElem.style.cursor = 'pointer';
                itemElem.style.borderRadius = '3px';

                const typeSpan = document.createElement('span');
                typeSpan.textContent = `${item.type}:`;
                typeSpan.style.color = '#aaa';
                itemElem.appendChild(typeSpan);

                let lastIndex = 0;
                const nameParts = [];
                matchIndices.forEach(index => {
                    if (lastIndex < index) {
                        nameParts.push(document.createTextNode(tag.slice(lastIndex, index)));
                    }
                    const matchedChar = document.createElement('span');
                    matchedChar.textContent = tag[index];
                    matchedChar.style.color = '#ffd700';
                    nameParts.push(matchedChar);
                    lastIndex = index + 1;
                });
                if (lastIndex < tag.length) {
                    nameParts.push(document.createTextNode(tag.slice(lastIndex)));
                }
                nameParts.forEach(part => itemElem.appendChild(part));

                itemElem.addEventListener('mouseover', () => itemElem.style.backgroundColor = '#555');
                itemElem.addEventListener('mouseout', () => itemElem.style.backgroundColor = '#444');
                itemElem.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const val = tag;
                    const itemToAdd = { type: item.type, name: val };
                    const array = isExcluded ? localState.excluded : localState.included;
                    if (!array.some(i => i.type === itemToAdd.type && i.name === itemToAdd.name)) {
                        array.push(itemToAdd);
                        createTagChip(itemToAdd, tagContainer, isExcluded, updatePreview);
                        updateTagCount(label, array.length);
                        saveLocalState();
                        updatePreview();
                    }
                    suggestBox.style.display = 'none';
                    input.value = '';
                });
                suggestBox.appendChild(itemElem);
            });
            suggestBox.style.display = 'block';
        });

        (isExcluded ? localState.excluded : localState.included).forEach(item => createTagChip(item, tagContainer, isExcluded, updatePreview));

        return { wrapper, input };
    }

    function refreshTagChips() {
        if (includeTagContainer) {
            includeTagContainer.innerHTML = '';
            localState.included.forEach(item => createTagChip(item, includeTagContainer, false, updatePreview));
            updateTagCount(includeLabel, localState.included.length);
        }
        if (excludeTagContainer) {
            excludeTagContainer.innerHTML = '';
            localState.excluded.forEach(item => createTagChip(item, excludeTagContainer, true, updatePreview));
            updateTagCount(excludeLabel, localState.excluded.length);
        }
        updatePreview();
    }

    function renderSearchContent() {
        const includeField = createAutoSuggestField('Include tags', searchContent);
        searchContent.appendChild(includeField.wrapper);

        const excludeField = createAutoSuggestField('Exclude tags', searchContent, true);
        searchContent.appendChild(excludeField.wrapper);

        const languageWrapper = document.createElement('div');
        languageWrapper.style.marginBottom = '15px';

        const languageLabel = document.createElement('label');
        languageLabel.textContent = 'Language:';
        languageLabel.style.display = 'block';
        languageLabel.style.marginBottom = '5px';
        languageWrapper.appendChild(languageLabel);

        const languageSelect = document.createElement('select');
        languageSelect.style.width = '100%';
        languageSelect.style.padding = '4px';
        languageSelect.style.border = '1px solid #666';
        languageSelect.style.borderRadius = '4px';
        languageSelect.style.backgroundColor = '#444';
        languageSelect.style.color = '#eee';

        ['none', 'english', 'japanese', 'chinese'].forEach(lang => {
            const opt = document.createElement('option');
            opt.value = lang;
            opt.textContent = lang;
            languageSelect.appendChild(opt);
        });
        languageSelect.value = localState.language;

        languageSelect.addEventListener('change', () => {
            localState.language = languageSelect.value;
            updatePreview();
            saveLocalState();
        });

        languageWrapper.appendChild(languageSelect);
        searchContent.appendChild(languageWrapper);

        const bulkEditBtn = document.createElement('button');
        bulkEditBtn.textContent = 'Bulk Edit';
        styleButton(bulkEditBtn);
        bulkEditBtn.style.width = '100%';
        bulkEditBtn.style.marginBottom = '10px';
        searchContent.appendChild(bulkEditBtn);

        bulkEditBtn.addEventListener('click', () => {
            createModal('Bulk Edit Search Tags', (contentArea) => {
                const includeLabelWrapper = document.createElement('div');
                includeLabelWrapper.style.display = 'flex';
                includeLabelWrapper.style.alignItems = 'center';
                includeLabelWrapper.style.marginBottom = '5px';

                const includeLabel = document.createElement('label');
                includeLabel.textContent = 'Included Tags:';
                includeLabel.style.display = 'block';
                includeLabelWrapper.appendChild(includeLabel);

                includeLabelWrapper.appendChild(createTooltipIcon(
                    `<strong>Bulk Edit Included Tags</strong><br>
                     • Edit the list of tags to include in your search.<br>
                     • One tag per line in the format type:name.<br>
                     • Invalid entries are ignored.<br>
                     • Example: Add 'tag:yuri' on a new line to include it.`
                ));
                contentArea.appendChild(includeLabelWrapper);

                const includeTextarea = document.createElement('textarea');
                includeTextarea.style.width = '100%';
                includeTextarea.style.height = '100px';
                includeTextarea.style.padding = '4px';
                includeTextarea.style.border = '1px solid #666';
                includeTextarea.style.borderRadius = '4px';
                includeTextarea.style.backgroundColor = '#444';
                includeTextarea.style.color = '#eee';
                includeTextarea.value = localState.included.map(item => `${item.type}:${item.name}`).join('\n');
                contentArea.appendChild(includeTextarea);

                const excludeLabelWrapper = document.createElement('div');
                excludeLabelWrapper.style.display = 'flex';
                excludeLabelWrapper.style.alignItems = 'center';
                excludeLabelWrapper.style.marginTop = '15px';
                excludeLabelWrapper.style.marginBottom = '5px';

                const excludeLabel = document.createElement('label');
                excludeLabel.textContent = 'Excluded Tags:';
                excludeLabel.style.display = 'block';
                excludeLabelWrapper.appendChild(excludeLabel);

                excludeLabelWrapper.appendChild(createTooltipIcon(
                    `<strong>Bulk Edit Excluded Tags</strong><br>
                     • Edit the list of tags to exclude from your search.<br>
                     • One tag per line in the format type:name.<br>
                     • Invalid entries are ignored.<br>
                     • Example: Add 'tag:netorare' on a new line to exclude it.`
                ));
                contentArea.appendChild(excludeLabelWrapper);

                const excludeTextarea = document.createElement('textarea');
                excludeTextarea.style.width = '100%';
                excludeTextarea.style.height = '100px';
                excludeTextarea.style.padding = '4px';
                excludeTextarea.style.border = '1px solid #666';
                excludeTextarea.style.borderRadius = '4px';
                excludeTextarea.style.backgroundColor = '#444';
                excludeTextarea.style.color = '#eee';
                excludeTextarea.value = localState.excluded.map(item => `${item.type}:${item.name}`).join('\n');
                contentArea.appendChild(excludeTextarea);

                const note = document.createElement('p');
                note.style.fontSize = '12px';
                note.style.color = '#aaa';
                note.style.marginTop = '10px';
                note.textContent = 'Format: type:name (e.g., tag:yuri). One tag per line.';
                contentArea.appendChild(note);
            }, (contentArea) => {
                const validTypes = ['tag', 'artist', 'parody', 'group', 'category', 'character', 'language'];

                const includeTextarea = contentArea.querySelector('textarea:nth-child(2)');
                const includeLines = includeTextarea.value.split('\n').filter(line => line.trim());
                localState.included = includeLines.map(line => {
                    const [type, ...nameParts] = line.split(':');
                    const name = nameParts.join(':').trim();
                    return { type: type.trim(), name };
                }).filter(item => validTypes.includes(item.type) && item.name);

                const excludeTextarea = contentArea.querySelector('textarea:nth-child(4)');
                const excludeLines = excludeTextarea.value.split('\n').filter(line => line.trim());
                localState.excluded = excludeLines.map(line => {
                    const [type, ...nameParts] = line.split(':');
                    const name = nameParts.join(':').trim();
                    return { type: type.trim(), name };
                }).filter(item => validTypes.includes(item.type) && item.name);

                saveLocalState();
                searchContent.innerHTML = '';
                renderSearchContent();
            });
        });

        const clearSearchBtn = document.createElement('button');
        clearSearchBtn.textContent = "Clear Search";
        styleButton(clearSearchBtn);
        clearSearchBtn.style.width = '100%';
        clearSearchBtn.style.marginBottom = '10px';
        searchContent.appendChild(clearSearchBtn);

        clearSearchBtn.addEventListener('click', () => {
            localState.included = [];
            localState.excluded = [];
            localState.language = 'english';
            localState.lastSearchTime = 0;
            searchContent.innerHTML = '';
            renderSearchContent();
            updateTagCount(includeLabel, 0);
            updateTagCount(excludeLabel, 0);
            saveLocalState();
            updatePreview();
        });

        const searchButton = document.createElement('button');
        searchButton.textContent = 'Search NHentai';
        styleButton(searchButton);
        searchButton.style.width = '100%';
        searchButton.style.padding = '6px';
        searchContent.appendChild(searchButton);

        searchButton.addEventListener('click', () => {
            let queryParts = [];
            localState.included.forEach(item => queryParts.push(`${item.type}:"${item.name}"`));
            localState.excluded.forEach(item => queryParts.push(`-${item.type}:"${item.name}"`));
            if (localState.language !== 'none') queryParts.push(`language:"${localState.language}"`);
            const finalQuery = queryParts.join(' ');
            const encodedQuery = encodeURIComponent(finalQuery);
            localState.lastSearchTime = Date.now();
            saveLocalState();
            window.location.href = `https://nhentai.net/search/?q=${encodedQuery}`;
        });

        previewElement = document.createElement('div');
        previewElement.style.marginTop = '15px';
        previewElement.style.fontSize = '12px';
        previewElement.style.color = '#bbb';
        previewElement.style.wordWrap = 'break-word';
        searchContent.appendChild(previewElement);

        updatePreview();
    }

    function renderLibraryContent() {
        libraryContent.innerHTML = '';
        const librarySection = document.createElement('div');
        librarySection.style.marginBottom = '15px';

        const addItemLabelWrapper = document.createElement('div');
        addItemLabelWrapper.style.display = 'flex';
        addItemLabelWrapper.style.alignItems = 'center';
        addItemLabelWrapper.style.marginBottom = '5px';

        const addItemLabel = document.createElement('label');
        addItemLabel.textContent = 'Add to Library:';
        addItemLabelWrapper.appendChild(addItemLabel);
        addItemLabelWrapper.appendChild(createTooltipIcon(`<strong>Add to Library Tooltip</strong><br>
            • Add new tags to your library for future searches.<br>
            • Select a tag type (e.g., 'artist'), type a name (e.g., 'chihel'), and click "Add".<br>
            • Example: Add 'artist:chihel' to the library.`));
        librarySection.appendChild(addItemLabelWrapper);

        const addItemRow = document.createElement('div');
        addItemRow.style.display = 'flex';
        addItemRow.style.gap = '5px';
        addItemRow.style.flexWrap = 'wrap';

        const addItemInput = document.createElement('input');
        addItemInput.type = 'text';
        addItemInput.placeholder = 'Enter new item...';
        addItemInput.style.flex = '1';
        addItemInput.style.padding = '4px';
        addItemInput.style.border = '1px solid #666';
        addItemInput.style.borderRadius = '4px';
        addItemInput.style.backgroundColor = '#444';
        addItemInput.style.color = '#eee';

        const addItemTypeSelect = document.createElement('select');
        addItemTypeSelect.style.width = '100px';
        addItemTypeSelect.style.padding = '4px';
        addItemTypeSelect.style.border = '1px solid #666';
        addItemTypeSelect.style.borderRadius = '4px';
        addItemTypeSelect.style.backgroundColor = '#444';
        addItemTypeSelect.style.color = '#eee';

        ['tag', 'artist', 'parody', 'group', 'category', 'character', 'language'].forEach(type => {
            const opt = document.createElement('option');
            opt.value = type;
            opt.textContent = type;
            addItemTypeSelect.appendChild(opt);
        });

        const addItemButton = document.createElement('button');
        addItemButton.textContent = 'Add';
        styleButton(addItemButton);
        addItemButton.style.width = 'auto';
        addItemButton.style.padding = '4px 12px';
        addItemButton.addEventListener('click', () => {
            const newItem = addItemInput.value.trim();
            const itemType = addItemTypeSelect.value;
            if (newItem && !globalState.library.some(item => item.type === itemType && item.name === newItem)) {
                globalState.library.push({ type: itemType, name: newItem });
                saveGlobalState();
            }
            addItemInput.value = '';
        });

        addItemRow.appendChild(addItemInput);
        addItemRow.appendChild(addItemTypeSelect);
        addItemRow.appendChild(addItemButton);
        librarySection.appendChild(addItemRow);
        libraryContent.appendChild(librarySection);

        const libraryButtons = document.createElement('div');
        libraryButtons.style.display = 'flex';
        libraryButtons.style.flexWrap = 'wrap';
        libraryButtons.style.gap = '10px';
        libraryButtons.style.marginBottom = '15px';

        const importBtn = document.createElement('button');
        importBtn.textContent = 'Import';
        styleButton(importBtn);
        importBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.txt';
            input.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const lines = e.target.result.split('\n').filter(line => line.trim());
                        const validTypes = ['tag', 'artist', 'parody', 'group', 'category', 'character', 'language'];
                        const newLibrary = lines.map(line => {
                            const [type, ...nameParts] = line.split(':');
                            const name = nameParts.join(':').trim();
                            return { type: type.trim(), name };
                        }).filter(item => validTypes.includes(item.type) && item.name);
                        globalState.library = [...new Set([...globalState.library, ...newLibrary]
                            .map(item => `${item.type}:${item.name}`))]
                            .map(str => {
                                const [type, ...nameParts] = str.split(':');
                                return { type, name: nameParts.join(':') };
                            });
                        saveGlobalState();
                    };
                    reader.readAsText(file);
                }
            });
            input.click();
        });
        libraryButtons.appendChild(importBtn);

        const exportBtn = document.createElement('button');
        exportBtn.textContent = 'Export';
        styleButton(exportBtn);
        exportBtn.addEventListener('click', () => {
            const content = globalState.library.map(item => `${item.type}:${item.name}`).join('\n');
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'nhentai_library.txt';
            a.click();
            URL.revokeObjectURL(url);
        });
        libraryButtons.appendChild(exportBtn);

        const removeAllBtn = document.createElement('button');
        removeAllBtn.textContent = 'Remove All';
        styleButton(removeAllBtn);
        removeAllBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to remove all tags from the library?')) {
                globalState.library = [];
                saveGlobalState();
            }
        });
        libraryButtons.appendChild(removeAllBtn);

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset to Default';
        styleButton(resetBtn);
        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset the library to default tags?')) {
                globalState.library = structuredClone(defaultGlobalState.library);
                saveGlobalState();
            }
        });
        libraryButtons.appendChild(resetBtn);

        const sortBtn = document.createElement('button');
        sortBtn.textContent = 'Sort Library';
        styleButton(sortBtn);
        sortBtn.addEventListener('click', () => {
            globalState.library.sort((a, b) => {
                const typeCompare = a.type.localeCompare(b.type);
                if (typeCompare !== 0) return typeCompare;
                return a.name.localeCompare(b.name);
            });
            saveGlobalState();
            alert('Library sorted alphabetically by type and name.');
        });
        libraryButtons.appendChild(sortBtn);

        libraryContent.appendChild(libraryButtons);

        const manageLibraryBtn = document.createElement('button');
        manageLibraryBtn.textContent = 'Manage Library';
        styleButton(manageLibraryBtn);
        manageLibraryBtn.style.width = '100';
        libraryContent.appendChild(manageLibraryBtn);

        manageLibraryBtn.addEventListener('click', () => {
            createModal('Manage Library', (contentArea) => {
                const textarea = document.createElement('textarea');
                textarea.style.width = '100%';
                textarea.style.height = '200px';
                textarea.style.padding = '4px';
                textarea.style.border = '1px solid #666';
                textarea.style.borderRadius = '4px';
                textarea.style.backgroundColor = '#444';
                textarea.style.color = '#eee';
                textarea.value = globalState.library.map(item => `${item.type}:${item.name}`).join('\n');
                contentArea.appendChild(textarea);
            }, (contentArea) => {
                const lines = contentArea.querySelector('textarea').value.split('\n').filter(line => line.trim());
                const validTypes = ['tag', 'artist', 'parody', 'group', 'category', 'character', 'language'];
                globalState.library = lines.map(line => {
                    const [type, ...nameParts] = line.split(':');
                    const name = nameParts.join(':').trim();
                    return { type: type.trim(), name };
                }).filter(item => validTypes.includes(item.type) && item.name);
                saveGlobalState();
            });
        });
    }

    function renderSettingsContent() {
        settingsContent.innerHTML = '';
        const autoHarvestToggle = document.createElement('div');
        autoHarvestToggle.style.marginBottom = '15px';
        autoHarvestToggle.style.display = 'flex';
        autoHarvestToggle.style.alignItems = 'center';
        autoHarvestToggle.style.gap = '10px';

        const autoHarvestLabelWrapper = document.createElement('div');
        autoHarvestLabelWrapper.style.display = 'flex';
        autoHarvestLabelWrapper.style.alignItems = 'center';
        autoHarvestLabelWrapper.style.flex = '1';

        const autoHarvestLabel = document.createElement('label');
        autoHarvestLabel.textContent = 'Auto-harvest from URL and Page:';
        autoHarvestLabelWrapper.appendChild(autoHarvestLabel);
        autoHarvestLabelWrapper.appendChild(createTooltipIcon(`<strong>Auto-Harvest Tooltip</strong><br>
            • Automatically add tags to your library from NHentai pages or URLs when enabled.<br>
            • Collects tags when visiting doujinshi pages or artist URLs.<br>
            • Example: Visiting an artist page adds 'artist:artistname'.`));
        autoHarvestToggle.appendChild(autoHarvestLabelWrapper);

        const autoHarvestCheckbox = document.createElement('input');
        autoHarvestCheckbox.type = 'checkbox';
        autoHarvestCheckbox.checked = globalState.autoHarvest;
        autoHarvestCheckbox.addEventListener('change', () => {
            globalState.autoHarvest = autoHarvestCheckbox.checked;
            saveGlobalState();
        });
        autoHarvestToggle.appendChild(autoHarvestCheckbox);
        settingsContent.appendChild(autoHarvestToggle);

        const syncTagsToggle = document.createElement('div');
        syncTagsToggle.style.marginBottom = '15px';
        syncTagsToggle.style.display = 'flex';
        syncTagsToggle.style.alignItems = 'center';
        syncTagsToggle.style.gap = '10px';

        const syncTagsLabelWrapper = document.createElement('div');
        syncTagsLabelWrapper.style.display = 'flex';
        syncTagsLabelWrapper.style.alignItems = 'center';
        syncTagsLabelWrapper.style.flex = '1';

        const syncTagsLabel = document.createElement('label');
        syncTagsLabel.textContent = 'Sync Tags Across Tabs:';
        syncTagsLabelWrapper.appendChild(syncTagsLabel);
        syncTagsLabelWrapper.appendChild(createTooltipIcon(`<strong>Sync Tags Across Tabs Tooltip</strong><br>
            • When enabled, tags used in searches are synchronized across all tabs and windows.<br>
            • The newest search (by timestamp) takes priority.<br>
            • When disabled, tags are isolated to each tab.`));
        syncTagsToggle.appendChild(syncTagsLabelWrapper);

        const syncTagsCheckbox = document.createElement('input');
        syncTagsCheckbox.type = 'checkbox';
        syncTagsCheckbox.checked = globalState.syncTags;
        syncTagsCheckbox.addEventListener('change', () => {
            globalState.syncTags = syncTagsCheckbox.checked;
            if (!globalState.syncTags) {
                localStorage.removeItem(SYNCED_STORAGE_KEY);
                localState = loadLocalState();
                if (currentTab === 'search') {
                    searchContent.innerHTML = '';
                    renderSearchContent();
                }
            } else {
                localState = loadLocalState();
                if (currentTab === 'search') {
                    searchContent.innerHTML = '';
                    renderSearchContent();
                }
            }
            saveGlobalState();
        });
        syncTagsToggle.appendChild(syncTagsCheckbox);
        settingsContent.appendChild(syncTagsToggle);

        const defaultTagTypeWrapper = document.createElement('div');
        defaultTagTypeWrapper.style.marginBottom = '15px';

        const defaultTagTypeLabelWrapper = document.createElement('div');
        defaultTagTypeLabelWrapper.style.display = 'flex';
        defaultTagTypeLabelWrapper.style.alignItems = 'center';
        defaultTagTypeLabelWrapper.style.marginBottom = '5px';

        const defaultTagTypeLabel = document.createElement('label');
        defaultTagTypeLabel.textContent = 'Default Tag Type for Tags in Search:';
        defaultTagTypeLabelWrapper.appendChild(defaultTagTypeLabel);
        defaultTagTypeLabelWrapper.appendChild(createTooltipIcon(`<strong>Default Tag Type Tooltip</strong><br>
            • Set the default tag type for tags not found in the library.<br>
            • Determines the type when adding new tags in the Search tab.<br>
            • Example: If set to 'parody', typing 'newparody' adds 'parody:newparody'.`));

        defaultTagTypeWrapper.appendChild(defaultTagTypeLabelWrapper);

        const defaultTagTypeSelect = document.createElement('select');
        defaultTagTypeSelect.style.width = '100%';
        defaultTagTypeSelect.style.padding = '4px';
        defaultTagTypeSelect.style.border = '1px solid #666';
        defaultTagTypeSelect.style.borderRadius = '4px';
        defaultTagTypeSelect.style.backgroundColor = '#444';
        defaultTagTypeSelect.style.color = '#eee';

        ['tag', 'artist', 'parody', 'group', 'category', 'character', 'language'].forEach(type => {
            const opt = document.createElement('option');
            opt.value = type;
            opt.textContent = type;
            defaultTagTypeSelect.appendChild(opt);
        });
        defaultTagTypeSelect.value = globalState.defaultTagType;

        defaultTagTypeSelect.addEventListener('change', () => {
            globalState.defaultTagType = defaultTagTypeSelect.value;
            saveGlobalState();
        });

        defaultTagTypeWrapper.appendChild(defaultTagTypeSelect);
        settingsContent.appendChild(defaultTagTypeWrapper);

        const helpBtn = document.createElement('button');
        helpBtn.textContent = 'Help';
        styleButton(helpBtn);
        helpBtn.style.width = '100%';
        settingsContent.appendChild(helpBtn);

        helpBtn.addEventListener('click', () => {
            createModal('NHentai Search Enhancer - Help', (contentArea) => {
                contentArea.style.lineHeight = '1.5';

                const quickGuide = document.createElement('div');
                quickGuide.style.marginBottom = '20px';

                const quickGuideTitle = document.createElement('h4');
                quickGuideTitle.textContent = 'Quick Guide';
                quickGuideTitle.style.color = '#eee';
                quickGuideTitle.style.marginBottom = '10px';
                quickGuide.appendChild(quickGuideTitle);

                const quickGuideContent = document.createElement('div');
                quickGuideContent.style.fontSize = '13px';
                quickGuideContent.innerHTML = `
                    <p><strong>Search Tab:</strong> Add tags to include or exclude in your search.<br>Type a tag (e.g., 'yuri'), select from suggestions, or press Enter to add.<br>Use the Tag Type dropdown for custom tags.<br>Click "Search NHentai" to search.</p>
                    <p><strong>Library Tab:</strong> Manage your tag library.<br>Add new tags, import/export, or sort them.<br>Use "Manage Library" to edit manually.</p>
                    <p><strong>Settings Tab:</strong> Configure auto-harvesting, tag synchronization, and the default tag type for search.<br>Enable auto-harvest to collect tags from pages automatically.</p>
                `;
                quickGuide.appendChild(quickGuideContent);
                contentArea.appendChild(quickGuide);

                const detailedDocs = document.createElement('div');

                const detailedDocsTitle = document.createElement('h4');
                detailedDocsTitle.textContent = 'Detailed Documentation';
                detailedDocsTitle.style.color = '#eee';
                detailedDocsTitle.style.marginBottom = '10px';
                detailedDocs.appendChild(detailedDocsTitle);

                const detailedDocsContent = document.createElement('div');
                detailedDocsContent.style.fontSize = '13px';
                detailedDocsContent.innerHTML = `
                    <p><strong>Overview</strong></p>
                    <p>The NHentai Search Enhancer helps you create complex search queries on NHentai by managing tags, providing suggestions, and automating tag collection.<br>It supports multiple tabs with configurable tag synchronization, keeping the library consistent across tabs.</p>

                    <p><strong>Search Tab</strong></p>
                    <p><u>Include Tags:</u> Add tags you want in your search results.<br>Type a tag name, and matching tags from the library will be suggested.<br>Example: Typing 'dou' suggests 'tag:doujinshi'.<br>Press Enter to add, or click a suggestion.<br>Tags appear as chips below the input; click the '×' to remove.</p>
                    <p><u>Exclude Tags:</u> Add tags to exclude from your search results.<br>Works similarly to Include Tags.<br>Example: Type 'netorare' to exclude 'tag:netorare'.</p>
                    <p><u>Clear Buttons:</u> Each field has a "Clear" button to remove all tags in that field.</p>
                    <p><u>Language:</u> Select a language to filter results (e.g., 'english').<br>Set to 'none' to disable.</p>
                    <p><u>Bulk Edit:</u> Edit multiple tags at once.<br>Opens a modal with text areas for included and excluded tags.<br>Add or remove tags by editing the lists (format: 'type:name').</p>
                    <p><u>Clear Search:</u> Resets all search fields (tags and language) for the current tab.</p>
                    <p><u>Search NHentai:</u> Builds a query from your tags and language, then navigates to the NHentai search page.<br>Example: Including 'tag:yuri' and excluding 'tag:netorare' with language 'english' creates the query: <code>tag:"yuri" -tag:"netorare" language:"english"</code>.</p>
                    <p><u>Preview:</u> Shows the current search query as you build it.</p>

                    <p><strong>Library Tab</strong></p>
                    <p><u>Add to Library:</u> Add new tags to your library.<br>Select a tag type (e.g., 'artist'), type a name (e.g., 'chihel'), and click "Add".<br>These tags will appear in search suggestions across all tabs.</p>
                    <p><u>Import:</u> Import tags from a .txt file (format: 'type:name', e.g., 'tag:yuri').</p>
                    <p><u>Export:</u> Export your library to a .txt file.</p>
                    <p><u>Remove All:</u> Deletes all tags from the library after confirmation.</p>
                    <p><u>Reset to Default:</u> Resets the library to the default tag list after confirmation.</p>
                    <p><u>Sort Library:</u> Sorts tags alphabetically by type and name.</p>
                    <p><u>Manage Library:</u> Manually edit the library in a text area (one tag per line, format: 'type:name').</p>

                    <p><strong>Settings Tab</strong></p>
                    <p><u>Auto-harvest from URL and Page:</u> When enabled, automatically collects tags from NHentai pages (e.g., doujinshi pages) or URLs (e.g., artist pages) and adds them to your library across all tabs.</p>
                    <p><u>Sync Tags Across Tabs:</u> When enabled, synchronizes search tags across all tabs and windows, prioritizing the newest search by timestamp.<br>When disabled, tags are isolated to each tab.</p>
                    <p><u>Default Tag Type for Tags in Search:</u> Sets the default tag type for tags you add that aren’t in the library.<br>Example: If set to 'parody', typing 'newparody' adds 'parody:newparody'.</p>

                    <p><strong>General Features</strong></p>
                    <p><u>Multi-Tab Support:</u> Search states can be synchronized or isolated based on the 'Sync Tags Across Tabs' setting.<br>The library is always synced across all tabs.</p>
                    <p><u>Dragging:</u> Click and drag the header to move the window.<br>Its position is saved.</p>
                    <p><u>Resizing:</u> Drag the bottom-right corner to resize the window.</p>
                    <p><u>Minimize/Maximize:</u> Click the '–' or '+' button in the header to minimize or maximize the window.</p>
                `;
                detailedDocs.appendChild(detailedDocsContent);
                contentArea.appendChild(detailedDocs);
            });
        });
    }

    function createModal(titleText, contentCreator, onSave) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
        modal.style.zIndex = '10001';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';

        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#333';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '6px';
        modalContent.style.width = '400px';
        modalContent.style.maxHeight = '80%';
        modalContent.style.overflowY = 'auto';
        modalContent.style.boxShadow = '0 4px 8px rgba(0,0,0,0.6)';
        modalContent.style.position = 'relative';

        const modalHeader = document.createElement('div');
        modalHeader.style.display = 'flex';
        modalHeader.style.justifyContent = 'space-between';
        modalHeader.style.alignItems = 'center';
        modalHeader.style.marginBottom = '15px';

        const title = document.createElement('h3');
        title.textContent = titleText;
        title.style.margin = '0';
        title.style.color = '#eee';
        modalHeader.appendChild(title);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.border = 'none';
        closeBtn.style.background = 'transparent';
        closeBtn.style.color = '#eee';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.padding = '0 10px';
        closeBtn.addEventListener('click', () => document.body.removeChild(modal));
        modalHeader.appendChild(closeBtn);

        modalContent.appendChild(modalHeader);

        const contentArea = document.createElement('div');
        contentCreator(contentArea);
        modalContent.appendChild(contentArea);

        if (onSave) {
            const buttonRow = document.createElement('div');
            buttonRow.style.marginTop = '15px';
            buttonRow.style.display = 'flex';
            buttonRow.style.gap = '10px';

            const saveBtn = document.createElement('button');
            saveBtn.textContent = 'Save';
            styleButton(saveBtn);
            saveBtn.addEventListener('click', () => {
                onSave(contentArea);
                document.body.removeChild(modal);
            });
            buttonRow.appendChild(saveBtn);

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            styleButton(cancelBtn);
            cancelBtn.addEventListener('click', () => document.body.removeChild(modal));
            buttonRow.appendChild(cancelBtn);

            modalContent.appendChild(buttonRow);
        }

        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    const categoryMap = {
        'tags': 'tag',
        'artists': 'artist',
        'parodies': 'parody',
        'groups': 'group',
        'categories': 'category',
        'characters': 'character',
        'languages': 'language'
    };

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function isDoujinshiPage(url) {
        return /https:\/\/nhentai\.net\/g\/\d+\/?/.test(url);
    }

    const harvestFromPage = debounce(function() {
        if (!globalState.autoHarvest) return;
        const tagsSection = document.querySelector('#tags');
        if (!tagsSection) return;
        const containers = tagsSection.querySelectorAll('.tag-container');
        let newTagsAdded = false;
        containers.forEach(container => {
            const fieldNameNode = Array.from(container.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            if (!fieldNameNode) return;
            const fieldName = fieldNameNode.textContent.trim().toLowerCase().replace(':', '');
            const type = categoryMap[fieldName];
            if (!type) return;
            const tagEls = container.querySelectorAll('.tag .name');
            tagEls.forEach(tagEl => {
                const name = tagEl.textContent.trim();
                if (name && !/^\d+$/.test(name) && !globalState.library.some(item => item.type === type && item.name === name)) {
                    globalState.library.push({ type, name });
                    newTagsAdded = true;
                }
            });
        });
        if (newTagsAdded) {
            saveGlobalState();
        }
    }, 500);

    const harvestFromURL = debounce(function() {
        if (!globalState.autoHarvest) return;
        const url = window.location.href;
        const typeMatch = url.match(/https:\/\/nhentai\.net\/(artist|tag|parody|group|category|character|language)\/([^\/]+)\/?/);
        if (typeMatch) {
            const type = typeMatch[1];
            const nameElement = document.querySelector('h1 .name');
            if (nameElement) {
                const name = nameElement.textContent.trim();
                if (name && !globalState.library.some(item => item.type === type && item.name === name)) {
                    globalState.library.push({ type, name });
                    saveGlobalState();
                }
            }
        }
    }, 500);

    if (globalState.autoHarvest) {
        if (isDoujinshiPage(window.location.href)) {
            harvestFromPage();
        } else {
            harvestFromURL();
        }
    }

    if (globalState.autoHarvest) {
        const observer = new MutationObserver(() => {
            if (isDoujinshiPage(window.location.href)) {
                harvestFromPage();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    let lastUrl = location.href;
    if (globalState.autoHarvest) {
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                if (isDoujinshiPage(url)) {
                    harvestFromPage();
                } else {
                    harvestFromURL();
                }
            }
        }).observe(document, { subtree: true, childList: true });
    }
})();