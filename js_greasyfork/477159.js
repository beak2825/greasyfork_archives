// ==UserScript==
// @name         B站评论 - 热评标签样式
// @namespace    mscststs
// @version      0.1
// @license      ISC
// @description  修改新版视频页的评论热评标签样式
// @author       mscststs
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @require      https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=713767
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477159/B%E7%AB%99%E8%AF%84%E8%AE%BA%20-%20%E7%83%AD%E8%AF%84%E6%A0%87%E7%AD%BE%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/477159/B%E7%AB%99%E8%AF%84%E8%AE%BA%20-%20%E7%83%AD%E8%AF%84%E6%A0%87%E7%AD%BE%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    StartObserveSpan();

    async function StartObserveSpan(){
        await mscststs.wait(".comment-list .list-item .con")
        var article = document.querySelector("body");
        function setSpan() {
            var spanElements = document.querySelectorAll(".comment-list .list-item .con .reply-tags span");
            for (var i = 0; i < spanElements.length; i++) {
                var spanContent = spanElements[i];
                if(spanContent.innerHTML == "热评") {
                    spanContent.style.backgroundColor = "#FFECF1";
                    spanContent.style.color = "#FF6699";
                }
            }
        }

        var options = { 'childList': true, 'attributes':true };
        const callback = function(mutationsList, observer) {
            setSpan()
        };
        const observer = new MutationObserver(callback);
        observer.observe(article, options);
        setSpan();
    }
})();