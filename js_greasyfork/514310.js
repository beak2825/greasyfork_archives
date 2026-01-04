// ==UserScript==
// @name         自动刷新页面（10分钟自动刷新）
// @namespace    http://oixm.cn/
// @version      1.1
// @description  每隔一段时间自动刷新页面，可自定义刷新间隔时间，适合挂机、PT 等需要保持心跳的网页
// @author       dragenxp
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514310/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2%EF%BC%8810%E5%88%86%E9%92%9F%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/514310/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2%EF%BC%8810%E5%88%86%E9%92%9F%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var title, time;

    // 默认设置自动刷新时间为600秒
    time = 600;
    sessionStorage.oixmRefreshTime = time;

    // Ready
    function ready() {
        title = document.title;
        loop();
    }

    // 循环时间
    function loop() {
        document.title = "[" + formatTime(time) + "] " + title;
        if (time === 0) {
            location.reload();
            return;
        }
        time--;
        setTimeout(loop, 1000);
    }

    // 格式化时间
    function formatTime(t) {
        if (isNaN(t)) return "";
        var s = "";
        var h = parseInt(t / 3600);
        s += (pad(h) + ":");
        t -= (3600 * h);
        var m = parseInt(t / 60);
        s += (pad(m) + ":");
        t -= (60 * m);
        s += pad(t);
        return s;
    }

    // 补零
    function pad(n) {
        return ("00" + n).slice(-2);
    }

    // 初始化
    ready();

})();