// ==UserScript==
// @name         沈工跳跳学
// @namespace    https://diaoqi.gitee.io/blog/
// @version      0.5
// @description  自动跳过沈工学习平台弹出的休息弹窗 继续播放视频 播放页右上角按钮闪烁代表本插件正常运行
// @author       Diaoqi
// @license      MIT
// @match        https://study.enaea.edu.cn/viewerforccvideo*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477572/%E6%B2%88%E5%B7%A5%E8%B7%B3%E8%B7%B3%E5%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/477572/%E6%B2%88%E5%B7%A5%E8%B7%B3%E8%B7%B3%E5%AD%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        $('.dialog-button-container button').click()
        const btn = $('#J_controlToolbarBtn')
        btn.text(btn.text() === '>>' ? '' : '>>')
    }, 1000)
})();