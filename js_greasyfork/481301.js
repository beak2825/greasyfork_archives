// ==UserScript==
// @name         Steam 评论过滤器
// @namespace    mopokle
// @version      2.0
// @description  移除Steam商店和Steam社区评论中与游戏无关的评论元素（领导人画像，索要点数等）
// @author       Mopokle
// @match        https://store.steampowered.com/app/*
// @match        https://steamcommunity.com/app/*/reviews*
// @grant        none
// @license      MIT
// @homepage     https://greasyfork.org/zh-CN/scripts/481301
// @downloadURL https://update.greasyfork.org/scripts/481301/Steam%20%E8%AF%84%E8%AE%BA%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/481301/Steam%20%E8%AF%84%E8%AE%BA%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 匹配的短语列表
    // 正则误匹配太多了还是暴力穷举算了
    const unwantedPhrases = ["我是傻", "口了一","帮他口了","帮她口了","领导人画像","请奖励这条评论","心中有党","这么多年都是这个价格",
                             "这里养了一","免费的赞","摸一下","牛子","牛纸","坤坤","kun kun","一个赞封","⣿⠿⠶⠙⣿⡟⠡⣴⣿⣽⣿","⣿⣧⠙⠛⠛⡭⠅⠒⠦⠭⣭",
                             "⣿⣿⣿⢛⣵⠇⡇⣿⣿⣿","⣿⣿⣿⣿⣿⣿⣿","给我点赞","涩涩的头像","想要头像","不一样，我喜欢他","牢牢把握一个中心两个基本点",
                             "色色的头像","需要点数","我要点数","steam点数","点数奖励","免费摸","赞=","点赞摸","摸赞一次","评论区那些",
                             "摸一次","给室友口了","给男朋友口了","给女朋友口了","／` ミ＿xノ","牛志节","才给我买","送礼物v50","牛牛增长",
                             "我不一样。我喜欢他","♥♥♥♥♥♥♥♥♥♥♥♥","we need chinese","我们需要中文"];

    // 检查评论是否包含不需要的短语
    function containsUnwantedText(commentElement) {
        let commentText = commentElement.textContent || commentElement.innerText;
        // 将评论文本转换为小写
        commentText = commentText.toLowerCase();
        return unwantedPhrases.some(phrase => commentText.includes(phrase.toLowerCase()));
    }

    // 移除函数
    function removeUnwantedComments() {
        // 选择 Steam 商店和社区的选择器
        const storeComments = document.querySelectorAll('.review_box');
        const communityComments = document.querySelectorAll('.apphub_Card');
        const allComments = [...storeComments, ...communityComments];

        allComments.forEach(comment => {
            if (containsUnwantedText(comment)) {
                comment.remove();
                //comment.style.border = '2px solid red'; //Debug用高亮
            }
        });
    }

    // 当 DOM 发生变化时执行回调函数
    var callback = function(mutationsList, observer) {
        for(var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                removeUnwantedComments();
            }
        }
    };

    // 创建 MutationObserver 实例以观察 DOM 变化
    var observer = new MutationObserver(callback);
    var config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    removeUnwantedComments();
})();