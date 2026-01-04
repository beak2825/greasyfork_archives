// ==UserScript==
// @name         b站助手|热门置顶|排行榜放到主页
// @namespace    http://tampermonkey.net/
// @version      0.30
// @description  热门冒泡
// @author       海绵宝宝
// @match        https://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417865/b%E7%AB%99%E5%8A%A9%E6%89%8B%7C%E7%83%AD%E9%97%A8%E7%BD%AE%E9%A1%B6%7C%E6%8E%92%E8%A1%8C%E6%A6%9C%E6%94%BE%E5%88%B0%E4%B8%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/417865/b%E7%AB%99%E5%8A%A9%E6%89%8B%7C%E7%83%AD%E9%97%A8%E7%BD%AE%E9%A1%B6%7C%E6%8E%92%E8%A1%8C%E6%A6%9C%E6%94%BE%E5%88%B0%E4%B8%BB%E9%A1%B5.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log("test");
    var li = document.querySelector("#primaryPageTab>ul>li:nth-last-child(1)")
    if(li){
        var node = li.cloneNode(true);
        if(node!=null && undefined!=node){
            node.querySelector("a").href = "https://www.bilibili.com/v/popular/rank/all";
            node.querySelector("a>span").innerText = "排行榜";
            document.querySelector("#primaryPageTab>ul").append(node);
        }
    }

})();