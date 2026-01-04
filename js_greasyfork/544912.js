// ==UserScript==
// @name         学前教育干部教师培训-休息弹窗处理
// @namespace    https://diaoqi.gitee.io/blog/
// @version      1.0
// @description  自动跳过学前教育干部教师培训平台弹出的休息弹窗，继续播放视频
// @match        https://study.enaea.edu.cn/viewerforccvideo*
// @downloadURL https://update.greasyfork.org/scripts/544912/%E5%AD%A6%E5%89%8D%E6%95%99%E8%82%B2%E5%B9%B2%E9%83%A8%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD-%E4%BC%91%E6%81%AF%E5%BC%B9%E7%AA%97%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/544912/%E5%AD%A6%E5%89%8D%E6%95%99%E8%82%B2%E5%B9%B2%E9%83%A8%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD-%E4%BC%91%E6%81%AF%E5%BC%B9%E7%AA%97%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==
(function() {
    'use strict';
    $('.xgplayer-icon-play').click()
    setInterval(() => {
        $('.dialog-button-container button').click()
        const btn = $('#J_controlToolbarBtn')
        btn.text(btn.text() === '>>' ? '' : '>>')
    }, 1000)
})();