// ==UserScript==
// @namespace    https://greasyfork.org/zh-CN/users/167084-lin-skywood
// @name         自动关闭pdawiki网页中的ip异地登陆提醒@skywoodlin
// @name:zh      自动关闭pdawiki网页中的ip异地登陆提醒@skywoodlin
// @description  close the ip_notice panel when open the page
// @match        *://*.pdawiki.com/*
// @author       skywoodlin
// @contributor  skywoodlin
// @version      1.2
// @license      LGPLv3
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/425285/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%ADpdawiki%E7%BD%91%E9%A1%B5%E4%B8%AD%E7%9A%84ip%E5%BC%82%E5%9C%B0%E7%99%BB%E9%99%86%E6%8F%90%E9%86%92%40skywoodlin.user.js
// @updateURL https://update.greasyfork.org/scripts/425285/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%ADpdawiki%E7%BD%91%E9%A1%B5%E4%B8%AD%E7%9A%84ip%E5%BC%82%E5%9C%B0%E7%99%BB%E9%99%86%E6%8F%90%E9%86%92%40skywoodlin.meta.js
// ==/UserScript==
jQuery.noConflict();
(function($) {
    'use strict';
    function removeIPNotice(){
        let $notice = $("#ip_notice");
        if($notice.length === 0) {
            return;
        }
        $notice.remove();
    }
    function removeWXBlock(){
        let $wx_block = $(".fn_wx_fixed");
        if($wx_block.length === 0) {
            return;
        }
        $wx_block.remove();
    }
    removeIPNotice();
    removeWXBlock();

    // Your code here...
})(jQuery);