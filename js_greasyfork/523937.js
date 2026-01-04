// ==UserScript==
// @name         远景自动随机回复特效（带网址判断）
// @namespace    http://bbs.pcbeta.com/
// @description  在 Discuz! 论坛打开页面时，根据网址自动判断是否回复！
// @author       改写
// @match        *://*.pcbeta.com/*
// @version      1.1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523937/%E8%BF%9C%E6%99%AF%E8%87%AA%E5%8A%A8%E9%9A%8F%E6%9C%BA%E5%9B%9E%E5%A4%8D%E7%89%B9%E6%95%88%EF%BC%88%E5%B8%A6%E7%BD%91%E5%9D%80%E5%88%A4%E6%96%AD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/523937/%E8%BF%9C%E6%99%AF%E8%87%AA%E5%8A%A8%E9%9A%8F%E6%9C%BA%E5%9B%9E%E5%A4%8D%E7%89%B9%E6%95%88%EF%BC%88%E5%B8%A6%E7%BD%91%E5%9D%80%E5%88%A4%E6%96%AD%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 定义随机回复内容数组
    const replies = [
        "十分感谢分享",
        "楼主是个好人",
        "楼主一生平安",
        "感谢楼主分享，顶贴支持",
        "好东西啊，谢谢楼主分享",
        "收藏了。谢谢楼主分享",
        "大佬辛苦了",
        "感谢楼主分享的内容！",
        "感谢分享！给你点赞！",
        "感谢分享！论坛因你更精彩！",
        "看看隐藏内容是什么！谢谢！",
        "先下载看看好不好用！",
        "楼主一生平安！好人一生平安！",
        "你说的观点我也很支持！",
        "楼主太棒了！我先下为敬！",
        "给楼主点赞，希望继续分享！",
        "感谢论坛，感谢LZ热心分享！",
        "感谢楼主分享优质内容，希望继续努力！",
        "下载试用一下，如果用着不错就给楼主顶贴！",
        "这么好的东西！感谢楼主分享！感谢论坛！",
        "希望楼主继续分享更多好用的东西！谢谢！",
        "看到楼主这么努力分享，我只能顶个贴感谢一下了！",
        "好东西，拿走了，临走顶个贴感谢一下楼主！",
        "这就非常给力了！感谢分享！",
        "厉害了！先收藏，再回复！谢谢！",
        "感谢大佬分享6！"
    ];

    // 随机选择一条回复内容
    function getRandomReply() {
        return replies[Math.floor(Math.random() * replies.length)];
    }

    // 自动填充并提交回复
    function autoReply() {
        const replyBox = document.querySelector('#fastpostmessage'); // 快速回复框
        const replyButton = document.querySelector('#fastpostsubmit'); // 快速回复提交按钮

        if (replyBox && replyButton) {
            replyBox.value = getRandomReply(); // 填充随机内容
            replyButton.click(); // 自动点击提交按钮
        }
    }

    // 判断是否为需要回复的页面
    function isReplyPage() {
        const url = window.location.href; // 获取当前页面网址
        return url.includes('viewthread') && !url.includes('forum'); // 包含 viewthread 且不包含 forum
    }

    // 等待页面加载完成后触发自动回复
    window.addEventListener('load', function () {
        if (isReplyPage()) {
            setTimeout(autoReply, 1000); // 延迟 1 秒自动回复
        }
    });
})();
