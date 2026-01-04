// ==UserScript==
// @name         YouTube 多重播放器 YouTube Multi-Player
// @name:zh-TW   YouTube 多重播放器
// @name:en      YouTube Multi-Player
// @namespace    http://tampermonkey.net/
// @version      7.5.5
// @match        https://www.youtube.com/
// @match        https://www.youtube.com/feed/*
// @match        https://www.youtube.com/playlist?list=*
// @match        https://www.youtube.com/@*
// @match        https://www.youtube.com/gaming
// @match        https://www.youtube.com/results?search_query=*
// @match        https://www.youtube.com/channel/*
// @exclude      https://studio.youtube.com/*
// @exclude      https://accounts.youtube.com/*
// @exclude      https://www.youtube.com/watch
// @grant        GM_info
// @license      MIT
// @description  以新分頁或新視窗同時播放多個影片，並可將任意影片放大置頂。
// @description:zh-TW  以新分頁或新視窗同時播放多個影片，並可將任意影片放大置頂。
// @description:en  Play multiple videos simultaneously in new tabs or windows, and pin any video to the top.
// @downloadURL https://update.greasyfork.org/scripts/541978/YouTube%20%E5%A4%9A%E9%87%8D%E6%92%AD%E6%94%BE%E5%99%A8%20YouTube%20Multi-Player.user.js
// @updateURL https://update.greasyfork.org/scripts/541978/YouTube%20%E5%A4%9A%E9%87%8D%E6%92%AD%E6%94%BE%E5%99%A8%20YouTube%20Multi-Player.meta.js
// ==/UserScript==
(function(){
    'use strict';
    // --- 腳本參數 / Script Parameters ---
    const MAX_PINNED = 2;
    const LIST_COUNT = 3;
    const ADD_BUTTON_ENABLED_STORAGE_KEY = 'ytMulti_addButtonEnabled';
    // --- 語言檢測 / Language Detection ---
    const isChinese = navigator.language.startsWith('zh') || (typeof GM_info !== 'undefined' && GM_info.script.locale === 'zh-TW');
    // --- 文字資源 / Text Resources ---
    const TEXTS = {
        play: isChinese ? '▶ 播放' : '▶ Play',
        modeCurrentTab: isChinese ? '這分頁' : 'Current Tab',
        modeNewTab: isChinese ? '新分頁' : 'New Tab',
        modeNewWindow: isChinese ? '新視窗' : 'New Window',
        list: isChinese ? '清單' : 'List',
        noVideos: isChinese ? '當前清單無影片' : 'No videos in current list',
        addButtonOn: isChinese ? '添加:開' : 'Add: On',
        addButtonOff: isChinese ? '添加:關' : 'Add: Off'
    };
    // --- 網址驗證 / URL Validation ---
    const validateURL = () => {
        const patterns = [
            /^https:\/\/www\.youtube\.com\/$/,
            /^https:\/\/www\.youtube\.com\/feed\/.*/,
            /^https:\/\/www\.youtube\.com\/playlist\?list=.*/,
            /^https:\/\/www\.youtube\.com\/@.*/,
            /^https:\/\/www\.youtube\.com\/gaming$/,
            /^https:\/\/www\.youtube\.com\/results\?search_query=.*/,
            /^https:\/\/www\.youtube\.com\/channel\/.*/
        ];
        return patterns.some(p => p.test(window.location.href));
    };
    let checkInterval = setInterval(() => {
        if(!validateURL()){
            const panel = document.getElementById('ytMulti_panel');
            if(panel) {
                panel.remove();
                stopObservingVideos();
            }
            clearInterval(checkInterval);
        }
    }, 30000);
    // --- 儲存鍵名 / Storage Keys ---
    const STORAGE_POS = 'ytMulti_btnPos';
    const STORAGE_MODE = 'ytMulti_openMode';
    const STORAGE_CURRENT = 'ytMulti_currentList';
    const STORAGE_PINNED_PREFIX = 'ytMulti_pinned_';
    const STORAGE_VIDEO_MODE_PREFIX = 'ytMulti_vidMode_';
    // --- 動態生成清單儲存鍵 / Dynamically Generate List Storage Keys ---
    const generateStorageKeys = () => {
        const keys = {};
        for (let i = 1; i <= LIST_COUNT; i++) {
            keys[`list${i}`] = `ytMulti_videoList${i}`;
        }
        return keys;
    };
    const STORAGE_LISTS = generateStorageKeys();
    let currentList = localStorage.getItem(STORAGE_CURRENT) || 'list1';
    if (!STORAGE_LISTS[currentList]) {
        currentList = Object.keys(STORAGE_LISTS)[0];
        localStorage.setItem(STORAGE_CURRENT, currentList);
    }
    // --- 創建控制面板 / Create Control Panel ---
    const panel = document.createElement('div');
    panel.id = 'ytMulti_panel';
    panel.style.cssText = `
        position: fixed;
        background: rgba(0,0,0,0.8);
        color: #fff;
        padding: 6px 8px;
        border-radius: 8px;
        z-index: 9999;
        display: flex;
        align-items: center;
        cursor: move;
        gap: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        font-family: Arial, sans-serif;
        backdrop-filter: blur(4px);
    `;
    document.body.appendChild(panel);
    // --- 還原面板位置 / Restore Panel Position ---
    const savedPos = JSON.parse(localStorage.getItem(STORAGE_POS) || 'null');
    if(savedPos){
        panel.style.top = savedPos.top;
        panel.style.left = savedPos.left;
        panel.style.right = 'auto';
    }
    // --- 使面板可拖曳 / Make Panel Draggable ---
    panel.addEventListener('mousedown', e => {
        e.preventDefault();
        let startX = e.clientX, startY = e.clientY;
        const rect = panel.getBoundingClientRect();
        let hasMoved = false;
        function onMove(ev){
            panel.style.top = rect.top + ev.clientY - startY + 'px';
            panel.style.left = rect.left + ev.clientX - startX + 'px';
            hasMoved = true;
        }
        function onUp(){
            if (hasMoved) {
                localStorage.setItem(STORAGE_POS, JSON.stringify({top: panel.style.top, left: panel.style.left}));
            }
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        }
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    });
    // --- 創建樣式化按鈕 / Create Styled Button ---
    function createStyledButton(text){
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            padding: 6px 12px;
            height: 36px;
            border: none;
            border-radius: 6px;
            background: #ff0000;
            color: white;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 13px;
            font-weight: 500;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        btn.addEventListener('mouseover', () => btn.style.background = '#cc0000');
        btn.addEventListener('mouseout', () => btn.style.background = '#ff0000');
        return btn;
    }
    // --- 初始化按鈕 / Initialize Buttons ---
    const playBtn = createStyledButton(TEXTS.play);
    const modeBtn = createStyledButton(getModeButtonText());
    const listBtn = createStyledButton(`${TEXTS.list}1`);
    const addButtonToggle = createStyledButton(TEXTS.addButtonOff);
    let isAddButtonEnabled = localStorage.getItem(ADD_BUTTON_ENABLED_STORAGE_KEY) === 'true';
    updateAddButtonToggleText();
    panel.append(playBtn, modeBtn, listBtn, addButtonToggle);
    // --- 模式切換 / Mode Toggle ---
    modeBtn.addEventListener('click', () => {
        const currentMode = localStorage.getItem(STORAGE_MODE) || 'current_tab';
        let nextMode;
        switch(currentMode) {
            case 'current_tab':
                nextMode = 'new_tab';
                break;
            case 'new_tab':
                nextMode = 'new_window';
                break;
            case 'new_window':
            default:
                nextMode = 'current_tab';
                break;
        }
        localStorage.setItem(STORAGE_MODE, nextMode);
        modeBtn.textContent = getModeButtonText();
    });
    // --- 取得模式按鈕文字 / Get Mode Button Text ---
    function getModeButtonText() {
        const mode = localStorage.getItem(STORAGE_MODE) || 'current_tab';
        switch(mode) {
            case 'current_tab': return TEXTS.modeCurrentTab;
            case 'new_tab': return TEXTS.modeNewTab;
            case 'new_window': return TEXTS.modeNewWindow;
            default: return TEXTS.modeCurrentTab;
        }
    }
    // --- 清單切換 / List Toggle ---
    listBtn.addEventListener('click', () => {
        const listNames = Object.keys(STORAGE_LISTS);
        const currentIndex = listNames.indexOf(currentList);
        const nextIndex = (currentIndex + 1) % listNames.length;
        currentList = listNames[nextIndex];
        localStorage.setItem(STORAGE_CURRENT, currentList);
        updateListButtonCount();
    });
    // --- 更新清單按鈕計數 / Update List Button Count ---
    const updateListButtonCount = () => {
        const storageKey = STORAGE_LISTS[currentList];
        const count = JSON.parse(localStorage.getItem(storageKey) || '[]').length;
        const listNum = currentList.replace('list', '');
        listBtn.textContent = `${TEXTS.list}${listNum} (${count})`;
    };
    // --- ＋按鈕開關 / Add Button Toggle ---
    addButtonToggle.addEventListener('click', () => {
        isAddButtonEnabled = !isAddButtonEnabled;
        localStorage.setItem(ADD_BUTTON_ENABLED_STORAGE_KEY, String(isAddButtonEnabled));
        updateAddButtonToggleText();
        if (isAddButtonEnabled) {
            startObservingVideos();
        } else {
            stopObservingVideos();
        }
    });
    function updateAddButtonToggleText() {
        addButtonToggle.textContent = isAddButtonEnabled ? TEXTS.addButtonOn : TEXTS.addButtonOff;
        addButtonToggle.style.background = isAddButtonEnabled ? '#00aa00' : '#ff0000';
    }
    // --- 播放功能 / Play Function ---
    playBtn.addEventListener('click', () => {
        const storageKey = STORAGE_LISTS[currentList];
        const ids = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if(!ids.length) return alert(TEXTS.noVideos);
        const pinnedStorageKey = STORAGE_PINNED_PREFIX + currentList;
        const pinnedIds = JSON.parse(localStorage.getItem(pinnedStorageKey) || '[]');
        const html = makeBlobPage(ids, currentList, pinnedIds);
        const blobUrl = URL.createObjectURL(new Blob([html], {type: 'text/html'}));
        const mode = localStorage.getItem(STORAGE_MODE) || 'current_tab';
        switch(mode) {
            case 'current_tab':
                location.href = blobUrl;
                break;
            case 'new_tab':
                window.open(blobUrl, '_blank');
                break;
            case 'new_window':
                window.open(blobUrl, '_blank', 'width=800,height=600,scrollbars=no,resizable=yes');
                break;
        }
    });
    // --- 解析 YouTube ID / Parse YouTube ID ---
    function parseYouTubeID(url){
        const m = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
        return m ? m[1] : null;
    }
    // --- 添加影片到當前清單 / Add Video to Current List ---
    function addToCurrentList(vid) {
        const storageKey = STORAGE_LISTS[currentList];
        let ids = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if(vid && !ids.includes(vid)){
            ids.push(vid);
            localStorage.setItem(storageKey, JSON.stringify(ids));
            updateListButtonCount();
        }
    }
    // --- 監聽頁面影片 / Observe Videos on Page ---
    let observer;
    let isObserving = false;
    // --- 修正：移除無效的 history 選擇器，統一使用通用選擇器 ---
    function getVideoContainerSelector() {
        const url = window.location.href;
        if (url.includes('/playlist?list=')) {
            // For playlist pages, target the specific renderer within the thumbnail
            return 'ytd-playlist-video-renderer ytd-thumbnail';
        } else {
            // Default selectors for all other pages, including /feed/history
            return [
                'ytd-thumbnail', 'ytd-playlist-thumbnail',
                'ytd-grid-video-renderer', 'ytd-video-renderer',
                'ytd-compact-video-renderer', 'ytd-rich-item-renderer',
                'ytd-rich-grid-media', 'ytd-playlist-video-renderer'
            ].join(', ');
        }
    }
    function startObservingVideos() {
        if (isObserving || !isAddButtonEnabled) return;
        isObserving = true;
        const style = document.createElement('style');
        style.textContent = `
            .ytMulti-add-btn {
                position: absolute;
                top: 8px;
                left: 8px;
                width: 42px;
                height: 42px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-size: 31px;
                display: none;
                z-index: 10000;
                box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                align-items: center;
                justify-content: center;
            }
            .ytMulti-video-hover .ytMulti-add-btn {
                display: flex;
            }
        `;
        document.head.appendChild(style);
        observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            processNode(node);
                        }
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        processNode(document.body);
    }
    function processNode(node) {
        const selector = getVideoContainerSelector();
        let elementsToProcess = [];
        if (node.matches && node.matches(selector)) {
            elementsToProcess.push(node);
        }
        elementsToProcess.push(...node.querySelectorAll(selector));
        // Filter out invalid nodes that don't contain a video link
        elementsToProcess = elementsToProcess.filter(el => {
            return el.querySelector('a[href*="/watch"]') !== null;
        });
        elementsToProcess.forEach(el => addButtonsToContainer(el));
    }
    function stopObservingVideos() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        isObserving = false;
        document.querySelectorAll('.ytMulti-add-btn').forEach(btn => btn.remove());
        const style = document.querySelector('style');
        if (style && style.textContent.includes('.ytMulti-add-btn')) {
            style.remove();
        }
    }
    function addButtonsToContainer(containerEl) {
        if (containerEl.querySelector('.ytMulti-add-btn')) return;
        const button = document.createElement('button');
        button.className = 'ytMulti-add-btn';
        button.textContent = '+';
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            let vid = null;
            const linkElement = containerEl.querySelector('a[href*="/watch"]');
            if (linkElement) {
                vid = parseYouTubeID(linkElement.href);
            }
            if (!vid) {
                const endpointElement = containerEl.querySelector('[data-endpoint]');
                if (endpointElement) {
                    try {
                        const endpoint = JSON.parse(endpointElement.getAttribute('data-endpoint'));
                        if (endpoint && endpoint.videoId) {
                            vid = endpoint.videoId;
                        }
                    } catch (e) { /* Ignore */ }
                }
            }
            if (vid) {
                addToCurrentList(vid);
            }
        });
        containerEl.style.position = 'relative';
        containerEl.appendChild(button);
        containerEl.addEventListener('mouseenter', () => containerEl.classList.add('ytMulti-video-hover'));
        containerEl.addEventListener('mouseleave', () => containerEl.classList.remove('ytMulti-video-hover'));
    }
    // --- 生成播放頁面 HTML / Generate Play Page HTML ---
    function makeBlobPage(ids, listKey, initialPinnedIds = []){
        const idWithOrder = ids.map((id, index) => ({ id, order: index }));
        const listWithOrderJson = JSON.stringify(idWithOrder);
        const storageListsJson = JSON.stringify(STORAGE_LISTS);
        const pinnedJson = JSON.stringify(initialPinnedIds);
        const pinnedStorageKey = JSON.stringify(STORAGE_PINNED_PREFIX + listKey);
        const videoModeStoragePrefix = JSON.stringify(STORAGE_VIDEO_MODE_PREFIX + listKey + '_');
        return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Multi-Player</title><style>
            body{margin:0;padding:0;background:#000;overflow:hidden;}
            .container{position:absolute;top:0;left:0;width:100vw;height:100vh;display:flex;flex-wrap:wrap;align-content:flex-start;}
            .video-wrapper{position:absolute;overflow:hidden;transition:all 0.3s ease;}
            .video-wrapper iframe{width:100%;height:100%;border:none;}
            .remove-btn, .pin-btn, .mode-toggle-btn, .top-btn, .up-btn, .down-btn, .bottom-btn {
                position:absolute;
                width:20px;height:20px;
                border-radius:3px;
                display:none;
                cursor:pointer;
                z-index:9999;
                box-shadow:0 0 3px rgba(0,0,0,0.3);
            }
            .remove-btn{top:6px;right:6px;background:#ff4444;}
            .pin-btn{top:30px;right:6px;background:#44aaff;}
            .mode-toggle-btn{top:54px;right:6px;background:#888888;}
            .top-btn{top:78px;right:6px;background:#ffaa44;}
            .up-btn{top:102px;right:6px;background:#88cc44;}
            .down-btn{top:126px;right:6px;background:#44cc88;}
            .bottom-btn{top:150px;right:6px;background:#aa44ff;}
            .remove-btn::after{content:'×';color:white;font-size:16px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;line-height:20px;}
            .pin-btn::after{content:'📌';color:white;font-size:14px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;line-height:20px;}
            .mode-toggle-btn::after{content:'🔄';color:white;font-size:14px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;line-height:20px;}
            .top-btn::after{content:'⤒';color:white;font-size:14px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;line-height:20px;}
            .up-btn::after{content:'↑';color:white;font-size:16px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;line-height:20px;}
            .down-btn::after{content:'↓';color:white;font-size:16px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;line-height:20px;}
            .bottom-btn::after{content:'⤓';color:white;font-size:14px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;line-height:20px;}
            .video-wrapper:hover .remove-btn, .video-wrapper:hover .pin-btn, .video-wrapper:hover .mode-toggle-btn, .video-wrapper:hover .top-btn, .video-wrapper:hover .up-btn, .video-wrapper:hover .down-btn, .video-wrapper:hover .bottom-btn{display:block;}
        </style></head><body><div class="container"></div><script>
            const MAX_PINNED = ${MAX_PINNED};
            const ASPECT_RATIO_EMBEDDED = 16/9;
            const ASPECT_RATIO_FULL = 32/9;
            let idOrderMap = new Map(${listWithOrderJson}.map(item => [item.id, item.order]));
            const listKey = ${JSON.stringify(listKey)};
            const STORAGE_LISTS = ${storageListsJson};
            const INITIAL_PINNED_IDS = ${pinnedJson};
            const PINNED_STORAGE_KEY = ${pinnedStorageKey};
            const VIDEO_MODE_STORAGE_PREFIX = ${videoModeStoragePrefix};
            const container = document.querySelector('.container');
            let pinnedIds = INITIAL_PINNED_IDS.slice();
            function getVideoMode(id) {
                const key = VIDEO_MODE_STORAGE_PREFIX + id;
                return localStorage.getItem(key) || 'embedded';
            }
            function setVideoMode(id, mode) {
                const key = VIDEO_MODE_STORAGE_PREFIX + id;
                localStorage.setItem(key, mode);
            }
            function isLandscape() {
                return container.offsetWidth > container.offsetHeight * 1.4;
            }
            function calculateLayout(){
                const W = container.offsetWidth;
                const H = container.offsetHeight;
                const allEntries = Array.from(idOrderMap.entries()).sort((a, b) => a[1] - b[1]);
                const pinnedEntries = allEntries.filter(([id]) => pinnedIds.includes(id));
                const visibleEntries = allEntries.filter(([id]) => !pinnedIds.includes(id));
                const cells = [];
                let y = 0;
                // Layout ALL pinned videos
                pinnedEntries.forEach(([id], i) => {
                    const ar = getVideoMode(id) === 'full' ? ASPECT_RATIO_FULL : ASPECT_RATIO_EMBEDDED;
                    if (isLandscape() && i < 2) {
                        const w = W / 2;
                        const h = w / ar;
                        cells.push({ id, x: i === 0 ? 0 : W/2, y: 0, w, h, isPinned: true });
                        y = Math.max(y, h);
                    } else {
                        const h = W / ar;
                        cells.push({ id, x: 0, y, w: W, h, isPinned: true });
                        y += h;
                    }
                });
                // Layout non-pinned FULL (32:9) videos
                const fullItems = visibleEntries.filter(([id]) => getVideoMode(id) === 'full');
                const embeddedItems = visibleEntries.filter(([id]) => getVideoMode(id) === 'embedded');
                if (isLandscape() && fullItems.length > 0) {
                    const maxCols = 2;
                    const unitWidth = W / maxCols;
                    const h = unitWidth / ASPECT_RATIO_FULL;
                    for (let i = 0; i < fullItems.length; i++) {
                        const row = Math.floor(i / maxCols);
                        const col = i % maxCols;
                        cells.push({
                            id: fullItems[i][0],
                            x: col * unitWidth,
                            y: y + row * h,
                            w: unitWidth,
                            h: h
                        });
                    }
                    y += Math.ceil(fullItems.length / maxCols) * h;
                } else if (!isLandscape() && fullItems.length > 0) {
                    fullItems.forEach(([id]) => {
                        const h = W / ASPECT_RATIO_FULL;
                        cells.push({ id, x: 0, y, w: W, h });
                        y += h;
                    });
                }
                // Layout non-pinned EMBEDDED (16:9) videos
                if (embeddedItems.length > 0) {
                    const availableH = H - y;
                    if (availableH > 0) {
                        const itemCount = embeddedItems.length;
                        let chosenCols = 1;
                        if (isLandscape()) {
                            if (itemCount === 1) {
                                chosenCols = 1;
                            } else if (itemCount <= 4) {
                                chosenCols = 2;
                            } else if (itemCount <= 9) {
                                chosenCols = 3;
                            } else {
                                chosenCols = 4;
                            }
                            chosenCols = Math.min(chosenCols, Math.floor(W / 200));
                        } else {
                            const h_1Col = (W / ASPECT_RATIO_EMBEDDED) * itemCount;
                            if (h_1Col <= availableH * 1.2) {
                                chosenCols = 1;
                            } else {
                                const rows_2Col = Math.ceil(itemCount / 2);
                                const h_2Col = (W / 2 / ASPECT_RATIO_EMBEDDED) * rows_2Col;
                                if (h_2Col <= availableH) {
                                    chosenCols = 2;
                                } else {
                                    chosenCols = 2; // Fallback to 2 columns
                                }
                            }
                        }
                        const unitWidth = W / chosenCols;
                        const h = unitWidth / ASPECT_RATIO_EMBEDDED;
                        for (let i = 0; i < itemCount; i++) {
                            const row = Math.floor(i / chosenCols);
                            const col = i % chosenCols;
                            cells.push({
                                id: embeddedItems[i][0],
                                x: col * unitWidth,
                                y: y + row * h,
                                w: unitWidth,
                                h: h
                            });
                        }
                    }
                }
                return { cells };
            }
            function updateLayout(){
                const { cells } = calculateLayout();
                cells.forEach(cell => {
                    const wrap = document.querySelector('[data-id="'+cell.id+'"]');
                    if (wrap) {
                        wrap.style.left = cell.x + 'px';
                        wrap.style.top = cell.y + 'px';
                        wrap.style.width = cell.w + 'px';
                        wrap.style.height = cell.h + 'px';
                        wrap.style.zIndex = cell.isPinned ? '100' : '1';
                    }
                });
            }
            function swapOrder(id1, id2) {
                const order1 = idOrderMap.get(id1);
                const order2 = idOrderMap.get(id2);
                if (order1 !== undefined && order2 !== undefined) {
                    idOrderMap.set(id1, order2);
                    idOrderMap.set(id2, order1);
                    saveIdsToStorage();
                    updateLayout();
                }
            }
            function moveVideoToTop(movedId) {
                const currentOrder = idOrderMap.get(movedId);
                if (currentOrder === undefined || currentOrder === 0) return;
                const minOrder = Math.min(...Array.from(idOrderMap.values()));
                for (let [id, order] of idOrderMap) {
                    if (order >= minOrder && order < currentOrder) {
                        idOrderMap.set(id, order + 1);
                    }
                }
                idOrderMap.set(movedId, minOrder - 1);
                saveIdsToStorage();
                updateLayout();
            }
            function moveVideoToBottom(movedId) {
                const currentOrder = idOrderMap.get(movedId);
                if (currentOrder === undefined) return;
                const maxOrder = Math.max(...Array.from(idOrderMap.values()));
                if (currentOrder === maxOrder) return;
                for (let [id, order] of idOrderMap) {
                    if (order > currentOrder && order <= maxOrder) {
                        idOrderMap.set(id, order - 1);
                    }
                }
                idOrderMap.set(movedId, maxOrder + 1);
                saveIdsToStorage();
                updateLayout();
            }
            function moveVideoDown(movedId) {
                const currentOrder = idOrderMap.get(movedId);
                if (currentOrder === undefined) return;
                let nextHigherId = null;
                let nextHigherOrder = Infinity;
                for (let [id, order] of idOrderMap) {
                    if (order > currentOrder && order < nextHigherOrder && !pinnedIds.includes(id)) {
                        nextHigherOrder = order;
                        nextHigherId = id;
                    }
                }
                if (nextHigherId) {
                    swapOrder(movedId, nextHigherId);
                }
            }
            function createVideo(id){
                if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return null;
                const wrap = document.createElement('div');
                wrap.className = 'video-wrapper';
                wrap.dataset.id = id;
                const mode = getVideoMode(id);
                let srcUrl;
                if (mode === 'full') {
                    srcUrl = 'https://www.youtube.com/v/' + id + '?autoplay=1&playsinline=1&rel=0&origin=' + encodeURIComponent(window.location.origin);
                } else {
                    srcUrl = 'https://www.yout-ube.com/embed/' + id + '?autoplay=1&playsinline=1&rel=0&controls=1&fs=1&origin=' + encodeURIComponent(window.location.origin);
                }
                const ifr = document.createElement('iframe');
                ifr.src = srcUrl;
                ifr.allow = 'autoplay; encrypted-media; fullscreen';
                const delBtn = document.createElement('div');
                delBtn.className = 'remove-btn';
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    localStorage.removeItem(VIDEO_MODE_STORAGE_PREFIX + id);
                    idOrderMap.delete(id);
                    saveIdsToStorage();
                    const pinnedIndex = pinnedIds.indexOf(id);
                    if (pinnedIndex !== -1) {
                        pinnedIds.splice(pinnedIndex, 1);
                        savePinnedState();
                    }
                    wrap.remove();
                    updateLayout();
                };
                const pinBtn = document.createElement('div');
                pinBtn.className = 'pin-btn';
                pinBtn.onclick = (e) => {
                    e.stopPropagation();
                    const index = pinnedIds.indexOf(id);
                    if(index !== -1){
                        pinnedIds.splice(index, 1);
                    } else{
                        if(pinnedIds.length >= MAX_PINNED) pinnedIds.shift();
                        pinnedIds.push(id);
                    }
                    savePinnedState();
                    updateLayout();
                };
                const modeToggleBtn = document.createElement('div');
                modeToggleBtn.className = 'mode-toggle-btn';
                modeToggleBtn.onclick = (e) => {
                    e.stopPropagation();
                    const currentMode = getVideoMode(id);
                    const newMode = currentMode === 'embedded' ? 'full' : 'embedded';
                    setVideoMode(id, newMode);
                    if (newMode === 'full') {
                        ifr.src = 'https://www.youtube.com/v/' + id + '?autoplay=1&playsinline=1&rel=0&origin=' + encodeURIComponent(window.location.origin);
                    } else {
                        ifr.src = 'https://www.yout-ube.com/embed/' + id + '?autoplay=1&playsinline=1&rel=0&controls=1&fs=1&origin=' + encodeURIComponent(window.location.origin);
                    }
                    updateLayout();
                };
                const topBtn = document.createElement('div');
                topBtn.className = 'top-btn';
                topBtn.onclick = (e) => {
                    e.stopPropagation();
                    moveVideoToTop(id);
                };
                const upBtn = document.createElement('div');
                upBtn.className = 'up-btn';
                upBtn.onclick = (e) => {
                    e.stopPropagation();
                    const currentOrder = idOrderMap.get(id);
                    if (currentOrder === undefined) return;
                    let nextLowerId = null;
                    let nextLowerOrder = -Infinity;
                    for (let [otherId, order] of idOrderMap) {
                        if (order < currentOrder && order > nextLowerOrder && !pinnedIds.includes(otherId)) {
                            nextLowerOrder = order;
                            nextLowerId = otherId;
                        }
                    }
                    if (nextLowerId) {
                        swapOrder(id, nextLowerId);
                    }
                };
                const downBtn = document.createElement('div');
                downBtn.className = 'down-btn';
                downBtn.onclick = (e) => {
                    e.stopPropagation();
                    moveVideoDown(id);
                };
                const bottomBtn = document.createElement('div');
                bottomBtn.className = 'bottom-btn';
                bottomBtn.onclick = (e) => {
                    e.stopPropagation();
                    moveVideoToBottom(id);
                };
                wrap.append(ifr, delBtn, pinBtn, modeToggleBtn, topBtn, upBtn, downBtn, bottomBtn);
                return wrap;
            }
            const sortedInitialEntries = Array.from(idOrderMap.entries()).sort((a, b) => a[1] - b[1]);
            sortedInitialEntries.forEach(([id, order]) => {
                const videoElement = createVideo(id);
                if (videoElement) {
                    container.appendChild(videoElement);
                }
            });
            updateLayout();
            window.addEventListener('resize', updateLayout);
            function saveIdsToStorage() {
                const storageKey = STORAGE_LISTS[listKey];
                const sortedIds = Array.from(idOrderMap.entries()).sort((a, b) => a[1] - b[1]).map(entry => entry[0]);
                localStorage.setItem(storageKey, JSON.stringify(sortedIds));
            }
            function savePinnedState() {
                localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(pinnedIds));
            }
        <\/script></body></html>`;
    }
    if (isAddButtonEnabled) {
        startObservingVideos();
    }
    updateListButtonCount();
})();