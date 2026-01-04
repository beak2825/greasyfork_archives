// ==UserScript==
// @name         B站秒升6级
// @icon         https://www.bilibili.com/favicon.ico
// @namespace    https://greasyfork.org/zh-CN/scripts/430282
// @version      0.6
// @description  让B站个人主页的等级，秒升LV6，让大家一键过瘾！！！哈哈！！！
// @author       prayjourney
// @match        https://space.bilibili.com/*
// @grant        no
// @supportURL   https://www.bilibili.com/video/BV1aq4y1p7b3/
// @homepageURL  https://gitee.com/zuiguangyin123/bilibili-doc/blob/master/myscript/b_lv6.js
// @downloadURL https://update.greasyfork.org/scripts/430282/B%E7%AB%99%E7%A7%92%E5%8D%876%E7%BA%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/430282/B%E7%AB%99%E7%A7%92%E5%8D%876%E7%BA%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        console.log('升级的同时，麻烦点浏览一下https://www.bilibili.com/video/BV1aq4y1p7b3/，麻烦一键三连支持一下哈');
        let param = document.getElementById('h-gender');
        // 获取相邻的子元素a标签
        let alevel =param.nextElementSibling;
        // 设置属性完成修改
        alevel.setAttribute("lvl","6");
    }
})();