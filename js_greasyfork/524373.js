// ==UserScript==
// @name         删除Google赞助者广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动隐藏Google搜索界面的赞助者广告
// @author       SnowTick
// @match        https://www.google.com/search?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524373/%E5%88%A0%E9%99%A4Google%E8%B5%9E%E5%8A%A9%E8%80%85%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/524373/%E5%88%A0%E9%99%A4Google%E8%B5%9E%E5%8A%A9%E8%80%85%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 创建一个 MutationObserver 实例
    const observer = new MutationObserver(() => {
        GM_addStyle(`
            .vdQmEd.fP1Qef.xpd.EtOod.pkphOe {
                display: none !important; /* 隐藏元素 */
            }
        `);
    });

    // 配置 Observer 监听页面的所有变化
    observer.observe(document.body, {
        childList: true, // 监听子元素的变化
        subtree: true // 监听整个 DOM 树的变化
    });
})();