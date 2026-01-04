// ==UserScript==
// @name         抖音小红书B站视频链接采集器
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在抖音、小红书、B站的作者主页采集当前作者所有视频的访问链接
// @author       Ksr Cursor
// @match        *://*.douyin.com/user/*
// @match        *://*.xiaohongshu.com/user/profile/*
// @match        *://space.bilibili.com/*/upload/video
// @grant        GM_setClipboard
// @run-at       document-end
// @license      GPL-3.0-or-later

// @downloadURL https://update.greasyfork.org/scripts/538444/%E6%8A%96%E9%9F%B3%E5%B0%8F%E7%BA%A2%E4%B9%A6B%E7%AB%99%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E9%87%87%E9%9B%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/538444/%E6%8A%96%E9%9F%B3%E5%B0%8F%E7%BA%A2%E4%B9%A6B%E7%AB%99%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E9%87%87%E9%9B%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .ksr-collect-btn {
            padding: 8px 16px;
            background-color: #FF2B2B;
            color: white;
            font-size: 14px;
            font-weight: bold;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s;
            margin-left: 10px;
        }
        .ksr-collect-btn:hover {
            background-color: #FF0000;
        }
        .ksr-toast {
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 10px 20px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            border-radius: 4px;
            z-index: 1000000;
            opacity: 0;
            transition: opacity 0.3s;
            font-weight: bold;
            font-size: 16px;
        }
        .ksr-toast.show {
            opacity: 1;
        }
        .ksr-float-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 15px;
            background-color: #FF2B2B;
            color: white;
            font-size: 14px;
            font-weight: bold;
            border: 2px solid white;
            border-radius: 4px;
            cursor: pointer;
            z-index: 9999999;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
    `;
    document.head.appendChild(style);

    // 创建提示气泡
    const toast = document.createElement('div');
    toast.className = 'ksr-toast';
    toast.textContent = '已复制';
    document.body.appendChild(toast);

    // 显示气泡提示
    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    // 复制到剪贴板
    function copyToClipboard(text) {
        GM_setClipboard(text);
        showToast();
    }

    // 获取当前域名
    const currentHost = window.location.host;
    
    // 创建按钮
    function createCollectButton() {
        // 检查按钮是否已存在
        const existingBtn = document.querySelector('.ksr-collect-btn');
        if (existingBtn) return existingBtn;
        
        const collectBtn = document.createElement('button');
        collectBtn.className = 'ksr-collect-btn';
        collectBtn.textContent = '采集链接';
        collectBtn.title = '点击采集链接 (快捷键: Alt+1)';
        
        // 添加点击事件
        collectBtn.addEventListener('click', collectLinks);
        
        return collectBtn;
    }
    
    // 创建悬浮按钮（备用方案）
    function createFloatButton() {
        // 检查是否已存在
        if (document.querySelector('.ksr-float-btn')) return;
        
        const floatBtn = document.createElement('button');
        floatBtn.className = 'ksr-float-btn';
        floatBtn.textContent = '采集链接';
        floatBtn.title = '点击采集链接 (快捷键: Alt+1)';
        floatBtn.addEventListener('click', collectLinks);
        document.body.appendChild(floatBtn);
    }
    
    // 按平台插入按钮
    function insertButton() {
        if (currentHost.includes('douyin.com')) {
            insertDouyinButton();
        } else if (currentHost.includes('xiaohongshu.com')) {
            insertXiaohongshuButton();
        } else if (currentHost.includes('bilibili.com')) {
            insertBilibiliButton();
        }
    }
    
    // 为抖音寻找按钮容器的辅助函数
    function findDouyinButtonContainer() {
        const possibleContainers = [
            // 1. 尝试通过关注按钮查找
            Array.from(document.querySelectorAll('button')).filter(btn => 
                btn.textContent && (
                    btn.textContent.includes('关注') || 
                    btn.textContent.includes('已关注') || 
                    btn.textContent.includes('私信') ||
                    btn.textContent.includes('分享')
                )
            ),
            // 2. 尝试通过按钮容器类查找
            document.querySelectorAll('[class*="action"], [class*="button-container"], [class*="profile-header"], [class*="tool"]'),
            // 3. 尝试抖音常用UI组件
            document.querySelectorAll('[class*="user-info"], [class*="header-right"], [class*="operation"]')
        ];
        
        // 扁平化并过滤掉空结果
        const containers = possibleContainers
            .flat()
            .filter(el => el && el.parentNode);
        
        if (containers.length > 0) {
            // 优先考虑已有多个按钮的容器
            for (const container of containers) {
                const buttons = container.querySelectorAll('button');
                if (buttons.length >= 2) return container;
            }
            
            // 如果没有多按钮容器，返回第一个容器
            return containers[0];
        }
        
        return null;
    }
    
    // 插入抖音按钮
    function insertDouyinButton() {
        let buttonContainer = null;
        
        // 1. 先尝试通过XPath查找
        const selectors = [
            // 原始XPath
            '//*[@id="user_detail_element"]/div/div[2]/div[3]/div',
            // 备选1: 更通用的CSS选择器路径
            '//*[contains(@class, "user-info")]//*[contains(@class, "action")]',
            // 备选2: 查找按钮容器
            '//*[contains(@class, "profile-header")]//*[contains(@class, "button") or contains(@class, "operation")]',
            // 备选3: 关注按钮旁
            '//div[contains(@class, "following-button")]/parent::*',
            // 备选4: 按钮组合处
            '//button[contains(text(),"关注") or contains(text(),"私信") or contains(text(),"分享")]/parent::*'
        ];
        
        // 尝试每个XPath选择器
        for (const selector of selectors) {
            try {
                const result = document.evaluate(
                    selector,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                );
                
                if (result && result.singleNodeValue) {
                    buttonContainer = result.singleNodeValue;
                    break;
                }
            } catch (err) { /* 忽略错误 */ }
        }
        
        // 2. 如果XPath查找失败，尝试通过DOM查找
        if (!buttonContainer) {
            buttonContainer = findDouyinButtonContainer();
        }
        
        // 3. 如果找到容器，添加按钮
        if (buttonContainer) {
            buttonContainer.appendChild(createCollectButton());
            return true;
        }
        
        return false;
    }
    
    // 插入小红书按钮
    function insertXiaohongshuButton() {
        // 尝试多种选择器
        const selectors = [
            // 原始XPath
            '//*[@id="global"]/div[1]/header/div[2]/div/div[1]',
            // 主页操作区域
            '//header//button[contains(text(), "关注") or contains(text(), "私信") or contains(@class, "follow")]/parent::*',
            // 用户资料头部区域
            '//header//div[contains(@class, "user-action")]'
        ];
        
        let buttonContainer = null;
        
        // 尝试每个选择器
        for (const selector of selectors) {
            try {
                const result = document.evaluate(
                    selector,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                );
                
                if (result.singleNodeValue) {
                    buttonContainer = result.singleNodeValue;
                    break;
                }
            } catch (err) { /* 忽略错误 */ }
        }
        
        if (buttonContainer) {
            buttonContainer.appendChild(createCollectButton());
            return true;
        } else {
            setTimeout(insertXiaohongshuButton, 2000);
            return false;
        }
    }
    
    // 插入B站按钮
    function insertBilibiliButton() {
        // 检查是否已存在按钮
        if (document.querySelector('.ksr-collect-btn')) {
            return true;
        }
        
        const buttonContainer = document.evaluate(
            '//*[@id="app"]/main/div[1]/div[2]/div/div[1]/div[1]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        
        if (buttonContainer) {
            buttonContainer.appendChild(createCollectButton());
            return true;
        } else {
            setTimeout(insertBilibiliButton, 2000);
            return false;
        }
    }
    
    // 链接采集主函数
    function collectLinks() {
        if (currentHost.includes('douyin.com')) {
            collectDouyinLinks();
        } else if (currentHost.includes('xiaohongshu.com')) {
            collectXiaohongshuLinks();
        } else if (currentHost.includes('bilibili.com')) {
            collectBilibiliLinks();
        }
    }
    
    // 添加键盘快捷键 Alt+1
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === '1') {
            e.preventDefault();
            collectLinks();
        }
    });

    // 抖音视频链接采集
    function collectDouyinLinks() {
        const videos = [];
        
        try {
            // 主要方法
            const xpath = '//*[@id="user_detail_element"]/div//ul/li/div/a/@href';
            const result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
            
            let href;
            while (href = result.iterateNext()) {
                const link = href.value;
                
                // 排除非视频链接
                if (link.includes('/note/')) continue;
                
                // 完整化链接
                if (link.startsWith('/video/')) {
                    videos.push('https://www.douyin.com' + link);
                }
            }
            
            // 如果没有找到视频，尝试备用方法
            if (videos.length === 0) {
                // 通过视频卡片元素定位
                const videoCards = document.querySelectorAll('a[href*="/video/"]');
                videoCards.forEach(card => {
                    let href = card.getAttribute('href');
                    if (href && href.startsWith('/video/')) {
                        videos.push('https://www.douyin.com' + href);
                    }
                });
            }
        } catch (err) { /* 忽略错误 */ }

        if (videos.length > 0) {
            copyToClipboard(videos.join('\n'));
        } else {
            alert('未找到视频链接');
        }
    }

    // 小红书视频链接采集
    function collectXiaohongshuLinks() {
        let videos = [];
        
        try {
            // 方法1: 通过视频区块查找
            const videoSections = document.evaluate(
                "//section[.//span[contains(@class, 'play-icon')]]",
                document,
                null,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null
            );
            
            // 从每个视频区块中提取链接
            for (let i = 0; i < videoSections.snapshotLength; i++) {
                const section = videoSections.snapshotItem(i);
                const linkNode = section.querySelector('a[href]');
                
                if (linkNode) {
                    let link = linkNode.getAttribute('href');
                    
                    // 完整化链接
                    if (link.startsWith('/')) {
                        link = 'https://www.xiaohongshu.com' + link;
                    }
                    
                    videos.push(link);
                }
            }
            
            // 方法2: 如果没有找到视频，尝试备用方法
            if (videos.length === 0) {
                const cards = document.querySelectorAll('a[href^="/explore/"]');
                cards.forEach(card => {
                    // 检查是否有视频标记
                    const isVideo = card.querySelector('.play-icon, .play, [class*="video"]');
                    if (isVideo) {
                        const link = 'https://www.xiaohongshu.com' + card.getAttribute('href');
                        videos.push(link);
                    }
                });
            }
        } catch (err) { /* 忽略错误 */ }

        if (videos.length > 0) {
            copyToClipboard(videos.join('\n'));
        } else {
            alert('未找到视频链接');
        }
    }

    // B站视频链接采集
    function collectBilibiliLinks() {
        const videos = [];
        
        try {
            const xpath = '//*[@id="app"]/main/div[1]/div[2]/div/div[2]/div/div/div/div/div/div/div[2]/div[1]/a/@href';
            const result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
            
            let href;
            while (href = result.iterateNext()) {
                let link = href.value;
                
                // 完整化链接
                if (link.startsWith('//')) {
                    link = 'https:' + link;
                }
                
                // 裁切链接 - 移除查询参数
                const cleanLink = link.split('?')[0];
                
                videos.push(cleanLink);
            }
        } catch (err) { /* 忽略错误 */ }

        if (videos.length > 0) {
            copyToClipboard(videos.join('\n'));
        } else {
            alert('未找到视频链接');
        }
    }
    
    // 抖音特殊处理：尝试强制重试
    let douyinRetryCount = 0;
    const MAX_DOUYIN_RETRIES = 10;
    
    function douyinFallbackCheck() {
        // 如果当前不是抖音，跳过此步骤
        if (!currentHost.includes('douyin.com')) return;
        
        // 检查是否已经有按钮
        if (document.querySelector('.ksr-collect-btn')) return;
        
        // 尝试再次插入
        if (douyinRetryCount < MAX_DOUYIN_RETRIES) {
            const success = insertDouyinButton();
            
            // 如果成功，不再尝试
            if (success) return;
            
            // 增加重试次数，下次再尝试
            douyinRetryCount++;
            setTimeout(douyinFallbackCheck, 2000);
        } else {
            // 超过重试次数，启用备用悬浮按钮
            createFloatButton();
        }
    }
    
    // 初始化
    function initScript() {
        // 清除可能存在的旧按钮
        const oldBtn = document.querySelector('.ksr-collect-btn');
        if (oldBtn) oldBtn.remove();
        
        // 删除可能存在的旧浮动按钮
        const oldFloatBtn = document.querySelector('.ksr-float-btn');
        if (oldFloatBtn) oldFloatBtn.remove();
        
        // 插入按钮
        setTimeout(insertButton, 1000);
        
        // 专门为抖音增加延迟检测
        if (currentHost.includes('douyin.com')) {
            setTimeout(douyinFallbackCheck, 3000);
        }
    }
    
    // 监听DOM变化
    function observeDOMChanges() {
        const observer = new MutationObserver(() => {
            // 每次DOM变化后检查是否需要重新插入按钮
            if (!document.querySelector('.ksr-collect-btn') && !document.querySelector('.ksr-float-btn')) {
                clearTimeout(window.insertBtnTimer);
                window.insertBtnTimer = setTimeout(insertButton, 1000);
                
                // 为抖音特别处理
                if (currentHost.includes('douyin.com')) {
                    setTimeout(douyinFallbackCheck, 1500);
                }
            }
        });
        
        // 开始观察整个document
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 脚本初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }
    
    // 添加DOM变化观察
    setTimeout(observeDOMChanges, 2000);
})();

