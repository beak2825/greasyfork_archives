// ==UserScript==
// @name         屏蔽知乎使用adblock后页面顶部出现的横幅
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  try to take over the world!
// @author       You
// @match        https://www.zhihu.com/*
// @match        http://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @match        http://zhuanlan.zhihu.com/*
// @match        *://*.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30999/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E4%BD%BF%E7%94%A8adblock%E5%90%8E%E9%A1%B5%E9%9D%A2%E9%A1%B6%E9%83%A8%E5%87%BA%E7%8E%B0%E7%9A%84%E6%A8%AA%E5%B9%85.user.js
// @updateURL https://update.greasyfork.org/scripts/30999/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E4%BD%BF%E7%94%A8adblock%E5%90%8E%E9%A1%B5%E9%9D%A2%E9%A1%B6%E9%83%A8%E5%87%BA%E7%8E%B0%E7%9A%84%E6%A8%AA%E5%B9%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
var AdblockBanner=document.getElementsByClassName("AdblockBanner")[0];
    AdblockBanner.style.display="none";
    // Your code here...
})();