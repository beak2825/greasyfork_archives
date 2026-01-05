// ==UserScript==
// @name				淘宝自动按销量
// @version				0.5
// @description			在淘宝搜索商品时自动选择按销量排名显示搜索结果（如果页面显示：筛选条件加的太多啦，未找到与“某某”相关宝贝，表示搜索的关键字被淘宝列为黑名单或者搜索的关键字在淘宝的数据库里没数据）
// @author				LisonFan
// @match				https://s.taobao.com/*
// @grant				none
// @icon				https://www.taobao.com/favicon.ico
// @namespace 			https://lisonfan.com/
// @downloadURL https://update.greasyfork.org/scripts/20326/%E6%B7%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E6%8C%89%E9%94%80%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/20326/%E6%B7%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E6%8C%89%E9%94%80%E9%87%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var href = location.href;
    if (href.indexOf("&sort=sale-desc") < 0){
        href += "&sort=sale-desc";
        location.href = href;
    }
})();