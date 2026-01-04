// ==UserScript==
// @name         acfun - 移除视频暂停时的弹窗
// @namespace    http://tampermonkey.net/
// @license none
// @version      1.1
// @description  移除视频暂停时的弹窗
// @author       You
// @match        https://www.acfun.cn/v/*
// @icon         https://www.acfun.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495375/acfun%20-%20%E7%A7%BB%E9%99%A4%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C%E6%97%B6%E7%9A%84%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/495375/acfun%20-%20%E7%A7%BB%E9%99%A4%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C%E6%97%B6%E7%9A%84%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        var pauseDisplays = document.getElementsByClassName('pause-display-container');
        // 遍历并删除这些元素
        while (pauseDisplays.length > 0) {
            pauseDisplays[0].parentNode.removeChild(pauseDisplays[0]);
        }
    }, false);
})();
