// ==UserScript==
// @name         URL 参数添加器
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  在特定URL后添加参数 model=gpt-4-gizmo
// @author       You
// @match        https://chat*.zhile.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480016/URL%20%E5%8F%82%E6%95%B0%E6%B7%BB%E5%8A%A0%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/480016/URL%20%E5%8F%82%E6%95%B0%E6%B7%BB%E5%8A%A0%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的 URL
    var url = new URL(window.location.href);

    // 检查 URL 是否符合特定格式并且参数 model 不存在
    if (url.searchParams.get('v') === '2' && !url.searchParams.has('model')) {
        // 添加参数
        url.searchParams.set('model', 'gpt-4-gizmo');

        // 重定向到新的 URL
        window.location.href = url.href;
    }
})();
