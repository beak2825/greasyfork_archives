// ==UserScript==
// @name        云学堂企业培训自动点击"继续学习"脚本
// @namespace   https://github.com/maou-sama-desu/yunxuetang-o2o-auto-continue-learn
// @match       http*://*.yunxuetang.cn/o2o/*
// @grant       none
// @version     3.0.0
// @author      github.com/maou-sama-desu
// @license     MIT
// @description 8/16/2024, 2:14:21 PM
// @downloadURL https://update.greasyfork.org/scripts/503822/%E4%BA%91%E5%AD%A6%E5%A0%82%E4%BC%81%E4%B8%9A%E5%9F%B9%E8%AE%AD%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%22%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0%22%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/503822/%E4%BA%91%E5%AD%A6%E5%A0%82%E4%BC%81%E4%B8%9A%E5%9F%B9%E8%AE%AD%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%22%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0%22%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict'

    setInterval(function() {
        document.getElementsByClassName("yxtf-dialog__body")[0].getElementsByClassName("yxtf-button")[0].click();
    }, 1000);

    setInterval(function() {
        document.getElementsByClassName("yxtulcdsdk-course-player__back")[0].getElementsByClassName("yxtf-button")[0].click();
    }, 1000);

})();
