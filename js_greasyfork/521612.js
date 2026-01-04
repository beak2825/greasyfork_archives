// ==UserScript==
// @name         JAV演员名复制（增强版）+ Emby查找（优化版）+ 页面失效跳转
// @namespace    http://tampermonkey.net/
// @version      4.1.5-modified
// @description  在JAVBus等网站上添加复制演员名、Emby库查找、字幕筛选、失效页面备用网址跳转（支持批量导入导出）等功能。
// @license      MIT
// @match        https://www.javbus.com/*
// @match        https://www.cdnbus.ink/*
// @match        *://*jav*/*
// @match        *://*bus*/*
// @include      *://*javlibrary.com/*
// @include      *://*javlib.com/*
// @include      *://*r86m.com/*
// @include      *://*s87n.com/*
// @include      *://*javbus.com/*
// @include      *://www.*bus*/*
// @include      *://www.*javsee*/*
// @include      *://www.*seejav*/*
// @include      *://*onejav.com/*
// @include      *://*avsox.*/*
// @include      *://*jav321.com/video/*
// @include      *://*javdb*.com/*
// @include      *://*javstore.*/*
// @include      *://*avmoo.*/*
// @include      ://tellme.pw/avmoo
// @include      *://115.com/*
// @include      *://*.quark.cn/list*
// @include      *://www.*dmm*/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/521612/JAV%E6%BC%94%E5%91%98%E5%90%8D%E5%A4%8D%E5%88%B6%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89%2B%20Emby%E6%9F%A5%E6%89%BE%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89%2B%20%E9%A1%B5%E9%9D%A2%E5%A4%B1%E6%95%88%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/521612/JAV%E6%BC%94%E5%91%98%E5%90%8D%E5%A4%8D%E5%88%B6%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89%2B%20Emby%E6%9F%A5%E6%89%BE%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89%2B%20%E9%A1%B5%E9%9D%A2%E5%A4%B1%E6%95%88%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取 Emby 服务器信息设置（从存储中加载）
    let baseUrl = GM_getValue('emby_baseUrl', "");
    let apiKey = GM_getValue('emby_apiKey', "");
    let userId = GM_getValue('emby_userId', "");
    let serverId = GM_getValue('emby_serverId', "");
    let showSubtitleOnly = GM_getValue('show_subtitle_only', false);
    let showExistsHighlight = GM_getValue('show_exists_highlight', false);

    // AI翻译设置
    let aiTranslateEnabled = GM_getValue('ai_translate_enabled', false);
    let aiApiUrl = GM_getValue('ai_api_url', "");
    let aiApiKey = GM_getValue('ai_api_key', "");
    let aiModel = GM_getValue('ai_model', "gpt-3.5-turbo");
    let aiPrompt = GM_getValue('ai_prompt', "请将以下日语标题翻译成中文，只返回翻译结果，不要其他内容：");

    // 加载备用网址列表
    let alternateUrls = GM_getValue('alternate_urls', []);

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 添加CSS样式
    GM_addStyle(`
        /* 所有原有样式 */
        .copy-button, .emby-check-button { margin-left: 5px; font-size: 12px; padding: 2px 5px; cursor: pointer; background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 3px; }
        .copy-button:hover, .emby-check-button:hover { background-color: #e0e0e0; }
        .emby-result-tooltip { position: absolute; background-color: rgba(20, 20, 20, 0.95); color: white; padding: 15px; border-radius: 8px; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.5; z-index: 10000; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); pointer-events: auto; word-wrap: break-word; opacity: 0; transform: translateY(10px) scale(0.95); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); max-width: 350px; }
        .emby-result-tooltip.visible { opacity: 1; transform: translateY(0) scale(1); }
        .emby-result-tooltip img { opacity: 0; transform: translateY(10px); transition: all 0.3s ease 0.1s; }
        .emby-result-tooltip.visible img { opacity: 1; transform: translateY(0); }
        .emby-check-button.loading::after { content: ""; display: inline-block; width: 12px; height: 12px; border: 2px solid #ccc; border-top-color: #333; border-radius: 50%; animation: spin 1s linear infinite; margin-left: 5px; vertical-align: middle; }
        .emby-check-button { background-color: #28a745; color: white; font-size: 14px; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; text-align: center; display: inline-block; vertical-align: middle; }
        .emby-check-button:hover { background-color: #218838; }
        .emby-open-button { display: inline-block; padding: 8px 12px; background-color: #00a4dc; color: white; border: none; border-radius: 4px; cursor: pointer; text-align: center; text-decoration: none; font-weight: 500; font-size: 13px; transition: all 0.3s ease; opacity: 0; transform: translateY(10px); }
        .emby-result-tooltip.visible .emby-open-button, .emby-check-button.expanded .emby-open-button { opacity: 1; transform: translateY(0); transition-delay: 0.2s; }
        .emby-open-button:hover { background-color: #0088b5; transform: translateY(-1px); }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .hidden-no-subtitle { display: none !important; }
        .floating-subtitle-filter, .floating-highlight-filter { position: fixed; left: 20px; z-index: 1000; color: white; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; border: none; box-shadow: 0 2px 5px rgba(0,0,0,0.2); font-size: 16px; transition: all 0.3s ease; opacity: 0.8; overflow: hidden; white-space: nowrap; display: flex; align-items: center; justify-content: center; }
        .floating-subtitle-filter { top: 50%; transform: translateY(-50%); background-color: #4CAF50; }
        .floating-highlight-filter { top: calc(50% + 50px); transform: translateY(-50%); background-color: #28a745; }
        .floating-subtitle-filter:hover, .floating-highlight-filter:hover { width: 160px; border-radius: 20px; opacity: 1; }
        .floating-subtitle-filter.active { background-color: #28a745; }
        .floating-subtitle-filter.inactive { background-color: #dc3545; }
        .floating-highlight-filter.active { background-color: #28a745; }
        .floating-highlight-filter.inactive { background-color: #dc3545; }
        .floating-subtitle-filter:hover { background-color: #45a049; }
        .floating-highlight-filter:hover { background-color: #218838; }
        .floating-subtitle-filter .short-text, .floating-highlight-filter .short-text { display: block; }
        .floating-subtitle-filter .full-text, .floating-highlight-filter .full-text { display: none; }
        .floating-subtitle-filter:hover .short-text, .floating-highlight-filter:hover .short-text { display: none; }
        .floating-subtitle-filter:hover .full-text, .floating-highlight-filter:hover .full-text { display: block; }
        .watermark-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; opacity: 0.3; }
        .watermark-text { position: absolute; font-size: 34px; color: #FFD700; transform: rotate(-45deg); white-space: nowrap; user-select: none; }
        .emby-check-button-container { position: relative; width: 120px; height: 32px; margin: 10px auto; z-index: 1000; }
        .emby-check-button-container .emby-check-button { position: absolute; left: 50%; transform: translateX(-50%); width: 120px; height: 32px; transform-origin: center; }
        .emby-check-button-container .emby-check-button.expanded { width: 300px; min-height: 350px; height: auto; background-color: rgba(20, 20, 20, 0.95); padding: 15px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); cursor: default; overflow: visible; }
        .emby-check-button .button-text { transition: opacity 0.2s ease; display: block; line-height: 22px; }
        .emby-check-button.expanded .button-text { opacity: 0; height: 0; pointer-events: none; }
        .emby-check-button .content-container { opacity: 0; transform: translateY(10px); transition: all 0.3s ease; position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; display: flex; flex-direction: column; align-items: center; padding: 15px; box-sizing: border-box; }
        .emby-check-button.expanded .content-container { opacity: 1; transform: translateY(0); position: relative; pointer-events: auto; transition-delay: 0.1s; }
        .emby-check-button .movie-title { font-size: 14px; margin-bottom: 12px; color: #fff; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 8px; text-align: center; word-break: break-all; width: 100%; }
        .emby-check-button .movie-image { width: 100%; max-width: 200px; height: auto; border-radius: 4px; margin: 10px 0; opacity: 0; transform: translateY(10px); transition: all 0.3s ease 0.2s; }
        .emby-check-button.expanded .movie-image { opacity: 1; transform: translateY(0); }
        .emby-check-button.expanded .emby-open-button { margin-top: 12px; width: 140px; transition-delay: 0.3s; }
        .emby-check-button .close-button { position: absolute; right: 10px; top: 10px; cursor: pointer; font-size: 24px; color: #aaa; opacity: 0; transition: opacity 0.3s ease, color 0.3s ease; z-index: 1; }
        .emby-check-button.expanded .close-button { opacity: 0.7; }
        .emby-check-button .close-button:hover { opacity: 1; color: #fff; }
        .actor-check-button { position: static; transform: none; margin-left: 5px; width: auto; height: auto; padding: 2px 5px; font-size: 12px; vertical-align: middle; }
        .actor-check-button.loading::after { width: 10px; height: 10px; margin-left: 3px; }
        .item.exists-in-emby { position: relative; }
        .item.exists-in-emby::before { content: "库中已存在"; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(40, 167, 69, 0.2); border: 2px solid #28a745; box-sizing: border-box; display: flex; align-items: center; justify-content: center; color: #28a745; font-weight: bold; font-size: 1.2em; z-index: 1; pointer-events: none; }
        .sht-button { position: fixed; right: 0; background-color: #ff6b81; color: white; padding: 8px 15px; border: none; border-radius: 4px 0 0 4px; cursor: pointer; font-size: 14px; z-index: 1000; transition: all 0.3s ease; box-shadow: -2px 2px 5px rgba(0,0,0,0.2); }
        .sht-button:hover { background-color: #ff4757; padding-right: 20px; }
        @keyframes flash4k { 0%, 100% { background-color: #ffeb3b; color: black; } 50% { background-color: #ff4444; color: white; } }
        .flash-4k { animation: flash4k 1s infinite; font-weight: bold; padding: 2px 4px; border-radius: 3px; }
        .alternate-sites-container { margin-top: 20px; padding: 15px; border: 1px solid #ffc107; border-radius: 5px; background-color: #fff3cd; }
        .alternate-sites-container h4 { margin-top: 0; margin-bottom: 10px; color: #856404; }
        .alternate-sites-container .links-wrapper { display: flex; flex-wrap: wrap; gap: 10px; }
        .alternate-sites-container a { background-color: #007bff; color: white; padding: 5px 10px; text-decoration: none; border-radius: 3px; transition: background-color 0.2s; }
        .alternate-sites-container a:hover { background-color: #0056b3; }
        #importUrlsArea { width: 100%; min-height: 80px; margin-top: 5px; font-family: monospace; padding: 5px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 3px; }
        .batch-ops-container { margin-top: 15px; padding-top: 15px; border-top: 1px dashed #ccc; }
        .batch-ops-container .button-group { display: flex; gap: 10px; margin-top: 5px; }
        .ai-translate-button { background-color: #6f42c1; color: white; padding: 4px 8px; border: none; border-radius: 3px; font-size: 12px; cursor: pointer; margin-left: 10px; transition: background-color 0.3s; }
        .ai-translate-button:hover { background-color: #5a359a; }
        .ai-translate-button.loading { opacity: 0.6; cursor: not-allowed; }
        .ai-translate-button.loading::after { content: "..."; animation: loading 1s infinite; }
        @keyframes loading { 0%, 33% { content: "."; } 34%, 66% { content: ".."; } 67%, 100% { content: "..."; } }
        .title-translated { position: relative; }
        .title-translated::after { content: "已翻译"; position: absolute; top: -5px; right: -5px; background-color: #6f42c1; color: white; font-size: 10px; padding: 2px 4px; border-radius: 3px; }
    `);

    // 添加菜单
    GM_registerMenuCommand('设置 Emby 服务器信息', setEmbyServerInfo);
    GM_registerMenuCommand('设置 AI 翻译', setAiTranslateInfo);
    GM_registerMenuCommand('切换 AI 翻译开关', () => {
        aiTranslateEnabled = !aiTranslateEnabled;
        GM_setValue('ai_translate_enabled', aiTranslateEnabled);
        alert(`AI 翻译已${aiTranslateEnabled ? '开启' : '关闭'}`);

        // 更新页面上的按钮状态
        const toggleButton = document.querySelector('.ai-translate-button');
        if (toggleButton && toggleButton.textContent.includes('自动翻译')) {
            toggleButton.textContent = aiTranslateEnabled ? '关闭自动翻译' : '开启自动翻译';
        }

        // 如果开启了翻译且当前页面有标题，立即翻译
        if (aiTranslateEnabled) {
            translateCurrentTitle();
        }
    });
    GM_registerMenuCommand('管理备用网址', manageAlternateUrls);
    GM_registerMenuCommand('切换是否只显示字幕影片', () => {
        toggleSubtitleOnly();
        const floatingButton = document.querySelector('.floating-subtitle-filter');
        if (floatingButton) updateFloatingButtonState(floatingButton, showSubtitleOnly, '字', '只显示字幕');
        filterSubtitleItems();
    });
    GM_registerMenuCommand('切换是否显示库中已存在高亮', () => {
        toggleExistsHighlight();
        const highlightButton = document.querySelector('.floating-highlight-filter');
        if (highlightButton) updateFloatingButtonState(highlightButton, showExistsHighlight, '库', '库存高亮');
        updateHighlightDisplay();
    });

    const debouncedObserverCallback = debounce(() => {
        checkForPageErrorAndSuggestAlternatives();
        addEmbyCheckButton();
        addCopyButtons();
        addAiTranslateButton();
        loadSavedTranslation(); // 加载保存的翻译
        const itemsPresent = document.querySelector('.item');
        const subtitleFilterButton = document.querySelector('.floating-subtitle-filter');
        const highlightFilterButton = document.querySelector('.floating-highlight-filter');
        if (itemsPresent) {
            if (!subtitleFilterButton) createFloatingButton();
            if (!highlightFilterButton) createHighlightButton();
            checkGridItems();
            if (showSubtitleOnly) filterSubtitleItems();
            if (showExistsHighlight) updateHighlightDisplay();
        } else {
            if (subtitleFilterButton) subtitleFilterButton.remove();
            if (highlightFilterButton) highlightFilterButton.remove();
        }
        const label4K = document.querySelector('a[href="https://www.javbus.com/genre/fd"]');
        const existingWatermark = document.querySelector('.watermark-container');
        if (label4K && !existingWatermark) {
            document.body.appendChild(createWatermark());
        } else if (!label4K && existingWatermark) {
            existingWatermark.remove();
        }
        highlight4KContent();
    }, 300);

    const observer = new MutationObserver(debouncedObserverCallback);
    const observerTarget = document.querySelector('#main-container') || document.body;
    observer.observe(observerTarget, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        debouncedObserverCallback();
    });

    function manageAlternateUrls() {
        let currentAlternateUrls = GM_getValue('alternate_urls', []);
        const dialogOverlay = document.createElement('div');
        dialogOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 10001; display: flex; justify-content: center; align-items: center;';
        const dialog = document.createElement('div');
        dialog.style.cssText = 'background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); width: 500px; max-height: 80vh; overflow-y: auto;';
        dialog.innerHTML = `
            <div style="border: 1px solid #ccc; padding: 15px; border-radius: 5px;">
                <h3>备用网址管理 (用于页面失效时跳转)</h3>
                <p style="font-size: 12px; color: #666;">请添加备用站点的首页地址，例如: https://www.fanbus.ink</p>
                <div id="alternateUrlsList" style="margin-bottom: 10px;"></div>
                <div style="display: flex;">
                    <input type="text" id="newAlternateUrl" placeholder="在此输入新的备用网址" style="flex-grow: 1; margin-right: 10px; padding: 5px; box-sizing: border-box;"/><button id="addAlternateUrl" style="padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">添加</button>
                </div>
                <div class="batch-ops-container">
                    <h4 style="margin-top:0; margin-bottom:10px;">批量操作</h4>
                    <label for="importUrlsArea" style="font-size:12px;">在此粘贴网址列表 (每行一个) 进行导入:</label>
                    <textarea id="importUrlsArea"></textarea>
                    <div class="button-group">
                        <button id="importUrls" style="padding: 5px 10px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">导入列表</button>
                        <button id="exportUrls" style="padding: 5px 10px; background-color: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer;">导出全部到剪贴板</button>
                    </div>
                </div>
            </div>
            <div style="margin-top: 20px; text-align: right;">
                <button id="saveSettings" style="margin-right: 10px; padding: 8px 12px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">保存并关闭</button>
                <button id="cancelSettings" style="padding: 8px 12px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">取消</button>
            </div>
        `;
        dialogOverlay.appendChild(dialog);
        document.body.appendChild(dialogOverlay);
        const listContainer = dialog.querySelector('#alternateUrlsList');
        const newUrlInput = dialog.querySelector('#newAlternateUrl');
        const importArea = dialog.querySelector('#importUrlsArea');
        function renderAlternateUrls() {
            listContainer.innerHTML = '';
            currentAlternateUrls.forEach((url, index) => {
                const urlItem = document.createElement('div');
                urlItem.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 5px; border-bottom: 1px solid #eee;';
                urlItem.innerHTML = `<span style="word-break: break-all;">${url}</span><button data-index="${index}" class="delete-url" style="padding: 2px 8px; font-size: 12px; background-color: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer; margin-left: 10px;">删除</button>`;
                listContainer.appendChild(urlItem);
            });
        }
        dialog.querySelector('#addAlternateUrl').addEventListener('click', () => {
            const newUrl = newUrlInput.value.trim();
            if (newUrl && !currentAlternateUrls.includes(newUrl)) {
                try {
                    new URL(newUrl);
                    currentAlternateUrls.push(newUrl);
                    newUrlInput.value = '';
                    renderAlternateUrls();
                } catch (e) {
                    alert('请输入有效的网址格式！(例如 https://www.example.com)');
                }
            }
        });
        listContainer.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('delete-url')) {
                const indexToRemove = parseInt(e.target.dataset.index, 10);
                currentAlternateUrls.splice(indexToRemove, 1);
                renderAlternateUrls();
            }
        });
        dialog.querySelector('#importUrls').addEventListener('click', () => {
            const urlsToImport = importArea.value.split('\n');
            let importedCount = 0;
            urlsToImport.forEach(urlStr => {
                const url = urlStr.trim();
                if (url && !currentAlternateUrls.includes(url)) {
                    try {
                        new URL(url);
                        currentAlternateUrls.push(url);
                        importedCount++;
                    } catch (e) {
                        console.log(`已跳过无效或格式错误的网址: ${url}`);
                    }
                }
            });
            renderAlternateUrls();
            importArea.value = '';
            alert(`操作完成！成功导入 ${importedCount} 个新的备用网址。`);
        });
        dialog.querySelector('#exportUrls').addEventListener('click', (e) => {
            const exportText = currentAlternateUrls.join('\n');
            if (exportText) {
                GM_setClipboard(exportText);
                const button = e.target;
                button.textContent = '已复制!';
                setTimeout(() => { button.textContent = '导出全部到剪贴板'; }, 2000);
            } else {
                alert('没有可导出的网址。');
            }
        });
        dialog.querySelector('#saveSettings').addEventListener('click', () => {
            GM_setValue('alternate_urls', currentAlternateUrls);
            alternateUrls = currentAlternateUrls;
            alert('备用网址已保存。');
            document.body.removeChild(dialogOverlay);
        });
        dialog.querySelector('#cancelSettings').addEventListener('click', () => {
            document.body.removeChild(dialogOverlay);
        });
        renderAlternateUrls();
    }

    // --- 函数已更新 ---
    function checkForPageErrorAndSuggestAlternatives() {
        // 将两个选择器用逗号隔开，匹配其中任意一个
        const errorElement = document.querySelector('.alert-danger.alert-page.error-page, .cf-wrapper.cf-header.cf-error-overview');

        if (!errorElement || document.querySelector('.alternate-sites-container')) {
            return;
        }
        const alternates = GM_getValue('alternate_urls', []);
        if (alternates.length === 0) return;
        const path = window.location.pathname;
        if (path === '/' || !path) return;
        const container = document.createElement('div');
        container.className = 'alternate-sites-container';
        let linksHtml = '<h4>页面无法访问，请尝试以下备用站点：</h4><div class="links-wrapper">';
        alternates.forEach(baseUrl => {
            const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
            const newUrl = cleanBaseUrl + path;
            try {
                linksHtml += `<a href="${newUrl}">在 ${new URL(baseUrl).hostname} 中打开</a>`;
            } catch (e) {}
        });
        linksHtml += '</div>';
        container.innerHTML = linksHtml;
        errorElement.parentNode.insertBefore(container, errorElement.nextSibling);
    }

    function setEmbyServerInfo() {
        const dialogOverlay = document.createElement('div');
        dialogOverlay.style.position = 'fixed';
        dialogOverlay.style.top = '0';
        dialogOverlay.style.left = '0';
        dialogOverlay.style.width = '100%';
        dialogOverlay.style.height = '100%';
        dialogOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        dialogOverlay.style.zIndex = '10001';
        dialogOverlay.style.display = 'flex';
        dialogOverlay.style.justifyContent = 'center';
        dialogOverlay.style.alignItems = 'center';
        const dialog = document.createElement('div');
        dialog.style.backgroundColor = '#fff';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '8px';
        dialog.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        dialog.style.width = '500px';
        dialog.style.maxHeight = '80vh';
        dialog.style.overflowY = 'auto';

        dialog.innerHTML = `
            <h2>设置 Emby 服务器信息</h2>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Emby 服务器 URL:</label>
                <input type="text" id="embyBaseUrl" value="${baseUrl}" placeholder="例如: http://192.168.1.100:8096" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;"/>
                <small style="color: #666; font-size: 12px;">请输入Emby服务器的完整地址</small>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Emby API Key:</label>
                <div style="display: flex; gap: 10px; align-items: flex-end;">
                    <div style="flex-grow: 1;">
                        <input type="text" id="embyApiKey" value="${apiKey}" placeholder="在Emby管理界面生成API密钥" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;"/>
                        <small style="color: #666; font-size: 12px;">需要在Emby管理界面手动生成</small>
                    </div>
                    <button id="openApiKeyPage" style="padding: 8px 12px; background-color: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer; white-space: nowrap;">生成API Key</button>
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Emby 用户 ID:</label>
                <div style="display: flex; gap: 10px; align-items: flex-end;">
                    <input type="text" id="embyUserId" value="${userId}" placeholder="将自动获取" style="flex-grow: 1; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;" readonly/>
                    <button id="autoGetIds" style="padding: 8px 12px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; white-space: nowrap;">自动获取</button>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Emby 服务器 ID:</label>
                <input type="text" id="embyServerId" value="${serverId}" placeholder="将自动获取" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;" readonly/>
            </div>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin-bottom: 20px; border-left: 4px solid #007bff;">
                <h4 style="margin-top: 0; color: #007bff;">使用说明：</h4>
                <ol style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.5;">
                    <li>首先填写Emby服务器URL</li>
                    <li>点击"生成API Key"按钮跳转到Emby管理界面</li>
                    <li>在Emby中：设置 → API密钥 → 新增，复制生成的密钥</li>
                    <li>回到此页面，粘贴API Key</li>
                    <li>点击"自动获取"按钮获取用户ID和服务器ID</li>
                </ol>
            </div>

            <div style="text-align: right;">
                <button id="saveEmbySettings" style="margin-right: 10px; padding: 10px 16px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">保存设置</button>
                <button id="cancelEmbySettings" style="padding: 10px 16px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">取消</button>
            </div>
        `;

        dialogOverlay.appendChild(dialog);
        document.body.appendChild(dialogOverlay);

        // 生成API Key按钮事件
        dialog.querySelector('#openApiKeyPage').addEventListener('click', () => {
            const baseUrlInput = dialog.querySelector('#embyBaseUrl').value.trim();
            if (!baseUrlInput) {
                alert('请先输入Emby服务器URL');
                return;
            }

            // 确保URL格式正确
            let url = baseUrlInput;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'http://' + url;
            }

            // 打开API密钥管理页面
            const apiKeyUrl = `${url}/web/index.html#!/apikeys`;
            window.open(apiKeyUrl, '_blank');
        });

        // 自动获取用户ID和服务器ID
        dialog.querySelector('#autoGetIds').addEventListener('click', async () => {
            const baseUrlInput = dialog.querySelector('#embyBaseUrl').value.trim();
            const apiKeyInput = dialog.querySelector('#embyApiKey').value.trim();

            if (!baseUrlInput || !apiKeyInput) {
                alert('请先填写服务器URL和API Key');
                return;
            }

            const button = dialog.querySelector('#autoGetIds');
            const originalText = button.textContent;
            button.textContent = '获取中...';
            button.disabled = true;

            try {
                // 确保URL格式正确
                let url = baseUrlInput;
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'http://' + url;
                }

                // 获取用户列表
                const userResponse = await fetch(`${url}/emby/Users?api_key=${apiKeyInput}`);
                if (!userResponse.ok) {
                    throw new Error(`获取用户列表失败: ${userResponse.status} ${userResponse.statusText}`);
                }
                const users = await userResponse.json();

                // 获取服务器信息
                const systemResponse = await fetch(`${url}/emby/System/Info?api_key=${apiKeyInput}`);
                if (!systemResponse.ok) {
                    throw new Error(`获取服务器信息失败: ${systemResponse.status} ${systemResponse.statusText}`);
                }
                const systemInfo = await systemResponse.json();

                if (users && users.length > 0) {
                    let selectedUser;

                    if (users.length === 1) {
                        // 只有一个用户，直接使用
                        selectedUser = users[0];
                    } else {
                        // 多个用户，让用户选择
                        const userNames = users.map((user, index) => `${index + 1}. ${user.Name} (${user.Policy?.IsAdministrator ? '管理员' : '普通用户'})`).join('\n');
                        const userChoice = prompt(`检测到多个用户，请选择要使用的用户（输入序号1-${users.length}）：\n\n${userNames}`);

                        if (userChoice === null) {
                            // 用户取消选择
                            return;
                        }

                        const choiceIndex = parseInt(userChoice) - 1;
                        if (choiceIndex >= 0 && choiceIndex < users.length) {
                            selectedUser = users[choiceIndex];
                        } else {
                            throw new Error('无效的用户选择');
                        }
                    }

                    if (selectedUser && selectedUser.Id) {
                        dialog.querySelector('#embyUserId').value = selectedUser.Id;

                        // 显示获取到的用户名
                        const userIdInput = dialog.querySelector('#embyUserId');
                        userIdInput.title = `选择的用户: ${selectedUser.Name}`;
                    } else {
                        throw new Error('无法获取用户ID');
                    }
                } else {
                    throw new Error('未找到任何用户');
                }

                if (systemInfo.Id) {
                    dialog.querySelector('#embyServerId').value = systemInfo.Id;

                    // 显示服务器名称
                    const serverIdInput = dialog.querySelector('#embyServerId');
                    serverIdInput.title = `服务器名: ${systemInfo.ServerName || 'Emby Server'}`;
                } else {
                    throw new Error('无法获取服务器ID');
                }

                const selectedUserName = users.length === 1 ? users[0].Name : dialog.querySelector('#embyUserId').title.replace('选择的用户: ', '');
                alert(`成功获取信息！\n用户: ${selectedUserName}\n服务器: ${systemInfo.ServerName || 'Emby Server'}`);

            } catch (error) {
                console.error('自动获取ID失败:', error);
                alert(`自动获取失败: ${error.message}\n\n请检查:\n1. 服务器URL是否正确\n2. API Key是否有效\n3. 网络连接是否正常\n4. Emby服务器是否正常运行`);
            } finally {
                button.textContent = originalText;
                button.disabled = false;
            }
        });

        dialog.querySelector('#saveEmbySettings').addEventListener('click', () => {
            const newBaseUrl = dialog.querySelector('#embyBaseUrl').value.trim();
            const newApiKey = dialog.querySelector('#embyApiKey').value.trim();
            const newUserId = dialog.querySelector('#embyUserId').value.trim();
            const newServerId = dialog.querySelector('#embyServerId').value.trim();

            if (newBaseUrl && newApiKey && newUserId && newServerId) {
                // 确保URL格式正确
                let finalUrl = newBaseUrl;
                if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
                    finalUrl = 'http://' + finalUrl;
                }

                baseUrl = finalUrl;
                apiKey = newApiKey;
                userId = newUserId;
                serverId = newServerId;

                GM_setValue('emby_baseUrl', baseUrl);
                GM_setValue('emby_apiKey', apiKey);
                GM_setValue('emby_userId', userId);
                GM_setValue('emby_serverId', serverId);

                alert('Emby 服务器信息已保存！');
                document.body.removeChild(dialogOverlay);
            } else {
                const missingFields = [];
                if (!newBaseUrl) missingFields.push('服务器URL');
                if (!newApiKey) missingFields.push('API Key');
                if (!newUserId) missingFields.push('用户ID');
                if (!newServerId) missingFields.push('服务器ID');

                alert(`请完整填写以下信息：\n${missingFields.join('、')}`);
            }
        });

        dialog.querySelector('#cancelEmbySettings').addEventListener('click', () => {
            document.body.removeChild(dialogOverlay);
        });
    }

    function toggleSubtitleOnly() {
        showSubtitleOnly = !showSubtitleOnly;
        GM_setValue('show_subtitle_only', showSubtitleOnly);
    }

    function filterSubtitleItems() {
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            const hasSubtitle = item.querySelector('.btn-warning[title*="字幕"]') !== null;
            if (showSubtitleOnly && !hasSubtitle) {
                item.classList.add('hidden-no-subtitle');
            } else {
                item.classList.remove('hidden-no-subtitle');
            }
        });
    }

    function copyActorName(button, name) {
        GM_setClipboard(name);
        const originalText = button.textContent;
        button.textContent = '已复制';
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    }

    function createCopyButton(name) {
        const button = document.createElement('button');
        button.textContent = '复制';
        button.className = 'copy-button';
        button.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            copyActorName(this, name);
        };
        return button;
    }

    function createEmbyCheckButton(movieCode) {
        const container = document.createElement('div');
        container.className = 'emby-check-button-container';
        const button = document.createElement('button');
        button.className = 'emby-check-button';
        button.innerHTML = `<span class="button-text">检查中...</span><div class="content-container"></div>`;
        container.appendChild(button);
        checkEmbyLibrary(movieCode, button, true);
        return container;
    }

    function showResultTooltip(button, content) {
        document.querySelectorAll('.emby-result-tooltip').forEach(el => el.remove());

        let tooltip = document.createElement('div');
        tooltip.className = 'emby-result-tooltip';
        tooltip.innerHTML = content;
        document.body.appendChild(tooltip);

        const closeButton = document.createElement('div');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `position: absolute; right: 5px; top: 5px; cursor: pointer; font-size: 20px; color: #fff; opacity: 0; transition: opacity 0.3s ease;`;
        tooltip.appendChild(closeButton);

        function positionTooltip() {
            const buttonRect = button.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const scrollX = window.pageXOffset;
            const scrollY = window.pageYOffset;
            let left = buttonRect.left + scrollX + (buttonRect.width / 2) - (tooltipRect.width / 2);
            let top = buttonRect.bottom + scrollY + 10;
            if (left < scrollX + 10) left = scrollX + 10;
            if (left + tooltipRect.width > viewportWidth + scrollX - 10) left = viewportWidth + scrollX - tooltipRect.width - 10;
            if (top + tooltipRect.height > viewportHeight + scrollY - 10) {
                top = buttonRect.top + scrollY - tooltipRect.height - 10;
                if (top < scrollY + 10) top = scrollY + (viewportHeight - tooltipRect.height) / 2;
            }
            if (top < scrollY + 10) top = scrollY + 10;
            tooltip.style.left = `${Math.max(0, left)}px`;
            tooltip.style.top = `${Math.max(0, top)}px`;
            tooltip.style.maxHeight = `${viewportHeight - 40}px`;
            tooltip.style.overflowY = 'auto';
        }

        const resizeObserverInstance = new ResizeObserver(positionTooltip);
        let hideTimeout;

        function cleanup() {
            clearTimeout(hideTimeout);
            resizeObserverInstance.disconnect();
            window.removeEventListener('scroll', positionTooltip);
            window.removeEventListener('resize', positionTooltip);
            tooltip.classList.remove('visible');
            tooltip.addEventListener('transitionend', () => {
                if (tooltip.parentElement) tooltip.remove();
            }, { once: true });
        }

        requestAnimationFrame(() => {
            positionTooltip();
            tooltip.classList.add('visible');
            closeButton.style.opacity = '1';
        });

        resizeObserverInstance.observe(tooltip);
        window.addEventListener('scroll', positionTooltip, { passive: true });
        window.addEventListener('resize', positionTooltip, { passive: true });

        // 自动关闭逻辑
        const startHideTimer = () => {
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(cleanup, 500);
        };

        const cancelHideTimer = () => {
            clearTimeout(hideTimeout);
        };

        tooltip.addEventListener('mouseenter', cancelHideTimer);
        tooltip.addEventListener('mouseleave', startHideTimer);

        closeButton.addEventListener('click', () => {
            cancelHideTimer(); // 点击手动关闭时也取消计时器
            cleanup();
        });

        return tooltip;
    }

    async function checkEmbyLibrary(movieCode, button, isInitialCheck = false) {
        if (!isInitialCheck && !button.classList.contains('expanded')) {
            button.classList.add('loading');
            button.querySelector('.button-text').style.display = 'none';
        }
        button.disabled = true;
        try {
            if (!baseUrl || !apiKey || !userId || !serverId) {
                button.querySelector('.button-text').textContent = '未配置';
                button.querySelector('.button-text').style.display = 'block';
                button.disabled = false;
                button.classList.remove('loading');
                return;
            }
            const response = await fetch(`${baseUrl}/emby/Users/${userId}/Items?` + new URLSearchParams({ api_key: apiKey, searchTerm: movieCode, IncludeItemTypes: 'Movie', Recursive: true, Fields: 'Name,ProviderIds,ImageTags,Id', Limit: 10 }));
            const data = await response.json();
            button.classList.remove('loading');
            if (button.querySelector('.button-text')) button.querySelector('.button-text').style.display = 'block';
            button.disabled = false;
            const exactMatch = data.Items?.find(item => item.Name.includes(movieCode) || (item.ProviderIds && Object.values(item.ProviderIds).some(id => String(id).includes(movieCode))));
            const buttonTextSpan = button.querySelector('.button-text');
            const contentContainer = button.querySelector('.content-container');
            if (exactMatch) {
                buttonTextSpan.textContent = '存在于库中';
                button.style.backgroundColor = '#28a745';
                button.dataset.exists = 'true';
                contentContainer.innerHTML = `<div class="close-button">×</div><div class="movie-title">${exactMatch.Name}</div>${exactMatch.ImageTags?.Primary ? `<img class="movie-image" src="${baseUrl}/emby/Items/${exactMatch.Id}/Images/Primary?tag=${exactMatch.ImageTags.Primary}&api_key=${apiKey}" alt="${exactMatch.Name}">` : '<div style="height: 150px; display: flex; align-items: center; justify-content: center; color: #888;">无封面</div>'}<div style="text-align: center;"><a href="${baseUrl}/web/index.html#!/item?id=${exactMatch.Id}&serverId=${serverId}" target="_blank" class="emby-open-button">在 Emby 中打开</a></div>`;
                if (button.parentElement.classList.contains('emby-check-button-container')) {
                    let expandTimeout, collapseTimeout;
                    const expand = () => { clearTimeout(collapseTimeout); expandTimeout = setTimeout(() => button.classList.add('expanded'), 150); };
                    const collapse = () => { clearTimeout(expandTimeout); collapseTimeout = setTimeout(() => button.classList.remove('expanded'), 300); };
                    button.addEventListener('mouseenter', expand);
                    button.addEventListener('mouseleave', collapse);
                    contentContainer.querySelector('.close-button').onclick = (e) => { e.stopPropagation(); clearTimeout(expandTimeout); clearTimeout(collapseTimeout); button.classList.remove('expanded'); };
                }
            } else {
                buttonTextSpan.textContent = '不存在于库中';
                button.style.backgroundColor = '#dc3545';
                button.dataset.exists = 'false';
                contentContainer.innerHTML = '';
            }
        } catch (error) {
            button.classList.remove('loading');
            if (button.querySelector('.button-text')) {
                button.querySelector('.button-text').style.display = 'block';
                button.querySelector('.button-text').textContent = '查询失败';
            }
            button.disabled = false;
            console.error('Emby library check error:', error);
            if (!isInitialCheck) {
                showResultTooltip(button, `查询失败: ${error.message || '未知错误'}`);
            }
        }
    }

    // *** 函数已更新 ***
    async function checkEmbyActorMovies(actorName, button) {
        button.classList.add('loading');
        button.disabled = true;
        const originalButtonText = button.textContent;

        try {
            if (!baseUrl || !apiKey || !userId || !serverId) {
                alert('请先完整配置 Emby 服务器信息，包括服务器 ID。');
                button.classList.remove('loading');
                button.disabled = false;
                return;
            }
            const searchQuery = actorName.replace(/\(.*?\)/g, '').trim();
            const personResponse = await fetch(`${baseUrl}/emby/Persons?` + new URLSearchParams({ api_key: apiKey, searchTerm: searchQuery, Limit: 1 }));
            const personData = await personResponse.json();

            // 如果找不到演员，显示临时提示后直接返回
            if (!personData.Items || personData.Items.length === 0) {
                button.textContent = '未找到演员';
                button.classList.remove('loading');
                button.disabled = false;
                setTimeout(() => {
                    button.textContent = originalButtonText;
                }, 2000);
                return;
            }

            const personId = personData.Items[0].Id;
            const movieResponse = await fetch(`${baseUrl}/emby/Users/${userId}/Items?` + new URLSearchParams({ api_key: apiKey, PersonIds: personId, IncludeItemTypes: 'Movie', Recursive: true, Fields: 'Name,ProviderIds,ImageTags,Id,PremiereDate', Limit: 100, SortBy: 'PremiereDate', SortOrder: 'Descending' }));
            const movieData = await movieResponse.json();
            button.classList.remove('loading');
            button.disabled = false;

            let outputInfo = `<div style="font-size: 16px; margin-bottom: 12px; color: #fff; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 8px;">${actorName}<span style="font-size: 13px; color: #aaa; font-weight: normal;">(共 ${movieData.Items?.length || 0} 部作品)</span></div>`;
            if (movieData.Items && movieData.Items.length > 0) {
                outputInfo += '<div style="max-height: 400px; overflow-y: auto; padding-right: 10px;">';
                movieData.Items.forEach(item => {
                    const imageUrl = item.ImageTags?.Primary ? `${baseUrl}/emby/Items/${item.Id}/Images/Primary?tag=${item.ImageTags.Primary}&api_key=${apiKey}` : 'https://via.placeholder.com/70x100.png?text=N/A';
                    const premiereDate = item.PremiereDate ? new Date(item.PremiereDate).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '未知日期';
                    outputInfo += `<div style="margin-bottom: 15px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; display: flex; gap: 12px; align-items: flex-start;"><img src="${imageUrl}" alt="${item.Name}" style="width: 70px; height: 100px; object-fit: cover; border-radius: 3px; flex-shrink: 0;"><div style="flex-grow: 1; min-width: 0;"><div style="font-size: 13px; margin-bottom: 4px; color: #fff; line-height: 1.4; word-wrap: break-word; word-break: break-all;">${item.Name}</div><div style="color: #aaa; font-size: 11px; margin-bottom: 4px;">${premiereDate}</div><a href="${baseUrl}/web/index.html#!/item?id=${item.Id}&serverId=${serverId}" target="_blank" class="emby-open-button" style="display: inline-block; padding: 3px 8px; font-size: 11px; margin-top: 5px;">打开</a></div></div>`;
                });
                outputInfo += '</div>';
            } else {
                outputInfo += '<p style="color: #aaa;">未找到该演员的相关影片。</p>';
            }
            showResultTooltip(button, `<div style="width: 320px;">${outputInfo}</div>`);
        } catch (error) {
            button.classList.remove('loading');
            button.disabled = false;
            showResultTooltip(button, `查询演员作品失败: ${error.message || '未知错误'}`);
            console.error('Emby actor movies check error:', error);
        }
    }

    function addEmbyCheckButton() {
        const titleElement = document.querySelector('h3');
        if (titleElement && !titleElement.dataset.embyButtonProcessed) {
            const movieCodeMatch = titleElement.textContent.match(/^([A-Z]+-\d+)/);
            const movieCode = movieCodeMatch ? movieCodeMatch[0] : null;
            if (movieCode) {
                if (!titleElement.nextElementSibling || !titleElement.nextElementSibling.classList.contains('emby-check-button-container')) {
                    const buttonContainer = createEmbyCheckButton(movieCode);
                    titleElement.parentNode.insertBefore(buttonContainer, titleElement.nextSibling);
                }
                if (!document.querySelector('.sht-button') && !titleElement.dataset.shtButtonAdded) {
                    const shtButton = document.createElement('button');
                    shtButton.className = 'sht-button';
                    shtButton.textContent = '跳转色花堂';
                    const embyContainer = titleElement.nextElementSibling;
                    if (embyContainer && embyContainer.classList.contains('emby-check-button-container')) {
                        const updateShtButtonPosition = () => {
                            if (document.body.contains(embyContainer) && document.body.contains(shtButton)) {
                                const containerRect = embyContainer.getBoundingClientRect();
                                shtButton.style.top = `${containerRect.top + window.scrollY}px`;
                            } else {
                                window.removeEventListener('scroll', updateShtButtonPosition);
                                if (document.body.contains(shtButton)) shtButton.remove();
                            }
                        };
                        updateShtButtonPosition();
                        shtButton.addEventListener('click', () => { window.open(`http://www.want7up.online:1234/${movieCode}`, '_blank'); });
                        document.body.appendChild(shtButton);
                        window.addEventListener('scroll', updateShtButtonPosition, { passive: true });
                        titleElement.dataset.shtButtonAdded = 'true';
                    }
                }
            }
            titleElement.dataset.embyButtonProcessed = 'true';
        }
    }

    function addCopyButtons() {
        document.querySelectorAll('.info > p > span.genre > a[href*="/star/"]').forEach(a => {
            if (a.dataset.actorButtonsAdded) return;
            const name = a.textContent.trim();
            let lastButton = a;
            if (!a.nextElementSibling || !a.nextElementSibling.classList.contains('copy-button')) {
                const copyButton = createCopyButton(name);
                a.parentNode.insertBefore(copyButton, lastButton.nextSibling);
                lastButton = copyButton;
            } else {
                lastButton = a.nextElementSibling;
            }
            if (!lastButton.nextElementSibling || !lastButton.nextElementSibling.classList.contains('actor-check-button')) {
                const checkActorButton = document.createElement('button');
                checkActorButton.textContent = '查找演员';
                checkActorButton.className = 'emby-check-button actor-check-button';
                checkActorButton.onclick = async function(e) { e.preventDefault(); e.stopPropagation(); await checkEmbyActorMovies(name, this); };
                a.parentNode.insertBefore(checkActorButton, lastButton.nextSibling);
            }
            a.dataset.actorButtonsAdded = 'true';
        });
    }

    async function checkMovieInEmby(movieCode) {
        if (!baseUrl || !apiKey || !userId) return false;
        try {
            const response = await fetch(`${baseUrl}/emby/Users/${userId}/Items?` + new URLSearchParams({ api_key: apiKey, searchTerm: movieCode, IncludeItemTypes: 'Movie', Recursive: true, Fields: 'Name,ProviderIds', Limit: 1 }));
            if (!response.ok) {
                console.error(`Emby API error for ${movieCode}: ${response.status} ${response.statusText}`);
                return false;
            }
            const data = await response.json();
            return data.Items?.some(item => item.Name.includes(movieCode) || (item.ProviderIds && Object.values(item.ProviderIds).some(id => String(id).includes(movieCode)))) || false;
        } catch (error) {
            console.error(`Error checking movie ${movieCode} in Emby:`, error);
            return false;
        }
    }

    async function checkGridItems() {
        const items = document.querySelectorAll('.item:not([data-emby-checked="true"])');
        if (items.length === 0) return;
        items.forEach(item => item.dataset.embyChecked = 'pending');
        await Promise.all(Array.from(items).map(async item => {
            const movieBox = item.querySelector('a.movie-box');
            if (!movieBox) {
                item.dataset.embyChecked = 'true';
                return;
            }
            const href = movieBox.getAttribute('href');
            const movieCodeMatch = href ? href.match(/([A-Z]+-\d+)/) : null;
            const movieCode = movieCodeMatch ? movieCodeMatch[1] : null;
            if (movieCode) {
                const exists = await checkMovieInEmby(movieCode);
                item.dataset.existsInEmby = exists.toString();
            }
            item.dataset.embyChecked = 'true';
        }));
        if (showExistsHighlight) updateHighlightDisplay();
    }

    function toggleExistsHighlight() {
        showExistsHighlight = !showExistsHighlight;
        GM_setValue('show_exists_highlight', showExistsHighlight);
    }

    function updateHighlightDisplay() {
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            if (showExistsHighlight && item.dataset.existsInEmby === 'true') {
                item.classList.add('exists-in-emby');
            } else {
                item.classList.remove('exists-in-emby');
            }
        });
    }

    function highlight4KContent() {
        const table = document.querySelector('#nong-table-new');
        if (!table) return;
        const cells = table.getElementsByTagName('td');
        for (const cell of cells) {
            if (cell.textContent.toLowerCase().includes('4k')) {
                if (!cell.classList.contains('flash-4k')) {
                    cell.classList.add('flash-4k');
                }
            }
        }
    }

    function updateFloatingButtonState(button, isActive, shortText, featureName) {
        button.className = `${button.classList[0]} ${isActive ? 'active' : 'inactive'}`;
        button.innerHTML = `<span class="short-text">${shortText}</span><span class="full-text">${isActive ? '已开启' : '已关闭'}${featureName}</span>`;
    }

    function createFloatingButton() {
        if (!document.querySelector('.item')) return null;
        let button = document.querySelector('.floating-subtitle-filter');
        if (button) button.remove();
        button = document.createElement('button');
        button.className = 'floating-subtitle-filter';
        document.body.appendChild(button);
        updateFloatingButtonState(button, showSubtitleOnly, '字', '只显示字幕');
        button.addEventListener('click', () => {
            toggleSubtitleOnly();
            updateFloatingButtonState(button, showSubtitleOnly, '字', '只显示字幕');
            filterSubtitleItems();
        });
    }

    function createHighlightButton() {
        if (!document.querySelector('.item')) return null;
        let button = document.querySelector('.floating-highlight-filter');
        if (button) button.remove();
        button = document.createElement('button');
        button.className = 'floating-highlight-filter';
        document.body.appendChild(button);
        updateFloatingButtonState(button, showExistsHighlight, '库', '库存高亮');
        button.addEventListener('click', () => {
            toggleExistsHighlight();
            updateFloatingButtonState(button, showExistsHighlight, '库', '库存高亮');
            updateHighlightDisplay();
        });
    }

    function createWatermark() {
        const container = document.createElement('div');
        container.className = 'watermark-container';
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                const text = document.createElement('div');
                text.className = 'watermark-text';
                text.textContent = '4K';
                text.style.left = `${i * 150}px`;
                text.style.top = `${j * 150}px`;
                container.appendChild(text);
            }
        }
        return container;
    }

    function setAiTranslateInfo() {
        const dialogOverlay = document.createElement('div');
        dialogOverlay.style.position = 'fixed';
        dialogOverlay.style.top = '0';
        dialogOverlay.style.left = '0';
        dialogOverlay.style.width = '100%';
        dialogOverlay.style.height = '100%';
        dialogOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        dialogOverlay.style.zIndex = '10001';
        dialogOverlay.style.display = 'flex';
        dialogOverlay.style.justifyContent = 'center';
        dialogOverlay.style.alignItems = 'center';
        const dialog = document.createElement('div');
        dialog.style.backgroundColor = '#fff';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '8px';
        dialog.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        dialog.style.width = '500px';
        dialog.style.maxHeight = '80vh';
        dialog.style.overflowY = 'auto';

        dialog.innerHTML = `
            <h2>设置 AI 翻译</h2>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">
                    <input type="checkbox" id="aiEnabled" ${aiTranslateEnabled ? 'checked' : ''} style="margin-right: 8px;">
                    启用 AI 自动翻译
                </label>
                <small style="color: #666; font-size: 12px;">开启后，页面加载时会自动翻译日语标题</small>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">AI 翻译 API URL:</label>
                <input type="text" id="aiApiUrl" value="${aiApiUrl}" placeholder="例如: https://api.openai.com/v1 或本地服务地址" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;"/>
                <small style="color: #666; font-size: 12px;">支持 OpenAI API 或兼容的本地AI服务</small>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">AI API Key:</label>
                <input type="password" id="aiApiKey" value="${aiApiKey}" placeholder="在AI服务中获取API密钥" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;"/>
                <small style="color: #666; font-size: 12px;">OpenAI 或其他AI服务的API密钥</small>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">AI 模型:</label>
                <input type="text" id="aiModel" value="${aiModel}" placeholder="例如: gpt-3.5-turbo, claude-3-5-sonnet-20241022, qwen-plus 等" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;"/>
                <small style="color: #666; font-size: 12px;">请输入要使用的AI模型名称<br/>OpenAI: gpt-3.5-turbo, gpt-4, gpt-4o<br/>Claude: claude-3-5-sonnet-20241022, claude-3-haiku-20240307<br/>其他: qwen-plus, qwen-turbo</small>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">AI 提示词:</label>
                <textarea id="aiPrompt" rows="3" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">${aiPrompt}</textarea>
                <small style="color: #666; font-size: 12px;">自定义AI翻译的提示词，可以调整翻译风格和要求</small>
            </div>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin-bottom: 15px; border-left: 4px solid #28a745;">
                <h4 style="margin-top: 0; color: #28a745;">常见API配置示例：</h4>
                <div style="font-size: 12px; line-height: 1.4;">
                    <p style="margin: 5px 0;"><strong>OpenAI官方：</strong></p>
                    <p style="margin: 2px 0 8px 15px; font-family: monospace; background: #fff; padding: 3px 6px; border-radius: 3px;">URL: https://api.openai.com/v1<br/>模型: gpt-3.5-turbo / gpt-4</p>

                    <p style="margin: 5px 0;"><strong>Claude/Anthropic官方：</strong></p>
                    <p style="margin: 2px 0 8px 15px; font-family: monospace; background: #fff; padding: 3px 6px; border-radius: 3px;">URL: https://api.anthropic.com/v1<br/>模型: claude-3-5-sonnet-20241022 / claude-3-haiku-20240307</p>

                    <p style="margin: 5px 0;"><strong>AiHubMix（Claude代理）：</strong></p>
                    <p style="margin: 2px 0 8px 15px; font-family: monospace; background: #fff; padding: 3px 6px; border-radius: 3px;">URL: https://aihubmix.com/v1<br/>模型: claude-3-5-sonnet-20241022<br/>认证: 使用x-api-key方式</p>

                    <p style="margin: 5px 0;"><strong>Azure OpenAI：</strong></p>
                    <p style="margin: 2px 0 8px 15px; font-family: monospace; background: #fff; padding: 3px 6px; border-radius: 3px;">URL: https://your-resource.openai.azure.com/openai/deployments/your-deployment/chat/completions?api-version=2023-12-01-preview</p>

                    <p style="margin: 5px 0;"><strong>阿里云通义千问：</strong></p>
                    <p style="margin: 2px 0 8px 15px; font-family: monospace; background: #fff; padding: 3px 6px; border-radius: 3px;">URL: https://dashscope.aliyuncs.com/compatible-mode/v1<br/>模型: qwen-plus / qwen-turbo</p>

                    <p style="margin: 5px 0;"><strong>本地API（如Ollama）：</strong></p>
                    <p style="margin: 2px 0 0px 15px; font-family: monospace; background: #fff; padding: 3px 6px; border-radius: 3px;">URL: http://localhost:11434/v1<br/>模型: llama2 / qwen2 等</p>
                </div>
            </div>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin-bottom: 20px; border-left: 4px solid #007bff;">
                <h4 style="margin-top: 0; color: #007bff;">功能说明：</h4>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.5;">
                    <li><strong>自动翻译：</strong>开启后页面加载时自动翻译标题</li>
                    <li><strong>手动翻译：</strong>点击"翻译此标题"按钮手动翻译</li>
                    <li><strong>翻译缓存：</strong>已翻译的标题会保存到本地，下次访问直接显示</li>
                    <li><strong>双语显示：</strong>翻译后会同时显示原文和译文</li>
                    <li><strong>智能识别：</strong>自动检测OpenAI格式或Claude格式API，使用对应的认证方式</li>
                </ul>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #856404;"><strong>提示：</strong>脚本会根据URL自动判断API类型（OpenAI或Claude），配置完成后建议先点击"测试连接"验证配置是否正确</p>
            </div>

            <div style="text-align: right;">
                <button id="testTranslation" style="margin-right: 10px; padding: 10px 16px; background-color: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer;">测试连接</button>
                <button id="saveAiSettings" style="margin-right: 10px; padding: 10px 16px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">保存设置</button>
                <button id="cancelAiSettings" style="padding: 10px 16px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">取消</button>
            </div>
        `;

        dialogOverlay.appendChild(dialog);
        document.body.appendChild(dialogOverlay);

        // 测试连接按钮事件
        dialog.querySelector('#testTranslation').addEventListener('click', async () => {
            const testApiUrl = dialog.querySelector('#aiApiUrl').value.trim();
            const testApiKey = dialog.querySelector('#aiApiKey').value.trim();
            const testModel = dialog.querySelector('#aiModel').value.trim();

            if (!testApiUrl || !testApiKey || !testModel) {
                alert('请先填写完整的API信息');
                return;
            }

            const button = dialog.querySelector('#testTranslation');
            const originalText = button.textContent;
            button.textContent = '测试中...';
            button.disabled = true;

            // 确保URL格式正确
            let finalUrl = testApiUrl;
            if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
                finalUrl = 'https://' + finalUrl;
            }

            const apiType = detectApiType(finalUrl);
            let requestHeaders = {
                'Content-Type': 'application/json'
            };
            let requestBody = {};

            if (apiType === 'anthropic') {
                // Claude/Anthropic API格式
                if (!finalUrl.endsWith('/messages') && !finalUrl.endsWith('/v1/messages')) {
                    if (finalUrl.endsWith('/')) {
                        finalUrl += 'v1/messages';
                    } else if (finalUrl.endsWith('/v1')) {
                        finalUrl += '/messages';
                    } else {
                        finalUrl += '/v1/messages';
                    }
                }

                requestHeaders['x-api-key'] = testApiKey;
                requestHeaders['anthropic-version'] = '2023-06-01';

                requestBody = {
                    model: testModel,
                    max_tokens: 50,
                    messages: [
                        {
                            role: 'user',
                            content: '请回复"测试成功"'
                        }
                    ]
                };
            } else {
                // OpenAI API格式
                if (!finalUrl.endsWith('/chat/completions') && !finalUrl.endsWith('/v1/chat/completions')) {
                    if (finalUrl.endsWith('/')) {
                        finalUrl += 'chat/completions';
                    } else if (finalUrl.endsWith('/v1')) {
                        finalUrl += '/chat/completions';
                    } else {
                        finalUrl += '/chat/completions';
                    }
                }

                requestHeaders['Authorization'] = `Bearer ${testApiKey}`;

                requestBody = {
                    model: testModel,
                    messages: [
                        {
                            role: 'user',
                            content: '请回复"测试成功"'
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 50
                };
            }

            console.log('测试API URL:', finalUrl);
            console.log('API类型:', apiType);
            console.log('请求体:', requestBody);

            GM_xmlhttpRequest({
                method: 'POST',
                url: finalUrl,
                headers: requestHeaders,
                data: JSON.stringify(requestBody),
                timeout: 15000, // 15秒超时
                onload: function(response) {
                    try {
                        console.log('响应状态:', response.status, response.statusText);
                        console.log('响应内容:', response.responseText);

                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const data = JSON.parse(response.responseText);
                                let replyContent = '';

                                if (apiType === 'anthropic') {
                                    // Claude响应格式
                                    if (data.content && data.content.length > 0 && data.content[0].text) {
                                        replyContent = data.content[0].text;
                                        alert(`连接测试成功！\n\nAPI类型: Claude/Anthropic\nAI 回复: ${replyContent}\n\n使用的模型: ${testModel}\n\nURL: ${finalUrl}`);
                                    } else if (data.error) {
                                        alert(`Claude API 返回错误:\n${data.error.message || JSON.stringify(data.error)}\n\n请检查:\n1. 模型名称是否正确\n2. x-api-key是否有效\n3. 账户余额是否充足`);
                                    } else {
                                        alert(`Claude API连接成功但响应格式异常:\n${JSON.stringify(data, null, 2)}\n\n这可能表示API版本不兼容`);
                                    }
                                } else {
                                    // OpenAI响应格式
                                    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
                                        replyContent = data.choices[0].message.content;
                                        alert(`连接测试成功！\n\nAPI类型: OpenAI兼容\nAI 回复: ${replyContent}\n\n使用的模型: ${testModel}\n\nURL: ${finalUrl}`);
                                    } else if (data.error) {
                                        alert(`OpenAI API 返回错误:\n${data.error.message || JSON.stringify(data.error)}\n\n请检查:\n1. 模型名称是否正确\n2. API Key权限是否足够\n3. 账户余额是否充足`);
                                    } else {
                                        alert(`OpenAI API连接成功但响应格式异常:\n${JSON.stringify(data, null, 2)}\n\n这可能表示API版本不兼容`);
                                    }
                                }
                            } catch (jsonError) {
                                alert(`响应不是有效的JSON格式:\n\n服务器响应: ${response.responseText.substring(0, 500)}...\n\n这可能表示:\n1. API URL不正确\n2. 服务器返回了错误页面\n3. API服务配置有问题`);
                            }
                        } else {
                            let errorMessage = `连接失败:\n状态码: ${response.status}\n\n`;

                            // 尝试解析错误响应
                            try {
                                const errorData = JSON.parse(response.responseText);
                                if (errorData.error) {
                                    errorMessage += `错误信息: ${errorData.error.message || JSON.stringify(errorData.error)}`;

                                    // 针对常见错误提供解决建议
                                    if (errorData.error.code === 'invalid_api_key') {
                                        errorMessage += '\n\n建议: API Key无效，请检查API Key是否正确';
                                    } else if (errorData.error.code === 'insufficient_quota') {
                                        errorMessage += '\n\n建议: 账户余额不足，请充值后重试';
                                    } else if (errorData.error.code === 'model_not_found') {
                                        errorMessage += '\n\n建议: 模型名称不存在，请检查模型名称是否正确';
                                    }
                                } else {
                                    errorMessage += `服务器响应: ${JSON.stringify(errorData, null, 2)}`;
                                }
                            } catch {
                                errorMessage += `服务器响应: ${response.responseText.substring(0, 300)}`;
                                if (response.responseText.length > 300) {
                                    errorMessage += '...';
                                }
                            }

                            errorMessage += `\n\n测试的URL: ${finalUrl}`;
                            errorMessage += `\n\n通用解决方案:\n1. 检查API URL是否正确\n2. 检查API Key是否有效\n3. 检查模型名称是否正确\n4. 确认API服务是否正常运行`;

                            alert(errorMessage);
                        }
                    } catch (error) {
                        alert(`处理响应时出错: ${error.message}\n\n原始响应: ${response.responseText}`);
                    } finally {
                        button.textContent = originalText;
                        button.disabled = false;
                    }
                },
                onerror: function(error) {
                    let errorMessage = `网络请求失败: ${error.error || '未知错误'}\n\n`;
                    errorMessage += `这通常表示:\n1. 网络连接问题\n2. API服务器无法访问\n3. URL格式错误\n4. 防火墙阻止了连接`;
                    errorMessage += `\n\n测试的URL: ${finalUrl}`;

                    alert(errorMessage);
                    console.error('测试连接网络错误:', error);

                    button.textContent = originalText;
                    button.disabled = false;
                },
                ontimeout: function() {
                    alert(`连接超时\n\n可能原因:\n1. 网络连接缓慢\n2. API服务器响应缓慢\n3. URL不正确\n\n测试的URL: ${finalUrl}`);

                    button.textContent = originalText;
                    button.disabled = false;
                }
            });
        });

        dialog.querySelector('#saveAiSettings').addEventListener('click', () => {
            const newEnabled = dialog.querySelector('#aiEnabled').checked;
            const newApiUrl = dialog.querySelector('#aiApiUrl').value.trim();
            const newApiKey = dialog.querySelector('#aiApiKey').value.trim();
            const newModel = dialog.querySelector('#aiModel').value.trim();
            const newPrompt = dialog.querySelector('#aiPrompt').value.trim();

            // 如果要启用翻译功能，则需要完整配置
            if (newEnabled && (!newApiUrl || !newApiKey || !newModel || !newPrompt)) {
                const missingFields = [];
                if (!newApiUrl) missingFields.push('API URL');
                if (!newApiKey) missingFields.push('API Key');
                if (!newModel) missingFields.push('AI 模型');
                if (!newPrompt) missingFields.push('AI 提示词');

                alert(`要启用AI翻译，请完整填写以下信息：\n${missingFields.join('、')}`);
                return;
            }

            // 确保URL格式正确
            let finalUrl = newApiUrl;
            if (finalUrl && !finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
                finalUrl = 'https://' + finalUrl;
            }

            // 保存设置
            aiTranslateEnabled = newEnabled;
            aiApiUrl = finalUrl;
            aiApiKey = newApiKey;
            aiModel = newModel;
            aiPrompt = newPrompt;

            GM_setValue('ai_translate_enabled', aiTranslateEnabled);
            GM_setValue('ai_api_url', aiApiUrl);
            GM_setValue('ai_api_key', aiApiKey);
            GM_setValue('ai_model', aiModel);
            GM_setValue('ai_prompt', aiPrompt);

            alert('AI 翻译设置已保存！');
            document.body.removeChild(dialogOverlay);

            // 更新页面上的按钮状态
            const toggleButton = document.querySelector('.ai-translate-button');
            if (toggleButton && toggleButton.textContent.includes('自动翻译')) {
                toggleButton.textContent = aiTranslateEnabled ? '关闭自动翻译' : '开启自动翻译';
            }

            // 如果开启了翻译且当前页面有标题，立即翻译
            if (aiTranslateEnabled) {
                translateCurrentTitle();
            }
        });

        dialog.querySelector('#cancelAiSettings').addEventListener('click', () => {
            document.body.removeChild(dialogOverlay);
        });
    }

    // 检测API类型
    function detectApiType(url) {
        if (url.includes('/messages') || url.includes('anthropic') || url.includes('claude')) {
            return 'anthropic';
        }
        return 'openai';
    }

    // AI翻译功能函数
    async function translateTitle(titleText) {
        if (!aiApiUrl || !aiApiKey || !aiModel || !aiPrompt) {
            throw new Error('AI翻译配置不完整，请先完成配置');
        }

        return new Promise((resolve, reject) => {
            // 确保URL格式正确
            let finalUrl = aiApiUrl;
            if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
                finalUrl = 'https://' + finalUrl;
            }

            const apiType = detectApiType(finalUrl);
            let requestHeaders = {
                'Content-Type': 'application/json'
            };
            let requestBody = {};

            if (apiType === 'anthropic') {
                // Claude/Anthropic API格式
                if (!finalUrl.endsWith('/messages') && !finalUrl.endsWith('/v1/messages')) {
                    if (finalUrl.endsWith('/')) {
                        finalUrl += 'v1/messages';
                    } else if (finalUrl.endsWith('/v1')) {
                        finalUrl += '/messages';
                    } else {
                        finalUrl += '/v1/messages';
                    }
                }

                requestHeaders['x-api-key'] = aiApiKey;
                requestHeaders['anthropic-version'] = '2023-06-01';

                requestBody = {
                    model: aiModel,
                    max_tokens: 500,
                    messages: [
                        {
                            role: 'user',
                            content: `${aiPrompt}\n\n${titleText}`
                        }
                    ]
                };
            } else {
                // OpenAI API格式
                if (!finalUrl.endsWith('/chat/completions') && !finalUrl.endsWith('/v1/chat/completions')) {
                    if (finalUrl.endsWith('/')) {
                        finalUrl += 'chat/completions';
                    } else if (finalUrl.endsWith('/v1')) {
                        finalUrl += '/chat/completions';
                    } else {
                        finalUrl += '/chat/completions';
                    }
                }

                requestHeaders['Authorization'] = `Bearer ${aiApiKey}`;

                requestBody = {
                    model: aiModel,
                    messages: [
                        {
                            role: 'user',
                            content: `${aiPrompt}\n\n${titleText}`
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 500
                };
            }

            GM_xmlhttpRequest({
                method: 'POST',
                url: finalUrl,
                headers: requestHeaders,
                data: JSON.stringify(requestBody),
                timeout: 30000, // 30秒超时
                onload: function(response) {
                    try {
                        if (response.status >= 200 && response.status < 300) {
                            const data = JSON.parse(response.responseText);

                            let content = '';
                            if (apiType === 'anthropic') {
                                // Claude响应格式
                                if (data.content && data.content.length > 0 && data.content[0].text) {
                                    content = data.content[0].text.trim();
                                } else if (data.error) {
                                    reject(new Error(`Claude API错误: ${data.error.message || JSON.stringify(data.error)}`));
                                    return;
                                }
                            } else {
                                // OpenAI响应格式
                                if (data.choices && data.choices.length > 0 && data.choices[0].message) {
                                    content = data.choices[0].message.content.trim();
                                } else if (data.error) {
                                    reject(new Error(`OpenAI API错误: ${data.error.message || JSON.stringify(data.error)}`));
                                    return;
                                }
                            }

                            if (content) {
                                resolve(content);
                            } else {
                                reject(new Error(`AI翻译响应格式错误: ${JSON.stringify(data)}`));
                            }
                        } else {
                            let errorMessage = `HTTP错误 ${response.status}`;
                            try {
                                const errorData = JSON.parse(response.responseText);
                                if (errorData.error) {
                                    errorMessage += `: ${errorData.error.message || JSON.stringify(errorData.error)}`;
                                }
                            } catch {
                                errorMessage += `: ${response.responseText}`;
                            }
                            reject(new Error(errorMessage));
                        }
                    } catch (parseError) {
                        reject(new Error(`解析响应失败: ${parseError.message}\n响应内容: ${response.responseText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`网络请求失败: ${error.error || '未知错误'}`));
                },
                ontimeout: function() {
                    reject(new Error('请求超时，请检查网络连接或API服务状态'));
                }
            });
        });
    }

    function addAiTranslateButton() {
        const titleElement = document.querySelector('h3');
        if (titleElement && !titleElement.dataset.aiTranslateButtonProcessed) {
            // 创建容器来放置翻译相关按钮
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'margin: 10px 0; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;';

            // 翻译开关按钮
            const toggleButton = document.createElement('button');
            toggleButton.className = 'ai-translate-button';
            toggleButton.textContent = aiTranslateEnabled ? '关闭自动翻译' : '开启自动翻译';
            toggleButton.onclick = () => {
                aiTranslateEnabled = !aiTranslateEnabled;
                GM_setValue('ai_translate_enabled', aiTranslateEnabled);
                toggleButton.textContent = aiTranslateEnabled ? '关闭自动翻译' : '开启自动翻译';

                if (aiTranslateEnabled) {
                    // 开启时立即翻译当前标题
                    translateCurrentTitle();
                }
            };

            // 手动翻译按钮
            const translateButton = document.createElement('button');
            translateButton.className = 'ai-translate-button';
            translateButton.textContent = '翻译此标题';
            translateButton.onclick = async () => {
                await translateCurrentTitle();
            };

            buttonContainer.appendChild(toggleButton);
            buttonContainer.appendChild(translateButton);
            titleElement.parentNode.insertBefore(buttonContainer, titleElement.nextSibling);

            titleElement.dataset.aiTranslateButtonProcessed = 'true';

            // 如果自动翻译已开启且标题未翻译，则自动翻译
            if (aiTranslateEnabled && !titleElement.classList.contains('title-translated')) {
                translateCurrentTitle();
            }
        }
    }

    async function translateCurrentTitle() {
        const titleElement = document.querySelector('h3');
        if (!titleElement) return;

        // 检查是否已经翻译过
        if (titleElement.classList.contains('title-translated')) {
            return;
        }

        const originalTitle = titleElement.textContent.trim();

        // 检查是否包含日语字符（简单检测）
        const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(originalTitle);
        if (!hasJapanese) {
            console.log('标题似乎不包含日语字符，跳过翻译');
            return;
        }

        // 获取翻译按钮用于显示状态
        const translateButton = document.querySelector('.ai-translate-button[onclick*="translateCurrentTitle"]');
        const originalButtonText = translateButton ? translateButton.textContent : '';

        try {
            if (translateButton) {
                translateButton.classList.add('loading');
                translateButton.textContent = '翻译中';
                translateButton.disabled = true;
            }

            const translatedText = await translateTitle(originalTitle);

            if (translatedText && translatedText !== originalTitle) {
                // 创建一个包含原标题和翻译的结构
                const titleContainer = document.createElement('div');
                titleContainer.innerHTML = `
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">${originalTitle}</div>
                    <div style="font-weight: bold;">${translatedText}</div>
                `;

                // 替换原标题
                titleElement.innerHTML = '';
                titleElement.appendChild(titleContainer);
                titleElement.classList.add('title-translated');

                // 保存翻译结果到本地存储（可选）
                GM_setValue(`translation_${window.location.pathname}`, {
                    original: originalTitle,
                    translated: translatedText,
                    timestamp: Date.now()
                });

                console.log('标题翻译完成:', translatedText);
            }
        } catch (error) {
            console.error('翻译失败:', error);

            // 显示错误信息
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = 'background-color: #f8d7da; color: #721c24; padding: 8px; border-radius: 4px; margin: 10px 0; font-size: 14px;';
            errorDiv.textContent = `翻译失败: ${error.message}`;
            titleElement.parentNode.insertBefore(errorDiv, titleElement.nextSibling);

            // 3秒后自动移除错误信息
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 3000);
        } finally {
            if (translateButton) {
                translateButton.classList.remove('loading');
                translateButton.textContent = originalButtonText || '翻译此标题';
                translateButton.disabled = false;
            }
        }
    }

    // 页面加载时检查是否有保存的翻译
    function loadSavedTranslation() {
        const titleElement = document.querySelector('h3');
        if (!titleElement || titleElement.classList.contains('title-translated')) return;

        const savedTranslation = GM_getValue(`translation_${window.location.pathname}`);
        if (savedTranslation && savedTranslation.translated) {
            const titleContainer = document.createElement('div');
            titleContainer.innerHTML = `
                <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">${savedTranslation.original}</div>
                <div style="font-weight: bold;">${savedTranslation.translated}</div>
            `;

            titleElement.innerHTML = '';
            titleElement.appendChild(titleContainer);
            titleElement.classList.add('title-translated');
        }
    }

})();
