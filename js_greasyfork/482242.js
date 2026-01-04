// ==UserScript==
// @name         禁止 Leetcode 跳转中文站 2024
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  通过屏蔽英文版 Leetcode 中相关的中文站资源加载，从而禁止其自动跳转中文站点，并同时屏蔽中文站提示广告。
// @author       Citron
// @license      MIT
// @match        https://leetcode.com/*
// @grant        GM_webRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/482242/%E7%A6%81%E6%AD%A2%20Leetcode%20%E8%B7%B3%E8%BD%AC%E4%B8%AD%E6%96%87%E7%AB%99%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/482242/%E7%A6%81%E6%AD%A2%20Leetcode%20%E8%B7%B3%E8%BD%AC%E4%B8%AD%E6%96%87%E7%AB%99%202024.meta.js
// ==/UserScript==
 
// codes below is based on @Tamce(https://greasyfork.org/users/674262) and @zgxkbtl(https://greasyfork.org/users/703747)
(function() {
    'use strict';
    GM_webRequest([
        { selector: 'https://leetcode.cn/api/is_china_ip/*', action: 'cancel' },
        { selector: 'https://assets.leetcode-cn.com/*', action: 'cancel' },
    ], function(info, message, details) {
        console.log(info, message, details);
    });
})();