// ==UserScript==
// @name         移除 itdog.cn 广告
// @version      1.0
// @description  在 itdog.cn 网站加载完成后移除广告链接
// @author       bian2022
// @match        *://*.itdog.cn/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/896131
// @downloadURL https://update.greasyfork.org/scripts/519366/%E7%A7%BB%E9%99%A4%20itdogcn%20%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/519366/%E7%A7%BB%E9%99%A4%20itdogcn%20%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 延迟 1 毫秒后执行删除广告链接
    setTimeout(function() {
        // 确保 jQuery 可用
        if (typeof $ !== 'undefined') {
            $('.gg_link').remove();
            console.log('广告链接已移除');
        } else {
            console.error('jQuery 不可用，请检查是否需要手动引入 jQuery。');
        }
    }, 1); // 延迟 1 毫秒
})();
