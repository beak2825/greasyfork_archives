// ==UserScript==
// @name         Bilibili 广告标签添加器
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  在哔哩哔哩视频页面添加Ad标记
// @author       luzhuheng
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532398/Bilibili%20%E5%B9%BF%E5%91%8A%E6%A0%87%E7%AD%BE%E6%B7%BB%E5%8A%A0%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/532398/Bilibili%20%E5%B9%BF%E5%91%8A%E6%A0%87%E7%AD%BE%E6%B7%BB%E5%8A%A0%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 极简配置
    const config = {
        debug: true,  // 开启调试模式，方便排查问题
        serverUrl: GM_getValue('serverUrl', 'https://bilibili-ad-tag.fly.dev')  // 默认服务器地址
    };
    
    // 创建设置面板
    function createSettingsPanel() {
        // 检查是否已存在设置面板
        if (document.getElementById('bilibili-ad-settings')) {
            return;
        }
        
        // 创建设置面板容器
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'bilibili-ad-settings';
        settingsPanel.style.position = 'fixed';
        settingsPanel.style.top = '50%';
        settingsPanel.style.left = '50%';
        settingsPanel.style.transform = 'translate(-50%, -50%)';
        settingsPanel.style.backgroundColor = '#fff';
        settingsPanel.style.border = '1px solid #ccc';
        settingsPanel.style.borderRadius = '8px';
        settingsPanel.style.padding = '20px';
        settingsPanel.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
        settingsPanel.style.zIndex = '10000';
        settingsPanel.style.minWidth = '300px';
        
        // 创建标题
        const title = document.createElement('h3');
        title.textContent = 'Bilibili Ad标签设置';
        title.style.margin = '0 0 15px 0';
        title.style.color = '#fb7299';
        title.style.borderBottom = '1px solid #eee';
        title.style.paddingBottom = '10px';
        
        // 创建服务器地址输入框
        const inputContainer = document.createElement('div');
        inputContainer.style.marginBottom = '15px';
        
        const inputLabel = document.createElement('label');
        inputLabel.textContent = '服务器地址：';
        inputLabel.style.display = 'block';
        inputLabel.style.marginBottom = '5px';
        inputLabel.style.fontWeight = 'bold';
        
        const currentUrl = GM_getValue('serverUrl', 'https://bilibili-ad-tag.fly.dev');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentUrl;
        input.style.width = '100%';
        input.style.padding = '8px';
        input.style.boxSizing = 'border-box';
        input.style.border = '1px solid #ddd';
        input.style.borderRadius = '4px';
        
        inputContainer.appendChild(inputLabel);
        inputContainer.appendChild(input);
        
        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        
        // 保存按钮
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        saveButton.style.padding = '8px 15px';
        saveButton.style.backgroundColor = '#fb7299';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '4px';
        saveButton.style.cursor = 'pointer';
        
        // 重置按钮
        const resetButton = document.createElement('button');
        resetButton.textContent = '重置为默认';
        resetButton.style.padding = '8px 15px';
        resetButton.style.backgroundColor = '#f0f0f0';
        resetButton.style.color = '#666';
        resetButton.style.border = '1px solid #ddd';
        resetButton.style.borderRadius = '4px';
        resetButton.style.cursor = 'pointer';
        
        // 取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.padding = '8px 15px';
        cancelButton.style.backgroundColor = '#f0f0f0';
        cancelButton.style.color = '#666';
        cancelButton.style.border = '1px solid #ddd';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.cursor = 'pointer';
        
        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(resetButton);
        buttonContainer.appendChild(cancelButton);
        
        // 添加事件监听器
        saveButton.addEventListener('click', function() {
            const newUrl = input.value.trim();
            if (newUrl !== '') {
                GM_setValue('serverUrl', newUrl);
                config.serverUrl = newUrl; // 立即更新当前配置
                showMessage('服务器地址已更新为: ' + newUrl);
                document.body.removeChild(settingsPanel);
            } else {
                showMessage('服务器地址不能为空', 'error');
            }
        });
        
        resetButton.addEventListener('click', function() {
            const defaultUrl = 'http://8.138.20.3:8967';
            input.value = defaultUrl;
            GM_setValue('serverUrl', defaultUrl);
            config.serverUrl = defaultUrl; // 立即更新当前配置
            showMessage('服务器地址已重置为默认值');
        });
        
        cancelButton.addEventListener('click', function() {
            document.body.removeChild(settingsPanel);
        });
        
        // 组装面板
        settingsPanel.appendChild(title);
        settingsPanel.appendChild(inputContainer);
        settingsPanel.appendChild(buttonContainer);
        
        // 添加到页面
        document.body.appendChild(settingsPanel);
    }
    
    // 显示消息提示
    function showMessage(text, type = 'success') {
        const message = document.createElement('div');
        message.textContent = text;
        message.style.position = 'fixed';
        message.style.top = '10%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.padding = '10px 20px';
        message.style.backgroundColor = type === 'success' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 0, 0, 0.7)';
        message.style.color = 'white';
        message.style.borderRadius = '4px';
        message.style.zIndex = '10000';
        document.body.appendChild(message);
        
        setTimeout(() => {
            document.body.removeChild(message);
        }, 2000);
    }
    
    // 注册设置菜单
    GM_registerMenuCommand('设置服务器地址', createSettingsPanel);
    
    // 注册重置菜单
    GM_registerMenuCommand('重置为默认服务器', function() {
        const defaultUrl = 'https://bilibili-ad-tag.fly.dev';
        GM_setValue('serverUrl', defaultUrl);
        config.serverUrl = defaultUrl;
        showMessage('服务器地址已重置为默认值');
    });
    
    
    // 日志函数
    function log(message) {
        if (config.debug) {
            console.log(`[Bilibili AD标签] ${message}`);
        }
    }

    // 检查当前页面是否为视频页面
    function isVideoPage() {
        return /\/video\/[BbAa][Vv][0-9a-zA-Z]+/.test(window.location.href);
    }
    
    // 从URL中提取视频ID
    function getVideoId() {
        const match = window.location.href.match(/\/video\/([BbAa][Vv][0-9a-zA-Z]+)/);
        return match ? match[1] : null;
    }
    
    // 发送广告标记到服务器
    function sendAdTagToServer(videoId) {
        // 服务器API地址
        const apiUrl = `${config.serverUrl}/api/tag/ad`;
        
        // 创建请求数据
        const data = {
            video_id: videoId
        };
        
        // 发送POST请求
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (config.debug) {
                console.log(`[Bilibili Ad标签] 服务器响应:`, result);
            }
        })
        .catch(error => {
            if (config.debug) {
                console.error(`[Bilibili Ad标签] 发送请求失败:`, error);
            }
        });
    }
    
    // 添加广告标记工具
    function addAdTool(isAd) {
        try {
            // 检查是否已添加广告标记工具
            if (document.getElementById('bilibili-ad-tool')) {
                return;
            }
            
            // 查找视频工具栏
            const videoTool = document.querySelector('.video-tool-more-dropdown');
            
            if (!videoTool) {
                log('未找到视频工具栏元素');
                return;
            }
            
            // 获取视频ID
            const videoId = getVideoId();
            if (!videoId) {
                log('无法获取视频ID');
                return;
            }
            
            // 创建广告标记工具
            const adTool = document.createElement('div');
            adTool.id = 'bilibili-ad-tool';
            adTool.className = 'video-toolbar-right-item dropdown-item';
            
            // 创建图标容器
            const iconContainer = document.createElement('div');
            iconContainer.className = 'video-note-icon video-toolbar-item-icon';
            
            // 添加SVG图标
            iconContainer.innerHTML = `<svg t="1743880648034" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2719" width="24" height="24">
                <path d="M992 160v576H32V160h960m0-32H32c-17.6 0-32 14.4-32 32v576c0 17.6 14.4 32 32 32h960c17.6 0 32-14.4 32-32V160c0-17.6-14.4-32-32-32z" fill="" p-id="2720"></path>
                <path d="M112 880h800c9.6 0 16 6.4 16 16s-6.4 16-16 16H112c-9.6 0-16-6.4-16-16s6.4-16 16-16z" fill="" p-id="2721"></path>
                <path d="M334.4 275.2l171.2 382.4h-40l-57.6-124.8h-158.4L192 657.6H152l172.8-382.4h9.6z m-4.8 81.6l-62.4 137.6h124.8l-62.4-137.6zM563.2 657.6v-368H640c52.8 0 91.2 3.2 115.2 11.2 24 8 44.8 19.2 64 36.8 17.6 16 32 36.8 41.6 60.8 9.6 24 14.4 51.2 14.4 83.2s-8 62.4-22.4 89.6-35.2 49.6-60.8 64c-25.6 14.4-62.4 20.8-110.4 20.8h-118.4z m35.2-35.2H640c44.8 0 76.8-1.6 96-6.4s36.8-12.8 52.8-25.6c14.4-12.8 27.2-28.8 33.6-48 8-19.2 11.2-40 11.2-64s-4.8-46.4-12.8-67.2c-9.6-20.8-22.4-36.8-38.4-51.2s-36.8-22.4-59.2-27.2c-22.4-4.8-56-6.4-100.8-6.4h-25.6l1.6 296z" fill="" p-id="2722"></path>
            </svg>`;
            
            // 创建文本容器
            const textContainer = document.createElement('span');
            textContainer.className = 'video-note-info video-toolbar-item-text';
            textContainer.textContent = isAd ? '申请移除' : '广告标记';
            
            // 组装工具
            adTool.appendChild(iconContainer);
            adTool.appendChild(textContainer);

            // 添加点击事件
            adTool.addEventListener('click', function() {
                if (isAd) {
                    // 发送删除申请到服务器
                    fetch(`${config.serverUrl}/api/tag/remove-request`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ video_id: videoId })
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            const message = document.createElement('div');
                            message.textContent = '已申请移除广告标记,请等待审核';
                            message.style.position = 'fixed';
                            message.style.top = '50%';
                            message.style.left = '50%';
                            message.style.transform = 'translate(-50%, -50%)';
                            message.style.padding = '10px 20px';
                            message.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                            message.style.color = 'white';
                            message.style.borderRadius = '4px';
                            message.style.zIndex = '10000';
                            document.body.appendChild(message);
                            
                            setTimeout(() => {
                                document.body.removeChild(message);
                            }, 1000);
                        }
                    });
                } else {
                    // 发送到服务器
                    sendAdTagToServer(videoId);
                    
                    // 提示用户
                    const message = document.createElement('div');
                    message.textContent = '已标记为广告';
                    message.style.position = 'fixed';
                    message.style.top = '50%';
                    message.style.left = '50%';
                    message.style.transform = 'translate(-50%, -50%)';
                    message.style.padding = '10px 20px';
                    message.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                    message.style.color = 'white';
                    message.style.borderRadius = '4px';
                    message.style.zIndex = '10000';
                    document.body.appendChild(message);
                    
                    setTimeout(() => {
                        document.body.removeChild(message);
                    }, 1000);
                }
            });
            
            // 将广告标记工具添加到工具栏
            videoTool.appendChild(adTool);
            
            log('已添加广告标记工具');
        } catch (error) {
            // 记录详细错误信息
            log('添加广告标记工具失败: ' + error.message);
        }
    }

    // 在detailContent元素后添加test标签
    function addAdTag(isAd) {        
        try {
            // 检查是否已添加ad标签
            if (document.getElementById('bilibili-ad-tag')) {
                return;
            }
            
            if (isAd) {
                    // 查找detailContent元素
                    const detailContent = document.querySelector('.video-info-detail-content');
                    
                    if (!detailContent) {
                        log('未找到detailContent元素');
                        return;
                    }
                    
                    // 创建ad标签容器
                    const adTag = document.createElement('div');
                    adTag.id = 'bilibili-ad-tag';
                    adTag.className = 'view item'; // 使用与其他项目相同的类名
                    
                    // 创建文本容器
                    const textContainer = document.createElement('div');
                    textContainer.className = 'view-text';
                    textContainer.textContent = 'AD';

                    adTag.appendChild(textContainer);
                    
                    // 将AD标签添加到detailContent元素中
                    detailContent.appendChild(adTag);

                    // 提示用户
                    const adMessage = document.createElement('div');
                    adMessage.textContent = '该视频被标记为广告';
                    adMessage.style.position = 'fixed';
                    adMessage.style.top = '10%';
                    adMessage.style.left = '50%';
                    adMessage.style.transform = 'translate(-50%, -50%)';
                    adMessage.style.padding = '10px 20px';
                    adMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                    adMessage.style.color = 'white';
                    adMessage.style.borderRadius = '4px';
                    adMessage.style.zIndex = '10000';
                    document.body.appendChild(adMessage);

                    setTimeout(() => {
                        document.body.removeChild(adMessage);
                    }, 2000);
                }
            } catch (error) {
                // 静默失败，不影响页面功能
                log('添加AD标签失败: ' + error.message);
            }
    }
    
    // 初始化视频页面功能
    function initVideoPageFeatures() {
        // 确保视频播放器已加载
        if (!document.querySelector('video') && !document.querySelector('.bpx-player')) {
            // 如果播放器还没加载，再等待一段时间
            setTimeout(initVideoPageFeatures, 1000);
            return;
        }
        
        // 添加Ad标签并获取是否为广告
        let isAd = false;
        const videoId = getVideoId();
        if (videoId) {
            fetch(`${config.serverUrl}/api/tag/check?video_id=${videoId}`)
                .then(response => response.json())
                .then(result => {
                    isAd = result.success && result.data.isAd;
                    addAdTag(isAd);
                    addAdTool(isAd);
                })
                .catch(error => {
                    if (config.debug) {
                        console.error('查询广告标记失败:', error);
                    }
                    addAdTag(false);
                    addAdTool(false);
                });
        } else {
            addAdTag(false);
            addAdTool(false);
        }
    }
    
    // 处理页面变化
    function handlePageChange() {
        // 检查是否为视频页面
        if (isVideoPage()) {
            // 初始化视频页面功能
            initVideoPageFeatures();
        }
    }
    
    // 使用MutationObserver监听页面变化
    function setupMutationObserver() {
        // 创建一个观察器实例
        const observer = new MutationObserver((mutations) => {
            // 检查URL是否变化（哔哩哔哩是SPA应用）
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                handlePageChange();
            }
        });
        
        // 配置观察选项
        const config = { childList: true, subtree: true };
        
        // 开始观察
        observer.observe(document.body, config);
    }
    
    // 使用更安全的方式初始化
    function safeInitialize() {
        // 确保页面已完全加载
        if (document.readyState !== 'complete') {
            window.addEventListener('load', () => setTimeout(safeInitialize, 1000));
            return;
        }
        
        // 初始化时处理当前页面
        handlePageChange();
        
        // 设置页面变化监听
        setupMutationObserver();
        
        // 监听URL变化（处理浏览器前进后退）
        window.addEventListener('popstate', handlePageChange);
    }
    
    // 存储上一次URL，用于检测变化
    let lastUrl = window.location.href;
    
    // 延迟初始化，确保不干扰页面加载
    setTimeout(safeInitialize, 3000);
})();