// ==UserScript==
// @name         解决草榴社区(1024) 拦截去广告插件的问题
// @description  草榴社区新增对去广告插件的恶意管控。只要安装去广告插件访问草榴就会在页面显示【去广告插件屏蔽, 请等待60秒, 或将其关闭即刻恢复浏览。】【网页元素被去广告插件破坏，无法显示内容。】。其实这是草榴自己干的，故意隐藏了网页的内容。引导用户关闭去广告插件，换取广告收入。这个插件可以去掉这个管控
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       yangzhe
// @run-at       document-start
// @match       *://*.t66y.com/*
// @require     https://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402522/%E8%A7%A3%E5%86%B3%E8%8D%89%E6%A6%B4%E7%A4%BE%E5%8C%BA%281024%29%20%E6%8B%A6%E6%88%AA%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%8F%92%E4%BB%B6%E7%9A%84%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/402522/%E8%A7%A3%E5%86%B3%E8%8D%89%E6%A6%B4%E7%A4%BE%E5%8C%BA%281024%29%20%E6%8B%A6%E6%88%AA%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%8F%92%E4%BB%B6%E7%9A%84%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    addFalseDiv();
    function addFalseDiv(){
        //第一步：新增一个假的内容实体
        $('#header').append('<div class="tpc_content"></div>');
        //把新增的这个实体隐藏掉
        $('.tpc_content:eq(0)').css('display','none');
    }
})();