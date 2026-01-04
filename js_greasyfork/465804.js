// ==UserScript==
// @name        武汉理工大学中国语文网课刷时长
// @namespace    http://tampermonkey.net/
// @version      1.14514
// @description  武汉理工大学中国语文，设定时长一分钟自动刷中国语文网课，同时点开中国语文和学习资料界面任意诗歌，开启自动刷新模式。什么年代了还在用传统方式刷网课。
// @author       Yukikaze Sama
// @license      none
// @match       http://59.69.102.9/zgyw/*
// @icon       http://zhlgd.whut.edu.cn/tpass/comm/whut/image/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465804/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E4%B8%AD%E5%9B%BD%E8%AF%AD%E6%96%87%E7%BD%91%E8%AF%BE%E5%88%B7%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/465804/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E4%B8%AD%E5%9B%BD%E8%AF%AD%E6%96%87%E7%BD%91%E8%AF%BE%E5%88%B7%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var title, time;

    config(ready);

    // 配置
    function config(callback) {
        if (!sessionStorage.oixmRefreshTime) {
            time = parseInt(prompt("请设置要自动刷新的间隔时间（秒）：", 60));
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