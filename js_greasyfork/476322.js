// ==UserScript==
// @name        屏蔽哔哩哔哩烦人的笔记和弹幕投票
// @name:zh-CN  屏蔽哔哩哔哩烦人的笔记和弹幕投票
// @name:zh-HK  遮罩嗶哩嗶哩煩人的筆記和彈幕投票
// @namespace    https://github.com/Huiqing998/Block-BilibiliWeb-NoteAndVote
// @author       HuiQing998
// @version      1.2-2023.10.03
// @description  我不喜欢在评论区看图片，更不喜欢视频里那些弹幕投票，不是误触把硬币送了（硬币不值钱，但是某些人不值得给硬币）就是骗弹幕还有挡视频画面，那不喜欢为何不屏蔽呢？
// @icon         https://www.bilibili.com/favicon.ico
// @license      MIT
// @match        *://*.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476322/%E5%B1%8F%E8%94%BD%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%83%A6%E4%BA%BA%E7%9A%84%E7%AC%94%E8%AE%B0%E5%92%8C%E5%BC%B9%E5%B9%95%E6%8A%95%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/476322/%E5%B1%8F%E8%94%BD%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%83%A6%E4%BA%BA%E7%9A%84%E7%AC%94%E8%AE%B0%E5%92%8C%E5%BC%B9%E5%B9%95%E6%8A%95%E7%A5%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义要屏蔽的元素的选择器
    var selectors = [
        ".image-exhibition", // 笔记（评论区图片）
        ".bilibili-player-video-popup", // 弹幕弹窗
        ".placeholder" // 搜索推荐
    ];

    // 定义要屏蔽的域名的正则表达式
    var domains = [
        /t\.bilibili\.com/, // 动态页面
        /h\.bilibili\.com/, // 旧版详细动态页面
        /space\.bilibili\.com/, // 个人动态页面
        /www\.bilibili\.com/, // 新版详细动态页面和视频播放页面
        /message\.bilibili\.com/ // 消息页面
    ];

    function checkDomain() {
        var url = window.location.href;
        for (var i = 0; i < domains.length; i++) {
            if (domains[i].test(url)) {
                return true;
            }
        }
        return false;
    }

    function hideElements() {
        for (var i = 0; i < selectors.length; i++) {
            var elements = document.querySelectorAll(selectors[i]);
            for (var j = 0; j < elements.length; j++) {
                elements[j].style.display = "none";
            }
        }
    }

    function loop() {
        if (checkDomain()) {
            hideElements();
        }
        setTimeout(loop, 100);
    }

    loop();

})();
