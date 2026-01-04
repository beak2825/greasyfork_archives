// ==UserScript==
// @name         B站视频过滤插件
// @namespace    http://tampermonkey.net/
// @version      4.4.1
// @description  综合屏蔽管理：智能广告拦截、分类过滤、直播屏蔽、精准关键词过滤
// @author       觅星小竹
// @match        *://www.bilibili.com/*
// @exclude      *://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530414/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%BF%87%E6%BB%A4%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/530414/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%BF%87%E6%BB%A4%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局配置系统
    const CONFIG = {
        video: {
            enabled: GM_getValue('videoEnabled', true),
            blacklist: GM_getValue('videoBlacklist', [])
        },
        category: {
            enabled: GM_getValue('categoryEnabled', true),
            blacklist: GM_getValue('categoryBlacklist', [
                '番剧', '直播', '国创', '综艺',
                '课堂', '电影', '电视剧', '纪录片',"漫画",
            ])
        },
        ad: GM_getValue('adEnabled', true),
        live: GM_getValue('liveEnabled', true)
    };

    // 广告屏蔽模块 -------------------------------------------------
    const adKeywords = ['广告', 'Sponsored', '推广'];
    const adSelectors = [
        '.bili-video-card__stats--text',
        '.feed-card',
        '[data-report*="ad_card"]',
        '.bili-ad-card',
        '[ad-id]'
    ];

    function removeItem(){
       const recommendItem = document.querySelector(".recommended-swipe");
        if(recommendItem) recommendItem.remove();
        const feed_cards = document.querySelectorAll(".feed-card");
        feed_cards.forEach(card =>{
            card.remove();
        });
    }



    function isAdElement(element) {
        return adKeywords.some(keyword =>
            element.textContent.includes(keyword) ||
            element.getAttribute('data-report')?.includes('ad') ||
            element.closest('[class*="ad"], [class*="Ad"]')
        );
    }

    function hideAd(element) {
        if (!CONFIG.ad) return;
        const adContainer = element.closest('.feed-card, .bili-video-card, .bili-grid') || element;
        if (adContainer && !adContainer.dataset.adBlocked) {
            adContainer.remove();
        }
    }

    function blockAds1() {
        if (!CONFIG.ad) return;
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                if (isAdElement(element)) hideAd(element);
            });
        });
    }

    function blockAds(){
        if (!CONFIG.ad) return;
        document.querySelectorAll(".bili-feed-card").forEach(card=>{
            const adElementText = card.querySelector(".bili-video-card__stats--text").textContent.trim();
            const adItem = card.querySelector('svg path[d^="M16.9122"]');
            if(adElementText === "广告" || adItem) card.remove();
        });
    }

    // 分类屏蔽模块 -------------------------------------------------
    function blockCategories() {
        if (!CONFIG.category.enabled) return;

        document.querySelectorAll('.floor-single-card').forEach(card => {
            const categoryElement = card.querySelector('.floor-title');
            if (!categoryElement) return;

            const category = categoryElement.textContent.trim();
            const shouldBlock = CONFIG.category.blacklist.some(keyword =>
                category.includes(keyword)
            );

            if (shouldBlock) {
                card.remove();
            }
/**
if (shouldBlock) {
                card.style.display = 'none';
                card.dataset.blocked = 'true';
            } else if (card.dataset.blocked) {
                card.style.display = '';
                delete card.dataset.blocked;
            }

**/
            
        });

    }

    // 视频关键词屏蔽模块 --------------------------------------------
    function blockVideos() {
        if (!CONFIG.video.enabled) return;

        document.querySelectorAll('.bili-feed-card').forEach(video => {
            const title = video.querySelector('.bili-video-card__info--tit')?.textContent.trim() || '';
            const author = video.querySelector('.bili-video-card__info--author')?.textContent.trim() || '';

            const shouldBlock = CONFIG.video.blacklist.some(keyword =>
                title.includes(keyword) || author.includes(keyword)
            );

            if (shouldBlock) {
                video.remove();
            }
        });
    }

    // 主控制面板 -------------------------------------------------
    function createMainPanel() {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <style>
                .master-panel {
                    position: fixed;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(255,255,255,0.98);
                    border-radius: 12px;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                    padding: 20px;
                    width: 360px;
                    z-index: 10000;
                    backdrop-filter: blur(8px);
                }
                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }
                .close-btn {
                    cursor: pointer;
                    font-size: 20px;
                    color: #666;
                }
                .switch-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 12px 0;
                }
                .manage-btn {
                    color: #00a1d6;
                    cursor: pointer;
                    margin-left: 10px;
                }
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 40px;
                    height: 20px;
                }
                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                    border-radius: 20px;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 2px;
                    bottom: 2px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .slider {
                    background-color: #00a1d6;
                }
                input:checked + .slider:before {
                    transform: translateX(20px);
                }
            </style>
            <div class="master-panel">
                <div class="panel-header">
                    <h3>智能屏蔽控制中心</h3>
                    <div class="close-btn">×</div>
                </div>
                <div class="switch-item">
                    <span>视频关键词屏蔽</span>
                    <div>
                        <label class="switch">
                            <input type="checkbox" ${CONFIG.video.enabled ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                        <span class="manage-btn" data-type="video">管理</span>
                    </div>
                </div>
                <div class="switch-item">
                    <span>分类屏蔽</span>
                    <div>
                        <label class="switch">
                            <input type="checkbox" ${CONFIG.category.enabled ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                        <span class="manage-btn" data-type="category">管理</span>
                    </div>
                </div>
                <div class="switch-item">
                    <span>广告屏蔽</span>
                    <label class="switch">
                        <input type="checkbox" ${CONFIG.ad ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="switch-item">
                    <span>直播推荐屏蔽</span>
                    <label class="switch">
                        <input type="checkbox" ${CONFIG.live ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        `;

        panel.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', e => {
                const parentText = e.target.closest('.switch-item').querySelector('span').textContent;
                if (parentText.includes('视频')) {
                    CONFIG.video.enabled = e.target.checked;
                    GM_setValue('videoEnabled', e.target.checked);
                    blockVideos();
                } else if (parentText.includes('分类')) {
                    CONFIG.category.enabled = e.target.checked;
                    GM_setValue('categoryEnabled', e.target.checked);
                    blockCategories();
                } else if (parentText.includes('广告')) {
                    CONFIG.ad = e.target.checked;
                    GM_setValue('adEnabled', e.target.checked);
                    blockAds();
                } else {
                    CONFIG.live = e.target.checked;
                    GM_setValue('liveEnabled', e.target.checked);
                }
            });
        });

        panel.querySelectorAll('.manage-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                showManagementPanel(btn.dataset.type);
            });
        });

        panel.querySelector('.close-btn').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        return panel;
    }

    // 视频关键词管理面板 --------------------------------------------
    function showVideoPanel() {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <style>
                .keyword-panel {
                    position: fixed;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(255,255,255,0.98);
                    border-radius: 12px;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                    padding: 20px;
                    width: 400px;
                    z-index: 10001;
                    backdrop-filter: blur(8px);
                }
                .keyword-input-group {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 15px;
                }
                .keyword-list {
                    max-height: 300px;
                    overflow-y: auto;
                    border-top: 1px solid #eee;
                }
            </style>
            <div class="keyword-panel">
                <div class="panel-header">
                    <h3 style="margin:0">视频关键词管理</h3>
                    <button class="close-btn">×</button>
                </div>
                <div class="stats">当前屏蔽关键词：<span id="keyword-count">${CONFIG.video.blacklist.length}</span> 个</div>
                <div class="keyword-input-group">
                    <input type="text" placeholder="输入要屏蔽的关键词" style="flex:1;padding:8px;">
                    <button class="add-btn" style="padding:8px 15px;background:#00a1d6;color:white;border:none;border-radius:4px;">
                        添加
                    </button>
                </div>
                <div class="keyword-list"></div>
            </div>
        `;

        const closeBtn = panel.querySelector('.close-btn');
        const input = panel.querySelector('input');
        const addBtn = panel.querySelector('.add-btn');
        const keywordList = panel.querySelector('.keyword-list');
        const countSpan = panel.querySelector('#keyword-count');

        function updateList() {
            keywordList.innerHTML = CONFIG.video.blacklist.map(word => `
                <div style="display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid #eee;">
                    <span>${word}</span>
                    <button data-word="${word}" style="color:#ff6666;background:none;border:none;cursor:pointer;">
                        删除
                    </button>
                </div>
            `).join('');

            keywordList.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', () => {
                    CONFIG.video.blacklist = CONFIG.video.blacklist.filter(w => w !== btn.dataset.word);
                    GM_setValue('videoBlacklist', CONFIG.video.blacklist);
                    countSpan.textContent = CONFIG.video.blacklist.length;
                    updateList();
                    blockVideos();
                });
            });
        }

        addBtn.addEventListener('click', () => {
            const keyword = input.value.trim();
            if (keyword && !CONFIG.video.blacklist.includes(keyword)) {
                CONFIG.video.blacklist.push(keyword);
                GM_setValue('videoBlacklist', CONFIG.video.blacklist);
                input.value = '';
                countSpan.textContent = CONFIG.video.blacklist.length;
                updateList();
                blockVideos();
            }
        });

        input.addEventListener('keypress', e => {
            if (e.key === 'Enter') addBtn.click();
        });

        closeBtn.addEventListener('click', () => {
            document.body.removeChild(panel);
        });

        updateList();
        document.body.appendChild(panel);
    }

    // 分类管理面板 -------------------------------------------------
    function showCategoryPanel() {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <style>
                .category-panel {
                    position: fixed;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(255,255,255,0.98);
                    border-radius: 12px;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                    padding: 20px;
                    width: 400px;
                    z-index: 10001;
                    backdrop-filter: blur(8px);
                }
                .category-input-group {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 15px;
                }
                .category-list {
                    max-height: 300px;
                    overflow-y: auto;
                    border-top: 1px solid #eee;
                }
            </style>
            <div class="category-panel">
                <div class="panel-header">
                    <h3 style="margin:0">分类屏蔽管理</h3>
                    <button class="close-btn">×</button>
                </div>
                <div class="stats">当前屏蔽分类：<span id="category-count">${CONFIG.category.blacklist.length}</span> 个</div>
                <div class="category-input-group">
                    <input type="text" placeholder="输入要屏蔽的分类" style="flex:1;padding:8px;">
                    <button class="add-btn" style="padding:8px 15px;background:#00a1d6;color:white;border:none;border-radius:4px;">
                        添加
                    </button>
                </div>
                <div class="category-list"></div>
            </div>
        `;

        const closeBtn = panel.querySelector('.close-btn');
        const input = panel.querySelector('input');
        const addBtn = panel.querySelector('.add-btn');
        const categoryList = panel.querySelector('.category-list');
        const countSpan = panel.querySelector('#category-count');

        function updateList() {
            categoryList.innerHTML = CONFIG.category.blacklist.map(cat => `
                <div style="display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid #eee;">
                    <span>${cat}</span>
                    <button data-cat="${cat}" style="color:#ff6666;background:none;border:none;cursor:pointer;">
                        删除
                    </button>
                </div>
            `).join('');

            categoryList.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', () => {
                    CONFIG.category.blacklist = CONFIG.category.blacklist.filter(c => c !== btn.dataset.cat);
                    GM_setValue('categoryBlacklist', CONFIG.category.blacklist);
                    countSpan.textContent = CONFIG.category.blacklist.length;
                    updateList();
                    blockCategories();
                });
            });
        }

        addBtn.addEventListener('click', () => {
            const category = input.value.trim();
            if (category && !CONFIG.category.blacklist.includes(category)) {
                CONFIG.category.blacklist.push(category);
                GM_setValue('categoryBlacklist', CONFIG.category.blacklist);
                input.value = '';
                countSpan.textContent = CONFIG.category.blacklist.length;
                updateList();
                blockCategories();
            }
        });

        input.addEventListener('keypress', e => {
            if (e.key === 'Enter') addBtn.click();
        });

        closeBtn.addEventListener('click', () => {
            document.body.removeChild(panel);
        });

        updateList();
        document.body.appendChild(panel);
    }

    // 管理面板路由 -------------------------------------------------
    function showManagementPanel(type) {
        if (type === 'video') {
            showVideoPanel();
        } else if (type === 'category') {
            showCategoryPanel();
        }
    }

    // 直播屏蔽模块 -------------------------------------------------
    function blockLive() {
        document.querySelectorAll('.live-card, .bili-live-card').forEach(card => {
            card.style.display = CONFIG.live ? 'none' : '';
        });
    }

    // 初始化逻辑 -------------------------------------------------
    const observer = new MutationObserver(() => {
        blockAds();
        blockCategories();
        blockVideos();
        blockLive();
        removeItem();
    });

    const style = document.createElement('style');
    style.textContent = `
        [data-ad-blocked], [data-blocked] {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
        }
    `;
    document.head.appendChild(style);

    // 浮动按钮
    const floatBtn = document.createElement('div');
    floatBtn.innerHTML = `
        <style>
            .master-float-btn {
                position: fixed;
                left: 30px;
                bottom: 100px;
                background: #00a1d6;
                color: white;
                padding: 12px 20px;
                border-radius: 25px;
                z-index: 9999;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                transition: transform 0.2s;
            }
            .master-float-btn:hover {
                transform: scale(1.05);
            }
        </style>
        <div class="master-float-btn">🛡️</div>
    `;
    document.body.appendChild(floatBtn);

    // 主控制面板
    const mainPanel = createMainPanel();
    document.body.appendChild(mainPanel);
    mainPanel.style.display = 'none';

    floatBtn.querySelector('.master-float-btn').addEventListener('click', () => {
        mainPanel.style.display = mainPanel.style.display === 'none' ? 'block' : 'none';
    });

    // 启动监听
        blockAds();
        blockCategories();
        blockVideos();
        blockLive();
        removeItem();
    observer.observe(document.body, { childList: true, subtree: true });
})();