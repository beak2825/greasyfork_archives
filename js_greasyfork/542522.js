// ==UserScript==
// @name         Polyglot Content Downloader
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  从 Google Polyglot 下载翻译内容为 XLIFF 格式
// @author       LL-Floyd
// @match        https://localization.google.com/polyglot/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        window.close
// @connect      localization.google.com
// @connect      update.greasyfork.org
// @connect      greasyfork.org
// @require      data:application/javascript,window.setImmediate%20%3D%20window.setImmediate%20%7C%7C%20((f%2C%20...args)%20%3D%3E%20window.setTimeout(()%20%3D%3E%20f(args)%2C%200))%3B
// @run-at       document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/542522/Polyglot%20Content%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/542522/Polyglot%20Content%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function checkForUpdates() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://update.greasyfork.org/scripts/542522/Polyglot%20Content%20Downloader.meta.js",
            onload: function (response) {
                try {
                    const latestVersion = /@version\s+([0-9.]+)/.exec(response.responseText)?.[1];
                    const currentVersion = GM_info.script.version;
                    if (latestVersion && latestVersion > currentVersion) {
                        alert("Polyglot Content Downloader 有新版本可用: " + latestVersion + "\n请点击OK更新");
                        window.location.href = "https://greasyfork.org/en/scripts/542522-polyglot-content-downloader";
                    }
                } catch (error) {
                    console.warn('解析更新信息失败:', error);
                }
            },
            onerror: function (error) {
                console.warn('检查更新失败 (这不会影响脚本正常功能):', error);
            }
        })
    }

    // 全局变量
    let messages = [];
    let content = [];
    let jobname = '';
    let docid = '';

    // 配置选项
    const config = {
        contentDownloaderEnabled: GM_getValue('contentDownloaderEnabled', true),
        excludeIceMatches: GM_getValue('excludeIceMatches', false),
        excludePlaceholders: GM_getValue('excludePlaceholders', false)
    };

    // 初始化函数
    function init() {
        console.log('[Polyglot Content Downloader] 初始化中...');

        // 获取页面元素
        messages = document.querySelectorAll('div[data-tu-seq-no][id^="tu"]');
        const jobnameElement = document.querySelector("[data-task-display-name]");

        if (!jobnameElement) {
            console.warn('[Polyglot Content Downloader] 未找到任务名称元素，延迟初始化...');
            setTimeout(init, 1000);
            return;
        }

        jobname = jobnameElement.getAttribute("data-task-display-name");
        docid = window.location.href.match(/(tasks\/\d+)/)?.[1] || '';

        if (config.contentDownloaderEnabled) {
            initializeContentDownloader();
        }
    }

    // 初始化内容下载器
    function initializeContentDownloader() {
        const taskNameElement = document.querySelector("[data-task-display-name]");
        if (!taskNameElement) return;

        // 查找 Change status 按钮 - 使用多种方法确保找到
        let changeStatusButton = null;

        // 方法1: 通过 jsname 属性
        changeStatusButton = document.querySelector('[jsname="V4tJDb"]');

        // 方法2: 通过文本内容查找
        if (!changeStatusButton) {
            const buttons = document.querySelectorAll('div[role="button"]');
            for (const btn of buttons) {
                if (btn.textContent.includes('Change status') || btn.textContent.includes('状态')) {
                    changeStatusButton = btn;
                    break;
                }
            }
        }

        // 方法3: 通过类名查找
        if (!changeStatusButton) {
            changeStatusButton = document.querySelector('.U26fgb.c7fp5b.JvtX2e.ZjeZ9');
        }

        // 创建下载按钮
        const downloadButton = createDownloadButton();

        if (changeStatusButton) {
            console.log('[Polyglot Content Downloader] 找到 Change status 按钮，将下载按钮插入其前面');
            // 将下载按钮插入到 Change status 按钮之前
            changeStatusButton.parentNode.insertBefore(downloadButton, changeStatusButton);
        } else {
            console.log('[Polyglot Content Downloader] 未找到 Change status 按钮，使用备用位置');
            // 如果找不到 Change status 按钮，则插入到任务名称元素的父容器中
            const parentContainer = taskNameElement.parentElement;
            if (parentContainer) {
                parentContainer.appendChild(downloadButton);
            }
        }

        // 创建下载菜单
        const downloadMenu = createDownloadMenu();
        document.body.appendChild(downloadMenu);

        // 绑定事件
        bindEvents();

        // 保存初始加载的段落
        saveInitiallyLoadedSegments();

        // 观察新加载的段落
        observeNewlyLoadedSegments();

        console.log('[Polyglot Content Downloader] 初始化完成');
    }

    // 创建下载按钮
    function createDownloadButton() {
        const button = document.createElement('button');
        button.id = 'pcd-download-button';
        button.textContent = '下载内容';
        button.className = 'pcd-button';
        button.type = 'button';
        button.setAttribute('aria-label', '下载翻译内容');
        return button;
    }

    // 创建下载菜单
    function createDownloadMenu() {
        const menu = document.createElement('div');
        menu.id = 'pcd-download-menu';
        menu.className = 'pcd-menu';
        menu.style.display = 'none';

        // 创建 XLIFF 下载按钮
        const xliffItem = document.createElement('div');
        xliffItem.className = 'pcd-menu-item';
        xliffItem.setAttribute('data-format', 'xliff');
        xliffItem.textContent = '下载 XLIFF 文件';
        menu.appendChild(xliffItem);

        // 添加分隔线
        const separator = document.createElement('div');
        separator.className = 'pcd-menu-separator';
        menu.appendChild(separator);

        // 添加 ICE 匹配复选框
        const iceLabel = document.createElement('label');
        iceLabel.className = 'pcd-checkbox-label';
        const iceCheckbox = document.createElement('input');
        iceCheckbox.type = 'checkbox';
        iceCheckbox.id = 'pcd-exclude-ice';
        iceCheckbox.checked = config.excludeIceMatches;
        iceLabel.appendChild(iceCheckbox);
        iceLabel.appendChild(document.createTextNode(' 排除 ICE 匹配'));
        menu.appendChild(iceLabel);

        // 添加占位符复选框
        const placeholderLabel = document.createElement('label');
        placeholderLabel.className = 'pcd-checkbox-label';
        const placeholderCheckbox = document.createElement('input');
        placeholderCheckbox.type = 'checkbox';
        placeholderCheckbox.id = 'pcd-exclude-placeholders';
        placeholderCheckbox.checked = config.excludePlaceholders;
        placeholderLabel.appendChild(placeholderCheckbox);
        placeholderLabel.appendChild(document.createTextNode(' 排除占位符'));
        menu.appendChild(placeholderLabel);

        return menu;
    }

    // 绑定事件
    function bindEvents() {
        // 下载按钮点击事件
        document.getElementById('pcd-download-button').addEventListener('click', toggleDownloadMenu);

        // 菜单项点击事件
        document.querySelectorAll('.pcd-menu-item').forEach(item => {
            item.addEventListener('click', function () {
                const format = this.getAttribute('data-format');
                handleDownload(format);
            });
        });

        // 复选框变更事件
        document.getElementById('pcd-exclude-ice').addEventListener('change', function () {
            config.excludeIceMatches = this.checked;
            GM_setValue('excludeIceMatches', this.checked);
        });

        document.getElementById('pcd-exclude-placeholders').addEventListener('change', function () {
            config.excludePlaceholders = this.checked;
            GM_setValue('excludePlaceholders', this.checked);
        });

        // 点击外部关闭菜单
        document.addEventListener('click', function (e) {
            const menu = document.getElementById('pcd-download-menu');
            const button = document.getElementById('pcd-download-button');
            if (!menu.contains(e.target) && e.target !== button) {
                menu.style.display = 'none';
            }
        });
    }

    // 切换下载菜单显示
    function toggleDownloadMenu() {
        const menu = document.getElementById('pcd-download-menu');
        const button = document.getElementById('pcd-download-button');

        if (menu.style.display === 'none') {
            const rect = button.getBoundingClientRect();
            menu.style.left = rect.left + 'px';
            menu.style.top = (rect.bottom + 5) + 'px';
            menu.style.display = 'block';
        } else {
            menu.style.display = 'none';
        }
    }

    // 处理下载
    async function handleDownload(format) {
        toggleDownloadMenu();
        showNotification('正在准备下载...', 'info');

        // 滚动加载所有内容
        await scrollTheWholeDocument();

        if (!content.length) {
            showNotification('没有找到可下载的内容', 'error');
            return;
        }

        // 只处理 XLIFF 格式
        if (format === 'xliff') {
            downloadXliff();
        }
    }

    // 保存初始加载的段落
    function saveInitiallyLoadedSegments() {
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            if (message.children && message.children.length) {
                getContent(message);
            }
        }
    }

    // 观察新加载的段落
    function observeNewlyLoadedSegments() {
        const config = { childList: true, subtree: true };
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'subtree') {
                    const message = mutation.target;
                    if (message.children && message.children.length) {
                        getContent(message);
                    }
                }
            }
        });

        messages.forEach(message => {
            observer.observe(message, config);
        });
    }

    // 获取内容
    function getContent(message) {
        const segmentId = message.id.replace(/tu-/, "");
        if (!segmentId) return false;

        // 检查是否已存在
        const existingSegment = content.find(x => x.id === segmentId);
        if (existingSegment) return false;

        const segment = {
            id: segmentId,
            source: "",
            target: "",
            matchType: ""
        };

        // 获取颜色以确定匹配类型
        const color = getColorOfSubmessage(message);
        if (color) {
            const hexColor = rgb2hex(color);
            const matchColors = getPolyglotColorScheme();
            segment.matchType = matchColors[hexColor] || "null";
        }

        // 获取源文本和目标文本
        const sourceQueries = message.querySelectorAll("[jsname^=src-]");
        const targetQueries = message.querySelectorAll("[jsname^=tgt-text-]");

        // 提取源文本
        let sourceText = "";
        sourceQueries.forEach((query, index) => {
            sourceText += getTextWithPlaceholders(query);
            if (index < sourceQueries.length - 1 && !sourceText.match(/\n$/)) {
                sourceText += "\n";
            }
        });
        segment.source = sourceText;

        // 提取目标文本
        let targetText = "";
        targetQueries.forEach((query, index) => {
            targetText += getTextWithPlaceholders(query);
            if (index < targetQueries.length - 1 && !targetText.match(/\n$/)) {
                targetText += "\n";
            }
        });
        segment.target = targetText;

        content.push(segment);
        return segment;
    }

    // 获取带占位符的文本
    function getTextWithPlaceholders(queryNode) {
        const copyNode = queryNode.cloneNode(true);
        const placeholders = copyNode.querySelectorAll("span[data-index]");

        placeholders.forEach(placeholder => {
            const index = parseInt(placeholder.getAttribute("data-index")) || 0;
            const type = placeholder.getAttribute("data-type");
            let placeholderText = placeholder.innerText || index;

            const newText = type == 1 ? `{${placeholderText}}` : `{/${placeholderText}}`;
            const textNode = document.createTextNode(newText);
            placeholder.parentNode.replaceChild(textNode, placeholder);
        });

        // 移除多余的 div
        copyNode.querySelectorAll("div").forEach(div => div.remove());

        return copyNode.textContent;
    }

    // 滚动整个文档以加载所有内容
    async function scrollTheWholeDocument() {
        return new Promise(resolve => {
            content = [];
            saveInitiallyLoadedSegments();

            const scrollableElement = getScrollableElement();
            if (!scrollableElement) {
                resolve(true);
                return;
            }

            let pixelsMoved = 0;
            const docHeight = scrollableElement.clientHeight;
            const lastMessage = messages[messages.length - 1];

            const interval = setInterval(() => {
                scrollableElement.scrollTo({ top: pixelsMoved + docHeight });
                pixelsMoved += docHeight;

                if (pixelsMoved >= lastMessage.offsetTop) {
                    clearInterval(interval);
                    scrollableElement.scrollTo({ top: 0 });
                    resolve(true);
                }
            }, 700);
        });
    }

    // 获取可滚动元素
    function getScrollableElement() {
        let node = messages[0]?.parentElement;
        while (node) {
            if (node.scrollHeight > node.clientHeight) {
                return node;
            }
            node = node.parentNode;
        }
        return document.documentElement;
    }

    // 下载 XLIFF 文件
    function downloadXliff() {
        const targetLang = getTargetLanguage();

        let xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.2" xsi:schemaLocation="urn:oasis:names:tc:xliff:document:1.2 http://docs.oasis-open.org/xliff/v1.2/os/xliff-core-1.2-strict.xsd">
    <file original="${docid}" name="${encodeXML(jobname)}" datatype="plaintext" xml:space="preserve" source-language="en-US" target-language="${targetLang}">
        <header>
            <tool tool-id="polyglot-userscript" tool-name="Polyglot Content Downloader"/>
        </header>
        <body>`;

        // 排序内容
        content.sort((a, b) => parseFloat(a.id) - parseFloat(b.id));

        for (const segment of content) {
            // 检查是否需要排除 ICE 匹配
            if (config.excludeIceMatches && segment.matchType === "101") continue;

            let source = segment.source;
            let target = segment.target;

            if (!source && !target) continue;

            // 处理占位符
            if (config.excludePlaceholders) {
                source = source.replace(/{(.*?)}/g, "");
                target = target.replace(/{(.*?)}/g, "");
            }

            xmlString += `
            <trans-unit id="${segment.id}" name="${encodeXML(jobname)}" match="${segment.matchType}">
                <source>${encodeXML(source)}</source>
                <target state="translated">${encodeXML(target)}</target>
            </trans-unit>`;
        }

        xmlString += `
        </body>
    </file>
</xliff>`;

        downloadFile(`Polyglot-${jobname.replace(/ /g, "-")}.xliff`, xmlString, 'text/xml');
        showNotification('XLIFF 文件下载成功', 'success');
    }


    // 获取目标语言
    function getTargetLanguage() {
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            const langElements = message.querySelectorAll("div[lang]");
            if (langElements.length > 1) {
                return langElements[1].lang;
            }
        }
        return "zh-CN"; // 默认值
    }

    // 获取元素颜色
    function getColorOfSubmessage(element) {
        const style = window.getComputedStyle(element);
        return style.backgroundColor || style.borderLeftColor;
    }

    // RGB 转 HEX
    function rgb2hex(rgb) {
        if (!rgb || rgb === 'transparent') return '#ffffff';

        const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!match) return rgb;

        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + hex(match[1]) + hex(match[2]) + hex(match[3]);
    }

    // 获取 Polyglot 颜色方案
    function getPolyglotColorScheme() {
        return {
            "#4285f4": "101", // ICE match
            "#34a853": "100", // 100% match
            "#fbbc04": "95",  // 95-99% match
            "#ea4335": "85",  // 85-94% match
            "#ffffff": "0"    // No match
        };
    }

    // XML 编码
    function encodeXML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
    }

    // 下载文件
    function downloadFile(filename, content, mimeType) {
        const blob = new Blob([content], { type: mimeType + ';charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        const colors = {
            'info': '#2196F3',
            'success': '#4CAF50',
            'error': '#F44336',
            'warning': '#FF9800'
        };

        // 尝试使用 GM_notification，如果不可用则跳过
        try {
            if (typeof GM_notification !== 'undefined') {
                GM_notification({
                    title: 'Polyglot Content Downloader',
                    text: message,
                    timeout: 3000,
                    onclick: function () {
                        console.log('[Polyglot Content Downloader]', message);
                    }
                });
            }
        } catch (e) {
            console.log('[Polyglot Content Downloader] GM_notification not available:', e);
        }

        // 同时在页面上显示提示
        const notification = document.createElement('div');
        notification.className = 'pcd-notification pcd-' + type;
        notification.textContent = message;
        notification.style.backgroundColor = colors[type];
        document.body.appendChild(notification);

        // 在控制台输出
        console.log(`[Polyglot Content Downloader] ${type.toUpperCase()}: ${message}`);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // 添加样式
    GM_addStyle(`
        /* 确保 Bgpbad 容器内的元素对齐 */
        .Bgpbad {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }
        
        /* 下载按钮样式 - 仿照 Google Material Design */
        .pcd-button {
            background-color: #1a73e8;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.25px;
            font-family: 'Google Sans', Roboto, Arial, sans-serif;
            height: 36px;
            min-width: 64px;
            padding: 0 16px;
            margin: 0;
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            outline: none;
            overflow: hidden;
            transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                        box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                        transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15);
            text-decoration: none;
            vertical-align: middle;
            white-space: nowrap;
            z-index: 1;
            line-height: 1;
            text-align: center;
            flex-shrink: 0;
        }
        
        .pcd-button:hover {
            background-color: #1557b0;
            box-shadow: 0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15);
        }
        
        .pcd-button:focus {
            background-color: #1557b0;
            box-shadow: 0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15);
        }
        
        .pcd-button:active {
            background-color: #0d47a1;
            box-shadow: 0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15);
            transform: translateY(1px);
        }
        
        .pcd-button:disabled {
            background-color: rgba(60, 64, 67, 0.12);
            color: rgba(60, 64, 67, 0.38);
            cursor: default;
            box-shadow: none;
        }
        
        /* 下载菜单样式 */
        .pcd-menu {
            position: absolute;
            background: white;
            border: 1px solid #dadce0;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            padding: 8px 0;
            z-index: 10000;
            min-width: 200px;
        }
        
        .pcd-menu-item {
            padding: 10px 20px;
            cursor: pointer;
            font-size: 14px;
            color: #3c4043;
            transition: background-color 0.2s;
        }
        
        .pcd-menu-item:hover {
            background-color: #f1f3f4;
        }
        
        .pcd-menu-separator {
            height: 1px;
            background-color: #dadce0;
            margin: 8px 0;
        }
        
        .pcd-checkbox-label {
            display: block;
            padding: 8px 20px;
            font-size: 14px;
            color: #5f6368;
            cursor: pointer;
        }
        
        .pcd-checkbox-label input {
            margin-right: 8px;
            cursor: pointer;
        }
        
        /* 通知样式 */
        .pcd-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 4px;
            color: white;
            font-size: 14px;
            z-index: 10001;
            transition: opacity 0.3s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
    `);

    // 延迟初始化，等待页面加载
    function startInit() {
        try {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                setTimeout(init, 1000);
            }
        } catch (error) {
            console.error('[Polyglot Content Downloader] 初始化错误:', error);
            // 重试初始化
            setTimeout(startInit, 2000);
        }
    }

    startInit();

    // 执行自动更新检查
    checkForUpdates();

})();