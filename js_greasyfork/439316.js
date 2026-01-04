// ==UserScript==
// @name         B站全自动点赞动态脚本
// @namespace    https://github.com/lqmoe/bilibili
// @version      0.4
// @description  全自动点赞B站动态
// @author       绫浅
// @icon         https://static.hdslb.com/images/favicon.ico
// @match        https://t.bilibili.com/?spm_id_from=*
// @match        https://t.bilibili.com/?tab=*
// @match        https://t.bilibili.com/
// @grant        none
// @run-at       document-start
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/439316/B%E7%AB%99%E5%85%A8%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E5%8A%A8%E6%80%81%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/439316/B%E7%AB%99%E5%85%A8%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E5%8A%A8%E6%80%81%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

/* global $ */

dianzan();
function dianzan() {
    $(".custom-like-icon.zan").filter(
        function() {
            return( this.className.split(/\s+/).length == 2 );
        }
    ).first().trigger('click');
    setTimeout(dianzan, 1000);//点赞间隔时间，以毫秒为单位
}

shuaxin();
function shuaxin() {
    let time=30000;//刷新界面间隔时间，以毫秒为单位
    setTimeout(() => {
        location.reload()
    },time);
}