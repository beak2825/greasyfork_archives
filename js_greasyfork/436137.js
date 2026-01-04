// ==UserScript==
// @name         Leetcode 切换中文站点
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Leetcode 切换为中文站点
// @author       You
// @match        https://leetcode.com/*
// @icon         https://www.google.com/s2/favicons?domain=leetcode-cn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436137/Leetcode%20%E5%88%87%E6%8D%A2%E4%B8%AD%E6%96%87%E7%AB%99%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/436137/Leetcode%20%E5%88%87%E6%8D%A2%E4%B8%AD%E6%96%87%E7%AB%99%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var reg = /.leetcode\.com/;
    var str = window.location.href;
    if (reg.test(window.location.href) &&
        confirm('是否将语言切换为中文')) {
        str = str.replace('leetcode', 'leetcode-cn');
        window.location.href = str;
    }
})();