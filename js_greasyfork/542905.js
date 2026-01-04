// ==UserScript==
// @name         自定义标签页标题
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  为任意URL永久设置一个自定义的标签页标题，并强制保持，即使网站动态修改标题。
// @description:en Permanently set a custom tab title for any URL and force it to stay, even if the site dynamically changes the title.
// @author       yorhaha
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542905/%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/542905/%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // 关键改动：判断当前脚本是否在顶层窗口运行，如果是在iframe中则直接退出。
    // This is the key fix: check if we are in the top window. If in an iframe, exit.
    if (window.self !== window.top) {
        return;
    }

    const currentUrl = window.location.href;
    let customTitle = await GM_getValue(currentUrl);
    let observer = null;

    // 强制设置并保持标题的函数
    const forceTitle = (title) => {
        // 如果观察者已存在，先断开，避免在自己修改标题时触发死循环
        if (observer) {
            observer.disconnect();
        }

        document.title = title;

        // 创建或重新配置 MutationObserver 来监视标题变化
        const titleElement = document.querySelector('head > title');
        if (titleElement) {
            observer = new MutationObserver((mutations) => {
                // 如果检测到标题被外部脚本修改，则强制改回来
                if (document.title !== title) {
                    console.log(`[Custom Title] 网站尝试将标题修改为 "${document.title}"，已恢复为 "${title}"`);
                    document.title = title;
                }
            });
            // 监视 <title> 元素的子节点（即文本内容）的变化
            observer.observe(titleElement, { childList: true });
        }
    };

    // 1. 页面加载时，检查并应用已保存的自定义标题
    if (customTitle) {
        console.log(`[Custom Title] 已加载自定义标题: "${customTitle}"`);
        // 使用 DOMContentLoaded 事件确保 <head> 和 <title> 元素已加载
        window.addEventListener('DOMContentLoaded', (event) => {
            forceTitle(customTitle);
        });
        // 对于某些单页应用，可能需要更早或更晚地执行，@run-at document-start 配合 DOMContentLoaded 是一个比较稳妥的方案
        forceTitle(customTitle); // 立即尝试设置一次
    }

    // 2. 注册菜单命令：设置/修改标题
    GM_registerMenuCommand('设置/修改当前页标题', async () => {
        const newTitle = prompt('请输入当前页面的新标题：', document.title);

        // 如果用户输入了内容并且没有取消
        if (newTitle !== null && newTitle.trim() !== '') {
            customTitle = newTitle.trim();
            await GM_setValue(currentUrl, customTitle);
            console.log(`[Custom Title] 已为当前URL设置新标题: "${customTitle}"`);
            forceTitle(customTitle); // 立即应用并开始监视
            alert(`标题已成功设置为: "${customTitle}"`);
        } else if (newTitle !== null) {
            alert('标题不能为空，操作已取消。');
        }
    });

    // 3. 注册菜单命令：恢复默认标题
    GM_registerMenuCommand('恢复当前页默认标题', async () => {
        if (await GM_getValue(currentUrl)) {
            if (confirm('确定要删除该页面的自定义标题并恢复默认吗？页面将会刷新。')) {
                await GM_deleteValue(currentUrl);
                if (observer) {
                    observer.disconnect(); // 停止监视
                }
                console.log('[Custom Title] 已删除当前URL的自定义标题，页面将刷新。');
                alert('自定义标题已删除，页面将重新加载以恢复原始标题。');
                window.location.reload();
            }
        } else {
            alert('当前页面没有设置自定义标题。');
        }
    });
})();
