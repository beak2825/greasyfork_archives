// ==UserScript==
// @name         B站关注列表自动按最近关注排序
// @namespace    qtqz
// @version      0.2
// @description  关注列表自动按最近关注排序，避免在混乱的顺序中找不到人
// @author       qtqz
// @match        https://space.bilibili.com/*/fans/fo*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484880/B%E7%AB%99%E5%85%B3%E6%B3%A8%E5%88%97%E8%A1%A8%E8%87%AA%E5%8A%A8%E6%8C%89%E6%9C%80%E8%BF%91%E5%85%B3%E6%B3%A8%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/484880/B%E7%AB%99%E5%85%B3%E6%B3%A8%E5%88%97%E8%A1%A8%E8%87%AA%E5%8A%A8%E6%8C%89%E6%9C%80%E8%BF%91%E5%85%B3%E6%B3%A8%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

//created 2022.8

(function() {
    'use strict';
        function cl(){
            $('.follow-tabs').children().eq(1).trigger('click');
            }
        var timer = setTimeout(cl, 2000);
})();