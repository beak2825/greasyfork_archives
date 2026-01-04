// ==UserScript==
// @name         b站顶部导航条固定在最上方
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  bilibili首页最上方包含搜索和历史等内容的导航条，不随着滚动消失，一直固定在上方
// @author       林狗dan
// @match        https://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430833/b%E7%AB%99%E9%A1%B6%E9%83%A8%E5%AF%BC%E8%88%AA%E6%9D%A1%E5%9B%BA%E5%AE%9A%E5%9C%A8%E6%9C%80%E4%B8%8A%E6%96%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/430833/b%E7%AB%99%E9%A1%B6%E9%83%A8%E5%AF%BC%E8%88%AA%E6%9D%A1%E5%9B%BA%E5%AE%9A%E5%9C%A8%E6%9C%80%E4%B8%8A%E6%96%B9.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    let header_father = document.querySelector("#internationalHeader");
    if(location.href != 'https://www.bilibili.com/')
        header_father.style['z-index'] = 2048;
    let header = document.querySelector("#internationalHeader > div.mini-header.m-header");
    header.style.position = 'fixed';
    header.style.top = 0;
    header.style.background = 'pink';
    header.style['z-index'] = 1024;
})();

