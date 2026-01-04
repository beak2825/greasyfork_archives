// ==UserScript==
// @name         武汉刷新
// @connect      www.app.dawuhanapp.com
// @include      *://*.dawuhanapp.com/*
// @namespace    http://www.app.dawuhanapp.com/
// @match        *.dawuhanapp.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_download
// @version     1.0
// @author      imye
// @description 2023/4/3 15:40:52
// @license     imye
// @downloadURL https://update.greasyfork.org/scripts/463375/%E6%AD%A6%E6%B1%89%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/463375/%E6%AD%A6%E6%B1%89%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var title, time;

    config(ready);

    // 配置
    function config(callback) {
        if (!sessionStorage.oixmRefreshTime) {
            time = parseInt(prompt("请设置要自动刷新的间隔时间（秒）：", 2));
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