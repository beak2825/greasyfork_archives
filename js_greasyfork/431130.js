// ==UserScript==
// @name         观察者网移动版去横幅
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  观察者网移动端页面去除页顶APP横幅，去除页底推荐横幅，去除。。。
// @author       3mile
// @match        http*://*.guancha.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431130/%E8%A7%82%E5%AF%9F%E8%80%85%E7%BD%91%E7%A7%BB%E5%8A%A8%E7%89%88%E5%8E%BB%E6%A8%AA%E5%B9%85.user.js
// @updateURL https://update.greasyfork.org/scripts/431130/%E8%A7%82%E5%AF%9F%E8%80%85%E7%BD%91%E7%A7%BB%E5%8A%A8%E7%89%88%E5%8E%BB%E6%A8%AA%E5%B9%85.meta.js
// ==/UserScript==

(function() {
  'use strict';
  //$(".g_swiper_container, .g_header44, .recentArticles, .g_hot, .g_latestNews").hide();
    var h1 = document.querySelectorAll('.g_header44, .g_swiper_container, .g_special, .recentArticles, .g_hot, .g_latestNews, .g_more')

    for(var i=0;i<h1.length;i++){
        h1[i].style.display = 'none'
        //h1.item(i).remove()
    }
})();