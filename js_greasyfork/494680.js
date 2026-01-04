// ==UserScript==
// @name         星铁地图工具右键隐藏标点
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide element with specific class on right click and persist its state
// @author       Your name
// @match        *://*.mihoyo.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494680/%E6%98%9F%E9%93%81%E5%9C%B0%E5%9B%BE%E5%B7%A5%E5%85%B7%E5%8F%B3%E9%94%AE%E9%9A%90%E8%97%8F%E6%A0%87%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/494680/%E6%98%9F%E9%93%81%E5%9C%B0%E5%9B%BE%E5%B7%A5%E5%85%B7%E5%8F%B3%E9%94%AE%E9%9A%90%E8%97%8F%E6%A0%87%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        // 获取已保存的状态，如果存在则应用样式
        $('.mhy-game-gis-icon__is-pc').each(function(index) {
            var hidden = GM_getValue('element_' + index, false);
            if (hidden) {
                $(this).css('display', 'none');
            }
        });

        // 监听右键点击事件
        $(document).on('contextmenu', '.mhy-game-gis-icon__is-pc', function(e) {
            // 阻止默认右键菜单
            e.preventDefault();
            // 设置样式为"display: none;"
            $(this).css('display', 'none');
            // 保存状态到本地存储
            var index = $('.mhy-game-gis-icon__is-pc').index(this);
            GM_setValue('element_' + index, true);
        });
    });
})();
