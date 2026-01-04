// ==UserScript==
// @name         今日头条 - 去广告
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  去除今日头条中广告信息
// @author       hxtgirq710@qq.com
// @match        http*://*.toutiao.com/*
// @require      https://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35757/%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1%20-%20%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/35757/%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1%20-%20%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function(){
		var selector = ".J_add,.J_qihu_ad,li[ad_show]";
        $(selector).remove();
        setInterval(function(){
            $(selector).remove();
        }, 1000);
    });
})();