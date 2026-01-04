// ==UserScript==
// @name         安徽继续教育网课自动点击播放下一节
// @namespace    www.31ho.com
// @version      1.0
// @description  检测播放按键，自动点击播放
// @author       keke31h
// @match        https://3km.east-hr.com/*
// @match        http://www.jsjy.ah.cn/*
// @match        http://www.zjzx.ah.cn/*
// @grant        none
// @license      K
// @downloadURL https://update.greasyfork.org/scripts/471435/%E5%AE%89%E5%BE%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E8%AF%BE%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/471435/%E5%AE%89%E5%BE%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E8%AF%BE%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%8A%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成后执行脚本
    window.addEventListener('load', function() {
        var playButton = document.querySelector('button.play'); 

        // 如果播放按钮存在，则自动点击
        if (playButton) {
            playButton.click();
        }
    });
})();