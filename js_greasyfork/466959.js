// ==UserScript==
// @name         焱哥我来了
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  方便查看焱哥笔记
// @author       You
// @match        http://www.yangeit.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yangeit.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466959/%E7%84%B1%E5%93%A5%E6%88%91%E6%9D%A5%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/466959/%E7%84%B1%E5%93%A5%E6%88%91%E6%9D%A5%E4%BA%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
// 获取所有的tab-item元素
var tabItems = document.getElementsByClassName("tab-item");

// 遍历所有的tab-item元素并给它们添加active类
for (var i = 0; i < tabItems.length; i++) {
  tabItems[i].classList.add("active");
}
    }, 2000);
    // Your code here...
})();