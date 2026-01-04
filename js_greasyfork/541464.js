// ==UserScript==
// @name         百度网盘跳转增强
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为百度网盘按钮添加自动保存并跳转到AList的功能
// @author       You
// @match        https://pan.baidu.com/s/*
// @match        https://alist.000311.xyz/panbaidu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541464/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%B7%B3%E8%BD%AC%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/541464/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%B7%B3%E8%BD%AC%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    const style = document.createElement('style');
    style.textContent = `
        .custom-jump-btn {
            background: linear-gradient(45deg, #2196F3, #4CAF50);
            color: white;
            border: none;
            padding: 8px 12px;
            margin-left: 10px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            white-space: nowrap;
            min-width: 120px;
        }
        
        .custom-jump-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .custom-jump-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }
        
        .custom-float-jump-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(45deg, #2196F3, #4CAF50);
            color: white;
            border: none;
            padding: 12px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 9999;
            user-select: none;
            transition: all 0.3s ease;
            min-width: 140px;
        }
        
        .custom-float-jump-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(0,0,0,0.4);
        }
        
        .custom-float-jump-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }
        
        .baidu-float-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #2196F3, #4CAF50);
            color: white;
            border: none;
            padding: 12px 16px;
            border-radius: 8px;
            cursor: move;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 9999;
            user-select: none;
            transition: all 0.3s ease;
        }
        
        .baidu-float-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(0,0,0,0.4);
        }
        
        .baidu-float-btn:active {
            transform: scale(0.95);
        }
    `;
    document.head.appendChild(style);

    // 全局变量存储从API获取的文件夹信息
    let cachedFolderInfo = null;

    // 劫持网络请求获取文件夹信息
    function interceptBaiduAPI() {
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const response = await originalFetch.apply(this, args);
            
            // 检查是否是百度网盘的文件列表API
            if (args[0] && args[0].includes && args[0].includes('/api/list')) {
                try {
                    const clonedResponse = response.clone();
                    const data = await clonedResponse.json();
                    
                    if (data && data.list && data.list.length > 0) {
                        // 查找第一个文件夹
                        const firstFolder = data.list.find(item => item.isdir === "1");
                        if (firstFolder) {
                            cachedFolderInfo = {
                                name: firstFolder.server_filename,
                                path: firstFolder.path
                            };
                            console.log('从API获取到文件夹信息:', cachedFolderInfo);
                        }
                    }
                } catch (error) {
                    console.error('解析API响应失败:', error);
                }
            }
            
            return response;
        };

        // 同时劫持XMLHttpRequest
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;
        
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this._url = url;
            return originalXHROpen.apply(this, [method, url, ...args]);
        };
        
        XMLHttpRequest.prototype.send = function(...args) {
            const originalOnReadyStateChange = this.onreadystatechange;
            
            this.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    if (this._url && this._url.includes('/api/list')) {
                        try {
                            const data = JSON.parse(this.responseText);
                            if (data && data.list && data.list.length > 0) {
                                const firstFolder = data.list.find(item => item.isdir === "1");
                                if (firstFolder) {
                                    cachedFolderInfo = {
                                        name: firstFolder.server_filename,
                                        path: firstFolder.path
                                    };
                                    console.log('从XHR获取到文件夹信息:', cachedFolderInfo);
                                }
                            }
                        } catch (error) {
                            console.error('解析XHR响应失败:', error);
                        }
                    }
                }
                
                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(this);
                }
            };
            
            return originalXHRSend.apply(this, args);
        };
    }

    // 获取百度网盘路径名称的函数（优先使用API数据）
    function getPathName() {
        // 优先使用从API获取的文件夹信息
        if (cachedFolderInfo && cachedFolderInfo.name) {
            const finalPath = '/' + cachedFolderInfo.name;
            console.log('使用API获取的文件夹名称，最终路径:', finalPath);
            return encodeURIComponent(finalPath);
        }

        // 备选方案：从DOM获取保存路径
        const pathElement = document.querySelector('.save-path');
        if (pathElement) {
            let pathText = pathElement.textContent || pathElement.title || '';
            
            // 去掉所有不需要的文字
            pathText = pathText.replace(/保存到：/g, '');
            pathText = pathText.replace(/我的网盘/g, '');
            pathText = pathText.trim();
            
            // 如果处理后为空，尝试获取第一个文件夹名称
            if (!pathText) {
                const firstFolder = getFirstFolderName();
                if (firstFolder) {
                    pathText = firstFolder;
                    console.log('使用第一个文件夹名称:', pathText);
                } else {
                    // 如果没有文件夹，使用分享ID
                    const shareId = extractShareIdFromUrl();
                    if (shareId) {
                        pathText = shareId;
                        console.log('使用分享ID作为路径:', pathText);
                    } else {
                        pathText = 'share';
                        console.log('使用默认路径:', pathText);
                    }
                }
            } else {
                console.log('从保存路径提取到:', pathText);
            }
            
            // 在路径前添加 /
            const finalPath = '/' + pathText;
            console.log('最终路径:', finalPath);
            return encodeURIComponent(finalPath);
        }
        
        // 如果找不到路径元素，尝试获取第一个文件夹名称
        const firstFolder = getFirstFolderName();
        if (firstFolder) {
            const finalPath = '/' + firstFolder;
            console.log('从文件列表使用第一个文件夹，最终路径:', finalPath);
            return encodeURIComponent(finalPath);
        }
        
        // 如果找不到文件夹，尝试从URL获取分享链接信息
        const shareId = extractShareIdFromUrl();
        if (shareId) {
            const finalPath = '/' + shareId;
            console.log('从URL使用分享ID，最终路径:', finalPath);
            return encodeURIComponent(finalPath);
        }
        
        // 默认路径
        const defaultPath = '/share';
        console.log('使用默认路径:', defaultPath);
        return encodeURIComponent(defaultPath);
    }

    // 获取文件列表中第一个文件夹名称的函数
    function getFirstFolderName() {
        try {
            // 查找第一个文件夹元素，根据提供的HTML结构
            const firstFileItem = document.querySelector('.filename');
            if (firstFileItem) {
                let folderName = firstFileItem.textContent || firstFileItem.title || '';
                folderName = folderName.trim();
                console.log('找到第一个文件夹名称:', folderName);
                return folderName;
            }
            
            // 备选方案：查找其他可能的文件名元素
            const altSelectors = [
                '.file-name',
                '[title]',
                '.name'
            ];
            
            for (let selector of altSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    let folderName = element.textContent || element.title || '';
                    folderName = folderName.trim();
                    if (folderName) {
                        console.log('通过备选选择器找到文件夹名称:', folderName);
                        return folderName;
                    }
                }
            }
        } catch (error) {
            console.error('获取文件夹名称时出错:', error);
        }
        return null;
    }

    // 从URL提取分享ID的函数
    function extractShareIdFromUrl() {
        try {
            const url = window.location.href;
            const match = url.match(/\/s\/([^?&#]+)/);
            return match ? match[1] : null;
        } catch (error) {
            console.error('提取分享ID失败:', error);
            return null;
        }
    }

    // 自动保存并等待成功的函数
    function autoSaveAndJump() {
        // 查找保存到网盘按钮
        const saveButton = document.querySelector('.save_btn, [node-type="bottomShareSave"]');
        if (saveButton) {
            console.log('正在点击保存按钮...');
            saveButton.click();
            
            // 监听保存成功的提示
            waitForSaveSuccess();
        } else {
            console.error('未找到保存按钮');
            // 如果没找到保存按钮，直接跳转
            directJump();
        }
    }

    // 等待保存成功提示的函数
    function waitForSaveSuccess() {
        const checkInterval = setInterval(() => {
            // 查找保存成功的提示信息
            const successElements = [
                document.querySelector('.success-msg'),
                document.querySelector('.toast-success'),
                document.querySelector('[class*="success"]'),
                document.querySelector('[class*="保存成功"]')
            ];
            
            for (let element of successElements) {
                if (element && (
                    element.textContent.includes('保存成功') ||
                    element.textContent.includes('已保存') ||
                    element.textContent.includes('success')
                )) {
                    console.log('检测到保存成功，立即跳转...');
                    clearInterval(checkInterval);
                    directJump();
                    return;
                }
            }
            
            // 检查是否有新的toast提示
            const toasts = document.querySelectorAll('[class*="toast"], [class*="message"], [class*="tip"]');
            for (let toast of toasts) {
                if (toast.textContent.includes('保存成功') || toast.textContent.includes('已保存')) {
                    console.log('通过toast检测到保存成功，立即跳转...');
                    clearInterval(checkInterval);
                    directJump();
                    return;
                }
            }
        }, 500); // 每500ms检查一次
        
        // 设置超时，如果10秒内没有检测到成功，则直接跳转
        setTimeout(() => {
            clearInterval(checkInterval);
            console.log('等待超时，直接跳转...');
            directJump();
        }, 10000);
    }

    // 直接跳转函数
    function directJump() {
        const pathName = getPathName();
        const targetUrl = `https://alist.000311.xyz/panbaidu/${pathName}`;
        console.log('即将跳转到:', targetUrl);
        window.location.href = targetUrl;
    }

    // 创建跳转按钮的函数
    function createJumpButton(isFloat = false) {
        const button = document.createElement('button');
        button.textContent = '保存并跳转到AList';
        button.className = isFloat ? 'custom-float-jump-btn' : 'custom-jump-btn';
        
        button.onclick = function() {
            button.disabled = true;
            button.textContent = '正在保存...';
            autoSaveAndJump();
        };
        
        return button;
    }

    // 查找并添加按钮的函数
    function addJumpButton() {
        // 如果已经添加了按钮，不重复添加
        if (document.querySelector('.custom-jump-btn') || document.querySelector('.custom-float-jump-btn')) {
            return;
        }

        // 首先尝试找到下载按钮，将我们的按钮插入到它之后
        const downloadButton = document.querySelector('.bottom_download_btn');
        if (downloadButton) {
            const jumpButton = createJumpButton(false);
            // 将按钮插入到下载按钮之后
            downloadButton.parentNode.insertBefore(jumpButton, downloadButton.nextSibling);
            console.log('跳转按钮已添加到下载按钮旁边');
            
            // 预先检测路径，便于调试
            const pathName = getPathName();
            console.log('当前检测到的路径名:', decodeURIComponent(pathName));
            return;
        }
        
        // 如果没找到下载按钮，尝试查找其他容器
        const buttonContainers = [
            document.querySelector('.x-button-box'),
            document.querySelector('.bar'),
            document.querySelector('.module-share-bottom-bar'),
            document.querySelector('.tools-share-save-hb')?.parentNode,
            document.querySelector('.bottom_save_btn')?.parentNode
        ];
        
        for (let container of buttonContainers) {
            if (container) {
                const jumpButton = createJumpButton(false);
                container.appendChild(jumpButton);
                
                console.log('跳转按钮已添加到容器:', container.className);
                // 预先检测路径，便于调试
                const pathName = getPathName();
                console.log('当前检测到的路径名:', decodeURIComponent(pathName));
                return;
            }
        }
        
        // 如果找不到合适的容器，添加浮动按钮
        const jumpButton = createJumpButton(true);
        document.body.appendChild(jumpButton);
        console.log('跳转按钮已添加为浮动按钮');
        
        // 预先检测路径，便于调试
        const pathName = getPathName();
        console.log('当前检测到的路径名:', decodeURIComponent(pathName));
    }

    // 使用MutationObserver监听DOM变化
    function startObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    // 检查是否有新的分享操作区域
                    const shareBottomBar = document.querySelector('.module-share-bottom-bar');
                    if (shareBottomBar && !document.querySelector('.custom-jump-btn')) {
                        // 稍微延迟执行，确保DOM完全加载
                        setTimeout(addJumpButton, 500);
                    }
                }
            });
        });

        // 开始观察
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初始化对应页面的功能
    if (window.location.hostname === 'pan.baidu.com') {
        // 百度网盘页面的初始化
        console.log('百度网盘跳转脚本已加载');
        
        // 启动API劫持
        interceptBaiduAPI();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(() => {
                    addJumpButton();
                    startObserver();
                }, 1000);
            });
        } else {
            setTimeout(() => {
                addJumpButton();
                startObserver();
            }, 1000);
        }
    } else if (window.location.hostname === 'alist.000311.xyz' && window.location.pathname.startsWith('/panbaidu')) {
        // AList百度网盘页面的初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAListFeatures);
        } else {
            initAListFeatures();
        }
    }

    // AList页面功能
    function initAListFeatures() {
        if (window.location.hostname === 'alist.000311.xyz' && window.location.pathname.startsWith('/panbaidu')) {
            console.log('检测到百度网盘AList页面，初始化管理按钮...');
            createManageFloatButton();
        }
    }

    // 创建可移动的浮动管理按钮
    function createManageFloatButton() {
        // 检查是否已存在按钮
        if (document.querySelector('.baidu-float-btn')) {
            return;
        }

        const button = document.createElement('button');
        button.textContent = '百度授权';
        button.className = 'baidu-float-btn';
        
        // 添加拖拽功能
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        button.addEventListener('mousedown', function(e) {
            if (e.button === 0) { // 左键
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                startLeft = parseInt(window.getComputedStyle(button).left);
                startTop = parseInt(window.getComputedStyle(button).top);
                e.preventDefault();
            }
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const newLeft = startLeft + e.clientX - startX;
                const newTop = startTop + e.clientY - startY;
                
                // 限制在视窗范围内
                const maxLeft = window.innerWidth - button.offsetWidth;
                const maxTop = window.innerHeight - button.offsetHeight;
                
                button.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
                button.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
                button.style.right = 'auto'; // 取消right定位
            }
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
            }
        });

        // 点击跳转到管理页面
        button.addEventListener('click', function(e) {
            if (!isDragging) {
                jumpToManagePage();
            }
        });

        document.body.appendChild(button);
        console.log('管理按钮已添加');
    }

    // 跳转到百度授权页面
    function jumpToManagePage() {
        showToast('正在跳转到百度网盘授权页面...');
        
        // 1秒后跳转到百度授权页面
        setTimeout(() => {
            window.open('https://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id=hq9yQ9w9kR4YHj1kyYafLygVocobh7Sf&redirect_uri=https://alistgo.com/tool/baidu/callback&scope=basic,netdisk&qrcode=1', '_blank');
        }, 1000);
    }

    // 显示提示消息
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;
        
        // 添加动画样式
        const keyframes = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        if (!document.querySelector('#toast-keyframes-baidu')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'toast-keyframes-baidu';
            styleSheet.textContent = keyframes;
            document.head.appendChild(styleSheet);
        }
        
        document.body.appendChild(toast);
        
        // 3秒后自动消失
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }
})();
