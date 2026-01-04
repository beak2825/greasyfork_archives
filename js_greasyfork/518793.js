// ==UserScript==
// @name         linuxdo keywords search
// @namespace    http://tampermonkey.net/
// @version      1.3
// @author       chx_1126
// @description  Add keyword search functionality
// @license      Apache-2.0
// @icon         https://linux.do/uploads/default/optimized/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994_2_32x32.png
// @match        *://linux.do/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518793/linuxdo%20keywords%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/518793/linuxdo%20keywords%20search.meta.js
// ==/UserScript==


(function() {
    'use strict';


    // 定义关键词列表
    const allKeywords = [
        'FLUX', '免费', '教程', '无偿', 'vps', '美团', 'API', 'FOFA',
        'Serv00', '上学', 'edu', 'clash', 'gemini', 'CF', '注册',
        'cocopliot', '节点', '机场', 'gpt', '甲骨文', 'oracle', 'idea',
        'oaipro', 'claude', 'cursor', 'PyCharm', '绘画', '机场推荐',
        'vpn', '密码管理器', 'Azure', 'cloudflare', '图床', '模型',
        '云服务', 'prompt', '网盘资源', '服务器', '小鸡', '龟壳',
        'YouTube', 'b站', '脚本', 'Python', 'JavaScript', 'java',
        '文章集合', '破解', 'JetBrains', '公益', '域名', '技巧',
        '逆向', 'openWebUI', '代理', 'tg', 'DeepL', '订阅',
        'cloudns', 'chatbot', '插件', 'alist', '群晖', '资源',
        '硅基流动', '博客', '2024', '提示词', '工具', 'v2ray',
        '邮箱', '签到','GLaDOS','剪切板','壁纸','newapi','4k',
        '话费','订阅爬取','哪吒面板','lobechat','google',
        'chat2api','SASS回源','接码','CherryStudio','1panel'
    ];


    // 创建关键词div
    function createKeywordDiv() {
        const keywordDiv = document.createElement('div');
        keywordDiv.id = 'keyword-search-container';
        keywordDiv.style.cssText = `
            display: none;
            position: absolute;
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            width: ${window.innerWidth <= 768 ? '90%' : '550px'};
            max-width: 300px;
            padding: 10px;
            z-index: 1000;
            max-height: 75vh;
            overflow-y: auto;
        `;


        const headerContainer = document.createElement('div');
        headerContainer.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        `;


        const titleSpan = document.createElement('span');
        titleSpan.textContent = '快捷关键词';
        titleSpan.style.cssText = `
            font-weight: bold;
            color: #333;
            font-size: 16px;
        `;


        const keywordContainer = document.createElement('div');
        keywordContainer.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: center;
        `;


        // 渲染所有关键词
        function renderKeywords() {
            keywordContainer.innerHTML = '';
            allKeywords.forEach(keyword => {
                const keywordSpan = document.createElement('span');
                keywordSpan.innerHTML = `<code style="
                    background-color: #e0f7fa;
                    border-radius: 4px;
                    padding: 4px 8px;
                    margin: 2px;
                    font-family: 'Courier New', monospace;
                    border: 1px solid #b2ebf2;
                    font-size: 12px;
                    color: #00796b;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    transition: background-color 0.3s, transform 0.3s;
                ">🔍 ${keyword}</code>`;


                keywordSpan.style.cssText = `
                    display: inline-block;
                    cursor: pointer;
                    transition: transform 0.2s;
                `;


                keywordSpan.addEventListener('click', () => {
                    window.location.href = `https://linux.do/search?q=${keyword}`;
                });


                keywordSpan.addEventListener('touchstart', (e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.querySelector('code').style.backgroundColor = '#b2ebf2';
                });


                keywordSpan.addEventListener('touchend', (e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.querySelector('code').style.backgroundColor = '#e0f7fa';
                });


                keywordContainer.appendChild(keywordSpan);
            });
        }


        // 初始渲染
        renderKeywords();
        headerContainer.appendChild(titleSpan);
        keywordDiv.appendChild(headerContainer);
        keywordDiv.appendChild(keywordContainer);
        return keywordDiv;
    }


    // 初始化脚本
    function initScript() {
        // 确保只在特定页面运行
        if (!window.location.href.includes('linux.do')) return;


        const searchContainer = document.querySelector('.search-input');
        if (!searchContainer) return;


        // 检查是否已经添加过按钮
        if (document.getElementById('keyword-tag-button')) return;


        // 创建关键词按钮
        const keywordButton = document.createElement('button');
        keywordButton.id = 'keyword-tag-button';
        keywordButton.innerHTML = '🏷️';
        keywordButton.style.cssText = `
            margin-left: 10px;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 18px;
            touch-action: manipulation        `;


        // 创建关键词div
        const keywordDiv = createKeywordDiv();
        document.body.appendChild(keywordDiv);


        // 切换关键词div显示
        function toggleKeywordDiv(show) {
    const isVisible = show !== undefined ? show : keywordDiv.style.display !== 'block';


    if (isVisible) {
        const searchContainer = document.querySelector('.search-input');
        const searchContainerRect = searchContainer.getBoundingClientRect();
        const buttonRect = keywordButton.getBoundingClientRect();


        // 计算绝对位置
        const topOffset = searchContainerRect.bottom + window.scrollY + 10;
        const leftOffset = searchContainerRect.left + window.scrollX;


        keywordDiv.style.position = 'absolute';
        keywordDiv.style.top = `${topOffset}px`;
        keywordDiv.style.left = `${leftOffset}px`;
        keywordDiv.style.width = `${searchContainerRect.width}px`;
    }


    keywordDiv.style.display = isVisible ? 'block' : 'none';
    document.body.style.overflow = isVisible ? 'hidden' : '';
}


        // 添加触摸和点击事件
        keywordButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleKeywordDiv();
        });


        // 点击页面其他区域关闭
        document.addEventListener('click', (e) => {
            if (!keywordDiv.contains(e.target) && e.target !== keywordButton) {
                toggleKeywordDiv(false);
            }
        });


        // 阻止关键词div内部点击事件冒泡
        keywordDiv.addEventListener('click', (e) => {
            e.stopPropagation();
        });


        // 移动端兼容性处理
        function handleMobileAdaptation() {
            const isMobile = window.innerWidth <= 768;


            if (isMobile) {
                keywordButton.style.fontSize = '16px';


                // 移动端输入框调整
                const searchInput = document.getElementById('search-term');
                if (searchInput) {
                    searchInput.style.fontSize = '16px';
                    searchInput.style.padding = '8px';
                }


                // 调整关键词div宽度
                keywordDiv.style.width = '90%';
                keywordDiv.style.left = '5%';
                keywordDiv.style.maxWidth = '260px';
            } else {
                keywordDiv.style.width = '580px';
                keywordDiv.style.maxWidth = '580px';
            }
        }


        // 添加按钮到搜索容器
        searchContainer.appendChild(keywordButton);


        // 处理移动端适配
        handleMobileAdaptation();
        window.addEventListener('resize', handleMobileAdaptation);


       // 添加滚动事件处理
        window.addEventListener('scroll', () => {
            if (keywordDiv.style.display === 'block') {
                const searchContainer = document.querySelector('.search-input');
                const searchContainerRect = searchContainer.getBoundingClientRect();
                const buttonRect = keywordButton.getBoundingClientRect();


                // 重新计算绝对位置
                const topOffset = searchContainerRect.bottom + window.scrollY + 10;
                const leftOffset = searchContainerRect.left + window.scrollX;


                keywordDiv.style.position = 'absolute';
                keywordDiv.style.top = `${topOffset}px`;
                keywordDiv.style.left = `${leftOffset}px`;
                keywordDiv.style.width = `${searchContainerRect.width}px`;
            }
        });
    }


    // 使用 MutationObserver 监听页面变化
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                initScript();
                break;
            }
        }
    });


    // 配置观察选项
    const config = {
        childList: true,
        subtree: true
    };


    // 开始观察
    observer.observe(document.body, config);


    // 页面加载后初始化
    window.addEventListener('load', initScript);


    // 添加触摸事件支持
    document.addEventListener('touchstart', (e) => {
        // 可以在这里添加一些触摸事件的全局处理
    }, { passive: false });
})();