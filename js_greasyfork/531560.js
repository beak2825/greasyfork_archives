// ==UserScript==
// @name         小说阅读器3
// @namespace    http://tampermonkey.net/
// @version      2.0.7
// @description  弹窗式电子书阅读器，支持TXT上传、阅读设置，默认弹窗收起，支持重启后记忆窗体位置和阅读进度，支持快捷键操作，翻页时显示完整行并严格按照设置行数
// @author       Grok (Optimized by Assistant)
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/531560/%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E5%99%A83.user.js
// @updateURL https://update.greasyfork.org/scripts/531560/%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E5%99%A83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 常量定义
    const LINES_PER_LOAD = 300;
    const DEFAULT_SETTINGS = {
        fontSize: 16,
        fontColor: '#000000',
        lineHeight: 1.5,
        bgOpacity: 1,
        top: '100px',
        left: '100px',
        width: '800px',
        height: '300px',
        linesPerPage: 10 // 默认翻页行数，防止用户未设置时无值
    };

    // 默认快捷键设置
    const DEFAULT_HOTKEYS = {
        prevPageKey: 'F7',
        nextPageKey: 'F8',
        prevChapterKey: 'F5',
        nextChapterKey: 'F6',
        upKey: '8',
        downKey: '2',
        floatBtnKey: 'F2',
        opacityHotkey: 'F9',
        togglePopupKey: '1'
    };

    // 全局状态
    let fullText = '';
    let currentLineIndex = 0;
    let lastScrollTop = 0;
    let floatBtnVisible = true;
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let linesPerPage = GM_getValue('linesPerPage', DEFAULT_SETTINGS.linesPerPage);
    let keepEdgeLinesEnabled = GM_getValue('keepEdgeLines', false);
    let currentChapterIndex = GM_getValue('currentChapterIndex', 0); // 目录记忆功能：当前章节索引

    // DOM 元素引用
    let floatBtn, popup, tocPopup, readerContent, txtUpload, settingsPopup, hotkeyPopup, toc;
    let elements = {};

    // 初始化
    function init() {
        createFloatButton();
        createPopup();
        createTocPopup();
        bindEvents();
        loadSavedState();
        registerMenuCommands();
    }

    // 创建悬浮按钮
    function createFloatButton() {
        floatBtn = document.createElement('div');
        floatBtn.innerHTML = '📖';
        floatBtn.style.cssText = `
            position: fixed; bottom: 20px; left: 20px; width: 20px; height: 20px;
            background: #007bff; color: white; border-radius: 50%; display: flex;
            align-items: center; justify-content: center; cursor: pointer; z-index: 9999;
            font-size: 10px; opacity: 0; transition: opacity 0.3s ease;
        `;
        document.body.appendChild(floatBtn);

        let showTimeout, hideTimeout;
        floatBtn.onmouseenter = () => {
            clearTimeout(hideTimeout);
            showTimeout = setTimeout(() => floatBtn.style.opacity = '1', 3000);
        };
        floatBtn.onmouseleave = () => {
            clearTimeout(showTimeout);
            hideTimeout = setTimeout(() => floatBtn.style.opacity = '0', 3000);
        };
    }

    // 创建主弹窗
    function createPopup() {
        popup = document.createElement('div');
        popup.style.cssText = `
            display: none; position: fixed; top: 100px; left: 100px; width: 800px; height: 300px;
            background: rgba(255, 255, 255, 1); border: 1px solid #ccc; border-radius: 5px;
            z-index: 10000; resize: both; overflow: hidden;
        `;
        popup.innerHTML = `
            <div id="popupHeader" style="padding: 5px; background: #f0f0f0; cursor: move; display: flex; justify-content: space-between; align-items: center;">
                <input type="file" id="txtUpload" accept=".txt" style="margin-left: 10px;">
                <div style="display: flex; align-items: center;">
                    <button id="settingsBtn" style="margin-right: 5px;">设置</button>
                    <button id="hotkeyBtn" style="margin-right: 5px;">快捷键</button>
                    <button id="tocBtn" style="margin-right: 5px;">目录</button>
                    <button id="closeBtn" style="margin-right: 5px;">关闭</button>
                </div>
            </div>
            <div id="settingsPopup" style="padding: 10px; display: none;">
                <label>字体大小: <input type="number" id="fontSize" value="16" min="12" max="30" style="width: 50px;"></label>
                <label>字体颜色: <input type="color" id="fontColor" value="#000000"></label>
                <label>行距: <input type="number" id="lineHeight" value="1.5" min="1" max="3" step="0.1" style="width: 50px;"></label>
                <label>背景透明度: <input type="range" id="bgOpacity" min="0" max="1" step="0.1" value="1" style="width: 100px;"></label>
            </div>
            <div id="hotkeyPopup" style="padding: 10px; display: none; overflow-x: auto; white-space: nowrap;">
                ${generateHotkeySettings()}
            </div>
            <div id="toc" style="padding: 10px; max-height: 100px; overflow-y: auto; border-bottom: 1px solid #ccc; display: none;"></div>
            <div id="readerContent" style="padding: 10px; white-space: pre-wrap; height: calc(100% - 40px); overflow-y: auto;"></div>
        `;
        document.body.appendChild(popup);
        cacheElements();
    }

    // 创建目录弹窗
    function createTocPopup() {
        tocPopup = document.createElement('div');
        tocPopup.style.cssText = `
            display: none; position: fixed; top: 150px; left: 150px; width: 400px; height: 400px;
            background: white; border: 1px solid #ccc; border-radius: 5px; z-index: 10001;
            overflow-y: auto; padding: 10px;
        `;
        document.body.appendChild(tocPopup);
    }

    // 缓存DOM元素
    function cacheElements() {
        elements = {
            txtUpload: document.getElementById('txtUpload'),
            closeBtn: document.getElementById('closeBtn'),
            readerContent: document.getElementById('readerContent'),
            fontSize: document.getElementById('fontSize'),
            fontColor: document.getElementById('fontColor'),
            lineHeight: document.getElementById('lineHeight'),
            bgOpacity: document.getElementById('bgOpacity'),
            popupHeader: document.getElementById('popupHeader'),
            toc: document.getElementById('toc'),
            tocBtn: document.getElementById('tocBtn'),
            settingsBtn: document.getElementById('settingsBtn'),
            settingsPopup: document.getElementById('settingsPopup'),
            hotkeyBtn: document.getElementById('hotkeyBtn'),
            hotkeyPopup: document.getElementById('hotkeyPopup'),
            prevChapterKey: document.getElementById('prevChapterKey'),
            nextChapterKey: document.getElementById('nextChapterKey'),
            upKey: document.getElementById('upKey'),
            downKey: document.getElementById('downKey'),
            prevPageKey: document.getElementById('prevPageKey'),
            nextPageKey: document.getElementById('nextPageKey'),
            floatBtnKey: document.getElementById('floatBtnKey'),
            opacityHotkey: document.getElementById('opacityHotkey'),
            linesPerPageInput: document.getElementById('linesPerPageInput'),
            togglePopupKey: document.getElementById('togglePopupKey'),
            keepEdgeLines: document.getElementById('keepEdgeLines')
        };
        readerContent = elements.readerContent;
        txtUpload = elements.txtUpload;
        settingsPopup = elements.settingsPopup;
        hotkeyPopup = elements.hotkeyPopup;
        toc = elements.toc;
    }

    // 生成快捷键设置HTML
    function generateHotkeySettings() {
        const hotkeys = [
            { id: 'prevPageKey', label: '上一页', default: GM_getValue('prevPageKey', DEFAULT_HOTKEYS.prevPageKey), group: '翻页设置' },
            { id: 'nextPageKey', label: '下一页', default: GM_getValue('nextPageKey', DEFAULT_HOTKEYS.nextPageKey), group: '翻页设置' },
            { id: 'linesPerPageInput', label: '翻页行数', type: 'number', default: GM_getValue('linesPerPage', DEFAULT_SETTINGS.linesPerPage), group: '翻页设置' },
            { id: 'keepEdgeLines', label: '保留边界行', type: 'checkbox', default: GM_getValue('keepEdgeLines', false), group: '翻页设置' },
            { id: 'prevChapterKey', label: '上一章', default: GM_getValue('prevChapterKey', DEFAULT_HOTKEYS.prevChapterKey), group: '章节设置' },
            { id: 'nextChapterKey', label: '下一章', default: GM_getValue('nextChapterKey', DEFAULT_HOTKEYS.nextChapterKey), group: '章节设置' },
            { id: 'upKey', label: '上键', default: GM_getValue('upKey', DEFAULT_HOTKEYS.upKey), group: '滚动设置' },
            { id: 'downKey', label: '下键', default: GM_getValue('downKey', DEFAULT_HOTKEYS.downKey), group: '滚动设置' },
            { id: 'floatBtnKey', label: '悬浮按钮', default: GM_getValue('floatBtnKey', DEFAULT_HOTKEYS.floatBtnKey), group: '界面设置' },
            { id: 'opacityHotkey', label: '透明切换', default: GM_getValue('opacityHotkey', DEFAULT_HOTKEYS.opacityHotkey), group: '界面设置' },
            { id: 'togglePopupKey', label: '隐藏/显示弹窗', default: GM_getValue('togglePopupKey', DEFAULT_HOTKEYS.togglePopupKey), note: '(需Alt)', group: '界面设置' }
        ];

        const groups = {};
        hotkeys.forEach(hotkey => {
            groups[hotkey.group] = groups[hotkey.group] || [];
            groups[hotkey.group].push(hotkey);
        });

        return Object.entries(groups).map(([group, items]) => `
            <div style="display: inline-block; vertical-align: top; margin-right: 20px;">
                <div style="font-weight: bold; margin-bottom: 5px;">${group}</div>
                ${items.map(item => `
                    <label style="display: block; margin: 5px 0;">
                        ${item.label}:
                        ${item.type === 'number' ? `<input type="number" id="${item.id}" value="${item.default}" min="1" max="50" style="width: 60px;">` :
                          item.type === 'checkbox' ? `<input type="checkbox" id="${item.id}" ${item.default ? 'checked' : ''}>` :
                          `<select id="${item.id}">${generateKeyOptions(item.default)}</select>`}
                        ${item.note || ''}
                    </label>
                `).join('')}
            </div>
        `).join('');
    }

    // 生成快捷键选项
    function generateKeyOptions(defaultKey) {
        const keys = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        return keys.map(key => `<option value="${key}" ${key === defaultKey ? 'selected' : ''}>${key}</option>`).join('');
    }

    // 绑定事件
    function bindEvents() {
        floatBtn.onclick = togglePopup;
        elements.closeBtn.onclick = () => { popup.style.display = 'none'; saveProgress(); };
        elements.settingsBtn.onclick = () => togglePanel(elements.settingsPopup);
        elements.hotkeyBtn.onclick = () => togglePanel(elements.hotkeyPopup);
        elements.tocBtn.onclick = () => toggleTocPopup();
        elements.txtUpload.onchange = handleFileUpload;
        bindHotkeyEvents();
        bindStyleEvents();
        bindDragEvents();
        bindScrollEvents();
        popup.addEventListener('dblclick', (e) => {
            if (e.target !== elements.txtUpload) {
                popup.style.display = 'none';
                saveProgress();
            }
        });
    }

    // 切换面板显示
    function togglePanel(panel) {
        const isVisible = panel.style.display === 'block';
        elements.settingsPopup.style.display = 'none';
        elements.hotkeyPopup.style.display = 'none';
        toc.style.display = 'none';
        panel.style.display = isVisible ? 'none' : 'block';
        updateStyles();
    }

    // 切换目录弹窗
    function toggleTocPopup() {
        tocPopup.style.display = tocPopup.style.display === 'none' ? 'block' : 'none';
        if (tocPopup.style.display === 'block') generateTOC();
    }

    // 绑定快捷键事件
    function bindHotkeyEvents() {
        window.addEventListener('keydown', (e) => {
            if (!floatBtnVisible && e.key === elements.floatBtnKey.value) return;
            handleHotkeyAction(e);
        });

        const hotkeyElements = ['prevChapterKey', 'nextChapterKey', 'upKey', 'downKey', 'prevPageKey', 'nextPageKey', 'floatBtnKey', 'opacityHotkey', 'togglePopupKey'];
        hotkeyElements.forEach(key => {
            elements[key].onchange = () => {
                GM_setValue(key, elements[key].value);
                saveProgress(); // 保存快捷键设置时也更新进度记录
            };
        });

        elements.linesPerPageInput.onchange = () => {
            linesPerPage = Math.min(Math.max(parseInt(elements.linesPerPageInput.value) || DEFAULT_SETTINGS.linesPerPage, 1), 50);
            GM_setValue('linesPerPage', linesPerPage);
            elements.linesPerPageInput.value = linesPerPage;
            saveProgress();
            if (fullText) loadPageSegment();
        };

        elements.keepEdgeLines.onchange = () => {
            keepEdgeLinesEnabled = elements.keepEdgeLines.checked;
            GM_setValue('keepEdgeLines', keepEdgeLinesEnabled);
            saveProgress();
            if (fullText) loadPageSegment();
        };
    }

    // 处理快捷键动作
    function handleHotkeyAction(e) {
        const keyActions = {
            [elements.floatBtnKey.value]: () => floatBtn.style.display = floatBtn.style.display === 'none' ? 'flex' : 'none',
            [elements.prevChapterKey.value]: () => {
                if (currentLineIndex > 0) {
                    currentLineIndex = Math.max(currentLineIndex - LINES_PER_LOAD, 0);
                    loadTextSegment();
                    readerContent.scrollTop = readerContent.scrollHeight;
                }
            },
            [elements.nextChapterKey.value]: () => {
                if (fullText) {
                    const lines = fullText.split('\n');
                    if (currentLineIndex + LINES_PER_LOAD < lines.length) {
                        currentLineIndex += LINES_PER_LOAD;
                        loadTextSegment();
                        readerContent.scrollTop = 0;
                    }
                }
            },
            [elements.upKey.value]: () => readerContent.scrollTop -= 50,
            [elements.downKey.value]: () => readerContent.scrollTop += 50,
            [elements.prevPageKey.value]: () => {
                if (currentLineIndex > 0) {
                    currentLineIndex = Math.max(currentLineIndex - linesPerPage, 0);
                    loadPageSegment();
                }
            },
            [elements.nextPageKey.value]: () => {
                if (fullText) {
                    const lines = fullText.split('\n');
                    if (currentLineIndex + linesPerPage < lines.length) {
                        currentLineIndex += linesPerPage;
                        loadPageSegment();
                    }
                }
            },
            [elements.opacityHotkey.value]: () => {
                elements.bgOpacity.value = elements.bgOpacity.value === '0' ? '1' : '0';
                updateStyles();
                saveProgress();
            }
        };

        if (e.altKey && e.key === elements.togglePopupKey.value) {
            e.preventDefault();
            togglePopup();
        } else if (keyActions[e.key]) {
            e.preventDefault();
            keyActions[e.key]();
        }
    }

    // 绑定样式变化事件
    function bindStyleEvents() {
        elements.fontSize.onchange = () => { updateStyles(); saveProgress(); };
        elements.fontColor.onchange = () => { updateStyles(); saveProgress(); };
        elements.lineHeight.onchange = () => { updateStyles(); saveProgress(); };
        elements.bgOpacity.onchange = () => { updateStyles(); saveProgress(); };
    }

    // 绑定拖拽事件
    function bindDragEvents() {
        elements.popupHeader.onmousedown = startDrag;
        readerContent.onmousedown = startDrag;
        document.onmousemove = (e) => {
            if (isDragging) {
                e.preventDefault();
                popup.style.left = `${e.clientX - dragOffsetX}px`;
                popup.style.top = `${e.clientY - dragOffsetY}px`;
            }
        };
        document.onmouseup = () => {
            isDragging = false;
            saveProgress();
        };
    }

    function startDrag(e) {
        if (e.button === 0) {
            isDragging = true;
            dragOffsetX = e.clientX - parseInt(popup.style.left);
            dragOffsetY = e.clientY - parseInt(popup.style.top);
        }
    }

    // 绑定滚动事件
    function bindScrollEvents() {
        readerContent.addEventListener('scroll', () => {
            const scrollBottom = readerContent.scrollHeight - readerContent.scrollTop - readerContent.clientHeight;
            const scrollTop = readerContent.scrollTop;
            if (scrollBottom < 50 && fullText) {
                const lines = fullText.split('\n');
                if (currentLineIndex + linesPerPage < lines.length) {
                    currentLineIndex += linesPerPage;
                    loadTextSegment();
                    readerContent.scrollTop = 0;
                }
            } else if (scrollTop < 50 && currentLineIndex > 0) {
                currentLineIndex = Math.max(currentLineIndex - linesPerPage, 0);
                loadTextSegment();
                readerContent.scrollTop = readerContent.scrollHeight - readerContent.clientHeight;
            }
            lastScrollTop = readerContent.scrollTop;
            saveProgress();
        });
    }

    // 加载保存的状态
    function loadSavedState() {
        const lastRecord = GM_getValue('lastReadingRecord', null);
        if (lastRecord) {
            try {
                applySavedRecord(JSON.parse(lastRecord));
            } catch (err) {
                console.error('Failed to load last reading record:', err);
            }
        }
        updateStyles();
    }

    // 应用保存的记录
    function applySavedRecord(record) {
        fullText = record.text || '';
        currentLineIndex = record.lineIndex || 0;
        lastScrollTop = record.scroll || 0;
        currentChapterIndex = record.currentChapterIndex || 0; // 加载保存的章节索引
        Object.assign(elements, {
            fontSize: { value: record.fontSize || DEFAULT_SETTINGS.fontSize },
            fontColor: { value: record.fontColor || DEFAULT_SETTINGS.fontColor },
            lineHeight: { value: record.lineHeight || DEFAULT_SETTINGS.lineHeight },
            bgOpacity: { value: record.bgOpacity || DEFAULT_SETTINGS.bgOpacity }
        });
        popup.style.top = record.top || DEFAULT_SETTINGS.top;
        popup.style.left = record.left || DEFAULT_SETTINGS.left;
        popup.style.width = record.width || DEFAULT_SETTINGS.width;
        popup.style.height = record.height || DEFAULT_SETTINGS.height;
        linesPerPage = record.linesPerPage || GM_getValue('linesPerPage', DEFAULT_SETTINGS.linesPerPage);
        elements.linesPerPageInput.value = linesPerPage;
        keepEdgeLinesEnabled = record.keepEdgeLines || GM_getValue('keepEdgeLines', false);
        elements.keepEdgeLines.checked = keepEdgeLinesEnabled;

        if (fullText) {
            loadTextSegment();
            setTimeout(() => readerContent.scrollTop = lastScrollTop, 0);
        }
    }

    // 处理文件上传
    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (file && file.name.endsWith('.txt')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                fullText = event.target.result;
                currentLineIndex = 0;
                lastScrollTop = 0;
                currentChapterIndex = 0; // 重置章节索引
                readerContent.textContent = '';
                loadTextSegment();
                generateTOC();
                saveProgress();
            };
            reader.readAsText(file);
        }
    }

    // 加载文本段 - 统一行数限制逻辑
    function loadTextSegment() {
        if (!fullText) return;
        const lines = fullText.split('\n');
        const start = currentLineIndex;
        // 严格按照设置的行数显示，不考虑边界行额外显示的影响
        const effectiveLinesPerPage = linesPerPage;
        const end = Math.min(start + effectiveLinesPerPage, lines.length);
        let finalLines = [];

        if (keepEdgeLinesEnabled && start > 0) {
            // 如果启用保留边界行，从上一页的最后一行开始，但仍限制总行数
            finalLines = lines.slice(start - 1, Math.min(start - 1 + effectiveLinesPerPage + 1, lines.length));
            // 确保总行数不超过 effectiveLinesPerPage + 1
            if (finalLines.length > effectiveLinesPerPage + 1) {
                finalLines = finalLines.slice(0, effectiveLinesPerPage + 1);
            }
        } else {
            // 否则严格按照设置的行数显示
            finalLines = lines.slice(start, end);
        }

        readerContent.textContent = finalLines.join('\n');
        updateStyles();
        if (popup.style.display === 'block') readerContent.scrollTop = lastScrollTop;
    }

    // 加载翻页段 - 优化为严格按照设置的翻页行数显示，并确保完整行
    function loadPageSegment() {
        if (!fullText) return;
        const lines = fullText.split('\n');
        // 确保翻页行数至少为1，严格使用用户设置的值
        const effectiveLinesPerPage = linesPerPage;
        const start = currentLineIndex;
        // 计算结束行，确保不超过文本总行数
        const end = Math.min(start + effectiveLinesPerPage, lines.length);
        let finalLines = [];

        if (keepEdgeLinesEnabled && start > 0) {
            // 如果启用保留边界行，从上一页的最后一行开始，但仍限制总行数
            finalLines = lines.slice(start - 1, Math.min(start - 1 + effectiveLinesPerPage + 1, lines.length));
            // 确保总行数不超过 effectiveLinesPerPage + 1
            if (finalLines.length > effectiveLinesPerPage + 1) {
                finalLines = finalLines.slice(0, effectiveLinesPerPage + 1);
            }
        } else {
            // 否则严格按照设置的行数显示
            finalLines = lines.slice(start, end);
        }

        readerContent.textContent = finalLines.join('\n');
        updateStyles();
        // 如果启用保留边界行且不是第一页，滚动到第二行位置（即上一页的最后一行之后）
        readerContent.scrollTop = (start > 0 && keepEdgeLinesEnabled) ? readerContent.firstChild?.nextSibling?.offsetTop || 0 : 0;
    }

    // 更新样式
    function updateStyles() {
        readerContent.style.fontSize = `${elements.fontSize.value}px`;
        readerContent.style.color = elements.fontColor.value;
        readerContent.style.lineHeight = elements.lineHeight.value;
        const opacity = elements.bgOpacity.value;
        readerContent.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
        popup.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
        elements.settingsPopup.style.opacity = opacity === '0' ? '0' : '1';
        elements.popupHeader.style.opacity = opacity === '0' ? '0' : '1';
        popup.style.border = opacity === '0' ? 'none' : '1px solid #ccc';
        toc.style.opacity = opacity === '0' ? '0' : '1';
        elements.hotkeyPopup.style.opacity = opacity === '0' ? '0' : '1';
        readerContent.style.height = (toc.style.display === 'none' && elements.settingsPopup.style.display === 'none' && elements.hotkeyPopup.style.display === 'none')
            ? 'calc(100% - 40px)'
            : 'calc(100% - 140px)';
    }

    // 保存进度
    function saveProgress() {
        const record = {
            text: fullText,
            lineIndex: currentLineIndex,
            scroll: lastScrollTop,
            fontSize: elements.fontSize.value,
            fontColor: elements.fontColor.value,
            lineHeight: elements.lineHeight.value,
            bgOpacity: elements.bgOpacity.value,
            top: popup.style.top,
            left: popup.style.left,
            width: popup.style.width,
            height: popup.style.height,
            linesPerPage: linesPerPage,
            keepEdgeLines: keepEdgeLinesEnabled,
            currentChapterIndex: currentChapterIndex // 保存当前章节索引
        };
        GM_setValue('lastReadingRecord', JSON.stringify(record));
    }

    // 生成目录
    function generateTOC() {
        tocPopup.innerHTML = '';
        if (!fullText) {
            tocPopup.innerHTML = '<div>无目录</div>';
            return;
        }
        const lines = fullText.split('\n');
        let chapterCount = 0;
        let chapterIndices = []; // 存储章节的行索引
        let foundCurrentChapter = false;

        lines.forEach((line, index) => {
            if (line.match(/^第[一二三四五六七八九十百千万\d]+章/) || line.match(/^\d+\./) || line.match(/^Chapter \d+/i)) {
                chapterCount++;
                chapterIndices.push(index);
                const chapterLink = document.createElement('div');
                chapterLink.textContent = line.trim();
                chapterLink.style.cssText = 'cursor: pointer; padding: 5px 0;';
                // 根据当前阅读进度突出显示章节
                if (!foundCurrentChapter && currentLineIndex <= index) {
                    chapterLink.style.backgroundColor = '#ffeb3b'; // 高亮当前章节
                    chapterLink.style.fontWeight = 'bold';
                    currentChapterIndex = chapterCount - 1; // 更新当前章节索引
                    foundCurrentChapter = true;
                    // 滚动到当前章节位置
                    setTimeout(() => {
                        chapterLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 0);
                }
                chapterLink.onclick = () => {
                    currentLineIndex = index;
                    currentChapterIndex = chapterCount - 1; // 更新当前章节索引
                    loadTextSegment();
                    readerContent.scrollTop = 0;
                    tocPopup.style.display = 'none';
                    popup.style.display = 'block';
                    saveProgress(); // 点击章节时保存进度
                };
                tocPopup.appendChild(chapterLink);
            }
        });

        // 如果没有找到章节，或者进度在第一个章节之前，则高亮第一个章节
        if (!foundCurrentChapter && chapterCount > 0) {
            currentChapterIndex = 0;
            tocPopup.firstChild.style.backgroundColor = '#ffeb3b';
            tocPopup.firstChild.style.fontWeight = 'bold';
            setTimeout(() => {
                tocPopup.firstChild.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 0);
        }

        if (chapterCount === 0) tocPopup.innerHTML = '<div>未检测到章节</div>';
        saveProgress(); // 生成目录时保存进度
    }

    // 切换弹窗显示
    function togglePopup() {
        popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
        if (popup.style.display === 'block' && fullText) {
            loadTextSegment();
            readerContent.scrollTop = lastScrollTop;
        }
        saveProgress();
    }

    // 注册菜单命令
    function registerMenuCommands() {
        GM_registerMenuCommand('显示/隐藏悬浮图标', () => {
            floatBtnVisible = !floatBtnVisible;
            floatBtn.style.display = floatBtnVisible ? 'flex' : 'none';
        });
        GM_registerMenuCommand('不显示悬浮图标但显示弹窗', () => {
            floatBtnVisible = false;
            floatBtn.style.display = 'none';
            popup.style.display = 'block';
            if (fullText) {
                loadTextSegment();
                readerContent.scrollTop = lastScrollTop;
            }
        });
        GM_registerMenuCommand('显示悬浮图标', () => {
            floatBtnVisible = true;
            floatBtn.style.display = 'flex';
        });
        GM_registerMenuCommand('隐藏悬浮图标', () => {
            floatBtnVisible = false;
            floatBtn.style.display = 'none';
        });
    }

    // 监听页面卸载事件保存进度
    window.addEventListener('beforeunload', saveProgress);

    // 初始化执行
    init();
})();
