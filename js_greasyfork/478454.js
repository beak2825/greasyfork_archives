// ==UserScript==
// @name         B站评论 - 关键词链接清除
// @namespace    mscststs
// @version      0.6
// @license      ISC
// @description  清除评论中的关键词链接
// @author       mscststs
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://space.bilibili.com/*/dynamic
// @icon         https://www.bilibili.com/favicon.ico
// @require      https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=713767
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478454/B%E7%AB%99%E8%AF%84%E8%AE%BA%20-%20%E5%85%B3%E9%94%AE%E8%AF%8D%E9%93%BE%E6%8E%A5%E6%B8%85%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/478454/B%E7%AB%99%E8%AF%84%E8%AE%BA%20-%20%E5%85%B3%E9%94%AE%E8%AF%8D%E9%93%BE%E6%8E%A5%E6%B8%85%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    StartObserveSpan();
    async function StartObserveSpan(){

        //await mscststs.wait(".comment-list .list-item .con .text");//旧版
        await mscststs.wait(".reply-content-container .reply-content");//新版
        function setText() {
            //var spanElements = document.querySelectorAll(".comment-list .list-item .con .text");//旧版
            var spanElements = document.querySelectorAll(".reply-content-container .reply-content");//新版
            for (var i = 0; i < spanElements.length; i++) {
                var oldStr = spanElements[i].innerHTML;
                //var regex = /<a class="underline-link comment-jump-url"[^>]*>|<\/a><i class="underline jump-img"[^>]*><\/i>/ig;//旧版
                var regex = /<a class="jump-link search-word"[^>]*>|<\/a><i class="icon search-word"[^>]*><\/i>/ig;//新版
                var newStr = oldStr.replaceAll(regex,"");
                if(oldStr != newStr) {
                    spanElements[i].innerHTML = newStr;
                }
            }
        }
        var article = document.querySelector("body");
        var options = { 'childList': true, 'attributes':true };
        const callback = function(mutationsList, observer) {
            setText()
        };
        const observer = new MutationObserver(callback);
        observer.observe(article, options);
        setText();
        window.setInterval(setText, 1000);

    }

})();