// ==UserScript==
// @name         哔哩哔哩更改主题背景颜色_辉
// @version      1.1
// @description  哔哩哔哩更改背景主题颜色，看起来更加舒适
// @author       小白程序猿H
// @match        https://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @grant        none
// @namespace https://greasyfork.org/users/953193
// @downloadURL https://update.greasyfork.org/scripts/453882/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%9B%B4%E6%94%B9%E4%B8%BB%E9%A2%98%E8%83%8C%E6%99%AF%E9%A2%9C%E8%89%B2_%E8%BE%89.user.js
// @updateURL https://update.greasyfork.org/scripts/453882/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%9B%B4%E6%94%B9%E4%B8%BB%E9%A2%98%E8%83%8C%E6%99%AF%E9%A2%9C%E8%89%B2_%E8%BE%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有代码块
    let main = document.querySelector("main");
    let video = document.querySelector(".header-v3 #app");
    let video1 = document.querySelector("#header-v3");
    video.style.backgroundColor = '#564040';
    main.style.backgroundColor = '#564040';
    video1.style.backgroundColor = '#564040';


})();