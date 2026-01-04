// ==UserScript==
// @name         Disable Page UpDown Animation
// @namespace    https://greasyfork.org/users/1111205-geekfox
// @version      1.5
// @description  Based on Eink-UpDown by Sonny Zhao. Disable page-turning animations for Chrome globally (applies to (Shift+) Spacebar and PgDown/PgUp keys). Note: If the "Allow access to file URLs" option is enabled in Tampermonkey's Manage Extension settings, it will also work for local PDF reading. However, this script does not affect frames within the browser.
// @author       GeekFox
// @match        *://*/*
// @grant        none
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470897/Disable%20Page%20UpDown%20Animation.user.js
// @updateURL https://update.greasyfork.org/scripts/470897/Disable%20Page%20UpDown%20Animation.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 定义不需要执行脚本的网站列表
    const blacklistedSites = ['bilibili.com', 'youtube.com', 'douyin.com'];

    // 获取当前网站的域名
    const hostname = window.location.hostname;

    // 检查当前网站是否在黑名单中
    if (blacklistedSites.some(site => hostname.includes(site))) {
        return; // 如果在黑名单中，则终止脚本
    }

    const scrollRatio = 0.7;

    // 添加全局键盘事件监听器
    document.addEventListener('keydown', function (e) {
        // 检查是否在输入元素中
        const inInput = (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable);

        if (!inInput) {
            if (e.code === 'Space') {
                // 使用无动画滚动覆盖CSS平滑设置
                window.scrollBy({
                    top: (e.shiftKey ? -1 : 1) * scrollRatio * window.innerHeight,
                    behavior: 'auto' // 强制无动画滚动
                });
                e.preventDefault();
            } else if (e.code === 'PageDown') {
                window.scrollBy({
                    top: scrollRatio * window.innerHeight,
                    behavior: 'auto'
                });
                e.preventDefault();
            } else if (e.code === 'PageUp') {
                window.scrollBy({
                    top: -scrollRatio * window.innerHeight,
                    behavior: 'auto'
                });
                e.preventDefault();
            }
        }
    }, false);
})();
