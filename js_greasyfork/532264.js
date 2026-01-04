// ==UserScript==
// @name         去除ChatGPT Articles Adjusted
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  删除页面上多余的 <article> 标签，只保留前2个和最后8个元素
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532264/%E5%8E%BB%E9%99%A4ChatGPT%20Articles%20Adjusted.user.js
// @updateURL https://update.greasyfork.org/scripts/532264/%E5%8E%BB%E9%99%A4ChatGPT%20Articles%20Adjusted.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const KEEP_FRONT = 2;// 保留前2个元素
    const KEEP_END = 8; // 保留后8个元素
    const CHECK_INTERVAL_MS = 60000; // 每60秒执行一次检测

    // 定义黑名单域名（仅在这些域名下执行脚本）
    const blacklistDomains = ['chatgpt.com', 'www.sinbyte.com.cn'];
    const currentHostname = window.location.hostname;
    const isInBlacklist = blacklistDomains.some(domain => currentHostname.includes(domain));

    if (!isInBlacklist) {
        console.log('当前网址不在黑名单中，脚本已跳过。');
        return;
    }
    console.log('当前网址在黑名单中，脚本开始执行...');

    // 删除多余文章的函数
    function removeExcessArticles() {
        // 使用更宽松的选择器，匹配所有 data-testid 属性以 "conversation-turn-" 开头的 <article> 元素
        const selector = 'article[data-testid^="conversation-turn-"]';
        const articles = document.querySelectorAll(selector);
        console.log(`匹配到 ${articles.length} 个 <article> 元素.`);

        if (articles.length > (KEEP_FRONT + KEEP_END)) {
            console.log(`开始删除中间多余文章，仅保留前 ${KEEP_FRONT} 个和最后 ${KEEP_END} 个`);
            const articlesArray = Array.from(articles);
            const toRemove = articlesArray.slice(KEEP_FRONT, articlesArray.length - KEEP_END);
            toRemove.forEach(article => article.remove());
        } else {
            console.log('文章数量不足，无需删除。');
        }
    }

    // 页面加载完成后延时1秒执行清理操作（确保页面动态内容加载完毕）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(removeExcessArticles, 1000);
        });
    } else {
        setTimeout(removeExcessArticles, 1000);
    }

    // 定时触发清理操作
    setInterval(removeExcessArticles, CHECK_INTERVAL_MS);

    // 监听 DOM 变化，若指定区域未找到则降级为监听整个 document.body
    let observerTarget = document.querySelector('main .react-scroll-to-bottom--css-sznur-1n7m0yu');
    if (!observerTarget) {
        observerTarget = document.body;
        console.log('未找到特定的 MutationObserver 目标元素，改为监听 document.body');
    }

    let debounceTimer = null;
    const observer = new MutationObserver(() => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            removeExcessArticles();
        }, 200);
    });
    observer.observe(observerTarget, { childList: true, subtree: true });
    console.log('MutationObserver 已启动');
})();
