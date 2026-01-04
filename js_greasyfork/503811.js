// ==UserScript==
// @name         湖南 施工现场专业人员继续教育（视频播放完后自动进入下一讲）
// @namespace    http://yourdomain.com/
// @version      1.11
// @description  自动检测并进入下一课，当长时间未加载视频，需要手动刷新。本脚本不能倍速播放。本脚由豆包AI自动生成。
// @license      MIT
// @match        *://train.hnjsrcw.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503811/%E6%B9%96%E5%8D%97%20%E6%96%BD%E5%B7%A5%E7%8E%B0%E5%9C%BA%E4%B8%93%E4%B8%9A%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%EF%BC%88%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%AE%8C%E5%90%8E%E8%87%AA%E5%8A%A8%E8%BF%9B%E5%85%A5%E4%B8%8B%E4%B8%80%E8%AE%B2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/503811/%E6%B9%96%E5%8D%97%20%E6%96%BD%E5%B7%A5%E7%8E%B0%E5%9C%BA%E4%B8%93%E4%B8%9A%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%EF%BC%88%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%AE%8C%E5%90%8E%E8%87%AA%E5%8A%A8%E8%BF%9B%E5%85%A5%E4%B8%8B%E4%B8%80%E8%AE%B2%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkDivVisibility() {
        const divNextWareLink = document.getElementById('divNextWareLink');
        if (divNextWareLink && window.getComputedStyle(divNextWareLink).display!== 'none') {
            const hyNextWareLink = document.getElementById('hyNextWareLink');
            if (hyNextWareLink) {
                hyNextWareLink.click();
            }
        }
    }

    // 每隔一段时间检查一次
    setInterval(checkDivVisibility, 30000); // 每隔 30 秒检查一次，可根据需要调整时间间隔
})();