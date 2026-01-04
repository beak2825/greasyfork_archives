// ==UserScript==
// @name         自动刷新插件2024
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在当前浏览器标签页中开启或关闭自动刷新，并设置固定的30秒刷新时间。
// @AuThor       dlyuanone
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/499587/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E6%8F%92%E4%BB%B62024.user.js
// @updateURL https://update.greasyfork.org/scripts/499587/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E6%8F%92%E4%BB%B62024.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的 URL 作为唯一标识符
    const ORIGIN = window.location.href;
    const REFRESH_TIME = 30 * 1000; // 固定的刷新时间，30秒。如需更改时间自行修改30即可。

    // 获取当前标签页的自动刷新状态
    let autoRefreshEnabled = GM_getValue(ORIGIN);

    // 如果自动刷新状态为 undefined，则默认关闭自动刷新
    if (autoRefreshEnabled === undefined) {
        autoRefreshEnabled = false;
    }

    // 定义函数开启或关闭自动刷新
    function toggleAutoRefresh() {
        autoRefreshEnabled = !autoRefreshEnabled;
        if (autoRefreshEnabled) {
            // 开启自动刷新
            refreshTimer = setInterval(function() {
                window.location.reload();
            }, REFRESH_TIME);
            alert("Auto refresh enabled");
        } else {
            // 关闭自动刷新
            clearInterval(refreshTimer);
            refreshTimer = null;
            alert("Auto refresh disabled");
        }
        // 保存当前标签页的自动刷新状态
        GM_setValue(ORIGIN, autoRefreshEnabled);
    }

    let refreshTimer = null;

    // 如果自动刷新已经开启，则设置定时器执行自动刷新
    if (autoRefreshEnabled) {
        refreshTimer = setInterval(function() {
            window.location.reload();
        }, REFRESH_TIME);
    }

    // 监听键盘事件，按下 F9 键时切换自动刷新状态
    document.addEventListener('keydown', function(event) {
        if (event.key === 'F9') {
            toggleAutoRefresh();
        }
    });
})();