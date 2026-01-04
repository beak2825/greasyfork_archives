// ==UserScript==
// @name         niconico 破解多标签限制
// @namespace    http://tampermonkey.net/
// @version      2026-01-04
// @description  破解niconico一个浏览器只能开三个视频的限制
// @author       bob
// @match        https://www.nicovideo.jp/**
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/511041/niconico%20%E7%A0%B4%E8%A7%A3%E5%A4%9A%E6%A0%87%E7%AD%BE%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/511041/niconico%20%E7%A0%B4%E8%A7%A3%E5%A4%9A%E6%A0%87%E7%AD%BE%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    const originalSetItem = localStorage.setItem;
    localStorage.removeItem('nvpc:watch:tab-sessions');
    localStorage.setItem = function(key, value) {
        if (key === 'nvpc:watch:tab-sessions') {

            return; // 禁止设置这个值
        }
        originalSetItem.call(this, key, value); // 调用原始 setItem
    };
})();