// ==UserScript==
// @name         禁止 Leetcode 跳转中文站
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  通过屏蔽英文版 leetcode 中文站相关的资源加载，从而禁止其自动跳转中文站点，并同时屏蔽中文站提示广告。
// @author       Tamce
// @match        https://leetcode.com/*
// @grant        none
// @webRequest [{"selector":"https://assets.leetcode-cn.com/*","action":"cancel"}]
// @downloadURL https://update.greasyfork.org/scripts/408371/%E7%A6%81%E6%AD%A2%20Leetcode%20%E8%B7%B3%E8%BD%AC%E4%B8%AD%E6%96%87%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/408371/%E7%A6%81%E6%AD%A2%20Leetcode%20%E8%B7%B3%E8%BD%AC%E4%B8%AD%E6%96%87%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
})();