// ==UserScript==
// @name         网页自动刷新
// @namespace    http://yjsbm.sdx.js.cn/
// @version      1.0
// @description  每隔一段时间自动刷新页面，可自定义刷新间隔时间
// @author       supertdd
// @license      MIT
// @include      http://yjsbm.sdx.js.cn/*
// @match        http://yjsbm.sdx.js.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462373/%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/462373/%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
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