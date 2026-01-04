// ==UserScript==
// @name         ns随机背景图片加载与反代图片链接
// @namespace    http://tampermonkey.net/
// @version      0.01
// @license      GPL-3.0
// @description  在 https://www.nodeseek.com/ 网站加载随机背景图片，并为加载失败的图片加反代链接；悬浮球开关功能并记住选择；添加切换背景图按钮。
// @author       Your Name
// @match        https://www.nodeseek.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/535039/ns%E9%9A%8F%E6%9C%BA%E8%83%8C%E6%99%AF%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD%E4%B8%8E%E5%8F%8D%E4%BB%A3%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/535039/ns%E9%9A%8F%E6%9C%BA%E8%83%8C%E6%99%AF%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD%E4%B8%8E%E5%8F%8D%E4%BB%A3%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const proxyUrl = 'https://proxy.自定.xyz/';
    const placeholderBg = 'https://via.placeholder.com/1920x1080?text=Loading...'; // 占位符背景图
    const cachedBgKey = 'cachedBackgroundImage';  // 缓存的背景图键名
    const cachedTimeKey = 'cachedBgTime';  // 缓存时间的键名
    const enableCacheKey = 'enableBgCache';  // 背景图缓存启用状态
    const cacheTimeoutKey = 'cacheTimeout';  // 缓存有效时间
    const apiSelectionKey = 'selectedBgApi';  // 用户选择的API

    // 从localStorage加载用户的设置
    let enableBgLoading = localStorage.getItem('enableBgLoading') === 'true';  // 是否启用背景图加载
    let enableBgCopy = localStorage.getItem('enableBgCopy') === 'true';     // 是否启用复制背景图链接
    let enableBgCache = localStorage.getItem(enableCacheKey) === 'true'; // 是否启用背景图缓存
    let cacheTimeout = parseInt(localStorage.getItem(cacheTimeoutKey)) || 60; // 缓存有效时间（默认60分钟）
    let selectedBgApi = localStorage.getItem(apiSelectionKey) || 'random';  // 默认选择随机API

    // API 列表
    const apiUrls = {
        'loli': 'https://www.loliapi.com/bg/?type=url',  // LoliAPI
        'alcy': 'https://t.alcy.cc/ycy/?json',  // AlcyCC
        'dmoe': 'https://www.dmoe.cc/random.php?return=json'  // DMOE API
    };

    // 创建一个侧边栏按钮，点击后弹出功能开关列表
    function createSidebar() {
        const sidebar = document.createElement('div');
        sidebar.style.position = 'fixed';
        sidebar.style.top = '20px';
        sidebar.style.left = '20px';
        sidebar.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        sidebar.style.color = 'white';
        sidebar.style.borderRadius = '8px';
        sidebar.style.padding = '10px';
        sidebar.style.zIndex = '1000';
        sidebar.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
        sidebar.style.width = '250px';
        sidebar.style.display = 'none';  // 初始隐藏侧边栏

        // 反代图片功能开关
        const proxyToggle = document.createElement('div');
        proxyToggle.innerHTML = `<input type="checkbox" id="enableProxy" ${enableBgCopy ? 'checked' : ''}> 反代图片`;
        proxyToggle.style.marginBottom = '10px';
        proxyToggle.addEventListener('change', function() {
            enableBgCopy = !enableBgCopy;
            localStorage.setItem('enableBgCopy', enableBgCopy);  // 保存设置
            showNotification(`反代图片功能已${enableBgCopy ? '启用' : '禁用'}`);
        });

        // 背景图加载功能开关
        const bgToggle = document.createElement('div');
        bgToggle.innerHTML = `<input type="checkbox" id="enableBg" ${enableBgLoading ? 'checked' : ''}> 加载背景图`;
        bgToggle.style.marginBottom = '10px';
        bgToggle.addEventListener('change', function() {
            enableBgLoading = !enableBgLoading;
            localStorage.setItem('enableBgLoading', enableBgLoading);  // 保存设置
            showNotification(`背景图加载功能已${enableBgLoading ? '启用' : '禁用'}`);
        });

        // 背景图缓存功能开关
        const cacheToggle = document.createElement('div');
        cacheToggle.innerHTML = `<input type="checkbox" id="enableCache" ${enableBgCache ? 'checked' : ''}> 使用背景图缓存`;
        cacheToggle.style.marginBottom = '10px';
        cacheToggle.addEventListener('change', function() {
            enableBgCache = !enableBgCache;
            localStorage.setItem(enableCacheKey, enableBgCache);  // 保存设置
            showNotification(`背景图缓存功能已${enableBgCache ? '启用' : '禁用'}`);
        });

        // 缓存有效时间设置
        const cacheTimeoutInput = document.createElement('div');
        cacheTimeoutInput.innerHTML = `
            <label for="cacheTimeout">缓存有效时间 (分钟):</label>
            <input type="number" id="cacheTimeout" value="${cacheTimeout}" style="width: 60px; margin-top: 10px;">
        `;
        cacheTimeoutInput.style.marginBottom = '10px';
        cacheTimeoutInput.addEventListener('input', function() {
            cacheTimeout = parseInt(document.getElementById('cacheTimeout').value) || 60;
            localStorage.setItem(cacheTimeoutKey, cacheTimeout);  // 保存设置
            showNotification(`缓存有效时间已设置为 ${cacheTimeout} 分钟`);
        });

        // 背景图API选择
        const apiSelection = document.createElement('div');
        apiSelection.innerHTML = `
            <label for="apiSelection">选择背景图API:</label>
            <select id="apiSelection">
                <option value="random" ${selectedBgApi === 'random' ? 'selected' : ''}>随机API</option>
                <option value="loli" ${selectedBgApi === 'loli' ? 'selected' : ''}>LoliAPI</option>
                <option value="alcy" ${selectedBgApi === 'alcy' ? 'selected' : ''}>AlcyCC</option>
                <option value="dmoe" ${selectedBgApi === 'dmoe' ? 'selected' : ''}>DMOE API</option>
            </select>
        `;
        apiSelection.style.marginBottom = '10px';
        apiSelection.addEventListener('change', function() {
            selectedBgApi = document.getElementById('apiSelection').value;
            localStorage.setItem(apiSelectionKey, selectedBgApi);  // 保存选择的API
            showNotification(`背景图API已切换为 ${selectedBgApi === 'random' ? '随机' : selectedBgApi === 'loli' ? 'LoliAPI' : selectedBgApi === 'alcy' ? 'AlcyCC' : 'DMOE API'}`);
        });

        // 复制背景图链接按钮
        const copyButton = document.createElement('div');
        copyButton.innerHTML = `<button id="copyBgUrlBtn" style="padding: 5px; background-color: rgba(0, 0, 0, 0.7); color: white; border: none; border-radius: 5px; cursor: pointer; width: 100%; margin-top: 10px;">复制背景图链接</button>`;
        copyButton.addEventListener('click', function() {
            if (document.body.style.backgroundImage && document.body.style.backgroundImage !== 'none') {
                const bgUrl = document.body.style.backgroundImage.slice(5, -2);  // 去掉url()
                GM_setClipboard(bgUrl);
                showNotification('背景图链接已复制');
            } else {
                showNotification('没有背景图可复制');
            }
        });

        // 切换背景图按钮
        const switchBgButton = document.createElement('div');
        switchBgButton.innerHTML = `<button id="switchBgBtn" style="padding: 5px; background-color: rgba(0, 0, 0, 0.7); color: white; border: none; border-radius: 5px; cursor: pointer; width: 100%; margin-top: 10px;">切换背景图</button>`;
        switchBgButton.addEventListener('click', function() {
            loadBackgroundImage(true);  // 强制重新加载背景图
        });

        // 将各个功能项添加到侧边栏
        sidebar.appendChild(proxyToggle);
        sidebar.appendChild(bgToggle);
        sidebar.appendChild(cacheToggle);
        sidebar.appendChild(cacheTimeoutInput);
        sidebar.appendChild(apiSelection);
        sidebar.appendChild(copyButton);
        sidebar.appendChild(switchBgButton);

        document.body.appendChild(sidebar);

        // 创建并绑定侧边栏显示/隐藏按钮
        const toggleSidebarButton = document.createElement('button');
        toggleSidebarButton.innerText = '功能菜单';
        toggleSidebarButton.style.position = 'fixed';
        toggleSidebarButton.style.top = '20px';
        toggleSidebarButton.style.left = '300px';
        toggleSidebarButton.style.padding = '10px';
        toggleSidebarButton.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        toggleSidebarButton.style.color = 'white';
        toggleSidebarButton.style.border = 'none';
        toggleSidebarButton.style.borderRadius = '5px';
        toggleSidebarButton.style.cursor = 'pointer';
        toggleSidebarButton.style.zIndex = '1001';
        toggleSidebarButton.addEventListener('click', function() {
            sidebar.style.display = sidebar.style.display === 'block' ? 'none' : 'block';
        });

        document.body.appendChild(toggleSidebarButton);
    }

    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.innerText = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '100px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        notification.style.color = 'white';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.fontSize = '14px';
        notification.style.zIndex = '999';
        notification.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = 0;
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    // 请求随机背景图片URL
    function loadBackgroundImage(forceReload = false) {
        const currentTime = new Date().getTime();
        const cachedTime = localStorage.getItem(cachedTimeKey);

        if (forceReload || !enableBgCache || !localStorage.getItem(cachedBgKey) || (cachedTime && (currentTime - cachedTime > cacheTimeout * 60000))) {
            const randomApi = selectedBgApi === 'random' ? Object.values(apiUrls)[Math.floor(Math.random() * 3)] : apiUrls[selectedBgApi];
            GM_xmlhttpRequest({
                method: 'GET',
                url: randomApi,  // 根据选择的API获取图片
                onload: function(response) {
                    let imageUrl;
                    if (randomApi === apiUrls.loli) {
                        imageUrl = response.responseText;  // LoliAPI返回图片URL
                    } else if (randomApi === apiUrls.alcy) {
                        imageUrl = response.responseText;  // AlcyCC返回图片URL
                    } else if (randomApi === apiUrls.dmoe) {
                        const data = JSON.parse(response.responseText);  // DMOE返回JSON数据
                        imageUrl = data.imgurl.replace(/\\/g, '');  // DMOE返回的图片URL需要处理
                    }
                    if (imageUrl) {
                        // 将图片URL缓存起来
                        localStorage.setItem(cachedBgKey, imageUrl);
                        localStorage.setItem(cachedTimeKey, currentTime.toString());  // 更新缓存时间

                        // 等待背景图加载完成后再替换占位符背景
                        const img = new Image();
                        img.onload = function() {
                            document.body.style.backgroundImage = `url(${imageUrl})`;
                            document.body.style.backgroundSize = '35%'; // 设置背景图大小
                            document.body.style.backgroundAttachment = 'local'; // 设置背景图滚动方式
                            document.body.style.backgroundColor = 'rgba(255, 255, 255, 0.35)'; // 设置透明度
                        };
                        img.src = imageUrl; // 触发背景图加载
                    }
                },
                onerror: function() {
                    console.error('无法获取背景图片');
                }
            });
        } else {
            // 使用缓存的背景图
            const cachedBg = localStorage.getItem(cachedBgKey);
            document.body.style.backgroundImage = `url(${cachedBg})`;
            document.body.style.backgroundSize = '35%';
            document.body.style.backgroundAttachment = 'local';
            document.body.style.backgroundColor = 'rgba(255, 255, 255, 0.35)';
        }
    }

    // 页面加载完成后执行初始化
    window.addEventListener('load', function() {
        createSidebar();  // 创建侧边栏
        if (enableBgLoading) {
            loadBackgroundImage();  // 只有在启用背景图加载时才加载背景
        }
    });
})();
