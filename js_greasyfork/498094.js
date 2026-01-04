// ==UserScript==
// @name         Remove Bilibili Live Element
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动删除Bilibili直播页面上的特定特定元素(移除B站直播间马赛克)
// @author       佐仓
// @match        *://live.bilibili.com/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/498094/Remove%20Bilibili%20Live%20Element.user.js
// @updateURL https://update.greasyfork.org/scripts/498094/Remove%20Bilibili%20Live%20Element.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个观察器实例来监视DOM变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 查找并删除具有特定 id 的元素
            var element = document.getElementById('web-player-module-area-mask-panel');
            if (element) {
                element.remove();
                // 元素删除后可以停止观察
                observer.disconnect();
            }
        });
    });

    // 配置观察器
    const config = { childList: true, subtree: true };

    // 选择页面的根节点进行观察
    observer.observe(document.body, config);

    // 初始检查
    var initialElement = document.getElementById('web-player-module-area-mask-panel');
    if (initialElement) {
        initialElement.remove();
    }
})();
