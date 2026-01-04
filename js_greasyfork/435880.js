// ==UserScript==
// @name         去除知乎视频推荐
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去除知乎视频的推荐
// @author       Jesse
// @match        https://www.zhihu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435880/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/435880/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    for(let ele of document.querySelectorAll(".Feed")) {
        if(ele.dataset.zaExtraModule) {
            let obj = JSON.parse(ele.dataset.zaExtraModule);
            if(obj.card.has_video === true) {
                ele.parent.remove();
                break;
            }
        }
    }
    document.querySelectorAll(".ZVideoItem").forEach(item => {
        item.parentElement.parentElement.remove();
    })
    let observer = new MutationObserver(mutationRecords => {
        //判断是不是视频回答
        for(let mutationRecord of mutationRecords ) {
            mutationRecord.addedNodes.forEach(item => {
                for(let ele of item.querySelectorAll(".Feed")) {
                    if(ele.dataset.zaExtraModule) {
                        let obj = JSON.parse(ele.dataset.zaExtraModule);
                        if(obj.card.has_video === true) {
                            item.remove();
                            break;
                        }
                    }
                }
            })
        }
        //判断是不是视频信息
        document.querySelectorAll(".ZVideoItem").forEach(item => {
            item.parentElement.parentElement.remove();
        })
    });
    observer.observe(document.querySelector(".Topstory-recommend div"), {
        childList: true,
    });
})();