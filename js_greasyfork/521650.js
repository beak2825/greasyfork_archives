// ==UserScript==
// @name       综调挂机
// @version      1.0
// @description  每10分钟自动刷新
// @author       Ze
// @match        http://10.53.160.88:28796/portal/
// @grant        none
// @namespace https://greasyfork.org/users/421059
// @downloadURL https://update.greasyfork.org/scripts/521650/%E7%BB%BC%E8%B0%83%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/521650/%E7%BB%BC%E8%B0%83%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var title, time;

    config(ready);

    // 配置
    function config(callback) {
        sessionStorage.oixmRefreshTime=600 //添加行，赋值刷新时间为600秒，阻止弹出设置窗口
        if (!sessionStorage.oixmRefreshTime) {
            time = parseInt(prompt("请设置要自动刷新的间隔时间（秒）：", 600));
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