// ==UserScript==
// @name         去除部分漫画网站下拉式阅读边框和页标
// @namespace    ai977313677@163.com
// @version      0.1
// @description  去除漫画楼等漫画网站下拉式阅读烦人的图片边框和页标
// @author       ai
// @match        *://www.manhualou.com/manhua/*
// @match        *://www.manhuaniu.com/manhua/*
// @match        *://www.gufengmh.com/manhua/*
// @match        *://www.1kkk.com/ch1*
// @match        *://www.36mh.com/manhua/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395184/%E5%8E%BB%E9%99%A4%E9%83%A8%E5%88%86%E6%BC%AB%E7%94%BB%E7%BD%91%E7%AB%99%E4%B8%8B%E6%8B%89%E5%BC%8F%E9%98%85%E8%AF%BB%E8%BE%B9%E6%A1%86%E5%92%8C%E9%A1%B5%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/395184/%E5%8E%BB%E9%99%A4%E9%83%A8%E5%88%86%E6%BC%AB%E7%94%BB%E7%BD%91%E7%AB%99%E4%B8%8B%E6%8B%89%E5%BC%8F%E9%98%85%E8%AF%BB%E8%BE%B9%E6%A1%86%E5%92%8C%E9%A1%B5%E6%A0%87.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.onload = setInterval(() => {
        let dom = document.getElementsByClassName("img_info");
        while (dom.length > 0) dom[0].remove();
        let dom1 = document.getElementsByTagName("img");
        for (let i = 0; i < dom1.length; i++) dom1[i].style.border = "none";
    }, 1000);
    window.onscroll = () => {
        let dom = document.getElementsByClassName("img_info");
        while (dom.length > 0) dom[0].remove();
        let dom1 = document.getElementsByTagName("img");
        for (let i = 0; i < dom1.length; i++) {
            dom1[i].style.border = "none";
            // dom1[i].width = "500";
        }
    }
    window.unload = () => {
        clearInterval();
    }
})();
