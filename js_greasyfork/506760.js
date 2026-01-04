// ==UserScript==
// @name         刷课支持鼠标移出
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  仅阻止 window 上添加 mouseout 事件监听器，并只在 *.chaoxing.com 生效
// @author       你的名字
// @match        *://*.chaoxing.com/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/506760/%E5%88%B7%E8%AF%BE%E6%94%AF%E6%8C%81%E9%BC%A0%E6%A0%87%E7%A7%BB%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/506760/%E5%88%B7%E8%AF%BE%E6%94%AF%E6%8C%81%E9%BC%A0%E6%A0%87%E7%A7%BB%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 保存原始的 addEventListener 方法
    const originalAddEventListener = window.addEventListener;

    // 重写 window 的 addEventListener 方法
    window.addEventListener = function(type, listener, options) {
        if (type === 'mouseout') {
            console.log('阻止了 window 上的 mouseout 事件监听器');
            return;
        }
        // 调用原始的 addEventListener 方法
        return originalAddEventListener.call(this, type, listener, options);
    };

})();
