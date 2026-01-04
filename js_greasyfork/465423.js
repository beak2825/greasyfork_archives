// ==UserScript==
// @name         学术自律模式
// @namespace    Block_URL
// @author       Sy03
// @version      1.00
// @description  限制访问某些网站的时间段，防止自己在工作时间上网浪费时间
// @match        *://*/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/465423/%E5%AD%A6%E6%9C%AF%E8%87%AA%E5%BE%8B%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/465423/%E5%AD%A6%E6%9C%AF%E8%87%AA%E5%BE%8B%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const ForceBlockedSites = ['youtube.com', 'twitter.com', 'reddit.com', 'zhihu.com', 'weibo.com',
        'bilibili.com', 'https://www.youtube.com', 'https://www.reddit.com',
        'https://www.bilibili.com', 'https://www.twitter.com',
        'https://www.weibo.com',
        "jable.tv", "https://www.jable.tv", "pornhub.com", "https://cn.pornhub.com/"];
    // 在这里添加您想要强制限制的网站，即使不在工作时间也会限制访问

    const startHour = 9; // 设置开始时间（24小时制）
    const endHour = 21; // 设置结束时间（24小时制）

    function check_url(str) {
        for (var i = 0; i < ForceBlockedSites.length; i++) {
            var site = ForceBlockedSites[i];
            // 用正则匹配
            var re = new RegExp(site);
            if (re.test(str)) {
                return true;
            }
        }
        return false;
    }

    function checkTime() {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, 0, 0);
        return now >= start && now < end;
    }

    function disableSite() {
        const style = document.createElement('style');
        style.innerHTML = 'html { filter: grayscale(75%); }';
        document.head.appendChild(style);
    }
    function redirect_to_google() {
        window.stop();
        window.location.href = "https://www.google.com";
    }

    function btn_confirm() {
        var access = confirm("你确定要访问该网站吗？");
        if (access) {
            var black = confirm("你是在搞学术吗？");
            if (!black) {
                disableSite();
            }
        }
        else {
            redirect_to_google();
        }
    }
    const currentHostname = window.location.origin;
    if (check_url(currentHostname) && checkTime()) {
        //window.stop();
        btn_confirm();
    }
})();