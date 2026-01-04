// ==UserScript==
// @name         删除爱奇艺广告弹窗
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除爱奇艺网站视频暂停播放时的广告弹窗
// @author       wl
// @match        https://www.iqiyi.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393049/%E5%88%A0%E9%99%A4%E7%88%B1%E5%A5%87%E8%89%BA%E5%B9%BF%E5%91%8A%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/393049/%E5%88%A0%E9%99%A4%E7%88%B1%E5%A5%87%E8%89%BA%E5%B9%BF%E5%91%8A%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        var container = document.querySelector('[data-cupid="container"]')
        if (container) container.remove()
    }
})();