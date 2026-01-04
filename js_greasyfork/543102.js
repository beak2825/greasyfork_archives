// ==UserScript==
// @name         微博知乎B站小红书关键词屏蔽器
// @namespace    http://tampermonkey.net/
// @version      2.2.1
// @description  屏蔽微博、知乎、小红书、B站含关键词的内容，支持自定义管理
// @author       KasenRi
// @match        https://www.zhihu.com/
// @match        https://www.xiaohongshu.com/*
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?*
// @match        https://www.bilibili.com/v/*
// @match        https://search.bilibili.com/*
// @match        https://weibo.com/*
// @match        https://www.weibo.com/*
// @match        https://s.weibo.com/*
// @icon         https://picx.zhimg.com/v2-fab9e4d5ddf148b93df597a86b0525fd_l.jpg?source=32738c0c&needBackground=1
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543102/%E5%BE%AE%E5%8D%9A%E7%9F%A5%E4%B9%8EB%E7%AB%99%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543102/%E5%BE%AE%E5%8D%9A%E7%9F%A5%E4%B9%8EB%E7%AB%99%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

/*
 * 开源Fork声明 / Open Source Fork Declaration
 * 
 * 本脚本基于以下原始作品二次开发而成：
 * This script is forked and merged from the following original works:
 * 
 * 1. 知乎屏蔽词修改器
 *    作者/Author: 三无用户
 *    来源/Source: https://www.zhihu.com/question/1920892831981106398/answer/1928760410783343183
 *    
 * 2. 微博/B站/小红书屏蔽器
 *    作者/Author: Andante  
 *    来源/Source: https://www.zhihu.com/question/1920892831981106398/answer/1929126813218631948
 *    
 * 感谢原作者的贡献！
 * Thanks to the original authors for their contributions!
 * 
 * 本脚本采用MIT许可证开源
 * This script is open-sourced under MIT License
 */

(function() {
    'use strict';

    // 默认的屏蔽关键词列表
    const DEFAULT_KEYWORDS = [
        '男','女','父亲','母亲','大龄剩女','男性','女性','coser','儿子','体育生',
        '女儿','迪士尼','盲盒','奶茶','COSER','漫展','小孩','结婚','生娃','华为',
        '大龄女','大妈','单亲','女生','美女','女神','小姐姐','男子','女演员',
        '健身房','JK','身材','985','211','小米','妈','妈妈','生物爹','原生家庭',
        '今日俄罗斯'
    ];

    // 存储和获取屏蔽关键词
    const STORAGE_KEY = 'keyword_blocker_words';
    const DISABLED_SITES_KEY = 'keyword_blocker_disabled_sites';
    
    function saveKeywords(keywords) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(keywords));
    }
    
    function loadKeywords() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [...DEFAULT_KEYWORDS];
        } catch (e) {
            console.error('加载屏蔽词失败:', e);
            return [...DEFAULT_KEYWORDS];
        }
    }
    
    // 禁用网站管理
    function saveDisabledSites(sites) {
        localStorage.setItem(DISABLED_SITES_KEY, JSON.stringify(sites));
    }
    
    function loadDisabledSites() {
        try {
            const saved = localStorage.getItem(DISABLED_SITES_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('加载禁用网站失败:', e);
            return [];
        }
    }
    
    function isCurrentSiteDisabled() {
        const disabledSites = loadDisabledSites();
        const currentSite = getCurrentSite();
        return disabledSites.includes(currentSite);
    }
    
    function disableCurrentSite() {
        const disabledSites = loadDisabledSites();
        const currentSite = getCurrentSite();
        if (!disabledSites.includes(currentSite)) {
            disabledSites.push(currentSite);
            saveDisabledSites(disabledSites);
        }
    }

    function enableCurrentSite() {
        const disabledSites = loadDisabledSites();
        const currentSite = getCurrentSite();
        const index = disabledSites.indexOf(currentSite);
        if (index > -1) {
            disabledSites.splice(index, 1);
            saveDisabledSites(disabledSites);
        }
    }
    
    // 当前屏蔽关键词列表
    let BLOCK_KEYWORDS = loadKeywords();

    // 获取当前网站类型
    function getCurrentSite() {
        const hostname = window.location.hostname;
        if (hostname.includes('zhihu.com')) return 'zhihu';
        if (hostname.includes('xiaohongshu.com')) return 'xiaohongshu';
        if (hostname.includes('bilibili.com')) return 'bilibili';
        if (hostname.includes('weibo.com')) return 'weibo';
        return 'unknown';
    }

    // 网站特定的配置
    const siteConfigs = {
        zhihu: {
            containerSelector: '.ContentItem',
            titleSelector: '.ContentItem-title a',
            logPrefix: '已屏蔽知乎问题'
        },
        xiaohongshu: {
            containerSelector: 'section.note-item',
            titleSelector: 'a.title, .title',
            logPrefix: '已屏蔽小红书内容'
        },
        bilibili: {
            containerSelector: '.bili-feed-card, .bili-video-card',
            titleSelector: '.bili-video-card__info--tit, .bili-video-card__info--tit a, .bili-video-card__wrap .bili-video-card__info--tit',
            logPrefix: '已屏蔽B站内容'
        },
        weibo: {
            containerSelector: '.wbpro-scroller-item',
            titleSelector: '.wbpro-feed-content .detail_wbtext_4CRf9',
            logPrefix: '已屏蔽微博内容'
        }
    };

    // 创建管理UI
    function createManagementUI() {
        // 创建CSS样式
        const style = document.createElement('style');
        style.textContent = `
            #keyword-blocker-toggle {
                position: fixed;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 10000;
                background: #1890ff;
                color: white;
                border: none;
                border-radius: 6px;
                padding: 12px 8px;
                cursor: pointer;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                transition: all 0.3s ease;
                writing-mode: vertical-lr;
                text-orientation: mixed;
            }
            
            #keyword-blocker-toggle:hover {
                background: #40a9ff;
                transform: translateY(-50%) scale(1.05);
            }
            
            #keyword-blocker-panel {
                position: fixed;
                left: -350px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 9999;
                width: 320px;
                max-height: 70vh;
                background: white;
                border: 1px solid #d9d9d9;
                border-radius: 8px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                transition: left 0.3s ease;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            #keyword-blocker-panel.show {
                left: 20px;
            }
            
            .kb-panel-header {
                padding: 16px;
                border-bottom: 1px solid #f0f0f0;
                background: #fafafa;
                border-radius: 8px 8px 0 0;
            }
            
                         .kb-title-row {
                 display: flex;
                 justify-content: space-between;
                 align-items: center;
                 margin-bottom: 12px;
             }
             
             .kb-panel-title {
                 margin: 0;
                 font-size: 16px;
                 font-weight: 500;
                 color: #262626;
                 flex: 1;
             }
            
            .kb-input-group {
                display: flex;
                gap: 8px;
            }
            
            .kb-input {
                flex: 1;
                padding: 8px 12px;
                border: 1px solid #d9d9d9;
                border-radius: 4px;
                font-size: 14px;
                outline: none;
            }
            
            .kb-input:focus {
                border-color: #1890ff;
                box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
            }
            
            .kb-btn {
                padding: 8px 16px;
                background: #1890ff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.3s ease;
            }
            
            .kb-btn:hover {
                background: #40a9ff;
            }
            
            .kb-btn-danger {
                background: #ff4d4f;
            }
            
            .kb-btn-danger:hover {
                background: #ff7875;
            }
            
            .kb-list-container {
                max-height: calc(70vh - 120px);
                overflow-y: auto;
                padding: 0;
            }
            
            .kb-list {
                list-style: none;
                margin: 0;
                padding: 0;
            }
            
            .kb-list-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                border-bottom: 1px solid #f0f0f0;
                transition: background 0.2s ease;
            }
            
            .kb-list-item:hover {
                background: #f5f5f5;
            }
            
            .kb-keyword {
                flex: 1;
                font-size: 14px;
                color: #262626;
                word-break: break-all;
            }
            
                         .kb-delete-btn {
                 padding: 4px 8px;
                 background: #ff4d4f;
                 color: white;
                 border: none;
                 border-radius: 3px;
                 cursor: pointer;
                 font-size: 12px;
                 transition: background 0.3s ease;
             }
             
             .kb-delete-btn:hover {
                 background: #ff7875;
             }
             
             .kb-confirm-group {
                 display: flex;
                 gap: 8px;
             }
             
             .kb-confirm-btn {
                 padding: 4px 8px;
                 border: none;
                 border-radius: 3px;
                 cursor: pointer;
                 font-size: 12px;
                 transition: background 0.3s ease;
             }
             
             .kb-confirm-delete {
                 background: #ff4d4f;
                 color: white;
             }
             
             .kb-confirm-delete:hover {
                 background: #ff7875;
             }
             
             .kb-confirm-cancel {
                 background: #8c8c8c;
                 color: white;
             }
             
             .kb-confirm-cancel:hover {
                 background: #a6a6a6;
             }
            
            .kb-stats {
                padding: 12px 16px;
                background: #f9f9f9;
                border-top: 1px solid #f0f0f0;
                font-size: 12px;
                color: #666;
                text-align: center;
                border-radius: 0 0 8px 8px;
            }
            
            .kb-close-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #999;
                padding: 4px;
                border-radius: 3px;
                transition: all 0.2s ease;
            }
            
                         .kb-close-btn:hover {
                 background: #f0f0f0;
                 color: #666;
             }
             
             .kb-disable-site-btn {
                 padding: 4px 8px;
                 background: #8c8c8c;
                 color: white;
                 border: none;
                 border-radius: 3px;
                 cursor: pointer;
                 font-size: 10px;
                 white-space: nowrap;
                 margin-left: 12px;
                 transition: background 0.3s ease;
             }
             
             .kb-disable-site-btn:hover {
                 background: #a6a6a6;
             }
        `;
        document.head.appendChild(style);

        // 创建切换按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'keyword-blocker-toggle';
        toggleBtn.textContent = '屏蔽词管理';
        document.body.appendChild(toggleBtn);

        // 创建管理面板
        const panel = document.createElement('div');
        panel.id = 'keyword-blocker-panel';
        const currentSite = getCurrentSite();
        const siteNames = {
            'zhihu': '知乎',
            'xiaohongshu': '小红书', 
            'bilibili': 'B站',
            'weibo': '微博'
        };
        const siteName = siteNames[currentSite] || '当前网站';
        
        const isDisabled = isCurrentSiteDisabled();
        const btnText = isDisabled ? `重新启用${siteName}屏蔽` : `有BUG？停止屏蔽${siteName}`;
        const statusText = isDisabled ? `⚠️ ${siteName}屏蔽功能已停用` : '屏蔽词管理';
        
        panel.innerHTML = `
            <button class="kb-close-btn" id="kb-close">×</button>
            <div class="kb-panel-header">
                <div class="kb-title-row">
                    <h3 class="kb-panel-title">${statusText}</h3>
                    <button class="kb-disable-site-btn" id="kb-disable-site">${btnText}</button>
                </div>
                <div class="kb-input-group">
                    <input type="text" id="kb-input" class="kb-input" placeholder="输入屏蔽词，用 , 或 / 分隔" />
                    <button id="kb-add-btn" class="kb-btn">新增</button>
                </div>
            </div>
            <div class="kb-list-container">
                <ul id="kb-list" class="kb-list"></ul>
            </div>
            <div class="kb-stats">
                当前共有 <span id="kb-count">0</span> 个屏蔽词
            </div>
        `;
        document.body.appendChild(panel);

        return { toggleBtn, panel };
    }

    // 渲染屏蔽词列表
    function renderKeywordList() {
        const list = document.getElementById('kb-list');
        const count = document.getElementById('kb-count');
        
        if (!list || !count) return;
        
        list.innerHTML = '';
        count.textContent = BLOCK_KEYWORDS.length;
        
        BLOCK_KEYWORDS.forEach((keyword, index) => {
            const li = document.createElement('li');
            li.className = 'kb-list-item';
            li.dataset.index = index;
            li.innerHTML = `
                <span class="kb-keyword">${keyword}</span>
                <button class="kb-delete-btn" data-index="${index}">删除</button>
            `;
            list.appendChild(li);
        });
    }

    // 显示确认删除界面
    function showDeleteConfirm(listItem, index) {
        const keyword = BLOCK_KEYWORDS[index];
        listItem.innerHTML = `
            <span class="kb-keyword">${keyword}</span>
            <div class="kb-confirm-group">
                <button class="kb-confirm-btn kb-confirm-delete" data-index="${index}">确认删除</button>
                <button class="kb-confirm-btn kb-confirm-cancel" data-index="${index}">手滑了</button>
            </div>
        `;
    }

    // 恢复正常显示
    function restoreNormalView(listItem, index) {
        const keyword = BLOCK_KEYWORDS[index];
        listItem.innerHTML = `
            <span class="kb-keyword">${keyword}</span>
            <button class="kb-delete-btn" data-index="${index}">删除</button>
        `;
    }

    // 添加屏蔽词
    function addKeywords(input) {
        const words = input.split(/[,，/]/)
            .map(word => word.replace(/\s+/g, ''))  // 去除所有空格
            .filter(word => word.length > 0 && !BLOCK_KEYWORDS.includes(word));
        
        if (words.length > 0) {
            // 新增词条添加到数组开头
            BLOCK_KEYWORDS.unshift(...words);
            saveKeywords(BLOCK_KEYWORDS);
            renderKeywordList();
            console.log('新增屏蔽词:', words);
            return true;
        }
        return false;
    }

    // 删除屏蔽词
    function removeKeyword(index) {
        if (index >= 0 && index < BLOCK_KEYWORDS.length) {
            const removed = BLOCK_KEYWORDS.splice(index, 1);
            saveKeywords(BLOCK_KEYWORDS);
            renderKeywordList();
            console.log('删除屏蔽词:', removed[0]);
            return true;
        }
        return false;
    }

    // 初始化UI事件
    function initUIEvents() {
        const toggleBtn = document.getElementById('keyword-blocker-toggle');
        const panel = document.getElementById('keyword-blocker-panel');
        const closeBtn = document.getElementById('kb-close');
        const addBtn = document.getElementById('kb-add-btn');
        const input = document.getElementById('kb-input');
        const list = document.getElementById('kb-list');
        const disableSiteBtn = document.getElementById('kb-disable-site');

        // 切换面板显示
        toggleBtn.addEventListener('click', () => {
            const isShowing = panel.classList.contains('show');
            if (isShowing) {
                panel.classList.remove('show');
                toggleBtn.style.display = 'block';
            } else {
                panel.classList.add('show');
                toggleBtn.style.display = 'none';
            }
        });

        // 关闭面板函数
        function closePanel() {
            panel.classList.remove('show');
            toggleBtn.style.display = 'block';
        }

        // 关闭面板
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            closePanel();
        });

        // 点击面板外区域关闭
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !toggleBtn.contains(e.target)) {
                closePanel();
            }
        });

        // 新增屏蔽词
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            const value = input.value.trim();
            if (value) {
                if (addKeywords(value)) {
                    input.value = '';
                } else {
                    alert('请输入有效的屏蔽词');
                }
            }
        });

        // 回车新增
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addBtn.click();
            }
        });

        // 处理删除相关事件
        list.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            
            if (e.target.classList.contains('kb-delete-btn')) {
                // 点击删除按钮，显示确认界面
                e.stopPropagation(); // 阻止事件冒泡
                const listItem = e.target.closest('.kb-list-item');
                showDeleteConfirm(listItem, index);
            } else if (e.target.classList.contains('kb-confirm-delete')) {
                // 点击确认删除
                e.stopPropagation(); // 阻止事件冒泡
                removeKeyword(index);
            } else if (e.target.classList.contains('kb-confirm-cancel')) {
                // 点击手滑了，恢复正常显示
                e.stopPropagation(); // 阻止事件冒泡
                const listItem = e.target.closest('.kb-list-item');
                restoreNormalView(listItem, index);
            }
        });

        // 禁用/启用当前网站
        disableSiteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            const currentSite = getCurrentSite();
            const siteNames = {
                'zhihu': '知乎',
                'xiaohongshu': '小红书', 
                'bilibili': 'B站',
                'weibo': '微博'
            };
            const siteName = siteNames[currentSite] || '当前网站';
            const isCurrentlyDisabled = isCurrentSiteDisabled();
            
            if (isCurrentlyDisabled) {
                // 当前已禁用，询问是否启用
                if (confirm(`确定要重新启用在${siteName}的屏蔽功能吗？\n\n启用后，屏蔽功能将在下次刷新页面时生效。`)) {
                    enableCurrentSite();
                    alert(`已重新启用在${siteName}的屏蔽功能。\n请刷新页面使设置生效。`);
                    closePanel();
                }
            } else {
                // 当前已启用，询问是否禁用
                if (confirm(`确定要停止在${siteName}的屏蔽功能吗？\n\n下次访问${siteName}时，屏蔽功能将不会生效。`)) {
                    disableCurrentSite();
                    alert(`已停止在${siteName}的屏蔽功能。\n请刷新页面使设置生效。`);
                    closePanel();
                }
            }
        });
    }

    // 处理单个内容元素
    function processContentElement(element, config) {
        const site = getCurrentSite();
        
        // B站特殊处理：检测反屏蔽提示并删除
        if (site === 'bilibili') {
            // 检测反屏蔽box：有"bili-video-card is-rcmd"但没有"enable-no-interest"
            if (element.classList.contains('bili-video-card') && 
                element.classList.contains('is-rcmd') && 
                !element.classList.contains('enable-no-interest')) {
                
                // 查找上级容器并删除
                let targetContainer = element.closest('.feed-card') || element.closest('.bili-feed-card');
                
                if (targetContainer) {
                    targetContainer.remove();
                    console.log(`${config.logPrefix}: 反屏蔽提示 (删除整个容器)`);
                } else {
                    element.remove();
                    console.log(`${config.logPrefix}: 反屏蔽提示 (删除元素)`);
                }
                return;
            }
        }
        
        const titleElement = element.querySelector(config.titleSelector);
        let title = '';
        
        if (titleElement) {
            title = titleElement.textContent.trim();
        } else {
            // 兜底查找整个元素文本
            title = element.textContent.trim();
        }
        
        // 检查是否包含屏蔽关键词
        if (BLOCK_KEYWORDS.some(keyword => title.includes(keyword))) {
            let containerRemoved = false;
            
            // 针对不同网站的特殊处理：删除整个容器
            if (site === 'zhihu') {
                // 向上查找Card容器
                let cardElement = element.closest('.Card.TopstoryItem.TopstoryItem-isRecommend');
                if (cardElement) {
                    cardElement.remove();
                    console.log(`${config.logPrefix}: ${title} (删除整个卡片)`);
                    containerRemoved = true;
                }
            } else if (site === 'bilibili') {
                // 向上查找B站容器，同时检测feed-card和bili-feed-card
                let feedCardElement = element.closest('.feed-card') || element.closest('.bili-feed-card');
                if (feedCardElement) {
                    feedCardElement.remove();
                    console.log(`${config.logPrefix}: ${title} (删除整个B站容器)`);
                    containerRemoved = true;
                }
            } else if (site === 'xiaohongshu') {
                // 向上查找note-item容器
                let noteItemElement = element.closest('.note-item');
                if (noteItemElement) {
                    noteItemElement.remove();
                    console.log(`${config.logPrefix}: ${title} (删除整个note-item)`);
                    containerRemoved = true;
                }
            }
            
            // 如果没找到特定容器或其他网站，使用原来的隐藏方式
            if (!containerRemoved) {
                element.style.display = 'none';
                console.log(`${config.logPrefix}: ${title} (隐藏元素)`);
            }
        }
    }

    // 处理所有内容元素
    function processAllContent() {
        const site = getCurrentSite();
        const config = siteConfigs[site];
        
        if (!config) {
            console.log('未支持的网站:', window.location.hostname);
            return;
        }
        
        document.querySelectorAll(config.containerSelector).forEach(element => {
            processContentElement(element, config);
        });
    }

    // 防抖处理函数
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    const debouncedProcessAllContent = debounce(processAllContent, 500);

    // 初始化管理UI
    function initManagementUI() {
        createManagementUI();
        renderKeywordList();
        initUIEvents();
    }

    // 主初始化函数
    function init() {
        // 检查当前网站是否被禁用
        if (isCurrentSiteDisabled()) {
            console.log(`四平台关键词屏蔽器: ${getCurrentSite()} 已被禁用，仅显示管理界面`);
            // 仅初始化管理UI，不执行屏蔽功能
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initManagementUI);
            } else {
                initManagementUI();
            }
            return;
        }

        // 初始化处理
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                processAllContent();
                initManagementUI();
            });
        } else {
            processAllContent();
            initManagementUI();
        }
        window.addEventListener('load', processAllContent);

        // 监听DOM变化
        const observer = new MutationObserver(mutations => {
            const site = getCurrentSite();
            const config = siteConfigs[site];
            if (!config) return;
            
            let shouldProcess = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.matches && node.matches(config.containerSelector)) {
                                processContentElement(node, config);
                            } else if (node.querySelectorAll) {
                                const elements = node.querySelectorAll(config.containerSelector);
                                if (elements.length > 0) {
                                    shouldProcess = true;
                                    elements.forEach(element => processContentElement(element, config));
                                }
                            }
                        }
                    });
                }
            });
            
            if (shouldProcess) debouncedProcessAllContent();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // 滚动事件监听
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(debouncedProcessAllContent, 1000);
        }, { passive: true });

        // 定时扫描
        setInterval(processAllContent, 5000);

        console.log(`四平台关键词屏蔽器已启动，当前网站: ${getCurrentSite()}`);
    }

    // 启动脚本
    init();
})(); 