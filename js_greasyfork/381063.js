// ==UserScript==
// @name         完全隐藏BiliBili黑名单用户评论
// @description  隐藏BiliBili黑名单用户在评论区中显示的“由于黑名单设置，该评论已被隐藏。”
// @namespace    starry
// @version      1.0
// @author       starry
// @match        *://www.bilibili.com/*
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/381063/%E5%AE%8C%E5%85%A8%E9%9A%90%E8%97%8FBiliBili%E9%BB%91%E5%90%8D%E5%8D%95%E7%94%A8%E6%88%B7%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/381063/%E5%AE%8C%E5%85%A8%E9%9A%90%E8%97%8FBiliBili%E9%BB%91%E5%90%8D%E5%8D%95%E7%94%A8%E6%88%B7%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var biliObserver = new MutationObserver(check);
        var options = {
            'childList': true,
            'subtree': true
        };
        biliObserver.observe(document.body, options);
    function check() {
        if (document.getElementsByClassName("comment-list")){
            clearComment();
        }
    }
    function clearComment() {
        var comment = document.getElementsByClassName("blacklist-font-color");
        if (comment) {
            for (var i = 0; i < comment.length; i++) {
                //判断是否是评论中的回复
                if (comment[i].nodeName == "SPAN") {
                    comment[i].parentNode.parentNode.parentNode.style.display = "none";
                }
                comment[i].parentNode.parentNode.style.display = "none";
            }
        }
    }
})();