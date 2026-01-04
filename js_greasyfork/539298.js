// ==UserScript==
// @name         Civitai Image Downloader and Metadata Extractor
// @name:zh-CN   Civitai 图像下载及元数据提取器
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  FINAL VERSION. Reliably works with Civitai's SPA navigation. No more refresh needed.
// @description:zh-CN 新增下载记录功能，防止重复下载。
// @author       Your Name (with major enhancements)
// @match        https://civitai.com/*
// @icon         https://civitai.com/favicon-32x32.png
// @grant        GM_download
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539298/Civitai%20Image%20Downloader%20and%20Metadata%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/539298/Civitai%20Image%20Downloader%20and%20Metadata%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 & 常量 ---
    const AUTO_DOWNLOAD_KEY = 'civitaiDownloader_autoMode';
    const DOWNLOADED_IDS_KEY = 'civitaiDownloader_downloadedIds';

    // --- 添加自定义样式 ---
    GM_addStyle(`
        .civitai-downloader-toggle.active { background-color: #228be6 !important; border-color: #228be6 !important; }
        .civitai-downloader-toggle.downloaded { background-color: #2f9e44 !important; border-color: #2f9e44 !important; }
    `);

    // --- 全局状态变量，用于防止重复初始化 ---
    let lastProcessedUrl = '';

    // ==============================================================================
    // --- 主程序入口，现在由导航事件触发 ---
    // ==============================================================================
    function mainApp() {
        const currentUrl = window.location.href;

        // 检查URL是否是图片页，并且与上次处理的URL不同
        if (currentUrl.includes('/images/') && currentUrl !== lastProcessedUrl) {
            console.log(`Civitai Downloader: Image page detected - ${currentUrl}. Initializing...`);
            lastProcessedUrl = currentUrl; // 标记为正在处理

            // 使用轮询来等待按钮容器加载完毕
            const pollInterval = setInterval(() => {
                const buttonContainer = document.querySelector('svg.tabler-icon-download')?.closest('button')?.parentElement;
                // 确保容器存在且我们的按钮还未注入
                if (buttonContainer && !buttonContainer.querySelector('.civitai-downloader-toggle')) {
                    clearInterval(pollInterval);
                    runScriptOnPage(buttonContainer);
                }
            }, 500);

            // 15秒后停止轮询，以防页面结构变化导致死循环
            setTimeout(() => clearInterval(pollInterval), 15000);
        } else if (!currentUrl.includes('/images/')) {
            // 如果我们导航到了非图片页，重置URL标记，以便下次能重新进入
            lastProcessedUrl = '';
        }
    }

    // ==============================================================================
    // --- 脚本核心逻辑 ---
    // ==============================================================================
    function runScriptOnPage(buttonContainer) {
        const imageId = window.location.pathname.split('/')[2];
        if (!imageId) return;

        const downloadButton = buttonContainer.querySelector('svg.tabler-icon-download')?.closest('button');
        if(!downloadButton) return;

        let isAutoMode = GM_getValue(AUTO_DOWNLOAD_KEY, true);
        const downloadedIds = GM_getValue(DOWNLOADED_IDS_KEY, {});
        const hasBeenDownloaded = !!downloadedIds[imageId];

        const toggleButton = createToggleButton(downloadButton);
        buttonContainer.insertBefore(toggleButton, downloadButton);

        function updateToggleVisual() {
            toggleButton.classList.remove('active', 'downloaded');
            if (hasBeenDownloaded) {
                toggleButton.classList.add('downloaded');
                toggleButton.title = "此页已下载过 (点击原下载按钮可强制重新下载)";
            } else if (isAutoMode) {
                toggleButton.classList.add('active');
                toggleButton.title = "自动下载模式已开启";
            } else {
                toggleButton.title = "自动下载模式已关闭 (点击原下载按钮手动触发)";
            }
        }
        updateToggleVisual();

        toggleButton.addEventListener('click', () => {
            isAutoMode = !isAutoMode;
            GM_setValue(AUTO_DOWNLOAD_KEY, isAutoMode);
            updateToggleVisual();
        });

        downloadButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            startFullDownload(imageId);
        }, true);

        if (isAutoMode && !hasBeenDownloaded) {
            startFullDownload(imageId);
        }
    }


    // ==============================================================================
    // --- 导航事件监听 (最终解决方案) ---
    // ==============================================================================
    // 1. 劫持 history.pushState
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        // 先执行原始的 pushState
        const result = originalPushState.apply(this, args);
        // 然后触发一个自定义事件，并延迟执行我们的主程序
        window.dispatchEvent(new Event('pushstate'));
        setTimeout(mainApp, 500); // 延迟执行以等待DOM更新
        return result;
    };

    // 2. 监听 history.popstate (浏览器前进/后退按钮)
    window.addEventListener('popstate', () => {
        setTimeout(mainApp, 500);
    });

    // 3. 首次加载页面时，也手动运行一次
    setTimeout(mainApp, 1500); // 首次加载延迟稍长，确保所有内容渲染完毕


    // --- 核心下载逻辑和其他辅助函数 (保持不变) ---
    async function startFullDownload(imageId) {console.log("Civitai Downloader: Starting full download process...");try {const metadata = extractAllMetadata();if (!metadata) return;const textContent = formatMetadataAsText(metadata);const txtFilename = `${imageId}.txt`;downloadTextFile(textContent, txtFilename);await downloadImageWhenReady(imageId);markAsDownloaded(imageId);} catch (error) {console.error("Civitai Downloader: An error occurred in the main download function.", error);}}
    function markAsDownloaded(imageId) {const downloadedIds = GM_getValue(DOWNLOADED_IDS_KEY, {});downloadedIds[imageId] = true;GM_setValue(DOWNLOADED_IDS_KEY, downloadedIds);const toggleButton = document.querySelector('.civitai-downloader-toggle');if (toggleButton) {toggleButton.classList.remove('active');toggleButton.classList.add('downloaded');toggleButton.title = "此页已下载过 (点击原下载按钮可强制重新下载)";}}
    function createToggleButton(referenceButton) {const toggleButton = referenceButton.cloneNode(true);toggleButton.classList.add('civitai-downloader-toggle');const svg = toggleButton.querySelector('svg');svg.innerHTML = `<path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path>`;svg.classList.remove('tabler-icon-download');svg.classList.add('tabler-icon-refresh');return toggleButton;}
    function extractAllMetadata() {const metadata = {};metadata.sourceUrl = window.location.href;const prompts = extractPrompts();metadata.positivePrompt = prompts.positive;metadata.negativePrompt = prompts.negative;metadata.resources = extractResources();metadata.details = extractDetails();return metadata;}
    function extractPrompts() {const prompts = { positive: "Not found", negative: "Not found" };let generationDataContainer = null;const allHeaders = document.querySelectorAll('h3.mantine-Title-root');for (const h of allHeaders) {if (h.textContent.trim().toLowerCase() === 'generation data') {generationDataContainer = h.parentElement;break;}}if (!generationDataContainer) {generationDataContainer = document;}const promptElements = generationDataContainer.querySelectorAll('.mantine-1c2skr8');if (promptElements.length > 0) prompts.positive = promptElements[0].textContent.trim();if (promptElements.length > 1) prompts.negative = promptElements[1].textContent.trim();return prompts;}
    function extractResources() {const resources = [];let resourceList = null;const allHeaders = document.querySelectorAll('h3.mantine-Title-root');for (const h of allHeaders) {if (h.textContent.trim().toLowerCase() === 'resources') {const container = h.parentElement;if (container && container.nextElementSibling && container.nextElementSibling.tagName === 'UL') {resourceList = container.nextElementSibling;break;}}}if (!resourceList) {resourceList = document.querySelector('ul.flex.list-none.flex-col');}if (!resourceList) return ["Resource list not found."];resourceList.querySelectorAll('li').forEach(item => {const linkElement = item.querySelector('a[href*="/models/"]');const nameElement = item.querySelector('div.mantine-12h10m4');const versionElement = item.querySelector('div.mantine-nvo449');const typeElement = item.querySelector('div.mantine-qcxgtg span.mantine-Badge-inner');const resource = {};if (nameElement) resource.name = nameElement.textContent.trim();if (linkElement) resource.link = `https://civitai.com${linkElement.getAttribute('href')}`;if (versionElement) resource.version = versionElement.textContent.trim();if (typeElement) resource.type = typeElement.textContent.trim();const weightElement = item.querySelector('div.mantine-j55fvo span.mantine-Badge-inner');if (weightElement) resource.weight = weightElement.textContent.trim();resources.push(resource);});return resources;}
    function extractDetails() {const details = {};const detailsContainer = document.querySelector('div.flex.flex-wrap.gap-2');if (!detailsContainer) return details;const detailBadges = detailsContainer.querySelectorAll(':scope > div.mantine-Badge-root');detailBadges.forEach(badge => {const text = badge.textContent.trim();const parts = text.split(/:(.*)/s);if (parts.length >= 2) {const key = parts[0].trim();const value = parts[1].trim();details[key] = value;}});return details;}
    function formatMetadataAsText(metadata) {let content = "Positive Prompt:\n" + metadata.positivePrompt + "\n\n";content += "Negative Prompt:\n" + metadata.negativePrompt + "\n\n";content += "--- Details ---\n";for (const [key, value] of Object.entries(metadata.details)) {content += `${key}: ${value}\n`;}content += "\n--- Resources ---\n";if (metadata.resources.length > 0 && typeof metadata.resources[0] === 'string') {content += metadata.resources[0] + "\n\n";} else {metadata.resources.forEach(res => {content += `Type: ${res.type || 'N/A'}\n`;content += `Name: ${res.name || 'N/A'}\n`;content += `Version: ${res.version || 'N/A'}\n`;if (res.weight) content += `Weight: ${res.weight}\n`;content += `Link: ${res.link || 'N/A'}\n\n`;});}content += "--- Source ---\n";content += `Image URL: ${metadata.sourceUrl}\n`;return content;}
    function downloadTextFile(textContent, filename) {const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });const dataUrl = URL.createObjectURL(blob);GM_download({url: dataUrl,name: filename,onload: () => {URL.revokeObjectURL(dataUrl);},onerror: (err) => {URL.revokeObjectURL(dataUrl);}});}
    async function downloadImageWhenReady(imageId) {return new Promise((resolve, reject) => {const pollingInterval = 250;const maxWaitTime = 10000;let totalWait = 0;const imageElement = document.querySelector('img.EdgeImage_image__iH4_q');if (!imageElement) {return reject("Image element not found.");}const poller = setInterval(() => {const currentSrc = imageElement.src;if (currentSrc && currentSrc.startsWith('http') && currentSrc.includes('original=true')) {clearInterval(poller);downloadImage(currentSrc, imageId).then(resolve).catch(reject);} else {totalWait += pollingInterval;if (totalWait >= maxWaitTime) {clearInterval(poller);reject("Timed out");}}}, pollingInterval);});}
    function downloadImage(imageUrl, imageId) {return new Promise((resolve, reject) => {try {const urlPath = new URL(imageUrl).pathname;const extension = urlPath.substring(urlPath.lastIndexOf('.'));const newImageFilename = `${imageId}${extension}`;GM_download({url: imageUrl,name: newImageFilename,onload: () => {resolve();},onerror: (err) => {reject(err);}});} catch (e) {reject(e);}});}
})();