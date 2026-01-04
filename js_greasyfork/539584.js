// ==UserScript==
// @name         腾讯元宝标签页标题同步对话标题
// @namespace    http://tampermonkey.net/
// @version      2025-06-11
// @description  将对话标题同步到标签页标题
// @author       cyrusyxx
// @match        *://yuanbao.tencent.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tencent.com
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539584/%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%A0%87%E9%A2%98%E5%90%8C%E6%AD%A5%E5%AF%B9%E8%AF%9D%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/539584/%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%A0%87%E9%A2%98%E5%90%8C%E6%AD%A5%E5%AF%B9%E8%AF%9D%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    unsafeWindow.console.log('[脚本调试] ===== 脚本启动 =====');

    // 配置
    const TARGET_SELECTOR = '.yb-recent-conv-list__item.active .yb-recent-conv-list__item-name';
    const MAX_RETRY = 10; // 最大重试次数

    let retryCount = 0;

    function updateTitle() {
        const nameElement = document.querySelector(TARGET_SELECTOR);
        if (!nameElement) {
            if (retryCount++ < MAX_RETRY) {
                unsafeWindow.console.warn(`[脚本调试] 第 ${retryCount} 次重试...`);
                setTimeout(updateTitle, 1000);
            } else {
                unsafeWindow.console.error('[脚本调试] 达到最大重试次数，请检查选择器！');
            }
            return;
        }

        const newTitle = nameElement.textContent.trim();
        if (document.title !== newTitle) {
            document.title = newTitle;
            unsafeWindow.console.log(`[脚本调试] 标题更新成功 → "${newTitle}"`);
        }
    }

    // 优先尝试立即执行
    updateTitle();

    // 同时启动MutationObserver作为双保险
    const observer = new MutationObserver(() => {
        unsafeWindow.console.log('[脚本调试] DOM发生变化，重新检测...');
        updateTitle();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();