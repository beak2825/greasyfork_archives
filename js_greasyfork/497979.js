// ==UserScript==
// @name         mytan快捷新建对话
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Shorten URL by removing the part after /chat/
// @match        https://mytan.maiseed.com.cn/chat/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497979/mytan%E5%BF%AB%E6%8D%B7%E6%96%B0%E5%BB%BA%E5%AF%B9%E8%AF%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/497979/mytan%E5%BF%AB%E6%8D%B7%E6%96%B0%E5%BB%BA%E5%AF%B9%E8%AF%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义键盘快捷键，可以根据需要修改
    const shortcutKey = 'Ctrl+Shift+S';

    // 监听键盘事件
    document.addEventListener('keydown', function(e) {
        if (e.key === 'S' && e.ctrlKey && e.shiftKey) {
            // 获取当前网址
            const currentUrl = window.location.href;

            // 检查网址是否符合要求
            if (currentUrl.startsWith('https://mytan.maiseed.com.cn/chat/')) {
                // 删除 /chat/ 后面的部分
                const shortenedUrl = 'https://mytan.maiseed.com.cn/chat/';

                // 更新网址
                window.location.href = shortenedUrl;
            }
        }
    });

    // 显示提示信息
    console.log('Press ' + shortcutKey + ' to shorten the URL.');
})();
