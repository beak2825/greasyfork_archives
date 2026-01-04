// ==UserScript==
// @name         音频下载面板 (可缩放, 名称细分)
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  检测页面音频并显示在可下载列表中，支持手动检测、去重、面板缩放，并细分重复标题的音轨名称。
// @author       AI Assistant
// @match       https://vocalremover.media.io/app/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535226/%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD%E9%9D%A2%E6%9D%BF%20%28%E5%8F%AF%E7%BC%A9%E6%94%BE%2C%20%E5%90%8D%E7%A7%B0%E7%BB%86%E5%88%86%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535226/%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD%E9%9D%A2%E6%9D%BF%20%28%E5%8F%AF%E7%BC%A9%E6%94%BE%2C%20%E5%90%8D%E7%A7%B0%E7%BB%86%E5%88%86%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区域 ---
    const PLAYER_SECTION_SELECTOR = 'div.px-14.py-8.bg-\\[\\#201F2C\\].rounded-xl > div.flex-1';
    const TITLE_SELECTOR = '.font-bold.text-white.pb-3.leading-5.text-base'; // 在 PLAYER_SECTION_SELECTOR 中标题的选择器
    const BACKGROUND_MUSIC_KEYWORD = 'background'; // 辅助识别，实际标题优先从 TITLE_SELECTOR 获取
    const VOCALS_KEYWORD = 'vocals'; // 辅助识别
    const LOCALSTORAGE_PANEL_MINIMIZED_KEY = 'audioDownloaderPanelMinimized_v1';
    // --- 配置区域结束 ---

    const detectedAudios = new Map(); // K: url, V: { title: string, filename: string, contentType: string, source: string }
    let panelElement;
    let listContainerElement;
    let toggleSizeButtonElement;

    const downloadIconSvg = `
        <svg style="width:16px;height:16px; vertical-align: middle; margin-right: 5px;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.2928 9.79289L13 13.0857V3H11V13.0859L7.70702 9.79289L6.29281 11.2071L10.5857 15.5C11.3667 16.281 12.6331 16.281 13.4141 15.5L17.707 11.2071L16.2928 9.79289ZM2.69128 17.0882L4.39177 19.4263C4.76813 19.9438 5.36937 20.25 6.00924 20.25H11V18.25H6.00924L4.30876 15.9118L2.69128 17.0882ZM19.6913 15.9118L17.9908 18.25H13V20.25H17.9908C18.6307 20.25 19.2319 19.9438 19.6083 19.4263L21.3088 17.0882L19.6913 15.9118Z" fill="currentColor"></path>
        </svg>
    `;
    const minimizeIconSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="vertical-align: middle;"><path d="M19 13H5v-2h14v2z"></path></svg>`;
    const maximizeIconSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="vertical-align: middle;"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM17 11H7v2h10v-2z"></path></svg>`;

    GM_addStyle(`
        #audio-downloader-panel {
            position: fixed; bottom: 10px; right: 10px; width: 380px; max-height: 450px;
            background-color: #f0f4f8; color: #333; border: 1px solid #d3dce6;
            border-radius: 8px; z-index: 2147483647; font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); display: flex; flex-direction: column;
            transition: width 0.3s ease, height 0.3s ease, max-height 0.3s ease;
        }
        #audio-downloader-panel.minimized {
            height: auto !important; max-height: 50px !important; width: 220px !important; overflow: hidden;
        }
        #audio-downloader-panel.minimized #audio-list-container,
        #audio-downloader-panel.minimized .manual-scan-btn { display: none; }
        #audio-downloader-panel.minimized #audio-downloader-panel-header h3 { font-size: 14px; }
        #audio-downloader-panel-header {
            padding: 10px 15px; background-color: #e4eaf1; border-bottom: 1px solid #d3dce6;
            border-top-left-radius: 8px; border-top-right-radius: 8px; display: flex;
            justify-content: space-between; align-items: center; cursor: default;
        }
        #audio-downloader-panel-header h3 {
            margin: 0; font-size: 16px; color: #2c5282; font-weight: 600;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-grow: 1;
        }
        #audio-downloader-panel .panel-button {
            background-color: #3182ce; color: white; border: none; padding: 6px 10px;
            border-radius: 5px; cursor: pointer; font-size: 13px; transition: background-color 0.2s;
            margin-left: 8px; line-height: 1; display: inline-flex; align-items: center; justify-content: center;
        }
        #audio-downloader-panel .panel-button:hover { background-color: #2b6cb0; }
        #audio-downloader-panel .panel-button.toggle-size-btn { padding: 6px 8px; }
        #audio-list-container { list-style: none; padding: 0; margin: 0; overflow-y: auto; flex-grow: 1; }
        #audio-list-container .audio-item {
            padding: 10px 15px; border-bottom: 1px solid #e2e8f0; display: flex;
            justify-content: space-between; align-items: center; gap: 10px;
        }
        #audio-list-container .audio-item:last-child { border-bottom: none; }
        #audio-list-container .audio-details { flex-grow: 1; min-width: 0; }
        #audio-list-container .audio-title {
            display: block; font-weight: 500; white-space: nowrap;
            overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px;
        }
        #audio-list-container .audio-source-tag {
            font-size: 11px; background-color: #e2e8f0; color: #4a5568;
            padding: 2px 5px; border-radius: 3px; display: inline-block;
        }
        #audio-list-container .download-link {
            background-color: #38a169; color: white; padding: 7px 10px; border-radius: 5px;
            text-decoration: none; font-size: 13px; white-space: nowrap; transition: background-color 0.2s;
            display: inline-flex; align-items: center;
        }
        #audio-list-container .download-link:hover { background-color: #2f855a; }
        #audio-downloader-panel-placeholder { padding: 25px 15px; text-align: center; color: #718096; font-style: italic; }
    `);

    function setPanelMinimizedState(isMinimized) {
        if (!panelElement || !toggleSizeButtonElement) return;
        panelElement.classList.toggle('minimized', isMinimized);
        toggleSizeButtonElement.innerHTML = isMinimized ? maximizeIconSvg : minimizeIconSvg;
        toggleSizeButtonElement.title = isMinimized ? '恢复面板' : '最小化面板';
        GM_setValue(LOCALSTORAGE_PANEL_MINIMIZED_KEY, isMinimized);
    }

    function createPanel() {
        panelElement = document.createElement('div');
        panelElement.id = 'audio-downloader-panel';

        const header = document.createElement('div');
        header.id = 'audio-downloader-panel-header';

        const title = document.createElement('h3');
        title.textContent = '音频下载列表';

        const buttonsWrapper = document.createElement('div');
        buttonsWrapper.style.display = 'flex';
        buttonsWrapper.style.alignItems = 'center';

        const manualScanButton = document.createElement('button');
        manualScanButton.textContent = '手动检测';
        manualScanButton.className = 'panel-button manual-scan-btn';
        manualScanButton.title = '扫描页面上的 <audio> 标签';
        manualScanButton.addEventListener('click', () => {
            console.log('[AudioDownloader] 手动检测已触发。');
            scanForAudioElements();
        });

        toggleSizeButtonElement = document.createElement('button');
        toggleSizeButtonElement.className = 'panel-button toggle-size-btn';
        toggleSizeButtonElement.addEventListener('click', () => {
            const currentMinimizedState = panelElement.classList.contains('minimized');
            setPanelMinimizedState(!currentMinimizedState);
        });

        buttonsWrapper.appendChild(manualScanButton);
        buttonsWrapper.appendChild(toggleSizeButtonElement);

        header.appendChild(title);
        header.appendChild(buttonsWrapper);

        listContainerElement = document.createElement('div');
        listContainerElement.id = 'audio-list-container';

        panelElement.appendChild(header);
        panelElement.appendChild(listContainerElement);
        document.body.appendChild(panelElement);

        const initiallyMinimized = GM_getValue(LOCALSTORAGE_PANEL_MINIMIZED_KEY, false);
        setPanelMinimizedState(initiallyMinimized);
        updatePanelList();
    }

    function updatePanelList() {
        if (!listContainerElement) return;
        listContainerElement.innerHTML = '';
        if (detectedAudios.size === 0) {
            const placeholder = document.createElement('div');
            placeholder.id = 'audio-downloader-panel-placeholder';
            placeholder.textContent = '暂未检测到音频。请尝试播放或手动检测。';
            listContainerElement.appendChild(placeholder);
            return;
        }
        detectedAudios.forEach((audioInfo, url) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'audio-item';
            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'audio-details';
            const titleSpan = document.createElement('span');
            titleSpan.className = 'audio-title';
            titleSpan.textContent = audioInfo.title || '未知音频';
            titleSpan.title = `完整文件名: ${audioInfo.filename}\n来源URL: ${url}`; // 更新 tooltip 内容
            const sourceTag = document.createElement('span');
            sourceTag.className = 'audio-source-tag';
            sourceTag.textContent = audioInfo.source || '未知来源';
            detailsDiv.appendChild(titleSpan);
            detailsDiv.appendChild(sourceTag);
            const downloadLink = document.createElement('a');
            downloadLink.className = 'download-link';
            downloadLink.href = url;
            downloadLink.setAttribute('download', audioInfo.filename);
            downloadLink.innerHTML = `${downloadIconSvg}下载`;
            downloadLink.target = '_blank';
            downloadLink.rel = 'noopener noreferrer';
            itemDiv.appendChild(detailsDiv);
            itemDiv.appendChild(downloadLink);
            listContainerElement.appendChild(itemDiv);
        });
    }

    function getFileExtension(url, contentType = '') {
        if (url && typeof url === 'string') {
            try {
                const path = new URL(url).pathname;
                const filenameFromUrl = path.substring(path.lastIndexOf('/') + 1);
                const dotIndex = filenameFromUrl.lastIndexOf('.');
                if (dotIndex !== -1 && dotIndex < filenameFromUrl.length - 1 && dotIndex > 0) {
                    return filenameFromUrl.substring(dotIndex).toLowerCase();
                }
            } catch (e) { /* URL解析失败，忽略 */ }
        }
        if (contentType && typeof contentType === 'string') {
            const type = contentType.toLowerCase().split(';')[0].trim();
            switch (type) {
                case 'audio/mpeg': return '.mp3'; case 'audio/wav': case 'audio/wave': case 'audio/x-wav': return '.wav';
                case 'audio/ogg': return '.ogg'; case 'audio/aac': return '.aac'; case 'audio/mp4': return '.m4a';
                case 'audio/flac': return '.flac'; case 'audio/opus': return '.opus';
            }
        }
        return '.audio';
    }

    function sanitizeFilename(name) {
        return name.replace(/[<>:"/\\|?*\x00-\x1F\s]+/g, '_').replace(/_{2,}/g, '_');
    }

    function addAudioToPanel(url, preferredTitle = '', contentType = '', detectionSource = '未知') {
        if (!url || typeof url !== 'string' || detectedAudios.has(url)) {
            return false; // URL无效或已作为键存在
        }

        let baseDisplayTitle = preferredTitle; // 这是我们希望用作基础的显示名称
        if (!baseDisplayTitle || baseDisplayTitle.trim() === '') { // 如果没有提供有效的 preferredTitle
            try {
                const urlObj = new URL(url);
                let pathPart = urlObj.pathname.substring(urlObj.pathname.lastIndexOf('/') + 1);
                // 尝试从文件名中移除已知的扩展名 (如果存在)
                const knownExtensions = ['.mp3', '.wav', '.ogg', '.aac', '.m4a', '.flac', '.opus', '.audio'];
                for (const ext of knownExtensions) {
                    if (pathPart.toLowerCase().endsWith(ext)) {
                        pathPart = pathPart.substring(0, pathPart.length - ext.length);
                        break;
                    }
                }
                baseDisplayTitle = decodeURIComponent(pathPart) || '未命名音轨';
            } catch (e) {
                baseDisplayTitle = '未命名音轨'; // URL解析失败的最终回退
            }
        }

        let finalDisplayTitle = baseDisplayTitle;
        let counter = 1;
        // 获取当前所有已存储的显示标题列表
        const existingDisplayTitles = Array.from(detectedAudios.values()).map(audio => audio.title);

        // 检查 finalDisplayTitle 是否已存在，如果存在，则添加序号
        while (existingDisplayTitles.includes(finalDisplayTitle)) {
            counter++; // 从 _2 开始计数 (如果 baseDisplayTitle 本身就被占用了)
            finalDisplayTitle = `${baseDisplayTitle}_${counter}`;
        }
        // 此时 finalDisplayTitle 保证是唯一的

        const baseFilename = sanitizeFilename(finalDisplayTitle); // 使用唯一的显示标题作为文件名基础
        const extension = getFileExtension(url, contentType);
        const filename = `${baseFilename}${extension}`;

        detectedAudios.set(url, {
            title: finalDisplayTitle, // 存储唯一的、可能已添加序号的显示标题
            filename: filename,
            contentType: contentType,
            source: detectionSource
        });
        console.log(`[AudioDownloader] 添加到面板: "${finalDisplayTitle}" (文件: ${filename}), 来源: ${detectionSource}, URL: ${url}`);
        updatePanelList(); // 更新面板显示
        return true;
    }


    function determineAudioTitleFromPageContext(urlForContext) {
        const playerSections = document.querySelectorAll(PLAYER_SECTION_SELECTOR);
        for (const section of playerSections) {
            const titleElement = section.querySelector(TITLE_SELECTOR);
            if (titleElement) {
                const titleText = titleElement.textContent.trim();
                const titleTextLower = titleText.toLowerCase();
                // 优先使用页面上明确的标题文字
                // 这里的关键词仅作为一种辅助识别方式，如果标题本身就包含关键词，那很好
                if (titleTextLower.includes(BACKGROUND_MUSIC_KEYWORD.toLowerCase())) {
                    return titleText; // 返回原始标题，例如 "Background music - Level 1"
                }
                if (titleTextLower.includes(VOCALS_KEYWORD.toLowerCase())) {
                    return titleText; // 返回原始标题，例如 "Vocals (Female)"
                }
            }
        }
        // 如果只有一个播放器区域，并且它有标题，则尝试使用该标题
        if (playerSections.length === 1) {
            const singleTitleEl = playerSections[0].querySelector(TITLE_SELECTOR);
            if (singleTitleEl) return singleTitleEl.textContent.trim();
        }
        return ''; // 未找到与上下文相关的特定标题，则返回空字符串
    }

    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function(...args) {
        const requestUrl = (args[0] instanceof Request) ? args[0].url : args[0];
        try {
            const response = await originalFetch.apply(unsafeWindow, args);
            const finalUrl = response.url || requestUrl;
            const contentType = response.headers.get('content-type') || '';

            if (contentType.startsWith('audio/') || (typeof finalUrl === 'string' && finalUrl.match(/\.(mp3|wav|ogg|aac|m4a|flac|opus)$/i))) {
                const preferredTitle = determineAudioTitleFromPageContext(finalUrl);
                addAudioToPanel(finalUrl, preferredTitle, contentType, 'Fetch');
            }
            return response;
        } catch (error) {
            if (error.name === 'AbortError') { /* 用户取消，静默处理 */ }
            else { console.error('[AudioDownloader] Fetch 错误:', error); }
            throw error;
        }
    };

    const originalXhrOpen = unsafeWindow.XMLHttpRequest.prototype.open;
    unsafeWindow.XMLHttpRequest.prototype.open = function(method, url) {
        this._audioDownloaderUrl = url;
        originalXhrOpen.apply(this, arguments);
    };

    const originalXhrSend = unsafeWindow.XMLHttpRequest.prototype.send;
    unsafeWindow.XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', function() {
            const finalUrl = this.responseURL || this._audioDownloaderUrl;
            const contentType = this.getResponseHeader('content-type') || '';

            if (finalUrl && (contentType.startsWith('audio/') || (typeof finalUrl === 'string' && finalUrl.match(/\.(mp3|wav|ogg|aac|m4a|flac|opus)$/i)))) {
                const preferredTitle = determineAudioTitleFromPageContext(finalUrl);
                addAudioToPanel(finalUrl, preferredTitle, contentType, 'XHR');
            }
        });
        originalXhrSend.apply(this, arguments);
    };

    function scanForAudioElements() {
        let foundNewInScan = false;
        document.querySelectorAll('audio').forEach(audioEl => {
            if (audioEl.src && typeof audioEl.src === 'string' && !audioEl.src.startsWith('blob:') && audioEl.src !== 'about:blank') {
                let preferredTitle = '';
                const playerSection = audioEl.closest(PLAYER_SECTION_SELECTOR);
                if (playerSection) {
                    const titleElement = playerSection.querySelector(TITLE_SELECTOR);
                    if (titleElement) {
                        preferredTitle = titleElement.textContent.trim();
                    }
                }
                if (addAudioToPanel(audioEl.src, preferredTitle, audioEl.type || '', 'AudioTag')) {
                    foundNewInScan = true;
                }
            }
        });
        if (foundNewInScan) {
            console.log('[AudioDownloader] 扫描 <audio> 标签发现了新的音源。');
        } else {
            // console.log('[AudioDownloader] 扫描 <audio> 标签完成，未发现新的音源。');
        }
    }

    const observer = new MutationObserver((mutationsList) => {
        let relevantChangeDetected = false;
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === 'AUDIO' || node.querySelector('audio') || (PLAYER_SECTION_SELECTOR && typeof node.matches === 'function' && node.matches(PLAYER_SECTION_SELECTOR))) {
                            relevantChangeDetected = true;
                        }
                    }
                });
            }
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                 if (mutation.target.tagName === 'AUDIO') {
                    relevantChangeDetected = true;
                }
            }
            if (relevantChangeDetected) break;
        }

        if (relevantChangeDetected) {
            scanForAudioElements();
        }
    });

    function initialize() {
        createPanel();
        scanForAudioElements();
        observer.observe(document.body, {
            childList: true, subtree: true, attributes: true, attributeFilter: ['src']
        });
        console.log('[AudioDownloader] 音频下载面板(可缩放, 名称细分)脚本已加载。请确保 @match 规则配置正确！');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();