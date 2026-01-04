// ==UserScript==
// @name         Chiphell论坛入口
// @description  添加Chiphell论坛入口
// @namespace    https://greasyfork.org/zh-CN/scripts/441396
// @version      0.5
// @author       lqzh
// @copyright    lqzh
// @match      http*://www.chiphell.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441396/Chiphell%E8%AE%BA%E5%9D%9B%E5%85%A5%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/441396/Chiphell%E8%AE%BA%E5%9D%9B%E5%85%A5%E5%8F%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var n = document.querySelector("#nv li:last-child");
     !n.textContent.includes('社区') && n.insertAdjacentHTML('afterend','<li><a href="https://www.chiphell.com/forum.php">社区</a></li>');
})();