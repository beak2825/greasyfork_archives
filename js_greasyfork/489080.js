// ==UserScript==
// @name         哔哩哔哩网页版 空格键刷新首页推荐视频 换一换
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      MIT
// @description  使用空格即可刷新推荐视频!
// @author       KK
// @match        https://www.bilibili.com
// @match        https://www.bilibili.com/?*
// @icon               data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489080/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%BD%91%E9%A1%B5%E7%89%88%20%E7%A9%BA%E6%A0%BC%E9%94%AE%E5%88%B7%E6%96%B0%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91%20%E6%8D%A2%E4%B8%80%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/489080/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%BD%91%E9%A1%B5%E7%89%88%20%E7%A9%BA%E6%A0%BC%E9%94%AE%E5%88%B7%E6%96%B0%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91%20%E6%8D%A2%E4%B8%80%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.key === ' ') { // 判断按下的是否是空格键
            event.preventDefault(); // 阻止默认行为，避免触发页面滚动
            var changeBtn = document.querySelector('.change-btn'); // 获取旧版首页 换一换div
            var rollBtn = document.querySelector('.roll-btn'); // 获取新版首页 换一换div
            if (changeBtn) {
                changeBtn.click();
            }
            if (rollBtn) {
                rollBtn.click();
            }
        }
    });
})();