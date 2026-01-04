// ==UserScript==
// @name         微博推送助手
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  在微博页面添加推送按钮，支持快速复制博文内容、下载图片视频资源并自动发送到自己微博。v1.4新增跨域名数据传递支持，解决www.weibo.com和weibo.com之间的数据同步问题，v1.4.1移除调试信息，代码更加简洁。
// @author       You
// @match        https://weibo.com/*
// @match        https://www.weibo.com/*
// @match        https://m.weibo.cn/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537313/%E5%BE%AE%E5%8D%9A%E6%8E%A8%E9%80%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/537313/%E5%BE%AE%E5%8D%9A%E6%8E%A8%E9%80%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 全局变量
    let downloadedFiles = [];
    let currentPostContent = '';
    let isProcessing = false;
    
    // 添加样式
    GM_addStyle(`
        .weibo-pusher-btn {
            display: inline-block !important;
            margin-left: 10px;
            padding: 4px 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 20px;
            cursor: pointer;
            font-size: 12px;
            border: none;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
            font-weight: 500;
        }
        
        .weibo-pusher-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
        
        .weibo-pusher-btn:active {
            transform: translateY(0);
        }
        
        .weibo-pusher-btn.processing {
            background: linear-gradient(135deg, #ffa726 0%, #ff7043 100%);
            cursor: not-allowed;
            animation: processing-pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes processing-pulse {
            0%, 100% { 
                opacity: 1; 
                transform: scale(1);
            }
            50% { 
                opacity: 0.8; 
                transform: scale(1.02);
            }
        }
        
        .weibo-pusher-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            z-index: 10000;
            display: none;
            backdrop-filter: blur(5px);
        }
        
        .weibo-pusher-modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            padding: 0;
        }
        
        .weibo-pusher-modal-header {
            padding: 20px 24px 16px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px 12px 0 0;
        }
        
        .weibo-pusher-modal-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
        }
        
        .weibo-pusher-modal-close {
            cursor: pointer;
            font-size: 24px;
            color: white;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        
        .weibo-pusher-modal-close:hover {
            opacity: 1;
        }
        
        .weibo-pusher-modal-body {
            padding: 24px;
        }
        
        .weibo-pusher-content-preview {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 20px;
            max-height: 200px;
            overflow-y: auto;
            white-space: pre-wrap;
            font-size: 14px;
            line-height: 1.6;
        }
        
        .weibo-pusher-media-list {
            margin-bottom: 20px;
        }
        
        .weibo-pusher-media-item {
            display: flex;
            align-items: center;
            padding: 12px;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            margin-bottom: 8px;
            background: white;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        
        .weibo-pusher-media-item:hover {
            background: #f8f9fa;
        }
        
        .weibo-pusher-media-item.selected {
            background: #e7f3ff;
            border-color: #667eea;
        }
        
        .weibo-pusher-media-preview {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 6px;
            margin-right: 12px;
        }
        
        .weibo-pusher-media-info {
            flex: 1;
            min-width: 0;
        }
        
        .weibo-pusher-media-name {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 4px;
            word-break: break-all;
        }
        
        .weibo-pusher-media-size {
            font-size: 12px;
            color: #666;
        }
        
        .weibo-pusher-media-status {
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 12px;
            margin-left: 8px;
        }
        
        .weibo-pusher-media-status.downloading {
            background: #fff3cd;
            color: #856404;
        }
        
        .weibo-pusher-media-status.completed {
            background: #d4edda;
            color: #155724;
        }
        
        .weibo-pusher-media-status.failed {
            background: #f8d7da;
            color: #721c24;
        }
        
        .weibo-pusher-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #f0f0f0;
        }
        
        .weibo-pusher-action-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
        }
        
        .weibo-pusher-action-btn.primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .weibo-pusher-action-btn.primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .weibo-pusher-action-btn.secondary {
            background: #f8f9fa;
            color: #495057;
            border: 1px solid #dee2e6;
        }
        
        .weibo-pusher-action-btn.secondary:hover {
            background: #e9ecef;
        }
        
        .weibo-pusher-action-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
        }
        
        .weibo-pusher-progress {
            margin-top: 16px;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 6px;
            font-size: 14px;
            color: #495057;
        }
        
        .weibo-pusher-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            padding: 16px 20px;
            z-index: 10001;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        }
        
        .weibo-pusher-toast.show {
            transform: translateX(0);
        }
        
        .weibo-pusher-toast.success {
            border-left: 4px solid #28a745;
        }
        
        .weibo-pusher-toast.error {
            border-left: 4px solid #dc3545;
        }
        
        .weibo-pusher-toast.info {
            border-left: 4px solid #17a2b8;
        }
    `);
    
    // 工具函数
    function showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `weibo-pusher-toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, duration);
    }
    
    // 保存内容到localStorage和Cookie用于跨页面传递
    function saveContentForPaste(content, mediaFileNames = []) {
        const data = {
            content: content,
            mediaFiles: mediaFileNames,
            timestamp: Date.now()
        };
        try {
            // 主要使用localStorage
            localStorage.setItem('weibo_pusher_content', JSON.stringify(data));
            
            // 同时保存到Cookie作为备用（设置为在.weibo.com域下共享）
            try {
                const cookieData = encodeURIComponent(JSON.stringify(data));
                document.cookie = `weibo_pusher_content=${cookieData}; path=/; domain=.weibo.com; max-age=900`; // 15分钟
            } catch (cookieError) {
                // Cookie保存失败时静默处理，localStorage成功即可
            }
        } catch (error) {
            console.error('微博推送助手: 保存数据失败', error);
        }
    }
    
    // 从Cookie获取数据
    function getDataFromCookie() {
        try {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'weibo_pusher_content') {
                    const decodedValue = decodeURIComponent(value);
                    return JSON.parse(decodedValue);
                }
            }
        } catch (error) {
            // 静默处理Cookie读取错误
        }
        return null;
    }
    
    // 获取保存的内容（不清除，只检查）
    function getSavedContent() {
        let data = null;
        
        try {
            // 首先尝试从localStorage获取
            const saved = localStorage.getItem('weibo_pusher_content');
            
            if (saved) {
                data = JSON.parse(saved);
            } else {
                // 如果localStorage没有数据，尝试从Cookie获取
                data = getDataFromCookie();
                if (data) {
                    // 将Cookie数据同步到localStorage
                    localStorage.setItem('weibo_pusher_content', JSON.stringify(data));
                }
            }
            
            if (data) {
                const age = Date.now() - data.timestamp;
                
                // 检查是否过期（15分钟）- 不删除，只是返回null
                if (age < 15 * 60 * 1000) {
                    return data;
                } else {
                    return null;
                }
            }
        } catch (error) {
            // 静默处理获取数据错误
        }
        return null;
    }
    
    // 清除保存的内容
    function clearSavedContent() {
        localStorage.removeItem('weibo_pusher_content');
        // 同时清除Cookie
        document.cookie = 'weibo_pusher_content=; path=/; domain=.weibo.com; max-age=0';
    }
    
    // 清理过期数据
    function cleanupExpiredData() {
        try {
            let hasCleanup = false;
            
            // 清理localStorage中的过期数据
            const saved = localStorage.getItem('weibo_pusher_content');
            if (saved) {
                const data = JSON.parse(saved);
                const age = Date.now() - data.timestamp;
                // 如果数据超过15分钟，清理掉
                if (age > 15 * 60 * 1000) {
                    localStorage.removeItem('weibo_pusher_content');
                    hasCleanup = true;
                }
            }
            
            // 清理Cookie中的过期数据
            const cookieData = getDataFromCookie();
            if (cookieData) {
                const age = Date.now() - cookieData.timestamp;
                if (age > 15 * 60 * 1000) {
                    document.cookie = 'weibo_pusher_content=; path=/; domain=.weibo.com; max-age=0';
                    hasCleanup = true;
                }
            }
            
            return hasCleanup;
        } catch (error) {
            // 静默处理清理错误
        }
        return false;
    }
    
    // 获取并清除保存的内容（兼容原有功能）
    function getAndClearSavedContent() {
        const data = getSavedContent();
        if (data) {
            clearSavedContent();
        }
        return data;
    }
    
    // 自动粘贴功能
    function tryAutoPaste() {
        const savedData = getSavedContent();  // 先不清除数据
        if (!savedData) {
            return false;
        }
        
        // 无论是否找到发博框，都先复制到剪贴板作为备份
        GM_setClipboard(savedData.content);
        
        // 查找微博主页的发博框 - 扩展选择器列表
        const composeSelectors = [
            // 2024年最新版微博发博框
            '.Form_input_2gtXx',
            'textarea.Form_input_2gtXx',
            '.wbpro-form textarea',
            '.Form_wbproform_3UDoi textarea',
            'div[contenteditable="true"]',
            '.woo-editable-text[contenteditable="true"]',
            // 通用contenteditable选择器（优先级更高）
            '[contenteditable="true"]:not([role="textbox"]):not(.woo-comment-input)',
            '[contenteditable="true"][placeholder*="想说"]',
            '[contenteditable="true"][placeholder*="分享"]',
            '[contenteditable="true"][placeholder*="新鲜事"]',
            // 新版微博发博框
            '.woo-box-flex textarea',
            '.woo-input-main textarea',
            '.woo-input-wrap textarea',
            '.woo-editable-text textarea',
            '.Feed_publish textarea',
            '.publish-content textarea',
            '.composer-input textarea',
            // 常见的textarea选择器
            'textarea[placeholder*="分享"]',
            'textarea[placeholder*="想说"]',
            'textarea[placeholder*="新鲜事"]',
            'textarea[placeholder*="有什么新鲜事"]',
            'textarea[placeholder*="想法"]',
            'textarea[placeholder*="今天"]',
            '.CommentInput_wrap_3s1XL textarea',
            '.publisherTextarea',
            // 主页发博区域
            '.woo-publish-main [contenteditable="true"]',
            '.publish-main [contenteditable="true"]',
            '.woo-publish-wrap [contenteditable="true"]',
            '.publish-wrap [contenteditable="true"]',
            '.composer-wrap [contenteditable="true"]',
            // 通用发博区域
            '.publish-box textarea',
            '.composer-box textarea',
            '.feed-publish textarea',
            '#Publisher textarea',
            '.wb-publisher textarea',
            '.wb-compose textarea',
            '.weibo-composer textarea',
            // 移动端适配
            '.m-publish textarea',
            '.mobile-composer textarea'
        ];
        
        let composeBox = null;
        let foundSelector = '';
        
        for (const selector of composeSelectors) {
            try {
                composeBox = document.querySelector(selector);
                if (composeBox) {
                    foundSelector = selector;
                    break;
                }
            } catch (error) {
                // 静默处理选择器错误
            }
        }
        
        if (composeBox) {
            // 设置内容
            try {
                if (composeBox.tagName.toLowerCase() === 'textarea') {
                    composeBox.value = savedData.content;
                    composeBox.dispatchEvent(new Event('input', { bubbles: true }));
                    composeBox.dispatchEvent(new Event('change', { bubbles: true }));
                    composeBox.dispatchEvent(new Event('focus', { bubbles: true }));
                } else if (composeBox.getAttribute('contenteditable') === 'true') {
                    // 对于contenteditable元素，将换行转换为<br>标签
                    const htmlContent = savedData.content.replace(/\n/g, '<br>');
                    composeBox.innerHTML = htmlContent;
                    composeBox.dispatchEvent(new Event('input', { bubbles: true }));
                    composeBox.dispatchEvent(new Event('change', { bubbles: true }));
                    composeBox.dispatchEvent(new Event('focus', { bubbles: true }));
                    // 将光标定位到末尾
                    const range = document.createRange();
                    const selection = window.getSelection();
                    range.selectNodeContents(composeBox);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                } else {
                    composeBox.textContent = savedData.content;
                    composeBox.dispatchEvent(new Event('input', { bubbles: true }));
                    composeBox.dispatchEvent(new Event('change', { bubbles: true }));
                    composeBox.dispatchEvent(new Event('focus', { bubbles: true }));
                }
                
                // 聚焦到发博框
                composeBox.focus();
                
                // 成功粘贴后清除数据
                clearSavedContent();
                
                let message = '✅ 内容已自动填入发博框并复制到剪贴板！';
                if (savedData.mediaFiles && savedData.mediaFiles.length > 0) {
                    message += `\n📁 请手动上传 ${savedData.mediaFiles.length} 个媒体文件：\n${savedData.mediaFiles.join(', ')}`;
                }
                
                showToast(message, 'success', 5000);
                return true; // 表示成功
            } catch (error) {
                // 静默处理设置内容错误
            }
        } else {
            let message = '⚠️ 未找到发博框，内容已复制到剪贴板';
            if (savedData.mediaFiles && savedData.mediaFiles.length > 0) {
                message += `\n📁 需要上传 ${savedData.mediaFiles.length} 个文件：\n${savedData.mediaFiles.join(', ')}`;
            }
            showToast(message, 'info', 5000);
        }
        
        return false; // 表示未成功粘贴
    }
    
    // 通过文本内容查找元素的辅助函数
    function findElementsByText(parentElement, searchText) {
        if (!parentElement) return [];
        
        const result = [];
        const allElements = parentElement.querySelectorAll('*');
        
        allElements.forEach(element => {
            if (element.textContent && element.textContent.includes(searchText)) {
                result.push(element);
            }
        });
        
        return result;
    }

    // 检查并展开折叠内容
    async function expandContent(element) {
        if (!element) return false;
        
        // 可能的展开按钮选择器
        const expandSelectors = [
            // 新版微博
            'button.woo-button-flat.woo-button-s[class*="ContentMore"]',
            'button.woo-button-flat.woo-button-s.ContentMore',
            'button[class*="expand"]',
            'button[class*="Expand"]',
            'div[class*="expand"]',
            'a[class*="expand"]',
            // 旧版微博
            'a[action-type="fl_unfold"]',
            '.WB_text_opt',
            '.WB_text a[onclick*="unfold"]',
            // 特殊的span展开按钮
            'span.expand',
            '.expand'
        ];
        
        // 搜索展开按钮
        let expandButton = null;
        
        // 首先尝试使用标准选择器
        for (const selector of expandSelectors) {
            try {
                expandButton = element.querySelector(selector) || element.parentNode.querySelector(selector);
                if (expandButton) {
                    break;
                }
            } catch (error) {
                console.error('微博推送助手: 选择器错误', selector, error);
            }
        }
        
        // 如果没找到，尝试通过文本内容查找
        if (!expandButton) {
            // 查找包含"展开"或"展开全文"的元素
            const textButtons = [
                ...findElementsByText(element, '展开'),
                ...findElementsByText(element, '展开全文')
            ];
            
            // 筛选可能的按钮元素，包括span元素
            const possibleButtons = textButtons.filter(el => {
                const tagName = el.tagName.toLowerCase();
                return tagName === 'button' || tagName === 'a' || tagName === 'span' ||
                       el.role === 'button' || el.getAttribute('role') === 'button' ||
                       el.classList.contains('expand') || // 特别处理展开类
                       el.onclick || el.getAttribute('onclick');
            });
            
            if (possibleButtons.length > 0) {
                expandButton = possibleButtons[0];
            }
        }
        
        // 如果找到展开按钮，点击它
        if (expandButton) {
            try {
                // 对于span.expand元素尝试多种点击方式
                if (expandButton.tagName.toLowerCase() === 'span' && expandButton.classList.contains('expand')) {
                    // 方法1: 直接点击
                    expandButton.click();
                    
                    // 方法2: 创建点击事件
                    const clickEvent = document.createEvent('MouseEvents');
                    clickEvent.initEvent('click', true, true);
                    expandButton.dispatchEvent(clickEvent);
                    
                    // 方法3: 尝试点击父元素
                    if (expandButton.parentElement) {
                        expandButton.parentElement.click();
                    }
                    
                    // 方法4: 尝试移除展开元素并修改父元素样式以显示全部内容
                    const parentEl = expandButton.parentElement;
                    if (parentEl && parentEl.classList.contains('detail_wbtext_4CRf9')) {
                        // 保存原始内容但移除展开按钮
                        const fullText = parentEl.innerHTML.replace(/<span class="expand">展开<\/span>/, '');
                        parentEl.innerHTML = fullText;
                        // 移除可能的最大高度限制
                        parentEl.style.maxHeight = 'none';
                        parentEl.style.overflow = 'visible';
                    }
                } else {
                    // 正常点击
                    expandButton.click();
                }
                
                // 等待内容展开
                await new Promise(resolve => setTimeout(resolve, 800)); // 增加等待时间，确保内容展开
                return true;
            } catch (error) {
                console.error('微博推送助手: 展开内容时出错', error);
            }
        }
        
        return false;
    }
    
    // 提取博文内容
    async function extractPostContent(postElement) {
        const contentSelectors = [
            // 原有的选择器
            '.detail_wbtext_4CRf9',
            '.wbpro-feed-content .detail_text_1U10O',
            '.wbpro-feed-content',
            '.Feed_body_3R0rO .Feed_content_2YeHn',
            '.WB_text',
            '.WB_detail .WB_text',
            '[node-type="feed_list_content"]',
            '.weibo-text',
            '.m-text-box',
            // 新增对微博详情页内容的支持
            '.WB_detail_warp .WB_text',
            '.WB_detail_wrap .WB_text',
            '.detail_main_3PZZf .WB_text',
            '.detail_card_main_4fhCu .WB_text',
            '.detail_body_1Dpoa .WB_text',
            '.detail_info_4spYr .WB_text',
            '.WB_feed_type .WB_text',
            '.wb-detail .WB_text',
            '.wb-item .WB_text',
            // 新版详情页选择器
            '.Feed_main_1b1q9 .WB_text',
            '.Feed_detail_1b1q9 .WB_text',
            '.WBDetail_main_3u .WB_text',
            '.WBDetail_wrap_3u .WB_text',
            '.wbpro-detail-content .WB_text',
            '.wbpro-detail-wrapper .WB_text',
            // 通用详情页内容选择器
            '.WB_detail .WB_text',
            '.detail-content',
            '.weibo-detail-content',
            '.post-content .WB_text',
            '.wb-content',
            '.detail_text',
            '.woo-detail-content',
            '.woo-detail-text'
        ];
        
        let contentElement = null;
        for (const selector of contentSelectors) {
            contentElement = postElement.querySelector(selector);
            if (contentElement) break;
        }
        
        if (!contentElement) return '';
        
        // 先尝试展开折叠内容
        try {
            await expandContent(contentElement);
        } catch (error) {
            console.error('微博推送助手: 展开内容时出错', error);
            // 继续处理，即使展开失败，也尝试获取已有内容
        }
        
        // 创建一个副本来处理内容，避免修改原始DOM
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = contentElement.innerHTML;
        
        // 移除脚本添加的按钮
        const scriptButtons = tempContainer.querySelectorAll('.weibo-pusher-btn, .copy-btn, .extract-links-btn, .copy-format-btn');
        scriptButtons.forEach(btn => {
            if (btn.parentNode) {
                btn.parentNode.removeChild(btn);
            }
        });
        
        // 移除"收起"按钮和相关元素
        const hideElements = tempContainer.querySelectorAll([
            'a.woo-box-flex[role="button"]', // 新版收起按钮
            'button[content="收起"]', // 收起按钮
            'a[action-type="fl_fold"]', // 旧版收起按钮
            '.WB_text_opt_fold', // 旧版收起区域
            '.content_opt_fold', // 收起选项区域
            'span.expand' // 展开按钮
        ].join(', '));
        
        hideElements.forEach(el => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        
        // 单独处理包含"收起"、"展开"文本的元素
        const hideSpans = [
            ...findElementsByText(tempContainer, '收起'),
            ...findElementsByText(tempContainer, '展开'),
            ...findElementsByText(tempContainer, '展开全文')
        ];
        hideSpans.forEach(span => {
            const text = span.textContent.trim();
            if (text === '收起' || text === '展开' || text === '展开全文') {
                if (span.parentNode) {
                    span.parentNode.removeChild(span);
                }
            }
        });
        
        // 改进的文本提取方法，更好地保留换行格式
        function extractTextWithLineBreaks(element) {
            let text = '';
            
            function processNode(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    // 文本节点，直接添加内容
                    text += node.textContent;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const tagName = node.tagName.toLowerCase();
                    
                    // 在块级元素前后添加换行
                    const blockElements = ['div', 'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'];
                    const isBlockElement = blockElements.includes(tagName);
                    
                    if (isBlockElement && text && !text.endsWith('\n')) {
                        text += '\n';
                    }
                    
                    // 处理特殊的br标签
                    if (tagName === 'br') {
                        text += '\n';
                        return;
                    }
                    
                    // 递归处理子节点
                    for (let child of node.childNodes) {
                        processNode(child);
                    }
                    
                    // 在块级元素后添加换行
                    if (isBlockElement && text && !text.endsWith('\n')) {
                        text += '\n';
                    }
                }
            }
            
            processNode(element);
            return text;
        }
        
        // 使用改进的方法提取文本
        let text = extractTextWithLineBreaks(tempContainer);
        
        // 清理内容
        text = text.replace(/\s*展开全文\s*/g, '')
                  .replace(/\s*收起全文\s*/g, '')
                  .replace(/\s*全文\s*/g, '')
                  .replace(/\s*展开\s*/g, '')
                  .replace(/\s*收起\s*/g, '')
                  .replace(/📤\s*推送到我的微博\s*/g, '') // 移除脚本按钮文本
                  .replace(/[\u200B-\u200D\uFEFF]/g, '') // 移除零宽字符
                  .replace(/\n{3,}/g, '\n\n') // 合并多余换行
                  .replace(/^\s+|\s+$/g, '') // 移除首尾空白
                  .replace(/[ \t]+\n/g, '\n') // 移除行尾空格
                  .replace(/\n[ \t]+/g, '\n'); // 移除行首空格
        
        return text;
    }
    
    // 提取媒体资源
    function extractMediaResources(postElement) {
        const mediaList = [];
        
        // 生成时间戳前缀，便于用户识别下载的文件
        const timestamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '');
        const prefix = `微博推送_${timestamp}_`;
        
        // 首先尝试找到博文内容区域，限制搜索范围
        const contentSelectors = [
            // 原有的选择器
            '.detail_wbtext_4CRf9',
            '.wbpro-feed-content .detail_text_1U10O',
            '.wbpro-feed-content',
            '.Feed_body_3R0rO .Feed_content_2YeHn',
            '.WB_text',
            '.WB_detail .WB_text',
            '[node-type="feed_list_content"]',
            '.weibo-text',
            '.m-text-box',
            // 新增对微博详情页的支持
            '.WB_detail_warp .WB_text',
            '.WB_detail_wrap .WB_text',
            '.detail_main_3PZZf .WB_text',
            '.detail_card_main_4fhCu .WB_text',
            '.detail_body_1Dpoa .WB_text',
            '.detail_info_4spYr .WB_text',
            '.WB_feed_type .WB_text',
            '.wb-detail .WB_text',
            '.wb-item .WB_text',
            // 新版详情页选择器
            '.Feed_main_1b1q9 .WB_text',
            '.Feed_detail_1b1q9 .WB_text',
            '.WBDetail_main_3u .WB_text',
            '.WBDetail_wrap_3u .WB_text',
            '.wbpro-detail-content .WB_text',
            '.wbpro-detail-wrapper .WB_text',
            // 通用媒体容器
            '.detail-content',
            '.weibo-detail-content',
            '.post-content',
            '.wb-content'
        ];
        
        // 查找媒体容器（通常在内容区域的同级或父级）
        const mediaContainerSelectors = [
            // 原有的选择器
            '.wbpro-feed-content',
            '.Feed_body_3R0rO',
            '.WB_detail',
            '.WB_feed_detail',
            '.WB_cardwrap',
            '[node-type="feed_list_item"]',
            // 新增对微博详情页的支持
            '.WB_detail_warp',
            '.WB_detail_wrap',
            '.detail_main_3PZZf',
            '.detail_card_main_4fhCu',
            '.detail_body_1Dpoa',
            '.detail_info_4spYr',
            '.WB_feed_type',
            '.wb-detail',
            '.wb-item',
            // 新版详情页媒体容器
            '.Feed_main_1b1q9',
            '.Feed_detail_1b1q9',
            '.WBDetail_main_3u',
            '.WBDetail_wrap_3u',
            '.wbpro-detail-content',
            '.wbpro-detail-wrapper',
            // 通用媒体容器
            '.detail-content',
            '.weibo-detail-content',
            '.post-content',
            '.wb-content'
        ];
        
        let searchContainer = postElement;
        
        // 尝试找到更精确的搜索容器
        for (const selector of mediaContainerSelectors) {
            const container = postElement.querySelector(selector);
            if (container) {
                searchContainer = container;
                break;
            }
        }
        
        // 如果没找到专门的媒体容器，尝试找到内容区域作为搜索范围
        if (searchContainer === postElement) {
            for (const selector of contentSelectors) {
                const contentArea = postElement.querySelector(selector);
                if (contentArea && contentArea.parentElement) {
                    searchContainer = contentArea.parentElement;
                    break;
                }
            }
        }
        
        // 提取图片 - 使用更精确的选择器，排除头像等
        const imageSelectors = [
            'img[src*="sinaimg.cn"][src*="large"]',  // 优先高清图片
            'img[src*="sinaimg.cn"][src*="bmiddle"]', // 中等尺寸图片
            'img[src*="sinaimg.cn"][src*="orj360"]',  // 原图
            'img[src*="sinaimg.cn"]:not([src*="avatar"]):not([src*="head"])', // 排除头像
            'img[src*="weibo"]:not([src*="avatar"]):not([src*="head"])', // 微博图片，排除头像
            '.WB_pic img',
            '.media-pic img', 
            '.picture img', 
            '.woo-picture-img'
        ];
        
        let images = [];
        for (const selector of imageSelectors) {
            const foundImages = searchContainer.querySelectorAll(selector);
            if (foundImages.length > 0) {
                images = [...foundImages];
                break;
            }
        }
        
        images.forEach((img, index) => {
            let src = img.src;
            
            // 跳过明显不是博文内容的图片
            if (src.includes('avatar') || src.includes('head') || 
                src.includes('icon') || src.includes('emoji') ||
                img.width < 50 || img.height < 50) {
                return;
            }
            
            // 获取高清图片链接
            if (src.includes('thumbnail') || src.includes('bmiddle') || src.includes('orj360')) {
                src = src.replace(/\/thumbnail\/|\/bmiddle\/|\/orj360\//g, '/large/');
            }
            if (src.includes('?')) {
                src = src.split('?')[0];
            }
            
            mediaList.push({
                type: 'image',
                url: src,
                name: `${prefix}image_${index + 1}.jpg`,
                element: img
            });
        });
        
        // 提取视频 - 限制在搜索容器内
        const videos = searchContainer.querySelectorAll('video, .WB_video video, .media-video video');
        videos.forEach((video, index) => {
            let src = video.src || video.querySelector('source')?.src;
            if (src) {
                mediaList.push({
                    type: 'video',
                    url: src,
                    name: `${prefix}video_${index + 1}.mp4`,
                    element: video
                });
            }
        });
        
        // 提取视频链接（通过data属性）- 限制在搜索容器内
        const videoContainers = searchContainer.querySelectorAll('[video-sources], [action-data*="video"]');
        videoContainers.forEach((container, index) => {
            const videoData = container.getAttribute('video-sources') || container.getAttribute('action-data');
            if (videoData) {
                try {
                    const data = JSON.parse(videoData);
                    if (data.mp4_hd_url || data.mp4_url) {
                        mediaList.push({
                            type: 'video',
                            url: data.mp4_hd_url || data.mp4_url,
                            name: `${prefix}video_${mediaList.filter(m => m.type === 'video').length + 1}.mp4`,
                            element: container
                        });
                    }
                } catch (e) {
                    // 解析视频数据失败，跳过
                }
            }
        });
        
        return mediaList;
    }
    
    // 下载媒体文件
    function downloadMedia(mediaItem, onProgress) {
        return new Promise((resolve, reject) => {
            onProgress('downloading');
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: mediaItem.url,
                responseType: 'blob',
                headers: {
                    'Referer': 'https://weibo.com/',
                    'User-Agent': navigator.userAgent
                },
                onload: function(response) {
                    if (response.status === 200) {
                        const blob = response.response;
                        const url = URL.createObjectURL(blob);
                        
                        // 使用GM_download下载文件
                        GM_download(url, mediaItem.name, url);
                        
                        onProgress('completed');
                        resolve({
                            ...mediaItem,
                            blob: blob,
                            localUrl: url
                        });
                    } else {
                        onProgress('failed');
                        reject(new Error(`下载失败: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    onProgress('failed');
                    reject(error);
                }
            });
        });
    }
    
    // 创建推送模态框
    function createPushModal(content, mediaList) {
        const modal = document.createElement('div');
        modal.className = 'weibo-pusher-modal';
        
        modal.innerHTML = `
            <div class="weibo-pusher-modal-content">
                <div class="weibo-pusher-modal-header">
                    <h3 class="weibo-pusher-modal-title">微博推送助手</h3>
                    <span class="weibo-pusher-modal-close">&times;</span>
                </div>
                <div class="weibo-pusher-modal-body">
                    <h4>博文内容预览:</h4>
                    <div class="weibo-pusher-content-preview">${content}</div>
                    
                    <h4>媒体资源 (${mediaList.length}个): 
                        ${mediaList.length > 0 ? `<label style="font-weight: normal; font-size: 14px; margin-left: 10px;">
                            <input type="checkbox" id="selectAllMedia" checked> 全选
                        </label>` : ''}
                    </h4>
                    <div class="weibo-pusher-media-list">
                        ${mediaList.map((media, index) => `
                            <div class="weibo-pusher-media-item" data-index="${index}">
                                <label style="margin-right: 10px;">
                                    <input type="checkbox" class="media-checkbox" data-index="${index}" checked>
                                </label>
                                ${media.type === 'image' ? 
                                    `<img class="weibo-pusher-media-preview" src="${media.url}" alt="预览">` :
                                    `<div class="weibo-pusher-media-preview" style="background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #666;">📹</div>`
                                }
                                <div class="weibo-pusher-media-info">
                                    <div class="weibo-pusher-media-name">${media.name}</div>
                                    <div class="weibo-pusher-media-size">${media.type === 'image' ? '图片' : '视频'}</div>
                                </div>
                                <div class="weibo-pusher-media-status" data-status="pending">等待下载</div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="weibo-pusher-actions">
                        <button class="weibo-pusher-action-btn secondary" id="copyContentBtn">仅复制内容</button>
                        <button class="weibo-pusher-action-btn primary" id="downloadAndPushBtn">下载选中资源并推送</button>
                    </div>
                    
                    <div class="weibo-pusher-progress" id="progressInfo" style="display: none;"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 绑定事件
        const closeBtn = modal.querySelector('.weibo-pusher-modal-close');
        const copyBtn = modal.querySelector('#copyContentBtn');
        const downloadBtn = modal.querySelector('#downloadAndPushBtn');
        const progressInfo = modal.querySelector('#progressInfo');
        const selectAllCheckbox = modal.querySelector('#selectAllMedia');
        const mediaCheckboxes = modal.querySelectorAll('.media-checkbox');
        
        // 全选/取消全选功能
        if (selectAllCheckbox) {
            selectAllCheckbox.onchange = () => {
                const isChecked = selectAllCheckbox.checked;
                mediaCheckboxes.forEach(checkbox => {
                    checkbox.checked = isChecked;
                });
                updateDownloadButtonText();
                updateMediaItemStyles();
            };
        }
        
        // 单个媒体复选框变化时更新全选状态
        mediaCheckboxes.forEach(checkbox => {
            checkbox.onchange = () => {
                const checkedCount = Array.from(mediaCheckboxes).filter(cb => cb.checked).length;
                if (selectAllCheckbox) {
                    selectAllCheckbox.checked = checkedCount === mediaCheckboxes.length;
                    selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < mediaCheckboxes.length;
                }
                updateDownloadButtonText();
                updateMediaItemStyles();
            };
        });
        
        // 添加整行点击功能
        const mediaItems = modal.querySelectorAll('.weibo-pusher-media-item');
        mediaItems.forEach((item, index) => {
            item.onclick = (e) => {
                // 如果点击的是checkbox本身，不处理（避免重复触发）
                if (e.target.type === 'checkbox') return;
                
                const checkbox = item.querySelector('.media-checkbox');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            };
        });
        
        // 更新媒体项的视觉状态
        function updateMediaItemStyles() {
            mediaItems.forEach((item, index) => {
                const checkbox = item.querySelector('.media-checkbox');
                if (checkbox && checkbox.checked) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            });
        }
        
        // 初始化媒体项样式
        updateMediaItemStyles();
        
        // 更新下载按钮文本
        function updateDownloadButtonText() {
            const checkedCount = Array.from(mediaCheckboxes).filter(cb => cb.checked).length;
            if (checkedCount === 0) {
                downloadBtn.textContent = '仅推送文本内容';
            } else {
                downloadBtn.textContent = `下载选中资源(${checkedCount}个)并推送`;
            }
        }
        
        // 初始化按钮文本
        updateDownloadButtonText();
        
        closeBtn.onclick = () => {
            document.body.removeChild(modal);
        };
        
        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };
        
        copyBtn.onclick = () => {
            GM_setClipboard(content);
            showToast('内容已复制到剪贴板', 'success');
        };
        
        downloadBtn.onclick = async () => {
            // 获取选中的媒体
            const selectedMedia = mediaList.filter((_, index) => {
                const checkbox = modal.querySelector(`.media-checkbox[data-index="${index}"]`);
                return checkbox && checkbox.checked;
            });
            
            if (selectedMedia.length === 0) {
                // 如果没有选中媒体，保存内容并打开发博页面
                saveContentForPaste(content, []);
                
                // 使用当前域名跳转，确保localStorage可访问
                const targetUrl = window.location.hostname === 'www.weibo.com' ? 'https://www.weibo.com/' : 'https://weibo.com/';
                GM_openInTab(targetUrl, { active: true });
                showToast('📋 将为您打开微博主页，内容会自动填入并复制到剪贴板', 'success');
                document.body.removeChild(modal);
                return;
            }
            
            downloadBtn.disabled = true;
            downloadBtn.textContent = '下载中...';
            progressInfo.style.display = 'block';
            progressInfo.textContent = '开始下载选中的媒体资源...';
            
            try {
                downloadedFiles = [];
                const downloadedFileNames = [];
                
                for (let i = 0; i < selectedMedia.length; i++) {
                    const media = selectedMedia[i];
                    const originalIndex = mediaList.indexOf(media);
                    const statusElement = modal.querySelector(`[data-index="${originalIndex}"] .weibo-pusher-media-status`);
                    
                    progressInfo.textContent = `正在下载 ${i + 1}/${selectedMedia.length}: ${media.name}`;
                    
                    try {
                        const downloadedFile = await downloadMedia(media, (status) => {
                            statusElement.textContent = status === 'downloading' ? '下载中...' : 
                                                     status === 'completed' ? '已完成' : '下载失败';
                            statusElement.className = `weibo-pusher-media-status ${status}`;
                        });
                        
                        downloadedFiles.push(downloadedFile);
                        downloadedFileNames.push(downloadedFile.name);
                    } catch (error) {
                        console.error('下载失败:', error);
                        statusElement.textContent = '下载失败';
                        statusElement.className = 'weibo-pusher-media-status failed';
                    }
                }
                
                progressInfo.textContent = `下载完成！已下载 ${downloadedFiles.length}/${selectedMedia.length} 个文件。正在跳转到微博主页...`;
                
                // 保存内容和文件名列表，用于自动粘贴
                saveContentForPaste(content, downloadedFileNames);
                
                // 打开微博发布页面
                setTimeout(() => {
                    // 使用当前域名跳转，确保localStorage可访问
                    const targetUrl = window.location.hostname === 'www.weibo.com' ? 'https://www.weibo.com/' : 'https://weibo.com/';
                    GM_openInTab(targetUrl, { active: true });
                    showToast(`📋 下载完成！内容会自动填入并复制到剪贴板，请手动上传 ${downloadedFiles.length} 个文件`, 'success', 6000);
                    document.body.removeChild(modal);
                }, 1000);
                
            } catch (error) {
                console.error('下载过程出错:', error);
                progressInfo.textContent = '下载过程中出现错误，请重试。';
                showToast('下载失败，请重试', 'error');
            } finally {
                downloadBtn.disabled = false;
                updateDownloadButtonText();
            }
        };
        
        modal.style.display = 'block';
        return modal;
    }
    
    // 处理推送
    async function handlePush(postElement) {
        if (isProcessing) {
            showToast('正在处理中，请稍候...', 'info');
            return;
        }
        
        // 在开始新的推送前，清理可能的过期数据
        cleanupExpiredData();
        
        isProcessing = true;
        
        // 找到当前的推送按钮并更新状态
        const pushBtn = postElement.querySelector('.weibo-pusher-btn');
        const originalText = pushBtn ? pushBtn.textContent : '';
        
        try {
            // 更新按钮状态
            if (pushBtn) {
                pushBtn.textContent = '正在提取内容...';
                pushBtn.disabled = true;
                pushBtn.classList.add('processing');
            }
            
            // 提取内容和媒体
            const content = await extractPostContent(postElement);
            const mediaList = extractMediaResources(postElement);
            
            if (!content && mediaList.length === 0) {
                showToast('未找到可推送的内容', 'error');
                return;
            }
            
            currentPostContent = content;
            
            // 显示推送模态框
            createPushModal(content, mediaList);
            
        } catch (error) {
            console.error('处理推送时出错:', error);
            showToast('处理失败，请重试', 'error');
        } finally {
            // 恢复按钮状态
            if (pushBtn) {
                pushBtn.textContent = originalText;
                pushBtn.disabled = false;
                pushBtn.classList.remove('processing');
            }
            isProcessing = false;
        }
    }
    
    // 添加推送按钮
    function addPushButton(postElement) {
        // 避免重复添加
        if (postElement.querySelector('.weibo-pusher-btn')) {
            return;
        }
        
        // 查找合适的位置插入按钮
        const buttonContainers = [
            // 原有的选择器
            '.detail_wbtext_4CRf9',
            '.wbpro-feed-content',
            '.detail_text_1U10O',
            '.Feed_body_3R0rO .Feed_content_2YeHn',
            '.WB_detail .WB_text',
            '.WB_text',
            '[node-type="feed_list_content"]',
            '.weibo-text',
            // 新增对微博详情页的支持
            '.WB_detail_warp .WB_text',
            '.WB_detail_wrap .WB_text',
            '.detail_main_3PZZf .WB_text',
            '.detail_card_main_4fhCu .WB_text',
            '.detail_body_1Dpoa .WB_text',
            '.detail_info_4spYr .WB_text',
            '.WB_feed_type .WB_text',
            '.wb-detail .WB_text',
            '.wb-item .WB_text',
            // 新版详情页选择器
            '.Feed_main_1b1q9 .WB_text',
            '.Feed_detail_1b1q9 .WB_text',
            '.WBDetail_main_3u .WB_text',
            '.WBDetail_wrap_3u .WB_text',
            '.wbpro-detail-content .WB_text',
            '.wbpro-detail-wrapper .WB_text',
            // 通用详情页按钮容器
            '.detail-content',
            '.weibo-detail-content',
            '.post-content .WB_text',
            '.wb-content',
            '.detail_text',
            '.woo-detail-content',
            '.woo-detail-text'
        ];
        
        let targetContainer = null;
        for (const selector of buttonContainers) {
            targetContainer = postElement.querySelector(selector);
            if (targetContainer) {
                break;
            }
        }
        
        if (!targetContainer) {
            return;
        }
        
        // 创建推送按钮
        const pushBtn = document.createElement('button');
        pushBtn.className = 'weibo-pusher-btn';
        pushBtn.textContent = '📤 推送到我的微博';
        pushBtn.title = '复制内容并下载媒体资源，然后推送到自己的微博';
        
        pushBtn.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await handlePush(postElement);
        };
        
        // 插入按钮
        targetContainer.appendChild(pushBtn);
    }
    
    // 扫描页面并添加按钮
    function scanAndAddButtons() {
        const postSelectors = [
            // 原有的选择器
            'article.Feed_wrap_3v9LH',
            '.Feed_body_3R0rO',
            '.wbpro-feed-content',
            '.WB_detail',
            '.WB_cardwrap',
            '[node-type="feed_list_item"]',
            '.weibo-item',
            // 新增对微博详情页的支持
            '.WB_detail_warp',
            '.WB_detail_wrap',
            '.detail_main_3PZZf',
            '.detail_card_main_4fhCu',
            '.detail_body_1Dpoa',
            '.detail_info_4spYr',
            '.WB_feed_type .WB_detail',
            '.WB_feed_type .WB_cardwrap',
            '.WB_feed_type',
            '.wb-item',
            '.wb-detail',
            // 对新版详情页的支持
            '.Feed_main_1b1q9',
            '.Feed_detail_1b1q9',
            '.WBDetail_main_3u',
            '.WBDetail_wrap_3u',
            '.wbpro-detail-wrapper',
            '.wbpro-detail-content',
            // 通用容器选择器
            '[data-pid]',
            '[mid]',
            '[post-id]',
            '.post-detail',
            '.weibo-detail'
        ];
        
        postSelectors.forEach(selector => {
            const posts = document.querySelectorAll(selector);
            posts.forEach((post, index) => {
                addPushButton(post);
            });
        });
    }
    
    // 监听页面变化
    function startObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldScan = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldScan = true;
                }
            });
            
            if (shouldScan) {
                setTimeout(scanAndAddButtons, 500);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 初始化
    function init() {
        // 检查是否在微博主页，如果是则尝试自动粘贴
        if ((window.location.hostname === 'weibo.com' || window.location.hostname === 'www.weibo.com') && 
            window.location.pathname === '/') {
            // 延迟检测发博框，确保页面完全加载
            setTimeout(() => {
                tryAutoPaste();
            }, 2000);
        }
        
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    scanAndAddButtons();
                    startObserver();
                }, 1000);
            });
        } else {
            setTimeout(() => {
                scanAndAddButtons();
                startObserver();
            }, 1000);
        }
        
        // 定期扫描
        setInterval(scanAndAddButtons, 3000);
        
        // 如果在主页，检查是否有待粘贴的内容并自动粘贴
        if ((window.location.hostname === 'weibo.com' || window.location.hostname === 'www.weibo.com') && 
            window.location.pathname === '/') {
            
            // 等待页面加载完成后，检查一次是否有待粘贴内容
            setTimeout(() => {
                const savedData = getSavedContent();
                if (savedData) {
                    const success = tryAutoPaste();
                    if (!success) {
                        // 如果第一次失败，等待3秒后再试一次
                        setTimeout(() => {
                            tryAutoPaste();
                        }, 3000);
                    }
                }
            }, 3000);  // 等待3秒确保页面完全加载
        }
    }
    
    // 启动脚本
    init();
    
})(); 