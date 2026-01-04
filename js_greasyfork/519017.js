// ==UserScript==
// @name         Medium傻瓜式一键解锁(可配置多源)bypass Medium
// @namespace    https://www.deviantart.com/yuumei
// @version      1.3
// @description  在Medium白嫖浏览付费文章,支持多个解锁源。Support for viewing paid  articles for medium.com
// @author       mibboy
// @license      GPLv3
// @icon         https://i.imgur.com/Hs7AiY2.png
// @match        *://medium.com/*
// @match        *://*.medium.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/519017/Medium%E5%82%BB%E7%93%9C%E5%BC%8F%E4%B8%80%E9%94%AE%E8%A7%A3%E9%94%81%28%E5%8F%AF%E9%85%8D%E7%BD%AE%E5%A4%9A%E6%BA%90%29bypass%20Medium.user.js
// @updateURL https://update.greasyfork.org/scripts/519017/Medium%E5%82%BB%E7%93%9C%E5%BC%8F%E4%B8%80%E9%94%AE%E8%A7%A3%E9%94%81%28%E5%8F%AF%E9%85%8D%E7%BD%AE%E5%A4%9A%E6%BA%90%29bypass%20Medium.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 默认解锁源
    const DEFAULT_SOURCES = [
        {name: 'Freedium', url: 'freedium.cfd', enabled: true},
        {name: 'ReadMedium', url: 'readmedium.com', enabled: false},
        {name: 'Scribe', url: 'scribe.rip', enabled: false}
    ];

    // 获取保存的按钮位置
    function getButtonPosition() {
        return GM_getValue('buttonPosition', {right: '20px', bottom: '20px'});
    }

    // 保存按钮位置
    function saveButtonPosition(position) {
        GM_setValue('buttonPosition', position);
    }

    // 获取保存的解锁源
    function getSources() {
        return GM_getValue('unlockerSources', DEFAULT_SOURCES);
    }

    // 保存解锁源
    function saveSources(sources) {
        GM_setValue('unlockerSources', sources);
    }

    // 创建设置面板
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'medium-unlock-settings';
        panel.innerHTML = `
            <div id="settings-panel" style="
                display: none;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.2);
                z-index: 10000;
                min-width: 300px;
                font-family: -apple-system,BlinkMacSystemFont,sans-serif;
            ">
                <h3 style="margin:0 0 15px 0;color:#333;">解锁源设置</h3>
                <div id="sources-list" style="margin-bottom:15px;max-height:300px;overflow-y:auto;"></div>
                <div style="margin-bottom:15px;">
                    <input type="text" id="new-source-name" placeholder="名称" style="margin-right:5px;padding:5px;">
                    <input type="text" id="new-source-url" placeholder="域名" style="margin-right:5px;padding:5px;">
                    <button id="add-source-btn" style="
                        background:#1a8917;
                        color:white;
                        border:none;
                        padding:5px 10px;
                        border-radius:5px;
                        cursor:pointer;
                    ">添加</button>
                </div>
                <div style="text-align:right;">
                    <button id="close-settings-btn" style="
                        background:#666;
                        color:white;
                        border:none;
                        padding:5px 15px;
                        border-radius:5px;
                        cursor:pointer;
                        margin-right:10px;
                    ">关闭</button>
                    <button id="save-settings-btn" style="
                        background:#1a8917;
                        color:white;
                        border:none;
                        padding:5px 15px;
                        border-radius:5px;
                        cursor:pointer;
                    ">保存</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // 添加事件监听
        document.getElementById('add-source-btn').addEventListener('click', addNewSource);
        document.getElementById('close-settings-btn').addEventListener('click', closeSettings);
        document.getElementById('save-settings-btn').addEventListener('click', saveSettings);
    }

    // 添加新源
    function addNewSource() {
        const nameInput = document.getElementById('new-source-name');
        const urlInput = document.getElementById('new-source-url');

        if(nameInput.value && urlInput.value) {
            const sources = getSources();
            sources.push({
                name: nameInput.value,
                url: urlInput.value,
                enabled: true
            });
            updateSourcesList(sources);
            nameInput.value = '';
            urlInput.value = '';
        }
    }

    // 关闭设置
    function closeSettings() {
        const panel = document.getElementById('settings-panel');
        if(panel) panel.style.display = 'none';
    }

    // 保存设置
    function saveSettings() {
        const sources = [];
        document.querySelectorAll('.source-item').forEach(item => {
            sources.push({
                name: item.querySelector('.source-name').textContent,
                url: item.querySelector('.source-url').textContent,
                enabled: item.querySelector('.source-enabled').checked
            });
        });
        saveSources(sources);
        closeSettings();
        updateUnlockButton();
    }

    // 删除源
    function deleteSource(index) {
        const sources = getSources();
        sources.splice(index, 1);
        updateSourcesList(sources);
    }

    // 更新源列表显示
    function updateSourcesList(sources) {
        const list = document.getElementById('sources-list');
        list.innerHTML = sources.map((source, index) => `
            <div class="source-item" style="
                display:flex;
                align-items:center;
                margin-bottom:10px;
                padding:5px;
                border:1px solid #eee;
                border-radius:5px;
            ">
                <input type="checkbox" class="source-enabled" ${source.enabled ? 'checked' : ''} style="margin-right:10px;">
                <span class="source-name" style="margin-right:10px;min-width:80px;">${source.name}</span>
                <span class="source-url" style="margin-right:10px;color:#666;">${source.url}</span>
                <button onclick="(${deleteSource.toString()})(${index})" style="
                    margin-left:auto;
                    background:#ff4444;
                    color:white;
                    border:none;
                    padding:3px 8px;
                    border-radius:3px;
                    cursor:pointer;
                ">删除</button>
            </div>
        `).join('');
    }

    // 创建可拖动的解锁按钮
    function createUnlockButton() {
        const sources = getSources().filter(s => s.enabled);
        if(sources.length === 0) return;

        const position = getButtonPosition();
        const button = document.createElement('div');
        button.innerHTML = `
            <div id="unlock-button" style="
                position: fixed;
                bottom: ${position.bottom};
                right: ${position.right};
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 10px;
                cursor: move;
            ">
                <div class="settings-trigger" style="
                    background: #666;
                    color: white;
                    padding: 8px;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    transition: all 0.3s ease;
                ">
                    ⚙️
                </div>
                ${sources.map(source => `
                    <div class="unlock-option" style="
                        background: #1a8917;
                        color: white;
                        padding: 10px 15px;
                        border-radius: 20px;
                        cursor: pointer;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        font-family: -apple-system,BlinkMacSystemFont,sans-serif;
                    ">
                        <span>${source.name}</span>
                    </div>
                `).join('')}
            </div>
        `;

        document.body.appendChild(button);

        // 添加拖动功能
        const unlockButton = document.getElementById('unlock-button');
        makeDraggable(unlockButton);

        // 添加设置按钮事件
        unlockButton.querySelector('.settings-trigger').addEventListener('click', (e) => {
            e.stopPropagation(); // 防止触发拖动
            document.getElementById('settings-panel').style.display = 'block';
            updateSourcesList(getSources());
        });

        // 添加解锁按钮事件
        unlockButton.querySelectorAll('.unlock-option').forEach((option, index) => {
            option.addEventListener('click', (e) => {
                e.stopPropagation(); // 防止触发拖动
                const currentUrl = window.location.href;
                const unlockUrl = 'https://' + sources[index].url + '/' + currentUrl;
                window.open(unlockUrl, '_blank');
            });

            option.addEventListener('mouseover', function() {
                this.style.transform = 'scale(1.05)';
                this.style.background = '#147811';
            });

            option.addEventListener('mouseout', function() {
                this.style.transform = 'scale(1)';
                this.style.background = '#1a8917';
            });
        });
    }

    // 使元素可拖动
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            const newTop = element.offsetTop - pos2;
            const newLeft = element.offsetLeft - pos1;

            // 确保按钮不会超出屏幕
            if (newTop >= 0 && newTop <= window.innerHeight - element.offsetHeight) {
                element.style.top = newTop + "px";
            }
            if (newLeft >= 0 && newLeft <= window.innerWidth - element.offsetWidth) {
                element.style.left = newLeft + "px";
            }
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;

            // 保存最终位置
            saveButtonPosition({
                right: element.style.right,
                bottom: element.style.bottom
            });
        }
    }

    // 检查是否为Medium文章页面
    function isMediumArticle() {
        // 检查多个 Medium 特征
        const mediumFeatures = [
            // 检查是否存在 article 元素
            () => document.querySelector('article') !== null,

            // 检查页面 meta 信息
            () => {
                const generator = document.querySelector('meta[name="generator"]');
                return generator && generator.content.toLowerCase().includes('medium');
            },

            // 检查特定的 Medium CSS 类名
            () => {
                return document.querySelector('.progressiveMedia, .graf--title, .section-content') !== null;
            },

            // 检查 Medium 的特征性 script
            () => {
                const scripts = Array.from(document.getElementsByTagName('script'));
                return scripts.some(script =>
                    script.src && (
                        script.src.includes('medium.com') ||
                        script.src.includes('cdn-client.medium.com')
                    )
                );
            },

            // 检查 Medium 的 API 端点
            () => {
                const links = Array.from(document.getElementsByTagName('link'));
                return links.some(link =>
                    link.href && (
                        link.href.includes('medium.com') ||
                        link.href.includes('cdn-static-1.medium.com')
                    )
                );
            }
        ];

        // 如果满足任意两个特征，就认为是 Medium 文章
        return mediumFeatures.filter(check => check()).length >= 2;
    }

    // 更新解锁按钮
    function updateUnlockButton() {
        const oldButton = document.getElementById('unlock-button');
        if(oldButton) oldButton.remove();
        createUnlockButton();
    }

    // 初始化函数
    function init() {
        // 延迟检查，确保页面完全加载
        setTimeout(() => {
            if(isMediumArticle()) {
                if(!document.getElementById('medium-unlock-settings')) {
                    createSettingsPanel();
                }
                if(!document.getElementById('unlock-button')) {
                    createUnlockButton();
                }
            }
        }, 1500); // 增加延迟时间以确保页面元素加载完成
    }

    // 页面加载和动态导航处理
    if(document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 使用 MutationObserver 监听页面变化
    let lastUrl = location.href;
    const observer = new MutationObserver((mutations) => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            init();
        }

        // 检查DOM变化是否添加了新的Medium特征
        if(mutations.some(mutation => mutation.addedNodes.length > 0)) {
            if(!document.getElementById('unlock-button') && isMediumArticle()) {
                init();
            }
        }
    });

    observer.observe(document, {
        subtree: true,
        childList: true
    });

})();
