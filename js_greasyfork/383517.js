// ==UserScript==
// @name         干扰码清除器
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  清除网页中隐藏的干扰码，便于内容复制和阅读模式下阅读。
// @author       Mr.Po
// @match        http*://*/thread*
// @match        http*://*/forum.php*
// @match        https://*/showpaperword?action=showbook&actmode=showpaper*
// @match        https://www.lightnovel.us/cn/detail/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/383517/%E5%B9%B2%E6%89%B0%E7%A0%81%E6%B8%85%E9%99%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/383517/%E5%B9%B2%E6%89%B0%E7%A0%81%E6%B8%85%E9%99%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*jshint esversion: 8 */

    // 干扰码处理器数组
    const jammerCodeHandlers = [];

    // 普通BBS论坛 - 样式干扰码
jammerCodeHandlers.push({
    support: url => url.indexOf('thread') > -1 || url.indexOf('forum.php') > -1,
    handle: () => $('.jammer').remove()
});

// 普通BBS论坛 - 隐藏块干扰码
jammerCodeHandlers.push({
    support: url => url.indexOf('thread') > -1 || url.indexOf('forum.php') > -1,
    handle: () => $("#postlist span[style=\"display:none\"]").remove()
});

// 海棠文化小说站
jammerCodeHandlers.push({
    support: url => url.indexOf('showpaperword?action=showbook&actmode=showpaper') > -1,
    handle: () => {

        // 当此节点被插入内容时
        $("#readpagewidth").on('DOMNodeInserted', function() {

            // 移除指定节点
            $(this).find("font.OutStrRnds").remove();
        });
    }
});

// 轻之国度 小说站
jammerCodeHandlers.push({
    support: url => url.indexOf('www.lightnovel.us/cn/detail/') > -1,
    handle: () => {

        // 注册根节点拷贝事件
        document.oncopy = e => {

            let content;
            try {
                content = document.selection.createRange().text;
            } catch (t) {
                content = window.getSelection().toString();
            }

            const clipboardData = window.clipboardData || e.clipboardData;

            clipboardData.setData("Text", content);
        };
    }
});


    const url = window.location.href;
    jammerCodeHandlers.filter(it=>it.support(url)).forEach(it => it.handle());
})();