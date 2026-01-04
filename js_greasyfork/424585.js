// ==UserScript==
// @name         bilibili.com 刷动态自动点赞
// @namespace    https://greasyfork.org/zh-CN/scripts/424585
// @version      0.3
// @icon         https://www.bilibili.com/favicon.ico
// @description  等待动态页面加载好后，自动为第一页的所有动态点赞 (电脑端使用)
// @author       acbetter
// @match        https://t.bilibili.com/
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424585/bilibilicom%20%E5%88%B7%E5%8A%A8%E6%80%81%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/424585/bilibilicom%20%E5%88%B7%E5%8A%A8%E6%80%81%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

/* global $ */

dianzan();

function dianzan() {
    $(".custom-like-icon.zan").filter(
        function() {
            return( this.className.split(/\s+/).length == 2 );
        }
    ).first().trigger('click');
    setTimeout(dianzan, 5000);
}