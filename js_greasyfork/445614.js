// ==UserScript==
// @name       自用挂机
// @version      1.2
// @description  练习
// @author       cana
// @match        *://loveklein.com/*
// @match        *://kleinlove.com/*
// @match        *://loveklein.life/*
// @match        *://kleinlove.life/*
// @match        *://loveklein.xyz/*
// @match        *://kleinlove.xyz/*
// @match        *://loveklein.fun/*
// @match        *://kleinlove.fun/*

// @grant        none
// @namespace https://greasyfork.org/zh-CN/users/919030
// @downloadURL https://update.greasyfork.org/scripts/445614/%E8%87%AA%E7%94%A8%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/445614/%E8%87%AA%E7%94%A8%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var title, time;

    config(ready);

    // 配置
    function config(callback) {
        sessionStorage.oixmRefreshTime=605 //添加行，赋值刷新时间为10分钟，阻止弹出设置窗口
        if (!sessionStorage.oixmRefreshTime) {
            time = parseInt(prompt("请设置要自动刷新的间隔时间（秒）：", 605));
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

            //自动签到
    if(document.querySelector('a[href*="plugin.php?id=study_daily_attendance:daily_attendance"]')){
    ajaxget(document.querySelector('a[href*="plugin.php?id=study_daily_attendance:daily_attendance"]').href);
	document.querySelector('a[href*="plugin.php?id=study_daily_attendance:daily_attendance"] + .pipe').remove();
    document.querySelector('a[href*="plugin.php?id=study_daily_attendance:daily_attendance"]').remove();

    config(ready);
        }

})();

