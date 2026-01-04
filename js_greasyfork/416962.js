// ==UserScript==
// @name         b站助手|热门置顶
// @namespace    http://tampermonkey.net/
// @version      0.30
// @description  热门冒泡
// @author       海绵宝宝
// @match        https://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416962/b%E7%AB%99%E5%8A%A9%E6%89%8B%7C%E7%83%AD%E9%97%A8%E7%BD%AE%E9%A1%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/416962/b%E7%AB%99%E5%8A%A9%E6%89%8B%7C%E7%83%AD%E9%97%A8%E7%BD%AE%E9%A1%B6.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log("test");
    if(location.pathname == "/"){
        var node = document.querySelector("#primaryPageTab>ul>li:nth-last-child(1)").cloneNode(true);
        if(node!=null && undefined!=node){
            node.querySelector("a").href = "https://www.bilibili.com/v/popular/rank/all";
            node.querySelector("a>span").innerText = "排行榜";
            document.querySelector("#primaryPageTab>ul").append(node);
        }
    }
})();