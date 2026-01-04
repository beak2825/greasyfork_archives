// ==UserScript==
// @name         B站蓝色大会员
// @icon         https://www.bilibili.com/favicon.ico
// @namespace    https://greasyfork.org/zh-CN/scripts/430283
// @version      0.3
// @description  让B站个人主页的大会员变成蓝色的，有隐藏技能：默认变成大会员，详情见影片，让大家一键过瘾！！！哈哈！！！
// @author       prayjourney
// @match        https://space.bilibili.com/*
// @grant        no
// @supportURL   https://www.bilibili.com/video/BV1L64y1s7tR
// @homepageURL  https://gitee.com/zuiguangyin123/bilibili-doc/blob/master/myscript/b_bluemember.js
// @downloadURL https://update.greasyfork.org/scripts/430283/B%E7%AB%99%E8%93%9D%E8%89%B2%E5%A4%A7%E4%BC%9A%E5%91%98.user.js
// @updateURL https://update.greasyfork.org/scripts/430283/B%E7%AB%99%E8%93%9D%E8%89%B2%E5%A4%A7%E4%BC%9A%E5%91%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        let param = document.getElementById('h-gender');
        // 获取相邻的子元素a标签
        let alevel =param.nextElementSibling;
        let bigMember =alevel.nextElementSibling;
        // 设置属性完成修改
        bigMember.setAttribute('style', 'color: rgb(255, 255, 255); background-color: rgb(2, 218, 247);')
    }
})();