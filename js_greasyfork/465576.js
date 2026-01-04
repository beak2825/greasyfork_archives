// ==UserScript==
// @name         屏蔽新版微博的好友点赞过卡片
// @namespace    https://github.com/easyhard007
// @version      1.0
// @description  新版微博首页会显示好友赞过的微博，本脚本删除这些卡片。
// @author       陈奕男
// @match        https://weibo.com/*
// @icon         https://weibo.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465576/%E5%B1%8F%E8%94%BD%E6%96%B0%E7%89%88%E5%BE%AE%E5%8D%9A%E7%9A%84%E5%A5%BD%E5%8F%8B%E7%82%B9%E8%B5%9E%E8%BF%87%E5%8D%A1%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/465576/%E5%B1%8F%E8%94%BD%E6%96%B0%E7%89%88%E5%BE%AE%E5%8D%9A%E7%9A%84%E5%A5%BD%E5%8F%8B%E7%82%B9%E8%B5%9E%E8%BF%87%E5%8D%A1%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //删除点赞卡片
    var removeLikeCards = function() {
        var likeTitleList = document.querySelectorAll("span[class='title_title_1DVuO']");
        for (var i = 0; i < likeTitleList.length; i++) {
            likeTitleList[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
        }
    }
    //监听容器是否发生变化
    var cardContainers = document.querySelectorAll("div[class='Home_feed_3o7ry']");
    if (cardContainers.length>0){
        cardContainers[0].addEventListener("DOMSubtreeModified", function(){
            removeLikeCards();
        }, false);
    }

})();