// ==UserScript==
// @name         混沌大学视频免费观看
// @namespace    https://github.com/xiaoyu2er
// @version      0.1
// @description  免费观看混沌大学视频
// @author       xiaoyu2er
// @match        *://www.hundun.cn/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36305/%E6%B7%B7%E6%B2%8C%E5%A4%A7%E5%AD%A6%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E8%A7%82%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/36305/%E6%B7%B7%E6%B2%8C%E5%A4%A7%E5%AD%A6%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E8%A7%82%E7%9C%8B.meta.js
// ==/UserScript==

(function () {

    $(document.body)
        .on('mousedown', '[allow_play]', function () {
            $(this).attr('allow_play', 1);
        });
})();
