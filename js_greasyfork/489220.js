// ==UserScript==
// @name        雨课堂后台播放刷时长
// @namespace   http://tampermonkey.net/
// @version     0.0.1
// @description 当前版本仅解决hasFocus问题，先能够后台播放
// @author      HengY1
// @match       *://*.yuketang.cn/pro/lms/*
// @grant       none
// @license     MIT
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/489220/%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%90%8E%E5%8F%B0%E6%92%AD%E6%94%BE%E5%88%B7%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/489220/%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%90%8E%E5%8F%B0%E6%92%AD%E6%94%BE%E5%88%B7%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const originalHasFocus = document.hasFocus;
    document.hasFocus = function() {
        var originData = originalHasFocus.apply(document, arguments);
        console.log('document.hasFocus 被调用: ' + originData);
        return true; // 强制欺骗聚焦在页面
    };
})();