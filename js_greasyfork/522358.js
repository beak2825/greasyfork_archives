// ==UserScript==
// @name         小林coding全文显示
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  [小林coding](https://www.xiaolincoding.com/)全文显示文章内容
// @author       You
// @match        *://*.xiaolincoding.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaolincoding.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522358/%E5%B0%8F%E6%9E%97coding%E5%85%A8%E6%96%87%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/522358/%E5%B0%8F%E6%9E%97coding%E5%85%A8%E6%96%87%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 保存原始的 setTimeout
    const originalSetTimeout = window.setTimeout;

    // 覆盖 setTimeout
    window.setTimeout = function(callback, delay) {
        // 检查回调函数是否是 updateReadmorePlugin
        if (typeof callback === 'function' && callback.toString().includes('updateReadmorePlugin')) {
            console.log('拦截到 updateReadmorePlugin 的 setTimeout 调用');
            return; // 阻止执行
        }

        // 其他情况正常执行
        return originalSetTimeout.apply(this, arguments);
    };
})();