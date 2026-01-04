// ==UserScript==
// @name         升学e网通自动刷新（其他网站均可，但需按照提示稍稍修改）
// @namespace    https://study.ewt360.com/*
// @version      0.1
// @description  每隔一段时间自动刷新升学e网通页面，可自定义刷新间隔时间（其他网站均可，只需将“// @namespace”、“// @include”、“// @match”三栏改成你想要自动刷新的网站即可）
// @author
// @include      https://study.ewt360.com/*
// @match        https://study.ewt360.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398490/%E5%8D%87%E5%AD%A6e%E7%BD%91%E9%80%9A%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%EF%BC%88%E5%85%B6%E4%BB%96%E7%BD%91%E7%AB%99%E5%9D%87%E5%8F%AF%EF%BC%8C%E4%BD%86%E9%9C%80%E6%8C%89%E7%85%A7%E6%8F%90%E7%A4%BA%E7%A8%8D%E7%A8%8D%E4%BF%AE%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/398490/%E5%8D%87%E5%AD%A6e%E7%BD%91%E9%80%9A%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%EF%BC%88%E5%85%B6%E4%BB%96%E7%BD%91%E7%AB%99%E5%9D%87%E5%8F%AF%EF%BC%8C%E4%BD%86%E9%9C%80%E6%8C%89%E7%85%A7%E6%8F%90%E7%A4%BA%E7%A8%8D%E7%A8%8D%E4%BF%AE%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var title, time;

    config(ready);

    // 配置
    function config(callback) {
        if (!sessionStorage.oixmRefreshTime) {
            time = parseInt(prompt("请设置要自动刷新的间隔时间（秒）：", 500));
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