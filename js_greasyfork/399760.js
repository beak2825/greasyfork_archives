// ==UserScript==
// @name         bilibili全自动取关
// @namespace    https://space.bilibili.com/
// @version      1.2
// @description  在space.bilibili每隔一段时间刷新页面，并点击取消关注
// @author       BearLi
// @include      https://space.bilibili.com/*/fans/*
// @match        https://space.bilibili.com/*/fans/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399760/bilibili%E5%85%A8%E8%87%AA%E5%8A%A8%E5%8F%96%E5%85%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/399760/bilibili%E5%85%A8%E8%87%AA%E5%8A%A8%E5%8F%96%E5%85%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var title, time;

    config(ready);
    // 配置
    function config(callback) {
        if (!sessionStorage.oixmRefreshTime) {
            time = parseInt(prompt("bilibili自动取关脚本开始运行...\n请输入页面刷新间隔(建议3及以上)：", 3));
            if (isNaN(time)) return;
            sessionStorage.oixmRefreshTime = time;
        } else {
            time = parseInt(sessionStorage.oixmRefreshTime);
        }
        callback();
    }

    // Ready
    function ready() {
        title = document.title;
        loop();
    }

    // 循环时间
    function loop() {
        document.title = "[" + formatTime(time) + "] " + title;
        if (time === 0) {
            $(".be-dropdown-item:contains('取消关注')").click();
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

})();