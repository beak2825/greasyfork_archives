// ==UserScript==
// @name         JavDB列表页显示是否已看（自用）
// @namespace    http://tampermonkey.net/
// @version      2025.06.27.1002
// @description  使用离线保存已看过的数据，在演员列表页，显示每部影片是否已看
// @author       alonewinds
// @match        https://javdb.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javdb.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/540971/JavDB%E5%88%97%E8%A1%A8%E9%A1%B5%E6%98%BE%E7%A4%BA%E6%98%AF%E5%90%A6%E5%B7%B2%E7%9C%8B%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/540971/JavDB%E5%88%97%E8%A1%A8%E9%A1%B5%E6%98%BE%E7%A4%BA%E6%98%AF%E5%90%A6%E5%B7%B2%E7%9C%8B%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

// 调试开关
const DEBUG = false;
// 性能模式开关 - 设置为 true 可以显示详细的性能信息
const PERFORMANCE_MODE = true;

// 版本
const VERSION = '2025.03.30.0106';
const fadeDuration = 500; // 消息渐变持续时间
const displayDuration = 3000; // 消息显示持续时间
const maxMessages = 3; // 最大显示消息数量
let counter = 0; // 初始化计数器
let lastItemCount = 0; // 存储上一次的电影项目数量

let storedIds = new Set(); // 使用 Set 存储唯一 ID

const styleMap = {
    '我看過這部影片': 'tag is-success is-light',
    '我想看這部影片': 'tag is-info is-light',
    '未看过': 'tag is-gray',
};

// 在这里定义 hideWatchedVideos
let hideWatchedVideos = GM_getValue('hideWatchedVideos', false);
console.log('初始化 hideWatchedVideos:', hideWatchedVideos);

// 在 styleMap 下面添加新的变量
let hideViewedVideos = GM_getValue('hideViewedVideos', false);
console.log('初始化 hideViewedVideos:', hideViewedVideos);

// 在 styleMap 下面添加新的变量
let hideVRVideos = GM_getValue('hideVRVideos', false);
console.log('初始化 hideVRVideos:', hideVRVideos);

const indicatorTexts = ['我看過這部影片', '我想看這部影片'];

const validUrlPatterns = [
    /https:\/\/javdb\.com\/users\/want_watch_videos.*/,
    /https:\/\/javdb\.com\/users\/watched_videos.*/,
    /https:\/\/javdb\.com\/users\/list_detail.*/,
    /https:\/\/javdb\.com\/lists.*/
];

// 消息容器
const messageContainer = document.createElement('div');
messageContainer.style.position = 'fixed';
messageContainer.style.bottom = '20px';
messageContainer.style.right = '20px';
messageContainer.style.zIndex = '9999';
messageContainer.style.pointerEvents = 'none';
messageContainer.style.maxWidth = '500px';
messageContainer.style.display = 'flex';
messageContainer.style.flexDirection = 'column';
document.body.appendChild(messageContainer);

// 渐入效果
function fadeIn(el) {
    el.style.opacity = 0;
    el.style.display = 'block';

    const startTime = performance.now();
    function animate(time) {
        const elapsed = time - startTime;
        el.style.opacity = Math.min((elapsed / fadeDuration), 1);
        if (elapsed < fadeDuration) {
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);
}

// 渐出效果
function fadeOut(el) {
    const startTime = performance.now();
    function animate(time) {
        const elapsed = time - startTime;
        el.style.opacity = 1 - Math.min((elapsed / fadeDuration), 1);
        if (elapsed < fadeDuration) {
            requestAnimationFrame(animate);
        } else {
            el.remove();
        }
    }
    requestAnimationFrame(animate);
}

// 显示信息
function logToScreen(message, bgColor = 'rgba(169, 169, 169, 0.8)', textColor = 'white') {

    const messageBox = document.createElement('div');
    messageBox.style.padding = '10px';
    messageBox.style.borderRadius = '5px';
    messageBox.style.backgroundColor = bgColor;
    messageBox.style.color = textColor;
    messageBox.style.fontSize = '12px';
    messageBox.style.marginBottom = '10px';
    messageBox.style.pointerEvents = 'none';
    messageBox.style.wordWrap = 'break-word';
    messageBox.style.maxWidth = '100%';

    messageBox.innerHTML = message;
    messageContainer.appendChild(messageBox);


    fadeIn(messageBox);


    setTimeout(() => {
        fadeOut(messageBox);
    }, displayDuration);


    if (messageContainer.childElementCount > maxMessages) {
        fadeOut(messageContainer.firstChild);
    }
}
async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}



// 创建调试日志函数
function debugLog(...args) {
    if (DEBUG) {
        console.log(...args);
    }
}

// 添加全局变量声明
let exportButton = null;
let stopButton = null;
let isExporting = false;
let exportState = {
    allowExport: false,
    currentPage: 1,
    maxPage: null
};
let uploadTimeDisplay;
let idCountDisplay;

// 将 updateCountDisplay 函数移到全局作用域
function updateCountDisplay() {
    if (!idCountDisplay) {
        return; // 如果 idCountDisplay 还没有初始化，直接返回
    }
    const watchedCount = storedIds.size;
    const browseHistory = new Set(GM_getValue('videoBrowseHistory', []));
    const browseCount = browseHistory.size;

    idCountDisplay.innerHTML = `
        <div style="margin-bottom: 5px;">已看番号总数: ${watchedCount}</div>
        <div>已浏览番号总数: ${browseCount}</div>
    `;
}

(function () {
    'use strict';
    debugLog('开始初始化面板...');

    let panelVisible = false;
    const circlePosition = { left: -40, top: 60 };
    let lastUploadTime = "";

    // 面板样式优化
    const panel = document.createElement('div');
    debugLog('创建面板元素');
    panel.style.position = 'fixed';
    panel.style.border = 'none';
    panel.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
    panel.style.padding = '20px';
    panel.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    panel.style.maxWidth = '340px';
    panel.style.width = '90vw';
    panel.style.maxHeight = '90vh';
    panel.style.overflowY = 'auto';
    panel.style.overflowX = 'hidden';
    panel.style.borderRadius = '12px';
    panel.style.display = 'none';
    panel.style.zIndex = 10001;
    panel.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

    // 确保面板被添加到文档中
    document.body.appendChild(panel);
    debugLog('面板已添加到文档中');

    // 添加滚动条样式
    panel.style.scrollbarWidth = 'thin'; // Firefox
    panel.style.scrollbarColor = '#ccc transparent'; // Firefox
    // Webkit浏览器的滚动条样式
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        #${panel.id}::-webkit-scrollbar {
            width: 6px;
        }
        #${panel.id}::-webkit-scrollbar-track {
            background: transparent;
        }
        #${panel.id}::-webkit-scrollbar-thumb {
            background-color: #ccc;
            border-radius: 3px;
        }
    `;
    document.head.appendChild(styleSheet);

    // 修改面板位置计算
    function updatePanelPosition(panel, top) {
        debugLog('更新面板位置');
        const windowHeight = window.innerHeight;
        const panelHeight = panel.offsetHeight;
        debugLog('窗口高度:', windowHeight, '面板高度:', panelHeight);

        let finalTop = top;

        if (top + panelHeight > windowHeight - 20) {
            finalTop = Math.max(20, windowHeight - panelHeight - 20);
        }

        finalTop = Math.max(20, finalTop);

        panel.style.top = `${finalTop}px`;
        panel.style.left = '10px';
        debugLog('面板最终位置:', finalTop);
    }

    // 创建标题
    const title = document.createElement('div');
    title.textContent = '番号数据上传与搜索';
    title.style.fontWeight = '600';
    title.style.fontSize = '16px';
    title.style.marginBottom = '15px';
    title.style.color = '#333';
    title.style.borderBottom = '1px solid #eee';
    title.style.paddingBottom = '10px';
    debugLog('创建标题');

    // 帮助符号
    /* const titleHelpIcon = document.createElement('span');
    titleHelpIcon.textContent = 'ℹ️';
    titleHelpIcon.style.cursor = 'pointer';
    titleHelpIcon.style.marginLeft = '10px';
    titleHelpIcon.title = '目前只过滤"看过"，更新脚本数据会被清空';
    title.appendChild(titleHelpIcon);
    */

    // 创建一个容器来包含上传按钮和帮助图标
    const uploadContainer = document.createElement('div');
    uploadContainer.style.cssText = `
        position: relative;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
    `;

    // 创建自定义的文件上传按钮
    const customUploadButton = document.createElement('label');
    customUploadButton.style.cssText = `
        display: inline-flex;
        align-items: center;
        padding: 8px 16px;
        background-color: #4a9eff;
        color: white;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s ease;
        border: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    `;

    // 添加图标
    const uploadIcon = document.createElement('span');
    uploadIcon.innerHTML = '📁'; // 使用 emoji 作为图标
    uploadIcon.style.marginRight = '8px';
    customUploadButton.appendChild(uploadIcon);

    // 添加文本
    const buttonText = document.createElement('span');
    buttonText.textContent = '上传已看番号JSON';
    customUploadButton.appendChild(buttonText);

    // 创建实际的文件输入框但隐藏它
    const uploadButton = document.createElement('input');
    uploadButton.type = 'file';
    uploadButton.accept = '.json';
    uploadButton.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
    `;

    // 添加文件名显示区域
    const fileNameDisplay = document.createElement('span');
    fileNameDisplay.style.cssText = `
        margin-left: 10px;
        color: #666;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
    `;

    // 帮助图标
    const uploadHelpIcon = document.createElement('span');
    uploadHelpIcon.textContent = 'ℹ️';
    uploadHelpIcon.style.cssText = `
        cursor: pointer;
        padding: 4px;
        flex-shrink: 0;
    `;
    uploadHelpIcon.title = '前往"看过"页面进行导出文件';

    // 将所有元素添加到容器中
    customUploadButton.appendChild(uploadButton);
    uploadContainer.appendChild(customUploadButton);
    uploadContainer.appendChild(fileNameDisplay);
    uploadContainer.appendChild(uploadHelpIcon);

    // 添加悬停效果
    customUploadButton.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#3d8ae5';
        this.style.transform = 'translateY(-1px)';
    });

    customUploadButton.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#4a9eff';
        this.style.transform = 'translateY(0)';
    });

    // 更新文件名显示
    uploadButton.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileNameDisplay.textContent = this.files[0].name;
        } else {
            fileNameDisplay.textContent = '';
        }
    });

    // 开关按钮样式优化
    const toggleContainer = document.createElement('div');
    toggleContainer.style.display = 'flex';
    toggleContainer.style.alignItems = 'center';
    toggleContainer.style.gap = '8px';
    toggleContainer.style.marginTop = '10px';
    toggleContainer.style.marginBottom = '15px';

    // 优化按钮样式的函数
    function styleButton(button, isActive) {
        button.style.flex = '1';
        button.style.padding = '8px 12px';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '6px';
        button.style.cursor = 'pointer';
        button.style.transition = 'all 0.3s ease';
        button.style.backgroundColor = isActive ? '#808080' : '#2ed573'; // 修改为：隐藏为灰色(#808080)，显示为绿色
    }

    // 修改开关按钮样式优化和事件处理
    const toggleHideButton = document.createElement('button');
    styleButton(toggleHideButton, hideWatchedVideos);
    toggleHideButton.textContent = hideWatchedVideos ? '当前：隐藏已看的番号' : '当前：显示已看的番号';

    // 帮助符号
    /*const toggleHelpIcon = document.createElement('span');
    toggleHelpIcon.textContent = 'ℹ️';
    toggleHelpIcon.style.cursor = 'pointer';
    toggleHelpIcon.style.padding = '4px';
    toggleHelpIcon.title = '点击切换';
    */

    // 将按钮和帮助符号添加到容器
    toggleContainer.appendChild(toggleHideButton);
    //toggleContainer.appendChild(toggleHelpIcon);

    // 添加按钮悬停效果
    toggleHideButton.addEventListener('mouseover', function () {
        this.style.opacity = '0.9';
    });
    toggleHideButton.addEventListener('mouseout', function () {
        this.style.opacity = '1';
    });

    // 添加开关按钮点击事件
    toggleHideButton.addEventListener('click', function () {
        debugLog('开关按钮被点击');
        hideWatchedVideos = !hideWatchedVideos;
        debugLog('切换 hideWatchedVideos 为:', hideWatchedVideos);

        // 更新按钮文本和颜色
        this.textContent = hideWatchedVideos ? '当前：隐藏已看的番号' : '当前：显示已看的番号';
        styleButton(this, hideWatchedVideos); // 更新按钮样式

        // 保存设置
        GM_setValue('hideWatchedVideos', hideWatchedVideos);

        if (!hideWatchedVideos) {
            // 如果切换到显示模式，自动刷新页面
            debugLog('切换到显示模式，准备刷新页面');
            location.reload();
        } else {
            // 如果切换到隐藏模式，直接处理当前页面
            processLoadedItems();
        }
    });

    // 添加开关按钮到面板
    panel.appendChild(toggleContainer);

    // 在创建 toggleContainer 后添加新的容器和按钮
    const toggleViewedContainer = document.createElement('div');
    toggleViewedContainer.style.display = 'flex';
    toggleViewedContainer.style.alignItems = 'center';
    toggleViewedContainer.style.gap = '8px';
    toggleViewedContainer.style.marginTop = '10px';
    toggleViewedContainer.style.marginBottom = '15px';

    const toggleViewedButton = document.createElement('button');
    styleButton(toggleViewedButton, hideViewedVideos);
    toggleViewedButton.textContent = hideViewedVideos ? '当前：隐藏已浏览的番号' : '当前：显示已浏览的番号';

    /*const toggleViewedHelpIcon = document.createElement('span');
    toggleViewedHelpIcon.textContent = 'ℹ️';
    toggleViewedHelpIcon.style.cursor = 'pointer';
    toggleViewedHelpIcon.style.padding = '4px';
    toggleViewedHelpIcon.title = '点击切换';
    */
    toggleViewedContainer.appendChild(toggleViewedButton);
    //toggleViewedContainer.appendChild(toggleViewedHelpIcon);

    // 添加按钮事件
    toggleViewedButton.addEventListener('click', function() {
        hideViewedVideos = !hideViewedVideos;
        this.textContent = hideViewedVideos ? '当前：隐藏已浏览的番号' : '当前：显示已浏览的番号';
        styleButton(this, hideViewedVideos); // 更新按钮样式

        GM_setValue('hideViewedVideos', hideViewedVideos);

        if (!hideViewedVideos) {
            location.reload();
        } else {
            processLoadedItems();
        }
    });

    // 在 panel.appendChild(toggleContainer) 后添加
    panel.appendChild(toggleViewedContainer);

    // 在面板中添加切换 VR 视频的按钮
    const toggleVRContainer = document.createElement('div');
    toggleVRContainer.style.display = 'flex';
    toggleVRContainer.style.alignItems = 'center';
    toggleVRContainer.style.gap = '8px';
    toggleVRContainer.style.marginTop = '10px';
    toggleVRContainer.style.marginBottom = '15px';

    const toggleVRButton = document.createElement('button');
    styleButton(toggleVRButton, hideVRVideos);
    toggleVRButton.textContent = hideVRVideos ? '当前：隐藏VR番号' : '当前：显示VR番号';

    // 添加按钮点击事件
    toggleVRButton.addEventListener('click', function () {
        hideVRVideos = !hideVRVideos;
        this.textContent = hideVRVideos ? '当前：隐藏VR番号' : '当前：显示VR番号';
        styleButton(this, hideVRVideos); // 更新按钮样式
        GM_setValue('hideVRVideos', hideVRVideos);

        // 切换到显示模式时刷新页面
        if (!hideVRVideos) {
            location.reload();
        } else {
            processLoadedItems(); // 处理当前页面以应用更改
        }
    });

    // 添加到面板
    toggleVRContainer.appendChild(toggleVRButton);
    panel.appendChild(toggleVRContainer);

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.marginTop = '15px';
    buttonContainer.style.marginBottom = '15px';
    debugLog('创建按钮容器');

    // 导出按钮样式优化
    const exportButton = document.createElement('button');
    exportButton.innerHTML = '💾 导出存储番号';  // 添加下载图标
    exportButton.style.cssText = `
        display: inline-flex;
        align-items: center;
        padding: 8px 16px;
        background-color: #4a9eff;
        color: white;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s ease;
        border: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-right: 10px;
    `;

    // 清除按钮样式优化
    const clearButton = document.createElement('button');
    clearButton.innerHTML = '🗑️ 清空存储番号';  // 添加垃圾桶图标
    clearButton.style.cssText = `
        display: inline-flex;
        align-items: center;
        padding: 8px 16px;
        background-color: #ff4a4a;
        color: white;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s ease;
        border: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    `;

    // 定义导出函数
    function exportVideosInfo() {
        exportState.allowExport = false;
        exportState.currentPage = 1;
        exportState.maxPage = null;

        localStorage.setItem('exportState', JSON.stringify(exportState));

        // 从 localStorage 中读取最新的数据，而不是使用全局变量
        const allVideosInfo = JSON.parse(localStorage.getItem('allVideosInfo') || '[]');
        console.log(`exportVideosInfo: 从localStorage读取到 ${allVideosInfo.length} 个视频数据`);

        allVideosInfo.sort((a, b) => a.id.localeCompare(b.id));
        const json = JSON.stringify(allVideosInfo);
        const jsonBlob = new Blob([json], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const downloadLink = document.createElement('a');

        // 获取当前时间戳
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

        let fileName = '';
        if (url.includes('/watched_videos')) {
            fileName = 'watched-videos';
        } else if (url.includes('/want_watch_videos')) {
            fileName = 'want-watch-videos';
        } else if (url.includes('/list_detail')) {
            const breadcrumb = document.getElementsByClassName('breadcrumb')[0];
            const li = breadcrumb.parentNode.querySelectorAll('li');
            fileName = li[1].innerText;
        } else if (url.includes('/lists')) {
            fileName = document.querySelector('.actor-section-name').innerText;
        }

        downloadLink.href = jsonUrl;
        downloadLink.download = `${fileName}_${timestamp}.json`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(jsonUrl);

        localStorage.removeItem('allVideosInfo');
        localStorage.removeItem('exportState');

        exportButton.textContent = '导出完毕';
        exportButton.disabled = false;
    }

    // 定义清除函数
    function handleClear(e) {
        e.preventDefault();
        e.stopPropagation();

        debugLog('开始清除数据...');
        if (confirm('确定要清除所有存储的番号吗？')) {
            try {
                // 清除内存中的数据
                storedIds = new Set();

                // 清除所有 GM 存储
                const allKeys = GM_listValues ? GM_listValues() : ['storedIds', 'lastUploadTime', 'watchedVideos', 'wantWatchVideos', 'hideWatchedVideos'];
                allKeys.forEach(key => {
                    debugLog('清除 GM 存储:', key);
                    GM_deleteValue(key);
                });

                // 清除所有相关的 localStorage
                const localStorageKeys = ['allVideosInfo', 'exportState'];
                localStorageKeys.forEach(key => {
                    debugLog('清除 localStorage:', key);
                    localStorage.removeItem(key);
                });

                // 重新初始化必要的值
                GM_setValue('storedIds', []);
                GM_setValue('lastUploadTime', '');
                lastUploadTime = '';

                // 更新显示
                idCountDisplay.textContent = `已存储 0 个番号`;
                uploadTimeDisplay.textContent = '';

                debugLog('数据清除完成');
                debugLog('当前 storedIds size:', storedIds.size);
                debugLog('当前 GM storage:', GM_getValue('storedIds', []).length);

                // 强制刷新页面
                alert('已清除所有存储的番号，页面将刷新');
                window.location.href = window.location.href;
            } catch (error) {
                console.error('清除数据时出错:', error);
                alert('清除数据时出错，请查看控制台');
            }
        }
        return false;
    }

    // 添加按钮事件监听器
    exportButton.addEventListener('click', exportVideosInfo);
    clearButton.addEventListener('click', handleClear);

    
    [exportButton, clearButton].forEach(button => {
        button.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-1px)';
            if (this === exportButton) {
                this.style.backgroundColor = '#3d8ae5';
            } else {
                this.style.backgroundColor = '#e54a4a';
            }
        });

        button.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            if (this === exportButton) {
                this.style.backgroundColor = '#4a9eff';
            } else {
                this.style.backgroundColor = '#ff4a4a';
            }
        });

        // 修改禁用状态的处理方式
        const updateDisabledStyle = function() {
            if (this.disabled) {
                this.style.opacity = '0.6';
                this.style.cursor = 'not-allowed';
            } else {
                this.style.opacity = '1';
                this.style.cursor = 'pointer';
            }
        };

        // 监听 disabled 属性变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'disabled') {
                    updateDisabledStyle.call(button);
                }
            });
        });

        observer.observe(button, {
            attributes: true,
            attributeFilter: ['disabled']
        });

        // 初始化禁用状态样式
        updateDisabledStyle.call(button);
    });

    // 将按钮添加到按钮容器
    buttonContainer.appendChild(exportButton);
    buttonContainer.appendChild(clearButton);
    debugLog('按钮已添加到容器');

    // 创建搜索框和结果容器
    const searchContainer = document.createElement('div');
    searchContainer.style.marginBottom = '15px';

    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = '搜索已看的番号';
    searchBox.style.width = '100%';
    searchBox.style.padding = '8px 12px';
    searchBox.style.border = '1px solid #ddd';
    searchBox.style.borderRadius = '6px';
    searchBox.style.marginBottom = '10px';
    searchBox.style.boxSizing = 'border-box';

    // 创建搜索结果容器
    const resultContainer = document.createElement('div');
    resultContainer.style.maxHeight = '200px';
    resultContainer.style.overflowY = 'auto';
    resultContainer.style.border = '1px solid #eee';
    resultContainer.style.borderRadius = '6px';
    resultContainer.style.padding = '10px';
    resultContainer.style.display = 'none';
    resultContainer.style.backgroundColor = '#f9f9f9';

    // 搜索处理函数
    function handleSearch() {
        const searchTerm = searchBox.value.trim().toLowerCase();
        const storedIdsArray = Array.from(storedIds);

        if (searchTerm === '') {
            resultContainer.style.display = 'none';
            return;
        }

        const results = storedIdsArray.filter(id =>
            id.toLowerCase().includes(searchTerm)
        );

        resultContainer.innerHTML = '';

        if (results.length > 0) {
            results.forEach(id => {
                const resultItem = document.createElement('div');
                resultItem.style.display = 'flex';
                resultItem.style.justifyContent = 'space-between';
                resultItem.style.alignItems = 'center';
                resultItem.style.padding = '5px';
                resultItem.style.borderBottom = '1px solid #eee';

                const idText = document.createElement('span');
                idText.textContent = id;
                idText.style.cursor = 'pointer';

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '删除';
                deleteBtn.style.cssText = `
                    padding: 2px 8px;
                    background-color: #ff4757;
                    color: white;
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.2s ease;
                `;

                deleteBtn.addEventListener('mouseover', () => {
                    deleteBtn.style.opacity = '0.8';
                });

                deleteBtn.addEventListener('mouseout', () => {
                    deleteBtn.style.opacity = '1';
                });

                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm(`确定要删除 ${id} 吗？`)) {
                        storedIds.delete(id);
                        GM_setValue('myIds', Array.from(storedIds));
                        resultItem.style.opacity = '0';
                        setTimeout(() => {
                            resultItem.remove();
                            if (resultContainer.children.length === 0) {
                                const noResult = document.createElement('div');
                                noResult.textContent = '未找到匹配的番号';
                                noResult.style.padding = '5px';
                                noResult.style.color = '#666';
                                resultContainer.appendChild(noResult);
                            }
                            updateCountDisplay();
                        }, 300);
                        logToScreen(`已删除: ${id}`, 'rgba(255, 71, 87, 0.8)', 'white');
                    }
                });

                resultItem.appendChild(idText);
                resultItem.appendChild(deleteBtn);
                resultContainer.appendChild(resultItem);

                resultItem.addEventListener('mouseover', () => {
                    resultItem.style.backgroundColor = '#eee';
                });

                resultItem.addEventListener('mouseout', () => {
                    resultItem.style.backgroundColor = 'transparent';
                });
            });
            resultContainer.style.display = 'block';
        } else {
            const noResult = document.createElement('div');
            noResult.textContent = '未找到匹配的番号';
            noResult.style.padding = '5px';
            noResult.style.color = '#666';
            resultContainer.appendChild(noResult);
            resultContainer.style.display = 'block';
        }
    }

    // 添加搜索事件监听
    searchBox.addEventListener('input', handleSearch);

    // 添加点击外部关闭搜索结果的功能
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            resultContainer.style.display = 'none';
        }
    });

    // 将搜索框和结果容器添加到搜索容器
    searchContainer.appendChild(searchBox);
    searchContainer.appendChild(resultContainer);

    // 创建ID计数显示
    idCountDisplay = document.createElement('div');
    idCountDisplay.style.marginTop = '15px';
    idCountDisplay.style.color = '#666';
    idCountDisplay.style.fontSize = '13px';
    idCountDisplay.style.textAlign = 'center';

    // 在加载存储的 ID 和上传时间时更新显示
    const rawData = GM_getValue('myIds');
    const savedUploadTime = GM_getValue('lastUploadTime');
    if (rawData) {
        storedIds = new Set(rawData); // 如果之前存过数据，加载到 Set
        updateCountDisplay(); // 使用新的更新函数
    }
    if (savedUploadTime) {
        lastUploadTime = savedUploadTime; // 恢复最新上传时间
        if (uploadTimeDisplay) {
            uploadTimeDisplay.textContent = `上次上传时间：${lastUploadTime}`;
        }
    }

    // 创建上传时间显示
    uploadTimeDisplay = document.createElement('div');
    uploadTimeDisplay.style.marginTop = '5px';
    uploadTimeDisplay.style.color = '#666';
    uploadTimeDisplay.style.fontSize = '13px';
    uploadTimeDisplay.style.textAlign = 'center';
    uploadTimeDisplay.textContent = lastUploadTime ? `上次上传时间：${lastUploadTime}` : '';
    debugLog('创建上传时间显示');

    // 创建浏览记录查询功能
    const browseHistoryContainer = document.createElement('div');
    browseHistoryContainer.style.marginBottom = '15px';

    const browseHistoryBox = document.createElement('input');
    browseHistoryBox.type = 'text';
    browseHistoryBox.placeholder = '查询浏览记录';
    browseHistoryBox.style.width = '100%';
    browseHistoryBox.style.padding = '8px 12px';
    browseHistoryBox.style.border = '1px solid #ddd';
    browseHistoryBox.style.borderRadius = '6px';
    browseHistoryBox.style.marginBottom = '10px';
    browseHistoryBox.style.boxSizing = 'border-box';

    // 创建浏览记录结果容器
    const browseHistoryResultContainer = document.createElement('div');
    browseHistoryResultContainer.style.maxHeight = '200px';
    browseHistoryResultContainer.style.overflowY = 'auto';
    browseHistoryResultContainer.style.border = '1px solid #eee';
    browseHistoryResultContainer.style.borderRadius = '6px';
    browseHistoryResultContainer.style.padding = '10px';
    browseHistoryResultContainer.style.display = 'none';
    browseHistoryResultContainer.style.backgroundColor = '#f9f9f9';

    // 查询处理函数
    function handleBrowseHistorySearch() {
        const searchTerm = browseHistoryBox.value.trim().toLowerCase();
        const storedVideoIds = Array.from(new Set(GM_getValue('videoBrowseHistory', [])));

        if (searchTerm === '') {
            browseHistoryResultContainer.style.display = 'none';
            return;
        }

        const results = storedVideoIds.filter(id => id.toLowerCase().includes(searchTerm));

        browseHistoryResultContainer.innerHTML = '';

        if (results.length > 0) {
            results.forEach(id => {
                const resultItem = document.createElement('div');
                resultItem.style.display = 'flex';
                resultItem.style.justifyContent = 'space-between';
                resultItem.style.alignItems = 'center';
                resultItem.style.padding = '5px';
                resultItem.style.borderBottom = '1px solid #eee';

                const idText = document.createElement('span');
                idText.textContent = id;
                idText.style.cursor = 'pointer';

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '删除';
                deleteBtn.style.cssText = `
                    padding: 2px 8px;
                    background-color: #ff4757;
                    color: white;
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.2s ease;
                `;

                deleteBtn.addEventListener('mouseover', () => {
                    deleteBtn.style.opacity = '0.8';
                });

                deleteBtn.addEventListener('mouseout', () => {
                    deleteBtn.style.opacity = '1';
                });

                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm(`确定要删除浏览记录 ${id} 吗？`)) {
                        const browseHistory = new Set(GM_getValue('videoBrowseHistory', []));
                        browseHistory.delete(id);
                        GM_setValue('videoBrowseHistory', Array.from(browseHistory));
                        resultItem.style.opacity = '0';
                        setTimeout(() => {
                            resultItem.remove();
                            if (browseHistoryResultContainer.children.length === 0) {
                                const noResult = document.createElement('div');
                                noResult.textContent = '未找到匹配的浏览记录';
                                noResult.style.padding = '5px';
                                noResult.style.color = '#666';
                                browseHistoryResultContainer.appendChild(noResult);
                            }
                            updateCountDisplay();
                        }, 300);
                        logToScreen(`已删除浏览记录: ${id}`, 'rgba(255, 71, 87, 0.8)', 'white');
                    }
                });

                resultItem.appendChild(idText);
                resultItem.appendChild(deleteBtn);
                browseHistoryResultContainer.appendChild(resultItem);

                resultItem.addEventListener('mouseover', () => {
                    resultItem.style.backgroundColor = '#eee';
                });

                resultItem.addEventListener('mouseout', () => {
                    resultItem.style.backgroundColor = 'transparent';
                });
            });
            browseHistoryResultContainer.style.display = 'block';
        } else {
            const noResult = document.createElement('div');
            noResult.textContent = '未找到匹配的浏览记录';
            noResult.style.padding = '5px';
            noResult.style.color = '#666';
            browseHistoryResultContainer.appendChild(noResult);
            browseHistoryResultContainer.style.display = 'block';
        }
    }

    // 添加搜索事件监听
    browseHistoryBox.addEventListener('input', handleBrowseHistorySearch);

    // 将浏览记录查询框和结果容器添加到面板
    browseHistoryContainer.appendChild(browseHistoryBox);
    browseHistoryContainer.appendChild(browseHistoryResultContainer);

    // 在面板的最后添加版本和作者信息
    const versionAuthorInfo = document.createElement('div');
    versionAuthorInfo.style.cssText = `
        margin-top: 15px;
        padding-top: 10px;
        border-top: 1px solid #eee;
        color: #999;
        font-size: 12px;
        text-align: center;
    `;
    versionAuthorInfo.innerHTML = `Version: ${VERSION}<br>Author: Ryen`;

    // 将所有元素添加到面板
    panel.appendChild(title);
    panel.appendChild(uploadContainer);
    panel.appendChild(toggleContainer);
    panel.appendChild(toggleViewedContainer);
    panel.appendChild(toggleVRContainer);
    panel.appendChild(buttonContainer);
    panel.appendChild(searchContainer);
    panel.appendChild(browseHistoryContainer); // 添加浏览记录查询功能
    panel.appendChild(idCountDisplay);
    panel.appendChild(uploadTimeDisplay);
    panel.appendChild(versionAuthorInfo); // 将版本和作者信息放在最下面

    // 处理文件上传
    uploadButton.addEventListener('change', handleFileUpload);

    const circle = createCircle(circlePosition.left, circlePosition.top);

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const jsonData = JSON.parse(e.target.result);

                // 检查导入的数据格式
                if (Array.isArray(jsonData)) {

                    jsonData.forEach(item => {
                        if (item.id) {
                            storedIds.add(item.id);
                        }
                    });
                } else if (jsonData.videoBrowseHistory && jsonData.myIds) {

                    jsonData.videoBrowseHistory.forEach(id => {
                        storedIds.add(id); // 添加到 storedIds
                    });
                    jsonData.myIds.forEach(id => {
                        storedIds.add(id); // 添加到 storedIds
                    });

                    // 更新 videoBrowseHistory
                    const existingVideoBrowseHistory = GM_getValue('videoBrowseHistory', []);
                    const updatedVideoBrowseHistory = new Set([...existingVideoBrowseHistory, ...jsonData.videoBrowseHistory]);
                    GM_setValue('videoBrowseHistory', Array.from(updatedVideoBrowseHistory)); // 更新存储
                }

                GM_setValue('myIds', Array.from(storedIds));

                lastUploadTime = new Date().toLocaleString();
                GM_setValue('lastUploadTime', lastUploadTime);
                uploadTimeDisplay.textContent = `最新上传时间: ${lastUploadTime}`;

                alert('数据已保存');
                updateCountDisplay(); // 使用新的更新函数
            } catch (error) {
                console.error('解析 JSON 失败:', error);
                alert('解析 JSON 失败');
            }
        };

        reader.readAsText(file);
    }

    function createCircle(left, top) {
        debugLog('创建圆形按钮...');
        const existingCircle = document.getElementById('unique-circle');
        if (existingCircle) {
            debugLog('移除已存在的圆形按钮');
            existingCircle.remove();
        }

        const circle = document.createElement('div');
        circle.id = 'unique-circle';
        circle.style.position = 'fixed';
        circle.style.width = '60px';
        circle.style.height = '60px';
        circle.style.borderRadius = '50%';
        circle.style.backgroundColor = '#ed0085';
        circle.style.cursor = 'pointer';
        circle.style.zIndex = 10000;
        circle.style.left = `${left}px`;
        circle.style.top = `${top}px`;
        circle.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        circle.style.transition = 'all 0.3s ease';
        document.body.appendChild(circle);

        // 创建内部文字容器
        const label = document.createElement('div');
        label.textContent = '番';
        label.style.fontSize = '20px';
        label.style.color = 'white';
        label.style.textAlign = 'center';
        label.style.lineHeight = '60px';
        label.style.fontWeight = 'bold';
        label.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.2)';
        circle.appendChild(label);

        // 悬停效果
        circle.addEventListener('mouseenter', function () {
            circle.style.transition = 'all 0.3s ease';
            circle.style.left = '0px';
            circle.style.backgroundColor = '#ed0085';
            circle.style.transform = 'scale(1.05)';
            circle.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
        });

        circle.addEventListener('mouseleave', function () {
            circle.style.transition = 'all 0.3s ease';
            circle.style.left = '-40px';
            circle.style.backgroundColor = 'rgba(237, 0, 133, 0.7)';
            circle.style.transform = 'scale(1)';
            circle.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        });

        // 点击效果
        circle.addEventListener('mousedown', function() {
            circle.style.transform = 'scale(0.95)';
        });

        circle.addEventListener('mouseup', function() {
            circle.style.transform = 'scale(1.05)';
        });

        // 修改圆形按钮点击事件处理
        circle.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            debugLog('圆形按钮被点击');
            panel.style.display = 'block';
            panelVisible = true;
            debugLog('面板显示状态:', panelVisible);

            setTimeout(() => {
                updatePanelPosition(panel, parseInt(circle.style.top));
            }, 0);

            setupMouseLeave(panel);
        });

        return circle;
    }

    // 修改 setupMouseLeave 函数
    function setupMouseLeave(panel) {
        let timeoutId = null;

        panel.addEventListener('mouseenter', () => {
            debugLog('鼠标进入面板');
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
        });

        panel.addEventListener('mouseleave', (e) => {
            debugLog('鼠标离开面板');
            if (!panel.contains(e.relatedTarget)) {
                timeoutId = setTimeout(() => {
                    debugLog('关闭面板');
                    panel.style.display = 'none';
                    panelVisible = false;
                }, 1000);
            }
        });

        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && e.target.id !== 'unique-circle') {
                debugLog('点击面板外部，关闭面板');
                panel.style.display = 'none';
                panelVisible = false;
            }
        });
    }

    // 添加调试信息
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                debugLog('面板样式变化:', panel.style.cssText);
            }
        });
    });

    observer.observe(panel, { attributes: true });
})();


(function () {

    const url = window.location.href;


    const validUrlPatterns = [
        /https:\/\/javdb\.com\/users\/want_watch_videos.*/,
        /https:\/\/javdb\.com\/users\/watched_videos.*/,
        /https:\/\/javdb\.com\/users\/list_detail.*/,
        /https:\/\/javdb\.com\/lists.*/
    ];


    const isValidUrl = validUrlPatterns.some(pattern => pattern.test(url));
    if (!isValidUrl) {
        return;
    }



    let allVideosInfo = JSON.parse(localStorage.getItem('allVideosInfo')) || [];
    let exportState = {
        allowExport: false,
        currentPage: 1,
        maxPage: null
    };

    function getVideosInfo() {
        const videoElements = document.querySelectorAll('.item');
        if (DEBUG) {
            console.log(`找到 ${videoElements.length} 个视频元素`);
        }

        if (videoElements.length === 0) {
            if (DEBUG) {
                console.log('未找到视频元素，可能页面还未完全加载');
            }
            return [];
        }

        return Array.from(videoElements).map((element, index) => {
            try {
                const titleElement = element.querySelector('.video-title');
                const metaElement = element.querySelector('.meta');

                if (!titleElement) {
                    if (DEBUG) {
                        console.log(`第 ${index + 1} 个元素缺少标题元素`);
                    }
                    return null;
                }

                const title = titleElement.textContent.trim();
                if (!title) {
                    if (DEBUG) {
                        console.log(`第 ${index + 1} 个元素标题为空`);
                    }
                    return null;
                }

                const [id, ...titleWords] = title.split(' ');
                const releaseDate = metaElement ? metaElement.textContent.replace(/[^0-9-]/g, '') : '';

                if (DEBUG) {
                    console.log(`处理视频 ${index + 1}: ${id}`);
                }
                return { id, releaseDate };
            } catch (error) {
                if (DEBUG) {
                    console.log(`处理第 ${index + 1} 个视频时出错:`, error);
                }
                return null;
            }
        }).filter(item => item !== null); // 过滤掉无效的项目
    }

    // 获取总视频数量
    function getTotalVideoCount() {
        const activeLink = document.querySelector('a.is-active');
        if (activeLink) {
            const text = activeLink.textContent;
            const match = text.match(/\((\d+)\)/);
            if (match) {
                console.log(`总视频数量: ${match[1]}`);
                return parseInt(match[1], 10);
            }
        }
        return 0; // 默认返回0
    }

    // 计算最大页数
    function calculateMaxPages(totalCount, itemsPerPage) {
        const maxPages = Math.ceil(totalCount / itemsPerPage);
        console.log(`总视频数量: ${totalCount}, 每页视频数量: ${itemsPerPage}，最大页数: ${maxPages}`);
        return maxPages;
    }

    // 修改翻页逻辑
    function scrapeAllPages() {
        const itemsPerPage = 20; // 每页视频数量
        const totalCount = getTotalVideoCount(); // 获取总视频数量
        const maxPages = calculateMaxPages(totalCount, itemsPerPage); // 计算最大页数

        if (exportState.currentPage > maxPages) {
            exportVideosInfo();
            return;
        }

        const videosInfo = getVideosInfo();
        allVideosInfo = allVideosInfo.concat(videosInfo);

        // 更新 URL
        if (exportState.currentPage > 1) {
            const newUrl = `https://javdb.com/users/watched_videos?page=${exportState.currentPage}`;
            location.href = newUrl; // 通过 URL 变更翻页
        } else {
            exportState.currentPage++; // 只在第一页时增加页码
            localStorage.setItem('exportState', JSON.stringify(exportState));
            scrapeAllPages(); // 继续抓取下一页
        }

        // 每导出5页后暂停3秒
        if (exportState.currentPage % 5 === 0) {
            setTimeout(() => {
                scrapeAllPages(); // 继续抓取
            }, 3000); // 暂停3秒
        }
    }

    function exportVideosInfo() {
        exportState.allowExport = false;
        exportState.currentPage = 1;
        exportState.maxPage = null;

        localStorage.setItem('exportState', JSON.stringify(exportState));

        // 从 localStorage 中读取最新的数据，而不是使用全局变量
        const allVideosInfo = JSON.parse(localStorage.getItem('allVideosInfo') || '[]');
        console.log(`exportVideosInfo: 从localStorage读取到 ${allVideosInfo.length} 个视频数据`);

        allVideosInfo.sort((a, b) => a.id.localeCompare(b.id));
        const json = JSON.stringify(allVideosInfo);
        const jsonBlob = new Blob([json], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const downloadLink = document.createElement('a');

        // 获取当前时间戳
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

        let fileName = '';
        if (url.includes('/watched_videos')) {
            fileName = 'watched-videos';
        } else if (url.includes('/want_watch_videos')) {
            fileName = 'want-watch-videos';
        } else if (url.includes('/list_detail')) {
            const breadcrumb = document.getElementsByClassName('breadcrumb')[0];
            const li = breadcrumb.parentNode.querySelectorAll('li');
            fileName = li[1].innerText;
        } else if (url.includes('/lists')) {
            fileName = document.querySelector('.actor-section-name').innerText;
        }

        downloadLink.href = jsonUrl;
        downloadLink.download = `${fileName}_${timestamp}.json`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(jsonUrl);

        localStorage.removeItem('allVideosInfo');
        localStorage.removeItem('exportState');

        exportButton.textContent = '导出完毕';
        exportButton.disabled = false;
    }

    // 添加获取当前页码的函数
    function getCurrentPage() {
        // 从 URL 中获取页码
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page');
        // 如果 URL 中没有页码参数，则返回 1
        return page ? parseInt(page) : 1;
    }

    function startExport() {
        const maxPageInput = document.getElementById('maxPageInput');
        if (!maxPageInput) {
            console.error('找不到页数输入框');
            return;
        }

        const itemsPerPage = 20;
        const totalCount = getTotalVideoCount();
        const maxPages = calculateMaxPages(totalCount, itemsPerPage);

        // 如果用户输入了页数，使用用户输入的值，否则使用最大页数
        const pagesToExport = maxPageInput.value ? parseInt(maxPageInput.value) : maxPages;

        // 确保不超过最大页数
        const currentPage = getCurrentPage();
        const targetPage = Math.min(currentPage + pagesToExport - 1, maxPages);

        if (targetPage < currentPage) {
            alert('请输入有效的页数');
            return;
        }

        exportState.currentPage = currentPage;
        exportState.maxPage = targetPage;
        exportState.allowExport = true;

        localStorage.setItem('exportState', JSON.stringify(exportState));
        localStorage.setItem('allVideosInfo', JSON.stringify([])); // 清空之前的数据

        exportButton.textContent = `导出中...(${currentPage}/${targetPage})`;
        exportButton.disabled = true;
        stopButton.disabled = false;
        isExporting = true;

        // 开始从当前页抓取数据
        scrapeCurrentPage();
    }

    // 新增函数：抓取当前页面数据
    function scrapeCurrentPage() {
        const startTime = performance.now(); // 记录开始时间

        // 减少调试信息输出以提高性能
        if (DEBUG) {
            console.log(`=== scrapeCurrentPage 开始 ===`);
            console.log(`isExporting: ${isExporting}`);
            console.log(`exportState.currentPage: ${exportState.currentPage}`);
            console.log(`exportState.maxPage: ${exportState.maxPage}`);
            console.log(`当前URL: ${window.location.href}`);
        }

        if (!isExporting || exportState.currentPage > exportState.maxPage) {
            if (DEBUG) {
                console.log(`条件检查失败，直接调用 finishExport()`);
                console.log(`!isExporting: ${!isExporting}`);
                console.log(`exportState.currentPage > exportState.maxPage: ${exportState.currentPage > exportState.maxPage}`);
            }
            finishExport();
            return;
        }

        // 先收集当前页面数据
        const videosInfo = getVideosInfo();

        // 验证是否成功获取到数据
        if (!videosInfo || videosInfo.length === 0) {
            console.log('未获取到视频数据，等待500毫秒后重试...');
            setTimeout(() => {
                scrapeCurrentPage();
            }, 500);
            return;
        }

        const endTime = performance.now();
        const processingTime = (endTime - startTime).toFixed(2);
        console.log(`成功获取到 ${videosInfo.length} 个视频数据，当前页: ${exportState.currentPage}${PERFORMANCE_MODE ? `，处理时间: ${processingTime}ms` : ''}`);

        // 优化：减少localStorage读写频率
        const currentAllVideos = JSON.parse(localStorage.getItem('allVideosInfo') || '[]');
        const newAllVideos = currentAllVideos.concat(videosInfo);
        localStorage.setItem('allVideosInfo', JSON.stringify(newAllVideos));

        // 更新进度显示
        exportButton.textContent = `导出中...(${exportState.currentPage}/${exportState.maxPage})`;

        // 判断是否是最后一页
        if (exportState.currentPage >= exportState.maxPage) {
            // 如果是最后一页，直接完成导出
            console.log('到达最后一页，完成导出');
            finishExport();
            return;
        }

        // 如果不是最后一页，增加页码并跳转到下一页
        exportState.currentPage++;

        // 优化：批量更新localStorage
        const updatedExportState = {
            ...exportState,
            currentPage: exportState.currentPage
        };
        localStorage.setItem('exportState', JSON.stringify(updatedExportState));

        if (DEBUG) {
            console.log(`跳转到下一页: ${exportState.currentPage}`);
        }
        const newUrl = `${window.location.pathname}?page=${exportState.currentPage}`;
        window.location.href = newUrl;
    }

    // 新增函数：完成导出
    function finishExport() {
        const allVideosInfo = JSON.parse(localStorage.getItem('allVideosInfo') || '[]');
        console.log(`完成导出，总共收集到 ${allVideosInfo.length} 个视频数据`);

        if (allVideosInfo.length > 0) {
            console.log('开始生成导出文件...');
            exportVideosInfo();
        } else {
            console.log('没有收集到任何数据，跳过导出');
        }

        // 重置状态
        isExporting = false;
        exportState.allowExport = false;
        exportState.currentPage = 1;
        exportState.maxPage = null;
        localStorage.setItem('exportState', JSON.stringify(exportState));

        exportButton.textContent = '导出完成';
        exportButton.disabled = false;
        stopButton.disabled = true;
    }

    function createExportButton() {
        const maxPageInput = document.createElement('input');
        maxPageInput.type = 'number';
        maxPageInput.id = 'maxPageInput';
        maxPageInput.placeholder = '当前页往后导出的页数，留空导全部';  // 修改提示文本
        maxPageInput.style.cssText = `
            margin-right: 10px;
            padding: 6px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            width: auto;
            min-width: 50px;
            box-sizing: border-box;
            transition: all 0.3s ease;
            outline: none;
            background-color: white;
        `;
        maxPageInput.min = '1';

        // 获取最大页数并设置为 max 属性
        const itemsPerPage = 20;
        const totalCount = getTotalVideoCount();
        const maxPages = calculateMaxPages(totalCount, itemsPerPage);
        maxPageInput.max = maxPages;

        // 创建一个容器来包含上传按钮和帮助图标
        const uploadContainer = document.createElement('div');
        uploadContainer.style.position = 'relative';
        uploadContainer.style.marginBottom = '15px';
        uploadContainer.style.display = 'flex'; // 使用flex布局
        uploadContainer.style.alignItems = 'center'; // 垂直居中
        uploadContainer.style.gap = '8px'; // 元素之间的间距
        uploadContainer.style.width = '100%';

        // 创建一个包装上传按钮的容器
        const uploadButtonWrapper = document.createElement('div');
        uploadButtonWrapper.style.flex = '1'; // 占据剩余空间
        uploadButtonWrapper.style.minWidth = '0'; // 防止内容溢出
        uploadContainer.appendChild(uploadButtonWrapper);
        uploadButtonWrapper.appendChild(maxPageInput);

        // 初始化输入框宽度
        setTimeout(() => {
            const tempSpan = document.createElement('span');
            tempSpan.style.visibility = 'hidden';
            tempSpan.style.position = 'absolute';
            tempSpan.style.whiteSpace = 'nowrap';
            tempSpan.style.font = window.getComputedStyle(maxPageInput).font;
            tempSpan.textContent = maxPageInput.placeholder;
            document.body.appendChild(tempSpan);

            // 设置输入框宽度为占位符文本宽度加上内边距
            const width = tempSpan.offsetWidth;
            maxPageInput.style.width = (width + 50) + 'px';

            document.body.removeChild(tempSpan);
        }, 0);

        // 输入框焦点样式
        maxPageInput.addEventListener('focus', function() {
            this.style.borderColor = '#4a9eff';
            this.style.boxShadow = '0 0 0 2px rgba(74, 158, 255, 0.2)';
        });

        maxPageInput.addEventListener('blur', function() {
            this.style.borderColor = '#ddd';
            this.style.boxShadow = 'none';
        });

        exportButton = document.createElement('button');
        exportButton.textContent = '导出 json';
        exportButton.className = 'button is-small';
        exportButton.style.cssText = `
            padding: 6px 16px;
            background-color: #4a9eff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            outline: none;
            height: auto;
        `;

        stopButton = document.createElement('button');
        stopButton.textContent = '停止导出';
        stopButton.className = 'button is-small';
        stopButton.style.cssText = `
            margin-left: 10px;
            padding: 6px 16px;
            background-color: #ff4757;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            outline: none;
            height: auto;
        `;
        stopButton.disabled = true;

        // 按钮悬停效果
        [exportButton, stopButton].forEach(button => {
            button.addEventListener('mouseover', function() {
                if (!this.disabled) {
                    this.style.opacity = '0.9';
                    this.style.transform = 'translateY(-1px)';
                }
            });

            button.addEventListener('mouseout', function() {
                if (!this.disabled) {
                    this.style.opacity = '1';
                    this.style.transform = 'translateY(0)';
                }
            });

            // 修改禁用状态的处理方式
            const updateDisabledStyle = function() {
                if (this.disabled) {
                    this.style.opacity = '0.6';
                    this.style.cursor = 'not-allowed';
                } else {
                    this.style.opacity = '1';
                    this.style.cursor = 'pointer';
                }
            };

            // 监听 disabled 属性变化
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'disabled') {
                        updateDisabledStyle.call(button);
                    }
                });
            });

            observer.observe(button, {
                attributes: true,
                attributeFilter: ['disabled']
            });

            // 初始化禁用状态样式
            updateDisabledStyle.call(button);
        });

        // 添加按钮点击效果
        [exportButton, stopButton].forEach(button => {
            button.addEventListener('mousedown', function() {
                if (!this.disabled) {
                    this.style.transform = 'translateY(1px)';
                }
            });

            button.addEventListener('mouseup', function() {
                if (!this.disabled) {
                    this.style.transform = 'translateY(-1px)';
                }
            });
        });

        stopButton.addEventListener('click', () => {
            isExporting = false;
            stopButton.disabled = true;
            exportButton.disabled = false;
            exportButton.textContent = '导出已停止';
            localStorage.removeItem('allVideosInfo');
            localStorage.removeItem('exportState');
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '8px';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.appendChild(exportButton);
        buttonContainer.appendChild(stopButton);

        // 创建最终的容器
        const exportContainer = document.createElement('div');
        exportContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 5px;
            border-radius: 6px;
            background-color: rgba(255, 255, 255, 0.8);
        `;
        exportContainer.appendChild(maxPageInput);
        exportContainer.appendChild(buttonContainer);

        if (url.includes('/list_detail')) {
            document.querySelector('.breadcrumb').querySelector('ul').appendChild(exportContainer);
        } else {
            document.querySelector('.toolbar').appendChild(exportContainer);
        }

        exportButton.addEventListener('click', () => {
            if (!isExporting) {
                startExport();
            }
        });
    }


    function checkExportState() {
        const savedExportState = localStorage.getItem('exportState');
        if (savedExportState) {
            exportState = JSON.parse(savedExportState);

            if (exportState.allowExport) {
                exportButton.textContent = '导出中...';
                exportButton.disabled = true;
                stopButton.disabled = false;
                isExporting = true;

                // 等待DOM加载完成后再抓取数据
                waitForDOMAndScrape();
            }
        }
    }

    // 新增函数：等待DOM加载完成后抓取数据
    function waitForDOMAndScrape() {
        // 使用更智能的DOM检测机制
        function checkAndScrape() {
            const videoElements = document.querySelectorAll('.item');
            if (videoElements.length > 0) {
                // 如果找到视频元素，立即开始处理
                scrapeCurrentPage();
            } else {
                // 如果还没找到，继续等待
                setTimeout(checkAndScrape, 100);
            }
        }

        // 检查页面是否已经加载完成
        if (document.readyState === 'complete') {
            // 立即开始检查DOM
            checkAndScrape();
        } else {
            // 如果页面还在加载，等待加载完成
            window.addEventListener('load', () => {
                checkAndScrape();
            });
        }
    }

    if (url.includes('/watched_videos')
        || url.includes('/want_watch_videos')
        || url.includes('/list_detail')
        || url.includes('/lists')
    ) {
        createExportButton();
        checkExportState();
    }
})();

// 修改 modifyItemAtCurrentPage 函数
function modifyItemAtCurrentPage(itemToModify) {
    // 获取番号
    const videoTitle = itemToModify.querySelector('div.video-title > strong')?.textContent.trim();
    // 获取 data-title
    const dataTitle = itemToModify.querySelector('div.video-title > span.x-btn')?.getAttribute('data-title');

    if (!videoTitle) {
        debugLog('未找到视频标题');
        return;
    }

    debugLog('处理番号:', videoTitle);

    const browseHistory = new Set(GM_getValue('videoBrowseHistory', []));
    const watchedVideos = new Set(GM_getValue('myIds', []));

    debugLog('浏览历史数量:', browseHistory.size);
    debugLog('已看番号数量:', watchedVideos.size);
    debugLog(`${videoTitle} 是否在浏览历史中:`, browseHistory.has(videoTitle));
    debugLog(`${videoTitle} 是否在已看列表中:`, watchedVideos.has(videoTitle));

    // 检查是否需要隐藏VR番号
    if (hideVRVideos && dataTitle.includes('【VR】')) {
        debugLog(`${videoTitle} 是VR番号，hideVRVideos=${hideVRVideos}，准备隐藏`);
        const itemContainer = itemToModify.closest('.item');
        if (itemContainer) {
            itemContainer.style.transition = 'opacity 0.3s';
            itemContainer.style.opacity = '0';
            setTimeout(() => {
                itemContainer.remove();
                debugLog(`${videoTitle} 已隐藏并移除`);
            }, 300);
        }
        return;
    }

    // 检查是否需要隐藏已浏览的番号
    if (hideViewedVideos && browseHistory.has(videoTitle)) {
        debugLog(`${videoTitle} 在浏览历史中，hideViewedVideos=${hideViewedVideos}，准备隐藏`);
        const itemContainer = itemToModify.closest('.item');
        if (itemContainer) {
            itemContainer.style.transition = 'opacity 0.3s';
            itemContainer.style.opacity = '0';
            setTimeout(() => {
                itemContainer.remove();
                debugLog(`${videoTitle} 已隐藏并移除`);
            }, 300);
        }
        return;
    }

    // 检查是否是已看的番号并需要隐藏
    if (watchedVideos.has(videoTitle) && hideWatchedVideos) {
        debugLog(`${videoTitle} 在已看列表中，hideWatchedVideos=${hideWatchedVideos}，准备隐藏`);
        const itemContainer = itemToModify.closest('.item');
        if (itemContainer) {
            itemContainer.style.transition = 'opacity 0.3s';
            itemContainer.style.opacity = '0';
            setTimeout(() => {
                itemContainer.remove();
                debugLog(`${videoTitle} 已隐藏并移除`);
            }, 300);
        }
        return;
    }

    // 只处理真正已看的番号的标签
    if (watchedVideos.has(videoTitle)) {
        debugLog(`${videoTitle} 在已看列表中，准备添加标签`);
        let tags = itemToModify.closest('.item').querySelector('.tags.has-addons');
        if (!tags) {
            debugLog(`${videoTitle} 未找到标签容器`);
            return;
        }

        let tagClass = styleMap['我看過這部影片'];

        // 检查是否已经存在相同的标记
        let existingTags = Array.from(tags.querySelectorAll('span'));
        let tagExists = existingTags.some(tag => tag.textContent === '我看過這部影片');
        debugLog(`${videoTitle} 是否已有标签:`, tagExists);

        // 如果不存在对应的标签，则添加新的标签
        if (!tagExists) {
            let newTag = document.createElement('span');
            newTag.className = tagClass;
            newTag.textContent = '我看過這部影片';
            tags.appendChild(newTag);
            debugLog(`成功为 ${videoTitle} 添加已看标签`);
            logToScreen(`我看過這部影片: ${videoTitle}`, 'rgba(76, 175, 80, 0.8)', 'white');
        } else {
            debugLog(`${videoTitle} 已有标签，跳过添加`);
        }
    } else {
        debugLog(`${videoTitle} 不在已看列表中，不添加标签`);
    }
}

async function processLoadedItems() {
    debugLog('开始处理页面项目');
    debugLog('当前 hideWatchedVideos 状态:', hideWatchedVideos);
    debugLog('当前 hideViewedVideos 状态:', hideViewedVideos);

    const url = window.location.href;
    debugLog('当前URL:', url);

    const isValidUrl = validUrlPatterns.some(pattern => pattern.test(url));
    if (isValidUrl) {
        debugLog('URL匹配特殊模式，跳过处理');
        return;
    }

    let items = Array.from(document.querySelectorAll('.movie-list .item a'));
    debugLog('找到项目数量:', items.length);

    // 从每个 item 的 <a> 中找到对应的 <strong> 内容
    items.forEach((item, index) => {
        debugLog(`处理第 ${index + 1} 个项目`);
        let strongElement = item.querySelector('div.video-title > strong');
        if (strongElement) {
            let title = strongElement.textContent.trim();
            if (title) {
                debugLog(`处理番号: ${title}`);
                modifyItemAtCurrentPage(item);
            } else {
                debugLog('项目标题为空');
            }
        } else {
            debugLog('未找到标题元素');
        }
    });
}

// 定时检查新加载的项目
setInterval(() => {
    let items = document.querySelectorAll('.movie-list .item a');
    let currentItemCount = items.length;

    if (currentItemCount > lastItemCount) {
        debugLog(`发现新增项目：${currentItemCount - lastItemCount}`);
        logToScreen(`发现新增项目：${currentItemCount - lastItemCount}`, 'rgba(0, 255, 255, 0.8)', 'white');
        processLoadedItems(); // 处理新加载的项目
        lastItemCount = currentItemCount; // 更新上一次的项目计数
    }
}, 1000);

// 初始化时获取当前项目的数量
lastItemCount = document.querySelectorAll('.movie-list .item a').length;
processLoadedItems(); // 初始化已有元素

// 监听窗口大小变化
window.addEventListener('resize', () => {
    if (panelVisible) {
        updatePanelPosition(panel, parseInt(panel.style.top));
    }
});

// 修改随机延迟函数的参数范围为3-5秒
function getRandomDelay(min = 3, max = 5) {
    return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
}

// 修改记录番号浏览记录函数
async function recordVideoId() {
    const videoIdPattern = /<strong>番號:<\/strong>\s*&nbsp;<span class="value"><a href="\/video_codes\/([A-Z]+)">([A-Z]+)<\/a>-(\d+)<\/span>/;
    const panelBlock = document.querySelector('.panel-block.first-block');

    if (panelBlock) {
        const match = panelBlock.innerHTML.match(videoIdPattern);
        if (match) {
            const videoId = `${match[1]}-${match[3]}`;

            // 随机等待3-5秒
            const delay = getRandomDelay();
            debugLog(`等待 ${delay/1000} 秒后开始验证记录...`);
            await sleep(delay);

            // 最大重试次数
            const maxRetries = 5;
            let retryCount = 0;
            let recordSuccess = false;

            while (!recordSuccess && retryCount < maxRetries) {
                try {
                    // 获取当前存储的浏览记录
                    const storedVideoIds = new Set(GM_getValue('videoBrowseHistory', []));

                    // 如果已经存在，直接返回
                    if (storedVideoIds.has(videoId)) {
                        debugLog(`番号已存在: ${videoId}`);
                        return;
                    }

                    // 添加新的番号
                    storedVideoIds.add(videoId);
                    GM_setValue('videoBrowseHistory', Array.from(storedVideoIds));

                    // 等待一小段时间后验证
                    await sleep(500);

                    // 验证是否成功保存
                    const verifyStorage = new Set(GM_getValue('videoBrowseHistory', []));
                    if (verifyStorage.has(videoId)) {
                        debugLog(`成功记录番号: ${videoId}`);
                        logToScreen(`成功记录番号: ${videoId}`, 'rgba(76, 175, 80, 0.8)', 'white');
                        updateCountDisplay();
                        recordSuccess = true;
                        break;
                    } else {
                        throw new Error('验证失败');
                    }
                } catch (error) {
                    retryCount++;
                    debugLog(`第 ${retryCount} 次记录失败: ${videoId}, 错误: ${error.message}`);
                    logToScreen(`第 ${retryCount} 次记录失败，将在3秒后重试...`, 'rgba(255, 193, 7, 0.8)', 'white');

                    if (retryCount < maxRetries) {
                        await sleep(3000); // 失败后等待3秒再重试
                    }
                }
            }

            if (!recordSuccess) {
                debugLog(`达到最大重试次数(${maxRetries})，番号记录失败: ${videoId}`);
                logToScreen(`番号记录失败，请刷新页面重试`, 'rgba(244, 67, 54, 0.8)', 'white');
            }
        } else {
            debugLog('未找到匹配的番号格式');
        }
    } else {
        debugLog('未找到包含番号的元素');
    }
}

// 在页面加载时调用记录函数
if (window.location.href.startsWith('https://javdb.com/v/')) {
    recordVideoId();
}