// ==UserScript==
// @name         LOL Skin Search (Enhanced Edition)
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  为LOL皮肤列表提供多平台搜索功能预览 - 重构版本 (支持多种皮肤项结构)
// @author       Your Name
// @match        https://lol.qq.com/act/a20250429sale/*
// @match        https://lol.qq.com/act/*
// @match        *://lol.qq.com/act/* 
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535342/LOL%20Skin%20Search%20%28Enhanced%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535342/LOL%20Skin%20Search%20%28Enhanced%20Edition%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = true;

    /**
     * 日志系统
     */
    const Logger = {
        debug: function(message, ...args) {
            if (DEBUG) {
                console.log(`[LOL Skin Search] ${message}`, ...args);
            }
        },
        info: function(message, ...args) {
            console.info(`[LOL Skin Search] ${message}`, ...args);
        },
        error: function(message, ...args) {
            console.error(`[LOL Skin Search] ${message}`, ...args);
        }
    };

    Logger.info('脚本开始执行 (Enhanced Edition v1.1.0)');

    /**
     * 搜索平台配置 - 可扩展平台列表
     */
    const searchPlatforms = [
        {
            id: 'douyin',
            name: '抖音',
            icon: `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M16.6 5.82s.51.5 0 0A4.51 4.51 0 0 1 15.98 4c-.32-.48-.52-.86-.52-.86-.23-.48-.39-.97-.46-1.47h.72L16.43 3h1.75l.48-1.33h.66c-.56 1.38-2.24 2.33-2.24 2.33v2.97c.46.49 1.1.8 1.81.8 1.38 0 2.5-1.12 2.5-2.5 0-1.2-.85-2.2-1.97-2.45v-.84c2.49.37 4.3 2.51 4.3 5.04 0 2.9-2.37 5.25-5.29 5.25a5.25 5.25 0 0 1-5.23-4.84H16v8.77h-4.98V8.09a5.27 5.27 0 0 1-5.79 1.98v.85a5.25 5.25 0 0 1-2.96 6.98l-.5-.85a4.5 4.5 0 0 0 2.66-4.12c0-2.45-1.97-4.44-4.4-4.5v-.87c2.92.09 5.32 2.33 5.47 5.2h2.75A5.24 5.24 0 0 1 16.6 5.82Z"/></svg>`,
            url: 'https://www.douyin.com/discover/search/',
            param: '$s',
            color: '#FE2C55'
        },
        {
            id: 'bilibili',
            name: '哔哩哔哩',
            icon: `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M18.223 3.086a1.25 1.25 0 0 1 0 1.768L17.08 5.996h1.17A3.75 3.75 0 0 1 22 9.746v7.5a3.75 3.75 0 0 1-3.75 3.75h-12.5A3.75 3.75 0 0 1 2 17.246v-7.5a3.75 3.75 0 0 1 3.75-3.75h1.166L5.775 4.855a1.25 1.25 0 1 1 1.767-1.768l2.652 2.652c.079.079.145.165.198.256h3.213c.053-.09.119-.177.198-.256l2.652-2.652a1.25 1.25 0 0 1 1.768 0zM10.25 8.246h-4.5a1.75 1.75 0 0 0-1.75 1.75v7.5c0 .966.784 1.75 1.75 1.75h12.5a1.75 1.75 0 0 0 1.75-1.75v-7.5a1.75 1.75 0 0 0-1.75-1.75h-4.5a.75.75 0 0 0-.75.75v.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-.5a.75.75 0 0 0-.75-.75zM7 12.246a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-4.5zm7 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-4.5z"/></svg>`,
            url: 'https://search.bilibili.com/all?keyword=',
            param: '$s&order=pubdate',
            color: '#00A1D6'
        } ,
        {
            id: 'youtube',
            name: 'YouTube',
            icon: `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44
            4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2
            12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73"/></svg>`,
            url: 'https://www.youtube.com/results?search_query=', // Note: This seems to be a specific non-standard URL. Kept as is.
            param: 'League of Legends skin $s',
            color: '#FF0000'
        }
    ];

    /**
     * 用户设置
     */
    const Settings = {
        getEnabledPlatforms: function() {
            const savedPlatforms = GM_getValue('enabledPlatforms');
            if (!savedPlatforms) {
                return searchPlatforms.map(p => p.id);
            }
            return savedPlatforms;
        },
        saveEnabledPlatforms: function(platforms) {
            GM_setValue('enabledPlatforms', platforms);
        },
        getLastUsedPlatform: function() {
            return GM_getValue('lastUsedPlatform', searchPlatforms[0].id);
        },
        saveLastUsedPlatform: function(platformId) {
            GM_setValue('lastUsedPlatform', platformId);
        }
    };

    /**
     * UI生成器
     */
    const UI = {
        createSearchIcon: function() {
            const icon = document.createElement('div');
            icon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
            `;
            icon.className = 'lol-search-icon';
            icon.title = '搜索此皮肤';
            return icon;
        },
        createPlatformSelector: function(skinName) { // skinName is not directly used here now but kept for API consistency
            const selector = document.createElement('div');
            selector.className = 'search-platform-selector';
            const enabledPlatforms = Settings.getEnabledPlatforms();
            const lastUsedPlatform = Settings.getLastUsedPlatform();

            searchPlatforms.forEach(platform => {
                if (enabledPlatforms.includes(platform.id)) {
                    const button = document.createElement('button');
                    button.className = 'platform-button';
                    button.dataset.platformId = platform.id;
                    button.innerHTML = `
                        <span class="platform-icon" style="color: ${platform.color}">${platform.icon}</span>
                        <span class="platform-name">${platform.name}</span>
                    `;
                    if (platform.id === lastUsedPlatform) {
                        button.classList.add('last-used');
                    }
                    selector.appendChild(button);
                }
            });

            const settingsButton = document.createElement('button');
            settingsButton.className = 'settings-button';
            settingsButton.innerHTML = `
                <span class="platform-icon">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
                    </svg>
                </span>
                <span class="platform-name">设置</span>
            `;
            selector.appendChild(settingsButton);
            return selector;
        },
        createSettingsPanel: function() {
            const panel = document.createElement('div');
            panel.className = 'search-settings-panel';
            panel.style.display = 'none';
            const header = document.createElement('div');
            header.className = 'settings-header';
            header.innerHTML = '<h3>搜索平台设置</h3>';
            panel.appendChild(header);
            const content = document.createElement('div');
            content.className = 'settings-content';
            const enabledPlatforms = Settings.getEnabledPlatforms();
            searchPlatforms.forEach(platform => {
                const checkboxContainer = document.createElement('div');
                checkboxContainer.className = 'checkbox-container';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `platform-${platform.id}`;
                checkbox.checked = enabledPlatforms.includes(platform.id);
                checkbox.dataset.platformId = platform.id;
                const label = document.createElement('label');
                label.htmlFor = `platform-${platform.id}`;
                label.innerHTML = `
                    <span class="platform-icon" style="color: ${platform.color}">${platform.icon}</span>
                    ${platform.name}
                `;
                checkboxContainer.appendChild(checkbox);
                checkboxContainer.appendChild(label);
                content.appendChild(checkboxContainer);
            });
            panel.appendChild(content);
            const footer = document.createElement('div');
            footer.className = 'settings-footer';
            const saveButton = document.createElement('button');
            saveButton.className = 'save-settings-button';
            saveButton.textContent = '保存设置';
            saveButton.addEventListener('click', function() {
                const enabled = Array.from(
                    panel.querySelectorAll('input[type="checkbox"]:checked')
                ).map(checkbox => checkbox.dataset.platformId);
                if (enabled.length === 0) {
                    alert('请至少启用一个搜索平台');
                    return;
                }
                Settings.saveEnabledPlatforms(enabled);
                panel.style.display = 'none';
                refreshPlatformSelectors();
                Logger.info('已保存平台设置:', enabled);
            });
            const cancelButton = document.createElement('button');
            cancelButton.className = 'cancel-settings-button';
            cancelButton.textContent = '取消';
            cancelButton.addEventListener('click', function() {
                panel.style.display = 'none';
            });
            footer.appendChild(saveButton);
            footer.appendChild(cancelButton);
            panel.appendChild(footer);
            return panel;
        }
    };

    /**
     * 搜索处理器
     */
    const SearchHandler = {
        configureSearchIcon: function(searchIcon, skinName, imgBox) {
            let selector = null;
            let isOpen = false;
            searchIcon.addEventListener('click', function(event) {
                event.stopPropagation();
                if (!selector) {
                    selector = UI.createPlatformSelector(skinName); // skinName passed for consistency, not used by current createPlatformSelector
                    imgBox.appendChild(selector); // Appending selector to imgBox
                    selector.querySelectorAll('.platform-button').forEach(button => {
                        button.addEventListener('click', function(e) {
                            e.stopPropagation();
                            const platformId = button.dataset.platformId;
                            const platform = searchPlatforms.find(p => p.id === platformId);
                            if (platform) {
                                const searchQuery = skinName.replace(/\s+/g, ' ').trim();
                                const searchUrl = platform.url +
                                    encodeURIComponent(platform.param.replace('$s', searchQuery));
                                Settings.saveLastUsedPlatform(platformId);
                                window.open(searchUrl, '_blank');
                                Logger.debug('执行搜索:', platform.name, searchQuery, searchUrl);
                                selector.style.display = 'none';
                                isOpen = false;
                            }
                        });
                    });
                    const settingsButton = selector.querySelector('.settings-button');
                    settingsButton.addEventListener('click', function(e) {
                        e.stopPropagation();
                        let settingsPanel = document.querySelector('.search-settings-panel');
                        if (!settingsPanel) {
                            settingsPanel = UI.createSettingsPanel();
                            document.body.appendChild(settingsPanel);
                        }
                        const rect = settingsButton.getBoundingClientRect();
                        const viewportWidth = window.innerWidth;
                        const viewportHeight = window.innerHeight;
                        const panelWidth = settingsPanel.offsetWidth || 300; // Use actual or assumed width
                        const panelHeight = settingsPanel.offsetHeight || 400; // Use actual or assumed height

                        let left = rect.right + 10;
                        if (left + panelWidth > viewportWidth && rect.left - panelWidth - 10 >=0) { // Check if space on left
                            left = rect.left - panelWidth - 10;
                        } else if (left + panelWidth > viewportWidth) { // Default to left if right overflows and left also would
                             left = Math.max(0, viewportWidth - panelWidth - 5);
                        }


                        let top = rect.top;
                        if (top + panelHeight > viewportHeight) {
                            top = Math.max(0, viewportHeight - panelHeight - 10);
                        }

                        settingsPanel.style.left = `${Math.max(0,left)}px`; // Ensure not off-screen left
                        settingsPanel.style.top = `${Math.max(0,top)}px`;   // Ensure not off-screen top
                        settingsPanel.style.display = 'block';
                        selector.style.display = 'none';
                        isOpen = false;
                    });
                }
                isOpen = !isOpen;
                selector.style.display = isOpen ? 'block' : 'none';
                Logger.debug('切换搜索选择器显示状态:', isOpen);
            });
            // Using a more robust way to close by checking if click is outside searchIcon and its generated selector
            document.addEventListener('click', function(e) {
                if (isOpen && selector && !searchIcon.contains(e.target) && !selector.contains(e.target)) {
                    selector.style.display = 'none';
                    isOpen = false;
                }
            });
        }
    };

    /**
     * 皮肤处理器 - MODIFIED SECTION
     */
    const SkinProcessor = {
        // Define configurations for different skin item structures
        skinItemConfigs: [
            { // Original structure (based on original script logic for 'li' items)
                itemSelector: 'li', // Selector for the main skin item container
                imgBoxSelector: '.img-box', // Selector for the image container within the item
                // Function to extract skin name from the item
                getSkinName: function(itemElement) {
                    const pElement = itemElement.querySelector('p');
                    // Ensure this 'p' is not confused with other 'p' elements like '.icon'
                    if (pElement && !pElement.classList.contains('icon') && pElement.textContent) {
                        return pElement.textContent.trim();
                    }
                    return null;
                }
            },
            { // New structure from user's HTML snippet for 'div.skin-box' items
                itemSelector: 'div.skin-box',
                imgBoxSelector: '.img-box', // This is consistent
                getSkinName: function(itemElement) {
                    // Skin name is in the alt attribute of an image inside .img-box
                    const imgElement = itemElement.querySelector('.img-box img.pop-skin-img[alt]');
                    return imgElement ? imgElement.getAttribute('alt').trim() : null;
                }
            }
            // Add more configurations here for future HTML structures:
            // {
            //     itemSelector: 'selector-for-another-skin-container',
            //     imgBoxSelector: 'selector-for-its-image-box',
            //     getSkinName: function(itemElement) { /* logic to get name */ return 'skin name'; }
            // }
        ],

        processSkinItems: function() {
            Logger.debug('开始处理皮肤项 (Configurable Strategy)');
            let processedCountThisRun = 0;

            this.skinItemConfigs.forEach(config => {
                const skinItems = document.querySelectorAll(config.itemSelector);

                skinItems.forEach(item => {
                    // Check if the specific imgBox for this item already has a search icon.
                    // This is the most reliable check to prevent reprocessing.
                    const imgBox = item.querySelector(config.imgBoxSelector);

                    if (imgBox && imgBox.querySelector('.lol-search-icon')) {
                        return; // Already processed
                    }

                    // If imgBox exists, try to get skin name
                    if (imgBox) {
                        const skinName = config.getSkinName(item);

                        if (skinName) {
                            Logger.debug('处理皮肤:', skinName, '- 来自项目:', item, '- 使用配置:', config.itemSelector);

                            const currentPosition = getComputedStyle(imgBox).position;
                            if (currentPosition !== 'relative' && currentPosition !== 'absolute') {
                                imgBox.style.position = 'relative';
                                Logger.debug('设置 imgBox position 为 relative:', imgBox);
                            }

                            const searchIcon = UI.createSearchIcon();
                            imgBox.appendChild(searchIcon);
                            SearchHandler.configureSearchIcon(searchIcon, skinName, imgBox);

                            processedCountThisRun++;
                        } else {
                            // Logger.debug('无法从此项目获取皮肤名称:', item, '使用配置:', config.itemSelector);
                        }
                    } else {
                        // Logger.debug('未找到 imgBox for item:', item, '使用配置:', config.itemSelector, 'imgBoxSelector:', config.imgBoxSelector);
                    }
                });
            });

            if (processedCountThisRun > 0) {
                Logger.info(`本次动态/初始化处理完成, 新增处理了 ${processedCountThisRun} 个皮肤项`);
            }
            return processedCountThisRun;
        }
    };
    // END OF MODIFIED SECTION


    /**
     * 刷新所有平台选择器以反映新设置
     */
    function refreshPlatformSelectors() {
        document.querySelectorAll('.search-platform-selector').forEach(selector => {
            selector.remove();
        });
        Logger.debug('已刷新平台选择器 (下次点击图标时将重建)');
    }

    // 添加样式 (GM_addStyle) - NO CHANGES HERE, kept as is from original
    GM_addStyle(`
        /* 搜索图标样式 */
        .lol-search-icon {
            position: absolute;
            top: 5px;
            right: 5px;
            cursor: pointer;
            z-index: 10; /* Ensure it's above the image */
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            padding: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s, background-color 0.2s;
            display: flex; /* For better centering of SVG if needed */
            align-items: center;
            justify-content: center;
        }

       .lol-search-icon:hover {
            transform: scale(1.1);
            background-color: rgba(255, 255, 255, 0.95);
        }

        /* 平台选择器样式 */
        .search-platform-selector {
            position: absolute;
            top: 35px; /* Adjusted based on icon size + padding */
            right: 5px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            padding: 8px;
            z-index: 100; /* Above search icon and other elements */
            min-width: 150px;
            display: none; /* Initially hidden */
        }

        /* 平台按钮样式 */
        .platform-button, .settings-button {
            display: flex;
            align-items: center;
            padding: 8px 12px;
            width: 100%;
            border: none;
            background-color: transparent;
            cursor: pointer;
            border-radius: 4px;
            margin-bottom: 2px; /* Small gap between buttons */
            transition: background-color 0.2s;
            text-align: left; /* Ensure text aligns left */
            box-sizing: border-box; /* Better width calculation */
        }

        .platform-button:hover, .settings-button:hover {
            background-color: #f0f0f0;
        }

        .platform-button.last-used {
            background-color: #e8f0fe; /* A slightly different highlight for last used */
            font-weight: bold;
        }

        .platform-icon {
            margin-right: 8px;
            display: flex;
            align-items: center;
        }

        .platform-name {
            font-size: 14px;
            color: #333;
        }

        /* 设置面板样式 */
        .search-settings-panel {
            position: fixed; /* Fixed position relative to viewport */
            width: 300px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            z-index: 1000; /* Highest z-index */
            overflow: hidden;
            display: none; /* Initially hidden */
        }

        .settings-header {
            padding: 15px;
            border-bottom: 1px solid #eee;
        }

        .settings-header h3 {
            margin: 0;
            font-size: 16px;
            color: #333;
        }

        .settings-content {
            padding: 15px;
            max-height: 300px; /* Limit height and allow scrolling */
            overflow-y: auto;
        }

        .checkbox-container {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
        }

        .checkbox-container input[type="checkbox"] {
            margin-right: 10px; /* More space */
            width: 16px; /* Custom size */
            height: 16px;
            cursor: pointer;
        }

        .checkbox-container label {
            display: flex;
            align-items: center;
            cursor: pointer;
            font-size: 14px;
            color: #333;
        }
         .checkbox-container label .platform-icon { /* Ensure icon in label also has margin */
            margin-right: 8px;
        }


        .settings-footer {
            padding: 15px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: flex-end; /* Align buttons to the right */
            background-color: #f9f9f9; /* Slight background for footer */
        }

        .settings-footer button {
            padding: 8px 15px; /* More padding for footer buttons */
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            margin-left: 10px;
            transition: background-color 0.2s, box-shadow 0.2s;
        }

        .save-settings-button {
            background-color: #1a73e8; /* Google blue */
            color: white;
        }

        .save-settings-button:hover {
            background-color: #0d66d0; /* Darker blue */
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .cancel-settings-button {
            background-color: #f1f1f1;
            color: #333;
            border: 1px solid #ddd; /* Subtle border */
        }

        .cancel-settings-button:hover {
            background-color: #e4e4e4;
            border-color: #ccc;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .platform-name {
                font-size: 12px; /* Smaller font on small screens */
            }
            .search-settings-panel {
                width: 250px; /* Narrower panel on small screens */
                max-width: 90vw;
            }
            .settings-content {
                max-height: 250px;
            }
        }
    `);

    /**
     * 初始化函数
     */
    function initialize() {
        Logger.info('初始化脚本');

        const initialProcessedCount = SkinProcessor.processSkinItems();
        // Logger.info(`初始化完成，初次处理了 ${initialProcessedCount} 个皮肤项`); // Covered by processSkinItems log

        const observer = new MutationObserver(mutations => {
            // Check if any added nodes could be skin items or contain them
            const relevantMutation = mutations.some(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if the added node itself matches any itemSelector or might contain them
                            if (SkinProcessor.skinItemConfigs.some(config => node.matches && node.matches(config.itemSelector) || node.querySelector(config.itemSelector))) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            });

            if (relevantMutation) {
                Logger.debug('检测到DOM变化，可能包含新的皮肤项，重新处理...');
                const newProcessedCount = SkinProcessor.processSkinItems();
                // if (newProcessedCount > 0) { // Log is now inside processSkinItems
                //     Logger.debug(`动态加载处理了 ${newProcessedCount} 个新皮肤项`);
                // }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Global click listener for closing settings panel
        document.addEventListener('click', function(e) {
            const settingsPanel = document.querySelector('.search-settings-panel');
            if (settingsPanel && settingsPanel.style.display !== 'none') {
                const isClickInsidePanel = settingsPanel.contains(e.target);
                // Check if click was on any settings button that might open the panel
                const isClickOnAOpenerButton = e.target.closest('.settings-button');

                if (!isClickInsidePanel && !isClickOnAOpenerButton) {
                    Logger.debug('Clicked outside settings panel and not on an opener, closing panel.');
                    settingsPanel.style.display = 'none';
                } else if (!isClickInsidePanel && isClickOnAOpenerButton) {
                     // If it was a settings button, SearchHandler.configureSearchIcon already handled it.
                     // This case means the click was on a settings button that *didn't* belong to an active selector,
                     // which is unlikely to happen if the panel is already open.
                }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // 提供一个全局接口以便调试
    window.LOLSkinSearch = {
        refreshPlatformSelectors,
        searchPlatforms,
        Settings,
        processSkins: () => SkinProcessor.processSkinItems(), // Ensure 'this' context if needed, or direct call
        getSkinConfigs: () => SkinProcessor.skinItemConfigs // For debugging configs
    };

})();