// ==UserScript==
// @name       runningcheese tools
// @namespace   Violentmonkey Scripts
// @match       https://www.runningcheese.com/*
// @grant       none
// @version     1.0
// @author      而今迈步从头越
// @description 2024/4/8 12:00:31
// @downloadURL https://update.greasyfork.org/scripts/502398/runningcheese%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/502398/runningcheese%20tools.meta.js
// ==/UserScript==
function navTop() {
    var navTop = $('.tab-nav').offset().top; // 获取tab-nav距离顶部的距离
    $(window).scroll(function () {
        var scrollYToTop = $(window).scrollTop(); // 获取滚动条距离顶部的距离
        // 如果滚动条距离顶部的距离大于tab-nav距离顶部的距离，则设置样式使tab-nav悬浮固定在顶部
        if (scrollYToTop > navTop) {
            $('.tab-nav').css({
                'position': 'fixed',
                'top': 0,
                'left': 0,
                'width': '100%',
                'z-index': 999
            });
        } else { // 没有超过
            $('.tab-nav').css('position','static'); // 移除重置
        }
    });
}

navTop();