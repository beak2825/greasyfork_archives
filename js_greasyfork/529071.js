// ==UserScript==
// @name         超星学习通自动阅读脚本（每小时翻一页）
// @namespace    Automator
// @version      1.1
// @description  自动滚动并翻页，翻页速度每小时一次，适用于学习通。
// @author       自动化脚本
// @match        *://*.chaoxing.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/529071/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E8%84%9A%E6%9C%AC%EF%BC%88%E6%AF%8F%E5%B0%8F%E6%97%B6%E7%BF%BB%E4%B8%80%E9%A1%B5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/529071/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E8%84%9A%E6%9C%AC%EF%BC%88%E6%AF%8F%E5%B0%8F%E6%97%B6%E7%BF%BB%E4%B8%80%E9%A1%B5%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用户配置
    const config = {
        scrollSpeed: 3000,    // 滚动间隔时间（毫秒）
        pageCheckInterval: 3600, // 翻页检测间隔（秒），设置为3600秒，即每小时翻一页
        scrollStep: 0.85,     // 每次滚动页面的高度百分比（0 - 1）
        maxRetries: 3,        // 最大重试次数
        debugMode: true       // 调试模式，打印日志
    };

    let state = {
        active: true,
        currentPage: 1,
        retryCount: 0
    };

    // 记录调试信息
    function log(message) {
        if (config.debugMode) {
            console.log(`[阅读助手] ${message}`);
        }
    }

    // 自动滚动页面
    function autoScroll() {
        const currentPosition = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const step = window.innerHeight * config.scrollStep;

        if (currentPosition + step >= maxScroll) {
            window.scrollTo(0, maxScroll); // 到达页面底部
            log('已到达页面底部，准备翻页');
            return true;
        }

        window.scrollBy(0, step);
        return false;
    }

    // 检测并翻页
    async function checkNextPage() {
        try {
            const nextPageButton = document.querySelector('.nextBtn'); // 请根据具体页面的按钮选择器调整
            if (nextPageButton && nextPageButton.offsetParent !== null) {
                log('检测到翻页按钮，进行翻页');
                nextPageButton.click(); // 点击下一页按钮
                
                // 等待页面加载
                await new Promise(resolve => {
                    const observer = new MutationObserver(() => {
                        if (document.readyState === 'complete') {
                            observer.disconnect();
                            resolve();
                        }
                    });
                    observer.observe(document, { childList: true, subtree: true });
                    setTimeout(resolve, 3000); // 最多等待3秒
                });

                state.currentPage++;
                log(`翻页成功，当前页：${state.currentPage}`);
                state.retryCount = 0;
                return true;
            } else {
                log('未找到翻页按钮，可能已完成');
                return false;
            }
        } catch (error) {
            log(`翻页错误：${error}`);
            state.retryCount++;
            return false;
        }
    }

    // 启动自动化
    function startAutomation() {
        // 每隔一定时间滚动页面
        setInterval(() => {
            if (state.active) {
                const reachedBottom = autoScroll();
                if (reachedBottom) {
                    checkNextPage();
                }
            }
        }, config.scrollSpeed);

        // 每小时检查翻页
        setInterval(async () => {
            if (state.active) {
                const success = await checkNextPage();
                if (!success && state.retryCount >= config.maxRetries) {
                    log(`连续 ${config.maxRetries} 次翻页失败，暂停脚本`);
                    state.active = false; // 停止脚本
                }
            }
        }, config.pageCheckInterval * 1000); // 每小时翻一页
    }

    // 初始化
    log('脚本启动，开始自动化阅读');
    startAutomation();
})();