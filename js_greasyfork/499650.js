// ==UserScript==
// @name         Bangumi动画单集评论区关键词屏蔽
// @namespace    bgm@B.A.D
// @version      1.0
// @create       2022-01-18
// @lastmodified 2024-07-04
// @icon         https://bgm.tv/img/favicon.ico
// @description  动画单集评论区中屏蔽带关键词的楼层、楼中楼及它的回复
// @author       icesword95、国见佐彩
// @license      MIT
// @match        *bgm.tv/ep/*
// @match        *bangumi.tv/ep/*
// @match        *chii.in/ep/*
// @downloadURL https://update.greasyfork.org/scripts/499650/Bangumi%E5%8A%A8%E7%94%BB%E5%8D%95%E9%9B%86%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/499650/Bangumi%E5%8A%A8%E7%94%BB%E5%8D%95%E9%9B%86%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var keywords = ['原作', '奶龙', '改'];

    function containsKeyword(text) {
        for (var j = 0; j < keywords.length; j++) {
            if (text.indexOf(keywords[j]) >= 0) {
                return true;
            }
        }
        return false;
    }

    var commentList = document.getElementById('comment_list');
    if (!commentList) return;

    var topLevelComments = commentList.querySelectorAll('.row_reply');
    topLevelComments.forEach(function(comment) {
        var mainContent = comment.querySelector('.message.clearit');
        if (mainContent && containsKeyword(mainContent.innerText)) {
            comment.remove();
            return;
        }

        var subReplies = comment.querySelectorAll('.sub_reply_bg.clearit');
        subReplies.forEach(function(reply) {
            var subContent = reply.querySelector('.cmt_sub_content');
            if (subContent && containsKeyword(subContent.innerText)) {
                reply.remove();
            }
        });
    });
})();