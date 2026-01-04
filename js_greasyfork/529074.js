// ==UserScript==
// @name         超星学习通｜知到智慧树-阅读助手增强版
// @namespace    noshuang
// @version      1.0.0
// @author       isMobile
// @description  阅读助手，自动滚动、翻页、任务点跳转，自动保存进度。
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @match        *://*.zhihuishu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/529074/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%EF%BD%9C%E7%9F%A5%E5%88%B0%E6%99%BA%E6%85%A7%E6%A0%91-%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/529074/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%EF%BD%9C%E7%9F%A5%E5%88%B0%E6%99%BA%E6%85%A7%E6%A0%91-%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        scrollSpeed: 3000,      // 自动滚动间隔（毫秒）
        pageCheckInterval: 15,  // 翻页检测间隔（秒）
        retryLimit: 3,          // 最大重试次数
        debugMode: true         // 调试模式
    };

    let state = {
        active: true,
        currentPage: 1,
        retryCount: 0
    };

    // 启动脚本时加载资源和页面初始化
    window.addEventListener('load', () => {
        initializeUI();
        startAutomation();
    });

    // 初始化界面
    function initializeUI() {
        const panel = document.createElement('div');
        panel.id = 'reading-helper-panel';
        panel.innerHTML = `
            <h3>阅读助手 v1.0</h3>
            <div>当前页：<span id="current-page">1</span></div>
            <button id="toggle-btn">暂停</button>
        `;
        document.body.appendChild(panel);

        document.getElementById('toggle-btn').addEventListener('click', toggleScript);
    }

    // 切换脚本状态
    function toggleScript() {
        state.active = !state.active;
        document.getElementById('toggle-btn').textContent = state.active ? '暂停' : '开始';
    }

    // 开始自动化操作
    function startAutomation() {
        // 自动滚动功能
        setInterval(() => {
            if (state.active) {
                autoScroll();
            }
        }, config.scrollSpeed);

        // 翻页检测功能
        setInterval(async () => {
            if (state.active) {
                const success = await checkNextPage();
                if (success) {
                    state.currentPage++;
                    document.getElementById('current-page').textContent = state.currentPage;
                }
            }
        }, config.pageCheckInterval * 1000);
    }

    // 自动滚动页面
    function autoScroll() {
        const step = window.innerHeight * 0.85;  // 每次滚动页面的高度
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        if (window.scrollY + step >= maxScroll) {
            window.scrollTo(0, maxScroll);
            console.log('已到达页面底部，准备翻页');
        } else {
            window.scrollBy(0, step);
        }
    }

    // 检查并翻页
    async function checkNextPage() {
        try {
            const nextPageButton = document.querySelector('.next-page-button'); // 这里要根据实际页面元素调整
            if (nextPageButton && nextPageButton.offsetParent !== null) {
                nextPageButton.click();
                await waitForPageLoad();
                console.log('成功翻页');
                return true;
            } else {
                console.log('未找到翻页按钮');
                return false;
            }
        } catch (error) {
            console.error('翻页出错:', error);
            return false;
        }
    }

    // 等待页面加载
    function waitForPageLoad() {
        return new Promise(resolve => {
            const observer = new MutationObserver(() => {
                if (document.readyState === 'complete') {
                    observer.disconnect();
                    resolve();
                }
            });
            observer.observe(document, { childList: true, subtree: true });
        });
    }

    // 发送通知
    function sendNotification(message) {
        GM_notification({
            title: '阅读助手通知',
            text: message,
            timeout: 5000
        });
    }
})();