// ==UserScript==
// @name       宝湾挂机
// @version      1.2
// @description  限定宝湾论坛专用每5分钟自动刷新
// @author       9588A9588
// @include        *.iopq.net*
// @grant        none
// @namespace https://greasyfork.org/users/1112424
// @downloadURL https://update.greasyfork.org/scripts/469476/%E5%AE%9D%E6%B9%BE%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/469476/%E5%AE%9D%E6%B9%BE%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var title, time;

    config(ready);

    // 配置
    function config(callback) {
        sessionStorage.oixmRefreshTime=300 //添加行，赋值刷新时间为300秒，阻止弹出设置窗口
        if (!sessionStorage.oixmRefreshTime) {
            time = parseInt(prompt("请设置要自动刷新的间隔时间（秒）：", 300));
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