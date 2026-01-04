// ==UserScript==
// @name         B漫还原toDataURL函数
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  还原被覆盖的canvas的toDataURL函数
// @author       You
// @match        http*://manga.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394094/B%E6%BC%AB%E8%BF%98%E5%8E%9FtoDataURL%E5%87%BD%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/394094/B%E6%BC%AB%E8%BF%98%E5%8E%9FtoDataURL%E5%87%BD%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var toDataURL = HTMLCanvasElement.prototype.toDataURL
    setTimeout(() => {
        HTMLCanvasElement.prototype.toDataURL = toDataURL
    }, 0)
})();