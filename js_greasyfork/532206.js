// ==UserScript==
// @name         Imgbox图片上传助手增强版
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  给 imgbox 添加在线链接上传功能, 支持图片格式转换, 添加直链获取功能
// @author       huanfeng
// @match        *://imgbox.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @grant        GM_addStyle
// @connect      *
// @homepage     https://github.com/huanfeng/img_upload_helper
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532206/Imgbox%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/532206/Imgbox%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 添加全局样式
    GM_addStyle(`
        /* 浮动通知样式 */
        #toast-container {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10000;
            text-align: center;
        }
        
        /* 导航栏图标样式 */
        .helper-icon {
            display: inline-block;
            margin-right: 5px;
            width: 16px;
            height: 16px;
            vertical-align: middle;
        }
        
        .toast {
            background-color: #333;
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            margin-bottom: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            display: inline-block;
            animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
            opacity: 0;
            min-width: 200px;
            max-width: 400px;
        }
        
        .toast.success {
            background-color: #4CAF50;
            border-left: 5px solid #45a049;
        }
        
        .toast.error {
            background-color: #f44336;
            border-left: 5px solid #d32f2f;
            color: white !important;
        }
        
        .toast.info {
            background-color: #2196F3;
            border-left: 5px solid #1976D2;
        }
        
        @keyframes fadeIn {
            from {opacity: 0; transform: translateY(-20px);}
            to {opacity: 1; transform: translateY(0);}
        }
        
        @keyframes fadeOut {
            from {opacity: 1; transform: translateY(0);}
            to {opacity: 0; transform: translateY(-20px);}
        }
        
        /* 导航栏助手按钮样式 */
        .nav.pull-right a[title="打开图片上传助手"]:hover {
            color: #45a049 !important;
            text-decoration: underline;
        }
        
        #custom-imgbox-container {
            margin: 20px 0;
            padding: 15px;
            border: 1px solid #444;
            border-radius: 5px;
            background-color: #222;
            color: #ddd;
            display: none;
        }
        
        #custom-imgbox-container h3 {
            margin: 0 0 15px 0;
            font-size: 16px;
            color: #fff;
        }
        
        #custom-imgbox-container textarea {
            width: 100%;
            height: 100px;
            margin-bottom: 15px;
            padding: 8px;
            box-sizing: border-box;
            border: 1px solid #444;
            border-radius: 4px;
            background-color: #333;
            color: #fff;
        }
        
        #custom-imgbox-container button:not(.tab-button) {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 8px 15px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin-right: 10px;
            margin-bottom: 10px;
            cursor: pointer;
            border-radius: 4px;
        }
        
        #custom-imgbox-container button.blue-btn {
            background-color: #2196F3;
        }
        
        #custom-imgbox-container button.orange-btn {
            background-color: #ff9800;
        }
        
        #custom-imgbox-container button.red-btn {
            background-color: #f44336;
        }
        
        #custom-imgbox-container button.gray-btn {
            background-color: #444;
        }
        
        #imgbox-status {
            margin-top: 15px;
            padding: 10px;
            border-radius: 4px;
            background-color: #333;
            display: none;
        }
        
        #imgbox-results, #imgbox-extracted-links {
            width: 100%;
            max-height: 200px;
            overflow-y: auto;
            margin-bottom: 15px;
            padding: 8px;
            box-sizing: border-box;
            border: 1px solid #444;
            border-radius: 4px;
            background-color: #333;
        }
        
        .result-item {
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #444;
        }
        
        .result-item img {
            max-width: 50px;
            max-height: 50px;
            margin-right: 10px;
            border: 1px solid #555;
        }
        
        .result-item a {
            color: #4CAF50;
            text-decoration: none;
        }
        
        .result-item a:hover {
            text-decoration: underline;
        }
        
        .error {
            color: #f44336;
        }
        
        .section-title {
            margin-top: 15px;
            margin-bottom: 5px;
            font-weight: bold;
            color: #fff;
        }
        
        /* 标签页样式 */
        .tab-container {
            width: 100%;
            margin-bottom: 15px;
            border-radius: 5px;
            overflow: hidden;
            background-color: #222;
            border: 1px solid #444;
        }
        
        .tab-buttons {
            display: flex;
            background-color: #2a2a2a;
        }
        
        .tab-button {
            padding: 12px 20px;
            background-color: #2a2a2a;
            border: none;
            color: #aaa;
            cursor: pointer;
            position: relative;
            transition: all 0.2s ease;
            font-weight: bold;
            flex: 1;
            text-align: center;
            border-right: 1px solid #333;
            border-bottom: 3px solid transparent;
        }
        
        .tab-button:last-child {
            border-right: none;
        }
        
        .tab-button:hover {
            color: white;
            background-color: #333;
        }
        
        .tab-button.active {
            color: white;
            background-color: #222;
            border-bottom: none;
        }
        
        .tab-button.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background-color: #4CAF50;
        }
        
        .tab-content {
            padding: 20px;
            background-color: #222;
            display: none;
            border-radius: 0 0 5px 5px;
        }
        
        .tab-content.active {
            display: block;
        }
    `);
    
    // 监听页面加载
    window.addEventListener('load', function() {
        // 检查是否在imgbox网站
        if (window.location.hostname.includes('imgbox.com')) {
            // 初始化脚本
            init();
            
            // 检查是否有从其他页面传递过来的图片链接
            const imageLinks = GM_getValue('HDB_images', '');
            if (imageLinks) {
                console.log('发现图片链接:', imageLinks);
                // 清空存储的链接，避免重复使用
                GM_setValue('HDB_images', '');
                
                // 延迟一下，确保页面完全加载
                setTimeout(() => {
                    // 添加UI并填充链接
                    addImgboxUI(imageLinks);
                    // 显示界面
                    document.getElementById('custom-imgbox-container').style.display = 'block';
                    GM_setValue('uiVisible', true);
                    // 激活上传标签页
                    activateTab('upload-tab');
                }, 1000);
            }
        }
    });
    
    // 将助手按钮添加到导航栏
    // 初始化脚本
    function init() {
        // 等待导航栏加载
        const waitForNav = setInterval(() => {
            const navUl = document.querySelector('.nav.pull-right');
            if (navUl) {
                clearInterval(waitForNav);
                
                // 获取保存的UI显示状态
                const uiVisible = GM_getValue('uiVisible', false);
                
                // 创建新的导航项
                const navItem = document.createElement('li');
                const navLink = document.createElement('a');
                navLink.href = 'javascript:void(0);';
                
                // 创建图标
                const icon = document.createElement('span');
                icon.className = 'helper-icon';
                icon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                </svg>`;
                
                // 添加图标和文本
                navLink.appendChild(icon);
                navLink.appendChild(document.createTextNode('图片助手'));
                navLink.title = '打开图片上传助手';
                navLink.style.color = '#4CAF50'; // 使其稍微突出
                
                navLink.onclick = function(e) {
                    e.preventDefault();
                    const customContainer = document.getElementById('custom-imgbox-container');
                    if (customContainer) {
                        // 切换显示状态
                        const newDisplayState = customContainer.style.display === 'none' ? 'block' : 'none';
                        customContainer.style.display = newDisplayState;
                        
                        // 保存状态
                        GM_setValue('uiVisible', newDisplayState === 'block');
                        
                        // 更新图标颜色
                        navLink.style.color = newDisplayState === 'block' ? '#4CAF50' : '#999';
                    } else {
                        // 初次创建界面
                        addImgboxUI();
                        GM_setValue('uiVisible', true);
                    }
                };
                
                navItem.appendChild(navLink);
                
                // 将导航项添加到导航栏
                navUl.appendChild(navItem);
                
                // 根据保存的UI状态设置导航栏图标颜色
                if (uiVisible) {
                    navLink.style.color = '#4CAF50';
                } else {
                    navLink.style.color = '#999';
                }
                
                // 如果之前设置了显示，则自动创建界面
                if (uiVisible) {
                    addImgboxUI();
                }
            }
        }, 100);
    }
    
    // 激活标签页
    function activateTab(tabId) {
        // 隐藏所有标签内容
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });
        
        // 重置所有标签按钮样式
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        // 激活选中的标签页
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
            selectedTab.classList.add('active');
            selectedTab.style.display = 'block';
        }
        
        // 激活对应的标签按钮
        const activeButton = document.querySelector(`.tab-button[data-tab-id="${tabId}"]`) || 
                             document.querySelector(`.tab-button[onclick*="'${tabId}'"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        // 将当前标签页ID保存到本地存储
        GM_setValue('activeTab', tabId);
    }
    
    // 检测页面类型并选择默认标签页
    function detectPageTypeAndSetDefaultTab() {
        // 检测是否有 BBCode 内容
        const hasBBCode = document.body.textContent.includes('[img]') || 
                          document.body.textContent.includes('[IMG]');
        
        // 如果有BBCode内容，默认打开提取标签页
        if (hasBBCode) {
            return 'extract-tab';
        }
        
        // 如果是上传页面
        if (document.querySelector('form[action*="upload"]') || 
            document.querySelector('input[type="file"]')) {
            return 'upload-tab';
        }
        
        // 如果都不是，返回上次保存的标签页或默认值
        return GM_getValue('activeTab', 'upload-tab');
    }
    
    // 添加Imgbox界面UI
    function addImgboxUI(initialLinks) {
        // 查找上传表单区域
        const uploadForm = document.querySelector('form[action*="upload"]') || 
                           document.querySelector('form#new_gallery') ||
                           document.querySelector('.container form');
        
        if (!uploadForm) {
            console.error('未找到上传表单');
            return;
        }
        
        // 创建自定义UI容器
        const customContainer = document.createElement('div');
        customContainer.id = 'custom-imgbox-container';
        
        // 根据保存的状态决定是否显示
        const uiVisible = GM_getValue('uiVisible', false);
        customContainer.style.display = uiVisible ? 'block' : 'none';
        
        // 创建标签页容器
        const tabContainer = document.createElement('div');
        tabContainer.className = 'tab-container';
        customContainer.appendChild(tabContainer);
        
        // 创建标签按钮
        const tabButtons = document.createElement('div');
        tabButtons.className = 'tab-buttons';
        tabContainer.appendChild(tabButtons);
        
        // 上传标签按钮
        const uploadTabButton = document.createElement('button');
        uploadTabButton.className = 'tab-button';
        uploadTabButton.textContent = '图片链接上传';
        uploadTabButton.dataset.tabId = 'upload-tab';
        uploadTabButton.onclick = function() {
            activateTab('upload-tab');
        };
        tabButtons.appendChild(uploadTabButton);
        
        // 提取标签按钮
        const extractTabButton = document.createElement('button');
        extractTabButton.className = 'tab-button';
        extractTabButton.textContent = 'BB代码链接提取';
        extractTabButton.dataset.tabId = 'extract-tab';
        extractTabButton.onclick = function() {
            activateTab('extract-tab');
        };
        tabButtons.appendChild(extractTabButton);
        
        // 创建上传标签内容
        const uploadTabContent = document.createElement('div');
        uploadTabContent.id = 'upload-tab';
        uploadTabContent.className = 'tab-content';
        tabContainer.appendChild(uploadTabContent);
        
        // 创建链接输入区域
        const inputLabel = document.createElement('div');
        inputLabel.textContent = '请输入图片链接（每行一个）:';
        inputLabel.className = 'section-title';
        uploadTabContent.appendChild(inputLabel);
        
        const linksInput = document.createElement('textarea');
        linksInput.id = 'imgbox-links-input';
        linksInput.placeholder = '请输入图片链接，每行一个链接';
        uploadTabContent.appendChild(linksInput);
        
        // 创建格式转换选项
        const formatContainer = document.createElement('div');
        formatContainer.className = 'format-container';
        formatContainer.style.cssText = 'margin: 10px 0; display: flex; align-items: center;';
        
        const formatLabel = document.createElement('label');
        formatLabel.textContent = '图片格式转换: ';
        formatLabel.style.marginRight = '10px';
        formatContainer.appendChild(formatLabel);
        
        const formatSelect = document.createElement('select');
        formatSelect.id = 'imgbox-format-select';
        formatSelect.style.cssText = 'padding: 5px; background-color: #333; color: white; border: 1px solid #444; border-radius: 4px;';
        
        const formats = [
            { value: 'original', text: '保持原始格式' },
            { value: 'png', text: '转换为 PNG' },
            { value: 'jpeg', text: '转换为 JPEG' }
        ];
        
        formats.forEach(format => {
            const option = document.createElement('option');
            option.value = format.value;
            option.textContent = format.text;
            formatSelect.appendChild(option);
        });
        
        // 从本地存储中读取默认格式
        const savedFormat = GM_getValue('imageFormat', 'original');
        formatSelect.value = savedFormat;
        
        // 保存选择的格式
        formatSelect.onchange = function() {
            GM_setValue('imageFormat', this.value);
        };
        
        formatContainer.appendChild(formatSelect);
        uploadTabContent.appendChild(formatContainer);
        
        // 创建自动上传选项
        const autoUploadContainer = document.createElement('div');
        autoUploadContainer.className = 'auto-upload-container';
        autoUploadContainer.style.cssText = 'margin: 10px 0; display: flex; align-items: center;';
        
        const autoUploadCheckbox = document.createElement('input');
        autoUploadCheckbox.type = 'checkbox';
        autoUploadCheckbox.id = 'imgbox-auto-upload';
        autoUploadCheckbox.style.marginRight = '5px';
        
        // 从本地存储中读取自动上传设置
        const autoUploadEnabled = GM_getValue('autoUpload', false);
        autoUploadCheckbox.checked = autoUploadEnabled;
        
        // 保存自动上传设置
        autoUploadCheckbox.onchange = function() {
            GM_setValue('autoUpload', this.checked);
        };
        
        const autoUploadLabel = document.createElement('label');
        autoUploadLabel.textContent = '自动上传';
        autoUploadLabel.htmlFor = 'imgbox-auto-upload';
        autoUploadLabel.style.cursor = 'pointer';
        
        autoUploadContainer.appendChild(autoUploadCheckbox);
        autoUploadContainer.appendChild(autoUploadLabel);
        uploadTabContent.appendChild(autoUploadContainer);
        
        // 创建按钮容器
        const uploadButtonContainer = document.createElement('div');
        uploadButtonContainer.style.cssText = 'display: flex; gap: 10px; margin-top: 10px;';
        uploadTabContent.appendChild(uploadButtonContainer);
        
        // 创建下载按钮
        const downloadButton = document.createElement('button');
        downloadButton.textContent = '下载图片并添加到上传列表';
        downloadButton.type = 'button'; // 防止触发表单提交
        downloadButton.className = 'orange-btn';
        downloadButton.onclick = function() {
            processImageLinks(linksInput.value);
        };
        uploadButtonContainer.appendChild(downloadButton);
        
        // 创建清空按钮
        const clearUploadButton = document.createElement('button');
        clearUploadButton.textContent = '清空';
        clearUploadButton.type = 'button';
        clearUploadButton.className = 'gray-btn';
        clearUploadButton.onclick = function() {
            linksInput.value = '';
            const statusDiv = document.getElementById('imgbox-status');
            if (statusDiv) statusDiv.innerHTML = '';
        };
        uploadButtonContainer.appendChild(clearUploadButton);
        
        // 创建状态显示区域
        const statusDiv = document.createElement('div');
        statusDiv.id = 'imgbox-status';
        uploadTabContent.appendChild(statusDiv);
        
        // 创建提取标签内容
        const extractTabContent = document.createElement('div');
        extractTabContent.id = 'extract-tab';
        extractTabContent.className = 'tab-content';
        tabContainer.appendChild(extractTabContent);
        
        // 创建链接提取区域
        const extractLabel = document.createElement('div');
        extractLabel.textContent = 'BB代码链接提取:';
        extractLabel.className = 'section-title';
        extractTabContent.appendChild(extractLabel);
        
        const extractTextarea = document.createElement('textarea');
        extractTextarea.id = 'imgbox-bbcode-input';
        extractTextarea.placeholder = '粘贴包含[IMG]标签的BB代码...';
        extractTabContent.appendChild(extractTextarea);
        
        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 10px; margin-top: 10px;';
        extractTabContent.appendChild(buttonContainer);
        
        // 创建提取按钮
        const extractButton = document.createElement('button');
        extractButton.textContent = '提取图片链接';
        extractButton.type = 'button';
        extractButton.className = 'orange-btn';
        extractButton.onclick = function() {
            extractImageLinks();
        };
        buttonContainer.appendChild(extractButton);
        
        // 创建自动获取按钮
        const autoGetButton = document.createElement('button');
        autoGetButton.textContent = '从页面BB-Code获取大图直链';
        autoGetButton.type = 'button';
        autoGetButton.className = 'blue-btn';
        autoGetButton.onclick = function() {
            getPageBBCode();
        };
        buttonContainer.appendChild(autoGetButton);
        
        // 创建提取结果区域
        const extractedLinksLabel = document.createElement('div');
        extractedLinksLabel.textContent = '提取结果:';
        extractedLinksLabel.className = 'section-title';
        extractTabContent.appendChild(extractedLinksLabel);
        
        const extractedLinksArea = document.createElement('div');
        extractedLinksArea.id = 'imgbox-extracted-links';
        extractTabContent.appendChild(extractedLinksArea);
        
        // 创建按钮容器
        const extractButtonContainer = document.createElement('div');
        extractButtonContainer.style.cssText = 'display: flex; gap: 10px; margin-top: 10px;';
        extractTabContent.appendChild(extractButtonContainer);
        
        // 创建复制提取结果按钮
        const copyExtractedButton = document.createElement('button');
        copyExtractedButton.textContent = '复制链接';
        copyExtractedButton.type = 'button';
        copyExtractedButton.className = 'blue-btn';
        copyExtractedButton.onclick = function() {
            copyExtractedLinks();
        };
        extractButtonContainer.appendChild(copyExtractedButton);
        
        // 创建清空按钮
        const clearAllButton = document.createElement('button');
        clearAllButton.textContent = '清空';
        clearAllButton.type = 'button';
        clearAllButton.className = 'gray-btn';
        clearAllButton.onclick = function() {
            extractTextarea.value = '';
            const extractResultsDiv = document.getElementById('extract-results');
            const extractedLinksArea = document.getElementById('imgbox-extracted-links');
            if (extractResultsDiv) extractResultsDiv.innerHTML = '';
            if (extractedLinksArea) extractedLinksArea.innerHTML = '';
        };
        extractButtonContainer.appendChild(clearAllButton);
        
        // 将自定义容器插入到上传表单之前
        uploadForm.parentNode.insertBefore(customContainer, uploadForm);
        
        // 如果有初始链接，自动处理
        if (initialLinks && typeof initialLinks === 'string' && initialLinks.trim()) {
            setTimeout(() => {
                processImageLinks(initialLinks);
            }, 1500);
        }
        
        // 检测页面类型并设置默认标签页
        const defaultTabId = detectPageTypeAndSetDefaultTab();
        activateTab(defaultTabId);
    }
    
    // 处理图片链接
    async function processImageLinks(linksText) {
        const statusDiv = document.getElementById('imgbox-status');
        statusDiv.style.display = 'block';
        statusDiv.textContent = '准备处理图片链接...';
        
        // 解析链接
        const links = linksText.trim().split(/[\n,]/).filter(link => link.trim() !== '');
        
        if (links.length === 0) {
            statusDiv.textContent = '请输入至少一个图片链接！';
            statusDiv.style.color = 'red';
            return;
        }
        
        // 查找文件输入元素
        const fileInput = document.querySelector('input[type="file"][name*="file"]');
        if (!fileInput) {
            statusDiv.textContent = '未找到文件上传输入框！';
            statusDiv.style.color = 'red';
            return;
        }
        
        // 先收集所有文件
        statusDiv.textContent = `开始处理 ${links.length} 个图片链接...`;
        statusDiv.style.color = '#4CAF50'; // 设置为统一的颜色
        const files = [];
        
        for (let i = 0; i < links.length; i++) {
            const link = links[i].trim();
            if (!link) continue;
            
            statusDiv.textContent = `下载第 ${i+1}/${links.length} 个图片: ${link}`;
            statusDiv.style.color = '#4CAF50'; // 设置为统一的颜色
            
            try {
                // 下载图片
                const file = await getImage(link);
                files.push(file);
                statusDiv.textContent = `已下载 ${files.length}/${links.length} 张图片`;
            statusDiv.style.color = '#4CAF50'; // 设置为统一的颜色
            } catch (error) {
                console.error(`下载链接 ${link} 失败:`, error);
                statusDiv.textContent = `下载链接 ${link} 失败: ${error.message}`;
            }
        }
        
        if (files.length === 0) {
            statusDiv.textContent = '没有成功下载任何图片！';
            statusDiv.style.color = 'red';
            return;
        }
        
        // 一次性添加所有文件到输入框
        statusDiv.textContent = `正在添加 ${files.length} 张图片到上传列表...`;
        statusDiv.style.color = '#4CAF50'; // 设置为统一的颜色
        addFilesToInput(fileInput, files);
        
        statusDiv.textContent = `已添加 ${files.length} 张图片到上传列表，请点击网站的上传按钮开始上传`;
        statusDiv.style.color = 'green';
    }
    
    // 提取图片链接
    function extractImageLinks() {
        const bbcodeInput = document.getElementById('imgbox-bbcode-input');
        const extractedLinksArea = document.getElementById('imgbox-extracted-links');
        
        const bbcode = bbcodeInput.value.trim();
        if (!bbcode) {
            showToast('请输入包含[IMG]标签的BB代码！', 'error');
            return;
        }
        
        // 提取[IMG]标签中的链接
        const imgRegex = /\[IMG\](.*?)\[\/IMG\]/gi;
        const matches = [];
        let match;
        
        while ((match = imgRegex.exec(bbcode)) !== null) {
            if (match[1]) {
                matches.push(match[1]);
            }
        }
        
        // 清空结果区域
        extractedLinksArea.innerHTML = '';
        
        if (matches.length === 0) {
            extractedLinksArea.innerHTML = '<div class="error">未找到任何图片链接！</div>';
            return;
        }
        
        // 显示提取的链接 - 只显示纯文本
        matches.forEach((link, index) => {
            const linkItem = document.createElement('div');
            linkItem.className = 'result-item';
            linkItem.innerHTML = `
                <div>
                    <a href="${link}" target="_blank">${link}</a>
                </div>
            `;
            extractedLinksArea.appendChild(linkItem);
        });
        
        // 显示提取结果
        extractedLinksArea.style.display = 'block';
        
        // 如果开启了自动上传模式，自动复制直链
        if (GM_getValue('autoUpload', false)) {
            setTimeout(() => {
                copyExtractedLinks();
            }, 500);
        }
    }
    
    // 从页面获取BB代码
    function getPageBBCode() {
        // 查找页面上的BB代码文本框
        const bbCodeElements = document.querySelectorAll('textarea[id="code-bb-full"]');
                
        if (bbCodeElements.length === 0) {
            showToast('未在页面上找到BB代码文本框！', 'error');
            return;
        }
        
        // 遍历所有可能的BB代码元素
        let bbCode = '';
        for (let i = 0; i < bbCodeElements.length; i++) {
            const element = bbCodeElements[i];
            const content = element.value || element.textContent;
            
            if (content && content.includes('[IMG]') && content.includes('[/IMG]')) {
                bbCode = content;
                break;
            }
        }
        
        if (!bbCode) {
            showToast('未在页面上找到包含[IMG]标签的BB代码！', 'error');
            return;
        }
        
        // 填充到BB代码输入框
        const bbcodeInput = document.getElementById('imgbox-bbcode-input');
        if (bbcodeInput) {
            bbcodeInput.value = bbCode;
            // 自动提取链接
            extractImageLinks();
        }
    }
    
    // 复制提取的链接
    function copyExtractedLinks() {
        const extractedLinksArea = document.getElementById('imgbox-extracted-links');
        const links = Array.from(extractedLinksArea.querySelectorAll('a')).map(a => a.href);
        
        if (links.length === 0) {
            showToast('没有可复制的链接！', 'error');
            return;
        }
        
        copyToClipboard(links.join('\n'));
    }
    
    // 获取图片文件
    async function getImage(url) {
        return new Promise((resolve, reject) => {
            try {
                // 尝试从URL中提取文件类型和文件名
                let fileType = 'image/jpeg'; // 默认类型
                let fileName = url.split('/').pop() || `image_${Date.now()}.jpg`;
                fileName = fileName.split('?')[0]; // 移除URL参数
                
                // 尝试从URL中提取文件扩展名
                const extMatch = url.match(/\.(jpg|jpeg|png|gif|webp)($|\?)/i);
                if (extMatch) {
                    let ext = extMatch[1].toLowerCase();
                    if (ext === 'jpg') ext = 'jpeg';
                    fileType = `image/${ext}`;
                }
                
                // 添加随机参数避免缓存
                const nocacheUrl = url + (url.includes('?') ? '&' : '?') + 'nocache=' + Math.random();
                
                // 使用GM_xmlhttpRequest下载图片
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: nocacheUrl,
                    responseType: 'blob',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                        'Referer': 'https://imgbox.com/',
                        'Origin': 'https://imgbox.com'
                    },
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            const blob = response.response;
                            
                            // 获取用户选择的格式
                            const formatSelect = document.getElementById('imgbox-format-select');
                            const selectedFormat = formatSelect ? formatSelect.value : GM_getValue('imageFormat', 'original');
                            
                            // 根据选择的格式处理图片
                            if (selectedFormat === 'original') {
                                // 保持原始格式
                                const uniqueFileName = `image_${Date.now()}_${Math.floor(Math.random() * 10000)}.${fileType.split('/')[1]}`;
                                const file = new File([blob], uniqueFileName, { type: blob.type || fileType });
                                resolve(file);
                            } else if (selectedFormat === 'png' && fileType !== 'image/png') {
                                // 转换为 PNG
                                const uniqueFileName = `image_${Date.now()}_${Math.floor(Math.random() * 10000)}.png`;
                                convertToFormat(blob, 'image/png').then(convertedBlob => {
                                    const file = new File([convertedBlob], uniqueFileName, { type: 'image/png' });
                                    resolve(file);
                                }).catch(err => {
                                    console.warn('格式转换失败，使用原始格式:', err);
                                    const file = new File([blob], uniqueFileName.replace('.png', `.${fileType.split('/')[1]}`), { type: blob.type || fileType });
                                    resolve(file);
                                });
                            } else if (selectedFormat === 'jpeg' && fileType !== 'image/jpeg') {
                                // 转换为 JPEG
                                const uniqueFileName = `image_${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`;
                                convertToFormat(blob, 'image/jpeg').then(convertedBlob => {
                                    const file = new File([convertedBlob], uniqueFileName, { type: 'image/jpeg' });
                                    resolve(file);
                                }).catch(err => {
                                    console.warn('格式转换失败，使用原始格式:', err);
                                    const file = new File([blob], uniqueFileName.replace('.jpg', `.${fileType.split('/')[1]}`), { type: blob.type || fileType });
                                    resolve(file);
                                });
                            } else {
                                // 已经是所需格式或其他情况
                                const ext = selectedFormat === 'png' ? 'png' : (selectedFormat === 'jpeg' ? 'jpg' : fileType.split('/')[1]);
                                const uniqueFileName = `image_${Date.now()}_${Math.floor(Math.random() * 10000)}.${ext}`;
                                const file = new File([blob], uniqueFileName, { type: blob.type || fileType });
                                resolve(file);
                            }
                        } else {
                            reject(new Error(`下载图片失败，HTTP状态码: ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        reject(new Error(`下载图片请求失败: ${error}`));
                    }
                });
            } catch (error) {
                reject(new Error(`处理图片URL失败: ${error.message}`));
            }
        });
    }
    
    // 通用图片格式转换函数
    function convertToFormat(imageBlob, targetFormat) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    // 如果是 PNG 格式，默认使用 24 位色彩深度（无 Alpha 通道）
                    if (targetFormat === 'image/png') {
                        // 创建一个不带透明度的上下文
                        const ctx = canvas.getContext('2d', { alpha: false });
                        // 设置白色背景（对于有透明度的区域）
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        // 绘制图片
                        ctx.drawImage(img, 0, 0);
                        
                        // 生成 24 位 PNG
                        canvas.toBlob(blob => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error(`无法从画布创建 24位 PNG Blob`));
                            }
                        }, targetFormat);
                    } 
                    // 如果是 JPEG 格式
                    else if (targetFormat === 'image/jpeg') {
                        // JPEG 不支持透明度，所以使用白色背景
                        const ctx = canvas.getContext('2d');
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0);
                        
                        // 设置 JPEG 转换质量
                        const quality = 0.92;
                        
                        canvas.toBlob(blob => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error(`无法从画布创建 JPEG Blob`));
                            }
                        }, targetFormat, quality);
                    }
                    // 其他格式或原始格式
                    else {
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        
                        canvas.toBlob(blob => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error(`无法从画布创建 ${targetFormat} Blob`));
                            }
                        }, targetFormat);
                    }
                } catch (e) {
                    reject(e);
                }
            };
            
            img.onerror = () => reject(new Error('图片加载失败'));
            img.src = URL.createObjectURL(imageBlob);
        });
    }
    
    // 批量添加文件到输入框
    function addFilesToInput(fileInput, files) {
        try {
            // 创建一个DataTransfer对象
            const dataTransfer = new DataTransfer();
            
            // 添加所有文件
            for (let i = 0; i < files.length; i++) {
                dataTransfer.items.add(files[i]);
            }
            
            // 设置文件输入的files属性
            fileInput.files = dataTransfer.files;
            
            // 触发change事件
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
            
            // 检查是否需要自动上传
            const autoUploadEnabled = GM_getValue('autoUpload', false);
            if (autoUploadEnabled) {
                // 检查是否有超大文件
                const hasOversizedFiles = files.some(file => file.size > 10 * 1024 * 1024);
                
                if (hasOversizedFiles) {
                    showToast('检测到有文件超过10MB，已取消自动上传', 'warning');
                    console.warn('取消自动上传：有文件超过10MB');
                } else {
                    // 查找上传按钮并模拟点击
                    setTimeout(() => {
                        const uploadButton = document.querySelector('button#fake-submit-button');
                        if (uploadButton) {
                            uploadButton.click();
                            showToast('已自动开始上传', 'info');
                        } else {
                            console.log('上传按钮不可用或未找到');
                        }
                    }, 1000); // 等待一秒确保文件已添加到队列
                }
            }
            
            return true;
        } catch (error) {
            console.error('批量添加文件失败:', error);
            
            // 如果批量添加失败，尝试逐个添加
            try {
                // 清空现有文件
                fileInput.value = '';
                
                // 使用模拟点击方式逐个添加文件
                for (let i = 0; i < files.length; i++) {
                    // 尝试使用DataTransfer逐个添加
                    const singleTransfer = new DataTransfer();
                    singleTransfer.items.add(files[i]);
                    fileInput.files = singleTransfer.files;
                    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
                
                return true;
            } catch (e) {
                console.error('逐个添加文件也失败:', e);
                
                // 尝试使用模拟点击的方式
                showToast('自动添加文件失败，请手动选择已下载的图片文件', 'error');
                return false;
            }
        }
    }
    
    // 显示通知
    function showToast(message, type = 'info', duration = 3000) {
        // 创建或获取通知容器
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        
        // 创建通知元素
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toast.style.opacity = '1';
        container.appendChild(toast);
        
        // 定时移除通知
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                container.removeChild(toast);
                // 如果没有通知了，移除容器
                if (container.childNodes.length === 0) {
                    document.body.removeChild(container);
                }
            }, 300);
        }, duration);
    }
    
    // 复制到剪贴板
    function copyToClipboard(text) {
        // 创建临时文本区域
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showToast(`已复制 ${text.split('\n').length} 个链接到剪贴板！`, 'success');
            } else {
                showToast('复制失败，请手动复制链接。', 'error');
            }
        } catch (err) {
            showToast('复制失败，请手动复制链接。', 'error');
        }
        
        document.body.removeChild(textarea);
    }
})();
