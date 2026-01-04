// ==UserScript==
// @name         夸克网盘跳转增强
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  为夸克网盘按钮添加自动保存并跳转到AList的功能，支持cookie传递
// @author       You
// @match        https://pan.quark.cn/s/*
// @match        https://alist.000311.xyz/quark/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quark.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541465/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E8%B7%B3%E8%BD%AC%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/541465/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E8%B7%B3%E8%BD%AC%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    const style = document.createElement('style');
    style.textContent = `
        .custom-jump-btn {
            background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
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
        
        .countdown-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 48px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        
        .cookie-float-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
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
        
        .cookie-float-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(0,0,0,0.4);
        }
        
        .cookie-float-btn:active {
            transform: scale(0.95);
        }
    `;
    document.head.appendChild(style);

    // 获取夸克网盘cookie的函数
    function getQuarkCookie() {
        return document.cookie;
    }

    // 存储cookie到localStorage的函数
    function storeCookie(cookie) {
        try {
            localStorage.setItem('quarkCookie', cookie);
            console.log('Cookie已存储到localStorage');
        } catch (error) {
            console.error('存储Cookie失败:', error);
        }
    }

    // 从localStorage获取cookie的函数
    function getStoredCookie() {
        try {
            // 优先从URL参数获取Cookie（跨域传递）
            const urlParams = new URLSearchParams(window.location.search);
            const urlCookie = urlParams.get('qk_cookie');
            if (urlCookie) {
                // 解码base64编码的cookie
                const decodedCookie = decodeURIComponent(atob(urlCookie));
                console.log('从URL参数获取到Cookie，长度:', decodedCookie.length);
                // 同时存储到localStorage作为备份
                localStorage.setItem('quarkCookie', decodedCookie);
                return decodedCookie;
            }
            
            // 备用方案：从localStorage获取
            const storedCookie = localStorage.getItem('quarkCookie') || '';
            if (storedCookie) {
                console.log('从localStorage获取到Cookie，长度:', storedCookie.length);
            }
            return storedCookie;
        } catch (error) {
            console.error('获取存储的Cookie失败:', error);
            return '';
        }
    }

    // 获取路径名称的函数
    function getPathName() {
        const pathElement = document.querySelector('.path-name');
        if (pathElement) {
            let pathText = pathElement.textContent || pathElement.title || '';
            // 移除"全部文件/"前缀
            pathText = pathText.replace(/^全部文件\//, '');
            
            // 检查是否有"保存为文件夹"勾选框且已选中
            const packCheckbox = document.querySelector('.pack-check input[type="checkbox"]');
            if (packCheckbox && packCheckbox.checked) {
                // 情况A：如果勾选了保存为文件夹，直接使用处理后的路径
                console.log('检测到保存为文件夹已勾选，使用完整路径:', pathText);
                return encodeURIComponent(pathText);
            } else {
                // 情况B：如果没有勾选保存为文件夹，使用原路径 + 拼接第一个文件夹名称
                const firstFolder = getFirstFolderName();
                if (firstFolder) {
                    // 确保路径间有正确的分隔符
                    const finalPath = pathText ? `${pathText}/${firstFolder}` : firstFolder;
                    console.log('使用原路径拼接第一个文件夹:', finalPath);
                    return encodeURIComponent(finalPath);
                } else {
                    // 如果找不到文件夹，使用原路径
                    const finalPath = pathText || '来自：分享';
                    console.log('使用原路径:', finalPath);
                    return encodeURIComponent(finalPath);
                }
            }
        }
        return encodeURIComponent('来自：分享');
    }

    // 获取表格中第一个文件夹名称的函数
    function getFirstFolderName() {
        try {
            // 查找表格中的第一行
            const firstRow = document.querySelector('.ant-table-tbody tr.ant-table-row');
            if (firstRow) {
                // 查找文件名元素
                const filenameElement = firstRow.querySelector('.filename-text');
                if (filenameElement) {
                    let folderName = filenameElement.textContent || filenameElement.title || '';
                    // 保留完整的文件夹名称，包括方括号内容
                    folderName = folderName.trim();
                    console.log('找到第一个文件夹名称:', folderName);
                    return folderName;
                }
            }
        } catch (error) {
            console.error('获取文件夹名称时出错:', error);
        }
        return null;
    }

    // 自动保存并等待成功的函数
    function autoSaveAndJump() {
        // 先点击保存到网盘按钮
        const saveButton = document.querySelector('.share-save');
        if (saveButton) {
            console.log('正在点击保存按钮...');
            saveButton.click();
            
            // 监听保存成功的模态框
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
            // 查找保存成功的文本
            const successText = document.querySelector('.msg-wrap .text');
            if (successText && successText.textContent.includes('文件保存成功')) {
                console.log('检测到保存成功，立即跳转...');
                clearInterval(checkInterval);
                
                // 直接跳转，不等待
                directJump();
                return;
            }
            
            // 也可以通过检查模态框的存在来判断
            const modal = document.querySelector('.ant-modal-content');
            const modalTitle = document.querySelector('.ant-modal-title');
            if (modal && modalTitle && modalTitle.textContent.includes('保存文件')) {
                const msgWrap = modal.querySelector('.msg-wrap .text');
                if (msgWrap && msgWrap.textContent.includes('文件保存成功')) {
                    console.log('通过模态框检测到保存成功，立即跳转...');
                    clearInterval(checkInterval);
                    
                    // 直接跳转，不等待
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

    // 直接跳转函数（不显示倒计时）
    function directJump() {
        // 在跳转前获取夸克网盘的cookie
        const cookie = getQuarkCookie();
        
        const pathName = getPathName();
        // 将cookie作为URL参数传递，使用base64编码避免特殊字符问题
        const encodedCookie = btoa(encodeURIComponent(cookie));
        const targetUrl = `https://alist.000311.xyz/quark/${pathName}?qk_cookie=${encodedCookie}`;
        console.log('即将跳转到:', targetUrl.split('?')[0]); // 不显示完整URL以保护隐私
        console.log('已编码Cookie长度:', encodedCookie.length);
        window.location.href = targetUrl;
    }

    // 显示倒计时的函数
    function showCountdown() {
        const overlay = document.createElement('div');
        overlay.className = 'countdown-overlay';
        document.body.appendChild(overlay);

        let count = 3;
        overlay.textContent = `正在跳转... ${count}`;

        const countInterval = setInterval(() => {
            count--;
            overlay.textContent = `正在跳转... ${count}`;
            
            if (count <= 0) {
                clearInterval(countInterval);
                // 使用相同的跳转逻辑
                directJump();
            }
        }, 1000);
    }

    // 创建跳转按钮的函数
    function createJumpButton() {
        const button = document.createElement('button');
        button.textContent = '保存并跳转到AList';
        button.className = 'custom-jump-btn';
        
        button.onclick = function() {
            button.disabled = true;
            button.textContent = '正在保存...';
            autoSaveAndJump();
        };
        
        return button;
    }

    // 查找并修改按钮容器的函数
    function addJumpButton() {
        const shareDownload = document.querySelector('.share-download');
        const shareSave = document.querySelector('.share-save');
        const shareBtns = document.querySelector('.share-btns');
        
        if (shareBtns && !document.querySelector('.custom-jump-btn')) {
            // 检查是否已存在跳转按钮，避免重复添加
            const jumpButton = createJumpButton();
            
            // 将按钮添加到分享按钮容器中
            if (shareSave) {
                shareSave.parentNode.insertBefore(jumpButton, shareSave.nextSibling);
            } else if (shareDownload) {
                shareDownload.parentNode.appendChild(jumpButton);
            } else {
                shareBtns.appendChild(jumpButton);
            }
            
            console.log('跳转按钮已添加');
            // 预先检测路径，便于调试
            const pathName = getPathName();
            console.log('当前检测到的路径名:', decodeURIComponent(pathName));
        }
    }

    // 使用MutationObserver监听DOM变化
    function startObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    // 检查是否有新的分享操作区域
                    const shareOperate = document.querySelector('.share-operate');
                    if (shareOperate && !document.querySelector('.custom-jump-btn')) {
                        // 稍微延迟执行，确保DOM完全加载
                        setTimeout(addJumpButton, 500);
                    }
                    
                    // 检查表格是否已加载，如果按钮已存在但表格刚加载，更新路径信息
                    const table = document.querySelector('.ant-table-tbody');
                    const existingButton = document.querySelector('.custom-jump-btn');
                    if (table && existingButton && !existingButton.disabled) {
                        console.log('表格内容已更新，重新检测路径');
                        const pathName = getPathName();
                        console.log('更新后的路径名:', decodeURIComponent(pathName));
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

    console.log('夸克网盘跳转脚本已加载');

    // AList页面功能
    function initAListFeatures() {
        if (window.location.hostname === 'alist.000311.xyz') {
            console.log('检测到AList页面，初始化Cookie按钮...');
            
            // 立即检查并处理URL中的Cookie参数
            const cookie = getStoredCookie();
            if (cookie) {
                console.log('成功获取Cookie，长度:', cookie.length);
                // 清理URL参数（可选，保持URL整洁）
                cleanUrlParameters();
            }
            
            createCookieFloatButton();
        }
    }

    // 清理URL参数的函数（可选）
    function cleanUrlParameters() {
        try {
            const url = new URL(window.location);
            if (url.searchParams.has('qk_cookie')) {
                url.searchParams.delete('qk_cookie');
                // 使用replaceState避免页面刷新
                window.history.replaceState({}, document.title, url.toString());
                console.log('已清理URL中的Cookie参数');
            }
        } catch (error) {
            console.error('清理URL参数失败:', error);
        }
    }

    // 创建可移动的浮动Cookie按钮
    function createCookieFloatButton() {
        // 检查是否已存在按钮
        if (document.querySelector('.cookie-float-btn')) {
            return;
        }

        const button = document.createElement('button');
        button.textContent = '复制Cookie';
        button.className = 'cookie-float-btn';
        
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

        // 点击复制Cookie并跳转
        button.addEventListener('click', function(e) {
            if (!isDragging) {
                copyCookieAndJump();
            }
        });

        document.body.appendChild(button);
        console.log('Cookie浮动按钮已添加');
    }

    // 复制Cookie到剪贴板并跳转到管理页面
    function copyCookieAndJump() {
        const cookie = getStoredCookie();
        if (cookie) {
            // 复制到剪贴板
            navigator.clipboard.writeText(cookie).then(() => {
                console.log('Cookie已复制到剪贴板');
                // 显示提示
                showToast('Cookie已复制到剪贴板！');
                
                // 1秒后跳转到管理页面
                setTimeout(() => {
                    window.open('http://127.0.0.1:5244/@manage/storages/edit/21', '_blank');
                }, 1000);
            }).catch(err => {
                console.error('复制Cookie失败:', err);
                // 备用方案：使用传统方法复制
                fallbackCopyToClipboard(cookie);
            });
        } else {
            showToast('未找到存储的Cookie！', 'error');
        }
    }

    // 备用复制方法
    function fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            console.log('Cookie已复制到剪贴板（备用方法）');
            showToast('Cookie已复制到剪贴板！');
            setTimeout(() => {
                window.open('http://127.0.0.1:5244/@manage/storages/edit/21', '_blank');
            }, 1000);
        } catch (err) {
            console.error('备用复制方法也失败:', err);
            showToast('复制失败，请手动复制Cookie', 'error');
        }
        document.body.removeChild(textArea);
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
        if (!document.querySelector('#toast-keyframes')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'toast-keyframes';
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

    // 初始化对应页面的功能
    if (window.location.hostname === 'pan.quark.cn') {
        // 夸克网盘页面的初始化（原有代码）
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
    } else if (window.location.hostname === 'alist.000311.xyz') {
        // AList页面的初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAListFeatures);
        } else {
            initAListFeatures();
        }
    }
})();
