// ==UserScript==
// @name         淘宝广告屏蔽助手
// @namespace    http://tampermonkey.net/
// @version      2.2.2
// @description  尝试隐藏淘宝搜索结果中的动态加载广告以及掌柜热卖，新增“灰底”广告隐藏开关。
// @author       oldip
// @match        https://www.taobao.com/*
// @match        https://s.taobao.com/*
// @match        https://new-s.taobao.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/490417/%E6%B7%98%E5%AE%9D%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/490417/%E6%B7%98%E5%AE%9D%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---- 全局配置与开关 ----
    // 从存储里读取“隐藏灰底广告”开关，默认 false（仅高亮灰底，不隐藏）
    let hideGray = GM_getValue('hideGray', false);

    // 注册菜单命令：切换“隐藏灰底广告”开关
    GM_registerMenuCommand('切换灰底广告隐藏（当前：' + (hideGray ? '隐藏' : '保留灰底') + '）', () => {
        hideGray = !hideGray;
        GM_setValue('hideGray', hideGray);
        processAds(); // 切换后立即重新处理，不刷新页面
        alert('“灰底广告”已' + (hideGray ? '隐藏' : '保留灰底'));
    });

    // ---- 安全隐藏函数：将目标元素隐藏，保留在 DOM 中 ----
    const safeHide = (element) => {
        try {
            if (element && element.parentNode) {
                element.style.display = 'none';
            }
        } catch (e) {
            console.error("safeHide 出错:", e);
        }
    };

    // ---- 隐藏主广告 ----
    const hideAdElements = () => {
        document.querySelectorAll('img.mainP4pPic--jbnK3QAX').forEach(el => {
            const adLink = el.closest('a.doubleCardWrapperAdapt--mEcC7olq');
            if (adLink) {
                const container = adLink.closest('div.tbpc-col.search-content-col');
                if (container) {
                    safeHide(container);
                }
            }
        });
    };

    // ---- 隐藏“大家都在搜”模块 ----
    const hideSuggestItemAdElements = () => {
        document.querySelectorAll('div[class*="suggestItemCard--"]').forEach(el => {
            const container = el.closest('div.tbpc-col.search-content-col');
            if (container) {
                safeHide(container);
            }
        });
    };

    // ---- 隐藏“满意度调查问卷”模块 ----
    const hideSurveyItemAdElements = () => {
        document.querySelectorAll('div[class*="surveyCard--"]').forEach(el => {
            const container = el.closest('div.tbpc-col.search-content-col');
            if (container) {
                safeHide(container);
            }
        });
    };

    // ---- 处理可能带相关的广告（灰底） ----
    const processZTC = () => {
        document.querySelectorAll('a.doubleCardWrapperAdapt--mEcC7olq').forEach(link => {
            if (link.href && link.href.includes('ad_ztc')) {
                const container = link.closest('div.tbpc-col.search-content-col');
                if (hideGray) {
                    // 如果开关打开，就隐藏整个容器
                    if (container) {
                        safeHide(container);
                    }
                } else {
                    // 保留灰底：先确保容器可见，然后高亮该链接
                    // 检查 container 中是否还包含主广告图片，若有则不恢复 display
                    const hasMain = container.querySelector('img.mainP4pPic--jbnK3QAX');
                    if (!hasMain) {
                        container.style.display = '';
                    }
                    const styleAttr = link.getAttribute('style');
                    if (!styleAttr || !/background\s*:/i.test(styleAttr)) {
                        link.style.backgroundColor = 'lightgray';
                    }
                }
            }
        });
    };

    // ---- 集中处理所有广告 ----
    const processAds = () => {
        hideAdElements();
        hideSuggestItemAdElements();
        hideSurveyItemAdElements();
        processZTC();
    };

    // ---- 监控 DOM 变化，以便动态加载时也能处理 ----
    const observer = new MutationObserver(mutations => {
        let changed = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                changed = true;
                break;
            }
        }
        if (changed) {
            processAds();
        }
    });
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    // ---- 初次执行一次 ----
    processAds();

})();