// ==UserScript==
// @name         通用视频背景播放
// @namespace    MilesTurner
// @version      1.0.0
// @description  让视频在后台也能继续播放，兼容大多数主流视频网站
// @author       Miles Turner
// @match        *://*/*
// @icon         https://www.greasyfork.org/static/icon256.png
// @license      MIT
// @homepageURL  https://greasyfork.org/zh-CN/scripts/000000
// @supportURL   https://greasyfork.org/zh-CN/scripts/000000/feedback
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535097/%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E8%83%8C%E6%99%AF%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/535097/%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E8%83%8C%E6%99%AF%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    Object.defineProperty(document, 'hidden', {
        get: function() { return false; },
        configurable: true
    });
    Object.defineProperty(document, 'visibilityState', {
        get: function() { return 'visible'; },
        configurable: true
    });
})();
