// ==UserScript==
// @name         给DeepSeek添加原生化的提示词管理功能
// @namespace    http://tampermonkey.net/
// @version      1.17.1
// @description  为 DeepSeek 添加提示词管理功能。支持标签分类、搜索过滤，优化面板操作体验。
// @author       cores
// @match        https://chat.deepseek.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536411/%E7%BB%99DeepSeek%E6%B7%BB%E5%8A%A0%E5%8E%9F%E7%94%9F%E5%8C%96%E7%9A%84%E6%8F%90%E7%A4%BA%E8%AF%8D%E7%AE%A1%E7%90%86%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/536411/%E7%BB%99DeepSeek%E6%B7%BB%E5%8A%A0%E5%8E%9F%E7%94%9F%E5%8C%96%E7%9A%84%E6%8F%90%E7%A4%BA%E8%AF%8D%E7%AE%A1%E7%90%86%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Script Configuration ---
    const SCRIPT_PREFIX = 'dspm_'; // Prefix for localStorage keys, IDs, and CSS classes
    const ITEMS_PER_PAGE = 5; // Number of prompts to display per page
    const DEFAULT_TAGS = ['常用', '工作', '学习', '创意', '其他']; // Default tag categories
    const PAGE_SIZE_OPTIONS = [5, 10, 15]; // Page size options

    // --- Helper Functions ---
    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => parent.querySelectorAll(selector);
    const debounce = (fn, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    // Function to escape HTML content
    const escapeHTML = (str) => {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    // --- Dynamic CDN Injection ---
    function injectCDN(url, type) {
        return new Promise((resolve, reject) => {
            let element;
            if (type === 'script') {
                element = document.createElement('script');
                element.src = url;
            } else if (type === 'link') {
                element = document.createElement('link');
                element.href = url;
                element.rel = 'stylesheet';
            }
            if (element) {
                element.onload = resolve;
                element.onerror = (err) => {
                    console.error(`DSPM: Failed to load CDN ${type}: ${url}`, err);
                    reject(err);
                };
                document.head.appendChild(element);
            } else {
                reject(new Error('Invalid CDN type'));
            }
        });
    }

    // --- Base Styles (Minimal, mostly for scrollbars and transitions) ---
    GM_addStyle(`
        .dspm-smooth-scroll { scroll-behavior: smooth; }
        .dspm-custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .dspm-custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .dspm-custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(156, 163, 175, 0.5); /* Light mode thumb color */
            border-radius: 4px;
        }
        .dspm-custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(107, 114, 128, 0.7); }
        .dark .dspm-custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(75, 85, 99, 0.6); /* Dark mode thumb color */
        }
        .dark .dspm-custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(55, 65, 81, 0.8); }
        .dspm-fade-in { animation: dspmFadeInAnimation 0.3s ease-out forwards; opacity: 0; }
        @keyframes dspmFadeInAnimation { to { opacity: 1; } }

        /* Management Panel Styles */
        .dspm-management-side-panel {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateX(100%);
            height: 100vh !important; /* Ensure panel is full viewport height */
        }
        .dspm-management-side-panel.visible { transform: translateX(0); }

        /* Content area within the management panel */
        .dspm-management-content-area {
            height: calc(100vh - 62px - 52px - 42px) !important; /* Full height minus header, search bar and pagination */
            overflow-y: scroll !important; /* Ensure vertical scrollbar track is always visible */
            padding-bottom: 60px; /* Increased to ensure content isn't hidden by pagination bar */
        }

        /* Search bar */
        .dspm-search-bar-container {
            padding: 8px 16px;
            border-bottom: 1px solid rgba(229, 231, 235, 1);
            background-color: white;
        }
        .dark .dspm-search-bar-container {
            border-bottom-color: rgba(75, 85, 99, 0.4);
            background-color: rgba(31, 41, 55, 1);
        }

        /* Fixed pagination component */
        .dspm-pagination-container {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 52px;
            border-top: 1px solid rgba(229, 231, 235, 1);
            background-color: white;
            z-index: 30; /* Increased z-index to ensure it's above content */
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
        }
        .dark .dspm-pagination-container {
            border-top-color: rgba(75, 85, 99, 0.4);
            background-color: rgba(31, 41, 55, 1);
        }

        /* Tag styles */
        .dspm-tag {
            font-size: 0.7rem;
            padding: 0.15rem 0.5rem;
            border-radius: 9999px;
            display: inline-flex;
            align-items: center;
            margin-right: 0.375rem;
            margin-bottom: 0.25rem;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        .dspm-tag:hover {
            opacity: 0.8;
        }
        .dspm-tag-selected {
            box-shadow: 0 0 0 1px rgba(79, 70, 229, 0.5);
        }
        .dspm-tag-filter-container {
            padding: 0.75rem 1rem 0.25rem;
            overflow-x: auto;
            white-space: nowrap;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
        .dspm-tag-filter-container::-webkit-scrollbar {
            display: none;
        }

        body { transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out; }

        /* Toggle button styles */
        .dspm-management-panel-toggle-btn {
            transition: all 0.3s ease-in-out;
            position: fixed;
            top: 50%;
            transform: translateY(-50%);
            right: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
            z-index: 100;
            border-radius: 8px 0 0 8px;
            border-right: none;
        }
    `);

    // --- UI Element Variables ---
    let usagePromptDropdown;
    let promptUsageButtonWrapper;
    let promptUsageButton;
    let managementSidePanel;
    let managementPanelToggleButton;
    let currentPage = 1;
    let selectedPrompts = [];
    let isMultiSelectMode = false; // Track if multi-select mode is enabled
    let searchTerm = ''; // For search filtering
    let selectedTags = []; // For tag filtering
    let pageSize = GM_getValue(SCRIPT_PREFIX + 'page_size', ITEMS_PER_PAGE); // User's preferred page size

    // --- Core Functions ---
    function createElements() {
        const buttonContainer = $('.ec4f5d61');
        if (!buttonContainer || $(`#${SCRIPT_PREFIX}usage_button`)) return;

        promptUsageButtonWrapper = document.createElement('div');
        promptUsageButtonWrapper.className = 'prompt-usage-button-wrapper inline-flex items-center relative';

        promptUsageButton = document.createElement('button');
        promptUsageButton.id = SCRIPT_PREFIX + 'usage_button';
        promptUsageButton.className = `prompt-usage-button flex items-center justify-center h-[34px] px-[14px] py-[8px] text-[14px] font-medium bg-white dark:bg-gray-800 text-[#4c4c4c] dark:text-gray-300 border border-[rgba(0,0,0,0.12)] dark:border-gray-600 rounded-[10px] hover:bg-[#E0E4ED] dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-150 ease-in-out transform hover:scale-105 ml-1 mr-2.5`;
        promptUsageButton.innerHTML = `<i class="fas fa-star w-[18px] h-[18px] mr-2"></i><span class="button-text-content">提示词库</span>`;
        promptUsageButtonWrapper.appendChild(promptUsageButton);

        const buttonsInContainer = buttonContainer.children;
        if (buttonsInContainer.length >= 1) buttonContainer.insertBefore(promptUsageButtonWrapper, buttonsInContainer[1]);
        else buttonContainer.appendChild(promptUsageButtonWrapper);

        usagePromptDropdown = document.createElement('div');
        usagePromptDropdown.id = SCRIPT_PREFIX + 'usage_dropdown';
        usagePromptDropdown.className = `usage-prompt-dropdown dspm-custom-scrollbar dspm-fade-in hidden absolute z-50 mt-2 w-72 md:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl max-h-80 overflow-y-auto p-2 space-y-1`; // Dropdown uses overflow-y: auto
        document.body.appendChild(usagePromptDropdown);

        promptUsageButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = !usagePromptDropdown.classList.contains('hidden');
            if (isVisible) closeUsageDropdown();
            else openUsageDropdown();
        });

        managementPanelToggleButton = document.createElement('button');
        managementPanelToggleButton.id = SCRIPT_PREFIX + 'management_toggle_btn';
        managementPanelToggleButton.className = `dspm-management-panel-toggle-btn p-2.5 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border border-r-0 border-gray-300 dark:border-gray-600 shadow-md focus:outline-none`;
        managementPanelToggleButton.title = '管理提示词';
        managementPanelToggleButton.innerHTML = `<i class="fas fa-cog fa-lg"></i>`;
        document.body.appendChild(managementPanelToggleButton);
        managementPanelToggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleManagementPanel(true); // Always open the panel
        });

        managementSidePanel = document.createElement('div');
        managementSidePanel.id = SCRIPT_PREFIX + 'management_side_panel';
        managementSidePanel.className = `dspm-management-side-panel fixed top-0 right-0 h-full w-full max-w-sm md:max-w-md z-50 bg-gray-50 dark:bg-gray-850 shadow-2xl flex flex-col border-l border-gray-200 dark:border-gray-700`;
        document.body.appendChild(managementSidePanel);

        document.addEventListener('click', (e) => {
            if (document.body.classList.contains(SCRIPT_PREFIX + 'modal-open')) {
                // If a modal is open, its own overlay click handler should manage closure.
                // This global listener should not interfere with modal overlay clicks.
                return;
            }

            if (usagePromptDropdown && !usagePromptDropdown.classList.contains('hidden')) {
                if (!usagePromptDropdown.contains(e.target) && !promptUsageButton.contains(e.target)) {
                    closeUsageDropdown();
                }
            }
        });
    }

    function openUsageDropdown() {
        if (!usagePromptDropdown || !promptUsageButton) return;
        updateUsageDropdown();
        usagePromptDropdown.classList.remove('hidden');
        promptUsageButton.classList.add('active', 'bg-[#E0E4ED]', 'dark:bg-gray-700');
        updateUsageDropdownPosition();
    }

    function closeUsageDropdown() {
        if (!usagePromptDropdown || !promptUsageButton) return;
        usagePromptDropdown.classList.add('hidden');
        promptUsageButton.classList.remove('active', 'bg-[#E0E4ED]', 'dark:bg-gray-700');
    }

    function updateUsageDropdownPosition() {
        if (!usagePromptDropdown || !promptUsageButtonWrapper) return;
        const buttonRect = promptUsageButtonWrapper.getBoundingClientRect();
        const dropdownHeight = usagePromptDropdown.offsetHeight;
        const windowHeight = window.innerHeight;
        let top = buttonRect.bottom + 8;
        if (top + dropdownHeight > windowHeight - 20) top = buttonRect.top - dropdownHeight - 8;
        if (top < 20) top = 20;
        usagePromptDropdown.style.left = `${buttonRect.left}px`;
        usagePromptDropdown.style.top = `${top}px`;
        usagePromptDropdown.style.minWidth = `${buttonRect.width}px`;
    }

    function updateUsageDropdown() {
        if (!usagePromptDropdown) return;
        const savedPrompts = GM_getValue(SCRIPT_PREFIX + 'prompts', []);
        usagePromptDropdown.innerHTML = '';
        if (savedPrompts.length === 0) {
            usagePromptDropdown.innerHTML = `<div class="p-4 text-center text-sm text-gray-500 dark:text-gray-400">暂无提示词。请通过右侧 <i class="fas fa-cog mx-1"></i> 管理面板添加。</div>`;
            return;
        }
        savedPrompts.forEach(prompt => {
            const item = document.createElement('div');
            item.className = `p-2.5 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150`;

            let tagsHTML = '';
            if (prompt.tags && prompt.tags.length > 0) {
                tagsHTML = `<div class="flex flex-wrap gap-1 mt-1">
                    ${prompt.tags.map(tag => `<span class="dspm-tag bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">${tag}</span>`).join('')}
                </div>`;
            }

            item.innerHTML = `<div class="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">${prompt.title}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">${escapeHTML(prompt.content)}</div>
                ${tagsHTML}`;

            item.addEventListener('click', async () => {
                try {
                    const textArea = $('#chat-input');
                    if (!textArea) throw new Error('Chat input not found');
                    textArea.focus();
                    document.execCommand('selectAll', false, null);
                    document.execCommand('delete', false, null);
                    document.execCommand('insertText', false, prompt.content);
                    closeUsageDropdown();
                } catch (err) { console.error('DSPM: Failed to fill prompt:', err); alert('填充提示词失败。'); }
            });
            usagePromptDropdown.appendChild(item);
        });
    }

    function toggleManagementPanel(forceState) {
        if (!managementSidePanel || !managementPanelToggleButton) return;

        // Get current state (is panel visible?)
        const isPanelVisible = managementSidePanel.classList.contains('visible');

        // Determine new state: if forceState is explicitly defined use it, otherwise toggle
        const show = forceState !== undefined ? forceState : !isPanelVisible;

        if (show) {
            updateManagementPanelContent();
            managementSidePanel.classList.add('visible');

            // Hide the toggle button when panel is open
            managementPanelToggleButton.style.display = 'none';
            console.log('DSPM: Panel opened, toggle button hidden');
        } else {
            managementSidePanel.classList.remove('visible');

            // Show the toggle button when panel is closed
            managementPanelToggleButton.style.display = 'flex';
            console.log('DSPM: Panel closed, toggle button shown');
        }
    }

    function updateManagementPanelContent() {
        if (!managementSidePanel) return;
        const savedPrompts = GM_getValue(SCRIPT_PREFIX + 'prompts', []);

        // Apply search and tag filters to prompts
        const filteredPrompts = savedPrompts.filter(prompt => {
            // Check search term filter
            const matchesSearch = searchTerm === '' ||
                prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                prompt.content.toLowerCase().includes(searchTerm.toLowerCase());

            // Check tag filter
            const matchesTags = selectedTags.length === 0 ||
                (prompt.tags && selectedTags.some(tag => prompt.tags.includes(tag)));

            return matchesSearch && matchesTags;
        });

        // Calculate pagination based on filtered results
        const totalPages = Math.max(1, Math.ceil(filteredPrompts.length / pageSize));
        if (currentPage > totalPages) currentPage = totalPages;

        // Get prompts for current page
        const startIndex = (currentPage - 1) * pageSize;
        const paginatedPrompts = filteredPrompts.slice(startIndex, startIndex + pageSize);

        // Filter selected prompts to ensure they're still valid
        selectedPrompts = selectedPrompts.filter(index => index < savedPrompts.length);

        managementSidePanel.innerHTML = `
            <div class="flex flex-col h-full">
                <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">管理提示词</h3>
                    <div class="flex items-center space-x-1">
                        <button id="${SCRIPT_PREFIX}multi_select_toggle_btn" title="${isMultiSelectMode ? '退出多选' : '开启多选'}" class="p-2 rounded-md ${isMultiSelectMode ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'} hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                            <i class="fas fa-check-square fa-fw"></i>
                        </button>
                        <button id="${SCRIPT_PREFIX}import_export_btn" title="导入/导出" class="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                            <i class="fas fa-file-import fa-fw"></i>
                        </button>
                        <button id="${SCRIPT_PREFIX}clear_all_btn" title="清空全部提示词" class="p-2 rounded-md text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700/30 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                            <i class="fas fa-trash-alt fa-fw"></i>
                        </button>
                        <button id="${SCRIPT_PREFIX}add_prompt_btn" title="创建新提示词" class="w-8 h-8 flex items-center justify-center rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-150 ease-in-out transform hover:scale-105 shadow-sm">
                            <i class="fas fa-plus text-xs"></i>
                        </button>
                        <button id="${SCRIPT_PREFIX}close_panel_btn" title="关闭面板" class="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 ml-1 transition-colors">
                            <i class="fas fa-times fa-fw"></i>
                        </button>
                    </div>
                </div>

                <div class="dspm-search-bar-container flex items-center bg-white dark:bg-gray-800">
                    <div class="w-full relative">
                        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"></i>
                        <input
                            type="text"
                            id="${SCRIPT_PREFIX}search_input"
                            placeholder="搜索提示词..."
                            value="${escapeHTML(searchTerm)}"
                            class="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                        >
                        ${searchTerm ? `<button id="${SCRIPT_PREFIX}clear_search_btn" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"><i class="fas fa-times"></i></button>` : ''}
                    </div>
                </div>

                <div class="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <div class="dspm-tag-filter-container inline-flex overflow-x-auto">
                        ${DEFAULT_TAGS.map(tag => {
                            const isSelected = selectedTags.includes(tag);
                            return `<span
                                data-tag="${tag}"
                                class="dspm-tag ${isSelected ? 'dspm-tag-selected bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}"
                            >${tag}${isSelected ? ' <i class="fas fa-check ml-1 text-xs"></i>' : ''}</span>`;
                        }).join('')}
                    </div>
                    <div class="flex items-center whitespace-nowrap">
                        <span class="text-xs text-gray-500 dark:text-gray-400 mr-1">每页显示:</span>
                        <select id="${SCRIPT_PREFIX}page_size_select" class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded px-2 py-1 text-xs">
                            ${PAGE_SIZE_OPTIONS.map(size => `<option value="${size}" ${pageSize === size ? 'selected' : ''}>${size}项</option>`).join('')}
                        </select>
                    </div>
                </div>

                ${selectedPrompts.length > 0 ? `
                <div class="flex items-center justify-between px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800/30">
                    <span class="text-sm font-medium text-indigo-700 dark:text-indigo-300">已选择 ${selectedPrompts.length} 项</span>
                    <div class="flex items-center space-x-2">
                        <button id="${SCRIPT_PREFIX}apply_selected_btn" class="px-2 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded focus:outline-none transition-colors">
                            应用选中
                        </button>
                        <button id="${SCRIPT_PREFIX}deselect_all_btn" class="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded focus:outline-none transition-colors">
                            取消选择
                        </button>
                    </div>
                </div>` : ''}

                <div class="dspm-management-content-area flex-grow p-4 dspm-custom-scrollbar dspm-smooth-scroll">
                    <div class="pb-20"> <!-- Extra padding to avoid pagination overlap -->
                    ${savedPrompts.length === 0 ?
                        `<div class="text-center py-10">
                            <i class="fas fa-folder-open fa-3x text-gray-400 dark:text-gray-500 mb-3"></i>
                            <p class="text-sm text-gray-500 dark:text-gray-400">暂无提示词，点击"创建"添加一个吧！</p>
                        </div>` :
                        `<div class="space-y-3">
                            ${paginatedPrompts.map((prompt, pageIndex) => {
                                const actualIndex = startIndex + pageIndex;
                                const isSelected = selectedPrompts.includes(actualIndex);
                                return `
                                <div id="${SCRIPT_PREFIX}prompt_card_${actualIndex}" class="dspm-prompt-card ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700' : 'bg-white dark:bg-gray-750 border-gray-200 dark:border-gray-700'} p-3.5 rounded-lg shadow-sm border hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-150 ease-in-out">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-2 flex-grow">
                                            ${isMultiSelectMode ? `<input type="checkbox" id="${SCRIPT_PREFIX}select_prompt_${actualIndex}" class="dspm-select-prompt-checkbox w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-offset-gray-800" ${isSelected ? 'checked' : ''}>` : ''}
                                            <h4 class="text-md font-semibold text-gray-800 dark:text-gray-100 truncate pr-2 flex-grow">${prompt.title}</h4>
                                        </div>
                                        <div class="flex items-center space-x-1">
                                            <button data-index="${actualIndex}" class="dspm-apply-prompt-btn p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-green-600 dark:hover:text-green-400 transition-colors" title="应用提示词">
                                                <i class="fas fa-paper-plane fa-sm"></i>
                                            </button>
                                            <button data-index="${actualIndex}" class="dspm-edit-prompt-btn p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="编辑提示词">
                                                <i class="fas fa-pen fa-sm"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <p class="text-sm text-gray-600 dark:text-gray-300 mt-1.5 break-words line-clamp-2">${escapeHTML(prompt.content)}</p>
                                    ${prompt.tags && prompt.tags.length > 0 ? `
                                    <div class="mt-2">
                                        ${prompt.tags.map(tag => `
                                            <span class="dspm-tag bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">${tag}</span>
                                        `).join('')}
                                    </div>
                                    ` : ''}
                                </div>`;
                            }).join('')}
                        </div>`}
                    </div> <!-- Close the extra padding div -->
                </div>

                ${totalPages > 1 ? `
                                <div class="dspm-pagination-container">                    <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center">                        <span>第 ${currentPage} 页，共 ${totalPages} 页</span>                    </div>                    <div class="flex items-center space-x-2">                        <button id="${SCRIPT_PREFIX}prev_page_btn" class="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}" ${currentPage === 1 ? 'disabled' : ''}>                            <i class="fas fa-chevron-left mr-1"></i> 上一页                        </button>                        <button id="${SCRIPT_PREFIX}next_page_btn" class="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}" ${currentPage === totalPages ? 'disabled' : ''}>                            下一页 <i class="fas fa-chevron-right ml-1"></i>                        </button>                    </div>                </div>` : `
                <div class="dspm-pagination-container">
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                        第 1 页，共 1 页
                    </div>
                    <div></div>
                </div>`}
            </div>`;

        // Setup multi-select toggle
        const multiSelectToggleBtn = $(`#${SCRIPT_PREFIX}multi_select_toggle_btn`);
        if (multiSelectToggleBtn) {
            multiSelectToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                isMultiSelectMode = !isMultiSelectMode;
                updateManagementPanelContent();
            });
        }

        // Setup multi-select functionality
        if (isMultiSelectMode) {
            $$('.dspm-select-prompt-checkbox', managementSidePanel).forEach(checkbox => {
                const index = parseInt(checkbox.id.replace(`${SCRIPT_PREFIX}select_prompt_`, ''));
                checkbox.addEventListener('change', (e) => {
                    e.stopPropagation();
                    if (checkbox.checked) {
                        if (!selectedPrompts.includes(index)) {
                            selectedPrompts.push(index);
                        }
                    } else {
                        const idxInSelected = selectedPrompts.indexOf(index);
                        if (idxInSelected !== -1) {
                            selectedPrompts.splice(idxInSelected, 1);
                        }
                    }
                    updateManagementPanelContent();
                });
            });
        }

        // Setup multi-select action buttons
        if (selectedPrompts.length > 0) {
            const deselectAllBtn = $(`#${SCRIPT_PREFIX}deselect_all_btn`, managementSidePanel);
            const applySelectedBtn = $(`#${SCRIPT_PREFIX}apply_selected_btn`, managementSidePanel);

            if (deselectAllBtn) {
                deselectAllBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    selectedPrompts = [];
                    updateManagementPanelContent();
                });
            }

            if (applySelectedBtn) {
                applySelectedBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    applyPrompts(selectedPrompts);
                });
            }
        }

        $(`#${SCRIPT_PREFIX}add_prompt_btn`, managementSidePanel).addEventListener('click', (e) => { e.stopPropagation(); showEditPromptModal(); });

        // Apply individual prompt
        $$('.dspm-apply-prompt-btn', managementSidePanel).forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                applyPrompts([parseInt(this.dataset.index)]);
            });
        });

        // Edit individual prompt
        $$('.dspm-edit-prompt-btn', managementSidePanel).forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                showEditPromptModal(savedPrompts[parseInt(this.dataset.index)], parseInt(this.dataset.index));
            });
        });

        // Quick tag functionality
        $$('.dspm-tag-prompt-btn', managementSidePanel).forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const index = parseInt(this.dataset.index);
                const prompt = savedPrompts[index];
                showQuickTagPopover(this, prompt, index);
            });
        });

        setupImportExportMenu($(`#${SCRIPT_PREFIX}import_export_btn`, managementSidePanel));

        const clearAllBtn = $(`#${SCRIPT_PREFIX}clear_all_btn`, managementSidePanel);
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showConfirmationDialog(
                    '确认清空全部提示词',
                    '确定要删除所有已保存的提示词吗？此操作无法撤销。',
                    () => {
                        console.log('DSPM: Clearing all prompts.');
                        GM_setValue(SCRIPT_PREFIX + 'prompts', []);
                        selectedPrompts = [];
                        currentPage = 1;
                        updateManagementPanelContent();
                        updateUsageDropdown();
                        alert('所有提示词已清空！');
                    },
                    '清空全部'
                );
            });
        }

        // Set up event handlers for pagination
        if (totalPages > 1) {
            const prevPageBtn = $(`#${SCRIPT_PREFIX}prev_page_btn`, managementSidePanel);
            const nextPageBtn = $(`#${SCRIPT_PREFIX}next_page_btn`, managementSidePanel);

            if (prevPageBtn && currentPage > 1) {
                prevPageBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (currentPage > 1) {
                        currentPage--;
                        updateManagementPanelContent();
                    }
                });
            }

            if (nextPageBtn && currentPage < totalPages) {
                nextPageBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (currentPage < totalPages) {
                        currentPage++;
                        updateManagementPanelContent();
                    }
                });
            }
        }

        // Setup close panel button
        const closePanelBtn = $(`#${SCRIPT_PREFIX}close_panel_btn`, managementSidePanel);
        if (closePanelBtn) {
            closePanelBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleManagementPanel(false);
                showNotification('面板已关闭', 'info');
            });
        }

        // Setup tag filtering functionality
        $$('.dspm-tag', managementSidePanel).forEach(tagElement => {
            tagElement.addEventListener('click', (e) => {
                e.stopPropagation();
                const tag = tagElement.dataset.tag;
                if (!tag) return;

                const tagIndex = selectedTags.indexOf(tag);
                if (tagIndex === -1) {
                    // Add tag to selection
                    selectedTags.push(tag);
                } else {
                    // Remove tag from selection
                    selectedTags.splice(tagIndex, 1);
                }

                // Reset to first page when filter changes
                currentPage = 1;
                updateManagementPanelContent();
            });
        });

        // Setup search functionality
        const searchInput = $(`#${SCRIPT_PREFIX}search_input`, managementSidePanel);
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                searchTerm = e.target.value.trim();
                currentPage = 1; // Reset to first page
                updateManagementPanelContent();
            }, 300));

            const clearSearchBtn = $(`#${SCRIPT_PREFIX}clear_search_btn`, managementSidePanel);
            if (clearSearchBtn) {
                clearSearchBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    searchTerm = '';
                    updateManagementPanelContent();
                });
            }
        }

        // Setup page size selector
        const pageSizeSelect = $(`#${SCRIPT_PREFIX}page_size_select`, managementSidePanel);
        if (pageSizeSelect) {
            pageSizeSelect.addEventListener('change', (e) => {
                e.stopPropagation();
                const newSize = parseInt(e.target.value);
                if (PAGE_SIZE_OPTIONS.includes(newSize)) {
                    pageSize = newSize;
                    GM_setValue(SCRIPT_PREFIX + 'page_size', newSize);
                    currentPage = 1; // Reset to first page when changing page size
                    updateManagementPanelContent();
                }
            });
        }
    }

    // Function to apply prompts (works for both single and multiple)
    function applyPrompts(promptIndices) {
        if (!promptIndices || promptIndices.length === 0) return;

        const savedPrompts = GM_getValue(SCRIPT_PREFIX + 'prompts', []);
        const combinedContent = promptIndices
            .sort((a, b) => a - b) // Apply in index order
            .map(index => {
                if (index >= 0 && index < savedPrompts.length) {
                    return savedPrompts[index].content;
                }
                return '';
            })
            .filter(content => content) // Remove any empty items
            .join('\n\n');

        if (combinedContent) {
            try {
                const textArea = $('#chat-input');
                if (!textArea) throw new Error('Chat input not found');
                textArea.focus();
                document.execCommand('selectAll', false, null);
                document.execCommand('delete', false, null);
                document.execCommand('insertText', false, combinedContent);

                // For multi-select, clear selection after applying
                if (promptIndices.length > 1) {
                    selectedPrompts = [];
                    updateManagementPanelContent();
                }

                // Show success notification
                showNotification(promptIndices.length > 1
                    ? `成功应用 ${promptIndices.length} 个提示词`
                    : '提示词应用成功', 'success');
            } catch (err) {
                console.error('DSPM: Failed to apply prompts:', err);
                showNotification(promptIndices.length > 1
                    ? '应用多个提示词失败'
                    : '应用提示词失败', 'error');
            }
        }
    }

    // Function to show temporary notification
    function showNotification(message, type = 'info') {
        const notificationId = SCRIPT_PREFIX + 'notification';
        const existingNotification = document.getElementById(notificationId);
        if (existingNotification) existingNotification.remove();

        const notification = document.createElement('div');
        notification.id = notificationId;
        notification.className = `fixed bottom-4 right-4 z-[100] px-4 py-3 rounded-md shadow-lg transform transition-all duration-300 opacity-0 translate-y-2 ${
            type === 'success' ? 'bg-green-50 border-l-4 border-green-500 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
            type === 'error' ? 'bg-red-50 border-l-4 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
            'bg-blue-50 border-l-4 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
        }`;

        const icon = type === 'success' ? 'fa-check-circle' :
                    type === 'error' ? 'fa-exclamation-circle' :
                    'fa-info-circle';

        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${icon} mr-3 text-xl"></i>
                <p class="text-sm font-medium">${escapeHTML(message)}</p>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('opacity-0', 'translate-y-2');
            notification.classList.add('opacity-100', 'translate-y-0');
        }, 10);

        // Automatically remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('opacity-0', 'translate-y-2');
            notification.classList.remove('opacity-100', 'translate-y-0');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function showEditPromptModal(prompt = null, index = null) {
        const isEditing = prompt !== null;
        const modalId = SCRIPT_PREFIX + 'edit_modal_overlay';
        if ($(`#${modalId}`)) $(`#${modalId}`).remove();

        const modalOverlay = document.createElement('div');
        modalOverlay.id = modalId;
        modalOverlay.className = `fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900 bg-opacity-60 dark:bg-opacity-75 dspm-fade-in`;
        modalOverlay.innerHTML = `<div class="bg-white dark:bg-gray-800 bg-opacity-100 dark:bg-opacity-100 rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4 transform transition-all duration-300 ease-out scale-95 opacity-0" role="dialog" aria-modal="true"> <div class="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700"><h3 class="text-xl font-semibold text-gray-900 dark:text-white">${isEditing ? '编辑指令' : '创建新指令'}</h3>${isEditing ? `<button id="${SCRIPT_PREFIX}delete_prompt_btn" class="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800/70 rounded-md transition-colors"><i class="fas fa-trash-alt mr-1"></i> 删除</button>` : ''}<button id="${SCRIPT_PREFIX}close_modal_btn" class="p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><i class="fas fa-times fa-lg"></i></button></div> <div class="space-y-4"><div><label for="${SCRIPT_PREFIX}prompt_title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">指令标题 <span class="text-red-500">*</span></label><input type="text" id="${SCRIPT_PREFIX}prompt_title" value="${isEditing ? escapeHTML(prompt.title) : ''}" placeholder="例如：周报小助手" class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"></div><div><label for="${SCRIPT_PREFIX}prompt_content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">指令内容 <span class="text-red-500">*</span></label><textarea id="${SCRIPT_PREFIX}prompt_content" rows="6" placeholder="请输入希望AI执行的具体指令内容..." class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dspm-custom-scrollbar">${isEditing ? escapeHTML(prompt.content) : ''}</textarea></div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">标签分类</label>
                    <div class="flex flex-wrap gap-2">
                        ${DEFAULT_TAGS.map(tag => {
                            const isSelected = isEditing && prompt.tags && prompt.tags.includes(tag);
                            return `<label class="inline-flex items-center">
                                <input type="checkbox" class="${SCRIPT_PREFIX}tag_checkbox" data-tag="${tag}" ${isSelected ? 'checked' : ''} class="form-checkbox h-4 w-4 text-indigo-600 dark:text-indigo-500">
                                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">${tag}</span>
                            </label>`;
                        }).join('')}
                    </div>
                </div>
                </div> <div class="pt-4 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700"><button id="${SCRIPT_PREFIX}cancel_modal_btn" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">取消</button><button id="${SCRIPT_PREFIX}save_prompt_btn" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-150 ease-in-out transform hover:scale-105">${isEditing ? '保存修改' : '创建指令'}</button></div></div>`;
        document.body.appendChild(modalOverlay);
        document.body.classList.add(SCRIPT_PREFIX + 'modal-open');

        setTimeout(() => { const modalContent = $('div[role="dialog"]', modalOverlay); if (modalContent) { modalContent.classList.remove('scale-95', 'opacity-0'); modalContent.classList.add('scale-100', 'opacity-100'); } }, 10);

        const closeModal = () => {
            const modalContent = $('div[role="dialog"]', modalOverlay);
            if (modalContent) {
                modalContent.classList.add('scale-95', 'opacity-0');
                modalContent.classList.remove('scale-100', 'opacity-100');
                setTimeout(() => {
                    if (modalOverlay) modalOverlay.remove(); // Check if modalOverlay still exists
                    document.body.classList.remove(SCRIPT_PREFIX + 'modal-open');
                 }, 300);
            } else {
                if (modalOverlay) modalOverlay.remove(); // Check if modalOverlay still exists
                document.body.classList.remove(SCRIPT_PREFIX + 'modal-open');
            }
        };

        $(`#${SCRIPT_PREFIX}close_modal_btn`, modalOverlay).onclick = closeModal;
        $(`#${SCRIPT_PREFIX}cancel_modal_btn`, modalOverlay).onclick = closeModal;

        if (!isEditing && $('#chat-input')?.value.trim()) $(`#${SCRIPT_PREFIX}prompt_content`, modalOverlay).value = $('#chat-input').value.trim();
        $(`#${SCRIPT_PREFIX}prompt_title`, modalOverlay).focus();

        if (isEditing) {
            $(`#${SCRIPT_PREFIX}delete_prompt_btn`, modalOverlay).onclick = () => {
                showConfirmationDialog('确认删除', `确定要删除指令 "<strong>${escapeHTML(prompt.title)}</strong>" 吗？此操作无法撤销。`, () => {
                    const prompts = GM_getValue(SCRIPT_PREFIX + 'prompts', []);
                    prompts.splice(index, 1); GM_setValue(SCRIPT_PREFIX + 'prompts', prompts);
                    closeModal(); updateManagementPanelContent(); updateUsageDropdown();
                });
            };
        }
        $(`#${SCRIPT_PREFIX}save_prompt_btn`, modalOverlay).onclick = () => {
            const title = $(`#${SCRIPT_PREFIX}prompt_title`, modalOverlay).value.trim();
            const content = $(`#${SCRIPT_PREFIX}prompt_content`, modalOverlay).value.trim();
            if (!title || !content) { alert(title ? '指令内容不能为空！' : '指令标题不能为空！'); (title ? $(`#${SCRIPT_PREFIX}prompt_content`, modalOverlay) : $(`#${SCRIPT_PREFIX}prompt_title`, modalOverlay)).focus(); return; }

            // Collect selected tags
            const selectedTagsCheckboxes = $$(`.${SCRIPT_PREFIX}tag_checkbox:checked`, modalOverlay);
            const tags = Array.from(selectedTagsCheckboxes).map(checkbox => checkbox.dataset.tag).filter(Boolean);

            const prompts = GM_getValue(SCRIPT_PREFIX + 'prompts', []);
            if (isEditing) {
                // Keep existing tags if not edited
                const existingTags = prompt.tags || [];
                prompts[index] = {
                    title,
                    content,
                    tags: tags.length > 0 ? tags : existingTags
                };
            } else {
                prompts.push({
                    title,
                    content,
                    tags
                });
            }

            GM_setValue(SCRIPT_PREFIX + 'prompts', prompts);
            showNotification(isEditing ? '提示词已更新' : '提示词已创建', 'success');
            closeModal();
            updateManagementPanelContent();
            updateUsageDropdown();
        };
    }

    function showConfirmationDialog(title, message, onConfirm, confirmButtonText = '确认删除') {
        const dialogId = SCRIPT_PREFIX + 'confirm_dialog_overlay';
        if ($(`#${dialogId}`)) $(`#${dialogId}`).remove();

        const dialogOverlay = document.createElement('div');
        dialogOverlay.id = dialogId;
        dialogOverlay.className = `fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-900 bg-opacity-70 dark:bg-opacity-80 dspm-fade-in`;
        dialogOverlay.innerHTML = `<div class="bg-white dark:bg-gray-800 bg-opacity-100 dark:bg-opacity-100 rounded-lg shadow-xl w-full max-w-md p-6 space-y-4 transform transition-all duration-300 ease-out scale-95 opacity-0"><h3 class="text-lg font-medium text-gray-900 dark:text-white">${title}</h3><p class="text-sm text-gray-600 dark:text-gray-300">${message}</p><div class="flex justify-end space-x-3 pt-3"><button id="${SCRIPT_PREFIX}confirm_cancel" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">取消</button><button id="${SCRIPT_PREFIX}confirm_ok" class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800">${confirmButtonText}</button></div></div>`;
        document.body.appendChild(dialogOverlay);
        document.body.classList.add(SCRIPT_PREFIX + 'modal-open');

        setTimeout(() => {
            const dialogContent = $('div > div', dialogOverlay);
            if(dialogContent) {
                dialogContent.classList.remove('scale-95', 'opacity-0');
                dialogContent.classList.add('scale-100', 'opacity-100');
            }
        }, 10);

        const closeDialog = () => {
            const dialogContent = $('div > div', dialogOverlay);
            if(dialogContent) {
                dialogContent.classList.add('scale-95', 'opacity-0');
                dialogContent.classList.remove('scale-100', 'opacity-100');
            }
            setTimeout(() => {
                if (dialogOverlay) dialogOverlay.remove(); // Check if dialogOverlay still exists
                if (!$(`#${SCRIPT_PREFIX}edit_modal_overlay`)) {
                    document.body.classList.remove(SCRIPT_PREFIX + 'modal-open');
                }
            }, 300);
        };
        $(`#${SCRIPT_PREFIX}confirm_cancel`, dialogOverlay).onclick = closeDialog;
        $(`#${SCRIPT_PREFIX}confirm_ok`, dialogOverlay).onclick = () => { onConfirm(); closeDialog(); };
    }

    function setupImportExportMenu(buttonElement) {
        if (!buttonElement) return;
        const newBtn = buttonElement.cloneNode(true);
        buttonElement.parentNode.replaceChild(newBtn, buttonElement);
        buttonElement = newBtn;

        buttonElement.addEventListener('click', (e) => {
            e.stopPropagation();
            const menuId = SCRIPT_PREFIX + 'import_export_menu';
            const existingMenu = $(`#${menuId}`);
            if (existingMenu) {
                existingMenu.remove();
                return;
            }

            const menu = document.createElement('div');
            menu.id = menuId;
            menu.className = `absolute z-[120] mt-1.5 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 dspm-fade-in`;
            menu.innerHTML = `<button data-action="export" class="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center"><i class="fas fa-file-export w-4 h-4 mr-2.5 text-gray-400 dark:text-gray-500"></i> 导出 JSON</button><button data-action="import" class="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center"><i class="fas fa-file-import w-4 h-4 mr-2.5 text-gray-400 dark:text-gray-500"></i> 导入 JSON</button>`;
            document.body.appendChild(menu);
            const btnRect = buttonElement.getBoundingClientRect();
            menu.style.top = `${btnRect.bottom + 4}px`;
            menu.style.left = `${btnRect.right - menu.offsetWidth}px`;

            const closeMenu = () => menu.remove();
            const clickOutsideHandler = (event) => {
                if (!menu.contains(event.target) && !buttonElement.contains(event.target)) {
                    closeMenu();
                    document.removeEventListener('click', clickOutsideHandler, true);
                }
            };
            document.addEventListener('click', clickOutsideHandler, true);

            $$('button', menu).forEach(btn => {
                btn.onclick = () => {
                    console.log(`DSPM: Import/Export action: ${btn.dataset.action}`);
                    if (btn.dataset.action === 'export') {
                        const prompts = GM_getValue(SCRIPT_PREFIX + 'prompts', []);
                        if (prompts.length === 0) { alert("没有可导出的提示词。"); closeMenu(); return; }
                        const blob = new Blob([JSON.stringify(prompts, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url; a.download = `deepseek-prompts-${new Date().toISOString().slice(0,10)}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        console.log('DSPM: Export initiated.');
                    } else if (btn.dataset.action === 'import') {
                        const input = document.createElement('input');
                        input.type = 'file'; input.accept = '.json';
                        input.onchange = (ev) => {
                            const file = ev.target.files[0];
                            if (file) {
                                console.log(`DSPM: File selected for import: ${file.name}`);
                                const reader = new FileReader();
                                reader.onload = (le) => {
                                    try {
                                        const imported = JSON.parse(le.target.result);
                                        if (Array.isArray(imported) && imported.every(p => typeof p.title === 'string' && typeof p.content === 'string')) {
                                            GM_setValue(SCRIPT_PREFIX + 'prompts', imported);
                                            updateManagementPanelContent(); updateUsageDropdown();
                                            alert('提示词导入成功！');
                                            console.log('DSPM: Prompts imported successfully.');
                                        } else { alert('导入失败：文件格式无效。'); console.error('DSPM: Invalid import file format.');}
                                    } catch (err) { console.error("DSPM: Import error:", err); alert('导入失败：无法解析文件。'); }
                                };
                                reader.readAsText(file);
                            }
                        };
                        input.click();
                        console.log('DSPM: Import file dialog opened.');
                    }
                    closeMenu();
                };
            });
        });
    }

    function showQuickTagPopover(triggerElement, prompt, promptIndex) {
        const popoverId = SCRIPT_PREFIX + 'tag_popover';
        const existingPopover = $(`#${popoverId}`);
        if (existingPopover) existingPopover.remove();

        const popover = document.createElement('div');
        popover.id = popoverId;
        popover.className = 'fixed z-[120] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-3 dspm-fade-in';

        // Get existing tags
        const currentTags = prompt.tags || [];

        // Create tag selection HTML
        let tagsHTML = `
            <div class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">快速添加标签</div>
            <div class="mb-2 flex flex-wrap gap-2">
        `;

        // Add tag checkboxes
        DEFAULT_TAGS.forEach(tag => {
            const isSelected = currentTags.includes(tag);
            tagsHTML += `
                <label class="inline-flex items-center p-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : ''}">
                    <input type="checkbox" class="tag-checkbox sr-only" data-tag="${tag}" ${isSelected ? 'checked' : ''}>
                    <span class="flex items-center">
                        <i class="fas ${isSelected ? 'fa-check-square text-indigo-500' : 'fa-square text-gray-400'} mr-1"></i>
                        ${tag}
                    </span>
                </label>
            `;
        });

        tagsHTML += `
            </div>
            <div class="flex justify-end space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <button id="${SCRIPT_PREFIX}save_tags_btn" class="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded focus:outline-none transition-colors">
                    保存
                </button>
            </div>
        `;

        popover.innerHTML = tagsHTML;

        // Position the popover
        document.body.appendChild(popover);
        const btnRect = triggerElement.getBoundingClientRect();
        popover.style.top = `${btnRect.bottom + 5}px`;
        popover.style.left = `${btnRect.left - popover.offsetWidth / 2 + btnRect.width / 2}px`;

        // Ensure popover is visible within viewport
        const popoverRect = popover.getBoundingClientRect();
        if (popoverRect.right > window.innerWidth - 10) {
            popover.style.left = `${window.innerWidth - popoverRect.width - 10}px`;
        }
        if (popoverRect.left < 10) {
            popover.style.left = '10px';
        }

        // Handle checkbox clicks
        $$('.tag-checkbox', popover).forEach(checkbox => {
            checkbox.parentElement.addEventListener('click', (e) => {
                e.stopPropagation();
                checkbox.checked = !checkbox.checked;

                // Toggle visual state
                const parentLabel = checkbox.closest('label');
                if (checkbox.checked) {
                    parentLabel.classList.add('bg-indigo-50', 'dark:bg-indigo-900/20', 'text-indigo-600', 'dark:text-indigo-400');
                    parentLabel.querySelector('i').classList.replace('fa-square', 'fa-check-square');
                    parentLabel.querySelector('i').classList.add('text-indigo-500');
                    parentLabel.querySelector('i').classList.remove('text-gray-400');
                } else {
                    parentLabel.classList.remove('bg-indigo-50', 'dark:bg-indigo-900/20', 'text-indigo-600', 'dark:text-indigo-400');
                    parentLabel.querySelector('i').classList.replace('fa-check-square', 'fa-square');
                    parentLabel.querySelector('i').classList.remove('text-indigo-500');
                    parentLabel.querySelector('i').classList.add('text-gray-400');
                }
            });
        });

        // Save button click
        $(`#${SCRIPT_PREFIX}save_tags_btn`, popover).addEventListener('click', (e) => {
            e.stopPropagation();

            // Collect selected tags
            const selectedTags = Array.from($$('.tag-checkbox:checked', popover))
                .map(checkbox => checkbox.dataset.tag)
                .filter(Boolean);

            // Save to the prompt
            const prompts = GM_getValue(SCRIPT_PREFIX + 'prompts', []);
            if (prompts[promptIndex]) {
                prompts[promptIndex].tags = selectedTags;
                GM_setValue(SCRIPT_PREFIX + 'prompts', prompts);

                // Update UI and show notification
                updateManagementPanelContent();
                showNotification('标签已更新', 'success');
                popover.remove();
            }
        });

        // Close on outside click
        const clickOutsideHandler = (event) => {
            if (!popover.contains(event.target) && !triggerElement.contains(event.target)) {
                popover.remove();
                document.removeEventListener('click', clickOutsideHandler, true);
            }
        };
        document.addEventListener('click', clickOutsideHandler, true);
    }

    async function initScript() {
        try {
            console.log('DSPM: Initializing script...');
            await injectCDN('https://cdn.tailwindcss.com/3.4.3', 'script');
            console.log('DSPM: TailwindCSS CDN loaded.');
            await injectCDN('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css', 'link');
            console.log('DSPM: Font Awesome CDN loaded.');
            createElements();
            console.log('DSPM: Script initialized successfully.');
        } catch (error) {
            console.error('DSPM: Failed to initialize script or load resources.', error);
            alert('提示词管理脚本加载资源失败，部分功能可能无法正常使用。请检查网络连接或浏览器控制台。');
        }
    }

    const observer = new MutationObserver(debounce(() => {
        if (!$(`#${SCRIPT_PREFIX}usage_button`) && $('.ec4f5d61')) {
            console.log("DSPM: Detected button container via MutationObserver, attempting to create elements.");
            createElements();
        }
    }, 500));
    observer.observe(document.body, { childList: true, subtree: true });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }
    window.addEventListener('resize', debounce(() => {
        if (usagePromptDropdown && !usagePromptDropdown.classList.contains('hidden')) {
            updateUsageDropdownPosition();
        }
        const importExportMenu = $(`#${SCRIPT_PREFIX}import_export_menu`);
        if (importExportMenu) {
            const importExportBtn = $(`#${SCRIPT_PREFIX}import_export_btn`, managementSidePanel);
            if (importExportBtn) {
                const btnRect = importExportBtn.getBoundingClientRect();
                importExportMenu.style.top = `${btnRect.bottom + 4}px`;
                importExportMenu.style.left = `${btnRect.right - importExportMenu.offsetWidth}px`;
            }
        }
    }, 150));

})();
