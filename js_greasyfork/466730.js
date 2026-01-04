// ==UserScript==
// @name         YouGet_自动刷新
// @namespace    http://www.youget.vip/
// @version      1.0
// @description  有搞头的脚本。
// @author       You
// @match        http://*/*
// @match        https://*/*
// @exclude      https://排除/*
// @icon         http://www.youget.vip/logo/ygt.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466730/YouGet_%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/466730/YouGet_%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 定义刷新时间间隔（单位：毫秒）
    const refreshInterval = 30 * 1000; // 5分钟

    // 定义计时器，每隔一定时间刷新页面
    setInterval(function() {
        location.reload();
    }, refreshInterval);





    // Your code here...
})();