// ==UserScript==
// @name 新东方雅思复制黏贴
// @namespace http://tampermonkey.net/
// @version 0.2
// @description 让新东方的选项变得可以被用户选中
// @author WangShuaiGe
// @match https://ieltscat.xdf.cn/*
// @icon https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526674/%E6%96%B0%E4%B8%9C%E6%96%B9%E9%9B%85%E6%80%9D%E5%A4%8D%E5%88%B6%E9%BB%8F%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/526674/%E6%96%B0%E4%B8%9C%E6%96%B9%E9%9B%85%E6%80%9D%E5%A4%8D%E5%88%B6%E9%BB%8F%E8%B4%B4.meta.js
// ==/UserScript==

(function(){
    'use strict';

    function handleElements() {
        const items = document.querySelectorAll(".option-item>span");
        if (items.length === 0) return;
        items.forEach(item => {
            item.style.userSelect = "text";
            item.style.cursor="text"
            item.addEventListener("mousedown", (e) => e.stopPropagation(), true);
            console.log("修改:", item);
        });

        const items1 = document.querySelectorAll(".option-item");
        items1.forEach(item => {
            item.style.padding="10px 20px"
        });

        const items2= document.querySelectorAll(".collect-btn");
        items2.forEach(item => {
            item.style.userSelect = "none"
        });
    }


    const interval = setInterval(() => {
        if (document.querySelector(".option-item")) {
            handleElements();
            clearInterval(interval);
        }
    }, 500);
})()