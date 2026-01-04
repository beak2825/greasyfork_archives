// ==UserScript==
// @name         在题目列表和题单界面显示洛谷进度条溢出部分
// @namespace    https://www.luogu.com.cn/user/576074
// @version      1.0
// @description  RT
// @license      WTFPL
// @author       123asdf123
// @match        *://www.luogu.com.cn/problem/*
// @match        *://www.luogu.com.cn/training/*
// @icon         https://asdf123asdf123asdf123.github.io/luogu out.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532908/%E5%9C%A8%E9%A2%98%E7%9B%AE%E5%88%97%E8%A1%A8%E5%92%8C%E9%A2%98%E5%8D%95%E7%95%8C%E9%9D%A2%E6%98%BE%E7%A4%BA%E6%B4%9B%E8%B0%B7%E8%BF%9B%E5%BA%A6%E6%9D%A1%E6%BA%A2%E5%87%BA%E9%83%A8%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/532908/%E5%9C%A8%E9%A2%98%E7%9B%AE%E5%88%97%E8%A1%A8%E5%92%8C%E9%A2%98%E5%8D%95%E7%95%8C%E9%9D%A2%E6%98%BE%E7%A4%BA%E6%B4%9B%E8%B0%B7%E8%BF%9B%E5%BA%A6%E6%9D%A1%E6%BA%A2%E5%87%BA%E9%83%A8%E5%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var x=document.createElement('style');
    x.innerText=".progress-frame,.card.padding-default,.card.padding-default>*[data-v-beeebc6e]{overflow:visible!important}";
    document.head.appendChild(x);
})();