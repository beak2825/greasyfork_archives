// ==UserScript==
// @name         steam过滤无意义评论（高级）
// @namespace    妖伊社
// @version      0.1
// @description  筛选和过滤“我是傻逼”“牛子精灵”“帮X朋友口X天”等无意义评论
// @author       妖伊社
// @match        https://store.steampowered.com/app/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463952/steam%E8%BF%87%E6%BB%A4%E6%97%A0%E6%84%8F%E4%B9%89%E8%AF%84%E8%AE%BA%EF%BC%88%E9%AB%98%E7%BA%A7%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/463952/steam%E8%BF%87%E6%BB%A4%E6%97%A0%E6%84%8F%E4%B9%89%E8%AF%84%E8%AE%BA%EF%BC%88%E9%AB%98%E7%BA%A7%EF%BC%89.meta.js
// ==/UserScript==

(function() { 'use strict';

// 定义要屏蔽的关键词数组
var keywords = ["牛子精灵", "⣿"];

// 定义要屏蔽的评论区选择器
var reviewSelector = ".review_box";

// 定义一个函数来检查评论是否包含关键词
function containsKeyword(review) {
    // 遍历关键词数组
    for (var i = 0; i < keywords.length; i++)
    {
        // 获取当前关键词并转换为Unicode码点字符串，突破特殊字符限制
        var keyword = String.fromCodePoint(...keywords[i].split('').map(c => c.codePointAt(0)));
        // 创建一个正则表达式对象，使用u标志和\\p{...}类来匹配Unicode字符属性
        var regex = new RegExp("\\p{sc=Han}*"+keyword+"\\p{sc=Han}*", "u");
        // 如果评论匹配正则表达式，则返回true
        if (regex.test(review)) {
            return true;
        }
    }
    // 如果没有匹配到任何关键词，则返回false
    return false;
}

// 定义一个函数来屏蔽评论区里包含关键词的评论
function blockReviews() {
    var reviews = Array.from(document.querySelector(".review_ctn").getElementsByClassName("content"));
    // 遍历评论区数组
    for (var j = 0; j < reviews.length; j++) {
        // 获取当前评论区元素并获取其文本内容
        var review = reviews[j];
        var text = review.textContent;
        // 如果文本内容包含关键词，则隐藏该评论区元素
        if (containsKeyword(text)) {
            review.style.display = "none";
        }
    }
}

// 在页面加载完成后调用屏蔽评论函数，并设置一个定时器每隔一秒再次调用该函数以应对动态加载的内容。
window.addEventListener("load", function() {
    blockReviews();
    setInterval(blockReviews, 1000);
});
})();