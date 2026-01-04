// ==UserScript==
// @name         南科大研究生招生网和生物系通知公告优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  简化公告通知的页面，使得更加简洁。
// @author       张劲峰
// @match        https://bio.sustech.edu.cn/notice.html?*
// @match        https://bio.sustech.edu.cn/notice/detail/*
// @match        https://gs.sustech.edu.cn/
// @icon         
// @grant        unsafeWindow
// @run-at       document-end
// @license      张劲峰
// @downloadURL https://update.greasyfork.org/scripts/461757/%E5%8D%97%E7%A7%91%E5%A4%A7%E7%A0%94%E7%A9%B6%E7%94%9F%E6%8B%9B%E7%94%9F%E7%BD%91%E5%92%8C%E7%94%9F%E7%89%A9%E7%B3%BB%E9%80%9A%E7%9F%A5%E5%85%AC%E5%91%8A%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/461757/%E5%8D%97%E7%A7%91%E5%A4%A7%E7%A0%94%E7%A9%B6%E7%94%9F%E6%8B%9B%E7%94%9F%E7%BD%91%E5%92%8C%E7%94%9F%E7%89%A9%E7%B3%BB%E9%80%9A%E7%9F%A5%E5%85%AC%E5%91%8A%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //alert("aaa");
    var sub_navbar=document.querySelector(".sub-navbar");
    if (sub_navbar != null) {
        sub_navbar.style.display = 'none';}// 隐藏选择的元素

    var ban=document.querySelector(".inner-ban");
    if (ban != null) {
        ban.style.display = 'none';}// 隐藏选择的元素
    var listNews=document.querySelectorAll(".news-2.notice-dl-l");
    for (var i=0 ;i<listNews.length;i++) {
        listNews[i].removeAttribute("class");//删除div的class属性
    }

    var new_dates=document.querySelectorAll(".news-date");
    for (i=0 ;i<new_dates.length;i++) {
        new_dates[i].align="right";
    }

    setInterval(hideBar, 2000);

    function hideBar(){
        var recruit_swiper=document.querySelector(".recruit-swiper");
        if (recruit_swiper != null){
            recruit_swiper.style.display = 'none';// 隐藏选择的元素
            // 拿到父节点:
            let parent = recruit_swiper.parentElement;
            // 删除:
            parent.removeChild(recruit_swiper);
        }
        var recruit_swiper2=document.querySelector("recruit-swiper __web-inspector-hide-shortcut__");
        if (recruit_swiper2 != null){
            recruit_swiper2.style.display = 'none';// 隐藏选择的元素
             // 拿到父节点:
            let parent2 = recruit_swiper2.parentElement;
            // 删除:
            parent2.removeChild(recruit_swiper2);
        }
    }
})();