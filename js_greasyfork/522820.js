// ==UserScript==
// @name         JAV Manager
// @namespace    https://example.com
// @version      1.0
// @description  一键整合和过滤多Jav网站的观影记录与偏好，屏蔽你不想看的，高亮你喜欢的演员，让你在最短时间内找到真正想看的内容
// @match        https://jinjier.art/sql*
// @match        https://javdb.com/*
// @exclude      https://javdb.com/actors/*
// @exclude      https://javdb.com/v/*
// @exclude      https://javdb.com/search?q=*
// @match        https://www.javlibrary.com/*/vl_bestrated.php*
// @match        https://www.javlibrary.com/*/vl_mostwanted.php*
// @match        https://www.javlibrary.com/*/vl_update.php*
// @match        https://www.javlibrary.com/*/vl_genre.php*
// @match        https://www.javlibrary.com/*/vl_newrelease.php*
// @match        https://www.javlibrary.com/*/vl_newentries.php*
// @match        https://www.javlibrary.com/*/
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      javbus.com
// @connect      jable.tv
// @connect      javmenu.com
// @connect      javdb.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522820/JAV%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/522820/JAV%20Manager.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*******************************
     * Block 1
     * 1. Constant definitions
     * 2. Utility functions
     * 3. Style injection
     * 4. Create section function
     * 5. Keyword management panel (UI skeleton)
     *******************************/

    // ===== 1. Constant definitions =====
    const STORAGE_KEY = 'sql_filter_keywords'; // 屏蔽
    const FAVORITES_KEY = 'sql_favorite_keywords'; // 喜爱
    const KNOWN_KEY = 'sql_known_keywords'; // 认识
    const WATCHED_KEY = 'sql_watched_keywords'; // 看过
    const SQL_STORAGE_KEY = 'sql_last_executed'; // 上次执行的SQL
    const FILTER_TOGGLE_KEY = 'sql_filter_enabled'; // 屏蔽功能开关
    const SORT_PRIORITY_KEY = 'sql_sort_priority_enabled'; // 按照priority排序开关
    const SORT_ACTOR_KEY = 'sql_sort_actor_enabled'; // 按照演员信息排序开关
    const NUMBER_ACTOR_STORAGE_KEY = 'sql_number_actor_info'; // 番号与演员信息存储键名
    const ACTORS_COLUMN_SHOULD_INSERT = 'actors_column_should_insert';
    const ACTORS_COLUMN_INSERTED_KEY = 'actors_column_inserted'; // 存储演员列是否已插入

    let isSelectingText = false; // Mark if the user is currently selecting text

    // ===== 2. Utility functions =====
    // Remove brackets and their contents from actress name
    function stripParentheses(text) {
        return text.replace(/\s*（[^）]*）/g, '').replace(/\s*\([^)]*\)/g, '').trim();
    }

    // General async GM_xmlhttpRequest
    function gmRequest(details) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                ...details,
                onload: function (response) {
                    resolve(response);
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
    }

    // ===== 3. Style injection =====
    function addCustomStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            html {
                width: 100% !important;
                margin: 0 !important;
            }
            @media screen and (min-width:800px) {
                html {
                    width: 100% !important;
                    margin: 0 !important;
                }
                body {
                    border: none !important;
                    padding: 0 20px !important;
                    box-shadow: none !important;
                    border-radius: 0 !important;
                }
            }
            /* Management panel style */
            #keywordManager {
                max-height: 50px;
                transition: max-height 0.3s ease-out;
                overflow: hidden;
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: #ffffff;
                border: 1px solid #ccc;
                padding: 20px;
                z-index: 1000;
                width: 400px;
                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                font-family: Arial, sans-serif;
                font-size: 14px;
                line-height: 1.5;
                color: #333;
            }
            #keywordManager.expanded {
                max-height: 800px; /* Large enough to fit content */
            }
            /* Progress bar style */
            #progressOverlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 3000;
            }
            #progressBarContainer {
                width: 80%;
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
            }
            #progressBar {
                width: 100%;
                background: #e0e0e0;
                border-radius: 4px;
                overflow: hidden;
                margin-top: 10px;
            }
            #progressBar div {
                height: 20px;
                width: 0;
                background: #28a745;
                transition: width 0.3s;
            }
            /* Floating button style */
            .floating-button {
                position: fixed;
                display: none;
                z-index: 1000;
                padding: 5px 10px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
            #filterButton {
                background-color: #dc3545;
                color: #fff;
            }
            #filterButton:hover {
                background-color: #c82333;
            }
            #favoriteButton {
                background-color: #28a745;
                color: #fff;
            }
            #favoriteButton:hover {
                background-color: #218838;
            }
            #knownButton {
                background-color: #17a2b8;
                color: #fff;
            }
            #knownButton:hover {
                background-color: #117a8b;
            }
            #watchedButton {
                background-color: #007bff;
                color: #fff;
            }
            #watchedButton:hover {
                background-color: #0056b3;
            }
            /* Settings button style */
            #settingsButton {
                padding: 5px 10px;
                background-color: #ffc107;
                color: #fff;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                position: absolute;
                bottom: 20px;
                right: 20px;
            }
            #settingsButton:hover {
                background-color: #e0a800;
            }
            /* Settings modal style */
            #settingsModal {
                position: fixed; /* changed to fixed positioning */
                background-color: #fff;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 8px;
                z-index: 4000;
                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                display: none;
                width: 250px;
                max-width: 90vw;
                max-height: 90vh;
            }
            #settingsModal h4 {
                margin-top: 0;
            }
            #settingsModal label {
                display: block;
                margin-bottom: 10px;
            }
            #settingsModal button.close-settings {
                padding: 5px 10px;
                margin-top: 10px;
                background-color: #dc3545;
                color: #fff;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            #settingsModal button.close-settings:hover {
                background-color: #c82333;
            }
        `;
        document.head.appendChild(style);
    }
    addCustomStyles(); // Inject styles immediately

    // ===== 4. Create section function =====
    function createSection(sectionId, sectionTitle, storageKey) {
        let section = document.createElement('div');
        section.id = sectionId;

        let title = document.createElement('h4');
        title.textContent = sectionTitle;
        title.style.marginTop = '10px';
        title.style.marginBottom = '5px';
        title.style.color = '#444';
        section.appendChild(title);

        let inputContainer = document.createElement('div');
        inputContainer.style.display = 'flex';
        inputContainer.style.marginBottom = '10px';

        let input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '添加关键词';
        input.style.flex = '1';
        input.style.padding = '5px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '4px';

        let addButton = document.createElement('button');
        addButton.textContent = '添加';
        addButton.style.padding = '5px 10px';
        addButton.style.marginLeft = '5px';
        addButton.style.backgroundColor = '#28a745';
        addButton.style.color = '#fff';
        addButton.style.border = 'none';
        addButton.style.borderRadius = '4px';
        addButton.style.cursor = 'pointer';
        addButton.onmouseover = function () {
            addButton.style.backgroundColor = '#218838';
        };
        addButton.onmouseout = function () {
            addButton.style.backgroundColor = '#28a745';
        };
        addButton.onclick = function (event) {
            event.stopPropagation(); // Prevent triggering panel toggle
            let keyword = input.value.trim();
            if (keyword) {
                addKeyword(keyword, storageKey, sectionId);
                input.value = '';
            }
        };

        inputContainer.appendChild(input);
        inputContainer.appendChild(addButton);
        section.appendChild(inputContainer);

        // Keyword list
        let list = document.createElement('ul');
        list.style.listStyleType = 'none';
        list.style.padding = '0';
        list.style.maxHeight = '200px';
        list.style.overflowY = 'auto';
        section.appendChild(list);

        // Bottom container, containing batch import button and feature toggle
        let bottomContainer = document.createElement('div');
        bottomContainer.style.display = 'flex';
        bottomContainer.style.alignItems = 'center';

        // Batch import button
        let batchImportButton = document.createElement('button');
        batchImportButton.textContent = '批量导入';
        batchImportButton.style.padding = '5px 10px';
        batchImportButton.style.backgroundColor = '#17a2b8';
        batchImportButton.style.color = '#fff';
        batchImportButton.style.border = 'none';
        batchImportButton.style.borderRadius = '4px';
        batchImportButton.style.cursor = 'pointer';
        batchImportButton.style.marginRight = '10px';
        batchImportButton.onmouseover = function () {
            batchImportButton.style.backgroundColor = '#117a8b';
        };
        batchImportButton.onmouseout = function () {
            batchImportButton.style.backgroundColor = '#17a2b8';
        };
        batchImportButton.onclick = function (event) {
            event.stopPropagation(); // Prevent triggering panel toggle
            showBatchImportModal(storageKey, sectionId);
        };
        bottomContainer.appendChild(batchImportButton);

        // If it is the "屏蔽" section, add an enable filter toggle
        if (storageKey === STORAGE_KEY) {
            let filterToggleContainer = document.createElement('div');
            filterToggleContainer.style.display = 'flex';
            filterToggleContainer.style.alignItems = 'center';
            filterToggleContainer.style.marginLeft = '10px';

            let filterToggleSwitch = document.createElement('input');
            filterToggleSwitch.type = 'checkbox';
            filterToggleSwitch.checked = getFilterEnabled();
            filterToggleSwitch.onchange = function () {
                GM_setValue(FILTER_TOGGLE_KEY, filterToggleSwitch.checked);
                modifyPage(); // Re-process the page
            };
            filterToggleContainer.appendChild(filterToggleSwitch);

            let filterToggleLabel = document.createElement('label');
            filterToggleLabel.textContent = ' 启用屏蔽';
            filterToggleLabel.style.marginLeft = '5px';
            filterToggleContainer.appendChild(filterToggleLabel);

            bottomContainer.appendChild(filterToggleContainer);
        }
        section.appendChild(bottomContainer);
        return section;
    }

    // ===== 5. Keyword management panel (UI skeleton) =====
    function createKeywordManager() {
        let manager = document.createElement('div');
        manager.id = 'keywordManager';

        // Title bar
        let title = document.createElement('div');
        title.style.display = 'flex';
        title.style.justifyContent = 'space-between';
        title.style.alignItems = 'center';
        title.style.cursor = 'pointer';

        let titleText = document.createElement('h3');
        titleText.textContent = '管理面板';
        titleText.style.fontSize = '16px';
        titleText.style.color = '#444';
        titleText.style.margin = '0';

        let titleRightContainer = document.createElement('div');
        titleRightContainer.style.display = 'flex';
        titleRightContainer.style.alignItems = 'center';

        // Export button
        let exportButton = document.createElement('button');
        exportButton.textContent = '导出关键词';
        exportButton.id = 'exportKeywordsButton';
        exportButton.style.padding = '5px 10px';
        exportButton.style.backgroundColor = '#007bff';
        exportButton.style.color = '#fff';
        exportButton.style.border = 'none';
        exportButton.style.borderRadius = '4px';
        exportButton.style.cursor = 'pointer';
        exportButton.style.fontSize = '12px';
        exportButton.style.marginRight = '10px';
        exportButton.onmouseover = function () {
            exportButton.style.backgroundColor = '#0056b3';
        };
        exportButton.onmouseout = function () {
            exportButton.style.backgroundColor = '#007bff';
        };
        exportButton.onclick = function (event) {
            event.stopPropagation();
            exportKeywordsToCSV();
        };
        titleRightContainer.appendChild(exportButton);

        // Load/hide actress info button
        let loadActorsButton = document.createElement('button');
        loadActorsButton.textContent = '加载演员信息';
        loadActorsButton.id = 'loadActorsButton';
        loadActorsButton.style.padding = '5px 10px';
        loadActorsButton.style.backgroundColor = '#6c757d';
        loadActorsButton.style.color = '#fff';
        loadActorsButton.style.border = 'none';
        loadActorsButton.style.borderRadius = '4px';
        loadActorsButton.style.cursor = 'pointer';
        loadActorsButton.style.fontSize = '12px';
        loadActorsButton.style.marginLeft = '0px';
        loadActorsButton.onmouseover = function () {
            loadActorsButton.style.backgroundColor = '#5a6268';
        };
        loadActorsButton.onmouseout = function () {
            loadActorsButton.style.backgroundColor = '#6c757d';
        };
        loadActorsButton.onclick = function (event) {
            event.stopPropagation();
            toggleActorsColumn();
        };
        titleRightContainer.appendChild(loadActorsButton);

        let toggleIcon = document.createElement('span');
        toggleIcon.textContent = '▼';
        toggleIcon.style.fontSize = '18px';
        toggleIcon.style.marginLeft = '10px';
        titleRightContainer.appendChild(toggleIcon);

        title.appendChild(titleText);
        title.appendChild(titleRightContainer);
        title.onclick = toggleManager;
        manager.appendChild(title);

        // Navigation bar
        let nav = document.createElement('div');
        nav.style.display = 'flex';
        nav.style.marginTop = '10px';

        // Create navigation buttons
        let favoriteTab = createNavButton('喜爱', 'favorite');
        let knownTab = createNavButton('认识', 'known');
        let filterTab = createNavButton('屏蔽', 'filter');
        let watchedTab = createNavButton('看过', 'watched'); // Newly added

        nav.appendChild(favoriteTab);
        nav.appendChild(knownTab);
        nav.appendChild(filterTab);
        nav.appendChild(watchedTab);

        manager.appendChild(nav);

        // Create 4 sections
        let favoriteSection = createSection('favorite', '喜爱', FAVORITES_KEY);
        let knownSection = createSection('known', '认识', KNOWN_KEY);
        let filterSection = createSection('filter', '屏蔽', STORAGE_KEY);
        let watchedSection = createSection('watched', '看过', WATCHED_KEY);

        // Initially hide all except "favorite"
        knownSection.style.display = 'none';
        filterSection.style.display = 'none';
        watchedSection.style.display = 'none';

        manager.appendChild(favoriteSection);
        manager.appendChild(knownSection);
        manager.appendChild(filterSection);
        manager.appendChild(watchedSection);

        // Settings button
        let settingsButton = document.createElement('button');
        settingsButton.id = 'settingsButton';
        settingsButton.textContent = '设置';
        settingsButton.style.display = 'none'; // Default hidden
        manager.appendChild(settingsButton);

        // Create settings modal
        let settingsModal = document.createElement('div');
        settingsModal.id = 'settingsModal';

        let settingsTitle = document.createElement('h4');
        settingsTitle.textContent = '排序设置';
        settingsModal.appendChild(settingsTitle);

        // Sort by priority
        let priorityLabel = document.createElement('label');
        let priorityCheckbox = document.createElement('input');
        priorityCheckbox.type = 'checkbox';
        priorityCheckbox.checked = getSortPriorityEnabled();
        priorityCheckbox.onchange = function () {
            GM_setValue(SORT_PRIORITY_KEY, priorityCheckbox.checked);
            modifyPage();
        };
        priorityLabel.appendChild(priorityCheckbox);
        priorityLabel.appendChild(document.createTextNode(' 按照喜爱/认识/看过排序'));
        settingsModal.appendChild(priorityLabel);

        // Sort by actress info
        let actorSortLabel = document.createElement('label');
        let actorSortCheckbox = document.createElement('input');
        actorSortCheckbox.type = 'checkbox';
        actorSortCheckbox.checked = getSortActorEnabled();
        actorSortCheckbox.onchange = function () {
            GM_setValue(SORT_ACTOR_KEY, actorSortCheckbox.checked);
            if (actorSortCheckbox.checked) {
                // Automatically load actress info
                GM_setValue(ACTORS_COLUMN_SHOULD_INSERT, true);
            }
            modifyPage();
        };
        actorSortLabel.appendChild(actorSortCheckbox);
        actorSortLabel.appendChild(document.createTextNode(' 按照演员信息排序'));
        settingsModal.appendChild(actorSortLabel);

        // Close button
        let closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.classList.add('close-settings');
        closeButton.onclick = function () {
            settingsModal.style.display = 'none';
        };
        settingsModal.appendChild(closeButton);

        document.body.appendChild(settingsModal);

        settingsButton.onclick = function (event) {
            event.stopPropagation();
            // Calculate modal position
            const rect = settingsButton.getBoundingClientRect();
            const modalWidth = 250;
            const modalHeight = settingsModal.offsetHeight || 200;

            let top = rect.bottom + 5;
            let left = rect.left;

            if (left + modalWidth > window.innerWidth) {
                left = window.innerWidth - modalWidth - 10;
            }
            if (top + modalHeight > window.innerHeight) {
                top = rect.top - modalHeight - 5;
            }
            if (left < 10) left = 10;
            if (top < 10) top = 10;

            settingsModal.style.top = `${top}px`;
            settingsModal.style.left = `${left}px`;
            settingsModal.style.display = 'block';
        };

        // Click outside the modal to close
        window.onclick = function (event) {
            if (event.target === settingsModal) {
                settingsModal.style.display = 'none';
            }
        };

        document.body.appendChild(manager);

        // Initialize list content for each section
        updateKeywordList(FAVORITES_KEY, 'favorite');
        updateKeywordList(KNOWN_KEY, 'known');
        updateKeywordList(STORAGE_KEY, 'filter');
        updateKeywordList(WATCHED_KEY, 'watched');

        // Panel expand/collapse
        function toggleManager() {
            if (manager.classList.contains('expanded')) {
                manager.classList.remove('expanded');
                toggleIcon.textContent = '▼';
                settingsButton.style.display = 'none';
            } else {
                manager.classList.add('expanded');
                toggleIcon.textContent = '▲';
                settingsButton.style.display = 'block';
            }
        }

        function createNavButton(text, sectionId) {
            let button = document.createElement('button');
            button.textContent = text;
            button.style.flex = '1';
            button.style.padding = '5px';
            button.style.border = 'none';
            button.style.backgroundColor = '#f8f9fa';
            button.style.color = '#007bff';
            button.style.cursor = 'pointer';
            button.style.borderRadius = '4px';
            button.style.marginRight = '5px';
            button.onclick = function () { switchSection(sectionId); };
            return button;
        }

        function switchSection(section) {
            let tabs = {
                favorite: favoriteTab,
                known: knownTab,
                filter: filterTab,
                watched: watchedTab
            };
            let sections = {
                favorite: favoriteSection,
                known: knownSection,
                filter: filterSection,
                watched: watchedSection
            };
            for (let key in tabs) {
                if (key === section) {
                    tabs[key].style.backgroundColor = '#007bff';
                    tabs[key].style.color = '#fff';
                    sections[key].style.display = 'block';
                } else {
                    tabs[key].style.backgroundColor = '#f8f9fa';
                    tabs[key].style.color = '#007bff';
                    sections[key].style.display = 'none';
                }
            }
        }
    }
    /*******************************
     * Block 2
     * 6. Keyword management functions
     * 7. SQL handling functions
     * 10. Batch import and export functions
     *******************************/

    // ===== 6. Keyword management functions =====
    function getStoredKeywords(storageKey) {
        return GM_getValue(storageKey, []);
    }
    function getFilterEnabled() {
        return GM_getValue(FILTER_TOGGLE_KEY, false);
    }
    function getSortPriorityEnabled() {
        return GM_getValue(SORT_PRIORITY_KEY, false);
    }
    function getSortActorEnabled() {
        return GM_getValue(SORT_ACTOR_KEY, false);
    }

    function saveKeywords(keywords, storageKey, sectionId) {
        GM_setValue(storageKey, keywords);
        updateKeywordList(storageKey, sectionId);
        modifyPage(); // Update highlight
    }

    function addKeyword(keyword, storageKey, sectionId) {
        let keywords = getStoredKeywords(storageKey);
        if (!keywords.includes(keyword)) {
            // Ensure exclusivity across lists
            if (storageKey === FAVORITES_KEY) {
                removeKeywordByValue(keyword, KNOWN_KEY, 'known');
                removeKeywordByValue(keyword, STORAGE_KEY, 'filter');
                removeKeywordByValue(keyword, WATCHED_KEY, 'watched');
            } else if (storageKey === KNOWN_KEY) {
                removeKeywordByValue(keyword, STORAGE_KEY, 'filter');
                removeKeywordByValue(keyword, WATCHED_KEY, 'watched');
            } else if (storageKey === WATCHED_KEY) {
                removeKeywordByValue(keyword, FAVORITES_KEY, 'favorite');
                removeKeywordByValue(keyword, KNOWN_KEY, 'known');
                removeKeywordByValue(keyword, STORAGE_KEY, 'filter');
            }
            keywords.push(keyword);
            saveKeywords(keywords, storageKey, sectionId);
        } else {
            alert('关键词已存在');
        }
    }

    function removeKeyword(index, storageKey, sectionId) {
        let keywords = getStoredKeywords(storageKey);
        keywords.splice(index, 1);
        saveKeywords(keywords, storageKey, sectionId);
    }

    function removeKeywordByValue(keyword, storageKey, sectionId) {
        let keywords = getStoredKeywords(storageKey);
        let idx = keywords.indexOf(keyword);
        if (idx !== -1) {
            keywords.splice(idx, 1);
            saveKeywords(keywords, storageKey, sectionId);
        }
    }

    function updateKeywordList(storageKey, sectionId) {
        let keywords = getStoredKeywords(storageKey);
        let section = document.getElementById(sectionId);
        if (!section) return;
        let list = section.querySelector('ul');
        list.innerHTML = '';

        keywords.forEach((keyword, index) => {
            let listItem = document.createElement('li');
            listItem.style.display = 'flex';
            listItem.style.justifyContent = 'space-between';
            listItem.style.alignItems = 'center';
            listItem.style.padding = '5px 0';

            let keywordText = document.createElement('span');
            keywordText.textContent = keyword;

            let buttonContainer = document.createElement('div');

            let editButton = document.createElement('button');
            editButton.textContent = '编辑';
            editButton.style.marginRight = '5px';
            editButton.style.padding = '2px 5px';
            editButton.style.backgroundColor = '#ffc107';
            editButton.style.color = '#fff';
            editButton.style.border = 'none';
            editButton.style.borderRadius = '4px';
            editButton.style.cursor = 'pointer';
            editButton.style.fontSize = '12px';
            editButton.onmouseover = function () {
                editButton.style.backgroundColor = '#e0a800';
            };
            editButton.onmouseout = function () {
                editButton.style.backgroundColor = '#ffc107';
            };
            editButton.onclick = function (event) {
                event.stopPropagation();
                showEditInput(index, keyword, storageKey, sectionId);
            };

            let deleteButton = document.createElement('button');
            deleteButton.textContent = '删除';
            deleteButton.style.padding = '2px 5px';
            deleteButton.style.backgroundColor = '#dc3545';
            deleteButton.style.color = '#fff';
            deleteButton.style.border = 'none';
            deleteButton.style.borderRadius = '4px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.fontSize = '12px';
            deleteButton.onmouseover = function () {
                deleteButton.style.backgroundColor = '#c82333';
            };
            deleteButton.onmouseout = function () {
                deleteButton.style.backgroundColor = '#dc3545';
            };
            deleteButton.onclick = function (event) {
                event.stopPropagation();
                removeKeyword(index, storageKey, sectionId);
            };

            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);

            listItem.appendChild(keywordText);
            listItem.appendChild(buttonContainer);
            list.appendChild(listItem);
        });
    }

    function showEditInput(index, oldKeyword, storageKey, sectionId) {
        let newKeyword = prompt('编辑关键词', oldKeyword);
        if (newKeyword !== null && newKeyword.trim() !== '') {
            editKeyword(index, newKeyword.trim(), storageKey, sectionId);
        }
    }

    function editKeyword(index, newKeyword, storageKey, sectionId) {
        let keywords = getStoredKeywords(storageKey);
        if (!keywords.includes(newKeyword)) {
            // Ensure uniqueness
            if (storageKey === FAVORITES_KEY) {
                removeKeywordByValue(newKeyword, KNOWN_KEY, 'known');
                removeKeywordByValue(newKeyword, STORAGE_KEY, 'filter');
                removeKeywordByValue(newKeyword, WATCHED_KEY, 'watched');
            } else if (storageKey === KNOWN_KEY) {
                removeKeywordByValue(newKeyword, STORAGE_KEY, 'filter');
                removeKeywordByValue(newKeyword, WATCHED_KEY, 'watched');
            } else if (storageKey === WATCHED_KEY) {
                removeKeywordByValue(newKeyword, FAVORITES_KEY, 'favorite');
                removeKeywordByValue(newKeyword, KNOWN_KEY, 'known');
                removeKeywordByValue(newKeyword, STORAGE_KEY, 'filter');
            }
            keywords[index] = newKeyword;
            saveKeywords(keywords, storageKey, sectionId);
        } else {
            alert('关键词已存在');
        }
    }

    // ===== 7. SQL handling functions =====
    function saveSQL() {
        const editor = document.querySelector('.CodeMirror')?.CodeMirror;
        if (editor) {
            const sql = editor.getValue(); // Get SQL content from CodeMirror editor
            GM_setValue(SQL_STORAGE_KEY, sql); // Save SQL to the specified storage key
            console.log('SQL 已保存:', sql);
        } else {
            console.error('未找到 CodeMirror 编辑器');
        }
    }
    function loadSQL() {
        return GM_getValue(SQL_STORAGE_KEY, '');
    }

    // ===== 10. Batch import and export functions =====
    function showBatchImportModal(storageKey, sectionId) {
        let modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#fff';
        modal.style.padding = '20px';
        modal.style.border = '1px solid #ccc';
        modal.style.borderRadius = '8px';
        modal.style.zIndex = '2000';
        modal.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.1)';

        let textarea = document.createElement('textarea');
        textarea.placeholder = '请输入要导入的关键词，使用空格或换行分隔';
        textarea.style.width = '300px';
        textarea.style.height = '150px';
        textarea.style.marginBottom = '10px';
        modal.appendChild(textarea);

        let buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';

        let importButton = document.createElement('button');
        importButton.textContent = '导入';
        importButton.style.padding = '5px 10px';
        importButton.style.backgroundColor = '#28a745';
        importButton.style.color = '#fff';
        importButton.style.border = 'none';
        importButton.style.borderRadius = '4px';
        importButton.style.cursor = 'pointer';
        importButton.onmouseover = function () {
            importButton.style.backgroundColor = '#218838';
        };
        importButton.onmouseout = function () {
            importButton.style.backgroundColor = '#28a745';
        };
        importButton.onclick = function (event) {
            event.stopPropagation();
            let inputText = textarea.value.trim();
            if (inputText) {
                let newKeywords = inputText.split(/\s+|\n+/);
                let keywords = getStoredKeywords(storageKey);
                let duplicates = [];
                newKeywords.forEach(keyword => {
                    keyword = keyword.trim();
                    if (keyword) {
                        if (!keywords.includes(keyword)) {
                            if (storageKey === FAVORITES_KEY) {
                                removeKeywordByValue(keyword, KNOWN_KEY, 'known');
                                removeKeywordByValue(keyword, STORAGE_KEY, 'filter');
                                removeKeywordByValue(keyword, WATCHED_KEY, 'watched');
                            } else if (storageKey === KNOWN_KEY) {
                                removeKeywordByValue(keyword, STORAGE_KEY, 'filter');
                                removeKeywordByValue(keyword, WATCHED_KEY, 'watched');
                            } else if (storageKey === WATCHED_KEY) {
                                removeKeywordByValue(keyword, FAVORITES_KEY, 'favorite');
                                removeKeywordByValue(keyword, KNOWN_KEY, 'known');
                                removeKeywordByValue(keyword, STORAGE_KEY, 'filter');
                            }
                            keywords.push(keyword);
                        } else {
                            duplicates.push(keyword);
                        }
                    }
                });
                saveKeywords(keywords, storageKey, sectionId);
                if (duplicates.length > 0) {
                    alert(`以下关键词已存在于 "${sectionId}" 列表中：\n${duplicates.join(', ')}`);
                }
            }
            document.body.removeChild(modal);
        };
        buttonContainer.appendChild(importButton);

        let cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.padding = '5px 10px';
        cancelButton.style.backgroundColor = '#dc3545';
        cancelButton.style.color = '#fff';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.onmouseover = function () {
            cancelButton.style.backgroundColor = '#c82333';
        };
        cancelButton.onmouseout = function () {
            cancelButton.style.backgroundColor = '#dc3545';
        };
        cancelButton.onclick = function (event) {
            event.stopPropagation();
            document.body.removeChild(modal);
        };
        buttonContainer.appendChild(cancelButton);

        modal.appendChild(buttonContainer);
        document.body.appendChild(modal);
    }

    function exportKeywordsToCSV() {
        let favorites = getStoredKeywords(FAVORITES_KEY);
        let knowns = getStoredKeywords(KNOWN_KEY);
        let filters = getStoredKeywords(STORAGE_KEY);
        let watched = getStoredKeywords(WATCHED_KEY);

        let maxLength = Math.max(favorites.length, knowns.length, filters.length, watched.length);
        let bom = '\uFEFF';
        let csvContent = bom + '喜爱,认识,看过,屏蔽\n';

        for (let i = 0; i < maxLength; i++) {
            let fav = favorites[i] ? `"${favorites[i]}"` : '';
            let kno = knowns[i] ? `"${knowns[i]}"` : '';
            let wat = watched[i] ? `"${watched[i]}"` : '';
            let fil = filters[i] ? `"${filters[i]}"` : '';
            csvContent += `${fav},${kno},${wat},${fil}\n`;
        }

        GM_download({
            url: 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent),
            name: 'keywords.csv',
            saveAs: true
        });
    }

    /*******************************
     * Block 3
     * 8. Actress info extraction
     * 9. Actress info crawling
     * 11. Actress info insertion and hiding
     *******************************/

    // ===== 8. Actress info extraction (parse HTML) =====
    async function parseActors(doc, source, code) {
        let actors = [];
        if (source === 'javbus.com') {
            let starElements = doc.querySelectorAll('div.star-box-common li div.star-name a');
            starElements.forEach(a => {
                let actorName = a.textContent.trim();
                if (actorName) {
                    actors.push(stripParentheses(actorName));
                }
            });
            console.log(`[parseActors] javbus.com: Found actresses:`, actors);
            return actors;
        } else if (source === 'javmenu.com') {
            let actressLinks = doc.querySelectorAll('a.actress');
            actressLinks.forEach(link => {
                let actorName = link.textContent.trim();
                if (actorName) {
                    actors.push(stripParentheses(actorName));
                }
            });
            console.log(`[parseActors] javmenu.com: Found actresses:`, actors);
            return actors;
        } else if (source === 'jable.tv') {
            let modelsDiv = doc.querySelector('div.models');
            if (!modelsDiv) {
                console.warn(`[parseActors] jable.tv: Missing div.models element, returning empty array`);
                return actors;
            }
            let modelLinks = modelsDiv.querySelectorAll('a.model');
            modelLinks.forEach(link => {
                let span = link.querySelector('span.placeholder.rounded-circle');
                if (span) {
                    let actorName = span.getAttribute('data-original-title') || span.getAttribute('title');
                    if (actorName) {
                        actors.push(stripParentheses(actorName.trim()));
                    }
                }
                let img = link.querySelector('img.avatar.rounded-circle');
                if (img) {
                    let actorName = img.getAttribute('data-original-title') || img.getAttribute('title');
                    if (actorName) {
                        actors.push(stripParentheses(actorName.trim()));
                    }
                }
            });
            console.log(`[parseActors] jable.tv: Found actresses:`, actors);
            return actors;
        } else if (source === 'javdb.com') {

            // 1) Check if code is provided
            if (!code) {
                console.warn('[parseActors] javdb.com: Code not provided, cannot parse actress info');
                return actors;
            }

            // 2) Find the video detail link in search results
            let codeLink = Array.from(doc.querySelectorAll('a[href^="/v/"]')).find(link => {
                return link.textContent.trim().toUpperCase().includes(code.toUpperCase());
            });
            if (!codeLink) {
                console.warn(`[parseActors] javdb.com: No link /v/ containing ${code} found, returning empty array`);
                return actors;
            }
            let href = codeLink.getAttribute('href');
            let fullURL = `https://javdb.com${href}`;
            console.log(`[parseActors] javdb.com: Found video link => ${fullURL}`);

            // 3) Request the video detail page
            try {
                let response = await gmRequest({
                    method: 'GET',
                    url: fullURL,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.5',
                        'Connection': 'keep-alive',
                        'Referer': 'https://www.google.com/',
                        'Upgrade-Insecure-Requests': '1',
                        'Cache-Control': 'max-age=0'
                    }
                });

                // 4) Check return code
                if (response.status === 200) {
                    console.log(`[parseActors] javdb.com: Got detail page successfully (status=200) => parse actress info now`);

                    // 5) Parse actress info
                    let parser = new DOMParser();
                    let detailedDoc = parser.parseFromString(response.responseText, 'text/html');
                    let panelBlocks = detailedDoc.querySelectorAll('div.panel-block');
                    // Note: "演員:" in Traditional Chinese
                    let actorDiv = Array.from(panelBlocks).find(block => {
                        let strong = block.querySelector('strong');
                        return strong && strong.textContent.trim() === '演員:';
                    });

                    if (!actorDiv) {
                        console.warn('[parseActors] javdb.com: No <strong>演員:</strong> panel-block found in detail page');
                    } else {
                        let actorLinks = actorDiv.querySelectorAll('span.value a[href^="/actors/"]');
                        actorLinks.forEach(link => {
                            let symbol = link.nextElementSibling;
                            // If male actors are needed, remove female check
                            if (symbol && symbol.classList.contains('symbol') && symbol.classList.contains('female')) {
                                let actorName = link.textContent.trim();
                                if (actorName) {
                                    actors.push(stripParentheses(actorName));
                                }
                            }
                        });
                    }

                } else {
                    console.warn(`[parseActors] javdb.com: Failed to get detail page, status=${response.status}, returning empty array`);
                }
            } catch (error) {
                console.error(`[parseActors] javdb.com: Error fetching detail page ${fullURL}:`, error);
            }

            console.log(`[parseActors] javdb.com: Final actress list =>`, actors);
            return actors;

        } else {
            // Unknown source
            return actors;
        }
    }


    // ===== 9. Actress info crawling =====
    async function crawlMissingActors(missingActors) {
        let progressOverlay = document.createElement('div');
        progressOverlay.id = 'progressOverlay';
        progressOverlay.style.position = 'fixed';
        progressOverlay.style.top = '0';
        progressOverlay.style.left = '0';
        progressOverlay.style.width = '100%';
        progressOverlay.style.height = '100%';
        progressOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        progressOverlay.style.display = 'flex';
        progressOverlay.style.justifyContent = 'center';
        progressOverlay.style.alignItems = 'center';
        progressOverlay.style.zIndex = '10000';

        let progressBarContainer = document.createElement('div');
        progressBarContainer.id = 'progressBarContainer';
        progressBarContainer.style.width = '50%';
        progressBarContainer.style.backgroundColor = '#fff';
        progressBarContainer.style.padding = '20px';
        progressBarContainer.style.borderRadius = '8px';
        progressBarContainer.style.textAlign = 'center';

        progressBarContainer.innerHTML = `
            <h3>正在爬取演员信息...</h3>
            <div id="progressBar" style="width: 100%; background-color: #ddd; border-radius: 5px; overflow: hidden; height: 20px; margin-bottom: 10px;">
                <div style="width: 0%; height: 100%; background-color: #28a745;"></div>
            </div>
            <p id="progressText">0 / ${missingActors.length}</p>
        `;
        progressOverlay.appendChild(progressBarContainer);
        document.body.appendChild(progressOverlay);

        let progressBar = progressBarContainer.querySelector('#progressBar div');
        let progressText = progressBarContainer.querySelector('#progressText');
        let total = missingActors.length;
        let completed = 0;

        const concurrency = 4;
        let current = 0;
        let activeRequests = 0;

        async function crawl() {
            while (current < total && activeRequests < concurrency) {
                fetchActorInfo(missingActors[current]);
                current++;
            }
            if (completed >= total) {
                document.body.removeChild(progressOverlay);
                window.location.reload();
            }
        }

        async function fetchActorInfo(code) {
            activeRequests++;
            let primarySources = [
                { url: `https://www.javbus.com/${code}`, source: 'javbus.com' },
                { url: `https://javdb.com/search?q=${code}`, source: 'javdb.com' },
                { url: `https://jable.tv/videos/${code.toLowerCase()}/`, source: 'jable.tv' },
                { url: `https://javmenu.com/en/${code}`, source: 'javmenu.com' },
            ];
            let fetched = false;

            async function handleResponse(doc, source) {
                try {
                    let actors = await parseActors(doc, source, code);
                    if (actors.length > 0) {
                        let numberActorData = GM_getValue(NUMBER_ACTOR_STORAGE_KEY, {});
                        numberActorData[code] = actors;
                        GM_setValue(NUMBER_ACTOR_STORAGE_KEY, numberActorData);
                        fetched = true;
                        completeFetch();
                    } else {
                        await tryNextSource();
                    }
                } catch (error) {
                    console.error(`Error parsing actress info for code ${code}:`, error);
                    await tryNextSource();
                }
            }

            async function tryNextSource() {
                if (primarySources.length > 0) {
                    let nextSource = primarySources.shift();
                    let randomDelay = Math.floor(Math.random() * 1000) + 500;
                    await delay(randomDelay);

                    try {
                        let response = await gmRequest({
                            method: 'GET',
                            url: nextSource.url,
                            headers: {
                                'User-Agent': getRandomUserAgent(),
                                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                                'Accept-Language': 'en-US,en;q=0.5',
                                'Connection': 'keep-alive',
                                'Referer': 'https://www.google.com/',
                                'Upgrade-Insecure-Requests': '1',
                                'Cache-Control': 'max-age=0'
                            }
                        });
                        if (response.status === 200) {
                            let parser = new DOMParser();
                            let doc = parser.parseFromString(response.responseText, 'text/html');
                            await handleResponse(doc, nextSource.source);
                        } else {
                            await tryNextSource();
                        }
                    } catch (error) {
                        await tryNextSource();
                    }
                } else if (!fetched) {
                    storeEmptyActorInfo(code);
                    completeFetch();
                }
            }

            function completeFetch() {
                completed++;
                activeRequests--;
                updateProgress();
                crawl();
            }

            function storeEmptyActorInfo(code) {
                let numberActorData = GM_getValue(NUMBER_ACTOR_STORAGE_KEY, {});
                numberActorData[code] = [];
                GM_setValue(NUMBER_ACTOR_STORAGE_KEY, numberActorData);
            }

            function getRandomUserAgent() {
                const USER_AGENTS = [
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15',
                    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                ];
                return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
            }

            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            await tryNextSource();
        }

        function updateProgress() {
            progressBar.style.width = `${(completed / total) * 100}%`;
            progressText.textContent = `${completed} / ${total}`;
        }

        crawl();
    }

    // ===== 11. Actress info insertion and hiding =====
    function toggleActorsColumn() {
        let shouldInsertActor = GM_getValue(ACTORS_COLUMN_SHOULD_INSERT, false);
        if (!shouldInsertActor) {
            if (!GM_getValue(ACTORS_COLUMN_INSERTED_KEY)) {
                insertActorsInfo();
                GM_setValue(ACTORS_COLUMN_INSERTED_KEY, true);
            }
            GM_setValue(ACTORS_COLUMN_SHOULD_INSERT, true);
        } else {
            if (GM_getValue(ACTORS_COLUMN_INSERTED_KEY)) {
                hideActorsInfo();
                GM_setValue(ACTORS_COLUMN_INSERTED_KEY, false);
            }
            GM_setValue(ACTORS_COLUMN_SHOULD_INSERT, false);
        }
        updateLoadActorsButton();
    }

    function updateLoadActorsButton() {
        let loadActorsButton = document.getElementById('loadActorsButton');
        if (!loadActorsButton) return;
        let shouldInsert = GM_getValue(ACTORS_COLUMN_SHOULD_INSERT);
        loadActorsButton.textContent = shouldInsert ? '隐藏演员信息' : '加载演员信息';
    }

    function hideActorsInfo() {
        if (isJinjierArt()) {
            hideActorsColumnJinjierArt();
        } else if (isJavdbRankings()) {
            hideActorsInfoJavdb();
        } else if (isJavLibrary()) {
            hideActorsInfoJavLibrary();
        }
    }

    function insertActorsInfo() {
        if (isJinjierArt()) {
            loadActorsAndInsertColumnJinjierArt();
        } else if (isJavdbRankings()) {
            loadActorsAndInsertInfoJavdb();
        } else if (isJavLibrary()) {
            loadActorsAndInsertInfoJavLibrary();
        }
        GM_setValue(ACTORS_COLUMN_INSERTED_KEY, true);
    }

    function isJinjierArt() {
        return window.location.hostname.includes('jinjier.art');
    }

    function isJavdbRankings() {
        return window.location.hostname.includes('javdb.com') && !window.location.pathname.startsWith('/actors/') && !window.location.pathname.startsWith('/v/');
    }

    function isJavLibrary() {
        // Simple check if domain contains "javlibrary.com"
        return window.location.hostname.includes('javlibrary.com');
    }

    function hideActorsColumnJinjierArt() {
        let table = document.querySelector('table');
        if (!table) return;
        let rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            if (row.cells.length > 0) {
                row.deleteCell(0);
            }
        });
    }

    function hideActorsInfoJavdb() {
        let items = document.querySelectorAll('div.item');
        items.forEach(item => {
            let actorDiv = item.querySelector('.actors-info');
            if (actorDiv) actorDiv.remove();
        });
    }

    function hideActorsInfoJavLibrary() {
        let videos = document.querySelectorAll('div.video');
        videos.forEach(video => {
            let actorDiv = video.querySelector('.actors-info');
            if (actorDiv) {
                actorDiv.remove();
            }
        });
    }

    function loadActorsAndInsertColumnJinjierArt() {
        let codes = new Set();
        let links = document.querySelectorAll('a');
        links.forEach(link => {
            let text = link.textContent.trim();
            let codeMatch = text.match(/[A-Z]{2,5}-\d{2,5}/i);
            if (codeMatch) {
                codes.add(codeMatch[0].toUpperCase());
            }
        });

        let numberActorData = GM_getValue(NUMBER_ACTOR_STORAGE_KEY, {});
        let missingActors = [];
        codes.forEach(code => {
            if (!numberActorData[code] || !Array.isArray(numberActorData[code])) {
                missingActors.push(code);
            }
        });
        if (missingActors.length > 0) {
            let proceed = confirm(`发现 ${missingActors.length} 个番号没有对应的演员信息。是否开始爬取？`);
            if (proceed) {
                crawlMissingActors(missingActors);
            }
        }

        let codeActorMap = {};
        codes.forEach(code => {
            if (numberActorData[code] && Array.isArray(numberActorData[code])) {
                codeActorMap[code] = numberActorData[code];
            }
        });

        let table = document.querySelector('table');
        if (!table) return;
        let rows = table.querySelectorAll('tr');
        rows.forEach((row) => {
            let codeCell = row.querySelector('td a');
            let actorsHTML = '';
            if (codeCell) {
                let codeText = codeCell.textContent.trim().toUpperCase();
                let actors = codeActorMap[codeText] || [];
                actorsHTML = actors.map(actor => `<div><a href="https://javdb.com/search?f=actor&locale=zh&q=${encodeURIComponent(actor)}" target="_blank">${stripParentheses(actor)}</a></div>`).join('');
            }
            let newCell = row.insertCell(0);
            newCell.innerHTML = actorsHTML;
        });
    }

    function loadActorsAndInsertInfoJavdb() {
        let codes = new Set();
        let items = document.querySelectorAll('div.item');
        items.forEach(item => {
            let videoTitle = item.querySelector('.video-title');
            if (videoTitle) {
                let strong = videoTitle.querySelector('strong');
                if (strong) {
                    let code = strong.textContent.trim().toUpperCase();
                    let codeMatch = code.match(/[A-Z]{2,5}-\d{2,5}/i);
                    if (codeMatch) {
                        codes.add(codeMatch[0].toUpperCase());
                    }
                }
            }
        });

        let numberActorData = GM_getValue(NUMBER_ACTOR_STORAGE_KEY, {});
        let missingActors = [];
        codes.forEach(code => {
            if (!numberActorData[code] || !Array.isArray(numberActorData[code])) {
                missingActors.push(code);
            }
        });
        if (missingActors.length > 0) {
            let proceed = confirm(`发现 ${missingActors.length} 个番号没有对应的演员信息。是否开始爬取？`);
            if (proceed) {
                crawlMissingActors(missingActors);
            }
        }

        let codeActorMap = {};
        codes.forEach(code => {
            if (numberActorData[code] && Array.isArray(numberActorData[code])) {
                codeActorMap[code] = numberActorData[code];
            }
        });

        let insertedItems = 0;
        items.forEach(item => {
            let videoTitle = item.querySelector('.video-title');
            if (videoTitle) {
                let strong = videoTitle.querySelector('strong');
                if (strong) {
                    let codeText = strong.textContent.trim().toUpperCase();
                    let actors = codeActorMap[codeText] || [];
                    let actorsHTML = actors.map(actor => `<div><a href="https://javdb.com/search?f=actor&locale=zh&q=${encodeURIComponent(actor)}" target="_blank">${stripParentheses(actor)}</a></div>`).join('');
                    let actorDiv = document.createElement('div');
                    actorDiv.classList.add('actors-info');
                    actorDiv.innerHTML = `<strong>演员:</strong> ${actorsHTML}`;
                    actorDiv.style.marginBottom = '5px';
                    videoTitle.parentNode.insertBefore(actorDiv, videoTitle);
                    insertedItems++;
                }
            }
        });
    }

    function loadActorsAndInsertInfoJavLibrary() {
        // 1) Collect all codes
        let codes = new Set();
        let videoDivs = document.querySelectorAll('.video');

        videoDivs.forEach(video => {
            let codeElem = video.querySelector('.id');
            if (codeElem) {
                let codeText = codeElem.textContent.trim().toUpperCase();
                let codeMatch = codeText.match(/[A-Z]{2,5}-\d{2,5}/i);
                if (codeMatch) {
                    codes.add(codeMatch[0].toUpperCase());
                }
            }
        });

        // 2) Check existing number-actor mapping, see if any missing
        let numberActorData = GM_getValue(NUMBER_ACTOR_STORAGE_KEY, {});
        let missingActors = [];
        codes.forEach(code => {
            if (!numberActorData[code] || !Array.isArray(numberActorData[code])) {
                missingActors.push(code);
            }
        });
        if (missingActors.length > 0) {
            let proceed = confirm(`发现 ${missingActors.length} 个番号没有对应的演员信息。是否开始爬取？`);
            if (proceed) {
                crawlMissingActors(missingActors);
            }
        }

        // 3) Construct code => [actors] map
        let codeActorMap = {};
        codes.forEach(code => {
            if (numberActorData[code] && Array.isArray(numberActorData[code])) {
                codeActorMap[code] = numberActorData[code];
            }
        });

        // 4) Insert actress info into each videoDiv
        let insertedItems = 0;
        videoDivs.forEach(video => {
            let codeElem = video.querySelector('.id');
            if (!codeElem) return;

            let codeText = codeElem.textContent.trim().toUpperCase();
            let codeMatch = codeText.match(/[A-Z]{2,5}-\d{2,5}/i);
            if (!codeMatch) return;

            let finalCode = codeMatch[0].toUpperCase();
            let actors = codeActorMap[finalCode] || [];

            if (actors.length > 0) {
                let actorsHTML = actors.map(actor =>
                    `<div><a href="https://javdb.com/search?f=actor&locale=zh&q=${encodeURIComponent(actor)}" target="_blank">
                        ${stripParentheses(actor)}
                     </a></div>`
                ).join('');

                let actorDiv = document.createElement('div');
                actorDiv.classList.add('actors-info');
                actorDiv.innerHTML = `<strong>演员:</strong> ${actorsHTML}`;
                actorDiv.style.marginBottom = '5px';

                let titleElem = video.querySelector('.title');
                if (titleElem) {
                    titleElem.insertAdjacentElement('afterend', actorDiv);
                    insertedItems++;
                }
            }
        });

        console.log('[loadActorsAndInsertInfoJavLibrary] Insert actress info successfully:', insertedItems, 'items');
    }

    /*******************************
     * Block 4
     * 12. Highlight and sorting
     * 13. Floating buttons
     * 14. modifyPage function
     * 15. init function
     *******************************/

    // ===== 12. Highlight and sorting =====
    function modifyPage() {
        if (isSelectingText) return;
        try {
            let shouldInsertActors = GM_getValue(ACTORS_COLUMN_SHOULD_INSERT, false);
            let ActorsInserted = GM_getValue(ACTORS_COLUMN_INSERTED_KEY, false);
            if (shouldInsertActors && !ActorsInserted) {
                insertActorsInfo();
            }
            updateLoadActorsButton();

            let favorites = getStoredKeywords(FAVORITES_KEY);
            let knowns = getStoredKeywords(KNOWN_KEY);
            let watched = getStoredKeywords(WATCHED_KEY);
            let filters = getStoredKeywords(STORAGE_KEY);
            let sortPriorityEnabled = getSortPriorityEnabled();
            let sortActorEnabled = getSortActorEnabled();

            if (isJinjierArt()) {
                highlightRowsJinjierArt(favorites, knowns, watched, filters, sortPriorityEnabled, sortActorEnabled);
            } else if (isJavdbRankings()) {
                highlightRowsJavdb(favorites, knowns, watched, filters, sortPriorityEnabled, sortActorEnabled);
            } else if (isJavLibrary()) {
                highlightRowsJavLibrary(favorites, knowns, watched, filters, sortPriorityEnabled, sortActorEnabled);
            }
        } catch (error) {
            console.error('Error in modifyPage:', error);
        }
    }

    function highlightRowsJinjierArt(favorites, knowns, watched, filters, sortPriorityEnabled, sortActorEnabled) {
        let rows = Array.from(document.querySelectorAll('table tr'));
        let rowDataArray = [];

        rows.forEach((row, rowIndex) => {
            let cells = row.querySelectorAll('td');
            let isFavorite = false;
            let isKnown = false;
            let isWatched = false;
            let actors = [];

            cells.forEach((cell, cellIndex) => {
                if (!cell.hasAttribute('data-original-html')) {
                    cell.setAttribute('data-original-html', cell.innerHTML);
                } else {
                    cell.innerHTML = cell.getAttribute('data-original-html');
                }

                let cellText = cell.textContent;
                if (favorites.some(k => cellText.includes(k))) {
                    isFavorite = true;
                }
                if (knowns.some(k => cellText.includes(k))) {
                    isKnown = true;
                }
                if (watched.some(k => cellText.includes(k))) {
                    isWatched = true;
                }

                if (cellIndex === 0) {
                    let actorDivs = cell.querySelectorAll('div');
                    actorDivs.forEach(div => {
                        let actorName = div.textContent.trim();
                        if (actorName) actors.push(actorName);
                    });
                }
            });

            if (isWatched) {
                row.style.backgroundColor = 'lightblue';
            } else if (isFavorite) {
                row.style.backgroundColor = 'lightgreen';
            } else if (isKnown) {
                row.style.backgroundColor = 'yellow';
            } else {
                row.style.backgroundColor = '';
            }

            let shouldHide = false;
            cells.forEach(cell => {
                let cellText = cell.textContent;
                if (filters.some(k => cellText.includes(k))) {
                    shouldHide = true;
                }
            });
            shouldHide = shouldHide && getFilterEnabled();
            row.style.display = shouldHide ? 'none' : '';

            rowDataArray.push({
                rowElement: row,
                isWatched, isFavorite, isKnown,
                actors,
                originalIndex: rowIndex
            });
        });

        if (sortPriorityEnabled || sortActorEnabled) {
            rowDataArray.sort((a, b) => {
                if (sortPriorityEnabled) {
                    if (a.isWatched !== b.isWatched) return a.isWatched ? -1 : 1;
                    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
                    if (a.isKnown !== b.isKnown) return a.isKnown ? -1 : 1;
                }
                if (sortActorEnabled) {
                    let aActors = a.actors.join(', ') || '\uFFFF';
                    let bActors = b.actors.join(', ') || '\uFFFF';
                    if (aActors < bActors) return -1;
                    if (aActors > bActors) return 1;
                }
                return a.originalIndex - b.originalIndex;
            });
        }

        let tbody = document.querySelector('table tbody');
        if (tbody) {
            tbody.innerHTML = '';
            rowDataArray.forEach(rowData => {
                tbody.appendChild(rowData.rowElement);
            });
        }
    }

    function highlightRowsJavdb(favorites, knowns, watched, filters, sortPriorityEnabled, sortActorEnabled) {
        let items = Array.from(document.querySelectorAll('div.movie-list.h.cols-4.vcols-8 > div.item'));
        let itemDataArray = [];

        items.forEach((item, itemIndex) => {
            let videoTitleElem = item.querySelector('.video-title');
            let isFavorite = false;
            let isKnown = false;
            let isWatched = false;
            let actors = [];

            if (videoTitleElem) {
                let textContent = videoTitleElem.textContent;
                if (favorites.some(k => textContent.includes(k))) {
                    isFavorite = true;
                }
                if (knowns.some(k => textContent.includes(k))) {
                    isKnown = true;
                }
                if (watched.some(k => textContent.includes(k))) {
                    isWatched = true;
                }

                let actorDiv = item.querySelector('.actors-info');
                if (actorDiv) {
                    let actorLinks = actorDiv.querySelectorAll('a');
                    actorLinks.forEach(link => {
                        let actorName = link.textContent.trim();
                        if (actorName) actors.push(actorName);
                    });
                }
            }

            let box = item.querySelector('a.box');
            if (box) {
                if (isWatched) {
                    box.style.backgroundColor = 'lightblue';
                } else if (isFavorite) {
                    box.style.backgroundColor = 'lightgreen';
                } else if (isKnown) {
                    box.style.backgroundColor = 'yellow';
                } else {
                    box.style.backgroundColor = '';
                }
            }

            let shouldHide = false;
            if (box) {
                let boxText = box.textContent;
                if (filters.some(k => boxText.includes(k))) {
                    shouldHide = true;
                }
            }
            shouldHide = shouldHide && getFilterEnabled();
            item.style.display = shouldHide ? 'none' : '';

            itemDataArray.push({
                itemElement: item,
                isWatched,
                isFavorite,
                isKnown,
                actors,
                originalIndex: itemIndex
            });
        });

        if (sortPriorityEnabled || sortActorEnabled) {
            itemDataArray.sort((a, b) => {
                if (sortPriorityEnabled) {
                    if (a.isWatched !== b.isWatched) return a.isWatched ? -1 : 1;
                    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
                    if (a.isKnown !== b.isKnown) return a.isKnown ? -1 : 1;
                }
                if (sortActorEnabled) {
                    let aActors = a.actors.join(', ') || '\uFFFF';
                    let bActors = b.actors.join(', ') || '\uFFFF';
                    if (aActors < bActors) return -1;
                    if (aActors > bActors) return 1;
                }
                return a.originalIndex - b.originalIndex;
            });
        }

        let container = document.querySelector('div.movie-list.h.cols-4.vcols-8');
        if (container) {
            container.innerHTML = '';
            itemDataArray.forEach(itemData => {
                container.appendChild(itemData.itemElement);
            });
        }
    }

    function highlightRowsJavLibrary(
        favorites,
        knowns,
        watched,
        filters,
        sortPriorityEnabled,
        sortActorEnabled
    ) {
        // 0) Retrieve stored "code -> [actress array]" mapping
        let numberActorData = GM_getValue(NUMBER_ACTOR_STORAGE_KEY, {});

        // 1) Find the container that holds all video items (e.g. <div class="videos">)
        let container = document.querySelector('.videos');
        if (!container) {
            console.warn('[highlightRowsJavLibrary] .videos container not found, exiting');
            return;
        }

        // 2) Get all video elements, each is <div class="video" id="vid_XXXXX">
        let items = Array.from(container.querySelectorAll('div.video'));

        // 3) Collect item info for potential sorting
        let itemDataArray = [];

        items.forEach((item, index) => {
            // 3.1) Get code and title
            let codeElem = item.querySelector('.id');
            let titleElem = item.querySelector('.title');

            let codeText = codeElem ? codeElem.textContent.trim().toUpperCase() : '';
            let titleText = titleElem ? titleElem.textContent.trim() : '';

            // 3.2) Based on code, retrieve actress array from numberActorData
            let codeMatch = codeText.match(/[A-Z]{2,5}-\d{2,5}/i);
            let codeKey = codeMatch ? codeMatch[0].toUpperCase() : null;
            let itemActors = (codeKey && Array.isArray(numberActorData[codeKey]))
                ? numberActorData[codeKey]
                : [];

            // 3.3) Determine if this video matches favorites/known/watched by code/title
            let isFavorite = false;
            let isKnown = false;
            let isWatched = false;
            let shouldHide = false;

            if (favorites.some(k => codeText.includes(k) || titleText.includes(k))) {
                isFavorite = true;
            }
            if (knowns.some(k => codeText.includes(k) || titleText.includes(k))) {
                isKnown = true;
            }
            if (watched.some(k => codeText.includes(k) || titleText.includes(k))) {
                isWatched = true;
            }
            if (filters.some(k => codeText.includes(k) || titleText.includes(k))) {
                shouldHide = true;
            }

            // 3.4) Check actress info for matches
            let actorHasFavorite = itemActors.some(actor =>
                favorites.some(k => actor.includes(k))
            );
            let actorHasKnown = itemActors.some(actor =>
                knowns.some(k => actor.includes(k))
            );
            let actorHasWatched = itemActors.some(actor =>
                watched.some(k => actor.includes(k))
            );
            let actorHasFilter = itemActors.some(actor =>
                filters.some(k => actor.includes(k))
            );

            if (actorHasFavorite) isFavorite = true;
            if (actorHasKnown) isKnown = true;
            if (actorHasWatched) isWatched = true;

            if (actorHasFilter) shouldHide = true;
            // If the first three are not matched but there's a filter, set true
            if (!isFavorite && !isKnown && !isWatched && shouldHide) {
                shouldHide = true;
            } else {
                shouldHide = false;
            }

            // 3.5) Assign background color: watched > favorite > known
            if (isWatched) {
                item.style.backgroundColor = 'lightblue';
            } else if (isFavorite) {
                item.style.backgroundColor = 'lightgreen';
            } else if (isKnown) {
                item.style.backgroundColor = 'yellow';
            } else {
                item.style.backgroundColor = '';
            }

            // Enable hide only if filter toggle is ON
            shouldHide = shouldHide && getFilterEnabled();
            item.style.display = shouldHide ? 'none' : '';

            // 3.6) Save info into array
            itemDataArray.push({
                itemElement: item,
                isWatched,
                isFavorite,
                isKnown,
                actors: itemActors,
                originalIndex: index
            });
        });

        // 4) If we enable priority or actress sorting
        if (sortPriorityEnabled || sortActorEnabled) {
            itemDataArray.sort((a, b) => {
                // 4.1) Priority sorting: watched > favorite > known
                if (sortPriorityEnabled) {
                    if (a.isWatched !== b.isWatched) return a.isWatched ? -1 : 1;
                    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
                    if (a.isKnown !== b.isKnown) return a.isKnown ? -1 : 1;
                }
                // 4.2) Actress sorting
                if (sortActorEnabled) {
                    let aActors = a.actors.join(', ') || '\uFFFF';
                    let bActors = b.actors.join(', ') || '\uFFFF';
                    if (aActors < bActors) return -1;
                    if (aActors > bActors) return 1;
                }
                // 4.3) If none of the above, follow original DOM order
                return a.originalIndex - b.originalIndex;
            });
        }

        // 5) After sorting, re-append itemElements to container
        container.innerHTML = '';
        itemDataArray.forEach(itemData => {
            container.appendChild(itemData.itemElement);
        });
    }

    // ===== 13. Floating buttons =====
    function createFloatingButtons() {
        let filterButton = document.createElement('button');
        filterButton.id = 'filterButton';
        filterButton.textContent = '屏蔽';
        filterButton.classList.add('floating-button');
        document.body.appendChild(filterButton);

        let favoriteButton = document.createElement('button');
        favoriteButton.id = 'favoriteButton';
        favoriteButton.textContent = '喜爱';
        favoriteButton.classList.add('floating-button');
        document.body.appendChild(favoriteButton);

        let knownButton = document.createElement('button');
        knownButton.id = 'knownButton';
        knownButton.textContent = '认识';
        knownButton.classList.add('floating-button');
        document.body.appendChild(knownButton);

        let watchedButton = document.createElement('button');
        watchedButton.id = 'watchedButton';
        watchedButton.textContent = '看过';
        watchedButton.classList.add('floating-button');
        document.body.appendChild(watchedButton);

        document.addEventListener('mousedown', function () {
            isSelectingText = true;
        });
        document.addEventListener('mouseup', function (event) {
            isSelectingText = false;
            setTimeout(function () {
                let selectedText = window.getSelection().toString().trim();
                if (selectedText.length > 0) {
                    let mouseX = event.clientX;
                    let mouseY = event.clientY;
                    let offset = 20;

                    filterButton.style.left = mouseX + 'px';
                    filterButton.style.top = (mouseY + offset) + 'px';
                    filterButton.style.display = 'block';

                    favoriteButton.style.left = (mouseX + 60) + 'px';
                    favoriteButton.style.top = (mouseY + offset) + 'px';
                    favoriteButton.style.display = 'block';

                    knownButton.style.left = (mouseX + 120) + 'px';
                    knownButton.style.top = (mouseY + offset) + 'px';
                    knownButton.style.display = 'block';

                    watchedButton.style.left = (mouseX + 180) + 'px';
                    watchedButton.style.top = (mouseY + offset) + 'px';
                    watchedButton.style.display = 'block';

                    filterButton.onclick = function (e) {
                        e.stopPropagation();
                        addKeyword(selectedText, STORAGE_KEY, 'filter');
                        hideFloatingButtons();
                    };
                    favoriteButton.onclick = function (e) {
                        e.stopPropagation();
                        addKeyword(selectedText, FAVORITES_KEY, 'favorite');
                        hideFloatingButtons();
                    };
                    knownButton.onclick = function (e) {
                        e.stopPropagation();
                        addKeyword(selectedText, KNOWN_KEY, 'known');
                        hideFloatingButtons();
                    };
                    watchedButton.onclick = function (e) {
                        e.stopPropagation();
                        addKeyword(selectedText, WATCHED_KEY, 'watched');
                        hideFloatingButtons();
                    };
                } else {
                    hideFloatingButtons();
                }
            }, 0);
        });

        function hideFloatingButtons() {
            filterButton.style.display = 'none';
            favoriteButton.style.display = 'none';
            knownButton.style.display = 'none';
            watchedButton.style.display = 'none';
        }
    }
    createFloatingButtons();

    // ===== 14. modifyPage function =====
    function setupExecuteButtonListener() {
        let executeButton = document.getElementById('execute');
        if (executeButton) {
            executeButton.addEventListener('click', function (event) {
                event.stopPropagation();
                GM_setValue(ACTORS_COLUMN_INSERTED_KEY, false);
                saveSQL();
                modifyPage();
            });
        }
    }
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function (event) {
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault();
                GM_setValue(ACTORS_COLUMN_INSERTED_KEY, false);
                saveSQL();
                modifyPage();
            }
        });
    }

    // ===== 15. init function =====
    function initJinjier() {
        console.log('Initializing jinjier.art...');
        GM_setValue(ACTORS_COLUMN_INSERTED_KEY, false);
        setupExecuteButtonListener();
        setupKeyboardShortcuts();
        setTimeout(() => {
            let editor = document.querySelector('.CodeMirror')?.CodeMirror;
            if (editor) {
                let lastSQL = loadSQL();
                if (lastSQL) {
                    editor.setValue(lastSQL);
                }
                let executeButton = document.getElementById('execute');
                if (executeButton) {
                    // Automatically click once to execute SQL
                    executeButton.click();
                }
            }
        }, 1000);
    }

    function initJavdb() {
        console.log('Initializing javdb.com/rankings...');
        GM_setValue(ACTORS_COLUMN_INSERTED_KEY, false);
        setTimeout(() => {
            modifyPage();
        }, 500);
    }

    function initJavLibrary() {
        console.log('Initializing javlibrary.com...');

        const style = document.createElement('style');
        style.innerHTML = `
      .video {
        height: auto !important;
        max-height: 380px !important;
        overflow-y: auto !important;
      }
    `;
        document.head.appendChild(style);
        GM_setValue(ACTORS_COLUMN_INSERTED_KEY, false);
        setTimeout(() => {
            modifyPage();
        }, 500);
    }

    // can be used to listen to other event sent by other scripts
    // useful for interation
    // here we have another script which give waterfull like infite scroll and sent a infiniteScoroll:newPageLoaded event, we insert actors and modifypage everytime after newPageLoaded
    function setupEventListener() {
        window.addEventListener('infiniteScroll:newPageLoaded', function(event) {
            console.log('Received infiniteScroll:newPageLoaded event:', event.detail);
            toggleActorsColumn();
            toggleActorsColumn();
            modifyPage();
        });
    }

    function init() {
        createKeywordManager();
        const hostname = window.location.hostname;
        const pathname = window.location.pathname;
        if (isJinjierArt()) {
            initJinjier();
        } else if (isJavdbRankings()) {
            initJavdb();
        } else if (isJavLibrary()) {
            initJavLibrary();
        } else {
            console.log('Detected other site, applying minimal logic...');
        }

        setupEventListener();
    }
    init();
})();
