// ==UserScript==
// @name         关闭 LeetCode 地区切换 Banner
// @namespace    https://github.com/Blacktea0
// @version      0.2
// @description  用来关闭烦人的 LeetCode 地区切换 Banner
// @author       Blacktea0
// @match        http*://leetcode.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/402902/%E5%85%B3%E9%97%AD%20LeetCode%20%E5%9C%B0%E5%8C%BA%E5%88%87%E6%8D%A2%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/402902/%E5%85%B3%E9%97%AD%20LeetCode%20%E5%9C%B0%E5%8C%BA%E5%88%87%E6%8D%A2%20Banner.meta.js
// ==/UserScript==


(function () {
    'use strict';
    var backup = document.body.appendChild
    document.body.appendChild = function (arg) {
        if (arg.src === 'https://assets.leetcode-cn.com/lccn-resources/cn.js') {
            window.closeRegion();
            return function () { }
        }
        return backup.bind(document.body)(arg)
    }
})();
