// ==UserScript==
// @name         百度搜索回到顶部
// @namespace    百度搜索回到顶部按钮
// @version      0.1
// @description  百度搜索页面右下角添加一个小火箭标志,点击后流畅的回到顶部
// @author       You
// @include      *://www.baidu.com/*
// @icon         https://z3.ax1x.com/2021/05/19/g5jDC8.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426705/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/426705/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
        let div = document.createElement('a')
        div.href = '#top'
        div.style.width = '50px'
        div.style.height = '50px'
        div.style.borderRadius = '50%'
        div.style.background = 'url("https://z3.ax1x.com/2021/05/19/g5jDC8.png") no-repeat center'
        div.style.backgroundSize = '50px 50px'
        div.style.cursor = 'pointer'
        div.style.position = 'fixed'
        div.style.right = '30px'
        div.style.bottom = '60px'
        document.body.setAttribute('id','top')
        document.getElementsByTagName('html')[0].style.scrollBehavior = 'smooth'
        document.body.style.scrollBehavior = 'smooth'
        console.log(document.body);
        document.body.appendChild(div)
    // Your code here...
})();