// ==UserScript==
// @name        百度首页去广告
// @namespace   百度首页去广告
// @match       https://www.baidu.com/
// @grant       none
// @version     1.0
// @author      绣虎
// @description 2021/9/3 下午4:14:50
// @downloadURL https://update.greasyfork.org/scripts/432143/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/432143/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var gg1 = document.getElementById("s_wrap"); //查找到第一个广告
    gg1.style.display="none"//当场屏蔽它
    var gg2 = document.getElementById("s_menus_wrapper"); //查找到第二个广告
    gg2.style.display="none"//当场屏蔽它
    var gg2dd = document.getElementById("s_menu_gurd"); //查找到第二个广告的子广告
    gg2dd.style.background="rgb(255, 255, 255)"//改变它的颜色
    var gg2ddd = document.getElementById("s_top_wrap"); //第二个广告
    gg2ddd.style.position="initial"//改变
})(); //(function(){})() 表示该函数立即执行
