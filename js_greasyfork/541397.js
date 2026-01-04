// ==UserScript==
// @name         咪咕动态弹幕关键词屏蔽工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  从页面动态获取关键词并屏蔽相关弹幕（适配特殊弹幕结构）
// @author       klingeling
// @match        https://www.miguvideo.com/p/live/*
// @match        https://www.miguvideo.com/p/pugcLive/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541397/%E5%92%AA%E5%92%95%E5%8A%A8%E6%80%81%E5%BC%B9%E5%B9%95%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/541397/%E5%92%AA%E5%92%95%E5%8A%A8%E6%80%81%E5%BC%B9%E5%B9%95%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储当前屏蔽词列表
    let bannedWords = [];
    let bannedRegex = null;
    let observerActive = false;

    // 从页面获取屏蔽词
    function updateBannedWords() {
        const hotWordsList = document.querySelector('.www-hotWords-list');
        if (hotWordsList) {
            const items = hotWordsList.querySelectorAll('.www-hotWords-item');
            bannedWords = Array.from(items).map(item => item.textContent.trim());

            // 创建正则表达式时对特殊字符进行转义
            if (bannedWords.length > 0) {
                const escapedWords = bannedWords.map(word =>
                    word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                );
                bannedRegex = new RegExp(escapedWords.join("|"), "i");
                console.log('【klingleing】屏蔽词已更新：', bannedWords);
            } else {
                bannedRegex = null;
            }
        }
    }

    // 检查并隐藏匹配的弹幕
    function hideMatchingDanmu(node) {
        if (!bannedRegex || !node || !node.style) return;

        const danmuText = node.textContent || node.innerText;
        if (danmuText && bannedRegex.test(danmuText)) {
            node.style.display = 'none';
            node.style.visibility = 'hidden';
            // console.log('【klingleing】已屏蔽弹幕:', danmuText);
        }
    }

    // 检查已有的弹幕
    function checkExistingDanmu() {
        if (!bannedRegex) return;

        // 适配特殊弹幕容器结构
        const danmuContainer = document.querySelector('[class*="danmu-wrapper"], [class*="danmu"]');
        if (!danmuContainer) return;

        danmuContainer.querySelectorAll('div[data-line-index]').forEach(danmu => {
            hideMatchingDanmu(danmu);
        });
    }

    // 创建观察器来检测DOM变化
    const createObserver = () => {
        if (observerActive) return;

        // 查找弹幕容器（适配特殊类名）
        const danmuContainer = document.querySelector('[class*="danmu-wrapper"], [class*="danmu"]');
        if (!danmuContainer) {
            console.log('【klingleing】未找到弹幕容器');
            return;
        }

        // 观察弹幕容器的变化
        const danmuObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查是否是弹幕元素
                        const danmu = node.matches('div[data-line-index]') ? node :
                                      node.querySelector && node.querySelector('div[data-line-index]');
                        if (danmu) {
                            hideMatchingDanmu(danmu);
                        }
                    }
                });
            });
        });

        // 观察热门关键词的变化
        const hotWordsObserver = new MutationObserver(function() {
            updateBannedWords();
            checkExistingDanmu();
        });

        // 启动观察器
        danmuObserver.observe(danmuContainer, {
            childList: true,
            subtree: true
        });

        const hotWordsContainer = document.querySelector('.www-hotWords-list');
        if (hotWordsContainer) {
            hotWordsObserver.observe(hotWordsContainer, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }

        observerActive = true;
        console.log('【klingleing】弹幕观察器已启动');
    };

    // 初始化
    function init() {
        updateBannedWords();

        // 加强型元素检测
        const checkElements = setInterval(() => {
            const danmuExists = document.querySelector('[class*="danmu"]');
            const hotWordsExists = document.querySelector('.www-hotWords-list');

            if (danmuExists && hotWordsExists) {
                clearInterval(checkElements);
                createObserver();
                checkExistingDanmu();

                // 额外检查，确保弹幕容器找到
                if (!observerActive) {
                    console.log('【klingleing】重新尝试创建观察器...');
                    setTimeout(createObserver, 500);
                }
            }
        }, 500);
    }

    // 启动脚本
    if (document.readyState === 'complete') {
        setTimeout(init, 1000);
    } else {
        window.addEventListener('load', function() {
            setTimeout(init, 1000);
        }, {once: true});
    }

    // 更频繁的定期检查
    const checkInterval = setInterval(() => {
        if (!observerActive) {
            createObserver();
        }
        checkExistingDanmu();
    }, 2000);

    // 清理间隔的函数（虽然油猴脚本通常不需要）
    window.addEventListener('beforeunload', () => {
        clearInterval(checkInterval);
    });
})();