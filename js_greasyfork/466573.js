// ==UserScript==
// @name         爱奇艺广告自动关闭脚本
// @namespace    http://tampermonkey
// @version      1.0
// @description  自动关闭爱奇艺广告
// @match        https://www.iqiyi.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466573/%E7%88%B1%E5%A5%87%E8%89%BA%E5%B9%BF%E5%91%8A%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/466573/%E7%88%B1%E5%A5%87%E8%89%BA%E5%B9%BF%E5%91%8A%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        var closeBtn = document.querySelector('.cupid-pause-max-close-btn');
        if (closeBtn) {
            closeBtn.click();
        }
    }, 100);
})();