// ==UserScript==
// @name         Vocabulary Highlighter with Groups
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Highlight vocabulary and symbols with color groups - supports ALL languages
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543472/Vocabulary%20Highlighter%20with%20Groups.user.js
// @updateURL https://update.greasyfork.org/scripts/543472/Vocabulary%20Highlighter%20with%20Groups.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🎯 Vocabulary Highlighter: Starting...');

    // Data structure: { groupName: { color: '#color', hoverColor: '#color', words: ['word1', 'word2'] } }
    let vocabularyGroups = GM_getValue('vocabularyGroups', {
        'Default': {
            color: '#f0f0f0',
            hoverColor: '#e0e0e0',
            words: []
        }
    });
    let isHighlighting = GM_getValue('isHighlighting', true);
    let activeGroup = GM_getValue('activeGroup', 'Default');
    let sidebarOpen = GM_getValue('sidebarOpen', false);
    let sidebar = null;
    let panel = null;
    let toggleBtn = null;
    let overlay = null;

    // Add CSS styles
    function updateStyles() {
        const existingStyle = document.getElementById('vocab-highlighter-styles');
        if (existingStyle) existingStyle.remove();

        const style = document.createElement('style');
        style.id = 'vocab-highlighter-styles';

        // Generate CSS for each group
        let groupStyles = '';
        Object.keys(vocabularyGroups).forEach(groupName => {
            const group = vocabularyGroups[groupName];
            const className = `vocab-highlight-${groupName.replace(/\s+/g, '-').toLowerCase()}`;
            groupStyles += `
                .${className} {
                    background: ${group.color} !important;
                    padding: 1px 3px;
                    border-radius: 2px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: 1px solid rgba(0,0,0,0.1);
                }

                .${className}:hover {
                    background: ${group.hoverColor} !important;
                    transform: scale(1.02);
                }
            `;
        });

        style.textContent = groupStyles + `
            .vocab-sidebar {
                position: fixed;
                top: 0;
                right: 0;
                width: 360px;
                height: 100vh;
                background: #fafafa;
                border-left: 2px solid #d0d0d0;
                box-shadow: -4px 0 16px rgba(0,0,0,0.15);
                z-index: 50000;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                display: flex;
                flex-direction: column;
            }

            .vocab-sidebar.open {
                transform: translateX(0);
            }

            .vocab-toggle-btn {
                position: fixed;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
                background: #ff4757;
                color: white;
                border: none;
                border-radius: 6px 0 0 6px;
                padding: 8px 6px;
                cursor: pointer;
                z-index: 50001;
                font-size: 10px;
                box-shadow: -2px 0 8px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
                font-weight: bold;
                min-width: 20px;
                min-height: 60px;
                display: flex !important;
                align-items: center;
                justify-content: center;
                writing-mode: vertical-rl;
                text-orientation: mixed;
                line-height: 1.2;
            }

            .vocab-toggle-btn:hover {
                background: #ff3742;
                right: 2px;
                transform: translateY(-50%) scale(1.05);
            }

            .vocab-sidebar.open + .vocab-toggle-btn {
                right: 360px;
                border-radius: 6px 0 0 6px;
                background: #555;
            }

            .vocab-sidebar.open + .vocab-toggle-btn:hover {
                background: #444;
            }

            .vocab-panel {
                flex: 1;
                display: flex;
                flex-direction: column;
                height: 100%;
            }

            .vocab-header {
                background: #4a4a4a;
                color: white;
                padding: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
                font-weight: 500;
                flex-shrink: 0;
            }

            .vocab-body {
                padding: 15px;
                overflow-y: auto;
                background: white;
                flex: 1;
            }

            .group-selector {
                display: flex;
                gap: 5px;
                margin-bottom: 10px;
                align-items: center;
            }

            .group-select {
                flex: 1;
                padding: 6px 8px;
                border: 1px solid #d0d0d0;
                border-radius: 4px;
                font-size: 12px;
                background: white;
            }

            .group-color-indicator {
                width: 20px;
                height: 20px;
                border-radius: 3px;
                border: 1px solid #ccc;
                display: inline-block;
            }

            .vocab-input {
                width: 100%;
                padding: 8px 10px;
                border: 1px solid #d0d0d0;
                border-radius: 4px;
                margin-bottom: 10px;
                font-size: 13px;
                transition: border-color 0.2s ease;
                box-sizing: border-box;
            }

            .vocab-input:focus {
                outline: none;
                border-color: #666;
            }

            .vocab-btn {
                background: #666;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                margin: 2px;
                transition: background-color 0.2s ease;
            }

            .vocab-btn:hover {
                background: #555;
            }

            .vocab-btn.small {
                padding: 3px 8px;
                font-size: 10px;
            }

            .vocab-item {
                background: #f5f5f5;
                margin: 5px 0;
                padding: 8px 10px;
                border-radius: 4px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                border: 1px solid #e5e5e5;
            }

            .vocab-word {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .vocab-delete {
                background: #888;
                color: white;
                border: none;
                padding: 3px 8px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 10px;
            }

            .vocab-delete:hover {
                background: #666;
            }

            .stats {
                font-size: 10px;
                color: #666;
                margin: 8px 0;
                padding: 8px 0;
                border-top: 1px solid #e5e5e5;
            }

            .group-management {
                display: flex;
                gap: 5px;
                margin-bottom: 10px;
            }

            .new-group-input {
                flex: 1;
                padding: 4px 6px;
                border: 1px solid #d0d0d0;
                border-radius: 3px;
                font-size: 11px;
            }

            .color-settings {
                margin: 10px 0;
                padding: 10px;
                background: #f8f8f8;
                border-radius: 4px;
                border: 1px solid #e5e5e5;
            }

            .color-row {
                display: flex;
                align-items: center;
                margin: 8px 0;
                font-size: 11px;
            }

            .color-row label {
                flex: 1;
                margin-right: 8px;
                color: #555;
            }

            .color-picker {
                width: 50px;
                height: 25px;
                border: 1px solid #ccc;
                border-radius: 3px;
                cursor: pointer;
                padding: 0;
                background: none;
            }

            .preset-colors {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                gap: 4px;
                margin-top: 8px;
            }

            .preset-color {
                width: 25px;
                height: 20px;
                border-radius: 3px;
                cursor: pointer;
                border: 1px solid #ccc;
            }

            .minimized .vocab-body {
                display: none;
            }

            .sidebar-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.3);
                z-index: 49999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .sidebar-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            @media (max-width: 768px) {
                .vocab-sidebar {
                    width: 90vw;
                }

                .vocab-sidebar.open + .vocab-toggle-btn {
                    right: 90vw;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Create the sidebar
    function createPanel() {
        console.log('🎯 Creating sidebar panel...');

        try {
            // Remove any existing panels first
            const existingSidebar = document.querySelector('.vocab-sidebar');
            const existingToggle = document.querySelector('.vocab-toggle-btn');
            const existingOverlay = document.querySelector('.sidebar-overlay');

            if (existingSidebar) existingSidebar.remove();
            if (existingToggle) existingToggle.remove();
            if (existingOverlay) existingOverlay.remove();

            // Create overlay for mobile
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.addEventListener('click', closeSidebar);
            document.body.appendChild(overlay);

            // Create sidebar container
            sidebar = document.createElement('div');
            sidebar.className = 'vocab-sidebar';
            if (sidebarOpen) sidebar.classList.add('open');

            // Create panel inside sidebar
            panel = document.createElement('div');
            panel.className = 'vocab-panel';

            // Create toggle button
            toggleBtn = document.createElement('button');
            toggleBtn.className = 'vocab-toggle-btn';
            toggleBtn.innerHTML = '📚';
            toggleBtn.title = 'Toggle Vocabulary Highlighter';
            toggleBtn.addEventListener('click', toggleSidebar);

            sidebar.appendChild(panel);
            document.body.appendChild(sidebar);
            document.body.appendChild(toggleBtn);

            updatePanelContent();
            setupEventListeners();

            if (sidebarOpen) {
                overlay.classList.add('active');
            }

            console.log('🎯 Sidebar created successfully!');

        } catch (error) {
            console.error('🎯 Error creating sidebar:', error);
        }
    }

    function updatePanelContent() {
        const currentGroup = vocabularyGroups[activeGroup];
        const totalWords = Object.values(vocabularyGroups).reduce((sum, group) => sum + group.words.length, 0);

        panel.innerHTML = `
            <div class="vocab-header">
                <span>📚 Vocab Highlighter</span>
                <div>
                    <button class="vocab-btn" id="minimize-btn">−</button>
                    <button class="vocab-btn" id="close-btn">→</button>
                </div>
            </div>
            <div class="vocab-body">
                <div class="group-management">
                    <input type="text" class="new-group-input" id="new-group-input" placeholder="New group name...">
                    <button class="vocab-btn small" id="add-group-btn">Add Group</button>
                </div>

                <div class="group-selector">
                    <select class="group-select" id="group-select">
                        ${Object.keys(vocabularyGroups).map(group =>
                            `<option value="${group}" ${group === activeGroup ? 'selected' : ''}>${group}</option>`
                        ).join('')}
                    </select>
                    <div class="group-color-indicator" id="group-color-indicator" style="background: ${currentGroup.color};"></div>
                    <button class="vocab-btn small" id="delete-group-btn" ${activeGroup === 'Default' ? 'disabled' : ''}>Delete</button>
                </div>

                <input type="text" class="vocab-input" id="vocab-input" placeholder="Add word to ${activeGroup}...">
                <button class="vocab-btn" id="add-btn">Add to ${activeGroup}</button>
                <button class="vocab-btn" id="toggle-highlight">
                    ${isHighlighting ? 'Disable' : 'Enable'} Highlighting
                </button>

                <button class="vocab-btn" id="color-settings-btn">🎨 Change Colors</button>
                <div class="color-settings" id="color-settings" style="display: none;">
                    <div class="color-row">
                        <label>Highlight Color:</label>
                        <input type="color" class="color-picker" id="highlight-color" value="${currentGroup.color}">
                    </div>
                    <div class="color-row">
                        <label>Hover Color:</label>
                        <input type="color" class="color-picker" id="hover-color" value="${currentGroup.hoverColor}">
                    </div>
                    <div class="preset-colors">
                        <div class="preset-color" style="background: #f0f0f0;" data-highlight="#f0f0f0" data-hover="#e0e0e0" title="Light Gray"></div>
                        <div class="preset-color" style="background: #fff3cd;" data-highlight="#fff3cd" data-hover="#ffeaa7" title="Soft Yellow"></div>
                        <div class="preset-color" style="background: #d4edda;" data-highlight="#d4edda" data-hover="#c3e6cb" title="Soft Green"></div>
                        <div class="preset-color" style="background: #d1ecf1;" data-highlight="#d1ecf1" data-hover="#bee5eb" title="Soft Blue"></div>
                        <div class="preset-color" style="background: #f8d7da;" data-highlight="#f8d7da" data-hover="#f1b0b7" title="Soft Pink"></div>
                        <div class="preset-color" style="background: #e2e3e5;" data-highlight="#e2e3e5" data-hover="#d6d8db" title="Neutral Gray"></div>
                    </div>
                </div>

                <div class="stats">
                    Total: ${totalWords} words | ${activeGroup}: ${currentGroup.words.length} words | Highlighted: <span id="highlight-count">0</span>
                </div>
                <div id="vocab-list"></div>
            </div>
        `;

        updateVocabList();
    }

    function setupEventListeners() {
        // Group management
        document.getElementById('add-group-btn').addEventListener('click', addGroup);
        document.getElementById('group-select').addEventListener('change', (e) => {
            activeGroup = e.target.value;
            GM_setValue('activeGroup', activeGroup);
            updatePanelContent();
            setupEventListeners();
        });

        // Delete group
        const deleteBtn = document.getElementById('delete-group-btn');
        if (deleteBtn && !deleteBtn.disabled) {
            deleteBtn.addEventListener('click', deleteGroup);
        }

        // Add word
        document.getElementById('add-btn').addEventListener('click', addWord);
        document.getElementById('vocab-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addWord();
        });

        // Toggle highlighting
        document.getElementById('toggle-highlight').addEventListener('click', toggleHighlighting);

        // Panel controls
        document.getElementById('minimize-btn').addEventListener('click', () => {
            sidebar.classList.toggle('minimized');
        });

        document.getElementById('close-btn').addEventListener('click', closeSidebar);

        // Color settings
        document.getElementById('color-settings-btn').addEventListener('click', () => {
            const settings = document.getElementById('color-settings');
            settings.style.display = settings.style.display === 'none' ? 'block' : 'none';
        });

        // Color pickers
        document.getElementById('highlight-color').addEventListener('input', (e) => {
            vocabularyGroups[activeGroup].color = e.target.value;
            GM_setValue('vocabularyGroups', vocabularyGroups);
            updateColorIndicator();
            updateStyles();
            highlightPage();
        });

        document.getElementById('hover-color').addEventListener('input', (e) => {
            vocabularyGroups[activeGroup].hoverColor = e.target.value;
            GM_setValue('vocabularyGroups', vocabularyGroups);
            updateStyles();
        });

        // Preset colors
        document.querySelectorAll('.preset-color').forEach(preset => {
            preset.addEventListener('click', () => {
                const newHighlight = preset.dataset.highlight;
                const newHover = preset.dataset.hover;

                vocabularyGroups[activeGroup].color = newHighlight;
                vocabularyGroups[activeGroup].hoverColor = newHover;

                GM_setValue('vocabularyGroups', vocabularyGroups);

                document.getElementById('highlight-color').value = newHighlight;
                document.getElementById('hover-color').value = newHover;

                updateColorIndicator();
                updateStyles();
                highlightPage();
            });
        });
    }

    function addGroup() {
        const input = document.getElementById('new-group-input');
        const groupName = input.value.trim();

        if (groupName && !vocabularyGroups[groupName]) {
            vocabularyGroups[groupName] = {
                color: '#f0f0f0',
                hoverColor: '#e0e0e0',
                words: []
            };
            GM_setValue('vocabularyGroups', vocabularyGroups);
            activeGroup = groupName;
            GM_setValue('activeGroup', activeGroup);
            input.value = '';
            updatePanelContent();
            setupEventListeners();
        }
    }

    function deleteGroup() {
        if (activeGroup !== 'Default' && confirm(`Delete group "${activeGroup}" and all its words?`)) {
            delete vocabularyGroups[activeGroup];
            activeGroup = 'Default';
            GM_setValue('vocabularyGroups', vocabularyGroups);
            GM_setValue('activeGroup', activeGroup);
            updatePanelContent();
            setupEventListeners();
            highlightPage();
        }
    }

    function updateColorIndicator() {
        const indicator = document.getElementById('group-color-indicator');
        if (indicator) {
            indicator.style.background = vocabularyGroups[activeGroup].color;
        }
    }

    function toggleSidebar() {
        console.log('🎯 Toggling sidebar...');
        sidebarOpen = !sidebarOpen;
        GM_setValue('sidebarOpen', sidebarOpen);

        if (sidebarOpen) {
            sidebar.classList.add('open');
            overlay.classList.add('active');
        } else {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        }
    }

    function closeSidebar() {
        sidebarOpen = false;
        GM_setValue('sidebarOpen', sidebarOpen);
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }

    function addWord() {
        const input = document.getElementById('vocab-input');
        const word = input.value.trim();

        if (word && !vocabularyGroups[activeGroup].words.includes(word)) {
            vocabularyGroups[activeGroup].words.push(word);
            GM_setValue('vocabularyGroups', vocabularyGroups);
            input.value = '';
            updateVocabList();
            highlightPage();
        }
    }

    function updateVocabList() {
        const list = document.getElementById('vocab-list');
        const currentGroup = vocabularyGroups[activeGroup];

        list.innerHTML = currentGroup.words.map(word => `
            <div class="vocab-item">
                <div class="vocab-word">
                    <div class="group-color-indicator" style="background: ${currentGroup.color}; width: 12px; height: 12px;"></div>
                    <span>${word}</span>
                </div>
                <button class="vocab-delete" onclick="removeWord('${word.replace(/'/g, "\\'")}', '${activeGroup}')">Delete</button>
            </div>
        `).join('');
    }

    function removeWord(word, groupName) {
        vocabularyGroups[groupName].words = vocabularyGroups[groupName].words.filter(w => w !== word);
        GM_setValue('vocabularyGroups', vocabularyGroups);
        updateVocabList();
        highlightPage();
    }

    function toggleHighlighting() {
        isHighlighting = !isHighlighting;
        GM_setValue('isHighlighting', isHighlighting);

        const btn = document.getElementById('toggle-highlight');
        btn.textContent = `${isHighlighting ? 'Disable' : 'Enable'} Highlighting`;

        if (isHighlighting) {
            highlightPage();
        } else {
            removeHighlights();
        }
    }

    function highlightPage() {
        if (!isHighlighting) return;

        removeHighlights();

        const textNodes = getTextNodes(document.body);
        let highlightCount = 0;

        textNodes.forEach(node => {
            let text = node.textContent;
            let hasMatch = false;

            Object.keys(vocabularyGroups).forEach(groupName => {
                const group = vocabularyGroups[groupName];
                const className = `vocab-highlight-${groupName.replace(/\s+/g, '-').toLowerCase()}`;

                group.words.forEach(word => {
                    const regex = new RegExp(`(?<!\\w)${escapeRegex(word)}(?!\\w)`, 'gi');
                    if (regex.test(text)) {
                        hasMatch = true;
                        text = text.replace(regex, `<span class="${className}" title="Group: ${groupName} | Word: ${word}">$&</span>`);
                        highlightCount++;
                    }
                });
            });

            if (hasMatch) {
                const wrapper = document.createElement('span');
                wrapper.innerHTML = text;
                node.parentNode.replaceChild(wrapper, node);
            }
        });

        const countElement = document.getElementById('highlight-count');
        if (countElement) countElement.textContent = highlightCount;
    }

    function removeHighlights() {
        Object.keys(vocabularyGroups).forEach(groupName => {
            const className = `vocab-highlight-${groupName.replace(/\s+/g, '-').toLowerCase()}`;
            document.querySelectorAll(`.${className}`).forEach(el => {
                el.outerHTML = el.textContent;
            });
        });
    }

    function getTextNodes(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    if (node.parentElement.tagName === 'SCRIPT' ||
                        node.parentElement.tagName === 'STYLE' ||
                        node.parentElement.classList.contains('vocab-sidebar')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.trim()) {
                textNodes.push(node);
            }
        }

        return textNodes;
    }

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Make removeWord globally accessible
    window.removeWord = removeWord;

    // Initialize
    setTimeout(() => {
        try {
            console.log('🎯 Initializing Vocabulary Highlighter...');
            updateStyles();
            createPanel();

            if (isHighlighting) {
                highlightPage();
            }

            console.log('🎯 Vocabulary Highlighter loaded successfully!');
        } catch (error) {
            console.error('🎯 Initialization error:', error);
        }
    }, 2000);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'V') {
            e.preventDefault();
            toggleSidebar();
        }
        if (e.key === 'Escape' && sidebarOpen) {
            closeSidebar();
        }
    });

    // Re-highlight on page changes
    let lastURL = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastURL) {
            lastURL = url;
            setTimeout(() => {
                if (isHighlighting) highlightPage();
            }, 1000);
        }
    }).observe(document, {subtree: true, childList: true});

})();