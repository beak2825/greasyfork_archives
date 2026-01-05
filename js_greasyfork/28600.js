// ==UserScript==
// @name         知乎浅色床单
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28600/%E7%9F%A5%E4%B9%8E%E6%B5%85%E8%89%B2%E5%BA%8A%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/28600/%E7%9F%A5%E4%B9%8E%E6%B5%85%E8%89%B2%E5%BA%8A%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement("style");
    style.innerHTML = `a {
    color: hsl(31, 80%, 84%);
}


.zu-top {
    background: -webkit-linear-gradient(top,hsl(35, 27%, 98%),hsl(31, 26%, 85%));
    border-bottom: 1px solid hsl(31, 26%, 73%);
}


.zu-top-add-question {
    background: linear-gradient(to bottom,hsl(32, 23%, 98%),hsl(31, 23%, 89%));
    border: 1px solid hsl(31, 27%, 84%);
}


.zu-top-nav-li.current {
    background: linear-gradient(to bottom,hsl(31, 26%, 86%),hsl(31, 24%, 84%));
}

.zu-top-search-input {
    border: 1px solid hsl(31, 27%, 84%);
}


.zu-top-search-form .zu-top-search-button {
    background: linear-gradient(to bottom,hsl(32, 23%, 98%),hsl(31, 23%, 89%));
    border: 1px solid hsl(31, 27%, 84%);
}`;
    console.log("run!");
    document.getElementsByTagName('head')[0].appendChild(style);
    document.getElementById('q').placeholder = '搜索你感兴趣的床单...';
    // Your code here...
})();