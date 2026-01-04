// ==UserScript==
// @name         屏蔽哔哩哔哩相关推荐
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽哔哩哔哩视频页面的相关推荐
// @match        https://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504094/%E5%B1%8F%E8%94%BD%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B8%E5%85%B3%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/504094/%E5%B1%8F%E8%94%BD%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B8%E5%85%B3%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideRecommendations() {
        const recommendElements = [
            '#reco_list',
            '.bilibili-player-ending-panel-box-videos',
            '.r-con .rcmd-list',
            '.playlist-container .recommend-list-container',
            '.bpx-player-ending-related'
        ];

        recommendElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = 'none';
            }
        });
    }

    // 在页面加载完成后执行
    window.addEventListener('load', hideRecommendations);

    // 为了处理动态加载的内容,每隔一段时间检查并隐藏
    setInterval(hideRecommendations, 2000);
})();