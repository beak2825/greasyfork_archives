// ==UserScript==
// @name         小红书取消滑块验证
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  主要用于国外访问小红书
// @author       Dylan Jiang
// @match        https://www.xiaohongshu.com/explore
// @icon         https://www.eternityx.com/wp-content/uploads/2022/04/Xiaohongshu-%E5%B0%8F%E7%BA%A2%E4%B9%A6-Logo.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511645/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%8F%96%E6%B6%88%E6%BB%91%E5%9D%97%E9%AA%8C%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/511645/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%8F%96%E6%B6%88%E6%BB%91%E5%9D%97%E9%AA%8C%E8%AF%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.cookie = "webId=xxx123; domain=.xiaohongshu.com; path=/";
})();