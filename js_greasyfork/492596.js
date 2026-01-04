// ==UserScript==
// @name         移除虎牙直播广告
// @namespace    https://codewithtu.cn/
// @version      1.0
// @description  观看直播时移除直播广告
// @author       RMC
// @match        https://www.huya.com/* 
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492596/%E7%A7%BB%E9%99%A4%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/492596/%E7%A7%BB%E9%99%A4%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查 DOM 是否存在
    function checkDOM() {
        var targetElement = jQuery('#J_roomSideTop'); // 替换为你的目标 DOM 选择器
        if (targetElement.length > 0) {
            targetElement.remove();

        }
        var targetElement2 = jQuery('#J_roomGgTop'); // 替换为你的目标 DOM 选择器
        if (targetElement2.length > 0) {
            targetElement2.remove();
        }
        var ad = jQuery('.ab-banner');
        if(ad.length>0){
            ad.remove()
        }
        var business = jQuery(".room-business-game");
        if(business.length>0){
            business.remove()
        }

        jQuery(".ps_close,.J_close").trigger("click");

    }

    // 定时检查 DOM
    setInterval(checkDOM, 1000); // 替换为你想要的检查间隔时间（以毫秒为单位）
})();