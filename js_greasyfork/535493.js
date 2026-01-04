// ==UserScript==
// @name         自动切换更新按钮
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在 https://www.taoli.live/ 页面，根据按钮状态“已暂停更新”或“自动更新中”分别延迟 x/y 秒后自动点击切换状态。
// @author       fusheng
// @match        https://www.taoli.live/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535493/%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%9B%B4%E6%96%B0%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/535493/%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%9B%B4%E6%96%B0%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // —— 可配置项 ——
    const delayMap = {
        '已暂停更新': 60, // “已暂停更新”时延迟多少秒后点击
        '自动更新中': 5 // “自动更新中”时延迟多少秒后点击
    };
    const checkInterval = 1000; // 多久检查一次（毫秒）

    let scheduled = false; // 防止重复调度

    function checkAndSchedule() {
        if (scheduled) return;

        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => {
            const t = b.textContent.trim();
            return t in delayMap;
        });
        if (!btn) return;

        const state = btn.textContent.trim();
        const delay = delayMap[state];

        console.log(`🔍 检测到按钮状态：“${state}”，将在 ${delay} 秒后点击`);

        scheduled = true;
        setTimeout(() => {
            btn.click();
            console.log(`✅ 已点击按钮，原状态：“${state}”`);
            scheduled = false; // 重置调度标志，等待下一次状态切换
        }, delay * 1000);
    }

    // 页面加载完成后开始检查
    window.addEventListener('load', () => {
        console.log('页面加载完成，开始自动检测按钮状态');
        setInterval(checkAndSchedule, checkInterval);
    });

    // 监听 URL 变化（应对 SPA）
    let lastHref = location.href;
    new MutationObserver(() => {
        const href = location.href;
        if (href !== lastHref) {
            lastHref = href;
            console.log('URL 变化，重新开始检测');
            scheduled = false;
        }
    }).observe(document, {subtree: true, childList: true});
})();
