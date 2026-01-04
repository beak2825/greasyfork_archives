// ==UserScript==
// @name         百度默认打开我的关注
// @namespace    https://greasyfork.org/zh-CN/scripts/460005-%E7%99%BE%E5%BA%A6%E9%BB%98%E8%AE%A4%E6%89%93%E5%BC%80%E6%88%91%E7%9A%84%E5%85%B3%E6%B3%A8
// @version      0.1
// @description  百度默认打开我的关注而不是推荐
// @author       hauk
// @license      GPLv3
// @match        https://www.baidu.com
// @match        https://www.baidu.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460005/%E7%99%BE%E5%BA%A6%E9%BB%98%E8%AE%A4%E6%89%93%E5%BC%80%E6%88%91%E7%9A%84%E5%85%B3%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/460005/%E7%99%BE%E5%BA%A6%E9%BB%98%E8%AE%A4%E6%89%93%E5%BC%80%E6%88%91%E7%9A%84%E5%85%B3%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var mine = document.getElementById("s_menu_mine");
    mine && mine.click();
})();