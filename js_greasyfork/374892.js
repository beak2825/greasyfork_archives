// ==UserScript==
// @name         SegmentFault回答页面自动加载评论
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Cooper
// @match        *://*.segmentfault.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/374892/SegmentFault%E5%9B%9E%E7%AD%94%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/374892/SegmentFault%E5%9B%9E%E7%AD%94%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setTimeout(() => {
        document.querySelectorAll(".comments").forEach(function (item) {
            item.click()
        })
        document.body.scrollTop = 0;
    }, 0);
})();