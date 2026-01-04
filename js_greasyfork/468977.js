// ==UserScript==
// @name         B站哔哩哔哩右侧分P视频区域加长
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  B站右侧分P视频也太短辣
// @author       朱角
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/468977/B%E7%AB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8F%B3%E4%BE%A7%E5%88%86P%E8%A7%86%E9%A2%91%E5%8C%BA%E5%9F%9F%E5%8A%A0%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/468977/B%E7%AB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8F%B3%E4%BE%A7%E5%88%86P%E8%A7%86%E9%A2%91%E5%8C%BA%E5%9F%9F%E5%8A%A0%E9%95%BF.meta.js
// ==/UserScript==


(function () {
    'use strict';

        // 延迟执行,以免被覆盖
        setTimeout(function () {
        console.log('进入了脚本');

        var listDiv = document.querySelector(".video-sections-content-list");
        if (listDiv) {
            console.log('找到了节点');
            listDiv.style.maxHeight = '50%';
            listDiv.style.height = '500px';
        }      
    }, 1500)

})();